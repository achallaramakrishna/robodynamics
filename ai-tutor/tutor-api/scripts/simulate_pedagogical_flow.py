from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[3]
TUTOR_API_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = TUTOR_API_ROOT / ".env"


def load_env() -> None:
    if not ENV_PATH.exists():
        return
    for raw_line in ENV_PATH.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())


def disable_external_side_effects() -> None:
    os.environ["ROBODYNAMICS_EVENT_URL"] = ""
    os.environ["OPENAI_API_KEY"] = ""
    os.environ["ANTHROPIC_API_KEY"] = ""
    os.environ["AI_TUTOR_ADAPTIVE_POLICY_ENABLED"] = "false"


load_env()
disable_external_side_effects()

if str(TUTOR_API_ROOT) not in sys.path:
    sys.path.insert(0, str(TUTOR_API_ROOT))

import httpx
import jwt

from app.main import app


JWT_SECRET = os.getenv("AI_TUTOR_JWT_SECRET", "change_me_ai_tutor_secret")
JWT_ISSUER = os.getenv("AI_TUTOR_JWT_ISSUER", "robodynamics-java")
JWT_AUDIENCE = os.getenv("AI_TUTOR_JWT_AUDIENCE", "robodynamics-ai-tutor")
INTERNAL_KEY = os.getenv("TUTOR_INTERNAL_KEY", "")


@dataclass
class AttemptResult:
    answer: str
    correct: bool
    hearts: int
    xp: int
    streak: int
    note: str = ""


@dataclass
class GroupRun:
    chapter_code: str
    chapter_title: str
    exercise_group: str
    subtopic: str
    question_id: str
    question_text: str
    expected_answer: str
    attempts: list[AttemptResult] = field(default_factory=list)
    completion_pct: float = 0.0
    issues: list[str] = field(default_factory=list)


@dataclass
class ChapterRun:
    chapter_code: str
    chapter_title: str
    session_id: str
    groups: list[GroupRun] = field(default_factory=list)
    issues: list[str] = field(default_factory=list)
    final_hearts: int = 0
    final_xp: int = 0
    final_completion_pct: float = 0.0
    score: float = 0.0


def make_token(module: str, grade: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "pedagogical-sim-user",
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=2)).timestamp()),
        "user_id": 99901,
        "child_id": None,
        "role": "STUDENT",
        "module": module,
        "grade": grade,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def make_headers() -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    if INTERNAL_KEY:
        headers["X-AI-TUTOR-KEY"] = INTERNAL_KEY
    return headers


def make_wrong_answer(expected: str) -> str:
    text = str(expected or "").strip()
    if not text:
        return "not sure"
    qr = re.fullmatch(r"\s*(-?\d+)\s*[rR]\s*(-?\d+)\s*", text)
    if qr:
        return f"{qr.group(1)}R{int(qr.group(2)) + 1}"
    if re.fullmatch(r"-?\d+", text):
        return str(int(text) + 1)
    if re.fullmatch(r"-?\d+\.\d+", text):
        return f"{float(text) + 1.0:.2f}".rstrip("0").rstrip(".")
    if text.lower() in {"yes", "true"}:
        return "no"
    if text.lower() in {"no", "false"}:
        return "yes"
    return "not sure"


def shorten(text: str, limit: int = 96) -> str:
    clean = " ".join(str(text or "").split())
    if len(clean) <= limit:
        return clean
    return f"{clean[: limit - 3]}..."


