import type { MindSutraLessonPayload } from "./mindsutraLessonTypes";

// ─── VM_L1_2 — Tables 11–19 — Ekadhikena Pattern ────────────────────────────

export const VM_L1_2_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_1", levelId: "L1", levelSlug: "level-1", title: "Vedic Maths Level 1" },
  lesson: {
    id: "VM_L1_2", order: 2, title: "Tables 11–19 — The Ekadhikena Pattern",
    sutra: "Ekadhikena Purvena",
    objective: "Recognise the digit-staircase pattern in tables 11 to 19 and use it to multiply in one mental step.",
    supportTag: "Practice-heavy",
    durationMin: 20, difficulty: 1, xpReward: 25,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Tables from 11 to 19 can look scary at first. But they follow a clean pattern. Once you see that pattern, the multiplication becomes much easier to remember.",
      board: {
        type: "intro_card",
        data: {
          headline: "Tables 11 to 19 — One Shortcut for All",
          example: "13 × 7 = ?",
          goal: "Multiply any table-11-to-19 number in one mental step.",
          assetPath: "/math-svgs/vedic/vm_tables_pattern_generic.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the pattern", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Start with 11 times a digit. You simply repeat the digit: 11×7 = 77. For 12 to 19, keep the same idea, but now the ones part can create a carry.",
      board: {
        type: "number_bond",
        data: {
          pattern: "11 × 7 = 77  |  12 × 7 = 84  |  13 × 7 = 91",
          note: "Each step up in the table adds exactly 7",
          assetPath: "/math-svgs/level_1/VM_L1_2_TABLES_11_TO_19/table-staircase-11-to-19.svg",
        },
      },
      explanation: {
        title: "The staircase rule",
        body: "13 × 7: tens digit = 1×7=7, add ones digit contribution 3×7=21. Write 1 carry 2. Final: 7+2=9 at tens, 1 at ones → 91.",
        mistakeTip: "Do not forget to carry when the ones product exceeds 9.",
        alternateExplanation: "Another way to see it is repeated addition. 13 × 7 means seven 13s. The total grows by 13 each time, so the ones and tens follow a pattern together.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Let us do 14 × 8 step by step. First do the ones part: 4×8=32, so write 2 and carry 3. Then do the front part: 1×8=8, and add the carry to get 11. The answer is 112.",
      board: {
        type: "worked_example",
        data: {
          expression: "14 × 8",
          steps: [
            "Ones column: 4 × 8 = 32 → write 2, carry 3",
            "Tens column: 1 × 8 = 8, add carry 3 = 11 → write 11",
            "Answer: 112",
          ],
          answer: 112,
          assetPath: "/math-svgs/vedic/vm_tables_pattern_generic.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The ones digit of 14 drives the first carry. The tens digit 1 just multiplies the number once.",
        mistakeTip: "Remember: the tens digit of 1x is always 1, so it scales the number directly.",
        alternateExplanation: "Say it aloud as two chunks: ones first, front part second. That rhythm helps many students avoid losing the carry.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Now try 16 × 6 with my guidance. Start with the ones column: what is 6 × 6?",
      board: {
        type: "practice_board",
        data: {
          expression: "16 × 6",
          prompt: "Ones first, then tens, then add the carry.",
          assetPath: "/math-svgs/vedic/vm_tables_pattern_generic.svg",
        },
      },
      explanation: {
        title: "Two-column method",
        body: "Start with the ones part. 6×6=36, so write 6 and carry 3. Then do the front part: 1×6=6, add the carry, and get 9. Answer: 96.",
        alternateExplanation: "If the carry feels confusing, pause after 36 and ask only one question: what number must travel to the front? Here the travelling number is 3.",
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 16 × 6",
        answer: 96,
        skillKeys: ["tables_11_to_19", "carry_from_ones"],
        hints: [
          "Ones: 6 × 6 = 36 → write 6, carry 3",
          "Tens: 1 × 6 = 6 plus carry 3 = 9",
          "Read tens then ones: 96",
        ],
        remediation: {
          prompt: "Checkpoint: what carry comes from 6 × 6 = 36?",
          answer: 3,
          skillKeys: ["carry_from_ones"],
          hints: [
            "Write the ones digit and keep the tens digit as the carry",
            "In 36, the carry is 3",
          ],
        },
        challenge: {
          prompt: "Bonus stretch: solve 18 × 8 with the same pattern.",
          answer: 144,
          skillKeys: ["tables_11_to_19", "carry_from_ones"],
          hints: [
            "Ones: 8 × 8 = 64 → write 4, carry 6",
            "Tens: 1 × 8 = 8, plus carry 6 = 14",
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
      tutorText: "One more — try 19 × 7. No hints this time. Use the same method.",
      board: {
        type: "practice_board",
        data: {
          expression: "19 × 7",
          prompt: "Solve mentally — ones, carry, tens.",
          assetPath: "/math-svgs/vedic/vm_tables_pattern_generic.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 19 × 7",
        answer: 133,
        skillKeys: ["tables_11_to_19", "carry_from_ones"],
        hints: [
          "Ones: 9 × 7 = 63 → write 3, carry 6",
          "Tens: 1 × 7 = 7, add carry 6 = 13",
          "Answer: 133",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Well done. Tables 11 to 19 all follow the same two-column pattern. Practise this daily and you will recall them instantly during exams.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Ones × multiplier → carry. Tens (=1) × multiplier + carry.",
          remember: [
            "Split into ones and tens columns",
            "Start from ones, carry to tens",
            "11 × any digit: just repeat the digit",
          ],
          example: "14 × 8 = 112",
          assetPath: "/math-svgs/vedic/vm_tables_pattern_generic.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students forget to add the carry to the tens product. Always add the carry before writing the tens digit.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Ready for the one-minute table challenge? Solve these 6 problems from tables 11-19 using the Ekadhikena pattern. 25 XP is waiting for you!",
      board: {
        type: "practice_board",
        data: {
          headline: "Tables 11-19 Speed Drill",
          prompt: "Use: (Multiplier × 1) + carry from (Multiplier × ones digit).",
          assetPath: "/math-svgs/vedic/vm_tables_pattern_generic.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "12 × 4", answer: 48, hints: ["1x4=4, 2x4=8"], skillKeys: ["tables_11_to_19", "carry_from_ones"] },
          { prompt: "14 × 6", answer: 84, hints: ["1x6=6, 4x6=24. 6+2=8, 4"], skillKeys: ["tables_11_to_19", "carry_from_ones"] },
          { prompt: "13 × 8", answer: 104, hints: ["1x8=8, 3x8=24. 8+2=10, 4"], skillKeys: ["tables_11_to_19", "carry_from_ones"] },
          { prompt: "17 × 4", answer: 68, hints: ["1x4=4, 7x4=28. 4+2=6, 8"], skillKeys: ["tables_11_to_19", "carry_from_ones"] },
          { prompt: "15 × 7", answer: 105, hints: ["1x7=7, 5x7=35. 7+3=10, 5"], skillKeys: ["tables_11_to_19", "carry_from_ones"] },
          { prompt: "18 × 3", answer: 54, hints: ["1x3=3, 8x3=24. 3+2=5, 4"], skillKeys: ["tables_11_to_19", "carry_from_ones"] },
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
  nextLessonUrl: "/mindsutra/course/level-1/lesson/VM_L1_3",
};

// ─── VM_L1_3 — Doubling & Halving — Speed Multiplication ────────────────────

export const VM_L1_3_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_1", levelId: "L1", levelSlug: "level-1", title: "Vedic Maths Level 1" },
  lesson: {
    id: "VM_L1_3", order: 3, title: "Doubling & Halving — Speed Multiplication",
    sutra: "Anurupyena",
    objective: "Double one factor and halve the other to transform any hard multiplication into a simple one.",
    supportTag: "Core",
    durationMin: 20, difficulty: 1, xpReward: 25,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "When one of the numbers is awkward, you can trade its difficulty to the other number by doubling and halving. The product never changes — only the shape of the problem does.",
      board: {
        type: "intro_card",
        data: {
          headline: "Doubling & Halving — Same Product, Easier Numbers",
          example: "16 × 25",
          goal: "Transform difficult multiplications into friendly ones.",
          assetPath: "/math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/factor-balance-beam.svg",
        },
      },
      actions: [{ id: "next", label: "Show me how", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "If you halve one number and double the other, the product stays the same. 16 × 25 → 8 × 50 → 4 × 100 = 400. We kept halving 16 and doubling 25 until we reached a round number.",
      board: {
        type: "place_value_split",
        data: {
          steps: ["16 × 25", "→ 8 × 50", "→ 4 × 100", "= 400"],
          note: "Product stays 400 at every step",
          assetPath: "/math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/doubling-chain.svg",
        },
      },
      explanation: {
        title: "Why this works",
        body: "Multiplying one number by 2 and dividing the other by 2 cancels out. The product is unchanged by the Anurupyena (proportionality) principle.",
        mistakeTip: "Start by halving an even number. If you do not have an easy even number to halve, this shortcut may not be the best first choice.",
        alternateExplanation: "You can imagine a balance. One side becomes half as big, while the other becomes twice as big, so the total product stays balanced.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Let us solve 32 × 125. Halve 32, double 125 three times: 32×125 → 16×250 → 8×500 → 4×1000 = 4000.",
      board: {
        type: "worked_example",
        data: {
          expression: "32 × 125",
          steps: [
            "32 × 125",
            "→ 16 × 250",
            "→ 8 × 500",
            "→ 4 × 1000 = 4000",
          ],
          answer: 4000,
          assetPath: "/math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/double-half-ladder.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Keep halving the even factor until one of the numbers becomes a round power of 10. Multiply then is trivial.",
        mistakeTip: "Count how many times you halved/doubled — do the same number of operations to both factors.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Now you try: 24 × 25. Think — can you halve 24 twice and double 25 twice to reach 100?",
      board: {
        type: "practice_board",
        data: {
          expression: "24 × 25",
          prompt: "Halve 24, double 25, keep going until one side is 100.",
          assetPath: "/math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/equivalent-product-strip.svg",
        },
      },
      explanation: { title: "Two doublings", body: "24→12→6, 25→50→100. So 6×100=600." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 24 × 25",
        answer: 600,
        skillKeys: ["doubling_and_halving", "factor_transformation"],
        hints: [
          "Halve 24 → 12, double 25 → 50",
          "Halve 12 → 6, double 50 → 100",
          "6 × 100 = 600",
        ],
        remediation: {
          prompt: "Checkpoint: after one doubling, what does 25 become in 24 × 25?",
          answer: 50,
          skillKeys: ["doubling_and_halving", "factor_transformation"],
          hints: [
            "Double 25 to 50",
            "At the same time, 24 halves to 12",
          ],
        },
        challenge: {
          prompt: "Bonus stretch: solve 36 × 125 by doubling and halving.",
          answer: 4500,
          skillKeys: ["doubling_and_halving", "factor_transformation"],
          hints: [
            "36 × 125 → 18 × 250 → 9 × 500",
            "9 × 500 = 4500",
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
      tutorText: "Try 48 × 125. Spot how many halvings get you to a power of ten.",
      board: {
        type: "practice_board",
        data: {
          expression: "48 × 125",
          prompt: "Keep halving 48 and doubling 125.",
          assetPath: "/math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/challenge-48-times-125.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 48 × 125",
        answer: 6000,
        skillKeys: ["doubling_and_halving", "factor_transformation"],
        hints: [
          "48→24→12→6, 125→250→500→1000",
          "6 × 1000 = 6000",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Excellent. Doubling and halving is one of the most practical Vedic shortcuts for mental multiplication. Any time you see 25, 125, or 5 in a problem, think of this method first.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Double one, halve the other — product unchanged.",
          remember: [
            "Halve the even number",
            "Double the other number by the same count",
            "Stop when one number is a round power of 10",
          ],
          example: "16 × 25 = 4 × 100 = 400",
          assetPath: "/math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/paired-factor-cards.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students sometimes halve the wrong number (an odd one). Always start by halving the even factor.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Can you transform these problems in your head? Solve these 6 multiplications using doubling and halving. 25 XP reward for a perfect score!",
      board: {
        type: "practice_board",
        data: {
          headline: "Double & Halve Speed Test",
          prompt: "Double one factor, halve the other to find a round number.",
          assetPath: "/math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/factor-balance-beam.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "14 × 50", answer: 700, hints: ["7 x 100"], skillKeys: ["doubling_and_halving", "factor_transformation"] },
          { prompt: "24 × 25", answer: 600, hints: ["12 x 50 = 6 x 100"], skillKeys: ["doubling_and_halving", "factor_transformation"] },
          { prompt: "48 × 5", answer: 240, hints: ["24 x 10"], skillKeys: ["doubling_and_halving", "factor_transformation"] },
          { prompt: "12 × 125", answer: 1500, hints: ["6 x 250 = 3 x 500"], skillKeys: ["doubling_and_halving", "factor_transformation"] },
          { prompt: "64 × 15", answer: 960, hints: ["32 x 30 = 960"], skillKeys: ["doubling_and_halving", "factor_transformation"] },
          { prompt: "32 × 25", answer: 800, hints: ["16 x 50 = 8 x 100"], skillKeys: ["doubling_and_halving", "factor_transformation"] },
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
  nextLessonUrl: "/mindsutra/course/level-1/lesson/VM_L1_4",
};

// ─── VM_L1_4 — Multiply by 11 — Middle-Sum Trick ────────────────────────────

export const VM_L1_4_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_1", levelId: "L1", levelSlug: "level-1", title: "Vedic Maths Level 1" },
  lesson: {
    id: "VM_L1_4", order: 4, title: "Multiply by 11 — Middle-Sum Trick",
    sutra: "Ekadhikena Purvena",
    objective: "Multiply any 2-digit number by 11 in a single mental step using the outer-middle-outer layout.",
    supportTag: "Core",
    durationMin: 20, difficulty: 1, xpReward: 25,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Multiplying any 2-digit number by 11 can be done instantly in your head. The answer has three slots: the first digit, the sum of the two digits in the middle, and the last digit.",
      board: {
        type: "intro_card",
        data: {
          headline: "Multiply Any 2-Digit Number by 11",
          example: "54 × 11",
          goal: "Answer in one step: outer | sum | outer.",
          assetPath: "/math-svgs/vedic/vm_multiply_by_eleven_generic.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the rule", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For any 2-digit number AB, multiply by 11 like this: write A, then A+B in the middle, then B. So 54×11: write 5, then 5+4=9, then 4 → 594.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "Outer | Middle-Sum | Outer",
          rule: "AB × 11 = A | (A+B) | B",
          example: "54 × 11 → 5 | 9 | 4 = 594",
          assetPath: "/math-svgs/level_1/VM_L1_4_MULT_BY_11/outer-middle-outer-flow.svg",
        },
      },
      explanation: {
        title: "Carry rule",
        body: "If A+B ≥ 10, write the ones digit of the sum in the middle and carry 1 to A.",
        mistakeTip: "When A+B = 10 or more, the first digit becomes A+1, not A.",
        alternateExplanation: "Think of three boxes. The left box keeps the first digit, the middle box keeps the sum, and the right box keeps the last digit. If the middle box is too full, one part moves left.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Now 76 × 11 — here 7+6=13 which is more than 9. Middle = 3, carry 1 to the first digit: 7+1=8. Answer: 836.",
      board: {
        type: "worked_example",
        data: {
          expression: "76 × 11",
          steps: [
            "First digit: 7",
            "Middle: 7 + 6 = 13 → write 3, carry 1",
            "First digit becomes 7 + 1 = 8",
            "Last digit: 6",
            "Answer: 836",
          ],
          answer: 836,
          assetPath: "/math-svgs/level_1/VM_L1_4_MULT_BY_11/carry-from-middle-bubble.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The carry only ever goes forward to the first slot. The last digit never changes.",
        mistakeTip: "Do not write 13 in the middle. Split it: 3 in middle, 1 added to first digit.",
        alternateExplanation: "Say it as a pattern: outer, middle, outer. Then for a carry case, say: outer plus one, middle digit, outer.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 43 × 11. What are the outer digits and what is the middle sum?",
      board: {
        type: "practice_board",
        data: {
          expression: "43 × 11",
          prompt: "Write outer | middle sum | outer.",
          assetPath: "/math-svgs/level_1/VM_L1_4_MULT_BY_11/middle-sum-bubble.svg",
        },
      },
      explanation: {
        title: "No carry needed",
        body: "4+3=7, so the middle is simply 7. Answer: 473.",
        alternateExplanation: "This is the easy version of the trick. Nothing moves left because the middle sum stays below 10.",
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 43 × 11",
        answer: 473,
        skillKeys: ["multiply_by_11"],
        hints: [
          "First digit: 4",
          "Middle: 4 + 3 = 7",
          "Last digit: 3 → Answer: 473",
        ],
        remediation: {
          prompt: "Checkpoint: what is the middle sum in 43 × 11?",
          answer: 7,
          skillKeys: ["multiply_by_11"],
          hints: [
            "Add the two digits of 43",
            "4 + 3 = 7",
          ],
        },
        challenge: {
          prompt: "Bonus stretch: solve 67 × 11.",
          answer: 737,
          skillKeys: ["multiply_by_11", "carry_from_ones"],
          hints: [
            "Middle sum: 6 + 7 = 13",
            "Write 3 and carry 1 to the front",
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
      tutorText: "Now try 85 × 11. Watch out for the carry.",
      board: {
        type: "practice_board",
        data: {
          expression: "85 × 11",
          prompt: "Carry needed — 8+5 = ?",
          assetPath: "/math-svgs/vedic/vm_multiply_by_eleven_generic.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 85 × 11",
        answer: 935,
        skillKeys: ["multiply_by_11", "carry_from_ones"],
        hints: [
          "Middle: 8 + 5 = 13 → write 3, carry 1",
          "First digit: 8 + 1 = 9",
          "Answer: 935",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Perfect. This trick works for every 2-digit number. With practice you will see the answer before you even write it down.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "AB × 11 = (A+carry) | (A+B mod 10) | B",
          remember: [
            "Write first digit on left",
            "Sum the two digits for the middle",
            "If sum ≥ 10, carry 1 to left digit",
          ],
          example: "76 × 11 = 836",
          assetPath: "/math-svgs/vedic/vm_multiply_by_eleven_generic.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students write the full double-digit sum in the middle. Split it: ones digit in middle, carry to left.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Last test for the Middle-Sum trick! Solve these 6 multiplications by 11. Remember the carry rule for 25 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Multiply by 11 Challenge",
          prompt: "Write: Outer | Sum | Outer.",
          assetPath: "/math-svgs/vedic/vm_multiply_by_eleven_generic.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "26 × 11", answer: 286, hints: ["2, (2+6)=8, 6"], skillKeys: ["multiply_by_11"] },
          { prompt: "48 × 11", answer: 528, hints: ["4, (4+8)=12, 8. 4+1=5, 2, 8"], skillKeys: ["multiply_by_11", "carry_from_ones"] },
          { prompt: "73 × 11", answer: 803, hints: ["7, (7+3)=10, 3. 7+1=8, 0, 3"], skillKeys: ["multiply_by_11", "carry_from_ones"] },
          { prompt: "59 × 11", answer: 649, hints: ["5, (5+9)=14, 9. 5+1=6, 4, 9"], skillKeys: ["multiply_by_11", "carry_from_ones"] },
          { prompt: "82 × 11", answer: 902, hints: ["8, (8+2)=10, 2. 8+1=9, 0, 2"], skillKeys: ["multiply_by_11", "carry_from_ones"] },
          { prompt: "95 × 11", answer: 1045, hints: ["9, (9+5)=14, 5. 9+1=10, 4, 5"], skillKeys: ["multiply_by_11", "carry_from_ones"] },
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
  nextLessonUrl: "/mindsutra/course/level-1/lesson/VM_L1_5",
};

// ─── VM_L1_5 — Borrow-Free Subtraction ──────────────────────────────────────

export const VM_L1_5_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_1", levelId: "L1", levelSlug: "level-1", title: "Vedic Maths Level 1" },
  lesson: {
    id: "VM_L1_5", order: 5, title: "Borrow-Free Subtraction",
    sutra: "Nikhilam Navatashcaramam Dashatah",
    objective: "Subtract any number without borrowing by using the complement to the next whole base.",
    supportTag: "Practice-heavy",
    durationMin: 25, difficulty: 2, xpReward: 30,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Borrowing in subtraction confuses many students. We will make it easier by finding the gap to the base first. Then we will connect that idea to the Nikhilam rule.",
      board: {
        type: "intro_card",
        data: {
          headline: "Subtract Without Borrowing",
          example: "1000 − 637",
          goal: "Use the Nikhilam rule to find the gap instantly without borrowing.",
          assetPath: "/math-svgs/vedic/l1_borrow_free_rule_board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the idea", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Instead of subtracting 1000 minus 247 with borrowing, ask one easier question: what do I add to 247 to reach 1000? First jump to 250. Then jump to 1000. The total jump is the answer.",
      board: {
        type: "complement_bar",
        data: {
          base: 1000,
          number: 247,
          complement: 753,
          caption: "247 + 753 = 1000",
          note: "Bridge: +3, +250, +500 = 753",
          assetPath: "/math-svgs/level_1/VM_L1_5_SUBT_BORROW_FREE/borrow-free-bridge.svg",
        },
      },
      explanation: {
        title: "The count-up bridge",
        body: "You can find the complement by counting up from the number to landmarks (like 250, 500) until you reach the base.",
        mistakeTip: "Don't forget to add up all the smaller jumps (+3, +250, +500) to get the final answer.",
        alternateExplanation: "The faster rule says: all from 9, last from 10. The bridge model and the rule give the same answer, but the bridge is easier to picture first.",
      },
      actions: [{ id: "next", label: "Walk me through an example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Let us solve 1000 − 247 using a more direct jump. Add 3 to reach 250. Then jump directly from 250 to 1000 by adding 750. Total gap = 3 + 750 = 753.",
      board: {
        type: "worked_example",
        data: {
          expression: "1000 − 247",
          steps: [
            "Start at 247.",
            "Jump to friendly number 250: +3",
            "Jump from 250 to 1000: +750",
            "Total jump: 3 + 750 = 753"
          ],
          answer: 753,
          assetPath: "/math-svgs/level_1/VM_L1_5_SUBT_BORROW_FREE/count-up-to-next-base.svg",
        },
      },
      explanation: {
        title: "Fewer Jumps",
        body: "Instead of going through 500, jumping directly from 250 to 1000 is faster.",
        mistakeTip: "You can also use the Nikhilam rule: 9 - 2 = 7, 9 - 4 = 5, 10 - 7 = 3. Answer: 753.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 100 − 54. Find the complement of 54 from 100 using the Nikhilam rule.",
      board: {
        type: "practice_board",
        data: {
          expression: "100 − 54",
          prompt: "What is the gap from 54 to 100?",
          assetPath: "/math-svgs/level_1/VM_L1_5_SUBT_BORROW_FREE/difference-gap-bar.svg",
        },
      },
      explanation: {
        title: "Step by step",
        body: "Use one rule at a time. Tens digit: 9 - 5 = 4. Units digit: 10 - 4 = 6. Answer: 46.",
        alternateExplanation: "You can also count up: 54 needs 46 to reach 100. Both methods land on the same answer.",
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 100 − 54",
        answer: 46,
        skillKeys: ["borrow_free_subtraction", "subtraction_complements"],
        hints: [
          "Apply Nikhilam rule: all from 9, last from 10",
          "First digit: 9 - 5 = 4",
          "Last digit: 10 - 4 = 6",
        ],
        remediation: {
          prompt: "Checkpoint: what is the last digit in 100 − 54 using 'last from 10'?",
          answer: 6,
          skillKeys: ["subtraction_complements"],
          hints: [
            "Look only at the last digit 4",
            "10 - 4 = 6",
          ],
        },
        challenge: {
          prompt: "Bonus stretch: solve 1000 − 458.",
          answer: 542,
          skillKeys: ["borrow_free_subtraction", "subtraction_complements"],
          hints: [
            "Hundreds: 9 - 4 = 5",
            "Tens: 9 - 5 = 4, ones: 10 - 8 = 2",
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
      tutorText: "Now 1000 − 637. Solve without hints using the direct Nikhilam rule.",
      board: {
        type: "practice_board",
        data: {
          expression: "1000 − 637",
          prompt: "Apply the Nikhilam rule directly.",
          assetPath: "/math-svgs/level_1/VM_L1_5_SUBT_BORROW_FREE/minus-gap-model.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 1000 − 637",
        answer: 363,
        skillKeys: ["borrow_free_subtraction", "subtraction_complements"],
        hints: [
          "Hundreds digit: 9 - 6 = 3",
          "Tens digit: 9 - 3 = 6",
          "Units digit: 10 - 7 = 3 (Last from 10!)",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Great work. You can now effortlessly subtract any number from 100, 1000, or 10000 without a single borrow by using the Nikhilam rule.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Subtracting from powers of 10 is just finding the complement.",
          remember: [
            "Rule: All from 9, last from 10",
            "Leading zeros: ignore them or treat as 9 - 0 = 9",
            "No borrowing ever needed!",
          ],
          example: "1000 − 637 = 363",
          assetPath: "/math-svgs/level_1/VM_L1_5_SUBT_BORROW_FREE/subtraction-complement-strip.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Remember to subtract the LAST digit from 10, not 9. Only the other digits are subtracted from 9.",
        alternateExplanation: "If the rule feels too fast, return to the gap idea: ask how far the number is from the base, then write that distance.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Let us test your skills! Solve these 6 quick subtractions using the Nikhilam rule. I will award you 30 XP if you complete them all.",
      board: {
        type: "practice_board",
        data: {
          headline: "Final Subtraction Challenge",
          prompt: "Apply 'All from 9, last from 10' for each problem.",
          assetPath: "/math-svgs/level_1/VM_L1_5_SUBT_BORROW_FREE/complement-subtraction-panel.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "Solve: 100 − 37", answer: 63, hints: ["9-3=6, 10-7=3"], skillKeys: ["borrow_free_subtraction", "subtraction_complements"] },
          { prompt: "Solve: 100 − 68", answer: 32, hints: ["9-6=3, 10-8=2"], skillKeys: ["borrow_free_subtraction", "subtraction_complements"] },
          { prompt: "Solve: 1000 − 445", answer: 555, hints: ["9-4=5, 9-4=5, 10-5=5"], skillKeys: ["borrow_free_subtraction", "subtraction_complements"] },
          { prompt: "Solve: 1000 − 812", answer: 188, hints: ["9-8=1, 9-1=8, 10-2=8"], skillKeys: ["borrow_free_subtraction", "subtraction_complements"] },
          { prompt: "Solve: 1000 − 294", answer: 706, hints: ["9-2=7, 9-9=0, 10-4=6"], skillKeys: ["borrow_free_subtraction", "subtraction_complements"] },
          { prompt: "Solve: 10000 − 4531", answer: 5469, hints: ["9-4=5, 9-5=4, 9-3=6, 10-1=9"], skillKeys: ["borrow_free_subtraction", "subtraction_complements"] },
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
  nextLessonUrl: "/mindsutra/course/level-1/lesson/VM_L1_6",
};

// ─── VM_L1_6 — Multiply by 5 and 25 ─────────────────────────────────────────

export const VM_L1_6_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_1", levelId: "L1", levelSlug: "level-1", title: "Vedic Maths Level 1" },
  lesson: {
    id: "VM_L1_6", order: 6, title: "Multiply by 5 and 25",
    sutra: "Anurupyena",
    objective: "Use halving and place-value shift to multiply any number by 5 or 25 without long multiplication.",
    supportTag: "Core",
    durationMin: 20, difficulty: 1, xpReward: 25,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Multiplying by 5 or 25 looks hard, but these numbers are just halves of 10 and 100. One simple conversion turns them into trivial calculations.",
      board: {
        type: "intro_card",
        data: {
          headline: "×5 and ×25 in Your Head",
          example: "68 × 25 = ?",
          goal: "Convert ×5 to ÷2 then ×10. Convert ×25 to ÷4 then ×100.",
          assetPath: "/math-svgs/vedic/l1_times5_times25_intro_68x25.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the rule", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "5 = 10 ÷ 2, so ×5 = ÷2 then ×10. Example: 64 × 5 → 64÷2=32, then 32×10=320. Similarly, 25 = 100 ÷ 4, so ×25 = ÷4 then ×100.",
      board: {
        type: "place_value_split",
        data: {
          rules: ["× 5 → halve, then × 10", "× 25 → quarter, then × 100"],
          example1: "64 × 5 = 32 × 10 = 320",
          example2: "48 × 25 = 12 × 100 = 1200",
          assetPath: "/math-svgs/level_1/VM_L1_6_MULT_BY_5_25/half-then-times10-flow.svg",
        },
      },
      explanation: {
        title: "Why this works",
        body: "5 × 2 = 10 and 25 × 4 = 100. So multiplying by 5 is the same as halving and multiplying by 10.",
        mistakeTip: "If the number is odd, halve it as a decimal. 37 × 5 = 18.5 × 10 = 185.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Let us work out 36 × 25. Quarter of 36 = 9. Then 9 × 100 = 900. Answer: 900.",
      board: {
        type: "worked_example",
        data: {
          expression: "36 × 25",
          steps: [
            "25 = 100 ÷ 4, so ×25 = ÷4 then ×100",
            "36 ÷ 4 = 9",
            "9 × 100 = 900",
          ],
          answer: 900,
          assetPath: "/math-svgs/level_1/VM_L1_6_MULT_BY_5_25/quarter-then-times100-flow.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Always check divisibility first. 36 is divisible by 4 giving a whole number answer. If not exactly divisible, the answer will include a decimal or half-step.",
        mistakeTip: "If dividing by 4 gives a remainder 2, multiply as x.5 × 100 — still a whole number.",
        alternateExplanation: "You can also think of 25 as one quarter of 100. So 36 × 25 means: find one quarter of 36, then make it hundreds.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 74 × 5. What is half of 74?",
      board: {
        type: "practice_board",
        data: {
          expression: "74 × 5",
          prompt: "Halve 74, then multiply by 10.",
          assetPath: "/math-svgs/level_1/VM_L1_6_MULT_BY_5_25/times-5-split-panel.svg",
        },
      },
      explanation: { title: "Two steps", body: "74 ÷ 2 = 37, then 37 × 10 = 370." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 74 × 5",
        answer: 370,
        skillKeys: ["multiply_by_5_and_25", "factor_transformation"],
        hints: [
          "74 ÷ 2 = 37",
          "37 × 10 = 370",
        ],
        remediation: {
          prompt: "Checkpoint: what is half of 74?",
          answer: 37,
          skillKeys: ["factor_transformation"],
          hints: [
            "Split 74 into 70 and 4",
            "Half of 70 is 35 and half of 4 is 2, so 37",
          ],
        },
        challenge: {
          prompt: "Bonus stretch: solve 84 × 25.",
          answer: 2100,
          skillKeys: ["multiply_by_5_and_25", "factor_transformation"],
          hints: [
            "Quarter 84 to get 21",
            "21 × 100 = 2100",
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
      tutorText: "Now try 52 × 25. Use the quarter-then-×100 method.",
      board: {
        type: "practice_board",
        data: {
          expression: "52 × 25",
          prompt: "Quarter 52, then multiply by 100.",
          assetPath: "/math-svgs/level_1/VM_L1_6_MULT_BY_5_25/times-25-split-panel.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 52 × 25",
        answer: 1300,
        skillKeys: ["multiply_by_5_and_25", "factor_transformation"],
        hints: [
          "52 ÷ 4 = 13",
          "13 × 100 = 1300",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "You now have two powerful shortcuts in your toolkit. These alone will save you enormous time in competitive exams.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "× 5 = ÷ 2 then × 10.  × 25 = ÷ 4 then × 100.",
          remember: [
            "× 5: halve the number, add a zero",
            "× 25: quarter the number, add two zeros",
            "Works cleanly when the number is even",
          ],
          example: "36 × 25 = 9 × 100 = 900",
          assetPath: "/math-svgs/vedic/l1_times5_times25_bridge.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students multiply first and then try to simplify. Always convert ×5 or ×25 into the halving shortcut before multiplying.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Ready to speed up your multiplication? Solve these 6 problems using the halving and quartering shortcuts. A perfect score gets you 25 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "x5 & x25 Speed Drill",
          prompt: "x5 = ÷2 then x10 | x25 = ÷4 then x100.",
          assetPath: "/math-svgs/level_1/VM_L1_6_MULT_BY_5_25/5-and-25-shortcut-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "24 × 5", answer: 120, hints: ["24 ÷ 2 = 12"], skillKeys: ["multiply_by_5_and_25", "factor_transformation"] },
          { prompt: "48 × 25", answer: 1200, hints: ["48 ÷ 4 = 12"], skillKeys: ["multiply_by_5_and_25", "factor_transformation"] },
          { prompt: "82 × 5", answer: 410, hints: ["82 ÷ 2 = 41"], skillKeys: ["multiply_by_5_and_25", "factor_transformation"] },
          { prompt: "12 × 25", answer: 300, hints: ["12 ÷ 4 = 3"], skillKeys: ["multiply_by_5_and_25", "factor_transformation"] },
          { prompt: "66 × 5", answer: 330, hints: ["66 ÷ 2 = 33"], skillKeys: ["multiply_by_5_and_25", "factor_transformation"] },
          { prompt: "16 × 25", answer: 400, hints: ["16 ÷ 4 = 4"], skillKeys: ["multiply_by_5_and_25", "factor_transformation"] },
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
  nextLessonUrl: "/mindsutra/course/level-1/lesson/VM_L1_7",
};

// ─── VM_L1_7 — Near-100 Mental Math ─────────────────────────────────────────

export const VM_L1_7_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_1", levelId: "L1", levelSlug: "level-1", title: "Vedic Maths Level 1" },
  lesson: {
    id: "VM_L1_7", order: 7, title: "Near-100 Mental Math",
    sutra: "Nikhilam Navatashcaramam Dashatah",
    objective: "Add and subtract numbers close to 100 by tracking deviations from the base.",
    supportTag: "Stretch",
    durationMin: 25, difficulty: 2, xpReward: 30,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Numbers like 97, 103, and 89 look clumsy to add. But they are each only a small step away from 100. We track that small step first, and then the arithmetic becomes lighter.",
      board: {
        type: "intro_card",
        data: {
          headline: "Near-100 Addition & Subtraction",
          example: "97 + 89",
          goal: "Work with deviations from 100, not with the numbers themselves.",
          assetPath: "/math-svgs/level_1/VM_L1_7_NEAR_100/worked-97-plus-89.svg",
        },
      },
      actions: [{ id: "next", label: "Show me deviations", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Deviation means distance from 100. If a number is below 100, write a minus sign. If it is above 100, write a plus sign. For two near-100 numbers, start at 200 and then adjust.",
      board: {
        type: "complement_bar",
        data: {
          base: 100,
          examples: [
            { number: 97, deviation: -3 },
            { number: 89, deviation: -11 },
          ],
          rule: "Sum = 200 + (−3) + (−11) = 186",
          assetPath: "/math-svgs/level_1/VM_L1_7_NEAR_100/deviation-from-100-tag.svg",
        },
      },
      explanation: {
        title: "Why 200?",
        body: "Two numbers both near 100 together total near 200. We just adjust from 200 by the sum of deviations.",
        mistakeTip: "A number above 100 has a positive deviation. A number below 100 has a negative deviation.",
        alternateExplanation: "You can say it without signs first: 97 is 3 short of 100 and 89 is 11 short of 100. Together they are 14 short of 200, so the answer is 186.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "97 + 89: the first number is 3 short of 100, and the second is 11 short of 100. Together they are 14 short of 200. So 200 − 14 = 186.",
      board: {
        type: "worked_example",
        data: {
          expression: "97 + 89",
          steps: [
            "97 = 100 − 3  →  deviation −3",
            "89 = 100 − 11  →  deviation −11",
            "Sum of deviations: −3 + (−11) = −14",
            "Answer: 200 + (−14) = 186",
          ],
          answer: 186,
          assetPath: "/math-svgs/level_1/VM_L1_7_NEAR_100/worked-97-plus-89.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "This method is fastest when both numbers are close to 100. First think about the distances. Then adjust the base total.",
        mistakeTip: "Always write the sign of the deviation. Mixing up + and − is the main source of error here.",
        alternateExplanation: "If the signs feel heavy, switch to plain language: above 100 means extra, below 100 means short. Then combine the extras and shortages.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 103 + 96. Find the deviation of each number from 100 first.",
      board: {
        type: "practice_board",
        data: {
          expression: "103 + 96",
          prompt: "103 is +3 above 100. What is 96?",
          assetPath: "/math-svgs/level_1/VM_L1_7_NEAR_100/guided-103-plus-96.svg",
        },
      },
      explanation: { title: "Mixed signs", body: "103 deviation = +3, 96 deviation = −4. Sum = 200 + 3 − 4 = 199." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 103 + 96",
        answer: 199,
        skillKeys: ["near_100_adjustments", "deviation_tracking"],
        hints: [
          "103: deviation = +3",
          "96: deviation = −4",
          "200 + 3 − 4 = 199",
        ],
        remediation: {
          prompt: "Checkpoint: what is the deviation of 96 from 100?",
          answer: -4,
          skillKeys: ["deviation_tracking"],
          hints: [
            "96 is 4 below 100",
            "Below 100 means the deviation is negative",
          ],
        },
        challenge: {
          prompt: "Bonus stretch: solve 107 + 94 using deviations.",
          answer: 201,
          skillKeys: ["near_100_adjustments", "deviation_tracking"],
          hints: [
            "107 is +7, 94 is -6",
            "200 + 7 - 6 = 201",
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
      tutorText: "Try 98 + 93. Both are below 100. Calculate using deviations.",
      board: {
        type: "practice_board",
        data: {
          expression: "98 + 93",
          prompt: "Find both deviations, sum them, apply to 200.",
          assetPath: "/math-svgs/level_1/VM_L1_7_NEAR_100/challenge-98-plus-93.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 98 + 93",
        answer: 191,
        skillKeys: ["near_100_adjustments", "deviation_tracking"],
        hints: [
          "98: deviation = −2",
          "93: deviation = −7",
          "200 − 2 − 7 = 191",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Excellent. This near-100 method will be the foundation of much more powerful Vedic multiplication in Level 2. Master the deviation concept now.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Two near-100 numbers add to 200 plus their deviations.",
          remember: [
            "Find deviation: number − 100 (positive if above, negative if below)",
            "Start at 200 for two numbers, 300 for three, etc.",
            "Add all deviations to the base sum",
          ],
          example: "97 + 89 = 200 − 3 − 11 = 186",
          assetPath: "/math-svgs/level_1/VM_L1_7_NEAR_100/compare-to-100-strip.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students confuse deviation sign. A number smaller than 100 has a NEGATIVE deviation. Write it clearly with a minus sign.",
        alternateExplanation: "Before using symbols, say the sentence aloud: 98 is 2 below 100, 93 is 7 below 100. That sentence often prevents sign mistakes.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Can you track the deviations without writing? Solve these 6 near-100 additions using the base-200 method. 30 XP is up for grabs!",
      board: {
        type: "practice_board",
        data: {
          headline: "Near-100 Speed Test",
          prompt: "Sum = 200 + dev1 + dev2.",
          assetPath: "/math-svgs/level_1/VM_L1_7_NEAR_100/near-100-number-line.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "98 + 97", answer: 195, hints: ["-2, -3"], skillKeys: ["near_100_adjustments", "deviation_tracking"] },
          { prompt: "102 + 98", answer: 200, hints: ["+2, -2"], skillKeys: ["near_100_adjustments", "deviation_tracking"] },
          { prompt: "95 + 96", answer: 191, hints: ["-5, -4"], skillKeys: ["near_100_adjustments", "deviation_tracking"] },
          { prompt: "105 + 99", answer: 204, hints: ["+5, -1"], skillKeys: ["near_100_adjustments", "deviation_tracking"] },
          { prompt: "89 + 92", answer: 181, hints: ["-11, -8"], skillKeys: ["near_100_adjustments", "deviation_tracking"] },
          { prompt: "112 + 96", answer: 208, hints: ["+12, -4"], skillKeys: ["near_100_adjustments", "deviation_tracking"] },
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
  nextLessonUrl: "/mindsutra/course/level-1/lesson/VM_L1_8",
};

// ─── VM_L1_8 — Criss-Cross 2-Digit Multiplication ───────────────────────────

export const VM_L1_8_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_1", levelId: "L1", levelSlug: "level-1", title: "Vedic Maths Level 1" },
  lesson: {
    id: "VM_L1_8", order: 8, title: "Criss-Cross 2-Digit Multiplication",
    sutra: "Urdhva-Tiryagbhyam",
    objective: "Multiply any two 2-digit numbers in three column steps without any long multiplication layout.",
    supportTag: "Stretch",
    durationMin: 30, difficulty: 2, xpReward: 35,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Urdhva-Tiryagbhyam means vertically and cross-wise. We only need three columns. Do one column at a time, from right to left.",
      board: {
        type: "intro_card",
        data: {
          headline: "Criss-Cross: Multiply Any Two 2-Digit Numbers",
          example: "23 × 14",
          goal: "Three column products — ones, cross-sum, tens — give the full answer.",
          assetPath: "/math-svgs/vedic/vm_criss_cross_2digit_generic.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the grid", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Write the two numbers as AB and CD. First do the right column. Next do the cross column. Last do the left column. Any carry moves one step to the left.",
      board: {
        type: "criss_cross",
        data: {
          expression: "AB × CD",
          columns: [
            { label: "Hundreds", product: "A×C" },
            { label: "Tens", product: "A×D + B×C" },
            { label: "Ones", product: "B×D" },
          ],
          assetPath: "/math-svgs/level_1/VM_L1_8_CRISS_CROSS_2DIG/urdhva-tiryagbhyam-card-basic.svg",
        },
      },
      explanation: {
        title: "Column rule",
        body: "Start from the rightmost column. Write the ones digit, carry the tens digit to the next column. Repeat for all three columns.",
        mistakeTip: "The middle step has two cross products to add. Do not forget either one.",
        alternateExplanation: "If the letters feel abstract, say it with the actual example instead: right pair, crossed pair, left pair. The order is the whole trick.",
      },
      actions: [{ id: "next", label: "Walk me through 23 × 14", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "23 × 14. Ones: 3×4=12, write 2 carry 1. Middle: 2×4 + 3×1 + carry 1 = 12, write 2 carry 1. Hundreds: 2×1 + carry 1 = 3. Answer: 322.",
      board: {
        type: "worked_example",
        data: {
          expression: "23 × 14",
          steps: [
            "Ones: 3 × 4 = 12 → write 2, carry 1",
            "Tens: (2×4) + (3×1) + carry 1 = 8+3+1 = 12 → write 2, carry 1",
            "Hundreds: 2 × 1 + carry 1 = 3",
            "Answer: 322",
          ],
          answer: 322,
          assetPath: "/math-svgs/level_1/VM_L1_8_CRISS_CROSS_2DIG/diagonal-arrow-set-2digit.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Three steps: vertical ones, two diagonal cross products, vertical tens. Carries flow left.",
        mistakeTip: "Students sometimes forget to add both cross products in the middle step. Both diagonals must be included.",
        alternateExplanation: "You can picture it as a three-box answer. Fill the right box first, then the middle box, then the left box.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 32 × 21 with the criss-cross method. Start with the ones column: 2 × 1.",
      board: {
        type: "practice_board",
        data: {
          expression: "32 × 21",
          prompt: "Ones → cross → hundreds. Track carries.",
          assetPath: "/math-svgs/vedic/vm_criss_cross_2digit_generic.svg",
        },
      },
      explanation: { title: "Step check", body: "Ones: 2×1=2. Middle: 3×1+2×2=7. Hundreds: 3×2=6. Answer: 672." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 32 × 21",
        answer: 672,
        skillKeys: ["criss_cross_2_digit"],
        hints: [
          "Ones: 2 × 1 = 2",
          "Tens: 3×1 + 2×2 = 3+4 = 7",
          "Hundreds: 3 × 2 = 6 → Answer: 672",
        ],
        remediation: {
          prompt: "Checkpoint: what is the cross-sum in 32 × 21?",
          answer: 7,
          skillKeys: ["criss_cross_2_digit"],
          hints: [
            "Cross products are 3×1 and 2×2",
            "3 + 4 = 7",
          ],
        },
        challenge: {
          prompt: "Bonus stretch: solve 24 × 32 with criss-cross.",
          answer: 768,
          skillKeys: ["criss_cross_2_digit", "carry_from_ones"],
          hints: [
            "Ones: 4×2 = 8",
            "Middle: 2×2 + 4×3 = 16",
            "Hundreds: 2×3 plus carry gives 7",
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
      tutorText: "Now 47 × 36 — carries will appear in all three columns. Take it one column at a time.",
      board: {
        type: "practice_board",
        data: {
          expression: "47 × 36",
          prompt: "Careful with carries in the middle column.",
          assetPath: "/math-svgs/vedic/vm_criss_cross_2digit_generic.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 47 × 36",
        answer: 1692,
        skillKeys: ["criss_cross_2_digit", "carry_from_ones"],
        hints: [
          "Ones: 7×6=42, write 2, carry 4",
          "Tens: 4×6 + 7×3 + 4 = 24+21+4 = 49, write 9, carry 4",
          "Hundreds: 4×3 + 4 = 16 → Answer: 1692",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Brilliant. The criss-cross method works for any two 2-digit numbers. You will extend this to 3-digit in Level 2 and 4-digit in Level 5.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Three columns: B×D | A×D+B×C | A×C. Carry left at each step.",
          remember: [
            "Write the two numbers as AB and CD",
            "Ones: B×D. Middle: A×D + B×C. Hundreds: A×C",
            "Carry any two-digit column result to the next column",
          ],
          example: "23 × 14 = 322",
          assetPath: "/math-svgs/level_1/VM_L1_8_CRISS_CROSS_2DIG/answer-slot-series-3.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students add only one diagonal in the middle step. You must add BOTH: A×D and B×C. Then add the carry from the ones step.",
        alternateExplanation: "For students who like grids better, imagine a tiny area model: one box on the right, two crossed boxes in the middle, one box on the left.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "The big finale! Solve these 6 2-digit multiplications using the Criss-Cross method. Complete this to master Level 1 and earn 35 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Level 1 Final Challenge",
          prompt: "Vertically and Cross-wise! AB x CD.",
          assetPath: "/math-svgs/level_1/VM_L1_8_CRISS_CROSS_2DIG/criss-cross-2digit-frame.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "12 × 13", answer: 156, hints: ["1x1=1, (1x3+2x1)=5, 2x3=6"], skillKeys: ["criss_cross_2_digit"] },
          { prompt: "21 × 32", answer: 672, hints: ["2x3=6, (2x2+1x3)=7, 1x2=2"], skillKeys: ["criss_cross_2_digit"] },
          { prompt: "41 × 11", answer: 451, hints: ["4x1=4, (4x1+1x1)=5, 1x1=1"], skillKeys: ["criss_cross_2_digit"] },
          { prompt: "23 × 22", answer: 506, hints: ["2x2=4, (2x2+3x2)=10 (carry!), 3x2=6"], skillKeys: ["criss_cross_2_digit", "carry_from_ones"] },
          { prompt: "14 × 14", answer: 196, hints: ["1x1=1, (1x4+4x1)=8, 4x4=16 (carry!)"], skillKeys: ["criss_cross_2_digit", "carry_from_ones"] },
          { prompt: "31 × 21", answer: 651, hints: ["3x2=6, (3x1+1x2)=5, 1x1=1"], skillKeys: ["criss_cross_2_digit"] },
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
  nextLessonUrl: "/mindsutra/course/level-2/lesson/VM_L2_1",
};
