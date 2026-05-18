import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH06_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH06_B1",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "beginner",
    tierIndex: 0,
    title: "Array Sum & Average",
    emoji: "📊",
    tagline: "Read an array and compute its sum and average.",
    problemStatement:
      "Read an integer N, then N integers. Print their sum on the first line and their average (as a double rounded to 2 decimal places) on the second line.",
    inputFormat:
      "First line: integer N (1 ≤ N ≤ 1000). Next N lines: one integer per line.",
    outputFormat:
      "Line 1: integer sum.\nLine 2: average formatted to 2 decimal places (e.g. 3.50).",
    examples: [
      {
        input: "4\n10\n20\n30\n40",
        output: "100\n25.00",
        explanation: "Sum=100, average=100/4=25.00.",
      },
      {
        input: "1\n7",
        output: "7\n7.00",
      },
    ],
    constraints: ["1 ≤ N ≤ 1000", "-10000 ≤ each element ≤ 10000"],
    hints: [
      "Store values in int[] arr = new int[n];",
      "Use a for loop to read and accumulate sum.",
      "Cast to double for average: (double) sum / n",
      "Use String.format(\"%.2f\", avg) to format to 2 decimal places.",
    ],
    referenceProgram: {
      title: "Array Sum and Average",
      description: "Fill array with loop, compute sum, format average.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
            sum += arr[i];
        }
        double avg = (double) sum / n;
        System.out.println(sum);
        System.out.printf("%.2f%n", avg);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        int sum = 0;
        // TODO: read n integers into arr, compute sum and average
        System.out.println(sum);
        // print average with 2 decimal places
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
            sum += arr[i];
        }
        double avg = (double) sum / n;
        System.out.println(sum);
        System.out.printf("%.2f%n", avg);
    }
}`,
    testCases: [
      {
        id: "JCH06_B1_T1",
        label: "4 numbers",
        mockInputs: ["4", "10", "20", "30", "40"],
        expectedOutput: "100\n25.00",
      },
      {
        id: "JCH06_B1_T2",
        label: "Single element",
        mockInputs: ["1", "7"],
        expectedOutput: "7\n7.00",
        isBoundary: true,
      },
      {
        id: "JCH06_B1_T3",
        label: "Non-integer average",
        mockInputs: ["2", "1", "2"],
        expectedOutput: "3\n1.50",
        isHidden: true,
      },
    ],
    concepts: ["arrays", "for", "double", "printf", "Scanner"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH06_B2",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "beginner",
    tierIndex: 1,
    title: "Find Max and Min",
    emoji: "📈",
    tagline: "Find the largest and smallest values in an array using a loop.",
    problemStatement:
      "Read N integers. Without using Arrays.sort or any library method, find and print the maximum and minimum values.",
    inputFormat:
      "First line: N (1 ≤ N ≤ 1000). Next N lines: one integer per line.",
    outputFormat: "Line 1: \"Max: <value>\"\nLine 2: \"Min: <value>\"",
    examples: [
      {
        input: "5\n3\n1\n4\n1\n5",
        output: "Max: 5\nMin: 1",
      },
      {
        input: "1\n42",
        output: "Max: 42\nMin: 42",
      },
    ],
    constraints: ["1 ≤ N ≤ 1000", "-10^6 ≤ each element ≤ 10^6"],
    hints: [
      "Initialise max and min to the first element: int max = arr[0], min = arr[0];",
      "Loop from index 1 to n-1, updating max and min each iteration.",
      "Use if (arr[i] > max) max = arr[i]; and similar for min.",
    ],
    referenceProgram: {
      title: "Linear Scan Max/Min",
      description: "Initialise from first element, scan the rest.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int max = arr[0], min = arr[0];
        for (int i = 1; i < n; i++) {
            if (arr[i] > max) max = arr[i];
            if (arr[i] < min) min = arr[i];
        }
        System.out.println("Max: " + max);
        System.out.println("Min: " + min);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int max = arr[0], min = arr[0];
        // TODO: find max and min using a loop
        System.out.println("Max: " + max);
        System.out.println("Min: " + min);
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int max = arr[0], min = arr[0];
        for (int i = 1; i < n; i++) {
            if (arr[i] > max) max = arr[i];
            if (arr[i] < min) min = arr[i];
        }
        System.out.println("Max: " + max);
        System.out.println("Min: " + min);
    }
}`,
    testCases: [
      {
        id: "JCH06_B2_T1",
        label: "5 numbers",
        mockInputs: ["5", "3", "1", "4", "1", "5"],
        expectedOutput: "Max: 5\nMin: 1",
      },
      {
        id: "JCH06_B2_T2",
        label: "Single element",
        mockInputs: ["1", "42"],
        expectedOutput: "Max: 42\nMin: 42",
        isBoundary: true,
      },
      {
        id: "JCH06_B2_T3",
        label: "Negatives included",
        mockInputs: ["3", "-5", "0", "5"],
        expectedOutput: "Max: 5\nMin: -5",
        isHidden: true,
      },
    ],
    concepts: ["arrays", "linear scan", "max/min"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH06_B3",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "beginner",
    tierIndex: 2,
    title: "String Reversal",
    emoji: "🔁",
    tagline: "Reverse a word character by character using charAt.",
    problemStatement:
      "Read a single word (no spaces). Print the word reversed. Use a loop with charAt — do not use StringBuilder.reverse() or any built-in reverse method.",
    inputFormat: "A single word (1 ≤ length ≤ 100).",
    outputFormat: "The reversed word on one line.",
    examples: [
      {
        input: "hello",
        output: "olleh",
      },
      {
        input: "Java",
        output: "avaJ",
      },
      {
        input: "a",
        output: "a",
      },
    ],
    constraints: ["1 ≤ length ≤ 100", "May contain upper and lower case letters."],
    hints: [
      "Get the string length: int len = s.length();",
      "Loop from i = len-1 down to 0.",
      "Print each character: System.out.print(s.charAt(i));",
      "Print a newline at the end with System.out.println();",
    ],
    referenceProgram: {
      title: "Reverse with charAt loop",
      description: "Loop backwards from last index to 0, printing each char.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        for (int i = s.length() - 1; i >= 0; i--) {
            System.out.print(s.charAt(i));
        }
        System.out.println();
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // TODO: print s reversed using a loop and charAt
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        for (int i = s.length() - 1; i >= 0; i--) {
            System.out.print(s.charAt(i));
        }
        System.out.println();
    }
}`,
    testCases: [
      {
        id: "JCH06_B3_T1",
        label: "hello",
        mockInputs: ["hello"],
        expectedOutput: "olleh",
      },
      {
        id: "JCH06_B3_T2",
        label: "Single char",
        mockInputs: ["a"],
        expectedOutput: "a",
        isBoundary: true,
      },
      {
        id: "JCH06_B3_T3",
        label: "Mixed case",
        mockInputs: ["Java"],
        expectedOutput: "avaJ",
        isHidden: true,
      },
    ],
    concepts: ["String", "charAt", "length", "for loop"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH06_I1",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "intermediate",
    tierIndex: 0,
    title: "Array Sort & Display",
    emoji: "🗂️",
    tagline: "Sort an array and print it both ascending and descending.",
    problemStatement:
      "Read N integers. Sort them using Arrays.sort. Print them in ascending order on one line (space-separated), then in descending order on the next line (space-separated).",
    inputFormat:
      "First line: N (1 ≤ N ≤ 1000). Next N lines: one integer per line.",
    outputFormat:
      "Line 1: ascending order, space-separated.\nLine 2: descending order, space-separated.",
    examples: [
      {
        input: "5\n3\n1\n4\n1\n5",
        output: "1 1 3 4 5\n5 4 3 1 1",
      },
      {
        input: "1\n7",
        output: "7\n7",
      },
    ],
    constraints: ["1 ≤ N ≤ 1000"],
    hints: [
      "Import java.util.Arrays;",
      "After filling the array, call Arrays.sort(arr);",
      "Print ascending with a for loop from index 0 to n-1.",
      "Print descending by iterating from n-1 down to 0.",
      "Use a space between numbers but not after the last one.",
    ],
    referenceProgram: {
      title: "Arrays.sort Ascending and Descending",
      description: "Sort once, print forward then backward.",
      code: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        Arrays.sort(arr);
        StringBuilder asc = new StringBuilder();
        StringBuilder desc = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) asc.append(" ");
            asc.append(arr[i]);
        }
        for (int i = n - 1; i >= 0; i--) {
            if (i < n - 1) desc.append(" ");
            desc.append(arr[i]);
        }
        System.out.println(asc.toString());
        System.out.println(desc.toString());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        // TODO: sort arr, then print ascending and descending
    }
}`,
    solution: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        Arrays.sort(arr);
        StringBuilder asc = new StringBuilder();
        StringBuilder desc = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) asc.append(" ");
            asc.append(arr[i]);
        }
        for (int i = n - 1; i >= 0; i--) {
            if (i < n - 1) desc.append(" ");
            desc.append(arr[i]);
        }
        System.out.println(asc.toString());
        System.out.println(desc.toString());
    }
}`,
    testCases: [
      {
        id: "JCH06_I1_T1",
        label: "5 numbers with duplicates",
        mockInputs: ["5", "3", "1", "4", "1", "5"],
        expectedOutput: "1 1 3 4 5\n5 4 3 1 1",
      },
      {
        id: "JCH06_I1_T2",
        label: "Single element",
        mockInputs: ["1", "7"],
        expectedOutput: "7\n7",
        isBoundary: true,
      },
      {
        id: "JCH06_I1_T3",
        label: "Already sorted",
        mockInputs: ["3", "1", "2", "3"],
        expectedOutput: "1 2 3\n3 2 1",
        isHidden: true,
      },
    ],
    concepts: ["Arrays.sort", "ascending", "descending", "StringBuilder"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH06_I2",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "intermediate",
    tierIndex: 1,
    title: "Word Counter",
    emoji: "📝",
    tagline: "Split a sentence and print each word on its own line.",
    problemStatement:
      "Read a sentence (one line). Split it by spaces. Print the total word count, then each word on its own line (in order).",
    inputFormat: "A single line containing one or more words separated by spaces.",
    outputFormat:
      "Line 1: \"Words: <count>\"\nNext lines: each word on its own line.",
    examples: [
      {
        input: "Hello World Java",
        output: "Words: 3\nHello\nWorld\nJava",
      },
      {
        input: "one",
        output: "Words: 1\none",
      },
    ],
    constraints: [
      "1 ≤ word count ≤ 100",
      "Words contain only letters and digits.",
    ],
    hints: [
      "Use sc.nextLine() to read the whole line.",
      "Split with String[] words = line.trim().split(\"\\\\s+\");",
      "words.length gives the count.",
      "Enhanced for-each: for (String w : words) System.out.println(w);",
    ],
    referenceProgram: {
      title: "split() Word Counter",
      description: "nextLine + split + for-each print.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().trim();
        String[] words = line.split("\\s+");
        System.out.println("Words: " + words.length);
        for (String w : words) {
            System.out.println(w);
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().trim();
        // TODO: split line and print word count then each word
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine().trim();
        String[] words = line.split("\\s+");
        System.out.println("Words: " + words.length);
        for (String w : words) {
            System.out.println(w);
        }
    }
}`,
    testCases: [
      {
        id: "JCH06_I2_T1",
        label: "Three words",
        mockInputs: ["Hello World Java"],
        expectedOutput: "Words: 3\nHello\nWorld\nJava",
      },
      {
        id: "JCH06_I2_T2",
        label: "Single word",
        mockInputs: ["one"],
        expectedOutput: "Words: 1\none",
        isBoundary: true,
      },
      {
        id: "JCH06_I2_T3",
        label: "Five words",
        mockInputs: ["the quick brown fox jumps"],
        expectedOutput: "Words: 5\nthe\nquick\nbrown\nfox\njumps",
        isHidden: true,
      },
    ],
    concepts: ["String.split", "nextLine", "for-each", "arrays"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH06_I3",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "intermediate",
    tierIndex: 2,
    title: "Palindrome String",
    emoji: "🪞",
    tagline: "Check if a word is a palindrome using two-pointer technique.",
    problemStatement:
      "Read a word. Print \"Palindrome\" if it reads the same forwards and backwards (case-insensitive), otherwise print \"Not Palindrome\". Use the two-pointer approach (one index from the left, one from the right).",
    inputFormat: "A single word (1 ≤ length ≤ 100).",
    outputFormat: "\"Palindrome\" or \"Not Palindrome\".",
    examples: [
      {
        input: "Racecar",
        output: "Palindrome",
        explanation: "racecar is a palindrome (ignore case).",
      },
      {
        input: "hello",
        output: "Not Palindrome",
      },
      {
        input: "A",
        output: "Palindrome",
      },
    ],
    constraints: ["1 ≤ length ≤ 100", "May contain upper and lower case letters."],
    hints: [
      "Convert to lowercase first: s = s.toLowerCase();",
      "Use int left = 0, right = s.length() - 1;",
      "Loop while left < right: if chars differ, it's not a palindrome.",
      "If the loop completes without mismatch, it is a palindrome.",
    ],
    referenceProgram: {
      title: "Two-Pointer Palindrome",
      description: "Lowercase then compare from both ends moving inward.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next().toLowerCase();
        int left = 0, right = s.length() - 1;
        boolean isPalin = true;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                isPalin = false;
                break;
            }
            left++;
            right--;
        }
        System.out.println(isPalin ? "Palindrome" : "Not Palindrome");
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next().toLowerCase();
        // TODO: use two-pointer to check if s is a palindrome
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next().toLowerCase();
        int left = 0, right = s.length() - 1;
        boolean isPalin = true;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                isPalin = false;
                break;
            }
            left++;
            right--;
        }
        System.out.println(isPalin ? "Palindrome" : "Not Palindrome");
    }
}`,
    testCases: [
      {
        id: "JCH06_I3_T1",
        label: "Racecar (case insensitive)",
        mockInputs: ["Racecar"],
        expectedOutput: "Palindrome",
      },
      {
        id: "JCH06_I3_T2",
        label: "hello is not",
        mockInputs: ["hello"],
        expectedOutput: "Not Palindrome",
      },
      {
        id: "JCH06_I3_T3",
        label: "Single char",
        mockInputs: ["A"],
        expectedOutput: "Palindrome",
        isBoundary: true,
      },
      {
        id: "JCH06_I3_T4",
        label: "madam",
        mockInputs: ["madam"],
        expectedOutput: "Palindrome",
        isHidden: true,
      },
    ],
    concepts: ["two-pointer", "toLowerCase", "charAt", "while"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH06_A1",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "advanced",
    tierIndex: 0,
    title: "2D Matrix Addition",
    emoji: "🔢",
    tagline: "Read two 2×2 matrices and print their element-wise sum.",
    problemStatement:
      "Read two 2×2 integer matrices (each given as 2 lines of 2 space-separated integers). Print their sum as a 2×2 matrix (2 lines of 2 space-separated integers).",
    inputFormat:
      "4 lines for matrix A (2 rows × 2 cols), then 4 lines for matrix B (same format). Each line has 2 integers.",
    outputFormat:
      "2 lines, each containing 2 space-separated integers (the sum matrix).",
    examples: [
      {
        input: "1 2\n3 4\n5 6\n7 8",
        output: "6 8\n10 12",
        explanation: "[1+5, 2+6] = [6,8]; [3+7, 4+8] = [10,12].",
      },
      {
        input: "0 0\n0 0\n0 0\n0 0",
        output: "0 0\n0 0",
      },
    ],
    constraints: ["Matrix values are integers in [-1000, 1000]."],
    hints: [
      "Declare int[][] a = new int[2][2]; and same for b.",
      "Read each row: a[i][0] = sc.nextInt(); a[i][1] = sc.nextInt();",
      "Compute sum: int[][] c = new int[2][2]; c[i][j] = a[i][j] + b[i][j];",
      "Print each row with a space between elements.",
    ],
    referenceProgram: {
      title: "2D Array Addition",
      description: "Fill two 2×2 arrays, compute element-wise sum, print.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] a = new int[2][2];
        int[][] b = new int[2][2];
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++) a[i][j] = sc.nextInt();
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++) b[i][j] = sc.nextInt();
        for (int i = 0; i < 2; i++) {
            System.out.println((a[i][0]+b[i][0]) + " " + (a[i][1]+b[i][1]));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] a = new int[2][2];
        int[][] b = new int[2][2];
        // TODO: read both matrices and print their sum
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[][] a = new int[2][2];
        int[][] b = new int[2][2];
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++) a[i][j] = sc.nextInt();
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++) b[i][j] = sc.nextInt();
        for (int i = 0; i < 2; i++) {
            System.out.println((a[i][0]+b[i][0]) + " " + (a[i][1]+b[i][1]));
        }
    }
}`,
    testCases: [
      {
        id: "JCH06_A1_T1",
        label: "Standard add",
        mockInputs: ["1 2", "3 4", "5 6", "7 8"],
        expectedOutput: "6 8\n10 12",
      },
      {
        id: "JCH06_A1_T2",
        label: "All zeros",
        mockInputs: ["0 0", "0 0", "0 0", "0 0"],
        expectedOutput: "0 0\n0 0",
        isBoundary: true,
      },
      {
        id: "JCH06_A1_T3",
        label: "Negative values",
        mockInputs: ["-1 -2", "-3 -4", "1 2", "3 4"],
        expectedOutput: "0 0\n0 0",
        isHidden: true,
      },
    ],
    concepts: ["2D arrays", "nested for", "matrix operations"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH06_A2",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "advanced",
    tierIndex: 1,
    title: "Caesar Cipher",
    emoji: "🔐",
    tagline: "Encrypt a message by shifting each letter by k positions.",
    problemStatement:
      "Read a string s and an integer shift k. Apply the Caesar cipher: shift each letter forward by k positions in the alphabet (wrapping around), preserving case. Non-alphabetic characters remain unchanged. Print the encrypted string.",
    inputFormat:
      "Line 1: the plaintext string (may contain letters, digits, spaces, punctuation).\nLine 2: integer k (0 ≤ k ≤ 25).",
    outputFormat: "The ciphertext on one line.",
    examples: [
      {
        input: "Hello, World!\n3",
        output: "Khoor, Zruog!",
        explanation: "H+3=K, e+3=h, l+3=o, l+3=o, o+3=r; W+3=Z, o+3=r, r+3=u, l+3=o, d+3=g.",
      },
      {
        input: "xyz\n3",
        output: "abc",
        explanation: "x+3=a, y+3=b, z+3=c (wraps around).",
      },
    ],
    constraints: ["1 ≤ |s| ≤ 1000", "0 ≤ k ≤ 25"],
    hints: [
      "For each char c, check if it is a letter: Character.isLetter(c).",
      "For uppercase: (char)((c - 'A' + k) % 26 + 'A')",
      "For lowercase: (char)((c - 'a' + k) % 26 + 'a')",
      "Build the result with a StringBuilder.",
    ],
    referenceProgram: {
      title: "Caesar Cipher with Char Arithmetic",
      description: "Shift letters in-alphabet with modulo; preserve non-letters.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        int k = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                sb.append((char)((c - 'A' + k) % 26 + 'A'));
            } else if (c >= 'a' && c <= 'z') {
                sb.append((char)((c - 'a' + k) % 26 + 'a'));
            } else {
                sb.append(c);
            }
        }
        System.out.println(sb.toString());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        int k = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        // TODO: apply Caesar cipher, shift each letter by k
        System.out.println(sb.toString());
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        int k = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                sb.append((char)((c - 'A' + k) % 26 + 'A'));
            } else if (c >= 'a' && c <= 'z') {
                sb.append((char)((c - 'a' + k) % 26 + 'a'));
            } else {
                sb.append(c);
            }
        }
        System.out.println(sb.toString());
    }
}`,
    testCases: [
      {
        id: "JCH06_A2_T1",
        label: "Hello World shift 3",
        mockInputs: ["Hello, World!", "3"],
        expectedOutput: "Khoor, Zruog!",
      },
      {
        id: "JCH06_A2_T2",
        label: "Wrap around xyz",
        mockInputs: ["xyz", "3"],
        expectedOutput: "abc",
        isBoundary: true,
      },
      {
        id: "JCH06_A2_T3",
        label: "Shift 0 (no change)",
        mockInputs: ["Hello", "0"],
        expectedOutput: "Hello",
        isBoundary: true,
      },
      {
        id: "JCH06_A2_T4",
        label: "Digits unchanged",
        mockInputs: ["abc123", "1"],
        expectedOutput: "bcd123",
        isHidden: true,
      },
    ],
    concepts: ["char arithmetic", "modulo", "StringBuilder", "Caesar cipher"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH06_A3",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "advanced",
    tierIndex: 2,
    title: "Anagram Checker",
    emoji: "🔀",
    tagline: "Check if two strings are anagrams using sorted char arrays.",
    problemStatement:
      "Read two strings. Print \"Anagram\" if they are anagrams of each other (same characters in any order, same frequency, case-insensitive), otherwise print \"Not Anagram\".",
    inputFormat: "Two lines, one string each.",
    outputFormat: "\"Anagram\" or \"Not Anagram\".",
    examples: [
      {
        input: "listen\nsilent",
        output: "Anagram",
      },
      {
        input: "hello\nworld",
        output: "Not Anagram",
      },
      {
        input: "Triangle\nIntegral",
        output: "Anagram",
        explanation: "Case-insensitive: both contain same letters.",
      },
    ],
    constraints: ["1 ≤ length ≤ 1000", "Strings contain only alphabetic characters."],
    hints: [
      "Convert both strings to lowercase.",
      "If lengths differ, immediately return \"Not Anagram\".",
      "Convert each to char[]: char[] a = s1.toCharArray();",
      "Sort both arrays with Arrays.sort().",
      "Compare with Arrays.equals(a, b).",
    ],
    referenceProgram: {
      title: "Sort-Based Anagram Check",
      description: "Lowercase, sort char arrays, compare with Arrays.equals.",
      code: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[] a = sc.next().toLowerCase().toCharArray();
        char[] b = sc.next().toLowerCase().toCharArray();
        Arrays.sort(a);
        Arrays.sort(b);
        System.out.println(Arrays.equals(a, b) ? "Anagram" : "Not Anagram");
    }
}`,
    },
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next().toLowerCase();
        String s2 = sc.next().toLowerCase();
        // TODO: check if s1 and s2 are anagrams using sorted char arrays
    }
}`,
    solution: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[] a = sc.next().toLowerCase().toCharArray();
        char[] b = sc.next().toLowerCase().toCharArray();
        Arrays.sort(a);
        Arrays.sort(b);
        System.out.println(Arrays.equals(a, b) ? "Anagram" : "Not Anagram");
    }
}`,
    testCases: [
      {
        id: "JCH06_A3_T1",
        label: "listen/silent",
        mockInputs: ["listen", "silent"],
        expectedOutput: "Anagram",
      },
      {
        id: "JCH06_A3_T2",
        label: "hello/world",
        mockInputs: ["hello", "world"],
        expectedOutput: "Not Anagram",
      },
      {
        id: "JCH06_A3_T3",
        label: "Different lengths",
        mockInputs: ["abc", "ab"],
        expectedOutput: "Not Anagram",
        isBoundary: true,
      },
      {
        id: "JCH06_A3_T4",
        label: "Case insensitive",
        mockInputs: ["Triangle", "Integral"],
        expectedOutput: "Anagram",
        isHidden: true,
      },
    ],
    concepts: ["Arrays.sort", "Arrays.equals", "toCharArray", "toLowerCase"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH06_L1",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "leetcode",
    tierIndex: 0,
    title: "Two Sum (Sorted Input)",
    emoji: "🎯",
    tagline: "Find two indices that sum to a target using two pointers.",
    problemStatement:
      "Read N, then N integers sorted in ascending order, then a target value. Find two elements that add up to target using the two-pointer technique. Print their 1-based indices as \"i j\" (i < j). Guaranteed exactly one solution exists.",
    inputFormat:
      "Line 1: N (2 ≤ N ≤ 100000).\nNext N lines: sorted integers.\nLast line: target integer.",
    outputFormat: "\"i j\" — 1-based indices of the two numbers (space-separated, i < j).",
    examples: [
      {
        input: "4\n2\n7\n11\n15\n9",
        output: "1 2",
        explanation: "arr[0]+arr[1] = 2+7 = 9.",
      },
      {
        input: "3\n2\n3\n4\n6",
        output: "1 3",
        explanation: "arr[0]+arr[2] = 2+4 = 6.",
      },
    ],
    constraints: [
      "2 ≤ N ≤ 100000",
      "Array is sorted in ascending order.",
      "Exactly one solution exists.",
    ],
    hints: [
      "Use int left = 0, right = n - 1;",
      "While left < right: check arr[left] + arr[right] vs target.",
      "If sum == target: print (left+1) + \" \" + (right+1) and stop.",
      "If sum < target: left++. If sum > target: right--.",
    ],
    referenceProgram: {
      title: "Two-Pointer Two Sum",
      description: "Classic two-pointer converging from both ends.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int target = sc.nextInt();
        int left = 0, right = n - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) {
                System.out.println((left + 1) + " " + (right + 1));
                return;
            } else if (sum < target) left++;
            else right--;
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int target = sc.nextInt();
        // TODO: two-pointer approach to find pair summing to target
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int target = sc.nextInt();
        int left = 0, right = n - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) {
                System.out.println((left + 1) + " " + (right + 1));
                return;
            } else if (sum < target) left++;
            else right--;
        }
    }
}`,
    testCases: [
      {
        id: "JCH06_L1_T1",
        label: "2+7=9",
        mockInputs: ["4", "2", "7", "11", "15", "9"],
        expectedOutput: "1 2",
      },
      {
        id: "JCH06_L1_T2",
        label: "2+4=6",
        mockInputs: ["3", "2", "3", "4", "6"],
        expectedOutput: "1 3",
      },
      {
        id: "JCH06_L1_T3",
        label: "First and last",
        mockInputs: ["4", "1", "5", "8", "9", "10"],
        expectedOutput: "1 4",
        isHidden: true,
      },
    ],
    concepts: ["two-pointer", "sorted array", "O(N)", "index offset"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(N)",
  },

  {
    id: "JCH06_L2",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "leetcode",
    tierIndex: 1,
    title: "Longest Common Prefix",
    emoji: "📌",
    tagline: "Find the longest prefix shared by all strings in a list.",
    problemStatement:
      "Read N strings. Find the longest common prefix (LCP) shared by all of them. If there is no common prefix, print an empty line.",
    inputFormat: "First line: N (1 ≤ N ≤ 200). Next N lines: one string each.",
    outputFormat: "The longest common prefix on one line (empty line if none).",
    examples: [
      {
        input: "3\nflower\nflow\nflight",
        output: "fl",
        explanation: "flower and flow share \"flow\", flow and flight share \"fl\".",
      },
      {
        input: "2\ndog\nracecar",
        output: "",
        explanation: "No common prefix.",
      },
      {
        input: "1\nhello",
        output: "hello",
        explanation: "Single string: prefix is itself.",
      },
    ],
    constraints: [
      "1 ≤ N ≤ 200",
      "1 ≤ string length ≤ 200",
      "Strings contain lowercase letters only.",
    ],
    hints: [
      "Start with prefix = strings[0].",
      "For each subsequent string, shorten prefix while the string doesn't start with prefix.",
      "Use String.startsWith(prefix): while (!words[i].startsWith(prefix)) prefix = prefix.substring(0, prefix.length()-1);",
      "If prefix becomes empty, stop early.",
    ],
    referenceProgram: {
      title: "Iterative Prefix Shortening",
      description: "Repeatedly trim the prefix until all strings start with it.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = sc.next();
        String prefix = words[0];
        for (int i = 1; i < n; i++) {
            while (!words[i].startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) {
                    System.out.println("");
                    return;
                }
            }
        }
        System.out.println(prefix);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = sc.next();
        // TODO: find and print longest common prefix
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = sc.next();
        String prefix = words[0];
        for (int i = 1; i < n; i++) {
            while (!words[i].startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) {
                    System.out.println("");
                    return;
                }
            }
        }
        System.out.println(prefix);
    }
}`,
    testCases: [
      {
        id: "JCH06_L2_T1",
        label: "flower/flow/flight",
        mockInputs: ["3", "flower", "flow", "flight"],
        expectedOutput: "fl",
      },
      {
        id: "JCH06_L2_T2",
        label: "No common prefix",
        mockInputs: ["2", "dog", "racecar"],
        expectedOutput: "",
      },
      {
        id: "JCH06_L2_T3",
        label: "Single string",
        mockInputs: ["1", "hello"],
        expectedOutput: "hello",
        isBoundary: true,
      },
      {
        id: "JCH06_L2_T4",
        label: "All identical",
        mockInputs: ["3", "abc", "abc", "abc"],
        expectedOutput: "abc",
        isHidden: true,
      },
    ],
    concepts: ["startsWith", "substring", "string array", "LCP"],
    xpReward: 250,
    estimatedMinutes: 20,
  },

  {
    id: "JCH06_L3",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "leetcode",
    tierIndex: 2,
    title: "String Compression",
    emoji: "🗜️",
    tagline: "Compress consecutive repeated characters; output original if not shorter.",
    problemStatement:
      "Read a string. Compress it: replace runs of identical characters with the character followed by its count — but only include the count if it is greater than 1 (e.g. \"aab\" → \"a2b\" not \"a2b1\"). If the compressed string is NOT shorter than the original, print the original instead.",
    inputFormat: "A single non-empty string (lowercase letters only, length ≤ 10000).",
    outputFormat: "The compressed string, or the original if compression didn't help.",
    examples: [
      {
        input: "aabcccdddd",
        output: "a2bc3d4",
        explanation: "a×2, b×1(no count), c×3, d×4 → \"a2bc3d4\" (7 < 10).",
      },
      {
        input: "abcd",
        output: "abcd",
        explanation: "Compressed \"abcd\" would be same length; print original.",
      },
      {
        input: "aaaa",
        output: "a4",
      },
    ],
    constraints: ["1 ≤ |s| ≤ 10000", "Only lowercase letters."],
    hints: [
      "Use a StringBuilder and a while loop to count runs (similar to RLE).",
      "Append char, then only append count if count > 1.",
      "Compare compressed.length() with s.length().",
      "If compressed is shorter, print compressed; else print original.",
    ],
    referenceProgram: {
      title: "Conditional Run-Length Compression",
      description: "Build compressed string, compare length, decide which to print.",
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
            while (i < s.length() && s.charAt(i) == c) { count++; i++; }
            sb.append(c);
            if (count > 1) sb.append(count);
        }
        String compressed = sb.toString();
        System.out.println(compressed.length() < s.length() ? compressed : s);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder sb = new StringBuilder();
        // TODO: compress s (count only if > 1), print compressed if shorter else original
        System.out.println(s);
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
            while (i < s.length() && s.charAt(i) == c) { count++; i++; }
            sb.append(c);
            if (count > 1) sb.append(count);
        }
        String compressed = sb.toString();
        System.out.println(compressed.length() < s.length() ? compressed : s);
    }
}`,
    testCases: [
      {
        id: "JCH06_L3_T1",
        label: "aabcccdddd",
        mockInputs: ["aabcccdddd"],
        expectedOutput: "a2bc3d4",
      },
      {
        id: "JCH06_L3_T2",
        label: "No improvement",
        mockInputs: ["abcd"],
        expectedOutput: "abcd",
        isBoundary: true,
      },
      {
        id: "JCH06_L3_T3",
        label: "All same",
        mockInputs: ["aaaa"],
        expectedOutput: "a4",
      },
      {
        id: "JCH06_L3_T4",
        label: "Single char",
        mockInputs: ["a"],
        expectedOutput: "a",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["StringBuilder", "nested while", "compression", "string comparison"],
    xpReward: 250,
    estimatedMinutes: 20,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH06_H1",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "hackathon",
    tierIndex: 0,
    title: "Matrix Rotation",
    emoji: "🔄",
    tagline: "Rotate an N×N matrix 90° clockwise in-place.",
    problemStatement:
      "Read N, then an N×N integer matrix (N lines of N space-separated integers). Print the matrix rotated 90 degrees clockwise.",
    inputFormat:
      "First line: N (1 ≤ N ≤ 10).\nNext N lines: N space-separated integers each.",
    outputFormat:
      "N lines of N space-separated integers — the rotated matrix.",
    examples: [
      {
        input: "3\n1 2 3\n4 5 6\n7 8 9",
        output: "7 4 1\n8 5 2\n9 6 3",
        explanation: "90° CW: new[i][j] = old[n-1-j][i].",
      },
      {
        input: "1\n5",
        output: "5",
      },
    ],
    constraints: ["1 ≤ N ≤ 10"],
    hints: [
      "Allocate int[][] result = new int[n][n];",
      "The formula for 90° CW rotation: result[i][j] = mat[n-1-j][i]",
      "Nested for loops: for i in 0..n-1, for j in 0..n-1.",
      "Print result row by row with space-separated values.",
    ],
    referenceProgram: {
      title: "90° Clockwise Rotation",
      description: "Apply result[i][j] = mat[n-1-j][i] into a new array.",
      code: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) mat[i][j] = sc.nextInt();
        int[][] result = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) result[i][j] = mat[n-1-j][i];
        for (int i = 0; i < n; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) {
                if (j > 0) sb.append(" ");
                sb.append(result[i][j]);
            }
            System.out.println(sb.toString());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) mat[i][j] = sc.nextInt();
        // TODO: rotate mat 90 degrees clockwise and print
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] mat = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) mat[i][j] = sc.nextInt();
        int[][] result = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) result[i][j] = mat[n-1-j][i];
        for (int i = 0; i < n; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) {
                if (j > 0) sb.append(" ");
                sb.append(result[i][j]);
            }
            System.out.println(sb.toString());
        }
    }
}`,
    testCases: [
      {
        id: "JCH06_H1_T1",
        label: "3×3 rotation",
        mockInputs: ["3", "1 2 3", "4 5 6", "7 8 9"],
        expectedOutput: "7 4 1\n8 5 2\n9 6 3",
      },
      {
        id: "JCH06_H1_T2",
        label: "1×1",
        mockInputs: ["1", "5"],
        expectedOutput: "5",
        isBoundary: true,
      },
      {
        id: "JCH06_H1_T3",
        label: "2×2 rotation",
        mockInputs: ["2", "1 2", "3 4"],
        expectedOutput: "3 1\n4 2",
        isHidden: true,
      },
      {
        id: "JCH06_H1_T4",
        label: "4×4 rotation",
        mockInputs: ["4", "1 2 3 4", "5 6 7 8", "9 10 11 12", "13 14 15 16"],
        expectedOutput: "13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4",
        isHidden: true,
      },
    ],
    concepts: ["2D arrays", "rotation formula", "nested for", "StringBuilder"],
    xpReward: 400,
    estimatedMinutes: 30,
    timeComplexityTarget: "O(N²)",
    designChallenge:
      "Implement in-place rotation without a second array using the transpose-then-reverse approach.",
  },

  {
    id: "JCH06_H2",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "hackathon",
    tierIndex: 1,
    title: "Text Statistics Engine",
    emoji: "📊",
    tagline: "Analyse a paragraph for word frequency, length, and sentence count.",
    problemStatement:
      "Read N (the number of words on the first line), then read N words (one per line — all lowercase). Compute and print:\n1. \"Top3: w1 w2 w3\" — the 3 most frequent words (alphabetical order for ties); if fewer than 3 distinct words, print as many as available.\n2. \"AvgLen: x.xx\" — average word length formatted to 2 decimal places.\n3. \"Longest: w\" — the longest word (first alphabetically if tie).\n4. \"Sentences: k\" — count of words ending with '.' (treated as sentence-ending words).",
    inputFormat:
      "First line: N (1 ≤ N ≤ 200).\nNext N lines: one word per line (may include trailing '.').",
    outputFormat:
      "Four lines as described above.",
    examples: [
      {
        input: "7\nhello\nworld\nhello\njava\nhello\nworld\nbye.",
        output: "Top3: hello world java\nAvgLen: 4.71\nLongest: hello\nSentences: 1",
        explanation:
          "hello×3, world×2, java×1, bye.×1. Top3 by freq: hello(3), world(2), then java and bye. tie at 1 — alphabetically java before bye → java. AvgLen=(5+5+5+4+5+5+4)/7=33/7≈4.71. Longest: hello(5 chars). Sentences: bye. ends with dot → 1.",
      },
    ],
    constraints: [
      "1 ≤ N ≤ 200",
      "Words may end with '.' to mark sentence end.",
      "All other characters are lowercase letters.",
    ],
    hints: [
      "Use int[] freq array with a parallel String[] unique array to track frequencies (no HashMap needed).",
      "Sort by frequency descending, then alphabetically for ties.",
      "Average length = total character count / N.",
      "Count sentence-ending words: check if word.endsWith(\".\").",
      "For longest, strip trailing '.' before comparing length.",
    ],
    referenceProgram: {
      title: "Text Statistics with Arrays",
      description: "Manual frequency tracking with parallel arrays; sort for top-3.",
      code: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = sc.next();

        // frequency count using parallel arrays
        String[] unique = new String[n];
        int[] freq = new int[n];
        int uniqueCount = 0;
        for (String w : words) {
            boolean found = false;
            for (int i = 0; i < uniqueCount; i++) {
                if (unique[i].equals(w)) { freq[i]++; found = true; break; }
            }
            if (!found) { unique[uniqueCount] = w; freq[uniqueCount] = 1; uniqueCount++; }
        }

        // sort unique words: primary = freq desc, secondary = alpha asc
        for (int i = 0; i < uniqueCount - 1; i++) {
            for (int j = i + 1; j < uniqueCount; j++) {
                boolean swap = freq[j] > freq[i] || (freq[j] == freq[i] && unique[j].compareTo(unique[i]) < 0);
                if (swap) {
                    int tf = freq[i]; freq[i] = freq[j]; freq[j] = tf;
                    String ts = unique[i]; unique[i] = unique[j]; unique[j] = ts;
                }
            }
        }

        StringBuilder top3sb = new StringBuilder("Top3: ");
        int limit = Math.min(3, uniqueCount);
        for (int i = 0; i < limit; i++) {
            if (i > 0) top3sb.append(" ");
            top3sb.append(unique[i]);
        }
        System.out.println(top3sb.toString());

        // average length
        int totalLen = 0;
        for (String w : words) totalLen += w.length();
        System.out.printf("AvgLen: %.2f%n", (double) totalLen / n);

        // longest word (strip trailing dot for length comparison)
        String longest = "";
        int longestLen = 0;
        for (String w : words) {
            String stripped = w.endsWith(".") ? w.substring(0, w.length()-1) : w;
            int len = stripped.length();
            if (len > longestLen || (len == longestLen && stripped.compareTo(longest) < 0)) {
                longest = stripped;
                longestLen = len;
            }
        }
        System.out.println("Longest: " + longest);

        // sentence count
        int sentences = 0;
        for (String w : words) if (w.endsWith(".")) sentences++;
        System.out.println("Sentences: " + sentences);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = sc.next();
        // TODO: compute Top3, AvgLen, Longest, Sentences
    }
}`,
    solution: `import java.util.Scanner;
