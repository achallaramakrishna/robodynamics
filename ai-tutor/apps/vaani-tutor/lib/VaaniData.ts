import { VaaniCoursePayload } from "./VaaniTypes";
import { VAANI_L1_COURSE_LESSONS, VAANI_L1_LESSONS } from "./vaaniLevel1Data";
import { LEVEL_2_DATA } from "./vaaniLevel2Data";
import { LEVEL_3_DATA } from "./vaaniLevel3Data";
import { LEVEL_4_DATA } from "./vaaniLevel4Data";
import { LEVEL_5_DATA } from "./vaaniLevel5Data";
import { LEVEL_6_DATA } from "./vaaniLevel6Data";

// ── Level 2 course-lesson list (matches VaaniCourseClient shape) ──────────────
const VAANI_L2_COURSE_LESSONS = LEVEL_2_DATA.map((seed, index) => ({
  id: seed.id,
  order: index + 1,
  title: seed.title,
  category: seed.category,
  durationMin: 6,
  status: (index < 12 ? "available" : "current") as "available" | "current",
  summary: seed.summary,
  skill: seed.skill,
  baseChar: seed.baseChar,
  matra: seed.matra,
  modifiedChar: seed.modifiedChar,
  wordHindi: seed.wordHindi,
  wordEnglish: seed.wordEnglish,
  boardPreview: { type: "visual", data: { assetPath: seed.assetPath, headline: `${seed.modifiedChar} - ${seed.wordHindi}` } },
  image: seed.assetPath,
  startUrl: `/level-2/lesson/${seed.id}`,
}));

// ── Level 3 course-lesson list ────────────────────────────────────────────────
const VAANI_L3_COURSE_LESSONS = LEVEL_3_DATA.map((seed, index) => ({
  id: seed.id,
  order: index + 1,
  title: seed.title,
  category: seed.category,
  durationMin: 8,
  status: (index < 12 ? "available" : "current") as "available" | "current",
  summary: seed.summary,
  skill: seed.skill,
  boardPreview: { type: "visual", data: { assetPath: seed.assetPath, headline: `${seed.combinedChar} - ${seed.wordHindi}` } },
  image: seed.assetPath,
  startUrl: `/level-3/lesson/${seed.id}`,
}));

// ── Level 4 course-lesson list ────────────────────────────────────────────────
const VAANI_L4_COURSE_LESSONS = LEVEL_4_DATA.map((seed: any, index: number) => ({
  id: seed.id,
  order: index + 1,
  title: seed.title,
  category: seed.category,
  durationMin: 8,
  status: (index < 12 ? "available" : "current") as "available" | "current",
  summary: seed.summary,
  skill: seed.skill,
  boardPreview: { type: "visual", data: { assetPath: seed.assetPath, headline: `${seed.consonant} की बारहखड़ी - ${seed.wordHindi}` } },
  image: seed.assetPath,
  startUrl: `/level-4/lesson/${seed.id}`,
}));

// ── Level 5 course-lesson list ────────────────────────────────────────────────
const VAANI_L5_COURSE_LESSONS = LEVEL_5_DATA.map((seed: any, index: number) => ({
  id: seed.id,
  order: index + 1,
  title: seed.title,
  category: seed.category,
  durationMin: 6,
  status: (index < 10 ? "available" : "current") as "available" | "current",
  summary: seed.summary,
  skill: seed.skill,
  boardPreview: { type: "visual", data: { assetPath: seed.assetPath, headline: seed.sentence } },
  image: seed.assetPath,
  startUrl: `/level-5/lesson/${seed.id}`,
}));

// ── Level 6 course-lesson list ────────────────────────────────────────────────
const VAANI_L6_COURSE_LESSONS = LEVEL_6_DATA.map((seed: any, index: number) => ({
  id: seed.id,
  order: index + 1,
  title: seed.title,
  category: seed.category,
  durationMin: 8,
  status: (index < 11 ? "available" : "current") as "available" | "current",
  summary: seed.summary,
  skill: seed.skill,
  boardPreview: { type: "visual", data: { assetPath: seed.assetPath || "/vaani/grammar-default.svg", headline: `${seed.grammarTopic} · ${seed.grammarTopicHindi}` } },
  image: seed.assetPath || "/vaani/grammar-default.svg",
  startUrl: `/level-6/lesson/${seed.id}`,
}));

export interface VaaniLessonPayload {
  course: {
    title: string;
    grade: string;
    levelSlug: string;
  };
  lesson: {
    id: string;
    chapterId: string;
    chapterTitle: string;
    title: string;
    category: string;
    durationMin: number;
    summary: string;
    xpReward: number;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    // Level 2 optional fields
    modifiedChar?: string;
    modifiedCharSound?: string;
    baseChar?: string;
    matra?: string;
    baseCharSound?: string;
    wordHindi?: string;
    wordEnglish?: string;
    wordRoman?: string;
    // Level 3 optional fields
    consonant1?: string;
    consonant1SoundRoman?: string;
    consonant2?: string;
    consonant2SoundRoman?: string;
    combinedChar?: string;
    combinedSoundRoman?: string;
    halantForm?: string;
    // Level 4 optional fields
    consonant?: string;
    consonantRoman?: string;
    barakhadiRow?: Array<{ syllable: string; sound: string; matra: string }>;
    // Level 5 optional fields
    sentence?: string;
    sentenceRoman?: string;
    sentenceEnglish?: string;
    words?: Array<{ hindi: string; roman: string; english: string }>;
    // Level 6 optional fields
    grammarTopic?: string;
    grammarTopicHindi?: string;
    ruleExplanation?: string;
    ruleExplanationHindi?: string;
  };
  steps: Array<{
    id: string;
    label: string;
    skillTags: Array<"speaking" | "reading" | "writing" | "grammar" | "vocabulary" | "pronunciation">;
    teacherLineHindi?: string;
    teacherLineEnglishBridge?: string;
    tutorText: string;           // English / beginner default
    tutorTextHi?: string;        // Full Hindi (hindi-full mode)
    tutorTextMix?: string;       // Hindi-English mix (hindi-english mode)
    explanation?: {
      title: string;
      body: string;
      mistakeTip?: string;
    };
    board: {
      type:
        | "visual"
        | "text"
        | "interactive"
        | "mcq"
        | "flashcards"
        | "writing"
        | "matchingPairs"
        | "reading_panel"
        | "sequence_activity"
        | "tracing_canvas"
        | "video_player";
      data: {
        assetPath?: string;
        headline?: string;
        expression?: string;
        prompt?: string;
        poem?: string;
        steps?: string[];
        options?: string[];
        answer?: string;
        cards?: Array<{ front: string; back: string }>;
        pairs?: Array<{ left: string; right: string }>;
        items?: string[];
        videoUrl?: string;
        reading?: {
          text: string[];
          wordMeanings?: Array<{ word: string; meaning: string; example: string }>;
          audioUrl?: string;
        };
        vocabs?: Array<{ word: string; meaningHindi: string; meaningEnglish: string; usage: string }>;
        writing?: {
          taskId: string;
          title: string;
          promptHindi: string;
          promptEnglishBridge?: string;
          marks: number;
          expectedStructure: string[];
          modelAnswerHindi: string;
          uploadRequired: boolean;
        };
      };
    };
    practice?: {
      mode: "none" | "typed" | "quiz";
      answer?: string | number;
      hints?: string[];
      questions?: Array<{ prompt: string; answer: string | number }>;
    };
  }>;
  nextLessonUrl?: string;
}

