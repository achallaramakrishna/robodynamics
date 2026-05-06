import { dbExecute } from "@/lib/meeraDb";

export type NeetAttemptRecord = {
  questionId: string;
  chapterCode?: string | null;
  subject?: string | null;
  selectedOption?: string | null;
  correctOption?: string | null;
  isCorrect?: boolean;
  timeTakenSec?: number | null;
  conceptCode?: string | null;
};

export type NeetEventRecord = {
  eventName: string;
  sessionKey?: string | null;
  questionId?: string | null;
  chapterCode?: string | null;
  subject?: string | null;
  sessionType?: string | null;
  payload?: Record<string, any> | null;
};

let telemetryInit: Promise<void> | null = null;

async function ensureTelemetryTables(): Promise<void> {
  if (!telemetryInit) {
    telemetryInit = (async () => {
      await dbExecute(`
        CREATE TABLE IF NOT EXISTS meera_attempts (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          session_key VARCHAR(128) NOT NULL,
          question_id VARCHAR(128) NOT NULL,
          chapter_code VARCHAR(64) NULL,
          subject VARCHAR(32) NULL,
          session_type VARCHAR(32) NOT NULL DEFAULT 'practice',
          selected_option VARCHAR(8) NULL,
          correct_option VARCHAR(8) NULL,
          is_correct TINYINT(1) NOT NULL DEFAULT 0,
          time_taken_sec INT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_meera_attempts_session (session_key),
          INDEX idx_meera_attempts_chapter (chapter_code),
          INDEX idx_meera_attempts_subject (subject)
        )
      `);

      await dbExecute(`
        CREATE TABLE IF NOT EXISTS meera_concept_mastery (
          session_key VARCHAR(128) NOT NULL,
          concept_key VARCHAR(128) NOT NULL,
          subject VARCHAR(32) NOT NULL,
          chapter_code VARCHAR(64) NULL,
          attempts INT NOT NULL DEFAULT 0,
          correct INT NOT NULL DEFAULT 0,
          wrong INT NOT NULL DEFAULT 0,
          accuracy_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          mastery_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          last_attempt_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (session_key, concept_key, subject),
          INDEX idx_meera_concept_mastery_chapter (chapter_code)
        )
      `);

      await dbExecute(`
        CREATE TABLE IF NOT EXISTS meera_event_log (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          event_name VARCHAR(64) NOT NULL,
          session_key VARCHAR(128) NULL,
          question_id VARCHAR(128) NULL,
          chapter_code VARCHAR(64) NULL,
          subject VARCHAR(32) NULL,
          session_type VARCHAR(32) NULL,
          payload_json LONGTEXT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_meera_event_log_name (event_name),
          INDEX idx_meera_event_log_session (session_key),
          INDEX idx_meera_event_log_chapter (chapter_code),
          INDEX idx_meera_event_log_subject (subject)
        )
      `);
    })().catch((err) => {
      telemetryInit = null;
      throw err;
    });
  }

  return telemetryInit;
}

export async function ensureNeetTelemetryReady(): Promise<void> {
  await ensureTelemetryTables();
}

function normalizeConceptKey(attempt: NeetAttemptRecord): string {
  return (
    attempt.conceptCode?.trim() ||
    attempt.chapterCode?.trim() ||
    attempt.subject?.trim() ||
    attempt.questionId.trim()
  );
}

export async function recordNeetAttempts(
  sessionKey: string,
  sessionType: string,
  attempts: NeetAttemptRecord[]
): Promise<void> {
  if (!attempts.length) return;
  await ensureTelemetryTables();

  for (const attempt of attempts) {
    await dbExecute(
      `INSERT INTO meera_attempts
        (session_key, question_id, chapter_code, subject, session_type,
         selected_option, correct_option, is_correct, time_taken_sec)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionKey,
        attempt.questionId,
        attempt.chapterCode ?? null,
        attempt.subject ?? null,
        sessionType,
        attempt.selectedOption ?? null,
        attempt.correctOption ?? null,
        attempt.isCorrect ? 1 : 0,
        attempt.timeTakenSec ?? null,
      ]
    );

    const conceptKey = normalizeConceptKey(attempt);
    const subject = attempt.subject ?? "unknown";
    const chapterCode = attempt.chapterCode ?? null;
    const isCorrect = attempt.isCorrect ? 1 : 0;
    const isWrong = attempt.isCorrect ? 0 : 1;

    await dbExecute(
      `INSERT INTO meera_concept_mastery
        (session_key, concept_key, subject, chapter_code, attempts, correct, wrong, accuracy_pct, mastery_pct, last_attempt_at)
       VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         attempts = attempts + 1,
         correct = correct + VALUES(correct),
         wrong = wrong + VALUES(wrong),
         accuracy_pct = ROUND(((correct + VALUES(correct)) / (attempts + 1)) * 100, 2),
         mastery_pct = ROUND(((correct + VALUES(correct)) / (attempts + 1)) * 100, 2),
         chapter_code = COALESCE(VALUES(chapter_code), chapter_code),
         last_attempt_at = CURRENT_TIMESTAMP`,
      [
        sessionKey,
        conceptKey,
        subject,
        chapterCode,
        isCorrect,
        isWrong,
        isCorrect ? 100 : 0,
        isCorrect ? 100 : 0,
      ]
    );
  }
}

export async function logNeetEvents(events: NeetEventRecord[]): Promise<void> {
  if (!events.length) return;
  await ensureTelemetryTables();

  const values = events.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
  const params: (string | null)[] = [];

  for (const event of events) {
    params.push(
      event.eventName,
      event.sessionKey ?? null,
      event.questionId ?? null,
      event.chapterCode ?? null,
      event.subject ?? null,
      event.sessionType ?? null,
      event.payload ? JSON.stringify(event.payload) : null
    );
  }

  await dbExecute(
    `INSERT INTO meera_event_log
      (event_name, session_key, question_id, chapter_code, subject, session_type, payload_json)
     VALUES ${values}`,
    params
  );
}
