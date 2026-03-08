from __future__ import annotations

import os
import random
import re
import uuid
from typing import Any, Dict, List

from app.services.course_script_loader import CourseScriptLoader
from app.services.course_template_client import CourseTemplateClient


class CourseTemplateRuleEngine:
    EXERCISE_GROUPS = ("A", "B", "C", "D", "E", "F", "G", "H", "I")
    DEFAULT_EXERCISE_GROUP = "A"

    def __init__(
        self,
        course_id: str,
        title: str,
        template_course_id: str | int | None = None,
        fallback_chapter_code: str | None = None,
    ) -> None:
        self.COURSE_ID = (course_id or "").strip().lower()
        self._title = (title or self.COURSE_ID.replace("_", " ").title()).strip()
        self._template_course_id = str(template_course_id or "").strip()
        self._fallback_chapter_code = (fallback_chapter_code or "").strip().upper()
        self._rng = random.SystemRandom()
        self._script_loader = CourseScriptLoader(self.COURSE_ID)
        self._template_client = CourseTemplateClient()
        self._lessons: Dict[str, Dict[str, Any]] = {}
        self._question_pool: Dict[str, List[Dict[str, Any]]] = {}
        self.DEFAULT_CHAPTER = "INTRO"
        self._load(force=True)

    def _load(self, force: bool = False) -> None:
        if not force and self._lessons:
            return

        chapters: List[Dict[str, Any]] = []
        template = self._template_client.fetch(self._template_course_id)
        if isinstance(template, dict):
            payload = template.get("chapters")
            if isinstance(payload, list):
                chapters = [c for c in payload if isinstance(c, dict)]

        if not chapters:
            intro_code = self._fallback_chapter_code or "INTRO"
            chapters = [
                {
                    "chapterCode": intro_code,
                    "title": f"{self._title} Intro",
                    "estimatedMinutes": 20,
                    "subtopics": ["Concept warm-up", "Core idea", "Checkpoint", "Practice"],
                    "learningGoals": ["Understand chapter basics", "Practice one clear step at a time"],
                    "questionPool": [],
                    "assets": {},
                }
            ]

        lessons: Dict[str, Dict[str, Any]] = {}
        pools: Dict[str, List[Dict[str, Any]]] = {}
        for chapter in chapters:
            code = self._norm_chapter(str(chapter.get("chapterCode", "")))
            if not code:
                continue
            title = str(chapter.get("title", f"{self._title} - {code}")).strip() or f"{self._title} - {code}"
            try:
                estimated_minutes = int(chapter.get("estimatedMinutes", 20))
            except Exception:
                estimated_minutes = 20
            estimated_minutes = max(10, min(120, estimated_minutes))
            subtopics = self._list_str(chapter.get("subtopics")) or [title]
            learning_goals = self._list_str(chapter.get("learningGoals")) or [
                f"Understand core ideas in {title}.",
                "Build speed and accuracy through guided practice.",
            ]
            chapter_script = self._script_loader.chapter_script(code)
            exercise_flow = self._exercise_flow_from_payload(chapter, subtopics)
            teaching_script = self._teaching_script(code, exercise_flow, chapter_script)
            screenplay = self._screenplay_from_script_or_default(teaching_script, chapter_script)
            assets = chapter.get("assets") if isinstance(chapter.get("assets"), dict) else {}
            raw_asset_items = chapter.get("assetItems")
            asset_items = raw_asset_items if isinstance(raw_asset_items, list) else []

            source_label = f"RoboDynamics Course Template ({self._title})"
            if self._template_course_id:
                source_label = f"{source_label} [courseId={self._template_course_id}]"

            lessons[code] = {
                "lessonId": code,
                "title": title,
                "gradeBand": "NEET/Exam Prep",
                "source": str(chapter_script.get("source", source_label)),
                "dbCourseId": int(self._template_course_id) if str(self._template_course_id).isdigit() else None,
                "estimatedMinutes": estimated_minutes,
                "subtopics": subtopics,
                "learningGoals": learning_goals,
                "exerciseCoverage": list(self.EXERCISE_GROUPS),
                "exerciseFlow": exercise_flow,
                "teachingScript": teaching_script,
                "screenplay": screenplay,
                "coreIdeas": [
                    "Start with concept clarity.",
                    "Practice with active recall.",
                    "Use mistakes as feedback loops.",
                ],
                "workedExamples": [
                    {
                        "question": f"{title} - worked example 1",
                        "method": "Explain, checkpoint, practice.",
                        "answer": "Step-by-step reasoning with final answer.",
                    }
                ],
                "starterPractice": [
                    "Attempt one easy checkpoint.",
                    "Attempt one timed question.",
                    "Review one error and retry.",
                ],
                "assets": assets,
                "assetItems": self._normalize_asset_items(asset_items),
            }
            pools[code] = self._normalize_question_pool(code, chapter.get("questionPool"))

        self._lessons = lessons
        self._question_pool = pools
        self.DEFAULT_CHAPTER = self._pick_default_chapter()

    def _pick_default_chapter(self) -> str:
        if self._fallback_chapter_code and self._fallback_chapter_code in self._lessons:
            return self._fallback_chapter_code
        if self._lessons:
            return next(iter(self._lessons.keys()))
        return "INTRO"

    def chapters(self) -> List[Dict[str, Any]]:
        self._load(force=False)
        out: List[Dict[str, Any]] = []
        for code, lesson in self._lessons.items():
            out.append(
                {
                    "chapterCode": code,
                    "title": str(lesson.get("title", code)),
                    "estimatedMinutes": int(lesson.get("estimatedMinutes", 20)),
                    "subtopics": list(lesson.get("subtopics", [])),
                    "learningGoals": list(lesson.get("learningGoals", [])),
                    "exerciseGroups": list(self.EXERCISE_GROUPS),
                    "exerciseFlow": list(lesson.get("exerciseFlow", [])),
                }
            )
        return out

    def exercises(self) -> List[Dict[str, str]]:
        return [{"exerciseGroup": g, "title": f"Exercise {g}"} for g in self.EXERCISE_GROUPS]

    def normalize_chapter(self, chapter_code: str | None) -> str:
        self._load(force=False)
        code = self._norm_chapter(chapter_code)
        return code if code in self._lessons else self.DEFAULT_CHAPTER

    def normalize_exercise_group(self, exercise_group: str | None) -> str:
        g = str(exercise_group or "").strip().upper()
        return g if g in self.EXERCISE_GROUPS else self.DEFAULT_EXERCISE_GROUP

    def lesson(self, chapter_code: str | None) -> Dict[str, Any]:
        self._load(force=False)
        return self._lessons[self.normalize_chapter(chapter_code)]

    def next_question(self, chapter_code: str | None, exercise_group: str | None, grade: str | None = None) -> Dict[str, Any]:
        code = self.normalize_chapter(chapter_code)
        group = self.normalize_exercise_group(exercise_group)
        pool = self._question_pool.get(code, [])
        if pool:
            chosen = dict(self._rng.choice(pool))
        else:
            chosen = {
                "questionId": str(uuid.uuid4()),
                "skill": self._title,
                "difficulty": "medium",
                "type": "short_answer",
                "questionText": f"Exercise {group}: Explain the key idea of {self.lesson(code).get('title', code)} in one line.",
                "hint": "State concept + one example.",
                "solution": "A strong answer states the principle and a quick application example.",
                "expectedAnswer": "concept and example",
            }
        chosen["chapterCode"] = code
        chosen["exerciseGroup"] = group
        chosen["subtopic"] = self._subtopic_for_group(code, group)
        return chosen

    def evaluate(self, question: Dict[str, Any], learner_answer: str) -> Dict[str, Any]:
        expected_raw = str(question.get("expectedAnswer", "")).strip()
        received_raw = str(learner_answer or "").strip()
        expected = self._normalize(expected_raw)
        got = self._normalize(received_raw)
        correct = expected != "" and (expected == got or self._semantic_match(expected_raw, received_raw))
        return {
            "correct": correct,
            "expectedAnswer": expected_raw,
            "receivedAnswer": received_raw,
            "explanation": str(question.get("solution", "")),
            "encouragement": "Excellent. Keep building speed." if correct else "Good attempt. Try once more with one clear step.",
        }

    def doubt_reply(self, message: str, chapter_code: str | None) -> str:
        lesson = self.lesson(chapter_code)
        return (
            f"You are in {lesson.get('title', self._title)}. "
            "Ask one precise concept or one question number and I will explain step-by-step."
        )

    def _exercise_flow_from_payload(self, chapter: Dict[str, Any], subtopics: List[str]) -> List[Dict[str, str]]:
        raw = chapter.get("exerciseFlow")
        if isinstance(raw, list):
            flow: List[Dict[str, str]] = []
            seen = set()
            for item in raw:
                if not isinstance(item, dict):
                    continue
                group = self.normalize_exercise_group(item.get("exerciseGroup"))
                if group in seen:
                    continue
                seen.add(group)
                flow.append({"exerciseGroup": group, "subtopic": str(item.get("subtopic", "")).strip() or subtopics[0]})
            if len(flow) == len(self.EXERCISE_GROUPS):
                return flow
        return self._auto_exercise_flow(subtopics)

    def _auto_exercise_flow(self, subtopics: List[str]) -> List[Dict[str, str]]:
        if not subtopics:
            return [{"exerciseGroup": g, "subtopic": "Practice"} for g in self.EXERCISE_GROUPS]
        total_groups = len(self.EXERCISE_GROUPS)
        total_topics = len(subtopics)
        base = total_groups // total_topics
        extra = total_groups % total_topics
        flow: List[Dict[str, str]] = []
        cursor = 0
        for idx, topic in enumerate(subtopics):
            width = base + (1 if idx < extra else 0)
            for _ in range(width):
                if cursor >= total_groups:
                    break
                flow.append({"exerciseGroup": self.EXERCISE_GROUPS[cursor], "subtopic": topic})
                cursor += 1
        while cursor < total_groups:
            flow.append({"exerciseGroup": self.EXERCISE_GROUPS[cursor], "subtopic": subtopics[-1]})
            cursor += 1
        return flow

    def _teaching_script(
        self,
        chapter_code: str,
        exercise_flow: List[Dict[str, str]],
        chapter_script: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        scripted = chapter_script.get("teachingScript")
        if isinstance(scripted, list) and scripted:
            out: List[Dict[str, Any]] = []
            for item in scripted:
                if not isinstance(item, dict):
                    continue
                group = self.normalize_exercise_group(item.get("exerciseGroup"))
                out.append(
                    {
                        "stepId": str(item.get("stepId", f"{chapter_code}_{group}")),
                        "exerciseGroup": group,
                        "subtopic": str(item.get("subtopic", "Practice")),
                        "boardMode": str(item.get("boardMode", "svg")),
                        "teacherLine": str(item.get("teacherLine", "Let us understand this concept together.")),
                        "boardAction": str(item.get("boardAction", "Show key concept and one example.")),
                        "checkpointPrompt": str(item.get("checkpointPrompt", "Your turn: explain the next step.")),
                        "microPractice": str(item.get("microPractice", "Solve one similar question.")),
                    }
                )
            if out:
                return out

        out: List[Dict[str, Any]] = []
        for item in exercise_flow:
            group = self.normalize_exercise_group(item.get("exerciseGroup"))
            subtopic = str(item.get("subtopic", "Practice"))
            out.append(
                {
                    "stepId": f"{chapter_code}_{group}",
                    "exerciseGroup": group,
                    "subtopic": subtopic,
                    "boardMode": "svg",
                    "teacherLine": f"Exercise {group}: {subtopic}. I will explain the concept, then we solve one checkpoint.",
                    "boardAction": "Write key formula/rule and one worked example.",
                    "checkpointPrompt": "Now you explain the next step in your words.",
                    "microPractice": "Try one similar question with the same pattern.",
                }
            )
        return out

    def _screenplay_from_script_or_default(
        self,
        teaching_script: List[Dict[str, Any]],
        chapter_script: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        scripted = chapter_script.get("screenplay")
        if isinstance(scripted, list) and scripted:
            out = [s for s in scripted if isinstance(s, dict)]
            if out:
                return out

        beats: List[Dict[str, Any]] = []
        for idx, step in enumerate(teaching_script, start=1):
            beats.append(
                {
                    "beatId": f"{step['stepId']}_B{idx}",
                    "stepId": step["stepId"],
                    "exerciseGroup": step["exerciseGroup"],
                    "subtopic": step["subtopic"],
                    "sequence": idx,
                    "cue": "explain",
                    "boardMode": step["boardMode"],
                    "teacherLine": step["teacherLine"],
                    "boardAction": step["boardAction"],
                    "checkpointPrompt": step["checkpointPrompt"],
                    "pauseType": "student_response",
                    "holdSec": 0.4,
                    "expectedStudentResponse": "Student explains next step clearly.",
                    "fallbackHint": step["microPractice"],
                    "performanceTag": "core",
                    "svgAnimation": [],
                }
            )
        return beats

    def _normalize_question_pool(self, chapter_code: str, raw_pool: Any) -> List[Dict[str, Any]]:
        pool: List[Dict[str, Any]] = []
        if isinstance(raw_pool, list):
            for item in raw_pool:
                if not isinstance(item, dict):
                    continue
                expected = str(item.get("expectedAnswer", "")).strip()
                text = str(item.get("questionText", "")).strip()
                if not text:
                    continue
                pool.append(
                    {
                        "questionId": str(item.get("questionId") or uuid.uuid4()),
                        "chapterCode": chapter_code,
                        "exerciseGroup": self.normalize_exercise_group(item.get("exerciseGroup")),
                        "skill": str(item.get("skill", self._title)),
                        "difficulty": str(item.get("difficulty", "medium")).lower(),
                        "type": str(item.get("type", "multiple_choice")),
                        "questionText": text,
                        "hint": str(item.get("hint", "Use the core rule and compute step-by-step.")),
                        "solution": str(item.get("solution", "Review concept and solve with one clear step.")),
                        "expectedAnswer": expected,
                        "subtopic": str(item.get("subtopic", "")),
                        "visual": item.get("visual") if isinstance(item.get("visual"), dict) else None,
                    }
                )
        return pool

    def _normalize_asset_items(self, raw_items: Any) -> List[Dict[str, str]]:
        out: List[Dict[str, str]] = []
        if not isinstance(raw_items, list):
            return out
        for item in raw_items[:40]:
            if not isinstance(item, dict):
                continue
            asset_type = str(item.get("assetType", "asset")).strip().lower() or "asset"
            topic = str(item.get("topic", "")).strip()
            file_ref = str(item.get("file", "")).strip()
            url = str(item.get("url", "")).strip()
            if not url and not file_ref:
                continue
            out.append(
                {
                    "assetType": asset_type,
                    "topic": topic,
                    "file": file_ref,
                    "url": url or file_ref,
                }
            )
        return out

    def _subtopic_for_group(self, chapter_code: str, group: str) -> str:
        lesson = self._lessons.get(chapter_code, {})
        exercise_flow = lesson.get("exerciseFlow", [])
        normalized = self.normalize_exercise_group(group)
        for item in exercise_flow:
            if not isinstance(item, dict):
                continue
            if self.normalize_exercise_group(item.get("exerciseGroup")) == normalized:
                topic = str(item.get("subtopic", "")).strip()
                if topic:
                    return topic
        subtopics = lesson.get("subtopics", [])
        if isinstance(subtopics, list) and subtopics:
            return str(subtopics[0])
        return "Practice"

    @staticmethod
    def _list_str(raw: Any) -> List[str]:
        if not isinstance(raw, list):
            return []
        out: List[str] = []
        for item in raw:
            text = str(item or "").strip()
            if text:
                out.append(text)
        return out

    @staticmethod
    def _norm_chapter(value: str | None) -> str:
        text = str(value or "").strip().upper()
        if not text:
            return ""
        cleaned = re.sub(r"[^A-Z0-9_]+", "_", text)
        cleaned = re.sub(r"_+", "_", cleaned).strip("_")
        return cleaned

    @staticmethod
    def _normalize(value: str) -> str:
        lowered = value.strip().lower()
        lowered = (
            lowered.replace("âˆ’", "-")
            .replace("â€”", "-")
            .replace("Ã—", "x")
            .replace("Ã·", "/")
        )
        return "".join(ch for ch in lowered if ch.isalnum() or ch in "+-*/^|().")

    @staticmethod
    def _semantic_match(expected_raw: str, received_raw: str) -> bool:
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
            patterns = [r"(-?\d+)\s*[rR]\s*(-?\d+)", r"(-?\d+)\s*remainder\s*(-?\d+)"]
            for pat in patterns:
                m = re.search(pat, received_text, flags=re.IGNORECASE)
                if m and int(m.group(1)) == eq and int(m.group(2)) == er:
                    return True
            return False

        expected_norm = CourseTemplateRuleEngine._normalize(expected_text)
        received_norm = CourseTemplateRuleEngine._normalize(received_text)
        if expected_norm and expected_norm in received_norm:
            return True
        return False


def resolve_template_course_id(course_id: str, default_value: str | int | None = None) -> str:
    raw = os.getenv("AI_TUTOR_TEMPLATE_COURSE_IDS", "").strip()
    if raw:
        parts = [p.strip() for p in raw.split(",") if p.strip()]
        for part in parts:
            if ":" not in part:
                continue
            alias, cid = part.split(":", 1)
            if alias.strip().lower() == course_id.strip().lower() and cid.strip():
                return cid.strip()
    return str(default_value or "").strip()
