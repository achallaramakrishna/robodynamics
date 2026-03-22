const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_ROOT = path.join(ROOT, 'ai-tutor', 'tutor-api', 'content-template');
const OUTPUT_PATH = path.join(ROOT, 'ai-tutor', 'web', 'lib', 'generated', 'courseCatalog.json');

const PRODUCT_META = {
  vedic_math: {
    productSlug: 'mindsutra',
    productName: 'MindSutra',
    familyName: 'Vedic Math',
  },
  aptitude_reasoning: {
    productSlug: 'mindspark',
    productName: 'MindSpark',
    familyName: 'Aptitude & Reasoning',
  },
  financial_literacy: {
    productSlug: 'moneymind',
    productName: 'MoneyMind',
    familyName: 'Financial Literacy',
  },
};

const SAFE_REPLACEMENTS = [
  ['â€”', '-'],
  ['â€“', '-'],
  ['âˆ’', '-'],
  ['â†’', '->'],
  ['Ã—', 'x'],
  ['Ã·', '/'],
  ['Â·', '·'],
  ['â€¦', '...'],
  ['â€œ', '"'],
  ['â€\u009d', '"'],
  ['â€˜', "'"],
  ['â€™', "'"],
  ['Â©', '©'],
  ['â‰¥', '>='],
  ['â‰¤', '<='],
  ['â‰ ', '!='],
];

function fixText(value) {
  if (typeof value === 'string') {
    let out = value.replace(/^\uFEFF/, '');
    for (const [from, to] of SAFE_REPLACEMENTS) {
      out = out.split(from).join(to);
    }
    return out;
  }
  if (Array.isArray(value)) {
    return value.map(fixText);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = fixText(child);
    }
    return out;
  }
  return value;
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return fixText(JSON.parse(raw));
}

function isCourseRoot(dirPath) {
  return fs.existsSync(path.join(dirPath, 'chapters.json')) && fs.existsSync(path.join(dirPath, 'chapter'));
}

function listCourseRoots() {
  const familyDirs = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true }).filter((item) => item.isDirectory());
  const roots = [];
  for (const familyDir of familyDirs) {
    const familyPath = path.join(CONTENT_ROOT, familyDir.name);
    for (const child of fs.readdirSync(familyPath, { withFileTypes: true }).filter((item) => item.isDirectory())) {
      const childPath = path.join(familyPath, child.name);
      if (isCourseRoot(childPath)) {
        roots.push({
          family: familyDir.name,
          courseKey: child.name,
          dir: childPath,
        });
      }
    }
  }
  return roots.sort((a, b) => (a.family + '/' + a.courseKey).localeCompare(b.family + '/' + b.courseKey));
}

function toGradeNumber(courseKey) {
  const match = /^grade_(\d+)$/i.exec(courseKey);
  return match ? Number(match[1]) : null;
}

function chapterSortValue(chapter) {
  if (typeof chapter.order === 'number') return chapter.order;
  const code = String(chapter.chapterCode || chapter.code || '');
  const match = /_L(\d+)\b/i.exec(code);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function buildCatalogEntry(rootInfo) {
  const meta = PRODUCT_META[rootInfo.family] || {
    productSlug: rootInfo.family,
    productName: rootInfo.family,
    familyName: rootInfo.family,
  };
  const chaptersIndex = readJson(path.join(rootInfo.dir, 'chapters.json'));
  const grade = toGradeNumber(rootInfo.courseKey);
  const chapters = Array.isArray(chaptersIndex.chapters) ? [...chaptersIndex.chapters] : [];
  chapters.sort((a, b) => chapterSortValue(a) - chapterSortValue(b));

  return {
    productSlug: meta.productSlug,
    productName: chaptersIndex.productName || meta.productName,
    family: rootInfo.family,
    familyName: meta.familyName,
    courseKey: rootInfo.courseKey,
    courseId: chaptersIndex.courseId || null,
    courseName: chaptersIndex.courseName || chaptersIndex.courseTitle || null,
    tagline: chaptersIndex.tagline || '',
    grade,
    gradeSlug: grade == null ? null : 'grade-' + grade,
    targetAudience: chaptersIndex.targetAudience || null,
    chapterCount: chapters.length,
    chapterDir: path.relative(ROOT, path.join(rootInfo.dir, 'chapter')).replace(/\\/g, '/'),
    indexPath: path.relative(ROOT, path.join(rootInfo.dir, 'chapters.json')).replace(/\\/g, '/'),
    chapters: chapters.map((chapter, index) => ({
      code: chapter.chapterCode || chapter.code || '',
      title: chapter.title || ('Chapter ' + (index + 1)),
      order: typeof chapter.order === 'number' ? chapter.order : index + 1,
      estimatedMinutes: chapter.estimatedMinutes || chapter.durationMin || null,
      freePreview: Boolean(chapter.freePreview),
    })),
  };
}

function buildOutput() {
  const courses = listCourseRoots().map(buildCatalogEntry);
  const products = {};
  for (const course of courses) {
    if (!products[course.productSlug]) {
      products[course.productSlug] = {
        productSlug: course.productSlug,
        productName: course.productName,
        families: [],
        courses: [],
      };
    }
    const product = products[course.productSlug];
    if (!product.families.some((family) => family.id === course.family)) {
      product.families.push({ id: course.family, name: course.familyName });
    }
    product.courses.push({
      courseId: course.courseId,
      courseName: course.courseName,
      family: course.family,
      courseKey: course.courseKey,
      grade: course.grade,
      gradeSlug: course.gradeSlug,
      chapterCount: course.chapterCount,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    contentRoot: path.relative(ROOT, CONTENT_ROOT).replace(/\\/g, '/'),
    products,
    courses,
  };
}

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
const output = buildOutput();
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('WROTE ' + OUTPUT_PATH);
console.log('COURSES ' + output.courses.length);
