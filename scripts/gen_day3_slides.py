import textwrap

slides = [
    {
        "title": "Day 3 Overview",
        "subtitle": "Exception Handling, Collections & Generics",
        "content": [
            "Phase 1 | 25-Feb-26 | 1:00 PM – 5:00 PM.",
            "This deck walks through exception handling theory, collections explorations, and generics design across 50 slides.",
            "Each slide offers speaking notes, code snippets, and quick prompts."
        ]
    },
    {
        "title": "Session Goals",
        "subtitle": "Why these topics matter",
        "content": [
            "Understand how the JVM unwinds exceptions, choose the right collections, and keep APIs safe with generics.",
            "Work through labs referenced in Java_Full_Stack_Course_Outline_With_Labs.docx while answering polls and coding challenges."
        ]
    },
    {
        "title": "What is an Exception?",
        "subtitle": "Runtime disruptions",
        "content": [
            "An exception is an object thrown by the JVM when a method cannot finish normally.",
            "It propagates up the call stack until a matching catch handles it."
        ]
    },
    {
        "title": "Compile-time vs Runtime",
        "subtitle": "Errors vs Exceptions",
        "content": [
            "Compile-time errors (syntax or type mismatches) prevent code compilation.",
            "Runtime exceptions happen during execution due to bad data or logic."
        ]
    },
    {
        "title": "Throwable Hierarchy",
        "subtitle": "Throwable, Error, Exception",
        "content": [
            "Throwable splits into Error (critical JVM faults) and Exception (recoverable issues).",
            "Focus on Exception and its checked vs unchecked branches."
        ]
    },
    {
        "title": "Checked Exceptions",
        "subtitle": "Compiler enforced handling",
        "content": [
            "Checked exceptions like IOException must be caught or declared with throws.",
            "They force the caller to think about recovery."
        ]
    },
    {
        "title": "Unchecked Exceptions",
        "subtitle": "Programmer bugs",
        "content": [
            "RuntimeException subclasses such as NullPointerException occur when preconditions fail.",
            "They can propagate without declaration, so guard inputs carefully."
        ]
    },
    {
        "title": "try-catch Basics",
        "subtitle": "Handling flow",
        "content": [
            "Wrap risky operations inside try and follow up with catches for matching types.",
            "Log, retry, or provide alternative results inside catch."
        ]
    },
    {
        "title": "Multi-catch",
        "subtitle": "Java 7+ feature",
        "content": [
            "Group similar exceptions with catch (IOException | SecurityException ex).",
            "Reduces duplication while preserving compile-time safety."
        ]
    },
    {
        "title": "finally Block",
        "subtitle": "Guaranteed cleanup",
        "content": [
            "finally runs regardless of exception unless System.exit is called.",
            "Ideal for final logging or cleanup outside try-with-resources."
        ]
    },
    {
        "title": "throw vs throws",
        "subtitle": "Raising vs declaring",
        "content": [
            "Use throw to instantiate and propagate a new exception.",
            "Use throws to declare which exceptions a method might let bubble up."
        ]
    },
    {
        "title": "Custom Exceptions",
        "subtitle": "Domain-specific signals",
        "content": [
            "Extend RuntimeException for business logic invariants like InsufficientFunds.",
            "Add constructors that accept message, cause, and metadata."
        ]
    },
    {
        "title": "Try-with-resources",
        "subtitle": "Auto cleanup",
        "content": [
            "Resources implementing AutoCloseable close automatically even when exceptions occur.",
            "Combine with logging to surface suppressed exceptions."
        ],
        "code": textwrap.dedent(
            """\
            try (BufferedReader reader = Files.newBufferedReader(path)) {
                reader.lines().forEach(System.out::println);
            } catch (IOException e) {
                log.error("Read failed", e);
            }"""
        )
    },
    {
        "title": "Logging Strategy",
        "subtitle": "Context-rich logging",
        "content": [
            "Always log the problematic value and stack trace together.",
            "Wrap and rethrow when crossing service layers."
        ]
    },
    {
        "title": "Lab 3.1 Pt1",
        "subtitle": "Catch Arithmetic/NumberFormat/NPE",
        "content": [
            "Handle each type individually and record which data triggered it.",
            "Ask teams to reproduce intentionally to see stack traces."
        ]
    },
    {
        "title": "Lab 3.1 Pt2",
        "subtitle": "Multi-catch & finally",
        "content": [
            "Use multi-catch for shared handling and a finally block for cleanup."
        ]
    },
    {
        "title": "Lab 3.1 Pt3",
        "subtitle": "InsufficientFundsException",
        "content": [
            "Extend RuntimeException with message and optional violation data."
        ],
        "code": "public class InsufficientFundsException extends RuntimeException {\n    public InsufficientFundsException(String message) {\n        super(message);\n    }\n}"
    },
    {
        "title": "Lab 3.1 Pt4",
        "subtitle": "Custom AutoCloseable",
        "content": [
            "Implement AutoCloseable to log open/close events and test suppressed exceptions."
        ]
    },
    {
        "title": "Exception Poll",
        "subtitle": "When to log?",
        "content": [
            "Log when the exception crosses an API boundary or when actionable insight exists.",
            "Avoid logging twice to prevent clutter."
        ]
    },
    {
        "title": "Debug Challenge",
        "subtitle": "Suppressed exceptions",
        "content": [
            "Cause a failure while closing a resource to show getSuppressed details."
        ]
    },
]

