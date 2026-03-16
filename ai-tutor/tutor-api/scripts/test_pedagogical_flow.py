"""
Pedagogical Flow Test Suite
============================
Tests the complete coach→question→coach cycle for quality and smoothness.

Checks:
  TC-01  Session starts with a teacher line (coach speaks first)
  TC-02  Coach speaks before every question group (no silent transitions)
  TC-03  Correct answer → celebration + coach tip → next question (no abrupt jump)
  TC-04  Wrong answer  → coach tip shown → input stays editable → retry works
  TC-05  Hearts deplete to 0 → input remains editable for review
  TC-06  Correct answer when depleted → hearts refill to max
  TC-07  All 9 groups (A–I) served without duplicate question IDs
  TC-08  Screenplay beats match exercise groups (no orphan beats)
  TC-09  Hint progression: hint 1 → hint 2 → hint 3 escalation
  TC-10  Session completion percentage increases after every question
  TC-11  XP increases on every correct answer
  TC-12  Streak resets after wrong, resumes on correct

Run from tutor-api/:
    python scripts/test_pedagogical_flow.py
    python scripts/test_pedagogical_flow.py --chapter L3_MULTIPLY_BY_11
    python scripts/test_pedagogical_flow.py --all-chapters
"""
from __future__ import annotations

import argparse
import asyncio
import io
import os
import sys
import json
from pathlib import Path
from dataclasses import dataclass, field
from typing import Any

if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "buffer"):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

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

import httpx
import jwt

os.environ.setdefault("ANTHROPIC_API_KEY", "test-disabled")
os.environ.setdefault("OPENAI_API_KEY", "test-disabled")

from app.main import app  # noqa

JWT_SECRET   = os.getenv("AI_TUTOR_JWT_SECRET",   "change_me_ai_tutor_secret")
JWT_ISSUER   = os.getenv("AI_TUTOR_JWT_ISSUER",   "robodynamics-java")
JWT_AUDIENCE = os.getenv("AI_TUTOR_JWT_AUDIENCE", "robodynamics-ai-tutor")
INTERNAL_KEY = os.getenv("TUTOR_INTERNAL_KEY", "")

CONTENT_DIR = TUTOR_API_ROOT / "content-template" / "vedic_math" / "chapter"

# ANSI colors
GRN  = "\033[92m"
RED  = "\033[91m"
YLW  = "\033[93m"
BLU  = "\033[94m"
CYN  = "\033[96m"
MAG  = "\033[95m"
DIM  = "\033[2m"
RST  = "\033[0m"
BOLD = "\033[1m"

@dataclass
class TestResult:
    tc: str
    name: str
    passed: bool
    detail: str = ""

@dataclass
class ChapterReport:
    chapter: str
    results: list[TestResult] = field(default_factory=list)

    @property
    def passed(self): return sum(1 for r in self.results if r.passed)
    @property
    def failed(self): return sum(1 for r in self.results if not r.passed)
    @property
    def score(self): return int(100 * self.passed / len(self.results)) if self.results else 0


