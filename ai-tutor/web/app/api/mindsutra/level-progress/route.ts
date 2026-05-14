// GET  /api/mindsutra/level-progress?studentId=X → full level progress
// POST /api/mindsutra/level-progress → mark lesson complete, award XP, unlock next lesson

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { MINDSUTRA_LEVELS, getMsLevel } from "@/lib/mindsutraCatalog";

const DB = { host: "127.0.0.1", user: "root", password: "Root@2026", database: "robodynamics_db", port: 3306 };

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const studentId = Number(req.nextUrl.searchParams.get("studentId"));
  if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(DB);

    const [progressRows] = await conn.execute(
      `SELECT level_id, lesson_id, status, attempts, best_score, xp_earned FROM rd_vm_student_progress WHERE student_id = ?`,
      [studentId]
    ) as [any[], any];

    const [xpRows] = await conn.execute(
      `SELECT COALESCE(SUM(xp_delta),0) AS total_xp FROM rd_vm_xp_ledger WHERE student_id = ?`,
      [studentId]
    ) as [any[], any];

    const [placementRows] = await conn.execute(
      `SELECT placed_level FROM rd_vm_placements WHERE student_id = ? ORDER BY created_at DESC LIMIT 1`,
      [studentId]
    ) as [any[], any];

    const totalXp: number = xpRows[0]?.total_xp ?? 0;
    const placedLevel: string = placementRows[0]?.placed_level ?? "L1";

    const progressMap = new Map<string, any>();
    for (const row of progressRows) progressMap.set(row.lesson_id, row);

    const levels = MINDSUTRA_LEVELS.map((level) => {
      const lessons = level.lessons.map((lesson) => {
        const prog = progressMap.get(lesson.id);
        return {
          id: lesson.id, title: lesson.title, sutra: lesson.sutra, skill: lesson.skill,
          difficulty: lesson.difficulty, durationMin: lesson.durationMin, freePreview: lesson.freePreview,
          status: prog?.status ?? "locked",
          attempts: prog?.attempts ?? 0,
          bestScore: prog?.best_score ?? null,
          xpEarned: prog?.xp_earned ?? 0,
        };
      });
      const completed = lessons.filter((l) => ["completed", "mastered"].includes(l.status)).length;
      return {
        id: level.id, order: level.order, name: level.name, tagline: level.tagline,
        emoji: level.emoji, color: level.color, gradeEquiv: level.gradeEquiv,
        xpToUnlock: level.xpToUnlock, xpOnComplete: level.xpOnComplete,
        lessonsCompleted: completed, lessonsTotal: level.lessons.length,
        pctComplete: Math.round(completed / level.lessons.length * 100),
        isUnlocked: lessons.some((l) => l.status !== "locked") || level.id === placedLevel,
        isCurrentLevel: level.id === placedLevel,
        lessons,
      };
    });

    return NextResponse.json({ levels, totalXp, placedLevel });
  } catch (err) {
    console.error("[level-progress] GET error:", err);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  } finally {
    await conn?.end();
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json() as { studentId: number; lessonId: string; levelId: string; score: number };
  const { studentId, lessonId, levelId, score } = body;
  if (!studentId || !lessonId || !levelId) {
    return NextResponse.json({ error: "studentId, lessonId, levelId required" }, { status: 400 });
  }

  const isPerfect = score >= 100;
  const xpGained = 20 + (isPerfect ? 10 : 0);
  const level = getMsLevel(levelId);

  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection(DB);

    await conn.execute(
      `INSERT INTO rd_vm_student_progress (student_id, level_id, lesson_id, status, attempts, best_score, xp_earned, last_attempt, completed_at)
       VALUES (?, ?, ?, 'completed', 1, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         attempts=attempts+1, best_score=GREATEST(COALESCE(best_score,0),?),
         xp_earned=xp_earned+?, last_attempt=NOW(),
         completed_at=IF(completed_at IS NULL,NOW(),completed_at)`,
      [studentId, levelId, lessonId, score, xpGained, score, xpGained]
    );
    await conn.execute(
      `INSERT INTO rd_vm_xp_ledger (student_id, xp_delta, reason, ref_id) VALUES (?,?,?,?)`,
      [studentId, 20, "lesson_complete", lessonId]
    );
    if (isPerfect) {
      await conn.execute(
        `INSERT INTO rd_vm_xp_ledger (student_id, xp_delta, reason, ref_id) VALUES (?,?,?,?)`,
        [studentId, 10, "lesson_perfect", lessonId]
      );
    }

    // Unlock next lesson
    const idx = level?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
    let nextLessonUnlocked: string | null = null;
    if (idx >= 0 && idx + 1 < (level?.lessons.length ?? 0)) {
      const next = level!.lessons[idx + 1];
      await conn.execute(
        `INSERT IGNORE INTO rd_vm_student_progress (student_id, level_id, lesson_id, status) VALUES (?,?,?,'available')`,
        [studentId, levelId, next.id]
      );
      nextLessonUnlocked = next.id;
    }

    const [doneRows] = await conn.execute(
      `SELECT COUNT(*) AS done FROM rd_vm_student_progress WHERE student_id=? AND level_id=? AND status IN ('completed','mastered')`,
      [studentId, levelId]
    ) as [any[], any];
    const levelComplete = (doneRows[0]?.done ?? 0) >= (level?.lessons.length ?? 8);

    return NextResponse.json({ success: true, xpGained, isPerfect, levelComplete, nextLessonUnlocked });
  } catch (err) {
    console.error("[level-progress] POST error:", err);
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  } finally {
    await conn?.end();
  }
}
