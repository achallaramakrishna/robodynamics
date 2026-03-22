const fs = require("fs");
const path = "C:/roboworkspace/robodynamics/ai-tutor/tutor-api/content-template/vedic_math/grade_4/chapter/VM_G4_L1_FAST_ADDITION.json";
const lesson = JSON.parse(fs.readFileSync(path, "utf8"));

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paletteFor(group) {
  switch (group) {
    case "A": return { bg1: "#fff7ed", bg2: "#ffedd5", panel: "#ffffff", stroke: "#fb923c", ink: "#7c2d12", accent: "#f97316", soft: "#fdba74", chip: "#fffbeb" };
    case "B": return { bg1: "#fdf4ff", bg2: "#fae8ff", panel: "#ffffff", stroke: "#e879f9", ink: "#6b214f", accent: "#d946ef", soft: "#f5d0fe", chip: "#fdf4ff" };
    case "C": return { bg1: "#eff6ff", bg2: "#dbeafe", panel: "#ffffff", stroke: "#60a5fa", ink: "#1e3a8a", accent: "#2563eb", soft: "#93c5fd", chip: "#eff6ff" };
    case "D": return { bg1: "#ecfeff", bg2: "#cffafe", panel: "#ffffff", stroke: "#22d3ee", ink: "#155e75", accent: "#0891b2", soft: "#67e8f9", chip: "#ecfeff" };
    case "E": return { bg1: "#ecfccb", bg2: "#d9f99d", panel: "#ffffff", stroke: "#84cc16", ink: "#365314", accent: "#65a30d", soft: "#bef264", chip: "#f7fee7" };
    case "F": return { bg1: "#f0fdf4", bg2: "#dcfce7", panel: "#ffffff", stroke: "#4ade80", ink: "#166534", accent: "#16a34a", soft: "#86efac", chip: "#f0fdf4" };
    case "G": return { bg1: "#fff1f2", bg2: "#ffe4e6", panel: "#ffffff", stroke: "#fb7185", ink: "#881337", accent: "#e11d48", soft: "#fda4af", chip: "#fff1f2" };
    case "H": return { bg1: "#eef2ff", bg2: "#e0e7ff", panel: "#ffffff", stroke: "#818cf8", ink: "#312e81", accent: "#4f46e5", soft: "#a5b4fc", chip: "#eef2ff" };
    case "I": return { bg1: "#fefce8", bg2: "#fef3c7", panel: "#ffffff", stroke: "#facc15", ink: "#713f12", accent: "#ca8a04", soft: "#fde68a", chip: "#fefce8" };
    default: return { bg1: "#f8fafc", bg2: "#e2e8f0", panel: "#ffffff", stroke: "#94a3b8", ink: "#0f172a", accent: "#475569", soft: "#cbd5e1", chip: "#f8fafc" };
  }
}

function wrapLines(text, max = 36) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function extractNumbers(text) {
  return (String(text || "").match(/\d+/g) || []).map((v) => Number(v));
}

function buildEquation(question) {
  const hint = String(question.hint || "").trim();
  if (hint.includes("?")) return hint;
  const q = String(question.questionText || "");
  let m = q.match(/complement of (\d+) to make (\d+)/i);
  if (m) return `${m[1]} + ? = ${m[2]}`;
  m = q.match(/what completes (\d+) to make (\d+)/i);
  if (m) return `${m[1]} + ? = ${m[2]}`;
  m = q.match(/what number completes (\d+) to make (\d+)/i);
  if (m) return `${m[1]} + ? = ${m[2]}`;
  m = q.match(/what number must you add to (\d+) to make (\d+)/i);
  if (m) return `${m[1]} + ? = ${m[2]}`;
  m = q.match(/(\d+)\s*\+\s*\?\s*=\s*(\d+)/);
  if (m) return `${m[1]} + ? = ${m[2]}`;
  m = q.match(/(\d+)\s*-\s*(\d+)\s*=\s*\?/);
  if (m) return `${m[1]} - ${m[2]} = ?`;
  return q;
}

function wholeFor(question) {
  const equation = buildEquation(question);
  const nums = extractNumbers(equation);
  const biggest = nums.length ? Math.max(...nums) : 10;
  if (biggest >= 1000) return 1000;
  if (biggest >= 100) return 100;
  return 10;
}

