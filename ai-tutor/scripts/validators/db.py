"""
validators/db.py — MySQL persistence for the content validator framework.

Tables:
  validation_runs      — each validator execution (run metadata)
  chapter_results      — per-chapter scores for a run
  validation_issues    — individual rule violations per chapter per run
  publish_registry     — authoritative publish status per chapter

Usage:
  from validators.db import ValidatorDB
  db = ValidatorDB()   # reads MYSQL_* env vars or uses defaults
  db.ensure_schema()
  run_id = db.create_run("vedic_math", mode="full")
  db.save_chapter_result(run_id, result_dict)
  db.save_issues(run_id, chapter_code, issues_list)
  db.update_publish_status("L1", "approved")
"""

from __future__ import annotations

import os
import uuid
import json
from datetime import datetime
from typing import Any

try:
    import pymysql
    import pymysql.cursors
    HAS_PYMYSQL = True
except ImportError:
    HAS_PYMYSQL = False


# ─── DDL ────────────────────────────────────────────────────────────────────

DDL_VALIDATION_RUNS = """
CREATE TABLE IF NOT EXISTS rd_validation_runs (
    run_id          VARCHAR(36)   NOT NULL PRIMARY KEY,
    course_id       VARCHAR(64)   NOT NULL,
    run_mode        VARCHAR(16)   NOT NULL DEFAULT 'full',
    total_chapters  INT           NOT NULL DEFAULT 0,
    ready_count     INT           NOT NULL DEFAULT 0,
    needs_work_count INT          NOT NULL DEFAULT 0,
    incomplete_count INT          NOT NULL DEFAULT 0,
    overall_score   DECIMAL(5,2)  DEFAULT NULL,
    report_path     VARCHAR(512)  DEFAULT NULL,
    run_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at    DATETIME      DEFAULT NULL,
    created_by      VARCHAR(64)   DEFAULT 'system'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"""

DDL_CHAPTER_RESULTS = """
CREATE TABLE IF NOT EXISTS rd_chapter_results (
    id                  BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    run_id              VARCHAR(36)   NOT NULL,
    chapter_code        VARCHAR(32)   NOT NULL,
    chapter_title       VARCHAR(256)  DEFAULT NULL,
    status              VARCHAR(16)   NOT NULL,   -- ready | needs_work | incomplete
    overall_score       DECIMAL(5,2)  DEFAULT NULL,
    schema_pass         TINYINT(1)    DEFAULT NULL,
    schema_score        DECIMAL(5,2)  DEFAULT NULL,
    completeness_pass   TINYINT(1)    DEFAULT NULL,
    completeness_score  DECIMAL(5,2)  DEFAULT NULL,
    math_pass           TINYINT(1)    DEFAULT NULL,
    math_score          DECIMAL(5,2)  DEFAULT NULL,
    math_verified       INT           DEFAULT 0,
    math_total          INT           DEFAULT 0,
    ai_quality_score    DECIMAL(4,2)  DEFAULT NULL,
    ai_teaching_clarity DECIMAL(4,2)  DEFAULT NULL,
    ai_difficulty_prog  DECIMAL(4,2)  DEFAULT NULL,
    ai_example_quality  DECIMAL(4,2)  DEFAULT NULL,
    ai_engagement       DECIMAL(4,2)  DEFAULT NULL,
    ai_bloom_coverage   DECIMAL(4,2)  DEFAULT NULL,
    ai_comments         TEXT          DEFAULT NULL,
    ai_top_issues       JSON          DEFAULT NULL,
    ai_suggested_fixes  JSON          DEFAULT NULL,
    question_pool_count INT           DEFAULT 0,
    worked_example_count INT          DEFAULT 0,
    screenplay_beat_count INT         DEFAULT 0,
    validated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (run_id) REFERENCES rd_validation_runs(run_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_run_chapter (run_id, chapter_code),
    INDEX idx_chapter_code (chapter_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"""

