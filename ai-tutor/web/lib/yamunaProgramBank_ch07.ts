import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH07_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH07_B1",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "beginner",
    tierIndex: 0,
    title: "Dog Class",
    emoji: "🐕",
    tagline: "Create a Dog class with name and breed fields.",
    problemStatement:
      "Define a class Dog with two String fields: name and breed. Read one dog's details and print: '<name> is a <breed>'.",
    inputFormat: "Line 1: dog name\nLine 2: breed",
    outputFormat: "One line: '<name> is a <breed>'",
    examples: [
      { input: "Buddy\nLabrador", output: "Buddy is a Labrador" },
      { input: "Max\nGerman Shepherd", output: "Max is a German Shepherd" },
    ],
    constraints: ["Name and breed contain only letters and spaces"],
    hints: [
      "Define the Dog class outside Main (in the same file).",
      "Add a constructor: Dog(String name, String breed).",
      "Store the values in the fields.",
      "Use System.out.println(d.name + \" is a \" + d.breed) or override toString.",
    ],
    referenceProgram: {
      title: "Dog Class with Constructor",
      description: "Simple class with two String fields and a toString override.",
      code: `import java.util.Scanner;
class Dog {
    String name, breed;
    Dog(String n, String b) { name = n; breed = b; }
    public String toString() { return name + " is a " + breed; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Dog d = new Dog(sc.nextLine(), sc.nextLine());
        System.out.println(d);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Dog {
    String name;
    String breed;
    // TODO: add a constructor that sets name and breed
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read name and breed, create a Dog, print it
    }
}`,
    solution: `import java.util.Scanner;
class Dog {
    String name, breed;
    Dog(String n, String b) { name = n; breed = b; }
    public String toString() { return name + " is a " + breed; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Dog d = new Dog(sc.nextLine(), sc.nextLine());
        System.out.println(d);
    }
}`,
    testCases: [
      { id: "JCH07_B1_T1", label: "Buddy Labrador", mockInputs: ["Buddy", "Labrador"], expectedOutput: "Buddy is a Labrador" },
      { id: "JCH07_B1_T2", label: "Max German Shepherd", mockInputs: ["Max", "German Shepherd"], expectedOutput: "Max is a German Shepherd" },
      { id: "JCH07_B1_T3", label: "Rex Poodle", mockInputs: ["Rex", "Poodle"], expectedOutput: "Rex is a Poodle", isBoundary: true },
    ],
    concepts: ["class", "fields", "constructor", "toString"],
    xpReward: 50,
    estimatedMinutes: 10,
  },

  {
    id: "JCH07_B2",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "beginner",
    tierIndex: 1,
    title: "Rectangle Area and Perimeter",
    emoji: "📐",
    tagline: "Model a Rectangle class and compute its area and perimeter.",
    problemStatement:
      "Define a class Rectangle with int fields width and height. Read width and height, create a Rectangle object, then print:\nLine 1: 'Area: <area>'\nLine 2: 'Perimeter: <perimeter>'",
    inputFormat: "Line 1: width (integer)\nLine 2: height (integer)",
    outputFormat: "Line 1: 'Area: <w*h>'\nLine 2: 'Perimeter: <2*(w+h)>'",
    examples: [
      { input: "5\n3", output: "Area: 15\nPerimeter: 16" },
      { input: "4\n4", output: "Area: 16\nPerimeter: 16" },
    ],
    constraints: ["1 ≤ width, height ≤ 10000"],
    hints: [
      "Define Rectangle outside Main with fields width and height.",
      "Add a constructor Rectangle(int w, int h).",
      "Area = width * height; Perimeter = 2 * (width + height).",
      "Add methods int area() and int perimeter() to the class.",
    ],
    referenceProgram: {
      title: "Rectangle with area/perimeter methods",
      description: "Class with two int fields and two methods.",
      code: `import java.util.Scanner;
class Rectangle {
    int width, height;
    Rectangle(int w, int h) { width = w; height = h; }
    int area() { return width * height; }
    int perimeter() { return 2 * (width + height); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rectangle r = new Rectangle(sc.nextInt(), sc.nextInt());
        System.out.println("Area: " + r.area());
        System.out.println("Perimeter: " + r.perimeter());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Rectangle {
    int width, height;
    // TODO: add constructor and area/perimeter methods
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int w = sc.nextInt(), h = sc.nextInt();
        // TODO: create Rectangle, print area and perimeter
    }
}`,
    solution: `import java.util.Scanner;
class Rectangle {
    int width, height;
    Rectangle(int w, int h) { width = w; height = h; }
    int area() { return width * height; }
    int perimeter() { return 2 * (width + height); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rectangle r = new Rectangle(sc.nextInt(), sc.nextInt());
        System.out.println("Area: " + r.area());
        System.out.println("Perimeter: " + r.perimeter());
    }
}`,
    testCases: [
      { id: "JCH07_B2_T1", label: "5x3", mockInputs: ["5", "3"], expectedOutput: "Area: 15\nPerimeter: 16" },
      { id: "JCH07_B2_T2", label: "Square 4x4", mockInputs: ["4", "4"], expectedOutput: "Area: 16\nPerimeter: 16" },
      { id: "JCH07_B2_T3", label: "1x1 boundary", mockInputs: ["1", "1"], expectedOutput: "Area: 1\nPerimeter: 4", isBoundary: true },
      { id: "JCH07_B2_T4", label: "Wide rectangle", mockInputs: ["10", "2"], expectedOutput: "Area: 20\nPerimeter: 24", isHidden: true },
    ],
    concepts: ["class", "fields", "methods", "constructor"],
    xpReward: 55,
    estimatedMinutes: 10,
  },

  {
    id: "JCH07_B3",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "beginner",
    tierIndex: 2,
    title: "Student Grade Card",
    emoji: "📋",
    tagline: "Create a Student class and print a formatted grade card.",
    problemStatement:
      "Define a class Student with fields name (String), marks (int), and grade (char). Read name and marks, compute grade (marks >= 90 → 'A', >= 75 → 'B', >= 60 → 'C', >= 40 → 'D', else 'F'), and print:\n'Name: <name>'\n'Marks: <marks>'\n'Grade: <grade>'",
    inputFormat: "Line 1: student name\nLine 2: marks (integer 0-100)",
    outputFormat: "Three lines as described.",
    examples: [
      { input: "Alice\n92", output: "Name: Alice\nMarks: 92\nGrade: A" },
      { input: "Bob\n73", output: "Name: Bob\nMarks: 73\nGrade: C" },
    ],
    constraints: ["0 ≤ marks ≤ 100"],
    hints: [
      "Define Student with fields: String name; int marks; char grade;",
      "In the constructor, compute grade with an if-else chain.",
      "if (m >= 90) grade = 'A'; else if (m >= 75) grade = 'B'; ...",
      "Call System.out.println for each of the three output lines.",
    ],
    referenceProgram: {
      title: "Student Grade Card",
      description: "Class with grade computation in constructor.",
      code: `import java.util.Scanner;
class Student {
    String name;
    int marks;
    char grade;
    Student(String n, int m) {
        name = n; marks = m;
        if (m >= 90) grade = 'A';
        else if (m >= 75) grade = 'B';
        else if (m >= 60) grade = 'C';
        else if (m >= 40) grade = 'D';
        else grade = 'F';
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int marks = sc.nextInt();
        Student s = new Student(name, marks);
        System.out.println("Name: " + s.name);
        System.out.println("Marks: " + s.marks);
        System.out.println("Grade: " + s.grade);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Student {
    String name;
    int marks;
    char grade;
    // TODO: add constructor that sets name, marks, and computes grade
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int marks = sc.nextInt();
        // TODO: create Student and print Name, Marks, Grade
    }
}`,
    solution: `import java.util.Scanner;
class Student {
    String name;
    int marks;
    char grade;
    Student(String n, int m) {
        name = n; marks = m;
        if (m >= 90) grade = 'A';
        else if (m >= 75) grade = 'B';
        else if (m >= 60) grade = 'C';
        else if (m >= 40) grade = 'D';
        else grade = 'F';
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int marks = sc.nextInt();
        Student s = new Student(name, marks);
        System.out.println("Name: " + s.name);
        System.out.println("Marks: " + s.marks);
        System.out.println("Grade: " + s.grade);
    }
}`,
    testCases: [
      { id: "JCH07_B3_T1", label: "A grade", mockInputs: ["Alice", "92"], expectedOutput: "Name: Alice\nMarks: 92\nGrade: A" },
      { id: "JCH07_B3_T2", label: "C grade", mockInputs: ["Bob", "73"], expectedOutput: "Name: Bob\nMarks: 73\nGrade: C" },
      { id: "JCH07_B3_T3", label: "F grade", mockInputs: ["Charlie", "35"], expectedOutput: "Name: Charlie\nMarks: 35\nGrade: F", isBoundary: true },
      { id: "JCH07_B3_T4", label: "D boundary (40)", mockInputs: ["Diana", "40"], expectedOutput: "Name: Diana\nMarks: 40\nGrade: D", isHidden: true },
    ],
    concepts: ["class", "fields", "if-else", "char", "constructor"],
    xpReward: 65,
    estimatedMinutes: 12,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH07_I1",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "intermediate",
    tierIndex: 0,
    title: "Car Fleet",
    emoji: "🚗",
    tagline: "Create multiple Car objects and find the fastest.",
    problemStatement:
      "Define a class Car with fields make (String) and topSpeed (int). Read N cars (make on one line, topSpeed on the next), then print the make of the car with the highest topSpeed. If there is a tie, print the one read first.",
    inputFormat: "Line 1: N (1 ≤ N ≤ 100)\nNext N pairs of lines: make then topSpeed",
    outputFormat: "One line: 'Fastest: <make>'",
    examples: [
      { input: "3\nToyota\n180\nBMW\n240\nHonda\n200", output: "Fastest: BMW" },
      { input: "2\nFord\n160\nFord\n160", output: "Fastest: Ford" },
    ],
    constraints: ["1 ≤ N ≤ 100", "1 ≤ topSpeed ≤ 500"],
    hints: [
      "Create Car[] cars = new Car[n];",
      "Read make with sc.nextLine() and topSpeed with sc.nextInt(); then call sc.nextLine() to consume the newline.",
      "Track the index of the maximum speed as you go.",
      "Print 'Fastest: ' + cars[maxIdx].make.",
    ],
    referenceProgram: {
      title: "Car Fleet Fastest",
      description: "Array of Car objects; linear scan for max speed.",
      code: `import java.util.Scanner;
class Car {
    String make;
    int topSpeed;
    Car(String m, int s) { make = m; topSpeed = s; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        Car[] cars = new Car[n];
        for (int i = 0; i < n; i++) {
            String make = sc.nextLine();
            int speed = sc.nextInt(); sc.nextLine();
            cars[i] = new Car(make, speed);
        }
        int maxIdx = 0;
        for (int i = 1; i < n; i++)
            if (cars[i].topSpeed > cars[maxIdx].topSpeed) maxIdx = i;
        System.out.println("Fastest: " + cars[maxIdx].make);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Car {
    String make;
    int topSpeed;
    // TODO: add constructor
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        Car[] cars = new Car[n];
        for (int i = 0; i < n; i++) {
            String make = sc.nextLine();
            int speed = sc.nextInt(); sc.nextLine();
            // TODO: create Car and store in cars[i]
        }
        // TODO: find and print the fastest car's make
    }
}`,
    solution: `import java.util.Scanner;
class Car {
    String make;
    int topSpeed;
    Car(String m, int s) { make = m; topSpeed = s; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        Car[] cars = new Car[n];
        for (int i = 0; i < n; i++) {
            String make = sc.nextLine();
            int speed = sc.nextInt(); sc.nextLine();
            cars[i] = new Car(make, speed);
        }
        int maxIdx = 0;
        for (int i = 1; i < n; i++)
            if (cars[i].topSpeed > cars[maxIdx].topSpeed) maxIdx = i;
        System.out.println("Fastest: " + cars[maxIdx].make);
    }
}`,
    testCases: [
      { id: "JCH07_I1_T1", label: "3 cars", mockInputs: ["3", "Toyota", "180", "BMW", "240", "Honda", "200"], expectedOutput: "Fastest: BMW" },
      { id: "JCH07_I1_T2", label: "Tie — first wins", mockInputs: ["2", "Ford", "160", "Ford", "160"], expectedOutput: "Fastest: Ford", isBoundary: true },
      { id: "JCH07_I1_T3", label: "Single car", mockInputs: ["1", "Tesla", "250"], expectedOutput: "Fastest: Tesla", isBoundary: true },
      { id: "JCH07_I1_T4", label: "Last is fastest", mockInputs: ["3", "A", "100", "B", "120", "C", "300"], expectedOutput: "Fastest: C", isHidden: true },
    ],
    concepts: ["object array", "linear scan", "nextLine after nextInt", "class fields"],
    xpReward: 100,
    estimatedMinutes: 15,
  },

  {
    id: "JCH07_I2",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "intermediate",
    tierIndex: 1,
    title: "Counter with Static Member",
    emoji: "🔢",
    tagline: "Use a static field to count how many objects have been created.",
    problemStatement:
      "Define a class Counter with a static int field totalCreated and an instance int field id. Each time a Counter is constructed, id is set to the next sequential value (starting from 1) and totalCreated increments.\nRead N, create N Counter objects, print 'Counter <id>' for each, then print 'Total: <totalCreated>'.",
    inputFormat: "One line: integer N (1 ≤ N ≤ 20)",
    outputFormat: "N lines: 'Counter <id>'\nLast line: 'Total: <N>'",
    examples: [
      { input: "3", output: "Counter 1\nCounter 2\nCounter 3\nTotal: 3" },
      { input: "1", output: "Counter 1\nTotal: 1" },
    ],
    constraints: ["1 ≤ N ≤ 20"],
    hints: [
      "Declare static int totalCreated = 0; inside Counter.",
      "In the constructor: totalCreated++; id = totalCreated;",
      "Static fields belong to the class, not individual objects.",
      "Access via Counter.totalCreated after creating objects.",
    ],
    referenceProgram: {
      title: "Static Counter",
      description: "Static field incremented in constructor to track instance count.",
      code: `import java.util.Scanner;
class Counter {
    static int totalCreated = 0;
    int id;
    Counter() { totalCreated++; id = totalCreated; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Counter[] counters = new Counter[n];
        for (int i = 0; i < n; i++) counters[i] = new Counter();
        for (Counter c : counters) System.out.println("Counter " + c.id);
        System.out.println("Total: " + Counter.totalCreated);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Counter {
    static int totalCreated = 0;
    int id;
    Counter() {
        // TODO: increment totalCreated and assign id
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: create n Counters, print each id, then print Total
    }
}`,
    solution: `import java.util.Scanner;
class Counter {
    static int totalCreated = 0;
    int id;
    Counter() { totalCreated++; id = totalCreated; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Counter[] counters = new Counter[n];
        for (int i = 0; i < n; i++) counters[i] = new Counter();
        for (Counter c : counters) System.out.println("Counter " + c.id);
        System.out.println("Total: " + Counter.totalCreated);
    }
}`,
    testCases: [
      { id: "JCH07_I2_T1", label: "3 counters", mockInputs: ["3"], expectedOutput: "Counter 1\nCounter 2\nCounter 3\nTotal: 3" },
      { id: "JCH07_I2_T2", label: "1 counter", mockInputs: ["1"], expectedOutput: "Counter 1\nTotal: 1", isBoundary: true },
      { id: "JCH07_I2_T3", label: "5 counters", mockInputs: ["5"], expectedOutput: "Counter 1\nCounter 2\nCounter 3\nCounter 4\nCounter 5\nTotal: 5", isHidden: true },
    ],
    concepts: ["static field", "constructor", "instance vs class state"],
    xpReward: 110,
    estimatedMinutes: 15,
  },

  {
    id: "JCH07_I3",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "intermediate",
    tierIndex: 2,
    title: "Method Chaining Builder",
    emoji: "⛓️",
    tagline: "Return 'this' from setter methods to enable fluent chaining.",
    problemStatement:
      "Define a class Person with fields name (String), age (int), city (String). Each setter must return 'this' so calls can be chained: new Person().setName(\"Alice\").setAge(30).setCity(\"Delhi\").\nRead name, age, city and build the Person using method chaining. Print: '<name>, <age>, <city>'.",
    inputFormat: "Line 1: name\nLine 2: age (integer)\nLine 3: city",
    outputFormat: "One line: '<name>, <age>, <city>'",
    examples: [
      { input: "Alice\n30\nDelhi", output: "Alice, 30, Delhi" },
      { input: "Ravi\n22\nMumbai", output: "Ravi, 22, Mumbai" },
    ],
    constraints: ["1 ≤ age ≤ 120"],
    hints: [
      "Each setter returns Person: Person setName(String n) { name = n; return this; }",
      "The return type is Person, not void.",
      "Chain calls on one expression: new Person().setName(n).setAge(a).setCity(c)",
      "Override toString or print fields directly.",
    ],
    referenceProgram: {
      title: "Method Chaining via return this",
      description: "Setters return this to allow fluent chaining.",
      code: `import java.util.Scanner;
class Person {
    String name, city;
    int age;
    Person setName(String n) { name = n; return this; }
    Person setAge(int a) { age = a; return this; }
    Person setCity(String c) { city = c; return this; }
    public String toString() { return name + ", " + age + ", " + city; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = Integer.parseInt(sc.nextLine().trim());
        String city = sc.nextLine();
        System.out.println(new Person().setName(name).setAge(age).setCity(city));
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Person {
    String name, city;
    int age;
    // TODO: add setName(String), setAge(int), setCity(String) — each returns Person
    public String toString() { return name + ", " + age + ", " + city; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = Integer.parseInt(sc.nextLine().trim());
        String city = sc.nextLine();
        // TODO: build Person using method chaining and print
    }
}`,
    solution: `import java.util.Scanner;
class Person {
    String name, city;
    int age;
    Person setName(String n) { name = n; return this; }
    Person setAge(int a) { age = a; return this; }
    Person setCity(String c) { city = c; return this; }
    public String toString() { return name + ", " + age + ", " + city; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = Integer.parseInt(sc.nextLine().trim());
        String city = sc.nextLine();
        System.out.println(new Person().setName(name).setAge(age).setCity(city));
    }
}`,
    testCases: [
      { id: "JCH07_I3_T1", label: "Alice Delhi", mockInputs: ["Alice", "30", "Delhi"], expectedOutput: "Alice, 30, Delhi" },
      { id: "JCH07_I3_T2", label: "Ravi Mumbai", mockInputs: ["Ravi", "22", "Mumbai"], expectedOutput: "Ravi, 22, Mumbai" },
      { id: "JCH07_I3_T3", label: "Age 1 boundary", mockInputs: ["Baby", "1", "Chennai"], expectedOutput: "Baby, 1, Chennai", isBoundary: true },
      { id: "JCH07_I3_T4", label: "Name with space", mockInputs: ["John Doe", "45", "Pune"], expectedOutput: "John Doe, 45, Pune", isHidden: true },
    ],
    concepts: ["method chaining", "return this", "fluent API", "setters"],
    xpReward: 120,
    estimatedMinutes: 18,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH07_A1",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "advanced",
    tierIndex: 0,
    title: "Closest Point to Origin",
    emoji: "📍",
    tagline: "Define a Point class and find the point closest to the origin.",
    problemStatement:
      "Define a class Point with int fields x and y. Add a method double distanceToOrigin() returning Math.sqrt(x*x + y*y). Read N points and print the one closest to the origin as '(<x>, <y>)'. If there is a tie, print the one read first.",
    inputFormat: "Line 1: N (1 ≤ N ≤ 100)\nNext N lines: two integers x y (space-separated)",
    outputFormat: "One line: '(<x>, <y>)'",
    examples: [
      { input: "3\n3 4\n1 1\n0 5", output: "(1, 1)", explanation: "Distances: 5.0, ~1.41, 5.0. Closest is (1,1)." },
      { input: "1\n0 0", output: "(0, 0)" },
    ],
    constraints: ["-1000 ≤ x, y ≤ 1000", "1 ≤ N ≤ 100"],
    hints: [
      "Use Math.sqrt(x * x + y * y) for distance.",
      "Initialise closest = pts[0].",
      "Loop from i=1, update closest if pts[i].distanceToOrigin() < closest.distanceToOrigin().",
      "Print as \"(\" + p.x + \", \" + p.y + \")\".",
    ],
    referenceProgram: {
      title: "Closest Point to Origin",
      description: "Point class with distance method; linear scan for minimum.",
      code: `import java.util.Scanner;
class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
    double distanceToOrigin() { return Math.sqrt(x * x + y * y); }
    public String toString() { return "(" + x + ", " + y + ")"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Point[] pts = new Point[n];
        for (int i = 0; i < n; i++) pts[i] = new Point(sc.nextInt(), sc.nextInt());
        Point closest = pts[0];
        for (int i = 1; i < n; i++)
            if (pts[i].distanceToOrigin() < closest.distanceToOrigin()) closest = pts[i];
        System.out.println(closest);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
    double distanceToOrigin() {
        // TODO: return distance to origin
        return 0;
    }
    public String toString() { return "(" + x + ", " + y + ")"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Point[] pts = new Point[n];
        for (int i = 0; i < n; i++) pts[i] = new Point(sc.nextInt(), sc.nextInt());
        // TODO: find and print the closest point to origin
    }
}`,
    solution: `import java.util.Scanner;
class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
    double distanceToOrigin() { return Math.sqrt(x * x + y * y); }
    public String toString() { return "(" + x + ", " + y + ")"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Point[] pts = new Point[n];
        for (int i = 0; i < n; i++) pts[i] = new Point(sc.nextInt(), sc.nextInt());
        Point closest = pts[0];
        for (int i = 1; i < n; i++)
            if (pts[i].distanceToOrigin() < closest.distanceToOrigin()) closest = pts[i];
        System.out.println(closest);
    }
}`,
    testCases: [
      { id: "JCH07_A1_T1", label: "3 points", mockInputs: ["3", "3 4", "1 1", "0 5"], expectedOutput: "(1, 1)" },
      { id: "JCH07_A1_T2", label: "Origin itself", mockInputs: ["1", "0 0"], expectedOutput: "(0, 0)", isBoundary: true },
      { id: "JCH07_A1_T3", label: "Negative coords", mockInputs: ["2", "-3 -4", "1 0"], expectedOutput: "(1, 0)", isHidden: true },
      { id: "JCH07_A1_T4", label: "Tie first wins", mockInputs: ["2", "1 0", "0 1"], expectedOutput: "(1, 0)", isBoundary: true },
    ],
    concepts: ["Math.sqrt", "instance method", "object array", "toString"],
    xpReward: 150,
    estimatedMinutes: 18,
  },

  {
    id: "JCH07_A2",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "advanced",
    tierIndex: 1,
    title: "Fraction Arithmetic",
    emoji: "➗",
    tagline: "Build a Fraction class that adds fractions and reduces them via GCD.",
    problemStatement:
      "Define a class Fraction with int fields num and den. Add:\n- static int gcd(int a, int b) using Euclidean algorithm\n- void reduce() — divides both fields by their GCD\n- Fraction add(Fraction o) — returns new Fraction (cross-multiply)\n- toString() returning 'num/den'\nRead two fractions (each as 'numerator denominator' on one line). Print their reduced sum.",
    inputFormat: "Line 1: numerator1 denominator1\nLine 2: numerator2 denominator2",
    outputFormat: "One line: reduced sum as 'num/den'",
    examples: [
      { input: "1 4\n1 4", output: "1/2", explanation: "1/4 + 1/4 = 2/8 → 1/4. Wait: 2/8 reduces to 1/4, not 1/2. Actually 1/4+1/4=2/4=1/2." },
      { input: "1 3\n1 6", output: "1/2", explanation: "2/6 + 1/6 = 3/6 → 1/2." },
    ],
    constraints: ["1 ≤ denominator ≤ 1000", "0 ≤ numerator ≤ 1000"],
    hints: [
      "add: return new Fraction(num * o.den + o.num * den, den * o.den);",
      "gcd: return b == 0 ? a : gcd(b, a % b);",
      "reduce: int g = gcd(Math.abs(num), den); num /= g; den /= g;",
      "Call sum.reduce() before printing.",
    ],
    referenceProgram: {
      title: "Fraction with add and reduce",
      description: "GCD-based reduction, cross-multiply addition.",
      code: `import java.util.Scanner;
class Fraction {
    int num, den;
    Fraction(int n, int d) { num = n; den = d; }
    static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    void reduce() { int g = gcd(Math.abs(num), den); num /= g; den /= g; }
    Fraction add(Fraction o) { return new Fraction(num * o.den + o.num * den, den * o.den); }
    public String toString() { return num + "/" + den; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Fraction a = new Fraction(sc.nextInt(), sc.nextInt());
        Fraction b = new Fraction(sc.nextInt(), sc.nextInt());
        Fraction sum = a.add(b);
        sum.reduce();
        System.out.println(sum);
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Fraction {
    int num, den;
    Fraction(int n, int d) { num = n; den = d; }
    static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    void reduce() {
        // TODO: divide num and den by their GCD
    }
    Fraction add(Fraction o) {
        // TODO: cross multiply and return new Fraction
        return null;
    }
    public String toString() { return num + "/" + den; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Fraction a = new Fraction(sc.nextInt(), sc.nextInt());
        Fraction b = new Fraction(sc.nextInt(), sc.nextInt());
        Fraction sum = a.add(b);
        sum.reduce();
        System.out.println(sum);
    }
}`,
    solution: `import java.util.Scanner;
class Fraction {
    int num, den;
    Fraction(int n, int d) { num = n; den = d; }
    static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
    void reduce() { int g = gcd(Math.abs(num), den); num /= g; den /= g; }
    Fraction add(Fraction o) { return new Fraction(num * o.den + o.num * den, den * o.den); }
    public String toString() { return num + "/" + den; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Fraction a = new Fraction(sc.nextInt(), sc.nextInt());
        Fraction b = new Fraction(sc.nextInt(), sc.nextInt());
        Fraction sum = a.add(b);
        sum.reduce();
        System.out.println(sum);
    }
}`,
    testCases: [
      { id: "JCH07_A2_T1", label: "1/4 + 1/4 = 1/2", mockInputs: ["1 4", "1 4"], expectedOutput: "1/2" },
      { id: "JCH07_A2_T2", label: "1/3 + 1/6 = 1/2", mockInputs: ["1 3", "1 6"], expectedOutput: "1/2" },
      { id: "JCH07_A2_T3", label: "0 + 0 = 0/1", mockInputs: ["0 1", "0 1"], expectedOutput: "0/1", isBoundary: true },
      { id: "JCH07_A2_T4", label: "1/2 + 1/3 = 5/6", mockInputs: ["1 2", "1 3"], expectedOutput: "5/6", isHidden: true },
    ],
    concepts: ["GCD", "Euclidean algorithm", "cross multiplication", "static method"],
    xpReward: 175,
    estimatedMinutes: 22,
  },

  {
    id: "JCH07_A3",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "advanced",
    tierIndex: 2,
    title: "Temperature Converter",
    emoji: "🌡️",
    tagline: "Encapsulate unit conversion logic in a Temperature class with static factories.",
    problemStatement:
      "Define a class Temperature storing value in Celsius internally. Add static factories fromCelsius(double), fromFahrenheit(double), fromKelvin(double), and instance methods toCelsius(), toFahrenheit(), toKelvin().\nRead N conversions, each line: 'VALUE UNIT_IN UNIT_OUT' (units: C, F, K). Print converted value formatted to 2 decimal places followed by the unit.",
    inputFormat: "Line 1: N\nNext N lines: VALUE UNIT_IN UNIT_OUT",
    outputFormat: "N lines: '<value> <unit>' (2 decimal places)",
    examples: [
      { input: "3\n100 C F\n32 F C\n373.15 K C", output: "212.00 F\n0.00 C\n100.00 C" },
      { input: "1\n0 C K", output: "273.15 K" },
    ],
    constraints: ["-273.15 ≤ Celsius ≤ 10000", "1 ≤ N ≤ 50"],
    hints: [
      "F = C * 9.0/5.0 + 32; C = (F - 32) * 5.0/9.0",
      "K = C + 273.15; C = K - 273.15",
      "Use static factories to create Temperature from any unit.",
      "Use System.out.printf(\"%.2f %s%n\", result, unitOut) for formatting.",
    ],
    referenceProgram: {
      title: "Temperature with Static Factory Methods",
      description: "All unit logic in one class; factory methods hide conversion.",
      code: `import java.util.Scanner;
class Temperature {
    double celsius;
    Temperature(double c) { celsius = c; }
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
            double val = sc.nextDouble();
            String unitIn = sc.next(), unitOut = sc.next();
            Temperature t;
            if (unitIn.equals("C")) t = Temperature.fromCelsius(val);
            else if (unitIn.equals("F")) t = Temperature.fromFahrenheit(val);
            else t = Temperature.fromKelvin(val);
            double result;
            if (unitOut.equals("C")) result = t.toCelsius();
            else if (unitOut.equals("F")) result = t.toFahrenheit();
            else result = t.toKelvin();
            System.out.printf("%.2f %s%n", result, unitOut);
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Temperature {
    double celsius;
    Temperature(double c) { celsius = c; }
    static Temperature fromCelsius(double c) { return new Temperature(c); }
    static Temperature fromFahrenheit(double f) {
        // TODO: convert f to celsius
        return null;
    }
    static Temperature fromKelvin(double k) {
        // TODO: convert k to celsius
        return null;
    }
    double toCelsius() { return celsius; }
    double toFahrenheit() {
        // TODO
        return 0;
    }
    double toKelvin() {
        // TODO
        return 0;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            double val = sc.nextDouble();
            String unitIn = sc.next(), unitOut = sc.next();
            // TODO: create Temperature from unitIn, convert to unitOut, print
        }
    }
}`,
    solution: `import java.util.Scanner;
class Temperature {
    double celsius;
    Temperature(double c) { celsius = c; }
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
            double val = sc.nextDouble();
            String unitIn = sc.next(), unitOut = sc.next();
            Temperature t;
            if (unitIn.equals("C")) t = Temperature.fromCelsius(val);
            else if (unitIn.equals("F")) t = Temperature.fromFahrenheit(val);
            else t = Temperature.fromKelvin(val);
            double result;
            if (unitOut.equals("C")) result = t.toCelsius();
            else if (unitOut.equals("F")) result = t.toFahrenheit();
            else result = t.toKelvin();
            System.out.printf("%.2f %s%n", result, unitOut);
        }
    }
}`,
    testCases: [
      { id: "JCH07_A3_T1", label: "C to F, F to C, K to C", mockInputs: ["3", "100 C F", "32 F C", "373.15 K C"], expectedOutput: "212.00 F\n0.00 C\n100.00 C" },
      { id: "JCH07_A3_T2", label: "0 C to K", mockInputs: ["1", "0 C K"], expectedOutput: "273.15 K" },
      { id: "JCH07_A3_T3", label: "Same unit passthrough", mockInputs: ["1", "25 C C"], expectedOutput: "25.00 C", isBoundary: true },
      { id: "JCH07_A3_T4", label: "Absolute zero K to C", mockInputs: ["1", "0 K C"], expectedOutput: "-273.15 C", isBoundary: true, isHidden: true },
    ],
    concepts: ["static factory methods", "encapsulation", "unit conversion", "printf"],
    xpReward: 190,
    estimatedMinutes: 25,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH07_L1",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "leetcode",
    tierIndex: 0,
    title: "Design a Stack",
    emoji: "📚",
    tagline: "Implement a stack class with push, pop, peek, and isEmpty.",
    problemStatement:
      "Design a class MyStack using an int array (capacity 1000):\n- void push(int val)\n- int pop() — remove and return top; print 'ERROR' and return nothing meaningful if empty\n- int peek() — return top without removing; print 'ERROR' if empty\n- boolean isEmpty()\n\nRead N operations: 'PUSH x', 'POP', 'PEEK', 'ISEMPTY'.\nFor POP and PEEK print the value or 'ERROR'. For ISEMPTY print 'true' or 'false'.",
    inputFormat: "Line 1: N\nNext N lines: operation",
    outputFormat: "One line per POP, PEEK, or ISEMPTY",
    examples: [
      {
        input: "6\nPUSH 5\nPUSH 10\nPEEK\nPOP\nPOP\nPOP",
        output: "10\n10\n5\nERROR",
        explanation: "PEEK returns 10. POP returns 10 then 5. Stack empty → ERROR.",
      },
      { input: "2\nISEMPTY\nPUSH 1", output: "true" },
    ],
    constraints: ["1 ≤ N ≤ 1000"],
    hints: [
      "Use int[] data = new int[1000]; int top = -1;",
      "push: data[++top] = val;",
      "pop: if (top == -1) print ERROR; else return data[top--];",
      "isEmpty: return top == -1;",
    ],
    referenceProgram: {
      title: "Array-Based Stack",
      description: "Array backing with top pointer; sentinel Integer.MIN_VALUE for empty.",
      code: `import java.util.Scanner;
class MyStack {
    int[] data = new int[1000];
    int top = -1;
    void push(int val) { data[++top] = val; }
    int pop() { return top == -1 ? Integer.MIN_VALUE : data[top--]; }
    int peek() { return top == -1 ? Integer.MIN_VALUE : data[top]; }
    boolean isEmpty() { return top == -1; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MyStack stack = new MyStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("PUSH")) stack.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("POP")) { int v = stack.pop(); System.out.println(v == Integer.MIN_VALUE ? "ERROR" : v); }
            else if (line.equals("PEEK")) { int v = stack.peek(); System.out.println(v == Integer.MIN_VALUE ? "ERROR" : v); }
            else if (line.equals("ISEMPTY")) System.out.println(stack.isEmpty());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class MyStack {
    int[] data = new int[1000];
    int top = -1;
    void push(int val) { /* TODO */ }
    int pop() { return Integer.MIN_VALUE; /* TODO */ }
    int peek() { return Integer.MIN_VALUE; /* TODO */ }
    boolean isEmpty() { return true; /* TODO */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MyStack stack = new MyStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("PUSH")) stack.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("POP")) { int v = stack.pop(); System.out.println(v == Integer.MIN_VALUE ? "ERROR" : v); }
            else if (line.equals("PEEK")) { int v = stack.peek(); System.out.println(v == Integer.MIN_VALUE ? "ERROR" : v); }
            else if (line.equals("ISEMPTY")) System.out.println(stack.isEmpty());
        }
    }
}`,
    solution: `import java.util.Scanner;
class MyStack {
    int[] data = new int[1000];
    int top = -1;
    void push(int val) { data[++top] = val; }
    int pop() { return top == -1 ? Integer.MIN_VALUE : data[top--]; }
    int peek() { return top == -1 ? Integer.MIN_VALUE : data[top]; }
    boolean isEmpty() { return top == -1; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MyStack stack = new MyStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("PUSH")) stack.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("POP")) { int v = stack.pop(); System.out.println(v == Integer.MIN_VALUE ? "ERROR" : v); }
            else if (line.equals("PEEK")) { int v = stack.peek(); System.out.println(v == Integer.MIN_VALUE ? "ERROR" : v); }
            else if (line.equals("ISEMPTY")) System.out.println(stack.isEmpty());
        }
    }
}`,
    testCases: [
      { id: "JCH07_L1_T1", label: "Push peek pop error", mockInputs: ["6", "PUSH 5", "PUSH 10", "PEEK", "POP", "POP", "POP"], expectedOutput: "10\n10\n5\nERROR" },
      { id: "JCH07_L1_T2", label: "IsEmpty then push", mockInputs: ["2", "ISEMPTY", "PUSH 1"], expectedOutput: "true" },
      { id: "JCH07_L1_T3", label: "Pop from empty", mockInputs: ["1", "POP"], expectedOutput: "ERROR", isBoundary: true },
      { id: "JCH07_L1_T4", label: "IsEmpty after push then pop", mockInputs: ["3", "PUSH 7", "POP", "ISEMPTY"], expectedOutput: "7\ntrue", isHidden: true },
    ],
    concepts: ["stack", "array-backed", "top pointer", "error handling"],
    xpReward: 250,
    estimatedMinutes: 25,
    timeComplexityTarget: "O(1) per operation",
  },

  {
    id: "JCH07_L2",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "leetcode",
    tierIndex: 1,
    title: "Design a Circular Queue",
    emoji: "🚶",
    tagline: "Implement a fixed-capacity circular queue with enqueue and dequeue.",
    problemStatement:
      "Design a class MyQueue with capacity given at construction, using a circular array. Support:\n- void enqueue(int val) — print 'FULL' if at capacity\n- int dequeue() — remove from front, return Integer.MIN_VALUE sentinel if empty (printed as 'EMPTY')\n- int front() — peek front, same sentinel if empty\n- boolean isFull(), boolean isEmpty()\n\nRead capacity, then N operations: 'ENQUEUE x', 'DEQUEUE', 'FRONT', 'ISFULL', 'ISEMPTY'.",
    inputFormat: "Line 1: capacity\nLine 2: N\nNext N lines: operation",
    outputFormat: "One line per DEQUEUE/FRONT/ISFULL/ISEMPTY or failed ENQUEUE",
    examples: [
      {
        input: "3\n7\nENQUEUE 1\nENQUEUE 2\nENQUEUE 3\nENQUEUE 4\nFRONT\nDEQUEUE\nISEMPTY",
        output: "FULL\n1\n1\nfalse",
      },
    ],
    constraints: ["1 ≤ capacity ≤ 100", "1 ≤ N ≤ 500"],
    hints: [
      "Use int[] data; int head=0, tail=0, size=0;",
      "enqueue: data[tail] = val; tail = (tail+1) % capacity; size++;",
      "dequeue: v = data[head]; head = (head+1) % capacity; size--; return v;",
      "isFull: size == capacity; isEmpty: size == 0;",
    ],
    referenceProgram: {
      title: "Circular Array Queue",
      description: "head/tail pointers with size counter for circular wraparound.",
      code: `import java.util.Scanner;
class MyQueue {
    int[] data; int head=0, tail=0, size=0, capacity;
    MyQueue(int cap) { capacity = cap; data = new int[cap]; }
    boolean isFull() { return size == capacity; }
    boolean isEmpty() { return size == 0; }
    void enqueue(int val) {
        if (isFull()) { System.out.println("FULL"); return; }
        data[tail] = val; tail = (tail+1)%capacity; size++;
    }
    int dequeue() {
        if (isEmpty()) return Integer.MIN_VALUE;
        int v = data[head]; head = (head+1)%capacity; size--; return v;
    }
    int front() { return isEmpty() ? Integer.MIN_VALUE : data[head]; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cap = sc.nextInt(), n = sc.nextInt(); sc.nextLine();
        MyQueue q = new MyQueue(cap);
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("ENQUEUE")) q.enqueue(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("DEQUEUE")) { int v=q.dequeue(); System.out.println(v==Integer.MIN_VALUE?"EMPTY":v); }
            else if (line.equals("FRONT")) { int v=q.front(); System.out.println(v==Integer.MIN_VALUE?"EMPTY":v); }
            else if (line.equals("ISFULL")) System.out.println(q.isFull());
            else if (line.equals("ISEMPTY")) System.out.println(q.isEmpty());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class MyQueue {
    int[] data; int head=0, tail=0, size=0, capacity;
    MyQueue(int cap) { capacity = cap; data = new int[cap]; }
    boolean isFull() { return size == capacity; }
    boolean isEmpty() { return size == 0; }
    void enqueue(int val) { /* TODO: print FULL if full, else add circularly */ }
    int dequeue() { return Integer.MIN_VALUE; /* TODO */ }
    int front() { return Integer.MIN_VALUE; /* TODO */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cap = sc.nextInt(), n = sc.nextInt(); sc.nextLine();
        MyQueue q = new MyQueue(cap);
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("ENQUEUE")) q.enqueue(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("DEQUEUE")) { int v=q.dequeue(); System.out.println(v==Integer.MIN_VALUE?"EMPTY":v); }
            else if (line.equals("FRONT")) { int v=q.front(); System.out.println(v==Integer.MIN_VALUE?"EMPTY":v); }
            else if (line.equals("ISFULL")) System.out.println(q.isFull());
            else if (line.equals("ISEMPTY")) System.out.println(q.isEmpty());
        }
    }
}`,
    solution: `import java.util.Scanner;
class MyQueue {
    int[] data; int head=0, tail=0, size=0, capacity;
    MyQueue(int cap) { capacity = cap; data = new int[cap]; }
    boolean isFull() { return size == capacity; }
    boolean isEmpty() { return size == 0; }
    void enqueue(int val) {
        if (isFull()) { System.out.println("FULL"); return; }
        data[tail] = val; tail = (tail+1)%capacity; size++;
    }
    int dequeue() {
        if (isEmpty()) return Integer.MIN_VALUE;
        int v = data[head]; head = (head+1)%capacity; size--; return v;
    }
    int front() { return isEmpty() ? Integer.MIN_VALUE : data[head]; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int cap = sc.nextInt(), n = sc.nextInt(); sc.nextLine();
        MyQueue q = new MyQueue(cap);
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("ENQUEUE")) q.enqueue(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("DEQUEUE")) { int v=q.dequeue(); System.out.println(v==Integer.MIN_VALUE?"EMPTY":v); }
            else if (line.equals("FRONT")) { int v=q.front(); System.out.println(v==Integer.MIN_VALUE?"EMPTY":v); }
            else if (line.equals("ISFULL")) System.out.println(q.isFull());
            else if (line.equals("ISEMPTY")) System.out.println(q.isEmpty());
        }
    }
}`,
    testCases: [
      { id: "JCH07_L2_T1", label: "Fill overflow front dequeue isEmpty", mockInputs: ["3", "7", "ENQUEUE 1", "ENQUEUE 2", "ENQUEUE 3", "ENQUEUE 4", "FRONT", "DEQUEUE", "ISEMPTY"], expectedOutput: "FULL\n1\n1\nfalse" },
      { id: "JCH07_L2_T2", label: "Dequeue from empty", mockInputs: ["2", "1", "DEQUEUE"], expectedOutput: "EMPTY", isBoundary: true },
      { id: "JCH07_L2_T3", label: "isFull after enqueue", mockInputs: ["1", "3", "ENQUEUE 5", "ISFULL", "DEQUEUE"], expectedOutput: "true\n5", isHidden: true },
    ],
    concepts: ["circular queue", "head/tail pointers", "modulo wraparound", "class design"],
    xpReward: 270,
    estimatedMinutes: 28,
    timeComplexityTarget: "O(1) per operation",
  },

  {
    id: "JCH07_L3",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "leetcode",
    tierIndex: 2,
    title: "Min Stack",
    emoji: "🏔️",
    tagline: "Design a stack that retrieves the current minimum in O(1).",
    problemStatement:
      "Design a class MinStack supporting:\n- void push(int val)\n- int pop() — remove and return top (print 'ERROR' if empty)\n- int getMin() — return current minimum in O(1) (print 'ERROR' if empty)\n\nUse two parallel int arrays: one for values, one tracking the running minimum at each stack level.\nRead N operations: 'PUSH x', 'POP', 'GETMIN'.",
    inputFormat: "Line 1: N\nNext N lines: operation",
    outputFormat: "One line per POP and GETMIN",
    examples: [
      {
        input: "8\nPUSH 5\nPUSH 3\nPUSH 7\nGETMIN\nPOP\nGETMIN\nPOP\nGETMIN",
        output: "3\n7\n3\n5",
        explanation: "After 5,3,7: min=3. Pop 7 → min still 3. Pop 3 → min becomes 5.",
      },
    ],
    constraints: ["1 ≤ N ≤ 1000"],
    hints: [
      "Maintain int[] mins where mins[i] = Math.min(data[i], mins[i-1]).",
      "On push: top++; data[top]=val; mins[top] = top==0 ? val : Math.min(val, mins[top-1]);",
      "getMin() = mins[top] — always O(1).",
      "pop: decrements top, exposing the previous minimum automatically.",
    ],
    referenceProgram: {
      title: "Min Stack with Shadow Min Array",
      description: "Parallel mins array stores running minimum at each level.",
      code: `import java.util.Scanner;
class MinStack {
    int[] data = new int[1000];
    int[] mins = new int[1000];
    int top = -1;
    void push(int val) {
        top++;
        data[top] = val;
        mins[top] = top == 0 ? val : Math.min(val, mins[top-1]);
    }
    int pop() { return top == -1 ? Integer.MIN_VALUE : data[top--]; }
    int getMin() { return top == -1 ? Integer.MIN_VALUE : mins[top]; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("PUSH")) ms.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("POP")) { int v=ms.pop(); System.out.println(v==Integer.MIN_VALUE?"ERROR":v); }
            else if (line.equals("GETMIN")) { int v=ms.getMin(); System.out.println(v==Integer.MIN_VALUE?"ERROR":v); }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class MinStack {
    int[] data = new int[1000];
    int[] mins = new int[1000];
    int top = -1;
    void push(int val) {
        // TODO: push val; set mins[top] = current minimum
    }
    int pop() { return Integer.MIN_VALUE; /* TODO */ }
    int getMin() { return Integer.MIN_VALUE; /* TODO */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("PUSH")) ms.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("POP")) { int v=ms.pop(); System.out.println(v==Integer.MIN_VALUE?"ERROR":v); }
            else if (line.equals("GETMIN")) { int v=ms.getMin(); System.out.println(v==Integer.MIN_VALUE?"ERROR":v); }
        }
    }
}`,
    solution: `import java.util.Scanner;
class MinStack {
    int[] data = new int[1000];
    int[] mins = new int[1000];
    int top = -1;
    void push(int val) {
        top++;
        data[top] = val;
        mins[top] = top == 0 ? val : Math.min(val, mins[top-1]);
    }
    int pop() { return top == -1 ? Integer.MIN_VALUE : data[top--]; }
    int getMin() { return top == -1 ? Integer.MIN_VALUE : mins[top]; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            if (line.startsWith("PUSH")) ms.push(Integer.parseInt(line.split(" ")[1]));
            else if (line.equals("POP")) { int v=ms.pop(); System.out.println(v==Integer.MIN_VALUE?"ERROR":v); }
            else if (line.equals("GETMIN")) { int v=ms.getMin(); System.out.println(v==Integer.MIN_VALUE?"ERROR":v); }
        }
    }
}`,
    testCases: [
      { id: "JCH07_L3_T1", label: "Push 5 3 7 getmin sequence", mockInputs: ["8", "PUSH 5", "PUSH 3", "PUSH 7", "GETMIN", "POP", "GETMIN", "POP", "GETMIN"], expectedOutput: "3\n7\n3\n5" },
      { id: "JCH07_L3_T2", label: "GetMin on empty", mockInputs: ["1", "GETMIN"], expectedOutput: "ERROR", isBoundary: true },
      { id: "JCH07_L3_T3", label: "Min updates correctly after pop", mockInputs: ["5", "PUSH 2", "PUSH 1", "GETMIN", "POP", "GETMIN"], expectedOutput: "1\n1\n2", isHidden: true },
    ],
    concepts: ["MinStack", "shadow array", "O(1) min", "class design"],
    xpReward: 300,
    estimatedMinutes: 30,
    timeComplexityTarget: "O(1) all operations",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH07_H1",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "hackathon",
    tierIndex: 0,
    title: "Bank Account System",
    emoji: "🏦",
    tagline: "Simulate multiple bank accounts with deposit, withdraw, and transfer.",
    problemStatement:
      "Design a class BankAccount with fields accountNumber (String), holderName (String), balance (double). Methods:\n- void deposit(double amount)\n- boolean withdraw(double amount) — print 'INSUFFICIENT' and return false if balance < amount\n- void transfer(BankAccount target, double amount) — withdraw from this, deposit to target if successful\n- toString() returning 'ACC:<accountNumber> <holderName> BAL:<balance formatted to 2dp>'\n\nRead N accounts (accountNumber, holderName, initialBalance on separate lines each). Then M operations:\n- 'DEPOSIT accNum amount'\n- 'WITHDRAW accNum amount'\n- 'TRANSFER fromAcc toAcc amount'\n- 'BALANCE accNum'\n\nFor BALANCE print the toString. For failed WITHDRAW/TRANSFER already prints 'INSUFFICIENT'.",
    inputFormat:
      "Line 1: N\nNext 3*N lines: accountNumber, holderName, initialBalance (one per line)\nLine after accounts: M\nNext M lines: operation",
    outputFormat: "One line per BALANCE and per INSUFFICIENT",
    examples: [
      {
        input: "2\nACC001\nAlice\n1000.00\nACC002\nBob\n500.00\n4\nDEPOSIT ACC001 200.00\nWITHDRAW ACC002 600.00\nTRANSFER ACC001 ACC002 300.00\nBALANCE ACC001",
        output: "INSUFFICIENT\nACC:ACC001 Alice BAL:900.00",
        explanation: "Deposit 200 → ACC001=1200. Withdraw 600 from ACC002 fails (only 500). Transfer 300: ACC001=900, ACC002=800. Balance ACC001=900.",
      },
    ],
    constraints: ["1 ≤ N ≤ 20", "1 ≤ M ≤ 100"],
    hints: [
      "Store accounts in BankAccount[] accounts; find by accountNumber with a helper.",
      "withdraw: if (balance < amount) { print INSUFFICIENT; return false; } balance -= amount; return true;",
      "transfer: calls withdraw; if returned true, calls target.deposit(amount).",
      "Use String.format(\"ACC:%s %s BAL:%.2f\", ...) in toString().",
    ],
    referenceProgram: {
      title: "Bank Account System",
      description: "Array of BankAccount objects with deposit/withdraw/transfer.",
      code: `import java.util.Scanner;
class BankAccount {
    String accountNumber, holderName;
    double balance;
    BankAccount(String num, String name, double bal) {
        accountNumber = num; holderName = name; balance = bal;
    }
    void deposit(double amount) { balance += amount; }
    boolean withdraw(double amount) {
        if (balance < amount) { System.out.println("INSUFFICIENT"); return false; }
        balance -= amount; return true;
    }
    void transfer(BankAccount target, double amount) {
        if (withdraw(amount)) target.deposit(amount);
    }
    public String toString() {
        return String.format("ACC:%s %s BAL:%.2f", accountNumber, holderName, balance);
    }
}
public class Main {
    static BankAccount[] accounts;
    static BankAccount find(String num) {
        for (BankAccount a : accounts) if (a.accountNumber.equals(num)) return a;
        return null;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        accounts = new BankAccount[n];
        for (int i = 0; i < n; i++) {
            String num = sc.nextLine().trim(), name = sc.nextLine().trim();
            double bal = Double.parseDouble(sc.nextLine().trim());
            accounts[i] = new BankAccount(num, name, bal);
        }
        int m = sc.nextInt(); sc.nextLine();
        for (int i = 0; i < m; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("DEPOSIT")) find(p[1]).deposit(Double.parseDouble(p[2]));
            else if (p[0].equals("WITHDRAW")) find(p[1]).withdraw(Double.parseDouble(p[2]));
            else if (p[0].equals("TRANSFER")) find(p[1]).transfer(find(p[2]), Double.parseDouble(p[3]));
            else if (p[0].equals("BALANCE")) System.out.println(find(p[1]));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class BankAccount {
    String accountNumber, holderName;
    double balance;
    BankAccount(String num, String name, double bal) {
        accountNumber = num; holderName = name; balance = bal;
    }
    void deposit(double amount) { /* TODO */ }
    boolean withdraw(double amount) {
        // TODO: print INSUFFICIENT and return false if insufficient; else subtract and return true
        return false;
    }
    void transfer(BankAccount target, double amount) {
        // TODO: withdraw from this; if successful deposit to target
    }
    public String toString() {
        return String.format("ACC:%s %s BAL:%.2f", accountNumber, holderName, balance);
    }
}
public class Main {
    static BankAccount[] accounts;
    static BankAccount find(String num) {
        for (BankAccount a : accounts) if (a.accountNumber.equals(num)) return a;
        return null;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        accounts = new BankAccount[n];
        for (int i = 0; i < n; i++) {
            String num = sc.nextLine().trim(), name = sc.nextLine().trim();
            double bal = Double.parseDouble(sc.nextLine().trim());
            accounts[i] = new BankAccount(num, name, bal);
        }
        int m = sc.nextInt(); sc.nextLine();
        for (int i = 0; i < m; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("DEPOSIT")) find(p[1]).deposit(Double.parseDouble(p[2]));
            else if (p[0].equals("WITHDRAW")) find(p[1]).withdraw(Double.parseDouble(p[2]));
            else if (p[0].equals("TRANSFER")) find(p[1]).transfer(find(p[2]), Double.parseDouble(p[3]));
            else if (p[0].equals("BALANCE")) System.out.println(find(p[1]));
        }
    }
}`,
    solution: `import java.util.Scanner;
class BankAccount {
    String accountNumber, holderName;
    double balance;
    BankAccount(String num, String name, double bal) {
        accountNumber = num; holderName = name; balance = bal;
    }
    void deposit(double amount) { balance += amount; }
    boolean withdraw(double amount) {
        if (balance < amount) { System.out.println("INSUFFICIENT"); return false; }
        balance -= amount; return true;
    }
    void transfer(BankAccount target, double amount) {
        if (withdraw(amount)) target.deposit(amount);
    }
    public String toString() {
        return String.format("ACC:%s %s BAL:%.2f", accountNumber, holderName, balance);
    }
}
public class Main {
    static BankAccount[] accounts;
    static BankAccount find(String num) {
        for (BankAccount a : accounts) if (a.accountNumber.equals(num)) return a;
        return null;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(); sc.nextLine();
        accounts = new BankAccount[n];
        for (int i = 0; i < n; i++) {
            String num = sc.nextLine().trim(), name = sc.nextLine().trim();
            double bal = Double.parseDouble(sc.nextLine().trim());
            accounts[i] = new BankAccount(num, name, bal);
        }
        int m = sc.nextInt(); sc.nextLine();
        for (int i = 0; i < m; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("DEPOSIT")) find(p[1]).deposit(Double.parseDouble(p[2]));
            else if (p[0].equals("WITHDRAW")) find(p[1]).withdraw(Double.parseDouble(p[2]));
            else if (p[0].equals("TRANSFER")) find(p[1]).transfer(find(p[2]), Double.parseDouble(p[3]));
            else if (p[0].equals("BALANCE")) System.out.println(find(p[1]));
        }
    }
}`,
    testCases: [
      {
        id: "JCH07_H1_T1",
        label: "Deposit withdraw transfer balance",
        mockInputs: ["2", "ACC001", "Alice", "1000.00", "ACC002", "Bob", "500.00", "4", "DEPOSIT ACC001 200.00", "WITHDRAW ACC002 600.00", "TRANSFER ACC001 ACC002 300.00", "BALANCE ACC001"],
        expectedOutput: "INSUFFICIENT\nACC:ACC001 Alice BAL:900.00",
      },
      {
        id: "JCH07_H1_T2",
        label: "Single account balance",
        mockInputs: ["1", "ACC999", "Zara", "250.00", "1", "BALANCE ACC999"],
        expectedOutput: "ACC:ACC999 Zara BAL:250.00",
        isBoundary: true,
      },
      {
        id: "JCH07_H1_T3",
        label: "Transfer then check both balances",
        mockInputs: ["2", "A1", "Sam", "300.00", "A2", "Priya", "100.00", "3", "TRANSFER A1 A2 150.00", "BALANCE A1", "BALANCE A2"],
        expectedOutput: "ACC:A1 Sam BAL:150.00\nACC:A2 Priya BAL:250.00",
        isHidden: true,
      },
    ],
    concepts: ["multi-class design", "encapsulation", "transfer pattern", "String.format"],
    xpReward: 400,
    estimatedMinutes: 35,
    designChallenge:
      "Add transaction history to each BankAccount and implement a 'HISTORY accNum' command printing the last 5 operations.",
  },

  {
    id: "JCH07_H2",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "hackathon",
    tierIndex: 1,
    title: "Library Book System",
    emoji: "📖",
    tagline: "Manage books and members in a two-class library system.",
    problemStatement:
      "Design two classes:\n- Book: fields isbn (String), title (String), isCheckedOut (boolean). Methods: boolean checkOut() — sets true, prints 'ALREADY_OUT' and returns false if already out; boolean returnBook() — sets false, prints 'NOT_OUT' and returns false if not checked out; toString() → 'ISBN:<isbn> <title> [<OUT|AVAILABLE>]'.\n- Member: fields memberId (String), name (String), checkedOutCount (int). Methods: void borrowBook(Book b) — calls b.checkOut(), increments count if true; void returnBook(Book b) — calls b.returnBook(), decrements if true; toString() → 'MEM:<memberId> <name> BOOKS:<count>'.\n\nRead B books (isbn, title per line each), M members (memberId, name per line each), then Q operations: 'BORROW memberId isbn', 'RETURN memberId isbn', 'BOOKSTATUS isbn', 'MEMBERSTATUS memberId'.",
    inputFormat:
      "Line 1: B\nNext 2*B lines: isbn then title\nLine: M\nNext 2*M lines: memberId then name\nLine: Q\nNext Q lines: operation",
    outputFormat: "One line per BOOKSTATUS, MEMBERSTATUS, ALREADY_OUT, NOT_OUT",
    examples: [
      {
        input: "2\nISBN001\nJava Programming\nISBN002\nData Structures\n1\nM001\nAlice\n5\nBORROW M001 ISBN001\nBORROW M001 ISBN001\nBOOKSTATUS ISBN001\nRETURN M001 ISBN001\nMEMBERSTATUS M001",
        output: "ALREADY_OUT\nISBN:ISBN001 Java Programming [OUT]\nMEM:M001 Alice BOOKS:0",
      },
    ],
    constraints: ["1 ≤ B ≤ 20", "1 ≤ M ≤ 10", "1 ≤ Q ≤ 100"],
    hints: [
      "Store books in Book[] and members in Member[] with static lookup helpers.",
      "checkOut: if (isCheckedOut) { print; return false; } isCheckedOut=true; return true;",
      "In borrowBook: if (b.checkOut()) checkedOutCount++;",
      "In returnBook: if (b.returnBook()) checkedOutCount--;",
    ],
    referenceProgram: {
      title: "Library Book System",
      description: "Book and Member classes with checkout state and counts.",
      code: `import java.util.Scanner;
class Book {
    String isbn, title;
    boolean isCheckedOut = false;
    Book(String i, String t) { isbn = i; title = t; }
    boolean checkOut() {
        if (isCheckedOut) { System.out.println("ALREADY_OUT"); return false; }
        isCheckedOut = true; return true;
    }
    boolean returnBook() {
        if (!isCheckedOut) { System.out.println("NOT_OUT"); return false; }
        isCheckedOut = false; return true;
    }
    public String toString() {
        return "ISBN:" + isbn + " " + title + " [" + (isCheckedOut ? "OUT" : "AVAILABLE") + "]";
    }
}
class Member {
    String memberId, name;
    int checkedOutCount = 0;
    Member(String id, String n) { memberId = id; name = n; }
    void borrowBook(Book b) { if (b.checkOut()) checkedOutCount++; }
    void returnBook(Book b) { if (b.returnBook()) checkedOutCount--; }
    public String toString() { return "MEM:" + memberId + " " + name + " BOOKS:" + checkedOutCount; }
}
public class Main {
    static Book[] books; static Member[] members;
    static Book findBook(String isbn) { for (Book b : books) if (b.isbn.equals(isbn)) return b; return null; }
    static Member findMember(String id) { for (Member m : members) if (m.memberId.equals(id)) return m; return null; }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int b = sc.nextInt(); sc.nextLine();
        books = new Book[b];
        for (int i = 0; i < b; i++) books[i] = new Book(sc.nextLine().trim(), sc.nextLine().trim());
        int m = sc.nextInt(); sc.nextLine();
        members = new Member[m];
        for (int i = 0; i < m; i++) members[i] = new Member(sc.nextLine().trim(), sc.nextLine().trim());
        int q = sc.nextInt(); sc.nextLine();
        for (int i = 0; i < q; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("BORROW")) findMember(p[1]).borrowBook(findBook(p[2]));
            else if (p[0].equals("RETURN")) findMember(p[1]).returnBook(findBook(p[2]));
            else if (p[0].equals("BOOKSTATUS")) System.out.println(findBook(p[1]));
            else if (p[0].equals("MEMBERSTATUS")) System.out.println(findMember(p[1]));
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Book {
    String isbn, title;
    boolean isCheckedOut = false;
    Book(String i, String t) { isbn = i; title = t; }
    boolean checkOut() {
        // TODO: print ALREADY_OUT and return false if checked out; else set true return true
        return false;
    }
    boolean returnBook() {
        // TODO: print NOT_OUT and return false if not checked out; else set false return true
        return false;
    }
    public String toString() {
        return "ISBN:" + isbn + " " + title + " [" + (isCheckedOut ? "OUT" : "AVAILABLE") + "]";
    }
}
class Member {
    String memberId, name;
    int checkedOutCount = 0;
    Member(String id, String n) { memberId = id; name = n; }
    void borrowBook(Book b) { /* TODO */ }
    void returnBook(Book b) { /* TODO */ }
    public String toString() { return "MEM:" + memberId + " " + name + " BOOKS:" + checkedOutCount; }
}
public class Main {
    static Book[] books; static Member[] members;
    static Book findBook(String isbn) { for (Book b : books) if (b.isbn.equals(isbn)) return b; return null; }
    static Member findMember(String id) { for (Member m : members) if (m.memberId.equals(id)) return m; return null; }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int b = sc.nextInt(); sc.nextLine();
        books = new Book[b];
        for (int i = 0; i < b; i++) books[i] = new Book(sc.nextLine().trim(), sc.nextLine().trim());
        int m = sc.nextInt(); sc.nextLine();
        members = new Member[m];
        for (int i = 0; i < m; i++) members[i] = new Member(sc.nextLine().trim(), sc.nextLine().trim());
        int q = sc.nextInt(); sc.nextLine();
        for (int i = 0; i < q; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("BORROW")) findMember(p[1]).borrowBook(findBook(p[2]));
            else if (p[0].equals("RETURN")) findMember(p[1]).returnBook(findBook(p[2]));
            else if (p[0].equals("BOOKSTATUS")) System.out.println(findBook(p[1]));
            else if (p[0].equals("MEMBERSTATUS")) System.out.println(findMember(p[1]));
        }
    }
}`,
    solution: `import java.util.Scanner;
class Book {
    String isbn, title;
    boolean isCheckedOut = false;
    Book(String i, String t) { isbn = i; title = t; }
    boolean checkOut() {
        if (isCheckedOut) { System.out.println("ALREADY_OUT"); return false; }
        isCheckedOut = true; return true;
    }
    boolean returnBook() {
        if (!isCheckedOut) { System.out.println("NOT_OUT"); return false; }
        isCheckedOut = false; return true;
    }
    public String toString() {
        return "ISBN:" + isbn + " " + title + " [" + (isCheckedOut ? "OUT" : "AVAILABLE") + "]";
    }
}
class Member {
    String memberId, name;
    int checkedOutCount = 0;
    Member(String id, String n) { memberId = id; name = n; }
    void borrowBook(Book b) { if (b.checkOut()) checkedOutCount++; }
    void returnBook(Book b) { if (b.returnBook()) checkedOutCount--; }
    public String toString() { return "MEM:" + memberId + " " + name + " BOOKS:" + checkedOutCount; }
}
public class Main {
    static Book[] books; static Member[] members;
    static Book findBook(String isbn) { for (Book b : books) if (b.isbn.equals(isbn)) return b; return null; }
    static Member findMember(String id) { for (Member m : members) if (m.memberId.equals(id)) return m; return null; }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int b = sc.nextInt(); sc.nextLine();
        books = new Book[b];
        for (int i = 0; i < b; i++) books[i] = new Book(sc.nextLine().trim(), sc.nextLine().trim());
        int m = sc.nextInt(); sc.nextLine();
        members = new Member[m];
        for (int i = 0; i < m; i++) members[i] = new Member(sc.nextLine().trim(), sc.nextLine().trim());
        int q = sc.nextInt(); sc.nextLine();
        for (int i = 0; i < q; i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("BORROW")) findMember(p[1]).borrowBook(findBook(p[2]));
            else if (p[0].equals("RETURN")) findMember(p[1]).returnBook(findBook(p[2]));
            else if (p[0].equals("BOOKSTATUS")) System.out.println(findBook(p[1]));
            else if (p[0].equals("MEMBERSTATUS")) System.out.println(findMember(p[1]));
        }
    }
}`,
    testCases: [
      {
        id: "JCH07_H2_T1",
        label: "Borrow twice then status",
        mockInputs: ["2", "ISBN001", "Java Programming", "ISBN002", "Data Structures", "1", "M001", "Alice", "5", "BORROW M001 ISBN001", "BORROW M001 ISBN001", "BOOKSTATUS ISBN001", "RETURN M001 ISBN001", "MEMBERSTATUS M001"],
        expectedOutput: "ALREADY_OUT\nISBN:ISBN001 Java Programming [OUT]\nMEM:M001 Alice BOOKS:0",
      },
      {
        id: "JCH07_H2_T2",
        label: "Return book not checked out",
        mockInputs: ["1", "ISBN001", "Java Basics", "1", "M001", "Bob", "1", "RETURN M001 ISBN001"],
        expectedOutput: "NOT_OUT",
        isBoundary: true,
      },
      {
        id: "JCH07_H2_T3",
        label: "Two members borrow different books",
        mockInputs: ["2", "B1", "Book One", "B2", "Book Two", "2", "M1", "Sam", "M2", "Priya", "4", "BORROW M1 B1", "BORROW M2 B2", "MEMBERSTATUS M1", "MEMBERSTATUS M2"],
        expectedOutput: "MEM:M1 Sam BOOKS:1\nMEM:M2 Priya BOOKS:1",
        isHidden: true,
      },
    ],
    concepts: ["multi-class", "boolean state", "object relationships", "library pattern"],
    xpReward: 450,
    estimatedMinutes: 40,
    designChallenge:
      "Add a WAITLIST feature: queue a member when a book is OUT; print '<name> can now borrow <title>' when the book is returned.",
  },

  {
    id: "JCH07_H3",
    chapterId: "JCH07_CLASS",
    chapterNumber: 7,
    tier: "hackathon",
    tierIndex: 2,
    title: "Employee Payroll System",
    emoji: "💼",
    tagline: "Three-class payroll system with departments, employees, and pay calculations.",
    problemStatement:
      "Design two helper classes and a Main:\n- Employee: fields empId, name, department (String), basicSalary (double). Methods: double grossPay() = basicSalary*1.2, double tax() = grossPay>50000 ? grossPay*0.1 : 0, double netPay() = grossPay-tax, toString() = 'EMP:<empId> <name> DEPT:<dept> NET:<netPay to 2dp>'.\n- Department: fields deptName (String), employees array (max 20), count. Methods: addEmployee(Employee e), double totalPayroll() (sum of netPay), Employee highestPaid().\n\nRead D department names, E employees (empId, name, deptName, basicSalary on separate lines each), then Q queries:\n- 'PAYSLIP empId'\n- 'DEPT_PAYROLL deptName' → 'DEPT:<name> PAYROLL:<total to 2dp>'\n- 'TOP_EARNER deptName' → toString of highest-paid employee in that dept",
    inputFormat:
      "Line 1: D\nNext D lines: dept name\nLine: E\nNext 4*E lines: empId, name, deptName, basicSalary\nLine: Q\nNext Q lines: query",
    outputFormat: "One line per query",
    examples: [
      {
        input: "2\nEngineering\nMarketing\n3\nE001\nAlice\nEngineering\n60000\nE002\nBob\nEngineering\n40000\nE003\nCarol\nMarketing\n55000\n4\nPAYSLIP E001\nDEPT_PAYROLL Engineering\nTOP_EARNER Engineering\nDEPT_PAYROLL Marketing",
        output: "EMP:E001 Alice DEPT:Engineering NET:64800.00\nDEPT:Engineering PAYROLL:112800.00\nEMP:E001 Alice DEPT:Engineering NET:64800.00\nDEPT:Marketing PAYROLL:59400.00",
        explanation: "E001: gross=72000, tax=7200, net=64800. E002: gross=48000, tax=0, net=48000. E003: gross=66000, tax=6600, net=59400.",
      },
    ],
    constraints: ["1 ≤ D ≤ 10", "1 ≤ E ≤ 50", "1 ≤ Q ≤ 100"],
    hints: [
      "grossPay = basicSalary * 1.2; tax = grossPay > 50000 ? grossPay * 0.1 : 0;",
      "Department keeps Employee[] employees; int count = 0;",
      "addEmployee: employees[count++] = e;",
      "highestPaid: linear scan over employees[0..count-1].",
    ],
    referenceProgram: {
      title: "Employee Payroll with Departments",
      description: "Employee pay logic + Department aggregation + query dispatch.",
      code: `import java.util.Scanner;
class Employee {
    String empId, name, department;
    double basicSalary;
    Employee(String id, String n, String dept, double sal) {
        empId=id; name=n; department=dept; basicSalary=sal;
    }
    double grossPay() { return basicSalary * 1.2; }
    double tax() { return grossPay() > 50000 ? grossPay() * 0.1 : 0; }
    double netPay() { return grossPay() - tax(); }
    public String toString() {
        return String.format("EMP:%s %s DEPT:%s NET:%.2f", empId, name, department, netPay());
    }
}
class Department {
    String deptName;
    Employee[] employees = new Employee[20];
    int count = 0;
    Department(String name) { deptName = name; }
    void addEmployee(Employee e) { employees[count++] = e; }
    double totalPayroll() { double t=0; for(int i=0;i<count;i++) t+=employees[i].netPay(); return t; }
    Employee highestPaid() {
        Employee top = employees[0];
        for (int i=1;i<count;i++) if(employees[i].netPay()>top.netPay()) top=employees[i];
        return top;
    }
}
public class Main {
    static Employee[] allEmps; static Department[] depts;
    static Employee findEmp(String id) { for(Employee e:allEmps) if(e.empId.equals(id)) return e; return null; }
    static Department findDept(String n) { for(Department d:depts) if(d.deptName.equals(n)) return d; return null; }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int d = sc.nextInt(); sc.nextLine();
        depts = new Department[d];
        for (int i=0;i<d;i++) depts[i] = new Department(sc.nextLine().trim());
        int e = sc.nextInt(); sc.nextLine();
        allEmps = new Employee[e];
        for (int i=0;i<e;i++) {
            String id=sc.nextLine().trim(), nm=sc.nextLine().trim(), dept=sc.nextLine().trim();
            double sal=Double.parseDouble(sc.nextLine().trim());
            allEmps[i] = new Employee(id,nm,dept,sal);
            findDept(dept).addEmployee(allEmps[i]);
        }
        int q = sc.nextInt(); sc.nextLine();
        for (int i=0;i<q;i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("PAYSLIP")) System.out.println(findEmp(p[1]));
            else if (p[0].equals("DEPT_PAYROLL")) {
                Department dept=findDept(p[1]);
                System.out.printf("DEPT:%s PAYROLL:%.2f%n", dept.deptName, dept.totalPayroll());
            } else if (p[0].equals("TOP_EARNER")) System.out.println(findDept(p[1]).highestPaid());
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Employee {
    String empId, name, department;
    double basicSalary;
    Employee(String id, String n, String dept, double sal) {
        empId=id; name=n; department=dept; basicSalary=sal;
    }
    double grossPay() { return basicSalary * 1.2; }
    double tax() {
        // TODO: 10% of grossPay if grossPay > 50000, else 0
        return 0;
    }
    double netPay() {
        // TODO: grossPay - tax
        return 0;
    }
    public String toString() {
        return String.format("EMP:%s %s DEPT:%s NET:%.2f", empId, name, department, netPay());
    }
}
class Department {
    String deptName;
    Employee[] employees = new Employee[20];
    int count = 0;
    Department(String name) { deptName = name; }
    void addEmployee(Employee e) { employees[count++] = e; }
    double totalPayroll() { /* TODO */ return 0; }
    Employee highestPaid() { /* TODO */ return employees[0]; }
}
public class Main {
    static Employee[] allEmps; static Department[] depts;
    static Employee findEmp(String id) { for(Employee e:allEmps) if(e.empId.equals(id)) return e; return null; }
    static Department findDept(String n) { for(Department d:depts) if(d.deptName.equals(n)) return d; return null; }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int d = sc.nextInt(); sc.nextLine();
        depts = new Department[d];
        for (int i=0;i<d;i++) depts[i] = new Department(sc.nextLine().trim());
        int e = sc.nextInt(); sc.nextLine();
        allEmps = new Employee[e];
        for (int i=0;i<e;i++) {
            String id=sc.nextLine().trim(), nm=sc.nextLine().trim(), dept=sc.nextLine().trim();
            double sal=Double.parseDouble(sc.nextLine().trim());
            allEmps[i] = new Employee(id,nm,dept,sal);
            findDept(dept).addEmployee(allEmps[i]);
        }
        int q = sc.nextInt(); sc.nextLine();
        for (int i=0;i<q;i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("PAYSLIP")) System.out.println(findEmp(p[1]));
            else if (p[0].equals("DEPT_PAYROLL")) {
                Department dept=findDept(p[1]);
                System.out.printf("DEPT:%s PAYROLL:%.2f%n", dept.deptName, dept.totalPayroll());
            } else if (p[0].equals("TOP_EARNER")) System.out.println(findDept(p[1]).highestPaid());
        }
    }
}`,
    solution: `import java.util.Scanner;
class Employee {
    String empId, name, department;
    double basicSalary;
    Employee(String id, String n, String dept, double sal) {
        empId=id; name=n; department=dept; basicSalary=sal;
    }
    double grossPay() { return basicSalary * 1.2; }
    double tax() { return grossPay() > 50000 ? grossPay() * 0.1 : 0; }
    double netPay() { return grossPay() - tax(); }
    public String toString() {
        return String.format("EMP:%s %s DEPT:%s NET:%.2f", empId, name, department, netPay());
    }
}
class Department {
    String deptName;
    Employee[] employees = new Employee[20];
    int count = 0;
    Department(String name) { deptName = name; }
    void addEmployee(Employee e) { employees[count++] = e; }
    double totalPayroll() { double t=0; for(int i=0;i<count;i++) t+=employees[i].netPay(); return t; }
    Employee highestPaid() {
        Employee top = employees[0];
        for (int i=1;i<count;i++) if(employees[i].netPay()>top.netPay()) top=employees[i];
        return top;
    }
}
public class Main {
    static Employee[] allEmps; static Department[] depts;
    static Employee findEmp(String id) { for(Employee e:allEmps) if(e.empId.equals(id)) return e; return null; }
    static Department findDept(String n) { for(Department d:depts) if(d.deptName.equals(n)) return d; return null; }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int d = sc.nextInt(); sc.nextLine();
        depts = new Department[d];
        for (int i=0;i<d;i++) depts[i] = new Department(sc.nextLine().trim());
        int e = sc.nextInt(); sc.nextLine();
        allEmps = new Employee[e];
        for (int i=0;i<e;i++) {
            String id=sc.nextLine().trim(), nm=sc.nextLine().trim(), dept=sc.nextLine().trim();
            double sal=Double.parseDouble(sc.nextLine().trim());
            allEmps[i] = new Employee(id,nm,dept,sal);
            findDept(dept).addEmployee(allEmps[i]);
        }
        int q = sc.nextInt(); sc.nextLine();
        for (int i=0;i<q;i++) {
            String[] p = sc.nextLine().trim().split(" ");
            if (p[0].equals("PAYSLIP")) System.out.println(findEmp(p[1]));
            else if (p[0].equals("DEPT_PAYROLL")) {
                Department dept=findDept(p[1]);
                System.out.printf("DEPT:%s PAYROLL:%.2f%n", dept.deptName, dept.totalPayroll());
            } else if (p[0].equals("TOP_EARNER")) System.out.println(findDept(p[1]).highestPaid());
        }
    }
}`,
    testCases: [
      {
        id: "JCH07_H3_T1",
        label: "Full payroll scenario",
        mockInputs: [
          "2", "Engineering", "Marketing",
          "3", "E001", "Alice", "Engineering", "60000",
          "E002", "Bob", "Engineering", "40000",
          "E003", "Carol", "Marketing", "55000",
          "4", "PAYSLIP E001", "DEPT_PAYROLL Engineering", "TOP_EARNER Engineering", "DEPT_PAYROLL Marketing",
        ],
        expectedOutput: "EMP:E001 Alice DEPT:Engineering NET:64800.00\nDEPT:Engineering PAYROLL:112800.00\nEMP:E001 Alice DEPT:Engineering NET:64800.00\nDEPT:Marketing PAYROLL:59400.00",
      },
      {
        id: "JCH07_H3_T2",
        label: "Below tax threshold employee",
        mockInputs: ["1", "Sales", "1", "E010", "Dave", "Sales", "30000", "1", "PAYSLIP E010"],
        expectedOutput: "EMP:E010 Dave DEPT:Sales NET:36000.00",
        isBoundary: true,
      },
      {
        id: "JCH07_H3_T3",
        label: "Top earner single employee dept",
        mockInputs: ["1", "Finance", "1", "E020", "Eva", "Finance", "80000", "1", "TOP_EARNER Finance"],
        expectedOutput: "EMP:E020 Eva DEPT:Finance NET:86400.00",
        isHidden: true,
      },
    ],
    concepts: ["multi-class design", "aggregation", "payroll logic", "tax bracket", "String.format"],
    xpReward: 500,
    estimatedMinutes: 45,
    designChallenge:
      "Add a 'GIVE_RAISE empId percentage' command that increases basicSalary by the given percentage and prints the updated payslip.",
  },
];