export function buildVaaniCoursePayload(level: string): VaaniCoursePayload {
  const isLevel = level.startsWith("level-") || level.startsWith("l");
  const levelNumber = level.replace("level-", "").replace("l", "");

  if (!isLevel) {
    return {
      course: {
        title: "Vaani Literacy Journey",
        subtitle: "Hindi foundations for confident readers",
        tagline: "Pick a level to begin learning with Vaani",
        color: "#f97316",
        progressPct: 0,
        completedLessons: 0,
        totalLessons: 0,
      },
      lessons: [],
      selectedLesson: {
        id: "welcome",
        order: 1,
        title: "Welcome to Vaani",
        category: "General",
        durationMin: 0,
        status: "available",
        summary: "Choose Level 1 to start with Hindi letters and sounds.",
        skill: "Literacy",
        boardPreview: { type: "visual", data: { headline: "Welcome" } },
        outcomes: ["Choose a level", "Meet the coach", "Begin your first lesson"],
        startUrl: "/",
      },
    };
  }

  // ── Level 2: Matras ──────────────────────────────────────────────────────────
  if (levelNumber === "2") {
    const first = VAANI_L2_COURSE_LESSONS[0];
    return {
      course: {
        title: "Level 2: Matra & Vowel Modifiers",
        subtitle: "Transform consonants using matra marks to build real Hindi words",
        tagline: "36 lessons covering all major vowel matras with tracing and speech practice",
        color: "#8b5cf6",
        progressPct: 0,
        completedLessons: 0,
        totalLessons: VAANI_L2_COURSE_LESSONS.length,
      },
      lessons: VAANI_L2_COURSE_LESSONS,
      selectedLesson: {
        ...first,
        outcomes: [
          "Recognise how matras modify consonant sounds",
          "Trace matra marks with guided writing practice",
          "Build sound-word confidence with quick checks",
        ],
        startUrl: first.startUrl,
      },
    };
  }

  // ── Level 3: Conjuncts ───────────────────────────────────────────────────────
  if (levelNumber === "3") {
    const first = VAANI_L3_COURSE_LESSONS[0];
    return {
      course: {
        title: "Level 3: Consonant Conjuncts",
        subtitle: "Master complex consonant combinations that appear in 60%+ of Hindi words",
        tagline: "38 lessons covering क, त and other conjunct families with visual and speech practice",
        color: "#f59e0b",
        progressPct: 0,
        completedLessons: 0,
        totalLessons: VAANI_L3_COURSE_LESSONS.length,
      },
      lessons: VAANI_L3_COURSE_LESSONS,
      selectedLesson: {
        ...first,
        outcomes: [
          "Observe how two consonants fuse into a conjunct",
          "Recognise conjuncts in real Hindi words",
          "Practice writing conjuncts on the interactive canvas",
        ],
        startUrl: first.startUrl,
      },
    };
  }

  // ── Level 4: Barakhadi ───────────────────────────────────────────────────────
  if (levelNumber === "4") {
    const first = VAANI_L4_COURSE_LESSONS[0];
    return {
      course: {
        title: "Level 4: Barakhadi",
        subtitle: "Master the full syllabic matrix — every consonant with every vowel sound",
        tagline: "36 lessons covering all 33 Hindi consonants with their complete 12-sound barakhadi rows",
        color: "#6366f1",
        progressPct: 0,
        completedLessons: 0,
        totalLessons: VAANI_L4_COURSE_LESSONS.length,
      },
      lessons: VAANI_L4_COURSE_LESSONS,
      selectedLesson: {
        ...first,
        outcomes: [
          "Read any Hindi syllable instantly using the barakhadi grid",
          "Recognise all 12 vowel sounds of every consonant",
          "Build words confidently from syllables",
        ],
        startUrl: first.startUrl,
      },
    };
  }

  // ── Level 5: Sentences ───────────────────────────────────────────────────────
  if (levelNumber === "5") {
    const first = VAANI_L5_COURSE_LESSONS[0];
    return {
      course: {
        title: "Level 5: Simple Sentences",
        subtitle: "Read and understand real Hindi sentences — the payoff of Levels 1–4",
        tagline: "30 lessons moving from 2-word sentences to full My World stories",
        color: "#10b981",
        progressPct: 0,
        completedLessons: 0,
        totalLessons: VAANI_L5_COURSE_LESSONS.length,
      },
      lessons: VAANI_L5_COURSE_LESSONS,
      selectedLesson: {
        ...first,
        outcomes: [
          "Read 2-word and 3-word Hindi sentences aloud",
          "Understand Subject-Object-Verb sentence order",
          "Express yourself with simple Hindi sentences",
        ],
        startUrl: first.startUrl,
      },
    };
  }

  // ── Level 6: Grammar Essentials ────────────────────────────────────────────
  if (levelNumber === "6") {
    const first = VAANI_L6_COURSE_LESSONS[0];
    return {
      course: {
        title: "Level 6: Grammar Essentials",
        subtitle: "Master parts of speech, conjugation, and sentence construction",
        tagline: "42 lessons covering nouns, adjectives, verbs, pronouns, and complex sentences",
        color: "#8b5cf6",
        progressPct: 0,
        completedLessons: 0,
        totalLessons: VAANI_L6_COURSE_LESSONS.length,
      },
      lessons: VAANI_L6_COURSE_LESSONS,
      selectedLesson: {
        ...first,
        outcomes: [
          "Understand parts of speech (nouns, adjectives, verbs, pronouns)",
          "Master verb conjugation and tense formation",
          "Construct grammatically correct Hindi sentences",
        ],
        startUrl: first.startUrl,
      },
    };
  }

  // ── Levels 7+ placeholder ────────────────────────────────────────────────────
  if (levelNumber !== "1") {
    return {
      course: {
        title: `Level ${levelNumber}: Coming Soon`,
        subtitle: "Next literacy stage in production",
        tagline: "Levels 1–6 are in development. More levels are on the way",
        color: "#64748b",
        progressPct: 0,
        completedLessons: 0,
        totalLessons: 0,
      },
      lessons: [],
      selectedLesson: {
        id: `level-${levelNumber}-coming-soon`,
        order: 1,
        title: `Level ${levelNumber} is being prepared`,
        category: "Mastery",
        durationMin: 0,
        status: "locked",
        summary: "We are polishing the next stage of Vaani. Levels 1–6 are in development right now.",
        skill: "Mastery",
        boardPreview: { type: "visual", data: { headline: "Coming Soon" } },
        outcomes: ["Complete Levels 1–6", "Build reading confidence", "Return for the next release"],
        startUrl: "/level-1",
      },
    };
  }

  const selectedLesson = VAANI_L1_COURSE_LESSONS[0];

  return {
    course: {
      title: "Level 1: Hindi Akshar Launch",
      subtitle: "Swar and early vyanjan with tracing, visuals, and quick checks",
      tagline: "A public-ready alphabet path for first-time Hindi readers",
      color: "#f97316",
      progressPct: 0,
      completedLessons: 0,
      totalLessons: VAANI_L1_COURSE_LESSONS.length,
    },
    lessons: VAANI_L1_COURSE_LESSONS,
    selectedLesson: {
      ...selectedLesson,
      outcomes: [
        "Recognize Hindi letters through bright visual anchors",
        "Trace every letter with guided writing practice",
        "Build sound-word confidence through quick checks",
      ],
      startUrl: selectedLesson.startUrl || "/level-1/lesson/L1-C01-L01",
    },
  };
}

