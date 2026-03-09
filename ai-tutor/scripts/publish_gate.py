#!/usr/bin/env python3
"""
publish_gate.py — Review and approve chapters for production deployment.

Usage:
  python3 scripts/publish_gate.py vedic_math status          # show publish dashboard
  python3 scripts/publish_gate.py vedic_math approve L1 L2   # approve specific chapters
  python3 scripts/publish_gate.py vedic_math publish L1       # mark as published
  python3 scripts/publish_gate.py vedic_math history L1       # validation history for L1

Chapters must be approved before they can be published.
The validator auto-updates statuses; this tool handles human approval gates.
"""

from __future__ import annotations
import sys
import json
import pathlib
import argparse

PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "scripts"))

ANSI_RESET = "\033[0m"
ANSI_RED    = "\033[91m"
ANSI_YELLOW = "\033[93m"
ANSI_GREEN  = "\033[92m"
ANSI_CYAN   = "\033[96m"
ANSI_BOLD   = "\033[1m"
ANSI_DIM    = "\033[2m"

def _c(t, c): return f"{c}{t}{ANSI_RESET}"


def get_db():
    from validators.db import ValidatorDB
    db = ValidatorDB()
    if not db.is_db_available():
        print(_c("  [ERROR] MySQL not available. Check MYSQL_* env vars.", ANSI_RED))
        sys.exit(1)
    return db


def cmd_status(course_id: str) -> None:
    db = get_db()
    rows = db.get_publish_dashboard(course_id)

    if not rows:
        print(_c("  No chapters found in publish registry.", ANSI_YELLOW))
        print(_c("  Run validate_content.py first.", ANSI_DIM))
        return

    print()
    print(_c("  PUBLISH REGISTRY DASHBOARD", ANSI_BOLD))
    print(_c(f"  Course: {course_id}  |  Chapters: {len(rows)}", ANSI_DIM))
    print()

    header = f"  {'CODE':<8}  {'STATUS':<12}  {'SCORE':>6}  {'AI':>5}  {'QUESTIONS':>10}  {'VALIDATED':<20}  TITLE"
    print(_c(header, ANSI_DIM))
    print(_c("  " + "─" * 100, ANSI_DIM))

    status_colors = {
        "draft":       ANSI_DIM,
        "validated":   ANSI_CYAN,
        "approved":    ANSI_YELLOW,
        "published":   ANSI_GREEN,
        "deprecated":  ANSI_RED,
        "ready":       ANSI_GREEN,
        "needs_work":  ANSI_YELLOW,
        "incomplete":  ANSI_RED,
    }
    status_icons = {
        "draft": "○", "validated": "◑", "approved": "◕",
        "published": "●", "deprecated": "✕",
        "ready": "✅", "needs_work": "⚠️", "incomplete": "❌",
    }

    for row in rows:
        code       = row.get("chapter_code", "?")
        status     = row.get("status", "draft")
        score      = row.get("overall_score")
        ai_score   = row.get("ai_quality_score")
        q_count    = row.get("question_pool_count", 0) or "—"
        validated  = str(row.get("last_validated_at", "—"))[:16]
        icon       = status_icons.get(status, "?")
        color      = status_colors.get(status, ANSI_DIM)

        score_str   = f"{score:.0f}/100" if score else "—"
        ai_str      = f"{ai_score:.1f}"  if ai_score else "—"

        line = (f"  {code:<8}  {icon} {status:<10}  {score_str:>6}  {ai_str:>5}"
                f"  {str(q_count):>10}  {validated:<20}")
        print(_c(line, color))

    print()
    published_count = sum(1 for r in rows if r.get("status") == "published")
    approved_count  = sum(1 for r in rows if r.get("status") == "approved")
    ready_count     = sum(1 for r in rows if r.get("status") == "ready")
    print(f"  Published: {published_count}  |  Approved: {approved_count}  |  Ready to approve: {ready_count}")
    print()
    if ready_count > 0:
        ready_codes = [r["chapter_code"] for r in rows if r.get("status") == "ready"]
        print(_c(f"  💡 Run: python3 scripts/publish_gate.py {course_id} approve {' '.join(ready_codes)}", ANSI_CYAN))


