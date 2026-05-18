import type { YamunaLessonPayload } from "./yamunaLessonTypes";
import type { AppSession } from "./appSession";
import {
  buildIntroHook,
  buildConceptCard,
  buildCodeWalkthrough,
  buildConceptCheck,
  buildBugHunt,
  buildOutputPrediction,
  buildJavaChallenge,
  buildRecapSummary,
} from "./yamunaAssetLibrary";

export function getStudentTheme(session?: AppSession): "junior" | "professional" {
  if (!session?.grade) return "professional";
  const gradeStr = String(session.grade).toLowerCase();
  if (["5", "6", "7", "8"].some((g) => gradeStr.includes(g))) return "junior";
  return "professional";
}

// ─── LESSON 1: Hello World & Output ──────────────────────────────────────────
export function get_JV_L1_01_HELLO_LESSON(theme: "junior" | "professional"): YamunaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "yamuna", name: "Yamuna Java AI Tutor" },
    course: { id: "java_core", levelId: "L1", levelSlug: "level-1", title: "Yamuna Java Core" },
    lesson: {
      id: "JV_L1_01_HELLO",
      order: 1,
      title: "Hello World & Output",
      sutra: "Hello World Sutra",
      objective: "Understand the anatomy of a Java class, the main method entry point, and use System.out.println to produce output.",
      durationMin: 40,
      difficulty: 1,
      xpReward: 100,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: isJunior ? "Meet Java!" : "Java: The Enterprise Language",
        tutorText: isJunior
          ? "Welcome to Java — one of the most powerful coding languages ever invented! Java runs on billions of devices including Android phones, ATMs, and even spacecraft. Today you are going to write your very first Java program and make the computer say hello!"
          : "Welcome to Java — the language powering Android, enterprise backends, and mission-critical systems worldwide. Today we will dissect a Java class structure and produce our first output using the standard library print method.",
        headline: isJunior ? "Java: Your Power Tool!" : "Java: Write Once, Run Anywhere",
        emoji: "☕",
        example: isJunior
          ? "Code → Java Compiler → Screen Output"
          : "Source (.java) → javac Compiler → Bytecode (.class) → JVM → Output",
        goal: isJunior
          ? "Write your first Java program and make it print a message!"
          : "Understand the Java class skeleton and produce console output via System.out.println.",
      }),
      buildConceptCard({
        stepLabel: "Anatomy of a Java Class",
        tutorText: isJunior
          ? "Every Java program lives inside a class — think of it as a blueprint container. Inside the class, there is a special starting door called the main method. When you run your program, Java always enters through that door first!"
          : "A Java program begins with a public class declaration matching the filename. Execution always starts at the public static void main(String[] args) method — the JVM's designated entry point. Everything else is called from here.",
        title: isJunior ? "The Java Program Blueprint" : "Java Class Structure",
        emoji: "🏗️",
        points: isJunior
          ? [
              "public class Main { } — the container that holds your entire program.",
              "public static void main(String[] args) { } — the door Java always opens first.",
              "System.out.println(\"...\") — the command that prints a message to the screen.",
              "Every statement in Java must end with a semicolon (;).",
            ]
          : [
              "public class Main — class name must exactly match the filename (Main.java).",
              "public static void main(String[] args) — the single JVM entry point; no main = no run.",
              "System.out.println(expr) — writes to stdout followed by a newline; System.out.print omits the newline.",
              "Java is strictly statically typed and every statement terminates with a semicolon.",
            ],
        explanationTitle: "Why public static void?",
        explanationBody:
          "`public` makes the method visible to the JVM launcher. `static` means the JVM can call it without creating an object first. `void` means the method returns no value. `String[] args` receives command-line arguments.",
      }),
      buildCodeWalkthrough({
        stepLabel: "The Hello World Program",
        tutorText:
          "Let us trace through the classic Hello World program line by line. Notice how the class wraps the method, and the method wraps the statement — like Russian nesting dolls. The semicolon at the end of the print line is not optional!",
        expression: "Hello World in Java",
        codeSteps: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        System.out.println(\"Hello, World!\");",
          "    }",
          "}",
        ],
        result:
          'The JVM enters main(), executes the println call, and prints "Hello, World!" followed by a newline to the console.',
      }),
      buildOutputPrediction({
        stepLabel: "Predict the Output",
        tutorText:
          "Before you code, train your inner compiler! Look at this short Java program and predict exactly what will appear on the console. Pay close attention to the order of the two print statements.",
        headline: "What does this program print?",
        codeSnippet: [
          "public class Main {",
          "    public static void main(String[] args) {",
          '        System.out.println("Java is");',
          '        System.out.println("awesome!");',
          "    }",
          "}",
        ].join("\n"),
        expectedOutput: "Java is\nawesome!",
        hints: [
          "println prints its argument and then moves to the next line.",
          "Each println call produces one line of output.",
          "The two statements execute from top to bottom.",
        ],
      }),
      buildJavaChallenge({
        stepLabel: isJunior ? "Say Hello to the World!" : "First Output Mission",
        tutorText: isJunior
          ? "Your turn! Use System.out.println to print any message you like — your name, a greeting, or a fun fact. As long as your code compiles and prints something, you pass. Go ahead and make the computer speak!"
          : "Implement the main method body: print at least one line of text using System.out.println. Any non-empty output is accepted. Focus on getting the class structure and semicolons correct.",
        boardTitle: isJunior ? "Hello World Launcher" : "Console Output Exercise",
        prompt: isJunior
          ? "Write a System.out.println statement inside main to print any message."
          : "Complete the main method body with at least one System.out.println call.",
        starterCode: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        // write here",
          "    }",
          "}",
        ].join("\n"),
        solutionCode: [
          "public class Main {",
          "    public static void main(String[] args) {",
          '        System.out.println("Hello, World!");',
          "    }",
          "}",
        ].join("\n"),
        hints: [
          "Type System.out.println( then your message in double quotes, then );",
          'Example: System.out.println("Hello!");',
          "Every statement must end with a semicolon.",
          "The message must be inside double quotes — single quotes are for single characters in Java.",
          "Make sure the curly braces are balanced: one } closes main, another } closes the class.",
        ],
        openEnded: true,
      }),
      buildRecapSummary({
        stepLabel: "Lesson Complete",
        tutorText: isJunior
          ? "Amazing work! You have written your very first Java program. You now know the secret structure every Java developer uses, and you made the computer obey your command!"
          : "Well done. You have dissected the Java class skeleton, identified the JVM entry point, and produced console output. This foundation underpins every Java program you will ever write.",
        title: isJunior ? "Hello World — Achieved! 🏆" : "Java Foundations Established 🏆",
        keyPoints: [
          "Every Java program is wrapped in a public class whose name matches the file.",
          "Execution begins at public static void main(String[] args).",
          "System.out.println() writes a line of text to the console; every statement ends with a semicolon.",
        ],
        badgeReward: "Hello World Pioneer ☕",
        nextLesson: "JV_L1_02_VARS",
      }),
    ],
  };
}

