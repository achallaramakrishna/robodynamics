from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[3]
TUTOR_API_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = TUTOR_API_ROOT / ".env"
CHAPTER_ROOT = TUTOR_API_ROOT / "content-template" / "vedic_math" / "chapter"


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
class ScenarioResult:
    scenario_id: str
    name: str
    passed: bool
    score: float
    summary: str
    evidence: list[str] = field(default_factory=list)


def make_token(module: str, grade: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "launch-scenario-user",
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=2)).timestamp()),
        "user_id": 99902,
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


async def start_session(
    client: httpx.AsyncClient,
    headers: dict[str, str],
    *,
    course_id: str,
    module: str,
    grade: str,
    chapter_code: str,
    exercise_group: str = "A",
) -> dict[str, Any]:
    return await fetch_json(
        client,
        "POST",
        "/ai-tutor-api/tutor/start",
        headers=headers,
        payload={
            "token": make_token(module, grade),
            "courseId": course_id,
            "chapterCode": chapter_code,
            "exerciseGroup": exercise_group,
        },
    )


def make_wrong_answer(expected: str) -> str:
    text = str(expected or "").strip()
    if not text:
        return "not sure"
    if text.isdigit() or (text.startswith("-") and text[1:].isdigit()):
        return str(int(text) + 1)
    return "not sure"


async def scenario_intro_handoff(
    client: httpx.AsyncClient,
    headers: dict[str, str],
    *,
    course_id: str,
    module: str,
    grade: str,
) -> ScenarioResult:
    data = await start_session(
        client,
        headers,
        course_id=course_id,
        module=module,
        grade=grade,
        chapter_code="L1_COMPLETING_WHOLE",
    )
    question = data.get("question") or {}
    lesson = data.get("lesson") or {}
    evidence = [
        f"activeExerciseGroup={data.get('activeExerciseGroup')}",
        f"questionId={question.get('questionId')}",
        f"questionText={str(question.get('questionText') or '')[:96]}",
        f"hasDuolingoArc={bool(lesson.get('duolingoLessonArc'))}",
    ]
    passed = (
        data.get("activeExerciseGroup") == "A"
        and bool(question.get("questionId"))
        and bool(str(question.get("questionText") or "").strip())
        and bool(lesson.get("duolingoLessonArc"))
    )
    summary = "Start Lesson lands directly on the first real question payload." if passed else "Start Lesson did not return a clean first-question handoff."
    return ScenarioResult("launch_01", "Intro To Lesson Handoff", passed, 100.0 if passed else 0.0, summary, evidence)


async def scenario_correct_first(
    client: httpx.AsyncClient,
    headers: dict[str, str],
    *,
    course_id: str,
    module: str,
    grade: str,
) -> ScenarioResult:
    data = await start_session(
        client,
        headers,
        course_id=course_id,
        module=module,
        grade=grade,
        chapter_code="L1_COMPLETING_WHOLE",
    )
    session_id = str(data["sessionId"])
    question = data["question"]
    result = await fetch_json(
        client,
        "POST",
        "/ai-tutor-api/tutor/check-answer",
        headers=headers,
        payload={
            "sessionId": session_id,
            "questionId": question["questionId"],
            "learnerAnswer": question["expectedAnswer"],
            "responseTimeMs": 3800,
            "confidence": "medium",
        },
    )
    progress = result.get("sessionProgress") or {}
    passed = bool(result.get("correct")) and float(progress.get("lessonCompletionPct", 0) or 0) > 0 and int(progress.get("xp", 0) or 0) >= 10
    evidence = [
        f"questionId={question.get('questionId')}",
        f"correct={result.get('correct')}",
        f"xp={progress.get('xp')}",
        f"completion={progress.get('lessonCompletionPct')}",
    ]
    summary = "Correct-first answer advances XP and lesson completion." if passed else "Correct-first answer did not advance the lesson as expected."
    return ScenarioResult("launch_02", "Correct First Answer Progression", passed, 100.0 if passed else 0.0, summary, evidence)


