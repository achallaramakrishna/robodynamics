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


class LessonPayload(BaseModel):
    lessonId: str
    title: str
    gradeBand: str
    source: str
    estimatedMinutes: int
    subtopics: List[str]
    learningGoals: List[str]
    exerciseCoverage: List[str]
    exerciseFlow: List[ExerciseFlowItem]
    teachingScript: List[TeachingStep]
    coreIdeas: List[str]
    workedExamples: List[LessonExample]
    starterPractice: List[str]


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


class StartResponse(BaseModel):
    sessionId: str
    moduleCode: str
    courseId: Optional[str] = None
    activeChapterCode: str
    activeExerciseGroup: str
    chapters: List[ChapterPayload]
    exerciseGroups: List[Dict[str, str]]
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


class DoubtRequest(BaseModel):
    sessionId: str
    message: str
    courseId: Optional[str] = None


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
