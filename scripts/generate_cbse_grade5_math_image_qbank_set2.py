import csv
import json
from collections import Counter
from pathlib import Path
from typing import Dict, List, Tuple


COURSE_ID = 34
COURSE_SESSION_ID = 1085
SESSION_TITLE = "Visual Math Practice - Set 2"
OUT_DIR = Path("artifacts/examprep_qbank_2026-03-04/course_34/grade5_image_set_30_set2")
IMAGE_DIR = OUT_DIR / "images"
JSON_PATH = OUT_DIR / "grade5_image_questions_30_set2.json"
CSV_PATH = OUT_DIR / "grade5_image_questions_30_set2.csv"
README_PATH = OUT_DIR / "README.md"
IMAGE_URL_PREFIX = f"/session_materials/{COURSE_ID}/images"


def svg_wrap(title: str, body: str, width: int = 420, height: int = 280) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}">'
        f'<rect width="{width}" height="{height}" fill="#ffffff" stroke="#d1d5db"/>'
        f'<text x="16" y="24" font-size="16" font-family="Arial" fill="#111827">{title}</text>'
        f"{body}</svg>"
    )


def svg_bar_chart(labels: List[str], values: List[int], title: str, unit: str = "") -> str:
    x0, y0 = 58, 225
    bar_w, gap, scale = 42, 20, 10
    body = ['<line x1="45" y1="225" x2="390" y2="225" stroke="#111827" stroke-width="2"/>']
    for i, (lab, val) in enumerate(zip(labels, values)):
        x = x0 + i * (bar_w + gap)
        h = val * scale
        y = y0 - h
        body.append(f'<rect x="{x}" y="{y}" width="{bar_w}" height="{h}" fill="#93c5fd" stroke="#1d4ed8"/>')
        body.append(f'<text x="{x+9}" y="{y-6}" font-size="12" font-family="Arial">{val}{unit}</text>')
        body.append(f'<text x="{x+10}" y="245" font-size="12" font-family="Arial">{lab}</text>')
    return svg_wrap(title, "".join(body))


def svg_array(rows: int, cols: int, title: str) -> str:
    x0, y0, cell = 90, 60, 28
    cells = []
    for r in range(rows):
        for c in range(cols):
            cells.append(
                f'<rect x="{x0 + c*cell}" y="{y0 + r*cell}" width="{cell}" height="{cell}" '
                f'fill="#ecfeff" stroke="#155e75" stroke-width="1.3"/>'
            )
    text = f'<text x="92" y="230" font-size="14" font-family="Arial">{rows} rows x {cols} columns</text>'
    return svg_wrap(title, "".join(cells) + text)


