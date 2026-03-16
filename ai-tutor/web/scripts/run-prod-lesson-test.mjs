import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function usage() {
  console.error("Usage: node scripts/run-prod-lesson-test.mjs <CHAPTER_CODE>");
  process.exit(1);
}

const chapterCode = String(process.argv[2] || "").trim().toUpperCase();
if (!chapterCode) {
  usage();
}

const chapterPath = path.resolve(process.cwd(), "..", "tutor-api", "content-template", "vedic_math", "chapter", `${chapterCode}.json`);
if (!fs.existsSync(chapterPath)) {
  console.error(`Chapter JSON not found: ${chapterPath}`);
  process.exit(1);
}

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(
  npxCommand,
  ["playwright", "test", "tests/prod/generic-lesson-scenarios.spec.ts", "-c", "playwright.prod.config.ts", "--reporter=line"],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      TUTOR_CHAPTER_CODE: chapterCode,
    },
    stdio: "inherit",
  },
);

if (typeof result.status === "number") {
  process.exit(result.status);
}
process.exit(1);
