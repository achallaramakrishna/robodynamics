import { HindiGuruCoursePayload } from "./hindiGuruTypes";

import fs from "fs";
import path from "path";

export interface HindiGuruLessonPayload {
  course: {
    title: string;
    grade: string;
    levelSlug: string;
  };
  lesson: {
    id: string;
    title: string;
    category: string;
    durationMin: number;
    summary: string;
    xpReward: number;
  };
  steps: Array<{
    id: string;
    label: string;
    tutorText: string;
    explanation?: {
      title: string;
      body: string;
      mistakeTip?: string;
    };
    board: {
      type: "visual" | "text" | "interactive";
      data: {
        assetPath?: string;
        headline?: string;
        expression?: string;
        prompt?: string;
        steps?: string[];
      };
    };
    practice?: {
      mode: "none" | "typed" | "quiz";
      answer?: string | number;
      hints?: string[];
      questions?: Array<{ prompt: string; answer: string | number }>;
    };
  }>;
  helpActions: Array<{ id: string; label: string }>;
  nextLessonUrl?: string;
}

export function buildHindiGuruCoursePayload(grade: string): HindiGuruCoursePayload {
  const gradeLabel = grade.replace("grade-", "Grade ");
  const gradeNum = grade.replace("grade-", "");
  
  if (gradeNum.startsWith("12")) {
    let dynamicLessons: any[] = [];
    try {
      const jsonPath = path.join(process.cwd(), '../tutor-api/content-template/hindi_guru/chapters.json');
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, "utf8");
        const data = JSON.parse(raw);
        dynamicLessons = data.chapters
          .filter((c: any) => c.gradeBand.includes("12"))
          .map((c: any, index: number) => ({
            id: c.chapterCode,
            order: index + 1,
            title: c.title,
            category: "Literature",
            durationMin: c.estimatedMinutes || 45,
            status: "available",
            summary: "Tap Start Lesson to launch the AI Tutor.",
            skill: "Comprehension",
            boardPreview: { type: "text", data: { headline: c.title } },
            startUrl: `/ai-tutor/tutor?courseId=hindi_guru&chapterCode=${c.chapterCode}`
          }));
      }
    } catch (e) {
      console.error(e);
    }

    return {
      course: {
        title: `${gradeLabel}: Senior Secondary Hindi`,
        subtitle: "Advanced Literary Analysis & Aesthetic Decoding",
        tagline: "Mastering Modernism, Identity & Social Critique",
        color: "#880E4F",
        progressPct: 5,
        completedLessons: 0,
        totalLessons: dynamicLessons.length || 1,
      },
      lessons: dynamicLessons.length > 0 ? dynamicLessons : [
        {
          id: "HIN_G12_AR_CH1", order: 1, title: "आत्मपरिचय (Aatmparichay)", category: "Poetry", durationMin: 25, status: "available", summary: "Identity", skill: "Metaphor Decoding", boardPreview: { type: "text", data: { headline: "Fallback" } }
        }
      ],
      selectedLesson: dynamicLessons[0] || {
        id: "HIN_G12_AR_CH1",
        order: 1,
        title: "Aatmparichay",
        category: "Poetry",
        durationMin: 25,
        status: "available",
        summary: "Do you know who you are?",
        skill: "Critical Analysis",
        boardPreview: { type: "visual", data: { headline: "Aatmparichay Board" } },
        outcomes: [
          "Decode Virodhabhas",
        ],
        startUrl: `/hindiguru/course/${grade}/lesson/HIN_G12_AR_CH1`
      }
    };
  }

  return {
    course: {
      title: `${gradeLabel}: Comprehensive Hindi`,
      subtitle: "NCERT mapped curriculum for Second Language learners",
      tagline: "Bridging the gap with native language support",
      color: "#FF9933",
      progressPct: 15,
      completedLessons: 1,
      totalLessons: 8,
    },
    lessons: [
      {
        id: "HIN_G1_CH1",
        order: 1,
        title: "Meena ka Parivar",
        category: "Conversation",
        durationMin: 15,
        status: "available",
        summary: "Introduction to family relations and basic 'Da' sound words.",
        skill: "Vocabulary",
        boardPreview: { type: "visual", data: { assetPath: "/family_portrait.svg" } }
      },
      {
        id: "HIN_G1_CH2",
        order: 2,
        title: "Varnamala Foundations",
        category: "Alphabet Basics",
        durationMin: 15,
        status: "locked",
        summary: "Learn Hindi vowels with fun associations and visual storytelling.",
        skill: "Character Recognition",
        boardPreview: { type: "visual", data: { assetPath: "varnamala_intro" } }
      }
    ],
    selectedLesson: {
      id: "HIN_G1_CH1",
      order: 1,
      title: "Meena ka Parivar",
      category: "Conversation",
      durationMin: 15,
      status: "available",
      summary: "Meet Meena's family of 7! Learn Hindi names for family members and bridge them with South Indian terms.",
      skill: "Vocabulary",
      boardPreview: { type: "visual", data: { assetPath: "/family_portrait.svg" } },
      outcomes: [
        "Identify terms like Mata, Pita, Dada, Dadi",
        "Learn the sound 'Da' (as in Grandfather)",
        "Bridge with South Indian terms: Appa, Amma"
      ],
      startUrl: `/hindiguru/course/${grade}/lesson/HIN_G1_CH1`
    }
  };
}

