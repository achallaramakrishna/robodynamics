import crypto from "crypto";
import { dbExecute, dbQuery, dbQueryOne } from "@/lib/meeraDb";

const CHALLENGE_COLUMNS = [
  { name: "access_password_hash", sql: "VARCHAR(255) NULL" },
  { name: "access_password_salt", sql: "VARCHAR(64) NULL" },
  { name: "password_updated_at", sql: "TIMESTAMP NULL DEFAULT NULL" },
  { name: "tutor_stage", sql: "VARCHAR(40) NULL" },
  { name: "tutor_summary", sql: "VARCHAR(255) NULL" },
  { name: "tutor_next_step", sql: "VARCHAR(255) NULL" },
  { name: "tutor_focus_area", sql: "VARCHAR(255) NULL" },
  { name: "tutor_sessions_completed", sql: "INT NOT NULL DEFAULT 0" },
  { name: "tutor_best_score", sql: "INT NOT NULL DEFAULT 0" },
  { name: "tutor_last_score", sql: "INT NOT NULL DEFAULT 0" },
  { name: "tutor_avg_score", sql: "DECIMAL(10,2) NOT NULL DEFAULT 0" },
  { name: "tutor_last_session_at", sql: "TIMESTAMP NULL DEFAULT NULL" },
] as const;

let ensureColumnsPromise: Promise<void> | null = null;

export async function ensureMindSutraSchema() {
  if (!ensureColumnsPromise) {
    ensureColumnsPromise = (async () => {
      const existing = await dbQuery<{ column_name: string }>(
        `
          SELECT COLUMN_NAME AS column_name
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'ms_challenge_users'
        `
      );
      const existingNames = new Set(existing.map((row) => row.column_name));
      const missing = CHALLENGE_COLUMNS.filter((column) => !existingNames.has(column.name));
      if (missing.length > 0) {
        const alterSql = `ALTER TABLE ms_challenge_users ${missing
          .map((column) => `ADD COLUMN ${column.name} ${column.sql}`)
          .join(", ")}`;
        await dbExecute(alterSql);
      }
    })().catch((error) => {
      ensureColumnsPromise = null;
      throw error;
    });
  }

  return ensureColumnsPromise;
}

export function hashMindSutraPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyMindSutraPassword(password: string, salt: string, expectedHash: string) {
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expectedHash, "hex"));
}

export function buildMindSutraTutorSnapshot(input: {
  score?: number;
  sessionsCompleted?: number;
  bestScore?: number;
  grade?: number | string | null;
}) {
  const score = Number(input.score ?? 0);
  const sessionsCompleted = Number(input.sessionsCompleted ?? 0);
  const bestScore = Number(input.bestScore ?? score);
  const grade = Number(input.grade ?? 0) || null;

  if (sessionsCompleted <= 0 && score <= 0) {
    return {
      tutor_stage: "Getting Started",
      tutor_summary: "Student is ready for the first diagnostic and foundation lesson.",
      tutor_next_step: "Start the foundation lesson and capture a baseline score.",
      tutor_focus_area: grade ? `Grade ${grade} foundation and number sense` : "Foundation and number sense",
    };
  }

  if (score < 300) {
    return {
      tutor_stage: "Building Foundation",
      tutor_summary: "Student needs repetition on core patterns before moving faster.",
      tutor_next_step: "Practice the foundational lesson again with slower guided examples.",
      tutor_focus_area: "Accuracy, number sense, and confidence",
    };
  }

  if (score < 700) {
    return {
      tutor_stage: "Growing Speed",
      tutor_summary: "Student is improving and should continue with the next guided step.",
      tutor_next_step: "Move to the next lesson and keep the pace adaptive.",
      tutor_focus_area: "Speed, recall, and clean working",
    };
  }

  return {
    tutor_stage: "Advanced Track",
    tutor_summary: "Student is performing well and should be stretched with harder problems.",
    tutor_next_step: "Advance to the next level and add one challenge set per week.",
    tutor_focus_area: bestScore > score ? "Consistency under time" : "Stretch practice and challenge sets",
  };
}

export async function updateMindSutraTutorState(phone: string, payload: {
  score?: number;
  grade?: number | string | null;
  studentName?: string;
  parentName?: string;
}) {
  await ensureMindSutraSchema();
  const sanitizedPhone = String(phone).trim();
  const existing = await dbQueryOne<{
    tutor_sessions_completed: number;
    tutor_best_score: number;
    tutor_avg_score: number;
  }>(
    `SELECT tutor_sessions_completed, tutor_best_score, tutor_avg_score FROM ms_challenge_users WHERE TRIM(phone) = ?`,
    [sanitizedPhone]
  );
  if (!existing) return;

  const score = Number(payload.score ?? 0);
  const sessionsCompleted = Number(existing.tutor_sessions_completed ?? 0) + (score > 0 ? 1 : 0);
  const bestScore = Math.max(Number(existing.tutor_best_score ?? 0), score);
  const avgScore = sessionsCompleted > 0
    ? ((Number(existing.tutor_avg_score ?? 0) * Math.max(0, sessionsCompleted - 1)) + score) / sessionsCompleted
    : 0;
  const snapshot = buildMindSutraTutorSnapshot({
    score,
    sessionsCompleted,
    bestScore,
    grade: payload.grade ?? null,
  });

  await dbExecute(
    `
      UPDATE ms_challenge_users
      SET tutor_stage = ?,
          tutor_summary = ?,
          tutor_next_step = ?,
          tutor_focus_area = ?,
          tutor_sessions_completed = ?,
          tutor_best_score = ?,
          tutor_last_score = ?,
          tutor_avg_score = ?,
          tutor_last_session_at = CURRENT_TIMESTAMP
      WHERE TRIM(phone) = ?
    `,
    [
      snapshot.tutor_stage,
      snapshot.tutor_summary,
      snapshot.tutor_next_step,
      snapshot.tutor_focus_area,
      sessionsCompleted,
      bestScore,
      score,
      avgScore.toFixed(2),
      sanitizedPhone,
    ]
  );
}
