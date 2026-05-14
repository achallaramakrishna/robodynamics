import type { ProductEnrollmentRecord } from "@/lib/productEnrollmentDb";

function clampLevel(level: number) {
  if (!Number.isFinite(level)) return null;
  return Math.min(5, Math.max(1, Math.trunc(level)));
}

function inferMindSutraLevelFromEnrollment(enrollment?: ProductEnrollmentRecord) {
  const currentChapter = String(enrollment?.currentChapter || "").trim();
  const chapterMatch = currentChapter.match(/^VM_L(\d+)_/i);
  if (chapterMatch) return clampLevel(Number(chapterMatch[1]));

  const courseId = String(enrollment?.courseId || "").trim().toLowerCase();
  const gradeCourseMatch = courseId.match(/^vedic_math_g(\d+)$/i);
  if (gradeCourseMatch) {
    return clampLevel(Number(gradeCourseMatch[1]) - 3);
  }

  const grade = Number(enrollment?.grade || 0);
  if (grade >= 4 && grade <= 8) return clampLevel(grade - 3);

  return null;
}

function inferMindSparcLevelFromEnrollment(enrollment?: ProductEnrollmentRecord) {
  const currentChapter = String(enrollment?.currentChapter || "").trim();
  const chapterMatch = currentChapter.match(/^AR_L(\d+)_/i);
  if (chapterMatch) return clampLevel(Number(chapterMatch[1]));

  const courseId = String(enrollment?.courseId || "").trim().toLowerCase();
  const gradeCourseMatch = courseId.match(/^aptitude_reasoning_g(\d+)$/i);
  if (gradeCourseMatch) {
    return clampLevel(Number(gradeCourseMatch[1]) - 3);
  }

  const grade = Number(enrollment?.grade || 0);
  if (grade >= 4 && grade <= 8) return clampLevel(grade - 3);

  return null;
}

function buildMindSutraLaunchHref(enrollment?: ProductEnrollmentRecord) {
  const level = inferMindSutraLevelFromEnrollment(enrollment);
  if (level) {
    return `/mindsutra/course/level-${level}`;
  }

  const genericHref = String(enrollment?.productHref || "/mindsutra").trim();
  return genericHref || "/mindsutra";
}

function buildMindSparcLaunchHref(enrollment?: ProductEnrollmentRecord) {
  const level = inferMindSparcLevelFromEnrollment(enrollment);
  if (level) {
    return `/mindsparc/course/level-${level}`;
  }

  const genericHref = String(enrollment?.productHref || "/mindsparc").trim();
  return genericHref || "/mindsparc";
}

export function getProductLaunchHref(
  productId: string,
  defaultHref: string,
  enrollment?: ProductEnrollmentRecord,
) {
  if (!enrollment) return defaultHref;
  if (productId === "mindsutra") return buildMindSutraLaunchHref(enrollment);
  if (productId === "mindsparc") return buildMindSparcLaunchHref(enrollment);

  const savedHref = String(enrollment.productHref || "").trim();
  return savedHref || defaultHref;
}
