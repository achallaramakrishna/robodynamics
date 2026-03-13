#!/usr/bin/env python3
"""
validate_content.py — RoboDynamics Content Validator CLI

Usage:
  python3 scripts/validate_content.py vedic_math
  python3 scripts/validate_content.py vedic_math L1
  python3 scripts/validate_content.py vedic_math --all --ai
  python3 scripts/validate_content.py vedic_math --all --quick   (no AI, no DB)

Options:
  --all         Validate all chapters in the course
  --ai          Run AI quality review (Layer 4) — requires ANTHROPIC_API_KEY
  --quick       Skip DB write and AI review; print results only
  --no-report   Skip HTML report generation
  --approve     Auto-approve all chapters that score >= publish threshold

Results are:
  - Printed to terminal with color
  - Saved to MySQL DB (rd_validation_runs, rd_chapter_results, rd_validation_issues)
  - Saved as HTML report to reports/validation_{timestamp}.html
  - Publish registry updated in rd_publish_registry
"""

from __future__ import annotations

import sys
import os
import json
import argparse
import pathlib
from datetime import datetime

# Allow running from project root
PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "scripts"))

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

from validators.schema_validator import SchemaValidator
from validators.completeness_validator import CompletenessValidator
from validators.math_validator import MathValidator
from validators.ai_quality_validator import AIQualityValidator
from validators.html_report import generate_report

# ─── Constants ──────────────────────────────────────────────────────────────

CONTENT_ROOT = PROJECT_ROOT / "tutor-api" / "content-template"
STANDARDS_DIR = PROJECT_ROOT / "scripts" / "standards"
REPORTS_DIR   = PROJECT_ROOT / "scripts" / "reports"

ANSI_RESET  = "\033[0m"
ANSI_RED    = "\033[91m"
ANSI_YELLOW = "\033[93m"
ANSI_GREEN  = "\033[92m"
ANSI_CYAN   = "\033[96m"
ANSI_BOLD   = "\033[1m"
ANSI_DIM    = "\033[2m"

def _c(text: str, code: str) -> str:
    return f"{code}{text}{ANSI_RESET}"


# ─── Loader ─────────────────────────────────────────────────────────────────

