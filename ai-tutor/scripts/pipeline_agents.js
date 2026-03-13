const { execFileSync } = require("child_process");
const path = require("path");

const {
  bootstrapPipelineEnv,
  chapterArtifactDir,
  clamp,
  countWords,
  courseArtifactPath,
  fileExists,
  loadChapter,
  loadCourseConfig,
  loadStandardFromConfig,
  makeArtifactRef,
  mean,
  nowIso,
  readJson,
  repoPath,
  resolvePythonExecutable,
  resolveSourcePdf,
  writeJson
} = require("./pipeline_common");

bootstrapPipelineEnv();

function topicAt(items, index, fallback) {
  return Array.isArray(items) && items.length ? items[index % items.length] : fallback;
}

function difficultyCounts(questionPool) {
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const item of questionPool || []) {
    const key = String(item?.difficulty || "").toLowerCase();
    if (counts[key] !== undefined) counts[key] += 1;
  }
  return counts;
}

function buildPhaseIntentMap(chapter) {
  const title = String(chapter.title || "this lesson").replace(/^Lesson \d+:\s*/i, "");
  return {
    INTRO: `Open ${title} with one fast mental-math hook and connect it to prior knowledge.`,
    EXPLAIN: `Explain the rule behind ${topicAt(chapter.subtopics, 0, title)} in simple language.`,
    DEMO: `Model ${topicAt(chapter.subtopics, 1, title)} step by step on the board.`,
    GUIDED: `Guide the learner through ${topicAt(chapter.subtopics, 1, title)} with prompt-based support.`,
    PRACTICE: `Shift to independent practice on ${topicAt(chapter.subtopics, 2, title)} across difficulty levels.`,
    CHECK: `Diagnose errors and reteach the exact step that broke down.`,
    CHECKPOINT: `Ask the learner to explain the shortcut before advancing.`
  };
}

function buildBlueprintChapter(chapterCode, chapter) {
  return {
    chapterCode,
    title: chapter.title,
    learningGoals: chapter.learningGoals || [],
    summaryTopics: chapter.subtopics || [],
    phaseIntentMap: buildPhaseIntentMap(chapter)
  };
}

function normalizeTeachingFlowStages(chapter, blueprintChapter) {
  const existing = Array.isArray(chapter.teachingFlowStages) ? chapter.teachingFlowStages : [];
  if (existing.length) {
    return existing.map((item, index) => ({
      phase: String(item.phase || "").toUpperCase(),
      intent: item.intent || blueprintChapter.phaseIntentMap[String(item.phase || "").toUpperCase()] || "",
      topic: topicAt(chapter.subtopics, index, chapter.title)
    }));
  }
  return Object.entries(blueprintChapter.phaseIntentMap).map(([phase, intent], index) => ({
    phase,
    intent,
    topic: topicAt(chapter.subtopics, index, chapter.title)
  }));
}

function buildStudentAction(phase, topic) {
  if (phase === "INTRO") return `Recall what you already know about ${topic}.`;
  if (phase === "EXPLAIN") return `Repeat the rule for ${topic} in your own words.`;
  if (phase === "DEMO") return `Watch the example and say the next step before it is revealed.`;
  if (phase === "GUIDED") return `Solve a scaffolded example on ${topic}.`;
  if (phase === "PRACTICE") return `Answer independent questions on ${topic}.`;
  if (phase === "CHECK") return `Explain the mistake and correct it.`;
  return `Summarize the method for ${topic}.`;
}

function buildBoardPlan(chapter) {
  const steps = Array.isArray(chapter.teachingScript) ? chapter.teachingScript : [];
  if (steps.length) {
    return steps.slice(0, 6).map((step) => step.boardAction || step.teacherLine || "Show the next step.");
  }
  return (chapter.subtopics || []).map((topic) => `Model ${topic} with one clear example.`);
}

function buildPracticeCheckpoints(chapter) {
  const starter = Array.isArray(chapter.starterPractice) ? chapter.starterPractice : [];
  const pool = Array.isArray(chapter.questionPool) ? chapter.questionPool : [];
  const out = starter.slice(0, 3).map((item, index) => ({
    label: `Practice ${String.fromCharCode(65 + index)}`,
    prompt: String(item)
  }));
  for (let i = out.length; i < 3 && i < pool.length; i += 1) {
    out.push({
      label: `Practice ${String.fromCharCode(65 + i)}`,
      prompt: pool[i].questionText
    });
  }
  return out;
}

