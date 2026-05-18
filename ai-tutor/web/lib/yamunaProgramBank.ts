/**
 * Yamuna Program Bank — barrel export
 *
 * Java Foundation Track: 5 levels × 6 chapters × 15 programs = 450 programs total.
 * Tier progression per chapter: beginner → intermediate → advanced → leetcode → hackathon
 *
 * Level 1 — Foundations      : JCH01–JCH06  (Hello, Vars, Math, Logic, Loops, Arrays)
 * Level 2 — OOP              : JCH07–JCH12  (Classes, Constructors, Encapsulation, Inheritance, Polymorphism, Abstract)
 * Level 3 — Core Libraries   : JCH13–JCH18  (Strings, ArrayList, HashMap, Exceptions, File I/O, Lambdas)
 * Level 4 — Advanced Java    : JCH19–JCH24  (Generics, Streams, Threads, Patterns, JDBC, JUnit)
 * Level 5 — DSA in Java      : JCH25–JCH30  (Sorting, Searching, Recursion, DP, Graphs, Advanced DS)
 */

import type { YamunaProgram, ProgramTier } from "./yamunaProgramTypes";
import { CH01_PROGRAMS } from "./yamunaProgramBank_ch01";
import { CH02_PROGRAMS } from "./yamunaProgramBank_ch02";
import { CH03_PROGRAMS } from "./yamunaProgramBank_ch03";
import { CH04_PROGRAMS } from "./yamunaProgramBank_ch04";
import { CH05_PROGRAMS } from "./yamunaProgramBank_ch05";
import { CH06_PROGRAMS } from "./yamunaProgramBank_ch06";

export { CH01_PROGRAMS } from "./yamunaProgramBank_ch01";
export { CH02_PROGRAMS } from "./yamunaProgramBank_ch02";
export { CH03_PROGRAMS } from "./yamunaProgramBank_ch03";
export { CH04_PROGRAMS } from "./yamunaProgramBank_ch04";
export { CH05_PROGRAMS } from "./yamunaProgramBank_ch05";
export { CH06_PROGRAMS } from "./yamunaProgramBank_ch06";

