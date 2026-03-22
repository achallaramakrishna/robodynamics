from __future__ import annotations

import os
from typing import Any, Dict, List, Protocol

from app.services.product_adapters import ProductAdapterRegistry
from app.services.runtime_contract import RuntimeLesson, runtime_lesson_to_legacy_payload


class TutorEngine(Protocol):
    DEFAULT_CHAPTER: str

    def chapters(self) -> List[Dict[str, Any]]: ...
    def exercises(self) -> List[Dict[str, str]]: ...
    def normalize_chapter(self, chapter_code: str | None) -> str: ...
    def normalize_exercise_group(self, exercise_group: str | None) -> str: ...
    def lesson(self, chapter_code: str | None) -> Dict[str, Any]: ...
    def next_question(
        self,
        chapter_code: str | None,
        exercise_group: str | None,
        grade: str | None = None,
        exclude_question_id: str | None = None,
    ) -> Dict[str, Any]: ...
    def evaluate(self, question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]: ...
    def doubt_reply(self, message: str, chapter_code: str | None) -> str: ...


class TutorEngineRegistry:
    DEFAULT_COURSE_ID = "vedic_math"
    MODULE_TO_COURSE = {
        "VEDIC_MATH": "vedic_math",
        "NEET_PHYSICS": "neet_physics",
        "NEET_CHEMISTRY": "neet_chemistry",
        "NEET_BIOLOGY": "neet_biology",
        "APTITUDE_REASONING": "aptitude_reasoning",
        "FINANCIAL_LITERACY": "financial_literacy",
        "CODING": "coding_python_basics",
    }

    def __init__(self, engines: Dict[str, TutorEngine]) -> None:
        self._engines = {self._normalize_course_id(k): v for k, v in engines.items()}
        self._adapters = ProductAdapterRegistry()
        self._dynamic_enabled = str(os.getenv("AI_TUTOR_DYNAMIC_COURSE_TEMPLATE_ENABLED", "true")).strip().lower() in {
            "1",
            "true",
            "yes",
            "on",
        }

    @staticmethod
    def _normalize_course_id(course_id: str | None) -> str:
        cid = (course_id or "").strip().lower()
        if cid in {"vedic", "vedicmath", "vedic_math", "vedic-math"}:
            return "vedic_math"
        if cid in {"physics", "neetphysics", "neet_physics", "neet-physics"}:
            return "neet_physics"
        if cid in {"chemistry", "neetchemistry", "neet_chemistry", "neet-chemistry"}:
            return "neet_chemistry"
        if cid in {"biology", "bio", "neetbiology", "neet_biology", "neet-biology"}:
            return "neet_biology"
        if cid in {
            "aptitude",
            "reasoning",
            "aptitude_reasoning",
            "aptitude-reasoning",
            "logical_reasoning",
            "quantitative_aptitude",
        }:
            return "aptitude_reasoning"
        if cid in {
            "finance",
            "financial",
            "financial_literacy",
            "financial-literacy",
            "personal_finance",
        }:
            return "financial_literacy"
        if cid in {"phonics"}:
            return "phonics"
        if cid in {"coding", "python", "python_basics", "coding_python_basics", "coding-python-basics"}:
            return "coding_python_basics"
        import re as _re
        _ms_match = _re.match(r"^(?:aptitude|mindspark|mindsp[ae]r[ck])_g(?:rade)?(\d+)$", cid, _re.IGNORECASE)
        if _ms_match:
            return f"aptitude_reasoning_g{_ms_match.group(1)}"
        _campus_match = _re.match(r"^(?:aptitude(?:_reasoning)?|mindspark|mindsp[ae]r[ck])_(campus_\w+)$", cid, _re.IGNORECASE)
        if _campus_match:
            return f"aptitude_{_campus_match.group(1).lower()}"
        return cid

    def resolve_course_id(self, requested_course_id: str | None, module_code: str | None = None) -> str:
        requested = self._normalize_course_id(requested_course_id)
        if requested in self._engines:
            return requested
        if requested and self._dynamic_enabled:
            return requested

        module = (module_code or "").strip().upper()
        mapped = self._normalize_course_id(self.MODULE_TO_COURSE.get(module, ""))
        if mapped in self._engines:
            return mapped

        return self.DEFAULT_COURSE_ID

    def engine(self, course_id: str | None) -> TutorEngine:
        resolved = self.resolve_course_id(course_id)
        engine = self._engines.get(resolved)
        if not engine and self._dynamic_enabled and resolved:
            from app.services.generic_course_engine import CourseTemplateRuleEngine, resolve_template_course_id

            title = resolved.replace("_", " ").strip().title()
            template_course_id = resolve_template_course_id(resolved, "")
            engine = CourseTemplateRuleEngine(
                course_id=resolved,
                title=title,
                template_course_id=template_course_id,
                fallback_chapter_code="INTRO",
            )
            self._engines[resolved] = engine
        if not engine:
            return next(iter(self._engines.values()))
        return engine

    def runtime_lesson(
        self,
        course_id: str | None,
        chapter_code: str | None,
        raw_lesson: Dict[str, Any],
        module_code: str | None = None,
    ) -> Dict[str, Any]:
        resolved_course_id = self.resolve_course_id(course_id, module_code)
        normalized_chapter_code = str(chapter_code or raw_lesson.get("lessonId") or raw_lesson.get("chapterCode") or "").strip()
        runtime_lesson: RuntimeLesson = self._adapters.normalize_lesson(raw_lesson, resolved_course_id, normalized_chapter_code)
        return runtime_lesson_to_legacy_payload(runtime_lesson)

    def courses(self) -> List[Dict[str, str]]:
        out: List[Dict[str, str]] = []
        for cid in sorted(self._engines.keys()):
            title = "Vedic Math (Legacy Archive)" if cid == "vedic_math" else cid.replace("_", " ").title()
            out.append({"courseId": cid, "title": title})
        return out
