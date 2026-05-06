import type { PythonLessonPayload } from "./pythonLessonTypes";

// ─── Ordered lesson IDs for Level 1 ───────────────────────────────────────────
export const PYTHON_L1_LESSON_IDS: string[] = [
  "PY_L1_01_SETUP",
  "PY_L1_02_DATA",
  "PY_L1_03_CONTROL",
  "PY_L1_04_DICTS_STRINGS",
  "PY_L1_05_FILES_EXCEPTIONS",
  "PY_L1_06_MODULES_OOP_REVIEW",
];

// ─── LESSON 1: Setup, First Program, and Input ────────────────────────────────
const LESSON_01: PythonLessonPayload = {
  product: { id: "codesutra", name: "Python CodeSutra" },
  course: {
    id: "PY_BEG",
    levelId: "level-1",
    title: "CodeSutra Foundations",
    tierName: "Beginner",
  },
  lesson: {
    id: "PY_L1_01_SETUP",
    order: 1,
    title: "Setup, First Program & Input",
    objective: "Install Python, write your first print() statement, and collect user input with f-strings.",
    durationMin: 15,
    difficulty: 1,
    xpReward: 150,
    topics: ["Install Python", "print()", "input()", "f-strings"],
  },
  avatar: { id: "nova", name: "Byte", label: "Your Python Tutor" },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro",
      label: "Welcome",
      tutorText:
        "Hey there! I'm Byte, your Python tutor. Welcome to your very first Python lesson! Today we're going to set up Python on your computer and write your first real program. It's going to be awesome — let's dive in!",
      board: {
        type: "intro_card",
        data: {
          headline: "Lesson 1 — Setup & Your First Program",
          body: "By the end of this lesson you'll be able to install Python, print messages to the screen, and ask the user for their name.",
          xpReward: 150,
        },
      },
      actions: [{ id: "next", label: "Let's go!", primary: true }],
    },
    {
      id: "concept",
      label: "What is Python?",
      tutorText:
        "Python is one of the most popular programming languages in the world — and it's beginner-friendly! Scientists, game developers, and AI engineers all use it. The best part? Your first program is just ONE line.",
      board: {
        type: "concept_card",
        data: {
          headline: "Python: Say Hello to the World",
          body: "Python code is plain English-like text that your computer understands. The print() function shows text on screen. The input() function asks the user to type something.",
          code: 'print("Hello, World!")',
          language: "python",
          highlightLines: [1],
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Show me the demo", primary: true },
      ],
    },
    {
      id: "demo",
      label: "Code Demo",
      tutorText:
        "Watch how we go from a simple print to a personalized greeting using input() and f-strings. An f-string lets you drop a variable right inside your text — super handy!",
      board: {
        type: "code_demo",
        data: {
          headline: "From Hello to Personalized Greetings",
          code: 'print("Hello, Riya!")\n\nname = input("What\'s your name? ")\nprint(f"Hello, {name}!")',
          language: "python",
          steps: [
            {
              line: 'print("Hello, Riya!")',
              explanation: "print() sends text to the screen. Anything inside the quotes appears exactly as written.",
            },
            {
              line: 'name = input("What\'s your name? ")',
              explanation: "input() shows a prompt and waits for the user to type. Whatever they type gets stored in the variable 'name'.",
            },
            {
              line: 'print(f"Hello, {name}!")',
              explanation: "An f-string starts with f before the quote. Curly braces {} inject the value of any variable directly into the text.",
            },
          ],
          output: "Hello, Riya!\nWhat's your name? Aryan\nHello, Aryan!",
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Try it myself", primary: true },
      ],
    },
    {
      id: "practice",
      label: "Practice",
      tutorText:
        "Quick check! Tell me in your own words — what does the print() function do?",
      board: {
        type: "code_practice",
        data: {
          headline: "Your Turn",
          prompt: 'What does print("Hi") do?',
          hint: "Think about what appears on the screen when this line runs.",
          answer: "prints Hi to the screen",
        },
      },
      practice: {
        mode: "text",
        prompt: 'What does print("Hi") do?',
        answer: "prints Hi to the screen",
        hints: ["Think about what appears on the screen when this runs."],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Check Answer", primary: true },
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      tutorText:
        "Now let's test your eye for Python syntax! Only ONE of these options will actually print Hello — can you spot it?",
      board: {
        type: "quiz_card",
        data: {
          headline: "Spot the Right Syntax",
          prompt: "Which of these correctly prints Hello to the screen?",
          options: ['print("Hello")', 'Print("Hello")', 'PRINT("Hello")', 'echo("Hello")'],
          answer: 'print("Hello")',
          hint: "Python is case-sensitive, and print is all lowercase.",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Which of these correctly prints Hello to the screen?",
        answer: 'print("Hello")',
        options: ['print("Hello")', 'Print("Hello")', 'PRINT("Hello")', 'echo("Hello")'],
        hints: ["Python is case-sensitive.", "echo is not a Python function."],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Submit", primary: true },
      ],
    },
    {
      id: "recap",
      label: "Recap",
      tutorText:
        "Fantastic work! You just wrote your first Python program! You've earned +150 XP. Next up: variables and data types — the building blocks of every program. See you there!",
      board: {
        type: "recap_card",
        data: {
          headline: "Lesson 1 Complete!",
          body: "You learned how to:\n• Use print() to display text\n• Use input() to collect user input\n• Use f-strings to create personalized messages",
          xpReward: 150,
        },
      },
      actions: [
        { id: "review", label: "Review lesson" },
        { id: "next_lesson", label: "Next lesson →", primary: true },
      ],
    },
  ],
  nextLessonId: "PY_L1_02_DATA",
  nextLessonUrl: "/python-ai/course/level-1/lesson/PY_L1_02_DATA",
};

// ─── LESSON 2: Variables, Types, Operators, Decisions ─────────────────────────
const LESSON_02: PythonLessonPayload = {
  product: { id: "codesutra", name: "Python CodeSutra" },
  course: {
    id: "PY_BEG",
    levelId: "level-1",
    title: "CodeSutra Foundations",
    tierName: "Beginner",
  },
  lesson: {
    id: "PY_L1_02_DATA",
    order: 2,
    title: "Variables, Types, Operators & Decisions",
    objective: "Work with int, float, str, and bool, and write if/elif/else decision logic.",
    durationMin: 18,
    difficulty: 1,
    xpReward: 150,
    topics: ["int", "float", "str", "bool", "if/elif/else"],
  },
  avatar: { id: "nova", name: "Byte", label: "Your Python Tutor" },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro",
      label: "Welcome",
      tutorText:
        "Welcome back, coder! Last time you said hello to the world. Today we're going deeper — variables store information, and decisions let your program think. By the end you'll be writing code that makes choices just like you do!",
      board: {
        type: "intro_card",
        data: {
          headline: "Lesson 2 — Variables, Types & Decisions",
          body: "Store numbers, text, and true/false values in variables, then make your program decide what to do using if, elif, and else.",
          xpReward: 150,
        },
      },
      actions: [{ id: "next", label: "Let's go!", primary: true }],
    },
    {
      id: "concept",
      label: "Data Types",
      tutorText:
        "Every value in Python has a type. A whole number is an int. A decimal is a float. Text wrapped in quotes is a str. And True or False is a bool. Python figures out the type automatically — no need to declare it!",
      board: {
        type: "concept_card",
        data: {
          headline: "Python's Core Data Types",
          body: "Variables are named containers. Python detects the type from the value you assign.",
          code: "age = 14          # int\nheight = 5.4      # float\nname = \"Priya\"    # str\nis_student = True  # bool",
          language: "python",
          highlightLines: [1, 2, 3, 4],
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Show me decisions", primary: true },
      ],
    },
    {
      id: "demo",
      label: "Code Demo",
      tutorText:
        "Here's a program that checks your age and prints a different message depending on what it finds. This is an if/else — the backbone of every decision in code!",
      board: {
        type: "code_demo",
        data: {
          headline: "Making Decisions with if/else",
          code: "age = 14\nif age >= 13:\n    print(\"Teen!\")\nelse:\n    print(\"Kid!\")",
          language: "python",
          steps: [
            {
              line: "age = 14",
              explanation: "We store the number 14 in a variable called age. Python sees it as an int.",
            },
            {
              line: "if age >= 13:",
              explanation: "if checks a condition. >= means 'greater than or equal to'. If this is True, the next indented block runs.",
            },
            {
              line: '    print("Teen!")',
              explanation: "This indented line runs only when the condition is True. Indentation (4 spaces) tells Python this is inside the if.",
            },
            {
              line: "else:",
              explanation: "else catches everything that didn't match the if condition.",
            },
            {
              line: '    print("Kid!")',
              explanation: "This runs when age is less than 13.",
            },
          ],
          output: "Teen!",
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Try it myself", primary: true },
      ],
    },
    {
      id: "practice",
      label: "Practice",
      tutorText:
        "Quick question — what data type is the number 3.14? Think about whether it's a whole number or a decimal.",
      board: {
        type: "code_practice",
        data: {
          headline: "Name That Type",
          prompt: "What data type is 3.14 in Python?",
          hint: "Is it a whole number or does it have a decimal point?",
          answer: "float",
        },
      },
      practice: {
        mode: "text",
        prompt: "What data type is 3.14 in Python?",
        answer: "float",
        hints: ["It has a decimal point.", "The two main number types are int and float."],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Check Answer", primary: true },
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      tutorText:
        "Let's check what type(True) returns. Remember — True and False are a special Python type. Which one is it?",
      board: {
        type: "quiz_card",
        data: {
          headline: "Type Check Challenge",
          prompt: "What does type(True) return in Python?",
          options: ["str", "int", "bool", "float"],
          answer: "bool",
          hint: "True and False are not numbers or text — they're their own type.",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What does type(True) return in Python?",
        answer: "bool",
        options: ["str", "int", "bool", "float"],
        hints: ["True and False are a special Python type.", "It starts with 'b'."],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Submit", primary: true },
      ],
    },
    {
      id: "recap",
      label: "Recap",
      tutorText:
        "Two lessons down — you're building momentum! You've earned +150 XP. You now know the four core types and how to make decisions with if/else. Next: functions, lists, and loops!",
      board: {
        type: "recap_card",
        data: {
          headline: "Lesson 2 Complete!",
          body: "You learned how to:\n• Use int, float, str, and bool variables\n• Check conditions with if, elif, and else\n• Understand how Python picks data types automatically",
          xpReward: 150,
        },
      },
      actions: [
        { id: "review", label: "Review lesson" },
        { id: "next_lesson", label: "Next lesson →", primary: true },
      ],
    },
  ],
  nextLessonId: "PY_L1_03_CONTROL",
  nextLessonUrl: "/python-ai/course/level-1/lesson/PY_L1_03_CONTROL",
};

// ─── LESSON 3: Functions, Lists, Tuples, Loops ────────────────────────────────
const LESSON_03: PythonLessonPayload = {
  product: { id: "codesutra", name: "Python CodeSutra" },
  course: {
    id: "PY_BEG",
    levelId: "level-1",
    title: "CodeSutra Foundations",
    tierName: "Beginner",
  },
  lesson: {
    id: "PY_L1_03_CONTROL",
    order: 3,
    title: "Functions, Lists & Loops",
    objective: "Define reusable functions, store data in lists, and repeat actions with for and while loops.",
    durationMin: 20,
    difficulty: 1,
    xpReward: 150,
    topics: ["def", "lists", "for loops", "while", "range()"],
  },
  avatar: { id: "nova", name: "Byte", label: "Your Python Tutor" },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro",
      label: "Welcome",
      tutorText:
        "Hey, great to see you back! Today we unlock three of the most powerful ideas in programming — functions that you can reuse, lists that hold multiple values, and loops that do repetitive work so you don't have to. Let's go!",
      board: {
        type: "intro_card",
        data: {
          headline: "Lesson 3 — Functions, Lists & Loops",
          body: "Write functions once and call them many times. Store groups of items in lists. Repeat actions effortlessly with for and while loops.",
          xpReward: 150,
        },
      },
      actions: [{ id: "next", label: "Let's go!", primary: true }],
    },
    {
      id: "concept",
      label: "Functions & Lists",
      tutorText:
        "A function is a named block of code you can call whenever you need it. A list is a collection of items in order, wrapped in square brackets. Together they make your code clean and powerful.",
      board: {
        type: "concept_card",
        data: {
          headline: "Define Once, Use Many Times",
          body: "Use def to create a function. Use square brackets [] to create a list. Use a for loop to visit every item in the list.",
          code: "def greet(name):\n    return f\"Hi {name}!\"\n\nnames = [\"Aryan\", \"Priya\"]",
          language: "python",
          highlightLines: [1, 2, 4],
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Show me the loop", primary: true },
      ],
    },
    {
      id: "demo",
      label: "Code Demo",
      tutorText:
        "Watch how the for loop goes through each name in the list and calls our greet function for every single one. No copy-pasting needed!",
      board: {
        type: "code_demo",
        data: {
          headline: "Looping Through a List",
          code: "def greet(name):\n    return f\"Hi {name}!\"\n\nnames = [\"Aryan\", \"Priya\"]\nfor n in names:\n    print(greet(n))",
          language: "python",
          steps: [
            {
              line: "def greet(name):",
              explanation: "def declares a function called greet. It takes one parameter: name.",
            },
            {
              line: '    return f"Hi {name}!"',
              explanation: "return sends a value back to whoever called the function. The f-string inserts name into the text.",
            },
            {
              line: 'names = ["Aryan", "Priya"]',
              explanation: "A list stores multiple items. Items are separated by commas inside square brackets.",
            },
            {
              line: "for n in names:",
              explanation: "The for loop picks each item from names one at a time and stores it in n.",
            },
            {
              line: "    print(greet(n))",
              explanation: "Each loop round, we call greet(n) and print what it returns.",
            },
          ],
          output: "Hi Aryan!\nHi Priya!",
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Try it myself", primary: true },
      ],
    },
    {
      id: "practice",
      label: "Practice",
      tutorText:
        "Short one — what keyword do you type at the start of a function definition in Python?",
      board: {
        type: "code_practice",
        data: {
          headline: "Function Keyword",
          prompt: "What keyword starts a function definition in Python?",
          hint: "It's three letters and short for 'define'.",
          answer: "def",
        },
      },
      practice: {
        mode: "text",
        prompt: "What keyword starts a function definition in Python?",
        answer: "def",
        hints: ["It's short for 'define'.", "It's three letters long."],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Check Answer", primary: true },
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      tutorText:
        "If you wanted to start with an empty list and add items later, which of these creates a proper empty list in Python?",
      board: {
        type: "quiz_card",
        data: {
          headline: "Empty List Challenge",
          prompt: "Which of these creates an empty list in Python?",
          options: ["list()", "{}", "()", '""'],
          answer: "list()",
          hint: "Square brackets or the list() function both work — but which option below uses the function form?",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Which of these creates an empty list in Python?",
        answer: "list()",
        options: ["list()", "{}", "()", '""'],
        hints: ["{} creates a dictionary or set.", "() creates a tuple.", "list() is the function form of []"],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Submit", primary: true },
      ],
    },
    {
      id: "recap",
      label: "Recap",
      tutorText:
        "Look at you go! Three lessons in and you're writing real programs with functions and loops. That's +150 XP in your pocket! Up next: dictionaries and string superpowers.",
      board: {
        type: "recap_card",
        data: {
          headline: "Lesson 3 Complete!",
          body: "You learned how to:\n• Define reusable functions with def and return\n• Store multiple items in a list\n• Repeat actions with a for loop",
          xpReward: 150,
        },
      },
      actions: [
        { id: "review", label: "Review lesson" },
        { id: "next_lesson", label: "Next lesson →", primary: true },
      ],
    },
  ],
  nextLessonId: "PY_L1_04_DICTS_STRINGS",
  nextLessonUrl: "/python-ai/course/level-1/lesson/PY_L1_04_DICTS_STRINGS",
};

// ─── LESSON 4: Dictionaries, Sets, Strings ────────────────────────────────────
const LESSON_04: PythonLessonPayload = {
  product: { id: "codesutra", name: "Python CodeSutra" },
  course: {
    id: "PY_BEG",
    levelId: "level-1",
    title: "CodeSutra Foundations",
    tierName: "Beginner",
  },
  lesson: {
    id: "PY_L1_04_DICTS_STRINGS",
    order: 4,
    title: "Dictionaries, Sets & Strings",
    objective: "Store key-value data in dicts, understand sets, and use powerful string methods.",
    durationMin: 18,
    difficulty: 2,
    xpReward: 150,
    topics: ["dict", "set", "string methods", ".get()", "f-strings"],
  },
  avatar: { id: "nova", name: "Byte", label: "Your Python Tutor" },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro",
      label: "Welcome",
      tutorText:
        "Back for more? Awesome! Today's lesson is all about dictionaries — the go-to data structure for storing information with labels — plus sets and some really useful string tricks. Think of a dict like a contact book: every name has a number attached.",
      board: {
        type: "intro_card",
        data: {
          headline: "Lesson 4 — Dicts, Sets & Strings",
          body: "Map keys to values with dictionaries, store unique items in sets, and transform text with built-in string methods.",
          xpReward: 150,
        },
      },
      actions: [{ id: "next", label: "Let's go!", primary: true }],
    },
    {
      id: "concept",
      label: "Dictionaries",
      tutorText:
        "A dictionary uses curly braces and stores data as key-value pairs. The key is like a label, and the value is the information attached to it. You can look up any value instantly using its key.",
      board: {
        type: "concept_card",
        data: {
          headline: "Key → Value Pairs",
          body: "Dictionaries give every piece of data a name (key). Use .get() to safely retrieve a value — it returns None (or a default) if the key doesn't exist, instead of crashing.",
          code: "scores = {\"Asha\": 91, \"Raj\": 78}\nprint(scores[\"Asha\"])   # 91\nprint(scores.get(\"Zara\", 0))  # 0 (safe fallback)",
          language: "python",
          highlightLines: [2, 3],
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Show me the demo", primary: true },
      ],
    },
    {
      id: "demo",
      label: "Code Demo",
      tutorText:
        "Let's watch .get() in action and see how string methods like .upper() transform text on the fly. These tools are in basically every real Python program.",
      board: {
        type: "code_demo",
        data: {
          headline: "Dicts & String Methods",
          code: "scores = {\"Asha\": 91, \"Raj\": 78}\nprint(scores.get(\"Asha\", 0))\nprint(\"asha\".upper())",
          language: "python",
          steps: [
            {
              line: 'scores = {"Asha": 91, "Raj": 78}',
              explanation: "We create a dictionary with two key-value pairs. Keys are strings; values are integers.",
            },
            {
              line: 'print(scores.get("Asha", 0))',
              explanation: '.get("Asha", 0) looks up "Asha". She exists, so it returns 91. The 0 is the fallback if she didn\'t exist.',
            },
            {
              line: 'print("asha".upper())',
              explanation: ".upper() is a string method. It returns the string converted to all uppercase letters.",
            },
          ],
          output: "91\nASHA",
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Try it myself", primary: true },
      ],
    },
    {
      id: "practice",
      label: "Practice",
      tutorText:
        "What string method turns all letters into uppercase? You just saw it in the demo!",
      board: {
        type: "code_practice",
        data: {
          headline: "String Methods",
          prompt: "What method converts a string to uppercase in Python?",
          hint: "It was the last line in the demo. Think: what would the opposite of .lower() be?",
          answer: ".upper()",
        },
      },
      practice: {
        mode: "text",
        prompt: "What method converts a string to uppercase in Python?",
        answer: ".upper()",
        hints: ['It\'s the opposite of .lower().', 'You call it on a string like: "hello".???()'],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Check Answer", primary: true },
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      tutorText:
        "Imagine you're looking up a key that might not exist in a dictionary. Which approach is the safest — one that won't crash your program?",
      board: {
        type: "quiz_card",
        data: {
          headline: "Safe Key Lookup",
          prompt: "How do you safely get a value from a dictionary when the key might be missing?",
          options: ['scores["key"]', 'scores.get("key")', 'scores.find("key")', "scores.key"],
          answer: 'scores.get("key")',
          hint: "Square bracket lookup raises a KeyError if the key is missing. Which method handles that gracefully?",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "How do you safely get a value from a dictionary when the key might be missing?",
        answer: 'scores.get("key")',
        options: ['scores["key"]', 'scores.get("key")', 'scores.find("key")', "scores.key"],
        hints: [
          'scores["key"] raises a KeyError if missing.',
          ".find() is a string method, not a dict method.",
          ".get() returns None (or your default) instead of crashing.",
        ],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Submit", primary: true },
      ],
    },
    {
      id: "recap",
      label: "Recap",
      tutorText:
        "Brilliant work! Dictionaries and string methods are things you'll use in almost every Python project. You've earned +150 XP! Next up: files and error handling — your programs are about to get a lot more robust.",
      board: {
        type: "recap_card",
        data: {
          headline: "Lesson 4 Complete!",
          body: "You learned how to:\n• Store key-value data in a dictionary\n• Use .get() for safe key lookups\n• Transform strings with methods like .upper()",
          xpReward: 150,
        },
      },
      actions: [
        { id: "review", label: "Review lesson" },
        { id: "next_lesson", label: "Next lesson →", primary: true },
      ],
    },
  ],
  nextLessonId: "PY_L1_05_FILES_EXCEPTIONS",
  nextLessonUrl: "/python-ai/course/level-1/lesson/PY_L1_05_FILES_EXCEPTIONS",
};

// ─── LESSON 5: File I/O and Exception Handling ────────────────────────────────
const LESSON_05: PythonLessonPayload = {
  product: { id: "codesutra", name: "Python CodeSutra" },
  course: {
    id: "PY_BEG",
    levelId: "level-1",
    title: "CodeSutra Foundations",
    tierName: "Beginner",
  },
  lesson: {
    id: "PY_L1_05_FILES_EXCEPTIONS",
    order: 5,
    title: "File I/O & Exception Handling",
    objective: "Read and write files with open(), and handle errors gracefully using try/except.",
    durationMin: 18,
    difficulty: 2,
    xpReward: 150,
    topics: ["open()", "read()", "write()", "try/except", "FileNotFoundError"],
  },
  avatar: { id: "nova", name: "Byte", label: "Your Python Tutor" },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro",
      label: "Welcome",
      tutorText:
        "Welcome back! Today your programs grow up a little — they'll read and save data to actual files on disk. And when something goes wrong? Instead of crashing, your program will catch the error and handle it like a pro. Let's do this!",
      board: {
        type: "intro_card",
        data: {
          headline: "Lesson 5 — Files & Error Handling",
          body: "Read text from files, write data to files, and use try/except to catch errors so your program never crashes unexpectedly.",
          xpReward: 150,
        },
      },
      actions: [{ id: "next", label: "Let's go!", primary: true }],
    },
    {
      id: "concept",
      label: "Files & Errors",
      tutorText:
        "Python's open() function opens a file. The 'with' statement makes sure the file is closed automatically when you're done — no leaks. And try/except lets you say: 'try this, but if it fails, do this instead.'",
      board: {
        type: "concept_card",
        data: {
          headline: "open(), try, and except",
          body: "Use 'with open(filename) as f' to open a file safely. Wrap risky code in try and handle errors in except.",
          code: "# Reading a file safely\nwith open(\"data.txt\") as f:\n    content = f.read()\n\n# Handling an error\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Can't divide by zero!\")",
          language: "python",
          highlightLines: [2, 6, 7, 8],
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Show me the demo", primary: true },
      ],
    },
    {
      id: "demo",
      label: "Code Demo",
      tutorText:
        "Here's a real-world example: try to open a file, and if it doesn't exist, catch the FileNotFoundError instead of letting the program blow up.",
      board: {
        type: "code_demo",
        data: {
          headline: "Graceful File Reading",
          code: "try:\n    with open(\"notes.txt\") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print(\"File not found!\")",
          language: "python",
          steps: [
            {
              line: "try:",
              explanation: "try marks the block of code you want to attempt. If any error occurs inside, Python jumps to except.",
            },
            {
              line: '    with open("notes.txt") as f:',
              explanation: 'open("notes.txt") tries to open the file. The with statement ensures it closes automatically.',
            },
            {
              line: "        print(f.read())",
              explanation: "f.read() reads the entire file content as a string and we print it.",
            },
            {
              line: "except FileNotFoundError:",
              explanation: "If notes.txt doesn't exist, Python raises FileNotFoundError. This line catches that specific error.",
            },
            {
              line: '    print("File not found!")',
              explanation: "Instead of crashing, we print a friendly message. The program continues normally.",
            },
          ],
          output: "File not found!",
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Try it myself", primary: true },
      ],
    },
    {
      id: "practice",
      label: "Practice",
      tutorText:
        "In a try/except block, what keyword do you use to catch and handle the error?",
      board: {
        type: "code_practice",
        data: {
          headline: "Error Handling Keyword",
          prompt: "What keyword in Python is used to handle errors?",
          hint: "It comes right after the try block.",
          answer: "except",
        },
      },
      practice: {
        mode: "text",
        prompt: "What keyword in Python is used to handle errors?",
        answer: "except",
        hints: ["It pairs with try.", "It comes right after the try block ends."],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Check Answer", primary: true },
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      tutorText:
        "When you open a file, you can choose a mode: read, write, append, or create. Which mode do you use if you want to write new content — overwriting anything that was there before?",
      board: {
        type: "quiz_card",
        data: {
          headline: "File Mode Challenge",
          prompt: "Which mode opens a file for writing (and overwrites existing content)?",
          options: ['"r"', '"w"', '"a"', '"x"'],
          answer: '"w"',
          hint: "Think: r = read, w = ?, a = append (add to end), x = create new only.",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Which mode opens a file for writing (and overwrites existing content)?",
        answer: '"w"',
        options: ['"r"', '"w"', '"a"', '"x"'],
        hints: [
          '"r" is for reading only.',
          '"a" adds to the end without deleting existing content.',
          '"w" stands for write — it overwrites the file.',
        ],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Submit", primary: true },
      ],
    },
    {
      id: "recap",
      label: "Recap",
      tutorText:
        "You just levelled up big time! Programs that can read files and recover from errors are real, production-ready programs. You've earned +150 XP! One more lesson in Level 1 — modules and your first taste of OOP. You've got this!",
      board: {
        type: "recap_card",
        data: {
          headline: "Lesson 5 Complete!",
          body: "You learned how to:\n• Open and read files with open() and with\n• Write to files using the 'w' mode\n• Catch errors gracefully with try/except",
          xpReward: 150,
        },
      },
      actions: [
        { id: "review", label: "Review lesson" },
        { id: "next_lesson", label: "Next lesson →", primary: true },
      ],
    },
  ],
  nextLessonId: "PY_L1_06_MODULES_OOP_REVIEW",
  nextLessonUrl: "/python-ai/course/level-1/lesson/PY_L1_06_MODULES_OOP_REVIEW",
};

// ─── LESSON 6: Modules, OOP & Level 1 Review ─────────────────────────────────
const LESSON_06: PythonLessonPayload = {
  product: { id: "codesutra", name: "Python CodeSutra" },
  course: {
    id: "PY_BEG",
    levelId: "level-1",
    title: "CodeSutra Foundations",
    tierName: "Beginner",
  },
  lesson: {
    id: "PY_L1_06_MODULES_OOP_REVIEW",
    order: 6,
    title: "Modules, OOP & Level 1 Review",
    objective: "Import modules, create your first class with __init__ and methods, and review all Level 1 concepts.",
    durationMin: 20,
    difficulty: 2,
    xpReward: 200,
    topics: ["import", "class", "__init__", "self", "methods"],
  },
  avatar: { id: "nova", name: "Byte", label: "Your Python Tutor" },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro",
      label: "Welcome",
      tutorText:
        "Final lesson of Level 1 — this is a big deal! You're going to learn how to use Python's built-in libraries and write your very first class. Classes are the heart of Object-Oriented Programming, and they'll power the projects you build in Level 2. Let's finish strong!",
      board: {
        type: "intro_card",
        data: {
          headline: "Lesson 6 — Modules, OOP & Review",
          body: "Import powerful modules like math, build your first class with __init__ and methods, and celebrate completing Level 1!",
          xpReward: 200,
        },
      },
      actions: [{ id: "next", label: "Let's go!", primary: true }],
    },
    {
      id: "concept",
      label: "Modules & Classes",
      tutorText:
        "Modules are files full of pre-written functions — import them to get superpowers instantly. A class is a blueprint for creating objects. Each object gets its own data stored using self, and its behaviour defined by methods.",
      board: {
        type: "concept_card",
        data: {
          headline: "import & class",
          body: "__init__ is the constructor — it runs automatically when you create a new object. self refers to that specific object and lets it remember its own data.",
          code: "import math          # bring in the math module\n\nclass Circle:\n    def __init__(self, r):  # constructor\n        self.r = r          # store radius on the object\n    def area(self):         # method\n        return math.pi * self.r ** 2",
          language: "python",
          highlightLines: [1, 3, 4, 5, 6, 7],
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Show me the demo", primary: true },
      ],
    },
    {
      id: "demo",
      label: "Code Demo",
      tutorText:
        "Let's see the whole Circle class in action. We create a Circle object, call its area() method, and round the result — all in just a few lines!",
      board: {
        type: "code_demo",
        data: {
          headline: "A Class in Action",
          code: "import math\n\nclass Circle:\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return math.pi * self.r ** 2\n\nc = Circle(5)\nprint(round(c.area(), 2))",
          language: "python",
          steps: [
            {
              line: "import math",
              explanation: "import math loads Python's math module, giving us access to math.pi and other constants.",
            },
            {
              line: "class Circle:",
              explanation: "class defines a new blueprint called Circle. Everything indented under it belongs to the class.",
            },
            {
              line: "    def __init__(self, r):",
              explanation: "__init__ is the constructor. It runs the moment you create a Circle. r is the radius you pass in.",
            },
            {
              line: "        self.r = r",
              explanation: "self.r stores the radius on this particular object so other methods can use it.",
            },
            {
              line: "    def area(self):",
              explanation: "area is a method — a function that belongs to the class. self gives it access to the object's data.",
            },
            {
              line: "        return math.pi * self.r ** 2",
              explanation: "The area formula: π × r². ** is the power operator. math.pi gives us 3.14159...",
            },
            {
              line: "c = Circle(5)",
              explanation: "We create a Circle object with radius 5. Python calls __init__ automatically.",
            },
            {
              line: "print(round(c.area(), 2))",
              explanation: "c.area() calculates the area. round(..., 2) trims it to 2 decimal places.",
            },
          ],
          output: "78.54",
        },
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "next", label: "Try it myself", primary: true },
      ],
    },
    {
      id: "practice",
      label: "Practice",
      tutorText:
        "Every class needs a special method to set up a new object. What is that method called?",
      board: {
        type: "code_practice",
        data: {
          headline: "Class Constructor",
          prompt: "What method initializes a new object in a Python class?",
          hint: "It starts and ends with double underscores.",
          answer: "__init__",
        },
      },
      practice: {
        mode: "text",
        prompt: "What method initializes a new object in a Python class?",
        answer: "__init__",
        hints: ["It has double underscores on each side.", "It stands for 'initialize'."],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Check Answer", primary: true },
      ],
    },
    {
      id: "challenge",
      label: "Challenge",
      tutorText:
        "Last challenge of Level 1! If you want to use Python's math module in your program, what keyword do you type first?",
      board: {
        type: "quiz_card",
        data: {
          headline: "Module Import Challenge",
          prompt: "What keyword do you use to bring a module into your Python file?",
          options: ["import", "include", "require", "use"],
          answer: "import",
          hint: "You saw this at the very start of the demo code.",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What keyword do you use to bring a module into your Python file?",
        answer: "import",
        options: ["import", "include", "require", "use"],
        hints: [
          "include and require are used in other languages like C++ and JavaScript.",
          "use is not a Python keyword for modules.",
          "Python uses import.",
        ],
      },
      actions: [
        { id: "back", label: "Back" },
        { id: "submit", label: "Submit", primary: true },
      ],
    },
    {
      id: "recap",
      label: "Recap",
      tutorText:
        "YOU DID IT! You've completed all 6 lessons of Python CodeSutra Level 1! You earned +200 XP for finishing the level. You now know print, input, types, loops, functions, dicts, files, error handling, modules, and classes. Level 2 is waiting — and it's going to be even more exciting. I'm so proud of you!",
      board: {
        type: "recap_card",
        data: {
          headline: "Level 1 Complete! You're a Python Beginner!",
          body: "You mastered all 6 foundations:\n• print(), input(), f-strings\n• Variables, types, if/else\n• Functions, lists, loops\n• Dictionaries, string methods\n• File I/O, try/except\n• Modules, classes, OOP basics",
          xpReward: 200,
        },
      },
      actions: [
        { id: "review", label: "Review Level 1" },
        { id: "next_lesson", label: "Start Level 2 →", primary: true },
      ],
    },
  ],
};

// ─── Lesson Map ───────────────────────────────────────────────────────────────
export const LESSON_MAP: Record<string, PythonLessonPayload> = {
  PY_L1_01_SETUP: LESSON_01,
  PY_L1_02_DATA: LESSON_02,
  PY_L1_03_CONTROL: LESSON_03,
  PY_L1_04_DICTS_STRINGS: LESSON_04,
  PY_L1_05_FILES_EXCEPTIONS: LESSON_05,
  PY_L1_06_MODULES_OOP_REVIEW: LESSON_06,
};

// ─── Public API ───────────────────────────────────────────────────────────────
export function buildPythonLessonPayload(
  lessonId: string
): PythonLessonPayload | null {
  return LESSON_MAP[lessonId] ?? null;
}
