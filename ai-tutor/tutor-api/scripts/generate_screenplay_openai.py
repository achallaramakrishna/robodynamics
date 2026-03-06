#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List

import httpx

CURRENT_DIR = Path(__file__).resolve().parent
TUTOR_API_DIR = CURRENT_DIR.parent
if str(TUTOR_API_DIR) not in sys.path:
    sys.path.insert(0, str(TUTOR_API_DIR))

from app.services.rule_engine import VedicRuleEngine  # noqa: E402

EX_GROUPS = list(VedicRuleEngine.EXERCISE_GROUPS)
OPENAI_URL = "https://api.openai.com/v1/chat/completions"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate AI tutor screenplay JSON from chapter PDFs using OpenAI."
    )
    parser.add_argument("--course-id", default="vedic_math", help="Course id (output folder name).")
    parser.add_argument(
        "--source-dir",
        default=None,
        help="Directory containing chapter PDFs/text (defaults to /opt/robodynamics/{courseId}).",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Output chapter_scripts.json path (defaults to /opt/robodynamics/{courseId}/chapter_scripts.json).",
    )
    parser.add_argument("--model", default=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"))
    parser.add_argument("--max-text-chars", type=int, default=14000)
    return parser.parse_args()


def clean_json(text: str) -> str:
    value = (text or "").strip()
    if value.startswith("```"):
        value = re.sub(r"^```(?:json)?\s*", "", value)
        value = re.sub(r"\s*```$", "", value)
    return value.strip()


def chapter_number(chapter_code: str) -> int:
    match = re.match(r"L(\d+)_", chapter_code)
    return int(match.group(1)) if match else 0


def candidate_score(path: Path, number: int, code: str) -> int:
    name = path.name.lower()
    score = 0
    if re.search(rf"\bchapter[\s_-]*{number}\b", name):
        score += 6
    if re.search(rf"\b{number}\b", name):
        score += 3
    if code.lower() in name:
        score += 4
    if "vedic" in name:
        score += 2
    if path.suffix.lower() == ".pdf":
        score += 2
    return score


def find_chapter_source_files(source_dir: Path, chapter_code: str) -> List[Path]:
    number = chapter_number(chapter_code)
    files = [p for p in source_dir.rglob("*") if p.is_file() and p.suffix.lower() in {".pdf", ".txt", ".md"}]
    ranked = sorted(
        files,
        key=lambda p: (candidate_score(p, number, chapter_code), -len(str(p))),
        reverse=True,
    )
    best_score = candidate_score(ranked[0], number, chapter_code) if ranked else 0
    if best_score <= 0:
        return []
    return [p for p in ranked if candidate_score(p, number, chapter_code) == best_score][:3]


def extract_text_from_pdf(pdf_path: Path, max_chars: int) -> str:
    text = ""
    try:
        from pypdf import PdfReader  # type: ignore

        reader = PdfReader(str(pdf_path))
        for page in reader.pages[:40]:
            text += f"\n{page.extract_text() or ''}"
            if len(text) >= max_chars:
                break
        return text[:max_chars]
    except Exception:
        pass

    try:
        result = subprocess.run(
            ["pdftotext", "-layout", str(pdf_path), "-"],
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout[:max_chars]
    except Exception:
        pass

    return ""


def read_source_excerpt(paths: List[Path], max_chars: int) -> str:
    if not paths:
        return ""
    parts: List[str] = []
    remaining = max_chars
    for p in paths:
        if remaining <= 0:
            break
        if p.suffix.lower() == ".pdf":
            chunk = extract_text_from_pdf(p, remaining)
        else:
            try:
                chunk = p.read_text(encoding="utf-8", errors="ignore")[:remaining]
            except Exception:
                chunk = ""
        if chunk.strip():
            parts.append(f"\n--- SOURCE: {p.name} ---\n{chunk.strip()}\n")
            remaining = max(0, remaining - len(chunk))
    return "\n".join(parts).strip()[:max_chars]


def board_mode(subtopic: str) -> str:
    s = subtopic.lower()
    if any(k in s for k in ["circle", "identity", "square", "diagram", "vinculum"]):
        return "svg"
    return "free_draw"


def default_step(chapter_code: str, group: str, subtopic: str) -> Dict[str, str]:
    return {
        "stepId": f"{chapter_code}_{group}",
        "exerciseGroup": group,
        "subtopic": subtopic,
        "boardMode": board_mode(subtopic),
        "teacherLine": f"Let us understand {subtopic} with one clear example.",
        "boardAction": "Write the rule, draw the visual path, and solve one worked example.",
        "checkpointPrompt": f"Can you explain the first step for {subtopic}?",
        "microPractice": f"Solve one quick {subtopic} problem from Exercise {group}.",
    }


def normalize_screenplay(
    raw: Dict[str, Any],
    chapter_code: str,
    chapter_title: str,
    subtopics: List[str],
    source_name: str,
) -> Dict[str, Any]:
    scripted = {
        "title": str(raw.get("title") or chapter_title),
        "source": str(raw.get("source") or source_name),
        "coreIdeas": [],
        "workedExamples": [],
        "starterPractice": [],
        "teachingScript": [],
    }

    for item in raw.get("coreIdeas") or []:
        text = str(item).strip()
        if text:
            scripted["coreIdeas"].append(text)
    if not scripted["coreIdeas"]:
        scripted["coreIdeas"] = [
            "Explain with a visual first, then symbolic form.",
            "Ask checkpoint questions after each board scene.",
            "Move from guided to independent problem-solving.",
        ]

    for item in raw.get("workedExamples") or []:
        if not isinstance(item, dict):
            continue
        question = str(item.get("question", "")).strip()
        method = str(item.get("method", "")).strip()
        answer = str(item.get("answer", "")).strip()
        if question and method and answer:
            scripted["workedExamples"].append({"question": question, "method": method, "answer": answer})
    if not scripted["workedExamples"]:
        scripted["workedExamples"] = [
            {"question": "Guided Example 1", "method": "I do - we do - you do", "answer": "Solved on board"},
            {"question": "Guided Example 2", "method": "Pattern plus check", "answer": "Solved on board"},
        ]

    for item in raw.get("starterPractice") or []:
        text = str(item).strip()
        if text:
            scripted["starterPractice"].append(text)
    if not scripted["starterPractice"]:
        scripted["starterPractice"] = ["Exercise A warm-up", "Exercise B guided", "Exercise C independent"]

    by_group: Dict[str, Dict[str, str]] = {}
    for item in raw.get("teachingScript") or []:
        if not isinstance(item, dict):
            continue
        group = str(item.get("exerciseGroup", "")).strip().upper()
        if group not in EX_GROUPS:
            continue
        subtopic = str(item.get("subtopic", "")).strip() or subtopics[min(EX_GROUPS.index(group), len(subtopics) - 1)]
        mode = str(item.get("boardMode", "")).strip().lower()
        if mode not in {"svg", "free_draw"}:
            mode = board_mode(subtopic)
        by_group[group] = {
            "stepId": str(item.get("stepId", f"{chapter_code}_{group}")).strip() or f"{chapter_code}_{group}",
            "exerciseGroup": group,
            "subtopic": subtopic,
            "boardMode": mode,
            "teacherLine": str(item.get("teacherLine", "")).strip() or default_step(chapter_code, group, subtopic)["teacherLine"],
            "boardAction": str(item.get("boardAction", "")).strip() or default_step(chapter_code, group, subtopic)["boardAction"],
            "checkpointPrompt": str(item.get("checkpointPrompt", "")).strip() or default_step(chapter_code, group, subtopic)["checkpointPrompt"],
            "microPractice": str(item.get("microPractice", "")).strip() or default_step(chapter_code, group, subtopic)["microPractice"],
        }

    for i, group in enumerate(EX_GROUPS):
        subtopic = subtopics[min(i, len(subtopics) - 1)] if subtopics else "Practice"
        by_group.setdefault(group, default_step(chapter_code, group, subtopic))
        scripted["teachingScript"].append(by_group[group])

    return scripted


def build_prompt(chapter_code: str, chapter_title: str, subtopics: List[str], text_excerpt: str) -> str:
    topic_list = ", ".join(subtopics) if subtopics else "Practice"
    excerpt = text_excerpt[:14000] if text_excerpt else "No chapter text available. Use chapter metadata strongly."
    return f"""
Create a classroom-style screenplay for a Grade 6 Vedic Math AI tutor.
Return STRICT JSON only with keys:
title, source, coreIdeas, workedExamples, starterPractice, teachingScript

Schema:
- title: string
- source: string
- coreIdeas: string[3..6]
- workedExamples: array of 2..4 objects {{question, method, answer}}
- starterPractice: string[3..8]
- teachingScript: EXACTLY 9 objects, one for each exercise group A..I
  each object:
  {{
    "stepId": string,
    "exerciseGroup": "A".."I",
    "subtopic": string,
    "boardMode": "svg" | "free_draw",
    "teacherLine": short conversational line by teacher,
    "boardAction": explicit whiteboard action,
    "checkpointPrompt": question to ask learner,
    "microPractice": one quick practice task
  }}

Constraints:
- Sound like a human teacher talking to a 6th grader.
- Keep each teacherLine <= 22 words.
- Prefer visual, interactive explanations.
- Use subtopics: {topic_list}
- Scene progression should go from easy to hard across A..I.

Chapter code: {chapter_code}
Chapter title: {chapter_title}
Source text excerpt:
{excerpt}
""".strip()


def call_openai_json(api_key: str, model: str, prompt: str) -> Dict[str, Any]:
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": (
                    "You generate deterministic teaching screenplay JSON for math tutoring. "
                    "Output valid JSON only."
                ),
            },
            {"role": "user", "content": prompt},
        ],
    }
    with httpx.Client(timeout=90.0) as client:
        response = client.post(OPENAI_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
    text = data["choices"][0]["message"]["content"]
    return json.loads(clean_json(text))


def main() -> None:
    args = parse_args()
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is missing.")

    source_dir = Path(args.source_dir or f"/opt/robodynamics/{args.course_id}").resolve()
    output_path = Path(args.output or f"/opt/robodynamics/{args.course_id}/chapter_scripts.json").resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    engine = VedicRuleEngine()
    catalog = engine.CHAPTER_CATALOG
    result: Dict[str, Any] = {}

    print(f"[info] source_dir={source_dir}")
    print(f"[info] output={output_path}")
    for chapter_code, chapter in catalog.items():
        title = str(chapter.get("title", chapter_code))
        subtopics = [str(x) for x in chapter.get("subtopics", [])]
        files = find_chapter_source_files(source_dir, chapter_code)
        excerpt = read_source_excerpt(files, args.max_text_chars)
        source_name = ", ".join([f.name for f in files]) if files else f"{args.course_id} chapter material"
        print(f"[chapter] {chapter_code} files={len(files)}")
        prompt = build_prompt(chapter_code, title, subtopics, excerpt)
        try:
            raw = call_openai_json(api_key=api_key, model=args.model, prompt=prompt)
            result[chapter_code] = normalize_screenplay(raw, chapter_code, title, subtopics, source_name)
        except Exception as exc:
            print(f"[warn] OpenAI generation failed for {chapter_code}: {exc}")
            fallback = normalize_screenplay({}, chapter_code, title, subtopics, source_name)
            result[chapter_code] = fallback

    output_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[done] Wrote {output_path} with {len(result)} chapters.")


if __name__ == "__main__":
    main()

