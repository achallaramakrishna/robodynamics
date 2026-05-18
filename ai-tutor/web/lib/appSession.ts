import { getMindSparcCatalog } from "./mindsparcCatalog";
import { getMindSutraCatalog } from "./mindsutraCatalog";
import { buildMindSutraLearnerSnapshot, summarizeMindSutraSkillMastery } from "./mindsutraPersonalization";
import { buildCodeSutraLearnerSnapshot, summarizeCodeSutraSkillMastery } from "./codesutraPersonalization";

export const APP_SESSION_COOKIE = "rd_user_session";

export type SessionRole = "PARENT" | "STUDENT";
export type SessionProductSlug = "mindsutra" | "mindsparc" | "codesutra" | "vidya" | "yamuna";

type SessionChapter = {
  code: string;
  title: string;
  durationMin: number;
  freePreview: boolean;
};

type SessionCatalog = {
  productSlug: SessionProductSlug;
  productName: string;
  grade: number;
  gradeSlug: string;
  courseId: string;
  courseName: string;
  tagline: string;
  chapters: SessionChapter[];
};

export type SessionEnrollment = {
  productSlug: SessionProductSlug;
  productName: string;
  courseId: string;
  courseName: string;
  grade: number;
  gradeSlug: string;
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter: string;
  currentChapterName: string;
  accuracy: number;
  status: "not_started" | "in_progress" | "completed";
  priceLabel: string;
};

export type SessionRecentActivity = {
  date: string;
  chapter: string;
  duration: string;
  accuracy: number;
  score: string;
};

export type SessionSkillMastery = {
  productSlug: SessionProductSlug;
  lessonId: string;
  skillKey: string;
  skillName: string;
  attempts: number;
  correct: number;
  hintsUsed: number;
  conceptChecks: number;
  conceptClearCount: number;
  transferChecks: number;
  transferCorrect: number;
  confidenceScoreTotal: number;
  masteryScore: number;
  recentDelta: number;
  lastUpdated: string;
};

export type AppSession = {
  role: SessionRole;
  userId: number;
  childId: number;
  parentName: string;
  childName: string;
  grade: number;
  xp: number;
  streak: number;
  weakAreas: string[];
  monthlyMinutes: number;
  activityHeatmap: number[];
  enrollments: SessionEnrollment[];
  recentSessions: SessionRecentActivity[];
  skillMastery: SessionSkillMastery[];
  completedLessonIds: string[];
};

type BuildSessionOptions = {
  role?: SessionRole;
  grade?: number;
  productSlug?: SessionProductSlug;
  parentName?: string;
  childName?: string;
  userId?: number;
  childId?: number;
};

function formatScore(correct: number, total: number): string {
  return `${correct}/${total}`;
}

function normalizeProductSlug(value?: string | null): SessionProductSlug {
  const v = String(value || "").trim().toLowerCase();
  if (v === "mindsparc" || v === "mindspark") return "mindsparc";
  if (v === "codesutra" || v === "python" || v === "python-ai") return "codesutra";
  return "mindsutra";
}

function productNameForSlug(productSlug: SessionProductSlug): string {
  if (productSlug === "mindsparc") return "Yukti";
  if (productSlug === "codesutra") return "CodeSutra";
  return "Vedika";
}

function inferProductSlugFromCourseId(courseId?: string | null): SessionProductSlug {
  const normalized = String(courseId || "").trim().toLowerCase();
  if (normalized.startsWith("aptitude_")) return "mindsparc";
  if (normalized.includes("python") || normalized.startsWith("py_")) return "codesutra";
  return "mindsutra";
}

function getPriceLabel(productSlug: SessionProductSlug): string {
  if (productSlug === "mindsparc") return "INR 1,299 lifetime";
  if (productSlug === "codesutra") return "INR 1,799 lifetime";
  return "INR 1,499 lifetime";
}

function getDefaultWeakAreas(productSlug: SessionProductSlug): string[] {
  if (productSlug === "mindsparc") {
    return [
      "Multi-step number series",
      "Set and diagram reasoning",
    ];
  }
  return [
    "Carries in criss-cross multiplication",
    "Denominator simplification",
  ];
}

