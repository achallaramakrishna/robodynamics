// ─── NEET Lesson Plan Engine ───────────────────────────────────────────────
// Input:  StudentProfile + DiagnosticResult
// Output: LessonPlan with monthly/weekly/daily targets
// Storage: localStorage now → DB swap later (single layer change)

export type NeetSubject = "physics" | "chemistry" | "biology";
export type StudentStage = "grade_11_start" | "grade_12_start" | "mid_year" | "three_months_to_exam";

export interface StudentProfile {
  name: string;
  targetYear: number;             // 2026 | 2027
  neetDate: string;               // ISO date string e.g. "2027-05-02"
  hoursPerDay: number;            // realistic daily study hours
  goesToCoaching: boolean;
  isRepeater: boolean;
  biggestFear: string;
  selfRating: Record<NeetSubject, number>; // 1–5
  studentStage: StudentStage;     // detected based on targetYear + time remaining
  createdAt: string;
}

export interface ChapterDiagnostic {
  chapterCode: string;
  subject: NeetSubject;
  title: string;
  attempted: number;
  correct: number;
  accuracy: number;               // 0–100
  neetWeight: number;             // 1–5
}

export interface DiagnosticResult {
  completedAt: string;
  totalAttempted: number;
  totalCorrect: number;
  estimatedScore: number;         // extrapolated to /720
  chapterStats: ChapterDiagnostic[];
  subjectAccuracy: Record<NeetSubject, number>;
}

export type ChapterPriority = "critical" | "weak" | "medium" | "strong";

export interface PlannedChapter {
  chapterCode: string;
  subject: NeetSubject;
  title: string;
  priority: ChapterPriority;
  accuracy: number;
  neetWeight: number;
  weekAssigned: number;           // which week in the plan
  hoursAllocated: number;
  status: "not_started" | "in_progress" | "done";
}

export interface DailyTarget {
  date: string;                   // YYYY-MM-DD
  sessions: DailySession[];
  questionTarget: number;
  estimatedMinutes: number;
}

export interface DailySession {
  time: "morning" | "evening";
  type: "new_concept" | "practice" | "revision" | "mock_test" | "doubt_clearing";
  chapterCode: string;
  chapterTitle: string;
  subject: NeetSubject;
  durationMinutes: number;
  description: string;
}

export interface WeeklyTarget {
  weekNumber: number;
  startDate: string;
  endDate: string;
  chapters: PlannedChapter[];
  mockTest: boolean;
  mockTestType: "chapter" | "subject" | "full" | "none";
  scoreTarget: number;
  focusSubject: NeetSubject;
}

export interface MonthlyMilestone {
  month: number;                  // 1-based
  label: string;
  startDate: string;
  endDate: string;
  scoreTarget: number;
  focusArea: string;
  weeklyTargets: WeeklyTarget[];
}

export interface LessonPlan {
  generatedAt: string;
  daysToNeet: number;
  currentEstimatedScore: number;
  targetScore: number;
  totalWeeks: number;
  phases: PlanPhase[];
  monthly: MonthlyMilestone[];
  todayPlan: DailyTarget;
  weekPlan: WeeklyTarget | null;
  orderedChapters: PlannedChapter[];
}

export type PlanPhase = {
  name: string;
  weeks: string;
  description: string;
  color: string;
};

// ─── Stage-Aware Configurations ──────────────────────────────────────────────

