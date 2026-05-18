import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH08_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH08_B1",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "beginner",
    tierIndex: 0,
    title: "Book Constructor",
    emoji: "📚",
    tagline: "Build a Book with a parameterized constructor.",
    problemStatement:
      "Create a class `Book` with fields `title` (String) and `pages` (int). Add a constructor `Book(String title, int pages)`. In `Main`, read the title and page count, create a `Book`, then print: `<title> has <pages> pages`.",
    inputFormat: "Line 1: book title (one word)\nLine 2: number of pages (integer)",
    outputFormat: "\"<title> has <pages> pages\"",
    examples: [
      { input: "JavaGuide\n350", output: "JavaGuide has 350 pages" },
      { input: "CleanCode\n464", output: "CleanCode has 464 pages" },
    ],
    constraints: ["Title is a single word.", "1 <= pages <= 5000"],
    hints: [
      "Declare `String title` and `int pages` as fields in the Book class.",
      "Constructor signature: `Book(String title, int pages)`.",
      "Use `this.title = title;` inside the constructor to avoid shadowing.",
      "In Main: `Book b = new Book(sc.next(), sc.nextInt());`",
      "Print: `System.out.println(b.title + \" has \" + b.pages + \" pages\");`",
    ],
    referenceProgram: {
      title: "Book with Parameterized Constructor",
      description: "Introduces parameterized constructors and the this keyword.",
      code: `import java.util.Scanner;
class Book {
    String title;
    int pages;
    Book(String title, int pages) {
        this.title = title;
        this.pages = pages;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Book b = new Book(sc.next(), sc.nextInt());
        System.out.println(b.title + " has " + b.pages + " pages");
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Book {
    String title;
    int pages;
    // TODO: add a constructor Book(String title, int pages)
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read title and pages, create Book, print result
    }
}`,
    solution: `import java.util.Scanner;
class Book {
    String title;
    int pages;
    Book(String title, int pages) {
        this.title = title;
        this.pages = pages;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Book b = new Book(sc.next(), sc.nextInt());
        System.out.println(b.title + " has " + b.pages + " pages");
    }
}`,
    testCases: [
      { id: "JCH08_B1_T1", label: "JavaGuide 350", mockInputs: ["JavaGuide", "350"], expectedOutput: "JavaGuide has 350 pages" },
      { id: "JCH08_B1_T2", label: "CleanCode 464", mockInputs: ["CleanCode", "464"], expectedOutput: "CleanCode has 464 pages" },
      { id: "JCH08_B1_T3", label: "1 page boundary", mockInputs: ["Pamphlet", "1"], expectedOutput: "Pamphlet has 1 pages", isBoundary: true },
      { id: "JCH08_B1_T4", label: "Large page count", mockInputs: ["Encyclopedia", "5000"], expectedOutput: "Encyclopedia has 5000 pages", isHidden: true },
    ],
    concepts: ["constructor", "parameterized constructor", "this keyword", "fields"],
    xpReward: 50,
    estimatedMinutes: 8,
  },

  {
    id: "JCH08_B2",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "beginner",
    tierIndex: 1,
    title: "Default vs Parameterized",
    emoji: "🔀",
    tagline: "Give a class both a default and a parameterized constructor.",
    problemStatement:
      "Create a class `Point` with int fields `x` and `y`. Add:\n- A **default constructor** that sets x=0, y=0.\n- A **parameterized constructor** `Point(int x, int y)`.\n\nRead a choice (0 or 1). If 0, create the default Point and print `(0,0)`. If 1, read x and y, create a parameterized Point, and print `(<x>,<y>)`.",
    inputFormat: "Line 1: choice (0 or 1)\nIf choice is 1 — Line 2: x, Line 3: y",
    outputFormat: "\"(<x>,<y>)\"",
    examples: [
      { input: "0", output: "(0,0)" },
      { input: "1\n3\n7", output: "(3,7)" },
    ],
    constraints: ["-1000 <= x, y <= 1000"],
    hints: [
      "Default constructor: `Point() { this.x = 0; this.y = 0; }`",
      "Parameterized constructor: `Point(int x, int y) { this.x = x; this.y = y; }`",
      "Read choice with `sc.nextInt()`.",
      "Use an if/else to decide which constructor to call.",
      "Print: `System.out.println(\"(\" + p.x + \",\" + p.y + \")\");`",
    ],
    referenceProgram: {
      title: "Point with Two Constructors",
      description: "Shows default and parameterized constructor coexistence.",
      code: `import java.util.Scanner;
class Point {
    int x, y;
    Point() { this.x = 0; this.y = 0; }
    Point(int x, int y) { this.x = x; this.y = y; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        Point p;
        if (choice == 0) {
            p = new Point();
        } else {
            p = new Point(sc.nextInt(), sc.nextInt());
        }
        System.out.println("(" + p.x + "," + p.y + ")");
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Point {
    int x, y;
    // TODO: default constructor sets x=0, y=0
    // TODO: parameterized constructor Point(int x, int y)
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        // TODO: based on choice, create Point and print
    }
}`,
    solution: `import java.util.Scanner;
class Point {
    int x, y;
    Point() { this.x = 0; this.y = 0; }
    Point(int x, int y) { this.x = x; this.y = y; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        Point p;
        if (choice == 0) {
            p = new Point();
        } else {
            p = new Point(sc.nextInt(), sc.nextInt());
        }
        System.out.println("(" + p.x + "," + p.y + ")");
    }
}`,
    testCases: [
      { id: "JCH08_B2_T1", label: "Default point", mockInputs: ["0"], expectedOutput: "(0,0)" },
      { id: "JCH08_B2_T2", label: "Parameterized 3,7", mockInputs: ["1", "3", "7"], expectedOutput: "(3,7)" },
      { id: "JCH08_B2_T3", label: "Negative coords", mockInputs: ["1", "-5", "-10"], expectedOutput: "(-5,-10)", isBoundary: true },
      { id: "JCH08_B2_T4", label: "Zero coords explicit", mockInputs: ["1", "0", "0"], expectedOutput: "(0,0)", isHidden: true },
    ],
    concepts: ["default constructor", "constructor overloading", "this keyword"],
    xpReward: 50,
    estimatedMinutes: 10,
  },

  {
    id: "JCH08_B3",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "beginner",
    tierIndex: 2,
    title: "Rectangle Area",
    emoji: "📐",
    tagline: "Overload Rectangle constructors for square and rectangle shapes.",
    problemStatement:
      "Create a class `Rectangle` with int fields `width` and `height`. Add:\n- `Rectangle(int side)` — for a square (width = height = side).\n- `Rectangle(int width, int height)` — for a rectangle.\n\nRead a choice (1 or 2). If 1, read one integer (side) and print the area. If 2, read width then height and print the area.",
    inputFormat: "Line 1: choice (1 or 2)\nLine 2 (and Line 3 if choice=2): dimensions",
    outputFormat: "\"Area: <area>\"",
    examples: [
      { input: "1\n5", output: "Area: 25" },
      { input: "2\n4\n6", output: "Area: 24" },
    ],
    constraints: ["1 <= dimensions <= 1000"],
    hints: [
      "`Rectangle(int side)` sets `this.width = side; this.height = side;`",
      "`Rectangle(int width, int height)` sets both fields via `this`.",
      "Area = `width * height`.",
      "Read the choice, then branch to the right constructor.",
    ],
    referenceProgram: {
      title: "Rectangle with Overloaded Constructors",
      description: "Constructor overloading based on number of parameters.",
      code: `import java.util.Scanner;
class Rectangle {
    int width, height;
    Rectangle(int side) { this.width = side; this.height = side; }
    Rectangle(int width, int height) { this.width = width; this.height = height; }
    int area() { return width * height; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        Rectangle r;
        if (choice == 1) r = new Rectangle(sc.nextInt());
        else             r = new Rectangle(sc.nextInt(), sc.nextInt());
        System.out.println("Area: " + r.area());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Rectangle {
    int width, height;
    // TODO: Rectangle(int side) — square
    // TODO: Rectangle(int width, int height) — rectangle
    // TODO: area() method
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        // TODO: create correct Rectangle and print area
    }
}`,
    solution: `import java.util.Scanner;
class Rectangle {
    int width, height;
    Rectangle(int side) { this.width = side; this.height = side; }
    Rectangle(int width, int height) { this.width = width; this.height = height; }
    int area() { return width * height; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        Rectangle r;
        if (choice == 1) r = new Rectangle(sc.nextInt());
        else             r = new Rectangle(sc.nextInt(), sc.nextInt());
        System.out.println("Area: " + r.area());
    }
}`,
    testCases: [
      { id: "JCH08_B3_T1", label: "Square side 5", mockInputs: ["1", "5"], expectedOutput: "Area: 25" },
      { id: "JCH08_B3_T2", label: "Rectangle 4x6", mockInputs: ["2", "4", "6"], expectedOutput: "Area: 24" },
      { id: "JCH08_B3_T3", label: "Square side 1", mockInputs: ["1", "1"], expectedOutput: "Area: 1", isBoundary: true },
      { id: "JCH08_B3_T4", label: "Rectangle 100x200", mockInputs: ["2", "100", "200"], expectedOutput: "Area: 20000", isHidden: true },
    ],
    concepts: ["constructor overloading", "this keyword", "method in class"],
    xpReward: 50,
    estimatedMinutes: 10,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH08_I1",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "intermediate",
    tierIndex: 0,
    title: "Copy Constructor",
    emoji: "📋",
    tagline: "Deep-clone a Student object using a copy constructor.",
    problemStatement:
      "Create a class `Student` with fields `name` (String) and `gpa` (double). Add:\n- A parameterized constructor `Student(String name, double gpa)`.\n- A **copy constructor** `Student(Student other)` that copies both fields.\n\nRead a student's name and GPA. Create original, then create a copy. Modify the copy's GPA by reading a new value. Print both students' info to confirm the original is unchanged.\n\nOutput format:\nOrig: `<name> <gpa>`\nCopy: `<name> <newGpa>`",
    inputFormat: "Line 1: name\nLine 2: original GPA (double)\nLine 3: new GPA for copy (double)",
    outputFormat: "\"Orig: <name> <gpa>\"\n\"Copy: <name> <newGpa>\"",
    examples: [
      { input: "Alice\n3.8\n3.5", output: "Orig: Alice 3.8\nCopy: Alice 3.5" },
      { input: "Bob\n2.9\n3.1", output: "Orig: Bob 2.9\nCopy: Bob 3.1" },
    ],
    constraints: ["0.0 <= GPA <= 4.0", "Name is a single word."],
    hints: [
      "Copy constructor: `Student(Student other) { this.name = other.name; this.gpa = other.gpa; }`",
      "After copying, modify the copy's `gpa` directly: `copy.gpa = sc.nextDouble();`",
      "The original must not change — that's the whole point of a copy constructor.",
      "Print with: `System.out.println(\"Orig: \" + orig.name + \" \" + orig.gpa);`",
    ],
    referenceProgram: {
      title: "Student Copy Constructor",
      description: "Demonstrates copy constructor pattern — essential for safe cloning.",
      code: `import java.util.Scanner;
class Student {
    String name;
    double gpa;
    Student(String name, double gpa) { this.name = name; this.gpa = gpa; }
    Student(Student other) { this.name = other.name; this.gpa = other.gpa; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Student orig = new Student(sc.next(), sc.nextDouble());
        Student copy = new Student(orig);
        copy.gpa = sc.nextDouble();
        System.out.println("Orig: " + orig.name + " " + orig.gpa);
        System.out.println("Copy: " + copy.name + " " + copy.gpa);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Student {
    String name;
    double gpa;
    Student(String name, double gpa) { this.name = name; this.gpa = gpa; }
    // TODO: copy constructor Student(Student other)
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read orig, copy, modify copy's gpa, print both
    }
}`,
    solution: `import java.util.Scanner;
class Student {
    String name;
    double gpa;
    Student(String name, double gpa) { this.name = name; this.gpa = gpa; }
    Student(Student other) { this.name = other.name; this.gpa = other.gpa; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Student orig = new Student(sc.next(), sc.nextDouble());
        Student copy = new Student(orig);
        copy.gpa = sc.nextDouble();
        System.out.println("Orig: " + orig.name + " " + orig.gpa);
        System.out.println("Copy: " + copy.name + " " + copy.gpa);
    }
}`,
    testCases: [
      { id: "JCH08_I1_T1", label: "Alice 3.8 → 3.5", mockInputs: ["Alice", "3.8", "3.5"], expectedOutput: "Orig: Alice 3.8\nCopy: Alice 3.5" },
      { id: "JCH08_I1_T2", label: "Bob 2.9 → 3.1", mockInputs: ["Bob", "2.9", "3.1"], expectedOutput: "Orig: Bob 2.9\nCopy: Bob 3.1" },
      { id: "JCH08_I1_T3", label: "Max GPA boundary", mockInputs: ["Zara", "4.0", "3.9"], expectedOutput: "Orig: Zara 4.0\nCopy: Zara 3.9", isBoundary: true },
      { id: "JCH08_I1_T4", label: "Zero GPA", mockInputs: ["Dave", "0.0", "1.0"], expectedOutput: "Orig: Dave 0.0\nCopy: Dave 1.0", isHidden: true },
    ],
    concepts: ["copy constructor", "constructor overloading", "object cloning"],
    xpReward: 100,
    estimatedMinutes: 15,
  },

  {
    id: "JCH08_I2",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "intermediate",
    tierIndex: 1,
    title: "Constructor Chaining with this()",
    emoji: "⛓️",
    tagline: "Use this() to chain constructors and avoid duplicate code.",
    problemStatement:
      "Create a class `Employee` with fields `name` (String), `department` (String), and `salary` (double). Add:\n- `Employee(String name)` — sets name, department=\"General\", salary=30000.0\n- `Employee(String name, String department)` — sets name & department, salary=30000.0\n- `Employee(String name, String department, double salary)` — sets all three.\n\nEach shorter constructor must call the next longer one using `this(...)`.\n\nRead the number of employees (1–3), then for each: read how many args (1, 2, or 3) followed by the arg values. Print each employee as `<name>|<department>|<salary>`.",
    inputFormat: "Line 1: N (number of employees)\nFor each employee:\n  Line: numArgs (1, 2, or 3)\n  Then numArgs lines: name [department [salary]]",
    outputFormat: "N lines: \"<name>|<department>|<salary>\"",
    examples: [
      {
        input: "2\n1\nAlice\n3\nBob\nEngineering\n75000.0",
        output: "Alice|General|30000.0\nBob|Engineering|75000.0",
      },
    ],
    constraints: ["1 <= N <= 3", "salary > 0"],
    hints: [
      "`Employee(String name)` calls `this(name, \"General\");`",
      "`Employee(String name, String department)` calls `this(name, department, 30000.0);`",
      "`Employee(String name, String department, double salary)` sets all fields.",
      "`this()` must be the first statement in the constructor body.",
      "Use `sc.nextLine()` for name/dept since they may have spaces.",
    ],
    referenceProgram: {
      title: "Employee with this() Chaining",
      description: "Constructor chaining eliminates duplicate initialization code.",
      code: `import java.util.Scanner;
class Employee {
    String name, department;
    double salary;
    Employee(String name) { this(name, "General"); }
    Employee(String name, String department) { this(name, department, 30000.0); }
    Employee(String name, String department, double salary) {
        this.name = name; this.department = department; this.salary = salary;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            int numArgs = Integer.parseInt(sc.nextLine().trim());
            Employee e;
            if (numArgs == 1) {
                e = new Employee(sc.nextLine().trim());
            } else if (numArgs == 2) {
                String name = sc.nextLine().trim();
                String dept = sc.nextLine().trim();
                e = new Employee(name, dept);
            } else {
                String name = sc.nextLine().trim();
                String dept = sc.nextLine().trim();
                double sal = Double.parseDouble(sc.nextLine().trim());
                e = new Employee(name, dept, sal);
            }
            System.out.println(e.name + "|" + e.department + "|" + e.salary);
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Employee {
    String name, department;
    double salary;
    // TODO: Employee(String name) — chain to 2-arg
    // TODO: Employee(String name, String department) — chain to 3-arg
    // TODO: Employee(String name, String department, double salary) — set all fields
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            int numArgs = Integer.parseInt(sc.nextLine().trim());
            Employee e;
            // TODO: read args and create Employee
            // TODO: print e.name + "|" + e.department + "|" + e.salary
        }
    }
}`,
    solution: `import java.util.Scanner;
class Employee {
    String name, department;
    double salary;
    Employee(String name) { this(name, "General"); }
    Employee(String name, String department) { this(name, department, 30000.0); }
    Employee(String name, String department, double salary) {
        this.name = name; this.department = department; this.salary = salary;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            int numArgs = Integer.parseInt(sc.nextLine().trim());
            Employee e;
            if (numArgs == 1) {
                e = new Employee(sc.nextLine().trim());
            } else if (numArgs == 2) {
                String name = sc.nextLine().trim();
                String dept = sc.nextLine().trim();
                e = new Employee(name, dept);
            } else {
                String name = sc.nextLine().trim();
                String dept = sc.nextLine().trim();
                double sal = Double.parseDouble(sc.nextLine().trim());
                e = new Employee(name, dept, sal);
            }
            System.out.println(e.name + "|" + e.department + "|" + e.salary);
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_I2_T1",
        label: "1-arg and 3-arg",
        mockInputs: ["2", "1", "Alice", "3", "Bob", "Engineering", "75000.0"],
        expectedOutput: "Alice|General|30000.0\nBob|Engineering|75000.0",
      },
      {
        id: "JCH08_I2_T2",
        label: "2-arg constructor",
        mockInputs: ["1", "2", "Carol", "HR"],
        expectedOutput: "Carol|HR|30000.0",
      },
      {
        id: "JCH08_I2_T3",
        label: "All three variants",
        mockInputs: ["3", "1", "Dave", "2", "Eve", "Finance", "3", "Frank", "IT", "90000.0"],
        expectedOutput: "Dave|General|30000.0\nEve|Finance|30000.0\nFrank|IT|90000.0",
        isBoundary: true,
      },
      {
        id: "JCH08_I2_T4",
        label: "Single 3-arg",
        mockInputs: ["1", "3", "Grace", "Marketing", "55000.5"],
        expectedOutput: "Grace|Marketing|55000.5",
        isHidden: true,
      },
    ],
    concepts: ["constructor chaining", "this()", "overloading", "default values"],
    xpReward: 100,
    estimatedMinutes: 18,
  },

  {
    id: "JCH08_I3",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "intermediate",
    tierIndex: 2,
    title: "Immutable Circle",
    emoji: "⭕",
    tagline: "Make a Circle immutable with final fields set only in the constructor.",
    problemStatement:
      "Create an **immutable** class `Circle` with a `final double radius` field. Provide only one constructor `Circle(double radius)`. Add methods `area()` (returns πr²) and `perimeter()` (returns 2πr). Use `Math.PI`.\n\nRead N circles (1 ≤ N ≤ 5). For each, read the radius and print `Area=<area> Perimeter=<perimeter>`, both rounded to 2 decimal places.",
    inputFormat: "Line 1: N\nLines 2..N+1: radius (double)",
    outputFormat: "N lines: \"Area=<a> Perimeter=<p>\" (2 decimal places)",
    examples: [
      { input: "2\n5.0\n1.0", output: "Area=78.54 Perimeter=31.42\nArea=3.14 Perimeter=6.28" },
    ],
    constraints: ["0 < radius <= 1000", "Use Math.PI", "Round to 2 decimal places"],
    hints: [
      "Declare: `final double radius;` — once set in constructor, it cannot change.",
      "`area()`: `return Math.PI * radius * radius;`",
      "`perimeter()`: `return 2 * Math.PI * radius;`",
      "Format: `String.format(\"Area=%.2f Perimeter=%.2f\", c.area(), c.perimeter())`",
      "Immutable means no setters — only getters and final fields.",
    ],
    referenceProgram: {
      title: "Immutable Circle Class",
      description: "final fields + constructor-only initialization = immutability.",
      code: `import java.util.Scanner;
class Circle {
    final double radius;
    Circle(double radius) { this.radius = radius; }
    double area() { return Math.PI * radius * radius; }
    double perimeter() { return 2 * Math.PI * radius; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            Circle c = new Circle(sc.nextDouble());
            System.out.printf("Area=%.2f Perimeter=%.2f%n", c.area(), c.perimeter());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Circle {
    // TODO: final double radius field
    // TODO: constructor Circle(double radius)
    // TODO: area() and perimeter() methods using Math.PI
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            // TODO: create Circle, print area and perimeter
        }
    }
}`,
    solution: `import java.util.Scanner;
class Circle {
    final double radius;
    Circle(double radius) { this.radius = radius; }
    double area() { return Math.PI * radius * radius; }
    double perimeter() { return 2 * Math.PI * radius; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            Circle c = new Circle(sc.nextDouble());
            System.out.printf("Area=%.2f Perimeter=%.2f%n", c.area(), c.perimeter());
        }
    }
}`,
    testCases: [
      { id: "JCH08_I3_T1", label: "r=5 and r=1", mockInputs: ["2", "5.0", "1.0"], expectedOutput: "Area=78.54 Perimeter=31.42\nArea=3.14 Perimeter=6.28" },
      { id: "JCH08_I3_T2", label: "r=7", mockInputs: ["1", "7.0"], expectedOutput: "Area=153.94 Perimeter=43.98" },
      { id: "JCH08_I3_T3", label: "Very small radius", mockInputs: ["1", "0.1"], expectedOutput: "Area=0.03 Perimeter=0.63", isBoundary: true },
      { id: "JCH08_I3_T4", label: "5 circles", mockInputs: ["5", "2.0", "3.0", "4.0", "5.0", "6.0"], expectedOutput: "Area=12.57 Perimeter=12.57\nArea=28.27 Perimeter=18.85\nArea=50.27 Perimeter=25.13\nArea=78.54 Perimeter=31.42\nArea=113.10 Perimeter=37.70", isHidden: true },
    ],
    concepts: ["immutable class", "final fields", "Math.PI", "printf formatting"],
    xpReward: 100,
    estimatedMinutes: 15,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH08_A1",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "advanced",
    tierIndex: 0,
    title: "Bank Account with Validation",
    emoji: "🏦",
    tagline: "Validate inputs inside the constructor and throw exceptions.",
    problemStatement:
      "Create a class `BankAccount` with fields `accountNumber` (String), `holderName` (String), and `balance` (double). The constructor `BankAccount(String accountNumber, String holderName, double balance)` must:\n- Throw `IllegalArgumentException(\"Invalid account number\")` if `accountNumber` is null or empty.\n- Throw `IllegalArgumentException(\"Invalid name\")` if `holderName` is null or empty.\n- Throw `IllegalArgumentException(\"Balance cannot be negative\")` if balance < 0.\n\nRead N accounts. For each, read accountNumber, holderName, balance. Try to create the account. On success print `Created: <accountNumber> <holderName> <balance>`. On `IllegalArgumentException` print `Error: <message>`.",
    inputFormat: "Line 1: N\nFor each account: 3 lines — accountNumber, holderName, balance",
    outputFormat: "N lines: \"Created: ...\" or \"Error: ...\"",
    examples: [
      {
        input: "3\nACC001\nAlice\n5000.0\n\nBob\n1000.0\nACC003\nCharlie\n-100.0",
        output: "Created: ACC001 Alice 5000.0\nError: Invalid account number\nError: Balance cannot be negative",
      },
    ],
    constraints: ["1 <= N <= 5"],
    hints: [
      "Use `if (accountNumber == null || accountNumber.isEmpty())` to validate.",
      "Inside the constructor: `throw new IllegalArgumentException(\"Invalid account number\");`",
      "Wrap each creation in `try { ... } catch (IllegalArgumentException e) { System.out.println(\"Error: \" + e.getMessage()); }`",
      "Read blank lines carefully — use `sc.nextLine()` and `.trim()`.",
    ],
    referenceProgram: {
      title: "BankAccount with Constructor Validation",
      description: "Validation inside constructors guards object invariants.",
      code: `import java.util.Scanner;
class BankAccount {
    String accountNumber, holderName;
    double balance;
    BankAccount(String accountNumber, String holderName, double balance) {
        if (accountNumber == null || accountNumber.isEmpty())
            throw new IllegalArgumentException("Invalid account number");
        if (holderName == null || holderName.isEmpty())
            throw new IllegalArgumentException("Invalid name");
        if (balance < 0)
            throw new IllegalArgumentException("Balance cannot be negative");
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = balance;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String acc = sc.nextLine().trim();
            String name = sc.nextLine().trim();
            double bal = Double.parseDouble(sc.nextLine().trim());
            try {
                BankAccount ba = new BankAccount(acc, name, bal);
                System.out.println("Created: " + ba.accountNumber + " " + ba.holderName + " " + ba.balance);
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class BankAccount {
    String accountNumber, holderName;
    double balance;
    BankAccount(String accountNumber, String holderName, double balance) {
        // TODO: validate accountNumber — throw if null/empty
        // TODO: validate holderName — throw if null/empty
        // TODO: validate balance — throw if < 0
        // TODO: assign fields
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            // TODO: read 3 lines, try-catch, print result
        }
    }
}`,
    solution: `import java.util.Scanner;
class BankAccount {
    String accountNumber, holderName;
    double balance;
    BankAccount(String accountNumber, String holderName, double balance) {
        if (accountNumber == null || accountNumber.isEmpty())
            throw new IllegalArgumentException("Invalid account number");
        if (holderName == null || holderName.isEmpty())
            throw new IllegalArgumentException("Invalid name");
        if (balance < 0)
            throw new IllegalArgumentException("Balance cannot be negative");
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = balance;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String acc = sc.nextLine().trim();
            String name = sc.nextLine().trim();
            double bal = Double.parseDouble(sc.nextLine().trim());
            try {
                BankAccount ba = new BankAccount(acc, name, bal);
                System.out.println("Created: " + ba.accountNumber + " " + ba.holderName + " " + ba.balance);
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_A1_T1",
        label: "All valid",
        mockInputs: ["2", "ACC001", "Alice", "5000.0", "ACC002", "Bob", "0.0"],
        expectedOutput: "Created: ACC001 Alice 5000.0\nCreated: ACC002 Bob 0.0",
      },
      {
        id: "JCH08_A1_T2",
        label: "Negative balance",
        mockInputs: ["1", "ACC003", "Charlie", "-100.0"],
        expectedOutput: "Error: Balance cannot be negative",
      },
      {
        id: "JCH08_A1_T3",
        label: "Empty account number",
        mockInputs: ["1", "", "Dave", "500.0"],
        expectedOutput: "Error: Invalid account number",
        isBoundary: true,
      },
      {
        id: "JCH08_A1_T4",
        label: "Mixed valid and invalid",
        mockInputs: ["3", "ACC001", "Alice", "1000.0", "", "Bob", "200.0", "ACC003", "Carol", "-50.0"],
        expectedOutput: "Created: ACC001 Alice 1000.0\nError: Invalid account number\nError: Balance cannot be negative",
        isHidden: true,
      },
    ],
    concepts: ["constructor validation", "IllegalArgumentException", "try-catch", "guard clauses"],
    xpReward: 150,
    estimatedMinutes: 20,
  },

  {
    id: "JCH08_A2",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "advanced",
    tierIndex: 1,
    title: "Static Factory Methods",
    emoji: "🏭",
    tagline: "Replace constructors with named static factory methods for clarity.",
    problemStatement:
      "Create a class `Temperature` with a `private double celsius` field and a **private** constructor. Add static factory methods:\n- `Temperature.fromCelsius(double c)` — creates from °C\n- `Temperature.fromFahrenheit(double f)` — converts (c = (f-32)*5/9) then creates\n- `Temperature.fromKelvin(double k)` — converts (c = k-273.15) then creates\n\nAdd `toCelsius()`, `toFahrenheit()`, and `toKelvin()` methods.\n\nRead N conversions. Each line: `<unit> <value>` where unit is C, F, or K. Print the temperature in all three units, each rounded to 2 decimal places:\n`C=<c> F=<f> K=<k>`",
    inputFormat: "Line 1: N\nLines 2..N+1: \"<unit> <value>\"",
    outputFormat: "N lines: \"C=<c> F=<f> K=<k>\"",
    examples: [
      { input: "2\nC 100.0\nF 32.0", output: "C=100.00 F=212.00 K=373.15\nC=0.00 F=32.00 K=273.15" },
    ],
    constraints: ["Unit is C, F, or K", "1 <= N <= 10"],
    hints: [
      "Private constructor: `private Temperature(double celsius) { this.celsius = celsius; }`",
      "`fromFahrenheit`: `return new Temperature((f - 32) * 5.0 / 9.0);`",
      "`toFahrenheit()`: `return celsius * 9.0 / 5.0 + 32;`",
      "`toKelvin()`: `return celsius + 273.15;`",
      "You cannot call `new Temperature(...)` outside the class — that's the point of factory methods.",
    ],
    referenceProgram: {
      title: "Temperature Static Factory",
      description: "Static factory methods provide named, readable object creation.",
      code: `import java.util.Scanner;
class Temperature {
    private double celsius;
    private Temperature(double celsius) { this.celsius = celsius; }
    static Temperature fromCelsius(double c) { return new Temperature(c); }
    static Temperature fromFahrenheit(double f) { return new Temperature((f - 32) * 5.0 / 9.0); }
    static Temperature fromKelvin(double k) { return new Temperature(k - 273.15); }
    double toCelsius() { return celsius; }
    double toFahrenheit() { return celsius * 9.0 / 5.0 + 32; }
    double toKelvin() { return celsius + 273.15; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String unit = sc.next();
            double val = sc.nextDouble();
            Temperature t;
            if (unit.equals("C")) t = Temperature.fromCelsius(val);
            else if (unit.equals("F")) t = Temperature.fromFahrenheit(val);
            else t = Temperature.fromKelvin(val);
            System.out.printf("C=%.2f F=%.2f K=%.2f%n", t.toCelsius(), t.toFahrenheit(), t.toKelvin());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Temperature {
    private double celsius;
    private Temperature(double celsius) { this.celsius = celsius; }
    // TODO: static Temperature fromCelsius(double c)
    // TODO: static Temperature fromFahrenheit(double f)
    // TODO: static Temperature fromKelvin(double k)
    // TODO: toCelsius(), toFahrenheit(), toKelvin()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            // TODO: read unit and value, create Temperature, print all three
        }
    }
}`,
    solution: `import java.util.Scanner;
class Temperature {
    private double celsius;
    private Temperature(double celsius) { this.celsius = celsius; }
    static Temperature fromCelsius(double c) { return new Temperature(c); }
    static Temperature fromFahrenheit(double f) { return new Temperature((f - 32) * 5.0 / 9.0); }
    static Temperature fromKelvin(double k) { return new Temperature(k - 273.15); }
    double toCelsius() { return celsius; }
    double toFahrenheit() { return celsius * 9.0 / 5.0 + 32; }
    double toKelvin() { return celsius + 273.15; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String unit = sc.next();
            double val = sc.nextDouble();
            Temperature t;
            if (unit.equals("C")) t = Temperature.fromCelsius(val);
            else if (unit.equals("F")) t = Temperature.fromFahrenheit(val);
            else t = Temperature.fromKelvin(val);
            System.out.printf("C=%.2f F=%.2f K=%.2f%n", t.toCelsius(), t.toFahrenheit(), t.toKelvin());
        }
    }
}`,
    testCases: [
      { id: "JCH08_A2_T1", label: "100°C and 32°F", mockInputs: ["2", "C", "100.0", "F", "32.0"], expectedOutput: "C=100.00 F=212.00 K=373.15\nC=0.00 F=32.00 K=273.15" },
      { id: "JCH08_A2_T2", label: "0K (absolute zero)", mockInputs: ["1", "K", "273.15"], expectedOutput: "C=0.00 F=32.00 K=273.15", isBoundary: true },
      { id: "JCH08_A2_T3", label: "Body temp 37C", mockInputs: ["1", "C", "37.0"], expectedOutput: "C=37.00 F=98.60 K=310.15" },
      { id: "JCH08_A2_T4", label: "Kelvin 373.15", mockInputs: ["1", "K", "373.15"], expectedOutput: "C=100.00 F=212.00 K=373.15", isHidden: true },
    ],
    concepts: ["static factory method", "private constructor", "encapsulation", "unit conversion"],
    xpReward: 150,
    estimatedMinutes: 22,
  },

  {
    id: "JCH08_A3",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "advanced",
    tierIndex: 2,
    title: "Builder Pattern",
    emoji: "🔨",
    tagline: "Use the Builder pattern to construct complex objects step by step.",
    problemStatement:
      "Implement a simplified **Builder pattern** for a `Pizza` class.\n\n`Pizza` has: `size` (String, required), `crust` (String, default \"thin\"), `sauce` (String, default \"tomato\"), `cheese` (boolean, default true), `extraToppings` (String, default \"none\").\n\nCreate a static inner class `Pizza.Builder` with:\n- `Builder(String size)` constructor (required)\n- `crust(String c)`, `sauce(String s)`, `cheese(boolean b)`, `toppings(String t)` — each returns `this` for chaining.\n- `build()` — returns a `Pizza` instance.\n\nRead N pizza orders. Each order starts with a size, followed by K key=value pairs on the same line. Print the pizza summary: `Pizza[size=<s> crust=<c> sauce=<s> cheese=<b> toppings=<t>]`",
    inputFormat: "Line 1: N\nLines 2..N+1: \"<size> [key=value ...]\" (e.g. \"Large crust=thick sauce=bbq cheese=false\")",
    outputFormat: "N lines: \"Pizza[size=<s> crust=<c> sauce=<s> cheese=<b> toppings=<t>]\"",
    examples: [
      {
        input: "2\nLarge crust=thick sauce=bbq\nSmall cheese=false toppings=olives",
        output: "Pizza[size=Large crust=thick sauce=bbq cheese=true toppings=none]\nPizza[size=Small crust=thin sauce=tomato cheese=false toppings=olives]",
      },
    ],
    constraints: ["1 <= N <= 5"],
    hints: [
      "Inner class: `static class Builder { ... }` inside Pizza.",
      "Each setter in Builder: `Builder crust(String c) { this.crust = c; return this; }`",
      "`build()` calls the private Pizza constructor: `return new Pizza(this);`",
      "Private Pizza constructor takes a Builder: `Pizza(Builder b) { this.size = b.size; ... }`",
      "Parse key=value pairs with `String.split(\"=\")`.",
    ],
    referenceProgram: {
      title: "Pizza Builder Pattern",
      description: "The Builder pattern decouples complex object construction from representation.",
      code: `import java.util.Scanner;
class Pizza {
    private String size, crust, sauce, extraToppings;
    private boolean cheese;
    private Pizza(Builder b) {
        size = b.size; crust = b.crust; sauce = b.sauce;
        cheese = b.cheese; extraToppings = b.extraToppings;
    }
    public String toString() {
        return "Pizza[size=" + size + " crust=" + crust + " sauce=" + sauce
             + " cheese=" + cheese + " toppings=" + extraToppings + "]";
    }
    static class Builder {
        String size, crust = "thin", sauce = "tomato", extraToppings = "none";
        boolean cheese = true;
        Builder(String size) { this.size = size; }
        Builder crust(String c) { crust = c; return this; }
        Builder sauce(String s) { sauce = s; return this; }
        Builder cheese(boolean b) { cheese = b; return this; }
        Builder toppings(String t) { extraToppings = t; return this; }
        Pizza build() { return new Pizza(this); }
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            Pizza.Builder b = new Pizza.Builder(parts[0]);
            for (int j = 1; j < parts.length; j++) {
                String[] kv = parts[j].split("=");
                switch (kv[0]) {
                    case "crust": b.crust(kv[1]); break;
                    case "sauce": b.sauce(kv[1]); break;
                    case "cheese": b.cheese(Boolean.parseBoolean(kv[1])); break;
                    case "toppings": b.toppings(kv[1]); break;
                }
            }
            System.out.println(b.build());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Pizza {
    private String size, crust, sauce, extraToppings;
    private boolean cheese;
    private Pizza(Builder b) {
        // TODO: assign all fields from builder
    }
    public String toString() {
        return "Pizza[size=" + size + " crust=" + crust + " sauce=" + sauce
             + " cheese=" + cheese + " toppings=" + extraToppings + "]";
    }
    static class Builder {
        String size;
        // TODO: declare crust, sauce, extraToppings with defaults; boolean cheese default true
        Builder(String size) { this.size = size; }
        // TODO: crust(), sauce(), cheese(), toppings() — each returns this
        // TODO: build() returns new Pizza(this)
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            // TODO: create builder, apply key=value pairs, build and print
        }
    }
}`,
    solution: `import java.util.Scanner;
class Pizza {
    private String size, crust, sauce, extraToppings;
    private boolean cheese;
    private Pizza(Builder b) {
        size = b.size; crust = b.crust; sauce = b.sauce;
        cheese = b.cheese; extraToppings = b.extraToppings;
    }
    public String toString() {
        return "Pizza[size=" + size + " crust=" + crust + " sauce=" + sauce
             + " cheese=" + cheese + " toppings=" + extraToppings + "]";
    }
    static class Builder {
        String size, crust = "thin", sauce = "tomato", extraToppings = "none";
        boolean cheese = true;
        Builder(String size) { this.size = size; }
        Builder crust(String c) { crust = c; return this; }
        Builder sauce(String s) { sauce = s; return this; }
        Builder cheese(boolean b) { cheese = b; return this; }
        Builder toppings(String t) { extraToppings = t; return this; }
        Pizza build() { return new Pizza(this); }
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            Pizza.Builder b = new Pizza.Builder(parts[0]);
            for (int j = 1; j < parts.length; j++) {
                String[] kv = parts[j].split("=");
                switch (kv[0]) {
                    case "crust": b.crust(kv[1]); break;
                    case "sauce": b.sauce(kv[1]); break;
                    case "cheese": b.cheese(Boolean.parseBoolean(kv[1])); break;
                    case "toppings": b.toppings(kv[1]); break;
                }
            }
            System.out.println(b.build());
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_A3_T1",
        label: "Large with crust+sauce",
        mockInputs: ["2", "Large crust=thick sauce=bbq", "Small cheese=false toppings=olives"],
        expectedOutput: "Pizza[size=Large crust=thick sauce=bbq cheese=true toppings=none]\nPizza[size=Small crust=thin sauce=tomato cheese=false toppings=olives]",
      },
      {
        id: "JCH08_A3_T2",
        label: "Defaults only",
        mockInputs: ["1", "Medium"],
        expectedOutput: "Pizza[size=Medium crust=thin sauce=tomato cheese=true toppings=none]",
      },
      {
        id: "JCH08_A3_T3",
        label: "All overridden",
        mockInputs: ["1", "XL crust=stuffed sauce=pesto cheese=false toppings=mushrooms"],
        expectedOutput: "Pizza[size=XL crust=stuffed sauce=pesto cheese=false toppings=mushrooms]",
        isBoundary: true,
      },
      {
        id: "JCH08_A3_T4",
        label: "Three orders",
        mockInputs: ["3", "Small", "Large sauce=alfredo", "Medium crust=thick cheese=false toppings=peppers"],
        expectedOutput: "Pizza[size=Small crust=thin sauce=tomato cheese=true toppings=none]\nPizza[size=Large crust=thin sauce=alfredo cheese=true toppings=none]\nPizza[size=Medium crust=thick sauce=tomato cheese=false toppings=peppers]",
        isHidden: true,
      },
    ],
    concepts: ["builder pattern", "static inner class", "method chaining", "fluent API"],
    xpReward: 150,
    estimatedMinutes: 25,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH08_L1",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "leetcode",
    tierIndex: 0,
    title: "Min Stack",
    emoji: "📊",
    tagline: "Build a MinStack that tracks the minimum in O(1) using constructor-initialized state.",
    problemStatement:
      "Design a `MinStack` class that supports push, pop, top, and getMin in O(1) time.\n\nConstructor `MinStack()` initialises the data structure.\n\nMethods:\n- `push(int val)` — pushes val onto the stack.\n- `pop()` — removes the top element.\n- `top()` — returns the top element.\n- `getMin()` — returns the current minimum.\n\nRead N operations. Each is one of: `push <val>`, `pop`, `top`, `getMin`. Print the result only for `top` and `getMin` operations.",
    inputFormat: "Line 1: N\nLines 2..N+1: operation (push val / pop / top / getMin)",
    outputFormat: "One integer per top/getMin call",
    examples: [
      {
        input: "7\npush 5\npush 3\npush 7\ngetMin\npop\ngetMin\ntop",
        output: "3\n3\n5",
      },
    ],
    constraints: ["1 <= N <= 100", "-10000 <= val <= 10000", "pop/top/getMin called only on non-empty stack"],
    hints: [
      "Use two stacks: one for values, one to track minimums.",
      "On push: if minStack is empty or val <= minStack.peek(), also push to minStack.",
      "On pop: if popped value equals minStack.peek(), also pop minStack.",
      "getMin() returns minStack.peek().",
      "Use `java.util.Stack<Integer>` or `java.util.Deque<Integer>`.",
    ],
    referenceProgram: {
      title: "MinStack with Auxiliary Stack",
      description: "Classic O(1) min-tracking via a parallel min-stack.",
      code: `import java.util.*;
class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();
    MinStack() {}
    void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);
    }
    void pop() {
        int val = stack.pop();
        if (val == minStack.peek()) minStack.pop();
    }
    int top() { return stack.peek(); }
    int getMin() { return minStack.peek(); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("push")) ms.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("pop")) ms.pop();
            else if (line.equals("top")) System.out.println(ms.top());
            else if (line.equals("getMin")) System.out.println(ms.getMin());
        }
    }
}`,
    },
    starterCode: `import java.util.*;
class MinStack {
    // TODO: declare data structures
    MinStack() {
        // TODO: initialize
    }
    void push(int val) { /* TODO */ }
    void pop() { /* TODO */ }
    int top() { return 0; /* TODO */ }
    int getMin() { return 0; /* TODO */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("push")) ms.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("pop")) ms.pop();
            else if (line.equals("top")) System.out.println(ms.top());
            else if (line.equals("getMin")) System.out.println(ms.getMin());
        }
    }
}`,
    solution: `import java.util.*;
