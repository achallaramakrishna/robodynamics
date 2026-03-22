from __future__ import annotations

from typing import Any, Dict, List, Protocol

from app.services.runtime_contract import (
    RuntimeLesson,
    RuntimeProgressionRule,
    RuntimeQuestion,
    RuntimeScenarioRule,
    RuntimeTeachingStep,
    RuntimeToolRequirement,
    RuntimeVisualSpec,
)


class TutorProductAdapter(Protocol):
    product_id: str

    def matches_course_id(self, course_id: str) -> bool: ...
    def normalize_lesson(self, raw_lesson: Dict[str, Any], course_id: str, chapter_code: str) -> RuntimeLesson: ...
    def get_domain_pack_ids(self) -> List[str]: ...
    def get_policy_rules(self) -> List[str]: ...


class BaseProductAdapter:
    product_id = "generic"
    subject_domain = "general"

    def matches_course_id(self, course_id: str) -> bool:
        return False

    def get_domain_pack_ids(self) -> List[str]:
        return [f"{self.subject_domain}_domain_pack"]

    def get_policy_rules(self) -> List[str]:
        return []

    def normalize_lesson(self, raw_lesson: Dict[str, Any], course_id: str, chapter_code: str) -> RuntimeLesson:
        teaching_steps_raw = raw_lesson.get("teachingScript") if isinstance(raw_lesson.get("teachingScript"), list) else []
        teaching_steps = [
            RuntimeTeachingStep(
                stepId=str(item.get("stepId", f"{chapter_code}_{idx + 1}")),
                exerciseGroup=str(item.get("exerciseGroup", "A")),
                subtopic=str(item.get("subtopic", "Practice")),
                boardMode=str(item.get("boardMode", "svg")),
                teacherLine=str(item.get("teacherLine", "")),
                boardAction=str(item.get("boardAction", "")),
                checkpointPrompt=str(item.get("checkpointPrompt", "")),
                microPractice=str(item.get("microPractice", "")),
            )
            for idx, item in enumerate(teaching_steps_raw)
            if isinstance(item, dict)
        ]

        question_pool_raw = raw_lesson.get("questionPool") if isinstance(raw_lesson.get("questionPool"), list) else []
        question_pool: List[RuntimeQuestion] = []
        for item in question_pool_raw:
            if not isinstance(item, dict):
                continue
            visual_payload = item.get("visual") if isinstance(item.get("visual"), dict) else None
            question_pool.append(
                RuntimeQuestion(
                    questionId=str(item.get("questionId", "")),
                    exerciseGroup=str(item.get("exerciseGroup", "A")),
                    questionType=str(item.get("questionType", item.get("type", "text"))),
                    questionText=str(item.get("questionText", "")),
                    expectedAnswer=str(item.get("expectedAnswer", "")) or None,
                    acceptableAnswers=[str(value) for value in item.get("acceptableAnswers", []) if str(value).strip()],
                    hint=str(item.get("hint", "")) or None,
                    solution=str(item.get("solution", "")) or None,
                    passage=item.get("passage") if isinstance(item.get("passage"), dict) else None,
                    starterCode=str(item.get("starterCode", "")) or None,
                    tests=item.get("tests") if isinstance(item.get("tests"), list) else [],
                    rubric=item.get("rubric") if isinstance(item.get("rubric"), dict) else None,
                    difficulty=str(item.get("difficulty", "")) or None,
                    skill=str(item.get("skill", "")) or None,
                    subtopic=str(item.get("subtopic", "")) or None,
                    options=[str(value) for value in item.get("options", []) if str(value).strip()] if isinstance(item.get("options"), list) else [],
                    correctIndex=int(item.get("correctIndex")) if item.get("correctIndex") is not None else None,
                    steps=item.get("steps") if isinstance(item.get("steps"), list) else [],
                    rawType=str(item.get("type", "")) or None,
                    visual=RuntimeVisualSpec(**visual_payload) if visual_payload else None,
                )
            )

        visuals = [question.visual for question in question_pool if question.visual is not None]
        progression_rules = [
            RuntimeProgressionRule(ruleId="retry_then_advance", threshold="1_correct", action="advance"),
            RuntimeProgressionRule(ruleId="error_streak_reteach", threshold="3_errors", action="remediate"),
        ]

        scenario_rules: List[RuntimeScenarioRule] = []
        if self.product_id == "financial_literacy":
            scenario_rules.append(
                RuntimeScenarioRule(
                    ruleId="finance_educational_boundary",
                    ruleType="policy",
                    description="Educational-only financial literacy guidance without personalized advice.",
                )
            )

        tool_requirements: List[RuntimeToolRequirement] = []
        if self.product_id == "coding":
            tool_requirements.append(RuntimeToolRequirement(toolName="code_runner", mode="sandboxed"))
        elif self.subject_domain in {"math", "science", "exam_prep"}:
            tool_requirements.append(RuntimeToolRequirement(toolName="answer_checker", mode="deterministic"))

        goals = [str(item) for item in raw_lesson.get("learningGoals", []) if str(item).strip()] if isinstance(raw_lesson.get("learningGoals"), list) else []
        if not goals:
            goals = [str(item.subtopic) for item in teaching_steps if str(item.subtopic).strip()]

        return RuntimeLesson(
            productId=self.product_id,
            courseId=course_id,
            chapterCode=chapter_code,
            title=str(raw_lesson.get("title", chapter_code)),
            gradeBand=str(raw_lesson.get("gradeBand", "")),
            subjectDomain=self.subject_domain,
            goals=goals,
            teachingSteps=teaching_steps,
            questionPool=question_pool,
            exerciseFlow=raw_lesson.get("exerciseFlow") if isinstance(raw_lesson.get("exerciseFlow"), list) else [],
            visuals=visuals,
            progressionRules=progression_rules,
            scenarioRules=scenario_rules,
            policyTags=self.get_policy_rules(),
            toolRequirements=tool_requirements,
            source=str(raw_lesson.get("source", "")),
            dbCourseId=raw_lesson.get("dbCourseId") if isinstance(raw_lesson.get("dbCourseId"), int) else None,
            estimatedMinutes=int(raw_lesson.get("estimatedMinutes", 20) or 20),
            coreIdeas=[str(item) for item in raw_lesson.get("coreIdeas", []) if str(item).strip()] if isinstance(raw_lesson.get("coreIdeas"), list) else [],
            workedExamples=raw_lesson.get("workedExamples") if isinstance(raw_lesson.get("workedExamples"), list) else [],
            starterPractice=[str(item) for item in raw_lesson.get("starterPractice", []) if str(item).strip()] if isinstance(raw_lesson.get("starterPractice"), list) else [],
            screenplay=raw_lesson.get("screenplay") if isinstance(raw_lesson.get("screenplay"), list) else [],
            duolingoLessonArc=raw_lesson.get("duolingoLessonArc") if isinstance(raw_lesson.get("duolingoLessonArc"), dict) else None,
            assets=raw_lesson.get("assets") if isinstance(raw_lesson.get("assets"), dict) else {},
            assetItems=raw_lesson.get("assetItems") if isinstance(raw_lesson.get("assetItems"), list) else [],
        )


