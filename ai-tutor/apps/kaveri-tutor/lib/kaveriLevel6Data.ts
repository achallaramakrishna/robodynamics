/**
 * Kaveri Level 6: Grammar Essentials - Complete Lesson Data
 * Focus: Parts of Speech, Conjugation, Case Markers, Sentence Construction
 * Total: 42 lessons across 5 chapters
 *
 * Structure:
 * - Chapter 1: ನಾಮಪದ (Nouns) — 9 lessons
 * - Chapter 2: ವಿಶೇಷಣ (Adjectives) — 8 lessons
 * - Chapter 3: ಸರ್ವನಾಮ (Pronouns) — 8 lessons
 * - Chapter 4: ಕ್ರಿಯಾಪದ (Verbs) — 10 lessons
 * - Chapter 5: ವಾಕ್ಯ ರಚನೆ (Sentence Structure) — 7 lessons
 */

export interface GrammarLesson {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  category: string;
  skill: string;
  order: number;
  grammarTopic: string;
  grammarTopicKannada: string;
  ruleExplanation: string;
  ruleExplanationKannada: string;
  exampleSentenceKannada: string;
  exampleSentenceRoman: string;
  exampleSentenceEnglish: string;
  practiceExamples: Array<{
    kannada: string;
    roman: string;
    english: string;
    explanation: string;
  }>;
  commonMistakes: Array<{
    incorrect: string;
    correct: string;
    explanation: string;
  }>;
  transformationExercises: Array<{
    instruction: string;
    exampleInstructionKannada: string;
    exampleInput: string;
    exampleOutput: string;
  }>;
  mcqQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  summary: string;
  prompt: string;
  assetPath?: string;
}

// ============================================
// CHAPTER 1: ನಾಮಪದ — NOUNS (9 LESSONS)
// ============================================

