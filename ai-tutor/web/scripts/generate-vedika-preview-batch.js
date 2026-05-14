const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "public");

const LESSONS = [
  { level: 1, file: "math-svgs/level_1/VM_L1_2_TABLES_11_TO_19/ekadhikena-pattern-card.svg", title: "Ekadhikena Pattern", subtitle: "Use the one-more pattern to build tables from 11 to 19 quickly.", left: ["Rule", "14 x 7"], center: ["Notice", "grow by pattern"], right: ["Result", "98"] },
  { level: 1, file: "math-svgs/level_1/VM_L1_3_DOUBLING_HALVING/factor-balance-beam.svg", title: "Doubling and Halving", subtitle: "Halve one factor, double the other, and the product stays balanced.", left: ["Start", "16 x 25"], center: ["Transform", "8 x 50"], right: ["Same Answer", "400"] },
  { level: 1, file: "math-svgs/level_1/VM_L1_4_MULT_BY_11/two-digit-by-11-panel.svg", title: "Multiply by 11", subtitle: "Add the middle digits and place the sum between the outside digits.", left: ["Number", "43"], center: ["Middle Sum", "4 + 3 = 7"], right: ["Answer", "473"] },
  { level: 1, file: "math-svgs/level_1/VM_L1_5_SUBT_BORROW_FREE/complement-subtraction-panel.svg", title: "Borrow-Free Subtraction", subtitle: "Subtract from 9, then subtract the last digit from 10.", left: ["Original", "637"], center: ["Complement", "3 6 | 3"], right: ["Answer", "363"] },
  { level: 1, file: "math-svgs/level_1/VM_L1_6_MULT_BY_5_25/5-and-25-shortcut-board.svg", title: "Multiply by 5 and 25", subtitle: "Shrink first, then shift the answer into tens or hundreds.", left: ["x5", "48 x 5"], center: ["x25", "16 x 25"], right: ["Mental Rule", "halve or quarter"] },
  { level: 1, file: "math-svgs/level_1/VM_L1_7_NEAR_100/near-100-number-line.svg", title: "Near-100 Mental Math", subtitle: "Measure the gap from 100 and use that distance as your shortcut.", left: ["Number", "96"], center: ["Distance", "4 away"], right: ["Base", "100"] },
  { level: 1, file: "math-svgs/level_1/VM_L1_8_CRISS_CROSS_2DIG/criss-cross-2digit-frame.svg", title: "Criss-Cross 2-Digit", subtitle: "Straight, cross, straight gives the three answer bands.", left: ["Digits", "23 and 14"], center: ["Method", "cross middle"], right: ["Product", "3 bands"] },

  { level: 2, file: "math-svgs/level_2/VM_L2_1_NIKHILAM_NEAR100/near-100-multiplication-board.svg", title: "Near-100 Multiplication", subtitle: "Use deviations from 100 and keep the right side padded cleanly.", left: ["Base", "100"], center: ["Deviation", "-2 and -3"], right: ["Answer", "9506"] },
  { level: 2, file: "math-svgs/level_2/VM_L2_2_ANURUPYENA_3DIG/anurupyena-base-scaling-panel.svg", title: "Anurupyena Scaling", subtitle: "Scale to a friendlier base, then keep the proportion balanced.", left: ["Problem", "250 x 36"], center: ["Friendly Base", "1000 x 9"], right: ["Answer", "9000"] },
  { level: 2, file: "math-svgs/level_2/VM_L2_3_CRISS_CROSS_3DIG/criss-cross-3digit-frame.svg", title: "Criss-Cross 3-Digit", subtitle: "Expand the cross pattern into five bands for bigger products.", left: ["Digits", "3-digit x 3-digit"], center: ["Bands", "5 cross bands"], right: ["Flow", "carry each band"] },
  { level: 2, file: "math-svgs/level_2/VM_L2_4_DIVISION_BY_9/division-by-9-board.svg", title: "Division by 9", subtitle: "Build the quotient from running totals and finish with the remainder.", left: ["Divisor", "9"], center: ["Quotient", "running sum"], right: ["Remainder", "final digit"] },
  { level: 2, file: "math-svgs/level_2/VM_L2_5_SQUARES_NEAR50/anchor-base-squaring-panel.svg", title: "Squaring Near 50", subtitle: "Use 50 as the anchor, square the gap, then combine both parts.", left: ["Number", "48^2"], center: ["Gap", "50 - 2"], right: ["Answer", "2304"] },
  { level: 2, file: "math-svgs/level_2/VM_L2_6_FRACTIONS_SPEED/fraction-card.svg", title: "Fast Fractions", subtitle: "Reduce by factors first so the fraction becomes lighter to compute.", left: ["Fraction", "24 / 36"], center: ["Simplify", "divide by 12"], right: ["Answer", "2 / 3"] },
  { level: 2, file: "math-svgs/level_2/VM_L2_7_DECIMAL_SPEED/decimal-shift-arrows-left-right.svg", title: "Decimal Shift", subtitle: "Move the decimal right for x10 and left for divide by 10.", left: ["Divide", "0.375"], center: ["Start", "3.75"], right: ["Multiply", "37.5"] },
  { level: 2, file: "math-svgs/level_2/VM_L2_8_DIVISION_FLAG/flag-division-board.svg", title: "Flag Division", subtitle: "Divide, write the quotient digit, and carry the remainder forward.", left: ["Flag", "d"], center: ["Digits", "a b c"], right: ["Rule", "divide then carry"] },

  { level: 3, file: "math-svgs/level_3/VM_L3_1_VINCULUM/standard-vs-vinculum-compare.svg", title: "Vinculum Numbers", subtitle: "Transform standard digits into bar notation for cleaner mental computation.", left: ["Standard", "376"], center: ["Transform", "rebalance digits"], right: ["Vinculum", "bar form"] },
  { level: 3, file: "math-svgs/level_3/VM_L3_2_INTEGER_MULT/sign-rule-card.svg", title: "Integer Multiplication", subtitle: "Use sign rules and structure together so negative multiplication stays predictable.", left: ["Rule", "+ x -"], center: ["Example", "12 x (-3)"], right: ["Result", "-36"] },
  { level: 3, file: "math-svgs/level_3/VM_L3_3_NIKHILAM_BASE10/any-base-cross-board.svg", title: "Nikhilam Any Base", subtitle: "Choose the nearest base and use deviations for fast products.", left: ["Base", "100"], center: ["Deviation", "+3 and -3"], right: ["Answer", "9991"] },
  { level: 3, file: "math-svgs/level_3/VM_L3_4_RATIO_SHORTCUT/ratio-strip.svg", title: "Ratio Shortcuts", subtitle: "Simplify both sides and compare ratios without long division.", left: ["Original", "18 : 24"], center: ["Simplify", "3 : 4"], right: ["Compare", "same ratio"] },
  { level: 3, file: "math-svgs/level_3/VM_L3_5_HCF_LCM_VEDIC/factor-overlap-panel.svg", title: "HCF and LCM", subtitle: "Spot the shared factors and overlaps before doing mechanical work.", left: ["Factors", "12 and 18"], center: ["Overlap", "2 x 3"], right: ["Use", "6 and 36"] },
  { level: 3, file: "math-svgs/level_3/VM_L3_6_SQUARES_2DIG/square-expansion-strip.svg", title: "Square 2-Digit Numbers", subtitle: "Break a square into left part, middle duplex, and final correction.", left: ["Number", "47^2"], center: ["Duplex", "4^2 | 2x4x7"], right: ["Square", "2209"] },
  { level: 3, file: "math-svgs/level_3/VM_L3_7_PARAVARTYA_DIV/paravartya-division-board.svg", title: "Paravartya Division", subtitle: "Carry the adjustment through each digit when dividing near a power of ten.", left: ["Divisor", "12"], center: ["Adjust", "use -2"], right: ["Quotient", "step by step"] },
  { level: 3, file: "math-svgs/level_3/VM_L3_8_ALGEBRA_SPEED/samyasamuccaye-card.svg", title: "Algebra by Inspection", subtitle: "Recognize the structure and solve special equations without full expansion.", left: ["Pattern", "same sum"], center: ["Spot", "balance terms"], right: ["Solve", "x in one step"] },

  { level: 4, file: "math-svgs/level_4/VM_L4_1_SQUARING_NEAR_BASE/near-base-square-board-advanced.svg", title: "Squaring Near Any Base", subtitle: "Use the nearby base, deviation, and right-side square to finish fast.", left: ["Base", "1000"], center: ["Gap", "996 = -4"], right: ["Square", "992016"] },
  { level: 4, file: "math-svgs/level_4/VM_L4_2_RATIONAL_ADD/cross-multiply-fraction-board.svg", title: "Rational Addition Speed", subtitle: "Cross-multiply fractions without getting stuck in long LCD work.", left: ["Fractions", "2/3 + 1/4"], center: ["Cross", "8 + 3"], right: ["Combine", "11/12"] },
  { level: 4, file: "math-svgs/level_4/VM_L4_3_LINEAR_EQ_VEDIC/paravartya-equation-board.svg", title: "Linear Equations", subtitle: "Move structure, not clutter, and solve multi-step equations with less writing.", left: ["Equation", "3x + 5 = 20"], center: ["Shift", "20 - 5"], right: ["Solve", "x = 5"] },
  { level: 4, file: "math-svgs/level_4/VM_L4_4_CUBING_ANURUPYENA/cube-expansion-grid.svg", title: "Cubing with Anurupyena", subtitle: "Use the a^3, 3a^2b, 3ab^2, b^3 structure to cube with confidence.", left: ["Parts", "a and b"], center: ["Expansion", "1 : 3 : 3 : 1"], right: ["Cube", "combine terms"] },
  { level: 4, file: "math-svgs/level_4/VM_L4_5_NIKHILAM_3DIG/near-1000-multiplication-board.svg", title: "Multiply Near 1000", subtitle: "Use three-digit deviations from 1000 and pad the right side cleanly.", left: ["Numbers", "1003 x 997"], center: ["Deviation", "+3 and -3"], right: ["Answer", "999991"] },
  { level: 4, file: "math-svgs/level_4/VM_L4_6_EXPONENT_PATTERNS/power-growth-ladder.svg", title: "Exponent Patterns", subtitle: "Turn repeated growth into patterns you can predict mentally.", left: ["Base", "2, 3, 5"], center: ["Growth", "power ladder"], right: ["Pattern", "see the rule"] },
  { level: 4, file: "math-svgs/level_4/VM_L4_7_TRIANGLE_SHORTCUTS/triangle-area-board.svg", title: "Triangle Area Shortcuts", subtitle: "Use triples and base-height structure for quick area finding.", left: ["Triangle", "right triangle"], center: ["Base x Height", "1/2 x b x h"], right: ["Area", "quick result"] },
  { level: 4, file: "math-svgs/level_4/VM_L4_8_ALGEBRAIC_IDENTITIES/identity-flow-board.svg", title: "Algebraic Identities", subtitle: "Recall common expansions as fixed visual patterns.", left: ["Identity", "(a+b)^2"], center: ["Pattern", "a^2 + 2ab"], right: ["Expansion", "plus b^2"] },

  { level: 5, file: "math-svgs/level_5/VM_L5_1_SQUARE_ROOTS/square-root-inspection-board.svg", title: "Square Root by Inspection", subtitle: "Group digits, inspect the nearest square, and pin down the root.", left: ["Pairs", "2025"], center: ["Nearest Square", "44^2 < n < 46^2"], right: ["Root", "45"] },
  { level: 5, file: "math-svgs/level_5/VM_L5_2_CUBE_ROOTS/cube-root-inspection-board.svg", title: "Cube Root by Inspection", subtitle: "Use last-digit cues and digit-grouping to lock onto the cube root.", left: ["Triples", "17576"], center: ["Inspect", "ends with 6"], right: ["Cube Root", "26"] },
  { level: 5, file: "math-svgs/level_5/VM_L5_3_ALGEBRAIC_IDENTITIES_ADV/pascal-row-1331-card.svg", title: "Advanced Cubic Identities", subtitle: "Use the 1-3-3-1 row to expand cubes with speed.", left: ["Pattern", "(a+b)^3"], center: ["Coefficients", "1 3 3 1"], right: ["Expansion", "structured cube"] },
  { level: 5, file: "math-svgs/level_5/VM_L5_4_SIMULTANEOUS_EQ/equation-pair-panel.svg", title: "Simultaneous Equations", subtitle: "Compare two equations side by side and solve with elimination or substitution.", left: ["Eq 1", "2x + y = 7"], center: ["Eq 2", "x - y = 2"], right: ["Solution", "(3,1)"] },
  { level: 5, file: "math-svgs/level_5/VM_L5_5_CRISS_CROSS_4DIG/criss-cross-4digit-frame.svg", title: "Criss-Cross 4-Digit", subtitle: "Extend straight-cross-straight thinking across seven bands.", left: ["Digits", "4-digit x 4-digit"], center: ["Bands", "7 cross bands"], right: ["Product", "normalize carries"] },
  { level: 5, file: "math-svgs/level_5/VM_L5_6_PERCENTAGE_SPEED/percent-flow-lane.svg", title: "Percentage Speed Arithmetic", subtitle: "Break percentages into friendly chunks you can add mentally.", left: ["Percent", "18% of 250"], center: ["Decompose", "10 + 5 + 3"], right: ["Answer", "45"] },
  { level: 5, file: "math-svgs/level_5/VM_L5_7_NIKHILAM_LARGE/large-base-multiplication-board.svg", title: "Multiply Near 10000", subtitle: "Anchor to 10000 and pad the right side with confidence.", left: ["Base", "10000"], center: ["Deviation", "plus or minus gap"], right: ["Answer", "split result"] },
  { level: 5, file: "math-svgs/level_5/VM_L5_8_DIVISIBILITY_ADVANCED/divisibility-decision-box.svg", title: "Advanced Divisibility", subtitle: "Use repeating digit tests for 7, 11, and 13 without long division.", left: ["Rule", "7 11 13"], center: ["Test", "reduce digits"], right: ["Decision", "divisible or not"] },
];

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrapLine(text, maxChars = 13) {
  const words = String(text).split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function renderCenteredLines(cx, y, lines, fontSize, weight, color, family = "Arial, sans-serif", lineGap = 24) {
  return lines
    .map((line, index) => `<text x="${cx}" y="${y + index * lineGap}" text-anchor="middle" font-family="${family}" font-size="${fontSize}" font-weight="${weight}" fill="${color}">${esc(line)}</text>`)
    .join("\n");
}

function card(x, y, w, h, fill, stroke, heading, body) {
  const headingLines = wrapLine(heading, 12);
  const bodyLines = wrapLine(body, 14);
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
    ${renderCenteredLines(x + w / 2, y + 30, headingLines, 17, 700, stroke, "Arial, sans-serif", 20)}
    ${renderCenteredLines(x + w / 2, y + 76, bodyLines, 15, 700, "#111827", "Consolas, 'Courier New', monospace", 20)}
  `;
}

function makeSvg(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
  <rect width="800" height="400" rx="20" fill="#f8fafc"/>
  <rect x="20" y="20" width="760" height="360" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <text x="44" y="58" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#64748b">VEDIKA LEVEL ${item.level}</text>
  <text x="400" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#1e293b">${esc(item.title)}</text>
  <text x="400" y="114" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#475569">${esc(item.subtitle)}</text>
  <g transform="translate(84 154)">
    ${card(0, 0, 180, 132, "#eef2ff", "#4f46e5", item.left[0], item.left[1])}
    ${card(226, 0, 180, 132, "#fff7ed", "#ea580c", item.center[0], item.center[1])}
    ${card(452, 0, 180, 132, "#ecfdf5", "#16a34a", item.right[0], item.right[1])}
    <circle cx="316" cy="118" r="10" fill="#3b82f6">
      <animate attributeName="r" values="10;14;10" dur="1.9s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>`;
}

for (const item of LESSONS) {
  const out = path.join(ROOT, item.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, makeSvg(item), "utf8");
  console.log("wrote", item.file);
}
