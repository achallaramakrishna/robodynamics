import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import { loadYamunaCompletedLessons } from "@/lib/yamunaProgressDb";
import { YAMUNA_LEVEL1_LESSONS, YAMUNA_LEVEL2_LESSONS } from "@/lib/yamunaCatalog";
import YamunaCourseClient from "./YamunaCourseClient";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [
    { level: "level-1" },
    { level: "level-2" },
  ];
}

// ── Per-lesson rich metadata ──────────────────────────────────────────────────

const LESSON_META: Record<string, {
  sutra: string; objective: string; durationMin: number; difficulty: number;
  summary: string; outcomes: string[]; codePreview: string;
}> = {
  // Level 1
  JV_L1_01_HELLO: {
    sutra: "Hello World Sutra", durationMin: 40, difficulty: 1,
    objective: "Write your first Java program using System.out.println and understand the main method structure.",
    summary: "Every Java journey starts with Hello World. Learn the anatomy of a Java class, the main method, and how to print output to the console.",
    outcomes: ["Write a valid Java class with main method", "Use System.out.println and System.out.printf", "Understand Java's class-based structure"],
    codePreview: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  },
  JV_L1_02_VARS: {
    sutra: "Variable Declaration Sutra", durationMin: 45, difficulty: 1,
    objective: "Declare and use Java's primitive types — int, double, char, boolean — and String variables.",
    summary: "Java is strongly typed — every variable has a declared type. Learn to declare, assign, and print variables with proper types and naming conventions.",
    outcomes: ["Declare variables with correct types", "Understand int, double, char, boolean, String", "Cast between numeric types"],
    codePreview: `int age = 17;\ndouble gpa = 9.2;\nboolean isStudent = true;\nString name = "Priya";\nSystem.out.println(name + " | Age: " + age);`,
  },
  JV_L1_03_MATH: {
    sutra: "Arithmetic Sutra", durationMin: 45, difficulty: 1,
    objective: "Use Java arithmetic operators and the Math class for calculations.",
    summary: "Java's Math class gives you pow, sqrt, abs, min, max and more. Master operator precedence and integer vs double division.",
    outcomes: ["Use +, -, *, /, % operators", "Apply Math.pow, Math.sqrt, Math.round", "Understand integer vs floating-point division"],
    codePreview: `int a = 10, b = 3;\nSystem.out.println(a / b);      // 3 (integer)\nSystem.out.println(a / (double)b); // 3.333...\nSystem.out.println(Math.pow(2, 8)); // 256.0`,
  },
  JV_L1_04_LOGIC: {
    sutra: "Conditional Sutra", durationMin: 50, difficulty: 2,
    objective: "Build branching logic using if/else if/else, switch/case, and the ternary operator.",
    summary: "Java programs make decisions using conditionals. Master if-else chains, switch statements, and the compact ternary operator.",
    outcomes: ["Write if / else if / else blocks", "Use switch/case with break and default", "Apply the ternary operator for concise logic"],
    codePreview: `int score = 85;\nString grade = (score >= 90) ? "A" : (score >= 80) ? "B" : "C";\nSystem.out.println("Grade: " + grade);`,
  },
  JV_L1_05_LOOPS: {
    sutra: "Loop Sutra", durationMin: 50, difficulty: 2,
    objective: "Master while, do-while, and for loops with break and continue control flow.",
    summary: "Loops are Java's automation engine. Three loop types give you full control — know when to use each and how to prevent infinite loops.",
    outcomes: ["Write while, do-while, and for loops", "Use break and continue correctly", "Build nested loops for patterns and tables"],
    codePreview: `for (int i = 1; i <= 5; i++) {\n    System.out.println("Orbit " + i);\n}\n// do-while guarantees at least one run\nint x = 10;\ndo { System.out.println(x--); } while (x > 8);`,
  },
  JV_L1_06_ARRAYS: {
    sutra: "Array & String Sutra", durationMin: 55, difficulty: 2,
    objective: "Declare, initialise, and traverse arrays; use String methods for text processing.",
    summary: "Arrays store fixed-size collections of same-type elements. Java's String class has 40+ methods — master the most important ones.",
    outcomes: ["Declare and initialise 1D arrays", "Traverse arrays with for and enhanced for-each", "Use String methods: length, charAt, substring, contains, split"],
    codePreview: `int[] scores = {95, 87, 72, 64, 91};\nfor (int s : scores) System.out.print(s + " ");\nString msg = "Hello, Java!";\nSystem.out.println(msg.toUpperCase().replace("JAVA","World"));`,
  },
  // Level 2 — OOP
  JV_L2_01_CLASS: {
    sutra: "Blueprint Sutra", durationMin: 50, difficulty: 2,
    objective: "Define Java classes with fields and methods, create objects using the new keyword.",
    summary: "In Java, a class is a blueprint and an object is an instance. Learn to model real-world entities as Java classes with data and behaviour.",
    outcomes: ["Define a class with fields and methods", "Create objects using new", "Distinguish between class definition and object creation"],
    codePreview: `class Dog {\n    String name;\n    void bark() { System.out.println(name + " says Woof!"); }\n}\nDog d = new Dog();\nd.name = "Buddy";\nd.bark();`,
  },
  JV_L2_02_CONSTRUCT: {
    sutra: "Constructor Sutra", durationMin: 50, difficulty: 2,
    objective: "Write parameterized constructors, use this(), and overload methods with different parameter lists.",
    summary: "Constructors initialize objects at creation time. Method overloading lets you write the same method name with different parameters for flexibility.",
    outcomes: ["Write default and parameterized constructors", "Use this() for constructor chaining", "Overload methods with different signatures"],
    codePreview: `class Point {\n    int x, y;\n    Point() { this(0, 0); }\n    Point(int x, int y) { this.x = x; this.y = y; }\n    String describe() { return "(" + x + "," + y + ")"; }\n}`,
  },
  JV_L2_03_ENCAP: {
    sutra: "Encapsulation Sutra", durationMin: 55, difficulty: 2,
    objective: "Apply private access modifiers, getters, setters with validation to encapsulate class data.",
    summary: "Encapsulation hides internal state and forces all access through controlled methods. Setters can validate data before storing it.",
    outcomes: ["Make fields private", "Write getters and setters", "Validate data inside setters"],
    codePreview: `class BankAccount {\n    private double balance;\n    public void deposit(double amt) {\n        if (amt > 0) balance += amt;\n    }\n    public double getBalance() { return balance; }\n}`,
  },
  JV_L2_04_INHERIT: {
    sutra: "Inheritance Sutra", durationMin: 55, difficulty: 3,
    objective: "Use extends and super to build class hierarchies and override parent methods.",
    summary: "Inheritance lets a child class reuse and extend a parent's behaviour. super() calls the parent constructor; @Override redefines a method.",
    outcomes: ["Extend a class with extends", "Call super() in constructors", "Override methods with @Override"],
    codePreview: `class Animal {\n    String name;\n    Animal(String n) { name = n; }\n    void speak() { System.out.println(name + " makes a sound"); }\n}\nclass Dog extends Animal {\n    Dog(String n) { super(n); }\n    @Override void speak() { System.out.println(name + " barks!"); }\n}`,
  },
  JV_L2_05_POLY: {
    sutra: "Polymorphism Sutra", durationMin: 60, difficulty: 3,
    objective: "Define interfaces, implement them in multiple classes, and use polymorphic references.",
    summary: "Interfaces define contracts. A class can implement many interfaces. Polymorphism means one reference type can point to different implementations.",
    outcomes: ["Define an interface with method signatures", "Implement an interface in a class", "Use interface references for polymorphism"],
    codePreview: `interface Drawable {\n    void draw();\n}\nclass Circle implements Drawable {\n    public void draw() { System.out.println("Drawing circle"); }\n}\nDrawable d = new Circle();\nd.draw();`,
  },
  JV_L2_06_ABSTRACT: {
    sutra: "Abstract Sutra", durationMin: 60, difficulty: 3,
    objective: "Write abstract classes with abstract methods, and create enums with fields and behaviour.",
    summary: "Abstract classes can't be instantiated — they define structure for subclasses. Enums are type-safe constants that can carry data and methods.",
    outcomes: ["Write an abstract class with abstract methods", "Create concrete subclasses", "Define enums with fields and methods"],
    codePreview: `abstract class Shape {\n    abstract double area();\n    void print() { System.out.printf("Area: %.2f%n", area()); }\n}\nclass Circle extends Shape {\n    double r;\n    Circle(double r) { this.r = r; }\n    double area() { return Math.PI * r * r; }\n}`,
  },
};

