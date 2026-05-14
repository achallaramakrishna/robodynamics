import type { AppSession, SessionEnrollment, SessionRecentActivity, SessionSkillMastery } from "./appSession";
import { getMsLesson, getMsLevel } from "./mindsutraCatalog";

export type MindSutraSupportMode = "guided" | "balanced" | "challenge";

type MindSutraSkillDefinition = {
  key: string;
  label: string;
  category: "addition" | "subtraction" | "multiplication" | "number_sense";
  lessonIds: string[];
};

const LEVEL1_SKILLS: MindSutraSkillDefinition[] = [
  {
    key: "complements_to_friendly_base",
    label: "Complements to friendly bases",
    category: "addition",
    lessonIds: ["VM_L1_1"],
  },
  {
    key: "number_bond_splitting",
    label: "Number-bond splitting",
    category: "number_sense",
    lessonIds: ["VM_L1_1"],
  },
  {
    key: "tables_11_to_19",
    label: "Tables 11-19 patterning",
    category: "multiplication",
    lessonIds: ["VM_L1_2"],
  },
  {
    key: "carry_from_ones",
    label: "Carry from ones place",
    category: "multiplication",
    lessonIds: ["VM_L1_2", "VM_L1_4", "VM_L1_8"],
  },
  {
    key: "doubling_and_halving",
    label: "Doubling and halving",
    category: "multiplication",
    lessonIds: ["VM_L1_3"],
  },
  {
    key: "factor_transformation",
    label: "Factor transformation",
    category: "number_sense",
    lessonIds: ["VM_L1_3", "VM_L1_6"],
  },
  {
    key: "multiply_by_11",
    label: "Multiply by 11",
    category: "multiplication",
    lessonIds: ["VM_L1_4"],
  },
  {
    key: "borrow_free_subtraction",
    label: "Borrow-free subtraction",
    category: "subtraction",
    lessonIds: ["VM_L1_5"],
  },
  {
    key: "subtraction_complements",
    label: "Subtraction complements",
    category: "subtraction",
    lessonIds: ["VM_L1_5"],
  },
  {
    key: "multiply_by_5_and_25",
    label: "Multiply by 5 and 25",
    category: "multiplication",
    lessonIds: ["VM_L1_6"],
  },
  {
    key: "near_100_adjustments",
    label: "Near-100 adjustments",
    category: "addition",
    lessonIds: ["VM_L1_7"],
  },
  {
    key: "deviation_tracking",
    label: "Deviation tracking",
    category: "number_sense",
    lessonIds: ["VM_L1_7"],
  },
  {
    key: "criss_cross_2_digit",
    label: "Criss-cross 2-digit multiplication",
    category: "multiplication",
    lessonIds: ["VM_L1_8"],
  },
];

const LEVEL2_SKILLS: MindSutraSkillDefinition[] = [
  {
    key: "nikhilam_near_100_multiplication",
    label: "Nikhilam near-100 multiplication",
    category: "multiplication",
    lessonIds: ["VM_L2_1"],
  },
  {
    key: "deviation_padding_base_100",
    label: "Deviation padding for base 100",
    category: "number_sense",
    lessonIds: ["VM_L2_1"],
  },
  {
    key: "proportional_scaling",
    label: "Proportional scaling",
    category: "number_sense",
    lessonIds: ["VM_L2_2"],
  },
  {
    key: "friendly_base_factorization",
    label: "Friendly-base factorization",
    category: "multiplication",
    lessonIds: ["VM_L2_2"],
  },
  {
    key: "criss_cross_3_digit",
    label: "Criss-cross 3-digit multiplication",
    category: "multiplication",
    lessonIds: ["VM_L2_3"],
  },
  {
    key: "column_carry_management",
    label: "Column carry management",
    category: "number_sense",
    lessonIds: ["VM_L2_3"],
  },
  {
    key: "division_by_9_running_remainder",
    label: "Division by 9 running remainder",
    category: "number_sense",
    lessonIds: ["VM_L2_4"],
  },
  {
    key: "near_50_squaring",
    label: "Squaring near 50",
    category: "multiplication",
    lessonIds: ["VM_L2_5"],
  },
  {
    key: "fraction_reduction",
    label: "Fraction reduction",
    category: "number_sense",
    lessonIds: ["VM_L2_6"],
  },
  {
    key: "decimal_place_tracking",
    label: "Decimal place tracking",
    category: "number_sense",
    lessonIds: ["VM_L2_7"],
  },
  {
    key: "flag_division",
    label: "Flag division",
    category: "number_sense",
    lessonIds: ["VM_L2_8"],
  },
];

