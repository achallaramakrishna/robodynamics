import fs from "fs";
import path from "path";

const ROOT = path.resolve("public", "math-svgs");

const LESSONS = {
  VM_L2_2_ANURUPYENA_3DIG: {
    level: "level_2",
    title: "Anurupyena",
    subtitle: "Proportional 3-Digit Multiplication",
    accent: ["#f97316", "#7c3aed"],
    examples: ["125 x 8 = 1000", "250 x 36 = 9000", "125 x 48 = 6000"],
    bullets: [
      "Scale one factor to a friendly base.",
      "Divide the other factor by the same amount.",
      "Use 1000 as the mental anchor whenever possible.",
    ],
  },
  VM_L2_6_FRACTIONS_SPEED: {
    level: "level_2",
    title: "Fraction Simplification",
    subtitle: "Reduce Fractions Quickly",
    accent: ["#0ea5e9", "#2563eb"],
    examples: ["36/48 = 3/4", "18/24 = 3/4", "42/56 = 3/4"],
    bullets: [
      "Spot common factors immediately.",
      "Divide top and bottom by the same factor.",
      "Repeat until the fraction is fully reduced.",
    ],
  },
  VM_L3_2_INTEGER_MULT: {
    level: "level_3",
    title: "Integer Multiplication",
    subtitle: "Sign Rules and Product Flow",
    accent: ["#ef4444", "#f97316"],
    examples: ["(+)(+) = +", "(-)(-) = +", "(+)(-) = -"],
    bullets: [
      "Same signs give a positive product.",
      "Different signs give a negative product.",
      "Decide the sign before multiplying values.",
    ],
  },
  VM_L3_3_NIKHILAM_BASE10: {
    level: "level_3",
    title: "Nikhilam",
    subtitle: "Any Base: 10, 100, 1000",
    accent: ["#22c55e", "#0f766e"],
    examples: ["98 x 97", "1003 x 1008", "12 x 14 near base 10"],
    bullets: [
      "Pick the nearest working base.",
      "Cross-adjust first, then multiply deviations.",
      "Pad the right side to match the base width.",
    ],
  },
  VM_L3_4_RATIO_SHORTCUT: {
    level: "level_3",
    title: "Ratio Shortcuts",
    subtitle: "Fast Comparison and Simplification",
    accent: ["#8b5cf6", "#ec4899"],
    examples: ["12:18 = 2:3", "3:4 vs 6:8", "15:25 = 3:5"],
    bullets: [
      "Simplify before comparing ratios.",
      "Scale both terms equally to test equivalence.",
      "Use common factors to shrink the ratio fast.",
    ],
  },
  VM_L3_5_HCF_LCM_VEDIC: {
    level: "level_3",
    title: "HCF and LCM",
    subtitle: "Factor Overlap Method",
    accent: ["#14b8a6", "#0f766e"],
    examples: ["12, 18 -> HCF 6", "12, 18 -> LCM 36", "Use prime factors"],
    bullets: [
      "HCF uses only common prime factors.",
      "LCM uses every factor at the highest power.",
      "Factor trees make overlaps easy to see.",
    ],
  },
  VM_L3_8_ALGEBRA_SPEED: {
    level: "level_3",
    title: "Algebra by Inspection",
    subtitle: "Samuccaya Pattern Recognition",
    accent: ["#6366f1", "#0ea5e9"],
    examples: ["x + 3 = 9", "2x + 5 = 17", "balance both sides"],
    bullets: [
      "Look for equal totals and cancellation patterns.",
      "Move like terms together before solving.",
      "Use balance thinking to keep equations fair.",
    ],
  },
  VM_L4_6_EXPONENT_PATTERNS: {
    level: "level_4",
    title: "Exponent Patterns",
    subtitle: "Power Growth and Repetition",
    accent: ["#f59e0b", "#ef4444"],
    examples: ["2^3 = 8", "10^4 = 10000", "a^m x a^n = a^(m+n)"],
    bullets: [
      "Exponents count repeated multiplication.",
      "Same-base multiplication adds powers.",
      "Powers grow fast, so track the pattern carefully.",
    ],
  },
  VM_L4_7_TRIANGLE_SHORTCUTS: {
    level: "level_4",
    title: "Triangle Area",
    subtitle: "Base, Height, and Quick Patterns",
    accent: ["#10b981", "#14b8a6"],
    examples: ["Area = 1/2 x b x h", "b = 8, h = 5", "Area = 20"],
    bullets: [
      "Area depends on base and perpendicular height.",
      "Halve early to simplify mental arithmetic.",
      "Check units and diagram orientation carefully.",
    ],
  },
  VM_L4_8_ALGEBRAIC_IDENTITIES: {
    level: "level_4",
    title: "Algebraic Identities",
    subtitle: "Fast Expansion and Grouping",
    accent: ["#3b82f6", "#6366f1"],
    examples: ["(a+b)^2", "(a-b)^2", "(x+3)(x+5)"],
    bullets: [
      "Memorize the common expansion patterns.",
      "Track middle terms with sign awareness.",
      "Use area models to visualize grouped products.",
    ],
  },
  VM_L5_2_CUBE_ROOTS: {
    level: "level_5",
    title: "Cube Roots",
    subtitle: "Inspection Method",
    accent: ["#a855f7", "#7c3aed"],
    examples: ["27 -> 3", "512 -> 8", "1331 -> 11"],
    bullets: [
      "Group digits in triples from the right.",
      "Use the first group to estimate the root.",
      "Use the last digit to choose the final unit digit.",
    ],
  },
  VM_L5_3_ALGEBRAIC_IDENTITIES_ADV: {
    level: "level_5",
    title: "Advanced Identities",
    subtitle: "Binomial Cubes and 1:3:3:1",
    accent: ["#f43f5e", "#8b5cf6"],
    examples: ["(a+b)^3", "(a-b)^3", "1 : 3 : 3 : 1"],
    bullets: [
      "Cubic expansions follow a stable coefficient pattern.",
      "Track signs carefully in each term.",
      "Use Pascal-style thinking for fast recall.",
    ],
  },
  VM_L5_4_SIMULTANEOUS_EQ: {
    level: "level_5",
    title: "Simultaneous Equations",
    subtitle: "Elimination and Substitution",
    accent: ["#0ea5e9", "#06b6d4"],
    examples: ["x + y = 9", "x - y = 3", "x = 6, y = 3"],
    bullets: [
      "Line up coefficients before eliminating.",
      "Substitute once one variable is isolated.",
      "Check the final pair in both equations.",
    ],
  },
  VM_L5_6_PERCENTAGE_SPEED: {
    level: "level_5",
    title: "Percentage Speed",
    subtitle: "10%, 5%, 1% and Beyond",
    accent: ["#22c55e", "#84cc16"],
    examples: ["10% of 240 = 24", "5% is half of 10%", "1% shifts two places"],
    bullets: [
      "Build percentages from 10%, 5%, and 1%.",
      "Split gains, discounts, and tax into chunks.",
      "Combine small percent pieces mentally.",
    ],
  },
  VM_L5_7_NIKHILAM_LARGE: {
    level: "level_5",
    title: "Nikhilam Near 10000",
    subtitle: "Large Base Multiplication",
    accent: ["#f97316", "#dc2626"],
    examples: ["9996 x 9994", "base = 10000", "pad to 4 right digits"],
    bullets: [
      "Use 10000 as the base anchor.",
      "Cross-adjust the left side first.",
      "Right side uses the product of deficits with four digits.",
    ],
  },
  VM_L5_8_DIVISIBILITY_ADVANCED: {
    level: "level_5",
    title: "Divisibility Rules",
    subtitle: "Advanced Rules for 7, 11, and 13",
    accent: ["#eab308", "#f97316"],
    examples: ["11: alternating sum", "7: transform and reduce", "13: repeat until small"],
    bullets: [
      "Reduce large numbers using the rule repeatedly.",
      "Keep the transformation consistent each time.",
      "Verify with a small final number at the end.",
    ],
  },
};

