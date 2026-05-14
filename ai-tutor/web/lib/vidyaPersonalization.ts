import type { AppSession, SessionSkillMastery } from "./appSession";

export type VidyaSupportMode = "guided" | "balanced" | "challenge";

export type VidyaSkillDefinition = {
  key: string;
  label: string;
  category: "syntax" | "architecture" | "logic" | "data_handling";
  lessonIds: string[];
};

const VIDYA_SKILLS: VidyaSkillDefinition[] = [
  // CORE (L1)
  { key: "io_streams", label: "I/O Streams", category: "syntax", lessonIds: ["PY_L1_01_SETUP"] },
  { key: "type_casting", label: "Type Casting", category: "data_handling", lessonIds: ["PY_L1_02_DATA"] },
  { key: "control_flow", label: "Control Flow", category: "logic", lessonIds: ["PY_L1_02_DATA", "PY_L1_04_LOGIC"] },
  { key: "list_comprehensions", label: "List Comprehensions", category: "syntax", lessonIds: ["PY_L1_03_CONTROL"] },
  { key: "function_modularity", label: "Function Modularity", category: "architecture", lessonIds: ["PY_L1_03_CONTROL"] },
];

const SKILL_BY_KEY = new Map(VIDYA_SKILLS.map((skill) => [skill.key, skill]));

export function getVidyaSkillLabel(skillKey: string): string {
  return SKILL_BY_KEY.get(skillKey)?.label ?? "General Python fluency";
}

export function getVidyaLessonSkillKeys(lessonId: string): string[] {
  const keys = VIDYA_SKILLS.filter(s => s.lessonIds.includes(lessonId)).map(s => s.key);
  return keys.length ? keys : ["general_python_fluency"];
}

function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

function round(num: number): number {
  return Math.round(num * 100) / 100;
}

