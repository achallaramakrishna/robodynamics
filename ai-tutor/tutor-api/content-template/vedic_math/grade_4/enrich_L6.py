"""
Enrichment script for VM_G4_L6_MULT_BY_5_25.json

Changes:
1. Add demo + guided screenplay beats
2. Bring every exercise group to 4-5 questions (currently 2-3 each)
3. Convert all "text" questionType to "short_answer"
"""

import json

FILE = r"C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L6_MULT_BY_5_25.json"

with open(FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

# ── 1. Convert all "text" questions to "short_answer" ──────────────────────
session_flow = data["duolingoLessonArc"]["sessionFlow"]
text_count_before = 0
for group in session_flow:
    for ex in group.get("exercises", []):
        if ex.get("questionType") == "text":
            text_count_before += 1
            ex["questionType"] = "short_answer"

# ── 2. Add questions to each exercise group ────────────────────────────────
new_questions = {
    "A": [
        {
            "questionId": "VM_G4_L6_A_Q4",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "A",
            "subtopic": "Multiply by 5 - halve then x10",
            "skill": "multiply by 5 even",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "48 x 5 = ?",
            "expectedAnswer": "240",
            "hint": "Half of 48=24. 24x10=240.",
            "solution": "Half 48=24. 24x10=240. Answer: 240.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x5 with even numbers",
                "caption": "Half the number first, then multiply by 10."
            }
        },
        {
            "questionId": "VM_G4_L6_A_Q5",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "A",
            "subtopic": "Multiply by 5 - halve then x10",
            "skill": "multiply by 5 even",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "24 x 5 = ?",
            "options": ["110", "120", "130", "140"],
            "correctIndex": 1,
            "expectedAnswer": "120",
            "hint": "Half of 24=12. 12x10=120.",
            "solution": "Half 24=12. 12x10=120. Answer: 120.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x5 with even numbers",
                "caption": "Half the number first, then multiply by 10."
            }
        }
    ],
    "B": [
        {
            "questionId": "VM_G4_L6_B_Q3",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "B",
            "subtopic": "Multiply by 5 with odd numbers",
            "skill": "multiply by 5 odd",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "19 x 5 = ?",
            "options": ["85", "90", "95", "100"],
            "correctIndex": 2,
            "expectedAnswer": "95",
            "hint": "19x10=190. Half of 190=95.",
            "solution": "19x10=190. Half 190=95. Answer: 95.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x5 with odd numbers",
                "caption": "Multiply by 10 first, then halve to avoid fractions."
            }
        },
        {
            "questionId": "VM_G4_L6_B_Q4",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "B",
            "subtopic": "Multiply by 5 with odd numbers",
            "skill": "multiply by 5 odd",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "27 x 5 = ?",
            "expectedAnswer": "135",
            "hint": "27x10=270. Half of 270=135.",
            "solution": "27x10=270. Half 270=135. Answer: 135.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x5 with odd numbers",
                "caption": "Multiply by 10 first, then halve to avoid fractions."
            }
        }
    ],
    "C": [
        {
            "questionId": "VM_G4_L6_C_Q3",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "C",
            "subtopic": "Multiply by 25 - quarter then x100",
            "skill": "multiply by 25 exact quarter",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "32 x 25 = ?",
            "options": ["700", "750", "800", "850"],
            "correctIndex": 2,
            "expectedAnswer": "800",
            "hint": "32/4=8. 8x100=800.",
            "solution": "32/4=8. 8x100=800. Answer: 800.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x25 with exact quarters",
                "caption": "Quarter the number first, then multiply by 100."
            }
        },
        {
            "questionId": "VM_G4_L6_C_Q4",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "C",
            "subtopic": "Multiply by 25 - quarter then x100",
            "skill": "multiply by 25 exact quarter",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "8 x 25 = ?",
            "expectedAnswer": "200",
            "hint": "8/4=2. 2x100=200.",
            "solution": "8/4=2. 2x100=200. Answer: 200.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x25 with exact quarters",
                "caption": "Quarter the number first, then multiply by 100."
            }
        }
    ],
    "D": [
        {
            "questionId": "VM_G4_L6_D_Q3",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "D",
            "subtopic": "Multiply by 25 with remainders",
            "skill": "multiply by 25 with remainder",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "34 x 25 = ?",
            "options": ["800", "825", "850", "875"],
            "correctIndex": 2,
            "expectedAnswer": "850",
            "hint": "34/4=8 r 2. 8x100=800. 2x25=50. 800+50=850.",
            "solution": "34/4=8 r 2. 8x100=800. 2x25=50. Total=850.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x25 with remainder",
                "caption": "Handle the remainder by multiplying it by 25 and adding."
            }
        },
        {
            "questionId": "VM_G4_L6_D_Q4",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "D",
            "subtopic": "Multiply by 25 with remainders",
            "skill": "multiply by 25 with remainder",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "22 x 25 = ?",
            "expectedAnswer": "550",
            "hint": "22/4=5 r 2. 5x100=500. 2x25=50. 500+50=550.",
            "solution": "22/4=5 r 2. 5x100=500. 2x25=50. Total=550.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x25 with remainder",
                "caption": "Handle the remainder by multiplying it by 25 and adding."
            }
        }
    ],
    "E": [
        {
            "questionId": "VM_G4_L6_E_Q3",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "E",
            "subtopic": "Word problem - x5 context",
            "skill": "x5 word problem",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "A bag of 36 oranges costs Rs 5 each. What is the total cost?",
            "expectedAnswer": "180",
            "hint": "36x5. Half of 36=18. 18x10=180.",
            "solution": "36x5: Half 36=18. 18x10=180. Total: Rs 180.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x5 word problem",
                "caption": "Apply the x5 shortcut in a real-life shopping context."
            }
        },
        {
            "questionId": "VM_G4_L6_E_Q4",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "E",
            "subtopic": "Word problem - x5 context",
            "skill": "x5 word problem",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "A school orders 46 chairs. Each chair costs Rs 5. What is the total?",
            "options": ["220", "225", "230", "235"],
            "correctIndex": 2,
            "expectedAnswer": "230",
            "hint": "46x5. Half of 46=23. 23x10=230.",
            "solution": "46x5: Half 46=23. 23x10=230. Answer: Rs 230.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x5 word problem",
                "caption": "Apply the x5 shortcut in a real-life shopping context."
            }
        }
    ],
    "F": [
        {
            "questionId": "VM_G4_L6_F_Q3",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "F",
            "subtopic": "Word problem - x25 context",
            "skill": "x25 word problem",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "A box holds 20 bananas and costs Rs 25 per box. What is the cost of 20 boxes?",
            "options": ["400", "450", "500", "550"],
            "correctIndex": 2,
            "expectedAnswer": "500",
            "hint": "20x25. 20/4=5. 5x100=500.",
            "solution": "20x25: 20/4=5. 5x100=500. Answer: Rs 500.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x25 word problem",
                "caption": "Apply the x25 shortcut in a real-life context."
            }
        },
        {
            "questionId": "VM_G4_L6_F_Q4",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "F",
            "subtopic": "Word problem - x25 context",
            "skill": "x25 word problem",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "Ravi buys 12 notebooks. Each costs Rs 25. What does he pay in total?",
            "expectedAnswer": "300",
            "hint": "12x25. 12/4=3. 3x100=300.",
            "solution": "12x25: 12/4=3. 3x100=300. Answer: Rs 300.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x25 word problem",
                "caption": "Apply the x25 shortcut in a real-life context."
            }
        }
    ],
    "G": [
        {
            "questionId": "VM_G4_L6_G_Q3",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "G",
            "subtopic": "Spot the product - MCQ",
            "skill": "spot correct x5/x25 product",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "64 x 5 = ?",
            "expectedAnswer": "320",
            "hint": "Half of 64=32. 32x10=320.",
            "solution": "Half 64=32. 32x10=320. Answer: 320.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "Spot the product",
                "caption": "Identify the correct answer quickly using the shortcut."
            }
        },
        {
            "questionId": "VM_G4_L6_G_Q4",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "G",
            "subtopic": "Spot the product - MCQ",
            "skill": "spot correct x5/x25 product",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "Which of these equals 36 x 25?",
            "options": ["800", "875", "900", "950"],
            "correctIndex": 2,
            "expectedAnswer": "900",
            "hint": "36/4=9. 9x100=900.",
            "solution": "36/4=9. 9x100=900. Answer: 900.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "Spot the product",
                "caption": "Identify the correct answer quickly using the shortcut."
            }
        }
    ],
    "H": [
        {
            "questionId": "VM_G4_L6_H_Q3",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "H",
            "subtopic": "Fill-step: x25 chain",
            "skill": "fill-step x25",
            "difficulty": "hard",
            "type": "guided",
            "questionType": "fill_step",
            "questionText": "Find 36 x 25 step by step.",
            "steps": [
                {"label": "Divide 36 by 4: ?", "answer": "9", "hint": "36 / 4 = 9"},
                {"label": "Multiply by 100: 9 x 100 = ?", "answer": "900", "hint": "9 x 100"},
            ],
            "expectedAnswer": "900",
            "hint": "36/4=9. 9x100=900.",
            "solution": "36/4=9. 9x100=900. Answer: 900.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "Fill the x25 steps",
                "caption": "Quarter then x100 - fill each box in order."
            }
        }
    ],
    "I": [
        {
            "questionId": "VM_G4_L6_I_Q3",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "I",
            "subtopic": "Challenge: x50 and x125",
            "skill": "x50 and x125",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "24 x 50 = ? (Hint: x50 = halve then x100)",
            "options": ["1100", "1200", "1300", "1400"],
            "correctIndex": 1,
            "expectedAnswer": "1200",
            "hint": "Half of 24=12. 12x100=1200.",
            "solution": "24x50: Half 24=12. 12x100=1200. Answer: 1200.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x50 challenge",
                "caption": "Extend the base idea: x50 means halve then x100."
            }
        },
        {
            "questionId": "VM_G4_L6_I_Q4",
            "chapterCode": "VM_G4_L6_MULT_BY_5_25",
            "exerciseGroup": "I",
            "subtopic": "Challenge: x50 and x125",
            "skill": "x50 and x125",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "8 x 125 = ? (Hint: x125 = divide by 8 then x1000)",
            "expectedAnswer": "1000",
            "hint": "8/8=1. 1x1000=1000.",
            "solution": "8x125: 8/8=1. 1x1000=1000. Answer: 1000.",
            "visual": {
                "kind": "svg",
                "asset": "vm_mult_by_5_25.svg",
                "title": "x125 challenge",
                "caption": "x125 = divide by 8 then multiply by 1000."
            }
        }
    ]
}

