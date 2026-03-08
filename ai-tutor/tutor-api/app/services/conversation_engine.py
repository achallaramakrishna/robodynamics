"""
ConversationEngine — LLM-powered tutoring conversation.

Supports Claude (primary) and OpenAI (fallback).
Keeps the AI grounded in the current lesson/chapter context and
maintains a short rolling conversation history so the tutor
remembers what was just discussed.
"""
from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

import httpx

# ── Grade-adaptive profiles ───────────────────────────────────────────────────
_GRADE_PROFILES: dict = {
    "primary": {  # Grades 3-5
        "grades": range(3, 6),
        "language": "Use very simple words. Short sentences only. Avoid jargon completely.",
        "numbers": "Use small numbers (under 20) in your examples.",
        "encouragement": "Be very enthusiastic and celebratory — every correct step deserves praise.",
        "pace": "Go slowly, one tiny step at a time. Repeat the key idea twice.",
        "analogy_style": "Use everyday objects: sweets, fruits, fingers, toys.",
        "questions": "Ask yes/no or single-word answer check questions.",
    },
    "middle": {  # Grades 6-7
        "grades": range(6, 8),
        "language": "Use clear, friendly language. Introduce basic math vocabulary with a quick explanation.",
        "numbers": "Use numbers up to 100 comfortably in examples.",
        "encouragement": "Be warm and positive. Acknowledge effort before correcting.",
        "pace": "Moderate pace. Explain each step, then check once.",
        "analogy_style": "Use relatable scenarios: shopping, sports scores, phone battery.",
        "questions": "Ask one clear short-answer check question after each concept.",
    },
    "secondary": {  # Grades 8-9
        "grades": range(8, 10),
        "language": "Use standard math language. Students know basic algebra and number theory.",
        "numbers": "Use any numbers confidently. Multi-digit and near-base numbers are fine.",
        "encouragement": "Be confident and direct. Brief praise, then move forward.",
        "pace": "Efficient pace. Cover the concept and worked example in 2-3 sentences.",
        "analogy_style": "Connect to school curriculum: fractions, algebra, exam patterns.",
        "questions": "Ask a slightly harder follow-up that makes them apply the idea immediately.",
    },
    "senior": {  # Grade 10+
        "grades": range(10, 13),
        "language": "Use precise mathematical language. Students are exam-focused.",
        "numbers": "Large numbers and multi-step calculations are expected.",
        "encouragement": "Be concise and exam-focused. Frame everything as speed/accuracy gains.",
        "pace": "Fast. Assume they grasp quickly. Spend time on edge cases and tricks.",
        "analogy_style": "Connect to competitive exam patterns (JEE, NEET, Olympiad style).",
        "questions": "Ask exam-style questions: time the step, identify the sutra, spot the shortcut.",
    },
}


def _grade_profile(grade: str) -> dict:
    """Return the teaching profile for a given grade string."""
    try:
        g = int(grade)
    except (ValueError, TypeError):
        g = 8  # default
    for profile in _GRADE_PROFILES.values():
        if g in profile["grades"]:
            return profile
    return _GRADE_PROFILES["secondary"]  # fallback


# ── System prompt template ───────────────────────────────────────────────────
_SYSTEM_TEMPLATE = """\
You are {avatar_name}, a warm and expert Vedic Mathematics AI tutor at RoboDynamics.

TODAY'S LESSON: "{lesson_title}"
Subtopics: {subtopics}
Learning goals:
{learning_goals}

STUDENT CONTEXT:
- Grade: {grade}
- Attempts so far: {attempts}, Accuracy: {accuracy_pct}%, Error streak: {error_streak}
- Current question: {current_question}

YOUR TEACHING STYLE (Grade {grade} student):
- {lang_instruction}
- {numbers_instruction}
- {pace_instruction}
- {analogy_instruction}
- {encouragement_instruction}
- {questions_instruction}
- Never hand over the final answer — guide with hints and lead the student to the answer
- Speak as {avatar_name} — a real teacher. Never mention being an AI or a language model
- If the student asks about something unrelated, gently redirect: "Let's stay focused on today's lesson!"
- When the student is on an error streak ({error_streak}+ wrong), immediately switch to a simpler analogy and shorter steps

VEDIC MATHS TEACHING METHOD:
- Always name the Vedic Sutra (formula) being used, e.g. "By the Completion" or "All from 9, Last from 10"
- Show the mental shortcut first, then the written verification
- Praise the Vedic method over the conventional method: "See how much faster this is!"
- After explaining, always ask ONE check question to confirm understanding

CURRENT TEACHING CONTEXT: {teaching_context}
"""

# ── Fallback reply used when no LLM key is configured ───────────────────────
_FALLBACK_RESPONSES = [
    "Great question! The key is to break it down one step at a time. "
    "Look at what you already know, then identify the missing piece. "
    "Want to work through it together?",

    "Let's think about this carefully. "
    "Start by reading the problem again — what information is given? "
    "Once you spot that, the next step becomes clear.",

    "Almost there! Try re-reading the question and circle the numbers you have. "
    "Now ask yourself: what operation connects them? "
    "Give it one more go!",
]
_fallback_idx = 0


