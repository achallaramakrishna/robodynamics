import fs from "node:fs";
import path from "node:path";

import { registerLessonScenarios } from "./lesson-scenarios.shared";

type ChapterLesson = {
  title?: string;
};

function resolveChapterPath(chapterCode: string): string {
  const chapterRoot = path.resolve(process.cwd(), "..", "tutor-api", "content-template", "vedic_math", "chapter");
  const directPath = path.join(chapterRoot, `${chapterCode}.json`);
  if (fs.existsSync(directPath)) {
    return directPath;
  }
  throw new Error(`Chapter JSON not found for ${chapterCode} in ${chapterRoot}`);
}

function loadLessonTitle(chapterCode: string): string {
  const chapterPath = resolveChapterPath(chapterCode);
  const lesson = JSON.parse(fs.readFileSync(chapterPath, "utf8")) as ChapterLesson;
  const lessonTitle = String(lesson.title || "").trim();
  if (!lessonTitle) {
    throw new Error(`Chapter JSON ${chapterPath} does not contain a title`);
  }
  return lessonTitle;
}

const chapterCode = String(process.env.TUTOR_CHAPTER_CODE || "").trim().toUpperCase();
if (!chapterCode) {
  throw new Error("TUTOR_CHAPTER_CODE is required for the generic prod lesson scenarios.");
}

const lessonTitle = loadLessonTitle(chapterCode);

registerLessonScenarios({
  suiteName: `${lessonTitle} prod readiness`,
  chapterCode,
  lessonTitle,
  reportDirName: chapterCode.toLowerCase(),
});