class VedicMathAdapter(BaseProductAdapter):
    product_id = "mindsutra"
    subject_domain = "math"

    def matches_course_id(self, course_id: str) -> bool:
        return course_id.startswith("vedic_math")

    def get_policy_rules(self) -> List[str]:
        return ["deterministic_math", "grade_safe_language"]


class AptitudeReasoningAdapter(BaseProductAdapter):
    product_id = "mindspark"
    subject_domain = "reasoning"

    def matches_course_id(self, course_id: str) -> bool:
        return course_id.startswith("aptitude_reasoning") or course_id.startswith("aptitude_campus")

    def get_policy_rules(self) -> List[str]:
        return ["deterministic_reasoning", "grade_safe_language"]


class NeetPrepAdapter(BaseProductAdapter):
    product_id = "neet_prep"
    subject_domain = "exam_prep"

    def matches_course_id(self, course_id: str) -> bool:
        return course_id.startswith("neet_")

    def get_policy_rules(self) -> List[str]:
        return ["exam_mode", "deterministic_assessment"]


class FinancialLiteracyAdapter(BaseProductAdapter):
    product_id = "financial_literacy"
    subject_domain = "financial_literacy"

    def matches_course_id(self, course_id: str) -> bool:
        return course_id.startswith("financial_literacy") or course_id.startswith("moneymind")

    def get_policy_rules(self) -> List[str]:
        return ["educational_only_finance", "age_safe_finance"]


class CodingAdapter(BaseProductAdapter):
    product_id = "coding"
    subject_domain = "coding"

    def matches_course_id(self, course_id: str) -> bool:
        return course_id.startswith("coding")

    def get_policy_rules(self) -> List[str]:
        return ["sandbox_required", "debug_safe_guidance"]


class GenericTutorAdapter(BaseProductAdapter):
    product_id = "generic"
    subject_domain = "general"

    def matches_course_id(self, course_id: str) -> bool:
        return True

    def get_policy_rules(self) -> List[str]:
        return ["grade_safe_language"]


class ProductAdapterRegistry:
    def __init__(self) -> None:
        self._adapters: List[TutorProductAdapter] = [
            VedicMathAdapter(),
            AptitudeReasoningAdapter(),
            NeetPrepAdapter(),
            FinancialLiteracyAdapter(),
            CodingAdapter(),
            GenericTutorAdapter(),
        ]

    def adapter_for_course(self, course_id: str) -> TutorProductAdapter:
        normalized = (course_id or "").strip().lower()
        for adapter in self._adapters:
            if adapter.matches_course_id(normalized):
                return adapter
        return GenericTutorAdapter()

    def normalize_lesson(self, raw_lesson: Dict[str, Any], course_id: str, chapter_code: str) -> RuntimeLesson:
        adapter = self.adapter_for_course(course_id)
        return adapter.normalize_lesson(raw_lesson, course_id, chapter_code)