function buildStorySvg(question, palette) {
  const lines = wrapLines(question.questionText, 34);
  const answer = esc(question.expectedAnswer || "?");
  const whole = wholeFor(question);
  const current = extractNumbers(question.questionText)[0] || "?";
  const remain = extractNumbers(question.questionText)[1] || answer;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${esc(question.questionText)}">
  <defs>
    <linearGradient id="storyBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.bg1}"/>
      <stop offset="100%" stop-color="${palette.bg2}"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="308" height="168" rx="22" fill="url(#storyBg)" stroke="${palette.stroke}" stroke-width="2"/>
  <rect x="18" y="18" width="284" height="32" rx="16" fill="${palette.panel}" opacity="0.92"/>
  <text x="30" y="38" fill="${palette.ink}" font-size="15" font-weight="700">Real-life complement</text>
  <rect x="24" y="68" width="112" height="80" rx="18" fill="${palette.panel}" stroke="${palette.stroke}" stroke-width="1.5"/>
  <text x="42" y="98" fill="${palette.accent}" font-size="14" font-weight="700">Whole</text>
  <text x="42" y="128" fill="${palette.ink}" font-size="32" font-weight="800">${whole}</text>
  <rect x="154" y="68" width="142" height="80" rx="18" fill="${palette.panel}" stroke="${palette.stroke}" stroke-width="1.5"/>
  <text x="170" y="96" fill="${palette.accent}" font-size="13" font-weight="700">Missing part</text>
  <text x="170" y="128" fill="${palette.ink}" font-size="30" font-weight="800">${answer}</text>
  <text x="28" y="160" fill="${palette.ink}" font-size="12">Current amount: ${esc(current)}   Solve the gap to reach ${whole}.</text>
</svg>`;
}

function buildSvg(question) {
  const palette = paletteFor(question.exerciseGroup);
  const whole = wholeFor(question);
  const title = esc((question.visual && question.visual.title) || question.subtopic || "Vedic Maths Visual");
  const promptLines = wrapLines(question.questionText, 34);
  const equation = esc(buildEquation(question));
  const answer = esc(question.expectedAnswer || "?");
  const hint = esc(question.hint || "Spot the missing part.");
  const isStory = question.exerciseGroup === "F";
  if (isStory) {
    return buildStorySvg(question, palette);
  }
  const chips = whole >= 1000 ? [whole - 400, whole - 200, whole] : whole >= 100 ? [whole - 60, whole - 20, whole] : [whole - 3, whole - 1, whole].filter((v, i, arr) => arr.indexOf(v) === i);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-label="${esc(question.questionText)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.bg1}"/>
      <stop offset="100%" stop-color="${palette.bg2}"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="308" height="168" rx="22" fill="url(#bg)" stroke="${palette.stroke}" stroke-width="2"/>
  <rect x="18" y="18" width="170" height="30" rx="15" fill="${palette.panel}" opacity="0.95"/>
  <text x="32" y="37" fill="${palette.ink}" font-size="14" font-weight="700">${title}</text>
  <rect x="214" y="18" width="88" height="30" rx="15" fill="${palette.chip}" stroke="${palette.stroke}" stroke-width="1.2"/>
  <text x="258" y="37" text-anchor="middle" fill="${palette.accent}" font-size="14" font-weight="800">Make ${whole}</text>
  <rect x="22" y="62" width="276" height="56" rx="18" fill="${palette.panel}" stroke="${palette.stroke}" stroke-width="1.5"/>
  <text x="36" y="84" fill="${palette.ink}" font-size="13" font-weight="700">Question</text>
  <text x="36" y="104" fill="${palette.ink}" font-size="13">${esc(promptLines[0] || "")}</text>
  ${promptLines[1] ? `<text x="36" y="120" fill="${palette.ink}" font-size="13">${esc(promptLines[1])}</text>` : ""}
  <rect x="24" y="132" width="138" height="30" rx="15" fill="${palette.soft}" opacity="0.55"/>
  <text x="36" y="151" fill="${palette.ink}" font-size="16" font-weight="800">${equation}</text>
  <rect x="180" y="126" width="120" height="42" rx="16" fill="${palette.panel}" stroke="${palette.stroke}" stroke-width="1.5"/>
  <text x="194" y="145" fill="${palette.accent}" font-size="12" font-weight="700">Missing part</text>
  <text x="194" y="160" fill="${palette.ink}" font-size="24" font-weight="800">${answer}</text>
  <text x="24" y="172" fill="${palette.ink}" font-size="11">Hint: ${hint}</text>
</svg>`;
}

for (const step of lesson.duolingoLessonArc?.sessionFlow || []) {
  for (const question of step.exercises || []) {
    question.visual = question.visual || {};
    question.visual.kind = "svg";
    question.visual.svg = buildSvg(question);
    question.visual.themeColor = paletteFor(question.exerciseGroup).accent;
  }
  if (step.visual) {
    step.visual.themeColor = paletteFor(step.exerciseGroup).accent;
  }
}

for (const beat of lesson.screenplay || []) {
  if (beat.visual) {
    beat.visual.themeColor = paletteFor(beat.exerciseGroup).accent;
  }
}

if (Array.isArray(lesson.visualLibrary)) {
  lesson.visualLibrary = lesson.visualLibrary.map((item) => ({
    ...item,
    themeColor: paletteFor("A").accent,
    svg: item.svg || buildSvg({
      exerciseGroup: "A",
      subtopic: item.title || "Complements",
      questionText: item.caption || "Spot the missing part that completes the whole.",
      expectedAnswer: "3",
      hint: "7 + ? = 10",
      visual: item,
    }),
  }));
}

fs.writeFileSync(path, JSON.stringify(lesson, null, 2) + "\n");