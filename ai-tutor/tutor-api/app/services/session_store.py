from __future__ import annotations

import os
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, Optional

import httpx

from app.models import TutorEvent


@dataclass
class TutorSession:
    session_id: str
    user_id: int
    child_id: Optional[int]
    role: str
    course_id: str
    module_code: str
    grade: str
    chapter_code: str
    exercise_group: str
    attempts: int = 0
    correct_count: int = 0
    error_streak: int = 0
    doubt_count: int = 0
    total_response_ms: int = 0
    last_response_ms: int = 0
    confidence_last: str = "unknown"
    question_issued_at: str = ""
    current_question: Dict[str, Any] = field(default_factory=dict)
    # Rolling conversation history for the LLM tutoring chat.
    # Each entry: {"role": "user"|"assistant", "content": "<text>"}
    conversation_history: list = field(default_factory=list)
    started_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class SessionStore:
    def __init__(self) -> None:
        self._sessions: Dict[str, TutorSession] = {}
        self._event_url = os.getenv("ROBODYNAMICS_EVENT_URL", "").strip()
        self._event_api_key = os.getenv("ROBODYNAMICS_EVENT_API_KEY", "").strip()

    def create(
        self,
        claims: Dict[str, Any],
        course_id: str,
        module_code: str,
        grade: str,
        chapter_code: str,
        exercise_group: str,
    ) -> TutorSession:
        session = TutorSession(
            session_id=f"vm_{uuid.uuid4().hex}",
            user_id=int(claims.get("user_id")),
            child_id=claims.get("child_id"),
            role=str(claims.get("role", "PARENT")),
            course_id=course_id,
            module_code=module_code,
            grade=grade,
            chapter_code=chapter_code,
            exercise_group=exercise_group,
        )
        self._sessions[session.session_id] = session
        return session

    def get(self, session_id: str) -> TutorSession:
        session = self._sessions.get(session_id)
        if not session:
            raise KeyError("Invalid or expired tutor session")
        return session

    def set_question(self, session_id: str, question: Dict[str, Any]) -> None:
        session = self.get(session_id)
        session.current_question = question
        session.question_issued_at = datetime.now(timezone.utc).isoformat()

    def set_chapter(self, session_id: str, chapter_code: str) -> TutorSession:
        session = self.get(session_id)
        session.chapter_code = chapter_code
        session.current_question = {}
        return session

    def set_course_id(self, session_id: str, course_id: str) -> TutorSession:
        session = self.get(session_id)
        session.course_id = course_id
        session.current_question = {}
        return session

    def set_exercise_group(self, session_id: str, exercise_group: str) -> TutorSession:
        session = self.get(session_id)
        session.exercise_group = exercise_group
        session.current_question = {}
        return session

    def note_doubt(self, session_id: str) -> TutorSession:
        session = self.get(session_id)
        session.doubt_count += 1
        return session

    # ── Conversation history (for LLM chat) ──────────────────────────────────

    _MAX_HISTORY_MESSAGES = 12  # 6 turns × 2 messages each

    def add_to_conversation(self, session_id: str, role: str, content: str) -> None:
        """Append a message to the rolling conversation history, keeping at most _MAX_HISTORY_MESSAGES entries."""
        session = self.get(session_id)
        session.conversation_history.append({"role": role, "content": content})
        if len(session.conversation_history) > self._MAX_HISTORY_MESSAGES:
            # Drop oldest messages in pairs so history always starts with a user turn
            session.conversation_history = session.conversation_history[-self._MAX_HISTORY_MESSAGES:]

    def get_conversation(self, session_id: str) -> list:
        """Return the current conversation history list."""
        session = self.get(session_id)
        return list(session.conversation_history)

    def clear_conversation(self, session_id: str) -> None:
        """Reset conversation history (e.g. when student switches chapters)."""
        session = self.get(session_id)
        session.conversation_history = []

    def update_score(
        self,
        session_id: str,
        correct: bool,
        response_time_ms: int | None = None,
        confidence: str | None = None,
    ) -> TutorSession:
        session = self.get(session_id)
        session.attempts += 1
        if correct:
            session.correct_count += 1
            session.error_streak = 0
        else:
            session.error_streak += 1

        if response_time_ms is not None and response_time_ms >= 0:
            session.last_response_ms = int(response_time_ms)
            session.total_response_ms += int(response_time_ms)
        elif session.question_issued_at:
            try:
                issued = datetime.fromisoformat(session.question_issued_at)
                delta_ms = int((datetime.now(timezone.utc) - issued).total_seconds() * 1000)
                if delta_ms >= 0:
                    session.last_response_ms = delta_ms
                    session.total_response_ms += delta_ms
            except Exception:
                pass

        if confidence:
            session.confidence_last = confidence.strip().lower()
        return session

    def summary(self, session_id: str) -> Dict[str, Any]:
        session = self.get(session_id)
        accuracy = (session.correct_count * 100.0 / session.attempts) if session.attempts else 0.0
        avg_ms = (session.total_response_ms / session.attempts) if session.attempts else 0.0
        return {
            "attempts": session.attempts,
            "correctCount": session.correct_count,
            "accuracyPct": round(accuracy, 2),
            "errorStreak": session.error_streak,
            "doubtCount": session.doubt_count,
            "lastResponseMs": session.last_response_ms,
            "avgResponseMs": round(avg_ms, 2),
            "confidenceLast": session.confidence_last,
            "courseId": session.course_id,
            "chapterCode": session.chapter_code,
            "exerciseGroup": session.exercise_group,
        }

    async def send_event(self, event: TutorEvent) -> None:
        if not self._event_url:
            return
        headers = {"Content-Type": "application/json"}
        if self._event_api_key:
            headers["X-AI-TUTOR-KEY"] = self._event_api_key
        async with httpx.AsyncClient(timeout=4.5) as client:
            try:
                await client.post(self._event_url, headers=headers, json=event.model_dump())
            except Exception:
                # Event forwarding should never block tutoring flow.
                pass
