const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'ai-tutor', 'web', 'lib', 'generated', 'courseCatalog.json');
const MANIFEST_PATH = path.join(ROOT, 'ai-tutor', 'web', 'public', 'math-svgs', 'manifest.json');
const REPORT_PATH = path.join(ROOT, 'artifacts', 'agentic_content_patch_report.json');
const STRATEGY_PATH = path.join(ROOT, 'scripts', 'config', 'agentic_patch_strategies.json');

const TEXT_REPLACEMENTS = [
  ['â€”', '-'],
  ['â€“', '-'],
  ['âˆ’', '-'],
  ['â†’', '->'],
  ['â‰¥', '>='],
  ['â‰¤', '<='],
  ['Ã—', 'x'],
  ['Ã·', '/'],
  ['Â·', '·'],
  ['â€¦', '...'],
  ['â€œ', '"'],
  ['â€\u009d', '"'],
  ['â€˜', "'"],
  ['â€™', "'"],
  ['Â©', '©'],
];

function parseArgs(argv) {
  const args = { action: 'audit', write: false };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  if (args.apply) args.action = 'apply';
  if (args.write || args.commit) args.write = true;
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function fixText(value) {
  if (typeof value === 'string') {
    let out = value.replace(/^\uFEFF/, '');
    for (const [from, to] of TEXT_REPLACEMENTS) out = out.split(from).join(to);
    return out;
  }
  if (Array.isArray(value)) return value.map(fixText);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, child] of Object.entries(value)) out[key] = fixText(child);
    return out;
  }
  return value;
}

function toSlug(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokenize(text) {
  return Array.from(new Set(toSlug(text).split(/\s+/).filter((token) => token.length >= 3)));
}

function flattenManifestSymbols(manifest) {
  const rows = [];
  for (const [categoryId, category] of Object.entries(manifest.categories || {})) {
    for (const symbol of category.symbols || []) {
      rows.push({
        categoryId,
        id: symbol.id,
        href: symbol.href,
        asset: path.basename(symbol.href || ''),
        tags: Array.isArray(symbol.tags) ? symbol.tags : [],
      });
    }
  }
  return rows;
}

function loadStrategyMap() {
  if (!fs.existsSync(STRATEGY_PATH)) return {};
  return readJson(STRATEGY_PATH);
}
function getCourseCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error('Generated catalog missing. Run scripts/generate_ai_tutor_catalog.js first.');
  }
  return readJson(CATALOG_PATH);
}

function selectCourses(catalog, args) {
  return (catalog.courses || []).filter((course) => {
    if (args.product && course.productSlug !== String(args.product).toLowerCase()) return false;
    if (args.family && course.family !== String(args.family).toLowerCase()) return false;
    if (args.course && course.courseKey !== args.course && course.courseId !== args.course) return false;
    if (args['course-id'] && course.courseId !== args['course-id']) return false;
    if (args.grade && String(course.grade) !== String(args.grade)) return false;
    return true;
  });
}

function getChapterFiles(course) {
  const chapterDir = path.join(ROOT, course.chapterDir);
  if (!fs.existsSync(chapterDir)) return [];
  return fs.readdirSync(chapterDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(chapterDir, file))
    .sort();
}

function getSessionFlow(chapter) {
  if (Array.isArray(chapter?.duolingoLessonArc?.sessionFlow)) return chapter.duolingoLessonArc.sessionFlow;
  if (Array.isArray(chapter?.sessionFlow)) return chapter.sessionFlow;
  return [];
}

function getScreenplayList(chapter) {
  if (Array.isArray(chapter?.screenplay)) return chapter.screenplay;
  if (Array.isArray(chapter?.screenplay?.beats)) return chapter.screenplay.beats;
  return [];
}

function getTeachingList(chapter) {
  return Array.isArray(chapter?.teachingScript) ? chapter.teachingScript : [];
}

