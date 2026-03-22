"""
Enrichment script for VM_G4_L2_TABLES_11_TO_19.json
- Adds demo + guided beats to screenplay (after intro/explain for group A, and explain for groups B-I)
- Converts text type questions to short_answer
- Adds 2-3 new short_answer questions per group
Target: 38-42 total questions
"""
import json, copy

FILE = "VM_G4_L2_TABLES_11_TO_19.json"

with open(FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

# ─── 1. SCREENPLAY: add demo + guided beats ──────────────────────────────────

BEATS_TO_ADD = [
    # Group A — after explain (sequence 202)
    {
        "beatId": "VM_G4_L2_A_DEMO",
        "stepId": "VM_G4_L2_A",
        "exerciseGroup": "A",
        "subtopic": "Table of 11 — digit-sum pattern",
        "sequence": 203,
        "cue": "demo",
        "boardMode": "svg",
        "teacherLine": "Watch me: 23 × 11. Keep the outer digits — 2 on the left, 3 on the right. Middle = 2+3 = 5. So the answer is 2 | 5 | 3 = 253. Simple!",
        "boardAction": "Write 23 × 11. Draw blank: 2 _ 3. Reveal sum 2+3=5. Fill in 253. Box the answer.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Outer digits stay. Their sum goes in the middle.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "eleven_trick.svg",
            "title": "The Eleven Trick — Demo",
            "caption": "Watch: 23 × 11 = 2 | 2+3 | 3 = 253."
        }
    },
    {
        "beatId": "VM_G4_L2_A_GUIDED",
        "stepId": "VM_G4_L2_A",
        "exerciseGroup": "A",
        "subtopic": "Table of 11 — digit-sum pattern",
        "sequence": 204,
        "cue": "guided",
        "boardMode": "svg",
        "teacherLine": "Your turn — let's do it together! 34 × 11. Outer digits: 3 and 4. What goes in the middle? 3+4 = ?",
        "boardAction": "Write 34 × 11. Draw blank: 3 _ 4. Wait for student. Reveal 7. Write 374.",
        "checkpointPrompt": "34 × 11 = 3 _ 4. What is the middle digit?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "7",
        "fallbackHint": "Add 3 + 4 to get the middle digit.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "eleven_trick.svg",
            "title": "Guided: 34 × 11",
            "caption": "Fill in 3+4 = ? in the middle."
        }
    },
    # Group B — after explain (no dedicated explain beat exists; add after A_GUIDED)
    {
        "beatId": "VM_G4_L2_B_DEMO",
        "stepId": "VM_G4_L2_B",
        "exerciseGroup": "B",
        "subtopic": "Table of 12 — progressive addition",
        "sequence": 301,
        "cue": "demo",
        "boardMode": "steps",
        "teacherLine": "Watch the table of 12 build: 12, 24, 36, 48, 60, 72, 84, 96, 108, 120. Each row is just the previous row plus 12. That is the Ekadhikena sutra — one more each time!",
        "boardAction": "Write chain: 12 +12→ 24 +12→ 36 ... +12→ 120. Highlight each +12 arrow.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Each step is just adding 12 one more time.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Table of 12 chain — Demo",
            "caption": "Each row adds 12 to the one before."
        }
    },
    {
        "beatId": "VM_G4_L2_B_GUIDED",
        "stepId": "VM_G4_L2_B",
        "exerciseGroup": "B",
        "subtopic": "Table of 12 — progressive addition",
        "sequence": 302,
        "cue": "guided",
        "boardMode": "steps",
        "teacherLine": "Let us do one together. We know 12 × 5 = 60. What is 12 × 6? Just add 12 more to 60.",
        "boardAction": "Show 12×5=60 on board. Write +12 arrow. Wait for student. Reveal 72.",
        "checkpointPrompt": "12 × 6 = 60 + 12 = ?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "72",
        "fallbackHint": "60 + 12 = 72.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Guided: 12 × 6",
            "caption": "Add 12 to 12×5=60 to find 12×6."
        }
    },
    # Group C
    {
        "beatId": "VM_G4_L2_C_DEMO",
        "stepId": "VM_G4_L2_C",
        "exerciseGroup": "C",
        "subtopic": "Tables of 13, 14 and 15",
        "sequence": 401,
        "cue": "demo",
        "boardMode": "steps",
        "teacherLine": "Same trick for 13. Watch: 13, 26, 39, 52, 65, 78. Each step adds 13. So 13 × 6 = 78. And for 15: 15, 30, 45, 60, 75. So 15 × 5 = 75.",
        "boardAction": "Show two short chains side by side: 13 chain (6 rows) and 15 chain (5 rows) with +13 and +15 labels.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Count the rows and add the table number each time.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Tables 13 & 15 chains — Demo",
            "caption": "Count steps and add the same number each time."
        }
    },
    {
        "beatId": "VM_G4_L2_C_GUIDED",
        "stepId": "VM_G4_L2_C",
        "exerciseGroup": "C",
        "subtopic": "Tables of 13, 14 and 15",
        "sequence": 402,
        "cue": "guided",
        "boardMode": "steps",
        "teacherLine": "Together: 14 × 4. Start from 0 and add 14 four times. 14, 28, 42, ___ ? What is the last step?",
        "boardAction": "Write chain: 14 → 28 → 42 → ___. Wait for student. Reveal 56.",
        "checkpointPrompt": "14, 28, 42, ___ = 14 × 4?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "56",
        "fallbackHint": "42 + 14 = 56.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Guided: 14 × 4",
            "caption": "Complete the last step: 42 + 14 = ?"
        }
    },
    # Group D
    {
        "beatId": "VM_G4_L2_D_DEMO",
        "stepId": "VM_G4_L2_D",
        "exerciseGroup": "D",
        "subtopic": "Tables of 16, 17, 18 and 19",
        "sequence": 501,
        "cue": "demo",
        "boardMode": "steps",
        "teacherLine": "Bigger step, same trick. Watch 17: 17, 34, 51, 68, 85. So 17 × 5 = 85. And 19: 19, 38, 57, 76, 95. So 19 × 5 = 95. The chain always works!",
        "boardAction": "Show 17 chain and 19 chain side by side, five rows each, with +17 and +19 labels.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Just keep adding the same number and count the steps.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Tables 17 & 19 chains — Demo",
            "caption": "Bigger steps, same Ekadhikena pattern."
        }
    },
    {
        "beatId": "VM_G4_L2_D_GUIDED",
        "stepId": "VM_G4_L2_D",
        "exerciseGroup": "D",
        "subtopic": "Tables of 16, 17, 18 and 19",
        "sequence": 502,
        "cue": "guided",
        "boardMode": "steps",
        "teacherLine": "Together: 18 × 4. Chain: 18, 36, 54, ___. Add 18 one more time. What is the answer?",
        "boardAction": "Write chain: 18 → 36 → 54 → ___. Wait for student. Reveal 72.",
        "checkpointPrompt": "18, 36, 54, ___ = 18 × 4?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "72",
        "fallbackHint": "54 + 18 = 72.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Guided: 18 × 4",
            "caption": "Complete the last step: 54 + 18 = ?"
        }
    },
    # Group E
    {
        "beatId": "VM_G4_L2_E_DEMO",
        "stepId": "VM_G4_L2_E",
        "exerciseGroup": "E",
        "subtopic": "Spot the product — MCQ",
        "sequence": 601,
        "cue": "demo",
        "boardMode": "steps",
        "teacherLine": "Watch me spot it. 14 × 6: chain 14, 28, 42, 56, 70, 84. The answer is 84. If the options were 80, 82, 84, 86 — I circle 84 immediately!",
        "boardAction": "Show four options for 14×6: 80, 82, 84, 86. Build chain on board. Circle 84.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Build the chain to the row you need, then match with the options.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Spot the product — Demo",
            "caption": "Build the chain and match with the choices."
        }
    },
    {
        "beatId": "VM_G4_L2_E_GUIDED",
        "stepId": "VM_G4_L2_E",
        "exerciseGroup": "E",
        "subtopic": "Spot the product — MCQ",
        "sequence": 602,
        "cue": "guided",
        "boardMode": "steps",
        "teacherLine": "Together now: 16 × 4. Options: 60, 62, 64, 66. Build the chain: 16, 32, 48, ___. Which option is correct?",
        "boardAction": "Write chain: 16 → 32 → 48 → ___. Options shown. Wait. Reveal 64.",
        "checkpointPrompt": "16 × 4 = 16, 32, 48, ___ — which option?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "64",
        "fallbackHint": "48 + 16 = 64.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Guided: Spot 16 × 4",
            "caption": "Complete the chain and pick the right option."
        }
    },
    # Group F
    {
        "beatId": "VM_G4_L2_F_DEMO",
        "stepId": "VM_G4_L2_F",
        "exerciseGroup": "F",
        "subtopic": "Fill-step: ×11 with carry",
        "sequence": 603,
        "cue": "demo",
        "boardMode": "svg",
        "teacherLine": "Watch the carry. 11 × 47: digit sum = 4+7 = 11. Middle digit = 1 (units of 11). Carry 1 to the left: 4+1 = 5. Answer: 517. The carry is just like normal addition!",
        "boardAction": "Show 11×47: write 4+7=11. Arrow to middle → 1. Carry arrow to left 4 → 5. Write 517.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Middle = units digit of the sum. Carry 1 to the left.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "eleven_trick.svg",
            "title": "Eleven Trick carry — Demo",
            "caption": "4+7=11: middle=1, carry 1 to left → 517."
        }
    },
    {
        "beatId": "VM_G4_L2_F_GUIDED",
        "stepId": "VM_G4_L2_F",
        "exerciseGroup": "F",
        "subtopic": "Fill-step: ×11 with carry",
        "sequence": 604,
        "cue": "guided",
        "boardMode": "svg",
        "teacherLine": "Together: 11 × 36. Digit sum = 3+6 = 9. Is there a carry? No — 9 is less than 10. So answer is 3 | 9 | 6 = 396. Try the next one yourself!",
        "boardAction": "Write 36. Show 3+6=9. No carry arrow. Write 396.",
        "checkpointPrompt": "11 × 36: sum = 3+6 = ?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "9",
        "fallbackHint": "3+6=9, no carry needed.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "eleven_trick.svg",
            "title": "Guided: 11 × 36",
            "caption": "Sum 3+6=9, no carry. Answer: 396."
        }
    },
    # Group G
    {
        "beatId": "VM_G4_L2_G_DEMO",
        "stepId": "VM_G4_L2_G",
        "exerciseGroup": "G",
        "subtopic": "Mixed tables 11–19",
        "sequence": 701,
        "cue": "demo",
        "boardMode": "steps",
        "teacherLine": "Mixed bag — pick the best method. 11×45: pattern gives 4|9|5 = 495. 13×7: chain 13,26,39,52,65,78,91. Each method fits its table.",
        "boardAction": "Show 11×45 with digit-sum method and 13×7 with chain. Label which method used for each.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Use digit-sum pattern for ×11. Use chain for others.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Mixed tables — Demo",
            "caption": "Two methods shown — choose the fastest for each table."
        }
    },
    {
        "beatId": "VM_G4_L2_G_GUIDED",
        "stepId": "VM_G4_L2_G",
        "exerciseGroup": "G",
        "subtopic": "Mixed tables 11–19",
        "sequence": 702,
        "cue": "guided",
        "boardMode": "steps",
        "teacherLine": "Together: 12 × 8. Use the chain: 12, 24, 36, 48, 60, 72, 84, ___. What is 12 × 8?",
        "boardAction": "Show chain 12→24→36→...→84→___. Wait. Reveal 96.",
        "checkpointPrompt": "12 × 8 using chain = ?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "96",
        "fallbackHint": "84 + 12 = 96.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Guided: 12 × 8",
            "caption": "Complete the last step in the chain."
        }
    },
    # Group H
    {
        "beatId": "VM_G4_L2_H_DEMO",
        "stepId": "VM_G4_L2_H",
        "exerciseGroup": "H",
        "subtopic": "Speed drill — tables race",
        "sequence": 801,
        "cue": "demo",
        "boardMode": "steps",
        "teacherLine": "Speed round! I will answer 11×55 in one look: 5+5=10, middle=0, carry 1 to left 5 → 6. Answer 605. Done in under 3 seconds!",
        "boardAction": "Flash 11×55. Show working in 3 quick steps. Reveal 605 with a star.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "The carry rule works even at speed.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Speed drill — Demo",
            "caption": "11×55 = 605 solved in one quick pass."
        }
    },
    {
        "beatId": "VM_G4_L2_H_GUIDED",
        "stepId": "VM_G4_L2_H",
        "exerciseGroup": "H",
        "subtopic": "Speed drill — tables race",
        "sequence": 802,
        "cue": "guided",
        "boardMode": "steps",
        "teacherLine": "Now fast together: 11 × 72. Outer digits 7 and 2. Sum = 7+2 = ?",
        "boardAction": "Write 11×72. Blank 7 _ 2. Wait for sum. Reveal 9. Write 792.",
        "checkpointPrompt": "11 × 72: middle = 7+2 = ?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "9",
        "fallbackHint": "7+2=9, no carry. Answer: 792.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "vm_tables_11_19.svg",
            "title": "Guided speed: 11 × 72",
            "caption": "7+2=9, no carry. Answer: 792."
        }
    },
    # Group I
    {
        "beatId": "VM_G4_L2_I_DEMO",
        "stepId": "VM_G4_L2_I",
        "exerciseGroup": "I",
        "subtopic": "Challenge: 3-digit × 11",
        "sequence": 901,
        "cue": "demo",
        "boardMode": "svg",
        "teacherLine": "Watch: 11 × 123. Right digit stays: 3. Next pair: 2+3=5. Next pair: 1+2=3. Left digit stays: 1. Read left to right: 1 | 3 | 5 | 3 = 1353!",
        "boardAction": "Write 123. Add adjacent pair arrows: 1+2=3, 2+3=5. Surround: 1|3|5|3=1353.",
        "checkpointPrompt": "",
        "pauseType": "none",
        "holdSec": 1.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Work from right to left for each adjacent pair.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "eleven_trick.svg",
            "title": "3-digit × 11 — Demo",
            "caption": "11 × 123 = 1|3|5|3 = 1353."
        }
    },
    {
        "beatId": "VM_G4_L2_I_GUIDED",
        "stepId": "VM_G4_L2_I",
        "exerciseGroup": "I",
        "subtopic": "Challenge: 3-digit × 11",
        "sequence": 902,
        "cue": "guided",
        "boardMode": "svg",
        "teacherLine": "Together: 11 × 231. Right digit = 1. Next pair: 3+1 = 4. Next pair: 2+3 = 5. Left digit = 2. Answer = 2 | 5 | 4 | 1 = 2541. What is the second inner pair: 2+3 = ?",
        "boardAction": "Write 231. Show pair arrows. Blank the 2+3 step. Wait. Reveal 5. Write 2541.",
        "checkpointPrompt": "11 × 231: pair 2+3 = ?",
        "pauseType": "student_response",
        "holdSec": 0.5,
        "expectedStudentResponse": "5",
        "fallbackHint": "2+3=5. Answer: 2541.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [],
        "visual": {
            "kind": "svg",
            "asset": "eleven_trick.svg",
            "title": "Guided: 11 × 231",
            "caption": "2+3 = 5 goes in the second-inner slot."
        }
    },
]

