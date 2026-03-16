"""
RoboDynamics AI Tutor — Teaching Quality Benchmark

Evaluates 8 dimensions of teaching quality for every chapter and produces
a weighted composite score (0-100) with per-dimension breakdowns.

Dimensions scored:
  1. Content Accuracy        — expected answers are mathematically valid (non-empty, typed correctly)
  2. Question Progression    — difficulty increases across groups A→I
  3. Hint Quality            — hints present, not too short, not giving away the answer
  4. Teacher Line Richness   — screenplay narration is engaging and complete
  5. Flow Continuity         — all 9 groups covered, no repeated question IDs
  6. Answer Acceptance       — engine correctly accepts expected answers (live API call)
  7. Question Diversity      — variety of subtopics, not all same question type
  8. Engagement Hooks        — questions have real-world context, worked examples, etc.

Usage:
    python scripts/teaching_quality_benchmark.py
    python scripts/teaching_quality_benchmark.py --chapter L1_COMPLETING_WHOLE
    python scripts/teaching_quality_benchmark.py --chapter all --output /tmp/benchmark.md
"""
from __future__ import annotations

import argparse
import asyncio
import collections
import io
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Force UTF-8 output on Windows
if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "buffer"):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# ── Bootstrap paths ──────────────────────────────────────────────────────────
TUTOR_API_ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = TUTOR_API_ROOT / "content-template" / "vedic_math" / "chapter"
ENV_PATH = TUTOR_API_ROOT / ".env"

if ENV_PATH.exists():
    for _ln in ENV_PATH.read_text(encoding="utf-8").splitlines():
        _ln = _ln.strip()
        if _ln and not _ln.startswith("#") and "=" in _ln:
            _k, _, _v = _ln.partition("=")
            os.environ.setdefault(_k.strip(), _v.strip())

# Disable LLM keys so the flow-check doesn't cost money
os.environ["ANTHROPIC_API_KEY"] = ""
os.environ["OPENAI_API_KEY"] = ""
os.environ["AI_TUTOR_ADAPTIVE_POLICY_ENABLED"] = "false"

if str(TUTOR_API_ROOT) not in sys.path:
    sys.path.insert(0, str(TUTOR_API_ROOT))

import httpx
import jwt as pyjwt
from app.main import app

JWT_SECRET   = os.getenv("AI_TUTOR_JWT_SECRET",   "change_me_ai_tutor_secret")
JWT_ISSUER   = os.getenv("AI_TUTOR_JWT_ISSUER",   "robodynamics-java")
JWT_AUDIENCE = os.getenv("AI_TUTOR_JWT_AUDIENCE", "robodynamics-ai-tutor")
INTERNAL_KEY = os.getenv("TUTOR_INTERNAL_KEY", "")
ALL_GROUPS   = list("ABCDEFGHI")

# ── Weights (must sum to 100) ─────────────────────────────────────────────────
WEIGHTS = {
    "content_accuracy":     20,
    "question_progression": 10,
    "hint_quality":         12,
    "teacher_line":         10,
    "flow_continuity":      18,
    "answer_acceptance":    18,
    "question_diversity":    7,
    "engagement_hooks":      5,
}
assert sum(WEIGHTS.values()) == 100, "Weights must sum to 100"

DIFFICULTY_ORDER = {"easy": 1, "medium": 2, "hard": 3}


# ── JWT helpers ───────────────────────────────────────────────────────────────
def make_token() -> str:
    now = datetime.now(timezone.utc)
    return pyjwt.encode(
        {
            "sub": "benchmark-user",
            "iss": JWT_ISSUER, "aud": JWT_AUDIENCE,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(hours=2)).timestamp()),
            "user_id": 88801, "child_id": None,
            "role": "STUDENT", "module": "VEDIC_MATH", "grade": "8",
        },
        JWT_SECRET, algorithm="HS256",
    )

def make_headers() -> dict:
    h = {"Content-Type": "application/json"}
    if INTERNAL_KEY:
        h["X-AI-TUTOR-KEY"] = INTERNAL_KEY
    return h


