import type { MindSutraLessonPayload } from "./mindsutraLessonTypes";

// ─── VM_L4_1 — Squaring Near Any Base (100, 1000) ────────────────────────────

export const VM_L4_1_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_4", levelId: "L4", levelSlug: "level-4", title: "Vedic Maths Level 4" },
  lesson: {
    id: "VM_L4_1", order: 1, title: "Squaring Near Any Base (100, 1000)",
    sutra: "Yavaduna Tavaduna",
    objective: "Square any number close to 100 or 1000 in two steps using the Yavaduna deviation formula.",
    durationMin: 25, difficulty: 3, xpReward: 40,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Yavaduna Tavaduna — by whatever the deficiency, lessen it still further. This sutra squares numbers near any base in two elegant steps.",
      board: {
        type: "intro_card",
        data: {
          headline: "Square Near Any Base — 2-Step Formula",
          example: "98²",
          goal: "Left = base deviation applied twice. Right = deviation squared.",
          assetPath: "/math-svgs/level_4/VM_L4_1_SQUARING_NEAR_BASE/near-base-square-board-advanced.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the formula", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For n near base B: deviation d = n − B. Left part = n + d (same as n + d = 2n − B). Right part = d². For base 100: right is 2 digits. For base 1000: right is 3 digits.",
      board: {
        type: "complement_bar",
        data: {
          rule: "n² = (n + d) | d²   where d = n − B",
          examples: [
            "98²: d=−2, left=98+(−2)=96, right=04 → 9604",
            "103²: d=+3, left=103+3=106, right=09 → 10609",
            "997²: d=−3, left=997+(−3)=994, right=009 → 994009",
          ],
          assetPath: "/math-svgs/level_4/VM_L4_1_SQUARING_NEAR_BASE/square-anchor-base-line-100.svg",
        },
      },
      explanation: {
        title: "Why (n+d)?",
        body: "n² = (n+d)(n−d) + d² = (B)(n−d) + d². But more directly: left = n + d, which equals n + (n−B) = 2n − B.",
        mistakeTip: "Right side must have exactly as many digits as zeros in the base. Pad with leading zeros.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Let us square 96. Base 100, d = −4. Left = 96 + (−4) = 92. Right = (−4)² = 16. Answer: 9216.",
      board: {
        type: "worked_example",
        data: {
          expression: "96²",
          steps: [
            "Base = 100, d = 96 − 100 = −4",
            "Left = 96 + (−4) = 92",
            "Right = (−4)² = 16 → 2 digits: 16",
            "Answer: 9216",
          ],
          answer: 9216,
          assetPath: "/math-svgs/level_4/VM_L4_1_SQUARING_NEAR_BASE/deficit-square-tag.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The left part decreases by the absolute value of d twice (once for the deviation in the original, once again in the formula). Right is always d².",
        mistakeTip: "For base 1000, right must be 3 digits. 997²: d²=9 → pad to 009.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 104². Base 100, deviation = +4. Left = 104 + 4 = ?",
      board: {
        type: "practice_board",
        data: {
          expression: "104²",
          prompt: "d = +4. Left = 104 + 4. Right = 4².",
          assetPath: "/math-svgs/level_4/VM_L4_1_SQUARING_NEAR_BASE/left-right-square-answer-box-advanced.svg",
        },
      },
      explanation: { title: "Steps", body: "Left = 108. Right = 16. Answer: 10816." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 104²",
        answer: 10816,
        hints: [
          "d = 104 − 100 = +4",
          "Left = 104 + 4 = 108",
          "Right = 4² = 16 → Answer: 10816",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Now try 999². Base 1000, d = −1. Right must be 3 digits.",
      board: {
        type: "practice_board",
        data: {
          expression: "999²",
          prompt: "d = −1. Left = 999+(−1). Right = 1² padded to 3 digits.",
          assetPath: "/math-svgs/level_4/VM_L4_1_SQUARING_NEAR_BASE/square-anchor-base-line-1000.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 999²",
        answer: 998001,
        hints: [
          "d = −1, base = 1000",
          "Left = 999 − 1 = 998",
          "Right = 1² = 001 (3 digits) → Answer: 998001",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Yavaduna squaring works for any base. The pattern — left shifts by deviation, right is deviation squared — is the same whether your base is 10, 100, or 1000.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "n² = (n+d) | d²  where d = n − base. Right = log₁₀(base) digits.",
          remember: [
            "Choose base as nearest power of 10",
            "Left = n + d (= 2n − base)",
            "Right = d² padded to correct digit count",
          ],
          example: "96² = 92|16 = 9216",
          assetPath: "/math-svgs/level_4/VM_L4_1_SQUARING_NEAR_BASE/near-base-square-board-advanced.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "For base 1000, d² must be 3 digits. 997²: d=−3, d²=9 → right = 009, not 9.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Step into the gap! Square these numbers near 100 and 1000 using the Yavaduna formula. Master this for 40 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Near-Base Squaring Sprint",
          prompt: "n + d | d² (pad digits correctly).",
          assetPath: "/math-svgs/level_4/VM_L4_1_SQUARING_NEAR_BASE/near-base-square-board-advanced.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "98²", answer: 9604, hints: ["98-2 | 04"] },
          { prompt: "103²", answer: 10609, hints: ["103+3 | 09"] },
          { prompt: "997²", answer: 994009, hints: ["997-3 | 009"] },
          { prompt: "96²", answer: 9216, hints: ["96-4 | 16"] },
          { prompt: "104²", answer: 10816, hints: ["104+4 | 16"] },
          { prompt: "999²", answer: 998001, hints: ["999-1 | 001"] },
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
  nextLessonUrl: "/mindsutra/course/level-4/lesson/VM_L4_2",
};

// ─── VM_L4_2 — Rational Number Addition — Vedic Speed ────────────────────────

export const VM_L4_2_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_4", levelId: "L4", levelSlug: "level-4", title: "Vedic Maths Level 4" },
  lesson: {
    id: "VM_L4_2", order: 2, title: "Rational Number Addition — Vedic Speed",
    sutra: "Anurupyena cross-multiply",
    objective: "Add fractions without finding LCD using Vedic cross-multiplication in one step.",
    durationMin: 20, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Traditional fraction addition requires finding the LCD — a slow process. Vedic cross-multiplication gives the answer directly in one step with no LCD needed.",
      board: {
        type: "intro_card",
        data: {
          headline: "Add Fractions Without LCD",
          example: "2/3 + 3/5",
          goal: "Cross-multiply to get numerator. Multiply denominators for denominator. Then simplify.",
          assetPath: "/math-svgs/level_4/VM_L4_2_RATIONAL_ADD/cross-multiply-fraction-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For a/b + c/d: new numerator = (a×d) + (b×c). New denominator = b×d. Then simplify. For 2/3 + 3/5: numerator = 2×5 + 3×3 = 10+9 = 19. Denominator = 3×5 = 15. Answer: 19/15.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "a/b + c/d = (ad + bc) / bd",
          example: "2/3 + 3/5 = (2×5 + 3×3) / (3×5) = 19/15",
          assetPath: "/math-svgs/level_4/VM_L4_2_RATIONAL_ADD/numerator-cross-arrow.svg",
        },
      },
      explanation: {
        title: "Why this works",
        body: "ad + bc is the numerator you get when you convert both fractions to the common denominator bd. This skips the LCD finding step entirely.",
        mistakeTip: "Multiply diagonally: a×d (top-left × bottom-right) and b×c (bottom-left × top-right).",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Add 3/4 + 5/6. Numerator: 3×6 + 4×5 = 18+20 = 38. Denominator: 4×6 = 24. Answer: 38/24. Simplify (HCF 2): 19/12.",
      board: {
        type: "worked_example",
        data: {
          expression: "3/4 + 5/6",
          steps: [
            "Numerator: (3×6) + (4×5) = 18 + 20 = 38",
            "Denominator: 4 × 6 = 24",
            "Fraction: 38/24",
            "Simplify ÷2: 19/12",
          ],
          answer: "19/12",
          assetPath: "/math-svgs/level_4/VM_L4_2_RATIONAL_ADD/rational-add-step-panel.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Always simplify the result. The cross-multiply method may give a denominator larger than the LCD, but simplification reduces it correctly.",
        mistakeTip: "Do not forget to simplify. 38/24 is not the final answer — divide both by HCF.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 1/3 + 1/4. Numerator = 1×4 + 3×1. Denominator = 3×4.",
      board: {
        type: "practice_board",
        data: {
          expression: "1/3 + 1/4",
          prompt: "Cross multiply: (1×4) + (3×1) = ? over 12.",
          assetPath: "/math-svgs/level_4/VM_L4_2_RATIONAL_ADD/denominator-product-box.svg",
        },
      },
      explanation: { title: "Steps", body: "Numerator: 4+3=7. Denominator: 12. Answer: 7/12." },
      practice: {
        mode: "numeric",
        prompt: "What is the numerator of 1/3 + 1/4?",
        answer: 7,
        hints: [
          "1×4 = 4",
          "3×1 = 3",
          "4 + 3 = 7 → numerator is 7",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Try 5/8 + 7/12. Cross-multiply, then simplify.",
      board: {
        type: "practice_board",
        data: {
          expression: "5/8 + 7/12",
          prompt: "Numerator = 5×12 + 8×7. Denominator = 8×12. Simplify.",
          assetPath: "/math-svgs/level_4/VM_L4_2_RATIONAL_ADD/cross-multiply-fraction-board.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What is the numerator after simplification of 5/8 + 7/12?",
        answer: 29,
        hints: [
          "5×12 + 8×7 = 60 + 56 = 116",
          "Denominator = 96",
          "HCF(116,96)=4: 116÷4=29? No: 116/96 → HCF=4 → 29/24. Numerator = 29",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "The cross-multiply method is fast and works for any two fractions. The only extra step is simplification at the end.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "a/b + c/d = (ad + bc) / bd  then simplify.",
          remember: [
            "Multiply across the diagonal for numerator",
            "Multiply denominators for new denominator",
            "Always simplify the result by HCF",
          ],
          example: "3/4 + 5/6 = 38/24 = 19/12",
          assetPath: "/math-svgs/level_4/VM_L4_2_RATIONAL_ADD/rational-add-step-panel.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students add the denominators instead of multiplying. Always MULTIPLY the denominators.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "No LCD, no worries! Solve these 6 fraction additions using the cross-multiplication method. Remember to simplify if needed. 35 XP reward!",
      board: {
        type: "practice_board",
        data: {
          headline: "Rational Addition Speed Drill",
          prompt: "Numerator = ad + bc. Denominator = bd.",
          assetPath: "/math-svgs/level_4/VM_L4_2_RATIONAL_ADD/cross-multiply-fraction-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "Numerator of 2/3 + 3/5", answer: 19, hints: ["10 + 9"] },
          { prompt: "Numerator of 3/4 + 5/6 (simplified)", answer: 19, hints: ["38/24 = 19/12"] },
          { prompt: "Numerator of 1/3 + 1/4", answer: 7, hints: ["4 + 3"] },
          { prompt: "Numerator of 1/2 + 1/3", answer: 5, hints: ["3 + 2"] },
          { prompt: "Numerator of 2/5 + 1/3", answer: 11, hints: ["6 + 5"] },
          { prompt: "Numerator of 3/5 + 1/4", answer: 17, hints: ["12 + 5"] },
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
  nextLessonUrl: "/mindsutra/course/level-4/lesson/VM_L4_3",
};

// ─── VM_L4_3 — Linear Equations — Paravartya & Samuccaya ─────────────────────

export const VM_L4_3_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_4", levelId: "L4", levelSlug: "level-4", title: "Vedic Maths Level 4" },
  lesson: {
    id: "VM_L4_3", order: 3, title: "Linear Equations — Paravartya & Samuccaya",
    sutra: "Paravartya + Sunyam",
    objective: "Solve multi-step linear equations in one step using Vedic transposition and sum-zero rules.",
    durationMin: 30, difficulty: 4, xpReward: 45,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Multi-step linear equations take 4–5 lines using standard algebra. Paravartya (transpose and adjust) combined with Samuccaya (sum to zero) cuts this to one or two mental steps.",
      board: {
        type: "intro_card",
        data: {
          headline: "Solve Linear Equations in One Step",
          example: "3x + 7 = x + 15",
          goal: "Transpose terms and apply Vedic sum-zero to read off x directly.",
          assetPath: "/math-svgs/level_4/VM_L4_3_LINEAR_EQ_VEDIC/paravartya-equation-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Paravartya: transpose any term by reversing its sign. Ax + B = Cx + D → (A−C)x = D−B → x = (D−B)/(A−C). This is the standard move but done as one mental step without writing intermediates.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "x = (constant difference) / (coefficient difference)",
          formula: "Ax + B = Cx + D  →  x = (D − B) / (A − C)",
          example: "3x + 7 = x + 15 → x = (15−7)/(3−1) = 8/2 = 4",
          assetPath: "/math-svgs/level_4/VM_L4_3_LINEAR_EQ_VEDIC/equation-balance-strip.svg",
        },
      },
      explanation: {
        title: "The transposition rule",
        body: "Move all x-terms to the left, all constants to the right. The formula x = (D−B)/(A−C) encodes this in one fraction.",
        mistakeTip: "Be careful with signs when transposing. A negative term on the right becomes positive when moved left.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Solve 5x − 3 = 2x + 9. A=5, B=−3, C=2, D=9. x = (D−B)/(A−C) = (9−(−3))/(5−2) = 12/3 = 4.",
      board: {
        type: "worked_example",
        data: {
          expression: "5x − 3 = 2x + 9",
          steps: [
            "A=5, B=−3, C=2, D=9",
            "x = (D − B) / (A − C)",
            "x = (9 − (−3)) / (5 − 2)",
            "x = 12 / 3 = 4",
          ],
          answer: 4,
          assetPath: "/math-svgs/level_4/VM_L4_3_LINEAR_EQ_VEDIC/term-shift-arrow.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "This is just the standard solution formula written once. The Vedic insight is to apply it mentally without four lines of working.",
        mistakeTip: "D−B means constant on the right MINUS constant on the left. Get the subtraction order right.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Solve 4x + 1 = x + 10. What are A, B, C, D?",
      board: {
        type: "practice_board",
        data: {
          expression: "4x + 1 = x + 10",
          prompt: "A=4, B=1, C=1, D=10. Apply x = (D−B)/(A−C).",
          assetPath: "/math-svgs/level_4/VM_L4_3_LINEAR_EQ_VEDIC/paravartya-equation-board.svg",
        },
      },
      explanation: { title: "Steps", body: "x = (10−1)/(4−1) = 9/3 = 3." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 4x + 1 = x + 10",
        answer: 3,
        hints: [
          "x = (D−B)/(A−C) = (10−1)/(4−1)",
          "= 9/3",
          "= 3",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Now try 7x − 5 = 3x + 11. Watch the sign of B.",
      board: {
        type: "practice_board",
        data: {
          expression: "7x − 5 = 3x + 11",
          prompt: "B = −5. D−B = 11−(−5) = ?",
          assetPath: "/math-svgs/level_4/VM_L4_3_LINEAR_EQ_VEDIC/solution-highlight-box.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 7x − 5 = 3x + 11",
        answer: 4,
        hints: [
          "D−B = 11−(−5) = 16",
          "A−C = 7−3 = 4",
          "x = 16/4 = 4",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "This one-step formula handles every standard linear equation. Combined with Samuccaya for special forms, you can solve any linear equation in under 10 seconds.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Ax + B = Cx + D → x = (D−B)/(A−C).",
          remember: [
            "Identify A, B (left side) and C, D (right side)",
            "Numerator = constant-right minus constant-left",
            "Denominator = x-coefficient-left minus x-coefficient-right",
          ],
          example: "5x−3 = 2x+9 → x = 12/3 = 4",
          assetPath: "/math-svgs/level_4/VM_L4_3_LINEAR_EQ_VEDIC/equation-balance-strip.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Reversing numerator and denominator. Remember: constants go on top, coefficients on bottom.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Solve in one breath! Apply the Vedic formula x = (D-B)/(A-C) to these 6 linear equations. 45 XP reward for the masters!",
      board: {
        type: "practice_board",
        data: {
          headline: "Linear Equation One-Step Marathon",
          prompt: "Constants difference / Coefficients difference.",
          assetPath: "/math-svgs/level_4/VM_L4_3_LINEAR_EQ_VEDIC/paravartya-equation-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "3x + 7 = x + 15", answer: 4, hints: ["8/2 = 4"] },
          { prompt: "5x − 3 = 2x + 9", answer: 4, hints: ["12/3 = 4"] },
          { prompt: "4x + 1 = x + 10", answer: 3, hints: ["9/3 = 3"] },
          { prompt: "7x − 5 = 3x + 11", answer: 4, hints: ["16/4 = 4"] },
          { prompt: "2x + 10 = 5x + 1", answer: 3, hints: ["9/3 = 3"] },
          { prompt: "10x + 5 = 2x + 21", answer: 2, hints: ["16/8 = 2"] },
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
  nextLessonUrl: "/mindsutra/course/level-4/lesson/VM_L4_4",
};

// ─── VM_L4_4 — Cubing Using Anurupyena ───────────────────────────────────────

export const VM_L4_4_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_4", levelId: "L4", levelSlug: "level-4", title: "Vedic Maths Level 4" },
  lesson: {
    id: "VM_L4_4", order: 4, title: "Cubing Using Anurupyena",
    sutra: "Anurupyena",
    objective: "Cube any 2-digit number using the a³ expansion pattern with proportional scaling.",
    durationMin: 30, difficulty: 4, xpReward: 45,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Cubing a 2-digit number looks intimidating. Anurupyena turns it into a structured four-slot calculation using ratios — no long multiplication grid required.",
      board: {
        type: "intro_card",
        data: {
          headline: "Cube Any 2-Digit Number — 4-Slot Method",
          example: "12³",
          goal: "Build a:b ratio pattern, scale, sum with carries.",
          assetPath: "/math-svgs/level_4/VM_L4_4_CUBING_ANURUPYENA/cube-expansion-grid.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the 4 slots", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For (a+b)³ where the number = 10a+b: Step 1: write a³, a²b, ab², b³ as four slots. Step 2: double the middle two slots. Step 3: carry from right to left. That gives the cube.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "(a+b)³ = a³ | 3a²b | 3ab² | b³",
          note: "For 2-digit: a = tens digit, b = ones digit. Scale middle terms ×3.",
          example: "12³: a=1,b=2 → 1 | 3×2 | 3×4 | 8 → 1|6|12|8",
          assetPath: "/math-svgs/level_4/VM_L4_4_CUBING_ANURUPYENA/a3-a2b-ab2-b3-strip.svg",
        },
      },
      explanation: {
        title: "Four slots",
        body: "a³ | 3a²b | 3ab² | b³. Carry right to left exactly as in multiplication.",
        mistakeTip: "Multiply the middle two slots by 3 (not 2). This is a cube, not a square.",
      },
      actions: [{ id: "next", label: "Walk me through 12³", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "12³: a=1, b=2. Fill the four cube slots directly: 1³ = 1, 3a²b = 3×1×2 = 6, 3ab² = 3×1×4 = 12, and b³ = 8. Now carry from right to left: 1|6|12|8 becomes 1728.",
      board: {
        type: "worked_example",
        data: {
          expression: "12³",
          steps: [
            "a=1, b=2",
            "Slots: a³=1 | 3a²b=3×1×2=6 | 3ab²=3×1×4=12 | b³=8",
            "Carry: 8 (no carry), 12 → write 2, carry 1",
            "6+1=7 (no carry), 1 (no carry)",
            "Answer: 1728",
          ],
          answer: 1728,
          assetPath: "/math-svgs/level_4/VM_L4_4_CUBING_ANURUPYENA/cube-carry-chain.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The four slots are directly from (a+b)³ expansion. Write them out, then carry right to left.",
        mistakeTip: "The second slot is 3a²b, not 2ab. The ×3 factor is critical.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 11³. a=1, b=1. Fill in the four slots.",
      board: {
        type: "practice_board",
        data: {
          expression: "11³",
          prompt: "Slots: 1 | 3×1×1 | 3×1×1 | 1 → 1|3|3|1",
          assetPath: "/math-svgs/level_4/VM_L4_4_CUBING_ANURUPYENA/cube-place-value-lane.svg",
        },
      },
      explanation: { title: "Steps", body: "1|3|3|1 — no carries. Answer: 1331." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 11³",
        answer: 1331,
        hints: [
          "Slots: a³=1, 3a²b=3, 3ab²=3, b³=1",
          "No carries needed",
          "Answer: 1331",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Now try 14³. Larger digits — more carries.",
      board: {
        type: "practice_board",
        data: {
          expression: "14³",
          prompt: "a=1, b=4. Slots: 1 | 12 | 48 | 64. Carry carefully.",
          assetPath: "/math-svgs/level_4/VM_L4_4_CUBING_ANURUPYENA/cube-answer-assembly-board.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 14³",
        answer: 2744,
        hints: [
          "Slots: 1 | 3×1×4=12 | 3×1×16=48 | 64",
          "64→write 4, carry 6. 48+6=54→write 4, carry 5. 12+5=17→write 7, carry 1. 1+1=2",
          "Answer: 2744",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "You can now cube any 2-digit number using four slots and carries. This skill directly leads to the algebraic identities lesson.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "(10a+b)³ = a³ | 3a²b | 3ab² | b³ — carry right to left.",
          remember: [
            "Four slots from (a+b)³ expansion",
            "Middle slots use ×3 factor",
            "Carry from slot 4 → 3 → 2 → 1",
          ],
          example: "12³ = 1|6|12|8 = 1728",
          assetPath: "/math-svgs/level_4/VM_L4_4_CUBING_ANURUPYENA/a3-a2b-ab2-b3-strip.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Using ×2 instead of ×3 for the middle slots. Remember: it is a CUBE — the binomial expansion has coefficients 1, 3, 3, 1.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Four slots of power! Cube these 6 2-digit numbers using the Anurupyena expansion. Stay precise with carries! 45 XP reward.",
      board: {
        type: "practice_board",
        data: {
          headline: "Anurupyena Cubing Sprint",
          prompt: "a³ | 3a²b | 3ab² | b³.",
          assetPath: "/math-svgs/level_4/VM_L4_4_CUBING_ANURUPYENA/cube-expansion-grid.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "11³", answer: 1331, hints: ["1 | 3 | 3 | 1"] },
          { prompt: "12³", answer: 1728, hints: ["1 | 6 | 12 | 8"] },
          { prompt: "10³", answer: 1000, hints: ["1000"] },
          { prompt: "20³", answer: 8000, hints: ["8000"] },
          { prompt: "13³", answer: 2197, hints: ["1 | 9 | 27 | 27 -> 2197"] },
          { prompt: "14³", answer: 2744, hints: ["1 | 12 | 48 | 64 -> 2744"] },
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
  nextLessonUrl: "/mindsutra/course/level-4/lesson/VM_L4_5",
};

// ─── VM_L4_5 — Nikhilam — Multiply Near 1000 ─────────────────────────────────

export const VM_L4_5_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_4", levelId: "L4", levelSlug: "level-4", title: "Vedic Maths Level 4" },
  lesson: {
    id: "VM_L4_5", order: 5, title: "Nikhilam — Multiply Near 1000",
    sutra: "Nikhilam Navatashcaramam Dashatah",
    objective: "Multiply two 3-digit numbers both close to 1000 using Nikhilam with 3-digit deviations.",
    durationMin: 30, difficulty: 4, xpReward: 45,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "You used Nikhilam near 100 in Level 2. Now we scale it to base 1000. The structure is identical — only the deviations are 3-digit numbers and the right side has 6 digits split into two 3-digit halves.",
      board: {
        type: "intro_card",
        data: {
          headline: "Nikhilam Near 1000 — 3-Digit Deviations",
          example: "998 × 993",
          goal: "Left = cross-sum of deviations. Right = product of deviations (6 digits, split 3|3).",
          assetPath: "/math-svgs/level_4/VM_L4_5_NIKHILAM_3DIG/near-1000-multiplication-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Base = 1000. d₁ = n₁ − 1000, d₂ = n₂ − 1000. Left = n₁ + d₂ (or n₂ + d₁). Right = d₁ × d₂ expressed as 3 digits (since base 1000). Total answer = Left × 1000 + Right.",
      board: {
        type: "complement_bar",
        data: {
          base: 1000,
          rule: "Left = either number + other deviation. Right = d₁×d₂ (3 digits).",
          example: "998×993: d₁=−2, d₂=−7. Left=998−7=991. Right=(−2)×(−7)=14→014. Answer: 991014.",
          assetPath: "/math-svgs/level_4/VM_L4_5_NIKHILAM_3DIG/nikhilam-base-line-1000.svg",
        },
      },
      explanation: {
        title: "Right-side 3-digit padding",
        body: "For base 1000, the right side must have exactly 3 digits. Product 14 becomes 014. Product 6 becomes 006.",
        mistakeTip: "If the deviation product exceeds 999, the right side carries into the left. This happens for large deviations.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "997 × 995. d₁=−3, d₂=−5. Left: 997−5=992. Right: 3×5=15 → 015. Answer: 992015.",
      board: {
        type: "worked_example",
        data: {
          expression: "997 × 995",
          steps: [
            "Base = 1000",
            "d₁ = 997−1000 = −3, d₂ = 995−1000 = −5",
            "Left: 997 + (−5) = 992",
            "Right: (−3)×(−5) = 15 → pad to 015",
            "Answer: 992015",
          ],
          answer: 992015,
          assetPath: "/math-svgs/level_4/VM_L4_5_NIKHILAM_3DIG/three-digit-deficit-tag.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Identical to base-100 Nikhilam. Only difference: 3-digit right side instead of 2-digit.",
        mistakeTip: "Always write right side as 3 digits. 15 → 015, 6 → 006.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 996 × 998. Find both deviations from 1000.",
      board: {
        type: "practice_board",
        data: {
          expression: "996 × 998",
          prompt: "d₁=−4, d₂=−2. Left = 996−2 = ? Right = 4×2 = ?",
          assetPath: "/math-svgs/level_4/VM_L4_5_NIKHILAM_3DIG/left-right-answer-split-3digit.svg",
        },
      },
      explanation: { title: "Steps", body: "Left=994. Right=8→008. Answer: 994008." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 996 × 998",
        answer: 994008,
        hints: [
          "d₁=−4, d₂=−2",
          "Left = 996−2 = 994",
          "Right = 4×2=8 → 008 → Answer: 994008",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Now try 1003 × 1005. Positive deviations — same method.",
      board: {
        type: "practice_board",
        data: {
          expression: "1003 × 1005",
          prompt: "d₁=+3, d₂=+5. Left = 1003+5. Right = 3×5 = 015.",
          assetPath: "/math-svgs/level_4/VM_L4_5_NIKHILAM_3DIG/three-digit-cross-board.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 1003 × 1005",
        answer: 1008015,
        hints: [
          "d₁=+3, d₂=+5",
          "Left = 1003+5 = 1008",
          "Right = 15 → 015 → Answer: 1008015",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Nikhilam near 1000 completes the Nikhilam trilogy. You now handle bases 10, 100, and 1000 with the same mental framework.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Base 1000: Left = cross-sum. Right = d₁×d₂ as 3 digits.",
          remember: [
            "Find deviations from 1000",
            "Left = either number plus the other's deviation",
            "Right = product of deviations, always 3 digits",
          ],
          example: "997×995 = 992|015 = 992015",
          assetPath: "/math-svgs/level_4/VM_L4_5_NIKHILAM_3DIG/near-1000-multiplication-board.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Padding with 2 digits instead of 3. For base 1000, ALWAYS write 3 digits on the right side.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Three-digit deviations! Solve these 6 multiplications near 1000 using Nikhilam. Don't forget the 0 padding! 45 XP reward.",
      board: {
        type: "practice_board",
        data: {
          headline: "Base 1000 Nikhilam Sprint",
          prompt: "Left = cross sum. Right = 3-digit product.",
          assetPath: "/math-svgs/level_4/VM_L4_5_NIKHILAM_3DIG/near-1000-multiplication-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "998 × 993", answer: 991014, hints: ["991 | 014"] },
          { prompt: "997 × 995", answer: 992015, hints: ["992 | 015"] },
          { prompt: "996 × 998", answer: 994008, hints: ["994 | 008"] },
          { prompt: "1003 × 1005", answer: 1008015, hints: ["1008 | 015"] },
          { prompt: "995 × 995", answer: 990025, hints: ["990 | 025"] },
          { prompt: "1002 × 1008", answer: 1010016, hints: ["1010 | 016"] },
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
  nextLessonUrl: "/mindsutra/course/level-4/lesson/VM_L4_6",
};

// ─── VM_L4_6 — Exponent Patterns — Vedic Insight ─────────────────────────────

export const VM_L4_6_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_4", levelId: "L4", levelSlug: "level-4", title: "Vedic Maths Level 4" },
  lesson: {
    id: "VM_L4_6", order: 6, title: "Exponent Patterns — Vedic Insight",
    sutra: "Ekadhikena power growth",
    objective: "Spot and apply Vedic patterns in powers of 2, 3, 5, and 10 for fast computation.",
    durationMin: 20, difficulty: 3, xpReward: 40,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Exponent questions in competitive exams can be solved in seconds if you recognise the underlying patterns. Vedic insight trains you to see the growth structure, not just compute.",
      board: {
        type: "intro_card",
        data: {
          headline: "Exponent Patterns — See the Growth",
          example: "2¹⁰ = 1024",
          goal: "Use doubling chains and number relationships to compute powers instantly.",
          assetPath: "/math-svgs/level_4/VM_L4_6_EXPONENT_PATTERNS/power-growth-ladder.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the patterns", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Key patterns to memorise: Powers of 2 double each time. 2¹⁰=1024≈1000. Powers of 5: 5¹=5, 5²=25, 5³=125, 5⁴=625. Powers of 3: 3,9,27,81,243. Use these as anchors to compute larger exponents.",
      board: {
        type: "place_value_split",
        data: {
          patterns: [
            "2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64, 2⁷=128, 2⁸=256, 2⁹=512, 2¹⁰=1024",
            "5¹=5, 5²=25, 5³=125, 5⁴=625, 5⁵=3125",
            "3¹=3, 3²=9, 3³=27, 3⁴=81, 3⁵=243",
          ],
          note: "2¹⁰ × 5¹⁰ = 10¹⁰ — the twin-base identity",
          assetPath: "/math-svgs/level_4/VM_L4_6_EXPONENT_PATTERNS/exponent-pattern-grid.svg",
        },
      },
      explanation: {
        title: "Anchor and extend",
        body: "Know one power deeply, derive the rest by doubling/tripling. 2⁸=256, so 2⁹=512, 2¹⁰=1024.",
        mistakeTip: "Do not recompute from scratch. Always start from the nearest known anchor.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Compute 2⁷ using anchors. Know 2⁵=32. Then 2⁶=64, 2⁷=128. Or: 2⁷ = 2¹⁰ ÷ 2³ = 1024 ÷ 8 = 128.",
      board: {
        type: "worked_example",
        data: {
          expression: "2⁷",
          steps: [
            "Anchor: 2⁵ = 32",
            "2⁶ = 32 × 2 = 64",
            "2⁷ = 64 × 2 = 128",
            "Verify: 2¹⁰ ÷ 2³ = 1024 ÷ 8 = 128 ✓",
          ],
          answer: 128,
          assetPath: "/math-svgs/level_4/VM_L4_6_EXPONENT_PATTERNS/repeated-multiply-chain.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Two approaches: step up from a lower anchor, or step down from 2¹⁰=1024 by dividing. Use whichever is shorter.",
        mistakeTip: "Do not multiply from 2¹ every time. Start from 2⁵=32 or 2¹⁰=1024 as your anchor.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Compute 5⁴ using the chain. You know 5³=125.",
      board: {
        type: "practice_board",
        data: {
          expression: "5⁴",
          prompt: "5³=125. 5⁴ = 125 × 5 = ?",
          assetPath: "/math-svgs/level_4/VM_L4_6_EXPONENT_PATTERNS/pattern-highlight-box.svg",
        },
      },
      explanation: { title: "Steps", body: "125 × 5 = 625." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 5⁴",
        answer: 625,
        hints: [
          "5³ = 125",
          "5⁴ = 125 × 5 = 625",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "What is 3⁵? Use 3⁴=81 as anchor.",
      board: {
        type: "practice_board",
        data: {
          expression: "3⁵",
          prompt: "3⁴=81. 3⁵ = 81 × 3 = ?",
          assetPath: "/math-svgs/level_4/VM_L4_6_EXPONENT_PATTERNS/exponent-pattern-grid.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 3⁵",
        answer: 243,
        hints: [
          "3⁴ = 81",
          "3⁵ = 81 × 3 = 243",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Exponent fluency is a major advantage in competitive exams. Build your anchor table once, then derive everything else in seconds.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Memorise 2¹⁰=1024, 5⁵=3125, 3⁵=243. Derive all others from these anchors.",
          remember: [
            "Step up: multiply by base",
            "Step down: divide by base",
            "Cross-check: 2ⁿ × 5ⁿ = 10ⁿ",
          ],
          example: "2⁷ = 2¹⁰ ÷ 2³ = 1024 ÷ 8 = 128",
          assetPath: "/math-svgs/level_4/VM_L4_6_EXPONENT_PATTERNS/power-growth-ladder.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Multiplying from 2¹ every time. Start from 2⁵=32 and step up only 2–3 steps.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Power growth! Solve these 6 exponent questions using the anchor shortcuts. Build your speed for 40 XP reward!",
      board: {
        type: "practice_board",
        data: {
          headline: "Exponent Anchor Speed Drill",
          prompt: "Anchors: 2⁵=32, 2¹⁰=1024, 3⁵=243, 5⁴=625.",
          assetPath: "/math-svgs/level_4/VM_L4_6_EXPONENT_PATTERNS/power-growth-ladder.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "2⁷", answer: 128, hints: ["32x2x2"] },
          { prompt: "5⁴", answer: 625, hints: ["125x5"] },
          { prompt: "3⁵", answer: 243, hints: ["81x3"] },
          { prompt: "2⁸", answer: 256, hints: ["128x2"] },
          { prompt: "5³", answer: 125, hints: ["25x5"] },
          { prompt: "3⁴", answer: 81, hints: ["27x3"] },
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
  nextLessonUrl: "/mindsutra/course/level-4/lesson/VM_L4_7",
};

// ─── VM_L4_7 — Triangle Area Shortcuts ───────────────────────────────────────

export const VM_L4_7_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_4", levelId: "L4", levelSlug: "level-4", title: "Vedic Maths Level 4" },
  lesson: {
    id: "VM_L4_7", order: 7, title: "Triangle Area Shortcuts",
    sutra: "Geometry + Vedic principles",
    objective: "Find triangle areas instantly using Pythagorean triples and the base-height shortcut.",
    durationMin: 20, difficulty: 3, xpReward: 40,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Triangle area problems in exams often use standard Pythagorean triple triangles. Recognising the triple instantly gives you the height without any calculation.",
      board: {
        type: "intro_card",
        data: {
          headline: "Triangle Areas Using Pythagorean Triples",
          example: "Triangle with sides 3, 4, 5",
          goal: "Identify the triple, read off height, compute ½×base×height directly.",
          assetPath: "/math-svgs/level_4/VM_L4_7_TRIANGLE_SHORTCUTS/triangle-area-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the triples", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Standard Pythagorean triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25). All multiples of these also work: (6,8,10), (9,12,15). For a right triangle with legs a and b, area = ½ab.",
      board: {
        type: "sutra_rule",
        data: {
          triples: ["3-4-5 → area = ½×3×4 = 6", "5-12-13 → area = ½×5×12 = 30", "8-15-17 → area = ½×8×15 = 60"],
          rule: "Right triangle area = ½ × leg₁ × leg₂",
          assetPath: "/math-svgs/level_4/VM_L4_7_TRIANGLE_SHORTCUTS/triple-pattern-card.svg",
        },
      },
      explanation: {
        title: "Why triples matter",
        body: "Exam problems almost always use standard triples or their multiples. Memorise the base triples and scale by inspection.",
        mistakeTip: "Area = ½ × TWO LEGS (not leg and hypotenuse). The hypotenuse is the longest side.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "A right triangle has sides 10, 24, 26. Recognise: this is 2×(5,12,13). Legs = 10 and 24. Area = ½×10×24 = 120.",
      board: {
        type: "worked_example",
        data: {
          expression: "Triangle sides: 10, 24, 26",
          steps: [
            "Recognise: 10-24-26 = 2 × (5-12-13) triple",
            "Legs = 10 and 24 (hypotenuse = 26)",
            "Area = ½ × 10 × 24 = 120",
          ],
          answer: 120,
          assetPath: "/math-svgs/level_4/VM_L4_7_TRIANGLE_SHORTCUTS/base-height-highlighter.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Spot the triple, scale if needed, apply ½×leg×leg. No trigonometry or Heron's formula needed.",
        mistakeTip: "Confirm: a² + b² = c². 10²+24² = 100+576 = 676 = 26². ✓",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Find the area of a triangle with sides 6, 8, 10.",
      board: {
        type: "practice_board",
        data: {
          expression: "Sides: 6, 8, 10",
          prompt: "Recognise the triple: 6-8-10 = 2 × (3-4-5). Legs = ?",
          assetPath: "/math-svgs/level_4/VM_L4_7_TRIANGLE_SHORTCUTS/triangle-formula-strip.svg",
        },
      },
      explanation: { title: "Steps", body: "Legs = 6 and 8. Area = ½×6×8 = 24." },
      practice: {
        mode: "numeric",
        prompt: "Area of triangle with sides 6, 8, 10 = ?",
        answer: 24,
        hints: [
          "6-8-10 is 2×(3-4-5) triple",
          "Legs = 6 and 8",
          "Area = ½ × 6 × 8 = 24",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Area of triangle with sides 15, 20, 25.",
      board: {
        type: "practice_board",
        data: {
          expression: "Sides: 15, 20, 25",
          prompt: "Recognise: 5×(3-4-5). Legs = 15, 20.",
          assetPath: "/math-svgs/level_4/VM_L4_7_TRIANGLE_SHORTCUTS/triangle-area-board.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Area of triangle with sides 15, 20, 25 = ?",
        answer: 150,
        hints: [
          "15-20-25 = 5×(3-4-5)",
          "Legs = 15, 20",
          "Area = ½×15×20 = 150",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Triangle area problems in exams are almost always disguised Pythagorean triples. Recognise the pattern and the answer is immediate.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Spot the triple. Area = ½ × leg₁ × leg₂.",
          remember: [
            "Core triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25",
            "Scale by any integer: 6-8-10, 9-12-15 etc.",
            "Hypotenuse is always the longest side — do not use it as a leg",
          ],
          example: "Sides 10-24-26: area = ½×10×24 = 120",
          assetPath: "/math-svgs/level_4/VM_L4_7_TRIANGLE_SHORTCUTS/triple-pattern-card.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Using the hypotenuse instead of one of the legs. Area = ½ × two shorter sides (legs) only.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Triple threat! Find the areas of these 6 triangles by spotting their Pythagorean triples. 40 XP for the fast finishers!",
      board: {
        type: "practice_board",
        data: {
          headline: "Pythagorean Area Speed Test",
          prompt: "½ × leg₁ × leg₂.",
          assetPath: "/math-svgs/level_4/VM_L4_7_TRIANGLE_SHORTCUTS/triangle-area-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "Area: sides 3, 4, 5", answer: 6, hints: ["½x12"] },
          { prompt: "Area: sides 6, 8, 10", answer: 24, hints: ["½x48"] },
          { prompt: "Area: sides 5, 12, 13", answer: 30, hints: ["½x60"] },
          { prompt: "Area: sides 8, 15, 17", answer: 60, hints: ["½x120"] },
          { prompt: "Area: sides 7, 24, 25", answer: 84, hints: ["½x168"] },
          { prompt: "Area: sides 15, 20, 25", answer: 150, hints: ["½x300"] },
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
  nextLessonUrl: "/mindsutra/course/level-4/lesson/VM_L4_8",
};

// ─── VM_L4_8 — Algebraic Identities — Fast Expansion ─────────────────────────

export const VM_L4_8_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_4", levelId: "L4", levelSlug: "level-4", title: "Vedic Maths Level 4" },
  lesson: {
    id: "VM_L4_8", order: 8, title: "Algebraic Identities — Fast Expansion",
    sutra: "Anurupyena structural",
    objective: "Expand (a±b)² and (a+b)(a−b) instantly by recognising the identity structure.",
    durationMin: 25, difficulty: 4, xpReward: 45,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Algebraic identities are not formulas to memorise — they are patterns to recognise. Once you see the structure, expansion takes three seconds, not three lines.",
      board: {
        type: "intro_card",
        data: {
          headline: "Algebraic Identities — Pattern Recognition",
          example: "(x + 3)²",
          goal: "Write the expansion directly by seeing the identity structure.",
          assetPath: "/math-svgs/level_4/VM_L4_8_ALGEBRAIC_IDENTITIES/identity-flow-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the identities", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Three key identities: (a+b)² = a²+2ab+b². (a−b)² = a²−2ab+b². (a+b)(a−b) = a²−b². Recognise which one applies, substitute a and b, write the answer.",
      board: {
        type: "sutra_rule",
        data: {
          identities: [
            "(a+b)² = a² + 2ab + b²",
            "(a−b)² = a² − 2ab + b²",
            "(a+b)(a−b) = a² − b²",
          ],
          assetPath: "/math-svgs/level_4/VM_L4_8_ALGEBRAIC_IDENTITIES/identity-grid.svg",
        },
      },
      explanation: {
        title: "Spot the structure first",
        body: "Before expanding, identify: is it a square of a sum? A square of a difference? A product of a sum and difference?",
        mistakeTip: "2ab is the middle term in squares. Students often write ab instead of 2ab.",
      },
      actions: [{ id: "next", label: "Walk me through (x+5)²", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "(x+5)²: identity (a+b)². a=x, b=5. Expansion: x² + 2×x×5 + 5² = x² + 10x + 25.",
      board: {
        type: "worked_example",
        data: {
          expression: "(x + 5)²",
          steps: [
            "Identity: (a+b)²",
            "a = x, b = 5",
            "a² = x²",
            "2ab = 2 × x × 5 = 10x",
            "b² = 25",
            "Answer: x² + 10x + 25",
          ],
          answer: "x² + 10x + 25",
          assetPath: "/math-svgs/level_4/VM_L4_8_ALGEBRAIC_IDENTITIES/binomial-area-model.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Three terms: first squared, twice the product, second squared. Write them directly — no FOIL expansion needed.",
        mistakeTip: "The middle term is 2ab, not ab. For (x+5)², middle = 10x, not 5x.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Expand (x − 4)². Which identity applies?",
      board: {
        type: "practice_board",
        data: {
          expression: "(x − 4)²",
          prompt: "(a−b)² = a² − 2ab + b². a=x, b=4.",
          assetPath: "/math-svgs/level_4/VM_L4_8_ALGEBRAIC_IDENTITIES/expand-collapse-terms-panel.svg",
        },
      },
      explanation: { title: "Steps", body: "x² − 8x + 16." },
      practice: {
        mode: "numeric",
        prompt: "What is the constant term in (x−4)² expanded?",
        answer: 16,
        hints: [
          "(a−b)²: a=x, b=4",
          "b² = 4² = 16",
          "Full expansion: x² − 8x + 16 → constant = 16",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Expand (x+7)(x−7). Spot the difference-of-squares identity.",
      board: {
        type: "practice_board",
        data: {
          expression: "(x+7)(x−7)",
          prompt: "(a+b)(a−b) = a²−b². a=x, b=7.",
          assetPath: "/math-svgs/level_4/VM_L4_8_ALGEBRAIC_IDENTITIES/identity-flow-board.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What is the constant term in (x+7)(x−7) expanded?",
        answer: -49,
        hints: [
          "(a+b)(a−b) = a² − b²",
          "a²=x², b²=49",
          "Answer: x²−49 → constant = −49",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "You have completed Level 4. Algebraic identity recognition is one of the highest-value skills for board exams and competitive tests. Practice until you see the structure instantly.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "See the identity structure first. Substitute a and b. Write the answer in one step.",
          remember: [
            "(a+b)² = a²+2ab+b²",
            "(a−b)² = a²−2ab+b²",
            "(a+b)(a−b) = a²−b²",
          ],
          example: "(x+5)² = x²+10x+25",
          assetPath: "/math-svgs/level_4/VM_L4_8_ALGEBRAIC_IDENTITIES/identity-grid.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Writing ab instead of 2ab in the middle term. The coefficient 2 in 2ab is essential.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Pattern Recognition! Expand these 6 algebraic identities using the Vedic insight tricks. Complete Level 4 for 45 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Identity Expansion Finale",
          prompt: "a²+2ab+b², a²-2ab+b², a²-b².",
          assetPath: "/math-svgs/level_4/VM_L4_8_ALGEBRAIC_IDENTITIES/identity-flow-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "Constant term of (x+5)²", answer: 25, hints: ["5²"] },
          { prompt: "Constant term of (x-4)²", answer: 16, hints: ["(-4)²"] },
          { prompt: "Constant term of (x+7)(x-7)", answer: -49, hints: ["-7²"] },
          { prompt: "Constant term of (x+1)²", answer: 1, hints: ["1²"] },
          { prompt: "Constant term of (x-1)²", answer: 1, hints: ["(-1)²"] },
          { prompt: "Constant term of (x+10)(x-10)", answer: -100, hints: ["-10²"] },
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
  nextLessonUrl: "/mindsutra/course/level-5/lesson/VM_L5_1",
};