DDL_VALIDATION_ISSUES = """
CREATE TABLE IF NOT EXISTS rd_validation_issues (
    id              BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    run_id          VARCHAR(36)   NOT NULL,
    chapter_code    VARCHAR(32)   NOT NULL,
    layer           VARCHAR(32)   NOT NULL,   -- schema | completeness | math | ai_quality
    severity        VARCHAR(8)    NOT NULL,   -- error | warning | info
    rule_id         VARCHAR(64)   NOT NULL,
    message         TEXT          NOT NULL,
    field_path      VARCHAR(256)  DEFAULT NULL,
    actual_value    VARCHAR(512)  DEFAULT NULL,
    expected_value  VARCHAR(512)  DEFAULT NULL,
    suggested_fix   TEXT          DEFAULT NULL,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (run_id) REFERENCES rd_validation_runs(run_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_run_chapter (run_id, chapter_code),
    INDEX idx_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"""

DDL_PUBLISH_REGISTRY = """
CREATE TABLE IF NOT EXISTS rd_publish_registry (
    chapter_code    VARCHAR(32)   NOT NULL PRIMARY KEY,
    course_id       VARCHAR(64)   NOT NULL,
    status          VARCHAR(16)   NOT NULL DEFAULT 'draft',  -- draft|validated|approved|published|deprecated
    overall_score   DECIMAL(5,2)  DEFAULT NULL,
    ai_quality_score DECIMAL(4,2) DEFAULT NULL,
    last_run_id     VARCHAR(36)   DEFAULT NULL,
    last_validated_at DATETIME    DEFAULT NULL,
    approved_by     VARCHAR(64)   DEFAULT NULL,
    approved_at     DATETIME      DEFAULT NULL,
    published_at    DATETIME      DEFAULT NULL,
    deprecated_at   DATETIME      DEFAULT NULL,
    notes           TEXT          DEFAULT NULL,
    updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"""


# ─── DB Class ───────────────────────────────────────────────────────────────

