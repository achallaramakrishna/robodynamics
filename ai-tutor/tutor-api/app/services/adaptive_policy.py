from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, Optional


class AdaptivePolicyService:
    ACTIONS = (
        "reteach_simpler",
        "hint_ladder_up",
        "steady_practice",
        "increase_challenge",
    )

    def __init__(self) -> None:
        self._enabled = str(os.getenv("AI_TUTOR_ADAPTIVE_POLICY_ENABLED", "true")).strip().lower() in {
            "1",
            "true",
            "yes",
            "on",
        }
        self._policy_path = Path(
            os.getenv(
                "AI_TUTOR_ADAPTIVE_POLICY_PATH",
                "/opt/robodynamics/vedic_math/policies/adaptive_policy_v1.json",
            )
        )
        self._min_observations = max(1, int(os.getenv("AI_TUTOR_ADAPTIVE_POLICY_MIN_OBS", "5")))
        self._mtime: float = -1.0
        self._contexts: Dict[str, Dict[str, Any]] = {}
        self._load_policy(force=True)

    def _load_policy(self, force: bool = False) -> None:
        if not self._enabled:
            return
        try:
            stat = self._policy_path.stat()
        except FileNotFoundError:
            if force:
                self._contexts = {}
                self._mtime = -1.0
            return
        except Exception:
            return

        if not force and stat.st_mtime <= self._mtime:
            return

        try:
            raw = json.loads(self._policy_path.read_text(encoding="utf-8"))
            contexts = raw.get("contexts", {})
            if isinstance(contexts, dict):
                self._contexts = contexts
                self._mtime = stat.st_mtime
        except Exception:
            # Keep last good model in memory.
            pass

    @staticmethod
    def _bucket_error(error_streak: Any) -> str:
        try:
            value = int(error_streak or 0)
        except Exception:
            value = 0
        if value >= 3:
            return "high"
        if value >= 1:
            return "medium"
        return "low"

    @staticmethod
    def _bucket_speed(response_ms: Any) -> str:
        try:
            value = float(response_ms or 0.0)
        except Exception:
            value = 0.0
        if value <= 0:
            return "unknown"
        if value <= 10000:
            return "fast"
        if value <= 22000:
            return "steady"
        return "slow"

    @staticmethod
    def _norm(value: Any, default: str = "unknown") -> str:
        text = str(value or "").strip().lower()
        return text or default

    def _context_keys(self, summary: Dict[str, Any], context: Dict[str, Any]) -> list[str]:
        chapter = self._norm(context.get("chapterCode") or summary.get("chapterCode"))
        exercise = self._norm(context.get("exerciseGroup") or summary.get("exerciseGroup"))
        confidence = self._norm(summary.get("confidenceLast"), "unknown")
        error_bucket = self._bucket_error(summary.get("errorStreak", 0))
        speed_bucket = self._bucket_speed(summary.get("lastResponseMs", 0))

        return [
            f"chapter={chapter}|exercise={exercise}|confidence={confidence}|error={error_bucket}|speed={speed_bucket}",
            f"chapter={chapter}|exercise={exercise}|error={error_bucket}|speed={speed_bucket}",
            f"chapter={chapter}|error={error_bucket}|speed={speed_bucket}",
            f"chapter={chapter}|confidence={confidence}",
            f"global|error={error_bucket}|speed={speed_bucket}",
            "global",
        ]

    @staticmethod
    def _tip_for_action(action: str) -> str:
        if action == "reteach_simpler":
            return "I will reteach this with one simpler, visual step first."
        if action == "hint_ladder_up":
            return "Let us use the next hint and solve one micro-step together."
        if action == "increase_challenge":
            return "Great progress. Next, I will give you a slightly harder variation."
        return "Good progress. Keep practicing one clear step at a time."

    def recommend(self, summary: Dict[str, Any], context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self._enabled:
            return None

        self._load_policy(force=False)
        if not self._contexts:
            return None

        for key in self._context_keys(summary, context):
            context_data = self._contexts.get(key)
            if not isinstance(context_data, dict):
                continue
            support = int(context_data.get("support", 0) or 0)
            action = str(context_data.get("bestAction", "")).strip()
            if action not in self.ACTIONS:
                continue
            if support < self._min_observations:
                continue
            return {
                "tutorAction": action,
                "coachTip": self._tip_for_action(action),
                "policyKey": key,
                "policySupport": support,
            }
        return None

