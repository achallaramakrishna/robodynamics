import {
  MINDSUTRA_LEVELS,
  getMsLesson,
  getMsLevel,
  type MsLesson,
  type MsLevel,
} from "./mindsutraCatalog";
import type {
  MindSutraCourseLesson,
  MindSutraCoursePayload,
  MindSutraLessonStatus,
  MindSutraSelectedLesson,
} from "./mindsutraCourseTypes";
import type { MindSutraLessonPayload } from "./mindsutraLessonTypes";
import type { AppSession } from "./appSession";
import { VM_L1_1_LESSON } from "./mindsutraLessonVmL11";
import {
  VM_L1_2_LESSON,
  VM_L1_3_LESSON,
  VM_L1_4_LESSON,
  VM_L1_5_LESSON,
  VM_L1_6_LESSON,
  VM_L1_7_LESSON,
  VM_L1_8_LESSON,
} from "./mindsutraLessonsL1Rest";
import {
  VM_L2_1_LESSON,
  VM_L2_2_LESSON,
  VM_L2_3_LESSON,
  VM_L2_4_LESSON,
  VM_L2_5_LESSON,
  VM_L2_6_LESSON,
  VM_L2_7_LESSON,
  VM_L2_8_LESSON,
} from "./mindsutraLessonsL2";
import {
  VM_L3_1_LESSON,
  VM_L3_2_LESSON,
  VM_L3_3_LESSON,
  VM_L3_4_LESSON,
  VM_L3_5_LESSON,
  VM_L3_6_LESSON,
  VM_L3_7_LESSON,
  VM_L3_8_LESSON,
} from "./mindsutraLessonsL3";
import {
  VM_L4_1_LESSON,
  VM_L4_2_LESSON,
  VM_L4_3_LESSON,
  VM_L4_4_LESSON,
  VM_L4_5_LESSON,
  VM_L4_6_LESSON,
  VM_L4_7_LESSON,
  VM_L4_8_LESSON,
} from "./mindsutraLessonsL4";
import {
  VM_L5_1_LESSON,
  VM_L5_2_LESSON,
  VM_L5_3_LESSON,
  VM_L5_4_LESSON,
  VM_L5_5_LESSON,
  VM_L5_6_LESSON,
  VM_L5_7_LESSON,
  VM_L5_8_LESSON,
} from "./mindsutraLessonsL5";

const COURSE_PREVIEW_ASSET_VERSION = "20260514-svg-refresh";

function toLevelSlug(levelId: string): string {
  return `level-${levelId.replace(/^L/i, "")}`;
}

function toCourseId(levelId: string): string {
  return `ms_level_${levelId.replace(/^L/i, "")}`;
}

function levelBySlug(levelSlug: string): MsLevel | undefined {
  return MINDSUTRA_LEVELS.find((level) => toLevelSlug(level.id) === levelSlug);
}

function inferStatus(level: MsLevel, lesson: MsLesson): MindSutraLessonStatus {
  const index = level.lessons.findIndex((item) => item.id === lesson.id);
  if (index < 0) return "locked";
  if (index === 0) return "current";
  if (index === 1 || lesson.freePreview) return "available";
  return "locked";
}

function lessonXpReward(lessonId: string): number {
  return buildMindSutraLessonPayload(lessonId)?.lesson.xpReward ?? 25;
}

function buildSummary(lesson: MsLesson): string {
  return `Learn ${lesson.skill.toLowerCase()} using ${lesson.sutra}.`;
}

function buildOutcomes(lesson: MsLesson): string[] {
  return [
    `Understand the ${lesson.sutra} pattern behind ${lesson.title.toLowerCase()}.`,
    `Use ${lesson.skill.toLowerCase()} in mental maths practice.`,
    `Build confidence with Level ${lesson.difficulty} Vedic shortcuts.`,
  ];
}

function buildBoardPreview(lesson: MsLesson): MindSutraSelectedLesson["boardPreview"] {
  const normalized = lesson.title.toLowerCase();
  if (normalized.includes("addition")) {
    return {
      type: "complement_bar",
      data: {
        base: 100,
        number: 97,
        complement: 3,
        example: "97 + 29",
        assetPath: "/math-svgs/vedic/complement-bar-to-100.svg",
        assetSource: "docs/vedic_math_assets/grade_4/VM_G4_L1_FAST_ADDITION/complement-bar-to-100.svg",
      },
    };
  }
  if (normalized.includes("criss-cross")) {
    return {
      type: "criss_cross",
      data: {
        expression: "23 x 14",
        diagonals: ["2x4", "2x1 + 3x4", "3x1"],
        assetPath: "/math-svgs/vedic/criss-cross-2digit-frame.svg",
        assetSource: "docs/vedic_math_assets/grade_4/VM_G4_L8_CRISS_CROSS_2DIG/criss-cross-2digit-frame.svg",
      },
    };
  }
  if (normalized.includes("table")) {
    return {
      type: "number_bond",
      data: {
        pattern: "11 x 7 = 77",
        note: "same digit repeat pattern",
        assetPath: "/math-svgs/vedic/ekadhikena-pattern-card.svg",
        assetSource: "docs/vedic_math_assets/grade_4/VM_G4_L2_TABLES_11_TO_19/ekadhikena-pattern-card.svg",
      },
    };
  }
  return {
    type: "worked_example",
    data: {
      expression: lesson.title,
      note: lesson.skill,
      assetPath: "/math-svgs/vedic/part-whole-number-bond.svg",
      assetSource: "docs/vedic_math_assets/grade_4/VM_G4_L1_FAST_ADDITION/part-whole-number-bond.svg",
    },
  };
}

function buildCourseBoardPreview(lessonId: string, lesson: MsLesson): MindSutraCourseLesson["boardPreview"] {
  // Use the real lesson payload's intro step SVG for an accurate preview
  const payload = buildMindSutraLessonPayload(lessonId);
  const introStep = payload?.steps.find((s) => s.id === "intro") ?? payload?.steps[0];
  const rawAssetPath = introStep && typeof introStep.board.data.assetPath === "string"
    ? introStep.board.data.assetPath
    : null;
  const assetPath = rawAssetPath
    ? `${rawAssetPath}${rawAssetPath.includes("?") ? "&" : "?"}v=${COURSE_PREVIEW_ASSET_VERSION}`
    : null;
  if (assetPath) {
    return {
      type: "worked_example",
      data: { assetPath, expression: introStep?.board.data.expression ?? lesson.title, note: lesson.skill },
    };
  }
  // Fallback: keyword-based preview
  return buildBoardPreview(lesson);
}

function buildCourseLesson(
  level: MsLevel,
  lesson: MsLesson,
  order: number,
  status?: MindSutraLessonStatus,
): MindSutraCourseLesson {
  return {
    id: lesson.id,
    order,
    title: lesson.title,
    sutra: lesson.sutra,
    durationMin: lesson.durationMin,
    difficulty: lesson.difficulty,
    freePreview: lesson.freePreview,
    status: status ?? inferStatus(level, lesson),
    summary: buildSummary(lesson),
    skills: [lesson.skill, `${lesson.sutra} application`],
    boardPreview: buildCourseBoardPreview(lesson.id, lesson),
  };
}