class ValidatorDB:
    """MySQL-backed persistence for validation results."""

    def __init__(
        self,
        host: str | None = None,
        port: int | None = None,
        user: str | None = None,
        password: str | None = None,
        database: str | None = None,
    ) -> None:
        if not HAS_PYMYSQL:
            raise RuntimeError(
                "PyMySQL not installed. Run: pip install pymysql"
            )
        self._cfg = {
            "host":     host     or os.getenv("MYSQL_HOST",     "localhost"),
            "port":     port     or int(os.getenv("MYSQL_PORT", "3306")),
            "user":     user     or os.getenv("MYSQL_USER",     "root"),
            "password": password or os.getenv("MYSQL_PASSWORD", ""),
            "database": database or os.getenv("MYSQL_DATABASE", "robodynamics"),
            "charset":  "utf8mb4",
            "cursorclass": pymysql.cursors.DictCursor,
            "autocommit": True,
        }

    def _conn(self):
        return pymysql.connect(**self._cfg)

    # ── Schema bootstrap ────────────────────────────────────────────────────

    def ensure_schema(self) -> None:
        """Create all 4 tables if they don't exist."""
        with self._conn() as conn:
            with conn.cursor() as cur:
                for ddl in [
                    DDL_VALIDATION_RUNS,
                    DDL_CHAPTER_RESULTS,
                    DDL_VALIDATION_ISSUES,
                    DDL_PUBLISH_REGISTRY,
                ]:
                    cur.execute(ddl)
        print("  [DB] Schema ready (4 tables)")

    # ── Validation Runs ─────────────────────────────────────────────────────

    def create_run(self, course_id: str, mode: str = "full") -> str:
        run_id = str(uuid.uuid4())
        sql = """
            INSERT INTO rd_validation_runs (run_id, course_id, run_mode)
            VALUES (%s, %s, %s)
        """
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (run_id, course_id, mode))
        return run_id

    def complete_run(
        self,
        run_id: str,
        total: int,
        ready: int,
        needs_work: int,
        incomplete: int,
        overall_score: float,
        report_path: str | None = None,
    ) -> None:
        sql = """
            UPDATE rd_validation_runs
            SET total_chapters=%s, ready_count=%s, needs_work_count=%s,
                incomplete_count=%s, overall_score=%s,
                report_path=%s, completed_at=NOW()
            WHERE run_id=%s
        """
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (total, ready, needs_work, incomplete,
                                  round(overall_score, 2), report_path, run_id))

    def get_run(self, run_id: str) -> dict | None:
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM rd_validation_runs WHERE run_id=%s", (run_id,))
                return cur.fetchone()

    def list_runs(self, course_id: str, limit: int = 20) -> list[dict]:
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT * FROM rd_validation_runs WHERE course_id=%s "
                    "ORDER BY run_at DESC LIMIT %s",
                    (course_id, limit)
                )
                return cur.fetchall()

    # ── Chapter Results ─────────────────────────────────────────────────────

    def save_chapter_result(self, run_id: str, r: dict[str, Any]) -> None:
        """
        r keys: chapter_code, chapter_title, status, overall_score,
                schema_pass, schema_score, completeness_pass, completeness_score,
                math_pass, math_score, math_verified, math_total,
                ai_quality_score, ai_teaching_clarity, ai_difficulty_prog,
                ai_example_quality, ai_engagement, ai_bloom_coverage,
                ai_comments, ai_top_issues, ai_suggested_fixes,
                question_pool_count, worked_example_count, screenplay_beat_count
        """
        sql = """
            INSERT INTO rd_chapter_results (
                run_id, chapter_code, chapter_title, status, overall_score,
                schema_pass, schema_score, completeness_pass, completeness_score,
                math_pass, math_score, math_verified, math_total,
                ai_quality_score, ai_teaching_clarity, ai_difficulty_prog,
                ai_example_quality, ai_engagement, ai_bloom_coverage,
                ai_comments, ai_top_issues, ai_suggested_fixes,
                question_pool_count, worked_example_count, screenplay_beat_count
            ) VALUES (
                %s,%s,%s,%s,%s,
                %s,%s,%s,%s,
                %s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s,
                %s,%s,%s,
                %s,%s,%s
            )
            ON DUPLICATE KEY UPDATE
                status=VALUES(status),
                overall_score=VALUES(overall_score),
                validated_at=NOW()
        """
        def _j(v):
            return json.dumps(v) if v is not None and not isinstance(v, str) else v

        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (
                    run_id,
                    r.get("chapter_code"), r.get("chapter_title"),
                    r.get("status"), r.get("overall_score"),
                    r.get("schema_pass"), r.get("schema_score"),
                    r.get("completeness_pass"), r.get("completeness_score"),
                    r.get("math_pass"), r.get("math_score"),
                    r.get("math_verified", 0), r.get("math_total", 0),
                    r.get("ai_quality_score"),
                    r.get("ai_teaching_clarity"), r.get("ai_difficulty_prog"),
                    r.get("ai_example_quality"), r.get("ai_engagement"),
                    r.get("ai_bloom_coverage"),
                    r.get("ai_comments"),
                    _j(r.get("ai_top_issues")),
                    _j(r.get("ai_suggested_fixes")),
                    r.get("question_pool_count", 0),
                    r.get("worked_example_count", 0),
                    r.get("screenplay_beat_count", 0),
                ))

    def get_chapter_history(self, chapter_code: str, limit: int = 10) -> list[dict]:
        """Get validation history for a specific chapter across all runs."""
        sql = """
            SELECT cr.*, vr.run_at, vr.run_mode
            FROM rd_chapter_results cr
            JOIN rd_validation_runs vr ON cr.run_id = vr.run_id
            WHERE cr.chapter_code = %s
            ORDER BY vr.run_at DESC
            LIMIT %s
        """
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (chapter_code, limit))
                return cur.fetchall()

    # ── Validation Issues ───────────────────────────────────────────────────

    def save_issues(self, run_id: str, chapter_code: str, issues: list[dict]) -> None:
        """Bulk insert validation issues."""
        if not issues:
            return
        sql = """
            INSERT INTO rd_validation_issues
              (run_id, chapter_code, layer, severity, rule_id, message,
               field_path, actual_value, expected_value, suggested_fix)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """
        rows = [
            (
                run_id, chapter_code,
                i.get("layer", ""), i.get("severity", "error"),
                i.get("rule_id", ""), i.get("message", ""),
                i.get("field_path"), i.get("actual_value"),
                i.get("expected_value"), i.get("suggested_fix"),
            )
            for i in issues
        ]
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.executemany(sql, rows)

    def get_issues(
        self, run_id: str, chapter_code: str | None = None,
        severity: str | None = None
    ) -> list[dict]:
        conditions = ["run_id = %s"]
        params: list[Any] = [run_id]
        if chapter_code:
            conditions.append("chapter_code = %s")
            params.append(chapter_code)
        if severity:
            conditions.append("severity = %s")
            params.append(severity)
        sql = (
            "SELECT * FROM rd_validation_issues WHERE "
            + " AND ".join(conditions)
            + " ORDER BY severity, chapter_code, layer"
        )
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, params)
                return cur.fetchall()

    # ── Publish Registry ─────────────────────────────────────────────────────

    def upsert_publish_status(
        self,
        chapter_code: str,
        course_id: str,
        status: str,
        overall_score: float | None = None,
        ai_quality_score: float | None = None,
        run_id: str | None = None,
    ) -> None:
        sql = """
            INSERT INTO rd_publish_registry
              (chapter_code, course_id, status, overall_score, ai_quality_score, last_run_id, last_validated_at)
            VALUES (%s,%s,%s,%s,%s,%s,NOW())
            ON DUPLICATE KEY UPDATE
              status=VALUES(status),
              overall_score=VALUES(overall_score),
              ai_quality_score=VALUES(ai_quality_score),
              last_run_id=VALUES(last_run_id),
              last_validated_at=NOW()
        """
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (
                    chapter_code, course_id, status,
                    round(overall_score, 2) if overall_score is not None else None,
                    round(ai_quality_score, 2) if ai_quality_score is not None else None,
                    run_id,
                ))

    def approve_chapter(self, chapter_code: str, approved_by: str = "admin") -> None:
        sql = """
            UPDATE rd_publish_registry
            SET status='approved', approved_by=%s, approved_at=NOW()
            WHERE chapter_code=%s
        """
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (approved_by, chapter_code))

    def publish_chapter(self, chapter_code: str) -> None:
        sql = """
            UPDATE rd_publish_registry
            SET status='published', published_at=NOW()
            WHERE chapter_code=%s AND status='approved'
        """
        with self._conn() as conn:
            with conn.cursor() as cur:
                affected = cur.execute(sql, (chapter_code,))
                if affected == 0:
                    raise ValueError(
                        f"Chapter {chapter_code} is not approved. Approve first."
                    )

    def get_publish_status(self, chapter_code: str) -> dict | None:
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT * FROM rd_publish_registry WHERE chapter_code=%s",
                    (chapter_code,)
                )
                return cur.fetchone()

    def get_publish_dashboard(self, course_id: str) -> list[dict]:
        """Full dashboard: all chapters with latest validation result."""
        sql = """
            SELECT
                pr.*,
                cr.schema_pass,
                cr.completeness_pass,
                cr.math_score,
                cr.question_pool_count,
                cr.worked_example_count,
                cr.screenplay_beat_count
            FROM rd_publish_registry pr
            LEFT JOIN rd_chapter_results cr
                ON pr.chapter_code = cr.chapter_code
                AND cr.run_id = pr.last_run_id
            WHERE pr.course_id = %s
            ORDER BY pr.chapter_code
        """
        with self._conn() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (course_id,))
                return cur.fetchall()

    def is_db_available(self) -> bool:
        """Check if MySQL is reachable (graceful fallback to file-only mode)."""
        try:
            with self._conn() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
            return True
        except Exception:
            return False