const LEVEL3_SKILLS: MindSutraSkillDefinition[] = [
  {
    key: "vinculum_conversion",
    label: "Vinculum conversion",
    category: "number_sense",
    lessonIds: ["VM_L3_1"],
  },
  {
    key: "integer_sign_rules",
    label: "Integer sign rules",
    category: "multiplication",
    lessonIds: ["VM_L3_2"],
  },
  {
    key: "nikhilam_any_base",
    label: "Nikhilam any-base multiplication",
    category: "multiplication",
    lessonIds: ["VM_L3_3"],
  },
  {
    key: "ratio_reduction",
    label: "Ratio reduction",
    category: "number_sense",
    lessonIds: ["VM_L3_4"],
  },
  {
    key: "hcf_lcm_structure",
    label: "HCF and LCM structure",
    category: "number_sense",
    lessonIds: ["VM_L3_5"],
  },
  {
    key: "duplex_squaring",
    label: "Duplex squaring",
    category: "multiplication",
    lessonIds: ["VM_L3_6"],
  },
  {
    key: "paravartya_division",
    label: "Paravartya division",
    category: "number_sense",
    lessonIds: ["VM_L3_7"],
  },
  {
    key: "algebra_by_inspection",
    label: "Algebra by inspection",
    category: "number_sense",
    lessonIds: ["VM_L3_8"],
  },
];

const LEVEL4_SKILLS: MindSutraSkillDefinition[] = [
  {
    key: "near_base_squaring_any_base",
    label: "Near-base squaring at any base",
    category: "multiplication",
    lessonIds: ["VM_L4_1"],
  },
  {
    key: "rational_add_cross_multiply",
    label: "Rational addition by cross-multiplication",
    category: "number_sense",
    lessonIds: ["VM_L4_2"],
  },
  {
    key: "linear_equation_transposition",
    label: "Linear equation transposition",
    category: "number_sense",
    lessonIds: ["VM_L4_3"],
  },
  {
    key: "cubic_slot_expansion",
    label: "Cubic slot expansion",
    category: "multiplication",
    lessonIds: ["VM_L4_4"],
  },
  {
    key: "nikhilam_near_1000",
    label: "Nikhilam near 1000",
    category: "multiplication",
    lessonIds: ["VM_L4_5"],
  },
  {
    key: "exponent_anchor_patterns",
    label: "Exponent anchor patterns",
    category: "number_sense",
    lessonIds: ["VM_L4_6"],
  },
  {
    key: "triangle_area_triples",
    label: "Triangle area using triples",
    category: "number_sense",
    lessonIds: ["VM_L4_7"],
  },
  {
    key: "algebraic_identity_expansion",
    label: "Algebraic identity expansion",
    category: "number_sense",
    lessonIds: ["VM_L4_8"],
  },
];

