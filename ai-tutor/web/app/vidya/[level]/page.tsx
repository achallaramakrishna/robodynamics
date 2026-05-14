import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import { loadVidyaCompletedLessons } from "@/lib/vidyaProgressDb";
import VidyaCourseClient from "./VidyaCourseClient";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [
    { level: "level-1" },
  ];
}

export default async function VidyaLevelPage({ params }: { params: { level: string } }) {
  const { level } = params;
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);
  
  let completedLessons: string[] = [];
  if (session) {
    try {
      const studentId = session.childId || session.userId;
      completedLessons = await loadVidyaCompletedLessons(studentId);
    } catch (e) {
      console.error("[VidyaCoursePage] Failed to fetch progress from database:", e);
    }
  }

  const completedSet = new Set(completedLessons);

  // Define our full, rich lesson plan for Level 1 Foundations
  const allLessonsRaw = [
    {
      id: "PY_L1_01_SETUP",
      order: 1,
      title: "Welcome to the Python Adventure",
      sutra: "I/O Streams",
      objective: "Master controlling input and output streams using standard input/output models.",
      durationMin: 45,
      difficulty: 1,
      summary: "Every great application begins by talking to the user. Establish a bridge between you and the computer's memory by capturing dynamic input.",
      outcomes: [
        "Control input and output streams using print() and input().",
        "Store and retrieve data dynamically using labeled variables.",
        "Construct clean, modern f-string formats for personalized output."
      ],
      codePreview: `bot_name = input("What is my name? ")\nprint(f"Beep boop. I am {bot_name}.")`,
      startUrl: "/vidya/lesson/PY_L1_01_SETUP",
      isInteractive: true,
    },
    {
      id: "PY_L1_02_DATA",
      order: 2,
      title: "Variables, Types & Operators",
      sutra: "Data Casting",
      objective: "Understand core types (int, float, str, bool) and cast values to prevent crash exceptions.",
      durationMin: 50,
      difficulty: 1,
      summary: "Python tracks variable types automatically. Learn how to verify types dynamically and cast values to run clean calculations.",
      outcomes: [
        "Store and handle integers, floating decimals, text strings, and boolean values.",
        "Perform safe algebraic calculations with operators.",
        "Prevent standard input crashes using the int() and float() casting wrappers."
      ],
      codePreview: `age_text = input("Enter age: ")\nage = int(age_text)\nis_student = True\nprint(f"Student: {is_student}, Age next year: {age + 1}")`,
      startUrl: "#",
      isInteractive: false,
    },
    {
      id: "PY_L1_03_CONTROL",
      order: 3,
      title: "Functions, Lists & Loops",
      sutra: "Iteration Chains",
      objective: "Define reusable functions and repeat operations across data blocks safely.",
      durationMin: 60,
      difficulty: 2,
      summary: "Break heavy tasks into clean, reusable functions, store sequential elements in lists, and loop over them effortlessly.",
      outcomes: [
        "Encapsulate statements inside custom functions with def and return.",
        "Store, access, and append sequential lists of variables.",
        "Run automated looping cycles over lists using clean for and while rules."
      ],
      codePreview: `def greet(user):\n    return f"Welcome, {user}!"\n\nfor name in ["Asha", "Raj"]:\n    print(greet(name))`,
      startUrl: "#",
      isInteractive: false,
    },
    {
      id: "PY_L1_04_LOGIC",
      order: 4,
      title: "Dynamic Decisions",
      sutra: "Logic Gates",
      objective: "Build branching evaluation gates using if, elif, and else.",
      durationMin: 50,
      difficulty: 2,
      summary: "Applications must choose between different paths depending on raw scores. Master logical evaluation blocks and indentation safety rules.",
      outcomes: [
        "Design conditional evaluation structures using if/else.",
        "Isolate and resolve standard block indentation and block syntax errors.",
        "Verify boolean conditions with comparison checks."
      ],
      codePreview: `score = int(input("Score: "))\nif score >= 90:\n    print("Elite Access Granted")\nelse:\n    print("Standard Access Granted")`,
      startUrl: "/vidya/lesson/PY_L1_04_LOGIC",
      isInteractive: true,
    },
    {
      id: "PY_L1_05_FILES_EXCEPTIONS",
      order: 5,
      title: "File I/O & Exception Handling",
      sutra: "Defensive Pipelines",
      objective: "Read and write external files safely while capturing standard system crash warnings.",
      durationMin: 70,
      difficulty: 2,
      summary: "Build resilient integrations. Learn how to open, read, and write disk files, and capture missing file issues before they trigger a crash.",
      outcomes: [
        "Open, read, and write disk files cleanly using with structures.",
        "Defend programs against runtime failures with try/except wrappers.",
        "Handle missing resources gracefully instead of terminating unexpectedly."
      ],
      codePreview: `try:\n    with open("data.txt") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("Resource not found!")`,
      startUrl: "#",
      isInteractive: false,
    },
    {
      id: "PY_L1_06_MODULES_OOP_REVIEW",
      order: 6,
      title: "Modules, OOP & Review",
      sutra: "Object Blueprinting",
      objective: "Model objects using custom Class rules and extend features with core modular libraries.",
      durationMin: 55,
      difficulty: 3,
      summary: "Model complex real-world entities. Write object classes, create properties, and review Level 1 structures in a final project.",
      outcomes: [
        "Create custom objects containing distinct properties and functions.",
        "Import native modular extensions to inject advanced capabilities.",
        "Deploy the ultimate cumulative review challenge of Level 1 Foundations."
      ],
      codePreview: `class Robot:\n    def __init__(self, name):\n        self.name = name\n    def ping(self):\n        print(f"Beep. I am {self.name}")\n\nbot = Robot("Byte")\nbot.ping()`,
      startUrl: "#",
      isInteractive: false,
    }
  ];

  // Dynamic progression calculator:
  // First, find which interactive lessons are incomplete
  const incompleteInteractive = allLessonsRaw.filter(l => l.isInteractive && !completedSet.has(l.id));
  
  // The "active" / "current" lesson is the first incomplete interactive one,
  // or the last interactive one if all are completed.
  const currentInteractiveId = incompleteInteractive.length > 0 
    ? incompleteInteractive[0].id 
    : "PY_L1_04_LOGIC";

  // Now, calculate the status of each lesson
  const lessons = allLessonsRaw.map((lesson) => {
    let status: "completed" | "current" | "available" | "locked" = "locked";

    if (completedSet.has(lesson.id)) {
      status = "completed";
    } else if (lesson.id === currentInteractiveId) {
      status = "current";
    } else if (lesson.isInteractive) {
      // If it's interactive but not completed and not current, it's unlocked/available to click
      status = "available";
    } else {
      // Non-interactive (future/coming soon) lessons are locked
      status = "locked";
    }

    return {
      id: lesson.id,
      order: lesson.order,
      title: lesson.title,
      sutra: lesson.sutra,
      objective: lesson.objective,
      durationMin: lesson.durationMin,
      difficulty: lesson.difficulty,
      status,
      summary: lesson.summary,
      outcomes: lesson.outcomes,
      codePreview: lesson.codePreview,
      startUrl: lesson.startUrl,
    };
  });

  const completedLessonsCount = lessons.filter((l) => l.status === "completed").length;
  // Progress is calculated out of the interactive, active lessons (2 lessons total)
  const totalActiveLessons = 2; 
  const progressPct = Math.round((completedLessonsCount / totalActiveLessons) * 100);
  const earnedXp = completedLessonsCount * 100; // Let's say 100 XP per lesson

  const payload = {
    course: {
      id: "vidya_core",
      levelId: "L1",
      levelSlug: "level-1",
      title: "Vidya Python Core",
      subtitle: "The Foundation Sutra",
      tagline: "Master the syntax. Control the machine.",
      completedLessons: completedLessonsCount,
      totalLessons: totalActiveLessons,
      progressPct,
      earnedXp,
      totalXpAvailable: totalActiveLessons * 100,
    },
    lessons,
    selectedLessonId: currentInteractiveId,
  };

  return <VidyaCourseClient payload={payload} />;
}
