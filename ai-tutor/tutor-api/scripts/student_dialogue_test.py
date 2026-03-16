"""
Interactive student dialogue simulation for the AI Tutor.

Simulates a Grade-8 student going through L1 (Completing the Whole) with
realistic behaviour: a mix of correct first-try, one wrong-then-right, and
a mid-session doubt question (calls the LLM ConversationEngine).

Run from the tutor-api/ directory:
    python scripts/student_dialogue_test.py

Optional flags:
    --chapter   L1_COMPLETING_WHOLE   (default)
    --groups    A,B,C                 comma-separated groups to test (default: all)
    --ask-doubt B                     fire a doubt after this group
    --no-llm                          skip LLM doubt call (offline / CI mode)
"""
from __future__ import annotations

import argparse
import asyncio
import io
import os
import sys
import textwrap

# Force UTF-8 output on Windows terminals (cp1252 can't render box/emoji chars)
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "buffer"):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ── Auto-load .env ────────────────────────────────────────────────────────────
_env_path = Path(__file__).parent.parent / ".env"
if _env_path.exists():
    for _line in _env_path.read_text(encoding="utf-8").splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _k, _, _v = _line.partition("=")
            os.environ.setdefault(_k.strip(), _v.strip())

TUTOR_API_ROOT = Path(__file__).resolve().parents[1]
if str(TUTOR_API_ROOT) not in sys.path:
    sys.path.insert(0, str(TUTOR_API_ROOT))

import httpx  # noqa: E402
import jwt    # noqa: E402

from app.main import app  # noqa: E402  (in-process ASGI)

# ── Config ────────────────────────────────────────────────────────────────────
JWT_SECRET   = os.getenv("AI_TUTOR_JWT_SECRET",   "change_me_ai_tutor_secret")
JWT_ISSUER   = os.getenv("AI_TUTOR_JWT_ISSUER",   "robodynamics-java")
JWT_AUDIENCE = os.getenv("AI_TUTOR_JWT_AUDIENCE", "robodynamics-ai-tutor")
INTERNAL_KEY = os.getenv("TUTOR_INTERNAL_KEY", "")
AVATAR_NAME  = "Raj"

# Groups where the student answers wrong first (to test retry + feedback)
WRONG_FIRST_GROUPS = {"B", "E", "H"}


# ── Colours / formatting ──────────────────────────────────────────────────────
RESET  = "\033[0m"
BOLD   = "\033[1m"
CYAN   = "\033[96m"
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
GREY   = "\033[90m"
PINK   = "\033[95m"


def hr(char="─", n=72) -> str:
    return char * n


def wrap(text: str, width: int = 70, indent: str = "   ") -> str:
    return textwrap.fill(str(text or ""), width=width, initial_indent=indent,
                         subsequent_indent=indent)


def banner(title: str) -> None:
    print(f"\n{BOLD}{CYAN}{hr()}{RESET}")
    print(f"{BOLD}{CYAN}  {title}{RESET}")
    print(f"{BOLD}{CYAN}{hr()}{RESET}")


def teacher(text: str) -> None:
    print(f"\n{PINK}🤖 Raj:{RESET}")
    print(wrap(text, indent="     "))


def student_says(text: str) -> None:
    print(f"\n{CYAN}🧑 Student:{RESET} {BOLD}{text}{RESET}")


def ok(text: str) -> None:
    print(f"   {GREEN}✅ {text}{RESET}")


def wrong(text: str) -> None:
    print(f"   {RED}❌ {text}{RESET}")


def hint_line(text: str) -> None:
    if text:
        print(f"   {YELLOW}💡 Hint: {text}{RESET}")


def stats_line(progress: dict) -> None:
    hearts  = progress.get("hearts", "?")
    xp      = progress.get("xp", "?")
    streak  = progress.get("streak", "?")
    pct     = progress.get("lessonCompletionPct", 0)
    print(f"   {GREY}♥ {hearts}  ⚡ {xp} XP  🔥 {streak} streak  📊 {pct:.0f}% complete{RESET}")


# ── Auth helpers ──────────────────────────────────────────────────────────────
def make_token() -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "student-dialogue-test",
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=2)).timestamp()),
        "user_id": 99902,
        "child_id": None,
        "role": "STUDENT",
        "module": "VEDIC_MATH",
        "grade": "8",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def make_headers() -> dict:
    h = {"Content-Type": "application/json"}
    if INTERNAL_KEY:
        h["X-AI-TUTOR-KEY"] = INTERNAL_KEY
    return h


