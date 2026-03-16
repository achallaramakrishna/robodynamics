"""
SQLite-backed session snapshot.
Persists tutor session progress so a server restart doesn't wipe student state.

Table: session_snapshots (user_id, chapter_code, payload JSON, updated_at)
Keyed by (user_id, chapter_code) so a student can resume exactly where they left off.
"""
from __future__ import annotations

import asyncio
import json
import os
import sqlite3
import threading
from typing import Any, Dict, Optional

_DB_PATH = os.getenv("SESSION_SNAPSHOT_DB", "/opt/robodynamics/ai-tutor/data/sessions.db")

# Fields we persist (exclude transient runtime state like current_question, timers)
_SNAPSHOT_FIELDS = (
    "attempts", "correct_count", "error_streak", "doubt_count",
    "total_response_ms", "last_response_ms", "confidence_last",
    "hearts", "hearts_max", "xp", "streak",
    "question_progress", "group_progress", "subtopic_mastery",
    "exercise_group",
)


class SessionSnapshotStore:
    """Thread-safe SQLite store for session snapshots."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._ready = False
        try:
            os.makedirs(os.path.dirname(_DB_PATH), exist_ok=True)
            with self._connect() as conn:
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS session_snapshots (
                        user_id     INTEGER NOT NULL,
                        chapter_code TEXT   NOT NULL,
                        payload     TEXT    NOT NULL,
                        updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
                        PRIMARY KEY (user_id, chapter_code)
                    )
                """)
                conn.commit()
            self._ready = True
        except Exception:
            # If SQLite is unavailable, degrade gracefully (in-memory still works)
            self._ready = False

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(_DB_PATH, check_same_thread=False)

    def save(self, session: Any) -> None:
        """Persist a snapshot of session progress. Fire-and-forget safe."""
        if not self._ready:
            return
        try:
            payload: Dict[str, Any] = {}
            for field in _SNAPSHOT_FIELDS:
                val = getattr(session, field, None)
                payload[field] = val
            with self._lock:
                with self._connect() as conn:
                    conn.execute(
                        """
                        INSERT INTO session_snapshots (user_id, chapter_code, payload, updated_at)
                        VALUES (?, ?, ?, datetime('now'))
                        ON CONFLICT(user_id, chapter_code)
                        DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at
                        """,
                        (int(session.user_id), str(session.chapter_code), json.dumps(payload)),
                    )
                    conn.commit()
        except Exception:
            pass  # Never block tutoring flow

    def load(self, user_id: int, chapter_code: str) -> Optional[Dict[str, Any]]:
        """Return the last snapshot for this (user_id, chapter_code) or None."""
        if not self._ready:
            return None
        try:
            with self._lock:
                with self._connect() as conn:
                    row = conn.execute(
                        "SELECT payload FROM session_snapshots WHERE user_id=? AND chapter_code=?",
                        (int(user_id), str(chapter_code)),
                    ).fetchone()
            if row:
                return json.loads(row[0])
        except Exception:
            pass
        return None

    def save_async(self, session: Any) -> None:
        """Schedule a background save without blocking the request."""
        loop = None
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            pass
        if loop and loop.is_running():
            loop.run_in_executor(None, self.save, session)
        else:
            threading.Thread(target=self.save, args=(session,), daemon=True).start()


# Module-level singleton
snapshot_store = SessionSnapshotStore()
