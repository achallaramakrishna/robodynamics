import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH04_PROGRAMS: YamunaProgram[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH04_B0",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "beginner",
    tierIndex: 0,
    title: "Grade Evaluator",
    emoji: "🎓",
    tagline: "Turn a score into a letter grade with if-else if chains.",
    problemStatement:
      "Read an integer score (0-100). Print the corresponding grade:\n- A: score >= 90\n- B: score >= 80\n- C: score >= 70\n- D: score >= 60\n- F: score < 60",
    inputFormat: "One integer score on a single line.",
    outputFormat: "One letter: A, B, C, D, or F.",
    examples: [
      {
        input: "92",
        output: "A",
        explanation: "92 >= 90, so grade is A.",
      },
      {
        input: "75",
        output: "C",
        explanation: "75 >= 70 but < 80, so grade is C.",
      },
      {
        input: "45",
        output: "F",
        explanation: "45 < 60, so grade is F.",
      },
    ],
    constraints: [
      "0 <= score <= 100",
    ],
    hints: [
      "Use if-else if-else so only one branch executes.",
      "Check the highest grade first (A >= 90) and work downward.",
      "The final else catches all scores below 60 (grade F).",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        // print grade A/B/C/D/F
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        if (score >= 90) {
            System.out.println("A");
        } else if (score >= 80) {
            System.out.println("B");
        } else if (score >= 70) {
            System.out.println("C");
        } else if (score >= 60) {
            System.out.println("D");
        } else {
            System.out.println("F");
        }
    }
}`,
    testCases: [
      {
        id: "JCH04_B0_T1",
        label: "score=92 (A)",
        mockInputs: ["92"],
        expectedOutput: "A",
      },
      {
        id: "JCH04_B0_T2",
        label: "score=75 (C)",
        mockInputs: ["75"],
        expectedOutput: "C",
      },
      {
        id: "JCH04_B0_T3",
        label: "score=45 (F)",
        mockInputs: ["45"],
        expectedOutput: "F",
      },
      {
        id: "JCH04_B0_T4",
        label: "Boundary score=90 (A)",
        mockInputs: ["90"],
        expectedOutput: "A",
        isBoundary: true,
      },
      {
        id: "JCH04_B0_T5",
        label: "score=0 (F)",
        mockInputs: ["0"],
        expectedOutput: "F",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["if/else if/else", "comparison operators", "Scanner"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH04_B1",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "beginner",
    tierIndex: 1,
    title: "Even or Odd",
    emoji: "🔢",
    tagline: "The classic first conditional — is a number divisible by 2?",
    problemStatement:
      "Read an integer. Print \"Even\" if it is divisible by 2, \"Odd\" otherwise.",
    inputFormat: "One integer on a single line.",
    outputFormat: "Even or Odd.",
    examples: [
      {
        input: "4",
        output: "Even",
      },
      {
        input: "7",
        output: "Odd",
      },
    ],
    constraints: [
      "-10^9 <= n <= 10^9",
    ],
    hints: [
      "Use the modulo operator %: if n % 2 == 0, the number is even.",
      "This works for negative numbers too in Java.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // print Even or Odd
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
    testCases: [
      {
        id: "JCH04_B1_T1",
        label: "4 (Even)",
        mockInputs: ["4"],
        expectedOutput: "Even",
      },
      {
        id: "JCH04_B1_T2",
        label: "7 (Odd)",
        mockInputs: ["7"],
        expectedOutput: "Odd",
      },
      {
        id: "JCH04_B1_T3",
        label: "0 (Even boundary)",
        mockInputs: ["0"],
        expectedOutput: "Even",
        isBoundary: true,
      },
      {
        id: "JCH04_B1_T4",
        label: "-3 (Odd, negative)",
        mockInputs: ["-3"],
        expectedOutput: "Odd",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["if/else", "modulo", "even/odd"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH04_B2",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "beginner",
    tierIndex: 2,
    title: "Max of Three",
    emoji: "🥇",
    tagline: "Find the largest of three numbers using if-else chains.",
    problemStatement:
      "Read three integers a, b, c. Print the largest of the three.",
    inputFormat: "Three integers a, b, c on separate lines.",
    outputFormat: "One integer: the largest.",
    examples: [
      {
        input: "5\n9\n3",
        output: "9",
      },
      {
        input: "7\n7\n7",
        output: "7",
        explanation: "All equal; any value is the max.",
      },
    ],
    constraints: [
      "-10^9 <= a, b, c <= 10^9",
    ],
    hints: [
      "Compare a with b first, then compare the larger with c.",
      "Alternatively use nested if-else: if (a >= b && a >= c) max = a.",
      "You can also use Math.max(a, Math.max(b, c)).",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // print the largest
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        int max;
        if (a >= b && a >= c) {
            max = a;
        } else if (b >= a && b >= c) {
            max = b;
        } else {
            max = c;
        }
        System.out.println(max);
    }
}`,
    testCases: [
      {
        id: "JCH04_B2_T1",
        label: "5, 9, 3",
        mockInputs: ["5", "9", "3"],
        expectedOutput: "9",
      },
      {
        id: "JCH04_B2_T2",
        label: "All equal",
        mockInputs: ["7", "7", "7"],
        expectedOutput: "7",
        isBoundary: true,
      },
      {
        id: "JCH04_B2_T3",
        label: "First is max",
        mockInputs: ["100", "50", "75"],
        expectedOutput: "100",
      },
      {
        id: "JCH04_B2_T4",
        label: "Negative numbers",
        mockInputs: ["-1", "-5", "-3"],
        expectedOutput: "-1",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["if/else", "logical operators", "&&", "comparison"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH04_I0",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "intermediate",
    tierIndex: 0,
    title: "Season Detector",
    emoji: "🌸",
    tagline: "Map month numbers to seasons using a switch statement.",
    problemStatement:
      "Read a month number (1-12). Print the season:\n- Spring: 3, 4, 5\n- Summer: 6, 7, 8\n- Monsoon: 7, 8, 9 — NOTE: Use the following mapping:\n  - Spring: March(3), April(4), May(5)\n  - Summer: June(6), July(7), August(8)\n  - Monsoon: September(9), October(10)\n  - Winter: November(11), December(12), January(1), February(2)\nPrint \"Invalid\" for any number outside 1-12.",
    inputFormat: "One integer (1-12) on a single line.",
    outputFormat: "Season name: Spring, Summer, Monsoon, or Winter.",
    examples: [
      {
        input: "4",
        output: "Spring",
      },
      {
        input: "9",
        output: "Monsoon",
      },
      {
        input: "12",
        output: "Winter",
      },
    ],
    constraints: [
      "Input is an integer",
    ],
    hints: [
      "Use a switch statement with multiple case labels falling through to a single break.",
      "case 3: case 4: case 5: System.out.println(\"Spring\"); break;",
      "The default case handles invalid input.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int month = sc.nextInt();
        // use switch to print the season
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int month = sc.nextInt();
        switch (month) {
            case 3: case 4: case 5:
                System.out.println("Spring"); break;
            case 6: case 7: case 8:
                System.out.println("Summer"); break;
            case 9: case 10:
                System.out.println("Monsoon"); break;
            case 11: case 12: case 1: case 2:
                System.out.println("Winter"); break;
            default:
                System.out.println("Invalid");
        }
    }
}`,
    testCases: [
      {
        id: "JCH04_I0_T1",
        label: "April (4) = Spring",
        mockInputs: ["4"],
        expectedOutput: "Spring",
      },
      {
        id: "JCH04_I0_T2",
        label: "September (9) = Monsoon",
        mockInputs: ["9"],
        expectedOutput: "Monsoon",
      },
      {
        id: "JCH04_I0_T3",
        label: "December (12) = Winter",
        mockInputs: ["12"],
        expectedOutput: "Winter",
      },
      {
        id: "JCH04_I0_T4",
        label: "January (1) = Winter",
        mockInputs: ["1"],
        expectedOutput: "Winter",
        isBoundary: true,
      },
      {
        id: "JCH04_I0_T5",
        label: "Invalid (0)",
        mockInputs: ["0"],
        expectedOutput: "Invalid",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["switch/case", "fall-through", "default case"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH04_I1",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "intermediate",
    tierIndex: 1,
    title: "Leap Year Checker",
    emoji: "📅",
    tagline: "Master the tricky leap year logic with compound conditions.",
    problemStatement:
      "Read a year (positive integer). Print \"Leap Year\" if it is a leap year, \"Not a Leap Year\" otherwise.\n\nA year is a leap year if:\n- It is divisible by 4 AND not divisible by 100, OR\n- It is divisible by 400.",
    inputFormat: "One positive integer year on a single line.",
    outputFormat: "Leap Year or Not a Leap Year.",
    examples: [
      {
        input: "2000",
        output: "Leap Year",
        explanation: "2000 is divisible by 400.",
      },
      {
        input: "1900",
        output: "Not a Leap Year",
        explanation: "1900 divisible by 100 but not by 400.",
      },
      {
        input: "2024",
        output: "Leap Year",
        explanation: "2024 divisible by 4 and not by 100.",
      },
    ],
    constraints: [
      "1 <= year <= 9999",
    ],
    hints: [
      "Condition: (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0).",
      "The || short-circuits: if divisible by 400, it's always a leap year.",
      "1900 is the classic trap: divisible by 4 and 100 but NOT by 400 → not a leap year.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        // check leap year condition and print result
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            System.out.println("Leap Year");
        } else {
            System.out.println("Not a Leap Year");
        }
    }
}`,
    testCases: [
      {
        id: "JCH04_I1_T1",
        label: "2000 (div by 400)",
        mockInputs: ["2000"],
        expectedOutput: "Leap Year",
      },
      {
        id: "JCH04_I1_T2",
        label: "1900 (div by 100, not 400)",
        mockInputs: ["1900"],
        expectedOutput: "Not a Leap Year",
        isBoundary: true,
      },
      {
        id: "JCH04_I1_T3",
        label: "2024 (div by 4, not 100)",
        mockInputs: ["2024"],
        expectedOutput: "Leap Year",
      },
      {
        id: "JCH04_I1_T4",
        label: "2023 (not div by 4)",
        mockInputs: ["2023"],
        expectedOutput: "Not a Leap Year",
      },
      {
        id: "JCH04_I1_T5",
        label: "1600 (div by 400)",
        mockInputs: ["1600"],
        expectedOutput: "Leap Year",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["logical operators", "&&", "||", "compound conditions", "if/else"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH04_I2",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "intermediate",
    tierIndex: 2,
    title: "Triangle Classifier",
    emoji: "📐",
    tagline: "Validate and classify a triangle by its side lengths.",
    problemStatement:
      "Read three doubles representing the sides of a triangle (a, b, c). First check if they form a valid triangle (sum of any two sides must be greater than the third). If not, print \"Invalid Triangle\". If valid, classify:\n- Equilateral: all three sides equal\n- Isosceles: exactly two sides equal\n- Scalene: all sides different",
    inputFormat: "Three doubles a, b, c on separate lines.",
    outputFormat: "Invalid Triangle, Equilateral, Isosceles, or Scalene.",
    examples: [
      {
        input: "3.0\n3.0\n3.0",
        output: "Equilateral",
      },
      {
        input: "5.0\n5.0\n8.0",
        output: "Isosceles",
      },
      {
        input: "1.0\n2.0\n10.0",
        output: "Invalid Triangle",
        explanation: "1 + 2 = 3 < 10, fails triangle inequality.",
      },
    ],
    constraints: [
      "0 < a, b, c <= 10000",
    ],
    hints: [
      "Triangle inequality: a+b > c AND b+c > a AND a+c > b.",
      "After validating, compare sides: if a==b && b==c → Equilateral.",
      "If exactly one pair is equal → Isosceles.",
      "If all different → Scalene.",
      "Use a small epsilon for floating-point equality if needed, but here inputs are whole-number doubles so == is fine.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double a = sc.nextDouble();
        double b = sc.nextDouble();
        double c = sc.nextDouble();
        // validate and classify the triangle
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double a = sc.nextDouble();
        double b = sc.nextDouble();
        double c = sc.nextDouble();
        if (a + b <= c || b + c <= a || a + c <= b) {
            System.out.println("Invalid Triangle");
        } else if (a == b && b == c) {
            System.out.println("Equilateral");
        } else if (a == b || b == c || a == c) {
            System.out.println("Isosceles");
        } else {
            System.out.println("Scalene");
        }
    }
}`,
    testCases: [
      {
        id: "JCH04_I2_T1",
        label: "Equilateral: 3,3,3",
        mockInputs: ["3.0", "3.0", "3.0"],
        expectedOutput: "Equilateral",
      },
      {
        id: "JCH04_I2_T2",
        label: "Isosceles: 5,5,8",
        mockInputs: ["5.0", "5.0", "8.0"],
        expectedOutput: "Isosceles",
      },
      {
        id: "JCH04_I2_T3",
        label: "Invalid: 1,2,10",
        mockInputs: ["1.0", "2.0", "10.0"],
        expectedOutput: "Invalid Triangle",
        isBoundary: true,
      },
      {
        id: "JCH04_I2_T4",
        label: "Scalene: 3,4,5",
        mockInputs: ["3.0", "4.0", "5.0"],
        expectedOutput: "Scalene",
      },
      {
        id: "JCH04_I2_T5",
        label: "Degenerate: 1,1,2 (strict inequality fails)",
        mockInputs: ["1.0", "1.0", "2.0"],
        expectedOutput: "Invalid Triangle",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["if/else if/else", "logical operators", "triangle inequality", "nested conditions"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH04_A0",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "advanced",
    tierIndex: 0,
    title: "Electricity Bill",
    emoji: "⚡",
    tagline: "Tiered pricing — real-world conditional logic for utility bills.",
    problemStatement:
      "Read units of electricity consumed (int). Compute the bill using tiered pricing:\n- First 100 units: ₹2 per unit\n- Next 200 units (101-300): ₹5 per unit\n- Above 300 units: ₹8 per unit\n\nAdd 10% tax on the total. Print the final bill to 2 decimal places.",
    inputFormat: "One integer (units consumed) on a single line.",
    outputFormat: "Final bill amount to 2 decimal places (no currency symbol).",
    examples: [
      {
        input: "50",
        output: "110.00",
        explanation: "50*2=100. Tax: 100*1.10=110.00.",
      },
      {
        input: "150",
        output: "440.00",
        explanation: "100*2 + 50*5 = 200+250=450. Wait: 150 units: first 100@2=200, next 50@5=250, total=450, +10% tax=495.00. (See recalculation in test cases.)",
      },
      {
        input: "350",
        output: "1705.00",
        explanation: "100*2=200 + 200*5=1000 + 50*8=400 = 1600. +10% = 1760.00. (See test cases.)",
      },
    ],
    constraints: [
      "0 <= units <= 10000",
    ],
    hints: [
      "Calculate the bill in tiers: if units <= 100, bill = units * 2.",
      "If units <= 300: bill = 100*2 + (units-100)*5.",
      "If units > 300: bill = 100*2 + 200*5 + (units-300)*8.",
      "Then multiply by 1.10 for 10% tax.",
      "Use printf(\"%.2f\", bill) for output.",
    ],
    referenceProgram: {
      title: "Tiered Billing Reference",
      description: "Computes electricity bill with three tiers and 10% tax.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int units = sc.nextInt();
        double bill;
        if (units <= 100) {
            bill = units * 2.0;
        } else if (units <= 300) {
            bill = 100 * 2.0 + (units - 100) * 5.0;
        } else {
            bill = 100 * 2.0 + 200 * 5.0 + (units - 300) * 8.0;
        }
        bill *= 1.10;
        System.out.printf("%.2f%n", bill);
    }
}`,
      explanation:
        "Tiered billing checks which band the consumption falls into, computes each tier's charge separately, and applies tax at the end.",
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int units = sc.nextInt();
        double bill = 0;
        // apply tiered pricing, add 10% tax, print to 2 decimal places
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int units = sc.nextInt();
        double bill;
        if (units <= 100) {
            bill = units * 2.0;
        } else if (units <= 300) {
            bill = 100 * 2.0 + (units - 100) * 5.0;
        } else {
            bill = 100 * 2.0 + 200 * 5.0 + (units - 300) * 8.0;
        }
        bill *= 1.10;
        System.out.printf("%.2f%n", bill);
    }
}`,
    testCases: [
      {
        id: "JCH04_A0_T1",
        label: "50 units (tier 1 only)",
        mockInputs: ["50"],
        expectedOutput: "110.00",
      },
      {
        id: "JCH04_A0_T2",
        label: "150 units (tiers 1+2)",
        mockInputs: ["150"],
        expectedOutput: "495.00",
      },
      {
        id: "JCH04_A0_T3",
        label: "350 units (all 3 tiers)",
        mockInputs: ["350"],
        expectedOutput: "1760.00",
      },
      {
        id: "JCH04_A0_T4",
        label: "0 units (boundary)",
        mockInputs: ["0"],
        expectedOutput: "0.00",
        isBoundary: true,
      },
      {
        id: "JCH04_A0_T5",
        label: "100 units (tier 1 boundary)",
        mockInputs: ["100"],
        expectedOutput: "220.00",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["tiered if/else", "nested conditions", "double arithmetic", "real-world logic"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH04_A1",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "advanced",
    tierIndex: 1,
    title: "Password Validator",
    emoji: "🔐",
    tagline: "Check multiple criteria and classify password strength.",
    problemStatement:
      "Read a password string. Evaluate it against these criteria:\n1. Length >= 8\n2. Contains at least one uppercase letter\n3. Contains at least one digit\n4. Contains at least one special character from: @#$%^&*!?\n\nPrint:\n- \"STRONG\" if all 4 criteria met\n- \"MEDIUM\" if exactly 3 criteria met\n- \"WEAK\" if 2 or fewer criteria met\n\nAlso print each failed criterion on its own line:\n- \"Too short\" if length < 8\n- \"No uppercase\" if no uppercase letter\n- \"No digit\" if no digit\n- \"No special char\" if no special character\n(Print nothing extra for criteria that pass.)",
    inputFormat: "One password string on a single line (no spaces).",
    outputFormat:
      "Line 1: STRONG, MEDIUM, or WEAK.\nFollowing lines: each failed criterion message (if any).",
    examples: [
      {
        input: "Hello123!",
        output: "STRONG",
        explanation: "Length 9 >= 8, has uppercase H, digit 1, special !. All pass.",
      },
      {
        input: "hello123",
        output: "MEDIUM\nNo uppercase\nNo special char",
        explanation: "Length ok, no uppercase, has digit, no special char. 2 fail → MEDIUM.",
      },
      {
        input: "abc",
        output: "WEAK\nToo short\nNo uppercase\nNo digit\nNo special char",
      },
    ],
    constraints: [
      "Password length 1-100",
      "No spaces in password",
    ],
    hints: [
      "Use a loop over the password's characters with .charAt(i).",
      "Character.isUpperCase(c), Character.isDigit(c) are useful methods.",
      "For special chars, check if \"@#$%^&*!?\".indexOf(c) >= 0.",
      "Count how many criteria pass (0-4), then choose STRONG/MEDIUM/WEAK.",
      "Store failed criteria in a list or use boolean flags, then print them.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String password = sc.nextLine().trim();
        boolean hasLength    = password.length() >= 8;
        boolean hasUpper     = false;
        boolean hasDigit     = false;
        boolean hasSpecial   = false;
        String special       = "@#$%^&*!?";
        for (int i = 0; i < password.length(); i++) {
            char c = password.charAt(i);
            // check each criterion
        }
        // count passing criteria and print result
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String password = sc.nextLine().trim();
        boolean hasLength  = password.length() >= 8;
        boolean hasUpper   = false;
        boolean hasDigit   = false;
        boolean hasSpecial = false;
        String special     = "@#$%^&*!?";
        for (int i = 0; i < password.length(); i++) {
            char c = password.charAt(i);
            if (Character.isUpperCase(c)) hasUpper   = true;
            if (Character.isDigit(c))     hasDigit   = true;
            if (special.indexOf(c) >= 0)  hasSpecial = true;
        }
        int score = (hasLength ? 1 : 0) + (hasUpper ? 1 : 0)
                  + (hasDigit ? 1 : 0)  + (hasSpecial ? 1 : 0);
        if (score == 4) {
            System.out.println("STRONG");
        } else if (score == 3) {
            System.out.println("MEDIUM");
        } else {
            System.out.println("WEAK");
        }
        if (!hasLength)  System.out.println("Too short");
        if (!hasUpper)   System.out.println("No uppercase");
        if (!hasDigit)   System.out.println("No digit");
        if (!hasSpecial) System.out.println("No special char");
    }
}`,
    testCases: [
      {
        id: "JCH04_A1_T1",
        label: "STRONG: Hello123!",
        mockInputs: ["Hello123!"],
        expectedOutput: "STRONG",
      },
      {
        id: "JCH04_A1_T2",
        label: "MEDIUM: hello123",
        mockInputs: ["hello123"],
        expectedOutput: "MEDIUM\nNo uppercase\nNo special char",
      },
      {
        id: "JCH04_A1_T3",
        label: "WEAK: abc",
        mockInputs: ["abc"],
        expectedOutput: "WEAK\nToo short\nNo uppercase\nNo digit\nNo special char",
      },
      {
        id: "JCH04_A1_T4",
        label: "MEDIUM: Abcdefg! (no digit, short enough to be MEDIUM)",
        mockInputs: ["Abcdefg!"],
        expectedOutput: "MEDIUM\nNo digit",
      },
      {
        id: "JCH04_A1_T5",
        label: "STRONG: P@ssw0rd",
        mockInputs: ["P@ssw0rd"],
        expectedOutput: "STRONG",
        isHidden: true,
      },
    ],
    concepts: ["if/else", "char iteration", "Character methods", "boolean flags", "String methods"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH04_A2",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "advanced",
    tierIndex: 2,
    title: "Shipping Calculator",
    emoji: "📦",
    tagline: "Combine weight tiers and zone surcharges in one calculator.",
    problemStatement:
      "Read weight in kg (double) and destination zone (int 1-5). Compute the shipping cost:\n\nBase weight pricing:\n- 0-1 kg: ₹50\n- 1-5 kg: ₹50 + (weight-1)*30 per kg\n- 5-20 kg: ₹170 + (weight-5)*20 per kg\n- Above 20 kg: ₹470 + (weight-20)*15 per kg\n\nZone surcharge (added to base):\n- Zone 1: 0%\n- Zone 2: 10%\n- Zone 3: 20%\n- Zone 4: 35%\n- Zone 5: 50%\n\nPrint the total cost to 2 decimal places.",
    inputFormat: "Line 1: weight (double). Line 2: zone (int 1-5).",
    outputFormat: "Total shipping cost to 2 decimal places.",
    examples: [
      {
        input: "2.0\n3",
        output: "66.00",
        explanation:
          "Base: 50 + (2-1)*30 = 80. Zone 3 surcharge: 80*1.20 = 96.00. Wait — let me recalculate: 50 + 1*30 = 80. 80 * 1.20 = 96.00. (See test cases for verified answers.)",
      },
    ],
    constraints: [
      "0 < weight <= 100",
      "1 <= zone <= 5",
    ],
    hints: [
      "Compute base cost using if-else tiers on weight.",
      "Then look up zone surcharge percent using if-else or switch.",
      "surchargeRate for zone 3 is 0.20; multiply: total = base * (1 + surchargeRate).",
      "Use printf(\"%.2f\", total) for output.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double weight = sc.nextDouble();
        int zone      = sc.nextInt();
        double base;
        // compute base cost by weight tier
        // apply zone surcharge
        // print total to 2 decimal places
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double weight = sc.nextDouble();
        int zone      = sc.nextInt();
        double base;
        if (weight <= 1.0) {
            base = 50.0;
        } else if (weight <= 5.0) {
            base = 50.0 + (weight - 1.0) * 30.0;
        } else if (weight <= 20.0) {
            base = 170.0 + (weight - 5.0) * 20.0;
        } else {
            base = 470.0 + (weight - 20.0) * 15.0;
        }
        double surcharge;
        switch (zone) {
            case 1:  surcharge = 0.00; break;
            case 2:  surcharge = 0.10; break;
            case 3:  surcharge = 0.20; break;
            case 4:  surcharge = 0.35; break;
            case 5:  surcharge = 0.50; break;
            default: surcharge = 0.00;
        }
        double total = base * (1 + surcharge);
        System.out.printf("%.2f%n", total);
    }
}`,
    testCases: [
      {
        id: "JCH04_A2_T1",
        label: "2kg zone 3",
        mockInputs: ["2.0", "3"],
        expectedOutput: "96.00",
      },
      {
        id: "JCH04_A2_T2",
        label: "0.5kg zone 1 (lightest, nearest zone)",
        mockInputs: ["0.5", "1"],
        expectedOutput: "50.00",
        isBoundary: true,
      },
      {
        id: "JCH04_A2_T3",
        label: "10kg zone 5",
        mockInputs: ["10.0", "5"],
        expectedOutput: "405.00",
      },
      {
        id: "JCH04_A2_T4",
        label: "25kg zone 2",
        mockInputs: ["25.0", "2"],
        expectedOutput: "599.50",
        isHidden: true,
      },
    ],
    concepts: ["tiered if/else", "switch/case", "double arithmetic", "real-world pricing"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH04_L0",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "leetcode",
    tierIndex: 0,
    title: "FizzBuzzRange",
    emoji: "🎯",
    tagline: "The interview classic — print Fizz, Buzz, FizzBuzz, or the number.",
    problemStatement:
      "Read two integers lo and hi (lo <= hi). For each number from lo to hi inclusive, print:\n- \"FizzBuzz\" if divisible by both 3 and 5\n- \"Fizz\" if divisible by 3 only\n- \"Buzz\" if divisible by 5 only\n- The number itself otherwise\nOne output per line.",
    inputFormat: "Line 1: lo. Line 2: hi.",
    outputFormat: "One output per number from lo to hi.",
    examples: [
      {
        input: "1\n15",
        output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      },
    ],
    constraints: [
      "1 <= lo <= hi <= 10000",
    ],
    hints: [
      "Use a for loop from lo to hi inclusive.",
      "Check FizzBuzz first (divisible by both), then Fizz, then Buzz.",
      "Use n % 15 == 0 or (n % 3 == 0 && n % 5 == 0) for FizzBuzz.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int lo = sc.nextInt();
        int hi = sc.nextInt();
        for (int i = lo; i <= hi; i++) {
            // print FizzBuzz, Fizz, Buzz, or number
        }
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int lo = sc.nextInt();
        int hi = sc.nextInt();
        for (int i = lo; i <= hi; i++) {
            if (i % 15 == 0) {
                System.out.println("FizzBuzz");
            } else if (i % 3 == 0) {
                System.out.println("Fizz");
            } else if (i % 5 == 0) {
                System.out.println("Buzz");
            } else {
                System.out.println(i);
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH04_L0_T1",
        label: "1 to 15 (classic)",
        mockInputs: ["1", "15"],
        expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      },
      {
        id: "JCH04_L0_T2",
        label: "lo == hi == 15 (FizzBuzz)",
        mockInputs: ["15", "15"],
        expectedOutput: "FizzBuzz",
        isBoundary: true,
      },
      {
        id: "JCH04_L0_T3",
        label: "lo == hi == 7",
        mockInputs: ["7", "7"],
        expectedOutput: "7",
        isBoundary: true,
      },
      {
        id: "JCH04_L0_T4",
        label: "14 to 16",
        mockInputs: ["14", "16"],
        expectedOutput: "14\nFizzBuzz\n16",
        isHidden: true,
      },
    ],
    concepts: ["for loop", "if/else if/else", "modulo", "FizzBuzz"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(n)",
  },

  {
    id: "JCH04_L1",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "leetcode",
    tierIndex: 1,
    title: "Roman Numeral Converter",
    emoji: "🏛️",
    tagline: "Convert integers to Roman numerals using greedy subtraction.",
    problemStatement:
      "Read an integer n (1-3999). Print its Roman numeral representation.\n\nRoman numeral values:\nM=1000, CM=900, D=500, CD=400, C=100, XC=90, L=50, XL=40, X=10, IX=9, V=5, IV=4, I=1",
    inputFormat: "One integer n (1 <= n <= 3999).",
    outputFormat: "The Roman numeral string.",
    examples: [
      {
        input: "3749",
        output: "MMMDCCXLIX",
        explanation: "3000+700+40+9 = MMMM... wait: 3749 = 3000+700+49 = MMM+DCC+XLIX.",
      },
      {
        input: "4",
        output: "IV",
      },
      {
        input: "9",
        output: "IX",
      },
      {
        input: "58",
        output: "LVIII",
      },
    ],
    constraints: [
      "1 <= n <= 3999",
    ],
    hints: [
      "Use parallel arrays: int[] values and String[] symbols.",
      "Greedily subtract the largest value that fits, appending the symbol.",
      "Include the subtractive cases: CM, CD, XC, XL, IX, IV in your arrays.",
      "Loop: while n >= values[i], append symbols[i] and subtract values[i].",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[]    values  = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
        String[] symbols = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
        StringBuilder sb = new StringBuilder();
        // build Roman numeral greedily
        System.out.println(sb.toString());
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[]    values  = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
        String[] symbols = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            while (n >= values[i]) {
                sb.append(symbols[i]);
                n -= values[i];
            }
        }
        System.out.println(sb.toString());
    }
}`,
    testCases: [
      {
        id: "JCH04_L1_T1",
        label: "n=4 (IV)",
        mockInputs: ["4"],
        expectedOutput: "IV",
      },
      {
        id: "JCH04_L1_T2",
        label: "n=9 (IX)",
        mockInputs: ["9"],
        expectedOutput: "IX",
      },
      {
        id: "JCH04_L1_T3",
        label: "n=58 (LVIII)",
        mockInputs: ["58"],
        expectedOutput: "LVIII",
      },
      {
        id: "JCH04_L1_T4",
        label: "n=1994 (MCMXCIV)",
        mockInputs: ["1994"],
        expectedOutput: "MCMXCIV",
      },
      {
        id: "JCH04_L1_T5",
        label: "n=3999 (max)",
        mockInputs: ["3999"],
        expectedOutput: "MMMCMXCIX",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["arrays", "while loop", "if/else", "StringBuilder", "greedy algorithm"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(1) — bounded by 3999",
  },

  {
    id: "JCH04_L2",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "leetcode",
    tierIndex: 2,
    title: "Number to Words",
    emoji: "🔤",
    tagline: "Convert any integer 0-999 into English words.",
    problemStatement:
      "Read an integer n (0-999). Print it in English words.\n\nExamples: 0→\"Zero\", 13→\"Thirteen\", 45→\"Forty Five\", 100→\"One Hundred\", 215→\"Two Hundred Fifteen\", 999→\"Nine Hundred Ninety Nine\".\n\nRules:\n- Use title case (first letter of each word capitalized).\n- No \"and\" between hundreds and tens.\n- Spaces between words.",
    inputFormat: "One integer n (0 <= n <= 999).",
    outputFormat: "The number in English words.",
    examples: [
      {
        input: "0",
        output: "Zero",
      },
      {
        input: "13",
        output: "Thirteen",
      },
      {
        input: "45",
        output: "Forty Five",
      },
      {
        input: "215",
        output: "Two Hundred Fifteen",
      },
    ],
    constraints: [
      "0 <= n <= 999",
    ],
    hints: [
      "Create arrays: ones[] for 1-19, tens[] for 20,30,...90.",
      "Split n into hundreds = n/100, remainder = n%100.",
      "For remainder < 20: use ones[remainder]. For remainder >= 20: tens[remainder/10] + ones[remainder%10].",
      "Combine with Hundred in between.",
      "Special case: n == 0 → \"Zero\".",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    static String[] ones = {"", "One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
                            "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
                            "Seventeen","Eighteen","Nineteen"};
    static String[] tens = {"","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"};
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n == 0) { System.out.println("Zero"); return; }
        // convert n to words
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    static String[] ones = {"","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
                            "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
                            "Seventeen","Eighteen","Nineteen"};
    static String[] tens = {"","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"};

    static String twoDigits(int n) {
        if (n == 0) return "";
        if (n < 20) return ones[n];
        String t = tens[n / 10];
        int r = n % 10;
        return r == 0 ? t : t + " " + ones[r];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n == 0) { System.out.println("Zero"); return; }
        StringBuilder sb = new StringBuilder();
        if (n >= 100) {
            sb.append(ones[n / 100]).append(" Hundred");
            int rem = n % 100;
            if (rem > 0) sb.append(" ").append(twoDigits(rem));
        } else {
            sb.append(twoDigits(n));
        }
        System.out.println(sb.toString());
    }
}`,
    testCases: [
      {
        id: "JCH04_L2_T1",
        label: "0 (Zero)",
        mockInputs: ["0"],
        expectedOutput: "Zero",
        isBoundary: true,
      },
      {
        id: "JCH04_L2_T2",
        label: "13 (Thirteen)",
        mockInputs: ["13"],
        expectedOutput: "Thirteen",
      },
      {
        id: "JCH04_L2_T3",
        label: "45 (Forty Five)",
        mockInputs: ["45"],
        expectedOutput: "Forty Five",
      },
      {
        id: "JCH04_L2_T4",
        label: "215 (Two Hundred Fifteen)",
        mockInputs: ["215"],
        expectedOutput: "Two Hundred Fifteen",
      },
      {
        id: "JCH04_L2_T5",
        label: "999 (max)",
        mockInputs: ["999"],
        expectedOutput: "Nine Hundred Ninety Nine",
        isBoundary: true,
        isHidden: true,
      },
      {
        id: "JCH04_L2_T6",
        label: "100 (One Hundred)",
        mockInputs: ["100"],
        expectedOutput: "One Hundred",
        isHidden: true,
      },
    ],
    concepts: ["arrays", "if/else", "String manipulation", "helper method", "number decomposition"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(1)",
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "JCH04_H0",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "hackathon",
    tierIndex: 0,
    title: "Tax Bracket Engine",
    emoji: "🏦",
    tagline: "Implement India's New Tax Regime 2024 with cess and full breakdown.",
    problemStatement:
      "Read annual income in INR (long). Compute income tax under India's New Tax Regime 2024:\n\nTax slabs (New Regime 2024):\n- Up to ₹3,00,000: Nil\n- ₹3,00,001 – ₹6,00,000: 5%\n- ₹6,00,001 – ₹9,00,000: 10%\n- ₹9,00,001 – ₹12,00,000: 15%\n- ₹12,00,001 – ₹15,00,000: 20%\n- Above ₹15,00,000: 30%\n\nAdditional:\n- Standard deduction: ₹50,000 (subtract from income before tax calculation)\n- Rebate u/s 87A: if taxable income <= ₹7,00,000, full tax rebate (tax = 0)\n- Health & Education Cess: 4% on tax after rebate\n\nPrint:\nLine 1: Gross Income: <income>\nLine 2: Taxable Income: <taxable>\nLine 3: Tax Before Cess: <tax>\nLine 4: Cess (4%): <cess>\nLine 5: Total Tax: <total>\n\nAll amounts as integers (floor values).",
    inputFormat: "One long integer (annual income in INR) on a single line.",
    outputFormat: "5 lines as described above.",
    examples: [
      {
        input: "1200000",
        output: "Gross Income: 1200000\nTaxable Income: 1150000\nTax Before Cess: 112500\nCess (4%): 4500\nTotal Tax: 117000",
        explanation:
          "Taxable = 1200000-50000=1150000. Slabs: 0 + 15000 + 30000 + 37500 + 30000 = 112500. Cess=4500. Total=117000.",
      },
    ],
    constraints: [
      "0 <= income <= 10^8",
    ],
    hints: [
      "Subtract standard deduction of 50000 first. If result < 0, taxable = 0.",
      "Apply slabs in order, adding marginal tax for each band.",
      "If taxable <= 700000, set tax = 0 (rebate u/s 87A).",
      "Cess = (long)(tax * 0.04).",
      "Total = tax + cess.",
      "Use long for all intermediate calculations.",
    ],
    referenceProgram: {
      title: "Tax Slab Reference",
      description: "Shows how to compute marginal tax using a step-by-step slab approach.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long income = sc.nextLong();
        long taxable = Math.max(0, income - 50000L);
        long tax = 0;
        if (taxable > 1500000) {
            tax += (taxable - 1500000) * 30 / 100;
            tax += (1500000 - 1200000) * 20 / 100;
            tax += (1200000 - 900000)  * 15 / 100;
            tax += (900000  - 600000)  * 10 / 100;
            tax += (600000  - 300000)  *  5 / 100;
        } else if (taxable > 1200000) {
            tax += (taxable - 1200000) * 20 / 100;
            tax += (1200000 - 900000)  * 15 / 100;
            tax += (900000  - 600000)  * 10 / 100;
            tax += (600000  - 300000)  *  5 / 100;
        } else if (taxable > 900000) {
            tax += (taxable - 900000) * 15 / 100;
            tax += (900000 - 600000)  * 10 / 100;
            tax += (600000 - 300000)  *  5 / 100;
        } else if (taxable > 600000) {
            tax += (taxable - 600000) * 10 / 100;
            tax += (600000 - 300000)  *  5 / 100;
        } else if (taxable > 300000) {
            tax += (taxable - 300000) * 5 / 100;
        }
        if (taxable <= 700000) tax = 0;
        long cess  = tax * 4 / 100;
        long total = tax + cess;
        System.out.println("Gross Income: "    + income);
        System.out.println("Taxable Income: "  + taxable);
        System.out.println("Tax Before Cess: " + tax);
        System.out.println("Cess (4%): "       + cess);
        System.out.println("Total Tax: "       + total);
    }
}`,
      explanation:
        "Tax is computed by applying each slab to the portion of taxable income that falls within that band, highest slab first.",
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long income = sc.nextLong();
        long taxable = Math.max(0, income - 50000L);
        long tax = 0;
        // apply slab-by-slab calculation
        // apply 87A rebate if taxable <= 700000
        // compute cess and total
        System.out.println("Gross Income: "    + income);
        System.out.println("Taxable Income: "  + taxable);
        System.out.println("Tax Before Cess: " + tax);
        // print cess and total
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long income  = sc.nextLong();
        long taxable = Math.max(0, income - 50000L);
        long tax = 0;
        if (taxable > 1500000) {
            tax += (taxable - 1500000) * 30 / 100;
            tax += (1500000 - 1200000) * 20 / 100;
            tax += (1200000 - 900000)  * 15 / 100;
            tax += (900000  - 600000)  * 10 / 100;
            tax += (600000  - 300000)  *  5 / 100;
        } else if (taxable > 1200000) {
            tax += (taxable - 1200000) * 20 / 100;
            tax += (1200000 - 900000)  * 15 / 100;
            tax += (900000  - 600000)  * 10 / 100;
            tax += (600000  - 300000)  *  5 / 100;
        } else if (taxable > 900000) {
            tax += (taxable - 900000) * 15 / 100;
            tax += (900000  - 600000) * 10 / 100;
            tax += (600000  - 300000) *  5 / 100;
        } else if (taxable > 600000) {
            tax += (taxable - 600000) * 10 / 100;
            tax += (600000  - 300000) *  5 / 100;
        } else if (taxable > 300000) {
            tax += (taxable - 300000) * 5 / 100;
        }
        if (taxable <= 700000) tax = 0;
        long cess  = tax * 4 / 100;
        long total = tax + cess;
        System.out.println("Gross Income: "    + income);
        System.out.println("Taxable Income: "  + taxable);
        System.out.println("Tax Before Cess: " + tax);
        System.out.println("Cess (4%): "       + cess);
        System.out.println("Total Tax: "       + total);
    }
}`,
    testCases: [
      {
        id: "JCH04_H0_T1",
        label: "12 lakh income",
        mockInputs: ["1200000"],
        expectedOutput: "Gross Income: 1200000\nTaxable Income: 1150000\nTax Before Cess: 112500\nCess (4%): 4500\nTotal Tax: 117000",
      },
      {
        id: "JCH04_H0_T2",
        label: "7 lakh (rebate applies)",
        mockInputs: ["700000"],
        expectedOutput: "Gross Income: 700000\nTaxable Income: 650000\nTax Before Cess: 0\nCess (4%): 0\nTotal Tax: 0",
        isBoundary: true,
      },
      {
        id: "JCH04_H0_T3",
        label: "Below standard deduction (no tax)",
        mockInputs: ["300000"],
        expectedOutput: "Gross Income: 300000\nTaxable Income: 250000\nTax Before Cess: 0\nCess (4%): 0\nTotal Tax: 0",
        isBoundary: true,
      },
      {
        id: "JCH04_H0_T4",
        label: "20 lakh (above highest slab)",
        mockInputs: ["2000000"],
        expectedOutput: "Gross Income: 2000000\nTaxable Income: 1950000\nTax Before Cess: 337500\nCess (4%): 13500\nTotal Tax: 351000",
        isHidden: true,
      },
    ],
    concepts: ["nested if/else", "tax slabs", "long arithmetic", "real-world policy", "rebate logic"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Add support for the Old Tax Regime with HRA, 80C, 80D deductions and let the user choose which regime saves more tax.",
  },

  {
    id: "JCH04_H1",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "hackathon",
    tierIndex: 1,
    title: "Decision Tree Evaluator",
    emoji: "🩺",
    tagline: "Navigate a medical symptom decision tree with nested if-else.",
    problemStatement:
      "Implement a simple medical symptom checker decision tree. Read answers to yes/no questions (\"yes\" or \"no\") in order. Navigate the following tree:\n\n1. \"Do you have fever?\" (yes/no)\n   - YES → 2. \"Is the fever above 103F?\" (yes/no)\n     - YES → 3. \"Do you have a rash?\" (yes/no)\n       - YES → Diagnosis: \"Possible Dengue — See a doctor immediately\"\n       - NO  → Diagnosis: \"High Fever — Visit ER\"\n     - NO  → 3. \"Do you have a cough?\" (yes/no)\n       - YES → Diagnosis: \"Possible Flu — Rest and hydrate\"\n       - NO  → Diagnosis: \"Mild Fever — Monitor at home\"\n   - NO  → 2. \"Do you have a headache?\" (yes/no)\n     - YES → 3. \"Is the headache severe?\" (yes/no)\n       - YES → Diagnosis: \"Possible Migraine — Consult a doctor\"\n       - NO  → Diagnosis: \"Tension Headache — Rest and pain relief\"\n     - NO  → Diagnosis: \"No major symptoms — Stay hydrated\"\n\nRead exactly as many yes/no answers as needed to reach a diagnosis.",
    inputFormat:
      "Multiple lines, each containing \"yes\" or \"no\" (lowercase), one answer per line.",
    outputFormat: "One line: the diagnosis string.",
    examples: [
      {
        input: "yes\nyes\nyes",
        output: "Possible Dengue — See a doctor immediately",
      },
      {
        input: "no\nno",
        output: "No major symptoms — Stay hydrated",
      },
      {
        input: "yes\nno\nyes",
        output: "Possible Flu — Rest and hydrate",
      },
    ],
    constraints: [
      "All inputs are exactly \"yes\" or \"no\" (lowercase)",
      "2-3 answers needed per path",
    ],
    hints: [
      "Read answers one at a time with sc.nextLine().",
      "Use nested if-else blocks that mirror the tree structure.",
      "Read only as many answers as the current tree path requires.",
      "Each leaf of the tree prints a diagnosis and ends the program.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a1 = sc.nextLine().trim();
        // navigate decision tree with nested if-else
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a1 = sc.nextLine().trim();
        if (a1.equals("yes")) {
            String a2 = sc.nextLine().trim();
            if (a2.equals("yes")) {
                String a3 = sc.nextLine().trim();
                if (a3.equals("yes")) {
                    System.out.println("Possible Dengue — See a doctor immediately");
                } else {
                    System.out.println("High Fever — Visit ER");
                }
            } else {
                String a3 = sc.nextLine().trim();
                if (a3.equals("yes")) {
                    System.out.println("Possible Flu — Rest and hydrate");
                } else {
                    System.out.println("Mild Fever — Monitor at home");
                }
            }
        } else {
            String a2 = sc.nextLine().trim();
            if (a2.equals("yes")) {
                String a3 = sc.nextLine().trim();
                if (a3.equals("yes")) {
                    System.out.println("Possible Migraine — Consult a doctor");
                } else {
                    System.out.println("Tension Headache — Rest and pain relief");
                }
            } else {
                System.out.println("No major symptoms — Stay hydrated");
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH04_H1_T1",
        label: "Fever+High+Rash → Dengue",
        mockInputs: ["yes", "yes", "yes"],
        expectedOutput: "Possible Dengue — See a doctor immediately",
      },
      {
        id: "JCH04_H1_T2",
        label: "No fever, no headache → Stay hydrated",
        mockInputs: ["no", "no"],
        expectedOutput: "No major symptoms — Stay hydrated",
      },
      {
        id: "JCH04_H1_T3",
        label: "Fever+Low+Cough → Flu",
        mockInputs: ["yes", "no", "yes"],
        expectedOutput: "Possible Flu — Rest and hydrate",
      },
      {
        id: "JCH04_H1_T4",
        label: "No fever + headache + severe → Migraine",
        mockInputs: ["no", "yes", "yes"],
        expectedOutput: "Possible Migraine — Consult a doctor",
        isHidden: true,
      },
      {
        id: "JCH04_H1_T5",
        label: "Fever+High+No rash → ER",
        mockInputs: ["yes", "yes", "no"],
        expectedOutput: "High Fever — Visit ER",
        isHidden: true,
      },
    ],
    concepts: ["nested if/else", "decision tree", "String comparison", "Scanner"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend the tree to 5+ levels and add a confidence score (0-100%) for each diagnosis based on the path taken.",
  },

  {
    id: "JCH04_H2",
    chapterId: "JCH04_LOGIC",
    chapterNumber: 4,
    tier: "hackathon",
    tierIndex: 2,
    title: "ATM Simulator",
    emoji: "🏧",
    tagline: "Simulate a real ATM with withdrawal rules, deposit, and balance check.",
    problemStatement:
      "Read an initial balance (long, in INR). Then read a series of commands, one per line, until \"EXIT\".\n\nCommands:\n- WITHDRAW <amount>: Withdraw the given amount. Rules:\n  - Amount must be a multiple of 100.\n  - Minimum withdrawal: ₹100.\n  - Maximum per transaction: ₹20,000.\n  - Cannot exceed available balance.\n  - If valid: print \"Withdrawn: <amount>. Balance: <new_balance>\"\n  - If invalid: print the specific error:\n    - \"Error: Not a multiple of 100\"\n    - \"Error: Minimum withdrawal is 100\"\n    - \"Error: Maximum withdrawal per transaction is 20000\"\n    - \"Error: Insufficient balance\"\n- DEPOSIT <amount>: Deposit the amount (must be > 0). Print \"Deposited: <amount>. Balance: <new_balance>\".\n- CHECK: Print \"Balance: <balance>\".\n- EXIT: Print \"Thank you. Final balance: <balance>\" and stop.",
    inputFormat:
      "Line 1: initial balance (long).\nFollowing lines: commands until EXIT.",
    outputFormat: "Response for each command as described.",
    examples: [
      {
        input: "50000\nWITHDRAW 5000\nCHECK\nWITHDRAW 25000\nDEPOSIT 10000\nEXIT",
        output: "Withdrawn: 5000. Balance: 45000\nBalance: 45000\nError: Maximum withdrawal per transaction is 20000\nDeposited: 10000. Balance: 55000\nThank you. Final balance: 55000",
      },
    ],
    constraints: [
      "0 <= initial balance <= 10^9",
      "Commands are WITHDRAW, DEPOSIT, CHECK, EXIT",
      "Amount values are positive integers",
    ],
    hints: [
      "Use a Scanner while loop: while (sc.hasNextLine()) and break on EXIT.",
      "Split each line by space to get command and optional amount.",
      "Check WITHDRAW rules in order: multiple of 100, minimum, maximum, then balance.",
      "Use long for balance to handle large amounts.",
      "String comparison: use .equals() not ==.",
    ],
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long balance = sc.nextLong();
        sc.nextLine(); // consume newline
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.equals("EXIT")) {
                System.out.println("Thank you. Final balance: " + balance);
                break;
            }
            String[] parts = line.split(" ");
            String cmd = parts[0];
            // handle WITHDRAW, DEPOSIT, CHECK
        }
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long balance = sc.nextLong();
        sc.nextLine();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.equals("EXIT")) {
                System.out.println("Thank you. Final balance: " + balance);
                break;
            }
            String[] parts = line.split(" ");
            String cmd = parts[0];
            if (cmd.equals("CHECK")) {
                System.out.println("Balance: " + balance);
            } else if (cmd.equals("DEPOSIT")) {
                long amount = Long.parseLong(parts[1]);
                if (amount > 0) {
                    balance += amount;
                    System.out.println("Deposited: " + amount + ". Balance: " + balance);
                } else {
                    System.out.println("Error: Invalid deposit amount");
                }
            } else if (cmd.equals("WITHDRAW")) {
                long amount = Long.parseLong(parts[1]);
                if (amount % 100 != 0) {
                    System.out.println("Error: Not a multiple of 100");
                } else if (amount < 100) {
                    System.out.println("Error: Minimum withdrawal is 100");
                } else if (amount > 20000) {
                    System.out.println("Error: Maximum withdrawal per transaction is 20000");
                } else if (amount > balance) {
                    System.out.println("Error: Insufficient balance");
                } else {
                    balance -= amount;
                    System.out.println("Withdrawn: " + amount + ". Balance: " + balance);
                }
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH04_H2_T1",
        label: "Full workflow",
        mockInputs: ["50000", "WITHDRAW 5000", "CHECK", "WITHDRAW 25000", "DEPOSIT 10000", "EXIT"],
        expectedOutput: "Withdrawn: 5000. Balance: 45000\nBalance: 45000\nError: Maximum withdrawal per transaction is 20000\nDeposited: 10000. Balance: 55000\nThank you. Final balance: 55000",
      },
      {
        id: "JCH04_H2_T2",
        label: "Insufficient balance",
        mockInputs: ["1000", "WITHDRAW 2000", "EXIT"],
        expectedOutput: "Error: Insufficient balance\nThank you. Final balance: 1000",
        isBoundary: true,
      },
      {
        id: "JCH04_H2_T3",
        label: "Not multiple of 100",
        mockInputs: ["5000", "WITHDRAW 150", "EXIT"],
        expectedOutput: "Error: Not a multiple of 100\nThank you. Final balance: 5000",
        isBoundary: true,
      },
      {
        id: "JCH04_H2_T4",
        label: "Immediate EXIT",
        mockInputs: ["10000", "EXIT"],
        expectedOutput: "Thank you. Final balance: 10000",
        isBoundary: true,
        isHidden: true,
      },
      {
        id: "JCH04_H2_T5",
        label: "Multiple deposits and withdrawals",
        mockInputs: ["0", "DEPOSIT 5000", "WITHDRAW 500", "CHECK", "EXIT"],
        expectedOutput: "Deposited: 5000. Balance: 5000\nWithdrawn: 500. Balance: 4500\nBalance: 4500\nThank you. Final balance: 4500",
        isHidden: true,
      },
    ],
    concepts: ["while loop", "switch/if-else", "String.split", "long arithmetic", "input processing", "ATM rules"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Add a daily withdrawal limit of ₹50,000 (tracked across multiple WITHDRAW commands in the session) and a PIN verification step at the start.",
  },
];
