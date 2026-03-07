from __future__ import annotations

import os
from typing import Any, Dict, List, Protocol


class TutorEngine(Protocol):
    DEFAULT_CHAPTER: str

    def chapters(self) -> List[Dict[str, Any]]: ...
    def exercises(self) -> List[Dict[str, str]]: ...
    def normalize_chapter(self, chapter_code: str | None) -> str: ...
    def normalize_exercise_group(self, exercise_group: str | None) -> str: ...
    def lesson(self, chapter_code: str | None) -> Dict[str, Any]: ...
    def next_question(self, chapter_code: str | None, exercise_group: str | None) -> Dict[str, Any]: ...
    def evaluate(self, question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]: ...
    def doubt_reply(self, message: str, chapter_code: str | None) -> str: ...


class TutorEngineRegistry:
    DEFAULT_COURSE_ID = "vedic_math"
    MODULE_TO_COURSE = {
        "VEDIC_MATH": "vedic_math",
        "NEET_PHYSICS": "neet_physics",
        "NEET_CHEMISTRY": "neet_chemistry",
        "NEET_MATH": "neet_math",
    }

    def __init__(self, engines: Dict[str, TutorEngine]) -> None:
        self._engines = {self._normalize_course_id(k): v for k, v in engines.items()}
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
        if cid in {"math", "mathematics", "neetmath", "neet_math", "neet-math"}:
            return "neet_math"
        if cid in {"phonics"}:
            return "phonics"
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
            # Lazy-create course template engines for new courses without code changes.
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
            # fallback to first configured engine
            return next(iter(self._engines.values()))
        return engine

    def courses(self) -> List[Dict[str, str]]:
        out: List[Dict[str, str]] = []
        for cid in sorted(self._engines.keys()):
            title = "Vedic Math" if cid == "vedic_math" else cid.replace("_", " ").title()
            out.append({"courseId": cid, "title": title})
        return out
