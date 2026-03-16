from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict


class CourseScriptLoader:
    def __init__(self, course_id: str) -> None:
        root = os.getenv("AI_TUTOR_CONTENT_ROOT", "/opt/robodynamics")
        base = Path(root)
        local_api_root = Path(__file__).resolve().parents[2]
        repo_root = local_api_root.parents[1]

        # Root precedence:
        # 1) externally mounted course content
        # 2) bundled tutor-api content-template (release-safe fallback)
        # 3) grade-based sub-folder inside a parent course content dir
        #    e.g. aptitude_reasoning_g6 → content-template/aptitude_reasoning/grade_6/
        # 4) docs fallback for legacy setups
        raw_roots = [
            base / course_id,
            local_api_root / "content-template" / course_id,
        ]
        # Grade-based sub-folder resolution: "aptitude_reasoning_g6" →
        # content-template/aptitude_reasoning/grade_6/
        # Supports both _g6 suffix and _grade6 suffix patterns.
        import re as _re
        _grade_match = _re.match(r"^(.+?)_g(?:rade)?(\d+)$", course_id, _re.IGNORECASE)
        if _grade_match:
            _parent_course = _grade_match.group(1)
            _grade_num = _grade_match.group(2)
            raw_roots += [
                base / _parent_course / f"grade_{_grade_num}",
                local_api_root / "content-template" / _parent_course / f"grade_{_grade_num}",
            ]
        # Campus-tier resolution: "aptitude_campus_pro" →
        # content-template/aptitude_reasoning/campus_pro/
        _campus_match = _re.match(r"^(.+?)_(campus_\w+)$", course_id, _re.IGNORECASE)
        if _campus_match:
            _parent_course = _campus_match.group(1) + "_reasoning"
            _tier = _campus_match.group(2).lower()
            raw_roots += [
                local_api_root / "content-template" / _parent_course / _tier,
            ]
        raw_roots += [
            base / "docs" / course_id,
            repo_root / "docs" / course_id,
        ]
        deduped: list[Path] = []
        seen: set[str] = set()
        for path in raw_roots:
            norm = str(path.resolve()) if path.exists() else str(path)
            if norm in seen:
                continue
            seen.add(norm)
            deduped.append(path)
        self._course_roots = deduped
        self._index = self._load_index()

    def chapter_script(self, chapter_code: str) -> Dict[str, Any]:
        chapter_code = (chapter_code or "").strip().upper()
        if not chapter_code:
            return {}

        # Prefer per-chapter JSON files over index entries so targeted lesson
        # updates can go live without regenerating chapter_scripts.json.
        for root in self._course_roots:
            candidate_files = [
                root / "chapters" / f"{chapter_code}.json",
                root / "chapters" / f"{chapter_code.lower()}.json",
                root / "chapter" / f"{chapter_code}.json",
                root / "chapter" / f"{chapter_code.lower()}.json",
                root / f"{chapter_code}.json",
                root / f"{chapter_code.lower()}.json",
            ]
            for file_path in candidate_files:
                payload = self._read_json(file_path)
                if isinstance(payload, dict):
                    return payload

        indexed = self._index.get(chapter_code)
        if isinstance(indexed, dict) and self._looks_like_full_chapter_script(indexed):
            return indexed
        if isinstance(indexed, dict):
            return indexed
        return {}

    def _load_index(self) -> Dict[str, Any]:
        for root in self._course_roots:
            index_files = [
                root / "chapter_scripts.json",
                root / "lessons.json",
                root / "chapters.json",
                root / "chapter" / "chapter_scripts.json",
                root / "chapter" / "lessons.json",
                root / "chapter" / "chapters.json",
            ]
            for file_path in index_files:
                payload = self._read_json(file_path)
                if not payload:
                    continue

                if isinstance(payload, dict) and isinstance(payload.get("chapters"), list):
                    chapter_map: Dict[str, Any] = {}
                    for item in payload["chapters"]:
                        if isinstance(item, dict):
                            code = str(item.get("chapterCode", "")).strip().upper()
                            if code:
                                chapter_map[code] = item
                    return chapter_map

                if isinstance(payload, dict):
                    chapter_map = {}
                    for code, item in payload.items():
                        normalized = str(code).strip().upper()
                        if normalized and isinstance(item, dict):
                            chapter_map[normalized] = item
                    if chapter_map:
                        return chapter_map

        return {}

    @staticmethod
    def _read_json(path: Path) -> Dict[str, Any] | list[Any] | None:
        if not path.exists() or not path.is_file():
            return None
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return None

    @staticmethod
    def _looks_like_full_chapter_script(payload: Dict[str, Any]) -> bool:
        keys = set(payload.keys())
        return bool(
            {"teachingScript", "screenplay", "coreIdeas", "workedExamples", "starterPractice"} & keys
        )
