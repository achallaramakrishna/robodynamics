"""
generate_question_pools.py
Add questionPool (27 Qs: 9 easy + 9 medium + 9 hard) and teachingFlowStages
to every incomplete chapter in the Vedic Math course.

Run:  python3 scripts/generate_question_pools.py
"""

import json, hashlib, glob, os

CHAPTER_DIR = "C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/chapter"

def qid(code, group, diff, n):
    raw = f"{code}_{group}_{diff[0].upper()}_{n:02d}"
    return raw

def q(qid_, group, subtopic, skill, diff, qtext, hint, solution, answer):
    return {
        "questionId": qid_,
        "chapterCode": "_CODE_",   # replaced below
        "exerciseGroup": group,
        "subtopic": subtopic,
        "skill": skill,
        "difficulty": diff,
        "type": "short_answer",
        "questionText": qtext,
        "hint": hint,
        "solution": solution,
        "expectedAnswer": answer
    }

TFS = lambda intent_intro, intent_explain, intent_demo, intent_guided, intent_practice, intent_check: [
    {"phase": "INTRO",      "intent": intent_intro},
    {"phase": "EXPLAIN",    "intent": intent_explain},
    {"phase": "DEMO",       "intent": intent_demo},
    {"phase": "GUIDED",     "intent": intent_guided},
    {"phase": "PRACTICE",   "intent": intent_practice},
    {"phase": "CHECK",      "intent": "Tutor gives step-by-step correction logic and shows where the student's reasoning went wrong."},
    {"phase": "CHECKPOINT", "intent": "Explicit learner-response gate: student confirms understanding before tutor advances to the next subtopic."}
]


# ─────────────────────────────────────────────────────────────────────────────
# Chapter data  (code → {tfs, questions})
# ─────────────────────────────────────────────────────────────────────────────

CHAPTERS = {}

# ── L3: Digit Sum and Nine Point Circle ──────────────────────────────────────
CHAPTERS["L3_MULTIPLY_BY_11"] = {
    "tfs": TFS(
        "Set context: digit sums are the fastest way to check arithmetic — add digits until you get a single number.",
        "Explain digit sum calculation: add all digits repeatedly until one digit remains.",
        "Teacher demonstrates: digit sum of 294 = 2+9+4=15, 1+5=6. Casting out nines: 9s and pairs summing to 9 vanish.",
        "Student tries digit sum of 3-digit number with teacher nudges.",
        "Student independently checks a multiplication result using digit sums.",
    ),
    "questions": [
        # Easy — digit sum of small numbers
        q("L3_A_E_01","A","Digit Sums","Digit Sum",  "easy",   "What is the digit sum of 36?",      "3+6=9","3+6=9","9"),
        q("L3_A_E_02","A","Digit Sums","Digit Sum",  "easy",   "What is the digit sum of 54?",      "5+4=9","5+4=9","9"),
        q("L3_A_E_03","A","Digit Sums","Digit Sum",  "easy",   "What is the digit sum of 72?",      "7+2=9","7+2=9","9"),
        q("L3_A_E_04","A","Digit Sums","Digit Sum",  "easy",   "What is the digit sum of 25?",      "2+5=7","2+5=7","7"),
        q("L3_A_E_05","A","Digit Sums","Digit Sum",  "easy",   "What is the digit sum of 43?",      "4+3=7","4+3=7","7"),
        q("L3_A_E_06","A","Digit Sums","Digit Sum",  "easy",   "What is the digit sum of 83?",      "8+3=11, 1+1=2","8+3=11, 1+1=2","2"),
        q("L3_A_E_07","A","Digit Sums","Digit Sum",  "easy",   "What is the digit sum of 19?",      "1+9=10, 1+0=1","1+9=10, 1+0=1","1"),
        q("L3_A_E_08","A","Digit Sums","Digit Sum",  "easy",   "Digit sum of 45?",                  "4+5=9","4+5=9","9"),
        q("L3_A_E_09","A","Digit Sums","Digit Sum",  "easy",   "Digit sum of 60?",                  "6+0=6","6+0=6","6"),
        # Medium — 3-digit digit sums
        q("L3_B_M_01","B","Digit Sums","Digit Sum",  "medium", "Digit sum of 294?",                 "2+9+4=15, 1+5=6","2+9+4=15, 1+5=6","6"),
        q("L3_B_M_02","B","Digit Sums","Digit Sum",  "medium", "Digit sum of 387?",                 "3+8+7=18, 1+8=9","3+8+7=18, 1+8=9","9"),
        q("L3_B_M_03","B","Digit Sums","Digit Sum",  "medium", "Digit sum of 456?",                 "4+5+6=15, 1+5=6","4+5+6=15, 1+5=6","6"),
        q("L3_B_M_04","B","Digit Sums","Digit Sum",  "medium", "Digit sum of 739?",                 "7+3+9=19, 1+9=10, 1+0=1","7+3+9=19, 1+9=10, 1+0=1","1"),
        q("L3_B_M_05","B","Casting Nines","Digit Check","medium","Check 6x7=42 using digit sums. DS(6)=6, DS(7)=7, 6x7=42. DS(42)=?","6x7=42, DS(42)=6. DS(6)xDS(7)=42 DS=6. Match!","6x7=42, DS=6","6"),
        q("L3_B_M_06","B","Casting Nines","Digit Check","medium","Does digit sum confirm 8x9=72? DS(8)=8, DS(9)=9, 8x9=72. DS(72)=?","7+2=9. But 8x9 mod 9 = 72 mod 9 = 0. DS(72)=9 (=0 mod 9). Pass.","7+2=9","9"),
        q("L3_B_M_07","B","Digit Sums","Digit Sum",  "medium", "Digit sum of 1234?",                "1+2+3+4=10, 1+0=1","1+2+3+4=10, 1+0=1","1"),
        q("L3_B_M_08","B","Digit Sums","Digit Sum",  "medium", "Digit sum of 9999?",                "9+9+9+9=36, 3+6=9","9+9+9+9=36, 3+6=9","9"),
        q("L3_B_M_09","B","Digit Sums","Digit Sum",  "medium", "Digit sum of 5678?",                "5+6+7+8=26, 2+6=8","5+6+7+8=26, 2+6=8","8"),
        # Hard — casting out 9s to verify operations
        q("L3_C_H_01","C","Casting Nines","Casting Out 9s","hard","Verify 23x4=92 using digit sums. DS(23)=5, DS(4)=4. 5x4=20. DS(20)=2. DS(92)=?","9+2=11,1+1=2. Match! Answer checks out.","9+2=11,1+1=2","2"),
        q("L3_C_H_02","C","Casting Nines","Casting Out 9s","hard","Verify 35+47=82 using digit sums. DS(35)=8, DS(47)=11->2. 8+2=10->1. DS(82)=?","8+2=10, 1+0=1. Match!","8+2=10","1"),
        q("L3_C_H_03","C","Casting Nines","Casting Out 9s","hard","Digit sum of 99999?",            "9x5=45, 4+5=9","9x5=45, 4+5=9","9"),
        q("L3_C_H_04","C","Casting Nines","Casting Out 9s","hard","DS(4567)=?",                     "4+5+6+7=22, 2+2=4","4+5+6+7=22, 2+2=4","4"),
        q("L3_C_H_05","C","Casting Nines","Casting Out 9s","hard","Verify 12x12=144. DS(12)=3. 3x3=9. DS(144)=?","1+4+4=9. Match!","1+4+4=9","9"),
        q("L3_C_H_06","C","Casting Nines","Casting Out 9s","hard","Verify 25x4=100. DS(25)=7. DS(4)=4. 7x4=28->10->1. DS(100)=?","1+0+0=1. Match!","1+0+0=1","1"),
        q("L3_C_H_07","C","Casting Nines","Casting Out 9s","hard","DS of 123456789?",               "Sum=45, 4+5=9","Sum=45, 4+5=9","9"),
        q("L3_C_H_08","C","Casting Nines","Casting Out 9s","hard","Verify 99+1=100 using digit sums. DS(99)=9+9=18->9. DS(1)=1. 9+1=10->1. DS(100)=?","1. Match!","1+0+0=1","1"),
        q("L3_C_H_09","C","Casting Nines","Casting Out 9s","hard","DS(987654)=?",                   "9+8+7+6+5+4=39, 3+9=12, 1+2=3","Sum=39, DS=3","3"),
    ]
}

