"""
Standalone integration test for the ConversationEngine / /tutor/chat endpoint.

Run from the tutor-api/ directory:

    python scripts/test_conversation.py

    # Against a remote pod:
    BASE_URL=https://your-pod-url python scripts/test_conversation.py

It auto-loads tutor-api/.env, creates its own JWT (no Java app needed),
starts a session, then fires a multi-turn chat to verify Claude is responding.
"""
from __future__ import annotations

import asyncio
import os
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ── Auto-load .env if present ─────────────────────────────────────────────────
_env_path = Path(__file__).parent.parent / ".env"
if _env_path.exists():
    for _line in _env_path.read_text().splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _key, _, _val = _line.partition("=")
            os.environ.setdefault(_key.strip(), _val.strip())

import httpx
import jwt  # PyJWT — already in requirements.txt

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL = os.getenv("BASE_URL", "http://localhost:8091").rstrip("/")
JWT_SECRET = os.getenv("AI_TUTOR_JWT_SECRET", "change_me_ai_tutor_secret")
JWT_ISSUER = os.getenv("AI_TUTOR_JWT_ISSUER", "robodynamics-java")
JWT_AUDIENCE = os.getenv("AI_TUTOR_JWT_AUDIENCE", "robodynamics-ai-tutor")
INTERNAL_KEY = os.getenv("TUTOR_INTERNAL_KEY", "")
AVATAR = "Arya"
CHAPTER = "VEDIC_CH1"
EXERCISE = "A"

HEADERS = {"Content-Type": "application/json"}
if INTERNAL_KEY:
    HEADERS["X-AI-TUTOR-KEY"] = INTERNAL_KEY


def make_token() -> str:
    """Mint a test JWT exactly as the Java LMS would."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "test-user-999",
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=1)).timestamp()),
        "user_id": 999,
        "child_id": None,
        "role": "STUDENT",
        "module": "VEDIC_MATH",
        "grade": "8",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


async def run_test() -> None:
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=30) as client:

        # ── 1. Health ─────────────────────────────────────────────────────────
        print("── 1. Health check")
        r = await client.get("/health")
        r.raise_for_status()
        health = r.json()
        print(f"   ✓ ok={health['ok']}  courses={health.get('courses', [])}\n")

        # ── 2. Start session ──────────────────────────────────────────────────
        print("── 2. Start session  (module=VEDIC_MATH, chapter=VEDIC_CH1, group=A)")
        token = make_token()
        r = await client.post(
            "/ai-tutor-api/tutor/start",
            headers=HEADERS,
            json={
                "token": token,
                "courseId": "vedic_math",
                "chapterCode": CHAPTER,
                "exerciseGroup": EXERCISE,
            },
        )
        if r.status_code != 200:
            print(f"   ✗ START failed {r.status_code}: {r.text}")
            sys.exit(1)

        data = r.json()
        session_id = data["sessionId"]
        lesson_title = data["lesson"]["title"]
        question_text = data["question"]["questionText"]
        print(f"   ✓ sessionId={session_id}")
        print(f"   ✓ lesson   ={lesson_title}")
        print(f"   ✓ question ={question_text}\n")

        # ── 3. Multi-turn chat ────────────────────────────────────────────────
        messages = [
            "I don't understand this question. Can you explain?",
            "Can you give me a simpler example?",
            "OK I think I get it now. What should I do next?",
        ]

        for turn, msg in enumerate(messages, start=1):
            print(f"── 3.{turn}. Chat turn {turn}")
            print(f"   Student: {msg}")
            r = await client.post(
                "/ai-tutor-api/tutor/chat",
                headers=HEADERS,
                json={
                    "sessionId": session_id,
                    "message": msg,
                    "avatarName": AVATAR,
                    "context": "doubt",
                },
            )
            if r.status_code != 200:
                print(f"   ✗ CHAT failed {r.status_code}: {r.text}")
                sys.exit(1)

            resp = r.json()
            print(f"   {AVATAR} : {resp['reply']}")
            print(f"   (turn={resp['conversationTurn']}  next={resp['suggestNextAction']})\n")
            await asyncio.sleep(0.5)  # brief pause between turns

        # ── 4. Verify history is kept (doubt endpoint)  ───────────────────────
        print("── 4. Doubt endpoint (backward-compat, should also use LLM)")
        r = await client.post(
            "/ai-tutor-api/tutor/doubt",
            headers=HEADERS,
            json={
                "sessionId": session_id,
                "message": "Why do we need to find the complement of a number?",
                "avatarName": AVATAR,
            },
        )
        if r.status_code != 200:
            print(f"   ✗ DOUBT failed {r.status_code}: {r.text}")
            sys.exit(1)

        resp = r.json()
        print(f"   {AVATAR} : {resp['reply']}")
        print(f"   (turn={resp['conversationTurn']})\n")

        print("── All tests passed ✓")


if __name__ == "__main__":
    asyncio.run(run_test())
