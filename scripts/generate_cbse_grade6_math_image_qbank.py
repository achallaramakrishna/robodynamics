import csv
import json
from collections import Counter
from pathlib import Path
from typing import Dict, List

from svg_library_utils import (
    build_chapter_template_lookup,
    copy_asset_to_question_image,
    load_manifest_assets,
    resolve_manifest_path,
)


COURSE_ID = 35
COURSE_SESSION_ID = 1103
SESSION_TITLE = "Grade 6 Visual Math Practice - Set 1"
LIB_MANIFEST_CANDIDATES = [
    Path("artifacts/examprep_qbank_2026-03-04/svg_library/grade_6/manifest.json"),
    Path("artifacts/examprep_qbank_2026-03-04/grade6_svg_library/grade6_math_svg_manifest.json"),
]
OUT_DIR = Path("artifacts/examprep_qbank_2026-03-04/course_35/grade6_image_set_30")
IMAGE_DIR = OUT_DIR / "images"
JSON_PATH = OUT_DIR / "grade6_image_questions_30.json"
CSV_PATH = OUT_DIR / "grade6_image_questions_30.csv"
README_PATH = OUT_DIR / "README.md"
IMAGE_URL_PREFIX = f"/session_materials/{COURSE_ID}/images"


def load_library() -> Dict[str, Path]:
    manifest_path = resolve_manifest_path(LIB_MANIFEST_CANDIDATES)
    _, assets = load_manifest_assets(manifest_path)
    return build_chapter_template_lookup(assets)


def make_mcq(
    qid: int,
    chapter: str,
    text: str,
    options: List[str],
    correct_idx: int,
    difficulty: str,
    marks: int,
    template: str,
    lib_lookup: Dict[str, Path],
) -> Dict:
    return {
        "course_id": COURSE_ID,
        "course_session_id": COURSE_SESSION_ID,
        "session_title": SESSION_TITLE,
        "sequence_no": qid,
        "question_text": text,
        "question_type": "multiple_choice",
        "difficulty_level": difficulty,
        "max_marks": marks,
        "correct_answer": options[correct_idx],
        "explanation": "Answer is based on the diagram.",
        "additional_info": f"CBSE Grade 6 Mathematics Image Set 1 | Chapter: {chapter}",
        "question_image": copy_asset_to_question_image(
            qid=qid,
            chapter=chapter,
            template=template,
            lookup=lib_lookup,
            image_dir=IMAGE_DIR,
            file_prefix="g6_math_img_q",
            image_url_prefix=IMAGE_URL_PREFIX,
        ),
        "options": [{"option_text": opt, "is_correct": i == correct_idx, "option_image": ""} for i, opt in enumerate(options)],
    }


def make_short(
    qid: int,
    chapter: str,
    text: str,
    answer: str,
    difficulty: str,
    marks: int,
    template: str,
    lib_lookup: Dict[str, Path],
) -> Dict:
    return {
        "course_id": COURSE_ID,
        "course_session_id": COURSE_SESSION_ID,
        "session_title": SESSION_TITLE,
        "sequence_no": qid,
        "question_text": text,
        "question_type": "short_answer",
        "difficulty_level": difficulty,
        "max_marks": marks,
        "correct_answer": answer,
        "explanation": "Use values shown in the visual.",
        "additional_info": f"CBSE Grade 6 Mathematics Image Set 1 | Chapter: {chapter}",
        "question_image": copy_asset_to_question_image(
            qid=qid,
            chapter=chapter,
            template=template,
            lookup=lib_lookup,
            image_dir=IMAGE_DIR,
            file_prefix="g6_math_img_q",
            image_url_prefix=IMAGE_URL_PREFIX,
        ),
        "options": [],
    }


def make_fill(
    qid: int,
    chapter: str,
    text: str,
    answer: str,
    difficulty: str,
    marks: int,
    template: str,
    lib_lookup: Dict[str, Path],
) -> Dict:
    return {
        "course_id": COURSE_ID,
        "course_session_id": COURSE_SESSION_ID,
        "session_title": SESSION_TITLE,
        "sequence_no": qid,
        "question_text": text,
        "question_type": "fill_in_blank",
        "difficulty_level": difficulty,
        "max_marks": marks,
        "correct_answer": answer,
        "explanation": "Fill the blank by reading the image carefully.",
        "additional_info": f"CBSE Grade 6 Mathematics Image Set 1 | Chapter: {chapter}",
        "question_image": copy_asset_to_question_image(
            qid=qid,
            chapter=chapter,
            template=template,
            lookup=lib_lookup,
            image_dir=IMAGE_DIR,
            file_prefix="g6_math_img_q",
            image_url_prefix=IMAGE_URL_PREFIX,
        ),
        "options": [],
    }