function countVisualCoverage(list, nestedKey) {
  if (!Array.isArray(list)) return { total: 0, withVisual: 0 };
  if (!nestedKey) return { total: list.length, withVisual: list.filter(hasVisual).length };
  let total = 0;
  let withVisual = 0;
  for (const item of list) {
    for (const child of item[nestedKey] || []) {
      total += 1;
      if (hasVisual(child)) withVisual += 1;
    }
  }
  return { total, withVisual };
}

function hasVisual(node) {
  return Boolean(node && (node.visual || node.visualRef || node.boardVisual || node.boardVisualRef));
}

function chapterTokens(course, chapter, chapterMeta) {
  const parts = [
    course.productName,
    course.familyName,
    course.courseName,
    chapter.title,
    chapterMeta?.title,
    chapter.source,
    ...(chapter.subtopics || []),
    ...(chapter.learningGoals || []),
    ...(chapter.coreIdeas || []),
  ];
  return tokenize(parts.filter(Boolean).join(' '));
}

function buildFamilyKeywordBoosts(course) {
  if (course.family === 'vedic_math') return ['vedic', 'math', 'multiplication', 'addition', 'subtraction', 'pattern'];
  if (course.family === 'aptitude_reasoning') return ['reasoning', 'logic', 'pattern', 'direction', 'series', 'coding', 'venn', 'data'];
  return [course.family];
}

function findSymbolById(manifestSymbols, id) {
  return manifestSymbols.find((symbol) => symbol.id === id) || null;
}

function chooseStrategySymbol(course, chapter, chapterMeta, manifestSymbols, strategyMap) {
  const probe = toSlug([
    chapter.chapterCode,
    chapter.title,
    chapterMeta?.title,
    chapter.source,
    ...(chapter.subtopics || []),
    ...(chapter.learningGoals || []),
    ...(chapter.coreIdeas || []),
  ].filter(Boolean).join(' '));

  const rules = Array.isArray(strategyMap?.[course.family]) ? strategyMap[course.family] : [];
  for (const rule of rules) {
    const test = new RegExp(rule.pattern, 'i');
    if (!test.test(probe)) continue;
    const symbol = findSymbolById(manifestSymbols, rule.symbolId);
    if (symbol) return { symbol, forced: true, reason: 'strategy' };
  }

  return null;
}

function chooseVisualSymbol(course, chapter, chapterMeta, manifestSymbols) {
  const strategyChoice = chooseStrategySymbol(course, chapter, chapterMeta, manifestSymbols, STRATEGY_MAP);
  if (strategyChoice) return strategyChoice;

  const tokens = new Set([...chapterTokens(course, chapter, chapterMeta), ...buildFamilyKeywordBoosts(course)]);
  const preferredCategories = course.family === 'vedic_math'
    ? ['vedic', 'series', 'arrows']
    : ['series', 'logic', 'directions', 'data', 'coding', 'patterns', 'shapes', 'arrows', 'relations', 'seating', 'clocks'];

  let best = null;
  for (const symbol of manifestSymbols) {
    const haystack = new Set([...symbol.tags.flatMap(tokenize), ...tokenize(symbol.id), ...tokenize(symbol.categoryId)]);
    let score = preferredCategories.includes(symbol.categoryId) ? 4 : 0;
    for (const token of tokens) {
      if (haystack.has(token)) score += 3;
      else if ([...haystack].some((item) => item.includes(token) || token.includes(item))) score += 1;
    }
    if (!best || score > best.score) best = { score, symbol };
  }
  return best && best.score >= 5 ? { symbol: best.symbol, forced: false, reason: 'score' } : { symbol: null, forced: false, reason: 'none' };
}

function buildVisualPayload(symbol, title, caption) {
  return {
    kind: 'svg',
    asset: symbol.asset,
    title,
    caption,
  };
}

