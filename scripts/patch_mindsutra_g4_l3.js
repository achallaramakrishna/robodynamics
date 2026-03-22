const fs = require('fs');

const chapterPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L3_DOUBLING_HALVING.json';
const chaptersIndexPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapters.json';
const manifestPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/manifest.json';
const svgPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/vedic/vm_doubling_halving.svg';

const replacements = [
  ['–', '-'],
  ['—', '-'],
  ['”', '-'],
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
  <rect x="20" y="20" width="680" height="280" rx="24" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
  <text x="42" y="58" fill="#0F172A" font-size="26" font-family="Arial, sans-serif" font-weight="700">Double Fast, Half Fast</text>
  <text x="42" y="84" fill="#475569" font-size="14" font-family="Arial, sans-serif">Use doubling chains for x4, x8, x16 and reverse the chain to halve quickly.</text>

  <rect x="42" y="112" width="198" height="154" rx="18" fill="#EEF2FF" stroke="#A5B4FC"/>
  <text x="60" y="142" fill="#3730A3" font-size="18" font-family="Arial, sans-serif" font-weight="700">Double-Double = x4</text>
  <rect x="60" y="164" width="42" height="42" rx="12" fill="#C7D2FE"/>
  <rect x="126" y="164" width="42" height="42" rx="12" fill="#A5B4FC"/>
  <rect x="192" y="164" width="42" height="42" rx="12" fill="#818CF8"/>
  <text x="81" y="191" text-anchor="middle" fill="#312E81" font-size="20" font-family="Arial, sans-serif" font-weight="700">23</text>
  <text x="147" y="191" text-anchor="middle" fill="#312E81" font-size="20" font-family="Arial, sans-serif" font-weight="700">46</text>
  <text x="213" y="191" text-anchor="middle" fill="#FFFFFF" font-size="20" font-family="Arial, sans-serif" font-weight="700">92</text>
  <path d="M102 185H122" stroke="#6366F1" stroke-width="4" stroke-linecap="round"/>
  <path d="M168 185H188" stroke="#6366F1" stroke-width="4" stroke-linecap="round"/>
  <text x="111" y="159" text-anchor="middle" fill="#4338CA" font-size="12" font-family="Arial, sans-serif" font-weight="700">x2</text>
  <text x="177" y="159" text-anchor="middle" fill="#4338CA" font-size="12" font-family="Arial, sans-serif" font-weight="700">x2</text>
  <text x="60" y="230" fill="#475569" font-size="14" font-family="Arial, sans-serif">23 -> 46 -> 92</text>
  <text x="60" y="250" fill="#475569" font-size="14" font-family="Arial, sans-serif">Two doubles give x4.</text>

  <rect x="262" y="112" width="198" height="154" rx="18" fill="#ECFDF5" stroke="#86EFAC"/>
  <text x="280" y="142" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">Triple Double = x8</text>
  <rect x="280" y="164" width="36" height="42" rx="12" fill="#BBF7D0"/>
  <rect x="336" y="164" width="36" height="42" rx="12" fill="#86EFAC"/>
  <rect x="392" y="164" width="36" height="42" rx="12" fill="#4ADE80"/>
  <rect x="448" y="164" width="36" height="42" rx="12" fill="#16A34A"/>
  <text x="298" y="191" text-anchor="middle" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">15</text>
  <text x="354" y="191" text-anchor="middle" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">30</text>
  <text x="410" y="191" text-anchor="middle" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">60</text>
  <text x="466" y="191" text-anchor="middle" fill="#FFFFFF" font-size="18" font-family="Arial, sans-serif" font-weight="700">120</text>
  <path d="M316 185H332" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
  <path d="M372 185H388" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
  <path d="M428 185H444" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
  <text x="324" y="159" text-anchor="middle" fill="#15803D" font-size="12" font-family="Arial, sans-serif" font-weight="700">x2</text>
  <text x="380" y="159" text-anchor="middle" fill="#15803D" font-size="12" font-family="Arial, sans-serif" font-weight="700">x2</text>
  <text x="436" y="159" text-anchor="middle" fill="#15803D" font-size="12" font-family="Arial, sans-serif" font-weight="700">x2</text>
  <text x="280" y="230" fill="#475569" font-size="14" font-family="Arial, sans-serif">15 -> 30 -> 60 -> 120</text>
  <text x="280" y="250" fill="#475569" font-size="14" font-family="Arial, sans-serif">Three doubles give x8.</text>

  <rect x="482" y="112" width="198" height="154" rx="18" fill="#FFF7ED" stroke="#FDBA74"/>
  <text x="500" y="142" fill="#9A3412" font-size="18" font-family="Arial, sans-serif" font-weight="700">Halving Runs Backward</text>
  <rect x="500" y="164" width="42" height="42" rx="12" fill="#FED7AA"/>
  <rect x="566" y="164" width="42" height="42" rx="12" fill="#FDBA74"/>
  <rect x="632" y="164" width="42" height="42" rx="12" fill="#FB923C"/>
  <text x="521" y="191" text-anchor="middle" fill="#9A3412" font-size="20" font-family="Arial, sans-serif" font-weight="700">96</text>
  <text x="587" y="191" text-anchor="middle" fill="#9A3412" font-size="20" font-family="Arial, sans-serif" font-weight="700">48</text>
  <text x="653" y="191" text-anchor="middle" fill="#FFFFFF" font-size="20" font-family="Arial, sans-serif" font-weight="700">24</text>
  <path d="M542 185H562" stroke="#F97316" stroke-width="4" stroke-linecap="round"/>
  <path d="M608 185H628" stroke="#F97316" stroke-width="4" stroke-linecap="round"/>
  <text x="551" y="159" text-anchor="middle" fill="#C2410C" font-size="12" font-family="Arial, sans-serif" font-weight="700">/2</text>
  <text x="617" y="159" text-anchor="middle" fill="#C2410C" font-size="12" font-family="Arial, sans-serif" font-weight="700">/2</text>
  <text x="500" y="230" fill="#475569" font-size="14" font-family="Arial, sans-serif">96 -> 48 -> 24</text>
  <text x="500" y="250" fill="#475569" font-size="14" font-family="Arial, sans-serif">Halving undoes doubling.</text>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const vedicSymbols = manifest.categories?.vedic?.symbols || [];
if (!vedicSymbols.some((s) => s.id === 'vm_doubling_halving')) {
  vedicSymbols.push({
    id: 'vm_doubling_halving',
    href: '/math-svgs/vedic/vm_doubling_halving.svg',
    tags: ['doubling', 'halving', 'x4', 'x8', 'x16', 'grade 4']
  });
}
manifest.categories.vedic.symbols = vedicSymbols;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

let chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, ''));
chapter = fixText(chapter);
chapter.chapterCode = 'VM_G4_L3_DOUBLING_HALVING';
chapter.courseId = 'vedic_math_g4';
chapter.title = 'Lesson 3: Double Fast, Half Fast - Multiplication Secrets';