# Insert new beats into screenplay
screenplay = data["screenplay"]

# Map each beat to insert after (by beatId of the beat it should follow)
INSERTION_MAP = {
    "VM_G4_L2_A_EXPLAIN": ["VM_G4_L2_A_DEMO", "VM_G4_L2_A_GUIDED"],
    "VM_G4_L2_A_GUIDED": ["VM_G4_L2_B_DEMO", "VM_G4_L2_B_GUIDED",
                            "VM_G4_L2_C_DEMO", "VM_G4_L2_C_GUIDED",
                            "VM_G4_L2_D_DEMO", "VM_G4_L2_D_GUIDED",
                            "VM_G4_L2_E_DEMO", "VM_G4_L2_E_GUIDED",
                            "VM_G4_L2_F_DEMO", "VM_G4_L2_F_GUIDED",
                            "VM_G4_L2_G_DEMO", "VM_G4_L2_G_GUIDED",
                            "VM_G4_L2_H_DEMO", "VM_G4_L2_H_GUIDED",
                            "VM_G4_L2_I_DEMO", "VM_G4_L2_I_GUIDED"],
    "VM_G4_L2_F_EXPLAIN": [],  # handled above
}

beats_by_id = {b["beatId"]: b for b in BEATS_TO_ADD}

# Build new screenplay in correct order
existing_ids = [b["beatId"] for b in screenplay]

