"""
validators/completeness_validator.py — Layer 2: Content completeness validation.

Checks minimum content volumes (question pool size, worked examples, screenplay
beats, teaching phases, difficulty distribution) against the quality standard.
"""

from __future__ import annotations
import re
from collections import Counter
from typing import Any


class CompletenessValidator:
    def __init__(self, standard: dict) -> None:
        self._s = standard["layer_2_completeness"]

    def validate(self, chapter: dict, chapter_code: str) -> dict:
        """
        Returns:
          {
            pass: bool,
            score: float (0-25),
            issues: [...],
            stats: {question_pool_count, worked_example_count, ...}
          }
        """
        issues: list[dict] = []
        points = 0.0
        sc = self._s["scoring"]["full_score_conditions"]
        max_score = sum(v["points"] for v in sc.values())

        question_pool = chapter.get("questionPool", [])
        worked_examples = chapter.get("workedExamples", [])
        starter_practice = chapter.get("starterPractice", [])
        teaching_script = chapter.get("teachingScript", [])
        screenplay = chapter.get("screenplay", [])
        teaching_flow = chapter.get("teachingFlowStages", [])
        learning_goals = chapter.get("learningGoals", [])
        subtopics = chapter.get("subtopics", [])
        core_ideas = chapter.get("coreIdeas", [])

        # ── Question pool size ────────────────────────────────────────────
        qp_count = len(question_pool)
        qp_min = self._s["min_question_pool_size"]
        if qp_count >= qp_min:
            points += sc["question_pool_size"]["points"]
        else:
            severity = "error" if qp_count == 0 else "warning"
            issues.append(self._issue(
                severity, "INSUFFICIENT_QUESTION_POOL",
                f"questionPool has {qp_count} questions, minimum is {qp_min}",
                field_path="questionPool",
                actual_value=str(qp_count),
                expected_value=str(qp_min),
                suggested_fix=f"Add {qp_min - qp_count} more questions (mix of easy/medium/hard)",
            ))

        # ── Worked examples ───────────────────────────────────────────────
        we_count = len(worked_examples)
        we_min = self._s["min_worked_examples"]
        if we_count >= we_min:
            points += sc["worked_examples"]["points"]
        else:
            issues.append(self._issue(
                "error", "INSUFFICIENT_WORKED_EXAMPLES",
                f"Only {we_count} workedExamples, minimum is {we_min}",
                field_path="workedExamples",
                actual_value=str(we_count),
                expected_value=str(we_min),
                suggested_fix=f"Add {we_min - we_count} more worked examples showing full method steps",
            ))

        # ── Screenplay beats ──────────────────────────────────────────────
        sc_count = len(screenplay)
        sc_min = self._s["min_screenplay_beats"]
        if sc_count >= sc_min:
            points += sc["screenplay_beats"]["points"]
        else:
            issues.append(self._issue(
                "warning", "FEW_SCREENPLAY_BEATS",
                f"screenplay has {sc_count} beats, minimum is {sc_min}",
                field_path="screenplay",
                actual_value=str(sc_count),
                expected_value=str(sc_min),
                suggested_fix="Add more teacherLine + boardAction beats to flesh out the lesson",
            ))

        # ── Teaching flow phases ──────────────────────────────────────────
        required_phases = set(self._s["required_teaching_phases"])
        actual_phases = {
            s.get("phase", "").upper()
            for s in teaching_flow
            if isinstance(s, dict)
        }
        missing_phases = required_phases - actual_phases
        if not missing_phases:
            points += sc["teaching_phases"]["points"]
        else:
            issues.append(self._issue(
                "error", "MISSING_TEACHING_PHASES",
                f"teachingFlowStages missing phases: {sorted(missing_phases)}",
                field_path="teachingFlowStages",
                actual_value=", ".join(sorted(actual_phases)) or "none",
                expected_value=", ".join(sorted(required_phases)),
                suggested_fix=f"Add missing phase entries: {sorted(missing_phases)}",
            ))

        # ── Difficulty distribution ───────────────────────────────────────
        difficulties = [
            q.get("difficulty", "").lower()
            for q in question_pool
            if isinstance(q, dict)
        ]
        diff_counts = Counter(difficulties)
        total_q = len(difficulties)
        required_levels = set(self._s["required_difficulty_levels"])
        present_levels = set(diff_counts.keys()) & required_levels
        missing_levels = required_levels - present_levels

        if not missing_levels and total_q > 0:
            # Check percentage minimums
            min_dist = self._s["min_difficulty_distribution"]
            dist_ok = True
            for level, min_pct in min_dist.items():
                pct = (diff_counts.get(level, 0) / total_q) * 100
                if pct < min_pct:
                    dist_ok = False
                    issues.append(self._issue(
                        "warning", "LOW_DIFFICULTY_PERCENTAGE",
                        f"'{level}' questions are only {pct:.0f}% of pool, minimum is {min_pct}%",
                        field_path="questionPool[*].difficulty",
                        actual_value=f"{pct:.0f}%",
                        expected_value=f">= {min_pct}%",
                        suggested_fix=f"Add more '{level}' difficulty questions",
                    ))
            if dist_ok:
                points += sc["difficulty_distribution"]["points"]
        elif missing_levels:
            issues.append(self._issue(
                "error", "MISSING_DIFFICULTY_LEVELS",
                f"questionPool missing difficulty levels: {sorted(missing_levels)}",
                field_path="questionPool[*].difficulty",
                actual_value=", ".join(sorted(present_levels)) or "none",
                expected_value=", ".join(sorted(required_levels)),
                suggested_fix=f"Add questions with difficulty levels: {sorted(missing_levels)}",
            ))

        # ── Minimum counts (other fields) ─────────────────────────────────
        for field, min_val, label in [
            (learning_goals, self._s["min_learning_goals"], "learningGoals"),
            (subtopics, self._s["min_subtopics"], "subtopics"),
            (core_ideas, self._s["min_core_ideas"], "coreIdeas"),
            (starter_practice, self._s["min_starter_practice"], "starterPractice"),
            (teaching_script, self._s["min_teaching_steps"], "teachingScript"),
        ]:
            if len(field) < min_val:
                issues.append(self._issue(
                    "warning", f"INSUFFICIENT_{label.upper()}",
                    f"{label} has {len(field)} items, minimum is {min_val}",
                    field_path=label,
                    actual_value=str(len(field)),
                    expected_value=str(min_val),
                ))

        # ── Question ID format ────────────────────────────────────────────
        pattern = self._s.get("question_id_pattern")
        if pattern:
            bad_ids = [
                q.get("questionId", "")
                for q in question_pool[:20]
                if isinstance(q, dict)
                and not re.match(pattern, q.get("questionId", ""))
            ]
            if bad_ids:
                issues.append(self._issue(
                    "info", "NONSTANDARD_QUESTION_ID",
                    f"{len(bad_ids)} question IDs don't match pattern {pattern}",
                    field_path="questionPool[*].questionId",
                    actual_value=bad_ids[0] if bad_ids else None,
                    suggested_fix=f"Use format: L{{n}}_{{EXERCISEGROUP}}_{{DIFFICULTY_INIT}}_{{6hexchars}}",
                ))

        # ── Duplicate question text ───────────────────────────────────────
        q_texts = [
            q.get("questionText", "").strip().lower()
            for q in question_pool
            if isinstance(q, dict) and q.get("questionText")
        ]
        dups = {t for t in q_texts if q_texts.count(t) > 1}
        if dups:
            issues.append(self._issue(
                "warning", "DUPLICATE_QUESTION_TEXT",
                f"{len(dups)} duplicate question texts found in questionPool",
                suggested_fix="Ensure all questionText values are unique",
            ))

        # ── Score ─────────────────────────────────────────────────────────
        errors = sum(1 for i in issues if i["severity"] == "error")
        passed = errors == 0

        return {
            "pass": passed,
            "score": round(min(points, max_score), 2),
            "issues": issues,
            "stats": {
                "question_pool_count": qp_count,
                "worked_example_count": we_count,
                "screenplay_beat_count": sc_count,
                "teaching_phases_found": sorted(actual_phases),
                "difficulty_distribution": dict(diff_counts),
                "total_difficulty_questions": total_q,
            },
        }

    @staticmethod
    def _issue(severity, rule_id, message, field_path=None,
               actual_value=None, expected_value=None, suggested_fix=None):
        return {
            "layer": "completeness",
            "severity": severity,
            "rule_id": rule_id,
            "message": message,
            "field_path": field_path,
            "actual_value": actual_value,
            "expected_value": expected_value,
            "suggested_fix": suggested_fix,
        }
