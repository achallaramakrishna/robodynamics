"""
validators/math_validator.py — Layer 3: Mathematical accuracy validation.

Zero tolerance for wrong answers in an AI tutor. Uses:
  1. Safe eval for simple arithmetic expressions
  2. Answer string normalization + numeric comparison
  3. Worked example cross-check
"""

from __future__ import annotations
import re
import ast
import operator
from typing import Any


# ─── Safe arithmetic evaluator ──────────────────────────────────────────────

_SAFE_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

def _safe_eval(expr: str) -> float | int | None:
    """Evaluate a simple arithmetic expression safely (no exec, no builtins)."""
    expr = expr.strip().replace("×", "*").replace("÷", "/").replace("^", "**")
    try:
        tree = ast.parse(expr, mode="eval")
    except SyntaxError:
        return None

    def _eval(node):
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        elif isinstance(node, ast.Constant):
            if isinstance(node.value, (int, float)):
                return node.value
        elif isinstance(node, ast.BinOp):
            op_fn = _SAFE_OPS.get(type(node.op))
            if op_fn:
                l, r = _eval(node.left), _eval(node.right)
                if l is not None and r is not None:
                    try:
                        return op_fn(l, r)
                    except ZeroDivisionError:
                        return None
        elif isinstance(node, ast.UnaryOp):
            op_fn = _SAFE_OPS.get(type(node.op))
            if op_fn:
                operand = _eval(node.operand)
                if operand is not None:
                    return op_fn(operand)
        return None

    try:
        result = _eval(tree)
        if isinstance(result, float) and result == int(result):
            return int(result)
        return result
    except Exception:
        return None


def _normalize_answer(ans: str) -> str:
    """Normalize an answer string for comparison."""
    if not ans:
        return ""
    # Remove spaces, lowercase
    ans = ans.strip().lower()
    # Remove trailing zeros after decimal: "15.0" → "15"
    try:
        f = float(ans)
        if f == int(f):
            return str(int(f))
        return str(round(f, 6))
    except ValueError:
        pass
    # Remove non-numeric noise (e.g. "15 cm" → "15")
    m = re.match(r"^(-?\d+\.?\d*)", ans)
    return m.group(1) if m else ans


def _extract_arithmetic_from_question(q_text: str) -> str | None:
    """
    Try to extract a pure arithmetic expression from a question like:
      "8 + 7 = ?"         → "8 + 7"
      "What is 19 × 21?"  → "19 * 21"
      "97 + 98 = ?"       → "97 + 98"
    Returns None if question doesn't look like simple arithmetic.
    """
    q = q_text.strip()
    # Pattern 1: "NUM OP NUM = ?"
    m = re.match(
        r"^(\d+\.?\d*)\s*([+\-×÷\*/])\s*(\d+\.?\d*)\s*=\s*\?",
        q
    )
    if m:
        a, op, b = m.group(1), m.group(2), m.group(3)
        op = op.replace("×", "*").replace("÷", "/")
        return f"{a} {op} {b}"

    # Pattern 2: "What is NUM OP NUM?" or "What is NUM OP NUM"
    m = re.match(
        r"^(?:what\s+is\s+|find\s+|calculate\s+)?(\d+\.?\d*)\s*([+\-×÷\*/])\s*(\d+\.?\d*)",
        q, re.IGNORECASE
    )
    if m:
        a, op, b = m.group(1), m.group(2), m.group(3)
        op = op.replace("×", "*").replace("÷", "/")
        return f"{a} {op} {b}"

    # Pattern 3: "NUM^2" or "NUM²"
    m = re.match(r"^(\d+)\s*[\^²]", q)
    if m:
        return f"{m.group(1)} ** 2"

    return None


