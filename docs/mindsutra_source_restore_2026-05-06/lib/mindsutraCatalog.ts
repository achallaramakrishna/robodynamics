// ─────────────────────────────────────────────────────────────────────────────
// Mind Sutra — Level-Based Vedic Math Catalog
// Replaces grade-based structure with 5 universal progression levels.
// Any student, any grade → placed at the right level by placement quiz.
// ─────────────────────────────────────────────────────────────────────────────

export type MsLesson = {
  id: string;           // 'VM_L1_1' … 'VM_L5_8'
  title: string;
  sutra: string;
  skill: string;        // one-line description
  difficulty: 1 | 2 | 3 | 4 | 5;
  durationMin: number;
  freePreview: boolean;
  svgKey: string;       // key used to look up SVG assets
};

export type MsLevel = {
  id: string;           // 'L1' … 'L5'
  order: number;        // 1-5
  name: string;         // 'Foundation', 'Speed Builder', …
  tagline: string;
  emoji: string;
  color: string;        // hex
  gradeEquiv: string;   // 'Grade 4' etc — informational only
  xpToUnlock: number;
  xpOnComplete: number;
  lessons: MsLesson[];
};

export type MsPlacementResult = {
  correctCount: number;
  placedLevel: string;  // 'L1'…'L4'
};

// ─── Level definitions ──────────────────────────────────────────────────────

