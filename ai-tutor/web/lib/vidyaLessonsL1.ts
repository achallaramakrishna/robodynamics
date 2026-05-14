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
  if (!session?.grade) return "professional";
  const gradeStr = String(session.grade).toLowerCase();
  if (gradeStr.includes("5") || gradeStr.includes("6") || gradeStr.includes("7") || gradeStr.includes("8")) {
    return "junior";
  }
  return "professional";
}

// ─── LESSON 1: Introduction to Python: Your Tech Superpower ──────────────────
export function get_PY_L1_01_SETUP_LESSON(theme: "junior" | "professional"): VidyaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "vidya", name: "Vidya Python AI Tutor" },
    course: { id: "py_core", levelId: "L1", levelSlug: "core", title: "Vidya Core: The Foundation Sutra" },
    lesson: {
      id: "PY_L1_01_SETUP", order: 1, title: "Introduction to Python",
      sutra: "Hello World Sutra", objective: "Understand what Python is, why we use it, and write your first program.",
      durationMin: 35, difficulty: 1, xpReward: 100,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: "Meet Python!",
        tutorText: "Hey there, future coder! Welcome to Python, the most popular and friendly coding language in the entire world! Python is used to build games, power YouTube, control robots, and even search for stars with NASA! Today, we are going to learn how to write your very first line of computer code.",
        headline: "Meet Python: Your Superpower!",
        emoji: "🐍",
        example: "Text in code -> Python Engine -> Screen",
        goal: "Discover what Python is and say hello to your computer!",
      }),
      buildConceptCard({
        stepLabel: "Why Python?",
        tutorText: "Writing Python code is like talking in simple English. It is super easy to read and write, which is why school students and top space scientists both love it! Plus, once you learn it, you can use it to build almost anything you can imagine!",
        title: "Why Learn Python?",
        emoji: "🚀",
        points: [
          "Super Readable: It looks just like normal English sentences!",
          "Built for Creation: Games, websites, AI, robots—you name it, Python can build it!",
          "NASA Approved: Used to navigate spaceships and process galactic data."
        ],
      }),
      buildCodeWalkthrough({
        stepLabel: "Hello World Code",
        tutorText: "Coders all around the world start by writing a special program called 'Hello World'. This is our secret handshake with the computer. Let's look at how beautifully simple it is to write in Python!",
        expression: "The Hello World Spell",
        codeSteps: [
          'print("Hello World!")'
        ],
        result: "The computer reads your command and instantly prints 'Hello World!' onto your screen.",
      }),
      buildOutputPrediction({
        stepLabel: "Mental Compilation",
        tutorText: "Let's test your inner computer! If we write a print command with some friendly words inside quotation marks, what will show up on our terminal screen? Look at this code.",
        headline: "Predict the Screen Output",
        codeSnippet: 'print("Python is awesome! 🐍")',
        expectedOutput: "Python is awesome! 🐍",
        hints: ["The print() command displays exactly what is inside the quotes.", "Don't forget the snake emoji!"],
      }),
      buildPythonChallenge({
        stepLabel: "First Coding Mission",
        tutorText: "Now it's your turn to write your very first line of real code! Write a command to say hello to the user or introduce yourself on the terminal.",
        boardTitle: "Interactive Python Terminal",
        prompt: "Write a print statement to display 'Hello Coder!' on the screen.",
        starterCode: "# Write your print command below\n",
        solutionCode: "print('Hello Coder!')",
        hints: ["Use the print() command with double or single quotes inside.", "Ensure you match 'Hello Coder!' exactly, including capital letters!"],
      }),
      buildRecapSummary({
        stepLabel: "Mission Accomplished",
        tutorText: "Wow, you did it! You have officially written your first computer program. You are now a Python coder, and this is just the beginning of your tech wizardry journey!",
        title: "Python Genesis Achieved! 🏆",
        keyPoints: [
          "Python is a powerful, simple, and friendly language.",
          "We use print() to output messages to the screen.",
          "Text messages must be wrapped inside quotation marks."
        ],
        badgeReward: "Hello World Pioneer 🎖️",
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

// ─── LESSON 2: Storage Boxes (Variables & State) ─────────────────────────────
export function get_PY_L1_02_VARS_LESSON(theme: "junior" | "professional"): VidyaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "vidya", name: "Vidya Python AI Tutor" },
    course: { id: "py_core", levelId: "L1", levelSlug: "core", title: "Vidya Core: The Foundation Sutra" },
    lesson: {
      id: "PY_L1_02_VARS", order: 2, title: "Storage Boxes & State",
      sutra: "Memory Box Sutra", objective: "Learn how computer memory stores, recalls, and reassigns variables under clean PEP 8 naming schemes.",
      durationMin: 40, difficulty: 1, xpReward: 100,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: "Memory Spaces",
        tutorText: "Computers have massive memories, but to use them we need to label individual compartments! Imagine having labeled storage boxes in your room. If you drop a magic sword inside the box labeled 'sword', you can pull it out whenever you need to fight a dragon! In Python, we call these variables.",
        headline: "Meet Variables!",
        emoji: "📦",
        example: "Variable Name = Value stored in Memory",
        goal: "Learn to declare, print, and reassign storage variables.",
      }),
      buildConceptCard({
        stepLabel: "Variable Rules",
        tutorText: "To write clean, professional code, developers follow guidelines called PEP 8. This ensures any programmer in the world can read your code instantly! Let's master the naming rules for our memory boxes.",
        title: "Naming Memory Boxes (PEP 8)",
        emoji: "📋",
        points: [
          "Use snake_case: Write everything in lowercase and join words with underscores (e.g., player_score, gold_coins).",
          "No generic letters: Avoid naming boxes like 'x' or 'temp'. Use meaningful labels like 'level_count'.",
          "Case Sensitive: 'gold' and 'Gold' are two completely different boxes!",
          "Use comments (#) to describe what your box represents."
        ],
      }),
      buildCodeWalkthrough({
        stepLabel: "Storing Values",
        tutorText: "Let's look at how we drop a value inside a memory box in Python. We use the equals sign (=) which acts as an insertion stamp, storing whatever is on the right into the label on the left.",
        expression: "Declaring and printing state",
        codeSteps: [
          '# Assigning our player stats',
          'player_name = "Arjun"',
          'player_gold = 100',
          'print(player_name)',
          'print(player_gold)'
        ],
        result: "The machine stores 'Arjun' and 100 in memory, then outputs them line-by-line to the terminal screen.",
      }),
      buildBugHunt({
        stepLabel: "Reassigning State",
        tutorText: "Variables can vary! We can reassign new values to our boxes at any time. Look at this inventory update system. A beginner programmer is trying to add gold, but they wrote invalid variable names that violate PEP 8 snake_case rules! Fix the code.",
        boardTitle: "Inventory Reassignment Bug",
        prompt: "Fix the naming casing to match PEP 8 guidelines.",
        brokenCode: "PlayerScore = 150\nprint(PlayerScore)\nPlayerScore = 200\nprint(PlayerScore)",
        solutionCode: "player_score = 150\nprint(player_score)\nplayer_score = 200\nprint(player_score)",
        hints: ["All variable names must be lowercase with underscores.", "Ensure you update both declaration and print calls!"],
      }),
      buildPythonChallenge({
        stepLabel: "Character Profile Setup",
        tutorText: "Let's set up a custom profile memory block! Create a box named 'wizard_name' and store your favorite wizard's name inside. Then, create a box named 'mana_level' and store the number 85. Finally, print both boxes out.",
        boardTitle: "Character Profile Creator",
        prompt: "Declare wizard_name and mana_level, then output them to the terminal.",
        starterCode: "# TODO: Declare wizard_name and mana_level\n",
        solutionCode: "wizard_name = \"Priya\"\nmana_level = 85\nprint(wizard_name)\nprint(mana_level)",
        hints: ["Follow snake_case variable names.", "Do not wrap numbers in quotes, but wrap text names in quotes!"],
      }),
      buildRecapSummary({
        stepLabel: "State Mastery",
        tutorText: "Excellent state engineering! You have mastered the rules of computational variable storage. You are now storing and updating data cleanly.",
        title: "Memory Boxes Conquered! 🏆",
        keyPoints: [
          "Variables store active states in computer memory.",
          "PEP 8 requires snake_case naming structures for variables.",
          "We update variables by assigning a new value to the existing label."
        ],
        badgeReward: "Memory Box Master 🎖️",
      })
    ]
  };
}

