import type { MindSutraLessonPayload } from "./mindsutraLessonTypes";

// ─── VM_L5_1 — Square Root by Inspection ─────────────────────────────────────

export const VM_L5_1_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_5", levelId: "L5", levelSlug: "level-5", title: "Vedic Maths Level 5" },
  lesson: {
    id: "VM_L5_1", order: 1, title: "Square Root by Inspection",
    sutra: "Vilokanam",
    objective: "Find the square root of perfect squares by digit-pair grouping and the last-digit pattern.",
    durationMin: 30, difficulty: 4, xpReward: 50,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Vilokanam means mere observation. For perfect squares, you can find the square root by grouping digits and matching the last digit pattern — no trial and error needed.",
      board: {
        type: "intro_card",
        data: {
          headline: "Square Root by Digit-Pair Inspection",
          example: "√7056",
          goal: "Group digits in pairs from right. Identify ones digit. Find tens digit by inspection.",
          assetPath: "/math-svgs/level_5/VM_L5_1_SQUARE_ROOTS/square-root-inspection-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Step 1: group digits right to left in pairs. Number of pairs = number of digits in the root. Step 2: last digit of the square determines possible last digits of the root. Step 3: use the left group to find the tens digit.",
      board: {
        type: "place_value_split",
        data: {
          lastDigitMap: [
            "Square ends 1 → root ends 1 or 9",
            "Square ends 4 → root ends 2 or 8",
            "Square ends 5 → root ends 5",
            "Square ends 6 → root ends 4 or 6",
            "Square ends 9 → root ends 3 or 7",
            "Square ends 0 → root ends 0",
          ],
          assetPath: "/math-svgs/level_5/VM_L5_1_SQUARE_ROOTS/root-guess-selector.svg",
        },
      },
      explanation: {
        title: "Two-step logic",
        body: "For a 4-digit perfect square: (1) ones digit of root from last-digit pattern, (2) tens digit = floor(√left-pair). Choose the candidate that fits.",
        mistakeTip: "Two candidates for ones digit — pick the one whose square matches. Use the floor of √(left pair) as the tens digit.",
      },
      actions: [{ id: "next", label: "Walk me through √7056", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "√7056. Pairs: 70|56. Last digit 6 → root ends in 4 or 6. Left pair 70: floor(√70)=8. Candidates: 84 or 86. Check: 84²=7056. Answer: 84.",
      board: {
        type: "worked_example",
        data: {
          expression: "√7056",
          steps: [
            "Pair grouping: 70 | 56",
            "Last digit 6 → root ends 4 or 6",
            "Left pair 70: floor(√70) = 8 (since 8²=64 ≤ 70 < 9²=81)",
            "Candidates: 84 or 86",
            "Check 84² = (80+4)² = 6400+640+16 = 7056 ✓",
            "Answer: 84",
          ],
          answer: 84,
          assetPath: "/math-svgs/level_5/VM_L5_1_SQUARE_ROOTS/nearest-square-marker.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Two steps: tens digit from left pair, ones digit from last-digit pattern. One quick check confirms the answer.",
        mistakeTip: "Always verify by squaring your answer. The check takes 3 seconds with the duplex method.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Find √5329. Pairs: 53|29. First lock the ones digit from the last-digit rule.",
      board: {
        type: "practice_board",
        data: {
          expression: "√5329",
          prompt: "Last digit 9 means the root must end in 3 or 7. Start there.",
          assetPath: "/math-svgs/level_5/VM_L5_1_SQUARE_ROOTS/digit-grouping-bracket-pairs.svg",
        },
      },
      explanation: { title: "Steps", body: "73²=5329. Answer: 73." },
      practice: {
        mode: "mcq",
        prompt: "What ones digit must the root of 5329 end with?",
        answer: 3,
        options: ["2", "3", "7", "9"],
        hints: [
          "A square ending in 9 can come from 3 or 7",
          "The left pair 53 gives tens digit 7, so the real candidates are 73 or 77",
          "73² = 5329, so the ones digit is 3",
        ],
        remediation: {
          prompt: "Checkpoint: which two ones digits are possible when a square ends in 9?",
          answer: "3 or 7",
          options: ["1 or 9", "2 or 8", "3 or 7", "4 or 6"],
          hints: [
            "Use the square-ending map",
            "3² and 7² both end in 9",
            "So the possible ones digits are 3 or 7",
          ],
        },
        challenge: {
          prompt: "Transfer check: after fixing ones digit 3 and tens digit 7, what full root do you get for √5329?",
          answer: 73,
          options: ["63", "73", "77", "83"],
          hints: [
            "The left pair 53 gives tens digit 7",
            "The correct ones digit is 3",
            "So the full root is 73",
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
      tutorText: "Find √9604. Again, first choose the ones digit from the last-digit rule.",
      board: {
        type: "practice_board",
        data: {
          expression: "√9604",
          prompt: "Pairs: 96|04. Last digit 4 means the root ends in 2 or 8.",
          assetPath: "/math-svgs/level_5/VM_L5_1_SQUARE_ROOTS/root-answer-lane.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What ones digit must the root of 9604 end with?",
        answer: 8,
        options: ["2", "4", "6", "8"],
        hints: [
          "A square ending in 4 can come from 2 or 8",
          "The left pair 96 gives tens digit 9, so the candidates are 92 or 98",
          "98² = 9604, so the ones digit is 8",
        ],
        remediation: {
          prompt: "Checkpoint: which two ones digits are possible when a square ends in 4?",
          answer: "2 or 8",
          options: ["1 or 9", "2 or 8", "3 or 7", "4 or 6"],
          hints: [
            "Use the square-ending map",
            "2² and 8² both end in 4",
            "So the possible ones digits are 2 or 8",
          ],
        },
        challenge: {
          prompt: "Transfer check: after fixing ones digit 8 and tens digit 9, what full root do you get for √9604?",
          answer: 98,
          options: ["92", "94", "98", "99"],
          hints: [
            "The left pair 96 gives tens digit 9",
            "The correct ones digit is 8",
            "So the full root is 98",
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
      tutorText: "Square root by inspection is one of the most impressive mental math skills. It works for all 4-digit perfect squares and scales to 6-digit squares with one extra pair.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Pair from right → floor(√left pair) = tens digit → last-digit pattern = ones digit → verify.",
          remember: [
            "Group digits in pairs from the right",
            "Last digit of square → possible ones digits of root",
            "Left pair → tens digit by floor(√)",
          ],
          example: "√7056 = 84",
          assetPath: "/math-svgs/level_5/VM_L5_1_SQUARE_ROOTS/square-root-inspection-board.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Picking the wrong candidate without checking. Always verify by squaring — it takes 3 seconds.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Mere observation! Find the square root of these perfect squares by inspecting the last digit and the left pair. 50 XP reward!",
      board: {
        type: "practice_board",
        data: {
          headline: "Square Root Inspection Sprint",
          prompt: "Pair digits from right. floor(√left) | last pattern.",
          assetPath: "/math-svgs/level_5/VM_L5_1_SQUARE_ROOTS/square-root-inspection-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "√7056", answer: 84, hints: ["Left: 70 -> 8. Last 6 -> 4 or 6. 84²=7056."] },
          { prompt: "√5329", answer: 73, hints: ["Left: 53 -> 7. Last 9 -> 3 or 7. 73²=5329."] },
          { prompt: "√9604", answer: 98, hints: ["Left: 96 -> 9. Last 4 -> 2 or 8. 98²=9604."] },
          { prompt: "√2025", answer: 45, hints: ["Ends in 5 -> must be 45."] },
          { prompt: "√1024", answer: 32, hints: ["Left: 10 -> 3. Last 4 -> 2 or 8. 32²=1024."] },
          { prompt: "√4096", answer: 64, hints: ["Left: 40 -> 6. Last 6 -> 4 or 6. 64²=4096."] },
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
  nextLessonUrl: "/mindsutra/course/level-5/lesson/VM_L5_2",
};

// ─── VM_L5_2 — Cube Root by Inspection ───────────────────────────────────────

export const VM_L5_2_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_5", levelId: "L5", levelSlug: "level-5", title: "Vedic Maths Level 5" },
  lesson: {
    id: "VM_L5_2", order: 2, title: "Cube Root by Inspection",
    sutra: "Vilokanam",
    objective: "Find cube roots of perfect cubes by digit-triple grouping and the unique last-digit mapping.",
    durationMin: 30, difficulty: 4, xpReward: 50,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Cube roots of perfect cubes have a beautiful last-digit property: each digit 0–9 maps to a UNIQUE cube last digit. No two candidates — just one certain answer.",
      board: {
        type: "intro_card",
        data: {
          headline: "Cube Root by Digit-Triple Inspection",
          example: "∛17576",
          goal: "Group in triples from right. Read ones digit from mapping. Find tens digit from left triple.",
          assetPath: "/math-svgs/level_5/VM_L5_2_CUBE_ROOTS/cube-root-inspection-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the digit map", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "The cube last-digit map: 1³=1, 2³=8, 3³=7, 4³=4, 5³=5, 6³=6, 7³=3, 8³=2, 9³=9, 0³=0. Notice 1↔1, 2↔8, 3↔7, 4↔4, 5↔5, 6↔6, 7↔3, 8↔2, 9↔9. The ones digit of the cube tells you EXACTLY the ones digit of the root.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "Unique cube-end mapping — no ambiguity",
          map: "Cube ends → Root ends: 1→1, 2→8, 3→7, 4→4, 5→5, 6→6, 7→3, 8→2, 9→9, 0→0",
          assetPath: "/math-svgs/level_5/VM_L5_2_CUBE_ROOTS/cube-end-mapping-wheel.svg",
        },
      },
      explanation: {
        title: "Why unique?",
        body: "Each digit 0–9 cubed gives a different last digit. So the mapping is one-to-one — no guessing needed.",
        mistakeTip: "Memorise the complement pairs: 2↔8 and 3↔7 are the tricky ones. All others map to themselves.",
      },
      actions: [{ id: "next", label: "Walk me through ∛17576", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "∛17576. Triple grouping: 17|576. Last digit 6 → root ends 6. Left triple 17: floor(∛17)=2 (since 2³=8≤17<3³=27). Answer: 26.",
      board: {
        type: "worked_example",
        data: {
          expression: "∛17576",
          steps: [
            "Triple grouping: 17 | 576",
            "Last digit 6 → root ends 6 (unique mapping)",
            "Left triple 17: 2³=8 ≤ 17 < 3³=27 → tens digit = 2",
            "Answer: 26",
            "Verify: 26³ = 17576 ✓",
          ],
          answer: 26,
          assetPath: "/math-svgs/level_5/VM_L5_2_CUBE_ROOTS/digit-grouping-bracket-triples.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Only one candidate for the ones digit. Only one candidate for the tens digit. The answer is immediate.",
        mistakeTip: "Verify: 26³ = 26×26×26 = 676×26. Use duplex squaring for 26² then multiply.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Find ∛19683. Triple: 19|683. First lock the ones digit from the cube-ending map.",
      board: {
        type: "practice_board",
        data: {
          expression: "∛19683",
          prompt: "Last digit 3 points to one exact root ending. Start there.",
          assetPath: "/math-svgs/level_5/VM_L5_2_CUBE_ROOTS/root-digit-selector.svg",
        },
      },
      explanation: { title: "Steps", body: "Left 19: 2³=8≤19<3³=27 → tens=2. Root ends 7. Answer: 27." },
      practice: {
        mode: "mcq",
        prompt: "What ones digit must the root of 19683 end with?",
        answer: 7,
        options: ["3", "7", "8", "9"],
        hints: [
          "Cube endings are unique, unlike square endings",
          "A cube ending in 3 comes from a root ending in 7",
          "Then the left triple 19 gives tens digit 2, so the full root is 27",
        ],
        remediation: {
          prompt: "Checkpoint: which root ending gives a cube ending in 3?",
          answer: 7,
          options: ["2", "3", "7", "8"],
          hints: [
            "Think of the swap pair in the cube map",
            "3 and 7 swap roles in cube endings",
            "So a cube ending in 3 comes from a root ending in 7",
          ],
        },
        challenge: {
          prompt: "Transfer check: after fixing the ones digit 7, what full root do you get for ∛19683?",
          answer: 27,
          options: ["17", "23", "27", "37"],
          hints: [
            "The left triple is 19",
            "2³=8≤19<3³=27, so the tens digit is 2",
            "Combine tens 2 with ones 7 to get 27",
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
      tutorText: "Find ∛54872. Triple: 54|872. Again, begin with the unique ones digit.",
      board: {
        type: "practice_board",
        data: {
          expression: "∛54872",
          prompt: "Last digit 2 points to a unique root ending. Then inspect the left triple.",
          assetPath: "/math-svgs/level_5/VM_L5_2_CUBE_ROOTS/cube-root-inspection-board.svg",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What ones digit must the root of 54872 end with?",
        answer: 8,
        options: ["2", "4", "6", "8"],
        hints: [
          "In the cube map, 2 and 8 swap roles",
          "So a cube ending in 2 comes from a root ending in 8",
          "Then the left triple 54 gives tens digit 3, so the full root is 38",
        ],
        remediation: {
          prompt: "Checkpoint: which root ending gives a cube ending in 2?",
          answer: 8,
          options: ["2", "5", "7", "8"],
          hints: [
            "Use the swapped cube-ending pair",
            "2 and 8 map to each other in cube endings",
            "So the root ending is 8",
          ],
        },
        challenge: {
          prompt: "Transfer check: after fixing ones digit 8, what full root do you get for ∛54872?",
          answer: 38,
          options: ["28", "34", "38", "48"],
          hints: [
            "The left triple is 54",
            "3³=27≤54<4³=64, so the tens digit is 3",
            "Combine tens 3 with ones 8 to get 38",
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
      tutorText: "Cube root by inspection is a 2-second skill once you memorise the digit map. It works for all 5 and 6-digit perfect cubes.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Triple grouping → unique ones digit from map → floor(∛left triple) = tens digit.",
          remember: [
            "Map: 2↔8, 3↔7 (swapped). All others: digit maps to itself.",
            "Group in triples from the right",
            "Verify by cubing the answer",
          ],
          example: "∛17576 = 26",
          assetPath: "/math-svgs/level_5/VM_L5_2_CUBE_ROOTS/cube-end-mapping-wheel.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Applying the square-root last-digit pattern to cube roots. The maps are different — memorise the cube-specific map.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Unique mappings! Find the cube roots of these 5 and 6-digit perfect cubes instantly using triples and the digit map. 50 XP reward!",
      board: {
        type: "practice_board",
        data: {
          headline: "Cube Root Speed Test",
          prompt: "Triple from right. One unique mapping for ones digit.",
          assetPath: "/math-svgs/level_5/VM_L5_2_CUBE_ROOTS/cube-root-inspection-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "∛17576", answer: 26, hints: ["Last 6 -> 6. Left 17 -> 2."] },
          { prompt: "∛19683", answer: 27, hints: ["Last 3 -> 7. Left 19 -> 2."] },
          { prompt: "∛54872", answer: 38, hints: ["Last 2 -> 8. Left 54 -> 3."] },
          { prompt: "∛1000", answer: 10, hints: ["10"] },
          { prompt: "∛1331", answer: 11, hints: ["11"] },
          { prompt: "∛27000", answer: 30, hints: ["30"] },
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
  nextLessonUrl: "/mindsutra/course/level-5/lesson/VM_L5_3",
};

// ─── VM_L5_3 — Algebraic Identities — Advanced (a±b)³ ────────────────────────

export const VM_L5_3_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_5", levelId: "L5", levelSlug: "level-5", title: "Vedic Maths Level 5" },
  lesson: {
    id: "VM_L5_3", order: 3, title: "Algebraic Identities — Advanced (a±b)³",
    sutra: "Anurupyena + Dvandva Yoga",
    objective: "Expand cube binomials instantly using the Pascal 1-3-3-1 row and sign rules.",
    durationMin: 25, difficulty: 4, xpReward: 50,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Cubic expansions use the Pascal triangle row 1-3-3-1. Once you see this pattern, expanding (a+b)³ and (a−b)³ becomes a 4-term fill-in.",
      board: {
        type: "intro_card",
        data: {
          headline: "(a±b)³ Expansion — Pascal 1-3-3-1",
          example: "(x + 2)³",
          goal: "Write 4 terms with coefficients 1-3-3-1 and alternating signs for (a−b)³.",
          assetPath: "/math-svgs/level_5/VM_L5_3_ALGEBRAIC_IDENTITIES_ADV/pascal-row-1331-card.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the pattern", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "(a+b)³ = a³ + 3a²b + 3ab² + b³. (a−b)³ = a³ − 3a²b + 3ab² − b³. Coefficients are always 1, 3, 3, 1. For the minus case, signs alternate: +, −, +, −.",
      board: {
        type: "sutra_rule",
        data: {
          patterns: [
            "(a+b)³ = a³ + 3a²b + 3ab² + b³",
            "(a−b)³ = a³ − 3a²b + 3ab² − b³",
          ],
          note: "Powers of a decrease: a³, a², a¹, a⁰. Powers of b increase: b⁰, b¹, b², b³.",
          assetPath: "/math-svgs/level_5/VM_L5_3_ALGEBRAIC_IDENTITIES_ADV/coefficient-flow-strip.svg",
        },
      },
      explanation: {
        title: "Pascal 1-3-3-1",
        body: "Row 3 of Pascal's triangle: 1, 3, 3, 1. These are always the coefficients for a cubic binomial.",
        mistakeTip: "For (a−b)³ the signs alternate starting with +. The 3a²b term is NEGATIVE.",
      },
      actions: [{ id: "next", label: "Walk me through (x+2)³", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "(x+2)³: a=x, b=2. Terms: x³ + 3x²×2 + 3x×4 + 8 = x³ + 6x² + 12x + 8.",
      board: {
        type: "worked_example",
        data: {
          expression: "(x + 2)³",
          steps: [
            "a = x, b = 2",
            "Term 1: a³ = x³",
            "Term 2: 3a²b = 3×x²×2 = 6x²",
            "Term 3: 3ab² = 3×x×4 = 12x",
            "Term 4: b³ = 8",
            "Answer: x³ + 6x² + 12x + 8",
          ],
          answer: "x³ + 6x² + 12x + 8",
          assetPath: "/math-svgs/level_5/VM_L5_3_ALGEBRAIC_IDENTITIES_ADV/binomial-cube-board.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Fill in the 4-slot template: a³ | 3a²b | 3ab² | b³. Substitute a and b, compute each term.",
        mistakeTip: "b² and b³ need exact computation. For b=2: b²=4, b³=8. Do not confuse them.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Expand (x + 3)³. Fill in the 4 terms.",
      board: {
        type: "practice_board",
        data: {
          expression: "(x + 3)³",
          prompt: "Terms: x³ | 3x²×3 | 3x×9 | 27",
          assetPath: "/math-svgs/level_5/VM_L5_3_ALGEBRAIC_IDENTITIES_ADV/identity-expansion-panel-advanced.svg",
        },
      },
      explanation: { title: "Steps", body: "x³ + 9x² + 27x + 27." },
      practice: {
        mode: "numeric",
        prompt: "What is the coefficient of x in (x+3)³?",
        answer: 27,
        hints: [
          "3ab² = 3 × x × 3² = 3 × x × 9 = 27x",
          "Coefficient of x = 27",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Expand (x − 1)³. Signs alternate — be careful with the minus terms.",
      board: {
        type: "practice_board",
        data: {
          expression: "(x − 1)³",
          prompt: "(a−b)³: alternating signs. Term 2 is −3a²b.",
          assetPath: "/math-svgs/level_5/VM_L5_3_ALGEBRAIC_IDENTITIES_ADV/pascal-row-1331-card.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What is the constant term in (x−1)³?",
        answer: -1,
        hints: [
          "(a−b)³ = a³ − 3a²b + 3ab² − b³",
          "Constant term = −b³ = −1³ = −1",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "You now expand any cubic binomial in one pass. Combined with the numerical cubing method, you have complete mastery of cubic arithmetic.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "1-3-3-1 coefficients. Alternating signs for (a−b)³.",
          remember: [
            "(a+b)³: all positive terms",
            "(a−b)³: signs alternate + − + −",
            "Powers of a go down, powers of b go up",
          ],
          example: "(x+2)³ = x³+6x²+12x+8",
          assetPath: "/math-svgs/level_5/VM_L5_3_ALGEBRAIC_IDENTITIES_ADV/binomial-cube-board.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Using 1-2-1 coefficients (which are for squares). Cubes always use 1-3-3-1.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "The 1-3-3-1 Row! Compute the coefficients and constants for these cubic expansions using Pascal's structure. 50 XP reward!",
      board: {
        type: "practice_board",
        data: {
          headline: "Cubic Identity Sprint",
          prompt: "a³ | 3a²b | 3ab² | b³.",
          assetPath: "/math-svgs/level_5/VM_L5_3_ALGEBRAIC_IDENTITIES_ADV/pascal-row-1331-card.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "Coefficient of x in (x+2)³", answer: 12, hints: ["3ab² = 3 * 1 * 4 = 12"] },
          { prompt: "Coefficient of x in (x+3)³", answer: 27, hints: ["3 * 1 * 9 = 27"] },
          { prompt: "Constant term of (x-1)³", answer: -1, hints: ["-b³ = -1"] },
          { prompt: "Coefficient of x² in (x+3)³", answer: 9, hints: ["3a²b = 3 * 1 * 3 = 9"] },
          { prompt: "Coefficient of x in (x+1)³", answer: 3, hints: ["3 * 1 * 1 = 3"] },
          { prompt: "Constant term of (x+2)³", answer: 8, hints: ["b³ = 8"] },
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
  nextLessonUrl: "/mindsutra/course/level-5/lesson/VM_L5_4",
};

// ─── VM_L5_4 — Simultaneous Equations — Vedic Method ─────────────────────────

export const VM_L5_4_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_5", levelId: "L5", levelSlug: "level-5", title: "Vedic Maths Level 5" },
  lesson: {
    id: "VM_L5_4", order: 4, title: "Simultaneous Equations — Vedic Method",
    sutra: "Paravartya + Sunyam",
    objective: "Solve 2×2 simultaneous equations in one step using Vedic cross-multiplication of coefficients.",
    durationMin: 30, difficulty: 4, xpReward: 50,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Standard elimination or substitution takes 6–8 lines. The Vedic cross-multiplication method solves any 2×2 simultaneous system in two direct fractions.",
      board: {
        type: "intro_card",
        data: {
          headline: "Solve Simultaneous Equations in One Step",
          example: "2x + 3y = 7  |  x + 2y = 4",
          goal: "Cross-multiply coefficients to get x and y directly.",
          assetPath: "/math-svgs/level_5/VM_L5_4_SIMULTANEOUS_EQ/equation-pair-panel.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the formula", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "For a₁x + b₁y = c₁ and a₂x + b₂y = c₂: D = a₁b₂ − a₂b₁. Then x = (c₁b₂ − c₂b₁) / D and y = (a₁c₂ − a₂c₁) / D. The denominator stays the same for both.",
      board: {
        type: "sutra_rule",
        data: {
          sutra: "x = (c₁b₂ − c₂b₁) / D  |  y = (a₁c₂ − a₂c₁) / D  where D = a₁b₂ − a₂b₁",
          note: "D is the coefficient cross-product (determinant).",
          assetPath: "/math-svgs/level_5/VM_L5_4_SIMULTANEOUS_EQ/elimination-arrow-set.svg",
        },
      },
      explanation: {
        title: "Cross-multiply pattern",
        body: "For x, pair each constant with the opposite y-coefficient. For y, pair each constant with the opposite x-coefficient. Keep the subtraction order aligned with D.",
        mistakeTip: "The denominator D = a₁b₂ − a₂b₁. Keep the same left-to-right order when building both numerators.",
      },
      actions: [{ id: "next", label: "Walk me through the example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "2x + 3y = 7, x + 2y = 4. D = 2×2 − 1×3 = 1. x = (7×2 − 4×3)/1 = (14−12)/1 = 2. y = (2×4 − 1×7)/1 = (8−7)/1 = 1.",
      board: {
        type: "worked_example",
        data: {
          expression: "2x+3y=7, x+2y=4",
          steps: [
            "a₁=2, b₁=3, c₁=7, a₂=1, b₂=2, c₂=4",
            "D = 2×2 − 1×3 = 4−3 = 1",
            "x = (c₁b₂ − c₂b₁)/D = (7×2 − 4×3)/1 = (14−12)/1 = 2",
            "y = (a₁c₂ − a₂c₁)/D = (2×4 − 1×7)/1 = (8−7)/1 = 1",
            "Solution: x=2, y=1",
          ],
          answer: 2,
          assetPath: "/math-svgs/level_5/VM_L5_4_SIMULTANEOUS_EQ/two-line-intersection-board.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Once you label the 6 numbers correctly, the formulas are mechanical. The speed comes from knowing the pattern cold.",
        mistakeTip: "Label carefully: a₁,b₁,c₁ from first equation; a₂,b₂,c₂ from second. Do not mix them.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Solve: x + y = 5, 2x − y = 4. Find D first.",
      board: {
        type: "practice_board",
        data: {
          expression: "x+y=5, 2x−y=4",
          prompt: "a₁=1,b₁=1,c₁=5, a₂=2,b₂=−1,c₂=4. D = 1×(−1) − 2×1 = ?",
          assetPath: "/math-svgs/level_5/VM_L5_4_SIMULTANEOUS_EQ/substitution-flow-lane.svg",
        },
      },
      explanation: { title: "Steps", body: "D=−1−2=−3. x=(5×−1−4×1)/(−3)=(−5−4)/(−3)=3. y=(1×4−2×5)/(−3)=(4−10)/(−3)=2." },
      practice: {
        mode: "numeric",
        prompt: "What is x in the system: x+y=5, 2x−y=4?",
        answer: 3,
        hints: [
          "D = 1×(−1) − 2×1 = −3",
          "x = (5×−1 − 4×1)/(−3) = (−5−4)/(−3) = 3",
          "Quick check: add the two equations to get 3x = 9, so x = 3",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Solve: 3x + 2y = 8, x − y = 1.",
      board: {
        type: "practice_board",
        data: {
          expression: "3x+2y=8, x−y=1",
          prompt: "Apply the cross-multiply formula. D = 3×(−1) − 1×2 = −5.",
          assetPath: "/math-svgs/level_5/VM_L5_4_SIMULTANEOUS_EQ/solution-point-highlight.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What is x?",
        answer: 2,
        hints: [
          "D = 3×(−1) − 1×2 = −5",
          "x = (8×−1 − 1×2)/(−5) = (−8−2)/(−5) = 2",
          "Quick check: x−y=1 gives y=1 when x=2, and 3×2 + 2×1 = 8",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "The Vedic simultaneous equations formula is elegant and fast. Once you label the coefficients, both x and y drop out of the same denominator.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "x = (c₁b₂−c₂b₁)/D  |  y = (a₁c₂−a₂c₁)/D  where D = a₁b₂−a₂b₁.",
          remember: [
            "Label 6 numbers: a₁,b₁,c₁ and a₂,b₂,c₂",
            "Compute D = a₁b₂ − a₂b₁",
            "Compute x and y numerators by cross-multiplication",
          ],
          example: "2x+3y=7, x+2y=4 → x=2, y=1",
          assetPath: "/math-svgs/level_5/VM_L5_4_SIMULTANEOUS_EQ/equation-pair-panel.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Mixing up the numerator formulas for x and y. Write the formula once, label the numbers, then substitute systematically.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Double-fraction speed! Solve these 6 simultaneous equations by cross-multiplying the coefficients. 50 XP reward!",
      board: {
        type: "practice_board",
        data: {
          headline: "Simultaneous Equation Sprint",
          prompt: "x = (b₁c₂−b₂c₁)/D. D = a₁b₂−a₂b₁.",
          assetPath: "/math-svgs/level_5/VM_L5_4_SIMULTANEOUS_EQ/equation-pair-panel.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "x in: x+y=5, 2x-y=4", answer: 3, hints: ["D = -3. x = (5×-1 - 4×1)/(-3) = 3."] },
          { prompt: "y in: x+y=5, 2x-y=4", answer: 2, hints: ["x=3, so 3+y=5 -> y=2."] },
          { prompt: "x in: 3x+y=10, x+y=4", answer: 3, hints: ["2x=6 -> x=3."] },
          { prompt: "y in: 3x+y=10, x+y=4", answer: 1, hints: ["3+y=4 -> y=1."] },
          { prompt: "x in: x+y=4, x-y=2", answer: 3, hints: ["2x=6 -> x=3."] },
          { prompt: "y in: x+y=4, x-y=2", answer: 1, hints: ["3+y=4 -> y=1."] },
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
  nextLessonUrl: "/mindsutra/course/level-5/lesson/VM_L5_5",
};

// ─── VM_L5_5 — Criss-Cross 4-Digit Multiplication ────────────────────────────

export const VM_L5_5_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_5", levelId: "L5", levelSlug: "level-5", title: "Vedic Maths Level 5" },
  lesson: {
    id: "VM_L5_5", order: 5, title: "Criss-Cross 4-Digit Multiplication",
    sutra: "Urdhva-Tiryagbhyam full",
    objective: "Multiply any two 4-digit numbers in 7 column steps using the extended criss-cross grid.",
    durationMin: 35, difficulty: 5, xpReward: 60,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "The ultimate Urdhva-Tiryagbhyam challenge: 4-digit multiplication in 7 columns. The same pattern you used at 2 and 3 digits now extends cleanly to 7 columns.",
      board: {
        type: "intro_card",
        data: {
          headline: "4-Digit × 4-Digit in 7 Columns",
          example: "1234 × 1111",
          goal: "Seven column products, carry left, read the full 8-digit answer.",
          assetPath: "/math-svgs/level_5/VM_L5_5_CRISS_CROSS_4DIG/criss-cross-4digit-frame.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the 7 columns", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Write numbers as ABCD and EFGH. 7 columns from right: D×H | C×H+D×G | B×H+C×G+D×F | A×H+B×G+C×F+D×E | A×G+B×F+C×E | A×F+B×E | A×E.",
      board: {
        type: "criss_cross",
        data: {
          expression: "ABCD × EFGH",
          columns: [
            { label: "C7", product: "A×E" },
            { label: "C6", product: "A×F + B×E" },
            { label: "C5", product: "A×G + B×F + C×E" },
            { label: "C4", product: "A×H + B×G + C×F + D×E" },
            { label: "C3", product: "B×H + C×G + D×F" },
            { label: "C2", product: "C×H + D×G" },
            { label: "C1", product: "D×H" },
          ],
          assetPath: "/math-svgs/level_5/VM_L5_5_CRISS_CROSS_4DIG/diagonal-arrow-set-4digit.svg",
        },
      },
      explanation: {
        title: "Middle column has 4 terms",
        body: "Column 4 (middle) has FOUR cross-products. This is the most complex step. Set them all out before summing.",
        mistakeTip: "For 4-digit × 4-digit, the middle column always has 4 terms. List all four before adding.",
      },
      actions: [{ id: "next", label: "Walk me through 1234 × 1111", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "1234 × 1111. All digits of 1111 are 1. C1:4×1=4. C2:3×1+4×1=7. C3:2×1+3×1+4×1=9. C4:1×1+2×1+3×1+4×1=10 → write 0 carry 1. C5:1×1+2×1+3×1+1=7. C6:1×1+2×1=3. C7:1. Answer: 1370974.",
      board: {
        type: "worked_example",
        data: {
          expression: "1234 × 1111",
          steps: [
            "C1: 4×1 = 4",
            "C2: 3×1 + 4×1 = 7",
            "C3: 2×1 + 3×1 + 4×1 = 9",
            "C4: 1×1 + 2×1 + 3×1 + 4×1 = 10 → write 0, carry 1",
            "C5: 1×1 + 2×1 + 3×1 + carry 1 = 7",
            "C6: 1×1 + 2×1 = 3",
            "C7: 1×1 = 1",
            "Answer: 1370974",
          ],
          answer: 1370974,
          assetPath: "/math-svgs/level_5/VM_L5_5_CRISS_CROSS_4DIG/full-urdhva-board.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "C4 has 4 cross-products. Always write all 4 out before summing to avoid errors.",
        mistakeTip: "Students miss one of the 4 middle terms. Write them as a separate list: A×H, B×G, C×F, D×E.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 1112 × 1111. Use the 7-column structure.",
      board: {
        type: "practice_board",
        data: {
          expression: "1112 × 1111",
          prompt: "All multipliers are 1 — first identify the middle band before you read the full answer.",
          assetPath: "/math-svgs/level_5/VM_L5_5_CRISS_CROSS_4DIG/answer-slot-series-7.svg",
        },
      },
      explanation: { title: "Steps", body: "C1:2, C2:1+2=3, C3:1+1+2=4, C4:1+1+1+2=5, C5:1+1+1=3, C6:1+1=2, C7:1. Answer: 1235432." },
      practice: {
        mode: "mcq",
        prompt: "What is the middle band value C4 for 1112 × 1111?",
        answer: 5,
        options: ["4", "5", "6", "8"],
        hints: [
          "C4 = 1+1+1+2 = 5 (no carry)",
          "Once C4 is fixed, the full answer reads 1,2,3,5,4,3,2 → 1235432",
        ],
        remediation: {
          prompt: "Small step first: how many terms are there in the middle band for a 4-digit criss-cross problem?",
          answer: 4,
          options: ["2", "3", "4", "5"],
          hints: [
            "The pattern grows as 1, 2, 3, 4, 3, 2, 1",
            "The middle band is the widest band",
            "So the middle band always has 4 terms",
          ],
        },
        challenge: {
          prompt: "Transfer check: after C4 = 5, what full answer do you read for 1112 × 1111?",
          answer: 1235432,
          options: ["1234532", "1235432", "1235542", "1245432"],
          hints: [
            "Read the bands from left to right after reversing the right-to-left totals",
            "The band totals are 2, 3, 4, 5, 3, 2, 1 from right",
            "So the answer becomes 1, 2, 3, 5, 4, 3, 2",
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
      tutorText: "Try 2222 × 1111. Every column sum will be larger — watch for carries.",
      board: {
        type: "practice_board",
        data: {
          expression: "2222 × 1111",
          prompt: "All digits 2 and 1. C4 = 2+4+6+8 = 20? No: 2×1+2×1+2×1+2×1=8.",
          assetPath: "/math-svgs/level_5/VM_L5_5_CRISS_CROSS_4DIG/four-digit-carry-lane.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 2222 × 1111",
        answer: 2468642,
        hints: [
          "C1:2, C2:4, C3:6, C4:8, C5:6, C6:4, C7:2",
          "No carries since all sums ≤ 9",
          "Answer: 2468642",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "You have mastered the full Urdhva-Tiryagbhyam from 2 to 4 digits. This is one of the most complete mental arithmetic skills in Vedic mathematics.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "7 columns: D×H | C×H+D×G | … | A×E. Middle column has 4 terms.",
          remember: [
            "One column at a time from right to left",
            "Middle column (C4) has 4 cross-products — list all before summing",
            "Carry any 2-digit column sum left",
          ],
          example: "1234 × 1111 = 1370974",
          assetPath: "/math-svgs/level_5/VM_L5_5_CRISS_CROSS_4DIG/criss-cross-4digit-frame.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Missing one of the four middle terms. Set them all out on paper before adding: A×H, B×G, C×F, D×E.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "The 7-Column Challenge! Solve these 4-digit multiplications by summing the cross-products. Most terms are simple! 60 XP reward.",
      board: {
        type: "practice_board",
        data: {
          headline: "Criss-Cross 4D Master Test",
          prompt: "Seven slots. Stay focused on the carries!",
          assetPath: "/math-svgs/level_5/VM_L5_5_CRISS_CROSS_4DIG/criss-cross-4digit-frame.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "1111 × 1111", answer: 1234321, hints: ["1, 2, 3, 4, 3, 2, 1"] },
          { prompt: "1000 × 2000", answer: 2000000, hints: ["Simple alignment"] },
          { prompt: "1112 × 1111", answer: 1235432, hints: ["C4=5"] },
          { prompt: "2222 × 1111", answer: 2468642, hints: ["1,2,3,4 * 2"] },
          { prompt: "1234 × 1111", answer: 1370974, hints: ["Columns give 4,7,9,0,7,3,1 from right to left, so the answer is 1370974."] },
          { prompt: "1001 × 1001", answer: 1002001, hints: ["1002001"] },
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
  nextLessonUrl: "/mindsutra/course/level-5/lesson/VM_L5_6",
};

// ─── VM_L5_6 — Percentage Speed Arithmetic ───────────────────────────────────

export const VM_L5_6_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_5", levelId: "L5", levelSlug: "level-5", title: "Vedic Maths Level 5" },
  lesson: {
    id: "VM_L5_6", order: 6, title: "Percentage Speed Arithmetic",
    sutra: "Anurupyena percent decomposition",
    objective: "Calculate any percentage mentally by decomposing into 10%, 5%, 1% building blocks.",
    durationMin: 20, difficulty: 3, xpReward: 45,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Percentage calculations appear everywhere — discounts, interest, data interpretation. The Anurupyena decomposition method breaks any percentage into simple pieces you can add mentally.",
      board: {
        type: "intro_card",
        data: {
          headline: "Any Percentage in Seconds",
          example: "17.5% of 480",
          goal: "Decompose: 10% + 5% + 2.5% of 480.",
          assetPath: "/math-svgs/level_5/VM_L5_6_PERCENTAGE_SPEED/percent-flow-lane.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the building blocks", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Building blocks: 10% = ÷10. 5% = half of 10%. 1% = ÷100. 25% = ÷4. 50% = ÷2. Any percentage = a combination of these. 17.5% = 10% + 5% + 2.5%.",
      board: {
        type: "place_value_split",
        data: {
          blocks: [
            "10% of N = N ÷ 10",
            "5% of N = (10% of N) ÷ 2",
            "1% of N = N ÷ 100",
            "25% = N ÷ 4",
            "50% = N ÷ 2",
          ],
          assetPath: "/math-svgs/level_5/VM_L5_6_PERCENTAGE_SPEED/percentage-strip-10-5-1.svg",
        },
      },
      explanation: {
        title: "Decompose and add",
        body: "Any percentage can be expressed as a sum of building blocks. 23% = 20% + 3% = 2×10% + 3×1%.",
        mistakeTip: "Compute each block separately before adding. Do not try to combine them in one step.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "17.5% of 480. 10% of 480 = 48. 5% = 48÷2 = 24. 2.5% = 24÷2 = 12. Total: 48+24+12 = 84.",
      board: {
        type: "worked_example",
        data: {
          expression: "17.5% of 480",
          steps: [
            "10% of 480 = 48",
            "5% of 480 = 48 ÷ 2 = 24",
            "2.5% of 480 = 24 ÷ 2 = 12",
            "17.5% = 10% + 5% + 2.5% = 48 + 24 + 12 = 84",
          ],
          answer: 84,
          assetPath: "/math-svgs/level_5/VM_L5_6_PERCENTAGE_SPEED/base-percent-card.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Each block is trivially computed (halving or dividing by 10). The total is just a short addition.",
        mistakeTip: "2.5% is half of 5%, not half of 10%. Build down the chain correctly.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Find 15% of 360. Decompose into 10% + 5%.",
      board: {
        type: "practice_board",
        data: {
          expression: "15% of 360",
          prompt: "10% = 36. 5% = 18. Add them.",
          assetPath: "/math-svgs/level_5/VM_L5_6_PERCENTAGE_SPEED/percent-split-board.svg",
        },
      },
      explanation: { title: "Steps", body: "10% = 36. 5% = 18. 15% = 54." },
      practice: {
        mode: "numeric",
        prompt: "15% of 360 = ?",
        answer: 54,
        hints: [
          "10% of 360 = 36",
          "5% of 360 = 36÷2 = 18",
          "15% = 36+18 = 54",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Find 22% of 450. Decompose: 20% + 2%.",
      board: {
        type: "practice_board",
        data: {
          expression: "22% of 450",
          prompt: "20% = 2×10% = 90. 2% = 2×1% = 9. Add.",
          assetPath: "/math-svgs/level_5/VM_L5_6_PERCENTAGE_SPEED/discount-gain-panel.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "22% of 450 = ?",
        answer: 99,
        hints: [
          "10% of 450 = 45, so 20% = 90",
          "1% of 450 = 4.5, so 2% = 9",
          "22% = 90+9 = 99",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Percentage speed arithmetic is an everyday competitive exam skill. Decompose into 10%, 5%, 1% blocks and add — any percentage in under 5 seconds.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Any % = sum of 10%, 5%, 1% building blocks.",
          remember: [
            "10% = divide by 10",
            "5% = half of 10%",
            "1% = divide by 100",
            "Add the blocks",
          ],
          example: "17.5% of 480 = 48+24+12 = 84",
          assetPath: "/math-svgs/level_5/VM_L5_6_PERCENTAGE_SPEED/percentage-strip-10-5-1.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Computing 5% as 5 × (1% of N) instead of half of 10%. The halving approach is faster and less error-prone.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Percentage components! Calculate these 6 values by decomposing into 10%, 5%, and 1% blocks. 45 XP reward!",
      board: {
        type: "practice_board",
        data: {
          headline: "Decomposition Speed Drill",
          prompt: "Divide by 10, halve, add segments.",
          assetPath: "/math-svgs/level_5/VM_L5_6_PERCENTAGE_SPEED/percentage-strip-10-5-1.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "15% of 360", answer: 54, hints: ["36 + 18"] },
          { prompt: "22% of 450", answer: 99, hints: ["90 + 9"] },
          { prompt: "17.5% of 480", answer: 84, hints: ["48 + 24 + 12"] },
          { prompt: "25% of 800", answer: 200, hints: ["800 / 4"] },
          { prompt: "10% of 1230", answer: 123, hints: ["1230 / 10 = 123"] },
          { prompt: "1% of 5000", answer: 50, hints: ["5000 / 100"] },
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
  nextLessonUrl: "/mindsutra/course/level-5/lesson/VM_L5_7",
};

// ─── VM_L5_7 — Nikhilam — Multiply Near 10000 ────────────────────────────────

export const VM_L5_7_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_5", levelId: "L5", levelSlug: "level-5", title: "Vedic Maths Level 5" },
  lesson: {
    id: "VM_L5_7", order: 7, title: "Nikhilam — Multiply Near 10000",
    sutra: "Nikhilam Navatashcaramam Dashatah",
    objective: "Multiply two 4-digit numbers both close to 10000 using Nikhilam with 4-digit right-side products.",
    durationMin: 30, difficulty: 5, xpReward: 60,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "The Nikhilam family is complete at base 10000. Numbers like 9998, 9995, 10003 multiply in two steps — no long multiplication needed.",
      board: {
        type: "intro_card",
        data: {
          headline: "Nikhilam Near 10000 — 4-Digit Deviations",
          example: "9998 × 9995",
          goal: "Left = cross-sum. Right = d₁×d₂ as 4 digits.",
          assetPath: "/math-svgs/level_5/VM_L5_7_NIKHILAM_LARGE/large-base-multiplication-board.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the method", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Base = 10000. d₁ = n₁ − 10000, d₂ = n₂ − 10000. Left = n₁ + d₂. Right = d₁ × d₂ as 4 digits. Answer = Left × 10000 + Right.",
      board: {
        type: "complement_bar",
        data: {
          base: 10000,
          rule: "Same as Nikhilam for 100 and 1000. Right = 4 digits.",
          example: "9998×9995: d₁=−2, d₂=−5. Left=9998−5=9993. Right=2×5=10→0010. Answer: 99930010.",
          assetPath: "/math-svgs/level_5/VM_L5_7_NIKHILAM_LARGE/nikhilam-base-line-10000.svg",
        },
      },
      explanation: {
        title: "4-digit right side",
        body: "For base 10000, right side must have 4 digits. Product 10 → 0010. Product 6 → 0006.",
        mistakeTip: "Pad to 4 digits. Never use fewer than 4 digits on the right side for base 10000.",
      },
      actions: [{ id: "next", label: "Show me a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "9997 × 9994. d₁=−3, d₂=−6. Left=9997−6=9991. Right=3×6=18→0018. Answer: 99910018.",
      board: {
        type: "worked_example",
        data: {
          expression: "9997 × 9994",
          steps: [
            "Base = 10000",
            "d₁ = 9997−10000 = −3, d₂ = 9994−10000 = −6",
            "Left = 9997 + (−6) = 9991",
            "Right = (−3)×(−6) = 18 → pad to 0018",
            "Answer: 99910018",
          ],
          answer: 99910018,
          assetPath: "/math-svgs/level_5/VM_L5_7_NIKHILAM_LARGE/four-digit-deficit-tag.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "Identical structure to Nikhilam near 100 and 1000. Only the number of right-side digits changes.",
        mistakeTip: "Right side must be 4 digits. 18 → 0018, not 18.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Try 9999 × 9996. Deviations: −1 and −4.",
      board: {
        type: "practice_board",
        data: {
          expression: "9999 × 9996",
          prompt: "Left = 9999−4. Right = 1×4 = 0004.",
          assetPath: "/math-svgs/level_5/VM_L5_7_NIKHILAM_LARGE/left-right-answer-split-4digit.svg",
        },
      },
      explanation: { title: "Steps", body: "Left=9995. Right=4→0004. Answer: 99950004." },
      practice: {
        mode: "numeric",
        prompt: "Solve: 9999 × 9996",
        answer: 99950004,
        hints: [
          "d₁=−1, d₂=−4",
          "Left = 9999−4 = 9995",
          "Right = 4 → 0004 → Answer: 99950004",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Try 10002 × 10003. Positive deviations — left side will exceed 10000.",
      board: {
        type: "practice_board",
        data: {
          expression: "10002 × 10003",
          prompt: "d₁=+2, d₂=+3. Left=10002+3. Right=6→0006.",
          assetPath: "/math-svgs/level_5/VM_L5_7_NIKHILAM_LARGE/near-10000-cross-board.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 10002 × 10003",
        answer: 100050006,
        hints: [
          "d₁=+2, d₂=+3",
          "Left = 10002+3 = 10005",
          "Right = 2×3=6 → 0006 → Answer: 100050006",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Nikhilam near 10000 completes the full suite. With bases 10, 100, 1000, and 10000, you can handle mental multiplication across the entire range of exam numbers.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Base 10000: Left = cross-sum. Right = d₁×d₂ as 4 digits.",
          remember: [
            "Deviations can be negative (below 10000) or positive (above 10000)",
            "Right side always 4 digits for base 10000",
            "Left side can exceed 10000 if deviations are positive",
          ],
          example: "9997×9994 = 9991|0018 = 99910018",
          assetPath: "/math-svgs/level_5/VM_L5_7_NIKHILAM_LARGE/large-base-multiplication-board.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Padding with 3 digits instead of 4. For base 10000, ALWAYS write 4 digits on the right.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Base 10000 Giant Sprint! Solve these 6 multiplications near 10000 using निखिलम. Watch the 4-digit padding! 60 XP reward.",
      board: {
        type: "practice_board",
        data: {
          headline: "Nikhilam 10k Speed Drill",
          prompt: "Left = cross sum. Right = 4-digit product.",
          assetPath: "/math-svgs/level_5/VM_L5_7_NIKHILAM_LARGE/large-base-multiplication-board.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "9998 × 9995", answer: 99930010, hints: ["9993 | 0010"] },
          { prompt: "9997 × 9994", answer: 99910018, hints: ["9991 | 0018"] },
          { prompt: "9999 × 9996", answer: 99950004, hints: ["9995 | 0004"] },
          { prompt: "10002 × 10003", answer: 100050006, hints: ["10005 | 0006"] },
          { prompt: "9995 × 9995", answer: 99900025, hints: ["9990 | 0025"] },
          { prompt: "10001 × 10001", answer: 100020001, hints: ["10002 | 0001"] },
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
  nextLessonUrl: "/mindsutra/course/level-5/lesson/VM_L5_8",
};

// ─── VM_L5_8 — Divisibility Rules — Advanced (7, 11, 13) ─────────────────────

export const VM_L5_8_LESSON: MindSutraLessonPayload = {
  product: { id: "mindsutra", name: "MindSutra" },
  course: { id: "ms_level_5", levelId: "L5", levelSlug: "level-5", title: "Vedic Maths Level 5" },
  lesson: {
    id: "VM_L5_8", order: 8, title: "Divisibility Rules — Advanced (7, 11, 13)",
    sutra: "Ekadhikena / Ekanyuna",
    objective: "Test divisibility by 7, 11, and 13 using Vedic digit manipulation without division.",
    durationMin: 25, difficulty: 4, xpReward: 55,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Divisibility by 2, 3, 5 is easy. But 7, 11, and 13 seem impossible to test without dividing. Vedic methods give you clean digit-based tests for all three.",
      board: {
        type: "intro_card",
        data: {
          headline: "Divisibility Tests — 7, 11, 13",
          example: "Is 1001 divisible by 7? By 11? By 13?",
          goal: "Apply Vedic digit tests — no division needed.",
          assetPath: "/math-svgs/level_5/VM_L5_8_DIVISIBILITY_ADVANCED/divisibility-decision-box.svg",
        },
      },
      actions: [{ id: "next", label: "Show me the tests", primary: true }],
    },
    {
      id: "concept", label: "Concept",
      tutorText: "Rule for 11: alternating sum of digits. If divisible by 11, alternating sum is 0 or multiple of 11. Rule for 7: double the last digit, subtract from the rest; repeat. Rule for 13: multiply last digit by 4, add to the rest; repeat.",
      board: {
        type: "sutra_rule",
        data: {
          rules: [
            "÷11: Alternating sum (odd positions − even positions). If = 0 or ÷11 → yes.",
            "÷7: Remove last digit, subtract 2× last from rest. Repeat until small. If result ÷7 → yes.",
            "÷13: Remove last digit, add 4× last to rest. Repeat. If result ÷13 → yes.",
          ],
          assetPath: "/math-svgs/level_5/VM_L5_8_DIVISIBILITY_ADVANCED/divisibility-rule-card-11.svg",
        },
      },
      explanation: {
        title: "Why these work",
        body: "Each rule exploits the modular arithmetic of the prime. 10 ≡ −1 (mod 11), giving the alternating sum. 10 ≡ 3 (mod 7), related to the doubling trick.",
        mistakeTip: "For the ÷7 test, subtract 2× the LAST digit from the number WITHOUT the last digit.",
      },
      actions: [{ id: "next", label: "Walk me through 1001", primary: true }],
    },
    {
      id: "worked_example", label: "Worked Example",
      tutorText: "Is 1001 divisible by 7? Step: 100 − 2×1 = 98. Is 98 ÷7? 98 = 7×14. Yes! Also: 1001 ÷ 7 = 143. ✓",
      board: {
        type: "worked_example",
        data: {
          expression: "1001 ÷ 7?",
          steps: [
            "Last digit = 1. Rest = 100.",
            "100 − 2×1 = 98",
            "Is 98 divisible by 7? 98 = 7×14 → YES",
            "Therefore 1001 is divisible by 7",
          ],
          answer: "Yes, 1001 ÷ 7 = 143",
          assetPath: "/math-svgs/level_5/VM_L5_8_DIVISIBILITY_ADVANCED/divisibility-rule-card-7.svg",
        },
      },
      explanation: {
        title: "Bonus: 1001 = 7 × 11 × 13",
        body: "1001 is a famous number in divisibility — it is divisible by 7, 11, AND 13. This is why 3-digit repeating patterns in 6-digit numbers are always divisible by all three.",
        mistakeTip: "The ÷7 test may need 2–3 iterations before the result is small enough to check by inspection.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "guided_practice", label: "Guided Practice",
      tutorText: "Test 132 for divisibility by 11. Apply the alternating sum rule.",
      board: {
        type: "practice_board",
        data: {
          expression: "132 ÷ 11?",
          prompt: "Alternating sum: 1 − 3 + 2 = ?",
          assetPath: "/math-svgs/level_5/VM_L5_8_DIVISIBILITY_ADVANCED/repeat-until-small-board.svg",
        },
      },
      explanation: { title: "Steps", body: "1−3+2=0. 0 is divisible by 11. Yes: 132÷11=12." },
      practice: {
        mode: "numeric",
        prompt: "Alternating sum of digits of 132 = ?",
        answer: 0,
        hints: [
          "Digits: 1, 3, 2",
          "Alternating: 1 − 3 + 2 = 0",
          "0 is divisible by 11 → 132 is divisible by 11",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" },
      ],
    },
    {
      id: "challenge", label: "Challenge",
      tutorText: "Test 286 for divisibility by 13. Use the multiply-by-4 method.",
      board: {
        type: "practice_board",
        data: {
          expression: "286 ÷ 13?",
          prompt: "Last digit 6. 4×6=24. 28+24=52. Is 52 ÷ 13?",
          assetPath: "/math-svgs/level_5/VM_L5_8_DIVISIBILITY_ADVANCED/divisibility-rule-card-13.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "What is 28 + 4×6?",
        answer: 52,
        hints: [
          "Last digit = 6. Rest = 28.",
          "4×6 = 24",
          "28 + 24 = 52 = 4×13 → 286 is divisible by 13 ✓",
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" },
      ],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Congratulations — you have completed all 5 levels of MindSutra! You now hold the full Vedic mathematics toolkit from fast addition all the way to advanced divisibility and simultaneous equations.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "÷11: alternating sum. ÷7: subtract 2×last. ÷13: add 4×last.",
          remember: [
            "÷11: sum odd-position digits − sum even-position digits = 0 or multiple of 11",
            "÷7: remove last digit, subtract 2× from rest, repeat",
            "÷13: remove last digit, add 4× to rest, repeat",
          ],
          example: "1001 is divisible by 7, 11, and 13",
          assetPath: "/math-svgs/level_5/VM_L5_8_DIVISIBILITY_ADVANCED/divisibility-decision-box.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Applying the ÷11 alternating sum in the wrong order. Start from the LEFT: odd-position digits (1st, 3rd, 5th…) minus even-position digits (2nd, 4th…).",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" },
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "The Divisibility Finale! Test these 6 numbers for divisibility by 7, 11, and 13. Answer '1' for Yes, '0' for No. Master Mindsutra with 55 XP!",
      board: {
        type: "practice_board",
        data: {
          headline: "Advanced Divisibility Master Test",
          prompt: "Use Vedic digit rules - no long division!",
          assetPath: "/math-svgs/level_5/VM_L5_8_DIVISIBILITY_ADVANCED/divisibility-decision-box.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "Is 132 divisible by 11?", answer: 1, hints: ["1-3+2 = 0. Yes."] },
          { prompt: "Is 1001 divisible by 7?", answer: 1, hints: ["100 - 2 = 98. Yes."] },
          { prompt: "Is 286 divisible by 13?", answer: 1, hints: ["28 + 24 = 52. Yes."] },
          { prompt: "Is 121 divisible by 11?", answer: 1, hints: ["1-2+1 = 0. Yes."] },
          { prompt: "Is 75 divisible by 7?", answer: 0, hints: ["7 - 2x5 = -3. -3 is not divisible by 7, so no."] },
          { prompt: "Is 170 divisible by 13?", answer: 0, hints: ["17 + 4x0 = 17. 17 is not divisible by 13, so no."] },
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
  nextLessonUrl: undefined,
};