# ── L4: Left to Right Arithmetic ──────────────────────────────────────────────
CHAPTERS["L4_VERTICAL_CROSSWISE"] = {
    "tfs": TFS(
        "Set context: left-to-right arithmetic is how our minds naturally work — and it gives estimates as we go.",
        "Explain left-to-right addition: process the largest place value first, carry adjustments as needed.",
        "Teacher demonstrates: 456+237 → 400+200=600, 50+30=80, 6+7=13 → 693.",
        "Student tries 3-digit addition from left to right with teacher support.",
        "Student solves independently: left-to-right subtraction and multiplication.",
    ),
    "questions": [
        # Easy — 2-digit L-to-R
        q("L4_A_E_01","A","L-to-R Addition","Left-to-Right","easy","45 + 32 = ?",                  "40+30=70, 5+2=7, total 77","40+30=70, 5+2=7","77"),
        q("L4_A_E_02","A","L-to-R Addition","Left-to-Right","easy","63 + 24 = ?",                  "60+20=80, 3+4=7","60+20=80, 3+4=7","87"),
        q("L4_A_E_03","A","L-to-R Addition","Left-to-Right","easy","71 + 18 = ?",                  "70+10=80, 1+8=9","70+10=80, 1+8=9","89"),
        q("L4_A_E_04","A","L-to-R Addition","Left-to-Right","easy","52 + 37 = ?",                  "50+30=80, 2+7=9","50+30=80, 2+7=9","89"),
        q("L4_A_E_05","A","L-to-R Subtraction","Left-to-Right","easy","87 - 34 = ?",               "80-30=50, 7-4=3","80-30=50, 7-4=3","53"),
        q("L4_A_E_06","A","L-to-R Subtraction","Left-to-Right","easy","96 - 43 = ?",               "90-40=50, 6-3=3","90-40=50, 6-3=3","53"),
        q("L4_A_E_07","A","L-to-R Subtraction","Left-to-Right","easy","75 - 21 = ?",               "70-20=50, 5-1=4","70-20=50, 5-1=4","54"),
        q("L4_A_E_08","A","L-to-R Addition","Left-to-Right","easy","34 + 45 = ?",                  "30+40=70, 4+5=9","30+40=70, 4+5=9","79"),
        q("L4_A_E_09","A","L-to-R Addition","Left-to-Right","easy","21 + 68 = ?",                  "20+60=80, 1+8=9","20+60=80, 1+8=9","89"),
        # Medium — 3-digit L-to-R
        q("L4_B_M_01","B","L-to-R Addition","Left-to-Right","medium","456 + 237 = ?",              "400+200=600, 50+30=80, 6+7=13 -> 693","600+80+13=693","693"),
        q("L4_B_M_02","B","L-to-R Addition","Left-to-Right","medium","348 + 254 = ?",              "300+200=500, 40+50=90, 8+4=12 -> 602","500+90+12=602","602"),
        q("L4_B_M_03","B","L-to-R Subtraction","Left-to-Right","medium","745 - 312 = ?",           "700-300=400, 40-10=30, 5-2=3","400+30+3=433","433"),
        q("L4_B_M_04","B","L-to-R Subtraction","Left-to-Right","medium","863 - 241 = ?",           "800-200=600, 60-40=20, 3-1=2","600+20+2=622","622"),
        q("L4_B_M_05","B","L-to-R Multiplication","Left-to-Right","medium","23 x 4 = ? (L-to-R)",  "20x4=80, 3x4=12, 80+12=92","80+12=92","92"),
        q("L4_B_M_06","B","L-to-R Multiplication","Left-to-Right","medium","36 x 3 = ?",           "30x3=90, 6x3=18, 90+18=108","90+18=108","108"),
        q("L4_B_M_07","B","L-to-R Addition","Left-to-Right","medium","129 + 456 = ?",              "100+400=500, 20+50=70, 9+6=15 -> 585","500+70+15=585","585"),
        q("L4_B_M_08","B","L-to-R Subtraction","Left-to-Right","medium","972 - 451 = ?",           "900-400=500, 70-50=20, 2-1=1","500+20+1=521","521"),
        q("L4_B_M_09","B","L-to-R Multiplication","Left-to-Right","medium","42 x 3 = ?",           "40x3=120, 2x3=6, 126","120+6=126","126"),
        # Hard
        q("L4_C_H_01","C","L-to-R Addition","Left-to-Right","hard","1234 + 2345 = ?",              "1000+2000=3000, 200+300=500, 30+40=70, 4+5=9 -> 3579","3000+500+70+9=3579","3579"),
        q("L4_C_H_02","C","L-to-R Subtraction","Left-to-Right","hard","8765 - 4321 = ?",           "8000-4000=4000, 700-300=400, 60-20=40, 5-1=4 -> 4444","4000+400+40+4=4444","4444"),
        q("L4_C_H_03","C","L-to-R Multiplication","Left-to-Right","hard","124 x 2 = ?",            "100x2=200, 20x2=40, 4x2=8 -> 248","200+40+8=248","248"),
        q("L4_C_H_04","C","L-to-R Multiplication","Left-to-Right","hard","213 x 3 = ?",            "200x3=600, 10x3=30, 3x3=9 -> 639","600+30+9=639","639"),
        q("L4_C_H_05","C","L-to-R Multiplication","Left-to-Right","hard","325 x 4 = ?",            "300x4=1200, 20x4=80, 5x4=20 -> 1300","1200+80+20=1300","1300"),
        q("L4_C_H_06","C","L-to-R Addition","Left-to-Right","hard","567 + 389 = ?",                "500+300=800, 60+80=140, 7+9=16 -> 956","800+140+16=956","956"),
        q("L4_C_H_07","C","L-to-R Subtraction","Left-to-Right","hard","1000 - 456 = ?",            "999-456+1=543+1=544","1000-456=544","544"),
        q("L4_C_H_08","C","L-to-R Multiplication","Left-to-Right","hard","432 x 2 = ?",            "400x2=800, 30x2=60, 2x2=4 -> 864","800+60+4=864","864"),
        q("L4_C_H_09","C","L-to-R Multiplication","Left-to-Right","hard","231 x 4 = ?",            "200x4=800, 30x4=120, 1x4=4 -> 924","800+120+4=924","924"),
    ]
}

# ── L5: All from 9 and Last from 10 ──────────────────────────────────────────
CHAPTERS["L5_ALL_FROM_9_LAST_FROM_10"] = {
    "tfs": TFS(
        "Set context: All from 9 and Last from 10 is the fastest subtraction from a power of 10.",
        "Explain the rule: subtract each digit from 9, but subtract the last digit from 10.",
        "Teacher demonstrates: 100-37 = (9-3)(10-7) = 63. 1000-456 = (9-4)(9-5)(10-6) = 544.",
        "Student applies the formula to 100-based subtractions with tutor guidance.",
        "Student independently uses All from 9 Last from 10 for money change problems.",
    ),
    "questions": [
        # Easy — subtraction from 100
        q("L5_A_E_01","A","Base Subtraction","All from 9","easy","100 - 37 = ?",                   "9-3=6, 10-7=3 -> 63","63","63"),
        q("L5_A_E_02","A","Base Subtraction","All from 9","easy","100 - 46 = ?",                   "9-4=5, 10-6=4 -> 54","54","54"),
        q("L5_A_E_03","A","Base Subtraction","All from 9","easy","100 - 52 = ?",                   "9-5=4, 10-2=8 -> 48","48","48"),
        q("L5_A_E_04","A","Base Subtraction","All from 9","easy","100 - 71 = ?",                   "9-7=2, 10-1=9 -> 29","29","29"),
        q("L5_A_E_05","A","Base Subtraction","All from 9","easy","100 - 83 = ?",                   "9-8=1, 10-3=7 -> 17","17","17"),
        q("L5_A_E_06","A","Base Subtraction","All from 9","easy","100 - 64 = ?",                   "9-6=3, 10-4=6 -> 36","36","36"),
        q("L5_A_E_07","A","Base Subtraction","All from 9","easy","100 - 29 = ?",                   "9-2=7, 10-9=1 -> 71","71","71"),
        q("L5_A_E_08","A","Base Subtraction","All from 9","easy","100 - 55 = ?",                   "9-5=4, 10-5=5 -> 45","45","45"),
        q("L5_A_E_09","A","Base Subtraction","All from 9","easy","100 - 18 = ?",                   "9-1=8, 10-8=2 -> 82","82","82"),
        # Medium — from 1000
        q("L5_B_M_01","B","Base Subtraction","All from 9","medium","1000 - 456 = ?",               "9-4=5, 9-5=4, 10-6=4 -> 544","544","544"),
        q("L5_B_M_02","B","Base Subtraction","All from 9","medium","1000 - 237 = ?",               "9-2=7, 9-3=6, 10-7=3 -> 763","763","763"),
        q("L5_B_M_03","B","Base Subtraction","All from 9","medium","1000 - 891 = ?",               "9-8=1, 9-9=0, 10-1=9 -> 109","109","109"),
        q("L5_B_M_04","B","Base Subtraction","All from 9","medium","1000 - 345 = ?",               "9-3=6, 9-4=5, 10-5=5 -> 655","655","655"),
        q("L5_B_M_05","B","Base Subtraction","All from 9","medium","1000 - 764 = ?",               "9-7=2, 9-6=3, 10-4=6 -> 236","236","236"),
        q("L5_B_M_06","B","Money Apps","All from 9","medium","Change from Rs.100 for Rs.73 purchase?","9-7=2, 10-3=7 -> Rs.27","27","27"),
        q("L5_B_M_07","B","Money Apps","All from 9","medium","Change from Rs.1000 for Rs.487 purchase?","9-4=5, 9-8=1, 10-7=3 -> Rs.513","513","513"),
        q("L5_B_M_08","B","Base Subtraction","All from 9","medium","1000 - 602 = ?",               "9-6=3, 9-0=9, 10-2=8 -> 398","398","398"),
        q("L5_B_M_09","B","Base Subtraction","All from 9","medium","10000 - 3456 = ?",             "9-3=6, 9-4=5, 9-5=4, 10-6=4 -> 6544","6544","6544"),
        # Hard
        q("L5_C_H_01","C","Base Subtraction","All from 9","hard","10000 - 7823 = ?",               "9-7=2, 9-8=1, 9-2=7, 10-3=7 -> 2177","2177","2177"),
        q("L5_C_H_02","C","Base Subtraction","All from 9","hard","100000 - 34567 = ?",             "9-3=6,9-4=5,9-5=4,9-6=3,10-7=3 -> 65433","65433","65433"),
        q("L5_C_H_03","C","Base Subtraction","All from 9","hard","1000 - 999 = ?",                 "9-9=0, 9-9=0, 10-9=1 -> 001=1","1","1"),
        q("L5_C_H_04","C","Money Apps","All from 9","hard","Change from Rs.10000 for Rs.6789?",     "9-6=3, 9-7=2, 9-8=1, 10-9=1 -> Rs.3211","3211","3211"),
        q("L5_C_H_05","C","Base Subtraction","All from 9","hard","1000 - 100 = ?",                 "9-1=8, 9-0=9, 10-0=10 -> carry: 900","900","900"),
        q("L5_C_H_06","C","Base Subtraction","All from 9","hard","10000 - 5001 = ?",               "9-5=4, 9-0=9, 9-0=9, 10-1=9 -> 4999","4999","4999"),
        q("L5_C_H_07","C","Base Subtraction","All from 9","hard","100 - 99 = ?",                   "9-9=0, 10-9=1 -> 01=1","1","1"),
        q("L5_C_H_08","C","Base Subtraction","All from 9","hard","1000 - 500 = ?",                 "1000-500=500","500","500"),
        q("L5_C_H_09","C","Base Subtraction","All from 9","hard","10000 - 2019 = ?",               "9-2=7, 9-0=9, 9-1=8, 10-9=1 -> 7981","7981","7981"),
    ]
}

