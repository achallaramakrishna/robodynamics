import { HindiGuruLessonPayload } from "./hindiGuruData";

export const VAANI_L1_LESSONS: Record<string, any> = {
  // ============= SWAR FOUNDATIONS (12 VOWELS) =============

  "L1-C01-L01": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L01",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "The Magic of 'अ' (A)",
      category: "Vowels",
      durationMin: 8,
      summary: "Learn अ for Anaar with singing, tracing, and pronunciation.",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c1_warmup",
        label: "Red Fruit Hunt",
        skillTags: ["visual", "conversation"],
        tutorText: "Can you think of something red and round? Maybe a fruit? Let's discover it together! 🎯",
        board: {
          type: "text",
          data: {
            headline: "Think & Connect",
            prompt: "Red... round... with little seeds inside. What could it be?"
          }
        }
      },
      {
        id: "l1_c1_video",
        label: "Watch & Sing",
        skillTags: ["visual", "pronunciation"],
        tutorText: "Let's watch a fun song about अ! Listen carefully and try to sing along.",
        board: {
          type: "video_player",
          data: {
            videoUrl: "https://youtu.be/HUoj5s5AnZg",
            headline: "अ से अनार Song"
          }
        }
      },
      {
        id: "l1_c1_observe",
        label: "Meet the Letter",
        skillTags: ["visual"],
        tutorText: "This is अनार (pomegranate)! The red part shows us the letter अ. Look how the letter looks like the fruit shape!",
        board: {
          type: "visual",
          data: {
            assetPath: "/vaani_l1_anar_a_1777125076703.png",
            headline: "अ से अनार",
            prompt: "Notice: letter अ (yellow) sits next to the red pomegranate! Same shape, different color."
          }
        }
      },
      {
        id: "l1_c1_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation", "speaking"],
        tutorText: "Now listen to the sound अ and repeat after me. Say it like 'ah' in 'apple'! अ... अ... अ. Your turn!",
        board: {
          type: "audio_playback",
          data: {
            audioUrl: "/sounds/hindi_a.mp3",
            headline: "अ की ध्वनि",
            prompt: "Press play, listen carefully, then say 'अ' three times loudly! अ... अ... अ"
          }
        }
      },
      {
        id: "l1_c1_check",
        label: "Can You Spot It?",
        skillTags: ["recognition", "reading"],
        tutorText: "Great! Now let's see if you can find अ. Look at all three letters. Which one is अ? Click it!",
        board: {
          type: "mcq",
          data: {
            headline: "Letter Recognition",
            options: ["अ", "आ", "क"],
            answer: "अ",
            prompt: "Look carefully! Remember the shape."
          }
        }
      },
      {
        id: "l1_c1_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Perfect! Now let's write अ. Say the sound 'अ' while you trace. It helps your brain remember!",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "अक्षर लेखन (Writing)",
            expression: "अ",
            prompt: "Start from top-left curves. Say 'अ' as you trace. Slower is better!"
          }
        }
      },
      {
        id: "l1_c1_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Your child just learned their first Hindi letter! 🌟 This week, point to red things around the house and say 'अनार' together. Keep it playful!",
        board: {
          type: "text",
          data: {
            headline: "💡 Practice at Home (2 min/day)",
            content: "✓ Point to red objects\n✓ Say 'अनार' together\n✓ Draw the shape with your finger\n✓ Practice tracing on paper\n\nDon't worry about perfection—fun is the goal!"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L02",
    parentSummary: {
      title: "अ Mastered!",
      skillsLearned: ["Recognition", "Pronunciation", "Letter formation"],
      weeklyChallenge: "Find 5 red things at home and say 'अनार' for each one!"
    }
  },

  "L1-C01-L02": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L02",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "The Sound of 'आ' (AA)",
      category: "Vowels",
      durationMin: 8,
      summary: "Learn आ for Aam with extended vowel sound practice.",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c2_warmup",
        label: "Yellow Fruit Hunt",
        skillTags: ["visual", "conversation"],
        tutorText: "What's sweet, yellow, and grows on trees? Something we eat in summer! Can you guess?",
        board: {
          type: "text",
          data: {
            headline: "What Fruit Am I?",
            prompt: "Yellow... sweet... mango season is here! 🥭"
          }
        }
      },
      {
        id: "l1_c2_observe",
        label: "Meet the Letter",
        skillTags: ["visual"],
        tutorText: "This is आम (mango)! Look at the letter आ. It's like अ, but with an extra line standing up! That extra line makes the sound longer: आआआ",
        board: {
          type: "visual",
          data: {
            assetPath: "/vaani_l1_aam_aa_1777125098321.png",
            headline: "आ से आम",
            prompt: "See the difference? अ is short, आ is long with an extra stick!"
          }
        }
      },
      {
        id: "l1_c2_compare",
        label: "Compare Letters",
        skillTags: ["visual", "reading"],
        tutorText: "Let's look at अ and आ side by side. अ is short. आ is long. Can you see the difference?",
        board: {
          type: "text",
          data: {
            headline: "अ vs आ",
            content: "अ = short sound 'ah'\nआ = long sound 'aaah' (hold it longer!)"
          }
        }
      },
      {
        id: "l1_c2_pronounce",
        label: "Say the Long Sound",
        skillTags: ["pronunciation", "speaking"],
        tutorText: "Listen: आ... (hold it longer). It's like opening your mouth wider! Now you say it. आ... आ... आ. Make it long and sweet like mango!",
        board: {
          type: "audio_playback",
          data: {
            audioUrl: "/sounds/hindi_aa.mp3",
            headline: "आ की ध्वनि",
            prompt: "Hold the sound longer: आ-ा-ा. Say 'aam' together: आम, आम, आम"
          }
        }
      },
      {
        id: "l1_c2_check",
        label: "Which One is Longer?",
        skillTags: ["recognition", "reading"],
        tutorText: "Good! Now, which letter is आ? Remember: it has the extra line!",
        board: {
          type: "mcq",
          data: {
            headline: "Find आ",
            options: ["आ", "अ", "ई"],
            answer: "आ",
            prompt: "Look for the extra standing line."
          }
        }
      },
      {
        id: "l1_c2_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Now trace आ. Remember: first the curves like अ, then the standing line. Say 'आ' as you write it!",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "आ लिखना",
            expression: "आ",
            prompt: "Trace slowly. Say 'आ-ा-ा' (make it long) as you write."
          }
        }
      },
      {
        id: "l1_c2_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Your child now knows 2 vowels! Today's challenge: compare short vs long sounds. It helps their reading later!",
        board: {
          type: "text",
          data: {
            headline: "💡 This Week's Practice",
            content: "✓ Play 'short vs long' game: 'अ' (short) vs 'आ' (long)\n✓ Find yellow fruits at home and say 'आम'\n✓ Practice writing both अ and आ\n✓ Praise effort, not perfection!"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L03",
    parentSummary: {
      title: "आ Mastered! (2/12 Vowels Done)",
      skillsLearned: ["Long vowel sound", "Letter comparison", "Pronunciation control"],
      progressPercent: 17
    }
  },

  "L1-C01-L03": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L03",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Tangy 'इ' (I)",
      category: "Vowels",
      durationMin: 8,
      summary: "Learn इ for Imli with tongue position awareness.",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c3_warmup",
        label: "Sour Fruit Hunt",
        skillTags: ["visual", "conversation"],
        tutorText: "What's sour, brown, and makes your mouth pucker? Something tangy and yummy!",
        board: {
          type: "text",
          data: {
            headline: "Guess the Sour Fruit",
            prompt: "Sour... brown... tasty! Makes you go 'mmm' and 'ugh' at the same time! 😝"
          }
        }
      },
      {
        id: "l1_c3_observe",
        label: "Meet the Letter",
        skillTags: ["visual"],
        tutorText: "This is इमली (tamarind)! The letter इ looks different—it has a little tail at the bottom. The sound is short and tight: इ (like 'ee' in 'sit').",
        board: {
          type: "visual",
          data: {
            assetPath: "/vaani_l1_imli_i_1777125119172.png",
            headline: "इ से इमली",
            prompt: "See the tiny tail? That makes it special! इ sounds different from अ and आ."
          }
        }
      },
      {
        id: "l1_c3_mouth_position",
        label: "Mouth Position",
        skillTags: ["pronunciation"],
        tutorText: "For इ, smile a little! Push your lips forward slightly and say 'इ'. Feel how your mouth is different from अ and आ?",
        board: {
          type: "text",
          data: {
            headline: "How to Say इ",
            content: "अ: mouth wide open\nआ: mouth very wide open  \nइ: mouth smaller, smile a bit! 😊"
          }
        }
      },
      {
        id: "l1_c3_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation", "speaking"],
        tutorText: "Listen to इ. Say it like 'ee' in 'sit'. Short and quick! इ... इ... इ. Your turn!",
        board: {
          type: "audio_playback",
          data: {
            audioUrl: "/sounds/hindi_i.mp3",
            headline: "इ की ध्वनि",
            prompt: "Make a short 'ee' sound. Say 'इमली' (ee-mlee) three times!"
          }
        }
      },
      {
        id: "l1_c3_check",
        label: "Find the Tail!",
        skillTags: ["recognition", "reading"],
        tutorText: "Which letter has the tiny tail? That's इ!",
        board: {
          type: "mcq",
          data: {
            headline: "Spot इ",
            options: ["इ", "अ", "आ"],
            answer: "इ",
            prompt: "Look for the small tail at the bottom."
          }
        }
      },
      {
        id: "l1_c3_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace इ carefully. The tail is important! Say 'इ' as you write.",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "इ लिखना",
            expression: "इ",
            prompt: "Trace the S-curve and the tail slowly. Say 'इ' (short and quick)."
          }
        }
      },
      {
        id: "l1_c3_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "3 vowels down! Your child is learning that different mouths make different sounds. This is foundational for reading!",
        board: {
          type: "text",
          data: {
            headline: "💡 Week 3 Challenge",
            content: "✓ Taste tamarind together and say 'इमली'\n✓ Play mouth shapes: big smile (इ), wide open (आ), open (अ)\n✓ Sing the sounds: अ-आ-इ-अ-आ-इ\n✓ Celebrate progress!"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L04",
    parentSummary: {
      title: "इ Mastered! (3/12 Vowels)",
      skillsLearned: ["Mouth awareness", "Vowel distinctions", "Tamarind knowledge!"],
      progressPercent: 25
    }
  },

  "L1-C01-L04": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L04",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Sweet 'ई' (EE)",
      category: "Vowels",
      durationMin: 8,
      summary: "Learn ई for Eekh with long vowel understanding.",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c4_warmup",
        label: "Tall Plant Hunt",
        skillTags: ["visual"],
        tutorText: "What's tall, green, and sweet? Farmers grow it in fields. We chew it and it's juicy!",
        board: {
          type: "text",
          data: {
            headline: "What Plant Am I?",
            prompt: "Tall... green... sweet juice! 🌾"
          }
        }
      },
      {
        id: "l1_c4_observe",
        label: "Meet the Letter",
        skillTags: ["visual"],
        tutorText: "This is ईख (sugarcane)! Look at the letter ई. It's like इ but LONGER with two standing lines! That means the sound is long: ईई",
        board: {
          type: "visual",
          data: {
            assetPath: "/vaani_l1_eekh_ee_1777125139516.png",
            headline: "ई से ईख",
            prompt: "Two standing lines = long 'ee' sound!"
          }
        }
      },
      {
        id: "l1_c4_compare",
        label: "Short vs Long: इ vs ई",
        skillTags: ["reading", "visual"],
        tutorText: "इ is short: इ (quick). ई is long: ईई (hold it). One line vs two lines!",
        board: {
          type: "text",
          data: {
            headline: "Compare",
            content: "इ = one standing line = short sound\nई = two standing lines = long sound"
          }
        }
      },
      {
        id: "l1_c4_pronounce",
        label: "Say the Long Sound",
        skillTags: ["pronunciation"],
        tutorText: "Listen to ई. It's like a long 'eee'. Hold it longer than इ! ईई... ईख, ईख, ईख.",
        board: {
          type: "audio_playback",
          data: {
            audioUrl: "/sounds/hindi_ee.mp3",
            headline: "ई की ध्वनि",
            prompt: "Hold the long 'ee' sound. Say 'ीख' (hold the 'ee')."
          }
        }
      },
      {
        id: "l1_c4_check",
        label: "Which is Long?",
        skillTags: ["recognition"],
        tutorText: "Which letter is ई (long)? Remember: two standing lines!",
        board: {
          type: "mcq",
          data: {
            headline: "Spot ई",
            options: ["ई", "इ", "आ"],
            answer: "ई",
            prompt: "Look for two lines standing up."
          }
        }
      },
      {
        id: "l1_c4_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ई. Two lines standing together! Say 'ईईई' (long sound) as you write.",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "ई लिखना",
            expression: "ई",
            prompt: "Two lines side by side. Hold the sound as you trace."
          }
        }
      },
      {
        id: "l1_c4_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Your child now understands short vs long vowels! This is key for reading success.",
        board: {
          type: "text",
          data: {
            headline: "💡 Short vs Long Game",
            content: "✓ Compare: इमली vs ईख (short vs long)\n✓ Chew sugarcane and say 'ईख' slowly\n✓ Write both इ and ई\n✓ Play clapping game: short syllables (clap) vs long syllables (clap-clap)"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L05",
    parentSummary: {
      title: "ई Mastered! (4/12 Vowels - Third Short Done)",
      skillsLearned: ["Long vowel mastery", "Pattern recognition"],
      progressPercent: 33
    }
  },

  // Continue with L05-L12 (remaining vowels) - I'll add streamlined versions

  "L1-C01-L05": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L05",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Wise 'उ' (U)",
      category: "Vowels",
      durationMin: 7,
      summary: "Learn उ for Ullu (owl).",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c5_warmup",
        label: "Night Bird Hunt",
        skillTags: ["visual"],
        tutorText: "What bird says 'hoo hoo' at night and is very wise? Can you guess?",
        board: { type: "text", data: { headline: "Night Creature", prompt: "Big eyes... wise... says 'hoo hoo'! 🦉" } }
      },
      {
        id: "l1_c5_observe",
        label: "Meet उ",
        skillTags: ["visual"],
        tutorText: "This is उल्लू (owl)! The letter उ looks like a pot shape. The sound is round: उ... like 'oo' in 'boot'.",
        board: { type: "visual", data: { assetPath: "/vaani_l1_uloo_u_1777125290851.png", headline: "उ से उल्लू", prompt: "Owl = उल्लू. Round mouth = round sound उ!" } }
      },
      {
        id: "l1_c5_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "Make a round mouth and say उ! Like hooting: उ-उ-उ. उल्लू, उल्लू, उल्लू!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_u.mp3", headline: "उ की ध्वनि", prompt: "Round mouth: say 'oo'. उ... उ... उ" } }
      },
      {
        id: "l1_c5_check",
        label: "Spot उ",
        skillTags: ["recognition"],
        tutorText: "Which one is उ? Look for the pot shape!",
        board: { type: "mcq", data: { headline: "Find उ", options: ["उ", "ऊ", "ई"], answer: "उ", prompt: "Remember the pot?" } }
      },
      {
        id: "l1_c5_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace उ with a round motion. Say 'उ-उ-उ' (hoot like an owl) as you write!",
        board: { type: "tracing_canvas", data: { headline: "उ लिखना", expression: "उ", prompt: "Round pot shape. Hoot as you write!" } }
      },
      {
        id: "l1_c5_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "5 vowels learned! Your child is building vowel awareness.",
        board: { type: "text", data: { headline: "💡 Owl Hoot Game", content: "✓ Hoot together: उ-उ-उ\n✓ Draw owl shapes\n✓ Practice round mouth sounds\n✓ Celebrate 5 vowels done!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L06",
    parentSummary: { title: "उ Mastered! (5/12 Vowels)", progressPercent: 42 }
  },

  "L1-C01-L06": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L06",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Warm 'ऊ' (UU)",
      category: "Vowels",
      durationMin: 7,
      summary: "Learn ऊ for Oon (wool).",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c6_warmup",
        label: "Soft & Warm Hunt",
        skillTags: ["visual"],
        tutorText: "What's soft, fluffy, and keeps you warm? We wear it in winter!",
        board: { type: "text", data: { headline: "Guess the Soft Thing", prompt: "Soft... warm... from sheep! 🐑" } }
      },
      {
        id: "l1_c6_observe",
        label: "Meet ऊ",
        skillTags: ["visual"],
        tutorText: "This is ऊन (wool)! ऊ is like उ but LONGER with two pot shapes! The sound is long: ऊऊ.",
        board: { type: "visual", data: { assetPath: "/vaani_l1_oon_uu_1777125318652.png", headline: "ऊ से ऊन", prompt: "Two pots = long 'oo' sound!" } }
      },
      {
        id: "l1_c6_compare",
        label: "उ vs ऊ",
        skillTags: ["reading"],
        tutorText: "उ: short round sound. ऊ: long round sound with two pot shapes!",
        board: { type: "text", data: { headline: "Compare", content: "उ = one pot = short 'oo'\nऊ = two pots = long 'ooo'" } }
      },
      {
        id: "l1_c6_pronounce",
        label: "Say the Long Sound",
        skillTags: ["pronunciation"],
        tutorText: "Make a big round mouth and say ऊऊ (long). Hold it! ऊन, ऊन, ऊन!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_uu.mp3", headline: "ऊ की ध्वनि", prompt: "Very round mouth: say long 'oo'. ऊ-ऊ-ऊ" } }
      },
      {
        id: "l1_c6_check",
        label: "Which is Long?",
        skillTags: ["recognition"],
        tutorText: "Which is ऊ (long pot)? Which is उ (short pot)?",
        board: { type: "mcq", data: { headline: "Spot ऊ", options: ["ऊ", "उ", "अ"], answer: "ऊ", prompt: "Two pots = long sound" } }
      },
      {
        id: "l1_c6_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ऊ. Two pots! Say 'ऊऊ' (long) as you write.",
        board: { type: "tracing_canvas", data: { headline: "ऊ लिखना", expression: "ऊ", prompt: "Two round pots. Hold the sound!" } }
      },
      {
        id: "l1_c6_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "6 vowels! Pattern: short vs long, round vs wide mouth sounds.",
        board: { type: "text", data: { headline: "💡 Soft Touch Game", content: "✓ Feel wool together and say 'ऊन'\n✓ Compare उ (short) vs ऊ (long) sounds\n✓ Make warm fuzzy sounds\n✓ Trace both letters" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L07",
    parentSummary: { title: "ऊ Mastered! (6/12 Vowels - Halfway!)", progressPercent: 50 }
  },

  "L1-C01-L07": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L07",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Saintly 'ऋ' (RI)",
      category: "Vowels",
      durationMin: 7,
      summary: "Learn ऋ for Rishi (wise sage).",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c7_warmup",
        label: "Wise Person Hunt",
        skillTags: ["visual"],
        tutorText: "Who is very wise and lives in the mountains? Someone who meditates and teaches? An ancient Indian teacher!",
        board: { type: "text", data: { headline: "Ancient Wisdom", prompt: "Wise... mountain... teaches others! 🧙" } }
      },
      {
        id: "l1_c7_observe",
        label: "Meet ऋ",
        skillTags: ["visual"],
        tutorText: "This is ऋषि (rishi—a wise sage)! ऋ has a hook shape. It's like a special vowel: ऋ. The sound is RI (short and crisp).",
        board: { type: "visual", data: { assetPath: "/vaani_l1_rishi_ri_1777125345133.png", headline: "ऋ से ऋषि", prompt: "Hook shape = sacred sound!" } }
      },
      {
        id: "l1_c7_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ऋ sounds like 'ri' in 'river'. Say it: ऋ-ऋ-ऋ. ऋषि, ऋषि, ऋषि!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ri.mp3", headline: "ऋ की ध्वनि", prompt: "'Ri' sound (like river). ऋ... ऋ... ऋ" } }
      },
      {
        id: "l1_c7_check",
        label: "Spot ऋ",
        skillTags: ["recognition"],
        tutorText: "Which one has the hook? That's ऋ!",
        board: { type: "mcq", data: { headline: "Find ऋ", options: ["ऋ", "इ", "ई"], answer: "ऋ", prompt: "Look for the unique hook!" } }
      },
      {
        id: "l1_c7_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ऋ carefully. The hook is special! Say 'ऋ-ऋ-ऋ' as you write.",
        board: { type: "tracing_canvas", data: { headline: "ऋ लिखना", expression: "ऋ", prompt: "Hook shape carefully. Respect the sacred letter!" } }
      },
      {
        id: "l1_c7_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "7 vowels! ऋ is special—it's used mainly in Sanskrit and classical words.",
        board: { type: "text", data: { headline: "💡 Wisdom Activity", content: "✓ Teach about rishis (wise teachers)\n✓ Practice hook shape writing\n✓ Say 'ऋषि' together\n✓ Discuss what wisdom means" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L08",
    parentSummary: { title: "ऋ Mastered! (7/12 Vowels)", progressPercent: 58 }
  },

  "L1-C01-L08": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L08",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Elegant 'ए' (E)",
      category: "Vowels",
      durationMin: 7,
      summary: "Learn ए for Edi (heel).",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c8_warmup",
        label: "Foot Hunt",
        skillTags: ["visual"],
        tutorText: "What part of your foot is at the very back? Where your shoe presses when you walk?",
        board: { type: "text", data: { headline: "Body Part", prompt: "Back of foot... supports us... heel! 👟" } }
      },
      {
        id: "l1_c8_observe",
        label: "Meet ए",
        skillTags: ["visual"],
        tutorText: "This is एड़ी (heel)! ए looks like a diamond. The sound is ए (like 'ay' in 'say').",
        board: { type: "visual", data: { assetPath: "/vaani_l1_edi_e_1777125373821.png", headline: "ए से एड़ी", prompt: "Diamond shape! Elegant sound!" } }
      },
      {
        id: "l1_c8_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ए sounds like 'ay'. Say it: ए-ए-ए. एड़ी, एड़ी, एड़ी!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_e.mp3", headline: "ए की ध्वनि", prompt: "Say 'ay': ए... ए... ए" } }
      },
      {
        id: "l1_c8_check",
        label: "Spot ए",
        skillTags: ["recognition"],
        tutorText: "Which diamond-shaped letter is ए?",
        board: { type: "mcq", data: { headline: "Find ए", options: ["ए", "अ", "औ"], answer: "ए", prompt: "Diamond shape!" } }
      },
      {
        id: "l1_c8_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ए elegantly. Say 'ए-ए-ए' as you write!",
        board: { type: "tracing_canvas", data: { headline: "ए लिखना", expression: "ए", prompt: "Diamond with grace. Say 'ay'!" } }
      },
      {
        id: "l1_c8_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "8 vowels done! Your child is learning vowel variety.",
        board: { type: "text", data: { headline: "💡 Heel Game", content: "✓ Point to heels and say 'एड़ी'\n✓ Compare vowel shapes (diamond ए vs pots उ/ऊ)\n✓ Trace elegant diamonds\n✓ Celebrate 8 vowels!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L09",
    parentSummary: { title: "ए Mastered! (8/12 Vowels)", progressPercent: 67 }
  },

  "L1-C01-L09": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L09",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Cool 'ऐ' (AI)",
      category: "Vowels",
      durationMin: 7,
      summary: "Learn ऐ for Ainak (spectacles).",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c9_warmup",
        label: "Eye Helper Hunt",
        skillTags: ["visual"],
        tutorText: "What do we wear on our face to see better? Especially old people and students?",
        board: { type: "text", data: { headline: "Eye Helper", prompt: "Two round glasses... helps you see... spectacles! 👓" } }
      },
      {
        id: "l1_c9_observe",
        label: "Meet ऐ",
        skillTags: ["visual"],
        tutorText: "This is ऐनक (spectacles)! ऐ looks like two circles (like glasses!). The sound is ऐ (like 'ai' in 'wait').",
        board: { type: "visual", data: { assetPath: "/vaani_l1_ainak_ai_1777125396742.png", headline: "ऐ से ऐनक", prompt: "Two circles = two lenses! Two sounds!" } }
      },
      {
        id: "l1_c9_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ऐ sounds like 'ai' in 'wait'. Say it: ऐ-ऐ-ऐ. ऐनक, ऐनक, ऐनक!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ai.mp3", headline: "ऐ की ध्वनि", prompt: "Say 'ai': ऐ... ऐ... ऐ" } }
      },
      {
        id: "l1_c9_check",
        label: "Spot ऐ",
        skillTags: ["recognition"],
        tutorText: "Which one has two circles? That's ऐ!",
        board: { type: "mcq", data: { headline: "Find ऐ", options: ["ऐ", "ए", "औ"], answer: "ऐ", prompt: "Look for the glasses!" } }
      },
      {
        id: "l1_c9_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ऐ. Two circles together! Say 'ऐ-ऐ-ऐ' as you write.",
        board: { type: "tracing_canvas", data: { headline: "ऐ लिखना", expression: "ऐ", prompt: "Two circles (like lenses). Say 'ai'!" } }
      },
      {
        id: "l1_c9_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "9 vowels! Your child is seeing patterns in letter shapes.",
        board: { type: "text", data: { headline: "💡 Spectacle Game", content: "✓ Play with glasses (real or imaginary)\n✓ Draw two circles and say 'ऐनक'\n✓ Find all two-circle shapes\n✓ Trace elegantly" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L10",
    parentSummary: { title: "ऐ Mastered! (9/12 Vowels)", progressPercent: 75 }
  },

  "L1-C01-L10": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L10",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Traditional 'ओ' (O)",
      category: "Vowels",
      durationMin: 7,
      summary: "Learn ओ for Okhli (mortar).",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c10_warmup",
        label: "Kitchen Tool Hunt",
        skillTags: ["visual"],
        tutorText: "What kitchen tool do we use to grind spices? It's a round stone bowl with a pestle!",
        board: { type: "text", data: { headline: "Grinding Tool", prompt: "Round bowl... stone... grinds spices... mortar! 🫕" } }
      },
      {
        id: "l1_c10_observe",
        label: "Meet ओ",
        skillTags: ["visual"],
        tutorText: "This is ओखली (mortar). ओ is a round shape. The sound is ओ (like 'oh').",
        board: { type: "visual", data: { assetPath: "/vaani_l1_okhli_o_1777126185580.png", headline: "ओ से ओखली", prompt: "Round bowl, round sound!" } }
      },
      {
        id: "l1_c10_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ओ sounds like 'oh'. Say it: ओ-ओ-ओ. ओखली, ओखली, ओखली!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_o.mp3", headline: "ओ की ध्वनि", prompt: "Say 'oh': ओ... ओ... ओ" } }
      },
      {
        id: "l1_c10_check",
        label: "Spot ओ",
        skillTags: ["recognition"],
        tutorText: "Which round letter is ओ?",
        board: { type: "mcq", data: { headline: "Find ओ", options: ["ओ", "औ", "ऊ"], answer: "ओ", prompt: "Round bowl!" } }
      },
      {
        id: "l1_c10_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ओ roundly. Say 'ओ-ओ-ओ' as you write!",
        board: { type: "tracing_canvas", data: { headline: "ओ लिखना", expression: "ओ", prompt: "Round and smooth. Say 'oh'!" } }
      },
      {
        id: "l1_c10_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "10 vowels done! 2 more to go!",
        board: { type: "text", data: { headline: "💡 Grinding Game", content: "✓ Use mortar and pestle together\n✓ Say 'ओखली' while grinding\n✓ Practice round sounds\n✓ Draw circles" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L11",
    parentSummary: { title: "ओ Mastered! (10/12 Vowels)", progressPercent: 83 }
  },

  "L1-C01-L11": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L11",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Caring 'औ' (AU)",
      category: "Vowels",
      durationMin: 7,
      summary: "Learn औ for Aurat (woman).",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c11_warmup",
        label: "Family Member Hunt",
        skillTags: ["visual"],
        tutorText: "Who is strong, caring, and important in every family? Who takes care of everyone?",
        board: { type: "text", data: { headline: "Important Person", prompt: "Strong... caring... teaches... mother & women! 👩" } }
      },
      {
        id: "l1_c11_observe",
        label: "Meet औ",
        skillTags: ["visual"],
        tutorText: "This is औरत (woman). औ is a special shape combining ओ and अ. The sound is औ (like 'ou' in 'house').",
        board: { type: "visual", data: { assetPath: "/vaani_l1_aurat_au_1777126210291.png", headline: "औ से औरत", prompt: "Combined shape = combined sound!" } }
      },
      {
        id: "l1_c11_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "औ sounds like 'ou' in 'house'. Say it: औ-औ-औ. औरत, औरत, औरत!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_au.mp3", headline: "औ की ध्वनि", prompt: "Say 'ou': औ... औ... औ" } }
      },
      {
        id: "l1_c11_check",
        label: "Spot औ",
        skillTags: ["recognition"],
        tutorText: "Which combined letter is औ?",
        board: { type: "mcq", data: { headline: "Find औ", options: ["औ", "ओ", "अ"], answer: "औ", prompt: "Combined shape!" } }
      },
      {
        id: "l1_c11_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace औ. It's a combination! Say 'औ-औ-औ' as you write.",
        board: { type: "tracing_canvas", data: { headline: "औ लिखना", expression: "औ", prompt: "Combined curves. Say 'ou'!" } }
      },
      {
        id: "l1_c11_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "11 vowels! Just one more to complete the vowel alphabet!",
        board: { type: "text", data: { headline: "💡 Strength Activity", content: "✓ Discuss women's importance\n✓ Celebrate mothers and sisters\n✓ Trace combined letters\n✓ Say 'औरत' with respect" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C01-L12",
    parentSummary: { title: "औ Mastered! (11/12 Vowels - Almost Done!)", progressPercent: 92 }
  },

  "L1-C01-L12": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-L12",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "Sweet 'अं' (ANG)",
      category: "Vowels",
      durationMin: 7,
      summary: "Learn अं for Angur (grape).",
      xpReward: 50,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c12_warmup",
        label: "Purple Fruit Hunt",
        skillTags: ["visual"],
        tutorText: "What's purple, juicy, and grows in bunches on vines? Sweet and healthy!",
        board: { type: "text", data: { headline: "Purple Bunch", prompt: "Bunches... purple/green... juicy... grapes! 🍇" } }
      },
      {
        id: "l1_c12_observe",
        label: "Meet अं",
        skillTags: ["visual"],
        tutorText: "This is अंगूर (grape). अं is अ with a dot on top (called anusvara). It nasalizes the sound: अंग...",
        board: { type: "visual", data: { assetPath: "/vaani_l1_angoor_ang_1777126234634.png", headline: "अं से अंगूर", prompt: "Dot on top = nasal sound! अंग..." } }
      },
      {
        id: "l1_c12_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "अं adds a nasal 'ng' sound. Say it: अंग्... अंग्... It's like saying 'ng' through your nose!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ang.mp3", headline: "अं की ध्वनि", prompt: "Nasal 'ng': अंग्... अंग्... अंगूर!" } }
      },
      {
        id: "l1_c12_check",
        label: "Spot अं",
        skillTags: ["recognition"],
        tutorText: "Which letter has a dot on top? That's अं!",
        board: { type: "mcq", data: { headline: "Find अं", options: ["अं", "अ", "ः"], answer: "अं", prompt: "Dot = nasal!" } }
      },
      {
        id: "l1_c12_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace अं with its special dot! Say 'अंग्' with nasal sound as you write.",
        board: { type: "tracing_canvas", data: { headline: "अं लिखना", expression: "अं", prompt: "First अ, then the dot. Nasal sound!" } }
      },
      {
        id: "l1_c12_celebration",
        label: "🎉 All 12 Vowels Done!",
        skillTags: ["celebration"],
        tutorText: "Congratulations! Your child has learned all 12 Hindi vowels! This is a HUGE milestone! 🌟",
        board: { type: "text", data: { headline: "Vowel Mastery Complete!", content: "अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं\n\nYour child can now recognize, pronounce, and write all Hindi vowels! Next: consonants (व्यंजन)!" } }
      },
      {
        id: "l1_c12_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Your child has completed the vowel foundation! This is the hardest part. Consonants come next!",
        board: { type: "text", data: { headline: "💡 Celebration Challenge", content: "✓ Celebrate 12 vowels mastery!\n✓ Practice grape sounds together\n✓ Write all vowels on paper\n✓ Review favorite vowels\n✓ Prepare for consonants ahead!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C02-L01",
    parentSummary: {
      title: "अं Mastered! (12/12 VOWELS COMPLETE - 100%)",
      skillsLearned: ["All Hindi vowels", "Pronunciation", "Letter recognition", "Writing"],
      progressPercent: 100,
      achievement: "🏆 Vowel Foundation Complete!"
    }
  },

  // ============= CHAPTER REVIEW: VOWEL MASTERY QUIZ =============

  "L1-C01-REVIEW": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C01-REVIEW",
      chapterId: "C01",
      chapterTitle: "Swar Foundations",
      title: "🌟 Vowel Mastery Sprint",
      category: "Review",
      durationMin: 10,
      summary: "Consolidate all 12 vowels with games and challenges.",
      xpReward: 100,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l1_review_match",
        label: "Match Vowels to Words",
        skillTags: ["recognition", "reading"],
        tutorText: "Can you match each vowel to its word? This tests everything you learned!",
        board: {
          type: "matchingPairs",
          data: {
            headline: "Connect Letters & Words",
            pairs: [
              { left: "अ", right: "अनार" },
              { left: "आ", right: "आम" },
              { left: "इ", right: "इमली" },
              { left: "ई", right: "ईख" },
              { left: "उ", right: "उल्लू" },
              { left: "ऊ", right: "ऊन" },
              { left: "ऋ", right: "ऋषि" },
              { left: "ए", right: "एड़ी" },
              { left: "ऐ", right: "ऐनक" },
              { left: "ओ", right: "ओखली" },
              { left: "औ", right: "औरत" },
              { left: "अं", right: "अंगूर" }
            ]
          }
        }
      },
      {
        id: "l1_review_identify",
        label: "Identify Mixed Vowels",
        skillTags: ["recognition"],
        tutorText: "I'll show you vowels mixed together. Can you identify each one?",
        board: {
          type: "mcq",
          data: {
            headline: "Which vowel am I?",
            prompt: "Look at these 12 mixed vowels. Click the one I describe",
            options: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं"],
            progressMode: true
          }
        }
      },
      {
        id: "l1_review_write",
        label: "Write All Vowels",
        skillTags: ["writing"],
        tutorText: "Show me you can write all 12 vowels in order!",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "Complete Vowel Series",
            expressions: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं"],
            prompt: "Write each vowel as it appears"
          }
        }
      },
      {
        id: "l1_review_story",
        label: "Story: 'My Vowel Adventure'",
        skillTags: ["reading", "comprehension"],
        tutorText: "Read this fun story using all the words you learned!",
        board: {
          type: "text",
          data: {
            headline: "Reading Practice",
            content: "मेरी दादी के घर में एक उल्लू है। उल्लू के पास आम और अनार हैं। ऋषि ईख खा रहे हैं। ऊन से कपड़े बनते हैं। ऐनक से हम ठीक देखते हैं। औरत ओखली से मसाला पीस रही है। सब अंगूर खा रहे हैं!\n\n(Translation: In my grandmother's house there's an owl. The owl has mangoes and pomegranates. Sages eat sugarcane. Clothes are made from wool. With spectacles we see well. The woman grinds spices in a mortar. Everyone eats grapes!)"
          }
        }
      },
      {
        id: "l1_review_speed",
        label: "Speed Challenge",
        skillTags: ["recognition", "pronunciation"],
        tutorText: "Can you recognize and say each vowel quickly? Let's see how fast you are!",
        board: {
          type: "text",
          data: {
            headline: "Fast Recognition Game",
            prompt: "Say each vowel OUT LOUD quickly: अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं\n\nBeat your time!"
          }
        }
      },
      {
        id: "l1_review_reflection",
        label: "Reflection: Which is Your Favorite?",
        skillTags: ["reflection"],
        tutorText: "Which vowel do you like the most? Why? Let's celebrate your learning!",
        board: {
          type: "text",
          data: {
            headline: "Your Learning Journey",
            content: "You started knowing NO Hindi letters. Now you know 12 vowels!\n\nThat's: Recognition + Pronunciation + Writing + Matching!\n\n🎉 AMAZING PROGRESS! 🎉"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C02-L01",
    parentSummary: {
      title: "Vowel Mastery Quiz Complete",
      skillsVerified: ["All 12 vowels", "Recognition", "Pronunciation", "Writing"],
      readyForConsonants: true,
      messageToParent: "Your child has mastered the foundation. They're ready for consonants! Celebrate this achievement—it's the hardest part."
    }
  },

  // ============= KA-GROUP CONSONANTS (4 letters) =============

  "L1-C02-L01": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C02-L01",
      chapterId: "C02",
      chapterTitle: "Ka-Group Vyanjan",
      title: "Beautiful 'क' (KA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn क for Kamal (lotus).",
      xpReward: 60,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c02_l1_warmup",
        label: "Flower Hunt",
        skillTags: ["visual"],
        tutorText: "What beautiful flower grows in water and opens during the day?",
        board: { type: "text", data: { headline: "Water Flower", prompt: "Pink or white... grows in ponds... lotus! 🌸" } }
      },
      {
        id: "l1_c02_l1_observe",
        label: "Meet क",
        skillTags: ["visual"],
        tutorText: "This is कमल (lotus). The letter क starts the first consonant group! क + vowel = कमल, कि, की, कुआँ, etc.",
        board: { type: "visual", data: { assetPath: "/vaani_l1_kamal_ka_1777126528907.png", headline: "क से कमल", prompt: "First consonant! Combines with vowels!" } }
      },
      {
        id: "l1_c02_l1_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "क sounds like 'ka'. Say: क, क, क. कमल, कमल, कमल!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ka.mp3", headline: "क की ध्वनि", prompt: "Say 'ka' (like in 'kite'): क... क... क" } }
      },
      {
        id: "l1_c02_l1_check",
        label: "Spot क",
        skillTags: ["recognition"],
        tutorText: "Which one is क?",
        board: { type: "mcq", data: { headline: "Find क", options: ["क", "ख", "ग"], answer: "क", prompt: "First of the group!" } }
      },
      {
        id: "l1_c02_l1_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace क. Say 'क-क-क' as you write!",
        board: { type: "tracing_canvas", data: { headline: "क लिखना", expression: "क", prompt: "Consonant strokes! Say 'ka'!" } }
      },
      {
        id: "l1_c02_l1_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Consonants are harder! Consonants combine with vowels to make syllables.",
        board: { type: "text", data: { headline: "💡 Syllable Building", content: "क + अ = क\nक + आ = का\nक + इ = कि\nक + ई = की\n\nShow these combinations to your child!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C02-L02",
    parentSummary: { title: "क Mastered! (First Consonant)", progressPercent: 15 }
  },

  "L1-C02-L02": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C02-L02",
      chapterId: "C02",
      chapterTitle: "Ka-Group Vyanjan",
      title: "Swift 'ख' (KHA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn ख for Khargosh (rabbit).",
      xpReward: 60,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c02_l2_warmup",
        label: "Fast Animal Hunt",
        skillTags: ["visual"],
        tutorText: "What fluffy animal hops fast and has long ears?",
        board: { type: "text", data: { headline: "Hopping Friend", prompt: "Fast... ears... hops away! 🐰" } }
      },
      {
        id: "l1_c02_l2_observe",
        label: "Meet ख",
        skillTags: ["visual"],
        tutorText: "This is खरगोश (rabbit). ख is the second consonant in the क group. It has an extra mark: ख. The sound is 'kha' (aspirated).",
        board: { type: "visual", data: { assetPath: "/l1_vyanjan_kha_khargosh.svg", headline: "ख से खरगोश", prompt: "Extra mark = aspirated sound (breathier)!" } }
      },
      {
        id: "l1_c02_l2_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ख sounds like 'kha' but breathier than क. Say: ख, ख, ख. खरगोश, खरगोश!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_kha.mp3", headline: "ख की ध्वनि", prompt: "Breathier 'kha': ख... ख... ख" } }
      },
      {
        id: "l1_c02_l2_check",
        label: "Compare क vs ख",
        skillTags: ["recognition"],
        tutorText: "Which is the aspirated one? ख has that extra line!",
        board: { type: "mcq", data: { headline: "क or ख?", options: ["ख", "क"], answer: "ख", prompt: "Look for the extra mark!" } }
      },
      {
        id: "l1_c02_l2_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ख with the extra aspirated mark!",
        board: { type: "tracing_canvas", data: { headline: "ख लिखना", expression: "ख", prompt: "Extra mark makes it special! Say 'kha'!" } }
      },
      {
        id: "l1_c02_l2_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Notice the pattern: क is hard, ख is soft/breathier. This is the aspiration concept!",
        board: { type: "text", data: { headline: "💡 Aspiration Concept", content: "क = hard (unaspirated)\nख = soft/breathier (aspirated)\n\nYour child is learning Sanskrit phonology!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C02-L03",
    parentSummary: { title: "ख Mastered! (2nd Consonant)", progressPercent: 25 }
  },

  "L1-C02-L03": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C02-L03",
      chapterId: "C02",
      chapterTitle: "Ka-Group Vyanjan",
      title: "Green 'ग' (GA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn ग for Gamla (pot).",
      xpReward: 60,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c02_l3_warmup",
        label: "Plant Container Hunt",
        skillTags: ["visual"],
        tutorText: "What do we use to plant flowers in? It's usually made of clay or plastic!",
        board: { type: "text", data: { headline: "Flower Home", prompt: "Container... clay... plants grow here... flowerpot! 🪴" } }
      },
      {
        id: "l1_c02_l3_observe",
        label: "Meet ग",
        skillTags: ["visual"],
        tutorText: "This is गमला (flowerpot). ग is the third consonant. The sound is 'ga' (voiced like क but softer).",
        board: { type: "visual", data: { assetPath: "/l1_vyanjan_ga_gamla.svg", headline: "ग से गमला", prompt: "Voiced sound! Made deep in throat!" } }
      },
      {
        id: "l1_c02_l3_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ग sounds like 'ga' but voiced (your throat vibrates). Say: ग, ग, ग. गमला, गमला!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ga.mp3", headline: "ग की ध्वनि", prompt: "Voiced 'ga': ग... ग... ग (feel vibration)" } }
      },
      {
        id: "l1_c02_l3_check",
        label: "Spot ग",
        skillTags: ["recognition"],
        tutorText: "Which one is ग?",
        board: { type: "mcq", data: { headline: "Find ग", options: ["ग", "क", "घ"], answer: "ग", prompt: "Third of the group!" } }
      },
      {
        id: "l1_c02_l3_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ग. Say 'ग-ग-ग' (voiced) as you write!",
        board: { type: "tracing_canvas", data: { headline: "ग लिखना", expression: "ग", prompt: "Voiced sound from deep throat!" } }
      },
      {
        id: "l1_c02_l3_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "ग is voiced. Place your hand on your throat and feel the vibration!",
        board: { type: "text", data: { headline: "💡 Voicing Game", content: "✓ Place hand on neck\n✓ Say क (no vibration)\n✓ Say ग (feel vibration)\n✓ This teaches 'voice' in consonants!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C02-L04",
    parentSummary: { title: "ग Mastered! (3rd Consonant)", progressPercent: 35 }
  },

  "L1-C02-L04": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C02-L04",
      chapterId: "C02",
      chapterTitle: "Ka-Group Vyanjan",
      title: "Cozy 'घ' (GHA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn घ for Ghar (home).",
      xpReward: 60,
      difficulty: "Beginner"
    },
    steps: [
      {
        id: "l1_c02_l4_warmup",
        label: "Safe Place Hunt",
        skillTags: ["visual"],
        tutorText: "Where do we live? Where do we feel safe and loved?",
        board: { type: "text", data: { headline: "Safe Haven", prompt: "Safe... family... shelter... home! 🏠" } }
      },
      {
        id: "l1_c02_l4_observe",
        label: "Meet घ",
        skillTags: ["visual"],
        tutorText: "This is घर (home). घ is the fourth consonant—it's ग with the aspirated mark! The sound is 'gha' (voiced + breathier).",
        board: { type: "visual", data: { assetPath: "/l1_vyanjan_gha_ghar.svg", headline: "घ से घर", prompt: "Voiced AND aspirated! Hardest pair!" } }
      },
      {
        id: "l1_c02_l4_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "घ sounds like 'gha'—voiced and aspirated. Say: घ, घ, घ. घर, घर, घर!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_gha.mp3", headline: "घ की ध्वनि", prompt: "Voiced + breathier 'gha': घ... घ... घ" } }
      },
      {
        id: "l1_c02_l4_check",
        label: "Compare ग vs घ",
        skillTags: ["recognition"],
        tutorText: "Which is aspirated? घ has the extra mark!",
        board: { type: "mcq", data: { headline: "ग or घ?", options: ["घ", "ग"], answer: "घ", prompt: "Which has the extra mark?" } }
      },
      {
        id: "l1_c02_l4_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace घ—the most complex ka-group consonant!",
        board: { type: "tracing_canvas", data: { headline: "घ लिखना", expression: "घ", prompt: "Complex shape! Say 'gha' with voice!" } }
      },
      {
        id: "l1_c02_l4_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Ka-group complete! क ख ग घ. Your child learned voice and aspiration!",
        board: { type: "text", data: { headline: "💡 Ka-Group Mastery", content: "✓ क = unvoiced, unaspirated\n✓ ख = unvoiced, aspirated\n✓ ग = voiced, unaspirated\n✓ घ = voiced, aspirated\n\nComplex phonetics—celebrate!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C03-L01",
    parentSummary: { title: "घ Mastered! (Ka-Group Complete - 4 consonants)", progressPercent: 50 }
  },

  // ============= CHA-GROUP CONSONANTS (2 letters) =============

  "L1-C03-L01": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C03-L01",
      chapterId: "C03",
      chapterTitle: "Cha-Group Vyanjan",
      title: "The Wheel 'च' (CHA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn च for Charkha (spinning wheel).",
      xpReward: 60,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l1_c03_l1_warmup",
        label: "Spinning Tool Hunt",
        skillTags: ["visual"],
        tutorText: "What tool spins and makes thread? Gandhi used it! It's on our flag!",
        board: { type: "text", data: { headline: "Spinning Tool", prompt: "Spins... makes thread... on Indian flag... spinning wheel! 🌀" } }
      },
      {
        id: "l1_c03_l1_observe",
        label: "Meet च",
        skillTags: ["visual"],
        tutorText: "This is चरखा (spinning wheel—charkha!). च starts a new group with a different sound. It's palatal (tongue roof)!",
        board: { type: "visual", data: { assetPath: "/l1_vyanjan_cha_charkha.svg", headline: "च से चरखा", prompt: "New place of articulation!" } }
      },
      {
        id: "l1_c03_l1_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "च sounds like 'cha' (like in 'chicken'). Say: च, च, च. चरखा, चरखा!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_cha.mp3", headline: "च की ध्वनि", prompt: "Say 'cha': च... च... च" } }
      },
      {
        id: "l1_c03_l1_check",
        label: "Spot च",
        skillTags: ["recognition"],
        tutorText: "Which one is च?",
        board: { type: "mcq", data: { headline: "Find च", options: ["च", "छ", "ज"], answer: "च", prompt: "Start of cha-group!" } }
      },
      {
        id: "l1_c03_l1_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace च. Say 'च-च-च' as you write!",
        board: { type: "tracing_canvas", data: { headline: "च लिखना", expression: "च", prompt: "Palatal consonant! Say 'cha'!" } }
      },
      {
        id: "l1_c03_l1_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "New group = new tongue position (palate, not teeth). Your child is learning articulation!",
        board: { type: "text", data: { headline: "💡 Articulation Discovery", content: "✓ क ख ग घ = velar (back throat)\n✓ च छ = palatal (roof of mouth)\n✓ Show the difference: back vs roof!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C03-L02",
    parentSummary: { title: "च Mastered! (New Group Started)", progressPercent: 55 }
  },

  "L1-C03-L02": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C03-L02",
      chapterId: "C03",
      chapterTitle: "Cha-Group Vyanjan",
      title: "Umbrella 'छ' (CHHA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn छ for Chatri (umbrella).",
      xpReward: 60,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l1_c03_l2_warmup",
        label: "Rain Protection Hunt",
        skillTags: ["visual"],
        tutorText: "What protects us from rain? We hold it above our head!",
        board: { type: "text", data: { headline: "Rain Shield", prompt: "Protects from rain... above head... umbrella! ☔" } }
      },
      {
        id: "l1_c03_l2_observe",
        label: "Meet छ",
        skillTags: ["visual"],
        tutorText: "This is छतरी (umbrella). छ is the second palatal—it's च with the aspirated mark! The sound is 'chha' (aspirated).",
        board: { type: "visual", data: { assetPath: "/l1_vyanjan_chha_chatri.svg", headline: "छ से छतरी", prompt: "Aspirated palatal sound!" } }
      },
      {
        id: "l1_c03_l2_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "छ sounds like 'chha' but breathier than च. Say: छ, छ, छ. छतरी, छतरी!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_chha.mp3", headline: "छ की ध्वनि", prompt: "Breathier 'chha': छ... छ... छ" } }
      },
      {
        id: "l1_c03_l2_check",
        label: "Compare च vs छ",
        skillTags: ["recognition"],
        tutorText: "Which is aspirated? छ has that extra mark!",
        board: { type: "mcq", data: { headline: "च or छ?", options: ["छ", "च"], answer: "छ", prompt: "Look for the aspirated mark!" } }
      },
      {
        id: "l1_c03_l2_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace छ—the aspirated version!",
        board: { type: "tracing_canvas", data: { headline: "छ लिखना", expression: "छ", prompt: "Aspirated with breathier sound!" } }
      },
      {
        id: "l1_c03_l2_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Cha-group complete! च छ. Your child learned another pair!",
        board: { type: "text", data: { headline: "💡 Cha-Group Pattern", content: "✓ च = unaspirated\n✓ छ = aspirated\n\nYour child sees the pattern now!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C04-L01",
    parentSummary: { title: "छ Mastered! (Cha-Group Complete)", progressPercent: 60 }
  },

  // Continue with remaining consonant groups in abbreviated form for brevity...

  "L1-C04-L01": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C04-L01",
      chapterId: "C04",
      chapterTitle: "Ta-Group Vyanjan",
      title: "Round 'ट' (TA)",
      category: "Consonants",
      durationMin: 7,
      summary: "Learn ट for Tamatar (tomato).",
      xpReward: 60,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l1_c04_l1_warmup",
        label: "Red Vegetable Hunt",
        skillTags: ["visual"],
        tutorText: "What's red, round, and used in cooking? We put it in salad and curries!",
        board: { type: "text", data: { headline: "Red Veggie", prompt: "Red... round... juicy... tomato! 🍅" } }
      },
      {
        id: "l1_c04_l1_observe",
        label: "Meet ट",
        skillTags: ["visual"],
        tutorText: "This is टमाटर (tomato). ट is retroflex (tongue curled back). Sound: 'ta'.",
        board: { type: "visual", data: { assetPath: "/l1_vyanjan_ta_tamatar.svg", headline: "ट से टमाटर", prompt: "Retroflex: tongue curled back!" } }
      },
      {
        id: "l1_c04_l1_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ट sounds like 'ta' (with tongue curled). Say: ट, ट, ट. टमाटर!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ta.mp3", headline: "ट की ध्वनि", prompt: "Say 'ta' (retroflex). ट... ट... ट" } }
      },
      {
        id: "l1_c04_l1_check",
        label: "Spot ट",
        skillTags: ["recognition"],
        tutorText: "Which one is ट?",
        board: { type: "mcq", data: { headline: "Find ट", options: ["ट", "त", "ठ"], answer: "ट", prompt: "Retroflex group!" } }
      },
      {
        id: "l1_c04_l1_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ट!",
        board: { type: "tracing_canvas", data: { headline: "ट लिखना", expression: "ट", prompt: "Retroflex sound!" } }
      },
      {
        id: "l1_c04_l1_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "New articulation: retroflex (tongue curled back). Very Indian sound!",
        board: { type: "text", data: { headline: "💡 Retroflex Discovery", content: "✓ Curl tongue back\n✓ Say 'ta' with curled tongue\n✓ This is unique to Hindi!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C06-L01",
    parentSummary: { title: "ट Mastered! (Retroflex Consonant)", progressPercent: 65 }
  },

  // ============= PA-GROUP & HA =============

  "L1-C06-L01": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C06-L01",
      chapterId: "C06",
      chapterTitle: "Pa-Group Vyanjan",
      title: "Flying 'प' (PA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn प for Patang (kite).",
      xpReward: 60,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l1_c06_l1_warmup",
        label: "Sky Flyer Hunt",
        skillTags: ["visual"],
        tutorText: "What flies high in the sky? We fly it with a string during Makar Sankranti!",
        board: { type: "text", data: { headline: "Flying Toy", prompt: "Flies high... string... colorful... kite! 🪁" } }
      },
      {
        id: "l1_c06_l1_observe",
        label: "Meet प",
        skillTags: ["visual"],
        tutorText: "This is पतंग (kite). प is labial (with lips). The sound is 'pa'.",
        board: { type: "visual", data: { assetPath: "/vaani_l1_patang_pa_1777164221280.png", headline: "प से पतंग", prompt: "Labial consonant!" } }
      },
      {
        id: "l1_c06_l1_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "प sounds like 'pa' (with lips). Say: प, प, प. पतंग, पतंग!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_pa.mp3", headline: "प की ध्वनि", prompt: "Say 'pa' with lips: प... प... प" } }
      },
      {
        id: "l1_c06_l1_check",
        label: "Spot प",
        skillTags: ["recognition"],
        tutorText: "Which one is प?",
        board: { type: "mcq", data: { headline: "Find प", options: ["प", "फ", "ब"], answer: "प", prompt: "Labial group!" } }
      },
      {
        id: "l1_c06_l1_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace प!",
        board: { type: "tracing_canvas", data: { headline: "प लिखना", expression: "प", prompt: "Say 'pa' with lips!" } }
      },
      {
        id: "l1_c06_l1_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "Labial consonants use lips! प ब म all use both lips!",
        board: { type: "text", data: { headline: "💡 Lips Discovery", content: "✓ Try saying प (lips together)\n✓ Try saying ब (lips apart, vibrate)\n✓ Try saying म (nose + lips)" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C06-L03",
    parentSummary: { title: "प Mastered! (Labial Group Started)", progressPercent: 70 }
  },

  "L1-C06-L03": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C06-L03",
      chapterId: "C06",
      chapterTitle: "Pa-Group Vyanjan",
      title: "Waddling 'ब' (BA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn ब for Batakh (duck).",
      xpReward: 60,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l1_c06_l3_warmup",
        label: "Water Bird Hunt",
        skillTags: ["visual"],
        tutorText: "What bird waddles and swims? It quacks and has orange feet!",
        board: { type: "text", data: { headline: "Swimming Bird", prompt: "Waddles... quacks... swims... duck! 🦆" } }
      },
      {
        id: "l1_c06_l3_observe",
        label: "Meet ब",
        skillTags: ["visual"],
        tutorText: "This is बतख (duck). ब is labial and voiced. The sound is 'ba'.",
        board: { type: "visual", data: { assetPath: "/vaani_l1_batakh_ba_1777164267319.png", headline: "ब से बतख", prompt: "Voiced labial! Throat vibrates!" } }
      },
      {
        id: "l1_c06_l3_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ब sounds like 'ba' (voiced, lips vibrate). Say: ब, ब, ब. बतख, बतख!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ba.mp3", headline: "ब की ध्वनि", prompt: "Voiced 'ba': ब... ब... ब" } }
      },
      {
        id: "l1_c06_l3_check",
        label: "Compare प vs ब",
        skillTags: ["recognition"],
        tutorText: "Which is voiced (ब)? Feel the vibration!",
        board: { type: "mcq", data: { headline: "प or ब?", options: ["ब", "प"], answer: "ब", prompt: "Which vibrates?" } }
      },
      {
        id: "l1_c06_l3_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ब!",
        board: { type: "tracing_canvas", data: { headline: "ब लिखना", expression: "ब", prompt: "Voiced sound! Throat vibrates!" } }
      },
      {
        id: "l1_c06_l3_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "ब is voiced! Hand on throat to feel vibration!",
        board: { type: "text", data: { headline: "💡 Voicing Comparison", content: "✓ Say प (no vibration on throat)\n✓ Say ब (feel vibration)\n✓ Repeat: प-ब, प-ब, प-ब" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C06-L05",
    parentSummary: { title: "ब Mastered! (Labial Group Continues)", progressPercent: 75 }
  },

  "L1-C06-L05": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C06-L05",
      chapterId: "C06",
      chapterTitle: "Pa-Group Vyanjan",
      title: "Shimmering 'म' (MA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn म for Machli (fish).",
      xpReward: 60,
      difficulty: "Intermediate"
    },
    steps: [
      {
        id: "l1_c06_l5_warmup",
        label: "Water Animal Hunt",
        skillTags: ["visual"],
        tutorText: "What animal swims and has scales? It lives in water and we eat it sometimes!",
        board: { type: "text", data: { headline: "Swimming Creature", prompt: "Swims... scales... in water... fish! 🐠" } }
      },
      {
        id: "l1_c06_l5_observe",
        label: "Meet म",
        skillTags: ["visual"],
        tutorText: "This is मछली (fish). म is nasal and labial (sound goes through nose + lips). The sound is 'ma'.",
        board: { type: "visual", data: { assetPath: "/vaani_l1_machli_ma_1777164308458.png", headline: "म से मछली", prompt: "Nasal labial! Sound through nose!" } }
      },
      {
        id: "l1_c06_l5_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "म sounds like 'ma' (nasal). Feel the sound through your nose! Say: म, म, म. मछली, मछली!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ma.mp3", headline: "म की ध्वनि", prompt: "Nasal 'ma': feel nose vibration: म... म... म" } }
      },
      {
        id: "l1_c06_l5_check",
        label: "Spot म",
        skillTags: ["recognition"],
        tutorText: "Which one is म?",
        board: { type: "mcq", data: { headline: "Find म", options: ["म", "ब", "न"], answer: "म", prompt: "Nasal labial!" } }
      },
      {
        id: "l1_c06_l5_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace म!",
        board: { type: "tracing_canvas", data: { headline: "म लिखना", expression: "म", prompt: "Nasal labial sound!" } }
      },
      {
        id: "l1_c06_l5_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "म is nasal! Pinch nose and it changes! This shows nasality!",
        board: { type: "text", data: { headline: "💡 Nasality Discovery", content: "✓ Say 'ma' normally\n✓ Say 'ma' while pinching nose\n✓ Notice the difference!\n✓ That's nasality!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C08-L01",
    parentSummary: { title: "म Mastered! (Pa-Group Complete)", progressPercent: 80 }
  },

  "L1-C08-L01": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C08-L01",
      chapterId: "C08",
      chapterTitle: "Ha-Sha Group",
      title: "Strong 'ह' (HA)",
      category: "Consonants",
      durationMin: 8,
      summary: "Learn ह for Hathi (elephant).",
      xpReward: 60,
      difficulty: "Advanced"
    },
    steps: [
      {
        id: "l1_c08_l1_warmup",
        label: "Largest Animal Hunt",
        skillTags: ["visual"],
        tutorText: "What's the largest land animal? It has a long trunk and big ears!",
        board: { type: "text", data: { headline: "Biggest Land Animal", prompt: "Huge... trunk... ears... elephant! 🐘" } }
      },
      {
        id: "l1_c08_l1_observe",
        label: "Meet ह",
        skillTags: ["visual"],
        tutorText: "This is हाथी (elephant). ह is the last major consonant—it's a glottal breath sound. The sound is 'ha'.",
        board: { type: "visual", data: { assetPath: "/vaani_l1_hathi_ha_1777164643586.png", headline: "ह से हाथी", prompt: "Glottal breath sound! Like exhaling!" } }
      },
      {
        id: "l1_c08_l1_pronounce",
        label: "Say the Sound",
        skillTags: ["pronunciation"],
        tutorText: "ह sounds like 'ha'—it's just breathing with a little voice. Say: ह, ह, ह. हाथी, हाथी!",
        board: { type: "audio_playback", data: { audioUrl: "/sounds/hindi_ha.mp3", headline: "ह की ध्वनि", prompt: "Breath + voice: ह... ह... ह" } }
      },
      {
        id: "l1_c08_l1_check",
        label: "Spot ह",
        skillTags: ["recognition"],
        tutorText: "Which one is ह?",
        board: { type: "mcq", data: { headline: "Find ह", options: ["ह", "म", "न"], answer: "ह", prompt: "Last major consonant!" } }
      },
      {
        id: "l1_c08_l1_trace",
        label: "Trace & Write",
        skillTags: ["writing"],
        tutorText: "Trace ह!",
        board: { type: "tracing_canvas", data: { headline: "ह लिखना", expression: "ह", prompt: "Glottal breath! Say 'ha'!" } }
      },
      {
        id: "l1_c08_l1_parent_tip",
        label: "Parent Coaching",
        skillTags: ["parent_guidance"],
        tutorText: "ह is just breathing! This finishes the major consonants!",
        board: { type: "text", data: { headline: "💡 All Major Consonants Done!", content: "Your child has learned:\n✓ 12 Vowels\n✓ 8 Major Consonants\n\nThat's 20 letters! Huge milestone!" } }
      }
    ],
    nextLessonUrl: "/hindiguru/course/l1/lesson/L1-C02-REVIEW",
    parentSummary: {
      title: "ह Mastered! (20/20 Major Letters Complete!)",
      achievement: "🏆 ALL MAJOR VOWELS & CONSONANTS MASTERED!",
      progressPercent: 100
    }
  },

  // ============= CONSONANT CHAPTER REVIEW =============

  "L1-C02-REVIEW": {
    course: { title: "Vaani AI Level 1", grade: "1", levelSlug: "l1" },
    lesson: {
      id: "L1-C02-REVIEW",
      chapterId: "C02-C08",
      chapterTitle: "Consonant Mastery",
      title: "🏆 Complete Hindi Alphabet Sprint",
      category: "Review",
      durationMin: 15,
      summary: "Master all 20 major Hindi letters!",
      xpReward: 200,
      difficulty: "Advanced"
    },
    steps: [
      {
        id: "l1_cons_review_match",
        label: "Match All Consonants",
        skillTags: ["recognition"],
        tutorText: "Can you match all 8 consonants to their words? Show what you've learned!",
        board: {
          type: "matchingPairs",
          data: {
            headline: "Consonant Memory",
            pairs: [
              { left: "क", right: "कमल" },
              { left: "ख", right: "खरगोश" },
              { left: "ग", right: "गमला" },
              { left: "घ", right: "घर" },
              { left: "च", right: "चरखा" },
              { left: "छ", right: "छतरी" },
              { left: "ट", right: "टमाटर" },
              { left: "प", right: "पतंग" },
              { left: "ब", right: "बतख" },
              { left: "म", right: "मछली" },
              { left: "ह", right: "हाथी" }
            ]
          }
        }
      },
      {
        id: "l1_cons_review_all",
        label: "All 20 Letters Quiz",
        skillTags: ["recognition"],
        tutorText: "Mix vowels and consonants! Can you find them all?",
        board: {
          type: "mcq",
          data: {
            headline: "All 20 Letters",
            prompt: "This quiz covers: अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं + क ख ग घ च छ ट प ब म ह",
            progressMode: true
          }
        }
      },
      {
        id: "l1_cons_review_story",
        label: "Story Time",
        skillTags: ["reading"],
        tutorText: "Read this fun story with ALL the words you learned!",
        board: {
          type: "text",
          data: {
            headline: "My Hindi Adventure",
            content: "खरगोश कमल के पास गमले में छतरी पकड़कर चरखे को घर में रख रहा है। ह हाथी पतंग उड़ा रहा है। बतख मछली खा रहा है। औरत अंगूर और टमाटर रख रही है। ऋषि ऊन से कपड़े बना रहे हैं! सब खुश हैं!\n\n(Everyone is busy doing their tasks and everything is happy!)"
          }
        }
      },
      {
        id: "l1_cons_review_write",
        label: "Write All 20",
        skillTags: ["writing"],
        tutorText: "Show me you can write all 20 letters!",
        board: {
          type: "tracing_canvas",
          data: {
            headline: "Complete Alphabet",
            expressions: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "क", "ख", "ग", "घ", "च", "छ", "ट", "प", "ब", "म", "ह"],
            prompt: "Write each letter as it appears"
          }
        }
      },
      {
        id: "l1_cons_review_celebration",
        label: "🎉 COMPLETE MASTERY!",
        skillTags: ["celebration"],
        tutorText: "You've done it! All 20 letters! This is incredible progress!",
        board: {
          type: "text",
          data: {
            headline: "Hindi Alphabet Complete!",
            content: "अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं क ख ग घ च छ ट प ब म ह\n\n🎓 Your child can now:\n✓ Recognize all Hindi vowels & major consonants\n✓ Pronounce correctly\n✓ Write letters\n✓ Match to words\n✓ Read simple stories!\n\n🏆 LEVEL 1 COMPLETE! 🏆"
          }
        }
      }
    ],
    nextLessonUrl: "/hindiguru/parent",
    parentSummary: {
      title: "🏆 LEVEL 1 COMPLETELY MASTERED",
      totalLetters: 20,
      skillsAcquired: ["Vowel mastery", "Consonant recognition", "Proper pronunciation", "Letter writing", "Word reading", "Story comprehension"],
      readyForLevel2: true,
      messageToParent: "Congratulations! Your child has completed the entire Hindi foundational level. They can now recognize, pronounce, and write all major vowels and consonants. Level 2 will build syllables and words. Celebrate this massive achievement!"
    }
  }
};