async def scenario_wrong_then_recover(
    client: httpx.AsyncClient,
    headers: dict[str, str],
    *,
    course_id: str,
    module: str,
    grade: str,
) -> ScenarioResult:
    data = await start_session(
        client,
        headers,
        course_id=course_id,
        module=module,
        grade=grade,
        chapter_code="L1_COMPLETING_WHOLE",
    )
    session_id = str(data["sessionId"])
    question = data["question"]
    wrong_answer = make_wrong_answer(str(question.get("expectedAnswer") or ""))
    wrong = await fetch_json(
        client,
        "POST",
        "/ai-tutor-api/tutor/check-answer",
        headers=headers,
        payload={
            "sessionId": session_id,
            "questionId": question["questionId"],
            "learnerAnswer": wrong_answer,
            "responseTimeMs": 6100,
            "confidence": "low",
        },
    )
    right = await fetch_json(
        client,
        "POST",
        "/ai-tutor-api/tutor/check-answer",
        headers=headers,
        payload={
            "sessionId": session_id,
            "questionId": question["questionId"],
            "learnerAnswer": question["expectedAnswer"],
            "responseTimeMs": 4200,
            "confidence": "medium",
        },
    )
    wrong_progress = wrong.get("sessionProgress") or {}
    right_progress = right.get("sessionProgress") or {}
    passed = (
        not bool(wrong.get("correct"))
        and bool(right.get("correct"))
        and int(wrong_progress.get("hearts", 0) or 0) < 5
        and int(right_progress.get("xp", 0) or 0) > int(wrong_progress.get("xp", 0) or 0)
    )
    evidence = [
        f"wrongAccepted={wrong.get('correct')}",
        f"wrongHearts={wrong_progress.get('hearts')}",
        f"rightAccepted={right.get('correct')}",
        f"rightXp={right_progress.get('xp')}",
    ]
    summary = "Wrong-first recovery behaves correctly: hearts drop, retry stays alive, correct answer restores momentum." if passed else "Wrong-first recovery is not behaving consistently."
    return ScenarioResult("launch_03", "Wrong Then Recover", passed, 100.0 if passed else 0.0, summary, evidence)


async def scenario_chapter_completion(
    client: httpx.AsyncClient,
    headers: dict[str, str],
    *,
    course_id: str,
    module: str,
    grade: str,
) -> ScenarioResult:
    data = await start_session(
        client,
        headers,
        course_id=course_id,
        module=module,
        grade=grade,
        chapter_code="L1_COMPLETING_WHOLE",
    )
    session_id = str(data["sessionId"])
    flow = list((data.get("lesson") or {}).get("exerciseFlow") or [])
    current_question = dict(data["question"])
    current_group = str(data.get("activeExerciseGroup") or "A")
    last_progress: dict[str, Any] = data.get("sessionProgress") or {}

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
                    "courseId": course_id,
                    "chapterCode": "L1_COMPLETING_WHOLE",
                    "exerciseGroup": target_group,
                },
            )
            current_question = dict(next_data["question"])
            current_group = str(next_data.get("activeExerciseGroup") or target_group)
        result = await fetch_json(
            client,
            "POST",
            "/ai-tutor-api/tutor/check-answer",
            headers=headers,
            payload={
                "sessionId": session_id,
                "questionId": current_question["questionId"],
                "learnerAnswer": current_question["expectedAnswer"],
                "responseTimeMs": 3500,
                "confidence": "medium",
            },
        )
        last_progress = result.get("sessionProgress") or {}

    completion = float(last_progress.get("lessonCompletionPct", 0) or 0)
    passed = completion >= 99.0
    evidence = [
        f"groups={len(flow)}",
        f"finalCompletion={completion}",
        f"finalXp={last_progress.get('xp')}",
        f"finalHearts={last_progress.get('hearts')}",
    ]
    summary = "A clean chapter run reaches full completion." if passed else "A clean chapter run is not reaching full completion."
    return ScenarioResult("launch_04", "Chapter Completion Path", passed, 100.0 if passed else 0.0, summary, evidence)


