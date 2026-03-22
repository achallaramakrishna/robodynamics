import { getCourseCatalogByGrade } from "./courseCatalog";

export type MindSutraChapter = {
  code: string;
  title: string;
  durationMin: number;
  freePreview: boolean;
};

export type MindSutraGradeCatalog = {
  grade: number;
  gradeSlug: string;
  courseId: string;
  courseName: string;
  tagline: string;
  chapters: MindSutraChapter[];
};

export function getMindSutraCatalog(gradeOrSlug: string | number): MindSutraGradeCatalog {
  const fallback = getCourseCatalogByGrade("mindsutra", 5);
  const entry = getCourseCatalogByGrade("mindsutra", gradeOrSlug) ?? fallback;
  if (!entry || entry.grade == null || !entry.gradeSlug || !entry.courseId || !entry.courseName) {
    throw new Error(`MindSutra catalog not found for ${String(gradeOrSlug)}`);
  }
  return {
    grade: entry.grade,
    gradeSlug: entry.gradeSlug,
    courseId: entry.courseId,
    courseName: entry.courseName,
    tagline: entry.tagline,
    chapters: entry.chapters.map((chapter) => ({
      code: chapter.code,
      title: chapter.title,
      durationMin: chapter.estimatedMinutes ?? 20,
      freePreview: chapter.freePreview,
    })),
  };
}
