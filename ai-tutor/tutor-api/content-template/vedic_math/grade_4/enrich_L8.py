"""
Enrichment script for VM_G4_L8_CRISS_CROSS_2DIG.json

Changes:
1. CREATE full screenplay array (intro, explain, demo, guided beats)
2. Bring every exercise group to 4-5 questions (currently 1-2 each)
3. Convert all "text" questionType to "short_answer"
"""

import json

FILE = r"C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L8_CRISS_CROSS_2DIG.json"

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
            "questionId": "VM_G4_L8_A_Q3",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "A",
            "subtopic": "Criss-cross intro",
            "skill": "identify steps",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "In criss-cross, Step 3 (left vertical) of 23 x 14 is:",
            "options": ["3x4=12", "2x4+3x1=11", "2x1=2", "2x1+1(carry)=3"],
            "correctIndex": 3,
            "expectedAnswer": "2x1+1(carry)=3",
            "hint": "Step 3 = tens x tens + carry from step 2.",
            "solution": "Step 3: tens x tens = 2x1=2, plus carry 1 from Step 2 = 3.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "The X pattern",
                "caption": "See the 3-step pattern: right vertical, cross, left vertical."
            }
        },
        {
            "questionId": "VM_G4_L8_A_Q4",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "A",
            "subtopic": "Criss-cross intro",
            "skill": "identify steps",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "For 31 x 22, what is Step 1 (units x units)?",
            "options": ["3x2=6", "1x2=2", "3x2+1x2=8", "1x1=1"],
            "correctIndex": 1,
            "expectedAnswer": "1x2=2",
            "hint": "Step 1: units digit of 31 is 1. Units digit of 22 is 2. 1x2=?",
            "solution": "Units of 31 = 1. Units of 22 = 2. 1x2=2. No carry.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "The X pattern",
                "caption": "See the 3-step pattern: right vertical, cross, left vertical."
            }
        }
    ],
    "B": [
        {
            "questionId": "VM_G4_L8_B_Q3",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "B",
            "subtopic": "Step 1 units",
            "skill": "criss-cross step 1",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "Step 1 of 43 x 26: what is 3 x 6?",
            "options": ["12", "15", "18", "21"],
            "correctIndex": 2,
            "expectedAnswer": "18",
            "hint": "Just multiply 3 and 6.",
            "solution": "3 x 6 = 18. Write 8, carry 1.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Step 1 units",
                "caption": "Start with units x units and carry if needed."
            }
        },
        {
            "questionId": "VM_G4_L8_B_Q4",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "B",
            "subtopic": "Step 1 units",
            "skill": "criss-cross step 1",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "Step 1 of 37 x 45: units x units = 7 x 5 = ?",
            "expectedAnswer": "35",
            "hint": "7 x 5 = ? Write 5, carry 3.",
            "solution": "7 x 5 = 35. Write 5, carry 3.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Step 1 units",
                "caption": "Start with units x units and carry if needed."
            }
        }
    ],
    "C": [
        {
            "questionId": "VM_G4_L8_C_Q3",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "C",
            "subtopic": "Step 2 cross",
            "skill": "criss-cross step 2",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "For 34 x 21 (no carry from Step 1): cross step = 3x1 + 4x2 = ?",
            "options": ["9", "10", "11", "12"],
            "correctIndex": 2,
            "expectedAnswer": "11",
            "hint": "3x1=3, 4x2=8. 3+8=?",
            "solution": "3x1=3, 4x2=8. 3+8=11. Write 1, carry 1.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Step 2 cross",
                "caption": "Add the two diagonal products and any carry."
            }
        },
        {
            "questionId": "VM_G4_L8_C_Q4",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "C",
            "subtopic": "Step 2 cross",
            "skill": "criss-cross step 2",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "For 13 x 21, cross step = 1x1 + 3x2 = ?",
            "expectedAnswer": "7",
            "hint": "1x1=1, 3x2=6. 1+6=?",
            "solution": "1x1=1, 3x2=6. 1+6=7.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Step 2 cross",
                "caption": "Add the two diagonal products and any carry."
            }
        }
    ],
    "D": [
        {
            "questionId": "VM_G4_L8_D_Q2",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "D",
            "subtopic": "Step 3 tens",
            "skill": "criss-cross step 3",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "31 x 22: Step 3 = 3x2 = ?",
            "options": ["5", "6", "7", "8"],
            "correctIndex": 1,
            "expectedAnswer": "6",
            "hint": "Tens of 31 is 3. Tens of 22 is 2. 3x2=?",
            "solution": "3 x 2 = 6. Full answer: 682.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Step 3 tens",
                "caption": "Finish with tens x tens and the final carry."
            }
        },
        {
            "questionId": "VM_G4_L8_D_Q3",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "D",
            "subtopic": "Step 3 tens",
            "skill": "criss-cross step 3",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "23 x 14: Step 3 = 2x1 + 1(carry from Step 2) = ?",
            "expectedAnswer": "3",
            "hint": "2x1=2. Add carry 1. 2+1=?",
            "solution": "2x1=2. Plus carry 1 = 3. Full answer: 322.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Step 3 tens",
                "caption": "Finish with tens x tens and the final carry."
            }
        },
        {
            "questionId": "VM_G4_L8_D_Q4",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "D",
            "subtopic": "Step 3 tens",
            "skill": "criss-cross step 3",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "12 x 34 full criss-cross: Step3 = 1x3 + ? (carry from Step2 which gives 10)",
            "options": ["3", "4", "5", "6"],
            "correctIndex": 1,
            "expectedAnswer": "4",
            "hint": "Step2: 1x4+2x3=10. Write 0 carry 1. Step3: 1x3+1=4.",
            "solution": "Step1: 2x4=8. Step2: 1x4+2x3=10, write 0 carry 1. Step3: 1x3+1=4. Answer: 408.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Step 3 tens",
                "caption": "Finish with tens x tens and the final carry."
            }
        }
    ],
    "E": [
        {
            "questionId": "VM_G4_L8_E_Q3",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "E",
            "subtopic": "Full criss-cross no carry",
            "skill": "2-digit criss-cross",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "21 x 43 = ?",
            "options": ["893", "900", "903", "923"],
            "correctIndex": 2,
            "expectedAnswer": "903",
            "hint": "Step1: 1x3=3. Step2: 2x3+1x4=10->0 carry1. Step3: 2x4+1=9.",
            "solution": "Step1=3. Step2=10->0 carry1. Step3=9. Answer: 903.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Full 2-digit x 2-digit",
                "caption": "Put all 3 steps together into one answer."
            }
        },
        {
            "questionId": "VM_G4_L8_E_Q4",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "E",
            "subtopic": "Full criss-cross no carry",
            "skill": "2-digit criss-cross",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "22 x 31 = ?",
            "expectedAnswer": "682",
            "hint": "Step1: 2x1=2. Step2: 2x1+2x3=8. Step3: 2x3=6.",
            "solution": "Step1=2. Step2=8. Step3=6. Answer: 682.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Full 2-digit x 2-digit",
                "caption": "Put all 3 steps together into one answer."
            }
        }
    ],
    "F": [
        {
            "questionId": "VM_G4_L8_F_Q2",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "F",
            "subtopic": "MCQ cross step",
            "skill": "identify cross step",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "For 41 x 23, the cross step = 4x3 + 1x2 = ?",
            "options": ["12", "14", "16", "18"],
            "correctIndex": 1,
            "expectedAnswer": "14",
            "hint": "4x3=12, 1x2=2. 12+2=?",
            "solution": "4x3=12, 1x2=2. 12+2=14.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Middle-step quiz",
                "caption": "Focus on the cross step before doing the full product."
            }
        },
        {
            "questionId": "VM_G4_L8_F_Q3",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "F",
            "subtopic": "MCQ cross step",
            "skill": "identify cross step",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "For 33 x 21, the cross step = 3x1 + 3x2 = ?",
            "expectedAnswer": "9",
            "hint": "3x1=3, 3x2=6. 3+6=?",
            "solution": "3x1=3, 3x2=6. Total=9.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Middle-step quiz",
                "caption": "Focus on the cross step before doing the full product."
            }
        }
    ],
    "G": [
        {
            "questionId": "VM_G4_L8_G_Q2",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "G",
            "subtopic": "Fill-the-step criss-cross",
            "skill": "criss-cross full steps",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "24 x 32 = ? (should match 32 x 24 = 768)",
            "expectedAnswer": "768",
            "hint": "Step1=4x2=8. Step2=2x2+4x3=16->6 carry1. Step3=2x3+1=7.",
            "solution": "Step1=8. Step2=16->6 carry1. Step3=7. Answer: 768.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Fill the steps",
                "caption": "Write each partial product in the correct order."
            }
        }
    ],
    "H": [
        {
            "questionId": "VM_G4_L8_H_Q3",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "H",
            "subtopic": "Speed criss-cross",
            "skill": "criss-cross speed",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "33 x 12 = ?",
            "options": ["386", "396", "406", "416"],
            "correctIndex": 1,
            "expectedAnswer": "396",
            "hint": "Step1=6, Step2=9, Step3=3. Answer: 396.",
            "solution": "3x2=6. 3x2+3x1=9. 3x1=3. Answer: 396.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Speed round",
                "caption": "Run the full 3-step pattern quickly and accurately."
            }
        },
        {
            "questionId": "VM_G4_L8_H_Q4",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "H",
            "subtopic": "Speed criss-cross",
            "skill": "criss-cross speed",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "21 x 43 = ?",
            "expectedAnswer": "903",
            "hint": "Step1=3, Step2=10->0 carry1, Step3=9.",
            "solution": "1x3=3. 2x3+1x4+0=10, write 0 carry1. 2x4+1=9. Answer: 903.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Speed round",
                "caption": "Run the full 3-step pattern quickly and accurately."
            }
        }
    ],
    "I": [
        {
            "questionId": "VM_G4_L8_I_Q3",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "I",
            "subtopic": "Criss-cross with carry",
            "skill": "carry handling",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "56 x 47 = ?",
            "options": ["2532", "2622", "2632", "2732"],
            "correctIndex": 2,
            "expectedAnswer": "2632",
            "hint": "Step1: 6x7=42 write 2 carry4. Step2: 5x7+6x4+4=63 write 3 carry6. Step3: 5x4+6=26.",
            "solution": "Step1: 42->2 carry4. Step2: 35+24+4=63->3 carry6. Step3: 20+6=26. Answer: 2632.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Carry challenge",
                "caption": "Manage carries correctly through all 3 steps."
            }
        },
        {
            "questionId": "VM_G4_L8_I_Q4",
            "chapterCode": "VM_G4_L8_CRISS_CROSS_2DIG",
            "exerciseGroup": "I",
            "subtopic": "Criss-cross with carry",
            "skill": "carry handling",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "67 x 45 = ?",
            "expectedAnswer": "3015",
            "hint": "Step1: 7x5=35 write5 carry3. Step2: 6x5+7x4+3=61 write1 carry6. Step3: 6x4+6=30.",
            "solution": "Step1: 35->5 carry3. Step2: 30+28+3=61->1 carry6. Step3: 24+6=30. Answer: 3015.",
            "visual": {
                "kind": "svg",
                "asset": "vm_criss_cross_2dig.svg",
                "title": "Carry challenge",
                "caption": "Manage carries correctly through all 3 steps."
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
        "beatId": "VM_G4_L8_A_INTRO",
        "stepId": "VM_G4_L8_A",
        "exerciseGroup": "A",
        "subtopic": "Pattern introduction - 3 steps of criss-cross",
        "sequence": 1,
        "cue": "intro",
        "boardMode": "svg",
        "teacherLine": "Welcome to the X-Factor! Urdhva-Tiryagbhyam is the Vedic sutra for criss-cross multiplication. It has exactly three steps: right, cross, and left - and those three steps give you ANY 2-digit times 2-digit answer!",
        "boardAction": "Draw 23 x 14 with an X crossing between the digits. Label: Right (3x4), Cross (2x4+3x1), Left (2x1).",
        "checkpointPrompt": "Listen and watch the pattern first.",
        "pauseType": "none",
        "holdSec": 0.6,
        "expectedStudentResponse": "",
        "fallbackHint": "Three steps, right to left: units vertical, cross diagonals, tens vertical.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L8_A_EXPLAIN",
        "stepId": "VM_G4_L8_A",
        "exerciseGroup": "A",
        "subtopic": "Pattern introduction - 3 steps of criss-cross",
        "sequence": 2,
        "cue": "explain",
        "boardMode": "svg",
        "teacherLine": "Step 1 = units x units (right vertical). Step 2 = tens x units + units x tens (the X cross). Step 3 = tens x tens (left vertical). Each step gives one part of the answer. Carry goes to the next step.",
        "boardAction": "Write the three steps in a column. Colour code: red for Step 1, blue for Step 2, green for Step 3. Show arrows for carry.",
        "checkpointPrompt": "For 21 x 32, what is the right-side step value?",
        "pauseType": "student_input",
        "holdSec": 3,
        "expectedStudentResponse": "2",
        "fallbackHint": "Units of 21 = 1. Units of 32 = 2. 1x2=2.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L8_A_DEMO",
        "stepId": "VM_G4_L8_A",
        "exerciseGroup": "A",
        "subtopic": "Pattern introduction - 3 steps of criss-cross",
        "sequence": 3,
        "cue": "demo",
        "boardMode": "svg",
        "teacherLine": "Watch the full demo: 23 x 14. Right: 3x4=12, write 2 carry 1. Middle: 2x4+3x1+1=12, write 2 carry 1. Left: 2x1+1=3. Answer: 322!",
        "boardAction": "Step-by-step animation: 23x14. Highlight each multiplication in sequence. Show carry bubbles. Assemble digits: 3|2|2=322. Box the answer.",
        "checkpointPrompt": "Watch every step before you try.",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Right to left: units product, cross product, tens product. Carries flow left.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L8_A_GUIDED",
        "stepId": "VM_G4_L8_A",
        "exerciseGroup": "A",
        "subtopic": "Pattern introduction - 3 steps of criss-cross",
        "sequence": 4,
        "cue": "guided",
        "boardMode": "svg",
        "teacherLine": "Your turn! 21 x 13. Right: 1x3=3. Middle: 2x3 + 1x1 = 6+1 = 7. Left: 2x1 = 2. What is the final answer?",
        "boardAction": "Show 21 x 13 with blanks. Step 1 filled: 3. Step 2 filled: 7. Step 3 filled: 2. Show assembled answer box.",
        "checkpointPrompt": "Read the digits: left|middle|right = ?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "273",
        "fallbackHint": "2|7|3 = 273.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L8_E_EXPLAIN",
        "stepId": "VM_G4_L8_E",
        "exerciseGroup": "E",
        "subtopic": "Full 2-digit x 2-digit, no carry",
        "sequence": 5,
        "cue": "explain",
        "boardMode": "svg",
        "teacherLine": "Now let us do the full thing - three steps in one sweep! For no-carry problems, the digits slot right in. 21x32: write 2, write 7, write 6. Answer: 672.",
        "boardAction": "Show 21x32 with Step1=2, Step2=7, Step3=6 appearing one by one. Assemble into 672. Underline no carry annotation.",
        "checkpointPrompt": "Full answer for 31 x 22?",
        "pauseType": "student_input",
        "holdSec": 4,
        "expectedStudentResponse": "682",
        "fallbackHint": "1x2=2. 3x2+1x2=8. 3x2=6. Answer: 682.",
        "performanceTag": "core",
        "svgAnimation": []
    },
    {
        "beatId": "VM_G4_L8_I_EXPLAIN",
        "stepId": "VM_G4_L8_I",
        "exerciseGroup": "I",
        "subtopic": "Challenge: 2-digit x 2-digit with carry",
        "sequence": 6,
        "cue": "explain",
        "boardMode": "svg",
        "teacherLine": "Final boss! 47 x 36. Step1: 7x6=42, write 2 carry 4. Step2: 4x6+7x3+4=55, write 5 carry 5. Step3: 4x3+5=17. Answer: 1692. Each step hands a carry to the next!",
        "boardAction": "Show 47 x 36 with carry bubbles flowing left. Highlight each carry in red. Assemble digits: 17|5|2 = 1692. Box answer.",
        "checkpointPrompt": "38 x 25 = ?",
        "pauseType": "student_input",
        "holdSec": 5,
        "expectedStudentResponse": "950",
        "fallbackHint": "Step1: 8x5=40->0 carry4. Step2: 3x5+8x2+4=35->5 carry3. Step3: 3x2+3=9. Answer: 950.",
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

print("=== L8 Enrichment Summary ===")
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
