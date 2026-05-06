import type { VidyaLessonPayload } from "./vidyaLessonTypes";
import type { AppSession } from "./appSession";
import {
  buildIntroHook,
  buildConceptCard,
  buildCodeWalkthrough,
  buildConceptCheck,
  buildPythonChallenge,
  buildRecapSummary,
  buildBugHunt,
  buildOutputPrediction
} from "./vidyaAssetLibrary";

export function getStudentTheme(session?: AppSession): "junior" | "professional" {
  if (!session?.studentGrade) return "professional";
  const gradeStr = String(session.studentGrade).toLowerCase();
  if (gradeStr.includes("5") || gradeStr.includes("6") || gradeStr.includes("7") || gradeStr.includes("8")) {
    return "junior";
  }
  return "professional";
}

// ─── LESSON 1: Welcome to the Python Adventure (I/O) ──────────────────────────
export function get_PY_L1_01_SETUP_LESSON(theme: "junior" | "professional"): VidyaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "vidya", name: "Vidya Python AI Tutor" },
    course: { id: "py_core", levelId: "L1", levelSlug: "core", title: "Vidya Core: The Foundation Sutra" },
    lesson: {
      id: "PY_L1_01_SETUP", order: 1, title: "Welcome to the Python Adventure",
      sutra: "I/O Streams", objective: "Master controlling input and output streams.",
      durationMin: 45, difficulty: 1, xpReward: 100,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: isJunior ? "Wake Up, Robot!" : "Hello, Architect",
        tutorText: isJunior 
          ? "Every great app begins by talking to the user. Let's write a script to wake up your new virtual AI robot."
          : "Every great application begins by talking to the user. Let's write your first professional script.",
        headline: isJunior ? "Talking to Python" : "Controlling I/O Streams",
        emoji: isJunior ? "🤖" : "🖥️",
        example: "Input → Memory → Output",
        goal: isJunior ? "Ask the user to name their robot!" : "Capture a user's name dynamically.",
      }),
      buildConceptCard({
        stepLabel: "Variables & I/O",
        tutorText: "Python reads input using `input()` and writes to the screen using `print()`.",
        title: "The I/O Cycle",
        emoji: "🔄",
        points: [
          "input('Question?'): Halts execution and waits for a typed answer.",
          "Variables: Store the captured text (e.g., name = input(...)).",
          "f-strings: The cleanest way to inject variables into text (e.g., f'Hello {name}')."
        ],
      }),
      buildCodeWalkthrough({
        stepLabel: "Greeting Code",
        tutorText: "Let's observe a script that captures a user's name and greets them.",
        expression: isJunior ? "Robot Wake-up Sequence" : "System Login Script",
        codeSteps: isJunior
          ? ["bot_name = input('What is my name? ')", "print(f'Beep boop. I am {bot_name}.')"]
          : ["user_id = input('Enter Identity: ')", "print(f'Welcome to the system, {user_id}!')"],
        result: "The program pauses, waits for input, and dynamically formats the response.",
      }),
      buildOutputPrediction({
        stepLabel: "Mental Compilation",
        tutorText: "Before you write code, let's see if you can read it. What will this program output?",
        headline: "Predict the Output",
        codeSnippet: `name = "Alex"\nprint(f"Hello {name}!")`,
        expectedOutput: "Hello Alex!",
        hints: ["Look at what is stored in the variable 'name'.", "Replace {name} with 'Alex'."],
      }),
      buildPythonChallenge({
        stepLabel: isJunior ? "Mission: Power Up!" : "Mission: Authentication Node",
        tutorText: "Your turn! Write a script that asks for a 'secret code' and prints a formatted confirmation.",
        boardTitle: "Terminal Setup",
        prompt: "Write code to ask 'Secret code: ' and save it to 'code'. Then print 'Code {code} accepted!'",
        starterCode: "# Ask for input\n\n# Print confirmation\n",
        solutionCode: "code = input('Secret code: ')\nprint(f'Code {code} accepted!')",
        hints: ["Use input()", "Use an f-string"],
      }),
      buildRecapSummary({
        stepLabel: "System Initialized",
        tutorText: "Perfect! You have established a bridge between you and your program's memory.",
        title: "I/O Mastery Achieved 🎯",
        keyPoints: ["Use input() to capture data.", "Variables are labeled boxes for data.", "Use f-strings for output."],
        badgeReward: "First Spell Caster 🪄",
      })
    ]
  };
}

