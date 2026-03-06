import csv
import json
import shutil
from copy import deepcopy
from pathlib import Path
from typing import Dict, List, Tuple


PLAN_TSV = Path("artifacts/prod_qbank_prod_ready_plan_2026-03-01.tsv")
GRADE5_MANIFEST = Path("artifacts/examprep_qbank_2026-03-04/svg_library/grade_5/manifest.json")
GRADE6_MANIFEST = Path("artifacts/examprep_qbank_2026-03-04/svg_library/grade_6/manifest.json")
GRADE5_SOURCE_QBANK = Path("artifacts/examprep_qbank_2026-03-04/course_34/grade5_image_set_30/grade5_image_questions_30.json")
GRADE6_SOURCE_QBANK = Path("artifacts/examprep_qbank_2026-03-04/course_35/grade6_image_set_30/grade6_image_questions_30.json")
OUT_ROOT = Path("artifacts/examprep_qbank_2026-03-04/reusable_packs")
OUT_INDEX = OUT_ROOT / "manifest_index.json"


def parse_int(value: str, default: int) -> int:
    try:
        return int(str(value).strip())
    except (TypeError, ValueError):
        return default


def clean_session_title(raw: str) -> str:
    title = (raw or "").strip()
    if not title:
        return "Session"
    if title.lower().startswith("session ") and ":" in title:
        return title.split(":", 1)[1].strip()
    if title.lower().startswith("chapter ") and ":" in title:
        return title.split(":", 1)[1].strip()
    return title


def parse_question_chapter(additional_info: str) -> str:
    marker = "Chapter: "
    if marker in additional_info:
        return additional_info.split(marker, 1)[1].strip()
    return "General"


def detect_grade(course_name: str) -> int:
    name = (course_name or "").lower()
    if "grade 6" in name:
        return 6
    return 5


