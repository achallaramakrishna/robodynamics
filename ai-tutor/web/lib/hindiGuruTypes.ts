export interface HindiGuruLesson {
  id: string;
  order: number;
  title: string;
  category: string;
  durationMin: number;
  status: "available" | "current" | "completed" | "locked";
  summary: string;
  skill: string;
  boardPreview: {
    type: string;
    data: any;
  };
  startUrl?: string;
}

export interface HindiGuruCoursePayload {
  course: {
    title: string;
    subtitle: string;
    tagline: string;
    color: string;
    progressPct: number;
    completedLessons: number;
    totalLessons: number;
  };
  lessons: HindiGuruLesson[];
  selectedLesson: HindiGuruLesson & {
    outcomes: string[];
    startUrl: string;
    resumeUrl?: string;
  };
}
