import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import type { SessionSkillMastery } from "./appSession";
import { getDb } from "./meeraDb";

const MASTERY_TABLE = "rd_vm_skill_mastery";
const PROGRESS_TABLE = "rd_vm_student_progress";

/**
 * Loads the granular micro-skill mastery levels for a student specifically for the Vidya product.
 * This is used to hydrate the AI Tutor's support modes (Guided vs Balanced vs Challenge).
 */
export async function loadVidyaSkillMastery(studentId: number): Promise<SessionSkillMastery[]> {
  if (!studentId) return [];

  const db = getDb();
  const [rows] = await db.execute<RowDataPacket[]>(
    `
      SELECT product_slug, lesson_id, skill_key, skill_name, attempts, correct,
             hints_used, concept_checks, concept_clear_count, transfer_checks,
             transfer_correct, confidence_score_total, mastery_score, recent_delta, last_updated
      FROM ${MASTERY_TABLE}
      WHERE student_id = ? AND product_slug = 'vidya'
      ORDER BY last_updated DESC
    `,
    [studentId]
  );

  return rows.map((row) => ({
    productSlug: "vidya",
    lessonId: row.lesson_id,
    skillKey: row.skill_key,
    skillName: row.skill_name,
    attempts: Number(row.attempts ?? 0),
    correct: Number(row.correct ?? 0),
    hintsUsed: Number(row.hints_used ?? 0),
    conceptChecks: Number(row.concept_checks ?? 0),
    conceptClearCount: Number(row.concept_clear_count ?? 0),
    transferChecks: Number(row.transfer_checks ?? 0),
    transferCorrect: Number(row.transfer_correct ?? 0),
    confidenceScoreTotal: Number(row.confidence_score_total ?? 0),
    masteryScore: Number(row.mastery_score ?? 0.28),
    recentDelta: Number(row.recent_delta ?? 0),
    lastUpdated: new Date(row.last_updated ?? Date.now()).toISOString(),
  }));
}

/**
 * Saves or updates a student's micro-skill array to the database.
 * The AI Engine recalculates these scores in memory during the lesson, 
 * and we bulk-upsert them at the end of the lesson (or step).
 */
export async function saveVidyaSkillMastery(studentId: number, skills: SessionSkillMastery[]) {
  if (!studentId || !skills.length) return;

  const relevantSkills = skills.filter((skill) => skill.productSlug === "vidya");
  if (!relevantSkills.length) return;

  const db = getDb();
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    for (const skill of relevantSkills) {
      await conn.execute(
        `
          INSERT INTO ${MASTERY_TABLE}
            (student_id, product_slug, lesson_id, skill_key, skill_name, attempts, correct, hints_used, 
             concept_checks, concept_clear_count, transfer_checks, transfer_correct, 
             confidence_score_total, mastery_score, recent_delta, last_updated)
          VALUES (?, 'vidya', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            skill_name = VALUES(skill_name),
            attempts = VALUES(attempts),
            correct = VALUES(correct),
            hints_used = VALUES(hints_used),
            concept_checks = VALUES(concept_checks),
            concept_clear_count = VALUES(concept_clear_count),
            transfer_checks = VALUES(transfer_checks),
            transfer_correct = VALUES(transfer_correct),
            confidence_score_total = VALUES(confidence_score_total),
            mastery_score = VALUES(mastery_score),
            recent_delta = VALUES(recent_delta),
            last_updated = NOW()
        `,
        [
          studentId,
          skill.lessonId,
          skill.skillKey,
          skill.skillName,
          skill.attempts,
          skill.correct,
          skill.hintsUsed,
          skill.conceptChecks ?? 0,
          skill.conceptClearCount ?? 0,
          skill.transferChecks ?? 0,
          skill.transferCorrect ?? 0,
          skill.confidenceScoreTotal ?? 0,
          skill.masteryScore,
          skill.recentDelta,
        ]
      );
    }
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

/**
 * Upserts the high-level progression state (e.g. PY_L1_01_SETUP is "completed").
 * Ensures students can resume right where they left off without losing their spot.
 */
export async function syncVidyaLessonProgress(
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
    `
      INSERT INTO ${PROGRESS_TABLE} (student_id, level_id, lesson_id, status, attempts, best_score, last_attempt, completed_at)
      VALUES (?, ?, ?, ?, 1, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE
        status = IF(status = 'mastered' OR status = 'completed', status, VALUES(status)),
        attempts = attempts + 1,
        best_score = GREATEST(COALESCE(best_score, 0), VALUES(best_score)),
        last_attempt = NOW(),
        completed_at = IF(completed_at IS NULL AND VALUES(status) = 'completed', NOW(), completed_at)
    `,
    [studentId, levelId, lessonId, status, score, isComplete ? new Date() : null]
  );
}

/**
 * Loads all the completed Lesson IDs for the student so the UI knows which ones to "unlock" or show as checkmarked.
 */
export async function loadVidyaCompletedLessons(studentId: number): Promise<string[]> {
  if (!studentId) return [];

  const db = getDb();
  const [rows] = await db.execute<RowDataPacket[]>(
    `
      SELECT lesson_id
      FROM ${PROGRESS_TABLE}
      WHERE student_id = ? AND (status = 'completed' OR status = 'mastered')
    `,
    [studentId]
  );

  return rows.map((r) => r.lesson_id);
}