def load_questions(path: Path) -> List[Dict]:
    if not path.exists():
        raise FileNotFoundError(f"Question source not found: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    questions = data.get("questions", [])
    if not isinstance(questions, list):
        raise ValueError(f"Invalid question source format: {path}")
    return questions


def load_template_lookup(manifest_path: Path) -> Dict[str, Path]:
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    assets = data.get("assets", [])
    lookup: Dict[str, Path] = {}
    for asset in assets:
        template = str(asset.get("template", "")).strip()
        rel = str(asset.get("relative_path", "")).strip()
        if template and rel:
            lookup[template] = Path(rel.replace("\\", "/"))
    return lookup


def grade5_template_for_sequence(seq: int) -> str:
    return f"set1_q{seq:02d}"


def grade6_template_map() -> Dict[int, str]:
    return {
        1: "line_ray_segment",
        2: "line_ray_segment",
        3: "polygon_types",
        4: "polygon_types",
        5: "angle_set",
        6: "angle_set",
        7: "solids_comparison",
        8: "solids_comparison",
        9: "cube_net_valid",
        10: "cube_net_valid",
        11: "compass_bisector",
        12: "compass_bisector",
        13: "axes_overview",
        14: "axes_overview",
        15: "reflection_grid",
        16: "reflection_grid",
        17: "perimeter_rectangle",
        18: "perimeter_rectangle",
        19: "area_lshape_grid",
        20: "area_lshape_grid",
        21: "unit_conversion_card",
        22: "unit_conversion_card",
        23: "bar_graph_week",
        24: "bar_graph_week",
        25: "bar_graph_week",
        26: "pictograph_students",
        27: "pictograph_students",
        28: "tally_table",
        29: "tally_table",
        30: "tally_table",
    }


def should_include_row(row: Dict) -> bool:
    if row.get("subject_bucket") != "MATH":
        return False
    course_name = row.get("course_name", "")
    if "grade 6" not in course_name.lower() and "grade 5" not in course_name.lower():
        return False
    grade = detect_grade(course_name)
    if grade == 6:
        return (row.get("image_required") or "").strip().upper() == "YES"
    # Grade 5: include all math rows for reuse packs.
    return True


def load_target_rows() -> List[Dict]:
    if not PLAN_TSV.exists():
        raise FileNotFoundError(f"Plan TSV not found: {PLAN_TSV}")
    rows: List[Dict] = []
    seen = set()
    with PLAN_TSV.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            if not should_include_row(row):
                continue
            key = (row.get("course_id", ""), row.get("course_session_id", ""))
            if key in seen:
                continue
            seen.add(key)
            rows.append(row)
    rows.sort(key=lambda r: (parse_int(r.get("course_id", ""), 0), parse_int(r.get("session_order", ""), 0)))
    return rows


def select_question_pool(grade: int, chapter: str, g5_qs: List[Dict], g6_qs: List[Dict]) -> List[Dict]:
    if grade == 6:
        pool = [q for q in g6_qs if parse_question_chapter(str(q.get("additional_info", ""))) == chapter]
        return pool or g6_qs
    pool = [q for q in g5_qs if parse_question_chapter(str(q.get("additional_info", ""))) == chapter]
    return pool or g5_qs


def select_pack_size(row: Dict, grade: int) -> int:
    target = parse_int(row.get("target_questions_with_images", ""), 0)
    if target > 0:
        return target
    return 11 if grade == 6 else 6


def copy_image_for_pack(
    grade: int,
    src_seq: int,
    course_id: int,
    session_id: int,
    q_index: int,
    template_g5: Dict[str, Path],
    template_g6: Dict[str, Path],
    image_dir: Path,
) -> str:
    if grade == 6:
        template = grade6_template_map().get(src_seq, "bar_graph_week")
        src = template_g6.get(template)
    else:
        template = grade5_template_for_sequence(src_seq)
        src = template_g5.get(template)
    if src is None:
        raise KeyError(f"Missing template source for grade={grade}, src_seq={src_seq}")
    if not src.exists():
        raise FileNotFoundError(f"SVG source not found: {src}")

    out_name = f"g{grade}_c{course_id}_s{session_id}_q{q_index:02d}.svg"
    out_path = image_dir / out_name
    shutil.copyfile(src, out_path)
    return out_name


def build_pack_for_row(
    row: Dict,
    g5_qs: List[Dict],
    g6_qs: List[Dict],
    template_g5: Dict[str, Path],
    template_g6: Dict[str, Path],
) -> Dict:
    course_id = parse_int(row.get("course_id", ""), 0)
    session_id = parse_int(row.get("course_session_id", ""), 0)
    session_title = (row.get("session_title") or "").strip()
    course_name = (row.get("course_name") or "").strip()
    grade = detect_grade(course_name)
    chapter = clean_session_title(session_title)
    pack_size = select_pack_size(row, grade)

    pool = select_question_pool(grade, chapter, g5_qs, g6_qs)
    if not pool:
        raise ValueError(f"No question pool available for grade={grade}, chapter={chapter}")

    out_dir = OUT_ROOT / f"course_{course_id}" / f"session_{session_id}"
    image_dir = out_dir / "images"
    out_dir.mkdir(parents=True, exist_ok=True)
    image_dir.mkdir(parents=True, exist_ok=True)

    out_questions: List[Dict] = []
    for i in range(pack_size):
        src = pool[i % len(pool)]
        src_seq = parse_int(str(src.get("sequence_no", i + 1)), i + 1)
        out_name = copy_image_for_pack(
            grade=grade,
            src_seq=src_seq,
            course_id=course_id,
            session_id=session_id,
            q_index=i + 1,
            template_g5=template_g5,
            template_g6=template_g6,
            image_dir=image_dir,
        )

        q = deepcopy(src)
        q["course_id"] = course_id
        q["course_session_id"] = session_id
        q["session_title"] = session_title
        q["sequence_no"] = i + 1
        q["additional_info"] = f"{course_name} | Session: {session_title} | Visual Pack"
        q["question_image"] = f"/session_materials/{course_id}/images/{out_name}"
        out_questions.append(q)

    payload = {
        "course_id": course_id,
        "course_name": course_name,
        "course_session_id": session_id,
        "session_title": session_title,
        "grade": grade,
        "generated_at": "2026-03-04",
        "questions": out_questions,
    }

    json_path = out_dir / "qbank_pack.json"
    csv_path = out_dir / "qbank_pack.csv"
    readme_path = out_dir / "README.md"
    json_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(
            [
                "sequence_no",
                "question_type",
                "difficulty_level",
                "max_marks",
                "question_text",
                "correct_answer",
                "question_image",
                "options_json",
            ]
        )
        for q in out_questions:
            writer.writerow(
                [
                    q.get("sequence_no"),
                    q.get("question_type"),
                    q.get("difficulty_level"),
                    q.get("max_marks"),
                    q.get("question_text"),
                    q.get("correct_answer"),
                    q.get("question_image"),
                    json.dumps(q.get("options", []), ensure_ascii=False),
                ]
            )

    readme_lines = [
        f"# Visual Pack - Course {course_id} Session {session_id}",
        "",
        f"- Course: `{course_name}`",
        f"- Session: `{session_title}`",
        f"- Grade: `{grade}`",
        f"- Questions: `{len(out_questions)}`",
        f"- Images: `{len(list(image_dir.glob('*.svg')))}`",
        "",
        "## Files",
        "",
        f"- `{json_path}`",
        f"- `{csv_path}`",
        f"- `{image_dir}`",
        "",
    ]
    readme_path.write_text("\n".join(readme_lines), encoding="utf-8")

    return {
        "course_id": course_id,
        "course_name": course_name,
        "course_session_id": session_id,
        "session_title": session_title,
        "grade": grade,
        "question_count": len(out_questions),
        "image_count": len(list(image_dir.glob("*.svg"))),
        "pack_json": str(json_path).replace("\\", "/"),
    }


def main() -> None:
    g5_questions = load_questions(GRADE5_SOURCE_QBANK)
    g6_questions = load_questions(GRADE6_SOURCE_QBANK)
    g5_templates = load_template_lookup(GRADE5_MANIFEST)
    g6_templates = load_template_lookup(GRADE6_MANIFEST)
    targets = load_target_rows()

    generated = []
    for row in targets:
        generated.append(
            build_pack_for_row(
                row=row,
                g5_qs=g5_questions,
                g6_qs=g6_questions,
                template_g5=g5_templates,
                template_g6=g6_templates,
            )
        )

    index = {
        "title": "Reusable SVG Course Session Packs",
        "generated_at": "2026-03-04",
        "source_plan_tsv": str(PLAN_TSV).replace("\\", "/"),
        "pack_count": len(generated),
        "packs": generated,
    }
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    OUT_INDEX.write_text(json.dumps(index, indent=2), encoding="utf-8")
    print(f"Generated {len(generated)} course-session packs at {OUT_ROOT}")


if __name__ == "__main__":
    main()

