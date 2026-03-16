"""
Add missing G/H/I intro screenplay beats to chapters that lack them.
Run: python scripts/add_ghi_teacher_lines.py
"""
import json, os, glob, copy

CHAPTER_DIR = os.path.join(
    os.path.dirname(__file__),
    "../content-template/vedic_math/chapter"
)

# Teacher lines for each chapter / group combination
# Format: CHAPTER_CODE -> { "G": (subtopic, teacherLine), "H": ..., "I": ... }
TEACHER_LINES = {
    "L4_VERTICAL_CROSSWISE": {
        "H": ("Challenge: Doubling and Halving",
              "Ready to double your speed? Doubling and halving is a Vedic shortcut that turns awkward multiplications into instant mental steps. When one number is even, halve it while doubling the other — the product stays identical. Let us drill this powerful trick!"),
        "I": ("Mastery: Three-digit Addition",
              "Final mastery check! Three-digit left-to-right addition — prove you can handle any size number with the same calm, left-to-right Vedic flow. One method, all sizes, full confidence!"),
    },
    "L5_ALL_FROM_9_LAST_FROM_10": {
        "G": ("Review: Mixed Complements",
              "Review time! Complements from base 10, 100, and 1000 — let us revisit them all and make sure every pattern is locked in memory. Same sutra, every scale. Ready to review?"),
        "H": ("Challenge: Larger Bases",
              "Now the real challenge — bases above 100! The sutra All from 9 and Last from 10 works perfectly for 1000 and beyond. Bigger numbers, same elegance, same speed. Let us go!"),
        "I": ("Mastery: Integration",
              "Grand finale! Mixed complements from base 10, 100, and 1000 all in one set. You have all the tools — show full mastery now. Every question is a chance to shine!"),
    },
    "L6_NIKHILAM_BASE_10_100": {
        "G": ("Review: Addition by Splitting",
              "Review round! Addition by number splitting — break each number at the tens boundary, add the parts, then combine. Let us drill until it feels completely automatic!"),
        "H": ("Challenge: Larger Addition Split",
              "Stepping up to three and four-digit numbers! Same split technique at the hundreds boundary. Can you keep the same speed on bigger numbers? Let us find out!"),
        "I": ("Mastery: Addition Splitting",
              "Mastery check — mixed problems at any split point you choose. Show that number splitting is now your first, fastest instinct. This is the Vedic way!"),
    },
    "L7_SQUARES_ENDING_5": {
        "G": ("Review: Below-Base Multiplication",
              "Review! Base multiplication when both numbers are below the base — find the deficiency, cross-add, multiply the deficiencies. Let us build speed and remove any hesitation!"),
        "H": ("Challenge: Near 1000",
              "Ultimate challenge — numbers near 1000! The base method scales perfectly upward. 997 times 994? With deficiency thinking, it is just as easy as 8 times 7. Let us prove it!"),
        "I": ("Mastery: Both Above Base",
              "Final twist — both numbers are ABOVE the base! Deficiency becomes surplus, cross-add goes up instead of down. Same method, flipped sign. Mastery means handling BOTH directions!"),
    },
    "L8_YAVADUNAM": {
        "G": ("Review: Digit-Sum Check",
              "Review the digit-sum check! Before accepting any multiplication answer, cast out the nines and compare. If the digit sums multiply correctly, your answer is very likely right. Let us drill this verification habit!"),
        "H": ("Challenge: Divisibility by 11",
              "Challenge level — divisibility by 11! Alternating digit difference: add odd-position digits, subtract even-position digits. If the result is 0 or a multiple of 11, it divides exactly. Elegant, fast, and powerful!"),
        "I": ("Mastery: Triple Check",
              "Mastery round! Combine all three checks — rebuild check, first-by-first estimate, last-digit check — for a set of mixed problems. A Vedic mathematician never trusts an answer without verifying it!"),
    },
    "L9_GENERAL_MULTIPLICATION": {
        "G": ("Review: Single Bar Digit",
              "Review bar numbers with a single vinculum digit! Remember — a bar over a digit means it is negative. Reduce step by step: increase the digit to the left by 1, replace the bar digit with its ten-complement. Let us go!"),
        "H": ("Challenge: Multiple Bar Digits",
              "Challenge — multiple bar digits in one number! Convert each bar digit individually, carrying adjustments carefully from right to left. Precision matters here. Take each step with confidence!"),
        "I": ("Mastery: Converting Fluently",
              "Mastery! Convert numbers to and from vinculum form without hesitation. This fluency is the foundation of the most advanced Vedic multiplication. You are very close to the summit now!"),
    },
    "L10_DIVISION_BY_9": {
        "G": ("Review: Multiply by 11",
              "Review multiplying by 11 — the inside-outside rule! Write the outer digits as they are, then sum each adjacent pair for the middle digits. Works for any length number. Let us build fluency!"),
        "H": ("Challenge: Three-digit Times 11",
              "Challenge — three-digit numbers times 11! Two inside digits appear now. Sum pairs carefully: ones plus tens gives the second digit, tens plus hundreds gives the third. Stay precise and the answer writes itself!"),
        "I": ("Mastery: Speed Round Multiply by 11",
              "Mastery sprint! Random two and three-digit numbers times 11 — give the answer in under 3 seconds each. You know the pattern inside out. Trust it and let it flow!"),
    },
    "L11_VINCULUM_INTRO": {
        "G": ("Review: Left-to-Right Multiplication",
              "Review left-to-right multiplication! Start from the most significant digit, write partial products as you build, then combine neatly. No carrying chaos — just clean left-to-right flow!"),
        "H": ("Challenge: Two-Figure Multiplication",
              "Challenge — two-figure times two-figure using vertical and crosswise! Four partial products appear: two singles for the ends, two cross-products added together for the middle. This is the heart of Vedic general multiplication!"),
        "I": ("Mastery: Mixed Multiplications",
              "Mastery! Random two-figure multiplications — use whichever Vedic method feels fastest to you. Left-to-right or vertical-crosswise, the answer should arrive instantly. Prove your full fluency now!"),
    },
    "L12_FRACTIONS_DECIMALS": {
        "G": ("Review: Squaring Ending in 5",
              "Review squaring numbers ending in 5! Multiply the tens digit by one more than itself, then attach 25 at the end. 75 squared: seven times eight is 56, so the answer is 5625. Quick as a flash!"),
        "H": ("Challenge: Three-Digit Ending in 5",
              "Challenge — three-digit numbers ending in 5! Same rule but the tens part is now a two-digit number. 125 squared: 12 times 13 equals 156, attach 25 — answer is 15625. Larger numbers, same elegance!"),
        "I": ("Mastery: Squaring Speed Round",
              "Mastery sprint! Random numbers ending in 5, from two-digit to three-digit. Give the square instantly — no working paper needed at this stage. The pattern is yours permanently!"),
    },
    "L13_ALGEBRAIC_IDENTITIES": {
        "G": ("Review: One-Step Equations",
              "Review one-step equations! Transpose the constant to the other side, changing its sign. One operation, one answer — let us build speed until it feels automatic and effortless!"),
        "H": ("Challenge: Bracket Equations",
              "Challenge — equations with brackets! Expand first using the distributive law, then transpose. Two steps, but the same Vedic logic at each stage. Work carefully and the solution always appears!"),
        "I": ("Mastery: Multi-Step Equations",
              "Mastery — multi-step equations mixing brackets, negatives, and fractions. Apply each principle in sequence with full confidence. Show that algebra holds absolutely no mystery for a Vedic student!"),
    },
    "L14_FACTORISATION": {
        "G": ("Review: Fraction Addition",
              "Review fraction addition — same denominator first, then cross-multiply for different denominators. Quick, clean, and systematic. Let us lock in the habit of checking the denominator first every time!"),
        "H": ("Challenge: Mixed Number Addition",
              "Challenge — mixed numbers! Separate the whole parts and the fractions, add each group, then recombine. Watch carefully for improper fractions in the fraction part that need to carry over!"),
        "I": ("Mastery: Fraction Fluency",
              "Mastery! Random fraction additions — mixed numbers, improper fractions, different denominators. Pick the right method instantly and execute without hesitation. Final proof of your fraction fluency!"),
    },
    "L15_SQUARES_NEAR_BASE": {
        "G": ("Review: Division by 9",
              "Review division by 9! Bring down the first digit as the first remainder, add it to the next digit, continue the cascade. Rhythmic and beautiful once you trust the pattern. Let us go!"),
        "H": ("Challenge: Division by 8",
              "Challenge — division by 8! Almost like dividing by 9, but each step carries a small correction for the deficiency from 9. Stay alert and adjust carefully — the method is just as elegant!"),
        "I": ("Mastery: Special Divisor Round",
              "Mastery round! Mix of special divisors 8, 9, and nearby — prove the method is fully locked in. A Vedic student handles any special divisor with the same calm, systematic approach. Show mastery!"),
    },
}

