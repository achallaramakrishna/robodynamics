from __future__ import annotations

import asyncio
import json
import os
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[3]
TUTOR_API_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = TUTOR_API_ROOT / ".env"
CHAPTER_PATH = TUTOR_API_ROOT / "content-template" / "vedic_math" / "chapter" / "L1_COMPLETING_WHOLE.json"

TESTER_NAME = "Asha"
STUDENT_NAME = "Niagh"


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
class GroupGap:
    exercise_group: str
    subtopic: str
    question_id: str
    question_text: str
    read_aloud_prompt: str
    try_prompt: str
    mastery_check: str
    review_prompt: str
    expected_sequence: list[str]
    actual_sequence: list[str]
    gaps: list[str]


def make_token(module: str = "VEDIC_MATH", grade: str = "8") -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "lesson-gap-review-user",
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=2)).timestamp()),
        "user_id": 99903,
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


async def fetch_json(
    client: httpx.AsyncClient,
    method: str,
    url: str,
    *,
    headers: dict[str, str],
    payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    response = await client.request(method, url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()


async def collect_runtime_l1() -> tuple[dict[str, dict[str, Any]], list[dict[str, Any]]]:
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://lesson-gap-test") as client:
        headers = make_headers()
        start_data = await fetch_json(
            client,
            "POST",
            "/ai-tutor-api/tutor/start",
            headers=headers,
            payload={
                "token": make_token(),
                "courseId": "vedic_math",
                "chapterCode": "L1_COMPLETING_WHOLE",
                "exerciseGroup": "A",
            },
        )
        lesson = start_data["lesson"]
        flow = list(lesson.get("exerciseFlow") or [])
        session_id = str(start_data["sessionId"])
        runtime: dict[str, dict[str, Any]] = {}
        current_question = dict(start_data["question"])
        current_group = str(start_data.get("activeExerciseGroup") or "A")

        for idx, flow_item in enumerate(flow):
            target_group = str(flow_item.get("exerciseGroup") or current_group)
            if idx > 0:
                next_data = await fetch_json(
                    client,
                    "POST",
                    "/ai-tutor-api/tutor/next-question",
                    headers=headers,
                    payload={
                        "sessionId": session_id,
                        "courseId": "vedic_math",
                        "chapterCode": "L1_COMPLETING_WHOLE",
                        "exerciseGroup": target_group,
                    },
                )
                current_question = dict(next_data["question"])
                current_group = str(next_data.get("activeExerciseGroup") or target_group)

            check = await fetch_json(
                client,
                "POST",
                "/ai-tutor-api/tutor/check-answer",
                headers=headers,
                payload={
                    "sessionId": session_id,
                    "questionId": current_question["questionId"],
                    "learnerAnswer": current_question["expectedAnswer"],
                    "responseTimeMs": 3900,
                    "confidence": "medium",
                },
            )
            runtime[target_group] = {
                "question": current_question,
                "check": check,
            }
        return runtime, flow


def build_gap_report(runtime: dict[str, dict[str, Any]], lesson_flow: list[dict[str, Any]]) -> list[GroupGap]:
    chapter = json.loads(CHAPTER_PATH.read_text(encoding="utf-8"))
    teaching_by_group = {str(item["exerciseGroup"]): item for item in chapter.get("teachingScript") or []}
    duo_by_group = {str(item["exerciseGroup"]): item for item in (chapter.get("duolingoLessonArc") or {}).get("sessionFlow") or []}
    groups: list[GroupGap] = []

    for group in lesson_flow:
        group_code = str(group.get("exerciseGroup") or "")
        teaching = teaching_by_group.get(group_code) or {}
        duo = duo_by_group.get(group_code) or {}
        runtime_item = runtime.get(group_code) or {}
        question = runtime_item.get("question") or {}
        check = runtime_item.get("check") or {}

        question_text = str(question.get("questionText") or "")
        read_aloud_prompt = str(duo.get("readAloudPrompt") or "")
        try_prompt = str(duo.get("tryPrompt") or "")
        mastery_check = str(duo.get("masteryCheck") or "")
        review_prompt = str(duo.get("reviewPrompt") or "")
        feedback = str(duo.get("instantFeedbackWin") or "")
        explanation = str(check.get("explanation") or "")

        expected_sequence = [
            f"Raj: {duo.get('coachHook') or teaching.get('teacherLine') or ''}",
            f"Raj reads the actual exercise: {question_text}",
            f"Raj asks {STUDENT_NAME} to try: {try_prompt}",
            f"{STUDENT_NAME}: answers the shown exercise.",
            f"Raj: {feedback}",
        ]
        actual_sequence = [
            f"Raj: {teaching.get('teacherLine') or duo.get('coachHook') or ''}",
            f"Board demo: {teaching.get('boardAction') or duo.get('boardDemo') or ''}",
            f"Raj currently reads: {read_aloud_prompt or question_text}",
            f"Raj currently asks in one long turn: {try_prompt} {mastery_check} {review_prompt}".strip(),
            f"{STUDENT_NAME}: {question.get('expectedAnswer')}",
            f"UI feedback card: verdict={check.get('correct')} | line={feedback} | explanation={explanation}",
        ]

        gaps: list[str] = []
        if read_aloud_prompt and read_aloud_prompt.strip() != question_text.strip():
            gaps.append("Tutor reads `readAloudPrompt`, not the actual runtime question text.")
        if review_prompt:
            gaps.append("Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.")
        if feedback:
            gaps.append("Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.")
        if not question_text.strip():
            gaps.append("Runtime question text is missing.")

        groups.append(
            GroupGap(
                exercise_group=group_code,
                subtopic=str(group.get("subtopic") or ""),
                question_id=str(question.get("questionId") or ""),
                question_text=question_text,
                read_aloud_prompt=read_aloud_prompt,
                try_prompt=try_prompt,
                mastery_check=mastery_check,
                review_prompt=review_prompt,
                expected_sequence=expected_sequence,
                actual_sequence=actual_sequence,
                gaps=gaps,
            )
        )
    return groups


def render_markdown(groups: list[GroupGap], generated_at: datetime) -> str:
    total_gaps = sum(len(group.gaps) for group in groups)
    lines = [
        "# Lesson 1 Expected vs Actual Flow Gap Report",
        "",
        f"- Generated: {generated_at.astimezone(timezone.utc).isoformat()}",
        f"- Tutor Tester: `{TESTER_NAME}`",
        f"- Student Simulator: `{STUDENT_NAME}`",
        f"- Lesson: `L1_COMPLETING_WHOLE`",
        f"- Exercise groups reviewed: `{len(groups)}`",
        f"- Gaps found: `{total_gaps}`",
        "",
        "## Expected Test Scenario",
        "",
        f"`{TESTER_NAME}` reviews the lesson as if Raj is teaching `{STUDENT_NAME}` in a real session.",
        "",
        "Expected turn order for every step A-I:",
        "1. Raj introduces the pattern briefly.",
        "2. Raj reads the actual exercise shown on screen.",
        "3. Raj asks Niagh to try.",
        "4. Niagh answers.",
        "5. Raj gives spoken feedback and either moves on or reteaches.",
        "",
        "## Group Comparison",
        "",
    ]

    for group in groups:
        lines.append(f"### Step {group.exercise_group}: {group.subtopic}")
        lines.append("")
        lines.append(f"- Runtime question: `{group.question_text}`")
        lines.append(f"- Runtime questionId: `{group.question_id}`")
        lines.append(f"- Read-aloud prompt: `{group.read_aloud_prompt}`")
        lines.append("")
        lines.append("Expected sequence:")
        for item in group.expected_sequence:
            lines.append(f"- {item}")
        lines.append("")
        lines.append("Actual implemented sequence:")
        for item in group.actual_sequence:
            lines.append(f"- {item}")
        lines.append("")
        lines.append("Gaps:")
        if group.gaps:
            for item in group.gaps:
                lines.append(f"- {item}")
        else:
            lines.append("- No gap detected for this step.")
        lines.append("")

    lines.extend(
        [
            "## Summary",
            "",
            "Primary launch blocker for Lesson 1:",
            "- Raj does not consistently read the literal exercise question shown to the student.",
            "",
            "Secondary blockers:",
            "- Raj asks too much in one turn by combining try, mastery, and review prompts.",
            "- Feedback is still partly UI-first instead of tutor-conversation-first.",
            "",
            "Recommended fix order:",
            "1. Read `question.questionText` first.",
            "2. Ask one clean `tryPrompt` only.",
            "3. Hold `reviewPrompt` for retry only.",
            "4. Speak feedback as a tutor reply after answer evaluation.",
        ]
    )
    return "\n".join(lines).strip() + "\n"


async def main() -> int:
    generated_at = datetime.now(timezone.utc)
    runtime, lesson_flow = await collect_runtime_l1()
    groups = build_gap_report(runtime, lesson_flow)

    markdown_path = REPO_ROOT / "docs" / "vedic_math" / "L1_EXPECTED_VS_ACTUAL_GAP_REPORT.md"
    json_path = REPO_ROOT / "docs" / "vedic_math" / "L1_EXPECTED_VS_ACTUAL_GAP_REPORT.json"
    markdown_path.parent.mkdir(parents=True, exist_ok=True)
    markdown_path.write_text(render_markdown(groups, generated_at), encoding="utf-8")
    json_path.write_text(json.dumps(
        {
            "generatedAt": generated_at.astimezone(timezone.utc).isoformat(),
            "tutorTester": TESTER_NAME,
            "studentSimulator": STUDENT_NAME,
            "lessonCode": "L1_COMPLETING_WHOLE",
            "groupCount": len(groups),
            "gapCount": sum(len(group.gaps) for group in groups),
            "groups": [asdict(group) for group in groups],
        },
        indent=2,
    ), encoding="utf-8")

    print(f"Markdown report: {markdown_path}")
    print(f"JSON report: {json_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
