const fs = require('fs');
const path = require('path');

const publicDir = 'c:\\roboworkspace\\robodynamics\\ai-tutor\\apps\\kaveri-tutor\\public\\assets\\gemini';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// ── Emoji Lookup Map ──
const EMOJI_MAP = {
  "sister": "👧",
  "elephant": "🐘",
  "ant": "🐜",
  "swimming": "🏊",
  "salt": "🧂",
  "village": "🏡",
  "sage": "🧙",
  "leaf": "🍃",
  "ladder": "🪜",
  "five": "🖐️",
  "camel": "🐫",
  "run": "🏃",
  "medicine": "🧪",
  "crow": "🐦",
  "window": "🪟",
  "key": "🔑",
  "horse": "🐎",
  "shout": "🗣️",
  "farming": "🚜",
  "red": "🔴",
  "cake": "🍰",
  "hand": "🖐️",
  "umbrella": "⛱️",
  "monkey": "🐒",
  "curiosity": "🤔",
  "wind": "💨",
  "parrot": "🦜",
  "song": "🎵",
  "rose": "🌹",
  "nest": "🪹",
  "home": "🏠",
  "victory": "🏆",
  "gate": "🚧",
  "absent": "❌",
  "doll": "🪆",
  "wall": "🧱",
  "respect": "🙏",
  "vessel": "🥣",
  "pickaxe": "⛏️",
  "pedestal": "🏛️",
  "book": "📖",
  "worship": "🪔",
  "earth": "🌍",
  "pencil": "✏️",
  "guava": "🥑",
  "sprout": "🌱",
  "bush": "🌳",
  "police": "👮",
  "nutritious": "🥦",
  "children": "🧑‍🤝‍🧑",
  "ten": "🔟",
  "father": "👨",
  "rice": "🍚",
  "no": "🚫",
  "mother": "👩",
  "dog": "🐕",
  "loom": "🧶",
  "more": "➕",
  "egg": "🥚",
  "festival": "🎉",
  "tooth": "🦷",
  "eye": "👁️",
  "matchstick": "🦫",
  "order": "📋",
  "love": "❤️",
  "creator": "✨",
  "triangle": "🔺",
  "grapes": "🍇",
  "effort": "💪",
  "class": "🏫",
  "plate": "🍽️",
  "black": "⬛",
  "glass": "🥛",
  "forgiveness": "🤝",
  "knowledge": "💡",
  "bath": "🛁",
  "school": "🏫",
  "clear": "🔍",
  "justice": "⚖️",
  "sacrifice": "🕯️",
  "meditation": "🧘",
  "devotee": "🙏",
  "memory": "🧠",
  "pillar": "🏛️",
  "lotus": "🪷",
  "sword": "⚔️",
  "vehicle": "🚗",
  "bell": "🔔",
  "moon": "🌙",
  "water": "💧",
  "waterfall": "🏞️",
  "cap": "🧢",
  "tin box": "📦",
  "drum": "🥁",
  "country": "🗺️",
  "virtue": "⚖️",
  "bird": "🐦",
  "fruit": "🍎",
  "fire": "🔥",
  "house": "🏠",
  "journey": "✈️",
  "king": "👑",
  "world": "🌐",
  "rain": "🌧️",
  "sun": "☀️",
  "milk": "🥛",
  "baby": "👶",
  "fish": "🐟",
  "greetings": "🙏",
  "cries": "😢",
  "flies": "🦅",
  "eat": "🍽️",
  "drinks": "🥤",
  "write": "✍️",
  "reads": "📖",
  "swims": "🏊",
  "laughs": "😀",
  "comes": "🚶",
  "what": "❓",
  "meals": "🍛",
  "cooks": "🍳",
  "plays": "⚽",
  "shines": "✨",
  "sleep": "😴",
  "work": "💼",
  "big": "🏰",
  "easy": "✅",
  "common": "📦",
  "proper": "🏷️",
  "masculine": "👨",
  "feminine": "👩",
  "neuter": "🧸",
  "singular": "1️⃣",
  "plural": "🔢",
};

