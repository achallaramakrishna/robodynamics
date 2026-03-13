const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const PY_SOURCE = path.join(__dirname, "generate_question_pools.py");
const CHAPTER_DIR = path.join(ROOT, "tutor-api", "content-template", "vedic_math", "chapter");

function q(questionId, exerciseGroup, subtopic, skill, difficulty, questionText, hint, solution, expectedAnswer) {
  return {
    questionId,
    chapterCode: "_CODE_",
    exerciseGroup,
    subtopic,
    skill,
    difficulty,
    type: "short_answer",
    questionText,
    hint,
    solution,
    expectedAnswer,
  };
}

function TFS(intentIntro, intentExplain, intentDemo, intentGuided, intentPractice) {
  return [
    { phase: "INTRO", intent: intentIntro },
    { phase: "EXPLAIN", intent: intentExplain },
    { phase: "DEMO", intent: intentDemo },
    { phase: "GUIDED", intent: intentGuided },
    { phase: "PRACTICE", intent: intentPractice },
    {
      phase: "CHECK",
      intent: "Tutor gives step-by-step correction logic and shows where the student's reasoning went wrong.",
    },
    {
      phase: "CHECKPOINT",
      intent: "Explicit learner-response gate: student confirms understanding before tutor advances to the next subtopic.",
    },
  ];
}

function extractChapterAssignments(pySource) {
  const start = pySource.indexOf('CHAPTERS["L3_MULTIPLY_BY_11"]');
  const end = pySource.indexOf("# Apply to files");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not locate CHAPTERS block in generate_question_pools.py");
  }

  return pySource
    .slice(start, end)
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n");
}

function loadGeneratedChapterData() {
  const pySource = fs.readFileSync(PY_SOURCE, "utf8");
  const assignments = extractChapterAssignments(pySource);
  const sandbox = { CHAPTERS: {}, q, TFS };
  vm.runInNewContext(assignments, sandbox, { filename: "generate_question_pools.py" });
  return sandbox.CHAPTERS;
}

function countByDifficulty(questionPool) {
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const item of questionPool || []) {
    const key = item?.difficulty;
    if (Object.prototype.hasOwnProperty.call(counts, key)) {
      counts[key] += 1;
    }
  }
  return counts;
}

function ensureWorkedExamples(chapter, questionPool) {
  const existing = Array.isArray(chapter.workedExamples) ? [...chapter.workedExamples] : [];
  if (existing.length >= 4) {
    return existing;
  }

  const seen = new Set(existing.map((item) => `${item.question}|${item.answer}`));
  for (const question of questionPool) {
    const key = `${question.questionText}|${question.expectedAnswer}`;
    if (seen.has(key)) {
      continue;
    }

    existing.push({
      question: question.questionText,
      method: question.solution,
      answer: question.expectedAnswer,
    });
    seen.add(key);

    if (existing.length >= 4) {
      break;
    }
  }

  return existing;
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
  ];

  for (const key of keyOrder) {
    if (Object.prototype.hasOwnProperty.call(chapter, key)) {
      ordered[key] = chapter[key];
    }
  }

  for (const [key, value] of Object.entries(chapter)) {
    if (!Object.prototype.hasOwnProperty.call(ordered, key)) {
      ordered[key] = value;
    }
  }

  return ordered;
}

function main() {
  const generated = loadGeneratedChapterData();
  const files = fs
    .readdirSync(CHAPTER_DIR)
    .filter((name) => /^L\d+.*\.json$/.test(name) && !name.includes("Copy") && !name.endsWith(".bak"))
    .sort();

  let updated = 0;

  for (const fileName of files) {
    const code = fileName.replace(/\.json$/i, "");
    const chapterData = generated[code];
    if (!chapterData) {
      continue;
    }

    const filePath = path.join(CHAPTER_DIR, fileName);
    const chapter = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const existingPool = Array.isArray(chapter.questionPool) ? chapter.questionPool : [];
    const existingFlow = Array.isArray(chapter.teachingFlowStages) ? chapter.teachingFlowStages : [];
    const existingWorked = Array.isArray(chapter.workedExamples) ? chapter.workedExamples : [];

    const hasEnoughPool = existingPool.length >= 24;
    const hasEnoughFlow = existingFlow.length >= 7;
    const hasEnoughWorked = existingWorked.length >= 4;

    if (hasEnoughPool && hasEnoughFlow && hasEnoughWorked) {
      continue;
    }

    const fullPool = chapterData.questions.map((item) => ({ ...item, chapterCode: code }));
    chapter.teachingFlowStages = chapterData.tfs;
    chapter.questionPool = fullPool;
    chapter.workedExamples = ensureWorkedExamples(chapter, fullPool);

    const ordered = reorderChapter(chapter);
    fs.writeFileSync(filePath, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");

    const diff = countByDifficulty(fullPool);
    process.stdout.write(
      `UPDATED ${code.padEnd(32)} qp=${fullPool.length} tfs=${ordered.teachingFlowStages.length} we=${ordered.workedExamples.length} diff=${diff.easy}/${diff.medium}/${diff.hard}\n`
    );
    updated += 1;
  }

  process.stdout.write(`\nUpdated ${updated} chapters.\n`);
}

main();