const LEVEL5_SKILLS: MindSutraSkillDefinition[] = [
  {
    key: "square_root_inspection",
    label: "Square-root inspection",
    category: "number_sense",
    lessonIds: ["VM_L5_1"],
  },
  {
    key: "cube_root_inspection",
    label: "Cube-root inspection",
    category: "number_sense",
    lessonIds: ["VM_L5_2"],
  },
  {
    key: "binomial_cube_expansion",
    label: "Binomial cube expansion",
    category: "multiplication",
    lessonIds: ["VM_L5_3"],
  },
  {
    key: "simultaneous_equation_setup",
    label: "Simultaneous equation setup",
    category: "number_sense",
    lessonIds: ["VM_L5_4"],
  },
  {
    key: "criss_cross_4_digit",
    label: "Criss-cross 4-digit multiplication",
    category: "multiplication",
    lessonIds: ["VM_L5_5"],
  },
  {
    key: "percentage_decomposition",
    label: "Percentage decomposition",
    category: "number_sense",
    lessonIds: ["VM_L5_6"],
  },
  {
    key: "nikhilam_near_10000",
    label: "Nikhilam near 10000",
    category: "multiplication",
    lessonIds: ["VM_L5_7"],
  },
  {
    key: "advanced_divisibility_rules",
    label: "Advanced divisibility rules",
    category: "number_sense",
    lessonIds: ["VM_L5_8"],
  },
];

const MINDSUTRA_SKILLS = [...LEVEL1_SKILLS, ...LEVEL2_SKILLS, ...LEVEL3_SKILLS, ...LEVEL4_SKILLS, ...LEVEL5_SKILLS];

const SKILL_BY_KEY = new Map(MINDSUTRA_SKILLS.map((skill) => [skill.key, skill]));

export function getMindSutraSkillDefinitions(): MindSutraSkillDefinition[] {
  return MINDSUTRA_SKILLS;
}

export function getMindSutraLessonSkillKeys(lessonId: string): string[] {
  const skillKeys = MINDSUTRA_SKILLS.filter((skill) => skill.lessonIds.includes(lessonId)).map((skill) => skill.key);
  return skillKeys.length ? skillKeys : ["general_mindsutra_fluency"];
}

export function getMindSutraSkillLabel(skillKey: string): string {
  return SKILL_BY_KEY.get(skillKey)?.label ?? "General MindSutra fluency";
}

function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

function round(num: number): number {
  return Math.round(num * 100) / 100;
}

export function buildDefaultMindSutraSkillMastery(skillKey: string, lessonId: string): SessionSkillMastery {
  return {
    productSlug: "mindsutra",
    lessonId,
    skillKey,
    skillName: getMindSutraSkillLabel(skillKey),
    attempts: 0,
    correct: 0,
    hintsUsed: 0,
    conceptChecks: 0,
    conceptClearCount: 0,
    transferChecks: 0,
    transferCorrect: 0,
    confidenceScoreTotal: 0,
    masteryScore: 0.28,
    recentDelta: 0,
    lastUpdated: new Date().toISOString(),
  };
}

