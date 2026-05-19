/**
 * Yamuna Java Project Bank
 *
 * Real-world multi-file Java projects that take students from
 * in-browser challenge practice into professional IDE development.
 * Covers Maven, Gradle, JUnit 5, Spring Boot, Git, and GitHub Actions CI/CD.
 */

import type { DevProject } from "./devProjectTypes";

export const YAMUNA_PROJECTS: DevProject[] = [

  // ── 1. Maven Hello World (Starter) ────────────────────────────────────────
  {
    id: "java-hello-maven",
    platform: "java",
    tier: "starter",
    title: "Hello Java — Maven Quickstart",
    emoji: "☕",
    tagline: "Your first Maven project from scratch",
    description:
      "Set up a complete Java project from zero using Maven, run it from the terminal, " +
      "and understand the standard directory layout (src/main, src/test). " +
      "You'll also write your first JUnit 5 test and run mvn test.",
    estimatedHours: 2,
    prereqLevel: "level-1",
    prereqTopics: ["Variables", "Data Types", "Methods", "Control Flow"],
    buildTool: "maven",
    versionMeta: {
      javaVersion: "21",
      buildToolVersion: "3.9",
      dependencies: { junit: "5.10.0" },
    },
    primaryIde: "vscode",
    ideSetups: [
      {
        ide: "vscode",
        label: "VS Code",
        logoEmoji: "🔷",
        downloadUrl: "https://code.visualstudio.com/",
        extensions: [
          { id: "redhat.java", name: "Language Support for Java", required: true },
          { id: "vscjava.vscode-java-pack", name: "Java Extension Pack", required: false },
        ],
        steps: [
          "Install VS Code from code.visualstudio.com",
          "Install the Java Extension Pack (includes Language Support + Debugger + Maven + Test Runner)",
          "Open the project folder: File → Open Folder → select java-hello-maven/",
          "VS Code detects pom.xml automatically and activates Java support",
          "Open the terminal: Ctrl+` (backtick)",
          "Run: mvn compile then mvn exec:java -Dexec.mainClass='com.example.App'",
        ],
        terminalCommands: ["mvn compile", "mvn test", "mvn package"],
      },
      {
        ide: "intellij",
        label: "IntelliJ IDEA",
        logoEmoji: "🧠",
        downloadUrl: "https://www.jetbrains.com/idea/download/",
        steps: [
          "Download IntelliJ IDEA Community Edition (free)",
          "Open IntelliJ → Open → select the java-hello-maven folder",
          "IntelliJ auto-detects pom.xml and imports dependencies",
          "Click the green ▶ button next to the main() method to run",
          "View Maven lifecycle in the Maven tool window (right side panel)",
        ],
        terminalCommands: ["mvn clean install"],
      },
    ],
    files: [
      {
        path: "pom.xml",
        language: "xml",
        isKey: true,
        description: "Maven project descriptor — defines JDK version, dependencies, and plugins",
        content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>hello-java</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <junit.version>5.10.0</junit.version>
  </properties>

  <dependencies>
    <!-- JUnit 5 for unit testing -->
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>\${junit.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.2</version>
      </plugin>
    </plugins>
  </build>
</project>`,
      },
      {
        path: "src/main/java/com/example/App.java",
        language: "java",
        isKey: true,
        description: "Main application entry point",
        content: `package com.example;

/**
 * Hello Java — entry point.
 *
 * Challenge: Add a method greet(String name) that returns "Hello, {name}!"
 * and call it from main().
 */
public class App {

    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println(greet("Vidya Student"));
    }

    /**
     * Returns a personalised greeting.
     *
     * @param name The person to greet
     * @return "Hello, {name}!"
     */
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
      },
      {
        path: "src/test/java/com/example/AppTest.java",
        language: "java",
        isKey: true,
        description: "JUnit 5 unit tests for App",
        content: `package com.example;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for App.greet().
 * Run with: mvn test
 */
class AppTest {

    @Test
    void greetReturnsHelloMessage() {
        assertEquals("Hello, Alice!", App.greet("Alice"));
    }

    @Test
    void greetHandlesEmptyName() {
        assertEquals("Hello, !", App.greet(""));
    }

    @Test
    void greetIsNotNull() {
        assertNotNull(App.greet("Bob"));
    }
}`,
      },
      {
        path: ".github/workflows/ci.yml",
        language: "yaml",
        description: "GitHub Actions — build + test on every push",
        content: `name: Java CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Build with Maven
        run: mvn -B package --file pom.xml

      - name: Run tests
        run: mvn test`,
      },
      {
        path: ".gitignore",
        language: "text",
        isGenerated: true,
        description: "Tell Git what not to track",
        content: `# Maven build output
target/

# IDE files
.idea/
*.iml
.vscode/
*.classpath
*.project
.settings/

# System files
.DS_Store
Thumbs.db`,
      },
      {
        path: "README.md",
        language: "text",
        description: "Project documentation",
        content: `# Hello Java — Maven Quickstart

A minimal Java project with Maven, JUnit 5, and GitHub Actions CI.

## Prerequisites
- JDK 21+
- Maven 3.9+

## Quick start
\`\`\`bash
mvn compile
mvn exec:java -Dexec.mainClass="com.example.App"
mvn test
\`\`\`

## What you'll learn
- Maven project structure (src/main, src/test, pom.xml)
- Writing and running JUnit 5 tests
- Automating builds with GitHub Actions`,
      },
    ],
    gitWorkflow: {
      gitignore: `target/\n.idea/\n*.iml\n.vscode/\n.DS_Store`,
      ciWorkflow: `name: Java CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with: { java-version: '21', distribution: 'temurin', cache: maven }\n      - run: mvn -B package`,
      branchStrategy: "main (protected) + feature/* branches. Open a PR to merge into main.",
      commitConvention: "Conventional Commits — feat:, fix:, test:, docs:, chore:",
      commitExamples: [
        "feat: add greet() method that returns personalised message",
        "test: add boundary test for empty name in AppTest",
        "chore: update Maven Surefire plugin to 3.2.2",
      ],
    },
    concepts: ["Maven", "JUnit 5", "Project structure", "GitHub Actions", "Git workflow"],
    learningObjectives: [
      "Create a Maven project from scratch without an IDE wizard",
      "Understand the src/main/java and src/test/java layout",
      "Write and run JUnit 5 unit tests with @Test, assertEquals",
      "Read and modify a pom.xml — add dependencies, set JDK version",
      "Set up a GitHub Actions workflow that builds and tests on every push",
    ],
    portfolioLine: "Java Maven project with JUnit 5 tests and GitHub Actions CI",
    githubTemplateUrl: "https://github.com/robodynamics/yamuna-starter-maven",
    gitpodUrl: "https://gitpod.io/#https://github.com/robodynamics/yamuna-starter-maven",
    tags: ["maven", "junit5", "ci-cd", "beginner", "java21"],
  },

  // ── 2. OOP Grade Calculator — Gradle + JUnit 5 (Intermediate) ────────────
  {
    id: "java-grade-calculator-gradle",
    platform: "java",
    tier: "intermediate",
    title: "Grade Calculator — Gradle + OOP",
    emoji: "📊",
    tagline: "Multi-class OOP project with Gradle and JUnit 5",
    description:
      "Build a grade calculator using multiple classes (Student, Subject, GradeBook). " +
      "Learn Gradle's Kotlin DSL (build.gradle.kts), encapsulation, and write " +
      "comprehensive JUnit 5 tests including edge cases.",
    estimatedHours: 4,
    prereqLevel: "level-2",
    prereqTopics: ["Classes", "Objects", "Encapsulation", "ArrayLists", "Constructors"],
    buildTool: "gradle",
    versionMeta: {
      javaVersion: "21",
      buildToolVersion: "8.5",
      dependencies: { "junit-jupiter": "5.10.0" },
    },
    primaryIde: "intellij",
    ideSetups: [
      {
        ide: "intellij",
        label: "IntelliJ IDEA",
        logoEmoji: "🧠",
        downloadUrl: "https://www.jetbrains.com/idea/download/",
        steps: [
          "Open IntelliJ IDEA → Open → select the grade-calculator folder",
          "IntelliJ detects build.gradle.kts and imports Gradle project automatically",
          "Wait for the Gradle sync to finish (progress bar at the bottom)",
          "Run tests: right-click src/test → Run All Tests",
          "Run main: click ▶ next to GradeBookApp.main()",
        ],
        terminalCommands: ["./gradlew build", "./gradlew test", "./gradlew run"],
      },
      {
        ide: "vscode",
        label: "VS Code",
        logoEmoji: "🔷",
        downloadUrl: "https://code.visualstudio.com/",
        extensions: [
          { id: "vscjava.vscode-java-pack", name: "Java Extension Pack", required: true },
          { id: "vscjava.vscode-gradle", name: "Gradle for Java", required: true },
        ],
        steps: [
          "Open the grade-calculator folder in VS Code",
          "Install the Java Extension Pack and Gradle for Java extensions",
          "Open Terminal → run: ./gradlew build",
          "Use the Gradle panel (left sidebar) to run tasks",
        ],
        terminalCommands: ["./gradlew build", "./gradlew test"],
      },
    ],
    files: [
      {
        path: "build.gradle.kts",
        language: "kotlin",
        isKey: true,
        description: "Gradle Kotlin DSL build file",
        content: `plugins {
    java
    application
}

group = "com.example"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

application {
    mainClass = "com.example.GradeBookApp"
}

tasks.test {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
    }
}`,
      },
      {
        path: "src/main/java/com/example/Student.java",
        language: "java",
        isKey: true,
        description: "Student entity with name, ID, and subject grades",
        content: `package com.example;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a student with a name, roll number, and a list of subjects.
 *
 * Design principles:
 *   - Fields are private (encapsulation)
 *   - Computed properties (average, grade) are derived from data
 *   - Immutable name and rollNumber (set in constructor only)
 */
public class Student {

    private final String name;
    private final String rollNumber;
    private final List<Subject> subjects;

    public Student(String name, String rollNumber) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Name cannot be empty");
        if (rollNumber == null || rollNumber.isBlank()) throw new IllegalArgumentException("Roll number cannot be empty");
        this.name = name;
        this.rollNumber = rollNumber;
        this.subjects = new ArrayList<>();
    }

    /** Add a subject to this student's record. */
    public void addSubject(Subject subject) {
        if (subject == null) throw new IllegalArgumentException("Subject cannot be null");
        subjects.add(subject);
    }

    /** Returns the average marks across all subjects (0.0 if no subjects). */
    public double getAverage() {
        if (subjects.isEmpty()) return 0.0;
        double total = subjects.stream().mapToDouble(Subject::getMarks).sum();
        return total / subjects.size();
    }

    /** Returns the letter grade based on the average. */
    public String getLetterGrade() {
        double avg = getAverage();
        if (avg >= 90) return "A+";
        if (avg >= 80) return "A";
        if (avg >= 70) return "B";
        if (avg >= 60) return "C";
        if (avg >= 50) return "D";
        return "F";
    }

    public String getName()         { return name; }
    public String getRollNumber()   { return rollNumber; }
    public List<Subject> getSubjects() { return List.copyOf(subjects); }

    @Override
    public String toString() {
        return String.format("Student[%s | %s | avg=%.1f | grade=%s]",
            rollNumber, name, getAverage(), getLetterGrade());
    }
}`,
      },
      {
        path: "src/main/java/com/example/Subject.java",
        language: "java",
        description: "Subject value object — name + marks out of 100",
        content: `package com.example;

/**
 * Represents a subject with a name and marks obtained (0-100).
 */
public class Subject {

    private final String name;
    private final double marks;

    public Subject(String name, double marks) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Subject name cannot be empty");
        if (marks < 0 || marks > 100) throw new IllegalArgumentException("Marks must be between 0 and 100");
        this.name = name;
        this.marks = marks;
    }

    public String getName()  { return name; }
    public double getMarks() { return marks; }

    @Override
    public String toString() { return name + ": " + marks; }
}`,
      },
      {
        path: "src/main/java/com/example/GradeBookApp.java",
        language: "java",
        isKey: true,
        description: "Main entry point — demo GradeBook",
        content: `package com.example;

/**
 * GradeBook demo application.
 * Run with: ./gradlew run
 */
public class GradeBookApp {

    public static void main(String[] args) {
        Student alice = new Student("Alice", "S001");
        alice.addSubject(new Subject("Maths", 92));
        alice.addSubject(new Subject("Science", 88));
        alice.addSubject(new Subject("English", 75));

        Student bob = new Student("Bob", "S002");
        bob.addSubject(new Subject("Maths", 55));
        bob.addSubject(new Subject("Science", 62));
        bob.addSubject(new Subject("English", 48));

        System.out.println("=== Grade Book Report ===");
        for (Student s : new Student[]{alice, bob}) {
            System.out.printf("%-20s  Avg: %5.1f  Grade: %s%n",
                s.getName(), s.getAverage(), s.getLetterGrade());
        }
    }
}`,
      },
      {
        path: "src/test/java/com/example/StudentTest.java",
        language: "java",
        isKey: true,
        description: "JUnit 5 tests for Student and grading logic",
        content: `package com.example;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

class StudentTest {

    @Test
    void averageOfThreeSubjectsIsCorrect() {
        Student s = new Student("Test", "T01");
        s.addSubject(new Subject("A", 90));
        s.addSubject(new Subject("B", 80));
        s.addSubject(new Subject("C", 70));
        assertEquals(80.0, s.getAverage(), 0.001);
    }

    @Test
    void averageIsZeroWhenNoSubjects() {
        Student s = new Student("Empty", "E01");
        assertEquals(0.0, s.getAverage(), 0.001);
    }

    @ParameterizedTest(name = "avg={0} -> grade={1}")
    @CsvSource({ "95, A+", "85, A", "75, B", "65, C", "52, D", "30, F" })
    void gradeMapping(double avg, String expected) {
        Student s = new Student("G", "G01");
        // Add two subjects that average to the target
        s.addSubject(new Subject("X", avg));
        assertEquals(expected, s.getLetterGrade());
    }

    @Test
    void constructorThrowsOnBlankName() {
        assertThrows(IllegalArgumentException.class, () -> new Student("", "X01"));
    }

    @Test
    void subjectThrowsOnOutOfRangeMarks() {
        assertThrows(IllegalArgumentException.class, () -> new Subject("Maths", 101));
        assertThrows(IllegalArgumentException.class, () -> new Subject("Maths", -1));
    }
}`,
      },
      {
        path: ".github/workflows/ci.yml",
        language: "yaml",
        description: "GitHub Actions — Gradle build + test",
        content: `name: Java Gradle CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      - name: Grant execute permission for gradlew
        run: chmod +x gradlew
      - name: Build and test with Gradle
        run: ./gradlew build`,
      },
      {
        path: ".gitignore",
        language: "text",
        isGenerated: true,
        description: "Standard Gradle .gitignore",
        content: `.gradle/
build/
.idea/
*.iml
.vscode/
.DS_Store`,
      },
    ],
    gitWorkflow: {
      gitignore: `.gradle/\nbuild/\n.idea/\n*.iml\n.vscode/\n.DS_Store`,
      ciWorkflow: `name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with: {java-version: '21', distribution: 'temurin'}\n      - run: chmod +x gradlew && ./gradlew build`,
      branchStrategy: "main (protected) + feature/* branches for new features or bug fixes.",
      commitConvention: "Conventional Commits",
      commitExamples: [
        "feat: add getLetterGrade() with A+/A/B/C/D/F bands",
        "test: add parameterized tests for all grade boundaries",
        "fix: throw IllegalArgumentException when marks > 100",
      ],
    },
    concepts: ["Gradle Kotlin DSL", "OOP Encapsulation", "JUnit 5 Parameterized Tests", "GitHub Actions"],
    learningObjectives: [
      "Set up a Gradle project with Kotlin DSL (build.gradle.kts)",
      "Design a multi-class OOP model (Student, Subject, GradeBook)",
      "Write parameterized JUnit 5 tests with @CsvSource",
      "Use List.copyOf() for defensive copying",
      "Run Gradle tasks from the terminal: build, test, run",
    ],
    portfolioLine: "Multi-class OOP grade book in Java with Gradle and JUnit 5 parameterized tests",
    tags: ["gradle", "oop", "junit5", "encapsulation", "intermediate"],
  },

  // ── 3. Bank Account System — Maven + CI/CD (Advanced) ─────────────────────
  {
    id: "java-bank-account-maven",
    platform: "java",
    tier: "advanced",
    title: "Bank Account System — Maven + Full CI/CD",
    emoji: "🏦",
    tagline: "Exception handling, inheritance, and GitHub Actions deploy pipeline",
    description:
      "Build a complete bank account system with inheritance (SavingsAccount, CurrentAccount), " +
      "custom exceptions (InsufficientFundsException), and a full Maven CI/CD pipeline " +
      "that compiles, tests, and packages a runnable JAR on every push.",
    estimatedHours: 6,
    prereqLevel: "level-2",
    prereqTopics: ["Inheritance", "Polymorphism", "Exception Handling", "Abstract Classes", "Interfaces"],
    buildTool: "maven",
    versionMeta: {
      javaVersion: "21",
      buildToolVersion: "3.9",
      dependencies: { junit: "5.10.0" },
    },
    primaryIde: "intellij",
    ideSetups: [
      {
        ide: "intellij",
        label: "IntelliJ IDEA",
        logoEmoji: "🧠",
        downloadUrl: "https://www.jetbrains.com/idea/download/",
        steps: [
          "Open IntelliJ → Open → select bank-account-system/",
          "IntelliJ detects pom.xml and syncs Maven automatically",
          "Run tests: right-click src/test → Run All Tests",
          "Package: open Maven panel → Lifecycle → package",
          "Run the JAR: java -jar target/bank-account-1.0.0.jar",
        ],
        terminalCommands: ["mvn test", "mvn package", "java -jar target/bank-account-1.0.0.jar"],
      },
    ],
    files: [
      {
        path: "pom.xml",
        language: "xml",
        isKey: true,
        description: "Maven POM with exec plugin for running as fat JAR",
        content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>bank-account</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.0</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.3.0</version>
        <configuration>
          <archive>
            <manifest>
              <mainClass>com.example.BankApp</mainClass>
            </manifest>
          </archive>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.2</version>
      </plugin>
    </plugins>
  </build>
</project>`,
      },
      {
        path: "src/main/java/com/example/BankAccount.java",
        language: "java",
        isKey: true,
        description: "Abstract base class for all account types",
        content: `package com.example;

/**
 * Abstract base class for bank accounts.
 * Concrete subclasses: SavingsAccount, CurrentAccount.
 */
public abstract class BankAccount {

    private final String accountNumber;
    private final String holderName;
    protected double balance;

    public BankAccount(String accountNumber, String holderName, double initialBalance) {
        if (initialBalance < 0) throw new IllegalArgumentException("Initial balance cannot be negative");
        this.accountNumber = accountNumber;
        this.holderName    = holderName;
        this.balance       = initialBalance;
    }

    /** Deposits amount into the account. */
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit amount must be positive");
        balance += amount;
    }

    /**
     * Withdraws amount from the account.
     * Subclasses may override to enforce different rules (e.g. overdraft).
     */
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount <= 0) throw new IllegalArgumentException("Withdrawal amount must be positive");
        if (amount > balance) throw new InsufficientFundsException(amount, balance);
        balance -= amount;
    }

    public double  getBalance()       { return balance; }
    public String  getAccountNumber() { return accountNumber; }
    public String  getHolderName()    { return holderName; }

    /** Returns a human-readable account type label. */
    public abstract String getAccountType();

    @Override
    public String toString() {
        return String.format("[%s] %s (%s) — Balance: %.2f",
            getAccountType(), holderName, accountNumber, balance);
    }
}`,
      },
      {
        path: "src/main/java/com/example/SavingsAccount.java",
        language: "java",
        description: "Savings account — earns interest",
        content: `package com.example;

/**
 * Savings account with a minimum balance requirement and annual interest.
 */
public class SavingsAccount extends BankAccount {

    private static final double MIN_BALANCE = 500.0;
    private final double interestRatePercent;

    public SavingsAccount(String accountNumber, String holderName,
                          double initialBalance, double interestRatePercent) {
        super(accountNumber, holderName, initialBalance);
        if (initialBalance < MIN_BALANCE)
            throw new IllegalArgumentException("Savings account requires minimum balance of " + MIN_BALANCE);
        this.interestRatePercent = interestRatePercent;
    }

    @Override
    public void withdraw(double amount) throws InsufficientFundsException {
        if (balance - amount < MIN_BALANCE)
            throw new InsufficientFundsException(amount, balance - MIN_BALANCE);
        super.withdraw(amount);
    }

    /** Adds annual interest to the account balance. */
    public void applyInterest() {
        balance += balance * (interestRatePercent / 100.0);
    }

    @Override
    public String getAccountType() { return "Savings"; }
}`,
      },
      {
        path: "src/main/java/com/example/InsufficientFundsException.java",
        language: "java",
        isKey: true,
        description: "Custom checked exception for overdraft attempts",
        content: `package com.example;

/**
 * Thrown when a withdrawal exceeds the available balance (or minimum balance limit).
 */
public class InsufficientFundsException extends Exception {

    private final double requested;
    private final double available;

    public InsufficientFundsException(double requested, double available) {
        super(String.format("Cannot withdraw %.2f — only %.2f available", requested, available));
        this.requested = requested;
        this.available = available;
    }

    public double getRequested() { return requested; }
    public double getAvailable() { return available; }
}`,
      },
      {
        path: "src/main/java/com/example/BankApp.java",
        language: "java",
        description: "Main demo application",
        content: `package com.example;

public class BankApp {
    public static void main(String[] args) {
        try {
            SavingsAccount savings = new SavingsAccount("SAV001", "Alice", 2000, 5.0);
            savings.deposit(1000);
            savings.withdraw(500);
            savings.applyInterest();
            System.out.println(savings);

            savings.withdraw(3000); // This will throw InsufficientFundsException
        } catch (InsufficientFundsException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`,
      },
      {
        path: "src/test/java/com/example/BankAccountTest.java",
        language: "java",
        isKey: true,
        description: "Comprehensive JUnit 5 tests",
        content: `package com.example;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class BankAccountTest {

    @Test
    void depositIncreasesBalance() {
        SavingsAccount acc = new SavingsAccount("S1", "Alice", 1000, 5);
        acc.deposit(500);
        assertEquals(1500.0, acc.getBalance(), 0.001);
    }

    @Test
    void withdrawReducesBalance() throws InsufficientFundsException {
        SavingsAccount acc = new SavingsAccount("S2", "Bob", 2000, 5);
        acc.withdraw(1000);
        assertEquals(1000.0, acc.getBalance(), 0.001);
    }

    @Test
    void withdrawThrowsWhenBelowMinBalance() {
        SavingsAccount acc = new SavingsAccount("S3", "Carol", 1000, 5);
        assertThrows(InsufficientFundsException.class, () -> acc.withdraw(600));
    }

    @Test
    void applyInterestIncreasesBalance() {
        SavingsAccount acc = new SavingsAccount("S4", "Dave", 1000, 10);
        acc.applyInterest();
        assertEquals(1100.0, acc.getBalance(), 0.001);
    }

    @Test
    void negativeDepositThrows() {
        SavingsAccount acc = new SavingsAccount("S5", "Eve", 1000, 5);
        assertThrows(IllegalArgumentException.class, () -> acc.deposit(-100));
    }
}`,
      },
      {
        path: ".github/workflows/ci.yml",
        language: "yaml",
        description: "CI pipeline: compile → test → package JAR",
        content: `name: Bank Account CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven
      - name: Compile, Test, Package
        run: mvn -B package
      - name: Upload JAR artifact
        uses: actions/upload-artifact@v4
        with:
          name: bank-account-jar
          path: target/*.jar`,
      },
      {
        path: ".gitignore",
        language: "text",
        isGenerated: true,
        description: "Standard Java .gitignore",
        content: `target/\n.idea/\n*.iml\n.vscode/\n.DS_Store`,
      },
    ],
    gitWorkflow: {
      gitignore: `target/\n.idea/\n*.iml\n.vscode/\n.DS_Store`,
      ciWorkflow: `name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with: {java-version: '21', distribution: 'temurin', cache: maven}\n      - run: mvn -B package`,
      branchStrategy: "Gitflow — main, develop, feature/*, hotfix/*",
      commitConvention: "Conventional Commits",
      commitExamples: [
        "feat: add InsufficientFundsException with requested/available fields",
        "feat: implement SavingsAccount with minimum balance enforcement",
        "test: add boundary tests for minimum balance in SavingsAccount",
        "ci: upload compiled JAR as GitHub Actions artifact",
      ],
    },
    concepts: ["Abstract Classes", "Inheritance", "Custom Exceptions", "Maven Packaging", "CI/CD Artifacts"],
    learningObjectives: [
      "Design an inheritance hierarchy with abstract classes",
      "Create and throw custom checked exceptions",
      "Override methods in subclasses (withdraw with extra constraints)",
      "Package a runnable JAR with Maven and the jar plugin",
      "Upload build artifacts in GitHub Actions for distribution",
    ],
    portfolioLine: "Java bank account system with inheritance, custom exceptions, and automated CI/CD pipeline",
    tags: ["maven", "inheritance", "exceptions", "ci-cd", "advanced"],
  },
];