function deriveLibraryEntry(symbol, chapter) {
  return {
    visualId: symbol.id,
    kind: 'svg',
    asset: symbol.asset,
    title: chapter.title,
    caption: 'Shared lesson visual selected by the agentic content patch engine.',
  };
}

function ensureVisualLibrary(chapter, symbol, forceReplace) {
  if (!symbol) return false;
  let changed = false;
  const library = Array.isArray(chapter.visualLibrary) ? chapter.visualLibrary.filter(Boolean) : [];
  if (forceReplace) {
    const filtered = library.filter((entry) => !(entry && entry.kind === 'svg' && entry.asset && entry.asset !== symbol.asset));
    if (filtered.length !== library.length) changed = true;
    filtered.unshift(deriveLibraryEntry(symbol, chapter));
    chapter.visualLibrary = dedupeLibrary(filtered);
    return true;
  }
  if (!library.some((entry) => entry && (entry.visualId === symbol.id || entry.asset === symbol.asset))) {
    library.unshift(deriveLibraryEntry(symbol, chapter));
    chapter.visualLibrary = dedupeLibrary(library);
    return true;
  }
  chapter.visualLibrary = dedupeLibrary(library);
  return changed;
}

function dedupeLibrary(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = (item.visualId || '') + '|' + (item.asset || '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function sanitizeTitleForIndex(title) {
  return String(title || '').replace(/^Lesson\s+\d+\s*:\s*/i, '').trim();
}

function setNodeVisual(node, symbol, title, caption, forceReplace) {
  if (!node) return false;
  const currentAsset = node.visual?.asset || node.boardVisual?.asset || null;
  if (forceReplace || !hasVisual(node) || (currentAsset && currentAsset !== symbol.asset)) {
    node.visual = buildVisualPayload(symbol, title, caption);
    return true;
  }
  return false;
}

function attachVisuals(course, chapter, chapterMeta, choice) {
  const symbol = choice.symbol;
  if (!symbol) return { flow: 0, exercises: 0, teaching: 0, screenplay: 0 };
  const friendlyTitle = sanitizeTitleForIndex(chapter.title || chapterMeta?.title || 'Lesson visual');
  const flow = getSessionFlow(chapter);
  const teaching = getTeachingList(chapter);
  const screenplay = getScreenplayList(chapter);
  const counts = { flow: 0, exercises: 0, teaching: 0, screenplay: 0 };

  for (const step of flow) {
    const groupLabel = step.exerciseGroup ? 'Group ' + step.exerciseGroup : 'Lesson step';
    const caption = groupLabel + ' for ' + friendlyTitle + '.';
    if (setNodeVisual(step, symbol, friendlyTitle, caption, choice.forced)) counts.flow += 1;
    for (const ex of step.exercises || []) {
      if (setNodeVisual(ex, symbol, friendlyTitle, caption, choice.forced)) counts.exercises += 1;
    }
  }

  for (const step of teaching) {
    if (setNodeVisual(step, symbol, friendlyTitle, 'Teaching step for ' + friendlyTitle + '.', choice.forced)) counts.teaching += 1;
  }

  for (const beat of screenplay) {
    if (setNodeVisual(beat, symbol, friendlyTitle, 'Screenplay beat for ' + friendlyTitle + '.', choice.forced)) counts.screenplay += 1;
  }

  return counts;
}

function syncMetadata(course, chapter, chapterMeta) {
  let changed = false;
  if (chapterMeta?.code && chapter.chapterCode !== chapterMeta.code) {
    chapter.chapterCode = chapterMeta.code;
    changed = true;
  }
  if (course.courseId && chapter.courseId !== course.courseId) {
    chapter.courseId = course.courseId;
    changed = true;
  }
  if (chapterMeta?.title && sanitizeTitleForIndex(chapter.title) !== sanitizeTitleForIndex(chapterMeta.title)) {
    chapter.title = 'Lesson ' + chapterMeta.order + ': ' + chapterMeta.title;
    changed = true;
  }
  return changed;
}

function syncIndexTitle(indexJson, chapterCode, chapterTitle) {
  const target = (indexJson.chapters || []).find((entry) => entry.chapterCode === chapterCode || entry.code === chapterCode);
  if (!target) return false;
  const cleanTitle = sanitizeTitleForIndex(chapterTitle);
  if (target.title !== cleanTitle) {
    target.title = cleanTitle;
    return true;
  }
  return false;
}

function buildAudit(chapter) {
  const flow = getSessionFlow(chapter);
  return {
    sessionFlow: countVisualCoverage(flow),
    exercises: countVisualCoverage(flow, 'exercises'),
    teachingScript: countVisualCoverage(getTeachingList(chapter)),
    screenplay: countVisualCoverage(getScreenplayList(chapter)),
    hasVisualLibrary: Array.isArray(chapter.visualLibrary) && chapter.visualLibrary.length > 0,
  };
}

function processChapter(course, chapterFile, indexJson, manifestSymbols, args) {
  const original = readJson(chapterFile);
  const chapter = fixText(original);
  const chapterCode = chapter.chapterCode || path.basename(chapterFile, '.json');
  const chapterMeta = (course.chapters || []).find((entry) => entry.code === chapterCode) || null;
  if (args.chapter && chapterCode !== args.chapter) return null;
  const before = buildAudit(chapter);
  const choice = chooseVisualSymbol(course, chapter, chapterMeta, manifestSymbols);
  const changed = {
    text: JSON.stringify(original) !== JSON.stringify(chapter),
    metadata: syncMetadata(course, chapter, chapterMeta),
    library: ensureVisualLibrary(chapter, choice.symbol, choice.forced),
    visuals: attachVisuals(course, chapter, chapterMeta, choice),
    index: false,
  };
  if (chapter.chapterCode) changed.index = syncIndexTitle(indexJson, chapter.chapterCode, chapter.title);
  const after = buildAudit(chapter);
  const shouldWrite = args.action === 'apply' && args.write;
  if (shouldWrite) writeJson(chapterFile, chapter);
  return {
    chapterCode,
    file: path.relative(ROOT, chapterFile).replace(/\\/g, '/'),
    symbol: choice.symbol ? { id: choice.symbol.id, asset: choice.symbol.asset, category: choice.symbol.categoryId, reason: choice.reason, forced: choice.forced } : null,
    before,
    after,
    changed,
    wrote: shouldWrite,
  };
}

let STRATEGY_MAP = {};

function main() {
  const args = parseArgs(process.argv);
  const catalog = getCourseCatalog();
  STRATEGY_MAP = loadStrategyMap();
  const manifestSymbols = flattenManifestSymbols(readJson(MANIFEST_PATH));
  const selectedCourses = selectCourses(catalog, args);
  if (selectedCourses.length === 0) {
    throw new Error('No courses matched the supplied filters.');
  }

  const report = { action: args.action, write: Boolean(args.write), courses: [] };
  for (const course of selectedCourses) {
    const indexPath = path.join(ROOT, course.indexPath);
    const indexJson = fixText(readJson(indexPath));
    const chapterReports = [];
    for (const chapterFile of getChapterFiles(course)) {
      const result = processChapter(course, chapterFile, indexJson, manifestSymbols, args);
      if (result) chapterReports.push(result);
    }
    const shouldWriteIndex = args.action === 'apply' && args.write && chapterReports.some((item) => item.changed.index);
    if (shouldWriteIndex) writeJson(indexPath, indexJson);
    report.courses.push({
      productSlug: course.productSlug,
      family: course.family,
      courseId: course.courseId,
      courseKey: course.courseKey,
      chapterCount: chapterReports.length,
      wroteIndex: shouldWriteIndex,
      chapters: chapterReports,
    });
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  writeJson(REPORT_PATH, report);
  console.log('WROTE ' + REPORT_PATH);
  console.log(JSON.stringify(report, null, 2));
}

main();




