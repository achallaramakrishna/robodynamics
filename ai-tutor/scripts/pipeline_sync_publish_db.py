#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import pathlib
import sys

PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "scripts"))

from validators.db import ValidatorDB  # noqa: E402


def read_json(path: str) -> dict:
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))


def ensure_run_record(db: ValidatorDB, run_id: str, course_id: str, mode: str = "pipeline") -> None:
    with db._conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO rd_validation_runs (run_id, course_id, run_mode)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE course_id=VALUES(course_id), run_mode=VALUES(run_mode)
                """,
                (run_id, course_id, mode),
            )


def map_ai_issues(review: dict) -> list[dict]:
    issues = []
    for item in review.get("topIssues", []):
        issues.append({
            "layer": "ai_quality",
            "severity": "warning",
            "rule_id": "AI_IDENTIFIED_ISSUE",
            "message": item,
            "suggested_fix": None,
        })
    for item in review.get("suggestedFixes", []):
        issues.append({
            "layer": "ai_quality",
            "severity": "info",
            "rule_id": "AI_SUGGESTED_FIX",
            "message": item,
            "suggested_fix": item,
        })
    return issues


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--course-id", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--chapter-code", required=True)
    parser.add_argument("--lesson-path", required=True)
    parser.add_argument("--validation-path", required=True)
    parser.add_argument("--pedagogy-path", required=True)
    parser.add_argument("--publish-path", required=False)
    parser.add_argument("--approved-by", required=False)
    args = parser.parse_args()

    db = ValidatorDB()
    if not db.is_db_available():
        print(json.dumps({"ok": False, "skipped": True, "reason": "MySQL unavailable"}))
        return

    db.ensure_schema()
    ensure_run_record(db, args.run_id, args.course_id)

    lesson = read_json(args.lesson_path)
    validation = read_json(args.validation_path)
    pedagogy = read_json(args.pedagogy_path)
    publish = read_json(args.publish_path) if args.publish_path and pathlib.Path(args.publish_path).exists() else None

    l1 = validation["layers"]["l1_schema"]
    l2 = validation["layers"]["l2_completeness"]
    l3 = validation["layers"]["l3_math_accuracy"]
    stats = l2.get("stats", {})
    math_stats = l3.get("stats", {})
    scores = pedagogy.get("scores", {})

    row = {
        "chapter_code": args.chapter_code,
        "chapter_title": lesson.get("title"),
        "status": validation.get("status"),
        "overall_score": validation.get("overallScore"),
        "schema_pass": l1.get("pass"),
        "schema_score": l1.get("score"),
        "completeness_pass": l2.get("pass"),
        "completeness_score": l2.get("score"),
        "math_pass": l3.get("pass"),
        "math_score": l3.get("score"),
        "math_verified": math_stats.get("verified", 0),
        "math_total": math_stats.get("totalChecked", 0),
        "ai_quality_score": pedagogy.get("overallScore"),
        "ai_teaching_clarity": scores.get("teaching_clarity"),
        "ai_difficulty_prog": scores.get("difficulty_progression"),
        "ai_example_quality": scores.get("example_quality"),
        "ai_engagement": scores.get("engagement"),
        "ai_bloom_coverage": scores.get("bloom_coverage"),
        "ai_comments": "\n".join([pedagogy.get("approvalRecommendation", ""), *pedagogy.get("topIssues", [])]).strip(),
        "ai_top_issues": pedagogy.get("topIssues", []),
        "ai_suggested_fixes": pedagogy.get("suggestedFixes", []),
        "question_pool_count": stats.get("questionPoolCount", 0),
        "worked_example_count": stats.get("workedExampleCount", 0),
        "screenplay_beat_count": stats.get("screenplayBeatCount", 0),
    }

    db.save_chapter_result(args.run_id, row)

    issues = []
    for layer_name in ("l1_schema", "l2_completeness", "l3_math_accuracy"):
        issues.extend(validation["layers"][layer_name].get("issues", []))
    issues.extend(map_ai_issues(pedagogy))
    db.save_issues(args.run_id, args.chapter_code, issues)
    db.upsert_publish_status(
        chapter_code=args.chapter_code,
        course_id=args.course_id,
        status=validation.get("status"),
        overall_score=validation.get("overallScore"),
        ai_quality_score=pedagogy.get("overallScore"),
        run_id=args.run_id,
    )

    if publish and publish.get("decision") == "approved" and (args.approved_by or publish.get("approvedBy")):
        db.approve_chapter(args.chapter_code, approved_by=args.approved_by or publish.get("approvedBy"))

    print(json.dumps({
        "ok": True,
        "skipped": False,
        "runId": args.run_id,
        "chapterCode": args.chapter_code,
        "status": validation.get("status"),
        "aiQualityScore": pedagogy.get("overallScore"),
    }))


if __name__ == "__main__":
    main()