// ─── LESSON 4: Decisions - Choose Your Adventure (Logic Gates) ───────────────
export function get_PY_L1_04_LOGIC_LESSON(theme: "junior" | "professional"): VidyaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "vidya", name: "Vidya Python AI Tutor" },
    course: { id: "py_core", levelId: "L1", levelSlug: "core", title: "Vidya Core: The Foundation Sutra" },
    lesson: {
      id: "PY_L1_04_LOGIC", order: 4, title: "Dynamic Decisions",
      sutra: "Logic Gates", objective: "Build robust logic gates, type casting, and error prevention habits.",
      durationMin: 50, difficulty: 2, xpReward: 120,
    },
    progress: { currentStepIndex: 0, totalSteps: 5 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: isJunior ? "Level Up Logic" : "Branching Reality",
        tutorText: isJunior 
          ? "Games need to make decisions. If a player has 50 XP, they level up! Let's build logic gates."
          : "Applications need to make decisions. If a user is an admin, let them in. Let's build logic gates.",
        headline: "If / Elif / Else",
        emoji: "🔀",
        example: "Input → Evaluate Truth → Execute Branch",
        goal: "Write an evaluation system that grants or denies access based on a score.",
      }),
      buildConceptCheck({
        stepLabel: "Syntax Check",
        tutorText: "Before we build logic, let's test your syntax memory.",
        headline: "Block Syntax",
        question: "What punctuation mark must always appear at the end of an `if` or `else` statement line in Python?",
        answer: "colon (:)",
        hints: ["It looks like two vertical dots."],
      }),
      buildBugHunt({
        stepLabel: "Bug Hunt: Broken Gate",
        tutorText: "A junior developer wrote this age verification gate, but it's crashing! Find the syntax bugs and fix them.",
        boardTitle: "Security Check Bug",
        prompt: "Fix the indentation and missing syntax symbols.",
        brokenCode: "age = 18\nif age >= 18\nprint('Access Granted')\nelse\nprint('Access Denied')",
        solutionCode: "age = 18\nif age >= 18:\n    print('Access Granted')\nelse:\n    print('Access Denied')",
        hints: ["Check the end of the if and else lines.", "Python uses 4 spaces for indentation inside the block."],
      }),
      buildPythonChallenge({
        stepLabel: isJunior ? "Mission: The High Score" : "Mission: VIP Access",
        tutorText: "Now write your own gate from scratch. Ask for a score, convert it to an integer. If it's >= 90, print 'Elite'. Else, print 'Standard'.",
        boardTitle: isJunior ? "High Score Checker" : "VIP Access Gate",
        prompt: "Capture a score, cast to int, and write the if/else block.",
        starterCode: "score_text = input('Score: ')\n# TODO: cast, if >= 90 print Elite, else print Standard\n",
        solutionCode: "score_text = input('Score: ')\nscore = int(score_text)\nif score >= 90:\n    print('Elite')\nelse:\n    print('Standard')",
        hints: ["Use int() to cast", "Don't forget the colon!"],
      }),
      buildRecapSummary({
        stepLabel: "Logic Engineered",
        tutorText: "Awesome! Your apps are no longer static—they are intelligent.",
        title: "Logic Gates Mastered 🧠",
        keyPoints: ["Always cast input() to int() before math.", "Use if/else blocks.", "Indentation is mandatory."],
      })
    ]
  };
}
