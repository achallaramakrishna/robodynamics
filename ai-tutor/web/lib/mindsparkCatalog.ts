import { getCourseCatalogByCourseId, getCourseCatalogByGrade, getCourseCatalogByKey } from "./courseCatalog";

export type MindSparkChapter = {
  code: string;
  title: string;
  durationMin: number;
  freePreview: boolean;
};

export type MindSparkCourseCatalog = {
  courseKey: string;
  courseId: string;
  courseName: string;
  tagline: string;
  grade: number | null;
  gradeSlug: string | null;
  chapters: MindSparkChapter[];
};

function toMindSparkCourse(entry: ReturnType<typeof getCourseCatalogByCourseId> | ReturnType<typeof getCourseCatalogByGrade> | ReturnType<typeof getCourseCatalogByKey>): MindSparkCourseCatalog {
  if (!entry || !entry.courseId || !entry.courseName) {
    throw new Error("MindSpark catalog entry is missing required fields");
  }
  return {
    courseKey: entry.courseKey,
    courseId: entry.courseId,
    courseName: entry.courseName,
    tagline: entry.tagline,
    grade: entry.grade,
    gradeSlug: entry.gradeSlug,
    chapters: entry.chapters.map((chapter) => ({
      code: chapter.code,
      title: chapter.title,
      durationMin: chapter.estimatedMinutes ?? 20,
      freePreview: chapter.freePreview,
    })),
  };
}

export function getMindSparkCatalog(gradeOrSlug: string | number): MindSparkCourseCatalog {
  const fallback = getCourseCatalogByGrade("mindspark", 4);
  return toMindSparkCourse(getCourseCatalogByGrade("mindspark", gradeOrSlug) ?? fallback);
}

export function getMindSparkCourseCatalog(courseKeyOrCourseId: string): MindSparkCourseCatalog {
  const byCourseId = getCourseCatalogByCourseId(courseKeyOrCourseId);
  if (byCourseId?.productSlug === "mindspark") {
    return toMindSparkCourse(byCourseId);
  }
  const byKey = getCourseCatalogByKey("mindspark", courseKeyOrCourseId);
  return toMindSparkCourse(byKey);
}