class ConversationEngine:
    """
    Wraps an LLM API (Claude or OpenAI) to provide tutoring conversation.

    Usage:
        engine = ConversationEngine()
        reply = await engine.chat(
            message="I don't understand why we add 2 here",
            history=[...],          # prior {"role":..,"content":..} turns
            avatar_name="Arya",
            lesson=lesson_dict,
            summary=session_summary_dict,
            current_question=question_dict,
        )
    """

    def __init__(self) -> None:
        self._anthropic_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
        self._openai_key = os.getenv("OPENAI_API_KEY", "").strip()
        self._chat_model = os.getenv("AI_TUTOR_CHAT_MODEL", "claude-sonnet-4-6")
        # Keep last N turns (each turn = 1 user + 1 assistant message)
        self._max_history_turns = int(os.getenv("AI_TUTOR_CHAT_HISTORY_TURNS", "6"))
        self._max_tokens = int(os.getenv("AI_TUTOR_CHAT_MAX_TOKENS", "300"))
        self._timeout = float(os.getenv("AI_TUTOR_CHAT_TIMEOUT_SEC", "15"))

    # ── Public API ────────────────────────────────────────────────────────────

    async def chat(
        self,
        message: str,
        history: List[Dict[str, str]],
        avatar_name: str,
        lesson: Dict[str, Any],
        summary: Dict[str, Any],
        current_question: Optional[Dict[str, Any]],
        teaching_context: str = "doubt resolution",
        grade: str = "8",
    ) -> str:
        """
        Generate a tutoring reply for the student's message.

        Args:
            message:          What the student just said/typed.
            history:          Prior conversation turns (Anthropic/OpenAI format).
            avatar_name:      E.g. "Arya", "Ved", "Tara", "Niva".
            lesson:           Lesson dict from engine.lesson(chapter_code).
            summary:          Session summary dict (attempts, accuracy, error_streak …).
            current_question: The question currently displayed to the student.
            teaching_context: Human-readable label, e.g. "doubt resolution" or "hint request".
            grade:            Student's grade level string, e.g. "8".

        Returns:
            Tutor reply as a plain string.
        """
        system = self._build_system_prompt(
            avatar_name, lesson, summary, current_question, teaching_context, grade
        )
        # Trim history to last N turns (2 messages per turn)
        trimmed = history[-(self._max_history_turns * 2):]

        if self._anthropic_key:
            try:
                return await self._call_anthropic(message, trimmed, system)
            except Exception:
                pass  # fall through to OpenAI

        if self._openai_key:
            try:
                return await self._call_openai(message, trimmed, system)
            except Exception:
                pass  # fall through to static fallback

        return self._fallback(lesson)

    # ── System-prompt builder ─────────────────────────────────────────────────

    def _build_system_prompt(
        self,
        avatar_name: str,
        lesson: Dict[str, Any],
        summary: Dict[str, Any],
        current_question: Optional[Dict[str, Any]],
        teaching_context: str,
        grade: str,
    ) -> str:
        learning_goals = "\n".join(
            f"  - {g}" for g in lesson.get("learningGoals", ["Understand the core concepts"])
        )
        subtopics = ", ".join(lesson.get("subtopics", ["core concepts"]))
        question_text = (current_question or {}).get("questionText", "not set yet")
        profile = _grade_profile(grade or "8")

        return _SYSTEM_TEMPLATE.format(
            avatar_name=avatar_name or "Arya",
            lesson_title=lesson.get("title", "this lesson"),
            subtopics=subtopics,
            learning_goals=learning_goals,
            grade=grade or "8",
            attempts=summary.get("attempts", 0),
            accuracy_pct=summary.get("accuracyPct", 0.0),
            error_streak=summary.get("errorStreak", 0),
            current_question=question_text,
            teaching_context=teaching_context,
            lang_instruction=profile["language"],
            numbers_instruction=profile["numbers"],
            pace_instruction=profile["pace"],
            analogy_instruction=profile["analogy_style"],
            encouragement_instruction=profile["encouragement"],
            questions_instruction=profile["questions"],
        )

    # ── LLM backends ──────────────────────────────────────────────────────────

    async def _call_anthropic(
        self, message: str, history: List[Dict[str, str]], system: str
    ) -> str:
        model = self._chat_model if "claude" in self._chat_model else "claude-sonnet-4-6"
        messages = list(history) + [{"role": "user", "content": message}]
        body = {
            "model": model,
            "max_tokens": self._max_tokens,
            "system": system,
            "messages": messages,
        }
        headers = {
            "x-api-key": self._anthropic_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=body,
            )
        if resp.status_code >= 300:
            raise RuntimeError(f"Anthropic API error {resp.status_code}: {resp.text[:200]}")
        data = resp.json()
        return data["content"][0]["text"].strip()

    async def _call_openai(
        self, message: str, history: List[Dict[str, str]], system: str
    ) -> str:
        messages = [{"role": "system", "content": system}]
        messages.extend(history)
        messages.append({"role": "user", "content": message})
        body = {
            "model": "gpt-4.1-mini",
            "messages": messages,
            "max_tokens": self._max_tokens,
        }
        headers = {
            "Authorization": f"Bearer {self._openai_key}",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=body,
            )
        if resp.status_code >= 300:
            raise RuntimeError(f"OpenAI API error {resp.status_code}: {resp.text[:200]}")
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()

    # ── Static fallback (no API key) ──────────────────────────────────────────

    @staticmethod
    def _fallback(lesson: Dict[str, Any]) -> str:
        global _fallback_idx
        reply = _FALLBACK_RESPONSES[_fallback_idx % len(_FALLBACK_RESPONSES)]
        _fallback_idx += 1
        return reply
