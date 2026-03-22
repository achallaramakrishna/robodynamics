const fs = require('fs');

const chapterPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L7_NEAR_100.json';
const chaptersIndexPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json';
const manifestPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/manifest.json';
const svgPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/vedic/vm_near_100.svg';

const replacements = [
  ['–', '-'],
  ['—', '-'],
  ['−', '-'],
  ['→', '->'],
  ['≥', '>='],
  ['×', 'x']
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
  <rect x="20" y="20" width="680" height="280" rx="24" fill="#FFFFFF" stroke="#86EFAC" stroke-width="2"/>
  <text x="42" y="58" fill="#14532D" font-size="26" font-family="Arial, sans-serif" font-weight="700">Near 100 Magic</text>
  <text x="42" y="84" fill="#475569" font-size="14" font-family="Arial, sans-serif">See each number as a small distance from 100, then adjust the total quickly.</text>

  <rect x="42" y="112" width="290" height="154" rx="18" fill="#ECFDF5" stroke="#86EFAC"/>
  <text x="60" y="142" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">Deficit Example</text>
  <text x="60" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">97 + 98</text>
  <text x="60" y="204" fill="#166534" font-size="22" font-family="Arial, sans-serif" font-weight="700">200 - 3 - 2 = 195</text>
  <text x="60" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Both numbers are below 100, so subtract both deficits.</text>

  <rect x="388" y="112" width="290" height="154" rx="18" fill="#EFF6FF" stroke="#93C5FD"/>
  <text x="406" y="142" fill="#1D4ED8" font-size="18" font-family="Arial, sans-serif" font-weight="700">Surplus Example</text>
  <text x="406" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">103 + 104</text>
  <text x="406" y="204" fill="#1E40AF" font-size="22" font-family="Arial, sans-serif" font-weight="700">200 + 3 + 4 = 207</text>
  <text x="406" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Both numbers are above 100, so add both surpluses.</text>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const vedicSymbols = manifest.categories?.vedic?.symbols || [];
if (!vedicSymbols.some((s) => s.id === 'vm_near_100')) {
  vedicSymbols.push({
    id: 'vm_near_100',
    href: '/math-svgs/vedic/vm_near_100.svg',
    tags: ['near 100', 'deviation', 'addition', 'subtraction', 'grade 4']
  });
}
manifest.categories.vedic.symbols = vedicSymbols;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

let chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, ''));
chapter = fixText(chapter);
chapter.chapterCode = 'VM_G4_L7_NEAR_100';
chapter.courseId = 'vedic_math_g4';
chapter.title = 'Lesson 7: Near 100 Magic - Add and Subtract Close Numbers';
chapter.visualLibrary = [
  {
    visualId: 'vm_near_100',
    kind: 'svg',
    asset: 'vm_near_100.svg',
    title: 'Near 100 Deviation Method',
    caption: 'Use deficits and surpluses around 100 to add or subtract quickly.'
  }
];

const visualByGroup = {
  A: { title: 'Deviation from 100', caption: 'Check whether the number is below or above 100 and measure the gap.' },
  B: { title: 'Adding near 100', caption: 'Start from 200 and adjust by both deviations.' },
  C: { title: 'Subtract from 100', caption: 'Use All-From-9 Last-From-10 for fast subtraction from 100.' },
  D: { title: 'Mixed near 100', caption: 'Choose addition or subtraction quickly from the situation.' },
  E: { title: 'Spot the correct answer', caption: 'Use the deviation method mentally to eliminate wrong options.' },
  F: { title: 'Step-by-step near 100', caption: 'Write both deviations, combine them, and adjust from 200.' },
  G: { title: 'Near 100 word problems', caption: 'Use the same deviation trick in scores and shopping totals.' },
  H: { title: 'Speed drill', caption: 'Apply the near-100 shortcut in one quick mental pass.' },
  I: { title: 'Near 1000 extension', caption: 'The same idea works with deviations from 1000.' }
};

for (const step of chapter.duolingoLessonArc?.sessionFlow || []) {
  const meta = visualByGroup[step.exerciseGroup];
  if (step.exerciseGroup === 'F') {
    step.boardDemo = '96 + 97: deviations are -4 and -3. Start from 200. 200 - 4 - 3 = 193. Show both deficits clearly on the board.';
  }
  if (meta) {
    step.visual = {
      kind: 'svg',
      asset: 'vm_near_100.svg',
      title: meta.title,
      caption: meta.caption
    };
  }
  for (const ex of step.exercises || []) {
    ex.visual = {
      kind: 'svg',
      asset: 'vm_near_100.svg',
      title: meta ? meta.title : 'Near 100 Deviation Method',
      caption: meta ? meta.caption : 'Use deviations around the base to solve mentally.'
    };
  }
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2), 'utf8');

let chaptersIndex = JSON.parse(fs.readFileSync(chaptersIndexPath, 'utf8').replace(/^\uFEFF/, ''));
const chapterMeta = (chaptersIndex.chapters || []).find((item) => item.chapterCode === 'VM_G4_L7_NEAR_100');
if (chapterMeta) {
  chapterMeta.title = 'Near 100 Magic - Add and Subtract Close Numbers';
}
fs.writeFileSync(chaptersIndexPath, JSON.stringify(chaptersIndex, null, 2), 'utf8');

console.log('UPDATED Chapter 7, fixed lesson mismatch, and added visual coverage');
