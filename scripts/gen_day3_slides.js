const fs = require("fs");

const slides = [
  {
    title: "Day 3 Overview",
    subtitle: "Exception Handling, Collections & Generics",
    content: [
      "Phase 1 | 25-Feb-26 | 1:00 PM – 5:00 PM.",
      "This deck walks through the exception journey, collections framework, and generics patterns in 50 slides.",
      "Each slide contains speaker notes, code snippets, polls, labs, and discussion prompts."
    ]
  },
  {
    title: "Session Goals",
    subtitle: "Why these topics matter",
    content: [
      "Explain how the JVM handles errors, how collections manage data, and how generics enforce safe APIs.",
      "Keep the labs from Java_Full_Stack_Course_Outline_With_Labs.docx front and center while running polls."
    ]
  },
  {
    title: "What is an Exception?",
    subtitle: "Runtime disruption",
    content: [
      "An exception is an object thrown when a method cannot complete normally.",
      "It propagates up the call stack until a handler catches it."
    ]
  },
  {
    title: "Compile-time vs Runtime",
    subtitle: "Errors vs Exceptions",
    content: [
      "Compile-time errors are detected by the compiler, while runtime exceptions occur during execution.",
      "Recognizing the difference helps you debug faster."
    ]
  },
  {
    title: "Throwable Hierarchy",
    subtitle: "Throwable, Error, Exception",
    content: [
      "Throwable splits into Error (critical JVM issues) and Exception (recoverable runtime conditions).",
      "Exception divides into checked and unchecked branches."
    ]
  },
  {
    title: "Checked Exceptions",
    subtitle: "Compiler enforces handling",
    content: [
      "Examples include IOException and SQLException.",
      "You must catch them or declare them with throws."
    ]
  },
  {
    title: "Unchecked Exceptions",
    subtitle: "RuntimeException family",
    content: [
      "NullPointerException and ArithmeticException extend RuntimeException.",
      "They can be left uncaught, so guard inputs carefully."
    ]
  },
  {
    title: "try-catch Basics",
    subtitle: "Catching flow",
    content: [
      "Place risky code inside try and follow with catch blocks for matching types.",
      "Log exceptions before recovering or rethrowing."
    ]
  },
  {
    title: "Multi-catch",
    subtitle: "Java 7 feature",
    content: [
      "Use catch (IOException | SecurityException ex) to share handling logic.",
      "Helpful when several exceptions need identical processing."
    ]
  },
  {
    title: "finally Block",
    subtitle: "Cleanup guard",
    content: [
      "finally executes regardless of whether an exception occurred (unless System.exit interrupts).",
      "Great place to log completion or release resources outside try-with-resources."
    ]
  },
  {
    title: "throw vs throws",
    subtitle: "Raising vs declaring",
    content: [
      "Use throw to raise a specific exception instance.",
      "Use throws in the method signature to delegate responsibility."
    ]
  },
  {
    title: "Custom Exceptions",
    subtitle: "Domain signals",
    content: [
      "Extend RuntimeException for business rule violations (e.g., InsufficientFunds).",
      "Include contextual data like error codes."
    ]
  },
  {
    title: "Try-with-resources",
    subtitle: "Auto cleanup",
    content: [
      "AutoCloseable resources close automatically even during exceptions.",
      "Great for InputStream/BufferedReader stacks."
    ],
    code: `try (BufferedReader reader = Files.newBufferedReader(path)) {
    reader.lines().forEach(System.out::println);
} catch (IOException e) {
    log.error("Read failed", e);
}`
  },
  {
    title: "Logging Strategy",
    subtitle: "Context-rich logs",
    content: [
      "Log the event along with the offending value and stack trace.",
      "Wrap exceptions with more contextual ones before rethrowing."
    ]
  },
  {
    title: "Lab 3.1 Pt1",
    subtitle: "Catch specific errors",
    content: [
      "Handle ArithmeticException, NumberFormatException, and NullPointerException with targeted recovery paths.",
      "Pair up to intentionally trigger each and inspect stack traces."
    ]
  },
  {
    title: "Lab 3.1 Pt2",
    subtitle: "Multi-catch + finally",
    content: [
      "Group exception handling with multi-catch and guarantee cleanup via finally."
    ]
  },
  {
    title: "Lab 3.1 Pt3",
    subtitle: "InsufficientFundsException",
    content: [
      "Create a RuntimeException that carries a reason string.",
      "Throw it from withdraw when balance is insufficient."
    ],
    code: `public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}`
  },
  {
    title: "Lab 3.1 Pt4",
    subtitle: "AutoCloseable resource",
    content: [
      "Implement AutoCloseable to log open/close incidents.",
      "Demonstrate suppressed exceptions when close also throws."
    ]
  },
  {
    title: "Exception Poll",
    subtitle: "When to log?",
    content: [
      "Log when the exception crosses a module boundary or holds actionable data.",
      "Avoid logging the same exception multiple times."
    ]
  },
  {
    title: "Debug Challenge",
    subtitle: "Suppressed exceptions",
    content: [
      "Force a closing error to inspect getSuppressed() output.",
      "Use it to surface secondary failures."
    ]
  }
];

