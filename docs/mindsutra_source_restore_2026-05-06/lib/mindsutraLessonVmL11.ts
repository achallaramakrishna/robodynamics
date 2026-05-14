import type { MindSutraLessonPayload } from "./mindsutraLessonTypes";

export const VM_L1_1_LESSON: MindSutraLessonPayload = {
  product: {
    id: "mindsutra",
    name: "MindSutra",
  },
  course: {
    id: "ms_level_1",
    levelId: "L1",
    levelSlug: "level-1",
    title: "Vedic Maths Level 1",
  },
  lesson: {
    id: "VM_L1_1",
    order: 1,
    title: "Completing the Whole - Fast Addition",
    sutra: "Puranapuranabhyam",
    objective: "Use complements to make addition faster by completing to the next friendly base.",
    supportTag: "Core",
    durationMin: 20,
    difficulty: 1,
    xpReward: 25,
  },
  progress: {
    currentStepIndex: 0,
    totalSteps: 7,
  },
  steps: [
    {
      id: "intro",
      label: "Intro",
      tutorText: "Today we learn a very useful Vedic Maths idea. Instead of adding the hard way, we first complete a number to the next whole base like 10 or 100. Then the final addition becomes much easier.",
      board: {
        type: "intro_card",
        data: {
          headline: "Fast Addition by Completing the Whole",
          example: "97 + 5",
          goal: "Turn difficult addition into a friendly number first.",
          assetPath: "/math-svgs/vedic/l1_friendly_base_bridge.svg",
          assetSource: "ai-tutor/web/public/math-svgs/vedic/l1_friendly_base_bridge.svg",
        },
      },
      actions: [{ id: "next", label: "Let's begin", primary: true }],
    },
    {
      id: "concept",
      label: "Concept",
      tutorText: "If a number is very close to 100, we can first push it up to 100 by taking a small amount from the other number. We are only moving value, not changing the total.",
      board: {
        type: "complement_bar",
        data: {
          base: 100,
          number: 97,
          complement: 3,
          caption: "97 needs 3 more to become 100",
          assetPath: "/math-svgs/vedic/l1_complement_97_to_100.svg",
          assetSource: "ai-tutor/web/public/math-svgs/vedic/l1_complement_97_to_100.svg",
        },
      },
      explanation: {
        title: "Why this works",
        body: "We do not create or lose value. We simply move a small part from one addend to the other so one number becomes easier to use.",
        mistakeTip: "If you add 3 to 97, you must subtract 3 from the other number.",
        alternateExplanation: "Another way to think about it: make 100 first. Since 97 is only 3 away from 100, split 5 into 3 and 2. Then do 100 + 2.",
      },
      actions: [{ id: "next", label: "Show me an example", primary: true }],
    },
    {
      id: "worked_example",
      label: "Worked Example",
      tutorText: "Watch this carefully. In 97 + 5, we give 3 from 5 to 97. Then 97 becomes 100, and 5 becomes 2. Now the sum is easy: 100 + 2 = 102.",
      board: {
        type: "worked_example",
        data: {
          expression: "97 + 5",
          steps: [
            "97 needs 3 to become 100",
            "Take 3 from 5, so 5 becomes 2",
            "100 + 2 = 102"
          ],
          answer: 102,
          assetPath: "/math-svgs/vedic/l1_worked_97_plus_5.svg",
          assetSource: "ai-tutor/web/public/math-svgs/vedic/l1_worked_97_plus_5.svg",
        },
      },
      explanation: {
        title: "Key idea",
        body: "The shortcut works best when one number is close to a friendly base like 10, 100, or 1000.",
        mistakeTip: "Do not forget to reduce the second number after giving away the complement.",
        alternateExplanation: "Think of 5 as two parts: 3 and 2. Use the 3 to finish 97 and reach 100. The 2 is the part still left to add.",
      },
      actions: [
        { id: "next", label: "Let me try one", primary: true },
        { id: "repeat", label: "Explain again" }
      ],
    },
    {
      id: "guided_practice",
      label: "Guided Practice",
      tutorText: "Now you try 98 + 27 with my help. Think first: how much does 98 need to become 100?",
      board: {
        type: "practice_board",
        data: {
          expression: "98 + 27",
          prompt: "Complete 98 to 100 first.",
          assetPath: "/math-svgs/vedic/missing-part-blocks.svg",
          assetSource: "docs/vedic_math_assets/grade_4/VM_G4_L1_FAST_ADDITION/missing-part-blocks.svg",
        },
      },
      explanation: {
        title: "Think in two moves",
        body: "First complete the near-base number. Then add the remainder.",
        alternateExplanation: "You can also imagine a number bond: split 27 into 2 and 25. The 2 completes 98 to 100, and the 25 stays for the easy final step.",
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 98 + 27",
        answer: 125,
        skillKeys: ["complements_to_friendly_base", "number_bond_splitting"],
        hints: [
          "98 needs 2 to become 100",
          "Take 2 from 27, leaving 25",
          "Now add 100 + 25"
        ],
        remediation: {
          prompt: "Checkpoint: how much does 98 need to become 100?",
          answer: 2,
          skillKeys: ["complements_to_friendly_base"],
          hints: [
            "You are only filling the gap to 100",
            "100 - 98 = 2",
          ],
        },
        challenge: {
          prompt: "Bonus stretch: solve 99 + 47 by completing the whole.",
          answer: 146,
          skillKeys: ["complements_to_friendly_base", "number_bond_splitting"],
          hints: [
            "99 needs 1 to become 100",
            "Take 1 from 47, leaving 46",
            "100 + 46 = 146",
          ],
        },
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "hint", label: "Need a hint?" }
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      tutorText: "Good. Now try 96 + 38 with less help. Use the same shortcut and solve it mentally.",
      board: {
        type: "practice_board",
        data: {
          expression: "96 + 38",
          prompt: "Try this mentally before revealing steps.",
          assetPath: "/math-svgs/vedic/fill-gap-highlight.svg",
          assetSource: "ai-tutor/web/public/math-svgs/vedic/fill-gap-highlight.svg",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Solve: 96 + 38",
        answer: 134,
        skillKeys: ["complements_to_friendly_base", "number_bond_splitting"],
        hints: [
          "96 needs 4 to become 100",
          "38 minus 4 = 34",
          "100 + 34 = 134"
        ],
      },
      actions: [
        { id: "check", label: "Check answer", primary: true },
        { id: "show_steps", label: "See steps" }
      ],
    },
    {
      id: "recap",
      label: "Recap",
      tutorText: "Excellent. Today you learned how to complete a number to the next whole base and make addition simpler. This is one of the fastest ways to build strong mental maths foundations.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Complete the near-base number first.",
          remember: [
            "Find the complement",
            "Move that amount from the other number",
            "Add using the friendly base"
          ],
          example: "8 + 4 = 10 + 2 = 12",
          assetPath: "/math-svgs/vedic/l1_recap_make_10_8_plus_4.svg",
          assetSource: "ai-tutor/web/public/math-svgs/vedic/l1_recap_make_10_8_plus_4.svg",
        },
      },
      explanation: {
        title: "Common mistake to avoid",
        body: "Students often add the complement but forget to subtract it from the other number.",
        alternateExplanation: "For small numbers, say it like this: make 10 first. For bigger numbers, say: make 100 first. The move is the same in both cases.",
      },
      actions: [
        { id: "next", label: "Final Exercise", primary: true },
        { id: "repeat", label: "Explain again" }
      ],
    },
    {
      id: "exercise", label: "Practice Exercise",
      tutorText: "Ready for your first final challenge? Solve these 6 problems by completing the whole. 25 XP is waiting for you!",
      board: {
        type: "practice_board",
        data: {
          headline: "Completion Challenge",
          prompt: "Identify the complement, give it, then add.",
          assetPath: "/math-svgs/vedic/complete-the-whole-panel.svg",
        },
      },
      practice: {
        mode: "quiz",
        questions: [
          { prompt: "97 + 8", answer: 105, hints: ["97+3=100, 8-3=5"], skillKeys: ["complements_to_friendly_base", "number_bond_splitting"] },
          { prompt: "98 + 14", answer: 112, hints: ["98+2=100, 14-2=12"], skillKeys: ["complements_to_friendly_base", "number_bond_splitting"] },
          { prompt: "9 + 6", answer: 15, hints: ["9+1=10, 6-1=5"], skillKeys: ["complements_to_friendly_base", "number_bond_splitting"] },
          { prompt: "95 + 17", answer: 112, hints: ["95+5=100, 17-5=12"], skillKeys: ["complements_to_friendly_base", "number_bond_splitting"] },
          { prompt: "88 + 15", answer: 103, hints: ["88+12=100, 15-12=3"], skillKeys: ["complements_to_friendly_base", "number_bond_splitting"] },
          { prompt: "99 + 32", answer: 131, hints: ["99+1=100, 32-1=31"], skillKeys: ["complements_to_friendly_base", "number_bond_splitting"] },
        ]
      },
      actions: [
        { id: "check", label: "Check Answer", primary: true },
      ],
    }
  ],
  helpActions: [
    { id: "stuck", label: "I'm stuck" },
    { id: "explain_again", label: "Explain again" },
    { id: "another_method", label: "Show another method" }
  ],
  nextLessonUrl: "/mindsutra/course/level-1/lesson/VM_L1_2",
};

