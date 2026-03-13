"""
fix_l2.py — Add teachingFlowStages and 3 screenplay beats to L2_DOUBLING_HALVING.json
"""
import json

filepath = "C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter/L2_DOUBLING_HALVING.json"

with open(filepath, encoding="utf-8") as f:
    data = json.load(f)

# ─────────────────────────────────────────────────────────────────────────────
# 1.  Add teachingFlowStages  (7 required phases — same structure as L1)
# ─────────────────────────────────────────────────────────────────────────────
data["teachingFlowStages"] = [
    {
        "phase": "INTRO",
        "intent": "Set context: doubling and halving are the fastest mental operations and all shortcuts today build on just two moves."
    },
    {
        "phase": "EXPLAIN",
        "intent": "Concept explained with spoken teacherLine and board animation: split-digit doubling, doubling chains (x4, x8), halving chains, and balancing trick."
    },
    {
        "phase": "DEMO",
        "intent": "Teacher solves a full worked example on the board: 2x37 split method, 4x23 double-twice chain, 16x5 balancing trick."
    },
    {
        "phase": "GUIDED",
        "intent": "Student attempts the next step with tutor nudges — halve one factor and double the other to apply the balancing trick."
    },
    {
        "phase": "PRACTICE",
        "intent": "Student solves independently: x5 shortcut, divide-by-5 reverse, x25 and divide-by-25 tricks with minimal prompts."
    },
    {
        "phase": "CHECK",
        "intent": "Tutor gives correctness reasoning and correction logic — shows step-by-step solution chain if the student makes an error."
    },
    {
        "phase": "CHECKPOINT",
        "intent": "Explicit learner-response gate: student confirms understanding of each subtopic before the tutor advances to the next one."
    }
]