chapter.visualLibrary = [
  {
    visualId: 'vm_doubling_halving',
    kind: 'svg',
    asset: 'vm_doubling_halving.svg',
    title: 'Doubling and Halving Chains',
    caption: 'See how repeated doubling builds x4, x8, and x16, and how halving runs the same chain backward.'
  }
];

const visualByGroup = {
  A: { title: 'Single-digit doubles', caption: 'Build instant recall by spotting each double on the chain.' },
  B: { title: 'Split and double', caption: 'Double the tens and units separately, then combine.' },
  C: { title: 'Halving even numbers', caption: 'Halving runs the doubling chain backward in clean steps.' },
  D: { title: 'Multiply by 4', caption: 'Double once, then double again to get x4.' },
  E: { title: 'Multiply by 8', caption: 'Three quick doubles turn any number into x8.' },
  F: { title: 'Spot the shortcut', caption: 'Use the chain to decide whether the product matches x4 or x8.' },
  G: { title: 'Fill the x8 chain', caption: 'Complete the missing middle step in the doubling ladder.' },
  H: { title: 'Mixed doubling and halving', caption: 'Switch between forward and backward chain moves.' },
  I: { title: 'Multiply by 16', caption: 'Four doubles extend the same pattern to x16.' }
};

for (const step of chapter.duolingoLessonArc?.sessionFlow || []) {
  const meta = visualByGroup[step.exerciseGroup];
  if (meta) {
    step.visual = {
      kind: 'svg',
      asset: 'vm_doubling_halving.svg',
      title: meta.title,
      caption: meta.caption
    };
  }
  for (const ex of step.exercises || []) {
    ex.visual = {
      kind: 'svg',
      asset: 'vm_doubling_halving.svg',
      title: meta ? meta.title : 'Doubling and Halving Chains',
      caption: meta ? meta.caption : 'Follow the doubling or halving chain to solve quickly.'
    };
  }
}

