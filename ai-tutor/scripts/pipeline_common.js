const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const AI_TUTOR_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(AI_TUTOR_ROOT, "..");
const PIPELINE_ROOT = path.join(AI_TUTOR_ROOT, "pipeline");

const DEFAULT_STAGE_ORDER = [
  "pedagogical_architect",
  "content_generator",
  "deterministic_validator",
  "pedagogy_reviewer",
  "ui_ux_reviewer",
  "student_simulator",
  "publish_orchestrator"
];

function parseKeyValueFile(filePath, separatorPattern) {
  const out = {};
  if (!fileExists(filePath)) {
    return out;
  }
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const match = line.match(separatorPattern);
    if (!match) {
      continue;
    }
    const key = String(match[1] || "").trim();
    const value = String(match[2] || "").trim();
    if (key) {
      out[key] = value;
    }
  }
  return out;
}

function firstNonEmpty(values) {
  for (const value of values) {
    if (String(value || "").trim()) {
      return String(value).trim();
    }
  }
  return "";
}

function bootstrapPipelineEnv() {
  const dotEnv = parseKeyValueFile(path.join(REPO_ROOT, "ai-tutor", "tutor-api", ".env"), /^([^=]+)=(.*)$/);
  const propertyCandidates = [
    path.join(REPO_ROOT, "src", "main", "resources", "app-config.properties"),
    path.join(REPO_ROOT, "src", "main", "webapp", "WEB-INF", "classes", "app-config.properties"),
    path.join(REPO_ROOT, ".tomcat-base", "webapps", "robodynamics", "WEB-INF", "classes", "app-config.properties")
  ];
  const properties = {};
  for (const filePath of propertyCandidates) {
    Object.assign(properties, parseKeyValueFile(filePath, /^([^=]+)=(.*)$/));
  }

  const assignments = {
    OPENAI_API_KEY: firstNonEmpty([
      process.env.OPENAI_API_KEY,
      dotEnv.OPENAI_API_KEY,
      properties["openai.api.key"]
    ]),
    ANTHROPIC_API_KEY: firstNonEmpty([
      process.env.ANTHROPIC_API_KEY,
      dotEnv.ANTHROPIC_API_KEY,
      properties["anthropic.api.key"]
    ]),
    AI_TUTOR_REVIEW_OPENAI_MODEL: firstNonEmpty([
      process.env.AI_TUTOR_REVIEW_OPENAI_MODEL,
      dotEnv.AI_TUTOR_REVIEW_OPENAI_MODEL,
      dotEnv.OPENAI_MODEL,
      properties["openai.chat.model"]
    ]),
    AI_TUTOR_REVIEW_ANTHROPIC_MODEL: firstNonEmpty([
      process.env.AI_TUTOR_REVIEW_ANTHROPIC_MODEL,
      dotEnv.AI_TUTOR_REVIEW_ANTHROPIC_MODEL,
      dotEnv.AI_TUTOR_CHAT_MODEL,
      properties["anthropic.chat.model"]
    ])
  };

  for (const [key, value] of Object.entries(assignments)) {
    if (value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function must(args, key) {
  if (!args[key]) {
    throw new Error(`Missing required arg --${key}`);
  }
  return args[key];
}

function flagEnabled(value) {
  return new Set(["1", "true", "yes", "on"]).has(String(value || "").trim().toLowerCase());
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function toRepoRelative(filePath) {
  return path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
}

function sortChapterCodes(codes) {
  return [...codes].sort((left, right) => {
    const leftNum = Number((String(left).match(/^L(\d+)/i) || [])[1] || 0);
    const rightNum = Number((String(right).match(/^L(\d+)/i) || [])[1] || 0);
    if (leftNum !== rightNum) {
      return leftNum - rightNum;
    }
    return String(left).localeCompare(String(right));
  });
}

function listChapterFiles(chapterDir) {
  return sortChapterCodes(
    fs
      .readdirSync(chapterDir)
      .filter((name) => /^L\d+.*\.json$/i.test(name) && !name.includes("Copy") && !name.endsWith(".bak"))
  );
}

function loadCourseConfig(courseId) {
  const filePath = path.join(PIPELINE_ROOT, "course-configs", `${courseId}.json`);
  if (!fileExists(filePath)) {
    throw new Error(`Missing course config: ${filePath}`);
  }
  return readJson(filePath);
}

function loadStandardFromConfig(courseConfig) {
  return readJson(repoPath(courseConfig.standardPath));
}

function chapterDirFromConfig(courseConfig) {
  return repoPath(courseConfig.chapterDir);
}

function sourcePdfDirFromConfig(courseConfig) {
  return repoPath(courseConfig.sourcePdfDir);
}

function listCourseChapters(courseConfig) {
  const chapterDir = chapterDirFromConfig(courseConfig);
  return listChapterFiles(chapterDir).map((fileName) => fileName.replace(/\.json$/i, ""));
}

function loadChapter(courseConfig, chapterCode) {
  const chapterPath = path.join(chapterDirFromConfig(courseConfig), `${chapterCode}.json`);
  if (!fileExists(chapterPath)) {
    throw new Error(`Missing chapter JSON: ${chapterPath}`);
  }
  return readJson(chapterPath);
}

function resolveSourcePdf(courseConfig, chapterCode, sourceField) {
  const pdfDir = sourcePdfDirFromConfig(courseConfig);
  const sourceName = String(sourceField || "")
    .split("|")
    .pop()
    .trim();
  if (sourceName) {
    const directPath = path.join(pdfDir, sourceName);
    if (fileExists(directPath)) {
      return directPath;
    }
  }

  const lessonNum = Number((String(chapterCode).match(/^L(\d+)/i) || [])[1] || 0);
  const fallback = fs
    .readdirSync(pdfDir)
    .find((name) => name.toLowerCase().startsWith(`chap_${lessonNum}_`) && name.toLowerCase().endsWith(".pdf"));
  return fallback ? path.join(pdfDir, fallback) : null;
}

function createRunId() {
  return crypto.randomUUID();
}

function runDirFromConfig(courseConfig, courseId, runId) {
  return repoPath(path.join(courseConfig.artifactRoot, courseId, runId));
}

function ensureRunDir(courseConfig, courseId, runId) {
  const runDir = runDirFromConfig(courseConfig, courseId, runId);
  fs.mkdirSync(runDir, { recursive: true });
  return runDir;
}

function courseArtifactPath(runDir, fileName) {
  return path.join(runDir, fileName);
}

function chapterArtifactDir(runDir, chapterCode) {
  const dir = path.join(runDir, chapterCode);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function selectChapters(courseConfig, args) {
  const available = listCourseChapters(courseConfig);
  const requested = args.chapters
    ? args.chapters.split(",").map((item) => item.trim()).filter(Boolean)
    : args["chapter-code"]
      ? [args["chapter-code"].trim()]
      : [];
  if (!requested.length) {
    return available;
  }
  const invalid = requested.filter((code) => !available.includes(code));
  if (invalid.length) {
    throw new Error(`Unknown chapter codes: ${invalid.join(", ")}`);
  }
  return sortChapterCodes(requested);
}

function selectStages(args) {
  const requested = args.stages
    ? args.stages.split(",").map((item) => item.trim()).filter(Boolean)
    : DEFAULT_STAGE_ORDER;
  const invalid = requested.filter((stage) => !DEFAULT_STAGE_ORDER.includes(stage));
  if (invalid.length) {
    throw new Error(`Unknown stages: ${invalid.join(", ")}`);
  }
  return requested;
}

function nowIso() {
  return new Date().toISOString();
}

function makeArtifactRef(filePath) {
  return {
    path: toRepoRelative(filePath),
    exists: fileExists(filePath)
  };
}

function mean(values) {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (!filtered.length) {
    return 0;
  }
  return filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
}

function countWords(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function resolvePythonExecutable() {
  const candidates = [];
  if (process.env.AI_TUTOR_PYTHON) {
    candidates.push(process.env.AI_TUTOR_PYTHON);
  }
  if (process.env.LOCALAPPDATA) {
    candidates.push(path.join(process.env.LOCALAPPDATA, "Programs", "Python", "Python313", "python.exe"));
    candidates.push(path.join(process.env.LOCALAPPDATA, "Programs", "Python", "Python312", "python.exe"));
    candidates.push(path.join(process.env.LOCALAPPDATA, "Programs", "Python", "Python311", "python.exe"));
  }
  candidates.push("python");

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate === "python") {
      return candidate;
    }
    if (fileExists(candidate)) {
      return candidate;
    }
  }
  return "python";
}

module.exports = {
  AI_TUTOR_ROOT,
  REPO_ROOT,
  PIPELINE_ROOT,
  DEFAULT_STAGE_ORDER,
  chapterArtifactDir,
  chapterDirFromConfig,
  clamp,
  countWords,
  courseArtifactPath,
  createRunId,
  ensureRunDir,
  fileExists,
  flagEnabled,
  listCourseChapters,
  loadChapter,
  loadCourseConfig,
  loadStandardFromConfig,
  makeArtifactRef,
  mean,
  must,
  nowIso,
  parseArgs,
  bootstrapPipelineEnv,
  readJson,
  repoPath,
  resolvePythonExecutable,
  resolveSourcePdf,
  runDirFromConfig,
  selectChapters,
  selectStages,
  sortChapterCodes,
  sourcePdfDirFromConfig,
  toRepoRelative,
  writeJson
};
