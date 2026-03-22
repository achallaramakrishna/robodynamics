"""
Enrich VM_G4_L1_FAST_ADDITION.json
Adds 2-3 new questions per exercise group, converting speed drills (G, H)
to short_answer type so students type the answer instead of guessing.
Also adds short_answer questions to C and D for active recall practice.

Current counts: A=3, B=2, C=2, D=3, E=2, F=2, G=3, H=3, I=2 (total=22)
Target counts:  A=5, B=5, C=5, D=5, E=4, F=4, G=5, H=5, I=4 (total=42)
"""

import json
from pathlib import Path

FILE = Path(r"C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L1_FAST_ADDITION.json")

data = json.loads(FILE.read_text(encoding="utf-8"))
session_flow = data["duolingoLessonArc"]["sessionFlow"]

# Helper: build a minimal short-answer visual (orange theme for 10, cyan for 100/1000, etc.)
def sa_svg(aria, equation, hint, title, badge_color, badge_text, text_color, stroke_color, bg1, bg2, hint_color):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="{aria}">'
        f'<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
        f'<stop offset="0%" stop-color="{bg1}"/><stop offset="100%" stop-color="{bg2}"/>'
        f'</linearGradient></defs>'
        f'<rect x="6" y="6" width="308" height="168" rx="22" fill="url(#bg)" stroke="{stroke_color}" stroke-width="2"/>'
        f'<rect x="18" y="18" width="170" height="30" rx="15" fill="#ffffff" opacity="0.95"/>'
        f'<text x="32" y="37" fill="{text_color}" font-size="14" font-weight="700">{title}</text>'
        f'<rect x="214" y="18" width="88" height="30" rx="15" fill="{bg1}" stroke="{stroke_color}" stroke-width="1.2"/>'
        f'<text x="258" y="37" text-anchor="middle" fill="{badge_color}" font-size="13" font-weight="800">{badge_text}</text>'
        f'<rect x="22" y="62" width="276" height="60" rx="18" fill="#ffffff" stroke="{stroke_color}" stroke-width="1.5"/>'
        f'<text x="160" y="98" text-anchor="middle" fill="{text_color}" font-size="28" font-weight="800">{equation}</text>'
        f'<rect x="22" y="132" width="276" height="34" rx="14" fill="#ffffff" stroke="{stroke_color}" stroke-width="1"/>'
        f'<text x="160" y="154" text-anchor="middle" fill="{hint_color}" font-size="14">Type your answer ↑</text>'
        f'<text x="24" y="174" fill="{text_color}" font-size="11">Hint: {hint}</text>'
        f'</svg>'
    )

# ── Per-group colour palettes ───────────────────────────────────────────────
PA = dict(title="Complement to 10", badge_text="Make 10", badge_color="#f97316",
          text_color="#7c2d12", stroke_color="#fb923c", bg1="#fff7ed", bg2="#ffedd5", hint_color="#ea580c")
PB = dict(title="Pair to 10", badge_text="Make 10", badge_color="#d946ef",
          text_color="#6b214f", stroke_color="#e879f9", bg1="#fdf4ff", bg2="#fae8ff", hint_color="#a21caf")
PC = dict(title="Complete 10", badge_text="Make 10", badge_color="#2563eb",
          text_color="#1e3a8a", stroke_color="#60a5fa", bg1="#eff6ff", bg2="#dbeafe", hint_color="#1d4ed8")
PD = dict(title="Complete 100", badge_text="Make 100", badge_color="#0891b2",
          text_color="#155e75", stroke_color="#22d3ee", bg1="#ecfeff", bg2="#cffafe", hint_color="#0e7490")
PE = dict(title="Complete 1000", badge_text="Make 1000", badge_color="#7c3aed",
          text_color="#3b0764", stroke_color="#a855f7", bg1="#faf5ff", bg2="#f3e8ff", hint_color="#6d28d9")
PF = dict(title="Word problem", badge_text="Real life", badge_color="#16a34a",
          text_color="#166534", stroke_color="#4ade80", bg1="#f0fdf4", bg2="#dcfce7", hint_color="#15803d")
PG = dict(title="Speed — to 10", badge_text="Make 10", badge_color="#e11d48",
          text_color="#881337", stroke_color="#fb7185", bg1="#fff1f2", bg2="#ffe4e6", hint_color="#be123c")
PH = dict(title="Speed — to 100", badge_text="Make 100", badge_color="#4f46e5",
          text_color="#312e81", stroke_color="#818cf8", bg1="#eef2ff", bg2="#e0e7ff", hint_color="#4338ca")