new_screenplay = list(screenplay)  # copy

def insert_after(sp, after_id, new_beats):
    idx = next((i for i, b in enumerate(sp) if b["beatId"] == after_id), None)
    if idx is None:
        sp.extend(new_beats)
    else:
        for offset, nb in enumerate(new_beats):
            sp.insert(idx + 1 + offset, nb)

# Add A demo+guided after A_EXPLAIN
a_demo = beats_by_id["VM_G4_L2_A_DEMO"]
a_guided = beats_by_id["VM_G4_L2_A_GUIDED"]
insert_after(new_screenplay, "VM_G4_L2_A_EXPLAIN", [a_demo, a_guided])

# After A_GUIDED, insert all remaining groups' demo+guided in order
group_pairs = [
    ("VM_G4_L2_B_DEMO", "VM_G4_L2_B_GUIDED"),
    ("VM_G4_L2_C_DEMO", "VM_G4_L2_C_GUIDED"),
    ("VM_G4_L2_D_DEMO", "VM_G4_L2_D_GUIDED"),
    ("VM_G4_L2_E_DEMO", "VM_G4_L2_E_GUIDED"),
    ("VM_G4_L2_F_DEMO", "VM_G4_L2_F_GUIDED"),
    ("VM_G4_L2_G_DEMO", "VM_G4_L2_G_GUIDED"),
    ("VM_G4_L2_H_DEMO", "VM_G4_L2_H_GUIDED"),
    ("VM_G4_L2_I_DEMO", "VM_G4_L2_I_GUIDED"),
]