const collectionsNotes = [
  ["Collections Intro", "Why arrays fail", ["Arrays are fixed size with no utility methods.", "Collections provide resizing, iteration, and concurrency choices."]],
  ["Framework Architecture", "Collection vs Map", ["Collection is the root for List, Set, Queue; Map stands beside but shares helpers.", "Understanding the tree makes selecting structures easier."]],
  ["List Interface", "Ordered sequences", ["Lists preserve insertion order and allow duplicates.", "Support index-based adds/removes."]],
  ["ArrayList", "Dynamic array", ["Backed by an array that grows by ~50% when full.", "Fast random access and iteration."]],
  ["LinkedList", "Node chain", ["Doubly linked nodes support quick head/tail inserts.", "Random access is linear."]],
  ["Vector & Stack", "Legacy sync", ["Vector synchronizes every method (slow).", "Stack extends Vector; prefer Deque for LIFO today."]],
  ["Set Interface", "Uniqueness", ["Sets rely on equals/hashCode.", "No duplicates allowed."]],
  ["HashSet", "Buckets & load factor", ["Uses hashing to assign buckets; load factor 0.75 triggers resize.", "Collision chains degrade to trees with many entries."]],
  ["LinkedHashSet", "Insertion order", ["Maintains insertion order via linked entries.", "Ideal for deterministic iteration."]],
  ["TreeSet", "Sorted set", ["Red-black tree keeps elements sorted.", "Provide comparator or rely on Comparable."]],
  ["Map Interface", "Key-value pairs", ["Maps associate unique keys to values.", "Support optional compute and merge helpers."]],
  ["HashMap", "Internal design", ["Buckets store entries determined by hashCode.", "Resizing keeps bucket occupancy balanced."]],
  ["LinkedHashMap", "LRU caches", ["Tracks insertion or access order.", "Override removeEldestEntry for eviction."]],
  ["TreeMap", "Sorted keys", ["Sorted according to natural order or comparator.", "Operations cost O(log n)."]],
  ["Hashtable vs ConcurrentHashMap", "Thread safety", ["Hashtable synchronizes each method; causes contention.", "ConcurrentHashMap uses lock striping for scalability."]],
  ["Iteration Techniques", "Loops & iterators", ["For loops, enhanced for, Iterator/ListIterator removal.", "Streams and forEach lambdas simplify iteration."]],
  ["Streams Intro", "Pipeline helpers", ["Map/filter/reduce pipeline example.", "Avoid shared mutable state on parallel streams."]],
  ["ArrayDeque", "Deque operations", ["Support push/pop and offer/poll with no fixed capacity.", "Replace legacy Stack for LIFO behavior."]],
  ["HashMap Phonebook", "Helper methods", ["Use getOrDefault to supply fallback values.", "Use putIfAbsent and computeIfPresent safely update."]]
];

collectionsNotes.forEach(([title, subtitle, paragraphs]) => {
  slides.push({ title, subtitle, content: paragraphs });
});

const sortingNotes = [
  ["Comparable", "Natural order", ["Override compareTo in Student to sort by GPA.", "Collections.sort uses natural order by default."]],
  ["Comparator", "Alternate order", ["Use Comparator.comparing and thenComparing for multi-level sorts.", "Supply comparators when natural order doesnt match requirements."]],
  ["Collections Utilities", "Helper methods", ["Collections.sort, reverse, shuffle, binarySearch operate on lists.", "Binary search requires sorted data."]],
  ["Arrays Utilities", "Array helpers", ["Arrays.asList bridges arrays to lists.", "Arrays.stream builds pipelines for primitive arrays."]]
];

sortingNotes.forEach(([title, subtitle, paragraphs]) => {
  slides.push({ title, subtitle, content: paragraphs });
});