export const MINDSUTRA_LEVELS: MsLevel[] = [
  {
    id: "L1", order: 1, name: "Foundation",
    tagline: "Build the speed base every student needs",
    emoji: "🌱", color: "#22C55E", gradeEquiv: "Grade 4",
    xpToUnlock: 0, xpOnComplete: 200,
    lessons: [
      { id: "VM_L1_1", title: "Completing the Whole — Fast Addition",     sutra: "Pūraṇāpūraṇābhyām",               skill: "Complements to 10, 100, 1000",              difficulty: 1, durationMin: 20, freePreview: true,  svgKey: "VM_L1_1" },
      { id: "VM_L1_2", title: "Tables 11–19 — The Ekadhikena Pattern",    sutra: "Ekadhikena Pūrveṇa",              skill: "Multiplication tables 11–19 by pattern",    difficulty: 1, durationMin: 20, freePreview: true,  svgKey: "VM_L1_2" },
      { id: "VM_L1_3", title: "Doubling & Halving — Speed Multiplication", sutra: "Ānurūpyena",                     skill: "Double-halve to simplify any multiplication", difficulty: 1, durationMin: 20, freePreview: false, svgKey: "VM_L1_3" },
      { id: "VM_L1_4", title: "Multiply by 11 — Middle-Sum Trick",        sutra: "Ekadhikena Pūrveṇa",              skill: "Any 2-digit × 11 in one step",              difficulty: 1, durationMin: 20, freePreview: false, svgKey: "VM_L1_4" },
      { id: "VM_L1_5", title: "Borrow-Free Subtraction",                  sutra: "Nikhilam Navatashcaramam Dashatah", skill: "Subtract without borrowing using complements", difficulty: 2, durationMin: 25, freePreview: false, svgKey: "VM_L1_5" },
      { id: "VM_L1_6", title: "Multiply by 5 and 25",                     sutra: "Ānurūpyena",                     skill: "×5 = ÷2 then ×10;  ×25 = ÷4 then ×100",    difficulty: 1, durationMin: 20, freePreview: false, svgKey: "VM_L1_6" },
      { id: "VM_L1_7", title: "Near-100 Mental Math",                     sutra: "Nikhilam Navatashcaramam Dashatah", skill: "Add/subtract near-100 numbers using deviations", difficulty: 2, durationMin: 25, freePreview: false, svgKey: "VM_L1_7" },
      { id: "VM_L1_8", title: "Criss-Cross 2-Digit Multiplication",       sutra: "Ūrdhva-Tiryagbhyām",             skill: "Multiply any two 2-digit numbers in 3 steps", difficulty: 2, durationMin: 30, freePreview: false, svgKey: "VM_L1_8" },
    ],
  },
  {
    id: "L2", order: 2, name: "Speed Builder",
    tagline: "Unlock powerful shortcuts for exams",
    emoji: "⚡", color: "#3B82F6", gradeEquiv: "Grade 5",
    xpToUnlock: 200, xpOnComplete: 250,
    lessons: [
      { id: "VM_L2_1", title: "Nikhilam — Multiply Near 100",             sutra: "Nikhilam Navatashcaramam Dashatah", skill: "Multiply near-100 numbers using deficit/surplus", difficulty: 2, durationMin: 25, freePreview: true,  svgKey: "VM_L2_1" },
      { id: "VM_L2_2", title: "Anurupyena — Proportional 3-Digit Mult",   sutra: "Ānurūpyena",                     skill: "Scale base to match 3-digit × 1-digit problems", difficulty: 2, durationMin: 25, freePreview: false, svgKey: "VM_L2_2" },
      { id: "VM_L2_3", title: "Criss-Cross 3-Digit Multiplication",       sutra: "Ūrdhva-Tiryagbhyām",             skill: "Extend criss-cross to 3×3 digits in 5 steps",  difficulty: 3, durationMin: 30, freePreview: false, svgKey: "VM_L2_3" },
      { id: "VM_L2_4", title: "Division by 9 — Running Remainder",        sutra: "Dhvajāṅka variant",              skill: "Divide any number by 9 in one line",            difficulty: 2, durationMin: 25, freePreview: false, svgKey: "VM_L2_4" },
      { id: "VM_L2_5", title: "Squaring Near 50 — Anchor Base",           sutra: "Yāvadūnam",                      skill: "Square any number near 50 in 2 steps",          difficulty: 2, durationMin: 25, freePreview: false, svgKey: "VM_L2_5" },
      { id: "VM_L2_6", title: "Fast Fraction Simplification",             sutra: "HCF inspection",                 skill: "Reduce fractions instantly using HCF inspection", difficulty: 2, durationMin: 20, freePreview: false, svgKey: "VM_L2_6" },
      { id: "VM_L2_7", title: "Decimal Speed Arithmetic",                 sutra: "Ānurūpyena — place value shift", skill: "Multiply and divide decimals using place-value shift", difficulty: 2, durationMin: 20, freePreview: false, svgKey: "VM_L2_7" },
      { id: "VM_L2_8", title: "Flag Division — One-Line Division",        sutra: "Dhvajāṅka",                      skill: "Divide any number by single-digit in one line",  difficulty: 3, durationMin: 30, freePreview: false, svgKey: "VM_L2_8" },
    ],
  },
  {
    id: "L3", order: 3, name: "Power",
    tagline: "Advanced patterns that feel like magic",
    emoji: "🔥", color: "#F59E0B", gradeEquiv: "Grade 6",
    xpToUnlock: 450, xpOnComplete: 300,
    lessons: [
      { id: "VM_L3_1", title: "Vinculum Numbers — Bar Notation",          sutra: "Rekhanka",                       skill: "Convert to/from vinculum form for easier calc",  difficulty: 3, durationMin: 25, freePreview: true,  svgKey: "VM_L3_1" },
      { id: "VM_L3_2", title: "Integer Multiplication Shortcuts",         sutra: "Ānurūpyena + sign rules",        skill: "Multiply integers using sign rules + structure",  difficulty: 2, durationMin: 20, freePreview: false, svgKey: "VM_L3_2" },
      { id: "VM_L3_3", title: "Nikhilam — Any Base (10, 100, 1000)",      sutra: "Nikhilam Navatashcaramam Dashatah", skill: "Multiply near 10, 100, or 1000 with flexible base", difficulty: 3, durationMin: 30, freePreview: false, svgKey: "VM_L3_3" },
      { id: "VM_L3_4", title: "Ratio Shortcuts — Fast Comparison",        sutra: "Ānurūpyena",                     skill: "Simplify, compare, and scale ratios instantly",   difficulty: 2, durationMin: 20, freePreview: false, svgKey: "VM_L3_4" },
      { id: "VM_L3_5", title: "HCF and LCM — Vedic Method",               sutra: "Common factor inspection",       skill: "Find HCF and LCM using Vedic shortcuts",         difficulty: 3, durationMin: 25, freePreview: false, svgKey: "VM_L3_5" },
      { id: "VM_L3_6", title: "Squaring 2-Digit Numbers — Duplex",        sutra: "Dvandva Yoga",                   skill: "Square any 2-digit number in 2 steps",           difficulty: 3, durationMin: 25, freePreview: false, svgKey: "VM_L3_6" },
      { id: "VM_L3_7", title: "Paravartya Division",                      sutra: "Parāvartya Yojayet",             skill: "Divide by any number near a power of 10",        difficulty: 3, durationMin: 30, freePreview: false, svgKey: "VM_L3_7" },
      { id: "VM_L3_8", title: "Algebra by Inspection — Samuccaya",        sutra: "Sūnyam Samyasamuccaye",          skill: "Solve special linear equations by inspection",    difficulty: 3, durationMin: 25, freePreview: false, svgKey: "VM_L3_8" },
    ],
  },
  {
    id: "L4", order: 4, name: "Ace",
    tagline: "Elite techniques for competitive exams",
    emoji: "🏆", color: "#8B5CF6", gradeEquiv: "Grade 7",
    xpToUnlock: 750, xpOnComplete: 350,
    lessons: [
      { id: "VM_L4_1", title: "Squaring Near Any Base (100, 1000)",       sutra: "Yāvadūnam Tāvadūnam",            skill: "Square numbers near 100 or 1000 in 2 steps",     difficulty: 3, durationMin: 25, freePreview: true,  svgKey: "VM_L4_1" },
      { id: "VM_L4_2", title: "Rational Number Addition — Vedic Speed",   sutra: "Ānurūpyena cross-multiply",      skill: "Add fractions without LCD",                      difficulty: 3, durationMin: 20, freePreview: false, svgKey: "VM_L4_2" },
      { id: "VM_L4_3", title: "Linear Equations — Paravartya & Samuccaya", sutra: "Parāvartya + Sūnyam",           skill: "Solve multi-step linear equations in one step",   difficulty: 4, durationMin: 30, freePreview: false, svgKey: "VM_L4_3" },
      { id: "VM_L4_4", title: "Cubing Using Anurupyena",                  sutra: "Ānurūpyena",                     skill: "Cube any 2-digit number using a³ expansion",     difficulty: 4, durationMin: 30, freePreview: false, svgKey: "VM_L4_4" },
      { id: "VM_L4_5", title: "Nikhilam — Multiply Near 1000",            sutra: "Nikhilam Navatashcaramam Dashatah", skill: "Multiply near-1000 numbers with 3-digit deviations", difficulty: 4, durationMin: 30, freePreview: false, svgKey: "VM_L4_5" },
      { id: "VM_L4_6", title: "Exponent Patterns — Vedic Insight",        sutra: "Ekadhikena power growth",        skill: "Spot and apply power patterns for fast computation", difficulty: 3, durationMin: 20, freePreview: false, svgKey: "VM_L4_6" },
      { id: "VM_L4_7", title: "Triangle Area Shortcuts",                  sutra: "Geometry + Vedic principles",    skill: "Find triangle areas using Pythagorean triples",   difficulty: 3, durationMin: 20, freePreview: false, svgKey: "VM_L4_7" },
      { id: "VM_L4_8", title: "Algebraic Identities — Fast Expansion",    sutra: "Ānurūpyena structural",          skill: "Expand (a±b)², (a+b)(a−b), (a±b)³ instantly",   difficulty: 4, durationMin: 25, freePreview: false, svgKey: "VM_L4_8" },
    ],
  },
  {
    id: "L5", order: 5, name: "Champion",
    tagline: "Mastery-level techniques for Olympiads & boards",
    emoji: "🌟", color: "#EC4899", gradeEquiv: "Grade 8",
    xpToUnlock: 1100, xpOnComplete: 400,
    lessons: [
      { id: "VM_L5_1", title: "Square Root by Inspection",                sutra: "Vilokanam",                      skill: "Find square roots by digit-pair grouping",        difficulty: 4, durationMin: 30, freePreview: true,  svgKey: "VM_L5_1" },
      { id: "VM_L5_2", title: "Cube Root by Inspection",                  sutra: "Vilokanam",                      skill: "Find cube roots by digit-triple grouping",        difficulty: 4, durationMin: 30, freePreview: false, svgKey: "VM_L5_2" },
      { id: "VM_L5_3", title: "Algebraic Identities — Advanced (a±b)³",  sutra: "Ānurūpyena + Dvandva Yoga",      skill: "Expand cubes using Pascal row 1-3-3-1",          difficulty: 4, durationMin: 25, freePreview: false, svgKey: "VM_L5_3" },
      { id: "VM_L5_4", title: "Simultaneous Equations — Vedic Method",    sutra: "Parāvartya + Sūnyam",            skill: "Solve 2×2 simultaneous equations in one step",   difficulty: 4, durationMin: 30, freePreview: false, svgKey: "VM_L5_4" },
      { id: "VM_L5_5", title: "Criss-Cross 4-Digit Multiplication",       sutra: "Ūrdhva-Tiryagbhyām full",       skill: "Multiply any two 4-digit numbers in 7 steps",    difficulty: 5, durationMin: 35, freePreview: false, svgKey: "VM_L5_5" },
      { id: "VM_L5_6", title: "Percentage Speed Arithmetic",              sutra: "Ānurūpyena percent decomposition", skill: "Calculate any percentage mentally",              difficulty: 3, durationMin: 20, freePreview: false, svgKey: "VM_L5_6" },
      { id: "VM_L5_7", title: "Nikhilam — Multiply Near 10000",           sutra: "Nikhilam Navatashcaramam Dashatah", skill: "Multiply near-10000 numbers with 4-digit deviations", difficulty: 5, durationMin: 30, freePreview: false, svgKey: "VM_L5_7" },
      { id: "VM_L5_8", title: "Divisibility Rules — Advanced (7, 11, 13)", sutra: "Ekadhikena / Ekanyūna",         skill: "Test divisibility by 7, 11, 13 using Vedic digit tests", difficulty: 4, durationMin: 25, freePreview: false, svgKey: "VM_L5_8" },
    ],
  },
];

