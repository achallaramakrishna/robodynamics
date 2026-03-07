from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class OrchestratorSession:
    session_id: str
    user_id: int
    chapter_code: str
    exercise_group: str
    state: str = "idle"
    version: int = 0
    updated_at: str = field(default_factory=_utc_now)
    context: Dict[str, Any] = field(default_factory=dict)


class TutorOrchestrator:
    ALLOWED_STATES = {"idle", "intro", "teach", "checkpoint", "practice", "feedback", "adapt"}

    def __init__(self) -> None:
        self._sessions: Dict[str, OrchestratorSession] = {}
        self._subscribers: Dict[str, List[asyncio.Queue]] = {}
        self._lock = asyncio.Lock()

    async def bootstrap(
        self,
        session_id: str,
        user_id: int,
        chapter_code: str,
        exercise_group: str,
        context: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:
        async with self._lock:
            runtime = self._sessions.get(session_id)
            if runtime is None:
                runtime = OrchestratorSession(
                    session_id=session_id,
                    user_id=user_id,
                    chapter_code=chapter_code,
                    exercise_group=exercise_group,
                    state="intro",
                    version=1,
                    updated_at=_utc_now(),
                    context=dict(context or {}),
                )
                self._sessions[session_id] = runtime
            else:
                runtime.chapter_code = chapter_code
                runtime.exercise_group = exercise_group
                runtime.context.update(context or {})
                runtime.state = "intro"
                runtime.version += 1
                runtime.updated_at = _utc_now()
            snapshot = self._snapshot(runtime)
        await self._publish(
            session_id,
            "SESSION_BOOTSTRAPPED",
            runtime.state,
            {
                "chapterCode": chapter_code,
                "exerciseGroup": exercise_group,
                **(context or {}),
            },
            runtime.version,
        )
        return snapshot

    async def state(self, session_id: str) -> Dict[str, Any]:
        runtime = self._sessions.get(session_id)
        if runtime is None:
            raise KeyError("Invalid or expired tutor session")
        return self._snapshot(runtime)

    async def command(self, session_id: str, command: str, meta: Dict[str, Any] | None = None) -> Dict[str, Any]:
        runtime = self._sessions.get(session_id)
        if runtime is None:
            raise KeyError("Invalid or expired tutor session")

        cmd = (command or "").strip().upper()
        if not cmd:
            raise ValueError("command is required")
        meta = dict(meta or {})

        next_state = self._derive_next_state(runtime.state, cmd, meta)
        if next_state not in self.ALLOWED_STATES:
            next_state = runtime.state

        if next_state != runtime.state:
            runtime.state = next_state
            runtime.version += 1
            runtime.updated_at = _utc_now()

        runtime.context.update(meta)
        snapshot = self._snapshot(runtime)
        await self._publish(
            session_id,
            f"CMD_{cmd}",
            runtime.state,
            meta,
            runtime.version,
        )
        return snapshot

    async def notify(self, session_id: str, event_type: str, meta: Dict[str, Any] | None = None) -> Dict[str, Any]:
        runtime = self._sessions.get(session_id)
        if runtime is None:
            raise KeyError("Invalid or expired tutor session")

        event_name = (event_type or "").strip().upper()
        if not event_name:
            return self._snapshot(runtime)

        state = runtime.state
        if event_name == "QUESTION_DELIVERED":
            state = "teach"
        elif event_name == "ANSWER_SUBMITTED":
            state = "feedback"
        elif event_name == "DOUBT_ASKED":
            state = "practice"

        if state != runtime.state:
            runtime.state = state
            runtime.version += 1
            runtime.updated_at = _utc_now()

        payload = dict(meta or {})
        runtime.context.update(payload)
        snapshot = self._snapshot(runtime)
        await self._publish(session_id, event_name, runtime.state, payload, runtime.version)
        return snapshot

    async def subscribe(self, session_id: str) -> asyncio.Queue:
        runtime = self._sessions.get(session_id)
        if runtime is None:
            raise KeyError("Invalid or expired tutor session")
        queue: asyncio.Queue = asyncio.Queue(maxsize=256)
        self._subscribers.setdefault(session_id, []).append(queue)
        await queue.put(
            {
                "sessionId": runtime.session_id,
                "eventType": "STATE_SNAPSHOT",
                "state": runtime.state,
                "version": runtime.version,
                "timestamp": runtime.updated_at,
                "meta": runtime.context,
            }
        )
        return queue

    async def unsubscribe(self, session_id: str, queue: asyncio.Queue) -> None:
        listeners = self._subscribers.get(session_id, [])
        if queue in listeners:
            listeners.remove(queue)
        if not listeners:
            self._subscribers.pop(session_id, None)

    def _derive_next_state(self, current: str, command: str, meta: Dict[str, Any]) -> str:
        if command == "START_LOOP":
            return "teach"
        if command == "BOARD_COMPLETE":
            return "checkpoint"
        if command == "STUDENT_RESPONSE":
            return "practice"
        if command == "ANSWER_EVALUATED":
            return "adapt"
        if command == "NEXT_QUESTION":
            return "teach"
        if command == "ASK_DOUBT":
            return "practice"
        if command == "STOP_LOOP":
            return "idle"
        if command == "SET_STATE":
            requested = str(meta.get("state", "")).strip().lower()
            if requested in self.ALLOWED_STATES:
                return requested
        return current

    async def _publish(
        self,
        session_id: str,
        event_type: str,
        state: str,
        meta: Dict[str, Any],
        version: int,
    ) -> None:
        payload = {
            "sessionId": session_id,
            "eventType": event_type,
            "state": state,
            "version": version,
            "timestamp": _utc_now(),
            "meta": meta,
        }
        listeners = list(self._subscribers.get(session_id, []))
        for queue in listeners:
            try:
                queue.put_nowait(payload)
            except asyncio.QueueFull:
                try:
                    _ = queue.get_nowait()
                except Exception:
                    pass
                try:
                    queue.put_nowait(payload)
                except Exception:
                    pass

    @staticmethod
    def _snapshot(runtime: OrchestratorSession) -> Dict[str, Any]:
        return {
            "sessionId": runtime.session_id,
            "state": runtime.state,
            "version": runtime.version,
            "updatedAt": runtime.updated_at,
            "context": dict(runtime.context),
        }

