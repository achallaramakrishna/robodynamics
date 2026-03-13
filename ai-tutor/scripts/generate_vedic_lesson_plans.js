const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");
const CHAPTER_DIR = path.join(ROOT, "tutor-api", "content-template", "vedic_math", "chapter");
const PDF_DIR = path.join(REPO_ROOT, "docs", "vedic_math");
const OUTPUT_PATH = path.join(REPO_ROOT, "docs", "vedic_math", "lesson_plans.md");
const PDFTOTEXT = "C:\\poppler\\Library\\bin\\pdftotext.exe";

function listChapterFiles() {
  return fs
    .readdirSync(CHAPTER_DIR)
    .filter((name) => /^L\d+.*\.json$/.test(name) && !name.includes("Copy") && !name.endsWith(".bak"))
    .sort((a, b) => {
      const aNum = Number(a.match(/^L(\d+)/)[1]);
      const bNum = Number(b.match(/^L(\d+)/)[1]);
      return aNum - bNum;
    });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolvePdfPath(chapterFile, chapter) {
  const sourceBits = String(chapter.source || "").split("|");
  const sourceName = sourceBits[sourceBits.length - 1].trim();
  const directPath = path.join(PDF_DIR, sourceName);
  if (sourceName && fs.existsSync(directPath)) {
    return directPath;
  }

  const lessonNum = Number(chapterFile.match(/^L(\d+)/)[1]);
  const fallback = fs
    .readdirSync(PDF_DIR)
    .find((name) => name.toLowerCase().startsWith(`chap_${lessonNum}_`) && name.toLowerCase().endsWith(".pdf"));

  if (!fallback) {
    throw new Error(`Could not find PDF for ${chapterFile}`);
  }

  return path.join(PDF_DIR, fallback);
}

function pdfToText(pdfPath) {
  return execFileSync(PDFTOTEXT, ["-layout", pdfPath, "-"], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function normalizeLines(text) {
  return text
    .replace(/\f/g, "\n")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+$/g, ""))
    .filter((line, idx, arr) => !(line === "" && arr[idx - 1] === ""));
}

function parseSummary(lines) {
  const summaryIndex = lines.findIndex((line) => line.trim() === "SUMMARY");
  if (summaryIndex === -1) {
    return [];
  }

  const items = [];
  let current = null;
  for (let i = summaryIndex + 1; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      continue;
    }
    if (/^\d+\.\d+\s+[A-Z]/.test(trimmed)) {
      if (current) {
        items.push(current.trim());
      }
      current = trimmed.replace(/^\d+\.\d+\s+/, "");
      continue;
    }
    if (/^\d+\.\d+\s+[A-Z]/.test(trimmed) === false && /^\d+\.\d+\s+[A-Z]/.test(trimmed) !== true && /^\d+\.\d+\s+/.test(trimmed)) {
      continue;
    }
    if (/^\d+\.\d+\s+[A-Z]/.test(trimmed) || /^\d+\.\d+\s+/.test(trimmed)) {
      continue;
    }
    if (/^\d+\.\d+\s+/.test(trimmed) || /^\d+:/.test(trimmed) || /^Practice\s+[A-Z]/.test(trimmed)) {
      break;
    }
    if (/^[0-9]+:/.test(trimmed) || /^[A-Z]+\s+[A-Z]+/.test(trimmed)) {
      break;
    }
    if (current) {
      current += ` ${trimmed}`;
    }
  }
  if (current) {
    items.push(current.trim());
  }
  return items.filter(Boolean);
}

function parseSectionHeadings(lines) {
  const headings = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^\d+\.\d+\s+[A-Z][A-Z0-9 ,'\-–]+$/.test(trimmed)) {
      headings.push(trimmed.replace(/^\d+\.\d+\s+/, ""));
    }
  }
  return headings;
}

function isHeaderOrFooter(line) {
  const trimmed = line.trim();
  return (
    !trimmed ||
    /VEDIC MATHEMATICS MANUAL/.test(trimmed) ||
    /^LESSON\s+\d+/.test(trimmed) ||
    /^\d+:/.test(trimmed) ||
    /^[0-9]+$/.test(trimmed)
  );
}

function parseExamples(lines) {
  const examples = [];
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    const match = trimmed.match(/^(\d+)\s{2,}(.*)$/);
    if (!match) {
      continue;
    }

    const lead = match[2].trim();
    if (!lead || /VEDIC MATHEMATICS MANUAL/.test(lead)) {
      continue;
    }

    const parts = [lead];
    for (let j = i + 1; j < lines.length; j += 1) {
      const next = lines[j].trim();
      if (!next) {
        break;
      }
      if (/^\d+\s{2,}/.test(next) || /^\d+\.\d+\s+[A-Z]/.test(next) || /^Practice\s+[A-Z]/.test(next) || isHeaderOrFooter(next)) {
        break;
      }
      parts.push(next);
      if (parts.join(" ").length > 280) {
        break;
      }
    }

    const text = parts.join(" ").replace(/\s+/g, " ").trim();
    if (text.length >= 20) {
      examples.push(text);
    }
    if (examples.length >= 4) {
      break;
    }
  }
  return examples;
}