function sanitizeStringList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean);
}

function runPythonJsonScript(scriptName, args) {
  const python = resolvePythonExecutable();
  const scriptPath = path.join(__dirname, scriptName);
  try {
    const output = execFileSync(python, [scriptPath, ...args], {
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
      reason: (stderr || stdout || error.message || "Python bridge failed").trim()
    };
  }
}

function maybeRunLlmReview(reviewType, artifactDir) {
  return runPythonJsonScript("pipeline_llm_review.py", [
    "--review-type",
    reviewType,
    "--lesson-path",
    path.join(artifactDir, "chapter_lesson_plan.json"),
    "--validation-path",
    path.join(artifactDir, "deterministic_validation_report.json")
  ]);
}

function extractArithmetic(text) {
  const match = String(text || "").trim().match(/(\d+)\s*([+\-*/xX÷])\s*(\d+)/);
  return match ? `${match[1]} ${match[2]} ${match[3]}` : null;
}

function evalArithmetic(expr) {
  const normalized = String(expr || "")
    .replace(/[xX]/g, "*")
    .replace(/[÷]/g, "/")
    .trim();
  if (!/^[\d\s+\-*/().]+$/.test(normalized)) return null;
  try {
    const value = Function(`"use strict"; return (${normalized});`)();
    return Number.isFinite(value) ? value : null;
  } catch (err) {
    return null;
  }
}

function normalizeAnswer(value) {
  const text = String(value || "").trim().toLowerCase();
  const numeric = Number(text);
  if (Number.isFinite(numeric)) return String(numeric);
  const match = text.match(/^-?\d+(?:\.\d+)?/);
  return match ? match[0] : text;
}

function schemaReport(lessonPlan) {
  const required = ["courseId", "chapterCode", "title", "learningGoals", "summaryTopics", "lessonSequence", "workedExamples", "boardPlan", "teachingFlowStages", "questionPool"];
  const issues = required
    .filter((field) => !(field in lessonPlan))
    .map((field) => ({ layer: "l1_schema", severity: "error", message: `Missing required field '${field}'` }));
  return { pass: issues.length === 0, score: Math.max(0, 20 - issues.length * 3), issues };
}

function completenessReport(lessonPlan, standard) {
  const issues = [];
  const pool = lessonPlan.questionPool || [];
  const examples = lessonPlan.workedExamples || [];
  const beats = lessonPlan.screenplay || [];
  const phases = new Set((lessonPlan.teachingFlowStages || []).map((item) => String(item.phase || "").toUpperCase()));
  const diff = difficultyCounts(pool);

  let score = 0;
  if (pool.length >= standard.layer_2_completeness.min_question_pool_size) score += 8;
  else issues.push({ layer: "l2_completeness", severity: pool.length ? "warning" : "error", message: `questionPool has ${pool.length}` });
  if (examples.length >= standard.layer_2_completeness.min_worked_examples) score += 5;
  else issues.push({ layer: "l2_completeness", severity: "error", message: `workedExamples has ${examples.length}` });
  if (beats.length >= standard.layer_2_completeness.min_screenplay_beats) score += 4;
  else issues.push({ layer: "l2_completeness", severity: "warning", message: `screenplay has ${beats.length}` });
  if (standard.layer_2_completeness.required_teaching_phases.every((phase) => phases.has(phase))) score += 4;
  else issues.push({ layer: "l2_completeness", severity: "error", message: "Missing required teaching phases" });
  if (["easy", "medium", "hard"].every((level) => diff[level] > 0)) score += 4;
  else issues.push({ layer: "l2_completeness", severity: "error", message: "Missing difficulty levels" });

  return {
    pass: !issues.some((item) => item.severity === "error"),
    score,
    issues,
    stats: { questionPoolCount: pool.length, workedExampleCount: examples.length, screenplayBeatCount: beats.length, difficultyCounts: diff }
  };
}

function mathReport(lessonPlan) {
  const issues = [];
  let verified = 0;
  let wrong = 0;
  let unverifiable = 0;
  const entries = [];
  for (const item of lessonPlan.questionPool || []) entries.push({ text: item.questionText, answer: item.expectedAnswer });
  for (const item of lessonPlan.workedExamples || []) entries.push({ text: item.question, answer: item.answer });

  for (const entry of entries) {
    const expr = extractArithmetic(entry.text);
    if (!expr) {
      unverifiable += 1;
      continue;
    }
    const computed = evalArithmetic(expr);
    if (computed === null) {
      unverifiable += 1;
      continue;
    }
    if (normalizeAnswer(entry.answer) === normalizeAnswer(computed)) verified += 1;
    else {
      wrong += 1;
      issues.push({ layer: "l3_math_accuracy", severity: "error", message: `Wrong math answer for '${entry.text}'` });
    }
  }

  if (verified + wrong === 0) {
    issues.push({ layer: "l3_math_accuracy", severity: "warning", message: "No verifiable arithmetic items found." });
  }

  return {
    pass: wrong === 0,
    score: verified + wrong === 0 ? 21 : Math.max(0, 30 - wrong * 5),
    issues,
    stats: { verified, wrong, unverifiable, totalChecked: entries.length }
  };
}

function deterministicStatus(standard, l1, l2, l3, overallScore) {
  if (!l1.pass || !l2.pass) return "incomplete";
  if (!l3.pass) return "needs_work";
  if (overallScore >= standard._meta.publish_threshold) return "ready";
  if (overallScore >= standard._meta.needs_work_threshold) return "needs_work";
  return "incomplete";
}

function runPedagogicalArchitect(context) {
  const { courseId, courseConfig, standard, runDir, chapterCodes } = context;
  const standardPath = courseArtifactPath(runDir, "course_standard.json");
  const blueprintPath = courseArtifactPath(runDir, "course_blueprint.json");
  writeJson(standardPath, {
    artifactType: "course_standard",
    courseId,
    generatedAt: nowIso(),
    standard
  });
  writeJson(blueprintPath, {
    artifactType: "course_blueprint",
    courseId,
    courseTitle: courseConfig.courseTitle,
    generatedAt: nowIso(),
    gradeBand: courseConfig.gradeBand,
    subject: courseConfig.subject,
    pedagogicalContract: {
      requiredTeachingPhases: standard.layer_2_completeness.required_teaching_phases,
      difficultyLadder: courseConfig.difficultyModel || ["easy", "medium", "hard"],
      sessionModel: {
        estimatedMinutes: courseConfig.targetSessionMinutes || 25,
        workedExamplesMin: standard.layer_2_completeness.min_worked_examples,
        questionPoolMin: standard.layer_2_completeness.min_question_pool_size
      },
      deliveryModes: courseConfig.deliveryModes || []
    },
    chapterBlueprints: chapterCodes.map((chapterCode) => buildBlueprintChapter(chapterCode, loadChapter(courseConfig, chapterCode)))
  });
  return { agentId: "pedagogical_architect", courseStandardPath: standardPath, courseBlueprintPath: blueprintPath };
}

function runContentGenerator(context) {
  const { courseId, courseConfig, standard, runDir, chapterCode } = context;
  const chapter = loadChapter(courseConfig, chapterCode);
  const blueprint = readJson(courseArtifactPath(runDir, "course_blueprint.json"));
  const blueprintChapter = blueprint.chapterBlueprints.find((item) => item.chapterCode === chapterCode);
  const artifactDir = chapterArtifactDir(runDir, chapterCode);
  const sourcePdfPath = resolveSourcePdf(courseConfig, chapterCode, chapter.source);
  const teachingFlowStages = normalizeTeachingFlowStages(chapter, blueprintChapter);
  const pool = Array.isArray(chapter.questionPool) ? chapter.questionPool : [];
  const examples = Array.isArray(chapter.workedExamples) ? chapter.workedExamples : [];
  const lessonPlan = {
    artifactType: "chapter_lesson_plan",
    generatedAt: nowIso(),
    courseId,
    chapterCode,
    title: chapter.title,
    sourcePdfPath: sourcePdfPath ? makeArtifactRef(sourcePdfPath).path : null,
    sourceChapterJsonPath: makeArtifactRef(repoPath(path.join(courseConfig.chapterDir, `${chapterCode}.json`))).path,
    estimatedMinutes: chapter.estimatedMinutes || courseConfig.targetSessionMinutes || 25,
    learningGoals: chapter.learningGoals || [],
    summaryTopics: chapter.subtopics || [],
    lessonSequence: teachingFlowStages.map((stage) => ({
      phase: stage.phase,
      topic: stage.topic,
      teacherObjective: stage.intent,
      studentAction: buildStudentAction(stage.phase, stage.topic)
    })),
    workedExamples: examples,
    practiceCheckpoints: buildPracticeCheckpoints(chapter),
    boardPlan: buildBoardPlan(chapter),
    exitTicket: pool.length ? `Final check: ${pool[pool.length - 1].questionText}` : "Explain the shortcut in your own words.",
    teachingFlowStages,
    questionPool: pool,
    screenplay: Array.isArray(chapter.screenplay) ? chapter.screenplay : [],
    generationStatus:
      pool.length >= standard.layer_2_completeness.min_question_pool_size &&
      examples.length >= standard.layer_2_completeness.min_worked_examples
        ? "review_ready"
        : "draft_ready"
  };
  const lessonPlanPath = path.join(artifactDir, "chapter_lesson_plan.json");
  writeJson(lessonPlanPath, lessonPlan);
  return { agentId: "content_generator", chapterCode, lessonPlanPath };
}

function runDeterministicValidator(context) {
  const { courseId, standard, runDir, chapterCode } = context;
  const artifactDir = chapterArtifactDir(runDir, chapterCode);
  const lessonPlanPath = path.join(artifactDir, "chapter_lesson_plan.json");
  const lessonPlan = readJson(lessonPlanPath);
  const l1 = schemaReport(lessonPlan);
  const l2 = completenessReport(lessonPlan, standard);
  const l3 = mathReport(lessonPlan);
  const overallScore = Number((((l1.score + l2.score + l3.score) / 75) * 100).toFixed(2));
  const status = deterministicStatus(standard, l1, l2, l3, overallScore);
  const issues = [...l1.issues, ...l2.issues, ...l3.issues];
  const reportPath = path.join(artifactDir, "deterministic_validation_report.json");
  writeJson(reportPath, {
    artifactType: "deterministic_validation_report",
    generatedAt: nowIso(),
    courseId,
    chapterCode,
    lessonPlanPath: makeArtifactRef(lessonPlanPath).path,
    status,
    layers: { l1_schema: l1, l2_completeness: l2, l3_math_accuracy: l3 },
    overallScore,
    blockingIssues: issues.filter((item) => item.severity === "error").map((item) => item.message),
    warnings: issues.filter((item) => item.severity === "warning").map((item) => item.message),
    publishGate: { threshold: standard._meta.publish_threshold, status, readyForReview: status === "ready" }
  });
  return { agentId: "deterministic_validator", chapterCode, reportPath };
}

function runPedagogyReviewer(context) {
  const { courseId, runDir, chapterCode } = context;
  const artifactDir = chapterArtifactDir(runDir, chapterCode);
  const lessonPlan = readJson(path.join(artifactDir, "chapter_lesson_plan.json"));
  const validation = readJson(path.join(artifactDir, "deterministic_validation_report.json"));
  const diff = difficultyCounts(lessonPlan.questionPool || []);
  const explainCount = (lessonPlan.questionPool || []).filter((item) => /\bwhy\b|\bexplain\b|\bcompare\b|\bhow\b/i.test(item.questionText || "")).length;
  const heuristicScores = {
    teaching_clarity: Number(clamp(6 + ((lessonPlan.lessonSequence || []).length >= 7 ? 1 : 0), 0, 10).toFixed(1)),
    difficulty_progression: Number(clamp(5.5 + (["easy", "medium", "hard"].every((key) => diff[key] > 0) ? 2 : 0) - (validation.status !== "ready" ? 1.5 : 0), 0, 10).toFixed(1)),
    example_quality: Number(clamp(5.5 + ((lessonPlan.workedExamples || []).length >= 4 ? 2 : 0), 0, 10).toFixed(1)),
    engagement: Number(clamp(5 + ((lessonPlan.practiceCheckpoints || []).length >= 3 ? 1.5 : 0), 0, 10).toFixed(1)),
    bloom_coverage: Number(clamp(5 + (explainCount > 0 ? 2 : 0), 0, 10).toFixed(1))
  };
  let scores = { ...heuristicScores };
  let overallScore = Number(mean(Object.values(scores)).toFixed(2));
  let topIssues = [];
  let suggestedFixes = [];
  let approvalRecommendation = validation.status === "ready" && overallScore >= 7 ? "approve_with_minor_edits" : "needs_major_edits";
  let reviewMode = "heuristic_local";
  let overallComments = "";
  if (validation.status !== "ready") {
    topIssues.push("Deterministic validation is not yet clean.");
    suggestedFixes.push("Fix structural blockers before approving pedagogy.");
  }
  if ((lessonPlan.workedExamples || []).length < 4) {
    topIssues.push("Worked examples are too thin for teach-model-practice.");
    suggestedFixes.push("Add at least two more worked examples.");
  }
  if (!topIssues.length) {
    topIssues.push("No major pedagogy blocker found in the local heuristic review.");
    suggestedFixes.push("Proceed to UI/UX and student simulation review.");
  }
  const llmReview = maybeRunLlmReview("pedagogy", artifactDir);
  if (llmReview.ok && !llmReview.skipped && llmReview.payload) {
    const payload = llmReview.payload;
    scores = {
      teaching_clarity: Number(payload.teaching_clarity ?? heuristicScores.teaching_clarity),
      difficulty_progression: Number(payload.difficulty_progression ?? heuristicScores.difficulty_progression),
      example_quality: Number(payload.example_quality ?? heuristicScores.example_quality),
      engagement: Number(payload.engagement ?? heuristicScores.engagement),
      bloom_coverage: Number(payload.bloom_coverage ?? heuristicScores.bloom_coverage)
    };
    overallScore = Number(mean(Object.values(scores)).toFixed(2));
    topIssues = sanitizeStringList(payload.top_issues);
    suggestedFixes = sanitizeStringList(payload.suggested_fixes);
    approvalRecommendation = String(payload.approval_recommendation || approvalRecommendation);
    overallComments = String(payload.overall_comments || "");
    reviewMode = `llm_${llmReview.provider || "unknown"}`;
    if (!topIssues.length) {
      topIssues = ["LLM review returned no explicit major blocker."];
    }
  } else if (llmReview.reason) {
    overallComments = `LLM review skipped: ${llmReview.reason}`;
  }
  const reportPath = path.join(artifactDir, "pedagogy_review_report.json");
  writeJson(reportPath, {
    artifactType: "pedagogy_review_report",
    generatedAt: nowIso(),
    reviewMode,
    courseId,
    chapterCode,
    lessonPlanPath: makeArtifactRef(path.join(artifactDir, "chapter_lesson_plan.json")).path,
    validationReportPath: makeArtifactRef(path.join(artifactDir, "deterministic_validation_report.json")).path,
    status: "reviewed",
    scores,
    overallScore,
    overallComments,
    topIssues,
    suggestedFixes,
    approvalRecommendation
  });
  return { agentId: "pedagogy_reviewer", chapterCode, reportPath };
}

function runUiUxReviewer(context) {
  const { courseId, runDir, chapterCode } = context;
  const artifactDir = chapterArtifactDir(runDir, chapterCode);
  const lessonPlan = readJson(path.join(artifactDir, "chapter_lesson_plan.json"));
  const validation = readJson(path.join(artifactDir, "deterministic_validation_report.json"));
  const firstInteractiveIndex = (lessonPlan.lessonSequence || []).findIndex((item) => ["GUIDED", "PRACTICE", "CHECK"].includes(item.phase));
  const avgQuestionWords = mean((lessonPlan.questionPool || []).map((item) => countWords(item.questionText)));
  const frictionPoints = [];
  const accessibilityIssues = [];
  const engagementRisks = [];
  const suggestedFixes = [];
  if (firstInteractiveIndex > 2 || firstInteractiveIndex === -1) {
    frictionPoints.push("Learner interaction starts late in the lesson.");
    suggestedFixes.push("Move a learner response earlier in the flow.");
  }
  if (avgQuestionWords > 18) {
    frictionPoints.push("Question text is dense for a mental-math interface.");
    suggestedFixes.push("Shorten question wording so the math appears faster.");
  }
  if ((lessonPlan.boardPlan || []).length < 3) {
    accessibilityIssues.push("Board guidance is too thin for a consistent visual explanation.");
    suggestedFixes.push("Add more explicit board actions.");
  }
  if (validation.status !== "ready") {
    engagementRisks.push("Structural content gaps will leak into learner experience.");
    suggestedFixes.push("Resolve deterministic blockers before UI sign-off.");
  }
  if (!frictionPoints.length && !accessibilityIssues.length && !engagementRisks.length) {
    frictionPoints.push("No major UI/UX friction detected from the lesson artifact.");
    suggestedFixes.push("Render snapshots before production approval.");
  }
  let reviewMode = "artifact_heuristic";
  let overallRisk = validation.status === "ready" ? "medium" : "high";
  const llmReview = maybeRunLlmReview("uiux", artifactDir);
  if (llmReview.ok && !llmReview.skipped && llmReview.payload) {
    const payload = llmReview.payload;
    frictionPoints.splice(0, frictionPoints.length, ...sanitizeStringList(payload.friction_points));
    accessibilityIssues.splice(0, accessibilityIssues.length, ...sanitizeStringList(payload.accessibility_issues));
    engagementRisks.splice(0, engagementRisks.length, ...sanitizeStringList(payload.engagement_risks));
    suggestedFixes.splice(0, suggestedFixes.length, ...sanitizeStringList(payload.suggested_fixes));
    overallRisk = String(payload.overall_risk || overallRisk);
    reviewMode = `llm_${llmReview.provider || "unknown"}`;
    if (!frictionPoints.length && !accessibilityIssues.length && !engagementRisks.length) {
      frictionPoints.push("LLM review found no major UI/UX blocker.");
    }
  } else if (llmReview.reason) {
    suggestedFixes.push(`LLM UI review skipped: ${llmReview.reason}`);
  }
  const reportPath = path.join(artifactDir, "ui_ux_review_report.json");
  writeJson(reportPath, {
    artifactType: "ui_ux_review_report",
    generatedAt: nowIso(),
    reviewMode,
    courseId,
    chapterCode,
    lessonJsonPath: makeArtifactRef(path.join(artifactDir, "chapter_lesson_plan.json")).path,
    uiSnapshotPaths: [],
    uiStateDumpPath: null,
    status: "reviewed",
    overallRisk,
    frictionPoints,
    accessibilityIssues,
    engagementRisks,
    suggestedFixes
  });
  return { agentId: "ui_ux_reviewer", chapterCode, reportPath };
}

function runStudentSimulator(context) {
  const { courseId, courseConfig, runDir, chapterCode } = context;
  const artifactDir = chapterArtifactDir(runDir, chapterCode);
  const lessonPlan = readJson(path.join(artifactDir, "chapter_lesson_plan.json"));
  const validation = readJson(path.join(artifactDir, "deterministic_validation_report.json"));
  const stuckMoments = [];
  const repetitionRisks = [];
  const recommendedFixes = [];
  if ((lessonPlan.workedExamples || []).length < 4) {
    stuckMoments.push("I needed more fully worked examples before independent practice.");
    recommendedFixes.push("Add more worked examples before practice.");
  }
  const seen = new Map();
  for (const item of lessonPlan.lessonSequence || []) {
    const key = String(item.teacherObjective || "").trim().toLowerCase();
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  if ([...seen.values()].some((count) => count >= 2)) {
    repetitionRisks.push("Some adjacent phases feel repetitive.");
    recommendedFixes.push("Differentiate the learner ask between phases.");
  }
  if (validation.status !== "ready") {
    stuckMoments.push("The lesson still has structural gaps that would block a smooth student flow.");
    recommendedFixes.push("Fix missing content structures before sign-off.");
  }
  if (!stuckMoments.length) {
    stuckMoments.push("No major stall was predicted in the local simulation.");
    recommendedFixes.push("Run the lesson with a lower-confidence learner profile next.");
  }
  const reportPath = path.join(artifactDir, "student_simulation_report.json");
  writeJson(reportPath, {
    artifactType: "student_simulation_report",
    generatedAt: nowIso(),
    simulationMode: "heuristic_local",
    courseId,
    chapterCode,
    lessonJsonPath: makeArtifactRef(path.join(artifactDir, "chapter_lesson_plan.json")).path,
    learnerProfile: {
      gradeBand: courseConfig.gradeBand || "5-8",
      confidence: "medium",
      pace: "average",
      weaknesses: ["mental subtraction", "multi-step attention"],
      languageComfort: "english"
    },
    status: "simulated",
    stuckMoments,
    repetitionRisks,
    hintEffectiveness: (lessonPlan.questionPool || []).slice(0, 5).map((item) => ({ hint: item.hint || "", helped: countWords(item.hint) >= 3 })),
    recommendedFixes
  });
  return { agentId: "student_simulator", chapterCode, reportPath };
}

function runPublishOrchestrator(context) {
  const { courseId, runDir, chapterCode, approvedBy } = context;
  const artifactDir = chapterArtifactDir(runDir, chapterCode);
  const validation = readJson(path.join(artifactDir, "deterministic_validation_report.json"));
  const pedagogy = readJson(path.join(artifactDir, "pedagogy_review_report.json"));
  const uiUx = readJson(path.join(artifactDir, "ui_ux_review_report.json"));
  const blockers = [];
  if (validation.status !== "ready") blockers.push("Deterministic validation is not publish-ready.");
  if (pedagogy.overallScore < 6.5) blockers.push("Pedagogy review score is below the acceptance floor.");
  if ((uiUx.accessibilityIssues || []).length > 2) blockers.push("UI/UX review still has multiple accessibility issues.");
  let decision = "pending_human_approval";
  let publishStatus = "pending_review";
  if (blockers.length) {
    decision = "blocked";
    publishStatus = "needs_revision";
  } else if (approvedBy) {
    decision = "approved";
    publishStatus = "approved";
  }
  const reportPath = path.join(artifactDir, "publish_decision.json");
  const report = {
    artifactType: "publish_decision",
    generatedAt: nowIso(),
    courseId,
    chapterCode,
    decision,
    publishStatus,
    approvedBy: approvedBy || null,
    approvedAt: approvedBy ? nowIso() : null,
    blockers,
    dbSync: null,
    validationReportPath: makeArtifactRef(path.join(artifactDir, "deterministic_validation_report.json")).path,
    pedagogyReviewPath: makeArtifactRef(path.join(artifactDir, "pedagogy_review_report.json")).path,
    uiUxReviewPath: makeArtifactRef(path.join(artifactDir, "ui_ux_review_report.json")).path,
    studentSimulationPath: makeArtifactRef(path.join(artifactDir, "student_simulation_report.json")).path
  };
  writeJson(reportPath, report);
  const syncResult = runPythonJsonScript("pipeline_sync_publish_db.py", [
    "--course-id",
    courseId,
    "--run-id",
    path.basename(runDir),
    "--chapter-code",
    chapterCode,
    "--lesson-path",
    path.join(artifactDir, "chapter_lesson_plan.json"),
    "--validation-path",
    path.join(artifactDir, "deterministic_validation_report.json"),
    "--pedagogy-path",
    path.join(artifactDir, "pedagogy_review_report.json"),
    "--publish-path",
    reportPath,
    ...(approvedBy ? ["--approved-by", approvedBy] : [])
  ]);
  report.dbSync = syncResult;
  writeJson(reportPath, report);
  return { agentId: "publish_orchestrator", chapterCode, reportPath };
}

const AGENT_RUNNERS = {
  pedagogical_architect: runPedagogicalArchitect,
  content_generator: runContentGenerator,
  deterministic_validator: runDeterministicValidator,
  pedagogy_reviewer: runPedagogyReviewer,
  ui_ux_reviewer: runUiUxReviewer,
  student_simulator: runStudentSimulator,
  publish_orchestrator: runPublishOrchestrator
};

function chapterStageStatus(runDir, chapterCode) {
  const artifactDir = chapterArtifactDir(runDir, chapterCode);
  const files = {
    content_generator: "chapter_lesson_plan.json",
    deterministic_validator: "deterministic_validation_report.json",
    pedagogy_reviewer: "pedagogy_review_report.json",
    ui_ux_reviewer: "ui_ux_review_report.json",
    student_simulator: "student_simulation_report.json",
    publish_orchestrator: "publish_decision.json"
  };
  const status = { pedagogical_architect: fileExists(courseArtifactPath(runDir, "course_blueprint.json")) ? "complete" : "pending" };
  for (const [agentId, fileName] of Object.entries(files)) {
    status[agentId] = fileExists(path.join(artifactDir, fileName)) ? "complete" : "pending";
  }
  return status;
}

function buildChapterBoardEntry(context, chapterCode) {
  const { courseConfig, runDir } = context;
  const chapter = loadChapter(courseConfig, chapterCode);
  const artifactDir = chapterArtifactDir(runDir, chapterCode);
  const validationPath = path.join(artifactDir, "deterministic_validation_report.json");
  const publishPath = path.join(artifactDir, "publish_decision.json");
  const validation = fileExists(validationPath) ? readJson(validationPath) : null;
  const publish = fileExists(publishPath) ? readJson(publishPath) : null;
  return {
    chapterCode,
    title: chapter.title,
    nextAgent: publish ? (publish.publishStatus === "approved" ? "complete" : publish.decision === "blocked" ? "content_generator" : "human_approval") : validation ? (validation.status === "ready" ? "pedagogy_reviewer" : "content_generator") : "content_generator",
    blockers: publish ? publish.blockers || [] : validation ? validation.blockingIssues || [] : [],
    stageStatus: chapterStageStatus(runDir, chapterCode),
    artifacts: {
      lessonPlan: makeArtifactRef(path.join(artifactDir, "chapter_lesson_plan.json")),
      validation: makeArtifactRef(validationPath),
      pedagogy: makeArtifactRef(path.join(artifactDir, "pedagogy_review_report.json")),
      uiUx: makeArtifactRef(path.join(artifactDir, "ui_ux_review_report.json")),
      studentSimulation: makeArtifactRef(path.join(artifactDir, "student_simulation_report.json")),
      publishDecision: makeArtifactRef(publishPath)
    },
    readiness: validation ? { deterministicStatus: validation.status, overallScore: validation.overallScore } : null
  };
}

function buildCourseReadinessReport(context, chapterCodes) {
  const chapters = chapterCodes.map((chapterCode) => buildChapterBoardEntry(context, chapterCode));
  const validationReports = chapters.map((entry) => (entry.artifacts.validation.exists ? readJson(repoPath(entry.artifacts.validation.path)) : null)).filter(Boolean);
  const publishReports = chapters.map((entry) => (entry.artifacts.publishDecision.exists ? readJson(repoPath(entry.artifacts.publishDecision.path)) : null)).filter(Boolean);
  return {
    artifactType: "course_readiness_report",
    generatedAt: nowIso(),
    courseId: context.courseId,
    totalChapters: chapters.length,
    deterministicReadyCount: validationReports.filter((item) => item.status === "ready").length,
    publishApprovalCount: publishReports.filter((item) => item.publishStatus === "approved").length,
    blockedCount: chapters.filter((entry) => entry.blockers.length > 0).length,
    averageDeterministicScore: Number(mean(validationReports.map((item) => item.overallScore)).toFixed(2)),
    chapters: chapters.map((entry) => ({
      chapterCode: entry.chapterCode,
      title: entry.title,
      nextAgent: entry.nextAgent,
      blockers: entry.blockers,
      readiness: entry.readiness
    }))
  };
}

function makeAgentContext({ courseId, runDir, approvedBy }) {
  const courseConfig = loadCourseConfig(courseId);
  const standard = loadStandardFromConfig(courseConfig);
  return { courseId, courseConfig, standard, runDir, approvedBy };
}

module.exports = {
  AGENT_RUNNERS,
  buildChapterBoardEntry,
  buildCourseReadinessReport,
  makeAgentContext,
  runPedagogicalArchitect
};