def load_standard(course_id: str) -> dict:
    path = STANDARDS_DIR / f"{course_id}_standard.json"
    if not path.exists():
        raise FileNotFoundError(f"Standard not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def load_chapter(course_id: str, chapter_code: str) -> dict | None:
    """Load a chapter JSON from content-template/{course_id}/chapter/{code}.json"""
    chapter_dir = CONTENT_ROOT / course_id / "chapter"
    candidates = [
        chapter_dir / f"{chapter_code}.json",
        chapter_dir / f"{chapter_code.lower()}.json",
        chapter_dir / f"{chapter_code.upper()}.json",
    ]
    for c in candidates:
        if c.exists():
            try:
                return json.loads(c.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                print(_c(f"  [ERROR] Invalid JSON in {c.name}: {e}", ANSI_RED))
                return None
    return None


def list_chapters(course_id: str) -> list[str]:
    """Return all chapter codes for the course."""
    chapter_dir = CONTENT_ROOT / course_id / "chapter"
    if not chapter_dir.exists():
        return []
    codes = []
    for f in sorted(chapter_dir.glob("L*.json")):
        if "Copy" not in f.name and "copy" not in f.name:
            codes.append(f.stem)
    return codes


# ─── Score → Status ─────────────────────────────────────────────────────────

def compute_status(
    standard: dict,
    schema_pass: bool,
    completeness_pass: bool,
    math_pass: bool,
    overall_score: float,
) -> str:
    publish_min  = standard["_meta"]["publish_threshold"]
    needswork_min = standard["_meta"]["needs_work_threshold"]

    if not schema_pass or not completeness_pass:
        return "incomplete"
    if not math_pass:
        return "needs_work"
    if overall_score >= publish_min:
        return "ready"
    if overall_score >= needswork_min:
        return "needs_work"
    return "incomplete"


# ─── Single chapter validator ────────────────────────────────────────────────

def validate_chapter(
    course_id: str,
    chapter_code: str,
    standard: dict,
    validators: dict,
    run_ai: bool = False,
) -> dict:
    """
    Run all 4 layers for one chapter.
    Returns a result dict with all scores, issues, and stats.
    """
    chapter_code = chapter_code.upper()
    chapter = load_chapter(course_id, chapter_code)

    if chapter is None:
        return {
            "chapter_code": chapter_code,
            "chapter_title": chapter_code,
            "status": "incomplete",
            "overall_score": 0.0,
            "schema_pass": False, "schema_score": 0.0,
            "completeness_pass": False, "completeness_score": 0.0,
            "math_pass": False, "math_score": 0.0,
            "ai_quality_score": None, "ai_dimensions": {},
            "ai_comments": "", "ai_top_issues": [], "ai_suggested_fixes": [],
            "stats": {},
            "issues": [{"layer": "load", "severity": "error", "rule_id": "CHAPTER_NOT_FOUND",
                        "message": f"Chapter file not found for '{chapter_code}'",
                        "suggested_fix": f"Create chapter file at content-template/{course_id}/chapter/{chapter_code}.json"}],
            "math_verified": 0, "math_total": 0,
            "question_pool_count": 0, "worked_example_count": 0, "screenplay_beat_count": 0,
        }

    chapter_title = chapter.get("title", chapter_code)
    all_issues: list[dict] = []

    # Layer 1: Schema
    l1 = validators["schema"].validate(chapter, chapter_code)
    all_issues.extend(l1["issues"])

    # Layer 2: Completeness
    l2 = validators["completeness"].validate(chapter, chapter_code)
    all_issues.extend(l2["issues"])
    stats = l2.get("stats", {})

    # Layer 3: Math
    l3 = validators["math"].validate(chapter, chapter_code)
    all_issues.extend(l3["issues"])
    math_stats = l3.get("stats", {})

    # Layer 4: AI Quality (optional)
    l4: dict = {"pass": None, "score": None, "skipped": True,
                "dimensions": {}, "issues": [], "comments": "",
                "top_issues": [], "suggested_fixes": []}
    if run_ai:
        l4 = validators["ai_quality"].validate(chapter, chapter_code)
        all_issues.extend(l4["issues"])

    # Overall score (weighted: L1=20, L2=25, L3=30, L4=25)
    l4_weight = 25 if not l4["skipped"] and l4["score"] is not None else 0
    l4_score = (l4["score"] / 10 * 25) if (not l4["skipped"] and l4["score"] is not None) else 0

    if l4_weight > 0:
        overall = l1["score"] + l2["score"] + l3["score"] + l4_score
    else:
        # Rescale to 100 without AI
        total_available = 20 + 25 + 30  # 75
        raw = l1["score"] + l2["score"] + l3["score"]
        overall = round(raw / 75 * 100, 2)

    status = compute_status(
        standard,
        l1["pass"], l2["pass"], l3["pass"], round(overall, 2)
    )

    return {
        "chapter_code": chapter_code,
        "chapter_title": chapter_title,
        "status": status,
        "overall_score": round(overall, 2),
        "schema_pass":         l1["pass"],
        "schema_score":        l1["score"],
        "completeness_pass":   l2["pass"],
        "completeness_score":  l2["score"],
        "math_pass":           l3["pass"],
        "math_score":          l3["score"],
        "math_verified":       math_stats.get("verified", 0),
        "math_total":          math_stats.get("total_checked", 0),
        "ai_quality_score":    l4.get("score"),
        "ai_teaching_clarity": l4["dimensions"].get("teaching_clarity"),
        "ai_difficulty_prog":  l4["dimensions"].get("difficulty_progression"),
        "ai_example_quality":  l4["dimensions"].get("example_quality"),
        "ai_engagement":       l4["dimensions"].get("engagement"),
        "ai_bloom_coverage":   l4["dimensions"].get("bloom_coverage"),
        "ai_dimensions":       l4["dimensions"],
        "ai_comments":         l4.get("comments", ""),
        "ai_top_issues":       l4.get("top_issues", []),
        "ai_suggested_fixes":  l4.get("suggested_fixes", []),
        "question_pool_count":   stats.get("question_pool_count", 0),
        "worked_example_count":  stats.get("worked_example_count", 0),
        "screenplay_beat_count": stats.get("screenplay_beat_count", 0),
        "stats": {**stats, **math_stats},
        "issues": all_issues,
    }


# ─── Terminal printer ────────────────────────────────────────────────────────

def print_result(r: dict) -> None:
    code    = r["chapter_code"]
    title   = r["chapter_title"]
    status  = r["status"]
    score   = r.get("overall_score", 0)

    status_color = {
        "ready":      ANSI_GREEN,
        "needs_work": ANSI_YELLOW,
        "incomplete": ANSI_RED,
    }.get(status, ANSI_DIM)

    status_icon = {"ready": "✅", "needs_work": "⚠️ ", "incomplete": "❌"}.get(status, "?")

    print()
    print(_c(f"  {status_icon} [{code}] {title}", ANSI_BOLD))
    print(f"     Score: {_c(f'{score:.0f}/100', status_color)}  |  Status: {_c(status.upper(), status_color)}")

    # Layer summary
    layers = [
        ("Schema",       r.get("schema_pass"),       r.get("schema_score"),       20),
        ("Completeness", r.get("completeness_pass"),  r.get("completeness_score"), 25),
        ("Math",         r.get("math_pass"),          r.get("math_score"),         30),
        ("AI Quality",   r.get("ai_quality_score") is not None and r.get("ai_quality_score",0) >= 7.0
                         if r.get("ai_quality_score") is not None else None,
                         r.get("ai_quality_score") * 2.5 if r.get("ai_quality_score") is not None else None,
                         25),
    ]
    parts = []
    for name, passed, score_val, max_val in layers:
        if passed is None:
            parts.append(_c(f"{name}: —", ANSI_DIM))
        elif passed:
            parts.append(_c(f"{name}: ✓{score_val:.0f}/{max_val}", ANSI_GREEN) if score_val is not None else _c(f"{name}: ✓", ANSI_GREEN))
        else:
            parts.append(_c(f"{name}: ✗{score_val:.0f}/{max_val}", ANSI_RED) if score_val is not None else _c(f"{name}: ✗", ANSI_RED))
    print("     " + "  |  ".join(parts))

    # Stats
    qpc = r.get("question_pool_count", 0)
    wec = r.get("worked_example_count", 0)
    sbc = r.get("screenplay_beat_count", 0)
    mv  = r.get("math_verified", 0)
    mt  = r.get("math_total", 0)
    print(_c(f"     Pool:{qpc}q  WorkedEx:{wec}  Beats:{sbc}  MathVerified:{mv}/{mt}", ANSI_DIM))

    # Top errors
    errors = [i for i in r.get("issues", []) if i["severity"] == "error"]
    warnings = [i for i in r.get("issues", []) if i["severity"] == "warning"]
    if errors:
        print(_c(f"     ❌ {len(errors)} error(s):", ANSI_RED))
        for e in errors[:3]:
            print(_c(f"        • {e['message']}", ANSI_RED))
        if len(errors) > 3:
            print(_c(f"        … and {len(errors)-3} more", ANSI_DIM))
    if warnings:
        print(_c(f"     ⚠️  {len(warnings)} warning(s):", ANSI_YELLOW))
        for w in warnings[:2]:
            print(_c(f"        • {w['message']}", ANSI_YELLOW))


def print_summary(results: list[dict]) -> None:
    ready      = [r for r in results if r["status"] == "ready"]
    needs_work = [r for r in results if r["status"] == "needs_work"]
    incomplete = [r for r in results if r["status"] == "incomplete"]
    total = len(results)
    avg = sum(r.get("overall_score", 0) for r in results) / max(total, 1)

    print()
    print(_c("═" * 62, ANSI_BOLD))
    print(_c("  VALIDATION SUMMARY", ANSI_BOLD))
    print(_c("═" * 62, ANSI_BOLD))
    print(f"  Total chapters : {total}")
    print(_c(f"  ✅ Publish ready : {len(ready)}", ANSI_GREEN))
    print(_c(f"  ⚠️  Needs work    : {len(needs_work)}", ANSI_YELLOW))
    print(_c(f"  ❌ Incomplete    : {len(incomplete)}", ANSI_RED))
    print(f"  Avg score      : {avg:.1f}/100")
    print()
    if ready:
        print(_c("  Ready to publish:", ANSI_GREEN))
        for r in ready:
            print(f"    • {r['chapter_code']} — {r['chapter_title'][:50]}  ({r['overall_score']:.0f}/100)")
    print()


# ─── Main ────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="RoboDynamics Content Validator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("course_id", help="Course ID, e.g. vedic_math")
    parser.add_argument("chapter", nargs="?", help="Specific chapter code, e.g. L1")
    parser.add_argument("--all",       action="store_true", help="Validate all chapters")
    parser.add_argument("--ai",        action="store_true", help="Run AI quality review (Layer 4)")
    parser.add_argument("--quick",     action="store_true", help="Skip DB and AI; print only")
    parser.add_argument("--no-report", action="store_true", help="Skip HTML report")
    parser.add_argument("--approve",   action="store_true", help="Auto-approve passing chapters in DB")
    args = parser.parse_args()

    course_id = args.course_id
    run_ai    = args.ai and not args.quick

    print()
    print(_c("  🎓 RoboDynamics Content Validator v1.0", ANSI_BOLD))
    print(_c(f"  Course: {course_id}  |  Mode: {'quick' if args.quick else 'full'}"
             + (" + AI" if run_ai else ""), ANSI_CYAN))
    print(_c("  Framework: RoboDynamics Quality Standard v1.0.0", ANSI_DIM))
    print()

    # Load standard
    try:
        standard = load_standard(course_id)
    except FileNotFoundError as e:
        print(_c(f"  [ERROR] {e}", ANSI_RED))
        sys.exit(1)

    # Init validators
    validators = {
        "schema":       SchemaValidator(standard),
        "completeness": CompletenessValidator(standard),
        "math":         MathValidator(standard),
        "ai_quality":   AIQualityValidator(standard),
    }

    # Determine which chapters to validate
    if args.chapter:
        chapter_codes = [args.chapter.upper()]
    elif args.all:
        chapter_codes = list_chapters(course_id)
        if not chapter_codes:
            print(_c(f"  [ERROR] No chapters found in {CONTENT_ROOT / course_id / 'chapter'}", ANSI_RED))
            sys.exit(1)
        print(f"  Found {len(chapter_codes)} chapters: {', '.join(chapter_codes)}")
    else:
        parser.print_help()
        sys.exit(0)

    # DB setup (optional — skip in quick mode or if MySQL unavailable)
    db = None
    run_id = None
    if not args.quick:
        try:
            from validators.db import ValidatorDB
            db = ValidatorDB()
            if db.is_db_available():
                db.ensure_schema()
                run_mode = "ai" if run_ai else "full"
                run_id = db.create_run(course_id, mode=run_mode)
                print(_c(f"  [DB] Run ID: {run_id}", ANSI_DIM))
            else:
                print(_c("  [DB] MySQL not available — running in file-only mode", ANSI_YELLOW))
                db = None
        except Exception as e:
            print(_c(f"  [DB] Skipping MySQL: {e}", ANSI_YELLOW))
            db = None

    # Validate each chapter
    results: list[dict] = []
    for code in chapter_codes:
        print(_c(f"  ▶ Validating {code}…", ANSI_DIM), end="", flush=True)
        result = validate_chapter(course_id, code, standard, validators, run_ai=run_ai)
        results.append(result)

        status_char = {"ready": "✅", "needs_work": "⚠️", "incomplete": "❌"}.get(result["status"], "?")
        print(f"\r  {status_char} {code:<30} {result['overall_score']:.0f}/100  [{result['status'].upper()}]")

        # Save to DB
        if db and run_id:
            try:
                db.save_chapter_result(run_id, result)
                db.save_issues(run_id, code, result.get("issues", []))
                db.upsert_publish_status(
                    chapter_code=code,
                    course_id=course_id,
                    status=result["status"],
                    overall_score=result.get("overall_score"),
                    ai_quality_score=result.get("ai_quality_score"),
                    run_id=run_id,
                )
                if args.approve and result["status"] == "ready":
                    db.approve_chapter(code, approved_by="validator_auto")
            except Exception as e:
                print(_c(f"     [DB] Save error: {e}", ANSI_YELLOW))

    # Print detailed results
    for r in results:
        print_result(r)

    # Print summary
    print_summary(results)

    # Complete DB run
    if db and run_id:
        ready_count      = sum(1 for r in results if r["status"] == "ready")
        needs_work_count = sum(1 for r in results if r["status"] == "needs_work")
        incomplete_count = sum(1 for r in results if r["status"] == "incomplete")
        avg_score = sum(r.get("overall_score", 0) for r in results) / max(len(results), 1)
        report_path = None

        if not args.no_report:
            REPORTS_DIR.mkdir(exist_ok=True)
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_path = str(REPORTS_DIR / f"validation_{course_id}_{ts}.html")

        try:
            db.complete_run(
                run_id,
                total=len(results),
                ready=ready_count,
                needs_work=needs_work_count,
                incomplete=incomplete_count,
                overall_score=avg_score,
                report_path=report_path,
            )
            print(_c(f"  [DB] Run completed: {run_id}", ANSI_DIM))
        except Exception as e:
            print(_c(f"  [DB] Complete run error: {e}", ANSI_YELLOW))

    # Generate HTML report
    if not args.no_report:
        REPORTS_DIR.mkdir(exist_ok=True)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = REPORTS_DIR / f"validation_{course_id}_{ts}.html"
        html = generate_report(
            results,
            run_id=run_id or "quick",
            course_id=course_id,
            run_mode="quick" if args.quick else ("ai" if run_ai else "full"),
        )
        report_file.write_text(html, encoding="utf-8")
        print(_c(f"  📄 HTML report: {report_file}", ANSI_CYAN))

    # Exit code: 0 if all ready, 1 if any incomplete
    any_errors = any(r["status"] == "incomplete" for r in results)
    sys.exit(1 if any_errors else 0)


if __name__ == "__main__":
    main()