def make_wrong_answer(expected: str) -> str:
    """Return a plausible wrong answer for the expected value."""
    import re
    text = str(expected or "").strip()
    if not text:
        return "not sure"
    if re.fullmatch(r"-?\d+", text):
        return str(int(text) + 1)
    if re.fullmatch(r"-?\d+\.\d+", text):
        return f"{float(text) + 1.0:.2f}".rstrip("0").rstrip(".")
    if text.lower() in {"yes", "true"}:
        return "no"
    if text.lower() in {"no", "false"}:
        return "yes"
    return "not sure"


# ── Main simulation ───────────────────────────────────────────────────────────
async def run_dialogue(args: argparse.Namespace) -> None:
    headers = make_headers()
    token   = make_token()
    transport = httpx.ASGITransport(app=app)

    async with httpx.AsyncClient(transport=transport, base_url="http://testserver",
                                 timeout=60.0) as client:

        # ── Health ────────────────────────────────────────────────────────────
        banner("RoboDynamics AI Tutor — Student Dialogue Simulation")
        r = await client.get("/health", headers=headers)
        r.raise_for_status()
        health = r.json()
        print(f"\n{GREY}Backend: ok={health['ok']}  "
              f"courses={[c.get('courseId') for c in health.get('courses', [])]}{RESET}")

        # ── Start session ─────────────────────────────────────────────────────
        r = await client.post(
            "/ai-tutor-api/tutor/start",
            headers=headers,
            json={
                "token": token,
                "courseId": "vedic_math",
                "chapterCode": args.chapter,
                "exerciseGroup": "A",
            },
        )
        r.raise_for_status()
        data = r.json()

        session_id    = data["sessionId"]
        lesson_title  = data["lesson"]["title"]
        lesson_goals  = data["lesson"].get("learningGoals", [])
        exercise_flow = data["lesson"].get("exerciseFlow", [])
        current_q     = data["question"]
        current_group = data.get("activeExerciseGroup", "A")
        course_id     = data.get("courseId", "vedic_math")

        print(f"\n{BOLD}Lesson   :{RESET} {lesson_title}")
        print(f"{BOLD}Session  :{RESET} {GREY}{session_id}{RESET}")
        print(f"{BOLD}Goals    :{RESET}")
        for g in lesson_goals[:4]:
            print(f"  • {g}")

        # Filter to requested groups
        requested = set(args.groups.upper().split(",")) if args.groups else None
        doubt_after = args.ask_doubt.upper() if args.ask_doubt else None

        # ── Walk each exercise group ──────────────────────────────────────────
        for idx, flow_item in enumerate(exercise_flow):
            group = str(flow_item.get("exerciseGroup", "A"))
            if requested and group not in requested:
                # Still need to advance the question pointer
                if idx > 0:
                    await client.post(
                        "/ai-tutor-api/tutor/next-question",
                        headers=headers,
                        json={
                            "sessionId": session_id,
                            "courseId": course_id,
                            "chapterCode": args.chapter,
                            "exerciseGroup": group,
                        },
                    )
                continue

            subtopic = str(flow_item.get("subtopic", "Practice"))

            # Fetch next question (skip for group=A which is already in start response)
            if idx > 0:
                r = await client.post(
                    "/ai-tutor-api/tutor/next-question",
                    headers=headers,
                    json={
                        "sessionId": session_id,
                        "courseId": course_id,
                        "chapterCode": args.chapter,
                        "exerciseGroup": group,
                    },
                )
                r.raise_for_status()
                nq = r.json()
                current_q     = nq["question"]
                current_group = nq.get("activeExerciseGroup", group)

            q_text   = current_q.get("questionText", "")
            q_hint   = current_q.get("hint", "")
            q_id     = current_q.get("questionId", "")
            expected = str(current_q.get("expectedAnswer", "")).strip()

            # ── Print group header ────────────────────────────────────────────
            print(f"\n\n{BOLD}━━ Group {group}: {subtopic} ━━{RESET}")

            # ── Screenplay teacher line for this group (if available) ─────────
            screenplay = data["lesson"].get("screenplay", [])
            beat = next(
                (b for b in screenplay
                 if b.get("exerciseGroup") == group and b.get("cue") in ("intro", "teach")),
                None,
            )
            if beat and beat.get("teacherLine"):
                teacher(beat["teacherLine"])

            # ── Show question ─────────────────────────────────────────────────
            print(f"\n{BOLD}   📝 Question:{RESET} {q_text}")
            hint_line(q_hint)

            # ── Wrong attempt first (for designated groups) ───────────────────
            if group in WRONG_FIRST_GROUPS and expected:
                wrong_ans = make_wrong_answer(expected)
                student_says(wrong_ans)
                r = await client.post(
                    "/ai-tutor-api/tutor/check-answer",
                    headers=headers,
                    json={
                        "sessionId": session_id,
                        "questionId": q_id,
                        "learnerAnswer": wrong_ans,
                        "responseTimeMs": 7800,
                        "confidence": "low",
                    },
                )
                r.raise_for_status()
                resp = r.json()
                if resp.get("correct"):
                    ok(f"Surprisingly accepted: {wrong_ans}")
                else:
                    wrong(f"Incorrect — {resp.get('feedback') or 'Try again.'}")
                    if resp.get("hint"):
                        hint_line(resp["hint"])
                stats_line(resp.get("sessionProgress") or {})

            # ── Correct attempt ───────────────────────────────────────────────
            student_says(expected or "not sure")
            r = await client.post(
                "/ai-tutor-api/tutor/check-answer",
                headers=headers,
                json={
                    "sessionId": session_id,
                    "questionId": q_id,
                    "learnerAnswer": expected or "not sure",
                    "responseTimeMs": 4200,
                    "confidence": "medium",
                },
            )
            r.raise_for_status()
            resp = r.json()
            progress = resp.get("sessionProgress") or {}

            if resp.get("correct"):
                feedback = resp.get("feedback") or "Well done!"
                ok(feedback)
            else:
                wrong(f"Expected answer REJECTED — check content: expected={expected!r}")

            stats_line(progress)

            # ── Doubt turn (calls LLM if enabled) ────────────────────────────
            if doubt_after and group == doubt_after and not args.no_llm:
                print(f"\n{YELLOW}💬 Doubt turn after Group {group}:{RESET}")
                doubt_msg = (
                    f"I got the answer {expected} but I'm not sure why. "
                    f"Can you explain this step by step?"
                )
                student_says(doubt_msg)
                try:
                    r = await client.post(
                        "/ai-tutor-api/tutor/chat",
                        headers=headers,
                        json={
                            "sessionId": session_id,
                            "message": doubt_msg,
                            "avatarName": AVATAR_NAME,
                            "context": "doubt",
                        },
                    )
                    r.raise_for_status()
                    chat_resp = r.json()
                    teacher(chat_resp.get("reply", "(no reply)"))
                    next_action = chat_resp.get("suggestNextAction", "")
                    if next_action:
                        print(f"   {GREY}→ suggested next: {next_action}{RESET}")
                except Exception as e:
                    print(f"   {RED}LLM doubt call failed: {e}{RESET}")
                    print(f"   {GREY}(set --no-llm to skip doubt calls){RESET}")

        # ── Final summary ─────────────────────────────────────────────────────
        banner("Session Complete")
        last_progress = progress
        print(f"\n  Hearts   : {last_progress.get('hearts', '?')} / {last_progress.get('maxHearts', 5)}")
        print(f"  XP       : {last_progress.get('xp', '?')}")
        print(f"  Streak   : {last_progress.get('streak', '?')}")
        print(f"  Mastery  : {last_progress.get('masteryPct', 0):.1f}%")
        print(f"  Complete : {last_progress.get('lessonCompletionPct', 0):.0f}%")
        verdict = (
            "🏆 Excellent session!" if last_progress.get("lessonCompletionPct", 0) >= 100
            else "✅ Good progress — keep going!"
        )
        print(f"\n  {BOLD}{GREEN}{verdict}{RESET}\n")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Student dialogue simulation for AI Tutor")
    p.add_argument("--chapter",    default="L1_COMPLETING_WHOLE",
                   help="Chapter code to test")
    p.add_argument("--groups",     default="",
                   help="Comma-separated groups to run (default: all)")
    p.add_argument("--ask-doubt",  default="B",
                   help="Ask a doubt after this group (default: B). Set empty to skip.")
    p.add_argument("--no-llm",     action="store_true",
                   help="Skip LLM calls (offline mode)")
    return p.parse_args()


if __name__ == "__main__":
    asyncio.run(run_dialogue(parse_args()))
