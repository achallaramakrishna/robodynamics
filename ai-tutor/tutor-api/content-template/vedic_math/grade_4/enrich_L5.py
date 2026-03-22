"""
Enrichment script for VM_G4_L5_SUBT_BORROW_FREE.json

Changes:
1. Add demo + guided screenplay beats
2. Bring every exercise group to 4-5 questions (currently 2 each)
3. Convert all "text" questionType to "short_answer"
"""

import json
import copy

FILE = r"C:\roboworkspace\robodynamics\ai-tutor\tutor-api\content-template\vedic_math\grade_4\chapter\VM_G4_L5_SUBT_BORROW_FREE.json"

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

# ── 2. Add 2-3 questions to each exercise group that has only 2 ────────────
# Groups: A(2), B(2), C(2), D(2), E(2), F(2), G(2), H(2), I(2) → target 4 each

new_questions = {
    "A": [
        {
            "questionId": "VM_G4_L5_A_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "A",
            "subtopic": "Review: All From 9, Last From 10",
            "skill": "complement recall",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "1000 - 634 = ? (apply All From 9, Last From 10)",
            "expectedAnswer": "366",
            "hint": "9-6=3, 9-3=6, 10-4=6. Answer: 366.",
            "solution": "All from 9: 9-6=3, 9-3=6. Last from 10: 10-4=6. Answer: 366.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Complement warm-up",
                "caption": "Refresh All From 9, Last From 10 before using the subtraction shortcut."
            }
        },
        {
            "questionId": "VM_G4_L5_A_Q4",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "A",
            "subtopic": "Review: All From 9, Last From 10",
            "skill": "complement recall",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "100 - 47 = ? (Last from 10, rest from 9)",
            "options": ["53", "63", "43", "57"],
            "correctIndex": 0,
            "expectedAnswer": "53",
            "hint": "9-4=5, 10-7=3. Answer: 53.",
            "solution": "All from 9: 9-4=5. Last from 10: 10-7=3. Answer: 53.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Complement warm-up",
                "caption": "Refresh All From 9, Last From 10 before using the subtraction shortcut."
            }
        }
    ],
    "B": [
        {
            "questionId": "VM_G4_L5_B_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "B",
            "subtopic": "Convert and add - the borrow-free method",
            "skill": "borrow-free method",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "543 - 56 = ?",
            "options": ["477", "487", "497", "507"],
            "correctIndex": 1,
            "expectedAnswer": "487",
            "hint": "Complement of 56=44. 543+44=587. 587-100=487.",
            "solution": "Complement 56->44. 543+44=587. 587-100=487.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Convert and add",
                "caption": "Turn subtraction into complement + addition + base adjustment."
            }
        },
        {
            "questionId": "VM_G4_L5_B_Q4",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "B",
            "subtopic": "Convert and add - the borrow-free method",
            "skill": "borrow-free method",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "278 - 43 = ?",
            "expectedAnswer": "235",
            "hint": "Complement of 43=57. 278+57=335. 335-100=235.",
            "solution": "Complement 43->57. 278+57=335. 335-100=235.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Convert and add",
                "caption": "Turn subtraction into complement + addition + base adjustment."
            }
        }
    ],
    "C": [
        {
            "questionId": "VM_G4_L5_C_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "C",
            "subtopic": "3-digit subtraction without borrowing",
            "skill": "3-digit borrow-free",
            "difficulty": "easy",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "643 - 385 = ?",
            "options": ["248", "258", "268", "278"],
            "correctIndex": 1,
            "expectedAnswer": "258",
            "hint": "Complement of 385=615. 643+615=1258. 1258-1000=258.",
            "solution": "Complement 385->615. 643+615=1258. 1258-1000=258.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "3-digit borrow-free",
                "caption": "Use the same three-step method with base 1000."
            }
        },
        {
            "questionId": "VM_G4_L5_C_Q4",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "C",
            "subtopic": "3-digit subtraction without borrowing",
            "skill": "3-digit borrow-free",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "521 - 234 = ?",
            "expectedAnswer": "287",
            "hint": "Complement of 234=766. 521+766=1287. 1287-1000=287.",
            "solution": "Complement 234->766. 521+766=1287. 1287-1000=287.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "3-digit borrow-free",
                "caption": "Use the same three-step method with base 1000."
            }
        }
    ],
    "D": [
        {
            "questionId": "VM_G4_L5_D_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "D",
            "subtopic": "4-digit subtraction without borrowing",
            "skill": "4-digit borrow-free",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "8000 - 5234 = ?",
            "options": ["2756", "2766", "2776", "2786"],
            "correctIndex": 1,
            "expectedAnswer": "2766",
            "hint": "Complement of 5234=4766. 8000+4766=12766. 12766-10000=2766.",
            "solution": "Complement 5234->4766. 8000+4766=12766. 12766-10000=2766.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "4-digit borrow-free",
                "caption": "Scale the method up to base 10000 without borrowing."
            }
        },
        {
            "questionId": "VM_G4_L5_D_Q4",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "D",
            "subtopic": "4-digit subtraction without borrowing",
            "skill": "4-digit borrow-free",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "4000 - 1789 = ?",
            "expectedAnswer": "2211",
            "hint": "Complement of 1789=8211. 4000+8211=12211. 12211-10000=2211.",
            "solution": "Complement 1789->8211. 4000+8211=12211. 12211-10000=2211.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "4-digit borrow-free",
                "caption": "Scale the method up to base 10000 without borrowing."
            }
        }
    ],
    "E": [
        {
            "questionId": "VM_G4_L5_E_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "E",
            "subtopic": "Word problem - money",
            "skill": "money word problem",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "A shopkeeper has Rs 750. He pays Rs 283 for stock. How much money remains?",
            "expectedAnswer": "467",
            "hint": "750-283. Complement of 283=717. 750+717=1467. 1467-1000=467.",
            "solution": "Complement 283->717. 750+717=1467. 1467-1000=Rs 467.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Money subtraction",
                "caption": "The same complement method works in rupee word problems."
            }
        },
        {
            "questionId": "VM_G4_L5_E_Q4",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "E",
            "subtopic": "Word problem - money",
            "skill": "money word problem",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "Geeta has Rs 600. She buys a dress for Rs 245. How much is left?",
            "options": ["345", "355", "365", "375"],
            "correctIndex": 1,
            "expectedAnswer": "355",
            "hint": "Complement of 245=755. 600+755=1355. 1355-1000=355.",
            "solution": "Complement 245->755. 600+755=1355. 1355-1000=Rs 355.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Money subtraction",
                "caption": "The same complement method works in rupee word problems."
            }
        }
    ],
    "F": [
        {
            "questionId": "VM_G4_L5_F_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "F",
            "subtopic": "Word problem - measurement",
            "skill": "measurement word problem",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "A rope is 1000 m long. A builder cuts 457 m. How much rope remains?",
            "options": ["533", "543", "553", "563"],
            "correctIndex": 1,
            "expectedAnswer": "543",
            "hint": "Complement of 457=543. Direct answer: 543 m.",
            "solution": "1000-457: 10-7=3, 9-5=4, 9-4=5. Answer: 543 m.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Measurement subtraction",
                "caption": "Use complement thinking for grams, litres, and centimetres too."
            }
        },
        {
            "questionId": "VM_G4_L5_F_Q4",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "F",
            "subtopic": "Word problem - measurement",
            "skill": "measurement word problem",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "A container holds 2000 kg of sand. 834 kg is removed. How many kg remain?",
            "expectedAnswer": "1166",
            "hint": "Complement of 834=9166 from 10000? No: 2000-834. Complement of 834 from 1000=166. 2000-834=1166.",
            "solution": "1000-834=166. 2000-834=1000+166=1166 kg.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Measurement subtraction",
                "caption": "Use complement thinking for grams, litres, and centimetres too."
            }
        }
    ],
    "G": [
        {
            "questionId": "VM_G4_L5_G_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "G",
            "subtopic": "Mixed subtraction speed drill",
            "skill": "mixed borrow-free speed",
            "difficulty": "medium",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "700 - 182 = ?",
            "expectedAnswer": "518",
            "hint": "Complement of 182=818. 700+818=1518. 1518-1000=518.",
            "solution": "Complement 182->818. 700+818=1518. 1518-1000=518.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Mixed speed drill",
                "caption": "Pick the right base fast, then complement and adjust."
            }
        },
        {
            "questionId": "VM_G4_L5_G_Q4",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "G",
            "subtopic": "Mixed subtraction speed drill",
            "skill": "mixed borrow-free speed",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "1000 - 519 = ?",
            "options": ["471", "481", "491", "501"],
            "correctIndex": 1,
            "expectedAnswer": "481",
            "hint": "10-9=1, 9-1=8, 9-5=4. Answer: 481.",
            "solution": "All from 9, last from 10: 10-9=1, 9-1=8, 9-5=4. Answer: 481.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Mixed speed drill",
                "caption": "Pick the right base fast, then complement and adjust."
            }
        }
    ],
    "H": [
        {
            "questionId": "VM_G4_L5_H_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "H",
            "subtopic": "Fill-step: 4-digit borrow-free",
            "skill": "fill-step 4-digit borrow-free",
            "difficulty": "hard",
            "type": "guided",
            "questionType": "fill_step",
            "questionText": "Find 6000 - 4137 using complement and addition.",
            "steps": [
                {"label": "Complement of 4137 from 10000: ?", "answer": "5863", "hint": "10-7=3, 9-3=6, 9-1=8, 9-4=5 -> 5863"},
                {"label": "Add: 6000 + 5863 = ?", "answer": "11863", "hint": "6000 + 5863"},
                {"label": "Subtract 10000: 11863 - 10000 = ?", "answer": "1863", "hint": "Remove the extra 10000"}
            ],
            "expectedAnswer": "1863",
            "hint": "Complement 4137->5863. 6000+5863=11863. 11863-10000=1863.",
            "solution": "Complement 4137=5863. 6000+5863=11863. 11863-10000=1863.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Fill the steps",
                "caption": "Write complement, sum, and final adjustment in order."
            }
        }
    ],
    "I": [
        {
            "questionId": "VM_G4_L5_I_Q3",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "I",
            "subtopic": "Challenge: multi-step borrow-free",
            "skill": "multi-step borrow-free",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "mcq",
            "questionText": "Priya collects 2500 stickers. She gives 1375 to friends and 648 to her sister. How many stickers remain?",
            "options": ["467", "477", "487", "497"],
            "correctIndex": 1,
            "expectedAnswer": "477",
            "hint": "2500-1375=1125. 1125-648=477.",
            "solution": "2500-1375=1125. 1125-648=477 stickers.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Multi-step challenge",
                "caption": "Apply the borrow-free method twice inside one story problem."
            }
        },
        {
            "questionId": "VM_G4_L5_I_Q4",
            "chapterCode": "VM_G4_L5_SUBT_BORROW_FREE",
            "exerciseGroup": "I",
            "subtopic": "Challenge: multi-step borrow-free",
            "skill": "multi-step borrow-free",
            "difficulty": "hard",
            "type": "practice",
            "questionType": "short_answer",
            "questionText": "A school library has 5000 books. 2143 are borrowed and 876 are sent to another branch. How many remain?",
            "expectedAnswer": "1981",
            "hint": "5000-2143=2857. 2857-876=1981.",
            "solution": "5000-2143=2857. 2857-876=1981 books.",
            "visual": {
                "kind": "svg",
                "asset": "vm_borrow_free_subtraction.svg",
                "title": "Multi-step challenge",
                "caption": "Apply the borrow-free method twice inside one story problem."
            }
        }
    ]
}