# Insert F_DEMO/GUIDED after F_EXPLAIN, others append at end grouped by exercise
insert_after(new_screenplay, "VM_G4_L2_F_EXPLAIN", [beats_by_id["VM_G4_L2_F_DEMO"], beats_by_id["VM_G4_L2_F_GUIDED"]])

# Append remaining B,C,D,E,G,H,I after I_GUIDED position (end)
remaining_pairs = [p for p in group_pairs if p[0] not in ("VM_G4_L2_F_DEMO",)]
for demo_id, guided_id in remaining_pairs:
    new_screenplay.append(beats_by_id[demo_id])
    new_screenplay.append(beats_by_id[guided_id])

data["screenplay"] = new_screenplay

# ─── 2. SESSION FLOW: add questions ──────────────────────────────────────────

NEW_QUESTIONS = {
    "A": [
        {
            "questionId": "VM_G4_L2_A_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "A",
            "subtopic": "Table of 11 — digit-sum pattern",
            "skill": "table of 11 — digit sum",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "11 × 52 = ?",
            "expectedAnswer": "572",
            "hint": "Outer digits 5 and 2. Sum = 5+2 = 7. Write 572.",
            "solution": "5+2=7. Answer: 572.",
            "visual": {"kind": "svg", "asset": "eleven_trick.svg",
                       "title": "The Eleven Trick", "caption": "Keep outer digits, place sum in middle."}
        },
        {
            "questionId": "VM_G4_L2_A_Q5",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "A",
            "subtopic": "Table of 11 — digit-sum pattern",
            "skill": "table of 11 — digit sum",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "11 × 13 = ?",
            "expectedAnswer": "143",
            "hint": "Outer digits 1 and 3. Sum = 1+3 = 4. Write 143.",
            "solution": "1+3=4. Answer: 143.",
            "visual": {"kind": "svg", "asset": "eleven_trick.svg",
                       "title": "The Eleven Trick", "caption": "Keep outer digits, place sum in middle."}
        },
    ],
    "B": [
        {
            "questionId": "VM_G4_L2_B_Q3",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "B",
            "subtopic": "Table of 12 — progressive addition",
            "skill": "table of 12",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "12 × 6 = ?",
            "expectedAnswer": "72",
            "hint": "12×5=60. Add 12: 72.",
            "solution": "60+12=72.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Table of 12 chain", "caption": "Add 12 each time."}
        },
        {
            "questionId": "VM_G4_L2_B_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "B",
            "subtopic": "Table of 12 — progressive addition",
            "skill": "table of 12",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "12 × 8 = ?",
            "expectedAnswer": "96",
            "hint": "12×7=84. Add 12: 96.",
            "solution": "84+12=96.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Table of 12 chain", "caption": "Add 12 each time."}
        },
        {
            "questionId": "VM_G4_L2_B_Q5",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "B",
            "subtopic": "Table of 12 — progressive addition",
            "skill": "table of 12",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "12 × 10 = ?",
            "expectedAnswer": "120",
            "hint": "12×9=108. Add 12: 120.",
            "solution": "108+12=120.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Table of 12 chain", "caption": "Add 12 each time."}
        },
    ],
    "C": [
        {
            "questionId": "VM_G4_L2_C_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "C",
            "subtopic": "Tables of 13, 14 and 15",
            "skill": "tables 13-15",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "13 × 5 = ?",
            "expectedAnswer": "65",
            "hint": "13×4=52. Add 13: 65.",
            "solution": "52+13=65.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Tables 13 to 15", "caption": "Each table grows by the same number every row."}
        },
        {
            "questionId": "VM_G4_L2_C_Q5",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "C",
            "subtopic": "Tables of 13, 14 and 15",
            "skill": "tables 13-15",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "15 × 4 = ?",
            "expectedAnswer": "60",
            "hint": "15×3=45. Add 15: 60.",
            "solution": "45+15=60.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Tables 13 to 15", "caption": "Each table grows by the same number every row."}
        },
    ],
    "D": [
        {
            "questionId": "VM_G4_L2_D_Q3",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "D",
            "subtopic": "Tables of 16, 17, 18 and 19",
            "skill": "tables 16-19",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "18 × 4 = ?",
            "expectedAnswer": "72",
            "hint": "18×3=54. Add 18: 72.",
            "solution": "54+18=72.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Tables 16 to 19", "caption": "The same chain method works for bigger teen tables."}
        },
        {
            "questionId": "VM_G4_L2_D_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "D",
            "subtopic": "Tables of 16, 17, 18 and 19",
            "skill": "tables 16-19",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "17 × 6 = ?",
            "expectedAnswer": "102",
            "hint": "17×5=85. Add 17: 102.",
            "solution": "85+17=102.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Tables 16 to 19", "caption": "The same chain method works for bigger teen tables."}
        },
        {
            "questionId": "VM_G4_L2_D_Q5",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "D",
            "subtopic": "Tables of 16, 17, 18 and 19",
            "skill": "tables 16-19",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "16 × 6 = ?",
            "expectedAnswer": "96",
            "hint": "16×5=80. Add 16: 96.",
            "solution": "80+16=96.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Tables 16 to 19", "caption": "The same chain method works for bigger teen tables."}
        },
    ],
    "E": [
        {
            "questionId": "VM_G4_L2_E_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "E",
            "subtopic": "Spot the product — MCQ",
            "skill": "recall and verify",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "14 × 6 = ?",
            "expectedAnswer": "84",
            "hint": "14×5=70. Add 14: 84.",
            "solution": "70+14=84.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Spot the product", "caption": "Use the chain to verify the correct product."}
        },
        {
            "questionId": "VM_G4_L2_E_Q5",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "E",
            "subtopic": "Spot the product — MCQ",
            "skill": "recall and verify",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "18 × 3 = ?",
            "expectedAnswer": "54",
            "hint": "18×2=36. Add 18: 54.",
            "solution": "36+18=54.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Spot the product", "caption": "Use the chain to verify the correct product."}
        },
    ],
    "F": [
        {
            "questionId": "VM_G4_L2_F_Q3",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "F",
            "subtopic": "Fill-step: ×11 with carry",
            "skill": "eleven-trick with carry",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "11 × 75 = ?",
            "expectedAnswer": "825",
            "hint": "7+5=12. Middle=2, carry 1 to 7 → 8. Answer: 825.",
            "solution": "7+5=12. Middle=2, left 7+1=8. Answer: 825.",
            "visual": {"kind": "svg", "asset": "eleven_trick.svg",
                       "title": "Eleven Trick with carry", "caption": "If the middle sum is 10 or more, carry 1 to the left digit."}
        },
        {
            "questionId": "VM_G4_L2_F_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "F",
            "subtopic": "Fill-step: ×11 with carry",
            "skill": "eleven-trick with carry",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "11 × 84 = ?",
            "expectedAnswer": "924",
            "hint": "8+4=12. Middle=2, carry 1 to 8 → 9. Answer: 924.",
            "solution": "8+4=12. Middle=2, left 8+1=9. Answer: 924.",
            "visual": {"kind": "svg", "asset": "eleven_trick.svg",
                       "title": "Eleven Trick with carry", "caption": "If the middle sum is 10 or more, carry 1 to the left digit."}
        },
    ],
    "G": [
        {
            "questionId": "VM_G4_L2_G_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "G",
            "subtopic": "Mixed tables 11–19",
            "skill": "mixed tables",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "13 × 9 = ?",
            "expectedAnswer": "117",
            "hint": "13×8=104. Add 13: 117.",
            "solution": "104+13=117.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Mixed tables 11–19", "caption": "Choose the fastest method for each table."}
        },
        {
            "questionId": "VM_G4_L2_G_Q5",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "G",
            "subtopic": "Mixed tables 11–19",
            "skill": "mixed tables",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "11 × 72 = ?",
            "expectedAnswer": "792",
            "hint": "7+2=9, no carry. Write 7|9|2 = 792.",
            "solution": "7+2=9. Answer: 792.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Mixed tables 11–19", "caption": "Choose the fastest method for each table."}
        },
    ],
    "H": [
        {
            "questionId": "VM_G4_L2_H_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "H",
            "subtopic": "Speed drill — tables race",
            "skill": "speed recall",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "Speed! 12 × 9 = ?",
            "expectedAnswer": "108",
            "hint": "12×8=96. Add 12: 108.",
            "solution": "96+12=108.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Speed tables race", "caption": "Recall the product quickly."}
        },
        {
            "questionId": "VM_G4_L2_H_Q5",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "H",
            "subtopic": "Speed drill — tables race",
            "skill": "speed recall",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "Speed! 17 × 7 = ?",
            "expectedAnswer": "119",
            "hint": "17×6=102. Add 17: 119.",
            "solution": "102+17=119.",
            "visual": {"kind": "svg", "asset": "vm_tables_11_19.svg",
                       "title": "Speed tables race", "caption": "Recall the product quickly."}
        },
    ],
    "I": [
        {
            "questionId": "VM_G4_L2_I_Q3",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "I",
            "subtopic": "Challenge: 3-digit × 11",
            "skill": "3-digit × 11",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "11 × 231 = ?",
            "expectedAnswer": "2541",
            "hint": "Right=1, 3+1=4, 2+3=5, left=2. Answer: 2541.",
            "solution": "11×231: right=1, 3+1=4, 2+3=5, left=2. Answer: 2541.",
            "visual": {"kind": "svg", "asset": "eleven_trick.svg",
                       "title": "3-digit times 11", "caption": "Extend the 11-trick by adding adjacent digit pairs."}
        },
        {
            "questionId": "VM_G4_L2_I_Q4",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "I",
            "subtopic": "Challenge: 3-digit × 11",
            "skill": "3-digit × 11",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "11 × 132 = ?",
            "expectedAnswer": "1452",
            "hint": "Right=2, 3+2=5, 1+3=4, left=1. Answer: 1452.",
            "solution": "11×132: right=2, 3+2=5, 1+3=4, left=1. Answer: 1452.",
            "visual": {"kind": "svg", "asset": "eleven_trick.svg",
                       "title": "3-digit times 11", "caption": "Extend the 11-trick by adding adjacent digit pairs."}
        },
        {
            "questionId": "VM_G4_L2_I_Q5",
            "chapterCode": "VM_G4_L2_TABLES_11_TO_19",
            "exerciseGroup": "I",
            "subtopic": "Challenge: 3-digit × 11",
            "skill": "3-digit × 11",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "11 × 312 = ?",
            "expectedAnswer": "3432",
            "hint": "Right=2, 1+2=3, 3+1=4, left=3. Answer: 3432.",
            "solution": "11×312: right=2, 1+2=3, 3+1=4, left=3. Answer: 3432.",
            "visual": {"kind": "svg", "asset": "eleven_trick.svg",
                       "title": "3-digit times 11", "caption": "Extend the 11-trick by adding adjacent digit pairs."}
        },
    ],
}

# ─── 3. Update sessionFlow: convert text → short_answer, add new questions ───

for group in data["duolingoLessonArc"]["sessionFlow"]:
    grp = group["exerciseGroup"]
    exercises = group["exercises"]
    # Convert text → short_answer
    for ex in exercises:
        if ex.get("questionType") == "text":
            ex["questionType"] = "short_answer"
    # Add new questions
    if grp in NEW_QUESTIONS:
        exercises.extend(NEW_QUESTIONS[grp])
    group["exercises"] = exercises

# ─── 4. Count questions ───────────────────────────────────────────────────────

total = sum(len(g["exercises"]) for g in data["duolingoLessonArc"]["sessionFlow"])
print(f"Total questions after enrichment: {total}")
for g in data["duolingoLessonArc"]["sessionFlow"]:
    print(f"  Group {g['exerciseGroup']}: {len(g['exercises'])} questions")

# ─── 5. Write back ────────────────────────────────────────────────────────────

with open(FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Done. File written successfully.")

# Validate JSON
with open(FILE, "r", encoding="utf-8") as f:
    json.load(f)
print("JSON validity check: PASSED")