// ─── LESSON 2: Variables & Data Types ────────────────────────────────────────
export function get_JV_L1_02_VARS_LESSON(theme: "junior" | "professional"): YamunaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "yamuna", name: "Yamuna Java AI Tutor" },
    course: { id: "java_core", levelId: "L1", levelSlug: "level-1", title: "Yamuna Java Core" },
    lesson: {
      id: "JV_L1_02_VARS",
      order: 2,
      title: "Variables & Data Types",
      sutra: "Variable Declaration Sutra",
      objective: "Declare and initialise variables of the five core Java types — int, double, char, boolean, and String — and print them using System.out.println.",
      durationMin: 45,
      difficulty: 1,
      xpReward: 100,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: isJunior ? "Java Memory Boxes" : "Static Typing in Java",
        tutorText: isJunior
          ? "In Java, variables are labelled memory boxes where your program stores information. Unlike Python, each box has a fixed type — you must say upfront whether the box will hold a whole number, a decimal, a letter, a yes/no flag, or a piece of text!"
          : "Java is a statically typed language: every variable must have its type declared at compile time. This lets the compiler catch type mismatches before your code ever runs — a significant safety advantage over dynamically typed languages.",
        headline: isJunior ? "Typed Memory Boxes" : "Static Type System",
        emoji: "📦",
        example: isJunior
          ? "int age = 15; // whole number box"
          : "int score = 95; // type checked at compile time",
        goal: isJunior
          ? "Learn to declare variables of five types and print their values."
          : "Declare and initialise variables using Java's five fundamental types.",
      }),
      buildConceptCard({
        stepLabel: "The Five Core Types",
        tutorText: isJunior
          ? "Java has five everyday types you will use constantly. Each type tells Java exactly how much memory to reserve and what kind of data the box can hold. Let us explore them one by one!"
          : "Java's five workhorse types cover the vast majority of application data. Understanding their storage size, range, and literal syntax is essential for writing correct, efficient code.",
        title: isJunior ? "Java's Five Core Types" : "Primitive Types & String",
        emoji: "🗂️",
        points: isJunior
          ? [
              "int — whole numbers (e.g., int score = 95;)",
              "double — decimal numbers (e.g., double price = 4.99;)",
              "char — a single character in single quotes (e.g., char grade = 'A';)",
              "boolean — true or false only (e.g., boolean passed = true;)",
              "String — text in double quotes (e.g., String name = \"Arjun\";)",
            ]
          : [
              "int — 32-bit signed integer; range −2,147,483,648 to 2,147,483,647.",
              "double — 64-bit IEEE 754 floating-point; preferred for decimal arithmetic.",
              "char — 16-bit Unicode character; literals use single quotes ('A').",
              "boolean — true or false; not interchangeable with 0/1 unlike C.",
              "String — a reference type (class), not a primitive; literals use double quotes.",
            ],
        explanationTitle: "Primitives vs Reference Types",
        explanationBody:
          "int, double, char, and boolean are primitive types stored directly on the stack. String is a reference type — the variable holds a reference to an object on the heap. This distinction matters for equality checks (== vs .equals()).",
      }),
      buildCodeWalkthrough({
        stepLabel: "Declaring & Printing Variables",
        tutorText:
          "Let us declare one variable of each type and print them all. Notice the syntax pattern: type, then name, then = assignment, then semicolon. String is capitalised because it is a class, not a primitive.",
        expression: "Variable declarations and output",
        codeSteps: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        int age = 16;",
          "        double gpa = 9.2;",
          "        char initial = 'A';",
          "        boolean enrolled = true;",
          '        String name = "Priya";',
          "        System.out.println(age);",
          "        System.out.println(gpa);",
          "        System.out.println(initial);",
          "        System.out.println(enrolled);",
          "        System.out.println(name);",
          "    }",
          "}",
        ],
        result: "Prints each value on its own line: 16, 9.2, A, true, Priya.",
      }),
      buildBugHunt({
        stepLabel: "Wrong Type Assignment Bug",
        tutorText: isJunior
          ? "A student tried to store a decimal number in an int box, put text in a char box, and forgot the semicolons! Java will refuse to compile this code. Find all the bugs and fix them so every variable matches its correct type."
          : "The following class has three type-mismatch errors and a missing semicolon. Java's compiler will reject it. Identify and fix each issue: correct the type declarations and add any missing statement terminators.",
        headline: "Fix the Type Errors",
        buggyCode: [
          "public class Main {",
          "    public static void main(String[] args) {",
          '        int temperature = 36.6',
          '        char symbol = "X";',
          '        boolean active = 1;',
          "        System.out.println(temperature);",
          "        System.out.println(symbol);",
          "        System.out.println(active);",
          "    }",
          "}",
        ].join("\n"),
        fixedCode: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        double temperature = 36.6;",
          "        char symbol = 'X';",
          "        boolean active = true;",
          "        System.out.println(temperature);",
          "        System.out.println(symbol);",
          "        System.out.println(active);",
          "    }",
          "}",
        ].join("\n"),
        explanation:
          "36.6 is a double, not an int. char literals use single quotes, not double quotes. Java boolean values are true/false, not 1/0. The first statement was also missing its semicolon.",
        hints: [
          "36.6 is a decimal number — which type stores decimals?",
          "char uses single quotes: 'X' not \"X\".",
          "boolean only accepts the literal keywords true or false.",
          "Check every statement ends with a semicolon.",
        ],
      }),
      buildJavaChallenge({
        stepLabel: isJunior ? "My Student Profile" : "Variable Declaration Exercise",
        tutorText: isJunior
          ? "Let us create a mini student profile! Declare a String for the student name, an int for their age, a double for their GPA, and a boolean for whether they passed the exam. Then print each variable on a separate line."
          : "Declare four variables representing a student record: a String (name), an int (age), a double (gpa), and a boolean (passed). Initialise each with any appropriate value and print all four using System.out.println.",
        boardTitle: isJunior ? "Student Profile Creator" : "Student Record Declaration",
        prompt:
          "Declare a String name, int age, double gpa, and boolean passed. Assign values and print each one.",
        starterCode: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        // Declare your four variables here",
          "",
          "        // Print each variable",
          "    }",
          "}",
        ].join("\n"),
        solutionCode: [
          "public class Main {",
          "    public static void main(String[] args) {",
          '        String name = "Arjun";',
          "        int age = 17;",
          "        double gpa = 8.7;",
          "        boolean passed = true;",
          "        System.out.println(name);",
          "        System.out.println(age);",
          "        System.out.println(gpa);",
          "        System.out.println(passed);",
          "    }",
          "}",
        ].join("\n"),
        hints: [
          'String name = "YourName"; — text goes in double quotes.',
          "int age = 17; — whole number, no decimal point.",
          "double gpa = 8.5; — include a decimal point.",
          "boolean passed = true; — use true or false (no quotes).",
          "Call System.out.println(variableName); for each variable.",
        ],
        openEnded: false,
      }),
      buildRecapSummary({
        stepLabel: "Types Mastered",
        tutorText: isJunior
          ? "Excellent! You now know how to give every variable its correct type label. Java's type system keeps your programs safe and fast — and you have just unlocked it!"
          : "Solid work. Precise type declarations are the foundation of Java's compile-time safety guarantees. Every variable you declare correctly is a potential runtime crash prevented.",
        title: isJunior ? "Java Types — Conquered! 🏆" : "Static Typing Mastered 🏆",
        keyPoints: [
          "Java requires every variable to have an explicit type declared before use.",
          "Use int for whole numbers, double for decimals, char for single characters (single quotes), boolean for true/false, and String for text (double quotes).",
          "Type mismatches are caught at compile time — fixing them keeps runtime bugs away.",
        ],
        badgeReward: "Type System Expert 🎖️",
        nextLesson: "JV_L1_03_MATH",
      }),
    ],
  };
}