for group in session_flow:
    grp = group["exerciseGroup"]
    if grp in new_questions:
        group["exercises"].extend(new_questions[grp])

# ── 3. Add demo + guided beats ───────────────────────────────────────────────
demo_beat = {
    "beatId": "VM_G4_L6_A_DEMO",
    "stepId": "VM_G4_L6_A",
    "exerciseGroup": "A",
    "subtopic": "Multiply by 5 - halve then x10",
    "sequence": 602,
    "cue": "demo",
    "boardMode": "steps",
    "teacherLine": "Watch this! 48 x 5. First: half of 48 = 24. Then: 24 x 10 = 240. That is it! Answer: 240.",
    "boardAction": "Show: 48 → half → 24 → x10 → 240. Use arrows between each step. Box the final answer 240.",
    "checkpointPrompt": "Watch each step carefully before you try.",
    "pauseType": "none",
    "holdSec": 1.5,
    "expectedStudentResponse": "",
    "fallbackHint": "Remember: x5 = halve first, then x10.",
    "performanceTag": "core",
    "svgAnimation": []
}

guided_beat = {
    "beatId": "VM_G4_L6_A_GUIDED",
    "stepId": "VM_G4_L6_A",
    "exerciseGroup": "A",
    "subtopic": "Multiply by 5 - halve then x10",
    "sequence": 603,
    "cue": "guided",
    "boardMode": "steps",
    "teacherLine": "Your turn! 36 x 5. Half of 36 = 18. Now 18 x 10 = ? Type your answer.",
    "boardAction": "Show: 36 → half → 18 → x10 → blank. Student fills the blank.",
    "checkpointPrompt": "What is 18 x 10?",
    "pauseType": "student_response",
    "holdSec": 0.5,
    "expectedStudentResponse": "180",
    "fallbackHint": "18 x 10: just add a zero. Answer: 180.",
    "performanceTag": "core",
    "svgAnimation": []
}

screenplay = data["screenplay"]
new_screenplay = []
for beat in screenplay:
    new_screenplay.append(beat)
    if beat.get("beatId") == "VM_G4_L6_A_INTRO":
        new_screenplay.append(demo_beat)
        new_screenplay.append(guided_beat)

data["screenplay"] = new_screenplay

# ── 4. Save and verify ───────────────────────────────────────────────────────
with open(FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

with open(FILE, "r", encoding="utf-8") as f:
    verified = json.load(f)

print("=== L6 Enrichment Summary ===")
print(f"  text->short_answer conversions: {text_count_before}")
print(f"  Screenplay beats: {len(verified['screenplay'])}")
print(f"  Beat cues: {[b['cue'] for b in verified['screenplay']]}")
print()
total_q = 0
for group in verified["duolingoLessonArc"]["sessionFlow"]:
    n = len(group["exercises"])
    total_q += n
    types = [ex["questionType"] for ex in group["exercises"]]
    print(f"  Group {group['exerciseGroup']} ({group['subtopic'][:40]}): {n} questions | types: {types}")
print(f"  TOTAL questions: {total_q}")
print("  JSON valid: YES")
