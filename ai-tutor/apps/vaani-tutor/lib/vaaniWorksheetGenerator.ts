/**
 * Vaani AI — Offline Practice Worksheet Generator
 *
 * Draws an A4 practice worksheet on an off-screen canvas (so Devanagari
 * renders using the browser's native font engine), then encodes as a PNG
 * and wraps it in a PDF via jsPDF for automatic download.
 */

// ── Types ────────────────────────────────────────────────────────────────────

import { getStrokeGuide } from "@/lib/vaaniStrokeGuides";

export interface WorksheetData {
  lessonId:    string;
  lessonTitle: string;   // e.g. "अ for अनार"
  char:        string;   // Hindi letter, e.g. "अ"
  wordHindi:   string;   // e.g. "अनार"
  wordEnglish: string;   // e.g. "Pomegranate"
  romanSound:  string;   // e.g. "a"
  level:       number;   // 1–6
  studentName?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// A4 at 150 dpi — good balance of quality vs file size
const W = 1240;  // 210mm × (150/25.4)
const H = 1754;  // 297mm × (150/25.4)

const PAD   = 60;
const CORAL   = "#f97316";
const INK     = "#172033";
const SOFT    = "#64748b";
const LINE    = "#e2e8f0";
const GREEN   = "#10b981";
const PURPLE  = "#7c3aed";
const LIGHT   = "#f8fafc";

// ── Helpers ───────────────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number, fill?: string, stroke?: string, lineWidth = 1,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  if (fill)   { ctx.fillStyle   = fill;   ctx.fill();   }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function dashedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r = 12, color = "#cbd5e1",
) {
  ctx.save();
  ctx.setLineDash([8, 6]);
  roundRect(ctx, x, y, w, h, r, undefined, color, 2);
  ctx.restore();
}

function sectionLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = CORAL) {
  ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function bodyText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 18, color = SOFT) {
  ctx.font = `${size}px 'Segoe UI', Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// Draw a single letter-trace box (ghost letter + dashed border)
function traceBox(
  ctx: CanvasRenderingContext2D,
  char: string, x: number, y: number, size: number,
  shade = "rgba(249,115,22,0.12)",
) {
  // Background
  roundRect(ctx, x, y, size, size, 14, shade, CORAL + "44", 1.5);
  // Ghost letter
  ctx.font = `${size * 0.58}px serif`;
  ctx.fillStyle = "rgba(23,32,51,0.12)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, x + size / 2, y + size / 2);
  // Dashed outer border
  ctx.save();
  ctx.setLineDash([6, 5]);
  ctx.strokeStyle = CORAL + "88";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect?.(x + 4, y + 4, size - 8, size - 8, 10);
  ctx.stroke();
  ctx.restore();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

// Draw a blank write-box
function blankBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  roundRect(ctx, x, y, w, h, 12, "white", LINE, 1.5);
  // Faint midline guide
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.moveTo(x + 10, y + h / 2);
  ctx.lineTo(x + w - 10, y + h / 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function starRow(ctx: CanvasRenderingContext2D, x: number, y: number, count = 5) {
  const stars = ["☆", "☆", "☆", "☆", "☆"];
  ctx.font = "28px serif";
  ctx.fillStyle = "#fbbf24";
  stars.slice(0, count).forEach((s, i) => {
    ctx.fillText(s, x + i * 36, y);
  });
}

// ── Main generator ─────────────────────────────────────────────────────────────

function strokeStepBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  stepNumber: number,
  label: string,
  path: string,
  accent = CORAL,
) {
  roundRect(ctx, x, y, w, h, 16, "#fff7ed", CORAL + "33", 1.5);
  roundRect(ctx, x + 12, y + 12, 28, 28, 14, accent);

  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(stepNumber), x + 26, y + 26);

  ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(label, x + 50, y + 31);

  const previewX = x + 18;
  const previewY = y + 52;
  const previewSize = Math.min(w - 36, h - 70);
  roundRect(ctx, previewX, previewY, previewSize, previewSize, 12, "white", LINE, 1);

  ctx.save();
  ctx.translate(previewX, previewY);
  ctx.scale(previewSize / 100, previewSize / 100);
  ctx.lineWidth = 6;
  ctx.strokeStyle = accent;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D(path));
  ctx.restore();
}

export async function generateWorksheet(data: WorksheetData): Promise<void> {
  // ── 1. Create off-screen canvas ─────────────────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, W, H);

  // ── 2. HEADER ───────────────────────────────────────────────────────────────
  // Orange top stripe
  roundRect(ctx, 0, 0, W, 110, 0, CORAL);

  // Logo text
  ctx.font = "bold 36px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText("🎙 VAANI AI TUTOR", PAD, 52);

  // Level badge
  roundRect(ctx, W - PAD - 120, 20, 120, 36, 18, "rgba(255,255,255,0.22)");
  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "right";
  ctx.fillText(`Level ${data.level} Worksheet`, W - PAD - 10, 43);
  ctx.textAlign = "left";

  // Subtitle
  ctx.font = "18px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText("Hindi Practice Sheet — Print · Trace · Upload · Earn XP! ⭐", PAD, 84);

  // ── 3. LESSON TITLE BAR ─────────────────────────────────────────────────────
  roundRect(ctx, PAD, 124, W - PAD * 2, 70, 16, LIGHT, LINE, 1);

  // Large lesson char
  ctx.font = "bold 52px serif";
  ctx.fillStyle = CORAL;
  ctx.fillText(data.char, PAD + 18, 173);

  // Lesson name
  ctx.font = "bold 28px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = INK;
  ctx.fillText(data.lessonTitle, PAD + 80, 166);
  ctx.font = "16px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = SOFT;
  ctx.fillText(`Sound: "${data.romanSound}" · Word: ${data.wordHindi} (${data.wordEnglish})`, PAD + 80, 188);

  // Name / Date line
  ctx.font = "16px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = SOFT;
  const nameLabel = `Name: ${data.studentName || "___________________________"}`;
  ctx.fillText(nameLabel, PAD, 228);
  ctx.fillText("Date: _______________", W / 2 + 20, 228);
  // Underlines
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  if (!data.studentName) {
    ctx.beginPath(); ctx.moveTo(PAD + 58, 232); ctx.lineTo(PAD + 58 + 240, 232); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(W / 2 + 75, 232); ctx.lineTo(W / 2 + 75 + 180, 232); ctx.stroke();

  // Divider
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(PAD, 248); ctx.lineTo(W - PAD, 248); ctx.stroke();

  const strokeGuide = getStrokeGuide(data.char);

  // ── 4. PART 1: TRACE THE LETTER ─────────────────────────────────────────────
  let y = 264;
  sectionLabel(ctx, "✏️  PART 1 — Trace the Letter", PAD, y + 22);
  bodyText(ctx, "Trace each box slowly. Say the sound aloud each time!", PAD, y + 46);

  y += 62;
  if (strokeGuide) {
    sectionLabel(ctx, "1-2-3 Build It First", PAD, y + 12, PURPLE);
    bodyText(ctx, strokeGuide.chant, PAD, y + 36, 16);
    y += 48;

    const steps = strokeGuide.steps.slice(0, 4);
    const stepGap = 16;
    const stepW = Math.floor((W - PAD * 2 - stepGap * (steps.length - 1)) / steps.length);
    const stepH = 168;

    steps.forEach((step, index) => {
      const sx = PAD + index * (stepW + stepGap);
      strokeStepBox(ctx, sx, y, stepW, stepH, index + 1, step.label, step.path);
    });

    y += stepH + 24;
  }

  // 8 trace boxes in 2 rows of 4
  const boxSize = strokeGuide ? 140 : 168;
  const boxGap  = 18;
  const totalW  = 4 * boxSize + 3 * boxGap;
  const startX  = (W - totalW) / 2;

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const bx = startX + col * (boxSize + boxGap);
      const by = y + row * (boxSize + boxGap);
      traceBox(ctx, data.char, bx, by, boxSize);
      // Small counter label
      ctx.font = "13px 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "center";
      ctx.fillText(`#${row * 4 + col + 1}`, bx + boxSize / 2, by + boxSize + 16);
      ctx.textAlign = "left";
    }
  }

  // ── 5. PART 2: WRITE ON YOUR OWN ────────────────────────────────────────────
  y += 2 * boxSize + boxGap + 38;

  // Section bg strip
  roundRect(ctx, 0, y - 6, W, 2, 0, LINE);
  y += 16;
  sectionLabel(ctx, "✍️  PART 2 — Write On Your Own", PAD, y + 22, PURPLE);
  bodyText(ctx, "No guide this time! Write the letter from memory.", PAD, y + 46);
  y += 58;

  // 5 blank boxes
  const blankW = Math.floor((W - PAD * 2 - 4 * 16) / 5);
  const blankH = 130;
  for (let i = 0; i < 5; i++) {
    blankBox(ctx, PAD + i * (blankW + 16), y, blankW, blankH);
    ctx.font = "13px 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "center";
    ctx.fillText(`#${i + 1}`, PAD + i * (blankW + 16) + blankW / 2, y + blankH + 16);
    ctx.textAlign = "left";
  }

  // ── 6. PART 3: WORD CONNECTION ───────────────────────────────────────────────
  y += blankH + 42;
  roundRect(ctx, 0, y - 6, W, 2, 0, LINE);
  y += 18;
  sectionLabel(ctx, "🔗  PART 3 — Remember the Word", PAD, y + 22, GREEN);
  bodyText(ctx, `The letter ${data.char} (${data.romanSound}) starts the word:`, PAD, y + 46);
  y += 62;

  // Word card
  const cardW = W - PAD * 2;
  const cardH = 130;
  roundRect(ctx, PAD, y, cardW, cardH, 20,
    "linear-gradient(135deg,#fff7ed,#fff)" as any,  // fillStyle handles plain colors
    CORAL + "44", 2);
  // Gradient workaround — use plain fill
  roundRect(ctx, PAD, y, cardW, cardH, 20, "#fff7ed", CORAL + "66", 2);

  // Letter → arrow → word → English
  const cx = PAD + cardH / 2;
  ctx.font = `bold ${cardH * 0.55}px serif`;
  ctx.fillStyle = CORAL;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(data.char, cx, y + cardH / 2);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Arrow
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("→", PAD + cardH + 20, y + cardH / 2 + 10);

  // Hindi word
  ctx.font = `bold 54px serif`;
  ctx.fillStyle = INK;
  ctx.fillText(data.wordHindi, PAD + cardH + 80, y + cardH / 2 + 18);

  // English below
  ctx.font = "20px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = SOFT;
  ctx.fillText(`(${data.wordEnglish})`, PAD + cardH + 80, y + cardH / 2 + 50);

  // Box: copy the word
  const copyW = 260;
  roundRect(ctx, W - PAD - copyW, y + 14, copyW, cardH - 28, 12, "white", "#e2e8f0", 1.5);
  ctx.font = "14px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "center";
  ctx.fillText("Write the word here:", W - PAD - copyW / 2, y + 40);
  ctx.textAlign = "left";

  // ── 7. PART 4: DRAW SOMETHING ────────────────────────────────────────────────
  y += cardH + 40;
  roundRect(ctx, 0, y - 6, W, 2, 0, LINE);
  y += 18;
  sectionLabel(ctx, `🎨  PART 4 — Draw Something Starting with ${data.char}`, PAD, y + 22, "#d97706");
  bodyText(ctx, `Think of any word that starts with "${data.romanSound}" sound and draw it!`, PAD, y + 46);
  y += 58;

  const drawBoxH = H - y - 186;   // fill remaining space
  dashedRect(ctx, PAD, y, W - PAD * 2, drawBoxH, 20, "#d97706" + "66");
  // Tiny hint in corner
  ctx.font = "italic 15px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#d9770644";
  ctx.textAlign = "center";
  ctx.fillText(`Draw something starting with ${data.char} (${data.romanSound})`, W / 2, y + drawBoxH / 2);
  ctx.textAlign = "left";

  // ── 8. FOOTER — Parent sign-off ──────────────────────────────────────────────
  const footerY = H - 168;
  roundRect(ctx, 0, footerY, W, 168, 0, "#f8fafc", LINE, 1);

  // Star rating row
  ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = INK;
  ctx.fillText("⭐  Parent Rating:", PAD, footerY + 34);
  starRow(ctx, PAD + 180, footerY + 36);

  // Sign-off line
  ctx.font = "16px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = SOFT;
  ctx.fillText("My child practised today!   Signature: ____________________________", PAD, footerY + 70);

  // Upload prompt
  roundRect(ctx, PAD, footerY + 86, W - PAD * 2, 52, 12,
    CORAL + "11", CORAL + "44", 1.5);
  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = CORAL;
  ctx.textAlign = "center";
  ctx.fillText(
    `📸  Scan & Upload at robodynamics.in/vaani  →  Earn +50 Bonus XP! 🚀`,
    W / 2, footerY + 117,
  );
  ctx.textAlign = "left";

  // Lesson ID small
  ctx.font = "12px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText(`Lesson: ${data.lessonId}  ·  vaani.robodynamics.in`, PAD, footerY + 154);
  ctx.textAlign = "right";
  ctx.fillText("© RoboDynamics — Vaani AI Tutor", W - PAD, footerY + 154);
  ctx.textAlign = "left";

  // ── 9. Export canvas → jsPDF → download ─────────────────────────────────────
  const imgData = canvas.toDataURL("image/jpeg", 0.90);

  // Dynamically import jsPDF (keeps the chunk out of the initial bundle)
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);

  const filename = `vaani-practice-${data.lessonId}-${data.char}.pdf`;
  pdf.save(filename);
}
