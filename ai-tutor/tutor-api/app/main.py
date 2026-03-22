from __future__ import annotations

import os
import re
from datetime import datetime, timezone
from pathlib import Path
# Load .env for local development (no-op in prod where env vars are injected)
_env_file = Path(__file__).parent.parent / ".env"
if _env_file.exists():
    for _ln in _env_file.read_text(encoding="utf-8").splitlines():
        _ln = _ln.strip()
        if _ln and not _ln.startswith("#") and "=" in _ln:
            _k, _, _v = _ln.partition("=")
            os.environ.setdefault(_k.strip(), _v.strip())

from fastapi import FastAPI, Header, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    ChapterPayload,
    ChatRequest,
    ChatResponse,
    CheckAnswerRequest,
    CheckAnswerResponse,
    DoubtRequest,
    DoubtResponse,
    EventIngestRequest,
    OrchestratorCommandRequest,
    OrchestratorStateResponse,
    NextQuestionRequest,
    QuestionPayload,
    StartRequest,
    StartResponse,
    TutorEvent,
)
from app.services.conversation_engine import ConversationEngine
from app.services.engine_registry import TutorEngineRegistry
from app.services.domain_tool_agent import DomainToolAgent
from app.services.guard_policy import GuardPolicyService
from app.services.generic_course_engine import CourseTemplateRuleEngine, resolve_template_course_id
from app.services.rule_engine import VedicRuleEngine
from app.services.behavior_classifier import BehaviorClassifier
from app.services.orchestrator import TutorOrchestrator
from app.services.quality_refresh import QualityRefreshService
from app.services.session_store import SessionStore
from app.services.token_service import TokenService

app = FastAPI(title="RoboDynamics Tutor API", version="0.2.0")

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
            template_course_id=resolve_template_course_id("neet_physics", os.getenv("AI_TUTOR_NEET_PHYSICS_DB_COURSE_ID", "")),
            fallback_chapter_code="PHY_CH1",
        ),
        "neet_chemistry": CourseTemplateRuleEngine(
            course_id="neet_chemistry",
            title="NEET Chemistry Tutor",
            template_course_id=resolve_template_course_id("neet_chemistry", os.getenv("AI_TUTOR_NEET_CHEMISTRY_DB_COURSE_ID", "")),
            fallback_chapter_code="CHEM_CH1",
        ),
        "neet_biology": CourseTemplateRuleEngine(
            course_id="neet_biology",
            title="NEET Biology Tutor",
            template_course_id=resolve_template_course_id("neet_biology", os.getenv("AI_TUTOR_NEET_BIOLOGY_DB_COURSE_ID", "")),
            fallback_chapter_code="BIO_CH1",
        ),
    }
)
quality_refresh_service = QualityRefreshService()
behavior_classifier = BehaviorClassifier()
domain_tool_agent = DomainToolAgent()
guard_policy_service = GuardPolicyService()
conversation_engine = ConversationEngine()
session_store = SessionStore()
orchestrator = TutorOrchestrator()
internal_key = os.getenv("TUTOR_INTERNAL_KEY", "").strip()


def require_internal_key(provided: str | None) -> None:
    if not internal_key:
        return
    if not provided or provided.strip() != internal_key:
        raise HTTPException(status_code=401, detail="Invalid internal key")


def ensure_guarded_payload(course_id: str, lesson: dict, question: dict | None = None) -> None:
    try:
        guard_policy_service.validate_runtime_payload(course_id, lesson, question)
    except ValueError as ex:
        raise HTTPException(status_code=500, detail=str(ex)) from ex

def infer_grade_specific_vedic_course_id(grade: str | None, chapter_code: str | None) -> str | None:
    chapter = (chapter_code or "").strip().upper()
    grade_value = str(grade or "").strip()

    chapter_match = re.match(r"^VM_G([4-8])_", chapter)
    if chapter_match:
        return f"vedic_math_g{chapter_match.group(1)}"

    if grade_value in {"4", "5", "6", "7", "8"}:
        return f"vedic_math_g{grade_value}"

    return None


def resolve_requested_course_id(
    requested_course_id: str | None,
    module_code: str | None,
    grade: str | None,
    chapter_code: str | None,
) -> str | None:
    course_id = (requested_course_id or "").strip()
    module = (module_code or "").strip().upper()

    if module == "VEDIC_MATH" and (not course_id or course_id.lower() == "vedic_math"):
        inferred_course_id = infer_grade_specific_vedic_course_id(grade, chapter_code)
        if inferred_course_id:
            return inferred_course_id

    return requested_course_id