// ── Level 2 lesson map ────────────────────────────────────────────────────────
const VAANI_L2_LESSONS: Record<string, VaaniLessonPayload> = Object.fromEntries(
  LEVEL_2_DATA.map((seed, index) => [
    seed.id,
    {
      course: { title: "Vaani AI Level 2", grade: "2", levelSlug: "level-2" },
      lesson: {
        id: seed.id,
        chapterId: seed.chapterId,
        chapterTitle: seed.chapterTitle,
        title: seed.title,
        category: seed.category,
        durationMin: 6,
        summary: seed.summary,
        xpReward: 70,
        difficulty: "Intermediate" as const,
        // Level 2-specific fields read by VaaniLessonClient
        assetPath: seed.assetPath,
        baseChar: seed.baseChar,
        baseSoundRoman: seed.baseSoundRoman,
        matra: seed.matra,
        matraSoundRoman: seed.matraSoundRoman,
        modifiedChar: seed.modifiedChar,
        modifiedSoundRoman: seed.modifiedSoundRoman,
        wordHindi: seed.wordHindi,
        wordEnglish: seed.wordEnglish,
        wordRoman: seed.wordRoman,
      },
      steps: [
        // Step 1: Visual anchor — see the word image
        {
          id: `${seed.id}_observe`,
          label: "See the Word",
          skillTags: ["reading", "vocabulary"] as Array<"reading" | "vocabulary" | "pronunciation" | "writing" | "speaking" | "grammar">,
          tutorText: `${seed.modifiedChar} — ${seed.wordHindi} means "${seed.wordEnglish}"! Look at the picture and say the word aloud: ${seed.wordRoman}!`,
          board: {
            type: "visual" as const,
            data: {
              assetPath: seed.assetPath,
              headline: `${seed.modifiedChar} — ${seed.wordHindi}`,
              prompt: seed.prompt,
            },
          },
        },
        // Step 2: Observe the matra transformation
        {
          id: `${seed.id}_compare`,
          label: "Observe the Matra",
          skillTags: ["reading", "vocabulary", "pronunciation"],
          tutorText: `Watch how ${seed.baseChar} changes when we add the ${seed.matra} matra! ${seed.prompt}`,
          board: {
            type: "flashcards",
            data: {
              assetPath: seed.assetPath,
              headline: `${seed.baseChar} + ${seed.matra} = ${seed.modifiedChar}`,
              expression: "matra_comparison",
              prompt: seed.prompt,
            },
          },
        },
        // Step 2: Trace the matra mark
        {
          id: `${seed.id}_trace`,
          label: "Trace the Matra",
          skillTags: ["writing", "pronunciation"],
          tutorText: `Now trace the ${seed.matra} matra mark! Say ${seed.modifiedChar} (${seed.modifiedSoundRoman}) as you draw!`,
          board: {
            type: "tracing_canvas",
            data: {
              assetPath: seed.assetPath,
              headline: `Trace ${seed.matra}`,
              expression: seed.matra,
              prompt: `Trace the matra and say ${seed.modifiedSoundRoman}!`,
            },
          },
        },
        // Step 3: Word gallery — words using this matra (with images)
        {
          id: `${seed.id}_gallery`,
          label: "Word Gallery",
          skillTags: ["reading", "vocabulary"],
          tutorText: `Great! The ${seed.matra} matra creates the "${seed.matraSoundRoman}" sound. The word ${seed.wordHindi} means "${seed.wordEnglish}"!`,
          board: {
            type: "flashcards",
            data: {
              headline: `Words with ${seed.modifiedChar} (${seed.modifiedSoundRoman})`,
              prompt: "Tap each card to flip and hear the word!",
              cards: [
                { image: seed.assetPath, emoji: seed.modifiedChar, word: seed.wordHindi, english: seed.wordEnglish, front: `${seed.modifiedChar} ${seed.wordHindi}`, back: seed.wordEnglish },
                { image: LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].assetPath, emoji: LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].modifiedChar, word: LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].wordHindi, english: LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].wordEnglish, front: `${LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].modifiedChar} ${LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].wordHindi}`, back: LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].wordEnglish },
              ],
            },
          },
        },
        // Step 4: Match character to word
        {
          id: `${seed.id}_match`,
          label: "Match the Pair",
          skillTags: ["reading", "recall"],
          tutorText: `Now match each matra character to its example word!`,
          board: {
            type: "matchingPairs",
            data: {
              headline: "Match the character to its word",
              prompt: "Tap a character, then tap its matching word!",
              pairs: [
                { left: seed.modifiedChar, right: seed.wordHindi, rightImage: seed.assetPath },
                {
                  left: LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].modifiedChar,
                  right: LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].wordHindi,
                  rightImage: LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].assetPath,
                },
                {
                  left: LEVEL_2_DATA[(index + 2) % LEVEL_2_DATA.length].modifiedChar,
                  right: LEVEL_2_DATA[(index + 2) % LEVEL_2_DATA.length].wordHindi,
                  rightImage: LEVEL_2_DATA[(index + 2) % LEVEL_2_DATA.length].assetPath,
                },
              ],
            },
          },
        },
        // Step 5: MCQ — which word uses this matra (with image)
        {
          id: `${seed.id}_quiz1`,
          label: "Quick Check 1",
          skillTags: ["reading", "recall"],
          tutorText: `Quiz time! Look at the picture — which Hindi word matches? 🌟`,
          board: {
            type: "mcq",
            data: {
              headline: `Which word has the ${seed.matra} matra?`,
              prompt: `Look at the picture and find the matching Hindi word!`,
              questionImage: seed.assetPath,
              questionWord: seed.modifiedChar,
              questionEnglish: seed.wordEnglish,
              options: [
                seed.wordHindi,
                LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].wordHindi,
                LEVEL_2_DATA[(index + 2) % LEVEL_2_DATA.length].wordHindi,
                LEVEL_2_DATA[(index + 3) % LEVEL_2_DATA.length].wordHindi,
              ],
              answer: seed.wordHindi,
            },
          },
        },
        // Step 6: MCQ — identify the modified character
        {
          id: `${seed.id}_quiz2`,
          label: "Quick Check 2",
          skillTags: ["reading", "recall"],
          tutorText: `Last check! ${seed.baseChar} + ${seed.matra} makes which character? 🎯`,
          board: {
            type: "mcq",
            data: {
              headline: `${seed.baseChar} + ${seed.matra} = ?`,
              prompt: `Which character is formed when we add the ${seed.matra} matra to ${seed.baseChar}?`,
              questionImage: seed.assetPath,
              questionWord: seed.wordHindi,
              questionEnglish: seed.wordEnglish,
              options: [
                seed.modifiedChar,
                LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].modifiedChar,
                LEVEL_2_DATA[(index + 2) % LEVEL_2_DATA.length].modifiedChar,
                LEVEL_2_DATA[(index + 3) % LEVEL_2_DATA.length].modifiedChar,
              ],
              optionImages: [
                seed.assetPath,
                LEVEL_2_DATA[(index + 1) % LEVEL_2_DATA.length].assetPath,
                LEVEL_2_DATA[(index + 2) % LEVEL_2_DATA.length].assetPath,
                LEVEL_2_DATA[(index + 3) % LEVEL_2_DATA.length].assetPath,
              ],
              answer: seed.modifiedChar,
            },
          },
        },
      ],
      nextLessonUrl: index < LEVEL_2_DATA.length - 1
        ? `/level-2/lesson/${LEVEL_2_DATA[index + 1].id}`
        : `/level-2`,
    } as VaaniLessonPayload,
  ])
);

