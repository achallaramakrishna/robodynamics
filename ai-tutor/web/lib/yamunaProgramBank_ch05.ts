import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH05_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH05_B1",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "beginner",
    tierIndex: 0,
    title: "Countdown Timer",
    emoji: "⏱️",
    tagline: "Count down from N to 1, then blast off!",
    problemStatement:
      "Read a positive integer N. Using a while loop, print the numbers from N down to 1 (each on its own line), then print \"Blast off!\".",
    inputFormat: "A single integer N (1 ≤ N ≤ 100).",
    outputFormat: "N lines each containing one number in descending order, followed by a line containing \"Blast off!\".",
    examples: [
      {
        input: "5",
        output: "5\n4\n3\n2\n1\nBlast off!",
        explanation: "Count 5, 4, 3, 2, 1 then print the launch message.",
      },
      {
        input: "1",
        output: "1\nBlast off!",
      },
    ],
    constraints: ["1 ≤ N ≤ 100"],
    hints: [
      "Declare an int variable equal to N before the loop.",
      "The while condition should keep looping as long as the counter is greater than 0.",
      "Print the counter, then decrement it with counter-- inside the loop.",
      "After the loop ends, use System.out.println(\"Blast off!\");",
    ],
    referenceProgram: {
      title: "While Loop Countdown",
      description: "Classic while loop that decrements a counter each iteration.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int i = n;
        while (i >= 1) {
            System.out.println(i);
            i--;
        }
        System.out.println("Blast off!");
    }
}`,
      explanation: "We initialise i to n, print i each pass, decrement, and exit when i < 1.",
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: use a while loop to count down from n to 1
        // then print "Blast off!"
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int i = n;
        while (i >= 1) {
            System.out.println(i);
            i--;
        }
        System.out.println("Blast off!");
    }
}`,
    testCases: [
      {
        id: "JCH05_B1_T1",
        label: "N = 5",
        mockInputs: ["5"],
        expectedOutput: "5\n4\n3\n2\n1\nBlast off!",
      },
      {
        id: "JCH05_B1_T2",
        label: "N = 3",
        mockInputs: ["3"],
        expectedOutput: "3\n2\n1\nBlast off!",
      },
      {
        id: "JCH05_B1_T3",
        label: "N = 1 (boundary)",
        mockInputs: ["1"],
        expectedOutput: "1\nBlast off!",
        isBoundary: true,
      },
      {
        id: "JCH05_B1_T4",
        label: "N = 10",
        mockInputs: ["10"],
        expectedOutput: "10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nBlast off!",
        isHidden: true,
      },
    ],
    concepts: ["while", "decrement", "Scanner"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH05_B2",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "beginner",
    tierIndex: 1,
    title: "Multiplication Table",
    emoji: "✖️",
    tagline: "Print the full multiplication table for any number.",
    problemStatement:
      "Read an integer N. Print the multiplication table for N from 1×N through 10×N, each on its own line in the format \"i x N = result\".",
    inputFormat: "A single integer N (1 ≤ N ≤ 100).",
    outputFormat: "10 lines, each formatted as \"i x N = result\" for i from 1 to 10.",
    examples: [
      {
        input: "5",
        output:
          "1 x 5 = 5\n2 x 5 = 10\n3 x 5 = 15\n4 x 5 = 20\n5 x 5 = 25\n6 x 5 = 30\n7 x 5 = 35\n8 x 5 = 40\n9 x 5 = 45\n10 x 5 = 50",
        explanation: "Multiply i by 5 for i = 1..10.",
      },
    ],
    constraints: ["1 ≤ N ≤ 100"],
    hints: [
      "Use a for loop: for (int i = 1; i <= 10; i++)",
      "Inside the loop print: i + \" x \" + n + \" = \" + (i * n)",
      "System.out.println automatically adds a newline.",
    ],
    referenceProgram: {
      title: "For Loop Table",
      description: "A standard for loop iterating i from 1 to 10.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= 10; i++) {
            System.out.println(i + " x " + n + " = " + (i * n));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: print multiplication table for n (1 to 10)
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= 10; i++) {
            System.out.println(i + " x " + n + " = " + (i * n));
        }
    }
}`,
    testCases: [
      {
        id: "JCH05_B2_T1",
        label: "N = 5",
        mockInputs: ["5"],
        expectedOutput:
          "1 x 5 = 5\n2 x 5 = 10\n3 x 5 = 15\n4 x 5 = 20\n5 x 5 = 25\n6 x 5 = 30\n7 x 5 = 35\n8 x 5 = 40\n9 x 5 = 45\n10 x 5 = 50",
      },
      {
        id: "JCH05_B2_T2",
        label: "N = 1",
        mockInputs: ["1"],
        expectedOutput:
          "1 x 1 = 1\n2 x 1 = 2\n3 x 1 = 3\n4 x 1 = 4\n5 x 1 = 5\n6 x 1 = 6\n7 x 1 = 7\n8 x 1 = 8\n9 x 1 = 9\n10 x 1 = 10",
        isBoundary: true,
      },
      {
        id: "JCH05_B2_T3",
        label: "N = 12",
        mockInputs: ["12"],
        expectedOutput:
          "1 x 12 = 12\n2 x 12 = 24\n3 x 12 = 36\n4 x 12 = 48\n5 x 12 = 60\n6 x 12 = 72\n7 x 12 = 84\n8 x 12 = 96\n9 x 12 = 108\n10 x 12 = 120",
        isHidden: true,
      },
    ],
    concepts: ["for", "arithmetic", "Scanner"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH05_B3",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "beginner",
    tierIndex: 2,
    title: "Sum of N Numbers",
    emoji: "➕",
    tagline: "Read N integers and find their total using a for loop.",
    problemStatement:
      "Read an integer N, then read N integers. Print their sum.",
    inputFormat:
      "First line: integer N. Next N lines: one integer per line.",
    outputFormat: "A single line containing the sum.",
    examples: [
      {
        input: "4\n10\n20\n30\n40",
        output: "100",
        explanation: "10+20+30+40 = 100.",
      },
      {
        input: "1\n7",
        output: "7",
      },
    ],
    constraints: ["1 ≤ N ≤ 1000", "-10000 ≤ each number ≤ 10000"],
    hints: [
      "Declare int sum = 0; before the loop.",
      "Use a for loop that runs N times: for (int i = 0; i < n; i++)",
      "Inside the loop: sum += sc.nextInt();",
      "After the loop, print sum.",
    ],
    referenceProgram: {
      title: "Accumulator Pattern",
      description: "Standard accumulator pattern with a for loop.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        System.out.println(sum);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        // TODO: read n integers and accumulate their sum
        System.out.println(sum);
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        System.out.println(sum);
    }
}`,
    testCases: [
      {
        id: "JCH05_B3_T1",
        label: "4 numbers",
        mockInputs: ["4", "10", "20", "30", "40"],
        expectedOutput: "100",
      },
      {
        id: "JCH05_B3_T2",
        label: "Single number",
        mockInputs: ["1", "7"],
        expectedOutput: "7",
        isBoundary: true,
      },
      {
        id: "JCH05_B3_T3",
        label: "Negative numbers",
        mockInputs: ["3", "-5", "3", "-1"],
        expectedOutput: "-3",
        isHidden: true,
      },
      {
        id: "JCH05_B3_T4",
        label: "Zeros",
        mockInputs: ["3", "0", "0", "0"],
        expectedOutput: "0",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["for", "accumulator", "Scanner"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH05_I1",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "intermediate",
    tierIndex: 0,
    title: "Number Pattern",
    emoji: "🔢",
    tagline: "Print an incrementing right-triangle of numbers.",
    problemStatement:
      "Read an integer N. Print a right-aligned triangle of N rows where row i (1-indexed) contains the numbers 1 through i separated by spaces.",
    inputFormat: "A single integer N (1 ≤ N ≤ 20).",
    outputFormat:
      "N lines. Line i contains: \"1 2 3 ... i\" (space-separated).",
    examples: [
      {
        input: "4",
        output: "1\n1 2\n1 2 3\n1 2 3 4",
        explanation: "Row 1 has one number, row 2 has two, etc.",
      },
      {
        input: "1",
        output: "1",
      },
    ],
    constraints: ["1 ≤ N ≤ 20"],
    hints: [
      "Use an outer for loop for rows (i from 1 to N).",
      "Use an inner for loop for columns (j from 1 to i).",
      "Use System.out.print(j) inside the inner loop, add a space between numbers.",
      "Use System.out.println() at the end of each row to move to the next line.",
      "To avoid trailing space: print j, then check if j < i before printing space.",
    ],
    referenceProgram: {
      title: "Nested For Loop Triangle",
      description: "Outer loop for rows, inner loop for columns.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                if (j > 1) System.out.print(" ");
                System.out.print(j);
            }
            System.out.println();
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: nested loops to print the number triangle
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                if (j > 1) System.out.print(" ");
                System.out.print(j);
            }
            System.out.println();
        }
    }
}`,
    testCases: [
      {
        id: "JCH05_I1_T1",
        label: "N = 4",
        mockInputs: ["4"],
        expectedOutput: "1\n1 2\n1 2 3\n1 2 3 4",
      },
      {
        id: "JCH05_I1_T2",
        label: "N = 1 (boundary)",
        mockInputs: ["1"],
        expectedOutput: "1",
        isBoundary: true,
      },
      {
        id: "JCH05_I1_T3",
        label: "N = 5",
        mockInputs: ["5"],
        expectedOutput: "1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5",
        isHidden: true,
      },
    ],
    concepts: ["nested for", "print vs println", "patterns"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH05_I2",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "intermediate",
    tierIndex: 1,
    title: "Input Until Sentinel",
    emoji: "🛑",
    tagline: "Keep reading until the user enters 0.",
    problemStatement:
      "Read integers one by one until 0 is entered (0 is the sentinel and is NOT counted). Print the count of positive numbers, the count of negative numbers, and the sum of all entered numbers (excluding 0).",
    inputFormat:
      "A series of integers, one per line, ending with 0.",
    outputFormat:
      "Three lines:\n\"Positive: <count>\"\n\"Negative: <count>\"\n\"Sum: <sum>\"",
    examples: [
      {
        input: "3\n-1\n5\n-2\n0",
        output: "Positive: 2\nNegative: 2\nSum: 5",
        explanation: "Positive: 3,5. Negative: -1,-2. Sum = 3+(-1)+5+(-2) = 5.",
      },
      {
        input: "0",
        output: "Positive: 0\nNegative: 0\nSum: 0",
      },
    ],
    constraints: [
      "Numbers are in range [-10000, 10000].",
      "At most 1000 numbers before sentinel.",
    ],
    hints: [
      "Use a do-while or a while(true) loop and break when you read 0.",
      "Maintain three variables: posCount, negCount, sum.",
      "Check if num > 0, num < 0, or num == 0 (sentinel).",
      "Only break on 0 — do NOT add it to sum.",
    ],
    referenceProgram: {
      title: "Sentinel Loop",
      description: "while(true) with break when sentinel is detected.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int posCount = 0, negCount = 0, sum = 0;
        while (sc.hasNextInt()) {
            int num = sc.nextInt();
            if (num == 0) break;
            sum += num;
            if (num > 0) posCount++;
            else negCount++;
        }
        System.out.println("Positive: " + posCount);
        System.out.println("Negative: " + negCount);
        System.out.println("Sum: " + sum);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int posCount = 0, negCount = 0, sum = 0;
        // TODO: read integers until 0; count positives, negatives, compute sum
        System.out.println("Positive: " + posCount);
        System.out.println("Negative: " + negCount);
        System.out.println("Sum: " + sum);
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int posCount = 0, negCount = 0, sum = 0;
        while (sc.hasNextInt()) {
            int num = sc.nextInt();
            if (num == 0) break;
            sum += num;
            if (num > 0) posCount++;
            else negCount++;
        }
        System.out.println("Positive: " + posCount);
        System.out.println("Negative: " + negCount);
        System.out.println("Sum: " + sum);
    }
}`,
    testCases: [
      {
        id: "JCH05_I2_T1",
        label: "Mixed numbers",
        mockInputs: ["3", "-1", "5", "-2", "0"],
        expectedOutput: "Positive: 2\nNegative: 2\nSum: 5",
      },
      {
        id: "JCH05_I2_T2",
        label: "Only sentinel",
        mockInputs: ["0"],
        expectedOutput: "Positive: 0\nNegative: 0\nSum: 0",
        isBoundary: true,
      },
      {
        id: "JCH05_I2_T3",
        label: "All positives",
        mockInputs: ["1", "2", "3", "0"],
        expectedOutput: "Positive: 3\nNegative: 0\nSum: 6",
        isHidden: true,
      },
    ],
    concepts: ["while", "break", "sentinel", "conditional"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH05_I3",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "intermediate",
    tierIndex: 2,
    title: "Digit Sum (Digital Root)",
    emoji: "🔁",
    tagline: "Repeatedly sum the digits until you reach a single digit.",
    problemStatement:
      "Read a positive integer N. Compute the digital root: repeatedly replace N with the sum of its digits until N is a single digit (0–9). Print the final single-digit result.",
    inputFormat: "A single positive integer N (1 ≤ N ≤ 10^9).",
    outputFormat: "A single integer — the digital root of N.",
    examples: [
      {
        input: "493",
        output: "7",
        explanation: "493 → 4+9+3=16 → 1+6=7.",
      },
      {
        input: "9",
        output: "9",
        explanation: "Already a single digit.",
      },
      {
        input: "999",
        output: "9",
        explanation: "999 → 27 → 9.",
      },
    ],
    constraints: ["1 ≤ N ≤ 10^9"],
    hints: [
      "Write a helper loop: while n >= 10, sum its digits.",
      "To extract digits use: digit = n % 10; n = n / 10;",
      "Wrap the digit-summing in an outer while loop: while (n >= 10).",
      "After the inner loop, set n = digitSum and repeat.",
    ],
    referenceProgram: {
      title: "Nested While Digit Root",
      description: "Outer while checks single digit; inner while extracts digits.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        while (n >= 10) {
            int sum = 0;
            while (n > 0) {
                sum += n % 10;
                n /= 10;
            }
            n = sum;
        }
        System.out.println(n);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: reduce n to its digital root using loops and % /
        System.out.println(n);
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        while (n >= 10) {
            int sum = 0;
            while (n > 0) {
                sum += n % 10;
                n /= 10;
            }
            n = sum;
        }
        System.out.println(n);
    }
}`,
    testCases: [
      {
        id: "JCH05_I3_T1",
        label: "493",
        mockInputs: ["493"],
        expectedOutput: "7",
      },
      {
        id: "JCH05_I3_T2",
        label: "Single digit already",
        mockInputs: ["9"],
        expectedOutput: "9",
        isBoundary: true,
      },
      {
        id: "JCH05_I3_T3",
        label: "999",
        mockInputs: ["999"],
        expectedOutput: "9",
        isHidden: true,
      },
      {
        id: "JCH05_I3_T4",
        label: "Large number",
        mockInputs: ["1000000000"],
        expectedOutput: "1",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["nested while", "modulo", "digit extraction"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH05_A1",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "advanced",
    tierIndex: 0,
    title: "Prime Sieve (Trial Division)",
    emoji: "🔬",
    tagline: "Find all prime numbers up to N using nested loops.",
    problemStatement:
      "Read an integer N. Print all prime numbers from 2 to N (inclusive), each on its own line. Use trial division with nested loops — no library methods.",
    inputFormat: "A single integer N (2 ≤ N ≤ 1000).",
    outputFormat: "All primes ≤ N, one per line in ascending order.",
    examples: [
      {
        input: "20",
        output: "2\n3\n5\n7\n11\n13\n17\n19",
      },
      {
        input: "2",
        output: "2",
        isBoundary: true,
      } as any,
    ],
    constraints: ["2 ≤ N ≤ 1000"],
    hints: [
      "Outer loop: for (int num = 2; num <= n; num++)",
      "Inner loop: check divisibility for d from 2 up to num-1 (or Math.sqrt(num)).",
      "Use a boolean isPrime = true; if any d divides num, set isPrime = false and break.",
      "After the inner loop, if isPrime is still true, print num.",
      "Optimisation: only check d up to (int)Math.sqrt(num) — this is O(N√N).",
    ],
    referenceProgram: {
      title: "Trial Division Prime Check",
      description: "Classic O(N√N) trial division using nested for loops.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int num = 2; num <= n; num++) {
            boolean isPrime = true;
            for (int d = 2; d * d <= num; d++) {
                if (num % d == 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) System.out.println(num);
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: for each number from 2 to n, check if prime using nested loop
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int num = 2; num <= n; num++) {
            boolean isPrime = true;
            for (int d = 2; d * d <= num; d++) {
                if (num % d == 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) System.out.println(num);
        }
    }
}`,
    testCases: [
      {
        id: "JCH05_A1_T1",
        label: "N = 20",
        mockInputs: ["20"],
        expectedOutput: "2\n3\n5\n7\n11\n13\n17\n19",
      },
      {
        id: "JCH05_A1_T2",
        label: "N = 2 (boundary)",
        mockInputs: ["2"],
        expectedOutput: "2",
        isBoundary: true,
      },
      {
        id: "JCH05_A1_T3",
        label: "N = 10",
        mockInputs: ["10"],
        expectedOutput: "2\n3\n5\n7",
        isHidden: true,
      },
      {
        id: "JCH05_A1_T4",
        label: "N = 50 (hidden)",
        mockInputs: ["50"],
        expectedOutput: "2\n3\n5\n7\n11\n13\n17\n19\n23\n29\n31\n37\n41\n43\n47",
        isHidden: true,
      },
    ],
    concepts: ["nested for", "break", "prime check", "boolean flag"],
    xpReward: 150,
    estimatedMinutes: 15,
    timeComplexityTarget: "O(N√N)",
  },

  {
    id: "JCH05_A2",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "advanced",
    tierIndex: 1,
    title: "Pattern Diamond",
    emoji: "💎",
    tagline: "Print a diamond using nested loops.",
    problemStatement:
      "Read an odd integer N. Print a diamond pattern of height N made of '*' characters. The middle row has N stars; each row going outward decreases by 2.",
    inputFormat: "A single odd integer N (1 ≤ N ≤ 19).",
    outputFormat:
      "N lines. Upper half (including middle): rows with 1,3,5,...,N stars centred. Lower half (below middle): rows with N-2,...,3,1 stars centred.",
    examples: [
      {
        input: "5",
        output: "  *\n ***\n*****\n ***\n  *",
        explanation:
          "Row 1: 1 star with 2 leading spaces, row 2: 3 stars with 1 leading space, row 3: 5 stars, row 4: 3 stars, row 5: 1 star.",
      },
      {
        input: "1",
        output: "*",
      },
    ],
    constraints: ["N is odd, 1 ≤ N ≤ 19"],
    hints: [
      "Half = N/2. Upper half: rows from 0 to half (stars = 1+2*row, spaces = half-row).",
      "Lower half: rows from half-1 down to 0 (mirror of upper).",
      "Build each line with a StringBuilder or string concatenation.",
      "Spaces before stars = (N - stars) / 2.",
    ],
    referenceProgram: {
      title: "Diamond Pattern with Spaces",
      description: "Computes spaces and stars per row for both halves.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int half = n / 2;
        // upper half including middle
        for (int i = 0; i <= half; i++) {
            int stars = 2 * i + 1;
            int spaces = half - i;
            for (int s = 0; s < spaces; s++) System.out.print(" ");
            for (int s = 0; s < stars; s++) System.out.print("*");
            System.out.println();
        }
        // lower half
        for (int i = half - 1; i >= 0; i--) {
            int stars = 2 * i + 1;
            int spaces = half - i;
            for (int s = 0; s < spaces; s++) System.out.print(" ");
            for (int s = 0; s < stars; s++) System.out.print("*");
            System.out.println();
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: print diamond of odd size n
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int half = n / 2;
        for (int i = 0; i <= half; i++) {
            int stars = 2 * i + 1;
            int spaces = half - i;
            for (int s = 0; s < spaces; s++) System.out.print(" ");
            for (int s = 0; s < stars; s++) System.out.print("*");
            System.out.println();
        }
        for (int i = half - 1; i >= 0; i--) {
            int stars = 2 * i + 1;
            int spaces = half - i;
            for (int s = 0; s < spaces; s++) System.out.print(" ");
            for (int s = 0; s < stars; s++) System.out.print("*");
            System.out.println();
        }
    }
}`,
    testCases: [
      {
        id: "JCH05_A2_T1",
        label: "N = 5",
        mockInputs: ["5"],
        expectedOutput: "  *\n ***\n*****\n ***\n  *",
      },
      {
        id: "JCH05_A2_T2",
        label: "N = 1 (boundary)",
        mockInputs: ["1"],
        expectedOutput: "*",
        isBoundary: true,
      },
      {
        id: "JCH05_A2_T3",
        label: "N = 3",
        mockInputs: ["3"],
        expectedOutput: " *\n***\n *",
        isHidden: true,
      },
      {
        id: "JCH05_A2_T4",
        label: "N = 7",
        mockInputs: ["7"],
        expectedOutput: "   *\n  ***\n *****\n*******\n *****\n  ***\n   *",
        isHidden: true,
      },
    ],
    concepts: ["nested for", "patterns", "spaces and stars"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH05_A3",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "advanced",
    tierIndex: 2,
    title: "Collatz Sequence",
    emoji: "🌀",
    tagline: "Follow the Collatz conjecture until you hit 1.",
    problemStatement:
      "Read a positive integer N. Apply the Collatz rule repeatedly:\n- If N is even: N = N / 2\n- If N is odd: N = 3 * N + 1\nPrint each value of N (including the starting value and 1), each on its own line. Then print \"Steps: k\" where k is the number of transformations applied.",
    inputFormat: "A single positive integer N (1 ≤ N ≤ 10000).",
    outputFormat:
      "The sequence values one per line, followed by \"Steps: k\".",
    examples: [
      {
        input: "6",
        output: "6\n3\n10\n5\n16\n8\n4\n2\n1\nSteps: 8",
        explanation: "6→3→10→5→16→8→4→2→1 takes 8 steps.",
      },
      {
        input: "1",
        output: "1\nSteps: 0",
        explanation: "Already at 1; zero steps.",
      },
    ],
    constraints: ["1 ≤ N ≤ 10000"],
    hints: [
      "Print N before entering the loop.",
      "Use a while loop: while (n != 1).",
      "Inside: apply even/odd rule, increment steps, print updated n.",
      "After the loop, print \"Steps: \" + steps.",
    ],
    referenceProgram: {
      title: "Collatz While Loop",
      description: "Straightforward while loop applying Collatz rules.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int steps = 0;
        System.out.println(n);
        while (n != 1) {
            if (n % 2 == 0) n /= 2;
            else n = 3 * n + 1;
            steps++;
            System.out.println(n);
        }
        System.out.println("Steps: " + steps);
    }
}`,
      explanation: "Using long prevents overflow for large intermediate values.",
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int steps = 0;
        // TODO: print sequence and count steps
        System.out.println("Steps: " + steps);
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int steps = 0;
        System.out.println(n);
        while (n != 1) {
            if (n % 2 == 0) n /= 2;
            else n = 3 * n + 1;
            steps++;
            System.out.println(n);
        }
        System.out.println("Steps: " + steps);
    }
}`,
    testCases: [
      {
        id: "JCH05_A3_T1",
        label: "N = 6",
        mockInputs: ["6"],
        expectedOutput: "6\n3\n10\n5\n16\n8\n4\n2\n1\nSteps: 8",
      },
      {
        id: "JCH05_A3_T2",
        label: "N = 1 (boundary)",
        mockInputs: ["1"],
        expectedOutput: "1\nSteps: 0",
        isBoundary: true,
      },
      {
        id: "JCH05_A3_T3",
        label: "N = 4",
        mockInputs: ["4"],
        expectedOutput: "4\n2\n1\nSteps: 2",
        isHidden: true,
      },
    ],
    concepts: ["while", "even/odd", "long", "Collatz"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH05_L1",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "leetcode",
    tierIndex: 0,
    title: "Missing Number in Range",
    emoji: "❓",
    tagline: "Find the one missing integer from 1..N using the sum formula.",
    problemStatement:
      "Read N, then read N-1 integers that are a permutation of 1..N with exactly one number missing. Print the missing number. Use the sum formula (N*(N+1)/2 minus the actual sum) in O(N) one pass — do not use an array.",
    inputFormat:
      "First line: N (2 ≤ N ≤ 100000). Next N-1 lines: the numbers.",
    outputFormat: "A single integer — the missing number.",
    examples: [
      {
        input: "5\n1\n3\n4\n5",
        output: "2",
        explanation: "Expected sum = 15, actual = 13, missing = 2.",
      },
      {
        input: "3\n1\n3",
        output: "2",
      },
    ],
    constraints: ["2 ≤ N ≤ 100000", "All values are distinct integers in [1, N]."],
    hints: [
      "Compute expected = N * (N + 1) / 2.",
      "Read N-1 integers and accumulate actualSum.",
      "Answer = expected - actualSum.",
      "Use long to avoid int overflow for large N.",
    ],
    referenceProgram: {
      title: "Sum Formula Missing Number",
      description: "Gauss sum minus actual sum gives the missing value.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long expected = n * (n + 1) / 2;
        long actual = 0;
        for (int i = 0; i < n - 1; i++) {
            actual += sc.nextLong();
        }
        System.out.println(expected - actual);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        // TODO: use sum formula to find missing number
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long expected = n * (n + 1) / 2;
        long actual = 0;
        for (int i = 0; i < n - 1; i++) {
            actual += sc.nextLong();
        }
        System.out.println(expected - actual);
    }
}`,
    testCases: [
      {
        id: "JCH05_L1_T1",
        label: "N=5, missing 2",
        mockInputs: ["5", "1", "3", "4", "5"],
        expectedOutput: "2",
      },
      {
        id: "JCH05_L1_T2",
        label: "N=2, missing 1",
        mockInputs: ["2", "2"],
        expectedOutput: "1",
        isBoundary: true,
      },
      {
        id: "JCH05_L1_T3",
        label: "N=2, missing 2",
        mockInputs: ["2", "1"],
        expectedOutput: "2",
        isBoundary: true,
      },
      {
        id: "JCH05_L1_T4",
        label: "N=6, missing 6",
        mockInputs: ["6", "1", "2", "3", "4", "5"],
        expectedOutput: "6",
        isHidden: true,
      },
    ],
    concepts: ["sum formula", "long", "O(N)"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(N)",
  },

  {
    id: "JCH05_L2",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "leetcode",
    tierIndex: 1,
    title: "Palindrome Number",
    emoji: "🔄",
    tagline: "Check if an integer is a palindrome without using String.",
    problemStatement:
      "Read an integer N. Print \"Palindrome\" if N reads the same forwards and backwards, otherwise print \"Not Palindrome\". Do not convert N to a String — use digit extraction with % and / in a loop.",
    inputFormat: "A single integer N (-2^31 ≤ N ≤ 2^31-1).",
    outputFormat: "\"Palindrome\" or \"Not Palindrome\".",
    examples: [
      {
        input: "121",
        output: "Palindrome",
      },
      {
        input: "-121",
        output: "Not Palindrome",
        explanation: "Negative numbers are never palindromes.",
      },
      {
        input: "10",
        output: "Not Palindrome",
        explanation: "10 reversed is 01 = 1, not equal to 10.",
      },
    ],
    constraints: ["-2^31 ≤ N ≤ 2^31-1"],
    hints: [
      "Negative numbers are never palindromes — handle that first.",
      "To reverse: reversed = 0; while (temp > 0) { reversed = reversed*10 + temp%10; temp /= 10; }",
      "Compare reversed with the original N.",
      "Use long for reversed to avoid overflow.",
    ],
    referenceProgram: {
      title: "Digit Reversal Palindrome Check",
      description: "Reverse digits mathematically and compare.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n < 0) {
            System.out.println("Not Palindrome");
            return;
        }
        int temp = n;
        long reversed = 0;
        while (temp > 0) {
            reversed = reversed * 10 + temp % 10;
            temp /= 10;
        }
        System.out.println(reversed == n ? "Palindrome" : "Not Palindrome");
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: check palindrome without String conversion
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n < 0) {
            System.out.println("Not Palindrome");
            return;
        }
        int temp = n;
        long reversed = 0;
        while (temp > 0) {
            reversed = reversed * 10 + temp % 10;
            temp /= 10;
        }
        System.out.println(reversed == n ? "Palindrome" : "Not Palindrome");
    }
}`,
    testCases: [
      {
        id: "JCH05_L2_T1",
        label: "121 is palindrome",
        mockInputs: ["121"],
        expectedOutput: "Palindrome",
      },
      {
        id: "JCH05_L2_T2",
        label: "Negative number",
        mockInputs: ["-121"],
        expectedOutput: "Not Palindrome",
        isBoundary: true,
      },
      {
        id: "JCH05_L2_T3",
        label: "10 is not palindrome",
        mockInputs: ["10"],
        expectedOutput: "Not Palindrome",
      },
      {
        id: "JCH05_L2_T4",
        label: "0 is palindrome",
        mockInputs: ["0"],
        expectedOutput: "Palindrome",
        isBoundary: true,
        isHidden: true,
      },
      {
        id: "JCH05_L2_T5",
        label: "1221",
        mockInputs: ["1221"],
        expectedOutput: "Palindrome",
        isHidden: true,
      },
    ],
    concepts: ["digit reversal", "modulo", "while", "long overflow"],
    xpReward: 250,
    estimatedMinutes: 20,
  },

  {
    id: "JCH05_L3",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "leetcode",
    tierIndex: 2,
    title: "Rotate Digits",
    emoji: "🔃",
    tagline: "Rotate the digits of an integer left by k positions.",
    problemStatement:
      "Read a positive integer N and a non-negative integer k. Rotate the decimal digits of N to the left by k positions and print the result. Leading zeros in the result should be dropped (e.g. 1000 rotated left by 1 is 0001 → printed as 1).\nExample: N=12345, k=2 → \"34512\".",
    inputFormat:
      "First line: integer N (1 ≤ N ≤ 10^9). Second line: integer k (0 ≤ k ≤ 20).",
    outputFormat: "The rotated number as an integer (no leading zeros).",
    examples: [
      {
        input: "12345\n2",
        output: "34512",
        explanation: "Digits [1,2,3,4,5] rotated left 2 → [3,4,5,1,2] = 34512.",
      },
      {
        input: "1000\n1",
        output: "1",
        explanation: "Digits [1,0,0,0] rotated left 1 → [0,0,0,1] = 1 (no leading zeros).",
      },
      {
        input: "123\n3",
        output: "123",
        explanation: "Full rotation returns to original.",
      },
    ],
    constraints: [
      "1 ≤ N ≤ 10^9",
      "0 ≤ k ≤ 20",
      "k is reduced modulo digit count.",
    ],
    hints: [
      "Convert N to a char array via String.valueOf(n).toCharArray().",
      "Effective rotation = k % digits.length.",
      "Build the rotated string: digits[effective..end] + digits[0..effective-1].",
      "Parse with Long.parseLong() to drop leading zeros, then print.",
    ],
    referenceProgram: {
      title: "String-Based Digit Rotation",
      description: "Convert to string, slice, concatenate, parse back.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int k = sc.nextInt();
        String s = Long.toString(n);
        int len = s.length();
        int rot = k % len;
        String rotated = s.substring(rot) + s.substring(0, rot);
        System.out.println(Long.parseLong(rotated));
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int k = sc.nextInt();
        // TODO: rotate digits of n left by k positions, print result
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        int k = sc.nextInt();
        String s = Long.toString(n);
        int len = s.length();
        int rot = k % len;
        String rotated = s.substring(rot) + s.substring(0, rot);
        System.out.println(Long.parseLong(rotated));
    }
}`,
    testCases: [
      {
        id: "JCH05_L3_T1",
        label: "12345, k=2",
        mockInputs: ["12345", "2"],
        expectedOutput: "34512",
      },
      {
        id: "JCH05_L3_T2",
        label: "1000, k=1 (leading zeros)",
        mockInputs: ["1000", "1"],
        expectedOutput: "1",
        isBoundary: true,
      },
      {
        id: "JCH05_L3_T3",
        label: "Full rotation",
        mockInputs: ["123", "3"],
        expectedOutput: "123",
        isBoundary: true,
      },
      {
        id: "JCH05_L3_T4",
        label: "k=0 (no rotation)",
        mockInputs: ["987", "0"],
        expectedOutput: "987",
        isHidden: true,
      },
    ],
    concepts: ["String.valueOf", "substring", "modulo", "Long.parseLong"],
    xpReward: 250,
    estimatedMinutes: 20,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH05_H1",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "hackathon",
    tierIndex: 0,
    title: "Spiral Number Matrix",
    emoji: "🌀",
    tagline: "Fill an N×N matrix in spiral order and print it.",
    problemStatement:
      "Read N. Generate an N×N matrix filled with integers 1 to N² in spiral order (start at top-left, go right, then down, then left, then up, repeat inward). Print the matrix row by row with values separated by spaces.",
    inputFormat: "A single integer N (1 ≤ N ≤ 10).",
    outputFormat:
      "N lines, each containing N space-separated integers.",
    examples: [
      {
        input: "3",
        output: "1 2 3\n8 9 4\n7 6 5",
        explanation: "Spiral: →1,2,3 ↓4,5 ←6,7 ↑8 →9.",
      },
      {
        input: "1",
        output: "1",
      },
    ],
    constraints: ["1 ≤ N ≤ 10"],
    hints: [
      "Use a 2D array: int[][] mat = new int[n][n];",
      "Maintain four boundaries: top, bottom, left, right.",
      "Fill right across top, down the right, left across bottom, up the left. Shrink boundaries after each pass.",
      "Use a counter starting at 1; stop when counter > n*n.",
    ],
    referenceProgram: {
      title: "Boundary-Shrinking Spiral Fill",
      description: "Classic four-direction spiral with shrinking boundaries.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        int top = 0, bottom = n - 1, left = 0, right = n - 1;
        int num = 1;
        while (num <= n * n) {
            for (int c = left; c <= right && num <= n * n; c++) mat[top][c] = num++;
            top++;
            for (int r = top; r <= bottom && num <= n * n; r++) mat[r][right] = num++;
            right--;
            for (int c = right; c >= left && num <= n * n; c--) mat[bottom][c] = num++;
            bottom--;
            for (int r = bottom; r >= top && num <= n * n; r--) mat[r][left] = num++;
            left++;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j > 0) sb.append(" ");
                sb.append(mat[i][j]);
            }
            sb.append("\\n");
        }
        System.out.print(sb.toString().trim());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        // TODO: fill mat in spiral order then print
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        int top = 0, bottom = n - 1, left = 0, right = n - 1;
        int num = 1;
        while (num <= n * n) {
            for (int c = left; c <= right && num <= n * n; c++) mat[top][c] = num++;
            top++;
            for (int r = top; r <= bottom && num <= n * n; r++) mat[r][right] = num++;
            right--;
            for (int c = right; c >= left && num <= n * n; c--) mat[bottom][c] = num++;
            bottom--;
            for (int r = bottom; r >= top && num <= n * n; r--) mat[r][left] = num++;
            left++;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j > 0) sb.append(" ");
                sb.append(mat[i][j]);
            }
            if (i < n - 1) sb.append("\n");
        }
        System.out.println(sb.toString());
    }
}`,
    testCases: [
      {
        id: "JCH05_H1_T1",
        label: "3×3 spiral",
        mockInputs: ["3"],
        expectedOutput: "1 2 3\n8 9 4\n7 6 5",
      },
      {
        id: "JCH05_H1_T2",
        label: "1×1 (boundary)",
        mockInputs: ["1"],
        expectedOutput: "1",
        isBoundary: true,
      },
      {
        id: "JCH05_H1_T3",
        label: "4×4 spiral",
        mockInputs: ["4"],
        expectedOutput: "1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7",
        isHidden: true,
      },
      {
        id: "JCH05_H1_T4",
        label: "2×2 spiral",
        mockInputs: ["2"],
        expectedOutput: "1 2\n4 3",
        isHidden: true,
      },
    ],
    concepts: ["2D array", "nested loops", "boundary shrinking", "spiral"],
    xpReward: 400,
    estimatedMinutes: 30,
    timeComplexityTarget: "O(N²)",
    designChallenge:
      "Extend to print the spiral path as a list of coordinates, or unwind the spiral back to the matrix.",
  },

  {
    id: "JCH05_H2",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "hackathon",
    tierIndex: 1,
    title: "Run-Length Encoding",
    emoji: "📦",
    tagline: "Compress consecutive identical characters.",
    problemStatement:
      "Read a non-empty string of lowercase letters. Apply run-length encoding: replace each run of consecutive identical characters with the count followed by the character (e.g. \"aaabbc\" → \"3a2b1c\"). Print the encoded string.",
    inputFormat: "A single non-empty string of lowercase letters (length ≤ 10000).",
    outputFormat: "The RLE-encoded string on one line.",
    examples: [
      {
        input: "aaabbc",
        output: "3a2b1c",
        explanation: "aaa→3a, bb→2b, c→1c.",
      },
      {
        input: "abcd",
        output: "1a1b1c1d",
      },
      {
        input: "aaaaaa",
        output: "6a",
      },
    ],
    constraints: ["1 ≤ |s| ≤ 10000", "Only lowercase English letters."],
    hints: [
      "Use a StringBuilder to build the output efficiently.",
      "Walk through the string with a while loop tracking current char and count.",
      "When the character changes, append count+char to the builder and reset.",
      "Don't forget to append the last run after the loop ends.",
    ],
    referenceProgram: {
      title: "Run-Length Encoding with StringBuilder",
      description: "Single pass with a running count.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            char c = s.charAt(i);
            int count = 0;
            while (i < s.length() && s.charAt(i) == c) {
                count++;
                i++;
            }
            sb.append(count).append(c);
        }
        System.out.println(sb.toString());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder sb = new StringBuilder();
        // TODO: encode s using run-length encoding
        System.out.println(sb.toString());
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            char c = s.charAt(i);
            int count = 0;
            while (i < s.length() && s.charAt(i) == c) {
                count++;
                i++;
            }
            sb.append(count).append(c);
        }
        System.out.println(sb.toString());
    }
}`,
    testCases: [
      {
        id: "JCH05_H2_T1",
        label: "aaabbc",
        mockInputs: ["aaabbc"],
        expectedOutput: "3a2b1c",
      },
      {
        id: "JCH05_H2_T2",
        label: "All unique",
        mockInputs: ["abcd"],
        expectedOutput: "1a1b1c1d",
      },
      {
        id: "JCH05_H2_T3",
        label: "Single char repeated",
        mockInputs: ["aaaaaa"],
        expectedOutput: "6a",
      },
      {
        id: "JCH05_H2_T4",
        label: "Single character",
        mockInputs: ["z"],
        expectedOutput: "1z",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["StringBuilder", "nested while", "charAt", "run-length"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Write a decoder that reverses RLE: \"3a2b1c\" → \"aaabbc\".",
  },

  {
    id: "JCH05_H3",
    chapterId: "JCH05_LOOPS",
    chapterNumber: 5,
    tier: "hackathon",
    tierIndex: 2,
    title: "Conway's Game of Life Step",
    emoji: "🧬",
    tagline: "Simulate one generation of Conway's Game of Life on a 5×5 grid.",
    problemStatement:
      "Read a 5×5 grid of cells (5 lines, each containing 5 digits 0 or 1, no spaces). Compute exactly one generation step using Conway's rules:\n1. Any live cell with 2 or 3 live neighbours survives.\n2. Any dead cell with exactly 3 live neighbours becomes alive.\n3. All other cells die or stay dead.\nPrint the new 5×5 grid in the same format.",
    inputFormat:
      "5 lines, each containing exactly 5 characters ('0' or '1') with no spaces.",
    outputFormat:
      "5 lines, each containing 5 characters ('0' or '1') — the next generation.",
    examples: [
      {
        input: "00000\n01110\n00000\n00000\n00000",
        output: "00100\n00100\n00100\n00000\n00000",
        explanation:
          "The horizontal blinker [0,1],[0,2],[0,3] in row 1 rotates to a vertical blinker.",
      },
    ],
    constraints: ["Grid is always 5×5.", "Values are '0' or '1'."],
    hints: [
      "Store the grid in a 2D int array: int[][] grid = new int[5][5];",
      "Read each row as a String and use charAt(j) - '0' to fill the array.",
      "For each cell, count its live neighbours in all 8 directions (check bounds).",
      "Build a new grid based on rules; print from the new grid.",
    ],
    referenceProgram: {
      title: "Conway's Game of Life — One Step",
      description: "Count neighbours with 8-direction loops; apply rules to new grid.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] grid = new int[5][5];
        for (int i = 0; i < 5; i++) {
            String row = sc.next();
            for (int j = 0; j < 5; j++) grid[i][j] = row.charAt(j) - '0';
        }
        int[][] next = new int[5][5];
        int[] dr = {-1,-1,-1,0,0,1,1,1};
        int[] dc = {-1,0,1,-1,1,-1,0,1};
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5; j++) {
                int live = 0;
                for (int d = 0; d < 8; d++) {
                    int ni = i + dr[d], nj = j + dc[d];
                    if (ni >= 0 && ni < 5 && nj >= 0 && nj < 5) live += grid[ni][nj];
                }
                if (grid[i][j] == 1) next[i][j] = (live == 2 || live == 3) ? 1 : 0;
                else next[i][j] = (live == 3) ? 1 : 0;
            }
        }
        for (int i = 0; i < 5; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < 5; j++) sb.append(next[i][j]);
            System.out.println(sb.toString());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] grid = new int[5][5];
        for (int i = 0; i < 5; i++) {
            String row = sc.next();
            for (int j = 0; j < 5; j++) grid[i][j] = row.charAt(j) - '0';
        }
        // TODO: compute one Game of Life step and print the new 5x5 grid
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] grid = new int[5][5];
        for (int i = 0; i < 5; i++) {
            String row = sc.next();
            for (int j = 0; j < 5; j++) grid[i][j] = row.charAt(j) - '0';
        }
        int[][] next = new int[5][5];
        int[] dr = {-1,-1,-1,0,0,1,1,1};
        int[] dc = {-1,0,1,-1,1,-1,0,1};
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5; j++) {
                int live = 0;
                for (int d = 0; d < 8; d++) {
                    int ni = i + dr[d], nj = j + dc[d];
                    if (ni >= 0 && ni < 5 && nj >= 0 && nj < 5) live += grid[ni][nj];
                }
                if (grid[i][j] == 1) next[i][j] = (live == 2 || live == 3) ? 1 : 0;
                else next[i][j] = (live == 3) ? 1 : 0;
            }
        }
        for (int i = 0; i < 5; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < 5; j++) sb.append(next[i][j]);
            System.out.println(sb.toString());
        }
    }
}`,
    testCases: [
      {
        id: "JCH05_H3_T1",
        label: "Blinker horizontal → vertical",
        mockInputs: ["00000", "01110", "00000", "00000", "00000"],
        expectedOutput: "00100\n00100\n00100\n00000\n00000",
      },
      {
        id: "JCH05_H3_T2",
        label: "All dead stays dead",
        mockInputs: ["00000", "00000", "00000", "00000", "00000"],
        expectedOutput: "00000\n00000\n00000\n00000\n00000",
        isBoundary: true,
      },
      {
        id: "JCH05_H3_T3",
        label: "Single live cell dies",
        mockInputs: ["00000", "00100", "00000", "00000", "00000"],
        expectedOutput: "00000\n00000\n00000\n00000\n00000",
        isBoundary: true,
        isHidden: true,
      },
      {
        id: "JCH05_H3_T4",
        label: "Still life 2x2 block",
        mockInputs: ["00000", "00110", "00110", "00000", "00000"],
        expectedOutput: "00000\n00110\n00110\n00000\n00000",
        isHidden: true,
      },
    ],
    concepts: ["2D array", "nested loops", "neighbour counting", "simulation"],
    xpReward: 400,
    estimatedMinutes: 30,
    timeComplexityTarget: "O(N²) where N=5",
    designChallenge:
      "Extend to run K generations and detect if the grid becomes stable (no change between generations).",
  },
];
