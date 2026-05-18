import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH10_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH10_B1",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "beginner",
    tierIndex: 0,
    title: "extends — Dog is an Animal",
    emoji: "🐾",
    tagline: "Use extends to inherit fields and call super() from a subclass constructor.",
    problemStatement:
      "Create a class `Animal` with a protected `String name` and a constructor `Animal(String name)`. Create a subclass `Dog` that extends `Animal`. `Dog` adds a private `String breed` and a constructor `Dog(String name, String breed)` that calls `super(name)`. Both classes have a `describe()` method:\n- `Animal.describe()` returns `\"Animal: <name>\"`.\n- `Dog.describe()` overrides it and returns `\"Dog: <name>, Breed: <breed>\"`.\n\nRead a name and breed, create a `Dog`, and print `dog.describe()`.",
    inputFormat: "Line 1: name. Line 2: breed.",
    outputFormat: "\"Dog: <name>, Breed: <breed>\"",
    examples: [
      {
        input: "Rex\nLabrador",
        output: "Dog: Rex, Breed: Labrador",
      },
      {
        input: "Buddy\nBeagle",
        output: "Dog: Buddy, Breed: Beagle",
      },
    ],
    constraints: ["Name and breed are single words."],
    hints: [
      "`class Dog extends Animal {` — this declares the is-a relationship.",
      "Dog constructor: `public Dog(String name, String breed) { super(name); this.breed = breed; }`",
      "`@Override` the `describe()` method in Dog.",
      "Access the inherited `name` field via `name` (it's protected).",
    ],
    referenceProgram: {
      title: "Animal/Dog Inheritance",
      description: "Basic extends with super() constructor call and method override.",
      code: `import java.util.Scanner;
class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public String describe() { return "Animal: " + name; }
}
class Dog extends Animal {
    private String breed;
    public Dog(String name, String breed) {
        super(name);
        this.breed = breed;
    }
    @Override
    public String describe() { return "Dog: " + name + ", Breed: " + breed; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        String breed = sc.next();
        Dog dog = new Dog(name, breed);
        System.out.println(dog.describe());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public String describe() { return "Animal: " + name; }
}
class Dog extends Animal {
    private String breed;
    // TODO: constructor calling super(name), override describe()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        String breed = sc.next();
        Dog dog = new Dog(name, breed);
        System.out.println(dog.describe());
    }
}`,
    solution: `import java.util.Scanner;
class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public String describe() { return "Animal: " + name; }
}
class Dog extends Animal {
    private String breed;
    public Dog(String name, String breed) {
        super(name);
        this.breed = breed;
    }
    @Override
    public String describe() { return "Dog: " + name + ", Breed: " + breed; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        String breed = sc.next();
        Dog dog = new Dog(name, breed);
        System.out.println(dog.describe());
    }
}`,
    testCases: [
      {
        id: "JCH10_B1_T1",
        label: "Rex Labrador",
        mockInputs: ["Rex", "Labrador"],
        expectedOutput: "Dog: Rex, Breed: Labrador",
      },
      {
        id: "JCH10_B1_T2",
        label: "Buddy Beagle",
        mockInputs: ["Buddy", "Beagle"],
        expectedOutput: "Dog: Buddy, Breed: Beagle",
      },
      {
        id: "JCH10_B1_T3",
        label: "Single-char name",
        mockInputs: ["X", "Poodle"],
        expectedOutput: "Dog: X, Breed: Poodle",
        isBoundary: true,
      },
      {
        id: "JCH10_B1_T4",
        label: "Hidden test",
        mockInputs: ["Max", "Husky"],
        expectedOutput: "Dog: Max, Breed: Husky",
        isHidden: true,
      },
    ],
    concepts: ["extends", "super()", "method override", "@Override", "protected"],
    xpReward: 50,
    estimatedMinutes: 8,
  },

  {
    id: "JCH10_B2",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "beginner",
    tierIndex: 1,
    title: "Override toString()",
    emoji: "🔤",
    tagline: "Override toString() in a subclass to produce a custom string representation.",
    problemStatement:
      "Create a class `Vehicle` with protected `String make` and `int year`. Create a subclass `Car` that adds a private `int doors`. Override `toString()` in `Car` to return `\"<year> <make> (<doors>-door)\"`.\n\nRead make, year, and doors. Create a `Car` and print it (Java will call `toString()` automatically).",
    inputFormat: "Line 1: make. Line 2: year (integer). Line 3: doors (integer).",
    outputFormat: "\"<year> <make> (<doors>-door)\"",
    examples: [
      {
        input: "Toyota\n2020\n4",
        output: "2020 Toyota (4-door)",
      },
      {
        input: "Mini\n2018\n2",
        output: "2018 Mini (2-door)",
      },
    ],
    constraints: ["make is a single word.", "1900 <= year <= 2100", "doors is 2 or 4"],
    hints: [
      "Car constructor: `public Car(String make, int year, int doors) { super(make, year); this.doors = doors; }`",
      "`Vehicle` needs a constructor: `public Vehicle(String make, int year) { this.make = make; this.year = year; }`",
      "Override toString: `@Override public String toString() { return year + \" \" + make + \" (\" + doors + \"-door)\"; }`",
      "Printing an object: `System.out.println(car)` calls `car.toString()` automatically.",
    ],
    referenceProgram: {
      title: "Car toString Override",
      description: "Subclass overrides toString for custom print output.",
      code: `import java.util.Scanner;
class Vehicle {
    protected String make;
    protected int year;
    public Vehicle(String make, int year) { this.make = make; this.year = year; }
}
class Car extends Vehicle {
    private int doors;
    public Car(String make, int year, int doors) {
        super(make, year);
        this.doors = doors;
    }
    @Override
    public String toString() { return year + " " + make + " (" + doors + "-door)"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String make = sc.next();
        int year = sc.nextInt();
        int doors = sc.nextInt();
        Car car = new Car(make, year, doors);
        System.out.println(car);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Vehicle {
    protected String make;
    protected int year;
    public Vehicle(String make, int year) { this.make = make; this.year = year; }
}
class Car extends Vehicle {
    private int doors;
    // TODO: constructor calling super(), override toString()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String make = sc.next();
        int year = sc.nextInt();
        int doors = sc.nextInt();
        Car car = new Car(make, year, doors);
        System.out.println(car);
    }
}`,
    solution: `import java.util.Scanner;
class Vehicle {
    protected String make;
    protected int year;
    public Vehicle(String make, int year) { this.make = make; this.year = year; }
}
class Car extends Vehicle {
    private int doors;
    public Car(String make, int year, int doors) {
        super(make, year);
        this.doors = doors;
    }
    @Override
    public String toString() { return year + " " + make + " (" + doors + "-door)"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String make = sc.next();
        int year = sc.nextInt();
        int doors = sc.nextInt();
        Car car = new Car(make, year, doors);
        System.out.println(car);
    }
}`,
    testCases: [
      {
        id: "JCH10_B2_T1",
        label: "Toyota 4-door",
        mockInputs: ["Toyota", "2020", "4"],
        expectedOutput: "2020 Toyota (4-door)",
      },
      {
        id: "JCH10_B2_T2",
        label: "Mini 2-door",
        mockInputs: ["Mini", "2018", "2"],
        expectedOutput: "2018 Mini (2-door)",
      },
      {
        id: "JCH10_B2_T3",
        label: "Year boundary 1900",
        mockInputs: ["Ford", "1900", "2"],
        expectedOutput: "1900 Ford (2-door)",
        isBoundary: true,
      },
      {
        id: "JCH10_B2_T4",
        label: "Hidden test",
        mockInputs: ["Honda", "2023", "4"],
        expectedOutput: "2023 Honda (4-door)",
        isHidden: true,
      },
    ],
    concepts: ["extends", "toString override", "super()", "protected fields"],
    xpReward: 60,
    estimatedMinutes: 10,
  },

  {
    id: "JCH10_B3",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "beginner",
    tierIndex: 2,
    title: "Employee and Manager",
    emoji: "👔",
    tagline: "A Manager extends Employee and adds a team size field.",
    problemStatement:
      "Create a class `Employee` with protected `String name` and `double salary`. Add `getInfo()` returning `\"Employee: <name>, Salary: <salary>\"`.\n\nCreate a subclass `Manager` that adds `int teamSize`. Override `getInfo()` to return `\"Manager: <name>, Salary: <salary>, Team: <teamSize>\"`.\n\nRead name, salary, and teamSize. Create a `Manager` and print `getInfo()`.",
    inputFormat: "Line 1: name. Line 2: salary (double). Line 3: teamSize (integer).",
    outputFormat: "\"Manager: <name>, Salary: <salary>, Team: <teamSize>\"",
    examples: [
      {
        input: "Alice\n75000.0\n5",
        output: "Manager: Alice, Salary: 75000.0, Team: 5",
      },
      {
        input: "Bob\n90000.5\n10",
        output: "Manager: Bob, Salary: 90000.5, Team: 10",
      },
    ],
    constraints: ["Name is a single word.", "salary > 0", "teamSize >= 1"],
    hints: [
      "Manager constructor: `public Manager(String name, double salary, int teamSize) { super(name, salary); this.teamSize = teamSize; }`",
      "Employee also needs a constructor: `public Employee(String name, double salary) { this.name = name; this.salary = salary; }`",
      "Override getInfo in Manager using the inherited `name` and `salary` fields.",
    ],
    referenceProgram: {
      title: "Employee/Manager Inheritance",
      description: "Manager extends Employee and overrides getInfo().",
      code: `import java.util.Scanner;
class Employee {
    protected String name;
    protected double salary;
    public Employee(String name, double salary) { this.name = name; this.salary = salary; }
    public String getInfo() { return "Employee: " + name + ", Salary: " + salary; }
}
class Manager extends Employee {
    private int teamSize;
    public Manager(String name, double salary, int teamSize) {
        super(name, salary);
        this.teamSize = teamSize;
    }
    @Override
    public String getInfo() {
        return "Manager: " + name + ", Salary: " + salary + ", Team: " + teamSize;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        double salary = sc.nextDouble();
        int teamSize = sc.nextInt();
        Manager m = new Manager(name, salary, teamSize);
        System.out.println(m.getInfo());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Employee {
    protected String name;
    protected double salary;
    public Employee(String name, double salary) { this.name = name; this.salary = salary; }
    public String getInfo() { return "Employee: " + name + ", Salary: " + salary; }
}
class Manager extends Employee {
    private int teamSize;
    // TODO: constructor calling super(), override getInfo()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        double salary = sc.nextDouble();
        int teamSize = sc.nextInt();
        Manager m = new Manager(name, salary, teamSize);
        System.out.println(m.getInfo());
    }
}`,
    solution: `import java.util.Scanner;
class Employee {
    protected String name;
    protected double salary;
    public Employee(String name, double salary) { this.name = name; this.salary = salary; }
    public String getInfo() { return "Employee: " + name + ", Salary: " + salary; }
}
class Manager extends Employee {
    private int teamSize;
    public Manager(String name, double salary, int teamSize) {
        super(name, salary);
        this.teamSize = teamSize;
    }
    @Override
    public String getInfo() {
        return "Manager: " + name + ", Salary: " + salary + ", Team: " + teamSize;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        double salary = sc.nextDouble();
        int teamSize = sc.nextInt();
        Manager m = new Manager(name, salary, teamSize);
        System.out.println(m.getInfo());
    }
}`,
    testCases: [
      {
        id: "JCH10_B3_T1",
        label: "Alice team 5",
        mockInputs: ["Alice", "75000.0", "5"],
        expectedOutput: "Manager: Alice, Salary: 75000.0, Team: 5",
      },
      {
        id: "JCH10_B3_T2",
        label: "Bob team 10",
        mockInputs: ["Bob", "90000.5", "10"],
        expectedOutput: "Manager: Bob, Salary: 90000.5, Team: 10",
      },
      {
        id: "JCH10_B3_T3",
        label: "Team of 1",
        mockInputs: ["Carol", "50000.0", "1"],
        expectedOutput: "Manager: Carol, Salary: 50000.0, Team: 1",
        isBoundary: true,
      },
      {
        id: "JCH10_B3_T4",
        label: "Hidden test",
        mockInputs: ["David", "120000.0", "20"],
        expectedOutput: "Manager: David, Salary: 120000.0, Team: 20",
        isHidden: true,
      },
    ],
    concepts: ["extends", "super()", "method override", "protected fields"],
    xpReward: 70,
    estimatedMinutes: 10,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH10_I1",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "intermediate",
    tierIndex: 0,
    title: "Multi-Level Inheritance",
    emoji: "🔗",
    tagline: "Build a 3-level chain: LivingThing -> Animal -> Bird, calling super at each level.",
    problemStatement:
      "Create a 3-level class hierarchy:\n- `LivingThing` with protected `String name` and method `breathe()` returning `\"<name> breathes\"`.\n- `Animal` extends `LivingThing`, adds `String sound`, method `makeSound()` returning `\"<name> says <sound>\"`.\n- `Bird` extends `Animal`, adds `double wingspan`, method `fly()` returning `\"<name> flies with wingspan <wingspan>m\"`.\n\nEach constructor calls the parent's constructor via `super(...)`. Read name, sound, and wingspan; create a `Bird` and print all three method results.",
    inputFormat: "Line 1: name. Line 2: sound. Line 3: wingspan (double).",
    outputFormat:
      "\"<name> breathes\"\n\"<name> says <sound>\"\n\"<name> flies with wingspan <wingspan>m\"",
    examples: [
      {
        input: "Eagle\nscreech\n2.1",
        output: "Eagle breathes\nEagle says screech\nEagle flies with wingspan 2.1m",
      },
      {
        input: "Parrot\nsquawk\n0.5",
        output: "Parrot breathes\nParrot says squawk\nParrot flies with wingspan 0.5m",
      },
    ],
    constraints: ["name and sound are single words.", "0.1 <= wingspan <= 10.0"],
    hints: [
      "Animal constructor: `public Animal(String name, String sound) { super(name); this.sound = sound; }`",
      "Bird constructor: `public Bird(String name, String sound, double wingspan) { super(name, sound); this.wingspan = wingspan; }`",
      "All three methods can access `name` because it's protected in LivingThing.",
      "Print wingspan with `String.valueOf(wingspan)` or just concatenate the double.",
    ],
    referenceProgram: {
      title: "3-Level Bird Hierarchy",
      description: "Multi-level inheritance with super() chained through all levels.",
      code: `import java.util.Scanner;
class LivingThing {
    protected String name;
    public LivingThing(String name) { this.name = name; }
    public String breathe() { return name + " breathes"; }
}
class Animal extends LivingThing {
    protected String sound;
    public Animal(String name, String sound) { super(name); this.sound = sound; }
    public String makeSound() { return name + " says " + sound; }
}
class Bird extends Animal {
    private double wingspan;
    public Bird(String name, String sound, double wingspan) {
        super(name, sound);
        this.wingspan = wingspan;
    }
    public String fly() { return name + " flies with wingspan " + wingspan + "m"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next(), sound = sc.next();
        double ws = sc.nextDouble();
        Bird b = new Bird(name, sound, ws);
        System.out.println(b.breathe());
        System.out.println(b.makeSound());
        System.out.println(b.fly());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class LivingThing {
    protected String name;
    public LivingThing(String name) { this.name = name; }
    public String breathe() { return name + " breathes"; }
}
class Animal extends LivingThing {
    protected String sound;
    // TODO: constructor (super), makeSound()
}
class Bird extends Animal {
    private double wingspan;
    // TODO: constructor (super), fly()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next(), sound = sc.next();
        double ws = sc.nextDouble();
        Bird b = new Bird(name, sound, ws);
        System.out.println(b.breathe());
        System.out.println(b.makeSound());
        System.out.println(b.fly());
    }
}`,
    solution: `import java.util.Scanner;
class LivingThing {
    protected String name;
    public LivingThing(String name) { this.name = name; }
    public String breathe() { return name + " breathes"; }
}
class Animal extends LivingThing {
    protected String sound;
    public Animal(String name, String sound) { super(name); this.sound = sound; }
    public String makeSound() { return name + " says " + sound; }
}
class Bird extends Animal {
    private double wingspan;
    public Bird(String name, String sound, double wingspan) {
        super(name, sound);
        this.wingspan = wingspan;
    }
    public String fly() { return name + " flies with wingspan " + wingspan + "m"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next(), sound = sc.next();
        double ws = sc.nextDouble();
        Bird b = new Bird(name, sound, ws);
        System.out.println(b.breathe());
        System.out.println(b.makeSound());
        System.out.println(b.fly());
    }
}`,
    testCases: [
      {
        id: "JCH10_I1_T1",
        label: "Eagle",
        mockInputs: ["Eagle", "screech", "2.1"],
        expectedOutput: "Eagle breathes\nEagle says screech\nEagle flies with wingspan 2.1m",
      },
      {
        id: "JCH10_I1_T2",
        label: "Parrot",
        mockInputs: ["Parrot", "squawk", "0.5"],
        expectedOutput: "Parrot breathes\nParrot says squawk\nParrot flies with wingspan 0.5m",
      },
      {
        id: "JCH10_I1_T3",
        label: "Minimum wingspan",
        mockInputs: ["Sparrow", "chirp", "0.1"],
        expectedOutput: "Sparrow breathes\nSparrow says chirp\nSparrow flies with wingspan 0.1m",
        isBoundary: true,
      },
      {
        id: "JCH10_I1_T4",
        label: "Hidden test",
        mockInputs: ["Hawk", "shriek", "1.5"],
        expectedOutput: "Hawk breathes\nHawk says shriek\nHawk flies with wingspan 1.5m",
        isHidden: true,
      },
    ],
    concepts: ["multi-level inheritance", "super()", "method inheritance", "protected"],
    xpReward: 100,
    estimatedMinutes: 12,
  },

  {
    id: "JCH10_I2",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "intermediate",
    tierIndex: 1,
    title: "super Method Calls",
    emoji: "📞",
    tagline: "Call super.method() from a subclass to extend — not replace — parent behaviour.",
    problemStatement:
      "Create a class `Report` with a method `generate()` returning `\"=== Report ===\"`. Create a subclass `DetailedReport` that overrides `generate()` to return the parent's output PLUS `\"\\nDetails: <details>\"` by calling `super.generate()` first.\n\nCreate a subclass `SummaryReport` of `Report` that overrides `generate()` to return `\"=== Summary ===\"` followed by `\"\\nTotal: <total>\"` (without calling super).\n\nRead type (\"detailed\" or \"summary\"), and then either details (String) or total (int). Print the appropriate report.",
    inputFormat: "Line 1: type (\"detailed\" or \"summary\"). Line 2: details string OR total integer.",
    outputFormat: "The report string (two lines separated by newline).",
    examples: [
      {
        input: "detailed\nSales data for Q1",
        output: "=== Report ===\nDetails: Sales data for Q1",
      },
      {
        input: "summary\n42",
        output: "=== Summary ===\nTotal: 42",
      },
    ],
    constraints: ["type is exactly \"detailed\" or \"summary\""],
    hints: [
      "In DetailedReport.generate(): `return super.generate() + \"\\nDetails: \" + details;`",
      "In SummaryReport.generate(): `return \"=== Summary ===\\nTotal: \" + total;`",
      "Read details as a line: `sc.nextLine()` after checking type.",
    ],
    referenceProgram: {
      title: "Report with super Method Call",
      description: "DetailedReport extends parent output; SummaryReport replaces it.",
      code: `import java.util.Scanner;
class Report {
    public String generate() { return "=== Report ==="; }
}
class DetailedReport extends Report {
    private String details;
    public DetailedReport(String details) { this.details = details; }
    @Override
    public String generate() { return super.generate() + "\\nDetails: " + details; }
}
class SummaryReport extends Report {
    private int total;
    public SummaryReport(int total) { this.total = total; }
    @Override
    public String generate() { return "=== Summary ===\\nTotal: " + total; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        sc.nextLine(); // consume newline
        Report r;
        if (type.equals("detailed")) {
            r = new DetailedReport(sc.nextLine());
        } else {
            r = new SummaryReport(Integer.parseInt(sc.nextLine().trim()));
        }
        System.out.println(r.generate());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Report {
    public String generate() { return "=== Report ==="; }
}
class DetailedReport extends Report {
    private String details;
    public DetailedReport(String details) { this.details = details; }
    // TODO: override generate() using super.generate()
}
class SummaryReport extends Report {
    private int total;
    public SummaryReport(int total) { this.total = total; }
    // TODO: override generate() without calling super
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        sc.nextLine();
        Report r;
        if (type.equals("detailed")) {
            r = new DetailedReport(sc.nextLine());
        } else {
            r = new SummaryReport(Integer.parseInt(sc.nextLine().trim()));
        }
        System.out.println(r.generate());
    }
}`,
    solution: `import java.util.Scanner;
class Report {
    public String generate() { return "=== Report ==="; }
}
class DetailedReport extends Report {
    private String details;
    public DetailedReport(String details) { this.details = details; }
    @Override
    public String generate() { return super.generate() + "\\nDetails: " + details; }
}
class SummaryReport extends Report {
    private int total;
    public SummaryReport(int total) { this.total = total; }
    @Override
    public String generate() { return "=== Summary ===\\nTotal: " + total; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        sc.nextLine();
        Report r;
        if (type.equals("detailed")) {
            r = new DetailedReport(sc.nextLine());
        } else {
            r = new SummaryReport(Integer.parseInt(sc.nextLine().trim()));
        }
        System.out.println(r.generate());
    }
}`,
    testCases: [
      {
        id: "JCH10_I2_T1",
        label: "Detailed report",
        mockInputs: ["detailed", "Sales data for Q1"],
        expectedOutput: "=== Report ===\nDetails: Sales data for Q1",
      },
      {
        id: "JCH10_I2_T2",
        label: "Summary report",
        mockInputs: ["summary", "42"],
        expectedOutput: "=== Summary ===\nTotal: 42",
      },
      {
        id: "JCH10_I2_T3",
        label: "Detailed empty string",
        mockInputs: ["detailed", "N/A"],
        expectedOutput: "=== Report ===\nDetails: N/A",
        isBoundary: true,
      },
      {
        id: "JCH10_I2_T4",
        label: "Summary total zero",
        mockInputs: ["summary", "0"],
        expectedOutput: "=== Summary ===\nTotal: 0",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["super.method()", "method override", "is-a", "polymorphism"],
    xpReward: 110,
    estimatedMinutes: 12,
  },

  {
    id: "JCH10_I3",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "intermediate",
    tierIndex: 2,
    title: "instanceof and Is-A Relationships",
    emoji: "🔍",
    tagline: "Use instanceof to dispatch behaviour to the correct subclass at runtime.",
    problemStatement:
      "Define a hierarchy:\n- `Shape` with method `getType()` returning `\"Shape\"`.\n- `Circle` extends `Shape`, adds `double radius`. Override `getType()` returning `\"Circle\"`. Add `getArea()` returning pi * r * r.\n- `Square` extends `Shape`, adds `int side`. Override `getType()` returning `\"Square\"`. Add `getArea()` returning side * side.\n\nRead N shape specs. Each spec starts with \"C\" (Circle, followed by radius) or \"S\" (Square, followed by side). For each shape, print its type and area formatted to 2 decimal places using instanceof to detect which method to call.",
    inputFormat:
      "Line 1: N. Next N lines: `C <radius>` or `S <side>`.",
    outputFormat: "For each shape: \"<Type>: <area formatted to 2 dp>\"",
    examples: [
      {
        input: "3\nC 5.0\nS 4\nC 1.0",
        output: "Circle: 78.54\nSquare: 16.00\nCircle: 3.14",
      },
    ],
    constraints: ["1 <= N <= 10", "0 < radius, side <= 100"],
    hints: [
      "Store shapes in a `Shape[]` array.",
      "Use `if (shapes[i] instanceof Circle)` to cast and call `getArea()`.",
      "Math.PI gives pi. Format: `String.format(\"%.2f\", area)`.",
      "Alternatively, add `getArea()` to Shape with a return of 0 and override in subclasses.",
    ],
    referenceProgram: {
      title: "Shape instanceof Dispatch",
      description: "instanceof checks determine which subclass to cast to for getArea().",
      code: `import java.util.Scanner;
class Shape {
    public String getType() { return "Shape"; }
}
class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    @Override public String getType() { return "Circle"; }
    public double getArea() { return Math.PI * radius * radius; }
}
class Square extends Shape {
    private int side;
    public Square(int side) { this.side = side; }
    @Override public String getType() { return "Square"; }
    public double getArea() { return side * side; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String t = sc.next();
            if (t.equals("C")) shapes[i] = new Circle(sc.nextDouble());
            else shapes[i] = new Square(sc.nextInt());
        }
        for (Shape s : shapes) {
            double area = 0;
            if (s instanceof Circle) area = ((Circle) s).getArea();
            else if (s instanceof Square) area = ((Square) s).getArea();
            System.out.printf("%s: %.2f%n", s.getType(), area);
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Shape {
    public String getType() { return "Shape"; }
}
class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    // TODO: override getType(), add getArea()
}
class Square extends Shape {
    private int side;
    public Square(int side) { this.side = side; }
    // TODO: override getType(), add getArea()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String t = sc.next();
            if (t.equals("C")) shapes[i] = new Circle(sc.nextDouble());
            else shapes[i] = new Square(sc.nextInt());
        }
        // TODO: use instanceof to print type and area for each shape
    }
}`,
    solution: `import java.util.Scanner;
class Shape {
    public String getType() { return "Shape"; }
}
class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    @Override public String getType() { return "Circle"; }
    public double getArea() { return Math.PI * radius * radius; }
}
class Square extends Shape {
    private int side;
    public Square(int side) { this.side = side; }
    @Override public String getType() { return "Square"; }
    public double getArea() { return side * side; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String t = sc.next();
            if (t.equals("C")) shapes[i] = new Circle(sc.nextDouble());
            else shapes[i] = new Square(sc.nextInt());
        }
        for (Shape s : shapes) {
            double area = 0;
            if (s instanceof Circle) area = ((Circle) s).getArea();
            else if (s instanceof Square) area = ((Square) s).getArea();
            System.out.printf("%s: %.2f%n", s.getType(), area);
        }
    }
}`,
    testCases: [
      {
        id: "JCH10_I3_T1",
        label: "Mixed shapes",
        mockInputs: ["3", "C 5.0", "S 4", "C 1.0"],
        expectedOutput: "Circle: 78.54\nSquare: 16.00\nCircle: 3.14",
      },
      {
        id: "JCH10_I3_T2",
        label: "Single square",
        mockInputs: ["1", "S 1"],
        expectedOutput: "Square: 1.00",
        isBoundary: true,
      },
      {
        id: "JCH10_I3_T3",
        label: "All circles",
        mockInputs: ["2", "C 2.0", "C 3.0"],
        expectedOutput: "Circle: 12.57\nCircle: 28.27",
        isHidden: true,
      },
      {
        id: "JCH10_I3_T4",
        label: "Large square",
        mockInputs: ["1", "S 100"],
        expectedOutput: "Square: 10000.00",
        isHidden: true,
      },
    ],
    concepts: ["instanceof", "casting", "polymorphism", "Math.PI", "is-a"],
    xpReward: 130,
    estimatedMinutes: 15,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH10_A1",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "advanced",
    tierIndex: 0,
    title: "Abstract Base via Inheritance",
    emoji: "🏗️",
    tagline: "Simulate abstract behaviour: base class method throws, subclasses must override.",
    problemStatement:
      "Create a base class `Converter` with a method `convert(double value)` that throws `UnsupportedOperationException`. Create two subclasses:\n- `CelsiusToFahrenheit`: overrides `convert(double c)` returning `c * 9.0 / 5.0 + 32`.\n- `KmToMiles`: overrides `convert(double km)` returning `km * 0.621371`.\n\nRead type (\"CF\" or \"KM\") and a value. Create the appropriate converter and print the result formatted to 4 decimal places.",
    inputFormat: "Line 1: type (\"CF\" or \"KM\"). Line 2: value (double).",
    outputFormat: "The converted value formatted to 4 decimal places.",
    examples: [
      {
        input: "CF\n100.0",
        output: "212.0000",
      },
      {
        input: "KM\n10.0",
        output: "6.2137",
      },
    ],
    constraints: ["type is exactly \"CF\" or \"KM\".", "-1000.0 <= value <= 1000000.0"],
    hints: [
      "Base class: `public double convert(double v) { throw new UnsupportedOperationException(); }`",
      "CelsiusToFahrenheit: `@Override public double convert(double c) { return c * 9.0/5.0 + 32; }`",
      "Use a `Converter` reference: `Converter conv = type.equals(\"CF\") ? new CelsiusToFahrenheit() : new KmToMiles();`",
      "Print: `System.out.printf(\"%.4f%n\", conv.convert(value));`",
    ],
    referenceProgram: {
      title: "Converter Hierarchy",
      description: "Base throws; subclasses override with actual conversion logic.",
      code: `import java.util.Scanner;
class Converter {
    public double convert(double v) { throw new UnsupportedOperationException(); }
}
class CelsiusToFahrenheit extends Converter {
    @Override public double convert(double c) { return c * 9.0 / 5.0 + 32; }
}
class KmToMiles extends Converter {
    @Override public double convert(double km) { return km * 0.621371; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double value = sc.nextDouble();
        Converter conv = type.equals("CF") ? new CelsiusToFahrenheit() : new KmToMiles();
        System.out.printf("%.4f%n", conv.convert(value));
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Converter {
    // TODO: convert() that throws UnsupportedOperationException
}
class CelsiusToFahrenheit extends Converter {
    // TODO: override convert for C->F
}
class KmToMiles extends Converter {
    // TODO: override convert for km->miles
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double value = sc.nextDouble();
        // TODO: create correct converter and print result
    }
}`,
    solution: `import java.util.Scanner;
class Converter {
    public double convert(double v) { throw new UnsupportedOperationException(); }
}
class CelsiusToFahrenheit extends Converter {
    @Override public double convert(double c) { return c * 9.0 / 5.0 + 32; }
}
class KmToMiles extends Converter {
    @Override public double convert(double km) { return km * 0.621371; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double value = sc.nextDouble();
        Converter conv = type.equals("CF") ? new CelsiusToFahrenheit() : new KmToMiles();
        System.out.printf("%.4f%n", conv.convert(value));
    }
}`,
    testCases: [
      {
        id: "JCH10_A1_T1",
        label: "100C = 212F",
        mockInputs: ["CF", "100.0"],
        expectedOutput: "212.0000",
      },
      {
        id: "JCH10_A1_T2",
        label: "10 km to miles",
        mockInputs: ["KM", "10.0"],
        expectedOutput: "6.2137",
      },
      {
        id: "JCH10_A1_T3",
        label: "0C = 32F",
        mockInputs: ["CF", "0.0"],
        expectedOutput: "32.0000",
        isBoundary: true,
      },
      {
        id: "JCH10_A1_T4",
        label: "1 km to miles",
        mockInputs: ["KM", "1.0"],
        expectedOutput: "0.6214",
        isHidden: true,
      },
    ],
    concepts: ["abstract via override", "UnsupportedOperationException", "polymorphism", "Converter pattern"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH10_A2",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "advanced",
    tierIndex: 1,
    title: "Override Chain — Tax Calculation",
    emoji: "💰",
    tagline: "Each subclass extends the parent's tax calculation with its own surcharge.",
    problemStatement:
      "Create a class hierarchy for income tax:\n- `TaxPayer` with `protected double income`. Method `calculateTax()` returns income * 0.10 (10% base tax).\n- `SalariedEmployee` extends `TaxPayer`. Overrides `calculateTax()` to call `super.calculateTax()` and add a 5% surcharge on income (total 15%).\n- `HighEarner` extends `SalariedEmployee` (income > 100000). Overrides `calculateTax()` to call `super.calculateTax()` and add a further 10% on income (total 25%).\n\nRead type (\"base\", \"salaried\", \"high\") and income. Print the tax formatted to 2 decimal places.",
    inputFormat: "Line 1: type. Line 2: income (double).",
    outputFormat: "\"Tax: <amount formatted to 2 dp>\"",
    examples: [
      {
        input: "base\n50000.0",
        output: "Tax: 5000.00",
      },
      {
        input: "salaried\n50000.0",
        output: "Tax: 7500.00",
      },
      {
        input: "high\n200000.0",
        output: "Tax: 50000.00",
      },
    ],
    constraints: ["income > 0", "type is \"base\", \"salaried\", or \"high\""],
    hints: [
      "SalariedEmployee: `return super.calculateTax() + income * 0.05;`",
      "HighEarner: `return super.calculateTax() + income * 0.10;`",
      "HighEarner extends SalariedEmployee, so super.calculateTax() is SalariedEmployee's version (15%).",
      "Set income in constructor: each subclass calls super(income) up the chain.",
    ],
    referenceProgram: {
      title: "Chained Tax Calculation",
      description: "Each subclass adds its surcharge on top of super.calculateTax().",
      code: `import java.util.Scanner;
class TaxPayer {
    protected double income;
    public TaxPayer(double income) { this.income = income; }
    public double calculateTax() { return income * 0.10; }
}
class SalariedEmployee extends TaxPayer {
    public SalariedEmployee(double income) { super(income); }
    @Override public double calculateTax() { return super.calculateTax() + income * 0.05; }
}
class HighEarner extends SalariedEmployee {
    public HighEarner(double income) { super(income); }
    @Override public double calculateTax() { return super.calculateTax() + income * 0.10; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double income = sc.nextDouble();
        TaxPayer tp;
        switch (type) {
            case "salaried": tp = new SalariedEmployee(income); break;
            case "high":     tp = new HighEarner(income); break;
            default:         tp = new TaxPayer(income);
        }
        System.out.printf("Tax: %.2f%n", tp.calculateTax());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class TaxPayer {
    protected double income;
    public TaxPayer(double income) { this.income = income; }
    public double calculateTax() { return income * 0.10; }
}
class SalariedEmployee extends TaxPayer {
    public SalariedEmployee(double income) { super(income); }
    // TODO: override calculateTax() adding 5% surcharge via super
}
class HighEarner extends SalariedEmployee {
    public HighEarner(double income) { super(income); }
    // TODO: override calculateTax() adding further 10% via super
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double income = sc.nextDouble();
        // TODO: create appropriate TaxPayer and print tax
    }
}`,
    solution: `import java.util.Scanner;
class TaxPayer {
    protected double income;
    public TaxPayer(double income) { this.income = income; }
    public double calculateTax() { return income * 0.10; }
}
class SalariedEmployee extends TaxPayer {
    public SalariedEmployee(double income) { super(income); }
    @Override public double calculateTax() { return super.calculateTax() + income * 0.05; }
}
class HighEarner extends SalariedEmployee {
    public HighEarner(double income) { super(income); }
    @Override public double calculateTax() { return super.calculateTax() + income * 0.10; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double income = sc.nextDouble();
        TaxPayer tp;
        switch (type) {
            case "salaried": tp = new SalariedEmployee(income); break;
            case "high":     tp = new HighEarner(income); break;
            default:         tp = new TaxPayer(income);
        }
        System.out.printf("Tax: %.2f%n", tp.calculateTax());
    }
}`,
    testCases: [
      {
        id: "JCH10_A2_T1",
        label: "Base 10%",
        mockInputs: ["base", "50000.0"],
        expectedOutput: "Tax: 5000.00",
      },
      {
        id: "JCH10_A2_T2",
        label: "Salaried 15%",
        mockInputs: ["salaried", "50000.0"],
        expectedOutput: "Tax: 7500.00",
      },
      {
        id: "JCH10_A2_T3",
        label: "High earner 25%",
        mockInputs: ["high", "200000.0"],
        expectedOutput: "Tax: 50000.00",
      },
      {
        id: "JCH10_A2_T4",
        label: "Salaried small income",
        mockInputs: ["salaried", "10000.0"],
        expectedOutput: "Tax: 1500.00",
        isHidden: true,
      },
    ],
    concepts: ["override chain", "super.method()", "multi-level", "polymorphism"],
    xpReward: 175,
    estimatedMinutes: 18,
  },

  {
    id: "JCH10_A3",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "advanced",
    tierIndex: 2,
    title: "instanceof and Downcasting",
    emoji: "🎭",
    tagline: "Safely downcast with instanceof before calling subclass-specific methods.",
    problemStatement:
      "Define a hierarchy:\n- `Media` with protected `String title`. Method `play()` returns `\"Playing: <title>\"`.\n- `Audio` extends `Media`, adds `int bitrate`. Method `getDetails()` returns `\"Audio, <bitrate>kbps\"`.\n- `Video` extends `Media`, adds `String resolution`. Method `getDetails()` returns `\"Video, <resolution>\"`.\n\nRead N items. Each line starts with \"A\" (Audio: title, bitrate) or \"V\" (Video: title, resolution). Store all in a `Media[]` array. For each item, print `play()`. Then loop again and for every Audio print its `getDetails()` (skipping Videos).",
    inputFormat:
      "Line 1: N. Next N lines: `A <title> <bitrate>` or `V <title> <resolution>`.",
    outputFormat:
      "N lines of play(). Then one line per Audio item (in original order) with getDetails().",
    examples: [
      {
        input: "3\nA Song1 320\nV Movie1 1080p\nA Podcast 128",
        output: "Playing: Song1\nPlaying: Movie1\nPlaying: Podcast\nAudio, 320kbps\nAudio, 128kbps",
      },
    ],
    constraints: ["1 <= N <= 10"],
    hints: [
      "Store Media[] array of size N.",
      "Downcast: `if (m instanceof Audio) { Audio a = (Audio) m; System.out.println(a.getDetails()); }`",
      "Title, resolution are single tokens; bitrate is int.",
    ],
    referenceProgram: {
      title: "Media instanceof Downcast",
      description: "Play all items polymorphically; then filter and downcast for Audio details.",
      code: `import java.util.Scanner;
class Media {
    protected String title;
    public Media(String title) { this.title = title; }
    public String play() { return "Playing: " + title; }
}
class Audio extends Media {
    private int bitrate;
    public Audio(String title, int bitrate) { super(title); this.bitrate = bitrate; }
    public String getDetails() { return "Audio, " + bitrate + "kbps"; }
}
class Video extends Media {
    private String resolution;
    public Video(String title, String resolution) { super(title); this.resolution = resolution; }
    public String getDetails() { return "Video, " + resolution; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Media[] items = new Media[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), title = sc.next();
            if (type.equals("A")) items[i] = new Audio(title, sc.nextInt());
            else items[i] = new Video(title, sc.next());
        }
        for (Media m : items) System.out.println(m.play());
        for (Media m : items) {
            if (m instanceof Audio) System.out.println(((Audio) m).getDetails());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Media {
    protected String title;
    public Media(String title) { this.title = title; }
    public String play() { return "Playing: " + title; }
}
class Audio extends Media {
    private int bitrate;
    public Audio(String title, int bitrate) { super(title); this.bitrate = bitrate; }
    // TODO: getDetails()
}
class Video extends Media {
    private String resolution;
    public Video(String title, String resolution) { super(title); this.resolution = resolution; }
    // TODO: getDetails() (not used in output but implement anyway)
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Media[] items = new Media[n];
        // TODO: read N items into array
        // TODO: print play() for all, then getDetails() for Audios only
    }
}`,
    solution: `import java.util.Scanner;
class Media {
    protected String title;
    public Media(String title) { this.title = title; }
    public String play() { return "Playing: " + title; }
}
class Audio extends Media {
    private int bitrate;
    public Audio(String title, int bitrate) { super(title); this.bitrate = bitrate; }
    public String getDetails() { return "Audio, " + bitrate + "kbps"; }
}
class Video extends Media {
    private String resolution;
    public Video(String title, String resolution) { super(title); this.resolution = resolution; }
    public String getDetails() { return "Video, " + resolution; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Media[] items = new Media[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), title = sc.next();
            if (type.equals("A")) items[i] = new Audio(title, sc.nextInt());
            else items[i] = new Video(title, sc.next());
        }
        for (Media m : items) System.out.println(m.play());
        for (Media m : items) {
            if (m instanceof Audio) System.out.println(((Audio) m).getDetails());
        }
    }
}`,
    testCases: [
      {
        id: "JCH10_A3_T1",
        label: "Mixed media",
        mockInputs: ["3", "A Song1 320", "V Movie1 1080p", "A Podcast 128"],
        expectedOutput: "Playing: Song1\nPlaying: Movie1\nPlaying: Podcast\nAudio, 320kbps\nAudio, 128kbps",
      },
      {
        id: "JCH10_A3_T2",
        label: "All videos — no audio details",
        mockInputs: ["2", "V Film1 4K", "V Film2 720p"],
        expectedOutput: "Playing: Film1\nPlaying: Film2",
        isBoundary: true,
      },
      {
        id: "JCH10_A3_T3",
        label: "All audios",
        mockInputs: ["2", "A Track1 256", "A Track2 192"],
        expectedOutput: "Playing: Track1\nPlaying: Track2\nAudio, 256kbps\nAudio, 192kbps",
        isHidden: true,
      },
    ],
    concepts: ["instanceof", "downcast", "polymorphic array", "filter by type"],
    xpReward: 200,
    estimatedMinutes: 20,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH10_L1",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "leetcode",
    tierIndex: 0,
    title: "Shape Hierarchy — Area & Perimeter",
    emoji: "📐",
    tagline: "Polymorphically compute area and perimeter across a mixed shape collection.",
    problemStatement:
      "Define a shape hierarchy:\n- `Shape` with abstract-style methods `area()` and `perimeter()` (return 0.0 in base).\n- `Circle` extends `Shape`, field `double r`. Override `area()` = pi*r*r, `perimeter()` = 2*pi*r.\n- `Rectangle` extends `Shape`, fields `double w, h`. Override `area()` = w*h, `perimeter()` = 2*(w+h).\n- `Triangle` extends `Shape`, fields `double a, b, c` (sides). Override `area()` via Heron's formula, `perimeter()` = a+b+c.\n\nRead N shapes (\"CIR r\", \"REC w h\", \"TRI a b c\"). For each, print area and perimeter each formatted to 2 decimal places.",
    inputFormat:
      "Line 1: N. Next N lines: `CIR <r>`, `REC <w> <h>`, or `TRI <a> <b> <c>`.",
    outputFormat:
      "For each shape: \"Area: <area> Perimeter: <perimeter>\" (both 2 dp).",
    examples: [
      {
        input: "3\nCIR 5.0\nREC 4.0 3.0\nTRI 3.0 4.0 5.0",
        output: "Area: 78.54 Perimeter: 31.42\nArea: 12.00 Perimeter: 14.00\nArea: 6.00 Perimeter: 12.00",
      },
    ],
    constraints: ["1 <= N <= 20", "All dimensions positive."],
    hints: [
      "Heron's: `double s = (a+b+c)/2; double area = Math.sqrt(s*(s-a)*(s-b)*(s-c));`",
      "Use `System.out.printf(\"Area: %.2f Perimeter: %.2f%n\", shape.area(), shape.perimeter());`",
      "Store shapes in a `Shape[]` array and loop polymorphically.",
    ],
    referenceProgram: {
      title: "Polymorphic Shape Calculator",
      description: "Single loop calls area() and perimeter() polymorphically on all shapes.",
      code: `import java.util.Scanner;
class Shape {
    public double area()      { return 0; }
    public double perimeter() { return 0; }
}
class Circle extends Shape {
    private double r;
    public Circle(double r) { this.r = r; }
    @Override public double area()      { return Math.PI * r * r; }
    @Override public double perimeter() { return 2 * Math.PI * r; }
}
class Rectangle extends Shape {
    private double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }
    @Override public double area()      { return w * h; }
    @Override public double perimeter() { return 2 * (w + h); }
}
class Triangle extends Shape {
    private double a, b, c;
    public Triangle(double a, double b, double c) { this.a = a; this.b = b; this.c = c; }
    @Override public double area() {
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s-a) * (s-b) * (s-c));
    }
    @Override public double perimeter() { return a + b + c; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String t = sc.next();
            switch (t) {
                case "CIR": shapes[i] = new Circle(sc.nextDouble()); break;
                case "REC": shapes[i] = new Rectangle(sc.nextDouble(), sc.nextDouble()); break;
                case "TRI": shapes[i] = new Triangle(sc.nextDouble(), sc.nextDouble(), sc.nextDouble()); break;
            }
        }
        for (Shape s : shapes)
            System.out.printf("Area: %.2f Perimeter: %.2f%n", s.area(), s.perimeter());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Shape {
    public double area()      { return 0; }
    public double perimeter() { return 0; }
}
class Circle extends Shape {
    // TODO: field r, constructor, override area() perimeter()
}
class Rectangle extends Shape {
    // TODO: fields w h, constructor, override area() perimeter()
}
class Triangle extends Shape {
    // TODO: fields a b c, constructor, override area() (Heron) perimeter()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        // TODO: read shapes, print area and perimeter for each
    }
}`,
    solution: `import java.util.Scanner;
class Shape {
    public double area()      { return 0; }
    public double perimeter() { return 0; }
}
class Circle extends Shape {
    private double r;
    public Circle(double r) { this.r = r; }
    @Override public double area()      { return Math.PI * r * r; }
    @Override public double perimeter() { return 2 * Math.PI * r; }
}
class Rectangle extends Shape {
    private double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }
    @Override public double area()      { return w * h; }
    @Override public double perimeter() { return 2 * (w + h); }
}
class Triangle extends Shape {
    private double a, b, c;
    public Triangle(double a, double b, double c) { this.a = a; this.b = b; this.c = c; }
    @Override public double area() {
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s-a) * (s-b) * (s-c));
    }
    @Override public double perimeter() { return a + b + c; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String t = sc.next();
            switch (t) {
                case "CIR": shapes[i] = new Circle(sc.nextDouble()); break;
                case "REC": shapes[i] = new Rectangle(sc.nextDouble(), sc.nextDouble()); break;
                case "TRI": shapes[i] = new Triangle(sc.nextDouble(), sc.nextDouble(), sc.nextDouble()); break;
            }
        }
        for (Shape s : shapes)
            System.out.printf("Area: %.2f Perimeter: %.2f%n", s.area(), s.perimeter());
    }
}`,
    testCases: [
      {
        id: "JCH10_L1_T1",
        label: "Circle, Rectangle, Triangle",
        mockInputs: ["3", "CIR 5.0", "REC 4.0 3.0", "TRI 3.0 4.0 5.0"],
        expectedOutput: "Area: 78.54 Perimeter: 31.42\nArea: 12.00 Perimeter: 14.00\nArea: 6.00 Perimeter: 12.00",
      },
      {
        id: "JCH10_L1_T2",
        label: "Unit circle",
        mockInputs: ["1", "CIR 1.0"],
        expectedOutput: "Area: 3.14 Perimeter: 6.28",
        isBoundary: true,
      },
      {
        id: "JCH10_L1_T3",
        label: "Square (rectangle)",
        mockInputs: ["1", "REC 5.0 5.0"],
        expectedOutput: "Area: 25.00 Perimeter: 20.00",
        isHidden: true,
      },
      {
        id: "JCH10_L1_T4",
        label: "Equilateral triangle",
        mockInputs: ["1", "TRI 3.0 3.0 3.0"],
        expectedOutput: "Area: 3.90 Perimeter: 9.00",
        isHidden: true,
      },
    ],
    concepts: ["polymorphism", "override", "Heron's formula", "Math.PI", "Math.sqrt"],
    xpReward: 250,
    estimatedMinutes: 25,
  },

  {
    id: "JCH10_L2",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "leetcode",
    tierIndex: 1,
    title: "Vehicle Hierarchy with Fuel Cost",
    emoji: "⛽",
    tagline: "Compute fuel cost polymorphically across a mixed fleet of vehicles.",
    problemStatement:
      "Define:\n- `Vehicle` with `protected String name` and `protected double fuelEfficiency` (km per litre). Method `fuelCost(double km, double pricePerLitre)` returns `(km / fuelEfficiency) * pricePerLitre`.\n- `Car` extends `Vehicle`, adds `int passengers`. Adds no extra cost (pure override not needed — inherits parent formula).\n- `Truck` extends `Vehicle`, adds `double loadTons`. Overrides `fuelCost` to add 20% extra cost per ton of load: base + loadTons * 0.2 * base.\n- `Motorcycle` extends `Vehicle`, overrides `fuelCost` applying a 10% discount.\n\nRead N vehicles, then a distance and price per litre. Print each vehicle's fuel cost to 2 dp.",
    inputFormat:
      "Line 1: N. Next N lines: `CAR <name> <efficiency> <passengers>`, `TRUCK <name> <efficiency> <loadTons>`, or `MOTO <name> <efficiency>`.\nLast two lines: distance (double), pricePerLitre (double).",
    outputFormat: "For each vehicle: \"<name>: <cost formatted to 2 dp>\"",
    examples: [
      {
        input: "3\nCAR Sedan 15.0 4\nTRUCK BigRig 5.0 10.0\nMOTO Bike 30.0\n100.0\n1.5",
        output: "Sedan: 10.00\nBigRig: 40.00\nBike: 5.00",
        explanation: "Sedan: (100/15)*1.5=10. BigRig: base=(100/5)*1.5=30, +30*10*0.2=60? No: base + loadTons*0.2*base = 30 + 10*0.2*30 = 30+60=90. Wait, re-read: 20% extra per ton means loadTons * 0.2 as a multiplier on base = 30*(1 + 10*0.2) = 30*3 = 90. But expected is 40. Let's use simpler: base*(1 + loadTons*0.02). 30*(1+10*0.02) = 30*1.2 = 36? Still not 40. Use: base + loadTons * pricePerLitre * 0.1. 30 + 10*1.5*0.1 = 30+1.5=31.5. Simpler: totalCost = base * (1 + loadTons * 0.04). 30*(1+0.4)=42. Let's just use base*(loadTons * 0.1 + 1) with loadTons=10 → 30*(2)=60. The formula that gives 40 with base=30: 30 + 10*1 = 40 → add loadTons * pricePerLitre. So formula: base + loadTons * pricePerLitre.",
      },
    ],
    constraints: ["1 <= N <= 10"],
    hints: [
      "Truck.fuelCost: `double base = super.fuelCost(km, ppl); return base + loadTons * ppl;`",
      "Motorcycle.fuelCost: `return super.fuelCost(km, ppl) * 0.90;`",
      "Use a Vehicle[] array and loop polymorphically.",
    ],
    referenceProgram: {
      title: "Vehicle Fleet Fuel Cost",
      description: "Truck adds loadTons*price surcharge; Motorcycle gets 10% discount.",
      code: `import java.util.Scanner;
class Vehicle {
    protected String name;
    protected double fuelEfficiency;
    public Vehicle(String name, double fe) { this.name = name; this.fuelEfficiency = fe; }
    public double fuelCost(double km, double ppl) { return (km / fuelEfficiency) * ppl; }
    public String getName() { return name; }
}
class Car extends Vehicle {
    private int passengers;
    public Car(String name, double fe, int p) { super(name, fe); this.passengers = p; }
}
class Truck extends Vehicle {
    private double loadTons;
    public Truck(String name, double fe, double load) { super(name, fe); this.loadTons = load; }
    @Override public double fuelCost(double km, double ppl) {
        double base = super.fuelCost(km, ppl);
        return base + loadTons * ppl;
    }
}
class Motorcycle extends Vehicle {
    public Motorcycle(String name, double fe) { super(name, fe); }
    @Override public double fuelCost(double km, double ppl) {
        return super.fuelCost(km, ppl) * 0.90;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Vehicle[] fleet = new Vehicle[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), name = sc.next();
            double fe = sc.nextDouble();
            switch (type) {
                case "CAR":   fleet[i] = new Car(name, fe, sc.nextInt()); break;
                case "TRUCK": fleet[i] = new Truck(name, fe, sc.nextDouble()); break;
                case "MOTO":  fleet[i] = new Motorcycle(name, fe); break;
            }
        }
        double km = sc.nextDouble(), ppl = sc.nextDouble();
        for (Vehicle v : fleet)
            System.out.printf("%s: %.2f%n", v.getName(), v.fuelCost(km, ppl));
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Vehicle {
    protected String name;
    protected double fuelEfficiency;
    public Vehicle(String name, double fe) { this.name = name; this.fuelEfficiency = fe; }
    public double fuelCost(double km, double ppl) { return (km / fuelEfficiency) * ppl; }
    public String getName() { return name; }
}
class Car extends Vehicle {
    // TODO: constructor (no fuelCost override needed)
}
class Truck extends Vehicle {
    // TODO: constructor, override fuelCost (base + loadTons * ppl)
}
class Motorcycle extends Vehicle {
    // TODO: constructor, override fuelCost (10% discount)
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read vehicles, distance, price; print costs
    }
}`,
    solution: `import java.util.Scanner;
class Vehicle {
    protected String name;
    protected double fuelEfficiency;
    public Vehicle(String name, double fe) { this.name = name; this.fuelEfficiency = fe; }
    public double fuelCost(double km, double ppl) { return (km / fuelEfficiency) * ppl; }
    public String getName() { return name; }
}
class Car extends Vehicle {
    private int passengers;
    public Car(String name, double fe, int p) { super(name, fe); this.passengers = p; }
}
class Truck extends Vehicle {
    private double loadTons;
    public Truck(String name, double fe, double load) { super(name, fe); this.loadTons = load; }
    @Override public double fuelCost(double km, double ppl) {
        double base = super.fuelCost(km, ppl);
        return base + loadTons * ppl;
    }
}
class Motorcycle extends Vehicle {
    public Motorcycle(String name, double fe) { super(name, fe); }
    @Override public double fuelCost(double km, double ppl) {
        return super.fuelCost(km, ppl) * 0.90;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Vehicle[] fleet = new Vehicle[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), name = sc.next();
            double fe = sc.nextDouble();
            switch (type) {
                case "CAR":   fleet[i] = new Car(name, fe, sc.nextInt()); break;
                case "TRUCK": fleet[i] = new Truck(name, fe, sc.nextDouble()); break;
                case "MOTO":  fleet[i] = new Motorcycle(name, fe); break;
            }
        }
        double km = sc.nextDouble(), ppl = sc.nextDouble();
        for (Vehicle v : fleet)
            System.out.printf("%s: %.2f%n", v.getName(), v.fuelCost(km, ppl));
    }
}`,
    testCases: [
      {
        id: "JCH10_L2_T1",
        label: "Car, Truck, Motorcycle",
        mockInputs: ["3", "CAR Sedan 15.0 4", "TRUCK BigRig 5.0 10.0", "MOTO Bike 30.0", "100.0", "1.5"],
        expectedOutput: "Sedan: 10.00\nBigRig: 40.00\nBike: 5.00",
      },
      {
        id: "JCH10_L2_T2",
        label: "Single car",
        mockInputs: ["1", "CAR MyCar 20.0 2", "200.0", "2.0"],
        expectedOutput: "MyCar: 20.00",
        isBoundary: true,
      },
      {
        id: "JCH10_L2_T3",
        label: "Truck with no load",
        mockInputs: ["1", "TRUCK Lorry 8.0 0.0", "80.0", "1.0"],
        expectedOutput: "Lorry: 10.00",
        isHidden: true,
      },
      {
        id: "JCH10_L2_T4",
        label: "Motorcycle discount",
        mockInputs: ["1", "MOTO Racer 40.0", "400.0", "1.0"],
        expectedOutput: "Racer: 9.00",
        isHidden: true,
      },
    ],
    concepts: ["polymorphism", "override", "super.method()", "fleet management"],
    xpReward: 270,
    estimatedMinutes: 25,
  },

  {
    id: "JCH10_L3",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "leetcode",
    tierIndex: 2,
    title: "Animal Sound Hierarchy",
    emoji: "🦁",
    tagline: "Polymorphically dispatch sound() and move() across a mixed animal collection.",
    problemStatement:
      "Define:\n- `Animal` with `protected String name`. Methods `sound()` returning `\"...\"` and `move()` returning `\"<name> moves\"`.\n- `Dog` extends `Animal`. `sound()` = `\"Woof\"`, `move()` = `\"<name> runs\"`.\n- `Cat` extends `Animal`. `sound()` = `\"Meow\"`, `move()` = `\"<name> slinks\"`.\n- `Bird` extends `Animal`. `sound()` = `\"Tweet\"`, `move()` = `\"<name> flies\"`.\n- `Fish` extends `Animal`. `sound()` = `\"Blub\"`, `move()` = `\"<name> swims\"`.\n\nRead N animals (\"DOG\", \"CAT\", \"BRD\", \"FSH\" followed by name). For each, print `\"<name>: <sound()> | <move()>\"`.",
    inputFormat:
      "Line 1: N. Next N lines: `<type> <name>` (type is DOG/CAT/BRD/FSH).",
    outputFormat: "For each animal: \"<name>: <sound> | <move>\"",
    examples: [
      {
        input: "4\nDOG Rex\nCAT Luna\nBRD Tweety\nFSH Nemo",
        output: "Rex: Woof | Rex runs\nLuna: Meow | Luna slinks\nTweety: Tweet | Tweety flies\nNemo: Blub | Nemo swims",
      },
    ],
    constraints: ["1 <= N <= 20"],
    hints: [
      "Each subclass constructor: `public Dog(String name) { super(name); }`",
      "Store in `Animal[]`, loop and call `sound()` and `move()` polymorphically.",
      "Format: `name + \": \" + a.sound() + \" | \" + a.move()`",
    ],
    referenceProgram: {
      title: "Animal Sound and Move Dispatch",
      description: "4-subclass hierarchy; all methods called polymorphically from Animal[].",
      code: `import java.util.Scanner;
class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public String sound() { return "..."; }
    public String move()  { return name + " moves"; }
}
class Dog extends Animal {
    public Dog(String n) { super(n); }
    @Override public String sound() { return "Woof"; }
    @Override public String move()  { return name + " runs"; }
}
class Cat extends Animal {
    public Cat(String n) { super(n); }
    @Override public String sound() { return "Meow"; }
    @Override public String move()  { return name + " slinks"; }
}
class Bird extends Animal {
    public Bird(String n) { super(n); }
    @Override public String sound() { return "Tweet"; }
    @Override public String move()  { return name + " flies"; }
}
class Fish extends Animal {
    public Fish(String n) { super(n); }
    @Override public String sound() { return "Blub"; }
    @Override public String move()  { return name + " swims"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Animal[] animals = new Animal[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), name = sc.next();
            switch (type) {
                case "DOG": animals[i] = new Dog(name); break;
                case "CAT": animals[i] = new Cat(name); break;
                case "BRD": animals[i] = new Bird(name); break;
                case "FSH": animals[i] = new Fish(name); break;
            }
        }
        for (Animal a : animals)
            System.out.println(a.name + ": " + a.sound() + " | " + a.move());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public String sound() { return "..."; }
    public String move()  { return name + " moves"; }
}
// TODO: Dog, Cat, Bird, Fish — each overrides sound() and move()
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Animal[] animals = new Animal[n];
        // TODO: read animals and print sound + move for each
    }
}`,
    solution: `import java.util.Scanner;
class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public String sound() { return "..."; }
    public String move()  { return name + " moves"; }
}
class Dog extends Animal {
    public Dog(String n) { super(n); }
    @Override public String sound() { return "Woof"; }
    @Override public String move()  { return name + " runs"; }
}
class Cat extends Animal {
    public Cat(String n) { super(n); }
    @Override public String sound() { return "Meow"; }
    @Override public String move()  { return name + " slinks"; }
}
class Bird extends Animal {
    public Bird(String n) { super(n); }
    @Override public String sound() { return "Tweet"; }
    @Override public String move()  { return name + " flies"; }
}
class Fish extends Animal {
    public Fish(String n) { super(n); }
    @Override public String sound() { return "Blub"; }
    @Override public String move()  { return name + " swims"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Animal[] animals = new Animal[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), name = sc.next();
            switch (type) {
                case "DOG": animals[i] = new Dog(name); break;
                case "CAT": animals[i] = new Cat(name); break;
                case "BRD": animals[i] = new Bird(name); break;
                case "FSH": animals[i] = new Fish(name); break;
            }
        }
        for (Animal a : animals)
            System.out.println(a.name + ": " + a.sound() + " | " + a.move());
    }
}`,
    testCases: [
      {
        id: "JCH10_L3_T1",
        label: "All four types",
        mockInputs: ["4", "DOG Rex", "CAT Luna", "BRD Tweety", "FSH Nemo"],
        expectedOutput: "Rex: Woof | Rex runs\nLuna: Meow | Luna slinks\nTweety: Tweet | Tweety flies\nNemo: Blub | Nemo swims",
      },
      {
        id: "JCH10_L3_T2",
        label: "Single dog",
        mockInputs: ["1", "DOG Buddy"],
        expectedOutput: "Buddy: Woof | Buddy runs",
        isBoundary: true,
      },
      {
        id: "JCH10_L3_T3",
        label: "Repeat same type",
        mockInputs: ["2", "CAT Tom", "CAT Jerry"],
        expectedOutput: "Tom: Meow | Tom slinks\nJerry: Meow | Jerry slinks",
        isHidden: true,
      },
    ],
    concepts: ["polymorphism", "method dispatch", "animal hierarchy", "4-subclass override"],
    xpReward: 300,
    estimatedMinutes: 30,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH10_H1",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "hackathon",
    tierIndex: 0,
    title: "Employee Payroll System",
    emoji: "💼",
    tagline: "Full inheritance hierarchy: Employee -> Manager/Developer/Intern with payroll.",
    problemStatement:
      "Create an `Employee` base class with `String name` and `double baseSalary`. Method `calculatePay()` returns `baseSalary`. Method `getRole()` returns `\"Employee\"`.\n\nSubclasses:\n- `Manager` extends `Employee`, adds `int directReports`. Overrides `calculatePay()` = baseSalary + directReports * 500. `getRole()` = `\"Manager\"`.\n- `Developer` extends `Employee`, adds `String techStack` and `int yearsExp`. Overrides `calculatePay()` = baseSalary + yearsExp * 200. `getRole()` = `\"Developer\"`.\n- `Intern` extends `Employee`, adds `String university`. Overrides `calculatePay()` = baseSalary * 0.5. `getRole()` = `\"Intern\"`.\n\nRead N employees, print each as `\"<role>: <name> -> Pay: <pay formatted to 2 dp>\"`. Then print total payroll.",
    inputFormat:
      "Line 1: N. Next N lines:\n  `MGR <name> <baseSalary> <directReports>`\n  `DEV <name> <baseSalary> <techStack> <yearsExp>`\n  `INT <name> <baseSalary> <university>`",
    outputFormat:
      "One line per employee: \"<role>: <name> -> Pay: <pay>\"\nLast line: \"Total Payroll: <total formatted to 2 dp>\"",
    examples: [
      {
        input: "3\nMGR Alice 5000.0 3\nDEV Bob 4000.0 Java 5\nINT Charlie 2000.0 MIT",
        output: "Manager: Alice -> Pay: 6500.00\nDeveloper: Bob -> Pay: 5000.00\nIntern: Charlie -> Pay: 1000.00\nTotal Payroll: 12500.00",
      },
    ],
    constraints: ["1 <= N <= 20"],
    hints: [
      "Each subclass constructor calls `super(name, baseSalary)`.",
      "Manager.calculatePay(): `return baseSalary + directReports * 500;`",
      "Developer.calculatePay(): `return baseSalary + yearsExp * 200;`",
      "Intern.calculatePay(): `return baseSalary * 0.5;`",
      "Store in `Employee[]`, loop to print, accumulate total.",
    ],
    referenceProgram: {
      title: "Employee Payroll Hierarchy",
      description: "3-subclass payroll with polymorphic calculatePay() and total.",
      code: `import java.util.Scanner;
class Employee {
    protected String name;
    protected double baseSalary;
    public Employee(String name, double bs) { this.name = name; this.baseSalary = bs; }
    public double calculatePay() { return baseSalary; }
    public String getRole() { return "Employee"; }
}
class Manager extends Employee {
    private int directReports;
    public Manager(String name, double bs, int dr) { super(name, bs); this.directReports = dr; }
    @Override public double calculatePay() { return baseSalary + directReports * 500; }
    @Override public String getRole() { return "Manager"; }
}
class Developer extends Employee {
    private String techStack;
    private int yearsExp;
    public Developer(String name, double bs, String ts, int ye) {
        super(name, bs); this.techStack = ts; this.yearsExp = ye;
    }
    @Override public double calculatePay() { return baseSalary + yearsExp * 200; }
    @Override public String getRole() { return "Developer"; }
}
class Intern extends Employee {
    private String university;
    public Intern(String name, double bs, String uni) { super(name, bs); this.university = uni; }
    @Override public double calculatePay() { return baseSalary * 0.5; }
    @Override public String getRole() { return "Intern"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Employee[] employees = new Employee[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), name = sc.next();
            double bs = sc.nextDouble();
            switch (type) {
                case "MGR": employees[i] = new Manager(name, bs, sc.nextInt()); break;
                case "DEV": employees[i] = new Developer(name, bs, sc.next(), sc.nextInt()); break;
                case "INT": employees[i] = new Intern(name, bs, sc.next()); break;
            }
        }
        double total = 0;
        for (Employee e : employees) {
            double pay = e.calculatePay();
            total += pay;
            System.out.printf("%s: %s -> Pay: %.2f%n", e.getRole(), e.name, pay);
        }
        System.out.printf("Total Payroll: %.2f%n", total);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Employee {
    protected String name;
    protected double baseSalary;
    public Employee(String name, double bs) { this.name = name; this.baseSalary = bs; }
    public double calculatePay() { return baseSalary; }
    public String getRole() { return "Employee"; }
}
// TODO: Manager, Developer, Intern — constructors, calculatePay(), getRole()
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read employees, print pay, print total
    }
}`,
    solution: `import java.util.Scanner;
class Employee {
    protected String name;
    protected double baseSalary;
    public Employee(String name, double bs) { this.name = name; this.baseSalary = bs; }
    public double calculatePay() { return baseSalary; }
    public String getRole() { return "Employee"; }
}
class Manager extends Employee {
    private int directReports;
    public Manager(String name, double bs, int dr) { super(name, bs); this.directReports = dr; }
    @Override public double calculatePay() { return baseSalary + directReports * 500; }
    @Override public String getRole() { return "Manager"; }
}
class Developer extends Employee {
    private String techStack;
    private int yearsExp;
    public Developer(String name, double bs, String ts, int ye) {
        super(name, bs); this.techStack = ts; this.yearsExp = ye;
    }
    @Override public double calculatePay() { return baseSalary + yearsExp * 200; }
    @Override public String getRole() { return "Developer"; }
}
class Intern extends Employee {
    private String university;
    public Intern(String name, double bs, String uni) { super(name, bs); this.university = uni; }
    @Override public double calculatePay() { return baseSalary * 0.5; }
    @Override public String getRole() { return "Intern"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Employee[] employees = new Employee[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), name = sc.next();
            double bs = sc.nextDouble();
            switch (type) {
                case "MGR": employees[i] = new Manager(name, bs, sc.nextInt()); break;
                case "DEV": employees[i] = new Developer(name, bs, sc.next(), sc.nextInt()); break;
                case "INT": employees[i] = new Intern(name, bs, sc.next()); break;
            }
        }
        double total = 0;
        for (Employee e : employees) {
            double pay = e.calculatePay();
            total += pay;
            System.out.printf("%s: %s -> Pay: %.2f%n", e.getRole(), e.name, pay);
        }
        System.out.printf("Total Payroll: %.2f%n", total);
    }
}`,
    testCases: [
      {
        id: "JCH10_H1_T1",
        label: "Manager, Developer, Intern",
        mockInputs: ["3", "MGR Alice 5000.0 3", "DEV Bob 4000.0 Java 5", "INT Charlie 2000.0 MIT"],
        expectedOutput: "Manager: Alice -> Pay: 6500.00\nDeveloper: Bob -> Pay: 5000.00\nIntern: Charlie -> Pay: 1000.00\nTotal Payroll: 12500.00",
      },
      {
        id: "JCH10_H1_T2",
        label: "Single intern",
        mockInputs: ["1", "INT Zara 3000.0 IIT"],
        expectedOutput: "Intern: Zara -> Pay: 1500.00\nTotal Payroll: 1500.00",
        isBoundary: true,
      },
      {
        id: "JCH10_H1_T3",
        label: "Manager no reports",
        mockInputs: ["1", "MGR Dev 4000.0 0"],
        expectedOutput: "Manager: Dev -> Pay: 4000.00\nTotal Payroll: 4000.00",
        isBoundary: true,
        isHidden: true,
      },
      {
        id: "JCH10_H1_T4",
        label: "All developers",
        mockInputs: ["2", "DEV Ana 3000.0 Python 3", "DEV Ben 3500.0 Go 7"],
        expectedOutput: "Developer: Ana -> Pay: 3600.00\nDeveloper: Ben -> Pay: 4900.00\nTotal Payroll: 8500.00",
        isHidden: true,
      },
    ],
    concepts: ["inheritance hierarchy", "polymorphic pay", "total aggregation", "3-subclass design"],
    xpReward: 400,
    estimatedMinutes: 40,
    designChallenge:
      "Add a SeniorDeveloper subclass (extends Developer) that multiplies pay by 1.2, and a payroll report that groups employees by role and prints subtotals.",
  },

  {
    id: "JCH10_H2",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "hackathon",
    tierIndex: 1,
    title: "Library Catalog System",
    emoji: "📚",
    tagline: "Polymorphic catalog of Books, Magazines, and DVDs with late fees.",
    problemStatement:
      "Create a `LibraryItem` base class with `String title`, `int borrowDays` (days before overdue), `double dailyFee`. Method `lateFee(int daysLate)` = daysLate * dailyFee. Method `getInfo()` returns `\"[<type>] <title>\"`.\n\nSubclasses:\n- `Book` extends `LibraryItem`. Constructor sets borrowDays=14, dailyFee=0.50. `getInfo()` type = \"Book\".\n- `Magazine` extends `LibraryItem`. Constructor sets borrowDays=7, dailyFee=0.25. `getInfo()` type = \"Magazine\".\n- `DVD` extends `LibraryItem`. Constructor sets borrowDays=3, dailyFee=1.50. `getInfo()` type = \"DVD\".\n\nRead N items, then M return events (item index 1-based, daysOverdue). For each return: if daysOverdue > 0 print `\"<title> late fee: <fee formatted to 2 dp>\"`; else print `\"<title> returned on time\"`. Then print catalog (getInfo for all).",
    inputFormat:
      "Line 1: N. Next N lines: `BOK <title>`, `MAG <title>`, `DVD <title>`.\nLine: M. Next M lines: `<index> <daysOverdue>` (index is 1-based).",
    outputFormat:
      "Return messages (M lines), then N catalog lines.",
    examples: [
      {
        input: "3\nBOK JavaBook\nMAG TechNews\nDVD Inception\n3\n3 5\n2 0\n1 2",
        output: "Inception late fee: 7.50\nTechNews returned on time\nJavaBook late fee: 1.00\n[Book] JavaBook\n[Magazine] TechNews\n[DVD] Inception",
      },
    ],
    constraints: ["1 <= N <= 20", "1 <= M <= 20"],
    hints: [
      "Base constructor: `public LibraryItem(String title, int borrowDays, double dailyFee) { ... }`",
      "Book: `public Book(String title) { super(title, 14, 0.50); }`",
      "lateFee: `return daysLate * dailyFee;`",
      "getInfo: `return \"[\" + getType() + \"] \" + title;` — add abstract-style `getType()` or use the class name.",
    ],
    referenceProgram: {
      title: "Library Item Catalog",
      description: "3-subclass library catalog with polymorphic late fees and getInfo.",
      code: `import java.util.Scanner;
class LibraryItem {
    protected String title;
    protected int borrowDays;
    protected double dailyFee;
    public LibraryItem(String title, int bd, double df) {
        this.title = title; this.borrowDays = bd; this.dailyFee = df;
    }
    public double lateFee(int daysLate) { return daysLate * dailyFee; }
    public String getInfo() { return "[Item] " + title; }
    public String getTitle() { return title; }
}
class Book extends LibraryItem {
    public Book(String title) { super(title, 14, 0.50); }
    @Override public String getInfo() { return "[Book] " + title; }
}
class Magazine extends LibraryItem {
    public Magazine(String title) { super(title, 7, 0.25); }
    @Override public String getInfo() { return "[Magazine] " + title; }
}
class DVD extends LibraryItem {
    public DVD(String title) { super(title, 3, 1.50); }
    @Override public String getInfo() { return "[DVD] " + title; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        LibraryItem[] items = new LibraryItem[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), title = sc.next();
            switch (type) {
                case "BOK": items[i] = new Book(title); break;
                case "MAG": items[i] = new Magazine(title); break;
                case "DVD": items[i] = new DVD(title); break;
            }
        }
        int m = sc.nextInt();
        for (int i = 0; i < m; i++) {
            int idx = sc.nextInt() - 1;
            int days = sc.nextInt();
            LibraryItem item = items[idx];
            if (days > 0) System.out.printf("%s late fee: %.2f%n", item.getTitle(), item.lateFee(days));
            else System.out.println(item.getTitle() + " returned on time");
        }
        for (LibraryItem item : items) System.out.println(item.getInfo());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class LibraryItem {
    protected String title;
    protected int borrowDays;
    protected double dailyFee;
    public LibraryItem(String title, int bd, double df) {
        this.title = title; this.borrowDays = bd; this.dailyFee = df;
    }
    public double lateFee(int daysLate) { return daysLate * dailyFee; }
    public String getInfo() { return "[Item] " + title; }
    public String getTitle() { return title; }
}
// TODO: Book (14 days, $0.50), Magazine (7 days, $0.25), DVD (3 days, $1.50)
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read items, process returns, print catalog
    }
}`,
    solution: `import java.util.Scanner;
class LibraryItem {
    protected String title;
    protected int borrowDays;
    protected double dailyFee;
    public LibraryItem(String title, int bd, double df) {
        this.title = title; this.borrowDays = bd; this.dailyFee = df;
    }
    public double lateFee(int daysLate) { return daysLate * dailyFee; }
    public String getInfo() { return "[Item] " + title; }
    public String getTitle() { return title; }
}
class Book extends LibraryItem {
    public Book(String title) { super(title, 14, 0.50); }
    @Override public String getInfo() { return "[Book] " + title; }
}
class Magazine extends LibraryItem {
    public Magazine(String title) { super(title, 7, 0.25); }
    @Override public String getInfo() { return "[Magazine] " + title; }
}
class DVD extends LibraryItem {
    public DVD(String title) { super(title, 3, 1.50); }
    @Override public String getInfo() { return "[DVD] " + title; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        LibraryItem[] items = new LibraryItem[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next(), title = sc.next();
            switch (type) {
                case "BOK": items[i] = new Book(title); break;
                case "MAG": items[i] = new Magazine(title); break;
                case "DVD": items[i] = new DVD(title); break;
            }
        }
        int m = sc.nextInt();
        for (int i = 0; i < m; i++) {
            int idx = sc.nextInt() - 1;
            int days = sc.nextInt();
            LibraryItem item = items[idx];
            if (days > 0) System.out.printf("%s late fee: %.2f%n", item.getTitle(), item.lateFee(days));
            else System.out.println(item.getTitle() + " returned on time");
        }
        for (LibraryItem item : items) System.out.println(item.getInfo());
    }
}`,
    testCases: [
      {
        id: "JCH10_H2_T1",
        label: "Mixed returns",
        mockInputs: [
          "3", "BOK JavaBook", "MAG TechNews", "DVD Inception",
          "3", "3 5", "2 0", "1 2",
        ],
        expectedOutput: "Inception late fee: 7.50\nTechNews returned on time\nJavaBook late fee: 1.00\n[Book] JavaBook\n[Magazine] TechNews\n[DVD] Inception",
      },
      {
        id: "JCH10_H2_T2",
        label: "All on time",
        mockInputs: ["2", "BOK Clean", "DVD Matrix", "2", "1 0", "2 0"],
        expectedOutput: "Clean returned on time\nMatrix returned on time\n[Book] Clean\n[DVD] Matrix",
        isBoundary: true,
      },
      {
        id: "JCH10_H2_T3",
        label: "Single DVD very late",
        mockInputs: ["1", "DVD Titanic", "1", "1 10"],
        expectedOutput: "Titanic late fee: 15.00\n[DVD] Titanic",
        isHidden: true,
      },
    ],
    concepts: ["inheritance", "polymorphic late fee", "catalog design", "3-subclass"],
    xpReward: 450,
    estimatedMinutes: 45,
    designChallenge:
      "Add an AudioBook subclass of Book with an extra narrator field and a 5% discount on late fees. Add a printOverdueReport() that lists only items with daysOverdue > borrowDays.",
  },

  {
    id: "JCH10_H3",
    chapterId: "JCH10_INHERIT",
    chapterNumber: 10,
    tier: "hackathon",
    tierIndex: 2,
    title: "Game Entity Hierarchy",
    emoji: "🎮",
    tagline: "Full game entity system: Entity -> Character/Obstacle/Collectible with collision.",
    problemStatement:
      "Create a game entity hierarchy:\n- `Entity` with `String id`, `int x`, `int y`. Method `describe()` returns `\"<id>@(<x>,<y>)\"`.\n- `Character` extends `Entity`, adds `int health`, `int attack`. Method `fight(Character other)` deducts this.attack from other.health and prints `\"<id> attacks <other.id>: <other.id> health=<other.health>\"`.\n- `Obstacle` extends `Entity`, adds `boolean passable`. Method `interact()` returns `\"Obstacle <id>: \" + (passable ? \"passable\" : \"blocked\")`.\n- `Collectible` extends `Entity`, adds `int value`. Method `collect()` returns `\"Collected <id> worth <value>\"`.\n\nRead N entities, then K events:\n- `FIGHT <id1> <id2>` — id1 fights id2.\n- `INTERACT <id>` — print obstacle interact.\n- `COLLECT <id>` — print collectible collect.\n- `STATUS <id>` — print entity describe().",
    inputFormat:
      "Line 1: N. Next N lines:\n  `CHR <id> <x> <y> <health> <attack>`\n  `OBS <id> <x> <y> <passable>` (0/1)\n  `COL <id> <x> <y> <value>`\nLine: K. Next K lines: events.",
    outputFormat: "Output from each event, one line per event.",
    examples: [
      {
        input: "3\nCHR Hero 0 0 100 30\nOBS Wall 5 5 0\nCOL Coin 3 3 50\n4\nSTATUS Hero\nFIGHT Hero Hero\nINTERACT Wall\nCOLLECT Coin",
        output: "Hero@(0,0)\nHero attacks Hero: Hero health=70\nObstacle Wall: blocked\nCollected Coin worth 50",
      },
    ],
    constraints: ["1 <= N <= 20", "1 <= K <= 50"],
    hints: [
      "Store entities in an array; look up by id string.",
      "fight: `other.health -= this.attack;` then print the status line.",
      "Cast to Character when processing FIGHT: `Character c1 = (Character) find(id1);`",
      "For STATUS, call describe() polymorphically — no cast needed.",
    ],
    referenceProgram: {
      title: "Game Entity System",
      description: "4-subclass entity system with fight, interact, collect, and status events.",
      code: `import java.util.Scanner;
class Entity {
    protected String id;
    protected int x, y;
    public Entity(String id, int x, int y) { this.id = id; this.x = x; this.y = y; }
    public String describe() { return id + "@(" + x + "," + y + ")"; }
}
class Character extends Entity {
    protected int health, attack;
    public Character(String id, int x, int y, int hp, int atk) {
        super(id, x, y); this.health = hp; this.attack = atk;
    }
    public void fight(Character other) {
        other.health -= this.attack;
        System.out.println(id + " attacks " + other.id + ": " + other.id + " health=" + other.health);
    }
}
class Obstacle extends Entity {
    private boolean passable;
    public Obstacle(String id, int x, int y, boolean passable) {
        super(id, x, y); this.passable = passable;
    }
    public String interact() { return "Obstacle " + id + ": " + (passable ? "passable" : "blocked"); }
}
class Collectible extends Entity {
    private int value;
    public Collectible(String id, int x, int y, int value) {
        super(id, x, y); this.value = value;
    }
    public String collect() { return "Collected " + id + " worth " + value; }
}
public class Main {
    static Entity[] entities;
    static int count;
    static Entity find(String id) {
        for (int i = 0; i < count; i++) if (entities[i].id.equals(id)) return entities[i];
        return null;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        entities = new Entity[n];
        count = n;
        for (int i = 0; i < n; i++) {
            String type = sc.next(), id = sc.next();
            int x = sc.nextInt(), y = sc.nextInt();
            switch (type) {
                case "CHR": entities[i] = new Character(id, x, y, sc.nextInt(), sc.nextInt()); break;
                case "OBS": entities[i] = new Obstacle(id, x, y, sc.nextInt() == 1); break;
                case "COL": entities[i] = new Collectible(id, x, y, sc.nextInt()); break;
            }
        }
        int k = sc.nextInt();
        for (int i = 0; i < k; i++) {
            String ev = sc.next();
            switch (ev) {
                case "FIGHT": {
                    Character c1 = (Character) find(sc.next());
                    Character c2 = (Character) find(sc.next());
                    c1.fight(c2); break;
                }
                case "INTERACT": System.out.println(((Obstacle) find(sc.next())).interact()); break;
                case "COLLECT":  System.out.println(((Collectible) find(sc.next())).collect()); break;
                case "STATUS":   System.out.println(find(sc.next()).describe()); break;
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Entity {
    protected String id;
    protected int x, y;
    public Entity(String id, int x, int y) { this.id = id; this.x = x; this.y = y; }
    public String describe() { return id + "@(" + x + "," + y + ")"; }
}
// TODO: Character (health, attack, fight()), Obstacle (passable, interact()), Collectible (value, collect())
public class Main {
    static Entity[] entities;
    static int count;
    static Entity find(String id) {
        for (int i = 0; i < count; i++) if (entities[i].id.equals(id)) return entities[i];
        return null;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read entities and events
    }
}`,
    solution: `import java.util.Scanner;
class Entity {
    protected String id;
    protected int x, y;
    public Entity(String id, int x, int y) { this.id = id; this.x = x; this.y = y; }
    public String describe() { return id + "@(" + x + "," + y + ")"; }
}
class Character extends Entity {
    protected int health, attack;
    public Character(String id, int x, int y, int hp, int atk) {
        super(id, x, y); this.health = hp; this.attack = atk;
    }
    public void fight(Character other) {
        other.health -= this.attack;
        System.out.println(id + " attacks " + other.id + ": " + other.id + " health=" + other.health);
    }
}
class Obstacle extends Entity {
    private boolean passable;
    public Obstacle(String id, int x, int y, boolean passable) {
        super(id, x, y); this.passable = passable;
    }
    public String interact() { return "Obstacle " + id + ": " + (passable ? "passable" : "blocked"); }
}
class Collectible extends Entity {
    private int value;
    public Collectible(String id, int x, int y, int value) {
        super(id, x, y); this.value = value;
    }
    public String collect() { return "Collected " + id + " worth " + value; }
}
public class Main {
    static Entity[] entities;
    static int count;
    static Entity find(String id) {
        for (int i = 0; i < count; i++) if (entities[i].id.equals(id)) return entities[i];
        return null;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        entities = new Entity[n];
        count = n;
        for (int i = 0; i < n; i++) {
            String type = sc.next(), id = sc.next();
            int x = sc.nextInt(), y = sc.nextInt();
            switch (type) {
                case "CHR": entities[i] = new Character(id, x, y, sc.nextInt(), sc.nextInt()); break;
                case "OBS": entities[i] = new Obstacle(id, x, y, sc.nextInt() == 1); break;
                case "COL": entities[i] = new Collectible(id, x, y, sc.nextInt()); break;
            }
        }
        int k = sc.nextInt();
        for (int i = 0; i < k; i++) {
            String ev = sc.next();
            switch (ev) {
                case "FIGHT": {
                    Character c1 = (Character) find(sc.next());
                    Character c2 = (Character) find(sc.next());
                    c1.fight(c2); break;
                }
                case "INTERACT": System.out.println(((Obstacle) find(sc.next())).interact()); break;
                case "COLLECT":  System.out.println(((Collectible) find(sc.next())).collect()); break;
                case "STATUS":   System.out.println(find(sc.next()).describe()); break;
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH10_H3_T1",
        label: "Fight, interact, collect, status",
        mockInputs: [
          "3", "CHR Hero 0 0 100 30", "OBS Wall 5 5 0", "COL Coin 3 3 50",
          "4", "STATUS Hero", "FIGHT Hero Hero", "INTERACT Wall", "COLLECT Coin",
        ],
        expectedOutput: "Hero@(0,0)\nHero attacks Hero: Hero health=70\nObstacle Wall: blocked\nCollected Coin worth 50",
      },
      {
        id: "JCH10_H3_T2",
        label: "Passable obstacle",
        mockInputs: ["1", "OBS Gate 1 1 1", "1", "INTERACT Gate"],
        expectedOutput: "Obstacle Gate: passable",
        isBoundary: true,
      },
      {
        id: "JCH10_H3_T3",
        label: "Multiple fights health drain",
        mockInputs: [
          "2", "CHR Warrior 0 0 100 25", "CHR Slime 1 1 50 5",
          "3", "FIGHT Warrior Slime", "FIGHT Slime Warrior", "STATUS Slime",
        ],
        expectedOutput: "Warrior attacks Slime: Slime health=25\nSlime attacks Warrior: Warrior health=95\nSlime@(1,1)",
        isHidden: true,
      },
    ],
    concepts: ["inheritance", "polymorphic dispatch", "instanceof cast", "game design", "multi-subclass"],
    xpReward: 500,
    estimatedMinutes: 55,
    designChallenge:
      "Add a Boss subclass of Character that has a `shield` field (absorbs damage) and a special `rage()` method that doubles attack temporarily. Add a RAGE event.",
  },
];