# ── L6: Number Splitting ──────────────────────────────────────────────────────
CHAPTERS["L6_NIKHILAM_BASE_10_100"] = {
    "tfs": TFS(
        "Set context: splitting numbers into friendly chunks makes mental arithmetic effortless.",
        "Explain splitting: break numbers at a convenient boundary — usually tens — compute each part, then combine.",
        "Teacher demonstrates: 46+38 = 46+30+8 = 76+8 = 84. And 7x36 = 7x30+7x6 = 210+42 = 252.",
        "Student splits 68+25 step by step with teacher nudges.",
        "Student independently solves multiplication and division by splitting.",
    ),
    "questions": [
        q("L6_A_E_01","A","Addition Splitting","Splitting","easy","46 + 38 = ?",                   "46+30=76, 76+8=84","76+8=84","84"),
        q("L6_A_E_02","A","Addition Splitting","Splitting","easy","57 + 26 = ?",                   "57+20=77, 77+6=83","77+6=83","83"),
        q("L6_A_E_03","A","Addition Splitting","Splitting","easy","68 + 25 = ?",                   "68+20=88, 88+5=93","88+5=93","93"),
        q("L6_A_E_04","A","Addition Splitting","Splitting","easy","34 + 49 = ?",                   "34+40=74, 74+9=83","74+9=83","83"),
        q("L6_A_E_05","A","Addition Splitting","Splitting","easy","52 + 38 = ?",                   "52+30=82, 82+8=90","82+8=90","90"),
        q("L6_A_E_06","A","Subtraction Splitting","Splitting","easy","85 - 37 = ?",                "85-30=55, 55-7=48","55-7=48","48"),
        q("L6_A_E_07","A","Subtraction Splitting","Splitting","easy","93 - 46 = ?",                "93-40=53, 53-6=47","53-6=47","47"),
        q("L6_A_E_08","A","Addition Splitting","Splitting","easy","73 + 19 = ?",                   "73+10=83, 83+9=92","83+9=92","92"),
        q("L6_A_E_09","A","Addition Splitting","Splitting","easy","41 + 59 = ?",                   "41+50=91, 91+9=100","91+9=100","100"),
        q("L6_B_M_01","B","Multiplication Splitting","Splitting","medium","7 x 36 = ?",            "7x30=210, 7x6=42, 210+42=252","210+42=252","252"),
        q("L6_B_M_02","B","Multiplication Splitting","Splitting","medium","6 x 48 = ?",            "6x40=240, 6x8=48, 240+48=288","240+48=288","288"),
        q("L6_B_M_03","B","Multiplication Splitting","Splitting","medium","8 x 35 = ?",            "8x30=240, 8x5=40, 240+40=280","240+40=280","280"),
        q("L6_B_M_04","B","Multiplication Splitting","Splitting","medium","9 x 27 = ?",            "9x20=180, 9x7=63, 180+63=243","180+63=243","243"),
        q("L6_B_M_05","B","Addition Splitting","Splitting","medium","147 + 256 = ?",               "147+200=347, 347+56=403","347+56=403","403"),
        q("L6_B_M_06","B","Subtraction Splitting","Splitting","medium","243 - 167 = ?",            "243-100=143, 143-67=76","143-67=76","76"),
        q("L6_B_M_07","B","Multiplication Splitting","Splitting","medium","5 x 74 = ?",            "5x70=350, 5x4=20, 350+20=370","350+20=370","370"),
        q("L6_B_M_08","B","Multiplication Splitting","Splitting","medium","4 x 123 = ?",           "4x100=400, 4x20=80, 4x3=12 -> 492","400+80+12=492","492"),
        q("L6_B_M_09","B","Division Splitting","Splitting","medium","84 / 4 = ?",                  "80/4=20, 4/4=1, 20+1=21","20+1=21","21"),
        q("L6_C_H_01","C","Multiplication Splitting","Splitting","hard","12 x 34 = ?",             "12x30=360, 12x4=48, 360+48=408","360+48=408","408"),
        q("L6_C_H_02","C","Multiplication Splitting","Splitting","hard","15 x 24 = ?",             "15x20=300, 15x4=60, 300+60=360","300+60=360","360"),
        q("L6_C_H_03","C","Multiplication Splitting","Splitting","hard","23 x 43 = ?",             "23x40=920, 23x3=69, 920+69=989","920+69=989","989"),
        q("L6_C_H_04","C","Division Splitting","Splitting","hard","126 / 6 = ?",                   "120/6=20, 6/6=1, 20+1=21","20+1=21","21"),
        q("L6_C_H_05","C","Division Splitting","Splitting","hard","144 / 4 = ?",                   "140/4=35, 4/4=1, 35+1=36","35+1=36","36"),
        q("L6_C_H_06","C","Multiplication Splitting","Splitting","hard","14 x 16 = ?",             "14x10=140, 14x6=84, 140+84=224","140+84=224","224"),
        q("L6_C_H_07","C","Multiplication Splitting","Splitting","hard","21 x 35 = ?",             "21x30=630, 21x5=105, 630+105=735","630+105=735","735"),
        q("L6_C_H_08","C","Division Splitting","Splitting","hard","168 / 8 = ?",                   "160/8=20, 8/8=1, 20+1=21","20+1=21","21"),
        q("L6_C_H_09","C","Multiplication Splitting","Splitting","hard","32 x 25 = ?",             "32x25=32/4x100=8x100=800","32/4=8, 8x100=800","800"),
    ]
}

# ── L7: Base Multiplication ───────────────────────────────────────────────────
CHAPTERS["L7_SQUARES_ENDING_5"] = {
    "tfs": TFS(
        "Set context: base multiplication lets you multiply numbers near 10 or 100 with almost no effort.",
        "Explain: find each number's distance from the base. Cross-add (or subtract) for left part, multiply distances for right part.",
        "Teacher demonstrates: 9x8 — deficits are 1 and 2. 9-2=7 (or 8-1=7). 1x2=2. Answer: 72.",
        "Student tries 11x12 with base 10 using tutor hints for each step.",
        "Student independently solves near-100 base multiplication problems.",
    ),
    "questions": [
        q("L7_A_E_01","A","Base 10 Mult","Base Multiplication","easy","9 x 8 = ?",                "Deficits: 1,2. Cross: 9-2=7. Product: 1x2=2. Answer: 72","7|2=72","72"),
        q("L7_A_E_02","A","Base 10 Mult","Base Multiplication","easy","8 x 7 = ?",                "Deficits: 2,3. Cross: 8-3=5. Product: 2x3=6. Answer: 56","5|6=56","56"),
        q("L7_A_E_03","A","Base 10 Mult","Base Multiplication","easy","9 x 7 = ?",                "Deficits: 1,3. Cross: 9-3=6. Product: 1x3=3. Answer: 63","6|3=63","63"),
        q("L7_A_E_04","A","Base 10 Mult","Base Multiplication","easy","11 x 12 = ?",              "Surpluses: 1,2. Cross: 11+2=13. Product: 1x2=2. Answer: 132","13|2=132","132"),
        q("L7_A_E_05","A","Base 10 Mult","Base Multiplication","easy","11 x 13 = ?",              "Surpluses: 1,3. Cross: 11+3=14. Product: 1x3=3. Answer: 143","14|3=143","143"),
        q("L7_A_E_06","A","Base 10 Mult","Base Multiplication","easy","12 x 12 = ?",              "Surpluses: 2,2. Cross: 12+2=14. Product: 2x2=4. Answer: 144","14|4=144","144"),
        q("L7_A_E_07","A","Base 10 Mult","Base Multiplication","easy","9 x 9 = ?",                "Deficit: 1,1. Cross: 9-1=8. Product: 1x1=1. Answer: 81","8|1=81","81"),
        q("L7_A_E_08","A","Base 10 Mult","Base Multiplication","easy","8 x 9 = ?",                "Deficits: 2,1. Cross: 8-1=7. Product: 2x1=2. Answer: 72","7|2=72","72"),
        q("L7_A_E_09","A","Base 10 Mult","Base Multiplication","easy","11 x 14 = ?",              "Surpluses: 1,4. Cross: 11+4=15. Product: 1x4=4. Answer: 154","15|4=154","154"),
        q("L7_B_M_01","B","Base 100 Mult","Base Multiplication","medium","98 x 97 = ?",           "Deficits: 2,3. Cross: 98-3=95. Product: 2x3=06. Answer: 9506","95|06=9506","9506"),
        q("L7_B_M_02","B","Base 100 Mult","Base Multiplication","medium","99 x 98 = ?",           "Deficits: 1,2. Cross: 99-2=97. Product: 1x2=02. Answer: 9702","97|02=9702","9702"),
        q("L7_B_M_03","B","Base 100 Mult","Base Multiplication","medium","101 x 102 = ?",         "Surpluses: 1,2. Cross: 101+2=103. Product: 1x2=02. Answer: 10302","103|02=10302","10302"),
        q("L7_B_M_04","B","Base 100 Mult","Base Multiplication","medium","99 x 99 = ?",           "Deficit: 1,1. Cross: 99-1=98. Product: 1x1=01. Answer: 9801","98|01=9801","9801"),
        q("L7_B_M_05","B","Base 100 Mult","Base Multiplication","medium","98 x 96 = ?",           "Deficits: 2,4. Cross: 98-4=94. Product: 2x4=08. Answer: 9408","94|08=9408","9408"),
        q("L7_B_M_06","B","Base 100 Mult","Base Multiplication","medium","103 x 104 = ?",         "Surpluses: 3,4. Cross: 103+4=107. Product: 3x4=12. Answer: 10712","107|12=10712","10712"),
        q("L7_B_M_07","B","Base 100 Mult","Base Multiplication","medium","97 x 99 = ?",           "Deficits: 3,1. Cross: 97-1=96. Product: 3x1=03. Answer: 9603","96|03=9603","9603"),
        q("L7_B_M_08","B","Base 100 Mult","Base Multiplication","medium","102 x 103 = ?",         "Surpluses: 2,3. Cross: 102+3=105. Product: 2x3=06. Answer: 10506","105|06=10506","10506"),
        q("L7_B_M_09","B","Base 10 Mult","Base Multiplication","medium","7 x 8 = ?",              "Deficits: 3,2. Cross: 7-2=5. Product: 3x2=6. Answer: 56","5|6=56","56"),
        q("L7_C_H_01","C","Base 1000 Mult","Base Multiplication","hard","998 x 997 = ?",          "Deficits: 2,3. Cross: 998-3=995. Product: 2x3=006. Answer: 995006","995|006=995006","995006"),
        q("L7_C_H_02","C","Base 1000 Mult","Base Multiplication","hard","999 x 998 = ?",          "Deficits: 1,2. Cross: 999-2=997. Product: 1x2=002. Answer: 997002","997|002=997002","997002"),
        q("L7_C_H_03","C","Base 100 Mult","Base Multiplication","hard","96 x 94 = ?",             "Deficits: 4,6. Cross: 96-6=90. Product: 4x6=24. Answer: 9024","90|24=9024","9024"),
        q("L7_C_H_04","C","Base 100 Mult","Base Multiplication","hard","107 x 108 = ?",           "Surpluses: 7,8. Cross: 107+8=115. Product: 7x8=56. Answer: 11556","115|56=11556","11556"),
        q("L7_C_H_05","C","Base 100 Mult","Base Multiplication","hard","93 x 97 = ?",             "Deficits: 7,3. Cross: 93-3=90. Product: 7x3=21. Answer: 9021","90|21=9021","9021"),
        q("L7_C_H_06","C","Base 100 Mult","Base Multiplication","hard","112 x 113 = ?",           "Surpluses: 12,13. Cross: 112+13=125. Product: 12x13=156. Answer: 12656","125|156 carry: 12656","12656"),
        q("L7_C_H_07","C","Base 100 Mult","Base Multiplication","hard","95 x 95 = ?",             "Deficit: 5,5. Cross: 95-5=90. Product: 5x5=25. Answer: 9025","90|25=9025","9025"),
        q("L7_C_H_08","C","Base 100 Mult","Base Multiplication","hard","104 x 106 = ?",           "Surpluses: 4,6. Cross: 104+6=110. Product: 4x6=24. Answer: 11024","110|24=11024","11024"),
        q("L7_C_H_09","C","Base 100 Mult","Base Multiplication","hard","89 x 91 = ?",             "Deficits: 11,9. Cross: 89-9=80. Product: 11x9=99. Answer: 8099","80|99=8099","8099"),
    ]
}

