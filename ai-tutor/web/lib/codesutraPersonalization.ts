import type { AppSession, SessionEnrollment, SessionRecentActivity, SessionSkillMastery } from "./appSession";

export type CodeSutraSupportMode = "guided" | "balanced" | "challenge";

type CodeSutraSkillDefinition = {
  key: string;
  label: string;
  category: "syntax" | "logic" | "data_structures" | "algorithms";
  lessonIds: string[];
};

const CODESUTRA_LEVEL1_SKILLS: CodeSutraSkillDefinition[] = [
  {
    key: "print_input_basics",
    label: "Print and Input basics",
    category: "syntax",
    lessonIds: ["PY_L1_01_SETUP"],
  },
  {
    key: "variable_type_safety",
    label: "Variable typing and conversion",
    category: "syntax",
    lessonIds: ["PY_L1_02_CONTROL"],
  },
  {
    key: "if_else_branching",
    label: "Conditionals and logic flow",
    category: "logic",
    lessonIds: ["PY_L1_02_CONTROL"],
  },
  {
    key: "function_definitions",
    label: "Function definition and calls",
    category: "logic",
    lessonIds: ["PY_INTRO_L1", "PY_L1_03_COLLECTIONS"],
  },
  {
    key: "loop_iteration_lists",
    label: "List iteration and accumulation",
    category: "data_structures",
    lessonIds: ["PY_L1_03_COLLECTIONS"],
  },
  {
    key: "dict_key_lookup",
    label: "Dictionary mapping and search",
    category: "data_structures",
    lessonIds: ["PY_L1_04_DICTS_STRINGS"],
  },
  {
    key: "string_traversal_cleaning",
    label: "String manipulation and cleaning",
    category: "syntax",
    lessonIds: ["PY_L1_04_DICTS_STRINGS"],
  },
  {
    key: "file_io_persistence",
    label: "File reading and persistence",
    category: "data_structures",
    lessonIds: ["PY_L1_05_FILES_EXCEPTIONS"],
  },
  {
    key: "exception_safety_try_except",
    label: "Safe code with try/except",
    category: "logic",
    lessonIds: ["PY_L1_05_FILES_EXCEPTIONS"],
  },
  {
    key: "oop_class_modeling",
    label: "Basic class and object modeling",
    category: "data_structures",
    lessonIds: ["PY_L1_06_MODULES_OOP_REVIEW"],
  },
];

const SKILL_BY_KEY = new Map(CODESUTRA_LEVEL1_SKILLS.map((skill) => [skill.key, skill]));

export function getCodeSutraSkillDefinitions(): CodeSutraSkillDefinition[] {
  return CODESUTRA_LEVEL1_SKILLS;
}

export function getCodeSutraLessonSkillKeys(lessonId: string): string[] {
  const skillKeys = CODESUTRA_LEVEL1_SKILLS.filter((skill) => skill.lessonIds.includes(lessonId)).map((skill) => skill.key);
  return skillKeys.length ? skillKeys : ["general_python_fluency"];
}

export function getCodeSutraSkillLabel(skillKey: string): string {
  return SKILL_BY_KEY.get(skillKey)?.label ?? "General Python fluency";
}

function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

function round(num: number): number {
  return Math.round(num * 100) / 100;
}

export function buildDefaultCodeSutraSkillMastery(skillKey: string, lessonId: string): SessionSkillMastery {
  return {
    productSlug: "codesutra",
    lessonId,
    skillKey,
    skillName: getCodeSutraSkillLabel(skillKey),
    attempts: 0,
    correct: 0,
    hintsUsed: 0,
    conceptChecks: 0,
    conceptClearCount: 0,
    transferChecks: 0,
    transferCorrect: 0,
    confidenceScoreTotal: 0,
    masteryScore: 0.35,
    recentDelta: 0,
    lastUpdated: new Date().toISOString(),
  };
}

