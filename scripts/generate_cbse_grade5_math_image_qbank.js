const fs = require("fs");
const path = require("path");

const COURSE_ID = 34;
const COURSE_SESSION_ID = 1085;
const SESSION_TITLE = "Visual Math Practice - Set 1";
const OUT_DIR = path.join("artifacts", "examprep_qbank_2026-03-04", "course_34", "grade5_image_set_30");
const IMAGE_DIR = path.join(OUT_DIR, "images");
const JSON_PATH = path.join(OUT_DIR, "grade5_image_questions_30.json");
const CSV_PATH = path.join(OUT_DIR, "grade5_image_questions_30.csv");
const README_PATH = path.join(OUT_DIR, "README.md");
const IMAGE_URL_PREFIX = `/session_materials/${COURSE_ID}/images`;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function svgWrap(title, body, width = 420, height = 280) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="#ffffff" stroke="#d1d5db"/>` +
    `<text x="18" y="24" font-size="16" font-family="Arial" fill="#111827">${title}</text>` +
    `${body}</svg>`;
}

function angleSvg(deg, label) {
  const x0 = 120;
  const y0 = 210;
  const x1 = 300;
  const y1 = 210;
  const r = 130;
  const rad = ((180 - deg) * Math.PI) / 180;
  const x2 = x0 + Math.round(r * Math.cos(rad));
  const y2 = y0 - Math.round(r * Math.sin(rad));
  const xArc = x0 + Math.round(36 * Math.cos(rad));
  const yArc = y0 - Math.round(36 * Math.sin(rad));
  const body =
    `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="#111827" stroke-width="4"/>` +
    `<line x1="${x0}" y1="${y0}" x2="${x2}" y2="${y2}" stroke="#111827" stroke-width="4"/>` +
    `<path d="M ${x0 + 36} ${y0} A 36 36 0 0 0 ${xArc} ${yArc}" stroke="#2563eb" stroke-width="3" fill="none"/>` +
    `<circle cx="${x0}" cy="${y0}" r="4" fill="#111827"/>` +
    `<text x="${x0 + 52}" y="${y0 - 16}" font-size="15" font-family="Arial" fill="#2563eb">${label}</text>`;
  return svgWrap("Angle Diagram", body);
}

function gridSvg(rows, cols, shaded, title) {
  const x0 = 70;
  const y0 = 55;
  const cell = 30;
  const set = new Set(shaded.map(([r, c]) => `${r},${c}`));
  let body = "";
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const fill = set.has(`${r},${c}`) ? "#93c5fd" : "#ffffff";
      body += `<rect x="${x0 + c * cell}" y="${y0 + r * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="#111827" stroke-width="1.5"/>`;
    }
  }
  return svgWrap(title, body);
}

function rectangleSvg(length, breadth, unit = "cm") {
  const x = 90;
  const y = 80;
  const w = 220;
  const h = 120;
  const body =
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#eef2ff" stroke="#111827" stroke-width="3"/>` +
    `<text x="${x + w / 2 - 35}" y="${y - 12}" font-size="15" font-family="Arial" fill="#111827">${length} ${unit}</text>` +
    `<text x="${x + w + 14}" y="${y + h / 2}" font-size="15" font-family="Arial" fill="#111827">${breadth} ${unit}</text>`;
  return svgWrap("Rectangle", body);
}

function lShapeSvg() {
  const x0 = 90;
  const y0 = 60;
  const s = 30;
  let body = "";
  for (let r = 0; r < 5; r += 1) {
    for (let c = 0; c < 5; c += 1) {
      if (!(r >= 2 && c >= 3)) {
        body += `<rect x="${x0 + c * s}" y="${y0 + r * s}" width="${s}" height="${s}" fill="#dcfce7" stroke="#166534" stroke-width="1.2"/>`;
      }
    }
  }
  body += `<text x="88" y="230" font-size="14" font-family="Arial">Each small square = 1 sq unit</text>`;
  return svgWrap("L-Shaped Figure", body);
}

