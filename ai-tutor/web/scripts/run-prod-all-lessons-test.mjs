/**
 * run-prod-all-lessons-test.mjs
 *
 * Auto-discovers EVERY chapter across ALL courses (MindSutra, MindSpark, etc.)
 * by walking the content-template directory and reading chapters.json files.
 *
 * Usage:
 *   node scripts/run-prod-all-lessons-test.mjs                        # all courses, all chapters
 *   node scripts/run-prod-all-lessons-test.mjs --course mindsutra     # only vedic_math_g*
 *   node scripts/run-prod-all-lessons-test.mjs --course mindspark     # only aptitude_reasoning_g*
 *   node scripts/run-prod-all-lessons-test.mjs --course vedic_math    # includes legacy L1-L16
 *   node scripts/run-prod-all-lessons-test.mjs --grade 4              # only grade 4 chapters
 *   node scripts/run-prod-all-lessons-test.mjs --from VM_G4_L3_DOUBLING_HALVING  # resume from chapter
 *   node scripts/run-prod-all-lessons-test.mjs --chapter VM_G4_L1_FAST_ADDITION  # single chapter
 *   node scripts/run-prod-all-lessons-test.mjs --smoke                # P0 only (fast, 3 tests/chapter)
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? String(args[idx + 1] || "").trim() : "";
};
const hasFlag = (flag) => args.includes(flag);

const filterCourse = getArg("--course").toLowerCase();    // e.g. "mindsutra", "mindspark", "vedic_math"
const filterGrade  = getArg("--grade");                   // e.g. "4"
const filterFrom   = getArg("--from").toUpperCase();      // resume from chapter code
const filterSingle = getArg("--chapter").toUpperCase();   // single chapter only
const smokeOnly    = hasFlag("--smoke");                   // only run 3 P0 tests per chapter

// ── Course → module/keyword mapping ──────────────────────────────────────────
const COURSE_ALIAS = {
  mindsutra:          "vedic_math",
  mindspark:          "aptitude_reasoning",
  "aptitude-reasoning": "aptitude_reasoning",
  "financial-literacy": "financial_literacy",
};
const resolvedCourseFilter = COURSE_ALIAS[filterCourse] || filterCourse;

// ── Discover chapters from filesystem ────────────────────────────────────────
const contentRoot = path.resolve(process.cwd(), "..", "tutor-api", "content-template");

function moduleForCourseId(courseId) {
  if (courseId.startsWith("vedic_math"))          return "VEDIC_MATH";
  if (courseId.startsWith("aptitude_reasoning"))  return "APTITUDE_REASONING";
  if (courseId.startsWith("financial_literacy"))  return "FINANCIAL_LITERACY";
  return "VEDIC_MATH";
}

function gradeFromCourseId(courseId) {
  const m = courseId.match(/_g(\d+)$/);
  return m ? m[1] : "6";
}

function loadChaptersFromFile(chaptersJsonPath, overrideCourseRoot) {
  try {
    const raw = JSON.parse(fs.readFileSync(chaptersJsonPath, "utf8"));
    const courseId  = String(raw.courseId || raw.course_id || overrideCourseRoot || "vedic_math");
    const gradeLevel = raw.gradeLevel || raw.grade_level;
    const grade     = gradeLevel ? String(gradeLevel) : gradeFromCourseId(courseId);
    const chapters  = Array.isArray(raw.chapters) ? raw.chapters : [];
    return chapters
      .filter((ch) => ch && ch.chapterCode)
      .map((ch) => ({
        chapterCode: String(ch.chapterCode).toUpperCase(),
        title:       String(ch.title || ch.chapterCode),
        courseId,
        grade,
        module:      moduleForCourseId(courseId),
      }));
  } catch {
    return [];
  }
}

// Walk content-template looking for chapters.json files and chapter/*.json files
const discovered = [];

if (!fs.existsSync(contentRoot)) {
  console.error(`Content template root not found: ${contentRoot}`);
  process.exit(1);
}

for (const courseDirName of fs.readdirSync(contentRoot)) {
  const coursePath = path.join(contentRoot, courseDirName);
  if (!fs.statSync(coursePath).isDirectory()) continue;

  // Apply course filter early
  if (resolvedCourseFilter && !courseDirName.startsWith(resolvedCourseFilter)) continue;

  // Look for grade_X/chapters.json
  for (const gradeDir of fs.readdirSync(coursePath)) {
    const gradePath = path.join(coursePath, gradeDir);
    if (!fs.statSync(gradePath).isDirectory()) continue;

    const chaptersJsonPath = path.join(gradePath, "chapters.json");
    if (fs.existsSync(chaptersJsonPath)) {
      const entries = loadChaptersFromFile(chaptersJsonPath, courseDirName);
      // Apply grade filter
      if (filterGrade) {
        discovered.push(...entries.filter((e) => e.grade === filterGrade));
      } else {
        discovered.push(...entries);
      }
    }
  }

  // Legacy: top-level chapters.json (e.g. financial_literacy/chapters.json)
  const topChaptersJson = path.join(coursePath, "chapters.json");
  if (fs.existsSync(topChaptersJson)) {
    const entries = loadChaptersFromFile(topChaptersJson, courseDirName);
    if (filterGrade) {
      discovered.push(...entries.filter((e) => e.grade === filterGrade));
    } else {
      discovered.push(...entries);
    }
  }

  // Legacy: top-level chapter/*.json (old vedic_math L1-L16, no chapters.json)
  const legacyChapterDir = path.join(coursePath, "chapter");
  if (fs.existsSync(legacyChapterDir) && !filterGrade) {
    for (const file of fs.readdirSync(legacyChapterDir)) {
      if (!file.endsWith(".json")) continue;
      const chapterCode = path.basename(file, ".json").toUpperCase();
      // Skip if a grade-based chapters.json already covers this code
      if (discovered.some((e) => e.chapterCode === chapterCode)) continue;
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(legacyChapterDir, file), "utf8"));
        discovered.push({
          chapterCode,
          title:   String(raw.title || chapterCode),
          courseId: courseDirName,
          grade:   "6",
          module:  moduleForCourseId(courseDirName),
        });
      } catch { /* skip malformed */ }
    }
  }
}

