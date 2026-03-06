from __future__ import annotations

import os
from typing import Any, Dict

import httpx


class QualityRefreshService:
    def __init__(self) -> None:
        self._openai_api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self._openai_model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini").strip()
        self._refresh_interval = max(1, int(os.getenv("AI_TUTOR_REFRESH_INTERVAL", "5")))
        self._enabled = bool(self._openai_api_key)

    @staticmethod
    def _fallback_tip(summary: Dict[str, Any], correct: bool) -> Dict[str, str]:
        attempts = int(summary.get("attempts", 0) or 0)
        accuracy = float(summary.get("accuracyPct", 0.0) or 0.0)
        avg_ms = float(summary.get("avgResponseMs", 0.0) or 0.0)
        error_streak = int(summary.get("errorStreak", 0) or 0)

        if error_streak >= 2:
            return {"tutorAction": "reteach_simpler", "coachTip": "I will slow down and explain this with a simpler example first."}
        if not correct and attempts >= 3:
            return {"tutorAction": "hint_ladder_up", "coachTip": "Let's use hint 2 and solve one step together before you retry."}
        if accuracy >= 80 and avg_ms <= 14000:
            return {"tutorAction": "increase_challenge", "coachTip": "Great pace. I will move you to a slightly harder variation next."}
        return {"tutorAction": "steady_practice", "coachTip": "Good progress. Keep practicing with one clear step at a time."}

    async def maybe_refresh(self, summary: Dict[str, Any], context: Dict[str, Any], correct: bool) -> Dict[str, str]:
        attempts = int(summary.get("attempts", 0) or 0)
        if attempts == 0:
            return self._fallback_tip(summary, correct)
        if attempts % self._refresh_interval != 0:
            return self._fallback_tip(summary, correct)
        if not self._enabled:
            return self._fallback_tip(summary, correct)

        prompt = (
            "You are a tutoring quality reviewer. Return JSON with keys tutorAction and coachTip. "
            "tutorAction must be one of: reteach_simpler, hint_ladder_up, increase_challenge, steady_practice. "
            "coachTip max 20 words, child-friendly.\n"
            f"Context: {context}\nSummary: {summary}\nLastCorrect: {correct}"
        )

        headers = {"Authorization": f"Bearer {self._openai_api_key}", "Content-Type": "application/json"}
        body = {
            "model": self._openai_model,
            "input": prompt,
            "text": {"format": {"type": "json_object"}},
        }
        try:
            async with httpx.AsyncClient(timeout=6.5) as client:
                response = await client.post("https://api.openai.com/v1/responses", headers=headers, json=body)
            if response.status_code >= 300:
                return self._fallback_tip(summary, correct)
            payload = response.json()
            output_text = payload.get("output_text", "").strip()
            if not output_text:
                return self._fallback_tip(summary, correct)
            # Avoid dependency on json schema parsing complexity; keep a safe fallback.
            # If response text is malformed, use fallback.
            import json

            parsed = json.loads(output_text)
            action = str(parsed.get("tutorAction", "")).strip()
            tip = str(parsed.get("coachTip", "")).strip()
            if action not in {"reteach_simpler", "hint_ladder_up", "increase_challenge", "steady_practice"}:
                return self._fallback_tip(summary, correct)
            if not tip:
                return self._fallback_tip(summary, correct)
            return {"tutorAction": action, "coachTip": tip}
        except Exception:
            return self._fallback_tip(summary, correct)
