/**
 * /api/yamuna/program-progress
 *
 * GET  ?chapterId=JCH01_HELLO
 *      → Returns completed program IDs + scores for the chapter so the client
 *        can resume the practice session from the correct program.
 *
 * POST { programId, chapterId, tier, tierIndex, score, xpEarned,
 *         hintsUsed, failedAttempts, testCasesPassed, totalTestCases,
 *         secondsElapsed, solved }
 *      → Upserts attempt to DB (keeping best score), adds XP to session cookie,
 *        returns { ok, newXp, chapterXp }.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  APP_SESSION_COOKIE,
  buildDefaultSession,
  parseAppSession,
  serializeAppSession,
} from "@/lib/appSession";
import {
  saveYamunaProgramAttempt,
  loadYamunaChapterProgress,
} from "@/lib/yamunaProgramProgressDb";

function getSessionOrGuest() {
  return {
    getSession: (raw?: string | null) =>
      parseAppSession(raw) ??
      buildDefaultSession({ role: "STUDENT", grade: 6, productSlug: "yamuna" }),
  };
}

// ─── GET — load chapter progress for resume ───────────────────────────────────

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const { getSession } = getSessionOrGuest();
  const session = getSession(cookieStore.get(APP_SESSION_COOKIE)?.value);
  const chapterId = req.nextUrl.searchParams.get("chapterId")?.trim();

  if (!chapterId) {
    return NextResponse.json(
      { error: "chapterId query param is required" },
      { status: 400 }
    );
  }

  const studentId = session.childId || session.userId;

  try {
    const progress = await loadYamunaChapterProgress(studentId, chapterId);
    return NextResponse.json(progress);
  } catch (err) {
    console.error("[yamuna/program-progress GET] DB error:", err);
    return NextResponse.json({
      completedProgramIds: [],
      programScores: {},
      totalXp: 0,
      programsSolved: 0,
    });
  }
}

// ─── POST — save program attempt ──────────────────────────────────────────────

export interface ProgramProgressPostBody {
  programId: string;
  chapterId: string;
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

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const { getSession } = getSessionOrGuest();
  const session = getSession(cookieStore.get(APP_SESSION_COOKIE)?.value);

  let body: Partial<ProgramProgressPostBody> | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    programId,
    chapterId,
    tier,
    tierIndex,
    score,
    xpEarned,
    hintsUsed = 0,
    failedAttempts = 0,
    testCasesPassed = 0,
    totalTestCases = 0,
    secondsElapsed = 0,
    solved = false,
  } = body ?? {};

  if (!programId || !chapterId || !tier) {
    return NextResponse.json(
      { error: "programId, chapterId and tier are required" },
      { status: 400 }
    );
  }

  const studentId = session.childId || session.userId;
  const safeScore = Math.min(1, Math.max(0, Number(score) || 0));
  const safeXp = Math.max(0, Math.floor(Number(xpEarned) || 0));

  try {
    await saveYamunaProgramAttempt(studentId, {
      programId:       String(programId),
      chapterId:       String(chapterId),
      tier:            String(tier),
      tierIndex:       Number(tierIndex) || 0,
      score:           safeScore,
      xpEarned:        safeXp,
      hintsUsed:       Math.max(0, Number(hintsUsed)),
      failedAttempts:  Math.max(0, Number(failedAttempts)),
      testCasesPassed: Math.max(0, Number(testCasesPassed)),
      totalTestCases:  Math.max(0, Number(totalTestCases)),
      secondsElapsed:  Math.max(0, Number(secondsElapsed)),
      solved:          Boolean(solved),
    });
  } catch (dbErr) {
    console.error("[yamuna/program-progress POST] DB write failed:", dbErr);
  }

  const prevXp = Number(session.xp) || 0;
  const newXp = prevXp + safeXp;
  const nextSession = { ...session, xp: newXp };

  cookieStore.set(APP_SESSION_COOKIE, serializeAppSession(nextSession), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  let chapterXp = safeXp;
  try {
    const progress = await loadYamunaChapterProgress(studentId, String(chapterId));
    chapterXp = progress.totalXp;
  } catch {
    // Non-critical
  }

  return NextResponse.json({
    ok: true,
    studentId,
    programId,
    score: safeScore,
    xpEarned: safeXp,
    newXp,
    chapterXp,
  });
}