const genericsNotes = [
  ["Generics Intro", "Type safety", ["Generics enforce compile-time type checking.", "Avoid raw types to prevent runtime ClassCastException."]],
  ["Generic Class", "Pair<A,B>", ["Store heterogeneous values with two type parameters.", "Typed getters keep usage safe."]],
  ["Generic Method", "printList", ["Static generic method prints any List<T>.", "Callers typically rely on type inference."]],
  ["Bounded Types", "<T extends Number>", ["Restrict type parameter to Number or subclasses.", "Allows safe usage of numeric operations."]],
  ["Multiple Bounds", "<T extends Comparable<T> & Serializable>", ["Combine requirements using &.", "Useful when types must satisfy multiple contracts."]],
  ["Wildcards", "?, ? extends, ? super", ["PECS (Producer Extends, Consumer Super) guides wildcard choice.", "? extends Number for reading values, ? super Integer for writing."]],
  ["Type Erasure", "Runtime view", ["Generics vanish after compilation; runtime sees raw types.", "Avoid instanceof parameterized types."]],
  ["Restrictions", "Limitations", ["Cannot instantiate type parameters or create generic arrays.", "Static methods must declare their own type parameters."]]
];

genericsNotes.forEach(([title, subtitle, paragraphs]) => {
  slides.push({ title, subtitle, content: paragraphs });
});

const extras = [
  {
    title: "Property Files",
    subtitle: "config.properties",
    content: [
      "Use java.util.Properties to load settings outside your code.",
      "Store API keys, credentials, feature toggles securely."
    ],
    code: `Properties config = new Properties();
try (InputStream in = Files.newInputStream(Paths.get("config.properties"))) {
    config.load(in);
}`
  },
  {
    title: "Quiz",
    subtitle: "Which set keeps insertion order?",
    content: ["Answer: LinkedHashSet or LinkedHashMap retains insertion order."]
  },
  {
    title: "Debug Challenge",
    subtitle: "ConcurrentModificationException",
    content: [
      "Removing from a collection while iterating triggers CME.",
      "Fix with Iterator.remove or copy entries before removing."
    ]
  },
  {
    title: "Assignment",
    subtitle: "Student Grade Manager",
    content: [
      "Build Map<String,List<Integer>> storing grades, load from properties, validate entries, throw custom validation exception.",
      "Log summary, explain failure, and push solution with README reflections."
    ]
  },
  {
    title: "Best Practices",
    subtitle: "Wrap and log",
    content: [
      "Wrap underlying exceptions to add domain context before rethrowing.",
      "Log only once with the full stack trace to prevent duplicates."
    ]
  },
  {
    title: "Wrap-up",
    subtitle: "Next steps",
    content: [
      "Push labs to Git, capture observations, preview Day 4.",
      "Share insights in the peer channel and plan follow-ups."
    ]
  }
];

extras.forEach(entry => slides.push(entry));

while (slides.length < 50) {
  slides.push({
    title: "Bonus Insight",
    subtitle: "Reflect and share",
    content: ["Discuss how todays lessons will shape your next sprint."]
  });
}

function renderSlide(slide, index) {
  let html = `    <div class="slide${index === 0 ? " active" : ""}" id="slide${index + 1}">\n`;
  html += `      <span class="tag">Slide ${index + 1}</span>\n`;
  html += `      <h2>${slide.title}</h2>\n`;
  html += "      <div class=\"accent-line\"></div>\n";
  html += `      <h3>${slide.subtitle}</h3>\n`;
  slide.content.forEach(paragraph => {
    html += `      <p>${paragraph}</p>\n`;
  });
  if (slide.code) {
    const escaped = slide.code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html += "      <div class=\"code-panel\">\n";
    html += "        <button class=\"copy-btn\">Copy</button>\n";
    html += `        <pre>${escaped}</pre>\n`;
    html += "      </div>\n";
  }
  html += "    </div>\n";
  return html;
}

