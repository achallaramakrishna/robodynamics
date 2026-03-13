#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path

import httpx


PROJECT_ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = PROJECT_ROOT.parent


def load_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def load_properties_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def first_non_empty(*values: str | None) -> str:
    for value in values:
        if value and str(value).strip():
            return str(value).strip()
    return ""


def bootstrap_env() -> None:
    dot_env = load_env_file(REPO_ROOT / "ai-tutor" / "tutor-api" / ".env")
    properties: dict[str, str] = {}
    for candidate in [
        REPO_ROOT / "src" / "main" / "resources" / "app-config.properties",
        REPO_ROOT / "src" / "main" / "webapp" / "WEB-INF" / "classes" / "app-config.properties",
        REPO_ROOT / ".tomcat-base" / "webapps" / "robodynamics" / "WEB-INF" / "classes" / "app-config.properties",
    ]:
        properties.update(load_properties_file(candidate))

    assignments = {
        "OPENAI_API_KEY": first_non_empty(
            os.getenv("OPENAI_API_KEY"),
            dot_env.get("OPENAI_API_KEY"),
            properties.get("openai.api.key"),
        ),
        "ANTHROPIC_API_KEY": first_non_empty(
            os.getenv("ANTHROPIC_API_KEY"),
            dot_env.get("ANTHROPIC_API_KEY"),
            properties.get("anthropic.api.key"),
        ),
        "AI_TUTOR_REVIEW_OPENAI_MODEL": first_non_empty(
            os.getenv("AI_TUTOR_REVIEW_OPENAI_MODEL"),
            dot_env.get("AI_TUTOR_REVIEW_OPENAI_MODEL"),
            dot_env.get("OPENAI_MODEL"),
            properties.get("openai.chat.model"),
        ),
        "AI_TUTOR_REVIEW_ANTHROPIC_MODEL": first_non_empty(
            os.getenv("AI_TUTOR_REVIEW_ANTHROPIC_MODEL"),
            dot_env.get("AI_TUTOR_REVIEW_ANTHROPIC_MODEL"),
            dot_env.get("AI_TUTOR_CHAT_MODEL"),
            properties.get("anthropic.chat.model"),
        ),
    }
    for key, value in assignments.items():
        if value and not os.getenv(key):
            os.environ[key] = value


def read_json(path: str) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def parse_json_block(text: str) -> dict:
    decoder = json.JSONDecoder()
    stripped = text.strip()

    for candidate in re.findall(r"```(?:json)?\s*([\s\S]*?)```", stripped, flags=re.IGNORECASE):
        candidate = candidate.strip()
        if not candidate:
            continue
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    for candidate in [stripped]:
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    for index, char in enumerate(stripped):
        if char != "{":
            continue
        try:
            parsed, _ = decoder.raw_decode(stripped[index:])
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            continue

    match = re.search(r"\{[\s\S]*\}", stripped)
    if match:
        return json.loads(match.group(0))
    raise ValueError("No valid JSON object found in model response")


def choose_provider(preferred: str) -> str | None:
    preferred = (preferred or "auto").strip().lower()
    if preferred == "anthropic" and os.getenv("ANTHROPIC_API_KEY"):
        return "anthropic"
    if preferred == "openai" and os.getenv("OPENAI_API_KEY"):
        return "openai"
    if preferred == "auto":
        if os.getenv("ANTHROPIC_API_KEY"):
            return "anthropic"
        if os.getenv("OPENAI_API_KEY"):
            return "openai"
    return None


def provider_chain(preferred: str) -> list[str]:
    provider = choose_provider(preferred)
    if not provider:
        return []
    providers = [provider]
    if (preferred or "auto").strip().lower() == "auto":
        if provider != "anthropic" and os.getenv("ANTHROPIC_API_KEY"):
            providers.append("anthropic")
        if provider != "openai" and os.getenv("OPENAI_API_KEY"):
            providers.append("openai")
    return providers


def call_anthropic(prompt: str) -> dict:
    model = os.getenv("AI_TUTOR_REVIEW_ANTHROPIC_MODEL", "claude-3-5-sonnet-latest")
    response = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": model,
            "max_tokens": 1400,
            "temperature": 0.2,
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=90.0,
    )
    response.raise_for_status()
    data = response.json()
    text = data["content"][0]["text"]
    return parse_json_block(text)