const chapter1Lessons: GrammarLesson[] = [
  {
    id: "L6-C01-L01",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ಸಾಮಾನ್ಯ ನಾಮಪದ (Common Nouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 1,
    grammarTopic: "Common Nouns",
    grammarTopicKannada: "ಸಾಮಾನ್ಯ ನಾಮಪದ",
    ruleExplanation:
      "Common nouns refer to general persons, places, or things (not specific). Examples: house, book, dog. In Kannada: ಮನೆ (house), ಪುಸ್ತಕ (book), ನಾಯಿ (dog).",
    ruleExplanationKannada:
      "ಸಾಮಾನ್ಯ ನಾಮಪದಗಳು ನಿರ್ದಿಷ್ಟ ವ್ಯಕ್ತಿ, ಸ್ಥಾನ ಅಥವಾ ವಸ್ತುವನ್ನು ಸೂಚಿಸುವುದಿಲ್ಲ. ಉದಾಹರಣೆ: ಮನೆ, ಪುಸ್ತಕ, ನಾಯಿ.",
    exampleSentenceKannada: "ನನ್ನಲ್ಲಿ ಒಂದು ಮನೆ ಇದೆ.",
    exampleSentenceRoman: "Nannalli onda mane ide.",
    exampleSentenceEnglish: "I have a house.",
    practiceExamples: [
      {
        kannada: "ಮನೆ (mane)",
        roman: "mane",
        english: "house",
        explanation: "Common noun - refers to any house, not a specific one",
      },
      {
        kannada: "ಪುಸ್ತಕ (pusthaka)",
        roman: "pusthaka",
        english: "book",
        explanation: "Common noun - any book, not a specific title",
      },
      {
        kannada: "ನಾಯಿ (nayi)",
        roman: "nayi",
        english: "dog",
        explanation: "Common noun - any dog, not a specific named dog",
      },
      {
        kannada: "ಬಾಲಕ (balaka)",
        roman: "balaka",
        english: "boy",
        explanation: "Common noun - any boy, not a specific person",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜ ಹೆಸರು ಸಾಮಾನ್ಯ ನಾಮಪದ",
        correct: "ರಾಜ ವ್ಯಕ್ತಿನಾಮ (proper noun)",
        explanation:
          "ರಾಜ (Raj) is a specific person's name, so it's a proper noun, not a common noun.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify which word is a common noun",
        exampleInstructionKannada: "ಸಾಮಾನ್ಯ ನಾಮಪದ ಯಾವುದು?",
        exampleInput: "ರಾಜ ಮತ್ತು ಮನೆ",
        exampleOutput: "ಮನೆ (ಸಾಮಾನ್ಯ ನಾಮಪದ); ರಾಜ (ವ್ಯಕ್ತಿನಾಮ)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a common noun?",
        options: ["ರಾಜ (Raj)", "ಇಂದ್ರ (Indra)", "ಮನೆ (house)", "ಬೆಂಗಳೂರು (Bangalore)"],
        correctAnswer: "ಮನೆ (house)",
        explanation:
          "ಮನೆ refers to any house. ರಾಜ, ಇಂದ್ರ, ಬೆಂಗಳೂರು are proper nouns (specific names).",
      },
    ],
    summary:
      "Common nouns are general words for people, places, or things. They start with lowercase and refer to any member of a category.",
    prompt:
      "Understand common nouns as building blocks of Kannada — they describe what something is, not what it's called.",
    assetPath: "/assets/gemini/kaveri_l6_c01_l01_common_nouns.png",
  },

  {
    id: "L6-C01-L02",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ವ್ಯಕ್ತಿನಾಮ (Proper Nouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 2,
    grammarTopic: "Proper Nouns",
    grammarTopicKannada: "ವ್ಯಕ್ತಿನಾಮ",
    ruleExplanation:
      "Proper nouns are specific names of people, places, or things. They always start with a capital letter. Examples: Raj, Bangalore, Monday.",
    ruleExplanationKannada:
      "ವ್ಯಕ್ತಿನಾಮಗಳು ನಿರ್ದಿಷ್ಟ ವ್ಯಕ್ತಿ, ಸ್ಥಾನ ಅಥವಾ ವಸ್ತುವಿನ ಹೆಸರು. ಉದಾಹರಣೆ: ರಾಜ, ಬೆಂಗಳೂರು, ಸೋಮವಾರ.",
    exampleSentenceKannada: "ರಾಜ ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸ ಮಾಡುತ್ತಾನೆ.",
    exampleSentenceRoman: "Raj Bangalurinallli vasa maduttane.",
    exampleSentenceEnglish: "Raj lives in Bangalore.",
    practiceExamples: [
      {
        kannada: "ರಾಜ (Raj)",
        roman: "Raj",
        english: "person's name",
        explanation: "Proper noun - a specific person",
      },
      {
        kannada: "ಬೆಂಗಳೂರು (Bangalore)",
        roman: "Bangalore",
        english: "city name",
        explanation: "Proper noun - a specific city",
      },
      {
        kannada: "ಸೋಮವಾರ (Monday)",
        roman: "Somavara",
        english: "day of the week",
        explanation: "Proper noun - a specific day",
      },
      {
        kannada: "ಕನ್ನಡ (Kannada)",
        roman: "Kannada",
        english: "language name",
        explanation: "Proper noun - a specific language",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಮಾಡುವ ಮನೆ (doing house)",
        correct: "ರಾಜನ ಮನೆ (Raj's house)",
        explanation:
          "Use proper nouns for specific people. ರಾಜನ is a specific person.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert common noun to proper noun with specific name",
        exampleInstructionKannada: "ಸಾಮಾನ್ಯ ನಾಮಪದವನ್ನು ವ್ಯಕ್ತಿನಾಮಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಸ್ನೇಹಿತ",
        exampleOutput: "ರಾಜ (a friend's specific name)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which word is a proper noun?",
        options: ["ಪುಸ್ತಕ (book)", "ರಾಜ (Raj)", "ಮನೆ (house)", "ಪುಷ್ಪ (flower)"],
        correctAnswer: "ರಾಜ (Raj)",
        explanation:
          "ರಾಜ is a specific person's name. The others are common nouns.",
      },
    ],
    summary:
      "Proper nouns name specific people, places, or things. Always capitalize them to show they are special, unique names.",
    prompt:
      "Think of proper nouns as someone's favorite thing — they deserve capitalization because they're special and specific!",
    assetPath: "/assets/gemini/kaveri_l6_c01_l02_proper_nouns.png",
  },

  {
    id: "L6-C01-L03",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ಪುಲ್ಲಿಂಗ ನಾಮಪದ (Masculine Nouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 3,
    grammarTopic: "Masculine Nouns",
    grammarTopicKannada: "ಪುಲ್ಲಿಂಗ ನಾಮಪದ",
    ruleExplanation:
      "Masculine nouns in Kannada refer to male persons or masculine things. They often end in -ನ, -ಕ, -ಗಳು. Examples: ಮಗ (son), ಆನೆ (elephant - but feminine in Kannada).",
    ruleExplanationKannada:
      "ಪುಲ್ಲಿಂಗ ನಾಮಪದಗಳು ಪುರುಷ ವ್ಯಕ್ತಿ ಅಥವಾ ಪುಲ್ಲಿಂಗ ವಸ್ತುವನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಉದಾಹರಣೆ: ಮಗ, ತಂದೆ, ಸಿಂಹ.",
    exampleSentenceKannada: "ಮಗ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ.",
    exampleSentenceRoman: "Maga pusthaka oduttane.",
    exampleSentenceEnglish: "The boy reads a book.",
    practiceExamples: [
      {
        kannada: "ಮಗ (maga)",
        roman: "maga",
        english: "boy/son",
        explanation: "Masculine noun - refers to a male child",
      },
      {
        kannada: "ತಂದೆ (thande)",
        roman: "thande",
        english: "father",
        explanation: "Masculine noun - male parent",
      },
      {
        kannada: "ಸಿಂಹ (simha)",
        roman: "simha",
        english: "lion",
        explanation: "Masculine noun - male animal",
      },
      {
        kannada: "ಅಧ್ಯಾಪಕ (adhyapaka)",
        roman: "adhyapaka",
        english: "teacher (male)",
        explanation: "Masculine noun - male teacher",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಮಗ ಓದುತ್ತಾಳೆ (boy reads - using feminine verb)",
        correct: "ಮಗ ಓದುತ್ತಾನೆ (boy reads - using masculine verb)",
        explanation:
          "Masculine nouns require masculine verb forms ending in -ನೆ or -ನೆ.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Match masculine noun with masculine verb form",
        exampleInstructionKannada: "ಪುಲ್ಲಿಂಗ ನಾಮಪದದೊಂದಿಗೆ ಸಮನ್ವಯ ಕ್ರಿಯಾಪದ",
        exampleInput: "ಮಗ + ಓದು",
        exampleOutput: "ಮಗ ಓದುತ್ತಾನೆ (masculine verb form)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a masculine noun?",
        options: ["ಅಮ್ಮ (mother)", "ಮಗ (boy)", "ಹೆಣ್ಣು (female)", "ಸ್ತ್ರೀ (woman)"],
        correctAnswer: "ಮಗ (boy)",
        explanation:
          "ಮಗ is a masculine noun referring to a male child. The others are feminine.",
      },
    ],
    summary:
      "Masculine nouns in Kannada refer to male beings or masculine things. They pair with masculine verb forms.",
    prompt:
      "Masculine nouns like ಮಗ and ತಂದೆ change how verbs look — they're teamwork in Kannada!",
    assetPath: "/assets/gemini/kaveri_l6_c01_l03_masculine_nouns.png",
  },

  {
    id: "L6-C01-L04",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ಸ್ತ್ರೀಲಿಂಗ ನಾಮಪದ (Feminine Nouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 4,
    grammarTopic: "Feminine Nouns",
    grammarTopicKannada: "ಸ್ತ್ರೀಲಿಂಗ ನಾಮಪದ",
    ruleExplanation:
      "Feminine nouns in Kannada refer to female persons or feminine things. They often end in -ಳು, -ಿ, -ಆ. Examples: ಮಗಳು (daughter), ಅಮ್ಮ (mother).",
    ruleExplanationKannada:
      "ಸ್ತ್ರೀಲಿಂಗ ನಾಮಪದಗಳು ಮಹಿಳೆ ವ್ಯಕ್ತಿ ಅಥವಾ ಸ್ತ್ರೀಲಿಂಗ ವಸ್ತುವನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಉದಾಹರಣೆ: ಮಗಳು, ಅಮ್ಮ, ಸ್ನೇಹಿತೆ.",
    exampleSentenceKannada: "ಮಗಳು ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ.",
    exampleSentenceRoman: "Magalu nrutya maduttale.",
    exampleSentenceEnglish: "The girl dances.",
    practiceExamples: [
      {
        kannada: "ಮಗಳು (magalu)",
        roman: "magalu",
        english: "girl/daughter",
        explanation: "Feminine noun - refers to a female child",
      },
      {
        kannada: "ಅಮ್ಮ (amma)",
        roman: "amma",
        english: "mother",
        explanation: "Feminine noun - female parent",
      },
      {
        kannada: "ಬೆಕ್ಕು (bekku)",
        roman: "bekku",
        english: "cat",
        explanation: "Feminine noun - female animal",
      },
      {
        kannada: "ಅಧ್ಯಾಪಕೆ (adhyapake)",
        roman: "adhyapake",
        english: "teacher (female)",
        explanation: "Feminine noun - female teacher",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಮಗಳು ಓದುತ್ತಾನೆ (girl reads - using masculine verb)",
        correct: "ಮಗಳು ಓದುತ್ತಾಳೆ (girl reads - using feminine verb)",
        explanation:
          "Feminine nouns require feminine verb forms ending in -ಳೆ or -ರೆ.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Match feminine noun with feminine verb form",
        exampleInstructionKannada: "ಸ್ತ್ರೀಲಿಂಗ ನಾಮಪದದೊಂದಿಗೆ ಸಮನ್ವಯ ಕ್ರಿಯಾಪದ",
        exampleInput: "ಮಗಳು + ನೃತ್ಯ",
        exampleOutput: "ಮಗಳು ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ (feminine verb form)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a feminine noun?",
        options: ["ತಂದೆ (father)", "ಮಗಳು (daughter)", "ಪುತ್ರ (son)", "ಭ್ರಾತ (brother)"],
        correctAnswer: "ಮಗಳು (daughter)",
        explanation:
          "ಮಗಳು is a feminine noun referring to a female child. The others are masculine.",
      },
    ],
    summary:
      "Feminine nouns in Kannada refer to female beings or feminine things. They pair with feminine verb forms.",
    prompt:
      "Feminine nouns like ಮಗಳು and ಅಮ್ಮ change verb endings — they're the queen of agreement in Kannada!",
    assetPath: "/assets/gemini/kaveri_l6_c01_l04_feminine_nouns.png",
  },

  {
    id: "L6-C01-L05",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ನೋಂದಿ ಲಿಂಗ ನಾಮಪದ (Neuter Nouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 5,
    grammarTopic: "Neuter Nouns",
    grammarTopicKannada: "ನೋಂದಿ ಲಿಂಗ ನಾಮಪದ",
    ruleExplanation:
      "Neuter nouns in Kannada refer to things that are neither male nor female. Examples: ಮನೆ (house), ಪುಸ್ತಕ (book), ಕುರ್ಸಿ (chair).",
    ruleExplanationKannada:
      "ನೋಂದಿ ಲಿಂಗ ನಾಮಪದಗಳು ಪುರುಷ ಅಥವಾ ಸ್ತ್ರೀ ಲಿಂಗದ ವಸ್ತುವಲ್ಲ. ಉದಾಹರಣೆ: ಮನೆ, ಪುಸ್ತಕ, ಕುರ್ಸಿ.",
    exampleSentenceKannada: "ಮನೆ ಹೊಸದಾಗಿದೆ.",
    exampleSentenceRoman: "Mane hodadagide.",
    exampleSentenceEnglish: "The house is new.",
    practiceExamples: [
      {
        kannada: "ಮನೆ (mane)",
        roman: "mane",
        english: "house",
        explanation: "Neuter noun - inanimate object",
      },
      {
        kannada: "ಪುಸ್ತಕ (pusthaka)",
        roman: "pusthaka",
        english: "book",
        explanation: "Neuter noun - object",
      },
      {
        kannada: "ಕುರ್ಸಿ (kursi)",
        roman: "kursi",
        english: "chair",
        explanation: "Neuter noun - furniture",
      },
      {
        kannada: "ಟೇಬಲ್ (table)",
        roman: "table",
        english: "table",
        explanation: "Neuter noun - furniture",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಮನೆ ಓದುತ್ತಾನೆ (house reads - wrong gender)",
        correct: "ಪುಸ್ತಕ ಓದುತ್ತೆ (book is read - neuter verb form)",
        explanation:
          "Neuter nouns use neuter verb forms, which are different from masculine and feminine.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify neuter nouns and match with neuter verb forms",
        exampleInstructionKannada: "ನೋಂದಿ ಲಿಂಗ ನಾಮಪದ ಗುರುತಿಸಿ",
        exampleInput: "ಪುಸ್ತಕ, ಅಮ್ಮ, ಕುರ್ಸಿ, ಮಗ",
        exampleOutput: "ಪುಸ್ತಕ, ಕುರ್ಸಿ (neuter); ಅಮ್ಮ, ಮಗ (other genders)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a neuter noun?",
        options: ["ಮಗ (boy)", "ಮಗಳು (girl)", "ಪುಸ್ತಕ (book)", "ಸಿಂಹ (lion)"],
        correctAnswer: "ಪುಸ್ತಕ (book)",
        explanation:
          "ಪುಸ್ತಕ is neuter — it's an object with no gender. The others are animate beings.",
      },
    ],
    summary:
      "Neuter nouns in Kannada refer to things, objects, and concepts without male or female gender.",
    prompt:
      "Neuter nouns like ಪುಸ್ತಕ and ಮನೆ are the middle ground — neither masculine nor feminine!",
    assetPath: "/assets/gemini/kaveri_l6_c01_l05_neuter_nouns.png",
  },

  {
    id: "L6-C01-L06",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ಏಕವಚನ ನಾಮಪದ (Singular Nouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 6,
    grammarTopic: "Singular Nouns",
    grammarTopicKannada: "ಏಕವಚನ ನಾಮಪದ",
    ruleExplanation:
      "Singular nouns refer to one person, place, or thing. Examples: ಒಂದು ಮಗ (one boy), ಒಂದು ಪುಸ್ತಕ (one book).",
    ruleExplanationKannada:
      "ಏಕವಚನ ನಾಮಪದಗಳು ಒಂದೇ ಒಬ್ಬ ವ್ಯಕ್ತಿ, ಸ್ಥಾನ ಅಥವಾ ವಸ್ತುವನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಉದಾಹರಣೆ: ಒಂದು ಮಗ, ಒಂದು ಪುಸ್ತಕ.",
    exampleSentenceKannada: "ಒಂದು ಮಗ ಓದುತ್ತಾನೆ.",
    exampleSentenceRoman: "Onda maga oduttane.",
    exampleSentenceEnglish: "One boy reads.",
    practiceExamples: [
      {
        kannada: "ಒಂದು ಮಗ (onda maga)",
        roman: "onda maga",
        english: "one boy",
        explanation: "Singular noun - one person",
      },
      {
        kannada: "ಒಂದು ಪುಸ್ತಕ (onda pusthaka)",
        roman: "onda pusthaka",
        english: "one book",
        explanation: "Singular noun - one object",
      },
      {
        kannada: "ಒಂದು ಮನೆ (onda mane)",
        roman: "onda mane",
        english: "one house",
        explanation: "Singular noun - one thing",
      },
      {
        kannada: "ಒಂದು ನಾಯಿ (onda nayi)",
        roman: "onda nayi",
        english: "one dog",
        explanation: "Singular noun - one animal",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಒಂದು ಮಗ ಇದ್ದಾರೆ (one boy - plural verb)",
        correct: "ಒಂದು ಮಗ ಇದ್ದಾನೆ (one boy - singular verb)",
        explanation:
          "Singular nouns require singular verb forms, not plural forms with -ಲು.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Use singular nouns in sentences",
        exampleInstructionKannada: "ಏಕವಚನ ನಾಮಪದ ಬಳಸಿ ವಾಕ್ಯ ಹೇಳಿ",
        exampleInput: "ಮಗ",
        exampleOutput: "ಒಂದು ಮಗ ಪಾಠಶಾಲೆಗೆ ಹೋಗುತ್ತಾನೆ.",
      },
    ],
    mcqQuestions: [
      {
        question: "Which expresses a singular noun?",
        options: ["ಮಕ್ಕಳು (children)", "ಒಂದು ಮಗ (one boy)", "ಅನೇಕ ಪುಸ್ತಕಗಳು (many books)", "ಸಿಂಹಗಳು (lions)"],
        correctAnswer: "ಒಂದು ಮಗ (one boy)",
        explanation:
          "ಒಂದು ಮಗ refers to one boy (singular). The others are plural.",
      },
    ],
    summary:
      "Singular nouns in Kannada refer to exactly one person, place, or thing. They pair with singular verbs.",
    prompt:
      "Singular nouns are one-count — ಒಂದು ಮಗ is just one boy, making everything single and simple!",
    assetPath: "/assets/gemini/kaveri_l6_c01_l06_singular_nouns.png",
  },

  {
    id: "L6-C01-L07",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ಬಹುವಚನ ನಾಮಪದ (Plural Nouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 7,
    grammarTopic: "Plural Nouns",
    grammarTopicKannada: "ಬಹುವಚನ ನಾಮಪದ",
    ruleExplanation:
      "Plural nouns refer to more than one person, place, or thing. In Kannada, plurals often add -ಳು, -ಲು, or -ಗಳು. Examples: ಮಕ್ಕಳು (children), ಪುಸ್ತಕಗಳು (books).",
    ruleExplanationKannada:
      "ಬಹುವಚನ ನಾಮಪದಗಳು ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ವ್ಯಕ್ತಿ, ಸ್ಥಾನ ಅಥವಾ ವಸ್ತುವನ್ನು ಸೂಚಿಸುತ್ತವೆ. ಉದಾಹರಣೆ: ಮಕ್ಕಳು, ಪುಸ್ತಕಗಳು.",
    exampleSentenceKannada: "ಮಕ್ಕಳು ಪಾಠಶಾಲೆಗೆ ಹೋಗುತ್ತಾರೆ.",
    exampleSentenceRoman: "Makkalu pathashaleege hoguttare.",
    exampleSentenceEnglish: "The children go to school.",
    practiceExamples: [
      {
        kannada: "ಮಕ್ಕಳು (makkalu)",
        roman: "makkalu",
        english: "children",
        explanation: "Plural noun - more than one child",
      },
      {
        kannada: "ಪುಸ್ತಕಗಳು (pusthakaagalu)",
        roman: "pusthakaagalu",
        english: "books",
        explanation: "Plural noun - more than one book",
      },
      {
        kannada: "ಮನೆಗಳು (maneagalu)",
        roman: "maneagalu",
        english: "houses",
        explanation: "Plural noun - multiple houses",
      },
      {
        kannada: "ನಾಯಿಗಳು (nayigalu)",
        roman: "nayigalu",
        english: "dogs",
        explanation: "Plural noun - multiple dogs",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಮಕ್ಕಳು ಓದುತ್ತಾನೆ (children - singular verb)",
        correct: "ಮಕ್ಕಳು ಓದುತ್ತಾರೆ (children - plural verb)",
        explanation:
          "Plural nouns require plural verb forms with endings like -ಾರೆ or -ಲು.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert singular to plural noun",
        exampleInstructionKannada: "ಏಕವಚನವನ್ನು ಬಹುವಚನಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಪುಸ್ತಕ",
        exampleOutput: "ಪುಸ್ತಕಗಳು",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a plural noun?",
        options: ["ಮಗ (boy)", "ಪುಸ್ತಕ (book)", "ಮಕ್ಕಳು (children)", "ಮನೆ (house)"],
        correctAnswer: "ಮಕ್ಕಳು (children)",
        explanation:
          "ಮಕ್ಕಳು with the -ಳು ending indicates more than one child (plural). The others are singular.",
      },
    ],
    summary:
      "Plural nouns in Kannada refer to more than one person, place, or thing. They use special endings like -ಳು, -ಲು, -ಗಳು.",
    prompt:
      "Plural nouns like ಮಕ್ಕಳು and ಪುಸ್ತಕಗಳು multiply the count — two or more of anything!",
    assetPath: "/assets/gemini/kaveri_l6_c01_l07_plural_nouns.png",
  },

  {
    id: "L6-C01-L08",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ಕಾರಕ: ಕರ್ತೃಪದ (Case 1: Nominative / Subject)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 8,
    grammarTopic: "Nominative Case",
    grammarTopicKannada: "ಕರ್ತೃಪದ",
    ruleExplanation:
      "The nominative case marks the subject of a sentence — the person or thing doing the action. In Kannada, the subject noun doesn't change form. Example: ರಾಜ ಓದುತ್ತಾನೆ (Raj reads).",
    ruleExplanationKannada:
      "ಕರ್ತೃಪದವು ವಾಕ್ಯದ ಕರ್ತೃಯನ್ನು ಸೂಚಿಸುತ್ತದೆ — ಕ್ರಿಯೆ ಮಾಡುವ ವ್ಯಕ್ತಿ. ಕನ್ನಡದಲ್ಲಿ ನಿಯಮಿತವಾಗಿ ರೂಪ ಬದಲಾಯುವುದಿಲ್ಲ.",
    exampleSentenceKannada: "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ.",
    exampleSentenceRoman: "Raj pusthaka oduttane.",
    exampleSentenceEnglish: "Raj reads a book.",
    practiceExamples: [
      {
        kannada: "ರಾಜ ಬರೆಯುತ್ತಾನೆ (Raj writes)",
        roman: "Raj bareyuttane",
        english: "Raj writes",
        explanation: "ರಾಜ (subject) in nominative case — doing the action",
      },
      {
        kannada: "ಮಾವಿನಕಾಯಿ ಮಿಠಾಗಿದೆ (Mango is sweet)",
        roman: "Mavinakayi mithagide",
        english: "Mango is sweet",
        explanation: "ಮಾವಿನಕಾಯಿ (subject) — the thing being described",
      },
      {
        kannada: "ನಾನು ಮಲ್ಲೆನನ್ನು ಜೊತೆಗೆ ಹೋಗುತ್ತೇನೆ (I go with Mali)",
        roman: "Nanu Mallenennu jothege hoguttene",
        english: "I go with Mali",
        explanation: "ನಾನು (I) in nominative — the subject",
      },
      {
        kannada: "ಅವನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸ ಮಾಡುತ್ತಾನೆ (He lives in Bangalore)",
        roman: "Avanu Bangalurinallli vasa maduttane",
        english: "He lives in Bangalore",
        explanation: "ಅವನು (subject) in nominative case",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜನನ್ನು ಓದುತ್ತಾನೆ (using accusative for subject)",
        correct: "ರಾಜ ಓದುತ್ತಾನೆ (subject in nominative)",
        explanation:
          "The subject (who does the action) uses nominative case, not accusative.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify the subject (nominative case) in sentences",
        exampleInstructionKannada: "ವಾಕ್ಯದ ಕರ್ತೃಪದ ಗುರುತಿಸಿ",
        exampleInput: "ಮಾವಿನಕಾಯಿ ಮಿಠಾಗಿದೆ",
        exampleOutput: "ಮಾವಿನಕಾಯಿ (subject in nominative case)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which noun is in nominative case (subject)?",
        options: ["ರಾಜನನ್ನು (Raj - object)", "ರಾಜ (Raj - subject)", "ರಾಜನಿಂದ (Raj - instrumental)", "ರಾಜಕ್ಕೆ (Raj - dative)"],
        correctAnswer: "ರಾಜ (Raj - subject)",
        explanation:
          "The nominative case (ರಾಜ) marks the subject doing the action. The others show different grammatical roles.",
      },
    ],
    summary:
      "The nominative case marks the subject of a sentence. In Kannada, subjects typically don't change their form.",
    prompt:
      "The nominative case is the 'doer' of the action — the person or thing making things happen in a sentence!",
  },

  {
    id: "L6-C01-L09",
    chapterId: "C01",
    chapterTitle: "ನಾಮಪದ",
    title: "ಕಾರಕ: ಕರ್ಮಪದ (Case 2: Accusative / Object)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 9,
    grammarTopic: "Accusative Case",
    grammarTopicKannada: "ಕರ್ಮಪದ",
    ruleExplanation:
      "The accusative case marks the direct object — the person or thing receiving the action. In Kannada, the accusative usually adds -ನ್ನು, -ಳನ್ನು, or -ವನ್ನು. Example: ರಾಜ ಪುಸ್ತಕವನ್ನು ಓದುತ್ತಾನೆ (Raj reads the book).",
    ruleExplanationKannada:
      "ಕರ್ಮಪದವು ವಾಕ್ಯದ ಕರ್ಮನ್ನು ಸೂಚಿಸುತ್ತದೆ — ಕ್ರಿಯೆ ಸ್ವೀಕರಿಸುವ ವ್ಯಕ್ತಿ ಅಥವಾ ವಸ್ತು. ಕನ್ನಡದಲ್ಲಿ ಇದು ಸಾಮಾನ್ಯವಾಗಿ -ನ್ನು ಅಥವಾ -ವನ್ನು ಸೇರಿಸುತ್ತದೆ.",
    exampleSentenceKannada: "ರಾಜ ಪುಸ್ತಕವನ್ನು ಓದುತ್ತಾನೆ.",
    exampleSentenceRoman: "Raj pusthakavannu oduttane.",
    exampleSentenceEnglish: "Raj reads the book.",
    practiceExamples: [
      {
        kannada: "ಪುಸ್ತಕವನ್ನು (pusthaka + -vannu)",
        roman: "pusthakavannu",
        english: "book (object)",
        explanation: "Accusative case marking the direct object",
      },
      {
        kannada: "ಮಾವಿನಕಾಯಿಯನ್ನು (mavainu + -yannu)",
        roman: "mavinavayyannu",
        english: "mango (object)",
        explanation: "Accusative case for object",
      },
      {
        kannada: "ಮಾವನ್ನು (ma + -vannu)",
        roman: "mavannu",
        english: "me (object)",
        explanation: "Accusative pronoun",
      },
      {
        kannada: "ಜೆಲ್ಲಿಗುಲ್ಲೆ ಪಾಠಗಳನ್ನು (paths + -galanu)",
        roman: "patha galanu",
        english: "lessons (object)",
        explanation: "Accusative plural form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ (missing object marking)",
        correct: "ರಾಜ ಪುಸ್ತಕವನ್ನು ಓದುತ್ತಾನೆ (proper object case)",
        explanation:
          "Direct objects need the accusative marker (-ನ್ನು/-ವನ್ನು/-ಳನ್ನು) in Kannada.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add accusative case marker to the object",
        exampleInstructionKannada: "ಕರ್ಮಪದ ಚಿಹ್ನೆ ಸೇರಿಸಿ",
        exampleInput: "ರಾಜ (ಪುಸ್ತಕ) ಓದುತ್ತಾನೆ",
        exampleOutput: "ರಾಜ ಪುಸ್ತಕವನ್ನು ಓದುತ್ತಾನೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which word is in accusative case (object)?",
        options: ["ರಾಜ (Raj - subject)", "ಪುಸ್ತಕವನ್ನು (book - object)", "ಓದುತ್ತಾನೆ (reads - verb)", "ಮನೆಯಲ್ಲಿ (in house - locative)"],
        correctAnswer: "ಪುಸ್ತಕವನ್ನು (book - object)",
        explanation:
          "ಪುಸ್ತಕವನ್ನು with the -ವನ್ನು ending shows the accusative case (direct object).",
      },
    ],
    summary:
      "The accusative case marks the direct object of a verb. In Kannada, it adds -ನ್ನು, -ವನ್ನು, or -ಳನ್ನು.",
    prompt:
      "The accusative case is the 'receiver' of the action — the thing being done to in a sentence!",
  },
];

// ============================================
// CHAPTER 2: ವಿಶೇಷಣ — ADJECTIVES (8 LESSONS)
// ============================================

const chapter2Lessons: GrammarLesson[] = [
  {
    id: "L6-C02-L01",
    chapterId: "C02",
    chapterTitle: "ವಿಶೇಷಣ",
    title: "ವಿಶೇಷಣ ಅನುವಾದ (Adjectives - Basic)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 10,
    grammarTopic: "Adjectives",
    grammarTopicKannada: "ವಿಶೇಷಣ",
    ruleExplanation:
      "Adjectives describe nouns. They tell us about quality, size, color, or condition. In Kannada: ಹೊಸ (new), ದೊಡ್ಡ (big), ಚಿಕ್ಕ (small), ಕೆಂಪು (red).",
    ruleExplanationKannada:
      "ವಿಶೇಷಣಗಳು ನಾಮಪದಗಳ ಗುಣಲಕ್ಷಣ ಸೂಚಿಸುತ್ತವೆ. ಗಾತ್ರ, ಬಣ್ಣ, ಸ್ಥಿತಿ ಬಗ್ಗೆ ಹೇಳುತ್ತವೆ.",
    exampleSentenceKannada: "ಹೊಸ ಪುಸ್ತಕ ಹಸಿವಾಗಿದೆ.",
    exampleSentenceRoman: "Hosa pusthaka hasivagide.",
    exampleSentenceEnglish: "The new book is interesting.",
    practiceExamples: [
      {
        kannada: "ಹೊಸ (hosa)",
        roman: "hosa",
        english: "new",
        explanation: "Adjective describing something recent",
      },
      {
        kannada: "ದೊಡ್ಡ (dodda)",
        roman: "dodda",
        english: "big/large",
        explanation: "Adjective describing size",
      },
      {
        kannada: "ಚಿಕ್ಕ (chikka)",
        roman: "chikka",
        english: "small",
        explanation: "Adjective describing small size",
      },
      {
        kannada: "ಕೆಂಪು (kempu)",
        roman: "kempu",
        english: "red",
        explanation: "Adjective describing color",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಪುಸ್ತಕ ದೊಡ್ಡಪುಸ್ತಕ (repeating noun)",
        correct: "ದೊಡ್ಡ ಪುಸ್ತಕ (adjective + noun)",
        explanation: "Adjectives come before nouns to describe them, not after.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add appropriate adjective to noun",
        exampleInstructionKannada: "ನಾಮಪದಕ್ಕೆ ಸೂಕ್ತ ವಿಶೇಷಣ ಸೇರಿಸಿ",
        exampleInput: "ಪುಸ್ತಕ",
        exampleOutput: "ಹೊಸ ಪುಸ್ತಕ / ದೊಡ್ಡ ಪುಸ್ತಕ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is an adjective?",
        options: ["ಪುಸ್ತಕ (book)", "ಹೊಸ (new)", "ಓದುತ್ತಾನೆ (reads)", "ಮನೆ (house)"],
        correctAnswer: "ಹೊಸ (new)",
        explanation:
          "ಹೊಸ is an adjective describing a quality. The others are nouns or verbs.",
      },
    ],
    summary:
      "Adjectives describe nouns by telling us about quality, size, color, or condition. They come before the noun.",
    prompt:
      "Adjectives are descriptors — they paint a picture of what a noun is like!",
  },

  {
    id: "L6-C02-L02",
    chapterId: "C02",
    chapterTitle: "ವಿಶೇಷಣ",
    title: "ಗುಣವಾಚಕ ವಿಶೇಷಣ (Quality Adjectives)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 11,
    grammarTopic: "Quality Adjectives",
    grammarTopicKannada: "ಗುಣವಾಚಕ ವಿಶೇಷಣ",
    ruleExplanation:
      "Quality adjectives describe the nature or character of a noun. Examples: ಒಳ್ಳೆ (good), ಕೆಟ್ಟ (bad), ಸುಂದರ (beautiful), ಅದ್ಭುತ (wonderful).",
    ruleExplanationKannada:
      "ಗುಣವಾಚಕ ವಿಶೇಷಣಗಳು ನಾಮಪದದ ಸ್ವಭಾವ ಸೂಚಿಸುತ್ತವೆ. ಉದಾಹರಣೆ: ಒಳ್ಳೆ, ಕೆಟ್ಟ, ಸುಂದರ.",
    exampleSentenceKannada: "ಅವಳು ಒಳ್ಳೆ ಮಾತನಾಡುವ ಹೆಣ್ಣು.",
    exampleSentenceRoman: "Avalu ollة matanaduvε hενnu.",
    exampleSentenceEnglish: "She is a well-spoken girl.",
    practiceExamples: [
      {
        kannada: "ಒಳ್ಳೆ (olle)",
        roman: "olle",
        english: "good",
        explanation: "Quality adjective describing positive trait",
      },
      {
        kannada: "ಕೆಟ್ಟ (ketta)",
        roman: "ketta",
        english: "bad",
        explanation: "Quality adjective describing negative trait",
      },
      {
        kannada: "ಸುಂದರ (sundara)",
        roman: "sundara",
        english: "beautiful",
        explanation: "Quality adjective describing appearance",
      },
      {
        kannada: "ಕಠಿಣ (kathina)",
        roman: "kathina",
        english: "hard/difficult",
        explanation: "Quality adjective describing difficulty",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಒಳ್ಳೆ ಕೊಟ್ಟಿಸುವ (using adjective as verb)",
        correct: "ಒಳ್ಳೆ ಮಾತನಾಡುವ (using adjective correctly)",
        explanation:
          "Quality adjectives describe nouns, not used as independent verbs.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Describe noun with quality adjective",
        exampleInstructionKannada: "ಗುಣವಾಚಕ ವಿಶೇಷಣದಿಂದ ನಾಮಪದ ವರ್ಣಿಸಿ",
        exampleInput: "ಮಾಲೆ",
        exampleOutput: "ಸುಂದರ ಮಾಲೆ / ಮಧುರವಾದ ಮಾಲೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a quality adjective?",
        options: ["ದೊಡ್ಡ (big)", "ಕೆಲವು (some)", "ಸುಂದರ (beautiful)", "ಎರಡು (two)"],
        correctAnswer: "ಸುಂದರ (beautiful)",
        explanation:
          "ಸುಂದರ describes the quality/nature of something. The others describe quantity or size.",
      },
    ],
    summary:
      "Quality adjectives describe the character or nature of nouns. They answer: What is it like?",
    prompt:
      "Quality adjectives paint emotional or character pictures — making nouns come alive!",
  },

  {
    id: "L6-C02-L03",
    chapterId: "C02",
    chapterTitle: "ವಿಶೇಷಣ",
    title: "ಪರಿಮಾಣವಾಚಕ ವಿಶೇಷಣ (Quantity Adjectives)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 12,
    grammarTopic: "Quantity Adjectives",
    grammarTopicKannada: "ಪರಿಮಾಣವಾಚಕ ವಿಶೇಷಣ",
    ruleExplanation:
      "Quantity adjectives describe how many or how much. Examples: ಕೆಲವು (some), ಬಹಳ (many), ಯಾವುದೋ (any), ಸಾಕು (enough).",
    ruleExplanationKannada:
      "ಪರಿಮಾಣವಾಚಕ ವಿಶೇಷಣಗಳು ಎಷ್ಟು ಅಥವಾ ಎಷ್ಟೋ ಮಾತ್ರ ಸೂಚಿಸುತ್ತವೆ. ಉದಾಹರಣೆ: ಕೆಲವು, ಬಹಳ, ಸಾಕು.",
    exampleSentenceKannada: "ಕೆಲವು ಮಕ್ಕಳು ಆಟ ಆಡುತ್ತಿದ್ದರು.",
    exampleSentenceRoman: "Kelavu makkalu ata aduttiddare.",
    exampleSentenceEnglish: "Some children were playing.",
    practiceExamples: [
      {
        kannada: "ಕೆಲವು (kelavu)",
        roman: "kelavu",
        english: "some",
        explanation: "Quantity adjective - not all, just some",
      },
      {
        kannada: "ಬಹಳ (bahala)",
        roman: "bahala",
        english: "many/much",
        explanation: "Quantity adjective - large amount",
      },
      {
        kannada: "ಎಲ್ಲ (ella)",
        roman: "ella",
        english: "all",
        explanation: "Quantity adjective - every/all of",
      },
      {
        kannada: "ಸಾಕು (saku)",
        roman: "saku",
        english: "enough",
        explanation: "Quantity adjective - sufficient amount",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಬಹಳ ಮಕ್ಕಳು ಮಾತನಾಡಿದರು (using with plural form)",
        correct: "ಬಹಳ ಮಂದಿ ಮಾತನಾಡಿದರು (using idiomatic form)",
        explanation:
          "Some quantity adjectives pair with specific noun forms in Kannada.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Use quantity adjective in sentence",
        exampleInstructionKannada: "ಪರಿಮಾಣವಾಚಕ ವಿಶೇಷಣ ಬಳಸಿ ವಾಕ್ಯ ರೈತೆ",
        exampleInput: "ಪುಸ್ತಕಗಳು",
        exampleOutput: "ಕೆಲವು ಪುಸ್ತಕಗಳು / ಬಹಳ ಪುಸ್ತಕಗಳು",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a quantity adjective?",
        options: ["ಸುಂದರ (beautiful)", "ಕೆಲವು (some)", "ಕೆಂಪು (red)", "ದೊಡ್ಡ (big)"],
        correctAnswer: "ಕೆಲವು (some)",
        explanation:
          "ಕೆಲವು describes quantity (how many). The others describe quality or size.",
      },
    ],
    summary:
      "Quantity adjectives describe how many or how much. They answer: How much? How many?",
    prompt:
      "Quantity adjectives count and measure — showing the amount of something!",
  },

  {
    id: "L6-C02-L04",
    chapterId: "C02",
    chapterTitle: "ವಿಶೇಷಣ",
    title: "ವರ್ಣನೆಯ ವಿಶೇಷಣ (Demonstrative Adjectives)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 13,
    grammarTopic: "Demonstrative Adjectives",
    grammarTopicKannada: "ವರ್ಣನೆಯ ವಿಶೇಷಣ",
    ruleExplanation:
      "Demonstrative adjectives point to or identify specific nouns. Examples: ಇದು (this), ಆ (that), ಯಾವ (which), ಅಂತಹ (such).",
    ruleExplanationKannada:
      "ವರ್ಣನೆಯ ವಿಶೇಷಣಗಳು ನಿರ್ದಿಷ್ಟ ನಾಮಪದ ಸೂಚಿಸುತ್ತವೆ. ಉದಾಹರಣೆ: ಇದು, ಆ, ಯಾವ, ಅಂತಹ.",
    exampleSentenceKannada: "ಈ ಪುಸ್ತಕ ಹೆಚ್ಚು ಪ್ರಸಿದ್ಧವಾಗಿದೆ.",
    exampleSentenceRoman: "E pusthaka hechu prasiddhavagide.",
    exampleSentenceEnglish: "This book is very famous.",
    practiceExamples: [
      {
        kannada: "ಈ (e)",
        roman: "e",
        english: "this",
        explanation: "Demonstrative - pointing to something near",
      },
      {
        kannada: "ಆ (a)",
        roman: "a",
        english: "that",
        explanation: "Demonstrative - pointing to something far",
      },
      {
        kannada: "ಯಾವ (yava)",
        roman: "yava",
        english: "which",
        explanation: "Demonstrative - asking which one",
      },
      {
        kannada: "ಅಂತಹ (antaha)",
        roman: "antaha",
        english: "such/like that",
        explanation: "Demonstrative - describing similar type",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಈ ಇದನ್ನು ನಿಂತು (repeating demonstrative)",
        correct: "ಈ ಪುಸ್ತಕ / ಇದನ್ನು (use one form)",
        explanation:
          "Don't use demonstrative twice — either ಈ ಪುಸ್ತಕ or ಇದನ್ನು, not both.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Use demonstrative adjective to identify object",
        exampleInstructionKannada: "ವರ್ಣನೆಯ ವಿಶೇಷಣದಿಂದ ವಸ್ತು ಸೂಚಿಸಿ",
        exampleInput: "ಪುಸ್ತಕ (near) / ಪುಸ್ತಕ (far)",
        exampleOutput: "ಈ ಪುಸ್ತಕ / ಆ ಪುಸ್ತಕ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a demonstrative adjective?",
        options: ["ಪುಸ್ತಕ (book)", "ಈ (this)", "ಕಲಿ (learn)", "ಹೊಸ (new)"],
        correctAnswer: "ಈ (this)",
        explanation:
          "ಈ (this) points to a specific noun. The others are noun, verb, or quality adjective.",
      },
    ],
    summary:
      "Demonstrative adjectives point out or identify specific nouns. They answer: Which one? What one?",
    prompt:
      "Demonstrative adjectives are pointers — they say 'this one' or 'that one' to identify exactly which noun!",
  },

  {
    id: "L6-C02-L05",
    chapterId: "C02",
    chapterTitle: "ವಿಶೇಷಣ",
    title: "ಬಿಡಿಪದ ವಿಶೇಷಣ (Interrogative Adjectives)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 14,
    grammarTopic: "Interrogative Adjectives",
    grammarTopicKannada: "ಬಿಡಿಪದ ವಿಶೇಷಣ",
    ruleExplanation:
      "Interrogative adjectives ask questions about nouns. Examples: ಯಾವ (which), ಎಷ್ಟು (how much), ಯಾರ (whose).",
    ruleExplanationKannada:
      "ಬಿಡಿಪದ ವಿಶೇಷಣಗಳು ನಾಮಪದದ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳುತ್ತವೆ. ಉದಾಹರಣೆ: ಯಾವ, ಎಷ್ಟು, ಯಾರ.",
    exampleSentenceKannada: "ಯಾವ ಪುಸ್ತಕ ನಿಮ್ಮದು?",
    exampleSentenceRoman: "Yava pusthaka nimmadu?",
    exampleSentenceEnglish: "Which book is yours?",
    practiceExamples: [
      {
        kannada: "ಯಾವ (yava)",
        roman: "yava",
        english: "which",
        explanation: "Interrogative - asking which one",
      },
      {
        kannada: "ಎಷ್ಟು (eshtu)",
        roman: "eshtu",
        english: "how much/how many",
        explanation: "Interrogative - asking about quantity",
      },
      {
        kannada: "ಯಾರ (yar)",
        roman: "yar",
        english: "whose",
        explanation: "Interrogative - asking about possession",
      },
      {
        kannada: "ಯಾವಾಗ (yavag)",
        roman: "yavag",
        english: "when",
        explanation: "Interrogative - asking about time",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಯಾವ ಯಾವ ಪುಸ್ತಕ (repeating interrogative)",
        correct: "ಯಾವ ಪುಸ್ತಕ (single interrogative)",
        explanation:
          "Use interrogative adjective once per question, not repeatedly.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form question using interrogative adjective",
        exampleInstructionKannada: "ಬಿಡಿಪದ ವಿಶೇಷಣ ಬಳಸಿ ಪ್ರಶ್ನೆ ಮಾಡಿ",
        exampleInput: "ಪುಸ್ತಕ",
        exampleOutput: "ಯಾವ ಪುಸ್ತಕ? / ಎಷ್ಟು ಪುಸ್ತಕ?",
      },
    ],
    mcqQuestions: [
      {
        question: "Which word is an interrogative adjective?",
        options: ["ಪುಸ್ತಕ (book)", "ಯಾವ (which)", "ಓದುತ್ತಾನೆ (reads)", "ಹೊಸ (new)"],
        correctAnswer: "ಯಾವ (which)",
        explanation:
          "ಯಾವ (which) asks a question about the noun. The others are noun, verb, or adjective.",
      },
    ],
    summary:
      "Interrogative adjectives ask questions about nouns. They answer: Which? How much? Whose?",
    prompt:
      "Interrogative adjectives are question-makers — they turn statements into inquiries about nouns!",
  },

  {
    id: "L6-C02-L06",
    chapterId: "C02",
    chapterTitle: "ವಿಶೇಷಣ",
    title: "ಕಾರಕ ಲಿಂಗ ಸಮನ್ವಯ (Gender & Number Agreement)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 15,
    grammarTopic: "Gender & Number Agreement",
    grammarTopicKannada: "ಲಿಂಗ ಮತ್ತು ವಚನ ಸಮನ್ವಯ",
    ruleExplanation:
      "Adjectives must agree with nouns in gender and number. A masculine singular noun takes masculine singular adjective. Example: ದೊಡ್ಡ ಮಗ (big boy), ದೊಡ್ಡ ಮಗಳು (big girl).",
    ruleExplanationKannada:
      "ವಿಶೇಷಣಗಳು ನಾಮಪದದ ಲಿಂಗ ಮತ್ತು ವಚನದ ಜೊತೆ ಸೂಕ್ತವಾಗಿರಬೇಕು. ಪುಲ್ಲಿಂಗ ಏಕವಚನ ನಾಮಪದಕ್ಕೆ ಪುಲ್ಲಿಂಗ ಏಕವಚನ ವಿಶೇಷಣ.",
    exampleSentenceKannada: "ದೊಡ್ಡ ಮಗಳು ಒಳ್ಳೆ ಅಧ್ಯಾಪಕೆ.",
    exampleSentenceRoman: "Dodda magalu olle adhyapake.",
    exampleSentenceEnglish: "The big girl is a good teacher.",
    practiceExamples: [
      {
        kannada: "ದೊಡ್ಡ ಮಗ (dodda maga)",
        roman: "dodda maga",
        english: "big boy",
        explanation: "Masculine singular - both adjective and noun match",
      },
      {
        kannada: "ದೊಡ್ಡ ಮಗಳು (dodda magalu)",
        roman: "dodda magalu",
        english: "big girl",
        explanation: "Feminine singular - both match",
      },
      {
        kannada: "ದೊಡ್ಡ ಮಕ್ಕಳು (dodda makkalu)",
        roman: "dodda makkalu",
        english: "big children",
        explanation: "Plural - adjective and noun both plural",
      },
      {
        kannada: "ಹೊಸ ಪುಸ್ತಕಗಳು (hosa pusthakaagalu)",
        roman: "hosa pusthakaagalu",
        english: "new books",
        explanation: "Neuter plural - matching",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ದೊಡ್ಡ ಮಗಳು (using masculine with feminine noun)",
        correct: "ದೊಡ್ಳ ಮಗಳು (matching feminine form)",
        explanation:
          "Adjectives must match the noun's gender. ಮಗಳು is feminine, so adjective should too.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Match adjective to correct noun gender/number",
        exampleInstructionKannada: "ವಿಶೇಷಣ ಮತ್ತು ನಾಮಪದ ಸಮನ್ವಯ ಮಾಡಿ",
        exampleInput: "ಹೊಸ + ಮಗಳು / ಮಕ್ಕಳು",
        exampleOutput: "ಹೊಸ ಮಗಳು / ಹೊಸ ಮಕ್ಕಳು",
      },
    ],
    mcqQuestions: [
      {
        question: "Which adjective-noun pair agrees correctly?",
        options: ["ದೊಡ್ಡ ಮಗಳು (incorrect gender)", "ದೊಡ್ಳ ಮಗಳು (correct)", "ಚಿಕ್ಕ ಮಕ್ಕಳು (incorrect number)", "ಸುಂದರ ಮಗ (incorrect gender)"],
        correctAnswer: "ದೊಡ್ಳ ಮಗಳು (correct)",
        explanation:
          "ದೊಡ್ಳ agrees with feminine ಮಗಳು. The others have gender/number mismatches.",
      },
    ],
    summary:
      "Adjectives must match their nouns in gender and number. They 'agree' to stay grammatically correct.",
    prompt:
      "Agreement is like a dance — adjective and noun must move in the same gender and number step!",
  },

  {
    id: "L6-C02-L07",
    chapterId: "C02",
    chapterTitle: "ವಿಶೇಷಣ",
    title: "ತುಲನಾ ವಿಶೇಷಣ (Comparative Adjectives)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 16,
    grammarTopic: "Comparative Adjectives",
    grammarTopicKannada: "ತುಲನಾ ವಿಶೇಷಣ",
    ruleExplanation:
      "Comparative adjectives compare two things. In Kannada, they often use -ರ, -ರ ಹೆಚ್ಚು. Examples: ದೊಡ್ಡದಾಗಿ (bigger), ಚಿಕ್ಕದಾಗಿ (smaller).",
    ruleExplanationKannada:
      "ತುಲನಾ ವಿಶೇಷಣಗಳು ಎರಡು ವಸ್ತುವನ್ನು ಹೋಲಿಸುತ್ತವೆ. ಕನ್ನಡದಲ್ಲಿ -ರ, -ದಾಗಿ ಪ್ರತ್ಯಯ ಬಳಸುತ್ತವೆ.",
    exampleSentenceKannada: "ಅವಳ ಮನೆ ನನ್ನದಕ್ಕಿಂತ ದೊಡ್ಡದಾಗಿದೆ.",
    exampleSentenceRoman: "Avalu mane nannendakinta dodddagide.",
    exampleSentenceEnglish: "Her house is bigger than mine.",
    practiceExamples: [
      {
        kannada: "ದೊಡ್ಡದಾಗಿ (doddadagi)",
        roman: "doddadagi",
        english: "bigger",
        explanation: "Comparative - larger than something else",
      },
      {
        kannada: "ಚಿಕ್ಕದಾಗಿ (chikkadagi)",
        roman: "chikkadagi",
        english: "smaller",
        explanation: "Comparative - less large than something",
      },
      {
        kannada: "ಉತ್ತಮದಾಗಿ (uttamadagi)",
        roman: "uttamadagi",
        english: "better",
        explanation: "Comparative - more good",
      },
      {
        kannada: "ಸುಂದರವಾಗಿ (sundaravagi)",
        roman: "sundaravagi",
        english: "more beautifully",
        explanation: "Comparative - more beautiful",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜ ಪ್ರಕಾಶಕ್ಕಿಂತ ದೊಡ್ಡ (not expressing comparison clearly)",
        correct: "ರಾಜ ಪ್ರಕಾಶಕ್ಕಿಂತ ದೊಡ್ಡದಾಗಿದ್ದಾನೆ (clear comparison)",
        explanation:
          "Use comparative form with -ದಾಗಿ or -ರ to make the comparison clear.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form comparative adjective from positive",
        exampleInstructionKannada: "ಸಾಮಾನ್ಯ ವಿಶೇಷಣವನ್ನು ತುಲನಾ ರೂಪಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ದೊಡ್ಡ",
        exampleOutput: "ದೊಡ್ಡದಾಗಿ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a comparative adjective?",
        options: ["ದೊಡ್ಡ (big)", "ದೊಡ್ಡದಾಗಿ (bigger)", "ಅತಿ ದೊಡ್ಡ (very big)", "ದೊಡ್ಡ ಮಗ (big boy)"],
        correctAnswer: "ದೊಡ್ಡದಾಗಿ (bigger)",
        explanation:
          "ದೊಡ್ಡದಾಗಿ shows comparison. The others are positive or superlative forms.",
      },
    ],
    summary:
      "Comparative adjectives compare two things. They show which is more or which is less.",
    prompt:
      "Comparative adjectives are the 'versus' words — they compare two nouns and declare a winner!",
  },

  {
    id: "L6-C02-L08",
    chapterId: "C02",
    chapterTitle: "ವಿಶೇಷಣ",
    title: "ಸುಪರ್ಲೆಟಿವ್ ವಿಶೇಷಣ (Superlative Adjectives)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 17,
    grammarTopic: "Superlative Adjectives",
    grammarTopicKannada: "ಅತಿಪ್ರಸಿದ್ಧ ವಿಶೇಷಣ",
    ruleExplanation:
      "Superlative adjectives describe the highest degree. In Kannada, they use -ತ, -ಲ್ಯ, -ಅತಿ. Examples: ಚಿಕ್ಕದ (smallest), ಮತ್ತೆ ದೊಡ್ಡ (most big).",
    ruleExplanationKannada:
      "ಅತಿಪ್ರಸಿದ್ಧ ವಿಶೇಷಣಗಳು ಅತ್ಯಧಿಕ ಮಟ್ಟ ಸೂಚಿಸುತ್ತವೆ. ಕನ್ನಡದಲ್ಲಿ -ತ, -ಲ್ಯ ಪ್ರತ್ಯಯ ಬಳಸುತ್ತವೆ.",
    exampleSentenceKannada: "ಇದು ಚಿಕ್ಕದ ಪುಸ್ತಕ.",
    exampleSentenceRoman: "Idu chikkada pusthaka.",
    exampleSentenceEnglish: "This is the smallest book.",
    practiceExamples: [
      {
        kannada: "ಚಿಕ್ಕದ (chikkada)",
        roman: "chikkada",
        english: "smallest",
        explanation: "Superlative - least big of all",
      },
      {
        kannada: "ದೊಡ್ಡದ (doddada)",
        roman: "doddada",
        english: "biggest",
        explanation: "Superlative - most big of all",
      },
      {
        kannada: "ಸುಂದರತ (sundarata)",
        roman: "sundarata",
        english: "most beautiful",
        explanation: "Superlative - highest degree of beauty",
      },
      {
        kannada: "ಉತ್ತಮತ (uttamata)",
        roman: "uttamata",
        english: "best",
        explanation: "Superlative - highest quality",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜ ಅತಿ ದೊಡ್ಡ (using ಅತಿ instead of superlative form)",
        correct: "ರಾಜ ದೊಡ್ಡದ (using proper superlative)",
        explanation:
          "Use proper superlative forms (-ದ, -ತ) instead of just adding ಅತಿ.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form superlative from positive adjective",
        exampleInstructionKannada: "ಸಾಮಾನ್ಯ ವಿಶೇಷಣವನ್ನು ಅತಿಮಾತ್ರ ರೂಪಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ದೊಡ್ಡ",
        exampleOutput: "ದೊಡ್ಡದ (superlative)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a superlative adjective?",
        options: ["ದೊಡ್ಡ (big)", "ದೊಡ್ಡದಾಗಿ (bigger)", "ದೊಡ್ಡದ (biggest)", "ಬಹಳ ದೊಡ್ಡ (very big)"],
        correctAnswer: "ದೊಡ್ಡದ (biggest)",
        explanation:
          "ದೊಡ್ಡದ shows the highest degree. The others are positive or comparative.",
      },
    ],
    summary:
      "Superlative adjectives show the highest degree — the most, the least, the best of all.",
    prompt:
      "Superlative adjectives are the champions — they crown one noun as the supreme winner!",
  },
];

// Continue with remaining chapters...
// (Chapters 3, 4, 5 will follow the same pattern)

const chapter3Lessons: GrammarLesson[] = [
  {
    id: "L6-C03-L01",
    chapterId: "C03",
    chapterTitle: "ಸರ್ವನಾಮ",
    title: "ವ್ಯಕ್ತಿ ಸರ್ವನಾಮ (Personal Pronouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 18,
    grammarTopic: "Personal Pronouns",
    grammarTopicKannada: "ವ್ಯಕ್ತಿ ಸರ್ವನಾಮ",
    ruleExplanation:
      "Personal pronouns replace nouns to refer to persons. First person: ನಾನು (I), ನಾವು (we). Second person: ನೀನು (you), ನೀವು (you - formal). Third person: ಅವನು (he), ಅವಳು (she), ಅದು (it).",
    ruleExplanationKannada:
      "ವ್ಯಕ್ತಿ ಸರ್ವನಾಮಗಳು ನಾಮಪದಗಳ ಸ್ಥಾನ ನೆಲೆಗೊಳ್ಳುತ್ತವೆ. ಮೊದಲ ವ್ಯಕ್ತಿ: ನಾನು, ನಾವು. ಎರಡನೇ ವ್ಯಕ್ತಿ: ನೀನು, ನೀವು. ಮೂರನೇ ವ್ಯಕ್ತಿ: ಅವನು, ಅವಳು, ಅದು.",
    exampleSentenceKannada: "ನಾನು ಓದುತ್ತೇನೆ.",
    exampleSentenceRoman: "Nanu oduttene.",
    exampleSentenceEnglish: "I read.",
    practiceExamples: [
      {
        kannada: "ನಾನು (nanu)",
        roman: "nanu",
        english: "I",
        explanation: "First person singular pronoun",
      },
      {
        kannada: "ನಾವು (navu)",
        roman: "navu",
        english: "we",
        explanation: "First person plural pronoun",
      },
      {
        kannada: "ನೀನು (ninu)",
        roman: "ninu",
        english: "you (informal)",
        explanation: "Second person singular informal",
      },
      {
        kannada: "ನೀವು (nivu)",
        roman: "nivu",
        english: "you (formal)",
        explanation: "Second person plural/formal",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನಾನು ನಾನು ಬರೆಯುತ್ತೇನೆ (repeating pronoun)",
        correct: "ನಾನು ಬರೆಯುತ್ತೇನೆ (single pronoun)",
        explanation:
          "Use pronoun once per clause. Don't repeat unnecessarily.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Replace noun with appropriate personal pronoun",
        exampleInstructionKannada: "ನಾಮಪದವನ್ನು ಸರ್ವನಾಮದಿಂದ ಬದಲಾಯಿಸಿ",
        exampleInput: "ರಾಜ ಓದುತ್ತಾನೆ",
        exampleOutput: "ಅವನು ಓದುತ್ತಾನೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a personal pronoun?",
        options: ["ರಾಜ (Raj)", "ನಾನು (I)", "ಪುಸ್ತಕ (book)", "ಓದುತ್ತಾನೆ (reads)"],
        correctAnswer: "ನಾನು (I)",
        explanation:
          "ನಾನು is a personal pronoun referring to the speaker. The others are noun or verb.",
      },
    ],
    summary:
      "Personal pronouns replace nouns to refer to people. They change based on person (1st, 2nd, 3rd) and number.",
    prompt:
      "Personal pronouns are linguistic stand-ins — they let us talk about ourselves, others, and things!",
  },

  {
    id: "L6-C03-L02",
    chapterId: "C03",
    chapterTitle: "ಸರ್ವನಾಮ",
    title: "ಸೋಮ್ಯವಾಚಕ ಸರ್ವನಾಮ (Possessive Pronouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 19,
    grammarTopic: "Possessive Pronouns",
    grammarTopicKannada: "ಸೋಮ್ಯವಾಚಕ ಸರ್ವನಾಮ",
    ruleExplanation:
      "Possessive pronouns show ownership or belonging. Examples: ನನ್ನ (my), ನಿಮ್ಮ (your), ಅವನ (his), ಅವಳ (her), ಅದರ (its).",
    ruleExplanationKannada:
      "ಸೋಮ್ಯವಾಚಕ ಸರ್ವನಾಮಗಳು ಸ್ವಾಮಿತ್ವ ಅಥವಾ ಸಂಬಂಧ ಸೂಚಿಸುತ್ತವೆ. ಉದಾಹರಣೆ: ನನ್ನ, ನಿಮ್ಮ, ಅವನ, ಅವಳ.",
    exampleSentenceKannada: "ಇದು ನನ್ನ ಪುಸ್ತಕ.",
    exampleSentenceRoman: "Idu nanna pusthaka.",
    exampleSentenceEnglish: "This is my book.",
    practiceExamples: [
      {
        kannada: "ನನ್ನ (nanna)",
        roman: "nanna",
        english: "my",
        explanation: "Possessive — something I own",
      },
      {
        kannada: "ನಿಮ್ಮ (nimma)",
        roman: "nimma",
        english: "your",
        explanation: "Possessive — something you own",
      },
      {
        kannada: "ಅವನ (avana)",
        roman: "avana",
        english: "his",
        explanation: "Possessive — something he owns",
      },
      {
        kannada: "ಅವಳ (avala)",
        roman: "avala",
        english: "her",
        explanation: "Possessive — something she owns",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಇದು ನಾನು ಪುಸ್ತಕ (using personal pronoun instead of possessive)",
        correct: "ಇದು ನನ್ನ ಪುಸ್ತಕ (using possessive pronoun)",
        explanation:
          "For ownership, use possessive pronouns (ನನ್ನ), not personal pronouns (ನಾನು).",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert personal pronoun to possessive form",
        exampleInstructionKannada: "ವ್ಯಕ್ತಿ ಸರ್ವನಾಮವನ್ನು ಸೋಮ್ಯವಾಚಕಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ನಾನು",
        exampleOutput: "ನನ್ನ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a possessive pronoun?",
        options: ["ನಾನು (I)", "ನನ್ನ (my)", "ಓದುತ್ತೇನೆ (I read)", "ಪುಸ್ತಕ (book)"],
        correctAnswer: "ನನ್ನ (my)",
        explanation:
          "ನನ್ನ shows possession (my). ನಾನು is personal pronoun (I).",
      },
    ],
    summary:
      "Possessive pronouns show ownership. They answer: Whose? Mine, yours, his, hers, etc.",
    prompt:
      "Possessive pronouns claim ownership — they say 'this is MINE' or 'that is YOURS'!",
  },

  {
    id: "L6-C03-L03",
    chapterId: "C03",
    chapterTitle: "ಸರ್ವನಾಮ",
    title: "ತೃತೀಯ ವ್ಯಕ್ತಿ ಸರ್ವನಾಮ (Third Person Pronouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 20,
    grammarTopic: "Third Person Pronouns",
    grammarTopicKannada: "ತೃತೀಯ ವ್ಯಕ್ತಿ ಸರ್ವನಾಮ",
    ruleExplanation:
      "Third person pronouns refer to people or things being discussed (not speaker or listener). Examples: ಅವನು (he), ಅವಳು (she), ಅವರು (they), ಅದು (it).",
    ruleExplanationKannada:
      "ತೃತೀಯ ವ್ಯಕ್ತಿ ಸರ್ವನಾಮಗಳು ಮಾತನಾಡುವವರು ಅಥವಾ ಕೇಳುವವರಲ್ಲ, ಇತರ ವ್ಯಕ್ತಿಗಳು ಅಥವಾ ವಸ್ತುಗಳನ್ನು ಸೂಚಿಸುತ್ತವೆ.",
    exampleSentenceKannada: "ಅವನು ಸ್ನೇಹಿತ, ಅವಳು ಸೋದರಿ.",
    exampleSentenceRoman: "Avanu snehita, avalu sodeari.",
    exampleSentenceEnglish: "He is a friend, she is a sister.",
    practiceExamples: [
      {
        kannada: "ಅವನು (avanu)",
        roman: "avanu",
        english: "he",
        explanation: "Third person singular masculine",
      },
      {
        kannada: "ಅವಳು (avalu)",
        roman: "avalu",
        english: "she",
        explanation: "Third person singular feminine",
      },
      {
        kannada: "ಅದು (adu)",
        roman: "adu",
        english: "it",
        explanation: "Third person singular neuter",
      },
      {
        kannada: "ಅವರು (avaru)",
        roman: "avaru",
        english: "they",
        explanation: "Third person plural (all genders)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಅವನು ಅವನು ಓದುತ್ತಾನೆ (repeating third person)",
        correct: "ಅವನು ಓದುತ್ತಾನೆ (single pronoun)",
        explanation:
          "Don't repeat the pronoun in the same clause.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Use appropriate third person pronoun",
        exampleInstructionKannada: "ಸೂಕ್ತ ತೃತೀಯ ವ್ಯಕ್ತಿ ಸರ್ವನಾಮ ಬಳಸಿ",
        exampleInput: "ರಾಜ / ಮಾವಿನಕಾಯಿ / ಮಾಲೆ",
        exampleOutput: "ಅವನು / ಅವಳು / ಅದು",
      },
    ],
    mcqQuestions: [
      {
        question: "Which third person pronoun is feminine singular?",
        options: ["ಅವನು (masculine)", "ಅವಳು (feminine)", "ಅದು (neuter)", "ಅವರು (plural)"],
        correctAnswer: "ಅವಳು (feminine)",
        explanation:
          "ಅವಳು refers to 'she' (feminine singular). The others are different genders/numbers.",
      },
    ],
    summary:
      "Third person pronouns refer to others or things, not the speaker or listener.",
    prompt:
      "Third person pronouns are for talking ABOUT others — the ones who aren't in the conversation!",
  },

  {
    id: "L6-C03-L04",
    chapterId: "C03",
    chapterTitle: "ಸರ್ವನಾಮ",
    title: "ಸಂಬಂಧವಾಚಕ ಸರ್ವನಾಮ (Relative Pronouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 21,
    grammarTopic: "Relative Pronouns",
    grammarTopicKannada: "ಸಂಬಂಧವಾಚಕ ಸರ್ವನಾಮ",
    ruleExplanation:
      "Relative pronouns connect clauses by referring to a noun. Examples: ಯಾವುದು (which), ಯಾರು (who), ಎಲ್ಲಿ (where), ಯಾವಾಗ (when).",
    ruleExplanationKannada:
      "ಸಂಬಂಧವಾಚಕ ಸರ್ವನಾಮಗಳು ನಾಮಪದವನ್ನು ಗುರುತಿಸಿ ಕೊಡುತ್ತವೆ ಮತ್ತು ಕ್ಲಾಜ್ ಸಂಪರ್ಕ ಮಾಡುತ್ತವೆ.",
    exampleSentenceKannada: "ಹುಡುಗ ಯಾವುದು ಕಪ್ಪೆ ಪುಸ್ತಕ ಹೊಂದಿದ್ದು ಎಲ್ಲಿಂದ?",
    exampleSentenceRoman: "Huduga yavudu kappe pusthaka hondu itti ellinda?",
    exampleSentenceEnglish: "The boy who has the black book is from where?",
    practiceExamples: [
      {
        kannada: "ಯಾವುದು (yavudu)",
        roman: "yavudu",
        english: "which/who",
        explanation: "Relative pronoun introducing clause",
      },
      {
        kannada: "ಯಾರು (yaru)",
        roman: "yaru",
        english: "who",
        explanation: "Relative pronoun for persons",
      },
      {
        kannada: "ಎಲ್ಲಿ (elli)",
        roman: "elli",
        english: "where",
        explanation: "Relative pronoun for place",
      },
      {
        kannada: "ಯಾವಾಗ (yavag)",
        roman: "yavag",
        english: "when",
        explanation: "Relative pronoun for time",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಹುಡುಗ ಯಾವುದು ಯಾವುದು (repeating relative pronoun)",
        correct: "ಹುಡುಗ ಯಾವುದು (single relative pronoun)",
        explanation:
          "Use relative pronoun once per clause to connect ideas.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Connect two sentences with relative pronoun",
        exampleInstructionKannada: "ಎರಡು ವಾಕ್ಯ ಸಂಬಂಧವಾಚಕ ಸರ್ವನಾಮದಿಂದ ಸಂಪರ್ಕ ಮಾಡಿ",
        exampleInput: "ರಾಜ ಬಹಳ ವಿದ್ವಾನ. ಅವನು ಪರೀಕ್ಷೆಯಲ್ಲಿ ಪ್ರಥಮ.",
        exampleOutput: "ರಾಜ ಯಾವುದು ಬಹಳ ವಿದ್ವಾನ ಅವನು ಪರೀಕ್ಷೆಯಲ್ಲಿ ಪ್ರಥಮ.",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a relative pronoun?",
        options: ["ನಾನು (I)", "ಅವನು (he)", "ಯಾವುದು (which)", "ರಾಜ (Raj)"],
        correctAnswer: "ಯಾವುದು (which)",
        explanation:
          "ಯಾವುದು is a relative pronoun connecting clauses. The others are personal/proper nouns.",
      },
    ],
    summary:
      "Relative pronouns connect dependent clauses to nouns. They ask 'which', 'who', 'where', 'when'.",
    prompt:
      "Relative pronouns are clause connectors — they build bridges between related ideas!",
  },

  {
    id: "L6-C03-L05",
    chapterId: "C03",
    chapterTitle: "ಸರ್ವನಾಮ",
    title: "ಬಿಡಿ ಸರ್ವನಾಮ (Interrogative Pronouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 22,
    grammarTopic: "Interrogative Pronouns",
    grammarTopicKannada: "ಬಿಡಿ ಸರ್ವನಾಮ",
    ruleExplanation:
      "Interrogative pronouns ask questions. Examples: ಯಾರು (who), ಯವುದು (what), ಎಷ್ಟು (how much), ಯಾರ (whose).",
    ruleExplanationKannada:
      "ಬಿಡಿ ಸರ್ವನಾಮಗಳು ಪ್ರಶ್ನೆ ಕೇಳುತ್ತವೆ. ಉದಾಹರಣೆ: ಯಾರು, ಯವುದು, ಎಷ್ಟು, ಯಾರ.",
    exampleSentenceKannada: "ಯಾರು ಇಲ್ಲಿ ಬಂದಿದ್ದಾರೆ?",
    exampleSentenceRoman: "Yaru illige bandiddare?",
    exampleSentenceEnglish: "Who came here?",
    practiceExamples: [
      {
        kannada: "ಯಾರು (yaru)",
        roman: "yaru",
        english: "who",
        explanation: "Interrogative for person",
      },
      {
        kannada: "ಯವುದು (yavudu)",
        roman: "yavudu",
        english: "what",
        explanation: "Interrogative for thing",
      },
      {
        kannada: "ಎಷ್ಟು (eshtu)",
        roman: "eshtu",
        english: "how much",
        explanation: "Interrogative for quantity",
      },
      {
        kannada: "ಯಾರ (yar)",
        roman: "yar",
        english: "whose",
        explanation: "Interrogative for possession",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಯಾರು ಯಾರು ಬಂದಿದ್ದಾರೆ (repeating interrogative)",
        correct: "ಯಾರು ಬಂದಿದ್ದಾರೆ (single interrogative)",
        explanation:
          "Use interrogative pronoun once per question.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form question with interrogative pronoun",
        exampleInstructionKannada: "ಬಿಡಿ ಸರ್ವನಾಮದಿಂದ ಪ್ರಶ್ನೆ ರೈತೆ",
        exampleInput: "ಹುಡುಗ / ಪುಸ್ತಕ",
        exampleOutput: "ಯಾರು? / ಯವುದು?",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is an interrogative pronoun?",
        options: ["ರಾಜ (Raj)", "ಅವನು (he)", "ಯಾರು (who)", "ನಾನು (I)"],
        correctAnswer: "ಯಾರು (who)",
        explanation:
          "ಯಾರು asks a question about a person. The others are nouns/pronouns without question function.",
      },
    ],
    summary:
      "Interrogative pronouns ask questions. They ask 'who', 'what', 'how much', 'whose'.",
    prompt:
      "Interrogative pronouns are question-makers — they turn statements into inquiries!",
  },

  {
    id: "L6-C03-L06",
    chapterId: "C03",
    chapterTitle: "ಸರ್ವನಾಮ",
    title: "ನಿರ್ದಿಷ್ಟವಾಚಕ ಸರ್ವನಾಮ (Demonstrative Pronouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 23,
    grammarTopic: "Demonstrative Pronouns",
    grammarTopicKannada: "ನಿರ್ದಿಷ್ಟವಾಚಕ ಸರ್ವನಾಮ",
    ruleExplanation:
      "Demonstrative pronouns point to specific people or things. Examples: ಇದು (this), ಆ (that), ಅವು (these/those), ಇವು (these).",
    ruleExplanationKannada:
      "ನಿರ್ದಿಷ್ಟವಾಚಕ ಸರ್ವನಾಮಗಳು ನಿರ್ದಿಷ್ಟ ವ್ಯಕ್ತಿ ಅಥವಾ ವಸ್ತುವನ್ನು ಸೂಚಿಸುತ್ತವೆ.",
    exampleSentenceKannada: "ಇದು ಮಿಠಾಗಿದೆ, ಆ ಕಠಿಣವಾಗಿದೆ.",
    exampleSentenceRoman: "Idu mithagide, a kathinvagide.",
    exampleSentenceEnglish: "This is sweet, that is hard.",
    practiceExamples: [
      {
        kannada: "ಇದು (idu)",
        roman: "idu",
        english: "this",
        explanation: "Demonstrative — something near",
      },
      {
        kannada: "ಆ (a)",
        roman: "a",
        english: "that",
        explanation: "Demonstrative — something far",
      },
      {
        kannada: "ಇವು (ivu)",
        roman: "ivu",
        english: "these",
        explanation: "Demonstrative plural — near",
      },
      {
        kannada: "ಅವು (avu)",
        roman: "avu",
        english: "those",
        explanation: "Demonstrative plural — far",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಇದು ಪುಸ್ತಕ ಇದು ಹೊಸದಾಗಿದೆ (repeating demonstrative)",
        correct: "ಇದು ಪುಸ್ತಕ ಹೊಸದಾಗಿದೆ (single demonstrative)",
        explanation:
          "Use demonstrative once per idea, not repeatedly.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Use appropriate demonstrative pronoun",
        exampleInstructionKannada: "ಸೂಕ್ತ ನಿರ್ದಿಷ್ಟವಾಚಕ ಸರ್ವನಾಮ ಬಳಸಿ",
        exampleInput: "__ ಚೆನ್ನಾಗಿದೆ (near) / __ ಅದ್ಭುತವಾಗಿದೆ (far)",
        exampleOutput: "ಇದು ಚೆನ್ನಾಗಿದೆ / ಆ ಅದ್ಭುತವಾಗಿದೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a demonstrative pronoun?",
        options: ["ಯಾರು (who)", "ಇದು (this)", "ನಾನು (I)", "ಓದುತ್ತೇನೆ (I read)"],
        correctAnswer: "ಇದು (this)",
        explanation:
          "ಇದು points to something specific nearby. The others are interrogative, personal, or verb.",
      },
    ],
    summary:
      "Demonstrative pronouns point to specific people or things — 'this', 'that', 'these', 'those'.",
    prompt:
      "Demonstrative pronouns are pointers — they say 'this one right here' or 'that one over there'!",
  },

  {
    id: "L6-C03-L07",
    chapterId: "C03",
    chapterTitle: "ಸರ್ವನಾಮ",
    title: "ಆತ್ಮವಾಚಕ ಸರ್ವನಾಮ (Reflexive Pronouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 24,
    grammarTopic: "Reflexive Pronouns",
    grammarTopicKannada: "ಆತ್ಮವಾಚಕ ಸರ್ವನಾಮ",
    ruleExplanation:
      "Reflexive pronouns show that action is done to oneself. Examples: ನಾವೇ (myself), ನೀವೇ (yourself), ಸ್ವತಃ (self).",
    ruleExplanationKannada:
      "ಆತ್ಮವಾಚಕ ಸರ್ವನಾಮಗಳು ಸ್ವಂತ ಮೇಲೆ ಕ್ರಿಯೆ ಮಾಡುವುದನ್ನು ತೋರಿಸುತ್ತವೆ.",
    exampleSentenceKannada: "ನಾವೇ ನಮ್ಮ ಕಾರ್ಯ ಮಾಡಿಕೊಳ್ಳಬೇಕು.",
    exampleSentenceRoman: "Naveე namma kary madikolbeku.",
    exampleSentenceEnglish: "We ourselves must do our work.",
    practiceExamples: [
      {
        kannada: "ನಾವೇ (naveε)",
        roman: "naveε",
        english: "myself",
        explanation: "Reflexive — action on oneself",
      },
      {
        kannada: "ನೀವೇ (niveε)",
        roman: "niveε",
        english: "yourself",
        explanation: "Reflexive — you do to yourself",
      },
      {
        kannada: "ಅವನೇ (avanε)",
        roman: "avanε",
        english: "himself",
        explanation: "Reflexive — he does to himself",
      },
      {
        kannada: "ಸ್ವತಃ (swataε)",
        roman: "swataε",
        english: "self",
        explanation: "Reflexive — emphasizing one's own agency",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನಾನು ನಾನು ನೀವು ಸಾಕ್ಷಾತ್ಕಾರ (confusing reflexive with personal)",
        correct: "ನಾವೇ ನೀವು ಸಾಕ್ಷಾತ್ಕಾರ (proper reflexive)",
        explanation:
          "Use reflexive pronouns (ನಾವೇ) for self-action, not personal pronouns (ನಾನು).",
      },
    ],
    transformationExercises: [
      {
        instruction: "Change sentence to show reflexive action",
        exampleInstructionKannada: "ಆತ್ಮವಾಚಕ ಸರ್ವನಾಮ ಬಳಸಿ ವಾಕ್ಯ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಓದುತ್ತಿದೆ (reading)",
        exampleOutput: "ನಾವೇ ಓದುತ್ತಿರುವೆ (reading ourselves)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a reflexive pronoun?",
        options: ["ನಾನು (I)", "ನಾವೇ (myself)", "ಓದುತ್ತೇನೆ (I read)", "ಬರೆಯುತ್ತಾನೆ (he writes)"],
        correctAnswer: "ನಾವೇ (myself)",
        explanation:
          "ನಾವೇ is reflexive (action on self). ನಾನು is just personal pronoun.",
      },
    ],
    summary:
      "Reflexive pronouns show action done to oneself. They emphasize self-directed action.",
    prompt:
      "Reflexive pronouns are for self-action — when the doer and receiver of action are the SAME person!",
  },

  {
    id: "L6-C03-L08",
    chapterId: "C03",
    chapterTitle: "ಸರ್ವನಾಮ",
    title: "ಅನಿರ್ದಿಷ್ಟ ಸರ್ವನಾಮ (Indefinite Pronouns)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 25,
    grammarTopic: "Indefinite Pronouns",
    grammarTopicKannada: "ಅನಿರ್ದಿಷ್ಟ ಸರ್ವನಾಮ",
    ruleExplanation:
      "Indefinite pronouns refer to non-specific people or things. Examples: ಯಾವುದೋ (something), ಯಾರೋ (someone), ಅನೇಕ (many), ಕೆಲವು (some).",
    ruleExplanationKannada:
      "ಅನಿರ್ದಿಷ್ಟ ಸರ್ವನಾಮಗಳು ನಿರ್ದಿಷ್ಟವಲ್ಲದ ವ್ಯಕ್ತಿ ಅಥವಾ ವಸ್ತುವನ್ನು ಸೂಚಿಸುತ್ತವೆ.",
    exampleSentenceKannada: "ಯಾರೋ ಬರೆ ನೀಡಿದ್ದಾರೆ, ಯಾವುದೋ ಬಿದ್ದಿತು.",
    exampleSentenceRoman: "Yaro bare nidddare, yavudoε biddit.",
    exampleSentenceEnglish: "Someone lent me, something fell.",
    practiceExamples: [
      {
        kannada: "ಯಾವುದೋ (yavudoε)",
        roman: "yavudoε",
        english: "something",
        explanation: "Indefinite — a non-specific thing",
      },
      {
        kannada: "ಯಾರೋ (yaroε)",
        roman: "yaroε",
        english: "someone",
        explanation: "Indefinite — a non-specific person",
      },
      {
        kannada: "ಅನೇಕ (anek)",
        roman: "anek",
        english: "many",
        explanation: "Indefinite — unspecified quantity",
      },
      {
        kannada: "ಎಲ್ಲರೂ (ellaru)",
        roman: "ellaru",
        english: "everyone",
        explanation: "Indefinite — all people",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಯಾವುದೋ ಕೆಲವು ಪುಸ್ತಕ (mixing indefinites awkwardly)",
        correct: "ಕೆಲವು ಪುಸ್ತಕ / ಯಾವುದೋ ಪುಸ್ತಕ (clear indefinite)",
        explanation:
          "Use one indefinite pronoun clearly, not multiple in same context.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Use indefinite pronoun to make statement vague",
        exampleInstructionKannada: "ನಿರ್ದಿಷ್ಟತೆ ತೆಗೆದುಹಾಕಲು ಅನಿರ್ದಿಷ್ಟ ಸರ್ವನಾಮ ಬಳಸಿ",
        exampleInput: "ರಾಜ ಬಂದಿದ್ದಾನೆ",
        exampleOutput: "ಯಾರೋ ಬಂದಿದ್ದಾರೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is an indefinite pronoun?",
        options: ["ಅವನು (he)", "ಯಾವುದೋ (something)", "ರಾಜ (Raj)", "ಈ (this)"],
        correctAnswer: "ಯಾವುದೋ (something)",
        explanation:
          "ಯಾವುದೋ refers to something unspecific. The others refer to definite people/things.",
      },
    ],
    summary:
      "Indefinite pronouns refer to non-specific people or things. They don't point to anyone particular.",
    prompt:
      "Indefinite pronouns are mysterious — they talk about 'someone' or 'something' without saying who or what!",
  },
];

const chapter4Lessons: GrammarLesson[] = [
  {
    id: "L6-C04-L01",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಕ್ರಿಯಾಪದ ಪರಿಚಯ (Verb Introduction)",
    category: "Grammar",
    skill: "Parts of Speech",
    order: 26,
    grammarTopic: "Verbs",
    grammarTopicKannada: "ಕ್ರಿಯಾಪದ",
    ruleExplanation:
      "Verbs are action words. They show what someone or something does, is, or becomes. Examples: ಓದು (read), ಬರೆ (write), ಓಡು (run), ಇರು (be).",
    ruleExplanationKannada:
      "ಕ್ರಿಯಾಪದಗಳು ಕ್ರಿಯೆ ಸೂಚಿಸುವ ಪದಗಳು. ಯಾವ ಕ್ರಿಯೆ ನೀವು ಹೇಳುತ್ತೀರಿ ಅದು ಮಾಡುತ್ತಿರುವ ಕ್ರಿಯೆ.",
    exampleSentenceKannada: "ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ.",
    exampleSentenceRoman: "Nanu pusthaka oduttene.",
    exampleSentenceEnglish: "I read a book.",
    practiceExamples: [
      {
        kannada: "ಓದು (odu)",
        roman: "odu",
        english: "read",
        explanation: "Action verb - the activity of reading",
      },
      {
        kannada: "ಬರೆ (bare)",
        roman: "bare",
        english: "write",
        explanation: "Action verb - the activity of writing",
      },
      {
        kannada: "ಓಡು (odu)",
        roman: "odu",
        english: "run",
        explanation: "Action verb - movement",
      },
      {
        kannada: "ಇರು (iru)",
        roman: "iru",
        english: "be/exist",
        explanation: "State verb - showing condition/existence",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನಾನು ಓದುವ ಪುಸ್ತಕ (using verb as adjective)",
        correct: "ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ (proper verb form)",
        explanation:
          "Use finite verb forms for main action, not infinitive or participle.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify verb in sentence",
        exampleInstructionKannada: "ವಾಕ್ಯದ ಕ್ರಿಯಾಪದ ಗುರುತಿಸಿ",
        exampleInput: "ರಾಜ ಸಿನಿಮಾಗೆ ಹೋಗುತ್ತಾನೆ",
        exampleOutput: "ಹೋಗುತ್ತಾನೆ (verb)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which word is a verb?",
        options: ["ಪುಸ್ತಕ (book)", "ಓದುತ್ತೇನೆ (read)", "ತಿಳಿ (knowledge)", "ಕೆಂಪು (red)"],
        correctAnswer: "ಓದುತ್ತೇನೆ (read)",
        explanation:
          "ಓದುತ್ತೇನೆ is a verb (action). The others are noun, noun, or adjective.",
      },
    ],
    summary:
      "Verbs are action words showing what people or things do, are, or become.",
    prompt:
      "Verbs are the heart of sentences — they're where all the action happens!",
  },

  {
    id: "L6-C04-L02",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಪ್ರಸುತ ಕಾಲ (Present Tense)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 27,
    grammarTopic: "Present Tense",
    grammarTopicKannada: "ಪ್ರಸುತ ಕಾಲ",
    ruleExplanation:
      "Present tense shows actions happening now. In Kannada, present tense adds -ುತ್ತ with verb endings: ಓದುತ್ತೇನೆ (I read now), ಓದುತ್ತಾನೆ (he reads now).",
    ruleExplanationKannada:
      "ಪ್ರಸುತ ಕಾಲ ಈಗ ನಡೆಯುತ್ತಿರುವ ಕ್ರಿಯೆ ಸೂಚಿಸುತ್ತದೆ. ಕನ್ನಡದಲ್ಲಿ -ುತ್ತ ಸೇರಿಸಿ ಕ್ರಿಯೆ ತುದಿಗಳನ್ನು ಬಳಸುತ್ತೆವೆ.",
    exampleSentenceKannada: "ನಾನು ಈಗ ಮನೆಯಲ್ಲಿ ಓದುತ್ತೇನೆ.",
    exampleSentenceRoman: "Nanu iga maneylli oduttene.",
    exampleSentenceEnglish: "I am reading in the house now.",
    practiceExamples: [
      {
        kannada: "ಓದುತ್ತೇನೆ (oduttene)",
        roman: "oduttene",
        english: "I read (now)",
        explanation: "Present tense first person",
      },
      {
        kannada: "ಓದುತ್ತಾನೆ (oduttane)",
        roman: "oduttane",
        english: "he reads (now)",
        explanation: "Present tense third person masculine",
      },
      {
        kannada: "ಓದುತ್ತಾಳೆ (oduttale)",
        roman: "oduttale",
        english: "she reads (now)",
        explanation: "Present tense third person feminine",
      },
      {
        kannada: "ಓದುತ್ತಿರುತ್ತೇವೆ (oduttirutte)",
        roman: "oduttirutte",
        english: "we are reading (now)",
        explanation: "Present continuous form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನಾನು ಓದುತ್ತಾನೆ (mixing person - he form with I)",
        correct: "ನಾನು ಓದುತ್ತೇನೆ (matching person)",
        explanation:
          "Use verb endings that match the subject's person and gender.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Change verb to present tense",
        exampleInstructionKannada: "ಕ್ರಿಯಾಪದವನ್ನು ಪ್ರಸುತ ಕಾಲಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಓದು + ನಾನು",
        exampleOutput: "ನಾನು ಓದುತ್ತೇನೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is present tense form?",
        options: ["ಓದಿದೆ (read - past)", "ಓದುತ್ತೇನೆ (read - present)", "ಓದುವೆ (will read - future)", "ಓದಿರುವೆ (was reading)"],
        correctAnswer: "ಓದುತ್ತೇನೆ (read - present)",
        explanation:
          "ಓದುತ್ತೇನೆ has the -ುತ್ತ marker indicating present tense happening now.",
      },
    ],
    summary:
      "Present tense shows actions happening right now. Use -ುತ್ತ with person-specific endings.",
    prompt:
      "Present tense is the 'now' tense — it captures action as it's happening!",
  },

  {
    id: "L6-C04-L03",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಭೂತ ಕಾಲ (Past Tense)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 28,
    grammarTopic: "Past Tense",
    grammarTopicKannada: "ಭೂತ ಕಾಲ",
    ruleExplanation:
      "Past tense shows actions already completed. In Kannada, past tense uses -ಿದ/-ಿ endings: ಓದಿದೆ (I read), ಓದಿದ್ದಾನೆ (he read).",
    ruleExplanationKannada:
      "ಭೂತ ಕಾಲ ಈಗಾಗಲೇ ಅಪೂರ್ಣವಾಗಿರುವ ಕ್ರಿಯೆ ಸೂಚಿಸುತ್ತದೆ. ಕನ್ನಡದಲ್ಲಿ -ಿದ ವಾ -ಿ ಸೇರಿಸುತ್ತೆವೆ.",
    exampleSentenceKannada: "ನಾನು ಕಳೆದ ದಿನ ಪುಸ್ತಕ ಓದಿದೆ.",
    exampleSentenceRoman: "Nanu kaleda dina pusthaka odide.",
    exampleSentenceEnglish: "I read a book yesterday.",
    practiceExamples: [
      {
        kannada: "ಓದಿದೆ (odide)",
        roman: "odide",
        english: "I read (past)",
        explanation: "Past tense first person",
      },
      {
        kannada: "ಓದಿದ್ದಾನೆ (odiddane)",
        roman: "odiddane",
        english: "he read (past)",
        explanation: "Past tense third person masculine",
      },
      {
        kannada: "ಓದಿದ್ದಳು (odiddalu)",
        roman: "odiddalu",
        english: "she read (past)",
        explanation: "Past tense third person feminine",
      },
      {
        kannada: "ಓದಿತ್ತೆ (oditte)",
        roman: "oditte",
        english: "I used to read (habitual past)",
        explanation: "Past habitual form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನಾನು ಓದುತ್ತೇನೆ ಕಳೆದ ದಿನ (present form with past time marker)",
        correct: "ನಾನು ಕಳೆದ ದಿನ ಓದಿದೆ (past form with past time marker)",
        explanation:
          "Use past tense form (-ಿದ) with past time words, not present tense (-ುತ್ತ).",
      },
    ],
    transformationExercises: [
      {
        instruction: "Change present verb to past tense",
        exampleInstructionKannada: "ಪ್ರಸುತವನ್ನು ಭೂತ ಕಾಲಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಓದುತ್ತೇನೆ",
        exampleOutput: "ಓದಿದೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is past tense?",
        options: ["ಓದುತ್ತೇನೆ (present)", "ಓದಿದೆ (past)", "ಓದುವೆ (future)", "ಓದುತ್ತಿದೆ (present continuous)"],
        correctAnswer: "ಓದಿದೆ (past)",
        explanation:
          "ಓದಿದೆ has the -ಿದ marker indicating completed action in the past.",
      },
    ],
    summary:
      "Past tense shows actions that already happened. Use -ಿದ or -ಿ endings with appropriate person markers.",
    prompt:
      "Past tense is the 'already done' tense — it recalls what's finished and gone!",
  },

  {
    id: "L6-C04-L04",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಭವಿಷ್ಯತ್ ಕಾಲ (Future Tense)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 29,
    grammarTopic: "Future Tense",
    grammarTopicKannada: "ಭವಿಷ್ಯತ್ ಕಾಲ",
    ruleExplanation:
      "Future tense shows actions yet to happen. In Kannada, future tense uses -ುವೆ/-ುವ: ನಾನು ಓದುವೆ (I will read), ಅವನು ಓದುವನು (he will read).",
    ruleExplanationKannada:
      "ಭವಿಷ್ಯತ್ ಕಾಲ ಭವಿಷ್ಯತ್ತಿನಲ್ಲಿ ಘಟಿಸುವ ಕ್ರಿಯೆ ಸೂಚಿಸುತ್ತದೆ. ಕನ್ನಡದಲ್ಲಿ -ುವೆ/-ುವ ಸೇರಿಸುತ್ತೆವೆ.",
    exampleSentenceKannada: "ನಾನು ನಾಳೆ ಮನೆಗೆ ಹೋಗುವೆ.",
    exampleSentenceRoman: "Nanu nale manege hoguve.",
    exampleSentenceEnglish: "I will go home tomorrow.",
    practiceExamples: [
      {
        kannada: "ಹೋಗುವೆ (hoguve)",
        roman: "hoguve",
        english: "I will go (future)",
        explanation: "Future tense first person",
      },
      {
        kannada: "ಹೋಗುವನು (hoguvan)",
        roman: "hoguvan",
        english: "he will go (future)",
        explanation: "Future tense third person masculine",
      },
      {
        kannada: "ಹೋಗುವಳು (hoguvalu)",
        roman: "hoguvalu",
        english: "she will go (future)",
        explanation: "Future tense third person feminine",
      },
      {
        kannada: "ಹೋಗುವುದು (hoguvudu)",
        roman: "hoguvudu",
        english: "it will go (future - neuter)",
        explanation: "Future tense neuter",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನಾನು ನಾಳೆ ಹೋಗುತ್ತೇನೆ (present form with future time word)",
        correct: "ನಾನು ನಾಳೆ ಹೋಗುವೆ (future form with future time word)",
        explanation:
          "Use future tense form (-ುವೆ) with future time markers, not present (-ುತ್ತ).",
      },
    ],
    transformationExercises: [
      {
        instruction: "Change present verb to future tense",
        exampleInstructionKannada: "ಪ್ರಸುತವನ್ನು ಭವಿಷ್ಯತ್ ಕಾಲಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಹೋಗುತ್ತೇನೆ",
        exampleOutput: "ಹೋಗುವೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is future tense?",
        options: ["ಹೋಗಿದೆ (went - past)", "ಹೋಗುತ್ತೇನೆ (go - present)", "ಹೋಗುವೆ (will go - future)", "ಹೋಗುತ್ತಿದೆ (going - continuous)"],
        correctAnswer: "ಹೋಗುವೆ (will go - future)",
        explanation:
          "ಹೋಗುವೆ has the -ುವೆ marker indicating future action yet to happen.",
      },
    ],
    summary:
      "Future tense shows actions yet to happen. Use -ುವೆ, -ುವ endings with person markers.",
    prompt:
      "Future tense is the 'coming soon' tense — it anticipates what's ahead!",
  },

  {
    id: "L6-C04-L05",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಸಕರ್ಮಕ ಕ್ರಿಯೆ (Transitive Verbs)",
    category: "Grammar",
    skill: "Verb Types",
    order: 30,
    grammarTopic: "Transitive Verbs",
    grammarTopicKannada: "ಸಕರ್ಮಕ ಕ್ರಿಯೆ",
    ruleExplanation:
      "Transitive verbs take a direct object — the thing receiving the action. Examples: ಓದು (read), ಬರೆ (write), ಹೊಡೆ (hit), ನೋಡು (see).",
    ruleExplanationKannada:
      "ಸಕರ್ಮಕ ಕ್ರಿಯೆಗಳು ನೇರ ಕರ್ಮ ತೆಗೆದುಕೊಳ್ಳುತ್ತವೆ. ಉದಾಹರಣೆ: ಓದು, ಬರೆ, ಹೊಡೆ, ನೋಡು.",
    exampleSentenceKannada: "ರಾಜ ಪುಸ್ತಕವನ್ನು ಓದುತ್ತಾನೆ.",
    exampleSentenceRoman: "Raj pusthakavannu oduttane.",
    exampleSentenceEnglish: "Raj reads the book.",
    practiceExamples: [
      {
        kannada: "ಓದುತ್ತಾನೆ + ಪುಸ್ತಕವನ್ನು (reads + book)",
        roman: "oduttane + pusthakavannu",
        english: "reads the book",
        explanation: "Transitive — object is the book",
      },
      {
        kannada: "ಬರೆಯುತ್ತಾನೆ + ಪತ್ರವನ್ನು (writes + letter)",
        roman: "bareyuttane + pathravan",
        english: "writes the letter",
        explanation: "Transitive — object is the letter",
      },
      {
        kannada: "ನೋಡುತ್ತಾನೆ + ಚಲನೆಯನ್ನು (sees + movie)",
        roman: "noduttane + chalneyvannu",
        english: "sees the movie",
        explanation: "Transitive — object is the movie",
      },
      {
        kannada: "ಹೊಡೆಯುತ್ತಾನೆ + ಬಾಲ (hits + ball)",
        roman: "hodyuttane + bal",
        english: "hits the ball",
        explanation: "Transitive — object is the ball",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ (missing object marker)",
        correct: "ರಾಜ ಪುಸ್ತಕವನ್ನು ಓದುತ್ತಾನೆ (with object marker)",
        explanation:
          "Transitive verbs require direct objects marked with -ನ್ನು, -ವನ್ನು, etc.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Add appropriate object to transitive verb",
        exampleInstructionKannada: "ಸಕರ್ಮಕ ಕ್ರಿಯೆಗೆ ಸೂಕ್ತ ಕರ್ಮ ಸೇರಿಸಿ",
        exampleInput: "ಓದುತ್ತಾನೆ + __",
        exampleOutput: "ಓದುತ್ತಾನೆ + ಪುಸ್ತಕವನ್ನು",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a transitive verb with object?",
        options: ["ನಡೆಯುತ್ತಾನೆ (walks)", "ಓದುತ್ತಾನೆ ಪುಸ್ತಕವನ್ನು (reads a book)", "ಸ್ನಾನ ಮಾಡುತ್ತಾನೆ (bathes)", "ಸಾವಿರ ಮೂರುದೀ (sleeping)"],
        correctAnswer: "ಓದುತ್ತಾನೆ ಪುಸ್ತಕವನ್ನು (reads a book)",
        explanation:
          "This transitive verb has a direct object (book). The others are intransitive or lack clear objects.",
      },
    ],
    summary:
      "Transitive verbs require a direct object — something that receives the action.",
    prompt:
      "Transitive verbs need targets — they act ON something specific!",
  },

  {
    id: "L6-C04-L06",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಅಕರ್ಮಕ ಕ್ರಿಯೆ (Intransitive Verbs)",
    category: "Grammar",
    skill: "Verb Types",
    order: 31,
    grammarTopic: "Intransitive Verbs",
    grammarTopicKannada: "ಅಕರ್ಮಕ ಕ್ರಿಯೆ",
    ruleExplanation:
      "Intransitive verbs don't take a direct object — the action is complete without one. Examples: ನಡೆ (walk), ಸಾವಿರು (sleep), ಓಡು (run), ಬೀಳು (fall).",
    ruleExplanationKannada:
      "ಅಕರ್ಮಕ ಕ್ರಿಯೆಗಳು ನೇರ ಕರ್ಮ ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ. ಉದಾಹರಣೆ: ನಡೆ, ಸಾವಿರು, ಓಡು, ಬೀಳು.",
    exampleSentenceKannada: "ಹುಡುಗ ಪಾರ್ಕಿನಲ್ಲಿ ನಡೆಯುತ್ತಾನೆ.",
    exampleSentenceRoman: "Huduga parkinalli nadeyuttane.",
    exampleSentenceEnglish: "The boy walks in the park.",
    practiceExamples: [
      {
        kannada: "ನಡೆಯುತ್ತಾನೆ (nadeyuttane)",
        roman: "nadeyuttane",
        english: "walks",
        explanation: "Intransitive — no object needed",
      },
      {
        kannada: "ಸಾವಿರುತ್ತಾನೆ (saviruttan)",
        roman: "saviruttan",
        english: "sleeps",
        explanation: "Intransitive — stands alone",
      },
      {
        kannada: "ಓಡುತ್ತಾನೆ (oduttane)",
        roman: "oduttane",
        english: "runs",
        explanation: "Intransitive — complete action",
      },
      {
        kannada: "ಬೀಳುತ್ತಾನೆ (bilyuttane)",
        roman: "bilyuttane",
        english: "falls",
        explanation: "Intransitive — action is self-contained",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜ ನಡೆಯುತ್ತಾನೆ ಪಾರ್ಕಿನಲ್ಲಿಗೆ (adding -ಕ್ಕೆ as if transitive)",
        correct: "ರಾಜ ಪಾರ್ಕಿನಲ್ಲಿ ನಡೆಯುತ್ತಾನೆ (intransitive with location)",
        explanation:
          "Intransitive verbs don't take direct objects. Use locational or other adverbial markers instead.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify intransitive verbs (no object)",
        exampleInstructionKannada: "ಅಕರ್ಮಕ ಕ್ರಿಯೆ ಗುರುತಿಸಿ",
        exampleInput: "ನಡೆಯುತ್ತಾನೆ, ಓದುತ್ತಾನೆ, ಸಾವಿರುತ್ತಾನೆ",
        exampleOutput: "ನಡೆಯುತ್ತಾನೆ, ಸಾವಿರುತ್ತಾನೆ (no direct objects)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is an intransitive verb?",
        options: ["ಓದುತ್ತಾನೆ ಪುಸ್ತಕವನ್ನು (reads a book)", "ನಡೆಯುತ್ತಾನೆ (walks)", "ಬರೆಯುತ್ತಾನೆ ಪತ್ರವನ್ನು (writes a letter)", "ನೋಡುತ್ತಾನೆ ಚಿತ್ರವನ್ನು (sees a picture)"],
        correctAnswer: "ನಡೆಯುತ್ತಾನೆ (walks)",
        explanation:
          "ನಡೆಯುತ್ತಾನೆ is intransitive — no direct object. The others all have objects.",
      },
    ],
    summary:
      "Intransitive verbs don't need a direct object — the action is complete without one.",
    prompt:
      "Intransitive verbs are self-sufficient — they don't need targets to be complete!",
  },

  {
    id: "L6-C04-L07",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಕ್ರಿಯೆಯ ವ್ಯಕ್ತಿ ಮತ್ತು ಲಿಂಗ ಸಮನ್ವಯ (Verb Person & Gender Agreement)",
    category: "Grammar",
    skill: "Verb Conjugation",
    order: 32,
    grammarTopic: "Verb Agreement",
    grammarTopicKannada: "ಕ್ರಿಯೆಯ ವ್ಯಕ್ತಿ ಮತ್ತು ಲಿಂಗ ಸಮನ್ವಯ",
    ruleExplanation:
      "Verbs must agree with their subjects in person and gender. ಮಗ ಓದುತ್ತಾನೆ (boy reads - masculine), ಮಗಳು ಓದುತ್ತಾಳೆ (girl reads - feminine).",
    ruleExplanationKannada:
      "ಕ್ರಿಯಾಪದಗಳು ಕರ್ತೃಯ ವ್ಯಕ್ತಿ ಮತ್ತು ಲಿಂಗದ ಜೊತೆ ಸಮನ್ವಯವಾಗಿರಬೇಕು.",
    exampleSentenceKannada: "ಮಗ ಓದುತ್ತಾನೆ, ಮಗಳು ಓದುತ್ತಾಳೆ, ಮಕ್ಕಳು ಓದುತ್ತಾರೆ.",
    exampleSentenceRoman: "Maga oduttane, magalu oduttale, makkalu oduttare.",
    exampleSentenceEnglish: "The boy reads, the girl reads, the children read.",
    practiceExamples: [
      {
        kannada: "ನಾನು ಓದುತ್ತೇನೆ (I - singular first person)",
        roman: "nanu oduttene",
        english: "I read",
        explanation: "First person singular",
      },
      {
        kannada: "ಮಗ ಓದುತ್ತಾನೆ (boy - singular masculine)",
        roman: "maga oduttane",
        english: "the boy reads",
        explanation: "Third person singular masculine",
      },
      {
        kannada: "ಮಗಳು ಓದುತ್ತಾಳೆ (girl - singular feminine)",
        roman: "magalu oduttale",
        english: "the girl reads",
        explanation: "Third person singular feminine",
      },
      {
        kannada: "ಮಕ್ಕಳು ಓದುತ್ತಾರೆ (children - plural)",
        roman: "makkalu oduttare",
        english: "the children read",
        explanation: "Third person plural (all genders)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಮಗಳು ಓದುತ್ತಾನೆ (using masculine verb with feminine subject)",
        correct: "ಮಗಳು ಓದುತ್ತಾಳೆ (using feminine verb with feminine subject)",
        explanation:
          "Match verb ending to subject gender: -ನೆ for masculine, -ಳೆ for feminine, -ರೆ for plural.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Change verb to match subject person/gender",
        exampleInstructionKannada: "ಕರ್ತೃಯ ಲಿಂಗ ಮತ್ತು ವ್ಯಕ್ತಿಯ ಜೊತೆ ಕ್ರಿಯೆ ಸಮನ್ವಯ ಮಾಡಿ",
        exampleInput: "ಮಗ (ಓದು) / ಮಗಳು (ಓದು)",
        exampleOutput: "ಮಗ ಓದುತ್ತಾನೆ / ಮಗಳು ಓದುತ್ತಾಳೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which verb agrees correctly with subject?",
        options: ["ಮಗಳು ಓದುತ್ತಾನೆ (feminine + masculine verb)", "ಮಗಳು ಓದುತ್ತಾಳೆ (feminine + feminine verb)", "ಮಕ್ಕಳು ಓದುತ್ತಾನೆ (plural + masculine verb)", "ನಾನು ಓದುತ್ತಾನೆ (first person + third person verb)"],
        correctAnswer: "ಮಗಳು ಓದುತ್ತಾಳೆ (feminine + feminine verb)",
        explanation:
          "The verb ending must match: -ಳೆ for feminine singular. The others have mismatches.",
      },
    ],
    summary:
      "Verbs must agree with subjects in person and gender. Change verb endings to match.",
    prompt:
      "Verb-subject agreement is like matching shoes to outfit — they must coordinate!",
  },

  {
    id: "L6-C04-L08",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಆದೇಶಾರ್ಥಕ ಕ್ರಿಯೆ (Imperative / Commands)",
    category: "Grammar",
    skill: "Verb Moods",
    order: 33,
    grammarTopic: "Imperative Mood",
    grammarTopicKannada: "ಆದೇಶಾರ್ಥಕ ಕ್ರಿಯೆ",
    ruleExplanation:
      "Imperative verbs give commands. Drop the infinitive marker: ಓದು (read!), ಬರೆ (write!), ಹೋಗು (go!), ಕೇಳು (listen!).",
    ruleExplanationKannada:
      "ಆದೇಶಾರ್ಥಕ ಕ್ರಿಯೆಗಳು ಆದೇಶ ಅಥವಾ ಅನುರೋಧ ಸೂಚಿಸುತ್ತವೆ. ಸರಳ ಕ್ರಿಯೆ ರೂಪ ಬಳಸುತ್ತೆವೆ.",
    exampleSentenceKannada: "ಓದು ಪುಸ್ತಕ! ಮೆಲೀ ಕೇಳು!",
    exampleSentenceRoman: "Odu pusthaka! Mele kelu!",
    exampleSentenceEnglish: "Read the book! Listen, Mele!",
    practiceExamples: [
      {
        kannada: "ಓದು (odu)",
        roman: "odu",
        english: "read! (command)",
        explanation: "Imperative form",
      },
      {
        kannada: "ಬರೆ (bare)",
        roman: "bare",
        english: "write! (command)",
        explanation: "Imperative form",
      },
      {
        kannada: "ಹೋಗು (hogu)",
        roman: "hogu",
        english: "go! (command)",
        explanation: "Imperative form",
      },
      {
        kannada: "ಕೇಳು (kelu)",
        roman: "kelu",
        english: "listen! (command)",
        explanation: "Imperative form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಓದುತ್ತಿದೀರ ಪುಸ್ತಕ (using present tense instead of imperative)",
        correct: "ಓದು ಪುಸ್ತಕ (using imperative command)",
        explanation:
          "Commands use bare verb form, not present tense conjugations.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form imperative/command from infinitive",
        exampleInstructionKannada: "ಆದೇಶಾರ್ಥಕ ರೂಪ ರೈತೆ",
        exampleInput: "ಓದುತ್ತಾನೆ (he reads)",
        exampleOutput: "ಓದು (read!)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is an imperative/command?",
        options: ["ಓದುತ್ತೇನೆ (I read)", "ಓದು (read!)", "ಓದಿದೆ (I read)", "ಓದುವೆ (I will read)"],
        correctAnswer: "ಓದು (read!)",
        explanation:
          "ಓದು is the imperative form used for giving commands. The others are different tenses.",
      },
    ],
    summary:
      "Imperative verbs give commands or make requests. Use the bare verb form.",
    prompt:
      "Imperative verbs are action-triggering — they make things HAPPEN by commanding!",
  },

  {
    id: "L6-C04-L09",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ನಿಷೇಧ ಕ್ರಿಯೆ (Negation / Don't)",
    category: "Grammar",
    skill: "Verb Moods",
    order: 34,
    grammarTopic: "Negation",
    grammarTopicKannada: "ನಿಷೇಧ ಕ್ರಿಯೆ",
    ruleExplanation:
      "Negative verbs show what NOT to do. In Kannada, use ಬೇಡ (don't) or -ದೀ: ಓದಬೇಡ (don't read), ಓದದೀ (not reading).",
    ruleExplanationKannada:
      "ನಿಷೇಧ ಕ್ರಿಯೆಗಳು ಎಂದಿಸುವುದನ್ನು ತಿರಸ್ಕರಿಸುತ್ತವೆ. ಕನ್ನಡದಲ್ಲಿ ಬೇಡ ಸೇರಿಸುತ್ತೆವೆ.",
    exampleSentenceKannada: "ಓದಬೇಡ! ಅಪರಾಧ ಮಾಡಬೇಡ.",
    exampleSentenceRoman: "Odabед! Aparadh madabед.",
    exampleSentenceEnglish: "Don't read! Don't sin.",
    practiceExamples: [
      {
        kannada: "ಓದಬೇಡ (odabед)",
        roman: "odabед",
        english: "don't read",
        explanation: "Negative command",
      },
      {
        kannada: "ಹೋಗಬೇಡ (hogabед)",
        roman: "hogabед",
        english: "don't go",
        explanation: "Negative command",
      },
      {
        kannada: "ಬರೆಬೇಡ (barebед)",
        roman: "barebед",
        english: "don't write",
        explanation: "Negative command",
      },
      {
        kannada: "ಮಾಡದೀ (maddi)",
        roman: "maddi",
        english: "not doing",
        explanation: "Negative participle form",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಓದುತ್ತಿಲ್ಲ (present negative, not command)",
        correct: "ಓದಬೇಡ (negative command - don't!)",
        explanation:
          "For commands, use -ಬೇಡ ending. For statements, use -ಿಲ್ಲ.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form negative command",
        exampleInstructionKannada: "ಆದೇಶಾರ್ಥಕ ಶಾಲಕ್ಕೆ ನಿಷೇಧ ರೂಪ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಓದು (read)",
        exampleOutput: "ಓದಬೇಡ (don't read)",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a negative command?",
        options: ["ಓದುತ್ತೇನೆ (I read)", "ಓದು (read!)", "ಓದಬೇಡ (don't read!)", "ಓದುತ್ತಿಲ್ಲ (I'm not reading)"],
        correctAnswer: "ಓದಬೇಡ (don't read!)",
        explanation:
          "ಓದಬೇಡ is a negative command. The others are positive or statements.",
      },
    ],
    summary:
      "Negative verbs show what NOT to do. Use -ಬೇಡ for negative commands.",
    prompt:
      "Negative verbs say 'NO!' — they forbid and prevent actions!",
  },

  {
    id: "L6-C04-L10",
    chapterId: "C04",
    chapterTitle: "ಕ್ರಿಯಾಪದ",
    title: "ಸಾಮರ್ಥ್ಯ ಕ್ರಿಯೆ (Ability Verbs / Can)",
    category: "Grammar",
    skill: "Verb Moods",
    order: 35,
    grammarTopic: "Ability Verbs",
    grammarTopicKannada: "ಸಾಮರ್ಥ್ಯ ಕ್ರಿಯೆ",
    ruleExplanation:
      "Ability verbs show capability. In Kannada, use ಸಾಕು (can), ಸಾಧ್ಯ (able): ನಾನು ಓದಲು ಸಾಕು (I can read), ಅವನು ಓಡಲು ಸಾಧ್ಯ (He can run).",
    ruleExplanationKannada:
      "ಸಾಮರ್ಥ್ಯ ಕ್ರಿಯೆಗಳು ಮಾಡುವ ಸಾಮರ್ಥ್ಯ ಸೂಚಿಸುತ್ತವೆ. ಕನ್ನಡದಲ್ಲಿ ಸಾಕು ಅಥವಾ ಸಾಧ್ಯ ಬಳಸುತ್ತೆವೆ.",
    exampleSentenceKannada: "ನಾನು ಓದಲು ಸಾಕು.",
    exampleSentenceRoman: "Nanu odalu saku.",
    exampleSentenceEnglish: "I can read.",
    practiceExamples: [
      {
        kannada: "ಓದಲು ಸಾಕು (odalu saku)",
        roman: "odalu saku",
        english: "can read",
        explanation: "Ability to read",
      },
      {
        kannada: "ಹೋಗಲು ಸಾಕು (hogalu saku)",
        roman: "hogalu saku",
        english: "can go",
        explanation: "Ability to go",
      },
      {
        kannada: "ಓಡಲು ಸಾಧ್ಯ (odalu sadhy)",
        roman: "odalu sadhy",
        english: "able to run",
        explanation: "Ability to run",
      },
      {
        kannada: "ಬರೆಯಲು ಸಾಕು (bareyalu saku)",
        roman: "bareyalu saku",
        english: "can write",
        explanation: "Ability to write",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನಾನು ಸಾಕು ಓದೆ (wrong word order)",
        correct: "ನಾನು ಓದಲು ಸಾಕು (correct word order)",
        explanation:
          "Place the infinitive before ಸಾಕು: verb-ಲು ಸಾಕು.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form ability phrase",
        exampleInstructionKannada: "ಸಾಮರ್ಥ್ಯ ಕ್ರಿಯೆ ರೈತೆ",
        exampleInput: "ನಾನು (ಓದು)",
        exampleOutput: "ನಾನು ಓದಲು ಸಾಕು",
      },
    ],
    mcqQuestions: [
      {
        question: "Which shows ability?",
        options: ["ನಾನು ಓದುತ್ತೇನೆ (I read)", "ನಾನು ಓದಲು ಸಾಕು (I can read)", "ನಾನು ಓದುವೆ (I will read)", "ನಾನು ಓದಿದೆ (I read)"],
        correctAnswer: "ನಾನು ಓದಲು ಸಾಕು (I can read)",
        explanation:
          "ಸಾಕು/ಸಾಧ್ಯ indicates ability. The others show tense, not capability.",
      },
    ],
    summary:
      "Ability verbs show capability. Use infinitive + ಸಾಕು or ಸಾಧ್ಯ.",
    prompt:
      "Ability verbs celebrate potential — they say 'I CAN!' instead of just 'I do'!",
  },
];

const chapter5Lessons: GrammarLesson[] = [
  {
    id: "L6-C05-L01",
    chapterId: "C05",
    chapterTitle: "ವಾಕ್ಯ ರಚನೆ",
    title: "ವಾಕ್ಯ ಪರಿಚಯ (Sentence Basics)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 36,
    grammarTopic: "Sentence Structure",
    grammarTopicKannada: "ವಾಕ್ಯ ರಚನೆ",
    ruleExplanation:
      "A sentence has a subject (who) and a verb (action). In Kannada, the word order is typically Subject-Object-Verb (SOV). Example: ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ (Raj book reads).",
    ruleExplanationKannada:
      "ವಾಕ್ಯವು ಕರ್ತೃ (ಯಾರು) ಮತ್ತು ಕ್ರಿಯಾಪದ (ಏನು ಮಾಡುತ್ತಿರುವೆ) ಹೊಂದಿರಬೇಕು. ಕನ್ನಡದಲ್ಲಿ ಕ್ರಮ: ಕರ್ತೃ-ಕರ್ಮ-ಕ್ರಿಯೆ.",
    exampleSentenceKannada: "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ.",
    exampleSentenceRoman: "Raj pusthaka oduttane.",
    exampleSentenceEnglish: "Raj reads the book.",
    practiceExamples: [
      {
        kannada: "ರಾಜ ಅಣ್ಣ",
        roman: "Raj anna",
        english: "Raj (subject/older brother)",
        explanation: "Subject of the sentence",
      },
      {
        kannada: "ಪುಸ್ತಕ",
        roman: "pusthaka",
        english: "book (object)",
        explanation: "Object being acted upon",
      },
      {
        kannada: "ಓದುತ್ತಾನೆ",
        roman: "oduttane",
        english: "reads (verb)",
        explanation: "Action/predicate",
      },
      {
        kannada: "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ",
        roman: "Raj pusthaka oduttane",
        english: "Raj reads the book",
        explanation: "Complete sentence (S-O-V order)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಪುಸ್ತಕ ರಾಜ ಓದುತ್ತಾನೆ (wrong word order)",
        correct: "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ (S-O-V correct order)",
        explanation:
          "Kannada follows Subject-Object-Verb order, not English SVO order.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Arrange words in Kannada SOV order",
        exampleInstructionKannada: "ವಿಷಯ, ಕರ್ಮ, ಕ್ರಿಯೆ ಸಂಯೋಜಿಸಿ",
        exampleInput: "ಓದುತ್ತಾನೆ / ರಾಜ / ಪುಸ್ತಕ",
        exampleOutput: "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which sentence has correct Kannada word order?",
        options: ["ಪುಸ್ತಕ ರಾಜ ಓದುತ್ತಾನೆ", "ಓದುತ್ತಾನೆ ರಾಜ ಪುಸ್ತಕ", "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ", "ರಾಜ ಓದುತ್ತಾನೆ ಪುಸ್ತಕ"],
        correctAnswer: "ರಾಜ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ",
        explanation:
          "Kannada uses SOV (Subject-Object-Verb) word order. This follows that pattern.",
      },
    ],
    summary:
      "Kannada sentences follow Subject-Object-Verb order. Every sentence needs a subject and verb.",
    prompt:
      "Sentence structure is like a recipe — the order of ingredients (words) matters for the right taste (meaning)!",
  },

  {
    id: "L6-C05-L02",
    chapterId: "C05",
    chapterTitle: "ವಾಕ್ಯ ರಚನೆ",
    title: "ಸರಳ ವಾಕ್ಯ (Simple Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 37,
    grammarTopic: "Simple Sentences",
    grammarTopicKannada: "ಸರಳ ವಾಕ್ಯ",
    ruleExplanation:
      "A simple sentence has one subject and one verb. Example: ಬೆಕ್ಕು ನಿದ್ದೆ ಮಾಡುತ್ತಿದೆ (The cat sleeps).",
    ruleExplanationKannada:
      "ಸರಳ ವಾಕ್ಯವು ಒಂದು ಕರ್ತೃ ಮತ್ತು ಒಂದು ಪ್ರಮುಖ ಕ್ರಿಯೆ ಹೊಂದಿರುತ್ತದೆ.",
    exampleSentenceKannada: "ಬೆಕ್ಕು ನಿದ್ದೆ ಮಾಡುತ್ತಿದೆ.",
    exampleSentenceRoman: "Bekku nidde maduttide.",
    exampleSentenceEnglish: "The cat is sleeping.",
    practiceExamples: [
      {
        kannada: "ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ.",
        roman: "Huduga nrutya maduttale.",
        english: "The girl dances.",
        explanation: "Simple sentence - one subject, one verb",
      },
      {
        kannada: "ಹುಡುಗನು ಸಿನಿಮಾ ನೋಡುತ್ತಾನೆ.",
        roman: "Huduganu cinema noduttane.",
        english: "The boy watches a movie.",
        explanation: "Simple sentence with one action",
      },
      {
        kannada: "ಪಕ್ಷಿ ಆಕಾಶದಲ್ಲಿ ಹಾರುತ್ತಿದೆ.",
        roman: "Pakshi akashadalli harutide.",
        english: "The bird flies in the sky.",
        explanation: "Simple sentence with location modifier",
      },
      {
        kannada: "ಮಾವಿನಕಾಯಿ ಕೆಂಪಾಗಿದೆ.",
        roman: "Mavinkayi kempagide.",
        english: "The mango is red.",
        explanation: "Simple sentence with predicate adjective",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ ಮತ್ತು ಹಾಡುತ್ತಾಳೆ (compound, not simple)",
        correct: "ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ. (simple)",
        explanation:
          "Simple sentences have only one main verb. Multiple verbs make compound sentences.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Form simple sentence from subject + verb",
        exampleInstructionKannada: "ಸರಳ ವಾಕ್ಯ ರೈತೆ",
        exampleInput: "ಹುಡುಗನು + ಓದುತ್ತಾನೆ",
        exampleOutput: "ಹುಡುಗನು ಓದುತ್ತಾನೆ.",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a simple sentence?",
        options: ["ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ ಮತ್ತು ಹಾಡುತ್ತಾಳೆ (compound)", "ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ (simple)", "ಹುಡುಗ ನೃತ್ಯ ಮಾಡಿದ ತರುವಾಯ ಹಾಡುತ್ತಾಳೆ (complex)", "ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಿರುವಾಗ ಹಾಡುತ್ತಾಳೆ (complex)"],
        correctAnswer: "ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ (simple)",
        explanation:
          "Simple sentences have one subject and one main verb. The others have multiple verbs.",
      },
    ],
    summary:
      "Simple sentences contain one subject and one main verb.",
    prompt:
      "Simple sentences are straightforward — subject does one action!",
  },

  {
    id: "L6-C05-L03",
    chapterId: "C05",
    chapterTitle: "ವಾಕ್ಯ ರಚನೆ",
    title: "ಯುಗ್ಮ ವಾಕ್ಯ (Compound Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 38,
    grammarTopic: "Compound Sentences",
    grammarTopicKannada: "ಯುಗ್ಮ ವಾಕ್ಯ",
    ruleExplanation:
      "A compound sentence has two or more simple sentences joined by ಮತ್ತು (and), ಅಥವಾ (or), ಆದರೆ (but).",
    ruleExplanationKannada:
      "ಯುಗ್ಮ ವಾಕ್ಯವು ಎರಡು ಅಥವಾ ಎಲ್ಲಾ ಸರಳ ವಾಕ್ಯಗಳನ್ನು ಸಂಪರ್ಕ ಪದಗಳಿಂದ ಸಂಯೋಜಿಸುತ್ತದೆ.",
    exampleSentenceKannada: "ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ ಮತ್ತು ಹಾಡುತ್ತಾಳೆ.",
    exampleSentenceRoman: "Huduga nrutya maduttale mattu haduttale.",
    exampleSentenceEnglish: "The girl dances and sings.",
    practiceExamples: [
      {
        kannada: "ರಾಜ ಓದುತ್ತಾನೆ ಮತ್ತು ಬರೆಯುತ್ತಾನೆ.",
        roman: "Raj oduttane mattu bareyuttane.",
        english: "Raj reads and writes.",
        explanation: "Compound sentence with ಮತ್ತು (and)",
      },
      {
        kannada: "ನೀನು ಹೋಗಬಹುದು ಅಥವಾ ಥೆಯಿಕೆ ಮಾಡಬಹುದು.",
        roman: "Nin hogabahud athva theike madbahud.",
        english: "You can go or stay.",
        explanation: "Compound sentence with ಅಥವಾ (or)",
      },
      {
        kannada: "ಅವನು ಚೆನ್ನಾಗಿದ್ದಾನೆ ಆದರೆ ಸೋಮಾರಿ.",
        roman: "Avanu chennagiddane adare somaari.",
        english: "He is good but lazy.",
        explanation: "Compound sentence with ಆದರೆ (but)",
      },
      {
        kannada: "ಮನೆ ಚಿಕ್ಕದಾಗಿದೆ ಮತ್ತು ಸುಂದರವಾಗಿದೆ.",
        roman: "Mane chikkadagide mattu sundaravagide.",
        english: "The house is small and beautiful.",
        explanation: "Compound sentence with adjectives joined by ಮತ್ತು",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜ ಓದುತ್ತಾನೆ ಬರೆಯುತ್ತಾನೆ (missing connector)",
        correct: "ರಾಜ ಓದುತ್ತಾನೆ ಮತ್ತು ಬರೆಯುತ್ತಾನೆ (with ಮತ್ತು)",
        explanation:
          "Compound sentences need connectors (ಮತ್ತು, ಅಥವಾ, ಆದರೆ) between clauses.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Join two simple sentences with connector",
        exampleInstructionKannada: "ಎರಡು ವಾಕ್ಯ ಸಂಪರ್ಕ ಪದದಿಂದ ಸಂಯೋಜಿಸಿ",
        exampleInput: "ರಾಜ ನೃತ್ಯ ಮಾಡುತ್ತಾನೆ. ಮಾಲೆ ಹಾಡುತ್ತಾಳೆ.",
        exampleOutput: "ರಾಜ ನೃತ್ಯ ಮಾಡುತ್ತಾನೆ ಮತ್ತು ಮಾಲೆ ಹಾಡುತ್ತಾಳೆ.",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a compound sentence?",
        options: ["ಪುಸ್ತಕ ಮಿಠಾ (simple)", "ಪುಸ್ತಕ ಮಿಠಾ ಮತ್ತು ಸಂತೋಷ (compound)", "ಪುಸ್ತಕ ಓದುತ್ತಿರುವ ಹುಡುಗ (complex)", "ಪುಸ್ತಕ ಮೆಲೆಮೆಲೆ (simple)"],
        correctAnswer: "ಪುಸ್ತಕ ಮಿಠಾ ಮತ್ತು ಸಂತೋಷ (compound)",
        explanation:
          "The compound sentence joins two ideas with ಮತ್ತು. The others are simple or complex.",
      },
    ],
    summary:
      "Compound sentences join two or more simple sentences with connectors.",
    prompt:
      "Compound sentences are team players — they combine ideas with ಮತ್ತು, ಅಥವಾ, or ಆದರೆ!",
  },

  {
    id: "L6-C05-L04",
    chapterId: "C05",
    chapterTitle: "ವಾಕ್ಯ ರಚನೆ",
    title: "ಸಂಕೀರ್ಣ ವಾಕ್ಯ (Complex Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 39,
    grammarTopic: "Complex Sentences",
    grammarTopicKannada: "ಸಂಕೀರ್ಣ ವಾಕ್ಯ",
    ruleExplanation:
      "A complex sentence has a main clause and one or more dependent clauses. Dependent clauses use ಮಾಡಿದಾಗ (when), ಏಕೆಂದರೆ (because), ಯಾವುದು (which), etc.",
    ruleExplanationKannada:
      "ಸಂಕೀರ್ಣ ವಾಕ್ಯವು ಮುಖ್ಯ ಕ್ಲಾಜ್ ಮತ್ತು ಅವಲಂಬಿತ ಕ್ಲಾಜ್ ಹೊಂದಿರುತ್ತದೆ.",
    exampleSentenceKannada: "ರಾಜ ಓದಿದ ಪುಸ್ತಕ ಸುಂದರವಾಗಿದೆ.",
    exampleSentenceRoman: "Raj odida pusthaka sundaravagide.",
    exampleSentenceEnglish: "The book that Raj read is beautiful.",
    practiceExamples: [
      {
        kannada: "ರಾಜ ಇದ್ದಾಗ ಮಾಲೆ ಬರುತ್ತಾಳೆ.",
        roman: "Raj iddage Male baruttale.",
        english: "When Raj is here, Mali comes.",
        explanation: "Complex with temporal clause",
      },
      {
        kannada: "ಮಾವಿನಕಾಯಿ ಮಿಠಾ ಏಕೆಂದರೆ ಬಾರಾ ಸಾಕಾಗಿತ್ತುಂಬೆ.",
        roman: "Mavinkayi mitha ekendar bara sakagiddumbe.",
        english: "The mango is sweet because it is ripe.",
        explanation: "Complex with causal clause",
      },
      {
        kannada: "ಹುಡುಗ ಯಾವುದು ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ ಚೆನ್ನಾಗಿದೆ.",
        roman: "Huduga yavudu nrutya maduttale chennagide.",
        english: "The girl who dances is good.",
        explanation: "Complex with relative clause",
      },
      {
        kannada: "ನೀನು ಓದಬಹುದೆ ಆದ್ದೆ ನೋಲಲು ಕಸರು ಬೇಕೆ.",
        roman: "Nin odabahude addε nolalu kasru beke.",
        english: "Although you can read, you need to practice.",
        explanation: "Complex with concessive clause",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ರಾಜ ಓದಿದ ಪುಸ್ತಕ ಮಿಠಾ ಮಾಲೆ ಸಿನಿಮಾ ನೋಡುತ್ತಾಳೆ (run-on)",
        correct: "ರಾಜ ಓದಿದ ಪುಸ್ತಕ ಮಿಠಾ. ಮಾಲೆ ಸಿನಿಮಾ ನೋಡುತ್ತಾಳೆ. (separate sentences)",
        explanation:
          "Complex sentences need clear main and dependent clauses, not run-ons.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Identify main and dependent clauses",
        exampleInstructionKannada: "ಮುಖ್ಯ ಕ್ಲಾಜ್ ಮತ್ತು ಅವಲಂಬಿತ ಕ್ಲಾಜ್ ಗುರುತಿಸಿ",
        exampleInput: "ರಾಜ ಓದಿದ ಪುಸ್ತಕ ಚೆನ್ನಾಗಿದೆ",
        exampleOutput: "Main: ಪುಸ್ತಕ ಚೆನ್ನಾಗಿದೆ / Dependent: ರಾಜ ಓದಿದ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a complex sentence?",
        options: ["ರಾಜ ಓದುತ್ತಾನೆ (simple)", "ರಾಜ ಓದುತ್ತಾನೆ ಮತ್ತು ಬರೆಯುತ್ತಾನೆ (compound)", "ರಾಜ ಓದಿದ ಪುಸ್ತಕ ಸುಂದರ (complex)", "ಹುಡುಗ ನೃತ್ಯ ಮಾಡುತ್ತಾಳೆ (simple)"],
        correctAnswer: "ರಾಜ ಓದಿದ ಪುಸ್ತಕ ಸುಂದರ (complex)",
        explanation:
          "This complex sentence has a dependent clause (ರಾಜ ಓದಿದ) modifying the main clause.",
      },
    ],
    summary:
      "Complex sentences have a main clause and dependent clauses linked by relative or subordinate conjunctions.",
    prompt:
      "Complex sentences show relationships — they explain why, when, and which things relate!",
  },

  {
    id: "L6-C05-L05",
    chapterId: "C05",
    chapterTitle: "ವಾಕ್ಯ ರಚನೆ",
    title: "ಪ್ರಶ್ನಾರ್ಥಕ ವಾಕ್ಯ (Interrogative Sentences / Questions)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 40,
    grammarTopic: "Questions",
    grammarTopicKannada: "ಪ್ರಶ್ನಾರ್ಥಕ ವಾಕ್ಯ",
    ruleExplanation:
      "Questions ask for information. In Kannada, use ಯಾವ (which), ಯಾರು (who), ಎಷ್ಟು (how much), ಎಲ್ಲಿ (where). Questions end with ?",
    ruleExplanationKannada:
      "ಪ್ರಶ್ನಾರ್ಥಕ ವಾಕ್ಯಗಳು ಮಾಹಿತಿ ಕೋರುತ್ತವೆ. ಪ್ರಶ್ನೆಗಳು ? ನಿಂದ ಮುಕ್ತವಾಗುತ್ತವೆ.",
    exampleSentenceKannada: "ನಿಮ್ಮ ಹೆಸರೇನು?",
    exampleSentenceRoman: "Nimma hesarenu?",
    exampleSentenceEnglish: "What is your name?",
    practiceExamples: [
      {
        kannada: "ನೀನು ಎಲ್ಲಿಂದ?",
        roman: "Nin ellinda?",
        english: "Where are you from?",
        explanation: "Question with ಎಲ್ಲಿ (where)",
      },
      {
        kannada: "ಯಾವ ಪುಸ್ತಕ ನೆಕಿ ಪಸಂದ?",
        roman: "Yava pusthaka neki pasand?",
        english: "Which book do you like?",
        explanation: "Question with ಯಾವ (which)",
      },
      {
        kannada: "ಎಷ್ಟು ವಯಸ್ಸಿನೋ?",
        roman: "Eshtu vayassino?",
        english: "How old are you?",
        explanation: "Question with ಎಷ್ಟು (how much)",
      },
      {
        kannada: "ಯಾರು ನಿಮ್ಮ ಸ್ನೇಹಿತ?",
        roman: "Yaru nimma snehita?",
        english: "Who is your friend?",
        explanation: "Question with ಯಾರು (who)",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನೀನು ಎಲ್ಲಿಂದ? (no verb - incomplete)",
        correct: "ನೀನು ಎಲ್ಲಿಂದ ಬಂದೆ? (with verb - complete question)",
        explanation:
          "Questions should have complete subject-verb structure, not just pronouns.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert statement to question",
        exampleInstructionKannada: "ಹೇಳಿಕೆಯನ್ನು ಪ್ರಶ್ನೆಯನ್ನಾಗಿ ಬದಲಾಯಿಸಿ",
        exampleInput: "ರಾಜ ಮನೆ ಹೋಗುತ್ತಾನೆ",
        exampleOutput: "ರಾಜ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಾನೆ?",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is an interrogative sentence?",
        options: ["ರಾಜ ಮನೆ ಹೋಗುತ್ತಾನೆ (statement)", "ರಾಜ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಾನೆ? (question)", "ರಾಜ ಮನೆ ಹೋಗುತ್ತಿದ್ದನು (past continuous)", "ರಾಜ ಮನೆ ಹೋಗಿದ್ದಾನೆ (past)"],
        correctAnswer: "ರಾಜ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಾನೆ? (question)",
        explanation:
          "Only this sentence is interrogative, ending with ? and asking for information.",
      },
    ],
    summary:
      "Interrogative sentences ask questions. Use question words (ಯಾರು, ಯಾವ, ಎಷ್ಟು, ಎಲ್ಲಿ) and end with ?",
    prompt:
      "Interrogative sentences are curious — they ask for answers!",
  },

  {
    id: "L6-C05-L06",
    chapterId: "C05",
    chapterTitle: "ವಾಕ್ಯ ರಚನೆ",
    title: "ನಿಷೇಧಾರ್ಥಕ ವಾಕ್ಯ (Negative Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 41,
    grammarTopic: "Negative Sentences",
    grammarTopicKannada: "ನಿಷೇಧಾರ್ಥಕ ವಾಕ್ಯ",
    ruleExplanation:
      "Negative sentences deny or negate. Use ಇಲ್ಲ (no), ಬೇಡ (don't), ಅಲ್ಲ (not). Example: ಅವನು ಓದುತ್ತಿಲ್ಲ (He doesn't read).",
    ruleExplanationKannada:
      "ನಿಷೇಧಾರ್ಥಕ ವಾಕ್ಯಗಳು ನಿರಾಕರಣ ಸೂಚಿಸುತ್ತವೆ. ಇಲ್ಲ, ಬೇಡ, ಅಲ್ಲ ಬಳಸುತ್ತೆವೆ.",
    exampleSentenceKannada: "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿಲ್ಲ.",
    exampleSentenceRoman: "Nanu manege hoguttilla.",
    exampleSentenceEnglish: "I am not going home.",
    practiceExamples: [
      {
        kannada: "ಮಾವಿನಕಾಯಿ ಕೆಂಪ ಅಲ್ಲ.",
        roman: "Mavinkayi kemp alla.",
        english: "The mango is not red.",
        explanation: "Negative with ಅಲ್ಲ",
      },
      {
        kannada: "ನಾನು ಪುಸ್ತಕ ಓದುತ್ತಿಲ್ಲ.",
        roman: "Nanu pusthaka oduttilla.",
        english: "I am not reading the book.",
        explanation: "Negative with ಇಲ್ಲ",
      },
      {
        kannada: "ರಾಜ ಮನೆಯಿಂದ ಬರುತ್ತಿಲ್ಲ.",
        roman: "Raj maneyinda baruttilla.",
        english: "Raj is not coming from home.",
        explanation: "Negative with ಿಲ್ಲ ending",
      },
      {
        kannada: "ಓದಬೇಡ!",
        roman: "Odabed!",
        english: "Don't read!",
        explanation: "Negative imperative with ಬೇಡ",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ ಇಲ್ಲ (placing ಇಲ್ಲ after verb)",
        correct: "ನಾನು ಪುಸ್ತಕ ಓದುತ್ತಿಲ್ಲ (using -ಿಲ್ಲ suffix)",
        explanation:
          "Use -ಿಲ್ಲ as suffix to verb, not ಇಲ್ಲ as separate word.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert positive sentence to negative",
        exampleInstructionKannada: "ಧನಾತ್ಮಕ ವಾಕ್ಯವನ್ನು ನಿಷೇಧಾರ್ಥಕಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಅವನು ಮನೆ ಹೋಗುತ್ತಾನೆ",
        exampleOutput: "ಅವನು ಮನೆ ಹೋಗುತ್ತಿಲ್ಲ",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is a negative sentence?",
        options: ["ರಾಜ ಓದುತ್ತಾನೆ (positive)", "ರಾಜ ಓದುತ್ತಿಲ್ಲ (negative)", "ರಾಜ ಓದುವನು (future)", "ರಾಜ ಓದಿದ್ದಾನೆ (past)"],
        correctAnswer: "ರಾಜ ಓದುತ್ತಿಲ್ಲ (negative)",
        explanation:
          "ಓದುತ್ತಿಲ್ಲ with -ಿಲ್ಲ ending shows negation. The others are positive or different tenses.",
      },
    ],
    summary:
      "Negative sentences deny or negate actions. Use -ಿಲ್ಲ, ಅಲ್ಲ, or ಬೇಡ.",
    prompt:
      "Negative sentences say NO — they take things away or deny them!",
  },

  {
    id: "L6-C05-L07",
    chapterId: "C05",
    chapterTitle: "ವಾಕ್ಯ ರಚನೆ",
    title: "ವಿಸ್ಮಯಾರ್ಥಕ ವಾಕ್ಯ (Exclamatory Sentences)",
    category: "Grammar",
    skill: "Sentence Construction",
    order: 42,
    grammarTopic: "Exclamatory Sentences",
    grammarTopicKannada: "ವಿಸ್ಮಯಾರ್ಥಕ ವಾಕ್ಯ",
    ruleExplanation:
      "Exclamatory sentences express strong emotion. End with ! Use ಸ್ಫುರೆ!, ಅಯ್ಯೋ!, ವಾಹ!, ಎತ್ತರ! Examples: ಕಾಳೆ ಹುಸುಳಿ! (What beautiful weather!)",
    ruleExplanationKannada:
      "ವಿಸ್ಮಯಾರ್ಥಕ ವಾಕ್ಯಗಳು ಪ್ರಬಲ ಭಾವನೆ ಪ್ರಕಟಿಸುತ್ತವೆ. ! ನಿಂದ ಮುಕ್ತವಾಗುತ್ತವೆ.",
    exampleSentenceKannada: "ಯಾ ಸುಂದರ ಮನೆ!",
    exampleSentenceRoman: "Ya sundara mane!",
    exampleSentenceEnglish: "What a beautiful house!",
    practiceExamples: [
      {
        kannada: "ಎಕ್ಕಾಗ ವಾಹ!",
        roman: "Ekkag vah!",
        english: "What fun!",
        explanation: "Exclamatory with ವಾಹ!",
      },
      {
        kannada: "ಏತೋ ಕೆಟ್ಟ ದಿನ!",
        roman: "Eto ketta din!",
        english: "What a bad day!",
        explanation: "Exclamatory expressing sorrow",
      },
      {
        kannada: "ಸ್ಫುರೆ ಪ್ರತಿಭೆ!",
        roman: "Sphure pratibbhe!",
        english: "What talent!",
        explanation: "Exclamatory expressing admiration",
      },
      {
        kannada: "ಅಯ್ಯೋ ನಿನ್ನನು ಏನಾದೇ?",
        roman: "Ayyo ninnanu enadi?",
        english: "Oh no, what happened to you?",
        explanation: "Exclamatory expressing concern",
      },
    ],
    commonMistakes: [
      {
        incorrect: "ಯಾ ಸುಂದರ ಮನೆ. (period instead of exclamation)",
        correct: "ಯಾ ಸುಂದರ ಮನೆ! (with exclamation mark)",
        explanation:
          "Exclamatory sentences must end with ! to show strong emotion.",
      },
    ],
    transformationExercises: [
      {
        instruction: "Convert statement to exclamatory",
        exampleInstructionKannada: "ಹೇಳಿಕೆಯನ್ನು ವಿಸ್ಮಯಾರ್ಥಕಕ್ಕೆ ಬದಲಾಯಿಸಿ",
        exampleInput: "ಇದು ಸುಂದರ ಮನೆ",
        exampleOutput: "ಯಾ ಸುಂದರ ಮನೆ!",
      },
    ],
    mcqQuestions: [
      {
        question: "Which is an exclamatory sentence?",
        options: ["ಇದು ಸುಂದರ ಮನೆ (statement)", "ಇದು ಸುಂದರ ಮನೆ? (question)", "ಯಾ ಸುಂದರ ಮನೆ! (exclamatory)", "ಸುಂದರ ಮನೆ ಅಲ್ಲ (negative)"],
        correctAnswer: "ಯಾ ಸುಂದರ ಮನೆ! (exclamatory)",
        explanation:
          "Only this sentence shows strong emotion with ! and expressive words like ಯಾ.",
      },
    ],
    summary:
      "Exclamatory sentences express strong emotion or surprise. End with ! and use emotional words.",
    prompt:
      "Exclamatory sentences are passionate — they burst with emotion!",
  },
];

// COMBINE ALL CHAPTERS
export const LEVEL_6_DATA: GrammarLesson[] = [
  ...chapter1Lessons,
  ...chapter2Lessons,
  ...chapter3Lessons,
  ...chapter4Lessons,
  ...chapter5Lessons,
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getLevelSixLesson(id: string): GrammarLesson | undefined {
  return LEVEL_6_DATA.find((lesson) => lesson.id === id);
}

export function getLevelSixChapter(chapterId: string): GrammarLesson[] {
  return LEVEL_6_DATA.filter((lesson) => lesson.chapterId === chapterId);
}

export function getLevelSixChapterTitle(
  chapterId: string
): string | undefined {
  const lesson = LEVEL_6_DATA.find((l) => l.chapterId === chapterId);
  return lesson?.chapterTitle;
}

export function getAllLevelSixLessons(): GrammarLesson[] {
  return LEVEL_6_DATA;
}

export function getLevelSixLessonsBySkill(skill: string): GrammarLesson[] {
  return LEVEL_6_DATA.filter((lesson) => lesson.skill === skill);
}

export const LEVEL_6_ROMAN_MAP: Record<string, string> = {
  "L6-C01-L01": "common-nouns",
  "L6-C01-L02": "proper-nouns",
  "L6-C01-L03": "masculine-nouns",
  "L6-C01-L04": "feminine-nouns",
  "L6-C01-L05": "neuter-nouns",
  "L6-C01-L06": "singular-nouns",
  "L6-C01-L07": "plural-nouns",
  "L6-C01-L08": "nominative-case",
  "L6-C01-L09": "accusative-case",
  "L6-C02-L01": "basic-adjectives",
  "L6-C02-L02": "quality-adjectives",
  "L6-C02-L03": "quantity-adjectives",
  "L6-C02-L04": "demonstrative-adjectives",
  "L6-C02-L05": "interrogative-adjectives",
  "L6-C02-L06": "gender-number-agreement",
  "L6-C02-L07": "comparative-adjectives",
  "L6-C02-L08": "superlative-adjectives",
  "L6-C03-L01": "personal-pronouns",
  "L6-C03-L02": "possessive-pronouns",
  "L6-C03-L03": "third-person-pronouns",
  "L6-C03-L04": "relative-pronouns",
  "L6-C03-L05": "interrogative-pronouns",
  "L6-C03-L06": "demonstrative-pronouns",
  "L6-C03-L07": "reflexive-pronouns",
  "L6-C03-L08": "indefinite-pronouns",
  "L6-C04-L01": "verb-introduction",
  "L6-C04-L02": "present-tense",
  "L6-C04-L03": "past-tense",
  "L6-C04-L04": "future-tense",
  "L6-C04-L05": "transitive-verbs",
  "L6-C04-L06": "intransitive-verbs",
  "L6-C04-L07": "verb-agreement",
  "L6-C04-L08": "imperative-verbs",
  "L6-C04-L09": "negation-verbs",
  "L6-C04-L10": "ability-verbs",
  "L6-C05-L01": "sentence-basics",
  "L6-C05-L02": "simple-sentences",
  "L6-C05-L03": "compound-sentences",
  "L6-C05-L04": "complex-sentences",
  "L6-C05-L05": "interrogative-sentences",
  "L6-C05-L06": "negative-sentences",
  "L6-C05-L07": "exclamatory-sentences",
};

export default LEVEL_6_DATA;
