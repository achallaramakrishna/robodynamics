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


def extract_subtopics_from_excerpt(text_excerpt: str) -> List[str]:
    topics: List[str] = []
    if not text_excerpt:
        return topics
    for raw_line in text_excerpt.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        m = re.match(r"^\d+\.\d+\s+(.+)$", line)
        if not m:
            continue
        topic = m.group(1).strip()
        topic = re.sub(r"\s+", " ", topic)
        topic = topic.lstrip("-:").strip()
        if topic and topic not in topics:
            topics.append(topic)
    return topics


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


def clamp_float(value: Any, default: float, minimum: float, maximum: float) -> float:
    try:
        parsed = float(value)
    except Exception:
        parsed = default
    if parsed < minimum:
        return minimum
    if parsed > maximum:
        return maximum
    return parsed


def normalize_svg_animation(raw: Any, subtopic: str, mode: str, checkpoint: str) -> List[Dict[str, Any]]:
    normalized: List[Dict[str, Any]] = []
    if isinstance(raw, list):
        for item in raw[:24]:
            if not isinstance(item, dict):
                continue
            kind = str(item.get("kind", "")).strip().lower()
            if kind not in {"line", "text"}:
                continue
            entry: Dict[str, Any] = {
                "kind": kind,
                "id": str(item.get("id", f"svg_{len(normalized)+1}")).strip() or f"svg_{len(normalized)+1}",
                "delaySec": clamp_float(item.get("delaySec", 0.0), 0.0, 0.0, 12.0),
                "durationSec": clamp_float(item.get("durationSec", 0.45), 0.45, 0.1, 8.0),
            }
            if kind == "line":
                entry.update(
                    {
                        "x1": clamp_float(item.get("x1", 420), 420.0, 0.0, 760.0),
                        "y1": clamp_float(item.get("y1", 96), 96.0, 0.0, 340.0),
                        "x2": clamp_float(item.get("x2", 620), 620.0, 0.0, 760.0),
                        "y2": clamp_float(item.get("y2", 96), 96.0, 0.0, 340.0),
                        "color": str(item.get("color", "#0ea5e9")).strip()[:32] or "#0ea5e9",
                        "width": clamp_float(item.get("width", 2), 2.0, 1.0, 8.0),
                    }
                )
            else:
                text = str(item.get("text", "")).strip()[:160]
                if not text:
                    continue
                entry.update(
                    {
                        "x": clamp_float(item.get("x", 430), 430.0, 0.0, 760.0),
                        "y": clamp_float(item.get("y", 82), 82.0, 0.0, 340.0),
                        "text": text,
                        "color": str(item.get("color", "#1e293b")).strip()[:32] or "#1e293b",
                        "size": clamp_float(item.get("size", 14), 14.0, 10.0, 36.0),
                    }
                )
            normalized.append(entry)

    if normalized:
        return normalized

    if mode == "svg" and "circle" in subtopic.lower():
        return [
            {"kind": "line", "id": "c1", "x1": 520, "y1": 156, "x2": 540, "y2": 202, "color": "#0ea5e9", "width": 2, "delaySec": 0.0, "durationSec": 0.5},
            {"kind": "line", "id": "c2", "x1": 540, "y1": 202, "x2": 522, "y2": 250, "color": "#0ea5e9", "width": 2, "delaySec": 0.2, "durationSec": 0.5},
            {"kind": "line", "id": "c3", "x1": 522, "y1": 250, "x2": 472, "y2": 284, "color": "#0ea5e9", "width": 2, "delaySec": 0.4, "durationSec": 0.5},
            {"kind": "line", "id": "c4", "x1": 472, "y1": 284, "x2": 380, "y2": 296, "color": "#0ea5e9", "width": 2, "delaySec": 0.6, "durationSec": 0.5},
            {"kind": "line", "id": "c5", "x1": 380, "y1": 296, "x2": 288, "y2": 284, "color": "#0ea5e9", "width": 2, "delaySec": 0.8, "durationSec": 0.5},
            {"kind": "line", "id": "c6", "x1": 288, "y1": 284, "x2": 238, "y2": 250, "color": "#0ea5e9", "width": 2, "delaySec": 1.0, "durationSec": 0.5},
            {"kind": "line", "id": "c7", "x1": 238, "y1": 250, "x2": 220, "y2": 202, "color": "#0ea5e9", "width": 2, "delaySec": 1.2, "durationSec": 0.5},
            {"kind": "line", "id": "c8", "x1": 220, "y1": 202, "x2": 240, "y2": 156, "color": "#0ea5e9", "width": 2, "delaySec": 1.4, "durationSec": 0.5},
            {"kind": "line", "id": "c9", "x1": 240, "y1": 156, "x2": 380, "y2": 128, "color": "#0ea5e9", "width": 2, "delaySec": 1.6, "durationSec": 0.5},
            {"kind": "line", "id": "c10", "x1": 380, "y1": 128, "x2": 520, "y2": 156, "color": "#0ea5e9", "width": 2, "delaySec": 1.8, "durationSec": 0.5},
            {"kind": "text", "id": "cl", "x": 430, "y": 318, "text": "10 at top, then clockwise movement", "color": "#1e293b", "size": 12, "delaySec": 2.0, "durationSec": 0.4},
        ]

    return [
        {"kind": "text", "id": "t1", "x": 430, "y": 82, "text": f"Scene: {subtopic[:52]}", "color": "#1e293b", "size": 14, "delaySec": 0.0, "durationSec": 0.4},
        {"kind": "line", "id": "l1", "x1": 420, "y1": 102, "x2": 620, "y2": 102, "color": "#6366f1", "width": 2, "delaySec": 0.2, "durationSec": 0.5},
        {"kind": "line", "id": "l2", "x1": 420, "y1": 126, "x2": 670, "y2": 126, "color": "#6366f1", "width": 2, "delaySec": 0.4, "durationSec": 0.5},
        {"kind": "line", "id": "l3", "x1": 420, "y1": 150, "x2": 600, "y2": 150, "color": "#6366f1", "width": 2, "delaySec": 0.6, "durationSec": 0.5},
        {"kind": "text", "id": "cp", "x": 430, "y": 176, "text": checkpoint[:96], "color": "#7c2d12", "size": 12, "delaySec": 0.8, "durationSec": 0.4},
    ]