def build_questions(lib_lookup: Dict[str, Path]) -> List[Dict]:
    q: List[Dict] = []

    q.append(make_mcq(1, "Basic Geometrical Ideas", "Which figure has one endpoint and extends in one direction?", ["Line", "Ray", "Line Segment", "Circle"], 1, "Easy", 1, "line_ray_segment", lib_lookup))
    q.append(make_mcq(2, "Basic Geometrical Ideas", "Which figure has two endpoints?", ["Line", "Ray", "Line Segment", "Angle"], 2, "Easy", 1, "line_ray_segment", lib_lookup))
    q.append(make_mcq(3, "Understanding Elementary Shapes", "How many sides does the pentagon in the image have?", ["4", "5", "6", "7"], 1, "Easy", 1, "polygon_types", lib_lookup))
    q.append(make_mcq(4, "Understanding Elementary Shapes", "How many sides does the hexagon in the image have?", ["5", "6", "7", "8"], 1, "Easy", 1, "polygon_types", lib_lookup))
    q.append(make_mcq(5, "Lines and Angles", "Which angle type is marked in blue?", ["Acute", "Right", "Obtuse", "Straight"], 0, "Easy", 1, "angle_set", lib_lookup))
    q.append(make_mcq(6, "Lines and Angles", "Which angle type is marked in red?", ["Acute", "Right", "Obtuse", "Reflex"], 2, "Easy", 1, "angle_set", lib_lookup))

    q.append(make_mcq(7, "Three-Dimensional Shapes", "Which shown solid has only one curved surface and no edges?", ["Cube", "Cylinder", "Sphere", "Cuboid"], 2, "Easy", 1, "solids_comparison", lib_lookup))
    q.append(make_mcq(8, "Three-Dimensional Shapes", "Which shown solid has two circular faces?", ["Cube", "Cylinder", "Sphere", "Cone"], 1, "Easy", 1, "solids_comparison", lib_lookup))
    q.append(make_mcq(9, "Playing with Constructions", "Can the net shown fold into a cube?", ["Yes", "No", "Only with extra flap", "Cannot say"], 0, "Medium", 1, "cube_net_valid", lib_lookup))
    q.append(make_fill(10, "Playing with Constructions", "Fill in the blank: A cube has ____ faces.", "6", "Easy", 1, "cube_net_valid", lib_lookup))

    q.append(make_mcq(11, "Constructions", "In the construction image, the red arc intersection point is:", ["Closer to A", "Closer to B", "Equidistant from A and B", "Outside the figure"], 2, "Medium", 1, "compass_bisector", lib_lookup))
    q.append(make_short(12, "Constructions", "AB is joined to the top arc intersection using two segments. What is relation between these two segment lengths?", "Equal", "Medium", 2, "compass_bisector", lib_lookup))

    q.append(make_fill(13, "Symmetry", "Fill in the blank: The square shown has ____ lines of symmetry.", "4", "Easy", 1, "axes_overview", lib_lookup))
    q.append(make_fill(14, "Symmetry", "Fill in the blank: The isosceles triangle shown has ____ line of symmetry.", "1", "Easy", 1, "axes_overview", lib_lookup))
    q.append(make_mcq(15, "Symmetry", "In the grid image, the red line acts as:", ["Horizontal axis", "Vertical mirror line", "Diagonal line", "Number line"], 1, "Easy", 1, "reflection_grid", lib_lookup))
    q.append(make_mcq(16, "Symmetry", "The shape on the right side is the ____ of the shape on the left.", ["Translation", "Rotation", "Reflection", "Enlargement"], 2, "Medium", 1, "reflection_grid", lib_lookup))

    q.append(make_short(17, "Perimeter and Area", "Find the perimeter of the rectangle (12 cm by 7 cm).", "38 cm", "Medium", 2, "perimeter_rectangle", lib_lookup))
    q.append(make_short(18, "Perimeter and Area", "Find the area of the rectangle (12 cm by 7 cm).", "84 sq cm", "Medium", 2, "perimeter_rectangle", lib_lookup))
    q.append(make_mcq(19, "Mensuration", "How many unit squares are in the L-shaped grid figure?", ["30", "31", "33", "35"], 2, "Medium", 1, "area_lshape_grid", lib_lookup))
    q.append(make_fill(20, "Mensuration", "Fill in the blank: Area of the L-shape is ____ square units.", "33", "Medium", 1, "area_lshape_grid", lib_lookup))
    q.append(make_fill(21, "Mensuration", "Fill in the blank: 2 m = ____ cm.", "200", "Easy", 1, "unit_conversion_card", lib_lookup))
    q.append(make_short(22, "Mensuration", "Convert 350 cm into metres.", "3.5 m", "Medium", 2, "unit_conversion_card", lib_lookup))

    q.append(make_mcq(23, "Data Handling", "Which day has the highest value in the bar graph?", ["Monday", "Tuesday", "Thursday", "Friday"], 2, "Easy", 1, "bar_graph_week", lib_lookup))
    q.append(make_short(24, "Data Handling", "Find total of Monday and Tuesday values.", "11", "Easy", 2, "bar_graph_week", lib_lookup))
    q.append(make_fill(25, "Data Handling", "Fill in the blank: Thursday value is ____.", "9", "Easy", 1, "bar_graph_week", lib_lookup))
    q.append(make_mcq(26, "Data Handling and Presentation", "In the pictograph, 1 star = 2 students. Blue has 5 stars. Number of students in Blue is:", ["8", "9", "10", "12"], 2, "Easy", 1, "pictograph_students", lib_lookup))
    q.append(make_short(27, "Data Handling and Presentation", "In the pictograph, find total students across Red, Blue and Green.", "24", "Medium", 2, "pictograph_students", lib_lookup))
    q.append(make_fill(28, "Data Handling and Presentation", "From tally table, Banana frequency is ____.", "7", "Easy", 1, "tally_table", lib_lookup))
    q.append(make_short(29, "Data Handling and Presentation", "From tally table, find total frequency of all items.", "16", "Medium", 2, "tally_table", lib_lookup))
    q.append(make_mcq(30, "Data Handling and Presentation", "From tally table, which item has highest frequency?", ["Apple", "Banana", "Mango", "All equal"], 1, "Easy", 1, "tally_table", lib_lookup))

    return q