// ─── LESSON 3: Operators & Math ───────────────────────────────────────────────
export function get_JV_L1_03_MATH_LESSON(theme: "junior" | "professional"): YamunaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "yamuna", name: "Yamuna Java AI Tutor" },
    course: { id: "java_core", levelId: "L1", levelSlug: "level-1", title: "Yamuna Java Core" },
    lesson: {
      id: "JV_L1_03_MATH",
      order: 3,
      title: "Operators & Math",
      sutra: "Arithmetic Sutra",
      objective: "Apply Java's arithmetic operators, understand integer vs floating-point division, and use Scanner to read two numbers then compute their sum, product, and quotient.",
      durationMin: 45,
      difficulty: 1,
      xpReward: 100,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: isJunior ? "Java as a Calculator!" : "Arithmetic & the Math Class",
        tutorText: isJunior
          ? "Did you know Java can do mathematics a million times faster than any human? From simple addition to advanced square roots, Java handles it all! In this lesson we will explore the arithmetic operators and a powerful built-in toolkit called the Math class."
          : "Java's arithmetic operators are the backbone of numerical computation. Understanding integer division truncation versus floating-point division, operator precedence, and the Math utility class separates correct programs from subtly broken ones.",
        headline: isJunior ? "Java the Super Calculator" : "Arithmetic Operators & Math API",
        emoji: "🧮",
        example: isJunior
          ? "10 / 3 = 3 (int) vs 10.0 / 3 = 3.333 (double)"
          : "int division truncates; cast to double for true quotient",
        goal: isJunior
          ? "Use +, -, *, / and % to compute results, and discover Math.pow and Math.sqrt."
          : "Master operator precedence, integer truncation, type promotion, and Math utility methods.",
      }),
      buildConceptCard({
        stepLabel: "Operators & Math Class",
        tutorText: isJunior
          ? "Java gives you six arithmetic operators and a special Math class packed with mathematical superpowers. The trickiest part is division: when both numbers are int, Java throws away the decimal remainder!"
          : "Java's arithmetic operators follow standard precedence (* / % before + -). The critical pitfall: integer division truncates toward zero. To preserve fractional results, at least one operand must be a double. The Math class provides static utility methods for more advanced operations.",
        title: isJunior ? "Java Arithmetic Toolkit" : "Operators & Math Utilities",
        emoji: "➕",
        points: isJunior
          ? [
              "+ addition, - subtraction, * multiplication, / division, % remainder (modulo).",
              "Integer division truncates: 7 / 2 gives 3, not 3.5.",
              "Use doubles for real division: 7.0 / 2 gives 3.5.",
              "Math.pow(2, 10) = 1024.0 — raises a number to a power.",
              "Math.sqrt(16) = 4.0 — computes the square root.",
            ]
          : [
              "+, -, *, / — standard arithmetic; precedence follows BODMAS/PEMDAS.",
              "% (modulo) returns the remainder: 10 % 3 == 1.",
              "int / int always truncates toward zero: 7 / 2 == 3.",
              "Cast to double for floating division: (double) 7 / 2 == 3.5.",
              "Math.pow(base, exp), Math.sqrt(n), Math.abs(n) — all return double.",
            ],
        explanationTitle: "Why does int division truncate?",
        explanationBody:
          "In Java, arithmetic between two int operands stays int — the result is stored in a fixed-size integer register and any fractional part is simply discarded. This is not rounding; 7/2 gives 3, not 4. Cast one operand to double ((double) a / b) to get the full result.",
      }),
      buildCodeWalkthrough({
        stepLabel: "int Division vs double Division",
        tutorText:
          "Let us compare integer and floating-point division side by side. Tracing through this code will make the truncation rule unforgettable. Notice how casting one operand to double changes the result completely.",
        expression: "Integer vs floating-point division",
        codeSteps: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        int a = 10;",
          "        int b = 3;",
          "        int intResult = a / b;           // truncates",
          "        double doubleResult = (double) a / b; // real division",
          "        int remainder = a % b;",
          "        System.out.println(intResult);      // 3",
          "        System.out.println(doubleResult);   // 3.3333333333333335",
          "        System.out.println(remainder);      // 1",
          "    }",
          "}",
        ],
        result: "Prints 3, then 3.3333333333333335, then 1 — demonstrating truncation, real division, and remainder.",
      }),
      buildOutputPrediction({
        stepLabel: "Predict Division Output",
        tutorText:
          "Test your understanding of integer division and the modulo operator. Look at the code below and predict every line of output before running it. Remember the truncation rule!",
        headline: "What are the three output lines?",
        codeSnippet: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        System.out.println(15 / 4);",
          "        System.out.println(15 % 4);",
          "        System.out.println(15.0 / 4);",
          "    }",
          "}",
        ].join("\n"),
        expectedOutput: "3\n3\n3.75",
        hints: [
          "15 / 4 — both are int, so Java truncates the decimal.",
          "15 % 4 — remainder when 15 is divided by 4 is 3 (4×3=12, 15-12=3).",
          "15.0 / 4 — one operand is double, so real division applies.",
        ],
      }),
      buildJavaChallenge({
        stepLabel: isJunior ? "Build a Calculator!" : "Two-Number Calculator",
        tutorText: isJunior
          ? "Time to build a real calculator! Read two whole numbers from the user, then print their sum, product, and quotient (as a decimal). Use Scanner to read input and remember to cast for real division!"
          : "Write a program that reads two integers from stdin using Scanner, then prints three results: their sum, their product, and their quotient as a double (cast one operand). Label each result for clarity.",
        boardTitle: isJunior ? "Mini Calculator" : "Arithmetic Calculator",
        prompt:
          "Read two integers using Scanner. Print their sum, product, and quotient (use casting for true decimal division).",
        starterCode: [
          "import java.util.Scanner;",
          "",
          "public class Main {",
          "    public static void main(String[] args) {",
          "        Scanner sc = new Scanner(System.in);",
          "        // Read two integers",
          "",
          "        // Print sum, product, and quotient",
          "    }",
          "}",
        ].join("\n"),
        solutionCode: [
          "import java.util.Scanner;",
          "",
          "public class Main {",
          "    public static void main(String[] args) {",
          "        Scanner sc = new Scanner(System.in);",
          "        int a = sc.nextInt();",
          "        int b = sc.nextInt();",
          "        System.out.println(a + b);",
          "        System.out.println(a * b);",
          "        System.out.println((double) a / b);",
          "    }",
          "}",
        ].join("\n"),
        hints: [
          "Use sc.nextInt() twice to read the two numbers.",
          "Sum: System.out.println(a + b);",
          "Product: System.out.println(a * b);",
          "Quotient: cast a to double — System.out.println((double) a / b);",
          "Make sure import java.util.Scanner; is the first line.",
        ],
        openEnded: false,
      }),
      buildRecapSummary({
        stepLabel: "Math Mastered",
        tutorText: isJunior
          ? "Fantastic! You have unlocked Java's arithmetic engine. Remember: when you see two ints being divided, the decimal part disappears — so cast to double when you need the real answer!"
          : "Excellent work. Mastering integer truncation now prevents a whole class of subtle numeric bugs in your future Java programs.",
        title: isJunior ? "Java Arithmetic — Mastered! 🏆" : "Arithmetic Operators Mastered 🏆",
        keyPoints: [
          "Java supports +, -, *, /, and % (modulo); operator precedence follows standard math rules.",
          "int / int truncates toward zero — use (double) cast on one operand for real division.",
          "The Math class provides static utility methods: Math.pow(), Math.sqrt(), Math.abs() all return double.",
        ],
        badgeReward: "Arithmetic Specialist 🎖️",
        nextLesson: "JV_L1_04_LOGIC",
      }),
    ],
  };
}