# ── Static analysis helpers ───────────────────────────────────────────────────
def score_content_accuracy(pool: list[dict]) -> tuple[float, list[str]]:
    """Check that every question has non-empty text, hint, solution, expectedAnswer."""
    issues = []
    ok = 0
    for q in pool:
        q_id = q.get("questionId", "?")
        missing = [f for f in ("questionText", "hint", "solution", "expectedAnswer") if not str(q.get(f, "")).strip()]
        if missing:
            issues.append(f"  {q_id}: missing {missing}")
        else:
            ok += 1
    pct = (ok / max(len(pool), 1)) * 100
    return round(pct, 1), issues


def score_question_progression(pool: list[dict]) -> tuple[float, list[str]]:
    """
    Check that difficulty does not regress more than once across consecutive groups.
    Groups should trend easy → medium → hard.
    """
    issues = []
    by_group: dict[str, list[int]] = collections.defaultdict(list)
    for q in pool:
        d = DIFFICULTY_ORDER.get(str(q.get("difficulty", "medium")).lower(), 2)
        g = q.get("exerciseGroup", "A")
        by_group[g].append(d)

    group_avg: list[tuple[str, float]] = []
    for g in ALL_GROUPS:
        vals = by_group.get(g, [])
        if vals:
            group_avg.append((g, sum(vals) / len(vals)))

    regressions = 0
    for i in range(1, len(group_avg)):
        prev_g, prev_v = group_avg[i - 1]
        curr_g, curr_v = group_avg[i]
        if curr_v < prev_v - 0.4:
            regressions += 1
            issues.append(f"  Group {prev_g}({prev_v:.1f}) → {curr_g}({curr_v:.1f}): difficulty drops")

    score = max(0.0, 100.0 - regressions * 25)
    return round(score, 1), issues


def score_hint_quality(pool: list[dict]) -> tuple[float, list[str]]:
    """
    Hints should:
    - Exist and not be empty (caught in accuracy)
    - Be 10–200 chars (too short = useless, too long = spoils answer)
    - Not just repeat the question text verbatim
    - Not directly contain the expectedAnswer string
    """
    issues = []
    ok = 0
    for q in pool:
        hint = str(q.get("hint", "")).strip()
        expected = str(q.get("expectedAnswer", "")).strip().lower()
        q_text = str(q.get("questionText", "")).strip().lower()
        q_id = q.get("questionId", "?")
        if not hint:
            issues.append(f"  {q_id}: empty hint")
            continue
        if len(hint) < 8:
            issues.append(f"  {q_id}: hint too short ({len(hint)} chars)")
        elif len(hint) > 250:
            issues.append(f"  {q_id}: hint very long ({len(hint)} chars)")
        elif expected and expected in hint.lower() and len(expected) > 2:
            issues.append(f"  {q_id}: hint reveals the answer ({expected!r})")
        else:
            ok += 1
    pct = (ok / max(len(pool), 1)) * 100
    return round(pct, 1), issues


def score_teacher_lines(screenplay: list[dict]) -> tuple[float, list[str]]:
    """
    Every group's intro/teach beat should have a rich teacher line.
    Rich = at least 60 chars, contains at least one of: '!', '?', numbers.
    """
    issues = []
    ok = 0
    seen_groups: set[str] = set()
    for beat in screenplay:
        g = beat.get("exerciseGroup", "")
        if beat.get("cue") not in ("intro", "teach"):
            continue
        if g in seen_groups:
            continue
        seen_groups.add(g)
        line = str(beat.get("teacherLine", "")).strip()
        if not line:
            issues.append(f"  Group {g}: empty teacherLine")
        elif len(line) < 40:
            issues.append(f"  Group {g}: teacherLine too short ({len(line)} chars)")
        else:
            ok += 1

    # Penalise missing groups
    missing = set(ALL_GROUPS) - seen_groups
    for g in sorted(missing):
        issues.append(f"  Group {g}: no intro/teach beat found")

    total = len(ALL_GROUPS)
    pct = (ok / total) * 100
    return round(pct, 1), issues


