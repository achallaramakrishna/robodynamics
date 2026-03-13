const { execFileSync } = require("child_process");
const {
  bootstrapPipelineEnv,
  courseArtifactPath,
  createRunId,
  ensureRunDir,
  listCourseChapters,
  loadCourseConfig,
  parseArgs,
  resolvePythonExecutable,
  selectChapters,
  selectStages,
  toRepoRelative,
  writeJson
} = require("./pipeline_common");
const {
  AGENT_RUNNERS,
  buildChapterBoardEntry,
  buildCourseReadinessReport,
  makeAgentContext,
  runPedagogicalArchitect
} = require("./pipeline_agents");

bootstrapPipelineEnv();

function finalizeRunInDb(courseId, runId, readinessPath) {
  const python = resolvePythonExecutable();
  const scriptPath = courseArtifactPath(__dirname, "pipeline_finalize_run.py");
  try {
    const output = execFileSync(python, [
      scriptPath,
      "--course-id",
      courseId,
      "--run-id",
      runId,
      "--readiness-path",
      readinessPath,
      "--report-path",
      readinessPath
    ], {
      encoding: "utf8",
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8"
      },
      stdio: ["ignore", "pipe", "pipe"]
    });
    return JSON.parse(output);
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr) : "";
    const stdout = error.stdout ? String(error.stdout) : "";
    return {
      ok: false,
      skipped: true,
      reason: (stderr || stdout || error.message || "Run finalization failed").trim()
    };
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (!args["course-id"]) {
    throw new Error("Missing required arg --course-id");
  }
  const courseId = args["course-id"];
  const courseConfig = loadCourseConfig(courseId);
  const chapterCodes = selectChapters(courseConfig, args);
  const stageOrder = selectStages(args);
  const runId = args["run-id"] || createRunId();
  const runDir = ensureRunDir(courseConfig, courseId, runId);
  const context = makeAgentContext({
    courseId,
    runDir,
    approvedBy: args["approved-by"] || null
  });

  if (stageOrder.includes("pedagogical_architect")) {
    runPedagogicalArchitect({
      ...context,
      chapterCodes: listCourseChapters(courseConfig)
    });
  }

  for (const chapterCode of chapterCodes) {
    for (const stageId of stageOrder) {
      if (stageId === "pedagogical_architect") {
        continue;
      }
      AGENT_RUNNERS[stageId]({
        ...context,
        chapterCode
      });
    }
  }

  const manifest = {
    artifactType: "course_build_manifest",
    pipelineRunId: runId,
    agentId: "project_manager",
    generatedAt: new Date().toISOString(),
    courseId,
    courseTitle: courseConfig.courseTitle,
    stageOrder,
    chapterSelection: chapterCodes,
    artifactRoot: toRepoRelative(runDir)
  };

  const statusBoard = {
    artifactType: "chapter_status_board",
    courseId,
    generatedAt: manifest.generatedAt,
    chapters: chapterCodes.map((chapterCode) => buildChapterBoardEntry(context, chapterCode))
  };

  const readinessReport = buildCourseReadinessReport(context, chapterCodes);

  writeJson(courseArtifactPath(runDir, "course_build_manifest.json"), manifest);
  writeJson(courseArtifactPath(runDir, "chapter_status_board.json"), statusBoard);
  const readinessPath = courseArtifactPath(runDir, "course_readiness_report.json");
  writeJson(readinessPath, readinessReport);

  const runDbSync = finalizeRunInDb(courseId, runId, readinessPath);
  manifest.runDbSync = runDbSync;
  readinessReport.runDbSync = runDbSync;
  writeJson(courseArtifactPath(runDir, "course_build_manifest.json"), manifest);
  writeJson(readinessPath, readinessReport);

  process.stdout.write(`${toRepoRelative(runDir)}\n`);
}

main();