// ─── LESSON 4: Conditionals ───────────────────────────────────────────────────
export function get_JV_L1_04_LOGIC_LESSON(theme: "junior" | "professional"): YamunaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "yamuna", name: "Yamuna Java AI Tutor" },
    course: { id: "java_core", levelId: "L1", levelSlug: "level-1", title: "Yamuna Java Core" },
    lesson: {
      id: "JV_L1_04_LOGIC",
      order: 4,
      title: "Conditionals",
      sutra: "Conditional Sutra",
      objective: "Write branching programs using if / else if / else, switch statements, and the ternary operator to make data-driven decisions.",
      durationMin: 50,
      difficulty: 2,
      xpReward: 110,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: isJunior ? "Decisions in Code!" : "Branching Logic",
        tutorText: isJunior
          ? "Every smart app makes decisions — should the game say 'Level Up!' or 'Try Again'? Java uses if/else blocks to choose between different paths based on conditions. Today you will teach your program to think!"
          : "Branching logic is the foundation of program intelligence. Java provides three decision mechanisms — the if/else chain for boolean conditions, switch for discrete value matching, and the ternary operator for concise inline expressions.",
        headline: isJunior ? "Teaching Your Program to Think" : "Conditional Branching in Java",
        emoji: "🔀",
        example: isJunior
          ? "if (score >= 90) → A else if (score >= 80) → B else → C"
          : "if / else if / else, switch, condition ? valueA : valueB",
        goal: isJunior
          ? "Write an if/else chain that assigns a letter grade to a numeric score."
          : "Implement grade classification using if/else if/else, and apply the ternary operator.",
      }),
      buildConceptCard({
        stepLabel: "if / else if / else + switch + ternary",
        tutorText: isJunior
          ? "Java gives you three powerful tools to make decisions. The if/else chain checks conditions one by one. The switch statement matches exact values super efficiently. The ternary operator lets you make a quick choice in a single line!"
          : "Java's three conditional constructs serve different use cases. if/else if/else handles boolean ranges and complex conditions. switch (value) matches discrete constants efficiently and compiles to a jump table. The ternary operator (condition ? a : b) produces a value inline.",
        title: isJunior ? "Three Ways to Decide" : "Java's Three Conditional Constructs",
        emoji: "🧠",
        points: isJunior
          ? [
              "if (condition) { } — runs the block only if the condition is true.",
              "else if (condition) { } — checked only when all previous conditions were false.",
              "else { } — the fallback that runs when nothing else matched.",
              'switch (variable) { case value: ... break; } — perfect for matching exact values.',
              "condition ? trueValue : falseValue — ternary: picks one of two values in a single line.",
            ]
          : [
              "if (boolean expr) { } else if (...) { } else { } — evaluates conditions top-down.",
              "switch (intExpr/String/enum) { case X: ...; break; default: ...; } — fall-through without break.",
              "String grade = (score >= 90) ? \"A\" : \"B\"; — ternary produces an expression, not a statement.",
              "Comparison operators: ==, !=, <, <=, >, >=; logical: &&, ||, !.",
              "Always use else to handle unexpected inputs and avoid silent failures.",
            ],
        explanationTitle: "Ternary Operator Deep Dive",
        explanationBody:
          "The ternary operator (condition ? exprA : exprB) evaluates condition. If true, the whole expression evaluates to exprA; if false, to exprB. It is an expression (has a value), not a statement — so you can assign it or pass it as an argument directly.",
      }),
      buildCodeWalkthrough({
        stepLabel: "Grade Calculator",
        tutorText:
          "Let us trace a grade calculator that takes a numeric score and assigns a letter grade. Notice the cascade: conditions are tested top-to-bottom and only the first matching block executes. The ternary at the end also demonstrates a shorter style.",
        expression: "Score-to-grade mapping with if/else if/else",
        codeSteps: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        int score = 76;",
          '        String grade;',
          "        if (score >= 90) {",
          '            grade = "A";',
          "        } else if (score >= 80) {",
          '            grade = "B";',
          "        } else if (score >= 70) {",
          '            grade = "C";',
          "        } else if (score >= 60) {",
          '            grade = "D";',
          "        } else {",
          '            grade = "F";',
          "        }",
          "        System.out.println(grade);",
          '        String result = (score >= 60) ? "Pass" : "Fail";',
          "        System.out.println(result);",
          "    }",
          "}",
        ],
        result: 'Prints "C" (76 falls in the 70–79 range) and then "Pass" (ternary: 76 >= 60 is true).',
      }),
      buildConceptCheck({
        stepLabel: "Ternary Quiz",
        tutorText:
          "Let us confirm your understanding of the ternary operator before you use it in code. Read the expression carefully — what type of value does a ternary expression return?",
        headline: "What does the ternary operator produce?",
        question: 'What is the value of `result` after: `String result = (5 > 3) ? "yes" : "no";`?',
        options: ['"no"', '"yes"', "true", "null"],
        correctIndex: 1,
        explanation:
          '5 > 3 evaluates to true, so the ternary returns the first expression "yes". The second expression "no" is only returned when the condition is false.',
      }),
      buildJavaChallenge({
        stepLabel: isJunior ? "Grade Checker" : "Score-to-Grade Classifier",
        tutorText: isJunior
          ? "Build your own grade checker! Read a score from the user. If the score is 90 or above print 'A'. If 80 or above print 'B'. If 70 or above print 'C'. If 60 or above print 'D'. Otherwise print 'F'."
          : "Read an integer score from stdin using Scanner. Use an if/else if/else chain to print the corresponding letter grade: A (>=90), B (>=80), C (>=70), D (>=60), F (otherwise).",
        boardTitle: isJunior ? "Grade Checker" : "Grade Classifier",
        prompt:
          "Read an integer score. Print A for >=90, B for >=80, C for >=70, D for >=60, F otherwise.",
        starterCode: [
          "import java.util.Scanner;",
          "",
          "public class Main {",
          "    public static void main(String[] args) {",
          "        Scanner sc = new Scanner(System.in);",
          "        int score = sc.nextInt();",
          "        // Write your if/else if/else chain here",
          "    }",
          "}",
        ].join("\n"),
        solutionCode: [
          "import java.util.Scanner;",
          "",
          "public class Main {",
          "    public static void main(String[] args) {",
          "        Scanner sc = new Scanner(System.in);",
          "        int score = sc.nextInt();",
          "        if (score >= 90) {",
          '            System.out.println("A");',
          "        } else if (score >= 80) {",
          '            System.out.println("B");',
          "        } else if (score >= 70) {",
          '            System.out.println("C");',
          "        } else if (score >= 60) {",
          '            System.out.println("D");',
          "        } else {",
          '            System.out.println("F");',
          "        }",
          "    }",
          "}",
        ].join("\n"),
        hints: [
          "Start with if (score >= 90) — the highest threshold first.",
          "Each subsequent else if should check the next threshold down.",
          "The final else catches everything below 60 — no condition needed.",
          "Each branch should call System.out.println with a letter in double quotes.",
          "Curly braces around each branch are optional for single statements but are good practice.",
        ],
        openEnded: false,
      }),
      buildRecapSummary({
        stepLabel: "Logic Unlocked",
        tutorText: isJunior
          ? "You have given your Java program a brain! It can now make decisions based on data. The if/else chain is one of the most used tools in every Java developer's kit."
          : "Branching logic is the intelligence layer of every Java application. The patterns you practised here — guarded chains, exhaustive else, and the ternary for inline expressions — apply at every scale of Java development.",
        title: isJunior ? "Conditionals — Mastered! 🏆" : "Branching Logic Mastered 🏆",
        keyPoints: [
          "if / else if / else evaluates conditions top-down; only the first matching block executes.",
          "switch matches discrete values and requires break to prevent fall-through.",
          "The ternary operator (condition ? a : b) is an expression that returns one of two values inline.",
        ],
        badgeReward: "Logic Architect 🎖️",
        nextLesson: "JV_L1_05_LOOPS",
      }),
    ],
  };
}

