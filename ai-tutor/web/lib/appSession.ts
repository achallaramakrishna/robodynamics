import { getMindSutraCatalog } from "./mindsutraCatalog";

export const APP_SESSION_COOKIE = "rd_user_session";

export type SessionRole = "PARENT" | "STUDENT";

export type SessionEnrollment = {
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
};

type BuildSessionOptions = {
  role?: SessionRole;
  grade?: number;
  parentName?: string;
  childName?: string;
  userId?: number;
  childId?: number;
};

function formatScore(correct: number, total: number): string {
  return `${correct}/${total}`;
}

function buildEnrollment(grade: number, chaptersCompleted = 3): SessionEnrollment {
  const catalog = getMindSutraCatalog(grade);
  const nextChapter = catalog.chapters[Math.min(chaptersCompleted, catalog.chapters.length - 1)];
  return {
    courseId: catalog.courseId,
    courseName: catalog.courseName,
    grade: catalog.grade,
    gradeSlug: catalog.gradeSlug,
    chaptersCompleted,
    totalChapters: catalog.chapters.length,
    currentChapter: nextChapter.code,
    currentChapterName: nextChapter.title,
    accuracy: 78,
    status: chaptersCompleted <= 0 ? "not_started" : chaptersCompleted >= catalog.chapters.length ? "completed" : "in_progress",
    priceLabel: "INR 1,499 lifetime",
  };
}

function buildRecentSessions(grade: number): SessionRecentActivity[] {
  const catalog = getMindSutraCatalog(grade);
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

export function buildDefaultSession(options: BuildSessionOptions = {}): AppSession {
  const grade = options.grade ?? 5;
  return {
    role: options.role ?? "STUDENT",
    userId: options.userId ?? 1,
    childId: options.childId ?? options.userId ?? 1,
    parentName: options.parentName?.trim() || "Sunita",
    childName: options.childName?.trim() || "Priya",
    grade,
    xp: 1240,
    streak: 5,
    weakAreas: [
      "Carries in criss-cross multiplication",
      "Denominator simplification",
    ],
    monthlyMinutes: 270,
    activityHeatmap: [
      0, 0, 0, 25, 30, 0, 0,
      20, 45, 15, 0, 30, 25, 0,
      10, 0, 25, 30, 15, 0, 0,
      20, 25, 0, 15, 30, 0, 0,
    ],
    enrollments: [buildEnrollment(grade)],
    recentSessions: buildRecentSessions(grade),
  };
}

export function parseAppSession(rawValue?: string | null): AppSession | null {
  if (!rawValue) {
    return null;
  }
  try {
    const parsed = JSON.parse(rawValue) as Partial<AppSession>;
    const grade = Number(parsed.grade) || 5;
    const session = buildDefaultSession({
      role: parsed.role === "PARENT" ? "PARENT" : "STUDENT",
      grade,
      parentName: parsed.parentName,
      childName: parsed.childName,
      userId: Number(parsed.userId) || 1,
      childId: Number(parsed.childId) || Number(parsed.userId) || 1,
    });
    return {
      ...session,
      ...parsed,
      grade,
      role: parsed.role === "PARENT" ? "PARENT" : "STUDENT",
      enrollments: Array.isArray(parsed.enrollments) && parsed.enrollments.length > 0
        ? parsed.enrollments as SessionEnrollment[]
        : session.enrollments,
      recentSessions: Array.isArray(parsed.recentSessions) && parsed.recentSessions.length > 0
        ? parsed.recentSessions as SessionRecentActivity[]
        : session.recentSessions,
      weakAreas: Array.isArray(parsed.weakAreas) && parsed.weakAreas.length > 0
        ? parsed.weakAreas as string[]
        : session.weakAreas,
      activityHeatmap: Array.isArray(parsed.activityHeatmap) && parsed.activityHeatmap.length === 28
        ? parsed.activityHeatmap as number[]
        : session.activityHeatmap,
    };
  } catch {
    return null;
  }
}

export function serializeAppSession(session: AppSession): string {
  return JSON.stringify(session);
}

export function ensureEnrollment(session: AppSession, grade: number): AppSession {
  const existing = session.enrollments.find((item) => item.grade === grade);
  if (existing) {
    return session;
  }
  return {
    ...session,
    grade,
    enrollments: [buildEnrollment(grade, 0), ...session.enrollments],
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

export function buildParentDashboardData(session: AppSession) {
  const enrollment = session.enrollments[0] ?? buildEnrollment(session.grade);
  const catalog = getMindSutraCatalog(enrollment.grade);
  return {
    name: session.childName,
    grade: enrollment.grade,
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
    weakAreas: session.weakAreas,
    recentSessions: session.recentSessions.map((item) => ({
      date: item.date,
      chapter: item.chapter,
      duration: item.duration,
      score: item.score,
    })),
  };
}

export function buildCourseHubData(session: AppSession, gradeSlug: string) {
  const catalog = getMindSutraCatalog(gradeSlug);
  const enrollment = session.enrollments.find((item) => item.gradeSlug === catalog.gradeSlug) ?? buildEnrollment(catalog.grade, 0);
  return {
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
        status: num <= enrollment.chaptersCompleted ? "completed" : current ? "current" : locked ? "locked" : "available",
      };
    }),
  };
}