def call_openai(prompt: str) -> dict:
    model = os.getenv("AI_TUTOR_REVIEW_OPENAI_MODEL", "gpt-4.1-mini")
    response = httpx.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "temperature": 0.2,
            "messages": [
                {
                    "role": "system",
                    "content": "Return only valid JSON. Do not wrap in markdown."
                },
                {"role": "user", "content": prompt},
            ],
        },
        timeout=90.0,
    )
    response.raise_for_status()
    data = response.json()
    text = data["choices"][0]["message"]["content"]
    return parse_json_block(text)


def build_pedagogy_prompt(lesson: dict, validation: dict) -> str:
    sequence = lesson.get("lessonSequence", [])[:7]
    questions = lesson.get("questionPool", [])[:10]
    worked = lesson.get("workedExamples", [])[:4]
    return f"""
You are an expert K-12 mathematics pedagogy reviewer for Indian learners.
Review this AI tutor lesson and return strict JSON only.

Context:
- courseId: {lesson.get("courseId")}
- chapterCode: {lesson.get("chapterCode")}
- title: {lesson.get("title")}
- deterministicStatus: {validation.get("status")}
- deterministicScore: {validation.get("overallScore")}

Lesson sequence:
{json.dumps(sequence, ensure_ascii=False, indent=2)}

Worked examples:
{json.dumps(worked, ensure_ascii=False, indent=2)}

Question sample:
{json.dumps(questions, ensure_ascii=False, indent=2)}

Return JSON with keys:
teaching_clarity, difficulty_progression, example_quality, engagement, bloom_coverage,
overall_comments, top_issues, suggested_fixes, approval_recommendation

Scores must be numeric from 0 to 10.
top_issues and suggested_fixes must be arrays of strings.
approval_recommendation must be one of: approve, approve_with_minor_edits, needs_major_edits.
""".strip()


def build_uiux_prompt(lesson: dict, validation: dict) -> str:
    return f"""
You are a learner experience reviewer for an AI tutoring interface.
Review this lesson artifact and return strict JSON only.

Context:
- title: {lesson.get("title")}
- deterministicStatus: {validation.get("status")}
- deterministicScore: {validation.get("overallScore")}

Lesson sequence:
{json.dumps(lesson.get("lessonSequence", [])[:7], ensure_ascii=False, indent=2)}

Practice checkpoints:
{json.dumps(lesson.get("practiceCheckpoints", [])[:5], ensure_ascii=False, indent=2)}

Board plan:
{json.dumps(lesson.get("boardPlan", [])[:6], ensure_ascii=False, indent=2)}

Question sample:
{json.dumps(lesson.get("questionPool", [])[:8], ensure_ascii=False, indent=2)}

Return JSON with keys:
friction_points, accessibility_issues, engagement_risks, suggested_fixes, overall_risk

All list fields must be arrays of strings.
overall_risk must be one of: low, medium, high.
""".strip()


def main() -> None:
    bootstrap_env()
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-type", choices=["pedagogy", "uiux"], required=True)
    parser.add_argument("--lesson-path", required=True)
    parser.add_argument("--validation-path", required=True)
    parser.add_argument("--provider", default="auto")
    args = parser.parse_args()

    providers = provider_chain(args.provider)
    if not providers:
      print(json.dumps({"ok": False, "skipped": True, "reason": "No ANTHROPIC_API_KEY or OPENAI_API_KEY configured."}))
      return

    lesson = read_json(args.lesson_path)
    validation = read_json(args.validation_path)
    prompt = build_pedagogy_prompt(lesson, validation) if args.review_type == "pedagogy" else build_uiux_prompt(lesson, validation)
    errors: list[str] = []
    for provider in providers:
        try:
            payload = call_anthropic(prompt) if provider == "anthropic" else call_openai(prompt)
            print(json.dumps({"ok": True, "skipped": False, "provider": provider, "payload": payload}))
            return
        except Exception as exc:
            errors.append(f"{provider}: {exc}")
    print(json.dumps({"ok": False, "skipped": True, "reason": " | ".join(errors)}))


if __name__ == "__main__":
    main()
