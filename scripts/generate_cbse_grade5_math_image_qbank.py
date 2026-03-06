import csv
import json
import math
from collections import Counter
from pathlib import Path
from typing import Dict, List, Tuple


COURSE_ID = 34
COURSE_SESSION_ID = 1085
SESSION_TITLE = "Visual Math Practice - Set 1"
OUT_DIR = Path("artifacts/examprep_qbank_2026-03-04/course_34/grade5_image_set_30")
IMAGE_DIR = OUT_DIR / "images"
JSON_PATH = OUT_DIR / "grade5_image_questions_30.json"
CSV_PATH = OUT_DIR / "grade5_image_questions_30.csv"
README_PATH = OUT_DIR / "README.md"
IMAGE_URL_PREFIX = f"/session_materials/{COURSE_ID}/images"


def svg_wrap(title: str, body: str, width: int = 420, height: int = 280) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}">'
        f'<rect width="{width}" height="{height}" fill="#ffffff" stroke="#d1d5db"/>'
        f'<text x="18" y="24" font-size="16" font-family="Arial" fill="#111827">{title}</text>'
        f"{body}</svg>"
    )


def svg_angle(deg: int, label: str) -> str:
    x0, y0 = 120, 210
    x1, y1 = 300, 210
    r = 130
    rad = math.radians(180 - deg)
    x2 = x0 + int(r * math.cos(rad))
    y2 = y0 - int(r * math.sin(rad))
    body = (
        f'<line x1="{x0}" y1="{y0}" x2="{x1}" y2="{y1}" stroke="#111827" stroke-width="4"/>'
        f'<line x1="{x0}" y1="{y0}" x2="{x2}" y2="{y2}" stroke="#111827" stroke-width="4"/>'
        f'<path d="M {x0+36} {y0} A 36 36 0 0 0 {x0 + int(36*math.cos(rad))} {y0 - int(36*math.sin(rad))}" '
        f'stroke="#2563eb" stroke-width="3" fill="none"/>'
        f'<circle cx="{x0}" cy="{y0}" r="4" fill="#111827"/>'
        f'<text x="{x0+52}" y="{y0-16}" font-size="15" font-family="Arial" fill="#2563eb">{label}</text>'
    )
    return svg_wrap("Angle Diagram", body)


def svg_grid(rows: int, cols: int, shaded: List[Tuple[int, int]], title: str) -> str:
    x0, y0, cell = 70, 55, 30
    rects = []
    for r in range(rows):
        for c in range(cols):
            fill = "#93c5fd" if (r, c) in shaded else "#ffffff"
            rects.append(
                f'<rect x="{x0 + c*cell}" y="{y0 + r*cell}" width="{cell}" height="{cell}" '
                f'fill="{fill}" stroke="#111827" stroke-width="1.5"/>'
            )
    body = "".join(rects)
    return svg_wrap(title, body)


def svg_rectangle(length: int, breadth: int, unit: str = "cm") -> str:
    x, y, w, h = 90, 80, 220, 120
    body = (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#eef2ff" stroke="#111827" stroke-width="3"/>'
        f'<text x="{x + w/2 - 35}" y="{y - 12}" font-size="15" font-family="Arial" fill="#111827">'
        f'{length} {unit}</text>'
        f'<text x="{x + w + 14}" y="{y + h/2}" font-size="15" font-family="Arial" fill="#111827">'
        f'{breadth} {unit}</text>'
    )
    return svg_wrap("Rectangle", body)


def svg_l_shape(unit_size: int = 30) -> str:
    x0, y0 = 90, 60
    filled = []
    for r in range(5):
        for c in range(5):
            if not (r >= 2 and c >= 3):
                filled.append((r, c))
    rects = []
    for r, c in filled:
        rects.append(
            f'<rect x="{x0 + c*unit_size}" y="{y0 + r*unit_size}" width="{unit_size}" '
            f'height="{unit_size}" fill="#dcfce7" stroke="#166534" stroke-width="1.2"/>'
        )
    body = "".join(rects) + '<text x="88" y="230" font-size="14" font-family="Arial">Each small square = 1 sq unit</text>'
    return svg_wrap("L-Shaped Figure", body)


