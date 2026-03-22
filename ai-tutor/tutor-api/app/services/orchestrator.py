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
    state: str = "boot"
    version: int = 0
    updated_at: str = field(default_factory=_utc_now)
    context: Dict[str, Any] = field(default_factory=dict)


class TutorOrchestrator:
    ALLOWED_STATES = {
        "boot",
        "entry",
        "coach_intro",
        "coach_demo",
        "student_turn",
        "evaluate",
        "feedback",
        "remediate",
        "review",
        "complete",
        "error",
    }

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
                    state="entry",
                    version=1,
                    updated_at=_utc_now(),
                    context=dict(context or {}),
                )
                self._sessions[session_id] = runtime
            else:
                runtime.chapter_code = chapter_code
                runtime.exercise_group = exercise_group
                runtime.context.update(context or {})
                runtime.state = "entry"
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

        payload = dict(meta or {})
        state = self._derive_state_from_event(runtime.state, event_name, payload)

        if state != runtime.state:
            runtime.state = state
            runtime.version += 1
            runtime.updated_at = _utc_now()

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
            return "coach_intro"
        if command == "BOARD_COMPLETE":
            return "student_turn"
        if command == "STUDENT_RESPONSE":
            return "evaluate"
        if command == "ANSWER_EVALUATED":
            if meta.get("completed") is True:
                return "complete"
            return "feedback" if self._is_correct_signal(meta.get("isCorrect")) else "remediate"
        if command == "NEXT_QUESTION":
            return "coach_intro"
        if command == "ASK_DOUBT":
            return "review"
        if command == "STOP_LOOP":
            if meta.get("error") or meta.get("failed"):
                return "error"
            return "complete" if meta.get("completed") else "entry"
        if command == "SET_STATE":
            requested = str(meta.get("state", "")).strip().lower()
            if requested in self.ALLOWED_STATES:
                return requested
        return current

    def _derive_state_from_event(self, current: str, event_name: str, meta: Dict[str, Any]) -> str:
        if event_name == "SESSION_BOOTSTRAPPED":
            return "entry"
        if event_name == "SESSION_STARTED":
            return "coach_intro"
        if event_name == "SESSION_RESUMED":
            return "student_turn"
        if event_name == "QUESTION_DELIVERED":
            return "coach_demo"
        if event_name == "ANSWER_SUBMITTED":
            if meta.get("livesDepleted") or meta.get("fatalError"):
                return "error"
            if meta.get("lessonCompleted") or meta.get("completed"):
                return "complete"
            return "feedback" if self._is_correct_signal(meta.get("isCorrect")) else "remediate"
        if event_name == "DOUBT_ASKED":
            return "review"
        if event_name == "CHAT_TURN":
            suggest = str(meta.get("suggestNextAction", "")).strip().lower()
            if suggest == "reteach":
                return "remediate"
            if suggest == "practice":
                return "student_turn"
            return "review"
        if event_name.endswith("ERROR") or meta.get("error") or meta.get("failed"):
            return "error"
        return current

    @staticmethod
    def _is_correct_signal(value: Any) -> bool:
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "yes", "y", "correct"}
        if isinstance(value, (int, float)):
            return bool(value)
        return False

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