// ─── LESSON 3: Math Magic & Conversion (Computational Math) ──────────────────
export function get_PY_L1_03_MATH_LESSON(theme: "junior" | "professional"): VidyaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "vidya", name: "Vidya Python AI Tutor" },
    course: { id: "py_core", levelId: "L1", levelSlug: "core", title: "Vidya Core: The Foundation Sutra" },
    lesson: {
      id: "PY_L1_03_MATH", order: 3, title: "Math Magic & Conversion",
      sutra: "Computational Math", objective: "Perform dynamic mathematics and safely cast user string inputs into whole numbers.",
      durationMin: 45, difficulty: 1, xpReward: 100,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: "Python Calculators",
        tutorText: "Computers are ultra-fast mathematicians! Python handles math operators with absolute ease. In this module, we will learn how to write equations, use operator spacing best practices, and safely convert user input from text into mathematical numbers.",
        headline: "Computational Math",
        emoji: "➕",
        example: "User Input (Text) -> int() Conversion -> Arithmetic Solution",
        goal: "Perform calculations and write safe type-casting procedures.",
      }),
      buildConceptCard({
        stepLabel: "Spacing & Cast Safety",
        tutorText: "When writing computational mathematical equations, formatting and type safety are critical. Let's learn industry-standard practices to ensure your equations are highly readable and robust.",
        title: "Arithmetic & Type Safety Guidelines",
        emoji: "🛡️",
        points: [
          "Operator Spacing: Always add a single space on both sides of arithmetic operators (e.g., x + y, not x+y) for clean PEP 8 presentation.",
          "Type Cast Protection: The input() command always captures values as text strings ('10').",
          "Convert Before Computation: You must cast input strings to numbers using int() before running any mathematical operations, or your program will crash or behave strangely!"
        ],
      }),
      buildCodeWalkthrough({
        stepLabel: "Input Conversion Spell",
        tutorText: "Let's trace how the computer receives user input text and converts it to a clean mathematical integer inside a memory box.",
        expression: "Casting user input",
        codeSteps: [
          '# Prompting for user inputs',
          'gold_text = input("Gold found: ")',
          '# Defensive casting to whole number',
          'gold_coins = int(gold_text)',
          'doubled_gold = gold_coins * 2',
          'print(doubled_gold)'
        ],
        result: "If the user types '5', the text is cast to 5, doubled, and prints 10. Without int(), it would repeat the string '55'!",
      }),
      buildConceptCheck({
        stepLabel: "Type Conversion Test",
        tutorText: "Let's confirm your defensive type-casting comprehension. It is essential to remember casting commands before performing arithmetic.",
        headline: "String to Integer casting",
        question: "What built-in Python function must we call to convert a text string like '25' into a mathematical whole number?",
        answer: "int()",
        hints: ["It is short for integer.", "It ends with parentheses."],
      }),
      buildPythonChallenge({
        stepLabel: "Potion Mixer Multiplier",
        tutorText: "Let's build a potion intensity mixer! Ask the user for their base potion ratio using input(), cast the text to a whole number using int(), multiply it by 3, and display the final power multiplier.",
        boardTitle: "Potion Mixer Simulator",
        prompt: "Ask for input, cast to int, multiply by 3, and print the output.",
        starterCode: "base_text = input(\"Enter base ratio: \")\n# TODO: Cast base_text to integer, multiply by 3, print final output\n",
        solutionCode: "base_text = input(\"Enter base ratio: \")\nratio = int(base_text)\nfinal_power = ratio * 3\nprint(final_power)",
        hints: ["Ensure you assign variables cleanly using snake_case.", "Use int(base_text) to convert, and print() to display."],
      }),
      buildRecapSummary({
        stepLabel: "Math Wizardry",
        tutorText: "Spectacular! You have mastered math equations and defensive type casting. Your code can now safely calculate user inputs.",
        title: "Math & Conversion Mastered! 🏆",
        keyPoints: [
          "Arithmetic operators (+, -, *, /) require surrounding space elements under PEP 8 rules.",
          "The input() command captures character text strings.",
          "Use int() to cast strings safely to integers before running computations."
        ],
        badgeReward: "Math Specialist 🎖️",
      })
    ]
  };
}

