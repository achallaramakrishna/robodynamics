const fs = require('fs');

const chapterPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L5_SUBT_BORROW_FREE.json';
const chaptersIndexPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json';
const manifestPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/manifest.json';
const svgPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/vedic/vm_borrow_free_subtraction.svg';

const replacements = [
  ['–', '-'],
  ['—', '-'],
  ['−', '-'],
  ['→', '->'],
  ['×', 'x'],
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
  <rect x="20" y="20" width="680" height="280" rx="24" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>
  <text x="42" y="58" fill="#0F172A" font-size="26" font-family="Arial, sans-serif" font-weight="700">Borrow-Free Subtraction</text>
  <text x="42" y="84" fill="#475569" font-size="14" font-family="Arial, sans-serif">Convert subtraction into complement + addition + adjustment. No borrowing needed.</text>

  <rect x="42" y="112" width="198" height="154" rx="18" fill="#EFF6FF" stroke="#93C5FD"/>
  <text x="60" y="142" fill="#1D4ED8" font-size="18" font-family="Arial, sans-serif" font-weight="700">Step 1: Complement</text>
  <text x="60" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">278 from 1000</text>
  <text x="60" y="204" fill="#1E40AF" font-size="24" font-family="Arial, sans-serif" font-weight="700">722</text>
  <text x="60" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">All from 9, last from 10.</text>

  <rect x="262" y="112" width="198" height="154" rx="18" fill="#ECFDF5" stroke="#86EFAC"/>
  <text x="280" y="142" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">Step 2: Add</text>
  <text x="280" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">534 + 722</text>
  <text x="280" y="204" fill="#166534" font-size="24" font-family="Arial, sans-serif" font-weight="700">1256</text>
  <text x="280" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Now it is only addition.</text>

  <rect x="482" y="112" width="198" height="154" rx="18" fill="#FFF7ED" stroke="#FDBA74"/>
  <text x="500" y="142" fill="#C2410C" font-size="18" font-family="Arial, sans-serif" font-weight="700">Step 3: Adjust</text>
  <text x="500" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">1256 - 1000</text>
  <text x="500" y="204" fill="#C2410C" font-size="24" font-family="Arial, sans-serif" font-weight="700">256</text>
  <text x="500" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Subtract the base once.</text>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const vedicSymbols = manifest.categories?.vedic?.symbols || [];
if (!vedicSymbols.some((s) => s.id === 'vm_borrow_free_subtraction')) {
  vedicSymbols.push({
    id: 'vm_borrow_free_subtraction',
    href: '/math-svgs/vedic/vm_borrow_free_subtraction.svg',
    tags: ['subtraction', 'borrow-free', 'complement', 'grade 4']
  });
}
manifest.categories.vedic.symbols = vedicSymbols;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

let chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, ''));
chapter = fixText(chapter);
chapter.chapterCode = 'VM_G4_L5_SUBT_BORROW_FREE';
chapter.courseId = 'vedic_math_g4';
chapter.title = 'Lesson 5: No More Borrowing! - Vedic Subtraction';

chapter.visualLibrary = [
  {
    visualId: 'vm_borrow_free_subtraction',
    kind: 'svg',
    asset: 'vm_borrow_free_subtraction.svg',
    title: 'Borrow-Free Subtraction',
    caption: 'Find the complement, add it, then subtract the base once.'
  }
];

const visualByGroup = {
  A: { title: 'Complement warm-up', caption: 'Refresh All From 9, Last From 10 before using the subtraction shortcut.' },
  B: { title: 'Convert and add', caption: 'Turn subtraction into complement + addition + base adjustment.' },
  C: { title: '3-digit borrow-free', caption: 'Use the same three-step method with base 1000.' },
  D: { title: '4-digit borrow-free', caption: 'Scale the method up to base 10000 without borrowing.' },
  E: { title: 'Money subtraction', caption: 'The same complement method works in rupee word problems.' },
  F: { title: 'Measurement subtraction', caption: 'Use complement thinking for grams, litres, and centimetres too.' },
  G: { title: 'Mixed speed drill', caption: 'Pick the right base fast, then complement and adjust.' },
  H: { title: 'Fill the steps', caption: 'Write complement, sum, and final adjustment in order.' },
  I: { title: 'Multi-step challenge', caption: 'Apply the borrow-free method twice inside one story problem.' }
};

for (const step of chapter.duolingoLessonArc?.sessionFlow || []) {
  const meta = visualByGroup[step.exerciseGroup];
  if (meta) {
    step.visual = {
      kind: 'svg',
      asset: 'vm_borrow_free_subtraction.svg',
      title: meta.title,
      caption: meta.caption
    };
  }
  for (const ex of step.exercises || []) {
    ex.visual = {
      kind: 'svg',
      asset: 'vm_borrow_free_subtraction.svg',
      title: meta ? meta.title : 'Borrow-Free Subtraction',
      caption: meta ? meta.caption : 'Use complement, add, then adjust the base.'
    };
  }
}

for (const step of chapter.teachingScript || []) {
  const meta = visualByGroup[step.exerciseGroup];
  step.visual = {
    kind: 'svg',
    asset: 'vm_borrow_free_subtraction.svg',
    title: meta ? meta.title : 'Borrow-Free Subtraction',
    caption: meta ? meta.caption : 'Use complement, add, then adjust the base.'
  };
}

for (const beat of chapter.screenplay || []) {
  const meta = visualByGroup[beat.exerciseGroup];
  beat.visual = {
    kind: 'svg',
    asset: 'vm_borrow_free_subtraction.svg',
    title: meta ? meta.title : 'Borrow-Free Subtraction',
    caption: meta ? meta.caption : 'Use complement, add, then adjust the base.'
  };
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2), 'utf8');

let chaptersIndex = JSON.parse(fs.readFileSync(chaptersIndexPath, 'utf8').replace(/^\uFEFF/, ''));
chaptersIndex = fixText(chaptersIndex);
const chapterMeta = (chaptersIndex.chapters || []).find((item) => item.chapterCode === 'VM_G4_L5_SUBT_BORROW_FREE');
if (chapterMeta) {
  chapterMeta.title = 'No More Borrowing! - Vedic Subtraction';
  chapterMeta.subtopics = [
    'Review: All From 9, Last From 10',
    'Convert and add - the borrow-free method',
    '3-digit subtraction without borrowing'
  ];
  chapterMeta.learningGoals = [
    'Apply All From 9, Last From 10 to convert subtraction into addition',
    'Solve 3-digit and 4-digit subtraction without borrowing',
    'Use the same method in money and measurement word problems'
  ];
}
fs.writeFileSync(chaptersIndexPath, JSON.stringify(chaptersIndex, null, 2), 'utf8');

console.log('UPDATED Chapter 5, fixed encoding, and added visual coverage');