function mapSvg(points, title) {
  const cell = 36;
  const x0 = 70;
  const y0 = 55;
  let body = "";
  for (let i = 0; i <= 6; i += 1) {
    body += `<line x1="${x0}" y1="${y0 + i * cell}" x2="${x0 + 6 * cell}" y2="${y0 + i * cell}" stroke="#cbd5e1"/>`;
    body += `<line x1="${x0 + i * cell}" y1="${y0}" x2="${x0 + i * cell}" y2="${y0 + 6 * cell}" stroke="#cbd5e1"/>`;
  }
  Object.entries(points).forEach(([key, [r, c]]) => {
    const cx = x0 + c * cell;
    const cy = y0 + r * cell;
    body += `<circle cx="${cx}" cy="${cy}" r="7" fill="#2563eb"/>`;
    body += `<text x="${cx + 10}" y="${cy + 5}" font-size="14" font-family="Arial" fill="#111827">${key}</text>`;
  });
  return svgWrap(title, body);
}

function barChartSvg(labels, values, title) {
  const x0 = 60;
  const y0 = 220;
  const barW = 46;
  const gap = 26;
  const scale = 14;
  let body = `<line x1="50" y1="220" x2="390" y2="220" stroke="#111827" stroke-width="2"/>`;
  labels.forEach((lab, i) => {
    const val = values[i];
    const x = x0 + i * (barW + gap);
    const h = val * scale;
    const y = y0 - h;
    body += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="#60a5fa" stroke="#1d4ed8"/>`;
    body += `<text x="${x + 15}" y="${y - 6}" font-size="13" font-family="Arial">${val}</text>`;
    body += `<text x="${x + 8}" y="242" font-size="13" font-family="Arial">${lab}</text>`;
  });
  return svgWrap(title, body);
}

function cubeNetSvg(kind) {
  const x0 = 120;
  const y0 = 70;
  const s = 42;
  const valid = [[1, 0], [1, 1], [1, 2], [0, 1], [2, 1], [3, 1]];
  const invalid = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 1]];
  const cells = kind === "valid" ? valid : invalid;
  let body = "";
  cells.forEach(([r, c]) => {
    body += `<rect x="${x0 + c * s}" y="${y0 + r * s}" width="${s}" height="${s}" fill="#fef3c7" stroke="#92400e" stroke-width="2"/>`;
  });
  body += `<text x="110" y="255" font-size="14" font-family="Arial">Can this fold to make a cube?</text>`;
  return svgWrap("Cube Net", body);
}

function fractionStripSvg(parts, shaded) {
  const x0 = 60;
  const y0 = 120;
  const w = 300;
  const h = 44;
  const partW = w / parts;
  let body = "";
  for (let i = 0; i < parts; i += 1) {
    const fill = i < shaded ? "#86efac" : "#ffffff";
    body += `<rect x="${x0 + i * partW}" y="${y0}" width="${partW}" height="${h}" fill="${fill}" stroke="#166534" stroke-width="1.4"/>`;
  }
  body += `<text x="70" y="190" font-size="14" font-family="Arial">Equal parts strip</text>`;
  return svgWrap("Fraction Strip", body);
}

function writeSvgForQuestion(qid, svg) {
  ensureDir(IMAGE_DIR);
  const imageName = `g5_math_img_q${String(qid).padStart(2, "0")}.svg`;
  fs.writeFileSync(path.join(IMAGE_DIR, imageName), svg, "utf8");
  return `${IMAGE_URL_PREFIX}/${imageName}`;
}

function makeMcq(qid, chapter, text, options, correctIdx, difficulty, marks, svg) {
  const questionImage = writeSvgForQuestion(qid, svg);
  return {
    course_id: COURSE_ID,
    course_session_id: COURSE_SESSION_ID,
    session_title: SESSION_TITLE,
    sequence_no: qid,
    question_text: text,
    question_type: "multiple_choice",
    difficulty_level: difficulty,
    max_marks: marks,
    correct_answer: options[correctIdx],
    explanation: "Answer is based on the diagram.",
    additional_info: `CBSE Grade 5 Mathematics Image Set 1 | Chapter: ${chapter}`,
    question_image: questionImage,
    options: options.map((optionText, idx) => ({
      option_text: optionText,
      is_correct: idx === correctIdx,
      option_image: "",
    })),
  };
}

function makeShort(qid, chapter, text, answer, difficulty, marks, svg) {
  const questionImage = writeSvgForQuestion(qid, svg);
  return {
    course_id: COURSE_ID,
    course_session_id: COURSE_SESSION_ID,
    session_title: SESSION_TITLE,
    sequence_no: qid,
    question_text: text,
    question_type: "short_answer",
    difficulty_level: difficulty,
    max_marks: marks,
    correct_answer: answer,
    explanation: "Use the values shown in the image.",
    additional_info: `CBSE Grade 5 Mathematics Image Set 1 | Chapter: ${chapter}`,
    question_image: questionImage,
    options: [],
  };
}

function makeFill(qid, chapter, text, answer, difficulty, marks, svg) {
  const questionImage = writeSvgForQuestion(qid, svg);
  return {
    course_id: COURSE_ID,
    course_session_id: COURSE_SESSION_ID,
    session_title: SESSION_TITLE,
    sequence_no: qid,
    question_text: text,
    question_type: "fill_in_blank",
    difficulty_level: difficulty,
    max_marks: marks,
    correct_answer: answer,
    explanation: "Fill using the visual.",
    additional_info: `CBSE Grade 5 Mathematics Image Set 1 | Chapter: ${chapter}`,
    question_image: questionImage,
    options: [],
  };
}

function buildQuestions() {
  const q = [];
  q.push(makeMcq(1, "Shapes and Angles", "What type of angle is shown?", ["Acute", "Right", "Obtuse", "Straight"], 1, "Easy", 1, angleSvg(90, "90 deg")));
  q.push(makeMcq(2, "Shapes and Angles", "What type of angle is shown?", ["Acute", "Right", "Obtuse", "Reflex"], 0, "Easy", 1, angleSvg(45, "45 deg")));
  q.push(makeMcq(3, "Shapes and Angles", "What type of angle is shown?", ["Acute", "Right", "Obtuse", "Straight"], 2, "Easy", 1, angleSvg(120, "120 deg")));
  q.push(makeMcq(4, "Shapes and Angles", "How many sides does the polygon in the image have?", ["4", "5", "6", "7"], 1, "Easy", 1, svgWrap("Polygon", `<polygon points="130,80 260,70 315,145 235,225 115,190" fill="#fef9c3" stroke="#92400e" stroke-width="3"/>`)));
  q.push(makeMcq(5, "Shapes and Angles", "The triangle has side lengths 4 cm, 4 cm and 4 cm. What is it called?", ["Scalene", "Isosceles", "Equilateral", "Right"], 2, "Easy", 1, svgWrap("Triangle", `<polygon points="210,60 120,210 300,210" fill="#e0f2fe" stroke="#0c4a6e" stroke-width="3"/><text x="196" y="52" font-size="13">4 cm</text><text x="86" y="214" font-size="13">4 cm</text><text x="308" y="214" font-size="13">4 cm</text>`)));
  q.push(makeMcq(6, "Does It Look the Same?", "How many lines of symmetry does this square have?", ["1", "2", "3", "4"], 3, "Medium", 1, svgWrap("Square Symmetry", `<rect x="140" y="70" width="140" height="140" fill="#eef2ff" stroke="#1e3a8a" stroke-width="3"/><line x1="210" y1="70" x2="210" y2="210" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/><line x1="140" y1="140" x2="280" y2="140" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/><line x1="140" y1="70" x2="280" y2="210" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/><line x1="280" y1="70" x2="140" y2="210" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/>`)));
  q.push(makeMcq(7, "Does It Look the Same?", "The mirror line is vertical. Which statement is true?", ["Left and right match", "Top and bottom match", "No matching parts", "Only corners match"], 0, "Medium", 1, svgWrap("Mirror Line", `<line x1="210" y1="55" x2="210" y2="230" stroke="#ef4444" stroke-width="3" stroke-dasharray="8 6"/><polygon points="120,95 180,120 165,185 110,165" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2.5"/><polygon points="300,95 240,120 255,185 310,165" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2.5"/>`)));
  q.push(makeMcq(8, "How Many Squares?", "How many shaded squares are there?", ["6", "7", "8", "9"], 2, "Easy", 1, gridSvg(4, 5, [[0, 1], [0, 2], [1, 0], [1, 3], [2, 2], [2, 4], [3, 0], [3, 4]], "Grid A")));
  q.push(makeMcq(9, "How Many Squares?", "How many total small squares are in the grid?", ["12", "16", "20", "24"], 2, "Easy", 1, gridSvg(4, 5, [], "Grid B")));
  q.push(makeFill(10, "Area and Its Boundary", "Fill in the blank: Area of this rectangle is ____ sq cm.", "24", "Easy", 1, rectangleSvg(6, 4)));
  q.push(makeFill(11, "Area and Its Boundary", "Fill in the blank: Perimeter of this rectangle is ____ cm.", "20", "Easy", 1, rectangleSvg(6, 4)));
  q.push(makeMcq(12, "Area and Its Boundary", "What is the area of the L-shape?", ["16 sq units", "19 sq units", "21 sq units", "25 sq units"], 2, "Medium", 1, lShapeSvg()));
  q.push(makeMcq(13, "Mapping Your Way", "In the map, what is the shortest path length from H to S (in grid steps)?", ["4", "5", "6", "7"], 1, "Medium", 1, mapSvg({ H: [5, 1], S: [1, 4] }, "School Map 1")));
  q.push(makeMcq(14, "Mapping Your Way", "From P to L, move 2 right and 3 up. Where do you reach?", ["Point A", "Point B", "Point C", "Point D"], 2, "Medium", 1, svgWrap("Grid Move", `<text x="58" y="45" font-size="14">P=(1,5), A=(3,5), B=(2,3), C=(3,2), D=(5,1)</text>${Array.from({ length: 7 }).map((_, i) => `<line x1="70" y1="${55 + i * 32}" x2="${70 + 6 * 32}" y2="${55 + i * 32}" stroke="#cbd5e1"/>`).join("")}${Array.from({ length: 7 }).map((_, i) => `<line x1="${70 + i * 32}" y1="55" x2="${70 + i * 32}" y2="${55 + 6 * 32}" stroke="#cbd5e1"/>`).join("")}<circle cx="102" cy="215" r="7" fill="#2563eb"/><text x="112" y="219" font-size="13">P</text>`)));
  q.push(makeShort(15, "Mapping Your Way", "Use the map and write the coordinates of point B.", "(4,2)", "Easy", 2, svgWrap("Coordinate Grid", `${Array.from({ length: 9 }).map((_, i) => `<line x1="60" y1="${50 + i * 30}" x2="300" y2="${50 + i * 30}" stroke="#d1d5db"/>`).join("")}${Array.from({ length: 9 }).map((_, i) => `<line x1="${60 + i * 30}" y1="50" x2="${60 + i * 30}" y2="290" stroke="#d1d5db"/>`).join("")}<circle cx="180" cy="110" r="6" fill="#16a34a"/><text x="190" y="114" font-size="13">B</text><text x="62" y="305" font-size="13">x-axis</text>`)));
  q.push(makeShort(16, "Mapping Your Way", "How many grid steps from A(1,1) to C(5,4) if you move only right and up?", "7", "Medium", 2, svgWrap("Path Count", `<text x="70" y="60" font-size="15">A(1,1) to C(5,4)</text><line x1="90" y1="220" x2="250" y2="220" stroke="#111827" stroke-width="2"/><line x1="90" y1="220" x2="90" y2="80" stroke="#111827" stroke-width="2"/><polyline points="90,220 250,220 250,100" fill="none" stroke="#2563eb" stroke-width="3"/>`)));
  q.push(makeMcq(17, "Boxes and Sketches", "Which net can fold into a cube?", ["Image 17 (this net)", "A line of 6 squares", "A plus with 7 squares", "Any 6 squares"], 0, "Medium", 1, cubeNetSvg("valid")));
  q.push(makeMcq(18, "Boxes and Sketches", "Can this net fold into a cube?", ["Yes", "No", "Only if cut", "Cannot say"], 1, "Medium", 1, cubeNetSvg("invalid")));
  q.push(makeMcq(19, "Boxes and Sketches", "How many cubes are stacked in this block figure?", ["8", "9", "10", "11"], 1, "Medium", 1, svgWrap("Stacked Cubes", `<rect x="90" y="170" width="50" height="50" fill="#bfdbfe" stroke="#1d4ed8"/><rect x="140" y="170" width="50" height="50" fill="#bfdbfe" stroke="#1d4ed8"/><rect x="190" y="170" width="50" height="50" fill="#bfdbfe" stroke="#1d4ed8"/><rect x="240" y="170" width="50" height="50" fill="#bfdbfe" stroke="#1d4ed8"/><rect x="115" y="120" width="50" height="50" fill="#93c5fd" stroke="#1d4ed8"/><rect x="165" y="120" width="50" height="50" fill="#93c5fd" stroke="#1d4ed8"/><rect x="215" y="120" width="50" height="50" fill="#93c5fd" stroke="#1d4ed8"/><rect x="140" y="70" width="50" height="50" fill="#60a5fa" stroke="#1d4ed8"/><rect x="190" y="70" width="50" height="50" fill="#60a5fa" stroke="#1d4ed8"/>`)));
  q.push(makeMcq(20, "Smart Charts", "Which fruit has the highest sales?", ["Apple", "Banana", "Mango", "Grapes"], 2, "Easy", 1, barChartSvg(["A", "B", "M", "G"], [3, 5, 7, 4], "Fruit Sales (bars: A,B,M,G)")));
  q.push(makeMcq(21, "Smart Charts", "How many more Mangoes than Apples were sold?", ["2", "3", "4", "5"], 2, "Easy", 1, barChartSvg(["A", "B", "M", "G"], [3, 5, 7, 4], "Fruit Sales (bars: A,B,M,G)")));
  q.push(makeMcq(22, "Area and Its Boundary", "What fraction of the strip is shaded?", ["2/6", "3/6", "4/6", "5/6"], 1, "Easy", 1, fractionStripSvg(6, 3)));
  q.push(makeMcq(23, "Area and Its Boundary", "What is the unshaded fraction of the strip?", ["1/6", "2/6", "3/6", "4/6"], 2, "Easy", 1, fractionStripSvg(6, 3)));
  q.push(makeMcq(24, "How Many Squares?", "How many small squares are needed to make a 6 by 4 rectangle?", ["20", "22", "24", "26"], 2, "Easy", 1, svgWrap("Rectangular Array", `<rect x="90" y="70" width="240" height="160" fill="#ffffff" stroke="#111827" stroke-width="2"/>${[1, 2, 3, 4, 5].map((i) => `<line x1="${90 + i * 40}" y1="70" x2="${90 + i * 40}" y2="230" stroke="#cbd5e1"/>`).join("")}${[1, 2, 3].map((i) => `<line x1="90" y1="${70 + i * 40}" x2="330" y2="${70 + i * 40}" stroke="#cbd5e1"/>`).join("")}<text x="160" y="252" font-size="14">6 columns x 4 rows</text>`)));
  q.push(makeFill(25, "How Many Squares?", "Fill in the blank: Number of small squares in the image is ____.", "24", "Easy", 1, svgWrap("6x4 Grid", `<rect x="90" y="70" width="240" height="160" fill="#ffffff" stroke="#111827" stroke-width="2"/>${[1, 2, 3, 4, 5].map((i) => `<line x1="${90 + i * 40}" y1="70" x2="${90 + i * 40}" y2="230" stroke="#cbd5e1"/>`).join("")}${[1, 2, 3].map((i) => `<line x1="90" y1="${70 + i * 40}" x2="330" y2="${70 + i * 40}" stroke="#cbd5e1"/>`).join("")}`)));
  q.push(makeShort(26, "Shapes and Angles", "One angle is 35 deg and together they make a right angle. Find the other angle.", "55 deg", "Medium", 2, svgWrap("Right Angle Split", `<line x1="110" y1="220" x2="280" y2="220" stroke="#111827" stroke-width="3"/><line x1="110" y1="220" x2="110" y2="70" stroke="#111827" stroke-width="3"/><line x1="110" y1="220" x2="190" y2="120" stroke="#2563eb" stroke-width="3"/><text x="155" y="172" font-size="14">35 deg</text><text x="118" y="96" font-size="14">?</text>`)));
  q.push(makeShort(27, "Area and Its Boundary", "Find the perimeter of the rectangle shown.", "26 cm", "Medium", 2, rectangleSvg(8, 5)));
  q.push(makeShort(28, "Area and Its Boundary", "Find the area of the rectangle shown.", "40 sq cm", "Medium", 2, rectangleSvg(8, 5)));
  q.push(makeShort(29, "Smart Charts", "Write total of all bars in the chart.", "19", "Medium", 2, barChartSvg(["A", "B", "M", "G"], [3, 5, 7, 4], "Fruit Sales (bars: A,B,M,G)")));
  q.push(makeFill(30, "Shapes and Angles", "Fill in the blank: The straight angle is ____ deg.", "180", "Easy", 1, svgWrap("Straight Angle", `<line x1="80" y1="160" x2="340" y2="160" stroke="#111827" stroke-width="4"/><circle cx="210" cy="160" r="4" fill="#111827"/><text x="170" y="145" font-size="14">straight line</text>`)));
  return q;
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
    return `"${s.replace(/"/g, "\"\"")}"`;
  }
  return s;
}

