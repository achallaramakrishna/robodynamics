// ─── Yamuna Program Bank — Chapter 01: Hello World & Output ─────────────────
// Chapter: JCH01_HELLO
// Concepts: System.out.println, System.out.printf, System.out.print,
//           String concatenation, escape sequences
// 15 programs across 5 tiers (3 per tier)

import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH01_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────── BEGINNER ────────────────────────────────────

  {
    id: "JCH01_B1",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "beginner",
    tierIndex: 0,
    title: "Hello World",
    emoji: "👋",
    tagline: "Your very first Java program — say hello to the world!",
    problemStatement:
      "Write a Java program that prints the classic message `Hello, World!` to the console.\n\n" +
      "This is the traditional first program every programmer writes. It verifies your environment is set up correctly and introduces `System.out.println`.",
    inputFormat: "No input required.",
    outputFormat: "Print exactly: `Hello, World!`",
    examples: [
      {
        input: "",
        output: "Hello, World!",
        explanation: "The program prints the greeting and exits. No user input needed.",
      },
    ],
    constraints: [
      "Output must match exactly, including the comma and exclamation mark.",
      "No input is read.",
      "Use System.out.println to produce the output.",
    ],
    hints: [
      "System.out.println prints a line of text followed by a newline character.",
      "String literals in Java are enclosed in double quotes: \"Hello, World!\"",
      "Make sure the comma is between Hello and World, and the exclamation mark is at the end.",
      "Your main method is the entry point: public static void main(String[] args).",
    ],
    referenceProgram: {
      title: "Simple Text Output",
      description: "How to print any fixed text in Java",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        System.out.println("Namaste, India!");\n` +
        `    }\n` +
        `}`,
      explanation:
        "System.out.println writes the given string to standard output and moves the cursor to the next line. The string literal is enclosed in double quotes.",
    },
    starterCode:
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        // Write your code here\n` +
      `    }\n` +
      `}`,
    solution:
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        System.out.println("Hello, World!");\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_B1_T1",
        label: "Basic output",
        mockInputs: [],
        expectedOutput: "Hello, World!",
      },
      {
        id: "JCH01_B1_T2",
        label: "Exact match check",
        mockInputs: [],
        expectedOutput: "Hello, World!",
        isBoundary: true,
      },
    ],
    concepts: ["System.out.println", "String literals", "main method"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH01_B2",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "beginner",
    tierIndex: 1,
    title: "Personal Greeting",
    emoji: "🙏",
    tagline: "Read a name and greet the user personally.",
    problemStatement:
      "Read the user's name from standard input and print a personalised welcome message.\n\n" +
      "Given a name, output: `Hello, <name>! Welcome to Java.`",
    inputFormat: "A single line containing a name (no spaces guaranteed).",
    outputFormat: "A single line: `Hello, <name>! Welcome to Java.`",
    examples: [
      {
        input: "Priya",
        output: "Hello, Priya! Welcome to Java.",
        explanation: "The name Priya is inserted into the greeting template.",
      },
      {
        input: "Arjun",
        output: "Hello, Arjun! Welcome to Java.",
        explanation: "Same template, different name.",
      },
    ],
    constraints: [
      "Name will be a single word with no spaces.",
      "Name length is between 1 and 50 characters.",
      "Output must end with a period.",
    ],
    hints: [
      "Use Scanner to read a line of input: Scanner sc = new Scanner(System.in); String name = sc.nextLine();",
      "You can concatenate strings using the + operator.",
      "The output format is: \"Hello, \" + name + \"! Welcome to Java.\"",
      "Remember to import java.util.Scanner at the top of your file.",
    ],
    referenceProgram: {
      title: "Reading and Printing a String",
      description: "Using Scanner to read a name and print it back",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        String city = sc.nextLine();\n` +
        `        System.out.println("Welcome to " + city + "!");\n` +
        `    }\n` +
        `}`,
      explanation:
        "Scanner reads the next full line of input. String concatenation with + joins pieces together into one output string.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        // Read the name and print the greeting\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String name = sc.nextLine();\n` +
      `        System.out.println("Hello, " + name + "! Welcome to Java.");\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_B2_T1",
        label: "Priya",
        mockInputs: ["Priya"],
        expectedOutput: "Hello, Priya! Welcome to Java.",
      },
      {
        id: "JCH01_B2_T2",
        label: "Arjun",
        mockInputs: ["Arjun"],
        expectedOutput: "Hello, Arjun! Welcome to Java.",
      },
      {
        id: "JCH01_B2_T3",
        label: "Single character name",
        mockInputs: ["A"],
        expectedOutput: "Hello, A! Welcome to Java.",
        isBoundary: true,
      },
    ],
    concepts: ["Scanner", "nextLine", "String concatenation", "System.out.println"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH01_B3",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "beginner",
    tierIndex: 2,
    title: "Multi-line Bio",
    emoji: "📋",
    tagline: "Read name and age, then print a two-line bio card.",
    problemStatement:
      "Read a person's name and age from standard input. Print their bio on two separate lines:\n\n" +
      "Line 1: `Name: <name>`\nLine 2: `Age: <age>`",
    inputFormat:
      "Line 1: a name (String).\nLine 2: an age (int).",
    outputFormat:
      "Line 1: `Name: <name>`\nLine 2: `Age: <age>`",
    examples: [
      {
        input: "Kavya\n17",
        output: "Name: Kavya\nAge: 17",
        explanation: "Two inputs produce two labelled output lines.",
      },
      {
        input: "Rohit\n21",
        output: "Name: Rohit\nAge: 21",
        explanation: "Age is read as an integer.",
      },
    ],
    constraints: [
      "Name is a single word, length 1–50.",
      "Age is a non-negative integer, 0–120.",
      "Print exactly two lines in the specified format.",
    ],
    hints: [
      "Read name with sc.nextLine() and age with sc.nextInt().",
      "Use two separate System.out.println calls for the two lines.",
      "Concatenate the label string with the variable: \"Name: \" + name",
      "Integer variables print their numeric value when concatenated with a String.",
    ],
    referenceProgram: {
      title: "Reading Multiple Inputs",
      description: "Reading a String then an int on separate lines",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        String subject = sc.nextLine();\n` +
        `        int marks = sc.nextInt();\n` +
        `        System.out.println("Subject: " + subject);\n` +
        `        System.out.println("Marks: " + marks);\n` +
        `    }\n` +
        `}`,
      explanation:
        "nextLine reads a full text line; nextInt parses the next token as an integer. Each println call produces one output line.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        // Read name and age, then print the bio\n` +
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
      `        System.out.println("Name: " + name);\n` +
      `        System.out.println("Age: " + age);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_B3_T1",
        label: "Kavya age 17",
        mockInputs: ["Kavya", "17"],
        expectedOutput: "Name: Kavya\nAge: 17",
      },
      {
        id: "JCH01_B3_T2",
        label: "Rohit age 21",
        mockInputs: ["Rohit", "21"],
        expectedOutput: "Name: Rohit\nAge: 21",
      },
      {
        id: "JCH01_B3_T3",
        label: "Age zero (boundary)",
        mockInputs: ["Baby", "0"],
        expectedOutput: "Name: Baby\nAge: 0",
        isBoundary: true,
      },
    ],
    concepts: ["Scanner", "nextLine", "nextInt", "multi-line output", "String concatenation"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  // ─────────────────────────── INTERMEDIATE ─────────────────────────────────

  {
    id: "JCH01_I1",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "intermediate",
    tierIndex: 0,
    title: "Formatted Receipt",
    emoji: "🧾",
    tagline: "Print a shop receipt using printf for aligned columns.",
    problemStatement:
      "Read an item name (String) and its price (double) from standard input.\n" +
      "Print a formatted receipt line using printf:\n\n" +
      "`Item: <item> | Price: Rs.<price>`\n\n" +
      "The price must be formatted to exactly two decimal places.",
    inputFormat:
      "Line 1: item name (single word).\nLine 2: price as a decimal number.",
    outputFormat:
      "`Item: <item> | Price: Rs.<price with 2 decimals>`",
    examples: [
      {
        input: "Chai\n12.5",
        output: "Item: Chai | Price: Rs.12.50",
        explanation: "12.5 is formatted as 12.50 with two decimal places.",
      },
      {
        input: "Samosa\n5.0",
        output: "Item: Samosa | Price: Rs.5.00",
        explanation: "5.0 prints as 5.00.",
      },
    ],
    constraints: [
      "Item name is a single word, no spaces.",
      "Price is a positive double, up to 10000.00.",
      "Use printf with %.2f format specifier for the price.",
    ],
    hints: [
      "System.out.printf allows format specifiers. Use %s for strings and %.2f for doubles.",
      "The format string: \"Item: %s | Price: Rs.%.2f%n\" where %n is a platform-agnostic newline.",
      "Read price using sc.nextDouble().",
      "printf does not add a newline automatically — use %n or \\n at the end.",
    ],
    referenceProgram: {
      title: "Using printf for Formatting",
      description: "printf format specifiers for strings and decimals",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        String product = sc.nextLine();\n` +
        `        double cost = sc.nextDouble();\n` +
        `        System.out.printf("Product: %s costs Rs.%.2f%n", product, cost);\n` +
        `    }\n` +
        `}`,
      explanation:
        "%s inserts a string, %.2f inserts a floating-point number with exactly 2 decimal places, %n writes a newline.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        // Read item and price, print formatted receipt\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String item = sc.nextLine();\n` +
      `        double price = sc.nextDouble();\n` +
      `        System.out.printf("Item: %s | Price: Rs.%.2f%n", item, price);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_I1_T1",
        label: "Chai Rs.12.50",
        mockInputs: ["Chai", "12.5"],
        expectedOutput: "Item: Chai | Price: Rs.12.50",
      },
      {
        id: "JCH01_I1_T2",
        label: "Samosa Rs.5.00",
        mockInputs: ["Samosa", "5.0"],
        expectedOutput: "Item: Samosa | Price: Rs.5.00",
      },
      {
        id: "JCH01_I1_T3",
        label: "Whole number price (boundary)",
        mockInputs: ["Coffee", "100"],
        expectedOutput: "Item: Coffee | Price: Rs.100.00",
        isBoundary: true,
      },
    ],
    concepts: ["System.out.printf", "format specifiers", "%.2f", "%s", "Scanner.nextDouble"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH01_I2",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "intermediate",
    tierIndex: 1,
    title: "Star Banner",
    emoji: "⭐",
    tagline: "Print a welcome banner framed with asterisks.",
    problemStatement:
      "Print a decorative text banner with no user input.\n\n" +
      "The banner consists of:\n" +
      "- Line 1: exactly 20 asterisk characters (`********************`)\n" +
      "- Line 2: `  WELCOME TO JAVA  ` (two spaces before and after)\n" +
      "- Line 3: exactly 20 asterisk characters (`********************`)",
    inputFormat: "No input.",
    outputFormat: "Three lines as described.",
    examples: [
      {
        input: "",
        output: "********************\n  WELCOME TO JAVA  \n********************",
        explanation:
          "Top and bottom borders are 20 stars. Middle line has two leading and two trailing spaces.",
      },
    ],
    constraints: [
      "No input is read.",
      "The asterisk border must be exactly 20 characters.",
      "The middle text must have exactly two spaces on each side.",
    ],
    hints: [
      "You can use a String.repeat call: \"*\".repeat(20) produces 20 asterisks.",
      "Alternatively, declare a String border = \"********************\"; (count them!).",
      "The middle line is: \"  WELCOME TO JAVA  \" — two spaces, text, two spaces.",
      "Use three separate println calls, one for each line.",
    ],
    referenceProgram: {
      title: "String.repeat for Borders",
      description: "Using String.repeat to build separator lines",
      code:
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        String border = "-".repeat(20);\n` +
        `        System.out.println(border);\n` +
        `        System.out.println("  HELLO JAVA  ");\n` +
        `        System.out.println(border);\n` +
        `    }\n` +
        `}`,
      explanation:
        "String.repeat(n) returns a new String with the original repeated n times. It avoids manually counting characters.",
    },
    starterCode:
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        // Print the three-line banner\n` +
      `    }\n` +
      `}`,
    solution:
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        String border = "*".repeat(20);\n` +
      `        System.out.println(border);\n` +
      `        System.out.println("  WELCOME TO JAVA  ");\n` +
      `        System.out.println(border);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_I2_T1",
        label: "Banner output",
        mockInputs: [],
        expectedOutput: "********************\n  WELCOME TO JAVA  \n********************",
      },
      {
        id: "JCH01_I2_T2",
        label: "Exact border length (boundary)",
        mockInputs: [],
        expectedOutput: "********************\n  WELCOME TO JAVA  \n********************",
        isBoundary: true,
      },
    ],
    concepts: ["System.out.println", "String.repeat", "string literals", "fixed output"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH01_I3",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "intermediate",
    tierIndex: 2,
    title: "Temperature Card",
    emoji: "🌡️",
    tagline: "Print a city temperature card with aligned columns using printf.",
    problemStatement:
      "Read a city name and temperature (double) from standard input.\n" +
      "Print them using the printf format: `%-15s %6.1f°C`\n\n" +
      "The city name is left-aligned in a field of width 15; the temperature is right-aligned in a field of width 6 with one decimal place, followed by `°C`.",
    inputFormat:
      "Line 1: city name (single word).\nLine 2: temperature in Celsius (double).",
    outputFormat:
      "A single formatted line: `%-15s %6.1f°C`",
    examples: [
      {
        input: "Mumbai\n32.5",
        output: "Mumbai           32.5°C",
        explanation:
          "Mumbai is padded to 15 chars left-aligned; 32.5 is right-aligned in 6 chars.",
      },
      {
        input: "Delhi\n41.0",
        output: "Delhi            41.0°C",
        explanation: "Delhi is padded with spaces to fill the 15-char left column.",
      },
    ],
    constraints: [
      "City name is a single word, max 14 characters.",
      "Temperature is a double between -50.0 and 60.0.",
      "Use printf with format specifiers %-15s and %6.1f.",
    ],
    hints: [
      "%-15s means: left-align the string in a field 15 characters wide.",
      "%6.1f means: right-align the float in a field 6 characters wide, 1 decimal place.",
      "Append °C directly after %6.1f in the format string.",
      "The degree symbol ° can be typed as a Unicode escape \\u00B0 or pasted directly.",
    ],
    referenceProgram: {
      title: "printf Width and Alignment",
      description: "Using %-Ns for left-align and %Nf for right-align",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        String country = sc.nextLine();\n` +
        `        double pop = sc.nextDouble();\n` +
        `        System.out.printf("%-15s %10.2f%n", country, pop);\n` +
        `    }\n` +
        `}`,
      explanation:
        "%-15s pads the string with spaces on the right. %10.2f reserves 10 characters for the number, showing 2 decimal places.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        // Read city and temperature, print formatted card\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String city = sc.nextLine();\n` +
      `        double temp = sc.nextDouble();\n` +
      `        System.out.printf("%-15s %6.1f°C%n", city, temp);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_I3_T1",
        label: "Mumbai 32.5",
        mockInputs: ["Mumbai", "32.5"],
        expectedOutput: "Mumbai           32.5°C",
      },
      {
        id: "JCH01_I3_T2",
        label: "Delhi 41.0",
        mockInputs: ["Delhi", "41.0"],
        expectedOutput: "Delhi            41.0°C",
      },
      {
        id: "JCH01_I3_T3",
        label: "Negative temperature (boundary)",
        mockInputs: ["Shimla", "-5.0"],
        expectedOutput: "Shimla            -5.0°C",
        isBoundary: true,
      },
    ],
    concepts: ["System.out.printf", "%-Ns left-align", "%N.1f right-align", "field width"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  // ─────────────────────────── ADVANCED ─────────────────────────────────────

  {
    id: "JCH01_A1",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "advanced",
    tierIndex: 0,
    title: "Invoice Printer",
    emoji: "📄",
    tagline: "Read 3 items, print an aligned invoice table with a total.",
    problemStatement:
      "Read 3 items, each with a name and price (double). Print an invoice table:\n\n" +
      "```\n" +
      "Item             Price\n" +
      "--------------------\n" +
      "<item1>          Rs.<price1>\n" +
      "<item2>          Rs.<price2>\n" +
      "<item3>          Rs.<price3>\n" +
      "--------------------\n" +
      "Total            Rs.<total>\n" +
      "```\n\n" +
      "Item names are left-aligned in a 17-char field; prices are formatted to 2 decimal places.",
    inputFormat:
      "6 lines: name1, price1, name2, price2, name3, price3.",
    outputFormat:
      "Invoice table as described above.",
    examples: [
      {
        input: "Chai\n12.50\nSamosa\n8.00\nJalebi\n15.75",
        output:
          "Item             Price\n" +
          "--------------------\n" +
          "Chai             Rs.12.50\n" +
          "Samosa           Rs.8.00\n" +
          "Jalebi           Rs.15.75\n" +
          "--------------------\n" +
          "Total            Rs.36.25",
        explanation: "Three items with total 12.50+8.00+15.75 = 36.25.",
      },
    ],
    constraints: [
      "Each item name is at most 15 characters.",
      "Prices are positive doubles up to 9999.99.",
      "Total is the arithmetic sum of the three prices.",
      "Use printf with %-17s for item names.",
    ],
    hints: [
      "Loop 3 times to read pairs of name and price using sc.nextLine() and sc.nextDouble().",
      "After reading a double, call sc.nextLine() to consume the leftover newline before the next name.",
      "Accumulate the total: double total = 0; in a loop total += price;",
      "Use printf(\"%-17s Rs.%.2f%n\", name, price) for each row.",
      "The separator line is 20 dashes: \"-\".repeat(20)",
    ],
    referenceProgram: {
      title: "Reading Mixed Input in a Loop",
      description: "Reading alternating String/double pairs cleanly with Scanner",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        double sum = 0;\n` +
        `        for (int i = 0; i < 2; i++) {\n` +
        `            String name = sc.nextLine();\n` +
        `            double val = Double.parseDouble(sc.nextLine());\n` +
        `            sum += val;\n` +
        `            System.out.printf("%-12s Rs.%.2f%n", name, val);\n` +
        `        }\n` +
        `        System.out.printf("Total        Rs.%.2f%n", sum);\n` +
        `    }\n` +
        `}`,
      explanation:
        "Using Double.parseDouble(sc.nextLine()) avoids the Scanner newline issue that arises when mixing nextDouble and nextLine.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        // Read 3 items and prices, print formatted invoice\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String sep = "-".repeat(20);\n` +
      `        System.out.printf("%-17s%s%n", "Item", "Price");\n` +
      `        System.out.println(sep);\n` +
      `        double total = 0;\n` +
      `        String[] names = new String[3];\n` +
      `        double[] prices = new double[3];\n` +
      `        for (int i = 0; i < 3; i++) {\n` +
      `            names[i] = sc.nextLine();\n` +
      `            prices[i] = Double.parseDouble(sc.nextLine());\n` +
      `            total += prices[i];\n` +
      `        }\n` +
      `        for (int i = 0; i < 3; i++) {\n` +
      `            System.out.printf("%-17sRs.%.2f%n", names[i], prices[i]);\n` +
      `        }\n` +
      `        System.out.println(sep);\n` +
      `        System.out.printf("%-17sRs.%.2f%n", "Total", total);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_A1_T1",
        label: "Chai Samosa Jalebi",
        mockInputs: ["Chai", "12.50", "Samosa", "8.00", "Jalebi", "15.75"],
        expectedOutput:
          "Item             Price\n" +
          "--------------------\n" +
          "Chai             Rs.12.50\n" +
          "Samosa           Rs.8.00\n" +
          "Jalebi           Rs.15.75\n" +
          "--------------------\n" +
          "Total            Rs.36.25",
      },
      {
        id: "JCH01_A1_T2",
        label: "All same price",
        mockInputs: ["Apple", "10.00", "Banana", "10.00", "Cherry", "10.00"],
        expectedOutput:
          "Item             Price\n" +
          "--------------------\n" +
          "Apple            Rs.10.00\n" +
          "Banana           Rs.10.00\n" +
          "Cherry           Rs.10.00\n" +
          "--------------------\n" +
          "Total            Rs.30.00",
      },
      {
        id: "JCH01_A1_T3",
        label: "Very low prices (boundary)",
        mockInputs: ["A", "0.01", "B", "0.01", "C", "0.01"],
        expectedOutput:
          "Item             Price\n" +
          "--------------------\n" +
          "A                Rs.0.01\n" +
          "B                Rs.0.01\n" +
          "C                Rs.0.01\n" +
          "--------------------\n" +
          "Total            Rs.0.03",
        isBoundary: true,
      },
    ],
    concepts: ["printf", "loops", "arrays", "Double.parseDouble", "running total"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH01_A2",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "advanced",
    tierIndex: 1,
    title: "ASCII Name Box",
    emoji: "🔲",
    tagline: "Draw a box of asterisks around any name you type.",
    problemStatement:
      "Read a name and print it inside a box of `*` characters that fits snugly around it.\n\n" +
      "The box has a 1-character padding on each side:\n" +
      "```\n" +
      "*********\n" +
      "* Priya *\n" +
      "*********\n" +
      "```\n" +
      "Box width = name length + 4 (two stars + two spaces).",
    inputFormat: "One line: a name (may contain spaces).",
    outputFormat: "Three lines forming the ASCII box.",
    examples: [
      {
        input: "Priya",
        output: "*********\n* Priya *\n*********",
        explanation: "Priya is 5 chars, box width = 5+4 = 9 stars.",
      },
      {
        input: "Arjun Kumar",
        output: "***************\n* Arjun Kumar *\n***************",
        explanation: "Arjun Kumar is 11 chars, box width = 11+4 = 15 stars.",
      },
    ],
    constraints: [
      "Name may contain spaces.",
      "Name length is between 1 and 50 characters.",
      "Box width must be exactly name.length() + 4.",
    ],
    hints: [
      "Compute the box width as int width = name.length() + 4;",
      "The border line is \"*\".repeat(width).",
      "The middle line is: \"* \" + name + \" *\"",
      "Print: border, middle, border — three println calls.",
    ],
    referenceProgram: {
      title: "Dynamic Border Based on Input Length",
      description: "Sizing a border to match input string length",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        String word = sc.nextLine();\n` +
        `        String border = "+".repeat(word.length() + 4);\n` +
        `        System.out.println(border);\n` +
        `        System.out.println("| " + word + " |");\n` +
        `        System.out.println(border);\n` +
        `    }\n` +
        `}`,
      explanation:
        "String.length() returns the number of characters. Using it to size the border ensures the box always fits.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String name = sc.nextLine();\n` +
      `        // Print the name inside a * box\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String name = sc.nextLine();\n` +
      `        String border = "*".repeat(name.length() + 4);\n` +
      `        System.out.println(border);\n` +
      `        System.out.println("* " + name + " *");\n` +
      `        System.out.println(border);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_A2_T1",
        label: "Priya",
        mockInputs: ["Priya"],
        expectedOutput: "*********\n* Priya *\n*********",
      },
      {
        id: "JCH01_A2_T2",
        label: "Name with space",
        mockInputs: ["Arjun Kumar"],
        expectedOutput: "***************\n* Arjun Kumar *\n***************",
      },
      {
        id: "JCH01_A2_T3",
        label: "Single character (boundary)",
        mockInputs: ["X"],
        expectedOutput: "*****\n* X *\n*****",
        isBoundary: true,
      },
    ],
    concepts: ["String.length", "String.repeat", "string concatenation", "dynamic formatting"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH01_A3",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "advanced",
    tierIndex: 2,
    title: "Progress Bar",
    emoji: "📊",
    tagline: "Visualise a percentage as a 10-character text progress bar.",
    problemStatement:
      "Read an integer percentage (0–100) and print a progress bar in the format:\n\n" +
      "`[####......] 40%`\n\n" +
      "The bar is always exactly 10 characters wide inside the brackets.\n" +
      "Filled characters are `#`; empty characters are `.`.\n" +
      "Filled count = round(percentage / 10) (integer division, round down).",
    inputFormat: "A single integer between 0 and 100.",
    outputFormat: "`[<bar>] <percentage>%` where bar is 10 chars of # and .",
    examples: [
      {
        input: "40",
        output: "[####......] 40%",
        explanation: "40/10 = 4 filled, 6 empty.",
      },
      {
        input: "100",
        output: "[##########] 100%",
        explanation: "100/10 = 10 filled, 0 empty.",
      },
      {
        input: "0",
        output: "[..........] 0%",
        explanation: "0 filled, 10 empty.",
      },
    ],
    constraints: [
      "Percentage is an integer 0–100.",
      "Bar is always exactly 10 characters wide.",
      "Filled = percentage / 10 (integer division).",
    ],
    hints: [
      "Integer division in Java truncates: 45 / 10 = 4.",
      "Filled count: int filled = percentage / 10;",
      "Empty count: int empty = 10 - filled;",
      "Build the bar: String bar = \"#\".repeat(filled) + \".\".repeat(empty);",
      "Print: System.out.println(\"[\" + bar + \"] \" + percentage + \"%\");",
    ],
    referenceProgram: {
      title: "Building a String from Parts",
      description: "Computing filled/empty split and assembling a bar string",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        int pct = sc.nextInt();\n` +
        `        int filled = pct / 10;\n` +
        `        int empty = 10 - filled;\n` +
        `        String bar = "=".repeat(filled) + "-".repeat(empty);\n` +
        `        System.out.println("|" + bar + "| " + pct + "%");\n` +
        `    }\n` +
        `}`,
      explanation:
        "Integer division gives the number of filled segments. String.repeat constructs the visual segments.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int percentage = sc.nextInt();\n` +
      `        // Build and print the progress bar\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int percentage = sc.nextInt();\n` +
      `        int filled = percentage / 10;\n` +
      `        int empty = 10 - filled;\n` +
      `        String bar = "#".repeat(filled) + ".".repeat(empty);\n` +
      `        System.out.println("[" + bar + "] " + percentage + "%");\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_A3_T1",
        label: "40%",
        mockInputs: ["40"],
        expectedOutput: "[####......] 40%",
      },
      {
        id: "JCH01_A3_T2",
        label: "100%",
        mockInputs: ["100"],
        expectedOutput: "[##########] 100%",
      },
      {
        id: "JCH01_A3_T3",
        label: "0% (boundary)",
        mockInputs: ["0"],
        expectedOutput: "[..........] 0%",
        isBoundary: true,
      },
      {
        id: "JCH01_A3_T4",
        label: "55% (truncation check)",
        mockInputs: ["55"],
        expectedOutput: "[#####.....] 55%",
        isHidden: true,
      },
    ],
    concepts: ["integer division", "String.repeat", "string concatenation", "modular construction"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  // ─────────────────────────── LEETCODE ─────────────────────────────────────

  {
    id: "JCH01_L1",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "leetcode",
    tierIndex: 0,
    title: "Column Aligner",
    emoji: "📐",
    tagline: "Read key-value pairs and print values right-aligned to the longest key.",
    problemStatement:
      "Read N lines, each containing a key and a value separated by a single space.\n" +
      "Print all pairs with values right-aligned such that all values start at column (maxKeyLength + 2).\n\n" +
      "Keys are left-aligned; values fill the remaining space.\n\n" +
      "Example with max key length 7:\n" +
      "```\n" +
      "Name    Alice\n" +
      "Age     30\n" +
      "Country India\n" +
      "```",
    inputFormat:
      "Line 1: integer N.\nNext N lines: a key and a value separated by a space.",
    outputFormat:
      "N lines with keys left-aligned and values right-aligned starting at column maxKeyLength+2.",
    examples: [
      {
        input: "3\nName Alice\nAge 30\nCountry India",
        output: "Name    Alice\nAge     30\nCountry India",
        explanation:
          "Longest key is Country (7 chars). Column width = 7+1 = 8. Keys padded to 8 with printf %-8s.",
      },
      {
        input: "2\nX 1\nLongKey hello",
        output: "X       1\nLongKey hello",
        explanation: "LongKey is 7 chars. Column width = 8.",
      },
    ],
    constraints: [
      "1 <= N <= 50.",
      "Keys and values contain no spaces.",
      "Key length <= 30.",
    ],
    hints: [
      "Read all N pairs first into two arrays (keys[] and values[]).",
      "Find the maximum key length: int maxLen = 0; then loop and update.",
      "Format string: \"%-\" + (maxLen + 1) + \"s%s%n\"",
      "Use String.format or printf to apply the dynamic width.",
    ],
    referenceProgram: {
      title: "Dynamic Column Width with printf",
      description: "Building a format string dynamically using computed width",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        int n = sc.nextInt(); sc.nextLine();\n` +
        `        String[] keys = new String[n];\n` +
        `        String[] vals = new String[n];\n` +
        `        int maxLen = 0;\n` +
        `        for (int i = 0; i < n; i++) {\n` +
        `            String line = sc.nextLine();\n` +
        `            int sp = line.indexOf(' ');\n` +
        `            keys[i] = line.substring(0, sp);\n` +
        `            vals[i] = line.substring(sp + 1);\n` +
        `            if (keys[i].length() > maxLen) maxLen = keys[i].length();\n` +
        `        }\n` +
        `        String fmt = "%-" + (maxLen + 1) + "s%s%n";\n` +
        `        for (int i = 0; i < n; i++) System.out.printf(fmt, keys[i], vals[i]);\n` +
        `    }\n` +
        `}`,
      explanation:
        "Building the format string at runtime with the computed maxLen enables perfectly aligned output regardless of input length.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        sc.nextLine();\n` +
      `        // Read pairs, compute max key length, print aligned\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        sc.nextLine();\n` +
      `        String[] keys = new String[n];\n` +
      `        String[] vals = new String[n];\n` +
      `        int maxLen = 0;\n` +
      `        for (int i = 0; i < n; i++) {\n` +
      `            String line = sc.nextLine();\n` +
      `            int sp = line.indexOf(' ');\n` +
      `            keys[i] = line.substring(0, sp);\n` +
      `            vals[i] = line.substring(sp + 1);\n` +
      `            if (keys[i].length() > maxLen) maxLen = keys[i].length();\n` +
      `        }\n` +
      `        String fmt = "%-" + (maxLen + 1) + "s%s%n";\n` +
      `        for (int i = 0; i < n; i++) {\n` +
      `            System.out.printf(fmt, keys[i], vals[i]);\n` +
      `        }\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_L1_T1",
        label: "3 pairs",
        mockInputs: ["3", "Name Alice", "Age 30", "Country India"],
        expectedOutput: "Name    Alice\nAge     30\nCountry India",
      },
      {
        id: "JCH01_L1_T2",
        label: "2 pairs with long key",
        mockInputs: ["2", "X 1", "LongKey hello"],
        expectedOutput: "X       1\nLongKey hello",
      },
      {
        id: "JCH01_L1_T3",
        label: "Single pair (boundary)",
        mockInputs: ["1", "K V"],
        expectedOutput: "K V",
        isBoundary: true,
      },
    ],
    concepts: ["dynamic format strings", "indexOf", "substring", "max computation", "printf"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(N)",
  },

  {
    id: "JCH01_L2",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "leetcode",
    tierIndex: 1,
    title: "Diamond Pattern",
    emoji: "💎",
    tagline: "Print a symmetric diamond of asterisks of width N.",
    problemStatement:
      "Read an odd integer N and print a diamond pattern of `*` characters with maximum width N.\n\n" +
      "For N=5:\n" +
      "```\n" +
      "  *\n" +
      " ***\n" +
      "*****\n" +
      " ***\n" +
      "  *\n" +
      "```\n" +
      "The top half (including middle) has rows of width 1, 3, 5, ..., N.\n" +
      "The bottom half (below middle) mirrors the top.",
    inputFormat: "A single odd integer N (1 <= N <= 19).",
    outputFormat: "N lines forming the diamond.",
    examples: [
      {
        input: "5",
        output: "  *\n ***\n*****\n ***\n  *",
        explanation: "5 rows. Middle row has 5 stars, top/bottom rows have 1 star.",
      },
      {
        input: "1",
        output: "*",
        explanation: "Single row, single star.",
      },
    ],
    constraints: [
      "N is a positive odd integer.",
      "1 <= N <= 19.",
      "No trailing spaces on any line.",
    ],
    hints: [
      "The number of rows is N. Middle row index is N/2.",
      "For row i (0-indexed), stars = 2*i+1 for i <= N/2; stars = 2*(N-1-i)+1 for i > N/2.",
      "Leading spaces for row i: spaces = N/2 - i for i <= N/2; spaces = i - N/2 for i > N/2.",
      "Use \" \".repeat(spaces) + \"*\".repeat(stars) for each line.",
    ],
    referenceProgram: {
      title: "Triangle Pattern",
      description: "Building a half-triangle pattern as foundation",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        int n = sc.nextInt();\n` +
        `        // Upper half\n` +
        `        for (int i = 1; i <= n; i += 2) {\n` +
        `            int spaces = (n - i) / 2;\n` +
        `            System.out.println(" ".repeat(spaces) + "*".repeat(i));\n` +
        `        }\n` +
        `    }\n` +
        `}`,
      explanation:
        "Building the upper half first, then mirroring it, is cleaner than trying to do both in one loop.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        // Print diamond of width n\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int n = sc.nextInt();\n` +
      `        // Upper half including middle\n` +
      `        for (int i = 1; i <= n; i += 2) {\n` +
      `            int spaces = (n - i) / 2;\n` +
      `            System.out.println(" ".repeat(spaces) + "*".repeat(i));\n` +
      `        }\n` +
      `        // Lower half\n` +
      `        for (int i = n - 2; i >= 1; i -= 2) {\n` +
      `            int spaces = (n - i) / 2;\n` +
      `            System.out.println(" ".repeat(spaces) + "*".repeat(i));\n` +
      `        }\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_L2_T1",
        label: "N=5",
        mockInputs: ["5"],
        expectedOutput: "  *\n ***\n*****\n ***\n  *",
      },
      {
        id: "JCH01_L2_T2",
        label: "N=3",
        mockInputs: ["3"],
        expectedOutput: " *\n***\n *",
      },
      {
        id: "JCH01_L2_T3",
        label: "N=1 (boundary)",
        mockInputs: ["1"],
        expectedOutput: "*",
        isBoundary: true,
      },
      {
        id: "JCH01_L2_T4",
        label: "N=7",
        mockInputs: ["7"],
        expectedOutput: "   *\n  ***\n *****\n*******\n *****\n  ***\n   *",
        isHidden: true,
      },
    ],
    concepts: ["nested patterns", "integer arithmetic", "String.repeat", "symmetry"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(N^2)",
  },

  {
    id: "JCH01_L3",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "leetcode",
    tierIndex: 2,
    title: "Number Formatter",
    emoji: "🔢",
    tagline: "Format large integers with comma separators like 1,234,567.",
    problemStatement:
      "Read a non-negative integer (as a String to handle large values) and print it with comma separators grouping digits in threes from the right.\n\n" +
      "Examples: `1234567` → `1,234,567`; `1000` → `1,000`; `999` → `999`.",
    inputFormat: "A single line containing a non-negative integer (up to 18 digits).",
    outputFormat: "The integer with commas inserted every 3 digits from the right.",
    examples: [
      {
        input: "1234567",
        output: "1,234,567",
        explanation: "Groups: 1 | 234 | 567 → 1,234,567",
      },
      {
        input: "1000",
        output: "1,000",
        explanation: "Groups: 1 | 000 → 1,000",
      },
      {
        input: "42",
        output: "42",
        explanation: "Fewer than 4 digits — no comma needed.",
      },
    ],
    constraints: [
      "Input is a non-negative integer with no leading zeros (except '0' itself).",
      "Up to 18 digits long.",
      "Output must have commas separating each group of 3 digits from the right.",
    ],
    hints: [
      "You can use String.format(\"%,d\", Long.parseLong(input)) which Java handles natively.",
      "Alternatively iterate backwards over the digit string, inserting a comma every 3 digits.",
      "StringBuilder is useful for building the output in reverse.",
      "After building in reverse, call StringBuilder.reverse() to get the final string.",
    ],
    referenceProgram: {
      title: "Manual Comma Insertion",
      description: "Building comma-separated output by iterating the digit string backwards",
      code:
        `import java.util.Scanner;\n` +
        `\n` +
        `public class Main {\n` +
        `    public static void main(String[] args) {\n` +
        `        Scanner sc = new Scanner(System.in);\n` +
        `        String num = sc.nextLine().trim();\n` +
        `        StringBuilder sb = new StringBuilder();\n` +
        `        int count = 0;\n` +
        `        for (int i = num.length() - 1; i >= 0; i--) {\n` +
        `            if (count > 0 && count % 3 == 0) sb.append(',');\n` +
        `            sb.append(num.charAt(i));\n` +
        `            count++;\n` +
        `        }\n` +
        `        System.out.println(sb.reverse().toString());\n` +
        `    }\n` +
        `}`,
      explanation:
        "Iterating from right to left allows easy grouping. Reversing at the end gives the correct order.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String num = sc.nextLine().trim();\n` +
      `        // Format num with comma separators\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String num = sc.nextLine().trim();\n` +
      `        StringBuilder sb = new StringBuilder();\n` +
      `        int count = 0;\n` +
      `        for (int i = num.length() - 1; i >= 0; i--) {\n` +
      `            if (count > 0 && count % 3 == 0) sb.append(',');\n` +
      `            sb.append(num.charAt(i));\n` +
      `            count++;\n` +
      `        }\n` +
      `        System.out.println(sb.reverse().toString());\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_L3_T1",
        label: "1234567",
        mockInputs: ["1234567"],
        expectedOutput: "1,234,567",
      },
      {
        id: "JCH01_L3_T2",
        label: "1000",
        mockInputs: ["1000"],
        expectedOutput: "1,000",
      },
      {
        id: "JCH01_L3_T3",
        label: "Single digit (boundary)",
        mockInputs: ["0"],
        expectedOutput: "0",
        isBoundary: true,
      },
      {
        id: "JCH01_L3_T4",
        label: "18-digit number",
        mockInputs: ["123456789012345678"],
        expectedOutput: "123,456,789,012,345,678",
        isHidden: true,
      },
    ],
    concepts: ["StringBuilder", "string traversal", "modulo arithmetic", "reverse"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(N) where N = number of digits",
  },

  // ─────────────────────────── HACKATHON ────────────────────────────────────

  {
    id: "JCH01_H1",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "hackathon",
    tierIndex: 0,
    title: "Report Card Generator",
    emoji: "📝",
    tagline: "Generate a fully formatted school report card from student scores.",
    problemStatement:
      "Read a student's name and scores in 5 subjects (Math, Science, English, History, PE).\n" +
      "Print a formatted report card with:\n" +
      "- A header with the student's name\n" +
      "- A table of subject | score | grade\n" +
      "- A footer with overall average and letter grade\n\n" +
      "Grade scale: A(90-100), B(80-89), C(70-79), D(60-69), F(<60)\n\n" +
      "```\n" +
      "===========================\n" +
      "  REPORT CARD: Priya\n" +
      "===========================\n" +
      "Subject     Score  Grade\n" +
      "---------------------------\n" +
      "Math           92    A\n" +
      "Science        78    C\n" +
      "English        85    B\n" +
      "History        61    D\n" +
      "PE             95    A\n" +
      "---------------------------\n" +
      "Average:     82.2    B\n" +
      "===========================\n" +
      "```",
    inputFormat:
      "Line 1: student name.\nLines 2-6: integer score for Math, Science, English, History, PE.",
    outputFormat: "Formatted report card as shown above.",
    examples: [
      {
        input: "Priya\n92\n78\n85\n61\n95",
        output:
          "===========================\n" +
          "  REPORT CARD: Priya\n" +
          "===========================\n" +
          "Subject     Score  Grade\n" +
          "---------------------------\n" +
          "Math           92    A\n" +
          "Science        78    C\n" +
          "English        85    B\n" +
          "History        61    D\n" +
          "PE             95    A\n" +
          "---------------------------\n" +
          "Average:     82.2    B\n" +
          "===========================",
        explanation: "Average = (92+78+85+61+95)/5 = 411/5 = 82.2, grade B.",
      },
    ],
    constraints: [
      "Scores are integers 0–100.",
      "Average is printed with one decimal place.",
      "Header/footer lines are exactly 27 characters of = or -.",
    ],
    hints: [
      "Store subject names in a String array: {\"Math\",\"Science\",\"English\",\"History\",\"PE\"}",
      "Write a helper method: static String grade(double s) { if (s>=90) return \"A\"; ... }",
      "Use printf(\"%-12s%5d    %s%n\", subject, score, grade) for each subject row.",
      "Average = sum / 5.0 (use 5.0 for double division).",
      "Print the border lines with \"=\".repeat(27) and \"-\".repeat(27).",
    ],
    referenceProgram: {
      title: "Grade Helper Method",
      description: "A static method that returns the letter grade for a score",
      code:
        `public class Main {\n` +
        `    static String grade(double score) {\n` +
        `        if (score >= 90) return "A";\n` +
        `        if (score >= 80) return "B";\n` +
        `        if (score >= 70) return "C";\n` +
        `        if (score >= 60) return "D";\n` +
        `        return "F";\n` +
        `    }\n` +
        `    public static void main(String[] args) {\n` +
        `        System.out.println(grade(85)); // B\n` +
        `    }\n` +
        `}`,
      explanation:
        "A static helper method keeps the grading logic reusable and the main method clean.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `\n` +
      `    static String grade(double score) {\n` +
      `        // Return "A", "B", "C", "D", or "F"\n` +
      `        return "";\n` +
      `    }\n` +
      `\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String name = sc.nextLine();\n` +
      `        String[] subjects = {"Math", "Science", "English", "History", "PE"};\n` +
      `        int[] scores = new int[5];\n` +
      `        // Read scores and print the report card\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `\n` +
      `    static String grade(double score) {\n` +
      `        if (score >= 90) return "A";\n` +
      `        if (score >= 80) return "B";\n` +
      `        if (score >= 70) return "C";\n` +
      `        if (score >= 60) return "D";\n` +
      `        return "F";\n` +
      `    }\n` +
      `\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        String name = sc.nextLine();\n` +
      `        String[] subjects = {"Math", "Science", "English", "History", "PE"};\n` +
      `        int[] scores = new int[5];\n` +
      `        int sum = 0;\n` +
      `        for (int i = 0; i < 5; i++) {\n` +
      `            scores[i] = Integer.parseInt(sc.nextLine().trim());\n` +
      `            sum += scores[i];\n` +
      `        }\n` +
      `        String eq = "=".repeat(27);\n` +
      `        String dash = "-".repeat(27);\n` +
      `        System.out.println(eq);\n` +
      `        System.out.println("  REPORT CARD: " + name);\n` +
      `        System.out.println(eq);\n` +
      `        System.out.printf("%-12s%5s  %5s%n", "Subject", "Score", "Grade");\n` +
      `        System.out.println(dash);\n` +
      `        for (int i = 0; i < 5; i++) {\n` +
      `            System.out.printf("%-12s%5d    %s%n", subjects[i], scores[i], grade(scores[i]));\n` +
      `        }\n` +
      `        System.out.println(dash);\n` +
      `        double avg = sum / 5.0;\n` +
      `        System.out.printf("%-12s%5.1f    %s%n", "Average:", avg, grade(avg));\n` +
      `        System.out.println(eq);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_H1_T1",
        label: "Priya mixed scores",
        mockInputs: ["Priya", "92", "78", "85", "61", "95"],
        expectedOutput:
          "===========================\n" +
          "  REPORT CARD: Priya\n" +
          "===========================\n" +
          "Subject     Score  Grade\n" +
          "---------------------------\n" +
          "Math           92    A\n" +
          "Science        78    C\n" +
          "English        85    B\n" +
          "History        61    D\n" +
          "PE             95    A\n" +
          "---------------------------\n" +
          "Average:     82.2    B\n" +
          "===========================",
      },
      {
        id: "JCH01_H1_T2",
        label: "All failing scores (boundary)",
        mockInputs: ["Tom", "50", "45", "55", "40", "30"],
        expectedOutput:
          "===========================\n" +
          "  REPORT CARD: Tom\n" +
          "===========================\n" +
          "Subject     Score  Grade\n" +
          "---------------------------\n" +
          "Math           50    F\n" +
          "Science        45    F\n" +
          "English        55    F\n" +
          "History        40    F\n" +
          "PE             30    F\n" +
          "---------------------------\n" +
          "Average:     44.0    F\n" +
          "===========================",
        isBoundary: true,
      },
      {
        id: "JCH01_H1_T3",
        label: "Perfect scores",
        mockInputs: ["Alice", "100", "100", "100", "100", "100"],
        expectedOutput:
          "===========================\n" +
          "  REPORT CARD: Alice\n" +
          "===========================\n" +
          "Subject     Score  Grade\n" +
          "---------------------------\n" +
          "Math          100    A\n" +
          "Science       100    A\n" +
          "English       100    A\n" +
          "History       100    A\n" +
          "PE            100    A\n" +
          "---------------------------\n" +
          "Average:    100.0    A\n" +
          "===========================",
        isHidden: true,
      },
    ],
    concepts: ["static methods", "arrays", "printf formatting", "grade logic", "average"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend the report card to include a rank among a class of students, and highlight the student's weakest subject with a recommendation message.",
  },

  {
    id: "JCH01_H2",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "hackathon",
    tierIndex: 1,
    title: "CLI Table Renderer",
    emoji: "🗂️",
    tagline: "Read pipe-separated data rows and render them as a bordered ASCII table.",
    problemStatement:
      "Read rows of pipe-separated (`|`) values and render them as an ASCII table with borders.\n\n" +
      "First row is the header. Each cell is padded to the column's maximum width + 1 space on each side.\n\n" +
      "```\n" +
      "+--------+-------+--------+\n" +
      "| Name   | Age   | City   |\n" +
      "+--------+-------+--------+\n" +
      "| Alice  | 30    | Mumbai |\n" +
      "| Bob    | 25    | Delhi  |\n" +
      "+--------+-------+--------+\n" +
      "```",
    inputFormat:
      "Line 1: integer R (number of rows including header).\nNext R lines: pipe-separated values.",
    outputFormat: "ASCII table with border lines and padded cells.",
    examples: [
      {
        input: "3\nName|Age|City\nAlice|30|Mumbai\nBob|25|Delhi",
        output:
          "+--------+-------+--------+\n" +
          "| Name   | Age   | City   |\n" +
          "+--------+-------+--------+\n" +
          "| Alice  | 30    | Mumbai |\n" +
          "| Bob    | 25    | Delhi  |\n" +
          "+--------+-------+--------+",
        explanation:
          "Column widths: Name=5, Age=3, City=6. Each cell gets 1 space padding on each side.",
      },
    ],
    constraints: [
      "1 <= R <= 20, 1 <= columns <= 8.",
      "Cell values have no leading/trailing spaces.",
      "Column width = max cell length in that column (including header).",
    ],
    hints: [
      "Parse all rows first, storing as String[][] grid.",
      "Compute int[] colWidths by finding max length in each column.",
      "Build a separator line: \"+\" + (\"-\".repeat(w+2) + \"+\") for each column.",
      "Build a data line: \"| \" + String.format(\"%-\" + w + \"s\", cell) + \" |\" per cell.",
      "Print: separator, header row, separator, data rows, separator.",
    ],
    referenceProgram: {
      title: "Column Width Computation",
      description: "Finding max cell width per column across all rows",
      code:
        `// Skeleton: compute column widths\n` +
        `int cols = grid[0].length;\n` +
        `int[] colWidths = new int[cols];\n` +
        `for (String[] row : grid) {\n` +
        `    for (int c = 0; c < cols; c++) {\n` +
        `        if (row[c].length() > colWidths[c]) colWidths[c] = row[c].length();\n` +
        `    }\n` +
        `}`,
      explanation:
        "Iterate over all rows and all columns, keeping the running maximum length per column.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `\n` +
      `    static String separator(int[] widths) {\n` +
      `        StringBuilder sb = new StringBuilder();\n` +
      `        for (int w : widths) {\n` +
      `            sb.append("+").append("-".repeat(w + 2));\n` +
      `        }\n` +
      `        sb.append("+");\n` +
      `        return sb.toString();\n` +
      `    }\n` +
      `\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int r = Integer.parseInt(sc.nextLine().trim());\n` +
      `        String[][] grid = new String[r][];\n` +
      `        // Parse rows, compute widths, print table\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `\n` +
      `    static String separator(int[] widths) {\n` +
      `        StringBuilder sb = new StringBuilder();\n` +
      `        for (int w : widths) {\n` +
      `            sb.append("+").append("-".repeat(w + 2));\n` +
      `        }\n` +
      `        sb.append("+");\n` +
      `        return sb.toString();\n` +
      `    }\n` +
      `\n` +
      `    static String dataRow(String[] row, int[] widths) {\n` +
      `        StringBuilder sb = new StringBuilder();\n` +
      `        for (int c = 0; c < row.length; c++) {\n` +
      `            sb.append("| ").append(String.format("%-" + widths[c] + "s", row[c])).append(" ");\n` +
      `        }\n` +
      `        sb.append("|");\n` +
      `        return sb.toString();\n` +
      `    }\n` +
      `\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int r = Integer.parseInt(sc.nextLine().trim());\n` +
      `        String[][] grid = new String[r][];\n` +
      `        for (int i = 0; i < r; i++) {\n` +
      `            grid[i] = sc.nextLine().split("\\\\|", -1);\n` +
      `        }\n` +
      `        int cols = grid[0].length;\n` +
      `        int[] widths = new int[cols];\n` +
      `        for (String[] row : grid) {\n` +
      `            for (int c = 0; c < cols; c++) {\n` +
      `                if (row[c].length() > widths[c]) widths[c] = row[c].length();\n` +
      `            }\n` +
      `        }\n` +
      `        String sep = separator(widths);\n` +
      `        System.out.println(sep);\n` +
      `        System.out.println(dataRow(grid[0], widths));\n` +
      `        System.out.println(sep);\n` +
      `        for (int i = 1; i < r; i++) {\n` +
      `            System.out.println(dataRow(grid[i], widths));\n` +
      `        }\n` +
      `        System.out.println(sep);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_H2_T1",
        label: "3 rows, 3 columns",
        mockInputs: ["3", "Name|Age|City", "Alice|30|Mumbai", "Bob|25|Delhi"],
        expectedOutput:
          "+--------+-------+--------+\n" +
          "| Name   | Age   | City   |\n" +
          "+--------+-------+--------+\n" +
          "| Alice  | 30    | Mumbai |\n" +
          "| Bob    | 25    | Delhi  |\n" +
          "+--------+-------+--------+",
      },
      {
        id: "JCH01_H2_T2",
        label: "Header only (boundary)",
        mockInputs: ["1", "ID|Value"],
        expectedOutput:
          "+----+-------+\n" +
          "| ID | Value |\n" +
          "+----+-------+",
        isBoundary: true,
      },
      {
        id: "JCH01_H2_T3",
        label: "Single column",
        mockInputs: ["2", "Fruit", "Apple"],
        expectedOutput:
          "+-------+\n" +
          "| Fruit |\n" +
          "+-------+\n" +
          "| Apple |\n" +
          "+-------+",
        isHidden: true,
      },
    ],
    concepts: ["2D arrays", "split", "StringBuilder", "column width computation", "table formatting"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Add support for a --csv flag that outputs CSV instead of ASCII table, reusing the same parsed grid.",
  },

  {
    id: "JCH01_H3",
    chapterId: "JCH01_HELLO",
    chapterNumber: 1,
    tier: "hackathon",
    tierIndex: 2,
    title: "Console Dashboard",
    emoji: "🖥️",
    tagline: "Build a live-style system stats dashboard with bar charts in the console.",
    problemStatement:
      "Read CPU%, RAM%, and DISK% (integers 0–100) and render a system stats dashboard with labeled horizontal bar charts.\n\n" +
      "Each bar is 20 characters wide. Filled with `#`, remainder with `.`.\n\n" +
      "```\n" +
      "================================\n" +
      "   SYSTEM STATS DASHBOARD\n" +
      "================================\n" +
      "CPU  [ 60%] [############........]\n" +
      "RAM  [ 75%] [###############.....]\n" +
      "DISK [ 30%] [######..............]\n" +
      "================================\n" +
      "```\n\n" +
      "Filled bars = round(pct * 20 / 100) (integer division).",
    inputFormat:
      "Three lines: CPU percentage, RAM percentage, DISK percentage (each an integer 0–100).",
    outputFormat: "Dashboard as shown above.",
    examples: [
      {
        input: "60\n75\n30",
        output:
          "================================\n" +
          "   SYSTEM STATS DASHBOARD\n" +
          "================================\n" +
          "CPU  [ 60%] [############........]\n" +
          "RAM  [ 75%] [###############.....]\n" +
          "DISK [ 30%] [######..............]\n" +
          "================================",
        explanation:
          "CPU 60%: 60*20/100=12 hashes. RAM 75%: 15 hashes. DISK 30%: 6 hashes.",
      },
    ],
    constraints: [
      "CPU, RAM, DISK are integers 0–100.",
      "Bar width is exactly 20 characters.",
      "Filled count = pct * 20 / 100 (integer division).",
      "Border line is exactly 32 = characters.",
    ],
    hints: [
      "Compute filled as int filled = pct * 20 / 100; and empty = 20 - filled;",
      "Build bar string: \"#\".repeat(filled) + \".\".repeat(empty)",
      "printf(\"%-4s [%3d%%] [%s]%n\", label, pct, bar) for each stat row.",
      "The border line is \"=\".repeat(32).",
      "%%  in printf outputs a literal % sign.",
    ],
    referenceProgram: {
      title: "Bar Chart Row Builder",
      description: "Building a single stats bar row with printf",
      code:
        `public class Main {\n` +
        `    static void printBar(String label, int pct) {\n` +
        `        int filled = pct * 20 / 100;\n` +
        `        String bar = "#".repeat(filled) + ".".repeat(20 - filled);\n` +
        `        System.out.printf("%-4s [%3d%%] [%s]%n", label, pct, bar);\n` +
        `    }\n` +
        `    public static void main(String[] args) {\n` +
        `        printBar("CPU", 60);\n` +
        `    }\n` +
        `}`,
      explanation:
        "%-4s left-aligns the label in 4 chars; %3d%% right-aligns the percentage in 3 chars followed by a literal %. The bar string is pre-computed.",
    },
    starterCode:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `\n` +
      `    static void printBar(String label, int pct) {\n` +
      `        // Build and print one dashboard row\n` +
      `    }\n` +
      `\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int cpu  = sc.nextInt();\n` +
      `        int ram  = sc.nextInt();\n` +
      `        int disk = sc.nextInt();\n` +
      `        // Print dashboard\n` +
      `    }\n` +
      `}`,
    solution:
      `import java.util.Scanner;\n` +
      `\n` +
      `public class Main {\n` +
      `\n` +
      `    static void printBar(String label, int pct) {\n` +
      `        int filled = pct * 20 / 100;\n` +
      `        String bar = "#".repeat(filled) + ".".repeat(20 - filled);\n` +
      `        System.out.printf("%-4s [%3d%%] [%s]%n", label, pct, bar);\n` +
      `    }\n` +
      `\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        int cpu  = sc.nextInt();\n` +
      `        int ram  = sc.nextInt();\n` +
      `        int disk = sc.nextInt();\n` +
      `        String border = "=".repeat(32);\n` +
      `        System.out.println(border);\n` +
      `        System.out.println("   SYSTEM STATS DASHBOARD");\n` +
      `        System.out.println(border);\n` +
      `        printBar("CPU",  cpu);\n` +
      `        printBar("RAM",  ram);\n` +
      `        printBar("DISK", disk);\n` +
      `        System.out.println(border);\n` +
      `    }\n` +
      `}`,
    testCases: [
      {
        id: "JCH01_H3_T1",
        label: "CPU 60 RAM 75 DISK 30",
        mockInputs: ["60", "75", "30"],
        expectedOutput:
          "================================\n" +
          "   SYSTEM STATS DASHBOARD\n" +
          "================================\n" +
          "CPU  [ 60%] [############........]\n" +
          "RAM  [ 75%] [###############.....]\n" +
          "DISK [ 30%] [######..............]\n" +
          "================================",
      },
      {
        id: "JCH01_H3_T2",
        label: "All at 100% (boundary)",
        mockInputs: ["100", "100", "100"],
        expectedOutput:
          "================================\n" +
          "   SYSTEM STATS DASHBOARD\n" +
          "================================\n" +
          "CPU  [100%] [####################]\n" +
          "RAM  [100%] [####################]\n" +
          "DISK [100%] [####################]\n" +
          "================================",
        isBoundary: true,
      },
      {
        id: "JCH01_H3_T3",
        label: "All at 0% (boundary)",
        mockInputs: ["0", "0", "0"],
        expectedOutput:
          "================================\n" +
          "   SYSTEM STATS DASHBOARD\n" +
          "================================\n" +
          "CPU  [  0%] [....................]\n" +
          "RAM  [  0%] [....................]\n" +
          "DISK [  0%] [....................]\n" +
          "================================",
        isBoundary: true,
      },
    ],
    concepts: ["static methods", "printf", "%%", "bar chart logic", "string building"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Extend the dashboard to accept N arbitrary metric names and values, auto-scaling to fit the widest label.",
  },
];
