from __future__ import annotations

import os
from datetime import datetime, timezone

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    ChapterPayload,
    CheckAnswerRequest,
    CheckAnswerResponse,
    DoubtRequest,
    NextQuestionRequest,
    QuestionPayload,
    StartRequest,
    StartResponse,
    TutorEvent,
)
from app.services.engine_registry import TutorEngineRegistry
from app.services.quality_refresh import QualityRefreshService
from app.services.rule_engine import VedicRuleEngine
from app.services.session_store import SessionStore
from app.services.token_service import TokenService

app = FastAPI(title="RoboDynamics Vedic Tutor API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

token_service = TokenService()
engine_registry = TutorEngineRegistry({"vedic_math": VedicRuleEngine()})
quality_refresh_service = QualityRefreshService()
session_store = SessionStore()
internal_key = os.getenv("TUTOR_INTERNAL_KEY", "").strip()


def require_internal_key(provided: str | None) -> None:
    if not internal_key:
        return
    if not provided or provided.strip() != internal_key:
        raise HTTPException(status_code=401, detail="Invalid internal key")


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "service": "tutor-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "courses": engine_registry.courses(),
    }


@app.get("/ai-tutor-api/courses")
async def courses(x_ai_tutor_key: str | None = Header(default=None)) -> dict:
    require_internal_key(x_ai_tutor_key)
    return {"courses": engine_registry.courses()}


@app.get("/ai-tutor-api/vedic/catalog")
async def catalog(courseId: str | None = None, x_ai_tutor_key: str | None = Header(default=None)) -> dict:
    require_internal_key(x_ai_tutor_key)
    resolved_course_id = engine_registry.resolve_course_id(courseId, "VEDIC_MATH")
    engine = engine_registry.engine(resolved_course_id)
    return {
        "courseId": resolved_course_id,
        "defaultChapterCode": engine.DEFAULT_CHAPTER,
        "chapters": [ChapterPayload(**c).model_dump() for c in engine.chapters()],
        "exerciseGroups": engine.exercises(),
        "courses": engine_registry.courses(),
    }


@app.post("/ai-tutor-api/vedic/start", response_model=StartResponse)
async def start(payload: StartRequest, x_ai_tutor_key: str | None = Header(default=None)) -> StartResponse:
    require_internal_key(x_ai_tutor_key)
    try:
        claims = token_service.decode(payload.token)
    except Exception as ex:
        raise HTTPException(status_code=401, detail=f"Invalid launch token: {ex}") from ex

    module_code = str(claims.get("module", "VEDIC_MATH"))
    grade = str(claims.get("grade", "6"))
    course_id = engine_registry.resolve_course_id(payload.courseId, module_code)
    engine = engine_registry.engine(course_id)

    chapter_code = engine.normalize_chapter(payload.chapterCode)
    exercise_group = engine.normalize_exercise_group(payload.exerciseGroup)
    lesson = engine.lesson(chapter_code)
    question = engine.next_question(chapter_code, exercise_group)

    session = session_store.create(claims, course_id, module_code, grade, chapter_code, exercise_group)
    session_store.set_question(session.session_id, question)

    await session_store.send_event(
        TutorEvent(
            sessionId=session.session_id,
            userId=session.user_id,
            childId=session.child_id,
            moduleCode=module_code,
            eventType="SESSION_STARTED",
            lessonCode=chapter_code,
            meta={
                "grade": grade,
                "role": session.role,
                "courseId": course_id,
                "chapterCode": chapter_code,
                "exerciseGroup": exercise_group,
            },
        )
    )

    chapters = [ChapterPayload(**c) for c in engine.chapters()]
    return StartResponse(
        sessionId=session.session_id,
        moduleCode=module_code,
        courseId=course_id,
        activeChapterCode=chapter_code,
        activeExerciseGroup=exercise_group,
        chapters=chapters,
        exerciseGroups=engine.exercises(),
        lesson=lesson,
        question=QuestionPayload(**question),
    )


