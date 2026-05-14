// ── Kaveri Level 1 — ಸ್ವರ (Vowels) ─────────────────────────────────────────
// 13 lessons: ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಎ ಏ ಐ ಒ ಓ ಔ
// One chapter (C01), one lesson per vowel

type LevelOneSeed = {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  category: "Vowels" | "Consonants";
  skill: string;
  char: string;
  roman: string;           // romanised pronunciation hint
  wordKannada: string;
  wordEnglish: string;
  assetPath: string;
  durationMin?: number;
  summary: string;
  prompt: string;
};

const LEVEL_ONE_SEEDS: LevelOneSeed[] = [
  {
    id: "L1-C01-L01",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಅ for Akka",
    category: "Vowels",
    skill: "Sound Recognition",
    char: "ಅ",
    roman: "a",
    wordKannada: "ಅಕ್ಕ",
    wordEnglish: "Elder Sister",
    assetPath: "/assets/gemini/kaveri_l1_akka_a.png",
    summary: "Meet ಅ — the very first Kannada sound — through the warm word ಅಕ್ಕ.",
    prompt: "Say it softly: ಅ ... ಅ ... ಅಕ್ಕ!",
  },
  {
    id: "L1-C01-L02",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಆ for Aane",
    category: "Vowels",
    skill: "Long Vowel Sound",
    char: "ಆ",
    roman: "aa",
    wordKannada: "ಆನೆ",
    wordEnglish: "Elephant",
    assetPath: "/assets/gemini/kaveri_l1_aane_aa.png",
    summary: "Stretch the sound — ಆ is the long version of ಅ. The big elephant helps us remember!",
    prompt: "Open your mouth wide and say ಆ — like you're surprised by the elephant!",
  },
  {
    id: "L1-C01-L03",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಇ for Iruve",
    category: "Vowels",
    skill: "Short Vowel Sound",
    char: "ಇ",
    roman: "i",
    wordKannada: "ಇರುವೆ",
    wordEnglish: "Ant",
    assetPath: "/assets/gemini/kaveri_l1_iruve_i.png",
    summary: "The quick little ant teaches us the short ಇ sound.",
    prompt: "Say ಇ quickly — like a tiny ant zipping past!",
  },
  {
    id: "L1-C01-L04",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಈ for Eeju",
    category: "Vowels",
    skill: "Long Vowel Sound",
    char: "ಈ",
    roman: "ee",
    wordKannada: "ಈಜು",
    wordEnglish: "Swimming",
    assetPath: "/assets/gemini/kaveri_l1_eeju_ee.png",
    summary: "Glide through the long ಈ sound just like swimming — smooth and long!",
    prompt: "Stretch your smile wide and say ಈ — like you're gliding through water!",
  },
  {
    id: "L1-C01-L05",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಉ for Uppu",
    category: "Vowels",
    skill: "Round Vowel Sound",
    char: "ಉ",
    roman: "u",
    wordKannada: "ಉಪ್ಪು",
    wordEnglish: "Salt",
    assetPath: "/assets/gemini/kaveri_l1_uppu_u.png",
    summary: "Round your lips for the short ಉ sound — just like tasting a pinch of salt!",
    prompt: "Round your lips softly: ಉ ... ಉ ... ಉಪ್ಪು!",
  },
  {
    id: "L1-C01-L06",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಊ for Ooru",
    category: "Vowels",
    skill: "Long Round Vowel",
    char: "ಊ",
    roman: "uu",
    wordKannada: "ಊರು",
    wordEnglish: "Village / Town",
    assetPath: "/assets/gemini/kaveri_l1_ooru_uu.png",
    summary: "Stretch those rounded lips longer for ಊ — we're visiting the whole village!",
    prompt: "Hold the sound: ಊ ... ಊ ... ಊರು!",
  },
  {
    id: "L1-C01-L07",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಋ for Rushi",
    category: "Vowels",
    skill: "Special Vowel Sound",
    char: "ಋ",
    roman: "ri",
    wordKannada: "ಋಷಿ",
    wordEnglish: "Sage",
    assetPath: "/assets/gemini/kaveri_l1_rushi_ri.png",
    summary: "ಋ is a special vowel with a rolling sound — the wise sage helps us remember it.",
    prompt: "This is a special sound. Say it slowly with the coach: ಋ ... ಋಷಿ.",
  },
  {
    id: "L1-C01-L08",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಎ for Ele",
    category: "Vowels",
    skill: "Short E Sound",
    char: "ಎ",
    roman: "e",
    wordKannada: "ಎಲೆ",
    wordEnglish: "Leaf",
    assetPath: "/assets/gemini/kaveri_l1_ele_e.png",
    summary: "The soft ಎ sound — just like the rustling of a leaf in the breeze.",
    prompt: "Say ಎ lightly, like a leaf floating down: ಎ ... ಎಲೆ!",
  },
  {
    id: "L1-C01-L09",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಏ for Eni",
    category: "Vowels",
    skill: "Long E Sound",
    char: "ಏ",
    roman: "ae",
    wordKannada: "ಏಣಿ",
    wordEnglish: "Ladder",
    assetPath: "/assets/gemini/kaveri_l1_eni_ae.png",
    summary: "Climb up with the long ಏ sound — each step on the ladder is one stretch of the vowel!",
    prompt: "Say ಏ with a rising tone, like climbing a ladder: ಏ ... ಏಣಿ!",
  },
  {
    id: "L1-C01-L10",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಐ for Aidu",
    category: "Vowels",
    skill: "Diphthong Sound",
    char: "ಐ",
    roman: "ai",
    wordKannada: "ಐದು",
    wordEnglish: "Five (the number)",
    assetPath: "/assets/gemini/kaveri_l1_aidu_ai.png",
    summary: "Count to five with ಐದು and learn the ಐ diphthong — two sounds gliding together!",
    prompt: "Hold up five fingers and say: ಐ ... ಐದು!",
  },
  {
    id: "L1-C01-L11",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಒ for Onte",
    category: "Vowels",
    skill: "Short O Sound",
    char: "ಒ",
    roman: "o",
    wordKannada: "ಒಂಟೆ",
    wordEnglish: "Camel",
    assetPath: "/assets/gemini/kaveri_l1_onte_o.png",
    summary: "The short ಒ sound — like the camel walking through the desert with a steady pace.",
    prompt: "Make a small round shape with your lips: ಒ ... ಒಂಟೆ!",
  },
  {
    id: "L1-C01-L12",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಓ for Odu",
    category: "Vowels",
    skill: "Long O Sound",
    char: "ಓ",
    roman: "oo",
    wordKannada: "ಓಡು",
    wordEnglish: "Run",
    assetPath: "/assets/gemini/kaveri_l1_odu_oo.png",
    summary: "Run fast with ಓಡು — the long ಓ sound carries you forward with energy!",
    prompt: "Stretch your lips forward and say ಓ — like you're cheering a runner on!",
  },
  {
    id: "L1-C01-L13",
    chapterId: "C01",
    chapterTitle: "ಸ್ವರ ಅಡಿಪಾಯ",
    title: "ಔ for Aushadhi",
    category: "Vowels",
    skill: "Diphthong Sound",
    char: "ಔ",
    roman: "au",
    wordKannada: "ಔಷಧಿ",
    wordEnglish: "Medicine",
    assetPath: "/assets/gemini/kaveri_l1_aushadhi_au.png",
    summary: "Finish the vowel set with ಔ — the medicine word shows two sounds coming together.",
    prompt: "Say ಔ like you're saying 'ow' — it's a rounded, warm sound: ಔ ... ಔಷಧಿ!",
  },
];