// ── Level config ──────────────────────────────────────────────────────────────

type LessonMeta = typeof YAMUNA_LEVEL1_LESSONS;

const LEVEL_CONFIG: Record<string, {
  lessons: LessonMeta;
  levelId: string; title: string; subtitle: string; tagline: string; chapterIds: string[];
}> = {
  "level-1": {
    lessons: YAMUNA_LEVEL1_LESSONS,
    levelId: "L1",
    title: "Yamuna Java Core",
    subtitle: "Level 1 — Foundations",
    tagline: "Master the syntax. Understand the JVM. Write your first Java programs.",
    chapterIds: ["JCH01_HELLO","JCH02_VARS","JCH03_MATH","JCH04_LOGIC","JCH05_LOOPS","JCH06_ARRAYS"],
  },
  "level-2": {
    lessons: YAMUNA_LEVEL2_LESSONS,
    levelId: "L2",
    title: "Yamuna Java Core",
    subtitle: "Level 2 — Object-Oriented Programming",
    tagline: "Think in objects. Design with classes. Master the pillars of OOP.",
    chapterIds: ["JCH07_CLASS","JCH08_CONSTRUCT","JCH09_ENCAP","JCH10_INHERIT","JCH11_POLY","JCH12_ABSTRACT"],
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function YamunaLevelPage({ params }: { params: { level: string } }) {
  const { level } = params;
  const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG["level-1"];

  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);

  let completedLessons: string[] = [];
  if (session) {
    try {
      const studentId = session.childId || session.userId;
      completedLessons = await loadYamunaCompletedLessons(studentId);
    } catch (e) {
      console.error("[YamunaLevelPage] Failed to fetch progress:", e);
    }
  }

  const completedSet = new Set(completedLessons);
  const { lessons: levelLessons, levelId, title, subtitle, tagline, chapterIds } = config;

  const firstIncomplete = levelLessons.find((l) => !completedSet.has(l.id));
  const currentId = firstIncomplete?.id ?? levelLessons[levelLessons.length - 1].id;

  const lessons = levelLessons.map((meta, i) => {
    const extra = LESSON_META[meta.id];
    let status: "completed" | "current" | "available" | "locked" = "available";
    if (completedSet.has(meta.id)) status = "completed";
    else if (meta.id === currentId) status = "current";

    return {
      id: meta.id,
      order: i + 1,
      title: meta.title,
      sutra: extra?.sutra ?? "",
      objective: extra?.objective ?? "",
      durationMin: extra?.durationMin ?? 45,
      difficulty: extra?.difficulty ?? 1,
      status,
      summary: extra?.summary ?? "",
      outcomes: extra?.outcomes ?? [],
      codePreview: extra?.codePreview ?? "",
      startUrl: `/yamuna/lesson/${meta.id}`,
      practiceUrl: `/yamuna/practice/${chapterIds[i] ?? chapterIds[0]}`,
    };
  });

  const completedLessonsCount = lessons.filter((l) => l.status === "completed").length;
  const totalLessons = levelLessons.length;
  const progressPct = Math.round((completedLessonsCount / totalLessons) * 100);
  const earnedXp = completedLessonsCount * 100;

  const payload = {
    course: {
      id: "yamuna_core",
      levelId,
      levelSlug: level,
      title,
      subtitle,
      tagline,
      completedLessons: completedLessonsCount,
      totalLessons,
      progressPct,
      earnedXp,
      totalXpAvailable: totalLessons * 100,
    },
    lessons,
    selectedLessonId: currentId,
  };

  return <YamunaCourseClient payload={payload} />;
}