// ── Color Schemes ──
const GRADIENTS = [
  { start: "#ff7e5f", end: "#feb47b" }, // Warm Sunset
  { start: "#6a11cb", end: "#2575fc" }, // Cosmic Blue
  { start: "#11998e", end: "#38ef7d" }, // Emerald Green
  { start: "#fc466b", end: "#3f5efb" }, // Neon Pink-Blue
  { start: "#f12711", end: "#f5af19" }, // Bright Sun
  { start: "#8a2387", end: "#e94057" }, // Royal Violet
  { start: "#130cb7", end: "#52e5e7" }, // Ocean Cyan
  { start: "#f4c4f3", end: "#fc67fa" }, // Pretty Lavender
];

function getGradientForId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getEmoji(englishText) {
  const clean = englishText.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const words = clean.split(/\s+/);
  for (const w of words) {
    if (EMOJI_MAP[w]) return EMOJI_MAP[w];
    // singular forms
    if (w.endsWith('s') && EMOJI_MAP[w.slice(0, -1)]) return EMOJI_MAP[w.slice(0, -1)];
  }
  return "📖"; // Default education emoji
}

// ── SVG Blueprint Generator ──
function generatePremiumSVG(id, char, wordKn, wordEn, emoji) {
  const grad = getGradientForId(id);
  const isSentence = wordKn.length > 5;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${grad.start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${grad.end};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1e293b" flood-opacity="0.25"/>
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Premium Card Background -->
  <rect width="800" height="600" rx="36" fill="url(#grad-${id})" />
  
  <!-- Subtle Grid overlay -->
  <g opacity="0.08">
    <line x1="100" y1="0" x2="100" y2="600" stroke="#ffffff" stroke-width="2"/>
    <line x1="200" y1="0" x2="200" y2="600" stroke="#ffffff" stroke-width="2"/>
    <line x1="300" y1="0" x2="300" y2="600" stroke="#ffffff" stroke-width="2"/>
    <line x1="400" y1="0" x2="400" y2="600" stroke="#ffffff" stroke-width="2"/>
    <line x1="500" y1="0" x2="500" y2="600" stroke="#ffffff" stroke-width="2"/>
    <line x1="600" y1="0" x2="600" y2="600" stroke="#ffffff" stroke-width="2"/>
    <line x1="700" y1="0" x2="700" y2="600" stroke="#ffffff" stroke-width="2"/>
    <line x1="0" y1="100" x2="800" y2="100" stroke="#ffffff" stroke-width="2"/>
    <line x1="0" y1="200" x2="800" y2="200" stroke="#ffffff" stroke-width="2"/>
    <line x1="0" y1="300" x2="800" y2="300" stroke="#ffffff" stroke-width="2"/>
    <line x1="0" y1="400" x2="800" y2="400" stroke="#ffffff" stroke-width="2"/>
    <line x1="0" y1="500" x2="800" y2="500" stroke="#ffffff" stroke-width="2"/>
  </g>

  <!-- Modern Glassmorphic Container -->
  <rect x="50" y="50" width="700" height="500" rx="28" fill="#ffffff" fill-opacity="0.9" filter="url(#shadow)" />

  <!-- Accent Circle -->
  <circle cx="400" cy="230" r="110" fill="url(#grad-${id})" fill-opacity="0.1" />

  <!-- Giant Concept Emoji -->
  <text x="400" y="270" font-family="'Segoe UI Emoji', 'Apple Color Emoji', sans-serif" font-size="120" text-anchor="middle" filter="url(#shadow)">${emoji}</text>

  <!-- Floating Letter Badge -->
  ${char ? `
  <g transform="translate(130, 140)" filter="url(#shadow)">
    <rect x="-50" y="-50" width="100" height="100" rx="22" fill="url(#grad-${id})" />
    <text x="0" y="16" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="48" fill="#ffffff" text-anchor="middle">${char}</text>
  </g>
  ` : ''}

  <!-- Kannada Script Display -->
  <text x="400" y="440" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${isSentence ? 38 : 52}" fill="#1e293b" text-anchor="middle">${wordKn}</text>

  <!-- English / Translation Display -->
  <text x="400" y="495" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="24" fill="#64748b" text-anchor="middle">${wordEn}</text>

  <!-- Kaveri Branding Badge -->
  <g transform="translate(680, 500)" opacity="0.4">
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#64748b" text-anchor="middle">ಕಾವೇರಿ AI 🐘</text>
  </g>
</svg>`;
}

// ── Processing and Parsing Course Data Files ──
const filesToProcess = [
  { name: 'kaveriLevel1Data.ts', extractRegex: /id:\s*"([^"]+)"[\s\S]*?char:\s*"([^"]+)"[\s\S]*?wordKannada:\s*"([^"]+)"[\s\S]*?wordEnglish:\s*"([^"]+)"[\s\S]*?assetPath:\s*"([^"]+)"/g },
  { name: 'kaveriLevel2Data.ts', extractRegex: /id:\s*"([^"]+)"[\s\S]*?modifiedChar:\s*"([^"]+)"[\s\S]*?wordKannada:\s*"([^"]+)"[\s\S]*?wordEnglish:\s*"([^"]+)"[\s\S]*?assetPath:\s*"([^"]+)"/g },
  { name: 'kaveriLevel3Data.ts', extractRegex: /id:\s*"([^"]+)"[\s\S]*?combinedChar:\s*"([^"]+)"[\s\S]*?wordKannada:\s*"([^"]+)"[\s\S]*?wordEnglish:\s*"([^"]+)"[\s\S]*?assetPath:\s*"([^"]+)"/g },
  { name: 'kaveriLevel4Data.ts', extractRegex: /id:\s*"([^"]+)"[\s\S]*?consonant:\s*"([^"]+)"[\s\S]*?wordKannada:\s*"([^"]+)"[\s\S]*?wordEnglish:\s*"([^"]+)"[\s\S]*?assetPath:\s*"([^"]+)"/g },
  { name: 'kaveriLevel5Data.ts', extractRegex: /id:\s*"([^"]+)"[\s\S]*?sentence:\s*"([^"]+)"[\s\S]*?sentenceEnglish:\s*"([^"]+)"[\s\S]*?assetPath:\s*"([^"]+)"/g },
  { name: 'kaveriLevel6Data.ts', extractRegex: /id:\s*"([^"]+)"[\s\S]*?grammarTopic:\s*"([^"]+)"[\s\S]*?grammarTopicKannada:\s*"([^"]+)"[\s\S]*?assetPath:\s*"([^"]+)"/g }
];

let totalGenerated = 0;

filesToProcess.forEach(f => {
  const filePath = path.join('c:\\roboworkspace\\robodynamics\\ai-tutor\\apps\\kaveri-tutor\\lib', f.name);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipped missing file: ${f.name}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  // Reset index
  f.extractRegex.lastIndex = 0;

  while ((match = f.extractRegex.exec(content)) !== null) {
    const id = match[1];
    let char = match[2];
    let wordKn = match[3];
    let wordEn = match[4];
    let assetPath = match[5];

    // For Level 5 / Level 6, fields match slightly differently in regex captures
    if (f.name === 'kaveriLevel5Data.ts') {
      char = ""; // No single character spotlight in Level 5
      wordKn = match[2].replace(/[।|]/g, '').trim(); // sentence
      wordEn = match[3]; // sentenceEnglish
      assetPath = match[4];
    } else if (f.name === 'kaveriLevel6Data.ts') {
      char = ""; // No single character
      wordEn = match[2]; // grammarTopic
      wordKn = match[3]; // grammarTopicKannada
      assetPath = match[4];
    }

    if (!assetPath) continue;

    const baseName = path.basename(assetPath, '.png');
    const svgFileName = baseName + '.svg';
    const svgPath = path.join(publicDir, svgFileName);

    const emoji = getEmoji(wordEn);
    const svgContent = generatePremiumSVG(id, char, wordKn, wordEn, emoji);

    fs.writeFileSync(svgPath, svgContent, 'utf8');
    totalGenerated++;
  }
});

// Also create default placeholders
const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" rx="36" fill="url(#default-grad)" />
  <defs>
    <linearGradient id="default-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6a11cb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2575fc;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="50" y="50" width="700" height="500" rx="28" fill="#ffffff" fill-opacity="0.95" />
  <text x="400" y="280" font-family="'Segoe UI Emoji', sans-serif" font-size="100" text-anchor="middle">📖</text>
  <text x="400" y="400" font-family="system-ui, sans-serif" font-weight="900" font-size="42" fill="#1e293b" text-anchor="middle">ಕಾವೇರಿ ಕನ್ನಡ ತರಬೇತಿ 🐘</text>
  <text x="400" y="450" font-family="system-ui, sans-serif" font-weight="600" font-size="20" fill="#64748b" text-anchor="middle">Kaveri Literacy Academy</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'placeholder.svg'), placeholderSvg, 'utf8');

console.log(`Successfully generated ${totalGenerated} beautiful, child-friendly educational vector SVGs!`);