def build_session_snapshot(session_id: str, lesson: dict, active_exercise_group: str | None = None) -> tuple[dict, dict]:
    summary = session_store.summary(session_id)
    session_progress = session_store.lesson_progress(
        session_id,
        lesson,
        active_exercise_group=active_exercise_group,
    )
    return summary, session_progress

_MAX_WRONG_RETRIES = 2  # After this many wrong attempts, treat question as "practiced enough" and stop blocking group advance


def auto_advance_group_if_done(
    lesson: dict,
    engine,
    current_group: str,
    question_progress: dict[str, dict] | None,
) -> str:
    """
    Return the next exercise group when every question in *current_group* is done.
    A question is "done" if it is solved correctly OR has been attempted >= _MAX_WRONG_RETRIES
    times without success (student struggled — move on rather than looping forever).
    Returns *current_group* unchanged when the group is not yet done or
    when there is no authored question pool (dynamic / fallback questions).
    """
    pool = lesson.get("questionPool") if isinstance(lesson, dict) else None
    if not isinstance(pool, list) or not pool:
        return current_group

    normalized = engine.normalize_exercise_group(current_group)
    group_pool = [
        q for q in pool
        if isinstance(q, dict) and engine.normalize_exercise_group(q.get("exerciseGroup")) == normalized
    ]
    if not group_pool:
        return current_group

    progress = question_progress or {}
    all_done = all(
        bool(progress.get(str(q.get("questionId", "")), {}).get("solved")) or
        int(progress.get(str(q.get("questionId", "")), {}).get("attempts", 0)) >= _MAX_WRONG_RETRIES
        for q in group_pool
    )
    if not all_done:
        return current_group

    # Advance to the next group in EXERCISE_GROUPS sequence
    groups = list(engine.EXERCISE_GROUPS)
    try:
        idx = groups.index(normalized)
        if idx + 1 < len(groups):
            return groups[idx + 1]
    except ValueError:
        pass
    return current_group


def pick_scripted_question(lesson: dict, engine, exercise_group: str, question_progress: dict[str, dict[str, Any]] | None = None, exclude_question_id: str | None = None) -> dict | None:
    """
    Progress-aware question selector. Three-pass strategy:
      Pass 1 — Never-attempted questions, in authored order (no repeats within a lesson).
      Pass 2 — Attempted-but-wrong questions (retry), in authored order, after all have been seen.
      Pass 3 — All solved (mastery reached): cycle from start but skip the just-answered one.
    Within every pass the question equal to exclude_question_id is always skipped so the
    same question never appears back-to-back regardless of correct/incorrect.
    """
    pool = lesson.get("questionPool") if isinstance(lesson, dict) else None
    if not isinstance(pool, list) or not pool:
        return None

    normalized_group = engine.normalize_exercise_group(exercise_group)
    group_pool = [
        dict(item)
        for item in pool
        if isinstance(item, dict) and engine.normalize_exercise_group(item.get("exerciseGroup")) == normalized_group
    ]
    if not group_pool:
        return None

    progress = question_progress or {}
    excl = str(exclude_question_id) if exclude_question_id else None

    def _qid(q: dict) -> str:
        return str(q.get("questionId", "")).strip()

    def _stat(q: dict) -> dict:
        return progress.get(_qid(q), {})

    def _not_excluded(q: dict) -> bool:
        return _qid(q) != excl if excl else True

    def _patch(q: dict) -> dict:
        """Ensure chapterCode and type fields survive RuntimeQuestion serialisation.
        RuntimeQuestion serialises the source 'type' field as rawType (practice/assessment
        category), while 'questionType' holds the form (mcq/short_answer/fill_step).
        QuestionPayload.type is used as the form discriminator by the frontend and tests,
        so prefer questionType over rawType when populating it.
        """
        r = dict(q)
        if not r.get("chapterCode"):
            r["chapterCode"] = str(lesson.get("chapterCode") or lesson.get("lessonId") or "")
        if not r.get("type"):
            r["type"] = str(r.get("questionType") or r.get("rawType") or "short_answer")
        return r

    # Pass 1: unattempted questions (attempts == 0), preserve authored order
    unattempted = [q for q in group_pool if int(_stat(q).get("attempts", 0)) == 0 and _not_excluded(q)]
    if unattempted:
        return _patch(unattempted[0])

    # Pass 2: attempted-but-wrong, up to _MAX_WRONG_RETRIES total attempts, preserve authored order
    retry = [q for q in group_pool if int(_stat(q).get("attempts", 0)) > 0 and not bool(_stat(q).get("solved")) and int(_stat(q).get("attempts", 0)) < _MAX_WRONG_RETRIES and _not_excluded(q)]
    if retry:
        return _patch(retry[0])

    # Pass 3: all questions solved — mastery cycle, skip last answered only
    mastery_pool = [q for q in group_pool if _not_excluded(q)]
    chosen = mastery_pool[0] if mastery_pool else (group_pool[0] if group_pool else None)
    if chosen is None:
        return None
    # RuntimeQuestion.model_dump() drops chapterCode and uses rawType instead of type.
    # Re-attach them so QuestionPayload validation succeeds.
    result = dict(chosen)
    if not result.get("chapterCode"):
        result["chapterCode"] = str(lesson.get("chapterCode") or lesson.get("lessonId") or "")
    if not result.get("type"):
        result["type"] = str(result.get("rawType") or "practice")
    return result



