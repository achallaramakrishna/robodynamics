// ─── Yamuna Program Bank — Chapter 02: Variables & Data Types ────────────────
// Chapter: JCH02_VARS
// Concepts: int, double, char, boolean, String, type casting,
//           var (Java 10+), final, Scanner, BigDecimal, overflow
// 15 programs across 5 tiers (3 per tier)

import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH02_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────── BEGINNER ────────────────────────────────────

  {
    id: "JCH02_B1",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "beginner",
    tierIndex: 0,
    title: "Student Profile",
    emoji: "🎓",
    tagline: "Store name, age, and GPA in typed variables and print them.",
    problemStatement:
      "Read a student's name (String), age (int), and GPA (double) from standard input.\n" +
      "Store each value in an appropriately typed variable and print all three.\n\n" +
      "Output:\n" +
      "```\n" +
      "Name: <name>\n" +
      "Age: <age>\n" +
      "GPA: <gpa>\n" +
      "```\n" +
      "GPA should be printed with exactly 2 decimal places.",
    inputFormat:
      "Line 1: name (String, single word).\nLine 2: age (int).\nLine 3: GPA (double).",
    outputFormat:
      "Three lines: `Name: <name>`, `Age: <age>`, `GPA: <gpa with 2 decimals>`.",
    examples: [
      {
        input: "Riya\n20\n9.1",
        output: "Name: Riya\nAge: 20\nGPA: 9.10",
        explanation: "Name is String, age is int, GPA is double displayed as 9.10.",
      },
      {
        input: "Kiran\n18\n7.5",
        output: "Name: Kiran\nAge: 18\nGPA: 7.50",
        explanation: "GPA 7.5 formatted as 7.50 with two decimal places.",
      },
    ],
    constraints: [
      "Name is a single word, length 1–50.",
      "Age is an integer 0–150.",
      "GPA is a double 0.0–10.0.",
      "GPA must be printed with exactly 2 decimal places.",
    ],
    hints: [
      "Declare variables with explicit types: String name, int age, double gpa.",
      "Use sc.nextLine() for the name, sc.nextInt() for age, sc.nextDouble() for GPA.",
      "Use printf(\"GPA: %.2f%n\", gpa) for 2 decimal places.",
      "Or use String.format(\"%.2f\", gpa) if you prefer println.",
    ],
    referenceProgram: {
      title: "Typed Variable Declaration",
      description: "Declaring and printing int, String, and double variables",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        String course = sc.nextLine();\n` +
        `        int seats = sc.nextInt();\n` +
        `        double fee = sc.nextDouble();\n` +
        `        System.out.println("Course: " + course);\n` +
        `        System.out.println("Seats: " + seats);\n` +
        `        System.out.printf("Fee: %.2f%n", fee);\n` +
        `    }\n` +
        `}`,
      explanation:
        "Each primitive type has a corresponding Scanner method. printf with %.2f ensures exactly two decimal places.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        // Declare String name, int age, double gpa\n` +
      `        // Read and print the student profile\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String name = sc.nextLine();\n` +
      `        int age = sc.nextInt();\n` +
      `        double gpa = sc.nextDouble();\n` +
      `        System.out.println("Name: " + name);\n` +
      `        System.out.println("Age: " + age);\n` +
      `        System.out.printf("GPA: %.2f%n", gpa);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_B1_T1",
        label: "Riya 20 9.1",
        mockInputs: ["Riya", "20", "9.1"],
        expectedOutput: "Name: Riya\nAge: 20\nGPA: 9.10",
      },
      {
        id: "JCH02_B1_T2",
        label: "Kiran 18 7.5",
        mockInputs: ["Kiran", "18", "7.5"],
        expectedOutput: "Name: Kiran\nAge: 18\nGPA: 7.50",
      },
      {
        id: "JCH02_B1_T3",
        label: "GPA 10.0 max (boundary)",
        mockInputs: ["Top", "21", "10.0"],
        expectedOutput: "Name: Top\nAge: 21\nGPA: 10.00",
        isBoundary: true,
      },
    ],
    concepts: ["String", "int", "double", "Scanner", "printf", "typed variables"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH02_B2",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "beginner",
    tierIndex: 1,
    title: "Temperature Converter",
    emoji: "🌡️",
    tagline: "Convert Celsius to Fahrenheit using the standard formula.",
    problemStatement:
      "Read a temperature in Celsius (double) and convert it to Fahrenheit.\n\n" +
      "Formula: F = C × 9/5 + 32\n\n" +
      "Print the result with 2 decimal places:\n" +
      "`<celsius>C = <fahrenheit>F`",
    inputFormat: "A single double value representing degrees Celsius.",
    outputFormat: "`<celsius>C = <fahrenheit>F` with both values to 2 decimal places.",
    examples: [
      {
        input: "100.0",
        output: "100.00C = 212.00F",
        explanation: "Boiling point: 100 × 9/5 + 32 = 212.",
      },
      {
        input: "0.0",
        output: "0.00C = 32.00F",
        explanation: "Freezing point: 0 × 9/5 + 32 = 32.",
      },
    ],
    constraints: [
      "Celsius is a double between -273.15 and 1000.0.",
      "Print both Celsius and Fahrenheit with exactly 2 decimal places.",
    ],
    hints: [
      "Read Celsius with sc.nextDouble().",
      "Formula: double fahrenheit = celsius * 9.0 / 5.0 + 32;",
      "Use 9.0/5.0, not 9/5 — integer division 9/5 = 1, not 1.8!",
      "Print with printf(\"%.2fC = %.2fF%n\", celsius, fahrenheit).",
    ],
    referenceProgram: {
      title: "Arithmetic with Doubles",
      description: "Applying a formula to a double variable and printing the result",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        double kmh = sc.nextDouble();\n` +
        `        double ms = kmh / 3.6;\n` +
        `        System.out.printf("%.2f km/h = %.2f m/s%n", kmh, ms);\n` +
        `    }\n` +
        `}`,
      explanation:
        "Dividing by 3.6 (a double literal) keeps the result as a double. printf formats to 2 decimal places.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double celsius = sc.nextDouble();\n` +
      `        // Compute fahrenheit and print\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double celsius = sc.nextDouble();\n` +
      `        double fahrenheit = celsius * 9.0 / 5.0 + 32.0;\n` +
      `        System.out.printf("%.2fC = %.2fF%n", celsius, fahrenheit);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_B2_T1",
        label: "Boiling point",
        mockInputs: ["100.0"],
        expectedOutput: "100.00C = 212.00F",
      },
      {
        id: "JCH02_B2_T2",
        label: "Freezing point",
        mockInputs: ["0.0"],
        expectedOutput: "0.00C = 32.00F",
      },
      {
        id: "JCH02_B2_T3",
        label: "Absolute zero (boundary)",
        mockInputs: ["-273.15"],
        expectedOutput: "-273.15C = -459.67F",
        isBoundary: true,
      },
    ],
    concepts: ["double arithmetic", "formula conversion", "printf", "floating-point division"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH02_B3",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "beginner",
    tierIndex: 2,
    title: "Circle Calculator",
    emoji: "⭕",
    tagline: "Compute area and circumference of a circle using Math.PI.",
    problemStatement:
      "Read the radius of a circle (double) and compute:\n" +
      "- Area = π × r²\n" +
      "- Circumference = 2 × π × r\n\n" +
      "Use `Math.PI` for the value of π.\n" +
      "Print both results with 4 decimal places:\n" +
      "```\n" +
      "Area: <area>\n" +
      "Circumference: <circumference>\n" +
      "```",
    inputFormat: "A single double representing the radius.",
    outputFormat:
      "`Area: <area>` and `Circumference: <circ>` each with 4 decimal places.",
    examples: [
      {
        input: "5.0",
        output: "Area: 78.5398\nCircumference: 31.4159",
        explanation:
          "Area = π×25 ≈ 78.5398; Circumference = 10π ≈ 31.4159.",
      },
      {
        input: "1.0",
        output: "Area: 3.1416\nCircumference: 6.2832",
        explanation: "Unit circle: area = π, circumference = 2π.",
      },
    ],
    constraints: [
      "Radius is a positive double, 0.0001 <= r <= 10000.",
      "Print both values with exactly 4 decimal places.",
      "Use Math.PI — do not hardcode 3.14.",
    ],
    hints: [
      "Math.PI is a predefined constant in Java: 3.141592653589793",
      "Area formula: double area = Math.PI * radius * radius;",
      "Or use Math.pow: Math.PI * Math.pow(radius, 2)",
      "printf(\"Area: %.4f%n\", area) prints 4 decimal places.",
    ],
    referenceProgram: {
      title: "Using Math Constants",
      description: "Using Math.PI and Math.pow in calculations",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        double side = sc.nextDouble();\n` +
        `        double diag = Math.sqrt(2) * side;\n` +
        `        System.out.printf("Diagonal: %.4f%n", diag);\n` +
        `    }\n` +
        `}`,
      explanation:
        "Java's Math class provides PI, E, sqrt, pow, and more as constants and methods.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double radius = sc.nextDouble();\n` +
      `        // Compute area and circumference using Math.PI\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double radius = sc.nextDouble();\n` +
      `        double area = Math.PI * radius * radius;\n` +
      `        double circumference = 2 * Math.PI * radius;\n` +
      `        System.out.printf("Area: %.4f%n", area);\n` +
      `        System.out.printf("Circumference: %.4f%n", circumference);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_B3_T1",
        label: "Radius 5",
        mockInputs: ["5.0"],
        expectedOutput: "Area: 78.5398\nCircumference: 31.4159",
      },
      {
        id: "JCH02_B3_T2",
        label: "Unit circle",
        mockInputs: ["1.0"],
        expectedOutput: "Area: 3.1416\nCircumference: 6.2832",
      },
      {
        id: "JCH02_B3_T3",
        label: "Very small radius (boundary)",
        mockInputs: ["0.1"],
        expectedOutput: "Area: 0.0314\nCircumference: 0.6283",
        isBoundary: true,
      },
    ],
    concepts: ["Math.PI", "double arithmetic", "Math.pow", "printf %.4f"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  // ─────────────────────────── INTERMEDIATE ─────────────────────────────────

  {
    id: "JCH02_I1",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "intermediate",
    tierIndex: 0,
    title: "Data Type Detective",
    emoji: "🔍",
    tagline: "Inspect an integer as double, char, and boolean — all in one program.",
    problemStatement:
      "Read an integer value and print four representations of it:\n\n" +
      "1. Its integer value.\n" +
      "2. Its double equivalent (cast to double).\n" +
      "3. Its char equivalent (cast to char — the Unicode character at that code point).\n" +
      "4. Whether it is positive (`true` or `false`).\n\n" +
      "Output format:\n" +
      "```\n" +
      "int: <value>\n" +
      "double: <value>.0\n" +
      "char: <character>\n" +
      "positive: <true|false>\n" +
      "```",
    inputFormat: "A single integer (between 32 and 126 for a printable char).",
    outputFormat: "Four lines as described.",
    examples: [
      {
        input: "65",
        output: "int: 65\ndouble: 65.0\nchar: A\npositive: true",
        explanation: "65 cast to char is 'A' (ASCII). It is positive so boolean is true.",
      },
      {
        input: "97",
        output: "int: 97\ndouble: 97.0\nchar: a\npositive: true",
        explanation: "97 is lowercase 'a' in ASCII/Unicode.",
      },
    ],
    constraints: [
      "Input is an integer between 32 and 126 (printable ASCII range).",
      "double value is printed as X.0 (default double println format).",
      "boolean is printed as true or false (lowercase).",
    ],
    hints: [
      "Cast to double: double d = (double) n;",
      "Cast to char: char c = (char) n;",
      "Boolean expression: boolean isPositive = n > 0;",
      "System.out.println prints booleans as lowercase true/false.",
    ],
    referenceProgram: {
      title: "Explicit Type Casting",
      description: "Casting an int to double and char",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        int n = 72;\n` +
        `        double d = (double) n;\n` +
        `        char c = (char) n;\n` +
        `        boolean pos = n > 0;\n` +
        `        System.out.println("int: " + n);\n` +
        `        System.out.println("double: " + d);\n` +
        `        System.out.println("char: " + c);\n` +
        `        System.out.println("positive: " + pos);\n` +
        `    }\n` +
        `}`,
      explanation:
        "(double) n is a widening cast — always safe. (char) n reinterprets the int as a Unicode code point.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        // Print int, double cast, char cast, positive boolean\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        double d = (double) n;\n` +
      `        char c = (char) n;\n` +
      `        boolean isPositive = n > 0;\n` +
      `        System.out.println("int: " + n);\n` +
      `        System.out.println("double: " + d);\n` +
      `        System.out.println("char: " + c);\n` +
      `        System.out.println("positive: " + isPositive);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_I1_T1",
        label: "65 = A",
        mockInputs: ["65"],
        expectedOutput: "int: 65\ndouble: 65.0\nchar: A\npositive: true",
      },
      {
        id: "JCH02_I1_T2",
        label: "97 = a",
        mockInputs: ["97"],
        expectedOutput: "int: 97\ndouble: 97.0\nchar: a\npositive: true",
      },
      {
        id: "JCH02_I1_T3",
        label: "Space character (boundary)",
        mockInputs: ["32"],
        expectedOutput: "int: 32\ndouble: 32.0\nchar:  \npositive: true",
        isBoundary: true,
      },
    ],
    concepts: ["type casting", "(double)", "(char)", "boolean expressions", "Unicode"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH02_I2",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "intermediate",
    tierIndex: 1,
    title: "Swap Variables",
    emoji: "🔄",
    tagline: "Swap two integers without a temporary variable using arithmetic.",
    problemStatement:
      "Read two integers `a` and `b`. Swap their values WITHOUT using a third variable.\n\n" +
      "Use the arithmetic swap technique:\n" +
      "- a = a + b\n" +
      "- b = a - b\n" +
      "- a = a - b\n\n" +
      "Print the values before and after swapping:\n" +
      "```\n" +
      "Before: a=<a> b=<b>\n" +
      "After: a=<b> b=<a>\n" +
      "```",
    inputFormat: "Line 1: integer a. Line 2: integer b.",
    outputFormat: "Two lines showing values before and after swap.",
    examples: [
      {
        input: "10\n20",
        output: "Before: a=10 b=20\nAfter: a=20 b=10",
        explanation: "a and b are swapped using arithmetic only.",
      },
      {
        input: "7\n3",
        output: "Before: a=7 b=3\nAfter: a=3 b=7",
        explanation: "Works for any two integers.",
      },
    ],
    constraints: [
      "No third variable allowed for the swap.",
      "Integers are in range -10000 to 10000.",
      "Use the arithmetic technique: a=a+b; b=a-b; a=a-b;",
    ],
    hints: [
      "First print Before: with original values.",
      "Then apply: a = a + b; b = a - b; a = a - b;",
      "Finally print After: with swapped values.",
      "Note: arithmetic swap can overflow for very large numbers — XOR swap is safer for large values.",
    ],
    referenceProgram: {
      title: "Arithmetic Swap Technique",
      description: "Swapping two variables without a temporary using addition and subtraction",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        int x = 5, y = 9;\n` +
        `        System.out.println("Before: x=" + x + " y=" + y);\n` +
        `        x = x + y;  // x=14\n` +
        `        y = x - y;  // y=5\n` +
        `        x = x - y;  // x=9\n` +
        `        System.out.println("After: x=" + x + " y=" + y);\n` +
        `    }\n` +
        `}`,
      explanation:
        "After step 1, x holds the sum. Step 2 recovers the original x from the sum. Step 3 recovers the original y.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int a = sc.nextInt();\n` +
      `        int b = sc.nextInt();\n` +
      `        // Print before, swap without temp, print after\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int a = sc.nextInt();\n` +
      `        int b = sc.nextInt();\n` +
      `        System.out.println("Before: a=" + a + " b=" + b);\n` +
      `        a = a + b;\n` +
      `        b = a - b;\n` +
      `        a = a - b;\n` +
      `        System.out.println("After: a=" + a + " b=" + b);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_I2_T1",
        label: "10 and 20",
        mockInputs: ["10", "20"],
        expectedOutput: "Before: a=10 b=20\nAfter: a=20 b=10",
      },
      {
        id: "JCH02_I2_T2",
        label: "7 and 3",
        mockInputs: ["7", "3"],
        expectedOutput: "Before: a=7 b=3\nAfter: a=3 b=7",
      },
      {
        id: "JCH02_I2_T3",
        label: "Negative numbers (boundary)",
        mockInputs: ["-5", "8"],
        expectedOutput: "Before: a=-5 b=8\nAfter: a=8 b=-5",
        isBoundary: true,
      },
      {
        id: "JCH02_I2_T4",
        label: "Same value",
        mockInputs: ["4", "4"],
        expectedOutput: "Before: a=4 b=4\nAfter: a=4 b=4",
        isHidden: true,
      },
    ],
    concepts: ["arithmetic swap", "variable assignment", "int arithmetic"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH02_I3",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "intermediate",
    tierIndex: 2,
    title: "Currency Converter",
    emoji: "💱",
    tagline: "Convert USD to INR using a user-provided exchange rate.",
    problemStatement:
      "Read an amount in USD (double) and an exchange rate (double), then compute and print the equivalent amount in INR.\n\n" +
      "Formula: INR = USD × rate\n\n" +
      "Output:\n" +
      "`$<usd> at rate <rate> = Rs.<inr>`\n\n" +
      "All values printed with 2 decimal places.",
    inputFormat:
      "Line 1: USD amount (double).\nLine 2: exchange rate (double).",
    outputFormat:
      "`$<usd> at rate <rate> = Rs.<inr>` with all values to 2 decimal places.",
    examples: [
      {
        input: "100.0\n83.5",
        output: "$100.00 at rate 83.50 = Rs.8350.00",
        explanation: "100 × 83.5 = 8350.",
      },
      {
        input: "1.0\n83.25",
        output: "$1.00 at rate 83.25 = Rs.83.25",
        explanation: "1 USD at rate 83.25 = 83.25 INR.",
      },
    ],
    constraints: [
      "USD amount is a positive double up to 1,000,000.",
      "Exchange rate is a positive double up to 200.",
      "Print all three values with exactly 2 decimal places.",
    ],
    hints: [
      "Read USD and rate with sc.nextDouble().",
      "Compute: double inr = usd * rate;",
      "printf(\"$%.2f at rate %.2f = Rs.%.2f%n\", usd, rate, inr)",
      "No need for BigDecimal at this scale — double is sufficient.",
    ],
    referenceProgram: {
      title: "Multiplication of Two Doubles",
      description: "Reading two doubles and computing their product",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        double length = sc.nextDouble();\n` +
        `        double width = sc.nextDouble();\n` +
        `        double area = length * width;\n` +
        `        System.out.printf("Area: %.2f%n", area);\n` +
        `    }\n` +
        `}`,
      explanation:
        "Both values are read as doubles. Multiplying two doubles gives a double result.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double usd = sc.nextDouble();\n` +
      `        double rate = sc.nextDouble();\n` +
      `        // Compute INR and print\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double usd = sc.nextDouble();\n` +
      `        double rate = sc.nextDouble();\n` +
      `        double inr = usd * rate;\n` +
      `        System.out.printf("$%.2f at rate %.2f = Rs.%.2f%n", usd, rate, inr);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_I3_T1",
        label: "$100 at 83.5",
        mockInputs: ["100.0", "83.5"],
        expectedOutput: "$100.00 at rate 83.50 = Rs.8350.00",
      },
      {
        id: "JCH02_I3_T2",
        label: "$1 at 83.25",
        mockInputs: ["1.0", "83.25"],
        expectedOutput: "$1.00 at rate 83.25 = Rs.83.25",
      },
      {
        id: "JCH02_I3_T3",
        label: "Very small amount (boundary)",
        mockInputs: ["0.01", "83.0"],
        expectedOutput: "$0.01 at rate 83.00 = Rs.0.83",
        isBoundary: true,
      },
    ],
    concepts: ["double multiplication", "printf", "Scanner.nextDouble", "financial calculation"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  // ─────────────────────────── ADVANCED ─────────────────────────────────────

  {
    id: "JCH02_A1",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "advanced",
    tierIndex: 0,
    title: "BMI Calculator",
    emoji: "⚖️",
    tagline: "Compute BMI from weight and height, then classify it.",
    problemStatement:
      "Read weight in kilograms (double) and height in metres (double).\n" +
      "Compute BMI = weight / (height × height).\n\n" +
      "Print BMI with 2 decimal places and the category:\n" +
      "- BMI < 18.5: Underweight\n" +
      "- 18.5 <= BMI < 25.0: Normal\n" +
      "- 25.0 <= BMI < 30.0: Overweight\n" +
      "- BMI >= 30.0: Obese\n\n" +
      "Output:\n" +
      "```\n" +
      "BMI: <value>\n" +
      "Category: <category>\n" +
      "```",
    inputFormat:
      "Line 1: weight in kg (double).\nLine 2: height in metres (double).",
    outputFormat:
      "`BMI: <value with 2 decimals>` and `Category: <category>`.",
    examples: [
      {
        input: "70.0\n1.75",
        output: "BMI: 22.86\nCategory: Normal",
        explanation: "70 / (1.75×1.75) = 70/3.0625 ≈ 22.86.",
      },
      {
        input: "90.0\n1.70",
        output: "BMI: 31.14\nCategory: Obese",
        explanation: "90 / (1.70×1.70) = 90/2.89 ≈ 31.14.",
      },
    ],
    constraints: [
      "Weight is a positive double 1.0–500.0.",
      "Height is a positive double 0.5–3.0.",
      "BMI is printed with exactly 2 decimal places.",
    ],
    hints: [
      "double bmi = weight / (height * height);",
      "Use if-else if-else chain to determine the category.",
      "Check BMI boundaries strictly: < 18.5 is Underweight, >= 30.0 is Obese.",
      "printf(\"BMI: %.2f%n\", bmi) then println(\"Category: \" + category).",
    ],
    referenceProgram: {
      title: "If-Else Chain for Classification",
      description: "Using if-else if to classify a computed value",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        double score = 82.5;\n` +
        `        String grade;\n` +
        `        if (score >= 90) grade = "A";\n` +
        `        else if (score >= 75) grade = "B";\n` +
        `        else if (score >= 60) grade = "C";\n` +
        `        else grade = "F";\n` +
        `        System.out.println("Grade: " + grade);\n` +
        `    }\n` +
        `}`,
      explanation:
        "The if-else if chain evaluates conditions from top to bottom, selecting the first one that is true.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double weight = sc.nextDouble();\n` +
      `        double height = sc.nextDouble();\n` +
      `        // Compute BMI, determine category, print\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double weight = sc.nextDouble();\n` +
      `        double height = sc.nextDouble();\n` +
      `        double bmi = weight / (height * height);\n` +
      `        String category;\n` +
      `        if (bmi < 18.5) category = "Underweight";\n` +
      `        else if (bmi < 25.0) category = "Normal";\n` +
      `        else if (bmi < 30.0) category = "Overweight";\n` +
      `        else category = "Obese";\n` +
      `        System.out.printf("BMI: %.2f%n", bmi);\n` +
      `        System.out.println("Category: " + category);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_A1_T1",
        label: "Normal BMI",
        mockInputs: ["70.0", "1.75"],
        expectedOutput: "BMI: 22.86\nCategory: Normal",
      },
      {
        id: "JCH02_A1_T2",
        label: "Obese",
        mockInputs: ["90.0", "1.70"],
        expectedOutput: "BMI: 31.14\nCategory: Obese",
      },
      {
        id: "JCH02_A1_T3",
        label: "Underweight (boundary)",
        mockInputs: ["45.0", "1.70"],
        expectedOutput: "BMI: 15.57\nCategory: Underweight",
        isBoundary: true,
      },
      {
        id: "JCH02_A1_T4",
        label: "Exactly Normal boundary (18.5)",
        mockInputs: ["56.6", "1.75"],
        expectedOutput: "BMI: 18.50\nCategory: Normal",
        isHidden: true,
      },
    ],
    concepts: ["if-else if", "BMI formula", "double division", "classification"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH02_A2",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "advanced",
    tierIndex: 1,
    title: "Binary/Hex Display",
    emoji: "🔢",
    tagline: "Print an integer in decimal, binary, hex, and octal representations.",
    problemStatement:
      "Read an integer and print it in four number systems:\n\n" +
      "```\n" +
      "Decimal: <n>\n" +
      "Binary:  <binary>\n" +
      "Hex:     <hex>\n" +
      "Octal:   <octal>\n" +
      "```\n\n" +
      "Use `Integer.toBinaryString`, `Integer.toHexString`, `Integer.toOctalString`.",
    inputFormat: "A single non-negative integer (0–2,147,483,647).",
    outputFormat: "Four lines showing the integer in each number base.",
    examples: [
      {
        input: "255",
        output: "Decimal: 255\nBinary:  11111111\nHex:     ff\nOctal:   377",
        explanation: "255 = 0xFF = 0377 = 0b11111111.",
      },
      {
        input: "10",
        output: "Decimal: 10\nBinary:  1010\nHex:     a\nOctal:   12",
        explanation: "10 in binary is 1010; hex is a; octal is 12.",
      },
    ],
    constraints: [
      "Input is a non-negative integer up to Integer.MAX_VALUE.",
      "Hex output uses lowercase letters (as produced by Integer.toHexString).",
      "No leading zeros in any representation.",
    ],
    hints: [
      "Integer.toBinaryString(n) returns binary string without leading zeros.",
      "Integer.toHexString(n) returns lowercase hex string.",
      "Integer.toOctalString(n) returns octal string.",
      "All three methods are static — call directly: Integer.toBinaryString(n).",
    ],
    referenceProgram: {
      title: "Integer Base Conversion Methods",
      description: "Using Java's built-in Integer conversion static methods",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        int n = 42;\n` +
        `        System.out.println("bin: " + Integer.toBinaryString(n));\n` +
        `        System.out.println("hex: " + Integer.toHexString(n));\n` +
        `        System.out.println("oct: " + Integer.toOctalString(n));\n` +
        `    }\n` +
        `}`,
      explanation:
        "Java's Integer wrapper class provides static methods for converting to binary, hex, and octal strings.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        // Print decimal, binary, hex, octal\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        System.out.println("Decimal: " + n);\n` +
      `        System.out.println("Binary:  " + Integer.toBinaryString(n));\n` +
      `        System.out.println("Hex:     " + Integer.toHexString(n));\n` +
      `        System.out.println("Octal:   " + Integer.toOctalString(n));\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_A2_T1",
        label: "255",
        mockInputs: ["255"],
        expectedOutput: "Decimal: 255\nBinary:  11111111\nHex:     ff\nOctal:   377",
      },
      {
        id: "JCH02_A2_T2",
        label: "10",
        mockInputs: ["10"],
        expectedOutput: "Decimal: 10\nBinary:  1010\nHex:     a\nOctal:   12",
      },
      {
        id: "JCH02_A2_T3",
        label: "Zero (boundary)",
        mockInputs: ["0"],
        expectedOutput: "Decimal: 0\nBinary:  0\nHex:     0\nOctal:   0",
        isBoundary: true,
      },
    ],
    concepts: ["Integer.toBinaryString", "Integer.toHexString", "Integer.toOctalString", "base conversion"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH02_A3",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "advanced",
    tierIndex: 2,
    title: "Overflow Explorer",
    emoji: "💥",
    tagline: "Demonstrate integer overflow by adding 1 to Integer.MAX_VALUE.",
    problemStatement:
      "Read an integer close to Integer.MAX_VALUE (2,147,483,647).\n" +
      "Add 1 to it and print both the original and the result.\n\n" +
      "The result will overflow to a negative number — this is expected!\n\n" +
      "Output:\n" +
      "```\n" +
      "Original: <value>\n" +
      "After +1: <value+1>\n" +
      "Overflowed: <true|false>\n" +
      "```\n\n" +
      "Print `Overflowed: true` if `value + 1 < value` (the overflow condition).",
    inputFormat: "A single integer.",
    outputFormat: "Three lines as described.",
    examples: [
      {
        input: "2147483647",
        output: "Original: 2147483647\nAfter +1: -2147483648\nOverflowed: true",
        explanation:
          "Integer.MAX_VALUE + 1 wraps around to Integer.MIN_VALUE (-2147483648).",
      },
      {
        input: "100",
        output: "Original: 100\nAfter +1: 101\nOverflowed: false",
        explanation: "Adding 1 to 100 does not overflow.",
      },
    ],
    constraints: [
      "Input is any valid int.",
      "Overflow detection: result < original.",
      "Do not use long for the addition — keep it as int to see the overflow.",
    ],
    hints: [
      "Declare both original and result as int: int original = n; int result = original + 1;",
      "Overflow check: boolean overflowed = result < original;",
      "Integer.MAX_VALUE is 2,147,483,647 — one more wraps to -2,147,483,648.",
      "This is two's complement overflow — a fundamental concept in computer science.",
    ],
    referenceProgram: {
      title: "Observing Integer Overflow",
      description: "Demonstrating that int arithmetic wraps around silently in Java",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        int max = Integer.MAX_VALUE;\n` +
        `        int next = max + 1;\n` +
        `        System.out.println("MAX: " + max);\n` +
        `        System.out.println("MAX+1: " + next); // prints negative!\n` +
        `    }\n` +
        `}`,
      explanation:
        "Java int is 32-bit two's complement. Adding 1 to the maximum positive value wraps to the most negative value.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int original = sc.nextInt();\n` +
      `        // Add 1, detect overflow, print results\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int original = sc.nextInt();\n` +
      `        int result = original + 1;\n` +
      `        boolean overflowed = result < original;\n` +
      `        System.out.println("Original: " + original);\n` +
      `        System.out.println("After +1: " + result);\n` +
      `        System.out.println("Overflowed: " + overflowed);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_A3_T1",
        label: "Integer.MAX_VALUE overflow",
        mockInputs: ["2147483647"],
        expectedOutput: "Original: 2147483647\nAfter +1: -2147483648\nOverflowed: true",
      },
      {
        id: "JCH02_A3_T2",
        label: "Normal addition",
        mockInputs: ["100"],
        expectedOutput: "Original: 100\nAfter +1: 101\nOverflowed: false",
      },
      {
        id: "JCH02_A3_T3",
        label: "Near max (boundary)",
        mockInputs: ["2147483646"],
        expectedOutput: "Original: 2147483646\nAfter +1: 2147483647\nOverflowed: false",
        isBoundary: true,
      },
    ],
    concepts: ["int overflow", "Integer.MAX_VALUE", "two's complement", "boolean expression"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  // ─────────────────────────── LEETCODE ─────────────────────────────────────

  {
    id: "JCH02_L1",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "leetcode",
    tierIndex: 0,
    title: "Safe Integer Arithmetic",
    emoji: "🛡️",
    tagline: "Perform arithmetic on longs and catch overflow using Math.addExact.",
    problemStatement:
      "Read two long integers and perform addition, subtraction, multiplication, and division.\n" +
      "For addition and multiplication, use `Math.addExact` and `Math.multiplyExact` which throw `ArithmeticException` on overflow.\n" +
      "For division, catch division by zero.\n\n" +
      "For each operation, print the result or `OVERFLOW` / `DIV_BY_ZERO` on error.\n\n" +
      "Output format:\n" +
      "```\n" +
      "add: <result or OVERFLOW>\n" +
      "sub: <result>\n" +
      "mul: <result or OVERFLOW>\n" +
      "div: <result or DIV_BY_ZERO>\n" +
      "```\n" +
      "Division result is the integer quotient (long division).",
    inputFormat:
      "Line 1: first long.\nLine 2: second long.",
    outputFormat: "Four lines for add, sub, mul, div.",
    examples: [
      {
        input: "9223372036854775807\n1",
        output: "add: OVERFLOW\nsub: 9223372036854775806\nmul: OVERFLOW\ndiv: 9223372036854775807",
        explanation:
          "Long.MAX_VALUE + 1 overflows. Subtraction 1 is fine. MAX_VALUE * 1 = MAX_VALUE (no overflow). MAX_VALUE / 1 = MAX_VALUE.",
      },
      {
        input: "10\n0",
        output: "add: 10\nsub: 10\nmul: 0\ndiv: DIV_BY_ZERO",
        explanation: "Division by zero is caught; multiply 10*0=0 is fine.",
      },
    ],
    constraints: [
      "Inputs are valid long values.",
      "Use Math.addExact and Math.multiplyExact for overflow detection.",
      "Subtraction never overflows for valid longs in this problem.",
      "Division result is integer (quotient only).",
    ],
    hints: [
      "Wrap Math.addExact(a, b) in try { ... } catch (ArithmeticException e) { ... }",
      "Subtraction: just use a - b; for longs within range it won't overflow.",
      "Math.multiplyExact(a, b) throws ArithmeticException on overflow.",
      "Division: catch ArithmeticException when b == 0 or use if (b == 0).",
    ],
    referenceProgram: {
      title: "try-catch with Math.addExact",
      description: "Detecting overflow using Math.addExact and ArithmeticException",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        long a = Long.MAX_VALUE;\n` +
        `        long b = 1;\n` +
        `        try {\n` +
        `            long sum = Math.addExact(a, b);\n` +
        `            System.out.println("sum: " + sum);\n` +
        `        } catch (ArithmeticException e) {\n` +
        `            System.out.println("sum: OVERFLOW");\n` +
        `        }\n` +
        `    }\n` +
        `}`,
      explanation:
        "Math.addExact is identical to + but throws ArithmeticException instead of silently wrapping on overflow.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        long a = sc.nextLong();\n` +
      `        long b = sc.nextLong();\n` +
      `        // Perform safe add, sub, mul, div and print results\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        long a = sc.nextLong();\n` +
      `        long b = sc.nextLong();\n` +
      `\n` +
      `        // Addition\n` +
      `        try {\n` +
      `            System.out.println("add: " + Math.addExact(a, b));\n` +
      `        } catch (ArithmeticException e) {\n` +
      `            System.out.println("add: OVERFLOW");\n` +
      `        }\n` +
      `\n` +
      `        // Subtraction\n` +
      `        System.out.println("sub: " + (a - b));\n` +
      `\n` +
      `        // Multiplication\n` +
      `        try {\n` +
      `            System.out.println("mul: " + Math.multiplyExact(a, b));\n` +
      `        } catch (ArithmeticException e) {\n` +
      `            System.out.println("mul: OVERFLOW");\n` +
      `        }\n` +
      `\n` +
      `        // Division\n` +
      `        if (b == 0) {\n` +
      `            System.out.println("div: DIV_BY_ZERO");\n` +
      `        } else {\n` +
      `            System.out.println("div: " + (a / b));\n` +
      `        }\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_L1_T1",
        label: "Long.MAX_VALUE + 1 overflow",
        mockInputs: ["9223372036854775807", "1"],
        expectedOutput: "add: OVERFLOW\nsub: 9223372036854775806\nmul: OVERFLOW\ndiv: 9223372036854775807",
      },
      {
        id: "JCH02_L1_T2",
        label: "Division by zero",
        mockInputs: ["10", "0"],
        expectedOutput: "add: 10\nsub: 10\nmul: 0\ndiv: DIV_BY_ZERO",
      },
      {
        id: "JCH02_L1_T3",
        label: "Normal values (boundary)",
        mockInputs: ["100", "25"],
        expectedOutput: "add: 125\nsub: 75\nmul: 2500\ndiv: 4",
        isBoundary: true,
      },
    ],
    concepts: ["Math.addExact", "Math.multiplyExact", "ArithmeticException", "try-catch", "long"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(1)",
  },

  {
    id: "JCH02_L2",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "leetcode",
    tierIndex: 1,
    title: "Precision Money",
    emoji: "💰",
    tagline: "Use BigDecimal to avoid floating-point rounding errors in money calculations.",
    problemStatement:
      "Read a unit price and quantity as strings (to avoid double imprecision), use `BigDecimal` to compute the total, and print it formatted to 2 decimal places.\n\n" +
      "Also print the raw double computation to show the precision difference.\n\n" +
      "Output:\n" +
      "```\n" +
      "BigDecimal total: <total>\n" +
      "double total:     <double_total>\n" +
      "```",
    inputFormat:
      "Line 1: price as a decimal string (e.g. \"0.1\").\nLine 2: quantity as an integer string.",
    outputFormat:
      "Two lines showing BigDecimal and double totals.",
    examples: [
      {
        input: "0.1\n3",
        output: "BigDecimal total: 0.30\ndouble total:     0.30000000000000004",
        explanation:
          "0.1 + 0.1 + 0.1 in IEEE-754 double = 0.30000000000000004; BigDecimal gives exact 0.30.",
      },
      {
        input: "1.005\n2",
        output: "BigDecimal total: 2.01\ndouble total:     2.01",
        explanation: "Both match here; imprecision varies by value.",
      },
    ],
    constraints: [
      "Price is a decimal string with up to 10 decimal places.",
      "Quantity is a positive integer 1–10000.",
      "BigDecimal total is printed with 2 decimal places using setScale(2, RoundingMode.HALF_UP).",
      "Double total is printed using String.valueOf() to show all significant digits.",
    ],
    hints: [
      "import java.math.BigDecimal; import java.math.RoundingMode;",
      "BigDecimal price = new BigDecimal(priceStr); — use the String constructor for exact representation.",
      "BigDecimal qty = new BigDecimal(qtyStr);",
      "BigDecimal total = price.multiply(qty).setScale(2, RoundingMode.HALF_UP);",
      "double total = Double.parseDouble(priceStr) * Integer.parseInt(qtyStr);",
    ],
    referenceProgram: {
      title: "BigDecimal vs double Precision",
      description: "Creating a BigDecimal from String to preserve decimal precision",
      code:
        `import java.math.BigDecimal;\n` +
        `import java.math.RoundingMode;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        BigDecimal a = new BigDecimal("0.1");\n` +
        `        BigDecimal b = new BigDecimal("0.2");\n` +
        `        BigDecimal sum = a.add(b).setScale(2, RoundingMode.HALF_UP);\n` +
        `        System.out.println("BigDecimal: " + sum);         // 0.30\n` +
        `        System.out.println("double: " + (0.1 + 0.2));    // 0.30000000000000004\n` +
        `    }\n` +
        `}`,
      explanation:
        "new BigDecimal(\"0.1\") stores exactly 0.1. new BigDecimal(0.1) would store the imprecise double. Always use the String constructor for money.",
    },
    starterCode:
      `import java.math.BigDecimal;\n` +
      `import java.math.RoundingMode;\n` +
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String priceStr = sc.nextLine().trim();\n` +
      `        String qtyStr   = sc.nextLine().trim();\n` +
      `        // Compute with BigDecimal and with double, print both\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.math.BigDecimal;\n` +
      `import java.math.RoundingMode;\n` +
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String priceStr = sc.nextLine().trim();\n` +
      `        String qtyStr   = sc.nextLine().trim();\n` +
      `\n` +
      `        BigDecimal bdPrice = new BigDecimal(priceStr);\n` +
      `        BigDecimal bdQty   = new BigDecimal(qtyStr);\n` +
      `        BigDecimal bdTotal = bdPrice.multiply(bdQty).setScale(2, RoundingMode.HALF_UP);\n` +
      `\n` +
      `        double dPrice = Double.parseDouble(priceStr);\n` +
      `        int qty = Integer.parseInt(qtyStr);\n` +
      `        double dTotal = dPrice * qty;\n` +
      `\n` +
      `        System.out.println("BigDecimal total: " + bdTotal);\n` +
      `        System.out.println("double total:     " + dTotal);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_L2_T1",
        label: "0.1 x 3 classic imprecision",
        mockInputs: ["0.1", "3"],
        expectedOutput: "BigDecimal total: 0.30\ndouble total:     0.30000000000000004",
      },
      {
        id: "JCH02_L2_T2",
        label: "1.005 x 2",
        mockInputs: ["1.005", "2"],
        expectedOutput: "BigDecimal total: 2.01\ndouble total:     2.01",
      },
      {
        id: "JCH02_L2_T3",
        label: "Quantity 1 (boundary)",
        mockInputs: ["9.99", "1"],
        expectedOutput: "BigDecimal total: 9.99\ndouble total:     9.99",
        isBoundary: true,
      },
    ],
    concepts: ["BigDecimal", "RoundingMode", "precision", "String constructor", "double imprecision"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(1)",
  },

  {
    id: "JCH02_L3",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "leetcode",
    tierIndex: 2,
    title: "Type Casting Chain",
    emoji: "⛓️",
    tagline: "Watch data truncate and wrap as a double is cast step-by-step down to byte and char.",
    problemStatement:
      "Read a double value and trace the following casting chain, printing each step:\n\n" +
      "1. Original double\n" +
      "2. Cast to int — truncates decimal part\n" +
      "3. Cast to byte — wraps at ±127\n" +
      "4. Cast to char — reinterprets byte as Unicode char\n\n" +
      "Output format:\n" +
      "```\n" +
      "double: <value>\n" +
      "int:    <value>\n" +
      "byte:   <value>\n" +
      "char:   <character>\n" +
      "```",
    inputFormat: "A single double value.",
    outputFormat: "Four lines as shown.",
    examples: [
      {
        input: "65.9",
        output: "double: 65.9\nint:    65\nbyte:   65\nchar:   A",
        explanation:
          "(int)65.9 = 65; (byte)65 = 65; (char)65 = 'A'.",
      },
      {
        input: "300.7",
        output: "double: 300.7\nint:    300\nbyte:   44\nchar:   ,",
        explanation:
          "(int)300.7 = 300; (byte)300 = 300 - 256 = 44; (char)44 = ','.",
      },
    ],
    constraints: [
      "Input double is between -500.0 and 500.0.",
      "byte range is -128 to 127; values outside wrap via two's complement.",
      "char cast uses the int value mod 65536.",
    ],
    hints: [
      "int i = (int) d;   // truncates decimal toward zero",
      "byte b = (byte) i; // wraps: 300 → 44 because (300 % 256 = 44)",
      "char c = (char) b; // reinterprets as Unicode code point",
      "Note: (char) of a negative byte may print a special Unicode character.",
    ],
    referenceProgram: {
      title: "Narrowing Primitive Cast Chain",
      description: "Each cast loses information — this is narrowing conversion",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        double d = 130.5;\n` +
        `        int i = (int) d;     // 130\n` +
        `        byte b = (byte) i;   // 130 - 128 = 2 ... actually -126 (signed)\n` +
        `        char c = (char) b;   // cast signed byte to char\n` +
        `        System.out.println("double: " + d);\n` +
        `        System.out.println("int: " + i);\n` +
        `        System.out.println("byte: " + b);\n` +
        `        System.out.println("char: " + c);\n` +
        `    }\n` +
        `}`,
      explanation:
        "Each narrowing cast may lose data. double→int truncates. int→byte wraps. byte→char reinterprets the bit pattern as an unsigned 16-bit Unicode code point.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double d = sc.nextDouble();\n` +
      `        // Cast chain: double → int → byte → char, print each step\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double d = sc.nextDouble();\n` +
      `        int i = (int) d;\n` +
      `        byte b = (byte) i;\n` +
      `        char c = (char) b;\n` +
      `        System.out.println("double: " + d);\n` +
      `        System.out.println("int:    " + i);\n` +
      `        System.out.println("byte:   " + b);\n` +
      `        System.out.println("char:   " + c);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_L3_T1",
        label: "65.9 → A",
        mockInputs: ["65.9"],
        expectedOutput: "double: 65.9\nint:    65\nbyte:   65\nchar:   A",
      },
      {
        id: "JCH02_L3_T2",
        label: "300.7 wraps to byte 44",
        mockInputs: ["300.7"],
        expectedOutput: "double: 300.7\nint:    300\nbyte:   44\nchar:   ,",
      },
      {
        id: "JCH02_L3_T3",
        label: "Zero (boundary)",
        mockInputs: ["0.0"],
        expectedOutput: "double: 0.0\nint:    0\nbyte:   0\nchar:    ",
        isBoundary: true,
      },
    ],
    concepts: ["narrowing cast", "(int)", "(byte)", "(char)", "data truncation", "two's complement wrap"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(1)",
  },

  // ─────────────────────────── HACKATHON ────────────────────────────────────

  {
    id: "JCH02_H1",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "hackathon",
    tierIndex: 0,
    title: "Unit Conversion Hub",
    emoji: "📏",
    tagline: "Convert a value from one unit to all related units in a category.",
    problemStatement:
      "Read a numeric value and a source unit. Convert to all units in the same category.\n\n" +
      "Support the **length** category: km, m, cm, mm, miles, feet, inches.\n\n" +
      "Base unit: metres.\n" +
      "Conversion factors to metres: km=1000, m=1, cm=0.01, mm=0.001, miles=1609.344, feet=0.3048, inches=0.0254\n\n" +
      "Print all other units with 4 decimal places:\n" +
      "```\n" +
      "Converting 1.0 km:\n" +
      "  m      : 1000.0000\n" +
      "  cm     : 100000.0000\n" +
      "  mm     : 1000000.0000\n" +
      "  miles  : 0.6214\n" +
      "  feet   : 3280.8399\n" +
      "  inches : 39370.0787\n" +
      "```",
    inputFormat:
      "Line 1: numeric value (double).\nLine 2: source unit (one of: km, m, cm, mm, miles, feet, inches).",
    outputFormat:
      "A header line then one line per other unit, formatted to 4 decimal places.",
    examples: [
      {
        input: "1.0\nkm",
        output:
          "Converting 1.0 km:\n" +
          "  m      : 1000.0000\n" +
          "  cm     : 100000.0000\n" +
          "  mm     : 1000000.0000\n" +
          "  miles  : 0.6214\n" +
          "  feet   : 3280.8399\n" +
          "  inches : 39370.0787",
        explanation:
          "1 km = 1000 m; convert to metres first, then to each target unit by dividing by its factor.",
      },
      {
        input: "1.0\nm",
        output:
          "Converting 1.0 m:\n" +
          "  km     : 0.0010\n" +
          "  cm     : 100.0000\n" +
          "  mm     : 1000.0000\n" +
          "  miles  : 0.0006\n" +
          "  feet   : 3.2808\n" +
          "  inches : 39.3701",
        explanation: "1 m to all other length units.",
      },
    ],
    constraints: [
      "Source unit is always valid (one of the 7 listed).",
      "Value is a positive double.",
      "Skip printing the source unit itself.",
      "All output values printed with 4 decimal places.",
    ],
    hints: [
      "Store unit names and factors in two parallel arrays.",
      "First convert to base (metres): double baseValue = value * factorOf(sourceUnit);",
      "Then for each other unit: double converted = baseValue / factorOf(targetUnit);",
      "Use printf(\"  %-7s: %.4f%n\", unitName, converted) for alignment.",
    ],
    referenceProgram: {
      title: "Parallel Arrays for Units",
      description: "Using two arrays (names + factors) for unit conversion",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        String[] units  = {"km", "m", "cm"};\n` +
        `        double[] factors = {1000.0, 1.0, 0.01};\n` +
        `        double valueInM = 5.0 * 1000.0; // 5 km to metres\n` +
        `        for (int i = 0; i < units.length; i++) {\n` +
        `            System.out.printf("  %-4s: %.4f%n", units[i], valueInM / factors[i]);\n` +
        `        }\n` +
        `    }\n` +
        `}`,
      explanation:
        "Converting to a common base unit first makes all conversions a simple division.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `\n` +
      `    static final String[] UNITS   = {"km", "m", "cm", "mm", "miles", "feet", "inches"};\n` +
      `    static final double[] FACTORS = {1000.0, 1.0, 0.01, 0.001, 1609.344, 0.3048, 0.0254};\n` +
      `\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double value = sc.nextDouble();\n` +
      `        sc.nextLine();\n` +
      `        String sourceUnit = sc.nextLine().trim();\n` +
      `        // Convert to metres, then to all other units\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `\n` +
      `    static final String[] UNITS   = {"km", "m", "cm", "mm", "miles", "feet", "inches"};\n` +
      `    static final double[] FACTORS = {1000.0, 1.0, 0.01, 0.001, 1609.344, 0.3048, 0.0254};\n` +
      `\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        double value = sc.nextDouble();\n` +
      `        sc.nextLine();\n` +
      `        String sourceUnit = sc.nextLine().trim();\n` +
      `\n` +
      `        double sourceFactor = 1.0;\n` +
      `        for (int i = 0; i < UNITS.length; i++) {\n` +
      `            if (UNITS[i].equals(sourceUnit)) { sourceFactor = FACTORS[i]; break; }\n` +
      `        }\n` +
      `        double baseValue = value * sourceFactor;\n` +
      `\n` +
      `        System.out.println("Converting " + value + " " + sourceUnit + ":");\n` +
      `        for (int i = 0; i < UNITS.length; i++) {\n` +
      `            if (!UNITS[i].equals(sourceUnit)) {\n` +
      `                System.out.printf("  %-7s: %.4f%n", UNITS[i], baseValue / FACTORS[i]);\n` +
      `            }\n` +
      `        }\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_H1_T1",
        label: "1 km to all",
        mockInputs: ["1.0", "km"],
        expectedOutput:
          "Converting 1.0 km:\n" +
          "  m      : 1000.0000\n" +
          "  cm     : 100000.0000\n" +
          "  mm     : 1000000.0000\n" +
          "  miles  : 0.6214\n" +
          "  feet   : 3280.8399\n" +
          "  inches : 39370.0787",
      },
      {
        id: "JCH02_H1_T2",
        label: "1 m to all",
        mockInputs: ["1.0", "m"],
        expectedOutput:
          "Converting 1.0 m:\n" +
          "  km     : 0.0010\n" +
          "  cm     : 100.0000\n" +
          "  mm     : 1000.0000\n" +
          "  miles  : 0.0006\n" +
          "  feet   : 3.2808\n" +
          "  inches : 39.3701",
      },
      {
        id: "JCH02_H1_T3",
        label: "1 inch to all (boundary)",
        mockInputs: ["1.0", "inches"],
        expectedOutput:
          "Converting 1.0 inches:\n" +
          "  km     : 0.0000\n" +
          "  m      : 0.0254\n" +
          "  cm     : 2.5400\n" +
          "  mm     : 25.4000\n" +
          "  miles  : 0.0000\n" +
          "  feet   : 0.0833",
        isBoundary: true,
      },
    ],
    concepts: ["parallel arrays", "final constants", "base unit conversion", "loops", "printf"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend to support multiple categories (length, weight, temperature) and auto-detect the category from the unit name.",
  },

  {
    id: "JCH02_H2",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "hackathon",
    tierIndex: 1,
    title: "Data Type Benchmark",
    emoji: "⏱️",
    tagline: "Benchmark primitive int vs Integer wrapper in a loop and print timing results.",
    problemStatement:
      "Read N (an integer, 1,000,000 to 10,000,000) and perform N iterations of a simple addition.\n\n" +
      "Run the loop twice:\n" +
      "1. Using primitive `int`\n" +
      "2. Using `Integer` wrapper (causes autoboxing/unboxing)\n\n" +
      "Print the elapsed time in milliseconds for each:\n" +
      "```\n" +
      "N: <N>\n" +
      "int time:     <ms> ms\n" +
      "Integer time: <ms> ms\n" +
      "Winner: int\n" +
      "```\n" +
      "Print `Winner: int` if int was faster, else `Winner: Integer` (or `Winner: tie` if equal).",
    inputFormat: "A single integer N (1,000,000 to 10,000,000).",
    outputFormat: "Four lines as shown.",
    examples: [
      {
        input: "1000000",
        output: "N: 1000000\nint time:     2 ms\nInteger time: 15 ms\nWinner: int",
        explanation:
          "Actual times vary by machine; int is almost always faster due to no autoboxing overhead.",
      },
    ],
    constraints: [
      "1,000,000 <= N <= 10,000,000.",
      "Use System.currentTimeMillis() for timing.",
      "Perform the same computation in both loops: sum += i (prevents JIT elimination).",
      "Print times as longs.",
    ],
    hints: [
      "long startTime = System.currentTimeMillis(); ... long elapsed = System.currentTimeMillis() - startTime;",
      "For Integer loop: Integer sum = 0; for (int i=0; i<n; i++) sum += i; — this triggers autoboxing.",
      "Consume sum in a print or condition to prevent dead-code elimination by JIT.",
      "Results may vary by run — the benchmark shows the concept, not an exact number.",
    ],
    referenceProgram: {
      title: "Timing a Loop with currentTimeMillis",
      description: "Measuring elapsed time of a loop using System.currentTimeMillis",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        int n = 1_000_000;\n` +
        `        long start = System.currentTimeMillis();\n` +
        `        long sum = 0;\n` +
        `        for (int i = 0; i < n; i++) sum += i;\n` +
        `        long elapsed = System.currentTimeMillis() - start;\n` +
        `        System.out.println("time: " + elapsed + " ms (sum=" + sum + ")");\n` +
        `    }\n` +
        `}`,
      explanation:
        "Recording start time before the loop and subtracting after gives elapsed milliseconds. Printing the sum prevents the JIT from optimising the loop away.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        // Benchmark int loop vs Integer loop, print results\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `\n` +
      `        // Primitive int benchmark\n` +
      `        long start1 = System.currentTimeMillis();\n` +
      `        long sumInt = 0;\n` +
      `        for (int i = 0; i < n; i++) sumInt += i;\n` +
      `        long intTime = System.currentTimeMillis() - start1;\n` +
      `\n` +
      `        // Integer wrapper benchmark\n` +
      `        long start2 = System.currentTimeMillis();\n` +
      `        Integer sumWrapper = 0;\n` +
      `        for (int i = 0; i < n; i++) sumWrapper += i;\n` +
      `        long wrapperTime = System.currentTimeMillis() - start2;\n` +
      `\n` +
      `        System.out.println("N: " + n);\n` +
      `        System.out.println("int time:     " + intTime + " ms");\n` +
      `        System.out.println("Integer time: " + wrapperTime + " ms");\n` +
      `        String winner;\n` +
      `        if (intTime < wrapperTime) winner = "int";\n` +
      `        else if (wrapperTime < intTime) winner = "Integer";\n` +
      `        else winner = "tie";\n` +
      `        System.out.println("Winner: " + winner);\n` +
      `        // Reference sums to prevent JIT elimination\n` +
      `        if (sumInt != sumWrapper) System.out.println("mismatch"); // never prints\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_H2_T1",
        label: "N=1000000 (output varies by machine)",
        mockInputs: ["1000000"],
        expectedOutput: "N: 1000000\nint time:     2 ms\nInteger time: 15 ms\nWinner: int",
      },
      {
        id: "JCH02_H2_T2",
        label: "N=10000000",
        mockInputs: ["10000000"],
        expectedOutput: "N: 10000000\nint time:     5 ms\nInteger time: 80 ms\nWinner: int",
        isBoundary: true,
      },
    ],
    concepts: ["System.currentTimeMillis", "autoboxing", "Integer wrapper", "benchmarking", "JIT"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend the benchmark to also test long vs Long and double vs Double, and print a comparison table.",
  },

  {
    id: "JCH02_H3",
    chapterId: "JCH02_VARS",
    chapterNumber: 2,
    tier: "hackathon",
    tierIndex: 2,
    title: "Scientific Calculator State",
    emoji: "🔬",
    tagline: "Simulate a stateful calculator with memory register using typed variables.",
    problemStatement:
      "Simulate a simple scientific calculator with a memory register.\n\n" +
      "State variables:\n" +
      "- `double memory` — the memory register (starts at 0.0)\n" +
      "- `double display` — the current displayed value (starts at 0.0)\n" +
      "- `char lastOp` — last operation character (starts at ' ')\n\n" +
      "Read N commands, each on its own line. Supported commands:\n" +
      "- `SET <value>` — set display to value\n" +
      "- `M+` — add display to memory\n" +
      "- `M-` — subtract display from memory\n" +
      "- `MR` — set display to memory value\n" +
      "- `MC` — clear memory to 0\n" +
      "- `OP <char>` — record the operator char\n" +
      "- `SHOW` — print `display=<val> memory=<val> lastOp=<char>` (all doubles to 2 dp)\n\n" +
      "After all commands, print the final SHOW state.",
    inputFormat:
      "Line 1: integer N.\nNext N lines: commands as described.",
    outputFormat:
      "One `display=<val> memory=<val> lastOp=<char>` line per SHOW, plus one at end.",
    examples: [
      {
        input: "6\nSET 42.5\nM+\nSET 10.0\nM+\nSHOW\nMR",
        output: "display=10.00 memory=52.50 lastOp= \ndisplay=52.50 memory=52.50 lastOp= ",
        explanation:
          "SET 42.5, M+ → memory=42.5. SET 10.0, M+ → memory=52.5. SHOW: display=10.0, memory=52.5. MR: display=52.5. Final: display=52.5.",
      },
    ],
    constraints: [
      "1 <= N <= 50.",
      "SET value is a valid double.",
      "OP char is a single non-space character.",
      "Display and memory values printed with 2 decimal places.",
    ],
    hints: [
      "Parse each command by splitting on space: String[] parts = line.split(\" \", 2);",
      "Use a switch or if-else on parts[0] to dispatch to the right action.",
      "MC: memory = 0.0; MR: display = memory; M+: memory += display; M-: memory -= display;",
      "printf(\"display=%.2f memory=%.2f lastOp=%c%n\", display, memory, lastOp) for SHOW.",
    ],
    referenceProgram: {
      title: "Command Dispatcher Pattern",
      description: "Parsing and dispatching string commands to update state variables",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        int n = sc.nextInt(); sc.nextLine();\n` +
        `        double value = 0;\n` +
        `        for (int i = 0; i < n; i++) {\n` +
        `            String line = sc.nextLine().trim();\n` +
        `            if (line.startsWith("SET ")) value = Double.parseDouble(line.substring(4));\n` +
        `            else if (line.equals("SHOW")) System.out.printf("val=%.2f%n", value);\n` +
        `        }\n` +
        `    }\n` +
        `}`,
      explanation:
        "Dispatching on the command prefix keeps the logic clean. State lives in typed variables that persist across the loop.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = Integer.parseInt(sc.nextLine().trim());\n` +
      `        double display = 0.0;\n` +
      `        double memory  = 0.0;\n` +
      `        char lastOp    = ' ';\n` +
      `        // Process n commands\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = Integer.parseInt(sc.nextLine().trim());\n` +
      `        double display = 0.0;\n` +
      `        double memory  = 0.0;\n` +
      `        char lastOp    = ' ';\n` +
      `\n` +
      `        for (int i = 0; i < n; i++) {\n` +
      `            String line = sc.nextLine().trim();\n` +
      `            if (line.startsWith("SET ")) {\n` +
      `                display = Double.parseDouble(line.substring(4).trim());\n` +
      `            } else if (line.equals("M+")) {\n` +
      `                memory += display;\n` +
      `            } else if (line.equals("M-")) {\n` +
      `                memory -= display;\n` +
      `            } else if (line.equals("MR")) {\n` +
      `                display = memory;\n` +
      `            } else if (line.equals("MC")) {\n` +
      `                memory = 0.0;\n` +
      `            } else if (line.startsWith("OP ")) {\n` +
      `                lastOp = line.charAt(3);\n` +
      `            } else if (line.equals("SHOW")) {\n` +
      `                System.out.printf("display=%.2f memory=%.2f lastOp=%c%n", display, memory, lastOp);\n` +
      `            }\n` +
      `        }\n` +
      `        System.out.printf("display=%.2f memory=%.2f lastOp=%c%n", display, memory, lastOp);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH02_H3_T1",
        label: "M+ sequence with SHOW",
        mockInputs: ["6", "SET 42.5", "M+", "SET 10.0", "M+", "SHOW", "MR"],
        expectedOutput: "display=10.00 memory=52.50 lastOp= \ndisplay=52.50 memory=52.50 lastOp= ",
      },
      {
        id: "JCH02_H3_T2",
        label: "MC clears memory (boundary)",
        mockInputs: ["4", "SET 100.0", "M+", "MC", "SHOW"],
        expectedOutput: "display=100.00 memory=0.00 lastOp= \ndisplay=100.00 memory=0.00 lastOp= ",
        isBoundary: true,
      },
      {
        id: "JCH02_H3_T3",
        label: "OP tracking",
        mockInputs: ["3", "SET 5.0", "OP +", "SHOW"],
        expectedOutput: "display=5.00 memory=0.00 lastOp=+\ndisplay=5.00 memory=0.00 lastOp=+",
        isHidden: true,
      },
    ],
    concepts: ["state variables", "command parsing", "double", "char", "startsWith", "dispatch"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend with CALC command that applies lastOp to memory and display (e.g. if lastOp='+', display = memory + display), then update display and clear lastOp.",
  },
];