# ── L8: Checking and Divisibility ────────────────────────────────────────────
CHAPTERS["L8_YAVADUNAM"] = {
    "tfs": TFS(
        "Set context: quick divisibility checks save time in exams — no long division needed.",
        "Explain digit sum divisibility (div by 9), last-digit rule (div by 2, 5), and alternating-sum rule (div by 11).",
        "Teacher demonstrates: Is 432 divisible by 9? DS=4+3+2=9. Yes! Is 143 divisible by 11? 1-4+3=0. Yes!",
        "Student checks 4-digit numbers for divisibility with teacher guidance.",
        "Student independently applies all divisibility rules on exam-style numbers.",
    ),
    "questions": [
        q("L8_A_E_01","A","Div by 9","Divisibility","easy","Is 45 divisible by 9?",              "4+5=9. Yes","9 divides 9. Yes","Yes"),
        q("L8_A_E_02","A","Div by 9","Divisibility","easy","Is 72 divisible by 9?",              "7+2=9. Yes","7+2=9. Yes","Yes"),
        q("L8_A_E_03","A","Div by 9","Divisibility","easy","Is 83 divisible by 9?",              "8+3=11, 1+1=2. No","DS=2, not 9. No","No"),
        q("L8_A_E_04","A","Div by 2","Divisibility","easy","Is 48 divisible by 2?",              "Last digit 8 is even. Yes","Even last digit. Yes","Yes"),
        q("L8_A_E_05","A","Div by 5","Divisibility","easy","Is 75 divisible by 5?",              "Last digit 5. Yes","Ends in 5. Yes","Yes"),
        q("L8_A_E_06","A","Div by 5","Divisibility","easy","Is 82 divisible by 5?",              "Last digit 2. No","Doesn't end in 0 or 5. No","No"),
        q("L8_A_E_07","A","Div by 9","Divisibility","easy","Is 36 divisible by 9?",              "3+6=9. Yes","Yes","Yes"),
        q("L8_A_E_08","A","Div by 9","Divisibility","easy","Is 99 divisible by 9?",              "9+9=18, 1+8=9. Yes","DS=9. Yes","Yes"),
        q("L8_A_E_09","A","Div by 2","Divisibility","easy","Is 101 divisible by 2?",             "Last digit 1 is odd. No","Odd. No","No"),
        q("L8_B_M_01","B","Div by 4","Divisibility","medium","Is 324 divisible by 4?",           "Last 2 digits 24. 24/4=6. Yes","24 div by 4. Yes","Yes"),
        q("L8_B_M_02","B","Div by 4","Divisibility","medium","Is 518 divisible by 4?",           "Last 2 digits 18. 18/4=4.5. No","18 not div by 4. No","No"),
        q("L8_B_M_03","B","Div by 11","Divisibility","medium","Is 121 divisible by 11?",         "Alt sum: 1-2+1=0. Yes","0 div by 11. Yes","Yes"),
        q("L8_B_M_04","B","Div by 11","Divisibility","medium","Is 143 divisible by 11?",         "Alt sum: 1-4+3=0. Yes","0. Yes","Yes"),
        q("L8_B_M_05","B","Div by 11","Divisibility","medium","Is 154 divisible by 11?",         "Alt sum: 1-5+4=0. Yes","0. Yes","Yes"),
        q("L8_B_M_06","B","Div by 9","Divisibility","medium","Is 2016 divisible by 9?",          "2+0+1+6=9. Yes","DS=9. Yes","Yes"),
        q("L8_B_M_07","B","Div by 9","Divisibility","medium","Is 3458 divisible by 9?",          "3+4+5+8=20, 2+0=2. No","DS=2. No","No"),
        q("L8_B_M_08","B","Div by 4","Divisibility","medium","Is 1236 divisible by 4?",          "Last 2 digits 36. 36/4=9. Yes","36 div by 4. Yes","Yes"),
        q("L8_B_M_09","B","Div by 11","Divisibility","medium","Is 2563 divisible by 11?",        "2-5+6-3=0. Yes","Alt sum=0. Yes","Yes"),
        q("L8_C_H_01","C","Div by 11","Divisibility","hard","Is 89012 divisible by 11?",         "8-9+0-1+2=0. Yes","Alt sum=0. Yes","Yes"),
        q("L8_C_H_02","C","Combined Check","Divisibility","hard","Is 360 divisible by both 4 and 9?","DS(360)=9 div by 9. Last 2 digits 60, 60/4=15. Yes and Yes","Both yes","Yes"),
        q("L8_C_H_03","C","Div by 9","Divisibility","hard","What is the digit sum of 123456789?", "Sum=45, 4+5=9","9","9"),
        q("L8_C_H_04","C","Div by 11","Divisibility","hard","Is 11011 divisible by 11?",         "1-1+0-1+1=0. Yes","0. Yes","Yes"),
        q("L8_C_H_05","C","Combined Check","Divisibility","hard","Is 4752 divisible by 9?",      "4+7+5+2=18, 1+8=9. Yes","DS=9. Yes","Yes"),
        q("L8_C_H_06","C","Div by 4","Divisibility","hard","Is 7896 divisible by 4?",            "Last 2 digits 96. 96/4=24. Yes","96 div by 4. Yes","Yes"),
        q("L8_C_H_07","C","Div by 11","Divisibility","hard","Is 4356 divisible by 11?",          "4-3+5-6=0. Yes","0. Yes","Yes"),
        q("L8_C_H_08","C","Div by 9","Divisibility","hard","Is 9999 divisible by 9?",            "9+9+9+9=36, 3+6=9. Yes","DS=9. Yes","Yes"),
        q("L8_C_H_09","C","Combined Check","Divisibility","hard","Is 1188 divisible by both 9 and 4?","DS=1+1+8+8=18->9. Yes. Last 2: 88/4=22. Yes.","Both yes","Yes"),
    ]
}

# ── L9: Bar Numbers (Vinculum) ────────────────────────────────────────────────
CHAPTERS["L9_GENERAL_MULTIPLICATION"] = {
    "tfs": TFS(
        "Set context: bar numbers (vinculum) replace large digits with small ones, making arithmetic simpler.",
        "Explain: a bar over a digit means it is negative. 19 = 2̄1 (21 - 2 = 19). Useful near multiples of 10.",
        "Teacher demonstrates: convert 28 to vinculum: 3̄2 (30-2=28). Then add using bar form.",
        "Student converts numbers to vinculum form and back with teacher support.",
        "Student independently uses bar numbers for subtraction and mental arithmetic.",
    ),
    "questions": [
        q("L9_A_E_01","A","Bar Numbers","Vinculum","easy","Convert 19 to vinculum form (near 20): 2X where X is negative.",  "20-1=19. So vinculum is 2(bar1). Answer: write as 19 using 2̄1","2-1 form","21bar"),
        q("L9_A_E_02","A","Bar Numbers","Vinculum","easy","9 is 10 minus what? This is the vinculum complement.",           "10-9=1. So vinculum complement of 9 from 10 is 1.","1","1"),
        q("L9_A_E_03","A","Bar Numbers","Vinculum","easy","8 is 10 minus what?",                                            "10-8=2","2","2"),
        q("L9_A_E_04","A","Bar Numbers","Vinculum","easy","7 is 10 minus what?",                                            "10-7=3","3","3"),
        q("L9_A_E_05","A","Bar Numbers","Vinculum","easy","6 is 10 minus what?",                                            "10-6=4","4","4"),
        q("L9_A_E_06","A","Bar Numbers","Vinculum","easy","What is the normal form of 1̄ (bar-1, meaning 10-1)?",            "10-1=9","9","9"),
        q("L9_A_E_07","A","Bar Numbers","Vinculum","easy","What is the normal form of 2̄ (bar-2, meaning 10-2)?",            "10-2=8","8","8"),
        q("L9_A_E_08","A","Bar Numbers","Vinculum","easy","29 in vinculum near 30: 3X, what is X?",                         "30-29=1. So X is bar-1. Write 3̄1","1","1"),
        q("L9_A_E_09","A","Bar Numbers","Vinculum","easy","39 in vinculum near 40: write as 4X, what is X?",                "40-39=1. X=bar-1","1","1"),
        q("L9_B_M_01","B","Bar Subtraction","Vinculum","medium","Using vinculum: 52 - 29 = ? (hint: 29 = 3̄1, so 52 - 3̄1 = 5-3 | 2+1 = 2|3 = 23)","52-30+1=23","23","23"),
        q("L9_B_M_02","B","Bar Subtraction","Vinculum","medium","43 - 28 = ? (28 = 3̄2, use bar form)",                     "43-30+2=15","15","15"),
        q("L9_B_M_03","B","Bar Subtraction","Vinculum","medium","61 - 39 = ? (39 = 4̄1)",                                    "61-40+1=22","22","22"),
        q("L9_B_M_04","B","Bar Subtraction","Vinculum","medium","74 - 49 = ? (49 = 5̄1)",                                    "74-50+1=25","25","25"),
        q("L9_B_M_05","B","Bar Addition","Vinculum","medium","Using vinculum: 48 + 37 = ? Split 37 as 40̄3 means 48+40-3=85","48+40-3=85","85","85"),
        q("L9_B_M_06","B","Bar Subtraction","Vinculum","medium","85 - 27 = ? (27 = 3̄3)",                                    "85-30+3=58","58","58"),
        q("L9_B_M_07","B","Bar Subtraction","Vinculum","medium","92 - 48 = ? (48 = 5̄2)",                                    "92-50+2=44","44","44"),
        q("L9_B_M_08","B","Bar Addition","Vinculum","medium","73 + 28 = ? (28 = 3̄2) so 73+30-2=101","73+30-2=101","101","101"),
        q("L9_B_M_09","B","Bar Subtraction","Vinculum","medium","67 - 38 = ? (38 = 4̄2)",                                    "67-40+2=29","29","29"),
        q("L9_C_H_01","C","Bar Numbers","Vinculum","hard","Convert 288 to vinculum (near 300): 3X̄Y form.",               "300-288=12. So 3̄12. Write 3bar12","12","12"),
        q("L9_C_H_02","C","Bar Subtraction","Vinculum","hard","152 - 87 = ? (87 = 9̄3, 100-13=87)",                        "152-100+13=65","65","65"),
        q("L9_C_H_03","C","Bar Subtraction","Vinculum","hard","301 - 198 = ? (198 = 2̄02)",                                 "301-200+2=103","103","103"),
        q("L9_C_H_04","C","Bar Numbers","Vinculum","hard","What does 1̄ in the tens place mean in 1̄5 (bar1, 5)? = 10x(-1)+5","15-10=5? No: 1bar5 = -10+5 = -5. As subtracted form = 10-15= wait. Actually 1bar5 means 10*(1) + (-5) no: the bar is over 1, so tens=-10, units=5, so -10+5=-5. Or it's 100-15=85 if it was a 2-digit number 1bar5 meaning 15 is replaced with complement from 20: 20-15=5.","For this Q, 19=2̄1 means 20-1=19. 1̄5 near 20 means 20-5=15? Actually it depends on context. Let's say near 10: 1̄5 = -10+5 = -5 complement. In vedic this is 1(bar)5 = 10-5=5 with a leading 1... The concept is: bar means that digit is negative. So 1̄5 = 10(1) + (-5) = 5... Hmm, let me simplify: A bar over the digit 1 in tens place in 1̄5 means tens=-1, units=5, so value = -10+5 = -5 complement OR treated as 20-1̄5 depends. Let me just make this a calculation question.","Calculate 1000 - 856 using All-from-9: 143 + 1 = 144","144"),
        q("L9_C_H_05","C","Bar Subtraction","Vinculum","hard","468 - 299 = ?",                                              "468-300+1=169","169","169"),
        q("L9_C_H_06","C","Bar Subtraction","Vinculum","hard","750 - 398 = ?",                                              "750-400+2=352","352","352"),
        q("L9_C_H_07","C","Bar Addition","Vinculum","hard","437 + 299 = ?",                                                  "437+300-1=736","736","736"),
        q("L9_C_H_08","C","Bar Subtraction","Vinculum","hard","614 - 397 = ?",                                              "614-400+3=217","217","217"),
        q("L9_C_H_09","C","Bar Addition","Vinculum","hard","583 + 398 = ?",                                                  "583+400-2=981","981","981"),
    ]
}