def default_screenplay_beats(step: Dict[str, str], sequence_start: int) -> List[Dict[str, Any]]:
    group = step["exerciseGroup"]
    subtopic = step["subtopic"]
    checkpoint = step["checkpointPrompt"]
    mode = step["boardMode"]
    svg = normalize_svg_animation([], subtopic, mode, checkpoint)
    return [
        {
            "beatId": f"{step['stepId']}_B1",
            "stepId": step["stepId"],
            "exerciseGroup": group,
            "subtopic": subtopic,
            "sequence": sequence_start + 1,
            "cue": "intro",
            "boardMode": mode,
            "teacherLine": step["teacherLine"],
            "boardAction": step["boardAction"],
            "checkpointPrompt": checkpoint,
            "pauseType": "none",
            "holdSec": 0.35,
            "expectedStudentResponse": "",
            "fallbackHint": step["microPractice"],
            "performanceTag": "core",
            "svgAnimation": svg,
        },
        {
            "beatId": f"{step['stepId']}_B2",
            "stepId": step["stepId"],
            "exerciseGroup": group,
            "subtopic": subtopic,
            "sequence": sequence_start + 2,
            "cue": "explain",
            "boardMode": mode,
            "teacherLine": "Watch carefully. I model this pattern in two clear steps.",
            "boardAction": step["boardAction"],
            "checkpointPrompt": checkpoint,
            "pauseType": "none",
            "holdSec": 0.4,
            "expectedStudentResponse": "",
            "fallbackHint": step["microPractice"],
            "performanceTag": "core",
            "svgAnimation": svg,
        },
        {
            "beatId": f"{step['stepId']}_B3",
            "stepId": step["stepId"],
            "exerciseGroup": group,
            "subtopic": subtopic,
            "sequence": sequence_start + 3,
            "cue": "checkpoint",
            "boardMode": mode,
            "teacherLine": "Your turn now. Answer by voice or text with your first step.",
            "boardAction": "Pause and collect student explanation before moving ahead.",
            "checkpointPrompt": checkpoint,
            "pauseType": "student_response",
            "holdSec": 0.85,
            "expectedStudentResponse": "Student gives next step with short reasoning.",
            "fallbackHint": step["microPractice"],
            "performanceTag": "core",
            "svgAnimation": normalize_svg_animation([], subtopic, mode, checkpoint),
        },
    ]


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
        "subtopics": [],
        "learningGoals": [],
        "estimatedMinutes": 25,
        "coreIdeas": [],
        "workedExamples": [],
        "starterPractice": [],
        "teachingScript": [],
        "screenplay": [],
    }

    for item in raw.get("subtopics") or []:
        text = str(item).strip()
        if text:
            scripted["subtopics"].append(text)
    if not scripted["subtopics"]:
        scripted["subtopics"] = subtopics[:] if subtopics else ["Practice"]

    for item in raw.get("learningGoals") or []:
        text = str(item).strip()
        if text:
            scripted["learningGoals"].append(text)
    if not scripted["learningGoals"]:
        scripted["learningGoals"] = [
            "Understand the chapter pattern clearly.",
            "Apply the method in guided and independent practice.",
            "Explain why each step works.",
        ]

    try:
        scripted["estimatedMinutes"] = int(raw.get("estimatedMinutes", 25))
    except Exception:
        scripted["estimatedMinutes"] = 25

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

    teaching_by_group: Dict[str, Dict[str, str]] = {}
    for i, group in enumerate(EX_GROUPS):
        subtopic = subtopics[min(i, len(subtopics) - 1)] if subtopics else "Practice"
        by_group.setdefault(group, default_step(chapter_code, group, subtopic))
        teaching_by_group[group] = by_group[group]
        scripted["teachingScript"].append(by_group[group])

    raw_screenplay = raw.get("screenplay")
    grouped_beats: Dict[str, List[Dict[str, Any]]] = {g: [] for g in EX_GROUPS}
    if isinstance(raw_screenplay, list):
        for item in raw_screenplay:
            if not isinstance(item, dict):
                continue
            group = str(item.get("exerciseGroup", "")).strip().upper()
            if group not in EX_GROUPS:
                continue
            step = teaching_by_group[group]
            subtopic = str(item.get("subtopic", "")).strip() or step["subtopic"]
            mode = str(item.get("boardMode", "")).strip().lower()
            if mode not in {"svg", "free_draw"}:
                mode = step["boardMode"]
            pause_type = str(item.get("pauseType", "none")).strip().lower()
            if pause_type not in {"none", "student_response"}:
                pause_type = "none"
            cue = str(item.get("cue", "explain")).strip().lower()
            if cue not in {"intro", "explain", "demo", "guided", "practice", "check", "checkpoint"}:
                cue = "explain"
            try:
                sequence = int(item.get("sequence", len(grouped_beats[group]) + 1))
            except Exception:
                sequence = len(grouped_beats[group]) + 1
            checkpoint = str(item.get("checkpointPrompt", "")).strip() or step["checkpointPrompt"]
            grouped_beats[group].append(
                {
                    "beatId": str(item.get("beatId", f"{step['stepId']}_S{sequence}")).strip() or f"{step['stepId']}_S{sequence}",
                    "stepId": str(item.get("stepId", step["stepId"])).strip() or step["stepId"],
                    "exerciseGroup": group,
                    "subtopic": subtopic,
                    "sequence": max(1, sequence),
                    "cue": cue,
                    "boardMode": mode,
                    "teacherLine": str(item.get("teacherLine", "")).strip() or step["teacherLine"],
                    "boardAction": str(item.get("boardAction", "")).strip() or step["boardAction"],
                    "checkpointPrompt": checkpoint,
                    "pauseType": pause_type,
                    "holdSec": clamp_float(item.get("holdSec", 0.4), 0.4, 0.0, 8.0),
                    "expectedStudentResponse": str(item.get("expectedStudentResponse", "")).strip(),
                    "fallbackHint": str(item.get("fallbackHint", "")).strip() or step["microPractice"],
                    "performanceTag": str(item.get("performanceTag", "core")).strip().lower() or "core",
                    "useWhenCorrect": item.get("useWhenCorrect"),
                    "useWhenIncorrect": item.get("useWhenIncorrect"),
                    "minConfidence": str(item.get("minConfidence", "")).strip().lower() or None,
                    "maxConfidence": str(item.get("maxConfidence", "")).strip().lower() or None,
                    "svgAnimation": normalize_svg_animation(item.get("svgAnimation"), subtopic, mode, checkpoint),
                }
            )

    for idx, group in enumerate(EX_GROUPS):
        beats = sorted(grouped_beats[group], key=lambda x: int(x.get("sequence", 1)))
        if beats:
            scripted["screenplay"].extend(beats)
            continue
        step = teaching_by_group[group]
        scripted["screenplay"].extend(default_screenplay_beats(step, sequence_start=idx * 10))

    return scripted