class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();
    MinStack() {}
    void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);
    }
    void pop() {
        int val = stack.pop();
        if (val == minStack.peek()) minStack.pop();
    }
    int top() { return stack.peek(); }
    int getMin() { return minStack.peek(); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("push")) ms.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("pop")) ms.pop();
            else if (line.equals("top")) System.out.println(ms.top());
            else if (line.equals("getMin")) System.out.println(ms.getMin());
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_L1_T1",
        label: "push 5,3,7 → getMin, pop, getMin, top",
        mockInputs: ["7", "push 5", "push 3", "push 7", "getMin", "pop", "getMin", "top"],
        expectedOutput: "3\n3\n5",
      },
      {
        id: "JCH08_L1_T2",
        label: "All same values",
        mockInputs: ["5", "push 2", "push 2", "getMin", "pop", "getMin"],
        expectedOutput: "2\n2",
      },
      {
        id: "JCH08_L1_T3",
        label: "Descending push",
        mockInputs: ["6", "push 10", "push 5", "push 1", "getMin", "pop", "getMin"],
        expectedOutput: "1\n5",
        isBoundary: true,
      },
      {
        id: "JCH08_L1_T4",
        label: "Ascending push",
        mockInputs: ["5", "push 1", "push 2", "push 3", "getMin", "top"],
        expectedOutput: "1\n3",
        isHidden: true,
      },
    ],
    concepts: ["OOP design", "constructor", "Deque", "O(1) min tracking", "stack"],
    xpReward: 250,
    estimatedMinutes: 25,
    timeComplexityTarget: "O(1) all operations",
    spaceComplexityTarget: "O(n)",
  },

  {
    id: "JCH08_L2",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "leetcode",
    tierIndex: 1,
    title: "LRU Cache",
    emoji: "🗂️",
    tagline: "Implement an LRU Cache using a constructor-configured capacity.",
    problemStatement:
      "Design an `LRUCache` class:\n- `LRUCache(int capacity)` — initialises cache with given capacity.\n- `int get(int key)` — returns value if key exists, else -1.\n- `void put(int key, int value)` — inserts/updates. If capacity exceeded, evict the least recently used key.\n\nRead N operations: `LRUCache <cap>` (first line), then `get <key>` or `put <key> <val>`. Print results of get operations.",
    inputFormat: "Line 1: \"LRUCache <capacity>\"\nLines 2..N: \"get <key>\" or \"put <key> <val>\"",
    outputFormat: "One integer per get call (-1 if miss)",
    examples: [
      {
        input: "8\nLRUCache 2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1",
        output: "1\n-1\n1",
      },
    ],
    constraints: ["1 <= capacity <= 100", "0 <= key, value <= 1000"],
    hints: [
      "Use `LinkedHashMap<Integer, Integer>` — it preserves insertion order.",
      "Override `removeEldestEntry` to evict when size > capacity.",
      "`LinkedHashMap(capacity, 0.75f, true)` — third param `true` = access order (MRU last).",
      "get: if key exists, LinkedHashMap moves it to end; return value.",
      "put: just call `map.put(key, value)` — removeEldestEntry handles eviction.",
    ],
    referenceProgram: {
      title: "LRU Cache with LinkedHashMap",
      description: "LinkedHashMap with access-order mode gives O(1) LRU eviction.",
      code: `import java.util.*;
class LRUCache {
    private LinkedHashMap<Integer, Integer> map;
    private int cap;
    LRUCache(int capacity) {
        cap = capacity;
        map = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer,Integer> eldest) {
                return size() > cap;
            }
        };
    }
    int get(int key) { return map.getOrDefault(key, -1); }
    void put(int key, int value) { map.put(key, value); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] first = sc.nextLine().trim().split(" ");
        LRUCache cache = new LRUCache(Integer.parseInt(first[1]));
        for (int i = 2; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            if (parts[0].equals("get")) System.out.println(cache.get(Integer.parseInt(parts[1])));
            else cache.put(Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
        }
    }
}`,
    },
    starterCode: `import java.util.*;
class LRUCache {
    // TODO: declare fields
    LRUCache(int capacity) {
        // TODO: initialize LinkedHashMap with access order
    }
    int get(int key) { return -1; /* TODO */ }
    void put(int key, int value) { /* TODO */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] first = sc.nextLine().trim().split(" ");
        LRUCache cache = new LRUCache(Integer.parseInt(first[1]));
        for (int i = 2; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            if (parts[0].equals("get")) System.out.println(cache.get(Integer.parseInt(parts[1])));
            else cache.put(Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
        }
    }
}`,
    solution: `import java.util.*;
class LRUCache {
    private LinkedHashMap<Integer, Integer> map;
    private int cap;
    LRUCache(int capacity) {
        cap = capacity;
        map = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer,Integer> eldest) {
                return size() > cap;
            }
        };
    }
    int get(int key) { return map.getOrDefault(key, -1); }
    void put(int key, int value) { map.put(key, value); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] first = sc.nextLine().trim().split(" ");
        LRUCache cache = new LRUCache(Integer.parseInt(first[1]));
        for (int i = 2; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            if (parts[0].equals("get")) System.out.println(cache.get(Integer.parseInt(parts[1])));
            else cache.put(Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_L2_T1",
        label: "Classic LRU example",
        mockInputs: ["8", "LRUCache 2", "put 1 1", "put 2 2", "get 1", "put 3 3", "get 2", "put 4 4", "get 1"],
        expectedOutput: "1\n-1\n1",
      },
      {
        id: "JCH08_L2_T2",
        label: "Capacity 1",
        mockInputs: ["5", "LRUCache 1", "put 1 10", "get 1", "put 2 20", "get 1"],
        expectedOutput: "10\n-1",
        isBoundary: true,
      },
      {
        id: "JCH08_L2_T3",
        label: "Update existing key",
        mockInputs: ["5", "LRUCache 2", "put 1 1", "put 1 10", "get 1", "get 2"],
        expectedOutput: "10\n-1",
      },
      {
        id: "JCH08_L2_T4",
        label: "Capacity 3 eviction",
        mockInputs: ["8", "LRUCache 3", "put 1 1", "put 2 2", "put 3 3", "get 1", "put 4 4", "get 2", "get 3"],
        expectedOutput: "1\n-1\n3",
        isHidden: true,
      },
    ],
    concepts: ["LinkedHashMap", "access-order", "constructor", "cache design", "eviction policy"],
    xpReward: 250,
    estimatedMinutes: 30,
    timeComplexityTarget: "O(1) get and put",
  },

  {
    id: "JCH08_L3",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "leetcode",
    tierIndex: 2,
    title: "Fraction Class",
    emoji: "½",
    tagline: "Build an immutable Fraction with arithmetic operations and GCD normalisation.",
    problemStatement:
      "Create an immutable `Fraction` class with `final int numerator` and `final int denominator`. The constructor `Fraction(int num, int den)` should:\n- Throw `ArithmeticException` if denominator is 0.\n- Normalise sign (denominator always positive).\n- Reduce by GCD.\n\nAdd methods: `add(Fraction)`, `subtract(Fraction)`, `multiply(Fraction)`, `divide(Fraction)` — each returns a new Fraction.\nOverride `toString()` to return `\"<num>/<den>\"` or `\"<num>\"` if denominator is 1.\n\nRead N operations: `<num1>/<den1> <op> <num2>/<den2>` where op is +, -, *, /. Print result.",
    inputFormat: "Line 1: N\nLines 2..N+1: \"<a>/<b> <op> <c>/<d>\"",
    outputFormat: "N lines: result fraction",
    examples: [
      { input: "3\n1/2 + 1/3\n3/4 * 2/3\n5/6 - 1/3", output: "5/6\n1/2\n1/2" },
    ],
    constraints: ["Denominators != 0", "All fractions are valid", "1 <= N <= 10"],
    hints: [
      "GCD: `int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`",
      "In constructor: `int g = gcd(Math.abs(num), Math.abs(den)); this.numerator = (den < 0 ? -num : num) / g;`",
      "add: `new Fraction(a.num * b.den + b.num * a.den, a.den * b.den)`",
      "multiply: `new Fraction(a.num * b.num, a.den * b.den)`",
      "divide: multiply by reciprocal.",
    ],
    referenceProgram: {
      title: "Immutable Fraction with GCD",
      description: "Constructor normalization + arithmetic via new Fraction instances.",
      code: `import java.util.Scanner;
class Fraction {
    final int numerator, denominator;
    Fraction(int num, int den) {
        if (den == 0) throw new ArithmeticException("Denominator cannot be zero");
        int g = gcd(Math.abs(num), Math.abs(den));
        int sign = den < 0 ? -1 : 1;
        numerator = sign * num / g;
        denominator = sign * den / g;
    }
    private static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    Fraction add(Fraction o)      { return new Fraction(numerator * o.denominator + o.numerator * denominator, denominator * o.denominator); }
    Fraction subtract(Fraction o) { return new Fraction(numerator * o.denominator - o.numerator * denominator, denominator * o.denominator); }
    Fraction multiply(Fraction o) { return new Fraction(numerator * o.numerator, denominator * o.denominator); }
    Fraction divide(Fraction o)   { return new Fraction(numerator * o.denominator, denominator * o.numerator); }
    public String toString() { return denominator == 1 ? "" + numerator : numerator + "/" + denominator; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            String[] a = parts[0].split("/"); String[] b = parts[2].split("/");
            Fraction f1 = new Fraction(Integer.parseInt(a[0]), Integer.parseInt(a[1]));
            Fraction f2 = new Fraction(Integer.parseInt(b[0]), Integer.parseInt(b[1]));
            Fraction res;
            switch (parts[1]) {
                case "+": res = f1.add(f2); break;
                case "-": res = f1.subtract(f2); break;
                case "*": res = f1.multiply(f2); break;
                default:  res = f1.divide(f2);
            }
            System.out.println(res);
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Fraction {
    final int numerator, denominator;
    Fraction(int num, int den) {
        // TODO: throw if den == 0
        // TODO: compute GCD, handle sign, normalise
    }
    private static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    Fraction add(Fraction o)      { return null; /* TODO */ }
    Fraction subtract(Fraction o) { return null; /* TODO */ }
    Fraction multiply(Fraction o) { return null; /* TODO */ }
    Fraction divide(Fraction o)   { return null; /* TODO */ }
    public String toString() { return ""; /* TODO */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            String[] a = parts[0].split("/"); String[] b = parts[2].split("/");
            Fraction f1 = new Fraction(Integer.parseInt(a[0]), Integer.parseInt(a[1]));
            Fraction f2 = new Fraction(Integer.parseInt(b[0]), Integer.parseInt(b[1]));
            Fraction res;
            switch (parts[1]) {
                case "+": res = f1.add(f2); break;
                case "-": res = f1.subtract(f2); break;
                case "*": res = f1.multiply(f2); break;
                default:  res = f1.divide(f2);
            }
            System.out.println(res);
        }
    }
}`,
    solution: `import java.util.Scanner;
class Fraction {
    final int numerator, denominator;
    Fraction(int num, int den) {
        if (den == 0) throw new ArithmeticException("Denominator cannot be zero");
        int g = gcd(Math.abs(num), Math.abs(den));
        int sign = den < 0 ? -1 : 1;
        numerator = sign * num / g;
        denominator = sign * den / g;
    }
    private static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    Fraction add(Fraction o)      { return new Fraction(numerator * o.denominator + o.numerator * denominator, denominator * o.denominator); }
    Fraction subtract(Fraction o) { return new Fraction(numerator * o.denominator - o.numerator * denominator, denominator * o.denominator); }
    Fraction multiply(Fraction o) { return new Fraction(numerator * o.numerator, denominator * o.denominator); }
    Fraction divide(Fraction o)   { return new Fraction(numerator * o.denominator, denominator * o.numerator); }
    public String toString() { return denominator == 1 ? "" + numerator : numerator + "/" + denominator; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ");
            String[] a = parts[0].split("/"); String[] b = parts[2].split("/");
            Fraction f1 = new Fraction(Integer.parseInt(a[0]), Integer.parseInt(a[1]));
            Fraction f2 = new Fraction(Integer.parseInt(b[0]), Integer.parseInt(b[1]));
            Fraction res;
            switch (parts[1]) {
                case "+": res = f1.add(f2); break;
                case "-": res = f1.subtract(f2); break;
                case "*": res = f1.multiply(f2); break;
                default:  res = f1.divide(f2);
            }
            System.out.println(res);
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_L3_T1",
        label: "Add, multiply, subtract",
        mockInputs: ["3", "1/2 + 1/3", "3/4 * 2/3", "5/6 - 1/3"],
        expectedOutput: "5/6\n1/2\n1/2",
      },
      {
        id: "JCH08_L3_T2",
        label: "Division gives whole number",
        mockInputs: ["1", "6/4 / 3/4"],
        expectedOutput: "2",
      },
      {
        id: "JCH08_L3_T3",
        label: "Negative result",
        mockInputs: ["1", "1/4 - 1/2"],
        expectedOutput: "-1/4",
        isBoundary: true,
      },
      {
        id: "JCH08_L3_T4",
        label: "Already reduced",
        mockInputs: ["1", "2/4 + 2/4"],
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    concepts: ["immutable class", "GCD", "final fields", "constructor normalization", "operator methods"],
    xpReward: 250,
    estimatedMinutes: 30,
    timeComplexityTarget: "O(log min(a,b)) per operation",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH08_H1",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "hackathon",
    tierIndex: 0,
    title: "Config Registry",
    emoji: "⚙️",
    tagline: "Build a type-safe config registry using overloaded constructors and a singleton.",
    problemStatement:
      "Create a `ConfigRegistry` using the **Singleton pattern** — only one instance allowed.\n\n`ConfigRegistry.getInstance()` returns the single instance. Internally stores config as key→value map.\n\nAdd overloaded `set` methods:\n- `set(String key, String value)`\n- `set(String key, int value)` — stores as String\n- `set(String key, boolean value)` — stores \"true\"/\"false\"\n\nAdd `get(String key)` — returns the String value or `\"NOT_FOUND\"` if absent.\nAdd `getInt(String key)` — returns int or -1 if absent/unparseable.\nAdd `getBoolean(String key)` — returns boolean or false.\n\nRead N commands: `set <key> <value>` or `get <key>` or `getInt <key>` or `getBoolean <key>`. For set, auto-detect type (integer if parseable as int, \"true\"/\"false\" as boolean, else String).\nPrint output only for get/getInt/getBoolean commands.",
    inputFormat: "Line 1: N\nLines 2..N+1: command",
    outputFormat: "One value per get/getInt/getBoolean call",
    examples: [
      {
        input: "7\nset port 8080\nset debug true\nset name MyApp\nget name\ngetInt port\ngetBoolean debug\nget missing",
        output: "MyApp\n8080\ntrue\nNOT_FOUND",
      },
    ],
    constraints: ["1 <= N <= 20", "Keys are alphanumeric", "Values are single tokens"],
    hints: [
      "Singleton: `private static ConfigRegistry instance; private ConfigRegistry() { ... }`",
      "`getInstance()`: `if (instance == null) instance = new ConfigRegistry(); return instance;`",
      "Try `Integer.parseInt(value)` to detect int; check `value.equals(\"true\") || value.equals(\"false\")` for boolean.",
      "`getInt`: `try { return Integer.parseInt(map.getOrDefault(key, \"x\")); } catch(...) { return -1; }`",
    ],
    referenceProgram: {
      title: "Singleton ConfigRegistry",
      description: "Singleton + overloaded set methods + type-detecting input parsing.",
      code: `import java.util.*;
class ConfigRegistry {
    private static ConfigRegistry instance;
    private Map<String, String> map = new HashMap<>();
    private ConfigRegistry() {}
    static ConfigRegistry getInstance() {
        if (instance == null) instance = new ConfigRegistry();
        return instance;
    }
    void set(String key, String value)  { map.put(key, value); }
    void set(String key, int value)     { map.put(key, String.valueOf(value)); }
    void set(String key, boolean value) { map.put(key, String.valueOf(value)); }
    String get(String key)     { return map.getOrDefault(key, "NOT_FOUND"); }
    int getInt(String key)     { try { return Integer.parseInt(map.getOrDefault(key, "x")); } catch (Exception e) { return -1; } }
    boolean getBoolean(String key) { return Boolean.parseBoolean(map.getOrDefault(key, "false")); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        ConfigRegistry cfg = ConfigRegistry.getInstance();
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ", 3);
            String cmd = parts[0];
            if (cmd.equals("set")) {
                String key = parts[1], val = parts[2];
                try { cfg.set(key, Integer.parseInt(val)); }
                catch (NumberFormatException e1) {
                    if (val.equals("true") || val.equals("false")) cfg.set(key, Boolean.parseBoolean(val));
                    else cfg.set(key, val);
                }
            } else if (cmd.equals("get")) System.out.println(cfg.get(parts[1]));
            else if (cmd.equals("getInt")) System.out.println(cfg.getInt(parts[1]));
            else if (cmd.equals("getBoolean")) System.out.println(cfg.getBoolean(parts[1]));
        }
    }
}`,
    },
    starterCode: `import java.util.*;
class ConfigRegistry {
    private static ConfigRegistry instance;
    private Map<String, String> map = new HashMap<>();
    private ConfigRegistry() {}
    // TODO: getInstance() singleton
    // TODO: overloaded set(key, String), set(key, int), set(key, boolean)
    // TODO: get(), getInt(), getBoolean()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        ConfigRegistry cfg = ConfigRegistry.getInstance();
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ", 3);
            // TODO: dispatch set/get/getInt/getBoolean
        }
    }
}`,
    solution: `import java.util.*;
class ConfigRegistry {
    private static ConfigRegistry instance;
    private Map<String, String> map = new HashMap<>();
    private ConfigRegistry() {}
    static ConfigRegistry getInstance() {
        if (instance == null) instance = new ConfigRegistry();
        return instance;
    }
    void set(String key, String value)  { map.put(key, value); }
    void set(String key, int value)     { map.put(key, String.valueOf(value)); }
    void set(String key, boolean value) { map.put(key, String.valueOf(value)); }
    String get(String key)     { return map.getOrDefault(key, "NOT_FOUND"); }
    int getInt(String key)     { try { return Integer.parseInt(map.getOrDefault(key, "x")); } catch (Exception e) { return -1; } }
    boolean getBoolean(String key) { return Boolean.parseBoolean(map.getOrDefault(key, "false")); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        ConfigRegistry cfg = ConfigRegistry.getInstance();
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split(" ", 3);
            String cmd = parts[0];
            if (cmd.equals("set")) {
                String key = parts[1], val = parts[2];
                try { cfg.set(key, Integer.parseInt(val)); }
                catch (NumberFormatException e1) {
                    if (val.equals("true") || val.equals("false")) cfg.set(key, Boolean.parseBoolean(val));
                    else cfg.set(key, val);
                }
            } else if (cmd.equals("get")) System.out.println(cfg.get(parts[1]));
            else if (cmd.equals("getInt")) System.out.println(cfg.getInt(parts[1]));
            else if (cmd.equals("getBoolean")) System.out.println(cfg.getBoolean(parts[1]));
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_H1_T1",
        label: "set and get all types",
        mockInputs: ["7", "set port 8080", "set debug true", "set name MyApp", "get name", "getInt port", "getBoolean debug", "get missing"],
        expectedOutput: "MyApp\n8080\ntrue\nNOT_FOUND",
      },
      {
        id: "JCH08_H1_T2",
        label: "Missing key defaults",
        mockInputs: ["2", "getInt nokey", "getBoolean nokey"],
        expectedOutput: "-1\nfalse",
        isBoundary: true,
      },
      {
        id: "JCH08_H1_T3",
        label: "Overwrite key",
        mockInputs: ["4", "set x 10", "set x 20", "getInt x", "get x"],
        expectedOutput: "20\n20",
      },
      {
        id: "JCH08_H1_T4",
        label: "Boolean false stored",
        mockInputs: ["3", "set active false", "getBoolean active", "get active"],
        expectedOutput: "false\nfalse",
        isHidden: true,
      },
    ],
    concepts: ["singleton pattern", "overloading", "HashMap", "type detection", "private constructor"],
    xpReward: 400,
    estimatedMinutes: 35,
    designChallenge: "Add a `remove(String key)` method and a `reset()` method that clears all config. Add `getOrDefault(String key, String fallback)` that returns fallback if key absent.",
  },

  {
    id: "JCH08_H2",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "hackathon",
    tierIndex: 1,
    title: "Event Scheduler",
    emoji: "📅",
    tagline: "Build an event scheduling system with flexible constructor overloads and conflict detection.",
    problemStatement:
      "Create an `Event` class with:\n- `title` (String), `startHour` (int), `endHour` (int), `location` (String, default \"TBD\"), `priority` (int, default 1).\n\nConstructors (chain with this()):\n- `Event(String title, int startHour, int endHour)`\n- `Event(String title, int startHour, int endHour, String location)`\n- `Event(String title, int startHour, int endHour, String location, int priority)`\n\nConstruct throws `IllegalArgumentException(\"Invalid time\")` if endHour <= startHour or either is outside [0,23].\n\nCreate an `EventScheduler` that holds a list of events and supports:\n- `ADD <numArgs> <title> <start> <end> [location] [priority]` — add event (print `Added: <title>` or `Error: <msg>`)\n- `LIST` — print all events sorted by startHour: `<title> <start>-<end> @<location> P<priority>`\n- `CONFLICTS` — print pairs of conflicting events (overlap): `<title1> vs <title2>`",
    inputFormat: "Line 1: N\nLines 2..N+1: commands",
    outputFormat: "Output per command as described",
    examples: [
      {
        input: "5\nADD 3 Standup 9 10\nADD 4 Planning 10 11 BoardRoom\nADD 5 Review 9 11 Lab 2\nLIST\nCONFLICTS",
        output: "Added: Standup\nAdded: Planning\nAdded: Review\nStandup 9-10 @TBD P1\nReview 9-11 @Lab P2\nPlanning 10-11 @BoardRoom P1\nStandup vs Review\nReview vs Planning",
      },
    ],
    constraints: ["0 <= start < end <= 23", "1 <= N <= 20", "Priority 1-5"],
    hints: [
      "Chain: `Event(String t, int s, int e) { this(t, s, e, \"TBD\"); }`",
      "Validation in the 5-arg constructor; others delegate to it via this().",
      "Conflict: two events conflict if `a.startHour < b.endHour && b.startHour < a.endHour`.",
      "Sort with `events.sort((a, b) -> a.startHour - b.startHour);`",
      "For CONFLICTS, use a nested loop over all pairs.",
    ],
    referenceProgram: {
      title: "EventScheduler with Overloaded Constructors",
      description: "Constructor chaining + validation + scheduling logic.",
      code: `import java.util.*;
class Event {
    String title, location;
    int startHour, endHour, priority;
    Event(String title, int s, int e) { this(title, s, e, "TBD"); }
    Event(String title, int s, int e, String loc) { this(title, s, e, loc, 1); }
    Event(String title, int s, int e, String loc, int pri) {
        if (s < 0 || e > 23 || e <= s) throw new IllegalArgumentException("Invalid time");
        this.title = title; this.startHour = s; this.endHour = e; this.location = loc; this.priority = pri;
    }
}
class EventScheduler {
    List<Event> events = new ArrayList<>();
    void add(Event e) { events.add(e); }
    void list() {
        events.sort((a, b) -> a.startHour - b.startHour);
        for (Event e : events)
            System.out.println(e.title + " " + e.startHour + "-" + e.endHour + " @" + e.location + " P" + e.priority);
    }
    void conflicts() {
        for (int i = 0; i < events.size(); i++)
            for (int j = i+1; j < events.size(); j++) {
                Event a = events.get(i), b = events.get(j);
                if (a.startHour < b.endHour && b.startHour < a.endHour)
                    System.out.println(a.title + " vs " + b.title);
            }
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        EventScheduler sched = new EventScheduler();
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("ADD")) {
                int na = Integer.parseInt(p[1]);
                try {
                    Event e;
                    if (na == 3) e = new Event(p[2], Integer.parseInt(p[3]), Integer.parseInt(p[4]));
                    else if (na == 4) e = new Event(p[2], Integer.parseInt(p[3]), Integer.parseInt(p[4]), p[5]);
                    else e = new Event(p[2], Integer.parseInt(p[3]), Integer.parseInt(p[4]), p[5], Integer.parseInt(p[6]));
                    sched.add(e); System.out.println("Added: " + e.title);
                } catch (IllegalArgumentException ex) { System.out.println("Error: " + ex.getMessage()); }
            } else if (p[0].equals("LIST")) sched.list();
            else if (p[0].equals("CONFLICTS")) sched.conflicts();
        }
    }
}`,
    },
    starterCode: `import java.util.*;
class Event {
    String title, location;
    int startHour, endHour, priority;
    // TODO: Event(String title, int s, int e) — chain
    // TODO: Event(String title, int s, int e, String loc) — chain
    // TODO: Event(String title, int s, int e, String loc, int pri) — validate & assign
}
class EventScheduler {
    List<Event> events = new ArrayList<>();
    void add(Event e) { events.add(e); }
    void list() { /* TODO: sort by startHour, print each */ }
    void conflicts() { /* TODO: find overlapping pairs */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        EventScheduler sched = new EventScheduler();
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            // TODO: dispatch ADD / LIST / CONFLICTS
        }
    }
}`,
    solution: `import java.util.*;
class Event {
    String title, location;
    int startHour, endHour, priority;
    Event(String title, int s, int e) { this(title, s, e, "TBD"); }
    Event(String title, int s, int e, String loc) { this(title, s, e, loc, 1); }
    Event(String title, int s, int e, String loc, int pri) {
        if (s < 0 || e > 23 || e <= s) throw new IllegalArgumentException("Invalid time");
        this.title = title; this.startHour = s; this.endHour = e; this.location = loc; this.priority = pri;
    }
}
class EventScheduler {
    List<Event> events = new ArrayList<>();
    void add(Event e) { events.add(e); }
    void list() {
        events.sort((a, b) -> a.startHour - b.startHour);
        for (Event e : events)
            System.out.println(e.title + " " + e.startHour + "-" + e.endHour + " @" + e.location + " P" + e.priority);
    }
    void conflicts() {
        for (int i = 0; i < events.size(); i++)
            for (int j = i+1; j < events.size(); j++) {
                Event a = events.get(i), b = events.get(j);
                if (a.startHour < b.endHour && b.startHour < a.endHour)
                    System.out.println(a.title + " vs " + b.title);
            }
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        EventScheduler sched = new EventScheduler();
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("ADD")) {
                int na = Integer.parseInt(p[1]);
                try {
                    Event e;
                    if (na == 3) e = new Event(p[2], Integer.parseInt(p[3]), Integer.parseInt(p[4]));
                    else if (na == 4) e = new Event(p[2], Integer.parseInt(p[3]), Integer.parseInt(p[4]), p[5]);
                    else e = new Event(p[2], Integer.parseInt(p[3]), Integer.parseInt(p[4]), p[5], Integer.parseInt(p[6]));
                    sched.add(e); System.out.println("Added: " + e.title);
                } catch (IllegalArgumentException ex) { System.out.println("Error: " + ex.getMessage()); }
            } else if (p[0].equals("LIST")) sched.list();
            else if (p[0].equals("CONFLICTS")) sched.conflicts();
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_H2_T1",
        label: "3 events, list+conflicts",
        mockInputs: ["5", "ADD 3 Standup 9 10", "ADD 4 Planning 10 11 BoardRoom", "ADD 5 Review 9 11 Lab 2", "LIST", "CONFLICTS"],
        expectedOutput: "Added: Standup\nAdded: Planning\nAdded: Review\nStandup 9-10 @TBD P1\nReview 9-11 @Lab P2\nPlanning 10-11 @BoardRoom P1\nStandup vs Review\nReview vs Planning",
      },
      {
        id: "JCH08_H2_T2",
        label: "Invalid time throws",
        mockInputs: ["2", "ADD 3 Bad 10 9", "ADD 3 Good 8 9"],
        expectedOutput: "Error: Invalid time\nAdded: Good",
        isBoundary: true,
      },
      {
        id: "JCH08_H2_T3",
        label: "No conflicts",
        mockInputs: ["4", "ADD 3 Yoga 6 7", "ADD 3 Breakfast 7 8", "CONFLICTS", "LIST"],
        expectedOutput: "Yoga 6-7 @TBD P1\nBreakfast 7-8 @TBD P1",
      },
      {
        id: "JCH08_H2_T4",
        label: "Priority sorting",
        mockInputs: ["4", "ADD 5 MeetingA 9 10 RoomA 3", "ADD 5 MeetingB 9 10 RoomB 5", "LIST", "CONFLICTS"],
        expectedOutput: "MeetingA 9-10 @RoomA P3\nMeetingB 9-10 @RoomB P5\nMeetingA vs MeetingB",
        isHidden: true,
      },
    ],
    concepts: ["constructor chaining", "this()", "validation", "sorting", "conflict detection"],
    xpReward: 400,
    estimatedMinutes: 40,
    designChallenge: "Add a `CANCEL <title>` command that removes an event. Add a `SUGGEST <duration>` command that finds the first free time slot of the given duration (in hours).",
  },

  {
    id: "JCH08_H3",
    chapterId: "JCH08_CONSTRUCT",
    chapterNumber: 8,
    tier: "hackathon",
    tierIndex: 2,
    title: "Inventory System",
    emoji: "🏪",
    tagline: "Design a multi-constructor inventory system with variant products.",
    problemStatement:
      "Build an inventory system with a `Product` class hierarchy using constructor overloading:\n\n`Product(String sku, String name, double price)` — base product.\n`Product(String sku, String name, double price, int stock)` — product with stock count.\n`Product(String sku, String name, double price, int stock, double discountPct)` — with discount.\n\nAll constructors chain. discountPct default 0.0, stock default 0.\n\nValidation in 5-arg constructor:\n- price > 0, else throw `IllegalArgumentException(\"Invalid price\")`\n- stock >= 0, else throw `IllegalArgumentException(\"Invalid stock\")`\n- 0 <= discountPct < 100, else throw `IllegalArgumentException(\"Invalid discount\")`\n\nMethods:\n- `effectivePrice()` — price * (1 - discountPct/100), rounded to 2 dp\n- `isInStock()` — stock > 0\n\nInventory supports:\n- `ADD <numArgs> <sku> <name> <price> [stock] [discountPct]`\n- `QUERY <sku>` — prints `<name> SKU:<sku> Price:<effectivePrice> Stock:<stock> InStock:<bool>`\n- `RESTOCK <sku> <qty>` — adds qty to stock\n- `SELL <sku> <qty>` — reduces stock (print `Error: insufficient stock` if not enough)\n- `DISCOUNT <sku> <pct>` — updates discountPct",
    inputFormat: "Line 1: N\nLines 2..N+1: commands",
    outputFormat: "Output per QUERY or error messages",
    examples: [
      {
        input: "7\nADD 3 SKU01 Laptop 50000.0\nADD 5 SKU02 Mouse 500.0 100 10.0\nRESTOCK SKU01 5\nSELL SKU01 2\nQUERY SKU01\nQUERY SKU02\nSELL SKU02 200",
        output: "Laptop SKU:SKU01 Price:50000.00 Stock:3 InStock:true\nMouse SKU:SKU02 Price:450.00 Stock:100 InStock:true\nError: insufficient stock",
      },
    ],
    constraints: ["1 <= N <= 25", "qty > 0"],
    hints: [
      "Chain: `Product(sku, name, price)` → `this(sku, name, price, 0)` → `this(sku, name, price, 0, 0.0)`",
      "Store products in a `HashMap<String, Product>`.",
      "For SELL, check `p.stock >= qty` before reducing.",
      "effectivePrice: `Math.round(price * (1 - discountPct / 100) * 100.0) / 100.0`",
      "DISCOUNT command modifies the existing product's discountPct field directly.",
    ],
    referenceProgram: {
      title: "Product Inventory with Constructor Chain",
      description: "Full inventory CRUD using overloaded constructors and a HashMap store.",
      code: `import java.util.*;
class Product {
    String sku, name;
    double price, discountPct;
    int stock;
    Product(String sku, String name, double price) { this(sku, name, price, 0); }
    Product(String sku, String name, double price, int stock) { this(sku, name, price, stock, 0.0); }
    Product(String sku, String name, double price, int stock, double discountPct) {
        if (price <= 0) throw new IllegalArgumentException("Invalid price");
        if (stock < 0)  throw new IllegalArgumentException("Invalid stock");
        if (discountPct < 0 || discountPct >= 100) throw new IllegalArgumentException("Invalid discount");
        this.sku = sku; this.name = name; this.price = price; this.stock = stock; this.discountPct = discountPct;
    }
    double effectivePrice() { return Math.round(price * (1 - discountPct / 100) * 100.0) / 100.0; }
    boolean isInStock() { return stock > 0; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Map<String, Product> inv = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            try {
                switch (p[0]) {
                    case "ADD": {
                        int na = Integer.parseInt(p[1]);
                        Product prod;
                        if (na == 3) prod = new Product(p[2], p[3], Double.parseDouble(p[4]));
                        else if (na == 4) prod = new Product(p[2], p[3], Double.parseDouble(p[4]), Integer.parseInt(p[5]));
                        else prod = new Product(p[2], p[3], Double.parseDouble(p[4]), Integer.parseInt(p[5]), Double.parseDouble(p[6]));
                        inv.put(prod.sku, prod); break;
                    }
                    case "QUERY": {
                        Product prod = inv.get(p[1]);
                        System.out.printf("%s SKU:%s Price:%.2f Stock:%d InStock:%b%n",
                            prod.name, prod.sku, prod.effectivePrice(), prod.stock, prod.isInStock()); break;
                    }
                    case "RESTOCK": inv.get(p[1]).stock += Integer.parseInt(p[2]); break;
                    case "SELL": {
                        Product prod = inv.get(p[1]); int qty = Integer.parseInt(p[2]);
                        if (prod.stock < qty) System.out.println("Error: insufficient stock");
                        else prod.stock -= qty; break;
                    }
                    case "DISCOUNT": inv.get(p[1]).discountPct = Double.parseDouble(p[2]); break;
                }
            } catch (IllegalArgumentException e) { System.out.println("Error: " + e.getMessage()); }
        }
    }
}`,
    },
    starterCode: `import java.util.*;
class Product {
    String sku, name;
    double price, discountPct;
    int stock;
    // TODO: 3-arg constructor → chain to 4-arg
    // TODO: 4-arg constructor → chain to 5-arg
    // TODO: 5-arg constructor → validate and assign all fields
    double effectivePrice() { return 0; /* TODO */ }
    boolean isInStock() { return false; /* TODO */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Map<String, Product> inv = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            // TODO: dispatch ADD/QUERY/RESTOCK/SELL/DISCOUNT
        }
    }
}`,
    solution: `import java.util.*;
class Product {
    String sku, name;
    double price, discountPct;
    int stock;
    Product(String sku, String name, double price) { this(sku, name, price, 0); }
    Product(String sku, String name, double price, int stock) { this(sku, name, price, stock, 0.0); }
    Product(String sku, String name, double price, int stock, double discountPct) {
        if (price <= 0) throw new IllegalArgumentException("Invalid price");
        if (stock < 0)  throw new IllegalArgumentException("Invalid stock");
        if (discountPct < 0 || discountPct >= 100) throw new IllegalArgumentException("Invalid discount");
        this.sku = sku; this.name = name; this.price = price; this.stock = stock; this.discountPct = discountPct;
    }
    double effectivePrice() { return Math.round(price * (1 - discountPct / 100) * 100.0) / 100.0; }
    boolean isInStock() { return stock > 0; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Map<String, Product> inv = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            try {
                switch (p[0]) {
                    case "ADD": {
                        int na = Integer.parseInt(p[1]);
                        Product prod;
                        if (na == 3) prod = new Product(p[2], p[3], Double.parseDouble(p[4]));
                        else if (na == 4) prod = new Product(p[2], p[3], Double.parseDouble(p[4]), Integer.parseInt(p[5]));
                        else prod = new Product(p[2], p[3], Double.parseDouble(p[4]), Integer.parseInt(p[5]), Double.parseDouble(p[6]));
                        inv.put(prod.sku, prod); break;
                    }
                    case "QUERY": {
                        Product prod = inv.get(p[1]);
                        System.out.printf("%s SKU:%s Price:%.2f Stock:%d InStock:%b%n",
                            prod.name, prod.sku, prod.effectivePrice(), prod.stock, prod.isInStock()); break;
                    }
                    case "RESTOCK": inv.get(p[1]).stock += Integer.parseInt(p[2]); break;
                    case "SELL": {
                        Product prod = inv.get(p[1]); int qty = Integer.parseInt(p[2]);
                        if (prod.stock < qty) System.out.println("Error: insufficient stock");
                        else prod.stock -= qty; break;
                    }
                    case "DISCOUNT": inv.get(p[1]).discountPct = Double.parseDouble(p[2]); break;
                }
            } catch (IllegalArgumentException e) { System.out.println("Error: " + e.getMessage()); }
        }
    }
}`,
    testCases: [
      {
        id: "JCH08_H3_T1",
        label: "Full workflow",
        mockInputs: ["7", "ADD 3 SKU01 Laptop 50000.0", "ADD 5 SKU02 Mouse 500.0 100 10.0", "RESTOCK SKU01 5", "SELL SKU01 2", "QUERY SKU01", "QUERY SKU02", "SELL SKU02 200"],
        expectedOutput: "Laptop SKU:SKU01 Price:50000.00 Stock:3 InStock:true\nMouse SKU:SKU02 Price:450.00 Stock:100 InStock:true\nError: insufficient stock",
      },
      {
        id: "JCH08_H3_T2",
        label: "Invalid price",
        mockInputs: ["1", "ADD 3 SKU99 BadProduct -100.0"],
        expectedOutput: "Error: Invalid price",
        isBoundary: true,
      },
      {
        id: "JCH08_H3_T3",
        label: "Discount updates price",
        mockInputs: ["4", "ADD 4 SKU10 Keyboard 1000.0 50", "DISCOUNT SKU10 20.0", "QUERY SKU10"],
        expectedOutput: "Keyboard SKU:SKU10 Price:800.00 Stock:50 InStock:true",
      },
      {
        id: "JCH08_H3_T4",
        label: "Sell to zero then query",
        mockInputs: ["4", "ADD 4 SKU20 Pen 10.0 3", "SELL SKU20 3", "QUERY SKU20"],
        expectedOutput: "Pen SKU:SKU20 Price:10.00 Stock:0 InStock:false",
        isHidden: true,
      },
    ],
    concepts: ["constructor chaining", "validation", "HashMap", "inventory CRUD", "discounts"],
    xpReward: 400,
    estimatedMinutes: 45,
    designChallenge: "Add a `REPORT` command that prints all products sorted by effectivePrice descending, showing only in-stock items. Add a `BUNDLE <sku1> <sku2> <bundleSku> <bundleName> <bundleDiscount>` command that creates a new product at the combined price minus the bundle discount.",
  },
];