# ─────────────────────────────────────────────────────────────────────────────
# 2.  Add 3 more screenplay beats  (bring total from 27 to 30+)
# ─────────────────────────────────────────────────────────────────────────────
new_beats = [
    {
        "beatId": "L2_F_DEMO",
        "stepId": "L2_F",
        "exerciseGroup": "F",
        "subtopic": "Balancing Trick — One Doubles, One Halves",
        "sequence": 604,
        "cue": "demo",
        "boardMode": "svg",
        "teacherLine": "Let me show the balancing trick with a harder number. Fourteen times eight. Halve fourteen to get seven, double eight to get sixteen. Seven times sixteen is one hundred and twelve — same product as fourteen times eight!",
        "boardAction": "Show 14x8: halve 14=7, double 8=16, then 7x16=112. Balance-scale visual.",
        "checkpointPrompt": "14x8 and 7x16 both equal 112 — true or false?",
        "pauseType": "none",
        "holdSec": 0.4,
        "expectedStudentResponse": "",
        "fallbackHint": "Halve one factor, double the other — the product stays the same.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [
            {"kind": "text", "id": "f_d_hdr",  "x": "40",  "y": "28",  "text": "Balancing Trick: 14 x 8",          "color": "#1e40af", "size": 15, "delaySec": 0.0, "durationSec": 0.4},
            {"kind": "text", "id": "f_d_orig", "x": "60",  "y": "65",  "text": "14  x  8",                          "color": "#374151", "size": 16, "delaySec": 0.5, "durationSec": 0.4},
            {"kind": "text", "id": "f_d_h",    "x": "68",  "y": "88",  "text": "halve",                             "color": "#059669", "size": 12, "delaySec": 1.0, "durationSec": 0.3},
            {"kind": "text", "id": "f_d_d",    "x": "148", "y": "88",  "text": "double",                            "color": "#b45309", "size": 12, "delaySec": 1.0, "durationSec": 0.3},
            {"kind": "text", "id": "f_d_new",  "x": "60",  "y": "112", "text": "7  x  16  =  112",                 "color": "#059669", "size": 16, "delaySec": 1.5, "durationSec": 0.5},
            {"kind": "text", "id": "f_d_eq",   "x": "60",  "y": "142", "text": "Same product — balance maintained!","color": "#7c3aed", "size": 12, "delaySec": 2.1, "durationSec": 0.5}
        ]
    },
    {
        "beatId": "L2_F_GUIDED",
        "stepId": "L2_F",
        "exerciseGroup": "F",
        "subtopic": "Balancing Trick — One Doubles, One Halves",
        "sequence": 605,
        "cue": "guided",
        "boardMode": "svg",
        "teacherLine": "Now you try. Solve thirty-two times five using the balancing trick. Hint: halve thirty-two first. What do you get after halving?",
        "boardAction": "Show 32x5 with guided blanks: halve 32=___, double 5=___, ___x___=___",
        "checkpointPrompt": "What is 32 x 5 using the balancing trick?",
        "pauseType": "student_response",
        "holdSec": 0.2,
        "expectedStudentResponse": "160",
        "fallbackHint": "Halve 32 to get 16, double 5 to get 10. Then 16 x 10 = 160.",
        "performanceTag": "core",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [
            {"kind": "text", "id": "f_g_hdr",   "x": "40", "y": "28",  "text": "Your turn: 32 x 5 = ?",             "color": "#7c3aed", "size": 15, "delaySec": 0.0, "durationSec": 0.4},
            {"kind": "text", "id": "f_g_step1", "x": "60", "y": "68",  "text": "Step 1 — Halve 32:   32 / 2 = ___", "color": "#374151", "size": 13, "delaySec": 0.6, "durationSec": 0.4},
            {"kind": "text", "id": "f_g_step2", "x": "60", "y": "98",  "text": "Step 2 — Double 5:   5 x 2  = ___", "color": "#374151", "size": 13, "delaySec": 1.1, "durationSec": 0.4},
            {"kind": "text", "id": "f_g_step3", "x": "60", "y": "128", "text": "Step 3 — Multiply:  ___ x ___ = ___","color": "#b45309", "size": 13, "delaySec": 1.6, "durationSec": 0.4}
        ]
    },
    {
        "beatId": "L2_LESSON_CLOSE",
        "stepId": "L2_I",
        "exerciseGroup": "I",
        "subtopic": "Divide by 5 and 25 — Reverse Trick",
        "sequence": 1001,
        "cue": "checkpoint",
        "boardMode": "free_draw",
        "teacherLine": "Fantastic work today! You now have six powerful shortcuts: double, double-twice, double-three-times, the balancing trick, times-five, and times-twenty-five. Remember — every multiplication shortcut you will ever learn is built on doubling and halving. See you in Lesson 3 where we tackle the Nikhilam base method!",
        "boardAction": "Show summary table: x2 double, x4 double twice, x8 triple double, balancing trick, x5 halved-ten, x25 quartered-hundred.",
        "checkpointPrompt": "Name one shortcut from Lesson 2.",
        "pauseType": "none",
        "holdSec": 0.5,
        "expectedStudentResponse": "",
        "fallbackHint": "Doubling, balancing trick, times-five shortcut, etc.",
        "performanceTag": "engagement",
        "useWhenCorrect": None,
        "useWhenIncorrect": None,
        "minConfidence": None,
        "maxConfidence": None,
        "svgAnimation": [
            {"kind": "text", "id": "cl_hdr",  "x": "40",  "y": "28",  "text": "Lesson 2 — Shortcuts Mastered!",           "color": "#059669", "size": 14, "delaySec": 0.0, "durationSec": 0.5},
            {"kind": "line", "id": "cl_div",  "x1": "40", "y1": "44", "x2": "540", "y2": "44", "color": "#10b981", "width": 2, "delaySec": 0.5, "durationSec": 0.3},
            {"kind": "text", "id": "cl_s1",   "x": "60",  "y": "68",  "text": "x2  — double any number instantly",         "color": "#374151", "size": 12, "delaySec": 0.8, "durationSec": 0.3},
            {"kind": "text", "id": "cl_s2",   "x": "60",  "y": "88",  "text": "x4  — double twice",                         "color": "#374151", "size": 12, "delaySec": 1.1, "durationSec": 0.3},
            {"kind": "text", "id": "cl_s3",   "x": "60",  "y": "108", "text": "x8  — double three times",                   "color": "#374151", "size": 12, "delaySec": 1.4, "durationSec": 0.3},
            {"kind": "text", "id": "cl_s4",   "x": "60",  "y": "128", "text": "Balancing trick — halve one, double other",  "color": "#b45309", "size": 12, "delaySec": 1.7, "durationSec": 0.3},
            {"kind": "text", "id": "cl_s5",   "x": "60",  "y": "148", "text": "x5 = x10 halved  |  x25 = x100 quartered",  "color": "#7c3aed", "size": 12, "delaySec": 2.0, "durationSec": 0.4},
            {"kind": "text", "id": "cl_next", "x": "40",  "y": "175", "text": "Next: Lesson 3 — Nikhilam Base Method!",    "color": "#0ea5e9", "size": 12, "delaySec": 2.5, "durationSec": 0.5}
        ]
    }
]

# Append and re-sort by sequence
data["screenplay"].extend(new_beats)
data["screenplay"].sort(key=lambda b: b.get("sequence", 9999))

# Re-order top-level keys to match L1 layout
key_order = [
    "title", "source", "estimatedMinutes", "subtopics", "learningGoals",
    "coreIdeas", "workedExamples", "starterPractice", "duolingoLessonArc", "teachingScript",
    "screenplay", "teachingFlowStages", "questionPool"
]
ordered = {}
for k in key_order:
    if k in data:
        ordered[k] = data[k]
for k in data:
    if k not in ordered:
        ordered[k] = data[k]

with open(filepath, "w", encoding="utf-8") as f:
    json.dump(ordered, f, ensure_ascii=False, indent=2)

print("SUCCESS: L2_DOUBLING_HALVING.json updated")
print(f"  teachingFlowStages : {len(ordered['teachingFlowStages'])} phases")
print(f"  screenplay beats   : {len(ordered['screenplay'])} beats")
print(f"  questionPool       : {len(ordered.get('questionPool', []))} questions")