def scenario_unique_question_ids() -> ScenarioResult:
    duplicates: list[str] = []
    for path in sorted(CHAPTER_ROOT.glob("L*.json")):
        if path.name.endswith(".bak") or "Copy" in path.name:
            continue
        payload = json.loads(path.read_text(encoding="utf-8"))
        seen: set[str] = set()
        for item in payload.get("exerciseFlow") or []:
            question_id = str(item.get("questionId") or "").strip()
            if not question_id:
                duplicates.append(f"{path.stem}: missing questionId in exerciseFlow")
                continue
            if question_id in seen:
                duplicates.append(f"{path.stem}: repeated questionId {question_id}")
            seen.add(question_id)
    passed = not duplicates
    evidence = duplicates[:12] if duplicates else ["No repeated questionId values found."]
    summary = "Every chapter uses unique question IDs." if passed else "Repeated question IDs exist in chapter content and can break progression or analytics."
    return ScenarioResult("launch_05", "Question ID Integrity", passed, 100.0 if passed else 0.0, summary, evidence)


def render_markdown(results: list[ScenarioResult], generated_at: datetime) -> str:
    overall = round(sum(item.score for item in results) / max(len(results), 1), 2)
    passed = sum(1 for item in results if item.passed)
    lines = [
        "# AI Tutor Launch Scenario Report",
        "",
        f"- Generated: {generated_at.astimezone(timezone.utc).isoformat()}",
        f"- Scenarios run: `{len(results)}`",
        f"- Passed: `{passed}`",
        f"- Failed: `{len(results) - passed}`",
        f"- Overall score: `{overall}/100`",
        "",
        "## Scenario Results",
        "",
    ]
    for item in results:
        lines.append(f"### {item.scenario_id}: {item.name}")
        lines.append("")
        lines.append(f"- Result: `{'PASS' if item.passed else 'FAIL'}`")
        lines.append(f"- Score: `{item.score}/100`")
        lines.append(f"- Summary: {item.summary}")
        if item.evidence:
            lines.append("- Evidence:")
            for detail in item.evidence:
                lines.append(f"  - `{detail}`")
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def render_json(results: list[ScenarioResult], generated_at: datetime) -> str:
    payload = {
        "generatedAt": generated_at.astimezone(timezone.utc).isoformat(),
        "scenarioCount": len(results),
        "passedCount": sum(1 for item in results if item.passed),
        "failedCount": sum(1 for item in results if not item.passed),
        "overallScore": round(sum(item.score for item in results) / max(len(results), 1), 2),
        "results": [asdict(item) for item in results],
    }
    return json.dumps(payload, indent=2)


async def run_launch_scenarios(args: argparse.Namespace) -> list[ScenarioResult]:
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://launch-test") as client:
        headers = make_headers()
        return [
            await scenario_intro_handoff(client, headers, course_id=args.course_id, module=args.module, grade=args.grade),
            await scenario_correct_first(client, headers, course_id=args.course_id, module=args.module, grade=args.grade),
            await scenario_wrong_then_recover(client, headers, course_id=args.course_id, module=args.module, grade=args.grade),
            await scenario_chapter_completion(client, headers, course_id=args.course_id, module=args.module, grade=args.grade),
            scenario_unique_question_ids(),
        ]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run launch-ready AI Tutor scenarios against the current tutor flow.")
    parser.add_argument("--course-id", default="vedic_math")
    parser.add_argument("--module", default="VEDIC_MATH")
    parser.add_argument("--grade", default="8")
    parser.add_argument("--output", default=str(REPO_ROOT / "docs" / "vedic_math" / "LAUNCH_SCENARIO_REPORT.md"))
    parser.add_argument("--json-output", default=str(REPO_ROOT / "docs" / "vedic_math" / "LAUNCH_SCENARIO_REPORT.json"))
    return parser.parse_args()


async def main() -> int:
    args = parse_args()
    generated_at = datetime.now(timezone.utc)
    results = await run_launch_scenarios(args)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(render_markdown(results, generated_at), encoding="utf-8")

    json_output_path = Path(args.json_output)
    json_output_path.parent.mkdir(parents=True, exist_ok=True)
    json_output_path.write_text(render_json(results, generated_at), encoding="utf-8")

    overall = round(sum(item.score for item in results) / max(len(results), 1), 2)
    print(f"Launch scenarios run: {len(results)}")
    print(f"Overall score: {overall}/100")
    print(f"Markdown report: {output_path}")
    print(f"JSON report: {json_output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
