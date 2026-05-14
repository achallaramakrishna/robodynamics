/**
 * Shared type definitions for the Kaveri tutor payload system.
 */

export interface KaveriCoursePayload {
  course: {
    title: string;
    subtitle?: string;
    tagline?: string;
    color: string;
    progressPct: number;
    completedLessons: number;
    totalLessons: number;
    grade?: string;
    levelSlug?: string;
  };
  lessons: Array<{
    id: string;
    order: number;
    title: string;
    category: string;
    durationMin: number;
    status: "available" | "current" | "locked" | "completed";
    summary: string;
    skill: string;
    boardPreview: { type: string; data: Record<string, unknown> };
    image?: string;
    startUrl: string;
    outcomes?: string[];
  }>;
  selectedLesson: {
    id: string;
    order: number;
    title: string;
    category: string;
    durationMin: number;
    status: "available" | "current" | "locked" | "completed";
    summary: string;
    skill: string;
    boardPreview: { type: string; data: Record<string, unknown> };
    image?: string;
    startUrl: string;
    outcomes?: string[];
  };
  nextLessonUrl?: string;
}