@app.get("/health")
@app.get("/ai-tutor-api/health")
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


@app.get("/ai-tutor-api/tutor/catalog")
@app.get("/ai-tutor-api/vedic/catalog")
async def catalog(
    courseId: str | None = None,
    grade: str | None = None,
    chapterCode: str | None = None,
    x_ai_tutor_key: str | None = Header(default=None),
) -> dict:
    require_internal_key(x_ai_tutor_key)
    requested_course_id = resolve_requested_course_id(courseId, "VEDIC_MATH", grade, chapterCode)
    resolved_course_id = engine_registry.resolve_course_id(requested_course_id, "VEDIC_MATH")
    engine = engine_registry.engine(resolved_course_id)
    return {
        "courseId": resolved_course_id,
        "defaultChapterCode": engine.DEFAULT_CHAPTER,
        "chapters": [ChapterPayload(**c).model_dump() for c in engine.chapters()],
        "exerciseGroups": engine.exercises(),
        "courses": engine_registry.courses(),
    }


@app.get("/ai-tutor-api/tutor/guest-token")
@app.get("/ai-tutor-api/vedic/guest-token")
async def guest_token(chapter: str = "L1_COMPLETING_WHOLE", grade: str = "8") -> dict:
    """Issue a short-lived demo JWT so guests can try the tutor without logging in."""
    token = token_service.issue_guest(chapter_code=chapter, grade=grade)
    return {"token": token, "chapterCode": chapter, "isDemo": True, "maxGroups": 3}


@app.post("/ai-tutor-api/tutor/start", response_model=StartResponse)
@app.post("/ai-tutor-api/vedic/start", response_model=StartResponse)
async def start(payload: StartRequest, x_ai_tutor_key: str | None = Header(default=None)) -> StartResponse:
    require_internal_key(x_ai_tutor_key)
    try:
        claims = token_service.decode(payload.token)
    except Exception as ex:
        raise HTTPException(status_code=401, detail=f"Invalid launch token: {ex}") from ex

    module_code = str(claims.get("module", "VEDIC_MATH"))
    grade = str(claims.get("grade", "6"))
    requested_chapter_code = payload.chapterCode or str(claims.get("chapter_code", "") or "").strip() or None
    requested_course_id = resolve_requested_course_id(payload.courseId, module_code, grade, requested_chapter_code)
    course_id = engine_registry.resolve_course_id(requested_course_id, module_code)
    engine = engine_registry.engine(course_id)
    chapter_code = engine.normalize_chapter(requested_chapter_code)
    exercise_group = engine.normalize_exercise_group(payload.exerciseGroup)
    lesson = engine_registry.runtime_lesson(course_id, chapter_code, engine.lesson(chapter_code), module_code)

    session = session_store.create(claims, course_id, module_code, grade, chapter_code, exercise_group)
    question = pick_scripted_question(lesson, engine, exercise_group, session.question_progress) or engine.next_question(chapter_code, exercise_group, grade)
    ensure_guarded_payload(course_id, lesson, question)
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

    session_summary, session_progress = build_session_snapshot(
        session.session_id,
        lesson,
        active_exercise_group=exercise_group,
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
                "sessionSummary": session_summary,
                "sessionProgress": session_progress,
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
        sessionProgress=session_progress,
        lesson=lesson,
        question=QuestionPayload(**question),
    )