function parsePracticeBlocks(lines) {
  const blocks = [];
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (!/^Practice\s+[A-Z]/.test(trimmed)) {
      continue;
    }

    const parts = [trimmed];
    for (let j = i + 1; j < lines.length; j += 1) {
      const next = lines[j].trim();
      if (!next) {
        break;
      }
      if (/^Practice\s+[A-Z]/.test(next) || /^\d+\.\d+\s+[A-Z]/.test(next) || isHeaderOrFooter(next)) {
        break;
      }
      parts.push(next);
      if (parts.join(" ").length > 220) {
        break;
      }
    }
    blocks.push(parts.join(" ").replace(/\s+/g, " ").trim());
  }
  return blocks.slice(0, 5);
}

function buildTimingPlan(minutes, sectionCount) {
  const intro = 3;
  const guided = 5;
  const close = 2;
  const coreMinutes = Math.max(minutes - intro - guided - close, sectionCount);
  const perSection = Math.max(2, Math.floor(coreMinutes / Math.max(sectionCount, 1)));
  return { intro, guided, close, perSection };
}

function firstQuestion(questionPool) {
  return Array.isArray(questionPool) && questionPool.length ? questionPool[0].questionText : "Use one quick mental-math starter from the chapter.";
}

function lastQuestion(questionPool) {
  return Array.isArray(questionPool) && questionPool.length ? questionPool[questionPool.length - 1].questionText : "Ask learners to explain the final shortcut in their own words.";
}

function toBulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function buildLessonSection(chapterFile, chapter, pdfPath, pdfText) {
  const lines = normalizeLines(pdfText);
  const summary = parseSummary(lines);
  const headings = parseSectionHeadings(lines);
  const examples = parseExamples(lines);
  const practice = parsePracticeBlocks(lines);
  const lessonNum = Number(chapterFile.match(/^L(\d+)/)[1]);
  const timing = buildTimingPlan(chapter.estimatedMinutes || 30, summary.length || headings.length || 1);
  const sequence = (summary.length ? summary : headings).map((item, idx) => {
    const minutes = idx === 0 ? timing.perSection + 1 : timing.perSection;
    return `- ${item} (${minutes} min): teach the core move, model one short example, then ask for a spoken next step.`;
  });

  return [
    `## Lesson ${lessonNum}: ${chapter.title.replace(/^Lesson \d+:\s*/, "")}`,
    ``,
    `Source PDF: \`${path.basename(pdfPath)}\``,
    `Suggested Duration: ${chapter.estimatedMinutes || 30} minutes`,
    ``,
    `### Learning Goals`,
    toBulletList(chapter.learningGoals || []),
    ``,
    `### Lesson Sequence`,
    `- Launch (${timing.intro} min): recall yesterday's shortcut and open with \`${firstQuestion(chapter.questionPool)}\`.`,
    ...sequence,
    `- Guided practice (${timing.guided} min): use the chapter practice sets to move from teacher-led to independent responses.`,
    `- Exit ticket (${timing.close} min): close with \`${lastQuestion(chapter.questionPool)}\` or ask learners to explain the shortcut aloud.`,
    ``,
    `### Teacher Demos From The PDF`,
    toBulletList(examples.length ? examples : ["Use the first numbered worked example in the PDF as the main board demo."]),
    ``,
    `### Practice Checkpoints`,
    toBulletList(practice.length ? practice : ["Use the chapter practice sets in order: first one as guided practice, next one as independent work."]),
    ``,
    `### Board Plan`,
    toBulletList((chapter.subtopics || []).map((topic) => `Write the heading for "${topic}", model one clean example, and leave the key pattern visible for student explanation.`)),
    ``,
    `### Common Watchouts`,
    toBulletList([
      `Students may rush to a final answer without saying the intermediate mental step.`,
      `Watch for confusion between the chapter shortcut and the general written method.`,
      `Use the PDF's practice progression to slow down before moving to larger numbers or edge cases.`,
    ]),
    ``,
    `### Homework Or Extension`,
    toBulletList([
      `Repeat two guided examples from the PDF without looking at the worked solution.`,
      `Solve one extra question from each practice block and explain the method in one sentence.`,
      `Ask the learner to teach one shortcut from this lesson to a parent or peer.`,
    ]),
    ``,
  ].join("\n");
}

function main() {
  const sections = [
    "# Vedic Math Lesson Plans",
    "",
    "Generated from the chapter PDFs in `docs/vedic_math` and the current lesson metadata in `ai-tutor/tutor-api/content-template/vedic_math/chapter`.",
    "",
  ];

  for (const chapterFile of listChapterFiles()) {
    const chapterPath = path.join(CHAPTER_DIR, chapterFile);
    const chapter = readJson(chapterPath);
    const pdfPath = resolvePdfPath(chapterFile, chapter);
    const pdfText = pdfToText(pdfPath);
    sections.push(buildLessonSection(chapterFile, chapter, pdfPath, pdfText));
  }

  fs.writeFileSync(OUTPUT_PATH, `${sections.join("\n")}\n`, "utf8");
  process.stdout.write(`Wrote ${OUTPUT_PATH}\n`);
}

main();