const htmlParts = [
  "<!DOCTYPE html>",
  "<html lang=\"en\">",
  "<head>",
  "  <meta charset=\"UTF-8\">",
  "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
  "  <title>Day 3 Slides — Exception Handling, Collections & Generics</title>",
  "  <link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Source+Code+Pro:wght@400;600&family=Lato:wght@300;400;700&display=swap\" rel=\"stylesheet\">",
  "  <style>",
  "    :root { --primary:#0A1628; --accent:#50FA7B; --accent2:#FF79C6; --light:#F0F4FF; --text:#E8EDF5; --card:rgba(255,255,255,0.06); --border:rgba(80,250,123,0.3); --code:#0D1117; --muted:#8899BB; }",
  "    *{box-sizing:border-box;margin:0;padding:0;}",
  "    body{font-family:'Lato',sans-serif;background:var(--primary);color:var(--text);overflow:hidden;height:100vh;width:100vw;}",
  "    .deck{width:100vw;height:100vh;position:relative;}",
  "    .slide{display:none;width:100%;height:100%;position:absolute;top:0;left:0;padding:50px 70px 140px;overflow-y:auto;background:linear-gradient(145deg,#0A1628,#03080f);}",
  "    .slide.active{display:flex;flex-direction:column;gap:14px;}",
  "    h2{font-family:'Montserrat',sans-serif;font-size:2.2rem;color:var(--light);}",
  "    h3{font-family:'Montserrat',sans-serif;font-size:1.4rem;color:var(--accent);}",
  "    p,li{font-size:1.05rem;line-height:1.6;}",
  "    ul{margin-left:26px;}",
  "    .accent-line{width:90px;height:4px;background:var(--accent);border-radius:4px;margin:6px 0 16px;}",
  "    .code-panel{background:var(--code);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:18px;position:relative;overflow:auto;}",
  "    .code-panel pre{font-family:'Source Code Pro',monospace;font-size:0.95rem;color:#f8fafc;white-space:pre-wrap;}",
  "    .copy-btn{position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.15);border:none;padding:6px 12px;border-radius:6px;color:#fff;font-size:0.85rem;cursor:pointer;}",
  "    .tag{display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;background:rgba(80,250,123,0.15);font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:6px;}",
  "    .panel{border:1px dashed rgba(255,255,255,0.2);border-radius:10px;padding:14px;margin-top:12px;background:rgba(255,255,255,0.02);}",
  "    .quiz,.challenge{border-left:4px solid var(--accent2);padding-left:12px;margin-top:12px;}",
  "    .nav{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:12px;}",
  "    .nav button{background:var(--card);border:1px solid var(--border);color:var(--light);padding:10px 20px;border-radius:8px;font-family:'Montserrat',sans-serif;font-weight:600;cursor:pointer;transition:transform .2s;}",
  "    .nav button:disabled{opacity:0.4;cursor:not-allowed;}",
  "    .nav button:not(:disabled):hover{transform:translateY(-2px);}",
  "  </style>",
  "</head>",
  "<body>",
  "  <div class=\"deck\">"
];

slides.forEach((slide, index) => {
  htmlParts.push(renderSlide(slide, index));
});

htmlParts.push(
"  </div>",
"  <div class=\"nav\">",
"    <button id=\"prev\">← Previous</button>",
"    <button id=\"next\">Next →</button>",
"  </div>",
"  <script>",
"    const slides = document.querySelectorAll('.slide');",
"    let index = 0;",
"    const showSlide = () => {",
"      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));",
"      document.getElementById('prev').disabled = index === 0;",
"      document.getElementById('next').disabled = index === slides.length - 1;",
"    };",
"    document.getElementById('next').addEventListener('click', () => {",
"      if (index < slides.length - 1) {",
"        index++;",
"        showSlide();",
"      }",
"    });",
"    document.getElementById('prev').addEventListener('click', () => {",
"      if (index > 0) {",
"        index--;",
"        showSlide();",
"      }",
"    });",
"    document.addEventListener('keydown', (event) => {",
"      if (event.key === 'ArrowRight') document.getElementById('next').click();",
"      if (event.key === 'ArrowLeft') document.getElementById('prev').click();",
"    });",
"    document.querySelectorAll('.copy-btn').forEach((button) => {",
"      button.addEventListener('click', () => {",
"        const pre = button.parentElement.querySelector('pre');",
"        if (!pre) return;",
"        const range = document.createRange();",
"        range.selectNodeContents(pre);",
"        const selection = window.getSelection();",
"        selection.removeAllRanges();",
"        selection.addRange(range);",
"        document.execCommand('copy');",
"        selection.removeAllRanges();",
"        button.textContent = 'Copied';",
"        setTimeout(() => { button.textContent = 'Copy'; }, 1200);",
"      });",
"    });",
"    showSlide();",
"  </script>",
"</body>",
"</html>"
);

fs.writeFileSync("docs/day3_slides_full.html", htmlParts.join("\n"), "utf8");