def svg_number_line(start: int, end: int, step: int, marker: float, title: str) -> str:
    x1, x2, y = 60, 370, 150
    span = end - start
    body = [f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="#111827" stroke-width="2"/>']
    for v in range(start, end + 1, step):
        x = x1 + int((v - start) * (x2 - x1) / span)
        body.append(f'<line x1="{x}" y1="{y-8}" x2="{x}" y2="{y+8}" stroke="#111827"/>')
        body.append(f'<text x="{x-8}" y="{y+24}" font-size="12" font-family="Arial">{v}</text>')
    mx = x1 + int((marker - start) * (x2 - x1) / span)
    body.append(f'<circle cx="{mx}" cy="{y}" r="6" fill="#ef4444"/>')
    return svg_wrap(title, "".join(body))


def svg_pattern_shapes(shapes: List[str], title: str) -> str:
    x = 58
    body = []
    for shape in shapes:
        if shape == "T":
            body.append(f'<polygon points="{x},190 {x+18},150 {x+36},190" fill="#bfdbfe" stroke="#1e3a8a"/>')
        elif shape == "S":
            body.append(f'<rect x="{x}" y="150" width="36" height="36" fill="#fecaca" stroke="#991b1b"/>')
        else:
            body.append(f'<circle cx="{x+18}" cy="168" r="18" fill="#bbf7d0" stroke="#166534"/>')
        x += 48
    body.append('<text x="56" y="230" font-size="14" font-family="Arial">Pattern continues ...</text>')
    return svg_wrap(title, "".join(body))


def svg_stage_squares(title: str) -> str:
    body = []
    stages = [(1, 70), (2, 165), (3, 280)]
    cell = 18
    for n, x0 in stages:
        y0 = 90
        for r in range(n):
            for c in range(n):
                body.append(
                    f'<rect x="{x0 + c*cell}" y="{y0 + r*cell}" width="{cell}" height="{cell}" '
                    f'fill="#fef3c7" stroke="#92400e" stroke-width="1.1"/>'
                )
        body.append(f'<text x="{x0}" y="74" font-size="12" font-family="Arial">Stage {n}</text>')
    body.append('<text x="68" y="230" font-size="13" font-family="Arial">1x1, 2x2, 3x3, ...</text>')
    return svg_wrap(title, "".join(body))


def svg_fraction_strip(parts: int, shaded: int, title: str) -> str:
    x0, y0, w, h = 56, 118, 308, 46
    pw = w / parts
    body = []
    for i in range(parts):
        fill = "#86efac" if i < shaded else "#ffffff"
        body.append(
            f'<rect x="{x0 + i*pw}" y="{y0}" width="{pw}" height="{h}" '
            f'fill="{fill}" stroke="#166534" stroke-width="1.2"/>'
        )
    return svg_wrap(title, "".join(body))


def svg_quarter_circle(shaded: int, title: str) -> str:
    cx, cy, r = 210, 145, 70
    body = [f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#ffffff" stroke="#111827" stroke-width="2"/>']
    # top-left
    if shaded >= 1:
        body.append(f'<path d="M {cx} {cy} L {cx-r} {cy} A {r} {r} 0 0 1 {cx} {cy-r} Z" fill="#bfdbfe"/>')
    # top-right
    if shaded >= 2:
        body.append(f'<path d="M {cx} {cy} L {cx} {cy-r} A {r} {r} 0 0 1 {cx+r} {cy} Z" fill="#bfdbfe"/>')
    # bottom-right
    if shaded >= 3:
        body.append(f'<path d="M {cx} {cy} L {cx+r} {cy} A {r} {r} 0 0 1 {cx} {cy+r} Z" fill="#bfdbfe"/>')
    # bottom-left
    if shaded >= 4:
        body.append(f'<path d="M {cx} {cy} L {cx} {cy+r} A {r} {r} 0 0 1 {cx-r} {cy} Z" fill="#bfdbfe"/>')
    body.extend(
        [
            f'<line x1="{cx-r}" y1="{cy}" x2="{cx+r}" y2="{cy}" stroke="#111827"/>',
            f'<line x1="{cx}" y1="{cy-r}" x2="{cx}" y2="{cy+r}" stroke="#111827"/>',
        ]
    )
    return svg_wrap(title, "".join(body))


def svg_decimal_grid(shaded: int, title: str) -> str:
    x0, y0, cell = 95, 50, 16
    body = []
    for r in range(10):
        for c in range(10):
            idx = r * 10 + c
            fill = "#93c5fd" if idx < shaded else "#ffffff"
            body.append(
                f'<rect x="{x0 + c*cell}" y="{y0 + r*cell}" width="{cell}" height="{cell}" '
                f'fill="{fill}" stroke="#1f2937" stroke-width="0.8"/>'
            )
    body.append('<text x="90" y="230" font-size="13" font-family="Arial">10 x 10 hundred grid</text>')
    return svg_wrap(title, "".join(body))


def svg_grouping(total: int, group_size: int, title: str) -> str:
    x, y = 52, 66
    r = 6
    body = []
    for i in range(total):
        row = i // 12
        col = i % 12
        cx = x + col * 26
        cy = y + row * 30
        body.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fde68a" stroke="#92400e"/>')
    body.append(f'<text x="50" y="230" font-size="13" font-family="Arial">Group size = {group_size}</text>')
    return svg_wrap(title, "".join(body))


def svg_ruler(point: int, title: str) -> str:
    x1, x2, y = 55, 365, 145
    body = [f'<rect x="{x1}" y="{y-18}" width="{x2-x1}" height="36" fill="#fef9c3" stroke="#92400e"/>']
    for v in range(13):
        x = x1 + int(v * (x2 - x1) / 12)
        h = 16 if v % 1 == 0 else 9
        body.append(f'<line x1="{x}" y1="{y-18}" x2="{x}" y2="{y-18+h}" stroke="#111827"/>')
        body.append(f'<text x="{x-4}" y="{y+26}" font-size="11" font-family="Arial">{v}</text>')
    px = x1 + int(point * (x2 - x1) / 12)
    body.append(f'<line x1="{px}" y1="{y-36}" x2="{px}" y2="{y-18}" stroke="#ef4444" stroke-width="2"/>')
    body.append(f'<text x="{px-14}" y="{y-42}" font-size="12" font-family="Arial" fill="#ef4444">{point} cm</text>')
    return svg_wrap(title, "".join(body))


def svg_balance(left: List[int], right: List[int], title: str) -> str:
    body = [
        '<line x1="210" y1="70" x2="210" y2="210" stroke="#111827" stroke-width="4"/>',
        '<line x1="120" y1="110" x2="300" y2="110" stroke="#111827" stroke-width="4"/>',
        '<rect x="95" y="112" width="70" height="10" fill="#d1d5db" stroke="#111827"/>',
        '<rect x="255" y="112" width="70" height="10" fill="#d1d5db" stroke="#111827"/>',
    ]
    lx = 105
    for w in left:
        body.append(f'<rect x="{lx}" y="84" width="24" height="24" fill="#bfdbfe" stroke="#1d4ed8"/>')
        body.append(f'<text x="{lx+6}" y="100" font-size="12" font-family="Arial">{w}</text>')
        lx += 26
    rx = 265
    for w in right:
        body.append(f'<rect x="{rx}" y="84" width="24" height="24" fill="#fecaca" stroke="#991b1b"/>')
        body.append(f'<text x="{rx+6}" y="100" font-size="12" font-family="Arial">{w}</text>')
        rx += 26
    return svg_wrap(title, "".join(body))


def make_mcq(qid: int, chapter: str, text: str, options: List[str], correct_idx: int, difficulty: str, marks: int, svg: str) -> Dict:
    image_name = f"g5_math_img_s2_q{qid:02d}.svg"
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
        "explanation": "Read the diagram and compute carefully.",
        "additional_info": f"CBSE Grade 5 Mathematics Image Set 2 | Chapter: {chapter}",
        "question_image": f"{IMAGE_URL_PREFIX}/{image_name}",
        "options": [{"option_text": opt, "is_correct": i == correct_idx, "option_image": ""} for i, opt in enumerate(options)],
    }


def make_short(qid: int, chapter: str, text: str, answer: str, difficulty: str, marks: int, svg: str) -> Dict:
    image_name = f"g5_math_img_s2_q{qid:02d}.svg"
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
        "explanation": "Use the image values.",
        "additional_info": f"CBSE Grade 5 Mathematics Image Set 2 | Chapter: {chapter}",
        "question_image": f"{IMAGE_URL_PREFIX}/{image_name}",
        "options": [],
    }