def svg_map(points: Dict[str, Tuple[int, int]], title: str) -> str:
    cell, x0, y0 = 36, 70, 55
    lines = []
    for i in range(7):
        lines.append(f'<line x1="{x0}" y1="{y0+i*cell}" x2="{x0+6*cell}" y2="{y0+i*cell}" stroke="#cbd5e1"/>')
        lines.append(f'<line x1="{x0+i*cell}" y1="{y0}" x2="{x0+i*cell}" y2="{y0+6*cell}" stroke="#cbd5e1"/>')
    marks = []
    for k, (r, c) in points.items():
        cx, cy = x0 + c * cell, y0 + r * cell
        marks.append(f'<circle cx="{cx}" cy="{cy}" r="7" fill="#2563eb"/>')
        marks.append(f'<text x="{cx+10}" y="{cy+5}" font-size="14" font-family="Arial" fill="#111827">{k}</text>')
    body = "".join(lines) + "".join(marks)
    return svg_wrap(title, body)


def svg_bar_chart(labels: List[str], values: List[int], title: str) -> str:
    x0, y0 = 60, 220
    bar_w, gap, scale = 46, 26, 14
    bars = ['<line x1="50" y1="220" x2="390" y2="220" stroke="#111827" stroke-width="2"/>']
    for i, (lab, val) in enumerate(zip(labels, values)):
        x = x0 + i * (bar_w + gap)
        h = val * scale
        y = y0 - h
        bars.append(f'<rect x="{x}" y="{y}" width="{bar_w}" height="{h}" fill="#60a5fa" stroke="#1d4ed8"/>')
        bars.append(f'<text x="{x+15}" y="{y-6}" font-size="13" font-family="Arial">{val}</text>')
        bars.append(f'<text x="{x+8}" y="242" font-size="13" font-family="Arial">{lab}</text>')
    return svg_wrap(title, "".join(bars))


def svg_cube_net(kind: str) -> str:
    x0, y0, s = 120, 70, 42
    if kind == "valid":
        cells = [(1, 0), (1, 1), (1, 2), (0, 1), (2, 1), (3, 1)]
    else:
        cells = [(0, 0), (0, 1), (0, 2), (1, 0), (1, 2), (2, 1)]
    rects = []
    for r, c in cells:
        rects.append(
            f'<rect x="{x0 + c*s}" y="{y0 + r*s}" width="{s}" height="{s}" '
            f'fill="#fef3c7" stroke="#92400e" stroke-width="2"/>'
        )
    subtitle = "Can this fold to make a cube?"
    body = "".join(rects) + f'<text x="110" y="255" font-size="14" font-family="Arial">{subtitle}</text>'
    return svg_wrap("Cube Net", body)


def svg_fraction_strip(parts: int, shaded: int) -> str:
    x0, y0, w, h = 60, 120, 300, 44
    part_w = w / parts
    rects = []
    for i in range(parts):
        fill = "#86efac" if i < shaded else "#ffffff"
        rects.append(
            f'<rect x="{x0 + i*part_w}" y="{y0}" width="{part_w}" height="{h}" '
            f'fill="{fill}" stroke="#166534" stroke-width="1.4"/>'
        )
    body = "".join(rects) + '<text x="70" y="190" font-size="14" font-family="Arial">Equal parts strip</text>'
    return svg_wrap("Fraction Strip", body)


def make_mcq(qid: int, chapter: str, text: str, options: List[str], correct_idx: int, difficulty: str, marks: int, svg: str) -> Dict:
    image_name = f"g5_math_img_q{qid:02d}.svg"
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    (IMAGE_DIR / image_name).write_text(svg, encoding="utf-8")
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
        "additional_info": f"CBSE Grade 5 Mathematics Image Set 1 | Chapter: {chapter}",
        "question_image": f"{IMAGE_URL_PREFIX}/{image_name}",
        "options": [{"option_text": opt, "is_correct": i == correct_idx, "option_image": ""} for i, opt in enumerate(options)],
    }