// ─── Helper: get level by id ────────────────────────────────────────────────

export function getMsLevel(levelId: string): MsLevel | undefined {
  return MINDSUTRA_LEVELS.find((l) => l.id === levelId);
}

// ─── Helper: get lesson by id ───────────────────────────────────────────────

export function getMsLesson(lessonId: string): (MsLesson & { levelId: string }) | undefined {
  for (const level of MINDSUTRA_LEVELS) {
    const lesson = level.lessons.find((ls) => ls.id === lessonId);
    if (lesson) return { ...lesson, levelId: level.id };
  }
  return undefined;
}

// ─── Helper: determine starting level from grade + quiz score ───────────────

export function resolvePlacementLevel(schoolGrade: number, quizScore: number): string {
  // Always start at L1 regardless of grade or score, as per user requirement to build from basics
  return "L1";
}

// ─── Helper: total XP for a student level status ─────────────────────────────

export function xpForLevel(levelId: string): { toUnlock: number; onComplete: number } {
  const l = getMsLevel(levelId);
  return { toUnlock: l?.xpToUnlock ?? 0, onComplete: l?.xpOnComplete ?? 0 };
}

// ─── Helper: all 40 lessons flat ─────────────────────────────────────────────

export function getAllMsLessons(): (MsLesson & { levelId: string; levelName: string })[] {
  return MINDSUTRA_LEVELS.flatMap((level) =>
    level.lessons.map((lesson) => ({ ...lesson, levelId: level.id, levelName: level.name }))
  );
}