PI = dict(title="Challenge 1000", badge_text="Make 1000", badge_color="#ca8a04",
          text_color="#713f12", stroke_color="#facc15", bg1="#fefce8", bg2="#fef3c7", hint_color="#a16207")


def make_sa(qid, group, subtopic, skill, difficulty, qtext, equation, expected, hint, solution, palette):
    p = palette
    return {
        "questionId": qid,
        "chapterCode": "VM_G4_L1_FAST_ADDITION",
        "exerciseGroup": group,
        "subtopic": subtopic,
        "skill": skill,
        "difficulty": difficulty,
        "type": "practice",
        "questionType": "short_answer",
        "questionText": qtext,
        "expectedAnswer": expected,
        "hint": hint,
        "solution": solution,
        "visual": {
            "kind": "svg",
            "asset": "vm_complements_whole.svg",
            "title": p["title"],
            "caption": f"Type the missing number that completes the whole.",
            "svg": sa_svg(qtext, equation, hint, p["title"], p["badge_color"], p["badge_text"],
                          p["text_color"], p["stroke_color"], p["bg1"], p["bg2"], p["hint_color"]),
            "themeColor": p["badge_color"]
        }
    }


def make_mcq(qid, group, subtopic, skill, difficulty, qtext, options, correct_idx, expected, hint, solution, palette):
    p = palette
    return {
        "questionId": qid,
        "chapterCode": "VM_G4_L1_FAST_ADDITION",
        "exerciseGroup": group,
        "subtopic": subtopic,
        "skill": skill,
        "difficulty": difficulty,
        "type": "practice",
        "questionType": "mcq",
        "questionText": qtext,
        "options": options,
        "correctIndex": correct_idx,
        "expectedAnswer": expected,
        "hint": hint,
        "solution": solution,
        "visual": {
            "kind": "svg",
            "asset": "vm_complements_whole.svg",
            "title": p["title"],
            "caption": f"Choose the missing number that completes the whole.",
            "svg": sa_svg(qtext, f"? = {expected}", hint, p["title"], p["badge_color"], p["badge_text"],
                          p["text_color"], p["stroke_color"], p["bg1"], p["bg2"], p["hint_color"]),
            "themeColor": p["badge_color"]
        }
    }


