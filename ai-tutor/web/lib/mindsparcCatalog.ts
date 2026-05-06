// ─────────────────────────────────────────────────────────────────────────────
// MindSparc — Level-Based Aptitude & Reasoning Catalog
// Replaces the legacy 9-grade mapping with 5 cognitive progression levels.
// ─────────────────────────────────────────────────────────────────────────────

export type SparcLesson = {
  id: string;           // 'AR_L1_1' … 'AR_L5_8'
  title: string;
  category: "Logic" | "Math" | "Verbal" | "Spatial";
  skill: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  durationMin: number;
  freePreview: boolean;
};

export type SparcLevel = {
  id: string;           // 'L1' … 'L5'
  order: number;
  name: string;
  tagline: string;
  emoji: string;
  color: string;
  ageEquiv: string;
  xpToUnlock: number;
  xpOnComplete: number;
  lessons: SparcLesson[];
};

export const MINDSPARC_LEVELS: SparcLevel[] = [
  {
    id: "level-1", order: 1, name: "Foundation",
    tagline: "Sparky's Magic Pattern Jungle",
    emoji: "🧩", color: "#10B981", ageEquiv: "Age 9-10",
    xpToUnlock: 0, xpOnComplete: 200,
    lessons: [
      { id: "AR_L1_1", title: "Visual Pattern Matching", category: "Spatial", skill: "Identify the next shape in sequence", difficulty: 1, durationMin: 15, freePreview: true },
      { id: "AR_L1_2", title: "Number Sequences I", category: "Math", skill: "Find missing numbers in simple series", difficulty: 1, durationMin: 20, freePreview: true },
      { id: "AR_L1_3", title: "Word Associations", category: "Verbal", skill: "Connect related concepts", difficulty: 1, durationMin: 15, freePreview: false },
      { id: "AR_L1_4", title: "Basic Coding & Decoding", category: "Logic", skill: "Translate simple substitution ciphers", difficulty: 2, durationMin: 20, freePreview: false },
    ],
  },
  {
    id: "level-2", order: 2, name: "Tier 2",
    tagline: "Olympiad Island Logic",
    emoji: "⚙️", color: "#3B82F6", ageEquiv: "Age 11-12",
    xpToUnlock: 200, xpOnComplete: 300,
    lessons: [
      { id: "AR_L2_1", title: "Blood Relations", category: "Logic", skill: "Map family trees and relationships", difficulty: 2, durationMin: 25, freePreview: true },
      { id: "AR_L2_2", title: "Direction Sense Test", category: "Spatial", skill: "Calculate final position after multi-turn routes", difficulty: 2, durationMin: 20, freePreview: false },
      { id: "AR_L2_3", title: "Fractions & Proportions", category: "Math", skill: "Solve weighted ratio word problems", difficulty: 3, durationMin: 25, freePreview: false },
      { id: "AR_L2_4", title: "Syllogisms I", category: "Logic", skill: "Basic premise and conclusion deduction", difficulty: 3, durationMin: 30, freePreview: false },
    ],
  },
  {
    id: "level-3", order: 3, name: "Tier 3",
    tagline: "Scholarship Mastery (NTSE)",
    emoji: "🧠", color: "#F59E0B", ageEquiv: "Age 13-14",
    xpToUnlock: 500, xpOnComplete: 400,
    lessons: [
      { id: "AR_L3_1", title: "Advanced Coding & Decoding", category: "Logic", skill: "Matrix & alphanumeric cipher puzzles", difficulty: 3, durationMin: 30, freePreview: true },
      { id: "AR_L3_2", title: "Time, Speed & Distance", category: "Math", skill: "Relative speed and train crossing logic", difficulty: 4, durationMin: 35, freePreview: false },
      { id: "AR_L3_3", title: "Cube & Dice Orientations", category: "Spatial", skill: "Mentally fold/unfold 3D nets", difficulty: 4, durationMin: 30, freePreview: false },
      { id: "AR_L3_4", title: "Data Interpretation", category: "Math", skill: "Extract answers from complex pie-charts", difficulty: 3, durationMin: 30, freePreview: false },
    ],
  },
  {
    id: "level-4", order: 4, name: "Campus Gate Arena",
    tagline: "The Entrance Exam Prep Studio",
    emoji: "🎯", color: "#60A5FA", ageEquiv: "Age 15-18",
    xpToUnlock: 900, xpOnComplete: 500,
    lessons: [
      { id: "AR_L4_1", title: "Team Selection Lock", category: "Math", skill: "Permutations vs Combinations logic", difficulty: 4, durationMin: 35, freePreview: true },
      { id: "AR_L4_2", title: "Evidence Board Deduction", category: "Logic", skill: "Multi-parameter constraint mapping", difficulty: 4, durationMin: 40, freePreview: false },
      { id: "AR_L4_3", title: "Probability Spinner Lab", category: "Math", skill: "Predictions and outcome probability", difficulty: 5, durationMin: 40, freePreview: false },
      { id: "AR_L4_4", title: "Reading Insight Map", category: "Verbal", skill: "Evidence-based logical analysis", difficulty: 4, durationMin: 35, freePreview: false },
    ],
  },
  {
    id: "level-5", order: 5, name: "FAANG Shadow Vault",
    tagline: "Elite Performance Training",
    emoji: "💼", color: "#EC4899", ageEquiv: "18+ Professionals",
    xpToUnlock: 1400, xpOnComplete: 600,
    lessons: [
      { id: "AR_L5_1", title: "Data Sufficiency Vault", category: "Logic", skill: "Efficiency in analytical decision making", difficulty: 5, durationMin: 40, freePreview: true },
      { id: "AR_L5_2", title: "Cryptarithmetic Cipher", category: "Math", skill: "Letter-logic and carry-over reasoning", difficulty: 5, durationMin: 45, freePreview: false },
      { id: "AR_L5_3", title: "Argument Chain Analysis", category: "Verbal", skill: "Critical Reasoning for GMAT/FAANG", difficulty: 5, durationMin: 40, freePreview: false },
      { id: "AR_L5_4", title: "Boardroom Seating Chart", category: "Logic", skill: "Multi-parameter circular constraints", difficulty: 5, durationMin: 45, freePreview: false },
    ],
  },
];