// ─── LESSON 5: Loops ──────────────────────────────────────────────────────────
export function get_JV_L1_05_LOOPS_LESSON(theme: "junior" | "professional"): YamunaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "yamuna", name: "Yamuna Java AI Tutor" },
    course: { id: "java_core", levelId: "L1", levelSlug: "level-1", title: "Yamuna Java Core" },
    lesson: {
      id: "JV_L1_05_LOOPS",
      order: 5,
      title: "Loops",
      sutra: "Loop Sutra",
      objective: "Write while, do-while, and for loops in Java, use break and continue to control iteration, and read N from stdin to print a sequence.",
      durationMin: 50,
      difficulty: 2,
      xpReward: 110,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: isJunior ? "The Power of Loops!" : "Iteration in Java",
        tutorText: isJunior
          ? "Imagine printing the numbers 1 to 100. Would you write 100 System.out.println lines? Never! Java loops let you repeat any block of code as many times as you want with just a few lines. Loops are where programs get their superpowers!"
          : "Iteration is the mechanism that transforms static programs into dynamic, data-driven applications. Java provides three loop constructs — while, do-while, and for — each optimised for a different use case. Choosing the right one signals code craftsmanship.",
        headline: isJunior ? "Loops: Code That Repeats!" : "Java's Three Loop Constructs",
        emoji: "🔄",
        example: isJunior
          ? "for (int i = 1; i <= 10; i++) → prints 1 to 10 automatically"
          : "while (cond), do-while (cond), for (init; test; update)",
        goal: isJunior
          ? "Use for, while, and do-while loops to repeat code efficiently."
          : "Select the correct loop construct for a given iteration pattern and use break/continue safely.",
      }),
      buildConceptCard({
        stepLabel: "while / do-while / for + break / continue",
        tutorText: isJunior
          ? "Java has three types of loops, each with its own special use. The while loop checks first, the do-while loop runs at least once, and the for loop is perfect when you know exactly how many times to repeat."
          : "while pre-checks the condition before each iteration — suitable when the count is unknown. do-while post-checks, guaranteeing at least one execution. for bundles initialisation, condition, and update into one line — ideal for counted loops. break exits the loop immediately; continue skips to the next iteration.",
        title: isJunior ? "Three Types of Java Loops" : "Loop Constructs & Flow Control",
        emoji: "🌀",
        points: isJunior
          ? [
              "while (condition) { } — repeats while condition is true; stops when it turns false.",
              "do { } while (condition); — always runs the block at least once before checking.",
              "for (int i = 0; i < n; i++) { } — perfect when you know the exact count.",
              "break; — exits the loop immediately, no matter what.",
              "continue; — skips the rest of this iteration and jumps to the next one.",
            ]
          : [
              "while (expr) { } — condition tested before each iteration; body may execute zero times.",
              "do { } while (expr); — body executes once unconditionally; useful for menus and input validation.",
              "for (init; condition; update) { } — all loop components in one declaration; preferred for index-based iteration.",
              "break — transfers control to the statement immediately after the loop.",
              "continue — transfers control to the update expression (for) or condition test (while/do-while).",
            ],
        explanationTitle: "Choosing the Right Loop",
        explanationBody:
          "Use for when the iteration count is known at loop entry. Use while when iterating until an unknown condition changes. Use do-while when the body must execute at least once (e.g., input validation loops). In practice, for is the most common choice in Java.",
      }),
      buildCodeWalkthrough({
        stepLabel: "Multiplication Table with for",
        tutorText:
          "Let us trace a for loop that prints the multiplication table for a given number. The for loop header initialises i to 1, repeats while i is 10 or less, and increments i at the end of each iteration. Watch how the three parts work together.",
        expression: "Multiplication table using a for loop",
        codeSteps: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        int n = 5;",
          "        for (int i = 1; i <= 10; i++) {",
          "            System.out.println(n + \" x \" + i + \" = \" + (n * i));",
          "        }",
          "    }",
          "}",
        ],
        result: 'Prints "5 x 1 = 5" through "5 x 10 = 50", one line per iteration.',
      }),
      buildBugHunt({
        stepLabel: "Infinite Loop Bug",
        tutorText: isJunior
          ? "A student wrote a countdown loop but forgot to decrease the counter! The program prints 5 forever and the computer hangs. Find the missing statement that makes the counter decrease and add it inside the loop."
          : "The while loop below is missing its loop update statement, causing it to spin forever on the initial value of count. Add the decrement inside the loop body so the condition eventually becomes false.",
        headline: "Fix the Infinite Loop",
        buggyCode: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        int count = 5;",
          "        while (count > 0) {",
          "            System.out.println(count);",
          "        }",
          '        System.out.println("Done!");',
          "    }",
          "}",
        ].join("\n"),
        fixedCode: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        int count = 5;",
          "        while (count > 0) {",
          "            System.out.println(count);",
          "            count--;",
          "        }",
          '        System.out.println("Done!");',
          "    }",
          "}",
        ].join("\n"),
        explanation:
          "Without count-- (or count = count - 1) inside the loop body, count stays at 5 forever. The condition count > 0 is always true, so the loop never exits. Adding count-- after the println ensures the counter decrements each iteration until it reaches 0.",
        hints: [
          "What must change inside the loop so the condition eventually becomes false?",
          "Add count--; after the println statement, still inside the loop braces.",
          "count-- is shorthand for count = count - 1.",
        ],
      }),
      buildJavaChallenge({
        stepLabel: isJunior ? "Count to N!" : "Print 1 to N",
        tutorText: isJunior
          ? "Read a number N from the user and print all the numbers from 1 to N, each on its own line. Use a for loop — it is perfect for this job because you know exactly how many times to repeat!"
          : "Read an integer N from stdin using Scanner. Use a for loop to print the integers 1 through N inclusive, one per line.",
        boardTitle: isJunior ? "Number Counter" : "Sequence Printer",
        prompt: "Read integer N from Scanner. Use a for loop to print 1 through N, each on its own line.",
        starterCode: [
          "import java.util.Scanner;",
          "",
          "public class Main {",
          "    public static void main(String[] args) {",
          "        Scanner sc = new Scanner(System.in);",
          "        int n = sc.nextInt();",
          "        // Write your for loop here",
          "    }",
          "}",
        ].join("\n"),
        solutionCode: [
          "import java.util.Scanner;",
          "",
          "public class Main {",
          "    public static void main(String[] args) {",
          "        Scanner sc = new Scanner(System.in);",
          "        int n = sc.nextInt();",
          "        for (int i = 1; i <= n; i++) {",
          "            System.out.println(i);",
          "        }",
          "    }",
          "}",
        ].join("\n"),
        hints: [
          "Start the loop counter at 1: for (int i = 1; ...)",
          "The condition should be i <= n to include N itself.",
          "The update expression i++ increments i by 1 each time.",
          "System.out.println(i); prints the current value and moves to a new line.",
          "Make sure the println is inside the loop's curly braces.",
        ],
        openEnded: false,
      }),
      buildRecapSummary({
        stepLabel: "Loops Conquered",
        tutorText: isJunior
          ? "You have mastered the loop — the engine of every repeating program! Remember: while checks first, do-while runs at least once, and for is great when you know the count. Never forget to update your counter!"
          : "Loops are the computational engine of every non-trivial program. The distinction between pre-condition (while) and post-condition (do-while) iteration, combined with the expressiveness of the for header, gives you precise control over any repetition pattern.",
        title: isJunior ? "Java Loops — Conquered! 🏆" : "Iteration Mastered 🏆",
        keyPoints: [
          "while tests the condition before each iteration and may run zero times; do-while always runs at least once.",
          "for (init; condition; update) is preferred for counted loops — all iteration logic lives in one line.",
          "break exits the loop immediately; continue skips the remainder of the current iteration.",
        ],
        badgeReward: "Loop Engineer 🎖️",
        nextLesson: "JV_L1_06_ARRAYS",
      }),
    ],
  };
}