function titleCase(value) {
  return value
    .replace(/\.svg$/i, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function roleFromFile(file) {
  const name = file.toLowerCase();
  if (name.includes("wheel")) return "Mapping Wheel";
  if (name.includes("ladder")) return "Step Ladder";
  if (name.includes("strip")) return "Shortcut Strip";
  if (name.includes("grid")) return "Pattern Grid";
  if (name.includes("board")) return "Worked Board";
  if (name.includes("panel")) return "Concept Panel";
  if (name.includes("card")) return "Rule Card";
  if (name.includes("line")) return "Base Line";
  if (name.includes("flow")) return "Flow Panel";
  if (name.includes("lane")) return "Flow Lane";
  if (name.includes("beam")) return "Balance Beam";
  if (name.includes("scale")) return "Balance Scale";
  if (name.includes("selector")) return "Selector";
  if (name.includes("box")) return "Focus Box";
  if (name.includes("highlight")) return "Highlight";
  if (name.includes("chip")) return "Value Chip";
  if (name.includes("tag")) return "Quick Tag";
  if (name.includes("marker")) return "Marker";
  if (name.includes("arrow")) return "Arrow Guide";
  return "Visual Guide";
}

function humanFile(file) {
  return titleCase(file)
    .replace(/\bSvg\b/g, "")
    .trim();
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(config, file) {
  const role = roleFromFile(file);
  const [accentA, accentB] = config.accent;
  const bullets = config.bullets
    .map(
      (bullet, index) => `
    <g transform="translate(0 ${index * 40})">
      <circle cx="13" cy="13" r="7" fill="${accentA}" />
      <text x="34" y="19" font-family="Segoe UI, Arial" font-size="19" fill="#334155">${escapeXml(bullet)}</text>
    </g>`
    )
    .join("");

  const tileColors = [
    { fill: "#EEF3FF", stroke: "#3555B4", text: "#3555B4" },
    { fill: "#FFF4E2", stroke: "#D58A00", text: "#9A6200" },
    { fill: "#ECFDF5", stroke: "#0F9F6E", text: "#0F9F6E" },
  ];

  const examples = config.examples
    .slice(0, 3)
    .map((example, index) => {
      const palette = tileColors[index % tileColors.length];
      const x = 0 + index * 208;
      return `
    <rect x="${x}" y="0" width="180" height="102" rx="18" fill="${palette.fill}" stroke="${palette.stroke}" stroke-width="3"/>
    <text x="${x + 90}" y="38" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="${palette.text}">${escapeXml(index === 0 ? "Pattern" : index === 1 ? "Move" : "Answer")}</text>
    <text x="${x + 90}" y="69" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="24" font-weight="700" fill="#1F2440">${escapeXml(example)}</text>`;
    })
    .join("");

  const introSubtitle = {
    "Rule Card": "Anchor the idea before calculation.",
    "Pattern Grid": "See the structure, then apply the shortcut.",
    "Worked Board": "Follow the sequence from left to right.",
    "Concept Panel": "Notice how the parts transform.",
    "Step Ladder": "Climb one simplification step at a time.",
    "Flow Panel": "Use the flow to keep the process clean.",
    "Flow Lane": "Track movement and carry carefully.",
    "Balance Beam": "Compare both sides visually.",
    "Balance Scale": "Keep the equation balanced.",
    "Base Line": "Use the chosen base as your anchor.",
    "Value Chip": "Spot the key value instantly.",
    "Quick Tag": "Read the sign or deviation fast.",
    "Arrow Guide": "Follow the transition arrows.",
  }[role] ?? "Use the visual structure to reason faster.";

  const topTitle = role === "Worked Board" ? `Worked ${config.title}` : config.title;

  const boardByRole = {
    "Rule Card": `
  <rect x="118" y="144" width="150" height="92" rx="18" fill="#EEF3FF" stroke="#3555B4" stroke-width="3"/>
  <rect x="326" y="144" width="150" height="92" rx="18" fill="#FFF4E2" stroke="#D58A00" stroke-width="3"/>
  <rect x="534" y="144" width="150" height="92" rx="18" fill="#ECFDF5" stroke="#0F9F6E" stroke-width="3"/>
  <text x="193" y="182" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#3555B4">Pattern</text>
  <text x="401" y="182" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#9A6200">Move</text>
  <text x="609" y="182" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#0F9F6E">Answer</text>
  <text x="193" y="216" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="28" font-weight="700" fill="#1F2440">${escapeXml(config.examples[0] ?? "")}</text>
  <text x="401" y="216" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="28" font-weight="700" fill="#1F2440">${escapeXml(config.examples[1] ?? "")}</text>
  <text x="609" y="216" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="28" font-weight="700" fill="#1F2440">${escapeXml(config.examples[2] ?? "")}</text>
  <path d="M608 260 C560 300, 470 300, 422 260" fill="none" stroke="#0F9F6E" stroke-width="5" stroke-linecap="round"/>
  <polygon points="422,260 438,252 436,269" fill="#0F9F6E"/>
  <path d="M400 260 C350 300, 260 300, 212 260" fill="none" stroke="#D58A00" stroke-width="5" stroke-linecap="round"/>
  <polygon points="212,260 228,252 226,269" fill="#D58A00"/>`,
    "Worked Board": `
  <rect x="110" y="138" width="170" height="90" rx="18" fill="#EEF3FF" stroke="#3555B4" stroke-width="3"/>
  <rect x="315" y="138" width="170" height="90" rx="18" fill="#FFF4E2" stroke="#D58A00" stroke-width="3"/>
  <rect x="520" y="138" width="170" height="90" rx="18" fill="#ECFDF5" stroke="#0F9F6E" stroke-width="3"/>
  <text x="195" y="174" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#3555B4">Left</text>
  <text x="400" y="174" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#9A6200">Middle</text>
  <text x="605" y="174" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#0F9F6E">Right</text>
  <text x="195" y="208" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="26" font-weight="700" fill="#1F2440">${escapeXml(config.examples[0] ?? "")}</text>
  <text x="400" y="208" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="26" font-weight="700" fill="#1F2440">${escapeXml(config.examples[1] ?? "")}</text>
  <text x="605" y="208" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="26" font-weight="700" fill="#1F2440">${escapeXml(config.examples[2] ?? "")}</text>
  <text x="132" y="282" font-family="Segoe UI, Arial" font-size="16" fill="#1F2440">${escapeXml(config.bullets[0] ?? "")}</text>
  <text x="132" y="308" font-family="Segoe UI, Arial" font-size="16" fill="#1F2440">${escapeXml(config.bullets[1] ?? "")}</text>
  <text x="132" y="334" font-family="Segoe UI, Arial" font-size="16" fill="#1F2440">${escapeXml(config.bullets[2] ?? "")}</text>
  <rect x="534" y="278" width="154" height="58" rx="16" fill="#E8EEFF" stroke="#3555B4" stroke-width="3"/>
  <text x="611" y="301" text-anchor="middle" font-family="Segoe UI, Arial" font-size="14" fill="#3555B4">Final focus</text>
  <text x="611" y="324" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="26" font-weight="700" fill="#1F2440">${escapeXml(config.examples[2] ?? "")}</text>`,
    "Pattern Grid": `
  <rect x="104" y="140" width="592" height="154" rx="20" fill="#F8FAFF" stroke="#DCE5FF" stroke-width="2"/>
  <line x1="301" y1="140" x2="301" y2="294" stroke="#DCE5FF" stroke-width="2"/>
  <line x1="498" y1="140" x2="498" y2="294" stroke="#DCE5FF" stroke-width="2"/>
  <text x="202" y="176" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#3555B4">Pattern A</text>
  <text x="399" y="176" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#9A6200">Pattern B</text>
  <text x="597" y="176" text-anchor="middle" font-family="Segoe UI, Arial" font-size="18" fill="#0F9F6E">Pattern C</text>
  <text x="202" y="232" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="28" font-weight="700" fill="#1F2440">${escapeXml(config.examples[0] ?? "")}</text>
  <text x="399" y="232" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="28" font-weight="700" fill="#1F2440">${escapeXml(config.examples[1] ?? "")}</text>
  <text x="597" y="232" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="28" font-weight="700" fill="#1F2440">${escapeXml(config.examples[2] ?? "")}</text>`,
  };

  const boardMarkup = boardByRole[role] ?? boardByRole["Rule Card"];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" rx="18" fill="#F8FAFF"/>
  <rect x="24" y="24" width="752" height="352" rx="20" fill="#FFFFFF" stroke="#DCE5FF" stroke-width="2"/>

  <text x="48" y="58" font-family="Segoe UI, Arial" font-size="13" font-weight="700" fill="#64748B">ROBODYNAMICS MINDSUTRA</text>
  <text x="400" y="76" text-anchor="middle" font-family="Segoe UI, Arial" font-size="27" font-weight="700" fill="#2B3F98">${escapeXml(topTitle)}</text>
  <text x="400" y="102" text-anchor="middle" font-family="Segoe UI, Arial" font-size="16" fill="#5E6B85">${escapeXml(introSubtitle)}</text>

  <rect x="54" y="128" width="164" height="34" rx="17" fill="#F3F6FF" stroke="#C9D7FF"/>
  <text x="136" y="150" text-anchor="middle" font-family="Segoe UI, Arial" font-size="16" font-weight="700" fill="#3555B4">${escapeXml(role)}</text>

${boardMarkup}

  <rect x="80" y="282" width="642" height="72" rx="18" fill="#F8FAFF" stroke="#DCE5FF"/>
  <text x="108" y="308" font-family="Segoe UI, Arial" font-size="20" font-weight="700" fill="${accentA}">Key Moves</text>
  <g transform="translate(108 320)">
${bullets}
  </g>
</svg>`;
}

let updated = 0;

for (const [folder, config] of Object.entries(LESSONS)) {
  const dir = path.join(ROOT, config.level, folder);
  for (const file of fs.readdirSync(dir).filter((entry) => entry.endsWith(".svg"))) {
    const full = path.join(dir, file);
    fs.writeFileSync(full, buildSvg(config, file), "utf8");
    updated += 1;
  }
}

console.log(`UPDATED_PLACEHOLDER_SVGS=${updated}`);