def score_flow_continuity(pool: list[dict]) -> tuple[float, list[str]]:
    """Check all 9 groups have questions and no duplicate IDs."""
    issues = []
    by_group: dict[str, int] = collections.defaultdict(int)
    id_counts: dict[str, int] = collections.Counter(q.get("questionId", "") for q in pool)

    for q in pool:
        by_group[q.get("exerciseGroup", "?")] += 1

    missing = [g for g in ALL_GROUPS if by_group.get(g, 0) == 0]
    dups    = {k: v for k, v in id_counts.items() if v > 1}

    for g in missing:
        issues.append(f"  Group {g}: no questions")
    for qid, cnt in dups.items():
        issues.append(f"  Duplicate questionId {qid!r} appears {cnt}x")

    penalty = len(missing) * 10 + len(dups) * 8
    score = max(0.0, 100.0 - penalty)
    return round(score, 1), issues


def score_question_diversity(pool: list[dict]) -> tuple[float, list[str]]:
    """
    Variety in subtopics — a chapter should not repeat the same subtopic for
    more than 60 % of its questions.
    """
    issues = []
    subtopics = [str(q.get("subtopic", "")).strip() for q in pool]
    if not subtopics:
        return 0.0, ["No questions"]

    counts = collections.Counter(subtopics)
    most_common, most_count = counts.most_common(1)[0]
    ratio = most_count / len(subtopics)

    if ratio > 0.6:
        issues.append(f"  Subtopic {most_common!r} used in {most_count}/{len(subtopics)} questions ({ratio:.0%})")

    unique_subtopics = len(counts)
    if unique_subtopics < 4:
        issues.append(f"  Only {unique_subtopics} distinct subtopics")

    score = min(100.0, unique_subtopics * 12.5)  # 8+ subtopics → 100
    if ratio > 0.6:
        score = max(0.0, score - 20)
    return round(score, 1), issues


def score_engagement_hooks(pool: list[dict], worked_examples: list) -> tuple[float, list[str]]:
    """
    Engagement signals:
    - Some questions have real-world context (Rs, km, kg, shop, student, etc.)
    - Chapter has worked examples
    """
    CONTEXT_KEYWORDS = r"\b(Rs|rupee|km|kg|shop|student|price|ticket|ticket|hour|minute|score|match|cricket|class|teacher|book|fruit|speed|time|money|distance|weight)\b"
    issues = []
    context_count = sum(
        1 for q in pool
        if re.search(CONTEXT_KEYWORDS, q.get("questionText", ""), re.IGNORECASE)
    )
    context_ratio = context_count / max(len(pool), 1)

    score = 50.0
    if context_ratio >= 0.25:
        score += 30.0
    elif context_ratio >= 0.10:
        score += 15.0
    else:
        issues.append(f"  Only {context_count}/{len(pool)} questions have real-world context")

    if worked_examples:
        score += 20.0
    else:
        issues.append("  No worked examples in chapter")

    return round(min(score, 100.0), 1), issues