def build_prompt(chapter_code: str, chapter_title: str, subtopics: List[str], text_excerpt: str) -> str:
    topic_list = ", ".join(subtopics) if subtopics else "Practice"
    excerpt = text_excerpt[:14000] if text_excerpt else "No chapter text available. Use chapter metadata strongly."
    return f"""
Create a classroom-style screenplay for a Grade 6 Vedic Math AI tutor.
Return STRICT JSON only with keys:
title, source, subtopics, learningGoals, estimatedMinutes, coreIdeas, workedExamples, starterPractice, teachingScript, screenplay

Schema:
- title: string
- source: string
- subtopics: string[4..10]
- learningGoals: string[3..5]
- estimatedMinutes: integer
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
- screenplay: array of 27..60 beats (3..6 beats for each group A..I)
  each beat:
  {{
    "beatId": string,
    "stepId": string,
    "exerciseGroup": "A".."I",
    "subtopic": string,
    "sequence": integer,
    "cue": "intro" | "explain" | "checkpoint",
    "boardMode": "svg" | "free_draw",
    "teacherLine": short conversational line by teacher,
    "boardAction": explicit whiteboard action,
    "checkpointPrompt": learner prompt,
    "pauseType": "none" | "student_response",
    "holdSec": number,
    "expectedStudentResponse": string,
    "fallbackHint": string,
    "performanceTag": "core" | "challenge" | "remedial",
    "useWhenCorrect": boolean|null,
    "useWhenIncorrect": boolean|null,
    "minConfidence": "low"|"medium"|"high"|null,
    "maxConfidence": "low"|"medium"|"high"|null,
    "svgAnimation": [
      {{
        "kind": "line",
        "id": string,
        "x1": number, "y1": number, "x2": number, "y2": number,
        "color": string, "width": number,
        "delaySec": number, "durationSec": number
      }},
      {{
        "kind": "text",
        "id": string,
        "x": number, "y": number,
        "text": string, "size": number, "color": string,
        "delaySec": number, "durationSec": number
      }}
    ]
  }}

Constraints:
- Sound like a human teacher talking to a 6th grader.
- Keep each teacherLine <= 22 words.
- Prefer visual, interactive explanations.
- Every checkpoint should force active response.
- Include meaningful SVG animation steps for major beats.
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
    chapter_dir = output_path.parent / "chapter"
    chapter_dir.mkdir(parents=True, exist_ok=True)

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
        extracted_subtopics = extract_subtopics_from_excerpt(excerpt)
        if len(extracted_subtopics) >= 3:
            subtopics = extracted_subtopics[:9]
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
    written = 0
    for chapter_code, payload in result.items():
        chapter_path = chapter_dir / f"{chapter_code}.json"
        chapter_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        written += 1

    print(f"[done] Wrote {output_path} with {len(result)} chapters.")
    print(f"[done] Wrote {written} chapter files under {chapter_dir}")


if __name__ == "__main__":
    main()
