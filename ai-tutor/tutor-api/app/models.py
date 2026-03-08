from __future__ import annotations

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class StartRequest(BaseModel):
    token: str = Field(min_length=20)
    courseId: Optional[str] = None
    chapterCode: Optional[str] = None
    exerciseGroup: Optional[str] = None


class LessonExample(BaseModel):
    question: str
    method: str
    answer: str


class LessonAssetItem(BaseModel):
    assetType: str
    topic: str
    file: str
    url: str


class ExerciseFlowItem(BaseModel):
    exerciseGroup: str
    subtopic: str


class TeachingStep(BaseModel):
    stepId: str
    exerciseGroup: str
    subtopic: str
    boardMode: str
    teacherLine: str
    boardAction: str
    checkpointPrompt: str
    microPractice: str


class ScreenplayBeat(BaseModel):
    beatId: str
    stepId: str
    exerciseGroup: str
    subtopic: str
    sequence: int
    cue: str
    boardMode: str
    teacherLine: str
    boardAction: str
    checkpointPrompt: str
    pauseType: str
    holdSec: float
    expectedStudentResponse: str
    fallbackHint: str
    performanceTag: str = "core"
    useWhenCorrect: Optional[bool] = None
    useWhenIncorrect: Optional[bool] = None
    minConfidence: Optional[str] = None
    maxConfidence: Optional[str] = None
    svgAnimation: List[Dict[str, Any]] = Field(default_factory=list)


class LessonPayload(BaseModel):
    lessonId: str
    title: str
    gradeBand: str
    source: str
    dbCourseId: Optional[int] = None
    estimatedMinutes: int
    subtopics: List[str]
    learningGoals: List[str]
    exerciseCoverage: List[str]
    exerciseFlow: List[ExerciseFlowItem]
    teachingScript: List[TeachingStep]
    screenplay: List[ScreenplayBeat] = Field(default_factory=list)
    coreIdeas: List[str]
    workedExamples: List[LessonExample]
    starterPractice: List[str]
    assets: Dict[str, int] = Field(default_factory=dict)
    assetItems: List[LessonAssetItem] = Field(default_factory=list)


class QuestionPayload(BaseModel):
    questionId: str
    chapterCode: str
    exerciseGroup: str
    skill: str
    difficulty: str
    type: str
    questionText: str
    hint: str
    solution: str
    expectedAnswer: str
    subtopic: Optional[str] = None
    visual: Optional[Dict[str, Any]] = None


class ChapterPayload(BaseModel):
    chapterCode: str
    title: str
    estimatedMinutes: int
    subtopics: List[str]
    learningGoals: List[str]
    exerciseGroups: List[str]
    exerciseFlow: List[ExerciseFlowItem]


class LessonPathItem(BaseModel):
    exerciseGroup: str
    subtopic: str
    status: str
    attempts: int = 0
    correctCount: int = 0
    accuracyPct: float = 0.0


class SessionProgress(BaseModel):
    hearts: int
    maxHearts: int
    xp: int
    streak: int
    masteryPct: float
    lessonCompletionPct: float
    livesDepleted: bool
    canContinue: bool
    activeExerciseGroup: str
    reviewQueue: List[str] = Field(default_factory=list)
    lessonPath: List[LessonPathItem] = Field(default_factory=list)


class StartResponse(BaseModel):
    sessionId: str
    moduleCode: str
    courseId: Optional[str] = None
    activeChapterCode: str
    activeExerciseGroup: str
    chapters: List[ChapterPayload]
    exerciseGroups: List[Dict[str, str]]
    sessionProgress: SessionProgress
    lesson: LessonPayload
    question: QuestionPayload


class NextQuestionRequest(BaseModel):
    sessionId: str
    courseId: Optional[str] = None
    chapterCode: Optional[str] = None
    exerciseGroup: Optional[str] = None


class CheckAnswerRequest(BaseModel):
    sessionId: str
    questionId: str
    learnerAnswer: str
    responseTimeMs: Optional[int] = None
    confidence: Optional[str] = None


class CheckAnswerResponse(BaseModel):
    correct: bool
    expectedAnswer: str
    receivedAnswer: str
    explanation: str
    encouragement: str
    tutorAction: Optional[str] = None
    coachTip: Optional[str] = None
    summary: Dict[str, Any]
    sessionProgress: Optional[SessionProgress] = None


class DoubtRequest(BaseModel):
    sessionId: str
    message: str
    courseId: Optional[str] = None
    avatarName: Optional[str] = None  # e.g. "Arya", "Ved", "Tara", "Niva"


class DoubtResponse(BaseModel):
    courseId: str
    reply: str
    conversationTurn: int  # how many turns in this session's conversation


class ChatRequest(BaseModel):
    """Multi-turn tutoring chat. Preferred over DoubtRequest for new frontends."""
    sessionId: str
    message: str
    avatarName: Optional[str] = "Arya"
    courseId: Optional[str] = None
    # Optional hint to the LLM about context ("doubt", "hint_request", "concept_check")
    context: Optional[str] = "doubt"


class ChatResponse(BaseModel):
    reply: str
    conversationTurn: int
    sessionId: str
    # Suggested next UX action: "practice" | "reteach" | "continue"
    suggestNextAction: str = "continue"


class EventIngestRequest(BaseModel):
    sessionId: str
    eventType: str
    questionId: Optional[str] = None
    lessonCode: Optional[str] = None
    isCorrect: Optional[bool] = None
    scoreDelta: Optional[int] = None
    meta: Dict[str, Any] = Field(default_factory=dict)


class OrchestratorCommandRequest(BaseModel):
    sessionId: str
    command: str
    meta: Dict[str, Any] = Field(default_factory=dict)


class OrchestratorStateResponse(BaseModel):
    sessionId: str
    state: str
    version: int
    updatedAt: str
    context: Dict[str, Any] = Field(default_factory=dict)


class TutorEvent(BaseModel):
    sessionId: str
    userId: int
    childId: Optional[int] = None
    moduleCode: str
    eventType: str
    lessonCode: Optional[str] = None
    questionId: Optional[str] = None
    isCorrect: Optional[bool] = None
    scoreDelta: Optional[int] = None
    meta: Dict[str, Any] = Field(default_factory=dict)