def append_section(title, subtitle, paragraphs, code=None):
    slides.append({"title": title, "subtitle": subtitle, "content": paragraphs, "code": code})

collections_notes = [
    ("Collections Intro", "Why arrays fall short", ["Arrays are fixed size and lack utility helpers.", "Collections provide dynamic size, iteration, and concurrency choices."]),
    ("Framework Architecture", "Collection vs Map", ["Collection is the root for List, Set, Queue; Map sits outside but shares helpers.", "Understanding the tree guides implementation choices."]),
    ("List Interface", "Ordered sequences", ["Lists maintain insertion order and allow duplicates.", "Index-based operations let you add/remove at positions."]),
    ("ArrayList", "Dynamic array", ["Backed by resizable array; increments by 50% when full.", "Fast random access, amortized constant-time append."]),
    ("LinkedList", "Node-based", ["Doubly-linked nodes support quick head/tail inserts.", "Random access is linear. Use for frequent insert/remove cycles."]),
    ("Vector & Stack", "Legacy synchronized", ["Vector synchronizes methods; prefer ArrayList for single-threaded scenarios.", "Stack extends Vector; use Deque for LIFO behavior today."]),
    ("Set Interface", "Uniqueness", ["Sets rely on equals/hashCode to prevent duplicates.", "Hash collisions are resolved via chaining or treeification."]),
    ("HashSet", "Buckets & load factor", ["Uses hashCode to assign to buckets.", "Resizes when load factor (default 0.75) exceeded."]),
    ("LinkedHashSet", "Ordered iteration", ["Maintains insertion order via linked list.", "Perfect when deterministic iteration is required."]),
    ("TreeSet", "Sorted entries", ["Red-black tree ensures log(n) ops.", "Provide natural ordering or comparator."]),
    ("Map Interface", "Key-value storage", ["Each key maps to exactly one value.", "Supports operations such as get, put, remove, compute."]),
    ("HashMap", "Internal structure", ["Hash buckets store entries; collisions handled by chaining.", "Java 8 converts chains to trees when collisions high."]),
    ("LinkedHashMap", "LRU support", ["Orders entries by insertion or access.", "Override removeEldestEntry for cache eviction."]),
    ("TreeMap", "Sorted keys", ["Keys sorted by comparator.", "NavigableMap features support ranges."]),
    ("Hashtable vs ConcurrentHashMap", "Thread-safe maps", ["Hashtable synchronizes entire map; ConcurrentHashMap uses lock striping.", "ConcurrentHashMap has better concurrency."]),
    ("Iteration Techniques", "Looper patterns", ["for loops, enhanced for, Iterator with remove, ListIterator for bidirectional movement.", "forEach and Streams offer lambda-powered iteration."]),
    ("Streams Overview", "Pipeline helpers", ["Stream pipeline supports map/filter/collect.", "Use caution with shared mutable state in parallel streams."]),
    ("ArrayDeque", "Double-ended queue", ["Offers stack-like push/pop and queue offer/poll.", "Efficient alternative to LinkedList for both ends."]),
    ("HashMap Phonebook", "Helper methods", ["Use getOrDefault to provide fallback values.", "Use putIfAbsent and computeIfPresent to avoid overwrites."]),
]

for entry in collections_notes:
    append_section(entry[0], entry[1], entry[2])

sorting_notes = [
    ("Comparable", "Natural ordering", ["Implement compareTo in Student to sort by GPA.", "Collections.sort uses natural order."]),
    ("Comparator", "Custom ordering", ["Use Comparator.comparing and thenComparing chains.", "Enable multi-level sorting by combining comparators."]),
    ("Collections Utilities", "Helper methods", ["sort, reverse, shuffle, binarySearch operate on lists.", "Binary search requires sorted input."]),
    ("Arrays Utilities", "Array helpers", ["Arrays.asList bridges array and collection.", "Arrays.stream creates primitive streams for pipelines."]),
]

for entry in sorting_notes:
    append_section(entry[0], entry[1], entry[2])

generics_notes = [
    ("Generics Intro", "Compile-time safety", ["Generics prevent ClassCastException by checking types before runtime.", "Raw types sneakily bypass this safety layer."]),
    ("Generic Class", "Pair<A,B>", ["Store heterogeneous values with two type parameters.", "Provide typed getters for each element."]),
    ("Generic Method", "printList", ["Static method that prints any List<T>.", "Type inference means callers often omit explicit type arguments."]),
    ("Bounded Types", "<T extends Number>", ["Restrict to Number subtypes to call math helpers.", "Useful for aggregator methods."]),
    ("Multiple Bounds", "<T extends Comparable<T> & Serializable>", ["Combine constraints when a type must be comparable and serializable.", "Use & to specify intersection."]),
    ("Wildcards", "?, ? extends, ? super", ["PECS: Producer Extends, Consumer Super to decide read vs write.", "Use ? extends when reading, ? super when writing values."]),
    ("Type Erasure", "Runtime behavior", ["Generics disappear after compilation, so Class objects lack type arguments.", "Avoid instanceof checks on parameterized types."]),
    ("Restrictions", "Limitations", ["Cannot instantiate type parameters or create generic arrays.", "Static methods need their own type parameters."]),
]

