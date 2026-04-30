import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  APP_SESSION_COOKIE,
  buildDefaultSession,
  parseAppSession,
  serializeAppSession,
} from "@/lib/appSession";
import {
  buildMindSutraLearnerSnapshot,
  getMindSutraLessonSkillKeys,
  mergeMindSutraSkillMasteryIntoSession,
  updateMindSutraSessionProgress,
} from "@/lib/mindsutraPersonalization";
import {
  loadMindSutraSkillMastery,
  saveMindSutraSkillMastery,
  syncMindSutraLessonProgress,
  loadMindSutraCompletedLessons,
} from "@/lib/mindsutraSkillMasteryDb";
import { getMsLesson } from "@/lib/mindsutraCatalog";

function getSessionOrDefault(raw?: string | null) {
  return parseAppSession(raw) ?? buildDefaultSession({ role: "STUDENT", grade: 5, productSlug: "mindsutra" });
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = getSessionOrDefault(cookieStore.get(APP_SESSION_COOKIE)?.value);
  const lessonId = req.nextUrl.searchParams.get("lessonId") ?? "VM_L1_1";
  let effectiveSession = session;

  try {
    const studentId = session.childId || session.userId;
    const [persistedSkills, completedIds] = await Promise.all([
      loadMindSutraSkillMastery(studentId),
      loadMindSutraCompletedLessons(studentId),
    ]);
    
    if (persistedSkills.length || completedIds.length) {
      effectiveSession = mergeMindSutraSkillMasteryIntoSession(session, persistedSkills, completedIds);
    }
  } catch {
    // DB persistence is additive. If it is unavailable, the cookie session still works.
  }

  return NextResponse.json(buildMindSutraLearnerSnapshot(effectiveSession, lessonId));
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = getSessionOrDefault(cookieStore.get(APP_SESSION_COOKIE)?.value);
  const body = await req.json().catch(() => null) as {
    lessonId?: string;
    lessonTitle?: string;
    eventType?: "attempt" | "hint" | "lesson_complete" | "concept_check" | "transfer_check";
    isCorrect?: boolean;
    skillKeys?: string[];
    confidenceScore?: number;
    xpDelta?: number;
  } | null;

  const lessonId = body?.lessonId?.trim() || "VM_L1_1";
  const lessonTitle = body?.lessonTitle?.trim() || lessonId;
  const eventType = body?.eventType ?? "attempt";
  let effectiveSession = session;

  try {
    const studentId = session.childId || session.userId;
    const [persistedSkills, completedIds] = await Promise.all([
      loadMindSutraSkillMastery(studentId),
      loadMindSutraCompletedLessons(studentId),
    ]);
    
    if (persistedSkills.length || completedIds.length) {
      effectiveSession = mergeMindSutraSkillMasteryIntoSession(session, persistedSkills, completedIds);
    }
  } catch {
    // Fall back to cookie-only personalization when DB persistence is unavailable.
  }

  const nextSession = updateMindSutraSessionProgress(effectiveSession, {
    lessonId,
    lessonTitle,
    eventType,
    isCorrect: Boolean(body?.isCorrect),
    skillKeys: body?.skillKeys?.length ? body.skillKeys : getMindSutraLessonSkillKeys(lessonId),
    confidenceScore: typeof body?.confidenceScore === "number" ? body.confidenceScore : undefined,
    xpDelta: typeof body?.xpDelta === "number" ? body.xpDelta : undefined,
  });

  try {
    await saveMindSutraSkillMastery(nextSession.childId || nextSession.userId, nextSession.skillMastery);
    
    // Sync to student progress table for home dashboard
    const lesson = getMsLesson(lessonId);
    if (lesson) {
      const summary = buildMindSutraLearnerSnapshot(nextSession, lessonId);
      await syncMindSutraLessonProgress(
        nextSession.childId || nextSession.userId,
        lessonId,
        lesson.levelId,
        Math.round(summary.conceptClarityScore * 100),
        eventType === "lesson_complete"
      );
    }
  } catch {
    // Keep the student flow responsive even if DB persistence is temporarily unavailable.
  }

  cookieStore.set(APP_SESSION_COOKIE, serializeAppSession(nextSession), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return NextResponse.json(buildMindSutraLearnerSnapshot(nextSession, lessonId));
}