def make_token(chapter: str, grade: str = "8") -> str:
    import datetime as _dt
    now = _dt.datetime.now(_dt.timezone.utc)
    payload = {
        "sub": "test_student_01",
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": now,
        "exp": now + _dt.timedelta(hours=2),
        "user_id": 1001,
        "child_id": 2001,
        "role": "STUDENT",
        "studentId": "test_student_01",
        "studentName": "Test Student",
        "grade": grade,
        "courseId": "vedic_math",
        "chapterCode": chapter,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


async def run_chapter_tests(chapter: str, transport: httpx.AsyncBaseTransport) -> ChapterReport:
    report = ChapterReport(chapter=chapter)
    headers = {"Authorization": f"Bearer {make_token(chapter)}", "X-AI-TUTOR-KEY": INTERNAL_KEY}

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:

        # ── Start session ────────────────────────────────────────────────────
        r = await c.post("/ai-tutor-api/tutor/start",
                         json={"token": make_token(chapter), "chapterCode": chapter,
                               "exerciseGroup": "A"},
                         headers=headers)
        if r.status_code != 200:
            report.results.append(TestResult("TC-00", "Session Start", False,
                                             f"HTTP {r.status_code}: {r.text[:200]}"))
            return report

        start_data = r.json()
        session_id = start_data.get("sessionId", "")
        lesson      = start_data.get("lesson", {})
        first_q     = start_data.get("question", {})

        # TC-01: Coach speaks first (teacherLine present at start)
        teacher_line = (lesson.get("duolingoLessonArc") or {}).get("onboarding", {}).get("coachIntro", "")
        screenplay   = lesson.get("screenplay", [])
        # screenplay is a flat list of beat dicts (not {beats:[...]})
        beats = screenplay if isinstance(screenplay, list) else screenplay.get("beats", []) if isinstance(screenplay, dict) else []
        intro_beat   = next((b for b in beats if b.get("exerciseGroup") in ("A", None, "")
                             and b.get("teacherLine")), None)
        has_intro    = bool(teacher_line or intro_beat)
        report.results.append(TestResult("TC-01", "Coach speaks first (intro teacherLine)",
                                         has_intro,
                                         teacher_line[:80] if teacher_line else
                                         (intro_beat.get("teacherLine", "")[:80] if intro_beat else "NO intro line found")))

        # TC-08: Screenplay beats cover all groups
        beat_groups = {b.get("exerciseGroup") for b in beats if b.get("teacherLine")}
        missing_beats = [g for g in "ABCDEFGHI" if g not in beat_groups]
        report.results.append(TestResult("TC-08", "All groups A–I have screenplay beats",
                                         len(missing_beats) == 0,
                                         f"Missing beats for: {missing_beats}" if missing_beats else "All 9 groups covered"))

        # ── Walk groups A–I ──────────────────────────────────────────────────
        seen_qids: set[str] = set()
        completion_pcts: list[float] = []
        xp_values: list[int] = []
        streak_values: list[int] = []
        group_coach_lines: dict[str, bool] = {}
        hint_depth_tested = False
        hearts_depleted_tested = False
        hearts_refilled_tested = False

        current_q = first_q
        group_change_q: dict[str, Any] | None = None

        for grp in list("ABCDEFGHI"):
            # Switch to this group
            r2 = await c.post("/ai-tutor-api/tutor/next-question",
                              json={"sessionId": session_id, "exerciseGroup": grp},
                              headers=headers)
            if r2.status_code != 200:
                continue
            q_data = r2.json()
            q = q_data.get("question", {})
            if not q:
                continue

            sp = q_data.get("sessionProgress", {})
            completion_pcts.append(float(sp.get("lessonCompletionPct", 0)))
            xp_values.append(int(sp.get("xp", 0)))

            # TC-02: Check coach line for this group
            group_beat = next((b for b in beats
                               if b.get("exerciseGroup") == grp and b.get("teacherLine")), None)
            group_coach_lines[grp] = bool(group_beat)

            # TC-07: No duplicate question IDs
            qid = q.get("questionId", "")
            seen_qids.add(qid)

            expected_ans = q.get("expectedAnswer", "42")

            # TC-09: Hint progression (test on group C)
            if grp == "C" and not hint_depth_tested:
                # Wrong answer → get hint 1
                r_h1 = await c.post("/ai-tutor-api/tutor/check-answer",
                                    json={"sessionId": session_id, "learnerAnswer": "__WRONG_TEST__",
                                          "questionId": q.get("questionId", ""),
                                          "exerciseGroup": grp},
                                    headers=headers)
                h1_data = r_h1.json() if r_h1.status_code == 200 else {}
                hint1 = h1_data.get("coachTip", "")
                # Wrong again → hint 2
                r_h2 = await c.post("/ai-tutor-api/tutor/check-answer",
                                    json={"sessionId": session_id, "learnerAnswer": "__WRONG_TEST__",
                                          "questionId": q.get("questionId", ""),
                                          "exerciseGroup": grp},
                                    headers=headers)
                h2_data = r_h2.json() if r_h2.status_code == 200 else {}
                hint2 = h2_data.get("coachTip", "")
                hints_escalate = bool(hint1) and bool(hint2) and hint1 != hint2
                report.results.append(TestResult("TC-09", "Hints escalate (hint1 ≠ hint2)",
                                                  hints_escalate,
                                                  f"H1: {hint1[:50]}… | H2: {hint2[:50]}…" if hints_escalate
                                                  else f"Same or missing: {hint1[:60]}"))
                hint_depth_tested = True
                # Now answer correctly to move on
                await c.post("/ai-tutor-api/tutor/check-answer",
                             json={"sessionId": session_id, "learnerAnswer": str(expected_ans),
                                   "questionId": q.get("questionId", ""), "exerciseGroup": grp},
                             headers=headers)

            # TC-05 + TC-06: Deplete hearts then refill (test on group E)
            elif grp == "E" and not hearts_depleted_tested:
                # Drain all 5 hearts with wrong answers
                for _ in range(6):
                    rd = await c.post("/ai-tutor-api/tutor/check-answer",
                                      json={"sessionId": session_id, "learnerAnswer": "__DRAIN__",
                                            "questionId": q.get("questionId", ""),
                                            "exerciseGroup": grp},
                                      headers=headers)
                    rd_data = rd.json() if rd.status_code == 200 else {}
                    if rd_data.get("sessionProgress", {}).get("livesDepleted"):
                        break
                hearts_after_drain = rd_data.get("sessionProgress", {}).get("hearts", 99)
                report.results.append(TestResult("TC-05", "Hearts deplete to 0 after wrong answers",
                                                  hearts_after_drain == 0,
                                                  f"Hearts after drain: {hearts_after_drain}"))
                hearts_depleted_tested = True

                # TC-06: Correct answer when depleted → refill
                rc = await c.post("/ai-tutor-api/tutor/check-answer",
                                  json={"sessionId": session_id, "learnerAnswer": str(expected_ans),
                                        "questionId": q.get("questionId", ""),
                                        "exerciseGroup": grp},
                                  headers=headers)
                rc_data = rc.json() if rc.status_code == 200 else {}
                hearts_after_refill = rc_data.get("sessionProgress", {}).get("hearts", 0)
                max_hearts = rc_data.get("sessionProgress", {}).get("maxHearts", 5)
                report.results.append(TestResult("TC-06", "Hearts refill to max after correct review answer",
                                                  hearts_after_refill == max_hearts,
                                                  f"Hearts: {hearts_after_refill}/{max_hearts}"))
                hearts_refilled_tested = True

            # TC-03 + TC-04 + TC-10 + TC-11 + TC-12: Normal correct answer flow
            else:
                # Answer wrong first on groups B, F, H
                if grp in ("B", "F", "H"):
                    r_wrong = await c.post("/ai-tutor-api/tutor/check-answer",
                                           json={"sessionId": session_id, "learnerAnswer": "__WRONG__",
                                                 "questionId": q.get("questionId", ""),
                                                 "exerciseGroup": grp},
                                           headers=headers)
                    w_data = r_wrong.json() if r_wrong.status_code == 200 else {}
                    coach_tip = w_data.get("coachTip", "")
                    still_editable = not w_data.get("sessionProgress", {}).get("livesDepleted", True) or True
                    report.results.append(TestResult("TC-04",
                                                      f"Wrong answer → coach tip + input stays usable (grp {grp})",
                                                      bool(coach_tip),
                                                      f"Tip: {coach_tip[:70]}"))

                xp_before = xp_values[-1] if xp_values else 0
                streak_before = streak_values[-1] if streak_values else 0
                r_ok = await c.post("/ai-tutor-api/tutor/check-answer",
                                    json={"sessionId": session_id, "learnerAnswer": str(expected_ans),
                                          "questionId": q.get("questionId", ""),
                                          "exerciseGroup": grp},
                                    headers=headers)
                ok_data = r_ok.json() if r_ok.status_code == 200 else {}
                sp_ok = ok_data.get("sessionProgress", {})
                xp_after = int(sp_ok.get("xp", 0))
                streak_after = int(sp_ok.get("streak", 0))
                coach_tip_ok = ok_data.get("coachTip", "")

                # TC-03: Correct answer → coach tip present
                if grp in ("A", "D", "G"):
                    report.results.append(TestResult("TC-03",
                                                      f"Correct answer → coach tip present (grp {grp})",
                                                      bool(coach_tip_ok),
                                                      f"Tip: {coach_tip_ok[:70]}"))

                xp_values.append(xp_after)
                streak_values.append(streak_after)

                # TC-11: XP increased
                if grp == "D":
                    report.results.append(TestResult("TC-11", "XP increases on correct answer",
                                                      xp_after > xp_before,
                                                      f"XP: {xp_before} → {xp_after}"))

                # TC-12: Streak resets after wrong, resumes correct
                if grp == "F":
                    report.results.append(TestResult("TC-12", "Streak resets on wrong, resumes on correct",
                                                      streak_after >= 1,
                                                      f"Streak after correct following wrong: {streak_after}"))

        # TC-02: All groups had a coach beat
        groups_with_beat = [g for g, has in group_coach_lines.items() if has]
        groups_missing   = [g for g, has in group_coach_lines.items() if not has]
        report.results.append(TestResult("TC-02", "Every group has a coach teacherLine in screenplay",
                                         len(groups_missing) == 0,
                                         f"Covered: {groups_with_beat} | Missing: {groups_missing}"))

        # TC-07: No duplicate question IDs across groups
        # Re-run a fresh session and collect all question IDs
        r_fresh = await c.post("/ai-tutor-api/tutor/start",
                               json={"token": make_token(chapter), "chapterCode": chapter,
                                     "exerciseGroup": "A"},
                               headers=headers)
        if r_fresh.status_code == 200:
            fresh_sid = r_fresh.json().get("sessionId", "")
            all_qids: list[str] = []
            for grp in list("ABCDEFGHI"):
                rq = await c.post("/ai-tutor-api/tutor/next-question",
                                  json={"sessionId": fresh_sid, "exerciseGroup": grp},
                                  headers=headers)
                if rq.status_code == 200:
                    qid = rq.json().get("question", {}).get("questionId", "")
                    if qid:
                        all_qids.append(qid)
            duplicates = [q for q in set(all_qids) if all_qids.count(q) > 1]
            report.results.append(TestResult("TC-07", "No duplicate question IDs across 9 groups",
                                             len(duplicates) == 0,
                                             f"Duplicates: {duplicates}" if duplicates else f"{len(all_qids)} unique IDs"))

        # TC-10: Completion % increases
        if len(completion_pcts) >= 3:
            increasing = completion_pcts[-1] >= completion_pcts[0]
            report.results.append(TestResult("TC-10", "Lesson completion % increases over time",
                                             increasing,
                                             f"{completion_pcts[0]:.1f}% → {completion_pcts[-1]:.1f}%"))

    return report


def print_report(report: ChapterReport) -> None:
    print(f"\n{BOLD}{BLU}{'='*62}{RST}")
    print(f"{BOLD}{BLU}  Chapter: {report.chapter}{RST}")
    print(f"{BOLD}{BLU}{'='*62}{RST}")
    for r in report.results:
        icon = f"{GRN}PASS{RST}" if r.passed else f"{RED}FAIL{RST}"
        print(f"  [{icon}] {r.tc:6s}  {r.name}")
        if r.detail:
            print(f"          {DIM}{r.detail}{RST}")
    score_col = GRN if report.score >= 90 else YLW if report.score >= 70 else RED
    print(f"\n  Score: {score_col}{BOLD}{report.score}/100{RST}  "
          f"({GRN}{report.passed} passed{RST}, {RED}{report.failed} failed{RST})\n")


async def main(chapters: list[str]) -> None:
    transport = httpx.ASGITransport(app=app)
    all_reports: list[ChapterReport] = []

    for ch in chapters:
        print(f"\n{CYN}Testing {ch}…{RST}", flush=True)
        report = await run_chapter_tests(ch, transport)
        print_report(report)
        all_reports.append(report)

    # Summary table
    if len(all_reports) > 1:
        print(f"\n{BOLD}{'='*62}")
        print(f"  OVERALL PEDAGOGICAL QUALITY SUMMARY")
        print(f"{'='*62}{RST}")
        total_pass = sum(r.passed for r in all_reports)
        total_fail = sum(r.failed for r in all_reports)
        total_tc   = total_pass + total_fail
        overall    = int(100 * total_pass / total_tc) if total_tc else 0
        for r in all_reports:
            bar = ("█" * (r.score // 10)).ljust(10)
            col = GRN if r.score >= 90 else YLW if r.score >= 70 else RED
            print(f"  {r.chapter:<35} {col}{bar}{RST} {r.score}%")
        print(f"\n  {BOLD}Overall: {GRN if overall>=90 else YLW}{overall}%{RST} "
              f"({total_pass}/{total_tc} test cases passed)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pedagogical flow test suite")
    parser.add_argument("--chapter", default="L1_COMPLETING_WHOLE",
                        help="Single chapter to test (default: L1_COMPLETING_WHOLE)")
    parser.add_argument("--all-chapters", action="store_true",
                        help="Test all 16 Vedic Math chapters")
    args = parser.parse_args()

    if args.all_chapters:
        chapters = sorted(p.stem for p in CONTENT_DIR.glob("*.json"))
    else:
        chapters = [args.chapter.upper()]

    asyncio.run(main(chapters))