import java.util.Arrays;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = sc.next();

        String[] unique = new String[n];
        int[] freq = new int[n];
        int uniqueCount = 0;
        for (String w : words) {
            boolean found = false;
            for (int i = 0; i < uniqueCount; i++) {
                if (unique[i].equals(w)) { freq[i]++; found = true; break; }
            }
            if (!found) { unique[uniqueCount] = w; freq[uniqueCount] = 1; uniqueCount++; }
        }

        for (int i = 0; i < uniqueCount - 1; i++) {
            for (int j = i + 1; j < uniqueCount; j++) {
                boolean swap = freq[j] > freq[i] || (freq[j] == freq[i] && unique[j].compareTo(unique[i]) < 0);
                if (swap) {
                    int tf = freq[i]; freq[i] = freq[j]; freq[j] = tf;
                    String ts = unique[i]; unique[i] = unique[j]; unique[j] = ts;
                }
            }
        }

        StringBuilder top3sb = new StringBuilder("Top3: ");
        int limit = Math.min(3, uniqueCount);
        for (int i = 0; i < limit; i++) {
            if (i > 0) top3sb.append(" ");
            top3sb.append(unique[i]);
        }
        System.out.println(top3sb.toString());

        int totalLen = 0;
        for (String w : words) totalLen += w.length();
        System.out.printf("AvgLen: %.2f%n", (double) totalLen / n);

        String longest = "";
        int longestLen = 0;
        for (String w : words) {
            String stripped = w.endsWith(".") ? w.substring(0, w.length()-1) : w;
            int len = stripped.length();
            if (len > longestLen || (len == longestLen && stripped.compareTo(longest) < 0)) {
                longest = stripped;
                longestLen = len;
            }
        }
        System.out.println("Longest: " + longest);

        int sentences = 0;
        for (String w : words) if (w.endsWith(".")) sentences++;
        System.out.println("Sentences: " + sentences);
    }
}`,
    testCases: [
      {
        id: "JCH06_H2_T1",
        label: "7 words example",
        mockInputs: ["7", "hello", "world", "hello", "java", "hello", "world", "bye."],
        expectedOutput: "Top3: hello world java\nAvgLen: 4.71\nLongest: hello\nSentences: 1",
      },
      {
        id: "JCH06_H2_T2",
        label: "Single word",
        mockInputs: ["1", "hello."],
        expectedOutput: "Top3: hello.\nAvgLen: 6.00\nLongest: hello\nSentences: 1",
        isBoundary: true,
      },
      {
        id: "JCH06_H2_T3",
        label: "All unique, no sentences",
        mockInputs: ["3", "abc", "de", "fghi"],
        expectedOutput: "Top3: abc de fghi\nAvgLen: 3.00\nLongest: fghi\nSentences: 0",
        isHidden: true,
      },
    ],
    concepts: ["frequency counting", "sorting", "String methods", "printf"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend to report the most common bigram (pair of consecutive words) in the input.",
  },

  {
    id: "JCH06_H3",
    chapterId: "JCH06_ARRAYS",
    chapterNumber: 6,
    tier: "hackathon",
    tierIndex: 2,
    title: "Simple Regex Matcher",
    emoji: "🔍",
    tagline: "Implement basic '.' and '*' pattern matching from scratch.",
    problemStatement:
      "Implement a basic pattern matcher supporting two special characters:\n- '.' matches any single character.\n- '*' matches zero or more of the preceding character.\nRead a pattern, then a string. Print \"MATCH\" if the pattern matches the entire string, \"NO MATCH\" otherwise.\n\nNote: '*' always follows a character (e.g. \"a*\", \".*\"); patterns will be valid.",
    inputFormat: "Line 1: the pattern. Line 2: the string to match.",
    outputFormat: "\"MATCH\" or \"NO MATCH\".",
    examples: [
      {
        input: "a*b\naab",
        output: "MATCH",
        explanation: "a* matches 'aa', then b matches 'b'.",
      },
      {
        input: ".*c\nxyzc",
        output: "MATCH",
        explanation: ".* matches any chars, then c matches 'c'.",
      },
      {
        input: "a.c\nabc",
        output: "MATCH",
      },
      {
        input: "a*b\nb",
        output: "MATCH",
        explanation: "a* can match zero 'a's.",
      },
      {
        input: "a.c\nac",
        output: "NO MATCH",
        explanation: "'.' must match exactly one character.",
      },
    ],
    constraints: [
      "Pattern length ≤ 30, string length ≤ 30.",
      "'*' always follows a character or '.', never appears at the start.",
      "Pattern and string contain only lowercase letters, '.', and '*'.",
    ],
    hints: [
      "Use recursive backtracking: match(pattern, pi, text, ti).",
      "If pi == pattern.length and ti == text.length, return true.",
      "If next char in pattern is '*': try zero matches (skip p[pi] and p[pi+1]) OR consume one char from text if it matches p[pi], then recurse.",
      "If p[pi] is '.' or matches t[ti]: recurse with pi+1, ti+1.",
      "Otherwise return false.",
    ],
    referenceProgram: {
      title: "Recursive Regex Backtracking",
      description: "Classic recursive solution handling '.' and '*' with backtracking.",
      code: `import java.util.Scanner;