// ── Color palette for course cards ───────────────────────────────────────────
const COURSE_CARD_COLORS = [
  "#f97316", "#ef4444", "#10b981", "#3b82f6",
  "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4",
  "#84cc16", "#a855f7", "#14b8a6", "#f43f5e",
  "#6366f1",
];

// ── Emoji anchors for Kannada words ──────────────────────────────────────────
const WORD_EMOJI: Record<string, string> = {
  "ಅಕ್ಕ":    "👩",
  "ಆನೆ":    "🐘",
  "ಇರುವೆ":  "🐜",
  "ಈಜು":    "🏊",
  "ಉಪ್ಪು":   "🧂",
  "ಊರು":    "🏘️",
  "ಋಷಿ":    "🧙",
  "ಎಲೆ":    "🍃",
  "ಏಣಿ":    "🪜",
  "ಐದು":    "✋",
  "ಒಂಟೆ":   "🐪",
  "ಓಡು":    "🏃",
  "ಔಷಧಿ":   "💊",
};

function getEmoji(word: string): string {
  return WORD_EMOJI[word] || "📖";
}

// Two extra same-starting-letter words per vowel for gallery + match steps
const GALLERY_WORDS: Record<string, Array<{ word: string; english: string }>> = {
  "ಅ": [{ word: "ಅಂಗಡಿ",  english: "Shop"        }, { word: "ಅಜ್ಜ",    english: "Grandfather" }],
  "ಆ": [{ word: "ಆಟ",     english: "Play"        }, { word: "ಆಕಾಶ",   english: "Sky"         }],
  "ಇ": [{ word: "ಇಟ್ಟಿಗೆ", english: "Brick"       }, { word: "ಇಲಿ",     english: "Mouse"       }],
  "ಈ": [{ word: "ಈರುಳ್ಳಿ", english: "Onion"       }, { word: "ಈಟಿ",    english: "Spear"       }],
  "ಉ": [{ word: "ಉಡ",     english: "Monitor Lizard"}, { word: "ಉಸಿರು",  english: "Breath"      }],
  "ಊ": [{ word: "ಊರು",   english: "Town"        }, { word: "ಊಟ",     english: "Meal"        }],
  "ಋ": [{ word: "ಋತು",    english: "Season"      }, { word: "ಋಣ",     english: "Debt"        }],
  "ಎ": [{ word: "ಎತ್ತು",  english: "Ox"          }, { word: "ಎಣ್ಣೆ",   english: "Oil"         }],
  "ಏ": [{ word: "ಏಕತೆ",   english: "Unity"       }, { word: "ಏರು",    english: "Rise"        }],
  "ಐ": [{ word: "ಐಶ್ವರ್ಯ",english: "Wealth"      }, { word: "ಐರಾವತ", english: "White Elephant"}],
  "ಒ": [{ word: "ಒಕ್ಕಲು", english: "Farmer"      }, { word: "ಒಂಟಿ",   english: "Alone"       }],
  "ಓ": [{ word: "ಓಲೆ",    english: "Letter"      }, { word: "ಓಡಾಟ",  english: "Running"     }],
  "ಔ": [{ word: "ಔದಾರ್ಯ", english: "Generosity"  }, { word: "ಔಷಧ",   english: "Medicine"    }],
};

