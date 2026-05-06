import { MONEYMIND_LEVELS, type MoneyMindLevel } from "./moneyMindCatalog";
import type { MoneyMindCoursePayload, MoneyMindCourseLesson, MoneyMindLessonStatus } from "./moneymindCourseTypes";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LevelProgressData {
  completed_lesson_ids: string[];
  total_xp: number;
}

// ─── Fetch real progress from backend ────────────────────────────────────────

export async function fetchLevelProgress(
  userId: number,
  levelId: string
): Promise<LevelProgressData> {
  try {
    const res = await fetch(`/api/moneymind/progress/${userId}/level/${levelId}`);
    if (!res.ok) return { completed_lesson_ids: [], total_xp: 0 };
    return await res.json();
  } catch {
    return { completed_lesson_ids: [], total_xp: 0 };
  }
}

// ─── Mark a lesson complete ───────────────────────────────────────────────────

export async function completeLessonProgress(
  userId: number,
  levelId: string,
  lessonId: string,
  xpEarned: number
): Promise<void> {
  try {
    await fetch("/api/moneymind/progress/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, level_id: levelId, lesson_id: lessonId, xp_earned: xpEarned }),
    });
  } catch {
    // Non-fatal — progress might not save, but lesson flow continues
  }
}

// ─── Derive lesson status from real progress ──────────────────────────────────

function deriveStatus(
  lessonId: string,
  lessonIndex: number,
  completedIds: Set<string>
): MoneyMindLessonStatus {
  if (completedIds.has(lessonId)) return "completed";

  // First incomplete lesson after all completed ones is "current"
  // Any lesson right after "current" is "available"
  // The rest are "locked"
  const completedCount = completedIds.size;

  if (lessonIndex === completedCount) return "current";
  if (lessonIndex === completedCount + 1) return "available";
  if (lessonIndex < completedCount) return "completed"; // fallback
  return "locked";
}

// ─── Build payload (sync version, using pre-fetched progress) ─────────────────

export function buildMoneyMindCoursePayload(
  levelSlug: string,
  progress: LevelProgressData = { completed_lesson_ids: [], total_xp: 0 }
): MoneyMindCoursePayload {
  const levelId = levelSlug.replace("level-", "L").toUpperCase();
  const level = MONEYMIND_LEVELS.find((l) => l.id === levelId) || MONEYMIND_LEVELS[0];
  const completedIds = new Set(progress.completed_lesson_ids);
  const completedCount = completedIds.size;

  const lessons: MoneyMindCourseLesson[] = level.lessons.map((l, index) => ({
    id: l.id,
    order: index + 1,
    title: l.title,
    category: l.category,
    durationMin: l.durationMin,
    freePreview: l.freePreview,
    status: deriveStatus(l.id, index, completedIds),
    summary: `Master the concept of ${l.title} in this interactive mission.`,
    skill: l.skill,
    boardPreview: {
      type: "rupee_basics",
      data: {
        assetPath: `/moneymind/previews/${l.id}.png`,
        assetSource: "MoneyMind Simulation Asset",
      },
    },
  }));

  const currentLesson =
    lessons.find((l) => l.status === "current") ||
    lessons.find((l) => l.status === "available") ||
    lessons[0];

  const progressPct = level.lessons.length > 0
    ? Math.round((completedCount / level.lessons.length) * 100)
    : 0;

  return {
    product: { id: "moneymind", name: "MoneyMind" },
    course: {
      id: level.id,
      levelId: level.id,
      levelSlug,
      title: `${level.name} (Level ${level.order})`,
      subtitle: level.gradeEquiv,
      tagline: level.tagline,
      color: level.color,
      totalLessons: lessons.length,
      completedLessons: completedCount,
      currentLessonId: currentLesson.id,
      progressPct,
    },
    lessons,
    selectedLesson: {
      ...currentLesson,
      outcomes: [
        `Understand ${currentLesson.title} principles.`,
        `Apply ${currentLesson.skill} in guided simulators.`,
        `Complete Level ${level.order} challenges to unlock rewards.`,
      ],
      startUrl: `/moneymind/learn/level-${level.order}/${currentLesson.id}`,
      resumeUrl:
        currentLesson.status === "current"
          ? `/moneymind/learn/level-${level.order}/${currentLesson.id}`
          : undefined,
    },
  };
}
