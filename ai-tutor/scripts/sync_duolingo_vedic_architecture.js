const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");
const CHAPTER_DIRS = [
  path.join(ROOT, "tutor-api", "content-template", "vedic_math", "chapter"),
  path.join(REPO_ROOT, "docs", "vedic_math", "chapter"),
];
const LESSON_PLAN_DIR = path.join(REPO_ROOT, "docs", "vedic_math", "lesson_plans");

const KNOWN_LANGUAGE_OPTIONS = ["English", "English + Hindi", "Hindi"];
const LEARNER_LEVEL_OPTIONS = ["I am a beginner", "I know a little", "I already practice"];
const GOAL_OPTIONS = ["School math", "Mental speed", "Exam practice"];
const EXERCISE_GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const XP_REWARDS = [10, 10, 12, 12, 14, 14, 16, 16, 20];

function listChapterFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => /^L\d+.*\.json$/.test(name) && !name.includes("Copy") && !name.endsWith(".bak"))
    .sort((a, b) => Number(a.match(/^L(\d+)/)[1]) - Number(b.match(/^L(\d+)/)[1]));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function safeText(value, fallback = "") {
  const text = String(value || "").trim();
  return text || fallback;
}

function sentenceCase(text) {
  const value = safeText(text);
  if (!value) return "";
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function normalizeSubtopicLabel(text) {
  return safeText(text).replace(/\s+/g, " ");
}

function shortTitle(chapterTitle) {
  return safeText(chapterTitle).replace(/^Lesson\s+\d+:\s*/i, "");
}

function recommendedLevel(lessonNum) {
  if (lessonNum <= 4) return "beginner";
  if (lessonNum <= 10) return "familiar";
  return "confident";
}

function firstMatchingFallback(screenplay, exerciseGroup, microPractice) {
  const match = Array.isArray(screenplay)
    ? screenplay.find((beat) => safeText(beat.exerciseGroup) === exerciseGroup && safeText(beat.fallbackHint))
    : null;
  return safeText(match && match.fallbackHint, microPractice || "Try one smaller version of the same pattern.");
}

function badgeFocus(subtopic) {
  const parts = normalizeSubtopicLabel(subtopic)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);
  return `${parts.join(" ")} Star`.trim();
}

function buildDuolingoArc(chapterFile, chapter) {
  const lessonNum = Number(chapterFile.match(/^L(\d+)/)[1]);
  const title = safeText(chapter.title, chapterFile.replace(/\.json$/, ""));
  const topic = shortTitle(title);
  const teachingScript = Array.isArray(chapter.teachingScript) ? chapter.teachingScript : [];
  const screenplay = Array.isArray(chapter.screenplay) ? chapter.screenplay : [];
  const goals = Array.isArray(chapter.learningGoals) ? chapter.learningGoals.filter(Boolean) : [];

  const sessionFlow = teachingScript.map((step, index) => {
    const group = safeText(step.exerciseGroup, EXERCISE_GROUPS[index] || "A");
    const subtopic = safeText(step.subtopic, `Exercise ${group}`);
    const checkpoint = sentenceCase(step.checkpointPrompt || `Explain the first move in ${subtopic}`);
    const microPractice = sentenceCase(step.microPractice || `Solve one more ${subtopic} problem.`);
    const retryHint = sentenceCase(firstMatchingFallback(screenplay, group, microPractice));

    return {
      exerciseGroup: group,
      subtopic,
      missionStepTitle: `Exercise ${group}: ${subtopic}`,
      coachHook: sentenceCase(step.teacherLine || `Let us learn ${subtopic}.`),
      boardDemo: sentenceCase(step.boardAction || `Show one worked example for ${subtopic}.`),
      readAloudPrompt: checkpoint,
      tryPrompt: "Niagh, try this one. Say your first step, then your answer.",
      masteryCheck: checkpoint,
      instantFeedbackWin: `Correct. ${subtopic} is now stronger and ready for the next step.`,
      instantFeedbackRetry: retryHint,
      reviewPrompt: microPractice,
      xpReward: XP_REWARDS[index] || 10,
      badgeFocus: badgeFocus(subtopic),
    };
  });

  return {
    version: "2026-03-duolingo-vedic-v1",
    onboarding: {
      askLearnerName: true,
      knownLanguageOptions: KNOWN_LANGUAGE_OPTIONS,
      learnerLevelOptions: LEARNER_LEVEL_OPTIONS,
      goalOptions: GOAL_OPTIONS,
      coachIntro: `Raj checks language comfort, current confidence, and session goal before starting ${topic}.`,
      placementRule: `Recommended start level for Lesson ${lessonNum}: ${recommendedLevel(lessonNum)}. If the learner struggles twice in one step, keep the pace slow and repeat the pattern with a smaller number.`,
    },
    mission: {
      missionTitle: topic,
      missionPromise: goals[0] || `Learn ${topic} through short guided tries and instant feedback.`,
      successCelebration: `Celebrate each correct step in ${topic} with points, a badge pulse, and a quick coach line before moving on.`,
    },
    microLessonPattern: [
      "Coach opens with one short hook and names the pattern.",
      "Coach models one worked move on the board.",
      "Coach reads the exercise question aloud.",
      "Niagh tries before the full answer is shown.",
      "Instant feedback either celebrates or repairs the first mistake.",
      "A quick review prompt decides whether the learner advances or repeats.",
    ],
    rewardLoop: {
      xpUnit: "Award 10 to 20 XP per exercise group based on the step position in the lesson path.",
      streakRule: "Keep the streak visible on every step and protect it with immediate retries instead of long explanations.",
      badgeRule: "Each exercise group has one badge focus tied to the subtopic being learned.",
      celebrationStyle: "Short praise, points pulse, and progress-bar movement after every correct response.",
    },
    reviewLoop: {
      trigger: "If the learner answers incorrectly, hesitates, or shows low confidence, reopen the same pattern with one smaller follow-up.",
      practiceStyle: "Use the micro-practice line as the first repair loop before advancing.",
      masteryRule: "Advance only after the learner can answer the checkpoint and complete one try in the same subtopic.",
      revisitRule: "Weak steps should return in the next session as review cards before new content.",
    },
    uiDirectives: {
      layout: "single-screen mission layout",
      primaryFocus: "current question card",
      secondaryPanels: ["worked board", "help drawer", "lesson path rail"],
      noScrollGoal: "The learner should see mission progress, the current question, and the main action buttons without long vertical scrolling.",
    },
    sessionFlow,
  };
}