# Add new questions to each exercise group
for group in session_flow:
    grp = group["exerciseGroup"]
    if grp in new_questions:
        group["exercises"].extend(new_questions[grp])

# ── 3. Add demo + guided beats to the screenplay ────────────────────────────
demo_beat = {
    "beatId": "VM_G4_L5_A_DEMO",
    "stepId": "VM_G4_L5_A",
    "exerciseGroup": "A",
    "subtopic": "Review: All From 9, Last From 10",
    "sequence": 502,
    "cue": "demo",
    "boardMode": "svg",
    "teacherLine": "Watch this! 1000 - 634. Apply the rule: 9-6=3, 9-3=6, 10-4=6. The answer is 366. No borrowing at all!",
    "boardAction": "Show 1000 - 634 on board. Highlight: 9-6=3 (hundreds), 9-3=6 (tens), 10-4=6 (units). Box the answer 366.",
    "checkpointPrompt": "Watch how each digit is found directly from the rule.",
    "pauseType": "none",
    "holdSec": 1.5,
    "expectedStudentResponse": "",
    "fallbackHint": "Remember: last digit uses 10, all other digits use 9.",
    "performanceTag": "core",
    "svgAnimation": []
}

guided_beat = {
    "beatId": "VM_G4_L5_A_GUIDED",
    "stepId": "VM_G4_L5_A",
    "exerciseGroup": "A",
    "subtopic": "Review: All From 9, Last From 10",
    "sequence": 503,
    "cue": "guided",
    "boardMode": "svg",
    "teacherLine": "Your turn! Try: 100 - 47. All from 9: 9-4=5. Last from 10: 10-7=3. What is the answer?",
    "boardAction": "Show 100 - 47 with blank answer box. Display hint: 9-4=? and 10-7=? with boxes to fill.",
    "checkpointPrompt": "Say or type your answer for 100 - 47.",
    "pauseType": "student_response",
    "holdSec": 0.5,
    "expectedStudentResponse": "53",
    "fallbackHint": "9-4=5 (tens digit), 10-7=3 (units digit). Answer: 53.",
    "performanceTag": "core",
    "svgAnimation": []
}

# Insert after the first intro beat
screenplay = data["screenplay"]
new_screenplay = []
for beat in screenplay:
    new_screenplay.append(beat)
    if beat.get("beatId") == "VM_G4_L5_A_INTRO":
        new_screenplay.append(demo_beat)
        new_screenplay.append(guided_beat)

data["screenplay"] = new_screenplay

# ── 4. Save and verify ───────────────────────────────────────────────────────
with open(FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Verification
with open(FILE, "r", encoding="utf-8") as f:
    verified = json.load(f)

print("=== L5 Enrichment Summary ===")
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