def make_fill(qid: int, chapter: str, text: str, answer: str, difficulty: str, marks: int, svg: str) -> Dict:
    image_name = f"g5_math_img_s2_q{qid:02d}.svg"
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
        "additional_info": f"CBSE Grade 5 Mathematics Image Set 2 | Chapter: {chapter}",
        "question_image": f"{IMAGE_URL_PREFIX}/{image_name}",
        "options": [],
    }


def build_questions() -> List[Dict]:
    qs: List[Dict] = []

    qs.append(make_mcq(1, "The Fish Tale", "Which day shows the highest fish catch in the chart?", ["Mon", "Tue", "Wed", "Thu"], 1, "Easy", 1, svg_bar_chart(["Mon", "Tue", "Wed", "Thu"], [12, 18, 15, 9], "Fish Catch by Day")))
    qs.append(make_short(2, "The Fish Tale", "Write the total fish catch for Mon + Tue + Wed.", "45", "Easy", 2, svg_bar_chart(["Mon", "Tue", "Wed", "Thu"], [12, 18, 15, 9], "Fish Catch by Day")))
    qs.append(make_mcq(3, "The Fish Tale", "The red point shows distance traveled by boat. What is the nearest ten?", ["20", "30", "40", "50"], 1, "Medium", 1, svg_number_line(0, 50, 10, 32, "Boat Distance Number Line")))
    qs.append(make_fill(4, "The Fish Tale", "Fill in the blank: Difference between Tue and Thu catch is ____ fish.", "9", "Easy", 1, svg_bar_chart(["Mon", "Tue", "Wed", "Thu"], [12, 18, 15, 9], "Fish Catch by Day")))

    qs.append(make_mcq(5, "Be My Multiple, I Will Be Your Factor", "How many dots are there in this 4 x 6 array?", ["20", "22", "24", "26"], 2, "Easy", 1, svg_array(4, 6, "Dot Array 4x6")))
    qs.append(make_mcq(6, "Be My Multiple, I Will Be Your Factor", "On this number line of multiples of 3, what comes after 18?", ["20", "21", "24", "27"], 1, "Easy", 1, svg_number_line(0, 30, 3, 18, "Multiples of 3")))
    qs.append(make_mcq(7, "Be My Multiple, I Will Be Your Factor", "Which is a factor pair of 24?", ["(3,8)", "(5,5)", "(7,4)", "(2,11)"], 0, "Medium", 1, svg_wrap("Factor Notes", '<text x="70" y="90" font-size="16" font-family="Arial">Number: 24</text><text x="70" y="130" font-size="14" font-family="Arial">Check factor pairs shown in options.</text>')))
    qs.append(make_fill(8, "Be My Multiple, I Will Be Your Factor", "Fill in the blank: The greatest factor of 36 is ____.", "36", "Easy", 1, svg_wrap("Greatest Factor", '<text x="80" y="130" font-size="20" font-family="Arial">Number = 36</text>')))
    qs.append(make_mcq(9, "Be My Multiple, I Will Be Your Factor", "Which number is a common multiple of 4 and 6?", ["12", "18", "20", "22"], 0, "Medium", 1, svg_wrap("Common Multiple", '<text x="70" y="100" font-size="15" font-family="Arial">Find common multiples for 4 and 6</text><text x="70" y="136" font-size="15" font-family="Arial">4: 4, 8, 12, 16, ...</text><text x="70" y="170" font-size="15" font-family="Arial">6: 6, 12, 18, ...</text>')))

    qs.append(make_mcq(10, "Can You See the Pattern?", "Pattern shown is T, S, T, S, T, S ... What is the 7th shape?", ["Triangle", "Square", "Circle", "Rectangle"], 0, "Easy", 1, svg_pattern_shapes(["T", "S", "T", "S", "T", "S"], "Shape Pattern")))
    qs.append(make_fill(11, "Can You See the Pattern?", "Fill in the blank: 5, 10, 15, 20, ____.", "25", "Easy", 1, svg_wrap("Number Pattern", '<text x="70" y="140" font-size="22" font-family="Arial">5, 10, 15, 20, ...</text>')))
    qs.append(make_mcq(12, "Can You See the Pattern?", "Stage 4 of the square pattern will have how many small squares?", ["12", "14", "16", "18"], 2, "Medium", 1, svg_stage_squares("Growing Square Pattern")))
    qs.append(make_short(13, "Can You See the Pattern?", "Write the next number in pattern: 3, 6, 9, 12, ...", "15", "Easy", 2, svg_wrap("Pattern +3", '<text x="80" y="140" font-size="22" font-family="Arial">3, 6, 9, 12, ...</text>')))
    qs.append(make_mcq(14, "Can You See the Pattern?", "If pattern is 2, 4, 8, 16, what is next?", ["18", "20", "24", "32"], 3, "Medium", 1, svg_wrap("Doubling Pattern", '<text x="70" y="140" font-size="22" font-family="Arial">2, 4, 8, 16, ...</text>')))

    qs.append(make_mcq(15, "Parts and Wholes", "What fraction of the strip is shaded?", ["2/8", "3/8", "4/8", "5/8"], 1, "Easy", 1, svg_fraction_strip(8, 3, "Fraction Strip 8 Parts")))
    qs.append(make_mcq(16, "Parts and Wholes", "What fraction of the strip is unshaded?", ["3/8", "4/8", "5/8", "6/8"], 2, "Easy", 1, svg_fraction_strip(8, 3, "Fraction Strip 8 Parts")))
    qs.append(make_mcq(17, "Parts and Wholes", "In the circle, one out of four equal parts is shaded. Fraction is:", ["1/2", "1/3", "1/4", "2/4"], 2, "Easy", 1, svg_quarter_circle(1, "Quarter Circle")))
    qs.append(make_mcq(18, "Parts and Wholes", "Are 1/2 and 3/6 equal?", ["Yes", "No", "Cannot say", "Only for even numbers"], 0, "Medium", 1, svg_wrap("Equivalent Fractions", '<rect x="60" y="90" width="120" height="40" fill="#86efac" stroke="#166534"/><rect x="180" y="90" width="120" height="40" fill="#ffffff" stroke="#166534"/><text x="86" y="82" font-size="12">1/2 strip</text><rect x="60" y="170" width="40" height="40" fill="#86efac" stroke="#166534"/><rect x="100" y="170" width="40" height="40" fill="#86efac" stroke="#166534"/><rect x="140" y="170" width="40" height="40" fill="#86efac" stroke="#166534"/><rect x="180" y="170" width="40" height="40" fill="#ffffff" stroke="#166534"/><rect x="220" y="170" width="40" height="40" fill="#ffffff" stroke="#166534"/><rect x="260" y="170" width="40" height="40" fill="#ffffff" stroke="#166534"/><text x="86" y="162" font-size="12">3/6 strip</text>')))
    qs.append(make_fill(19, "Parts and Wholes", "Out of 5 equal parts, 2 are used. Remaining fraction is ____.", "3/5", "Easy", 1, svg_wrap("Parts Left", '<rect x="70" y="120" width="56" height="40" fill="#fca5a5" stroke="#991b1b"/><rect x="126" y="120" width="56" height="40" fill="#fca5a5" stroke="#991b1b"/><rect x="182" y="120" width="56" height="40" fill="#ffffff" stroke="#991b1b"/><rect x="238" y="120" width="56" height="40" fill="#ffffff" stroke="#991b1b"/><rect x="294" y="120" width="56" height="40" fill="#ffffff" stroke="#991b1b"/>')))

    qs.append(make_short(20, "Tenths and Hundredths", "Write decimal for 27 shaded squares in a hundred grid.", "0.27", "Medium", 2, svg_decimal_grid(27, "Hundred Grid (27 shaded)")))
    qs.append(make_fill(21, "Tenths and Hundredths", "Fill in the blank: 40 shaded squares in hundred grid = ____.", "0.40", "Easy", 1, svg_decimal_grid(40, "Hundred Grid (40 shaded)")))
    qs.append(make_mcq(22, "Tenths and Hundredths", "Red point on number line marks:", ["0.4", "0.5", "0.6", "0.7"], 2, "Easy", 1, svg_number_line(0, 10, 1, 6, "Tenths Number Line (0 to 1)")))
    qs.append(make_fill(23, "Tenths and Hundredths", "Fill in the blank: 3 tenths = ____.", "0.3", "Easy", 1, svg_wrap("Tenths", '<text x="80" y="136" font-size="21" font-family="Arial">3 tenths = ?</text>')))
    qs.append(make_mcq(24, "Tenths and Hundredths", "0.45 is equal to which fraction?", ["45/100", "45/10", "4/5", "5/45"], 0, "Medium", 1, svg_wrap("Decimal to Fraction", '<text x="80" y="136" font-size="21" font-family="Arial">Decimal = 0.45</text>')))

    qs.append(make_mcq(25, "Ways to Multiply and Divide", "Which multiplication sentence matches this 7 x 4 array?", ["7 x 4 = 28", "7 x 4 = 24", "7 + 4 = 11", "28 / 7 = 3"], 0, "Easy", 1, svg_array(7, 4, "Array for Multiplication")))
    qs.append(make_mcq(26, "Ways to Multiply and Divide", "24 objects are grouped in 6 each. Number of groups is:", ["3", "4", "5", "6"], 1, "Easy", 1, svg_grouping(24, 6, "Grouping 24 Objects")))
    qs.append(make_short(27, "Ways to Multiply and Divide", "Write the answer of 18 divided by 3.", "6", "Easy", 2, svg_wrap("Division", '<text x="80" y="136" font-size="21" font-family="Arial">18 / 3 = ?</text>')))

    qs.append(make_mcq(28, "How Big? How Heavy?", "On the ruler, the red mark shows:", ["6 cm", "7 cm", "8 cm", "9 cm"], 2, "Easy", 1, svg_ruler(8, "Ruler Reading")))
    qs.append(make_fill(29, "How Big? How Heavy?", "Balance shows 2 kg + 1 kg on left. Right total is ____ kg.", "3", "Easy", 1, svg_balance([2, 1], [3], "Weight Balance")))
    qs.append(make_mcq(30, "How Big? How Heavy?", "Which bag is heaviest in the chart?", ["A", "B", "C", "All equal"], 1, "Easy", 1, svg_bar_chart(["A", "B", "C"], [2, 5, 4], "Bag Weights", "kg")))

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
        "# CBSE Grade 5 Mathematics - Image Question Set 2 (30)",
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

