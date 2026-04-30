import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import type { SessionSkillMastery } from "./appSession";
import { getDb } from "./meeraDb";

const TABLE_NAME = "rd_vm_skill_mastery";

let ensureTablePromise: Promise<void> | null = null;

type SkillMasteryRow = RowDataPacket & {
  product_slug: string;
  lesson_id: string;
  skill_key: string;
  skill_name: string;
  attempts: number;
  correct: number;
  hints_used: number;
  concept_checks: number;
  concept_clear_count: number;
  transfer_checks: number;
  transfer_correct: number;
  confidence_score_total: number;
  mastery_score: number;
  recent_delta: number;
  last_updated: Date | string;
};

async function ensureTable() {
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      const db = getDb();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
          mastery_id    BIGINT       NOT NULL AUTO_INCREMENT,
          student_id    BIGINT       NOT NULL,
          product_slug  VARCHAR(24)  NOT NULL DEFAULT 'mindsutra',
          lesson_id     VARCHAR(24)  NOT NULL,
          skill_key     VARCHAR(80)  NOT NULL,
          skill_name    VARCHAR(120) NOT NULL,
          attempts      INT          NOT NULL DEFAULT 0,
          correct       INT          NOT NULL DEFAULT 0,
          hints_used    INT          NOT NULL DEFAULT 0,
          concept_checks INT         NOT NULL DEFAULT 0,
          concept_clear_count INT    NOT NULL DEFAULT 0,
          transfer_checks INT        NOT NULL DEFAULT 0,
          transfer_correct INT       NOT NULL DEFAULT 0,
          confidence_score_total INT NOT NULL DEFAULT 0,
          mastery_score DECIMAL(5,2) NOT NULL DEFAULT 0.28,
          recent_delta  DECIMAL(5,2) NOT NULL DEFAULT 0,
          last_updated  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (mastery_id),
          UNIQUE KEY uk_vm_skill_student (student_id, lesson_id, skill_key),
          KEY idx_vm_skill_student (student_id, product_slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      await db.execute(`ALTER TABLE ${TABLE_NAME} ADD COLUMN IF NOT EXISTS concept_checks INT NOT NULL DEFAULT 0`);
      await db.execute(`ALTER TABLE ${TABLE_NAME} ADD COLUMN IF NOT EXISTS concept_clear_count INT NOT NULL DEFAULT 0`);
      await db.execute(`ALTER TABLE ${TABLE_NAME} ADD COLUMN IF NOT EXISTS transfer_checks INT NOT NULL DEFAULT 0`);
      await db.execute(`ALTER TABLE ${TABLE_NAME} ADD COLUMN IF NOT EXISTS transfer_correct INT NOT NULL DEFAULT 0`);
      await db.execute(`ALTER TABLE ${TABLE_NAME} ADD COLUMN IF NOT EXISTS confidence_score_total INT NOT NULL DEFAULT 0`);
    })().catch((error) => {
      ensureTablePromise = null;
      throw error;
    });
  }
  return ensureTablePromise;
}

function mapRow(row: SkillMasteryRow): SessionSkillMastery {
  return {
    productSlug: row.product_slug === "mindsparc" ? "mindsparc" : "mindsutra",
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
  };
}

export async function loadMindSutraSkillMastery(studentId: number): Promise<SessionSkillMastery[]> {
  if (!studentId) return [];

  await ensureTable();
  const db = getDb();
  const [rows] = await db.execute<SkillMasteryRow[]>(
    `
      SELECT product_slug, lesson_id, skill_key, skill_name, attempts, correct,
             hints_used, concept_checks, concept_clear_count, transfer_checks,
             transfer_correct, confidence_score_total, mastery_score, recent_delta, last_updated
      FROM ${TABLE_NAME}
      WHERE student_id = ? AND product_slug = 'mindsutra'
      ORDER BY last_updated DESC
    `,
    [studentId],
  );

  return rows.map(mapRow);
}

async function upsertSingleSkill(
  conn: PoolConnection,
  studentId: number,
  skill: SessionSkillMastery,
) {
  await conn.execute(
    `
      INSERT INTO ${TABLE_NAME}
        (student_id, product_slug, lesson_id, skill_key, skill_name, attempts, correct, hints_used, concept_checks, concept_clear_count, transfer_checks, transfer_correct, confidence_score_total, mastery_score, recent_delta, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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
      skill.productSlug,
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
    ],
  );
}

export async function saveMindSutraSkillMastery(studentId: number, skills: SessionSkillMastery[]) {
  if (!studentId) return;

  await ensureTable();
  const relevantSkills = skills.filter((skill) => skill.productSlug === "mindsutra");
  if (!relevantSkills.length) return;

  const db = getDb();
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    for (const skill of relevantSkills) {
      await upsertSingleSkill(conn, studentId, skill);
    }
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function syncMindSutraLessonProgress(
  studentId: number,
  lessonId: string,
  levelId: string,
  score: number,
  isComplete: boolean,
) {
  if (!studentId || !lessonId || !levelId) return;

  const db = getDb();
  const status = isComplete ? "completed" : "in_progress";
  
  await db.execute(
    `
      INSERT INTO rd_vm_student_progress (student_id, level_id, lesson_id, status, attempts, best_score, last_attempt, completed_at)
      VALUES (?, ?, ?, ?, 1, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE
        status = IF(status = 'mastered' OR status = 'completed', status, VALUES(status)),
        attempts = attempts + 1,
        best_score = GREATEST(COALESCE(best_score, 0), VALUES(best_score)),
        last_attempt = NOW(),
        completed_at = IF(completed_at IS NULL AND VALUES(status) = 'completed', NOW(), completed_at)
    `,
    [studentId, levelId, lessonId, status, score, isComplete ? new Date() : null],
  );
}