public class Main {
    static String p, t;

    static boolean match(int pi, int ti) {
        if (pi == p.length()) return ti == t.length();
        boolean firstMatch = ti < t.length() && (p.charAt(pi) == '.' || p.charAt(pi) == t.charAt(ti));
        if (pi + 1 < p.length() && p.charAt(pi + 1) == '*') {
            // zero occurrences: skip "x*" in pattern
            // one or more: consume one matching char then retry "x*"
            return match(pi + 2, ti) || (firstMatch && match(pi, ti + 1));
        }
        return firstMatch && match(pi + 1, ti + 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        p = sc.next();
        t = sc.next();
        System.out.println(match(0, 0) ? "MATCH" : "NO MATCH");
    }
}`,
      explanation:
        "When '*' follows, we branch: skip the 'x*' pair (zero uses) or consume one matching character and try again (one+ uses). This covers all cases.",
    },
    starterCode: `import java.util.Scanner;
public class Main {
    static String p, t;

    static boolean match(int pi, int ti) {
        // TODO: implement recursive pattern matching
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        p = sc.next();
        t = sc.next();
        System.out.println(match(0, 0) ? "MATCH" : "NO MATCH");
    }
}`,
    solution: `import java.util.Scanner;
public class Main {
    static String p, t;

    static boolean match(int pi, int ti) {
        if (pi == p.length()) return ti == t.length();
        boolean firstMatch = ti < t.length() && (p.charAt(pi) == '.' || p.charAt(pi) == t.charAt(ti));
        if (pi + 1 < p.length() && p.charAt(pi + 1) == '*') {
            return match(pi + 2, ti) || (firstMatch && match(pi, ti + 1));
        }
        return firstMatch && match(pi + 1, ti + 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        p = sc.next();
        t = sc.next();
        System.out.println(match(0, 0) ? "MATCH" : "NO MATCH");
    }
}`,
    testCases: [
      {
        id: "JCH06_H3_T1",
        label: "a*b matches aab",
        mockInputs: ["a*b", "aab"],
        expectedOutput: "MATCH",
      },
      {
        id: "JCH06_H3_T2",
        label: ".* matches anything",
        mockInputs: [".*c", "xyzc"],
        expectedOutput: "MATCH",
      },
      {
        id: "JCH06_H3_T3",
        label: "a.c matches abc",
        mockInputs: ["a.c", "abc"],
        expectedOutput: "MATCH",
      },
      {
        id: "JCH06_H3_T4",
        label: "a* zero matches",
        mockInputs: ["a*b", "b"],
        expectedOutput: "MATCH",
        isBoundary: true,
      },
      {
        id: "JCH06_H3_T5",
        label: "dot must match one char",
        mockInputs: ["a.c", "ac"],
        expectedOutput: "NO MATCH",
        isBoundary: true,
      },
      {
        id: "JCH06_H3_T6",
        label: "exact match no specials",
        mockInputs: ["abc", "abc"],
        expectedOutput: "MATCH",
        isHidden: true,
      },
      {
        id: "JCH06_H3_T7",
        label: "no match",
        mockInputs: ["abc", "abz"],
        expectedOutput: "NO MATCH",
        isHidden: true,
      },
    ],
    concepts: ["recursion", "backtracking", "charAt", "pattern matching"],
    xpReward: 400,
    estimatedMinutes: 30,
    timeComplexityTarget: "O(2^N) worst case; O(M*N) with memoisation",
    designChallenge:
      "Optimise with memoisation (store results for each (pi,ti) pair in a 2D boolean array) to achieve O(M*N) time.",
  },
];
