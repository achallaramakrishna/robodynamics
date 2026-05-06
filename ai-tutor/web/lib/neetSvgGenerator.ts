/**
 * NEET SVG Explanation Generator
 * Generates rich, animated SVG visual explanations for NEET questions.
 *
 * Templates:
 *   numerical_solver  — formula → substitution → steps → answer
 *   option_breakdown  — universal MCQ explanation (fallback)
 *   process_flow      — biology cycles / chemistry sequences
 *   ray_diagram       — optics (mirrors, lenses, TIR, interference)
 *   circuit_diagram   — electricity (series/parallel, Kirchhoff)
 *   force_diagram     — mechanics (FBD, inclined plane, projectile)
 *   energy_level      — Bohr model, hydrogen spectrum, photoelectric
 */

// ─── Colour palette (dark theme, matches UI) ─────────────────────────────────
const C = {
  bg:      "#0F172A",
  panel:   "#1E293B",
  border:  "#334155",
  correct: "#10B981",
  wrong:   "#EF4444",
  formula: "#38BDF8",
  warn:    "#F59E0B",
  t1:      "#F1F5F9",
  t2:      "#94A3B8",
  t3:      "#64748B",
  physics: "#818CF8",
  chem:    "#34D399",
  bio:     "#FB923C",
};

export interface NeetQuestion {
  questionId?: string;
  chapterCode?: string;
  subject?: string;
  questionText: string;
  options?: Record<string, string>;
  correctOption?: string;
  explanation?: string;
  allOptionExplanations?: Record<string, string>;
  topic?: string;
  questionType?: string;
  neetYear?: string;
  difficulty?: string;
}

export interface ChapterData {
  keyFormulas?: string[];
  title?: string;
  commonMistakes?: string[];
}