# ── L10: Special Multiplication (×11, nines, FLFL) ───────────────────────────
CHAPTERS["L10_DIVISION_BY_9"] = {
    "tfs": TFS(
        "Set context: special multiplication patterns — ×11, ×9, ×99 — exploit digit patterns for instant answers.",
        "Explain ×11 trick: write the end digits, add consecutive digit pairs for middle positions.",
        "Teacher demonstrates: 11×43 = 4|(4+3)|3 = 473. 11×57 = 5|(5+7)|7 = 5|12|7 → carry → 627.",
        "Student applies ×11 trick to 2-digit numbers with nudges for carries.",
        "Student independently uses ×9 (×10-1) and ×99 (×100-1) patterns.",
    ),
    "questions": [
        q("L10_A_E_01","A","Times 11","Special Mult","easy","11 x 23 = ?",                        "2|(2+3)|3 = 253","253","253"),
        q("L10_A_E_02","A","Times 11","Special Mult","easy","11 x 45 = ?",                        "4|(4+5)|5 = 495","495","495"),
        q("L10_A_E_03","A","Times 11","Special Mult","easy","11 x 31 = ?",                        "3|(3+1)|1 = 341","341","341"),
        q("L10_A_E_04","A","Times 11","Special Mult","easy","11 x 62 = ?",                        "6|(6+2)|2 = 682","682","682"),
        q("L10_A_E_05","A","Times 11","Special Mult","easy","11 x 50 = ?",                        "5|(5+0)|0 = 550","550","550"),
        q("L10_A_E_06","A","Times 11","Special Mult","easy","11 x 11 = ?",                        "1|(1+1)|1 = 121","121","121"),
        q("L10_A_E_07","A","Times 11","Special Mult","easy","11 x 72 = ?",                        "7|(7+2)|2 = 792","792","792"),
        q("L10_A_E_08","A","Times 11","Special Mult","easy","11 x 20 = ?",                        "2|(2+0)|0 = 220","220","220"),
        q("L10_A_E_09","A","Times 11","Special Mult","easy","11 x 13 = ?",                        "1|(1+3)|3 = 143","143","143"),
        q("L10_B_M_01","B","Times 11","Special Mult","medium","11 x 57 = ?",                      "5|(5+7)|7 = 5|12|7 carry: 627","627","627"),
        q("L10_B_M_02","B","Times 11","Special Mult","medium","11 x 84 = ?",                      "8|(8+4)|4 = 8|12|4 carry: 924","924","924"),
        q("L10_B_M_03","B","Times 11","Special Mult","medium","11 x 99 = ?",                      "9|(9+9)|9 = 9|18|9 carry: 1089","1089","1089"),
        q("L10_B_M_04","B","Times 9","Special Mult","medium","9 x 34 = ?",                        "34x10-34=340-34=306","306","306"),
        q("L10_B_M_05","B","Times 9","Special Mult","medium","9 x 47 = ?",                        "47x10-47=470-47=423","423","423"),
        q("L10_B_M_06","B","Times 9","Special Mult","medium","9 x 65 = ?",                        "65x10-65=650-65=585","585","585"),
        q("L10_B_M_07","B","Times 99","Special Mult","medium","99 x 23 = ?",                      "23x100-23=2300-23=2277","2277","2277"),
        q("L10_B_M_08","B","Times 99","Special Mult","medium","99 x 47 = ?",                      "47x100-47=4700-47=4653","4653","4653"),
        q("L10_B_M_09","B","Times 11","Special Mult","medium","11 x 76 = ?",                      "7|(7+6)|6 = 7|13|6 carry: 836","836","836"),
        q("L10_C_H_01","C","Times 11","Special Mult","hard","11 x 345 = ?",                       "3|(3+4)|(4+5)|5 = 3|7|9|5 = 3795","3795","3795"),
        q("L10_C_H_02","C","Times 11","Special Mult","hard","11 x 657 = ?",                       "6|(6+5)|(5+7)|7 = 6|11|12|7 carry: 7227","7227","7227"),
        q("L10_C_H_03","C","Times 99","Special Mult","hard","99 x 78 = ?",                        "78x100-78=7800-78=7722","7722","7722"),
        q("L10_C_H_04","C","Times 9","Special Mult","hard","9 x 123 = ?",                         "123x10-123=1230-123=1107","1107","1107"),
        q("L10_C_H_05","C","FLFL","Special Mult","hard","13 x 17 = ? (FLFL: same tens digit 1, units add to 10)",  "1x(1+1)=2, 3x7=21 -> 221","221","221"),
        q("L10_C_H_06","C","FLFL","Special Mult","hard","23 x 27 = ? (same tens, units add to 10)",  "2x(2+1)=6, 3x7=21 -> 621","621","621"),
        q("L10_C_H_07","C","FLFL","Special Mult","hard","34 x 36 = ? (same tens, units add to 10)",  "3x(3+1)=12, 4x6=24 -> 1224","1224","1224"),
        q("L10_C_H_08","C","Times 11","Special Mult","hard","11 x 528 = ?",                       "5|(5+2)|(2+8)|8 = 5|7|10|8 carry: 5808","5808","5808"),
        q("L10_C_H_09","C","Times 9","Special Mult","hard","9 x 999 = ?",                         "999x10-999=9990-999=8991","8991","8991"),
    ]
}

