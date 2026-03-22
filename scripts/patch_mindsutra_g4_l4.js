const fs = require('fs');

const chapterPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L4_MULT_BY_11.json';
const chaptersIndexPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json';
const manifestPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/manifest.json';
const svgPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/vedic/vm_mult_by_11.svg';

const replacements = [
  ['–', '-'],
  ['—', '-'],
  ['�-', '-'],
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
  <rect width="720" height="320" rx="28" fill="#FAF5FF"/>
  <rect x="20" y="20" width="680" height="280" rx="24" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
  <text x="42" y="58" fill="#581C87" font-size="26" font-family="Arial, sans-serif" font-weight="700">The 11 Trick</text>
  <text x="42" y="84" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Keep the outer digits. Put the sum in the middle. If the sum is 10 or more, carry 1 left.</text>

  <rect x="42" y="112" width="290" height="154" rx="18" fill="#F5F3FF" stroke="#C4B5FD"/>
  <text x="60" y="142" fill="#6D28D9" font-size="18" font-family="Arial, sans-serif" font-weight="700">No Carry Example</text>
  <text x="60" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">32 x 11</text>
  <rect x="60" y="190" width="44" height="44" rx="12" fill="#DDD6FE"/>
  <rect x="132" y="190" width="44" height="44" rx="12" fill="#F59E0B"/>
  <rect x="204" y="190" width="44" height="44" rx="12" fill="#DDD6FE"/>
  <text x="82" y="218" text-anchor="middle" fill="#5B21B6" font-size="22" font-family="Arial, sans-serif" font-weight="700">3</text>
  <text x="154" y="218" text-anchor="middle" fill="#FFFFFF" font-size="22" font-family="Arial, sans-serif" font-weight="700">5</text>
  <text x="226" y="218" text-anchor="middle" fill="#5B21B6" font-size="22" font-family="Arial, sans-serif" font-weight="700">2</text>
  <text x="154" y="185" text-anchor="middle" fill="#92400E" font-size="12" font-family="Arial, sans-serif" font-weight="700">3 + 2 = 5</text>
  <text x="60" y="252" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Answer: 352</text>

  <rect x="388" y="112" width="290" height="154" rx="18" fill="#FFF7ED" stroke="#FDBA74"/>
  <text x="406" y="142" fill="#C2410C" font-size="18" font-family="Arial, sans-serif" font-weight="700">Carry Example</text>
  <text x="406" y="172" fill="#111827" font-size="18" font-family="Arial, sans-serif">76 x 11</text>
  <rect x="406" y="190" width="44" height="44" rx="12" fill="#FED7AA"/>
  <rect x="478" y="190" width="44" height="44" rx="12" fill="#F97316"/>
  <rect x="550" y="190" width="44" height="44" rx="12" fill="#FED7AA"/>
  <text x="428" y="218" text-anchor="middle" fill="#9A3412" font-size="22" font-family="Arial, sans-serif" font-weight="700">8</text>
  <text x="500" y="218" text-anchor="middle" fill="#FFFFFF" font-size="22" font-family="Arial, sans-serif" font-weight="700">3</text>
  <text x="572" y="218" text-anchor="middle" fill="#9A3412" font-size="22" font-family="Arial, sans-serif" font-weight="700">6</text>
  <text x="500" y="185" text-anchor="middle" fill="#C2410C" font-size="12" font-family="Arial, sans-serif" font-weight="700">7 + 6 = 13 -> keep 3</text>
  <text x="428" y="252" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Carry 1 to the left: 7 becomes 8</text>
  <text x="428" y="272" fill="#6B7280" font-size="14" font-family="Arial, sans-serif">Answer: 836</text>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const vedicSymbols = manifest.categories?.vedic?.symbols || [];
if (!vedicSymbols.some((s) => s.id === 'vm_mult_by_11')) {
  vedicSymbols.push({
    id: 'vm_mult_by_11',
    href: '/math-svgs/vedic/vm_mult_by_11.svg',
    tags: ['multiplication', '11', 'split-add', 'carry', 'grade 4']
  });
}
manifest.categories.vedic.symbols = vedicSymbols;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

let chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, ''));
chapter = fixText(chapter);
chapter.chapterCode = 'VM_G4_L4_MULT_BY_11';
chapter.courseId = 'vedic_math_g4';
chapter.title = 'Lesson 4: The 11-Trick - Multiply Any 2-Digit Number by 11';

