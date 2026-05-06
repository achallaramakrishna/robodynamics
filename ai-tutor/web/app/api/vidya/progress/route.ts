import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  APP_SESSION_COOKIE,
  buildDefaultSession,
  parseAppSession,
  serializeAppSession,
} from "@/lib/appSession";
import {
  buildVidyaLearnerSnapshot,
  getVidyaLessonSkillKeys,
  mergeVidyaSkillMasteryIntoSession,
  updateVidyaSessionProgress,
} from "@/lib/vidyaPersonalization";
import {
  loadVidyaSkillMastery,
  saveVidyaSkillMastery,
  syncVidyaLessonProgress,
  loadVidyaCompletedLessons,
} from "@/lib/vidyaProgressDb";
import { getVidyaLesson } from "@/lib/vidyaCatalog";

function getSessionOrDefault(raw?: string | null) {
  return parseAppSession(raw) ?? buildDefaultSession({ role: "STUDENT", grade: 6, productSlug: "vidya" });
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = getSessionOrDefault(cookieStore.get(APP_SESSION_COOKIE)?.value);
  const lessonId = req.nextUrl.searchParams.get("lessonId") ?? "PY_L1_01_SETUP";
  let effectiveSession = session;

  try {
    const studentId = session.childId || session.userId;
    const [persistedSkills, completedIds] = await Promise.all([
      loadVidyaSkillMastery(studentId),
      loadVidyaCompletedLessons(studentId),
    ]);
    
    if (persistedSkills.length || completedIds.length) {
      effectiveSession = mergeVidyaSkillMasteryIntoSession(session, persistedSkills, completedIds);
    }
  } catch {
    // DB persistence is additive. If it is unavailable, the cookie session still works.
  }

  return NextResponse.json(buildVidyaLearnerSnapshot(effectiveSession, lessonId));
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

  const lessonId = body?.lessonId?.trim() || "PY_L1_01_SETUP";
  const lessonTitle = body?.lessonTitle?.trim() || lessonId;
  const eventType = body?.eventType ?? "attempt";
  let effectiveSession = session;

  try {
    const studentId = session.childId || session.userId;
    const [persistedSkills, completedIds] = await Promise.all([
      loadVidyaSkillMastery(studentId),
      loadVidyaCompletedLessons(studentId),
    ]);
    
    if (persistedSkills.length || completedIds.length) {
      effectiveSession = mergeVidyaSkillMasteryIntoSession(session, persistedSkills, completedIds);
    }
  } catch {
    // Fall back to cookie-only personalization when DB persistence is unavailable.
  }

  const nextSession = updateVidyaSessionProgress(effectiveSession, {
    lessonId,
    lessonTitle,
    eventType,
    isCorrect: Boolean(body?.isCorrect),
    skillKeys: body?.skillKeys?.length ? body.skillKeys : getVidyaLessonSkillKeys(lessonId),
    confidenceScore: typeof body?.confidenceScore === "number" ? body.confidenceScore : undefined,
    xpDelta: typeof body?.xpDelta === "number" ? body.xpDelta : undefined,
  });

  try {
    await saveVidyaSkillMastery(nextSession.childId || nextSession.userId, nextSession.skillMastery || []);
    
    // Sync to student progress table for home dashboard
    const payload = getVidyaLesson(lessonId, nextSession);
    if (payload) {
      const summary = buildVidyaLearnerSnapshot(nextSession, lessonId);
      // Average out mastery score to send to progress table if needed
      await syncVidyaLessonProgress(
        nextSession.childId || nextSession.userId,
        lessonId,
        payload.course.levelId,
        100, // Pass 100 for completed score, or dynamic if needed
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

  return NextResponse.json(buildVidyaLearnerSnapshot(nextSession, lessonId));
}
