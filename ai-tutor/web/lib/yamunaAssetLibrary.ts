import type { YamunaLessonStep } from "./yamunaLessonTypes";

/**
 * Reusable pedagogical step builders for Yamuna Java AI Tutor lessons.
 * Mirrors the Vidya asset library pattern — consistent across all 5 levels.
 */

// ─── 1. INTRO HOOK ────────────────────────────────────────────────────────────
export function buildIntroHook(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  headline: string;
  emoji: string;
  example: string;
  goal: string;
}): YamunaLessonStep {
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

// ─── 2. CONCEPT CARD ─────────────────────────────────────────────────────────
export function buildConceptCard(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  title: string;
  emoji: string;
  points: string[];
  explanationTitle?: string;
  explanationBody?: string;
}): YamunaLessonStep {
  return {
    id: params.id || "concept",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "concept_card",
      data: { title: params.title, emoji: params.emoji, points: params.points },
    },
    ...(params.explanationTitle && params.explanationBody
      ? { explanation: { title: params.explanationTitle, body: params.explanationBody } }
      : {}),
    actions: [{ id: "next", label: "See the code", primary: true }],
  };
}

// ─── 3. CODE WALKTHROUGH ─────────────────────────────────────────────────────
export function buildCodeWalkthrough(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  expression: string;
  codeSteps: string[];
  result: string;
}): YamunaLessonStep {
  return {
    id: params.id || "worked_example",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "code_walkthrough",
      data: {
        expression: params.expression,
        codeSteps: params.codeSteps,
        result: params.result,
        language: "java",
      },
    },
    actions: [{ id: "next", label: "I understand — quiz me!", primary: true }],
  };
}

// ─── 4a. CONCEPT CHECK (multiple choice) ────────────────────────────────────
export function buildConceptCheck(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  headline: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}): YamunaLessonStep {
  return {
    id: params.id || "concept_check",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "practice_board",
      data: {
        headline: params.headline,
        question: params.question,
        options: params.options,
        correctIndex: params.correctIndex,
        explanation: params.explanation,
      },
    },
    practice: {
      mode: "multiple_choice",
      prompt: params.question,
      answer: String(params.correctIndex),
      hints: [params.explanation],
    },
    actions: [{ id: "submit", label: "Lock in my answer", primary: true }],
  };
}

// ─── 4b. BUG HUNT ────────────────────────────────────────────────────────────
export function buildBugHunt(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  headline: string;
  buggyCode: string;
  fixedCode: string;
  explanation: string;
  hints: string[];
}): YamunaLessonStep {
  return {
    id: params.id || "bug_hunt",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "practice_board",
      data: {
        headline: params.headline,
        buggyCode: params.buggyCode,
        fixedCode: params.fixedCode,
        explanation: params.explanation,
        language: "java",
      },
    },
    practice: {
      mode: "bug_hunt",
      prompt: params.headline,
      starterCode: params.buggyCode,
      answer: params.fixedCode,
      hints: params.hints,
    },
    actions: [{ id: "submit", label: "I found the bug!", primary: true }],
  };
}

// ─── 4c. OUTPUT PREDICTION ───────────────────────────────────────────────────
export function buildOutputPrediction(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  headline: string;
  codeSnippet: string;
  expectedOutput: string;
  hints: string[];
}): YamunaLessonStep {
  return {
    id: params.id || "output_prediction",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "practice_board",
      data: {
        headline: params.headline,
        codeSnippet: params.codeSnippet,
        expectedOutput: params.expectedOutput,
        language: "java",
      },
    },
    practice: {
      mode: "output_prediction",
      prompt: params.headline,
      starterCode: params.codeSnippet,
      answer: params.expectedOutput,
      hints: params.hints,
    },
    actions: [{ id: "submit", label: "That is my prediction", primary: true }],
  };
}

// ─── 5. JAVA CHALLENGE (coding exercise) ─────────────────────────────────────
export function buildJavaChallenge(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  boardTitle: string;
  prompt: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  openEnded?: boolean;
}): YamunaLessonStep {
  return {
    id: params.id || "java_challenge",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "java_editor",
      data: {
        title: params.boardTitle,
        prompt: params.prompt,
        starterCode: params.starterCode,
        language: "java",
      },
    },
    practice: {
      mode: "code_snippet",
      prompt: params.prompt,
      starterCode: params.starterCode,
      answer: params.solutionCode,
      hints: params.hints,
      openEnded: params.openEnded ?? false,
    },
    actions: [{ id: "run", label: "Run my code ▶", primary: true }],
  };
}

// ─── 6. RECAP SUMMARY ────────────────────────────────────────────────────────
export function buildRecapSummary(params: {
  id?: string;
  stepLabel: string;
  tutorText: string;
  title: string;
  keyPoints: string[];
  badgeReward?: string;
  nextLesson?: string;
}): YamunaLessonStep {
  return {
    id: params.id || "recap",
    label: params.stepLabel,
    tutorText: params.tutorText,
    board: {
      type: "recap_summary",
      data: {
        title: params.title,
        keyPoints: params.keyPoints,
        badgeReward: params.badgeReward,
        nextLesson: params.nextLesson,
      },
    },
    actions: [
      { id: "complete", label: "Claim my XP 🏆", primary: true },
      { id: "next_lesson", label: "Next lesson →" },
    ],
  };
}