export function buildMindSutraCoursePayload(
  levelSlug: string,
  selectedLessonId?: string,
  session?: AppSession | null,
): MindSutraCoursePayload {
  const level = levelBySlug(levelSlug) ?? MINDSUTRA_LEVELS[0];
  const completedSet = new Set(
    (session?.completedLessonIds ?? []).filter((lessonId) => level.lessons.some((lesson) => lesson.id === lessonId)),
  );
  const firstIncompleteIndex = level.lessons.findIndex((lesson) => !completedSet.has(lesson.id));
  const currentIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : Math.max(level.lessons.length - 1, 0);
  const currentLessonId = level.lessons[currentIndex]?.id ?? level.lessons[0]?.id;
  const lessons = level.lessons.map((lesson, index) => {
    let status = inferStatus(level, lesson);
    if (session) {
      if (completedSet.has(lesson.id)) {
        status = "completed";
      } else if (index === currentIndex) {
        status = "current";
      } else if (index === currentIndex + 1 || lesson.freePreview) {
        status = "available";
      } else {
        status = "locked";
      }
    }
    return buildCourseLesson(level, lesson, index + 1, status);
  });
  const completedLessons = completedSet.size;
  const earnedXp = level.lessons
    .filter((lesson) => completedSet.has(lesson.id))
    .reduce((sum, lesson) => sum + lessonXpReward(lesson.id), 0);
  const totalXpAvailable = level.lessons.reduce((sum, lesson) => sum + lessonXpReward(lesson.id), 0);
  const selected = lessons.find((lesson) => lesson.id === selectedLessonId)
    ?? lessons.find((lesson) => lesson.status === "current")
    ?? lessons[0];
  const selectedLessonRaw = level.lessons.find((lesson) => lesson.id === selected.id) ?? level.lessons[0];

  return {
    product: {
      id: "mindsutra",
      name: "MindSutra",
    },
    course: {
      id: toCourseId(level.id),
      levelId: level.id,
      levelSlug: toLevelSlug(level.id),
      title: `Vedic Maths ${level.id.replace(/^L/, "Level ")}`,
      subtitle: level.name,
      tagline: level.tagline,
      color: level.color,
      totalLessons: lessons.length,
      completedLessons,
      currentLessonId,
      progressPct: lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0,
      earnedXp,
      totalXpAvailable,
      streak: session?.streak ?? Math.floor((session?.xp ?? 0) / 500) % 7,
      achievements: [
        ...(completedLessons >= 1 ? [{ icon: "⭐", label: "Early Starter" }] : []),
        ...(completedLessons >= 5 ? [{ icon: "💎", label: "Math Magician" }] : []),
        ...(earnedXp >= 200 ? [{ icon: "🏆", label: "XP Collector" }] : []),
      ],
    },
    lessons,
    selectedLesson: {
      id: selected.id,
      title: selected.title,
      sutra: selected.sutra,
      durationMin: selected.durationMin,
      difficulty: selected.difficulty,
      status: selected.status,
      summary: selected.summary,
      outcomes: buildOutcomes(selectedLessonRaw),
      boardPreview: buildCourseBoardPreview(selected.id, selectedLessonRaw),
      startUrl: `/mindsutra/course/${toLevelSlug(level.id)}/lesson/${selected.id}`,
      resumeUrl: selected.status === "completed" || selected.status === "current"
        ? `/mindsutra/course/${toLevelSlug(level.id)}/lesson/${selected.id}?resume=1`
        : undefined,
    },
  };
}

function buildGenericLessonPayload(lessonId: string): MindSutraLessonPayload | null {
  const lesson = getMsLesson(lessonId);
  if (!lesson) return null;
  const level = getMsLevel(lesson.levelId);
  if (!level) return null;
  const lessonIndex = level.lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = lessonIndex >= 0 && lessonIndex + 1 < level.lessons.length ? level.lessons[lessonIndex + 1] : undefined;

  return {
    product: { id: "mindsutra", name: "MindSutra" },
    course: {
      id: toCourseId(level.id),
      levelId: level.id,
      levelSlug: toLevelSlug(level.id),
      title: `Vedic Maths ${level.id.replace(/^L/, "Level ")}`,
    },
    lesson: {
      id: lesson.id,
      order: lessonIndex + 1,
      title: lesson.title,
      sutra: lesson.sutra,
      objective: `Practice ${lesson.skill.toLowerCase()} with a guided MindSutra flow.`,
      durationMin: lesson.durationMin,
      difficulty: lesson.difficulty,
      xpReward: Math.max(20, Math.round(level.xpOnComplete / level.lessons.length)),
    },
    progress: { currentStepIndex: 0, totalSteps: 4 },
    steps: [
      {
        id: "intro",
        label: "Intro",
        tutorText: `Welcome to ${lesson.title}. We will take the core ${lesson.sutra} idea and use it in a simple, board-first lesson.`,
        board: {
          type: "intro_card",
          data: {
            headline: lesson.title,
            sutra: lesson.sutra,
            goal: lesson.skill,
          },
        },
        actions: [{ id: "next", label: "Start lesson", primary: true }],
      },
      {
        id: "concept",
        label: "Concept",
        tutorText: `The key idea here is ${lesson.skill.toLowerCase()}. First understand the pattern, then use it with confidence.`,
        board: {
          type: "sutra_rule",
          data: {
            sutra: lesson.sutra,
            rule: lesson.skill,
          },
        },
        explanation: {
          title: "Core rule",
          body: `This lesson focuses on ${lesson.skill.toLowerCase()} using the ${lesson.sutra} approach.`,
        },
        actions: [{ id: "next", label: "Show example", primary: true }],
      },
      {
        id: "practice",
        label: "Practice",
        tutorText: "Try one guided question. If needed, you can ask for a simpler explanation or another method.",
        board: {
          type: "practice_board",
          data: {
            prompt: lesson.title,
            note: lesson.skill,
          },
        },
        practice: {
          mode: "numeric",
          prompt: `Practice ${lesson.title} with one guided example.`,
          hints: [
            `Start with the ${lesson.sutra} pattern.`,
            `Apply ${lesson.skill.toLowerCase()} step by step.`,
          ],
        },
        actions: [
          { id: "hint", label: "Need a hint?" },
          { id: "next", label: "Continue", primary: true },
        ],
      },
      {
        id: "recap",
        label: "Recap",
        tutorText: `Good work. You completed the core flow for ${lesson.title}. Keep this one rule in mind and use it repeatedly for speed.`,
        board: {
          type: "recap_summary",
          data: {
            takeaway: lesson.skill,
            sutra: lesson.sutra,
          },
        },
        actions: [
          { id: "finish", label: "Finish lesson", primary: true },
          ...(nextLesson ? [{ id: "next_lesson", label: `Go to ${nextLesson.id}` }] : []),
        ],
      },
    ],
    helpActions: [
      { id: "stuck", label: "I'm stuck" },
      { id: "explain_again", label: "Explain again" },
      { id: "another_method", label: "Show another method" },
    ],
    nextLessonUrl: nextLesson ? `/mindsutra/course/${toLevelSlug(level.id)}/lesson/${nextLesson.id}` : undefined,
  };
}