@app.post("/ai-tutor-api/vedic/next-question")
async def next_question(payload: NextQuestionRequest, x_ai_tutor_key: str | None = Header(default=None)) -> dict:
    require_internal_key(x_ai_tutor_key)
    try:
        session = session_store.get(payload.sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex

    resolved_course_id = engine_registry.resolve_course_id(payload.courseId or session.course_id, session.module_code)
    if resolved_course_id != session.course_id:
        session = session_store.set_course_id(payload.sessionId, resolved_course_id)

    engine = engine_registry.engine(session.course_id)

    requested_chapter = engine.normalize_chapter(payload.chapterCode or session.chapter_code)
    if requested_chapter != session.chapter_code:
        session = session_store.set_chapter(payload.sessionId, requested_chapter)

    requested_group = engine.normalize_exercise_group(payload.exerciseGroup or session.exercise_group)
    if requested_group != session.exercise_group:
        session = session_store.set_exercise_group(payload.sessionId, requested_group)

    question = engine.next_question(session.chapter_code, session.exercise_group)
    session_store.set_question(payload.sessionId, question)
    lesson = engine.lesson(session.chapter_code)

    await session_store.send_event(
        TutorEvent(
            sessionId=session.session_id,
            userId=session.user_id,
            childId=session.child_id,
            moduleCode=session.module_code,
            eventType="QUESTION_DELIVERED",
            lessonCode=session.chapter_code,
            questionId=question["questionId"],
            meta={
                "skill": question["skill"],
                "difficulty": question["difficulty"],
                "courseId": session.course_id,
                "chapterCode": session.chapter_code,
                "exerciseGroup": session.exercise_group,
                "subtopic": question.get("subtopic"),
            },
        )
    )

    return {
        "courseId": session.course_id,
        "question": question,
        "activeChapterCode": session.chapter_code,
        "activeExerciseGroup": session.exercise_group,
        "lesson": lesson,
    }


@app.post("/ai-tutor-api/vedic/check-answer", response_model=CheckAnswerResponse)
async def check_answer(
    payload: CheckAnswerRequest,
    x_ai_tutor_key: str | None = Header(default=None),
) -> CheckAnswerResponse:
    require_internal_key(x_ai_tutor_key)
    try:
        session = session_store.get(payload.sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex

    engine = engine_registry.engine(session.course_id)

    question = session.current_question
    if not question or str(question.get("questionId")) != payload.questionId:
        raise HTTPException(status_code=400, detail="Question mismatch for session")

    result = engine.evaluate(question, payload.learnerAnswer)
    session = session_store.update_score(
        payload.sessionId,
        bool(result["correct"]),
        response_time_ms=payload.responseTimeMs,
        confidence=payload.confidence,
    )
    summary = session_store.summary(payload.sessionId)

    quality = await quality_refresh_service.maybe_refresh(
        summary,
        {
            "courseId": session.course_id,
            "chapterCode": session.chapter_code,
            "exerciseGroup": session.exercise_group,
            "subtopic": question.get("subtopic", ""),
            "questionType": question.get("type", ""),
        },
        bool(result["correct"]),
    )

    await session_store.send_event(
        TutorEvent(
            sessionId=session.session_id,
            userId=session.user_id,
            childId=session.child_id,
            moduleCode=session.module_code,
            eventType="ANSWER_SUBMITTED",
            lessonCode=session.chapter_code,
            questionId=payload.questionId,
            isCorrect=bool(result["correct"]),
            scoreDelta=1 if result["correct"] else 0,
            meta={
                "skill": question.get("skill", ""),
                "courseId": session.course_id,
                "chapterCode": session.chapter_code,
                "exerciseGroup": session.exercise_group,
                "subtopic": question.get("subtopic", ""),
                "responseTimeMs": payload.responseTimeMs,
                "confidence": payload.confidence,
                "tutorAction": quality.get("tutorAction"),
            },
        )
    )

    return CheckAnswerResponse(
        correct=bool(result["correct"]),
        expectedAnswer=str(result["expectedAnswer"]),
        receivedAnswer=str(result["receivedAnswer"]),
        explanation=str(result["explanation"]),
        encouragement=str(result["encouragement"]),
        tutorAction=quality.get("tutorAction"),
        coachTip=quality.get("coachTip"),
        summary=summary,
    )


@app.post("/ai-tutor-api/vedic/doubt")
async def doubt(payload: DoubtRequest, x_ai_tutor_key: str | None = Header(default=None)) -> dict:
    require_internal_key(x_ai_tutor_key)
    try:
        session = session_store.get(payload.sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex

    resolved_course_id = engine_registry.resolve_course_id(payload.courseId or session.course_id, session.module_code)
    if resolved_course_id != session.course_id:
        session = session_store.set_course_id(payload.sessionId, resolved_course_id)

    engine = engine_registry.engine(session.course_id)
    session = session_store.note_doubt(payload.sessionId)

    reply = engine.doubt_reply(payload.message, session.chapter_code)
    await session_store.send_event(
        TutorEvent(
            sessionId=session.session_id,
            userId=session.user_id,
            childId=session.child_id,
            moduleCode=session.module_code,
            eventType="DOUBT_ASKED",
            lessonCode=session.chapter_code,
            meta={
                "messageLength": len(payload.message or ""),
                "courseId": session.course_id,
                "chapterCode": session.chapter_code,
                "exerciseGroup": session.exercise_group,
                "doubtCount": session.doubt_count,
            },
        )
    )
    return {"courseId": session.course_id, "reply": reply}