// ─── LESSON 5: Repeat Loops (While) ──────────────────────────────────────────
export function get_PY_L1_05_WHILE_LESSON(theme: "junior" | "professional"): VidyaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "vidya", name: "Vidya Python AI Tutor" },
    course: { id: "py_core", levelId: "L1", levelSlug: "core", title: "Vidya Core: The Foundation Sutra" },
    lesson: {
      id: "PY_L1_05_WHILE", order: 5, title: "Repeat Loops (While)",
      sutra: "Iteration Loop Sutra", objective: "Understand how while loops repeat execution blocks continuously, and write safe decrement counters to prevent infinite application lockups.",
      durationMin: 50, difficulty: 2, xpReward: 120,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: "Circular Energy",
        tutorText: "Humans get tired of doing the same task over and over again, but computers love it! Imagine you need to print 10,000 lottery tickets. Instead of typing print commands 10,000 times, you can wrap a single print command inside a loop! In this module, we will learn how to build recursive racetracks using while loops.",
        headline: "Meet the While Loop!",
        emoji: "🔄",
        example: "while condition == True: repeat code block",
        goal: "Write finite repetition loops and prevent infinite hangs.",
      }),
      buildConceptCard({
        stepLabel: "Infinite Traps",
        tutorText: "While loops are incredibly powerful, but with great power comes great responsibility! If your loop condition never evaluates to False, your program will get trapped in an infinite loop and crash your entire computer. Let's learn industry best practices for loop safety.",
        title: "Loop Safety & Counter Updates",
        emoji: "🛡️",
        points: [
          "Condition Checking: The while loop checks its condition at the start of every single iteration loop.",
          "Indentation Rules: All code wrapped inside the loop must be indented exactly 4 spaces.",
          "Mandatory State Mutation: You must include an update statement inside the loop (e.g., lives -= 1 or count += 1) so the loop condition eventually turns False!"
        ],
      }),
      buildCodeWalkthrough({
        stepLabel: "Racetrack Countdown",
        tutorText: "Let's trace how the machine executes a clean countdown loop. Notice how the counter variable drops tick by tick until the condition flips to False, pivoting the exit switch open.",
        expression: "Executing a countdown sequence",
        codeSteps: [
          '# Assigning starting lives count',
          'lives = 3',
          'while lives > 0:',
          '    print(lives)',
          '    lives -= 1',
          'print("Game Over!")'
        ],
        result: "The machine outputs 3, 2, 1, then exits the loop to print 'Game Over!'.",
      }),
      buildBugHunt({
        stepLabel: "Infinite Lockup Bug",
        tutorText: "A junior game programmer tried to write an energy recharger, but their game freezes instantly! They forgot to include the counter update statement inside the loop block, so energy is always 5! Fix the code by adding energy -= 1 inside the loop block.",
        boardTitle: "Infinite Loop Hang",
        prompt: "Add the missing state decrement inside the while loop.",
        brokenCode: "energy = 3\nwhile energy > 0:\n    print(energy)\nprint('Recharged!')",
        solutionCode: "energy = 3\nwhile energy > 0:\n    print(energy)\n    energy -= 1\nprint('Recharged!')",
        hints: ["Indent energy -= 1 exactly 4 spaces inside the while loop block.", "Make sure it matches variable naming casing perfectly."],
      }),
      buildPythonChallenge({
        stepLabel: "Orbiter Rotation Mission",
        tutorText: "Now let's code a satellite orbit sequence! Create a variable named orbits and store 3 inside. Write a while loop that repeats as long as orbits > 0. Inside the loop, print the current number of orbits, and decrement orbits by 1. After the loop exits, print 'Landed!'.",
        boardTitle: "Satellite Orbit Simulator",
        prompt: "Declare orbits, write the while loop with decrement, and print 'Landed!' at the end.",
        starterCode: "# TODO: Declare orbits = 3, write while loop, print 'Landed!'\n",
        solutionCode: "orbits = 3\nwhile orbits > 0:\n    print(orbits)\n    orbits -= 1\nprint('Landed!')",
        hints: ["Remember the colon (:) at the end of the while line.", "Indent print and orbits -= 1 by 4 spaces."],
      }),
      buildRecapSummary({
        stepLabel: "Loop Certified",
        tutorText: "Stunning logic engineering! You have mastered iterative while loops and defensive decrement updates. Your applications can now iterate flawlessly.",
        title: "While Loops Conquered! 🏆",
        keyPoints: [
          "While loops repeat code blocks as long as their condition evaluates to True.",
          "Always include state updates (decrement or increment) to prevent infinite lockups.",
          "Indentation defines the boundaries of the repeating code block."
        ],
        badgeReward: "Loop Master 🎖️",
      })
    ]
  };
}

