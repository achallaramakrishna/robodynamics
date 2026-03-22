from __future__ import annotations

import asyncio
import datetime as dt
import io
import os
import sys
from pathlib import Path

import httpx
import jwt

if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "buffer"):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

TUTOR_API_ROOT = Path(__file__).resolve().parents[1]
if str(TUTOR_API_ROOT) not in sys.path:
    sys.path.insert(0, str(TUTOR_API_ROOT))

os.environ.setdefault("ANTHROPIC_API_KEY", "test-disabled")
os.environ.setdefault("OPENAI_API_KEY", "test-disabled")

from app.main import app, domain_tool_agent, session_store  # noqa: E402

JWT_SECRET = os.getenv("AI_TUTOR_JWT_SECRET", "change_me_ai_tutor_secret")
JWT_ISSUER = os.getenv("AI_TUTOR_JWT_ISSUER", "robodynamics-java")
JWT_AUDIENCE = os.getenv("AI_TUTOR_JWT_AUDIENCE", "robodynamics-ai-tutor")
INTERNAL_KEY = os.getenv("TUTOR_INTERNAL_KEY", "")


def make_token(chapter: str, grade: str = "6") -> str:
    now = dt.datetime.now(dt.timezone.utc)
    payload = {
        "sub": "repeat-fix-test",
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": now,
        "exp": now + dt.timedelta(minutes=30),
        "user_id": 991001,
        "child_id": 991001,
        "role": "STUDENT",
        "studentId": "repeat-fix-test",
        "studentName": "Repeat Fix Test",
        "module": "VEDIC_MATH",
        "grade": grade,
        "chapter_code": chapter,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def choose_group(lesson: dict) -> str:
    counts: dict[str, int] = {}
    for item in lesson.get("questionPool", []) or []:
        if not isinstance(item, dict):
            continue
        group = str(item.get("exerciseGroup", "")).strip().upper()
        if not group:
            continue
        counts[group] = counts.get(group, 0) + 1
    for group in "ABCDEFGHI":
        if counts.get(group, 0) >= 2:
            return group
    raise AssertionError(f"No exercise group has at least 2 questions: {counts}")


async def main() -> None:
    headers = {"X-AI-TUTOR-KEY": INTERNAL_KEY}
    token = make_token("L1_COMPLETING_WHOLE")
    transport = httpx.ASGITransport(app=app)

    original_run = domain_tool_agent.run_for_question

    def forced_tool_pass(lesson: dict, question: dict, learner_answer: str) -> dict:
        return {
            "toolName": "answer_checker",
            "mode": "deterministic",
            "pass": True,
            "executed": True,
            "reason": "forced_test_pass",
            "result": "Forced tool pass for repeat-fix regression test.",
        }

    try:
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            start = await client.post(
                "/ai-tutor-api/tutor/start",
                json={"token": token, "chapterCode": "L1_COMPLETING_WHOLE", "exerciseGroup": "A", "courseId": "vedic_math"},
                headers=headers,
            )
            assert start.status_code == 200, start.text
            start_data = start.json()
            session_id = str(start_data["sessionId"])
            lesson = start_data["lesson"]
            target_group = choose_group(lesson)

            current_question = start_data["question"]
            if str(current_question.get("exerciseGroup", "")).strip().upper() != target_group:
                nxt = await client.post(
                    "/ai-tutor-api/tutor/next-question",
                    json={"sessionId": session_id, "exerciseGroup": target_group, "courseId": start_data.get("courseId", "vedic_math")},
                    headers=headers,
                )
                assert nxt.status_code == 200, nxt.text
                current_question = nxt.json()["question"]

            first_qid = str(current_question["questionId"])
            domain_tool_agent.run_for_question = forced_tool_pass

            check = await client.post(
                "/ai-tutor-api/tutor/check-answer",
                json={
                    "sessionId": session_id,
                    "questionId": first_qid,
                    "learnerAnswer": "definitely-not-the-engine-answer",
                    "confidence": "medium",
                },
                headers=headers,
            )
            assert check.status_code == 200, check.text
            check_data = check.json()
            assert check_data["correct"] is True, check_data

            solved = session_store.get(session_id).question_progress.get(first_qid, {}).get("solved")
            assert solved is True, session_store.get(session_id).question_progress

            nxt = await client.post(
                "/ai-tutor-api/tutor/next-question",
                json={"sessionId": session_id, "exerciseGroup": target_group, "courseId": start_data.get("courseId", "vedic_math")},
                headers=headers,
            )
            assert nxt.status_code == 200, nxt.text
            next_data = nxt.json()
            next_qid = str(next_data["question"]["questionId"])
            assert next_qid != first_qid, {"first": first_qid, "next": next_qid, "group": target_group}

            print("PASS: tool-promoted correct answer marks the question solved and advances to a different question")
    finally:
        domain_tool_agent.run_for_question = original_run


if __name__ == "__main__":
    asyncio.run(main())