function updateSingleSkill(
  existing: SessionSkillMastery,
  eventType: "attempt" | "hint" | "lesson_complete" | "concept_check" | "transfer_check",
  isCorrect: boolean,
  confidenceScore?: number,
): SessionSkillMastery {
  let attempts = existing.attempts;
  let correct = existing.correct;
  let hintsUsed = existing.hintsUsed;
  let conceptChecks = existing.conceptChecks ?? 0;
  let conceptClearCount = existing.conceptClearCount ?? 0;
  let transferChecks = existing.transferChecks ?? 0;
  let transferCorrect = existing.transferCorrect ?? 0;
  let confidenceScoreTotal = existing.confidenceScoreTotal ?? 0;
  let masteryScore = existing.masteryScore;
  let recentDelta = 0;

  if (eventType === "hint") {
    hintsUsed += 1;
    masteryScore = clamp(masteryScore - 0.02, 0.05, 0.98);
    recentDelta = -0.02;
  } else if (eventType === "attempt") {
    attempts += 1;
    if (isCorrect) {
      correct += 1;
      const hintRatio = hintsUsed > 0 && attempts > 0 ? hintsUsed / Math.max(attempts, 1) : 0;
      const gain = hintRatio > 0.35 ? 0.08 : 0.14;
      masteryScore = clamp(masteryScore + gain, 0.05, 0.98);
      recentDelta = gain;
    } else {
      masteryScore = clamp(masteryScore - 0.05, 0.05, 0.98);
      recentDelta = -0.05;
    }
  } else if (eventType === "lesson_complete") {
    masteryScore = clamp(masteryScore + 0.04, 0.05, 0.98);
    recentDelta = 0.04;
  } else if (eventType === "concept_check") {
    conceptChecks += 1;
    if (isCorrect) {
      conceptClearCount += 1;
      masteryScore = clamp(masteryScore + 0.06, 0.05, 0.98);
      recentDelta = 0.06;
    } else {
      masteryScore = clamp(masteryScore - 0.03, 0.05, 0.98);
      recentDelta = -0.03;
    }
    if (typeof confidenceScore === "number") {
      confidenceScoreTotal += clamp(confidenceScore, 1, 3);
    }
  } else if (eventType === "transfer_check") {
    transferChecks += 1;
    if (isCorrect) {
      transferCorrect += 1;
      masteryScore = clamp(masteryScore + 0.08, 0.05, 0.98);
      recentDelta = 0.08;
    } else {
      masteryScore = clamp(masteryScore - 0.04, 0.05, 0.98);
      recentDelta = -0.04;
    }
  }

  return {
    ...existing,
    attempts,
    correct,
    hintsUsed,
    conceptChecks,
    conceptClearCount,
    transferChecks,
    transferCorrect,
    confidenceScoreTotal,
    masteryScore: round(masteryScore),
    recentDelta: round(recentDelta),
    lastUpdated: new Date().toISOString(),
  };
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function ratio(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

export function getMindSutraSupportMode(session: AppSession, lessonId?: string): MindSutraSupportMode {
  const relevant = (session.skillMastery ?? []).filter((skill) =>
    skill.productSlug === "mindsutra" && (!lessonId || skill.lessonId === lessonId),
  );
  if (!relevant.length) return "balanced";

  const avgMastery = average(relevant.map((skill) => skill.masteryScore));
  const hintRatio = average(relevant.map((skill) => skill.hintsUsed / Math.max(skill.attempts || 1, 1)));
  const conceptClarity = average(relevant.map((skill) => ratio(skill.conceptClearCount ?? 0, skill.conceptChecks ?? 0)));
  const transferStrength = average(relevant.map((skill) => ratio(skill.transferCorrect ?? 0, skill.transferChecks ?? 0)));

  if (avgMastery >= 0.75 && hintRatio <= 0.2 && conceptClarity >= 0.65) return "challenge";
  if (avgMastery <= 0.45 || hintRatio >= 0.5 || conceptClarity <= 0.35 || transferStrength <= 0.3) return "guided";
  return "balanced";
}

export function summarizeMindSutraSkillMastery(session: AppSession) {
  const skills = (session.skillMastery ?? []).filter((skill) => skill.productSlug === "mindsutra");
  const ordered = [...skills].sort((a, b) => b.masteryScore - a.masteryScore);
  const weakest = [...skills].sort((a, b) => a.masteryScore - b.masteryScore);
  const improving = [...skills]
    .filter((skill) => skill.recentDelta > 0)
    .sort((a, b) => b.recentDelta - a.recentDelta);

  return {
    strongestSkills: ordered.slice(0, 3).map((skill) => skill.skillName),
    weakSkills: weakest.slice(0, 3).map((skill) => skill.skillName),
    improvingSkills: improving.slice(0, 3).map((skill) => skill.skillName),
    overallMastery: round(average(skills.map((skill) => skill.masteryScore))),
  };
}

function updateEnrollmentAccuracy(enrollment: SessionEnrollment, mastery: number): SessionEnrollment {
  return {
    ...enrollment,
    accuracy: clamp(Math.round(mastery * 100), 0, 100),
  };
}

function updateMindSutraEnrollmentProgress(
  enrollment: SessionEnrollment,
  completedLessonIds: string[],
  lessonId: string,
  mastery: number,
): SessionEnrollment {
  if (enrollment.productSlug !== "mindsutra") {
    return enrollment;
  }

  const lesson = getMsLesson(lessonId);
  if (!lesson) {
    return updateEnrollmentAccuracy(enrollment, mastery);
  }

  const level = getMsLevel(lesson.levelId);
  if (!level) {
    return updateEnrollmentAccuracy(enrollment, mastery);
  }

  const completedInLevel = level.lessons.filter((item) => completedLessonIds.includes(item.id)).length;
  const nextLesson = level.lessons[completedInLevel] ?? level.lessons[level.lessons.length - 1];

  return {
    ...updateEnrollmentAccuracy(enrollment, mastery),
    chaptersCompleted: completedInLevel,
    totalChapters: level.lessons.length,
    currentChapter: nextLesson.id,
    currentChapterName: nextLesson.title,
    status:
      completedInLevel <= 0
        ? "not_started"
        : completedInLevel >= level.lessons.length
          ? "completed"
          : "in_progress",
  };
}

function updateRecentSessions(
  recentSessions: SessionRecentActivity[],
  lessonTitle: string,
  eventType: "attempt" | "hint" | "lesson_complete" | "concept_check" | "transfer_check",
  overallAccuracy: number,
): SessionRecentActivity[] {
  if (eventType !== "lesson_complete") return recentSessions;

  const next: SessionRecentActivity = {
    date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    chapter: lessonTitle,
    duration: "12 min",
    accuracy: overallAccuracy,
    score: `${overallAccuracy}%`,
  };
  return [next, ...recentSessions].slice(0, 6);
}

export function updateMindSutraSessionProgress(
  session: AppSession,
  input: {
    lessonId: string;
    lessonTitle: string;
    eventType: "attempt" | "hint" | "lesson_complete" | "concept_check" | "transfer_check";
    skillKeys?: string[];
    isCorrect?: boolean;
    confidenceScore?: number;
    xpDelta?: number;
  },
): AppSession {
  const skillKeys = input.skillKeys?.length ? input.skillKeys : getMindSutraLessonSkillKeys(input.lessonId);
  const currentSkills = [...(session.skillMastery ?? [])];

  for (const skillKey of skillKeys) {
    const idx = currentSkills.findIndex(
      (skill) => skill.productSlug === "mindsutra" && skill.skillKey === skillKey && skill.lessonId === input.lessonId,
    );
    const existing = idx >= 0 ? currentSkills[idx] : buildDefaultMindSutraSkillMastery(skillKey, input.lessonId);
    const updated = updateSingleSkill(existing, input.eventType, Boolean(input.isCorrect), input.confidenceScore);
    if (idx >= 0) {
      currentSkills[idx] = updated;
    } else {
      currentSkills.push(updated);
    }
  }

  const summary = summarizeMindSutraSkillMastery({ ...session, skillMastery: currentSkills });
  const lessonAlreadyCompleted = session.completedLessonIds.includes(input.lessonId);
  const nextCompletedLessonIds =
    input.eventType === "lesson_complete" && !lessonAlreadyCompleted
      ? [...session.completedLessonIds, input.lessonId]
      : session.completedLessonIds;
  const updatedEnrollments = session.enrollments.map((enrollment, index) =>
    index === 0 && enrollment.productSlug === "mindsutra"
      ? updateMindSutraEnrollmentProgress(enrollment, nextCompletedLessonIds, input.lessonId, summary.overallMastery)
      : enrollment,
  );
  const xpGain =
    input.eventType === "lesson_complete" && !lessonAlreadyCompleted
      ? Math.max(0, Math.round(input.xpDelta ?? 0))
      : 0;

  return {
    ...session,
    xp: session.xp + xpGain,
    skillMastery: currentSkills,
    weakAreas: summary.weakSkills.length ? summary.weakSkills : session.weakAreas,
    monthlyMinutes: session.monthlyMinutes + (input.eventType === "lesson_complete" ? 12 : input.eventType === "attempt" ? 1 : 0),
    recentSessions: updateRecentSessions(session.recentSessions, input.lessonTitle, input.eventType, Math.round(summary.overallMastery * 100)),
    enrollments: updatedEnrollments,
    completedLessonIds: nextCompletedLessonIds,
  };
}

export function mergeMindSutraSkillMasteryIntoSession(
  session: AppSession,
  persistedSkills: SessionSkillMastery[],
  persistedCompletedIds?: string[],
): AppSession {
  if (!persistedSkills.length && !persistedCompletedIds?.length) return session;

  const otherProducts = (session.skillMastery ?? []).filter((skill) => skill.productSlug !== "mindsutra");
  
  // Combine IDs from three sources:
  // 1. Existing session IDs (cookies)
  // 2. Skill mastery record presence (implies some activity/completion)
  // 3. Explicit completion records from rd_vm_student_progress (most authoritative)
  const inferredIds = persistedSkills.map(s => s.lessonId);
  const mergedCompletedIds = Array.from(new Set([
    ...session.completedLessonIds, 
    ...inferredIds,
    ...(persistedCompletedIds ?? [])
  ]));

  return {
    ...session,
    skillMastery: [...otherProducts, ...persistedSkills],
    completedLessonIds: mergedCompletedIds,
  };
}

export function buildMindSutraLearnerSnapshot(session: AppSession, lessonId: string) {
  const studentName = session.childName?.trim() || "Student";
  const firstName = studentName.split(/\s+/)[0] || "Student";
  const lessonSkillKeys = getMindSutraLessonSkillKeys(lessonId);
  const skillMastery = lessonSkillKeys.map((skillKey) => {
    const tracked = (session.skillMastery ?? []).find(
      (skill) => skill.productSlug === "mindsutra" && skill.lessonId === lessonId && skill.skillKey === skillKey,
    );
    return tracked ?? buildDefaultMindSutraSkillMastery(skillKey, lessonId);
  });

  const supportMode = getMindSutraSupportMode(session, lessonId);
  const conceptClarityScore = round(average(skillMastery.map((skill) => ratio(skill.conceptClearCount ?? 0, skill.conceptChecks ?? 0))));
  const transferScore = round(average(skillMastery.map((skill) => ratio(skill.transferCorrect ?? 0, skill.transferChecks ?? 0))));
  const avgConfidence = round(average(skillMastery.map((skill) => ratio(skill.confidenceScoreTotal ?? 0, (skill.conceptChecks ?? 0) * 3))));
  const strongestSkills = [...skillMastery]
    .sort((a, b) => b.masteryScore - a.masteryScore)
    .slice(0, 2)
    .map((skill) => skill.skillName);
  const weakSkills = [...skillMastery]
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .slice(0, 2)
    .map((skill) => skill.skillName);

  const coachLine =
    supportMode === "challenge"
      ? `${firstName}, you look ready for stretch work here. Strongest signal: ${strongestSkills[0] ?? "steady accuracy"}.`
      : supportMode === "guided"
        ? `${firstName}, I should slow down and coach this more carefully. Biggest support area: ${weakSkills[0] ?? "step-by-step confidence"}.`
        : `${firstName}, you are building this steadily. I will balance explanation with practice on ${weakSkills[0] ?? "the current pattern"}.`;

  return {
    studentName,
    supportMode,
    coachLine,
    strongestSkills,
    weakSkills,
    recommendedNextFocus: weakSkills[0] ?? "General MindSutra fluency",
    conceptClarityScore,
    transferScore,
    avgConfidence,
    xp: session.xp,
    skillMastery: skillMastery.map((skill) => ({
      skillKey: skill.skillKey,
      skillName: skill.skillName,
      masteryScore: skill.masteryScore,
      attempts: skill.attempts,
      hintsUsed: skill.hintsUsed,
      conceptChecks: skill.conceptChecks ?? 0,
      conceptClearCount: skill.conceptClearCount ?? 0,
      transferChecks: skill.transferChecks ?? 0,
      transferCorrect: skill.transferCorrect ?? 0,
    })),
  };
}
