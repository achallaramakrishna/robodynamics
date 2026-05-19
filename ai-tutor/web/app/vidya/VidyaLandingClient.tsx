"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, Play, Lock, CheckCircle, Zap, BookOpen, Users, Trophy, ArrowRight } from "lucide-react";

// ── Level definitions ─────────────────────────────────────────────────────────

const LEVELS = [
  {
    number: 1,
    slug: "level-1",
    emoji: "🐍",
    title: "Python Foundations",
    subtitle: "Level 1",
    tagline: "Write real code from day one — no fluff, no intimidation.",
    color: "#22c55e",
    bg: "from-green-950/80 to-green-900/40",
    border: "border-green-700/40",
    badgeBg: "bg-green-500/15 text-green-400 border border-green-500/30",
    ageTarget: "Age 10–14",
    gradeTarget: "Grade 5–8",
    studentTarget: "Absolute beginners, school students, curious adults starting fresh",
    prerequisites: "None — zero coding experience needed",
    description: "Build the bedrock every Python programmer needs: how data flows in and out, how variables store values, how logic branches, and how loops automate work. Every lesson ends with coding challenges, not just reading.",
    lessons: [
      { id: "PY_L1_01_SETUP", title: "Python I/O Streams",     meta: "print(), input(), f-strings",        preview: true  },
      { id: "PY_L1_02_VARS",  title: "Variables & Types",       meta: "int, float, str, bool, type()",     preview: true  },
      { id: "PY_L1_03_MATH",  title: "Math & Type Casting",     meta: "operators, int(), float(), //,%",   preview: false },
      { id: "PY_L1_04_LOGIC", title: "If / Elif / Else",        meta: "comparison, boolean, branching",    preview: false },
      { id: "PY_L1_05_WHILE", title: "While Loops",             meta: "sentinel, break, continue",        preview: false },
      { id: "PY_L1_06_FOR",   title: "For Loops & Range",       meta: "range(), enumerate, nested loops",  preview: false },
    ],
    concepts: ["Variables", "Data Types", "Arithmetic", "If/Else", "While", "For", "Range", "F-strings"],
    stats: { lessons: 6, programs: 90, tiers: 5 },
    outcome: "You can write Python programs that accept user input, make decisions, and automate repetitive tasks.",
  },
  {
    number: 2,
    slug: "level-2",
    emoji: "🧩",
    title: "Functions & Data Collections",
    subtitle: "Level 2",
    tagline: "Organise your code. Tame your data. Think like a developer.",
    color: "#34d399",
    bg: "from-emerald-950/80 to-emerald-900/40",
    border: "border-emerald-700/40",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    ageTarget: "Age 11–15",
    gradeTarget: "Grade 6–9",
    studentTarget: "Level 1 completers, students learning CS in school, self-taught coders building structure",
    prerequisites: "Level 1 complete — or comfortable with variables, loops, and if/else",
    description: "Move from syntax familiarity to engineering thinking. Write reusable functions, work with Python's most powerful data structures, and learn comprehensions that compress complex logic into single lines.",
    lessons: [
      { id: "PY_L2_01_FUNC",  title: "Functions",                         meta: "def, return, scope, args/kwargs",    preview: true  },
      { id: "PY_L2_02_LIST",  title: "Lists",                             meta: "indexing, slicing, sort, append",   preview: false },
      { id: "PY_L2_03_STR",   title: "Strings & String Methods",          meta: "split, join, replace, format",      preview: false },
      { id: "PY_L2_04_TUPLE", title: "Tuples & Sets",                     meta: "immutability, set ops, frozenset",  preview: false },
      { id: "PY_L2_05_DICT",  title: "Dictionaries",                      meta: "keys, values, get, defaultdict",    preview: false },
      { id: "PY_L2_06_COMP",  title: "Comprehensions & Generators",       meta: "list/dict/set comp, yield, lazy",   preview: false },
    ],
    concepts: ["Functions", "Scope", "Lists", "Strings", "Tuples", "Sets", "Dictionaries", "Comprehensions", "Generators"],
    stats: { lessons: 6, programs: 90, tiers: 5 },
    outcome: "You can write modular, organised Python programs that manipulate collections of data efficiently.",
  },
  {
    number: 3,
    slug: "level-3",
    emoji: "🏗️",
    title: "OOP & File I/O",
    subtitle: "Level 3",
    tagline: "Model the real world. Build programs that outlast a single run.",
    color: "#38bdf8",
    bg: "from-sky-950/80 to-sky-900/40",
    border: "border-sky-700/40",
    badgeBg: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    ageTarget: "Age 12–16",
    gradeTarget: "Grade 7–10",
    studentTarget: "Level 2 completers, students in CBSE CS/IT, anyone aiming for coding interviews",
    prerequisites: "Level 2 complete — or solid grasp of functions, lists, and dictionaries",
    description: "Learn to model real-world entities with classes, share behaviour through inheritance, persist data with files, and build resilience with exceptions. Add decorators and modules to write professional-grade Python.",
    lessons: [
      { id: "PY_L3_01_CLASS",   title: "Classes & Objects",       meta: "class, __init__, self, attributes",   preview: true  },
      { id: "PY_L3_02_INHERIT", title: "Inheritance",             meta: "super(), method override, MRO",       preview: false },
      { id: "PY_L3_03_FILE",    title: "File I/O",                meta: "open, read, write, with, pathlib",    preview: false },
      { id: "PY_L3_04_EXCEPT",  title: "Exceptions",              meta: "try/except, raise, custom exceptions",preview: false },
      { id: "PY_L3_05_MOD",     title: "Modules & Packages",      meta: "import, __init__, pip, namespaces",   preview: false },
      { id: "PY_L3_06_DECO",    title: "Decorators & Closures",   meta: "functools, @property, closures",      preview: false },
    ],
    concepts: ["Classes", "OOP", "Inheritance", "File I/O", "Exceptions", "Modules", "Decorators", "Closures"],
    stats: { lessons: 6, programs: 90, tiers: 5 },
    outcome: "You can design class hierarchies, handle errors gracefully, and write Python that reads and writes persistent data.",
  },
  {
    number: 4,
    slug: "level-4",
    emoji: "🌲",
    title: "Data Structures",
    subtitle: "Level 4",
    tagline: "Think in structures. Solve what naïve code cannot.",
    color: "#a78bfa",
    bg: "from-violet-950/80 to-violet-900/40",
    border: "border-violet-700/40",
    badgeBg: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
    ageTarget: "Age 14–18",
    gradeTarget: "Grade 9–12 / First-year college",
    studentTarget: "Level 3 completers, college CS students, developers preparing for technical interviews",
    prerequisites: "Level 3 complete — or confident with OOP and Python built-in types",
    description: "Go beyond built-in lists and dicts. Implement stacks, queues, linked lists, trees, graphs, and heaps from scratch. Understand why each structure exists, when to reach for it, and the trade-offs that define system design.",
    lessons: [
      { id: "PY_L4_01_STACK",  title: "Stacks & Queues",          meta: "LIFO/FIFO, deque, monotonic stack",   preview: true  },
      { id: "PY_L4_02_LINKED", title: "Linked Lists",             meta: "singly/doubly, reversal, fast/slow",  preview: false },
      { id: "PY_L4_03_TREE",   title: "Trees & BST",              meta: "DFS, BFS, traversal, balance",        preview: false },
      { id: "PY_L4_04_GRAPH",  title: "Graphs",                   meta: "adjacency, BFS, DFS, topological",    preview: false },
      { id: "PY_L4_05_HASH",   title: "Hash Maps",                meta: "collision, chaining, open address",   preview: false },
      { id: "PY_L4_06_HEAP",   title: "Heaps & Priority Queues",  meta: "heapq, min/max, k-th largest",        preview: false },
    ],
    concepts: ["Stack", "Queue", "Linked List", "Binary Tree", "BST", "Graph", "Hash Map", "Heap", "BFS", "DFS"],
    stats: { lessons: 6, programs: 90, tiers: 5 },
    outcome: "You can identify the right data structure for a problem and implement it efficiently in Python.",
  },
  {
    number: 5,
    slug: "level-5",
    emoji: "⚡",
    title: "Algorithms",
    subtitle: "Level 5",
    tagline: "Competitive edge. Interview-ready. Algorithm fluency.",
    color: "#fb923c",
    bg: "from-orange-950/80 to-orange-900/40",
    border: "border-orange-700/40",
    badgeBg: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    ageTarget: "Age 16+",
    gradeTarget: "Grade 11+ / College / Working developers",
    studentTarget: "Level 4 completers, competitive programmers, developers cracking FAANG interviews",
    prerequisites: "Level 4 complete — or strong grasp of all common data structures",
    description: "This is where programming becomes computer science. Master sorting, binary search, recursion, dynamic programming, greedy strategies, and classic graph algorithms. Every chapter includes LeetCode-style and hackathon-tier problems.",
    lessons: [
      { id: "PY_L5_01_SORT",      title: "Sorting Algorithms",        meta: "merge, quick, heap, counting, radix",  preview: true  },
      { id: "PY_L5_02_SEARCH",    title: "Searching",                 meta: "binary search, rotated, bisect",       preview: false },
      { id: "PY_L5_03_RECUR",     title: "Recursion & Backtracking",  meta: "base case, memoisation, n-queens",     preview: false },
      { id: "PY_L5_04_DP",        title: "Dynamic Programming",       meta: "tabulation, Fibonacci, knapsack, LCS", preview: false },
      { id: "PY_L5_05_GREEDY",    title: "Greedy Algorithms",         meta: "interval scheduling, Huffman, MST",    preview: false },
      { id: "PY_L5_06_GRAPHALGO", title: "Graph Algorithms",          meta: "Dijkstra, Bellman-Ford, Floyd-W",      preview: false },
    ],
    concepts: ["Merge Sort", "Binary Search", "Recursion", "Backtracking", "DP", "Greedy", "Dijkstra", "Bellman-Ford"],
    stats: { lessons: 6, programs: 90, tiers: 5 },
    outcome: "You can solve hard algorithmic problems efficiently — enough to pass competitive programming rounds and technical interviews.",
  },
];