export interface SvgResult {
  svg: string;
  template: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(text: string, width = 70): string[] {
  const words = String(text || "").split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= width) {
      cur = (cur + " " + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

function subjectColor(subject: string): string {
  const s = (subject || "").toLowerCase();
  if (s.includes("phys")) return C.physics;
  if (s.includes("chem")) return C.chem;
  if (s.includes("bio"))  return C.bio;
  return C.formula;
}

// ─── Global CSS animations (included once per SVG) ───────────────────────────

function styles(extra = ""): string {
  return `<defs><style>
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
.a0{animation:fadeUp .4s ease-out .05s both}
.a1{animation:fadeUp .4s ease-out .25s both}
.a2{animation:fadeUp .4s ease-out .45s both}
.a3{animation:fadeUp .4s ease-out .65s both}
.a4{animation:fadeUp .4s ease-out .85s both}
.a5{animation:fadeUp .4s ease-out 1.05s both}
.a6{animation:fadeUp .4s ease-out 1.25s both}
.pulse{animation:pulse 2s ease-in-out infinite}
${extra}
</style></defs>`;
}

// ─── Shared SVG primitives ────────────────────────────────────────────────────

function panel(x: number, y: number, w: number, h: number,
               fill = C.panel, stroke = C.border, rx = 10, cls = ""): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1" rx="${rx}" class="${cls}"/>`;
}

function txt(x: number, y: number, text: string,
             fill = C.t1, size = 14, weight = "normal",
             anchor = "start", cls = ""): string {
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" class="${cls}">${esc(text)}</text>`;
}

function wrappedTxt(x: number, startY: number, text: string, widthChars: number,
                    fill = C.t1, size = 14, lineH = 20, cls = ""): { svg: string; endY: number } {
  const lines = wrap(text, widthChars);
  let svg = "";
  let y = startY;
  for (const l of lines) {
    svg += txt(x, y, l, fill, size, "normal", "start", cls) + "\n";
    y += lineH;
  }
  return { svg, endY: y };
}

function badge(x: number, y: number, label: string, bg: string, fg = C.t1, cls = ""): string {
  const w = Math.max(label.length * 7.5 + 16, 50);
  return `<rect x="${x}" y="${y - 13}" width="${w}" height="18" fill="${bg}" rx="4" class="${cls}"/>
<text x="${x + 8}" y="${y}" fill="${fg}" font-size="11" font-weight="bold" class="${cls}">${esc(label)}</text>`;
}

function divider(y: number, cls = ""): string {
  return `<line x1="20" y1="${y}" x2="880" y2="${y}" stroke="${C.border}" stroke-width="1" class="${cls}"/>`;
}

function header(topic: string, neetYear: string | undefined, sc: string): string {
  const yr = neetYear ? badge(800, 28, `NEET ${neetYear}`, sc, C.t1, "a0") : "";
  return `<rect width="900" height="46" fill="${sc}22"/>
${txt(20, 29, topic, sc, 13, "bold", "start", "a0")}
${yr}`;
}

// ─── Option Breakdown (shared by ALL templates) ───────────────────────────────

function optionBreakdown(q: NeetQuestion, yStart: number, subject: string): { svg: string; endY: number } {
  const opts  = q.options || {};
  const corr  = q.correctOption || "A";
  const exps  = q.allOptionExplanations || {};
  const sc    = subjectColor(subject);
  let svg     = "";
  let y       = yStart;

  // Section label
  svg += panel(20, y, 860, 26, C.bg, C.border, 6, "a3") + "\n";
  svg += txt(36, y + 17, "WHY EACH OPTION IS RIGHT OR WRONG", C.t3, 11, "bold", "start", "a3") + "\n";
  y += 33;

  for (let i = 0; i < 4; i++) {
    const key       = ["A","B","C","D"][i];
    const optText   = opts[key] || "—";
    const expText   = exps[key] || "";
    const isCorrect = key === corr;
    const anim      = `a${Math.min(3 + i, 6)}`;

    const optLines  = wrap(String(optText), 68);
    const expLines  = expText ? wrap(String(expText), 80).slice(0, 2) : [];
    const rowH      = Math.max(56, 20 + optLines.length * 17 + (expLines.length ? expLines.length * 16 + 6 : 0) + 10);

    const borderC   = isCorrect ? C.correct : "#450A0A";
    const fillC     = isCorrect ? "#0D2A1A" : "#1A0A0A";

    svg += panel(20, y, 860, rowH, fillC, borderC, 8, anim) + "\n";

    // Letter circle
    const circC = isCorrect ? C.correct : C.wrong;
    const midY  = y + rowH / 2;
    svg += `<circle cx="46" cy="${midY}" r="14" fill="${circC}" class="${anim}"/>`;
    svg += txt(46, midY + 5, key, C.t1, 13, "bold", "middle", anim) + "\n";

    // Correct/Wrong badge
    const bdgLabel = isCorrect ? "✓ CORRECT" : "✗ WRONG";
    svg += badge(760, y + 12, bdgLabel, isCorrect ? C.correct : C.wrong, C.t1, anim) + "\n";

    // Option text
    let ty = y + 18;
    for (const l of optLines.slice(0, 2)) {
      svg += txt(68, ty, l, C.t1, 13, "normal", "start", anim) + "\n";
      ty += 17;
    }

    // Explanation
    if (expLines.length) {
      ty += 2;
      for (const l of expLines) {
        svg += txt(68, ty, l, C.t2, 12, "normal", "start", anim) + "\n";
        ty += 16;
      }
    }

    y += rowH + 6;
  }

  return { svg, endY: y };
}

// ─── Template 1: Numerical Solver ────────────────────────────────────────────

function renderNumericalSolver(q: NeetQuestion, chapter: ChapterData, subject: string): SvgResult {
  const sc      = subjectColor(subject);
  const exp     = q.explanation || "";
  const qText   = q.questionText || "";
  const topic   = q.topic || "";
  const corr    = q.correctOption || "A";
  const corrTxt = (q.options || {})[corr] || "";

  const steps = exp.replace(/\n/g, " ").split(/\.\s+/).filter(s => s.trim()).slice(0, 5);
  const qLines = wrap(qText, 72);

  // Formula extraction
  const formulas = chapter.keyFormulas || [];
  const topicLow = topic.toLowerCase();
  const expLow   = exp.toLowerCase();
  let formula    = "";
  for (const f of formulas) {
    if (f.toLowerCase().split(" ").slice(0, 3).some(k => topicLow.includes(k) || expLow.includes(k))) {
      formula = f; break;
    }
  }
  if (!formula) {
    for (const part of exp.split(". ")) {
      if (part.includes("=") && part.length < 100) { formula = part.trim(); break; }
    }
  }

  const stepH  = steps.length * 52;
  const optH   = 4 * 76 + 50;
  const H      = Math.max(720, 50 + qLines.length * 20 + 24 + (formula ? 68 : 0) + stepH + 24 + 44 + optH + 30);

  let body = "";
  let y = 0;

  // Header
  body += header(topic, q.neetYear, sc) + "\n";
  y = 56;

  // Question
  body += panel(20, y, 860, qLines.length * 20 + 22, C.panel, C.border, 8, "a0") + "\n";
  const qr = wrappedTxt(36, y + 18, qText, 72, C.t1, 14, 20, "a0");
  body += qr.svg;
  y = qr.endY + 14;

  // Formula spotlight
  if (formula) {
    body += panel(20, y, 860, 56, "#0C2A4A", C.formula, 8, "a1") + "\n";
    body += txt(36, y + 17, "KEY FORMULA", C.t3, 11, "bold", "start", "a1") + "\n";
    body += txt(36, y + 38, formula, C.formula, 15, "bold", "start", "a1") + "\n";
    y += 66;
  }

  // Steps
  body += panel(20, y, 860, stepH + 22, C.panel, C.border, 8, "a1") + "\n";
  body += txt(36, y + 17, "STEP-BY-STEP SOLUTION", C.t3, 11, "bold", "start", "a1") + "\n";
  let sy = y + 33;
  for (let i = 0; i < steps.length; i++) {
    const anim = `a${Math.min(2 + i, 6)}`;
    body += `<circle cx="46" cy="${sy + 8}" r="11" fill="${sc}33" stroke="${sc}" stroke-width="1.5" class="${anim}"/>`;
    body += txt(46, sy + 13, String(i + 1), sc, 12, "bold", "middle", anim) + "\n";
    const sr = wrappedTxt(64, sy + 2, steps[i] + ".", 72, C.t1, 13, 18, anim);
    body += sr.svg;
    sy = Math.max(sr.endY, sy + 30) + 6;
  }
  y = sy + 14;

  // Answer callout
  body += panel(20, y, 860, 40, "#0D2A1A", C.correct, 8, "a4") + "\n";
  body += txt(36, y + 25, `✓  Answer: Option ${corr}  —  ${corrTxt.slice(0, 80)}`, C.correct, 14, "bold", "start", "a4") + "\n";
  y += 50;

  // Option breakdown
  const { svg: optSvg, endY } = optionBreakdown(q, y, subject);
  body += optSvg;
  y = endY + 20;

  return {
    template: "numerical_solver",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${H}" width="900" height="${H}">\n${styles()}\n<rect width="900" height="${H}" fill="${C.bg}"/>\n${body}\n</svg>`,
  };
}

// ─── Template 2: Option Breakdown (universal fallback) ───────────────────────

function renderOptionBreakdown(q: NeetQuestion, _chapter: ChapterData, subject: string): SvgResult {
  const sc     = subjectColor(subject);
  const qText  = q.questionText || "";
  const exp    = q.explanation || "";
  const topic  = q.topic || "";
  const corr   = q.correctOption || "A";
  const corrTxt = (q.options || {})[corr] || "";

  const qLines  = wrap(qText, 72);
  const expLines = wrap(exp, 76).slice(0, 4);
  const optH    = 4 * 76 + 50;
  const H       = Math.max(680, 50 + qLines.length * 20 + 22 + expLines.length * 18 + 26 + 44 + optH + 30);

  let body = "";
  let y = 0;

  body += header(topic, q.neetYear, sc) + "\n";
  y = 56;

  // Question
  body += panel(20, y, 860, qLines.length * 20 + 22, C.panel, C.border, 8, "a0") + "\n";
  const qr = wrappedTxt(36, y + 18, qText, 72, C.t1, 14, 20, "a0");
  body += qr.svg;
  y = qr.endY + 14;

  // Explanation block
  const expH = expLines.length * 18 + 26;
  body += panel(20, y, 860, expH, "#0C1824", C.formula + "44", 8, "a1") + "\n";
  body += txt(36, y + 17, "MEERA'S EXPLANATION", C.formula, 11, "bold", "start", "a1") + "\n";
  let ey = y + 33;
  for (const l of expLines) {
    body += txt(36, ey, l, C.t2, 13, "normal", "start", "a1") + "\n";
    ey += 18;
  }
  y = ey + 12;

  // Answer callout
  body += panel(20, y, 860, 40, "#0D2A1A", C.correct, 8, "a2") + "\n";
  body += txt(36, y + 25, `✓  Option ${corr} is CORRECT  —  ${corrTxt.slice(0, 70)}`, C.correct, 14, "bold", "start", "a2") + "\n";
  y += 50;

  const { svg: optSvg, endY } = optionBreakdown(q, y, subject);
  body += optSvg;
  y = endY + 20;

  return {
    template: "option_breakdown",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${H}" width="900" height="${H}">\n${styles()}\n<rect width="900" height="${H}" fill="${C.bg}"/>\n${body}\n</svg>`,
  };
}

// ─── Template 3: Process Flow ─────────────────────────────────────────────────

interface Phase { name: string; color: string; icon?: string }
interface ProcessFlow { title: string; phases: Phase[]; labels?: string[] }

const FLOWS: Record<string, ProcessFlow> = {
  photosynthesis: {
    title: "Photosynthesis",
    phases: [
      { name: "Light\nAbsorption", color: "#F59E0B" },
      { name: "H₂O\nSplitting",   color: "#38BDF8" },
      { name: "ATP\nSynthesis",   color: "#A78BFA" },
      { name: "NADPH\nFormation", color: "#34D399" },
      { name: "CO₂\nFixation",    color: "#10B981" },
      { name: "Calvin\nCycle",    color: "#059669" },
    ],
    labels: ["Light Reactions (Thylakoid)", "Dark Reactions (Stroma)"],
  },
  "cellular respiration": {
    title: "Cellular Respiration",
    phases: [
      { name: "Glycolysis",         color: "#F59E0B" },
      { name: "Pyruvate\nOxidation", color: "#FB923C" },
      { name: "Krebs\nCycle",        color: "#EF4444" },
      { name: "Electron\nTransport", color: "#A78BFA" },
      { name: "ATP\nSynthase",       color: "#818CF8" },
    ],
  },
  mitosis: {
    title: "Mitosis",
    phases: [
      { name: "Prophase",    color: "#818CF8" },
      { name: "Metaphase",   color: "#A78BFA" },
      { name: "Anaphase",    color: "#C084FC" },
      { name: "Telophase",   color: "#E879F9" },
      { name: "Cytokinesis", color: "#F0ABFC" },
    ],
  },
  meiosis: {
    title: "Meiosis",
    phases: [
      { name: "Prophase I\n(crossing over)", color: "#818CF8" },
      { name: "Metaphase I",                 color: "#A78BFA" },
      { name: "Anaphase I",                  color: "#C084FC" },
      { name: "Telophase I",                 color: "#E879F9" },
      { name: "Meiosis II\n→4 haploid",      color: "#FB923C" },
    ],
    labels: ["Meiosis I (reductional)", "Meiosis II (equational)"],
  },
  "nitrogen cycle": {
    title: "Nitrogen Cycle",
    phases: [
      { name: "N₂ in\nAtmosphere",  color: "#38BDF8" },
      { name: "N₂\nFixation",       color: "#10B981" },
      { name: "NH₃\nNitrification", color: "#34D399" },
      { name: "Plant\nUptake",      color: "#4ADE80" },
      { name: "Denitrification",    color: "#6EE7B7" },
    ],
  },
};

function detectFlow(q: NeetQuestion): ProcessFlow | null {
  const combined = `${q.topic || ""} ${q.questionText || ""} ${q.explanation || ""}`.toLowerCase();
  for (const [key, flow] of Object.entries(FLOWS)) {
    if (combined.includes(key)) return flow;
  }
  return null;
}

function renderProcessFlow(q: NeetQuestion, chapter: ChapterData, subject: string): SvgResult {
  const sc      = subjectColor(subject);
  const qText   = q.questionText || "";
  const topic   = q.topic || "";
  const qLines  = wrap(qText, 72);
  const flow    = detectFlow(q);
  const flowH   = flow ? 140 : 0;
  const optH    = 4 * 76 + 50;
  const H       = Math.max(700, 50 + qLines.length * 20 + 22 + flowH + 20 + optH + 30);

  let body = "";
  let y = 0;

  body += header(topic, q.neetYear, sc) + "\n";
  y = 56;

  // Question
  body += panel(20, y, 860, qLines.length * 20 + 22, C.panel, C.border, 8, "a0") + "\n";
  const qr = wrappedTxt(36, y + 18, qText, 72, C.t1, 14, 20, "a0");
  body += qr.svg;
  y = qr.endY + 14;

  // Flow diagram
  if (flow) {
    body += panel(20, y, 860, flowH, C.panel, C.border, 10, "a1") + "\n";
    body += txt(36, y + 17, flow.title.toUpperCase(), sc, 11, "bold", "start", "a1") + "\n";

    const phases  = flow.phases;
    const n       = phases.length;
    const boxW    = Math.min(110, Math.floor((860 - 40) / n) - 14);
    const spacing = Math.floor((860 - 20) / n);
    const cy      = y + 80;

    for (let i = 0; i < n; i++) {
      const anim  = `a${Math.min(1 + i, 6)}`;
      const cx    = 30 + i * spacing + spacing / 2;
      const color = phases[i].color;
      const lines = phases[i].name.split("\n");

      body += `<rect x="${cx - boxW / 2}" y="${cy - 28}" width="${boxW}" height="56" fill="${color}28" stroke="${color}" stroke-width="1.5" rx="8" class="${anim}"/>`;
      const textY = cy - (lines.length - 1) * 8;
      for (let li = 0; li < lines.length; li++) {
        body += txt(cx, textY + li * 16, lines[li], C.t1, 11, "normal", "middle", anim) + "\n";
      }

      if (i < n - 1) {
        const ax1 = cx + boxW / 2 + 2;
        const ax2 = cx + spacing - boxW / 2 - 2;
        body += `<line x1="${ax1}" y1="${cy}" x2="${ax2}" y2="${cy}" stroke="${sc}" stroke-width="2" class="${anim}"/>`;
        body += `<polygon points="${ax2},${cy} ${ax2 - 8},${cy - 4} ${ax2 - 8},${cy + 4}" fill="${sc}" class="${anim}"/>`;
      }
    }

    if (flow.labels?.length) {
      const labelY = y + flowH - 16;
      const seg    = Math.floor((860 - 20) / (flow.labels.length));
      for (let li = 0; li < flow.labels.length; li++) {
        const lx = 30 + li * seg + seg / 2;
        body += txt(lx, labelY, flow.labels[li], C.t3, 10, "normal", "middle", "a2") + "\n";
      }
    }
    y += flowH + 12;
  }

  const { svg: optSvg, endY } = optionBreakdown(q, y, subject);
  body += optSvg;
  y = endY + 20;

  return {
    template: "process_flow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${H}" width="900" height="${H}">\n${styles()}\n<rect width="900" height="${H}" fill="${C.bg}"/>\n${body}\n</svg>`,
  };
}

// ─── Template 4: Ray Diagram ──────────────────────────────────────────────────

function renderRayDiagram(q: NeetQuestion, chapter: ChapterData, subject: string): SvgResult {
  const sc     = subjectColor(subject);
  const qText  = q.questionText || "";
  const topic  = q.topic || "";
  const exp    = q.explanation || "";
  const qLines = wrap(qText, 72);
  const expLines = wrap(exp, 78).slice(0, 3);
  const optH   = 4 * 76 + 50;
  const H      = Math.max(760, 50 + qLines.length * 20 + 22 + 210 + expLines.length * 18 + 26 + optH + 30);

  let body = "";
  let y = 0;

  body += header(topic, q.neetYear, sc) + "\n";
  y = 56;

  body += panel(20, y, 860, qLines.length * 20 + 22, C.panel, C.border, 8, "a0") + "\n";
  const qr = wrappedTxt(36, y + 18, qText, 72, C.t1, 14, 20, "a0");
  body += qr.svg;
  y = qr.endY + 14;

  // Diagram panel
  const diagramH = 200;
  body += panel(20, y, 860, diagramH, "#0A0F1A", C.border, 10, "a1") + "\n";
  body += txt(36, y + 17, "RAY DIAGRAM", C.t3, 11, "bold", "start", "a1") + "\n";

  const iy  = y + 110;    // interface y-coord
  const cx  = 450;        // centre x

  // Interface line
  body += `<line x1="80" y1="${iy}" x2="820" y2="${iy}" stroke="${C.border}" stroke-width="2" stroke-dasharray="8,4" class="a1"/>`;

  // Extract n values from question text
  const nMatches = qText.match(/n\s*=\s*([\d.]+(?:\/[\d.]+)?)/g) || [];
  const n1Str    = nMatches[0] ? nMatches[0].split("=")[1].trim() : "n₁";
  const n2Str    = nMatches[1] ? nMatches[1].split("=")[1].trim() : "n₂";

  body += txt(80,  iy - 28, `Denser medium  n₁ = ${n1Str}`, C.physics, 13, "bold", "start", "a1") + "\n";
  body += txt(80,  iy + 40, `Rarer medium   n₂ = ${n2Str}`, C.t3, 13, "bold", "start", "a1") + "\n";

  // Normal (vertical dashed)
  body += `<line x1="${cx}" y1="${y + 28}" x2="${cx}" y2="${y + diagramH - 8}" stroke="${C.warn}88" stroke-width="1.5" stroke-dasharray="5,3" class="a1"/>`;
  body += txt(cx + 6, y + 36, "Normal", C.warn, 11, "normal", "start", "a1") + "\n";

  const isTIR = /total internal|tir|critical angle/i.test(topic + qText);

  // Incident ray (top-left → interface)
  body += `<line x1="${cx - 140}" y1="${y + 44}" x2="${cx}" y2="${iy}" stroke="${C.warn}" stroke-width="2.5" class="a2"/>`;
  body += `<polygon points="${cx},${iy} ${cx - 10},${iy - 6} ${cx - 6},${iy - 14}" fill="${C.warn}" class="a2"/>`;
  body += txt(cx - 170, y + 40, "Incident", C.warn, 12, "normal", "start", "a2") + "\n";

  // Angle of incidence arc
  body += `<path d="M ${cx} ${iy - 32} A 32 32 0 0 0 ${cx - 23} ${iy - 22}" fill="none" stroke="${C.warn}" stroke-width="1.5" class="a2"/>`;
  body += txt(cx - 48, iy - 8, "θ₁", C.warn, 13, "bold", "start", "a2") + "\n";

  if (isTIR) {
    // Reflected ray (top-right)
    body += `<line x1="${cx}" y1="${iy}" x2="${cx + 140}" y2="${y + 44}" stroke="${C.correct}" stroke-width="2.5" class="a3"/>`;
    body += `<polygon points="${cx + 140},${y + 44} ${cx + 130},${y + 48} ${cx + 136},${y + 58}" fill="${C.correct}" class="a3"/>`;
    body += txt(cx + 146, y + 40, "Reflected (TIR)", C.correct, 12, "normal", "start", "a3") + "\n";
    // Reflection angle arc
    body += `<path d="M ${cx + 23} ${iy - 22} A 32 32 0 0 0 ${cx} ${iy - 32}" fill="none" stroke="${C.correct}" stroke-width="1.5" class="a3"/>`;
    body += txt(cx + 28, iy - 8, "θ₁", C.correct, 13, "bold", "start", "a3") + "\n";
    // TIR label
    body += panel(cx - 90, iy - 55, 180, 24, C.correct + "22", C.correct, 6, "a3") + "\n";
    body += txt(cx, iy - 39, "Total Internal Reflection", C.correct, 12, "bold", "middle", "a3") + "\n";
  } else {
    // Refracted ray (bottom-right, bends away from normal)
    body += `<line x1="${cx}" y1="${iy}" x2="${cx + 90}" y2="${y + diagramH - 8}" stroke="${C.correct}" stroke-width="2.5" class="a3"/>`;
    body += `<polygon points="${cx + 90},${y + diagramH - 8} ${cx + 82},${y + diagramH - 20} ${cx + 94},${y + diagramH - 22}" fill="${C.correct}" class="a3"/>`;
    body += txt(cx + 96, y + diagramH - 20, "Refracted", C.correct, 12, "normal", "start", "a3") + "\n";
    // Angle of refraction arc
    body += `<path d="M ${cx} ${iy + 24} A 24 24 0 0 0 ${cx + 17} ${iy + 17}" fill="none" stroke="${C.correct}" stroke-width="1.5" class="a3"/>`;
    body += txt(cx + 22, iy + 34, "θ₂", C.correct, 13, "bold", "start", "a3") + "\n";
    body += txt(cx - 180, iy + 34, "n₁ sin θ₁ = n₂ sin θ₂  (Snell's Law)", C.formula, 12, "bold", "start", "a3") + "\n";
  }
  y += diagramH + 12;

  // Explanation
  const expH = expLines.length * 18 + 24;
  body += panel(20, y, 860, expH, "#0C1824", C.formula + "44", 8, "a3") + "\n";
  let ey = y + 18;
  for (const l of expLines) {
    body += txt(36, ey, l, C.t2, 13, "normal", "start", "a3") + "\n";
    ey += 18;
  }
  y = ey + 12;

  const { svg: optSvg, endY } = optionBreakdown(q, y, subject);
  body += optSvg;

  return {
    template: "ray_diagram",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${H}" width="900" height="${H}">\n${styles()}\n<rect width="900" height="${H}" fill="${C.bg}"/>\n${body}\n</svg>`,
  };
}

// ─── Template 5: Circuit Diagram ──────────────────────────────────────────────

function renderCircuitDiagram(q: NeetQuestion, chapter: ChapterData, subject: string): SvgResult {
  const sc      = subjectColor(subject);
  const qText   = q.questionText || "";
  const topic   = q.topic || "";
  const exp     = q.explanation || "";
  const qLines  = wrap(qText, 72);
  const expLines = wrap(exp, 78).slice(0, 3);
  const optH    = 4 * 76 + 50;
  const H       = Math.max(760, 50 + qLines.length * 20 + 22 + 200 + expLines.length * 18 + 26 + optH + 30);

  let body = "";
  let y = 0;

  body += header(topic, q.neetYear, sc) + "\n";
  y = 56;

  body += panel(20, y, 860, qLines.length * 20 + 22, C.panel, C.border, 8, "a0") + "\n";
  const qr = wrappedTxt(36, y + 18, qText, 72, C.t1, 14, 20, "a0");
  body += qr.svg;
  y = qr.endY + 14;

  // Circuit panel
  const circH = 192;
  body += panel(20, y, 860, circH, "#0A0F1A", C.border, 10, "a1") + "\n";
  body += txt(36, y + 17, "CIRCUIT DIAGRAM", C.t3, 11, "bold", "start", "a1") + "\n";

  const cx  = 450;
  const cy  = y + 104;
  const bW  = 260;
  const bH  = 80;

  // Circuit loop
  body += `<rect x="${cx - bW / 2}" y="${cy - bH / 2}" width="${bW}" height="${bH}" fill="none" stroke="${sc}" stroke-width="2" rx="6" class="a2"/>`;

  // Battery (left side)
  const bx = cx - bW / 2;
  body += `<line x1="${bx}" y1="${cy - 16}" x2="${bx}" y2="${cy + 16}" stroke="${C.warn}" stroke-width="4" class="a2"/>`;
  body += `<line x1="${bx - 8}" y1="${cy - 9}" x2="${bx - 8}" y2="${cy + 9}" stroke="${C.warn}" stroke-width="2" class="a2"/>`;
  body += txt(bx - 30, cy + 32, "EMF", C.warn, 12, "normal", "middle", "a2") + "\n";
  body += txt(bx - 6, cy - 20, "+", C.warn, 14, "bold", "start", "a2") + "\n";

  // Resistors (top wire, equally spaced)
  const rCount = 3;
  const rSpacing = bW / (rCount + 1);
  for (let ri = 0; ri < rCount; ri++) {
    const rx = cx - bW / 2 + rSpacing * (ri + 1);
    const ry = cy - bH / 2;
    body += `<rect x="${rx - 20}" y="${ry - 14}" width="40" height="14" fill="${sc}33" stroke="${sc}" stroke-width="1.5" rx="3" class="a3"/>`;
    body += txt(rx, ry - 5, `R${ri + 1}`, sc, 11, "normal", "middle", "a3") + "\n";
  }

  // Current direction arrow
  body += `<polygon points="${cx + 50},${cy + bH / 2 + 12} ${cx + 42},${cy + bH / 2 + 8} ${cx + 42},${cy + bH / 2 + 16}" fill="${C.correct}" class="a3"/>`;
  body += txt(cx - 20, cy + bH / 2 + 24, "→ Current (I)", C.correct, 12, "normal", "start", "a3") + "\n";

  // Ohm's law in centre
  body += txt(cx, cy + 6, "V = IR", C.formula, 17, "bold", "middle", "a2") + "\n";

  y += circH + 12;

  const expH = expLines.length * 18 + 24;
  body += panel(20, y, 860, expH, "#0C1824", C.formula + "44", 8, "a3") + "\n";
  let ey = y + 18;
  for (const l of expLines) {
    body += txt(36, ey, l, C.t2, 13, "normal", "start", "a3") + "\n";
    ey += 18;
  }
  y = ey + 12;

  const { svg: optSvg, endY } = optionBreakdown(q, y, subject);
  body += optSvg;

  return {
    template: "circuit_diagram",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${H}" width="900" height="${H}">\n${styles()}\n<rect width="900" height="${H}" fill="${C.bg}"/>\n${body}\n</svg>`,
  };
}

// ─── Template 6: Force Diagram ────────────────────────────────────────────────

function arrow(x1: number, y1: number, x2: number, y2: number,
               color: string, label: string, cls: string): string {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return "";
  const ux = dx / len, uy = dy / len;
  const ax1 = x2 - 12 * ux + 5 * uy;
  const ay1 = y2 - 12 * uy - 5 * ux;
  const ax2 = x2 - 12 * ux - 5 * uy;
  const ay2 = y2 - 12 * uy + 5 * ux;
  let out = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" class="${cls}"/>`;
  out += `<polygon points="${x2.toFixed(0)},${y2.toFixed(0)} ${ax1.toFixed(0)},${ay1.toFixed(0)} ${ax2.toFixed(0)},${ay2.toFixed(0)}" fill="${color}" class="${cls}"/>`;
  if (label) {
    out += txt(x2 + 8 * ux + 6, y2 + 8 * uy, label, color, 12, "normal", "start", cls) + "\n";
  }
  return out;
}

function renderForceDiagram(q: NeetQuestion, chapter: ChapterData, subject: string): SvgResult {
  const sc     = subjectColor(subject);
  const qText  = q.questionText || "";
  const topic  = q.topic || "";
  const exp    = q.explanation || "";
  const qLines = wrap(qText, 72);
  const expLines = wrap(exp, 78).slice(0, 3);
  const optH   = 4 * 76 + 50;
  const H      = Math.max(760, 50 + qLines.length * 20 + 22 + 210 + expLines.length * 18 + 26 + optH + 30);

  let body = "";
  let y = 0;

  body += header(topic, q.neetYear, sc) + "\n";
  y = 56;

  body += panel(20, y, 860, qLines.length * 20 + 22, C.panel, C.border, 8, "a0") + "\n";
  const qr = wrappedTxt(36, y + 18, qText, 72, C.t1, 14, 20, "a0");
  body += qr.svg;
  y = qr.endY + 14;

  const fbdH = 200;
  body += panel(20, y, 860, fbdH, "#0A0F1A", C.border, 10, "a1") + "\n";
  body += txt(36, y + 17, "FREE BODY DIAGRAM", C.t3, 11, "bold", "start", "a1") + "\n";

  const cx  = 450;
  const cy  = y + 110;
  const top = (q.topic || "").toLowerCase();
  const isIncline = /incline|slope|inclined/.test(top + qText.toLowerCase());

  if (isIncline) {
    // Inclined plane triangle
    body += `<polygon points="${cx - 160},${cy + 50} ${cx + 120},${cy + 50} ${cx + 120},${cy - 60}" fill="${sc}11" stroke="${sc}" stroke-width="2" class="a2"/>`;
    body += txt(cx - 100, cy + 44, "θ", C.warn, 18, "bold", "start", "a2") + "\n";
    // Block on slope
    body += `<rect x="${cx - 22}" y="${cy - 22}" width="44" height="44" fill="${C.panel}" stroke="${sc}" stroke-width="2" rx="4" class="a2"/>`;
    body += txt(cx, cy + 7, "m", C.t1, 18, "normal", "middle", "a2") + "\n";
    body += arrow(cx, cy, cx, cy - 65, C.correct, "N (Normal)", "a3");
    body += arrow(cx, cy, cx, cy + 75, C.wrong, "mg", "a3");
    body += arrow(cx, cy, cx - 70, cy, C.warn, "friction f", "a3");
    // Equations
    body += txt(cx + 180, cy - 30, "N = mg cosθ", C.formula, 13, "bold", "start", "a4") + "\n";
    body += txt(cx + 180, cy - 10, "f = μN", C.formula, 13, "bold", "start", "a4") + "\n";
  } else {
    // Standard FBD — block with 4 forces
    body += `<rect x="${cx - 28}" y="${cy - 28}" width="56" height="56" fill="${C.panel}" stroke="${sc}" stroke-width="2" rx="4" class="a2"/>`;
    body += txt(cx, cy + 7, "m", C.t1, 20, "normal", "middle", "a2") + "\n";
    // Ground
    body += `<line x1="${cx - 90}" y1="${cy + 28}" x2="${cx + 90}" y2="${cy + 28}" stroke="${C.border}" stroke-width="2" class="a1"/>`;
    body += arrow(cx, cy, cx, cy - 88, C.correct, "N (Normal)", "a3");
    body += arrow(cx, cy, cx, cy + 88, C.wrong, "mg (Weight)", "a3");
    body += arrow(cx, cy, cx + 110, cy, C.physics, "F (Applied)", "a4");
    body += arrow(cx, cy, cx - 80, cy, C.warn, "f (Friction)", "a4");

    // Newton's 2nd law
    body += txt(cx + 220, cy - 10, "F_net = ma", C.formula, 14, "bold", "start", "a4") + "\n";
  }
  y += fbdH + 12;

  const expH = expLines.length * 18 + 24;
  body += panel(20, y, 860, expH, "#0C1824", C.formula + "44", 8, "a3") + "\n";
  let ey = y + 18;
  for (const l of expLines) {
    body += txt(36, ey, l, C.t2, 13, "normal", "start", "a3") + "\n";
    ey += 18;
  }
  y = ey + 12;

  const { svg: optSvg, endY } = optionBreakdown(q, y, subject);
  body += optSvg;

  return {
    template: "force_diagram",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${H}" width="900" height="${H}">\n${styles()}\n<rect width="900" height="${H}" fill="${C.bg}"/>\n${body}\n</svg>`,
  };
}

// ─── Template 7: Energy Level (Bohr / Hydrogen Spectrum) ─────────────────────

interface EnergyLevel { n: number; E: string; yFrac: number }
const BOHR_LEVELS: EnergyLevel[] = [
  { n: 1, E: "−13.6 eV", yFrac: 0.91 },
  { n: 2, E: "−3.4 eV",  yFrac: 0.72 },
  { n: 3, E: "−1.51 eV", yFrac: 0.58 },
  { n: 4, E: "−0.85 eV", yFrac: 0.47 },
  { n: 5, E: "−0.54 eV", yFrac: 0.38 },
];

interface SeriesInfo { name: string; nFinal: number; region: string; color: string }
const SERIES: SeriesInfo[] = [
  { name: "Lyman",   nFinal: 1, region: "Ultraviolet", color: "#A78BFA" },
  { name: "Balmer",  nFinal: 2, region: "Visible",     color: "#38BDF8" },
  { name: "Paschen", nFinal: 3, region: "Infrared",    color: "#FB923C" },
];

function renderEnergyLevel(q: NeetQuestion, chapter: ChapterData, subject: string): SvgResult {
  const sc      = subjectColor(subject);
  const qText   = q.questionText || "";
  const topic   = q.topic || "";
  const exp     = q.explanation || "";
  const qLines  = wrap(qText, 72);
  const expLines = wrap(exp, 78).slice(0, 3);
  const optH    = 4 * 76 + 50;
  const H       = Math.max(800, 50 + qLines.length * 20 + 22 + 250 + expLines.length * 18 + 26 + optH + 30);

  let body = "";
  let y = 0;

  body += header(topic, q.neetYear, sc) + "\n";
  y = 56;

  body += panel(20, y, 860, qLines.length * 20 + 22, C.panel, C.border, 8, "a0") + "\n";
  const qr = wrappedTxt(36, y + 18, qText, 72, C.t1, 14, 20, "a0");
  body += qr.svg;
  y = qr.endY + 14;

  // Energy level diagram panel
  const diagH = 242;
  body += panel(20, y, 860, diagH, "#0A0F1A", C.border, 10, "a1") + "\n";
  body += txt(36, y + 17, "BOHR ENERGY LEVELS — HYDROGEN", C.t3, 11, "bold", "start", "a1") + "\n";

  const lx1 = 160, lx2 = 530;
  const topY = y + 36, botY = y + 232;

  for (let i = 0; i < BOHR_LEVELS.length; i++) {
    const lvl  = BOHR_LEVELS[i];
    const anim = `a${Math.min(1 + i, 6)}`;
    const ly   = Math.round(topY + (botY - topY) * lvl.yFrac);

    body += `<line x1="${lx1}" y1="${ly}" x2="${lx2}" y2="${ly}" stroke="${sc}" stroke-width="1.5" class="${anim}"/>`;
    body += txt(lx1 - 52, ly + 5, `n = ${lvl.n}`, C.t1, 13, "bold", "end", anim) + "\n";
    body += txt(lx2 + 8,  ly + 5, lvl.E, sc, 12, "normal", "start", anim) + "\n";

    if (lvl.n === 1) {
      body += `<circle cx="${(lx1 + lx2) / 2}" cy="${ly}" r="5" fill="${C.warn}" class="${anim} pulse"/>`;
      body += txt((lx1 + lx2) / 2 + 10, ly - 5, "e⁻", C.warn, 11, "normal", "start", anim) + "\n";
    }
  }

  // Transition arrows for Lyman, Balmer, Paschen
  for (let si = 0; si < SERIES.length; si++) {
    const ser    = SERIES[si];
    const nFrom  = Math.min(4, ser.nFinal + 2);
    const from   = BOHR_LEVELS.find(l => l.n === nFrom);
    const to     = BOHR_LEVELS.find(l => l.n === ser.nFinal);
    if (!from || !to) continue;
    const color  = ser.color;
    const anim   = `a${Math.min(4 + si, 6)}`;
    const ax     = lx1 + 50 + si * 55;
    const fy     = Math.round(topY + (botY - topY) * from.yFrac);
    const ty     = Math.round(topY + (botY - topY) * to.yFrac);

    body += `<line x1="${ax}" y1="${fy}" x2="${ax}" y2="${ty + 7}" stroke="${color}" stroke-width="2.5" class="${anim}"/>`;
    body += `<polygon points="${ax},${ty} ${ax - 6},${ty + 13} ${ax + 6},${ty + 13}" fill="${color}" class="${anim}"/>`;
    body += txt(ax + 7, (fy + ty) / 2, ser.name, color, 10, "normal", "start", anim) + "\n";
  }

  // Legend
  const legX = lx2 + 80;
  for (let si = 0; si < SERIES.length; si++) {
    const ser = SERIES[si];
    const ly  = y + 50 + si * 58;
    body += `<rect x="${legX}" y="${ly}" width="12" height="12" fill="${ser.color}" class="a2"/>`;
    body += txt(legX + 16, ly + 11, ser.name,   ser.color, 12, "bold",   "start", "a2") + "\n";
    body += txt(legX + 16, ly + 26, ser.region, C.t3,      11, "normal", "start", "a2") + "\n";
  }
  // Formula
  body += txt(legX, y + 186, "Eₙ = −13.6/n²", C.formula, 13, "bold", "start", "a2") + "\n";

  y += diagH + 12;

  const expH = expLines.length * 18 + 24;
  body += panel(20, y, 860, expH, "#0C1824", C.formula + "44", 8, "a3") + "\n";
  let ey = y + 18;
  for (const l of expLines) {
    body += txt(36, ey, l, C.t2, 13, "normal", "start", "a3") + "\n";
    ey += 18;
  }
  y = ey + 12;

  const { svg: optSvg, endY } = optionBreakdown(q, y, subject);
  body += optSvg;

  return {
    template: "energy_level",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${H}" width="900" height="${H}">\n${styles()}\n<rect width="900" height="${H}" fill="${C.bg}"/>\n${body}\n</svg>`,
  };
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateExplanationSvg(
  question: NeetQuestion,
  subject: string,
  chapter: ChapterData = {},
): SvgResult {
  const topic  = (question.topic || "").toLowerCase();
  const qType  = (question.questionType || "").toLowerCase();
  const qText  = (question.questionText || "").toLowerCase();

  // Optics → ray diagram
  if (/optic|refract|reflect|lens|mirror|tir|total internal|snell|diffract|interfere|young|critical angle/.test(topic))
    return renderRayDiagram(question, chapter, subject);

  // Electricity → circuit
  if (/circuit|resistance|current|voltage|kirchhoff|wheatstone|ohm|electrical/.test(topic))
    return renderCircuitDiagram(question, chapter, subject);

  // Mechanics → force diagram
  if (/force|newton|friction|incline|projectile|laws of motion|fbd/.test(topic))
    return renderForceDiagram(question, chapter, subject);

  // Modern physics → energy levels
  if (/bohr|energy level|hydrogen spectrum|photoelectric|quantum|atomic model|electronic config|wave.particle|radial node/.test(topic))
    return renderEnergyLevel(question, chapter, subject);

  // Biology/chemistry cycles → process flow
  const combined = topic + " " + qText;
  if (/photosynthesis|respiration|digestion|meiosis|mitosis|cell cycle|nitrogen cycle|krebs|glycolysis|electron transport|menstrual|spermatogenesis|oogenesis/.test(combined))
    return renderProcessFlow(question, chapter, subject);

  // Numerical → solver
  if (qType === "numerical" || /calculate|find the|what is the value|determine|how many/.test(qText))
    return renderNumericalSolver(question, chapter, subject);

  // Default → option breakdown
  return renderOptionBreakdown(question, chapter, subject);
}