def make_short(qid: int, chapter: str, text: str, answer: str, difficulty: str, marks: int, svg: str) -> Dict:
    image_name = f"g5_math_img_q{qid:02d}.svg"
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    (IMAGE_DIR / image_name).write_text(svg, encoding="utf-8")
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
        "explanation": "Use the values shown in the image.",
        "additional_info": f"CBSE Grade 5 Mathematics Image Set 1 | Chapter: {chapter}",
        "question_image": f"{IMAGE_URL_PREFIX}/{image_name}",
        "options": [],
    }


def make_fill(qid: int, chapter: str, text: str, answer: str, difficulty: str, marks: int, svg: str) -> Dict:
    image_name = f"g5_math_img_q{qid:02d}.svg"
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    (IMAGE_DIR / image_name).write_text(svg, encoding="utf-8")
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
        "explanation": "Fill using the visual.",
        "additional_info": f"CBSE Grade 5 Mathematics Image Set 1 | Chapter: {chapter}",
        "question_image": f"{IMAGE_URL_PREFIX}/{image_name}",
        "options": [],
    }


def build_questions() -> List[Dict]:
    qs: List[Dict] = []

    qs.append(make_mcq(1, "Shapes and Angles", "What type of angle is shown?", ["Acute", "Right", "Obtuse", "Straight"], 1, "Easy", 1, svg_angle(90, "90 deg")))
    qs.append(make_mcq(2, "Shapes and Angles", "What type of angle is shown?", ["Acute", "Right", "Obtuse", "Reflex"], 0, "Easy", 1, svg_angle(45, "45 deg")))
    qs.append(make_mcq(3, "Shapes and Angles", "What type of angle is shown?", ["Acute", "Right", "Obtuse", "Straight"], 2, "Easy", 1, svg_angle(120, "120 deg")))
    qs.append(make_mcq(4, "Shapes and Angles", "How many sides does the polygon in the image have?", ["4", "5", "6", "7"], 1, "Easy", 1,
                      svg_wrap("Polygon", '<polygon points="130,80 260,70 315,145 235,225 115,190" fill="#fef9c3" stroke="#92400e" stroke-width="3"/>')))
    qs.append(make_mcq(5, "Shapes and Angles", "The triangle has side lengths 4 cm, 4 cm and 4 cm. What is it called?", ["Scalene", "Isosceles", "Equilateral", "Right"], 2, "Easy", 1,
                      svg_wrap("Triangle", '<polygon points="210,60 120,210 300,210" fill="#e0f2fe" stroke="#0c4a6e" stroke-width="3"/><text x="196" y="52" font-size="13">4 cm</text><text x="86" y="214" font-size="13">4 cm</text><text x="308" y="214" font-size="13">4 cm</text>')))

    qs.append(make_mcq(6, "Does It Look the Same?", "How many lines of symmetry does this square have?", ["1", "2", "3", "4"], 3, "Medium", 1,
                      svg_wrap("Square Symmetry", '<rect x="140" y="70" width="140" height="140" fill="#eef2ff" stroke="#1e3a8a" stroke-width="3"/><line x1="210" y1="70" x2="210" y2="210" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/><line x1="140" y1="140" x2="280" y2="140" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/><line x1="140" y1="70" x2="280" y2="210" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/><line x1="280" y1="70" x2="140" y2="210" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/>')))
    qs.append(make_mcq(7, "Does It Look the Same?", "The mirror line is vertical. Which statement is true?", ["Left and right match", "Top and bottom match", "No matching parts", "Only corners match"], 0, "Medium", 1,
                      svg_wrap("Mirror Line", '<line x1="210" y1="55" x2="210" y2="230" stroke="#ef4444" stroke-width="3" stroke-dasharray="8 6"/><polygon points="120,95 180,120 165,185 110,165" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2.5"/><polygon points="300,95 240,120 255,185 310,165" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2.5"/>')))

    qs.append(make_mcq(8, "How Many Squares?", "How many shaded squares are there?", ["6", "7", "8", "9"], 2, "Easy", 1, svg_grid(4, 5, [(0, 1), (0, 2), (1, 0), (1, 3), (2, 2), (2, 4), (3, 0), (3, 4)], "Grid A")))
    qs.append(make_mcq(9, "How Many Squares?", "How many total small squares are in the grid?", ["12", "16", "20", "24"], 2, "Easy", 1, svg_grid(4, 5, [], "Grid B")))
    qs.append(make_fill(10, "Area and Its Boundary", "Fill in the blank: Area of this rectangle is ____ sq cm.", "24", "Easy", 1, svg_rectangle(6, 4)))
    qs.append(make_fill(11, "Area and Its Boundary", "Fill in the blank: Perimeter of this rectangle is ____ cm.", "20", "Easy", 1, svg_rectangle(6, 4)))
    qs.append(make_mcq(12, "Area and Its Boundary", "What is the area of the L-shape?", ["16 sq units", "19 sq units", "21 sq units", "25 sq units"], 2, "Medium", 1, svg_l_shape()))

    qs.append(make_mcq(13, "Mapping Your Way", "In the map, what is the shortest path length from H to S (in grid steps)?", ["4", "5", "6", "7"], 1, "Medium", 1,
                      svg_map({"H": (5, 1), "S": (1, 4)}, "School Map 1")))
    qs.append(make_mcq(14, "Mapping Your Way", "From P to L, move 2 right and 3 up. Where do you reach?", ["Point A", "Point B", "Point C", "Point D"], 2, "Medium", 1,
                      svg_wrap("Grid Move", '<text x="58" y="45" font-size="14">P=(1,5), A=(3,5), B=(2,3), C=(3,2), D=(5,1)</text>' +
                               ''.join([f'<line x1="{70}" y1="{55+i*32}" x2="{70+6*32}" y2="{55+i*32}" stroke="#cbd5e1"/>' for i in range(7)]) +
                               ''.join([f'<line x1="{70+i*32}" y1="{55}" x2="{70+i*32}" y2="{55+6*32}" stroke="#cbd5e1"/>' for i in range(7)]) +
                               '<circle cx="102" cy="215" r="7" fill="#2563eb"/><text x="112" y="219" font-size="13">P</text>')))
    qs.append(make_short(15, "Mapping Your Way", "Use the map and write the coordinates of point B.", "(4,2)", "Easy", 2,
                        svg_wrap("Coordinate Grid", ''.join([f'<line x1="{60}" y1="{50+i*30}" x2="{300}" y2="{50+i*30}" stroke="#d1d5db"/>' for i in range(9)]) +
                                 ''.join([f'<line x1="{60+i*30}" y1="{50}" x2="{60+i*30}" y2="{290}" stroke="#d1d5db"/>' for i in range(9)]) +
                                 '<circle cx="180" cy="110" r="6" fill="#16a34a"/><text x="190" y="114" font-size="13">B</text><text x="62" y="305" font-size="13">x-axis</text>')))
    qs.append(make_short(16, "Mapping Your Way", "How many grid steps from A(1,1) to C(5,4) if you move only right and up?", "7", "Medium", 2,
                        svg_wrap("Path Count", '<text x="70" y="60" font-size="15">A(1,1) to C(5,4)</text><line x1="90" y1="220" x2="250" y2="220" stroke="#111827" stroke-width="2"/><line x1="90" y1="220" x2="90" y2="80" stroke="#111827" stroke-width="2"/><polyline points="90,220 250,220 250,100" fill="none" stroke="#2563eb" stroke-width="3"/>')))

    qs.append(make_mcq(17, "Boxes and Sketches", "Which net can fold into a cube?", ["Image 17 (this net)", "A line of 6 squares", "A plus with 7 squares", "Any 6 squares"], 0, "Medium", 1, svg_cube_net("valid")))
    qs.append(make_mcq(18, "Boxes and Sketches", "Can this net fold into a cube?", ["Yes", "No", "Only if cut", "Cannot say"], 1, "Medium", 1, svg_cube_net("invalid")))
    qs.append(make_mcq(19, "Boxes and Sketches", "How many cubes are stacked in this block figure?", ["8", "9", "10", "11"], 1, "Medium", 1,
                      svg_wrap("Stacked Cubes", '<rect x="90" y="170" width="50" height="50" fill="#bfdbfe" stroke="#1d4ed8"/><rect x="140" y="170" width="50" height="50" fill="#bfdbfe" stroke="#1d4ed8"/><rect x="190" y="170" width="50" height="50" fill="#bfdbfe" stroke="#1d4ed8"/><rect x="240" y="170" width="50" height="50" fill="#bfdbfe" stroke="#1d4ed8"/><rect x="115" y="120" width="50" height="50" fill="#93c5fd" stroke="#1d4ed8"/><rect x="165" y="120" width="50" height="50" fill="#93c5fd" stroke="#1d4ed8"/><rect x="215" y="120" width="50" height="50" fill="#93c5fd" stroke="#1d4ed8"/><rect x="140" y="70" width="50" height="50" fill="#60a5fa" stroke="#1d4ed8"/><rect x="190" y="70" width="50" height="50" fill="#60a5fa" stroke="#1d4ed8"/>')))

    qs.append(make_mcq(20, "Smart Charts", "Which fruit has the highest sales?", ["Apple", "Banana", "Mango", "Grapes"], 2, "Easy", 1, svg_bar_chart(["A", "B", "M", "G"], [3, 5, 7, 4], "Fruit Sales (bars: A,B,M,G)")))
    qs.append(make_mcq(21, "Smart Charts", "How many more Mangoes than Apples were sold?", ["2", "3", "4", "5"], 2, "Easy", 1, svg_bar_chart(["A", "B", "M", "G"], [3, 5, 7, 4], "Fruit Sales (bars: A,B,M,G)")))

    qs.append(make_mcq(22, "Area and Its Boundary", "What fraction of the strip is shaded?", ["2/6", "3/6", "4/6", "5/6"], 1, "Easy", 1, svg_fraction_strip(6, 3)))
    qs.append(make_mcq(23, "Area and Its Boundary", "What is the unshaded fraction of the strip?", ["1/6", "2/6", "3/6", "4/6"], 2, "Easy", 1, svg_fraction_strip(6, 3)))

    qs.append(make_mcq(24, "How Many Squares?", "How many small squares are needed to make a 6 by 4 rectangle?", ["20", "22", "24", "26"], 2, "Easy", 1,
                      svg_wrap("Rectangular Array", '<rect x="90" y="70" width="240" height="160" fill="#ffffff" stroke="#111827" stroke-width="2"/>' +
                               ''.join([f'<line x1="{90+i*40}" y1="70" x2="{90+i*40}" y2="230" stroke="#cbd5e1"/>' for i in range(1, 6)]) +
                               ''.join([f'<line x1="90" y1="{70+i*40}" x2="330" y2="{70+i*40}" stroke="#cbd5e1"/>' for i in range(1, 4)]) +
                               '<text x="160" y="252" font-size="14">6 columns x 4 rows</text>')))
    qs.append(make_fill(25, "How Many Squares?", "Fill in the blank: Number of small squares in the image is ____.", "24", "Easy", 1,
                        svg_wrap("6x4 Grid", '<rect x="90" y="70" width="240" height="160" fill="#ffffff" stroke="#111827" stroke-width="2"/>' +
                                 ''.join([f'<line x1="{90+i*40}" y1="70" x2="{90+i*40}" y2="230" stroke="#cbd5e1"/>' for i in range(1, 6)]) +
                                 ''.join([f'<line x1="90" y1="{70+i*40}" x2="330" y2="{70+i*40}" stroke="#cbd5e1"/>' for i in range(1, 4)]))))

    qs.append(make_short(26, "Shapes and Angles", "One angle is 35 deg and together they make a right angle. Find the other angle.", "55 deg", "Medium", 2,
                        svg_wrap("Right Angle Split", '<line x1="110" y1="220" x2="280" y2="220" stroke="#111827" stroke-width="3"/><line x1="110" y1="220" x2="110" y2="70" stroke="#111827" stroke-width="3"/><line x1="110" y1="220" x2="190" y2="120" stroke="#2563eb" stroke-width="3"/><text x="155" y="172" font-size="14">35 deg</text><text x="118" y="96" font-size="14">?</text>')))
    qs.append(make_short(27, "Area and Its Boundary", "Find the perimeter of the rectangle shown.", "26 cm", "Medium", 2, svg_rectangle(8, 5)))
    qs.append(make_short(28, "Area and Its Boundary", "Find the area of the rectangle shown.", "40 sq cm", "Medium", 2, svg_rectangle(8, 5)))
    qs.append(make_short(29, "Smart Charts", "Write total of all bars in the chart.", "19", "Medium", 2, svg_bar_chart(["A", "B", "M", "G"], [3, 5, 7, 4], "Fruit Sales (bars: A,B,M,G)")))
    qs.append(make_fill(30, "Shapes and Angles", "Fill in the blank: The straight angle is ____ deg.", "180", "Easy", 1,
                        svg_wrap("Straight Angle", '<line x1="80" y1="160" x2="340" y2="160" stroke="#111827" stroke-width="4"/><circle cx="210" cy="160" r="4" fill="#111827"/><text x="170" y="145" font-size="14">straight line</text>')))

    return qs