BEAT_TEMPLATE = {
    "beatId": "",
    "stepId": "",
    "exerciseGroup": "",
    "subtopic": "",
    "sequence": 0,
    "cue": "intro",
    "boardMode": "blank",
    "teacherLine": "",
    "boardAction": [],
    "checkpointPrompt": "",
    "pauseType": "auto",
    "holdSec": 3,
    "expectedStudentResponse": "",
    "fallbackHint": "",
    "performanceTag": "",
    "useWhenCorrect": True,
    "useWhenIncorrect": False,
    "minConfidence": 0,
    "maxConfidence": 3,
    "svgAnimation": [],
}

def get_existing_intro_groups(screenplay):
    return set(b.get("exerciseGroup") for b in screenplay if b.get("cue") in ("intro", "teach"))

def last_sequence_for_group(screenplay, group):
    seqs = [b.get("sequence", 0) for b in screenplay if b.get("exerciseGroup") == group]
    return max(seqs) if seqs else None

def max_sequence(screenplay):
    seqs = [b.get("sequence", 0) for b in screenplay]
    return max(seqs) if seqs else 0

def add_beats(chapter_code, screenplay, groups_data):
    existing = get_existing_intro_groups(screenplay)
    added = 0
    for group, (subtopic, teacher_line) in groups_data.items():
        if group in existing:
            continue
        # Determine insertion sequence: after last beat of the previous group, or at end
        prev_group = chr(ord(group) - 1)
        prev_last_seq = last_sequence_for_group(screenplay, prev_group)
        if prev_last_seq is not None:
            # Insert right after the previous group's last beat
            insert_seq = prev_last_seq + 1
            # Shift existing beats with sequence >= insert_seq
            for b in screenplay:
                if b.get("sequence", 0) >= insert_seq:
                    b["sequence"] += 1
        else:
            insert_seq = max_sequence(screenplay) + 1

        beat = copy.deepcopy(BEAT_TEMPLATE)
        beat_id = f"{chapter_code}_{group}_INTRO"
        beat["beatId"] = beat_id
        beat["stepId"] = beat_id
        beat["exerciseGroup"] = group
        beat["subtopic"] = subtopic
        beat["sequence"] = insert_seq
        beat["teacherLine"] = teacher_line

        screenplay.append(beat)
        added += 1
        print(f"  + Added {beat_id}")

    # Sort screenplay by sequence
    screenplay.sort(key=lambda b: b.get("sequence", 0))
    return added


total_added = 0
for chapter_code, groups_data in TEACHER_LINES.items():
    fn = os.path.join(CHAPTER_DIR, f"{chapter_code}.json")
    if not os.path.exists(fn):
        print(f"WARNING: {fn} not found, skipping")
        continue
    with open(fn, encoding="utf-8") as f:
        data = json.load(f)
    screenplay = data.get("screenplay", [])
    print(f"\n{chapter_code}")
    n = add_beats(chapter_code, screenplay, groups_data)
    total_added += n
    data["screenplay"] = screenplay
    with open(fn, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nDone — added {total_added} intro beats across {len(TEACHER_LINES)} chapters.")
