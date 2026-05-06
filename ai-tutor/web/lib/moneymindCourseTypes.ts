export type MoneyMindLessonStatus =
  | "completed"
  | "current"
  | "available"
  | "locked";

export type MoneyMindBoardPreviewType =
  | "rupee_basics"
  | "atm_simulator"
  | "upi_lab"
  | "goal_tracker"
  | "budget_planner";

export interface MoneyMindCourseLesson {
  id: string;
  order: number;
  title: string;
  category: string;
  durationMin: number;
  freePreview: boolean;
  status: MoneyMindLessonStatus;
  summary: string;
  skill: string;
  boardPreview: {
    type: MoneyMindBoardPreviewType;
    data: Record<string, unknown>;
  };
}

export interface MoneyMindSelectedLesson {
  id: string;
  title: string;
  category: string;
  durationMin: number;
  status: MoneyMindLessonStatus;
  summary: string;
  outcomes: string[];
  boardPreview: {
    type: MoneyMindBoardPreviewType;
    data: Record<string, unknown>;
  };
  startUrl: string;
  resumeUrl?: string;
}

export interface MoneyMindCourseMeta {
  id: string;
  levelId: string;
  levelSlug: string;
  title: string;
  subtitle: string;
  tagline: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
  currentLessonId: string;
  progressPct: number;
}

export interface MoneyMindCoursePayload {
  product: {
    id: "moneymind";
    name: "MoneyMind";
  };
  course: MoneyMindCourseMeta;
  lessons: MoneyMindCourseLesson[];
  selectedLesson: MoneyMindSelectedLesson;
}