function writeOutputs(questions) {
  ensureDir(OUT_DIR);
  const payload = {
    course_id: COURSE_ID,
    course_session_id: COURSE_SESSION_ID,
    session_title: SESSION_TITLE,
    generated_at: "2026-03-04",
    questions,
  };
  fs.writeFileSync(JSON_PATH, JSON.stringify(payload, null, 2), "utf8");

  const csvHeader = [
    "sequence_no",
    "chapter",
    "question_type",
    "difficulty_level",
    "max_marks",
    "question_text",
    "correct_answer",
    "question_image",
    "options_json",
  ];
  const csvLines = [csvHeader.join(",")];
  questions.forEach((q) => {
    const chapter = q.additional_info.split("Chapter: ")[1] || "";
    const row = [
      q.sequence_no,
      chapter,
      q.question_type,
      q.difficulty_level,
      q.max_marks,
      q.question_text,
      q.correct_answer,
      q.question_image,
      JSON.stringify(q.options),
    ];
    csvLines.push(row.map(csvEscape).join(","));
  });
  fs.writeFileSync(CSV_PATH, `${csvLines.join("\n")}\n`, "utf8");

  const typeCount = {};
  const chapterCount = {};
  questions.forEach((q) => {
    typeCount[q.question_type] = (typeCount[q.question_type] || 0) + 1;
    const chapter = q.additional_info.split("Chapter: ")[1] || "";
    chapterCount[chapter] = (chapterCount[chapter] || 0) + 1;
  });

  const readme = [
    "# CBSE Grade 5 Mathematics - Image Question Set (30)",
    "",
    `- Course ID: \`${COURSE_ID}\``,
    `- Course Session ID: \`${COURSE_SESSION_ID}\``,
    `- Session Title: \`${SESSION_TITLE}\``,
    `- Total Questions: \`${questions.length}\``,
    `- SVG Files: \`${fs.readdirSync(IMAGE_DIR).filter((f) => f.endsWith(".svg")).length}\``,
    "",
    "## Type Distribution",
    "",
    ...Object.keys(typeCount).sort().map((k) => `- \`${k}\`: ${typeCount[k]}`),
    "",
    "## Chapter Distribution",
    "",
    ...Object.keys(chapterCount).sort().map((k) => `- \`${k}\`: ${chapterCount[k]}`),
    "",
    "## Generated Files",
    "",
    `- \`${JSON_PATH}\``,
    `- \`${CSV_PATH}\``,
    `- \`${IMAGE_DIR}\` (30 SVG files)`,
    "",
  ].join("\n");
  fs.writeFileSync(README_PATH, readme, "utf8");
}

function main() {
  const questions = buildQuestions();
  if (questions.length !== 30) {
    throw new Error(`Expected 30 questions, got ${questions.length}`);
  }
  writeOutputs(questions);
  console.log(`Generated ${questions.length} questions at ${OUT_DIR}`);
}

main();