function reorderChapter(chapter) {
  const ordered = {};
  const keyOrder = [
    "title",
    "source",
    "estimatedMinutes",
    "subtopics",
    "learningGoals",
    "coreIdeas",
    "workedExamples",
    "starterPractice",
    "duolingoLessonArc",
    "teachingScript",
    "screenplay",
    "teachingFlowStages",
    "questionPool",
    "assetItems",
  ];

  for (const key of keyOrder) {
    if (Object.prototype.hasOwnProperty.call(chapter, key)) {
      ordered[key] = chapter[key];
    }
  }
  for (const key of Object.keys(chapter)) {
    if (!Object.prototype.hasOwnProperty.call(ordered, key)) {
      ordered[key] = chapter[key];
    }
  }
  return ordered;
}

function buildArchitectureSection(chapter) {
  const arc = chapter.duolingoLessonArc;
  if (!arc || !Array.isArray(arc.sessionFlow)) {
    return "";
  }

  const lines = [
    "## Duolingo Lesson Architecture",
    "",
    "- Entry onboarding: ask name, comfortable language, current Vedic Math level, and session goal before starting the mission.",
    `- Mission promise: ${safeText(arc.mission?.missionPromise)}`,
    "- Core loop: coach hook -> board model -> read aloud -> Niagh tries -> instant feedback -> quick review or reward.",
    `- Reward loop: ${safeText(arc.rewardLoop?.xpUnit)} ${safeText(arc.rewardLoop?.streakRule)}`,
    `- Review rule: ${safeText(arc.reviewLoop?.masteryRule)} ${safeText(arc.reviewLoop?.revisitRule)}`,
    "",
    "### Session Loop A-I",
    "",
  ];

  for (const item of arc.sessionFlow) {
    lines.push(`- ${item.exerciseGroup}. ${item.subtopic}:`);
    lines.push(`  Coach opens with: ${safeText(item.coachHook)}`);
    lines.push(`  Board model: ${safeText(item.boardDemo)}`);
    lines.push(`  Read aloud: ${safeText(item.readAloudPrompt)}`);
    lines.push(`  Student try: ${safeText(item.tryPrompt)}`);
    lines.push(`  Reward and review: ${safeText(item.instantFeedbackWin)} ${safeText(item.reviewPrompt)}`);
  }

  lines.push("");
  return lines.join("\n");
}

function syncLessonPlan(chapterFile, chapter) {
  const mdName = chapterFile.replace(/\.json$/, ".md");
  const mdPath = path.join(LESSON_PLAN_DIR, mdName);
  if (!fs.existsSync(mdPath)) {
    return;
  }

  const content = fs.readFileSync(mdPath, "utf8");
  const section = buildArchitectureSection(chapter);
  if (!section) {
    return;
  }

  let updated;
  if (/## Duolingo Lesson Architecture\b/.test(content)) {
    updated = content.replace(
      /## Duolingo Lesson Architecture[\s\S]*?(?=\n## Worked Examples\b)/,
      `${section}\n`
    );
  } else {
    updated = content.replace(/\n## Worked Examples\b/, `\n${section}\n## Worked Examples`);
  }
  fs.writeFileSync(mdPath, updated, "utf8");
}

function main() {
  const chapterFiles = listChapterFiles(CHAPTER_DIRS[0]);
  const primaryByFile = new Map();

  for (const chapterFile of chapterFiles) {
    const primaryPath = path.join(CHAPTER_DIRS[0], chapterFile);
    const chapter = readJson(primaryPath);
    chapter.duolingoLessonArc = buildDuolingoArc(chapterFile, chapter);
    const ordered = reorderChapter(chapter);
    writeJson(primaryPath, ordered);
    primaryByFile.set(chapterFile, ordered);
    syncLessonPlan(chapterFile, ordered);
  }

  for (const dir of CHAPTER_DIRS.slice(1)) {
    for (const chapterFile of chapterFiles) {
      const targetPath = path.join(dir, chapterFile);
      if (!fs.existsSync(targetPath)) continue;
      writeJson(targetPath, primaryByFile.get(chapterFile));
    }
  }

  process.stdout.write(`Updated ${chapterFiles.length} chapters with duolingoLessonArc and synced lesson plans.\n`);
}

main();
