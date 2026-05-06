export type MindSutraLessonStatus =
  | "completed"
  | "current"
  | "available"
  | "locked";

export type MindSutraBoardPreviewType =
  | "worked_example"
  | "complement_bar"
  | "number_bond"
  | "criss_cross";

export interface MindSutraCourseLesson {
  id: string;
  order: number;
  title: string;
  sutra: string;
  durationMin: number;
  difficulty: number;
  freePreview: boolean;
  status: MindSutraLessonStatus;
  summary: string;
  skills: string[];
  boardPreview: {
    type: MindSutraBoardPreviewType;
    data: Record<string, unknown>;
  };
}

export interface MindSutraSelectedLesson {
  id: string;
  title: string;
  sutra: string;
  durationMin: number;
  difficulty: number;
  status: MindSutraLessonStatus;
  summary: string;
  outcomes: string[];
  boardPreview: {
    type: MindSutraBoardPreviewType;
    data: Record<string, unknown>;
  };
  startUrl: string;
  resumeUrl?: string;
}

export interface MindSutraCourseMeta {
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
  earnedXp: number;
  totalXpAvailable: number;
}

export interface MindSutraCoursePayload {
  product: {
    id: "mindsutra";
    name: "MindSutra";
  };
  course: MindSutraCourseMeta;
  lessons: MindSutraCourseLesson[];
  selectedLesson: MindSutraSelectedLesson;
}