function getCatalog(productSlug: SessionProductSlug, gradeOrSlug: string | number): SessionCatalog {
  if (productSlug === "mindsparc") {
    const catalog = getMindSparcCatalog(gradeOrSlug);
    if (catalog.grade == null || !catalog.gradeSlug) {
      throw new Error(`MindSparc grade catalog not found for ${String(gradeOrSlug)}`);
    }
    return {
      productSlug,
      productName: productNameForSlug(productSlug),
      grade: catalog.grade,
      gradeSlug: catalog.gradeSlug,
      courseId: catalog.courseId,
      courseName: catalog.courseName,
      tagline: catalog.tagline,
      chapters: catalog.chapters,
    };
  }

  const catalog = getMindSutraCatalog(gradeOrSlug);
  return {
    productSlug,
    productName: productNameForSlug(productSlug),
    grade: catalog.grade,
    gradeSlug: catalog.gradeSlug,
    courseId: catalog.courseId,
    courseName: catalog.courseName,
    tagline: catalog.tagline,
    chapters: catalog.chapters,
  };
}

function buildEnrollment(
  productSlug: SessionProductSlug,
  grade: number,
  chaptersCompleted = 3,
): SessionEnrollment {
  const catalog = getCatalog(productSlug, grade);
  const completed = Math.max(0, Math.min(chaptersCompleted, catalog.chapters.length));
  const nextChapter = catalog.chapters[Math.min(completed, catalog.chapters.length - 1)];

  return {
    productSlug,
    productName: catalog.productName,
    courseId: catalog.courseId,
    courseName: catalog.courseName,
    grade: catalog.grade,
    gradeSlug: catalog.gradeSlug,
    chaptersCompleted: completed,
    totalChapters: catalog.chapters.length,
    currentChapter: nextChapter.code,
    currentChapterName: nextChapter.title,
    accuracy: 78,
    status: completed <= 0 ? "not_started" : completed >= catalog.chapters.length ? "completed" : "in_progress",
    priceLabel: getPriceLabel(productSlug),
  };
}

function buildRecentSessions(productSlug: SessionProductSlug, grade: number): SessionRecentActivity[] {
  const catalog = getCatalog(productSlug, grade);
  return [
    {
      date: "Mar 19, 4:30 PM",
      chapter: catalog.chapters[2]?.title ?? catalog.chapters[0].title,
      duration: "22 min",
      accuracy: 83,
      score: formatScore(18, 22),
    },
    {
      date: "Mar 18, 5:00 PM",
      chapter: catalog.chapters[1]?.title ?? catalog.chapters[0].title,
      duration: "18 min",
      accuracy: 71,
      score: formatScore(14, 20),
    },
    {
      date: "Mar 17, 6:15 PM",
      chapter: catalog.chapters[0].title,
      duration: "25 min",
      accuracy: 90,
      score: formatScore(22, 24),
    },
  ];
}

function normalizeEnrollment(
  enrollment: Partial<SessionEnrollment>,
  fallbackGrade: number,
  fallbackProductSlug: SessionProductSlug,
): SessionEnrollment {
  const productSlug = normalizeProductSlug(
    enrollment.productSlug || (enrollment.courseId ? inferProductSlugFromCourseId(enrollment.courseId) : fallbackProductSlug),
  );
  const grade = Number(enrollment.grade) || fallbackGrade;
  const chaptersCompleted = Math.max(0, Number(enrollment.chaptersCompleted) || 0);
  const base = buildEnrollment(productSlug, grade, chaptersCompleted);
  const status = enrollment.status;

  return {
    ...base,
    ...enrollment,
    productSlug,
    productName: base.productName,
    courseId: base.courseId,
    courseName: base.courseName,
    grade: base.grade,
    gradeSlug: base.gradeSlug,
    chaptersCompleted,
    totalChapters: base.totalChapters,
    currentChapter: String(enrollment.currentChapter || base.currentChapter),
    currentChapterName: String(enrollment.currentChapterName || base.currentChapterName),
    accuracy: Number(enrollment.accuracy) > 0 ? Number(enrollment.accuracy) : base.accuracy,
    status: status === "not_started" || status === "in_progress" || status === "completed" ? status : base.status,
    priceLabel: String(enrollment.priceLabel || base.priceLabel),
  };
}