function getNextLessonUrl(index: number): string {
  const nextLesson = LEVEL_ONE_SEEDS[index + 1];
  return nextLesson ? `/level-1/lesson/${nextLesson.id}` : "/level-1";
}

function getDistractors(index: number, count: number): LevelOneSeed[] {
  const result: LevelOneSeed[] = [];
  const total = LEVEL_ONE_SEEDS.length;
  for (let i = 1; result.length < count; i++) {
    const s = LEVEL_ONE_SEEDS[(index + i) % total];
    if (s.id !== LEVEL_ONE_SEEDS[index].id) result.push(s);
  }
  return result;
}

// ── Course lesson list (used by the course index page) ───────────────────────
export const KAVERI_L1_COURSE_LESSONS = LEVEL_ONE_SEEDS.map((seed, index) => ({
  id: seed.id,
  order: index + 1,
  title: `${seed.char} — ${seed.wordKannada} (${seed.wordEnglish})`,
  category: seed.category,
  durationMin: seed.durationMin ?? 8,
  status: (index < 1 ? "available" : "current") as "available" | "current" | "locked" | "completed",
  summary: seed.summary,
  skill: seed.skill,
  boardPreview: {
    type: "visual",
    data: {
      assetPath: seed.assetPath,
      headline: `${seed.char} — ${seed.wordKannada}`,
    },
  },
  image: seed.assetPath,
  startUrl: `/level-1/lesson/${seed.id}`,
  color: COURSE_CARD_COLORS[index % COURSE_CARD_COLORS.length],
}));