// ─── LESSON 6: Arrays & Strings ───────────────────────────────────────────────
export function get_JV_L1_06_ARRAYS_LESSON(theme: "junior" | "professional"): YamunaLessonPayload {
  const isJunior = theme === "junior";
  return {
    product: { id: "yamuna", name: "Yamuna Java AI Tutor" },
    course: { id: "java_core", levelId: "L1", levelSlug: "level-1", title: "Yamuna Java Core" },
    lesson: {
      id: "JV_L1_06_ARRAYS",
      order: 6,
      title: "Arrays & Strings",
      sutra: "Array & String Sutra",
      objective: "Declare and initialise integer arrays, traverse them using enhanced for-each loops, use key String methods, and compute the maximum and sum from a user-supplied array.",
      durationMin: 55,
      difficulty: 2,
      xpReward: 120,
    },
    progress: { currentStepIndex: 0, totalSteps: 6 },
    helpActions: [{ id: "help", label: "I need a hint" }],
    steps: [
      buildIntroHook({
        stepLabel: isJunior ? "Collections of Data!" : "Arrays & String API",
        tutorText: isJunior
          ? "What if you need to store the scores of 30 students? Creating 30 separate variables would be a nightmare! Java arrays let you store many values of the same type in one single named container with numbered slots. And strings come with a built-in toolkit of powerful text manipulation methods!"
          : "Arrays are Java's most fundamental data collection: a fixed-length, zero-indexed, contiguous block of homogeneous elements. String, while a class, exposes a rich immutable API for text processing. Together they cover the majority of real-world data representation needs at this level.",
        headline: isJunior ? "Arrays: Many Values, One Name" : "Arrays & the String API",
        emoji: "📋",
        example: isJunior
          ? "int[] scores = {95, 88, 76}; → scores[0] is 95"
          : "int[] arr = new int[n]; // zero-indexed, fixed length",
        goal: isJunior
          ? "Create an array, traverse it with for-each, and compute max and sum."
          : "Declare, initialise, and traverse arrays; apply String methods; compute aggregate statistics.",
      }),
      buildConceptCard({
        stepLabel: "Arrays + String Methods",
        tutorText: isJunior
          ? "An array is a row of numbered boxes — the numbering always starts at 0, not 1! To loop over every element you can use the handy for-each syntax which is cleaner and less error-prone. Strings also have lots of built-in methods you can call with a dot."
          : "Java arrays are objects with a fixed length field (.length). Zero-based indexing means an array of size n has valid indices 0 to n-1. The enhanced for-each (for (type elem : array)) is preferred for read-only traversal. String is immutable; methods like .length(), .charAt(), .substring(), .toUpperCase(), and .contains() return new objects.",
        title: isJunior ? "Arrays and String Methods" : "Arrays & String Immutability",
        emoji: "🗃️",
        points: isJunior
          ? [
              "int[] nums = {10, 20, 30}; — declares and initialises an array of three ints.",
              "nums[0] is 10, nums[1] is 20, nums[2] is 30 — indexing starts at 0!",
              "nums.length gives the number of elements (3 in this case).",
              'for (int n : nums) { } — for-each loop visits every element without needing an index.',
              'String methods: .length(), .toUpperCase(), .charAt(0), .contains("hi").',
            ]
          : [
              "int[] arr = new int[5]; — declares an array of 5 ints, all initialised to 0.",
              "int[] arr = {1, 2, 3}; — array literal initialiser.",
              "arr.length — field (not method) returning the fixed size; never throws, never null.",
              "for (int val : arr) { } — enhanced for-each; cannot modify elements by reassigning val.",
              "String methods: .length(), .charAt(i), .substring(start, end), .indexOf(str), .toUpperCase(), .trim().",
            ],
        explanationTitle: "Why does indexing start at 0?",
        explanationBody:
          "Array indexing starts at 0 because the index represents an offset from the base memory address of the array. The first element is 0 positions away from the start, so its index is 0. This convention is shared across C, C++, Java, JavaScript, and Python.",
      }),
      buildCodeWalkthrough({
        stepLabel: "Array Traversal with for-each",
        tutorText:
          "Let us trace an array that stores exam scores and computes their total using a for-each loop. Notice how the for-each variable receives a copy of each element — we accumulate the total in a separate sum variable declared before the loop.",
        expression: "Sum of an int array using for-each",
        codeSteps: [
          "public class Main {",
          "    public static void main(String[] args) {",
          "        int[] scores = {88, 92, 74, 95, 81};",
          "        int sum = 0;",
          "        int max = scores[0];",
          "        for (int s : scores) {",
          "            sum += s;",
          "            if (s > max) {",
          "                max = s;",
          "            }",
          "        }",
          "        System.out.println(sum);",
          "        System.out.println(max);",
          "    }",
          "}",
        ],
        result:
          "Prints 430 (sum of all five scores) and 95 (the maximum value found during traversal).",
      }),
      buildOutputPrediction({
        stepLabel: "Predict Array Output",
        tutorText:
          "Trace through this array code carefully. Pay attention to the starting value of max and how it updates as the loop progresses. Predict both output lines before running.",
        headline: "What are the two output lines?",
        codeSnippet: [
          "public class Main {",
          "    public static void main(String[] args) {",
          '        String[] words = {"Java", "is", "fun"};',
          "        for (String w : words) {",
          "            System.out.println(w.length());",
          "        }",
          "    }",
          "}",
        ].join("\n"),
        expectedOutput: "4\n2\n3",
        hints: [
          '"Java".length() is 4.',
          '"is".length() is 2.',
          '"fun".length() is 3.',
          "The for-each visits each element in order: Java, is, fun.",
        ],
      }),
      buildJavaChallenge({
        stepLabel: isJunior ? "Max and Sum Finder!" : "Array Statistics",
        tutorText: isJunior
          ? "Read N numbers from the user into an array, then find the biggest number and the total sum. Print the maximum first, then the sum. Use Scanner to read each number and a for-each loop to process them!"
          : "Read integer N from stdin. Read N integers into an int[] array using Scanner. Traverse the array with a for-each loop to compute and print the maximum value and the total sum (max on the first line, sum on the second).",
        boardTitle: isJunior ? "Max and Sum Calculator" : "Array Aggregation Exercise",
        prompt:
          "Read N integers into an array. Print the maximum value on line 1 and the total sum on line 2.",
        starterCode: [
          "import java.util.Scanner;",
          "",
          "public class Main {",
          "    public static void main(String[] args) {",
          "        Scanner sc = new Scanner(System.in);",
          "        int n = sc.nextInt();",
          "        int[] nums = new int[n];",
          "        for (int i = 0; i < n; i++) {",
          "            nums[i] = sc.nextInt();",
          "        }",
          "        // Compute max and sum using a for-each loop",
          "    }",
          "}",
        ].join("\n"),
        solutionCode: [
          "import java.util.Scanner;",
          "",
          "public class Main {",
          "    public static void main(String[] args) {",
          "        Scanner sc = new Scanner(System.in);",
          "        int n = sc.nextInt();",
          "        int[] nums = new int[n];",
          "        for (int i = 0; i < n; i++) {",
          "            nums[i] = sc.nextInt();",
          "        }",
          "        int max = nums[0];",
          "        int sum = 0;",
          "        for (int num : nums) {",
          "            sum += num;",
          "            if (num > max) {",
          "                max = num;",
          "            }",
          "        }",
          "        System.out.println(max);",
          "        System.out.println(sum);",
          "    }",
          "}",
        ].join("\n"),
        hints: [
          "Initialise max = nums[0] before the loop — the first element is a safe starting guess.",
          "Initialise sum = 0 before the loop.",
          "Inside the for-each, do sum += num; to accumulate.",
          "Inside the for-each, do if (num > max) { max = num; } to track the maximum.",
          "After the loop, print max first, then sum.",
        ],
        openEnded: false,
      }),
      buildRecapSummary({
        stepLabel: "Arrays & Strings Mastered",
        tutorText: isJunior
          ? "Outstanding! You have mastered Java arrays and string methods. You can now store multiple values in one container, loop through them efficiently, and compute useful statistics like maximum and sum. That is real programming power!"
          : "Arrays and String form the bedrock of Java data handling. The patterns practiced here — array initialisation, for-each traversal, running maximum/sum aggregation — appear repeatedly in production Java code and form the foundation for understanding ArrayList and Collections.",
        title: isJunior ? "Arrays & Strings — Mastered! 🏆" : "Arrays & String API Mastered 🏆",
        keyPoints: [
          "Java arrays are zero-indexed and fixed in size; .length gives the element count.",
          "The enhanced for-each (for (type elem : array)) is the cleanest way to traverse arrays read-only.",
          "String is immutable — methods like .toUpperCase() and .substring() return new String objects rather than modifying the original.",
        ],
        badgeReward: "Array Architect 🎖️",
        nextLesson: "JV_L1_07_METHODS",
      }),
    ],
  };
}
