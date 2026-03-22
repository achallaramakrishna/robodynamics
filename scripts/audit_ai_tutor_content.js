const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'ai-tutor', 'tutor-api', 'content-template');
const out = path.resolve(__dirname, '..', 'artifacts', 'ai_tutor_content_audit.json');

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walk(full));
    else if (item.isFile() && item.name.endsWith('.json')) out.push(full);
  }
  return out;
}

function readJson(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  return { raw, data: JSON.parse(raw) };
}

function getScreenplayCount(screenplay) {
  if (Array.isArray(screenplay)) return screenplay.length;
  if (screenplay && Array.isArray(screenplay.beats)) return screenplay.beats.length;
  return 0;
}

function getSessionFlow(data) {
  if (data?.duolingoLessonArc?.sessionFlow && Array.isArray(data.duolingoLessonArc.sessionFlow)) {
    return data.duolingoLessonArc.sessionFlow;
  }
  if (Array.isArray(data?.sessionFlow)) return data.sessionFlow;
  return [];
}

function getQuestionPool(data) {
  return Array.isArray(data?.questionPool) ? data.questionPool : [];
}

function findBadEncoding(raw) {
  return /â€”|â€“|âˆ’|Ã—|Ã·|â†’|âœ“|ðŸ|Â·|â€¦|â€œ|â€|Ã/.test(raw);
}

function listCourseRoots(baseDir) {
  const families = fs.readdirSync(baseDir, { withFileTypes: true }).filter((item) => item.isDirectory());
  const roots = [];
  for (const family of families) {
    const familyPath = path.join(baseDir, family.name);
    const children = fs.readdirSync(familyPath, { withFileTypes: true }).filter((item) => item.isDirectory());
    for (const child of children) {
      const courseRoot = path.join(familyPath, child.name);
      if (fs.existsSync(path.join(courseRoot, 'chapter')) && fs.existsSync(path.join(courseRoot, 'chapters.json'))) {
        roots.push({ family: family.name, courseKey: child.name, dir: courseRoot });
      }
    }
  }
  return roots;
}

const report = [];
for (const courseRoot of listCourseRoots(root)) {
  const files = walk(path.join(courseRoot.dir, 'chapter'));
  for (const file of files.sort()) {
    const { raw, data } = readJson(file);
    const sessionFlow = getSessionFlow(data);
    const questionPool = getQuestionPool(data);
    const sessionExercises = sessionFlow.reduce((n, step) => n + ((step && Array.isArray(step.exercises)) ? step.exercises.length : 0), 0);
    const prompts = sessionFlow.filter(Boolean).map(step => ({
      group: step.exerciseGroup || null,
      tryPrompt: step.tryPrompt || null,
      masteryCheck: step.masteryCheck || null,
      hasExercises: Array.isArray(step.exercises) && step.exercises.length > 0,
    }));
    report.push({
      family: courseRoot.family,
      courseKey: courseRoot.courseKey,
      file,
      chapterCode: data.chapterCode || null,
      courseId: data.courseId || null,
      title: data.title || null,
      badEncoding: findBadEncoding(raw),
      screenplayCount: getScreenplayCount(data.screenplay),
      sessionSteps: sessionFlow.length,
      sessionExercises,
      questionPool: questionPool.length,
      promptBackedSteps: prompts.filter(p => p.tryPrompt || p.masteryCheck).length,
      firstPrompt: prompts.find(p => p.tryPrompt || p.masteryCheck) || null,
    });
  }
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(`WROTE ${out}`);
console.log(`FILES ${report.length}`);
const summary = report.reduce((acc, row) => {
  const key = `${row.family}/${row.courseKey}`;
  acc[key] ||= { files: 0, badEncoding: 0, noQuestions: 0, noScreenplay: 0, promptBacked: 0 };
  acc[key].files += 1;
  if (row.badEncoding) acc[key].badEncoding += 1;
  if (row.questionPool === 0 && row.sessionExercises === 0) acc[key].noQuestions += 1;
  if (row.screenplayCount === 0) acc[key].noScreenplay += 1;
  if (row.promptBackedSteps > 0) acc[key].promptBacked += 1;
  return acc;
}, {});
console.log(JSON.stringify(summary, null, 2));