def write_outputs(questions: List[Dict]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest_used = resolve_manifest_path(LIB_MANIFEST_CANDIDATES)
    payload = {
        "course_id": COURSE_ID,
        "course_session_id": COURSE_SESSION_ID,
        "session_title": SESSION_TITLE,
        "generated_at": "2026-03-04",
        "questions": questions,
    }
    JSON_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(
            [
                "sequence_no",
                "chapter",
                "question_type",
                "difficulty_level",
                "max_marks",
                "question_text",
                "correct_answer",
                "question_image",
                "options_json",
            ]
        )
        for item in questions:
            chapter = item["additional_info"].split("Chapter: ", 1)[-1]
            writer.writerow(
                [
                    item["sequence_no"],
                    chapter,
                    item["question_type"],
                    item["difficulty_level"],
                    item["max_marks"],
                    item["question_text"],
                    item["correct_answer"],
                    item["question_image"],
                    json.dumps(item["options"], ensure_ascii=False),
                ]
            )

    chapter_count = Counter(q["additional_info"].split("Chapter: ", 1)[-1] for q in questions)
    type_count = Counter(q["question_type"] for q in questions)

    lines = [
        "# CBSE Grade 6 Mathematics - Image Question Set (30)",
        "",
        f"- Course ID: `{COURSE_ID}`",
        f"- Course Session ID: `{COURSE_SESSION_ID}`",
        f"- Session Title: `{SESSION_TITLE}`",
        f"- Total Questions: `{len(questions)}`",
        f"- SVG Files: `{len(list(IMAGE_DIR.glob('*.svg')))}`",
        f"- SVG Library Used: `{manifest_used}`",
        "",
        "## Type Distribution",
        "",
    ]
    for t, c in sorted(type_count.items()):
        lines.append(f"- `{t}`: {c}")
    lines.extend(["", "## Chapter Distribution", ""])
    for ch, c in sorted(chapter_count.items()):
        lines.append(f"- `{ch}`: {c}")
    lines.extend(
        [
            "",
            "## Generated Files",
            "",
            f"- `{JSON_PATH}`",
            f"- `{CSV_PATH}`",
            f"- `{IMAGE_DIR}` (30 SVG files)",
            "",
        ]
    )
    README_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    lib_lookup = load_library()
    questions = build_questions(lib_lookup)
    if len(questions) != 30:
        raise ValueError(f"Expected 30 questions, got {len(questions)}")
    write_outputs(questions)
    print(f"Generated {len(questions)} Grade 6 image questions at {OUT_DIR}")


if __name__ == "__main__":
    main()
