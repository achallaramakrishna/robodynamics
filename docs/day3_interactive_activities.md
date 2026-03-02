## Day 3 Interactive Activities

Use these polls and challenges to keep the session high-energy. Each poll is designed for a quick live vote, then discuss the correct answer before moving on.

### Polls

#### Classes (five polls)
1. **What keyword creates a new object?**  
   Options: `new`, `class`, `public`, `extends`
2. **Which visibility modifier is default within the package?**  
   Options: `private`, `protected`, *(no modifier)*, `final`
3. **Which method signature expresses the object’s state?**  
   Options: `toString()`, `equals()`, `hashCode()`, `notify()`
4. **How do you prevent a class from being subclassed?**  
   Options: `abstract`, `static`, `private`, `final`
5. **Which describes a “model class”?**  
   Options: “Holds data only”, “Contains business logic”, “Manages threads”, “Handles I/O”

#### Inheritance
1. **Which operator accesses the superclass constructor?**  
   Options: `this`, `super`, `extends`, `base`
2. **What happens if the subclass overrides a method without using @Override?**  
   Options: “Compilation error”, “Methods override anyway”, “Runtime warning”, “Method is final”
3. **How do you call the parent version of an overridden method?**  
   Options: `super.method()`, `parent.method()`, `this.method()`, `base.method()`
4. **Which relationship represents inheritance?**  
   Options: “Has-a”, “Uses-a”, “Is-a”, “Needs-a”
5. **Which scenario best needs inheritance?**  
   Options: “Different animals sharing eat()”, “Different UIs for separate apps”, “Networking vs disk I/O”, “Bank vs Insurance services”

#### Interfaces
1. **What keyword implements an interface?**  
   Options: `extends`, `implements`, `uses`, `super`
2. **Which feature is true for interfaces in Java 8+?**  
   Options: “Can hold state”, “Can have default methods”, “Can be instantiated”, “Members are private”
3. **Can a class implement multiple interfaces?**  
   Options: “Yes”, “No”, “Only if abstract”, “Only with generics”
4. **Why use interfaces instead of abstract classes?**  
   Options: “Avoid multiple inheritance limitations”, “Require constructors”, “Hold business data”, “Provide state”
5. **Which trait belongs on an interface?**  
   Options: “start() and stop()”, “static factory”, “private fields”, “final methods”

#### Static Concepts
1. **What does static belong to?**  
   Options: “Instance”, “Class”, “Constructor”, “Interface”
2. **Static block runs when?**  
   Options: “At runtime before first use”, “Only when new object created”, “After constructor”, “On garbage collection”
3. **Can static methods access instance fields?**  
   Options: “Yes”, “No unless object provided”, “Only if final”, “Only inside interface”
4. **Why use a static factory?**  
   Options: “Control creation logic”, “Replace constructors”, “Manage caches”, “All of these”
5. **Which describes static imports?**  
   Options: “Import constants/methods statically”, “Make classes static”, “Extend superclass statically”, “None”

#### Exception Handling
1. **Which block runs when exception thrown and not caught yet?**  
   Options: `finally`, `catch`, `throw`, `try`
2. **Which exception must be declared or caught?**  
   Options: `RuntimeException`, `IOException`, `NullPointerException`, `ArithmeticException`
3. **What keyword creates an exception object?**  
   Options: `throw`, `try`, `catch`, `implements`
4. **When is finally skipped?**  
   Options: `After return`, `System.exit`, `Exception caught`, `No exception`
5. **What does multi-catch require?**  
   Options: `Common supertype`, `Same package`, `try-with-resources`, `two catch files`

#### Collections
1. **Which collection allows duplicates but is unordered?**  
   Options: `List`, `Set`, `Map`, `Queue`
2. **Which Map keeps insertion order?**  
   Options: `HashMap`, `LinkedHashMap`, `TreeMap`, `Hashtable`
3. **Which set offers sorted order?**  
   Options: `HashSet`, `LinkedHashSet`, `TreeSet`, `ConcurrentHashSet`
4. **What does computeIfAbsent do?**  
   Options: “Add default value if missing”, “Remove entry”, “Sort map”, “Nothing”
5. **Which interface provides FIFO semantics?**  
   Options: `List`, `Queue`, `Set`, `Map`

#### Generics
1. **What prevents ClassCastException at compile time?**  
   Options: “Generics”, “Reflection”, “Exceptions”, “Enums”
2. **Which syntax declares upper bound?**  
   Options: `<T>`, `<T extends Number>`, `<T super Number>`, `<? extends Number>`
3. **What does PECS stand for?**  
   Options: “Producer Extends Consumer Super”, “Pattern Extend Class Strategy”, “Proxy Extract Class Super”, “Plain Enum Control Style”
4. **Can you create `new T()` inside a generic class?**  
   Options: “Yes”, “No”, “Only with reflection”, “Only if T extends Object”
5. **Which wildcard lets you add integers?**  
   Options: `List<?>`, `List<? extends Integer>`, `List<? super Integer>`, `List<T>`

### Debug Challenge

**Scenario:** You have a `List<String>` of student names and need to remove duplicates while iterating:

```java
List<String> students = new ArrayList<>(List.of("Alice","Bob","Alice"));
for (String student : students) {
    if (student.equals("Alice")) {
        students.remove(student);
    }
}
```

**Task:** Explain why this throws `ConcurrentModificationException` and refactor using `Iterator` or `removeIf` to keep duplicates removal safe.

### Output Challenge

**Scenario:** Consider this snippet:

```java
try {
    System.out.println("Step 1");
    throw new IllegalStateException("oops");
} catch (RuntimeException e) {
    System.out.println("Step 2");
} finally {
    System.out.println("Step 3");
}
```

**Task:** Before running it, have participants predict the console output, then execute it live to confirm. Use the discussion to reinforce finally guarantees even after an exception. 
