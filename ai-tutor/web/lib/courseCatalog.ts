import catalog from "./generated/courseCatalog.json";

export type CourseCatalogChapter = {
  code: string;
  title: string;
  order: number;
  estimatedMinutes: number | null;
  freePreview: boolean;
};

export type CourseCatalogEntry = {
  productSlug: string;
  productName: string;
  family: string;
  familyName: string;
  courseKey: string;
  courseId: string | null;
  courseName: string | null;
  tagline: string;
  grade: number | null;
  gradeSlug: string | null;
  targetAudience: string | null;
  chapterCount: number;
  chapterDir: string;
  indexPath: string;
  chapters: CourseCatalogChapter[];
};

type GeneratedCatalog = {
  generatedAt: string;
  contentRoot: string;
  products: Record<string, {
    productSlug: string;
    productName: string;
    families: Array<{ id: string; name: string }>;
    courses: Array<{
      courseId: string | null;
      courseName: string | null;
      family: string;
      courseKey: string;
      grade: number | null;
      gradeSlug: string | null;
      chapterCount: number;
    }>;
  }>;
  courses: CourseCatalogEntry[];
};

const GENERATED_CATALOG = catalog as GeneratedCatalog;

function normalizeGradeOrSlug(gradeOrSlug: string | number): string {
  if (typeof gradeOrSlug === "number" || /^\d+$/.test(String(gradeOrSlug))) {
    return `grade-${gradeOrSlug}`;
  }
  return String(gradeOrSlug).trim().toLowerCase();
}

export function getAllCourseCatalogs(): CourseCatalogEntry[] {
  return GENERATED_CATALOG.courses;
}

export function getProductCatalog(productSlug: string): CourseCatalogEntry[] {
  const normalized = productSlug.trim().toLowerCase();
  return GENERATED_CATALOG.courses.filter((course) => course.productSlug === normalized);
}

export function getCourseCatalogByCourseId(courseId: string): CourseCatalogEntry | null {
  const normalized = courseId.trim().toLowerCase();
  return GENERATED_CATALOG.courses.find((course) => String(course.courseId || "").toLowerCase() === normalized) ?? null;
}

export function getCourseCatalogByKey(productSlug: string, courseKey: string): CourseCatalogEntry | null {
  const normalizedProduct = productSlug.trim().toLowerCase();
  const normalizedKey = courseKey.trim().toLowerCase();
  return GENERATED_CATALOG.courses.find((course) => course.productSlug === normalizedProduct && course.courseKey.toLowerCase() === normalizedKey) ?? null;
}

export function getCourseCatalogByGrade(productSlug: string, gradeOrSlug: string | number): CourseCatalogEntry | null {
  const normalizedProduct = productSlug.trim().toLowerCase();
  const normalizedGrade = normalizeGradeOrSlug(gradeOrSlug);
  return GENERATED_CATALOG.courses.find((course) => course.productSlug === normalizedProduct && course.gradeSlug === normalizedGrade) ?? null;
}

export function getGeneratedCatalogMeta(): Pick<GeneratedCatalog, "generatedAt" | "contentRoot" | "products"> {
  return {
    generatedAt: GENERATED_CATALOG.generatedAt,
    contentRoot: GENERATED_CATALOG.contentRoot,
    products: GENERATED_CATALOG.products,
  };
}
