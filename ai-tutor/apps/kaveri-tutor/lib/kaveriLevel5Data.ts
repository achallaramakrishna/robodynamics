/**
 * Kaveri Level 5: Sentence Construction (30 lessons)
 * Focus: Simple Kannada sentences and word combinations
 * Progression: 2-word sentences → 3-word sentences → My World stories
 * Concept: Real-world Kannada communication (2-4 words per sentence)
 * Total: 30 lessons across 2 chapters
 */

export interface Level5Word {
  hindi: string;   // field name kept for KaveriData.ts compatibility; holds Kannada text
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
  mcqs?: Array<{ question: string; options: string[]; answer: string }>;
}

// ============================================================
// CHAPTER 1: ಸರಳ ವಾಕ್ಯಗಳು — SIMPLE SENTENCES (15 LESSONS)
// ============================================================

export const LEVEL_5_DATA: Level5Seed[] = [
  // ── C01-L01 ──────────────────────────────────────────────
  {
    id: "L5-C01-L01",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ನಮಸ್ಕಾರ ಅಕ್ಕ — Hello Elder Sister",
    category: "Greetings",
    skill: "Basic Greeting",
    sentence: "ನಮಸ್ಕಾರ ಅಕ್ಕ।",
    sentenceRoman: "Namaskara akka.",
    sentenceEnglish: "Greetings, elder sister.",
    words: [
      { hindi: "ನಮಸ್ಕಾರ", roman: "namaskara", english: "greetings / hello" },
      { hindi: "ಅಕ್ಕ", roman: "akka", english: "elder sister" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_namaskara_akka.png",
    summary: "Learn the respectful Kannada greeting ನಮಸ್ಕಾರ paired with ಅಕ್ಕ.",
    prompt: "ನಮಸ್ಕಾರ is how we greet with respect in Kannada — ಅಕ್ಕ means elder sister!",
    mcqs: [
      {
        question: "What does ನಮಸ್ಕಾರ mean?",
        options: ["Goodbye", "Greetings", "Thank you", "Please"],
        answer: "Greetings",
      },
    ],
  },

  // ── C01-L02 ──────────────────────────────────────────────
  {
    id: "L5-C01-L02",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ನಾನು ಇದ್ದೇನೆ — I Am Here",
    category: "Self Introduction",
    skill: "Subject + Verb",
    sentence: "ನಾನು ಇದ್ದೇನೆ।",
    sentenceRoman: "Naanu iddene.",
    sentenceEnglish: "I am here.",
    words: [
      { hindi: "ನಾನು", roman: "naanu", english: "I" },
      { hindi: "ಇದ್ದೇನೆ", roman: "iddene", english: "am here" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naanu_iddene.png",
    summary: "First-person sentence — ನಾನು (I) + ಇದ್ದೇನೆ (am here).",
    prompt: "ನಾನು is the Kannada word for 'I' — say it proudly!",
    mcqs: [
      {
        question: "Which word means 'I' in Kannada?",
        options: ["ಅವನು", "ನಾನು", "ಅವಳು", "ನೀನು"],
        answer: "ನಾನು",
      },
    ],
  },

  // ── C01-L03 ──────────────────────────────────────────────
  {
    id: "L5-C01-L03",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಇದು ಮನೆ — This Is a House",
    category: "Identification",
    skill: "This is X",
    sentence: "ಇದು ಮನೆ।",
    sentenceRoman: "Idu mane.",
    sentenceEnglish: "This is a house.",
    words: [
      { hindi: "ಇದು", roman: "idu", english: "this" },
      { hindi: "ಮನೆ", roman: "mane", english: "house" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_idu_mane.png",
    summary: "ಇದು means 'this' — use it to point at things around you!",
    prompt: "ಇದು ಮನೆ — point to a house and say it loud!",
    mcqs: [
      {
        question: "What does ಮನೆ mean?",
        options: ["School", "House", "Tree", "Book"],
        answer: "House",
      },
    ],
  },

  // ── C01-L04 ──────────────────────────────────────────────
  {
    id: "L5-C01-L04",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಅವಳು ಅಮ್ಮ — She Is Mother",
    category: "Family",
    skill: "Subject Identification",
    sentence: "ಅವಳು ಅಮ್ಮ।",
    sentenceRoman: "Avalu amma.",
    sentenceEnglish: "She is mother.",
    words: [
      { hindi: "ಅವಳು", roman: "avalu", english: "she" },
      { hindi: "ಅಮ್ಮ", roman: "amma", english: "mother" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_avalu_amma.png",
    summary: "ಅವಳು means 'she' — used when talking about a woman or girl.",
    prompt: "ಅವಳು ಅಮ್ಮ — she is the one who loves you most!",
    mcqs: [
      {
        question: "Which word means 'she' in Kannada?",
        options: ["ಅವನು", "ನಾನು", "ಅವಳು", "ಇದು"],
        answer: "ಅವಳು",
      },
    ],
  },

  // ── C01-L05 ──────────────────────────────────────────────
  {
    id: "L5-C01-L05",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಅವನು ಅಣ್ಣ — He Is Elder Brother",
    category: "Family",
    skill: "Subject Identification",
    sentence: "ಅವನು ಅಣ್ಣ।",
    sentenceRoman: "Avanu anna.",
    sentenceEnglish: "He is elder brother.",
    words: [
      { hindi: "ಅವನು", roman: "avanu", english: "he" },
      { hindi: "ಅಣ್ಣ", roman: "anna", english: "elder brother" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_avanu_anna.png",
    summary: "ಅವನು means 'he' — used when talking about a man or boy.",
    prompt: "ಅವನು ಅಣ್ಣ — do you have an elder brother?",
    mcqs: [
      {
        question: "What does ಅಣ್ಣ mean?",
        options: ["Elder sister", "Elder brother", "Father", "Friend"],
        answer: "Elder brother",
      },
    ],
  },

  // ── C01-L06 ──────────────────────────────────────────────
  {
    id: "L5-C01-L06",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ನಾಯಿ ಓಡುತ್ತದೆ — The Dog Runs",
    category: "Action Sentences",
    skill: "Subject + Verb Action",
    sentence: "ನಾಯಿ ಓಡುತ್ತದೆ।",
    sentenceRoman: "Naayi oduttade.",
    sentenceEnglish: "The dog runs.",
    words: [
      { hindi: "ನಾಯಿ", roman: "naayi", english: "dog" },
      { hindi: "ಓಡುತ್ತದೆ", roman: "oduttade", english: "runs" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naayi_oduttade.png",
    summary: "ನಾಯಿ is dog, ಓಡುತ್ತದೆ is runs — a simple action sentence!",
    prompt: "ನಾಯಿ ಓಡುತ್ತದೆ — watch the dog zoom away!",
    mcqs: [
      {
        question: "What does ನಾಯಿ mean?",
        options: ["Cat", "Dog", "Bird", "Fish"],
        answer: "Dog",
      },
    ],
  },

  // ── C01-L07 ──────────────────────────────────────────────
  {
    id: "L5-C01-L07",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಮಗು ಅಳುತ್ತದೆ — The Baby Cries",
    category: "Action Sentences",
    skill: "Subject + Verb Action",
    sentence: "ಮಗು ಅಳುತ್ತದೆ।",
    sentenceRoman: "Magu aluttade.",
    sentenceEnglish: "The baby cries.",
    words: [
      { hindi: "ಮಗು", roman: "magu", english: "baby / child" },
      { hindi: "ಅಳುತ್ತದೆ", roman: "aluttade", english: "cries" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_magu_aluttade.png",
    summary: "ಮಗು (baby/child) + ಅಳುತ್ತದೆ (cries) — describing an action.",
    prompt: "ಮಗು ಅಳುತ್ತದೆ — don't worry, give it a hug!",
    mcqs: [
      {
        question: "What does ಅಳುತ್ತದೆ mean?",
        options: ["Laughs", "Runs", "Cries", "Sleeps"],
        answer: "Cries",
      },
    ],
  },

  // ── C01-L08 ──────────────────────────────────────────────
  {
    id: "L5-C01-L08",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಹಕ್ಕಿ ಹಾರುತ್ತದೆ — The Bird Flies",
    category: "Action Sentences",
    skill: "Subject + Verb Action",
    sentence: "ಹಕ್ಕಿ ಹಾರುತ್ತದೆ।",
    sentenceRoman: "Hakki haaruttade.",
    sentenceEnglish: "The bird flies.",
    words: [
      { hindi: "ಹಕ್ಕಿ", roman: "hakki", english: "bird" },
      { hindi: "ಹಾರುತ್ತದೆ", roman: "haaruttade", english: "flies" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_hakki_haaruttade.png",
    summary: "ಹಕ್ಕಿ (bird) + ಹಾರುತ್ತದೆ (flies) — both start with ಹ!",
    prompt: "ಹಕ್ಕಿ ಹಾರುತ್ತದೆ — notice how both words start with ಹ!",
    mcqs: [
      {
        question: "What does ಹಕ್ಕಿ mean?",
        options: ["Dog", "Fish", "Bird", "Cow"],
        answer: "Bird",
      },
    ],
  },

  // ── C01-L09 ──────────────────────────────────────────────
  {
    id: "L5-C01-L09",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ನಾನು ತಿನ್ನುತ್ತೇನೆ — I Eat",
    category: "Daily Actions",
    skill: "First Person Verb",
    sentence: "ನಾನು ತಿನ್ನುತ್ತೇನೆ।",
    sentenceRoman: "Naanu tinnuttene.",
    sentenceEnglish: "I eat.",
    words: [
      { hindi: "ನಾನು", roman: "naanu", english: "I" },
      { hindi: "ತಿನ್ನುತ್ತೇನೆ", roman: "tinnuttene", english: "eat" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naanu_tinnuttene.png",
    summary: "First-person verb — ನಾನು (I) + ತಿನ್ನುತ್ತೇನೆ (eat).",
    prompt: "ನಾನು ತಿನ್ನುತ್ತೇನೆ — what's your favourite food?",
    mcqs: [
      {
        question: "What does ತಿನ್ನುತ್ತೇನೆ mean?",
        options: ["Sleep", "Eat", "Run", "Read"],
        answer: "Eat",
      },
    ],
  },

  // ── C01-L10 ──────────────────────────────────────────────
  {
    id: "L5-C01-L10",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಅವಳು ಕುಡಿಯುತ್ತಾಳೆ — She Drinks",
    category: "Daily Actions",
    skill: "Third Person Verb",
    sentence: "ಅವಳು ಕುಡಿಯುತ್ತಾಳೆ।",
    sentenceRoman: "Avalu kudiyuttale.",
    sentenceEnglish: "She drinks.",
    words: [
      { hindi: "ಅವಳು", roman: "avalu", english: "she" },
      { hindi: "ಕುಡಿಯುತ್ತಾಳೆ", roman: "kudiyuttale", english: "drinks" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_avalu_kudiyuttale.png",
    summary: "Feminine third-person verb — ಅವಳು (she) + ಕುಡಿಯುತ್ತಾಳೆ (drinks).",
    prompt: "ಅವಳು ಕುಡಿಯುತ್ತಾಳೆ — Kannada verbs change with gender!",
    mcqs: [
      {
        question: "What does ಕುಡಿಯುತ್ತಾಳೆ mean?",
        options: ["Eats", "Drinks", "Runs", "Sleeps"],
        answer: "Drinks",
      },
    ],
  },

  // ── C01-L11 ──────────────────────────────────────────────
  {
    id: "L5-C01-L11",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ನಾನು ಬರೆಯುತ್ತೇನೆ — I Write",
    category: "Daily Actions",
    skill: "First Person Verb",
    sentence: "ನಾನು ಬರೆಯುತ್ತೇನೆ।",
    sentenceRoman: "Naanu bareyuttene.",
    sentenceEnglish: "I write.",
    words: [
      { hindi: "ನಾನು", roman: "naanu", english: "I" },
      { hindi: "ಬರೆಯುತ್ತೇನೆ", roman: "bareyuttene", english: "write" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naanu_bareyuttene.png",
    summary: "ನಾನು ಬರೆಯುತ್ತೇನೆ — you are already writing Kannada!",
    prompt: "ಬರೆಯುತ್ತೇನೆ comes from ಬರೆ (baro) — to write in Kannada!",
    mcqs: [
      {
        question: "What does ಬರೆಯುತ್ತೇನೆ mean?",
        options: ["Read", "Write", "Draw", "Sing"],
        answer: "Write",
      },
    ],
  },

  // ── C01-L12 ──────────────────────────────────────────────
  {
    id: "L5-C01-L12",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಅವನು ಓದುತ್ತಾನೆ — He Reads",
    category: "Daily Actions",
    skill: "Third Person Verb",
    sentence: "ಅವನು ಓದುತ್ತಾನೆ।",
    sentenceRoman: "Avanu oduttane.",
    sentenceEnglish: "He reads.",
    words: [
      { hindi: "ಅವನು", roman: "avanu", english: "he" },
      { hindi: "ಓದುತ್ತಾನೆ", roman: "oduttane", english: "reads" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_avanu_oduttane.png",
    summary: "Masculine third-person verb — ಅವನು (he) + ಓದುತ್ತಾನೆ (reads).",
    prompt: "ಅವನು ಓದುತ್ತಾನೆ — just like you are reading Kannada right now!",
    mcqs: [
      {
        question: "What does ಓದುತ್ತಾನೆ mean?",
        options: ["Writes", "Reads", "Eats", "Plays"],
        answer: "Reads",
      },
    ],
  },

  // ── C01-L13 ──────────────────────────────────────────────
  {
    id: "L5-C01-L13",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಮೀನು ಈಜುತ್ತದೆ — The Fish Swims",
    category: "Nature Actions",
    skill: "Subject + Verb Action",
    sentence: "ಮೀನು ಈಜುತ್ತದೆ।",
    sentenceRoman: "Meenu eejuttade.",
    sentenceEnglish: "The fish swims.",
    words: [
      { hindi: "ಮೀನು", roman: "meenu", english: "fish" },
      { hindi: "ಈಜುತ್ತದೆ", roman: "eejuttade", english: "swims" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_meenu_eejuttade.png",
    summary: "ಮೀನು (fish) + ಈಜುತ್ತದೆ (swims) — nature in action!",
    prompt: "ಮೀನು ಈಜುತ್ತದೆ — the fish glides through water!",
    mcqs: [
      {
        question: "What does ಮೀನು mean?",
        options: ["Bird", "Dog", "Fish", "Cow"],
        answer: "Fish",
      },
    ],
  },

  // ── C01-L14 ──────────────────────────────────────────────
  {
    id: "L5-C01-L14",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಮಗು ನಗುತ್ತದೆ — The Baby Smiles",
    category: "Emotions",
    skill: "Subject + Verb Action",
    sentence: "ಮಗು ನಗುತ್ತದೆ।",
    sentenceRoman: "Magu naguttade.",
    sentenceEnglish: "The baby smiles.",
    words: [
      { hindi: "ಮಗು", roman: "magu", english: "baby / child" },
      { hindi: "ನಗುತ್ತದೆ", roman: "naguttade", english: "smiles / laughs" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_magu_naguttade.png",
    summary: "ಮಗು (child) + ನಗುತ್ತದೆ (smiles) — joy in two words!",
    prompt: "ಮಗು ನಗುತ್ತದೆ — smiles are the same in every language!",
    mcqs: [
      {
        question: "What does ನಗುತ್ತದೆ mean?",
        options: ["Cries", "Runs", "Smiles", "Sleeps"],
        answer: "Smiles",
      },
    ],
  },

  // ── C01-L15 ──────────────────────────────────────────────
  {
    id: "L5-C01-L15",
    chapterId: "C01",
    chapterTitle: "ಸರಳ ವಾಕ್ಯಗಳು",
    title: "ಅಮ್ಮ ಬರುತ್ತಾರೆ — Mother Is Coming",
    category: "Family Actions",
    skill: "Honourific Verb",
    sentence: "ಅಮ್ಮ ಬರುತ್ತಾರೆ।",
    sentenceRoman: "Amma baruttare.",
    sentenceEnglish: "Mother is coming.",
    words: [
      { hindi: "ಅಮ್ಮ", roman: "amma", english: "mother" },
      { hindi: "ಬರುತ್ತಾರೆ", roman: "baruttare", english: "is coming (honourific)" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_amma_baruttare.png",
    summary: "ಬರುತ್ತಾರೆ uses the respectful plural form for elders like Amma.",
    prompt: "ಬರುತ್ತಾರೆ — Kannada shows respect through verb endings for elders!",
    mcqs: [
      {
        question: "ಬರುತ್ತಾರೆ is the respectful form of which verb?",
        options: ["Eat", "Run", "Come", "Sleep"],
        answer: "Come",
      },
    ],
  },

  // ============================================================
  // CHAPTER 2: ದೈನಂದಿನ ಮಾತುಕತೆ — DAILY CONVERSATION (15 LESSONS)
  // ============================================================

  // ── C02-L01 ──────────────────────────────────────────────
  {
    id: "L5-C02-L01",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಇದು ಏನು? — What Is This?",
    category: "Questions",
    skill: "Asking Questions",
    sentence: "ಇದು ಏನು?",
    sentenceRoman: "Idu enu?",
    sentenceEnglish: "What is this?",
    words: [
      { hindi: "ಇದು", roman: "idu", english: "this" },
      { hindi: "ಏನು", roman: "enu", english: "what" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_idu_enu.png",
    summary: "ಇದು ಏನು? is the most useful question for a curious learner!",
    prompt: "ಏನು means 'what' — use ಇದು ಏನು to ask about anything you see!",
    mcqs: [
      {
        question: "What does ಏನು mean?",
        options: ["Who", "Where", "What", "When"],
        answer: "What",
      },
    ],
  },

  // ── C02-L02 ──────────────────────────────────────────────
  {
    id: "L5-C02-L02",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಇದು ಪುಸ್ತಕ — This Is a Book",
    category: "Identification",
    skill: "Answering This-Is Questions",
    sentence: "ಇದು ಪುಸ್ತಕ।",
    sentenceRoman: "Idu pustaka.",
    sentenceEnglish: "This is a book.",
    words: [
      { hindi: "ಇದು", roman: "idu", english: "this" },
      { hindi: "ಪುಸ್ತಕ", roman: "pustaka", english: "book" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_idu_pustaka.png",
    summary: "Answer ಇದು ಏನು? with ಇದು ಪುಸ್ತಕ — this is a book!",
    prompt: "ಪುಸ್ತಕ — the very thing you are reading right now!",
    mcqs: [
      {
        question: "What does ಪುಸ್ತಕ mean?",
        options: ["Pencil", "Book", "Bag", "Desk"],
        answer: "Book",
      },
    ],
  },

  // ── C02-L03 ──────────────────────────────────────────────
  {
    id: "L5-C02-L03",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ — I Go to School",
    category: "Daily Life",
    skill: "Three-Word Sentence",
    sentence: "ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ।",
    sentenceRoman: "Naanu shalege hoguttene.",
    sentenceEnglish: "I go to school.",
    words: [
      { hindi: "ನಾನು", roman: "naanu", english: "I" },
      { hindi: "ಶಾಲೆಗೆ", roman: "shalege", english: "to school" },
      { hindi: "ಹೋಗುತ್ತೇನೆ", roman: "hoguttene", english: "go" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naanu_shalege.png",
    summary: "First 3-word sentence! ನಾನು (I) + ಶಾಲೆಗೆ (to school) + ಹೋಗುತ್ತೇನೆ (go).",
    prompt: "ಶಾಲೆಗೆ — the suffix ಗೆ means 'to' in Kannada!",
    mcqs: [
      {
        question: "What does ಶಾಲೆ mean?",
        options: ["Home", "Market", "School", "Park"],
        answer: "School",
      },
    ],
  },

  // ── C02-L04 ──────────────────────────────────────────────
  {
    id: "L5-C02-L04",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ನಾನು ಊಟ ಮಾಡುತ್ತೇನೆ — I Eat Lunch",
    category: "Daily Life",
    skill: "Three-Word Sentence",
    sentence: "ನಾನು ಊಟ ಮಾಡುತ್ತೇನೆ।",
    sentenceRoman: "Naanu uuta maaduttene.",
    sentenceEnglish: "I eat lunch.",
    words: [
      { hindi: "ನಾನು", roman: "naanu", english: "I" },
      { hindi: "ಊಟ", roman: "uuta", english: "lunch / meal" },
      { hindi: "ಮಾಡುತ್ತೇನೆ", roman: "maaduttene", english: "do / eat" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naanu_uuta.png",
    summary: "ಊಟ ಮಾಡುತ್ತೇನೆ — literally 'do eating' — Kannada meal idiom!",
    prompt: "ಊಟ ಮಾಡು means 'eat a meal' — what's your favourite ಊಟ?",
    mcqs: [
      {
        question: "What does ಊಟ mean?",
        options: ["Snack", "Lunch/meal", "Drink", "Fruit"],
        answer: "Lunch/meal",
      },
    ],
  },

  // ── C02-L05 ──────────────────────────────────────────────
  {
    id: "L5-C02-L05",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಅಮ್ಮ ಅಡಿಗೆ ಮಾಡುತ್ತಾರೆ — Mother Cooks",
    category: "Family Actions",
    skill: "Three-Word Sentence",
    sentence: "ಅಮ್ಮ ಅಡಿಗೆ ಮಾಡುತ್ತಾರೆ।",
    sentenceRoman: "Amma adige maaduttare.",
    sentenceEnglish: "Mother cooks.",
    words: [
      { hindi: "ಅಮ್ಮ", roman: "amma", english: "mother" },
      { hindi: "ಅಡಿಗೆ", roman: "adige", english: "cooking" },
      { hindi: "ಮಾಡುತ್ತಾರೆ", roman: "maaduttare", english: "does (honourific)" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_amma_adige.png",
    summary: "ಅಡಿಗೆ is Kannada for cooking — the whole kitchen in one word!",
    prompt: "ಅಡಿಗೆ ಮಾಡುತ್ತಾರೆ — ಅಮ್ಮ's cooking is the best!",
    mcqs: [
      {
        question: "What does ಅಡಿಗೆ mean?",
        options: ["Shopping", "Cooking", "Sleeping", "Playing"],
        answer: "Cooking",
      },
    ],
  },

  // ── C02-L06 ──────────────────────────────────────────────
  {
    id: "L5-C02-L06",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಅಣ್ಣ ಆಟ ಆಡುತ್ತಾನೆ — Elder Brother Plays",
    category: "Play & Fun",
    skill: "Three-Word Sentence",
    sentence: "ಅಣ್ಣ ಆಟ ಆಡುತ್ತಾನೆ।",
    sentenceRoman: "Anna aata aaduttane.",
    sentenceEnglish: "Elder brother plays.",
    words: [
      { hindi: "ಅಣ್ಣ", roman: "anna", english: "elder brother" },
      { hindi: "ಆಟ", roman: "aata", english: "game / play" },
      { hindi: "ಆಡುತ್ತಾನೆ", roman: "aaduttane", english: "plays" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_anna_aata.png",
    summary: "ಆಟ (game) + ಆಡು (play) — both start with ಆ, easy to remember!",
    prompt: "ಆಟ ಆಡುತ್ತಾನೆ — what game does your ಅಣ್ಣ play?",
    mcqs: [
      {
        question: "What does ಆಟ mean?",
        options: ["Book", "Food", "Game/play", "School"],
        answer: "Game/play",
      },
    ],
  },

  // ── C02-L07 ──────────────────────────────────────────────
  {
    id: "L5-C02-L07",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ — I Drink Water",
    category: "Daily Life",
    skill: "Three-Word Sentence",
    sentence: "ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ।",
    sentenceRoman: "Naanu neeru kudiyuttene.",
    sentenceEnglish: "I drink water.",
    words: [
      { hindi: "ನಾನು", roman: "naanu", english: "I" },
      { hindi: "ನೀರು", roman: "neeru", english: "water" },
      { hindi: "ಕುಡಿಯುತ್ತೇನೆ", roman: "kudiyuttene", english: "drink" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naanu_neeru.png",
    summary: "ನೀರು is water — one of the most important words in any language!",
    prompt: "ನೀರು ಕುಡಿಯುತ್ತೇನೆ — drink water, stay healthy!",
    mcqs: [
      {
        question: "What does ನೀರು mean?",
        options: ["Milk", "Juice", "Water", "Tea"],
        answer: "Water",
      },
    ],
  },

  // ── C02-L08 ──────────────────────────────────────────────
  {
    id: "L5-C02-L08",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಹಸು ಹಾಲು ಕೊಡುತ್ತದೆ — The Cow Gives Milk",
    category: "Nature & Animals",
    skill: "Three-Word Sentence",
    sentence: "ಹಸು ಹಾಲು ಕೊಡುತ್ತದೆ।",
    sentenceRoman: "Hasu haalu koduttade.",
    sentenceEnglish: "The cow gives milk.",
    words: [
      { hindi: "ಹಸು", roman: "hasu", english: "cow" },
      { hindi: "ಹಾಲು", roman: "haalu", english: "milk" },
      { hindi: "ಕೊಡುತ್ತದೆ", roman: "koduttade", english: "gives" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_hasu_haalu.png",
    summary: "ಹಸು (cow) + ಹಾಲು (milk) + ಕೊಡುತ್ತದೆ (gives) — all start with ಹ!",
    prompt: "ಹಸು ಹಾಲು ಕೊಡುತ್ತದೆ — three ಹ words in one sentence!",
    mcqs: [
      {
        question: "What does ಹಸು mean?",
        options: ["Dog", "Buffalo", "Cow", "Goat"],
        answer: "Cow",
      },
    ],
  },

  // ── C02-L09 ──────────────────────────────────────────────
  {
    id: "L5-C02-L09",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಮಳೆ ಬರುತ್ತದೆ — It Rains",
    category: "Nature",
    skill: "Subject + Verb",
    sentence: "ಮಳೆ ಬರುತ್ತದೆ।",
    sentenceRoman: "Male baruttade.",
    sentenceEnglish: "It rains. (Rain comes.)",
    words: [
      { hindi: "ಮಳೆ", roman: "male", english: "rain" },
      { hindi: "ಬರುತ್ತದೆ", roman: "baruttade", english: "comes" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_male_baruttade.png",
    summary: "ಮಳೆ ಬರುತ್ತದೆ — Kannada says 'rain comes', not 'it rains'!",
    prompt: "ಮಳೆ ಬರುತ್ತದೆ — do you like rainy days?",
    mcqs: [
      {
        question: "What does ಮಳೆ mean?",
        options: ["Sun", "Wind", "Rain", "Cloud"],
        answer: "Rain",
      },
    ],
  },

  // ── C02-L10 ──────────────────────────────────────────────
  {
    id: "L5-C02-L10",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಬಿಸಿಲು ಬರುತ್ತದೆ — The Sun Shines",
    category: "Nature",
    skill: "Subject + Verb",
    sentence: "ಬಿಸಿಲು ಬರುತ್ತದೆ।",
    sentenceRoman: "Bisilu baruttade.",
    sentenceEnglish: "The sun shines. (Sunshine comes.)",
    words: [
      { hindi: "ಬಿಸಿಲು", roman: "bisilu", english: "sunshine / sunlight" },
      { hindi: "ಬರುತ್ತದೆ", roman: "baruttade", english: "comes" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_bisilu_baruttade.png",
    summary: "ಬಿಸಿಲು ಬರುತ್ತದೆ — sunshine comes, just like ಮಳೆ ಬರುತ್ತದೆ!",
    prompt: "ಬಿಸಿಲು — warm, bright sunshine in Kannada!",
    mcqs: [
      {
        question: "What does ಬಿಸಿಲು mean?",
        options: ["Rain", "Cold", "Sunshine", "Wind"],
        answer: "Sunshine",
      },
    ],
  },

  // ── C02-L11 ──────────────────────────────────────────────
  {
    id: "L5-C02-L11",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ನಾನು ಮಲಗುತ್ತೇನೆ — I Sleep",
    category: "Daily Routine",
    skill: "First Person Verb",
    sentence: "ನಾನು ಮಲಗುತ್ತೇನೆ।",
    sentenceRoman: "Naanu malaguttene.",
    sentenceEnglish: "I sleep.",
    words: [
      { hindi: "ನಾನು", roman: "naanu", english: "I" },
      { hindi: "ಮಲಗುತ್ತೇನೆ", roman: "malaguttene", english: "sleep" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naanu_malaguttene.png",
    summary: "ಮಲಗು (malagu) is to lie down / sleep in Kannada.",
    prompt: "ನಾನು ಮಲಗುತ್ತೇನೆ — sweet dreams in Kannada!",
    mcqs: [
      {
        question: "What does ಮಲಗುತ್ತೇನೆ mean?",
        options: ["Eat", "Play", "Sleep", "Read"],
        answer: "Sleep",
      },
    ],
  },

  // ── C02-L12 ──────────────────────────────────────────────
  {
    id: "L5-C02-L12",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಅಪ್ಪ ಕೆಲಸಕ್ಕೆ ಹೋಗುತ್ತಾರೆ — Father Goes to Work",
    category: "Family Actions",
    skill: "Three-Word Sentence",
    sentence: "ಅಪ್ಪ ಕೆಲಸಕ್ಕೆ ಹೋಗುತ್ತಾರೆ।",
    sentenceRoman: "Appa kelasake hoguttare.",
    sentenceEnglish: "Father goes to work.",
    words: [
      { hindi: "ಅಪ್ಪ", roman: "appa", english: "father" },
      { hindi: "ಕೆಲಸಕ್ಕೆ", roman: "kelasake", english: "to work" },
      { hindi: "ಹೋಗುತ್ತಾರೆ", roman: "hoguttare", english: "go (honourific)" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_appa_kelasake.png",
    summary: "ಕೆಲಸ (work) + ಗೆ (to) = ಕೆಲಸಕ್ಕೆ — the suffix changes the meaning!",
    prompt: "ಕೆಲಸಕ್ಕೆ — adding ಗೆ/ಕ್ಕೆ means 'to' a place in Kannada!",
    mcqs: [
      {
        question: "What does ಅಪ್ಪ mean?",
        options: ["Mother", "Father", "Brother", "Teacher"],
        answer: "Father",
      },
    ],
  },

  // ── C02-L13 ──────────────────────────────────────────────
  {
    id: "L5-C02-L13",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ನಮ್ಮ ಮನೆ ದೊಡ್ಡದು — Our House Is Big",
    category: "Descriptions",
    skill: "Subject + Adjective",
    sentence: "ನಮ್ಮ ಮನೆ ದೊಡ್ಡದು।",
    sentenceRoman: "Namma mane doddadu.",
    sentenceEnglish: "Our house is big.",
    words: [
      { hindi: "ನಮ್ಮ", roman: "namma", english: "our" },
      { hindi: "ಮನೆ", roman: "mane", english: "house" },
      { hindi: "ದೊಡ್ಡದು", roman: "doddadu", english: "big" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_namma_mane_doddadu.png",
    summary: "ನಮ್ಮ (our) + ಮನೆ (house) + ದೊಡ್ಡದು (big) — describing home!",
    prompt: "ದೊಡ್ಡದು is big — its opposite is ಚಿಕ್ಕದು (small)!",
    mcqs: [
      {
        question: "What does ದೊಡ್ಡದು mean?",
        options: ["Small", "New", "Old", "Big"],
        answer: "Big",
      },
    ],
  },

  // ── C02-L14 ──────────────────────────────────────────────
  {
    id: "L5-C02-L14",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ನಾನು ಖುಷಿಯಾಗಿದ್ದೇನೆ — I Am Happy",
    category: "Feelings",
    skill: "Emotion Expression",
    sentence: "ನಾನು ಖುಷಿಯಾಗಿದ್ದೇನೆ।",
    sentenceRoman: "Naanu khushiyagiddene.",
    sentenceEnglish: "I am happy.",
    words: [
      { hindi: "ನಾನು", roman: "naanu", english: "I" },
      { hindi: "ಖುಷಿಯಾಗಿದ್ದೇನೆ", roman: "khushiyagiddene", english: "am happy" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_naanu_khushiyagiddene.png",
    summary: "ಖುಷಿ comes from the Urdu/Persian word for happiness — used in everyday Kannada!",
    prompt: "ನಾನು ಖುಷಿಯಾಗಿದ್ದೇನೆ — say it when you feel joy!",
    mcqs: [
      {
        question: "What does ಖುಷಿ mean?",
        options: ["Sad", "Angry", "Happy", "Tired"],
        answer: "Happy",
      },
    ],
  },

  // ── C02-L15 ──────────────────────────────────────────────
  {
    id: "L5-C02-L15",
    chapterId: "C02",
    chapterTitle: "ದೈನಂದಿನ ಮಾತುಕತೆ",
    title: "ಕನ್ನಡ ಮಧುರವಾದ ಭಾಷೆ — Kannada Is a Sweet Language",
    category: "Language Pride",
    skill: "Extended Sentence",
    sentence: "ಕನ್ನಡ ಮಧುರವಾದ ಭಾಷೆ।",
    sentenceRoman: "Kannada madhuravada bhashe.",
    sentenceEnglish: "Kannada is a sweet language.",
    words: [
      { hindi: "ಕನ್ನಡ", roman: "kannada", english: "Kannada (language)" },
      { hindi: "ಮಧುರವಾದ", roman: "madhuravada", english: "sweet / melodious" },
      { hindi: "ಭಾಷೆ", roman: "bhashe", english: "language" },
    ],
    assetPath: "/kaveri/assets/gemini/kaveri_l5_kannada_bhashe.png",
    summary: "ಮಧುರ means sweet/melodious — Kannada is India's sweetest classical language!",
    prompt: "ಕನ್ನಡ ಮಧುರವಾದ ಭಾಷೆ — now YOU can speak it!",
    mcqs: [
      {
        question: "What does ಭಾಷೆ mean?",
        options: ["Book", "Language", "Letter", "Story"],
        answer: "Language",
      },
    ],
  },
];

// ── Roman pronunciation map ───────────────────────────────────────────────────
export const LEVEL_5_ROMAN_MAP: Record<string, string> = {
  "L5-C01-L01": "namaskara-akka",
  "L5-C01-L02": "naanu-iddene",
  "L5-C01-L03": "idu-mane",
  "L5-C01-L04": "avalu-amma",
  "L5-C01-L05": "avanu-anna",
  "L5-C01-L06": "naayi-oduttade",
  "L5-C01-L07": "magu-aluttade",
  "L5-C01-L08": "hakki-haaruttade",
  "L5-C01-L09": "naanu-tinnuttene",
  "L5-C01-L10": "avalu-kudiyuttale",
  "L5-C01-L11": "naanu-bareyuttene",
  "L5-C01-L12": "avanu-oduttane",
  "L5-C01-L13": "meenu-eejuttade",
  "L5-C01-L14": "magu-naguttade",
  "L5-C01-L15": "amma-baruttare",
  "L5-C02-L01": "idu-enu",
  "L5-C02-L02": "idu-pustaka",
  "L5-C02-L03": "naanu-shalege-hoguttene",
  "L5-C02-L04": "naanu-uuta-maaduttene",
  "L5-C02-L05": "amma-adige-maaduttare",
  "L5-C02-L06": "anna-aata-aaduttane",
  "L5-C02-L07": "naanu-neeru-kudiyuttene",
  "L5-C02-L08": "hasu-haalu-koduttade",
  "L5-C02-L09": "male-baruttade",
  "L5-C02-L10": "bisilu-baruttade",
  "L5-C02-L11": "naanu-malaguttene",
  "L5-C02-L12": "appa-kelasake-hoguttare",
  "L5-C02-L13": "namma-mane-doddadu",
  "L5-C02-L14": "naanu-khushiyagiddene",
  "L5-C02-L15": "kannada-madhuravada-bhashe",
};

// Re-export for compatibility
export const kaveriLevel5Data = LEVEL_5_DATA;