const LESSON_MAP: Record<string, MindSutraLessonPayload> = {
  // Level 1
  VM_L1_1: VM_L1_1_LESSON,
  VM_L1_2: VM_L1_2_LESSON,
  VM_L1_3: VM_L1_3_LESSON,
  VM_L1_4: VM_L1_4_LESSON,
  VM_L1_5: VM_L1_5_LESSON,
  VM_L1_6: VM_L1_6_LESSON,
  VM_L1_7: VM_L1_7_LESSON,
  VM_L1_8: VM_L1_8_LESSON,
  // Level 2
  VM_L2_1: VM_L2_1_LESSON,
  VM_L2_2: VM_L2_2_LESSON,
  VM_L2_3: VM_L2_3_LESSON,
  VM_L2_4: VM_L2_4_LESSON,
  VM_L2_5: VM_L2_5_LESSON,
  VM_L2_6: VM_L2_6_LESSON,
  VM_L2_7: VM_L2_7_LESSON,
  VM_L2_8: VM_L2_8_LESSON,
  // Level 3
  VM_L3_1: VM_L3_1_LESSON,
  VM_L3_2: VM_L3_2_LESSON,
  VM_L3_3: VM_L3_3_LESSON,
  VM_L3_4: VM_L3_4_LESSON,
  VM_L3_5: VM_L3_5_LESSON,
  VM_L3_6: VM_L3_6_LESSON,
  VM_L3_7: VM_L3_7_LESSON,
  VM_L3_8: VM_L3_8_LESSON,
  // Level 4
  VM_L4_1: VM_L4_1_LESSON,
  VM_L4_2: VM_L4_2_LESSON,
  VM_L4_3: VM_L4_3_LESSON,
  VM_L4_4: VM_L4_4_LESSON,
  VM_L4_5: VM_L4_5_LESSON,
  VM_L4_6: VM_L4_6_LESSON,
  VM_L4_7: VM_L4_7_LESSON,
  VM_L4_8: VM_L4_8_LESSON,
  // Level 5
  VM_L5_1: VM_L5_1_LESSON,
  VM_L5_2: VM_L5_2_LESSON,
  VM_L5_3: VM_L5_3_LESSON,
  VM_L5_4: VM_L5_4_LESSON,
  VM_L5_5: VM_L5_5_LESSON,
  VM_L5_6: VM_L5_6_LESSON,
  VM_L5_7: VM_L5_7_LESSON,
  VM_L5_8: VM_L5_8_LESSON,
};

function cloneLessonPayload(payload: MindSutraLessonPayload): MindSutraLessonPayload {
  return JSON.parse(JSON.stringify(payload)) as MindSutraLessonPayload;
}

const SUPPORT_TAG_BY_LESSON: Record<string, MindSutraLessonPayload["lesson"]["supportTag"]> = {
  VM_L2_1: "Core",
  VM_L2_2: "Practice-heavy",
  VM_L2_3: "Stretch",
  VM_L2_4: "Practice-heavy",
  VM_L2_5: "Core",
  VM_L2_6: "Core",
  VM_L2_7: "Core",
  VM_L2_8: "Stretch",
  VM_L3_1: "Core",
  VM_L3_2: "Core",
  VM_L3_3: "Practice-heavy",
  VM_L3_4: "Core",
  VM_L3_5: "Practice-heavy",
  VM_L3_6: "Practice-heavy",
  VM_L3_7: "Stretch",
  VM_L3_8: "Stretch",
  VM_L4_1: "Core",
  VM_L4_2: "Core",
  VM_L4_3: "Core",
  VM_L4_4: "Practice-heavy",
  VM_L4_5: "Core",
  VM_L4_6: "Practice-heavy",
  VM_L4_7: "Practice-heavy",
  VM_L4_8: "Core",
  VM_L5_1: "Core",
  VM_L5_2: "Core",
  VM_L5_3: "Practice-heavy",
  VM_L5_4: "Practice-heavy",
  VM_L5_5: "Stretch",
  VM_L5_6: "Core",
  VM_L5_7: "Practice-heavy",
  VM_L5_8: "Practice-heavy",
};

