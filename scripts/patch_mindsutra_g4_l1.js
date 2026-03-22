const fs = require('fs');
const path = require('path');

const chapterPath = 'C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json';
const manifestPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/manifest.json';
const svgPath = 'C:/roboworkspace/robodynamics/ai-tutor/web/public/math-svgs/vedic/vm_complements_whole.svg';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" fill="none">
  <rect width="640" height="280" rx="24" fill="#F8FAFC"/>
  <rect x="24" y="24" width="592" height="232" rx="20" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
  <text x="44" y="58" fill="#0F172A" font-size="24" font-family="Arial, sans-serif" font-weight="700">Completing the Whole</text>
  <text x="44" y="84" fill="#475569" font-size="14" font-family="Arial, sans-serif">Use the missing part to complete 10, 100, and 1000.</text>

  <rect x="44" y="108" width="164" height="108" rx="18" fill="#EEF2FF" stroke="#A5B4FC"/>
  <text x="62" y="138" fill="#3730A3" font-size="18" font-family="Arial, sans-serif" font-weight="700">To 10</text>
  <text x="62" y="170" fill="#1E293B" font-size="22" font-family="Arial, sans-serif">7 + 3 = 10</text>
  <text x="62" y="198" fill="#475569" font-size="14" font-family="Arial, sans-serif">3 is the missing part.</text>
  <circle cx="168" cy="166" r="18" fill="#C7D2FE"/>
  <text x="162" y="173" fill="#312E81" font-size="18" font-family="Arial, sans-serif" font-weight="700">3</text>

  <rect x="236" y="108" width="164" height="108" rx="18" fill="#ECFDF5" stroke="#86EFAC"/>
  <text x="254" y="138" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">To 100</text>
  <text x="254" y="170" fill="#1E293B" font-size="22" font-family="Arial, sans-serif">46 + 54 = 100</text>
  <text x="254" y="198" fill="#475569" font-size="14" font-family="Arial, sans-serif">54 completes the whole.</text>
  <circle cx="360" cy="166" r="22" fill="#BBF7D0"/>
  <text x="347" y="173" fill="#166534" font-size="18" font-family="Arial, sans-serif" font-weight="700">54</text>

  <rect x="428" y="108" width="164" height="108" rx="18" fill="#FFF7ED" stroke="#FDBA74"/>
  <text x="446" y="138" fill="#9A3412" font-size="18" font-family="Arial, sans-serif" font-weight="700">To 1000</text>
  <text x="446" y="170" fill="#1E293B" font-size="22" font-family="Arial, sans-serif">628 + 372 = 1000</text>
  <text x="446" y="198" fill="#475569" font-size="14" font-family="Arial, sans-serif">372 fills the gap.</text>
  <circle cx="552" cy="166" r="24" fill="#FED7AA"/>
  <text x="536" y="173" fill="#9A3412" font-size="18" font-family="Arial, sans-serif" font-weight="700">372</text>

  <path d="M214 162H228" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
  <path d="M406 162H420" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const vedicSymbols = manifest.categories?.vedic?.symbols || [];
if (!vedicSymbols.some((s) => s.id === 'vm_complements_whole')) {
  vedicSymbols.push({
    id: 'vm_complements_whole',
    href: '/math-svgs/vedic/vm_complements_whole.svg',
    tags: ['complement', 'make 10', 'make 100', 'make 1000', 'grade 4', 'whole number']
  });
}
manifest.categories.vedic.symbols = vedicSymbols;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8').replace(/^\uFEFF/, ''));
data.chapterCode = 'VM_G4_L1_FAST_ADDITION';
data.courseId = 'vedic_math_g4';

data.visualLibrary = [
  {
    visualId: 'vm_complements_whole',
    kind: 'svg',
    asset: 'vm_complements_whole.svg',
    title: 'Complements to 10, 100, and 1000',
    caption: 'Spot the missing part that completes the whole.'
  }
];

const visualByGroup = {
  A: { title: 'Complement to 10', caption: 'Find the missing part that completes 10.' },
  B: { title: 'Complement pairs to 10', caption: 'Pair each number with the partner that makes 10.' },
  C: { title: 'Make 10 fast', caption: 'Use the whole 10 and fill the missing gap.' },
  D: { title: 'Complement to 100', caption: 'Think 100 minus the number to find the missing part.' },
  E: { title: 'Complement to 1000', caption: 'Scale the same idea up to 1000.' },
  F: { title: 'Whole amount word problem', caption: 'The whole is known. Find the missing part left.' },
  G: { title: 'Speed drill to 10', caption: 'Answer quickly by spotting the missing part.' },
  H: { title: 'Speed drill to 100', caption: 'Complete 100 mentally in one quick step.' },
  I: { title: 'Big complement challenge', caption: 'The same whole-number pattern works on bigger numbers too.' }
};

for (const step of data.duolingoLessonArc.sessionFlow) {
  const meta = visualByGroup[step.exerciseGroup];
  if (meta) {
    step.visual = {
      kind: 'svg',
      asset: 'vm_complements_whole.svg',
      title: meta.title,
      caption: meta.caption
    };
  }
  for (const ex of step.exercises || []) {
    ex.visual = {
      kind: 'svg',
      asset: 'vm_complements_whole.svg',
      title: meta ? meta.title : 'Completing the Whole',
      caption: meta ? meta.caption : 'Find the missing part that completes the whole.'
    };
  }
}

for (const step of data.teachingScript || []) {
  const meta = visualByGroup[step.exerciseGroup];
  step.visual = {
    kind: 'svg',
    asset: 'vm_complements_whole.svg',
    title: meta ? meta.title : 'Completing the Whole',
    caption: meta ? meta.caption : 'Find the missing part that completes the whole.'
  };
}

for (const beat of data.screenplay || []) {
  const meta = visualByGroup[beat.exerciseGroup];
  beat.visual = {
    kind: 'svg',
    asset: 'vm_complements_whole.svg',
    title: meta ? meta.title : 'Completing the Whole',
    caption: meta ? meta.caption : 'Find the missing part that completes the whole.'
  };
}

fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2), 'utf8');
console.log('UPDATED Chapter 1 and complement SVG asset');