// ── Level 3 lesson map ────────────────────────────────────────────────────────
const VAANI_L3_LESSONS: Record<string, VaaniLessonPayload> = Object.fromEntries(
  LEVEL_3_DATA.map((seed, index) => [
    seed.id,
    {
      course: { title: "Vaani AI Level 3", grade: "3", levelSlug: "level-3" },
      lesson: {
        id: seed.id,
        chapterId: seed.chapterId,
        chapterTitle: seed.chapterTitle,
        title: seed.title,
        category: seed.category,
        durationMin: 8,
        summary: seed.summary,
        xpReward: 80,
        difficulty: "Advanced" as const,
        // Level 3-specific fields read by VaaniLessonClient
        assetPath: seed.assetPath,
        consonant1: seed.consonant1,
        consonant1SoundRoman: seed.consonant1SoundRoman,
        consonant2: seed.consonant2,
        consonant2SoundRoman: seed.consonant2SoundRoman,
        combinedChar: seed.combinedChar,
        combinedSoundRoman: seed.combinedSoundRoman,
        halantForm: seed.halantForm,
        wordHindi: seed.wordHindi,
        wordEnglish: seed.wordEnglish,
        wordRoman: seed.wordRoman,
      },
      steps: [
        // Step 1: Visual anchor — see the conjunct word image
        {
          id: `${seed.id}_observe`,
          label: "See the Word",
          skillTags: ["reading", "vocabulary"] as Array<"reading" | "vocabulary" | "pronunciation" | "writing" | "speaking" | "grammar">,
          tutorText: `${seed.combinedChar} — ${seed.wordHindi} means "${seed.wordEnglish}"! This conjunct appears in many Hindi words. Say: ${seed.wordRoman}!`,
          board: {
            type: "visual" as const,
            data: {
              assetPath: seed.assetPath,
              headline: `${seed.combinedChar} — ${seed.wordHindi}`,
              prompt: seed.prompt,
            },
          },
        },
        // Step 2: Observe the conjunct transformation
        {
          id: `${seed.id}_compare`,
          label: "Observe the Conjunct",
          skillTags: ["reading", "vocabulary", "pronunciation"],
          tutorText: `Watch how ${seed.consonant1} and ${seed.consonant2} join to form ${seed.combinedChar}! ${seed.prompt}`,
          board: {
            type: "flashcards",
            data: {
              headline: `${seed.consonant1} + ${seed.consonant2} = ${seed.combinedChar}`,
              expression: "conjunct_comparison",
              prompt: seed.prompt,
            },
          },
        },
        // Step 2: Recognize the conjunct in words
        {
          id: `${seed.id}_recognize`,
          label: "Recognize the Pattern",
          skillTags: ["reading", "vocabulary"],
          tutorText: `Now spot ${seed.combinedChar} (${seed.combinedSoundRoman}) in real Hindi words!`,
          board: {
            type: "tracing_canvas",
            data: {
              headline: `Spot ${seed.combinedChar} in words`,
              expression: seed.combinedChar,
              prompt: `Find and tap the ${seed.combinedChar} conjunct in the words below!`,
            },
          },
        },
        // Step 3: Word gallery with conjunct examples (with images)
        {
          id: `${seed.id}_gallery`,
          label: "Word Gallery",
          skillTags: ["reading", "vocabulary"],
          tutorText: `The conjunct ${seed.combinedChar} appears in many Hindi words. "${seed.wordHindi}" means "${seed.wordEnglish}"!`,
          board: {
            type: "flashcards",
            data: {
              headline: `Words with ${seed.combinedChar} (${seed.combinedSoundRoman})`,
              prompt: "Tap each card to flip and hear the word!",
              cards: [
                { image: seed.assetPath, emoji: seed.combinedChar, word: seed.wordHindi, english: seed.wordEnglish, front: `${seed.combinedChar} ${seed.wordHindi}`, back: seed.wordEnglish },
                { image: LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].assetPath, emoji: LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].combinedChar, word: LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].wordHindi, english: LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].wordEnglish, front: `${LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].combinedChar} ${LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].wordHindi}`, back: LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].wordEnglish },
              ],
            },
          },
        },
        // Step 4: Match conjunct to word
        {
          id: `${seed.id}_match`,
          label: "Match the Pair",
          skillTags: ["reading", "recall"],
          tutorText: `Match each conjunct to the word that contains it!`,
          board: {
            type: "matchingPairs",
            data: {
              headline: "Match the conjunct to its word",
              prompt: "Tap a conjunct, then tap the word that contains it!",
              pairs: [
                { left: seed.combinedChar, right: seed.wordHindi },
                { left: LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].combinedChar, right: LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].wordHindi },
                { left: LEVEL_3_DATA[(index + 2) % LEVEL_3_DATA.length].combinedChar, right: LEVEL_3_DATA[(index + 2) % LEVEL_3_DATA.length].wordHindi },
              ],
            },
          },
        },
        // Step 5: MCQ — identify the word containing this conjunct (with image)
        {
          id: `${seed.id}_quiz1`,
          label: "Quick Check 1",
          skillTags: ["reading", "recall"],
          tutorText: `Quiz time! Look at the picture — which word uses the conjunct ${seed.combinedChar}? 🌟`,
          board: {
            type: "mcq",
            data: {
              headline: `Which word has the conjunct ${seed.combinedChar}?`,
              prompt: `Look at the picture and find the matching Hindi word!`,
              questionImage: seed.assetPath,
              questionWord: seed.combinedChar,
              questionEnglish: seed.wordEnglish,
              options: [
                seed.wordHindi,
                LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].wordHindi,
                LEVEL_3_DATA[(index + 2) % LEVEL_3_DATA.length].wordHindi,
                LEVEL_3_DATA[(index + 3) % LEVEL_3_DATA.length].wordHindi,
              ],
              answer: seed.wordHindi,
            },
          },
        },
        // Step 6: MCQ — identify the conjunct
        {
          id: `${seed.id}_quiz2`,
          label: "Quick Check 2",
          skillTags: ["reading", "recall"],
          tutorText: `Last one! ${seed.consonant1} + ${seed.consonant2} joins to make which conjunct? 🎯`,
          board: {
            type: "mcq",
            data: {
              headline: `${seed.consonant1} + ${seed.consonant2} = ?`,
              prompt: `Which conjunct is formed when ${seed.consonant1} and ${seed.consonant2} combine?`,
              options: [
                seed.combinedChar,
                LEVEL_3_DATA[(index + 1) % LEVEL_3_DATA.length].combinedChar,
                LEVEL_3_DATA[(index + 2) % LEVEL_3_DATA.length].combinedChar,
                LEVEL_3_DATA[(index + 3) % LEVEL_3_DATA.length].combinedChar,
              ],
              answer: seed.combinedChar,
            },
          },
        },
      ],
      nextLessonUrl: index < LEVEL_3_DATA.length - 1
        ? `/level-3/lesson/${LEVEL_3_DATA[index + 1].id}`
        : `/level-3`,
    } as VaaniLessonPayload,
  ])
);

