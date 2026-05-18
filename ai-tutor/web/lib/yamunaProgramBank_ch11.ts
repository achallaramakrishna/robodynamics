import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH11_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH11_B1",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "beginner",
    tierIndex: 0,
    title: "Greetable Interface",
    emoji: "👋",
    tagline: "Define an interface and implement it to print a greeting.",
    problemStatement:
      "Define an interface Greetable with a single method String greet(). Implement it in a class FormalGreeter that returns \"Hello, \" + name + \"!\". Read a name from stdin and print the greeting using a Greetable reference.",
    inputFormat: "A single word — the name to greet (no spaces).",
    outputFormat: "One line: \"Hello, <name>!\"",
    examples: [
      {
        input: "Alice",
        output: "Hello, Alice!",
      },
      {
        input: "World",
        output: "Hello, World!",
      },
    ],
    constraints: ["Name is a single word, 1–30 characters."],
    hints: [
      "Declare: interface Greetable { String greet(); }",
      "Implement: class FormalGreeter implements Greetable { String name; ... }",
      "Store the name in a field and return the formatted string from greet().",
      "In main, declare Greetable g = new FormalGreeter(name); then print g.greet();",
    ],
    referenceProgram: {
      title: "Greetable Interface Implementation",
      description: "Interface with single method, concrete class, polymorphic call.",
      code: `import java.util.Scanner;
interface Greetable {
    String greet();
}
class FormalGreeter implements Greetable {
    private String name;
    FormalGreeter(String name) { this.name = name; }
    public String greet() { return "Hello, " + name + "!"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        Greetable g = new FormalGreeter(name);
        System.out.println(g.greet());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Greetable {
    String greet();
}
// TODO: implement FormalGreeter that stores a name and returns "Hello, <name>!"
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        // TODO: create a Greetable reference to FormalGreeter and print greet()
    }
}`,
    solution: `import java.util.Scanner;
interface Greetable {
    String greet();
}
class FormalGreeter implements Greetable {
    private String name;
    FormalGreeter(String name) { this.name = name; }
    public String greet() { return "Hello, " + name + "!"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        Greetable g = new FormalGreeter(name);
        System.out.println(g.greet());
    }
}`,
    testCases: [
      {
        id: "JCH11_B1_T1",
        label: "Alice",
        mockInputs: ["Alice"],
        expectedOutput: "Hello, Alice!",
      },
      {
        id: "JCH11_B1_T2",
        label: "World",
        mockInputs: ["World"],
        expectedOutput: "Hello, World!",
      },
      {
        id: "JCH11_B1_T3",
        label: "Single char name",
        mockInputs: ["A"],
        expectedOutput: "Hello, A!",
        isBoundary: true,
      },
      {
        id: "JCH11_B1_T4",
        label: "Longer name",
        mockInputs: ["Ramakrishna"],
        expectedOutput: "Hello, Ramakrishna!",
        isHidden: true,
      },
    ],
    concepts: ["interface", "implements", "polymorphism", "Scanner"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH11_B2",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "beginner",
    tierIndex: 1,
    title: "Shape Area Interface",
    emoji: "📐",
    tagline: "Implement the Measurable interface to compute areas of shapes.",
    problemStatement:
      "Define an interface Measurable with method double area(). Implement it in Circle (area = π × r²) and Rectangle (area = width × height). Read a shape type ('C' or 'R'), then its dimensions. Print the area formatted to 2 decimal places.",
    inputFormat:
      "Line 1: 'C' or 'R'.\nIf 'C': Line 2: radius (double).\nIf 'R': Line 2: width (double), Line 3: height (double).",
    outputFormat: "Area formatted to 2 decimal places.",
    examples: [
      {
        input: "C\n5.0",
        output: "78.54",
        explanation: "π × 5² = 78.5398... ≈ 78.54",
      },
      {
        input: "R\n4.0\n3.0",
        output: "12.00",
      },
    ],
    constraints: ["Dimensions are positive doubles ≤ 1000.", "Shape is 'C' or 'R'."],
    hints: [
      "interface Measurable { double area(); }",
      "class Circle implements Measurable { double r; ... public double area() { return Math.PI * r * r; } }",
      "class Rectangle implements Measurable { double w, h; ... public double area() { return w * h; } }",
      "Declare Measurable shape; based on input, assign either new Circle(...) or new Rectangle(...).",
      "Use System.out.printf(\"%.2f%n\", shape.area());",
    ],
    referenceProgram: {
      title: "Shape Area via Measurable",
      description: "Two implementations of Measurable; choose at runtime based on input.",
      code: `import java.util.Scanner;
interface Measurable {
    double area();
}
class Circle implements Measurable {
    private double r;
    Circle(double r) { this.r = r; }
    public double area() { return Math.PI * r * r; }
}
class Rectangle implements Measurable {
    private double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }
    public double area() { return w * h; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        Measurable shape;
        if (type.equals("C")) {
            shape = new Circle(sc.nextDouble());
        } else {
            shape = new Rectangle(sc.nextDouble(), sc.nextDouble());
        }
        System.out.printf("%.2f%n", shape.area());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Measurable {
    double area();
}
// TODO: implement Circle and Rectangle classes that implement Measurable
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        Measurable shape;
        // TODO: assign shape based on type, then print area to 2 decimal places
        shape = null;
        System.out.printf("%.2f%n", shape.area());
    }
}`,
    solution: `import java.util.Scanner;
interface Measurable {
    double area();
}
class Circle implements Measurable {
    private double r;
    Circle(double r) { this.r = r; }
    public double area() { return Math.PI * r * r; }
}
class Rectangle implements Measurable {
    private double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }
    public double area() { return w * h; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        Measurable shape;
        if (type.equals("C")) {
            shape = new Circle(sc.nextDouble());
        } else {
            shape = new Rectangle(sc.nextDouble(), sc.nextDouble());
        }
        System.out.printf("%.2f%n", shape.area());
    }
}`,
    testCases: [
      {
        id: "JCH11_B2_T1",
        label: "Circle r=5",
        mockInputs: ["C", "5.0"],
        expectedOutput: "78.54",
      },
      {
        id: "JCH11_B2_T2",
        label: "Rectangle 4x3",
        mockInputs: ["R", "4.0", "3.0"],
        expectedOutput: "12.00",
      },
      {
        id: "JCH11_B2_T3",
        label: "Circle r=1",
        mockInputs: ["C", "1.0"],
        expectedOutput: "3.14",
        isBoundary: true,
      },
      {
        id: "JCH11_B2_T4",
        label: "Square",
        mockInputs: ["R", "7.0", "7.0"],
        expectedOutput: "49.00",
        isHidden: true,
      },
    ],
    concepts: ["interface", "implements", "polymorphism", "Math.PI", "printf"],
    xpReward: 60,
    estimatedMinutes: 8,
  },

  {
    id: "JCH11_B3",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "beginner",
    tierIndex: 2,
    title: "Polymorphic Sound",
    emoji: "🔊",
    tagline: "Call makeSound() on different Animal types via a single reference.",
    problemStatement:
      "Define an interface Animal with method String makeSound(). Implement Dog (returns \"Woof\"), Cat (returns \"Meow\"), and Cow (returns \"Moo\"). Read N, then N animal codes ('D', 'C', or 'O'). For each, create the appropriate Animal and print its sound.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 10).\nNext N lines: one character each — 'D' (Dog), 'C' (Cat), 'O' (Cow).",
    outputFormat: "N lines — one sound per line.",
    examples: [
      {
        input: "3\nD\nC\nO",
        output: "Woof\nMeow\nMoo",
      },
      {
        input: "2\nC\nC",
        output: "Meow\nMeow",
      },
    ],
    constraints: ["1 ≤ N ≤ 10", "Each code is 'D', 'C', or 'O'."],
    hints: [
      "interface Animal { String makeSound(); }",
      "class Dog implements Animal { public String makeSound() { return \"Woof\"; } }",
      "Similarly for Cat and Cow.",
      "In main, use a switch on the character to instantiate the right class.",
      "Declare Animal a; then call System.out.println(a.makeSound());",
    ],
    referenceProgram: {
      title: "Polymorphic Animal Sounds",
      description: "Interface + three implementations + switch-based dispatch.",
      code: `import java.util.Scanner;
interface Animal {
    String makeSound();
}
class Dog implements Animal { public String makeSound() { return "Woof"; } }
class Cat implements Animal { public String makeSound() { return "Meow"; } }
class Cow implements Animal { public String makeSound() { return "Moo"; } }
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            Animal a;
            switch (code) {
                case "D": a = new Dog(); break;
                case "C": a = new Cat(); break;
                default:  a = new Cow(); break;
            }
            System.out.println(a.makeSound());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Animal {
    String makeSound();
}
// TODO: implement Dog, Cat, Cow classes
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            Animal a;
            // TODO: assign correct Animal subtype based on code
            a = null;
            System.out.println(a.makeSound());
        }
    }
}`,
    solution: `import java.util.Scanner;
interface Animal {
    String makeSound();
}
class Dog implements Animal { public String makeSound() { return "Woof"; } }
class Cat implements Animal { public String makeSound() { return "Meow"; } }
class Cow implements Animal { public String makeSound() { return "Moo"; } }
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            Animal a;
            switch (code) {
                case "D": a = new Dog(); break;
                case "C": a = new Cat(); break;
                default:  a = new Cow(); break;
            }
            System.out.println(a.makeSound());
        }
    }
}`,
    testCases: [
      {
        id: "JCH11_B3_T1",
        label: "Dog Cat Cow",
        mockInputs: ["3", "D", "C", "O"],
        expectedOutput: "Woof\nMeow\nMoo",
      },
      {
        id: "JCH11_B3_T2",
        label: "Two cats",
        mockInputs: ["2", "C", "C"],
        expectedOutput: "Meow\nMeow",
      },
      {
        id: "JCH11_B3_T3",
        label: "Single dog",
        mockInputs: ["1", "D"],
        expectedOutput: "Woof",
        isBoundary: true,
      },
      {
        id: "JCH11_B3_T4",
        label: "All three types twice",
        mockInputs: ["6", "D", "C", "O", "D", "C", "O"],
        expectedOutput: "Woof\nMeow\nMoo\nWoof\nMeow\nMoo",
        isHidden: true,
      },
    ],
    concepts: ["interface", "polymorphism", "switch", "runtime dispatch"],
    xpReward: 70,
    estimatedMinutes: 8,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH11_I1",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "intermediate",
    tierIndex: 0,
    title: "Multiple Implementations",
    emoji: "🏦",
    tagline: "Two implementations of Taxable — compute tax differently per type.",
    problemStatement:
      "Define interface Taxable with method double computeTax(double amount). Implement BasicTax (5% flat) and LuxuryTax (18% flat). Read N transactions: each line has a type ('B' or 'L') and an amount. Print the tax for each transaction formatted to 2 decimal places.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 20).\nNext N lines: type ('B' or 'L') followed by amount (double).",
    outputFormat: "N lines — tax per transaction to 2 decimal places.",
    examples: [
      {
        input: "3\nB 1000.0\nL 500.0\nB 200.0",
        output: "50.00\n90.00\n10.00",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "0 < amount ≤ 100000"],
    hints: [
      "interface Taxable { double computeTax(double amount); }",
      "BasicTax: return amount * 0.05;",
      "LuxuryTax: return amount * 0.18;",
      "Read type and amount on the same line with sc.next() and sc.nextDouble().",
      "Declare Taxable t; assign based on type, then call t.computeTax(amount).",
    ],
    referenceProgram: {
      title: "Taxable Interface — Two Implementations",
      description: "Flat-rate tax implementations selected at runtime.",
      code: `import java.util.Scanner;
interface Taxable {
    double computeTax(double amount);
}
class BasicTax implements Taxable {
    public double computeTax(double amount) { return amount * 0.05; }
}
class LuxuryTax implements Taxable {
    public double computeTax(double amount) { return amount * 0.18; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            double amount = sc.nextDouble();
            Taxable t = type.equals("B") ? new BasicTax() : new LuxuryTax();
            System.out.printf("%.2f%n", t.computeTax(amount));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Taxable {
    double computeTax(double amount);
}
// TODO: implement BasicTax (5%) and LuxuryTax (18%)
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            double amount = sc.nextDouble();
            // TODO: select correct Taxable implementation and print tax
        }
    }
}`,
    solution: `import java.util.Scanner;
interface Taxable {
    double computeTax(double amount);
}
class BasicTax implements Taxable {
    public double computeTax(double amount) { return amount * 0.05; }
}
class LuxuryTax implements Taxable {
    public double computeTax(double amount) { return amount * 0.18; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            double amount = sc.nextDouble();
            Taxable t = type.equals("B") ? new BasicTax() : new LuxuryTax();
            System.out.printf("%.2f%n", t.computeTax(amount));
        }
    }
}`,
    testCases: [
      {
        id: "JCH11_I1_T1",
        label: "3 transactions",
        mockInputs: ["3", "B 1000.0", "L 500.0", "B 200.0"],
        expectedOutput: "50.00\n90.00\n10.00",
      },
      {
        id: "JCH11_I1_T2",
        label: "Single luxury",
        mockInputs: ["1", "L 100.0"],
        expectedOutput: "18.00",
        isBoundary: true,
      },
      {
        id: "JCH11_I1_T3",
        label: "All basic",
        mockInputs: ["2", "B 400.0", "B 600.0"],
        expectedOutput: "20.00\n30.00",
        isHidden: true,
      },
      {
        id: "JCH11_I1_T4",
        label: "Large luxury amount",
        mockInputs: ["1", "L 10000.0"],
        expectedOutput: "1800.00",
        isHidden: true,
      },
    ],
    concepts: ["interface", "implements", "polymorphism", "runtime selection"],
    xpReward: 100,
    estimatedMinutes: 10,
  },

  {
    id: "JCH11_I2",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "intermediate",
    tierIndex: 1,
    title: "Default Method in Interface",
    emoji: "🔧",
    tagline: "Use a default method in an interface to provide shared behaviour.",
    problemStatement:
      "Define interface Printable with abstract method String getContent() and a default method void print() that prints \"[PRINTABLE]: \" + getContent(). Implement Document (stores a title and body, getContent returns title + \": \" + body) and Note (stores text, getContent returns text). Read a type ('D' or 'N'), then the relevant fields, and call print() via a Printable reference.",
    inputFormat:
      "Line 1: 'D' or 'N'.\nIf 'D': Line 2: title, Line 3: body.\nIf 'N': Line 2: text.",
    outputFormat: "One line produced by print().",
    examples: [
      {
        input: "D\nMeeting\nDiscuss roadmap",
        output: "[PRINTABLE]: Meeting: Discuss roadmap",
      },
      {
        input: "N\nBuy groceries",
        output: "[PRINTABLE]: Buy groceries",
      },
    ],
    constraints: ["Strings contain no newlines.", "Length ≤ 200 characters."],
    hints: [
      "interface Printable { String getContent(); default void print() { System.out.println(\"[PRINTABLE]: \" + getContent()); } }",
      "Document implements Printable, stores title + body.",
      "Note implements Printable, stores text.",
      "Use sc.nextLine() after consuming the type token (may need sc.nextLine() to consume leftover newline).",
      "Call p.print();",
    ],
    referenceProgram: {
      title: "Default Method — Printable Interface",
      description: "Default print() delegates to abstract getContent(); two implementations.",
      code: `import java.util.Scanner;
interface Printable {
    String getContent();
    default void print() {
        System.out.println("[PRINTABLE]: " + getContent());
    }
}
class Document implements Printable {
    private String title, body;
    Document(String title, String body) { this.title = title; this.body = body; }
    public String getContent() { return title + ": " + body; }
}
class Note implements Printable {
    private String text;
    Note(String text) { this.text = text; }
    public String getContent() { return text; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.nextLine().trim();
        Printable p;
        if (type.equals("D")) {
            String title = sc.nextLine().trim();
            String body  = sc.nextLine().trim();
            p = new Document(title, body);
        } else {
            String text = sc.nextLine().trim();
            p = new Note(text);
        }
        p.print();
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Printable {
    String getContent();
    default void print() {
        System.out.println("[PRINTABLE]: " + getContent());
    }
}
// TODO: implement Document (title + body) and Note (text)
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.nextLine().trim();
        Printable p;
        // TODO: create Document or Note based on type, then call p.print()
        p = null;
        p.print();
    }
}`,
    solution: `import java.util.Scanner;
interface Printable {
    String getContent();
    default void print() {
        System.out.println("[PRINTABLE]: " + getContent());
    }
}
class Document implements Printable {
    private String title, body;
    Document(String title, String body) { this.title = title; this.body = body; }
    public String getContent() { return title + ": " + body; }
}
class Note implements Printable {
    private String text;
    Note(String text) { this.text = text; }
    public String getContent() { return text; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.nextLine().trim();
        Printable p;
        if (type.equals("D")) {
            String title = sc.nextLine().trim();
            String body  = sc.nextLine().trim();
            p = new Document(title, body);
        } else {
            String text = sc.nextLine().trim();
            p = new Note(text);
        }
        p.print();
    }
}`,
    testCases: [
      {
        id: "JCH11_I2_T1",
        label: "Document",
        mockInputs: ["D", "Meeting", "Discuss roadmap"],
        expectedOutput: "[PRINTABLE]: Meeting: Discuss roadmap",
      },
      {
        id: "JCH11_I2_T2",
        label: "Note",
        mockInputs: ["N", "Buy groceries"],
        expectedOutput: "[PRINTABLE]: Buy groceries",
      },
      {
        id: "JCH11_I2_T3",
        label: "Document single word fields",
        mockInputs: ["D", "Title", "Body"],
        expectedOutput: "[PRINTABLE]: Title: Body",
        isHidden: true,
      },
    ],
    concepts: ["interface", "default method", "implements", "nextLine"],
    xpReward: 110,
    estimatedMinutes: 12,
  },

  {
    id: "JCH11_I3",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "intermediate",
    tierIndex: 2,
    title: "Dispatcher — Dynamic Dispatch Demo",
    emoji: "📡",
    tagline: "Store mixed implementations in an array and dispatch polymorphically.",
    problemStatement:
      "Define interface Processor with method String process(String input). Implement UpperCaseProcessor (returns input in upper case) and ReverseProcessor (returns input reversed). Read N lines, each beginning with 'U' or 'R' followed by a word. Dispatch to the correct processor and print the result.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 20).\nNext N lines: 'U <word>' or 'R <word>'.",
    outputFormat: "N lines — processed output per line.",
    examples: [
      {
        input: "4\nU hello\nR world\nU java\nR code",
        output: "HELLO\ndlrow\nJAVA\nedoc",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "Words are alphabetic, length 1–30."],
    hints: [
      "interface Processor { String process(String input); }",
      "UpperCaseProcessor: return input.toUpperCase();",
      "ReverseProcessor: use a StringBuilder loop to reverse.",
      "Read the type with sc.next(), the word with sc.next(), then dispatch.",
    ],
    referenceProgram: {
      title: "Dynamic Dispatch via Processor Interface",
      description: "Two processors selected at runtime; called uniformly via interface.",
      code: `import java.util.Scanner;
interface Processor {
    String process(String input);
}
class UpperCaseProcessor implements Processor {
    public String process(String input) { return input.toUpperCase(); }
}
class ReverseProcessor implements Processor {
    public String process(String input) {
        return new StringBuilder(input).reverse().toString();
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String word = sc.next();
            Processor p = type.equals("U") ? new UpperCaseProcessor() : new ReverseProcessor();
            System.out.println(p.process(word));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Processor {
    String process(String input);
}
// TODO: implement UpperCaseProcessor and ReverseProcessor
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String word = sc.next();
            // TODO: select processor and print result
        }
    }
}`,
    solution: `import java.util.Scanner;
interface Processor {
    String process(String input);
}
class UpperCaseProcessor implements Processor {
    public String process(String input) { return input.toUpperCase(); }
}
class ReverseProcessor implements Processor {
    public String process(String input) {
        return new StringBuilder(input).reverse().toString();
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String word = sc.next();
            Processor p = type.equals("U") ? new UpperCaseProcessor() : new ReverseProcessor();
            System.out.println(p.process(word));
        }
    }
}`,
    testCases: [
      {
        id: "JCH11_I3_T1",
        label: "4 mixed operations",
        mockInputs: ["4", "U hello", "R world", "U java", "R code"],
        expectedOutput: "HELLO\ndlrow\nJAVA\nedoc",
      },
      {
        id: "JCH11_I3_T2",
        label: "Single uppercase",
        mockInputs: ["1", "U abc"],
        expectedOutput: "ABC",
        isBoundary: true,
      },
      {
        id: "JCH11_I3_T3",
        label: "Reverse single char",
        mockInputs: ["1", "R a"],
        expectedOutput: "a",
        isBoundary: true,
      },
      {
        id: "JCH11_I3_T4",
        label: "All reverse",
        mockInputs: ["3", "R abc", "R xyz", "R hello"],
        expectedOutput: "cba\nzyx\nolleh",
        isHidden: true,
      },
    ],
    concepts: ["interface", "dynamic dispatch", "toUpperCase", "StringBuilder.reverse"],
    xpReward: 130,
    estimatedMinutes: 12,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH11_A1",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "advanced",
    tierIndex: 0,
    title: "Multiple Interfaces on One Class",
    emoji: "🎭",
    tagline: "Implement both Flyable and Swimmable on a single Duck class.",
    problemStatement:
      "Define interfaces Flyable (method String fly()) and Swimmable (method String swim()). Implement class Duck that implements both: fly() returns \"Duck flying at <altitude>m\", swim() returns \"Duck swimming at <speed>kmh\". Read altitude and speed, create a Duck, and call both methods via their respective interface references.",
    inputFormat: "Line 1: altitude (int). Line 2: speed (int).",
    outputFormat: "Line 1: fly() output. Line 2: swim() output.",
    examples: [
      {
        input: "10\n5",
        output: "Duck flying at 10m\nDuck swimming at 5kmh",
      },
    ],
    constraints: ["1 ≤ altitude, speed ≤ 10000"],
    hints: [
      "interface Flyable { String fly(); } interface Swimmable { String swim(); }",
      "class Duck implements Flyable, Swimmable { ... }",
      "Store altitude and speed as fields.",
      "Declare Flyable f = duck; Swimmable s = duck; then call f.fly() and s.swim().",
    ],
    referenceProgram: {
      title: "Duck — Multiple Interface Implementation",
      description: "One class implements two interfaces; called via separate interface refs.",
      code: `import java.util.Scanner;
interface Flyable { String fly(); }
interface Swimmable { String swim(); }
class Duck implements Flyable, Swimmable {
    private int altitude, speed;
    Duck(int altitude, int speed) { this.altitude = altitude; this.speed = speed; }
    public String fly()  { return "Duck flying at "   + altitude + "m"; }
    public String swim() { return "Duck swimming at " + speed    + "kmh"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int altitude = sc.nextInt();
        int speed    = sc.nextInt();
        Duck duck = new Duck(altitude, speed);
        Flyable  f = duck;
        Swimmable s = duck;
        System.out.println(f.fly());
        System.out.println(s.swim());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Flyable { String fly(); }
interface Swimmable { String swim(); }
// TODO: implement Duck that implements both Flyable and Swimmable
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int altitude = sc.nextInt();
        int speed    = sc.nextInt();
        // TODO: create Duck, assign to Flyable and Swimmable refs, call both
    }
}`,
    solution: `import java.util.Scanner;
interface Flyable { String fly(); }
interface Swimmable { String swim(); }
class Duck implements Flyable, Swimmable {
    private int altitude, speed;
    Duck(int altitude, int speed) { this.altitude = altitude; this.speed = speed; }
    public String fly()  { return "Duck flying at "   + altitude + "m"; }
    public String swim() { return "Duck swimming at " + speed    + "kmh"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int altitude = sc.nextInt();
        int speed    = sc.nextInt();
        Duck duck = new Duck(altitude, speed);
        Flyable  f = duck;
        Swimmable s = duck;
        System.out.println(f.fly());
        System.out.println(s.swim());
    }
}`,
    testCases: [
      {
        id: "JCH11_A1_T1",
        label: "altitude=10 speed=5",
        mockInputs: ["10", "5"],
        expectedOutput: "Duck flying at 10m\nDuck swimming at 5kmh",
      },
      {
        id: "JCH11_A1_T2",
        label: "altitude=1 speed=1",
        mockInputs: ["1", "1"],
        expectedOutput: "Duck flying at 1m\nDuck swimming at 1kmh",
        isBoundary: true,
      },
      {
        id: "JCH11_A1_T3",
        label: "Large values",
        mockInputs: ["10000", "9999"],
        expectedOutput: "Duck flying at 10000m\nDuck swimming at 9999kmh",
        isHidden: true,
      },
    ],
    concepts: ["multiple interfaces", "implements", "interface reference", "polymorphism"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH11_A2",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "advanced",
    tierIndex: 1,
    title: "Interface Inheritance",
    emoji: "🧬",
    tagline: "Extend an interface and implement the full hierarchy.",
    problemStatement:
      "Define interface Shape with method double perimeter(). Define interface ColoredShape extends Shape with method String getColor(). Implement ColoredCircle (perimeter = 2πr, getColor returns stored color). Read color and radius, create a ColoredCircle, then print the color and perimeter (to 2 decimal places) via a ColoredShape reference.",
    inputFormat: "Line 1: color (a single word). Line 2: radius (double).",
    outputFormat: "Line 1: \"Color: <color>\". Line 2: \"Perimeter: <value>\" (2 dp).",
    examples: [
      {
        input: "Red\n7.0",
        output: "Color: Red\nPerimeter: 43.98",
      },
    ],
    constraints: ["Color is a single word.", "0 < radius ≤ 1000."],
    hints: [
      "interface Shape { double perimeter(); }",
      "interface ColoredShape extends Shape { String getColor(); }",
      "class ColoredCircle implements ColoredShape { ... }",
      "perimeter of a circle = 2 * Math.PI * r",
      "Declare ColoredShape cs = new ColoredCircle(color, radius); then call cs.getColor() and cs.perimeter().",
    ],
    referenceProgram: {
      title: "Interface Inheritance — ColoredShape",
      description: "Sub-interface extends Shape; ColoredCircle implements sub-interface.",
      code: `import java.util.Scanner;
interface Shape { double perimeter(); }
interface ColoredShape extends Shape { String getColor(); }
class ColoredCircle implements ColoredShape {
    private String color;
    private double radius;
    ColoredCircle(String color, double radius) { this.color = color; this.radius = radius; }
    public double perimeter() { return 2 * Math.PI * radius; }
    public String getColor()  { return color; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String color  = sc.next();
        double radius = sc.nextDouble();
        ColoredShape cs = new ColoredCircle(color, radius);
        System.out.println("Color: " + cs.getColor());
        System.out.printf("Perimeter: %.2f%n", cs.perimeter());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Shape { double perimeter(); }
interface ColoredShape extends Shape { String getColor(); }
// TODO: implement ColoredCircle
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String color  = sc.next();
        double radius = sc.nextDouble();
        // TODO: create ColoredShape reference, print color and perimeter
    }
}`,
    solution: `import java.util.Scanner;
interface Shape { double perimeter(); }
interface ColoredShape extends Shape { String getColor(); }
class ColoredCircle implements ColoredShape {
    private String color;
    private double radius;
    ColoredCircle(String color, double radius) { this.color = color; this.radius = radius; }
    public double perimeter() { return 2 * Math.PI * radius; }
    public String getColor()  { return color; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String color  = sc.next();
        double radius = sc.nextDouble();
        ColoredShape cs = new ColoredCircle(color, radius);
        System.out.println("Color: " + cs.getColor());
        System.out.printf("Perimeter: %.2f%n", cs.perimeter());
    }
}`,
    testCases: [
      {
        id: "JCH11_A2_T1",
        label: "Red circle r=7",
        mockInputs: ["Red", "7.0"],
        expectedOutput: "Color: Red\nPerimeter: 43.98",
      },
      {
        id: "JCH11_A2_T2",
        label: "Blue circle r=1",
        mockInputs: ["Blue", "1.0"],
        expectedOutput: "Color: Blue\nPerimeter: 6.28",
        isBoundary: true,
      },
      {
        id: "JCH11_A2_T3",
        label: "Green r=10",
        mockInputs: ["Green", "10.0"],
        expectedOutput: "Color: Green\nPerimeter: 62.83",
        isHidden: true,
      },
    ],
    concepts: ["interface inheritance", "extends", "implements", "Math.PI"],
    xpReward: 175,
    estimatedMinutes: 15,
  },

  {
    id: "JCH11_A3",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "advanced",
    tierIndex: 2,
    title: "Comparable Students",
    emoji: "🏆",
    tagline: "Implement Comparable<Student> to sort students by score descending.",
    problemStatement:
      "Define class Student that implements Comparable<Student>. compareTo should order students by score descending (higher score = smaller compareTo value). For equal scores, order by name ascending. Read N students (name and score), store in an array, sort with Arrays.sort, then print each as \"name score\".",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 20).\nNext N lines: name (string) and score (int).",
    outputFormat: "N lines: \"name score\" in descending score order (alphabetical name for ties).",
    examples: [
      {
        input: "3\nAlice 90\nBob 85\nClara 90",
        output: "Alice 90\nClara 90\nBob 85",
        explanation: "Alice and Clara both have 90; Alice < Clara alphabetically.",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "0 ≤ score ≤ 100"],
    hints: [
      "class Student implements Comparable<Student> { String name; int score; ... }",
      "In compareTo: if scores differ, return other.score - this.score (descending).",
      "If scores equal, return this.name.compareTo(other.name) (ascending alpha).",
      "After filling Student[] arr, call Arrays.sort(arr);",
      "Print each student with arr[i].name + \" \" + arr[i].score.",
    ],
    referenceProgram: {
      title: "Comparable Student Sort",
      description: "Student implements Comparable; sorted by score desc then name asc.",
      code: `import java.util.Scanner;
import java.util.Arrays;
class Student implements Comparable<Student> {
    String name;
    int score;
    Student(String name, int score) { this.name = name; this.score = score; }
    public int compareTo(Student other) {
        if (this.score != other.score) return other.score - this.score;
        return this.name.compareTo(other.name);
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Student[] arr = new Student[n];
        for (int i = 0; i < n; i++) arr[i] = new Student(sc.next(), sc.nextInt());
        Arrays.sort(arr);
        for (Student s : arr) System.out.println(s.name + " " + s.score);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
class Student implements Comparable<Student> {
    String name;
    int score;
    Student(String name, int score) { this.name = name; this.score = score; }
    public int compareTo(Student other) {
        // TODO: sort by score descending; ties by name ascending
        return 0;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Student[] arr = new Student[n];
        for (int i = 0; i < n; i++) arr[i] = new Student(sc.next(), sc.nextInt());
        Arrays.sort(arr);
        for (Student s : arr) System.out.println(s.name + " " + s.score);
    }
}`,
    solution: `import java.util.Scanner;
import java.util.Arrays;
class Student implements Comparable<Student> {
    String name;
    int score;
    Student(String name, int score) { this.name = name; this.score = score; }
    public int compareTo(Student other) {
        if (this.score != other.score) return other.score - this.score;
        return this.name.compareTo(other.name);
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Student[] arr = new Student[n];
        for (int i = 0; i < n; i++) arr[i] = new Student(sc.next(), sc.nextInt());
        Arrays.sort(arr);
        for (Student s : arr) System.out.println(s.name + " " + s.score);
    }
}`,
    testCases: [
      {
        id: "JCH11_A3_T1",
        label: "3 students with tie",
        mockInputs: ["3", "Alice 90", "Bob 85", "Clara 90"],
        expectedOutput: "Alice 90\nClara 90\nBob 85",
      },
      {
        id: "JCH11_A3_T2",
        label: "Single student",
        mockInputs: ["1", "Zara 75"],
        expectedOutput: "Zara 75",
        isBoundary: true,
      },
      {
        id: "JCH11_A3_T3",
        label: "All same score",
        mockInputs: ["3", "Charlie 50", "Alice 50", "Bob 50"],
        expectedOutput: "Alice 50\nBob 50\nCharlie 50",
        isHidden: true,
      },
      {
        id: "JCH11_A3_T4",
        label: "Already sorted",
        mockInputs: ["3", "A 100", "B 80", "C 60"],
        expectedOutput: "A 100\nB 80\nC 60",
        isHidden: true,
      },
    ],
    concepts: ["Comparable", "compareTo", "Arrays.sort", "generics"],
    xpReward: 200,
    estimatedMinutes: 18,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH11_L1",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "leetcode",
    tierIndex: 0,
    title: "Serializable Registry",
    emoji: "🗂️",
    tagline: "Design a registry of Serializable objects; format each according to its type.",
    problemStatement:
      "Design a system where objects implement interface Serializable with methods String serialize() and String getType(). Implement classes JsonItem (type \"JSON\", serialize returns \"{\\\"key\\\": \\\"<value>\\\"}\") and CsvItem (type \"CSV\", serialize returns just value). Read N items, each line has a type ('J' or 'V') and a value. Print each serialized form with its type prefix: \"[<TYPE>] <serialized>\".",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 20).\nNext N lines: 'J <value>' or 'V <value>'.",
    outputFormat: "N lines: \"[<TYPE>] <serialized>\"",
    examples: [
      {
        input: "3\nJ hello\nV world\nJ java",
        output: "[JSON] {\"key\": \"hello\"}\n[CSV] world\n[JSON] {\"key\": \"java\"}",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "Values are single words."],
    hints: [
      "interface Serializable { String serialize(); String getType(); }",
      "JsonItem.serialize() returns \"{\\\"key\\\": \\\"\" + value + \"\\\"}\" — watch the escape sequences.",
      "CsvItem.serialize() returns value as-is.",
      "Print \"[\" + item.getType() + \"] \" + item.serialize().",
    ],
    referenceProgram: {
      title: "Serializable Registry Pattern",
      description: "Two implementations of Serializable; format-agnostic registry print.",
      code: `import java.util.Scanner;
interface Serializable {
    String serialize();
    String getType();
}
class JsonItem implements Serializable {
    private String value;
    JsonItem(String value) { this.value = value; }
    public String serialize() { return "{\"key\": \"" + value + "\"}"; }
    public String getType()   { return "JSON"; }
}
class CsvItem implements Serializable {
    private String value;
    CsvItem(String value) { this.value = value; }
    public String serialize() { return value; }
    public String getType()   { return "CSV"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type  = sc.next();
            String value = sc.next();
            Serializable item = type.equals("J") ? new JsonItem(value) : new CsvItem(value);
            System.out.println("[" + item.getType() + "] " + item.serialize());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Serializable {
    String serialize();
    String getType();
}
// TODO: implement JsonItem and CsvItem
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type  = sc.next();
            String value = sc.next();
            // TODO: create correct item and print formatted output
        }
    }
}`,
    solution: `import java.util.Scanner;
interface Serializable {
    String serialize();
    String getType();
}
class JsonItem implements Serializable {
    private String value;
    JsonItem(String value) { this.value = value; }
    public String serialize() { return "{\"key\": \"" + value + "\"}"; }
    public String getType()   { return "JSON"; }
}
class CsvItem implements Serializable {
    private String value;
    CsvItem(String value) { this.value = value; }
    public String serialize() { return value; }
    public String getType()   { return "CSV"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type  = sc.next();
            String value = sc.next();
            Serializable item = type.equals("J") ? new JsonItem(value) : new CsvItem(value);
            System.out.println("[" + item.getType() + "] " + item.serialize());
        }
    }
}`,
    testCases: [
      {
        id: "JCH11_L1_T1",
        label: "3 mixed items",
        mockInputs: ["3", "J hello", "V world", "J java"],
        expectedOutput: "[JSON] {\"key\": \"hello\"}\n[CSV] world\n[JSON] {\"key\": \"java\"}",
      },
      {
        id: "JCH11_L1_T2",
        label: "Single JSON item",
        mockInputs: ["1", "J test"],
        expectedOutput: "[JSON] {\"key\": \"test\"}",
        isBoundary: true,
      },
      {
        id: "JCH11_L1_T3",
        label: "All CSV",
        mockInputs: ["2", "V alpha", "V beta"],
        expectedOutput: "[CSV] alpha\n[CSV] beta",
        isHidden: true,
      },
    ],
    concepts: ["interface", "polymorphism", "string escaping", "design pattern"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(N)",
  },

  {
    id: "JCH11_L2",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "leetcode",
    tierIndex: 1,
    title: "Sortable Strategy",
    emoji: "🔢",
    tagline: "Design a Sortable interface; implement ascending and descending sorters.",
    problemStatement:
      "Design interface Sortable with method int[] sort(int[] arr). Implement AscendingSorter (uses Arrays.sort) and DescendingSorter (sorts ascending then reverses). Read a strategy ('A' or 'D'), then N integers. Print the sorted array space-separated.",
    inputFormat:
      "Line 1: 'A' or 'D'.\nLine 2: N (1 ≤ N ≤ 1000).\nNext N lines: one integer per line.",
    outputFormat: "Sorted integers, space-separated, on one line.",
    examples: [
      {
        input: "A\n4\n3\n1\n4\n2",
        output: "1 2 3 4",
      },
      {
        input: "D\n4\n3\n1\n4\n2",
        output: "4 3 2 1",
      },
    ],
    constraints: ["1 ≤ N ≤ 1000", "Elements in [-10^6, 10^6]."],
    hints: [
      "interface Sortable { int[] sort(int[] arr); }",
      "AscendingSorter: Arrays.sort(arr); return arr;",
      "DescendingSorter: sort ascending, then swap arr[i] with arr[n-1-i] for i < n/2.",
      "Declare Sortable sorter; assign based on strategy, call sorter.sort(arr).",
      "Print with space separator, no trailing space.",
    ],
    referenceProgram: {
      title: "Strategy Pattern — Sortable Interface",
      description: "Classic strategy pattern: sort algorithm selected at runtime via interface.",
      code: `import java.util.Scanner;
import java.util.Arrays;
interface Sortable { int[] sort(int[] arr); }
class AscendingSorter implements Sortable {
    public int[] sort(int[] arr) { Arrays.sort(arr); return arr; }
}
class DescendingSorter implements Sortable {
    public int[] sort(int[] arr) {
        Arrays.sort(arr);
        int n = arr.length;
        for (int i = 0; i < n / 2; i++) {
            int tmp = arr[i]; arr[i] = arr[n-1-i]; arr[n-1-i] = tmp;
        }
        return arr;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String strategy = sc.next();
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        Sortable sorter = strategy.equals("A") ? new AscendingSorter() : new DescendingSorter();
        int[] result = sorter.sort(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { if (i > 0) sb.append(" "); sb.append(result[i]); }
        System.out.println(sb.toString());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
interface Sortable { int[] sort(int[] arr); }
// TODO: implement AscendingSorter and DescendingSorter
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String strategy = sc.next();
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        // TODO: select sorter, sort, print space-separated
    }
}`,
    solution: `import java.util.Scanner;
import java.util.Arrays;
interface Sortable { int[] sort(int[] arr); }
class AscendingSorter implements Sortable {
    public int[] sort(int[] arr) { Arrays.sort(arr); return arr; }
}
class DescendingSorter implements Sortable {
    public int[] sort(int[] arr) {
        Arrays.sort(arr);
        int n = arr.length;
        for (int i = 0; i < n / 2; i++) {
            int tmp = arr[i]; arr[i] = arr[n-1-i]; arr[n-1-i] = tmp;
        }
        return arr;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String strategy = sc.next();
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        Sortable sorter = strategy.equals("A") ? new AscendingSorter() : new DescendingSorter();
        int[] result = sorter.sort(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { if (i > 0) sb.append(" "); sb.append(result[i]); }
        System.out.println(sb.toString());
    }
}`,
    testCases: [
      {
        id: "JCH11_L2_T1",
        label: "Ascending 4 numbers",
        mockInputs: ["A", "4", "3", "1", "4", "2"],
        expectedOutput: "1 2 3 4",
      },
      {
        id: "JCH11_L2_T2",
        label: "Descending 4 numbers",
        mockInputs: ["D", "4", "3", "1", "4", "2"],
        expectedOutput: "4 3 2 1",
      },
      {
        id: "JCH11_L2_T3",
        label: "Single element",
        mockInputs: ["A", "1", "42"],
        expectedOutput: "42",
        isBoundary: true,
      },
      {
        id: "JCH11_L2_T4",
        label: "Negatives descending",
        mockInputs: ["D", "3", "-1", "-5", "-3"],
        expectedOutput: "-1 -3 -5",
        isHidden: true,
      },
    ],
    concepts: ["strategy pattern", "interface", "Arrays.sort", "in-place reverse"],
    xpReward: 270,
    estimatedMinutes: 22,
    timeComplexityTarget: "O(N log N)",
  },

  {
    id: "JCH11_L3",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "leetcode",
    tierIndex: 2,
    title: "Chain of Validators",
    emoji: "✅",
    tagline: "Chain multiple Validator implementations; report first failure or success.",
    problemStatement:
      "Define interface Validator with method String validate(String input) — returns null on success or an error message on failure. Implement: LengthValidator (fails if length < minLen: \"Too short: need \" + minLen), UpperCaseValidator (fails if no uppercase: \"No uppercase letter\"), and DigitValidator (fails if no digit: \"No digit found\"). Read minLen, then a password. Run all three validators in order. Print the first error message, or \"Valid\" if all pass.",
    inputFormat: "Line 1: minLen (int). Line 2: password (a single token).",
    outputFormat: "First error message, or \"Valid\".",
    examples: [
      {
        input: "6\nab1C",
        output: "Too short: need 6",
      },
      {
        input: "4\nabcdef",
        output: "No uppercase letter",
      },
      {
        input: "4\nAbcde1",
        output: "Valid",
      },
    ],
    constraints: ["1 ≤ minLen ≤ 20", "Password length ≤ 50."],
    hints: [
      "interface Validator { String validate(String input); }",
      "LengthValidator stores minLen; check input.length() < minLen.",
      "UpperCaseValidator: loop chars checking Character.isUpperCase(c).",
      "DigitValidator: loop chars checking Character.isDigit(c).",
      "Store validators in a Validator[] array; loop, return first non-null result.",
    ],
    referenceProgram: {
      title: "Chain of Validators",
      description: "Array of Validators iterated in order; first failure wins.",
      code: `import java.util.Scanner;
interface Validator { String validate(String input); }
class LengthValidator implements Validator {
    private int minLen;
    LengthValidator(int minLen) { this.minLen = minLen; }
    public String validate(String input) {
        return input.length() < minLen ? "Too short: need " + minLen : null;
    }
}
class UpperCaseValidator implements Validator {
    public String validate(String input) {
        for (char c : input.toCharArray()) if (Character.isUpperCase(c)) return null;
        return "No uppercase letter";
    }
}
class DigitValidator implements Validator {
    public String validate(String input) {
        for (char c : input.toCharArray()) if (Character.isDigit(c)) return null;
        return "No digit found";
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int minLen   = sc.nextInt();
        String pwd   = sc.next();
        Validator[] validators = {
            new LengthValidator(minLen),
            new UpperCaseValidator(),
            new DigitValidator()
        };
        for (Validator v : validators) {
            String err = v.validate(pwd);
            if (err != null) { System.out.println(err); return; }
        }
        System.out.println("Valid");
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface Validator { String validate(String input); }
// TODO: implement LengthValidator, UpperCaseValidator, DigitValidator
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int minLen = sc.nextInt();
        String pwd = sc.next();
        // TODO: run validators in order, print first error or "Valid"
    }
}`,
    solution: `import java.util.Scanner;
interface Validator { String validate(String input); }
class LengthValidator implements Validator {
    private int minLen;
    LengthValidator(int minLen) { this.minLen = minLen; }
    public String validate(String input) {
        return input.length() < minLen ? "Too short: need " + minLen : null;
    }
}
class UpperCaseValidator implements Validator {
    public String validate(String input) {
        for (char c : input.toCharArray()) if (Character.isUpperCase(c)) return null;
        return "No uppercase letter";
    }
}
class DigitValidator implements Validator {
    public String validate(String input) {
        for (char c : input.toCharArray()) if (Character.isDigit(c)) return null;
        return "No digit found";
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int minLen   = sc.nextInt();
        String pwd   = sc.next();
        Validator[] validators = {
            new LengthValidator(minLen),
            new UpperCaseValidator(),
            new DigitValidator()
        };
        for (Validator v : validators) {
            String err = v.validate(pwd);
            if (err != null) { System.out.println(err); return; }
        }
        System.out.println("Valid");
    }
}`,
    testCases: [
      {
        id: "JCH11_L3_T1",
        label: "Too short",
        mockInputs: ["6", "ab1C"],
        expectedOutput: "Too short: need 6",
      },
      {
        id: "JCH11_L3_T2",
        label: "No uppercase",
        mockInputs: ["4", "abcdef"],
        expectedOutput: "No uppercase letter",
      },
      {
        id: "JCH11_L3_T3",
        label: "No digit",
        mockInputs: ["4", "AbCdEf"],
        expectedOutput: "No digit found",
      },
      {
        id: "JCH11_L3_T4",
        label: "All valid",
        mockInputs: ["4", "Abcde1"],
        expectedOutput: "Valid",
      },
      {
        id: "JCH11_L3_T5",
        label: "Exact minimum length, valid",
        mockInputs: ["4", "Ab1d"],
        expectedOutput: "Valid",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["chain of responsibility", "interface array", "Character methods", "null return"],
    xpReward: 300,
    estimatedMinutes: 25,
    timeComplexityTarget: "O(N) per validator",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH11_H1",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "hackathon",
    tierIndex: 0,
    title: "Payment Gateway System",
    emoji: "💳",
    tagline: "Plug-in payment providers — each implements the PaymentGateway interface.",
    problemStatement:
      "Design a payment system with interface PaymentGateway:\n- String getName()\n- boolean processPayment(double amount) — returns true if amount <= gateway's limit\n- double getFee(double amount) — fee charged\n\nImplement:\n- CreditCard: name=\"CreditCard\", limit=50000, fee=1.5% of amount\n- NetBanking: name=\"NetBanking\", limit=100000, fee=flat 10.0\n- UPI: name=\"UPI\", limit=10000, fee=0.0\n\nRead N transactions: each line has gateway code ('C', 'N', 'U') and amount.\nFor each transaction print:\n- If processPayment succeeds: \"<name>: SUCCESS fee=<fee>\" (fee to 2dp)\n- If it fails: \"<name>: FAILED limit exceeded\"",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 20).\nNext N lines: gateway code and amount (double).",
    outputFormat: "N lines as described.",
    examples: [
      {
        input: "4\nC 1000.0\nU 20000.0\nN 80000.0\nC 60000.0",
        output:
          "CreditCard: SUCCESS fee=15.00\nUPI: FAILED limit exceeded\nNetBanking: SUCCESS fee=10.00\nCreditCard: FAILED limit exceeded",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "amount > 0"],
    hints: [
      "interface PaymentGateway { String getName(); boolean processPayment(double amount); double getFee(double amount); }",
      "CreditCard.processPayment: return amount <= 50000;",
      "CreditCard.getFee: return amount * 0.015;",
      "NetBanking.getFee: return 10.0; (flat, regardless of amount)",
      "UPI.getFee: return 0.0;",
      "Dispatch on code, call processPayment, branch on result.",
    ],
    referenceProgram: {
      title: "Payment Gateway Plugin System",
      description: "Three gateway implementations; uniform interface call pattern.",
      code: `import java.util.Scanner;
interface PaymentGateway {
    String getName();
    boolean processPayment(double amount);
    double getFee(double amount);
}
class CreditCard implements PaymentGateway {
    public String getName() { return "CreditCard"; }
    public boolean processPayment(double amount) { return amount <= 50000; }
    public double getFee(double amount) { return amount * 0.015; }
}
class NetBanking implements PaymentGateway {
    public String getName() { return "NetBanking"; }
    public boolean processPayment(double amount) { return amount <= 100000; }
    public double getFee(double amount) { return 10.0; }
}
class UPI implements PaymentGateway {
    public String getName() { return "UPI"; }
    public boolean processPayment(double amount) { return amount <= 10000; }
    public double getFee(double amount) { return 0.0; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            double amount = sc.nextDouble();
            PaymentGateway gw;
            switch (code) {
                case "C": gw = new CreditCard();  break;
                case "N": gw = new NetBanking();  break;
                default:  gw = new UPI();         break;
            }
            if (gw.processPayment(amount)) {
                System.out.printf("%s: SUCCESS fee=%.2f%n", gw.getName(), gw.getFee(amount));
            } else {
                System.out.println(gw.getName() + ": FAILED limit exceeded");
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface PaymentGateway {
    String getName();
    boolean processPayment(double amount);
    double getFee(double amount);
}
// TODO: implement CreditCard, NetBanking, UPI
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code   = sc.next();
            double amount = sc.nextDouble();
            // TODO: select gateway, process, print result
        }
    }
}`,
    solution: `import java.util.Scanner;
interface PaymentGateway {
    String getName();
    boolean processPayment(double amount);
    double getFee(double amount);
}
class CreditCard implements PaymentGateway {
    public String getName() { return "CreditCard"; }
    public boolean processPayment(double amount) { return amount <= 50000; }
    public double getFee(double amount) { return amount * 0.015; }
}
class NetBanking implements PaymentGateway {
    public String getName() { return "NetBanking"; }
    public boolean processPayment(double amount) { return amount <= 100000; }
    public double getFee(double amount) { return 10.0; }
}
class UPI implements PaymentGateway {
    public String getName() { return "UPI"; }
    public boolean processPayment(double amount) { return amount <= 10000; }
    public double getFee(double amount) { return 0.0; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            double amount = sc.nextDouble();
            PaymentGateway gw;
            switch (code) {
                case "C": gw = new CreditCard();  break;
                case "N": gw = new NetBanking();  break;
                default:  gw = new UPI();         break;
            }
            if (gw.processPayment(amount)) {
                System.out.printf("%s: SUCCESS fee=%.2f%n", gw.getName(), gw.getFee(amount));
            } else {
                System.out.println(gw.getName() + ": FAILED limit exceeded");
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH11_H1_T1",
        label: "4 mixed transactions",
        mockInputs: ["4", "C 1000.0", "U 20000.0", "N 80000.0", "C 60000.0"],
        expectedOutput:
          "CreditCard: SUCCESS fee=15.00\nUPI: FAILED limit exceeded\nNetBanking: SUCCESS fee=10.00\nCreditCard: FAILED limit exceeded",
      },
      {
        id: "JCH11_H1_T2",
        label: "UPI at limit",
        mockInputs: ["1", "U 10000.0"],
        expectedOutput: "UPI: SUCCESS fee=0.00",
        isBoundary: true,
      },
      {
        id: "JCH11_H1_T3",
        label: "NetBanking flat fee",
        mockInputs: ["1", "N 500.0"],
        expectedOutput: "NetBanking: SUCCESS fee=10.00",
        isHidden: true,
      },
      {
        id: "JCH11_H1_T4",
        label: "CreditCard boundary",
        mockInputs: ["2", "C 50000.0", "C 50001.0"],
        expectedOutput: "CreditCard: SUCCESS fee=750.00\nCreditCard: FAILED limit exceeded",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["plugin pattern", "interface", "polymorphism", "switch dispatch"],
    xpReward: 400,
    estimatedMinutes: 30,
    designChallenge:
      "Add a fallback mechanism: if the primary gateway fails, automatically try the next gateway in a priority list and report which gateway ultimately processed the payment.",
  },

  {
    id: "JCH11_H2",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "hackathon",
    tierIndex: 1,
    title: "Notification System",
    emoji: "🔔",
    tagline: "Multi-channel notification — Email, SMS, Push — all via NotificationSender.",
    problemStatement:
      "Design a notification system with interface NotificationSender:\n- String getChannel()\n- String send(String recipient, String message) — returns a formatted confirmation string\n\nImplement:\n- EmailSender: channel=\"EMAIL\", send returns \"Email to <recipient>: <message>\"\n- SMSSender: channel=\"SMS\", send returns \"SMS to <recipient> [160c]: \" + message truncated to 160 chars\n- PushSender: channel=\"PUSH\", send returns \"Push [\" + recipient + \"]: \" + message\n\nRead N notifications: each line has channel code ('E', 'S', 'P'), recipient, and message (rest of line). Print the result of send() for each.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 10).\nNext N lines: code, recipient, then message (may contain spaces).",
    outputFormat: "N lines — confirmation string per notification.",
    examples: [
      {
        input: "3\nE alice Hello there\nS bob Meeting at 3pm\nP carol App update ready",
        output:
          "Email to alice: Hello there\nSMS to bob [160c]: Meeting at 3pm\nPush [carol]: App update ready",
      },
    ],
    constraints: [
      "1 ≤ N ≤ 10",
      "Recipient is a single word.",
      "Message may contain spaces (rest of line after recipient).",
      "Message ≤ 200 characters.",
    ],
    hints: [
      "Use sc.next() for code and recipient, then sc.nextLine().trim() for the message.",
      "SMSSender: message = message.length() > 160 ? message.substring(0, 160) : message;",
      "Store implementations in a switch, dispatch via interface.",
    ],
    referenceProgram: {
      title: "Multi-channel Notification System",
      description: "Three channel implementations; uniform send() interface.",
      code: `import java.util.Scanner;
interface NotificationSender {
    String getChannel();
    String send(String recipient, String message);
}
class EmailSender implements NotificationSender {
    public String getChannel() { return "EMAIL"; }
    public String send(String recipient, String message) {
        return "Email to " + recipient + ": " + message;
    }
}
class SMSSender implements NotificationSender {
    public String getChannel() { return "SMS"; }
    public String send(String recipient, String message) {
        String truncated = message.length() > 160 ? message.substring(0, 160) : message;
        return "SMS to " + recipient + " [160c]: " + truncated;
    }
}
class PushSender implements NotificationSender {
    public String getChannel() { return "PUSH"; }
    public String send(String recipient, String message) {
        return "Push [" + recipient + "]: " + message;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String line      = sc.nextLine().trim();
            String code      = line.substring(0, 1);
            String rest      = line.substring(2);
            int spaceIdx     = rest.indexOf(' ');
            String recipient = spaceIdx >= 0 ? rest.substring(0, spaceIdx) : rest;
            String message   = spaceIdx >= 0 ? rest.substring(spaceIdx + 1) : "";
            NotificationSender sender;
            switch (code) {
                case "E": sender = new EmailSender(); break;
                case "S": sender = new SMSSender();   break;
                default:  sender = new PushSender();  break;
            }
            System.out.println(sender.send(recipient, message));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface NotificationSender {
    String getChannel();
    String send(String recipient, String message);
}
// TODO: implement EmailSender, SMSSender, PushSender
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String line      = sc.nextLine().trim();
            String code      = line.substring(0, 1);
            String rest      = line.substring(2);
            int spaceIdx     = rest.indexOf(' ');
            String recipient = spaceIdx >= 0 ? rest.substring(0, spaceIdx) : rest;
            String message   = spaceIdx >= 0 ? rest.substring(spaceIdx + 1) : "";
            // TODO: select sender, call send(), print result
        }
    }
}`,
    solution: `import java.util.Scanner;
interface NotificationSender {
    String getChannel();
    String send(String recipient, String message);
}
class EmailSender implements NotificationSender {
    public String getChannel() { return "EMAIL"; }
    public String send(String recipient, String message) {
        return "Email to " + recipient + ": " + message;
    }
}
class SMSSender implements NotificationSender {
    public String getChannel() { return "SMS"; }
    public String send(String recipient, String message) {
        String truncated = message.length() > 160 ? message.substring(0, 160) : message;
        return "SMS to " + recipient + " [160c]: " + truncated;
    }
}
class PushSender implements NotificationSender {
    public String getChannel() { return "PUSH"; }
    public String send(String recipient, String message) {
        return "Push [" + recipient + "]: " + message;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String line      = sc.nextLine().trim();
            String code      = line.substring(0, 1);
            String rest      = line.substring(2);
            int spaceIdx     = rest.indexOf(' ');
            String recipient = spaceIdx >= 0 ? rest.substring(0, spaceIdx) : rest;
            String message   = spaceIdx >= 0 ? rest.substring(spaceIdx + 1) : "";
            NotificationSender sender;
            switch (code) {
                case "E": sender = new EmailSender(); break;
                case "S": sender = new SMSSender();   break;
                default:  sender = new PushSender();  break;
            }
            System.out.println(sender.send(recipient, message));
        }
    }
}`,
    testCases: [
      {
        id: "JCH11_H2_T1",
        label: "3 channels",
        mockInputs: ["3", "E alice Hello there", "S bob Meeting at 3pm", "P carol App update ready"],
        expectedOutput:
          "Email to alice: Hello there\nSMS to bob [160c]: Meeting at 3pm\nPush [carol]: App update ready",
      },
      {
        id: "JCH11_H2_T2",
        label: "Single email",
        mockInputs: ["1", "E dev Test message"],
        expectedOutput: "Email to dev: Test message",
        isBoundary: true,
      },
      {
        id: "JCH11_H2_T3",
        label: "Push with spaces in message",
        mockInputs: ["1", "P user Hello World from Push"],
        expectedOutput: "Push [user]: Hello World from Push",
        isHidden: true,
      },
    ],
    concepts: ["plugin pattern", "interface", "polymorphism", "string parsing", "nextLine"],
    xpReward: 450,
    estimatedMinutes: 35,
    designChallenge:
      "Add a BroadcastSender that wraps an array of NotificationSender objects and calls send() on each, collecting all results into a single multi-line output.",
  },

  {
    id: "JCH11_H3",
    chapterId: "JCH11_POLY",
    chapterNumber: 11,
    tier: "hackathon",
    tierIndex: 2,
    title: "Expression Evaluator",
    emoji: "🧮",
    tagline: "Build a plug-in expression engine — each operator implements BinaryOp.",
    problemStatement:
      "Define interface BinaryOp with methods String symbol() and double apply(double a, double b). Implement: AddOp (+), SubOp (-), MulOp (*), DivOp (/) — DivOp.apply throws ArithmeticException if b == 0.\n\nRead N expressions, each as \"a op b\" where op is '+', '-', '*', or '/'. For each:\n- Look up the operator, apply it.\n- If DivOp throws (b==0), print \"Error: division by zero\".\n- Otherwise print result to 2 decimal places.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 20).\nNext N lines: double op double (e.g. \"10.0 + 3.0\").",
    outputFormat: "N lines — result to 2 dp or error message.",
    examples: [
      {
        input: "4\n10.0 + 3.0\n10.0 - 3.0\n10.0 * 3.0\n10.0 / 0.0",
        output: "13.00\n7.00\n30.00\nError: division by zero",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "Operands are doubles.", "b may be 0 only with '/'."],
    hints: [
      "Store ops in a BinaryOp[] ops = {new AddOp(), new SubOp(), new MulOp(), new DivOp()};",
      "Loop to find the matching symbol(): for (BinaryOp op : ops) if (op.symbol().equals(sym)) ...",
      "Wrap apply() in try-catch for division by zero.",
      "DivOp.apply: if (b == 0) throw new ArithmeticException(); return a / b;",
    ],
    referenceProgram: {
      title: "Plug-in Expression Evaluator",
      description: "Operator lookup table of BinaryOp; dispatched by symbol, handles DivByZero.",
      code: `import java.util.Scanner;
interface BinaryOp {
    String symbol();
    double apply(double a, double b);
}
class AddOp implements BinaryOp {
    public String symbol() { return "+"; }
    public double apply(double a, double b) { return a + b; }
}
class SubOp implements BinaryOp {
    public String symbol() { return "-"; }
    public double apply(double a, double b) { return a - b; }
}
class MulOp implements BinaryOp {
    public String symbol() { return "*"; }
    public double apply(double a, double b) { return a * b; }
}
class DivOp implements BinaryOp {
    public String symbol() { return "/"; }
    public double apply(double a, double b) {
        if (b == 0) throw new ArithmeticException("division by zero");
        return a / b;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        BinaryOp[] ops = { new AddOp(), new SubOp(), new MulOp(), new DivOp() };
        for (int i = 0; i < n; i++) {
            double a   = sc.nextDouble();
            String sym = sc.next();
            double b   = sc.nextDouble();
            BinaryOp selected = null;
            for (BinaryOp op : ops) if (op.symbol().equals(sym)) { selected = op; break; }
            try {
                System.out.printf("%.2f%n", selected.apply(a, b));
            } catch (ArithmeticException e) {
                System.out.println("Error: division by zero");
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
interface BinaryOp {
    String symbol();
    double apply(double a, double b);
}
// TODO: implement AddOp, SubOp, MulOp, DivOp
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        BinaryOp[] ops = { new AddOp(), new SubOp(), new MulOp(), new DivOp() };
        for (int i = 0; i < n; i++) {
            double a   = sc.nextDouble();
            String sym = sc.next();
            double b   = sc.nextDouble();
            // TODO: find matching op, apply, handle division by zero
        }
    }
}`,
    solution: `import java.util.Scanner;
interface BinaryOp {
    String symbol();
    double apply(double a, double b);
}
class AddOp implements BinaryOp {
    public String symbol() { return "+"; }
    public double apply(double a, double b) { return a + b; }
}
class SubOp implements BinaryOp {
    public String symbol() { return "-"; }
    public double apply(double a, double b) { return a - b; }
}
class MulOp implements BinaryOp {
    public String symbol() { return "*"; }
    public double apply(double a, double b) { return a * b; }
}
class DivOp implements BinaryOp {
    public String symbol() { return "/"; }
    public double apply(double a, double b) {
        if (b == 0) throw new ArithmeticException("division by zero");
        return a / b;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        BinaryOp[] ops = { new AddOp(), new SubOp(), new MulOp(), new DivOp() };
        for (int i = 0; i < n; i++) {
            double a   = sc.nextDouble();
            String sym = sc.next();
            double b   = sc.nextDouble();
            BinaryOp selected = null;
            for (BinaryOp op : ops) if (op.symbol().equals(sym)) { selected = op; break; }
            try {
                System.out.printf("%.2f%n", selected.apply(a, b));
            } catch (ArithmeticException e) {
                System.out.println("Error: division by zero");
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH11_H3_T1",
        label: "4 operations with div by zero",
        mockInputs: ["4", "10.0 + 3.0", "10.0 - 3.0", "10.0 * 3.0", "10.0 / 0.0"],
        expectedOutput: "13.00\n7.00\n30.00\nError: division by zero",
      },
      {
        id: "JCH11_H3_T2",
        label: "Division success",
        mockInputs: ["1", "9.0 / 3.0"],
        expectedOutput: "3.00",
      },
      {
        id: "JCH11_H3_T3",
        label: "Subtraction negative result",
        mockInputs: ["1", "3.0 - 10.0"],
        expectedOutput: "-7.00",
        isHidden: true,
      },
      {
        id: "JCH11_H3_T4",
        label: "Multiplication by zero",
        mockInputs: ["1", "0.0 * 99.0"],
        expectedOutput: "0.00",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["operator table", "interface", "try-catch", "ArithmeticException", "lookup loop"],
    xpReward: 500,
    estimatedMinutes: 40,
    designChallenge:
      "Extend to support parenthesised expressions with a recursive-descent parser that still uses BinaryOp implementations for the actual computation.",
  },
];