class MathValidator:
    def __init__(self, standard: dict) -> None:
        self._s = standard["layer_3_math_accuracy"]
        self._scoring = self._s["scoring"]

    def validate(self, chapter: dict, chapter_code: str) -> dict:
        """
        Returns:
          {
            pass: bool,
            score: float (0-30),
            issues: [...],
            stats: {verified, wrong, unverifiable, total}
          }
        """
        issues: list[dict] = []
        question_pool = chapter.get("questionPool", [])
        worked_examples = chapter.get("workedExamples", [])

        verified = 0
        wrong = 0
        unverifiable = 0
        total = len(question_pool) + len(worked_examples)

        # ── Question pool math check ──────────────────────────────────────
        for i, q in enumerate(question_pool):
            if not isinstance(q, dict):
                continue
            q_text = q.get("questionText", "")
            expected = q.get("expectedAnswer", "")

            if not expected.strip():
                # Already caught in schema layer
                continue

            expr = _extract_arithmetic_from_question(q_text)
            if expr is None:
                unverifiable += 1
                continue

            computed = _safe_eval(expr)
            if computed is None:
                unverifiable += 1
                continue

            # Compare
            expected_norm = _normalize_answer(str(expected))
            computed_norm = _normalize_answer(str(computed))

            if expected_norm == computed_norm:
                verified += 1
            else:
                wrong += 1
                issues.append(self._issue(
                    "error", "WRONG_MATH_ANSWER",
                    f"questionPool[{i}]: '{q_text}' → expected '{expected}' but computed '{computed}'",
                    field_path=f"questionPool[{i}].expectedAnswer",
                    actual_value=str(expected),
                    expected_value=str(computed),
                    suggested_fix=f"Change expectedAnswer from '{expected}' to '{computed}'",
                ))

        # ── Worked examples math check ────────────────────────────────────
        for i, we in enumerate(worked_examples):
            if not isinstance(we, dict):
                continue
            q_text = we.get("question", "")
            expected = we.get("answer", "")

            if not expected.strip():
                issues.append(self._issue(
                    "error", "EMPTY_WORKED_EXAMPLE_ANSWER",
                    f"workedExamples[{i}] has empty answer",
                    field_path=f"workedExamples[{i}].answer",
                    suggested_fix="Provide the correct computed answer",
                ))
                wrong += 1
                continue

            expr = _extract_arithmetic_from_question(q_text)
            if expr is None:
                unverifiable += 1
                continue

            computed = _safe_eval(expr)
            if computed is None:
                unverifiable += 1
                continue

            expected_norm = _normalize_answer(str(expected))
            computed_norm = _normalize_answer(str(computed))

            if expected_norm == computed_norm:
                verified += 1
            else:
                wrong += 1
                issues.append(self._issue(
                    "error", "WRONG_WORKED_EXAMPLE_ANSWER",
                    f"workedExamples[{i}]: '{q_text}' → expected '{expected}' but computed '{computed}'",
                    field_path=f"workedExamples[{i}].answer",
                    actual_value=str(expected),
                    expected_value=str(computed),
                    suggested_fix=f"Change answer from '{expected}' to '{computed}'",
                ))

        # ── Answer format checks ──────────────────────────────────────────
        for i, q in enumerate(question_pool[:50]):
            if not isinstance(q, dict):
                continue
            ans = q.get("expectedAnswer", "")
            if ans != ans.strip():
                issues.append(self._issue(
                    "info", "ANSWER_HAS_TRAILING_SPACE",
                    f"questionPool[{i}].expectedAnswer has leading/trailing whitespace",
                    field_path=f"questionPool[{i}].expectedAnswer",
                    actual_value=repr(ans),
                    suggested_fix="Strip whitespace from expectedAnswer",
                ))

        # ── Score calculation ─────────────────────────────────────────────
        max_score = self._scoring["perfect_score"]
        verifiable = verified + wrong
        if verifiable == 0:
            # No questions to verify — cap at 70%
            score = max_score * 0.7
            issues.append(self._issue(
                "warning", "NO_VERIFIABLE_QUESTIONS",
                "No questions could be automatically verified (no simple arithmetic found)",
                suggested_fix="Add at least some simple arithmetic questions (e.g., 'NUM OP NUM = ?')",
            ))
        else:
            accuracy = verified / verifiable
            score = max_score * accuracy
            deduct_unverifiable = len([i for i in issues if i["severity"] == "info"]) * \
                                   self._scoring["deduction_per_unverifiable_answer"]
            score = max(0.0, score - deduct_unverifiable)

        passed = wrong == 0

        return {
            "pass": passed,
            "score": round(min(score, max_score), 2),
            "issues": issues,
            "stats": {
                "verified": verified,
                "wrong": wrong,
                "unverifiable": unverifiable,
                "total_checked": total,
                "accuracy_pct": round(verified / max(verified + wrong, 1) * 100, 1),
            },
        }

    @staticmethod
    def _issue(severity, rule_id, message, field_path=None,
               actual_value=None, expected_value=None, suggested_fix=None):
        return {
            "layer": "math",
            "severity": severity,
            "rule_id": rule_id,
            "message": message,
            "field_path": field_path,
            "actual_value": actual_value,
            "expected_value": expected_value,
            "suggested_fix": suggested_fix,
        }
