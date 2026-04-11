import { MONEYMIND_LEVELS, type MoneyMindLevel } from "./moneyMindCatalog";
import type { MoneyMindCoursePayload, MoneyMindCourseLesson, MoneyMindLessonStatus } from "./moneymindCourseTypes";

export function buildMoneyMindCoursePayload(levelSlug: string): MoneyMindCoursePayload {
  const levelId = levelSlug.replace("level-", "L").toUpperCase();
  const level = MONEYMIND_LEVELS.find((l) => l.id === levelId) || MONEYMIND_LEVELS[0];

  const lessons: MoneyMindCourseLesson[] = level.lessons.map((l, index) => {
    // In a real app, status would come from a DB. 
    // For demo/dev, we set Lesson 1 as 'current' and others as 'locked' or 'available'
    const status: MoneyMindLessonStatus = index === 0 ? "current" : index === 1 ? "available" : "locked";
    
    return {
      id: l.id,
      order: index + 1,
      title: l.title,
      category: l.category,
      durationMin: l.durationMin,
      freePreview: l.freePreview,
      status: status,
      summary: `Master the concept of ${l.title} in this interactive mission.`,
      skill: l.skill,
      boardPreview: {
        type: "rupee_basics",
        data: {
          assetPath: `/docs/money_mind/${l.id}.png`, // Placeholder for previews
          assetSource: "MoneyMind Simulation Asset"
        }
      }
    };
  });

  const selectedLesson = lessons.find(l => l.status === "current") || lessons[0];

  return {
    product: {
      id: "moneymind",
      name: "MoneyMind"
    },
    course: {
      id: level.id,
      levelId: level.id,
      levelSlug: levelSlug,
      title: `${level.name} (Level ${level.order})`,
      subtitle: level.gradeEquiv,
      tagline: level.tagline,
      color: level.color,
      totalLessons: lessons.length,
      completedLessons: 0,
      currentLessonId: selectedLesson.id,
      progressPct: 0
    },
    lessons,
    selectedLesson: {
      ...selectedLesson,
      outcomes: [
        `Understand ${selectedLesson.title} principles.`,
        `Apply ${selectedLesson.skill} in guided simulators.`,
        `Complete Level ${level.order} challenges to unlock rewards.`
      ],
      startUrl: `/ai-tutor/tutor?courseId=financial_literacy&chapterCode=${selectedLesson.id.replace("MM_", "FIN_")}`,
      resumeUrl: selectedLesson.status === "current" ? `/ai-tutor/tutor?courseId=financial_literacy&chapterCode=${selectedLesson.id.replace("MM_", "FIN_")}&resume=1` : undefined
    }
  };
}
