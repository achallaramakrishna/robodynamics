"""
Enrichment script for VM_G4_L7_NEAR_100.json

Changes:
1. CREATE full screenplay array (intro, explain, demo, guided beats)
2. Bring every exercise group to 4-5 questions (currently 1-2 each)
3. Convert all "text" questionType to "short_answer"
"""

import json

FILE = r"C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L7_NEAR_100.json"

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
            "questionId": "VM_G4_L7_A_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "A",
            "subtopic": "Deviation from 100",
            "skill": "find deviation",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "What is the deviation of 95 from 100?",
            "options": ["-5", "5", "-95", "105"],
            "correctIndex": 0,
            "expectedAnswer": "-5",
            "hint": "95 is 5 below 100. That is a deficit.",
            "solution": "100 - 95 = 5. Since 95 < 100, deviation = -5.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Deviation from 100",
                "caption": "Check whether the number is below or above 100 and measure the gap."
            }
        },
        {
            "questionId": "VM_G4_L7_A_Q4",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "A",
            "subtopic": "Deviation from 100",
            "skill": "find deviation",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "What is the deviation of 106 from 100? (give a signed answer like +6)",
            "expectedAnswer": "+6",
            "hint": "106 is above 100. Surplus = 106 - 100.",
            "solution": "106 - 100 = 6. Surplus = +6.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Deviation from 100",
                "caption": "Check whether the number is below or above 100 and measure the gap."
            }
        },
        {
            "questionId": "VM_G4_L7_A_Q5",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "A",
            "subtopic": "Deviation from 100",
            "skill": "find deviation",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "98 is how far from 100?",
            "options": ["2 below", "2 above", "8 below", "8 above"],
            "correctIndex": 0,
            "expectedAnswer": "2 below",
            "hint": "100 - 98 = 2.",
            "solution": "100 - 98 = 2. 98 is 2 below 100, so deviation = -2.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Deviation from 100",
                "caption": "Check whether the number is below or above 100 and measure the gap."
            }
        }
    ],
    "B": [
        {
            "questionId": "VM_G4_L7_B_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "B",
            "subtopic": "Add near 100",
            "skill": "near-100 addition",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "99 + 96 = ?",
            "options": ["193", "194", "195", "196"],
            "correctIndex": 2,
            "expectedAnswer": "195",
            "hint": "99 deviation -1, 96 deviation -4. Start from 200.",
            "solution": "200 - 1 - 4 = 195.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Adding near 100",
                "caption": "Start from 200 and adjust by both deviations."
            }
        },
        {
            "questionId": "VM_G4_L7_B_Q4",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "B",
            "subtopic": "Add near 100",
            "skill": "near-100 addition",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "98 + 97 = ?",
            "expectedAnswer": "195",
            "hint": "98 deviation -2, 97 deviation -3. 200 - 2 - 3 = ?",
            "solution": "200 - 2 - 3 = 195.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Adding near 100",
                "caption": "Start from 200 and adjust by both deviations."
            }
        }
    ],
    "C": [
        {
            "questionId": "VM_G4_L7_C_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "C",
            "subtopic": "Subtract from 100",
            "skill": "All-From-9 Last-From-10",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "100 - 37 = ?",
            "expectedAnswer": "63",
            "hint": "9-3=6, 10-7=3.",
            "solution": "9-3=6, 10-7=3. Answer: 63.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Subtract from 100",
                "caption": "Use All-From-9 Last-From-10 for fast subtraction from 100."
            }
        },
        {
            "questionId": "VM_G4_L7_C_Q4",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "C",
            "subtopic": "Subtract from 100",
            "skill": "All-From-9 Last-From-10",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "100 - 76 = ?",
            "options": ["24", "26", "34", "36"],
            "correctIndex": 0,
            "expectedAnswer": "24",
            "hint": "9-7=2, 10-6=4.",
            "solution": "9-7=2, 10-6=4. Answer: 24.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Subtract from 100",
                "caption": "Use All-From-9 Last-From-10 for fast subtraction from 100."
            }
        }
    ],
    "D": [
        {
            "questionId": "VM_G4_L7_D_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "D",
            "subtopic": "Mixed near-100",
            "skill": "choose method",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "98 + 103 = ?",
            "expectedAnswer": "201",
            "hint": "98 deviation -2, 103 deviation +3. 200 + 3 - 2 = ?",
            "solution": "200 + 3 - 2 = 201.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Mixed near 100",
                "caption": "Choose addition or subtraction quickly from the situation."
            }
        },
        {
            "questionId": "VM_G4_L7_D_Q4",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "D",
            "subtopic": "Mixed near-100",
            "skill": "choose method",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "100 - 84 = ?",
            "options": ["16", "17", "18", "19"],
            "correctIndex": 0,
            "expectedAnswer": "16",
            "hint": "9-8=1, 10-4=6.",
            "solution": "9-8=1, 10-4=6. Answer: 16.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Mixed near 100",
                "caption": "Choose addition or subtraction quickly from the situation."
            }
        }
    ],
    "E": [
        {
            "questionId": "VM_G4_L7_E_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "E",
            "subtopic": "MCQ deviation",
            "skill": "near-100 computation",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "96 + 107 = ?",
            "expectedAnswer": "203",
            "hint": "96 deviation -4, 107 deviation +7. 200 - 4 + 7 = ?",
            "solution": "200 - 4 + 7 = 203.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Spot the correct answer",
                "caption": "Use the deviation method mentally to eliminate wrong options."
            }
        },
        {
            "questionId": "VM_G4_L7_E_Q4",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "E",
            "subtopic": "MCQ deviation",
            "skill": "near-100 computation",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "102 + 101 = ?",
            "options": ["201", "202", "203", "204"],
            "correctIndex": 2,
            "expectedAnswer": "203",
            "hint": "+2 and +1. 200 + 3 = ?",
            "solution": "200 + 2 + 1 = 203.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Spot the correct answer",
                "caption": "Use the deviation method mentally to eliminate wrong options."
            }
        }
    ],
    "F": [
        {
            "questionId": "VM_G4_L7_F_Q2",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "F",
            "subtopic": "Fill-the-step near-100",
            "skill": "deviation addition steps",
            "difficulty": "medium",
            "type": "guided",
            "questionType": "fill_step",
            "questionText": "Add 99 + 96 step by step using the deviation method.",
            "steps": [
                {"label": "Deviation of 99 from 100", "answer": "-1", "hint": "100-99=1, it is below 100"},
                {"label": "Deviation of 96 from 100", "answer": "-4", "hint": "100-96=4, it is below 100"},
                {"label": "Sum of deviations (-1)+(-4)", "answer": "-5", "hint": "Add the two deficits"},
                {"label": "Final: 200 + (-5)", "answer": "195", "hint": "200 - 5 = ?"}
            ],
            "expectedAnswer": "195",
            "hint": "Start from 200. Subtract both deficits.",
            "solution": "Deviations: -1 and -4. 200 - 1 - 4 = 195.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Step-by-step near 100",
                "caption": "Write both deviations, combine them, and adjust from 200."
            }
        },
        {
            "questionId": "VM_G4_L7_F_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "F",
            "subtopic": "Fill-the-step near-100",
            "skill": "deviation addition steps",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "94 + 103 = ?",
            "expectedAnswer": "197",
            "hint": "94 deviation -6, 103 deviation +3. 200 - 6 + 3 = ?",
            "solution": "200 - 6 + 3 = 197.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Step-by-step near 100",
                "caption": "Write both deviations, combine them, and adjust from 200."
            }
        }
    ],
    "G": [
        {
            "questionId": "VM_G4_L7_G_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "G",
            "subtopic": "Word problem near 100",
            "skill": "apply near-100",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "A school planted 97 trees on Monday and 96 on Tuesday. Total trees planted = ?",
            "options": ["191", "192", "193", "194"],
            "correctIndex": 2,
            "expectedAnswer": "193",
            "hint": "Both near 100. Deviations: -3 and -4.",
            "solution": "200 - 3 - 4 = 193.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Near 100 word problems",
                "caption": "Use the same deviation trick in scores and shopping totals."
            }
        },
        {
            "questionId": "VM_G4_L7_G_Q4",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "G",
            "subtopic": "Word problem near 100",
            "skill": "apply near-100",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "A cricket team scored 103 in the first innings and 98 in the second. Total runs = ?",
            "expectedAnswer": "201",
            "hint": "+3 and -2. Start from 200.",
            "solution": "200 + 3 - 2 = 201.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Near 100 word problems",
                "caption": "Use the same deviation trick in scores and shopping totals."
            }
        }
    ],
    "H": [
        {
            "questionId": "VM_G4_L7_H_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "H",
            "subtopic": "Speed drill",
            "skill": "near-100 speed",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "107 + 95 = ?",
            "expectedAnswer": "202",
            "hint": "+7 and -5. 200 + 7 - 5 = ?",
            "solution": "200 + 7 - 5 = 202.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Speed drill",
                "caption": "Apply the near-100 shortcut in one quick mental pass."
            }
        },
        {
            "questionId": "VM_G4_L7_H_Q4",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "H",
            "subtopic": "Speed drill",
            "skill": "near-100 speed",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "99 + 98 = ?",
            "options": ["195", "196", "197", "198"],
            "correctIndex": 2,
            "expectedAnswer": "197",
            "hint": "-1 and -2. 200 - 3 = ?",
            "solution": "200 - 1 - 2 = 197.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Speed drill",
                "caption": "Apply the near-100 shortcut in one quick mental pass."
            }
        }
    ],
    "I": [
        {
            "questionId": "VM_G4_L7_I_Q3",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "I",
            "subtopic": "Near 1000",
            "skill": "extend to base 1000",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "999 + 996 = ?",
            "options": ["1993", "1994", "1995", "1996"],
            "correctIndex": 2,
            "expectedAnswer": "1995",
            "hint": "Near 1000. Deviations -1 and -4. 2000 - 5 = ?",
            "solution": "2000 - 1 - 4 = 1995.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Near 1000 extension",
                "caption": "The same idea works with deviations from 1000."
            }
        },
        {
            "questionId": "VM_G4_L7_I_Q4",
            "chapterCode": "VM_G4_L7_NEAR_100",
            "exerciseGroup": "I",
            "subtopic": "Near 1000",
            "skill": "extend to base 1000",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "1000 - 287 = ?",
            "expectedAnswer": "713",
            "hint": "All-From-9: 9-2=7, 9-8=1. Last-From-10: 10-7=3.",
            "solution": "9-2=7, 9-8=1, 10-7=3. Answer: 713.",
            "visual": {
                "kind": "svg",
                "asset": "vm_near_100.svg",
                "title": "Near 1000 extension",
                "caption": "The same idea works with deviations from 1000."
            }
        }
    ]
}

