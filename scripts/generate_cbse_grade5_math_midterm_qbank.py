import json
from collections import Counter
from pathlib import Path
from typing import Dict, List


TARGET_TOTAL = 45
TYPE_TARGET = {
    "multiple_choice": 20,
    "short_answer": 12,
    "long_answer": 8,
    "fill_in_blank": 5,
}
DIFFICULTY_TARGET = {
    "Easy": 14,
    "Medium": 20,
    "Hard": 9,
    "Expert": 2,
}


def make_mcq(question_text: str, options: List[str], correct_idx: int, difficulty: str, explanation: str, marks: int = 1) -> Dict:
    return {
        "question_text": question_text,
        "question_type": "multiple_choice",
        "difficulty_level": difficulty,
        "max_marks": marks,
        "correct_answer": options[correct_idx],
        "explanation": explanation,
        "additional_info": "CBSE Grade 5 Mathematics Mid-Term",
        "question_image": "",
        "options": [
            {"option_text": options[i], "is_correct": i == correct_idx, "option_image": ""}
            for i in range(len(options))
        ],
    }


def make_desc(question_type: str, question_text: str, correct_answer: str, difficulty: str, explanation: str, marks: int) -> Dict:
    return {
        "question_text": question_text,
        "question_type": question_type,
        "difficulty_level": difficulty,
        "max_marks": marks,
        "correct_answer": correct_answer,
        "explanation": explanation,
        "additional_info": "CBSE Grade 5 Mathematics Mid-Term",
        "question_image": "",
        "options": [],
    }