for entry in generics_notes:
    append_section(entry[0], entry[1], entry[2])

extras = [
    ("Property Files", "config.properties", ["Load using java.util.Properties and Files.newInputStream.", "Store environment-specific credentials outside code."], "Properties config = new Properties();\ntry (InputStream in = Files.newInputStream(Paths.get(\"config.properties\"))) {\n    config.load(in);\n}"),
    ("Quiz", "Insertion order set", ["Which collection retains insertion order? Answer: LinkedHashSet/LinkedHashMap."]),
    ("Debug Challenge", "ConcurrentModificationException", ["Removing while iterating throws CME; fix with Iterator.remove or use CopyOnWriteArrayList."]),
    ("Assignment", "Student Grade Manager", ["Use Map<String,List<Integer>> to store scores, read from properties, throw custom validation exceptions."]),
    ("Best Practices", "Wrap and log", ["Wrap underlying exceptions to attach business context before rethrow.", "Log once with full stack trace."]),
    ("Wrap-up", "Next steps", ["Push labs to Git with README reflections.", "Preview Day 4 material and follow on homework."])
]

for entry in extras:
    title, subtitle, content = entry[:3]
    code = entry[3] if len(entry) > 3 else None
    append_section(title, subtitle, content, code)

while len(slides) < 50:
    append_section("Bonus Insight", "Reflect & pair share", ["Discuss how you will apply todays lessons in your next sprint."])

def render_slide_html(slide, index):
    parts = [
        f"    <div class=\"slide{' active' if index == 0 else ''}\" id=\"slide{index + 1}\">",
        f"      <span class=\"tag\">Slide {index + 1}</span>",
        f"      <h2>{slide['title']}</h2>",
        "      <div class=\"accent-line\"></div>",
        f"      <h3>{slide['subtitle']}</h3>",
    ]
    for paragraph in slide['content']:
        parts.append(f"      <p>{paragraph}</p>")
    if slide.get('code'):
        parts.append("      <div class=\"code-panel\">")
        parts.append("        <button class=\"copy-btn\">Copy</button>")
        code_html = slide['code'].replace("<", "&lt;").replace(">", "&gt;")
        parts.append(f"        <pre>{code_html}</pre>")
        parts.append("      </div>")
    parts.append("    </div>")
    return "\n".join(parts)

html_parts = [
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
]

for idx, slide in enumerate(slides):
    html_parts.append(render_slide_html(slide, idx))

html_parts.extend([
    "  </div>",
    "  <div class=\"nav\">",
    "    <button id=\"prev\">← Previous</button>",
    "    <button id=\"next\">Next →</button>",
    "  </div>",
    "  <script>",
    "    const slides = document.querySelectorAll('.slide');",
    "    let index = 0;",
    "    const show = () => {",
    "      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));",
    "      document.getElementById('prev').disabled = index === 0;",
    "      document.getElementById('next').disabled = index === slides.length - 1;",
    "    };",
    "    document.getElementById('next').addEventListener('click', () => {",
    "      if (index < slides.length - 1) {",
    "        index++;",
    "        show();",
    "      }",
    "    });",
    "    document.getElementById('prev').addEventListener('click', () => {",
    "      if (index > 0) {",
    "        index--;",
    "        show();",
    "      }",
    "    });",
    "    document.addEventListener('keydown', (e) => {",
    "      if (e.key === 'ArrowRight') document.getElementById('next').click();",
    "      if (e.key === 'ArrowLeft') document.getElementById('prev').click();",
    "    });",
    "    document.querySelectorAll('.copy-btn').forEach((button) => {",
    "      button.addEventListener('click', () => {",
    "        const pre = button.parentElement.querySelector('pre');",
    "        if (!pre) return;",
    "        const range = document.createRange();",
    "        range.selectNodeContents(pre);",
    "        const sel = window.getSelection();",
    "        sel.removeAllRanges();",
    "        sel.addRange(range);",
    "        document.execCommand('copy');",
    "        sel.removeAllRanges();",
    "        button.textContent = 'Copied';",
    "        setTimeout(() => { button.textContent = 'Copy'; }, 1200);",
    "      });",
    "    });",
    "    show();",
    "  </script>",
    "</body>",
    "</html>"
])

open('docs/day3_slides_full.html', 'w', encoding='utf8').write('\\n'.join(html_parts))\n\"","workdir":"C:\\roboworkspace\\robodynamics","timeout_ms":1000}`