function enrichLevel2LessonPayload(payload: MindSutraLessonPayload): MindSutraLessonPayload {
  const next = cloneLessonPayload(payload);
  next.lesson.supportTag ??= SUPPORT_TAG_BY_LESSON[next.lesson.id];

  if (next.lesson.id === "VM_L2_1") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Think of the answer as two windows. The left window shows the shared near-100 part, and the right window shows the tiny correction from the deviations.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "Base first, correction second. First decide the left part near 100, then attach the deviation product as the last two digits.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "You can cross-subtract the other way too: 97 - 6 = 91. That is a good self-check, because both left halves must match.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["nikhilam_near_100_multiplication", "deviation_padding_base_100"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 98 x 97 using the same near-100 method.",
        answer: 9506,
        hints: [
          "Deviations are -2 and -3",
          "Left: 98 - 3 = 95",
          "Right: 2 x 3 = 06",
        ],
        skillKeys: ["nikhilam_near_100_multiplication"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 102 x 97.",
        answer: 9894,
        hints: [
          "Deviations are +2 and -3",
          "Left: 102 - 3 = 99",
          "Right becomes -06, so borrow 1 from the left to get 9894",
        ],
        skillKeys: ["nikhilam_near_100_multiplication", "deviation_padding_base_100"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["nikhilam_near_100_multiplication"];
    }
  }

  if (next.lesson.id === "VM_L2_2") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "You are not changing the product, only reshaping it. One factor gets friendlier, and the other shrinks by the same proportion.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "A good mental shortcut is to ask: can I turn this into 1000 quickly? If yes, the remaining multiplier is usually tiny and the answer becomes immediate.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "Another route is to see 36 as 9 x 4. Once 250 becomes 1000, the rest collapses into 9 x 1000.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["proportional_scaling", "friendly_base_factorization"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 250 x 12 by scaling to 1000.",
        answer: 3000,
        hints: [
          "250 x 4 = 1000",
          "12 / 4 = 3",
          "3 x 1000 = 3000",
        ],
        skillKeys: ["proportional_scaling"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 125 x 56.",
        answer: 7000,
        hints: [
          "125 x 8 = 1000",
          "56 = 8 x 7",
          "So 125 x 56 = 1000 x 7 = 7000",
        ],
        skillKeys: ["proportional_scaling", "friendly_base_factorization"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["friendly_base_factorization"];
    }
  }

  if (next.lesson.id === "VM_L2_3") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "If the full five-column pattern feels heavy, think of it as a wave: 1 product, 2 products, 3 products, back to 2, then 1.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "A clean way to stay organized is to say each column aloud before adding it. Ones, two-cross, middle-three, two-cross, end.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "Build the answer from right to left. Lock one column before moving on, so the middle column does not overload your memory.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["criss_cross_3_digit", "column_carry_management"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 111 x 121 using the five-column pattern.",
        answer: 13431,
        hints: [
          "Columns go 1, 2, 3, 2, 1 terms",
          "Middle column is 1x1 + 1x2 + 1x1 = 4",
          "Answer: 13431",
        ],
        skillKeys: ["criss_cross_3_digit"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 123 x 111.",
        answer: 13653,
        hints: [
          "Ones 3, tens 5, hundreds 6, thousands 3, ten-thousands 1",
          "Keep the five-column rhythm steady",
        ],
        skillKeys: ["criss_cross_3_digit", "column_carry_management"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["criss_cross_3_digit", "column_carry_management"];
    }
  }

  if (next.lesson.id === "VM_L2_4") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Instead of long division, think of this as a running chain. Each new total becomes the next quotient digit, and the last total becomes the remainder.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "You can read this as a left-to-right story: bring one digit down, add the next digit, and keep passing the running total along.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "If the method feels abstract, write the running totals in a row underneath the digits so you can see the quotient forming step by step.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["division_by_9_running_remainder"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 122 / 9 with the running remainder method.",
        answer: 13,
        hints: [
          "Bring down 1",
          "1 + 2 = 3, so quotient is 13",
          "3 + 2 = 5, so remainder is 5",
        ],
        skillKeys: ["division_by_9_running_remainder"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 243 / 9.",
        answer: 27,
        hints: [
          "Bring down 2",
          "2 + 4 = 6",
          "6 + 3 = 9, so adjust to quotient 27 remainder 0",
        ],
        skillKeys: ["division_by_9_running_remainder"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["division_by_9_running_remainder"];
    }
  }

  if (next.lesson.id === "VM_L2_5") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Think of 50 as the anchor. The left side tells you how many full 50-blocks you have, and the right side is the square of the small distance from 50.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "This works because numbers near 50 can be rewritten as 50 plus or minus a small amount, and that small amount is easier to square than the full number.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "Split the job into two questions: what is the offset from 50, and what is that offset squared?";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["near_50_squaring"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 52^2 using the same anchor-base method.",
        answer: 2704,
        hints: [
          "Offset is +2",
          "Left: 25 + 2 = 27",
          "Right: 2^2 = 04",
        ],
        skillKeys: ["near_50_squaring"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 47^2.",
        answer: 2209,
        hints: [
          "Offset is -3",
          "Left: 25 - 3 = 22",
          "Right: 3^2 = 09",
        ],
        skillKeys: ["near_50_squaring"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["near_50_squaring"];
    }
  }

  if (next.lesson.id === "VM_L2_6") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Do not ask for the full HCF first. Ask a quicker question: what small number can I divide both by right now?";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "Simplifying fractions is often faster as repeated small cancellations than as one big HCF calculation.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "Look for obvious shared factors first, like 2, 3, 5, or 10. Once the numbers shrink, the final form becomes much easier to spot.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["fraction_reduction"];
      guided.practice.remediation = {
        prompt: "Checkpoint: simplify 18/24.",
        answer: "3/4",
        hints: [
          "Both are divisible by 6",
          "18 / 6 = 3",
          "24 / 6 = 4",
        ],
        skillKeys: ["fraction_reduction"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: simplify 42/56.",
        answer: "3/4",
        hints: [
          "Both are divisible by 14",
          "42 / 14 = 3",
          "56 / 14 = 4",
        ],
        skillKeys: ["fraction_reduction"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["fraction_reduction"];
    }
  }

  if (next.lesson.id === "VM_L2_7") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Treat the decimals like labels you temporarily remove. First solve the clean whole-number problem, then restore the decimal places at the end.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "The multiplication itself is ordinary. The only new skill is tracking how many decimal places the final answer must recover.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "A good safety check is to estimate first. If both decimals are small, the final answer should also stay small.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["decimal_place_tracking"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 0.4 x 0.3.",
        answer: 0.12,
        hints: [
          "4 x 3 = 12",
          "There are two decimal places in total",
          "So the answer is 0.12",
        ],
        skillKeys: ["decimal_place_tracking"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 2.4 x 0.5.",
        answer: 1.2,
        hints: [
          "24 x 5 = 120",
          "There are two decimal places in total",
          "So the answer is 1.20 = 1.2",
        ],
        skillKeys: ["decimal_place_tracking"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["decimal_place_tracking"];
    }
  }

  if (next.lesson.id === "VM_L2_8") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Think of each remainder as a tiny helper digit that walks forward and joins the next dividend digit before the next division step.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "Flag division feels easier when you see it as repeating the same one-digit division move three times in a row.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "At every stage, ask only one question: what is the largest quotient digit that fits right now?";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["flag_division"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 424 / 2 with the flag method.",
        answer: 212,
        hints: [
          "4 / 2 = 2",
          "2 / 2 = 1",
          "4 / 2 = 2",
        ],
        skillKeys: ["flag_division"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 864 / 4.",
        answer: 216,
        hints: [
          "8 / 4 = 2",
          "6 / 4 = 1 remainder 2, prefix it to the next digit",
          "24 / 4 = 6",
        ],
        skillKeys: ["flag_division"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["flag_division"];
    }
  }

  if (next.lesson.id === "VM_L3_1") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "A vinculum number is just the same value written with smaller digits. You trade a large digit on the right for a small barred digit and one extra on the left.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "A good self-check is to expand the barred digits back into subtraction. If the expanded value matches the original number, your conversion is correct.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "Focus only on the rightmost large digit first. Convert that one, pass the carry left, then check whether the next digit also needs conversion.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["vinculum_conversion"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is the tens digit in the vinculum form of 38?",
        answer: 4,
        hints: [
          "8 becomes 2-bar",
          "Carry 1 to the tens digit",
          "3 becomes 4",
        ],
        skillKeys: ["vinculum_conversion"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: what is the hundreds digit in the vinculum form of 298?",
        answer: 3,
        hints: [
          "8 becomes 2-bar, carry to 9",
          "9 becomes 1-bar with another carry",
          "2 becomes 3",
        ],
        skillKeys: ["vinculum_conversion"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["vinculum_conversion"];
    }
  }

  if (next.lesson.id === "VM_L3_2") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Separate the job into two parts: sign and size. First decide whether the answer is positive or negative, then multiply the absolute values normally.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "The fastest way to avoid mistakes is to say the sign rule aloud first, then compute the magnitude second.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "If negatives feel confusing, cover the signs with your finger, multiply the plain numbers, then reveal the signs and decide the final sign.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["integer_sign_rules"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is the sign of (-4) x (+7)?",
        answer: "negative",
        hints: [
          "Different signs give a negative result",
          "Ignore the size first and decide the sign only",
        ],
        skillKeys: ["integer_sign_rules"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve (-12) x (-5).",
        answer: 60,
        hints: [
          "Same signs give a positive result",
          "12 x 5 = 60",
        ],
        skillKeys: ["integer_sign_rules"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["integer_sign_rules"];
    }
  }

  if (next.lesson.id === "VM_L3_3") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "The base can change, but the structure does not. Find the deviations from the chosen base, build the left part, and then attach the right part with the correct number of digits for that base.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "Always ask: which base is this number close to? Once the base is clear, the rest of the method falls into place.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "First decide whether the base is 10, 100, or 1000. Then the right side must use exactly 1, 2, or 3 digits respectively.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["nikhilam_any_base"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 8 x 7 using base 10.",
        answer: 56,
        hints: [
          "Deviations are -2 and -3",
          "Left: 8 - 3 = 5",
          "Right: 2 x 3 = 6",
        ],
        skillKeys: ["nikhilam_any_base"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 996 x 997 using base 1000.",
        answer: 993012,
        hints: [
          "Deviations are -4 and -3",
          "Left: 996 - 3 = 993",
          "Right: 4 x 3 = 012",
        ],
        skillKeys: ["nikhilam_any_base"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["nikhilam_any_base"];
    }
  }

  if (next.lesson.id === "VM_L3_4") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "A ratio becomes simpler when you look for a shared shrink factor. Divide both sides by the same amount until the comparison is in its smallest clean form.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "If the full common factor is not obvious, start with any small common factor first. The ratio will keep simplifying.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "Look at both numbers and ask: what is the largest number I can pull out of both right now?";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["ratio_reduction"];
      guided.practice.remediation = {
        prompt: "Checkpoint: simplify 12:18.",
        answer: "2:3",
        hints: [
          "Both numbers are divisible by 6",
          "12 / 6 = 2 and 18 / 6 = 3",
        ],
        skillKeys: ["ratio_reduction"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: simplify 45:60.",
        answer: "3:4",
        hints: [
          "Both are divisible by 15",
          "45 / 15 = 3 and 60 / 15 = 4",
        ],
        skillKeys: ["ratio_reduction"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["ratio_reduction"];
    }
  }

  if (next.lesson.id === "VM_L3_5") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "For HCF, focus on what both numbers share. For LCM, focus on what is needed to cover both numbers completely. Shared pieces versus full coverage.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "Prime factors act like building blocks. HCF keeps only the common blocks, while LCM keeps every block needed by either number.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "A good rule is: HCF is the overlap, LCM is the union.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["hcf_lcm_structure"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is the HCF of 12 and 18?",
        answer: 6,
        hints: [
          "Common factors are 1, 2, 3, 6",
          "The largest common factor is 6",
        ],
        skillKeys: ["hcf_lcm_structure"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: what is the LCM of 12 and 18?",
        answer: 36,
        hints: [
          "Prime factors: 12 = 2^2 x 3 and 18 = 2 x 3^2",
          "Take the highest powers of each factor",
        ],
        skillKeys: ["hcf_lcm_structure"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["hcf_lcm_structure"];
    }
  }

  if (next.lesson.id === "VM_L3_6") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Duplex means pairing digits symmetrically. The rightmost square starts first, then the middle uses double-products, and the left collects the final square plus carry.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "This is like a compressed version of multiplication where the cross-terms are bundled into the middle step.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "Work from right to left and keep the carry visible. One clean carry chain is more important than going fast here.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["duplex_squaring"];
      guided.practice.remediation = {
        prompt: "Checkpoint: solve 12^2 with duplex.",
        answer: 144,
        hints: [
          "Right: 2^2 = 4",
          "Middle: 2 x 1 x 2 = 4",
          "Left: 1^2 = 1",
        ],
        skillKeys: ["duplex_squaring"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 23^2 with duplex.",
        answer: 529,
        hints: [
          "Right: 3^2 = 9",
          "Middle: 2 x 2 x 3 = 12, write 2 carry 1",
          "Left: 2^2 + 1 = 5",
        ],
        skillKeys: ["duplex_squaring"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["duplex_squaring"];
    }
  }

  if (next.lesson.id === "VM_L3_7") {
    next.lesson.objective =
      "Divide exactly by divisors like 11, 12, and 13 using one clean transpose-and-adjust pattern.";
    const intro = next.steps.find((step) => step.id === "intro");
    if (intro) {
      intro.tutorText =
        "Paravartya Yojayet means Transpose and Adjust. In this lesson we use one stable version of it for divisors like 11, 12, and 13, where the first digit is 1 and the second digit acts as the flag.";
      intro.board.data = {
        ...intro.board.data,
        example: "144 / 12",
        goal: "Bring down a quotient digit, adjust the next digit with the flag, and repeat.",
      };
    }
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept) {
      concept.tutorText =
        "For a divisor of the form 1x, the second digit is the flag. For 11 the flag is 1, for 12 it is 2, and for 13 it is 3. Bring down the first dividend digit as the first quotient digit. Then subtract q times the flag from the next dividend digit to make the next working digit.";
      concept.board.data = {
        ...concept.board.data,
        rule: "Bring down q. Then adjust forward: next working digit = next dividend digit - q x flag.",
      };
    }
    if (concept?.explanation) {
      concept.explanation.title = "One safe lesson boundary";
      concept.explanation.body =
        "This first-pass lesson covers exact divisions where the divisor is 11, 12, or 13. That keeps the method stable: one leading 1, one flag digit, and no messy correction step.";
      concept.explanation.mistakeTip =
        "Use this version only for divisors of the form 1x. More general divisors need a later extension.";
      concept.explanation.alternateExplanation ??=
        "Think of the flag as a small forward adjustment. Each quotient digit quietly reshapes the next working digit before you continue.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked) {
      worked.tutorText =
        "144 / 12. Flag = 2. Bring down 1 as the first quotient digit. Adjust the next digit: 4 - 1 x 2 = 2. Bring down 2 as the next quotient digit. Adjust the last digit: 4 - 2 x 2 = 0. So the quotient is 12 with remainder 0.";
      worked.board.data = {
        ...worked.board.data,
        expression: "144 / 12",
        steps: [
          "Divisor 12: flag = 2",
          "Bring down 1 as the first quotient digit",
          "Adjust forward: 4 - (1 x 2) = 2",
          "Bring down 2 as the second quotient digit",
          "Adjust last digit: 4 - (2 x 2) = 0",
          "Quotient: 12, Remainder: 0",
        ],
        answer: 12,
      };
    }
    if (worked?.explanation) {
      worked.explanation.title = "Stable first pattern";
      worked.explanation.body =
        "For exact examples like this, each new working digit becomes the next quotient digit immediately. That makes the method easy to see before handling harder cases.";
      worked.explanation.mistakeTip =
        "Always adjust the next digit using the quotient digit you just wrote, not the original dividend digit.";
      worked.explanation.alternateExplanation ??=
        "Another way to read the method is: quotient first, adjustment second. Each quotient digit is chosen before you touch the next dividend digit.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided) {
      guided.tutorText =
        "Try 132 / 11. Flag = 1, so each step subtracts the current quotient digit once from the next dividend digit.";
      guided.board.data = {
        ...guided.board.data,
        expression: "132 / 11",
        prompt: "Bring down 1. Then adjust: 3 - 1 x 1 = 2. What quotient do you get next?",
      };
    }
    if (guided?.explanation) {
      guided.explanation.title = "Steps";
      guided.explanation.body = "q1 = 1, working = 2. q2 = 2, adjust: 2 - 2 x 1 = 0. Remainder = 0. Quotient: 12.";
      guided.explanation.alternateExplanation ??=
        "Go one line at a time. Bring down one quotient digit, then build the next working digit. That rhythm matters more than speed here.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["paravartya_division"];
      guided.practice.remediation = {
        prompt: "Checkpoint: in 132 / 11, what is the first adjusted working digit after bringing down 1?",
        answer: 2,
        hints: [
          "Flag = 1",
          "After bringing down 1, compute 3 - 1 = 2",
        ],
        skillKeys: ["paravartya_division"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 169 / 13.",
        answer: 13,
        hints: [
          "Flag = 3. Bring down 1 first",
          "Then 6 - 1 x 3 = 3, and 9 - 3 x 3 = 0",
        ],
        skillKeys: ["paravartya_division"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge) {
      challenge.tutorText =
        "Try 169 / 13. Flag = 3. This is the same pattern, just with a larger flag.";
      challenge.board.data = {
        ...challenge.board.data,
        expression: "169 / 13",
        prompt: "Bring down 1. Then adjust: 6 - 1 x 3 = 3. What happens next?",
      };
    }
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["paravartya_division"];
      challenge.practice.prompt = "Solve: 169 / 13";
      challenge.practice.answer = 13;
      challenge.practice.hints = [
        "Flag = 3. Bring down 1 as the first quotient digit",
        "Adjust the next digit: 6 - 1 x 3 = 3",
        "Bring down 3 as the next quotient digit, then 9 - 3 x 3 = 0. Answer: 13",
      ];
    }
    const recap = next.steps.find((step) => step.id === "recap");
    if (recap) {
      recap.tutorText =
        "Paravartya becomes teachable when you start with one stable case: divisors like 11, 12, and 13. Bring down a quotient digit, adjust forward with the flag, and repeat.";
      recap.board.data = {
        ...recap.board.data,
        takeaway:
          "For divisors of the form 1x: use x as the flag. Bring down q, then adjust the next digit by subtracting q x flag.",
        remember: [
          "This lesson covers divisors 11, 12, and 13 cleanly",
          "The flag is the second digit of the divisor",
          "Each quotient digit creates the next working digit",
        ],
      };
    }
    if (recap?.explanation) {
      recap.explanation.title = "Common mistake to avoid";
      recap.explanation.body =
        "Mixing up the current quotient digit with the original dividend digit. The adjustment always uses the quotient digit you just wrote.";
    }
  }

  if (next.lesson.id === "VM_L3_8") {
    next.lesson.objective =
      "Solve additive equations by inspection when both sides reduce to the same linear sum.";
    const intro = next.steps.find((step) => step.id === "intro");
    if (intro) {
      intro.tutorText =
        "Sunyam Samyasamuccaye means: if the sums match, the sum becomes zero. In this lesson we use only the additive version, where both sides reduce to the same linear expression.";
      intro.board.data = {
        ...intro.board.data,
        goal: "When both sides reduce to the same linear sum, set that sum equal to zero.",
      };
    }
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept) {
      concept.tutorText =
        "This lesson covers one clear case: additive equations where both sides simplify to the same linear expression. If the left side and right side both become the same sum, set that shared sum equal to zero.";
      concept.board.data = {
        ...concept.board.data,
        sutra: "If both sides reduce to the same linear sum, set that shared sum = 0",
        example: "(x+3)+(x+5) and (x+4)+(x+4) both become 2x+8, so set 2x+8=0",
      };
    }
    if (concept?.explanation) {
      concept.explanation.title = "One lesson, one pattern";
      concept.explanation.body =
        "This first-pass lesson is only about equal additive sums. It is not trying to cover rational expressions or broader factor-pattern shortcuts at the same time.";
      concept.explanation.mistakeTip =
        "First simplify each side. Only apply the shortcut if both sides really reduce to the same linear expression.";
      concept.explanation.alternateExplanation ??=
        "Think of it as a balance trick. If both sides carry the same sum-shape, that shared sum is the one that must become zero.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked) {
      worked.tutorText =
        "Solve: (x+1) + (x+7) = (x+3) + (x+5). Left sum: 2x+8. Right sum: 2x+8. The same sum appears on both sides, so set 2x+8 = 0. That gives x = -4.";
    }
    if (worked?.explanation) {
      worked.explanation.title = "Shared additive sum";
      worked.explanation.body =
        "The shortcut works because both sides simplify to the same expression. Once that shared expression is visible, solving becomes immediate.";
      worked.explanation.mistakeTip =
        "Do not introduce a different equation type here. Stay with additive equal-sum examples and verify the same sum appears on both sides.";
      worked.explanation.alternateExplanation ??=
        "A quick mental check is to simplify the constants first. If both constant totals match and the x-count also matches, the shared sum is ready.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided) {
      guided.tutorText =
        "Solve: (x+2) + (x+8) = (x+4) + (x+6). First simplify each side and check whether the same sum appears.";
      guided.board.data = {
        ...guided.board.data,
        prompt: "Left side = 2x+10. Right side = 2x+10. What do you set equal to zero?",
      };
    }
    if (guided?.explanation) {
      guided.explanation.title = "Steps";
      guided.explanation.body = "Left: 2x+10. Right: 2x+10. The sums match, so set 2x+10 = 0 and solve x = -5.";
      guided.explanation.alternateExplanation ??=
        "Look for the same sum-shape on both sides before you do any solving. Once the shapes match, the equation collapses to one linear step.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["algebra_by_inspection"];
      guided.practice.remediation = {
        prompt: "Checkpoint: if both sides reduce to 2x + 8, what equation do you set equal to zero?",
        answer: "2x+8=0",
        hints: [
          "Same expression on both sides means set that shared expression to zero",
        ],
        skillKeys: ["algebra_by_inspection"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: if both sides reduce to 3x - 6, what is x?",
        answer: 2,
        hints: [
          "Set 3x - 6 = 0",
          "Then solve 3x = 6",
        ],
        skillKeys: ["algebra_by_inspection"],
      };
    }
    const challenge = next.steps.find((step) => step.id === "challenge");
    if (challenge) {
      challenge.tutorText =
        "Solve: (x+3) + (x+9) = (x+5) + (x+7). Keep it in the same equal-sum style: simplify both sides, then set the shared sum to zero.";
    }
    if (challenge?.practice) {
      challenge.practice.skillKeys = ["algebra_by_inspection"];
    }
    const recap = next.steps.find((step) => step.id === "recap");
    if (recap) {
      recap.tutorText =
        "This lesson teaches one specific Samuccaya pattern: additive equations where both sides reduce to the same sum. That is the version to master first.";
      recap.board.data = {
        ...recap.board.data,
        takeaway: "If both sides reduce to the same linear sum, set that shared sum = 0 and solve.",
      };
    }
  }

  return next;
}

function enrichLevel5LessonPayload(payload: MindSutraLessonPayload): MindSutraLessonPayload {
  const next = cloneLessonPayload(payload);
  next.lesson.supportTag ??= SUPPORT_TAG_BY_LESSON[next.lesson.id];

  if (next.lesson.id === "VM_L5_1") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Think of square-root inspection as a filter. The left pair narrows the tens digit, and the last digit chooses the finishing digit.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "Another route is to estimate the root first, then use the last-digit pattern only to decide between the close candidates.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["square_root_inspection"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what are the two possible ones digits for a square ending in 6?",
        answer: "4 or 6",
        hints: ["A square ending in 6 must come from a root ending in 4 or 6."],
        skillKeys: ["square_root_inspection"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve √3136.",
        answer: 56,
        hints: ["31 lies between 25 and 36, so tens digit is 5", "36 means the root ends in 4 or 6", "56² = 3136"],
        skillKeys: ["square_root_inspection"],
      };
    }
  }

  if (next.lesson.id === "VM_L5_2") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Cube roots are easier than square roots on the last digit, because the ones digit map is unique. Once you know the left triple and the last digit, the answer is fixed.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["cube_root_inspection"];
      guided.practice.remediation = {
        prompt: "Checkpoint: a perfect cube ending in 2 must come from which root ones digit?",
        answer: 8,
        hints: ["2 and 8 are a cube-root pair."],
        skillKeys: ["cube_root_inspection"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve ∛35937.",
        answer: 33,
        hints: ["Last digit 7 means root ends in 3", "Left triple 35 gives tens digit 3"],
        skillKeys: ["cube_root_inspection"],
      };
    }
  }

  if (next.lesson.id === "VM_L5_3") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "The 1-3-3-1 row is a fill-in frame. Once you know the powers of a and b and the sign pattern, you are placing terms into a ready-made skeleton.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["binomial_cube_expansion"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is the coefficient of the third term in (a + b)^3?",
        answer: 3,
        hints: ["The Pascal row is 1, 3, 3, 1."],
        skillKeys: ["binomial_cube_expansion"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: expand (x - 1)^3 and give the coefficient of x.",
        answer: 3,
        hints: ["(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3", "The x-term comes from 3ab^2."],
        skillKeys: ["binomial_cube_expansion"],
      };
    }
  }

  if (next.lesson.id === "VM_L5_4") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "A safe way to remember the formulas is to treat them like a determinant pattern: denominator from the coefficient cross-products, then each numerator swaps in the constants carefully.";
      concept.explanation.mistakeTip =
        "Use x = (c₁b₂ − c₂b₁) / D and y = (a₁c₂ − a₂c₁) / D with D = a₁b₂ − a₂b₁. Keep the order consistent.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "If the fractions feel abstract, quickly verify the result by substitution. A correct Vedic answer should satisfy both equations immediately.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.explanation) {
      guided.explanation.alternateExplanation ??=
        "You can always check the formula against elimination. If both methods agree, your coefficient order is right.";
    }
    if (guided?.practice) {
      guided.practice.skillKeys = ["simultaneous_equation_setup"];
      guided.practice.remediation = {
        prompt: "Checkpoint: for x + y = 5 and 2x - y = 4, what is D = a₁b₂ - a₂b₁?",
        answer: -3,
        hints: ["a₁=1, b₁=1, a₂=2, b₂=-1", "So D = 1×(-1) - 2×1 = -3"],
        skillKeys: ["simultaneous_equation_setup"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: in 2x + y = 9 and x - y = 3, what is x?",
        answer: 4,
        hints: ["Use elimination or the same cross-multiplication pattern", "Adding the equations gives 3x = 12"],
        skillKeys: ["simultaneous_equation_setup"],
      };
    }
  }

  if (next.lesson.id === "VM_L5_5") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "The seven-column pattern grows and shrinks symmetrically: 1 term, 2, 3, 4, then back to 3, 2, 1. That rhythm is often easier to remember than the full formula list.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "For 1234 × 1111, each column is just a running digit sum. That makes it a great self-check example before moving to denser numbers.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["criss_cross_4_digit"];
      guided.practice.remediation = {
        prompt: "Checkpoint: how many products appear in the middle column of a 4-digit criss-cross multiplication?",
        answer: 4,
        hints: ["The pattern grows to 4 terms in the center, then shrinks again."],
        skillKeys: ["criss_cross_4_digit"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 1001 × 1111.",
        answer: 1112111,
        hints: ["Use the seven-column structure", "This is a good carry-check example because the inner columns stay light"],
        skillKeys: ["criss_cross_4_digit"],
      };
    }
  }

  if (next.lesson.id === "VM_L5_6") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Percentages become easy when you decompose them into benchmark pieces like 10%, 5%, 2%, and 0.5%, then add the pieces back together.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["percentage_decomposition"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is 10% of 480?",
        answer: 48,
        hints: ["10% means divide by 10."],
        skillKeys: ["percentage_decomposition"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: what is 12.5% of 160?",
        answer: 20,
        hints: ["12.5% is 1/8", "160 ÷ 8 = 20"],
        skillKeys: ["percentage_decomposition"],
      };
    }
  }

  if (next.lesson.id === "VM_L5_7") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "This is exactly the same Nikhilam structure as base 100 and 1000. The only real upgrade is that the right side now needs four digits.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["nikhilam_near_10000"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what should the right side look like when the deviation product is 18 at base 10000?",
        answer: "0018",
        hints: ["Base 10000 means the right side always has four digits."],
        skillKeys: ["nikhilam_near_10000"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 9996 × 9998.",
        answer: 99940008,
        hints: ["Deviations are -4 and -2", "Left is 9994 and right is 0008"],
        skillKeys: ["nikhilam_near_10000"],
      };
    }
  }

  if (next.lesson.id === "VM_L5_8") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Each divisibility rule is a repeat-until-small process. You are not finishing the whole problem in one step, just shrinking it until the answer becomes obvious.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["advanced_divisibility_rules"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is the alternating sum for 121?",
        answer: 0,
        hints: ["1 - 2 + 1 = 0"],
        skillKeys: ["advanced_divisibility_rules"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: is 143 divisible by 11? Answer 1 for yes, 0 for no.",
        answer: 1,
        hints: ["1 - 4 + 3 = 0, so yes."],
        skillKeys: ["advanced_divisibility_rules"],
      };
    }
  }

  return next;
}

