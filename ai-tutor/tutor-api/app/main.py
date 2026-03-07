from __future__ import annotations

import os
from datetime import datetime, timezone

from fastapi import FastAPI, Header, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    ChapterPayload,
    CheckAnswerRequest,
    CheckAnswerResponse,
    DoubtRequest,
    EventIngestRequest,
    OrchestratorCommandRequest,
    OrchestratorStateResponse,
    NextQuestionRequest,
    QuestionPayload,
    StartRequest,
    StartResponse,
    TutorEvent,
)
from app.services.engine_registry import TutorEngineRegistry
from app.services.generic_course_engine import CourseTemplateRuleEngine, resolve_template_course_id
from app.services.orchestrator import TutorOrchestrator
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
engine_registry = TutorEngineRegistry(
    {
        "vedic_math": VedicRuleEngine(),
        "neet_physics": CourseTemplateRuleEngine(
            course_id="neet_physics",
            title="NEET Physics Tutor",
            template_course_id=resolve_template_course_id("neet_physics", os.getenv("AI_TUTOR_NEET_PHYSICS_DB_COURSE_ID", "155")),
            fallback_chapter_code="PHY_CH1",
        ),
        "neet_chemistry": CourseTemplateRuleEngine(
            course_id="neet_chemistry",
            title="NEET Chemistry Tutor",
            template_course_id=resolve_template_course_id("neet_chemistry", os.getenv("AI_TUTOR_NEET_CHEMISTRY_DB_COURSE_ID", "156")),
            fallback_chapter_code="CHEM_CH1",
        ),
        "neet_math": CourseTemplateRuleEngine(
            course_id="neet_math",
            title="NEET Math Tutor",
            template_course_id=resolve_template_course_id("neet_math", os.getenv("AI_TUTOR_NEET_MATH_DB_COURSE_ID", "65")),
            fallback_chapter_code="MATH_CH1",
        ),
    }
)
quality_refresh_service = QualityRefreshService()
session_store = SessionStore()
orchestrator = TutorOrchestrator()
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
    await orchestrator.bootstrap(
        session_id=session.session_id,
        user_id=session.user_id,
        chapter_code=chapter_code,
        exercise_group=exercise_group,
        context={
            "courseId": course_id,
            "grade": grade,
            "role": session.role,
            "lessonTitle": lesson.get("title", ""),
            "questionId": question.get("questionId", ""),
        },
    )

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
    await orchestrator.notify(
        session.session_id,
        "SESSION_STARTED",
        {
            "courseId": course_id,
            "chapterCode": chapter_code,
            "exerciseGroup": exercise_group,
            "questionId": question.get("questionId", ""),
        },
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
    await orchestrator.notify(
        session.session_id,
        "QUESTION_DELIVERED",
        {
            "questionId": question.get("questionId", ""),
            "chapterCode": session.chapter_code,
            "exerciseGroup": session.exercise_group,
            "difficulty": question.get("difficulty", ""),
            "skill": question.get("skill", ""),
        },
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
    await orchestrator.notify(
        session.session_id,
        "ANSWER_SUBMITTED",
        {
            "questionId": payload.questionId,
            "isCorrect": bool(result["correct"]),
            "confidence": payload.confidence,
            "responseTimeMs": payload.responseTimeMs,
            "tutorAction": quality.get("tutorAction"),
            "coachTip": quality.get("coachTip"),
        },
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
    await orchestrator.notify(
        session.session_id,
        "DOUBT_ASKED",
        {
            "messageLength": len(payload.message or ""),
            "doubtCount": session.doubt_count,
        },
    )
    return {"courseId": session.course_id, "reply": reply}


@app.post("/ai-tutor-api/vedic/event")
async def ingest_event(payload: EventIngestRequest, x_ai_tutor_key: str | None = Header(default=None)) -> dict:
    require_internal_key(x_ai_tutor_key)
    try:
        session = session_store.get(payload.sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex

    event_type = (payload.eventType or "").strip().upper()
    if not event_type:
        raise HTTPException(status_code=400, detail="eventType is required")

    question_id = payload.questionId or str(session.current_question.get("questionId") or "")
    lesson_code = payload.lessonCode or session.chapter_code
    meta = payload.meta if isinstance(payload.meta, dict) else {}

    await session_store.send_event(
        TutorEvent(
            sessionId=session.session_id,
            userId=session.user_id,
            childId=session.child_id,
            moduleCode=session.module_code,
            eventType=event_type,
            lessonCode=lesson_code,
            questionId=question_id or None,
            isCorrect=payload.isCorrect,
            scoreDelta=payload.scoreDelta,
            meta={
                "courseId": session.course_id,
                "chapterCode": session.chapter_code,
                "exerciseGroup": session.exercise_group,
                **meta,
            },
        )
    )
    await orchestrator.notify(
        session.session_id,
        event_type,
        {
            "questionId": question_id or "",
            **meta,
        },
    )
    return {"ok": True}


@app.post("/ai-tutor-api/vedic/orchestrator/command", response_model=OrchestratorStateResponse)
async def orchestrator_command(
    payload: OrchestratorCommandRequest, x_ai_tutor_key: str | None = Header(default=None)
) -> OrchestratorStateResponse:
    require_internal_key(x_ai_tutor_key)
    try:
        _ = session_store.get(payload.sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex

    try:
        snapshot = await orchestrator.command(payload.sessionId, payload.command, payload.meta)
    except ValueError as ex:
        raise HTTPException(status_code=400, detail=str(ex)) from ex
    return OrchestratorStateResponse(**snapshot)


@app.get("/ai-tutor-api/vedic/orchestrator/state", response_model=OrchestratorStateResponse)
async def orchestrator_state(sessionId: str, x_ai_tutor_key: str | None = Header(default=None)) -> OrchestratorStateResponse:
    require_internal_key(x_ai_tutor_key)
    try:
        _ = session_store.get(sessionId)
        snapshot = await orchestrator.state(sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex
    return OrchestratorStateResponse(**snapshot)


@app.websocket("/ai-tutor-api/vedic/ws/{session_id}")
async def orchestrator_ws(websocket: WebSocket, session_id: str) -> None:
    try:
        _ = session_store.get(session_id)
        queue = await orchestrator.subscribe(session_id)
    except KeyError:
        await websocket.close(code=4404)
        return

    await websocket.accept()
    try:
        while True:
            payload = await queue.get()
            await websocket.send_json(payload)
    except WebSocketDisconnect:
        pass
    finally:
        await orchestrator.unsubscribe(session_id, queue)