@app.get("/ai-tutor-api/tutor/resume", response_model=StartResponse)
@app.get("/ai-tutor-api/vedic/resume", response_model=StartResponse)
async def resume(sessionId: str, x_ai_tutor_key: str | None = Header(default=None)) -> StartResponse:
    require_internal_key(x_ai_tutor_key)
    try:
        session = session_store.get(sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex

    engine = engine_registry.engine(session.course_id)
    lesson = engine_registry.runtime_lesson(session.course_id, session.chapter_code, engine.lesson(session.chapter_code), session.module_code)
    question = session.current_question or engine.next_question(session.chapter_code, session.exercise_group, session.grade)
    ensure_guarded_payload(session.course_id, lesson, question)
    if not session.current_question:
        session_store.set_question(session.session_id, question)

    session_summary, session_progress = build_session_snapshot(
        session.session_id,
        lesson,
        active_exercise_group=session.exercise_group,
    )

    await orchestrator.notify(
        session.session_id,
        "SESSION_RESUMED",
        {
            "courseId": session.course_id,
            "chapterCode": session.chapter_code,
            "exerciseGroup": session.exercise_group,
            "questionId": question.get("questionId", ""),
            "sessionSummary": session_summary,
        },
    )

    chapters = [ChapterPayload(**c) for c in engine.chapters()]
    return StartResponse(
        sessionId=session.session_id,
        moduleCode=session.module_code,
        courseId=session.course_id,
        activeChapterCode=session.chapter_code,
        activeExerciseGroup=session.exercise_group,
        chapters=chapters,
        exerciseGroups=engine.exercises(),
        sessionProgress=session_progress,
        lesson=lesson,
        question=QuestionPayload(**question),
    )


@app.post("/ai-tutor-api/tutor/next-question")
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
        # Clear conversation history when switching chapters so context stays accurate
        session_store.clear_conversation(payload.sessionId)

    # Load lesson once — needed for both group auto-advance and question selection.
    lesson = engine_registry.runtime_lesson(session.course_id, session.chapter_code, engine.lesson(session.chapter_code), session.module_code)
    # Honour an explicit client group request; otherwise auto-advance when current group is fully mastered.
    previous_group = session.exercise_group
    if payload.exerciseGroup:
        requested_group = engine.normalize_exercise_group(payload.exerciseGroup)
    else:
        requested_group = auto_advance_group_if_done(lesson, engine, session.exercise_group, session.question_progress)
    if requested_group != session.exercise_group:
        session = session_store.set_exercise_group(payload.sessionId, requested_group)
    last_question_id = session.current_question.get("questionId") if session.current_question else None
    question = pick_scripted_question(lesson, engine, session.exercise_group, session.question_progress, exclude_question_id=last_question_id) or engine.next_question(session.chapter_code, session.exercise_group, session.grade, exclude_question_id=last_question_id)
    session_store.set_question(payload.sessionId, question)
    ensure_guarded_payload(session.course_id, lesson, question)
    session_summary, session_progress = build_session_snapshot(
        payload.sessionId,
        lesson,
        active_exercise_group=session.exercise_group,
    )

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
                "sessionSummary": session_summary,
                "sessionProgress": session_progress,
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
        "groupAdvanced": session.exercise_group != previous_group,
        "sessionProgress": session_progress,
        "lesson": lesson,
    }


