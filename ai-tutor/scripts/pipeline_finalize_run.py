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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--course-id", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--readiness-path", required=True)
    parser.add_argument("--report-path", required=False)
    args = parser.parse_args()

    db = ValidatorDB()
    if not db.is_db_available():
        print(json.dumps({"ok": False, "skipped": True, "reason": "MySQL unavailable"}))
        return

    db.ensure_schema()
    ensure_run_record(db, args.run_id, args.course_id)

    readiness = read_json(args.readiness_path)
    chapters = readiness.get("chapters", [])
    ready_count = 0
    needs_work_count = 0
    incomplete_count = 0
    for chapter in chapters:
        status = str((chapter.get("readiness") or {}).get("deterministicStatus") or "incomplete")
        if status == "ready":
            ready_count += 1
        elif status == "needs_work":
            needs_work_count += 1
        else:
            incomplete_count += 1

    db.complete_run(
        args.run_id,
        total=len(chapters),
        ready=ready_count,
        needs_work=needs_work_count,
        incomplete=incomplete_count,
        overall_score=float(readiness.get("averageDeterministicScore") or 0),
        report_path=args.report_path or args.readiness_path,
    )

    print(json.dumps({
        "ok": True,
        "skipped": False,
        "runId": args.run_id,
        "courseId": args.course_id,
        "totalChapters": len(chapters),
        "readyCount": ready_count,
        "needsWorkCount": needs_work_count,
        "incompleteCount": incomplete_count,
    }))


if __name__ == "__main__":
    main()