export function getSparcLevel(levelId: string): SparcLevel | undefined {
  return MINDSPARC_LEVELS.find((l) => l.id === levelId);
}

export function getSparcLesson(lessonId: string): SparcLesson | undefined {
  for (const level of MINDSPARC_LEVELS) {
    const lesson = level.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getSparcLevelByLesson(lessonId: string): SparcLevel | undefined {
  for (const level of MINDSPARC_LEVELS) {
    if (level.lessons.some((l) => l.id === lessonId)) return level;
  }
  return undefined;
}

// ─── Compatibility Layer for Session Engine ───────────────────────────────────

export type SparcCourseCatalog = {
  courseKey: string;
  courseId: string;
  courseName: string;
  tagline: string;
  grade: number;
  gradeSlug: string;
  chapters: {
    code: string;
    title: string;
    durationMin: number;
    freePreview: boolean;
  }[];
};

export function getMindSparcCatalog(gradeOrSlug: string | number): SparcCourseCatalog {
  const levelNum = typeof gradeOrSlug === "number" ? gradeOrSlug : parseInt(gradeOrSlug.split("-").pop() || "1");
  const level = MINDSPARC_LEVELS.find(l => l.order === levelNum) || MINDSPARC_LEVELS[0];
  
  return {
    courseKey: `mindsparc-l${level.order}`,
    courseId: `aptitude_level_${level.order}`,
    courseName: `${level.name} Logic`,
    tagline: level.tagline,
    grade: level.order,
    gradeSlug: `level-${level.order}`,
    chapters: level.lessons.map(l => ({
      code: l.id,
      title: l.title,
      durationMin: l.durationMin,
      freePreview: l.freePreview
    }))
  };
}