@app.post("/ai-tutor-api/tutor/check-answer", response_model=CheckAnswerResponse)
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
    lesson = engine_registry.runtime_lesson(session.course_id, session.chapter_code, engine.lesson(session.chapter_code), session.module_code)
    ensure_guarded_payload(session.course_id, lesson, session.current_question or None)
    tool_run = domain_tool_agent.run_for_question(lesson, question, payload.learnerAnswer)
    if tool_run.get("executed") and tool_run.get("pass") and not bool(result.get("correct")):
        result["correct"] = True
        result["explanation"] = str(result.get("explanation", "") or tool_run.get("result", ""))
    elif tool_run.get("executed") and not tool_run.get("pass") and bool(result.get("correct")) and question.get("questionType") in {"mcq", "speed_mcq", "number", "text"}:
        result["correct"] = False
    session = session_store.update_score(
        payload.sessionId,
        bool(result["correct"]),
        question_id=str(question.get("questionId", "")),
        exercise_group=str(question.get("exerciseGroup", session.exercise_group)),
        subtopic=str(question.get("subtopic", "")),
        response_time_ms=payload.responseTimeMs,
        confidence=payload.confidence,
    )
    summary, session_progress = build_session_snapshot(
        payload.sessionId,
        lesson,
        active_exercise_group=session.exercise_group,
    )

    archetype = behavior_classifier.classify(summary)
    quality = await quality_refresh_service.maybe_refresh(
        summary,
        {
            "courseId": session.course_id,
            "chapterCode": session.chapter_code,
            "exerciseGroup": session.exercise_group,
            "subtopic": question.get("subtopic", ""),
            "questionType": question.get("type", ""),
            "studentArchetype": archetype,
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
                "toolRun": tool_run,
                "sessionSummary": summary,
                "sessionProgress": session_progress,
            },
        )
    )
    silence_ms = behavior_classifier.silence_recovery_ms(archetype)
    board_speed = behavior_classifier.board_speed_factor(archetype)

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
            "studentArchetype": archetype,
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
        sessionProgress=session_progress,
        studentArchetype=archetype,
        silenceRecoveryMs=silence_ms,
        boardSpeedFactor=board_speed,
        toolRun=tool_run,
    )


@app.post("/ai-tutor-api/tutor/doubt", response_model=DoubtResponse)
@app.post("/ai-tutor-api/vedic/doubt", response_model=DoubtResponse)
async def doubt(payload: DoubtRequest, x_ai_tutor_key: str | None = Header(default=None)) -> DoubtResponse:
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

    # Build context for the LLM
    lesson = engine_registry.runtime_lesson(session.course_id, session.chapter_code, engine.lesson(session.chapter_code), session.module_code)
    ensure_guarded_payload(session.course_id, lesson, session.current_question or None)
    summary, session_progress = build_session_snapshot(
        payload.sessionId,
        lesson,
        active_exercise_group=session.exercise_group,
    )
    history = session_store.get_conversation(payload.sessionId)
    avatar_name = (payload.avatarName or "Arya").strip()
    avatar_id = (payload.avatarId or "raj").strip().lower()
    archetype = behavior_classifier.classify(summary)

    # Ask the LLM - falls back gracefully if no API key is set
    try:
        reply = await conversation_engine.chat(
            message=payload.message,
            history=history,
            avatar_name=avatar_name,
            lesson=lesson,
            summary=summary,
            current_question=session.current_question or None,
            teaching_context="doubt resolution",
            grade=session.grade,
            archetype=archetype,
            avatar_id=avatar_id,
        )
    except Exception:
        reply = engine.doubt_reply(payload.message, session.chapter_code)
    policy_result = guard_policy_service.enforce_reply_policy(lesson, reply)
    reply = str(policy_result["reply"])

    # Persist the turn in rolling history
    session_store.add_to_conversation(payload.sessionId, "user", payload.message)
    session_store.add_to_conversation(payload.sessionId, "assistant", reply)
    updated_session = session_store.get(payload.sessionId)
    conversation_turn = len(updated_session.conversation_history) // 2

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
                "conversationTurn": conversation_turn,
                "sessionSummary": summary,
                "sessionProgress": session_progress,
            },
        )
    )
    await orchestrator.notify(
        session.session_id,
        "DOUBT_ASKED",
        {
            "messageLength": len(payload.message or ""),
            "doubtCount": session.doubt_count,
            "conversationTurn": conversation_turn,
        },
    )
    return DoubtResponse(
        courseId=session.course_id,
        reply=reply,
        conversationTurn=conversation_turn,
    )


