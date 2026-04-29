import { HindiGuruLessonPayload } from "./hindiGuruData";

/**
 * Level 2: Syllable Formation (वर्ण संयोजन)
 * Students learn how consonants + vowels = syllables
 * Starts with consonant क (KA) with all 12 vowels
 */

export const VAANI_L2_LESSONS: Record<string, any> = {
  // ============= INTRO: SYLLABLE CONCEPT =============

  "L2-INTRO": {
    course: { title: "Vaani AI Level 2", grade: "1", levelSlug: "l2" },
    lesson: {
      id: "L2-INTRO",
      chapterId: "INTRO",
      chapterTitle: "Syllable Mastery",
      title: "🎓 Consonant + Vowel = Syllable!",
      category: "Concept",
      durationMin: 10,
      summary: "Learn how letters combine to make syllables.",
      xpReward: 100,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l2_intro_warmup",
        label: "What is a Syllable?",
        skillTags: ["concept"],
        tutorText: "In Level 1, you learned individual letters. Now we'll combine them! A consonant + a vowel = a syllable (शब्दांश). For example: क + अ = क!",
        board: {
          type: "text",
          data: {
            headline: "Syllable = Consonant + Vowel",
            content: "क (consonant) + अ (vowel) = क (syllable)\n\nThe vowel's sound changes how we pronounce the consonant!\n\nExamples:\nक + अ = क (ka)\nक + आ = का (kaa)\nक + इ = कि (ki)\nक + ई = की (kee)"
          }
        }
      },
      {
        id: "l2_intro_building",
        label: "Building Blocks",
        skillTags: ["visual"],
        tutorText: "Think of syllables like building blocks. Consonant is the base, vowel is the color!",
        board: {
          type: "visual",
          data: {
            assetPath: "/syllable-building-blocks.svg",
            headline: "How Syllables Form",
            prompt: "Consonant (blue) + Vowel (red) = Complete Syllable!"
          }
        }
      },
      {
        id: "l2_intro_example",
        label: "Example: क-Group",
        skillTags: ["reading"],
        tutorText: "Let's start with क (ka). Watch how it changes with different vowels!",
        board: {
          type: "text",
          data: {
            headline: "क + All Vowels",
            content: "क + अ = क\nक + आ = का\nक + इ = कि\nक + ई = की\nक + उ = कु\nक + ऊ = कू\nक + ए = के\nक + ऐ = कै\nक + ओ = को\nक + औ = कौ\n\nSame consonant, different sounds!"
          }
        }
      },
      {
        id: "l2_intro_ready",
        label: "Ready to Learn!",
        skillTags: ["motivation"],
        tutorText: "Great! Now you understand how it works. Let's practice building syllables together!",
        board: {
          type: "text",
          data: {
            headline: "Level 2 Coming Up!",
            content: "Next lessons:\n✓ Learn क + each vowel = 12 syllables\n✓ Then ख, ग, घ\n✓ And all other consonants!\n\n🎯 By the end, you'll read simple Hindi words!"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L01",
    parentSummary: {
      title: "Syllable Concept Introduced",
      concept: "Consonants combine with vowels to form pronounceable units",
      nextStep: "Practice with consonant क + all 12 vowels"
    }
  },

  // ============= KA + VOWELS (12 syllables) =============

  "L2-C01-L01": {
    course: { title: "Vaani AI Level 2", grade: "1", levelSlug: "l2" },
    lesson: {
      id: "L2-C01-L01",
      chapterId: "C01",
      chapterTitle: "Ka-Vowel Combinations",
      title: "The Sound 'क' (KA) + अ",
      category: "Syllables",
      durationMin: 7,
      summary: "Learn क + अ = क (inherent vowel).",
      xpReward: 60,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l2_ka_a_intro",
        label: "Consonant Alone",
        skillTags: ["concept"],
        tutorText: "When a consonant stands alone, it has the vowel अ built in! So क means 'ka' (क + अ = क).",
        board: {
          type: "text",
          data: {
            headline: "क = क + अ (Inherent Vowel)",
            content: "Every Hindi consonant has the 'अ' vowel built-in!\n\nThat's why:\nक = ka (not just 'k')\nख = kha\nग = ga\n\nThe अ is hidden!"
          }
        }
      },
      {
        id: "l2_ka_a_observe",
        label: "क and अ Together",
        skillTags: ["visual"],
        tutorText: "Look at how क and अ combine visually. The अ is hidden inside!",
        board: {
          type: "visual",
          data: {
            assetPath: "/syllable-ka-a.svg",
            headline: "क + अ = क",
            prompt: "The क contains the अ sound!"
          }
        }
      },
      {
        id: "l2_ka_a_pronounce",
        label: "Say the Syllable",
        skillTags: ["pronunciation"],
        tutorText: "क is pronounced 'ka'. Say it: क, क, क. कमल, कमल!",
        board: {
          type: "audio_playback_tts",
          data: {
            customText: "क",
            headline: "क की आवाज़",
            prompt: "Say 'ka': क... क... क"
          }
        }
      },
      {
        id: "l2_ka_a_check",
        label: "Recognize the Syllable",
        skillTags: ["recognition"],
        tutorText: "Can you find क?",
        board: {
          type: "mcq",
          data: {
            headline: "Which is क?",
            options: ["क", "ख", "ग"],
            answer: "क",
            prompt: "Remember: inherent अ vowel!"
          }
        }
      },
      {
        id: "l2_ka_a_recall",
        label: "🔄 Vowel Review",
        skillTags: ["spaced_repetition"],
        tutorText: "Quick! Can you remember अनार? Which vowel was that?",
        board: {
          type: "mcq",
          data: {
            headline: "Vowel Recall Challenge",
            options: ["अ", "आ", "इ"],
            answer: "अ",
            prompt: "From Level 1! अनार = red pomegranate!"
          }
        }
      },
      {
        id: "l2_ka_a_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace क. Remember: it contains अ! Say 'ka' as you write.",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "क लिखना",
            expression: "क",
            prompt: "Say 'ka' (with the hidden अ)!"
          }
        }
      },
      {
        id: "l2_ka_a_parent",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Your child is now learning syllables! This is how we build Hindi reading.",
        board: {
          type: "text",
          data: {
            headline: "💡 Syllable Building",
            content: "✓ Show: क, ख, ग are consonants\n✓ Explain: Each has अ built in by default\n✓ Practice: Say 'ka', 'kha', 'ga'\n✓ Write: क, ख, ग on paper\n✓ Celebrate: Reading combinations next!"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L02",
    parentSummary: {
      title: "क = Learned (Inherent अ)",
      skillsLearned: ["Syllable concept", "Inherent vowel awareness"],
      progressPercent: 8
    }
  },

  "L2-C01-L02": {
    course: { title: "Vaani AI Level 2", grade: "1", levelSlug: "l2" },
    lesson: {
      id: "L2-C01-L02",
      chapterId: "C01",
      chapterTitle: "Ka-Vowel Combinations",
      title: "The Sound 'का' (KAA) + आ",
      category: "Syllables",
      durationMin: 7,
      summary: "Learn क + आ = का (long vowel).",
      xpReward: 60,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l2_ka_aa_intro",
        label: "Adding आ",
        skillTags: ["concept"],
        tutorText: "Now let's add a vowel modifier! When we add आ to क, the sound becomes longer: का (kaa instead of ka).",
        board: {
          type: "text",
          data: {
            headline: "क + आ = का",
            content: "क = ka (short)\nका = kaa (long)\n\nThe आ modifies the consonant's sound!\nLook: the क changes shape slightly when we add आ!"
          }
        }
      },
      {
        id: "l2_ka_aa_visual",
        label: "See the Change",
        skillTags: ["visual"],
        tutorText: "Look at क vs का. Notice the change?",
        board: {
          type: "visual",
          data: {
            assetPath: "/syllable-ka-aa.svg",
            headline: "क + आ = का",
            prompt: "क has a line added to make का!"
          }
        }
      },
      {
        id: "l2_ka_aa_compare",
        label: "क vs का",
        skillTags: ["reading"],
        tutorText: "क = 'ka' (short, quick)\nका = 'kaa' (long, hold it)\n\nSame consonant, longer vowel!",
        board: {
          type: "text",
          data: {
            headline: "Compare Sounds",
            content: "क: Short 'ka' sound (like in 'cut')\nका: Long 'kaa' sound (like in 'calm')\n\nHold the 'aa' sound longer!"
          }
        }
      },
      {
        id: "l2_ka_aa_pronounce",
        label: "Say का",
        skillTags: ["pronunciation"],
        tutorText: "का is pronounced 'kaa' (long). Say: का, का, का. Hold the 'aa'! काम, काम!",
        board: {
          type: "audio_playback_tts",
          data: {
            customText: "का",
            headline: "का की आवाज़",
            prompt: "Say long 'kaa': का-ा-ा... का-ा-ा"
          }
        }
      },
      {
        id: "l2_ka_aa_check",
        label: "Which is का?",
        skillTags: ["recognition"],
        tutorText: "Can you find का?",
        board: {
          type: "mcq",
          data: {
            headline: "Spot का",
            options: ["का", "कि", "क"],
            answer: "का",
            prompt: "Look for the line that makes 'aa'!"
          }
        }
      },
      {
        id: "l2_ka_aa_trace",
        label: "Trace का",
        skillTags: ["writing"],
        tutorText: "Trace का. Say 'kaa' (long) as you write!",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "का लिखना",
            expression: "का",
            prompt: "Add the line to make 'aa' longer!"
          }
        }
      },
      {
        id: "l2_ka_aa_parent",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Your child is learning vowel modifiers! This unlocks Hindi reading.",
        board: {
          type: "text",
          data: {
            headline: "💡 Short vs Long Vowels",
            content: "✓ क (short): 'ka' (quick)\n✓ का (long): 'kaa' (hold it)\n✓ Play: क vs का speed game\n✓ Record: अपनी आवाज़ (your voice)\n✓ Compare: Which is longer?"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L03",
    parentSummary: {
      title: "का = Learned (Short vs Long)",
      skillsLearned: ["Vowel modifiers", "Long vowel recognition"],
      progressPercent: 17
    }
  },

  // Continue with remaining 10 vowel combinations (L03-L12)
  // I'll use a compact format to save space while showing the pattern

  "L2-C01-L03": {
    course: { title: "Vaani AI Level 2", grade: "1", levelSlug: "l2" },
    lesson: {
      id: "L2-C01-L03",
      chapterId: "C01",
      chapterTitle: "Ka-Vowel Combinations",
      title: "कि (KI)",
      category: "Syllables",
      durationMin: 6,
      summary: "Learn क + इ = कि.",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l2_ka_i_intro",
        label: "Adding इ",
        skillTags: ["concept"],
        tutorText: "क + इ = कि! The इ vowel changes the sound to 'ki' (like in 'kite').",
        board: { type: "text", data: { headline: "क + इ = कि", content: "कि = 'ki' (like 'kite')\n\nSmall mouth for इ sound!\nSmall modification to the letter!" } }
      },
      {
        id: "l2_ka_i_visual",
        label: "See कि",
        skillTags: ["visual"],
        tutorText: "Look at the small mark below क that shows इ.",
        board: { type: "visual", data: { assetPath: "/syllable-ka-i.svg", headline: "क + इ = कि", prompt: "Small mark below = इ vowel!" } }
      },
      {
        id: "l2_ka_i_pronounce",
        label: "Say कि",
        skillTags: ["pronunciation"],
        tutorText: "कि is 'ki'. Say: कि, कि, कि. किताब, किताब!",
        board: { type: "audio_playback_tts", data: { customText: "कि", headline: "कि की आवाज़", prompt: "Say 'ki': कि... कि... कि" } }
      },
      {
        id: "l2_ka_i_check",
        label: "Spot कि",
        skillTags: ["recognition"],
        tutorText: "Which is कि?",
        board: { type: "mcq", data: { headline: "Find कि", options: ["कि", "क", "की"], answer: "कि", prompt: "Small mark below!" } }
      },
      {
        id: "l2_ka_i_trace",
        label: "Trace कि",
        skillTags: ["writing"],
        tutorText: "Trace कि with the small इ mark!",
        board: { type: "tracing_canvas", data: { headline: "कि लिखना", expression: "कि", prompt: "Add small mark!" } }
      },
      {
        id: "l2_ka_i_parent",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "3 syllables done! Your child is building reading foundation fast.",
        board: { type: "text", data: { headline: "💡 Practice Together", content: "✓ क, का, कि\n✓ Say each slowly\n✓ Write on paper\n✓ Find them in books!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L04",
    parentSummary: { title: "कि = Learned", progressPercent: 25 }
  },

  "L2-C01-L04": { course: { title: "Vaani AI Level 2", grade: "1", levelSlug: "l2" }, lesson: { id: "L2-C01-L04", chapterId: "C01", chapterTitle: "Ka-Vowel Combinations", title: "की (KII)", category: "Syllables", durationMin: 6, summary: "Learn क + ई = की.", xpReward: 50, difficulty: "Beginner" }, steps: [{ id: "l2_ka_ii_intro", label: "Adding ई", skillTags: ["concept"], tutorText: "क + ई = की! The long ई makes 'kii' sound.", board: { type: "text", data: { headline: "क + ई = की", content: "की = 'kii' (long)\n\nLonger than कि!\nTwo lines under the क!" } } }, { id: "l2_ka_ii_pronounce", label: "Say की", skillTags: ["pronunciation"], tutorText: "की is 'kii'. Hold it longer! Say: की, की, की.", board: { type: "audio_playback_tts", data: { customText: "की", headline: "की की आवाज़", prompt: "Long 'kii': की-ी-ी" } } }, { id: "l2_ka_ii_check", label: "Spot की", skillTags: ["recognition"], tutorText: "Which is की?", board: { type: "mcq", data: { headline: "Find की", options: ["की", "कि", "क"], answer: "की", prompt: "Longer vowel!" } } }, { id: "l2_ka_ii_trace", label: "Trace की", skillTags: ["writing"], tutorText: "Trace की!", board: { type: "tracing_canvas", data: { headline: "की लिखना", expression: "की", prompt: "Two lines = long 'ii'!" } } }, { id: "l2_ka_ii_parent", label: "Parent Coaching", skillTags: ["parent_guidance"], tutorText: "Your child is seeing patterns!", board: { type: "text", data: { headline: "💡 Pattern Recognition", content: "क = ka\nका = kaa (longer)\nकि = ki (short i)\nकी = kii (long i)\n\nSame consonant, different vowels!" } } }], nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L05", parentSummary: { title: "की = Learned", progressPercent: 33 } },

  "L2-C01-L05": { course: { title: "Vaani AI Level 2", grade: "1", levelSlug: "l2" }, lesson: { id: "L2-C01-L05", chapterId: "C01", chapterTitle: "Ka-Vowel Combinations", title: "कु (KU)", category: "Syllables", durationMin: 6, summary: "Learn क + उ = कु.", xpReward: 50, difficulty: "Beginner" }, steps: [{ id: "l2_ka_u_intro", label: "Adding उ", skillTags: ["concept"], tutorText: "क + उ = कु! Round mouth for 'ku' sound.", board: { type: "text", data: { headline: "क + उ = कु", content: "कु = 'ku' (like 'coop')\n\nRound mouth for उ!\nRound mark on the letter!" } } }, { id: "l2_ka_u_mouth", label: "Mouth Position", skillTags: ["pronunciation"], tutorText: "For कु, make a round mouth like for उ! Say 'ku' with round lips.", board: { type: "visual", data: { assetPath: "/mouth-positions/mouth-round.svg", headline: "Round Mouth for कु", prompt: "Feel the round shape!" } } }, { id: "l2_ka_u_pronounce", label: "Say कु", skillTags: ["pronunciation"], tutorText: "कु is 'ku'. Say: कु, कु, कु. कुआँ, कुआँ!", board: { type: "audio_playback_tts", data: { customText: "कु", headline: "कु की आवाज़", prompt: "Say 'ku': कु... कु... कु" } } }, { id: "l2_ka_u_check", label: "Spot कु", skillTags: ["recognition"], tutorText: "Which is कु?", board: { type: "mcq", data: { headline: "Find कु", options: ["कु", "को", "क"], answer: "कु", prompt: "Round mark!" } } }, { id: "l2_ka_u_trace", label: "Trace कु", skillTags: ["writing"], tutorText: "Trace कु with round mouth!", board: { type: "tracing_canvas", data: { headline: "कु लिखना", expression: "कु", prompt: "Round mark shows उ!" } } }], nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L06", parentSummary: { title: "कु = Learned", progressPercent: 42 } },

  // Remaining combinations (L06-L12) follow same pattern - truncated for brevity
  // In production, each would have the full 5-6 step structure

  "L2-C01-L06": { lesson: { id: "L2-C01-L06", title: "कू (KUU)", summary: "Learn क + ऊ = कू." }, nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L07" },
  "L2-C01-L07": { lesson: { id: "L2-C01-L07", title: "के (KE)", summary: "Learn क + ए = के." }, nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L08" },
  "L2-C01-L08": { lesson: { id: "L2-C01-L08", title: "कै (KAI)", summary: "Learn क + ऐ = कै." }, nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L09" },
  "L2-C01-L09": { lesson: { id: "L2-C01-L09", title: "को (KO)", summary: "Learn क + ओ = को." }, nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-L10" },
  "L2-C01-L10": { lesson: { id: "L2-C01-L10", title: "कौ (KAU)", summary: "Learn क + औ = कौ." }, nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C01-REVIEW" },

  // ============= KA-SYLLABLES REVIEW =============

  "L2-C01-REVIEW": {
    course: { title: "Vaani AI Level 2", grade: "1", levelSlug: "l2" },
    lesson: {
      id: "L2-C01-REVIEW",
      chapterId: "C01",
      chapterTitle: "Ka-Vowel Combinations",
      title: "🌟 Master क + All Vowels!",
      category: "Review",
      durationMin: 12,
      summary: "Consolidate all 12 क syllables.",
      xpReward: 150,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l2_ka_review_recall",
        label: "🔄 Vowel Recall",
        skillTags: ["spaced_repetition"],
        tutorText: "Quick! Recall your vowels from Level 1 while practicing क combinations!",
        board: {
          type: "mcq",
          data: {
            headline: "Vowel Memory Challenge",
            options: ["अ", "आ", "इ", "ई", "उ", "ऊ"],
            prompt: "Which vowel makes 'kaa' sound? (क + ?)"
          }
        }
      },
      {
        id: "l2_ka_review_match",
        label: "Match Syllables",
        skillTags: ["recognition"],
        tutorText: "Match each क + vowel combination with its sound!",
        board: {
          type: "matchingPairs",
          data: {
            headline: "Syllable Matching",
            pairs: [
              { left: "क", right: "ka" },
              { left: "का", right: "kaa" },
              { left: "कि", right: "ki" },
              { left: "की", right: "kii" },
              { left: "कु", right: "ku" },
              { left: "कू", right: "kuu" },
              { left: "के", right: "ke" },
              { left: "कै", right: "kai" },
              { left: "को", right: "ko" },
              { left: "कौ", right: "kau" }
            ]
          }
        }
      },
      {
        id: "l2_ka_review_write",
        label: "Write All क Syllables",
        skillTags: ["writing"],
        tutorText: "Show me you can write all 10 क combinations!",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "Complete क Series",
            expressions: ["क", "का", "कि", "की", "कु", "कू", "के", "कै", "को", "कौ"],
            prompt: "Write each as it appears"
          }
        }
      },
      {
        id: "l2_ka_review_story",
        label: "Reading Practice",
        skillTags: ["reading"],
        tutorText: "Read this story using क syllables!",
        board: {
          type: "text",
          data: {
            headline: "क की कहानी",
            content: "कमल के घर में एक कछुआ था। कछुआ का नाम कुछ था। कुछ कमल को खोजता था। कुछ का घर कबूतर के पास था। कबूतर कीचड़ में खड़ा था। कुछ कबूतर को कहता था: 'का, काम करो!'\n\n(A turtle named Kuch lived near Kamal. He looked for Kamal...)"
          }
        }
      },
      {
        id: "l2_ka_review_celebration",
        label: "🎉 क Complete!",
        skillTags: ["celebration"],
        tutorText: "Amazing! You've mastered क + all vowels! That's 10 syllables!",
        board: {
          type: "text",
          data: {
            headline: "क की सफलता!",
            content: "क का कि की कु कू के कै को कौ\n\n🎓 You can now:\n✓ Recognize all क combinations\n✓ Pronounce correctly\n✓ Write syllables\n✓ Read simple words!\n\nNext: ख, ग, घ (and all other consonants!)"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C02-L01",
    parentSummary: {
      title: "क Complete! (10 Syllables)",
      syllablesLearned: ["क", "का", "कि", "की", "कु", "कू", "के", "कै", "को", "कौ"],
      readyForNextConsonant: true,
      messageToParent: "Your child can now read simple words with क! Next: other consonants will follow the same pattern."
    }
  },

  // ============= PLACEHOLDER: Other Consonants (ख, ग, घ, etc.) =============
  // Each would follow the same 10-syllable pattern as क
  // For brevity, showing template

  "L2-C02-L01": {
    course: { title: "Vaani AI Level 2", grade: "1", levelSlug: "l2" },
    lesson: {
      id: "L2-C02-L01",
      chapterId: "C02",
      chapterTitle: "Kha-Vowel Combinations",
      title: "ख + All Vowels",
      category: "Syllables",
      durationMin: 30,
      summary: "Learn ख with all 10 vowels.",
      xpReward: 100,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l2_kha_intro",
        label: "Aspirated Syllables",
        skillTags: ["concept"],
        tutorText: "Now let's try ख (the aspirated version of क)! ख + vowels = different sounds: ख, खा, खि, खी, etc.",
        board: {
          type: "text",
          data: {
            headline: "ख + All Vowels",
            content: "ख = kha\nखा = khaa\nखि = khi\nखी = khii\nखु = khu\nखू = khuu\nखे = khe\nखै = khai\nखो = kho\nखौ = khau\n\nSame pattern, different consonant!"
          }
        }
      },
      {
        id: "l2_kha_full",
        label: "All 10 ख Syllables",
        skillTags: ["reading"],
        tutorText: "You already know the pattern! Just apply it to ख.",
        board: {
          type: "text",
          data: {
            headline: "ख Series (Like क Series)",
            content: "✓ क series: क, का, कि, की, कु, कू, के, कै, को, कौ\n✓ ख series: ख, खा, खि, खी, खु, खू, खे, खै, खो, खौ\n\nSame vowels, just use ख instead of क!"
          }
        }
      },
      {
        id: "l2_kha_practice",
        label: "Practice ख Syllables",
        skillTags: ["writing", "pronunciation"],
        tutorText: "Write and pronounce all 10 ख syllables!",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "Write ख Series",
            expressions: ["ख", "खा", "खि", "खी", "खु", "खू", "खे", "खै", "खो", "खौ"],
            prompt: "Same vowels as क!"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l2/lesson/L2-C03-L01",
    parentSummary: {
      title: "ख Syllables (10 More)",
      totalSyllables: 20,
      messageToParent: "Your child now has 20 syllables! The pattern makes future consonants easy."
    }
  }

  // Note: In production, add all remaining consonants (ग, घ, च, छ, ट, प, ब, म, ह)
  // Each follows same 10-vowel pattern = 90 more lessons
  // Plus reviews and consolidation
  // Total Level 2 would have ~150 lessons
};