// ─── LESSON 6: For Loops (Counted Iterations) ────────────────────────────────
export function get_PY_L1_06_FOR_LESSON(theme: "junior" | "professional"): VidyaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "vidya", name: "Vidya Python AI Tutor" },
    course: { id: "py_core", levelId: "L1", levelSlug: "core", title: "Vidya Core: The Foundation Sutra" },
    lesson: {
      id: "PY_L1_06_FOR", order: 6, title: "For Loops & Ranges",
      sutra: "Counted Iteration Sutra", objective: "Master counted iterations over ranges and lists under clean PEP 8 variable conventions.",
      durationMin: 45, difficulty: 2, xpReward: 120,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: "Precise Scanning",
        tutorText: "While loops repeat until a condition turns False, but what if we know exactly how many times we want to repeat before we start? In Python, we use 'for' loops! For loops are like automatic scanning lasers—they iterate exactly through a specific range of numbers or items in a list without needing a manual counter update.",
        headline: "Meet the For Loop!",
        emoji: "🎯",
        example: "for i in range(1, 6): repeat code block",
        goal: "Iterate across precise numerical ranges and collection items.",
      }),
      buildConceptCard({
        stepLabel: "Ranges & Spacing",
        tutorText: "Let's master the range() function. In Python programming, range boundaries have a special rule that every developer must memorize: ranges include the starting number, but stop exactly one number before the ending limit!",
        title: "Range Boundaries & PEP 8",
        emoji: "📏",
        points: [
          "Range Limits: range(1, 5) iterates through 1, 2, 3, and 4. It does not include 5!",
          "Descriptive Iterator Names: Use descriptive iterator variables like item_index or i for clean PEP 8 readability.",
          "Automatic Updates: You do not need to write i += 1. The for loop updates the iterator variable automatically!"
        ],
      }),
      buildCodeWalkthrough({
        stepLabel: "Range Multiplier",
        tutorText: "Let's observe how beautifully concise a for loop is. Notice how it generates numbers on the fly and runs our block without requiring external counter setup variables.",
        expression: "Iterating across numerical ranges",
        codeSteps: [
          '# Looping through range 1 to 4',
          'for i in range(1, 5):',
          '    scaled = i * 10',
          '    print(scaled)'
        ],
        result: "The machine automatically sets i to 1, 2, 3, 4, scales them by 10, and outputs 10, 20, 30, 40.",
      }),
      buildConceptCheck({
        stepLabel: "Range Limit Test",
        tutorText: "Let's confirm your range boundary logic memory. It is essential to calculate range stops accurately.",
        headline: "Range Boundaries",
        question: "If we write a loop header 'for x in range(0, 3):', what is the final number that gets assigned to x before the loop completes?",
        answer: "2",
        hints: ["Ranges stop exactly one before the upper boundary limit.", "Count 0, 1, 2."],
      }),
      buildPythonChallenge({
        stepLabel: "Runic Pattern Printer",
        tutorText: "Let's build an automatic rune pattern printer! Write a for loop that iterates with variable i in range(1, 4). Inside the loop block, print the value of i.",
        boardTitle: "Runic Pattern Generator",
        prompt: "Write a for loop with i in range(1, 4), and print i.",
        starterCode: "# TODO: Write for loop using range(1, 4) and print i\n",
        solutionCode: "for i in range(1, 4):\n    print(i)",
        hints: ["Don't forget the colon (:) at the end of the for line.", "Indent print(i) exactly 4 spaces."],
      }),
      buildRecapSummary({
        stepLabel: "Iterator Master",
        tutorText: "Brilliant iteration logic! You have mastered counted for loops and range boundary calculations. You can now iterate across collections cleanly.",
        title: "For Loops Conquered! 🏆",
        keyPoints: [
          "For loops iterate across collections or ranges automatically.",
          "range(start, stop) includes start but stops before stop.",
          "No manual counter updates are required inside for loops."
        ],
        badgeReward: "Count Explorer 🎖️",
      })
    ]
  };
}