export const STAGE_CONFIG: Record<StudentStage, {
  label: string;
  diagnosticDifficultyRange: [string, string];  // "easy" | "medium" | "hard"
  mockDifficultyDistribution: Record<string, number>; // { easy: %, medium: %, hard: % }
  mockFrequency: "weekly" | "twice_weekly" | "daily" | "twice_daily";
  timelineWeeks: number;
  mockTypeRecommendation: "chapter" | "subject" | "full";
}> = {
  grade_11_start: {
    label: "Grade 11 Beginning",
    diagnosticDifficultyRange: ["easy", "medium"],
    mockDifficultyDistribution: { easy: 0.4, medium: 0.4, hard: 0.2 },
    mockFrequency: "weekly",
    timelineWeeks: 60,
    mockTypeRecommendation: "chapter",
  },
  grade_12_start: {
    label: "Grade 12 Beginning",
    diagnosticDifficultyRange: ["medium", "medium"],
    mockDifficultyDistribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
    mockFrequency: "twice_weekly",
    timelineWeeks: 36,
    mockTypeRecommendation: "subject",
  },
  mid_year: {
    label: "Mid-Year Preparation",
    diagnosticDifficultyRange: ["medium", "hard"],
    mockDifficultyDistribution: { easy: 0.2, medium: 0.5, hard: 0.3 },
    mockFrequency: "twice_weekly",
    timelineWeeks: 20,
    mockTypeRecommendation: "full",
  },
  three_months_to_exam: {
    label: "3 Months to Exam",
    diagnosticDifficultyRange: ["hard", "hard"],
    mockDifficultyDistribution: { easy: 0.1, medium: 0.4, hard: 0.5 },
    mockFrequency: "daily",
    timelineWeeks: 12,
    mockTypeRecommendation: "full",
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const HOURS_PER_CHAPTER: Record<ChapterPriority, number> = {
  critical: 5,
  weak:     4,
  medium:   2.5,
  strong:   1,
};

const ALL_CHAPTER_WEIGHTS: Record<string, number> = {
  BIO_HUMAN_PHYSIO: 5, BIO_REPRODUCTION: 5, BIO_GENETICS: 5,
  BIO_PLANT_PHYSIO: 4, BIO_CELL_BIOLOGY: 4, BIO_ECOLOGY: 4,
  BIO_EVOLUTION: 3, BIO_BIOTECHNOLOGY: 3, BIO_DIVERSITY: 3, BIO_BIOMOLECULES: 3,
  PHY_OPTICS: 5, PHY_MODERN_PHYSICS: 5, PHY_CURRENT_ELECTRICITY: 4,
  PHY_WAVES: 4, PHY_MECHANICS: 4, PHY_THERMODYNAMICS: 3,
  PHY_MAGNETISM: 3, PHY_SEMICONDUCTOR: 3, PHY_GRAVITATION: 2, PHY_DUAL_NATURE: 2,
  CHEM_ORGANIC: 5, CHEM_COORDINATION: 5, CHEM_P_BLOCK: 4,
  CHEM_EQUILIBRIUM: 4, CHEM_ELECTROCHEMISTRY: 4, CHEM_THERMODYNAMICS: 3,
  CHEM_SOLUTIONS: 3, CHEM_BONDING: 4, CHEM_BIOMOLECULES: 2, CHEM_D_F_BLOCK: 2,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getPriority(accuracy: number, neetWeight: number): ChapterPriority {
  if (accuracy < 40 && neetWeight >= 4) return "critical";
  if (accuracy < 40 || (accuracy < 60 && neetWeight >= 4)) return "weak";
  if (accuracy >= 75) return "strong";
  return "medium";
}

function getPhaseForWeek(week: number, totalWeeks: number): PlanPhase {
  const pct = week / totalWeeks;
  if (pct <= 0.35) return { name: "Foundation Repair", weeks: `1–${Math.round(totalWeeks * 0.35)}`, description: "Fix critical weak chapters", color: "#EF4444" };
  if (pct <= 0.65) return { name: "Concept Mastery",   weeks: `${Math.round(totalWeeks * 0.35) + 1}–${Math.round(totalWeeks * 0.65)}`, description: "Build medium chapters, mock integration", color: "#F59E0B" };
  if (pct <= 0.85) return { name: "Integration",       weeks: `${Math.round(totalWeeks * 0.65) + 1}–${Math.round(totalWeeks * 0.85)}`, description: "Full mocks every week, cross-chapter links", color: "#3B82F6" };
  return { name: "Consolidation", weeks: `${Math.round(totalWeeks * 0.85) + 1}–${totalWeeks}`, description: "Past papers, speed drills, revision only", color: "#10B981" };
}

// ─── Core: assign chapters to weeks ──────────────────────────────────────────

function assignChaptersToWeeks(
  chapters: PlannedChapter[],
  totalWeeks: number,
  hoursPerDay: number
): PlannedChapter[] {
  const hoursPerWeek = hoursPerDay * 7 * 0.75; // 75% study efficiency
  const studyWeeks = Math.floor(totalWeeks * 0.85); // last 15% = mocks only

  // Sort: critical first, then weak, then medium, then strong
  // Within same priority: higher neetWeight first
  const priorityOrder: Record<ChapterPriority, number> = { critical: 0, weak: 1, medium: 2, strong: 3 };
  const sorted = [...chapters].sort((a, b) => {
    const pd = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pd !== 0) return pd;
    return b.neetWeight - a.neetWeight;
  });

  let currentWeek = 1;
  let hoursUsedThisWeek = 0;
  const assigned: PlannedChapter[] = [];

  for (const ch of sorted) {
    if (currentWeek > studyWeeks) {
      assigned.push({ ...ch, weekAssigned: studyWeeks, status: "not_started" });
      continue;
    }
    assigned.push({ ...ch, weekAssigned: currentWeek, status: "not_started" });
    hoursUsedThisWeek += ch.hoursAllocated;
    if (hoursUsedThisWeek >= hoursPerWeek) {
      currentWeek++;
      hoursUsedThisWeek = 0;
    }
  }
  return assigned;
}

// ─── Build today's plan ───────────────────────────────────────────────────────

function buildTodayPlan(
  orderedChapters: PlannedChapter[],
  hoursPerDay: number,
  daysToNeet: number
): DailyTarget {
  const today = toISO(new Date());
  const sessions: DailySession[] = [];

  // Find current week's chapters (week 1 = first in list)
  const week1Chapters = orderedChapters.filter((c) => c.weekAssigned === 1).slice(0, 3);

  const morningMinutes = Math.min(45, Math.floor(hoursPerDay * 60 * 0.55));
  const eveningMinutes = Math.min(35, Math.floor(hoursPerDay * 60 * 0.45));

  if (week1Chapters[0]) {
    sessions.push({
      time: "morning",
      type: "new_concept",
      chapterCode: week1Chapters[0].chapterCode,
      chapterTitle: week1Chapters[0].title,
      subject: week1Chapters[0].subject,
      durationMinutes: morningMinutes,
      description: `Study ${week1Chapters[0].title} — focus on NEET-level concepts and worked examples`,
    });
  }

  if (week1Chapters[1] || week1Chapters[0]) {
    const revCh = week1Chapters[1] || week1Chapters[0];
    sessions.push({
      time: "evening",
      type: "practice",
      chapterCode: revCh.chapterCode,
      chapterTitle: revCh.title,
      subject: revCh.subject,
      durationMinutes: eveningMinutes,
      description: `Practice 10 MCQs on ${revCh.title} — check explanations for every wrong answer`,
    });
  }

  const totalMin = sessions.reduce((s, x) => s + x.durationMinutes, 0);

  return {
    date: today,
    sessions,
    questionTarget: Math.max(10, Math.floor(totalMin / 3)),
    estimatedMinutes: totalMin,
  };
}

// ─── Build this week's plan ───────────────────────────────────────────────────

function buildWeekPlan(
  orderedChapters: PlannedChapter[],
  daysToNeet: number,
  totalWeeks: number,
  currentEstimatedScore: number
): WeeklyTarget {
  const today = new Date();
  const endOfWeek = addDays(today, 6);
  const week1Chapters = orderedChapters.filter((c) => c.weekAssigned === 1);
  const pct = 1 / totalWeeks;

  const mockTestType: WeeklyTarget["mockTestType"] =
    daysToNeet > 180 ? "chapter" :
    daysToNeet > 90  ? "subject" : "full";

  const dominantSubject = (["biology", "physics", "chemistry"] as NeetSubject[])
    .map((s) => ({ s, count: week1Chapters.filter((c) => c.subject === s).length }))
    .sort((a, b) => b.count - a.count)[0]?.s ?? "biology";

  return {
    weekNumber: 1,
    startDate: toISO(today),
    endDate: toISO(endOfWeek),
    chapters: week1Chapters,
    mockTest: true,
    mockTestType,
    scoreTarget: Math.min(720, currentEstimatedScore + 20),
    focusSubject: dominantSubject,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateLessonPlan(
  profile: StudentProfile,
  diagnostic: DiagnosticResult,
  targetScore: number = 600
): LessonPlan {
  const daysToNeet = daysUntil(profile.neetDate);
  const totalWeeks = Math.floor(daysToNeet / 7);

  // Build planned chapters from diagnostic stats
  const plannedChapters: PlannedChapter[] = diagnostic.chapterStats.map((cs) => {
    const priority = getPriority(cs.accuracy, cs.neetWeight);
    return {
      chapterCode: cs.chapterCode,
      subject: cs.subject,
      title: cs.title,
      priority,
      accuracy: cs.accuracy,
      neetWeight: cs.neetWeight,
      weekAssigned: 1,
      hoursAllocated: HOURS_PER_CHAPTER[priority],
      status: "not_started",
    };
  });

  // Fill in chapters not covered by diagnostic (assign medium priority)
  for (const [code, weight] of Object.entries(ALL_CHAPTER_WEIGHTS)) {
    if (!plannedChapters.find((c) => c.chapterCode === code)) {
      const subject: NeetSubject = code.startsWith("BIO") ? "biology" : code.startsWith("PHY") ? "physics" : "chemistry";
      plannedChapters.push({
        chapterCode: code,
        subject,
        title: code.replace(/_/g, " ").replace(/^(BIO|PHY|CHEM) /, ""),
        priority: "medium",
        accuracy: 50,
        neetWeight: weight,
        weekAssigned: 1,
        hoursAllocated: HOURS_PER_CHAPTER["medium"],
        status: "not_started",
      });
    }
  }

  const orderedChapters = assignChaptersToWeeks(plannedChapters, totalWeeks, profile.hoursPerDay);

  // Build monthly milestones
  const monthly: MonthlyMilestone[] = [];
  const today = new Date();
  const totalMonths = Math.ceil(daysToNeet / 30);
  const scoreGap = targetScore - diagnostic.estimatedScore;
  const scorePerMonth = totalMonths > 0 ? scoreGap / totalMonths : 0;

  for (let m = 1; m <= Math.min(totalMonths, 6); m++) {
    const startDate = addDays(today, (m - 1) * 30);
    const endDate = addDays(today, m * 30 - 1);
    const weeksInMonth = [m * 4 - 3, m * 4 - 2, m * 4 - 1, m * 4];

    const monthChapters = orderedChapters.filter((c) => weeksInMonth.includes(c.weekAssigned));
    const phase = getPhaseForWeek(m * 4, totalWeeks);

    const weeklyTargets: WeeklyTarget[] = weeksInMonth.map((wk) => {
      const wkChapters = orderedChapters.filter((c) => c.weekAssigned === wk);
      const dom = (["biology", "physics", "chemistry"] as NeetSubject[])
        .map((s) => ({ s, n: wkChapters.filter((c) => c.subject === s).length }))
        .sort((a, b) => b.n - a.n)[0]?.s ?? "biology";

      return {
        weekNumber: wk,
        startDate: toISO(addDays(today, (wk - 1) * 7)),
        endDate: toISO(addDays(today, wk * 7 - 1)),
        chapters: wkChapters,
        mockTest: wk % 2 === 0,
        mockTestType: daysToNeet > 120 ? "subject" : "full",
        scoreTarget: Math.min(720, Math.round(diagnostic.estimatedScore + scorePerMonth * m)),
        focusSubject: dom,
      };
    });

    monthly.push({
      month: m,
      label: startDate.toLocaleString("default", { month: "long", year: "numeric" }),
      startDate: toISO(startDate),
      endDate: toISO(endDate),
      scoreTarget: Math.min(720, Math.round(diagnostic.estimatedScore + scorePerMonth * m)),
      focusArea: phase.name,
      weeklyTargets,
    });
  }

  const phases: PlanPhase[] = [
    { name: "Foundation Repair",  weeks: `1–${Math.round(totalWeeks * 0.35)}`,  description: "Fix critical & weak chapters",       color: "#EF4444" },
    { name: "Concept Mastery",    weeks: `${Math.round(totalWeeks * 0.35)+1}–${Math.round(totalWeeks * 0.65)}`, description: "Build medium chapters + subject mocks", color: "#F59E0B" },
    { name: "Integration",        weeks: `${Math.round(totalWeeks * 0.65)+1}–${Math.round(totalWeeks * 0.85)}`, description: "Weekly full mocks + cross-chapter",      color: "#3B82F6" },
    { name: "Consolidation",      weeks: `${Math.round(totalWeeks * 0.85)+1}–${totalWeeks}`,                    description: "Past papers, speed drills, revision",    color: "#10B981" },
  ];

  const todayPlan = buildTodayPlan(orderedChapters, profile.hoursPerDay, daysToNeet);
  const weekPlan  = buildWeekPlan(orderedChapters, daysToNeet, totalWeeks, diagnostic.estimatedScore);

  return {
    generatedAt: new Date().toISOString(),
    daysToNeet,
    currentEstimatedScore: diagnostic.estimatedScore,
    targetScore,
    totalWeeks,
    phases,
    monthly,
    todayPlan,
    weekPlan,
    orderedChapters,
  };
}

// ─── Session key (only localStorage value — all state is DB-driven) ──────────
// Clearing the DB fully resets a student. No other localStorage flags needed.

const SESSION_KEY = "meera_session_key";

export function getOrCreateSessionKey(): string {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem(SESSION_KEY);
  if (!key) {
    key = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, key);
  }
  return key;
}

// ─── DB status check (used for routing) ──────────────────────────────────────

export async function getStudentStatus(): Promise<{ registered: boolean; onboarded: boolean; hasDiagnostic: boolean; studentClass: string | null }> {
  const key = getOrCreateSessionKey();
  if (!key) return { registered: false, onboarded: false, hasDiagnostic: false, studentClass: null };
  try {
    const res = await fetch(`/api/neet/status?key=${encodeURIComponent(key)}`);
    return await res.json();
  } catch {
    return { registered: false, onboarded: false, hasDiagnostic: false, studentClass: null };
  }
}

// ─── DB API helpers ───────────────────────────────────────────────────────────

export async function saveProfileToDb(profile: StudentProfile): Promise<void> {
  const key = getOrCreateSessionKey();
  await fetch("/api/neet/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, profile }),
  });
}

export async function saveDiagnosticToDb(diagnostic: DiagnosticResult): Promise<void> {
  const key = getOrCreateSessionKey();
  await fetch("/api/neet/diagnostic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, diagnostic }),
  });
  // State is now fully DB-driven; no localStorage flag needed
}

export async function savePlanToDb(plan: LessonPlan): Promise<void> {
  const key = getOrCreateSessionKey();
  await fetch("/api/neet/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, plan }),
  });
}

export async function loadProfileFromDb(): Promise<StudentProfile | null> {
  const key = getOrCreateSessionKey();
  if (!key) return null;
  try {
    const res = await fetch(`/api/neet/profile?key=${encodeURIComponent(key)}`);
    const data = await res.json();
    return data.profile ?? null;
  } catch { return null; }
}

export async function loadDiagnosticFromDb(): Promise<DiagnosticResult | null> {
  const key = getOrCreateSessionKey();
  if (!key) return null;
  try {
    const res = await fetch(`/api/neet/diagnostic?key=${encodeURIComponent(key)}`);
    const data = await res.json();
    return data.diagnostic ?? null;
  } catch { return null; }
}