// ── Level 4 lesson map ────────────────────────────────────────────────────────
const VAANI_L4_LESSONS: Record<string, VaaniLessonPayload> = Object.fromEntries(
  LEVEL_4_DATA.map((seed, index) => [
    seed.id,
    {
      course: { title: "Vaani AI Level 4", grade: "4", levelSlug: "level-4" },
      lesson: {
        id: seed.id,
        chapterId: seed.chapterId,
        chapterTitle: seed.chapterTitle,
        title: seed.title,
        category: seed.category,
        durationMin: 8,
        summary: seed.summary,
        xpReward: 90,
        difficulty: "Advanced" as const,
        // Level 4-specific fields read by VaaniLessonClient
        assetPath: seed.assetPath,
        consonant: seed.consonant,
        consonantRoman: seed.consonantRoman,
        barakhadiRow: seed.barakhadiRow,
        wordHindi: seed.wordHindi,
        wordEnglish: seed.wordEnglish,
        wordRoman: seed.wordRoman,
      },
      steps: (() => {
        // Review seeds (consonant contains & or , or category is Review/Consolidation)
        const isReview = seed.category === "Review Practice" || seed.category === "Consolidation" ||
          seed.consonant.includes("&") || seed.consonant.includes(",");
        if (isReview) {
          return [
            {
              id: `${seed.id}_overview`,
              label: "Review Overview",
              skillTags: ["reading", "vocabulary", "pronunciation"] as Array<"reading" | "vocabulary" | "pronunciation" | "writing" | "speaking" | "grammar">,
              tutorText: `Great work so far! Let's review what you've learned. ${seed.prompt}`,
              board: {
                type: "flashcards" as const,
                data: {
                  headline: seed.title,
                  prompt: seed.summary,
                  cards: seed.exampleWords.map(w => ({ front: w.hindi, back: `${w.english} (${w.roman})` })),
                },
              },
            },
            {
              id: `${seed.id}_quiz`,
              label: "Review Quiz",
              skillTags: ["reading", "recall"] as Array<"reading" | "recall" | "vocabulary" | "pronunciation" | "writing" | "speaking" | "grammar">,
              tutorText: `Quick quiz! Let's check what you remember.`,
              board: {
                type: "mcq" as const,
                data: {
                  headline: `Review: ${seed.consonant}`,
                  prompt: `Which word does NOT use the consonant ${seed.consonant.split(" ")[0]}?`,
                  options: [
                    seed.exampleWords[0]?.hindi || seed.wordHindi,
                    seed.exampleWords[1]?.hindi || LEVEL_4_DATA[(index + 1) % LEVEL_4_DATA.length].wordHindi,
                    LEVEL_4_DATA[(index + 5) % LEVEL_4_DATA.length].wordHindi,
                    seed.exampleWords[2]?.hindi || seed.wordHindi,
                  ],
                  answer: LEVEL_4_DATA[(index + 5) % LEVEL_4_DATA.length].wordHindi,
                },
              },
            },
            {
              id: `${seed.id}_celebrate`,
              label: "Review Complete!",
              skillTags: ["reading", "vocabulary"] as Array<"reading" | "vocabulary" | "pronunciation" | "writing" | "speaking" | "grammar">,
              tutorText: `Excellent! You've mastered the barakhadi for ${seed.consonant}. Keep going! 🌟`,
              board: {
                type: "visual" as const,
                data: {
                  assetPath: seed.assetPath,
                  headline: `Barakhadi Review: ${seed.consonant}`,
                  prompt: seed.summary,
                },
              },
            },
          ];
        }
        return [
        // Step 1: Visual anchor — see the consonant word image
        {
          id: `${seed.id}_observe`,
          label: "See the Word",
          skillTags: ["reading", "vocabulary"] as Array<"reading" | "vocabulary" | "pronunciation" | "writing" | "speaking" | "grammar">,
          tutorText: `${seed.consonant} (${seed.consonantRoman}) — ${seed.wordHindi} means "${seed.wordEnglish}"! Look at the picture and say the word!`,
          board: {
            type: "visual" as const,
            data: {
              assetPath: seed.assetPath,
              headline: `${seed.consonant} — ${seed.wordHindi}`,
              prompt: seed.prompt,
            },
          },
        },
        // Step 2: Observe the barakhadi grid
        {
          id: `${seed.id}_grid`,
          label: "Explore the Barakhadi",
          skillTags: ["reading", "vocabulary", "pronunciation"] as Array<"reading" | "vocabulary" | "pronunciation" | "writing" | "speaking" | "grammar">,
          tutorText: `Let's explore all 12 syllable forms of ${seed.consonant}! ${seed.prompt}`,
          board: {
            type: "flashcards" as const,
            data: {
              headline: `${seed.consonant} की बारहखड़ी (Barakhadi of ${seed.consonantRoman})`,
              expression: "barakhadi_grid",
              prompt: "Tap each syllable to hear how it sounds!",
            },
          },
        },
        // Step 2: Word gallery with consonant examples (with images)
        {
          id: `${seed.id}_gallery`,
          label: "Word Gallery",
          skillTags: ["reading", "vocabulary"],
          tutorText: `The consonant ${seed.consonant} (${seed.consonantRoman}) appears in many Hindi words. "${seed.wordHindi}" means "${seed.wordEnglish}"!`,
          board: {
            type: "flashcards",
            data: {
              headline: `Words with ${seed.consonant} (${seed.consonantRoman})`,
              prompt: "Tap each card to flip and hear the word!",
              cards: seed.exampleWords.slice(0, 2).map((w, wi) => ({
                image: wi === 0 ? seed.assetPath : (LEVEL_4_DATA[(index + 1) % LEVEL_4_DATA.length]?.assetPath || seed.assetPath),
                emoji: seed.consonant,
                word: w.hindi,
                english: w.english,
                front: `${seed.consonant} ${w.hindi}`,
                back: w.english,
              })),
            },
          },
        },
        // Step 3: Match syllables to example words
        {
          id: `${seed.id}_match`,
          label: "Match the Pair",
          skillTags: ["reading", "recall"],
          tutorText: `Match each syllable form to the word that contains it!`,
          board: {
            type: "matchingPairs",
            data: {
              headline: `Match syllables of ${seed.consonant}`,
              prompt: "Tap a syllable, then tap the word that contains it!",
              pairs: [
                { left: seed.barakhadiRow[0].syllable, right: seed.exampleWords[0].hindi },
                { left: seed.barakhadiRow[1].syllable, right: seed.exampleWords[1].hindi },
                { left: seed.barakhadiRow[2].syllable, right: seed.exampleWords[2]?.hindi || seed.wordHindi },
              ],
            },
          },
        },
        // Step 4: MCQ — identify the consonant
        {
          id: `${seed.id}_quiz1`,
          label: "Quick Check 1",
          skillTags: ["reading", "recall"],
          tutorText: `Quiz time! Which consonant is this? 🌟`,
          board: {
            type: "mcq",
            data: {
              headline: `Which consonant is this: ${seed.consonant}?`,
              prompt: `The consonant ${seed.consonant} sounds like "${seed.consonantRoman}". What is its name?`,
              options: [
                seed.consonant,
                LEVEL_4_DATA[(index + 1) % LEVEL_4_DATA.length].consonant,
                LEVEL_4_DATA[(index + 2) % LEVEL_4_DATA.length].consonant,
                LEVEL_4_DATA[(index + 3) % LEVEL_4_DATA.length].consonant,
              ],
              answer: seed.consonant,
            },
          },
        },
        // Step 5: MCQ — identify the syllable form
        {
          id: `${seed.id}_quiz2`,
          label: "Quick Check 2",
          skillTags: ["reading", "pronunciation"],
          tutorText: `Which syllable form sounds like "${seed.barakhadiRow[1].sound}"? 🎯`,
          board: {
            type: "mcq",
            data: {
              headline: `Identify the syllable form`,
              prompt: `Which syllable form of ${seed.consonant} sounds like "${seed.barakhadiRow[1].sound}"?`,
              options: [
                seed.barakhadiRow[0].syllable,
                seed.barakhadiRow[1].syllable,
                seed.barakhadiRow[2].syllable,
                seed.barakhadiRow[3].syllable,
              ],
              answer: seed.barakhadiRow[1].syllable,
            },
          },
        },
        // Step 6: MCQ — pronunciation practice (with image)
        {
          id: `${seed.id}_quiz3`,
          label: "Final Challenge",
          skillTags: ["pronunciation", "recall"],
          tutorText: `Last one! Look at the picture — which word uses the ${seed.consonant} consonant? 🏆`,
          board: {
            type: "mcq",
            data: {
              headline: `Which word has ${seed.consonant}?`,
              prompt: `Look at the picture and find the word with ${seed.consonant}!`,
              questionImage: seed.assetPath,
              questionWord: seed.consonant,
              questionEnglish: seed.wordEnglish,
              options: [
                seed.wordHindi,
                LEVEL_4_DATA[(index + 1) % LEVEL_4_DATA.length].wordHindi,
                LEVEL_4_DATA[(index + 2) % LEVEL_4_DATA.length].wordHindi,
                LEVEL_4_DATA[(index + 3) % LEVEL_4_DATA.length].wordHindi,
              ],
              answer: seed.wordHindi,
            },
          },
        },
        ]; // end normal barakhadi steps
      })(), // end IIFE
      nextLessonUrl: index < LEVEL_4_DATA.length - 1
        ? `/level-4/lesson/${LEVEL_4_DATA[index + 1].id}`
        : `/level-4`,
    } as VaaniLessonPayload,
  ])
);

