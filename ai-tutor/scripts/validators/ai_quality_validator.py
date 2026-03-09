"""
validators/ai_quality_validator.py — Layer 4: AI-powered pedagogical quality review.

Uses Claude to evaluate 5 quality dimensions:
  1. teaching_clarity    — teacherLines clear and age-appropriate
  2. difficulty_progression — questions scaffold properly
  3. example_quality     — worked examples demonstrate concept well
  4. engagement          — content motivating for Indian students
  5. bloom_coverage      — Remember + Understand + Apply covered

Requires ANTHROPIC_API_KEY in environment.
"""

from __future__ import annotations
import os
import json
import re
import httpx
from typing import Any


class AIQualityValidator:
    def __init__(self, standard: dict) -> None:
        self._s = standard["layer_4_ai_quality"]
        self._api_key = os.getenv("ANTHROPIC_API_KEY", "")
        self._model = self._s.get("_model", "claude-sonnet-4-6")
        self._pass_threshold = self._s["scoring"]["pass_threshold"]

    def validate(self, chapter: dict, chapter_code: str) -> dict:
        """
        Returns:
          {
            pass: bool,
            score: float (0-10),
            issues: [...],
            dimensions: {teaching_clarity, difficulty_progression, ...},
            comments: str,
            top_issues: [...],
            suggested_fixes: [...],
            skipped: bool  (True if no API key or API error)
          }
        """
        if not self._api_key:
            return {
                "pass": None,
                "score": None,
                "skipped": True,
                "skip_reason": "ANTHROPIC_API_KEY not set — run with --ai flag to enable",
                "dimensions": {},
                "issues": [],
                "comments": "",
                "top_issues": [],
                "suggested_fixes": [],
            }

        # Build the prompt
        prompt = self._build_prompt(chapter)

        try:
            response_text = self._call_claude(prompt)
            scores = self._parse_response(response_text)
        except Exception as e:
            return {
                "pass": None,
                "score": None,
                "skipped": True,
                "skip_reason": f"Claude API error: {e}",
                "dimensions": {},
                "issues": [],
                "comments": "",
                "top_issues": [],
                "suggested_fixes": [],
            }

        # Compute weighted overall score (all 5 dimensions equal weight)
        dims = self._s["dimensions"]
        dim_scores = {
            dim: scores.get(dim, 5.0)
            for dim in dims
        }
        weights = [d["weight"] for d in dims.values()]
        total_weight = sum(weights)
        weighted_sum = sum(
            dim_scores[dim] * dims[dim]["weight"]
            for dim in dims
        )
        overall = weighted_sum / total_weight

        issues: list[dict] = []
        for dim, cfg in dims.items():
            s = dim_scores.get(dim, 5.0)
            if s < cfg["min_acceptable"]:
                issues.append(self._issue(
                    "error", f"LOW_{dim.upper()}",
                    f"AI quality dimension '{dim}' scored {s:.1f}/10 (min acceptable: {cfg['min_acceptable']})",
                    suggested_fix=f"Review and improve: {cfg['description']}",
                ))
            elif s < cfg["target_score"]:
                issues.append(self._issue(
                    "warning", f"BELOW_TARGET_{dim.upper()}",
                    f"AI quality dimension '{dim}' scored {s:.1f}/10 (target: {cfg['target_score']})",
                    suggested_fix=f"Consider improving: {cfg['description']}",
                ))

        # Append AI-generated top issues as info items
        for item in scores.get("top_issues", []):
            issues.append(self._issue("info", "AI_IDENTIFIED_ISSUE", item))

        passed = overall >= self._pass_threshold

        return {
            "pass": passed,
            "score": round(overall, 2),
            "skipped": False,
            "dimensions": dim_scores,
            "issues": issues,
            "comments": scores.get("overall_comments", ""),
            "top_issues": scores.get("top_issues", []),
            "suggested_fixes": scores.get("suggested_fixes", []),
        }

    def _build_prompt(self, chapter: dict) -> str:
        title = chapter.get("title", "Unknown")
        template = self._s["prompt_template"]

        # Collect sample teacherLines (first 6 screenplay beats)
        screenplay = chapter.get("screenplay", [])
        teacher_lines = "\n".join(
            f"  - [{b.get('cue','?')}] {b.get('teacherLine','')[:120]}"
            for b in screenplay[:6]
            if isinstance(b, dict) and b.get("teacherLine")
        )
        if not teacher_lines:
            script = chapter.get("teachingScript", [])
            teacher_lines = "\n".join(
                f"  - {s.get('teacherLine', '')[:120]}"
                for s in script[:6]
                if isinstance(s, dict)
            )

        # Sample questions (first 8, one from each difficulty)
        qp = chapter.get("questionPool", [])
        by_diff: dict[str, list] = {}
        for q in qp:
            if isinstance(q, dict):
                d = q.get("difficulty", "easy")
                by_diff.setdefault(d, []).append(q)
        sample_qs = []
        for diff in ["easy", "medium", "hard"]:
            for q in by_diff.get(diff, [])[:3]:
                sample_qs.append(
                    f"  [{diff}] {q.get('questionText','')[:100]}"
                    f" → answer: {q.get('expectedAnswer','?')}"
                )
        sample_questions_text = "\n".join(sample_qs[:8]) or "  (No questions available)"

        # Worked examples
        we = chapter.get("workedExamples", [])
        we_text = "\n".join(
            f"  Q: {w.get('question','')} | Method: {w.get('method','')[:100]} | A: {w.get('answer','')}"
            for w in we[:4]
            if isinstance(w, dict)
        ) or "  (No worked examples)"

        return template.format(
            title=title,
            teacher_lines=teacher_lines or "  (No teacherLines found)",
            sample_questions=sample_questions_text,
            worked_examples=we_text,
        )

    def _call_claude(self, prompt: str) -> str:
        payload = {
            "model": self._model,
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": prompt}],
        }
        response = httpx.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": self._api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json=payload,
            timeout=60.0,
        )
        response.raise_for_status()
        data = response.json()
        return data["content"][0]["text"]

    def _parse_response(self, text: str) -> dict:
        """Extract JSON from Claude's response."""
        # Try to find JSON block
        m = re.search(r"\{[\s\S]*\}", text)
        if m:
            try:
                return json.loads(m.group())
            except json.JSONDecodeError:
                pass
        # Fallback: try direct parse
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError:
            pass
        # Last resort: extract numbers
        dims = list(self._s["dimensions"].keys())
        scores: dict[str, Any] = {}
        for dim in dims:
            m2 = re.search(rf'"{dim}"\s*:\s*(\d+(?:\.\d+)?)', text)
            if m2:
                scores[dim] = float(m2.group(1))
            else:
                scores[dim] = 5.0  # default if parse fails
        scores["overall_comments"] = "AI response parse error — see raw output"
        scores["top_issues"] = []
        scores["suggested_fixes"] = []
        return scores

    @staticmethod
    def _issue(severity, rule_id, message, suggested_fix=None):
        return {
            "layer": "ai_quality",
            "severity": severity,
            "rule_id": rule_id,
            "message": message,
            "field_path": None,
            "actual_value": None,
            "expected_value": None,
            "suggested_fix": suggested_fix,
        }
