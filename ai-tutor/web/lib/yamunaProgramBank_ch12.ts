import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH12_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH12_B1",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "beginner",
    tierIndex: 0,
    title: "Abstract Shape",
    emoji: "🔷",
    tagline: "Define an abstract class with one abstract method, then subclass it.",
    problemStatement:
      "Define abstract class Shape with abstract method double area(). Implement concrete subclass Square (area = side²). Read a side length and print the area formatted to 2 decimal places.",
    inputFormat: "A single double — the side length of the square.",
    outputFormat: "Area formatted to 2 decimal places.",
    examples: [
      {
        input: "4.0",
        output: "16.00",
      },
      {
        input: "2.5",
        output: "6.25",
      },
    ],
    constraints: ["0 < side ≤ 1000."],
    hints: [
      "abstract class Shape { abstract double area(); }",
      "class Square extends Shape { double side; ... public double area() { return side * side; } }",
      "You cannot instantiate Shape directly — use Square.",
      "Declare Shape s = new Square(side); then print s.area().",
    ],
    referenceProgram: {
      title: "Abstract Shape with Square subclass",
      description: "Abstract base declares area(); Square overrides it with side*side.",
      code: `import java.util.Scanner;
abstract class Shape {
    abstract double area();
}
class Square extends Shape {
    private double side;
    Square(double side) { this.side = side; }
    public double area() { return side * side; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double side = sc.nextDouble();
        Shape s = new Square(side);
        System.out.printf("%.2f%n", s.area());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
abstract class Shape {
    abstract double area();
}
// TODO: implement Square extending Shape
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double side = sc.nextDouble();
        // TODO: create a Shape reference via Square and print area
    }
}`,
    solution: `import java.util.Scanner;
abstract class Shape {
    abstract double area();
}
class Square extends Shape {
    private double side;
    Square(double side) { this.side = side; }
    public double area() { return side * side; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double side = sc.nextDouble();
        Shape s = new Square(side);
        System.out.printf("%.2f%n", s.area());
    }
}`,
    testCases: [
      {
        id: "JCH12_B1_T1",
        label: "side=4",
        mockInputs: ["4.0"],
        expectedOutput: "16.00",
      },
      {
        id: "JCH12_B1_T2",
        label: "side=2.5",
        mockInputs: ["2.5"],
        expectedOutput: "6.25",
      },
      {
        id: "JCH12_B1_T3",
        label: "side=1",
        mockInputs: ["1.0"],
        expectedOutput: "1.00",
        isBoundary: true,
      },
      {
        id: "JCH12_B1_T4",
        label: "side=10",
        mockInputs: ["10.0"],
        expectedOutput: "100.00",
        isHidden: true,
      },
    ],
    concepts: ["abstract class", "abstract method", "extends", "override"],
    xpReward: 50,
    estimatedMinutes: 5,
  },

  {
    id: "JCH12_B2",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "beginner",
    tierIndex: 1,
    title: "Vehicle Abstract Class",
    emoji: "🚗",
    tagline: "Abstract class Vehicle; subclasses Car and Bike override describe().",
    problemStatement:
      "Define abstract class Vehicle with a String field brand and abstract method String describe(). Implement Car (describe returns \"Car: \" + brand + \" with \" + doors + \" doors\") and Bike (describe returns \"Bike: \" + brand + \" geared=\" + geared). Read a type ('C' or 'B'), brand, and type-specific fields. Print the description.",
    inputFormat:
      "Line 1: 'C' or 'B'.\nIf 'C': Line 2: brand, Line 3: doors (int).\nIf 'B': Line 2: brand, Line 3: geared ('true' or 'false').",
    outputFormat: "One line — the vehicle description.",
    examples: [
      {
        input: "C\nToyota\n4",
        output: "Car: Toyota with 4 doors",
      },
      {
        input: "B\nYamaha\ntrue",
        output: "Bike: Yamaha geared=true",
      },
    ],
    constraints: ["Brand is a single word.", "Doors ≥ 2."],
    hints: [
      "abstract class Vehicle { String brand; Vehicle(String brand) { this.brand = brand; } abstract String describe(); }",
      "class Car extends Vehicle { int doors; ... }",
      "class Bike extends Vehicle { boolean geared; ... }",
      "Use sc.next() to read brand; sc.nextInt() for doors; sc.nextBoolean() for geared.",
    ],
    referenceProgram: {
      title: "Abstract Vehicle — Car and Bike",
      description: "Abstract base with field; two subclasses override describe().",
      code: `import java.util.Scanner;
abstract class Vehicle {
    String brand;
    Vehicle(String brand) { this.brand = brand; }
    abstract String describe();
}
class Car extends Vehicle {
    int doors;
    Car(String brand, int doors) { super(brand); this.doors = doors; }
    public String describe() { return "Car: " + brand + " with " + doors + " doors"; }
}
class Bike extends Vehicle {
    boolean geared;
    Bike(String brand, boolean geared) { super(brand); this.geared = geared; }
    public String describe() { return "Bike: " + brand + " geared=" + geared; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type  = sc.next();
        String brand = sc.next();
        Vehicle v;
        if (type.equals("C")) {
            v = new Car(brand, sc.nextInt());
        } else {
            v = new Bike(brand, sc.nextBoolean());
        }
        System.out.println(v.describe());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
abstract class Vehicle {
    String brand;
    Vehicle(String brand) { this.brand = brand; }
    abstract String describe();
}
// TODO: implement Car and Bike extending Vehicle
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type  = sc.next();
        String brand = sc.next();
        Vehicle v;
        // TODO: create Car or Bike, print v.describe()
        v = null;
        System.out.println(v.describe());
    }
}`,
    solution: `import java.util.Scanner;
abstract class Vehicle {
    String brand;
    Vehicle(String brand) { this.brand = brand; }
    abstract String describe();
}
class Car extends Vehicle {
    int doors;
    Car(String brand, int doors) { super(brand); this.doors = doors; }
    public String describe() { return "Car: " + brand + " with " + doors + " doors"; }
}
class Bike extends Vehicle {
    boolean geared;
    Bike(String brand, boolean geared) { super(brand); this.geared = geared; }
    public String describe() { return "Bike: " + brand + " geared=" + geared; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type  = sc.next();
        String brand = sc.next();
        Vehicle v;
        if (type.equals("C")) {
            v = new Car(brand, sc.nextInt());
        } else {
            v = new Bike(brand, sc.nextBoolean());
        }
        System.out.println(v.describe());
    }
}`,
    testCases: [
      {
        id: "JCH12_B2_T1",
        label: "Car Toyota 4 doors",
        mockInputs: ["C", "Toyota", "4"],
        expectedOutput: "Car: Toyota with 4 doors",
      },
      {
        id: "JCH12_B2_T2",
        label: "Bike Yamaha geared",
        mockInputs: ["B", "Yamaha", "true"],
        expectedOutput: "Bike: Yamaha geared=true",
      },
      {
        id: "JCH12_B2_T3",
        label: "Bike not geared",
        mockInputs: ["B", "Hero", "false"],
        expectedOutput: "Bike: Hero geared=false",
        isBoundary: true,
      },
      {
        id: "JCH12_B2_T4",
        label: "Car 2 doors",
        mockInputs: ["C", "BMW", "2"],
        expectedOutput: "Car: BMW with 2 doors",
        isHidden: true,
      },
    ],
    concepts: ["abstract class", "super()", "extends", "override"],
    xpReward: 60,
    estimatedMinutes: 8,
  },

  {
    id: "JCH12_B3",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "beginner",
    tierIndex: 2,
    title: "Simple Enum Days",
    emoji: "📅",
    tagline: "Define an enum for days of the week and look up a day.",
    problemStatement:
      "Define enum Day with values MON, TUE, WED, THU, FRI, SAT, SUN. Each has a boolean field isWeekend. Read a day abbreviation and print \"Weekend\" if isWeekend is true, else \"Weekday\".",
    inputFormat: "A single string — one of MON, TUE, WED, THU, FRI, SAT, SUN.",
    outputFormat: "\"Weekend\" or \"Weekday\".",
    examples: [
      {
        input: "SAT",
        output: "Weekend",
      },
      {
        input: "MON",
        output: "Weekday",
      },
    ],
    constraints: ["Input is always a valid Day name."],
    hints: [
      "enum Day { MON(false), TUE(false), ..., SAT(true), SUN(true); boolean isWeekend; Day(boolean w) { isWeekend = w; } }",
      "Use Day d = Day.valueOf(sc.next()); to get the enum constant.",
      "Then check d.isWeekend.",
    ],
    referenceProgram: {
      title: "Day Enum with isWeekend field",
      description: "Enum with boolean field; valueOf() lookup; field check.",
      code: `import java.util.Scanner;
enum Day {
    MON(false), TUE(false), WED(false), THU(false), FRI(false), SAT(true), SUN(true);
    boolean isWeekend;
    Day(boolean isWeekend) { this.isWeekend = isWeekend; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Day d = Day.valueOf(sc.next());
        System.out.println(d.isWeekend ? "Weekend" : "Weekday");
    }
}`,
    },
    starterCode: `import java.util.Scanner;
enum Day {
    MON(false), TUE(false), WED(false), THU(false), FRI(false), SAT(true), SUN(true);
    boolean isWeekend;
    Day(boolean isWeekend) { this.isWeekend = isWeekend; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Day d = Day.valueOf(sc.next());
        // TODO: print "Weekend" or "Weekday" based on d.isWeekend
    }
}`,
    solution: `import java.util.Scanner;
enum Day {
    MON(false), TUE(false), WED(false), THU(false), FRI(false), SAT(true), SUN(true);
    boolean isWeekend;
    Day(boolean isWeekend) { this.isWeekend = isWeekend; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Day d = Day.valueOf(sc.next());
        System.out.println(d.isWeekend ? "Weekend" : "Weekday");
    }
}`,
    testCases: [
      {
        id: "JCH12_B3_T1",
        label: "Saturday",
        mockInputs: ["SAT"],
        expectedOutput: "Weekend",
      },
      {
        id: "JCH12_B3_T2",
        label: "Monday",
        mockInputs: ["MON"],
        expectedOutput: "Weekday",
      },
      {
        id: "JCH12_B3_T3",
        label: "Sunday",
        mockInputs: ["SUN"],
        expectedOutput: "Weekend",
        isBoundary: true,
      },
      {
        id: "JCH12_B3_T4",
        label: "Friday",
        mockInputs: ["FRI"],
        expectedOutput: "Weekday",
        isHidden: true,
      },
    ],
    concepts: ["enum", "enum field", "valueOf", "boolean"],
    xpReward: 70,
    estimatedMinutes: 8,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH12_I1",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "intermediate",
    tierIndex: 0,
    title: "Template Method Pattern",
    emoji: "📋",
    tagline: "Abstract class defines the algorithm skeleton; subclasses fill the steps.",
    problemStatement:
      "Define abstract class DataProcessor with a final method process(String data) that:\n1. Calls String validate(String data) — returns null if valid, or an error string.\n2. If validation fails, prints \"ERROR: \" + error and returns.\n3. Otherwise calls String transform(String data) and prints \"RESULT: \" + transformed.\n\nImplement UpperCaseProcessor (validate returns null always; transform uppercases) and TrimProcessor (validate returns \"Empty input\" if blank; transform returns trimmed string).\n\nRead N lines: each begins with type ('U' or 'T') followed by the data (rest of line). Call process() on the appropriate subclass.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 10).\nNext N lines: 'U <data>' or 'T <data>'.",
    outputFormat: "N lines — RESULT or ERROR per item.",
    examples: [
      {
        input: "3\nU hello world\nT   trimme  \nT  ",
        output: "RESULT: HELLO WORLD\nRESULT: trimme\nERROR: Empty input",
      },
    ],
    constraints: ["1 ≤ N ≤ 10", "Data strings may contain spaces."],
    hints: [
      "abstract class DataProcessor { abstract String validate(String data); abstract String transform(String data); final void process(String data) { ... } }",
      "UpperCaseProcessor.validate returns null; transform returns data.toUpperCase().",
      "TrimProcessor.validate: return data.trim().isEmpty() ? \"Empty input\" : null; transform: return data.trim();",
      "Read each line, extract type (first char), rest is data.",
    ],
    referenceProgram: {
      title: "Template Method — DataProcessor",
      description: "Final process() in abstract class; subclasses implement validate+transform.",
      code: `import java.util.Scanner;
abstract class DataProcessor {
    abstract String validate(String data);
    abstract String transform(String data);
    final void process(String data) {
        String err = validate(data);
        if (err != null) {
            System.out.println("ERROR: " + err);
        } else {
            System.out.println("RESULT: " + transform(data));
        }
    }
}
class UpperCaseProcessor extends DataProcessor {
    public String validate(String data) { return null; }
    public String transform(String data) { return data.toUpperCase(); }
}
class TrimProcessor extends DataProcessor {
    public String validate(String data) {
        return data.trim().isEmpty() ? "Empty input" : null;
    }
    public String transform(String data) { return data.trim(); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine();
            String type = line.substring(0, 1);
            String data = line.length() > 2 ? line.substring(2) : "";
            DataProcessor dp = type.equals("U") ? new UpperCaseProcessor() : new TrimProcessor();
            dp.process(data);
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
abstract class DataProcessor {
    abstract String validate(String data);
    abstract String transform(String data);
    final void process(String data) {
        String err = validate(data);
        if (err != null) {
            System.out.println("ERROR: " + err);
        } else {
            System.out.println("RESULT: " + transform(data));
        }
    }
}
// TODO: implement UpperCaseProcessor and TrimProcessor
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine();
            String type = line.substring(0, 1);
            String data = line.length() > 2 ? line.substring(2) : "";
            // TODO: create DataProcessor subtype, call process(data)
        }
    }
}`,
    solution: `import java.util.Scanner;
abstract class DataProcessor {
    abstract String validate(String data);
    abstract String transform(String data);
    final void process(String data) {
        String err = validate(data);
        if (err != null) {
            System.out.println("ERROR: " + err);
        } else {
            System.out.println("RESULT: " + transform(data));
        }
    }
}
class UpperCaseProcessor extends DataProcessor {
    public String validate(String data) { return null; }
    public String transform(String data) { return data.toUpperCase(); }
}
class TrimProcessor extends DataProcessor {
    public String validate(String data) {
        return data.trim().isEmpty() ? "Empty input" : null;
    }
    public String transform(String data) { return data.trim(); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine();
            String type = line.substring(0, 1);
            String data = line.length() > 2 ? line.substring(2) : "";
            DataProcessor dp = type.equals("U") ? new UpperCaseProcessor() : new TrimProcessor();
            dp.process(data);
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_I1_T1",
        label: "3 mixed items",
        mockInputs: ["3", "U hello world", "T   trimme  ", "T  "],
        expectedOutput: "RESULT: HELLO WORLD\nRESULT: trimme\nERROR: Empty input",
      },
      {
        id: "JCH12_I1_T2",
        label: "Single uppercase",
        mockInputs: ["1", "U java"],
        expectedOutput: "RESULT: JAVA",
        isBoundary: true,
      },
      {
        id: "JCH12_I1_T3",
        label: "Trim with no spaces",
        mockInputs: ["1", "T hello"],
        expectedOutput: "RESULT: hello",
        isHidden: true,
      },
    ],
    concepts: ["template method", "abstract class", "final method", "extends"],
    xpReward: 100,
    estimatedMinutes: 15,
  },

  {
    id: "JCH12_I2",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "intermediate",
    tierIndex: 1,
    title: "Abstract + Concrete Mix",
    emoji: "🧱",
    tagline: "Abstract class with both abstract and concrete methods — extend two ways.",
    problemStatement:
      "Define abstract class Employee with: String name, int baseSalary (constructor), concrete method int totalCTC() = baseSalary + bonus(), and abstract method int bonus(). Implement PermanentEmployee (bonus = 20% of baseSalary) and ContractEmployee (bonus = flat 5000). Read N employees: each line has type ('P' or 'C'), name, and baseSalary. Print \"name: totalCTC\" for each.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 10).\nNext N lines: type, name (string), baseSalary (int).",
    outputFormat: "N lines: \"<name>: <totalCTC>\"",
    examples: [
      {
        input: "2\nP Alice 50000\nC Bob 40000",
        output: "Alice: 60000\nBob: 45000",
        explanation: "Alice: 50000 + 10000 = 60000. Bob: 40000 + 5000 = 45000.",
      },
    ],
    constraints: ["1 ≤ N ≤ 10", "1000 ≤ baseSalary ≤ 1000000"],
    hints: [
      "abstract class Employee { String name; int baseSalary; Employee(String name, int base) {...} abstract int bonus(); int totalCTC() { return baseSalary + bonus(); } }",
      "PermanentEmployee.bonus: return baseSalary / 5; (20% = baseSalary * 0.2, use integer division of baseSalary/5)",
      "ContractEmployee.bonus: return 5000;",
      "Note: 20% = baseSalary * 20 / 100 in integer arithmetic to avoid double rounding.",
    ],
    referenceProgram: {
      title: "Employee Abstract Class — CTC Calculation",
      description: "Concrete totalCTC delegates to abstract bonus(); two subclasses.",
      code: `import java.util.Scanner;
abstract class Employee {
    String name;
    int baseSalary;
    Employee(String name, int baseSalary) { this.name = name; this.baseSalary = baseSalary; }
    abstract int bonus();
    int totalCTC() { return baseSalary + bonus(); }
}
class PermanentEmployee extends Employee {
    PermanentEmployee(String name, int baseSalary) { super(name, baseSalary); }
    public int bonus() { return baseSalary * 20 / 100; }
}
class ContractEmployee extends Employee {
    ContractEmployee(String name, int baseSalary) { super(name, baseSalary); }
    public int bonus() { return 5000; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String name = sc.next();
            int base    = sc.nextInt();
            Employee e  = type.equals("P") ? new PermanentEmployee(name, base)
                                           : new ContractEmployee(name, base);
            System.out.println(e.name + ": " + e.totalCTC());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
abstract class Employee {
    String name;
    int baseSalary;
    Employee(String name, int baseSalary) { this.name = name; this.baseSalary = baseSalary; }
    abstract int bonus();
    int totalCTC() { return baseSalary + bonus(); }
}
// TODO: implement PermanentEmployee (20% bonus) and ContractEmployee (flat 5000)
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String name = sc.next();
            int base    = sc.nextInt();
            // TODO: create correct Employee, print name: totalCTC
        }
    }
}`,
    solution: `import java.util.Scanner;
abstract class Employee {
    String name;
    int baseSalary;
    Employee(String name, int baseSalary) { this.name = name; this.baseSalary = baseSalary; }
    abstract int bonus();
    int totalCTC() { return baseSalary + bonus(); }
}
class PermanentEmployee extends Employee {
    PermanentEmployee(String name, int baseSalary) { super(name, baseSalary); }
    public int bonus() { return baseSalary * 20 / 100; }
}
class ContractEmployee extends Employee {
    ContractEmployee(String name, int baseSalary) { super(name, baseSalary); }
    public int bonus() { return 5000; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String name = sc.next();
            int base    = sc.nextInt();
            Employee e  = type.equals("P") ? new PermanentEmployee(name, base)
                                           : new ContractEmployee(name, base);
            System.out.println(e.name + ": " + e.totalCTC());
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_I2_T1",
        label: "Permanent + Contract",
        mockInputs: ["2", "P Alice 50000", "C Bob 40000"],
        expectedOutput: "Alice: 60000\nBob: 45000",
      },
      {
        id: "JCH12_I2_T2",
        label: "Contract only",
        mockInputs: ["1", "C Zara 10000"],
        expectedOutput: "Zara: 15000",
        isBoundary: true,
      },
      {
        id: "JCH12_I2_T3",
        label: "Permanent 100000",
        mockInputs: ["1", "P Dev 100000"],
        expectedOutput: "Dev: 120000",
        isHidden: true,
      },
    ],
    concepts: ["abstract class", "concrete method", "super()", "bonus pattern"],
    xpReward: 110,
    estimatedMinutes: 12,
  },

  {
    id: "JCH12_I3",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "intermediate",
    tierIndex: 2,
    title: "Enum with Methods",
    emoji: "🌡️",
    tagline: "Enum Planet with fields and a method — compute weight on each planet.",
    problemStatement:
      "Define enum Planet with constants MERCURY, VENUS, EARTH, MARS. Each has a surfaceGravity field (MERCURY=3.7, VENUS=8.87, EARTH=9.81, MARS=3.72). Add method double surfaceWeight(double mass) = mass * surfaceGravity. Read a mass (in kg) and print the surface weight on each planet formatted as \"PLANET: X.XX N\".",
    inputFormat: "A single double — mass in kg.",
    outputFormat:
      "4 lines: \"MERCURY: <weight> N\", \"VENUS: <weight> N\", \"EARTH: <weight> N\", \"MARS: <weight> N\".",
    examples: [
      {
        input: "75.0",
        output: "MERCURY: 277.50 N\nVENUS: 665.25 N\nEARTH: 735.75 N\nMARS: 279.00 N",
      },
    ],
    constraints: ["0 < mass ≤ 100000."],
    hints: [
      "enum Planet { MERCURY(3.7), VENUS(8.87), EARTH(9.81), MARS(3.72); double gravity; Planet(double g) { gravity = g; } double surfaceWeight(double mass) { return mass * gravity; } }",
      "Use Planet.values() to iterate all planets.",
      "System.out.printf(\"%s: %.2f N%n\", p.name(), p.surfaceWeight(mass));",
    ],
    referenceProgram: {
      title: "Planet Enum — Surface Weight",
      description: "Enum with gravity field and surfaceWeight method; iterate values().",
      code: `import java.util.Scanner;
enum Planet {
    MERCURY(3.7), VENUS(8.87), EARTH(9.81), MARS(3.72);
    double gravity;
    Planet(double g) { this.gravity = g; }
    double surfaceWeight(double mass) { return mass * gravity; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double mass = sc.nextDouble();
        for (Planet p : Planet.values()) {
            System.out.printf("%s: %.2f N%n", p.name(), p.surfaceWeight(mass));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
enum Planet {
    MERCURY(3.7), VENUS(8.87), EARTH(9.81), MARS(3.72);
    double gravity;
    Planet(double g) { this.gravity = g; }
    double surfaceWeight(double mass) { return mass * gravity; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double mass = sc.nextDouble();
        // TODO: iterate Planet.values() and print formatted surface weight
    }
}`,
    solution: `import java.util.Scanner;
enum Planet {
    MERCURY(3.7), VENUS(8.87), EARTH(9.81), MARS(3.72);
    double gravity;
    Planet(double g) { this.gravity = g; }
    double surfaceWeight(double mass) { return mass * gravity; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double mass = sc.nextDouble();
        for (Planet p : Planet.values()) {
            System.out.printf("%s: %.2f N%n", p.name(), p.surfaceWeight(mass));
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_I3_T1",
        label: "mass=75",
        mockInputs: ["75.0"],
        expectedOutput: "MERCURY: 277.50 N\nVENUS: 665.25 N\nEARTH: 735.75 N\nMARS: 279.00 N",
      },
      {
        id: "JCH12_I3_T2",
        label: "mass=1",
        mockInputs: ["1.0"],
        expectedOutput: "MERCURY: 3.70 N\nVENUS: 8.87 N\nEARTH: 9.81 N\nMARS: 3.72 N",
        isBoundary: true,
      },
      {
        id: "JCH12_I3_T3",
        label: "mass=100",
        mockInputs: ["100.0"],
        expectedOutput: "MERCURY: 370.00 N\nVENUS: 887.00 N\nEARTH: 981.00 N\nMARS: 372.00 N",
        isHidden: true,
      },
    ],
    concepts: ["enum", "enum method", "enum field", "values()", "name()"],
    xpReward: 130,
    estimatedMinutes: 12,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH12_A1",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "advanced",
    tierIndex: 0,
    title: "Enum with Abstract Method per Variant",
    emoji: "⚙️",
    tagline: "Each enum constant overrides an abstract method with its own logic.",
    problemStatement:
      "Define enum Operation with constants ADD, SUB, MUL, DIV — each overriding abstract double apply(double a, double b). DIV should return 0 when b == 0. Read N expressions (each \"a OP b\" where OP is ADD/SUB/MUL/DIV). Print each result to 2 decimal places.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 20).\nNext N lines: double OP double.",
    outputFormat: "N lines — result to 2 dp.",
    examples: [
      {
        input: "4\n10.0 ADD 3.0\n10.0 SUB 3.0\n10.0 MUL 3.0\n10.0 DIV 0.0",
        output: "13.00\n7.00\n30.00\n0.00",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "DIV by zero returns 0.00."],
    hints: [
      "enum Operation { ADD { public double apply(double a, double b) { return a+b; } }, ... ; abstract double apply(double a, double b); }",
      "Use Operation op = Operation.valueOf(opStr); then op.apply(a, b).",
      "DIV: public double apply(double a, double b) { return b == 0 ? 0 : a / b; }",
    ],
    referenceProgram: {
      title: "Enum with Abstract Method — Operations",
      description: "Each enum constant has its own apply(); dispatched via valueOf().",
      code: `import java.util.Scanner;
enum Operation {
    ADD {
        public double apply(double a, double b) { return a + b; }
    },
    SUB {
        public double apply(double a, double b) { return a - b; }
    },
    MUL {
        public double apply(double a, double b) { return a * b; }
    },
    DIV {
        public double apply(double a, double b) { return b == 0 ? 0 : a / b; }
    };
    abstract double apply(double a, double b);
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            double a     = sc.nextDouble();
            String opStr = sc.next();
            double b     = sc.nextDouble();
            Operation op = Operation.valueOf(opStr);
            System.out.printf("%.2f%n", op.apply(a, b));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
enum Operation {
    ADD {
        public double apply(double a, double b) { return 0; /* TODO */ }
    },
    SUB {
        public double apply(double a, double b) { return 0; /* TODO */ }
    },
    MUL {
        public double apply(double a, double b) { return 0; /* TODO */ }
    },
    DIV {
        public double apply(double a, double b) { return 0; /* TODO */ }
    };
    abstract double apply(double a, double b);
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            double a     = sc.nextDouble();
            String opStr = sc.next();
            double b     = sc.nextDouble();
            Operation op = Operation.valueOf(opStr);
            System.out.printf("%.2f%n", op.apply(a, b));
        }
    }
}`,
    solution: `import java.util.Scanner;
enum Operation {
    ADD {
        public double apply(double a, double b) { return a + b; }
    },
    SUB {
        public double apply(double a, double b) { return a - b; }
    },
    MUL {
        public double apply(double a, double b) { return a * b; }
    },
    DIV {
        public double apply(double a, double b) { return b == 0 ? 0 : a / b; }
    };
    abstract double apply(double a, double b);
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            double a     = sc.nextDouble();
            String opStr = sc.next();
            double b     = sc.nextDouble();
            Operation op = Operation.valueOf(opStr);
            System.out.printf("%.2f%n", op.apply(a, b));
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_A1_T1",
        label: "4 operations with DIV by zero",
        mockInputs: ["4", "10.0 ADD 3.0", "10.0 SUB 3.0", "10.0 MUL 3.0", "10.0 DIV 0.0"],
        expectedOutput: "13.00\n7.00\n30.00\n0.00",
      },
      {
        id: "JCH12_A1_T2",
        label: "DIV success",
        mockInputs: ["1", "9.0 DIV 3.0"],
        expectedOutput: "3.00",
      },
      {
        id: "JCH12_A1_T3",
        label: "MUL by zero",
        mockInputs: ["1", "0.0 MUL 99.0"],
        expectedOutput: "0.00",
        isBoundary: true,
      },
      {
        id: "JCH12_A1_T4",
        label: "SUB negative",
        mockInputs: ["1", "3.0 SUB 10.0"],
        expectedOutput: "-7.00",
        isHidden: true,
      },
    ],
    concepts: ["enum", "abstract method in enum", "valueOf", "per-constant body"],
    xpReward: 150,
    estimatedMinutes: 18,
  },

  {
    id: "JCH12_A2",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "advanced",
    tierIndex: 1,
    title: "Discount Policy Enum",
    emoji: "🏷️",
    tagline: "Enum DiscountTier with fields and a method to apply discount to a price.",
    problemStatement:
      "Define enum DiscountTier: REGULAR (0% discount), SILVER (10%), GOLD (20%), PLATINUM (35%). Each has a int discountPercent field. Add method double discountedPrice(double original) = original * (1 - discountPercent / 100.0). Read N orders: each line has tier name and original price. Print the discounted price to 2 decimal places.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 10).\nNext N lines: tier (REGULAR/SILVER/GOLD/PLATINUM) and price (double).",
    outputFormat: "N lines — discounted price to 2 dp.",
    examples: [
      {
        input: "3\nGOLD 1000.0\nPLATINUM 500.0\nREGULAR 200.0",
        output: "800.00\n325.00\n200.00",
      },
    ],
    constraints: ["1 ≤ N ≤ 10", "price > 0"],
    hints: [
      "enum DiscountTier { REGULAR(0), SILVER(10), GOLD(20), PLATINUM(35); int discountPercent; ... }",
      "discountedPrice: return original * (1 - discountPercent / 100.0);",
      "DiscountTier t = DiscountTier.valueOf(sc.next()); double price = sc.nextDouble();",
    ],
    referenceProgram: {
      title: "DiscountTier Enum with discountedPrice()",
      description: "Enum constants hold discount %; method computes final price.",
      code: `import java.util.Scanner;
enum DiscountTier {
    REGULAR(0), SILVER(10), GOLD(20), PLATINUM(35);
    int discountPercent;
    DiscountTier(int dp) { this.discountPercent = dp; }
    double discountedPrice(double original) { return original * (1 - discountPercent / 100.0); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            DiscountTier t = DiscountTier.valueOf(sc.next());
            double price   = sc.nextDouble();
            System.out.printf("%.2f%n", t.discountedPrice(price));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
enum DiscountTier {
    REGULAR(0), SILVER(10), GOLD(20), PLATINUM(35);
    int discountPercent;
    DiscountTier(int dp) { this.discountPercent = dp; }
    double discountedPrice(double original) {
        // TODO: return original * (1 - discountPercent / 100.0)
        return original;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            DiscountTier t = DiscountTier.valueOf(sc.next());
            double price   = sc.nextDouble();
            System.out.printf("%.2f%n", t.discountedPrice(price));
        }
    }
}`,
    solution: `import java.util.Scanner;
enum DiscountTier {
    REGULAR(0), SILVER(10), GOLD(20), PLATINUM(35);
    int discountPercent;
    DiscountTier(int dp) { this.discountPercent = dp; }
    double discountedPrice(double original) { return original * (1 - discountPercent / 100.0); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            DiscountTier t = DiscountTier.valueOf(sc.next());
            double price   = sc.nextDouble();
            System.out.printf("%.2f%n", t.discountedPrice(price));
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_A2_T1",
        label: "GOLD PLATINUM REGULAR",
        mockInputs: ["3", "GOLD 1000.0", "PLATINUM 500.0", "REGULAR 200.0"],
        expectedOutput: "800.00\n325.00\n200.00",
      },
      {
        id: "JCH12_A2_T2",
        label: "SILVER only",
        mockInputs: ["1", "SILVER 100.0"],
        expectedOutput: "90.00",
        isBoundary: true,
      },
      {
        id: "JCH12_A2_T3",
        label: "PLATINUM large price",
        mockInputs: ["1", "PLATINUM 2000.0"],
        expectedOutput: "1300.00",
        isHidden: true,
      },
    ],
    concepts: ["enum", "enum field", "enum method", "valueOf", "discount"],
    xpReward: 175,
    estimatedMinutes: 15,
  },

  {
    id: "JCH12_A3",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "advanced",
    tierIndex: 2,
    title: "Abstract Comparable Products",
    emoji: "📦",
    tagline: "Abstract Product with Comparable — sort products by price then name.",
    problemStatement:
      "Define abstract class Product implementing Comparable<Product> with fields name and double price. Abstract method String category(). compareTo orders by price ascending; for equal prices by name ascending. Implement DigitalProduct (category = \"Digital\") and PhysicalProduct (category = \"Physical\"). Read N products: each line has 'D' or 'P', name, price. Sort and print each as \"[category] name price\" to 2 dp.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 20).\nNext N lines: type ('D' or 'P'), name, price (double).",
    outputFormat: "N sorted lines: \"[<category>] <name> <price>\"",
    examples: [
      {
        input: "3\nD eBook 9.99\nP Chair 49.99\nD App 9.99",
        output: "[Digital] App 9.99\n[Digital] eBook 9.99\n[Physical] Chair 49.99",
        explanation: "App and eBook tie at 9.99; App < eBook alphabetically.",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "price > 0"],
    hints: [
      "abstract class Product implements Comparable<Product> { ... abstract String category(); public int compareTo(Product o) { ... } }",
      "For price comparison: Double.compare(this.price, o.price) — returns negative/zero/positive.",
      "For name tie: this.name.compareTo(o.name).",
      "Store in Product[] arr, call Arrays.sort(arr).",
      "Print: System.out.printf(\"[%s] %s %.2f%n\", p.category(), p.name, p.price);",
    ],
    referenceProgram: {
      title: "Abstract Product with Comparable",
      description: "Abstract base implements Comparable; two subclasses provide category().",
      code: `import java.util.Scanner;
import java.util.Arrays;
abstract class Product implements Comparable<Product> {
    String name;
    double price;
    Product(String name, double price) { this.name = name; this.price = price; }
    abstract String category();
    public int compareTo(Product o) {
        int cmp = Double.compare(this.price, o.price);
        return cmp != 0 ? cmp : this.name.compareTo(o.name);
    }
}
class DigitalProduct extends Product {
    DigitalProduct(String name, double price) { super(name, price); }
    public String category() { return "Digital"; }
}
class PhysicalProduct extends Product {
    PhysicalProduct(String name, double price) { super(name, price); }
    public String category() { return "Physical"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Product[] arr = new Product[n];
        for (int i = 0; i < n; i++) {
            String type  = sc.next();
            String name  = sc.next();
            double price = sc.nextDouble();
            arr[i] = type.equals("D") ? new DigitalProduct(name, price)
                                      : new PhysicalProduct(name, price);
        }
        Arrays.sort(arr);
        for (Product p : arr) System.out.printf("[%s] %s %.2f%n", p.category(), p.name, p.price);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
abstract class Product implements Comparable<Product> {
    String name;
    double price;
    Product(String name, double price) { this.name = name; this.price = price; }
    abstract String category();
    public int compareTo(Product o) {
        // TODO: sort by price ascending; ties by name ascending
        return 0;
    }
}
// TODO: implement DigitalProduct and PhysicalProduct
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Product[] arr = new Product[n];
        for (int i = 0; i < n; i++) {
            String type  = sc.next();
            String name  = sc.next();
            double price = sc.nextDouble();
            arr[i] = type.equals("D") ? new DigitalProduct(name, price)
                                      : new PhysicalProduct(name, price);
        }
        Arrays.sort(arr);
        for (Product p : arr) System.out.printf("[%s] %s %.2f%n", p.category(), p.name, p.price);
    }
}`,
    solution: `import java.util.Scanner;
import java.util.Arrays;
abstract class Product implements Comparable<Product> {
    String name;
    double price;
    Product(String name, double price) { this.name = name; this.price = price; }
    abstract String category();
    public int compareTo(Product o) {
        int cmp = Double.compare(this.price, o.price);
        return cmp != 0 ? cmp : this.name.compareTo(o.name);
    }
}
class DigitalProduct extends Product {
    DigitalProduct(String name, double price) { super(name, price); }
    public String category() { return "Digital"; }
}
class PhysicalProduct extends Product {
    PhysicalProduct(String name, double price) { super(name, price); }
    public String category() { return "Physical"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Product[] arr = new Product[n];
        for (int i = 0; i < n; i++) {
            String type  = sc.next();
            String name  = sc.next();
            double price = sc.nextDouble();
            arr[i] = type.equals("D") ? new DigitalProduct(name, price)
                                      : new PhysicalProduct(name, price);
        }
        Arrays.sort(arr);
        for (Product p : arr) System.out.printf("[%s] %s %.2f%n", p.category(), p.name, p.price);
    }
}`,
    testCases: [
      {
        id: "JCH12_A3_T1",
        label: "3 products with tie",
        mockInputs: ["3", "D eBook 9.99", "P Chair 49.99", "D App 9.99"],
        expectedOutput: "[Digital] App 9.99\n[Digital] eBook 9.99\n[Physical] Chair 49.99",
      },
      {
        id: "JCH12_A3_T2",
        label: "Single product",
        mockInputs: ["1", "P Desk 199.99"],
        expectedOutput: "[Physical] Desk 199.99",
        isBoundary: true,
      },
      {
        id: "JCH12_A3_T3",
        label: "All same price",
        mockInputs: ["3", "P Zebra 5.00", "D Alpha 5.00", "P Mango 5.00"],
        expectedOutput: "[Digital] Alpha 5.00\n[Physical] Mango 5.00\n[Physical] Zebra 5.00",
        isHidden: true,
      },
    ],
    concepts: ["abstract class", "Comparable", "Double.compare", "Arrays.sort", "extends"],
    xpReward: 200,
    estimatedMinutes: 20,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH12_L1",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "leetcode",
    tierIndex: 0,
    title: "Shape Factory",
    emoji: "🏭",
    tagline: "Abstract factory method — create shapes from a code and compute area + perimeter.",
    problemStatement:
      "Define abstract class Shape2D with abstract methods double area() and double perimeter(). Implement Triangle (equilateral: area = (sqrt(3)/4)*side², perimeter = 3*side) and Trapezoid (area = (a+b)/2*h, perimeter = a+b+leg1+leg2). Read N shape descriptors:\n- 'T <side>' for Triangle\n- 'Z <a> <b> <h> <leg1> <leg2>' for Trapezoid\nPrint area and perimeter for each, both to 2 dp, on one line as \"area=X.XX perimeter=Y.YY\".",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 10).\nNext N lines: shape descriptor.",
    outputFormat: "N lines: \"area=X.XX perimeter=Y.YY\"",
    examples: [
      {
        input: "2\nT 6.0\nZ 8.0 5.0 4.0 4.0 5.0",
        output: "area=15.59 perimeter=18.00\narea=26.00 perimeter=22.00",
        explanation: "Triangle: (sqrt(3)/4)*36=15.59; perimeter=18. Trapezoid: (8+5)/2*4=26; perimeter=8+5+4+5=22.",
      },
    ],
    constraints: ["1 ≤ N ≤ 10", "All dimensions are positive doubles."],
    hints: [
      "abstract class Shape2D { abstract double area(); abstract double perimeter(); }",
      "Triangle: area = Math.sqrt(3) / 4 * side * side; perimeter = 3 * side;",
      "Trapezoid: area = (a + b) / 2 * h; perimeter = a + b + leg1 + leg2;",
      "Read with sc.next() for code, sc.nextDouble() for dimensions.",
    ],
    referenceProgram: {
      title: "Shape Factory — Triangle and Trapezoid",
      description: "Two subclasses of Shape2D; factory selects based on code.",
      code: `import java.util.Scanner;
abstract class Shape2D {
    abstract double area();
    abstract double perimeter();
}
class Triangle extends Shape2D {
    double side;
    Triangle(double side) { this.side = side; }
    public double area()      { return Math.sqrt(3) / 4 * side * side; }
    public double perimeter() { return 3 * side; }
}
class Trapezoid extends Shape2D {
    double a, b, h, leg1, leg2;
    Trapezoid(double a, double b, double h, double leg1, double leg2) {
        this.a = a; this.b = b; this.h = h; this.leg1 = leg1; this.leg2 = leg2;
    }
    public double area()      { return (a + b) / 2 * h; }
    public double perimeter() { return a + b + leg1 + leg2; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            Shape2D s;
            if (code.equals("T")) {
                s = new Triangle(sc.nextDouble());
            } else {
                s = new Trapezoid(sc.nextDouble(), sc.nextDouble(),
                                  sc.nextDouble(), sc.nextDouble(), sc.nextDouble());
            }
            System.out.printf("area=%.2f perimeter=%.2f%n", s.area(), s.perimeter());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
abstract class Shape2D {
    abstract double area();
    abstract double perimeter();
}
// TODO: implement Triangle and Trapezoid extending Shape2D
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            Shape2D s;
            if (code.equals("T")) {
                double side = sc.nextDouble();
                s = null; // TODO: new Triangle(side)
            } else {
                double a = sc.nextDouble(), b = sc.nextDouble(), h = sc.nextDouble();
                double l1 = sc.nextDouble(), l2 = sc.nextDouble();
                s = null; // TODO: new Trapezoid(a,b,h,l1,l2)
            }
            System.out.printf("area=%.2f perimeter=%.2f%n", s.area(), s.perimeter());
        }
    }
}`,
    solution: `import java.util.Scanner;
abstract class Shape2D {
    abstract double area();
    abstract double perimeter();
}
class Triangle extends Shape2D {
    double side;
    Triangle(double side) { this.side = side; }
    public double area()      { return Math.sqrt(3) / 4 * side * side; }
    public double perimeter() { return 3 * side; }
}
class Trapezoid extends Shape2D {
    double a, b, h, leg1, leg2;
    Trapezoid(double a, double b, double h, double leg1, double leg2) {
        this.a = a; this.b = b; this.h = h; this.leg1 = leg1; this.leg2 = leg2;
    }
    public double area()      { return (a + b) / 2 * h; }
    public double perimeter() { return a + b + leg1 + leg2; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String code = sc.next();
            Shape2D s;
            if (code.equals("T")) {
                s = new Triangle(sc.nextDouble());
            } else {
                s = new Trapezoid(sc.nextDouble(), sc.nextDouble(),
                                  sc.nextDouble(), sc.nextDouble(), sc.nextDouble());
            }
            System.out.printf("area=%.2f perimeter=%.2f%n", s.area(), s.perimeter());
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_L1_T1",
        label: "Triangle + Trapezoid",
        mockInputs: ["2", "T 6.0", "Z 8.0 5.0 4.0 4.0 5.0"],
        expectedOutput: "area=15.59 perimeter=18.00\narea=26.00 perimeter=22.00",
      },
      {
        id: "JCH12_L1_T2",
        label: "Triangle side=2",
        mockInputs: ["1", "T 2.0"],
        expectedOutput: "area=1.73 perimeter=6.00",
        isBoundary: true,
      },
      {
        id: "JCH12_L1_T3",
        label: "Square trapezoid (a=b, equal legs)",
        mockInputs: ["1", "Z 4.0 4.0 3.0 3.0 3.0"],
        expectedOutput: "area=12.00 perimeter=14.00",
        isHidden: true,
      },
    ],
    concepts: ["abstract class", "factory", "Math.sqrt", "extends"],
    xpReward: 250,
    estimatedMinutes: 20,
    timeComplexityTarget: "O(1) per shape",
  },

  {
    id: "JCH12_L2",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "leetcode",
    tierIndex: 1,
    title: "Sorting Strategy with Abstract Class",
    emoji: "🔀",
    tagline: "Abstract SortStrategy class — implement bubble sort and selection sort.",
    problemStatement:
      "Define abstract class SortStrategy with abstract method int[] sort(int[] arr) and a concrete method void printSteps(int[] arr) that prints each step on one line (space-separated, after each swap) — called by sort implementations at each swap. Implement BubbleSort and SelectionSort. Read strategy ('B' or 'S'), then N integers. Print the sorted array (steps are not tested — only the final sorted output).",
    inputFormat:
      "Line 1: 'B' or 'S'.\nLine 2: N (1 ≤ N ≤ 20).\nNext N lines: one integer per line.",
    outputFormat: "Sorted integers space-separated on one line.",
    examples: [
      {
        input: "B\n4\n3\n1\n4\n2",
        output: "1 2 3 4",
      },
      {
        input: "S\n4\n3\n1\n4\n2",
        output: "1 2 3 4",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "Elements in [-1000, 1000]."],
    hints: [
      "abstract class SortStrategy { abstract int[] sort(int[] arr); }",
      "BubbleSort: nested for-loops, swap if arr[j] > arr[j+1].",
      "SelectionSort: find min in unsorted portion, swap with position i.",
      "Print final result with space separator only.",
    ],
    referenceProgram: {
      title: "Abstract SortStrategy — Bubble and Selection",
      description: "Two concrete sort implementations share the abstract base.",
      code: `import java.util.Scanner;
abstract class SortStrategy {
    abstract int[] sort(int[] arr);
}
class BubbleSort extends SortStrategy {
    public int[] sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - 1 - i; j++)
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;
                }
        return arr;
    }
}
class SelectionSort extends SortStrategy {
    public int[] sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) if (arr[j] < arr[minIdx]) minIdx = j;
            int tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
        }
        return arr;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String strat = sc.next();
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        SortStrategy s = strat.equals("B") ? new BubbleSort() : new SelectionSort();
        int[] result = s.sort(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { if (i > 0) sb.append(" "); sb.append(result[i]); }
        System.out.println(sb.toString());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
abstract class SortStrategy {
    abstract int[] sort(int[] arr);
}
// TODO: implement BubbleSort and SelectionSort extending SortStrategy
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String strat = sc.next();
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        SortStrategy s = strat.equals("B") ? new BubbleSort() : new SelectionSort();
        int[] result = s.sort(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { if (i > 0) sb.append(" "); sb.append(result[i]); }
        System.out.println(sb.toString());
    }
}`,
    solution: `import java.util.Scanner;
abstract class SortStrategy {
    abstract int[] sort(int[] arr);
}
class BubbleSort extends SortStrategy {
    public int[] sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - 1 - i; j++)
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;
                }
        return arr;
    }
}
class SelectionSort extends SortStrategy {
    public int[] sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) if (arr[j] < arr[minIdx]) minIdx = j;
            int tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
        }
        return arr;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String strat = sc.next();
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        SortStrategy s = strat.equals("B") ? new BubbleSort() : new SelectionSort();
        int[] result = s.sort(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) { if (i > 0) sb.append(" "); sb.append(result[i]); }
        System.out.println(sb.toString());
    }
}`,
    testCases: [
      {
        id: "JCH12_L2_T1",
        label: "Bubble sort 4 numbers",
        mockInputs: ["B", "4", "3", "1", "4", "2"],
        expectedOutput: "1 2 3 4",
      },
      {
        id: "JCH12_L2_T2",
        label: "Selection sort 4 numbers",
        mockInputs: ["S", "4", "3", "1", "4", "2"],
        expectedOutput: "1 2 3 4",
      },
      {
        id: "JCH12_L2_T3",
        label: "Single element",
        mockInputs: ["B", "1", "42"],
        expectedOutput: "42",
        isBoundary: true,
      },
      {
        id: "JCH12_L2_T4",
        label: "Already sorted selection",
        mockInputs: ["S", "3", "1", "2", "3"],
        expectedOutput: "1 2 3",
        isHidden: true,
      },
    ],
    concepts: ["abstract class", "strategy pattern", "bubble sort", "selection sort"],
    xpReward: 270,
    estimatedMinutes: 22,
    timeComplexityTarget: "O(N²)",
  },

  {
    id: "JCH12_L3",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "leetcode",
    tierIndex: 2,
    title: "State Machine with Enum",
    emoji: "🔄",
    tagline: "Model a vending machine state machine using an enum with transitions.",
    problemStatement:
      "Model a vending machine with enum State: IDLE, COIN_INSERTED, ITEM_SELECTED, DISPENSING. Define transitions:\n- IDLE + \"INSERT\" → COIN_INSERTED\n- COIN_INSERTED + \"SELECT\" → ITEM_SELECTED\n- ITEM_SELECTED + \"DISPENSE\" → DISPENSING\n- DISPENSING + \"COLLECT\" → IDLE\n- Any invalid action → print \"INVALID\" and stay in current state\n\nRead an initial state, then N commands. Print the state after each command.",
    inputFormat:
      "Line 1: initial state (IDLE, COIN_INSERTED, ITEM_SELECTED, or DISPENSING).\nLine 2: N (1 ≤ N ≤ 20).\nNext N lines: one command each.",
    outputFormat: "N lines — current state after each command.",
    examples: [
      {
        input: "IDLE\n5\nINSERT\nSELECT\nDISPENSE\nCOLLECT\nINSERT",
        output: "COIN_INSERTED\nITEM_SELECTED\nDISPENSING\nIDLE\nCOIN_INSERTED",
      },
      {
        input: "IDLE\n2\nSELECT\nINSERT",
        output: "INVALID\nCOIN_INSERTED",
      },
    ],
    constraints: ["1 ≤ N ≤ 20"],
    hints: [
      "enum State { IDLE, COIN_INSERTED, ITEM_SELECTED, DISPENSING; State next(String action) { ... } }",
      "In next(): use switch on this name and action, return new state or null for invalid.",
      "If null, print \"INVALID\" and return the same state.",
    ],
    referenceProgram: {
      title: "Vending Machine State Machine Enum",
      description: "Enum State with next() transition method; invalid stays, prints INVALID.",
      code: `import java.util.Scanner;
enum State {
    IDLE, COIN_INSERTED, ITEM_SELECTED, DISPENSING;
    State next(String action) {
        switch (this) {
            case IDLE:          if (action.equals("INSERT"))  return COIN_INSERTED;  break;
            case COIN_INSERTED: if (action.equals("SELECT"))  return ITEM_SELECTED;  break;
            case ITEM_SELECTED: if (action.equals("DISPENSE"))return DISPENSING;     break;
            case DISPENSING:    if (action.equals("COLLECT")) return IDLE;           break;
        }
        return null;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        State current = State.valueOf(sc.next());
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String action = sc.next();
            State next = current.next(action);
            if (next == null) {
                System.out.println("INVALID");
            } else {
                current = next;
                System.out.println(current.name());
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
enum State {
    IDLE, COIN_INSERTED, ITEM_SELECTED, DISPENSING;
    State next(String action) {
        // TODO: return new state for valid transition, null for invalid
        return null;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        State current = State.valueOf(sc.next());
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String action = sc.next();
            State next = current.next(action);
            if (next == null) {
                System.out.println("INVALID");
            } else {
                current = next;
                System.out.println(current.name());
            }
        }
    }
}`,
    solution: `import java.util.Scanner;
enum State {
    IDLE, COIN_INSERTED, ITEM_SELECTED, DISPENSING;
    State next(String action) {
        switch (this) {
            case IDLE:          if (action.equals("INSERT"))  return COIN_INSERTED;  break;
            case COIN_INSERTED: if (action.equals("SELECT"))  return ITEM_SELECTED;  break;
            case ITEM_SELECTED: if (action.equals("DISPENSE"))return DISPENSING;     break;
            case DISPENSING:    if (action.equals("COLLECT")) return IDLE;           break;
        }
        return null;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        State current = State.valueOf(sc.next());
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String action = sc.next();
            State next = current.next(action);
            if (next == null) {
                System.out.println("INVALID");
            } else {
                current = next;
                System.out.println(current.name());
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_L3_T1",
        label: "Full cycle",
        mockInputs: ["IDLE", "5", "INSERT", "SELECT", "DISPENSE", "COLLECT", "INSERT"],
        expectedOutput: "COIN_INSERTED\nITEM_SELECTED\nDISPENSING\nIDLE\nCOIN_INSERTED",
      },
      {
        id: "JCH12_L3_T2",
        label: "Invalid then valid",
        mockInputs: ["IDLE", "2", "SELECT", "INSERT"],
        expectedOutput: "INVALID\nCOIN_INSERTED",
      },
      {
        id: "JCH12_L3_T3",
        label: "All invalid from DISPENSING",
        mockInputs: ["DISPENSING", "2", "INSERT", "COLLECT"],
        expectedOutput: "INVALID\nIDLE",
        isBoundary: true,
      },
      {
        id: "JCH12_L3_T4",
        label: "Multiple invalid",
        mockInputs: ["IDLE", "3", "DISPENSE", "COLLECT", "INSERT"],
        expectedOutput: "INVALID\nINVALID\nCOIN_INSERTED",
        isHidden: true,
      },
    ],
    concepts: ["enum", "state machine", "valueOf", "switch", "transition"],
    xpReward: 300,
    estimatedMinutes: 25,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH12_H1",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "hackathon",
    tierIndex: 0,
    title: "Game Character System",
    emoji: "⚔️",
    tagline: "Abstract Character class with enum CharacterClass — build a full RPG character.",
    problemStatement:
      "Design a game character system:\n\nDefine enum CharacterClass: WARRIOR, MAGE, ARCHER — each with int baseAttack and int baseDefense fields.\n\nDefine abstract class Character with: String name, int level, CharacterClass charClass. Concrete method int attack() = charClass.baseAttack + level * 2. Abstract method String specialMove().\n\nImplement:\n- Knight extends Character (specialMove returns \"Shield Bash\")\n- Wizard extends Character (specialMove returns \"Fireball\")\n- Ranger extends Character (specialMove returns \"Arrow Rain\")\n\nRead N characters: each line has subtype ('K', 'W', 'R'), name, level.\nPrint for each: \"<name> [<charClass>] ATK=<attack> MOVE=<specialMove>\".\nKnight uses WARRIOR, Wizard uses MAGE, Ranger uses ARCHER.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 10).\nNext N lines: subtype, name, level.",
    outputFormat: "N lines as described.",
    examples: [
      {
        input: "3\nK Thorin 5\nW Gandalf 10\nR Legolas 8",
        output:
          "Thorin [WARRIOR] ATK=20 MOVE=Shield Bash\nGandalf [MAGE] ATK=30 MOVE=Fireball\nLegolas [ARCHER] ATK=26 MOVE=Arrow Rain",
        explanation:
          "WARRIOR baseAttack=10; Thorin: 10+5*2=20. MAGE baseAttack=10; Gandalf: 10+10*2=30. ARCHER baseAttack=10; Legolas: 10+8*2=26.",
      },
    ],
    constraints: [
      "1 ≤ N ≤ 10",
      "1 ≤ level ≤ 50",
      "CharacterClass baseAttack is 10 for all three.",
    ],
    hints: [
      "enum CharacterClass { WARRIOR(10, 15), MAGE(10, 5), ARCHER(10, 10); int baseAttack, baseDefense; CharacterClass(int a, int d) { ... } }",
      "abstract class Character { ...; int attack() { return charClass.baseAttack + level * 2; } abstract String specialMove(); }",
      "Knight extends Character, sets charClass=CharacterClass.WARRIOR in constructor.",
      "Print: System.out.println(c.name + \" [\" + c.charClass.name() + \"] ATK=\" + c.attack() + \" MOVE=\" + c.specialMove());",
    ],
    referenceProgram: {
      title: "Game Character System — Abstract + Enum",
      description: "Abstract Character class with CharacterClass enum; three subclasses.",
      code: `import java.util.Scanner;
enum CharacterClass {
    WARRIOR(10, 15), MAGE(10, 5), ARCHER(10, 10);
    int baseAttack, baseDefense;
    CharacterClass(int a, int d) { this.baseAttack = a; this.baseDefense = d; }
}
abstract class Character {
    String name;
    int level;
    CharacterClass charClass;
    Character(String name, int level, CharacterClass charClass) {
        this.name = name; this.level = level; this.charClass = charClass;
    }
    int attack() { return charClass.baseAttack + level * 2; }
    abstract String specialMove();
}
class Knight extends Character {
    Knight(String name, int level) { super(name, level, CharacterClass.WARRIOR); }
    public String specialMove() { return "Shield Bash"; }
}
class Wizard extends Character {
    Wizard(String name, int level) { super(name, level, CharacterClass.MAGE); }
    public String specialMove() { return "Fireball"; }
}
class Ranger extends Character {
    Ranger(String name, int level) { super(name, level, CharacterClass.ARCHER); }
    public String specialMove() { return "Arrow Rain"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String sub  = sc.next();
            String name = sc.next();
            int level   = sc.nextInt();
            Character c;
            switch (sub) {
                case "K": c = new Knight(name, level); break;
                case "W": c = new Wizard(name, level); break;
                default:  c = new Ranger(name, level); break;
            }
            System.out.println(c.name + " [" + c.charClass.name() + "] ATK=" + c.attack() + " MOVE=" + c.specialMove());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
enum CharacterClass {
    WARRIOR(10, 15), MAGE(10, 5), ARCHER(10, 10);
    int baseAttack, baseDefense;
    CharacterClass(int a, int d) { this.baseAttack = a; this.baseDefense = d; }
}
abstract class Character {
    String name;
    int level;
    CharacterClass charClass;
    Character(String name, int level, CharacterClass charClass) {
        this.name = name; this.level = level; this.charClass = charClass;
    }
    int attack() { return charClass.baseAttack + level * 2; }
    abstract String specialMove();
}
// TODO: implement Knight (WARRIOR, "Shield Bash"), Wizard (MAGE, "Fireball"), Ranger (ARCHER, "Arrow Rain")
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String sub  = sc.next();
            String name = sc.next();
            int level   = sc.nextInt();
            // TODO: create correct Character subtype, print formatted line
        }
    }
}`,
    solution: `import java.util.Scanner;
enum CharacterClass {
    WARRIOR(10, 15), MAGE(10, 5), ARCHER(10, 10);
    int baseAttack, baseDefense;
    CharacterClass(int a, int d) { this.baseAttack = a; this.baseDefense = d; }
}
abstract class Character {
    String name;
    int level;
    CharacterClass charClass;
    Character(String name, int level, CharacterClass charClass) {
        this.name = name; this.level = level; this.charClass = charClass;
    }
    int attack() { return charClass.baseAttack + level * 2; }
    abstract String specialMove();
}
class Knight extends Character {
    Knight(String name, int level) { super(name, level, CharacterClass.WARRIOR); }
    public String specialMove() { return "Shield Bash"; }
}
class Wizard extends Character {
    Wizard(String name, int level) { super(name, level, CharacterClass.MAGE); }
    public String specialMove() { return "Fireball"; }
}
class Ranger extends Character {
    Ranger(String name, int level) { super(name, level, CharacterClass.ARCHER); }
    public String specialMove() { return "Arrow Rain"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String sub  = sc.next();
            String name = sc.next();
            int level   = sc.nextInt();
            Character c;
            switch (sub) {
                case "K": c = new Knight(name, level); break;
                case "W": c = new Wizard(name, level); break;
                default:  c = new Ranger(name, level); break;
            }
            System.out.println(c.name + " [" + c.charClass.name() + "] ATK=" + c.attack() + " MOVE=" + c.specialMove());
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_H1_T1",
        label: "3 character types",
        mockInputs: ["3", "K Thorin 5", "W Gandalf 10", "R Legolas 8"],
        expectedOutput:
          "Thorin [WARRIOR] ATK=20 MOVE=Shield Bash\nGandalf [MAGE] ATK=30 MOVE=Fireball\nLegolas [ARCHER] ATK=26 MOVE=Arrow Rain",
      },
      {
        id: "JCH12_H1_T2",
        label: "Level 1 Knight",
        mockInputs: ["1", "K Hero 1"],
        expectedOutput: "Hero [WARRIOR] ATK=12 MOVE=Shield Bash",
        isBoundary: true,
      },
      {
        id: "JCH12_H1_T3",
        label: "Max level Wizard",
        mockInputs: ["1", "W Merlin 50"],
        expectedOutput: "Merlin [MAGE] ATK=110 MOVE=Fireball",
        isHidden: true,
      },
    ],
    concepts: ["abstract class", "enum", "enum field", "super()", "charClass integration"],
    xpReward: 400,
    estimatedMinutes: 35,
    designChallenge:
      "Add a battle() method to Character that simulates a round against another Character: output \"<attacker> deals <atk> damage to <defender>\" and track HP over multiple rounds.",
  },

  {
    id: "JCH12_H2",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "hackathon",
    tierIndex: 1,
    title: "Order Processing Pipeline",
    emoji: "📦",
    tagline: "Abstract pipeline stages + enum OrderStatus drive an order lifecycle.",
    problemStatement:
      "Design an order processing system:\n\nEnum OrderStatus: PENDING, VALIDATED, PAID, SHIPPED, DELIVERED, CANCELLED.\n\nAbstract class OrderStage with: abstract OrderStatus process(String orderId, double amount) and abstract String stageName().\n\nImplement:\n- ValidationStage: validates amount > 0; returns VALIDATED or CANCELLED (with reason \"Invalid amount\")\n- PaymentStage: payment succeeds if amount <= 10000; returns PAID or CANCELLED (\"Insufficient funds\")\n- ShippingStage: always succeeds; returns SHIPPED\n\nRead N orders: each line has orderId and amount. Run through all three stages in order. After each stage, print \"<orderId> [<stageName>]: <status>\". If CANCELLED at any stage, skip remaining stages.",
    inputFormat:
      "Line 1: N (1 ≤ N ≤ 10).\nNext N lines: orderId (string) and amount (double).",
    outputFormat:
      "For each order, 1–3 lines (until CANCELLED or all stages complete): \"<orderId> [<stageName>]: <status>\".",
    examples: [
      {
        input: "2\nORD001 500.0\nORD002 -10.0",
        output:
          "ORD001 [Validation]: VALIDATED\nORD001 [Payment]: PAID\nORD001 [Shipping]: SHIPPED\nORD002 [Validation]: CANCELLED",
      },
    ],
    constraints: ["1 ≤ N ≤ 10", "amount may be negative."],
    hints: [
      "abstract class OrderStage { abstract OrderStatus process(String id, double amt); abstract String stageName(); }",
      "Store stages in an OrderStage[] array.",
      "Loop: if result is CANCELLED, break.",
      "ValidationStage: return amount > 0 ? OrderStatus.VALIDATED : OrderStatus.CANCELLED;",
    ],
    referenceProgram: {
      title: "Order Pipeline — Abstract Stage + Enum Status",
      description: "Pipeline of abstract stages; enum status drives flow; CANCELLED short-circuits.",
      code: `import java.util.Scanner;
enum OrderStatus { PENDING, VALIDATED, PAID, SHIPPED, DELIVERED, CANCELLED }
abstract class OrderStage {
    abstract OrderStatus process(String orderId, double amount);
    abstract String stageName();
}
class ValidationStage extends OrderStage {
    public OrderStatus process(String orderId, double amount) {
        return amount > 0 ? OrderStatus.VALIDATED : OrderStatus.CANCELLED;
    }
    public String stageName() { return "Validation"; }
}
class PaymentStage extends OrderStage {
    public OrderStatus process(String orderId, double amount) {
        return amount <= 10000 ? OrderStatus.PAID : OrderStatus.CANCELLED;
    }
    public String stageName() { return "Payment"; }
}
class ShippingStage extends OrderStage {
    public OrderStatus process(String orderId, double amount) { return OrderStatus.SHIPPED; }
    public String stageName() { return "Shipping"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        OrderStage[] stages = { new ValidationStage(), new PaymentStage(), new ShippingStage() };
        for (int i = 0; i < n; i++) {
            String orderId = sc.next();
            double amount  = sc.nextDouble();
            for (OrderStage stage : stages) {
                OrderStatus status = stage.process(orderId, amount);
                System.out.println(orderId + " [" + stage.stageName() + "]: " + status.name());
                if (status == OrderStatus.CANCELLED) break;
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
enum OrderStatus { PENDING, VALIDATED, PAID, SHIPPED, DELIVERED, CANCELLED }
abstract class OrderStage {
    abstract OrderStatus process(String orderId, double amount);
    abstract String stageName();
}
// TODO: implement ValidationStage, PaymentStage, ShippingStage
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        OrderStage[] stages = { new ValidationStage(), new PaymentStage(), new ShippingStage() };
        for (int i = 0; i < n; i++) {
            String orderId = sc.next();
            double amount  = sc.nextDouble();
            for (OrderStage stage : stages) {
                OrderStatus status = stage.process(orderId, amount);
                System.out.println(orderId + " [" + stage.stageName() + "]: " + status.name());
                if (status == OrderStatus.CANCELLED) break;
            }
        }
    }
}`,
    solution: `import java.util.Scanner;
enum OrderStatus { PENDING, VALIDATED, PAID, SHIPPED, DELIVERED, CANCELLED }
abstract class OrderStage {
    abstract OrderStatus process(String orderId, double amount);
    abstract String stageName();
}
class ValidationStage extends OrderStage {
    public OrderStatus process(String orderId, double amount) {
        return amount > 0 ? OrderStatus.VALIDATED : OrderStatus.CANCELLED;
    }
    public String stageName() { return "Validation"; }
}
class PaymentStage extends OrderStage {
    public OrderStatus process(String orderId, double amount) {
        return amount <= 10000 ? OrderStatus.PAID : OrderStatus.CANCELLED;
    }
    public String stageName() { return "Payment"; }
}
class ShippingStage extends OrderStage {
    public OrderStatus process(String orderId, double amount) { return OrderStatus.SHIPPED; }
    public String stageName() { return "Shipping"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        OrderStage[] stages = { new ValidationStage(), new PaymentStage(), new ShippingStage() };
        for (int i = 0; i < n; i++) {
            String orderId = sc.next();
            double amount  = sc.nextDouble();
            for (OrderStage stage : stages) {
                OrderStatus status = stage.process(orderId, amount);
                System.out.println(orderId + " [" + stage.stageName() + "]: " + status.name());
                if (status == OrderStatus.CANCELLED) break;
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_H2_T1",
        label: "Valid + invalid amount",
        mockInputs: ["2", "ORD001 500.0", "ORD002 -10.0"],
        expectedOutput:
          "ORD001 [Validation]: VALIDATED\nORD001 [Payment]: PAID\nORD001 [Shipping]: SHIPPED\nORD002 [Validation]: CANCELLED",
      },
      {
        id: "JCH12_H2_T2",
        label: "Payment failure",
        mockInputs: ["1", "ORD003 99999.0"],
        expectedOutput:
          "ORD003 [Validation]: VALIDATED\nORD003 [Payment]: CANCELLED",
        isBoundary: true,
      },
      {
        id: "JCH12_H2_T3",
        label: "Exact payment limit",
        mockInputs: ["1", "ORD004 10000.0"],
        expectedOutput:
          "ORD004 [Validation]: VALIDATED\nORD004 [Payment]: PAID\nORD004 [Shipping]: SHIPPED",
        isHidden: true,
      },
    ],
    concepts: ["abstract class", "enum", "pipeline pattern", "short-circuit"],
    xpReward: 450,
    estimatedMinutes: 35,
    designChallenge:
      "Add a rollback() method to each stage and a RollbackManager that undoes all completed stages when a CANCELLED is detected anywhere in the pipeline.",
  },

  {
    id: "JCH12_H3",
    chapterId: "JCH12_ABSTRACT",
    chapterNumber: 12,
    tier: "hackathon",
    tierIndex: 2,
    title: "Report Generator Framework",
    emoji: "📊",
    tagline: "Template method + enum output format — generate structured reports.",
    problemStatement:
      "Design a reporting framework:\n\nEnum ReportFormat: TEXT, HTML, CSV — each with String wrap(String content) that wraps content:\n- TEXT: returns content as-is\n- HTML: returns \"<p>\" + content + \"</p>\"\n- CSV: returns content.replace(' ', ',') + \"\\n\"\n\nAbstract class ReportGenerator with: ReportFormat format, abstract String[] generateRows(), and final method String generate() that calls generateRows(), wraps each row via format.wrap(), and concatenates all rows.\n\nImplement:\n- SalesReport: stores totalSales, unitsSold; generateRows returns [\"Sales Report\", \"Total: \" + totalSales, \"Units: \" + unitsSold]\n- InventoryReport: stores items[]; generateRows returns [\"Inventory Report\"] + items array\n\nRead M report descriptors:\n- 'S <format> <totalSales> <unitsSold>'\n- 'I <format> <N> <item1> <item2> ... <itemN>'\nFor each, call generate() and print the result.",
    inputFormat:
      "Line 1: M (1 ≤ M ≤ 5).\nNext M lines: report descriptor as above.",
    outputFormat: "Concatenated generate() output for each report.",
    examples: [
      {
        input: "2\nS TEXT 5000 120\nI HTML 2 Widget Gadget",
        output:
          "Sales Report\nTotal: 5000\nUnits: 120\n<p>Inventory Report</p>\n<p>Widget</p>\n<p>Gadget</p>",
      },
    ],
    constraints: [
      "1 ≤ M ≤ 5",
      "format is TEXT, HTML, or CSV",
      "item names are single words",
    ],
    hints: [
      "enum ReportFormat { TEXT { public String wrap(String c) { return c; } }, HTML { ... }, CSV { ... }; abstract String wrap(String content); }",
      "ReportGenerator.generate(): loop over generateRows(), append format.wrap(row) to StringBuilder.",
      "Each TEXT/HTML wrap adds a newline via wrap returning content + \"\\n\" or \"<p>content</p>\\n\".",
      "For TEXT: return content + \"\\n\"; For HTML: return \"<p>\" + content + \"</p>\\n\"; For CSV: return content.replace(' ', ',') + \"\\n\";",
    ],
    referenceProgram: {
      title: "Report Generator — Template Method + Enum Format",
      description: "Abstract generator with final generate(); enum handles formatting.",
      code: `import java.util.Scanner;
enum ReportFormat {
    TEXT {
        public String wrap(String content) { return content + "\\n"; }
    },
    HTML {
        public String wrap(String content) { return "<p>" + content + "</p>\\n"; }
    },
    CSV {
        public String wrap(String content) { return content.replace(' ', ',') + "\\n"; }
    };
    abstract String wrap(String content);
}
abstract class ReportGenerator {
    ReportFormat format;
    ReportGenerator(ReportFormat format) { this.format = format; }
    abstract String[] generateRows();
    final String generate() {
        StringBuilder sb = new StringBuilder();
        for (String row : generateRows()) sb.append(format.wrap(row));
        return sb.toString();
    }
}
class SalesReport extends ReportGenerator {
    int totalSales, unitsSold;
    SalesReport(ReportFormat fmt, int totalSales, int unitsSold) {
        super(fmt);
        this.totalSales = totalSales;
        this.unitsSold  = unitsSold;
    }
    public String[] generateRows() {
        return new String[]{"Sales Report", "Total: " + totalSales, "Units: " + unitsSold};
    }
}
class InventoryReport extends ReportGenerator {
    String[] items;
    InventoryReport(ReportFormat fmt, String[] items) {
        super(fmt);
        this.items = items;
    }
    public String[] generateRows() {
        String[] rows = new String[1 + items.length];
        rows[0] = "Inventory Report";
        for (int i = 0; i < items.length; i++) rows[i + 1] = items[i];
        return rows;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        for (int i = 0; i < m; i++) {
            String type = sc.next();
            ReportFormat fmt = ReportFormat.valueOf(sc.next());
            ReportGenerator rg;
            if (type.equals("S")) {
                int totalSales = sc.nextInt();
                int unitsSold  = sc.nextInt();
                rg = new SalesReport(fmt, totalSales, unitsSold);
            } else {
                int n = sc.nextInt();
                String[] items = new String[n];
                for (int j = 0; j < n; j++) items[j] = sc.next();
                rg = new InventoryReport(fmt, items);
            }
            System.out.print(rg.generate());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
enum ReportFormat {
    TEXT {
        public String wrap(String content) { return content + "\\n"; }
    },
    HTML {
        public String wrap(String content) { return "<p>" + content + "</p>\\n"; }
    },
    CSV {
        public String wrap(String content) { return content.replace(' ', ',') + "\\n"; }
    };
    abstract String wrap(String content);
}
abstract class ReportGenerator {
    ReportFormat format;
    ReportGenerator(ReportFormat format) { this.format = format; }
    abstract String[] generateRows();
    final String generate() {
        StringBuilder sb = new StringBuilder();
        for (String row : generateRows()) sb.append(format.wrap(row));
        return sb.toString();
    }
}
// TODO: implement SalesReport and InventoryReport extending ReportGenerator
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        for (int i = 0; i < m; i++) {
            String type = sc.next();
            ReportFormat fmt = ReportFormat.valueOf(sc.next());
            ReportGenerator rg;
            if (type.equals("S")) {
                int totalSales = sc.nextInt();
                int unitsSold  = sc.nextInt();
                rg = null; // TODO: new SalesReport(...)
            } else {
                int n = sc.nextInt();
                String[] items = new String[n];
                for (int j = 0; j < n; j++) items[j] = sc.next();
                rg = null; // TODO: new InventoryReport(...)
            }
            System.out.print(rg.generate());
        }
    }
}`,
    solution: `import java.util.Scanner;
enum ReportFormat {
    TEXT {
        public String wrap(String content) { return content + "\\n"; }
    },
    HTML {
        public String wrap(String content) { return "<p>" + content + "</p>\\n"; }
    },
    CSV {
        public String wrap(String content) { return content.replace(' ', ',') + "\\n"; }
    };
    abstract String wrap(String content);
}
abstract class ReportGenerator {
    ReportFormat format;
    ReportGenerator(ReportFormat format) { this.format = format; }
    abstract String[] generateRows();
    final String generate() {
        StringBuilder sb = new StringBuilder();
        for (String row : generateRows()) sb.append(format.wrap(row));
        return sb.toString();
    }
}
class SalesReport extends ReportGenerator {
    int totalSales, unitsSold;
    SalesReport(ReportFormat fmt, int totalSales, int unitsSold) {
        super(fmt);
        this.totalSales = totalSales;
        this.unitsSold  = unitsSold;
    }
    public String[] generateRows() {
        return new String[]{"Sales Report", "Total: " + totalSales, "Units: " + unitsSold};
    }
}
class InventoryReport extends ReportGenerator {
    String[] items;
    InventoryReport(ReportFormat fmt, String[] items) {
        super(fmt);
        this.items = items;
    }
    public String[] generateRows() {
        String[] rows = new String[1 + items.length];
        rows[0] = "Inventory Report";
        for (int i = 0; i < items.length; i++) rows[i + 1] = items[i];
        return rows;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        for (int i = 0; i < m; i++) {
            String type = sc.next();
            ReportFormat fmt = ReportFormat.valueOf(sc.next());
            ReportGenerator rg;
            if (type.equals("S")) {
                int totalSales = sc.nextInt();
                int unitsSold  = sc.nextInt();
                rg = new SalesReport(fmt, totalSales, unitsSold);
            } else {
                int n = sc.nextInt();
                String[] items = new String[n];
                for (int j = 0; j < n; j++) items[j] = sc.next();
                rg = new InventoryReport(fmt, items);
            }
            System.out.print(rg.generate());
        }
    }
}`,
    testCases: [
      {
        id: "JCH12_H3_T1",
        label: "Sales TEXT + Inventory HTML",
        mockInputs: ["2", "S TEXT 5000 120", "I HTML 2 Widget Gadget"],
        expectedOutput:
          "Sales Report\nTotal: 5000\nUnits: 120\n<p>Inventory Report</p>\n<p>Widget</p>\n<p>Gadget</p>",
      },
      {
        id: "JCH12_H3_T2",
        label: "Sales CSV",
        mockInputs: ["1", "S CSV 1000 50"],
        expectedOutput: "Sales,Report\nTotal:,1000\nUnits:,50\n",
        isHidden: true,
      },
      {
        id: "JCH12_H3_T3",
        label: "Inventory TEXT single item",
        mockInputs: ["1", "I TEXT 1 Laptop"],
        expectedOutput: "Inventory Report\nLaptop\n",
        isBoundary: true,
      },
    ],
    concepts: ["template method", "abstract class", "enum with abstract method", "final method"],
    xpReward: 500,
    estimatedMinutes: 45,
    designChallenge:
      "Add a JSON format to ReportFormat (wrap returns \"{\\\"row\\\": \\\"<content>\\\"}\\n\") and a JsonReport subclass that generates a JSON array of rows.",
  },
];