for (const step of chapter.teachingScript || []) {
  const meta = visualByGroup[step.exerciseGroup];
  step.visual = {
    kind: 'svg',
    asset: 'vm_doubling_halving.svg',
    title: meta ? meta.title : 'Doubling and Halving Chains',
    caption: meta ? meta.caption : 'Follow the doubling or halving chain to solve quickly.'
  };
}

for (const beat of chapter.screenplay || []) {
  const meta = visualByGroup[beat.exerciseGroup];
  beat.visual = {
    kind: 'svg',
    asset: 'vm_doubling_halving.svg',
    title: meta ? meta.title : 'Doubling and Halving Chains',
    caption: meta ? meta.caption : 'Follow the doubling or halving chain to solve quickly.'
  };
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2), 'utf8');

let chaptersIndex = JSON.parse(fs.readFileSync(chaptersIndexPath, 'utf8').replace(/^\uFEFF/, ''));
chaptersIndex = fixText(chaptersIndex);
const chapterMeta = (chaptersIndex.chapters || []).find((item) => item.chapterCode === 'VM_G4_L3_DOUBLING_HALVING');
if (chapterMeta) {
  chapterMeta.title = 'Double Fast, Half Fast - Multiplication Secrets';
  chapterMeta.subtopics = [
    'Doubling chain',
    'Halving chain',
    'x4 = double-double',
    'x8 = double-double-double'
  ];
  chapterMeta.learningGoals = [
    'Double and halve 2-digit and simple 3-digit numbers instantly',
    'Multiply by 4 using the double-double shortcut',
    'Multiply by 8 and 16 using repeated doubling'
  ];
  chapterMeta.exerciseFlow = [
    { exerciseGroup: 'A', subtopic: 'Doubling 1-digit numbers' },
    { exerciseGroup: 'B', subtopic: 'Doubling 2-digit numbers' },
    { exerciseGroup: 'C', subtopic: 'Halving even numbers' },
    { exerciseGroup: 'D', subtopic: 'Multiply by 4 (double-double)' },
    { exerciseGroup: 'E', subtopic: 'Multiply by 8 (triple double)' },
    { exerciseGroup: 'F', subtopic: 'MCQ: pick the shortcut' },
    { exerciseGroup: 'G', subtopic: 'Fill-the-step: x8 chain' },
    { exerciseGroup: 'H', subtopic: 'Mixed doubling and halving' },
    { exerciseGroup: 'I', subtopic: 'Challenge: x16' }
  ];
}
fs.writeFileSync(chaptersIndexPath, JSON.stringify(chaptersIndex, null, 2), 'utf8');

console.log('UPDATED Chapter 3, fixed encoding, and added visual coverage');