def write_outputs(questions: List[Dict]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

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
        for q in questions:
            chapter = q["additional_info"].split("Chapter: ", 1)[-1]
            writer.writerow(
                [
                    q["sequence_no"],
                    chapter,
                    q["question_type"],
                    q["difficulty_level"],
                    q["max_marks"],
                    q["question_text"],
                    q["correct_answer"],
                    q["question_image"],
                    json.dumps(q["options"], ensure_ascii=False),
                ]
            )

    chapter_count = Counter(q["additional_info"].split("Chapter: ", 1)[-1] for q in questions)
    type_count = Counter(q["question_type"] for q in questions)
    lines = [
        "# CBSE Grade 5 Mathematics - Image Question Set (30)",
        "",
        f"- Course ID: `{COURSE_ID}`",
        f"- Course Session ID: `{COURSE_SESSION_ID}`",
        f"- Session Title: `{SESSION_TITLE}`",
        f"- Total Questions: `{len(questions)}`",
        f"- SVG Files: `{len(list(IMAGE_DIR.glob('*.svg')))}`",
        "",
        "## Type Distribution",
        "",
    ]
    for t, c in sorted(type_count.items()):
        lines.append(f"- `{t}`: {c}")
    lines.append("")
    lines.append("## Chapter Distribution")
    lines.append("")
    for ch, c in sorted(chapter_count.items()):
        lines.append(f"- `{ch}`: {c}")
    lines.append("")
    lines.append("## Generated Files")
    lines.append("")
    lines.append(f"- `{JSON_PATH}`")
    lines.append(f"- `{CSV_PATH}`")
    lines.append(f"- `{IMAGE_DIR}` (30 SVG files)")
    README_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    questions = build_questions()
    if len(questions) != 30:
        raise ValueError(f"Expected 30 questions, got {len(questions)}")
    write_outputs(questions)
    print(f"Generated {len(questions)} questions at {OUT_DIR}")


if __name__ == "__main__":
    main()
