import type { YamunaProgram } from "./yamunaProgramTypes";

export const CH09_PROGRAMS: YamunaProgram[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH09_B1",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "beginner",
    tierIndex: 0,
    title: "Private Fields & Getters/Setters",
    emoji: "🔒",
    tagline: "Wrap a person's name and age behind private fields with accessors.",
    problemStatement:
      "Create a class `Person` with private fields `name` (String) and `age` (int). Provide public getters `getName()`, `getAge()` and setters `setName(String)`, `setAge(int)`. In `Main`, read a name and an age, set them on a `Person` object, then print the object's info as shown.",
    inputFormat: "Line 1: the person's name (no spaces).\nLine 2: the person's age (integer).",
    outputFormat: "\"Name: <name>, Age: <age>\"",
    examples: [
      {
        input: "Alice\n30",
        output: "Name: Alice, Age: 30",
      },
      {
        input: "Bob\n25",
        output: "Name: Bob, Age: 25",
      },
    ],
    constraints: ["Name is a single word.", "0 <= age <= 150"],
    hints: [
      "Declare `private String name;` and `private int age;` inside the Person class.",
      "Getter: `public String getName() { return name; }`",
      "Setter: `public void setName(String name) { this.name = name; }`",
      "In Main: `Person p = new Person(); p.setName(sc.next()); p.setAge(sc.nextInt());`",
      "Print: `System.out.println(\"Name: \" + p.getName() + \", Age: \" + p.getAge());`",
    ],
    referenceProgram: {
      title: "Person with Getters and Setters",
      description: "Basic encapsulation: private fields, public accessors.",
      code: `import java.util.Scanner;
class Person {
    private String name;
    private int age;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Person p = new Person();
        p.setName(sc.next());
        p.setAge(sc.nextInt());
        System.out.println("Name: " + p.getName() + ", Age: " + p.getAge());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Person {
    // TODO: declare private fields name and age
    // TODO: add getters and setters
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Person p = new Person();
        // TODO: read name and age, set on p, then print
    }
}`,
    solution: `import java.util.Scanner;
class Person {
    private String name;
    private int age;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Person p = new Person();
        p.setName(sc.next());
        p.setAge(sc.nextInt());
        System.out.println("Name: " + p.getName() + ", Age: " + p.getAge());
    }
}`,
    testCases: [
      {
        id: "JCH09_B1_T1",
        label: "Alice 30",
        mockInputs: ["Alice", "30"],
        expectedOutput: "Name: Alice, Age: 30",
      },
      {
        id: "JCH09_B1_T2",
        label: "Bob 25",
        mockInputs: ["Bob", "25"],
        expectedOutput: "Name: Bob, Age: 25",
      },
      {
        id: "JCH09_B1_T3",
        label: "Age 0 boundary",
        mockInputs: ["Zara", "0"],
        expectedOutput: "Name: Zara, Age: 0",
        isBoundary: true,
      },
      {
        id: "JCH09_B1_T4",
        label: "Large age",
        mockInputs: ["Charlie", "99"],
        expectedOutput: "Name: Charlie, Age: 99",
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "private fields", "getters", "setters", "this keyword"],
    xpReward: 50,
    estimatedMinutes: 8,
  },

  {
    id: "JCH09_B2",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "beginner",
    tierIndex: 1,
    title: "Setter Validation",
    emoji: "✅",
    tagline: "Reject invalid values inside setters to protect object state.",
    problemStatement:
      "Create a class `Temperature` with a private `double celsius` field. The setter `setCelsius(double)` should only accept values >= -273.15 (absolute zero); if the value is below that, store -273.15 instead. Provide a getter `getCelsius()`. In `Main`, read a double, set it, then print the stored value formatted to 2 decimal places.",
    inputFormat: "One line: a double value.",
    outputFormat: "\"Celsius: <value>\" formatted to 2 decimal places.",
    examples: [
      {
        input: "100.0",
        output: "Celsius: 100.00",
      },
      {
        input: "-300.0",
        output: "Celsius: -273.15",
        explanation: "-300.0 is below absolute zero, so clamped to -273.15.",
      },
    ],
    constraints: ["-1000.0 <= input <= 1000.0"],
    hints: [
      "In the setter: `if (celsius < -273.15) this.celsius = -273.15; else this.celsius = celsius;`",
      "Getter returns `this.celsius`.",
      "Use `System.out.printf(\"Celsius: %.2f%n\", t.getCelsius());`",
    ],
    referenceProgram: {
      title: "Temperature with Validation",
      description: "Setter guards against sub-absolute-zero values.",
      code: `import java.util.Scanner;
class Temperature {
    private double celsius;
    public void setCelsius(double celsius) {
        this.celsius = celsius < -273.15 ? -273.15 : celsius;
    }
    public double getCelsius() { return celsius; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Temperature t = new Temperature();
        t.setCelsius(sc.nextDouble());
        System.out.printf("Celsius: %.2f%n", t.getCelsius());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Temperature {
    private double celsius;
    // TODO: setter with validation (min -273.15) and getter
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Temperature t = new Temperature();
        // TODO: read, set, then print with 2 decimal places
    }
}`,
    solution: `import java.util.Scanner;
class Temperature {
    private double celsius;
    public void setCelsius(double celsius) {
        this.celsius = celsius < -273.15 ? -273.15 : celsius;
    }
    public double getCelsius() { return celsius; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Temperature t = new Temperature();
        t.setCelsius(sc.nextDouble());
        System.out.printf("Celsius: %.2f%n", t.getCelsius());
    }
}`,
    testCases: [
      {
        id: "JCH09_B2_T1",
        label: "Normal value",
        mockInputs: ["100.0"],
        expectedOutput: "Celsius: 100.00",
      },
      {
        id: "JCH09_B2_T2",
        label: "Below absolute zero",
        mockInputs: ["-300.0"],
        expectedOutput: "Celsius: -273.15",
        isBoundary: true,
      },
      {
        id: "JCH09_B2_T3",
        label: "Exactly absolute zero",
        mockInputs: ["-273.15"],
        expectedOutput: "Celsius: -273.15",
        isBoundary: true,
      },
      {
        id: "JCH09_B2_T4",
        label: "Zero degrees",
        mockInputs: ["0.0"],
        expectedOutput: "Celsius: 0.00",
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "setter validation", "boundary check", "printf"],
    xpReward: 60,
    estimatedMinutes: 10,
  },

  {
    id: "JCH09_B3",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "beginner",
    tierIndex: 2,
    title: "Rectangle Encapsulation",
    emoji: "📐",
    tagline: "Encapsulate width and height; expose computed area and perimeter.",
    problemStatement:
      "Create a class `Rectangle` with private `int width` and `int height`. Add setters `setWidth(int)` and `setHeight(int)` that reject values <= 0 (store 1 if invalid). Add getter methods `getWidth()`, `getHeight()`, `getArea()`, and `getPerimeter()`. Read two integers, build the rectangle, and print its properties.",
    inputFormat: "Line 1: width. Line 2: height (both integers).",
    outputFormat:
      "\"Width: <w>\"\n\"Height: <h>\"\n\"Area: <a>\"\n\"Perimeter: <p>\"",
    examples: [
      {
        input: "5\n3",
        output: "Width: 5\nHeight: 3\nArea: 15\nPerimeter: 16",
      },
      {
        input: "-2\n4",
        output: "Width: 1\nHeight: 4\nArea: 4\nPerimeter: 10",
        explanation: "Invalid width -2 stored as 1.",
      },
    ],
    constraints: ["Values may be negative or zero (treated as invalid, stored as 1)."],
    hints: [
      "In setter: `if (width <= 0) this.width = 1; else this.width = width;`",
      "`getArea()` returns `width * height`.",
      "`getPerimeter()` returns `2 * (width + height)`.",
    ],
    referenceProgram: {
      title: "Rectangle with Validation",
      description: "Encapsulate dimensions; reject non-positive values.",
      code: `import java.util.Scanner;
class Rectangle {
    private int width, height;
    public void setWidth(int w)  { this.width  = w <= 0 ? 1 : w; }
    public void setHeight(int h) { this.height = h <= 0 ? 1 : h; }
    public int getWidth()     { return width; }
    public int getHeight()    { return height; }
    public int getArea()      { return width * height; }
    public int getPerimeter() { return 2 * (width + height); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rectangle r = new Rectangle();
        r.setWidth(sc.nextInt());
        r.setHeight(sc.nextInt());
        System.out.println("Width: "     + r.getWidth());
        System.out.println("Height: "    + r.getHeight());
        System.out.println("Area: "      + r.getArea());
        System.out.println("Perimeter: " + r.getPerimeter());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Rectangle {
    private int width, height;
    // TODO: setters (reject <=0, store 1), getters, getArea, getPerimeter
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rectangle r = new Rectangle();
        // TODO: read width and height, set, then print 4 lines
    }
}`,
    solution: `import java.util.Scanner;
class Rectangle {
    private int width, height;
    public void setWidth(int w)  { this.width  = w <= 0 ? 1 : w; }
    public void setHeight(int h) { this.height = h <= 0 ? 1 : h; }
    public int getWidth()     { return width; }
    public int getHeight()    { return height; }
    public int getArea()      { return width * height; }
    public int getPerimeter() { return 2 * (width + height); }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rectangle r = new Rectangle();
        r.setWidth(sc.nextInt());
        r.setHeight(sc.nextInt());
        System.out.println("Width: "     + r.getWidth());
        System.out.println("Height: "    + r.getHeight());
        System.out.println("Area: "      + r.getArea());
        System.out.println("Perimeter: " + r.getPerimeter());
    }
}`,
    testCases: [
      {
        id: "JCH09_B3_T1",
        label: "5x3 rectangle",
        mockInputs: ["5", "3"],
        expectedOutput: "Width: 5\nHeight: 3\nArea: 15\nPerimeter: 16",
      },
      {
        id: "JCH09_B3_T2",
        label: "Negative width",
        mockInputs: ["-2", "4"],
        expectedOutput: "Width: 1\nHeight: 4\nArea: 4\nPerimeter: 10",
        isBoundary: true,
      },
      {
        id: "JCH09_B3_T3",
        label: "Zero dimensions",
        mockInputs: ["0", "0"],
        expectedOutput: "Width: 1\nHeight: 1\nArea: 1\nPerimeter: 4",
        isBoundary: true,
      },
      {
        id: "JCH09_B3_T4",
        label: "Square",
        mockInputs: ["6", "6"],
        expectedOutput: "Width: 6\nHeight: 6\nArea: 36\nPerimeter: 24",
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "computed properties", "setter validation", "getters"],
    xpReward: 70,
    estimatedMinutes: 10,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH09_I1",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "intermediate",
    tierIndex: 0,
    title: "Bank Account",
    emoji: "🏦",
    tagline: "Model a bank account with deposit, withdraw, and balance protection.",
    problemStatement:
      "Create a class `BankAccount` with a private `double balance` (starts at 0). Provide:\n- `deposit(double amount)`: adds amount if > 0.\n- `withdraw(double amount)`: deducts amount if > 0 and <= balance; otherwise print \"Insufficient funds\".\n- `getBalance()`: returns balance.\n\nRead N operations. Each operation is either `D <amount>` (deposit) or `W <amount>` (withdraw). After all operations, print the final balance formatted to 2 decimal places.",
    inputFormat:
      "Line 1: N (number of operations, 1 <= N <= 50).\nNext N lines: `D <amount>` or `W <amount>` (amount is a positive double).",
    outputFormat:
      "Any \"Insufficient funds\" messages on their own lines during processing, then \"Balance: <amount>\" formatted to 2 decimal places.",
    examples: [
      {
        input: "4\nD 100.0\nD 50.0\nW 30.0\nW 200.0",
        output: "Insufficient funds\nBalance: 120.00",
      },
      {
        input: "2\nD 500.0\nW 500.0",
        output: "Balance: 0.00",
      },
    ],
    constraints: ["1 <= N <= 50", "All amounts are positive doubles."],
    hints: [
      "In `withdraw`: `if (amount > balance) System.out.println(\"Insufficient funds\"); else balance -= amount;`",
      "Use `sc.next()` to read the operation letter, then `sc.nextDouble()` for the amount.",
      "Print balance at the end: `System.out.printf(\"Balance: %.2f%n\", account.getBalance());`",
    ],
    referenceProgram: {
      title: "BankAccount with Guards",
      description: "Encapsulated balance with deposit/withdraw business rules.",
      code: `import java.util.Scanner;
class BankAccount {
    private double balance = 0;
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) balance -= amount;
        else System.out.println("Insufficient funds");
    }
    public double getBalance() { return balance; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        BankAccount acc = new BankAccount();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            double amt = sc.nextDouble();
            if (op.equals("D")) acc.deposit(amt);
            else acc.withdraw(amt);
        }
        System.out.printf("Balance: %.2f%n", acc.getBalance());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class BankAccount {
    private double balance = 0;
    // TODO: deposit, withdraw (with "Insufficient funds" message), getBalance
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        BankAccount acc = new BankAccount();
        // TODO: process N operations and print final balance
    }
}`,
    solution: `import java.util.Scanner;
class BankAccount {
    private double balance = 0;
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) balance -= amount;
        else System.out.println("Insufficient funds");
    }
    public double getBalance() { return balance; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        BankAccount acc = new BankAccount();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            double amt = sc.nextDouble();
            if (op.equals("D")) acc.deposit(amt);
            else acc.withdraw(amt);
        }
        System.out.printf("Balance: %.2f%n", acc.getBalance());
    }
}`,
    testCases: [
      {
        id: "JCH09_I1_T1",
        label: "Deposit then overspend",
        mockInputs: ["4", "D 100.0", "D 50.0", "W 30.0", "W 200.0"],
        expectedOutput: "Insufficient funds\nBalance: 120.00",
      },
      {
        id: "JCH09_I1_T2",
        label: "Exact withdrawal",
        mockInputs: ["2", "D 500.0", "W 500.0"],
        expectedOutput: "Balance: 0.00",
      },
      {
        id: "JCH09_I1_T3",
        label: "Withdraw from empty",
        mockInputs: ["1", "W 100.0"],
        expectedOutput: "Insufficient funds\nBalance: 0.00",
        isBoundary: true,
      },
      {
        id: "JCH09_I1_T4",
        label: "Multiple deposits and withdrawals",
        mockInputs: ["5", "D 200.0", "W 50.0", "W 50.0", "D 10.0", "W 110.0"],
        expectedOutput: "Balance: 0.00",
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "business rules", "deposit/withdraw pattern", "Scanner"],
    xpReward: 100,
    estimatedMinutes: 12,
  },

  {
    id: "JCH09_I2",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "intermediate",
    tierIndex: 1,
    title: "Chained Setters (Builder Style)",
    emoji: "⛓️",
    tagline: "Return `this` from setters to enable a fluent-builder call chain.",
    problemStatement:
      "Create a class `Car` with private fields `brand` (String), `model` (String), and `year` (int). Make each setter return `Car` (i.e. `return this;`) so calls can be chained. Provide `getInfo()` that returns `\"<year> <brand> <model>\"`. Read brand, model, and year, use a chain to set them, and print the info.",
    inputFormat: "Line 1: brand. Line 2: model. Line 3: year (integer).",
    outputFormat: "\"<year> <brand> <model>\"",
    examples: [
      {
        input: "Toyota\nCorolla\n2022",
        output: "2022 Toyota Corolla",
      },
      {
        input: "Honda\nCivic\n2019",
        output: "2019 Honda Civic",
      },
    ],
    constraints: ["Brand and model are single words.", "1900 <= year <= 2100"],
    hints: [
      "Setter signature: `public Car setBrand(String brand) { this.brand = brand; return this; }`",
      "Chain: `car.setBrand(b).setModel(m).setYear(y);`",
      "`getInfo()` returns `year + \" \" + brand + \" \" + model`.",
    ],
    referenceProgram: {
      title: "Fluent Car Builder",
      description: "Chained setters returning `this` for a fluent API.",
      code: `import java.util.Scanner;
class Car {
    private String brand, model;
    private int year;
    public Car setBrand(String brand) { this.brand = brand; return this; }
    public Car setModel(String model) { this.model = model; return this; }
    public Car setYear(int year)      { this.year  = year;  return this; }
    public String getInfo() { return year + " " + brand + " " + model; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String brand = sc.next();
        String model = sc.next();
        int year = sc.nextInt();
        Car car = new Car();
        car.setBrand(brand).setModel(model).setYear(year);
        System.out.println(car.getInfo());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Car {
    private String brand, model;
    private int year;
    // TODO: chained setters (return Car/this) and getInfo()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String brand = sc.next();
        String model = sc.next();
        int year = sc.nextInt();
        Car car = new Car();
        // TODO: use chained setters then print car.getInfo()
    }
}`,
    solution: `import java.util.Scanner;
class Car {
    private String brand, model;
    private int year;
    public Car setBrand(String brand) { this.brand = brand; return this; }
    public Car setModel(String model) { this.model = model; return this; }
    public Car setYear(int year)      { this.year  = year;  return this; }
    public String getInfo() { return year + " " + brand + " " + model; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String brand = sc.next();
        String model = sc.next();
        int year = sc.nextInt();
        Car car = new Car();
        car.setBrand(brand).setModel(model).setYear(year);
        System.out.println(car.getInfo());
    }
}`,
    testCases: [
      {
        id: "JCH09_I2_T1",
        label: "Toyota Corolla 2022",
        mockInputs: ["Toyota", "Corolla", "2022"],
        expectedOutput: "2022 Toyota Corolla",
      },
      {
        id: "JCH09_I2_T2",
        label: "Honda Civic 2019",
        mockInputs: ["Honda", "Civic", "2019"],
        expectedOutput: "2019 Honda Civic",
      },
      {
        id: "JCH09_I2_T3",
        label: "Boundary year 1900",
        mockInputs: ["Ford", "ModelT", "1900"],
        expectedOutput: "1900 Ford ModelT",
        isBoundary: true,
      },
      {
        id: "JCH09_I2_T4",
        label: "Future year",
        mockInputs: ["Tesla", "Roadster", "2030"],
        expectedOutput: "2030 Tesla Roadster",
        isHidden: true,
      },
    ],
    concepts: ["chained setters", "fluent API", "return this", "encapsulation"],
    xpReward: 110,
    estimatedMinutes: 12,
  },

  {
    id: "JCH09_I3",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "intermediate",
    tierIndex: 2,
    title: "Student with Computed Grade",
    emoji: "🎓",
    tagline: "Store marks privately and derive the letter grade as a computed property.",
    problemStatement:
      "Create a class `Student` with private `String name` and private `int marks` (0-100). Validate that marks stay in [0, 100] in the setter (clamp to nearest boundary). Add a computed method `getGrade()` that returns:\n- \"A\" for marks >= 90\n- \"B\" for marks >= 75\n- \"C\" for marks >= 60\n- \"D\" for marks >= 40\n- \"F\" otherwise.\n\nRead name and marks, then print the student summary.",
    inputFormat: "Line 1: name (single word). Line 2: marks (integer).",
    outputFormat: "\"<name>: <marks>/100 Grade <letter>\"",
    examples: [
      {
        input: "Riya\n92",
        output: "Riya: 92/100 Grade A",
      },
      {
        input: "Arjun\n55",
        output: "Arjun: 55/100 Grade D",
      },
      {
        input: "Meera\n110",
        output: "Meera: 100/100 Grade A",
        explanation: "110 clamped to 100.",
      },
    ],
    constraints: ["Marks may be outside [0,100] and will be clamped to that boundary."],
    hints: [
      "Clamp: `this.marks = Math.max(0, Math.min(100, marks));`",
      "Grade logic: chained if/else if blocks on the stored value.",
      "Print: `name + \": \" + marks + \"/100 Grade \" + getGrade()`",
    ],
    referenceProgram: {
      title: "Student Grade Calculator",
      description: "Clamped marks with derived letter grade.",
      code: `import java.util.Scanner;
class Student {
    private String name;
    private int marks;
    public void setName(String name) { this.name = name; }
    public void setMarks(int marks)  { this.marks = Math.max(0, Math.min(100, marks)); }
    public String getName()  { return name; }
    public int    getMarks() { return marks; }
    public String getGrade() {
        if (marks >= 90) return "A";
        if (marks >= 75) return "B";
        if (marks >= 60) return "C";
        if (marks >= 40) return "D";
        return "F";
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Student s = new Student();
        s.setName(sc.next());
        s.setMarks(sc.nextInt());
        System.out.println(s.getName() + ": " + s.getMarks() + "/100 Grade " + s.getGrade());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Student {
    private String name;
    private int marks;
    // TODO: setters (marks clamped to 0-100), getters, getGrade()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Student s = new Student();
        // TODO: read name and marks, print summary
    }
}`,
    solution: `import java.util.Scanner;
class Student {
    private String name;
    private int marks;
    public void setName(String name) { this.name = name; }
    public void setMarks(int marks)  { this.marks = Math.max(0, Math.min(100, marks)); }
    public String getName()  { return name; }
    public int    getMarks() { return marks; }
    public String getGrade() {
        if (marks >= 90) return "A";
        if (marks >= 75) return "B";
        if (marks >= 60) return "C";
        if (marks >= 40) return "D";
        return "F";
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Student s = new Student();
        s.setName(sc.next());
        s.setMarks(sc.nextInt());
        System.out.println(s.getName() + ": " + s.getMarks() + "/100 Grade " + s.getGrade());
    }
}`,
    testCases: [
      {
        id: "JCH09_I3_T1",
        label: "Grade A",
        mockInputs: ["Riya", "92"],
        expectedOutput: "Riya: 92/100 Grade A",
      },
      {
        id: "JCH09_I3_T2",
        label: "Grade D",
        mockInputs: ["Arjun", "55"],
        expectedOutput: "Arjun: 55/100 Grade D",
      },
      {
        id: "JCH09_I3_T3",
        label: "Clamp above 100",
        mockInputs: ["Meera", "110"],
        expectedOutput: "Meera: 100/100 Grade A",
        isBoundary: true,
      },
      {
        id: "JCH09_I3_T4",
        label: "Grade F",
        mockInputs: ["Dev", "25"],
        expectedOutput: "Dev: 25/100 Grade F",
        isHidden: true,
      },
      {
        id: "JCH09_I3_T5",
        label: "Clamp below 0",
        mockInputs: ["Ana", "-10"],
        expectedOutput: "Ana: 0/100 Grade F",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "clamping", "computed grade", "Math.max", "Math.min"],
    xpReward: 130,
    estimatedMinutes: 15,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH09_A1",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "advanced",
    tierIndex: 0,
    title: "Immutable Point",
    emoji: "📍",
    tagline: "Build a truly immutable 2D point — no setters, all fields final.",
    problemStatement:
      "Create an immutable class `Point` with `final int x` and `final int y`. Provide a constructor `Point(int x, int y)`, getters, and a method `translate(int dx, int dy)` that returns a new `Point` (does NOT mutate `this`). Also provide `toString()` returning `\"(x, y)\"`. Read x, y, dx, dy. Print the original point, then the translated point.",
    inputFormat: "Line 1: x. Line 2: y. Line 3: dx. Line 4: dy (all integers).",
    outputFormat: "Line 1: original point as \"(x, y)\".\nLine 2: translated point as \"(x, y)\".",
    examples: [
      {
        input: "3\n4\n2\n-1",
        output: "(3, 4)\n(5, 3)",
      },
      {
        input: "0\n0\n5\n5",
        output: "(0, 0)\n(5, 5)",
      },
    ],
    constraints: ["-1000 <= all values <= 1000"],
    hints: [
      "Declare `private final int x, y;` — no setters possible.",
      "Constructor: `public Point(int x, int y) { this.x = x; this.y = y; }`",
      "`translate` returns `new Point(x + dx, y + dy);`",
      "`toString()`: `return \"(\" + x + \", \" + y + \")\";`",
    ],
    referenceProgram: {
      title: "Immutable Point with Translate",
      description: "Final fields prevent mutation; translate returns a new object.",
      code: `import java.util.Scanner;
class Point {
    private final int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }
    public int getX() { return x; }
    public int getY() { return y; }
    public Point translate(int dx, int dy) { return new Point(x + dx, y + dy); }
    public String toString() { return "(" + x + ", " + y + ")"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt(), y = sc.nextInt();
        int dx = sc.nextInt(), dy = sc.nextInt();
        Point p = new Point(x, y);
        System.out.println(p);
        System.out.println(p.translate(dx, dy));
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Point {
    // TODO: final fields, constructor, getters, translate(), toString()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt(), y = sc.nextInt();
        int dx = sc.nextInt(), dy = sc.nextInt();
        Point p = new Point(x, y);
        // TODO: print original then translated point
    }
}`,
    solution: `import java.util.Scanner;
class Point {
    private final int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }
    public int getX() { return x; }
    public int getY() { return y; }
    public Point translate(int dx, int dy) { return new Point(x + dx, y + dy); }
    public String toString() { return "(" + x + ", " + y + ")"; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt(), y = sc.nextInt();
        int dx = sc.nextInt(), dy = sc.nextInt();
        Point p = new Point(x, y);
        System.out.println(p);
        System.out.println(p.translate(dx, dy));
    }
}`,
    testCases: [
      {
        id: "JCH09_A1_T1",
        label: "Basic translate",
        mockInputs: ["3", "4", "2", "-1"],
        expectedOutput: "(3, 4)\n(5, 3)",
      },
      {
        id: "JCH09_A1_T2",
        label: "From origin",
        mockInputs: ["0", "0", "5", "5"],
        expectedOutput: "(0, 0)\n(5, 5)",
      },
      {
        id: "JCH09_A1_T3",
        label: "Zero translation",
        mockInputs: ["7", "-3", "0", "0"],
        expectedOutput: "(7, -3)\n(7, -3)",
        isBoundary: true,
      },
      {
        id: "JCH09_A1_T4",
        label: "Negative to zero",
        mockInputs: ["-5", "-5", "5", "5"],
        expectedOutput: "(-5, -5)\n(0, 0)",
        isHidden: true,
      },
    ],
    concepts: ["immutability", "final fields", "new object return", "toString"],
    xpReward: 150,
    estimatedMinutes: 15,
  },

  {
    id: "JCH09_A2",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "advanced",
    tierIndex: 1,
    title: "Defensive Array Copy",
    emoji: "🛡️",
    tagline: "Return defensive copies so callers cannot corrupt internal state.",
    problemStatement:
      "Create a class `Scores` that stores an array of N integers internally. The constructor takes an `int[]` and stores a defensive copy (not the original reference). Provide `getScores()` that also returns a defensive copy. Add `getMax()` and `getMin()` returning the maximum and minimum stored score. In `Main`, read N scores, build a `Scores` object, then print max and min.",
    inputFormat: "Line 1: N (1 <= N <= 20). Next N lines: one integer each.",
    outputFormat: "\"Max: <max>\"\n\"Min: <min>\"",
    examples: [
      {
        input: "5\n10\n30\n20\n50\n40",
        output: "Max: 50\nMin: 10",
      },
      {
        input: "1\n7",
        output: "Max: 7\nMin: 7",
      },
    ],
    constraints: ["1 <= N <= 20", "-10000 <= scores <= 10000"],
    hints: [
      "Defensive copy in constructor: `this.scores = Arrays.copyOf(arr, arr.length);`",
      "Same in getter: `return Arrays.copyOf(scores, scores.length);`",
      "Compute max/min with a simple loop from index 0.",
      "Import java.util.Arrays;",
    ],
    referenceProgram: {
      title: "Scores with Defensive Copying",
      description: "Copies the array in and out to prevent external mutation.",
      code: `import java.util.Scanner;
import java.util.Arrays;
class Scores {
    private final int[] scores;
    public Scores(int[] arr) { this.scores = Arrays.copyOf(arr, arr.length); }
    public int[] getScores() { return Arrays.copyOf(scores, scores.length); }
    public int getMax() {
        int m = scores[0];
        for (int v : scores) if (v > m) m = v;
        return m;
    }
    public int getMin() {
        int m = scores[0];
        for (int v : scores) if (v < m) m = v;
        return m;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        Scores s = new Scores(arr);
        System.out.println("Max: " + s.getMax());
        System.out.println("Min: " + s.getMin());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
class Scores {
    private final int[] scores;
    public Scores(int[] arr) {
        // TODO: store a defensive copy
    }
    public int[] getScores() {
        // TODO: return a defensive copy
        return null;
    }
    public int getMax() { return 0; /* TODO */ }
    public int getMin() { return 0; /* TODO */ }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        Scores s = new Scores(arr);
        System.out.println("Max: " + s.getMax());
        System.out.println("Min: " + s.getMin());
    }
}`,
    solution: `import java.util.Scanner;
import java.util.Arrays;
class Scores {
    private final int[] scores;
    public Scores(int[] arr) { this.scores = Arrays.copyOf(arr, arr.length); }
    public int[] getScores() { return Arrays.copyOf(scores, scores.length); }
    public int getMax() {
        int m = scores[0];
        for (int v : scores) if (v > m) m = v;
        return m;
    }
    public int getMin() {
        int m = scores[0];
        for (int v : scores) if (v < m) m = v;
        return m;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        Scores s = new Scores(arr);
        System.out.println("Max: " + s.getMax());
        System.out.println("Min: " + s.getMin());
    }
}`,
    testCases: [
      {
        id: "JCH09_A2_T1",
        label: "5 scores",
        mockInputs: ["5", "10", "30", "20", "50", "40"],
        expectedOutput: "Max: 50\nMin: 10",
      },
      {
        id: "JCH09_A2_T2",
        label: "Single element",
        mockInputs: ["1", "7"],
        expectedOutput: "Max: 7\nMin: 7",
        isBoundary: true,
      },
      {
        id: "JCH09_A2_T3",
        label: "All negatives",
        mockInputs: ["3", "-10", "-5", "-20"],
        expectedOutput: "Max: -5\nMin: -20",
        isHidden: true,
      },
      {
        id: "JCH09_A2_T4",
        label: "All same value",
        mockInputs: ["4", "5", "5", "5", "5"],
        expectedOutput: "Max: 5\nMin: 5",
        isHidden: true,
      },
    ],
    concepts: ["defensive copy", "Arrays.copyOf", "immutability", "encapsulation"],
    xpReward: 175,
    estimatedMinutes: 18,
  },

  {
    id: "JCH09_A3",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "advanced",
    tierIndex: 2,
    title: "Class Invariant — Rational Number",
    emoji: "➗",
    tagline: "Enforce a class invariant: fraction always in lowest terms, denominator positive.",
    problemStatement:
      "Create a class `Rational` with private `int numerator` and `int denominator`. The constructor `Rational(int num, int den)` must:\n1. Exit with message \"Error: denominator cannot be zero\" if den == 0.\n2. Reduce the fraction to lowest terms using GCD.\n3. Keep the denominator positive (negate both if den is negative).\n\nProvide `toString()` returning `\"num/den\"` or just `\"num\"` if den == 1. Also provide `add(Rational other)` returning a new `Rational`. Read two fractions and print their sum.",
    inputFormat:
      "Line 1: num1. Line 2: den1. Line 3: num2. Line 4: den2 (all integers).",
    outputFormat: "The sum as a reduced fraction on one line.",
    examples: [
      {
        input: "1\n2\n1\n3",
        output: "5/6",
        explanation: "1/2 + 1/3 = 3/6 + 2/6 = 5/6.",
      },
      {
        input: "1\n4\n3\n4",
        output: "1",
        explanation: "1/4 + 3/4 = 4/4 = 1.",
      },
    ],
    constraints: ["Denominator is never 0 in test inputs.", "-100 <= numerator, denominator <= 100"],
    hints: [
      "GCD: `static int gcd(int a, int b) { return b == 0 ? Math.abs(a) : gcd(b, a % b); }`",
      "Reduce: `int g = gcd(Math.abs(num), Math.abs(den)); this.numerator = num/g; this.denominator = den/g;`",
      "Fix sign: `if (this.denominator < 0) { this.numerator = -this.numerator; this.denominator = -this.denominator; }`",
      "`add`: `return new Rational(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator);`",
      "`toString`: `return denominator == 1 ? \"\" + numerator : numerator + \"/\" + denominator;`",
    ],
    referenceProgram: {
      title: "Rational with GCD Invariant",
      description: "Normalises to lowest terms and positive denominator on construction.",
      code: `import java.util.Scanner;
class Rational {
    private final int numerator, denominator;
    private static int gcd(int a, int b) { return b == 0 ? Math.abs(a) : gcd(b, a % b); }
    public Rational(int num, int den) {
        if (den == 0) { System.out.println("Error: denominator cannot be zero"); System.exit(1); }
        int g = gcd(Math.abs(num), Math.abs(den));
        int n = num / g, d = den / g;
        if (d < 0) { n = -n; d = -d; }
        this.numerator = n;
        this.denominator = d;
    }
    public Rational add(Rational o) {
        return new Rational(numerator * o.denominator + o.numerator * denominator,
                            denominator * o.denominator);
    }
    public String toString() {
        return denominator == 1 ? "" + numerator : numerator + "/" + denominator;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rational a = new Rational(sc.nextInt(), sc.nextInt());
        Rational b = new Rational(sc.nextInt(), sc.nextInt());
        System.out.println(a.add(b));
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Rational {
    private final int numerator, denominator;
    // TODO: static gcd(), constructor (validate, reduce, fix sign), add(), toString()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rational a = new Rational(sc.nextInt(), sc.nextInt());
        Rational b = new Rational(sc.nextInt(), sc.nextInt());
        System.out.println(a.add(b));
    }
}`,
    solution: `import java.util.Scanner;
class Rational {
    private final int numerator, denominator;
    private static int gcd(int a, int b) { return b == 0 ? Math.abs(a) : gcd(b, a % b); }
    public Rational(int num, int den) {
        if (den == 0) { System.out.println("Error: denominator cannot be zero"); System.exit(1); }
        int g = gcd(Math.abs(num), Math.abs(den));
        int n = num / g, d = den / g;
        if (d < 0) { n = -n; d = -d; }
        this.numerator = n;
        this.denominator = d;
    }
    public Rational add(Rational o) {
        return new Rational(numerator * o.denominator + o.numerator * denominator,
                            denominator * o.denominator);
    }
    public String toString() {
        return denominator == 1 ? "" + numerator : numerator + "/" + denominator;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Rational a = new Rational(sc.nextInt(), sc.nextInt());
        Rational b = new Rational(sc.nextInt(), sc.nextInt());
        System.out.println(a.add(b));
    }
}`,
    testCases: [
      {
        id: "JCH09_A3_T1",
        label: "1/2 + 1/3 = 5/6",
        mockInputs: ["1", "2", "1", "3"],
        expectedOutput: "5/6",
      },
      {
        id: "JCH09_A3_T2",
        label: "1/4 + 3/4 = 1",
        mockInputs: ["1", "4", "3", "4"],
        expectedOutput: "1",
      },
      {
        id: "JCH09_A3_T3",
        label: "Sum to zero",
        mockInputs: ["-1", "2", "1", "2"],
        expectedOutput: "0",
        isBoundary: true,
      },
      {
        id: "JCH09_A3_T4",
        label: "Needs reduction",
        mockInputs: ["2", "6", "1", "3"],
        expectedOutput: "2/3",
        isHidden: true,
      },
    ],
    concepts: ["class invariant", "GCD", "immutable", "fraction reduction", "recursion"],
    xpReward: 200,
    estimatedMinutes: 20,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEETCODE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH09_L1",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "leetcode",
    tierIndex: 0,
    title: "Design a Min Stack",
    emoji: "📚",
    tagline: "Stack that tracks the minimum in O(1) using encapsulated auxiliary state.",
    problemStatement:
      "Design a `MinStack` class that supports:\n- `push(int val)` — push val onto the stack.\n- `pop()` — remove the top element.\n- `top()` — return the top element without removing.\n- `getMin()` — return the minimum element in the stack in O(1).\n\nAll operations are guaranteed valid (no pop/top/getMin on empty stack). Read N operations and their arguments, execute them, and print the result of every `top` and `getMin` call.",
    inputFormat:
      "Line 1: N (1 <= N <= 100).\nNext N lines: `PUSH <val>`, `POP`, `TOP`, or `MIN`.",
    outputFormat: "One integer per line for each TOP or MIN call, in order.",
    examples: [
      {
        input: "6\nPUSH 5\nPUSH 3\nPUSH 7\nMIN\nPOP\nMIN",
        output: "3\n3",
      },
      {
        input: "4\nPUSH 1\nPUSH 2\nTOP\nMIN",
        output: "2\n1",
      },
    ],
    constraints: ["1 <= N <= 100", "-10000 <= val <= 10000"],
    hints: [
      "Keep two private arrays: one for values, one for running minimums.",
      "On push: append val to value-stack; append Math.min(val, currentMin) to min-stack.",
      "Use a private `int size` counter as the stack pointer.",
      "`top()` returns `data[size-1]`; `getMin()` returns `mins[size-1]`.",
    ],
    referenceProgram: {
      title: "MinStack with Auxiliary Min Array",
      description: "Parallel min-array tracks the running minimum at each stack level.",
      code: `import java.util.Scanner;
class MinStack {
    private int[] data = new int[200];
    private int[] mins = new int[200];
    private int size = 0;
    public void push(int val) {
        data[size] = val;
        mins[size] = size == 0 ? val : Math.min(val, mins[size - 1]);
        size++;
    }
    public void pop()    { size--; }
    public int  top()    { return data[size - 1]; }
    public int  getMin() { return mins[size - 1]; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            switch (op) {
                case "PUSH": ms.push(sc.nextInt()); break;
                case "POP":  ms.pop(); break;
                case "TOP":  System.out.println(ms.top()); break;
                case "MIN":  System.out.println(ms.getMin()); break;
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class MinStack {
    // TODO: encapsulate internal arrays, implement push/pop/top/getMin
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            // TODO: dispatch to ms methods; print result for TOP and MIN
        }
    }
}`,
    solution: `import java.util.Scanner;
class MinStack {
    private int[] data = new int[200];
    private int[] mins = new int[200];
    private int size = 0;
    public void push(int val) {
        data[size] = val;
        mins[size] = size == 0 ? val : Math.min(val, mins[size - 1]);
        size++;
    }
    public void pop()    { size--; }
    public int  top()    { return data[size - 1]; }
    public int  getMin() { return mins[size - 1]; }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        MinStack ms = new MinStack();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            switch (op) {
                case "PUSH": ms.push(sc.nextInt()); break;
                case "POP":  ms.pop(); break;
                case "TOP":  System.out.println(ms.top()); break;
                case "MIN":  System.out.println(ms.getMin()); break;
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH09_L1_T1",
        label: "Push/pop with min queries",
        mockInputs: ["6", "PUSH 5", "PUSH 3", "PUSH 7", "MIN", "POP", "MIN"],
        expectedOutput: "3\n3",
      },
      {
        id: "JCH09_L1_T2",
        label: "Top and min",
        mockInputs: ["4", "PUSH 1", "PUSH 2", "TOP", "MIN"],
        expectedOutput: "2\n1",
      },
      {
        id: "JCH09_L1_T3",
        label: "Single element",
        mockInputs: ["2", "PUSH 42", "MIN"],
        expectedOutput: "42",
        isBoundary: true,
      },
      {
        id: "JCH09_L1_T4",
        label: "Min updates after pop",
        mockInputs: ["7", "PUSH 10", "PUSH 2", "MIN", "POP", "MIN", "PUSH 1", "MIN"],
        expectedOutput: "2\n10\n1",
        isHidden: true,
      },
    ],
    concepts: ["design", "encapsulation", "O(1) min", "auxiliary array", "stack"],
    xpReward: 250,
    estimatedMinutes: 25,
    timeComplexityTarget: "O(1) per operation",
  },

  {
    id: "JCH09_L2",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "leetcode",
    tierIndex: 1,
    title: "Student Record with GPA",
    emoji: "📋",
    tagline: "Encapsulate multi-subject marks, compute GPA, and rank the student.",
    problemStatement:
      "Create a `StudentRecord` class with private `String name`, private `int[] marks` (5 subjects). The constructor takes a name and 5 integers. Provide:\n- `getGPA()` — returns average as a double.\n- `getRank()` — returns \"Distinction\" (avg>=75), \"First Class\" (>=60), \"Second Class\" (>=50), \"Pass\" (>=35), or \"Fail\".\n- `getTopSubject()` — returns 1-based index of highest mark (first index if tie).\n\nRead one student's data and print their info.",
    inputFormat:
      "Line 1: name. Lines 2-6: one integer mark per line (5 subjects, 0-100 each).",
    outputFormat:
      "\"GPA: <avg formatted to 2 dp>\"\n\"Rank: <rank>\"\n\"Top Subject: <index>\"",
    examples: [
      {
        input: "Priya\n80\n75\n90\n85\n70",
        output: "GPA: 80.00\nRank: Distinction\nTop Subject: 3",
      },
      {
        input: "Raj\n50\n45\n55\n40\n35",
        output: "GPA: 45.00\nRank: Pass\nTop Subject: 3",
      },
    ],
    constraints: ["0 <= each mark <= 100", "Exactly 5 subjects."],
    hints: [
      "Store a defensive copy of marks in the constructor.",
      "`getGPA()`: sum all 5 marks, divide by 5.0.",
      "Top subject: loop and track the index of the max value.",
      "Rank: use if/else if chain on getGPA().",
    ],
    referenceProgram: {
      title: "StudentRecord with Analytics",
      description: "Encapsulated marks array with GPA, rank, and top subject.",
      code: `import java.util.Scanner;
import java.util.Arrays;
class StudentRecord {
    private final String name;
    private final int[] marks;
    public StudentRecord(String name, int[] marks) {
        this.name  = name;
        this.marks = Arrays.copyOf(marks, marks.length);
    }
    public double getGPA() {
        int sum = 0;
        for (int m : marks) sum += m;
        return sum / 5.0;
    }
    public String getRank() {
        double gpa = getGPA();
        if (gpa >= 75) return "Distinction";
        if (gpa >= 60) return "First Class";
        if (gpa >= 50) return "Second Class";
        if (gpa >= 35) return "Pass";
        return "Fail";
    }
    public int getTopSubject() {
        int idx = 0;
        for (int i = 1; i < marks.length; i++)
            if (marks[i] > marks[idx]) idx = i;
        return idx + 1;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int[] marks = new int[5];
        for (int i = 0; i < 5; i++) marks[i] = sc.nextInt();
        StudentRecord sr = new StudentRecord(name, marks);
        System.out.printf("GPA: %.2f%n", sr.getGPA());
        System.out.println("Rank: " + sr.getRank());
        System.out.println("Top Subject: " + sr.getTopSubject());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
class StudentRecord {
    // TODO: private fields, constructor (defensive copy), getGPA(), getRank(), getTopSubject()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int[] marks = new int[5];
        for (int i = 0; i < 5; i++) marks[i] = sc.nextInt();
        StudentRecord sr = new StudentRecord(name, marks);
        // TODO: print GPA, Rank, Top Subject
    }
}`,
    solution: `import java.util.Scanner;
import java.util.Arrays;
class StudentRecord {
    private final String name;
    private final int[] marks;
    public StudentRecord(String name, int[] marks) {
        this.name  = name;
        this.marks = Arrays.copyOf(marks, marks.length);
    }
    public double getGPA() {
        int sum = 0;
        for (int m : marks) sum += m;
        return sum / 5.0;
    }
    public String getRank() {
        double gpa = getGPA();
        if (gpa >= 75) return "Distinction";
        if (gpa >= 60) return "First Class";
        if (gpa >= 50) return "Second Class";
        if (gpa >= 35) return "Pass";
        return "Fail";
    }
    public int getTopSubject() {
        int idx = 0;
        for (int i = 1; i < marks.length; i++)
            if (marks[i] > marks[idx]) idx = i;
        return idx + 1;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int[] marks = new int[5];
        for (int i = 0; i < 5; i++) marks[i] = sc.nextInt();
        StudentRecord sr = new StudentRecord(name, marks);
        System.out.printf("GPA: %.2f%n", sr.getGPA());
        System.out.println("Rank: " + sr.getRank());
        System.out.println("Top Subject: " + sr.getTopSubject());
    }
}`,
    testCases: [
      {
        id: "JCH09_L2_T1",
        label: "Distinction student",
        mockInputs: ["Priya", "80", "75", "90", "85", "70"],
        expectedOutput: "GPA: 80.00\nRank: Distinction\nTop Subject: 3",
      },
      {
        id: "JCH09_L2_T2",
        label: "Pass student",
        mockInputs: ["Raj", "50", "45", "55", "40", "35"],
        expectedOutput: "GPA: 45.00\nRank: Pass\nTop Subject: 3",
      },
      {
        id: "JCH09_L2_T3",
        label: "All zeros — Fail",
        mockInputs: ["Dev", "0", "0", "0", "0", "0"],
        expectedOutput: "GPA: 0.00\nRank: Fail\nTop Subject: 1",
        isBoundary: true,
      },
      {
        id: "JCH09_L2_T4",
        label: "First class",
        mockInputs: ["Meera", "60", "65", "70", "55", "60"],
        expectedOutput: "GPA: 62.00\nRank: First Class\nTop Subject: 3",
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "GPA calculation", "defensive copy", "computed properties"],
    xpReward: 270,
    estimatedMinutes: 25,
  },

  {
    id: "JCH09_L3",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "leetcode",
    tierIndex: 2,
    title: "Bank Account with Overdraft Protection",
    emoji: "💳",
    tagline: "Design a BankAccount with overdraft limit, transaction history, and statement.",
    problemStatement:
      "Design a `BankAccount` with:\n- Private `double balance` (starts at 0).\n- Private `double overdraftLimit` (set via constructor, always >= 0).\n- Private transaction log (array of up to 200 strings).\n- `deposit(double amt)`: adds to balance, logs \"DEP <amt>\".\n- `withdraw(double amt)`: deducts if (balance - amt) >= -overdraftLimit; else prints \"Declined\" and logs \"DECLINED <amt>\".\n- `printStatement()`: prints each log entry on its own line, then \"Balance: <x.xx>\".\n\nRead overdraft limit, then N operations (`D <amt>` or `W <amt>`), then print the statement.",
    inputFormat:
      "Line 1: overdraftLimit (double).\nLine 2: N.\nNext N lines: `D <amt>` or `W <amt>`.",
    outputFormat:
      "Any \"Declined\" messages during processing (one per line).\nThen each log entry on its own line, then \"Balance: <x.xx>\".",
    examples: [
      {
        input: "100.0\n3\nD 50.0\nW 120.0\nW 10.0",
        output: "DEP 50.0\nW 120.0\nW 10.0\nBalance: -80.00",
        explanation: "Overdraft=100. D50 -> bal=50. W120 -> 50-120=-70 >= -100 OK. W10 -> -70-10=-80 >= -100 OK.",
      },
      {
        input: "50.0\n2\nW 200.0\nD 10.0",
        output: "Declined\nDECLINED 200.0\nDEP 10.0\nBalance: 10.00",
        explanation: "W200 would make bal=-200 < -50, declined.",
      },
    ],
    constraints: ["0 <= overdraftLimit <= 10000", "1 <= N <= 50"],
    hints: [
      "Store overdraftLimit as a final private field.",
      "In withdraw: `if (balance - amount >= -overdraftLimit)` allow; else print \"Declined\" and log \"DECLINED <amt>\".",
      "Log format: for deposits `\"DEP \" + amt`, for successful withdrawals `\"W \" + amt`.",
      "printStatement loops over the log array then prints Balance.",
    ],
    referenceProgram: {
      title: "BankAccount with Overdraft and Log",
      description: "Encapsulates balance, overdraft limit, and transaction history.",
      code: `import java.util.Scanner;
class BankAccount {
    private double balance = 0;
    private final double overdraftLimit;
    private String[] log = new String[200];
    private int logCount = 0;
    public BankAccount(double overdraftLimit) { this.overdraftLimit = overdraftLimit; }
    public void deposit(double amt) {
        balance += amt;
        log[logCount++] = "DEP " + amt;
    }
    public void withdraw(double amt) {
        if (balance - amt >= -overdraftLimit) {
            balance -= amt;
            log[logCount++] = "W " + amt;
        } else {
            System.out.println("Declined");
            log[logCount++] = "DECLINED " + amt;
        }
    }
    public void printStatement() {
        for (int i = 0; i < logCount; i++) System.out.println(log[i]);
        System.out.printf("Balance: %.2f%n", balance);
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double limit = sc.nextDouble();
        int n = sc.nextInt();
        BankAccount acc = new BankAccount(limit);
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            double amt = sc.nextDouble();
            if (op.equals("D")) acc.deposit(amt);
            else acc.withdraw(amt);
        }
        acc.printStatement();
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class BankAccount {
    private double balance = 0;
    private final double overdraftLimit;
    private String[] log = new String[200];
    private int logCount = 0;
    public BankAccount(double overdraftLimit) { this.overdraftLimit = overdraftLimit; }
    // TODO: deposit, withdraw (with overdraft check and logging), printStatement
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double limit = sc.nextDouble();
        int n = sc.nextInt();
        BankAccount acc = new BankAccount(limit);
        // TODO: process operations then acc.printStatement()
    }
}`,
    solution: `import java.util.Scanner;
class BankAccount {
    private double balance = 0;
    private final double overdraftLimit;
    private String[] log = new String[200];
    private int logCount = 0;
    public BankAccount(double overdraftLimit) { this.overdraftLimit = overdraftLimit; }
    public void deposit(double amt) {
        balance += amt;
        log[logCount++] = "DEP " + amt;
    }
    public void withdraw(double amt) {
        if (balance - amt >= -overdraftLimit) {
            balance -= amt;
            log[logCount++] = "W " + amt;
        } else {
            System.out.println("Declined");
            log[logCount++] = "DECLINED " + amt;
        }
    }
    public void printStatement() {
        for (int i = 0; i < logCount; i++) System.out.println(log[i]);
        System.out.printf("Balance: %.2f%n", balance);
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double limit = sc.nextDouble();
        int n = sc.nextInt();
        BankAccount acc = new BankAccount(limit);
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            double amt = sc.nextDouble();
            if (op.equals("D")) acc.deposit(amt);
            else acc.withdraw(amt);
        }
        acc.printStatement();
    }
}`,
    testCases: [
      {
        id: "JCH09_L3_T1",
        label: "Overdraft used",
        mockInputs: ["100.0", "3", "D 50.0", "W 120.0", "W 10.0"],
        expectedOutput: "DEP 50.0\nW 120.0\nW 10.0\nBalance: -80.00",
      },
      {
        id: "JCH09_L3_T2",
        label: "Declined transaction",
        mockInputs: ["50.0", "2", "W 200.0", "D 10.0"],
        expectedOutput: "Declined\nDECLINED 200.0\nDEP 10.0\nBalance: 10.00",
      },
      {
        id: "JCH09_L3_T3",
        label: "Zero overdraft",
        mockInputs: ["0.0", "2", "D 100.0", "W 101.0"],
        expectedOutput: "Declined\nDEP 100.0\nDECLINED 101.0\nBalance: 100.00",
        isBoundary: true,
      },
      {
        id: "JCH09_L3_T4",
        label: "Multiple declines",
        mockInputs: ["20.0", "4", "D 10.0", "W 35.0", "W 5.0", "W 26.0"],
        expectedOutput: "Declined\nDeclined\nDEP 10.0\nDECLINED 35.0\nW 5.0\nDECLINED 26.0\nBalance: 5.00",
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "overdraft", "transaction log", "design pattern"],
    xpReward: 300,
    estimatedMinutes: 30,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HACKATHON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "JCH09_H1",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "hackathon",
    tierIndex: 0,
    title: "ATM Simulation",
    emoji: "🏧",
    tagline: "Simulate an ATM: PIN auth, balance check, withdraw, deposit, change PIN.",
    problemStatement:
      "Design an `ATM` class encapsulating `int pin`, `double balance`, and `boolean locked` (locked after 3 wrong PIN attempts). Supported operations (each on one line):\n- `AUTH <pin>` — if locked print \"Card locked\"; else if correct PIN unlock; else increment failures; after 3 failures lock and print \"Card locked\".\n- `BAL` — if authenticated print \"Balance: <x.xx>\"; else print \"Not authenticated\".\n- `DEP <amt>` — if authenticated deposit; else print \"Not authenticated\".\n- `WIT <amt>` — if authenticated and sufficient funds withdraw; else print \"Insufficient funds\" or \"Not authenticated\".\n- `CHG <oldPin> <newPin>` — if authenticated and oldPin matches change pin; else print \"Wrong PIN\" or \"Not authenticated\".\n\nRead initial balance, PIN, then N operations.",
    inputFormat:
      "Line 1: initial balance (double).\nLine 2: initial PIN (integer).\nLine 3: N.\nNext N lines: operations as described.",
    outputFormat: "Output from BAL queries and error/alert messages, one per line.",
    examples: [
      {
        input: "1000.0\n1234\n5\nAUTH 1234\nBAL\nWIT 200.0\nBAL\nCHG 1234 5678",
        output: "Balance: 1000.00\nBalance: 800.00",
      },
      {
        input: "500.0\n9999\n4\nAUTH 1111\nAUTH 2222\nAUTH 3333\nBAL",
        output: "Card locked\nNot authenticated",
      },
    ],
    constraints: ["balance >= 0", "1 <= N <= 50"],
    hints: [
      "Track `private boolean authenticated = false;` and `private int failedAttempts = 0;`.",
      "AUTH: if locked, print \"Card locked\" and return; if pin matches set authenticated=true, reset failures; else failedAttempts++; if==3 lock.",
      "WIT: check authenticated first, then balance >= amount.",
      "CHG: check authenticated, then oldPin matches this.pin.",
    ],
    referenceProgram: {
      title: "Full ATM State Machine",
      description: "Encapsulated PIN, balance, lock state with 5 operations.",
      code: `import java.util.Scanner;
class ATM {
    private int pin;
    private double balance;
    private boolean locked = false;
    private boolean authenticated = false;
    private int failedAttempts = 0;
    public ATM(double balance, int pin) { this.balance = balance; this.pin = pin; }
    public void auth(int enteredPin) {
        if (locked) { System.out.println("Card locked"); return; }
        if (enteredPin == pin) { authenticated = true; failedAttempts = 0; }
        else {
            failedAttempts++;
            if (failedAttempts >= 3) { locked = true; System.out.println("Card locked"); }
        }
    }
    public void bal() {
        if (!authenticated) { System.out.println("Not authenticated"); return; }
        System.out.printf("Balance: %.2f%n", balance);
    }
    public void deposit(double amt) {
        if (!authenticated) { System.out.println("Not authenticated"); return; }
        balance += amt;
    }
    public void withdraw(double amt) {
        if (!authenticated) { System.out.println("Not authenticated"); return; }
        if (amt > balance) { System.out.println("Insufficient funds"); return; }
        balance -= amt;
    }
    public void changePin(int oldPin, int newPin) {
        if (!authenticated) { System.out.println("Not authenticated"); return; }
        if (oldPin != pin) { System.out.println("Wrong PIN"); return; }
        pin = newPin;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double bal = sc.nextDouble();
        int pin = sc.nextInt();
        int n = sc.nextInt();
        ATM atm = new ATM(bal, pin);
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            switch (op) {
                case "AUTH": atm.auth(sc.nextInt()); break;
                case "BAL":  atm.bal(); break;
                case "DEP":  atm.deposit(sc.nextDouble()); break;
                case "WIT":  atm.withdraw(sc.nextDouble()); break;
                case "CHG":  atm.changePin(sc.nextInt(), sc.nextInt()); break;
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class ATM {
    private int pin;
    private double balance;
    private boolean locked = false;
    private boolean authenticated = false;
    private int failedAttempts = 0;
    public ATM(double balance, int pin) { this.balance = balance; this.pin = pin; }
    // TODO: auth, bal, deposit, withdraw, changePin
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double bal = sc.nextDouble();
        int pin = sc.nextInt();
        int n = sc.nextInt();
        ATM atm = new ATM(bal, pin);
        // TODO: dispatch N operations
    }
}`,
    solution: `import java.util.Scanner;
class ATM {
    private int pin;
    private double balance;
    private boolean locked = false;
    private boolean authenticated = false;
    private int failedAttempts = 0;
    public ATM(double balance, int pin) { this.balance = balance; this.pin = pin; }
    public void auth(int enteredPin) {
        if (locked) { System.out.println("Card locked"); return; }
        if (enteredPin == pin) { authenticated = true; failedAttempts = 0; }
        else {
            failedAttempts++;
            if (failedAttempts >= 3) { locked = true; System.out.println("Card locked"); }
        }
    }
    public void bal() {
        if (!authenticated) { System.out.println("Not authenticated"); return; }
        System.out.printf("Balance: %.2f%n", balance);
    }
    public void deposit(double amt) {
        if (!authenticated) { System.out.println("Not authenticated"); return; }
        balance += amt;
    }
    public void withdraw(double amt) {
        if (!authenticated) { System.out.println("Not authenticated"); return; }
        if (amt > balance) { System.out.println("Insufficient funds"); return; }
        balance -= amt;
    }
    public void changePin(int oldPin, int newPin) {
        if (!authenticated) { System.out.println("Not authenticated"); return; }
        if (oldPin != pin) { System.out.println("Wrong PIN"); return; }
        pin = newPin;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double bal = sc.nextDouble();
        int pin = sc.nextInt();
        int n = sc.nextInt();
        ATM atm = new ATM(bal, pin);
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            switch (op) {
                case "AUTH": atm.auth(sc.nextInt()); break;
                case "BAL":  atm.bal(); break;
                case "DEP":  atm.deposit(sc.nextDouble()); break;
                case "WIT":  atm.withdraw(sc.nextDouble()); break;
                case "CHG":  atm.changePin(sc.nextInt(), sc.nextInt()); break;
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH09_H1_T1",
        label: "Normal flow",
        mockInputs: ["1000.0", "1234", "5", "AUTH 1234", "BAL", "WIT 200.0", "BAL", "CHG 1234 5678"],
        expectedOutput: "Balance: 1000.00\nBalance: 800.00",
      },
      {
        id: "JCH09_H1_T2",
        label: "Lock after 3 failures",
        mockInputs: ["500.0", "9999", "4", "AUTH 1111", "AUTH 2222", "AUTH 3333", "BAL"],
        expectedOutput: "Card locked\nNot authenticated",
      },
      {
        id: "JCH09_H1_T3",
        label: "Insufficient funds",
        mockInputs: ["100.0", "0000", "3", "AUTH 0", "WIT 200.0", "BAL"],
        expectedOutput: "Insufficient funds\nBalance: 100.00",
        isBoundary: true,
      },
      {
        id: "JCH09_H1_T4",
        label: "Change PIN then use new PIN",
        mockInputs: ["200.0", "1111", "4", "AUTH 1111", "CHG 1111 2222", "AUTH 2222", "BAL"],
        expectedOutput: "Balance: 200.00",
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "state machine", "authentication", "business rules"],
    xpReward: 400,
    estimatedMinutes: 40,
    designChallenge:
      "Add an interest-accrual method that compounds balance by a given monthly rate, and a mini-statement showing the last 5 transactions.",
  },

  {
    id: "JCH09_H2",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "hackathon",
    tierIndex: 1,
    title: "School Course Enrollment",
    emoji: "🏫",
    tagline: "Manage students and courses with encapsulated enrollment and reporting.",
    problemStatement:
      "Create two classes:\n- `Course` with private `String code`, `String title`, `int maxSeats`, `int enrolled`. Method `enroll()` returns true and increments enrolled if seats available; else returns false. `getCode()` returns the code.\n- `SchoolStudent` with private `String name`, array of up to 5 `String` course codes, `int courseCount`. Method `addCourse(String code)` adds if under limit. `getName()` and `getCourseList()` returns codes as comma-separated string.\n\nRead C courses, then S students. For each student read their name then course codes until \"DONE\". For each enrollment attempt print \"Enrolled <name> in <code>\" or \"Full: <code>\". After all students, print each student's course list.",
    inputFormat:
      "Line 1: C. Next C lines: `<code> <title> <maxSeats>`.\nLine: S. For each student: name line, then course codes until \"DONE\".",
    outputFormat:
      "Enrollment messages during processing, then for each student: \"<name>: <course1,course2,...>\".",
    examples: [
      {
        input: "2\nCS101 Java 2\nCS102 Python 1\n2\nAlice\nCS101\nCS102\nDONE\nBob\nCS101\nCS102\nDONE",
        output: "Enrolled Alice in CS101\nEnrolled Alice in CS102\nEnrolled Bob in CS101\nFull: CS102\nAlice: CS101,CS102\nBob: CS101",
      },
    ],
    constraints: ["1 <= C <= 10", "1 <= S <= 10", "Max 5 courses per student"],
    hints: [
      "Store courses in a `Course[]` array; look up by code with a linear search.",
      "In `enroll()`: `if (enrolled < maxSeats) { enrolled++; return true; } return false;`",
      "`getCourseList()`: join the codes array with commas up to courseCount.",
      "Use `sc.next()` to read one token per line.",
    ],
    referenceProgram: {
      title: "School Course Enrollment System",
      description: "Encapsulated Course and Student classes with enrollment business logic.",
      code: `import java.util.Scanner;
class Course {
    private final String code, title;
    private final int maxSeats;
    private int enrolled = 0;
    public Course(String code, String title, int maxSeats) {
        this.code = code; this.title = title; this.maxSeats = maxSeats;
    }
    public String getCode() { return code; }
    public boolean enroll() {
        if (enrolled < maxSeats) { enrolled++; return true; }
        return false;
    }
}
class SchoolStudent {
    private final String name;
    private String[] courses = new String[5];
    private int courseCount = 0;
    public SchoolStudent(String name) { this.name = name; }
    public String getName() { return name; }
    public void addCourse(String code) { if (courseCount < 5) courses[courseCount++] = code; }
    public String getCourseList() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < courseCount; i++) {
            if (i > 0) sb.append(",");
            sb.append(courses[i]);
        }
        return sb.toString();
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int c = sc.nextInt();
        Course[] courseArr = new Course[c];
        for (int i = 0; i < c; i++) {
            String code = sc.next(), title = sc.next();
            int seats = sc.nextInt();
            courseArr[i] = new Course(code, title, seats);
        }
        int s = sc.nextInt();
        SchoolStudent[] students = new SchoolStudent[s];
        for (int i = 0; i < s; i++) {
            String name = sc.next();
            students[i] = new SchoolStudent(name);
            String token;
            while (!(token = sc.next()).equals("DONE")) {
                for (Course cr : courseArr) {
                    if (cr.getCode().equals(token)) {
                        if (cr.enroll()) {
                            students[i].addCourse(token);
                            System.out.println("Enrolled " + name + " in " + token);
                        } else {
                            System.out.println("Full: " + token);
                        }
                        break;
                    }
                }
            }
        }
        for (SchoolStudent st : students)
            System.out.println(st.getName() + ": " + st.getCourseList());
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Course {
    // TODO: private fields, constructor, enroll(), getCode()
}
class SchoolStudent {
    // TODO: private fields, constructor, addCourse(), getName(), getCourseList()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read courses, students, process enrollments, print summary
    }
}`,
    solution: `import java.util.Scanner;
class Course {
    private final String code, title;
    private final int maxSeats;
    private int enrolled = 0;
    public Course(String code, String title, int maxSeats) {
        this.code = code; this.title = title; this.maxSeats = maxSeats;
    }
    public String getCode() { return code; }
    public boolean enroll() {
        if (enrolled < maxSeats) { enrolled++; return true; }
        return false;
    }
}
class SchoolStudent {
    private final String name;
    private String[] courses = new String[5];
    private int courseCount = 0;
    public SchoolStudent(String name) { this.name = name; }
    public String getName() { return name; }
    public void addCourse(String code) { if (courseCount < 5) courses[courseCount++] = code; }
    public String getCourseList() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < courseCount; i++) {
            if (i > 0) sb.append(",");
            sb.append(courses[i]);
        }
        return sb.toString();
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int c = sc.nextInt();
        Course[] courseArr = new Course[c];
        for (int i = 0; i < c; i++) {
            String code = sc.next(), title = sc.next();
            int seats = sc.nextInt();
            courseArr[i] = new Course(code, title, seats);
        }
        int s = sc.nextInt();
        SchoolStudent[] students = new SchoolStudent[s];
        for (int i = 0; i < s; i++) {
            String name = sc.next();
            students[i] = new SchoolStudent(name);
            String token;
            while (!(token = sc.next()).equals("DONE")) {
                for (Course cr : courseArr) {
                    if (cr.getCode().equals(token)) {
                        if (cr.enroll()) {
                            students[i].addCourse(token);
                            System.out.println("Enrolled " + name + " in " + token);
                        } else {
                            System.out.println("Full: " + token);
                        }
                        break;
                    }
                }
            }
        }
        for (SchoolStudent st : students)
            System.out.println(st.getName() + ": " + st.getCourseList());
    }
}`,
    testCases: [
      {
        id: "JCH09_H2_T1",
        label: "One full course",
        mockInputs: [
          "2", "CS101 Java 2", "CS102 Python 1",
          "2",
          "Alice", "CS101", "CS102", "DONE",
          "Bob", "CS101", "CS102", "DONE",
        ],
        expectedOutput:
          "Enrolled Alice in CS101\nEnrolled Alice in CS102\nEnrolled Bob in CS101\nFull: CS102\nAlice: CS101,CS102\nBob: CS101",
      },
      {
        id: "JCH09_H2_T2",
        label: "All enroll fine",
        mockInputs: [
          "1", "CS201 Data 5",
          "2",
          "Ravi", "CS201", "DONE",
          "Sita", "CS201", "DONE",
        ],
        expectedOutput:
          "Enrolled Ravi in CS201\nEnrolled Sita in CS201\nRavi: CS201\nSita: CS201",
        isBoundary: true,
      },
      {
        id: "JCH09_H2_T3",
        label: "Course with zero seats",
        mockInputs: [
          "1", "CS300 AI 0",
          "1",
          "Dev", "CS300", "DONE",
        ],
        expectedOutput: "Full: CS300\nDev: ",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "multi-class design", "enrollment logic", "array management"],
    xpReward: 450,
    estimatedMinutes: 45,
    designChallenge:
      "Add a waitlist per course that automatically enrolls the next waitlisted student when someone drops.",
  },

  {
    id: "JCH09_H3",
    chapterId: "JCH09_ENCAP",
    chapterNumber: 9,
    tier: "hackathon",
    tierIndex: 2,
    title: "Inventory Management System",
    emoji: "📦",
    tagline: "Track products with stock, pricing, and automated reorder alerts.",
    problemStatement:
      "Create a `Product` class with private `String id`, `String name`, `double price`, `int stock`, `int reorderLevel`. Methods:\n- `sell(int qty)`: decreases stock if stock >= qty; else print \"Insufficient stock: <id>\". After a successful sale, if stock <= reorderLevel print \"Reorder alert: <id>\".\n- `restock(int qty)`: adds qty to stock.\n- `getInfo()`: returns `\"<id> <name> $<price> stock:<stock>\"` (use String.valueOf for price to avoid .0 suffix for whole numbers).\n- `getId()`: returns id.\n\nRead P products then N operations (`SELL <id> <qty>`, `RESTOCK <id> <qty>`, `INFO <id>`).",
    inputFormat:
      "Line 1: P. Next P lines: `<id> <name> <price> <stock> <reorderLevel>`.\nLine: N. Next N lines: operations.",
    outputFormat: "Alerts and INFO output, one per line.",
    examples: [
      {
        input: "2\nP001 Apple 0.5 10 3\nP002 Milk 1.2 5 2\n4\nSELL P001 8\nINFO P001\nSELL P001 5\nRESTOCK P001 20",
        output: "Reorder alert: P001\nP001 Apple $0.5 stock:2\nInsufficient stock: P001",
      },
    ],
    constraints: ["1 <= P <= 20", "1 <= N <= 100"],
    hints: [
      "Store products in a `Product[]` array, look up by id with linear search.",
      "sell: check stock >= qty first; on success decrement then check reorderLevel.",
      "getInfo: use `(price == (long) price) ? String.valueOf((long) price) : String.valueOf(price)` for clean price display.",
    ],
    referenceProgram: {
      title: "Product Inventory with Alerts",
      description: "Encapsulated stock management with sell validation and reorder triggers.",
      code: `import java.util.Scanner;
class Product {
    private final String id, name;
    private final double price;
    private int stock;
    private final int reorderLevel;
    public Product(String id, String name, double price, int stock, int reorderLevel) {
        this.id = id; this.name = name; this.price = price;
        this.stock = stock; this.reorderLevel = reorderLevel;
    }
    public String getId() { return id; }
    public void sell(int qty) {
        if (qty > stock) { System.out.println("Insufficient stock: " + id); return; }
        stock -= qty;
        if (stock <= reorderLevel) System.out.println("Reorder alert: " + id);
    }
    public void restock(int qty) { stock += qty; }
    public String getInfo() {
        String ps = (price == (long) price) ? String.valueOf((long) price) : String.valueOf(price);
        return id + " " + name + " $" + ps + " stock:" + stock;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int p = sc.nextInt();
        Product[] products = new Product[p];
        for (int i = 0; i < p; i++) {
            String id = sc.next(), name = sc.next();
            double price = sc.nextDouble();
            int stock = sc.nextInt(), reorder = sc.nextInt();
            products[i] = new Product(id, name, price, stock, reorder);
        }
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String op = sc.next(), id = sc.next();
            Product target = null;
            for (Product pr : products) if (pr.getId().equals(id)) { target = pr; break; }
            if (target == null) continue;
            switch (op) {
                case "SELL":    target.sell(sc.nextInt()); break;
                case "RESTOCK": target.restock(sc.nextInt()); break;
                case "INFO":    System.out.println(target.getInfo()); break;
            }
        }
    }
}`,
    },
    starterCode: `import java.util.Scanner;
class Product {
    // TODO: private fields, constructor, sell(), restock(), getId(), getInfo()
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // TODO: read products then process operations
    }
}`,
    solution: `import java.util.Scanner;
class Product {
    private final String id, name;
    private final double price;
    private int stock;
    private final int reorderLevel;
    public Product(String id, String name, double price, int stock, int reorderLevel) {
        this.id = id; this.name = name; this.price = price;
        this.stock = stock; this.reorderLevel = reorderLevel;
    }
    public String getId() { return id; }
    public void sell(int qty) {
        if (qty > stock) { System.out.println("Insufficient stock: " + id); return; }
        stock -= qty;
        if (stock <= reorderLevel) System.out.println("Reorder alert: " + id);
    }
    public void restock(int qty) { stock += qty; }
    public String getInfo() {
        String ps = (price == (long) price) ? String.valueOf((long) price) : String.valueOf(price);
        return id + " " + name + " $" + ps + " stock:" + stock;
    }
}
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int p = sc.nextInt();
        Product[] products = new Product[p];
        for (int i = 0; i < p; i++) {
            String id = sc.next(), name = sc.next();
            double price = sc.nextDouble();
            int stock = sc.nextInt(), reorder = sc.nextInt();
            products[i] = new Product(id, name, price, stock, reorder);
        }
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            String op = sc.next(), id = sc.next();
            Product target = null;
            for (Product pr : products) if (pr.getId().equals(id)) { target = pr; break; }
            if (target == null) continue;
            switch (op) {
                case "SELL":    target.sell(sc.nextInt()); break;
                case "RESTOCK": target.restock(sc.nextInt()); break;
                case "INFO":    System.out.println(target.getInfo()); break;
            }
        }
    }
}`,
    testCases: [
      {
        id: "JCH09_H3_T1",
        label: "Reorder and insufficient",
        mockInputs: [
          "2", "P001 Apple 0.5 10 3", "P002 Milk 1.2 5 2",
          "4", "SELL P001 8", "INFO P001", "SELL P001 5", "RESTOCK P001 20",
        ],
        expectedOutput: "Reorder alert: P001\nP001 Apple $0.5 stock:2\nInsufficient stock: P001",
      },
      {
        id: "JCH09_H3_T2",
        label: "Restock then sell triggers reorder",
        mockInputs: [
          "1", "P003 Bread 2.0 1 5",
          "3", "RESTOCK P003 10", "SELL P003 6", "INFO P003",
        ],
        expectedOutput: "Reorder alert: P003\nP003 Bread $2 stock:5",
        isBoundary: true,
      },
      {
        id: "JCH09_H3_T3",
        label: "Sell to exactly zero",
        mockInputs: [
          "1", "P004 Pen 1.0 5 0",
          "2", "SELL P004 5", "INFO P004",
        ],
        expectedOutput: "P004 Pen $1 stock:0",
        isBoundary: true,
        isHidden: true,
      },
    ],
    concepts: ["encapsulation", "inventory", "business alerts", "multi-operation dispatch"],
    xpReward: 500,
    estimatedMinutes: 50,
    designChallenge:
      "Add a PremiumProduct concept with a loyalty-points system that awards 1 point per dollar spent, and a method to redeem points for discounts.",
  },
];
