import type { MindSutraLessonPayload } from "./mindsutraLessonTypes";

// ─── VM_L2_1 — Nikhilam — Multiply Near 100 ─────────────────────────────────

export const VM_L2_1_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_2", levelId: "L2", levelSlug: "level-2", title: "Vedic Maths Level 2" },
  lesson: {
    id: "VM_L2_1", order: 1, title: "Nikhilam — Multiply Near 100",
    sutra: "Nikhilam Navatashcaramam Dashatah",
    objective: "Multiply two numbers both close to 100 using deviations in two steps.",
    supportTag: "Core",
    durationMin: 25, difficulty: 2, xpReward: 30,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "The Nikhilam sutra — All from 9, last from 10 — gives us a blazing fast way to multiply numbers that are close to 100. You only need to track the deviation from 100.",
      board: {
        type: "intro_card",
        data: {
          headline: "Nikhilam: Multiply Near-100 Numbers",
          example: "97 × 93",
          goal: "Two-step answer using deviations from 100.",
          assetPath: "/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/near-100-multiplication-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Write both deviations from 100. For 97, deviation = −3. For 93, deviation = −7. Left part of answer: cross-subtract any deviation from the other number: 97 − 7 = 90. Right part: multiply the two deviations: (−3) × (−7) = 21. Answer: 9021.",
      board: {
        type: "complement_bar",
        data: {
          base: 100,
          pairs: [{ number: 97, deviation: -3 }, { number: 93, deviation: -7 }],
          leftRule: "97 − 7 = 90  (or 93 − 3 = 90)",
          rightRule: "(−3) × (−7) = 21",
          answer: "9021",
          assetPath: "/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/nikhilam-deficit-tag.svg",
        },
      },
      explanation: {
        title: "Left and right halves",
        body: "Left = either number minus the other's deviation. Right = product of the two deviations (always 2 digits; pad with zero if needed).",
        alternateExplanation: "Think of the answer as two windows. The left window shows the shared near-100 part, and the right window shows the tiny correction from the deviations.",
        mistakeTip: "If the right-side product is a single digit, pad with a leading zero. E.g., deviation product = 6 → write 06.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "98 × 96. Deviations: −2 and −4. Left: 98 − 4 = 94. Right: 2 × 4 = 08. Answer: 9408.",
      board: {
        type: "worked_example",
        data: {
          expression: "98 × 96",
          steps: [
            "Deviation of 98 from 100 = −2",
            "Deviation of 96 from 100 = −4",
            "Left: 98 − 4 = 94",
            "Right: (−2) × (−4) = 8 → pad to 08",
            "Answer: 9408",
          ],
          answer: 9408,
          assetPath: "/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/worked-98-times-96.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The right side always has exactly 2 digits (for base 100). Always pad a single-digit product with a zero on the left.",
        alternateExplanation: "Base first, correction second. First decide the left part near 100, then attach the deviation product as the last two digits.",
        mistakeTip: "Students forget to pad. 6 becomes 06, not 6.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 94 × 97. Find both deviations, then build the left and right halves.",
      board: {
        type: "practice_board",
        data: {
          expression: "94 × 97",
          prompt: "Deviation of 94 = −6. First lock the left half of the answer.",
          assetPath: "/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/guided-94-times-97.svg",
        },
      },
      explanation: { title: "Steps", body: "Left: 94 − 3 = 91. Right: 6 × 3 = 18. Answer: 9118." },
      practice: {
        mode: "mcq",
        prompt: "What is the left half of 94 × 97 using Nikhilam?",
        answer: 91,
        options: ["89", "90", "91", "94"],
        hints: [
          "Deviation of 94 = −6, deviation of 97 = −3",
          "Use cross-subtraction for the left half: 94 − 3",
          "That gives 91, and then the right half 18 makes 9118",
        ],
        remediation: {
          prompt: "Checkpoint: what is the deviation of 97 from 100?",
          answer: -3,
          options: ["-6", "-3", "+3", "+6"],
          hints: [
            "97 is below 100, so the deviation is negative",
            "100 − 97 = 3",
            "So the deviation is −3",
          ],
        },
        challenge: {
          prompt: "Transfer check: after left half 91, what full answer do you get for 94 × 97?",
          answer: 9118,
          options: ["9018", "9118", "9218", "9418"],
          hints: [
            "The right half comes from 6 × 3",
            "6 × 3 = 18",
            "Join left 91 and right 18 to get 9118",
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
      tutorText: "Now try a surplus case: 103 × 104. Both are above 100, so deviations are positive.",
      board: {
        type: "practice_board",
        data: {
          expression: "103 × 104",
          prompt: "Positive deviations — same method, same structure. Start with the left half.",
          assetPath: "/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/challenge-103-times-104.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What is the left half of 103 × 104 using Nikhilam?",
        answer: 107,
        options: ["103", "104", "107", "112"],
        hints: [
          "Deviation of 103 = +3, deviation of 104 = +4",
          "Use cross-addition for the left half: 103 + 4",
          "That gives 107, and then the right half 12 makes 10712",
        ],
        remediation: {
          prompt: "Checkpoint: what is the deviation of 104 from 100?",
          answer: 4,
          options: ["3", "4", "6", "14"],
          hints: [
            "104 is above 100, so the deviation is positive",
            "104 − 100 = 4",
            "So the deviation is +4",
          ],
        },
        challenge: {
          prompt: "Transfer check: after left half 107, what full answer do you get for 103 × 104?",
          answer: 10712,
          options: ["10312", "10712", "10721", "11112"],
          hints: [
            "The right half comes from 3 × 4",
            "3 × 4 = 12",
            "Join left 107 and right 12 to get 10712",
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
      tutorText: "Excellent. Nikhilam near 100 is one of the most impressive Vedic mental math techniques. In Level 4 you will extend this to base 1000.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Left = number ± other deviation. Right = product of deviations (2 digits).",
          remember: [
            "Find deviations from 100 (negative if below, positive if above)",
            "Left half: cross-add/subtract deviation",
            "Right half: multiply deviations — always 2 digits",
          ],
          example: "97 × 93 = 90|21 = 9021",
          assetPath: "/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/nikhilam-comparison-pair.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Right side product must be 2 digits. Pad single-digit products with a leading zero.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Ready for the one-minute speed test? Solve these 6 multiplications using the Nikhilam rule. 30 XP is waiting for you!",
      board: {
        type: "practice_board",
        data: {
          headline: "Nikhilam Near-100 Speed Drill",
          prompt: "Left = Cross-sum | Right = Product.",
          assetPath: "/math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/near-100-multiplication-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "98 × 97", answer: 9506, hints: ["(-2) x (-3) = 06, 98-3=95"] },
          { prompt: "102 × 103", answer: 10506, hints: ["(+2) x (+3) = 06, 102+3=105"] },
          { prompt: "95 × 96", answer: 9120, hints: ["(-5) x (-4) = 20, 95-4=91"] },
          { prompt: "105 × 106", answer: 11130, hints: ["(+5) x (+6) = 30, 105+6=111"] },
          { prompt: "91 × 99", answer: 9009, hints: ["(-9) x (-1) = 09, 91-1=90"] },
          { prompt: "108 × 102", answer: 11016, hints: ["(+8) x (+2) = 16, 108+2=110"] },
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
  nextLessonUrl: "/mindsutra/course/level-2/lesson/VM_L2_2",
};

// ─── VM_L2_2 — Anurupyena — Proportional 3-Digit Mult ───────────────────────

export const VM_L2_2_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_2", levelId: "L2", levelSlug: "level-2", title: "Vedic Maths Level 2" },
  lesson: {
    id: "VM_L2_2", order: 2, title: "Anurupyena — Proportional 3-Digit Mult",
    sutra: "Anurupyena",
    objective: "Scale a 3-digit number to a convenient base and multiply proportionally.",
    supportTag: "Core",
    durationMin: 25, difficulty: 2, xpReward: 30,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Anurupyena means proportionality. When a 3-digit number is a simple multiple of a friendly base, we can scale it, multiply easily, and scale back.",
      board: {
        type: "intro_card",
        data: {
          headline: "Proportional Multiplication — Scale & Simplify",
          example: "125 × 8",
          goal: "Choose a base that makes one factor friendly, then adjust the result.",
          assetPath: "/math-svgs/level_2/VM_L2_2_ANURUPYENA_3DIG/anurupyena-base-scaling-panel.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the idea", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "125 is 1000 ÷ 8. So 125 × 8 = 1000. More generally, if you can scale one factor by dividing and the other by multiplying the same amount, the product is preserved — Anurupyena.",
      board: {
        type: "place_value_split",
        data: {
          rule: "Scale one factor up, divide the other by the same amount.",
          example1: "125 × 8 → 125 × 8 = 1000 (direct: 125 = 1000/8)",
          example2: "250 × 4 → 500 × 2 = 1000",
          assetPath: "/math-svgs/level_2/VM_L2_2_ANURUPYENA_3DIG/proportion-ratio-strip.svg",
        },
      },
      explanation: {
        title: "Proportional scaling",
        body: "If A × B = product, then (A × k) × (B ÷ k) = same product. Choose k to make one factor a round number.",
        mistakeTip: "The scaling must be exact. Only scale by a number that divides evenly into one of the factors.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Solve 375 × 16. 375 × 16: scale by ×4 and ÷4: 375÷4 is not clean. Try ×8 and ÷8: 375÷8 not clean. Alternative: 375 = 3 × 125. So 375 × 16 = 3 × 125 × 16 = 3 × 2000 = 6000.",
      board: {
        type: "worked_example",
        data: {
          expression: "375 × 16",
          steps: [
            "375 = 3 × 125",
            "125 × 16 = 2000  (since 125 × 8 = 1000, × 2 = 2000)",
            "3 × 2000 = 6000",
          ],
          answer: 6000,
          assetPath: "/math-svgs/level_2/VM_L2_2_ANURUPYENA_3DIG/proportional-multiplication-card.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Look for 125, 250, 500 which pair naturally with 8, 4, 2. Once one side becomes 1000, the rest is trivial.",
        mistakeTip: "If neither number is a simple multiple of 125 or 250, fall back to criss-cross (next lesson).",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 250 × 36. Can you halve 250 and double 36 to reach a simpler product?",
      board: {
        type: "practice_board",
        data: {
          expression: "250 × 36",
          prompt: "Scale 250 to 1000 — what do you multiply it by?",
          assetPath: "/math-svgs/level_2/VM_L2_2_ANURUPYENA_3DIG/scaled-base-chip.svg",
        },
      },
      explanation: { title: "Steps", body: "250 × 4 = 1000. Divide 36 by 4 = 9. Answer: 9000." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 250 × 36",
        answer: 9000,
        hints: [
          "250 × 4 = 1000 — scale up 250 by ×4",
          "Divide 36 by 4 = 9",
          "9 × 1000 = 9000",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Now try 125 × 48. Think in two stages.",
      board: {
        type: "practice_board",
        data: {
          expression: "125 × 48",
          prompt: "125 × 8 = 1000. How many 8s fit in 48?",
          assetPath: "/math-svgs/level_2/VM_L2_2_ANURUPYENA_3DIG/adjusted-base-board.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 125 × 48",
        answer: 6000,
        hints: [
          "125 × 8 = 1000",
          "48 = 8 × 6, so 125 × 48 = 1000 × 6 = 6000",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Anurupyena thinking — always look for a simpler equivalent form before computing. This habit alone can save you minutes in any exam.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Spot 125, 250, 500 — they pair with 8, 4, 2 to make 1000.",
          remember: [
            "Scale one factor to a power of 10",
            "Divide the other factor by the same scaling amount",
            "Multiply using the round power of 10",
          ],
          example: "375 × 16 = 3 × 125 × 16 = 3 × 2000 = 6000",
          assetPath: "/math-svgs/level_2/VM_L2_2_ANURUPYENA_3DIG/anurupyena-base-scaling-panel.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students scale only one factor without adjusting the other. Both adjustments must happen simultaneously.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Can you spot the multipliers? Solve these 6 multiplications using the Anurupyena scaling trick. A perfect score gets you 30 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Scaling Shortcut Speed Test",
          prompt: "Look for 125x8, 250x4, 500x2 = 1000.",
          assetPath: "/math-svgs/level_2/VM_L2_2_ANURUPYENA_3DIG/anurupyena-base-scaling-panel.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "250 × 12", answer: 3000, hints: ["1000 x 3"] },
          { prompt: "125 × 16", answer: 2000, hints: ["1000 x 2"] },
          { prompt: "500 × 14", answer: 7000, hints: ["1000 x 7"] },
          { prompt: "125 × 32", answer: 4000, hints: ["1000 x 4"] },
          { prompt: "250 × 24", answer: 6000, hints: ["1000 x 6"] },
          { prompt: "125 × 40", answer: 5000, hints: ["1000 x 5"] },
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
  nextLessonUrl: "/mindsutra/course/level-2/lesson/VM_L2_3",
};

// ─── VM_L2_3 — Criss-Cross 3-Digit Multiplication ───────────────────────────

export const VM_L2_3_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_2", levelId: "L2", levelSlug: "level-2", title: "Vedic Maths Level 2" },
  lesson: {
    id: "VM_L2_3", order: 3, title: "Criss-Cross 3-Digit Multiplication",
    sutra: "Urdhva-Tiryagbhyam",
    objective: "Extend the criss-cross method to 3×3 digits using five column products.",
    supportTag: "Practice-heavy",
    durationMin: 30, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "In Level 1 you mastered 2-digit criss-cross. Now we extend the same Urdhva-Tiryagbhyam pattern to 3 digits. The structure is identical — just 5 columns instead of 3.",
      board: {
        type: "intro_card",
        data: {
          headline: "Criss-Cross: 3-Digit × 3-Digit in 5 Steps",
          example: "123 × 231",
          goal: "Five column products, carry left, read the answer.",
          assetPath: "/math-svgs/level_2/VM_L2_3_CRISS_CROSS_3DIG/criss-cross-3digit-frame.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the 5 columns", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Write the two numbers as ABC and DEF. Five columns from right: C×F | B×F+C×E | A×F+B×E+C×D | A×E+B×D | A×D. Write rightmost digit of each column sum, carry the rest left.",
      board: {
        type: "criss_cross",
        data: {
          expression: "ABC × DEF",
          columns: [
            { label: "Ten-thousands", product: "A×D" },
            { label: "Thousands", product: "A×E + B×D" },
            { label: "Hundreds", product: "A×F + B×E + C×D" },
            { label: "Tens", product: "B×F + C×E" },
            { label: "Ones", product: "C×F" },
          ],
          assetPath: "/math-svgs/level_2/VM_L2_3_CRISS_CROSS_3DIG/urdhva-tiryagbhyam-card-advanced.svg",
        },
      },
      explanation: {
        title: "Same carry rule",
        body: "Each column sum may be a 2-digit number. Write the ones digit in that column position, carry the tens digit to the next column on the left.",
        mistakeTip: "The middle (hundreds) column has THREE cross-products to add. Students often miss one of them.",
      },
      actions: [{ id: "next", label: "Walk me through 121 × 111", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "121 × 111. Ones: 1×1=1. Tens: 2×1+1×1=3. Hundreds: 1×1+2×1+1×1=4. Thousands: 1×1+2×1=3. Ten-thousands: 1×1=1. Answer: 13431.",
      board: {
        type: "worked_example",
        data: {
          expression: "121 × 111",
          steps: [
            "Ones: 1×1 = 1",
            "Tens: 2×1 + 1×1 = 3",
            "Hundreds: 1×1 + 2×1 + 1×1 = 4",
            "Thousands: 1×1 + 2×1 = 3",
            "Ten-thousands: 1×1 = 1",
            "Answer: 13431",
          ],
          answer: 13431,
          assetPath: "/math-svgs/level_2/VM_L2_3_CRISS_CROSS_3DIG/triple-cross-highlight.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Start at the ones column and work left. Carries accumulate as you go. Write one digit per column, carry the rest.",
        mistakeTip: "Column 3 (hundreds) always has 3 terms. Set them out on paper before summing.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 112 × 213. Work column by column. The most important check is the 3-term middle band.",
      board: {
        type: "practice_board",
        data: {
          expression: "112 × 213",
          prompt: "5 columns from right to left. First lock the middle band.",
          assetPath: "/math-svgs/level_2/VM_L2_3_CRISS_CROSS_3DIG/middle-band-product-panel.svg",
        },
      },
      explanation: { title: "Column sums", body: "Ones:6. Tens:1×3+2×1=5. Hundreds:1×3+1×1+2×2=8. Thousands:1×1+1×2=3. Ten-th:1×2=2. Answer: 23856." },
      practice: {
        mode: "mcq",
        prompt: "What is the middle band value for 112 × 213?",
        answer: 8,
        options: ["6", "7", "8", "9"],
        hints: [
          "The middle band has 3 products in a 3-digit criss-cross",
          "1×3 + 1×1 + 2×2 = 3 + 1 + 4 = 8",
          "Then the full answer reads 23856",
        ],
        remediation: {
          prompt: "Checkpoint: how many products are added in the middle band of a 3-digit criss-cross?",
          answer: 3,
          options: ["2", "3", "4", "5"],
          hints: [
            "The pattern grows as 1, 2, 3, 2, 1",
            "The middle band is the widest band",
            "So the middle band has 3 products",
          ],
        },
        challenge: {
          prompt: "Transfer check: after the middle band 8, what full answer do you read for 112 × 213?",
          answer: 23856,
          options: ["23586", "23856", "28356", "23865"],
          hints: [
            "The bands from right are 6, 5, 8, 3, 2",
            "Read them from left after reversing",
            "That gives 23856",
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
      tutorText: "Now try 234 × 111. This time the carry idea matters more than the full answer.",
      board: {
        type: "practice_board",
        data: {
          expression: "234 × 111",
          prompt: "All 5 columns — watch the carry flow from the larger bands.",
          assetPath: "/math-svgs/level_2/VM_L2_3_CRISS_CROSS_3DIG/carry-normalization-lane-3digit.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What is the middle band value for 234 × 111?",
        answer: 9,
        options: ["7", "8", "9", "10"],
        hints: [
          "Middle band = 2×1 + 3×1 + 4×1",
          "2 + 3 + 4 = 9",
          "That middle band writes 9 because there is no extra carry from it",
        ],
        remediation: {
          prompt: "Checkpoint: what is the tens band value for 234 × 111?",
          answer: 7,
          options: ["6", "7", "8", "9"],
          hints: [
            "Tens uses the 2-product band",
            "3×1 + 4×1 = 3 + 4",
            "So the tens band is 7",
          ],
        },
        challenge: {
          prompt: "Transfer check: after the bands 4, 7, 9, 5, 2 from right, what full answer do you read?",
          answer: 25974,
          options: ["25794", "25947", "25974", "29574"],
          hints: [
            "Reverse the right-to-left band totals",
            "That gives 2, 5, 9, 7, 4",
            "So the answer is 25974",
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
      tutorText: "The criss-cross pattern is fully scalable. Three digits use 5 columns. Four digits use 7 columns — that is Level 5. The principle stays the same.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "5 columns: C×F | B×F+C×E | A×F+B×E+C×D | A×E+B×D | A×D",
          remember: [
            "Start from the ones column, move left",
            "Middle column has 3 cross-products",
            "Carry any two-digit sum to the next column",
          ],
          example: "121 × 111 = 13431",
          assetPath: "/math-svgs/level_2/VM_L2_3_CRISS_CROSS_3DIG/answer-slot-series-5.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "The hundreds column has THREE terms — A×F, B×E, and C×D. Missing any one gives a wrong answer.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "The 3D Challenge! Multiply these 3-digit numbers using all 5 columns. Complete this tough set for 35 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Criss-Cross 3D Finale",
          prompt: "Five column products. Stay focused on the middle cross!",
          assetPath: "/math-svgs/level_2/VM_L2_3_CRISS_CROSS_3DIG/criss-cross-3digit-frame.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "111 × 121", answer: 13431, hints: ["Middle: 1x1+1x2+1x1 = 4"] },
          { prompt: "101 × 202", answer: 20402, hints: ["Middle: 1x2+0x0+1x2 = 4"] },
          { prompt: "121 × 111", answer: 13431, hints: ["Middle: 4"] },
          { prompt: "212 × 101", answer: 21412, hints: ["Middle: 2+0+2=4"] },
          { prompt: "111 × 111", answer: 12321, hints: ["1, 2, 3, 2, 1"] },
          { prompt: "102 × 201", answer: 20502, hints: ["Middle: 1x1+0x0+2x2=5"] },
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
  nextLessonUrl: "/mindsutra/course/level-2/lesson/VM_L2_4",
};

// ─── VM_L2_4 — Division by 9 — Running Remainder ─────────────────────────────

export const VM_L2_4_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_2", levelId: "L2", levelSlug: "level-2", title: "Vedic Maths Level 2" },
  lesson: {
    id: "VM_L2_4", order: 4, title: "Division by 9 — Running Remainder",
    sutra: "Dhvajanka variant",
    objective: "Divide any number by 9 in one line using a running digit-sum method.",
    supportTag: "Core",
    durationMin: 25, difficulty: 2, xpReward: 30,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Dividing by 9 has a beautiful one-line shortcut in Vedic Maths. You simply accumulate each digit into a running total — the totals become the quotient digits and the final total is the remainder.",
      board: {
        type: "intro_card",
        data: {
          headline: "Divide by 9 in One Line",
          example: "132 ÷ 9",
          goal: "Running digit sum gives quotient and remainder directly.",
          assetPath: "/math-svgs/level_2/VM_L2_4_DIVISION_BY_9/division-by-9-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For any number divided by 9: bring down the first digit. Add it to the next digit — that sum is the next quotient digit. Keep adding. The last sum is the remainder. If any sum ≥ 9, carry into the previous quotient digit.",
      board: {
        type: "place_value_split",
        data: {
          number: "132",
          divisor: 9,
          steps: ["Bring 1 down → q₁ = 1", "1 + 3 = 4 → q₂ = 4", "4 + 2 = 6 → remainder = 6"],
          quotient: "14",
          remainder: 6,
          assetPath: "/math-svgs/level_2/VM_L2_4_DIVISION_BY_9/running-remainder-chip.svg",
        },
      },
      explanation: {
        title: "Running total rule",
        body: "Each step: new running total = previous quotient digit + next dividend digit. The final running total is the remainder.",
        mistakeTip: "If the remainder becomes ≥ 9, reduce it: add 1 to the previous quotient digit and subtract 9 from the remainder.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Let us do 2134 ÷ 9. Step 1: bring 2 → q₁=2. Step 2: 2+1=3 → q₂=3. Step 3: 3+3=6 → q₃=6. Step 4: 6+4=10 → remainder=10 ≥ 9, so add 1 to q₃: q₃=7, remainder=1. Answer: 237 remainder 1.",
      board: {
        type: "worked_example",
        data: {
          expression: "2134 ÷ 9",
          steps: [
            "Bring 2 down → quotient digit 2",
            "2 + 1 = 3 → quotient digit 3",
            "3 + 3 = 6 → quotient digit 6",
            "6 + 4 = 10 ≥ 9 → adjust: q₃ = 7, remainder = 1",
            "Quotient: 237, Remainder: 1",
          ],
          answer: 237,
          assetPath: "/math-svgs/level_2/VM_L2_4_DIVISION_BY_9/running-total-strip.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The method works because 9 = 10 − 1, so each digit contributes itself plus its carry to the next position.",
        mistakeTip: "Final remainder must be < 9. If it equals 9 or more, carry 1 to last quotient digit.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 231 ÷ 9. Bring down the first digit and start the running sum.",
      board: {
        type: "practice_board",
        data: {
          expression: "231 ÷ 9",
          prompt: "Running digit sums give the quotient. After bringing down 2, what should the next quotient digit be?",
          assetPath: "/math-svgs/level_2/VM_L2_4_DIVISION_BY_9/quotient-row.svg",
        },
      },
      explanation: { title: "Steps", body: "q₁=2, 2+3=5 → q₂=5, 5+1=6 → remainder=6. Quotient: 25 R 6." },
      practice: {
        mode: "mcq",
        prompt: "What is the next quotient digit after 2 in 231 ÷ 9?",
        answer: 5,
        options: ["4", "5", "6", "9"],
        hints: [
          "Bring down 2 → q₁ = 2",
          "2 + 3 = 5 → q₂ = 5",
          "Then 5 + 1 = 6 → remainder = 6, so the quotient digits are 2 and 5",
        ],
        remediation: {
          prompt: "Small step first: what is 2 + 3?",
          answer: 5,
          options: ["3", "4", "5", "6"],
          hints: [
            "The first quotient digit is already 2",
            "Now just add the next dividend digit 3 to that running total",
            "2 + 3 = 5",
          ],
        },
        challenge: {
          prompt: "Transfer check: after getting quotient digits 2 and 5, what remainder is left when you add the last digit 1?",
          answer: 6,
          options: ["4", "5", "6", "7"],
          hints: [
            "Use the running total 5 from the second quotient digit",
            "Add the final dividend digit 1",
            "5 + 1 = 6, so the remainder is 6",
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
      tutorText: "Try 3241 ÷ 9. Watch for an adjustment step.",
      board: {
        type: "practice_board",
        data: {
          expression: "3241 ÷ 9",
          prompt: "Running sums — focus on the adjustment when the last running total reaches 9 or more.",
          assetPath: "/math-svgs/level_2/VM_L2_4_DIVISION_BY_9/final-remainder-highlight.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "After 3, then 5, then 9 in 3241 ÷ 9, what remainder do you keep after adjustment?",
        answer: 1,
        options: ["0", "1", "5", "9"],
        hints: [
          "q₁=3, then 3+2=5, then 5+4=9",
          "A remainder of 9 must be reduced: add 1 to the previous quotient digit and subtract 9",
          "So the adjusted remainder becomes 1 after the final +1 step",
        ],
        remediation: {
          prompt: "Checkpoint: when the running total reaches 9, what should happen first?",
          answer: "Add 1 to the previous quotient digit",
          options: [
            "Ignore it and keep 9",
            "Add 1 to the previous quotient digit",
            "Subtract 1 from the divisor",
            "Start the division again",
          ],
          hints: [
            "The running total must end below 9",
            "So you normalize by carrying left first",
            "That means add 1 to the previous quotient digit",
          ],
        },
        challenge: {
          prompt: "Transfer check: after adjusting, what full result do you get for 3241 ÷ 9?",
          answer: "360 R 1",
          options: ["350 R 1", "360 R 1", "361 R 0", "359 R 2"],
          hints: [
            "The adjusted quotient digits become 3, 6, 0",
            "The final remainder is 1",
            "So the result is 360 R 1",
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
      tutorText: "Division by 9 is now a one-line skill for you. This same running-total idea extends to division by 8, 7, and any near-10 divisor in later levels.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Running digit sum = quotient digits. Final sum = remainder.",
          remember: [
            "Bring down first digit as first quotient digit",
            "Add each subsequent digit to the running total",
            "If any running total ≥ 9, carry 1 left and reduce by 9",
          ],
          example: "2134 ÷ 9 = 237 R 1",
          assetPath: "/math-svgs/level_2/VM_L2_4_DIVISION_BY_9/division-lane-9.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students often write remainders ≥ 9. The final remainder must always be 0–8. Adjust the last quotient digit if needed.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "How fast can you add digits? Divide these numbers by 9 using the one-line shortcut. A clean 30 XP reward if you get them all!",
      board: {
        type: "practice_board",
        data: {
          headline: "Divide by 9 Speed Race",
          prompt: "Quotient = Running sum. Remainder = Last sum.",
          assetPath: "/math-svgs/level_2/VM_L2_4_DIVISION_BY_9/division-by-9-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "132 ÷ 9 (Quotient)", answer: 14, hints: ["1, 1+3=4. R=4+2=6."] },
          { prompt: "213 ÷ 9 (Quotient)", answer: 23, hints: ["2, 2+1=3. R=3+3=6."] },
          { prompt: "412 ÷ 9 (Quotient)", answer: 45, hints: ["4, 4+1=5. R=5+2=7."] },
          { prompt: "301 ÷ 9 (Quotient)", answer: 33, hints: ["3, 3+0=3. R=3+1=4."] },
          { prompt: "1111 ÷ 9 (Quotient)", answer: 123, hints: ["1, 1+1=2, 2+1=3. R=3+1=4."] },
          { prompt: "2222 ÷ 9 (Quotient)", answer: 246, hints: ["2, 4, 6. R=8."] },
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
  nextLessonUrl: "/mindsutra/course/level-2/lesson/VM_L2_5",
};

// ─── VM_L2_5 — Squaring Near 50 — Anchor Base ────────────────────────────────

export const VM_L2_5_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_2", levelId: "L2", levelSlug: "level-2", title: "Vedic Maths Level 2" },
  lesson: {
    id: "VM_L2_5", order: 5, title: "Squaring Near 50 — Anchor Base",
    sutra: "Yavaduna",
    objective: "Square any number close to 50 in two steps using an anchor-base deviation.",
    supportTag: "Core",
    durationMin: 25, difficulty: 2, xpReward: 30,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Numbers near 50 seem hard to square. But 50 = 100 ÷ 2, so we can use 25 as our anchor and a deviation to calculate any square near 50 in two quick steps.",
      board: {
        type: "intro_card",
        data: {
          headline: "Square Any Number Near 50",
          example: "52² = ?",
          goal: "Left part uses 25 ± deviation. Right part is deviation².",
          assetPath: "/math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/anchor-base-squaring-panel.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the formula", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For a number n near 50: deviation d = n − 50. Left part = 25 + d. Right part = d² (always 2 digits). So 52² has d=+2: left=27, right=04. Answer: 2704.",
      board: {
        type: "complement_bar",
        data: {
          base: 50,
          rule: "n² = (25 + d) | d²   where d = n − 50",
          examples: [
            { n: 52, d: 2, left: 27, right: "04", answer: 2704 },
            { n: 47, d: -3, left: 22, right: "09", answer: 2209 },
          ],
          assetPath: "/math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/square-anchor-base-line-50.svg",
        },
      },
      explanation: {
        title: "Why 25?",
        body: "50² = 2500. Left part is 25 (hundreds digit). When d is positive, left increases. When d is negative, left decreases.",
        mistakeTip: "Right part is always d² as 2 digits — pad with zero if d² < 10.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Let us square 48. d = 48 − 50 = −2. Left = 25 + (−2) = 23. Right = (−2)² = 04. Answer: 2304.",
      board: {
        type: "worked_example",
        data: {
          expression: "48²",
          steps: [
            "d = 48 − 50 = −2",
            "Left = 25 + (−2) = 23",
            "Right = (−2)² = 4 → pad to 04",
            "Answer: 2304",
          ],
          answer: 2304,
          assetPath: "/math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/near-50-deficit-tag.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The left part handles the hundreds, the right part handles units. Together they give the exact square.",
        mistakeTip: "d² is always positive even when d is negative. (−2)² = 4, not −4.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 54². What is the deviation from 50?",
      board: {
        type: "practice_board",
        data: {
          expression: "54²",
          prompt: "d = 54 − 50 = 4. First lock the left part.",
          assetPath: "/math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/near-50-surplus-tag.svg",
        },
      },
      explanation: { title: "Steps", body: "Left: 25+4=29. Right: 4²=16. Answer: 2916." },
      practice: {
        mode: "mcq",
        prompt: "What is the left part of 54² using the near-50 method?",
        answer: 29,
        options: ["25", "27", "29", "31"],
        hints: [
          "d = 54 − 50 = +4",
          "Left = 25 + 4 = 29",
          "Then the right part 16 gives the full answer 2916",
        ],
        remediation: {
          prompt: "Checkpoint: what is the deviation of 54 from 50?",
          answer: 4,
          options: ["2", "4", "5", "9"],
          hints: [
            "54 is above 50",
            "54 − 50 = 4",
            "So the deviation is +4",
          ],
        },
        challenge: {
          prompt: "Transfer check: after left part 29, what full square do you get for 54²?",
          answer: 2916,
          options: ["2816", "2914", "2916", "3016"],
          hints: [
            "The right part is 4²",
            "4² = 16",
            "Join left 29 and right 16 to get 2916",
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
      tutorText: "Now try 46². Negative deviation — be careful with the left part.",
      board: {
        type: "practice_board",
        data: {
          expression: "46²",
          prompt: "d = −4. The key step is the smaller left part.",
          assetPath: "/math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/left-right-square-split.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What is the left part of 46² using the near-50 method?",
        answer: 21,
        options: ["19", "21", "23", "25"],
        hints: [
          "d = 46 − 50 = −4",
          "Left = 25 − 4 = 21",
          "Then the right part 16 gives the full answer 2116",
        ],
        remediation: {
          prompt: "Checkpoint: what is the deviation of 46 from 50?",
          answer: -4,
          options: ["-4", "-2", "+2", "+4"],
          hints: [
            "46 is below 50, so the deviation is negative",
            "50 − 46 = 4",
            "So the deviation is −4",
          ],
        },
        challenge: {
          prompt: "Transfer check: after left part 21, what full square do you get for 46²?",
          answer: 2116,
          options: ["2016", "2114", "2116", "2216"],
          hints: [
            "The right part is (−4)²",
            "(−4)² = 16",
            "Join left 21 and right 16 to get 2116",
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
      tutorText: "You can now square any number in the 40s and 50s instantly. This same anchor-base idea scales to squaring near 100 in Level 4.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "n² = (25 + d) | d²  where d = n − 50.",
          remember: [
            "Find deviation d = n − 50",
            "Left = 25 + d (can be negative — means smaller left)",
            "Right = d² as 2 digits (pad if needed)",
          ],
          example: "48² = 23|04 = 2304",
          assetPath: "/math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/difference-from-50-chip.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "d² is always positive. When d is negative, only the left part decreases. The right part d² is always a positive value.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Ready to square in mid-air? Square these numbers near 50 using the '25 plus deviation' anchor rule. 30 XP for a perfect run!",
      board: {
        type: "practice_board",
        data: {
          headline: "Anchor Base Speed Challenge",
          prompt: "Left = 25+d | Right = d².",
          assetPath: "/math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/anchor-base-squaring-panel.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "52²", answer: 2704, hints: ["25+2=27, 2²=04"] },
          { prompt: "48²", answer: 2304, hints: ["25-2=23, 2²=04"] },
          { prompt: "53²", answer: 2809, hints: ["25+3=28, 3²=09"] },
          { prompt: "47²", answer: 2209, hints: ["25-3=22, 3²=09"] },
          { prompt: "56²", answer: 3136, hints: ["25+6=31, 6²=36"] },
          { prompt: "44²", answer: 1936, hints: ["25-6=19, 6²=36"] },
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
  nextLessonUrl: "/mindsutra/course/level-2/lesson/VM_L2_6",
};

// ─── VM_L2_6 — Fast Fraction Simplification ──────────────────────────────────

export const VM_L2_6_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_2", levelId: "L2", levelSlug: "level-2", title: "Vedic Maths Level 2" },
  lesson: {
    id: "VM_L2_6", order: 6, title: "Fast Fraction Simplification",
    sutra: "HCF inspection",
    objective: "Reduce fractions to lowest terms by spotting the HCF through digit inspection.",
    supportTag: "Practice-heavy",
    durationMin: 20, difficulty: 2, xpReward: 25,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Fractions slow students down in exams because they do long division to find HCF. Vedic inspection lets you see the common factor instantly — no long division needed.",
      board: {
        type: "intro_card",
        data: {
          headline: "Simplify Fractions by Inspection",
          example: "36 / 48",
          goal: "Spot the HCF visually — cancel in one step.",
          assetPath: "/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/fraction-card.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "To find HCF by inspection: look at the digit sum pattern. Both 36 and 48 are divisible by 4 and by 3. The HCF is 12. Divide both by 12: 36÷12=3, 48÷12=4. Simplified: 3/4.",
      board: {
        type: "place_value_split",
        data: {
          numerator: 36,
          denominator: 48,
          checks: [
            "Both even? Yes → divide by 2: 18/24",
            "Both even again? Yes → divide by 2: 9/12",
            "Both divisible by 3? 9=3×3, 12=3×4 → divide by 3: 3/4",
          ],
          result: "3/4",
          assetPath: "/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/common-factor-tiles.svg",
        },
      },
      explanation: {
        title: "Staircase of factors",
        body: "Keep dividing by small primes (2, 3, 5, 7…) until no common factor remains. Each step is a mental check, not a calculation.",
        mistakeTip: "Check divisibility by 2 first (both even?), then by 3 (digit sum divisible by 3?), then by 5.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Simplify 84/126. Both are even: 42/63. Both divisible by 3 (4+2=6, 6+3=9): 14/21. Both divisible by 7: 2/3. Final: 2/3.",
      board: {
        type: "worked_example",
        data: {
          expression: "84 / 126",
          steps: [
            "Both even → 84÷2=42, 126÷2=63 → 42/63",
            "Digit sums: 4+2=6 (÷3), 6+3=9 (÷3) → 42÷3=14, 63÷3=21 → 14/21",
            "Both divisible by 7: 14÷7=2, 21÷7=3 → 2/3",
          ],
          answer: "2/3",
          assetPath: "/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/fraction-simplify-ladder.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Digit-sum rule: a number is divisible by 3 if its digit sum is divisible by 3. Apply this check before trying to divide.",
        mistakeTip: "Do not skip steps — even if you think you see the HCF, reduce incrementally to avoid errors.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Simplify 60/90. Start: are both divisible by 10?",
      board: {
        type: "practice_board",
        data: {
          expression: "60 / 90",
          prompt: "Spot the HCF by inspection — try 10 first.",
          assetPath: "/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/cancel-slash-marker.svg",
        },
      },
      explanation: { title: "Steps", body: "Both divisible by 10: 6/9. Both divisible by 3: 2/3." },
      practice: {
        mode: "numeric",
        prompt: "What is the numerator of 60/90 in simplest form?",
        answer: 2,
        hints: [
          "60 ÷ 10 = 6, 90 ÷ 10 = 9 → 6/9",
          "6 ÷ 3 = 2, 9 ÷ 3 = 3 → 2/3",
          "Numerator = 2",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Simplify 144/180. Multiple reduction steps needed.",
      board: {
        type: "practice_board",
        data: {
          expression: "144 / 180",
          prompt: "Apply HCF inspection step by step.",
          assetPath: "/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/reduce-fraction-flow.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What is the numerator of 144/180 in simplest form?",
        answer: 4,
        hints: [
          "Both ÷ 4: 36/45",
          "Both ÷ 9: 4/5",
          "Numerator = 4",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Fast fraction simplification is a core exam skill. With inspection you can reduce most fractions in 2–3 mental steps rather than calculating HCF by long method.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Check 2 → 3 → 5 → 7 in sequence until no common factor remains.",
          remember: [
            "Both even? Divide by 2",
            "Digit sums divisible by 3? Divide by 3",
            "Both end in 0 or 5? Divide by 5",
          ],
          example: "84/126 → 42/63 → 14/21 → 2/3",
          assetPath: "/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/fraction-bar-adjustable.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students stop too early — e.g., they stop at 6/9 without reducing to 2/3. Always check: can I still divide both by something?",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Inspection time! Simplify these 6 fractions to their lowest terms. Remember to check 2, 3, 5, and 7. 25 XP reward!",
      board: {
        type: "practice_board",
        data: {
          headline: "HCF Inspection Sprint",
          prompt: "Reduce as far as possible in the numerator.",
          assetPath: "/math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/fraction-card.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "Numerator of 12/18", answer: 2, hints: ["12/18 = 6/9 = 2/3"] },
          { prompt: "Numerator of 24/36", answer: 2, hints: ["24/36 = 12/18 = 2/3"] },
          { prompt: "Numerator of 15/20", answer: 3, hints: ["15/20 = 3/4"] },
          { prompt: "Numerator of 18/24", answer: 3, hints: ["18/24 = 9/12 = 3/4"] },
          { prompt: "Numerator of 30/45", answer: 2, hints: ["30/45 = 10/15 = 2/3"] },
          { prompt: "Numerator of 42/56", answer: 3, hints: ["42/56 = 21/28 = 3/4. Wait, 7x6/7x8=6/8=3/4."] },
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
  nextLessonUrl: "/mindsutra/course/level-2/lesson/VM_L2_7",
};

// ─── VM_L2_7 — Decimal Speed Arithmetic ──────────────────────────────────────

export const VM_L2_7_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_2", levelId: "L2", levelSlug: "level-2", title: "Vedic Maths Level 2" },
  lesson: {
    id: "VM_L2_7", order: 7, title: "Decimal Speed Arithmetic",
    sutra: "Anurupyena — place value shift",
    objective: "Multiply and divide decimals instantly by shifting place value rather than computing with decimals.",
    supportTag: "Practice-heavy",
    durationMin: 20, difficulty: 2, xpReward: 25,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Decimals trip students up because they try to compute directly. The Anurupyena place-value shift says: remove the decimals, compute with integers, then restore the decimal point in the right place.",
      board: {
        type: "intro_card",
        data: {
          headline: "Decimal Multiplication & Division — Place Value Shift",
          example: "3.6 × 0.25",
          goal: "Convert to integers, compute, then restore decimal places.",
          assetPath: "/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-shift-arrows-left-right.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the shift method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Count total decimal places in both numbers. Multiply as whole numbers. Then place the decimal point so the result has exactly that many decimal places total.",
      board: {
        type: "place_value_split",
        data: {
          rule: "Count decimal places → multiply integers → restore decimal point",
          example: "3.6 × 0.25: total decimal places = 1 + 2 = 3",
          integers: "36 × 25 = 900",
          restore: "900 with 3 decimal places = 0.900 = 0.9",
          assetPath: "/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-place-slider.svg",
        },
      },
      explanation: {
        title: "Place value rule",
        body: "Total decimal places in the answer = sum of decimal places in both factors. Count them, multiply the integer versions, then shift the decimal point left by that count.",
        mistakeTip: "Count from the right end of each number, including trailing zeros if present.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Solve 2.4 × 1.5. Decimal places: 1 + 1 = 2. Integers: 24 × 15 = 360. Shift 2 places left: 3.60 = 3.6.",
      board: {
        type: "worked_example",
        data: {
          expression: "2.4 × 1.5",
          steps: [
            "Count decimal places: 1 + 1 = 2 total",
            "Multiply integers: 24 × 15 = 360",
            "Restore 2 decimal places: 3.60 = 3.6",
          ],
          answer: 3.6,
          assetPath: "/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-alignment-grid.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The integer multiplication is the hard part. You already know how to do that. The decimal point is just a position marker.",
        mistakeTip: "Count places from the right, not from the decimal point. 0.025 has 3 decimal places.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 0.6 × 0.7. How many total decimal places?",
      board: {
        type: "practice_board",
        data: {
          expression: "0.6 × 0.7",
          prompt: "Total decimal places = 1+1=2. Compute 6×7 then restore.",
          assetPath: "/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-point-token.svg",
        },
      },
      explanation: { title: "Steps", body: "6 × 7 = 42. Restore 2 places: 0.42." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 0.6 × 0.7 (enter as integer, e.g. 42 for 0.42)",
        answer: 42,
        hints: [
          "6 × 7 = 42",
          "2 decimal places total: 0.42",
          "Enter 42 (representing 0.42)",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Try 1.25 × 0.4. Count the decimal places carefully.",
      board: {
        type: "practice_board",
        data: {
          expression: "1.25 × 0.4",
          prompt: "Total decimal places = 2+1=3. Compute 125×4.",
          assetPath: "/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/place-value-ladder.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What integer result do you get before restoring the decimal? (125×4)",
        answer: 500,
        hints: [
          "125 × 4 = 500",
          "3 decimal places: 0.500 = 0.5",
          "Integer part before decimal shift: 500",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Decimal arithmetic is now just integer arithmetic with a bookkeeping step. This technique will serve you in every quantitative section of any exam.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Total decimal places in = total decimal places out.",
          remember: [
            "Count total decimal places in both factors",
            "Multiply as whole numbers",
            "Shift decimal point left by that total count",
          ],
          example: "2.4 × 1.5 = 24×15 ÷ 100 = 360 ÷ 100 = 3.6",
          assetPath: "/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-alignment-grid.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students put the decimal point in the wrong position. Always count total decimal places first, then shift.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Ignore the point, solve the numbers! Calculate these 6 decimal products. Type only the digits (e.g., 20 for 0.20). 25 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Decimal Shift Speed Drill",
          prompt: "Total decimal places in = Shift left out.",
          assetPath: "/math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-shift-arrows-left-right.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "1.2 × 0.3 (digits)", answer: 36, hints: ["12x3=36. 0.36"] },
          { prompt: "0.4 × 0.5 (digits)", answer: 20, hints: ["4x5=20. 0.20"] },
          { prompt: "0.25 × 4 (digits)", answer: 100, hints: ["25x4=100. 1.00"] },
          { prompt: "1.5 × 2 (digits)", answer: 30, hints: ["15x2=30. 3.0"] },
          { prompt: "0.8 × 0.9 (digits)", answer: 72, hints: ["8x9=72. 0.72"] },
          { prompt: "2.5 × 0.4 (digits)", answer: 100, hints: ["25x4=100. 1.00"] },
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
  nextLessonUrl: "/mindsutra/course/level-2/lesson/VM_L2_8",
};

// ─── VM_L2_8 — Flag Division — One-Line Division ─────────────────────────────

export const VM_L2_8_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_2", levelId: "L2", levelSlug: "level-2", title: "Vedic Maths Level 2" },
  lesson: {
    id: "VM_L2_8", order: 8, title: "Flag Division — One-Line Division",
    sutra: "Dhvajankasutra",
    objective: "Divide any number by any single-digit divisor in one written line using the Flag method.",
    supportTag: "Stretch",
    durationMin: 30, difficulty: 3, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Flag Division — Dhvajankasutra — gives you a one-line division algorithm that is faster than the standard method. The 'flag' is the divisor hoisted above the dividend.",
      board: {
        type: "intro_card",
        data: {
          headline: "Flag Division — One Line, Any Divisor",
          example: "483 ÷ 3",
          goal: "Produce each quotient digit directly without long division.",
          assetPath: "/math-svgs/level_2/VM_L2_8_DIVISION_FLAG/flag-division-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the flag method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Write the divisor as a flag above the first digit. For each dividend digit: find the largest multiple of the divisor that fits, write that as the quotient digit, note the remainder. Carry the remainder to the next digit before dividing again.",
      board: {
        type: "place_value_split",
        data: {
          divisor: 3,
          dividend: "483",
          steps: [
            "4 ÷ 3 = 1 remainder 1 → q₁=1, carry 1",
            "18 ÷ 3 = 6 remainder 0 → q₂=6, carry 0",
            "03 ÷ 3 = 1 remainder 0 → q₃=1",
          ],
          quotient: "161",
          assetPath: "/math-svgs/level_2/VM_L2_8_DIVISION_FLAG/flag-division-flag-icon.svg",
        },
      },
      explanation: {
        title: "The carry-prefix trick",
        body: "The remainder from each step is placed as a prefix digit in front of the next dividend digit. 1 carried to 8 makes 18.",
        mistakeTip: "Write the remainder as a small superscript before the next digit — do not add it to the digit.",
      },
      actions: [{ id: "next", label: "Walk me through 756 ÷ 4", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "756 ÷ 4. 7÷4=1 R3. 35÷4=8 R3. 36÷4=9 R0. Quotient: 189 R 0.",
      board: {
        type: "worked_example",
        data: {
          expression: "756 ÷ 4",
          steps: [
            "7 ÷ 4 = 1, remainder 3 → q₁=1",
            "Carry 3: prefix to 5 → 35 ÷ 4 = 8, remainder 3 → q₂=8",
            "Carry 3: prefix to 6 → 36 ÷ 4 = 9, remainder 0 → q₃=9",
            "Quotient: 189, Remainder: 0",
          ],
          answer: 189,
          assetPath: "/math-svgs/level_2/VM_L2_8_DIVISION_FLAG/quotient-step-row.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Each step is a one-digit ÷ one-digit division. The carry (remainder) prefixes the next digit to create a 2-digit number for the next step.",
        mistakeTip: "Quotient digits must be the largest whole number that fits. 35 ÷ 4 = 8 (not 7), because 4×8=32 ≤ 35 < 4×9=36.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 639 ÷ 3. First, identify the very first quotient digit before completing the full flow.",
      board: {
        type: "practice_board",
        data: {
          expression: "639 ÷ 3",
          prompt: "Start with the first digit only.",
          assetPath: "/math-svgs/level_2/VM_L2_8_DIVISION_FLAG/digit-drop-zone.svg",
        },
      },
      explanation: { title: "Steps", body: "6÷3=2 R0. 03÷3=1 R0. 09÷3=3 R0. Answer: 213." },
      practice: {
        mode: "mcq",
        prompt: "What is the first quotient digit in 639 ÷ 3?",
        answer: 2,
        options: ["1", "2", "3", "6"],
        hints: [
          "Use only the first dividend digit to begin",
          "6 ÷ 3 = 2, remainder 0",
          "So the first quotient digit is 2",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Now try 952 ÷ 7. Remainders will carry through.",
      board: {
        type: "practice_board",
        data: {
          expression: "952 ÷ 7",
          prompt: "Each carry prefix extends to the next digit.",
          assetPath: "/math-svgs/level_2/VM_L2_8_DIVISION_FLAG/division-step-box.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 952 ÷ 7",
        answer: 136,
        hints: [
          "9 ÷ 7 = 1 R2 → prefix 2 to 5 → 25 ÷ 7 = 3 R4",
          "Prefix 4 to 2 → 42 ÷ 7 = 6 R0",
          "Quotient: 136",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "You have now completed Level 2. Flag Division is the last and most powerful tool in your Speed Builder toolkit. With these 8 methods you can handle almost any numerical calculation in a competitive exam.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Divide digit-by-digit: each remainder prefixes the next digit.",
          remember: [
            "Hoist the divisor as a flag above the dividend",
            "At each step: largest multiple of divisor ≤ current number",
            "Remainder becomes prefix of next digit",
          ],
          example: "756 ÷ 4 = 189",
          assetPath: "/math-svgs/level_2/VM_L2_8_DIVISION_FLAG/flag-division-remainder-box.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students write a quotient digit that is too small. Always check: is there a larger integer multiple of the divisor that still fits the current number?",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "The Level 2 Gran Finale! Divide these numbers in a single line using the Flag method. Complete this to master the Speed Builder set for 35 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Flag Division Final Drill",
          prompt: "Quotient digit, carry prefix, repeat.",
          assetPath: "/math-svgs/level_2/VM_L2_8_DIVISION_FLAG/flag-division-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "486 ÷ 2", answer: 243, hints: ["Simple: 2, 4, 3"] },
          { prompt: "639 ÷ 3", answer: 213, hints: ["Simple: 2, 1, 3"] },
          { prompt: "844 ÷ 4", answer: 211, hints: ["2, 1, 1"] },
          { prompt: "550 ÷ 5", answer: 110, hints: ["1, 1, 0"] },
          { prompt: "126 ÷ 3", answer: 42, hints: ["12/3=4, 6/3=2"] },
          { prompt: "144 ÷ 6", answer: 24, hints: ["14/6=2 R2, 24/6=4"] },
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
  nextLessonUrl: "/mindsutra/course/level-3/lesson/VM_L3_1",
};
