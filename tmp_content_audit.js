const fs = require('fs');
const path = require('path');

const roots = [
  'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter',
  'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_5/chapter',
];

for (const root of roots) {
  console.log('## ' + root);
  for (const name of fs.readdirSync(root).filter((f) => f.endsWith('.json')).sort()) {
    const full = path.join(root, name);
    let raw = fs.readFileSync(full, 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.log('PARSE_FAIL ' + name + ': ' + e.message);
      continue;
    }
    const issues = [];
    const flow = (((data || {}).duolingoLessonArc || {}).sessionFlow) || [];
    for (const step of flow) {
      for (const ex of (step.exercises || [])) {
        const qid = ex.questionId || '?';
        const qt = ex.questionType || ex.type || '';
        if (qt === 'mcq') {
          const opts = ex.options || [];
          const ci = ex.correctIndex;
          const exp = String(ex.expectedAnswer || '').trim();
          if (Number.isInteger(ci) && ci >= 0 && ci < opts.length) {
            const chosen = String(opts[ci]).trim();
            if (exp && chosen !== exp) {
              issues.push(`  - ${qid}: MCQ mismatch option[${ci}]='${chosen}' expected='${exp}'`);
            }
          } else {
            issues.push(`  - ${qid}: Invalid correctIndex='${ci}' options=${opts.length}`);
          }
        }
        if (!String(ex.questionText || '').trim()) {
          issues.push(`  - ${qid}: Missing questionText`);
        }
      }
    }
    if (issues.length) {
      console.log(name);
      for (const issue of issues.slice(0, 20)) console.log(issue);
    }
  }
}
