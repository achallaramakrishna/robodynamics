"""
BehaviorClassifier — Real-time student archetype detection.

Reads signals already collected in SessionStore.summary() and classifies
the student into one of 5 teaching archetypes after every check-answer call.
No external dependencies — pure signal math, runs in microseconds.
"""
from __future__ import annotations

from typing import Any, Dict


class BehaviorClassifier:
    """
    Archetypes
    ----------
    fast_learner    High accuracy, fast response, on a streak → challenge them
    struggling      Error streak ≥ 2 or very low accuracy → slow down, simplify
    disengaged      Slow responses consistently → re-engage with direct question
    curious         Many doubts raised → expand explanation, answer the why
    careful_learner Default — steady progress, warm consistent pace
    """

    ARCHETYPES = (
        "fast_learner",
        "struggling",
        "disengaged",
        "curious",
        "careful_learner",
    )

    # Tuning thresholds — adjust as real student data comes in
    _ERROR_STREAK_STRUGGLING = 2
    _ACCURACY_FLOOR_STRUGGLING = 35.0   # below this % → struggling
    _AVG_MS_DISENGAGED = 25_000         # 25 s average response → disengaged
    _DOUBT_COUNT_CURIOUS = 2            # 2+ doubts in session → curious
    _ACCURACY_FAST = 78.0              # ≥ this % + fast + streak → fast_learner
    _AVG_MS_FAST = 11_000              # ≤ this ms average → fast response
    _STREAK_FAST = 3                   # streak of 3+ correct → fast_learner
    _MIN_ATTEMPTS_TO_CLASSIFY = 2      # don't classify on first question

    def classify(self, summary: Dict[str, Any]) -> str:
        """Return the archetype string for the current session state."""
        attempts = int(summary.get("attempts", 0) or 0)
        if attempts < self._MIN_ATTEMPTS_TO_CLASSIFY:
            return "careful_learner"

        error_streak = int(summary.get("errorStreak", 0) or 0)
        accuracy = float(summary.get("accuracyPct", 0.0) or 0.0)
        avg_ms = float(summary.get("avgResponseMs", 0.0) or 0.0)
        doubt_count = int(summary.get("doubtCount", 0) or 0)
        streak = int(summary.get("streak", 0) or 0)

        # Priority order matters — struggling beats fast_learner check
        if error_streak >= self._ERROR_STREAK_STRUGGLING:
            return "struggling"
        if accuracy < self._ACCURACY_FLOOR_STRUGGLING and attempts >= 4:
            return "struggling"
        if avg_ms > self._AVG_MS_DISENGAGED and attempts >= 3:
            return "disengaged"
        if doubt_count >= self._DOUBT_COUNT_CURIOUS:
            return "curious"
        if (
            accuracy >= self._ACCURACY_FAST
            and 0 < avg_ms <= self._AVG_MS_FAST
            and streak >= self._STREAK_FAST
        ):
            return "fast_learner"

        return "careful_learner"

    @staticmethod
    def coaching_note(archetype: str) -> str:
        """
        One paragraph injected into the LLM system prompt that tells the avatar
        how to teach this particular student right now.
        """
        notes: Dict[str, str] = {
            "fast_learner": (
                "STUDENT IS A FAST LEARNER: High accuracy, quick responses, on a streak. "
                "Skip basic scaffolding — go straight to a harder variation. "
                "Brief praise then raise the bar immediately. "
                "Challenge them with the next-level number or edge case."
            ),
            "struggling": (
                "STUDENT IS STRUGGLING: Error streak detected. Slow down completely. "
                "Use the smallest possible numbers in examples (single digits if possible). "
                "Break the next step into one tiny move. "
                "Be very warm and encouraging — never impatient. "
                "Say: 'Let me show you this one more time, differently.'"
            ),
            "disengaged": (
                "STUDENT IS DISENGAGED: Slow to respond. Re-engage immediately. "
                "Use the student's name if known. Ask a direct, short question. "
                "Keep your response to 2 sentences maximum. "
                "Offer a small challenge: 'Can you beat 10 seconds on this one?'"
            ),
            "curious": (
                "STUDENT IS CURIOUS: They ask many doubts — they want to understand deeply. "
                "Expand your explanation beyond the minimum. "
                "Answer the 'why' behind the method. "
                "Connect to a real-world use case they would find interesting. "
                "Encourage the curiosity explicitly: 'Great question — here is why this works.'"
            ),
            "careful_learner": (
                "STUDENT IS A CAREFUL LEARNER: Progressing steadily at a normal pace. "
                "Maintain warm, consistent encouragement. "
                "Acknowledge every correct step before moving on. "
                "Keep the pace moderate — explain each step, then check once."
            ),
        }
        return notes.get(archetype, notes["careful_learner"])

    @staticmethod
    def board_speed_factor(archetype: str) -> float:
        """
        Multiplier for board animation speed per archetype.
        1.0 = normal, >1.0 = faster, <1.0 = slower.
        Returned to frontend in check-answer response so the next
        teachOnBoard() call uses the right pace.
        """
        speeds: Dict[str, float] = {
            "fast_learner": 1.4,
            "struggling": 0.65,
            "disengaged": 1.1,
            "curious": 0.85,
            "careful_learner": 1.0,
        }
        return speeds.get(archetype, 1.0)

    @staticmethod
    def silence_recovery_ms(archetype: str, base_ms: int = 12_000) -> int:
        """
        How long (ms) before the coach rescues a silent student.
        Struggling and careful students get more think time.
        """
        factors: Dict[str, float] = {
            "fast_learner": 0.7,
            "struggling": 1.8,
            "disengaged": 0.6,   # rescue fast — they've already tuned out
            "curious": 1.2,
            "careful_learner": 1.5,
        }
        return int(base_ms * factors.get(archetype, 1.0))
