import fs from "node:fs";
import path from "node:path";

import { registerLessonScenarios } from "./lesson-scenarios.shared";

type ChapterEntry = {
  chapterCode?: string;
  title?: string;
};

type ChaptersJson = {
  chapters?: ChapterEntry[];
};

type ChapterLesson = {
  title?: string;
  duolingoLessonArc?: { mission?: { missionTitle?: string } };
};

const contentRoot = path.resolve(process.cwd(), "..", "tutor-api", "content-template");

/**
 * Resolve the human-readable lesson title for a chapter code.
 *
 * The content-template directory layout is:
 *   content-template/{courseDirName}/grade_{N}/chapters.json   ← courseId field inside = e.g. "vedic_math_g4"
 *   content-template/{courseDirName}/chapters.json             ← top-level legacy
 *   content-template/{courseDirName}/chapter/{CODE}.json       ← per-file legacy
 *
 * The courseId injected by the runner (e.g. "vedic_math_g4") may NOT match the
 * directory name ("vedic_math"), so we do a full scan of all chapters.json files
 * in the content tree looking for a matching chapterCode entry.
 */
function loadLessonTitle(chapterCode: string, courseId: string): string {
  const code = chapterCode.toUpperCase();

  // Walk every course dir in content-template
  for (const courseDirName of fs.readdirSync(contentRoot)) {
    const coursePath = path.join(contentRoot, courseDirName);
    if (!fs.statSync(coursePath).isDirectory()) continue;

    // 1. grade_X/chapters.json (new-style, courseId inside matches e.g. vedic_math_g4)
    for (const sub of fs.readdirSync(coursePath)) {
      const subPath = path.join(coursePath, sub);
      if (!fs.statSync(subPath).isDirectory()) continue;
      const chaptersJson = path.join(subPath, "chapters.json");
      if (!fs.existsSync(chaptersJson)) continue;
      try {
        const raw = JSON.parse(fs.readFileSync(chaptersJson, "utf8")) as ChaptersJson & { courseId?: string };
        const jsonCourseId = String(raw.courseId || "");
        // Only scan this file if it belongs to our courseId OR courseId dir prefix matches
        if (courseId && jsonCourseId && jsonCourseId !== courseId) continue;
        const entry = (raw.chapters || []).find(
          (ch) => String(ch.chapterCode || "").toUpperCase() === code,
        );
        if (entry?.title) {
          // Prefer missionTitle from the chapter JSON file (what the topbar actually shows).
          // The topbar uses duolingoArc.mission.missionTitle over chapters.json title.
          const chapterJsonPath = path.join(subPath, "chapter", `${code}.json`);
          if (fs.existsSync(chapterJsonPath)) {
            try {
              const chRaw = JSON.parse(fs.readFileSync(chapterJsonPath, "utf8")) as ChapterLesson;
              const mt = chRaw.duolingoLessonArc?.mission?.missionTitle?.trim();
              if (mt) return mt;
            } catch { /* fall through */ }
          }
          return entry.title.trim();
        }
      } catch { /* skip */ }
    }

    // 2. Top-level chapters.json
    const topJson = path.join(coursePath, "chapters.json");
    if (fs.existsSync(topJson)) {
      try {
        const raw = JSON.parse(fs.readFileSync(topJson, "utf8")) as ChaptersJson & { courseId?: string };
        const jsonCourseId = String(raw.courseId || "");
        if (!courseId || !jsonCourseId || jsonCourseId === courseId) {
          const entry = (raw.chapters || []).find(
            (ch) => String(ch.chapterCode || "").toUpperCase() === code,
          );
          if (entry?.title) return entry.title.trim();
        }
      } catch { /* skip */ }
    }

    // 3. Legacy chapter/{code}.json (old L1-L16, no courseId to cross-check)
    //    Prefer missionTitle (what the topbar actually shows) over title.
    const legacyFile = path.join(coursePath, "chapter", `${code}.json`);
    if (fs.existsSync(legacyFile)) {
      try {
        const raw = JSON.parse(fs.readFileSync(legacyFile, "utf8")) as ChapterLesson;
        const missionTitle = raw.duolingoLessonArc?.mission?.missionTitle?.trim();
        if (missionTitle) return missionTitle;
        if (raw.title?.trim()) return raw.title.trim();
      } catch { /* skip */ }
    }

    // 3b. Grade subdir chapter/{code}.json (new-style, e.g. vedic_math/grade_4/chapter/)
    for (const sub of fs.readdirSync(coursePath)) {
      const subPath = path.join(coursePath, sub);
      if (!fs.statSync(subPath).isDirectory()) continue;
      const gradeChapterFile = path.join(subPath, "chapter", `${code}.json`);
      if (fs.existsSync(gradeChapterFile)) {
        try {
          const raw = JSON.parse(fs.readFileSync(gradeChapterFile, "utf8")) as ChapterLesson;
          const missionTitle = raw.duolingoLessonArc?.mission?.missionTitle?.trim();
          if (missionTitle) return missionTitle;
          if (raw.title?.trim()) return raw.title.trim();
        } catch { /* skip */ }
      }
    }
  }

  throw new Error(
    `Could not resolve title for chapter "${code}" in courseId "${courseId}". ` +
      `Searched under ${contentRoot}`,
  );
}

// ── Read env vars injected by run-prod-all-lessons-test.mjs ──────────────────
const chapterCode = String(process.env.TUTOR_CHAPTER_CODE || "").trim().toUpperCase();
const courseId    = String(process.env.TUTOR_COURSE_ID   || "vedic_math").trim();
const module      = String(process.env.TUTOR_MODULE      || "VEDIC_MATH").trim();
const grade       = String(process.env.TUTOR_GRADE       || "6").trim();

if (!chapterCode) {
  throw new Error("TUTOR_CHAPTER_CODE is required for the generic prod lesson scenarios.");
}

const lessonTitle = loadLessonTitle(chapterCode, courseId);

registerLessonScenarios({
  suiteName:     `${lessonTitle} prod readiness`,
  chapterCode,
  lessonTitle,
  courseId,
  module,
  grade,
  reportDirName: `${courseId}__${chapterCode.toLowerCase()}`,
});