chapter.visualLibrary = [
  {
    visualId: 'vm_mult_by_11',
    kind: 'svg',
    asset: 'vm_mult_by_11.svg',
    title: 'The 11 Trick',
    caption: 'Keep outer digits, insert the middle sum, and carry left when the sum reaches 10 or more.'
  }
];

const visualByGroup = {
  A: { title: '11-trick with no carry', caption: 'Keep the outer digits and place their sum in the middle.' },
  B: { title: '11-trick with carry', caption: 'If the sum is 10 or more, keep the units digit and carry 1 left.' },
  C: { title: 'Carry prediction', caption: 'Check the digit sum first to decide whether a carry will happen.' },
  D: { title: '3-digit x11', caption: 'Use adjacent pair sums across the whole number.' },
  E: { title: 'Spot the product', caption: 'Use the 11-trick pattern to eliminate wrong options fast.' },
  F: { title: 'Fill the carry steps', caption: 'Write the sum, middle digit, and left carry in order.' },
  G: { title: 'Mixed x11 practice', caption: 'Some examples carry and some do not - check the sum first.' },
  H: { title: 'Speed x11', caption: 'Run the split-and-insert rule in one quick mental pass.' },
  I: { title: '4-digit x11', caption: 'Extend the same adjacent-pair rule to longer numbers.' }
};

for (const step of chapter.duolingoLessonArc?.sessionFlow || []) {
  const meta = visualByGroup[step.exerciseGroup];
  if (meta) {
    step.visual = {
      kind: 'svg',
      asset: 'vm_mult_by_11.svg',
      title: meta.title,
      caption: meta.caption
    };
  }
  for (const ex of step.exercises || []) {
    ex.visual = {
      kind: 'svg',
      asset: 'vm_mult_by_11.svg',
      title: meta ? meta.title : 'The 11 Trick',
      caption: meta ? meta.caption : 'Use the 11-trick pattern to place each digit correctly.'
    };
  }
}

for (const step of chapter.teachingScript || []) {
  const meta = visualByGroup[step.exerciseGroup];
  step.visual = {
    kind: 'svg',
    asset: 'vm_mult_by_11.svg',
    title: meta ? meta.title : 'The 11 Trick',
    caption: meta ? meta.caption : 'Use the 11-trick pattern to place each digit correctly.'
  };
}

for (const beat of chapter.screenplay || []) {
  const meta = visualByGroup[beat.exerciseGroup];
  beat.visual = {
    kind: 'svg',
    asset: 'vm_mult_by_11.svg',
    title: meta ? meta.title : 'The 11 Trick',
    caption: meta ? meta.caption : 'Use the 11-trick pattern to place each digit correctly.'
  };
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2), 'utf8');

let chaptersIndex = JSON.parse(fs.readFileSync(chaptersIndexPath, 'utf8').replace(/^\uFEFF/, ''));
chaptersIndex = fixText(chaptersIndex);
const chapterMeta = (chaptersIndex.chapters || []).find((item) => item.chapterCode === 'VM_G4_L4_MULT_BY_11');
if (chapterMeta) {
  chapterMeta.title = 'The 11-Trick - Multiply Any 2-Digit Number by 11';
  chapterMeta.subtopics = [
    'Split-and-add rule',
    'Carry rule for sum >= 10',
    '3-digit x 11'
  ];
  chapterMeta.learningGoals = [
    'Apply the split-and-add rule for any 2-digit x 11',
    'Handle carry when the middle sum reaches 10 or more',
    'Extend the same pattern to 3-digit and 4-digit x 11'
  ];
}
fs.writeFileSync(chaptersIndexPath, JSON.stringify(chaptersIndex, null, 2), 'utf8');

console.log('UPDATED Chapter 4, fixed encoding, and added visual coverage');
