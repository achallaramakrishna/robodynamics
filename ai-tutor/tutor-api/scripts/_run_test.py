"""Temporary ASCII-safe test runner for Windows cmd/cp1252 terminals."""
import asyncio
import os
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Auto-load .env
_env_path = Path(__file__).parent.parent / ".env"
if _env_path.exists():
    for _line in _env_path.read_text().splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _key, _, _val = _line.partition("=")
            os.environ.setdefault(_key.strip(), _val.strip())

import httpx
import jwt

BASE_URL = os.getenv("BASE_URL", "http://localhost:8091")
JWT_SECRET = os.getenv("AI_TUTOR_JWT_SECRET", "change_me_ai_tutor_secret")
JWT_ISSUER = os.getenv("AI_TUTOR_JWT_ISSUER", "robodynamics-java")
JWT_AUDIENCE = os.getenv("AI_TUTOR_JWT_AUDIENCE", "robodynamics-ai-tutor")
INTERNAL_KEY = os.getenv("TUTOR_INTERNAL_KEY", "")
AVATAR = "Arya"

HEADERS = {"Content-Type": "application/json"}
if INTERNAL_KEY:
    HEADERS["X-AI-TUTOR-KEY"] = INTERNAL_KEY


def make_token():
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
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
        },
        JWT_SECRET,
        algorithm="HS256",
    )


async def run():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=30) as c:

        # --- 1. Health ---
        r = await c.get("/health")
        h = r.json()
        print("[1] Health OK =", h["ok"])
        print("    Courses:", [x["courseId"] for x in h["courses"]])

        # --- 2. Start session ---
        r = await c.post(
            "/ai-tutor-api/tutor/start",
            headers=HEADERS,
            json={
                "token": make_token(),
                "courseId": "vedic_math",
                "chapterCode": "VEDIC_CH1",
                "exerciseGroup": "A",
            },
        )
        if r.status_code != 200:
            print("[2] START FAILED:", r.status_code, r.text[:300])
            sys.exit(1)
        d = r.json()
        sid = d["sessionId"]
        print("[2] Session ID :", sid)
        print("    Lesson     :", d["lesson"]["title"])
        print("    Question   :", d["question"]["questionText"])

        # --- 3. Multi-turn chat ---
        messages = [
            "I don't understand this question. Can you explain?",
            "Can you give me a simpler example?",
            "OK I think I get it now. What should I do next?",
        ]
        for i, msg in enumerate(messages, 1):
            r = await c.post(
                "/ai-tutor-api/tutor/chat",
                headers=HEADERS,
                json={"sessionId": sid, "message": msg, "avatarName": AVATAR, "context": "doubt"},
            )
            if r.status_code != 200:
                print(f"[3.{i}] CHAT FAILED:", r.status_code, r.text[:300])
                sys.exit(1)
            resp = r.json()
            reply_safe = resp['reply'].encode(sys.stdout.encoding or 'utf-8', errors='replace').decode(sys.stdout.encoding or 'utf-8', errors='replace')
            print(f"\n[3.{i}] Student : {msg}")
            print(f"       {AVATAR}   : {reply_safe}")
            print(f"       turn={resp['conversationTurn']}  next={resp['suggestNextAction']}")
            await asyncio.sleep(0.3)

        print("\n[PASS] All tests passed - Claude is responding!")


def safe_print(*args):
    """Print safely on Windows terminals that don't support full Unicode."""
    text = " ".join(str(a) for a in args)
    print(text.encode(sys.stdout.encoding or "utf-8", errors="replace").decode(sys.stdout.encoding or "utf-8", errors="replace"))


if __name__ == "__main__":
    asyncio.run(run())