// ─── Backward-compat: map from old grade-based course id to new level ────────
// Used during transition period — old courseId → new level id

export const GRADE_TO_LEVEL_MAP: Record<number, string> = {
  4: "L1",
  5: "L1", // Was L2
  6: "L1", // Was L3
  7: "L1", // Was L4
  8: "L1", // Was L5
};

// ─── Backward-compat shim: old getMindSutraCatalog(gradeOrSlug) API ──────────
// appSession.ts and other legacy code call this to get a grade-keyed catalog.
// We map grade → level and return lessons formatted as SessionChapter objects.

type LegacyCatalog = {
  grade: number;
  gradeSlug: string;
  courseId: string;
  courseName: string;
  tagline: string;
  chapters: { code: string; title: string; durationMin: number; freePreview: boolean }[];
};

const GRADE_SLUG_MAP: Record<string, number> = {
  "grade-4": 4, "grade4": 4,
  "grade-5": 5, "grade5": 5,
  "grade-6": 6, "grade6": 6,
  "grade-7": 7, "grade7": 7,
  "grade-8": 8, "grade8": 8,
};

export function getMindSutraCatalog(gradeOrSlug: string | number): LegacyCatalog {
  const grade = typeof gradeOrSlug === "number"
    ? gradeOrSlug
    : (GRADE_SLUG_MAP[String(gradeOrSlug).toLowerCase()] ?? (parseInt(String(gradeOrSlug), 10) || 5));

  const clampedGrade = Math.max(4, Math.min(8, grade));
  const levelId = GRADE_TO_LEVEL_MAP[clampedGrade] ?? "L2";
  const level = getMsLevel(levelId)!;

  const gradeSlug = `grade-${clampedGrade}`;
  const courseId = `vm_${gradeSlug}`;

  return {
    grade: clampedGrade,
    gradeSlug,
    courseId,
    courseName: `MindSutra ${level.name} — ${level.gradeEquiv}`,
    tagline: level.tagline,
    chapters: level.lessons.map((lesson) => ({
      code: lesson.id,
      title: lesson.title,
      durationMin: lesson.durationMin,
      freePreview: lesson.freePreview,
    })),
  };
}