# ── New questions per group ─────────────────────────────────────────────────
NEW_QUESTIONS = {
    "A": [
        make_sa("VM_G4_L1_A4", "A", "What is a complement?", "complement to 10", "easy",
                "Type the missing number: 5 + ___ = 10", "5 + ___ = 10", "5",
                "5 needs five more to reach 10", "5 + 5 = 10, so the complement of 5 is 5.", PA),
        make_mcq("VM_G4_L1_A5", "A", "What is a complement?", "complement concept", "easy",
                 "A complement is the number that completes a ___.",
                 ["round 10", "big number", "sequence", "fraction"], 0, "round 10",
                 "Think: complement completes a whole like 10.", "A complement is the missing part that makes a round whole like 10.", PA),
    ],
    "B": [
        make_sa("VM_G4_L1_B3", "B", "Complement pairs to 10", "complement pair recall", "easy",
                "Type the complement of 3 to make 10.", "3 + ___ = 10", "7",
                "3 + 7 = 10", "3 + 7 = 10, so the complement of 3 is 7.", PB),
        make_sa("VM_G4_L1_B4", "B", "Complement pairs to 10", "complement pair recall", "easy",
                "Type the complement of 1 to make 10.", "1 + ___ = 10", "9",
                "1 + 9 = 10", "1 + 9 = 10, so the complement of 1 is 9.", PB),
        make_sa("VM_G4_L1_B5", "B", "Complement pairs to 10", "complement pair recall", "easy",
                "Type the complement of 5 to make 10.", "5 + ___ = 10", "5",
                "5 is its own complement for 10!", "5 + 5 = 10. Five and five are their own complements.", PB),
    ],
    "C": [
        make_sa("VM_G4_L1_C3", "C", "Completing 10 quickly", "complete to 10", "easy",
                "Type the missing number: 4 + ___ = 10", "4 + ___ = 10", "6",
                "4 needs 6 more to reach 10", "4 + 6 = 10.", PC),
        make_sa("VM_G4_L1_C4", "C", "Completing 10 quickly", "complete to 10", "easy",
                "Type the missing number: 3 + ___ = 10", "3 + ___ = 10", "7",
                "3 needs 7 more to reach 10", "3 + 7 = 10.", PC),
        make_sa("VM_G4_L1_C5", "C", "Completing 10 quickly", "complete to 10", "easy",
                "Type the missing number: 6 + ___ = 10", "6 + ___ = 10", "4",
                "6 needs 4 more to reach 10", "6 + 4 = 10.", PC),
    ],
    "D": [
        make_sa("VM_G4_L1_D4", "D", "Completing 100 mentally", "complement to 100", "easy",
                "Type the complement of 62 to make 100.", "62 + ___ = 100", "38",
                "100 - 62 = 38", "100 - 62 = 38, so 62 + 38 = 100.", PD),
        make_sa("VM_G4_L1_D5", "D", "Completing 100 mentally", "complement to 100", "easy",
                "Type the complement of 91 to make 100.", "91 + ___ = 100", "9",
                "100 - 91 = 9", "100 - 91 = 9, so 91 + 9 = 100.", PD),
    ],
    "E": [
        make_sa("VM_G4_L1_E3", "E", "Completing 1000 mentally", "complement to 1000", "medium",
                "Type the answer: 246 + ? = 1000", "246 + ___ = 1000", "754",
                "1000 - 246 = 754", "1000 - 246 = 754, so 246 + 754 = 1000.", PE),
        make_sa("VM_G4_L1_E4", "E", "Completing 1000 mentally", "complement to 1000", "medium",
                "Type the answer: 570 + ? = 1000", "570 + ___ = 1000", "430",
                "1000 - 570 = 430", "1000 - 570 = 430, so 570 + 430 = 1000.", PE),
    ],
    "F": [
        make_sa("VM_G4_L1_F3", "F", "Word problems with complements", "word problem complement", "medium",
                "Ravi needs to read 100 pages. He has read 67 pages. How many pages remain?",
                "100 - 67 = ___", "33",
                "100 - 67 = pages left", "100 - 67 = 33, so 33 pages remain.", PF),
        make_sa("VM_G4_L1_F4", "F", "Word problems with complements", "word problem complement", "medium",
                "A water tank holds 1000 litres. It has 429 litres. How much more fills it?",
                "1000 - 429 = ___", "571",
                "1000 - 429 gives litres needed", "1000 - 429 = 571, so 571 more litres are needed.", PF),
    ],
    "G": [
        make_sa("VM_G4_L1_G4", "G", "Speed drill - complements to 10", "speed complement 10", "medium",
                "Quick! Type: 4 + ___ = 10", "4 + ___ = 10", "6",
                "4 needs 6 more", "4 + 6 = 10.", PG),
        make_sa("VM_G4_L1_G5", "G", "Speed drill - complements to 10", "speed complement 10", "medium",
                "Quick! Type: 6 + ___ = 10", "6 + ___ = 10", "4",
                "6 needs 4 more", "6 + 4 = 10.", PG),
    ],
    "H": [
        make_sa("VM_G4_L1_H4", "H", "Speed drill - complements to 100", "speed complement 100", "medium",
                "Quick! Type: 100 - 22 = ?", "100 - 22 = ___", "78",
                "22 needs 78 more to reach 100", "100 - 22 = 78.", PH),
        make_sa("VM_G4_L1_H5", "H", "Speed drill - complements to 100", "speed complement 100", "medium",
                "Quick! Type: 100 - 71 = ?", "100 - 71 = ___", "29",
                "71 needs 29 more to reach 100", "100 - 71 = 29.", PH),
    ],
    "I": [
        make_sa("VM_G4_L1_I3", "I", "Big number complement challenge", "challenge complement 1000", "hard",
                "Type the complement of 908 to make 1000.", "908 + ___ = 1000", "92",
                "1000 - 908 = 92", "1000 - 908 = 92, so 908 + 92 = 1000.", PI),
        make_sa("VM_G4_L1_I4", "I", "Big number complement challenge", "challenge complement 1000", "hard",
                "Type the complement of 681 to make 1000.", "681 + ___ = 1000", "319",
                "1000 - 681 = 319", "1000 - 681 = 319, so 681 + 319 = 1000.", PI),
    ],
}


# ── Inject into sessionFlow ─────────────────────────────────────────────────
for step in session_flow:
    grp = step.get("exerciseGroup", "")
    new_qs = NEW_QUESTIONS.get(grp, [])
    if new_qs:
        step["exercises"].extend(new_qs)
        print(f"Group {grp}: added {len(new_qs)} questions -> total {len(step['exercises'])}")

# Write back
FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print("\nDone. File updated.")

# Verify counts
session_flow2 = data["duolingoLessonArc"]["sessionFlow"]
total = sum(len(s["exercises"]) for s in session_flow2)
print(f"Total questions in sessionFlow: {total}")
for s in session_flow2:
    types = [q["questionType"] for q in s["exercises"]]
    type_summary = {}
    for t in types:
        type_summary[t] = type_summary.get(t, 0) + 1
    print(f"  Group {s['exerciseGroup']:2s}: {len(s['exercises'])} questions  ({type_summary})")
