const fs = require('fs');

const chapterPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L8_CRISS_CROSS_2DIG.json';
const chaptersIndexPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json';
const manifestPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/manifest.json';
const svgPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/vedic/vm_criss_cross_2dig.svg';

const replacements = [
  ['–', '-'],
  ['—', '-'],
  ['×', 'x'],
  ['→', '->'],
  ['≥', '>=']
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
  <rect x="20" y="20" width="680" height="280" rx="24" fill="#FFFFFF" stroke="#FCD34D" stroke-width="2"/>
  <text x="42" y="58" fill="#78350F" font-size="26" font-family="Arial, sans-serif" font-weight="700">2-Digit Criss-Cross</text>
  <text x="42" y="84" fill="#475569" font-size="14" font-family="Arial, sans-serif">Solve in 3 steps: right vertical, cross, then left vertical.</text>

  <rect x="42" y="112" width="198" height="154" rx="18" fill="#FFFBEB" stroke="#FCD34D"/>
  <text x="60" y="142" fill="#B45309" font-size="18" font-family="Arial, sans-serif" font-weight="700">Step 1</text>
  <text x="60" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">23 x 14</text>
  <text x="60" y="204" fill="#92400E" font-size="24" font-family="Arial, sans-serif" font-weight="700">3 x 4 = 12</text>
  <text x="60" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Write 2, carry 1.</text>

  <rect x="262" y="112" width="198" height="154" rx="18" fill="#EFF6FF" stroke="#93C5FD"/>
  <text x="280" y="142" fill="#1D4ED8" font-size="18" font-family="Arial, sans-serif" font-weight="700">Step 2</text>
  <text x="280" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">Cross multiply</text>
  <text x="280" y="204" fill="#1E40AF" font-size="24" font-family="Arial, sans-serif" font-weight="700">2 x 4 + 3 x 1 + 1 = 12</text>
  <text x="280" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Write 2, carry 1.</text>

  <rect x="482" y="112" width="198" height="154" rx="18" fill="#ECFDF5" stroke="#86EFAC"/>
  <text x="500" y="142" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">Step 3</text>
  <text x="500" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">Left vertical</text>
  <text x="500" y="204" fill="#166534" font-size="24" font-family="Arial, sans-serif" font-weight="700">2 x 1 + 1 = 3</text>
  <text x="500" y="234" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Final answer: 322.</text>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const vedicSymbols = manifest.categories?.vedic?.symbols || [];
if (!vedicSymbols.some((s) => s.id === 'vm_criss_cross_2dig')) {
  vedicSymbols.push({
    id: 'vm_criss_cross_2dig',
    href: '/math-svgs/vedic/vm_criss_cross_2dig.svg',
    tags: ['multiplication', 'criss-cross', '2-digit', 'grade 4']
  });
}
manifest.categories.vedic.symbols = vedicSymbols;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

let chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, ''));
chapter = fixText(chapter);
chapter.chapterCode = 'VM_G4_L8_CRISS_CROSS_2DIG';
chapter.courseId = 'vedic_math_g4';
chapter.title = 'Lesson 8: The X-Factor - Urdhva Criss-Cross Multiplication';
chapter.visualLibrary = [
  {
    visualId: 'vm_criss_cross_2dig',
    kind: 'svg',
    asset: 'vm_criss_cross_2dig.svg',
    title: '2-Digit Criss-Cross Pattern',
    caption: 'Use the 3-step vertical-crosswise pattern from right to left.'
  }
];

const visualByGroup = {
  A: { title: 'The X pattern', caption: 'See the 3-step pattern: right vertical, cross, left vertical.' },
  B: { title: 'Step 1 units', caption: 'Start with units x units and carry if needed.' },
  C: { title: 'Step 2 cross', caption: 'Add the two diagonal products and any carry.' },
  D: { title: 'Step 3 tens', caption: 'Finish with tens x tens and the final carry.' },
  E: { title: 'Full 2-digit x 2-digit', caption: 'Put all 3 steps together into one answer.' },
  F: { title: 'Middle-step quiz', caption: 'Focus on the cross step before doing the full product.' },
  G: { title: 'Fill the steps', caption: 'Write each partial product in the correct order.' },
  H: { title: 'Speed round', caption: 'Run the full 3-step pattern quickly and accurately.' },
  I: { title: 'Carry challenge', caption: 'Manage carries correctly through all 3 steps.' }
};

for (const step of chapter.duolingoLessonArc?.sessionFlow || []) {
  const meta = visualByGroup[step.exerciseGroup];
  if (meta) {
    step.visual = {
      kind: 'svg',
      asset: 'vm_criss_cross_2dig.svg',
      title: meta.title,
      caption: meta.caption
    };
  }
  for (const ex of step.exercises || []) {
    ex.visual = {
      kind: 'svg',
      asset: 'vm_criss_cross_2dig.svg',
      title: meta ? meta.title : '2-Digit Criss-Cross Pattern',
      caption: meta ? meta.caption : 'Use the vertical-crosswise pattern step by step.'
    };
  }
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2), 'utf8');

let chaptersIndex = JSON.parse(fs.readFileSync(chaptersIndexPath, 'utf8').replace(/^\uFEFF/, ''));
const chapterMeta = (chaptersIndex.chapters || []).find((item) => item.chapterCode === 'VM_G4_L8_CRISS_CROSS_2DIG');
if (chapterMeta) {
  chapterMeta.title = 'The X-Factor - Urdhva Criss-Cross Multiplication';
}
fs.writeFileSync(chaptersIndexPath, JSON.stringify(chaptersIndex, null, 2), 'utf8');

console.log('UPDATED Chapter 8 and added visual coverage');