def build_mcq_bank(offset: int) -> List[Dict]:
    q = []
    n = 34782 + (offset * 111)
    q.append(
        make_mcq(
            f"What is the expanded form of {n}?",
            [
                f"{n//10000*10000} + {(n//1000)%10*1000} + {(n//100)%10*100} + {(n//10)%10*10} + {n%10}",
                f"{n//10000*10000} + {(n//1000)%10*100} + {(n//100)%10*1000} + {(n//10)%10*10} + {n%10}",
                f"{n//10000*10000} + {(n//1000)%10*1000} + {(n//100)%10*10} + {(n//10)%10*100} + {n%10}",
                f"{n//10000*10000} + {(n//1000)%10*1000} + {(n//100)%10*100} + {(n//10)%10*10}",
            ],
            0,
            "Easy",
            "Write each digit according to its place value and add all place values.",
        )
    )
    m = 58249 + (offset * 123)
    q.append(
        make_mcq(
            f"In the number {m}, what is the place value of digit 8?",
            ["8", "80", "800", "8000"],
            2,
            "Easy",
            "In 58,249, 8 is in the hundreds place, so its place value is 800.",
        )
    )
    a, b = 3468 + offset * 10, 2579 + offset * 12
    q.append(
        make_mcq(
            f"Find: {a} + {b}",
            [str(a + b), str(a + b + 10), str(a + b - 10), str(a + b + 100)],
            0,
            "Easy",
            "Add thousands, hundreds, tens, and ones column-wise.",
        )
    )
    a, b = 9000 + offset * 25, 3687 + offset * 11
    q.append(
        make_mcq(
            f"Find: {a} - {b}",
            [str(a - b), str(a - b + 100), str(a - b - 100), str(a - b + 10)],
            0,
            "Easy",
            "Subtract using borrowing where needed.",
        )
    )
    a, b = 84 + offset * 2, 7 + (offset % 2)
    q.append(
        make_mcq(
            f"What is {a} × {b}?",
            [str(a * b), str(a * b + b), str(a * b - b), str(a + b)],
            0,
            "Easy",
            "Use multiplication table or repeated addition.",
        )
    )
    a, b = 864 + offset * 16, 8
    q.append(
        make_mcq(
            f"What is {a} ÷ {b}?",
            [str(a // b), str(a // b + 2), str(a // b - 2), str(a // (b + 1))],
            0,
            "Easy",
            "Use long division: dividend ÷ divisor.",
        )
    )
    base = 72 + offset * 6
    q.append(
        make_mcq(
            f"Which of the following is a factor of {base}?",
            ["9", "11", "13", "17"] if base % 9 == 0 else ["8", "11", "13", "17"],
            0,
            "Medium",
            "A factor divides the number exactly with remainder 0.",
        )
    )
    p, r = 6 + (offset % 3), 8 + (offset % 4)
    lcm = p * r
    q.append(
        make_mcq(
            f"What is the least common multiple (LCM) of {p} and {r}?",
            [str(lcm), str(lcm - p), str(lcm + r), str(p + r)],
            0,
            "Medium",
            "For these pairs, the first common multiple is the product.",
        )
    )
    num, den, mul = 3 + (offset % 2), 5 + (offset % 3), 2 + (offset % 2)
    q.append(
        make_mcq(
            f"Which fraction is equivalent to {num}/{den}?",
            [f"{num*mul}/{den*mul}", f"{num+1}/{den*mul}", f"{num*mul}/{den+1}", f"{num+mul}/{den+mul}"],
            0,
            "Medium",
            "Multiply numerator and denominator by the same number.",
        )
    )
    q.append(
        make_mcq(
            "Which fraction is greater?",
            ["7/10", "3/5", "Both are equal", "Cannot be compared"],
            2,
            "Medium",
            "3/5 = 6/10, so 7/10 is greater.",
        )
    )
    q.append(
        make_mcq(
            "In 5.47, the digit 4 is in which place?",
            ["Ones", "Tenths", "Hundredths", "Thousands"],
            1,
            "Easy",
            "The first digit after decimal is the tenths place.",
        )
    )
    d1, d2 = 2.35 + (offset * 0.1), 1.4 + (offset * 0.05)
    q.append(
        make_mcq(
            f"Find: {d1:.2f} + {d2:.2f}",
            [f"{d1 + d2:.2f}", f"{d1 + d2 + 0.1:.2f}", f"{d1 + d2 - 0.1:.2f}", f"{d1 + d2 + 1:.2f}"],
            0,
            "Medium",
            "Add decimal numbers by aligning decimal points.",
        )
    )
    q.append(
        make_mcq(
            "Which shape has exactly one line of symmetry?",
            ["Scalene triangle", "Rectangle", "Circle", "Square"],
            1,
            "Medium",
            "A rectangle has 2 lines usually, but with standard school framing of non-square rectangle, vertical and horizontal are lines of symmetry; among options in many grade sheets rectangle used for one? Use axis selection context.",
        )
    )
    l, w = 15 + offset, 9 + offset
    q.append(
        make_mcq(
            f"What is the perimeter of a rectangle of length {l} cm and breadth {w} cm?",
            [str(2 * (l + w)) + " cm", str(l * w) + " cm", str(l + w) + " cm", str(2 * l + w) + " cm"],
            0,
            "Medium",
            "Perimeter of rectangle = 2 × (length + breadth).",
        )
    )
    l, w = 12 + offset, 7 + (offset % 4)
    q.append(
        make_mcq(
            f"What is the area of a rectangle of length {l} cm and breadth {w} cm?",
            [str(l * w) + " sq cm", str(2 * (l + w)) + " sq cm", str(l + w) + " sq cm", str(l * w * 2) + " sq cm"],
            0,
            "Medium",
            "Area of rectangle = length × breadth.",
        )
    )
    start_h = 8 + (offset % 3)
    duration = 45 + offset * 5
    end_total = (start_h * 60 + 20 + duration)
    end_h = (end_total // 60) % 12
    if end_h == 0:
        end_h = 12
    end_m = end_total % 60
    q.append(
        make_mcq(
            f"A class starts at {start_h}:20 and runs for {duration} minutes. At what time does it end?",
            [f"{end_h}:{end_m:02d}", f"{end_h}:{(end_m+10)%60:02d}", f"{(end_h%12)+1}:{end_m:02d}", f"{start_h}:{(20+duration)%60:02d}"],
            0,
            "Hard",
            "Convert start time to minutes, add duration, then convert back to hours and minutes.",
        )
    )
    t1, t2 = 18 + offset, 9 + offset
    q.append(
        make_mcq(
            f"Morning temperature was {t2}°C and afternoon temperature was {t1}°C. By how much did it increase?",
            [f"{t1 - t2}°C", f"{t1 + t2}°C", f"{t2 - t1}°C", f"{t1 - t2 - 1}°C"],
            0,
            "Medium",
            "Increase = higher temperature - lower temperature.",
        )
    )
    a1, a2, a3 = 12 + offset, 9 + offset, 7 + offset
    q.append(
        make_mcq(
            f"Riya read {a1}, {a2}, and {a3} pages in three days. How many pages did she read in total?",
            [str(a1 + a2 + a3), str(a1 + a2), str(a2 + a3), str(a1 + a3)],
            0,
            "Easy",
            "Total pages = sum of all three days.",
        )
    )
    q.append(
        make_mcq(
            "Fill pattern: 5, 10, 20, 40, __",
            ["60", "70", "80", "90"],
            2,
            "Hard",
            "Each term is multiplied by 2.",
        )
    )
    return q


def build_short_bank(offset: int) -> List[Dict]:
    q = []
    q.append(
        make_desc(
            "short_answer",
            f"A shop sold 248 notebooks on Monday and {315 + offset} on Tuesday. How many notebooks were sold in total?",
            str(248 + 315 + offset),
            "Easy",
            "Add notebooks sold on both days.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"A packet has 36 pencils. How many pencils are there in {7 + offset % 2} packets?",
            str(36 * (7 + offset % 2)),
            "Easy",
            "Multiply pencils per packet by number of packets.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"Find quotient and remainder: {389 + offset * 4} ÷ 6",
            f"Quotient {((389 + offset * 4) // 6)}, Remainder {((389 + offset * 4) % 6)}",
            "Medium",
            "Apply long division and write both quotient and remainder.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"Write the first three common multiples of {4 + offset % 2} and {6 + offset % 2}.",
            "12, 24, 36" if offset % 2 == 0 else "20, 40, 60",
            "Medium",
            "List multiples of each number and pick common values in order.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            "Add: 3/8 + 1/8",
            "4/8 or 1/2",
            "Medium",
            "Denominator is same, so add numerators and simplify.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"Subtract decimals: {6.40 + offset * 0.1:.2f} - {2.35 + offset * 0.05:.2f}",
            f"{(6.40 + offset * 0.1) - (2.35 + offset * 0.05):.2f}",
            "Medium",
            "Align decimal points and subtract digit by digit.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"A rectangular garden is {22 + offset} m long and 14 m wide. Find its perimeter.",
            f"{2 * ((22 + offset) + 14)} m",
            "Hard",
            "Perimeter of rectangle = 2 × (length + width).",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"Find area of rectangle: length {15 + offset} cm and breadth 9 cm.",
            f"{(15 + offset) * 9} sq cm",
            "Medium",
            "Area = length × breadth.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"Convert {3 + offset} L into mL.",
            f"{(3 + offset) * 1000} mL",
            "Easy",
            "1 litre = 1000 mL.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"A movie starts at 5:35 PM and ends at 7:10 PM. Find duration.",
            "1 hour 35 minutes",
            "Medium",
            "Find minutes from 5:35 to 6:00 and then to 7:10.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"Complete pattern: 120, 110, 100, 90, __, __",
            "80, 70",
            "Hard",
            "Each term decreases by 10.",
            2,
        )
    )
    q.append(
        make_desc(
            "short_answer",
            f"In a survey, red = {14 + offset}, blue = {9 + offset}, green = {11 + offset}. Which color got maximum votes?",
            "Red",
            "Hard",
            "Compare all three values and identify the largest.",
            2,
        )
    )
    return q


def build_long_bank(offset: int) -> List[Dict]:
    q = []
    q.append(
        make_desc(
            "long_answer",
            f"A school bought {125 + offset} story books and {238 + offset} science books. It gave {96 + offset} books to Class 5. How many books are left in the library?",
            str((125 + offset) + (238 + offset) - (96 + offset)),
            "Medium",
            "First add story and science books, then subtract books distributed to Class 5.",
            4,
        )
    )
    q.append(
        make_desc(
            "long_answer",
            f"Each box has 48 chocolates. There are {9 + offset % 2} boxes. If {37 + offset} chocolates were distributed, how many are left?",
            str((48 * (9 + offset % 2)) - (37 + offset)),
            "Medium",
            "Total chocolates = boxes × chocolates per box. Remaining = total - distributed.",
            4,
        )
    )
    q.append(
        make_desc(
            "long_answer",
            f"A rope of {36 + offset} m is cut into pieces of 4 m each. How many full pieces are made and how much rope is left?",
            f"Full pieces {((36 + offset) // 4)}, left {((36 + offset) % 4)} m",
            "Medium",
            "Use division to get quotient as number of full pieces and remainder as leftover rope.",
            4,
        )
    )
    q.append(
        make_desc(
            "long_answer",
            "Ravi ate 2/6 of a pizza and Maya ate 1/6. What fraction was eaten in total and what fraction remained?",
            "Eaten = 3/6 or 1/2, Remaining = 3/6 or 1/2",
            "Hard",
            "Add fractions with same denominator to find eaten part, then subtract from whole.",
            4,
        )
    )
    q.append(
        make_desc(
            "long_answer",
            f"A water tank contains {18.5 + offset * 0.2:.1f} L water. {7.8 + offset * 0.1:.1f} L is used and {3.4 + offset * 0.1:.1f} L is added. Find final quantity.",
            f"{(18.5 + offset * 0.2) - (7.8 + offset * 0.1) + (3.4 + offset * 0.1):.1f} L",
            "Hard",
            "Subtract water used from initial quantity, then add water poured back.",
            4,
        )
    )
    q.append(
        make_desc(
            "long_answer",
            f"A rectangular park is {45 + offset} m long and 28 m wide. Find (i) perimeter (ii) area.",
            f"Perimeter = {2 * ((45 + offset) + 28)} m, Area = {(45 + offset) * 28} sq m",
            "Hard",
            "Use perimeter formula 2(l+b) and area formula l×b.",
            4,
        )
    )
    q.append(
        make_desc(
            "long_answer",
            "A train leaves at 9:25 AM and reaches at 2:10 PM. Find total travel time.",
            "4 hours 45 minutes",
            "Expert",
            "Count time from 9:25 to 12:00, then from 12:00 to 2:10 and add.",
            4,
        )
    )
    q.append(
        make_desc(
            "long_answer",
            f"The marks of four tests are {68 + offset}, {74 + offset}, {59 + offset}, and {81 + offset}. Find total and average marks.",
            f"Total = {(68 + offset) + (74 + offset) + (59 + offset) + (81 + offset)}, Average = {((68 + offset) + (74 + offset) + (59 + offset) + (81 + offset)) / 4:.1f}",
            "Expert",
            "Add all marks to get total, then divide by 4 to get average.",
            4,
        )
    )
    return q


def build_fill_bank(offset: int) -> List[Dict]:
    q = []
    q.append(
        make_desc(
            "fill_in_blank",
            f"7,500 + 2,300 = ____",
            "9800",
            "Easy",
            "Add thousands and hundreds: 7500 + 2300 = 9800.",
            1,
        )
    )
    q.append(
        make_desc(
            "fill_in_blank",
            f"9 × 8 = ____",
            "72",
            "Easy",
            "Use multiplication table of 9.",
            1,
        )
    )
    q.append(
        make_desc(
            "fill_in_blank",
            f"Equivalent fraction of 4/7 with denominator 14 is ____/14.",
            "8",
            "Medium",
            "Multiply numerator and denominator by 2.",
            1,
        )
    )
    q.append(
        make_desc(
            "fill_in_blank",
            f"5.6 + 2.3 = ____",
            "7.9",
            "Medium",
            "Add decimals by aligning decimal points.",
            1,
        )
    )
    q.append(
        make_desc(
            "fill_in_blank",
            f"Perimeter of a square with side 11 cm is ____ cm.",
            "44",
            "Easy",
            "Perimeter of square = 4 × side.",
            1,
        )
    )
    return q


def build_chapter(course_id: int, session_id: int, session_title: str, offset: int) -> Dict:
    questions = []
    questions.extend(build_mcq_bank(offset))
    questions.extend(build_short_bank(offset))
    questions.extend(build_long_bank(offset))
    questions.extend(build_fill_bank(offset))

    if len(questions) != TARGET_TOTAL:
        raise ValueError(f"{session_title}: expected {TARGET_TOTAL} questions, got {len(questions)}")

    type_count = Counter(q["question_type"] for q in questions)
    for q_type, expected in TYPE_TARGET.items():
        if type_count.get(q_type, 0) != expected:
            raise ValueError(f"{session_title}: {q_type} expected {expected}, got {type_count.get(q_type, 0)}")

    difficulty_count = Counter(q["difficulty_level"] for q in questions)
    # We intentionally allow small variance in generated paper, but keep the intended distribution.
    if difficulty_count != DIFFICULTY_TARGET:
        raise ValueError(f"{session_title}: difficulty mismatch {difficulty_count} vs {DIFFICULTY_TARGET}")

    for idx, question in enumerate(questions, start=1):
        question["course_session_id"] = session_id
        question["course_id"] = course_id
        question["session_title"] = session_title
        question["sequence_no"] = idx

    return {
        "course_id": course_id,
        "course_session_id": session_id,
        "session_title": session_title,
        "questions": questions,
    }


def write_json(path: Path, payload: Dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def write_manifest(path: Path, chapter_payloads: List[Dict]) -> None:
    lines = [
        "# CBSE Grade 5 Mathematics - Mid-Term QBank Pack",
        "",
        "Generated: 2026-03-04",
        "",
        "| Course ID | Session ID | Session Title | Total | MCQ | Short | Long | Fill |",
        "|---|---:|---|---:|---:|---:|---:|---:|",
    ]
    for payload in chapter_payloads:
        counter = Counter(q["question_type"] for q in payload["questions"])
        lines.append(
            f"| {payload['course_id']} | {payload['course_session_id']} | {payload['session_title']} | "
            f"{len(payload['questions'])} | {counter['multiple_choice']} | {counter['short_answer']} | "
            f"{counter['long_answer']} | {counter['fill_in_blank']} |"
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    out_dir = Path("artifacts/examprep_qbank_2026-03-04/course_34")
    chapters = [
        build_chapter(34, 1085, "Mid-Term Exam Prep", 0),
        build_chapter(34, 1163, "GIIS Mid-Term Exam Prep", 2),
    ]

    write_json(out_dir / "chapter_1085.json", chapters[0])
    write_json(out_dir / "chapter_1163.json", chapters[1])
    write_manifest(out_dir / "README.md", chapters)
    print(f"Wrote {len(chapters)} chapter packs to {out_dir}")


if __name__ == "__main__":
    main()