export function buildDefaultVidyaSkillMastery(skillKey: string, lessonId: string): SessionSkillMastery {
  return {
    productSlug: "vidya",
    lessonId,
    skillKey,
    skillName: getVidyaSkillLabel(skillKey),
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

// ─── ADDED PROGRESSION MUTATORS ──────────────────────────────────────────────
export function mergeVidyaSkillMasteryIntoSession(
  session: AppSession,
  dbSkills: SessionSkillMastery[],
  completedLessonIds: string[],
): AppSession {
  const existingMastery = session.skillMastery ?? [];
  const mergedMap = new Map(existingMastery.map((s) => [`${s.productSlug}-${s.lessonId}-${s.skillKey}`, s]));

  for (const dbSkill of dbSkills) {
    if (dbSkill.productSlug === "vidya") {
      mergedMap.set(`vidya-${dbSkill.lessonId}-${dbSkill.skillKey}`, dbSkill);
    }
  }

  const mergedCompleted = new Set(session.completedLessonIds ?? []);
  for (const id of completedLessonIds) mergedCompleted.add(id);

  return { ...session, skillMastery: Array.from(mergedMap.values()), completedLessonIds: Array.from(mergedCompleted) };
}

export function updateVidyaSessionProgress(
  session: AppSession,
  event: {
    lessonId: string;
    lessonTitle: string;
    eventType: "attempt" | "hint" | "lesson_complete" | "concept_check" | "transfer_check";
    isCorrect: boolean;
    skillKeys: string[];
    confidenceScore?: number;
    xpDelta?: number;
  },
): AppSession {
  let skillMastery = session.skillMastery ? [...session.skillMastery] : [];

  for (const skillKey of event.skillKeys) {
    const existingIndex = skillMastery.findIndex((s) => s.productSlug === "vidya" && s.lessonId === event.lessonId && s.skillKey === skillKey);
    let skill = existingIndex >= 0 ? { ...skillMastery[existingIndex] } : buildDefaultVidyaSkillMastery(skillKey, event.lessonId);

    const oldScore = skill.masteryScore;
    let newScore = oldScore;

    if (event.eventType === "attempt") {
      skill.attempts++;
      if (event.isCorrect) {
        skill.correct++;
        newScore = oldScore + (1.0 - oldScore) * 0.15;
      } else {
        newScore = oldScore - oldScore * 0.10;
      }
    } else if (event.eventType === "hint") {
      skill.hintsUsed++;
      newScore = oldScore - oldScore * 0.05;
    } else if (event.eventType === "concept_check") {
      skill.conceptChecks = (skill.conceptChecks || 0) + 1;
      if (event.isCorrect) {
        skill.conceptClearCount = (skill.conceptClearCount || 0) + 1;
        newScore = oldScore + (1.0 - oldScore) * 0.1;
      } else {
        newScore = oldScore - oldScore * 0.15;
      }
    } else if (event.eventType === "transfer_check") {
      skill.transferChecks = (skill.transferChecks || 0) + 1;
      if (event.isCorrect) {
        skill.transferCorrect = (skill.transferCorrect || 0) + 1;
        newScore = oldScore + (1.0 - oldScore) * 0.25;
      } else {
        newScore = oldScore - oldScore * 0.2;
      }
    }

    if (typeof event.confidenceScore === "number") {
      skill.confidenceScoreTotal = (skill.confidenceScoreTotal || 0) + event.confidenceScore;
    }

    skill.masteryScore = round(clamp(newScore, 0.01, 0.99));
    skill.recentDelta = round(skill.masteryScore - oldScore);
    skill.lastUpdated = new Date().toISOString();

    if (existingIndex >= 0) {
      skillMastery[existingIndex] = skill;
    } else {
      skillMastery.push(skill);
    }
  }

  const completedLessonIds = session.completedLessonIds ? [...session.completedLessonIds] : [];
  if (event.eventType === "lesson_complete" && !completedLessonIds.includes(event.lessonId)) {
    completedLessonIds.push(event.lessonId);
  }

  return {
    ...session,
    skillMastery,
    completedLessonIds,
    xp: session.xp + (event.xpDelta || 0),
  };
}
// ─────────────────────────────────────────────────────────────────────────────

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function ratio(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

export function getVidyaSupportMode(session: AppSession, lessonId?: string): VidyaSupportMode {
  const relevant = (session.skillMastery ?? []).filter((skill) =>
    skill.productSlug === "vidya" && (!lessonId || skill.lessonId === lessonId),
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

export function buildVidyaLearnerSnapshot(session: AppSession, lessonId: string) {
  const studentName = session.childName?.trim() || "Developer";
  const firstName = studentName.split(/\s+/)[0] || "Developer";
  const lessonSkillKeys = getVidyaLessonSkillKeys(lessonId);
  
  const skillMastery = lessonSkillKeys.map((skillKey) => {
    const tracked = (session.skillMastery ?? []).find(
      (skill) => skill.productSlug === "vidya" && skill.lessonId === lessonId && skill.skillKey === skillKey,
    );
    return tracked ?? buildDefaultVidyaSkillMastery(skillKey, lessonId);
  });

  const supportMode = getVidyaSupportMode(session, lessonId);
  const strongestSkills = [...skillMastery].sort((a, b) => b.masteryScore - a.masteryScore).slice(0, 2).map((s) => s.skillName);
  const weakSkills = [...skillMastery].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, 2).map((s) => s.skillName);

  const relevant = (session.skillMastery ?? []).filter((skill) =>
    skill.productSlug === "vidya" && skill.lessonId === lessonId,
  );
  const conceptClarityScore = relevant.length ? average(relevant.map((skill) => ratio(skill.conceptClearCount ?? 0, skill.conceptChecks ?? 0))) : 0.65;
  const transferScore = relevant.length ? average(relevant.map((skill) => ratio(skill.transferCorrect ?? 0, skill.transferChecks ?? 0))) : 0.70;
  // If there are confidence scores, average them, else default to 0.75
  const confidenceSum = relevant.reduce((sum, skill) => sum + (skill.confidenceScoreTotal ?? 0), 0);
  const confidenceCount = relevant.reduce((sum, skill) => sum + (skill.conceptChecks ?? 0) + (skill.transferChecks ?? 0), 0);
  const avgConfidence = confidenceCount > 0 ? confidenceSum / confidenceCount : 0.75;

  const coachLine =
    supportMode === "challenge"
      ? `${firstName}, you look ready for stretch work. I will remove scaffolding so you can architect this from scratch.`
      : supportMode === "guided"
        ? `${firstName}, let's slow down and debug this together. Biggest support area right now: ${weakSkills[0] ?? "syntax flow"}.`
        : `${firstName}, you're building steady momentum. Let's practice ${weakSkills[0] ?? "the current pattern"} with some paired programming.`;

  return {
    studentName,
    supportMode,
    coachLine,
    strongestSkills,
    weakSkills,
    recommendedNextFocus: weakSkills[0] ?? "General Python fluency",
    xp: session.xp,
    conceptClarityScore: round(clamp(conceptClarityScore || 0.65, 0, 1)),
    transferScore: round(clamp(transferScore || 0.70, 0, 1)),
    avgConfidence: round(clamp(avgConfidence || 0.75, 0, 1)),
  };
}
