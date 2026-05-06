import type { VidyaLessonStep } from "./vidyaLessonTypes";

/**
 * Reusable pedagogical assets for generating Vidya AI Tutor lesson steps instantly.
 * This ensures consistency across all 8 levels and reduces code duplication.
 */

// ─── 1. THE HOOK (INTRO CARD) ────────────────────────────────────────────────
export function buildIntroHook(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  headline: string;
  emoji: string;
  example: string;
  goal: string;
}): VidyaLessonStep {
  return {
    id: params.id || "intro",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "intro_card",
      data: {
        headline: params.headline,
        emoji: params.emoji,
        example: params.example,
        goal: params.goal,
      },
    },
    actions: [{ id: "next", label: "Show me how", primary: true }],
  };
}

// ─── 2. THE THEORY (CONCEPT CARD) ───────────────────────────────────────────
export function buildConceptCard(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  title: string;
  emoji: string;
  points: string[];
  explanationTitle?: string;
  explanationBody?: string;
}): VidyaLessonStep {
  return {
    id: params.id || "concept",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "concept_card",
      data: {
        title: params.title,
        emoji: params.emoji,
        points: params.points,
      },
    },
    ...(params.explanationTitle && params.explanationBody
      ? {
          explanation: {
            title: params.explanationTitle,
            body: params.explanationBody,
          },
        }
      : {}),
    actions: [{ id: "next", label: "See the code", primary: true }],
  };
}

// ─── 3. THE PROOF (CODE WALKTHROUGH) ────────────────────────────────────────
export function buildCodeWalkthrough(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  expression: string;
  codeSteps: string[];
  result: string;
}): VidyaLessonStep {
  return {
    id: params.id || "worked_example",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "code_walkthrough",
      data: {
        expression: params.expression,
        steps: params.codeSteps,
        result: params.result,
      },
    },
    actions: [{ id: "next", label: "Concept Check", primary: true }],
  };
}

// ─── 4. THE QUIZ (MULTIPLE CHOICE CONCEPT CHECK) ────────────────────────────
export function buildConceptCheck(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  headline: string;
  question: string;
  answer: string;
  hints: string[];
}): VidyaLessonStep {
  return {
    id: params.id || "practice_concept",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "practice_board",
      data: {
        headline: params.headline,
        prompt: params.question,
      },
    },
    practice: {
      mode: "multiple_choice",
      prompt: params.question,
      answer: params.answer,
      hints: params.hints,
    },
    actions: [{ id: "next", label: "Enter Sandbox", primary: true }],
  };
}

// ─── 5. THE SANDBOX (PYTHON REPL CHALLENGE) ─────────────────────────────────
export function buildPythonChallenge(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  boardTitle: string;
  prompt: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
}): VidyaLessonStep {
  return {
    id: params.id || "challenge",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "python_repl_simulator",
      data: { title: params.boardTitle },
    },
    practice: {
      mode: "code_snippet",
      prompt: params.prompt,
      starterCode: params.starterCode,
      answer: params.solutionCode,
      hints: params.hints,
    },
    actions: [{ id: "next", label: "Complete Lesson", primary: true }],
  };
}

// ─── 6. THE GRADUATION (RECAP & BADGE REWARD) ───────────────────────────────
export function buildRecapSummary(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  title: string;
  keyPoints: string[];
  badgeReward?: string;
}): VidyaLessonStep {
  return {
    id: params.id || "recap",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "recap_summary",
      data: {
        title: params.title,
        keyPoints: params.keyPoints,
        ...(params.badgeReward ? { badgeAwarded: params.badgeReward } : {}),
      },
    },
    actions: [{ id: "finish", label: "Return to Path", primary: true }],
  };
}

// ─── 7. THE OUTPUT PREDICTION (WHAT DOES THIS CODE DO?) ──────────────────────
export function buildOutputPrediction(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  headline: string;
  codeSnippet: string;
  expectedOutput: string;
  hints: string[];
}): VidyaLessonStep {
  return {
    id: params.id || "output_prediction",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "practice_board",
      data: {
        headline: params.headline,
        prompt: `What will be printed to the console?\n\n\`\`\`python\n${params.codeSnippet}\n\`\`\``,
      },
    },
    practice: {
      mode: "output_prediction",
      prompt: "Type the exact console output.",
      answer: params.expectedOutput,
      hints: params.hints,
    },
    actions: [{ id: "next", label: "Continue", primary: true }],
  };
}

// ─── 8. THE BUG HUNT (FIX THE BROKEN CODE) ───────────────────────────────────
export function buildBugHunt(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  boardTitle: string;
  prompt: string;
  brokenCode: string;
  solutionCode: string;
  hints: string[];
}): VidyaLessonStep {
  return {
    id: params.id || "bug_hunt",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "python_repl_simulator",
      data: { title: params.boardTitle },
    },
    practice: {
      mode: "bug_hunt",
      prompt: params.prompt,
      starterCode: params.brokenCode,
      answer: params.solutionCode,
      hints: params.hints,
    },
    actions: [{ id: "next", label: "Continue", primary: true }],
  };
}

// ─── 9. THE INTERVIEW QUESTION (SYSTEM DESIGN / THEORY) ──────────────────────
export function buildInterviewQuestion(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  headline: string;
  question: string;
  keywordsRequired: string[];
  hints: string[];
}): VidyaLessonStep {
  return {
    id: params.id || "interview_question",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "practice_board",
      data: {
        headline: params.headline,
        prompt: params.question,
      },
    },
    practice: {
      mode: "interview_question",
      prompt: "Write your answer in your own words.",
      answer: params.keywordsRequired.join(","), // UI will validate against keywords
      hints: params.hints,
    },
    actions: [{ id: "next", label: "Continue", primary: true }],
  };
}