// ── Full lesson data (steps) for every vowel ─────────────────────────────────
export const KAVERI_L1_LESSONS: Record<string, any> = Object.fromEntries(
  LEVEL_ONE_SEEDS.map((seed, index) => {
    const distractors = getDistractors(index, 3);
    const [d1, d2, d3] = distractors;

    return [
      seed.id,
      {
        course: {
          title: "Kaveri AI Level 1 — ಸ್ವರಗಳು (Vowels)",
          grade: "1",
          levelSlug: "level-1",
        },
        lesson: {
          id: seed.id,
          chapterId: seed.chapterId,
          chapterTitle: seed.chapterTitle,
          title: seed.title,
          category: seed.category,
          durationMin: seed.durationMin ?? 8,
          summary: seed.summary,
          xpReward: 60,
          difficulty: "Beginner",
          char: seed.char,
          roman: seed.roman,
          wordKannada: seed.wordKannada,
          wordEnglish: seed.wordEnglish,
          assetPath: seed.assetPath,
        },
        steps: [

          // ── Step 1: Look & Listen ──────────────────────────────────────────
          {
            id: `${seed.id}_observe`,
            label: "Look and Listen",
            skillTags: ["reading", "vocabulary", "pronunciation"],
            tutorText:
              `Hello! Today we meet the Kannada letter ${seed.char} (${seed.roman})! ` +
              `Look at this picture — it shows ${seed.wordEnglish} (${seed.wordKannada}). ` +
              `${seed.prompt} Can you see the ${seed.wordKannada}?`,
            tutorTextKn:
              `ನಮಸ್ಕಾರ! ಇಂದು ನಾವು ಕನ್ನಡ ಅಕ್ಷರ "${seed.char}" ಕಲಿಯೋಣ! ` +
              `ಈ ಚಿತ್ರ ನೋಡಿ — ಇದು ${seed.wordKannada} (${seed.wordEnglish}). ` +
              `${seed.prompt}`,
            tutorTextMix:
              `Hello! ಇಂದು ನಾವು "${seed.char}" ಕಲಿಯೋಣ! ` +
              `Look — ${seed.wordKannada} (${seed.wordEnglish}). ${seed.prompt}`,
            board: {
              type: "visual",
              data: {
                assetPath: seed.assetPath,
                headline: `${seed.char} — ${seed.wordKannada}`,
                prompt: `${seed.wordEnglish} — starts with the sound "${seed.roman}"!`,
              },
            },
          },

          // ── Step 2: Letter Spotlight ───────────────────────────────────────
          {
            id: `${seed.id}_spotlight`,
            label: "Letter Spotlight",
            skillTags: ["pronunciation", "letter_recognition"],
            tutorText:
              `Look at this beautiful letter — ${seed.char}! ` +
              `It makes the "${seed.roman}" sound. ` +
              `Say it slowly with me: ${seed.char} ... ${seed.char} ... ${seed.char}! Great job!`,
            tutorTextKn:
              `ಈ ಸುಂದರ ಅಕ್ಷರ ನೋಡಿ — ${seed.char}! ` +
              `ಇದು "${seed.roman}" ಎಂಬ ಧ್ವನಿ ಮಾಡುತ್ತದೆ. ` +
              `ನನ್ನ ಜೊತೆ ನಿಧಾನವಾಗಿ ಹೇಳಿ: ${seed.char} ... ${seed.char} ... ${seed.char}! ಶಾಬಾಸ್! 🌟`,
            tutorTextMix:
              `ನೋಡಿ this beautiful letter — ${seed.char}! ` +
              `Say it with me: ${seed.char} ... ${seed.char} ... ${seed.char}! ಶಾಬಾಸ್!`,
            board: {
              type: "letterSpotlight",
              data: {
                char: seed.char,
                roman: seed.roman,
                wordKannada: seed.wordKannada,
                wordEnglish: seed.wordEnglish,
                assetPath: seed.assetPath,
                prompt: `This letter makes the "${seed.roman}" sound. Tap it to hear it!`,
              },
            },
          },

          // ── Step 3: Trace the Letter ───────────────────────────────────────
          {
            id: `${seed.id}_trace`,
            label: "Trace the Letter",
            skillTags: ["writing", "pronunciation"],
            tutorText:
              `Excellent! Now let's write it. ` +
              `Trace the letter ${seed.char} with your finger! ` +
              `Say "${seed.roman}" as you draw each stroke.`,
            tutorTextKn:
              `ಶಾಬಾಸ್! ಈಗ ಬರೆಯೋಣ. ` +
              `ನಿಮ್ಮ ಬೆರಳಿನಿಂದ "${seed.char}" ಬರೆಯಿರಿ! ` +
              `ಪ್ರತಿ ಗೆರೆ ಎಳೆಯುವಾಗ "${seed.roman}" ಎಂದು ಹೇಳಿ. 🖊️`,
            tutorTextMix:
              `Excellent! ಈಗ ಬರೆಯೋಣ. ` +
              `Trace "${seed.char}" with your finger! ` +
              `ಪ್ರತಿ stroke ಮೇಲೆ ಹೇಳಿ "${seed.roman}"!`,
            board: {
              type: "tracing_canvas",
              data: {
                headline: `Trace ${seed.char}`,
                expression: seed.char,
                prompt: `Follow the shape slowly. Say ${seed.roman} as you trace — muscle memory builds reading speed!`,
              },
            },
          },

          // ── Step 4: Word Gallery — all cards start with the same letter ─────
          {
            id: `${seed.id}_gallery`,
            label: "Word Gallery",
            skillTags: ["vocabulary", "reading"],
            tutorText:
              `Amazing tracing! Now let's discover words that start with ${seed.char}. ` +
              `Tap each card to flip it and hear the Kannada word!`,
            tutorTextKn:
              `ವಾಹ! ಈಗ "${seed.char}" ಅಕ್ಷರದಿಂದ ಶುರುವಾಗುವ ಪದಗಳನ್ನು ನೋಡೋಣ — ` +
              `ಪ್ರತಿ ಕಾರ್ಡ್ ತಿರುಗಿಸಿ ಮತ್ತು ಕಲಿಯಿರಿ! 📖`,
            tutorTextMix:
              `Amazing! "${seed.char}" ಅಕ್ಷರದ words ನೋಡೋಣ. ` +
              `ಪ್ರತಿ card flip ಮಾಡಿ ಮತ್ತು word ಕೇಳಿ! 🃏`,
            board: {
              type: "flashcards",
              data: {
                headline: `${seed.char} ಅಕ್ಷರದ ಪದಗಳು`,
                targetChar: seed.char,
                prompt: "Tap a card to flip it and hear the Kannada word!",
                cards: (() => {
                  const extras = GALLERY_WORDS[seed.char] || [];
                  const w1 = extras[0] ?? { word: d1.wordKannada, english: d1.wordEnglish };
                  const w2 = extras[1] ?? { word: d2.wordKannada, english: d2.wordEnglish };
                  return [
                    { emoji: getEmoji(seed.wordKannada), word: seed.wordKannada, english: seed.wordEnglish, front: `${getEmoji(seed.wordKannada)} ${seed.wordKannada}`, back: seed.wordEnglish },
                    { emoji: getEmoji(w1.word),          word: w1.word,          english: w1.english,       front: `${getEmoji(w1.word)} ${w1.word}`,                  back: w1.english },
                    { emoji: getEmoji(w2.word),          word: w2.word,          english: w2.english,       front: `${getEmoji(w2.word)} ${w2.word}`,                  back: w2.english },
                  ];
                })(),
              },
            },
          },

          // ── Step 5: Match — Kannada word → English meaning (all same letter) ─
          {
            id: `${seed.id}_match`,
            label: "Match the Pair",
            skillTags: ["reading", "recall"],
            tutorText:
              `Great! Match each ${seed.char} word to its English meaning. ` +
              `Tap a word on the left, then find its meaning on the right!`,
            tutorTextKn:
              `ಬಹಳ ಚೆನ್ನಾಗಿದೆ! "${seed.char}" ಅಕ್ಷರದ ಪದಗಳನ್ನು ಅವುಗಳ ಅರ್ಥದೊಂದಿಗೆ ಹೊಂದಿಸಿ! ` +
              `ಎಡಭಾಗದಲ್ಲಿ ಕನ್ನಡ ಪದ ಒತ್ತಿ, ನಂತರ ಬಲಭಾಗದಲ್ಲಿ ಅರ್ಥ ಒತ್ತಿ! 🔗`,
            tutorTextMix:
              `Great! "${seed.char}" ಪದಗಳನ್ನು ಅವುಗಳ meaning ಜೊತೆ ಹೊಂದಿಸಿ! ` +
              `Left word tap ಮಾಡಿ, right meaning tap ಮಾಡಿ! 🎯`,
            board: {
              type: "matchingPairs",
              data: {
                headline: `${seed.char} ಅಕ್ಷರ ಪದಗಳು ಹೊಂದಿಸಿ!`,
                prompt: "Tap a Kannada word, then tap its English meaning!",
                pairsMode: "word-meaning",
                pairs: (() => {
                  const extras = GALLERY_WORDS[seed.char] || [];
                  const w1 = extras[0] ?? { word: d1.wordKannada, english: d1.wordEnglish };
                  const w2 = extras[1] ?? { word: d2.wordKannada, english: d2.wordEnglish };
                  return [
                    { left: seed.wordKannada, right: seed.wordEnglish },
                    { left: w1.word,          right: w1.english },
                    { left: w2.word,          right: w2.english },
                  ];
                })(),
              },
            },
          },

          // ── Step 6: Quick Check — picture → Kannada word ──────────────────
          {
            id: `${seed.id}_quiz1`,
            label: "Quick Check 1",
            skillTags: ["reading", "recall"],
            tutorText:
              `Quiz time! Look at the picture — what is the Kannada word for this? ` +
              `Read the options and pick the right one! 🌟`,
            tutorTextKn:
              `ಈಗ ಪ್ರಶ್ನೆ! ಚಿತ್ರ ನೋಡಿ — ಇದನ್ನು ಕನ್ನಡದಲ್ಲಿ ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ? ` +
              `ಸರಿಯಾದ ಪದ ಆರಿಸಿ! 🌟`,
            tutorTextMix:
              `Quiz time! Picture ನೋಡಿ — ಇದನ್ನು Kannada ಲ್ಲಿ ಏನು ಕರೆಯುತ್ತಾರೆ? ` +
              `Read ಮಾಡಿ ಮತ್ತು pick ಮಾಡಿ! 🌟`,
            board: {
              type: "mcq",
              data: {
                headline: `ಇದನ್ನು ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ?`,
                prompt: `Look at the picture — what is the Kannada name for this?`,
                questionImage: seed.assetPath,
                questionWord: seed.wordEnglish,
                options: [seed.wordKannada, d1.wordKannada, d2.wordKannada, d3.wordKannada],
                answer: seed.wordKannada,
              },
            },
          },

          // ── Step 7: Quick Check — letter identification ────────────────────
          {
            id: `${seed.id}_quiz2`,
            label: "Quick Check 2",
            skillTags: ["reading", "letter_recognition"],
            tutorText:
              `One more! "${seed.wordKannada}" means ${seed.wordEnglish}. ` +
              `Which Kannada letter does it start with? 🎯`,
            tutorTextKn:
              `ಇನ್ನೊಂದು! "${seed.wordKannada}" ಅಂದರೆ ${seed.wordEnglish}. ` +
              `ಇದು ಯಾವ ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ? 🎯`,
            tutorTextMix:
              `One more! "${seed.wordKannada}" means ${seed.wordEnglish}. ` +
              `ಇದು ಯಾವ letter ನಿಂದ start ಆಗುತ್ತದೆ? 🎯`,
            board: {
              type: "mcq",
              data: {
                headline: `${seed.wordKannada} ಯಾವ ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭ?`,
                prompt: `"${seed.wordKannada}" (${seed.wordEnglish}) — find its first letter!`,
                questionImage: seed.assetPath,
                questionWord: seed.wordKannada,
                questionEnglish: seed.wordEnglish,
                options: [seed.char, d1.char, d2.char, d3.char],
                answer: seed.char,
              },
            },
          },

        ],
        nextLessonUrl: getNextLessonUrl(index),
      },
    ];
  }),
);