function updateSingleSkill(
  existing: SessionSkillMastery,
  eventType: "attempt" | "hint" | "lesson_complete",
  isCorrect: boolean,
): SessionSkillMastery {
  let attempts = existing.attempts;
  let correct = existing.correct;
  let hintsUsed = existing.hintsUsed;
  let masteryScore = existing.masteryScore;
  let recentDelta = 0;

  if (eventType === "hint") {
    hintsUsed += 1;
    masteryScore = clamp(masteryScore - 0.03, 0.05, 0.98);
    recentDelta = -0.03;
  } else if (eventType === "attempt") {
    attempts += 1;
    if (isCorrect) {
      correct += 1;
      const hintRatio = hintsUsed > 0 && attempts > 0 ? hintsUsed / Math.max(attempts, 1) : 0;
      const gain = hintRatio > 0.4 ? 0.06 : 0.12;
      masteryScore = clamp(masteryScore + gain, 0.05, 0.98);
      recentDelta = gain;
    } else {
      masteryScore = clamp(masteryScore - 0.06, 0.05, 0.98);
      recentDelta = -0.06;
    }
  } else if (eventType === "lesson_complete") {
    masteryScore = clamp(masteryScore + 0.05, 0.05, 0.98);
    recentDelta = 0.05;
  }

  return {
    ...existing,
    attempts,
    correct,
    hintsUsed,
    masteryScore: round(masteryScore),
    recentDelta: round(recentDelta),
    lastUpdated: new Date().toISOString(),
  };
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function getCodeSutraSupportMode(session: AppSession, lessonId?: string): CodeSutraSupportMode {
  const relevant = (session.skillMastery ?? []).filter((skill) =>
    skill.productSlug === "codesutra" && (!lessonId || skill.lessonId === lessonId),
  );
  if (!relevant.length) return "balanced";

  const avgMastery = average(relevant.map((skill) => skill.masteryScore));
  const hintRatio = average(relevant.map((skill) => skill.hintsUsed / Math.max(skill.attempts || 1, 1)));

  if (avgMastery >= 0.8 && hintRatio <= 0.15) return "challenge";
  if (avgMastery <= 0.5 || hintRatio >= 0.45) return "guided";
  return "balanced";
}

export function summarizeCodeSutraSkillMastery(session: AppSession) {
  const skills = (session.skillMastery ?? []).filter((skill) => skill.productSlug === "codesutra");
  const ordered = [...skills].sort((a, b) => b.masteryScore - a.masteryScore);
  const weakest = [...skills].sort((a, b) => a.masteryScore - b.masteryScore);

  return {
    strongestSkills: ordered.slice(0, 3).map((skill) => skill.skillName),
    weakSkills: weakest.slice(0, 3).map((skill) => skill.skillName),
    overallMastery: round(average(skills.map((skill) => skill.masteryScore))),
  };
}

function updateEnrollmentAccuracy(enrollment: SessionEnrollment, mastery: number): SessionEnrollment {
  return {
    ...enrollment,
    accuracy: clamp(Math.round(mastery * 100), 0, 100),
  };
}

function updateRecentSessions(
  recentSessions: SessionRecentActivity[],
  lessonTitle: string,
  eventType: "attempt" | "hint" | "lesson_complete",
  overallAccuracy: number,
): SessionRecentActivity[] {
  if (eventType !== "lesson_complete") return recentSessions;

  const next: SessionRecentActivity = {
    date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    chapter: lessonTitle,
    duration: "15 min",
    accuracy: overallAccuracy,
    score: `${overallAccuracy}%`,
  };
  return [next, ...recentSessions].slice(0, 6);
}

export function updateCodeSutraSessionProgress(
  session: AppSession,
  input: {
    lessonId: string;
    lessonTitle: string;
    eventType: "attempt" | "hint" | "lesson_complete";
    skillKeys?: string[];
    isCorrect?: boolean;
  },
): AppSession {
  const skillKeys = input.skillKeys?.length ? input.skillKeys : getCodeSutraLessonSkillKeys(input.lessonId);
  const currentSkills = [...(session.skillMastery ?? [])];

  for (const skillKey of skillKeys) {
    const idx = currentSkills.findIndex(
      (skill) => skill.productSlug === "codesutra" && skill.skillKey === skillKey && skill.lessonId === input.lessonId,
    );
    const existing = idx >= 0 ? currentSkills[idx] : buildDefaultCodeSutraSkillMastery(skillKey, input.lessonId);
    const updated = updateSingleSkill(existing, input.eventType, Boolean(input.isCorrect));
    if (idx >= 0) {
      currentSkills[idx] = updated;
    } else {
      currentSkills.push(updated);
    }
  }

  const summary = summarizeCodeSutraSkillMastery({ ...session, skillMastery: currentSkills });
  const updatedEnrollments = session.enrollments.map((enrollment) =>
    enrollment.productSlug === "codesutra" ? updateEnrollmentAccuracy(enrollment, summary.overallMastery) : enrollment,
  );

  return {
    ...session,
    skillMastery: currentSkills,
    monthlyMinutes: session.monthlyMinutes + (input.eventType === "lesson_complete" ? 15 : input.eventType === "attempt" ? 1 : 0),
    recentSessions: updateRecentSessions(session.recentSessions, input.lessonTitle, input.eventType, Math.round(summary.overallMastery * 100)),
    enrollments: updatedEnrollments,
  };
}

export function mergeCodeSutraSkillMasteryIntoSession(
  session: AppSession,
  persistedSkills: SessionSkillMastery[],
): AppSession {
  if (!persistedSkills.length) return session;

  const otherProducts = (session.skillMastery ?? []).filter((skill) => skill.productSlug !== "codesutra");
  return {
    ...session,
    skillMastery: [...otherProducts, ...persistedSkills],
  };
}

export function buildCodeSutraLearnerSnapshot(session: AppSession, lessonId: string) {
  const lessonSkillKeys = getCodeSutraLessonSkillKeys(lessonId);
  const skillMastery = lessonSkillKeys.map((skillKey) => {
    const tracked = (session.skillMastery ?? []).find(
      (skill) => skill.productSlug === "codesutra" && skill.lessonId === lessonId && skill.skillKey === skillKey,
    );
    return tracked ?? buildDefaultCodeSutraSkillMastery(skillKey, lessonId);
  });

  const supportMode = getCodeSutraSupportMode(session, lessonId);
  const primaryWeakSkill = skillMastery.sort((a, b) => a.masteryScore - b.masteryScore)[0]?.skillName ?? "General Python fluency";

  let coachLine = "";
  if (supportMode === "challenge") {
    coachLine = `You're flying through this. I'll minimize the hints and give you tougher edge cases to solve. Focus: precision.`;
  } else if (supportMode === "guided") {
    coachLine = `Let's take this slow. I can see ${primaryWeakSkill} is a bit tricky right now. I'll break the code into smaller steps for you.`;
  } else {
    coachLine = `Nice steady pace. We'll work on ${primaryWeakSkill} together with a mix of explanation and practice.`;
  }

  return {
    supportMode,
    coachLine,
    recommendedNextFocus: primaryWeakSkill,
    overallMastery: round(average(skillMastery.map((s) => s.masteryScore))),
    skillMastery: skillMastery.map((skill) => ({
      skillKey: skill.skillKey,
      skillName: skill.skillName,
      masteryScore: skill.masteryScore,
      attempts: skill.attempts,
      hintsUsed: skill.hintsUsed,
    })),
  };
}