async def fetch_json(client: httpx.AsyncClient, method: str, url: str, *, headers: dict[str, str], payload: dict[str, Any] | None = None) -> dict[str, Any]:
    response = await client.request(method, url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()


async def simulate_group(
    client: httpx.AsyncClient,
    headers: dict[str, str],
    session_id: str,
    chapter_title: str,
    chapter_code: str,
    exercise_group: str,
    question: dict[str, Any],
    try_wrong_first: bool,
) -> GroupRun:
    expected = str(question.get("expectedAnswer", "")).strip()
    subtopic = str(question.get("subtopic", "")).strip() or "Practice"
    group_run = GroupRun(
        chapter_code=chapter_code,
        chapter_title=chapter_title,
        exercise_group=exercise_group,
        subtopic=subtopic,
        question_id=str(question.get("questionId", "")),
        question_text=str(question.get("questionText", "")),
        expected_answer=expected,
    )

    if not group_run.question_id:
        group_run.issues.append("Missing questionId")
    if not group_run.question_text:
        group_run.issues.append("Missing question text")
    if not expected:
        group_run.issues.append("Missing expected answer")

    if try_wrong_first and expected:
        wrong_answer = make_wrong_answer(expected)
        wrong_resp = await fetch_json(
            client,
            "POST",
            "/ai-tutor-api/tutor/check-answer",
            headers=headers,
            payload={
                "sessionId": session_id,
                "questionId": group_run.question_id,
                "learnerAnswer": wrong_answer,
                "responseTimeMs": 6200,
                "confidence": "low",
            },
        )
        wrong_progress = wrong_resp.get("sessionProgress") or {}
        group_run.attempts.append(
            AttemptResult(
                answer=wrong_answer,
                correct=bool(wrong_resp.get("correct")),
                hearts=int(wrong_progress.get("hearts", 0) or 0),
                xp=int(wrong_progress.get("xp", 0) or 0),
                streak=int(wrong_progress.get("streak", 0) or 0),
                note="probe retry loop",
            )
        )
        if wrong_resp.get("correct"):
            group_run.issues.append("Wrong-first probe was incorrectly accepted")

    correct_resp = await fetch_json(
        client,
        "POST",
        "/ai-tutor-api/tutor/check-answer",
        headers=headers,
        payload={
            "sessionId": session_id,
            "questionId": group_run.question_id,
            "learnerAnswer": expected or "not sure",
            "responseTimeMs": 4100,
            "confidence": "medium",
        },
    )
    progress = correct_resp.get("sessionProgress") or {}
    group_run.attempts.append(
        AttemptResult(
            answer=expected or "not sure",
            correct=bool(correct_resp.get("correct")),
            hearts=int(progress.get("hearts", 0) or 0),
            xp=int(progress.get("xp", 0) or 0),
            streak=int(progress.get("streak", 0) or 0),
            note="expected answer",
        )
    )
    group_run.completion_pct = float(progress.get("lessonCompletionPct", 0.0) or 0.0)

    if not correct_resp.get("correct"):
        group_run.issues.append("Expected answer was rejected")
    if try_wrong_first and len(group_run.attempts) >= 2:
        wrong_attempt = group_run.attempts[0]
        right_attempt = group_run.attempts[-1]
        if right_attempt.hearts > wrong_attempt.hearts + 1:
            group_run.issues.append("Hearts jumped unexpectedly after retry")
        if right_attempt.xp < wrong_attempt.xp:
            group_run.issues.append("XP dropped after correct answer")

    return group_run


async def simulate_chapter(
    client: httpx.AsyncClient,
    headers: dict[str, str],
    *,
    course_id: str,
    module: str,
    chapter_code: str,
    grade: str,
    retry_pattern_offset: int,
) -> ChapterRun:
    start_data = await fetch_json(
        client,
        "POST",
        "/ai-tutor-api/tutor/start",
        headers=headers,
        payload={
            "token": make_token(module, grade),
            "courseId": course_id,
            "chapterCode": chapter_code,
            "exerciseGroup": "A",
        },
    )

    session_id = str(start_data["sessionId"])
    chapter_title = str(start_data["lesson"]["title"])
    flow = list(start_data["lesson"].get("exerciseFlow") or [])
    chapter_run = ChapterRun(
        chapter_code=chapter_code,
        chapter_title=chapter_title,
        session_id=session_id,
    )

    if not flow:
        chapter_run.issues.append("Lesson has no exercise flow")
        return chapter_run

    seen_question_ids: set[str] = set()
    current_question = dict(start_data["question"])
    current_group = str(start_data.get("activeExerciseGroup") or "A")

    for idx, flow_item in enumerate(flow):
        target_group = str(flow_item.get("exerciseGroup") or current_group or "A")
        if idx > 0:
            next_data = await fetch_json(
                client,
                "POST",
                "/ai-tutor-api/tutor/next-question",
                headers=headers,
                payload={
                    "sessionId": session_id,
                    "courseId": course_id,
                    "chapterCode": chapter_code,
                    "exerciseGroup": target_group,
                },
            )
            current_question = dict(next_data["question"])
            current_group = str(next_data.get("activeExerciseGroup") or target_group)
        else:
            current_group = target_group

        if current_group != target_group:
            chapter_run.issues.append(f"Expected group {target_group}, got {current_group}")

        question_id = str(current_question.get("questionId", ""))
        if question_id in seen_question_ids:
            chapter_run.issues.append(f"Repeated questionId {question_id} in chapter {chapter_code}")
        seen_question_ids.add(question_id)

        group_run = await simulate_group(
            client,
            headers,
            session_id,
            chapter_title,
            chapter_code,
            target_group,
            current_question,
            try_wrong_first=((idx + retry_pattern_offset) % 3 == 1),
        )
        chapter_run.groups.append(group_run)
        chapter_run.issues.extend(group_run.issues)

    if chapter_run.groups:
        last_attempt = chapter_run.groups[-1].attempts[-1]
        chapter_run.final_hearts = last_attempt.hearts
        chapter_run.final_xp = last_attempt.xp
        chapter_run.final_completion_pct = chapter_run.groups[-1].completion_pct
    chapter_run.score = score_chapter(chapter_run)

    return chapter_run


def score_chapter(chapter: ChapterRun) -> float:
    total_groups = max(len(chapter.groups), 1)
    successful_groups = sum(1 for group in chapter.groups if group.attempts and group.attempts[-1].correct)
    base = (successful_groups * 100.0) / total_groups
    group_issue_count = sum(len(group.issues) for group in chapter.groups)
    chapter_only_issue_count = max(0, len(chapter.issues) - group_issue_count)
    penalty = (group_issue_count * 4.0) + (chapter_only_issue_count * 2.0)
    return round(max(0.0, min(100.0, base - penalty)), 2)


def score_runs(chapters: list[ChapterRun]) -> float:
    if not chapters:
        return 0.0
    return round(sum(chapter.score for chapter in chapters) / len(chapters), 2)


def render_markdown(chapters: list[ChapterRun], started_at: datetime, course_id: str, module: str, grade: str) -> str:
    total_groups = sum(len(ch.groups) for ch in chapters)
    total_attempts = sum(len(group.attempts) for ch in chapters for group in ch.groups)
    total_issues = sum(len(ch.issues) for ch in chapters)
    overall_score = score_runs(chapters)
    lines: list[str] = []
    lines.append(f"# Pedagogical Simulation Report: {course_id}")
    lines.append("")
    lines.append(f"- Generated: {started_at.astimezone(timezone.utc).isoformat()}")
    lines.append(f"- Module: `{module}`")
    lines.append(f"- Grade: `{grade}`")
    lines.append(f"- Chapters simulated: `{len(chapters)}`")
    lines.append(f"- Exercise groups simulated: `{total_groups}`")
    lines.append(f"- Student attempts submitted: `{total_attempts}`")
    lines.append(f"- Issues flagged: `{total_issues}`")
    lines.append(f"- Overall score: `{overall_score}/100`")
    lines.append("")
    lines.append("## Overall Verdict")
    lines.append("")
    if total_issues:
        lines.append(f"Simulation completed with `{total_issues}` flagged issues that need review. Score reflects flow continuity, answer acceptance, and retry behavior.")
    else:
        lines.append("Simulation completed without flagged flow issues.")
    lines.append("")

    for chapter in chapters:
        lines.append(f"## {chapter.chapter_code}: {chapter.chapter_title}")
        lines.append("")
        lines.append(f"- Session: `{chapter.session_id}`")
        lines.append(f"- Final hearts: `{chapter.final_hearts}`")
        lines.append(f"- Final XP: `{chapter.final_xp}`")
        lines.append(f"- Final completion: `{chapter.final_completion_pct}%`")
        lines.append(f"- Score: `{chapter.score}/100`")
        if chapter.issues:
            lines.append(f"- Issues: `{len(chapter.issues)}`")
        else:
            lines.append("- Issues: `0`")
        lines.append("")
        lines.append("| Group | Subtopic | Question | Attempts | Final | Hearts | XP | Notes |")
        lines.append("| --- | --- | --- | --- | --- | --- | --- | --- |")
        for group in chapter.groups:
            final_attempt = group.attempts[-1] if group.attempts else AttemptResult(answer="", correct=False, hearts=0, xp=0, streak=0)
            attempt_summary = " / ".join(
                f"{'OK' if attempt.correct else 'RETRY'}:{shorten(attempt.answer, 18)}"
                for attempt in group.attempts
            )
            note_parts: list[str] = []
            if group.issues:
                note_parts.extend(group.issues)
            else:
                note_parts.append("clean")
            lines.append(
                "| "
                + " | ".join(
                    [
                        group.exercise_group,
                        shorten(group.subtopic, 28),
                        shorten(group.question_text, 54),
                        shorten(attempt_summary, 32),
                        "OK" if final_attempt.correct else "FAIL",
                        str(final_attempt.hearts),
                        str(final_attempt.xp),
                        shorten("; ".join(note_parts), 48),
                    ]
                )
                + " |"
            )
        lines.append("")
        if chapter.issues:
            lines.append("### Chapter Issues")
            lines.append("")
            for issue in chapter.issues:
                lines.append(f"- {issue}")
            lines.append("")
    return "\n".join(lines) + "\n"


def render_json(chapters: list[ChapterRun], started_at: datetime, course_id: str, module: str, grade: str) -> str:
    payload = {
        "generatedAt": started_at.astimezone(timezone.utc).isoformat(),
        "courseId": course_id,
        "module": module,
        "grade": grade,
        "overallScore": score_runs(chapters),
        "chapters": [
            {
                "chapterCode": chapter.chapter_code,
                "chapterTitle": chapter.chapter_title,
                "sessionId": chapter.session_id,
                "score": chapter.score,
                "issues": chapter.issues,
                "finalHearts": chapter.final_hearts,
                "finalXp": chapter.final_xp,
                "finalCompletionPct": chapter.final_completion_pct,
                "groups": [
                    {
                        "exerciseGroup": group.exercise_group,
                        "subtopic": group.subtopic,
                        "questionId": group.question_id,
                        "questionText": group.question_text,
                        "expectedAnswer": group.expected_answer,
                        "completionPct": group.completion_pct,
                        "issues": group.issues,
                        "attempts": [
                            {
                                "answer": attempt.answer,
                                "correct": attempt.correct,
                                "hearts": attempt.hearts,
                                "xp": attempt.xp,
                                "streak": attempt.streak,
                                "note": attempt.note,
                            }
                            for attempt in group.attempts
                        ],
                    }
                    for group in chapter.groups
                ],
            }
            for chapter in chapters
        ],
    }
    return json.dumps(payload, indent=2)


async def run_simulation(args: argparse.Namespace) -> tuple[list[ChapterRun], datetime]:
    headers = make_headers()
    started_at = datetime.now(timezone.utc)
    transport = httpx.ASGITransport(app=app)
    chapters: list[ChapterRun] = []

    async with httpx.AsyncClient(transport=transport, base_url="http://testserver", timeout=45.0) as client:
        health = await fetch_json(client, "GET", "/health", headers=headers)
        available_courses = {item.get("courseId") for item in health.get("courses", [])}
        if args.course_id not in available_courses:
            raise RuntimeError(f"Course {args.course_id} is not available in health payload: {sorted(available_courses)}")

        bootstrap = await fetch_json(
            client,
            "POST",
            "/ai-tutor-api/tutor/start",
            headers=headers,
            payload={
                "token": make_token(args.module, args.grade),
                "courseId": args.course_id,
                "chapterCode": args.chapter_code or None,
                "exerciseGroup": "A",
            },
        )

        all_chapters = bootstrap.get("chapters") or []
        target_chapters = [
            str(chapter.get("chapterCode", "")).strip()
            for chapter in all_chapters
            if str(chapter.get("chapterCode", "")).strip()
        ]
        if args.chapter_code:
            normalized = args.chapter_code.strip().upper()
            target_chapters = [code for code in target_chapters if code.upper() == normalized]
        if not target_chapters:
            raise RuntimeError("No chapters selected for simulation")

        for idx, chapter_code in enumerate(target_chapters):
            chapters.append(
                await simulate_chapter(
                    client,
                    headers,
                    course_id=args.course_id,
                    module=args.module,
                    chapter_code=chapter_code,
                    grade=args.grade,
                    retry_pattern_offset=idx,
                )
            )

    return chapters, started_at


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run a session-by-session student simulator against the AI Tutor flow.")
    parser.add_argument("--course-id", default="vedic_math")
    parser.add_argument("--module", default="VEDIC_MATH")
    parser.add_argument("--grade", default="8")
    parser.add_argument("--chapter-code", default="")
    parser.add_argument(
        "--output",
        default=str(REPO_ROOT / "docs" / "vedic_math" / "PEDAGOGICAL_SIMULATION_REPORT.md"),
    )
    parser.add_argument(
        "--json-output",
        default=str(REPO_ROOT / "docs" / "vedic_math" / "PEDAGOGICAL_SIMULATION_REPORT.json"),
    )
    return parser.parse_args()


async def main() -> int:
    args = parse_args()
    chapters, started_at = await run_simulation(args)

    markdown_path = Path(args.output)
    markdown_path.parent.mkdir(parents=True, exist_ok=True)
    markdown_path.write_text(
        render_markdown(chapters, started_at, args.course_id, args.module, args.grade),
        encoding="utf-8",
    )

    json_path = Path(args.json_output)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(
        render_json(chapters, started_at, args.course_id, args.module, args.grade),
        encoding="utf-8",
    )

    total_issues = sum(len(chapter.issues) for chapter in chapters)
    print(f"Simulated {len(chapters)} chapters. Issues flagged: {total_issues}.")
    print(f"Markdown report: {markdown_path}")
    print(f"JSON report: {json_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
