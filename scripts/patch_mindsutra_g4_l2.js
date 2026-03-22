const fs = require('fs');
const path = require('path');

const chapterPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L2_TABLES_11_TO_19.json';
const manifestPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/manifest.json';
const svgPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/vedic/vm_tables_11_19.svg';

const replacements = [
  ['â€“', '–'],
  ['â€”', '—'],
  ['âˆ’', '−'],
  ['Ã—', '×'],
  ['â†’', '→'],
  ['â‰¥', '≥'],
  ['Ã·', '÷']
];

function fixText(value) {
  if (typeof value === 'string') {
    let out = value;
    for (const [a, b] of replacements) out = out.split(a).join(b);
    return out;
  }
  if (Array.isArray(value)) return value.map(fixText);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = fixText(v);
    return out;
  }
  return value;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" fill="none">
  <rect width="640" height="280" rx="24" fill="#F8FAFC"/>
  <rect x="24" y="24" width="592" height="232" rx="20" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
  <text x="40" y="56" fill="#0F172A" font-size="24" font-family="Arial, sans-serif" font-weight="700">Lightning Tables 11–19</text>
  <text x="40" y="82" fill="#475569" font-size="14" font-family="Arial, sans-serif">Use the 11-trick or build the next row by adding the same number again.</text>

  <rect x="40" y="106" width="168" height="118" rx="18" fill="#EEF2FF" stroke="#A5B4FC"/>
  <text x="58" y="136" fill="#3730A3" font-size="18" font-family="Arial, sans-serif" font-weight="700">11-Trick</text>
  <text x="58" y="168" fill="#1E293B" font-size="22" font-family="Arial, sans-serif">11 × 23 = 253</text>
  <text x="58" y="196" fill="#475569" font-size="14" font-family="Arial, sans-serif">Keep 2 and 3 outside.</text>
  <text x="58" y="214" fill="#475569" font-size="14" font-family="Arial, sans-serif">Put 2 + 3 = 5 in the middle.</text>

  <rect x="236" y="106" width="168" height="118" rx="18" fill="#ECFDF5" stroke="#86EFAC"/>
  <text x="254" y="136" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">Progressive Addition</text>
  <text x="254" y="168" fill="#1E293B" font-size="18" font-family="Arial, sans-serif">12, 24, 36, 48, 60</text>
  <text x="254" y="196" fill="#475569" font-size="14" font-family="Arial, sans-serif">Each step adds 12 again.</text>
  <path d="M254 206H386" stroke="#22C55E" stroke-width="3" stroke-dasharray="6 6"/>

  <rect x="432" y="106" width="168" height="118" rx="18" fill="#FFF7ED" stroke="#FDBA74"/>
  <text x="450" y="136" fill="#9A3412" font-size="18" font-family="Arial, sans-serif" font-weight="700">Carry Example</text>
  <text x="450" y="168" fill="#1E293B" font-size="20" font-family="Arial, sans-serif">11 × 58 = 638</text>
  <text x="450" y="196" fill="#475569" font-size="14" font-family="Arial, sans-serif">5 + 8 = 13 → middle 3</text>
  <text x="450" y="214" fill="#475569" font-size="14" font-family="Arial, sans-serif">Carry 1 to 5 → 6</text>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const vedicSymbols = manifest.categories?.vedic?.symbols || [];
if (!vedicSymbols.some((s) => s.id === 'vm_tables_11_19')) {
  vedicSymbols.push({
    id: 'vm_tables_11_19',
    href: '/math-svgs/vedic/vm_tables_11_19.svg',
    tags: ['tables', '11-19', 'ekadhikena', 'progressive addition', 'grade 4']
  });
}
manifest.categories.vedic.symbols = vedicSymbols;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

let data = JSON.parse(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, ''));
data = fixText(data);
data.chapterCode = 'VM_G4_L2_TABLES_11_TO_19';
data.courseId = 'vedic_math_g4';

data.visualLibrary = [
  {
    visualId: 'eleven_trick',
    kind: 'svg',
    asset: 'eleven_trick.svg',
    title: 'The Eleven Trick',
    caption: 'Keep the outer digits and place their sum in the middle.'
  },
  {
    visualId: 'vm_tables_11_19',
    kind: 'svg',
    asset: 'vm_tables_11_19.svg',
    title: 'Lightning Tables 11–19',
    caption: 'Build the next row by adding the same table number again.'
  }
];

const visualByGroup = {
  A: { asset: 'eleven_trick.svg', title: 'The Eleven Trick', caption: 'Keep the outer digits and place their sum in the middle.' },
  B: { asset: 'vm_tables_11_19.svg', title: 'Table of 12 chain', caption: 'Add 12 each time to build the next row.' },
  C: { asset: 'vm_tables_11_19.svg', title: 'Tables 13 to 15', caption: 'Each table grows by the same number every row.' },
  D: { asset: 'vm_tables_11_19.svg', title: 'Tables 16 to 19', caption: 'The same chain method works for bigger teen tables.' },
  E: { asset: 'vm_tables_11_19.svg', title: 'Spot the product', caption: 'Use the chain to verify the correct product.' },
  F: { asset: 'eleven_trick.svg', title: 'Eleven Trick with carry', caption: 'If the middle sum is 10 or more, carry 1 to the left digit.' },
  G: { asset: 'vm_tables_11_19.svg', title: 'Mixed tables 11–19', caption: 'Choose the fastest method for each table.' },
  H: { asset: 'vm_tables_11_19.svg', title: 'Speed tables race', caption: 'Recall the product quickly using the pattern or the chain.' },
  I: { asset: 'eleven_trick.svg', title: '3-digit times 11', caption: 'Extend the 11-trick by adding adjacent digit pairs.' }
};

for (const step of data.duolingoLessonArc.sessionFlow || []) {
  const meta = visualByGroup[step.exerciseGroup];
  if (meta) step.visual = { kind: 'svg', asset: meta.asset, title: meta.title, caption: meta.caption };
  for (const ex of step.exercises || []) {
    if (meta) ex.visual = { kind: 'svg', asset: meta.asset, title: meta.title, caption: meta.caption };
  }
}

for (const step of data.teachingScript || []) {
  const meta = visualByGroup[step.exerciseGroup];
  if (meta && !step.visual) step.visual = { kind: 'svg', asset: meta.asset, title: meta.title, caption: meta.caption };
}

for (const beat of data.screenplay || []) {
  const meta = visualByGroup[beat.exerciseGroup];
  if (meta) beat.visual = { kind: 'svg', asset: meta.asset, title: meta.title, caption: meta.caption };
}

fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2), 'utf8');
console.log('UPDATED Chapter 2, fixed encoding, and added visual coverage');
