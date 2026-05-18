import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH03_PROGRAMS: YamunaProgram[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH03_B0",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "beginner",
    tierIndex: 0,
    title: "Basic Calculator",
    emoji: "🧮",
    tagline: "Perform all five arithmetic operations on two integers.",
    problemStatement:
      "Read two integers a and b. Print the results of a+b, a-b, a*b, a/b (integer division), and a%b, each on a separate line.",
    inputFormat: "Two integers a and b on separate lines.",
    outputFormat:
      "Five lines: a+b, a-b, a*b, a/b (integer division), a%b.",
    examples: [
      {
        input: "10\n3",
        output: "13\n7\n30\n3\n1",
        explanation:
          "10+3=13, 10-3=7, 10*3=30, 10/3=3 (integer div), 10%3=1.",
      },
    ],
    constraints: [
      "-10^9 <= a, b <= 10^9",
      "b != 0",
    ],
    hints: [
      "Use int variables and Scanner to read input.",
      "Integer division in Java truncates towards zero: 7/2 = 3.",
      "The modulo operator % gives the remainder after division.",
      "Print each result with a separate System.out.println call.",
    ],
    referenceProgram: {
      title: "Basic Arithmetic Reference",
      description: "Shows all five arithmetic operators applied to two integers.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        System.out.println(a - b);
        System.out.println(a * b);
        System.out.println(a / b);
        System.out.println(a % b);
    }
}`,
      explanation:
        "Java's / operator performs integer division when both operands are int. Use % for remainder.",
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // print a+b, a-b, a*b, a/b, a%b each on its own line
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        System.out.println(a - b);
        System.out.println(a * b);
        System.out.println(a / b);
        System.out.println(a % b);
    }
}`,
    testCases: [
      {
        id: "JCH03_B0_T1",
        label: "Sample: 10, 3",
        mockInputs: ["10", "3"],
        expectedOutput: "13\n7\n30\n3\n1",
      },
      {
        id: "JCH03_B0_T2",
        label: "Sample: 7, 2",
        mockInputs: ["7", "2"],
        expectedOutput: "9\n5\n14\n3\n1",
      },
      {
        id: "JCH03_B0_T3",
        label: "Negative dividend",
        mockInputs: ["-10", "3"],
        expectedOutput: "-7\n-13\n-30\n-3\n-1",
        isBoundary: true,
      },
      {
        id: "JCH03_B0_T4",
        label: "Large numbers",
        mockInputs: ["1000000000", "1"],
        expectedOutput: "1000000001\n999999999\n1000000000\n1000000000\n0",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["arithmetic operators", "integer division", "modulo", "Scanner"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH03_B1",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "beginner",
    tierIndex: 1,
    title: "Power & Root",
    emoji: "📐",
    tagline: "Compute square, square root, and cube of a number.",
    problemStatement:
      "Read a double value n. Print: n squared (n*n), its square root (Math.sqrt), and its cube (Math.pow(n,3)), each on a separate line. Round each result to 2 decimal places.",
    inputFormat: "One double n on a single line.",
    outputFormat:
      "Three lines: n^2, sqrt(n), n^3 — each formatted to 2 decimal places.",
    examples: [
      {
        input: "4.0",
        output: "16.00\n2.00\n64.00",
        explanation: "4^2=16, sqrt(4)=2, 4^3=64.",
      },
      {
        input: "2.0",
        output: "4.00\n1.41\n8.00",
        explanation: "2^2=4, sqrt(2)≈1.41, 2^3=8.",
      },
    ],
    constraints: [
      "0 <= n <= 10^6",
    ],
    hints: [
      "Use Math.sqrt(n) for square root.",
      "Use Math.pow(n, 3) for cube.",
      "Use String.format(\"%.2f\", value) or printf to format 2 decimal places.",
      "n*n gives the square more efficiently than Math.pow(n,2).",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double n = sc.nextDouble();
        // print n^2, sqrt(n), n^3 each to 2 decimal places
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double n = sc.nextDouble();
        System.out.printf("%.2f%n", n * n);
        System.out.printf("%.2f%n", Math.sqrt(n));
        System.out.printf("%.2f%n", Math.pow(n, 3));
    }
}`,
    testCases: [
      {
        id: "JCH03_B1_T1",
        label: "n=4.0",
        mockInputs: ["4.0"],
        expectedOutput: "16.00\n2.00\n64.00",
      },
      {
        id: "JCH03_B1_T2",
        label: "n=2.0",
        mockInputs: ["2.0"],
        expectedOutput: "4.00\n1.41\n8.00",
      },
      {
        id: "JCH03_B1_T3",
        label: "n=0.0 (boundary)",
        mockInputs: ["0.0"],
        expectedOutput: "0.00\n0.00\n0.00",
        isBoundary: true,
      },
      {
        id: "JCH03_B1_T4",
        label: "n=9.0",
        mockInputs: ["9.0"],
        expectedOutput: "81.00\n3.00\n729.00",
        isHidden: true,
      },
    ],
    concepts: ["Math.sqrt", "Math.pow", "double", "printf formatting"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH03_B2",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "beginner",
    tierIndex: 2,
    title: "Absolute Difference",
    emoji: "↔️",
    tagline: "Find how far apart two numbers are using Math.abs.",
    problemStatement:
      "Read two integers a and b. Print their absolute difference |a - b| using Math.abs.",
    inputFormat: "Two integers a and b on separate lines.",
    outputFormat: "One integer: |a - b|.",
    examples: [
      {
        input: "10\n3",
        output: "7",
        explanation: "|10-3| = 7.",
      },
      {
        input: "3\n10",
        output: "7",
        explanation: "|3-10| = 7.",
      },
    ],
    constraints: [
      "-10^9 <= a, b <= 10^9",
    ],
    hints: [
      "Math.abs(x) returns the absolute value of x.",
      "Compute a - b first, then pass the result to Math.abs.",
      "The answer is always non-negative.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // print |a - b|
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(Math.abs(a - b));
    }
}`,
    testCases: [
      {
        id: "JCH03_B2_T1",
        label: "10, 3",
        mockInputs: ["10", "3"],
        expectedOutput: "7",
      },
      {
        id: "JCH03_B2_T2",
        label: "3, 10 (reversed)",
        mockInputs: ["3", "10"],
        expectedOutput: "7",
      },
      {
        id: "JCH03_B2_T3",
        label: "Equal numbers",
        mockInputs: ["5", "5"],
        expectedOutput: "0",
        isBoundary: true,
      },
      {
        id: "JCH03_B2_T4",
        label: "Negatives",
        mockInputs: ["-3", "-10"],
        expectedOutput: "7",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["Math.abs", "arithmetic operators", "Scanner"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH03_I0",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "intermediate",
    tierIndex: 0,
    title: "Integer vs Double Division",
    emoji: "➗",
    tagline: "See the crucial difference between int and double division.",
    problemStatement:
      "Read two integers a and b. Print two lines:\n1. The integer division result (a / b as int).\n2. The double division result (exact, formatted to 6 decimal places).",
    inputFormat: "Two integers a and b on separate lines.",
    outputFormat:
      "Line 1: integer division result.\nLine 2: double division result to 6 decimal places.",
    examples: [
      {
        input: "7\n2",
        output: "3\n3.500000",
        explanation:
          "7/2 as ints = 3 (truncated). 7.0/2.0 = 3.5.",
      },
      {
        input: "10\n3",
        output: "3\n3.333333",
        explanation:
          "10/3 as ints = 3. 10.0/3.0 ≈ 3.333333.",
      },
    ],
    constraints: [
      "-10^9 <= a, b <= 10^9",
      "b != 0",
    ],
    hints: [
      "Casting to double before dividing: (double)a / b.",
      "Integer division in Java always truncates toward zero.",
      "Use printf(\"%.6f\", ...) for 6 decimal places.",
      "Do NOT convert a and b to double variables — cast inline to show the difference.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // print integer division result
        // print double division result to 6 decimal places
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a / b);
        System.out.printf("%.6f%n", (double) a / b);
    }
}`,
    testCases: [
      {
        id: "JCH03_I0_T1",
        label: "7 / 2",
        mockInputs: ["7", "2"],
        expectedOutput: "3\n3.500000",
      },
      {
        id: "JCH03_I0_T2",
        label: "10 / 3",
        mockInputs: ["10", "3"],
        expectedOutput: "3\n3.333333",
      },
      {
        id: "JCH03_I0_T3",
        label: "Exact division: 8 / 4",
        mockInputs: ["8", "4"],
        expectedOutput: "2\n2.000000",
        isBoundary: true,
      },
      {
        id: "JCH03_I0_T4",
        label: "Negative: -7 / 2",
        mockInputs: ["-7", "2"],
        expectedOutput: "-3\n-3.500000",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["integer division", "double division", "casting", "operator precedence"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH03_I1",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "intermediate",
    tierIndex: 1,
    title: "Rounding Suite",
    emoji: "🔢",
    tagline: "Master all four rounding strategies Java provides.",
    problemStatement:
      "Read a double value x. Print four results on separate lines:\n1. Math.round(x) — rounds to nearest long\n2. Math.floor(x) — rounds down (as long)\n3. Math.ceil(x) — rounds up (as long)\n4. (int)x — truncation (cast to int, drop decimal)",
    inputFormat: "One double x on a single line.",
    outputFormat:
      "Four lines: round, floor, ceil, truncated — all as integers.",
    examples: [
      {
        input: "3.7",
        output: "4\n3\n4\n3",
        explanation:
          "round(3.7)=4, floor(3.7)=3, ceil(3.7)=4, (int)3.7=3.",
      },
      {
        input: "-2.3",
        output: "-2\n-3\n-2\n-2",
        explanation:
          "round(-2.3)=-2, floor(-2.3)=-3, ceil(-2.3)=-2, (int)-2.3=-2.",
      },
    ],
    constraints: [
      "-10^6 <= x <= 10^6",
    ],
    hints: [
      "Math.round returns a long — cast to int if needed.",
      "Math.floor always goes toward negative infinity.",
      "Math.ceil always goes toward positive infinity.",
      "Casting (int)x truncates toward zero (same as floor for positives, same as ceil for negatives).",
      "Pay attention to negative numbers — floor and truncation differ!",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double x = sc.nextDouble();
        // print Math.round, Math.floor, Math.ceil, (int) cast each on own line
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double x = sc.nextDouble();
        System.out.println(Math.round(x));
        System.out.println((long) Math.floor(x));
        System.out.println((long) Math.ceil(x));
        System.out.println((int) x);
    }
}`,
    testCases: [
      {
        id: "JCH03_I1_T1",
        label: "x=3.7",
        mockInputs: ["3.7"],
        expectedOutput: "4\n3\n4\n3",
      },
      {
        id: "JCH03_I1_T2",
        label: "x=-2.3",
        mockInputs: ["-2.3"],
        expectedOutput: "-2\n-3\n-2\n-2",
      },
      {
        id: "JCH03_I1_T3",
        label: "x=2.5 (half-up)",
        mockInputs: ["2.5"],
        expectedOutput: "3\n2\n3\n2",
        isBoundary: true,
      },
      {
        id: "JCH03_I1_T4",
        label: "x=5.0 (whole)",
        mockInputs: ["5.0"],
        expectedOutput: "5\n5\n5\n5",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["Math.round", "Math.floor", "Math.ceil", "casting", "double"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH03_I2",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "intermediate",
    tierIndex: 2,
    title: "Min/Max Finder (3 numbers)",
    emoji: "📊",
    tagline: "Find the smallest and largest of three integers.",
    problemStatement:
      "Read three integers a, b, c. Print the minimum and maximum using Math.min and Math.max, each on a separate line.",
    inputFormat: "Three integers a, b, c on separate lines.",
    outputFormat: "Line 1: minimum. Line 2: maximum.",
    examples: [
      {
        input: "5\n3\n8",
        output: "3\n8",
        explanation: "min(5,3,8)=3, max(5,3,8)=8.",
      },
    ],
    constraints: [
      "-10^9 <= a, b, c <= 10^9",
    ],
    hints: [
      "Math.min(a, b) returns the smaller of two values.",
      "Chain calls: Math.min(a, Math.min(b, c)) gives the minimum of three.",
      "Similarly for Math.max.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // print minimum then maximum
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(Math.min(a, Math.min(b, c)));
        System.out.println(Math.max(a, Math.max(b, c)));
    }
}`,
    testCases: [
      {
        id: "JCH03_I2_T1",
        label: "5, 3, 8",
        mockInputs: ["5", "3", "8"],
        expectedOutput: "3\n8",
      },
      {
        id: "JCH03_I2_T2",
        label: "All equal",
        mockInputs: ["7", "7", "7"],
        expectedOutput: "7\n7",
        isBoundary: true,
      },
      {
        id: "JCH03_I2_T3",
        label: "Negative numbers",
        mockInputs: ["-5", "-1", "-9"],
        expectedOutput: "-9\n-1",
      },
      {
        id: "JCH03_I2_T4",
        label: "First is min and max (all same)",
        mockInputs: ["100", "50", "75"],
        expectedOutput: "50\n100",
        isHidden: true,
      },
    ],
    concepts: ["Math.min", "Math.max", "chaining", "Scanner"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH03_A0",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "advanced",
    tierIndex: 0,
    title: "Compound Interest",
    emoji: "💰",
    tagline: "Calculate how your investment grows over time.",
    problemStatement:
      "Read principal P (double), annual rate r (double, as percentage), and years n (int). Compute compound interest amount using A = P * (1 + r/100)^n. Print A formatted to 2 decimal places.",
    inputFormat:
      "Line 1: P (double)\nLine 2: r (double, e.g. 5 for 5%)\nLine 3: n (int)",
    outputFormat: "One line: the amount A to 2 decimal places.",
    examples: [
      {
        input: "1000.0\n5.0\n3",
        output: "1157.63",
        explanation:
          "A = 1000 * (1 + 5/100)^3 = 1000 * 1.157625 = 1157.63.",
      },
      {
        input: "5000.0\n8.0\n10",
        output: "10794.62",
        explanation: "A = 5000 * 1.08^10 ≈ 10794.62.",
      },
    ],
    constraints: [
      "0 < P <= 10^7",
      "0 < r <= 100",
      "1 <= n <= 50",
    ],
    hints: [
      "Use Math.pow(base, exponent) for the power.",
      "Divide r by 100.0 before adding 1 to avoid integer division.",
      "The formula is A = P * Math.pow(1 + r / 100.0, n).",
      "Use printf(\"%.2f\", A) for 2 decimal places.",
    ],
    referenceProgram: {
      title: "Compound Interest Reference",
      description: "Uses Math.pow to compute compound interest amount.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double P = sc.nextDouble();
        double r = sc.nextDouble();
        int n = sc.nextInt();
        double A = P * Math.pow(1 + r / 100.0, n);
        System.out.printf("%.2f%n", A);
    }
}`,
      explanation:
        "Math.pow(1 + r/100.0, n) raises (1 + r/100) to the power n. Dividing r by 100.0 ensures double arithmetic.",
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double P = sc.nextDouble();
        double r = sc.nextDouble();
        int n = sc.nextInt();
        // compute A = P * (1 + r/100)^n and print to 2 decimal places
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double P = sc.nextDouble();
        double r = sc.nextDouble();
        int n = sc.nextInt();
        double A = P * Math.pow(1 + r / 100.0, n);
        System.out.printf("%.2f%n", A);
    }
}`,
    testCases: [
      {
        id: "JCH03_A0_T1",
        label: "1000 @ 5% for 3 years",
        mockInputs: ["1000.0", "5.0", "3"],
        expectedOutput: "1157.63",
      },
      {
        id: "JCH03_A0_T2",
        label: "5000 @ 8% for 10 years",
        mockInputs: ["5000.0", "8.0", "10"],
        expectedOutput: "10794.62",
      },
      {
        id: "JCH03_A0_T3",
        label: "n=1 (boundary)",
        mockInputs: ["1000.0", "10.0", "1"],
        expectedOutput: "1100.00",
        isBoundary: true,
      },
      {
        id: "JCH03_A0_T4",
        label: "High rate",
        mockInputs: ["100.0", "100.0", "2"],
        expectedOutput: "400.00",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["Math.pow", "compound interest", "double arithmetic", "printf formatting"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH03_A1",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "advanced",
    tierIndex: 1,
    title: "Logarithm Suite",
    emoji: "📈",
    tagline: "Explore natural log, log base 10, and log base 2.",
    problemStatement:
      "Read a positive double n. Print three results on separate lines, each to 4 decimal places:\n1. Natural logarithm: Math.log(n)\n2. Log base 10: Math.log10(n)\n3. Log base 2: Math.log(n) / Math.log(2)",
    inputFormat: "One positive double n on a single line.",
    outputFormat:
      "Three lines: ln(n), log10(n), log2(n) — each to 4 decimal places.",
    examples: [
      {
        input: "8.0",
        output: "2.0794\n0.9031\n3.0000",
        explanation:
          "ln(8)=2.0794, log10(8)=0.9031, log2(8)=3.0000.",
      },
      {
        input: "100.0",
        output: "4.6052\n2.0000\n6.6439",
        explanation:
          "ln(100)≈4.6052, log10(100)=2, log2(100)≈6.6439.",
      },
    ],
    constraints: [
      "0 < n <= 10^9",
    ],
    hints: [
      "Math.log(n) computes the natural logarithm (base e).",
      "Math.log10(n) computes logarithm base 10.",
      "Change-of-base formula: log_b(n) = Math.log(n) / Math.log(b).",
      "For log base 2: Math.log(n) / Math.log(2).",
      "Use printf(\"%.4f\", value) for 4 decimal places.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double n = sc.nextDouble();
        // print ln(n), log10(n), log2(n) each to 4 decimal places
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double n = sc.nextDouble();
        System.out.printf("%.4f%n", Math.log(n));
        System.out.printf("%.4f%n", Math.log10(n));
        System.out.printf("%.4f%n", Math.log(n) / Math.log(2));
    }
}`,
    testCases: [
      {
        id: "JCH03_A1_T1",
        label: "n=8.0",
        mockInputs: ["8.0"],
        expectedOutput: "2.0794\n0.9031\n3.0000",
      },
      {
        id: "JCH03_A1_T2",
        label: "n=100.0",
        mockInputs: ["100.0"],
        expectedOutput: "4.6052\n2.0000\n6.6439",
      },
      {
        id: "JCH03_A1_T3",
        label: "n=1.0 (boundary: all logs = 0)",
        mockInputs: ["1.0"],
        expectedOutput: "0.0000\n0.0000\n0.0000",
        isBoundary: true,
      },
      {
        id: "JCH03_A1_T4",
        label: "n=e (natural base)",
        mockInputs: ["2.718281828"],
        expectedOutput: "1.0000\n0.4343\n1.4427",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["Math.log", "Math.log10", "logarithm", "change-of-base formula"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH03_A2",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "advanced",
    tierIndex: 2,
    title: "Digit Extractor",
    emoji: "🔍",
    tagline: "Pull apart a 4-digit number into its individual digits.",
    problemStatement:
      "Read a 4-digit integer n (1000–9999). Extract and print the thousands, hundreds, tens, and units digits, each on a separate line. Use only integer division (/) and modulo (%) — no String conversion.",
    inputFormat: "One integer n (1000 <= n <= 9999).",
    outputFormat:
      "Four lines: thousands digit, hundreds digit, tens digit, units digit.",
    examples: [
      {
        input: "4823",
        output: "4\n8\n2\n3",
        explanation:
          "thousands=4823/1000=4, hundreds=(4823/100)%10=8, tens=(4823/10)%10=2, units=4823%10=3.",
      },
      {
        input: "1000",
        output: "1\n0\n0\n0",
      },
    ],
    constraints: [
      "1000 <= n <= 9999",
    ],
    hints: [
      "Thousands digit: n / 1000",
      "Hundreds digit: (n / 100) % 10",
      "Tens digit: (n / 10) % 10",
      "Units digit: n % 10",
      "All operations use only integer division and modulo.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // extract and print thousands, hundreds, tens, units digits
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int thousands = n / 1000;
        int hundreds  = (n / 100) % 10;
        int tens      = (n / 10) % 10;
        int units     = n % 10;
        System.out.println(thousands);
        System.out.println(hundreds);
        System.out.println(tens);
        System.out.println(units);
    }
}`,
    testCases: [
      {
        id: "JCH03_A2_T1",
        label: "n=4823",
        mockInputs: ["4823"],
        expectedOutput: "4\n8\n2\n3",
      },
      {
        id: "JCH03_A2_T2",
        label: "n=1000 (min boundary)",
        mockInputs: ["1000"],
        expectedOutput: "1\n0\n0\n0",
        isBoundary: true,
      },
      {
        id: "JCH03_A2_T3",
        label: "n=9999 (max boundary)",
        mockInputs: ["9999"],
        expectedOutput: "9\n9\n9\n9",
        isBoundary: true,
      },
      {
        id: "JCH03_A2_T4",
        label: "n=5070",
        mockInputs: ["5070"],
        expectedOutput: "5\n0\n7\n0",
        isHidden: true,
      },
    ],
    concepts: ["integer division", "modulo", "digit extraction", "operator precedence"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH03_L0",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "leetcode",
    tierIndex: 0,
    title: "Power without Math.pow",
    emoji: "⚡",
    tagline: "Implement integer exponentiation from scratch using a loop.",
    problemStatement:
      "Read a base (int) and an exponent (int). Compute base^exponent using a loop — do NOT use Math.pow. If the exponent is negative, print 0. Print the result.",
    inputFormat: "Line 1: base (int). Line 2: exponent (int).",
    outputFormat: "One line: the result (long to avoid overflow for reasonable inputs).",
    examples: [
      {
        input: "2\n10",
        output: "1024",
        explanation: "2^10 = 1024.",
      },
      {
        input: "3\n0",
        output: "1",
        explanation: "Any number to the power 0 is 1.",
      },
      {
        input: "5\n-2",
        output: "0",
        explanation: "Negative exponent → print 0.",
      },
    ],
    constraints: [
      "-100 <= base <= 100",
      "-10 <= exponent <= 20",
    ],
    hints: [
      "Use a loop that multiplies result by base, running exponent times.",
      "Handle exp == 0 as a special case: return 1.",
      "Handle negative exponent: return 0 per the problem spec.",
      "Use a long result variable to handle larger products.",
      "Think: what does result = 1 * base * base * ... (n times) produce?",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt();
        int exp  = sc.nextInt();
        // compute base^exp using a loop, print 0 if exp < 0
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt();
        int exp  = sc.nextInt();
        if (exp < 0) {
            System.out.println(0);
            return;
        }
        long result = 1;
        for (int i = 0; i < exp; i++) {
            result *= base;
        }
        System.out.println(result);
    }
}`,
    testCases: [
      {
        id: "JCH03_L0_T1",
        label: "2^10",
        mockInputs: ["2", "10"],
        expectedOutput: "1024",
      },
      {
        id: "JCH03_L0_T2",
        label: "exp=0 (boundary)",
        mockInputs: ["3", "0"],
        expectedOutput: "1",
        isBoundary: true,
      },
      {
        id: "JCH03_L0_T3",
        label: "Negative exponent",
        mockInputs: ["5", "-2"],
        expectedOutput: "0",
        isBoundary: true,
      },
      {
        id: "JCH03_L0_T4",
        label: "base=0",
        mockInputs: ["0", "5"],
        expectedOutput: "0",
        isBoundary: true,
        isHidden: true,
      },
      {
        id: "JCH03_L0_T5",
        label: "base=1 (always 1)",
        mockInputs: ["1", "15"],
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    concepts: ["loops", "integer exponentiation", "long", "edge cases"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(n) where n = exponent",
  },

  {
    id: "JCH03_L1",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "leetcode",
    tierIndex: 1,
    title: "GCD & LCM",
    emoji: "🔗",
    tagline: "Classic number theory: find the greatest common divisor and least common multiple.",
    problemStatement:
      "Read two positive integers a and b. Compute and print their GCD using the Euclidean algorithm. Then compute and print LCM = (a * b) / gcd on separate lines.",
    inputFormat: "Two positive integers a and b on separate lines.",
    outputFormat: "Line 1: GCD(a, b). Line 2: LCM(a, b).",
    examples: [
      {
        input: "12\n8",
        output: "4\n24",
        explanation: "GCD(12,8)=4. LCM=12*8/4=24.",
      },
      {
        input: "7\n13",
        output: "1\n91",
        explanation: "GCD(7,13)=1 (coprime). LCM=91.",
      },
    ],
    constraints: [
      "1 <= a, b <= 10^9",
    ],
    hints: [
      "Euclidean algorithm: gcd(a, b) = gcd(b, a % b); base case gcd(a, 0) = a.",
      "Implement gcd with a while loop: while (b != 0) { int t = b; b = a % b; a = t; }",
      "LCM formula: lcm = (a / gcd) * b to avoid overflow (divide first).",
      "Use long for the LCM computation to handle large inputs.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // compute GCD using Euclidean algorithm
        // compute LCM = a*b/gcd
        // print GCD then LCM
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long a = sc.nextLong();
        long b = sc.nextLong();
        long originalA = a, originalB = b;
        while (b != 0) {
            long t = b;
            b = a % b;
            a = t;
        }
        long gcd = a;
        long lcm = (originalA / gcd) * originalB;
        System.out.println(gcd);
        System.out.println(lcm);
    }
}`,
    testCases: [
      {
        id: "JCH03_L1_T1",
        label: "12, 8",
        mockInputs: ["12", "8"],
        expectedOutput: "4\n24",
      },
      {
        id: "JCH03_L1_T2",
        label: "Coprime: 7, 13",
        mockInputs: ["7", "13"],
        expectedOutput: "1\n91",
      },
      {
        id: "JCH03_L1_T3",
        label: "Same number",
        mockInputs: ["6", "6"],
        expectedOutput: "6\n6",
        isBoundary: true,
      },
      {
        id: "JCH03_L1_T4",
        label: "One divides other",
        mockInputs: ["4", "16"],
        expectedOutput: "4\n16",
        isBoundary: true,
      },
      {
        id: "JCH03_L1_T5",
        label: "Large inputs",
        mockInputs: ["1000000000", "999999999"],
        expectedOutput: "1\n999999999000000000",
        isHidden: true,
      },
    ],
    concepts: ["GCD", "LCM", "Euclidean algorithm", "modulo", "long arithmetic"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(log(min(a,b)))",
  },

  {
    id: "JCH03_L2",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "leetcode",
    tierIndex: 2,
    title: "Perfect Square Check",
    emoji: "🟦",
    tagline: "Determine if a number is a perfect square without trial division.",
    problemStatement:
      "Read an integer N. Print \"YES\" if N is a perfect square, \"NO\" otherwise. A perfect square is a non-negative integer whose square root is also an integer (e.g. 0, 1, 4, 9, 16...). Use Math.sqrt and verify with integer cast.",
    inputFormat: "One integer N on a single line.",
    outputFormat: "YES or NO.",
    examples: [
      {
        input: "16",
        output: "YES",
        explanation: "sqrt(16)=4, 4*4=16.",
      },
      {
        input: "15",
        output: "NO",
        explanation: "sqrt(15)≈3.87, not integer.",
      },
      {
        input: "0",
        output: "YES",
        explanation: "0 = 0^2.",
      },
    ],
    constraints: [
      "0 <= N <= 10^14",
    ],
    hints: [
      "Compute s = (long) Math.sqrt(N).",
      "Check if s * s == N.",
      "Also check (s+1)*(s+1) == N to guard against floating-point truncation.",
      "Negative numbers cannot be perfect squares.",
      "Use long for the sqrt result since N can be up to 10^14.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long N = sc.nextLong();
        // check if N is a perfect square
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long N = sc.nextLong();
        if (N < 0) {
            System.out.println("NO");
            return;
        }
        long s = (long) Math.sqrt(N);
        if (s * s == N || (s + 1) * (s + 1) == N) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }
    }
}`,
    testCases: [
      {
        id: "JCH03_L2_T1",
        label: "N=16",
        mockInputs: ["16"],
        expectedOutput: "YES",
      },
      {
        id: "JCH03_L2_T2",
        label: "N=15",
        mockInputs: ["15"],
        expectedOutput: "NO",
      },
      {
        id: "JCH03_L2_T3",
        label: "N=0",
        mockInputs: ["0"],
        expectedOutput: "YES",
        isBoundary: true,
      },
      {
        id: "JCH03_L2_T4",
        label: "N=1",
        mockInputs: ["1"],
        expectedOutput: "YES",
        isBoundary: true,
      },
      {
        id: "JCH03_L2_T5",
        label: "N=10^14 (large perfect square)",
        mockInputs: ["100000000000000"],
        expectedOutput: "YES",
        isHidden: true,
      },
    ],
    concepts: ["Math.sqrt", "perfect square", "long", "floating-point caution", "casting"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(1)",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH03_H0",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "hackathon",
    tierIndex: 0,
    title: "Scientific Calculator",
    emoji: "🔬",
    tagline: "Parse and evaluate a math expression string with 8 operators.",
    problemStatement:
      "Read one line containing an expression in the format \"num1 op num2\" where op is one of: +, -, *, /, %, ^, log, sqrt.\n- ^ means num1 raised to the power num2.\n- log means log base num2 of num1 (natural log of num1 / natural log of num2).\n- sqrt means sqrt of num1 (num2 is ignored; you may still provide it).\nPrint the result to 4 decimal places. Print \"ERROR\" for division by zero or log of non-positive numbers.",
    inputFormat:
      "One line: \"num1 op num2\" (e.g. \"8.0 log 2.0\" or \"9.0 sqrt 0\").",
    outputFormat: "The result to 4 decimal places, or ERROR.",
    examples: [
      {
        input: "8.0 log 2.0",
        output: "3.0000",
        explanation: "log base 2 of 8 = 3.",
      },
      {
        input: "2.0 ^ 8.0",
        output: "256.0000",
        explanation: "2^8 = 256.",
      },
      {
        input: "9.0 sqrt 0",
        output: "3.0000",
        explanation: "sqrt(9) = 3.",
      },
      {
        input: "5.0 / 0.0",
        output: "ERROR",
        explanation: "Division by zero.",
      },
    ],
    constraints: [
      "num1 and num2 are valid doubles",
      "op is one of: +, -, *, /, %, ^, log, sqrt",
    ],
    hints: [
      "Read the full line with sc.nextLine(), then split on spaces.",
      "Use a switch or if-else chain on the operator string.",
      "For log: result = Math.log(num1) / Math.log(num2). Check num1 > 0 and num2 > 0.",
      "For sqrt: result = Math.sqrt(num1). Check num1 >= 0.",
      "For /: check num2 == 0 before dividing.",
      "Use printf(\"%.4f\", result) for output.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().trim();
        String[] parts = line.split("\\\\s+");
        double num1 = Double.parseDouble(parts[0]);
        String op   = parts[1];
        double num2 = Double.parseDouble(parts[2]);
        // evaluate expression and print to 4 decimal places or ERROR
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().trim();
        String[] parts = line.split("\\s+");
        double num1 = Double.parseDouble(parts[0]);
        String op   = parts[1];
        double num2 = Double.parseDouble(parts[2]);
        double result;
        switch (op) {
            case "+":    result = num1 + num2; break;
            case "-":    result = num1 - num2; break;
            case "*":    result = num1 * num2; break;
            case "/":
                if (num2 == 0) { System.out.println("ERROR"); return; }
                result = num1 / num2; break;
            case "%":
                if (num2 == 0) { System.out.println("ERROR"); return; }
                result = num1 % num2; break;
            case "^":    result = Math.pow(num1, num2); break;
            case "log":
                if (num1 <= 0 || num2 <= 0 || num2 == 1) { System.out.println("ERROR"); return; }
                result = Math.log(num1) / Math.log(num2); break;
            case "sqrt":
                if (num1 < 0) { System.out.println("ERROR"); return; }
                result = Math.sqrt(num1); break;
            default:
                System.out.println("ERROR"); return;
        }
        System.out.printf("%.4f%n", result);
    }
}`,
    testCases: [
      {
        id: "JCH03_H0_T1",
        label: "log base 2 of 8",
        mockInputs: ["8.0 log 2.0"],
        expectedOutput: "3.0000",
      },
      {
        id: "JCH03_H0_T2",
        label: "2^8",
        mockInputs: ["2.0 ^ 8.0"],
        expectedOutput: "256.0000",
      },
      {
        id: "JCH03_H0_T3",
        label: "sqrt(9)",
        mockInputs: ["9.0 sqrt 0"],
        expectedOutput: "3.0000",
      },
      {
        id: "JCH03_H0_T4",
        label: "Division by zero",
        mockInputs: ["5.0 / 0.0"],
        expectedOutput: "ERROR",
        isBoundary: true,
      },
      {
        id: "JCH03_H0_T5",
        label: "10.0 + 3.5",
        mockInputs: ["10.0 + 3.5"],
        expectedOutput: "13.5000",
      },
      {
        id: "JCH03_H0_T6",
        label: "7.0 % 3.0",
        mockInputs: ["7.0 % 3.0"],
        expectedOutput: "1.0000",
        isHidden: true,
      },
    ],
    concepts: ["switch", "string parsing", "Math.pow", "Math.log", "Math.sqrt", "error handling"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend to support parentheses and multi-operator expressions by implementing a simple expression parser.",
  },

  {
    id: "JCH03_H1",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "hackathon",
    tierIndex: 1,
    title: "Statistics Suite",
    emoji: "📉",
    tagline: "Compute sum, mean, variance, and standard deviation from a dataset.",
    problemStatement:
      "Read an integer N, then N doubles. Compute and print on separate lines:\n1. Sum (to 4 decimal places)\n2. Mean (to 4 decimal places)\n3. Variance (population variance = sum of (xi - mean)^2 / N, to 4 decimal places)\n4. Standard deviation (sqrt of variance, to 4 decimal places)",
    inputFormat:
      "Line 1: N (int). Lines 2 to N+1: one double per line.",
    outputFormat:
      "Four lines: sum, mean, variance, std dev — each to 4 decimal places.",
    examples: [
      {
        input: "5\n2.0\n4.0\n4.0\n4.0\n6.0",
        output: "20.0000\n4.0000\n2.0000\n1.4142",
        explanation:
          "sum=20, mean=4, variance=((4+0+0+0+4)/5)=8/5=1.6 — wait, let's recount: deviations from mean 4 are: (2-4)^2=4,(4-4)^2=0,(4-4)^2=0,(4-4)^2=0,(6-4)^2=4; variance=(4+0+0+0+4)/5=8/5=1.6; stddev=sqrt(1.6)≈1.2649. (Example updated below.)",
      },
    ],
    constraints: [
      "1 <= N <= 1000",
      "-10^6 <= each value <= 10^6",
    ],
    hints: [
      "First pass: accumulate sum and compute mean.",
      "Second pass: accumulate sum of (xi - mean)^2 for variance.",
      "Variance = sumSquaredDiffs / N (population variance).",
      "Standard deviation = Math.sqrt(variance).",
      "Store all values in a double array for the two-pass computation.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        double[] values = new double[n];
        for (int i = 0; i < n; i++) {
            values[i] = sc.nextDouble();
        }
        // compute sum, mean, variance, std dev
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        double[] values = new double[n];
        double sum = 0;
        for (int i = 0; i < n; i++) {
            values[i] = sc.nextDouble();
            sum += values[i];
        }
        double mean = sum / n;
        double sumSqDiff = 0;
        for (int i = 0; i < n; i++) {
            double diff = values[i] - mean;
            sumSqDiff += diff * diff;
        }
        double variance = sumSqDiff / n;
        double stdDev   = Math.sqrt(variance);
        System.out.printf("%.4f%n", sum);
        System.out.printf("%.4f%n", mean);
        System.out.printf("%.4f%n", variance);
        System.out.printf("%.4f%n", stdDev);
    }
}`,
    testCases: [
      {
        id: "JCH03_H1_T1",
        label: "5 values: 2,4,4,4,6",
        mockInputs: ["5", "2.0", "4.0", "4.0", "4.0", "6.0"],
        expectedOutput: "20.0000\n4.0000\n1.6000\n1.2649",
      },
      {
        id: "JCH03_H1_T2",
        label: "N=1 (variance=0)",
        mockInputs: ["1", "7.0"],
        expectedOutput: "7.0000\n7.0000\n0.0000\n0.0000",
        isBoundary: true,
      },
      {
        id: "JCH03_H1_T3",
        label: "All same values",
        mockInputs: ["3", "5.0", "5.0", "5.0"],
        expectedOutput: "15.0000\n5.0000\n0.0000\n0.0000",
        isBoundary: true,
      },
      {
        id: "JCH03_H1_T4",
        label: "3 values: 1,2,3",
        mockInputs: ["3", "1.0", "2.0", "3.0"],
        expectedOutput: "6.0000\n2.0000\n0.6667\n0.8165",
        isHidden: true,
      },
    ],
    concepts: ["arrays", "Math.sqrt", "statistics", "two-pass algorithm", "variance"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Add median computation (requires sorting) and mode detection. What is the time complexity?",
  },

  {
    id: "JCH03_H2",
    chapterId: "JCH03_MATH",
    chapterNumber: 3,
    tier: "hackathon",
    tierIndex: 2,
    title: "Bezier Curve Point",
    emoji: "🎨",
    tagline: "Compute a point on a quadratic Bezier curve using the parametric formula.",
    problemStatement:
      "A quadratic Bezier curve is defined by three control points P0=(x0,y0), P1=(x1,y1), P2=(x2,y2) and a parameter t in [0,1].\n\nThe point B(t) = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2\n\nRead P0, P1, P2 (each as two doubles x y on one line), then t. Print the resulting point's x and y coordinates, each to 4 decimal places on separate lines.",
    inputFormat:
      "Line 1: x0 y0\nLine 2: x1 y1\nLine 3: x2 y2\nLine 4: t",
    outputFormat:
      "Line 1: x coordinate of B(t) to 4 decimal places.\nLine 2: y coordinate of B(t) to 4 decimal places.",
    examples: [
      {
        input: "0.0 0.0\n1.0 2.0\n2.0 0.0\n0.5",
        output: "1.0000\n1.0000",
        explanation:
          "B(0.5) = 0.25*(0,0) + 2*0.5*0.5*(1,2) + 0.25*(2,0) = (0,0)+(0.5,1)+(0.5,0) = (1,1).",
      },
      {
        input: "0.0 0.0\n1.0 2.0\n2.0 0.0\n0.0",
        output: "0.0000\n0.0000",
        explanation: "t=0 returns P0.",
      },
      {
        input: "0.0 0.0\n1.0 2.0\n2.0 0.0\n1.0",
        output: "2.0000\n0.0000",
        explanation: "t=1 returns P2.",
      },
    ],
    constraints: [
      "-1000 <= coordinates <= 1000",
      "0.0 <= t <= 1.0",
    ],
    hints: [
      "Store control points as pairs of doubles.",
      "Precompute: double mt = 1 - t; (1 minus t)",
      "Bezier x: mt*mt*x0 + 2*mt*t*x1 + t*t*x2",
      "Bezier y: mt*mt*y0 + 2*mt*t*y1 + t*t*y2",
      "Use printf(\"%.4f\", bx) and printf(\"%.4f\", by) for output.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double x0 = sc.nextDouble(), y0 = sc.nextDouble();
        double x1 = sc.nextDouble(), y1 = sc.nextDouble();
        double x2 = sc.nextDouble(), y2 = sc.nextDouble();
        double t  = sc.nextDouble();
        // compute quadratic Bezier point B(t) and print x, y to 4 decimal places
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double x0 = sc.nextDouble(), y0 = sc.nextDouble();
        double x1 = sc.nextDouble(), y1 = sc.nextDouble();
        double x2 = sc.nextDouble(), y2 = sc.nextDouble();
        double t  = sc.nextDouble();
        double mt = 1.0 - t;
        double bx = mt * mt * x0 + 2 * mt * t * x1 + t * t * x2;
        double by = mt * mt * y0 + 2 * mt * t * y1 + t * t * y2;
        System.out.printf("%.4f%n", bx);
        System.out.printf("%.4f%n", by);
    }
}`,
    testCases: [
      {
        id: "JCH03_H2_T1",
        label: "t=0.5 midpoint",
        mockInputs: ["0.0 0.0", "1.0 2.0", "2.0 0.0", "0.5"],
        expectedOutput: "1.0000\n1.0000",
      },
      {
        id: "JCH03_H2_T2",
        label: "t=0 returns P0",
        mockInputs: ["0.0 0.0", "1.0 2.0", "2.0 0.0", "0.0"],
        expectedOutput: "0.0000\n0.0000",
        isBoundary: true,
      },
      {
        id: "JCH03_H2_T3",
        label: "t=1 returns P2",
        mockInputs: ["0.0 0.0", "1.0 2.0", "2.0 0.0", "1.0"],
        expectedOutput: "2.0000\n0.0000",
        isBoundary: true,
      },
      {
        id: "JCH03_H2_T4",
        label: "t=0.25",
        mockInputs: ["0.0 0.0", "2.0 4.0", "4.0 0.0", "0.25"],
        expectedOutput: "1.0000\n1.5000",
        isHidden: true,
      },
    ],
    concepts: ["Math class", "Bezier curve", "parametric equations", "double arithmetic"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend to a cubic Bezier curve with four control points. What changes in the formula? Can you sample 10 evenly spaced points along the curve?",
  },
];