function enrichLevel4LessonPayload(payload: MindSutraLessonPayload): MindSutraLessonPayload {
  const next = cloneLessonPayload(payload);
  next.lesson.supportTag ??= SUPPORT_TAG_BY_LESSON[next.lesson.id];

  if (next.lesson.id === "VM_L4_1") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Think in two windows again: the left window is the base-adjusted number, and the right window is just the small deviation square padded to the base length.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["near_base_squaring_any_base"];
      guided.practice.remediation = {
        prompt: "Checkpoint: square 97 using base 100.",
        answer: 9409,
        hints: ["Deviation is -3", "Left is 97 - 3 = 94", "Right is 9 -> 09"],
        skillKeys: ["near_base_squaring_any_base"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: square 1002 using base 1000.",
        answer: 1004004,
        hints: ["Deviation is +2", "Left is 1004", "Right is 004"],
        skillKeys: ["near_base_squaring_any_base"],
      };
    }
  }

  if (next.lesson.id === "VM_L4_2") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "This is still common-denominator addition, just done in one jump. The denominator product bd is a ready-made common denominator, and then you simplify.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["rational_add_cross_multiply"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is the denominator of 2/5 + 1/3 before simplification?",
        answer: 15,
        hints: ["Multiply the denominators: 5 × 3 = 15"],
        skillKeys: ["rational_add_cross_multiply"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: what is the simplified numerator of 1/2 + 5/6?",
        answer: 4,
        hints: ["Cross-multiply to get 6/12 + 10/12 = 16/12", "Simplify 16/12 to 4/3"],
        skillKeys: ["rational_add_cross_multiply"],
      };
    }
  }

  if (next.lesson.id === "VM_L4_3") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "This shortcut is safest when the equation is already in Ax + B = Cx + D form. First normalize the equation, then use the one-fraction move.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["linear_equation_transposition"];
      guided.practice.remediation = {
        prompt: "Checkpoint: in 3x + 7 = x + 15, what is A - C?",
        answer: 2,
        hints: ["A = 3 and C = 1, so A - C = 2"],
        skillKeys: ["linear_equation_transposition"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 4x + 9 = x + 18.",
        answer: 3,
        hints: ["x = (18 - 9) / (4 - 1)", "So x = 9 / 3 = 3"],
        skillKeys: ["linear_equation_transposition"],
      };
    }
  }

  if (next.lesson.id === "VM_L4_4") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Treat the cube as four slots from the binomial identity: a³, 3a²b, 3ab², b³. Once the slots are filled, the only job left is carrying.";
    }
    const worked = next.steps.find((step) => step.id === "worked_example");
    if (worked?.explanation) {
      worked.explanation.alternateExplanation ??=
        "If the slot labels help more than the sutra name, that is fine. This lesson is really about placing the four terms in order and then carrying cleanly.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["cubic_slot_expansion"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is the second slot in 11^3?",
        answer: 3,
        hints: ["For 11^3, a = 1 and b = 1", "So 3a²b = 3"],
        skillKeys: ["cubic_slot_expansion"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 13^3.",
        answer: 2197,
        hints: ["Use slots 1 | 9 | 27 | 27", "Carry from right to left"],
        skillKeys: ["cubic_slot_expansion"],
      };
    }
  }

  if (next.lesson.id === "VM_L4_5") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "It is the same Nikhilam movie again, just with three digits on the right. The structure has not changed, only the padding length.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["nikhilam_near_1000"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what should the right side look like when the deviation product is 8 at base 1000?",
        answer: "008",
        hints: ["Base 1000 means the right side always has three digits."],
        skillKeys: ["nikhilam_near_1000"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: solve 1004 × 1006.",
        answer: 1010024,
        hints: ["Deviations are +4 and +6", "Left is 1010 and right is 024"],
        skillKeys: ["nikhilam_near_1000"],
      };
    }
  }

  if (next.lesson.id === "VM_L4_6") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Anchor powers are like mental bookmarks. Once you know one strong anchor, moving one step up or down is usually faster than recomputing.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["exponent_anchor_patterns"];
      guided.practice.remediation = {
        prompt: "Checkpoint: if 2^5 = 32, what is 2^6?",
        answer: 64,
        hints: ["Move one step up by multiplying by 2."],
        skillKeys: ["exponent_anchor_patterns"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: what is 2^9?",
        answer: 512,
        hints: ["Start from 2^8 = 256 and double once"],
        skillKeys: ["exponent_anchor_patterns"],
      };
    }
  }

  if (next.lesson.id === "VM_L4_7") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "The shortcut really comes from spotting the right triangle quickly. Once you know the two legs, the area is just half their product.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["triangle_area_triples"];
      guided.practice.remediation = {
        prompt: "Checkpoint: what is the area of a 3-4-5 right triangle?",
        answer: 6,
        hints: ["Area = 1/2 × 3 × 4"],
        skillKeys: ["triangle_area_triples"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: what is the area of a 9-12-15 right triangle?",
        answer: 54,
        hints: ["It is a scaled 3-4-5 triangle", "Area = 1/2 × 9 × 12"],
        skillKeys: ["triangle_area_triples"],
      };
    }
  }

  if (next.lesson.id === "VM_L4_8") {
    const concept = next.steps.find((step) => step.id === "concept");
    if (concept?.explanation) {
      concept.explanation.alternateExplanation ??=
        "Do not memorize all identities as separate formulas. First identify the shape: square of a sum, square of a difference, or product of a sum and difference.";
    }
    const guided = next.steps.find((step) => step.id === "guided_practice");
    if (guided?.practice) {
      guided.practice.skillKeys = ["algebraic_identity_expansion"];
      guided.practice.remediation = {
        prompt: "Checkpoint: in (a + b)^2, what is the middle term coefficient?",
        answer: 2,
        hints: ["(a + b)^2 = a^2 + 2ab + b^2"],
        skillKeys: ["algebraic_identity_expansion"],
      };
      guided.practice.challenge = {
        prompt: "Transfer check: expand (x + 4)(x - 4) and give the constant term.",
        answer: -16,
        hints: ["Use a^2 - b^2", "So x^2 - 16"],
        skillKeys: ["algebraic_identity_expansion"],
      };
    }
  }

  return next;
}

export function buildMindSutraLessonPayload(lessonId: string): MindSutraLessonPayload | null {
  if (lessonId in LESSON_MAP) {
    const payload = LESSON_MAP[lessonId];
    if (lessonId.startsWith("VM_L2_") || lessonId.startsWith("VM_L3_")) {
      return enrichLevel2LessonPayload(payload);
    }
    if (lessonId.startsWith("VM_L4_")) {
      return enrichLevel4LessonPayload(payload);
    }
    if (lessonId.startsWith("VM_L5_")) {
      return enrichLevel5LessonPayload(payload);
    }
    return payload;
  }
  return buildGenericLessonPayload(lessonId);
}