// ── Level 5 lesson map ────────────────────────────────────────────────────────
const VAANI_L5_LESSONS: Record<string, VaaniLessonPayload> = Object.fromEntries(
  LEVEL_5_DATA.map((seed, index) => [
    seed.id,
    {
      course: { title: "Vaani AI Level 5", grade: "5", levelSlug: "level-5" },
      lesson: {
        id: seed.id,
        chapterId: seed.chapterId,
        chapterTitle: seed.chapterTitle,
        title: seed.title,
        category: seed.category,
        durationMin: 8,
        summary: seed.summary,
        xpReward: 100,
        difficulty: "Advanced" as const,
        // Level 5-specific fields read by VaaniLessonClient
        assetPath: seed.assetPath,
        sentence: seed.sentence,
        sentenceRoman: seed.sentenceRoman,
        sentenceEnglish: seed.sentenceEnglish,
        words: seed.words,
        // Map sentence fields to the generic word* keys VaaniLessonClient uses
        // for display (lessonWord, lessonWordEng, lessonWordRoman)
        wordHindi: seed.sentence,
        wordEnglish: seed.sentenceEnglish,
        wordRoman: seed.sentenceRoman,
      },
      steps: [
        // Step 1: Visual anchor — see the sentence scene image
        {
          id: `${seed.id}_observe`,
          label: "See the Scene",
          skillTags: ["reading", "vocabulary"] as Array<"reading" | "vocabulary" | "pronunciation" | "writing" | "speaking" | "grammar">,
          tutorText: `Look at this picture! The sentence "${seed.sentence}" means "${seed.sentenceEnglish}". ${seed.prompt}`,
          board: {
            type: "visual" as const,
            data: {
              assetPath: seed.assetPath,
              headline: seed.sentence,
              prompt: `"${seed.sentenceEnglish}" — ${seed.sentenceRoman}`,
            },
          },
        },
        // Step 2: Read the sentence
        {
          id: `${seed.id}_reader`,
          label: "Read the Sentence",
          skillTags: ["reading", "vocabulary", "pronunciation"],
          tutorText: `Let's read this sentence together: "${seed.sentence}" — it means "${seed.sentenceEnglish}"! ${seed.prompt}`,
          board: {
            type: "flashcards",
            data: {
              headline: `Sentence: ${seed.sentence}`,
              expression: "sentence_reader",
              prompt: "Tap the sentence or each word to hear it!",
            },
          },
        },
        // Step 2: Word gallery (with sentence image on first card)
        {
          id: `${seed.id}_gallery`,
          label: "Word Gallery",
          skillTags: ["reading", "vocabulary"],
          tutorText: `Let's look at each word in the sentence. "${seed.sentence}" means "${seed.sentenceEnglish}"!`,
          board: {
            type: "flashcards",
            data: {
              headline: `Words from: ${seed.sentence}`,
              prompt: "Tap each card to flip and hear the word!",
              cards: seed.words.map((w, i) => ({
                image: i === 0 ? seed.assetPath : undefined,
                emoji: "📝",
                word: w.hindi,
                english: w.english,
                front: w.hindi,
                back: w.english,
              })),
            },
          },
        },
        // Step 3: Match words to meanings
        {
          id: `${seed.id}_match`,
          label: "Match the Meanings",
          skillTags: ["reading", "vocabulary"],
          tutorText: `Match each word to its English meaning!`,
          board: {
            type: "matchingPairs",
            data: {
              headline: `Match words to meanings`,
              prompt: "Tap a word, then tap its English meaning!",
              pairs: seed.words.slice(0, 3).map(w => ({
                left: w.hindi,
                right: w.english,
              })),
            },
          },
        },
        // Step 4: First MCQ from lesson (with image)
        {
          id: `${seed.id}_quiz1`,
          label: "Quick Check 1",
          skillTags: ["reading", "recall"],
          tutorText: `Quiz time! Look at the picture and answer! 🌟`,
          board: {
            type: "mcq",
            data: (() => {
              if (seed.mcqs?.[0]) {
                return {
                  headline: seed.mcqs[0].question,
                  prompt: seed.mcqs[0].question,
                  questionImage: seed.assetPath,
                  questionWord: seed.sentence,
                  questionEnglish: seed.sentenceEnglish,
                  options: seed.mcqs[0].options,
                  answer: seed.mcqs[0].answer,
                };
              }
              // Auto-generate: "What does this sentence mean?"
              const distractors = seed.words.slice(0, 3).map((w: any) => w.english);
              while (distractors.length < 3) distractors.push(["Something else", "I don't know", "Other"][distractors.length] || "Other");
              return {
                headline: `What does "${seed.sentenceRoman}" mean?`,
                prompt: "Look at the picture — choose the correct meaning!",
                questionImage: seed.assetPath,
                questionWord: seed.sentence,
                questionEnglish: seed.sentenceEnglish,
                options: [distractors[0], distractors[1], seed.sentenceEnglish, distractors[2]],
                answer: seed.sentenceEnglish,
              };
            })(),
          },
        },
        // Step 5: Second MCQ from lesson — with image (if available)
        {
          id: `${seed.id}_quiz2`,
          label: "Quick Check 2",
          skillTags: ["reading", "vocabulary"],
          tutorText: `Question 2! Look at the picture and figure it out! 🎯`,
          board: {
            type: "mcq",
            data: (() => {
              if (seed.mcqs?.[1]) {
                return {
                  headline: seed.mcqs[1].question,
                  prompt: seed.mcqs[1].question,
                  questionImage: seed.assetPath,
                  questionWord: seed.sentence,
                  questionEnglish: seed.sentenceEnglish,
                  options: seed.mcqs[1].options,
                  answer: seed.mcqs[1].answer,
                };
              }
              // Auto-generate: "Which Hindi word means [English]?"
              const w0 = seed.words[0];
              if (!w0) {
                return {
                  headline: `How do you say "${seed.sentenceEnglish}" in Hindi?`,
                  prompt: "Look at the picture — choose the correct Hindi sentence!",
                  questionImage: seed.assetPath,
                  questionWord: seed.sentence,
                  options: [seed.sentence, "नमस्ते।", "धन्यवाद।", "ठीक है।"],
                  answer: seed.sentence,
                };
              }
              return {
                headline: `Which Hindi word means "${w0.english}"?`,
                prompt: "Find the correct Hindi word!",
                questionImage: seed.assetPath,
                questionWord: seed.sentence,
                questionEnglish: seed.sentenceEnglish,
                options: [
                  seed.words[1]?.hindi || "कुछ",
                  w0.hindi,
                  seed.words[2]?.hindi || "कोई",
                  seed.words[3]?.hindi || "यह",
                ],
                answer: w0.hindi,
              };
            })(),
          },
        },
        // Step 6: Grammar / word order tip
        {
          id: `${seed.id}_grammar`,
          label: "Grammar Insight",
          skillTags: ["grammar", "reading"],
          tutorText: `In Hindi, we use Subject → Object → Verb order (SOV), unlike English! 🏆`,
          board: {
            type: "text",
            data: {
              headline: `Hindi Sentence Order`,
              prompt: `This sentence follows Hindi's natural word order. Practice recognizing this pattern in other sentences!`,
            },
          },
        },
      ],
      nextLessonUrl: index < LEVEL_5_DATA.length - 1
        ? `/level-5/lesson/${LEVEL_5_DATA[index + 1].id}`
        : `/level-5`,
    } as VaaniLessonPayload,
  ])
);