@app.post("/ai-tutor-api/tutor/chat", response_model=ChatResponse)
@app.post("/ai-tutor-api/vedic/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, x_ai_tutor_key: str | None = Header(default=None)) -> ChatResponse:
    """
    Multi-turn tutoring conversation endpoint.
    Preferred over /doubt for new frontend implementations.
    Maintains rolling conversation history per session.
    """
    require_internal_key(x_ai_tutor_key)
    try:
        session = session_store.get(payload.sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex

    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="message is required")

    resolved_course_id = engine_registry.resolve_course_id(
        payload.courseId or session.course_id, session.module_code
    )
    if resolved_course_id != session.course_id:
        session = session_store.set_course_id(payload.sessionId, resolved_course_id)

    engine = engine_registry.engine(session.course_id)
    lesson = engine_registry.runtime_lesson(session.course_id, session.chapter_code, engine.lesson(session.chapter_code), session.module_code)
    ensure_guarded_payload(session.course_id, lesson, session.current_question or None)
    summary, session_progress = build_session_snapshot(
        payload.sessionId,
        lesson,
        active_exercise_group=session.exercise_group,
    )
    history = session_store.get_conversation(payload.sessionId)
    avatar_name = (payload.avatarName or "Arya").strip()
    avatar_id = (payload.avatarId or "raj").strip().lower()
    teaching_context = (payload.context or "doubt").strip()
    archetype = behavior_classifier.classify(summary)

    try:
        reply = await conversation_engine.chat(
            message=payload.message,
            history=history,
            avatar_name=avatar_name,
            lesson=lesson,
            summary=summary,
            current_question=session.current_question or None,
            teaching_context=teaching_context,
            grade=session.grade,
            archetype=archetype,
            avatar_id=avatar_id,
        )
    except Exception:
        reply = engine.doubt_reply(payload.message, session.chapter_code)
    policy_result = guard_policy_service.enforce_reply_policy(lesson, reply)
    reply = str(policy_result["reply"])

    # Persist both turns
    session_store.add_to_conversation(payload.sessionId, "user", payload.message)
    session_store.add_to_conversation(payload.sessionId, "assistant", reply)
    updated = session_store.get(payload.sessionId)
    conversation_turn = len(updated.conversation_history) // 2

    # Derive a suggested next UX action based on session state
    attempts = summary.get("attempts", 0)
    error_streak = summary.get("errorStreak", 0)
    accuracy = summary.get("accuracyPct", 100.0)
    # Only suggest reteach/practice once there is enough signal (at least 1 attempt)
    if attempts > 0 and (error_streak >= 3 or accuracy < 40):
        suggest = "reteach"
    elif attempts > 0 and conversation_turn >= 3 and accuracy >= 60:
        suggest = "practice"
    else:
        suggest = "continue"

    await session_store.send_event(
        TutorEvent(
            sessionId=session.session_id,
            userId=session.user_id,
            childId=session.child_id,
            moduleCode=session.module_code,
            eventType="CHAT_TURN",
            lessonCode=session.chapter_code,
            meta={
                "messageLength": len(payload.message),
                "courseId": session.course_id,
                "chapterCode": session.chapter_code,
                "exerciseGroup": session.exercise_group,
                "conversationTurn": conversation_turn,
                "context": teaching_context,
                "suggestNextAction": suggest,
                "sessionSummary": summary,
                "sessionProgress": session_progress,
            },
        )
    )
    await orchestrator.notify(
        session.session_id,
        "CHAT_TURN",
        {
            "conversationTurn": conversation_turn,
            "suggestNextAction": suggest,
        },
    )

    return ChatResponse(
        reply=reply,
        conversationTurn=conversation_turn,
        sessionId=payload.sessionId,
        suggestNextAction=suggest,
    )


@app.post("/ai-tutor-api/tutor/event")
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
    engine = engine_registry.engine(session.course_id)
    lesson = engine_registry.runtime_lesson(session.course_id, session.chapter_code, engine.lesson(session.chapter_code), session.module_code)
    ensure_guarded_payload(session.course_id, lesson, session.current_question or None)
    summary, session_progress = build_session_snapshot(
        payload.sessionId,
        lesson,
        active_exercise_group=session.exercise_group,
    )

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
                "sessionSummary": summary,
                "sessionProgress": session_progress,
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


@app.post("/ai-tutor-api/tutor/orchestrator/command", response_model=OrchestratorStateResponse)
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


@app.get("/ai-tutor-api/tutor/orchestrator/state", response_model=OrchestratorStateResponse)
@app.get("/ai-tutor-api/vedic/orchestrator/state", response_model=OrchestratorStateResponse)
async def orchestrator_state(sessionId: str, x_ai_tutor_key: str | None = Header(default=None)) -> OrchestratorStateResponse:
    require_internal_key(x_ai_tutor_key)
    try:
        _ = session_store.get(sessionId)
        snapshot = await orchestrator.state(sessionId)
    except KeyError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex
    return OrchestratorStateResponse(**snapshot)


@app.websocket("/ai-tutor-api/tutor/ws/{session_id}")
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



