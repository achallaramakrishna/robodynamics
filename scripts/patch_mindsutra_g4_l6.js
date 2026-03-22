const fs = require('fs');

const chapterPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L6_MULT_BY_5_25.json';
const chaptersIndexPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json';
const manifestPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/manifest.json';
const svgPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/vedic/vm_mult_by_5_25.svg';

const replacements = [
  ['–', '-'],
  ['—', '-'],
  ['×', 'x'],
  ['→', '->'],
  ['≥', '>='],
  ['÷', '/']
];

function fixText(value) {
  if (typeof value === 'string') {
    let out = value;
    for (const [from, to] of replacements) out = out.split(from).join(to);
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

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320" fill="none">
  <rect width="720" height="320" rx="28" fill="#F8FAFC"/>
  <rect x="20" y="20" width="680" height="280" rx="24" fill="#FFFFFF" stroke="#F9A8D4" stroke-width="2"/>
  <text x="42" y="58" fill="#831843" font-size="26" font-family="Arial, sans-serif" font-weight="700">x5 and x25 in a Flash</text>
  <text x="42" y="84" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Use base multiplication: x5 = half then x10, and x25 = quarter then x100.</text>

  <rect x="42" y="112" width="290" height="154" rx="18" fill="#FDF2F8" stroke="#F9A8D4"/>
  <text x="60" y="142" fill="#BE185D" font-size="18" font-family="Arial, sans-serif" font-weight="700">x5 Shortcut</text>
  <text x="60" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">36 x 5</text>
  <text x="60" y="204" fill="#9D174D" font-size="24" font-family="Arial, sans-serif" font-weight="700">36 -> 18 -> 180</text>
  <text x="60" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Half the number, then multiply by 10.</text>

  <rect x="388" y="112" width="290" height="154" rx="18" fill="#EFF6FF" stroke="#93C5FD"/>
  <text x="406" y="142" fill="#1D4ED8" font-size="18" font-family="Arial, sans-serif" font-weight="700">x25 Shortcut</text>
  <text x="406" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">28 x 25</text>
  <text x="406" y="204" fill="#1E40AF" font-size="24" font-family="Arial, sans-serif" font-weight="700">28 -> 7 -> 700</text>
  <text x="406" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Quarter the number, then multiply by 100.</text>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const vedicSymbols = manifest.categories?.vedic?.symbols || [];
if (!vedicSymbols.some((s) => s.id === 'vm_mult_by_5_25')) {
  vedicSymbols.push({
    id: 'vm_mult_by_5_25',
    href: '/math-svgs/vedic/vm_mult_by_5_25.svg',
    tags: ['multiplication', 'x5', 'x25', 'base', 'grade 4']
  });
}
manifest.categories.vedic.symbols = vedicSymbols;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

let chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, ''));
chapter = fixText(chapter);
chapter.chapterCode = 'VM_G4_L6_MULT_BY_5_25';
chapter.courseId = 'vedic_math_g4';
chapter.title = 'Lesson 6: x5 and x25 in a Flash - Base Multiplication';

chapter.visualLibrary = [
  {
    visualId: 'vm_mult_by_5_25',
    kind: 'svg',
    asset: 'vm_mult_by_5_25.svg',
    title: 'x5 and x25 Shortcuts',
    caption: 'Use halving for x5 and quartering for x25 with base 10 or 100.'
  }
];

const visualByGroup = {
  A: { title: 'x5 with even numbers', caption: 'Half the number first, then multiply by 10.' },
  B: { title: 'x5 with odd numbers', caption: 'Multiply by 10 first, then halve to avoid fractions.' },
  C: { title: 'x25 with exact quarters', caption: 'Quarter the number first, then multiply by 100.' },
  D: { title: 'x25 with remainders', caption: 'Handle the quotient and leftover part separately, then combine.' },
  E: { title: 'x5 word problems', caption: 'Use the x5 shortcut in real-life contexts like scores and prices.' },
  F: { title: 'x25 word problems', caption: 'Use the x25 shortcut in coins, rows, and grouped quantities.' },
  G: { title: 'Spot the product', caption: 'Use the shortcut mentally to eliminate wrong options fast.' },
  H: { title: 'Fill the x25 steps', caption: 'Write quotient, remainder, product, and final sum in order.' },
  I: { title: 'x50 and x125 challenge', caption: 'Extend the same base-scaling idea to bigger multipliers.' }
};

for (const step of chapter.duolingoLessonArc?.sessionFlow || []) {
  const meta = visualByGroup[step.exerciseGroup];
  if (meta) {
    step.visual = {
      kind: 'svg',
      asset: 'vm_mult_by_5_25.svg',
      title: meta.title,
      caption: meta.caption
    };
  }
  for (const ex of step.exercises || []) {
    ex.visual = {
      kind: 'svg',
      asset: 'vm_mult_by_5_25.svg',
      title: meta ? meta.title : 'x5 and x25 Shortcuts',
      caption: meta ? meta.caption : 'Use halving or quartering first, then scale by the base.'
    };
  }
}

for (const step of chapter.teachingScript || []) {
  const meta = visualByGroup[step.exerciseGroup];
  step.visual = {
    kind: 'svg',
    asset: 'vm_mult_by_5_25.svg',
    title: meta ? meta.title : 'x5 and x25 Shortcuts',
    caption: meta ? meta.caption : 'Use halving or quartering first, then scale by the base.'
  };
}

for (const beat of chapter.screenplay || []) {
  const meta = visualByGroup[beat.exerciseGroup];
  beat.visual = {
    kind: 'svg',
    asset: 'vm_mult_by_5_25.svg',
    title: meta ? meta.title : 'x5 and x25 Shortcuts',
    caption: meta ? meta.caption : 'Use halving or quartering first, then scale by the base.'
  };
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2), 'utf8');

let chaptersIndex = JSON.parse(fs.readFileSync(chaptersIndexPath, 'utf8').replace(/^\uFEFF/, ''));
chaptersIndex = fixText(chaptersIndex);
const chapterMeta = (chaptersIndex.chapters || []).find((item) => item.chapterCode === 'VM_G4_L6_MULT_BY_5_25');
if (chapterMeta) {
  chapterMeta.title = 'x5 and x25 in a Flash - Base Multiplication';
  chapterMeta.subtopics = [
    'x5 = half then x10',
    'x25 = quarter then x100',
    'x125 extension'
  ];
  chapterMeta.learningGoals = [
    'Multiply by 5 using the half-then-x10 shortcut',
    'Multiply by 25 using the quarter-then-x100 shortcut',
    'Extend the same base idea to x50 and x125'
  ];
}
fs.writeFileSync(chaptersIndexPath, JSON.stringify(chaptersIndex, null, 2), 'utf8');

console.log('UPDATED Chapter 6, fixed encoding, and added visual coverage');
