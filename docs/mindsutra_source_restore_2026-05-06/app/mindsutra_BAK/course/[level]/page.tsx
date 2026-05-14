import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import { buildMindSutraCoursePayload } from "@/lib/mindsutraCourseData";
import { loadMindSutraSkillMastery, loadMindSutraCompletedLessons } from "@/lib/mindsutraSkillMasteryDb";
import { mergeMindSutraSkillMasteryIntoSession } from "@/lib/mindsutraPersonalization";
import MindSutraCourseClient from "./MindSutraCourseClient";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [
    { level: "level-1" },
    { level: "level-2" },
    { level: "level-3" },
    { level: "level-4" },
    { level: "level-5" },
  ];
}

export default async function MindSutraCoursePage(
  { params }: { params: { level: string } },
) {
  const { level } = params;
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);
  
  let effectiveSession = session;
  if (session) {
    try {
      const studentId = session.childId || session.userId;
      const [persistedSkills, completedIds] = await Promise.all([
        loadMindSutraSkillMastery(studentId),
        loadMindSutraCompletedLessons(studentId),
      ]);
      
      if (persistedSkills.length || completedIds.length) {
        effectiveSession = mergeMindSutraSkillMasteryIntoSession(session, persistedSkills, completedIds);
      }
    } catch (e) {
      console.error("[CoursePage] Failed to sync progress from DB:", e);
    }
  }

  const payload = buildMindSutraCoursePayload(level, undefined, effectiveSession);
  return <MindSutraCourseClient payload={payload} />;
}
