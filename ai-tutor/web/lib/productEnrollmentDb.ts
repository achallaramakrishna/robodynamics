import { dbExecute, dbQuery } from "@/lib/meeraDb";
import { getProductById, normalizeProductId } from "@/lib/productRegistry";

export type ProductEnrollmentStatus = "not_started" | "in_progress" | "completed";

export type ProductEnrollmentRecord = {
  id: number;
  userId: number;
  childId: number;
  productSlug: string;
  productName: string;
  productHref: string;
  courseId: string | null;
  grade: number | null;
  status: ProductEnrollmentStatus;
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter: string | null;
  currentChapterName: string | null;
  accuracy: number;
  lastOpenedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type UpsertProductEnrollmentInput = {
  userId: number;
  childId?: number;
  productSlug: string;
  courseId?: string | null;
  grade?: number | null;
  status?: ProductEnrollmentStatus;
  chaptersCompleted?: number;
  totalChapters?: number;
  currentChapter?: string | null;
  currentChapterName?: string | null;
  accuracy?: number;
};

type EnrollmentRow = {
  id: number;
  user_id: number;
  child_id: number;
  product_slug: string;
  product_name: string;
  product_href: string;
  course_id: string | null;
  grade: number | null;
  status: ProductEnrollmentStatus;
  chapters_completed: number;
  total_chapters: number;
  current_chapter: string | null;
  current_chapter_name: string | null;
  accuracy: number | string;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
};

let ensureEnrollmentSchemaPromise: Promise<void> | null = null;

export async function ensureProductEnrollmentSchema() {
  if (!ensureEnrollmentSchemaPromise) {
    ensureEnrollmentSchemaPromise = (async () => {
      await dbExecute(`
        CREATE TABLE IF NOT EXISTS rd_product_enrollments (
          id BIGINT NOT NULL AUTO_INCREMENT,
          user_id BIGINT NOT NULL,
          child_id BIGINT NOT NULL,
          product_slug VARCHAR(64) NOT NULL,
          product_name VARCHAR(128) NOT NULL,
          product_href VARCHAR(255) NOT NULL,
          course_id VARCHAR(120) NULL,
          grade INT NULL,
          status VARCHAR(24) NOT NULL DEFAULT 'not_started',
          chapters_completed INT NOT NULL DEFAULT 0,
          total_chapters INT NOT NULL DEFAULT 0,
          current_chapter VARCHAR(120) NULL,
          current_chapter_name VARCHAR(255) NULL,
          accuracy DECIMAL(5,2) NOT NULL DEFAULT 0,
          last_opened_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_rd_product_enrollment (user_id, child_id, product_slug),
          KEY idx_rd_product_user (user_id, child_id),
          KEY idx_rd_product_slug (product_slug)
        )
      `);
    })().catch((error) => {
      ensureEnrollmentSchemaPromise = null;
      throw error;
    });
  }

  return ensureEnrollmentSchemaPromise;
}

function mapEnrollmentRow(row: EnrollmentRow): ProductEnrollmentRecord {
  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    childId: Number(row.child_id),
    productSlug: normalizeProductId(row.product_slug),
    productName: String(row.product_name || ""),
    productHref: String(row.product_href || "/"),
    courseId: row.course_id ? String(row.course_id) : null,
    grade: row.grade == null ? null : Number(row.grade),
    status: row.status,
    chaptersCompleted: Number(row.chapters_completed || 0),
    totalChapters: Number(row.total_chapters || 0),
    currentChapter: row.current_chapter ? String(row.current_chapter) : null,
    currentChapterName: row.current_chapter_name ? String(row.current_chapter_name) : null,
    accuracy: Number(row.accuracy || 0),
    lastOpenedAt: row.last_opened_at ? String(row.last_opened_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function getUserProductEnrollments(userId: number, childId?: number) {
  await ensureProductEnrollmentSchema();

  const rows = childId
    ? await dbQuery<EnrollmentRow>(
        `
          SELECT *
          FROM rd_product_enrollments
          WHERE user_id = ? AND child_id = ?
          ORDER BY last_opened_at DESC, updated_at DESC, created_at DESC
        `,
        [userId, childId],
      )
    : await dbQuery<EnrollmentRow>(
        `
          SELECT *
          FROM rd_product_enrollments
          WHERE user_id = ?
          ORDER BY last_opened_at DESC, updated_at DESC, created_at DESC
        `,
        [userId],
      );

  return rows.map(mapEnrollmentRow);
}

export async function upsertProductEnrollment(input: UpsertProductEnrollmentInput) {
  await ensureProductEnrollmentSchema();

  const productSlug = normalizeProductId(input.productSlug);
  const product = getProductById(productSlug);
  if (!product) return;

  const userId = Number(input.userId) || 0;
  const childId = Number(input.childId ?? input.userId) || userId;
  if (!userId || !childId) return;

  const params: Array<string | number | null> = [
    userId,
    childId,
    product.id,
    product.name,
    product.href,
    input.courseId ?? null,
    input.grade == null ? null : Number(input.grade),
    input.status ?? "not_started",
    Math.max(0, Number(input.chaptersCompleted ?? 0)),
    Math.max(0, Number(input.totalChapters ?? 0)),
    input.currentChapter ?? null,
    input.currentChapterName ?? null,
    Math.max(0, Number(input.accuracy ?? 0)),
  ];

  const updates = [
    "product_name = VALUES(product_name)",
    "product_href = VALUES(product_href)",
    "grade = COALESCE(VALUES(grade), grade)",
    "last_opened_at = CURRENT_TIMESTAMP",
  ];

  if (input.courseId !== undefined) updates.push("course_id = VALUES(course_id)");
  if (input.status !== undefined) updates.push("status = VALUES(status)");
  if (input.chaptersCompleted !== undefined) updates.push("chapters_completed = VALUES(chapters_completed)");
  if (input.totalChapters !== undefined) updates.push("total_chapters = VALUES(total_chapters)");
  if (input.currentChapter !== undefined) updates.push("current_chapter = VALUES(current_chapter)");
  if (input.currentChapterName !== undefined) updates.push("current_chapter_name = VALUES(current_chapter_name)");
  if (input.accuracy !== undefined) updates.push("accuracy = VALUES(accuracy)");

  await dbExecute(
    `
      INSERT INTO rd_product_enrollments (
        user_id,
        child_id,
        product_slug,
        product_name,
        product_href,
        course_id,
        grade,
        status,
        chapters_completed,
        total_chapters,
        current_chapter,
        current_chapter_name,
        accuracy
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE ${updates.join(", ")}
    `,
    params,
  );
}