// ── Level 6 grammar topic → visual metadata ──────────────────────────────────
const L6_TOPIC_EMOJI: Record<string, string> = {
  "Common Nouns": "🏷️",        "Proper Nouns": "🗺️",
  "Noun Gender": "⚧️",          "Noun Number": "🔢",
  "Descriptive Adjectives": "🎨","Comparative Adjectives": "⚖️",
  "Superlative Adjectives": "🏆","Other Adjective Types": "✳️",
  "Compound Adjectives": "🔗",   "Adjective Position": "📍",
  "Comprehensive Review": "🌟",  "Infinitive Verbs": "⚡",
  "Present Habitual Tense": "🔄","Present Continuous Tense": "▶️",
  "Future Tense": "🔮",          "Present Perfect Tense": "✅",
  "Imperative Mood": "📢",       "Subject-Verb Agreement": "🤝",
  "Transitive & Intransitive Verbs": "↔️","Verb Tenses Review": "📅",
  "Personal Pronouns": "👤",     "Possessive Pronouns": "🔑",
  "Demonstrative Pronouns": "👆","Interrogative Pronouns": "❓",
  "Reflexive Pronouns": "🪞",    "Case Markers": "🔖",
  "Ne Marker": "✏️",             "Ko Marker": "📌",
  "Se Marker": "🔀",             "Pronouns Review": "👥",
  "Simple Sentences": "📝",      "Compound Sentences": "🔗",
  "Complex Sentences": "🌐",     "Question Sentences": "❓",
  "Negative Sentences": "🚫",    "SOV Word Order": "📐",
  "Sentence Patterns": "🔲",     "Synthesis Review": "🎓",
};
const L6_TOPIC_COLOR: Record<string, string> = {
  "Noun": "#f97316", "Adjective": "#8b5cf6", "Verb": "#3b82f6",
  "Pronoun": "#10b981", "Sentence": "#f59e0b", "Review": "#ec4899",
  "Marker": "#06b6d4", "Word Order": "#6366f1",
};
function l6Color(topic: string): string {
  for (const [key, val] of Object.entries(L6_TOPIC_COLOR)) {
    if (topic.includes(key)) return val;
  }
  return "#6366f1";
}

