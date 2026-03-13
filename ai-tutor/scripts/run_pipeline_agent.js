const {
  bootstrapPipelineEnv,
  createRunId,
  ensureRunDir,
  listCourseChapters,
  loadCourseConfig,
  must,
  parseArgs
} = require("./pipeline_common");
const {
  AGENT_RUNNERS,
  makeAgentContext,
  runPedagogicalArchitect
} = require("./pipeline_agents");

bootstrapPipelineEnv();

function main() {
  const args = parseArgs(process.argv);
  const courseId = must(args, "course-id");
  const agentId = must(args, "agent");
  const runner = AGENT_RUNNERS[agentId];
  if (!runner) {
    throw new Error(`Unknown agent: ${agentId}`);
  }

  const courseConfig = loadCourseConfig(courseId);
  const runId = args["run-id"] || createRunId();
  const runDir = ensureRunDir(courseConfig, courseId, runId);
  const context = makeAgentContext({
    courseId,
    runDir,
    approvedBy: args["approved-by"] || null
  });

  if (agentId === "pedagogical_architect") {
    const result = runPedagogicalArchitect({
      ...context,
      chapterCodes: args.chapters
        ? args.chapters.split(",").map((item) => item.trim()).filter(Boolean)
        : listCourseChapters(courseConfig)
    });
    process.stdout.write(`${JSON.stringify({ runId, ...result }, null, 2)}\n`);
    return;
  }

  runPedagogicalArchitect({
    ...context,
    chapterCodes: listCourseChapters(courseConfig)
  });

  const chapterCode = must(args, "chapter-code");
  const result = runner({
    ...context,
    chapterCode
  });
  process.stdout.write(`${JSON.stringify({ runId, ...result }, null, 2)}\n`);
}

main();