for group in session_flow:
    grp = group["exerciseGroup"]
    if grp in new_questions:
        group["exercises"].extend(new_questions[grp])

# ── 3. CREATE full screenplay array ─────────────────────────────────────────
screenplay = [
    {
        "beatId": "VM_G4_L7_A_INTRO",
        "stepId": "VM_G4_L7_A",
        "exerciseGroup": "A",
        "subtopic": "What is deviation from 100?",
        "sequence": 1,
        "cue": "intro",
        "boardMode": "svg",
        "teacherLine": "Welcome! Today we work near 100. Every number near 100 has a small gap - either a bit below or a bit above. That gap is its deviation and it is our secret weapon!",
        "boardAction": "Draw a number line with 100 at centre. Mark 97 as 3 below and 103 as 3 above with arrows showing the gap.",
        "checkpointPrompt": "Listen and watch the pattern first.",
        "pauseType": "none",
        "holdSec": 0.6,
        "expectedStudentResponse": "",
        "fallbackHint": "Think of 100 as home base. How far away is the number?",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L7_A_EXPLAIN",
        "stepId": "VM_G4_L7_A",
        "exerciseGroup": "A",
        "subtopic": "What is deviation from 100?",
        "sequence": 2,
        "cue": "explain",
        "boardMode": "svg",
        "teacherLine": "97 is 3 below 100, so its deviation is -3. 103 is 3 above 100, so its deviation is +3. The sign tells us which side of 100 we are on!",
        "boardAction": "Show: 97 → 100-97=3 → deviation=-3. Then 103 → 103-100=3 → deviation=+3. Highlight minus sign and plus sign in different colours.",
        "checkpointPrompt": "What is the deviation of 95 from 100?",
        "pauseType": "student_input",
        "holdSec": 3,
        "expectedStudentResponse": "-5",
        "fallbackHint": "100 - 95 = 5. Since 95 is below, the deviation is -5.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L7_A_DEMO",
        "stepId": "VM_G4_L7_A",
        "exerciseGroup": "A",
        "subtopic": "What is deviation from 100?",
        "sequence": 3,
        "cue": "demo",
        "boardMode": "svg",
        "teacherLine": "Watch! 98 + 97. Deviations are -2 and -3. Base sum: 200. Total deviation: -5. Answer: 200 - 5 = 195. No big addition needed!",
        "boardAction": "Show side by side: 98 (dev -2) and 97 (dev -3). Arrow from 200. Subtract -5. Box answer 195.",
        "checkpointPrompt": "Watch how deviations replace the actual addition.",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Find each deviation from 100, add them to 200.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L7_A_GUIDED",
        "stepId": "VM_G4_L7_A",
        "exerciseGroup": "A",
        "subtopic": "What is deviation from 100?",
        "sequence": 4,
        "cue": "guided",
        "boardMode": "svg",
        "teacherLine": "Your turn! 99 + 96. Deviations from 100 are -1 and -4. Start from 200. What is the answer?",
        "boardAction": "Show: 99 (dev -1) and 96 (dev -4). Base 200. Leave answer box blank for student.",
        "checkpointPrompt": "What is 200 minus 1 minus 4?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "195",
        "fallbackHint": "200 - 1 - 4 = 195.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L7_B_EXPLAIN",
        "stepId": "VM_G4_L7_B",
        "exerciseGroup": "B",
        "subtopic": "Add two numbers near 100",
        "sequence": 5,
        "cue": "explain",
        "boardMode": "svg",
        "teacherLine": "For any two numbers near 100, just start from 200 and adjust by both deviations. If both are below, you subtract both gaps. If one is above, you add that gap!",
        "boardAction": "Table: 96+98 -> -4 and -2 -> 200-6=194. 102+99 -> +2 and -1 -> 200+1=201. Show both examples.",
        "checkpointPrompt": "Add 97 + 95.",
        "pauseType": "student_input",
        "holdSec": 4,
        "expectedStudentResponse": "192",
        "fallbackHint": "-3 and -5. 200 - 8 = 192.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L7_G_EXPLAIN",
        "stepId": "VM_G4_L7_G",
        "exerciseGroup": "G",
        "subtopic": "Word problems near 100",
        "sequence": 6,
        "cue": "explain",
        "boardMode": "svg",
        "teacherLine": "Real life time! Scores, prices, distances - if the numbers sit close to 100, use the deviation trick and solve in one line!",
        "boardAction": "Show: Riya scores 97 + 98 = ? Deviations -3 and -2. 200-5=195. Box the answer 195.",
        "checkpointPrompt": "A book costs Rs 97 and a pen costs Rs 96. Total?",
        "pauseType": "student_input",
        "holdSec": 4,
        "expectedStudentResponse": "193",
        "fallbackHint": "-3 and -4. 200 - 7 = 193.",
        "performanceTag": "core",
        "svgAnimation": []
    }
]

data["screenplay"] = screenplay

# ── 4. Save and verify ───────────────────────────────────────────────────────
with open(FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

with open(FILE, "r", encoding="utf-8") as f:
    verified = json.load(f)

print("=== L7 Enrichment Summary ===")
print(f"  text->short_answer conversions: {text_count_before}")
print(f"  Screenplay beats created: {len(verified['screenplay'])}")
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