// ── Level 6 lesson map (Grammar Essentials) ──────────────────────────────────
const VAANI_L6_LESSONS: Record<string, VaaniLessonPayload> = Object.fromEntries(
  LEVEL_6_DATA.map((seed: any, index: number) => [
    seed.id,
    {
      course: { title: "Vaani AI Level 6", grade: "6", levelSlug: "level-6" },
      lesson: {
        id: seed.id,
        chapterId: seed.chapterId,
        chapterTitle: seed.chapterTitle,
        title: seed.title,
        category: seed.category,
        durationMin: 8,
        summary: seed.summary,
        xpReward: 100,
        difficulty: "Advanced" as const,
        // Level 6-specific fields
        grammarTopic: seed.grammarTopic,
        grammarTopicHindi: seed.grammarTopicHindi,
        ruleExplanation: seed.ruleExplanation,
        ruleExplanationHindi: seed.ruleExplanationHindi,
        exampleSentenceHindi: seed.exampleSentenceHindi,
        exampleSentenceRoman: seed.exampleSentenceRoman,
        exampleSentenceEnglish: seed.exampleSentenceEnglish,
      },
      steps: [
        // Step 1: Grammar rule explanation
        {
          id: `${seed.id}_explain`,
          label: "Learn the Rule",
          skillTags: ["grammar", "reading"],
          tutorText: seed.prompt,
          board: {
            type: "flashcards",
            data: {
              headline: `${seed.grammarTopic} · ${seed.grammarTopicHindi}`,
              expression: "grammar_explainer",
              prompt: seed.prompt,
            },
          },
        },
        // Step 2: Practice examples
        {
          id: `${seed.id}_examples`,
          label: "Practice Examples",
          skillTags: ["reading", "vocabulary"],
          tutorText: `Here are practical examples of ${seed.grammarTopic} in use!`,
          board: {
            type: "flashcards",
            data: {
              headline: `Examples of ${seed.grammarTopic}`,
              prompt: "Tap each example to hear it!",
              cards: seed.practiceExamples?.map((ex: any) => ({
                emoji: "📝",
                word: ex.hindi,
                english: ex.english,
                front: ex.hindi,
                back: ex.english,
              })) || [],
            },
          },
        },
        // Step 3: Matching exercise
        {
          id: `${seed.id}_match`,
          label: "Match Pairs",
          skillTags: ["recall", "comprehension"],
          tutorText: `Match each example to its explanation!`,
          board: {
            type: "matchingPairs",
            data: {
              headline: "Match examples to meanings",
              prompt: "Connect related items!",
              pairs: seed.practiceExamples?.map((ex: any, i: number) => ({
                left: ex.hindi,
                right: ex.english,
              })) || [],
            },
          },
        },
        // Step 4: Common mistakes
        {
          id: `${seed.id}_mistakes`,
          label: "Avoid Mistakes",
          skillTags: ["grammar", "correction"],
          tutorText: `Learn what NOT to do with ${seed.grammarTopic}!`,
          board: {
            type: "flashcards",
            data: {
              headline: `Common Mistakes with ${seed.grammarTopic}`,
              prompt: "Notice the errors and corrections",
              cards: seed.commonMistakes?.map((mistake: any) => ({
                emoji: "❌",
                word: mistake.incorrect,
                english: `✓ ${mistake.correct}`,
                front: `❌ ${mistake.incorrect}`,
                back: `✓ ${mistake.correct}`,
              })) || [],
            },
          },
        },
        // Step 5: MCQ - Grammar understanding
        {
          id: `${seed.id}_mcq1`,
          label: "Check Understanding",
          skillTags: ["grammar", "recall"],
          tutorText: `Question 1: Can you identify ${seed.grammarTopic}?`,
          board: {
            type: "mcq",
            data: {
              headline: (seed.mcqQuestions || [])[0]?.question || `Understand ${seed.grammarTopic}`,
              prompt: (seed.mcqQuestions || [])[0]?.question || "Choose the correct answer!",
              options: (seed.mcqQuestions || [])[0]?.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
              answer: (seed.mcqQuestions || [])[0]?.correctAnswer || "Answer",
            },
          },
        },
        // Step 6: MCQ - Application
        {
          id: `${seed.id}_mcq2`,
          label: "Apply Your Knowledge",
          skillTags: ["grammar", "application"],
          tutorText: `Final check! Can you apply ${seed.grammarTopic} correctly?`,
          board: {
            type: "mcq",
            data: (() => {
              const q2 = (seed.mcqQuestions || [])[1];
              if (q2) {
                return {
                  headline: q2.question,
                  prompt: q2.question,
                  options: q2.options,
                  answer: q2.correctAnswer,
                };
              }
              // Auto-generate from practiceExamples: "Which sentence is correct?"
              const ex = seed.practiceExamples || [];
              const correct = ex[0];
              if (!correct) {
                return {
                  headline: `Which sentence uses ${seed.grammarTopic} correctly?`,
                  prompt: "Choose the correct example!",
                  options: [seed.exampleSentenceHindi, "वह जाता है।", "मैं खाना।", "तुम कल।"],
                  answer: seed.exampleSentenceHindi,
                };
              }
              return {
                headline: `What does "${correct.hindi}" mean?`,
                prompt: "Choose the correct meaning!",
                options: [
                  ex[1]?.english || "Something else",
                  correct.english,
                  ex[2]?.english || "Other",
                  ex[3]?.english || "None of these",
                ],
                answer: correct.english,
              };
            })(),
          },
        },
      ],
      nextLessonUrl: index < LEVEL_6_DATA.length - 1
        ? `/level-6/lesson/${LEVEL_6_DATA[index + 1].id}`
        : `/level-6`,
    } as VaaniLessonPayload,
  ])
);

export function getVaaniLesson(_level: string, lessonId: string): VaaniLessonPayload {
  if (VAANI_L1_LESSONS[lessonId]) return VAANI_L1_LESSONS[lessonId];
  if (VAANI_L2_LESSONS[lessonId]) return VAANI_L2_LESSONS[lessonId];
  if (VAANI_L3_LESSONS[lessonId]) return VAANI_L3_LESSONS[lessonId];
  if (VAANI_L4_LESSONS[lessonId]) return VAANI_L4_LESSONS[lessonId];
  if (VAANI_L5_LESSONS[lessonId]) return VAANI_L5_LESSONS[lessonId];
  if (VAANI_L6_LESSONS[lessonId]) return VAANI_L6_LESSONS[lessonId];

  return {
    course: { title: "Vaani", grade: "1", levelSlug: "level-1" },
    lesson: {
      id: "fallback",
      chapterId: "C00",
      chapterTitle: "General",
      title: "Lesson Not Found",
      category: "General",
      durationMin: 1,
      summary: "This lesson is still being prepared.",
      xpReward: 0,
      difficulty: "Beginner",
    },
    steps: [],
    nextLessonUrl: "/level-1",
  };
}
