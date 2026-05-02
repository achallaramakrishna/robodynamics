/**
 * Vaani Level 5: Sentence Construction
 * Focus: Simple sentences and word combinations
 * Progression: Single words → Word pairs → Simple sentences
 * Concept: Real-world Hindi communication
 * Total: 12 lessons across 2 chapters
 */

export interface Level5Word {
  hindi: string;
  roman: string;
  english: string;
}

export interface Level5Seed {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  category: string;
  skill: string;
  sentence: string;
  sentenceRoman: string;
  sentenceEnglish: string;
  words: Level5Word[];
  assetPath: string;
  durationMin?: number;
  summary: string;
  prompt: string;
}

// ============================================
// CHAPTER 1: GREETING SENTENCES (7 LESSONS)
// ============================================

export const LEVEL_5_DATA: Level5Seed[] = [
  {
    id: "L5-C01-L01",
    chapterId: "C01",
    chapterTitle: "Daily Greetings",
    title: "नमस्ते - Hello",
    category: "Greetings",
    skill: "Basic Greeting",
    sentence: "नमस्ते!",
    sentenceRoman: "Namaste!",
    sentenceEnglish: "Hello!",
    words: [
      { hindi: "नमस्ते", roman: "namaste", english: "greetings/respect" },
    ],
    assetPath: "/assets/gemini/vaani_l5_namaste_greeting_1777200001.png",
    summary: "Learn the universal Hindi greeting that means respect and honor.",
    prompt: "नमस्ते means 'I bow to you' - it's respectful and warm!",
  },
  {
    id: "L5-C01-L02",
    chapterId: "C01",
    chapterTitle: "Daily Greetings",
    title: "आप कैसे हैं? - How are you?",
    category: "Greetings",
    skill: "Polite Questions",
    sentence: "आप कैसे हैं?",
    sentenceRoman: "Aap kaise hain?",
    sentenceEnglish: "How are you? (formal)",
    words: [
      { hindi: "आप", roman: "aap", english: "you (formal/respectful)" },
      { hindi: "कैसे", roman: "kaise", english: "how" },
      { hindi: "हैं", roman: "hain", english: "are" },
    ],
    assetPath: "/assets/gemini/vaani_l5_kaisa_howru_1777200025.png",
    summary: "The most common way to ask how someone is doing politely.",
    prompt: "Use आप with elders - it shows respect and politeness!",
  },
  {
    id: "L5-C01-L03",
    chapterId: "C01",
    chapterTitle: "Daily Greetings",
    title: "मैं ठीक हूँ - I am fine",
    category: "Greetings",
    skill: "Status Response",
    sentence: "मैं ठीक हूँ।",
    sentenceRoman: "Main theek hoon.",
    sentenceEnglish: "I am fine.",
    words: [
      { hindi: "मैं", roman: "main", english: "I" },
      { hindi: "ठीक", roman: "theek", english: "fine/okay" },
      { hindi: "हूँ", roman: "hoon", english: "am" },
    ],
    assetPath: "/assets/gemini/vaani_l5_theek_fine_1777200049.png",
    summary: "The standard polite response to someone asking how you are.",
    prompt: "ठीक means 'fine' - it's the most common positive response!",
  },
  {
    id: "L5-C01-L04",
    chapterId: "C01",
    chapterTitle: "Daily Greetings",
    title: "धन्यवाद - Thank you",
    category: "Politeness",
    skill: "Gratitude",
    sentence: "धन्यवाद!",
    sentenceRoman: "Dhanyavaad!",
    sentenceEnglish: "Thank you!",
    words: [
      { hindi: "धन्यवाद", roman: "dhanyavaad", english: "thank you" },
    ],
    assetPath: "/assets/gemini/vaani_l5_dhanyavaad_thankyou_1777200073.png",
    summary: "Express gratitude in Hindi - essential for politeness!",
    prompt: "धन्यवाद literally means 'wealth of appreciation' - very beautiful!",
  },
  {
    id: "L5-C01-L05",
    chapterId: "C01",
    chapterTitle: "Daily Greetings",
    title: "कृपया - Please",
    category: "Politeness",
    skill: "Requests",
    sentence: "कृपया बैठिए।",
    sentenceRoman: "Kripaya baithiye.",
    sentenceEnglish: "Please sit down.",
    words: [
      { hindi: "कृपया", roman: "kripaya", english: "please" },
      { hindi: "बैठिए", roman: "baithiye", english: "sit (formal)" },
    ],
    assetPath: "/assets/gemini/vaani_l5_kripaya_please_1777200097.png",
    summary: "Make polite requests with कृपया in formal Hindi.",
    prompt: "कृपया makes any request very polite and respectful!",
  },
  {
    id: "L5-C01-L06",
    chapterId: "C01",
    chapterTitle: "Daily Greetings",
    title: "मेरा नाम... - My name is...",
    category: "Introduction",
    skill: "Self-Introduction",
    sentence: "मेरा नाम राज है।",
    sentenceRoman: "Mera naam Raj hai.",
    sentenceEnglish: "My name is Raj.",
    words: [
      { hindi: "मेरा", roman: "mera", english: "my" },
      { hindi: "नाम", roman: "naam", english: "name" },
      { hindi: "है", roman: "hai", english: "is" },
    ],
    assetPath: "/assets/gemini/vaani_l5_mera_naam_myname_1777200121.png",
    summary: "Introduce yourself in Hindi - essential social skill!",
    prompt: "नाम means 'name' - use it with any name you like!",
  },
  {
    id: "L5-C01-L07",
    chapterId: "C01",
    chapterTitle: "Daily Greetings",
    title: "आपका नाम? - What is your name?",
    category: "Introduction",
    skill: "Asking Names",
    sentence: "आपका नाम क्या है?",
    sentenceRoman: "Aapka naam kya hai?",
    sentenceEnglish: "What is your name?",
    words: [
      { hindi: "आपका", roman: "aapka", english: "your (formal)" },
      { hindi: "नाम", roman: "naam", english: "name" },
      { hindi: "क्या", roman: "kya", english: "what" },
      { hindi: "है", roman: "hai", english: "is" },
    ],
    assetPath: "/assets/gemini/vaani_l5_apka_naam_yourname_1777200145.png",
    summary: "Ask someone's name politely and formally.",
    prompt: "क्या means 'what' - it's the key to asking questions!",
  },

  // ============================================
  // CHAPTER 2: DAILY ACTIVITIES (5 LESSONS)
  // ============================================

  {
    id: "L5-C02-L01",
    chapterId: "C02",
    chapterTitle: "Daily Life Sentences",
    title: "मुझे भूख है - I am hungry",
    category: "Needs",
    skill: "Expressing Hunger",
    sentence: "मुझे भूख है।",
    sentenceRoman: "Mujhe bhookh hai.",
    sentenceEnglish: "I am hungry.",
    words: [
      { hindi: "मुझे", roman: "mujhe", english: "me (indirect object)" },
      { hindi: "भूख", roman: "bhookh", english: "hunger" },
      { hindi: "है", roman: "hai", english: "is" },
    ],
    assetPath: "/assets/gemini/vaani_l5_bhookh_hungry_1777200169.png",
    summary: "Express basic needs in Hindi - use the indirect object form!",
    prompt: "भूख - say it loud and long like your stomach rumbling!",
  },
  {
    id: "L5-C02-L02",
    chapterId: "C02",
    chapterTitle: "Daily Life Sentences",
    title: "यह क्या है? - What is this?",
    category: "Objects",
    skill: "Identifying Things",
    sentence: "यह एक किताब है।",
    sentenceRoman: "Yeh ek kitaab hai.",
    sentenceEnglish: "This is a book.",
    words: [
      { hindi: "यह", roman: "yeh", english: "this" },
      { hindi: "एक", roman: "ek", english: "one/a" },
      { hindi: "किताब", roman: "kitaab", english: "book" },
      { hindi: "है", roman: "hai", english: "is" },
    ],
    assetPath: "/assets/gemini/vaani_l5_kya_what_1777200193.png",
    summary: "Ask about objects and identify them with sentences.",
    prompt: "यह means 'this' - point at things and say them!",
  },
  {
    id: "L5-C02-L03",
    chapterId: "C02",
    chapterTitle: "Daily Life Sentences",
    title: "मुझे पसंद है - I like",
    category: "Preferences",
    skill: "Expressing Likes",
    sentence: "मुझे मंगो पसंद है।",
    sentenceRoman: "Mujhe aamo pasand hai.",
    sentenceEnglish: "I like mangoes.",
    words: [
      { hindi: "मुझे", roman: "mujhe", english: "me" },
      { hindi: "आम", roman: "aam", english: "mango" },
      { hindi: "पसंद", roman: "pasand", english: "liked" },
      { hindi: "है", roman: "hai", english: "is" },
    ],
    assetPath: "/assets/gemini/vaani_l5_pasand_like_1777200217.png",
    summary: "Express your preferences with पसंद - very common in Hindi!",
    prompt: "पसंद means 'preferred' - say what you like!",
  },
  {
    id: "L5-C02-L04",
    chapterId: "C02",
    chapterTitle: "Daily Life Sentences",
    title: "मैं स्कूल जाता हूँ - I go to school",
    category: "Actions",
    skill: "Daily Actions",
    sentence: "मैं स्कूल जाता हूँ।",
    sentenceRoman: "Main school jata hoon.",
    sentenceEnglish: "I go to school. (male)",
    words: [
      { hindi: "मैं", roman: "main", english: "I" },
      { hindi: "स्कूल", roman: "school", english: "school" },
      { hindi: "जाता", roman: "jata", english: "go (masculine habitual)" },
      { hindi: "हूँ", roman: "hoon", english: "am" },
    ],
    assetPath: "/assets/gemini/vaani_l5_jata_go_1777200241.png",
    summary: "Describe daily actions with habitual present tense.",
    prompt: "जाता means 'go' - it shows your daily routine!",
  },
  {
    id: "L5-C02-L05",
    chapterId: "C02",
    chapterTitle: "Daily Life Sentences",
    title: "क्या आप मेरी मदद कर सकते हैं?",
    category: "Requests",
    skill: "Asking for Help",
    sentence: "क्या आप मेरी मदद कर सकते हैं?",
    sentenceRoman: "Kya aap meri madad kar sakte hain?",
    sentenceEnglish: "Can you help me?",
    words: [
      { hindi: "क्या", roman: "kya", english: "can/question" },
      { hindi: "आप", roman: "aap", english: "you (formal)" },
      { hindi: "मेरी", roman: "meri", english: "my" },
      { hindi: "मदद", roman: "madad", english: "help" },
      { hindi: "कर", roman: "kar", english: "do" },
      { hindi: "सकते", roman: "sakte", english: "able/can" },
      { hindi: "हैं", roman: "hain", english: "are" },
    ],
    assetPath: "/assets/gemini/vaani_l5_madad_help_1777200265.png",
    summary: "Ask for help politely - a very practical sentence!",
    prompt: "मदद means 'help' - it's how you ask for support!",
  },
];

// Roman transliteration map for Level 5
export const LEVEL_5_ROMAN_MAP: Record<string, string> = {
  "L5-C01-L01": "namaste",
  "L5-C01-L02": "aap-kaise-hain",
  "L5-C01-L03": "main-theek-hoon",
  "L5-C01-L04": "dhanyavaad",
  "L5-C01-L05": "kripaya-baithiye",
  "L5-C01-L06": "mera-naam",
  "L5-C01-L07": "aapka-naam-kya-hai",
  "L5-C02-L01": "mujhe-bhookh-hai",
  "L5-C02-L02": "yeh-kya-hai",
  "L5-C02-L03": "mujhe-pasand-hai",
  "L5-C02-L04": "main-school-jata-hoon",
  "L5-C02-L05": "madad-kar-sakte-hain",
};

// Re-export for compatibility
export const vaaniLevel5Data = LEVEL_5_DATA;