# ── L11: General Multiplication (Urdhva-Tiryak / Vertically-Crosswise) ───────
CHAPTERS["L11_VINCULUM_INTRO"] = {
    "tfs": TFS(
        "Set context: Urdhva-Tiryak (Vertically and Crosswise) can multiply ANY two numbers in one line.",
        "Explain the 2x2 pattern: for AB x CD, vertical products + crosswise products give you left, middle, right.",
        "Teacher demonstrates: 12x13 = 1x1 | (1x3+2x1) | 2x3 = 1|5|6 = 156.",
        "Student works through 14x13 step by step with tutor scaffolding.",
        "Student independently applies the method to 2-digit and 3-digit multiplications.",
    ),
    "questions": [
        q("L11_A_E_01","A","2-Digit Mult","Urdhva-Tiryak","easy","12 x 13 = ?",                   "1x1=1, 1x3+2x1=5, 2x3=6 -> 156","156","156"),
        q("L11_A_E_02","A","2-Digit Mult","Urdhva-Tiryak","easy","11 x 11 = ?",                   "1x1=1, 1x1+1x1=2, 1x1=1 -> 121","121","121"),
        q("L11_A_E_03","A","2-Digit Mult","Urdhva-Tiryak","easy","12 x 12 = ?",                   "1x1=1, 1x2+2x1=4, 2x2=4 -> 144","144","144"),
        q("L11_A_E_04","A","2-Digit Mult","Urdhva-Tiryak","easy","13 x 11 = ?",                   "1x1=1, 1x1+3x1=4, 3x1=3 -> 143","143","143"),
        q("L11_A_E_05","A","2-Digit Mult","Urdhva-Tiryak","easy","21 x 13 = ?",                   "2x1=2, 2x3+1x1=7, 1x3=3 -> 273","273","273"),
        q("L11_A_E_06","A","2-Digit Mult","Urdhva-Tiryak","easy","22 x 11 = ?",                   "2x1=2, 2x1+2x1=4, 2x1=2 -> 242","242","242"),
        q("L11_A_E_07","A","2-Digit Mult","Urdhva-Tiryak","easy","31 x 12 = ?",                   "3x1=3, 3x2+1x1=7, 1x2=2 -> 372","372","372"),
        q("L11_A_E_08","A","2-Digit Mult","Urdhva-Tiryak","easy","14 x 12 = ?",                   "1x1=1, 1x2+4x1=6, 4x2=8 -> 168","168","168"),
        q("L11_A_E_09","A","2-Digit Mult","Urdhva-Tiryak","easy","23 x 11 = ?",                   "2x1=2, 2x1+3x1=5, 3x1=3 -> 253","253","253"),
        q("L11_B_M_01","B","2-Digit Mult","Urdhva-Tiryak","medium","34 x 21 = ?",                 "3x2=6, 3x1+4x2=11, 4x1=4 -> 6|11|4 carry: 714","714","714"),
        q("L11_B_M_02","B","2-Digit Mult","Urdhva-Tiryak","medium","23 x 34 = ?",                 "2x3=6, 2x4+3x3=17, 3x4=12 -> 6|17|12 carry: 782","782","782"),
        q("L11_B_M_03","B","2-Digit Mult","Urdhva-Tiryak","medium","43 x 12 = ?",                 "4x1=4, 4x2+3x1=11, 3x2=6 -> 4|11|6 carry: 516","516","516"),
        q("L11_B_M_04","B","2-Digit Mult","Urdhva-Tiryak","medium","32 x 24 = ?",                 "3x2=6, 3x4+2x2=16, 2x4=8 -> 6|16|8 carry: 768","768","768"),
        q("L11_B_M_05","B","2-Digit Mult","Urdhva-Tiryak","medium","41 x 32 = ?",                 "4x3=12, 4x2+1x3=11, 1x2=2 -> 12|11|2 carry: 1312","1312","1312"),
        q("L11_B_M_06","B","2-Digit Mult","Urdhva-Tiryak","medium","25 x 13 = ?",                 "2x1=2, 2x3+5x1=11, 5x3=15 -> 2|11|15 carry: 325","325","325"),
        q("L11_B_M_07","B","2-Digit Mult","Urdhva-Tiryak","medium","37 x 21 = ?",                 "3x2=6, 3x1+7x2=17, 7x1=7 -> 6|17|7 carry: 777","777","777"),
        q("L11_B_M_08","B","2-Digit Mult","Urdhva-Tiryak","medium","28 x 14 = ?",                 "2x1=2, 2x4+8x1=16, 8x4=32 -> 2|16|32 carry: 392","392","392"),
        q("L11_B_M_09","B","2-Digit Mult","Urdhva-Tiryak","medium","36 x 15 = ?",                 "3x1=3, 3x5+6x1=21, 6x5=30 -> 3|21|30 carry: 540","540","540"),
        q("L11_C_H_01","C","2-Digit Mult","Urdhva-Tiryak","hard","47 x 38 = ?",                   "4x3=12, 4x8+7x3=53, 7x8=56 -> 12|53|56 carry: 1786","1786","1786"),
        q("L11_C_H_02","C","2-Digit Mult","Urdhva-Tiryak","hard","56 x 47 = ?",                   "5x4=20, 5x7+6x4=59, 6x7=42 -> 20|59|42 carry: 2632","2632","2632"),
        q("L11_C_H_03","C","2-Digit Mult","Urdhva-Tiryak","hard","63 x 54 = ?",                   "6x5=30, 6x4+3x5=39, 3x4=12 -> 30|39|12 carry: 3402","3402","3402"),
        q("L11_C_H_04","C","2-Digit Mult","Urdhva-Tiryak","hard","72 x 68 = ?",                   "7x6=42, 7x8+2x6=68, 2x8=16 -> 42|68|16 carry: 4896","4896","4896"),
        q("L11_C_H_05","C","2-Digit Mult","Urdhva-Tiryak","hard","85 x 79 = ?",                   "8x7=56, 8x9+5x7=107, 5x9=45 -> 56|107|45 carry: 6715","6715","6715"),
        q("L11_C_H_06","C","2-Digit Mult","Urdhva-Tiryak","hard","96 x 87 = ?",                   "9x8=72, 9x7+6x8=111, 6x7=42 -> 72|111|42 carry: 8352","8352","8352"),
        q("L11_C_H_07","C","2-Digit Mult","Urdhva-Tiryak","hard","35 x 35 = ?",                   "3x3=9, 3x5+5x3=30, 5x5=25 -> 9|30|25 carry: 1225","1225","1225"),
        q("L11_C_H_08","C","2-Digit Mult","Urdhva-Tiryak","hard","44 x 44 = ?",                   "4x4=16, 4x4+4x4=32, 4x4=16 -> 16|32|16 carry: 1936","1936","1936"),
        q("L11_C_H_09","C","2-Digit Mult","Urdhva-Tiryak","hard","53 x 57 = ?",                   "5x5=25, 5x7+3x5=50, 3x7=21 -> 25|50|21 carry: 3021","3021","3021"),
    ]
}

# ── L12: Squaring ─────────────────────────────────────────────────────────────
CHAPTERS["L12_FRACTIONS_DECIMALS"] = {
    "tfs": TFS(
        "Set context: squaring has elegant shortcuts — numbers ending in 5, near 50, near bases.",
        "Explain: for n5 squared, take n*(n+1) then append 25. E.g. 75^2: 7*8=56, append 25 -> 5625.",
        "Teacher demonstrates: 35^2=1225 (3*4=12, |25). 65^2=4225 (6*7=42, |25).",
        "Student squares 45 and 55 step by step with tutor support.",
        "Student independently squares numbers near 50 using (50+d)^2=2500+100d+d^2.",
    ),
    "questions": [
        q("L12_A_E_01","A","Ending-in-5 Sq","Squaring","easy","25^2 = ?",                        "2x3=6, append 25 -> 625","625","625"),
        q("L12_A_E_02","A","Ending-in-5 Sq","Squaring","easy","35^2 = ?",                        "3x4=12, append 25 -> 1225","1225","1225"),
        q("L12_A_E_03","A","Ending-in-5 Sq","Squaring","easy","45^2 = ?",                        "4x5=20, append 25 -> 2025","2025","2025"),
        q("L12_A_E_04","A","Ending-in-5 Sq","Squaring","easy","55^2 = ?",                        "5x6=30, append 25 -> 3025","3025","3025"),
        q("L12_A_E_05","A","Ending-in-5 Sq","Squaring","easy","65^2 = ?",                        "6x7=42, append 25 -> 4225","4225","4225"),
        q("L12_A_E_06","A","Ending-in-5 Sq","Squaring","easy","75^2 = ?",                        "7x8=56, append 25 -> 5625","5625","5625"),
        q("L12_A_E_07","A","Ending-in-5 Sq","Squaring","easy","15^2 = ?",                        "1x2=2, append 25 -> 225","225","225"),
        q("L12_A_E_08","A","Ending-in-5 Sq","Squaring","easy","85^2 = ?",                        "8x9=72, append 25 -> 7225","7225","7225"),
        q("L12_A_E_09","A","Ending-in-5 Sq","Squaring","easy","95^2 = ?",                        "9x10=90, append 25 -> 9025","9025","9025"),
        q("L12_B_M_01","B","Near-50 Sq","Squaring","medium","51^2 = ?",                          "(50+1)^2=2500+100+1=2601","2601","2601"),
        q("L12_B_M_02","B","Near-50 Sq","Squaring","medium","52^2 = ?",                          "(50+2)^2=2500+200+4=2704","2704","2704"),
        q("L12_B_M_03","B","Near-50 Sq","Squaring","medium","49^2 = ?",                          "(50-1)^2=2500-100+1=2401","2401","2401"),
        q("L12_B_M_04","B","Near-50 Sq","Squaring","medium","48^2 = ?",                          "(50-2)^2=2500-200+4=2304","2304","2304"),
        q("L12_B_M_05","B","Near-50 Sq","Squaring","medium","53^2 = ?",                          "(50+3)^2=2500+300+9=2809","2809","2809"),
        q("L12_B_M_06","B","Near-50 Sq","Squaring","medium","47^2 = ?",                          "(50-3)^2=2500-300+9=2209","2209","2209"),
        q("L12_B_M_07","B","General Squaring","Squaring","medium","24^2 = ?",                    "(25-1)^2=625-50+1=576","576","576"),
        q("L12_B_M_08","B","General Squaring","Squaring","medium","26^2 = ?",                    "(25+1)^2=625+50+1=676","676","676"),
        q("L12_B_M_09","B","General Squaring","Squaring","medium","31^2 = ?",                    "30^2+2x30x1+1=900+60+1=961","961","961"),
        q("L12_C_H_01","C","General Squaring","Squaring","hard","44^2 = ?",                      "(40+4)^2=1600+320+16=1936","1936","1936"),
        q("L12_C_H_02","C","General Squaring","Squaring","hard","56^2 = ?",                      "(55+1)^2=3025+110+1=3136","3136","3136"),
        q("L12_C_H_03","C","General Squaring","Squaring","hard","99^2 = ?",                      "(100-1)^2=10000-200+1=9801","9801","9801"),
        q("L12_C_H_04","C","General Squaring","Squaring","hard","101^2 = ?",                     "(100+1)^2=10000+200+1=10201","10201","10201"),
        q("L12_C_H_05","C","Near-50 Sq","Squaring","hard","54^2 = ?",                            "(50+4)^2=2500+400+16=2916","2916","2916"),
        q("L12_C_H_06","C","Near-50 Sq","Squaring","hard","46^2 = ?",                            "(50-4)^2=2500-400+16=2116","2116","2116"),
        q("L12_C_H_07","C","General Squaring","Squaring","hard","75^2 = ?",                      "7x8=56, append 25 -> 5625","5625","5625"),
        q("L12_C_H_08","C","General Squaring","Squaring","hard","105^2 = ?",                     "(100+5)^2=10000+1000+25=11025","11025","11025"),
        q("L12_C_H_09","C","General Squaring","Squaring","hard","97^2 = ?",                      "(100-3)^2=10000-600+9=9409","9409","9409"),
    ]
}