export function buildDefaultSession(options: BuildSessionOptions = {}): AppSession {
  const grade = options.grade ?? 5;
  const productSlug = normalizeProductSlug(options.productSlug);

  return {
    role: options.role ?? "STUDENT",
    userId: options.userId ?? 1,
    childId: options.childId ?? options.userId ?? 1,
    parentName: options.parentName?.trim() || "Sunita",
    childName: options.childName?.trim() || "Priya",
    grade,
    xp: 1240,
    streak: 5,
    weakAreas: getDefaultWeakAreas(productSlug),
    monthlyMinutes: 270,
    activityHeatmap: [
      0, 0, 0, 25, 30, 0, 0,
      20, 45, 15, 0, 30, 25, 0,
      10, 0, 25, 30, 15, 0, 0,
      20, 25, 0, 15, 30, 0, 0,
    ],
    enrollments: [buildEnrollment(productSlug, grade)],
    recentSessions: buildRecentSessions(productSlug, grade),
    skillMastery: [],
    completedLessonIds: [],
  };
}

export function parseAppSession(rawValue?: string | null): AppSession | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<AppSession> & Partial<{ productSlug: SessionProductSlug }>;
    const fallbackEnrollment = Array.isArray(parsed.enrollments) && parsed.enrollments.length > 0
      ? parsed.enrollments[0] as Partial<SessionEnrollment>
      : undefined;
    const inferredProductSlug = normalizeProductSlug(
      parsed.productSlug || fallbackEnrollment?.productSlug || (fallbackEnrollment?.courseId ? inferProductSlugFromCourseId(fallbackEnrollment.courseId) : "mindsutra"),
    );
    const grade = Number(parsed.grade) || Number(fallbackEnrollment?.grade) || 5;
    const session = buildDefaultSession({
      role: parsed.role === "PARENT" ? "PARENT" : "STUDENT",
      grade,
      productSlug: inferredProductSlug,
      parentName: parsed.parentName,
      childName: parsed.childName,
      userId: Number(parsed.userId) || 1,
      childId: Number(parsed.childId) || Number(parsed.userId) || 1,
    });
    const parsedEnrollments = Array.isArray(parsed.enrollments) && parsed.enrollments.length > 0
      ? parsed.enrollments.map((item) => normalizeEnrollment(item as Partial<SessionEnrollment>, grade, inferredProductSlug))
      : session.enrollments;

    return {
      ...session,
      ...parsed,
      grade,
      role: parsed.role === "PARENT" ? "PARENT" : "STUDENT",
      enrollments: parsedEnrollments,
      recentSessions: Array.isArray(parsed.recentSessions) && parsed.recentSessions.length > 0
        ? parsed.recentSessions as SessionRecentActivity[]
        : session.recentSessions,
      weakAreas: Array.isArray(parsed.weakAreas) && parsed.weakAreas.length > 0
        ? parsed.weakAreas as string[]
        : session.weakAreas,
      activityHeatmap: Array.isArray(parsed.activityHeatmap) && parsed.activityHeatmap.length === 28
        ? parsed.activityHeatmap as number[]
        : session.activityHeatmap,
      skillMastery: Array.isArray(parsed.skillMastery)
        ? parsed.skillMastery as SessionSkillMastery[]
        : session.skillMastery,
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds.filter((item): item is string => typeof item === "string")
        : session.completedLessonIds,
    };
  } catch {
    return null;
  }
}

export function serializeAppSession(session: AppSession): string {
  return JSON.stringify(session);
}

export function ensureEnrollment(
  session: AppSession,
  grade: number,
  productSlug: SessionProductSlug = "mindsutra",
): AppSession {
  const normalizedProduct = normalizeProductSlug(productSlug);
  const existing = session.enrollments.find((item) => item.productSlug === normalizedProduct && item.grade === grade);
  if (existing) {
    return session;
  }

  return {
    ...session,
    grade,
    enrollments: [buildEnrollment(normalizedProduct, grade, 0), ...session.enrollments],
  };
}

export function buildStudentHomeData(session: AppSession) {
  return {
    name: session.childName,
    grade: session.grade,
    xp: session.xp,
    streak: session.streak,
    enrollments: session.enrollments,
    recentSessions: session.recentSessions.map((item) => ({
      date: item.date,
      chapter: item.chapter,
      duration: item.duration,
      accuracy: item.accuracy,
    })),
  };
}

