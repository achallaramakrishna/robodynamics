import type { MindSutraLessonPayload } from "./mindsutraLessonTypes";

// ─── VM_L3_1 — Vinculum Numbers — Bar Notation ───────────────────────────────

export const VM_L3_1_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_3", levelId: "L3", levelSlug: "level-3", title: "Vedic Maths Level 3" },
  lesson: {
    id: "VM_L3_1", order: 1, title: "Vinculum Numbers — Bar Notation",
    sutra: "Rekhanka",
    objective: "Convert numbers to vinculum form (using complementary digits) to simplify arithmetic with large digits.",
    durationMin: 25, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Vedic mathematicians invented a clever notation to replace digits greater than 5 with smaller complements. A bar over a digit means it is negative. This makes calculations with 6, 7, 8, 9 much cleaner.",
      board: {
        type: "intro_card",
        data: {
          headline: "Vinculum: Replace Large Digits with Small Ones",
          example: "38 = 4(−2) = 4̄2̄",
          goal: "Convert to vinculum form and back — then compute with ease.",
          assetPath: "/math-svgs/level_3/VM_L3_1_VINCULUM/standard-vs-vinculum-compare.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the conversion", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "To convert: for any digit ≥ 5, subtract it from 10 to get the vinculum digit, then add 1 to the next left digit. 38: ones digit 8 → vinculum digit 2̄ (10−8=2, write with bar), tens 3+1=4. So 38 = 42̄.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "Digit ≥ 5 → replace with (10 − digit)̄, add 1 to left",
          examples: [
            "38 → ones: 10−8=2̄, tens: 3+1=4 → 42̄",
            "79 → ones: 10−9=1̄, tens: 7+1=8 → 81̄",
            "28 → ones: 10−8=2̄, tens: 2+1=3 → 32̄",
          ],
          assetPath: "/math-svgs/level_3/VM_L3_1_VINCULUM/vinculum-digit-card.svg",
        },
      },
      explanation: {
        title: "Reading vinculum numbers",
        body: "A barred digit is negative in value. 42̄ means 4×10 + (−2) = 40−2 = 38. The bar turns addition into subtraction.",
        mistakeTip: "The carry always goes LEFT. When you borrow from the next digit you add 1 to it.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Convert 297 to vinculum. Ones 7: 10−7=3̄, add 1 to tens digit 9. Tens now 10: vinculum 0̄ carry 1 to hundreds. Hundreds 2+1=3. So 297 = 30̄3̄. Check: 300−3 = 297. ✓",
      board: {
        type: "worked_example",
        data: {
          expression: "297 → vinculum",
          steps: [
            "Ones 7 ≥ 5: vinculum = 10−7 = 3̄, carry 1 to tens",
            "Tens 9+1=10 ≥ 10: vinculum = 0̄, carry 1 to hundreds",
            "Hundreds 2+1 = 3",
            "Vinculum form: 30̄3̄  Check: 300−0−3 = 297 ✓",
          ],
          answer: "30̄3̄",
          assetPath: "/math-svgs/level_3/VM_L3_1_VINCULUM/digit-rewrite-panel.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Chain carries can propagate left. Always check your result by expanding each barred digit as negative.",
        mistakeTip: "After adding 1 to a digit, check again if that digit now needs conversion.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Convert 46 to vinculum. Start with ones digit 6.",
      board: {
        type: "practice_board",
        data: {
          expression: "46 → vinculum",
          prompt: "Ones 6 ≥ 5: vinculum digit = 10−6 = ?",
          assetPath: "/math-svgs/level_3/VM_L3_1_VINCULUM/barred-digit-strip.svg",
        },
      },
      explanation: { title: "Steps", body: "Ones: 10−6=4̄, carry 1 to tens. Tens: 4+1=5. Result: 54̄. Check: 50−4=46 ✓." },
      practice: {
        mode: "numeric",
        prompt: "What is the tens digit in the vinculum form of 46?",
        answer: 5,
        hints: [
          "Ones: 10−6=4̄, add 1 to tens",
          "Tens: 4+1=5",
          "Vinculum: 54̄ → tens digit = 5",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Convert 189 to vinculum. Two conversions needed.",
      board: {
        type: "practice_board",
        data: {
          expression: "189 → vinculum",
          prompt: "Two digits ≥ 5 — convert both, propagate carries.",
          assetPath: "/math-svgs/level_3/VM_L3_1_VINCULUM/carry-adjust-vinculum-arrow.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What is the hundreds digit of the vinculum form of 189?",
        answer: 2,
        hints: [
          "Ones 9: 10−9=1̄, carry to tens",
          "Tens 8+1=9: 10−9=1̄, carry to hundreds",
          "Hundreds 1+1=2 → Result: 21̄1̄, hundreds = 2",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Vinculum notation is a foundation for faster addition, subtraction, and multiplication. In Level 3 it will combine with the criss-cross to make bigger multiplications easier.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Any digit ≥ 5 becomes (10 − digit)̄ with a carry-1 left.",
          remember: [
            "Barred digit = negative value",
            "Carry propagates left until no digit ≥ 10",
            "Check: expand bars as negatives and verify",
          ],
          example: "38 = 42̄  because 40−2=38",
          assetPath: "/math-svgs/level_3/VM_L3_1_VINCULUM/vinculum-number-line.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students forget to carry 1 to the left after replacing a digit. The carry is mandatory — the value must stay unchanged.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Bars to numbers, numbers to bars! Convert these decimal numbers to their vinculum form. A clean 35 XP reward for accuracy!",
      board: {
        type: "practice_board",
        data: {
          headline: "Vinculum Conversion Test",
          prompt: "Replace digits >= 5 with (10-d)̄ and carry 1.",
          assetPath: "/math-svgs/level_3/VM_L3_1_VINCULUM/vinculum-number-line.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "Tens digit of 46 vinculum?", answer: 5, hints: ["46 = 50 - 4 = 54̄"] },
          { prompt: "Hundreds digit of 189 vinculum?", answer: 2, hints: ["189 = 200 - 11 = 21̄1̄"] },
          { prompt: "Tens digit of 38 vinculum?", answer: 4, hints: ["38 = 40 - 2 = 42̄"] },
          { prompt: "Tens digit of 79 vinculum?", answer: 8, hints: ["79 = 80 - 1 = 81̄"] },
          { prompt: "Tens digit of 28 vinculum?", answer: 3, hints: ["28 = 30 - 2 = 32̄"] },
          { prompt: "Tens digit of 29 vinculum?", answer: 3, hints: ["29 = 30 - 1 = 31̄"] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    },
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" },
  ],
  nextLessonUrl: "/mindsutra/course/level-3/lesson/VM_L3_2",
};

// ─── VM_L3_2 — Integer Multiplication Shortcuts ──────────────────────────────

export const VM_L3_2_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_3", levelId: "L3", levelSlug: "level-3", title: "Vedic Maths Level 3" },
  lesson: {
    id: "VM_L3_2", order: 2, title: "Integer Multiplication Shortcuts",
    sutra: "Anurupyena + sign rules",
    objective: "Multiply integers confidently using sign rules and structure, removing the confusion of negatives.",
    durationMin: 20, difficulty: 2, xpReward: 30,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Integer multiplication confuses students because of sign handling. Vedic structure separates the magnitude from the sign — compute the absolute product, then apply sign rules.",
      board: {
        type: "intro_card",
        data: {
          headline: "Integer Multiplication — Signs and Magnitudes",
          example: "(−8) × (−6) = ?",
          goal: "Same sign → positive. Different sign → negative. Magnitude multiplied normally.",
          assetPath: "/math-svgs/level_3/VM_L3_2_INTEGER_MULT/sign-rule-card.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the sign rules", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Two rules: (positive) × (positive) = positive. (negative) × (negative) = positive. (positive) × (negative) = negative. Magnitude is always the product of the absolute values.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "Same signs → +   |   Different signs → −",
          table: [
            "(+) × (+) = (+)",
            "(−) × (−) = (+)",
            "(+) × (−) = (−)",
            "(−) × (+) = (−)",
          ],
          assetPath: "/math-svgs/level_3/VM_L3_2_INTEGER_MULT/same-vs-different-sign-panel.svg",
        },
      },
      explanation: {
        title: "The sign wheel",
        body: "Imagine a wheel: two negatives rotate back to positive. One negative in the pair always gives a negative result.",
        mistakeTip: "Students confuse addition of negatives with multiplication. For multiplication ONLY: two negatives give a positive.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Solve (−7) × (+9). Different signs → result is negative. 7 × 9 = 63. Answer: −63.",
      board: {
        type: "worked_example",
        data: {
          expression: "(−7) × (+9)",
          steps: [
            "Signs: − and + → different → result is NEGATIVE",
            "Magnitude: 7 × 9 = 63",
            "Answer: −63",
          ],
          answer: -63,
          assetPath: "/math-svgs/level_3/VM_L3_2_INTEGER_MULT/integer-multiplication-lane.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Always determine the sign first, then compute the magnitude. Two separate decisions make the process error-free.",
        mistakeTip: "Do not mix up the sign decision with the magnitude calculation. Decide sign first, compute second.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Solve (−6) × (−8). What are the signs, and what is the magnitude?",
      board: {
        type: "practice_board",
        data: {
          expression: "(−6) × (−8)",
          prompt: "Same signs → positive. Magnitude = 6 × 8 = ?",
          assetPath: "/math-svgs/level_3/VM_L3_2_INTEGER_MULT/positive-negative-pair-grid.svg",
        },
      },
      explanation: { title: "Steps", body: "Both negative → positive. 6 × 8 = 48. Answer: +48." },
      practice: {
        mode: "numeric",
        prompt: "Solve: (−6) × (−8)",
        answer: 48,
        hints: [
          "Both signs negative → result is positive",
          "6 × 8 = 48",
          "Answer: +48 = 48",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Solve (−12) × (+7). Track sign and magnitude separately.",
      board: {
        type: "practice_board",
        data: {
          expression: "(−12) × (+7)",
          prompt: "Different signs → ?  |  12 × 7 = ?",
          assetPath: "/math-svgs/level_3/VM_L3_2_INTEGER_MULT/sign-product-wheel.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: (−12) × (+7)",
        answer: -84,
        hints: [
          "Different signs → negative result",
          "12 × 7 = 84",
          "Answer: −84",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Perfect. Integer multiplication with clear sign rules will never trip you up again. This forms the basis of algebraic multiplication in Level 4.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Same signs → positive product. Different signs → negative product.",
          remember: [
            "Determine sign first: same = +, different = −",
            "Compute absolute value product normally",
            "Attach the determined sign",
          ],
          example: "(−7) × (+9) = −63",
          assetPath: "/math-svgs/level_3/VM_L3_2_INTEGER_MULT/sign-rule-card.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students apply addition sign rules to multiplication. For multiplication: two negatives always give a positive.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Same sign, different sign! Solve these 6 integer multiplications. Remember: two negatives make a positive! 30 XP reward.",
      board: {
        type: "practice_board",
        data: {
          headline: "Integer Multiplier Race",
          prompt: "Sign first, then Magnitude.",
          assetPath: "/math-svgs/level_3/VM_L3_2_INTEGER_MULT/sign-rule-card.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "(−4) × (−5)", answer: 20, hints: ["Same signs -> +20"] },
          { prompt: "(−3) × (+6)", answer: -18, hints: ["Different signs -> -18"] },
          { prompt: "(+8) × (−7)", answer: -56, hints: ["Different signs -> -56"] },
          { prompt: "(−9) × (−4)", answer: 36, hints: ["Same signs -> +36"] },
          { prompt: "(+12) × (+3)", answer: 36, hints: ["Same signs -> +36"] },
          { prompt: "(−15) × (−2)", answer: 30, hints: ["Same -> +30"] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    },
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" },
  ],
  nextLessonUrl: "/mindsutra/course/level-3/lesson/VM_L3_3",
};

// ─── VM_L3_3 — Nikhilam — Any Base (10, 100, 1000) ───────────────────────────

export const VM_L3_3_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_3", levelId: "L3", levelSlug: "level-3", title: "Vedic Maths Level 3" },
  lesson: {
    id: "VM_L3_3", order: 3, title: "Nikhilam — Any Base (10, 100, 1000)",
    sutra: "Nikhilam Navatashcaramam Dashatah",
    objective: "Apply the Nikhilam multiplication method flexibly using base 10, 100, or 1000.",
    durationMin: 30, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "In Level 2 you used Nikhilam with base 100. Now we make it fully flexible — base 10 for small numbers, base 100 for medium, and base 1000 for large. Same structure, any scale.",
      board: {
        type: "intro_card",
        data: {
          headline: "Nikhilam — Choose Your Base",
          example: "8 × 7 (base 10)",
          goal: "Pick the nearest power of 10 as your base and apply Nikhilam.",
          assetPath: "/math-svgs/level_3/VM_L3_3_NIKHILAM_BASE10/any-base-cross-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the flexible base", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Choose base = nearest power of 10. Deviations: d₁ = n₁ − base, d₂ = n₂ − base. Left = n₁ + d₂ (or n₂ + d₁). Right = d₁ × d₂ (digits = log₁₀ of base). For base 10: right is 1 digit. For base 100: 2 digits.",
      board: {
        type: "place_value_split",
        data: {
          bases: [
            { base: 10, rightDigits: 1, example: "8 × 7: d=−2,−3 → left=5, right=06? No: right=6 (1 digit). Answer: 56" },
            { base: 100, rightDigits: 2, example: "97 × 93: left=90, right=21 → 9021" },
            { base: 1000, rightDigits: 3, example: "998 × 997: left=995, right=006 → 995006" },
          ],
          assetPath: "/math-svgs/level_3/VM_L3_3_NIKHILAM_BASE10/base-selector-panel.svg",
        },
      },
      explanation: {
        title: "Right-side digits rule",
        body: "Right side must have exactly as many digits as zeros in the base: base 10 → 1 digit, base 100 → 2 digits, base 1000 → 3 digits.",
        mistakeTip: "Always choose the power of 10 NEAREST to both numbers. Do not use base 100 for numbers near 10.",
      },
      actions: [{ id: "next", label: "Walk me through base 10 example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "9 × 8 using base 10. d₁ = −1, d₂ = −2. Left: 9−2=7. Right: (−1)×(−2)=2 (1 digit for base 10). Answer: 72.",
      board: {
        type: "worked_example",
        data: {
          expression: "9 × 8 (base 10)",
          steps: [
            "Base = 10, deviations: 9−10=−1, 8−10=−2",
            "Left: 9 + (−2) = 7",
            "Right: (−1) × (−2) = 2 → 1 digit for base 10",
            "Answer: 72",
          ],
          answer: 72,
          assetPath: "/math-svgs/level_3/VM_L3_3_NIKHILAM_BASE10/nikhilam-base-line-10.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The method is identical to the base-100 version. Only the number of right-side digits changes with the base.",
        mistakeTip: "For base 10, right side = 1 digit only. 9×8 right = 2, not 02.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 7 × 6 using base 10. Start by locking the left half, then handle the 1-digit right side.",
      board: {
        type: "practice_board",
        data: {
          expression: "7 × 6 (base 10)",
          prompt: "Deviations from 10: 7→−3, 6→−4. First lock the left half.",
          assetPath: "/math-svgs/level_3/VM_L3_3_NIKHILAM_BASE10/any-base-cross-board.svg",
        },
      },
      explanation: { title: "Steps", body: "Left: 7−4=3. Right: 3×4=12? No — right is 1 digit: write 2, carry 1 to left: 3+1=4. Answer: 42." },
      practice: {
        mode: "mcq",
        prompt: "What is the left half of 7 × 6 using base 10?",
        answer: 3,
        options: ["2", "3", "4", "6"],
        hints: [
          "Deviations: −3 and −4",
          "Left: 7−4=3",
          "Then the right side 12 becomes 2 with carry 1, so the answer is 42",
        ],
        remediation: {
          prompt: "Checkpoint: how many digits are allowed on the right side when the base is 10?",
          answer: 1,
          options: ["1", "2", "3", "4"],
          hints: [
            "The right side has as many digits as zeros in the base",
            "Base 10 has one zero",
            "So the right side allows 1 digit",
          ],
        },
        challenge: {
          prompt: "Transfer check: after left half 3, what final answer do you get for 7 × 6?",
          answer: 42,
          options: ["32", "36", "42", "52"],
          hints: [
            "The deviation product is 3×4 = 12",
            "Base 10 keeps only 1 right-side digit, so write 2 and carry 1",
            "3 + 1 = 4, so the answer is 42",
          ],
        },
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Now try 995 × 998 using base 1000. The key idea is the 3-digit right side.",
      board: {
        type: "practice_board",
        data: {
          expression: "995 × 998 (base 1000)",
          prompt: "Deviations: −5 and −2. First lock the left half, then pad the right side to 3 digits.",
          assetPath: "/math-svgs/level_3/VM_L3_3_NIKHILAM_BASE10/nikhilam-base-line-1000.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What is the left half of 995 × 998 using base 1000?",
        answer: 993,
        options: ["990", "993", "995", "998"],
        hints: [
          "Deviations: 995−1000=−5, 998−1000=−2",
          "Left: 995−2=993",
          "Then the right side 10 must be written as 010 for base 1000, so the answer is 993010",
        ],
        remediation: {
          prompt: "Checkpoint: how many digits must the right side have when the base is 1000?",
          answer: 3,
          options: ["1", "2", "3", "4"],
          hints: [
            "The right side has as many digits as zeros in the base",
            "Base 1000 has three zeros",
            "So the right side must have 3 digits",
          ],
        },
        challenge: {
          prompt: "Transfer check: after left half 993, what full answer do you get for 995 × 998?",
          answer: 993010,
          options: ["99310", "993100", "993010", "995010"],
          hints: [
            "The deviation product is 5×2 = 10",
            "At base 1000, 10 must be padded to 010",
            "So the full answer is 993010",
          ],
        },
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "You now have the full Nikhilam toolkit across all three major bases. This is one of the most versatile tools in Vedic mathematics.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Base 10: 1 right digit. Base 100: 2 right digits. Base 1000: 3 right digits.",
          remember: [
            "Choose the nearest power of 10 as base",
            "Left = either number plus the other's deviation",
            "Right = product of deviations, padded to log₁₀(base) digits",
          ],
          example: "9 × 8 (base 10) = 7|2 = 72",
          assetPath: "/math-svgs/level_3/VM_L3_3_NIKHILAM_BASE10/left-right-answer-split-base-flex.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Using the wrong number of right-side digits. Count the zeros in the base: that is how many digits the right side must have.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Step up the base! Solve these Nikhilam multiplications using base 10, 100, and 1000. 35 XP is yours for a perfect score!",
      board: {
        type: "practice_board",
        data: {
          headline: "All-Base Nikhilam Test",
          prompt: "Right-side digits = zeros in base.",
          assetPath: "/math-svgs/level_3/VM_L3_3_NIKHILAM_BASE10/any-base-cross-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "9 × 7 (base 10)", answer: 63, hints: ["-1, -3 -> 63"] },
          { prompt: "102 × 105 (base 100)", answer: 10710, hints: ["+2, +5 -> 10710"] },
          { prompt: "992 × 997 (base 1000)", answer: 989024, hints: ["-8, -3 -> 989024"] },
          { prompt: "8 × 9", answer: 72, hints: ["-2, -1"] },
          { prompt: "97 × 94", answer: 9118, hints: ["-3, -6"] },
          { prompt: "998 × 995", answer: 993010, hints: ["-2, -5"] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    },
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" },
  ],
  nextLessonUrl: "/mindsutra/course/level-3/lesson/VM_L3_4",
};

// ─── VM_L3_4 — Ratio Shortcuts — Fast Comparison ─────────────────────────────

export const VM_L3_4_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_3", levelId: "L3", levelSlug: "level-3", title: "Vedic Maths Level 3" },
  lesson: {
    id: "VM_L3_4", order: 4, title: "Ratio Shortcuts — Fast Comparison",
    sutra: "Anurupyena",
    objective: "Simplify, compare, and scale ratios instantly using Anurupyena (proportionality).",
    durationMin: 20, difficulty: 2, xpReward: 30,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Ratio problems appear in almost every aptitude exam. Vedic proportionality lets you simplify and compare ratios in one mental step — no cross-multiplication grid required.",
      board: {
        type: "intro_card",
        data: {
          headline: "Ratio Simplification & Comparison",
          example: "15 : 25",
          goal: "Reduce to simplest form, then compare two ratios instantly.",
          assetPath: "/math-svgs/level_3/VM_L3_4_RATIO_SHORTCUT/ratio-strip.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "To simplify a ratio A:B — find HCF of A and B by inspection and divide both. 15:25 → HCF=5 → 3:5. To compare two ratios, convert to a common second term (like fractions with LCD) or cross-multiply.",
      board: {
        type: "number_bond",
        data: {
          rule: "A:B simplified = (A÷HCF):(B÷HCF)",
          compare: "A:B vs C:D → compare A×D vs B×C",
          examples: ["15:25 → HCF 5 → 3:5", "Compare 2:3 vs 3:5 → 2×5=10 vs 3×3=9 → 2:3 is larger"],
          assetPath: "/math-svgs/level_3/VM_L3_4_RATIO_SHORTCUT/ratio-balance-beam.svg",
        },
      },
      explanation: {
        title: "Cross-multiply for comparison",
        body: "For A:B vs C:D: compute A×D and B×C. If A×D > B×C then A:B > C:D.",
        mistakeTip: "Cross-multiply correctly: numerator of first × denominator of second, and vice versa.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Simplify 36:48. HCF(36,48) by inspection: both divisible by 4 → 9:12. Both divisible by 3 → 3:4. Done.",
      board: {
        type: "worked_example",
        data: {
          expression: "36 : 48",
          steps: [
            "Both divisible by 4: 36÷4=9, 48÷4=12 → 9:12",
            "Both divisible by 3: 9÷3=3, 12÷3=4 → 3:4",
            "Simplest form: 3:4",
          ],
          answer: "3:4",
          assetPath: "/math-svgs/level_3/VM_L3_4_RATIO_SHORTCUT/simplify-ratio-ladder.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Use the same HCF inspection technique from the fractions lesson. Ratios and fractions are the same structure.",
        mistakeTip: "Divide BOTH terms by the same factor. Dividing only one changes the ratio.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Simplify 45:60. What factor do both share?",
      board: {
        type: "practice_board",
        data: {
          expression: "45 : 60",
          prompt: "HCF of 45 and 60?",
          assetPath: "/math-svgs/level_3/VM_L3_4_RATIO_SHORTCUT/equivalent-ratio-card.svg",
        },
      },
      explanation: { title: "Steps", body: "Both divisible by 15: 3:4." },
      practice: {
        mode: "numeric",
        prompt: "What is the first term of 45:60 in simplest form?",
        answer: 3,
        hints: [
          "Both divisible by 5: 9:12",
          "Both divisible by 3: 3:4",
          "First term = 3",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Compare 5:8 and 7:11. Which is larger?",
      board: {
        type: "practice_board",
        data: {
          expression: "5:8  vs  7:11",
          prompt: "Cross-multiply: 5×11 vs 8×7.",
          assetPath: "/math-svgs/level_3/VM_L3_4_RATIO_SHORTCUT/ratio-comparison-board.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What is 5×11? (Use this to determine which ratio is larger)",
        answer: 55,
        hints: [
          "5 × 11 = 55",
          "8 × 7 = 56",
          "55 < 56 → 5:8 < 7:11 → 7:11 is the larger ratio",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Ratio fluency is a multiplier across all quantitative topics. These two skills — simplification and comparison — cover 90% of ratio questions in any exam.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Simplify: divide by HCF. Compare: cross-multiply diagonals.",
          remember: [
            "Find HCF by inspection: 2, 3, 5, 7 in sequence",
            "For comparison: A:B > C:D iff A×D > B×C",
            "Always simplify before comparing",
          ],
          example: "36:48 = 3:4",
          assetPath: "/math-svgs/level_3/VM_L3_4_RATIO_SHORTCUT/ratio-balance-beam.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "When comparing ratios, students sometimes compare A:B vs C:D by comparing A vs C directly. That only works if B=D. Always cross-multiply.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Simplify or compare! Solve these 6 ratio problems using the cross-multiplier and HCF tricks. 30 XP for completion!",
      board: {
        type: "practice_board",
        data: {
          headline: "Ratio Comparison Speed Drill",
          prompt: "A:B vs C:D -> AxD vs BxC.",
          assetPath: "/math-svgs/level_3/VM_L3_4_RATIO_SHORTCUT/ratio-strip.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "1st term of 20:30 simplest?", answer: 2, hints: ["2:3"] },
          { prompt: "1st term of 15:25 simplest?", answer: 3, hints: ["3:5"] },
          { prompt: "Is 2:3 larger than 3:4? (1=Y, 0=N)", answer: 0, hints: ["2x4=8, 3x3=9. 8<9 so No."] },
          { prompt: "1st term of 18:24 simplest?", answer: 3, hints: ["3:4"] },
          { prompt: "1st term of 12:15 simplest?", answer: 4, hints: ["4:5"] },
          { prompt: "Is 5:6 larger than 9:10? (1=Y, 0=N)", answer: 0, hints: ["50 vs 54. No."] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    },
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" },
  ],
  nextLessonUrl: "/mindsutra/course/level-3/lesson/VM_L3_5",
};

// ─── VM_L3_5 — HCF and LCM — Vedic Method ────────────────────────────────────

export const VM_L3_5_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_3", levelId: "L3", levelSlug: "level-3", title: "Vedic Maths Level 3" },
  lesson: {
    id: "VM_L3_5", order: 5, title: "HCF and LCM — Vedic Method",
    sutra: "Common factor inspection",
    objective: "Find HCF and LCM of two or three numbers quickly using the Vedic factor-inspection approach.",
    durationMin: 25, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "HCF and LCM are fundamental to fractions, ratios, and algebra. The Vedic inspection method finds them in seconds without a full factor tree.",
      board: {
        type: "intro_card",
        data: {
          headline: "HCF and LCM by Inspection",
          example: "HCF(48, 36) = ?  LCM(4, 6) = ?",
          goal: "Extract common factors visually — no prime factorisation grid needed.",
          assetPath: "/math-svgs/level_3/VM_L3_5_HCF_LCM_VEDIC/factor-overlap-panel.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "HCF: largest number that divides both. Use the same inspection ladder as fractions: divide by 2, then 3, then 5. LCM = (A × B) ÷ HCF. Or: find HCF, then multiply each prime factor appearing in EITHER number to the highest power.",
      board: {
        type: "place_value_split",
        data: {
          hcfRule: "HCF = product of all common prime factors",
          lcmRule: "LCM = (A × B) ÷ HCF",
          example: "A=12, B=18: HCF=6, LCM = (12×18)÷6 = 36",
          assetPath: "/math-svgs/level_3/VM_L3_5_HCF_LCM_VEDIC/common-factor-highlight-grid.svg",
        },
      },
      explanation: {
        title: "Relationship",
        body: "HCF × LCM = A × B. This identity lets you find LCM directly from HCF without building a separate table.",
        mistakeTip: "HCF is always ≤ min(A,B). LCM is always ≥ max(A,B).",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Find HCF and LCM of 24 and 36. HCF: 24=2³×3, 36=2²×3². Common: 2²×3=12. So HCF=12. LCM = 24×36÷12 = 72.",
      board: {
        type: "worked_example",
        data: {
          expression: "HCF and LCM of 24 and 36",
          steps: [
            "24 = 2 × 2 × 2 × 3",
            "36 = 2 × 2 × 3 × 3",
            "Common factors: 2² × 3 = 12 → HCF = 12",
            "LCM = (24 × 36) ÷ 12 = 864 ÷ 12 = 72",
          ],
          answer: 12,
          assetPath: "/math-svgs/level_3/VM_L3_5_HCF_LCM_VEDIC/factor-tree-card.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "For two numbers: HCF × LCM = product of the two numbers. Always verify: 12 × 72 = 864 = 24 × 36. ✓",
        mistakeTip: "Do not confuse which factors go to HCF (common ones) vs LCM (all of them).",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Find HCF of 18 and 30. List the factors of each by inspection.",
      board: {
        type: "practice_board",
        data: {
          expression: "HCF(18, 30)",
          prompt: "18 = 2×3². 30 = 2×3×5. Common factors?",
          assetPath: "/math-svgs/level_3/VM_L3_5_HCF_LCM_VEDIC/hcf-box.svg",
        },
      },
      explanation: { title: "Steps", body: "Common: 2×3=6. HCF=6." },
      practice: {
        mode: "numeric",
        prompt: "HCF(18, 30) = ?",
        answer: 6,
        hints: [
          "18 = 2 × 3 × 3",
          "30 = 2 × 3 × 5",
          "Common factors: 2 × 3 = 6",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Find LCM(12, 15). First find HCF, then apply the formula.",
      board: {
        type: "practice_board",
        data: {
          expression: "LCM(12, 15)",
          prompt: "HCF first, then LCM = (12×15)÷HCF.",
          assetPath: "/math-svgs/level_3/VM_L3_5_HCF_LCM_VEDIC/lcm-ladder.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "LCM(12, 15) = ?",
        answer: 60,
        hints: [
          "12 = 2²×3, 15 = 3×5 → HCF = 3",
          "LCM = (12 × 15) ÷ 3 = 180 ÷ 3 = 60",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Excellent. HCF and LCM by inspection is a superpower for fraction arithmetic, ratio scaling, and algebraic simplification. Verify with the identity HCF × LCM = A × B.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "HCF = common prime factors. LCM = (A×B) ÷ HCF.",
          remember: [
            "Factor by inspection: 2, 3, 5, 7",
            "HCF = product of factors common to both",
            "LCM = A×B ÷ HCF (or product of all factors, highest powers)",
          ],
          example: "HCF(24,36)=12, LCM=72",
          assetPath: "/math-svgs/level_3/VM_L3_5_HCF_LCM_VEDIC/factor-overlap-panel.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students compute LCM as A+B or A×B. LCM = (A×B)÷HCF — always divide by HCF.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Inspection masters! Find the HCF and LCM for these 6 pairs using common factors. 35 XP reward for excellence!",
      board: {
        type: "practice_board",
        data: {
          headline: "HCF & LCM Speed Test",
          prompt: "LCM = AxB/HCF.",
          assetPath: "/math-svgs/level_3/VM_L3_5_HCF_LCM_VEDIC/factor-overlap-panel.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "HCF of 12 and 18", answer: 6, hints: ["6x2, 6x3"] },
          { prompt: "LCM of 4 and 6", answer: 12, hints: ["(4x6)/2 = 12"] },
          { prompt: "HCF of 24 and 36", answer: 12, hints: ["12x2, 12x3"] },
          { prompt: "LCM of 10 and 15", answer: 30, hints: ["(10x15)/5 = 30"] },
          { prompt: "HCF of 15 and 20", answer: 5, hints: ["5x3, 5x4"] },
          { prompt: "LCM of 12 and 20", answer: 60, hints: ["(12x20)/4 = 60"] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    },
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" },
  ],
  nextLessonUrl: "/mindsutra/course/level-3/lesson/VM_L3_6",
};

// ─── VM_L3_6 — Squaring 2-Digit Numbers — Duplex ─────────────────────────────

export const VM_L3_6_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_3", levelId: "L3", levelSlug: "level-3", title: "Vedic Maths Level 3" },
  lesson: {
    id: "VM_L3_6", order: 6, title: "Squaring 2-Digit Numbers — Duplex",
    sutra: "Dvandva Yoga",
    objective: "Square any 2-digit number in two mental steps using the Duplex (cross-double) formula.",
    durationMin: 25, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "The Dvandva Yoga — Duplex method — squares any 2-digit number instantly. It uses the algebraic identity (a+b)² = a² + 2ab + b² but structured for mental calculation.",
      board: {
        type: "intro_card",
        data: {
          headline: "Square Any 2-Digit Number Instantly",
          example: "67²",
          goal: "Three-slot calculation: a² | 2ab | b² — then carry.",
          assetPath: "/math-svgs/level_3/VM_L3_6_SQUARES_2DIG/square-expansion-strip.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the duplex", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For a 2-digit number written as (a)(b) where a=tens digit, b=ones digit: Square = a² | 2ab | b². Carry from right to left as needed.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "(ab)² = a² | 2ab | b²",
          example: "67: a=6, b=7 → 36 | 84 | 49",
          carry: "49: write 9, carry 4. 84+4=88: write 8, carry 8. 36+8=44. Answer: 4489",
          assetPath: "/math-svgs/level_3/VM_L3_6_SQUARES_2DIG/cross-middle-square-panel.svg",
        },
      },
      explanation: {
        title: "Three slots",
        body: "Right slot: b². Middle slot: 2ab. Left slot: a². Work right to left, carrying any two-digit partial products.",
        mistakeTip: "2ab can be large. Write only the ones digit, carry the rest left.",
      },
      actions: [{ id: "next", label: "Walk me through 67²", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "67²: a=6, b=7. Right: 7²=49 → write 9, carry 4. Middle: 2×6×7=84, plus carry 4 = 88 → write 8, carry 8. Left: 6²=36, plus carry 8 = 44 → write 44. Answer: 4489.",
      board: {
        type: "worked_example",
        data: {
          expression: "67²",
          steps: [
            "a=6, b=7",
            "Right: b²=49 → write 9, carry 4",
            "Middle: 2ab=2×6×7=84, +carry 4=88 → write 8, carry 8",
            "Left: a²=36, +carry 8=44 → write 44",
            "Answer: 4489",
          ],
          answer: 4489,
          assetPath: "/math-svgs/level_3/VM_L3_6_SQUARES_2DIG/square-split-board.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The middle slot (2ab) can produce a two-digit or even three-digit number when carries add up. Write only the ones digit there, always carry the rest.",
        mistakeTip: "Students sometimes forget to add the carry from b² into 2ab. Always add carries before moving left.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 43². a=4, b=3. Start with the right slot: 3²=?",
      board: {
        type: "practice_board",
        data: {
          expression: "43²",
          prompt: "Right: 3²=9. Middle: 2×4×3=24. Left: 4²=16.",
          assetPath: "/math-svgs/level_3/VM_L3_6_SQUARES_2DIG/near-base-square-board.svg",
        },
      },
      explanation: { title: "Steps", body: "Right slot is 9. The middle duplex is 24, so write 4 and carry 2. Then add that carry to the left slot: 16 + 2 = 18, giving 1849." },
      practice: {
        mode: "mcq",
        prompt: "What is the middle duplex value 2ab in 43²?",
        answer: 24,
        options: ["12", "16", "24", "43"],
        hints: [
          "Use a=4 and b=3",
          "The middle slot is 2×a×b",
          "2×4×3 = 24",
        ],
        remediation: {
          prompt: "Checkpoint: what is the right slot b² in 43²?",
          answer: 9,
          options: ["6", "8", "9", "12"],
          hints: [
            "The ones digit is 3",
            "Square the ones digit first",
            "3² = 9",
          ],
        },
        challenge: {
          prompt: "Transfer check: after right slot 9 and middle slot 24, what full answer do you get for 43²?",
          answer: 1849,
          options: ["1649", "1849", "1949", "2449"],
          hints: [
            "Write 4 and carry 2 from the middle slot",
            "Add that carry to 4² = 16",
            "16 + 2 = 18, so the answer is 1849",
          ],
        },
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Now try 89². Large digits — track carries carefully.",
      board: {
        type: "practice_board",
        data: {
          expression: "89²",
          prompt: "a=8, b=9. The first important checkpoint is the carry coming from 9².",
          assetPath: "/math-svgs/level_3/VM_L3_6_SQUARES_2DIG/ending-5-pattern-card.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "When squaring 89, what carry moves left from the right slot 9² = 81?",
        answer: 8,
        options: ["1", "7", "8", "9"],
        hints: [
          "The right slot is 81",
          "Write the ones digit 1 in the answer",
          "Carry the tens part left, which is 8",
        ],
        remediation: {
          prompt: "Checkpoint: what is the middle duplex 2ab for 89² before adding carry?",
          answer: 144,
          options: ["72", "89", "144", "162"],
          hints: [
            "Use 2×8×9",
            "8×9 = 72",
            "Double that to get 144",
          ],
        },
        challenge: {
          prompt: "Transfer check: after right slot 81 and middle duplex 144, what full answer do you get for 89²?",
          answer: 7921,
          options: ["7821", "7921", "7941", "8821"],
          hints: [
            "Carry 8 from 81 into the middle slot",
            "144 + 8 = 152, so write 2 and carry 15",
            "64 + 15 = 79, so the answer is 7921",
          ],
        },
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "You can now square any 2-digit number mentally. This skill is prized in competitive exams — practice until the three slots appear automatically.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "(ab)² = a² | 2ab | b² — carry right to left.",
          remember: [
            "Split: a = tens digit, b = ones digit",
            "Compute b², 2ab, a² in order",
            "Carry each multi-digit partial product left",
          ],
          example: "67² = 4489",
          assetPath: "/math-svgs/level_3/VM_L3_6_SQUARES_2DIG/square-expansion-strip.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students drop carries. With large digits (7, 8, 9), the middle slot often has a carry of 10+ into the left slot. Always add it.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "The Duplex Sprint! Square these 6 2-digit numbers using the a²|2ab|b² method. Careful with the carries! 35 XP reward.",
      board: {
        type: "practice_board",
        data: {
          headline: "Dvandva Yoga Speed Race",
          prompt: "Three slots: tens², 2xProduct, ones².",
          assetPath: "/math-svgs/level_3/VM_L3_6_SQUARES_2DIG/square-expansion-strip.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "43²", answer: 1849, hints: ["16 / 24 / 9 -> 1849"] },
          { prompt: "12²", answer: 144, hints: ["1 / 4 / 4"] },
          { prompt: "21²", answer: 441, hints: ["4 / 4 / 1"] },
          { prompt: "15²", answer: 225, hints: ["1 / 10 / 25"] },
          { prompt: "31²", answer: 961, hints: ["9 / 6 / 1"] },
          { prompt: "89²", answer: 7921, hints: ["64 / 144 / 81 -> 7921"] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    },
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" },
  ],
  nextLessonUrl: "/mindsutra/course/level-3/lesson/VM_L3_7",
};

// ─── VM_L3_7 — Paravartya Division ───────────────────────────────────────────

export const VM_L3_7_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_3", levelId: "L3", levelSlug: "level-3", title: "Vedic Maths Level 3" },
  lesson: {
    id: "VM_L3_7", order: 7, title: "Paravartya Division",
    sutra: "Paravartya Yojayet",
    objective: "Divide exactly by divisors like 11, 12, and 13 using one clean transpose-and-adjust pattern.",
    durationMin: 30, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Paravartya Yojayet means Transpose and Adjust. In this lesson we use one stable version of it for divisors like 11, 12, and 13, where the first digit is 1 and the second digit acts as the flag.",
      board: {
        type: "intro_card",
        data: {
          headline: "Paravartya Division — Transpose and Adjust",
          example: "1234 ÷ 12",
          goal: "Bring down a quotient digit, adjust the next digit with the flag, and repeat.",
          assetPath: "/math-svgs/level_3/VM_L3_7_PARAVARTYA_DIV/paravartya-division-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For divisor = 1x (e.g., 12): the flag digit is x (here 2). Write the flag above the second digit. For each step: quotient digit q = current digit. Multiply q × flag and subtract from the next digit to get the working digit.",
      board: {
        type: "place_value_split",
        data: {
          divisor: 12,
          flag: 2,
          rule: "q = working digit ÷ 1. Adjust next digit: next − q×flag.",
          assetPath: "/math-svgs/level_3/VM_L3_7_PARAVARTYA_DIV/divisor-complement-chip.svg",
        },
      },
      explanation: {
        title: "Flag = complement of divisor's leading 1",
        body: "For 12: write as 1|2. Flag = 2. For 11: flag = 1. For 13: flag = 3. The flag drives all adjustments.",
        mistakeTip: "The flag is always the sub-digit of the divisor after the leading 1. For divisors like 21, the method needs adaptation.",
      },
      actions: [{ id: "next", label: "Walk me through 1234 ÷ 12", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "1234 ÷ 12. Flag=2. Step 1: q₁=1, adjust: 2 − 1×2 = 0. Step 2: q₂=0, adjust: 3 − 0×2 = 3. Step 3: q₃=3, adjust: 4 − 3×2 = −2 → negative means q₃ should be 2: 4−2×2=0. Quotient: 102 R 10 → adjust: 102 R 10 → 102+⌊10/12⌋... Actually 1234÷12=102 R 10.",
      board: {
        type: "worked_example",
        data: {
          expression: "1234 ÷ 12",
          steps: [
            "Divisor 12: flag = 2",
            "Bring 1: q₁=1. Adjust: 2 − (1×2) = 0",
            "Working digit 0: q₂=0. Adjust: 3 − (0×2) = 3",
            "Working digit 3: q₃=3. Adjust: 4 − (3×2) = −2",
            "−2 < 0 → reduce q₃ to 2: 4 − (2×2) = 0",
            "Quotient: 102, Remainder: 10",
          ],
          answer: 102,
          assetPath: "/math-svgs/level_3/VM_L3_7_PARAVARTYA_DIV/quotient-correction-lane.svg",
        },
      },
      explanation: {
        title: "Negative adjustment",
        body: "If adjustment goes negative, reduce the quotient digit by 1 and recalculate. This is the 'adjust' part of Paravartya.",
        mistakeTip: "A negative working digit signals that the quotient digit is too large — reduce it by 1.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 132 ÷ 11. Flag = 1.",
      board: {
        type: "practice_board",
        data: {
          expression: "132 ÷ 11",
          prompt: "Flag=1. Bring 1: q₁=1. Adjust: 3−1×1=2. Then?",
          assetPath: "/math-svgs/level_3/VM_L3_7_PARAVARTYA_DIV/transpose-adjust-arrow.svg",
        },
      },
      explanation: { title: "Steps", body: "q₁=1, working=2. So the next quotient digit is 2. Then 2−2×1=0, so the remainder is 0 and the quotient is 12." },
      practice: {
        mode: "mcq",
        prompt: "After the first adjustment, what should the next quotient digit be in 132 ÷ 11?",
        answer: 2,
        options: ["1", "2", "3", "4"],
        hints: [
          "Flag=1. q₁=1, adjust next: 3−1=2",
          "The adjusted working digit itself becomes the next quotient digit",
          "So q₂ = 2",
        ],
        remediation: {
          prompt: "Checkpoint: what is 3 − (1×1)?",
          answer: 2,
          options: ["1", "2", "3", "4"],
          hints: [
            "Use the flag 1",
            "Subtract 1 from 3",
            "That gives 2",
          ],
        },
        challenge: {
          prompt: "Transfer check: with quotient digits 1 and 2, what is the full result of 132 ÷ 11?",
          answer: 12,
          options: ["11", "12", "13", "21"],
          hints: [
            "The quotient digits are 1 then 2",
            "The last adjustment gives remainder 0",
            "So the quotient is 12",
          ],
        },
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Try 2197 ÷ 13. Flag = 3.",
      board: {
        type: "practice_board",
        data: {
          expression: "2197 ÷ 13",
          prompt: "Flag=3. If a quotient guess makes the next working digit negative, what should you do?",
          assetPath: "/math-svgs/level_3/VM_L3_7_PARAVARTYA_DIV/adjustment-step-panel.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "In 2197 ÷ 13, if a trial quotient digit makes the next working digit negative, what is the correct Paravartya move?",
        answer: "Reduce the quotient digit by 1 and recalculate",
        options: [
          "Reduce the quotient digit by 1 and recalculate",
          "Increase the flag digit and continue",
          "Keep the quotient digit and ignore the negative value",
          "Add the flag instead of subtracting it",
        ],
        hints: [
          "A negative working digit means the current quotient guess is too large",
          "Paravartya corrects by stepping the quotient digit down",
          "Then you recompute the next working digit",
        ],
        remediation: {
          prompt: "Checkpoint: what is the flag digit for divisor 13?",
          answer: 3,
          options: ["1", "2", "3", "4"],
          hints: [
            "Write 13 as 1 | 3",
            "The digit after the leading 1 becomes the flag",
            "So the flag is 3",
          ],
        },
        challenge: {
          prompt: "Transfer check: what is the full quotient of 2197 ÷ 13?",
          answer: 169,
          options: ["159", "169", "179", "189"],
          hints: [
            "Keep adjusting whenever a working digit goes negative",
            "The exact division is 13 × 169 = 2197",
            "So the quotient is 169",
          ],
        },
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Paravartya gives you a framework for systematic division without guessing. With practice, the flag adjustments become automatic.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Flag = sub-digit of divisor. Each step: q = working digit, adjust = next digit − q×flag.",
          remember: [
            "Identify the flag digit from the divisor",
            "Produce each quotient digit from the working digit",
            "Adjust forward: subtract q×flag from the next digit",
          ],
          example: "132 ÷ 11 = 12",
          assetPath: "/math-svgs/level_3/VM_L3_7_PARAVARTYA_DIV/remainder-balance-box.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Forgetting to recalculate when the adjusted digit goes negative. Always reduce the quotient digit by 1 and retry.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Transpose and Adjust! Solve these 6 divisions using the Paravartya method. A perfect score earns you 35 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Paravartya Speed Test",
          prompt: "Quotient digit, subtract qxFlag from next.",
          assetPath: "/math-svgs/level_3/VM_L3_7_PARAVARTYA_DIV/paravartya-division-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "132 ÷ 11", answer: 12, hints: ["Flag 1: 1, 3-1=2, 2. R=0."] },
          { prompt: "144 ÷ 12", answer: 12, hints: ["Flag 2: 1, 4-2=2, 2. R=4-4=0."] },
          { prompt: "169 ÷ 13", answer: 13, hints: ["Flag 3: 1, 6-3=3, 3. R=9-9=0."] },
          { prompt: "121 ÷ 11", answer: 11, hints: ["Flag 1: 1, 2-1=1, 1. R=0."] },
          { prompt: "288 ÷ 12", answer: 24, hints: ["Flag 2: 2, 8-4=4, 4. R=0."] },
          { prompt: "396 ÷ 11", answer: 36, hints: ["Flag 1: 3, 9-3=6, 6. R=0."] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    },
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" },
  ],
  nextLessonUrl: "/mindsutra/course/level-3/lesson/VM_L3_8",
};

// ─── VM_L3_8 — Algebra by Inspection — Samuccaya ─────────────────────────────

export const VM_L3_8_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_3", levelId: "L3", levelSlug: "level-3", title: "Vedic Maths Level 3" },
  lesson: {
    id: "VM_L3_8", order: 8, title: "Algebra by Inspection — Samuccaya",
    sutra: "Sunyam Samyasamuccaye",
    objective: "Solve special linear equations by inspection when the sum of terms on each side is equal.",
    durationMin: 25, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Sunyam Samyasamuccaye — if the sum is the same, the sum is zero. This sutra spots a special structure in equations that lets you write the answer without any working.",
      board: {
        type: "intro_card",
        data: {
          headline: "Solve Linear Equations by Inspection",
          example: "(x+3) + (x+5) = (x+4) + (x+4)",
          goal: "When both sides have equal sums, set the sum equal to zero.",
          assetPath: "/math-svgs/level_3/VM_L3_8_ALGEBRA_SPEED/samyasamuccaye-card.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the sutra", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "If the same expression appears as the sum of factors on both sides of an equation, then that expression equals zero. For (x+3)(x+5) = (x+4)(x+4): each side sums to 2x+8. So 2x+8=0, giving x=−4.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "If sum of terms left = sum of terms right → set each sum = 0",
          example: "(x+3)+(x+5) = 2x+8.  (x+4)+(x+4) = 2x+8.  Equal → 2x+8=0 → x=−4",
          assetPath: "/math-svgs/level_3/VM_L3_8_ALGEBRA_SPEED/inspection-highlight-frame.svg",
        },
      },
      explanation: {
        title: "What is 'Samuccaya'?",
        body: "Samuccaya means 'collection' or 'sum'. If the same collection of terms appears on both sides, it can be set to zero independently.",
        mistakeTip: "This sutra only applies when the sum of terms on both sides is IDENTICAL. Check both sides before applying.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Solve: (x+2)/(x+3) = (x+4)/(x+5). Cross-multiply: (x+2)(x+5) = (x+3)(x+4). Expanding both: x²+7x+10 = x²+7x+12. This simplifies to 10=12 — contradiction, so no solution. But if we had (x+2)+(x+5) = (x+3)+(x+4) = 2x+7: x=−3.5.",
      board: {
        type: "worked_example",
        data: {
          expression: "(x+1) + (x+7) = (x+3) + (x+5)",
          steps: [
            "Left sum: (x+1)+(x+7) = 2x+8",
            "Right sum: (x+3)+(x+5) = 2x+8",
            "Both equal 2x+8 → set 2x+8=0",
            "2x = −8 → x = −4",
          ],
          answer: -4,
          assetPath: "/math-svgs/level_3/VM_L3_8_ALGEBRA_SPEED/balance-scale.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The Samuccaya sutra shortcuts equations where traditional expansion would take much longer. Recognising the pattern is the skill.",
        mistakeTip: "Verify: substitute x=−4 back to confirm. (−3)+(3) = (−1)+(1) = 0. ✓",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Solve: (x+2)+(x+8) = (x+4)+(x+6). Check sums on both sides.",
      board: {
        type: "practice_board",
        data: {
          expression: "(x+2)+(x+8) = (x+4)+(x+6)",
          prompt: "Left sum = ? Right sum = ? Are they equal?",
          assetPath: "/math-svgs/level_3/VM_L3_8_ALGEBRA_SPEED/zero-pair-chips.svg",
        },
      },
      explanation: { title: "Steps", body: "Left: 2x+10. Right: 2x+10. Equal → 2x+10=0 → x=−5." },
      practice: {
        mode: "numeric",
        prompt: "Solve for x: (x+2)+(x+8) = (x+4)+(x+6)",
        answer: -5,
        hints: [
          "Left sum = 2x+10, Right sum = 2x+10",
          "Equal sums → set 2x+10 = 0",
          "x = −5",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Solve: (x+3)+(x+9) = (x+5)+(x+7). No working needed — inspect and set sum to zero.",
      board: {
        type: "practice_board",
        data: {
          expression: "(x+3)+(x+9) = (x+5)+(x+7)",
          prompt: "Inspect sums — apply Samuccaya directly.",
          assetPath: "/math-svgs/level_3/VM_L3_8_ALGEBRA_SPEED/variable-box-x.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve for x",
        answer: -6,
        hints: [
          "Left: 2x+12. Right: 2x+12. Equal!",
          "Set 2x+12 = 0",
          "x = −6",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Excellent. You have completed Level 3 — Power. Samuccaya algebra by inspection is one of the most elegant Vedic techniques and impresses examiners who expect long working.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Equal sums on both sides → set the sum to zero and solve.",
          remember: [
            "Compute sum of each side",
            "If both sides give the same expression, set it = 0",
            "Solve the resulting simple equation",
          ],
          example: "(x+1)+(x+7) = (x+3)+(x+5) → 2x+8=0 → x=−4",
          assetPath: "/math-svgs/level_3/VM_L3_8_ALGEBRA_SPEED/samyasamuccaye-card.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Applying Samuccaya without checking both sides. Sum on left must exactly match sum on right — otherwise, expand and solve normally.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "The Samuccaya Finale! Solve these linear equations by inspection. If the sum is the same, set it to zero! Master Level 3 with 35 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Algebra by Inspection Finale",
          prompt: "Verify sums are equal, then Sum=0.",
          assetPath: "/math-svgs/level_3/VM_L3_8_ALGEBRA_SPEED/samyasamuccaye-card.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "(x+2)+(x+8) = (x+4)+(x+6) -> solve for x", answer: -5, hints: ["2x+10=0"] },
          { prompt: "(x+1)+(x+5) = (x+2)+(x+4) -> solve for x", answer: -3, hints: ["2x+6=0"] },
          { prompt: "(x+3)+(x+9) = (x+5)+(x+7) -> solve for x", answer: -6, hints: ["2x+12=0"] },
          { prompt: "(x+10)+(x+20) = (x+15)+(x+15) -> solve for x", answer: -15, hints: ["2x+30=0"] },
          { prompt: "(x+1)+(x+2) = (x+3)+(x+0) -> solve for x (type digits: -1.5 as -1.5)", answer: -1.5, hints: ["2x+3=0"] },
          { prompt: "(x+8)+(x+12) = (x+10)+(x+10) -> solve for x", answer: -10, hints: ["2x+20=0"] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    },
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" },
  ],
  nextLessonUrl: "/mindsutra/course/level-4/lesson/VM_L4_1",
};
