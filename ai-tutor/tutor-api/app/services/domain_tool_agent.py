from __future__ import annotations

import ast
import contextlib
import io
import re
from typing import Any, Dict, List


class DomainToolAgent:
    _SAFE_BUILTINS = {
        "abs": abs,
        "all": all,
        "any": any,
        "bool": bool,
        "dict": dict,
        "enumerate": enumerate,
        "float": float,
        "int": int,
        "len": len,
        "list": list,
        "max": max,
        "min": min,
        "range": range,
        "reversed": reversed,
        "round": round,
        "set": set,
        "sorted": sorted,
        "str": str,
        "sum": sum,
        "tuple": tuple,
        "zip": zip,
    }
    _BANNED_AST_NODES = (
        ast.Import,
        ast.ImportFrom,
        ast.With,
        ast.AsyncWith,
        ast.Try,
        ast.Raise,
        ast.Lambda,
        ast.ClassDef,
        ast.Global,
        ast.Nonlocal,
        ast.Delete,
        ast.While,
        ast.AsyncFunctionDef,
        ast.Await,
        ast.Yield,
        ast.YieldFrom,
    )

    def run_for_question(self, lesson: Dict[str, Any], question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]:
        tool_requirements = lesson.get("toolRequirements") if isinstance(lesson.get("toolRequirements"), list) else []
        subject_domain = str(lesson.get("subjectDomain", "")).strip().lower()
        requested_tools = {str(item.get("toolName", "")).strip().lower() for item in tool_requirements if isinstance(item, dict)}

        if "code_runner" in requested_tools or subject_domain == "coding":
            return self._run_code_runner(question, learner_answer)

        if "answer_checker" in requested_tools or subject_domain in {"math", "exam_prep", "science"}:
            return self._run_answer_checker(question, learner_answer)

        return {
            "toolName": "none",
            "mode": "none",
            "pass": False,
            "executed": False,
            "reason": "tool.not_required",
            "result": "No domain tool required for this lesson.",
        }

    def _run_code_runner(self, question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]:
        code = str(learner_answer or "").strip()
        tests = question.get("tests") if isinstance(question.get("tests"), list) else []
        if not code:
            return {
                "toolName": "code_runner",
                "mode": "sandboxed",
                "pass": False,
                "executed": False,
                "reason": "tool.code_runner.empty_submission",
                "result": "No code was submitted.",
            }
        if not tests:
            return {
                "toolName": "code_runner",
                "mode": "sandboxed",
                "pass": False,
                "executed": False,
                "reason": "tool.code_runner.no_tests",
                "result": "Coding question has no runnable tests yet.",
            }
        try:
            parsed = ast.parse(code, mode="exec")
            self._validate_code_ast(parsed)
        except SyntaxError as ex:
            return {
                "toolName": "code_runner",
                "mode": "sandboxed",
                "pass": False,
                "executed": True,
                "reason": "tool.code_runner.syntax_error",
                "result": f"Syntax error: {ex.msg}",
            }
        except ValueError as ex:
            return {
                "toolName": "code_runner",
                "mode": "sandboxed",
                "pass": False,
                "executed": True,
                "reason": "tool.code_runner.unsafe_code",
                "result": str(ex),
            }

        namespace: Dict[str, Any] = {"__builtins__": self._SAFE_BUILTINS}
        stdout = io.StringIO()
        try:
            with contextlib.redirect_stdout(stdout):
                exec(compile(parsed, "<learner_code>", "exec"), namespace, namespace)
        except Exception as ex:
            return {
                "toolName": "code_runner",
                "mode": "sandboxed",
                "pass": False,
                "executed": True,
                "reason": "tool.code_runner.runtime_error",
                "result": f"Runtime error: {type(ex).__name__}: {ex}",
            }

        function_name = self._infer_function_name(parsed)
        test_results: List[Dict[str, Any]] = []
        passed = 0
        for idx, test in enumerate(tests):
            if not isinstance(test, dict):
                continue
            outcome = self._execute_code_test(namespace, test, function_name, idx)
            test_results.append(outcome)
            if outcome.get("pass"):
                passed += 1

        total = len(test_results)
        all_passed = total > 0 and passed == total
        return {
            "toolName": "code_runner",
            "mode": "sandboxed",
            "pass": all_passed,
            "executed": True,
            "reason": "tool.code_runner.all_tests_passed" if all_passed else "tool.code_runner.test_failure",
            "result": f"Passed {passed} of {total} tests.",
            "stdout": stdout.getvalue()[:1000],
            "tests": test_results,
        }

    def _execute_code_test(self, namespace: Dict[str, Any], test: Dict[str, Any], function_name: str | None, index: int) -> Dict[str, Any]:
        expected = test.get("expected")
        label = str(test.get("name", f"test_{index + 1}"))
        try:
            if isinstance(test.get("call"), str) and test.get("call", "").strip():
                actual = self._safe_eval_call(str(test.get("call")), namespace)
            else:
                target_name = str(test.get("target") or function_name or "").strip()
                if not target_name or target_name not in namespace or not callable(namespace[target_name]):
                    raise ValueError("No callable target available for test execution.")
                args = test.get("args") if isinstance(test.get("args"), list) else []
                kwargs = test.get("kwargs") if isinstance(test.get("kwargs"), dict) else {}
                actual = namespace[target_name](*args, **kwargs)
            passed = self._compare_values(expected, actual)
            return {
                "name": label,
                "pass": passed,
                "expected": expected,
                "actual": actual,
            }
        except Exception as ex:
            return {
                "name": label,
                "pass": False,
                "expected": expected,
                "actual": None,
                "error": f"{type(ex).__name__}: {ex}",
            }

    def _run_answer_checker(self, question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]:
        expected_raw = str(question.get("expectedAnswer", "")).strip()
        received_raw = str(learner_answer or "").strip()
        question_type = str(question.get("questionType", question.get("type", "text"))).strip().lower()

        if question_type == "fill_step" or (isinstance(question.get("steps"), list) and question.get("steps")):
            return self._run_fill_step_checker(question, received_raw)

        passed = False
        reason = "tool.answer_checker.no_match"

        if question_type in {"mcq", "speed_mcq"}:
            try:
                correct_index = int(question.get("correctIndex")) if question.get("correctIndex") is not None else None
            except Exception:
                correct_index = None
            options = question.get("options") if isinstance(question.get("options"), list) else []
            if correct_index is not None and 0 <= correct_index < len(options):
                expected_option = str(options[correct_index]).strip()
                passed = self._matches_expected(expected_option, received_raw)
                if not passed:
                    expected_label = chr(ord("A") + correct_index)
                    received_label = self._normalize_text(received_raw)
                    passed = received_label in {expected_label.lower(), str(correct_index + 1)}
                    if passed:
                        reason = "tool.answer_checker.mcq_label"
                if passed and reason == "tool.answer_checker.no_match":
                    reason = "tool.answer_checker.mcq_exact"

        if not passed and expected_raw:
            passed = self._matches_expected(expected_raw, received_raw)
            if passed:
                reason = "tool.answer_checker.expected_match"

        if not passed:
            acceptable = question.get("acceptableAnswers") if isinstance(question.get("acceptableAnswers"), list) else []
            for alt in acceptable:
                if self._matches_expected(str(alt), received_raw):
                    passed = True
                    reason = "tool.answer_checker.acceptable_match"
                    break

        return {
            "toolName": "answer_checker",
            "mode": "deterministic",
            "pass": passed,
            "executed": True,
            "reason": reason,
            "result": "Answer matches deterministic tool check." if passed else "Answer did not satisfy deterministic tool check.",
        }

    def _run_fill_step_checker(self, question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]:
        steps = [step for step in question.get("steps", []) if isinstance(step, dict)]
        expected_answers = [str(step.get("answer", "")).strip() for step in steps if str(step.get("answer", "")).strip()]
        received_parts = self._split_step_answers(learner_answer)

        matched = 0
        step_results: List[Dict[str, Any]] = []
        for idx, expected in enumerate(expected_answers):
            candidate = received_parts[idx] if idx < len(received_parts) else learner_answer
            is_match = self._matches_expected(expected, candidate)
            if is_match:
                matched += 1
            step_results.append({
                "index": idx,
                "expected": expected,
                "received": received_parts[idx] if idx < len(received_parts) else "",
                "pass": is_match,
            })

        passed = bool(expected_answers) and matched == len(expected_answers)
        return {
            "toolName": "answer_checker",
            "mode": "deterministic",
            "pass": passed,
            "executed": True,
            "reason": "tool.answer_checker.fill_step_complete" if passed else "tool.answer_checker.fill_step_incomplete",
            "result": f"Matched {matched} of {len(expected_answers)} expected steps.",
            "stepResults": step_results,
        }

    @classmethod
    def _validate_code_ast(cls, parsed: ast.AST) -> None:
        for node in ast.walk(parsed):
            if isinstance(node, cls._BANNED_AST_NODES):
                raise ValueError(f"Unsupported code construct: {type(node).__name__}")
            if isinstance(node, ast.Attribute) and str(getattr(node, "attr", "")).startswith("__"):
                raise ValueError("Dunder attribute access is not allowed.")
            if isinstance(node, ast.Name) and node.id in {"open", "exec", "eval", "compile", "input", "__import__", "globals", "locals", "vars", "help", "dir", "os", "sys", "subprocess", "pathlib"}:
                raise ValueError(f"Blocked identifier: {node.id}")
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in {"open", "exec", "eval", "compile", "input", "__import__"}:
                raise ValueError(f"Blocked function call: {node.func.id}")

    @staticmethod
    def _infer_function_name(parsed: ast.AST) -> str | None:
        for node in getattr(parsed, "body", []):
            if isinstance(node, ast.FunctionDef):
                return node.name
        return None

    def _safe_eval_call(self, expr: str, namespace: Dict[str, Any]) -> Any:
        parsed = ast.parse(expr, mode="eval")
        for node in ast.walk(parsed):
            if isinstance(node, (ast.Import, ast.ImportFrom, ast.Attribute, ast.Lambda)):
                raise ValueError("Unsupported test call expression.")
            if isinstance(node, ast.Name) and node.id not in namespace and node.id not in self._SAFE_BUILTINS:
                raise ValueError(f"Unknown symbol in test call: {node.id}")
        return eval(compile(parsed, "<test_call>", "eval"), {"__builtins__": self._SAFE_BUILTINS}, namespace)

    def _compare_values(self, expected: Any, actual: Any) -> bool:
        if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
            return abs(float(expected) - float(actual)) < 1e-9
        if isinstance(expected, list) and isinstance(actual, list):
            return expected == actual
        if isinstance(expected, dict) and isinstance(actual, dict):
            return expected == actual
        if expected is None:
            return actual is None
        return self._matches_expected(str(expected), str(actual))

    @staticmethod
    def _split_step_answers(value: str) -> List[str]:
        if not value:
            return []
        parts = [part.strip() for part in re.split(r"(?:\r?\n|\||;|,)", value) if part.strip()]
        if len(parts) <= 1:
            numbered = re.findall(r"(?:^|\s)\d+[\).:-]\s*([^\n]+)", value)
            parts = [part.strip() for part in numbered if part.strip()] or parts
        return parts

    @staticmethod
    def _matches_expected(expected_raw: str, received_raw: str) -> bool:
        expected_text = str(expected_raw or "").strip()
        received_text = str(received_raw or "").strip()
        if not expected_text or not received_text:
            return False

        if re.fullmatch(r"-?\d+(?:\.\d+)?", expected_text):
            expected_num = float(expected_text)
            numbers = [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", received_text)]
            return any(abs(n - expected_num) < 1e-9 for n in numbers)

        qr = re.fullmatch(r"\s*(-?\d+)\s*[rR]\s*(-?\d+)\s*", expected_text)
        if qr:
            eq = int(qr.group(1))
            er = int(qr.group(2))
            patterns: List[str] = [r"(-?\d+)\s*[rR]\s*(-?\d+)", r"(-?\d+)\s*remainder\s*(-?\d+)"]
            for pat in patterns:
                m = re.search(pat, received_text, flags=re.IGNORECASE)
                if m and int(m.group(1)) == eq and int(m.group(2)) == er:
                    return True
            return False

        expected_eval = DomainToolAgent._safe_eval_math(expected_text)
        received_eval = DomainToolAgent._safe_eval_math(received_text)
        if expected_eval is not None and received_eval is not None:
            return abs(expected_eval - received_eval) < 1e-9

        expected_norm = DomainToolAgent._normalize_text(expected_text)
        received_norm = DomainToolAgent._normalize_text(received_text)
        return bool(expected_norm and expected_norm in received_norm)

    @staticmethod
    def _safe_eval_math(value: str) -> float | None:
        expr = str(value or "").strip()
        if not expr:
            return None
        normalized = expr.replace("^", "**").replace("x", "*").replace("X", "*").replace("?", "*").replace("?", "/")
        if re.search(r"[^0-9\s\+\-\*/\(\)\.\*]", normalized):
            return None
        try:
            node = ast.parse(normalized, mode="eval")
        except SyntaxError:
            return None

        def _eval(current: ast.AST) -> float:
            if isinstance(current, ast.Expression):
                return _eval(current.body)
            if isinstance(current, ast.Constant) and isinstance(current.value, (int, float)):
                return float(current.value)
            if isinstance(current, ast.UnaryOp) and isinstance(current.op, (ast.UAdd, ast.USub)):
                value = _eval(current.operand)
                return value if isinstance(current.op, ast.UAdd) else -value
            if isinstance(current, ast.BinOp) and isinstance(current.op, (ast.Add, ast.Sub, ast.Mult, ast.Div, ast.Pow)):
                left = _eval(current.left)
                right = _eval(current.right)
                if isinstance(current.op, ast.Add):
                    return left + right
                if isinstance(current.op, ast.Sub):
                    return left - right
                if isinstance(current.op, ast.Mult):
                    return left * right
                if isinstance(current.op, ast.Div):
                    return left / right
                return left ** right
            raise ValueError("Unsupported expression")

        try:
            return _eval(node)
        except Exception:
            return None

    @staticmethod
    def _normalize_text(value: str) -> str:
        lowered = value.strip().lower()
        lowered = (
            lowered.replace("\u2212", "-")
            .replace("\u2014", "-")
            .replace("\u00d7", "x")
            .replace("\u00f7", "/")
        )
        return "".join(ch for ch in lowered if ch.isalnum() or ch in "+-*/^|().")