// Remove duplicates (keep first occurrence)
const seen = new Set();
const allEntries = discovered.filter((e) => {
  const key = `${e.courseId}::${e.chapterCode}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

// Apply --from and --chapter filters
let entriesToRun = allEntries;
if (filterSingle) {
  entriesToRun = allEntries.filter((e) => e.chapterCode === filterSingle);
  if (!entriesToRun.length) {
    console.error(`Chapter not found: ${filterSingle}`);
    console.error(`Known codes: ${allEntries.map((e) => e.chapterCode).join(", ")}`);
    process.exit(1);
  }
} else if (filterFrom) {
  const idx = allEntries.findIndex((e) => e.chapterCode === filterFrom);
  if (idx === -1) {
    console.error(`--from chapter not found: ${filterFrom}`);
    process.exit(1);
  }
  entriesToRun = allEntries.slice(idx);
}

if (!entriesToRun.length) {
  console.error("No chapters found. Check --course / --grade filters.");
  process.exit(1);
}

// ── Run ───────────────────────────────────────────────────────────────────────
const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

// Smoke mode: run only [Good]-tagged tests via Playwright --grep.
// Avoid | in the pattern — Windows CMD treats | as a pipe even inside quoted args.
// \[Good\] matches the literal text "[Good]" in test names (7-8 tests, no [Bad]/[Support]).
const grepArgs = smokeOnly
  ? ["--grep", "\\[Good\\]"]
  : [];

console.log(`\n${"=".repeat(68)}`);
console.log(`RoboDynamics AI Tutor — Prod test suite`);
console.log(`  Chapters : ${entriesToRun.length}`);
console.log(`  Mode     : ${smokeOnly ? "SMOKE (P0 only)" : "FULL"}`);
if (resolvedCourseFilter) console.log(`  Course   : ${resolvedCourseFilter}`);
if (filterGrade)          console.log(`  Grade    : ${filterGrade}`);
console.log(`${"=".repeat(68)}\n`);

// Group by course for cleaner output
const byCourse = {};
for (const e of entriesToRun) {
  (byCourse[e.courseId] ??= []).push(e);
}
for (const [courseId, entries] of Object.entries(byCourse)) {
  console.log(`  📚 ${courseId}: ${entries.length} chapter(s)`);
}
console.log();

const results = [];

for (const entry of entriesToRun) {
  console.log(`\n${"─".repeat(68)}`);
  console.log(`▶  ${entry.chapterCode}  [${entry.courseId} · Grade ${entry.grade}]`);
  console.log(`   ${entry.title}`);
  console.log(`${"─".repeat(68)}`);

  const result = spawnSync(
    npxCmd,
    [
      "playwright", "test",
      "tests/prod/generic-lesson-scenarios.spec.ts",
      "-c", "playwright.prod.config.ts",
      "--reporter=line",
      ...grepArgs,
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        TUTOR_CHAPTER_CODE: entry.chapterCode,
        TUTOR_COURSE_ID:    entry.courseId,
        TUTOR_MODULE:       entry.module,
        TUTOR_GRADE:        entry.grade,
      },
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  const exitCode = result.status ?? 1;
  const status   = exitCode === 0 ? "PASSED" : "FAILED";
  results.push({ ...entry, status, exitCode });
  console.log(`\n${status === "PASSED" ? "✅" : "❌"}  ${entry.chapterCode}: ${status}`);
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${"=".repeat(68)}`);
console.log("RESULTS SUMMARY");
console.log(`${"=".repeat(68)}`);

// Group summary by course
const grouped = {};
for (const r of results) {
  (grouped[r.courseId] ??= []).push(r);
}
for (const [courseId, courseResults] of Object.entries(grouped)) {
  const passed  = courseResults.filter((r) => r.status === "PASSED").length;
  const total   = courseResults.length;
  console.log(`\n  ${courseId}  (${passed}/${total})`);
  for (const r of courseResults) {
    const icon = r.status === "PASSED" ? "✅" : "❌";
    console.log(`    ${icon}  ${r.chapterCode}  Grade ${r.grade}`);
  }
}

const totalPassed  = results.filter((r) => r.status === "PASSED").length;
const totalFailed  = results.filter((r) => r.status === "FAILED").length;

console.log(`\n${"─".repeat(68)}`);
console.log(`Total: ${totalPassed} passed, ${totalFailed} failed of ${results.length}`);

if (totalFailed) {
  console.log("\nFailed:");
  for (const r of results.filter((r) => r.status === "FAILED")) {
    console.log(`  ❌  ${r.chapterCode}  [${r.courseId}]`);
  }
}

console.log(`${"=".repeat(68)}\n`);
process.exit(totalFailed > 0 ? 1 : 0);
