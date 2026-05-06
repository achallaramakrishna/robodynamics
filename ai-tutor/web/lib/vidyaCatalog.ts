import type { VidyaLessonPayload } from "./vidyaLessonTypes";
import type { AppSession } from "./appSession";
import {
  getStudentTheme,
  get_PY_L1_01_SETUP_LESSON,
  get_PY_L1_04_LOGIC_LESSON,
} from "./vidyaLessonsL1";

/**
 * The Central Switchboard for the Vidya AI Tutor.
 * Given a lesson ID and a session, it computes the exact dynamic payload 
 * for the interactive React engine.
 */
export function getVidyaLesson(lessonId: string, session?: AppSession): VidyaLessonPayload | null {
  const theme = getStudentTheme(session);
  
  switch (lessonId) {
    case "PY_L1_01_SETUP":
      return get_PY_L1_01_SETUP_LESSON(theme);
    case "PY_L1_04_LOGIC":
      return get_PY_L1_04_LOGIC_LESSON(theme);
    // TODO: Add remaining 10 lessons for Level 1
    default:
      return null;
  }
}