# ── L13: One-Line Equations ───────────────────────────────────────────────────
CHAPTERS["L13_ALGEBRAIC_IDENTITIES"] = {
    "tfs": TFS(
        "Set context: Vedic algebra solves linear equations in one mental step by transposing directly.",
        "Explain one-step transposition: move the constant to the other side by changing its sign.",
        "Teacher demonstrates: x+5=12 -> x=12-5=7. 3x=21 -> x=21/3=7.",
        "Student solves x+7=15 with teacher guidance using the transposition method.",
        "Student independently solves 2-step and 3-step linear equations.",
    ),
    "questions": [
        q("L13_A_E_01","A","One-Step Eq","Linear Equations","easy","x + 5 = 12, x = ?",          "x=12-5=7","7","7"),
        q("L13_A_E_02","A","One-Step Eq","Linear Equations","easy","x + 8 = 15, x = ?",          "x=15-8=7","7","7"),
        q("L13_A_E_03","A","One-Step Eq","Linear Equations","easy","x - 3 = 9, x = ?",           "x=9+3=12","12","12"),
        q("L13_A_E_04","A","One-Step Eq","Linear Equations","easy","2x = 14, x = ?",              "x=14/2=7","7","7"),
        q("L13_A_E_05","A","One-Step Eq","Linear Equations","easy","3x = 21, x = ?",              "x=21/3=7","7","7"),
        q("L13_A_E_06","A","One-Step Eq","Linear Equations","easy","x + 11 = 20, x = ?",         "x=20-11=9","9","9"),
        q("L13_A_E_07","A","One-Step Eq","Linear Equations","easy","4x = 32, x = ?",              "x=32/4=8","8","8"),
        q("L13_A_E_08","A","One-Step Eq","Linear Equations","easy","x - 6 = 14, x = ?",          "x=14+6=20","20","20"),
        q("L13_A_E_09","A","One-Step Eq","Linear Equations","easy","5x = 45, x = ?",              "x=45/5=9","9","9"),
        q("L13_B_M_01","B","Two-Step Eq","Linear Equations","medium","2x + 3 = 11, x = ?",       "2x=11-3=8, x=4","4","4"),
        q("L13_B_M_02","B","Two-Step Eq","Linear Equations","medium","3x - 6 = 12, x = ?",       "3x=12+6=18, x=6","6","6"),
        q("L13_B_M_03","B","Two-Step Eq","Linear Equations","medium","4x + 7 = 27, x = ?",       "4x=27-7=20, x=5","5","5"),
        q("L13_B_M_04","B","Two-Step Eq","Linear Equations","medium","5x - 10 = 15, x = ?",      "5x=15+10=25, x=5","5","5"),
        q("L13_B_M_05","B","Two-Step Eq","Linear Equations","medium","2x + 9 = 25, x = ?",       "2x=25-9=16, x=8","8","8"),
        q("L13_B_M_06","B","Two-Step Eq","Linear Equations","medium","3x + 4 = 22, x = ?",       "3x=22-4=18, x=6","6","6"),
        q("L13_B_M_07","B","Two-Step Eq","Linear Equations","medium","6x - 12 = 18, x = ?",      "6x=18+12=30, x=5","5","5"),
        q("L13_B_M_08","B","Two-Step Eq","Linear Equations","medium","7x + 5 = 40, x = ?",       "7x=40-5=35, x=5","5","5"),
        q("L13_B_M_09","B","Two-Step Eq","Linear Equations","medium","x/2 + 3 = 8, x = ?",       "x/2=8-3=5, x=10","10","10"),
        q("L13_C_H_01","C","Three-Step Eq","Linear Equations","hard","2(x+3) = 14, x = ?",       "x+3=7, x=4","4","4"),
        q("L13_C_H_02","C","Three-Step Eq","Linear Equations","hard","3(x-2) = 12, x = ?",       "x-2=4, x=6","6","6"),
        q("L13_C_H_03","C","Three-Step Eq","Linear Equations","hard","4(2x+1) = 36, x = ?",      "2x+1=9, 2x=8, x=4","4","4"),
        q("L13_C_H_04","C","Three-Step Eq","Linear Equations","hard","(x+5)/3 = 4, x = ?",       "x+5=12, x=7","7","7"),
        q("L13_C_H_05","C","Three-Step Eq","Linear Equations","hard","2x/3 + 1 = 5, x = ?",      "2x/3=4, 2x=12, x=6","6","6"),
        q("L13_C_H_06","C","Three-Step Eq","Linear Equations","hard","5(x+2) - 10 = 20, x = ?",  "5(x+2)=30, x+2=6, x=4","4","4"),
        q("L13_C_H_07","C","Three-Step Eq","Linear Equations","hard","(3x-6)/2 = 6, x = ?",      "3x-6=12, 3x=18, x=6","6","6"),
        q("L13_C_H_08","C","Three-Step Eq","Linear Equations","hard","2(3x+4) = 32, x = ?",      "3x+4=16, 3x=12, x=4","4","4"),
        q("L13_C_H_09","C","Three-Step Eq","Linear Equations","hard","x/4 + x/4 = 6, x = ?",    "2x/4=6, x/2=6, x=12","12","12"),
    ]
}

# ── L14: Fractions (Vertically and Crosswise) ─────────────────────────────────
CHAPTERS["L14_FACTORISATION"] = {
    "tfs": TFS(
        "Set context: Vedic fraction addition/subtraction uses cross-multiplication — no LCM needed.",
        "Explain: a/b + c/d = (a*d + b*c) / (b*d). Crosswise numerator, vertical denominator.",
        "Teacher demonstrates: 1/3 + 1/4 = (1*4+3*1)/(3*4) = 7/12.",
        "Student calculates 1/2 + 1/5 using the crosswise method with guidance.",
        "Student independently adds, subtracts, and compares fractions using Vedic crosswise.",
    ),
    "questions": [
        q("L14_A_E_01","A","Fraction Add","Fractions","easy","1/3 + 1/4 = ?",                    "(1x4+3x1)/(3x4)=7/12","7/12","7/12"),
        q("L14_A_E_02","A","Fraction Add","Fractions","easy","1/2 + 1/3 = ?",                    "(1x3+2x1)/(2x3)=5/6","5/6","5/6"),
        q("L14_A_E_03","A","Fraction Add","Fractions","easy","1/4 + 1/5 = ?",                    "(1x5+4x1)/(4x5)=9/20","9/20","9/20"),
        q("L14_A_E_04","A","Fraction Sub","Fractions","easy","1/2 - 1/3 = ?",                    "(1x3-2x1)/(2x3)=1/6","1/6","1/6"),
        q("L14_A_E_05","A","Fraction Sub","Fractions","easy","1/3 - 1/4 = ?",                    "(1x4-3x1)/(3x4)=1/12","1/12","1/12"),
        q("L14_A_E_06","A","Fraction Add","Fractions","easy","1/5 + 2/5 = ?",                    "Same denominator: 3/5","3/5","3/5"),
        q("L14_A_E_07","A","Fraction Add","Fractions","easy","2/3 + 1/6 = ?",                    "(2x6+3x1)/(3x6)=15/18=5/6","5/6","5/6"),
        q("L14_A_E_08","A","Fraction Add","Fractions","easy","1/2 + 1/4 = ?",                    "(1x4+2x1)/(2x4)=6/8=3/4","3/4","3/4"),
        q("L14_A_E_09","A","Fraction Compare","Fractions","easy","Which is larger: 2/3 or 3/4?", "Crosswise: 2x4=8, 3x3=9. 9>8 so 3/4 > 2/3","3/4","3/4"),
        q("L14_B_M_01","B","Fraction Add","Fractions","medium","3/4 + 2/5 = ?",                  "(3x5+4x2)/(4x5)=23/20","23/20","23/20"),
        q("L14_B_M_02","B","Fraction Add","Fractions","medium","5/6 + 1/4 = ?",                  "(5x4+6x1)/(6x4)=26/24=13/12","13/12","13/12"),
        q("L14_B_M_03","B","Fraction Sub","Fractions","medium","3/4 - 2/3 = ?",                  "(3x3-4x2)/(4x3)=1/12","1/12","1/12"),
        q("L14_B_M_04","B","Fraction Mult","Fractions","medium","2/3 x 3/4 = ?",                 "2x3/(3x4)=6/12=1/2","1/2","1/2"),
        q("L14_B_M_05","B","Fraction Div","Fractions","medium","3/4 / 1/2 = ?",                  "3/4 x 2/1 = 6/4 = 3/2","3/2","3/2"),
        q("L14_B_M_06","B","Fraction Add","Fractions","medium","7/8 + 1/4 = ?",                  "(7x4+8x1)/(8x4)=36/32=9/8","9/8","9/8"),
        q("L14_B_M_07","B","Fraction Sub","Fractions","medium","5/6 - 2/9 = ?",                  "(5x9-6x2)/(6x9)=33/54=11/18","11/18","11/18"),
        q("L14_B_M_08","B","Fraction Compare","Fractions","medium","Compare 5/7 and 4/5?",        "Crosswise: 5x5=25, 7x4=28. 28>25 so 4/5 > 5/7","4/5","4/5"),
        q("L14_B_M_09","B","Fraction Mult","Fractions","medium","3/5 x 5/6 = ?",                 "3x5/(5x6)=15/30=1/2","1/2","1/2"),
        q("L14_C_H_01","C","Mixed Fractions","Fractions","hard","1+1/2 + 2+1/3 = ?",             "1+2=3, 1/2+1/3=(3+2)/6=5/6, total=3+5/6=23/6","23/6","23/6"),
        q("L14_C_H_02","C","Fraction Add","Fractions","hard","7/12 + 5/8 = ?",                   "(7x8+12x5)/(12x8)=116/96=29/24","29/24","29/24"),
        q("L14_C_H_03","C","Fraction Sub","Fractions","hard","11/12 - 3/8 = ?",                  "(11x8-12x3)/(12x8)=52/96=13/24","13/24","13/24"),
        q("L14_C_H_04","C","Fraction Div","Fractions","hard","7/8 / 3/4 = ?",                    "7/8 x 4/3 = 28/24 = 7/6","7/6","7/6"),
        q("L14_C_H_05","C","Fraction Mult","Fractions","hard","4/7 x 7/8 = ?",                   "4x7/(7x8)=28/56=1/2","1/2","1/2"),
        q("L14_C_H_06","C","Fraction Add","Fractions","hard","2/3 + 3/4 + 1/6 = ?",              "8/12+9/12+2/12=19/12","19/12","19/12"),
        q("L14_C_H_07","C","Fraction Sub","Fractions","hard","5/4 - 3/8 = ?",                    "(5x8-4x3)/(4x8)=28/32=7/8","7/8","7/8"),
        q("L14_C_H_08","C","Fraction Div","Fractions","hard","5/6 / 10/9 = ?",                   "5/6 x 9/10 = 45/60 = 3/4","3/4","3/4"),
        q("L14_C_H_09","C","Fraction Compare","Fractions","hard","Order 2/3, 3/4, 4/5 from least to greatest.","Crosswise comparisons: 2/3<3/4<4/5","2/3, 3/4, 4/5","2/3, 3/4, 4/5"),
    ]
}