/** All programs in chapter + tier order */
export const YAMUNA_PROGRAM_BANK: YamunaProgram[] = [
  ...CH01_PROGRAMS,
  ...CH02_PROGRAMS,
  ...CH03_PROGRAMS,
  ...CH04_PROGRAMS,
  ...CH05_PROGRAMS,
  ...CH06_PROGRAMS,
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

const _programById = new Map<string, YamunaProgram>(
  YAMUNA_PROGRAM_BANK.map((p) => [p.id, p])
);

export function getProgramById(id: string): YamunaProgram | undefined {
  return _programById.get(id);
}

export function getProgramsByChapter(chapterId: string): YamunaProgram[] {
  return YAMUNA_PROGRAM_BANK.filter((p) => p.chapterId === chapterId);
}

export function getProgramsByTier(tier: ProgramTier): YamunaProgram[] {
  return YAMUNA_PROGRAM_BANK.filter((p) => p.tier === tier);
}

export function getNextProgram(
  chapterId: string,
  tier: ProgramTier,
  tierIndex: number,
  decision: "next_program" | "next_tier" | "show_reference"
): YamunaProgram | null {
  const TIER_ORDER: ProgramTier[] = ["beginner","intermediate","advanced","leetcode","hackathon"];
  const chapterPrograms = getProgramsByChapter(chapterId);

  if (decision === "show_reference") {
    return chapterPrograms.find((p) => p.tier === tier && p.tierIndex === tierIndex) ?? null;
  }

  if (decision === "next_program") {
    const next = chapterPrograms.find((p) => p.tier === tier && p.tierIndex === tierIndex + 1);
    if (next) return next;
  }

  const currentTierIdx = TIER_ORDER.indexOf(tier);
  if (currentTierIdx === -1 || currentTierIdx >= TIER_ORDER.length - 1) return null;
  const nextTier = TIER_ORDER[currentTierIdx + 1];
  return chapterPrograms.find((p) => p.tier === nextTier && p.tierIndex === 0) ?? null;
}

// ── Track & Level metadata ────────────────────────────────────────────────────

export interface YamunaTrack {
  id: string;
  title: string;
  tagline: string;
  levels: YamunaLevelMeta[];
}

export interface YamunaLevelMeta {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  chapterIds: string[];
  status: "available" | "coming_soon";
}

export const JAVA_FOUNDATION_TRACK: YamunaTrack = {
  id: "java_foundation",
  title: "Yamuna Java Foundation Track",
  tagline: "From Hello World to algorithmic mastery — 5 levels, 30 chapters, 450 programs",
  levels: [
    {
      id: "L1", slug: "level-1",
      title: "Level 1 — Foundations",
      subtitle: "Output, Variables, Math, Conditionals, Loops, Arrays",
      chapterIds: ["JCH01_HELLO","JCH02_VARS","JCH03_MATH","JCH04_LOGIC","JCH05_LOOPS","JCH06_ARRAYS"],
      status: "available",
    },
    {
      id: "L2", slug: "level-2",
      title: "Level 2 — Object-Oriented Programming",
      subtitle: "Classes, Constructors, Encapsulation, Inheritance, Polymorphism, Abstract",
      chapterIds: ["JCH07_CLASS","JCH08_CONSTRUCT","JCH09_ENCAP","JCH10_INHERIT","JCH11_POLY","JCH12_ABSTRACT"],
      status: "coming_soon",
    },
    {
      id: "L3", slug: "level-3",
      title: "Level 3 — Core Libraries",
      subtitle: "Strings, ArrayList, HashMap, Exceptions, File I/O, Lambdas",
      chapterIds: ["JCH13_STRINGS","JCH14_LIST","JCH15_MAP","JCH16_EXCEPT","JCH17_FILE","JCH18_LAMBDA"],
      status: "coming_soon",
    },
    {
      id: "L4", slug: "level-4",
      title: "Level 4 — Advanced Java",
      subtitle: "Generics, Streams, Threads, Design Patterns, JDBC, JUnit",
      chapterIds: ["JCH19_GENERIC","JCH20_STREAMS","JCH21_THREAD","JCH22_PATTERN","JCH23_JDBC","JCH24_JUNIT"],
      status: "coming_soon",
    },
    {
      id: "L5", slug: "level-5",
      title: "Level 5 — DSA in Java",
      subtitle: "Sorting, Searching, Recursion, DP, Graphs, Advanced DS",
      chapterIds: ["JCH25_SORT","JCH26_SEARCH","JCH27_RECUR","JCH28_DP","JCH29_GRAPH","JCH30_ADVDS"],
      status: "coming_soon",
    },
  ],
};

// ── Chapter metadata ──────────────────────────────────────────────────────────

export const CHAPTER_META: {
  id: string; number: number; title: string; emoji: string; programCount: number; level: string;
}[] = [
  // Level 1 — Foundations
  { id: "JCH01_HELLO",    number:  1, title: "Hello World & Output",     emoji: "👋", programCount: 15, level: "L1" },
  { id: "JCH02_VARS",     number:  2, title: "Variables & Data Types",   emoji: "🧮", programCount: 15, level: "L1" },
  { id: "JCH03_MATH",     number:  3, title: "Operators & Math",         emoji: "➗", programCount: 15, level: "L1" },
  { id: "JCH04_LOGIC",    number:  4, title: "Conditionals",             emoji: "🔀", programCount: 15, level: "L1" },
  { id: "JCH05_LOOPS",    number:  5, title: "Loops",                    emoji: "🔄", programCount: 15, level: "L1" },
  { id: "JCH06_ARRAYS",   number:  6, title: "Arrays & Strings",         emoji: "📦", programCount: 15, level: "L1" },
  // Level 2 — OOP
  { id: "JCH07_CLASS",    number:  7, title: "Classes & Objects",        emoji: "🏗️", programCount: 15, level: "L2" },
  { id: "JCH08_CONSTRUCT",number:  8, title: "Constructors & Overloading",emoji: "🔨", programCount: 15, level: "L2" },
  { id: "JCH09_ENCAP",    number:  9, title: "Encapsulation",            emoji: "🔒", programCount: 15, level: "L2" },
  { id: "JCH10_INHERIT",  number: 10, title: "Inheritance",              emoji: "🧬", programCount: 15, level: "L2" },
  { id: "JCH11_POLY",     number: 11, title: "Polymorphism & Interfaces",emoji: "🎭", programCount: 15, level: "L2" },
  { id: "JCH12_ABSTRACT", number: 12, title: "Abstract Classes & Enums", emoji: "📐", programCount: 15, level: "L2" },
  // Level 3 — Core Libraries
  { id: "JCH13_STRINGS",  number: 13, title: "Strings & StringBuilder",  emoji: "🔤", programCount: 15, level: "L3" },
  { id: "JCH14_LIST",     number: 14, title: "ArrayList & LinkedList",   emoji: "📋", programCount: 15, level: "L3" },
  { id: "JCH15_MAP",      number: 15, title: "HashMap & HashSet",        emoji: "🗺️", programCount: 15, level: "L3" },
  { id: "JCH16_EXCEPT",   number: 16, title: "Exceptions",               emoji: "⚠️", programCount: 15, level: "L3" },
  { id: "JCH17_FILE",     number: 17, title: "File I/O",                 emoji: "📁", programCount: 15, level: "L3" },
  { id: "JCH18_LAMBDA",   number: 18, title: "Lambdas & Streams",        emoji: "⚡", programCount: 15, level: "L3" },
  // Level 4 — Advanced Java
  { id: "JCH19_GENERIC",  number: 19, title: "Generics",                 emoji: "🔧", programCount: 15, level: "L4" },
  { id: "JCH20_STREAMS",  number: 20, title: "Java Streams API",         emoji: "🌊", programCount: 15, level: "L4" },
  { id: "JCH21_THREAD",   number: 21, title: "Multithreading",           emoji: "⚙️", programCount: 15, level: "L4" },
  { id: "JCH22_PATTERN",  number: 22, title: "Design Patterns",          emoji: "🎨", programCount: 15, level: "L4" },
  { id: "JCH23_JDBC",     number: 23, title: "JDBC",                     emoji: "🗄️", programCount: 15, level: "L4" },
  { id: "JCH24_JUNIT",    number: 24, title: "JUnit & Testing",          emoji: "🧪", programCount: 15, level: "L4" },
  // Level 5 — DSA in Java
  { id: "JCH25_SORT",     number: 25, title: "Sorting Algorithms",       emoji: "🔢", programCount: 15, level: "L5" },
  { id: "JCH26_SEARCH",   number: 26, title: "Searching",                emoji: "🔍", programCount: 15, level: "L5" },
  { id: "JCH27_RECUR",    number: 27, title: "Recursion & Backtracking", emoji: "🔙", programCount: 15, level: "L5" },
  { id: "JCH28_DP",       number: 28, title: "Dynamic Programming",      emoji: "🧩", programCount: 15, level: "L5" },
  { id: "JCH29_GRAPH",    number: 29, title: "Graphs",                   emoji: "🕸️", programCount: 15, level: "L5" },
  { id: "JCH30_ADVDS",    number: 30, title: "Advanced Data Structures", emoji: "🌲", programCount: 15, level: "L5" },
];