export function getHindiGuruLesson(grade: string, lessonId: string): HindiGuruLessonPayload {
  // Grade 12 - Aatmparichay
  if (lessonId === "HIN_G12_AR_CH1") {
    return {
      course: {
        title: "Senior Secondary Hindi (G12)",
        grade: "12",
        levelSlug: grade
      },
      lesson: {
        id: "HIN_G12_AR_CH1",
        title: "Aatmparichay (Bachchan)",
        category: "Poetry (Chayavad Aesthetics)",
        durationMin: 25,
        summary: "Identity and Duality in Modern Poetry",
        xpReward: 300
      },
      steps: [
        {
          id: "intro_g12",
          label: "Mission Briefing",
          tutorText: "Welcome to the Senior Secondary Academy. Today, we decode Harivansh Rai Bachchan's masterpiece. He asks: Who are we in the face of the world? Are you ready for a deep philosophical inquiry?",
          board: {
            type: "visual",
            data: {
              headline: "आत्मपरिचय (Aatmparichay)",
              prompt: "Understanding the balance between 'Self' and 'Society'.",
              steps: ["Individual Identity", "Social Responsibility", "The Middle Path"]
            }
          },
          practice: { mode: "none" }
        },
        {
          id: "virodhabhas",
          label: "Aesthetic Decoding",
          tutorText: "Bachchan uses 'Virodhabhas' or Oxymoron. He says he carries the 'Fire of coldness' (Sheetal Vaani mein Aag). How can a cool voice have fire? This is the core of modern identity.",
          explanation: {
            title: "The Oxymoron: Virodhabhas",
            body: "A device where two contradictory terms appear in conjunction. It represents the poet's internal struggle.",
            mistakeTip: "Don't just look at the words; look at the emotion behind the contradiction."
          },
          board: {
            type: "interactive",
            data: {
              expression: "शीतल वाणी में आग",
              prompt: "Decoding the Duality",
              steps: ["Coldness = Calm Exterior", "Fire = Intense Interior passion"]
            }
          },
          practice: {
            mode: "quiz",
            questions: [
              { prompt: "What literary device is 'Fire of Coldness'?", answer: "Virodhabhas" },
              { prompt: "Who is the poet of Aatmparichay?", answer: "Harivansh Rai Bachchan" }
            ]
          }
        },
        {
          id: "the_metaphor",
          label: "Critical Metaphor",
          tutorText: "He drinks the 'Sura (Intoxication) of Love'. This Sura isn't wine; it's a state of being where the world's noise fades. Let's analyze this advanced sentiment.",
          board: {
            type: "visual",
            data: {
              headline: "स्नेह-सुरा (Sneh-Sura)",
              prompt: "The Metaphor of Love-Intoxication",
              steps: ["Sura = Focus / State of Mind", "Sneh = Universal Compassion"]
            }
          },
          practice: {
            mode: "typed",
            answer: "Love",
            questions: [{ prompt: "What does 'Sneh' signify in the poem?", answer: "Love" }]
          }
        }
      ],
      helpActions: [
        { id: "literary_context", label: "Get Literary Context" },
        { id: "socratic_hint", label: "Analyze Deeper" }
      ],
      nextLessonUrl: `/hindiguru/course/${grade}`
    };
  }

  // Mock Grade 1 Lesson 1 specifically
  if (lessonId === "HIN_G1_CH1") {
    return {
      course: {
        title: "Hindi Guru Grade 1",
        grade: "1",
        levelSlug: grade
      },
      lesson: {
        id: "HIN_G1_CH1",
        title: "Meena ka Parivar",
        category: "Conversation",
        durationMin: 15,
        summary: "Meena's Family Story",
        xpReward: 100
      },
      steps: [
        {
          id: "intro",
          label: "Introduction",
          tutorText: "Namaste! I am Bhasha Guru. Today we will meet Meena and her wonderful family. Are you ready?",
          board: {
            type: "visual",
            data: {
              assetPath: "/family_portrait.svg",
              headline: "Meena Ka Parivar",
              prompt: "Look at Meena's family! There are 7 people here."
            }
          },
          practice: { mode: "none" }
        },
        {
          id: "vocab",
          label: "Family Vocabulary",
          tutorText: "In Hindi, 'Pita' means Father. In many South Indian languages, we say 'Appa'. It's so similar!",
          explanation: {
            title: "Father & Mother",
            body: "Pita (Father) and Mata (Mother) are the foundational words of any family.",
            mistakeTip: "Don't forget the 'ji' at the end for respect: Pitaji, Mataji!"
          },
          board: {
            type: "interactive",
            data: {
              expression: "Pita | Mata",
              steps: ["Pita = Father (Appa/Nanna)", "Mata = Mother (Amma/Thayi)"]
            }
          },
          practice: {
            mode: "typed",
            answer: "Father",
            hints: ["What does 'Pita' mean in English?"],
            questions: [{ prompt: "What is the English word for 'Pita'?", answer: "Father" }]
          }
        },
        {
          id: "sound_da",
          label: "Phonetics: 'Da'",
          tutorText: "Listen to the sound 'Da'. It's in Dada (Grandfather) and Dadi (Grandmother). Can you hear it?",
          board: {
            type: "visual",
            data: {
              assetPath: "/hs_bird_1775993692539.png", // Just a placeholder for now
              headline: "The sound 'Da' (द)",
              steps: ["दादा (Dada)", "दादी (Dadi)", "दिवाकर (Divakar)"]
            }
          },
          practice: {
            mode: "quiz",
            questions: [
              { prompt: "Which word starts with 'Da'?", answer: "Dada" },
              { prompt: "Is 'Mata' starting with 'Da'?", answer: "No" }
            ]
          }
        }
      ],
      helpActions: [
        { id: "explain_again", label: "Explain Again" },
        { id: "stuck", label: "I am Stuck" }
      ],
      nextLessonUrl: `/hindiguru/course/${grade}`
    };
  }

  // Fallback
  return {
    course: { title: "Hindi Guru", grade: "1", levelSlug: grade },
    lesson: { id: lessonId, title: "Next Lesson", category: "Core", durationMin: 10, summary: "Continue your journey.", xpReward: 50 },
    steps: [{ id: "start", label: "Start", tutorText: "Let's begin this lesson.", board: { type: "text", data: { headline: "Coming Soon" } } }],
    helpActions: [{ id: "hint", label: "Get Hint" }]
  };
}