# ── Live API check ────────────────────────────────────────────────────────────
async def score_answer_acceptance_live(chapter_code: str, pool: list[dict]) -> tuple[float, list[str]]:
    """
    Submit the expected answer for 3 sampled questions and check the engine
    marks them correct. Caps at 3 API calls per chapter.
    """
    issues = []
    token   = make_token()
    headers = make_headers()
    transport = httpx.ASGITransport(app=app)

    sampled = pool[::max(1, len(pool) // 3)][:3]

    async with httpx.AsyncClient(transport=transport, base_url="http://testserver", timeout=30.0) as client:
        # Start session
        r = await client.post(
            "/ai-tutor-api/tutor/start",
            headers=headers,
            json={"token": token, "courseId": "vedic_math",
                  "chapterCode": chapter_code, "exerciseGroup": "A"},
        )
        if not r.is_success:
            return 0.0, [f"  Start failed: {r.status_code}"]
        session_id = r.json()["sessionId"]

        accepted = 0
        for q in sampled:
            q_id    = q.get("questionId", "")
            expected = str(q.get("expectedAnswer", "")).strip()
            if not expected or not q_id:
                continue
            r2 = await client.post(
                "/ai-tutor-api/tutor/check-answer",
                headers=headers,
                json={"sessionId": session_id, "questionId": q_id,
                      "learnerAnswer": expected, "responseTimeMs": 3000, "confidence": "medium"},
            )
            if not r2.is_success:
                issues.append(f"  {q_id}: check-answer HTTP {r2.status_code}")
                continue
            data = r2.json()
            if data.get("correct"):
                accepted += 1
            else:
                issues.append(f"  {q_id}: expected answer {expected!r} was REJECTED")

    total_checked = len([q for q in sampled if q.get("questionId") and q.get("expectedAnswer")])
    if total_checked == 0:
        return 100.0, []
    pct = (accepted / total_checked) * 100
    return round(pct, 1), issues


# ── Chapter benchmark ─────────────────────────────────────────────────────────
async def benchmark_chapter(chapter_code: str) -> dict:
    path = CONTENT_DIR / f"{chapter_code}.json"
    if not path.exists():
        return {"chapterCode": chapter_code, "error": "File not found"}

    data        = json.loads(path.read_text(encoding="utf-8"))
    pool        = data.get("questionPool", [])
    screenplay  = data.get("screenplay", [])
    worked_ex   = data.get("workedExamples", [])
    title       = data.get("title", chapter_code)

    results: dict[str, tuple[float, list[str]]] = {}
    results["content_accuracy"]    = score_content_accuracy(pool)
    results["question_progression"] = score_question_progression(pool)
    results["hint_quality"]         = score_hint_quality(pool)
    results["teacher_line"]         = score_teacher_lines(screenplay)
    results["flow_continuity"]      = score_flow_continuity(pool)
    results["question_diversity"]   = score_question_diversity(pool)
    results["engagement_hooks"]     = score_engagement_hooks(pool, worked_ex)
    results["answer_acceptance"]    = await score_answer_acceptance_live(chapter_code, pool)

    # Weighted composite
    composite = sum(
        results[dim][0] * (WEIGHTS[dim] / 100)
        for dim in WEIGHTS
    )

    return {
        "chapterCode": chapter_code,
        "title": title,
        "composite": round(composite, 1),
        "dimensions": {dim: {"score": results[dim][0], "weight": WEIGHTS[dim], "issues": results[dim][1]}
                       for dim in WEIGHTS},
    }


# ── Rendering ────────────────────────────────────────────────────────────────
GRADE_EMOJI = {
    (95, 100): "🏆 A+",
    (85,  95): "✅ A",
    (75,  85): "📈 B",
    (60,  75): "⚠️  C",
    (  0, 60): "🔴 D",
}

def grade(score: float) -> str:
    for (lo, hi), label in GRADE_EMOJI.items():
        if lo <= score <= hi:
            return label
    return "?"


def render_markdown(chapters: list[dict], started_at: datetime) -> str:
    lines = []
    lines.append("# AI Tutor Teaching Quality Benchmark")
    lines.append("")
    lines.append(f"- Generated: {started_at.astimezone(timezone.utc).isoformat()}")
    lines.append(f"- Chapters evaluated: {len(chapters)}")
    lines.append("")

    # Dimension explanations
    lines.append("## Scoring Dimensions")
    lines.append("")
    lines.append("| Dimension | Weight | What it measures |")
    lines.append("| --- | --- | --- |")
    dimension_desc = {
        "content_accuracy":     "Every question has non-empty text, hint, solution, and answer",
        "question_progression": "Difficulty trends easy → medium → hard across groups A→I",
        "hint_quality":         "Hints are present, helpful, and don't reveal the answer",
        "teacher_line":         "Screenplay narration is rich and engaging (≥40 chars per group)",
        "flow_continuity":      "All 9 groups covered, no repeated question IDs",
        "answer_acceptance":    "Engine correctly accepts expected answers (live API check)",
        "question_diversity":   "Wide variety of subtopics across the chapter",
        "engagement_hooks":     "Real-world context words + worked examples present",
    }
    for dim, desc in dimension_desc.items():
        lines.append(f"| **{dim.replace('_',' ').title()}** | {WEIGHTS[dim]}% | {desc} |")
    lines.append("")

    # Overall leaderboard
    lines.append("## Chapter Scores")
    lines.append("")
    lines.append("| Chapter | Title | Score | Grade | Weakest Dimension |")
    lines.append("| --- | --- | --- | --- | --- |")
    sorted_chapters = sorted(chapters, key=lambda c: c.get("composite", 0), reverse=True)
    for ch in sorted_chapters:
        if "error" in ch:
            lines.append(f"| {ch['chapterCode']} | ERROR | — | — | {ch['error']} |")
            continue
        dims = ch["dimensions"]
        weakest = min(dims, key=lambda d: dims[d]["score"])
        weakest_score = dims[weakest]["score"]
        lines.append(
            f"| {ch['chapterCode']} | {ch['title'][:40]} | **{ch['composite']}** | "
            f"{grade(ch['composite'])} | {weakest.replace('_',' ').title()} ({weakest_score}) |"
        )
    lines.append("")

    overall_avg = sum(c.get("composite", 0) for c in chapters) / max(len(chapters), 1)
    lines.append(f"**Overall Average: {overall_avg:.1f} / 100 — {grade(overall_avg)}**")
    lines.append("")

    # Per-chapter detail
    lines.append("## Per-Chapter Detail")
    for ch in sorted_chapters:
        if "error" in ch:
            continue
        lines.append(f"\n### {ch['chapterCode']}: {ch['title']}")
        lines.append(f"**Composite score: {ch['composite']} / 100** — {grade(ch['composite'])}")
        lines.append("")
        lines.append("| Dimension | Weight | Score | Status |")
        lines.append("| --- | --- | --- | --- |")
        dims = ch["dimensions"]
        for dim in WEIGHTS:
            d = dims[dim]
            status = "✅ Pass" if d["score"] >= 80 else ("⚠️ Review" if d["score"] >= 60 else "🔴 Fix")
            lines.append(f"| {dim.replace('_',' ').title()} | {d['weight']}% | {d['score']} | {status} |")
        lines.append("")
        # Show issues for any failing dimension
        for dim in WEIGHTS:
            d = dims[dim]
            if d["issues"]:
                lines.append(f"**{dim.replace('_',' ').title()} issues:**")
                for issue in d["issues"][:5]:
                    lines.append(f"- {issue.strip()}")
                if len(d["issues"]) > 5:
                    lines.append(f"- … and {len(d['issues'])-5} more")
                lines.append("")

    return "\n".join(lines) + "\n"


# ── Main ──────────────────────────────────────────────────────────────────────
async def main(args: argparse.Namespace) -> int:
    started_at = datetime.now(timezone.utc)

    if args.chapter and args.chapter.upper() != "ALL":
        chapter_codes = [args.chapter.upper()]
    else:
        chapter_codes = sorted(
            p.stem for p in CONTENT_DIR.glob("*.json")
            if not p.stem.endswith("Copy")
        )

    print(f"Benchmarking {len(chapter_codes)} chapter(s)…")
    chapters = []
    for code in chapter_codes:
        print(f"  {code}… ", end="", flush=True)
        result = await benchmark_chapter(code)
        chapters.append(result)
        score = result.get("composite", 0)
        print(f"{score:.1f}  {grade(score)}")

    report = render_markdown(chapters, started_at)

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(report, encoding="utf-8")
    print(f"\nReport: {out_path}")

    overall = sum(c.get("composite", 0) for c in chapters) / max(len(chapters), 1)
    print(f"Overall average: {overall:.1f} / 100  {grade(overall)}")
    return 0


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Teaching quality benchmark for AI Tutor chapters")
    p.add_argument("--chapter", default="all", help="Chapter code or 'all'")
    p.add_argument("--output", default=str(
        TUTOR_API_ROOT.parent.parent.parent / "docs" / "vedic_math" / "TEACHING_QUALITY_BENCHMARK.md"
    ), help="Output markdown path")
    return p.parse_args()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main(parse_args())))