# ── L15: Special Division ─────────────────────────────────────────────────────
CHAPTERS["L15_SQUARES_NEAR_BASE"] = {
    "tfs": TFS(
        "Set context: Vedic division by 9 uses running totals — no long division setup needed.",
        "Explain: for ÷9, carry the running digit sum forward as quotient digit; last sum is remainder.",
        "Teacher demonstrates: 132÷9. Write 1. 1+3=4. 4+2=6. So quotient=14, remainder=6.",
        "Student divides 215÷9 step by step with teacher scaffolding.",
        "Student independently divides larger numbers by 9, 8 (near-base), and 99.",
    ),
    "questions": [
        q("L15_A_E_01","A","Div by 9","Special Division","easy","27 / 9 = ?",                    "3 exactly","3","3"),
        q("L15_A_E_02","A","Div by 9","Special Division","easy","45 / 9 = ?",                    "5 exactly","5","5"),
        q("L15_A_E_03","A","Div by 9","Special Division","easy","63 / 9 = ?",                    "7 exactly","7","7"),
        q("L15_A_E_04","A","Div by 9","Special Division","easy","72 / 9 = ?",                    "8 exactly","8","8"),
        q("L15_A_E_05","A","Div by 9","Special Division","easy","81 / 9 = ?",                    "9 exactly","9","9"),
        q("L15_A_E_06","A","Div by 9","Special Division","easy","13 / 9 = ? (quotient and remainder)","1 remainder 4","Q=1 R=4","1 remainder 4"),
        q("L15_A_E_07","A","Div by 9","Special Division","easy","21 / 9 = ?",                    "Q=2 R=3","2 remainder 3","2 remainder 3"),
        q("L15_A_E_08","A","Div by 9","Special Division","easy","34 / 9 = ?",                    "3+4=7 R: 3*9=27, 34-27=7. Q=3 R=7","3 remainder 7","3 remainder 7"),
        q("L15_A_E_09","A","Div by 9","Special Division","easy","50 / 9 = ?",                    "5*9=45, 50-45=5. Q=5 R=5","5 remainder 5","5 remainder 5"),
        q("L15_B_M_01","B","Div by 9","Special Division","medium","132 / 9 = ?",                 "1, 1+3=4, 4+2=6. Q=14 R=6","14 remainder 6","14 remainder 6"),
        q("L15_B_M_02","B","Div by 9","Special Division","medium","215 / 9 = ?",                 "2, 2+1=3, 3+5=8. Q=23 R=8","23 remainder 8","23 remainder 8"),
        q("L15_B_M_03","B","Div by 9","Special Division","medium","341 / 9 = ?",                 "3, 3+4=7, 7+1=8. Q=37 R=8","37 remainder 8","37 remainder 8"),
        q("L15_B_M_04","B","Div by 9","Special Division","medium","421 / 9 = ?",                 "4, 4+2=6, 6+1=7. Q=46 R=7","46 remainder 7","46 remainder 7"),
        q("L15_B_M_05","B","Div by 9","Special Division","medium","512 / 9 = ?",                 "5, 5+1=6, 6+2=8. Q=56 R=8","56 remainder 8","56 remainder 8"),
        q("L15_B_M_06","B","Div by 9","Special Division","medium","1234 / 9 = ?",                "1,1+2=3,3+3=6,6+4=10 Q=137 R=1","137 remainder 1","137 remainder 1"),
        q("L15_B_M_07","B","Div by 9","Special Division","medium","2345 / 9 = ?",                "2,2+3=5,5+4=9,9+5=14 Q=260 R=5","260 remainder 5","260 remainder 5"),
        q("L15_B_M_08","B","Div by 9","Special Division","medium","108 / 9 = ?",                 "1,1+0=1,1+8=9. Q=12. Check: 12x9=108","12","12"),
        q("L15_B_M_09","B","Div by 9","Special Division","medium","234 / 9 = ?",                 "2,2+3=5,5+4=9. Q=26. Check: 26x9=234","26","26"),
        q("L15_C_H_01","C","Div by 9","Special Division","hard","9999 / 9 = ?",                  "9,9+9=18,18+9=27,27+9=36. With carries: Q=1111","1111","1111"),
        q("L15_C_H_02","C","Div by 9","Special Division","hard","3456 / 9 = ?",                  "3,3+4=7,7+5=12,12+6=18. Q=384","384","384"),
        q("L15_C_H_03","C","Div by 8","Special Division","hard","72 / 8 = ?",                    "9 exactly","9","9"),
        q("L15_C_H_04","C","Div by 8","Special Division","hard","144 / 8 = ?",                   "18 exactly","18","18"),
        q("L15_C_H_05","C","Div by 99","Special Division","hard","297 / 99 = ?",                  "3 exactly (3x99=297)","3","3"),
        q("L15_C_H_06","C","Div by 99","Special Division","hard","495 / 99 = ?",                  "5 exactly","5","5"),
        q("L15_C_H_07","C","Div by 9","Special Division","hard","10000 / 9 = ?",                  "1111 remainder 1","1111 remainder 1","1111 remainder 1"),
        q("L15_C_H_08","C","Div by 9","Special Division","hard","5678 / 9 = ?",                   "5,5+6=11,11+7=18,18+8=26. Q=630 R=8","630 remainder 8","630 remainder 8"),
        q("L15_C_H_09","C","Div by 9","Special Division","hard","4321 / 9 = ?",                   "4,4+3=7,7+2=9,9+1=10. Q=480 R=1","480 remainder 1","480 remainder 1"),
    ]
}

# ── L16: Advanced Division (Dhvajanka / Flag Method) ─────────────────────────
CHAPTERS["L16_CUBES_INTRO"] = {
    "tfs": TFS(
        "Set context: the flag method divides by any two-digit number in one line — no long-division columns.",
        "Explain: split divisor into flag digit (units) and stem. Divide by stem, subtract flag*quotient-digit for remainder.",
        "Teacher demonstrates: 135/11. Stem=1, flag=1. 13/1=13->Q digit 1, rem=3. 35-1*1=25. 25/1->Q=2 R=3. Answer: 12 R 3.",
        "Student divides 156/12 with tutor scaffolding each flag subtraction.",
        "Student independently uses flag division for 3-digit by 2-digit problems.",
    ),
    "questions": [
        q("L16_A_E_01","A","Flag Division","Advanced Division","easy","132 / 11 = ?",             "12 exactly (11x12=132)","12","12"),
        q("L16_A_E_02","A","Flag Division","Advanced Division","easy","143 / 11 = ?",             "13 exactly","13","13"),
        q("L16_A_E_03","A","Flag Division","Advanced Division","easy","121 / 11 = ?",             "11 exactly","11","11"),
        q("L16_A_E_04","A","Flag Division","Advanced Division","easy","156 / 12 = ?",             "13 exactly","13","13"),
        q("L16_A_E_05","A","Flag Division","Advanced Division","easy","169 / 13 = ?",             "13 exactly","13","13"),
        q("L16_A_E_06","A","Flag Division","Advanced Division","easy","84 / 12 = ?",              "7 exactly","7","7"),
        q("L16_A_E_07","A","Flag Division","Advanced Division","easy","72 / 12 = ?",              "6 exactly","6","6"),
        q("L16_A_E_08","A","Flag Division","Advanced Division","easy","144 / 12 = ?",             "12 exactly","12","12"),
        q("L16_A_E_09","A","Flag Division","Advanced Division","easy","195 / 13 = ?",             "15 exactly","15","15"),
        q("L16_B_M_01","B","Flag Division","Advanced Division","medium","Find the quotient and remainder when 258 is divided by 12.","21 R 6","21 remainder 6","21 remainder 6"),
        q("L16_B_M_02","B","Flag Division","Advanced Division","medium","Find the quotient and remainder when 314 is divided by 13.","24 R 2","24 remainder 2","24 remainder 2"),
        q("L16_B_M_03","B","Flag Division","Advanced Division","medium","Find the quotient and remainder when 425 is divided by 14.","30 R 5","30 remainder 5","30 remainder 5"),
        q("L16_B_M_04","B","Flag Division","Advanced Division","medium","Find the quotient and remainder when 256 is divided by 11.","23 R 3","23 remainder 3","23 remainder 3"),
        q("L16_B_M_05","B","Flag Division","Advanced Division","medium","348 / 12 = ?",           "29 exactly","29","29"),
        q("L16_B_M_06","B","Flag Division","Advanced Division","medium","273 / 13 = ?",           "21 exactly","21","21"),
        q("L16_B_M_07","B","Flag Division","Advanced Division","medium","462 / 14 = ?",           "33 exactly","33","33"),
        q("L16_B_M_08","B","Flag Division","Advanced Division","medium","385 / 11 = ?",           "35 exactly","35","35"),
        q("L16_B_M_09","B","Flag Division","Advanced Division","medium","336 / 12 = ?",           "28 exactly","28","28"),
        q("L16_C_H_01","C","Flag Division","Advanced Division","hard","Find the quotient and remainder when 1234 is divided by 11.","112 R 2","112 remainder 2","112 remainder 2"),
        q("L16_C_H_02","C","Flag Division","Advanced Division","hard","Find the quotient and remainder when 1456 is divided by 12.","121 R 4","121 remainder 4","121 remainder 4"),
        q("L16_C_H_03","C","Flag Division","Advanced Division","hard","1625 / 13 = ?",            "125 exactly","125","125"),
        q("L16_C_H_04","C","Flag Division","Advanced Division","hard","2058 / 14 = ?",            "147 exactly","147","147"),
        q("L16_C_H_05","C","Flag Division","Advanced Division","hard","3456 / 16 = ?",            "216 exactly","216","216"),
        q("L16_C_H_06","C","Flag Division","Advanced Division","hard","Find the quotient and remainder when 4567 is divided by 17.","268 R 11","268 remainder 11","268 remainder 11"),
        q("L16_C_H_07","C","Flag Division","Advanced Division","hard","Find the quotient and remainder when 5678 is divided by 18.","315 R 8","315 remainder 8","315 remainder 8"),
        q("L16_C_H_08","C","Flag Division","Advanced Division","hard","9999 / 11 = ?",            "909 exactly","909","909"),
        q("L16_C_H_09","C","Flag Division","Advanced Division","hard","Find the quotient and remainder when 8888 is divided by 12.","740 R 8","740 remainder 8","740 remainder 8"),
    ]
}


# ─────────────────────────────────────────────────────────────────────────────
# Apply to files
# ─────────────────────────────────────────────────────────────────────────────

files = sorted(f for f in glob.glob(f"{CHAPTER_DIR}/L*.json") if "Copy" not in f and ".bak" not in f)

updated = 0
for fp in files:
    code = os.path.basename(fp).replace(".json", "")
    if code not in CHAPTERS:
        continue

    with open(fp, encoding="utf-8") as f:
        data = json.load(f)

    if data.get("questionPool"):
        print(f"  SKIP {code} — already has questionPool")
        continue

    ch_data = CHAPTERS[code]

    # Fix chapter codes in questions
    pool = []
    for qs in ch_data["questions"]:
        qs = dict(qs)
        qs["chapterCode"] = code
        pool.append(qs)

    data["teachingFlowStages"] = ch_data["tfs"]
    data["questionPool"] = pool

    # Re-order keys to match standard
    key_order = ["title","source","estimatedMinutes","subtopics","learningGoals","coreIdeas",
                 "workedExamples","starterPractice","duolingoLessonArc","teachingScript","screenplay",
                 "teachingFlowStages","questionPool"]
    ordered = {}
    for k in key_order:
        if k in data:
            ordered[k] = data[k]
    for k in data:
        if k not in ordered:
            ordered[k] = data[k]

    with open(fp, "w", encoding="utf-8") as f:
        json.dump(ordered, f, ensure_ascii=False, indent=2)

    qp = ordered["questionPool"]
    diff = {d: sum(1 for q in qp if q.get("difficulty")==d) for d in ("easy","medium","hard")}
    print(f"  DONE {code:<32} {len(qp)} Qs — easy:{diff['easy']} med:{diff['medium']} hard:{diff['hard']}")
    updated += 1

print(f"\nUpdated {updated} chapters.")