export function buildParentDashboardData(session: AppSession, productId?: string) {
  const normProduct = normalizeProductSlug(productId);
  const enrollment = session.enrollments.find(e => e.productSlug === normProduct) ?? buildEnrollment(normProduct, session.grade);
  const catalog = getCatalog(enrollment.productSlug, enrollment.grade);
  
  let strongestSkills: string[] = [];
  let weakSkills: string[] = [];
  let coachLine = "";
  let supportMode: string = "balanced";
  let recommendedNextFocus = "Next lesson";

  if (normProduct === "codesutra") {
    const summary = summarizeCodeSutraSkillMastery(session);
    const snapshot = buildCodeSutraLearnerSnapshot(session, catalog.chapters[0]?.code ?? "PY_L1_01_SETUP");
    strongestSkills = summary.strongestSkills;
    weakSkills = summary.weakSkills;
    coachLine = snapshot.coachLine;
    supportMode = snapshot.supportMode;
    recommendedNextFocus = snapshot.recommendedNextFocus;
  } else {
    const summary = summarizeMindSutraSkillMastery(session);
    const snapshot = buildMindSutraLearnerSnapshot(session, catalog.chapters[0]?.code ?? "VM_L1_1");
    strongestSkills = summary.strongestSkills;
    weakSkills = summary.improvingSkills; // Using improvingSkills as proxy for weak/active
    coachLine = snapshot.coachLine;
    supportMode = snapshot.supportMode;
    recommendedNextFocus = snapshot.recommendedNextFocus;
  }

  return {
    name: session.childName,
    productSlug: enrollment.productSlug,
    productName: enrollment.productName,
    grade: enrollment.grade,
    gradeSlug: enrollment.gradeSlug,
    totalChapters: enrollment.totalChapters,
    monthlyMinutes: session.monthlyMinutes,
    chaptersCompleted: enrollment.chaptersCompleted,
    avgAccuracy: enrollment.accuracy,
    streak: session.streak,
    activityHeatmap: session.activityHeatmap,
    chapters: catalog.chapters.map((chapter, index) => {
      const num = index + 1;
      const isDone = num <= enrollment.chaptersCompleted;
      const isCurrent = num === enrollment.chaptersCompleted + 1 && enrollment.status !== "completed";
      return {
        num,
        title: chapter.title,
        status: isDone ? "mastered" : isCurrent ? "in_progress" : "locked",
        qDone: isDone ? 24 : isCurrent ? 12 : 0,
        qTotal: 24,
        accuracy: isDone ? Math.min(92, enrollment.accuracy + 8) : isCurrent ? enrollment.accuracy : 0,
        minutes: isDone ? chapter.durationMin : isCurrent ? Math.round(chapter.durationMin / 2) : 0,
      };
    }),
    weakAreas: weakSkills.length ? weakSkills : session.weakAreas,
    strongestSkills,
    improvingSkills: weakSkills,
    recommendedNextFocus,
    tutorSummary: coachLine,
    supportMode,
    recentSessions: session.recentSessions.map((item) => ({
      date: item.date,
      chapter: item.chapter,
      duration: item.duration,
      score: item.score,
    })),
  };
}

export function buildCourseHubData(
  session: AppSession,
  productSlug: SessionProductSlug,
  gradeSlug: string,
) {
  const normalizedProduct = normalizeProductSlug(productSlug);
  const catalog = getCatalog(normalizedProduct, gradeSlug);
  const enrollment = session.enrollments.find((item) => item.productSlug === normalizedProduct && item.gradeSlug === catalog.gradeSlug)
    ?? buildEnrollment(normalizedProduct, catalog.grade, 0);

  return {
    productSlug: normalizedProduct,
    productName: catalog.productName,
    childName: session.childName,
    courseName: enrollment.courseName,
    tagline: catalog.tagline,
    grade: catalog.grade,
    gradeSlug: catalog.gradeSlug,
    chaptersCompleted: enrollment.chaptersCompleted,
    totalChapters: enrollment.totalChapters,
    currentChapter: enrollment.currentChapter,
    currentChapterName: enrollment.currentChapterName,
    accuracy: enrollment.accuracy,
    xp: session.xp,
    streak: session.streak,
    chapters: catalog.chapters.map((chapter, index) => {
      const num = index + 1;
      const locked = num > enrollment.chaptersCompleted + 1;
      const current = chapter.code === enrollment.currentChapter;
      return {
        ...chapter,
        num,
        status: (num <= enrollment.chaptersCompleted ? "completed" : current ? "current" : locked ? "locked" : "available") as "completed" | "current" | "locked" | "available",
      };
    }),
  };
}
