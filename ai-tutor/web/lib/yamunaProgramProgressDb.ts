/**
 * yamunaProgramProgressDb.ts
 *
 * DB layer for the Yamuna adaptive Java program bank.
 * Tables:  rd_yamuna_program_attempts  (one row per student × program, best-score UPSERT)
 *          rd_yamuna_chapter_xp        (denormalised XP totals per chapter)
 *
 * All functions are safe to call from Next.js API routes (mysql2 pool, no leaks).
 */

import { dbExecute, dbQuery } from "./meeraDb";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SaveProgramAttemptInput {
  chapterId: string;
  programId: string;
  tier: string;
  tierIndex: number;
  score: number;
  xpEarned: number;
  hintsUsed: number;
  failedAttempts: number;
  testCasesPassed: number;
  totalTestCases: number;
  secondsElapsed: number;
  solved: boolean;
}

export interface ChapterProgress {
  completedProgramIds: string[];
  programScores: Record<string, number>;
  totalXp: number;
  programsSolved: number;
}

// ─── Save / upsert one program attempt ───────────────────────────────────────

export async function saveYamunaProgramAttempt(
  studentId: number,
  input: SaveProgramAttemptInput
): Promise<void> {
  if (!studentId) return;

  await dbExecute(
    `
    INSERT INTO rd_yamuna_program_attempts
      (student_id, chapter_id, program_id, tier, tier_index, score, xp_earned,
       hints_used, failed_attempts, test_cases_passed, total_test_cases,
       seconds_elapsed, solved, attempt_count, first_solved_at)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1,
       IF(? = 1, NOW(), NULL))
    ON DUPLICATE KEY UPDATE
      attempt_count     = attempt_count + 1,
      score             = GREATEST(score, VALUES(score)),
      xp_earned         = GREATEST(xp_earned, VALUES(xp_earned)),
      hints_used        = LEAST(hints_used, VALUES(hints_used)),
      failed_attempts   = LEAST(failed_attempts, VALUES(failed_attempts)),
      test_cases_passed = GREATEST(test_cases_passed, VALUES(test_cases_passed)),
      seconds_elapsed   = LEAST(seconds_elapsed, VALUES(seconds_elapsed)),
      solved            = GREATEST(solved, VALUES(solved)),
      first_solved_at   = IF(first_solved_at IS NULL AND VALUES(solved) = 1, NOW(), first_solved_at),
      updated_at        = NOW()
    `,
    [
      studentId,
      input.chapterId,
      input.programId,
      input.tier,
      input.tierIndex,
      input.score,
      input.xpEarned,
      input.hintsUsed,
      input.failedAttempts,
      input.testCasesPassed,
      input.totalTestCases,
      input.secondsElapsed,
      input.solved ? 1 : 0,
      input.solved ? 1 : 0,
    ]
  );

  if (input.solved) {
    await dbExecute(
      `
      INSERT INTO rd_yamuna_chapter_xp (student_id, chapter_id, total_xp, programs_solved)
      VALUES (?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        total_xp        = total_xp + GREATEST(0, VALUES(total_xp) - COALESCE(
          (SELECT xp_earned FROM rd_yamuna_program_attempts
           WHERE student_id = ? AND program_id = ? LIMIT 1), 0
        )),
        programs_solved = (
          SELECT COUNT(*) FROM rd_yamuna_program_attempts
          WHERE student_id = ? AND chapter_id = ? AND solved = 1
        ),
        last_activity = NOW()
      `,
      [
        studentId, input.chapterId, input.xpEarned,
        studentId, input.programId,
        studentId, input.chapterId,
      ]
    );
  }
}

// ─── Load progress for resume ─────────────────────────────────────────────────

export async function loadYamunaChapterProgress(
  studentId: number,
  chapterId: string
): Promise<ChapterProgress> {
  if (!studentId || !chapterId) {
    return { completedProgramIds: [], programScores: {}, totalXp: 0, programsSolved: 0 };
  }

  const rows = await dbQuery<{
    program_id: string;
    score: string;
    xp_earned: number;
    solved: number;
  }>(
    `
    SELECT program_id, score, xp_earned, solved
    FROM rd_yamuna_program_attempts
    WHERE student_id = ? AND chapter_id = ?
    `,
    [studentId, chapterId]
  );

  const completedProgramIds: string[] = [];
  const programScores: Record<string, number> = {};
  let totalXp = 0;

  for (const row of rows) {
    programScores[row.program_id] = parseFloat(row.score);
    if (row.solved) {
      completedProgramIds.push(row.program_id);
      totalXp += Number(row.xp_earned);
    }
  }

  return {
    completedProgramIds,
    programScores,
    totalXp,
    programsSolved: completedProgramIds.length,
  };
}
