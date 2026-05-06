export type PythonLevel = "Beginner" | "Intermediate" | "Advanced";

export interface PythonChapter {
  id: string;
  title: string;
  level: PythonLevel;
  description: string;
  topics: string[];
  durationMinutes: number;
}

export interface PythonCurriculumTier {
  id: string;
  level: PythonLevel;
  name: string;
  targetAudience: string;
  tagline: string;
  color: string;
  projectFocus: string;
  chapters: PythonChapter[];
}

export const PYTHON_AI_CATALOG: PythonCurriculumTier[] = [
  {
    id: "PY_BEG",
    level: "Beginner",
    name: "CodeSutra Foundations",
    targetAudience: "Ages 10-14, No prior coding experience",
    tagline: "Learn to command the computer with code.",
    color: "#3B82F6", // Blue
    projectFocus: "Build text-based adventure games and math calculators.",
    chapters: [
      {
        id: "PY_L1_01_SETUP",
        title: "Setup, First Program, and Input",
        level: "Beginner",
        description: "Install tools, run Python, and write your first program.",
        topics: ["Install Python", "Open the editor", "print()", "input()"],
        durationMinutes: 45
      },
      {
        id: "PY_L1_02_DATA",
        title: "Variables, Types, Operators, and Decisions",
        level: "Beginner",
        description: "Store information and use Python to choose the right path.",
        topics: ["Variables", "int", "float", "str", "bool", "if/elif/else"],
        durationMinutes: 50
      },
      {
        id: "PY_L1_03_CONTROL",
        title: "Functions, Lists, Tuples, and Loops",
        level: "Beginner",
        description: "Break problems apart and iterate across ordered data.",
        topics: ["Functions", "Lists", "Tuples", "for loops", "while loops"],
        durationMinutes: 60
      },
      {
        id: "PY_L1_04_DICTS_STRINGS",
        title: "Dictionaries, Sets, and Strings",
        level: "Beginner",
        description: "Use lookup structures and clean text for real coding tasks.",
        topics: ["Dictionaries", "Sets", "Strings", "Lookup problems"],
        durationMinutes: 60
      },
      {
        id: "PY_L1_05_FILES_EXCEPTIONS",
        title: "File I/O and Exception Handling",
        level: "Beginner",
        description: "Read, write, and protect programs from predictable failures.",
        topics: ["File I/O", "CSV", "try", "except", "finally"],
        durationMinutes: 70
      },
      {
        id: "PY_L1_06_MODULES_OOP_REVIEW",
        title: "Modules, OOP, and Level 1 Review",
        level: "Beginner",
        description: "Import modules, create classes, and finish with projects.",
        topics: ["Modules", "Classes", "Objects", "Review", "Mini projects"],
        durationMinutes: 55
      }
    ]
  },
  {
    id: "PY_INT",
    level: "Intermediate",
    name: "CodeSutra Builder",
    targetAudience: "Ages 13-16, Knows basic Python syntax",
    tagline: "Give your code the power to think.",
    color: "#F59E0B", // Python Yellow
    projectFocus: "Program a chatbot and analyze real datasets.",
    chapters: [
      {
        id: "PY_L2_01_OOP",
        title: "Advanced OOP",
        level: "Intermediate",
        description: "Use properties, magic methods, and cleaner class design.",
        topics: ["__str__", "__len__", "properties", "@classmethod", "@staticmethod"],
        durationMinutes: 70
      },
      {
        id: "PY_L2_02_GENERATORS",
        title: "Iterators, Generators & Decorators",
        level: "Intermediate",
        description: "Build reusable language features for elegant code.",
        topics: ["iterators", "yield", "generator expressions", "decorators"],
        durationMinutes: 75
      },
      {
        id: "PY_L2_03_FUNCTIONAL",
        title: "Functional Programming Tools",
        level: "Intermediate",
        description: "Apply lambda, map, filter, reduce, and functools.",
        topics: ["lambda", "map", "filter", "reduce", "functools"],
        durationMinutes: 55
      },
      {
        id: "PY_L2_04_REGEX",
        title: "Regular Expressions",
        level: "Intermediate",
        description: "Match patterns, validate input, and extract text.",
        topics: ["re module", "match", "search", "findall", "groups"],
        durationMinutes: 50
      },
      {
        id: "PY_L2_05_DATA",
        title: "Working with APIs and JSON",
        level: "Intermediate",
        description: "Pull data from services and transform it into useful objects.",
        topics: ["requests", "JSON", "REST APIs", "status codes"],
        durationMinutes: 60
      },
      {
        id: "PY_L2_06_ENV",
        title: "Virtual Environments and Packaging",
        level: "Intermediate",
        description: "Keep projects isolated and dependency-safe.",
        topics: ["venv", "pip", "requirements.txt", "project setup"],
        durationMinutes: 45
      },
      {
        id: "PY_L2_07_TESTING",
        title: "Testing and Debugging",
        level: "Intermediate",
        description: "Write tests, inspect failures, and debug with confidence.",
        topics: ["unittest", "pytest", "pdb", "VS Code debugger"],
        durationMinutes: 60
      },
      {
        id: "PY_L2_08_NUMPY",
        title: "NumPy and Pandas",
        level: "Intermediate",
        description: "Analyze arrays and dataframes with professional tooling.",
        topics: ["arrays", "vectorization", "DataFrames", "groupby", "merge"],
        durationMinutes: 75
      },
      {
        id: "PY_L2_09_SQL",
        title: "SQL Basics with Python",
        level: "Intermediate",
        description: "Store and query data using sqlite3 or PostgreSQL.",
        topics: ["sqlite3", "queries", "joins", "CRUD"],
        durationMinutes: 60
      },
      {
        id: "PY_L2_10_FLASK",
        title: "Web Development Foundations",
        level: "Intermediate",
        description: "Build simple web apps with Flask, routes, and templates.",
        topics: ["HTML", "CSS", "JS basics", "Flask", "Jinja2"],
        durationMinutes: 75
      },
      {
        id: "PY_L2_11_GIT",
        title: "Git and GitHub",
        level: "Intermediate",
        description: "Collaborate with branches, commits, and pull requests.",
        topics: ["git status", "branches", "pull requests", "merge conflicts"],
        durationMinutes: 45
      }
    ]
  },
  {
    id: "PY_ADV",
    level: "Advanced",
    name: "CodeSutra Architect",
    targetAudience: "Ages 15+, Comfortable with complex logic",
    tagline: "Engineer the future of Artificial Intelligence.",
    color: "#10B981", // Emerald
    projectFocus: "Build a Computer Vision scanner and interact with LLMs.",
    chapters: [
      {
        id: "PY_L3_01_CONCURRENCY",
        title: "Concurrency and Parallelism",
        level: "Advanced",
        description: "Use threads, processes, and async tasks for scalable code.",
        topics: ["threading", "multiprocessing", "asyncio", "aiohttp"],
        durationMinutes: 80
      },
      {
        id: "PY_L3_02_PERFORMANCE",
        title: "Performance Optimization",
        level: "Advanced",
        description: "Profile code and reduce memory and runtime bottlenecks.",
        topics: ["cProfile", "line_profiler", "memory", "Cython", "Numba"],
        durationMinutes: 75
      },
      {
        id: "PY_L3_03_PATTERNS",
        title: "Design Patterns and Clean Code",
        level: "Advanced",
        description: "Apply reusable patterns and write maintainable code.",
        topics: ["Singleton", "Factory", "Observer", "Repository", "SOLID"],
        durationMinutes: 70
      },
      {
        id: "PY_L3_04_META",
        title: "Metaprogramming",
        level: "Advanced",
        description: "Control class behavior with decorators, descriptors, and metaclasses.",
        topics: ["decorators", "descriptors", "metaclasses"],
        durationMinutes: 75
      },
      {
        id: "PY_L3_05_SECURITY",
        title: "Security Best Practices",
        level: "Advanced",
        description: "Protect apps with safer input handling and secrets management.",
        topics: ["OWASP", "sanitization", "secrets", "auth basics"],
        durationMinutes: 60
      },
      {
        id: "PY_L3_06_DEVOPS",
        title: "Deployment and DevOps",
        level: "Advanced",
        description: "Ship Python apps with Docker, CI/CD, and cloud basics.",
        topics: ["Docker", "Docker Compose", "GitHub Actions", "AWS basics"],
        durationMinutes: 75
      },
      {
        id: "PY_L3_07_OBSERVABILITY",
        title: "Logging, Monitoring and Error Tracking",
        level: "Advanced",
        description: "Watch production systems and diagnose issues quickly.",
        topics: ["logging", "Sentry", "alerts", "metrics"],
        durationMinutes: 55
      }
    ]
  }
];
