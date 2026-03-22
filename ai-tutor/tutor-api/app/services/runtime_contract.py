from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class RuntimeVisualSpec(BaseModel):
    kind: str = "svg"
    title: str = ""
    svg: Optional[str] = None
    asset: Optional[str] = None
    caption: Optional[str] = None


class RuntimeToolRequirement(BaseModel):
    toolName: str
    mode: str = "deterministic"
    config: Dict[str, Any] = Field(default_factory=dict)


class RuntimeScenarioRule(BaseModel):
    ruleId: str
    ruleType: str = "scenario"
    description: str


class RuntimeProgressionRule(BaseModel):
    ruleId: str
    threshold: str
    action: str


class RuntimeQuestion(BaseModel):
    questionId: str
    exerciseGroup: str
    questionType: str
    questionText: str
    expectedAnswer: Optional[str] = None
    acceptableAnswers: List[str] = Field(default_factory=list)
    hint: Optional[str] = None
    solution: Optional[str] = None
    passage: Optional[Dict[str, Any]] = None
    starterCode: Optional[str] = None
    tests: List[Dict[str, Any]] = Field(default_factory=list)
    visual: Optional[RuntimeVisualSpec] = None
    rubric: Optional[Dict[str, Any]] = None
    difficulty: Optional[str] = None
    skill: Optional[str] = None
    subtopic: Optional[str] = None
    options: List[str] = Field(default_factory=list)
    correctIndex: Optional[int] = None
    steps: List[Dict[str, Any]] = Field(default_factory=list)
    rawType: Optional[str] = None


class RuntimeTeachingStep(BaseModel):
    stepId: str
    exerciseGroup: str
    subtopic: str
    boardMode: str = "svg"
    teacherLine: str = ""
    boardAction: str = ""
    checkpointPrompt: str = ""
    microPractice: str = ""


class RuntimeLesson(BaseModel):
    productId: str
    courseId: str
    chapterCode: str
    title: str
    gradeBand: str
    subjectDomain: str
    goals: List[str] = Field(default_factory=list)
    teachingSteps: List[RuntimeTeachingStep] = Field(default_factory=list)
    questionPool: List[RuntimeQuestion] = Field(default_factory=list)
    exerciseFlow: List[Dict[str, str]] = Field(default_factory=list)
    visuals: List[RuntimeVisualSpec] = Field(default_factory=list)
    progressionRules: List[RuntimeProgressionRule] = Field(default_factory=list)
    scenarioRules: List[RuntimeScenarioRule] = Field(default_factory=list)
    policyTags: List[str] = Field(default_factory=list)
    toolRequirements: List[RuntimeToolRequirement] = Field(default_factory=list)
    source: str = ""
    dbCourseId: Optional[int] = None
    estimatedMinutes: int = 20
    coreIdeas: List[str] = Field(default_factory=list)
    workedExamples: List[Dict[str, str]] = Field(default_factory=list)
    starterPractice: List[str] = Field(default_factory=list)
    screenplay: List[Dict[str, Any]] = Field(default_factory=list)
    duolingoLessonArc: Optional[Dict[str, Any]] = None
    assets: Dict[str, int] = Field(default_factory=dict)
    assetItems: List[Dict[str, str]] = Field(default_factory=list)


def runtime_lesson_to_legacy_payload(lesson: RuntimeLesson) -> Dict[str, Any]:
    return {
        "productId": lesson.productId,
        "courseId": lesson.courseId,
        "chapterCode": lesson.chapterCode,
        "title": lesson.title,
        "gradeBand": lesson.gradeBand,
        "subjectDomain": lesson.subjectDomain,
        "goals": list(lesson.goals),
        "policyTags": list(lesson.policyTags),
        "toolRequirements": [item.model_dump() for item in lesson.toolRequirements],
        "scenarioRules": [item.model_dump() for item in lesson.scenarioRules],
        "lessonId": lesson.chapterCode,
        "source": lesson.source,
        "dbCourseId": lesson.dbCourseId,
        "estimatedMinutes": lesson.estimatedMinutes,
        "subtopics": [step.subtopic for step in lesson.teachingSteps] or list(lesson.goals),
        "learningGoals": list(lesson.goals),
        "exerciseCoverage": [item.get("exerciseGroup", "") for item in lesson.exerciseFlow],
        "exerciseFlow": list(lesson.exerciseFlow),
        "teachingScript": [item.model_dump() for item in lesson.teachingSteps],
        "screenplay": list(lesson.screenplay),
        "duolingoLessonArc": lesson.duolingoLessonArc,
        "coreIdeas": list(lesson.coreIdeas),
        "workedExamples": list(lesson.workedExamples),
        "starterPractice": list(lesson.starterPractice),
        "assets": dict(lesson.assets),
        "assetItems": list(lesson.assetItems),
        "questionPool": [item.model_dump() for item in lesson.questionPool],
    }
