from __future__ import annotations

import re
from typing import Any, Dict, Optional


class GuardPolicyService:
    _FINANCE_BLOCK_PATTERNS = [
        r"\bguaranteed returns?\b",
        r"\bbuy this stock\b",
        r"\binvest in (?:this|that|[A-Z][a-z]+)\b",
        r"\btake (?:a|the) loan\b",
        r"\bchoose (?:this|that) mutual fund\b",
        r"\bopen (?:a|the) trading account\b",
    ]

    def validate_runtime_payload(
        self,
        course_id: str,
        lesson: Dict[str, Any],
        question: Optional[Dict[str, Any]] = None,
    ) -> None:
        if not isinstance(lesson, dict):
            raise ValueError("guard.invalid_lesson_payload")
        if not str(lesson.get("title", "")).strip():
            raise ValueError("guard.missing_lesson_title")
        if not str(lesson.get("lessonId", lesson.get("chapterCode", ""))).strip():
            raise ValueError("guard.missing_lesson_id")
        lesson_course_id = str(lesson.get("courseId", course_id)).strip().lower()
        if lesson_course_id and course_id and lesson_course_id != course_id.strip().lower():
            raise ValueError("guard.course_mismatch")
        teaching_script = lesson.get("teachingScript")
        if not isinstance(teaching_script, list) or not teaching_script:
            raise ValueError("guard.missing_teaching_script")
        exercise_flow = lesson.get("exerciseFlow")
        if not isinstance(exercise_flow, list) or not exercise_flow:
            raise ValueError("guard.missing_exercise_flow")
        if question is None:
            return
        if not isinstance(question, dict):
            raise ValueError("guard.invalid_question_payload")
        if not str(question.get("questionId", "")).strip():
            raise ValueError("guard.missing_question_id")
        if not str(question.get("questionText", "")).strip():
            raise ValueError("guard.missing_question_text")
        question_chapter = str(question.get("chapterCode", "")).strip()
        lesson_chapter = str(lesson.get("chapterCode", lesson.get("lessonId", ""))).strip()
        if question_chapter and lesson_chapter and question_chapter != lesson_chapter:
            raise ValueError("guard.chapter_mismatch")

    def enforce_reply_policy(self, lesson: Dict[str, Any], reply: str) -> Dict[str, Any]:
        text = self._clean_reply(reply)
        if not text:
            return {
                "reply": self._fallback_reply(lesson),
                "blocked": True,
                "reason": "policy.blank_reply",
            }

        policy_tags = {str(tag).strip().lower() for tag in lesson.get("policyTags", []) if str(tag).strip()}
        subject_domain = str(lesson.get("subjectDomain", "")).strip().lower()

        if "educational_only_finance" in policy_tags or subject_domain == "financial_literacy":
            for pattern in self._FINANCE_BLOCK_PATTERNS:
                if re.search(pattern, text, flags=re.IGNORECASE):
                    return {
                        "reply": (
                            "I can explain the money concept in an educational way, "
                            "but I cannot recommend real financial products or personal investment actions."
                        ),
                        "blocked": True,
                        "reason": "policy.finance_boundary",
                    }

        return {
            "reply": text,
            "blocked": False,
            "reason": None,
        }

    @staticmethod
    def _clean_reply(reply: str | None) -> str:
        text = str(reply or "").replace("\r", " ").strip()
        text = re.sub(r"\s+", " ", text)
        return text[:1200].strip()

    @staticmethod
    def _fallback_reply(lesson: Dict[str, Any]) -> str:
        title = str(lesson.get("title", "this lesson")).strip() or "this lesson"
        return f"Let us stay with {title}. Ask one clear concept question and I will explain it step by step."