def cmd_approve(course_id: str, chapter_codes: list[str], approved_by: str = "admin") -> None:
    db = get_db()
    for code in chapter_codes:
        code = code.upper()
        row = db.get_publish_status(code)
        if not row:
            print(_c(f"  [SKIP] {code}: not found in publish registry (run validator first)", ANSI_YELLOW))
            continue
        if row.get("status") in ("published",):
            print(_c(f"  [SKIP] {code}: already {row['status']}", ANSI_DIM))
            continue
        score = row.get("overall_score", 0) or 0
        if score < 60:
            print(_c(f"  [WARN] {code}: score is {score:.0f}/100 — are you sure you want to approve? (Run with --force to override)", ANSI_YELLOW))
            continue
        db.approve_chapter(code, approved_by=approved_by)
        print(_c(f"  ✅ {code}: APPROVED by {approved_by}  (score: {score:.0f}/100)", ANSI_GREEN))


def cmd_publish(course_id: str, chapter_codes: list[str]) -> None:
    db = get_db()
    for code in chapter_codes:
        code = code.upper()
        row = db.get_publish_status(code)
        if not row:
            print(_c(f"  [ERROR] {code}: not found. Run validator and approve first.", ANSI_RED))
            continue
        try:
            db.publish_chapter(code)
            print(_c(f"  🚀 {code}: PUBLISHED", ANSI_GREEN))
        except ValueError as e:
            print(_c(f"  [ERROR] {code}: {e}", ANSI_RED))


def cmd_history(course_id: str, chapter_code: str) -> None:
    db = get_db()
    code = chapter_code.upper()
    rows = db.get_chapter_history(code, limit=10)
    if not rows:
        print(_c(f"  No history found for {code}. Run validator first.", ANSI_YELLOW))
        return

    print()
    print(_c(f"  VALIDATION HISTORY — {code}", ANSI_BOLD))
    print(_c(f"  Last {len(rows)} runs:", ANSI_DIM))
    print()

    header = f"  {'RUN DATE':<20}  {'MODE':<6}  {'SCORE':>6}  {'STATUS':<12}  {'MATH':>6}  {'AI':>5}  QUESTIONS"
    print(_c(header, ANSI_DIM))
    print(_c("  " + "─" * 80, ANSI_DIM))

    for row in rows:
        run_at  = str(row.get("run_at", "—"))[:19]
        mode    = row.get("run_mode", "—")
        score   = row.get("overall_score")
        status  = row.get("status", "—")
        math_s  = row.get("math_score")
        ai_s    = row.get("ai_quality_score")
        qp_c    = row.get("question_pool_count", 0)

        score_s  = f"{score:.0f}" if score else "—"
        math_ss  = f"{math_s:.0f}" if math_s else "—"
        ai_ss    = f"{ai_s:.1f}"   if ai_s  else "—"

        status_color = {"ready": ANSI_GREEN, "needs_work": ANSI_YELLOW, "incomplete": ANSI_RED}.get(status, ANSI_DIM)
        line = f"  {run_at:<20}  {mode:<6}  {score_s:>6}  "
        print(_c(line, ANSI_DIM) + _c(f"{status:<12}", status_color) + _c(f"  {math_ss:>6}  {ai_ss:>5}  {qp_c}", ANSI_DIM))

    print()


def main() -> None:
    parser = argparse.ArgumentParser(description="RoboDynamics Publish Gate")
    parser.add_argument("course_id", help="Course ID, e.g. vedic_math")
    parser.add_argument("command",  choices=["status", "approve", "publish", "history"])
    parser.add_argument("chapters", nargs="*", help="Chapter codes (for approve/publish/history)")
    parser.add_argument("--by",     default="admin", help="Approved by (name)")
    args = parser.parse_args()

    print()
    print(_c("  🏛️  RoboDynamics Publish Gate", ANSI_BOLD))
    print()

    if args.command == "status":
        cmd_status(args.course_id)
    elif args.command == "approve":
        if not args.chapters:
            print(_c("  [ERROR] Specify chapter codes: approve L1 L2 ...", ANSI_RED))
            sys.exit(1)
        cmd_approve(args.course_id, args.chapters, approved_by=args.by)
    elif args.command == "publish":
        if not args.chapters:
            print(_c("  [ERROR] Specify chapter codes: publish L1 ...", ANSI_RED))
            sys.exit(1)
        cmd_publish(args.course_id, args.chapters)
    elif args.command == "history":
        if not args.chapters:
            print(_c("  [ERROR] Specify chapter code: history L1", ANSI_RED))
            sys.exit(1)
        cmd_history(args.course_id, args.chapters[0])


if __name__ == "__main__":
    main()
