/**
 * run-prod-all-lessons-test.mjs
 * Runs the generic Playwright test suite against every Vedic Math lesson (L1–L16).
 * Usage:
 *   node scripts/run-prod-all-lessons-test.mjs
 *   node scripts/run-prod-all-lessons-test.mjs L3_MULTIPLY_BY_11   # resume from a chapter
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ALL_CHAPTERS = [
  "L1_COMPLETING_WHOLE",
  "L2_DOUBLING_HALVING",
  "L3_MULTIPLY_BY_11",
  "L4_VERTICAL_CROSSWISE",
  "L5_ALL_FROM_9_LAST_FROM_10",
  "L6_NIKHILAM_BASE_10_100",
  "L7_SQUARES_ENDING_5",
  "L8_YAVADUNAM",
  "L9_GENERAL_MULTIPLICATION",
  "L10_DIVISION_BY_9",
  "L11_VINCULUM_INTRO",
  "L12_FRACTIONS_DECIMALS",
  "L13_ALGEBRAIC_IDENTITIES",
  "L14_FACTORISATION",
  "L15_SQUARES_NEAR_BASE",
  "L16_CUBES_INTRO",
];

const resumeFrom = String(process.argv[2] || "").trim().toUpperCase();
const chaptersToRun = resumeFrom
  ? ALL_CHAPTERS.slice(ALL_CHAPTERS.indexOf(resumeFrom))
  : ALL_CHAPTERS;

if (resumeFrom && !ALL_CHAPTERS.includes(resumeFrom)) {
  console.error(`Unknown chapter code: ${resumeFrom}`);
  console.error(`Valid codes: ${ALL_CHAPTERS.join(", ")}`);
  process.exit(1);
}

const chapterRoot = path.resolve(
  process.cwd(),
  "..",
  "tutor-api",
  "content-template",
  "vedic_math",
  "chapter",
);
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

const results = [];

console.log(`\n${"=".repeat(60)}`);
console.log(`AI Tutor — Prod test suite: ${chaptersToRun.length} lesson(s)`);
console.log(`${"=".repeat(60)}\n`);

for (const chapterCode of chaptersToRun) {
  const chapterPath = path.join(chapterRoot, `${chapterCode}.json`);
  if (!fs.existsSync(chapterPath)) {
    console.warn(`⚠  Chapter JSON not found — skipping: ${chapterPath}`);
    results.push({ chapterCode, status: "SKIPPED", exitCode: null });
    continue;
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`▶  ${chapterCode}`);
  console.log(`${"─".repeat(60)}`);

  const result = spawnSync(
    npxCommand,
    [
      "playwright",
      "test",
      "tests/prod/generic-lesson-scenarios.spec.ts",
      "-c",
      "playwright.prod.config.ts",
      "--reporter=line",
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        TUTOR_CHAPTER_CODE: chapterCode,
      },
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  const exitCode = result.status ?? 1;
  const status = exitCode === 0 ? "PASSED" : "FAILED";
  results.push({ chapterCode, status, exitCode });

  console.log(`\n${status === "PASSED" ? "✅" : "❌"}  ${chapterCode}: ${status}`);
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${"=".repeat(60)}`);
console.log("RESULTS SUMMARY");
console.log(`${"=".repeat(60)}`);

const passed = results.filter((r) => r.status === "PASSED");
const failed = results.filter((r) => r.status === "FAILED");
const skipped = results.filter((r) => r.status === "SKIPPED");

for (const r of results) {
  const icon = r.status === "PASSED" ? "✅" : r.status === "FAILED" ? "❌" : "⚠ ";
  console.log(`  ${icon}  ${r.chapterCode}`);
}

console.log(`\nPassed: ${passed.length}/${results.length}`);
if (skipped.length) console.log(`Skipped: ${skipped.length}`);
if (failed.length) {
  console.log(`\nFailed chapters:`);
  for (const r of failed) console.log(`  - ${r.chapterCode}`);
}

console.log(`${"=".repeat(60)}\n`);
process.exit(failed.length > 0 ? 1 : 0);