// ── Tier info ─────────────────────────────────────────────────────────────────

const TIERS = [
  { emoji: "🟢", label: "Beginner",     desc: "Guided warmup — every concept introduced gently"  },
  { emoji: "🔵", label: "Intermediate", desc: "Builds on the basics with more complex logic"       },
  { emoji: "🟡", label: "Advanced",     desc: "Multi-concept problems requiring real design skill" },
  { emoji: "🔴", label: "LeetCode",     desc: "Interview-style challenges with optimal solutions"  },
  { emoji: "🏆", label: "Hackathon",    desc: "Open-ended mini projects with extension challenges" },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Do I need any prior coding experience?",
    a: "No. Level 1 is designed for absolute beginners. If you can use a computer, you can start today.",
  },
  {
    q: "How long does each level take?",
    a: "Each level has 6 lessons and 90 coding programs. At 30–45 min/day, expect 4–8 weeks per level depending on pace.",
  },
  {
    q: "Are the lessons videos or interactive coding?",
    a: "Vidya is active learning — you read guided lessons, then write and run real Python code in the browser. No passive video watching.",
  },
  {
    q: "Can I jump directly to Level 3 or 4?",
    a: "Yes, if you already know the prerequisites. Each level card lists exactly what prior knowledge is expected.",
  },
  {
    q: "What age group is Vidya for?",
    a: "Levels 1–2 are designed for ages 10–15. Levels 3–4 suit teens and early college. Level 5 is for serious learners of any age targeting competitive programming or interviews.",
  },
  {
    q: "Is there a free preview before buying?",
    a: "Yes. The first 1–2 lessons of every level are free to try — no account needed for previews.",
  },
  {
    q: "What makes this different from YouTube tutorials?",
    a: "Every concept ends with 15 tiered coding challenges — from guided beginner to LeetCode-hard. You cannot just watch — you have to write code and pass tests.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function VidyaLandingClient() {
  const [openLevel, setOpenLevel] = useState<number | null>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const totalPrograms = LEVELS.reduce((s, l) => s + l.stats.programs, 0);
  const allPreviews = LEVELS.flatMap((l) => l.lessons.filter((ls) => ls.preview).slice(0, 1));

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-100 font-sans">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 60% 0%, rgba(34,197,94,0.10) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(99,102,241,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐍</span>
              <span className="text-sm font-semibold tracking-widest text-green-400 uppercase">Vidya · Python Coding Track</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              From{" "}
              <span className="text-green-400">hello world</span>
              {" "}to{" "}
              <span className="text-violet-400">LeetCode-hard.</span>
              <br />Every step guided.
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
              450+ hands-on coding challenges across 5 progressive levels — built for learners who want
              real Python fluency, not passive watching.
            </p>
            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-2">
              {[
                { value: "5", label: "Levels" },
                { value: "30", label: "Guided Lessons" },
                { value: `${totalPrograms}+`, label: "Coding Challenges" },
                { value: "5", label: "Difficulty Tiers" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-2xl font-black text-green-400">{s.value}</span>
                  <span className="text-xs text-slate-400 font-medium">{s.label}</span>
                </div>
              ))}
            </div>
            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                href="/vidya/lesson/PY_L1_01_SETUP"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm transition-colors shadow-lg shadow-green-500/20"
              >
                <Play className="w-4 h-4" />
                Start Free Preview
              </Link>
              <a
                href="#levels"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-semibold text-sm transition-colors"
              >
                Explore Levels
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          {/* Right image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-green-900/30 max-w-md w-full">
              <Image
                src="/tutors/vidya-python-hero.png"
                alt="Vidya Python coding platform"
                width={640}
                height={480}
                className="w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14]/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 flex-wrap">
                {["Python", "Algorithms", "OOP", "Data Structures"].map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md bg-black/60 text-green-400 text-xs font-semibold border border-green-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Progression Path ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest text-green-400 uppercase mb-2">YOUR PYTHON JOURNEY</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Five levels. One coherent path.</h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm">
              Each level builds on the last. Every concept is a prerequisite for the next. Progress is visible at every step.
            </p>
          </div>
          {/* Horizontal progression */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-0 overflow-x-auto pb-2">
            {LEVELS.map((level, i) => (
              <div key={level.slug} className="flex sm:flex-col items-center sm:items-stretch flex-1 min-w-[120px]">
                {/* Node */}
                <a
                  href={`#level-${level.number}`}
                  className="flex-1 sm:flex-none group flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 p-3 sm:p-4 rounded-xl border border-transparent hover:border-slate-700 hover:bg-slate-900/50 transition-all text-left sm:text-center"
                  style={{ borderColor: `${level.color}22` }}
                >
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-lg"
                    style={{ background: `${level.color}20`, border: `1.5px solid ${level.color}44` }}
                  >
                    {level.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: level.color }}>{level.subtitle}</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{level.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{level.ageTarget}</div>
                  </div>
                </a>
                {/* Connector */}
                {i < LEVELS.length - 1 && (
                  <div className="flex sm:hidden items-center justify-center px-1">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                )}
                {i < LEVELS.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center h-6">
                    <ArrowRight className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tier explanation ─────────────────────────────────────────────── */}
      <section className="py-12 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">HOW CHALLENGES ARE STRUCTURED</div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Every chapter has 15 programs across 5 tiers</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {TIERS.map((tier) => (
              <div key={tier.label} className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <div className="text-2xl">{tier.emoji}</div>
                <div className="text-sm font-bold text-white">{tier.label}</div>
                <div className="text-xs text-slate-400 leading-snug">{tier.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            The adaptive engine tracks your performance and routes you to the right tier automatically.
          </p>
        </div>
      </section>

      {/* ── Level Deep-Dives ─────────────────────────────────────────────── */}
      <section id="levels" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest text-green-400 uppercase mb-2">FULL CURRICULUM</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Every level, every lesson — visible before you buy</h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm">
              Click each level to see the full lesson list, prerequisites, and what you'll be able to build when you finish.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {LEVELS.map((level) => {
              const isOpen = openLevel === level.number;
              const previewLesson = level.lessons.find((l) => l.preview);
              return (
                <div
                  key={level.slug}
                  id={`level-${level.number}`}
                  className={`rounded-2xl border overflow-hidden transition-all ${level.border} bg-slate-900/60`}
                  style={{ borderColor: isOpen ? `${level.color}50` : undefined }}
                >
                  {/* Header (always visible) */}
                  <button
                    onClick={() => setOpenLevel(isOpen ? null : level.number)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Level badge */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                      style={{ background: `${level.color}18`, border: `1.5px solid ${level.color}40` }}
                    >
                      {level.emoji}
                    </div>
                    {/* Title block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: level.color }}>{level.subtitle}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${level.badgeBg}`}>{level.ageTarget} · {level.gradeTarget}</span>
                        {previewLesson && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                            Free Preview
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">{level.title}</h3>
                      <p className="text-slate-400 text-sm mt-0.5">{level.tagline}</p>
                    </div>
                    {/* Right meta */}
                    <div className="hidden md:flex flex-col items-end gap-1 text-xs text-slate-500 flex-shrink-0">
                      <span className="font-semibold text-slate-300">{level.stats.lessons} lessons</span>
                      <span>{level.stats.programs} programs</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="border-t px-5 pb-6 pt-5 flex flex-col gap-6" style={{ borderColor: `${level.color}20` }}>
                      {/* Three-column info row */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <Users className="w-3.5 h-3.5" /> Who This Is For
                          </div>
                          <p className="text-sm text-slate-200 leading-snug">{level.studentTarget}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Prerequisites
                          </div>
                          <p className="text-sm text-slate-200 leading-snug">{level.prerequisites}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <Trophy className="w-3.5 h-3.5" /> When You're Done
                          </div>
                          <p className="text-sm text-slate-200 leading-snug">{level.outcome}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 text-sm leading-relaxed">{level.description}</p>

                      {/* Lessons list */}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> 6 Guided Lessons + 15 Programs Each
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {level.lessons.map((lesson, li) => (
                            <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 group">
                              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: `${level.color}18`, color: level.color }}>
                                {li + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{lesson.title}</div>
                                <div className="text-xs text-slate-500 truncate">{lesson.meta}</div>
                              </div>
                              {lesson.preview ? (
                                <Link
                                  href={`/vidya/lesson/${lesson.id}`}
                                  className="flex-shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 transition-colors font-semibold"
                                >
                                  <Play className="w-3 h-3" /> Preview
                                </Link>
                              ) : (
                                <span className="flex-shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-500 border border-slate-700">
                                  <Lock className="w-3 h-3" /> Unlock
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Concept chips */}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Topics Covered</div>
                        <div className="flex flex-wrap gap-2">
                          {level.concepts.map((c) => (
                            <span key={c} className="px-2.5 py-1 rounded-lg text-xs font-medium border"
                                  style={{ background: `${level.color}10`, color: level.color, borderColor: `${level.color}30` }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA row */}
                      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800">
                        {previewLesson && (
                          <Link
                            href={`/vidya/lesson/${previewLesson.id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-colors shadow-md"
                            style={{ background: level.color }}
                          >
                            <Play className="w-4 h-4" />
                            Try Free Preview
                          </Link>
                        )}
                        <Link
                          href={`/vidya/${level.slug}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-semibold text-sm transition-colors"
                        >
                          View Full Level
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Free Preview Callout ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-950/30 via-slate-900/50 to-violet-950/30 border-y border-slate-800/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-widest text-green-400 uppercase mb-2">FREE PREVIEW LESSONS</div>
            <h2 className="text-2xl font-bold text-white">Try before you commit — no login needed</h2>
            <p className="text-slate-400 mt-2 text-sm max-w-lg mx-auto">
              The first lesson of every level is free. Feel the teaching style, run real code, and decide with confidence.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {LEVELS.map((level) => {
              const pl = level.lessons.find((l) => l.preview);
              if (!pl) return null;
              return (
                <Link
                  key={level.slug}
                  href={`/vidya/lesson/${pl.id}`}
                  className="group flex flex-col gap-3 p-4 rounded-xl border bg-slate-900/70 hover:bg-slate-800/70 transition-all"
                  style={{ borderColor: `${level.color}30` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{level.emoji}</span>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: level.color }}>{level.subtitle}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-snug">{pl.title}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-snug">{pl.meta}</div>
                  </div>
                  <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold" style={{ color: level.color }}>
                    <Play className="w-3 h-3" />
                    Open Preview
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
          {/* Also show L1 second preview */}
          <div className="mt-3">
            <Link
              href="/vidya/lesson/PY_L1_02_VARS"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-sm transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-green-400" />
              Level 1 Bonus Preview: Variables &amp; Types
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Vidya ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">WHY VIDYA WORKS</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Built for real skill-building, not just watching</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "⌨️", title: "You write real code",         body: "Every lesson ends with actual coding challenges. You must pass tests, not just read explanations." },
              { icon: "🧠", title: "Adaptive difficulty",         body: "The engine tracks performance and routes you to the right challenge level — never too easy, never too discouraging." },
              { icon: "🏆", title: "Hackathon-tier problems",     body: "Every chapter has open-ended design challenges that go beyond textbook exercises into real engineering." },
              { icon: "🔒", title: "Concepts locked in sequence", body: "Prerequisites are enforced. You can't skip foundations, ensuring no gaps in understanding." },
              { icon: "📊", title: "Visible progress",           body: "See your completion rate, XP earned, and tier progression per chapter — stay motivated." },
              { icon: "🌐", title: "Runs in the browser",        body: "No Python install needed. Pyodide powers a full Python environment right in your browser." },
            ].map((card) => (
              <div key={card.title} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
                <div className="text-3xl">{card.icon}</div>
                <div className="text-base font-bold text-white">{card.title}</div>
                <p className="text-sm text-slate-400 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image band ───────────────────────────────────────────────────── */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
            <Image src="/tutors/coding-kids-card.png" alt="Young coders learning Python" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="text-white font-bold text-base">Levels 1–2</div>
              <div className="text-green-400 text-xs font-semibold">For school students · Ages 10–15</div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
            <Image src="/tutors/coding-professionals-card.png" alt="Professional coders mastering algorithms" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="text-white font-bold text-base">Levels 3–5</div>
              <div className="text-violet-400 text-xs font-semibold">For serious learners · Interview prep · Competitive coding</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">FAQ</div>
            <h2 className="text-2xl font-bold text-white">Questions before you start?</h2>
          </div>
          <div className="flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="text-4xl">🐍</div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Your first Python lesson is{" "}
            <span className="text-green-400">free right now.</span>
          </h2>
          <p className="text-slate-400 text-base max-w-lg">
            No account needed. Write real Python in the browser and see exactly how Vidya teaches — before you decide anything.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/vidya/lesson/PY_L1_01_SETUP"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black text-base transition-colors shadow-lg shadow-green-500/25"
            >
              <Play className="w-5 h-5" />
              Start Free Preview — Level 1
            </Link>
            <a
              href="/pricing/vidya"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-semibold text-base transition-colors"
            >
              <Zap className="w-4 h-4 text-violet-400" />
              Unlock Full Course
            </a>
          </div>
          <p className="text-xs text-slate-600">
            5 levels · 30 lessons · 450+ programs · Browser-based Python · No install
          </p>
        </div>
      </section>

    </div>
  );
}
