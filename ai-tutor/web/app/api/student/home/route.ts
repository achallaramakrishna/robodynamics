import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  APP_SESSION_COOKIE,
  buildStudentHomeData,
  parseAppSession,
  type AppSession,
  type SessionEnrollment,
} from "@/lib/appSession";
import { dbQuery, dbQueryOne } from "@/lib/meeraDb";
import { getMsLevel } from "@/lib/mindsutraCatalog";

type UserRow = {
  first_name: string | null;
  last_name: string | null;
  grade: number | null;
};

type VedicProgressRow = {
  level_id: string | null;
  lesson_id: string;
  status: string | null;
  best_score: number | string | null;
  last_attempt: string | null;
  completed_at: string | null;
};

type VedicXpRow = {
  totalXp: number | string | null;
};

type VedicPlacementRow = {
  placed_level: string | null;
};

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatSessionDate(value: string | null) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function normalizeCourseKey(courseId: string | undefined) {
  const normalized = String(courseId || "").trim().toLowerCase();
  if (
    normalized === "mindsutra" ||
    normalized.startsWith("vedic") ||
    normalized.startsWith("vm_")
  ) {
    return "mindsutra";
  }
  return normalized;
}

function buildMindSutraEnrollment(
  session: AppSession,
  grade: number,
  progressRows: VedicProgressRow[],
  placedLevelId: string | null,
  existing?: SessionEnrollment,
): SessionEnrollment | null {
  // 1. Determine starting level (placement or L1)
  let currentLevelId = placedLevelId || "L1";
  
  const allCompletedIds = new Set(
    progressRows
      .filter((row) => {
        const status = String(row.status || "").toLowerCase();
        return status === "completed" || status === "mastered";
      })
      .map((row) => row.lesson_id),
  );

  // 2. Advance level if current level is fully completed
  const levels = ["L1", "L2", "L3", "L4", "L5"];
  let levelIdx = levels.indexOf(currentLevelId);
  if (levelIdx < 0) levelIdx = 0;

  while (levelIdx < levels.length) {
    const level = getMsLevel(levels[levelIdx]);
    if (!level) break;

    const chaptersInLevel = level.lessons.length;
    const completedInLevel = level.lessons.filter(l => allCompletedIds.has(l.id)).length;

    if (completedInLevel >= chaptersInLevel && levelIdx < levels.length - 1) {
      // Level is finished, move to next
      levelIdx++;
      currentLevelId = levels[levelIdx];
    } else {
      // Still on this level
      break;
    }
  }

  const level = getMsLevel(currentLevelId);
  if (!level) return existing ?? null;

  const chaptersCompleted = level.lessons.filter((lesson) => allCompletedIds.has(lesson.id)).length;
  const nextLesson = level.lessons.find((lesson) => !allCompletedIds.has(lesson.id)) ?? level.lessons[level.lessons.length - 1];
  
  const accuracySamples = progressRows
    .map((row) => asNumber(row.best_score))
    .filter((score) => score > 0);
  const accuracy = accuracySamples.length
    ? Math.round(accuracySamples.reduce((sum, score) => sum + score, 0) / accuracySamples.length)
    : 0;
  const hasAnyActivity = progressRows.length > 0;

  return {
    productSlug: "mindsutra",
    productName: "MindSutra",
    courseId: "mindsutra",
    courseName: `MindSutra ${level.name} — Grade ${grade}`,
    grade,
    gradeSlug: `grade-${grade}`,
    chaptersCompleted,
    totalChapters: level.lessons.length,
    currentChapter: nextLesson?.id ?? existing?.currentChapter ?? "VM_L1_1",
    currentChapterName: nextLesson?.title ?? existing?.currentChapterName ?? "Start Learning",
    accuracy,
    status: chaptersCompleted >= level.lessons.length
      ? "completed"
      : hasAnyActivity
        ? "in_progress"
        : "not_started",
    priceLabel: existing?.priceLabel ?? "INR 1,499 lifetime",
  };
}

function sanitizeSessionForHome(session: AppSession, name: string, grade: number) {
  return {
    ...buildStudentHomeData({
      ...session,
      childName: name,
      grade,
      xp: 0,
      streak: 0,
      recentSessions: [],
    }),
    enrollments: session.enrollments.map((enrollment) => ({
      ...enrollment,
      accuracy: 0,
      chaptersCompleted: 0,
      status: "not_started" as const,
    })),
  };
}

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
  }

  const studentId = session.childId || session.userId;

  try {
    const [user, vedicProgressRows, vedicXpRow, vedicPlacementRow] = await Promise.all([
      dbQueryOne<UserRow>(
        `
          SELECT first_name, last_name, grade
          FROM rd_users
          WHERE user_id = ?
          LIMIT 1
        `,
        [studentId],
      ),
      dbQuery<VedicProgressRow>(
        `
          SELECT level_id, lesson_id, status, best_score, last_attempt, completed_at
          FROM rd_vm_student_progress
          WHERE student_id = ?
          ORDER BY COALESCE(last_attempt, completed_at) DESC, lesson_id DESC
        `,
        [studentId],
      ),
      dbQueryOne<VedicXpRow>(
        `
          SELECT COALESCE(SUM(xp_delta), 0) AS totalXp
          FROM rd_vm_xp_ledger
          WHERE student_id = ?
        `,
        [studentId],
      ),
      dbQueryOne<VedicPlacementRow>(
        `
          SELECT placed_level
          FROM rd_vm_placements
          WHERE student_id = ?
          ORDER BY created_at DESC
          LIMIT 1
        `,
        [studentId],
      ),
    ]);

    const grade = asNumber(user?.grade, asNumber(session.grade, 5));
    const studentName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || session.childName || "Student";

    const existingEnrollments = session.enrollments ?? [];
    const enrollmentMap = new Map<string, SessionEnrollment>();
    for (const enrollment of existingEnrollments) {
      enrollmentMap.set(normalizeCourseKey(enrollment.courseId), enrollment);
    }

    const existingMindSutra = enrollmentMap.get("mindsutra");
    const mindSutraEnrollment = buildMindSutraEnrollment(
      session,
      grade,
      vedicProgressRows,
      vedicPlacementRow?.placed_level || null,
      existingMindSutra
    );
    if (mindSutraEnrollment) {
      enrollmentMap.set("mindsutra", mindSutraEnrollment);
    }

    const recentSessions = vedicProgressRows
      .filter((row) => row.last_attempt || row.completed_at)
      .slice(0, 6)
      .map((row) => ({
        date: formatSessionDate(row.last_attempt || row.completed_at),
        chapter: row.lesson_id,
        duration: "20 min",
        accuracy: Math.max(0, Math.min(100, Math.round(asNumber(row.best_score)))),
      }));

    const xp = asNumber(vedicXpRow?.totalXp, 0);
    const streak = 0;

    return NextResponse.json({
      name: studentName,
      grade,
      xp,
      streak,
      enrollments: Array.from(enrollmentMap.values()),
      recentSessions,
    });
  } catch (error) {
    console.error("[student/home] failed to load DB progress:", error);
    const grade = asNumber(session.grade, 5);
    const safeName = session.childName || "Student";
    return NextResponse.json(sanitizeSessionForHome(session, safeName, grade));
  }
}
