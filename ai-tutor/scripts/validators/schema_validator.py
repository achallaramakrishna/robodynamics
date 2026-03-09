"""
validators/schema_validator.py — Layer 1: Schema & structure validation.

Checks that all required fields exist with correct types and constraints.
Fast, zero network calls, always runs first.
"""

from __future__ import annotations
import re
from typing import Any


class SchemaValidator:
    def __init__(self, standard: dict) -> None:
        self._s = standard["layer_1_schema"]
        self._scoring = self._s["scoring"]

    def validate(self, chapter: dict, chapter_code: str) -> dict:
        """
        Returns:
          {
            pass: bool,
            score: float (0-20),
            issues: [ {layer, severity, rule_id, message, field_path, ...} ]
          }
        """
        issues: list[dict] = []

        # ── 1. Required top-level fields ──────────────────────────────────
        for field in self._s["required_top_level_fields"]:
            if field not in chapter:
                issues.append(self._issue(
                    "error", "MISSING_REQUIRED_FIELD",
                    f"Required field '{field}' is missing from chapter JSON",
                    field_path=field,
                    suggested_fix=f"Add the '{field}' key to the chapter JSON",
                ))

        # ── 2. Type checks ────────────────────────────────────────────────
        type_map = {"string": str, "integer": int, "array": list, "object": dict}
        for field, expected_type in self._s["field_types"].items():
            if field in chapter:
                py_type = type_map.get(expected_type)
                if py_type and not isinstance(chapter[field], py_type):
                    issues.append(self._issue(
                        "error", "WRONG_FIELD_TYPE",
                        f"Field '{field}' should be {expected_type}, got {type(chapter[field]).__name__}",
                        field_path=field,
                        actual_value=type(chapter[field]).__name__,
                        expected_value=expected_type,
                    ))

        # ── 3. Constraint checks ──────────────────────────────────────────
        for field, constraints in self._s.get("field_constraints", {}).items():
            if field not in chapter:
                continue
            val = chapter[field]
            if "min" in constraints and isinstance(val, (int, float)):
                if val < constraints["min"]:
                    issues.append(self._issue(
                        "warning", "VALUE_BELOW_MIN",
                        f"'{field}' is {val}, minimum is {constraints['min']}",
                        field_path=field,
                        actual_value=str(val),
                        expected_value=f">= {constraints['min']}",
                    ))
            if "max" in constraints and isinstance(val, (int, float)):
                if val > constraints["max"]:
                    issues.append(self._issue(
                        "warning", "VALUE_ABOVE_MAX",
                        f"'{field}' is {val}, maximum is {constraints['max']}",
                        field_path=field,
                        actual_value=str(val),
                        expected_value=f"<= {constraints['max']}",
                    ))
            if "min_length" in constraints and isinstance(val, str):
                if len(val) < constraints["min_length"]:
                    issues.append(self._issue(
                        "warning", "STRING_TOO_SHORT",
                        f"'{field}' is too short ({len(val)} chars, min {constraints['min_length']})",
                        field_path=field,
                    ))
            if "max_length" in constraints and isinstance(val, str):
                if len(val) > constraints["max_length"]:
                    issues.append(self._issue(
                        "warning", "STRING_TOO_LONG",
                        f"'{field}' is too long ({len(val)} chars, max {constraints['max_length']})",
                        field_path=field,
                    ))

        # ── 4. Screenplay beat fields ─────────────────────────────────────
        screenplay = chapter.get("screenplay", [])
        if isinstance(screenplay, list):
            required_beat_fields = self._s.get("screenplay_beat_required_fields", [])
            for i, beat in enumerate(screenplay[:5]):  # spot-check first 5
                if not isinstance(beat, dict):
                    issues.append(self._issue(
                        "error", "BEAT_NOT_DICT",
                        f"screenplay[{i}] is not a dict",
                        field_path=f"screenplay[{i}]",
                    ))
                    continue
                for f in required_beat_fields:
                    if f not in beat:
                        issues.append(self._issue(
                            "warning", "BEAT_MISSING_FIELD",
                            f"screenplay[{i}] missing field '{f}'",
                            field_path=f"screenplay[{i}].{f}",
                        ))

        # ── 5. Question pool item fields ──────────────────────────────────
        question_pool = chapter.get("questionPool", [])
        if isinstance(question_pool, list):
            required_q_fields = self._s.get("question_required_fields", [])
            for i, q in enumerate(question_pool[:10]):  # spot-check first 10
                if not isinstance(q, dict):
                    issues.append(self._issue(
                        "error", "QUESTION_NOT_DICT",
                        f"questionPool[{i}] is not a dict",
                        field_path=f"questionPool[{i}]",
                    ))
                    continue
                for f in required_q_fields:
                    if f not in q:
                        issues.append(self._issue(
                            "error", "QUESTION_MISSING_FIELD",
                            f"questionPool[{i}] missing required field '{f}'",
                            field_path=f"questionPool[{i}].{f}",
                        ))
                # Check empty expectedAnswer
                if q.get("expectedAnswer", "").strip() == "":
                    issues.append(self._issue(
                        "error", "EMPTY_EXPECTED_ANSWER",
                        f"questionPool[{i}] has empty expectedAnswer",
                        field_path=f"questionPool[{i}].expectedAnswer",
                        suggested_fix="Provide a concrete numeric or text answer",
                    ))

        # ── 6. Worked examples fields ─────────────────────────────────────
        worked_examples = chapter.get("workedExamples", [])
        if isinstance(worked_examples, list):
            required_we_fields = self._s.get("worked_example_required_fields", [])
            for i, we in enumerate(worked_examples):
                if not isinstance(we, dict):
                    continue
                for f in required_we_fields:
                    if f not in we:
                        issues.append(self._issue(
                            "error", "WORKED_EXAMPLE_MISSING_FIELD",
                            f"workedExamples[{i}] missing field '{f}'",
                            field_path=f"workedExamples[{i}].{f}",
                        ))

        # ── Score ─────────────────────────────────────────────────────────
        errors = sum(1 for i in issues if i["severity"] == "error")
        warnings = sum(1 for i in issues if i["severity"] == "warning")
        max_score = self._scoring["all_fields_present"]
        deduct = (errors * self._scoring["deduction_per_missing_field"]
                  + warnings * self._scoring["deduction_per_type_error"])
        score = max(0.0, float(max_score - deduct))
        passed = errors == 0

        return {
            "pass": passed,
            "score": round(score, 2),
            "issues": issues,
            "error_count": errors,
            "warning_count": warnings,
        }

    @staticmethod
    def _issue(
        severity: str,
        rule_id: str,
        message: str,
        field_path: str | None = None,
        actual_value: str | None = None,
        expected_value: str | None = None,
        suggested_fix: str | None = None,
    ) -> dict:
        return {
            "layer": "schema",
            "severity": severity,
            "rule_id": rule_id,
            "message": message,
            "field_path": field_path,
            "actual_value": actual_value,
            "expected_value": expected_value,
            "suggested_fix": suggested_fix,
        }
