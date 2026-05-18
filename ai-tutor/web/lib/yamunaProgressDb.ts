import type { RowDataPacket } from "mysql2/promise";
import { getDb } from "./meeraDb";

const PROGRESS_TABLE = "rd_vm_student_progress";

/**
 * Loads all completed lesson IDs for a student in the Yamuna product.
 */
export async function loadYamunaCompletedLessons(studentId: number): Promise<string[]> {
  if (!studentId) return [];
  const db = getDb();
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT lesson_id FROM ${PROGRESS_TABLE}
     WHERE student_id = ? AND product_slug = 'yamuna'
       AND (status = 'completed' OR status = 'mastered')`,
    [studentId]
  );
  return rows.map((r) => r.lesson_id);
}

/**
 * Upserts lesson progress for Yamuna.
 */
export async function syncYamunaLessonProgress(
  studentId: number,
  lessonId: string,
  levelId: string,
  score: number,
  isComplete: boolean
) {
  if (!studentId || !lessonId || !levelId) return;
  const db = getDb();
  const status = isComplete ? "completed" : "in_progress";
  await db.execute(
    `INSERT INTO ${PROGRESS_TABLE}
       (student_id, product_slug, level_id, lesson_id, status, attempts, best_score, last_attempt, completed_at)
     VALUES (?, 'yamuna', ?, ?, ?, 1, ?, NOW(), ?)
     ON DUPLICATE KEY UPDATE
       status      = IF(status IN ('mastered','completed'), status, VALUES(status)),
       attempts    = attempts + 1,
       best_score  = GREATEST(COALESCE(best_score, 0), VALUES(best_score)),
       last_attempt = NOW(),
       completed_at = IF(completed_at IS NULL AND VALUES(status) = 'completed', NOW(), completed_at)`,
    [studentId, levelId, lessonId, status, score, isComplete ? new Date() : null]
  );
}
