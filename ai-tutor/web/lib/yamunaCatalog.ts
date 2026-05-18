import type { YamunaLessonPayload } from "./yamunaLessonTypes";
import type { AppSession } from "./appSession";
import {
  getStudentTheme,
  get_JV_L1_01_HELLO_LESSON,
  get_JV_L1_02_VARS_LESSON,
  get_JV_L1_03_MATH_LESSON,
  get_JV_L1_04_LOGIC_LESSON,
  get_JV_L1_05_LOOPS_LESSON,
  get_JV_L1_06_ARRAYS_LESSON,
} from "./yamunaLessonsL1";

export interface YamunaLessonMeta {
  id: string;
  title: string;
  levelSlug: string;
  levelTitle: string;
}

// ── Level 1 ───────────────────────────────────────────────────────────────────

export const YAMUNA_LEVEL1_LESSONS: YamunaLessonMeta[] = [
  { id: "JV_L1_01_HELLO",  title: "Hello World & Output",    levelSlug: "level-1", levelTitle: "Level 1 — Foundations" },
  { id: "JV_L1_02_VARS",   title: "Variables & Data Types",  levelSlug: "level-1", levelTitle: "Level 1 — Foundations" },
  { id: "JV_L1_03_MATH",   title: "Operators & Math",        levelSlug: "level-1", levelTitle: "Level 1 — Foundations" },
  { id: "JV_L1_04_LOGIC",  title: "Conditionals",            levelSlug: "level-1", levelTitle: "Level 1 — Foundations" },
  { id: "JV_L1_05_LOOPS",  title: "Loops",                   levelSlug: "level-1", levelTitle: "Level 1 — Foundations" },
  { id: "JV_L1_06_ARRAYS", title: "Arrays & Strings",        levelSlug: "level-1", levelTitle: "Level 1 — Foundations" },
];

// ── All lessons flat list (for nav) ──────────────────────────────────────────

export const ALL_YAMUNA_LESSONS: YamunaLessonMeta[] = [
  ...YAMUNA_LEVEL1_LESSONS,
];

// ── Navigation helper ─────────────────────────────────────────────────────────

export function getYamunaNavContext(lessonId: string) {
  const all = ALL_YAMUNA_LESSONS;
  const idx = all.findIndex((l) => l.id === lessonId);
  const current = all[idx];
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;
  return {
    levelSlug:       current?.levelSlug  ?? "level-1",
    levelTitle:      current?.levelTitle ?? "Level 1 — Foundations",
    prevLessonId:    prev?.id,
    prevLessonTitle: prev?.title,
    nextLessonId:    next?.id,
    nextLessonTitle: next?.title,
  };
}

// ── re-export theme helper so lesson files can import from here ───────────────
export { getStudentTheme };

/**
 * Central switchboard — returns the interactive lesson payload for any lesson ID.
 */
export function getYamunaLesson(lessonId: string, session?: AppSession): YamunaLessonPayload | null {
  const theme = getStudentTheme(session);

  switch (lessonId) {
    // ── Level 1 ──────────────────────────────────────────────────────────────
    case "JV_L1_01_HELLO":  return get_JV_L1_01_HELLO_LESSON(theme);
    case "JV_L1_02_VARS":   return get_JV_L1_02_VARS_LESSON(theme);
    case "JV_L1_03_MATH":   return get_JV_L1_03_MATH_LESSON(theme);
    case "JV_L1_04_LOGIC":  return get_JV_L1_04_LOGIC_LESSON(theme);
    case "JV_L1_05_LOOPS":  return get_JV_L1_05_LOOPS_LESSON(theme);
    case "JV_L1_06_ARRAYS": return get_JV_L1_06_ARRAYS_LESSON(theme);

    default:
      return null;
  }
}
