"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { RobotAvatar, type AvatarExpression, type AvatarVariant } from "./RobotAvatar";
import { usePathname, useSearchParams } from "next/navigation";
import type {
  TutorAssetItem,
  TutorCatalogResponse,
  TutorChapter,
  TutorCheckResponse,
  TutorDuolingoLessonArc,
  TutorExerciseGroup,
  TutorNextQuestionResponse,
  TutorOrchestratorSnapshot,
  TutorOrchestratorState,
  TutorQuestion,
  TutorRealtimeEvent,
  TutorScreenplayBeat,
  TutorSessionProgress,
  TutorTeachingStep,
  TutorStartResponse
} from "@/lib/types";

type Status = "idle" | "loading" | "ready" | "error";
type Confidence = "low" | "medium" | "high";
type ScreenplayMode = "core" | "remedial" | "challenge";
type MicPermission = "unknown" | "granted" | "prompt" | "denied" | "unsupported";
type KnownLanguage = "english" | "english_hindi" | "hindi";
type LearnerLevel = "beginner" | "familiar" | "confident";
type LearnerGoal = "school" | "speed" | "exam";

type SvgBoardStep =
  | {
      kind: "line";
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color?: string;
      width?: number;
      delaySec: number;
      durationSec: number;
    }
  | {
      kind: "text";
      id: string;
      x: number;
      y: number;
      text: string;
      size?: number;
      color?: string;
      delaySec: number;
      durationSec: number;
    }
  | {
      kind: "image";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      href: string;
      opacity?: number;
      delaySec: number;
      durationSec: number;
    };

type Avatar = { id: string; name: string; role: string; color: string; style: "boy" | "girl" | "male" | "robot"; voice: string; variant?: AvatarVariant; };
type ConversationRole = "tutor" | "student" | "system";
type ConversationChannel = "voice" | "text" | "doubt" | "system";
type ConversationTurn = {
  id: string;
  role: ConversationRole;
  channel: ConversationChannel;
  text: string;
  at: number;
  questionId?: string;
  exerciseGroup?: string;
};

type SavedTutorBookmark = {
  sessionId: string;
  courseId: string;
  chapterCode: string;
  exerciseGroup: string;
  lessonTitle: string;
  questionId: string;
  elapsedSec: number;
  savedAt: number;
};
const DEFAULT_COURSE_ID = "vedic_math";
const MODULE_TO_COURSE_ID: Record<string, string> = {
  VEDIC_MATH: "vedic_math",
  NEET_PHYSICS: "neet_physics",
  NEET_CHEMISTRY: "neet_chemistry",
  NEET_BIOLOGY: "neet_biology",
  APTITUDE_REASONING: "aptitude_reasoning",
  FINANCIAL_LITERACY: "financial_literacy"
};
const COURSE_LABELS: Record<string, string> = {
  vedic_math: "Vedic Math",
  neet_physics: "NEET Physics",
  neet_chemistry: "NEET Chemistry",
  neet_biology: "NEET Biology",
  aptitude_reasoning: "Aptitude & Reasoning",
  financial_literacy: "Financial Literacy"
};
const EX_GROUP_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const TEACHING_CUE_ORDER = ["intro", "explain", "demo", "guided", "practice", "check", "checkpoint"] as const;
const KNOWN_LANGUAGE_LABELS: Record<KnownLanguage, string> = {
  english: "English",
  english_hindi: "English + Hindi",
  hindi: "Hindi"
};
const LEARNER_LEVEL_LABELS: Record<LearnerLevel, string> = {
  beginner: "I am a beginner",
  familiar: "I know a little",
  confident: "I already practice"
};
const LEARNER_GOAL_LABELS: Record<LearnerGoal, string> = {
  school: "School math",
  speed: "Mental speed",
  exam: "Exam practice"
};

function toCourseLabel(courseId: string): string {
  const key = (courseId || "").trim().toLowerCase();
  if (COURSE_LABELS[key]) {
    return COURSE_LABELS[key];
  }
  if (!key) {
    return "AI Tutor";
  }
  return key.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const compact = (token || "").trim();
  const parts = compact.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = atob(padded);
    const json = decodeURIComponent(
      Array.from(decoded)
        .map((ch) => `%${ch.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    const payload = JSON.parse(json);
    return payload && typeof payload === "object" ? payload as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function normalizeGradeValue(raw: unknown): number | null {
  const text = String(raw ?? "").trim();
  if (!text) return null;
  const match = text.match(/\d{1,2}/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}

function parseGradeBand(raw: unknown): { min: number | null; max: number | null; label: string } {
  const text = String(raw ?? "").trim();
  if (!text) {
    return { min: null, max: null, label: "" };
  }
  const numbers = [...text.matchAll(/\d{1,2}/g)]
    .map((match) => Number(match[0]))
    .filter((value) => Number.isFinite(value));
  if (numbers.length >= 2) {
    const min = numbers[0];
    const max = numbers[numbers.length - 1];
    return { min, max, label: `Grades ${min}-${max}` };
  }
  if (numbers.length === 1) {
    const grade = numbers[0];
    return { min: grade, max: grade, label: `Grade ${grade}` };
  }
  if (/primary|junior/i.test(text)) {
    return { min: 4, max: 6, label: "Grades 4-6" };
  }
  if (/middle|secondary|senior/i.test(text)) {
    return { min: 7, max: 9, label: "Grades 7-9" };
  }
  return { min: null, max: null, label: text };
}

function formatElapsedLabel(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function toAssetTypeLabel(assetType: string): string {
  const normalized = (assetType || "").trim().toLowerCase();
  const labels: Record<string, string> = {
    pdf: "PDF",
    notes: "Notes",
    video: "Video",
    flashcard: "Flashcards",
    quiz: "Quiz",
    assignment: "Assignment",
    matchinggame: "Matching Game",
    matchingpair: "Matching Pairs",
    exampaper: "Exam Paper"
  };
  return labels[normalized] || normalized.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase()) || "Asset";
}

function toAssetUrl(raw: string): string {
  const value = (raw || "").trim();
  if (!value) return "#";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  return `/${value.replace(/^\/+/, "")}`;
}

const AVATARS: Avatar[] = [
  { id: "raj",   name: "Raj",   role: "Learning Coach", color: "#E91E8C", style: "robot", voice: "aditya", variant: "screen"  },
  { id: "nova",  name: "Nova",  role: "Learning Coach", color: "#E91E8C", style: "robot", voice: "priya",  variant: "round"   },
  { id: "priya", name: "Priya", role: "Learning Coach", color: "#E91E8C", style: "robot", voice: "priya",  variant: "classic" },
];
const STATIC_AVATAR_MODE = false;

const WIN_PHRASES = [
  { emoji: "🌟", text: "Brilliant!" },
  { emoji: "🎯", text: "You nailed it!" },
  { emoji: "⭐", text: "Excellent!" },
  { emoji: "🚀", text: "Outstanding!" },
  { emoji: "💯", text: "Perfect!" },
  { emoji: "🏆", text: "Champion!" },
  { emoji: "✨", text: "Fantastic!" },
  { emoji: "🎉", text: "Correct!" },
  { emoji: "🔥", text: "On fire!" },
  { emoji: "👑", text: "Superb!" },
  { emoji: "💫", text: "Spot on!" },
  { emoji: "🎊", text: "Amazing!" },
];

const CONFETTI_COLORS = ["#E91E8C", "#3B3A8C", "#FFD700", "#00C896", "#FF6B6B", "#4ECDC4", "#FF9F43"];
const CONFETTI_SPREAD = [
  { dx: -130, dy: -160 }, { dx: 0,   dy: -190 }, { dx: 130, dy: -160 },
  { dx: 190,  dy: 0    }, { dx: 155, dy: 130  }, { dx: 65,  dy: 185  },
  { dx: -65,  dy: 185  }, { dx: -155,dy: 130  }, { dx: -190,dy: 0    },
  { dx: -90,  dy: -110 }, { dx: 90,  dy: -110 }, { dx: 110, dy: 110  },
  { dx: -110, dy: 110  }, { dx: 40,  dy: -195 },
];

const AVATAR_STAGE_ART: Record<string, string> = {
  raj:   "/avatar_1/sprite_r03_c01.svg",
  priya: "/teacher_1/svg/view_front.svg",
};

const BOARD_TEACHER_SVG_BY_CUE: Record<string, string> = {
  intro: "/teacher_1/svg/gesture_greeting.svg",
  explain: "/teacher_1/svg/gesture_explain_1.svg",
  demo: "/teacher_1/svg/gesture_write_on_board.svg",
  guided: "/teacher_1/svg/gesture_ask_question.svg",
  practice: "/teacher_1/svg/gesture_look_at_students.svg",
  check: "/teacher_1/svg/gesture_ok_good.svg",
  checkpoint: "/teacher_1/svg/gesture_answer.svg",
  default: "/teacher_1/svg/idle_hands_clasped.svg"
};

// ── Speaking teacher – gesture per cue ────────────────────────────────────
const TEACHER_GESTURE_BY_CUE: Record<string, string> = {
  intro:      "/teacher_1/svg/gesture_greeting.svg",
  explain:    "/teacher_1/svg/gesture_explain_1.svg",
  demo:       "/teacher_1/svg/gesture_write_on_board.svg",
  guided:     "/teacher_1/svg/gesture_ask_question.svg",
  practice:   "/teacher_1/svg/gesture_look_at_students.svg",
  check:      "/teacher_1/svg/gesture_ok_good.svg",
  checkpoint: "/teacher_1/svg/gesture_answer.svg",
  default:    "/teacher_1/svg/idle_hands_clasped.svg"
};

// ── Viseme sequence for lip-sync ───────────────────────────────────────────
const VISEME_CYCLE_SRCS = [
  "/teacher_1/svg/viseme_rest.svg",
  "/teacher_1/svg/viseme_a.svg",
  "/teacher_1/svg/viseme_mbp.svg",
  "/teacher_1/svg/viseme_o.svg",
  "/teacher_1/svg/viseme_e.svg",
  "/teacher_1/svg/viseme_u.svg",
  "/teacher_1/svg/viseme_l.svg",
  "/teacher_1/svg/viseme_rest.svg",
];

// ── Male teacher (avatar_1) – full-body SVG per cue ───────────────────────
// Cue → single best-fit sprite from the 51-sprite pack (r=row, c=col).
const MALE_TEACHER_SPRITE_BY_CUE: Record<string, string> = {
  intro:      "/avatar_1/sprite_r03_c06.svg",  // friendly wave / greeting
  explain:    "/avatar_1/sprite_r02_c01.svg",  // arms spread, enthusiastic explain
  demo:       "/avatar_1/sprite_r06_c01.svg",  // holding whiteboard / pointing
  guided:     "/avatar_1/sprite_r03_c05.svg",  // both hands raised "come on"
  practice:   "/avatar_1/sprite_r04_c04.svg",  // calm attentive standing
  check:      "/avatar_1/sprite_r03_c01.svg",  // approving wave
  checkpoint: "/avatar_1/sprite_r04_c01.svg",  // hands raised, asking student
  default:    "/avatar_1/sprite_r01_c11.svg",  // relaxed open-arms pose
};

// Sprites cycled while speaking — slow gesture changes (2.5 s each), crossfaded smoothly.
// Pick poses that feel "engaged explaining" — not wildly different so crossfade looks natural.
const MALE_TEACHER_SPEAKING_CYCLE = [
  "/avatar_1/sprite_r01_c11.svg",  // open arms — neutral engaging
  "/avatar_1/sprite_r02_c01.svg",  // arms spread — enthusiastic
  "/avatar_1/sprite_r03_c05.svg",  // pointing/guiding — confident
  "/avatar_1/sprite_r04_c04.svg",  // hands together — thoughtful
];

function boardTeacherSvgForCue(cue?: string): string {
  const key = (cue || "").toLowerCase();
  return BOARD_TEACHER_SVG_BY_CUE[key] || BOARD_TEACHER_SVG_BY_CUE.default;
}

// ── Vedic Sutra names per chapter ─────────────────────────────────────────────
const CHAPTER_SUTRAS: Record<string, string> = {
  L1_COMPLETING_WHOLE: "By the Completion or Non-Completion",
  L2_DOUBLING_HALVING: "Alternate Elimination and Retention",
  L3_MULTIPLY_BY_11: "Anurupyena — Proportionality",
  L4_VERTICAL_CROSSWISE: "Urdhva-Tiryagbhyam — Vertical and Crosswise",
  L5_ALL_FROM_9_LAST_FROM_10: "All from 9 and the Last from 10",
  L6_NIKHILAM_BASE_10_100: "Nikhilam — Near Base Method",
  L7_SQUARES_ENDING_5: "By One More than the One Before",
  L8_YAVADUNAM: "Yavadunam — Whatever the Deficiency",
  L9_GENERAL_MULTIPLICATION: "Urdhva-Tiryagbhyam — General Case",
  L10_DIVISION_BY_9: "Paravartya Yojayet — Transpose and Apply",
  L11_VINCULUM_INTRO: "Vinculum — Negative Digit Representation",
  L12_FRACTIONS_DECIMALS: "Anurupyena — Proportional Fractions",
  L13_ALGEBRAIC_IDENTITIES: "Anurupye Sunyam — Proportionately Zero",
  L14_FACTORISATION: "Adyam Adyena — First by First",
  L15_SQUARES_NEAR_BASE: "Yavadunam — Near Base Squares",
  L16_CUBES_INTRO: "Anurupyena — Cubes by Pattern",
};

// ── Worked example lines for DEMO slide (board animation) ────────────────────
const CHAPTER_DEMO_STEPS: Record<string, Array<{ text: string; color?: string; size?: number }>> = {
  L1_COMPLETING_WHOLE: [
    { text: "Question: What adds to 7 to reach 10?", color: "#334155", size: 14 },
    { text: "Step 1 — Base = 10  (our target)", color: "#0369a1", size: 14 },
    { text: "Step 2 — 7 + ? = 10", color: "#334155", size: 15 },
    { text: "Answer:  10 − 7 = 3", color: "#065f46", size: 18 },
    { text: "Check: 7 + 3 = 10  ✓   (Sutra confirmed!)", color: "#7c2d12", size: 12 },
  ],
  L2_DOUBLING_HALVING: [
    { text: "Question: Double 36", color: "#334155", size: 14 },
    { text: "Step 1 — Split: 36 = 30 + 6", color: "#0369a1", size: 14 },
    { text: "Step 2 — Double each: 60 + 12", color: "#334155", size: 14 },
    { text: "Answer: 60 + 12 = 72", color: "#065f46", size: 18 },
    { text: "Twice as fast as long multiplication!", color: "#7c2d12", size: 12 },
  ],
  L3_MULTIPLY_BY_11: [
    { text: "Question: 34 × 11 = ?", color: "#334155", size: 14 },
    { text: "Step 1 — Write the outer digits: 3 _ 4", color: "#0369a1", size: 14 },
    { text: "Step 2 — Insert their sum: 3+4 = 7", color: "#334155", size: 14 },
    { text: "Answer: 374", color: "#065f46", size: 20 },
    { text: "No multiplication table needed!", color: "#7c2d12", size: 12 },
  ],
  L4_VERTICAL_CROSSWISE: [
    { text: "Question: 23 × 14 = ?", color: "#334155", size: 14 },
    { text: "V-Right: 3×4=12 → write 2, carry 1", color: "#0369a1", size: 13 },
    { text: "Crosswise: 2×4+3×1=11+1=12 → write 2, carry 1", color: "#334155", size: 12 },
    { text: "V-Left: 2×1=2+1=3", color: "#334155", size: 13 },
    { text: "Answer: 322", color: "#065f46", size: 20 },
  ],
  L5_ALL_FROM_9_LAST_FROM_10: [
    { text: "Question: 100 − 37 = ?", color: "#334155", size: 14 },
    { text: "Step 1 — 'All from 9': 9 − 3 = 6", color: "#0369a1", size: 14 },
    { text: "Step 2 — 'Last from 10': 10 − 7 = 3", color: "#334155", size: 14 },
    { text: "Answer: 63", color: "#065f46", size: 20 },
    { text: "Instant subtraction — no borrowing!", color: "#7c2d12", size: 12 },
  ],
  L6_NIKHILAM_BASE_10_100: [
    { text: "Question: 97 × 98 (base 100)", color: "#334155", size: 14 },
    { text: "Step 1 — Deviations: 97→−3,  98→−2", color: "#0369a1", size: 13 },
    { text: "Step 2 — Left: 97+(−2)=95  or  98+(−3)=95", color: "#334155", size: 12 },
    { text: "Step 3 — Right: (−3)×(−2)=06", color: "#334155", size: 13 },
    { text: "Answer: 9506", color: "#065f46", size: 20 },
  ],
  L7_SQUARES_ENDING_5: [
    { text: "Question: 35² = ?", color: "#334155", size: 14 },
    { text: "Step 1 — Prefix: 3 × (3+1) = 3 × 4 = 12", color: "#0369a1", size: 13 },
    { text: "Step 2 — Attach 25", color: "#334155", size: 14 },
    { text: "Answer: 1225", color: "#065f46", size: 20 },
    { text: "Any number ending in 5, instant square!", color: "#7c2d12", size: 12 },
  ],
};

// ── Spoken DEMO narration per chapter ─────────────────────────────────────────
const CHAPTER_DEMO_SPEECH: Record<string, string> = {
  L1_COMPLETING_WHOLE: "Watch how I find what adds to 7 to make 10. Our base is 10. Seven plus what equals ten? Ten minus 7 is 3. So the answer is 3. Seven plus 3 equals 10. The Sutra works!",
  L2_DOUBLING_HALVING: "Watch me double 36. I split it: 30 and 6. Double 30 is 60. Double 6 is 12. Add them: 72. No calculator needed!",
  L3_MULTIPLY_BY_11: "Watch 34 times 11. Write the outer digits 3 and 4. Insert their sum 7 in the middle. Answer: 374. No long multiplication!",
  L4_VERTICAL_CROSSWISE: "Watch 23 times 14. Three steps: vertical right, crosswise, vertical left. Each step follows the Sutra. Answer: 322.",
  L5_ALL_FROM_9_LAST_FROM_10: "Watch me do 100 minus 37. Take digits from 9 and the last from 10. Nine minus 3 is 6. Ten minus 7 is 3. Answer: 63. Instant!",
  L6_NIKHILAM_BASE_10_100: "Watch 97 times 98. Deviations from 100: minus 3 and minus 2. Left part: 95. Right part: 06. Answer: 9506.",
  L7_SQUARES_ENDING_5: "Watch 35 squared. Prefix is 3. Multiply by the next number: 3 times 4 is 12. Attach 25. Answer: 1225. Any number ending in 5 works like this!",
};
const ACTUAL_CHAPTER_LABELS: Record<string, string> = {
  L3_MULTIPLY_BY_11: "Digit Sums and the Nine Point Circle",
  L4_VERTICAL_CROSSWISE: "Left to Right Arithmetic",
  L6_NIKHILAM_BASE_10_100: "Number Splitting",
  L7_SQUARES_ENDING_5: "Base Multiplication",
  L8_YAVADUNAM: "Checking and Divisibility",
  L9_GENERAL_MULTIPLICATION: "Bar Numbers",
  L10_DIVISION_BY_9: "Special Multiplication",
  L11_VINCULUM_INTRO: "General Multiplication",
  L12_FRACTIONS_DECIMALS: "Squaring",
  L13_ALGEBRAIC_IDENTITIES: "Equations",
  L14_FACTORISATION: "Fractions",
  L15_SQUARES_NEAR_BASE: "Special Division",
  L16_CUBES_INTRO: "The Crowning Gem",
};

const ACTUAL_CHAPTER_DEMO_STEPS: Record<string, Array<{ text: string; color?: string; size?: number }>> = {
  L3_MULTIPLY_BY_11: [
    { text: "Question: What is the digit sum of 13?", color: "#334155", size: 14 },
    { text: "Step 1 - Add the digits: 1 + 3", color: "#0369a1", size: 14 },
    { text: "Step 2 - Total = 4", color: "#334155", size: 14 },
    { text: "Answer: digit sum = 4", color: "#065f46", size: 20 },
    { text: "Digit sums help you check bigger arithmetic fast.", color: "#7c2d12", size: 12 },
  ],
  L4_VERTICAL_CROSSWISE: [
    { text: "Question: 56 + 67 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - Add tens first: 50 + 60 = 110", color: "#0369a1", size: 13 },
    { text: "Step 2 - Add ones: 6 + 7 = 13", color: "#334155", size: 13 },
    { text: "Step 3 - Combine: 110 + 13 = 123", color: "#334155", size: 13 },
    { text: "Answer: 123", color: "#065f46", size: 20 },
  ],
  L6_NIKHILAM_BASE_10_100: [
    { text: "Question: 2345 + 6738 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - Split 2345 into 2000 and 345", color: "#0369a1", size: 13 },
    { text: "Step 2 - 6738 + 2000 = 8738", color: "#334155", size: 13 },
    { text: "Step 3 - 8738 + 345 = 9083", color: "#334155", size: 13 },
    { text: "Answer: 9083", color: "#065f46", size: 20 },
  ],
  L7_SQUARES_ENDING_5: [
    { text: "Question: 7 x 8 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - Think base 10: deficiencies are 3 and 2", color: "#0369a1", size: 13 },
    { text: "Step 2 - Left part: 7 - 2 = 5", color: "#334155", size: 13 },
    { text: "Step 3 - Right part: 3 x 2 = 6", color: "#334155", size: 13 },
    { text: "Answer: 56", color: "#065f46", size: 20 },
  ],
  L8_YAVADUNAM: [
    { text: "Question: Is 462 divisible by 11?", color: "#334155", size: 14 },
    { text: "Step 1 - Add alternating digits: (4 + 2) - 6", color: "#0369a1", size: 13 },
    { text: "Step 2 - 6 - 6 = 0", color: "#334155", size: 13 },
    { text: "Step 3 - Zero means it passes the 11-test", color: "#334155", size: 13 },
    { text: "Answer: yes, 462 is divisible by 11", color: "#065f46", size: 18 },
  ],
  L9_GENERAL_MULTIPLICATION: [
    { text: "Question: Rewrite 20 - 1 using bar thinking", color: "#334155", size: 14 },
    { text: "Step 1 - Borrow one ten mentally", color: "#0369a1", size: 13 },
    { text: "Step 2 - Replace the units cleanly", color: "#334155", size: 13 },
    { text: "Step 3 - 20 - 1 becomes 19", color: "#334155", size: 13 },
    { text: "Answer: 19", color: "#065f46", size: 20 },
  ],
  L10_DIVISION_BY_9: [
    { text: "Question: 23 x 11 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - Write the outer digits: 2 _ 3", color: "#0369a1", size: 13 },
    { text: "Step 2 - Insert their sum: 2 + 3 = 5", color: "#334155", size: 13 },
    { text: "Step 3 - Read the answer: 253", color: "#334155", size: 13 },
    { text: "Answer: 253", color: "#065f46", size: 20 },
  ],
  L11_VINCULUM_INTRO: [
    { text: "Question: 74 x 8 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - Split 74 into 70 and 4", color: "#0369a1", size: 13 },
    { text: "Step 2 - 70x8 = 560 and 4x8 = 32", color: "#334155", size: 13 },
    { text: "Step 3 - Add the parts: 560 + 32 = 592", color: "#334155", size: 13 },
    { text: "Answer: 592", color: "#065f46", size: 20 },
  ],
  L12_FRACTIONS_DECIMALS: [
    { text: "Question: 55 x 55 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - Prefix is 5", color: "#0369a1", size: 13 },
    { text: "Step 2 - 5 x 6 = 30, then attach 25", color: "#334155", size: 13 },
    { text: "Step 3 - Read the square: 3025", color: "#334155", size: 13 },
    { text: "Answer: 3025", color: "#065f46", size: 20 },
  ],
  L13_ALGEBRAIC_IDENTITIES: [
    { text: "Question: x + 3 = 10", color: "#334155", size: 14 },
    { text: "Step 1 - Reverse the +3", color: "#0369a1", size: 13 },
    { text: "Step 2 - 10 - 3 = 7", color: "#334155", size: 13 },
    { text: "Step 3 - Check: 7 + 3 = 10", color: "#334155", size: 13 },
    { text: "Answer: x = 7", color: "#065f46", size: 20 },
  ],
  L14_FACTORISATION: [
    { text: "Question: 1/2 + 1/3 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - Common denominator is 6", color: "#0369a1", size: 13 },
    { text: "Step 2 - 1/2 = 3/6 and 1/3 = 2/6", color: "#334155", size: 13 },
    { text: "Step 3 - Add: 3/6 + 2/6 = 5/6", color: "#334155", size: 13 },
    { text: "Answer: 5/6", color: "#065f46", size: 20 },
  ],
  L15_SQUARES_NEAR_BASE: [
    { text: "Question: 123 / 9 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - 9 goes into 12 once", color: "#0369a1", size: 13 },
    { text: "Step 2 - Carry the remainder into the next digit", color: "#334155", size: 13 },
    { text: "Step 3 - Final result is 13 remainder 6", color: "#334155", size: 13 },
    { text: "Answer: 13 R 6", color: "#065f46", size: 20 },
  ],
  L16_CUBES_INTRO: [
    { text: "Question: 132 / 11 = ?", color: "#334155", size: 14 },
    { text: "Step 1 - Recognize 11 x 12 = 132", color: "#0369a1", size: 13 },
    { text: "Step 2 - Division reverses multiplication cleanly", color: "#334155", size: 13 },
    { text: "Step 3 - Quotient = 12, remainder = 0", color: "#334155", size: 13 },
    { text: "Answer: 12", color: "#065f46", size: 20 },
  ],
};

const ACTUAL_CHAPTER_DEMO_SPEECH: Record<string, string> = {
  L3_MULTIPLY_BY_11: "Watch the digit sum of 13. Add the digits: 1 plus 3 equals 4. That final single digit is the digit sum. This pattern helps you check bigger calculations very quickly.",
  L4_VERTICAL_CROSSWISE: "Watch 56 plus 67 from left to right. Add the tens first to get 110. Then add the ones to get 13. Combine them and you get 123. The whole calculation stays organized in one flow.",
  L6_NIKHILAM_BASE_10_100: "Watch me split 2345 plus 6738 into easier parts. First add 2000 to 6738 and get 8738. Then add the remaining 345 to reach 9083. Number splitting keeps the arithmetic calm and accurate.",
  L7_SQUARES_ENDING_5: "Watch 7 times 8 using base multiplication near 10. Their deficiencies are 3 and 2. Left part: 7 minus 2 gives 5. Right part: 3 times 2 gives 6. Answer: 56.",
  L8_YAVADUNAM: "Watch the divisibility test for 462 by 11. Add alternating digits: 4 plus 2, then subtract 6. The result is 0, so 462 is divisible by 11. This is a fast mental check before you trust an answer.",
  L9_GENERAL_MULTIPLICATION: "Watch bar-number thinking turn 20 minus 1 into 19 without confusion. You borrow one ten mentally, then rewrite the units cleanly. Bar numbers help later arithmetic stay compact and organized.",
  L10_DIVISION_BY_9: "Watch 23 times 11. Write the outer digits 2 and 3. Insert their sum, 5, in the middle. The answer is 253. This chapter is about spotting special multiplication patterns instantly.",
  L11_VINCULUM_INTRO: "Watch 74 times 8. Split 74 into 70 and 4. Multiply each part by 8, then add 560 and 32 to get 592. General multiplication works when you keep the structure visible all the way through.",
  L12_FRACTIONS_DECIMALS: "Watch 55 squared. Take the prefix 5, multiply it by the next number 6, and attach 25. The answer is 3025. Squaring becomes much faster when you recognize the right pattern.",
  L13_ALGEBRAIC_IDENTITIES: "Watch x plus 3 equals 10. Reverse the plus 3 by subtracting 3 from 10. That gives x equals 7. Then check it: 7 plus 3 really does make 10.",
  L14_FACTORISATION: "Watch one-half plus one-third. The common denominator is 6. Convert the fractions to 3 over 6 and 2 over 6, then add them to get 5 over 6. Fractions become easier when every move is laid out clearly.",
  L15_SQUARES_NEAR_BASE: "Watch 123 divided by 9. Nine goes into 12 once, then you carry the remainder into the next step. The final result is 13 remainder 6. Special division is about controlling each carry without losing place value.",
  L16_CUBES_INTRO: "Watch 132 divided by 11. Since 11 times 12 is 132, the quotient is 12 with no remainder. The crowning-gem division lessons focus on seeing those structure clues quickly.",
};

const CHAPTER_LABEL_MAP = { ...CHAPTER_SUTRAS, ...ACTUAL_CHAPTER_LABELS };
const CHAPTER_DEMO_STEP_MAP = { ...CHAPTER_DEMO_STEPS, ...ACTUAL_CHAPTER_DEMO_STEPS };
const CHAPTER_DEMO_SPEECH_MAP = { ...CHAPTER_DEMO_SPEECH, ...ACTUAL_CHAPTER_DEMO_SPEECH };

function AvatarFace({
  avatar,
  size = 44,
  animated = false,
  speaking = false
}: {
  avatar: Avatar;
  size?: number;
  animated?: boolean;
  speaking?: boolean;
}) {
  const eyeY = size * 0.44;
  const eyeL = size * 0.37;
  const eyeR = size * 0.63;
  const mouthY = size * 0.64;
  const hairColor = avatar.color;
  const mouthPath = speaking
    ? `M32 ${mouthY} Q50 ${mouthY + 16} 68 ${mouthY}`
    : `M35 ${mouthY} Q50 ${mouthY + 8} 65 ${mouthY}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label={`${avatar.name} face`}
      style={{
        transformOrigin: "50% 50%",
        animation: animated ? "avatarFloat 2.4s ease-in-out infinite" : "none"
      }}
    >
      <circle cx="50" cy="50" r="48" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M18,44 C20,18 80,18 82,44 L82,36 C80,10 20,10 18,36 Z" fill={hairColor} />
      <circle cx="50" cy="52" r="30" fill="#fde68a" />
      <circle cx={eyeL} cy={eyeY} r="4.2" fill="#0f172a" />
      <circle cx={eyeR} cy={eyeY} r="4.2" fill="#0f172a" />
      <path d={mouthPath} fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="52" r="30" fill="none" stroke="#e2e8f0" />
    </svg>
  );
}

// ── Speaking teacher avatar (layered sprite system) ────────────────────────
function SpeakingTeacher({
  cue = "explain",
  speaking = false,
  feedback,
  avatar,
  compact = false
}: {
  cue?: string;
  speaking?: boolean;
  feedback?: boolean;
  avatar: Avatar;
  compact?: boolean;
}) {
  const [visemeIdx, setVisemeIdx] = useState(0);
  const [showBlink, setShowBlink] = useState(false);
  // Eye direction for teacher_1: 'center' | 'left' | 'right'
  const [eyeDir, setEyeDir] = useState<"center" | "left" | "right">("center");
  // Sprite-cycle index for male teacher speaking animation (0–3)
  const [speakFrame, setSpeakFrame] = useState(0);

  // Male teacher gesture cycling: swap pose every 2.5 s while speaking
  useEffect(() => {
    if (STATIC_AVATAR_MODE) { setSpeakFrame(0); return; }
    if (avatar.style !== "male" || !speaking) { setSpeakFrame(0); return; }
    const tid = setInterval(
      () => setSpeakFrame(f => (f + 1) % MALE_TEACHER_SPEAKING_CYCLE.length),
      2500
    );
    return () => clearInterval(tid);
  }, [speaking, avatar.style]);

  // Viseme cycling when speaking (~110 ms per shape = ~9 fps) — SVG teacher_1 only
  useEffect(() => {
    if (STATIC_AVATAR_MODE) { setVisemeIdx(0); return; }
    if (avatar.style === "male" || !speaking) { setVisemeIdx(0); return; }
    const tid = setInterval(
      () => setVisemeIdx(i => (i + 1) % VISEME_CYCLE_SRCS.length),
      110
    );
    return () => clearInterval(tid);
  }, [speaking, avatar.style]);

  // Periodic auto-blink every 3–7 s
  useEffect(() => {
    if (STATIC_AVATAR_MODE) { setShowBlink(false); return; }
    let t: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      t = setTimeout(() => {
        setShowBlink(true);
        setTimeout(() => setShowBlink(false), 160);
        scheduleBlink();
      }, 3000 + Math.random() * 4000);
    };
    scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Eye tracking: look left/right during speaking (teacher_1 only)
  useEffect(() => {
    if (STATIC_AVATAR_MODE || avatar.style === "male") { setEyeDir("center"); return; }
    if (!speaking) { setEyeDir("center"); return; }
    const SEQ: Array<{ dir: "center" | "left" | "right"; ms: number }> = [
      { dir: "center", ms: 2000 }, { dir: "left",   ms: 1100 },
      { dir: "center", ms: 1600 }, { dir: "right",  ms: 1100 },
    ];
    let idx = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      setEyeDir(SEQ[idx].dir);
      t = setTimeout(() => { idx = (idx + 1) % SEQ.length; step(); }, SEQ[idx].ms);
    };
    step();
    return () => clearTimeout(t);
  }, [speaking, avatar.style]);

  // ── RoboDynamics robot avatar (Option C) ─────────────────────────────────
  if (avatar.style === "robot") {
    const expression: AvatarExpression =
      feedback === true  ? "happy"
      : feedback === false ? "concerned"
      : speaking          ? "encouraging"
      : cue === "checkpoint" || cue === "practice" ? "thinking"
      : "neutral";
    return (
      <RobotAvatar
        speaking={speaking}
        expression={expression}
        size={compact ? 80 : 200}
        accentColor="#E91E8C"
        baseColor="#3B3A8C"
        compact={compact}
        variant={avatar.variant ?? "screen"}
      />
    );
  }

  // ── Male teacher: cycling sprite gesture + CSS speaking rhythm ──────────────
  if (avatar.style === "male") {
    const cueKey = (cue || "").toLowerCase();
    // Cue/feedback-based sprite (shown when idle, or when feedback overrides)
    const cueSrc =
      feedback === true  ? "/avatar_1/sprite_r03_c06.svg"   // happy wave — correct!
      : feedback === false ? "/avatar_1/sprite_r05_c05.svg"  // concerned — wrong answer
      : (MALE_TEACHER_SPRITE_BY_CUE[cueKey] ?? MALE_TEACHER_SPRITE_BY_CUE.default);
    // While speaking (no feedback override) → cycle through 4 gesture sprites
    const activeSrc = STATIC_AVATAR_MODE
      ? MALE_TEACHER_SPRITE_BY_CUE.default
      : (speaking && feedback == null)
        ? MALE_TEACHER_SPEAKING_CYCLE[speakFrame]
        : cueSrc;
    return (
      <div
        className={`speaking-teacher male-teacher${!STATIC_AVATAR_MODE && speaking ? " speaking" : ""}${compact ? " compact" : ""}`}
        style={{ ["--teacher-accent" as any]: avatar.color }}
        aria-label={`${avatar.name} teacher avatar`}
      >
        <div className="teacher-glow" aria-hidden="true" />
        {/* key changes when sprite changes → triggers spriteFadeIn CSS animation */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={activeSrc} src={activeSrc} alt={avatar.name} className="male-teacher-sprite" draggable={false} />
      </div>
    );
  }

  const gestureSrc =
    TEACHER_GESTURE_BY_CUE[(cue || "").toLowerCase()] ?? TEACHER_GESTURE_BY_CUE.default;

  const expressionSrc =
    feedback === true  ? "/teacher_1/svg/expression_happy.svg"
    : feedback === false ? "/teacher_1/svg/expression_concerned.svg"
    : speaking         ? "/teacher_1/svg/expression_smile.svg"
    :                    "/teacher_1/svg/expression_neutral.svg";

  return (
    <div
      className={`speaking-teacher${speaking ? " speaking" : ""}${compact ? " compact" : ""}`}
      style={{ ["--teacher-accent" as any]: avatar.color }}
      aria-label={`${avatar.name} teacher avatar`}
    >
      <div className="teacher-glow" aria-hidden="true" />
      {/* Body base – full figure */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/teacher_1/svg/view_front.svg" alt={avatar.name}
           className="st-layer st-body" draggable={false} />
      {/* Gesture overlay – arms (cue-dependent) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={gestureSrc} src={gestureSrc} alt=""
           className="st-layer st-gesture" draggable={false} />
      {/* Expression overlay – face */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={expressionSrc} src={expressionSrc} alt=""
           className="st-layer st-expression" draggable={false} />
      {/* Viseme / lip-sync overlay – mouth */}
      {speaking && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={VISEME_CYCLE_SRCS[visemeIdx]} alt=""
             className="st-layer st-viseme" draggable={false} />
      )}
      {/* Eye direction overlay (look left / right) */}
      {eyeDir !== "center" && !showBlink && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={eyeDir === "left" ? "/teacher_1/svg/head_look_left.svg" : "/teacher_1/svg/head_look_right.svg"}
             alt="" className="st-layer st-blink" draggable={false} />
      )}
      {/* Blink overlay */}
      {showBlink && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src="/teacher_1/svg/head_blink.svg" alt=""
             className="st-layer st-blink" draggable={false} />
      )}
    </div>
  );
}

// ── Lesson intro slide builder ────────────────────────────────────────────────
// Builds SVG board steps for the 3-slide lesson intro (EXPLAIN → DEMO → GUIDED).
// Runs BEFORE the first question. Pure function — no React hooks.
function buildIntroSlideBoardSteps(
  slide: 1 | 2 | 3,
  chapterCode: string,
  learningGoals: string[],
  avatar: Avatar,
  speed: number
): SvgBoardStep[] {
  const steps: SvgBoardStep[] = [];
  const sp = Math.max(0.5, speed);
  let delay = 0;

  const addT = (id: string, x: number, y: number, text: string, color = "#0f172a", size = 14) => {
    steps.push({ kind: "text", id, x, y, text, color, size, delaySec: delay, durationSec: 0.45 / sp });
    delay += 0.38 / sp;
  };
  const addL = (id: string, x1: number, y1: number, x2: number, y2: number, color = "#cbd5e1", width = 1) => {
    steps.push({ kind: "line", id, x1, y1, x2, y2, color, width, delaySec: delay, durationSec: 0.55 / sp });
    delay += 0.35 / sp;
  };
  const addI = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    href: string,
    opacity = 0.98
  ) => {
    steps.push({ kind: "image", id, x, y, width, height, href, opacity, delaySec: delay, durationSec: 0.35 / sp });
    delay += 0.2 / sp;
  };

  if (slide === 1) {
    // ── EXPLAIN: Sutra name + learning goals ──────────────────────────────
    addT("s1_badge", 16, 22, "EXPLAIN  —  Step 1 of 3: Here is the Concept", "#94a3b8", 11);
    addL("s1_sep", 16, 30, 570, 30, "#e2e8f0", 1);
    addT("s1_sutra_lbl", 16, 54, "Vedic Sutra:", "#7c2d12", 13);
    addT("s1_sutra", 16, 78, `"${CHAPTER_LABEL_MAP[chapterCode] || "Vedic Method"}"`, avatar.color, 17);
    addL("s1_line", 16, 92, 480, 92, avatar.color, 2);
    addT("s1_goal_lbl", 16, 116, "Today you will learn:", "#334155", 13);
    learningGoals.slice(0, 3).forEach((g, i) => {
      const truncated = g.length > 70 ? `${g.slice(0, 68)}…` : g;
      addT(`s1_g${i}`, 24, 138 + i * 24, `• ${truncated}`, "#0f172a", 13);
    });
    addT("s1_next", 16, 240, "► Next: Watch a worked example on the board", "#64748b", 11);
  } else if (slide === 2) {
    // ── DEMO: Step-by-step worked example ────────────────────────────────
    const demoLines = CHAPTER_DEMO_STEP_MAP[chapterCode] || [
      { text: "Step 1 — Identify the base or pattern", color: "#0369a1", size: 14 },
      { text: "Step 2 — Apply the Sutra rule", color: "#334155", size: 14 },
      { text: "Step 3 — Write the answer", color: "#065f46", size: 16 },
    ];
    addT("s2_badge", 16, 22, "DEMO  —  Step 2 of 3: Watch Me Solve One", "#94a3b8", 11);
    addL("s2_sep", 16, 30, 570, 30, "#e2e8f0", 1);
    let y = 58;
    demoLines.forEach((line, i) => {
      if (i === demoLines.length - 1) {
        addL(`s2_ans_line`, 16, y - 6, 380, y - 6, avatar.color, 2);
      }
      addT(`s2_l${i}`, 16, y, line.text, line.color || "#0f172a", line.size || 14);
      y += (line.size || 14) + 16;
    });
    addT("s2_next", 16, 310, "► Next: Your turn!", "#64748b", 11);
  } else {
    // ── GUIDED: Student transition ────────────────────────────────────────
    addT("s3_badge", 16, 22, "GUIDED  —  Step 3 of 3: Now You Try", "#94a3b8", 11);
    addL("s3_sep", 16, 30, 570, 30, "#e2e8f0", 1);
    addT("s3_l1", 16, 68, "Apply the same method to each question.", "#334155", 15);
    addT("s3_l2", 16, 96, "I will guide you if you are stuck.", avatar.color, 14);
    addL("s3_line", 16, 114, 440, 114, avatar.color, 2);
    addT("s3_r1", 28, 140, "• Read the question carefully", "#0f172a", 13);
    addT("s3_r2", 28, 162, "• Use the Sutra step by step", "#0f172a", 13);
    addT("s3_r3", 28, 184, "• Type your answer and click Check Answer", "#0f172a", 13);
    addT("s3_r4", 28, 206, "• Ask me a doubt any time using the doubt panel", "#0f172a", 13);
    addT("s3_ready", 16, 248, "Ready? Let us begin! ✓", avatar.color, 17);
  }

  return steps;
}

function getDemoSpeech(chapterCode: string): string {
  return CHAPTER_DEMO_SPEECH_MAP[chapterCode]
    || "Watch how I apply the Vedic method step by step. Each step follows directly from the Sutra rule. Notice how much faster this is than the conventional method.";
}

function AnimatedBoard({
  steps,
  runId,
  showPrompt
}: {
  steps: SvgBoardStep[];
  runId: number;
  showPrompt: boolean;
}) {
  return (
    <div style={{ width: "100%", border: "1px solid #cbd5e1", borderRadius: "10px", background: "#fff", overflow: "hidden" }}>
      <svg viewBox="0 0 760 380" width="100%" style={{ display: "block", height: "auto", maxHeight: "min(42vh, 280px)" }} role="img" aria-label="AI Tutor Whiteboard">
        <defs>
          <pattern id="board-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="760" height="340" fill="#ffffff" />
        <rect x="0" y="0" width="760" height="340" fill="url(#board-grid)" />
        {steps.map((step) => {
          const key = `${runId}_${step.id}`;
          if (step.kind === "line") {
            const length = Math.max(1, Math.hypot(step.x2 - step.x1, step.y2 - step.y1));
            return (
              <line
                key={key}
                x1={step.x1}
                y1={step.y1}
                x2={step.x2}
                y2={step.y2}
                stroke={step.color || "#64748b"}
                strokeWidth={step.width || 2}
                strokeLinecap="round"
                style={{
                  strokeDasharray: length,
                  strokeDashoffset: length,
                  animationName: "boardDrawLine",
                  animationDuration: `${step.durationSec}s`,
                  animationDelay: `${step.delaySec}s`,
                  animationFillMode: "forwards",
                  animationTimingFunction: "ease-out"
                }}
              />
            );
          }
          if (step.kind === "image") {
            return (
              <image
                key={key}
                href={step.href}
                x={step.x}
                y={step.y}
                width={step.width}
                height={step.height}
                preserveAspectRatio="xMidYMid meet"
                style={{
                  opacity: 0,
                  animationName: "boardFadeText",
                  animationDuration: `${step.durationSec}s`,
                  animationDelay: `${step.delaySec}s`,
                  animationFillMode: "forwards",
                  animationTimingFunction: "ease-out"
                }}
              />
            );
          }
          return (
            <text
              key={key}
              x={step.x}
              y={step.y}
              fill={step.color || "#0f172a"}
              fontSize={step.size || 16}
              fontFamily="'Segoe UI', Tahoma, sans-serif"
              style={{
                opacity: 0,
                animationName: "boardFadeText",
                animationDuration: `${step.durationSec}s`,
                animationDelay: `${step.delaySec}s`,
                animationFillMode: "forwards",
                animationTimingFunction: "ease-out"
              }}
            >
              {step.text}
            </text>
          );
        })}
        {showPrompt ? (
          <text x="500" y="22" fill="#7c2d12" fontSize={12} style={{ opacity: 0.9 }}>
            Teacher check-in: Tell me your next step in your own words.
          </text>
        ) : null}
      </svg>
    </div>
  );
}

function buildFlow(subtopics: string[]): Array<{ exerciseGroup: string; subtopic: string }> {
  if (!subtopics.length) {
    return EX_GROUP_KEYS.map((g) => ({ exerciseGroup: g, subtopic: "Practice" }));
  }

  const flow: Array<{ exerciseGroup: string; subtopic: string }> = [];
  const totalGroups = EX_GROUP_KEYS.length;
  const totalTopics = subtopics.length;
  const base = Math.floor(totalGroups / totalTopics);
  const extra = totalGroups % totalTopics;

  let cursor = 0;
  for (let i = 0; i < totalTopics; i += 1) {
    const width = base + (i < extra ? 1 : 0);
    for (let w = 0; w < width; w += 1) {
      if (cursor >= totalGroups) break;
      flow.push({ exerciseGroup: EX_GROUP_KEYS[cursor], subtopic: subtopics[i] });
      cursor += 1;
    }
  }
  while (cursor < totalGroups) {
    flow.push({ exerciseGroup: EX_GROUP_KEYS[cursor], subtopic: subtopics[subtopics.length - 1] });
    cursor += 1;
  }
  return flow;
}

function makeChapter(
  chapterCode: string,
  title: string,
  estimatedMinutes: number,
  subtopics: string[],
  learningGoals: string[]
): TutorChapter {
  return {
    chapterCode,
    title,
    estimatedMinutes,
    subtopics,
    learningGoals,
    exerciseGroups: EX_GROUP_KEYS,
    exerciseFlow: buildFlow(subtopics)
  };
}

const DEFAULT_CHAPTERS: TutorChapter[] = [
  makeChapter(
    "L1_COMPLETING_WHOLE",
    "Chapter 1: Completing the Whole",
    25,
    ["Introduction to Vedic Maths", "Ten point circle", "Deficiency from ten", "Mental addition", "By addition and subtraction"],
    ["Make 10 first", "Use deficiency language", "Add mentally with confidence"]
  ),
  makeChapter(
    "L2_DOUBLING_HALVING",
    "Chapter 2: Doubling and Halving",
    25,
    ["Fast doubling", "Fast halving", "Even/odd behavior", "Balancing products"],
    ["Double and halve mentally", "Use balancing", "Choose quick strategy"]
  ),
  makeChapter(
    "L3_MULTIPLY_BY_11",
    "Chapter 3: Digit Sums and the Nine Point Circle",
    20,
    ["Adding digits and digit sums", "Two-step digit sums", "The Nine Point Circle", "Casting out nines"],
    ["Find digit sums quickly", "Use casting out nines to check arithmetic", "Read the Vedic Square as a pattern tool"]
  ),
  makeChapter(
    "L4_VERTICAL_CROSSWISE",
    "Chapter 4: Left to Right Arithmetic",
    30,
    ["Two-digit addition from left to right", "Three-digit addition with carries", "Multiplication from left to right", "Doubling and halving for easier products"],
    ["Add from left to right", "Use left-to-right multiplication", "Confirm answers with digit sums"]
  ),
  makeChapter(
    "L5_ALL_FROM_9_LAST_FROM_10",
    "Chapter 5: All from 9 and Last from 10",
    25,
    ["Complements to 10", "Complements to 100", "Subtraction shortcuts", "Answer checks"],
    ["Find complements fast", "Subtract near-base numbers", "Verify by inverse"]
  ),
  makeChapter(
    "L6_NIKHILAM_BASE_10_100",
    "Chapter 6: Number Splitting",
    30,
    ["Addition by splitting into two easy chunks", "Choosing the split line to avoid carries", "Subtraction by splitting", "Multiplication by splitting without carry"],
    ["Split long calculations into smaller chunks", "Choose split points that reduce carries", "Use number splitting across operations"]
  ),
  makeChapter(
    "L7_SQUARES_ENDING_5",
    "Chapter 7: Base Multiplication",
    20,
    ["Numbers below 10 by deficiencies from 10", "Numbers just over 10", "Numbers close to 100 with carries", "Larger numbers near 1000"],
    ["Multiply numbers near a base mentally", "Handle carries across larger bases", "Square numbers near a base with the same deficiency idea"]
  ),
  makeChapter(
    "L8_YAVADUNAM",
    "Chapter 8: Checking and Divisibility",
    30,
    ["Digit-sum check for division", "Approximate answers", "Last-digit checks", "Divisibility by 4 and 11"],
    ["Check division and multiplication answers quickly", "Use approximate and last-digit checks", "Apply divisibility rules for 4 and 11"]
  ),
  makeChapter("L9_GENERAL_MULTIPLICATION", "Chapter 9: Bar Numbers", 30, ["Removing a single barred digit", "Splitting after the bar", "Several barred digits together", "Subtraction with barred digits"], ["Convert between barred and ordinary notation", "Use bar numbers to simplify subtraction", "Recognize when bar form makes later work easier"]),
  makeChapter("L10_DIVISION_BY_9", "Chapter 10: Special Multiplication", 25, ["Multiplication by 11 for two-digit numbers", "Multiplication by 11 for longer numbers", "By one more than the one before", "Multiplication by nines"], ["Apply special multiplication patterns faster than the general method", "Choose the right shortcut from the number structure", "Keep place value correct with complements and carries"]),
  makeChapter("L11_VINCULUM_INTRO", "Chapter 11: General Multiplication", 25, ["Revision of single-digit multiplication from left to right", "Two-figure multiplication vertically and crosswise", "Long number times two digits", "Three-figure extension and digit pairs"], ["Use one coherent vertically-and-crosswise pattern", "Merge carries cleanly in mental work", "Transfer the same multiplication structure into algebraic work"]),
  makeChapter("L12_FRACTIONS_DECIMALS", "Chapter 12: Squaring", 25, ["Squaring numbers ending in 5", "Squaring numbers near 50", "General squaring with duplexes", "Number splitting and algebraic squaring"], ["Choose the right squaring pattern quickly", "Extend squaring methods to larger numbers", "Check square information through digit clues and square roots"]),
  makeChapter("L13_ALGEBRAIC_IDENTITIES", "Chapter 13: Equations", 30, ["One-step equations by transpose and apply", "One-step equations with decimals and fractions", "Two-step equations", "Two-step equations with a full divided expression"], ["Reverse operations in the correct order", "Handle decimals and fractions without changing the core method", "Compress multi-step solving into one-line mental solutions"]),
  makeChapter("L14_FACTORISATION", "Chapter 14: Fractions", 30, ["Fraction addition and subtraction", "Mixed numbers and cancellation", "Shared-factor denominators", "Comparing fractions by cross-multiplication"], ["Add, subtract, multiply, and divide fractions through one connected structure", "Handle mixed numbers and shared factors efficiently", "Compare fractions mentally by cross-products"]),
  makeChapter("L15_SQUARES_NEAR_BASE", "Chapter 15: Special Division", 25, ["Division by 9 for short numbers", "Longer numbers and shortcut carries", "Division by 8, 7, and nearby divisors", "Division by 99, 98, and near-100 divisors"], ["Perform special division mentally", "Track quotient digits and remainder adjustments", "Rebuild the dividend to verify the answer"]),
  makeChapter("L16_CUBES_INTRO", "Chapter 16: The Crowning Gem (Advanced Division)", 30, ["Single Figure on the Flag Division", "Short division remainder control", "Longer number division", "Negative flag digits with bar numbers"], ["Use one-line division by two-figure divisors", "Control remainder strategy deliberately", "Handle advanced division with flag and bar digits"])
];
const NEET_PHYSICS_FALLBACK_CHAPTERS: TutorChapter[] = [
  makeChapter(
    "PHY_CH1",
    "Chapter 1: Physical World and Measurement",
    30,
    ["Units and dimensions", "Significant figures", "Error analysis", "Numerical practice"],
    ["Understand SI units", "Apply dimensional analysis", "Solve measurement questions"]
  )
];
const NEET_CHEMISTRY_FALLBACK_CHAPTERS: TutorChapter[] = [
  makeChapter(
    "CHEM_CH1",
    "Chapter 1: Some Basic Concepts of Chemistry",
    30,
    ["Mole concept", "Atomic/molecular mass", "Stoichiometry", "Concentration terms"],
    ["Use mole relationships", "Balance reactions", "Solve stoichiometry numericals"]
  )
];
const NEET_BIOLOGY_FALLBACK_CHAPTERS: TutorChapter[] = [
  makeChapter(
    "BIO_CH1",
    "Chapter 1: The Living World",
    30,
    ["Characteristics of life", "Taxonomic hierarchy", "Binomial nomenclature", "Examples and practice"],
    ["Identify living characteristics", "Classify organisms", "Use taxonomy terms correctly"]
  )
];
const APTITUDE_REASONING_FALLBACK_CHAPTERS: TutorChapter[] = [
  makeChapter(
    "APT_CH1",
    "Chapter 1: Number Patterns and Logical Reasoning",
    30,
    ["Number series", "Analogies", "Odd-one-out", "Pattern spotting"],
    ["Recognize common aptitude patterns", "Reason through elimination", "Explain the choice clearly"]
  )
];
const FINANCIAL_LITERACY_FALLBACK_CHAPTERS: TutorChapter[] = [
  makeChapter(
    "FIN_CH1",
    "Chapter 1: Money Basics and Budgeting",
    30,
    ["Income and expenses", "Needs vs wants", "Savings habits", "Simple budgeting"],
    ["Track money decisions", "Build a simple budget", "Choose financially sound actions"]
  )
];
const DEFAULT_CHAPTERS_BY_COURSE: Record<string, TutorChapter[]> = {
  vedic_math: DEFAULT_CHAPTERS,
  neet_physics: NEET_PHYSICS_FALLBACK_CHAPTERS,
  neet_chemistry: NEET_CHEMISTRY_FALLBACK_CHAPTERS,
  neet_biology: NEET_BIOLOGY_FALLBACK_CHAPTERS,
  aptitude_reasoning: APTITUDE_REASONING_FALLBACK_CHAPTERS,
  financial_literacy: FINANCIAL_LITERACY_FALLBACK_CHAPTERS
};

const DEFAULT_EXERCISE_GROUPS: TutorExerciseGroup[] = EX_GROUP_KEYS.map((g) => ({ exerciseGroup: g, title: `Exercise ${g}` }));
const EMPTY_SESSION_PROGRESS: TutorSessionProgress = {
  hearts: 5,
  maxHearts: 5,
  xp: 0,
  streak: 0,
  masteryPct: 0,
  lessonCompletionPct: 0,
  livesDepleted: false,
  canContinue: true,
  activeExerciseGroup: "A",
  reviewQueue: [],
  lessonPath: []
};

function fallbackChaptersForCourse(courseId: string): TutorChapter[] {
  return DEFAULT_CHAPTERS_BY_COURSE[courseId] || DEFAULT_CHAPTERS_BY_COURSE[DEFAULT_COURSE_ID];
}

// ── Debug logging helpers (module-level — stable, no re-render cost) ─────────
const _DBG_COLORS: Record<string, string> = {
  STATE:  "#6366f1",   // indigo  — React state transitions
  FLOW:   "#f59e0b",   // amber   — flow / kickoff / pendingKickoff
  SPEAK:  "#10b981",   // emerald — TTS / voice
  API:    "#3b82f6",   // blue    — fetch calls
  ANSWER: "#ef4444",   // red     — answer evaluation
  FILL:   "#8b5cf6",   // purple  — fill_step interactions
  NAV:    "#06b6d4",   // cyan    — question navigation
};
function _dbg(enabled: boolean, cat: string, ev: string, data?: unknown) {
  if (!enabled) return;
  const color = _DBG_COLORS[cat] ?? "#94a3b8";
  const ts = new Date().toISOString().slice(11, 23);
  if (data !== undefined) {
    console.groupCollapsed(`%c[${ts}][${cat}] ${ev}`, `color:${color};font-weight:700;font-family:monospace`);
    console.log(data);
    console.groupEnd();
  } else {
    console.log(`%c[${ts}][${cat}] ${ev}`, `color:${color};font-weight:700;font-family:monospace`);
  }
}

export default function TutorPage() {
  return (
    <Suspense fallback={<main className="container"><section className="panel">Loading tutor...</section></main>}>
      <TutorContent />
    </Suspense>
  );
}

function TutorContent() {
  const pathname = usePathname();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const gradeFromQuery = (params.get("grade") || params.get("class") || "").trim();
  const studentNameFromQuery = (params.get("studentName") || params.get("learnerName") || "").trim();
  const moduleFromQuery = (params.get("module") || "").trim().toUpperCase();
  const courseIdFromQuery = (params.get("courseId") || "").trim().toLowerCase();
  const enrollmentIdFromQuery = (params.get("enrollmentId") || "").trim();
  const dbCourseIdFromQuery = (params.get("dbCourseId") || "").trim();
  const requestedChapterFromQuery = (params.get("chapterCode") || "").trim();
  const requestedExerciseGroupFromQuery = (params.get("exerciseGroup") || "").trim().toUpperCase();
  const isDemoMode = params.get("demo") === "1";
  const isFreshStart = params.get("fresh") === "1";
  const returnUrl = (params.get("returnUrl") || params.get("backUrl") || "").trim();
  const requestedCourseId = courseIdFromQuery || MODULE_TO_COURSE_ID[moduleFromQuery] || DEFAULT_COURSE_ID;
  const requestedFallbackChapters = fallbackChaptersForCourse(requestedCourseId);
  const defaultRequestedChapter = requestedChapterFromQuery || requestedFallbackChapters[0].chapterCode;
  const defaultRequestedExerciseGroup = requestedExerciseGroupFromQuery || "A";

  // ── Debug mode: add ?debug=1 to URL, or run localStorage.setItem('aiTutorDebug','1') in console ──
  const debugMode = params.get("debug") === "1" ||
    (typeof window !== "undefined" && window.localStorage?.getItem("aiTutorDebug") === "1");
  // Short helper — stable ref to module fn, plus debugMode flag bound in closure
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dbg = (cat: string, ev: string, data?: unknown) => _dbg(debugMode, cat, ev, data);

  // Scope bookmark to the specific user — prevents one student loading another's saved session
  const jwtUserId = useMemo(() => {
    const payload = decodeJwtPayload(token);
    if (!payload) return "";
    // child_id takes priority (student), fall back to user_id
    const uid = payload.child_id ?? payload.user_id ?? payload.sub ?? "";
    return String(uid).trim();
  }, [token]);
  const resumeStorageKey = jwtUserId
    ? `aiTutorResume:${requestedCourseId}:${jwtUserId}`
    : `aiTutorResume:${requestedCourseId}`;

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [classStartedAt, setClassStartedAt] = useState<number | null>(null);
  const [classElapsedSec, setClassElapsedSec] = useState(0);
  const [courseId, setCourseId] = useState(requestedCourseId);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonGradeBand, setLessonGradeBand] = useState("");
  const [lessonSource, setLessonSource] = useState("");
  const [lessonEstimatedMinutes, setLessonEstimatedMinutes] = useState(0);
  const [lessonSubtopics, setLessonSubtopics] = useState<string[]>([]);
  const [lessonLearningGoals, setLessonLearningGoals] = useState<string[]>([]);
  const [lessonExerciseCoverage, setLessonExerciseCoverage] = useState<string[]>([]);
  const [lessonExerciseFlow, setLessonExerciseFlow] = useState<Array<{ exerciseGroup: string; subtopic: string }>>([]);
  const [lessonTeachingScript, setLessonTeachingScript] = useState<TutorTeachingStep[]>([]);
  const [lessonScreenplay, setLessonScreenplay] = useState<TutorScreenplayBeat[]>([]);
  const [lessonDuolingoArc, setLessonDuolingoArc] = useState<TutorDuolingoLessonArc | null>(null);
  const [lessonAssetItems, setLessonAssetItems] = useState<TutorAssetItem[]>([]);
  const [sessionProgress, setSessionProgress] = useState<TutorSessionProgress>(EMPTY_SESSION_PROGRESS);
  const [coreIdeas, setCoreIdeas] = useState<string[]>([]);
  const [dbCourseId, setDbCourseId] = useState(dbCourseIdFromQuery);

  const [chapters, setChapters] = useState<TutorChapter[]>(requestedFallbackChapters);
  const [exerciseGroups, setExerciseGroups] = useState<TutorExerciseGroup[]>(DEFAULT_EXERCISE_GROUPS);
  const [selectedChapter, setSelectedChapter] = useState(defaultRequestedChapter);
  const [activeChapter, setActiveChapter] = useState(defaultRequestedChapter);
  const [selectedExerciseGroup, setSelectedExerciseGroup] = useState(defaultRequestedExerciseGroup);
  const [activeExerciseGroup, setActiveExerciseGroup] = useState(defaultRequestedExerciseGroup);
  const [studentName, setStudentName] = useState("");
  const [demoGrade, setDemoGrade] = useState("8");
  const [knownLanguage, setKnownLanguage] = useState<KnownLanguage>("english");
  const [learnerLevel, setLearnerLevel] = useState<LearnerLevel>("beginner");
  const [learnerGoal, setLearnerGoal] = useState<LearnerGoal>("school");
  const [savedBookmark, setSavedBookmark] = useState<SavedTutorBookmark | null>(null);

  const [question, setQuestion] = useState<TutorQuestion | null>(null);
  const [questionShownAt, setQuestionShownAt] = useState(0);
  const [answer, setAnswer] = useState("");
  const [lastAnswerMode, setLastAnswerMode] = useState<"typed" | "voice">("typed");
  const [confidence, setConfidence] = useState<Confidence>("medium");
  const [check, setCheck] = useState<TutorCheckResponse | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationPhrase, setCelebrationPhrase] = useState<{ emoji: string; text: string }>({ emoji: "🌟", text: "Brilliant!" });
  const [doubt, setDoubt] = useState("");
  const [doubtReply, setDoubtReply] = useState("");
  const [conversationLog, setConversationLog] = useState<ConversationTurn[]>([]);
  const [score, setScore] = useState({ attempts: 0, correctCount: 0, accuracyPct: 0 });
  const [attemptByQuestion, setAttemptByQuestion] = useState<Record<string, { correct: boolean; confidence: Confidence }>>({});
  const [flowState, setFlowState] = useState<TutorOrchestratorState>("boot");
  const [flowVersion, setFlowVersion] = useState(0);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [showLessonComplete, setShowLessonComplete] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showPurchaseCta, setShowPurchaseCta] = useState(false);

  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATARS[0].id);
  const [teachingPace, setTeachingPace] = useState<"relaxed" | "normal" | "quick">("normal");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micPermission, setMicPermission] = useState<MicPermission>("unknown");
  const [isTeachingBoard, setIsTeachingBoard] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCue, setCurrentCue] = useState<string>("explain");
  const [isListening, setIsListening] = useState(false);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);
  const [awaitingStudentResponse, setAwaitingStudentResponse] = useState(false);
  const [pendingContinue, setPendingContinue] = useState(false);
  const [autoTeachEnabled, setAutoTeachEnabled] = useState(true);
  const [pendingKickoff, setPendingKickoff] = useState<"none" | "welcome" | "teach">("none");
  const [pendingKickoffToken, setPendingKickoffToken] = useState("");
  const [teacherUtterance, setTeacherUtterance] = useState("");
  const [boardSteps, setBoardSteps] = useState<SvgBoardStep[]>([]);
  const [boardRunId, setBoardRunId] = useState(0);
  const [boardSpeed, setBoardSpeed] = useState(1);

  // ── Rich question type state ─────────────────────────────────────────────
  const [selectedMcqIndex, setSelectedMcqIndex] = useState<number | null>(null);
  const [fillStepIndex, setFillStepIndex] = useState(0);
  const [fillStepInputs, setFillStepInputs] = useState<string[]>([]);
  const [fillStepResults, setFillStepResults] = useState<boolean[]>([]);
  const [fillStepErrors, setFillStepErrors] = useState<string[]>([]);       // per-step error message
  const [fillStepWrongCounts, setFillStepWrongCounts] = useState<number[]>([]); // wrong attempt count per step

  const boardTimerRef = useRef<number | null>(null);
  const boardWaitResolveRef = useRef<(() => void) | null>(null);
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const listenTimerRef = useRef<number | null>(null);
  const continueTimerRef = useRef<number | null>(null);  // auto-continue after correct answer pause
  const speechRecognitionRef = useRef<any>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);          // shared ctx — iOS safe
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null); // current playing node
  const audioUnlockedRef = useRef(false);
  const speakSeqRef = useRef(0);
  const teachRunRef = useRef(0);
  const teachingLockRef = useRef(false);   // ref-based lock so teachOnBoard guard is never stale
  const kickoffRunningRef = useRef(false);
  const lastKickoffTokenRef = useRef("");
  const checkAnswerInFlightRef = useRef(false); // sync guard — prevents double-submit race condition
  const autoListenQuestionRef = useRef("");
  const silenceRecoveryQuestionRef = useRef("");
  const silenceRecoveryMsRef = useRef(12000);  // updated by BehaviorClassifier via check-answer
  const speakRef = useRef<(text: string, opts?: { noUtterance?: boolean }) => Promise<void>>(async () => {});
  const teachOnBoardRef = useRef<() => Promise<void>>(async () => {});
  const sessionRecoveryRef = useRef(false);

  const canStart = useMemo(() => token.trim().length > 20 && (!isDemoMode || studentName.trim().length > 0), [token, isDemoMode, studentName]);
  const launchTokenGrade = useMemo(() => {
    const payload = decodeJwtPayload(token);
    return normalizeGradeValue(gradeFromQuery) ?? normalizeGradeValue(payload?.grade);
  }, [gradeFromQuery, token]);
  const chapterList = chapters.length ? chapters : requestedFallbackChapters;
  const exerciseList = exerciseGroups.length ? exerciseGroups : DEFAULT_EXERCISE_GROUPS;
  const courseLabel = useMemo(() => toCourseLabel(courseId || requestedCourseId), [courseId, requestedCourseId]);
  const parsedLessonGradeBand = useMemo(() => parseGradeBand(lessonGradeBand), [lessonGradeBand]);
  const learnerGrade = useMemo(
    () => launchTokenGrade ?? parsedLessonGradeBand.min,
    [launchTokenGrade, parsedLessonGradeBand.min]
  );
  const isJuniorLayout = useMemo(() => {
    if (learnerGrade !== null) {
      return learnerGrade <= 6;
    }
    return parsedLessonGradeBand.max !== null ? parsedLessonGradeBand.max <= 6 : false;
  }, [learnerGrade, parsedLessonGradeBand.max]);
  const isLearnRoute = (pathname || "").includes("/ai-tutor/learn");
  const minimalDuolingoLayout = isLearnRoute || isJuniorLayout;
  const learnerLabel = useMemo(() => {
    if (learnerGrade !== null) {
      return `Grade ${learnerGrade}`;
    }
    return parsedLessonGradeBand.label || (isJuniorLayout ? "Grades 4-6" : "Grades 7-9");
  }, [learnerGrade, parsedLessonGradeBand.label, isJuniorLayout]);
  const workspaceLabel = minimalDuolingoLayout ? "Guided Mission" : "Focus Workspace";
  const onboardingConfidence: Confidence =
    learnerLevel === "beginner" ? "low" : learnerLevel === "confident" ? "high" : "medium";
  const classElapsedLabel = useMemo(() => formatElapsedLabel(classElapsedSec), [classElapsedSec]);
  const missionPoints = useMemo(
    () => sessionProgress.xp + score.correctCount * 5 + Math.max(0, sessionProgress.streak - 1) * 3,
    [score.correctCount, sessionProgress.streak, sessionProgress.xp]
  );
  const nextRewardXp = useMemo(() => {
    const current = Math.max(sessionProgress.xp, 0);
    return Math.ceil((current + 1) / 50) * 50;
  }, [sessionProgress.xp]);
  const missionBadges = useMemo(
    () => [
      {
        icon: "STAR",
        title: "Streak Star",
        note: sessionProgress.streak >= 3 ? `${sessionProgress.streak} in a row` : "Keep the streak alive",
        active: sessionProgress.streak >= 1
      },
      {
        icon: "HEART",
        title: "Heart Hero",
        note: sessionProgress.hearts >= Math.max(1, Math.ceil(sessionProgress.maxHearts / 2)) ? "Strong focus today" : "Refill with a review round",
        active: sessionProgress.hearts > 0
      },
      {
        icon: "BRAIN",
        title: "Brain Boost",
        note: sessionProgress.masteryPct >= 70 ? `${sessionProgress.masteryPct}% mastery` : "Every correct answer grows mastery",
        active: sessionProgress.masteryPct >= 40
      },
      {
        icon: "MEDAL",
        title: "Mission Medal",
        note: sessionProgress.lessonCompletionPct >= 60 ? "Almost there" : "Finish the lesson path",
        active: sessionProgress.lessonCompletionPct >= 25
      }
    ],
    [
      sessionProgress.hearts,
      sessionProgress.lessonCompletionPct,
      sessionProgress.masteryPct,
      sessionProgress.maxHearts,
      sessionProgress.streak
    ]
  );
  const activeMissionBadges = missionBadges.filter((badge) => badge.active);
  const onboardingLevelChoices = useMemo(
    () => (lessonDuolingoArc?.onboarding?.learnerLevelOptions?.length === 3
      ? lessonDuolingoArc.onboarding.learnerLevelOptions
      : [LEARNER_LEVEL_LABELS.beginner, LEARNER_LEVEL_LABELS.familiar, LEARNER_LEVEL_LABELS.confident]),
    [lessonDuolingoArc]
  );
  const onboardingGoalChoices = useMemo(
    () => (lessonDuolingoArc?.onboarding?.goalOptions?.length === 3
      ? lessonDuolingoArc.onboarding.goalOptions
      : [LEARNER_GOAL_LABELS.school, LEARNER_GOAL_LABELS.speed, LEARNER_GOAL_LABELS.exam]),
    [lessonDuolingoArc]
  );
  const effectiveDbCourseId = useMemo(() => {
    const raw = (dbCourseId || "").trim();
    if (!raw) return "";
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? String(Math.trunc(n)) : "";
  }, [dbCourseId]);
  const courseMonitorUrl = useMemo(() => {
    if (!effectiveDbCourseId || !enrollmentIdFromQuery) {
      return "";
    }
    return `/course/monitor/v2?courseId=${encodeURIComponent(effectiveDbCourseId)}&enrollmentId=${encodeURIComponent(enrollmentIdFromQuery)}`;
  }, [effectiveDbCourseId, enrollmentIdFromQuery]);

  const previewChapter = useMemo(() => {
    const code = status === "ready" ? activeChapter : selectedChapter;
    return chapterList.find((c) => c.chapterCode === code) || chapterList[0];
  }, [status, activeChapter, selectedChapter, chapterList]);
  const missionTitle = lessonDuolingoArc?.mission?.missionTitle || lessonTitle || previewChapter?.title || activeChapter;

  const activeAvatar = useMemo(
    () => AVATARS.find((a) => a.id === selectedAvatarId) || AVATARS[0],
    [selectedAvatarId]
  );
  const visibleTeachingScript = useMemo(() => {
    if (lessonTeachingScript.length) {
      return lessonTeachingScript;
    }
    const fallbackFlow = lessonExerciseFlow.length
      ? lessonExerciseFlow
      : (previewChapter?.exerciseFlow || []);
    return fallbackFlow.map((item) => ({
      stepId: `fallback_${item.exerciseGroup}`,
      exerciseGroup: item.exerciseGroup,
      subtopic: item.subtopic,
      boardMode: item.subtopic.toLowerCase().includes("circle") ? "svg" : "free_draw",
      teacherLine: `Let us learn ${item.subtopic} in a guided way.`,
      boardAction: "Teacher writes one step and pauses for student response.",
      checkpointPrompt: `Can you explain the first step of ${item.subtopic}?`,
      microPractice: `Practice one quick question from Exercise ${item.exerciseGroup}.`
    })) as TutorTeachingStep[];
  }, [lessonTeachingScript, lessonExerciseFlow, previewChapter]);
  const lessonPath = useMemo(() => {
    if (sessionProgress.lessonPath.length) return sessionProgress.lessonPath;
    const flow = lessonExerciseFlow.length ? lessonExerciseFlow : (previewChapter?.exerciseFlow || []);
    return flow.map((item) => ({
      exerciseGroup: item.exerciseGroup,
      subtopic: item.subtopic,
      status: item.exerciseGroup === activeExerciseGroup ? "active" : "locked",
      attempts: 0,
      correctCount: 0,
      accuracyPct: 0
    }));
  }, [sessionProgress.lessonPath, lessonExerciseFlow, previewChapter, activeExerciseGroup]);
  const canAttemptAnswer = useMemo(
    () => sessionProgress.canContinue && !sessionProgress.livesDepleted,
    [sessionProgress]
  );
  const activeTeachingStep = useMemo(() => {
    if (!question) return null;
    const exact = visibleTeachingScript.find((s) => s.exerciseGroup === question.exerciseGroup);
    if (exact) return exact;
    return visibleTeachingScript.find(
      (s) => s.subtopic.trim().toLowerCase() === (question.subtopic || "").trim().toLowerCase()
    ) || null;
  }, [visibleTeachingScript, question]);
  const activeDuolingoStep = useMemo(
    () => lessonDuolingoArc?.sessionFlow?.find((step) => step.exerciseGroup === activeExerciseGroup) || null,
    [lessonDuolingoArc, activeExerciseGroup]
  );
  const rewardXpLeft = useMemo(
    () => Math.max(0, nextRewardXp - sessionProgress.xp),
    [nextRewardXp, sessionProgress.xp]
  );
  const doubtTurns = useMemo(
    () => conversationLog.filter((turn) => turn.channel === "doubt"),
    [conversationLog]
  );
  const activeLessonStepIndex = useMemo(() => {
    const index = lessonPath.findIndex((item) => item.exerciseGroup === activeExerciseGroup);
    return index >= 0 ? index : 0;
  }, [lessonPath, activeExerciseGroup]);
  const lessonGroupOrder = useMemo(() => {
    const pathGroups = lessonPath.map((item) => item.exerciseGroup);
    const flowGroups = lessonExerciseFlow.map((item) => item.exerciseGroup);
    const catalogGroups = exerciseGroups.map((item) => item.exerciseGroup);
    const ordered = (flowGroups.length ? flowGroups : catalogGroups.length ? catalogGroups : pathGroups.length ? pathGroups : EX_GROUP_KEYS)
      .map((value) => String(value || "").trim())
      .filter(Boolean);
    return [...new Set(ordered)];
  }, [exerciseGroups, lessonExerciseFlow, lessonPath]);
  const missionPrompt =
    teacherUtterance ||
    activeDuolingoStep?.coachHook ||
    activeTeachingStep?.teacherLine ||
    "Let's win this step.";
  const missionPromise =
    lessonDuolingoArc?.mission?.missionPromise ||
    lessonLearningGoals[0] ||
    "Learn one small Vedic Math step at a time.";
  const missionCelebration =
    lessonDuolingoArc?.mission?.successCelebration ||
    "Great work. Collect your reward and move to the next step.";
  const missionReadPrompt =
    question?.questionText ||
    activeDuolingoStep?.readAloudPrompt ||
    "Listen to the question.";
  const missionTryPrompt =
    activeDuolingoStep?.tryPrompt ||
    "Try this one on your own now.";
  const missionHintPrompt =
    activeDuolingoStep?.reviewPrompt ||
    question?.hint ||
    `Use the method ${activeAvatar.name} just showed you.`;
  const rewardUnitPrompt =
    lessonDuolingoArc?.rewardLoop?.xpUnit ||
    "Earn XP on each step and keep your streak alive.";
  const rewardCelebrationPrompt =
    lessonDuolingoArc?.rewardLoop?.celebrationStyle ||
    "Short praise and visible progress after every correct answer.";
  const reviewLoopPrompt =
    lessonDuolingoArc?.reviewLoop?.trigger ||
    `If you get stuck, ${activeAvatar.name} will reopen the pattern with one smaller step.`;
  const reviewPracticePrompt =
    lessonDuolingoArc?.reviewLoop?.practiceStyle ||
    missionHintPrompt;
  const activeUiPanels = useMemo(
    () => new Set((lessonDuolingoArc?.uiDirectives?.secondaryPanels || []).map((panel) => panel.trim().toLowerCase())),
    [lessonDuolingoArc]
  );
  const showLessonPathRail = activeUiPanels.size === 0 || activeUiPanels.has("lesson path rail");
  const showWorkedBoardSupport = activeUiPanels.size === 0 || activeUiPanels.has("worked board");
  const showHelpDrawer = activeUiPanels.size === 0 || activeUiPanels.has("help drawer");
  const hasAnswerReadyQuestion = !!question && !isLoadingNextQuestion && canAttemptAnswer && !sessionProgress.livesDepleted && !isTeachingBoard && !isSpeaking && !isEvaluatingAnswer && !isListening;
  const missionStatusLabel = useMemo(() => {
    if (sessionProgress.livesDepleted) {
      return "Review to refill hearts";
    }
    if (isLoadingNextQuestion) {
      return "Loading next question";
    }
    if (awaitingStudentResponse || hasAnswerReadyQuestion) {
      return "Your turn";
    }
    if (check?.correct) {
      return "Great job";
    }
    if (isTeachingBoard || isSpeaking) {
      return "Coach is guiding";
    }
    return "Ready for the next step";
  }, [awaitingStudentResponse, hasAnswerReadyQuestion, check?.correct, isLoadingNextQuestion, isSpeaking, isTeachingBoard, sessionProgress.livesDepleted]);
  const activeAttempt = useMemo(() => {
    if (!question) return null;
    return attemptByQuestion[question.questionId] || null;
  }, [attemptByQuestion, question]);
  const isFirstScene = useMemo(
    () => !!question && score.attempts === 0 && !activeAttempt,
    [question, score.attempts, activeAttempt]
  );
  const screenplayMode: ScreenplayMode = useMemo(() => {
    if (!activeAttempt) return "core";
    if (!activeAttempt.correct) return "remedial";
    if (activeAttempt.confidence === "high") return "challenge";
    return "core";
  }, [activeAttempt]);
  const activeScreenplayBeats = useMemo(() => {
    if (!question) return [];
    const raw = lessonScreenplay
      .filter((beat) => beat.exerciseGroup === question.exerciseGroup)
      .sort((a, b) => a.sequence - b.sequence);
    if (!raw.length) return raw;

    const confidenceRank: Record<Confidence, number> = { low: 0, medium: 1, high: 2 };
    const activeConfidence = activeAttempt?.confidence || confidence;
    const currentRank = confidenceRank[activeConfidence];
    const currentCorrect = activeAttempt?.correct;

    const gated = raw.filter((beat) => {
      if (beat.useWhenCorrect === true && currentCorrect !== true) return false;
      if (beat.useWhenIncorrect === true && currentCorrect !== false) return false;
      if (beat.minConfidence && currentRank < confidenceRank[beat.minConfidence]) return false;
      if (beat.maxConfidence && currentRank > confidenceRank[beat.maxConfidence]) return false;
      return true;
    });
    if (!gated.length) return raw;

    const core = gated.filter((beat) => !beat.performanceTag || beat.performanceTag === "core");
    let selected: TutorScreenplayBeat[] = [];
    if (screenplayMode === "core") {
      selected = core.length ? core : gated;
    } else {
      const modeSpecific = gated.filter((beat) => beat.performanceTag === screenplayMode);
      if (!modeSpecific.length) {
        selected = core.length ? core : gated;
      } else {
        const pickedByCue = new Map<string, TutorScreenplayBeat>();
        for (const beat of core) {
          if (!pickedByCue.has(beat.cue)) {
            pickedByCue.set(beat.cue, beat);
          }
        }
        for (const beat of modeSpecific) {
          pickedByCue.set(beat.cue, beat);
        }
        const merged = [...pickedByCue.values()].sort((a, b) => a.sequence - b.sequence);
        selected = merged.length ? merged : gated;
      }
    }

    const ordered: TutorScreenplayBeat[] = [];
    const usedBeatIds = new Set<string>();
    for (const cue of TEACHING_CUE_ORDER) {
      const match =
        selected.find((beat) => beat.cue === cue)
        || gated.find((beat) => beat.cue === cue)
        || raw.find((beat) => beat.cue === cue);
      if (!match || usedBeatIds.has(match.beatId)) continue;
      ordered.push(match);
      usedBeatIds.add(match.beatId);
    }

    for (const beat of selected) {
      if (usedBeatIds.has(beat.beatId)) continue;
      ordered.push(beat);
      usedBeatIds.add(beat.beatId);
    }

    return ordered.length ? ordered : selected;
  }, [lessonScreenplay, question, activeAttempt, confidence, screenplayMode]);
  // Always show both panels: board above for teaching, question card below for answering
  const showExercisePanel = true;
  const showBoardPanel = useMemo(() => boardSteps.length > 0, [boardSteps]);

  const stageStatusText = useMemo(() => {
    if (isTeachingBoard) return "Teaching on whiteboard...";
    if (isEvaluatingAnswer) return "Evaluating your answer...";
    if (isLoadingNextQuestion) return "Preparing your next challenge…";
    if (isSpeaking) return "Speaking live...";
    if (isListening) return "Listening to your answer...";
    if (awaitingStudentResponse || hasAnswerReadyQuestion) {
      return micPermission === "denied"
        ? "Your turn now: type your answer and click Check Answer."
        : "Your turn now: answer by voice or text.";
    }
    return "Ready for next step.";
  }, [isTeachingBoard, isEvaluatingAnswer, isLoadingNextQuestion, isSpeaking, isListening, awaitingStudentResponse, hasAnswerReadyQuestion, micPermission]);
  // "coach" only when the coach is actively teaching or loading — not while just reading the question
  // aloud to a student who already has control (awaitingStudentResponse / evaluating / answered).
  const studentHasControl = awaitingStudentResponse || isListening || isEvaluatingAnswer || !!check || hasAnswerReadyQuestion;
  const stageSceneMode = (isTeachingBoard || isLoadingNextQuestion || (pendingKickoff !== "none" && pendingKickoff !== "teach") || (isSpeaking && !studentHasControl))
    ? "coach"
    : studentHasControl
      ? "student"
      : "coach";
  const showInlineBoard = showBoardPanel && stageSceneMode === "coach";

  // ── Debug: state-change watchers ────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dbg("STATE", `stageSceneMode → ${stageSceneMode}`, { isSpeaking, studentHasControl, isTeachingBoard, isLoadingNextQuestion, pendingKickoff, awaitingStudentResponse }); }, [stageSceneMode]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dbg("NAV",   `question → ${question?.questionId ?? "null"}`, { type: question?.questionType, text: question?.questionText?.slice(0, 80) }); }, [question?.questionId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dbg("SPEAK", `isSpeaking → ${isSpeaking}`); }, [isSpeaking]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dbg("STATE", `awaitingStudentResponse → ${awaitingStudentResponse}`); }, [awaitingStudentResponse]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dbg("FLOW",  `flowState → ${flowState}`); }, [flowState]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dbg("FLOW",  `pendingKickoff → ${pendingKickoff}`); }, [pendingKickoff]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (teacherUtterance) dbg("SPEAK", `teacherUtterance set → "${teacherUtterance.slice(0, 80)}"`); }, [teacherUtterance]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dbg("STATE", `isEvaluatingAnswer → ${isEvaluatingAnswer}`); }, [isEvaluatingAnswer]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dbg("STATE", `isLoadingNextQuestion → ${isLoadingNextQuestion}`); }, [isLoadingNextQuestion]);
  // ────────────────────────────────────────────────────────────────────────────

  const lessonListenLine = useMemo(() => {
    if (!question) return missionReadPrompt;
    if (stageSceneMode === "coach") return missionReadPrompt;
    return `${question.questionText}. ${missionHintPrompt}`;
  }, [missionHintPrompt, missionReadPrompt, question, stageSceneMode]);

  const conversationInsights = useMemo(() => {
    const tutorTurns = conversationLog.filter((t) => t.role === "tutor");
    const studentTurns = conversationLog.filter((t) => t.role === "student");
    const voiceStudentTurns = studentTurns.filter((t) => t.channel === "voice");
    const doubtTurns = studentTurns.filter((t) => t.channel === "doubt");
    const responseGaps: number[] = [];

    for (const sTurn of studentTurns) {
      const prevTutor = [...tutorTurns].reverse().find((t) => t.at < sTurn.at);
      if (prevTutor) {
        responseGaps.push((sTurn.at - prevTutor.at) / 1000);
      }
    }

    const avgResponseSec = responseGaps.length
      ? Math.round(responseGaps.reduce((a, b) => a + b, 0) / responseGaps.length)
      : 0;

    return {
      tutorTurns: tutorTurns.length,
      studentTurns: studentTurns.length,
      voiceStudentTurns: voiceStudentTurns.length,
      doubtTurns: doubtTurns.length,
      avgResponseSec,
    };
  }, [conversationLog]);

  function stopVoicePlayback() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch { /* already stopped */ }
      audioSourceRef.current = null;
    }
    if (activeAudioRef.current) {
      activeAudioRef.current.onplaying = null;
      activeAudioRef.current.onended = null;
      activeAudioRef.current.onerror = null;
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    setIsSpeaking(false);
  }

  function playMotivationSound(kind: "correct" | "wrong" | "streak" | "depleted") {
    if (typeof window === "undefined") return;
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    try {
      const ctx = new AudioCtx() as AudioContext;
      const now = ctx.currentTime;

      // 6 distinct "correct" celebration sounds — picked randomly for variety
      type Note = { hz: number; sec: number; gain: number; type?: OscillatorType; gap?: number };
      const CORRECT_SOUNDS: Note[][] = [
        // 1. Classic rising chime (sine)
        [{ hz: 540, sec: 0.09, gain: 0.32 }, { hz: 720, sec: 0.1, gain: 0.32 }, { hz: 900, sec: 0.13, gain: 0.35 }],
        // 2. Level-up scale (triangle — bright & game-like)
        [{ hz: 392, sec: 0.07, gain: 0.28, type: "triangle" }, { hz: 523, sec: 0.07, gain: 0.28, type: "triangle" },
         { hz: 659, sec: 0.07, gain: 0.28, type: "triangle" }, { hz: 784, sec: 0.14, gain: 0.32, type: "triangle" }],
        // 3. Magic sparkle (fast high notes)
        [{ hz: 660, sec: 0.06, gain: 0.28, gap: 0.01 }, { hz: 880, sec: 0.06, gain: 0.28, gap: 0.01 },
         { hz: 1100, sec: 0.06, gain: 0.28, gap: 0.01 }, { hz: 1320, sec: 0.12, gain: 0.32, gap: 0.01 }],
        // 4. Xylophone pop (triangle, wide jump)
        [{ hz: 880, sec: 0.08, gain: 0.30, type: "triangle" }, { hz: 1108, sec: 0.1, gain: 0.30, type: "triangle" },
         { hz: 1320, sec: 0.14, gain: 0.34, type: "triangle" }],
        // 5. Double-ding bell (two overlapping high notes — bell feel)
        [{ hz: 987, sec: 0.15, gain: 0.30 }, { hz: 1318, sec: 0.15, gain: 0.28, gap: -0.05 }],
        // 6. Joyful 5-note run
        [{ hz: 523, sec: 0.06, gain: 0.28 }, { hz: 587, sec: 0.06, gain: 0.28 }, { hz: 659, sec: 0.06, gain: 0.28 },
         { hz: 784, sec: 0.06, gain: 0.28 }, { hz: 1047, sec: 0.14, gain: 0.35 }],
      ];

      const patterns: Record<string, Note[]> = {
        wrong: [{ hz: 320, sec: 0.1, gain: 0.25 }, { hz: 260, sec: 0.16, gain: 0.25 }],
        streak: [{ hz: 520, sec: 0.07, gain: 0.28, type: "triangle" }, { hz: 660, sec: 0.07, gain: 0.28, type: "triangle" },
                 { hz: 840, sec: 0.07, gain: 0.28, type: "triangle" }, { hz: 1040, sec: 0.07, gain: 0.28, type: "triangle" },
                 { hz: 1320, sec: 0.14, gain: 0.35, type: "triangle" }],
        depleted: [{ hz: 240, sec: 0.14, gain: 0.25 }, { hz: 180, sec: 0.22, gain: 0.25 }],
      };

      const seq = kind === "correct"
        ? CORRECT_SOUNDS[Math.floor(Math.random() * CORRECT_SOUNDS.length)]
        : (patterns[kind] ?? CORRECT_SOUNDS[0]);

      let cursor = now;
      for (const n of seq) {
        cursor += (n.gap ?? 0);          // negative gap allows overlapping notes
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = n.type ?? "sine";
        osc.frequency.setValueAtTime(n.hz, cursor);
        gain.gain.setValueAtTime(0.0001, cursor);
        gain.gain.exponentialRampToValueAtTime(n.gain, cursor + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, cursor + n.sec);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(cursor);
        osc.stop(cursor + n.sec + 0.02);
        cursor += n.sec + (n.gap == null ? 0.02 : 0);
      }
      window.setTimeout(() => { void ctx.close().catch(() => undefined); }, 1200);
    } catch {
      // sound effects are optional
    }
  }

  function clearListenTimeout() {
    if (listenTimerRef.current) {
      window.clearTimeout(listenTimerRef.current);
      listenTimerRef.current = null;
    }
  }

  function stopListeningSession() {
    clearListenTimeout();
    const recog = speechRecognitionRef.current;
    speechRecognitionRef.current = null;
    if (recog && typeof recog.stop === "function") {
      try {
        recog.stop();
      } catch {
        // ignore stop failure
      }
    }
    setIsListening(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const response = await fetch(`/api/vedic/catalog?courseId=${encodeURIComponent(requestedCourseId)}`, { cache: "no-store" });
        const data: TutorCatalogResponse & { error?: string } = await response.json();
        if (!response.ok || data.error || cancelled) {
          return;
        }

        if (data.courseId) {
          setCourseId(data.courseId);
        }
        if (data.chapters?.length) {
          setChapters(data.chapters);
        }
        if (data.exerciseGroups?.length) {
          setExerciseGroups(data.exerciseGroups);
        }

        let storedBookmark = null;
        if (typeof window !== "undefined") {
          try {
            // If ?fresh=1 is in the URL, wipe any saved bookmark so we always
            // start a brand-new session (useful for demo share links).
            if (isFreshStart) {
              window.localStorage.removeItem(resumeStorageKey);
            }
            const rawBookmark = isFreshStart ? null : window.localStorage.getItem(resumeStorageKey);
            storedBookmark = rawBookmark ? JSON.parse(rawBookmark) : null;
          } catch {
            storedBookmark = null;
          }
        }

        const availableChapterCodes = new Set((data.chapters || []).map((chapter) => chapter.chapterCode));
        const preferredChapterCode = storedBookmark?.chapterCode || requestedChapterFromQuery || data.defaultChapterCode || data.chapters?.[0]?.chapterCode;
        if (preferredChapterCode && availableChapterCodes.has(preferredChapterCode)) {
          setSelectedChapter(preferredChapterCode);
          setActiveChapter(preferredChapterCode);
        }
        const preferredExerciseGroup = storedBookmark?.exerciseGroup || requestedExerciseGroupFromQuery || defaultRequestedExerciseGroup;
        setSelectedExerciseGroup(preferredExerciseGroup);
        setActiveExerciseGroup(preferredExerciseGroup);
      } catch {
        // fallback to defaults
      }
    }

    loadCatalog();
    return () => {
      cancelled = true;
      if (boardTimerRef.current) {
        window.clearTimeout(boardTimerRef.current);
        boardTimerRef.current = null;
      }
      if (boardWaitResolveRef.current) {
        boardWaitResolveRef.current();
        boardWaitResolveRef.current = null;
      }
      stopListeningSession();
      stopVoicePlayback();
    };
  }, [defaultRequestedExerciseGroup, requestedChapterFromQuery, requestedCourseId, requestedExerciseGroupFromQuery, resumeStorageKey]);

  useEffect(() => {
    if (!voiceEnabled) {
      stopVoicePlayback();
    }
  }, [voiceEnabled]);

  // ── Start-screen welcome greeting fires inside unlockAudio() ──
  // (must be inside a user-gesture handler — Chrome/iOS block autoplay on mount)

  useEffect(() => {
    if (!classStartedAt) {
      setClassElapsedSec(0);
      return;
    }
    setClassElapsedSec(Math.max(0, Math.floor((Date.now() - classStartedAt) / 1000)));
    const id = window.setInterval(() => {
      setClassElapsedSec(Math.max(0, Math.floor((Date.now() - classStartedAt) / 1000)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [classStartedAt]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Demo + fresh: clear any saved name so the student types their own
    if (isDemoMode) {
      try { window.localStorage.removeItem("aiTutorStudentName"); } catch { /* ignore */ }
    }
    if (studentNameFromQuery) {
      setStudentName(studentNameFromQuery);
      window.localStorage.setItem("aiTutorStudentName", studentNameFromQuery);
      return;
    }
    const storedName = window.localStorage.getItem("aiTutorStudentName") || "";
    if (storedName) {
      setStudentName(storedName);
    }
  }, [studentNameFromQuery]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // ?fresh=1 → never show the "resume saved place" card
    if (isFreshStart) {
      window.localStorage.removeItem(resumeStorageKey);
      setSavedBookmark(null);
      return;
    }
    try {
      const rawBookmark = window.localStorage.getItem(resumeStorageKey);
      if (!rawBookmark) {
        setSavedBookmark(null);
        return;
      }
      const parsed = JSON.parse(rawBookmark) as Partial<SavedTutorBookmark>;
      if (!parsed || typeof parsed !== "object" || !parsed.chapterCode || !parsed.exerciseGroup) {
        setSavedBookmark(null);
        return;
      }
      setSavedBookmark({
        sessionId: String(parsed.sessionId || ""),
        courseId: String(parsed.courseId || requestedCourseId),
        chapterCode: String(parsed.chapterCode),
        exerciseGroup: String(parsed.exerciseGroup),
        lessonTitle: String(parsed.lessonTitle || ""),
        questionId: String(parsed.questionId || ""),
        elapsedSec: Number(parsed.elapsedSec || 0),
        savedAt: Number(parsed.savedAt || 0),
      });
    } catch {
      setSavedBookmark(null);
    }
  }, [isFreshStart, requestedCourseId, resumeStorageKey]);
  useEffect(() => {
    setConfidence(onboardingConfidence);
  }, [onboardingConfidence]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value = studentName.trim();
    if (value) {
      window.localStorage.setItem("aiTutorStudentName", value);
    }
  }, [studentName]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const permissionsApi = (navigator as any)?.permissions;
    if (!permissionsApi?.query) {
      setMicPermission("unsupported");
      return;
    }

    let disposed = false;
    let permissionStatus: any = null;

    permissionsApi
      .query({ name: "microphone" })
      .then((status: any) => {
        if (disposed) return;
        permissionStatus = status;
        const next = String(status?.state || "unknown");
        if (next === "granted" || next === "prompt" || next === "denied") {
          setMicPermission(next);
        } else {
          setMicPermission("unknown");
        }
        status.onchange = () => {
          const changed = String(status?.state || "unknown");
          if (changed === "granted" || changed === "prompt" || changed === "denied") {
            setMicPermission(changed);
          } else {
            setMicPermission("unknown");
          }
        };
      })
      .catch(() => {
        if (!disposed) {
          setMicPermission("unknown");
        }
      });

    return () => {
      disposed = true;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  useEffect(() => {
    if (status !== "ready" || !sessionId || typeof window === "undefined") {
      setRealtimeConnected(false);
      return;
    }

    let disposed = false;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://${window.location.host}/ai-tutor-api/tutor/ws/${encodeURIComponent(sessionId)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (!disposed) {
        setRealtimeConnected(true);
      }
    };
    ws.onmessage = (event) => {
      if (disposed) return;
      try {
        const payload = JSON.parse(String(event.data || "{}")) as TutorRealtimeEvent;
        if (payload.state) setFlowState(payload.state);
        if (typeof payload.version === "number") setFlowVersion(payload.version);
      } catch {
        // ignore malformed realtime frame
      }
    };
    ws.onclose = () => {
      if (!disposed) {
        setRealtimeConnected(false);
      }
    };
    ws.onerror = () => {
      if (!disposed) {
        setRealtimeConnected(false);
      }
    };

    return () => {
      disposed = true;
      try {
        ws.close();
      } catch {
        // noop
      }
      setRealtimeConnected(false);
    };
  }, [status, sessionId]);

  useEffect(() => {
    if (status !== "ready" || !sessionId || realtimeConnected) {
      return;
    }
    void refreshFlowState();
    const id = window.setInterval(() => {
      void refreshFlowState();
    }, 4500);
    return () => {
      window.clearInterval(id);
    };
  }, [status, sessionId, realtimeConnected]);

  useEffect(() => {
    if (!awaitingStudentResponse || isListening) return;
    const id = window.setTimeout(() => {
      answerInputRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(id);
  }, [awaitingStudentResponse, isListening]);

  async function speak(text: string, opts?: { noUtterance?: boolean }): Promise<void> {
    // Resolve {{studentName}} template placeholder left in chapter JSON content
    const line = (text || "")
      .replace(/\{\{studentName\}\}/g, (studentName || "").trim() || "friend")
      .trim();
    if (!line) {
      setIsSpeaking(false);
      return;
    }
    dbg("SPEAK", `speak() ← "${line.slice(0, 80)}"`, { voiceEnabled, avatarId: activeAvatar.id, noUtterance: opts?.noUtterance });
    // noUtterance: TTS reads aloud but coach bubble is NOT updated (student already has the question in the panel)
    if (!opts?.noUtterance) setTeacherUtterance(line);
    addConversationTurn("tutor", voiceEnabled ? "voice" : "text", line, { source: "speak" });
    if (!voiceEnabled || typeof window === "undefined") {
      setIsSpeaking(false);
      return;
    }

    speakSeqRef.current += 1;
    const speakSeq = speakSeqRef.current;
    stopVoicePlayback();

    try {
      const ttsPayload = JSON.stringify({
        text: line,
        avatarId: activeAvatar.id,
        languageCode: "en-IN",
        pace: 1.0
      });
      const ttsEndpoints = ["/api/voice/tts"];
      for (const endpoint of ttsEndpoints) {
        const ttsResponse = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: ttsPayload
        });
        const ttsData = await ttsResponse.json().catch(() => null);
        if (!ttsResponse.ok || !ttsData?.audioBase64) {
          continue;
        }
        // ── iOS-safe: AudioContext.decodeAudioData instead of new Audio(dataUri) ──
        // new Audio(dataUri).play() is blocked on iOS Safari after any await.
        // The shared AudioContext stays unlocked after the user-gesture unlock.
        const AudioCtxCls = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext | null = audioCtxRef.current ||
          (AudioCtxCls ? (audioCtxRef.current = new AudioCtxCls()) : null);
        if (ctx) {
          // Resume with a 3s timeout — headless Chromium can hang on ctx.resume()
          // if AudioContext stays suspended (no audio device / autoplay policy).
          if (ctx.state === "suspended") {
            await Promise.race([ctx.resume(), new Promise<void>((r) => setTimeout(r, 3000))]);
          }
          const b64 = ttsData.audioBase64 as string;
          const binStr = atob(b64);
          const bytes = new Uint8Array(binStr.length);
          for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
          const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
          if (speakSeq !== speakSeqRef.current) return; // interrupted mid-decode
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          audioSourceRef.current = source;
          setIsSpeaking(true);
          // Safety timeout: audio duration + 4s buffer. Guards against onended
          // never firing when AudioContext is stuck (headless, no audio device, etc.).
          const playbackTimeoutMs = Math.ceil(audioBuffer.duration * 1000) + 4000;
          await Promise.race([
            new Promise<void>((resolve) => { source.onended = () => resolve(); source.start(0); }),
            new Promise<void>((resolve) => setTimeout(resolve, playbackTimeoutMs)),
          ]);
          audioSourceRef.current = null;
        } else {
          // Fallback for very old browsers without AudioContext
          const mimeType = String(ttsData.mimeType || "audio/wav");
          const audio = new Audio(`data:${mimeType};base64,${ttsData.audioBase64}`);
          activeAudioRef.current = audio;
          await new Promise<void>((resolve, reject) => {
            audio.onplaying = () => { if (speakSeq === speakSeqRef.current) setIsSpeaking(true); };
            audio.onended  = () => { if (speakSeq === speakSeqRef.current) setIsSpeaking(false); resolve(); };
            audio.onerror  = () => { if (speakSeq === speakSeqRef.current) setIsSpeaking(false); reject(new Error("audio error")); };
            void audio.play().catch(reject);
          });
        }
        if (speakSeq === speakSeqRef.current) setIsSpeaking(false);
        return;
      }
    } catch {
      // fallback to browser synthesis below
    }

    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(line);
      // Pick an energetic gender-matched Windows/browser voice as Sarvam fallback.
      // Raj → male  |  Nova, Priya → female
      const isMale = activeAvatar.id === "raj";
      const voices = window.speechSynthesis.getVoices();
      let pick: SpeechSynthesisVoice | null = null;
      if (isMale) {
        pick =
          voices.find(v => /microsoft.*ravi/i.test(v.name))   ||   // Windows en-IN male (best match)
          voices.find(v => /microsoft.*guy/i.test(v.name))    ||   // Windows en-US energetic male
          voices.find(v => /microsoft.*david/i.test(v.name))  ||   // Windows en-US male
          voices.find(v => /google.*uk.*male/i.test(v.name))  ||   // Chrome UK male
          voices.find(v => v.lang === "en-IN" && !/female|heera|zira|eva|aria/i.test(v.name)) ||
          voices.find(v => v.lang.startsWith("en") && !/female|heera|zira|eva|aria/i.test(v.name)) ||
          null;
      } else {
        pick =
          voices.find(v => /microsoft.*heera/i.test(v.name))  ||   // Windows en-IN female (best match)
          voices.find(v => /microsoft.*aria/i.test(v.name))   ||   // Windows en-US natural female
          voices.find(v => /microsoft.*eva/i.test(v.name))    ||   // Windows en-US female
          voices.find(v => /microsoft.*zira/i.test(v.name))   ||   // Windows en-US female
          voices.find(v => /google.*uk.*female/i.test(v.name))||   // Chrome UK female
          voices.find(v => v.lang === "en-IN" && /female|heera|priya/i.test(v.name)) ||
          voices.find(v => v.lang === "en-IN") ||
          voices.find(v => v.lang.startsWith("en") && /female|zira|aria|eva|heera/i.test(v.name)) ||
          null;
      }
      if (pick) utter.voice = pick;
      // Energetic settings — lively pace for Grade 4-8 students
      utter.rate  = isMale ? 1.1 : 1.08;   // slightly faster than default
      utter.pitch = isMale ? 0.95 : 1.12;  // male: slightly deeper; female: brighter
      await new Promise<void>((resolve) => {
        utter.onstart = () => {
          if (speakSeq === speakSeqRef.current) {
            setIsSpeaking(true);
          }
        };
        utter.onend = () => {
          if (speakSeq === speakSeqRef.current) {
            setIsSpeaking(false);
          }
          resolve();
        };
        utter.onerror = () => {
          if (speakSeq === speakSeqRef.current) {
            setIsSpeaking(false);
          }
          resolve();
        };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      });
      if (speakSeq === speakSeqRef.current) {
        setIsSpeaking(false);
      }
      return;
    }

    setIsSpeaking(false);
  }

  function hashSeed(text: string): number {
    let h = 0;
    for (let i = 0; i < text.length; i += 1) {
      h = (h * 31 + text.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function pickLine(lines: string[], seed: number): string {
    if (!lines.length) return "";
    return lines[seed % lines.length];
  }

  function toChatStylePrompt(q: TutorQuestion): string {
    const seed = hashSeed(`${q.questionId}_${activeAvatar.id}`);
    const lead = pickLine(
      [
        "Nice, let's tackle this together.",
        "Good one, we'll break this into easy steps.",
        "Let's do this like a classroom problem.",
        "Perfect practice question. We'll solve it smoothly."
      ],
      seed
    );
    const close = pickLine(
      [
        "Tell me your first move after the board demo.",
        "Watch the board once, then you try.",
        "I will pause for your step right after this.",
        "After this, your turn to explain the next step."
      ],
      seed + 5
    );
    return `${lead} ${q.questionText} ${close}`;
  }

  function splitText(text: string, chunk = 64): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const w of words) {
      const next = current ? `${current} ${w}` : w;
      if (next.length > chunk) {
        if (current) lines.push(current);
        current = w;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function compactText(text: string, max = 72): string {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    if (clean.length <= max) return clean;
    return `${clean.slice(0, Math.max(0, max - 1)).trimEnd()}...`;
  }

  function normalizeSvgBoardSteps(raw?: unknown): SvgBoardStep[] {
    if (!Array.isArray(raw)) return [];
    const normalized: SvgBoardStep[] = [];
    for (const entry of (raw as unknown[]).slice(0, 24)) {
      const item = entry as any;
      if (!item || typeof item !== "object") continue;
      if (item.kind === "line") {
        normalized.push({
          kind: "line",
          id: String(item.id || `line_${normalized.length + 1}`),
          x1: Number(item.x1 ?? 420),
          y1: Number(item.y1 ?? 96),
          x2: Number(item.x2 ?? 620),
          y2: Number(item.y2 ?? 96),
          color: item.color || "#0ea5e9",
          width: Number(item.width ?? 2),
          delaySec: Math.max(0, Number(item.delaySec ?? 0)),
          durationSec: Math.max(0.1, Number(item.durationSec ?? 0.45))
        });
        continue;
      }
      if (item.kind === "image") {
        const href = String(item.href || "").trim();
        if (!href) continue;
        normalized.push({
          kind: "image",
          id: String(item.id || `image_${normalized.length + 1}`),
          x: Number(item.x ?? 592),
          y: Number(item.y ?? 64),
          width: Number(item.width ?? 156),
          height: Number(item.height ?? 262),
          href,
          opacity: Number(item.opacity ?? 0.98),
          delaySec: Math.max(0, Number(item.delaySec ?? 0)),
          durationSec: Math.max(0.1, Number(item.durationSec ?? 0.45))
        });
        continue;
      }
      if (item.kind === "text") {
        const text = String(item.text || "").trim();
        if (!text) continue;
        normalized.push({
          kind: "text",
          id: String(item.id || `text_${normalized.length + 1}`),
          x: Number(item.x ?? 430),
          y: Number(item.y ?? 82),
          text,
          color: item.color || "#1e293b",
          size: Number(item.size ?? 14),
          delaySec: Math.max(0, Number(item.delaySec ?? 0)),
          durationSec: Math.max(0.1, Number(item.durationSec ?? 0.45))
        });
      }
    }
    return normalized;
  }

  function buildBoardSteps(
    q: TutorQuestion,
    avatar: Avatar,
    teachingStep: TutorTeachingStep | null,
    beat: TutorScreenplayBeat | null = null
  ): SvgBoardStep[] {
    const steps: SvgBoardStep[] = [];
    const speed = Math.max(0.5, boardSpeed);
    let delay = 0;

    const addLine = (id: string, x1: number, y1: number, x2: number, y2: number, color = "#64748b", width = 2) => {
      steps.push({
        kind: "line",
        id,
        x1,
        y1,
        x2,
        y2,
        color,
        width,
        delaySec: delay,
        durationSec: 0.8 / speed
      });
      delay += 0.5 / speed;
    };

    const addText = (id: string, x: number, y: number, text: string, color = "#0f172a", size = 16) => {
      steps.push({
        kind: "text",
        id,
        x,
        y,
        text,
        color,
        size,
        delaySec: delay,
        durationSec: 0.45 / speed
      });
      delay += 0.35 / speed;
    };
    const addImage = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      href: string,
      opacity = 0.98
    ) => {
      steps.push({
        kind: "image",
        id,
        x,
        y,
        width,
        height,
        href,
        opacity,
        delaySec: delay,
        durationSec: 0.35 / speed
      });
      delay += 0.18 / speed;
    };

    const customSvgSteps = normalizeSvgBoardSteps((beat as any)?.svgAnimation);
    if (customSvgSteps.length) {
      // ── Always write the teacherLine as a header so board matches coach speech ──
      const tLine = (beat as any)?.teacherLine || teachingStep?.teacherLine || "";
      if (tLine) {
        const brief = tLine.length > 70 ? tLine.slice(0, 70) + "…" : tLine;
        steps.push({ kind: "text", id: "svghdr_tl", x: 18, y: 18, text: brief,
          color: "#3b3a8c", size: 13, delaySec: 0, durationSec: 0.25 });
        steps.push({ kind: "line", id: "svghdr_div", x1: 18, y1: 28, x2: 742, y2: 28,
          color: "#c7d2fe", width: 1, delaySec: 0.1, durationSec: 0.2 });
        delay = 0.3;
      }
      let maxTimeline = 0;
      for (const step of customSvgSteps) {
        steps.push({
          ...step,
          delaySec: delay + step.delaySec
        });
        maxTimeline = Math.max(maxTimeline, step.delaySec + step.durationSec);
      }
      delay += maxTimeline + 0.2;
    }

    if (!customSvgSteps.length && teachingStep?.boardMode === "free_draw") {
      addText("fd_intro", 20, 54, "Step 1: Board demo of the method flow.", "#334155", 14);
      addLine("fd_1", 420, 54, 620, 54, avatar.color, 2);
      addLine("fd_2", 420, 78, 670, 78, avatar.color, 2);
      addLine("fd_3", 420, 102, 600, 102, avatar.color, 2);
      addLine("fd_arrow", 620, 54, 655, 78, "#ef4444", 2);
      addText("fd_note", 430, 126, "Teacher writes each transition.", "#1e293b", 12);
    }

    if (!customSvgSteps.length && teachingStep?.boardMode !== "free_draw" && (q.subtopic || "").toLowerCase().includes("ten point circle")) {
      addText("tpc_intro", 30, 54, "Step 1: I will draw the ten-point circle first.", "#334155", 15);
      // Centred on 760×380 board: cx=380, cy=210, r=140
      const ringPoints = [
        { x: 517, y: 140, label: "9" },
        { x: 520, y: 210, label: "8" },
        { x: 517, y: 280, label: "7" },
        { x: 450, y: 330, label: "6" },
        { x: 380, y: 350, label: "5" },
        { x: 310, y: 330, label: "4" },
        { x: 243, y: 280, label: "3" },
        { x: 240, y: 210, label: "2" },
        { x: 243, y: 140, label: "1" },
        { x: 380,  y: 70, label: "10" },
      ];
      for (let i = 0; i < ringPoints.length; i += 1) {
        const current = ringPoints[i];
        const next = ringPoints[(i + 1) % ringPoints.length];
        addLine(`tpc_line_${i}`, current.x, current.y, next.x, next.y, "#0ea5e9", 2);
      }
      ringPoints.forEach((p, i) => addText(`tpc_label_${i}`, p.x - 8, p.y - 8, p.label, avatar.color, 14));
      addText("tpc_labels", 280, 375, "10 at top, then 9→1 clockwise", "#1e293b", 13);
    }

    // ── Universal fallback: always draw the teacher line + question on the board ──
    // Runs whenever no svgAnimation, free_draw, or special case produced content.
    if (steps.length === 0) {
      // Subtopic / chapter label at top
      const subtopicLabel = (teachingStep?.subtopic || q.subtopic || "").trim();
      if (subtopicLabel) {
        addText("fb_subtopic", 30, 38, subtopicLabel, "#3b3a8c", 18);
        addLine("fb_divider", 30, 50, 730, 50, "#e2e8f0", 1);
      }

      // Teacher line — wrap into ~65-char lines across the board
      const teacherText = (beat?.teacherLine || teachingStep?.teacherLine || "").trim();
      if (teacherText) {
        const words = teacherText.split(" ");
        const lineLimit = 60;
        const lines: string[] = [];
        let current = "";
        for (const w of words) {
          if ((current + " " + w).trim().length > lineLimit) {
            if (current) lines.push(current.trim());
            current = w;
          } else {
            current = (current + " " + w).trim();
          }
          if (lines.length >= 3) break; // max 3 lines
        }
        if (current && lines.length < 3) lines.push(current.trim());
        lines.forEach((line, i) => addText(`fb_line_${i}`, 30, 82 + i * 30, line, "#1e293b", 16));
        delay += 0.3;
      }

      // Horizontal rule
      addLine("fb_rule", 30, subtopicLabel ? 175 : 140, 730, subtopicLabel ? 175 : 140, "#e2e8f0", 1);

      // Question on the board
      const questionText = (q.questionText || "").trim();
      if (questionText) {
        addText("fb_q_label", 30, subtopicLabel ? 198 : 163, "Try this:", "#059669", 13);
        const qWords = questionText.split(" ");
        const qLines: string[] = [];
        let qCurrent = "";
        for (const w of qWords) {
          if ((qCurrent + " " + w).trim().length > 55) {
            if (qCurrent) qLines.push(qCurrent.trim());
            qCurrent = w;
          } else {
            qCurrent = (qCurrent + " " + w).trim();
          }
          if (qLines.length >= 2) break;
        }
        if (qCurrent && qLines.length < 2) qLines.push(qCurrent.trim());
        const qBaseY = subtopicLabel ? 220 : 185;
        qLines.forEach((line, i) => addText(`fb_q_${i}`, 30, qBaseY + i * 32, line, "#0f172a", 20));
      }

      // Worked example hint if available
      const boardAction = (teachingStep?.boardAction || "").trim();
      if (boardAction && boardAction.length < 120) {
        addLine("fb_rule2", 30, 300, 730, 300, "#e2e8f0", 1);
        addText("fb_hint_label", 30, 320, "Method:", "#7c3aed", 12);
        addText("fb_hint", 30, 338, boardAction.slice(0, 90), "#475569", 13);
      }
    }

    return steps;
  }

  function boardDurationMs(steps: SvgBoardStep[], holdSec = 0): number {
    const timelineSec = steps.reduce((mx, s) => Math.max(mx, s.delaySec + s.durationSec), 0);
    return Math.ceil((timelineSec + Math.max(0, holdSec)) * 1000) + 380;
  }

  async function logTutorEvent(eventType: string, meta: Record<string, unknown>, extras?: { isCorrect?: boolean; scoreDelta?: number }) {
    if (!sessionId) return;
    try {
      await fetch("/api/vedic/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          eventType,
          questionId: question?.questionId,
          lessonCode: activeChapter,
          isCorrect: extras?.isCorrect,
          scoreDelta: extras?.scoreDelta,
          meta,
        }),
      });
    } catch {
      // analytics events must not block tutoring flow
    }
  }

  function addConversationTurn(role: ConversationRole, channel: ConversationChannel, text: string, meta: Record<string, unknown> = {}) {
    const cleaned = (text || "").replace(/\s+/g, " ").trim();
    if (!cleaned) return;
    const turn: ConversationTurn = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      role,
      channel,
      text: cleaned,
      at: Date.now(),
      questionId: question?.questionId,
      exerciseGroup: activeExerciseGroup
    };
    setConversationLog((prev) => {
      const next = [...prev, turn];
      return next.length > 300 ? next.slice(next.length - 300) : next;
    });
    void logTutorEvent("CONVERSATION_TURN", {
      role,
      channel,
      text: cleaned,
      chapterCode: activeChapter,
      exerciseGroup: activeExerciseGroup,
      questionId: question?.questionId || "",
      flowState,
      screenplayMode,
      ...meta
    });
  }

  function downloadConversationLog() {
    if (typeof window === "undefined" || !conversationLog.length) return;
    const payload = {
      sessionId: sessionId || "",
      chapterCode: activeChapter,
      exerciseGroup: activeExerciseGroup,
      exportedAt: new Date().toISOString(),
      turns: conversationLog.map((t) => ({
        ...t,
        isoTime: new Date(t.at).toISOString()
      }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai_tutor_conversation_${sessionId || "session"}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  async function copySessionId() {
    if (!sessionId || typeof window === "undefined" || !navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(sessionId);
      setTeacherUtterance("📌 Session ID copied.");
    } catch {
      // ignore clipboard failure
    }
  }

  async function sendOrchestratorCommand(command: string, meta: Record<string, unknown> = {}) {
    if (!sessionId) return;
    try {
      const response = await fetch("/api/vedic/orchestrator/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          command,
          meta,
        }),
      });
      const data: TutorOrchestratorSnapshot & { error?: string } = await response.json().catch(() => ({ error: "bad_json" } as any));
      if (!response.ok || data.error) return;
      setFlowState(data.state);
      setFlowVersion(data.version || 0);
    } catch {
      // flow commands must not block tutor UX
    }
  }

  function isExpiredSessionError(message: string): boolean {
    return /invalid or expired tutor session/i.test(message || "");
  }

  async function recoverExpiredSession(_trigger: string) {
    // Session has expired — show the purchase / registration CTA instead of
    // silently trying to reconnect. This is the conversion moment.
    setShowPurchaseCta(true);
  }

  async function refreshFlowState() {
    if (!sessionId) return;
    try {
      const response = await fetch(`/api/vedic/orchestrator/state?sessionId=${encodeURIComponent(sessionId)}`, {
        cache: "no-store",
      });
      const data: TutorOrchestratorSnapshot & { error?: string } = await response.json().catch(() => ({ error: "bad_json" } as any));
      if (!response.ok || data.error) return;
      setFlowState(data.state);
      setFlowVersion(data.version || 0);
    } catch {
      // polling fallback is best-effort
    }
  }

  function clearBoard() {
    teachRunRef.current += 1;
    teachingLockRef.current = false;   // release lock so teachOnBoard can run after clearBoard
    setBoardSteps([]);
    setBoardRunId((v) => v + 1);
    if (boardTimerRef.current) {
      window.clearTimeout(boardTimerRef.current);
      boardTimerRef.current = null;
    }
    if (boardWaitResolveRef.current) {
      boardWaitResolveRef.current();
      boardWaitResolveRef.current = null;
    }
    setIsTeachingBoard(false);
    stopListeningSession();
    setAwaitingStudentResponse(false);
  }

  async function waitForBoard(ms: number): Promise<void> {
    await new Promise<void>((resolve) => {
      if (boardTimerRef.current) {
        window.clearTimeout(boardTimerRef.current);
        boardTimerRef.current = null;
      }
      boardWaitResolveRef.current = () => {
        boardWaitResolveRef.current = null;
        resolve();
      };
      boardTimerRef.current = window.setTimeout(() => {
        boardTimerRef.current = null;
        const done = boardWaitResolveRef.current;
        boardWaitResolveRef.current = null;
        if (done) done();
      }, Math.max(1, ms));
    });
  }

  async function teachOnBoard() {
    // Use ref-based lock to avoid stale-closure false-positives from React async state
    if (!question || teachingLockRef.current) return;
    teachingLockRef.current = true;
    void sendOrchestratorCommand("START_LOOP", {
      trigger: "teach_on_board",
      questionId: question.questionId,
      mode: screenplayMode,
    });
    const runId = teachRunRef.current + 1;
    teachRunRef.current = runId;
    setError("");
    setIsListening(false);
    setAwaitingStudentResponse(false);

    const screenplay = activeScreenplayBeats;
    setIsTeachingBoard(true);
    if (screenplay.length) {
      void logTutorEvent("SCREENPLAY_PLAN", {
        mode: screenplayMode,
        confidence,
        beatIds: screenplay.map((b) => b.beatId),
        beatCount: screenplay.length,
      });
      for (const beat of screenplay) {
        if (runId !== teachRunRef.current) return;
        setCurrentCue(beat.cue || "explain");
        void logTutorEvent("SCREENPLAY_BEAT_SELECTED", {
          mode: screenplayMode,
          beatId: beat.beatId,
          stepId: beat.stepId,
          cue: beat.cue,
          performanceTag: beat.performanceTag || "core",
          holdSec: beat.holdSec,
          useWhenCorrect: beat.useWhenCorrect,
          useWhenIncorrect: beat.useWhenIncorrect,
          minConfidence: beat.minConfidence,
          maxConfidence: beat.maxConfidence,
        });
        const beatStep: TutorTeachingStep = {
          stepId: beat.stepId,
          exerciseGroup: beat.exerciseGroup,
          subtopic: beat.subtopic,
          boardMode: beat.boardMode,
          teacherLine: beat.teacherLine || activeTeachingStep?.teacherLine || question.hint,
          boardAction: beat.boardAction || activeTeachingStep?.boardAction || "Teacher demonstrates the next step.",
          checkpointPrompt: beat.checkpointPrompt || activeTeachingStep?.checkpointPrompt || "What should we do first?",
          microPractice: beat.fallbackHint || activeTeachingStep?.microPractice || ""
        };
        const steps = buildBoardSteps(question, activeAvatar, beatStep, beat);
        setBoardSteps(steps);
        setBoardRunId((v) => v + 1);
        await Promise.all([
          waitForBoard(boardDurationMs(steps, beat.holdSec)),
          speak(beat.teacherLine || beatStep.teacherLine)
        ]);
        if (runId !== teachRunRef.current) return;
        if (beat.pauseType === "student_response") {
          void sendOrchestratorCommand("BOARD_COMPLETE", {
            beatId: beat.beatId,
            checkpointPrompt: beat.checkpointPrompt,
          });
          void logTutorEvent("SCREENPLAY_CHECKPOINT_WAIT", {
            mode: screenplayMode,
            beatId: beat.beatId,
            checkpointPrompt: beat.checkpointPrompt,
            expectedStudentResponse: beat.expectedStudentResponse,
          });
          teachingLockRef.current = false;
          setIsTeachingBoard(false);
          await speak(question.questionText || activeDuolingoStep?.readAloudPrompt || beat.checkpointPrompt || activeTeachingStep?.checkpointPrompt || "Listen to the question.");
          if (runId !== teachRunRef.current) return;
          await speak(activeDuolingoStep?.tryPrompt || "Your turn now.");
          if (runId !== teachRunRef.current) return;
          setAwaitingStudentResponse(true);
          return;
        }
      }
      void sendOrchestratorCommand("BOARD_COMPLETE", {
        reason: "screenplay_completed_without_explicit_checkpoint",
      });
      teachingLockRef.current = false;
      setIsTeachingBoard(false);
      await speak(question.questionText || activeDuolingoStep?.readAloudPrompt || activeTeachingStep?.checkpointPrompt || "Listen to the question.");
      if (runId !== teachRunRef.current) return;
      await speak(activeDuolingoStep?.tryPrompt || "Your turn now.");
      if (runId !== teachRunRef.current) return;
      setAwaitingStudentResponse(true);
      return;
    }

    void logTutorEvent("SCREENPLAY_FALLBACK_TEACH", {
      mode: screenplayMode,
      reason: "no_screenplay_for_group",
      exerciseGroup: question.exerciseGroup,
    });
    const fallbackTeachingStep = activeDuolingoStep
      ? {
          stepId: activeTeachingStep?.stepId || `duo_${activeExerciseGroup}`,
          exerciseGroup: activeExerciseGroup,
          subtopic: activeDuolingoStep.subtopic,
          boardMode: activeTeachingStep?.boardMode || "free_draw",
          teacherLine: activeDuolingoStep.coachHook,
          boardAction: activeDuolingoStep.boardDemo,
          checkpointPrompt: activeDuolingoStep.masteryCheck,
          microPractice: activeDuolingoStep.reviewPrompt,
        }
      : activeTeachingStep;
    const steps = buildBoardSteps(question, activeAvatar, fallbackTeachingStep, null);
    setBoardSteps(steps);
    setBoardRunId((v) => v + 1);
    await Promise.all([
      waitForBoard(boardDurationMs(steps)),
      speak(question.questionText || activeDuolingoStep?.readAloudPrompt || `${toChatStylePrompt(question)} ${fallbackTeachingStep?.teacherLine || question.hint}.`)
    ]);
    if (runId !== teachRunRef.current) return;

    teachingLockRef.current = false;
    setIsTeachingBoard(false);
    void sendOrchestratorCommand("BOARD_COMPLETE", {
      reason: "fallback_board_complete",
    });
    await speak(activeDuolingoStep?.tryPrompt || "Your turn now.");
    if (runId !== teachRunRef.current) return;
    setAwaitingStudentResponse(true);
  }

  useEffect(() => {
    speakRef.current = speak;
  }, [speak]);

  useEffect(() => {
    teachOnBoardRef.current = teachOnBoard;
  }, [teachOnBoard]);

  function listenAnswer() {
    if (typeof window === "undefined" || isEvaluatingAnswer) return;
    if (micPermission === "denied") {
      setAwaitingStudentResponse(true);
      setError("Microphone is blocked in browser settings. Continue by typing your answer.");
      addConversationTurn("system", "system", "Microphone permission is blocked. Switched to text input.", {
        source: "listen_denied",
      });
      return;
    }
    const w = window as Window & { webkitSpeechRecognition?: any; SpeechRecognition?: any };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition is not available in this browser.");
      return;
    }

    clearListenTimeout();
    const recog = new SR();
    speechRecognitionRef.current = recog;
    let submittedFromVoice = false;
    let heardTranscript = false;
    setError("");
    setIsListening(true);
    setAwaitingStudentResponse(false);
    addConversationTurn("system", "system", "Voice listening started.", { source: "listen_start" });
    recog.lang = "en-IN";
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    listenTimerRef.current = window.setTimeout(() => {
      try {
        recog.stop();
      } catch {
        // ignore stop errors
      }
      speechRecognitionRef.current = null;
      setIsListening(false);
      setAwaitingStudentResponse(true);
      setError("Listening timed out. Click Speak Answer again, or type and press Enter.");
      addConversationTurn("system", "system", "Voice listening timeout.", { source: "listen_timeout" });
      clearListenTimeout();
    }, 9000);

    recog.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      const spokenAnswer = String(transcript || "").trim();
      heardTranscript = spokenAnswer.length > 0;
      clearListenTimeout();
      setAnswer(spokenAnswer);
      setLastAnswerMode("voice");
      void sendOrchestratorCommand("STUDENT_RESPONSE", {
        modality: "voice",
        transcriptLength: spokenAnswer.length,
      });
      if (autoTeachEnabled && awaitingStudentResponse && spokenAnswer) {
        submittedFromVoice = true;
        void checkAnswer(spokenAnswer, "voice");
      }
    };
    recog.onend = () => {
      clearListenTimeout();
      speechRecognitionRef.current = null;
      setIsListening(false);
      addConversationTurn("system", "system", "Voice listening ended.", { source: "listen_end", heardTranscript });
      if (!submittedFromVoice) {
        if (!heardTranscript) {
          setError("I could not hear a clear answer. Click Speak Answer again, or type and press Enter.");
        }
        setAwaitingStudentResponse(true);
      }
    };
    recog.onerror = (event: any) => {
      clearListenTimeout();
      speechRecognitionRef.current = null;
      setIsListening(false);
      setAwaitingStudentResponse(true);
      const errorCode = String(event?.error || "");
      if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
        setMicPermission("denied");
        setVoiceEnabled(false);
        setError("Microphone permission denied. Continue by typing your answer.");
        addConversationTurn("system", "system", "Microphone permission denied by browser.", {
          source: "listen_permission_denied",
          errorCode,
        });
        return;
      }
      setError("Could not capture voice. Click Speak Answer again, or type and press Enter.");
      addConversationTurn("system", "system", "Voice listening error.", {
        source: "listen_error",
        errorCode,
      });
    };
    recog.start();
  }

  // Unlock browser audio context on first user gesture — must happen synchronously
  // before any async call, otherwise autoplay is blocked on mobile/strict browsers.
  function unlockAudio() {
    if (audioUnlockedRef.current || typeof window === "undefined") return;
    audioUnlockedRef.current = true;
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        // Create once, store in ref — iOS Safari requires the SAME context for all playback
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx() as AudioContext;
        }
        const ctx = audioCtxRef.current;
        void ctx.resume();
        const buf = ctx.createBuffer(1, 1, 22050);
        const src2 = ctx.createBufferSource();
        src2.buffer = buf;
        src2.connect(ctx.destination);
        src2.start(0);
      }
      // Also prime HTMLAudioElement path with a silent data URL
      const sil = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
      void sil.play().catch(() => {});

      // Speak the welcome greeting on first interaction using Sarvam AI TTS.
      // Fired here (inside a user-gesture handler) so Chrome/iOS allow audio.
      if (status === "idle") {
        const avatarName = activeAvatar.name;
        const greetLine = isDemoMode
          ? `Hi there! I am ${avatarName}, your Vedic Math coach. What is your name and which grade are you in? Tell me below and we will get started!`
          : minimalDuolingoLayout
            ? `Hi! I am ${avatarName}. Fill in your details and let us start your Vedic Math mission!`
            : `Hi! I am ${avatarName}. Ready to learn? Let us start!`;
        void speak(greetLine);
      }
    } catch { /* ignore */ }
  }

  function writeSavedBookmark(next: SavedTutorBookmark | null) {
    setSavedBookmark(next);
    if (typeof window === "undefined") {
      return;
    }
    try {
      if (next) {
        window.localStorage.setItem(resumeStorageKey, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(resumeStorageKey);
      }
    } catch {
      // ignore storage failure
    }
  }

  function createSavedBookmark(overrides: Partial<SavedTutorBookmark> = {}): SavedTutorBookmark | null {
    const chapterCode = String(overrides.chapterCode ?? activeChapter ?? selectedChapter ?? "").trim();
    const exerciseGroup = String(overrides.exerciseGroup ?? activeExerciseGroup ?? selectedExerciseGroup ?? defaultRequestedExerciseGroup).trim();
    if (!chapterCode || !exerciseGroup) {
      return null;
    }
    return {
      sessionId: String(overrides.sessionId ?? sessionId ?? "").trim(),
      courseId: String(overrides.courseId ?? courseId ?? requestedCourseId).trim() || requestedCourseId,
      chapterCode,
      exerciseGroup,
      lessonTitle: String(overrides.lessonTitle ?? lessonTitle ?? previewChapter?.title ?? "").trim(),
      questionId: String(overrides.questionId ?? question?.questionId ?? "").trim(),
      elapsedSec: Number(overrides.elapsedSec ?? classElapsedSec ?? 0) || 0,
      savedAt: Number(overrides.savedAt ?? Date.now()) || Date.now(),
    };
  }

  function resetInteractiveState() {
    dbg("FLOW", "resetInteractiveState()");
    setTeacherUtterance("");          // clear stale coach text so old question never leaks into next question
    setAnswer("");
    setCheck(null);
    setDoubt("");
    setDoubtReply("");
    setPendingKickoff("none");
    setPendingKickoffToken("");
    kickoffRunningRef.current = false;
    autoListenQuestionRef.current = "";
    // reset rich question type state
    setSelectedMcqIndex(null);
    setFillStepIndex(0);
    setFillStepInputs([]);
    setFillStepResults([]);
    setFillStepErrors([]);
    setFillStepWrongCounts([]);
    silenceRecoveryQuestionRef.current = "";
    setIsEvaluatingAnswer(false);
    setIsLoadingNextQuestion(false);
    setLastAnswerMode("typed");
    stopVoicePlayback();
    clearBoard();
    setAwaitingStudentResponse(false);
    setPendingContinue(false);
    if (continueTimerRef.current !== null) {
      window.clearTimeout(continueTimerRef.current);
      continueTimerRef.current = null;
    }
    setError("");
  }

  async function startSession(options?: { preserveClassClock?: boolean; chapterCode?: string; exerciseGroup?: string }): Promise<boolean> {
    unlockAudio();
    const preserveClassClock = options?.preserveClassClock === true;
    const requestedChapterCode = options?.chapterCode || selectedChapter;
    const requestedExerciseGroup = options?.exerciseGroup || selectedExerciseGroup || defaultRequestedExerciseGroup;
    setConfidence(onboardingConfidence);
    // Apply teaching pace chosen on start screen
    if (teachingPace === "relaxed") { setBoardSpeed(0.65); silenceRecoveryMsRef.current = 18000; }
    else if (teachingPace === "quick") { setBoardSpeed(1.3); silenceRecoveryMsRef.current = 7500; }
    else { setBoardSpeed(1.0); silenceRecoveryMsRef.current = 12000; }
    setStatus("loading");
    setError("");
    resetInteractiveState();
    setFlowState("boot");
    setFlowVersion(0);
    setRealtimeConnected(false);
    setAttemptByQuestion({});
    setConversationLog([]);
    setLessonAssetItems([]);
    setLessonGradeBand("");
    setLessonDuolingoArc(null);
    setSessionProgress(EMPTY_SESSION_PROGRESS);
    setDbCourseId(dbCourseIdFromQuery);
    setSelectedChapter(requestedChapterCode);
    setActiveChapter(requestedChapterCode);
    setSelectedExerciseGroup(requestedExerciseGroup);
    setActiveExerciseGroup(requestedExerciseGroup);
    try {
      const response = await fetch("/api/vedic/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          courseId,
          chapterCode: requestedChapterCode,
          exerciseGroup: requestedExerciseGroup
        })
      });
      const data: TutorStartResponse & { error?: string } = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Unable to start tutor session.");
      }

      setSessionId(data.sessionId);
      setCourseId(data.courseId || courseId);
      setSessionProgress(data.sessionProgress || EMPTY_SESSION_PROGRESS);
      setLessonTitle(data.lesson.title);
      setLessonGradeBand(data.lesson.gradeBand || "");
      setLessonSource(data.lesson.source);
      setLessonEstimatedMinutes(data.lesson.estimatedMinutes || 0);
      setLessonSubtopics(data.lesson.subtopics || []);
      setLessonLearningGoals(data.lesson.learningGoals || []);
      setLessonExerciseCoverage(data.lesson.exerciseCoverage || []);
      setLessonExerciseFlow(data.lesson.exerciseFlow || []);
      setLessonTeachingScript(data.lesson.teachingScript || []);
      setLessonScreenplay(data.lesson.screenplay || []);
      setLessonDuolingoArc(data.lesson.duolingoLessonArc || null);
      setLessonAssetItems(data.lesson.assetItems || []);
      setCoreIdeas(data.lesson.coreIdeas || []);
      if (typeof data.lesson.dbCourseId === "number" && data.lesson.dbCourseId > 0) {
        setDbCourseId(String(data.lesson.dbCourseId));
      }

      if (data.chapters?.length) setChapters(data.chapters);
      if (data.exerciseGroups?.length) setExerciseGroups(data.exerciseGroups);
      if (!preserveClassClock) {
        const startedAt = Date.now();
        setClassStartedAt(startedAt);
        setClassElapsedSec(0);
      } else if (!classStartedAt) {
        const resumeElapsedSec = savedBookmark?.elapsedSec || classElapsedSec;
        setClassElapsedSec(resumeElapsedSec);
        setClassStartedAt(Date.now() - resumeElapsedSec * 1000);
      }

      const nextChapterCode = data.activeChapterCode || requestedChapterCode;
      const nextExerciseGroup = data.activeExerciseGroup || requestedExerciseGroup;
      setSelectedChapter(nextChapterCode);
      setActiveChapter(nextChapterCode);
      setSelectedExerciseGroup(nextExerciseGroup);
      setActiveExerciseGroup(nextExerciseGroup);
      setQuestion(data.question);
      setIsLoadingNextQuestion(false);
      setQuestionShownAt(Date.now());
      setStatus("ready");
      const bookmark = createSavedBookmark({
        sessionId: data.sessionId,
        courseId: data.courseId || courseId,
        chapterCode: nextChapterCode,
        exerciseGroup: nextExerciseGroup,
        lessonTitle: data.lesson.title,
        questionId: data.question?.questionId || "",
        elapsedSec: preserveClassClock ? (savedBookmark?.elapsedSec || classElapsedSec) : 0,
        savedAt: Date.now(),
      });
      if (bookmark) {
        writeSavedBookmark(bookmark);
      }
      addConversationTurn(
        "system",
        "system",
        `Session started: ${data.lesson.title} | Exercise ${nextExerciseGroup}`,
        { source: "start_session" }
      );
      void logTutorEvent("LESSON_STARTED", {
        chapterCode: nextChapterCode,
        lessonTitle: data.lesson.title,
        avatar: activeAvatar.id,
        grade: learnerLevel,
      });

      clearBoard();
      const greetingName = (studentName || "").trim() || "there";
      const rawCoachIntro = data.lesson.duolingoLessonArc?.onboarding?.coachIntro || `${activeAvatar.name} will guide you through ${data.lesson.title}.`;
      // Strip any hardcoded "Hi! I am [Name], your [role]." prefix — the welcomeLine already adds it dynamically.
      const coachIntro = rawCoachIntro.replace(/^Hi[!.]?\s+I\s+am\s+\w[\w\s]*,?\s+your\s+[^.]+\.\s*/i, "").trim() || rawCoachIntro;
      const gradeLabel = isDemoMode && demoGrade ? `, Grade ${demoGrade} student,` : "";
      const welcomeLine = `Hi ${greetingName}${gradeLabel}! I am ${activeAvatar.name}, your ${activeAvatar.role}. ${coachIntro} You are starting as ${LEARNER_LEVEL_LABELS[learnerLevel].toLowerCase()} and want help with ${LEARNER_GOAL_LABELS[learnerGoal].toLowerCase()}. I will guide you in ${KNOWN_LANGUAGE_LABELS[knownLanguage]}.`;
      setTeacherUtterance(welcomeLine);
      if (autoTeachEnabled) {
        setPendingKickoffToken(`${Date.now()}_${data.sessionId}_${data.question?.questionId || "q"}_teach`);
        setPendingKickoff("teach");
      } else {
        void speak(welcomeLine);
      }
      return true;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
      return false;
    }
  }

  async function resumeSavedSession(): Promise<boolean> {
    if (!savedBookmark) {
      return false;
    }
    unlockAudio();
    setStatus("loading");
    setError("");
    resetInteractiveState();
    setSelectedChapter(savedBookmark.chapterCode);
    setSelectedExerciseGroup(savedBookmark.exerciseGroup || defaultRequestedExerciseGroup);

    try {
      const response = await fetch(`/api/vedic/resume?sessionId=${encodeURIComponent(savedBookmark.sessionId)}`, {
        cache: "no-store",
      });
      const data: TutorStartResponse & { error?: string } = await response.json();
      if (!response.ok || data.error) {
        return await startSession({
          preserveClassClock: true,
          chapterCode: savedBookmark.chapterCode,
          exerciseGroup: savedBookmark.exerciseGroup || defaultRequestedExerciseGroup,
        });
      }

      const nextChapterCode = data.activeChapterCode || savedBookmark.chapterCode;
      const nextExerciseGroup = data.activeExerciseGroup || savedBookmark.exerciseGroup || defaultRequestedExerciseGroup;
      setSessionId(data.sessionId);
      setCourseId(data.courseId || courseId);
      setSessionProgress(data.sessionProgress || EMPTY_SESSION_PROGRESS);
      setLessonTitle(data.lesson.title);
      setLessonGradeBand(data.lesson.gradeBand || "");
      setLessonSource(data.lesson.source);
      setLessonEstimatedMinutes(data.lesson.estimatedMinutes || 0);
      setLessonSubtopics(data.lesson.subtopics || []);
      setLessonLearningGoals(data.lesson.learningGoals || []);
      setLessonExerciseCoverage(data.lesson.exerciseCoverage || []);
      setLessonExerciseFlow(data.lesson.exerciseFlow || []);
      setLessonTeachingScript(data.lesson.teachingScript || []);
      setLessonScreenplay(data.lesson.screenplay || []);
      setLessonDuolingoArc(data.lesson.duolingoLessonArc || null);
      setLessonAssetItems(data.lesson.assetItems || []);
      setCoreIdeas(data.lesson.coreIdeas || []);
      setSelectedChapter(nextChapterCode);
      setActiveChapter(nextChapterCode);
      setSelectedExerciseGroup(nextExerciseGroup);
      setActiveExerciseGroup(nextExerciseGroup);
      setQuestion(data.question);
      setIsLoadingNextQuestion(false);
      setQuestionShownAt(Date.now());
      setStatus("ready");
      const resumeElapsedSec = savedBookmark.elapsedSec || classElapsedSec;
      setClassElapsedSec(resumeElapsedSec);
      setClassStartedAt(Date.now() - resumeElapsedSec * 1000);
      writeSavedBookmark({
        ...savedBookmark,
        sessionId: data.sessionId,
        courseId: data.courseId || courseId,
        chapterCode: nextChapterCode,
        exerciseGroup: nextExerciseGroup,
        lessonTitle: data.lesson.title,
        questionId: data.question?.questionId || savedBookmark.questionId,
        savedAt: Date.now(),
      });
      setTeacherUtterance(`Welcome back ${(studentName || "").trim() || "friend"}. Your place is saved. Continue from here.`);
      setAwaitingStudentResponse(true);
      return true;
    } catch {
      return await startSession({
        preserveClassClock: true,
        chapterCode: savedBookmark.chapterCode,
        exerciseGroup: savedBookmark.exerciseGroup || defaultRequestedExerciseGroup,
      });
    }
  }

  function pauseSession() {
    const bookmark = createSavedBookmark({
      elapsedSec: classElapsedSec,
      savedAt: Date.now(),
    });
    if (bookmark) {
      writeSavedBookmark(bookmark);
    }
    setClassStartedAt(null);
    resetInteractiveState();
    setSessionId("");
    setQuestion(null);
    setStatus("idle");
    setTeacherUtterance("Your lesson is paused. Resume when you are ready.");
  }

  function exitToLms() {
    // Save progress first, then redirect to dashboard
    const bookmark = createSavedBookmark({
      elapsedSec: classElapsedSec,
      savedAt: Date.now(),
    });
    if (bookmark) {
      writeSavedBookmark(bookmark);
    }
    stopVoicePlayback();
    const dest = returnUrl || "https://robodynamics.in";
    window.location.href = dest;
  }

  async function checkAnswer(answerOverride?: string, source?: "typed" | "voice") {
    if (!sessionId || !question) return;
    // Synchronous ref guard — catches rapid double-taps/Enter+click before React re-renders
    if (checkAnswerInFlightRef.current) return;
    if (isEvaluatingAnswer) return;
    checkAnswerInFlightRef.current = true;
    if (!canAttemptAnswer) {
      checkAnswerInFlightRef.current = false;
      setError("No hearts left. Start review to refill and continue.");
      setAwaitingStudentResponse(false);
      return;
    }
    const learnerAnswer = (answerOverride ?? answer).trim();
    const answerSource = source || lastAnswerMode;
    if (!learnerAnswer) {
      checkAnswerInFlightRef.current = false;
      setError("Please type or speak your answer first.");
      setAwaitingStudentResponse(true);
      return;
    }

    dbg("ANSWER", `checkAnswer() ← "${learnerAnswer}"`, { questionId: question.questionId, source: answerSource });
    setIsEvaluatingAnswer(true);
    setCheck(null);
    setDoubtReply("");
    setError("");
    stopListeningSession();
    setAwaitingStudentResponse(false);
    addConversationTurn("student", answerSource === "voice" ? "voice" : "text", learnerAnswer, {
      source: "answer_submission"
    });
    const responseTimeMs = questionShownAt > 0 ? Math.max(0, Date.now() - questionShownAt) : undefined;
    void sendOrchestratorCommand("STUDENT_RESPONSE", {
      modality: "text_or_voice",
      answerLength: learnerAnswer.length,
      responseTimeMs,
    });

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 15000);
      const response = await fetch("/api/vedic/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sessionId,
          questionId: question.questionId,
          learnerAnswer,
          responseTimeMs,
          confidence
        })
      });
      window.clearTimeout(timeoutId);
      const data: TutorCheckResponse & { error?: string } = await response.json();
      if (!response.ok || data.error) {
        const msg = data.error || "Unable to evaluate answer.";
        setError(msg);
        setAwaitingStudentResponse(true);
        if (isExpiredSessionError(msg)) {
          await recoverExpiredSession("check_answer");
          return;
        }
        void sendOrchestratorCommand("CHECKPOINT_ERROR", {
          source: "check_answer_response",
          message: msg,
        });
        return;
      }

      dbg("ANSWER", `checkAnswer() → ${data.correct ? "✅ correct" : "❌ wrong"}`, { explanation: data.explanation?.slice(0, 60), xp: data.sessionProgress?.xp });
      setCheck(data);
      setAttemptByQuestion((prev) => ({
        ...prev,
        [question.questionId]: {
          correct: !!data.correct,
          confidence
        }
      }));
      const livesDepleted = !!data.sessionProgress?.livesDepleted;
      const nextStreak = Number(data.sessionProgress?.streak || 0);
      if (data.correct) {
        if (nextStreak > 0 && nextStreak % 3 === 0) {
          playMotivationSound("streak");
          setTeacherUtterance(`🔥 ${nextStreak} streak! Outstanding consistency, keep going.`);
        } else {
          playMotivationSound("correct");
        }
      } else if (livesDepleted) {
        playMotivationSound("depleted");
      } else {
        playMotivationSound("wrong");
      }
      const nextMode = !data.correct ? "remedial" : confidence === "high" ? "challenge" : "core";
      void sendOrchestratorCommand("ANSWER_EVALUATED", {
        isCorrect: !!data.correct,
        confidence,
        nextMode,
        tutorAction: data.tutorAction || "",
      });
      void logTutorEvent(
        "ANSWER_ADAPTATION_DECISION",
        {
          currentConfidence: confidence,
          answerCorrect: !!data.correct,
          nextScreenplayMode: nextMode,
          tutorAction: data.tutorAction || "",
          coachTip: data.coachTip || "",
        },
        { isCorrect: !!data.correct, scoreDelta: data.correct ? 1 : 0 }
      );
      void logTutorEvent("QUESTION_ATTEMPTED", {
        chapterCode: activeChapter,
        exerciseGroup: activeExerciseGroup,
        correct: !!data.correct,
        responseMs: questionShownAt ? Date.now() - questionShownAt : null,
        studentArchetype: data.studentArchetype || null,
        attempts: data.summary?.attempts ?? null,
        accuracyPct: data.summary?.accuracyPct ?? null,
      });
      if (data.summary) {
        setScore(data.summary);
      }
      if (data.sessionProgress) {
        setSessionProgress(data.sessionProgress);
      }
      // Apply adaptive board speed + silence recovery from BehaviorClassifier
      if (typeof data.boardSpeedFactor === "number" && data.boardSpeedFactor > 0) {
        setBoardSpeed(data.boardSpeedFactor);
      }
      if (typeof data.silenceRecoveryMs === "number" && data.silenceRecoveryMs > 0) {
        silenceRecoveryMsRef.current = data.silenceRecoveryMs;
      }
      setIsEvaluatingAnswer(false);
      const winLine = activeDuolingoStep?.instantFeedbackWin || "Great work! Keep it up.";
      const retryBaseLine = activeDuolingoStep?.instantFeedbackRetry || `Good try! ${activeTeachingStep?.checkpointPrompt || "Have another go — you are almost there."}`;
      const retrySupportLine = activeDuolingoStep?.reviewPrompt || activeTeachingStep?.microPractice || "";
      const retryLine = retrySupportLine ? `${retryBaseLine} ${retrySupportLine}` : retryBaseLine;
      if (data.correct) {
        // ── 🎉 Celebration overlay (2 s) ────────────────────────────────────
        const phrase = WIN_PHRASES[Math.floor(Math.random() * WIN_PHRASES.length)];
        setCelebrationPhrase(phrase);
        setIsCelebrating(true);
        setTeacherUtterance(`${phrase.text} ${winLine}`);
        await new Promise<void>((resolve) => window.setTimeout(resolve, 2000));
        setIsCelebrating(false);
        // ── Speak appreciation then immediately advance ───────────────────
        await speakRef.current(`${phrase.text} ${winLine}`);
        if (data.coachTip) {
          await speakRef.current(data.coachTip);
        }
        await nextQuestion({ directToStudent: true, source: "correct_answer" });
      } else {
        stopVoicePlayback();
        setIsSpeaking(false);
        setTeacherUtterance(data.coachTip ? `${retryLine} ${data.coachTip}` : retryLine);
        // Clear the answer field so student can type/tap fresh
        setAnswer("");
        setSelectedMcqIndex(null);  // allow MCQ re-tap after wrong answer
        setAwaitingStudentResponse(true);
        window.setTimeout(() => answerInputRef.current?.focus(), 150);
      }
    } catch (err) {
      const msg = err instanceof Error && err.name === "AbortError"
        ? "Answer check timed out. Please try again."
        : "Network issue while checking answer. Please try again.";
      setError(msg);
      setAwaitingStudentResponse(true);
      void sendOrchestratorCommand("CHECKPOINT_ERROR", {
        source: "check_answer_exception",
        message: msg,
      });
    } finally {
      checkAnswerInFlightRef.current = false;
      setIsEvaluatingAnswer(false);
    }
  }

  function getNextExerciseGroup(currentGroup: string): string {
    const current = String(currentGroup || "").trim();
    if (!current || !lessonGroupOrder.length) {
      return current || selectedExerciseGroup;
    }
    const index = lessonGroupOrder.indexOf(current);
    if (index < 0 || index >= lessonGroupOrder.length - 1) {
      return current;
    }
    return lessonGroupOrder[index + 1];
  }

  function buildQuestionProbeOrder(currentGroup: string, source?: "correct_answer" | "skip"): string[] {
    const current = String(currentGroup || "").trim();
    const orderedGroups = lessonGroupOrder.length
      ? lessonGroupOrder.map((value) => String(value || "").trim()).filter(Boolean)
      : [current || selectedExerciseGroup].filter(Boolean);
    if (!orderedGroups.length) {
      return current ? [current] : [];
    }

    const startIndex = Math.max(orderedGroups.indexOf(current), 0);
    const rotated = [
      ...orderedGroups.slice(startIndex),
      ...orderedGroups.slice(0, startIndex),
    ].filter(Boolean);
    const nextGroup = getNextExerciseGroup(current);
    const preferred = [nextGroup || current, ...rotated.filter((group) => group !== nextGroup)];

    return [...new Set(preferred.filter(Boolean))];
  }

  async function nextQuestion(options?: { directToStudent?: boolean; source?: "correct_answer" | "skip" }) {
    if (!sessionId) return;
    const currentExerciseGroup = activeExerciseGroup || selectedExerciseGroup;
    const previousQuestionId = question?.questionId || "";
    const previousQuestionText = question?.questionText || "";

    dbg("NAV", `nextQuestion() ←`, { src: options?.source, directToStudent: options?.directToStudent, prevQ: previousQuestionId.slice(-8) });
    setTeacherUtterance("");           // clear old question text immediately so coach bubble stays clean
    setAnswer("");
    setCheck(null);
    setDoubtReply("");
    setPendingKickoff("none");
    setSelectedMcqIndex(null);
    setFillStepIndex(0);
    setFillStepInputs([]);
    setFillStepResults([]);
    setFillStepErrors([]);
    setFillStepWrongCounts([]);
    setPendingKickoffToken("");
    kickoffRunningRef.current = false;
    checkAnswerInFlightRef.current = false;  // reset for the new question
    autoListenQuestionRef.current = "";
    stopListeningSession();
    setIsEvaluatingAnswer(false);
    setIsLoadingNextQuestion(true);
    setLastAnswerMode("typed");
    setAwaitingStudentResponse(false);
    setPendingContinue(false);

    const requestBody = {
      sessionId,
      courseId,
      chapterCode: activeChapter || selectedChapter,
      exerciseGroup: currentExerciseGroup,
    };
    const fetchNextQuestionPayload = async () => {
      const response = await fetch("/api/vedic/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data: TutorNextQuestionResponse & { error?: string } = await response.json();
      return { response, data };
    };

    const isRepeatedQuestion = (candidate: TutorNextQuestionResponse & { error?: string }, ok: boolean) =>
      ok &&
      !candidate.error &&
      !!previousQuestionId &&
      !!candidate.question &&
      (
        candidate.question.questionId === previousQuestionId ||
        (!!previousQuestionText && candidate.question.questionText === previousQuestionText)
      );

    const probeGroups = buildQuestionProbeOrder(currentExerciseGroup, options?.source);
    let response: Response | null = null;
    let data: (TutorNextQuestionResponse & { error?: string }) | null = null;
    let resolvedExerciseGroup = currentExerciseGroup;

    for (const group of probeGroups) {
      requestBody.exerciseGroup = group;
      const candidate = await fetchNextQuestionPayload();
      response = candidate.response;
      data = candidate.data;
      resolvedExerciseGroup = group;
      if (!response.ok || data.error) {
        continue;
      }
      if (!isRepeatedQuestion(data, response.ok)) {
        break;
      }
    }

    if (!response || !data) {
      setIsLoadingNextQuestion(false);
      setError("Unable to load next question.");
      return;
    }
    if (!response.ok || data.error) {
      setIsLoadingNextQuestion(false);
      const msg = data.error || "Unable to load next question.";
      setError(msg);
      if (isExpiredSessionError(msg)) {
        await recoverExpiredSession("next_question");
      }
      return;
    }

    dbg("NAV", `nextQuestion() → received`, { questionId: data.question?.questionId?.slice(-8), type: data.question?.questionType, text: data.question?.questionText?.slice(0, 60), exerciseGroup: resolvedExerciseGroup });
    setQuestion(data.question);
    addConversationTurn(
      "system",
      "system",
      `Moved to next question: Exercise ${data.question?.exerciseGroup || resolvedExerciseGroup}`,
      { source: "next_question" }
    );
    void sendOrchestratorCommand("NEXT_QUESTION", {
      questionId: data.question?.questionId || "",
      chapterCode: data.activeChapterCode || selectedChapter,
      exerciseGroup: data.activeExerciseGroup || resolvedExerciseGroup,
    });
    setQuestionShownAt(Date.now());
    const bookmark = createSavedBookmark({
      sessionId,
      courseId: data.courseId || courseId,
      chapterCode: data.activeChapterCode || selectedChapter,
      exerciseGroup: data.activeExerciseGroup || resolvedExerciseGroup,
      lessonTitle: data.lesson?.title || lessonTitle,
      questionId: data.question?.questionId || "",
      elapsedSec: classElapsedSec,
      savedAt: Date.now(),
    });
    if (bookmark) {
      writeSavedBookmark(bookmark);
    }
    if (data.courseId) setCourseId(data.courseId);
    if (data.activeChapterCode) {
      setActiveChapter(data.activeChapterCode);
      setSelectedChapter(data.activeChapterCode);
    }
    if (data.activeExerciseGroup) {
      setActiveExerciseGroup(data.activeExerciseGroup);
      setSelectedExerciseGroup(data.activeExerciseGroup);
    } else {
      setActiveExerciseGroup(resolvedExerciseGroup);
      setSelectedExerciseGroup(resolvedExerciseGroup);
    }
    if (data.sessionProgress) {
      setSessionProgress(data.sessionProgress);
    }
    if (data.lesson) {
      setLessonTitle(data.lesson.title);
      setLessonGradeBand(data.lesson.gradeBand || "");
      setLessonSource(data.lesson.source);
      setLessonEstimatedMinutes(data.lesson.estimatedMinutes || 0);
      setLessonSubtopics(data.lesson.subtopics || []);
      setLessonLearningGoals(data.lesson.learningGoals || []);
      setLessonExerciseCoverage(data.lesson.exerciseCoverage || []);
      setLessonExerciseFlow(data.lesson.exerciseFlow || []);
      setLessonTeachingScript(data.lesson.teachingScript || []);
      setLessonScreenplay(data.lesson.screenplay || []);
      setLessonDuolingoArc(data.lesson.duolingoLessonArc || null);
      setLessonAssetItems(data.lesson.assetItems || []);
      setCoreIdeas(data.lesson.coreIdeas || []);
      if (typeof data.lesson.dbCourseId === "number" && data.lesson.dbCourseId > 0) {
        setDbCourseId(String(data.lesson.dbCourseId));
      }
    }

    clearBoard();
    if (options?.directToStudent) {
      setIsLoadingNextQuestion(false);
      setAwaitingStudentResponse(true);
      void sendOrchestratorCommand("STUDENT_TURN_READY", {
        questionId: data.question?.questionId || "",
        source: options.source || "skip",
      });
      // Read the question aloud — coach bubble shows coaching prompt, NOT the question text
      // (question text is already displayed in the question panel; showing it in the bubble = duplication).
      if (data.question?.questionText) {
        const tryPrompt = activeDuolingoStep?.tryPrompt || `Your turn! ${activeAvatar.name} is listening.`;
        setTeacherUtterance(tryPrompt);
        void speakRef.current(data.question.questionText, { noUtterance: true });
      }
      return;
    }
    setIsLoadingNextQuestion(false);
    if (autoTeachEnabled) {
      setPendingKickoffToken(`${Date.now()}_${sessionId}_${data.question?.questionId || "q"}_teach`);
      setPendingKickoff("teach");
    }
  }

  async function askDoubt() {
    if (!sessionId || !doubt.trim()) return;
    const msg = doubt.trim();
    addConversationTurn("student", "doubt", msg, { source: "doubt_question" });
    setDoubt("");
    void sendOrchestratorCommand("ASK_DOUBT", {
      messageLength: msg.length,
    });

    const response = await fetch("/api/vedic/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message: msg,
        avatarName: activeAvatar.name,
        context: "doubt",
      })
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      const errMsg = data.error || "Unable to fetch doubt explanation.";
      setError(errMsg);
      if (isExpiredSessionError(errMsg)) {
        await recoverExpiredSession("ask_doubt");
      }
      return;
    }
    const reply = String(data.reply || "");
    setDoubtReply(reply);
    addConversationTurn("tutor", "doubt", reply, { source: "doubt_reply" });
    void speak(reply);
  }

  useEffect(() => {
    if (
      status !== "ready" ||
      !question ||
      pendingKickoff === "none" ||
      !pendingKickoffToken ||
      kickoffRunningRef.current ||
      pendingKickoffToken === lastKickoffTokenRef.current
    ) {
      return;
    }

    let cancelled = false;
    kickoffRunningRef.current = true;
    lastKickoffTokenRef.current = pendingKickoffToken;

    async function runKickoff() {
      try {
        if (pendingKickoff === "welcome") {
          const greetingName = (studentName || "").trim() || "there";
          const chCode = activeChapter;
          const goals = lessonLearningGoals.length ? lessonLearningGoals : (previewChapter?.learningGoals || []);
          const rawCoachIntro2 = lessonDuolingoArc?.onboarding?.coachIntro || `${activeAvatar.name} will guide you through ${lessonTitle || previewChapter?.title || "this chapter"}.`;
          const coachIntro = rawCoachIntro2.replace(/^Hi[!.]?\s+I\s+am\s+\w[\w\s]*,?\s+your\s+[^.]+\.\s*/i, "").trim() || rawCoachIntro2;
          const welcomeLine = `Hi ${greetingName}! I am ${activeAvatar.name}, your ${activeAvatar.role}. ${coachIntro} I will guide you in ${KNOWN_LANGUAGE_LABELS[knownLanguage]} and keep the pace right for ${LEARNER_LEVEL_LABELS[learnerLevel].toLowerCase()}.`;
          setTeacherUtterance(welcomeLine);
          await speakRef.current(welcomeLine);
          if (cancelled) return;

          // ── Slide 1: EXPLAIN — Sutra name + learning goals ────────────────
          const slide1 = buildIntroSlideBoardSteps(1, chCode, goals, activeAvatar, boardSpeed);
          setBoardSteps(slide1);
          setBoardRunId((v) => v + 1);
          setIsTeachingBoard(true);
          await Promise.all([
            waitForBoard(boardDurationMs(slide1, 1.2)),
            speakRef.current(
              `The Vedic focus for today is: "${CHAPTER_LABEL_MAP[chCode] || "Vedic Method"}". ` +
              `Let me show you a quick worked example so you can see exactly how it works.`
            ),
          ]);
          setIsTeachingBoard(false);
          if (cancelled) return;

          // ── Slide 2: DEMO — Step-by-step worked example ───────────────────
          const slide2 = buildIntroSlideBoardSteps(2, chCode, goals, activeAvatar, boardSpeed);
          setBoardSteps(slide2);
          setBoardRunId((v) => v + 1);
          setIsTeachingBoard(true);
          await Promise.all([
            waitForBoard(boardDurationMs(slide2, 2)),
            speakRef.current(getDemoSpeech(chCode)),
          ]);
          setIsTeachingBoard(false);
          if (cancelled) return;

          // ── Slide 3: GUIDED transition — "Now you try" ────────────────────
          const slide3 = buildIntroSlideBoardSteps(3, chCode, goals, activeAvatar, boardSpeed);
          setBoardSteps(slide3);
          setBoardRunId((v) => v + 1);
          setIsTeachingBoard(true);
          await Promise.all([
            waitForBoard(boardDurationMs(slide3, 0.8)),
            speakRef.current(
              "Now it is your turn. I will show you the first question. " +
              "Use the same method I just demonstrated. I will guide you on every step."
            ),
          ]);
          setIsTeachingBoard(false);
          if (cancelled) return;
          clearBoard();
        }
        if (!cancelled) {
          await teachOnBoardRef.current();
        }
      } finally {
        kickoffRunningRef.current = false;
        if (!cancelled) {
          setPendingKickoff("none");
          setPendingKickoffToken("");
        }
      }
    }

    void runKickoff();
    return () => {
      cancelled = true;
    };
  }, [status, question, pendingKickoff, pendingKickoffToken, lessonTitle, previewChapter?.title, studentName, activeAvatar.name, activeAvatar.role, knownLanguage, learnerLevel, lessonDuolingoArc, activeChapter, lessonLearningGoals, boardSpeed]);
  useEffect(() => {
    if (
      status !== "ready" ||
      !question ||
      !awaitingStudentResponse ||
      sessionProgress.livesDepleted ||
      silenceRecoveryQuestionRef.current === question.questionId
    ) {
      return;
    }
    const questionId = question.questionId;
    const timer = window.setTimeout(() => {
      const answerInput = document.getElementById("answerInput") as HTMLInputElement | null;
      if (
        silenceRecoveryQuestionRef.current === questionId ||
        (answerInput?.value || "").trim()
      ) {
        return;
      }
      silenceRecoveryQuestionRef.current = questionId;
      addConversationTurn("system", "system", "Silence recovery started.", { source: "silence_recovery" });
      setCheck(null);
      setError("");
      stopListeningSession();
      stopVoicePlayback();
      kickoffRunningRef.current = false;
      teachingLockRef.current = false;
      setPendingKickoff("none");
      setPendingKickoffToken("");
      setCurrentCue("guided");
      setAwaitingStudentResponse(false);
      setIsTeachingBoard(true);
      void sendOrchestratorCommand("SILENCE_RECOVERY", {
        questionId,
        idleMs: silenceRecoveryMsRef.current,
      });
      void teachOnBoardRef.current();
    }, silenceRecoveryMsRef.current);
    return () => window.clearTimeout(timer);
  }, [status, question, awaitingStudentResponse, sessionProgress.livesDepleted]);

  // Show lesson-complete screen when backend signals 100% completion
  useEffect(() => {
    if (
      status === "ready" &&
      !showLessonComplete &&
      sessionProgress.lessonCompletionPct >= 100 &&
      score.attempts >= 5
    ) {
      stopVoicePlayback();
      setShowLessonComplete(true);
      void logTutorEvent("LESSON_COMPLETED", {
        chapterCode: activeChapter,
        lessonTitle,
        xp: missionPoints,
        accuracyPct: score.accuracyPct,
        streak: sessionProgress.streak,
        attempts: score.attempts,
      });
    }
  }, [status, showLessonComplete, sessionProgress.lessonCompletionPct, score.attempts]);

  useEffect(() => {
    if (
      status !== "ready" ||
      !question ||
      !autoTeachEnabled ||
      !voiceEnabled ||
      micPermission === "denied" ||
      isFirstScene ||
      !awaitingStudentResponse ||
      isListening ||
      isSpeaking
    ) {
      return;
    }
    if (autoListenQuestionRef.current === question.questionId) {
      return;
    }
    autoListenQuestionRef.current = question.questionId;
    const timer = window.setTimeout(() => {
      listenAnswer();
    }, 450);
    return () => window.clearTimeout(timer);
  }, [status, question, autoTeachEnabled, voiceEnabled, micPermission, isFirstScene, awaitingStudentResponse, isListening, isSpeaking]);

  return (
    <main className={`container tutor-shell${status === "ready" ? " tutor-shell-live" : ""}`}>
      {/* ── Quick-start screen: Raj intro → start ───────────────── */}
      {status !== "ready" ? (
      <section className="panel tutor-setup-panel">
        <div className={`tutor-quickstart${minimalDuolingoLayout ? " tutor-quickstart-duo" : ""}`}>

          {/* ── Course introduction ─────────────────────────────────────── */}
          <div className="tutor-course-intro">
            <p className="tutor-qs-label">🇮🇳 RoboDynamics AI Tutor · {learnerLabel}</p>
            <h1 className="tutor-course-name">
              {requestedCourseId === "vedic_math" ? "Vedic Mathematics" : courseLabel}
            </h1>
            <p className="tutor-course-desc">
              {requestedCourseId === "vedic_math"
                ? "Ancient Indian mental math system — learn to calculate 10× faster without a calculator."
                : `Master ${courseLabel} step by step with your personal AI coach.`}
            </p>
            <div className="tutor-course-chips">
              {requestedCourseId === "vedic_math" ? (
                <>
                  <span className="tutor-feature-chip">📚 16 Chapters</span>
                  <span className="tutor-feature-chip">🧠 Mental Math</span>
                  <span className="tutor-feature-chip">🎯 Grades 5–10</span>
                  <span className="tutor-feature-chip">🤖 AI Coach</span>
                </>
              ) : (
                <>
                  <span className="tutor-feature-chip">🤖 AI Coach</span>
                  <span className="tutor-feature-chip">🎯 {learnerLabel}</span>
                </>
              )}
            </div>
          </div>

          {/* ── Coach intro ─────────────────────────────────────────────── */}
          <h2 className="tutor-qs-title">
            {minimalDuolingoLayout ? "Set Up Your Learning Path" : `Meet ${activeAvatar.name}, Your AI Coach`}
          </h2>

          {/* Teacher sprite */}
          <div className="tutor-qs-stage">
            <SpeakingTeacher
              avatar={activeAvatar}
              cue="intro"
              speaking={isSpeaking || status === "loading"}
              feedback={undefined}
            />
          </div>

          <p className="tutor-qs-tagline">
            {minimalDuolingoLayout
              ? (isDemoMode ? `Hi! Enter your name and grade below — I will set the right pace and we will get started!` : (lessonDuolingoArc?.onboarding?.coachIntro || `First tell ${activeAvatar.name} what you know. Then ${activeAvatar.name} will choose the right pace and start your mission.`))
              : "I will teach on the board, then push you through focused practice."}
          </p>

          {/* ── Resume Saved Place banner — shown above form when bookmark exists ── */}
          {minimalDuolingoLayout && savedBookmark ? (
            <div className="tutor-resume-banner">
              <div className="tutor-resume-info">
                <span className="tutor-resume-icon">📌</span>
                <div>
                  <p className="tutor-resume-title">Welcome back!</p>
                  <p className="tutor-resume-sub">{savedBookmark.lessonTitle || savedBookmark.chapterCode} · saved {new Date(savedBookmark.savedAt || Date.now()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
                </div>
              </div>
              <button
                type="button"
                className="tutor-resume-btn"
                onClick={() => { unlockAudio(); void resumeSavedSession(); }}
                disabled={status === "loading"}
              >
                ▶ Resume
              </button>
            </div>
          ) : null}

          {minimalDuolingoLayout ? (
            <div className="tutor-onboard-card">
              <label className="tutor-onboard-field">
                <span>Your name</span>
                <input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Type your name"
                  autoFocus={isDemoMode}
                />
              </label>

              {isDemoMode && (
                <div className="tutor-onboard-group">
                  <p className="tutor-onboard-label">Your grade</p>
                  <div className="tutor-chip-row" style={{ flexWrap: "wrap", gap: "0.4rem" }}>
                    {["3","4","5","6","7","8","9","10","11","12","Engineering"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`tutor-choice-chip${demoGrade === g ? " active" : ""}`}
                        onClick={() => setDemoGrade(g)}
                        style={{ minWidth: g === "Engineering" ? "auto" : "3rem" }}
                      >
                        {g === "Engineering" ? "🎓 Engg" : `G${g}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="tutor-onboard-group">
                <p className="tutor-onboard-label">Choose your coach</p>
                <div className="tutor-avatar-picker">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      className={`tutor-avatar-card${selectedAvatarId === av.id ? " active" : ""}`}
                      onClick={() => setSelectedAvatarId(av.id)}
                    >
                      <div className="tutor-avatar-card-img">
                        {av.style === "robot" ? (
                          <RobotAvatar size={72} expression="encouraging" compact variant={av.variant ?? "screen"} />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={AVATAR_STAGE_ART[av.id] ?? "/teacher_1/svg/view_front.svg"} alt={av.name} style={{ height: 72, objectFit: "contain" }} />
                        )}
                      </div>
                      <span className="tutor-avatar-card-name">{av.name}</span>
                      {selectedAvatarId === av.id && <span className="tutor-avatar-card-check">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional sections — 2-column compact grid on desktop, hidden on mobile */}
              <div className="tutor-onboard-optional-grid tutor-onboard-optional">

                <div className="tutor-onboard-group">
                  <p className="tutor-onboard-label">Teaching speed</p>
                  <div className="tutor-chip-row">
                    {([
                      { value: "relaxed", label: "🐢 Relaxed", sub: "Slow & clear" },
                      { value: "normal",  label: "🚶 Normal",  sub: "Steady pace" },
                      { value: "quick",   label: "⚡ Quick",   sub: "Fast pace"   },
                    ] as { value: "relaxed"|"normal"|"quick"; label: string; sub: string }[]).map(({ value, label, sub }) => (
                      <button
                        key={value}
                        type="button"
                        className={`tutor-choice-chip${teachingPace === value ? " active" : ""}`}
                        onClick={() => setTeachingPace(value)}
                        title={sub}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tutor-onboard-group">
                  <p className="tutor-onboard-label">Session language</p>
                  <div className="tutor-language-pill">English</div>
                </div>

                <div className="tutor-onboard-group">
                  <p className="tutor-onboard-label">Your level</p>
                  <div className="tutor-chip-row">
                    {(["beginner", "familiar", "confident"] as LearnerLevel[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`tutor-choice-chip${learnerLevel === value ? " active" : ""}`}
                        onClick={() => setLearnerLevel(value)}
                      >
                        {onboardingLevelChoices[value === "beginner" ? 0 : value === "familiar" ? 1 : 2]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tutor-onboard-group">
                  <p className="tutor-onboard-label">Session goal</p>
                  <div className="tutor-chip-row">
                    {(["school", "speed", "exam"] as LearnerGoal[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`tutor-choice-chip${learnerGoal === value ? " active" : ""}`}
                        onClick={() => setLearnerGoal(value)}
                      >
                        {onboardingGoalChoices[value === "school" ? 0 : value === "speed" ? 1 : 2]}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* savedBookmark resume card is rendered above the form — removed from here */}

              {lessonDuolingoArc?.onboarding?.placementRule ? (                <p className="tutor-onboard-note">{lessonDuolingoArc.onboarding.placementRule}</p>
              ) : null}
            </div>
          ) : null}

          {/* Start button */}
          <div className="tutor-qs-actions">
            {token.trim().length <= 20 && minimalDuolingoLayout && (
              <p className="tutor-qs-token-notice">
                🔒 Open this from your RoboDynamics dashboard to start
              </p>
            )}
            <button
              className="button tutor-qs-btn"
              onClick={() => { unlockAudio(); void startSession(); }}
              disabled={!canStart || status === "loading"}
              title={!canStart && token.trim().length <= 20 ? "Launch from your RoboDynamics dashboard" : undefined}
            >
              {status === "loading" ? "Starting…" : sessionId ? "↩ Restart Mission" : minimalDuolingoLayout ? "▶ Continue to Mission" : "Start Mission"}
            </button>
            {isDemoMode && !studentName.trim() && (
              <p className="muted" style={{ fontSize: "0.8rem", textAlign: "center" }}>Enter your name above to get started</p>
            )}
            <p className="tutor-qs-hint muted">
              Voice {voiceEnabled ? "on" : "off"} ·{" "}
              <button type="button" className="link-btn" onClick={() => setVoiceEnabled(v => !v)}>
                {voiceEnabled ? "turn off" : "turn on"}
              </button>
            </p>
          </div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
      </section>
      ) : null}

      {status === "ready" && question ? (
        minimalDuolingoLayout ? (
        <div className="vedic-mission-app">
          <header className="vedic-topbar">
            <div className="vedic-topbar-row">
              <div className="vedic-topbar-main">
                <button
                  className="vedic-topbar-exit"
                  type="button"
                  title="Save & go to dashboard"
                  onClick={exitToLms}
                >
                  ← Exit
                </button>
                <p className="vedic-topbar-label">Step {activeLessonStepIndex + 1} of {Math.max(lessonPath.length, 1)}</p>
                <h2 className="vedic-topbar-title">{missionTitle || activeDuolingoStep?.missionStepTitle || question.subtopic || activeChapter}</h2>
              </div>
              <div className="vedic-topbar-actions">
                <div className="vedic-stat-pill heart">{sessionProgress.hearts}/{sessionProgress.maxHearts} hearts</div>
                <button className="vedic-topbar-btn" type="button" onClick={pauseSession}>Pause & Save</button>
                <button
                  className="vedic-topbar-btn"
                  type="button"
                  title="Play coach audio"
                  onClick={() => {
                    if (isSpeaking) {
                      stopVoicePlayback();
                      return;
                    }
                    unlockAudio();
                    void speak(lessonListenLine);
                  }}
                >
                  {isSpeaking ? "Stop audio" : "Listen"}
                </button>
                <button
                  className={`vedic-topbar-btn ${voiceEnabled ? "active" : ""}`}
                  type="button"
                  onClick={() => {
                    if (!voiceEnabled) {
                      unlockAudio();
                    } else {
                      stopVoicePlayback();
                    }
                    setVoiceEnabled((value) => !value);
                  }}
                >
                  Voice {voiceEnabled ? "on" : "off"}
                </button>
              </div>
            </div>
            <div className="vedic-topbar-track">
              <div className="vedic-topbar-track-fill" style={{ width: `${sessionProgress.lessonCompletionPct}%` }} />
            </div>
            <div className="vedic-topbar-stats">
              <div className="vedic-stat-pill heart">♥ {sessionProgress.hearts}/{sessionProgress.maxHearts}</div>
              <div className="vedic-stat-pill xp">⚡ {sessionProgress.xp} XP</div>
              <div className="vedic-stat-pill streak">🔥 {sessionProgress.streak}</div>
              <div className="vedic-stat-pill points">{missionPoints} pts</div>
              <div className="vedic-stat-pill">🎯 {score.accuracyPct}%</div>
              <div className="vedic-stat-pill muted">{classElapsedLabel}</div>
            </div>
          </header>

          <div className="vedic-focus-shell">
            <section className={`vedic-focus-card ${awaitingStudentResponse ? "spotlight" : ""}`}>
              <div className="vedic-focus-top compact">
                <p className="vedic-kicker">{stageSceneMode === "coach" ? "Coach turn" : "Your turn"}</p>
                <div className="vedic-turn-stack">
                  <div className="vedic-turn-chip">{missionStatusLabel}</div>
                </div>
              </div>

              <div className={`vedic-focus-stage ${stageSceneMode}`}>
                <div className="vedic-focus-scene">
                  <div className="vedic-focus-coach">
                    {/* Avatar — col 1 (88px) */}
                    <div className="vedic-focus-avatar">
                      <SpeakingTeacher
                        avatar={activeAvatar}
                        cue={currentCue}
                        speaking={isSpeaking}
                        feedback={check?.correct}
                        compact={stageSceneMode === "student"}
                      />
                    </div>
                    {/* Speech bubble — col 2 (1fr), shown in coach mode */}
                    {stageSceneMode === "coach" && (teacherUtterance || missionPrompt) ? (
                      <div className="rd-speech-bubble">
                        {teacherUtterance || missionPrompt}
                      </div>
                    ) : stageSceneMode !== "coach" ? (
                      <div className="vedic-focus-copy">
                        <h3>{missionTryPrompt}</h3>
                        <p>{stageStatusText}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="vedic-focus-content">
                    {stageSceneMode === "coach" ? (
                      <>
                        {showInlineBoard ? (
                          <div className="vedic-inline-board vedic-focus-board">
                            <AnimatedBoard
                              steps={boardSteps}
                              runId={boardRunId}
                              showPrompt={isTeachingBoard}
                            />
                          </div>
                        ) : null}
                        <div className="vedic-focus-actions">
                          {showWorkedBoardSupport && !showInlineBoard ? (
                            <button className="button secondary" type="button" onClick={() => void teachOnBoard()} disabled={isTeachingBoard || isSpeaking}>
                              Show Steps
                            </button>
                          ) : null}
                          <button
                            className="button vedic-primary-btn"
                            type="button"
                            onClick={() => {
                              teachRunRef.current += 1;
                              teachingLockRef.current = false;
                              speakSeqRef.current += 1;
                              stopVoicePlayback();
                              stopListeningSession();
                              setIsTeachingBoard(false);
                              // Coach reads question aloud, then hands over to student
                              const qText = question?.questionText || activeDuolingoStep?.readAloudPrompt || "";
                              const tryLine = activeDuolingoStep?.tryPrompt || "Your turn — try this:";
                              if (voiceEnabled && qText) {
                                void speak(`${tryLine} ${qText}`).then(() => {
                                  setAwaitingStudentResponse(true);
                                });
                              } else {
                                setAwaitingStudentResponse(true);
                              }
                            }}
                            disabled={false}
                          >
                            Try It
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {isLoadingNextQuestion ? (
                          <div className="vedic-focus-panel question student">
                            <span className="vedic-prompt-label">Loading</span>
                            <p className="udemy-question-text"><strong>Loading the next question...</strong></p>
                            <p className="muted udemy-hint">{activeAvatar.name} is preparing your next step.</p>
                          </div>
                        ) : (
                          <>
                            <div className="vedic-focus-panel question student">
                              <span className="vedic-prompt-label">Try this</span>
                              <p className="udemy-question-text"><strong>{question.questionText}</strong></p>
                              {question.visual?.svg ? (
                                <div className="udemy-visual panel" dangerouslySetInnerHTML={{ __html: question.visual.svg }} />
                              ) : question.visual?.asset ? (
                                <div className="udemy-visual panel vedic-svg-asset">
                                  <img src={`/math-svgs/vedic/${question.visual.asset.endsWith('.svg') ? question.visual.asset : question.visual.asset + '.svg'}`} alt={question.visual.title || "Vedic Math diagram"} className="vedic-svg-img" />
                                  {question.visual.caption && <p className="vedic-svg-caption">{question.visual.caption}</p>}
                                </div>
                              ) : null}
                            </div>
                            <div className="vedic-answer-block vedic-answer-block-inline">
                              {sessionProgress.livesDepleted ? (
                                <div className="vedic-review-cta">
                                  <p className="vedic-alert">💔 No hearts left — answer correctly to refill and continue!</p>
                                </div>
                              ) : null}

                              {/* ── MCQ: tap-to-answer grid ── */}
                              {question.questionType === "mcq" && question.options && question.options.length > 0 ? (
                                <div className="mcq-grid" key={question.questionId}>
                                  <p className="udemy-answer-label" style={{ color: awaitingStudentResponse ? "#166534" : "#334155", marginBottom: "0.6rem" }}>Choose your answer:</p>
                                  <div className="mcq-options">
                                    {question.options.map((opt, idx) => {
                                      const isSelected = selectedMcqIndex === idx;
                                      const isChecked = !!check;
                                      const isCorrectOpt = question.correctIndex !== undefined
                                        ? question.correctIndex === idx
                                        : opt === check?.expectedAnswer;
                                      let optClass = "mcq-option";
                                      if (isChecked) {
                                        if (isCorrectOpt) optClass += " mcq-opt-correct";
                                        else if (isSelected) optClass += " mcq-opt-wrong";
                                        else optClass += " mcq-opt-dim";
                                      } else if (isSelected) {
                                        optClass += " mcq-opt-selected";
                                      }
                                      return (
                                        <button
                                          key={idx}
                                          className={optClass}
                                          disabled={isEvaluatingAnswer || (isChecked && check?.correct) || !canAttemptAnswer}
                                          onClick={() => {
                                            if (isEvaluatingAnswer || (isChecked && check?.correct)) return;
                                            setSelectedMcqIndex(idx);
                                            setAnswer(opt);
                                            setLastAnswerMode("typed");
                                            void checkAnswer(opt);
                                          }}
                                        >
                                          <span className="mcq-opt-letter">{String.fromCharCode(65 + idx)}</span>
                                          <span className="mcq-opt-text">{opt}</span>
                                          {isChecked && isCorrectOpt ? <span className="mcq-opt-tick">✓</span> : null}
                                          {isChecked && isSelected && !isCorrectOpt ? <span className="mcq-opt-cross">✗</span> : null}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="vedic-action-row" style={{ marginTop: "0.75rem" }}>
                                    <button
                                      className="button secondary"
                                      type="button"
                                      onClick={() => { setCheck(null); stopListeningSession(); setAwaitingStudentResponse(false); void teachOnBoard(); }}
                                      disabled={isTeachingBoard || isSpeaking}
                                    >Show Steps</button>
                                    <button className="button secondary" onClick={() => { void nextQuestion({ directToStudent: true, source: "skip" }); }}>Skip</button>
                                  </div>
                                </div>

                              /* ── Fill-the-Step: guided sutra walk ── */
                              ) : question.questionType === "fill_step" && question.steps && question.steps.length > 0 ? (
                                <div className="fill-step-block" key={question.questionId}>
                                  <p className="udemy-answer-label" style={{ color: awaitingStudentResponse ? "#166534" : "#334155", marginBottom: "0.6rem" }}>Complete each step of the sutra:</p>
                                  <div className="fill-step-list">
                                    {question.steps.map((step, idx) => {
                                      const isDone = fillStepResults[idx] === true;
                                      const isActive = idx === fillStepIndex && !isDone;
                                      const isPast = idx < fillStepIndex;
                                      const isFuture = idx > fillStepIndex;
                                      return (
                                        <div key={idx} className={`fill-step-row ${isDone ? "fs-done" : isActive ? "fs-active" : isFuture ? "fs-future" : "fs-past"}`}>
                                          <div className="fs-label">
                                            <span className="fs-num">{idx + 1}</span>
                                            <span className="fs-text">{step.label}</span>
                                          </div>
                                          {isDone || isPast ? (
                                            <div className="fs-done-val">
                                              <span className="fs-tick">✓</span>
                                              <span>{fillStepInputs[idx] ?? step.answer}</span>
                                            </div>
                                          ) : isActive ? (
                                            <div className="fs-input-row">
                                              <input
                                                autoFocus
                                                className={`vedic-answer-input fs-input${fillStepErrors[idx] ? " fs-input-error" : ""}`}
                                                placeholder="Your answer"
                                                value={fillStepInputs[idx] ?? ""}
                                                disabled={isEvaluatingAnswer}
                                                onChange={(e) => {
                                                  const copy = [...fillStepInputs];
                                                  copy[idx] = e.target.value;
                                                  setFillStepInputs(copy);
                                                  // clear error when user starts typing
                                                  if (fillStepErrors[idx]) {
                                                    const errs = [...fillStepErrors]; errs[idx] = "";
                                                    setFillStepErrors(errs);
                                                  }
                                                }}
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const val = (fillStepInputs[idx] ?? "").trim();
                                                    if (!val) return;
                                                    const expected = (step.answer ?? "").trim().toLowerCase().replace(/\s/g, "");
                                                    const got = val.toLowerCase().replace(/\s/g, "");
                                                    const correct = got === expected;
                                                    if (correct) {
                                                      dbg("FILL", `step ${idx} ✅ correct (Enter)`, { val, expected });
                                                      const res = [...fillStepResults]; res[idx] = true;
                                                      setFillStepResults(res);
                                                      const nextIdx = idx + 1;
                                                      setFillStepIndex(nextIdx);
                                                      if (nextIdx >= (question.steps?.length ?? 0)) {
                                                        void checkAnswer(question.steps?.[question.steps.length - 1]?.answer ?? val);
                                                      }
                                                    } else {
                                                      const wrongCount = (fillStepWrongCounts[idx] ?? 0) + 1;
                                                      dbg("FILL", `step ${idx} ❌ wrong #${wrongCount} (Enter)`, { val, expected });
                                                      const wc = [...fillStepWrongCounts]; wc[idx] = wrongCount;
                                                      setFillStepWrongCounts(wc);
                                                      const errs = [...fillStepErrors];
                                                      errs[idx] = wrongCount >= 3 ? `The answer is ${step.answer}` : "Not quite — try again!";
                                                      setFillStepErrors(errs);
                                                      if (wrongCount >= 3) {
                                                        // Auto-reveal and advance after 3 wrong attempts
                                                        const inp = [...fillStepInputs]; inp[idx] = step.answer ?? "";
                                                        setFillStepInputs(inp);
                                                        window.setTimeout(() => {
                                                          const res = [...fillStepResults]; res[idx] = true;
                                                          setFillStepResults(res);
                                                          const nextIdx = idx + 1;
                                                          setFillStepIndex(nextIdx);
                                                          if (nextIdx >= (question.steps?.length ?? 0)) {
                                                            void checkAnswer(question.steps?.[question.steps.length - 1]?.answer ?? step.answer ?? "");
                                                          }
                                                        }, 1200);
                                                      }
                                                    }
                                                  }
                                                }}
                                              />
                                              <button
                                                className="button vedic-primary-btn fs-submit"
                                                disabled={isEvaluatingAnswer || !(fillStepInputs[idx] ?? "").trim()}
                                                onClick={() => {
                                                  const val = (fillStepInputs[idx] ?? "").trim();
                                                  if (!val) return;
                                                  const expected = (step.answer ?? "").trim().toLowerCase().replace(/\s/g, "");
                                                  const got = val.toLowerCase().replace(/\s/g, "");
                                                  const correct = got === expected;
                                                  if (correct) {
                                                    dbg("FILL", `step ${idx} ✅ correct (click)`, { val, expected });
                                                    const res = [...fillStepResults]; res[idx] = true;
                                                    setFillStepResults(res);
                                                    const nextIdx = idx + 1;
                                                    setFillStepIndex(nextIdx);
                                                    if (nextIdx >= (question.steps?.length ?? 0)) {
                                                      void checkAnswer(question.steps?.[question.steps.length - 1]?.answer ?? val);
                                                    }
                                                  } else {
                                                    const wrongCount = (fillStepWrongCounts[idx] ?? 0) + 1;
                                                    dbg("FILL", `step ${idx} ❌ wrong #${wrongCount} (click)`, { val, expected });
                                                    const wc = [...fillStepWrongCounts]; wc[idx] = wrongCount;
                                                    setFillStepWrongCounts(wc);
                                                    const errs = [...fillStepErrors];
                                                    errs[idx] = wrongCount >= 3 ? `The answer is ${step.answer}` : "Not quite — try again! ❌";
                                                    setFillStepErrors(errs);
                                                    if (wrongCount >= 3) {
                                                      // Reveal answer, auto-advance after 1.2s
                                                      const inp = [...fillStepInputs]; inp[idx] = step.answer ?? "";
                                                      setFillStepInputs(inp);
                                                      window.setTimeout(() => {
                                                        const res = [...fillStepResults]; res[idx] = true;
                                                        setFillStepResults(res);
                                                        const nextIdx = idx + 1;
                                                        setFillStepIndex(nextIdx);
                                                        if (nextIdx >= (question.steps?.length ?? 0)) {
                                                          void checkAnswer(question.steps?.[question.steps.length - 1]?.answer ?? step.answer ?? "");
                                                        }
                                                      }, 1200);
                                                    }
                                                  }
                                                }}
                                              >
                                                {isEvaluatingAnswer && idx === fillStepIndex ? "Checking…" : "→"}
                                              </button>
                                              {fillStepErrors[idx] ? (
                                                <span className={`fs-error${(fillStepWrongCounts[idx] ?? 0) >= 3 ? " fs-reveal" : ""}`}>
                                                  {fillStepErrors[idx]}
                                                </span>
                                              ) : step.hint ? <span className="fs-hint muted">{step.hint}</span> : null}
                                            </div>
                                          ) : (
                                            <div className="fs-future-placeholder">—</div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="vedic-action-row" style={{ marginTop: "0.75rem" }}>
                                    <button
                                      className="button secondary"
                                      type="button"
                                      onClick={() => { setCheck(null); stopListeningSession(); setAwaitingStudentResponse(false); void teachOnBoard(); }}
                                      disabled={isTeachingBoard || isSpeaking}
                                    >Show Steps</button>
                                    <button className="button secondary" onClick={() => { void nextQuestion({ directToStudent: true, source: "skip" }); }}>Skip</button>
                                  </div>
                                </div>

                              /* ── Default: text input (existing behaviour) ── */
                              ) : (
                                <>
                                  <label
                                    htmlFor="answerInput"
                                    className="udemy-answer-label"
                                    style={{ color: awaitingStudentResponse ? "#166534" : "#334155" }}
                                  >
                                    Your Answer
                                  </label>
                                  <input
                                    key={question?.questionId}
                                    id="answerInput"
                                    ref={answerInputRef}
                                    autoComplete="new-password"
                                    disabled={isEvaluatingAnswer}
                                    value={answer}
                                    onChange={(e) => {
                                      setAnswer(e.target.value);
                                      setLastAnswerMode("typed");
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        void checkAnswer();
                                      }
                                    }}
                                    placeholder="Type your answer"
                                    className="vedic-answer-input"
                                  />
                                  <p className="muted udemy-hint">Answer the question above.</p>
                                  {micPermission === "denied" ? (
                                    <p className="muted" style={{ marginTop: "0.35rem", marginBottom: 0 }}>
                                      Microphone access is blocked. Use text input.
                                    </p>
                                  ) : null}
                                  <div className="vedic-action-row">
                                    <button className="button vedic-primary-btn" onClick={() => void checkAnswer()} disabled={isEvaluatingAnswer || !canAttemptAnswer}>
                                      {isEvaluatingAnswer ? "Checking..." : "Check"}
                                    </button>
                                    <button
                                      className="button secondary"
                                      type="button"
                                      onClick={() => {
                                        setCheck(null);
                                        stopListeningSession();
                                        setAwaitingStudentResponse(false);
                                        void teachOnBoard();
                                      }}
                                      disabled={isTeachingBoard || isSpeaking}
                                    >
                                      Show Steps
                                    </button>
                                    <button
                                      className="button secondary"
                                      type="button"
                                      onClick={listenAnswer}
                                      disabled={isEvaluatingAnswer || isListening || micPermission === "denied" || !canAttemptAnswer}
                                    >
                                      {micPermission === "denied" ? "Mic Blocked" : isListening ? "Listening..." : "Speak"}
                                    </button>
                                    {isListening ? (
                                      <button
                                        className="button secondary"
                                        type="button"
                                        onClick={() => {
                                          stopListeningSession();
                                          setAwaitingStudentResponse(true);
                                          addConversationTurn("system", "system", "Voice listening stopped by student.", { source: "listen_stop" });
                                        }}
                                      >
                                        Stop
                                      </button>
                                    ) : null}
                                    <button className="button secondary" onClick={() => { void nextQuestion({ directToStudent: true, source: "skip" }); }}>Skip</button>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {check ? (
                      <div className={`udemy-feedback ${check.correct ? "correct" : "wrong"}`}>
                        <p className="udemy-feedback-verdict">
                          {check.correct ? "✅ Correct!" : "Try Again"}
                        </p>
                        <p className="muted">{check.correct ? (activeDuolingoStep?.instantFeedbackWin || missionCelebration) : (activeDuolingoStep?.instantFeedbackRetry || check.encouragement)}</p>
                        {check.coachTip ? <p className="muted">💡 Tip: {check.coachTip}</p> : null}
                        {!check.correct ? <p><strong>Expected:</strong> {check.expectedAnswer}</p> : null}
                        <p style={{ marginBottom: 0 }}><strong>Explanation:</strong> {check.explanation}</p>

                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {false ? (
          <div className="vedic-main-layout">
            <aside className="vedic-sidekick">
              <section className="vedic-coach-card">
                <div className="vedic-coach-head">
                  <div className="vedic-coach-avatar">
                    <SpeakingTeacher
                      avatar={activeAvatar}
                      cue={currentCue}
                      speaking={isSpeaking}
                      feedback={check?.correct}
                    />
                  </div>
                  <div className="vedic-coach-copy">
                    <p className="vedic-kicker">{workspaceLabel}</p>
                    <h3>{missionStatusLabel}</h3>
                    <p>{missionPrompt}</p>
                  </div>
                </div>
                <div className="vedic-status-row">
                  <div className="vedic-status-tile">
                    <span>Next Reward</span>
                    <strong>{rewardXpLeft} XP</strong>
                  </div>
                  <div className="vedic-status-tile">
                    <span>Mastery</span>
                    <strong>{sessionProgress.masteryPct}%</strong>
                  </div>
                  <div className="vedic-status-tile">
                    <span>{activeDuolingoStep?.badgeFocus ? "Badge Focus" : "Attempts"}</span>
                    <strong>{activeDuolingoStep?.badgeFocus || score.attempts}</strong>
                  </div>
                </div>
                <p className="vedic-coach-note">{rewardUnitPrompt}</p>
                <div className="vedic-badge-strip">
                  {(activeMissionBadges.length ? activeMissionBadges : missionBadges.slice(0, 3)).slice(0, 3).map((badge) => (
                    <div key={badge.title} className={`vedic-badge-chip${badge.active ? " active" : ""}`}>
                      <strong>{badge.icon}</strong>
                      <span>{badge.title}</span>
                    </div>
                  ))}
                </div>
              </section>

              {showLessonPathRail ? (
              <section className="vedic-path-card">
                <div className="vedic-path-header">
                  <div>
                    <p className="vedic-kicker">Lesson Path</p>
                    <h3>{activeDuolingoStep?.missionStepTitle || `${activeExerciseGroup}: ${question?.subtopic || activeTeachingStep?.subtopic || "Current Step"}`}</h3>
                  </div>
                  <strong>{activeLessonStepIndex + 1}/{Math.max(lessonPath.length, 1)}</strong>
                </div>
                <div className="vedic-path-track">
                  {lessonPath.map((item, idx) => (
                    <div
                      key={`${item.exerciseGroup}_${item.subtopic}`}
                      className={`vedic-path-node ${item.status} ${item.exerciseGroup === activeExerciseGroup ? "active" : ""}`}
                      style={{ ["--path-offset" as string]: `${idx % 2 === 0 ? 0 : 18}px` }}
                    >
                      <span className="vedic-path-badge">
                        {item.status === "completed" ? "✓" : item.status === "locked" ? "🔒" : item.exerciseGroup}
                      </span>
                      <span className="vedic-path-name">{item.subtopic}</span>
                    </div>
                  ))}
                </div>
              </section>
              ) : null}
            </aside>

            <section className="vedic-stage">
              <div className={`vedic-question-card${awaitingStudentResponse ? " spotlight" : ""}`}>
                <div className="vedic-question-top">
                  <div>
                    <p className="vedic-kicker">Step {activeLessonStepIndex + 1} of {Math.max(lessonPath.length, 1)}</p>
                    <h2>{activeDuolingoStep?.missionStepTitle || question?.subtopic || activeTeachingStep?.subtopic || missionTitle}</h2>
                    <p className="vedic-question-subtitle">{missionPromise}</p>
                  </div>
                  <div className="vedic-turn-chip">{missionStatusLabel}</div>
                </div>

                <div className="vedic-inline-coach">
                  <div className="vedic-inline-avatar">
                    <SpeakingTeacher
                      avatar={activeAvatar}
                      cue={currentCue}
                      speaking={isSpeaking}
                      feedback={check?.correct}
                    />
                  </div>
                  <div className="vedic-inline-copy">
                    <p className="vedic-kicker">{workspaceLabel}</p>
                    <h3>{missionStatusLabel}</h3>
                    <p>{missionPrompt}</p>
                  </div>
                  <div className="vedic-inline-stats">
                    <div className="vedic-inline-stat">
                      <span>Reward</span>
                      <strong>{rewardXpLeft} XP</strong>
                    </div>
                    <div className="vedic-inline-stat">
                      <span>Mastery</span>
                      <strong>{sessionProgress.masteryPct}%</strong>
                    </div>
                    <div className="vedic-inline-stat">
                      <span>{activeDuolingoStep?.badgeFocus ? "Badge" : "Attempts"}</span>
                      <strong>{activeDuolingoStep?.badgeFocus || score.attempts}</strong>
                    </div>
                  </div>
                </div>

                {showLessonPathRail ? (
                  <div className="vedic-path-strip">
                    {lessonPath.map((item) => (
                      <div
                        key={`${item.exerciseGroup}_${item.subtopic}`}
                        className={`vedic-path-pill ${item.status} ${item.exerciseGroup === activeExerciseGroup ? "active" : ""}`}
                      >
                        <span className="vedic-path-pill-badge">
                          {item.status === "completed" ? "✓" : item.status === "locked" ? "🔒" : item.exerciseGroup}
                        </span>
                        <span>{item.subtopic}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="vedic-question-scroll">
                  <div className="vedic-prompt-stack">
                    <div className="vedic-prompt-card coach">
                      <span className="vedic-prompt-label">{activeAvatar.name} says</span>
                      <p>{missionReadPrompt}</p>
                    </div>
                    <div className="vedic-prompt-card try">
                      <span className="vedic-prompt-label">Your mission</span>
                      <p>{missionTryPrompt}</p>
                    </div>
                  </div>
                  <div className="udemy-question-meta">
                    <span className="pill">{question?.skill}</span>
                    <span className="pill">Difficulty: {question?.difficulty}</span>
                    <span className="pill">Reward: {activeDuolingoStep?.xpReward || rewardXpLeft} XP</span>
                    {activeDuolingoStep?.badgeFocus ? <span className="pill">{activeDuolingoStep?.badgeFocus}</span> : null}
                  </div>
                  <p className="vedic-progress-copy">{rewardCelebrationPrompt}</p>
                  <p className="udemy-question-text"><strong>{question?.questionText}</strong></p>
                  {question?.visual?.svg ? (
                    <div className="udemy-visual panel" dangerouslySetInnerHTML={{ __html: question?.visual?.svg || "" }} />
                  ) : question?.visual?.asset ? (
                    <div className="udemy-visual panel vedic-svg-asset">
                      <img src={`/math-svgs/vedic/${question?.visual?.asset?.endsWith('.svg') ? question?.visual?.asset : (question?.visual?.asset ?? '') + '.svg'}`} alt={question?.visual?.title || "Vedic Math diagram"} className="vedic-svg-img" />
                      {question?.visual?.caption && <p className="vedic-svg-caption">{question?.visual?.caption}</p>}
                    </div>
                  ) : null}
                  {showBoardPanel ? (
                    <div className="vedic-inline-board">
                      <AnimatedBoard
                        steps={boardSteps}
                        runId={boardRunId}
                        showPrompt={isTeachingBoard}
                      />
                    </div>
                  ) : null}

                  <div className="vedic-answer-block">
                    <label
                      htmlFor="answerInput"
                      className="udemy-answer-label"
                      style={{ color: awaitingStudentResponse ? "#166534" : "#334155" }}
                    >
                      Your Answer
                    </label>
                    <input
                      key={question?.questionId}
                      id="answerInput"
                      ref={answerInputRef}
                      autoComplete="new-password"
                      disabled={isEvaluatingAnswer}
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                        setLastAnswerMode("typed");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void checkAnswer();
                        }
                      }}
                      placeholder="Type your answer"
                      className="vedic-answer-input"
                    />
                    <p className="muted udemy-hint">Hint: {missionHintPrompt}</p>
                    {micPermission === "denied" ? (
                      <p className="muted" style={{ marginTop: "0.35rem", marginBottom: 0 }}>
                        Microphone access is blocked. Use text input.
                      </p>
                    ) : null}
                    {sessionProgress.livesDepleted ? (
                      <div className="vedic-review-cta">
                        <p className="vedic-alert">💔 No hearts left — answer this question correctly to refill and continue!</p>
                      </div>
                    ) : null}

                    <div className="vedic-action-row">
                      <button className="button vedic-primary-btn" onClick={() => void checkAnswer()} disabled={isEvaluatingAnswer || !canAttemptAnswer}>
                        {isEvaluatingAnswer ? "Checking..." : "Check"}
                      </button>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={listenAnswer}
                        disabled={isEvaluatingAnswer || isListening || micPermission === "denied" || !canAttemptAnswer}
                      >
                        {micPermission === "denied" ? "Mic Blocked" : isListening ? "Listening..." : "Speak"}
                      </button>
                      {isListening ? (
                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => {
                            stopListeningSession();
                            setAwaitingStudentResponse(true);
                            addConversationTurn("system", "system", "Voice listening stopped by student.", { source: "listen_stop" });
                          }}
                        >
                          Stop
                        </button>
                      ) : null}
                      <button className="button secondary" type="button" onClick={() => void speak(missionReadPrompt)}>
                        Read Question
                      </button>
                      <button className="button secondary" onClick={() => { void nextQuestion({ directToStudent: true, source: "skip" }); }}>Skip</button>
                    </div>
                  </div>

                  {check ? (
                      <div className={`udemy-feedback ${check?.correct ? "correct" : "wrong"}`}>
                        <p className="udemy-feedback-verdict">
                          {check?.correct ? "✅ Correct!" : "Try Again"}
                        </p>
                      <p className="muted">{check?.correct ? (activeDuolingoStep?.instantFeedbackWin || missionCelebration) : (activeDuolingoStep?.instantFeedbackRetry || check?.encouragement)}</p>
                      {check?.coachTip ? <p className="muted">💡 Tip: {check?.coachTip}</p> : null}
                      {!check?.correct ? <p><strong>Expected:</strong> {check?.expectedAnswer}</p> : null}
                      <p style={{ marginBottom: 0 }}><strong>Explanation:</strong> {check?.explanation}</p>

                    </div>
                  ) : null}
                </div>

                <div className="vedic-support-grid">
                  {showWorkedBoardSupport ? (
                  <details className="vedic-fold">
                    <summary>{showBoardPanel ? "Worked Board" : "Show Board Help"}</summary>
                    <div className="vedic-fold-body">
                      <div className="vedic-board-frame">
                        {showBoardPanel ? (
                          <AnimatedBoard
                            steps={boardSteps}
                            runId={boardRunId}
                            showPrompt={isTeachingBoard}
                          />
                        ) : (
                          <div className="ca-board-idle">
                            {awaitingStudentResponse ? (
                              <>
                                <span className="ca-idle-icon">✏️</span>
                                <p className="ca-idle-text">Try it first, then open the board if needed.</p>
                              </>
                            ) : (
                              <>
                                <span className="ca-idle-icon">📋</span>
                                <p className="ca-idle-text">Raj can show the steps on the board.</p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="vedic-board-actions">
                        <button className="button" type="button" onClick={() => void teachOnBoard()} disabled={isTeachingBoard || isSpeaking}>
                          Show Steps
                        </button>
                        <button className="button secondary" type="button" onClick={clearBoard}>
                          Clear
                        </button>
                      </div>
                    </div>
                  </details>
                  ) : null}

                  {showHelpDrawer ? (
                  <details className="vedic-fold">
                    <summary>Ask {activeAvatar.name} for Help</summary>
                    <div className="vedic-fold-body">
                      <div className="udemy-qa-dock vedic-help-panel">
                        <p className="vedic-help-note">{reviewPracticePrompt}</p>
                        {doubtTurns.length ? (
                          <div className="udemy-chat-history">
                            {doubtTurns.map((turn) => (
                              <div
                                key={turn.id}
                                className={`udemy-chat-bubble ${turn.role === "student" ? "student" : "tutor"}`}
                                style={{ ["--accent" as string]: activeAvatar.color }}
                              >
                                <div className="udemy-bubble-text">{turn.text}</div>
                                <span className="udemy-bubble-name">
                                  {turn.role === "student" ? "You" : activeAvatar.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        <div className="udemy-chat-input-row">
                          <textarea
                            value={doubt}
                            onChange={(e) => setDoubt(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void askDoubt();
                              }
                            }}
                            rows={2}
                            placeholder="Type a doubt and press Enter..."
                            className="udemy-chat-input"
                          />
                          <button className="button secondary" onClick={() => void askDoubt()} disabled={!doubt.trim()}>
                            Ask
                          </button>
                        </div>
                      </div>
                    </div>
                  </details>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
          ) : null}
        </div>
        ) : (
        <div className={`ca-app${minimalDuolingoLayout ? " ca-app-minimal" : ""}`}>

          {/* ── Slim progress strip ───────────────────────────── */}
          <div className="ca-strip">
            <span className="ca-strip-chapter">{missionTitle}</span>
            <div className="ca-strip-bar-wrap">
              <div className="ca-strip-bar" style={{ width: `${sessionProgress.lessonCompletionPct}%` }} />
            </div>
            <span className="ca-strip-stat">♥ {sessionProgress.hearts}/{sessionProgress.maxHearts}</span>
            <span className="ca-strip-stat">⚡ {sessionProgress.xp} XP</span>
            <span className="ca-strip-stat">🔥 {sessionProgress.streak}</span>
            {minimalDuolingoLayout ? (
              <span className="ca-strip-stat ca-strip-points">{missionPoints} pts</span>
            ) : null}
            <span className="ca-strip-stat">🎯 {score.accuracyPct}%</span>
            <span className="ca-strip-stat muted">{classElapsedLabel}</span>
          </div>

          {/* ── Coach layout: left panel + right content ─────── */}
          <div className="ca-body">

            {/* ── LEFT: Coach panel ─────────────────────────── */}
            <div className="ca-coach">

              {/* Raj sprite */}
              <div className="ca-coach-stage">
                <SpeakingTeacher
                  avatar={activeAvatar}
                  cue={currentCue}
                  speaking={isSpeaking}
                  feedback={check?.correct}
                />
              </div>

              {/* Speech bubble */}
              <div className="ca-coach-speech">
                <p>{teacherUtterance || activeTeachingStep?.teacherLine || "Let's win this step."}</p>
              </div>

              {/* Coach nav */}
              <div className="ca-coach-nav">
                {minimalDuolingoLayout ? (
                  <div className="ca-mission-card">
                    <p className="ca-nav-label">Today&apos;s Mission</p>
                    <h3 className="ca-mission-title">{missionTitle}</h3>
                    <p className="ca-mission-copy">
                      {workspaceLabel} | Reach {nextRewardXp} XP for the next reward.
                    </p>
                    <div className="ca-reward-row">
                      <span className="ca-reward-chip">{missionPoints} points</span>
                      <span className="ca-reward-chip">{activeMissionBadges.length || 1} badges active</span>
                    </div>
                    <div className="ca-badge-row">
                      {(activeMissionBadges.length ? activeMissionBadges : missionBadges.slice(0, 2)).slice(0, 3).map((badge) => (
                        <div key={badge.title} className={`ca-badge${badge.active ? " active" : ""}`}>
                          <strong>{badge.icon}</strong>
                          <span>{badge.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="ca-nav-label">Course | {chapterList.length} Chapters</p>
                    <div className="ca-chapter-list">
                      {chapterList.map((c, idx) => (
                        <div
                          key={c.chapterCode}
                          className={`ca-chapter-item${c.chapterCode === activeChapter ? " active" : ""}`}
                        >
                          <span className="ca-ch-num">{String(idx + 1).padStart(2, "0")}</span>
                          <span className="ca-ch-name">{c.title}</span>
                          {c.chapterCode === activeChapter
                            ? <span className="ca-ch-badge">Now</span>
                            : null}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <p className="ca-nav-label" style={{ marginTop: "0.8rem" }}>
                  {minimalDuolingoLayout ? "Lesson Path" : "Exercise Flow"}
                </p>
                <div className="ca-ex-list">
                  {lessonPath.map((item) => (
                    <div
                      key={`${item.exerciseGroup}_${item.subtopic}`}
                      className={`ca-ex-item${item.exerciseGroup === activeExerciseGroup ? " active" : ""}`}
                      style={
                        item.status === "completed"
                          ? { color: "#4ade80" }
                          : item.status === "locked"
                            ? { opacity: 0.4 }
                            : {}
                      }
                    >
                      <span className="ca-ex-dot">
                        {item.status === "completed" ? "✓" : item.status === "locked" ? "🔒" : "›"}
                      </span>
                      <span className="ca-ex-name">{item.subtopic}</span>
                      <span className="ca-ex-grp">{item.exerciseGroup}</span>
                    </div>
                  ))}
                </div>

                {/* Mini progress stats */}
                <div className="ca-mini-stats">
                  <div className="ca-mini-stat"><span>Mastery</span><strong>{sessionProgress.masteryPct}%</strong></div>
                  <div className="ca-mini-stat"><span>Attempts</span><strong>{score.attempts}</strong></div>
                  <div className="ca-mini-stat"><span>Lesson</span><strong>{sessionProgress.lessonCompletionPct}%</strong></div>
                  <div className="ca-mini-stat"><span>{minimalDuolingoLayout ? "Reward" : "Ex."}</span><strong>{minimalDuolingoLayout ? `${nextRewardXp - sessionProgress.xp} XP` : activeExerciseGroup}</strong></div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Content panel ──────────────────────── */}
            <div className="ca-content">

              {/* Board */}
              <div className="ca-board">
                {showBoardPanel ? (
                  <AnimatedBoard
                    steps={boardSteps}
                    runId={boardRunId}
                    showPrompt={isTeachingBoard}
                  />
                ) : (
                  <div className="ca-board-idle">
                    {awaitingStudentResponse ? (
                      <>
                        <span className="ca-idle-icon">✏️</span>
                        <p className="ca-idle-text">Answer the question below!</p>
                      </>
                    ) : (
                      <>
                        <span className="ca-idle-icon">📋</span>
                        <p className="ca-idle-text">Board ready — click Teach on Board</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Board toolbar */}
              <div className="ca-board-bar">
                <div className="ca-speed-row">
                  <label htmlFor="caBoardSpeed">Speed {boardSpeed.toFixed(1)}x</label>
                  <input
                    id="caBoardSpeed"
                    type="range" min={0.7} max={1.5} step={0.1}
                    value={boardSpeed}
                    onChange={(e) => setBoardSpeed(Number(e.target.value))}
                  />
                </div>
                <button className="button" type="button" onClick={() => void teachOnBoard()} disabled={isTeachingBoard || isSpeaking}>
                  ▶ Teach on Board
                </button>
                <button className="button secondary" type="button" onClick={() => void speak(`${question.questionText}. ${question.hint}`)}>
                  🔊 Speak
                </button>
                <button className="button secondary" type="button" onClick={clearBoard}>
                  Clear
                </button>
              </div>

              {/* Question zone */}
              {showExercisePanel ? (
                <div className={`ca-question${awaitingStudentResponse ? " spotlight" : ""}`}>
                  <div className="ca-question-head">
                    <p className="ca-question-label">{workspaceLabel}</p>
                    {minimalDuolingoLayout ? (
                      <p className="ca-question-subtle">Solve this step to keep your streak and earn more points.</p>
                    ) : null}
                  </div>
                  <div className="udemy-question-meta">
                    <span className="pill">{question.skill}</span>
                    <span className="pill">Difficulty: {question.difficulty}</span>
                  </div>
                  <p className="udemy-question-text"><strong>{question.questionText}</strong></p>
                  {question.visual?.svg ? (
                    <div className="udemy-visual panel" dangerouslySetInnerHTML={{ __html: question.visual.svg }} />
                  ) : question.visual?.asset ? (
                    <div className="udemy-visual panel vedic-svg-asset">
                      <img src={`/math-svgs/vedic/${question.visual.asset.endsWith('.svg') ? question.visual.asset : question.visual.asset + '.svg'}`} alt={question.visual.title || "Vedic Math diagram"} className="vedic-svg-img" />
                      {question.visual.caption && <p className="vedic-svg-caption">{question.visual.caption}</p>}
                    </div>
                  ) : null}
                  <label
                    htmlFor="answerInput"
                    className="udemy-answer-label"
                    style={{ color: awaitingStudentResponse ? "#0f766e" : "#334155" }}
                  >
                    Your Answer
                  </label>
                  <input
                    key={question?.questionId}
                    id="answerInput"
                    ref={answerInputRef}
                    autoComplete="new-password"
                    disabled={isEvaluatingAnswer}
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      setLastAnswerMode("typed");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void checkAnswer();
                      }
                    }}
                    placeholder="Type your answer (e.g. 10)"
                    style={{
                      borderWidth: awaitingStudentResponse ? "2px" : "1px",
                      borderColor: awaitingStudentResponse ? "#0f766e" : "#cbd5e1",
                      boxShadow: awaitingStudentResponse ? "0 0 0 3px rgba(15,118,110,0.12)" : "none"
                    }}
                  />
                  <p className="muted udemy-hint">Hint: {question.hint}</p>
                  {micPermission === "denied" ? (
                    <p className="muted" style={{ marginTop: "0.35rem", marginBottom: 0 }}>
                      Microphone access is blocked. Use text input.
                    </p>
                  ) : null}
                  {sessionProgress.livesDepleted ? (
                    <p style={{ marginTop: "0.35rem", marginBottom: 0, color: "#b91c1c", fontWeight: 700 }}>
                      💔 No hearts left — answer correctly to refill and continue!
                    </p>
                  ) : null}
                  <div className="udemy-answer-actions">
                    <button className="button" onClick={() => void checkAnswer()} disabled={isEvaluatingAnswer || !canAttemptAnswer}>
                      {isEvaluatingAnswer ? "Checking..." : "Check ✅"}
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={listenAnswer}
                      disabled={isEvaluatingAnswer || isListening || micPermission === "denied" || !canAttemptAnswer}
                    >
                      {micPermission === "denied" ? "Mic Blocked" : isListening ? "Listening\u2026" : "Speak Answer"}
                    </button>
                    {isListening ? (
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => {
                          stopListeningSession();
                          setAwaitingStudentResponse(true);
                          addConversationTurn("system", "system", "Voice listening stopped by student.", { source: "listen_stop" });
                        }}
                      >
                        Stop
                      </button>
                    ) : null}
                    <button className="button secondary" onClick={() => { void nextQuestion(); }}>Next</button>
                  </div>

                  {/* Feedback */}
                  {check ? (
                    <div className={`udemy-feedback ${check.correct ? "correct" : "wrong"}`}>
                      <p className="udemy-feedback-verdict">
                        {check.correct ? "✅ Correct! 🎉" : "❌ Try Again 💪"}
                      </p>
                      <p className="muted">{check.encouragement}</p>
                      {check.coachTip ? <p className="muted">💡 Tip: {check.coachTip}</p> : null}
                      <p><strong>Expected:</strong> {check.expectedAnswer}</p>
                      <p style={{ marginBottom: 0 }}><strong>Explanation:</strong> {check.explanation}</p>
                    </div>
                  ) : null}

                  {/* Q&A dock */}
                  {minimalDuolingoLayout ? (
                    <details className="ca-help-drawer">
                      <summary>Need help from {activeAvatar.name}?</summary>
                      <div className="udemy-qa-dock ca-help-dock">
                        <h3 className="udemy-qa-title">Ask {activeAvatar.name} a Quick Doubt</h3>
                        {conversationLog.filter((t) => t.channel === "doubt").length > 0 && (
                          <div className="udemy-chat-history">
                            {conversationLog.filter((t) => t.channel === "doubt").map((turn) => (
                              <div
                                key={turn.id}
                                className={`udemy-chat-bubble ${turn.role === "student" ? "student" : "tutor"}`}
                                style={{ ["--accent" as string]: activeAvatar.color }}
                              >
                                <div className="udemy-bubble-text">{turn.text}</div>
                                <span className="udemy-bubble-name">
                                  {turn.role === "student" ? "You" : activeAvatar.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="udemy-chat-input-row">
                          <textarea
                            value={doubt}
                            onChange={(e) => setDoubt(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void askDoubt();
                              }
                            }}
                            rows={2}
                            placeholder="Type a doubt and press Enter\u2026"
                            className="udemy-chat-input"
                          />
                          <button className="button secondary" onClick={() => void askDoubt()} disabled={!doubt.trim()}>
                            Ask
                          </button>
                        </div>
                      </div>
                    </details>
                  ) : (
                    <div className="udemy-qa-dock">
                      <h3 className="udemy-qa-title">Ask {activeAvatar.name} a Quick Doubt</h3>
                      {conversationLog.filter((t) => t.channel === "doubt").length > 0 && (
                        <div className="udemy-chat-history">
                          {conversationLog.filter((t) => t.channel === "doubt").map((turn) => (
                            <div
                              key={turn.id}
                              className={`udemy-chat-bubble ${turn.role === "student" ? "student" : "tutor"}`}
                              style={{ ["--accent" as string]: activeAvatar.color }}
                            >
                              <div className="udemy-bubble-text">{turn.text}</div>
                              <span className="udemy-bubble-name">
                                {turn.role === "student" ? "You" : activeAvatar.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="udemy-chat-input-row">
                        <textarea
                          value={doubt}
                          onChange={(e) => setDoubt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              void askDoubt();
                            }
                          }}
                          rows={2}
                          placeholder="Type a doubt and press Enter\u2026"
                          className="udemy-chat-input"
                        />
                        <button className="button secondary" onClick={() => void askDoubt()} disabled={!doubt.trim()}>
                          Ask
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Developer tools */}
              {!minimalDuolingoLayout ? (
              <details className="udemy-devtools">
                <summary>Developer Tools</summary>
                <div className="udemy-devtools-body">
                  <div className="classroom-chip-row">
                    <span className="pill">Chapter: {activeChapter}</span>
                    <span className="pill">Exercise: {activeExerciseGroup}</span>
                    <span className="pill">Mode: {screenplayMode}</span>
                    <span className="pill">Flow: {flowState} v{flowVersion}</span>
                    <span className="pill">Realtime: {realtimeConnected ? "connected" : "polling"}</span>
                    <span className="pill">Status: {stageStatusText}</span>
                    <span className="pill">Archetype: {check?.studentArchetype ?? "—"}</span>
                    <span className="pill">BoardSpeed: {boardSpeed.toFixed(2)}x</span>
                    <span className="pill">SilenceMs: {silenceRecoveryMsRef.current}</span>
                  </div>
                  {activeTeachingStep ? (
                    <div className="panel teaching-snapshot">
                      <p style={{ marginTop: 0, marginBottom: "0.3rem" }}>
                        <strong>Now Teaching:</strong> {activeTeachingStep.exerciseGroup} \u2014 {activeTeachingStep.subtopic}
                      </p>
                      <p className="muted" style={{ marginTop: 0, marginBottom: "0.2rem" }}>{activeTeachingStep.teacherLine}</p>
                      <p className="muted" style={{ margin: 0 }}>
                        Board: {activeTeachingStep.boardAction} | Mode: {activeTeachingStep.boardMode}
                      </p>
                    </div>
                  ) : null}

                  <div className="panel conversation-log-panel">
                    <div className="conversation-log-header">
                      <h3 style={{ margin: 0 }}>Conversation Log</h3>
                      <button className="button secondary" type="button" onClick={downloadConversationLog} disabled={!conversationLog.length}>
                        Export JSON
                      </button>
                    </div>
                    <div className="conversation-metrics">
                      <span className="pill">Tutor: {conversationInsights.tutorTurns}</span>
                      <span className="pill">Student: {conversationInsights.studentTurns}</span>
                      <span className="pill">Voice: {conversationInsights.voiceStudentTurns}</span>
                      <span className="pill">Doubts: {conversationInsights.doubtTurns}</span>
                      <span className="pill">Avg: {conversationInsights.avgResponseSec || 0}s</span>
                    </div>
                    <div className="conversation-log-list">
                      {conversationLog.length ? (
                        conversationLog.slice(-18).map((turn) => (
                          <div key={turn.id} className={`conversation-log-item role-${turn.role}`}>
                            <p className="conversation-log-meta">
                              {turn.role.toUpperCase()} ({turn.channel}) | {new Date(turn.at).toLocaleTimeString()}
                            </p>
                            <p className="conversation-log-text">{turn.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="muted" style={{ margin: 0 }}>No conversation turns yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="panel roadmap-panel">
                    <h3 style={{ marginTop: 0, marginBottom: "0.45rem" }}>Chapter Roadmap</h3>
                    <p className="muted" style={{ marginTop: 0 }}>
                      {lessonSource || "Lesson source unavailable"} | {lessonEstimatedMinutes || previewChapter?.estimatedMinutes || 20} mins
                    </p>
                    <div className="setup-preview-grid">
                      <div>
                        <p style={{ marginBottom: "0.35rem" }}><strong>Subtopics</strong></p>
                        <ul className="setup-compact-list">
                          {(lessonSubtopics.length ? lessonSubtopics : previewChapter?.subtopics || []).map((topic) => (
                            <li key={topic}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p style={{ marginBottom: "0.35rem" }}><strong>Exercise Flow</strong></p>
                        <ul className="setup-compact-list">
                          {(lessonExerciseFlow.length ? lessonExerciseFlow : previewChapter?.exerciseFlow || []).map((item) => (
                            <li key={`${item.exerciseGroup}_${item.subtopic}`}>
                              {item.exerciseGroup}: {item.subtopic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {courseMonitorUrl ? (
                    <p style={{ marginTop: 0 }}>
                      <a className="button secondary" href={courseMonitorUrl} target="_blank" rel="noreferrer">
                        Open Course Monitor
                      </a>
                    </p>
                  ) : null}

                  {lessonAssetItems.length ? (
                    <div className="setup-preview-grid">
                      {lessonAssetItems.slice(0, 12).map((asset, idx) => (
                        <div key={`${asset.assetType}_${asset.file}_${idx}`}>
                          <p style={{ marginBottom: "0.2rem" }}>
                            <strong>{toAssetTypeLabel(asset.assetType)}</strong>
                          </p>
                          <p className="muted" style={{ marginTop: 0, marginBottom: "0.4rem" }}>
                            {asset.topic || asset.file}
                          </p>
                          <a className="button secondary" href={toAssetUrl(asset.url || asset.file)} target="_blank" rel="noreferrer">
                            Open Asset
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <section className="panel lesson-details-panel">
                    <details>
                      <summary>Lesson Plan and Teaching Script</summary>
                      <div className="lesson-details-meta">
                        <p><strong>Exercise Coverage:</strong> {(lessonExerciseCoverage.length ? lessonExerciseCoverage : previewChapter?.exerciseGroups || []).join(", ")}</p>
                        <p><strong>Current Flow:</strong> {(lessonExerciseFlow.length ? lessonExerciseFlow : previewChapter?.exerciseFlow || []).map((f) => `${f.exerciseGroup}->${f.subtopic}`).join(" | ")}</p>
                        <p><strong>Screenplay Beats:</strong> {lessonScreenplay.length || 0}</p>
                        <p><strong>Active Screenplay Mode:</strong> {screenplayMode}</p>
                      </div>
                      <div className="lesson-details-grid">
                        <div>
                          <h3 style={{ marginTop: 0 }}>Core Ideas</h3>
                          <ul>
                            {coreIdeas.map((idea) => (
                              <li key={idea}>{idea}</li>
                            ))}
                          </ul>
                          <h3>Learning Goals</h3>
                          <ul>
                            {(lessonLearningGoals.length ? lessonLearningGoals : previewChapter?.learningGoals || []).map((goal) => (
                              <li key={goal}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 style={{ marginTop: 0 }}>Teacher Script (A-I)</h3>
                          <ul className="teacher-script-list">
                            {visibleTeachingScript.map((step) => (
                              <li key={step.stepId}>
                                <strong>{step.exerciseGroup} - {step.subtopic} ({step.boardMode === "free_draw" ? "Free Draw" : "SVG"}):</strong> {step.teacherLine}
                                <br />
                                <span className="muted">Checkpoint: {step.checkpointPrompt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </details>
                  </section>
                </div>
              </details>
              ) : null}

            </div>
          </div>
        </div>
        )
      ) : null}
      {/* ── Celebration overlay ─────────────────────────────────────── */}
      {isCelebrating && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.38)",
          animation: "celebFadeInOut 1.7s ease-in-out forwards",
          pointerEvents: "none",
        }}>
          {/* Confetti particles */}
          {CONFETTI_SPREAD.map((s, i) => (
            <div key={i} style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: i % 3 === 0 ? 14 : 10,
              height: i % 3 === 0 ? 9  : 10,
              borderRadius: i % 3 === 0 ? 2 : "50%",
              backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              ["--dx" as string]: `${s.dx}px`,
              ["--dy" as string]: `${s.dy}px`,
              animationDelay: `${(i * 0.04).toFixed(2)}s`,
              animation: "confettiFly 1.3s ease-out forwards",
            }} />
          ))}
          {/* Central card */}
          <div style={{
            background: "white", borderRadius: 24, padding: "2rem 3rem",
            textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
            border: "3px solid #E91E8C", position: "relative", zIndex: 2,
            animation: "celebCardIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>
            <div style={{ fontSize: "3.8rem", lineHeight: 1, marginBottom: "0.4rem",
              animation: "emojiPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
              {celebrationPhrase.emoji}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#3B3A8C" }}>
              {celebrationPhrase.text}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.3rem" }}>
              Keep it up! Next question loading…
            </div>
          </div>
        </div>
      )}

      {/* ── Session-expired Purchase CTA ─────────────────────────── */}
      {showPurchaseCta && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(10,10,20,0.88)",
          padding: "1rem",
        }}>
          <div style={{
            background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
            border: "1.5px solid rgba(233,30,140,0.35)",
            borderRadius: 20,
            padding: "2rem 2rem 1.75rem",
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 48px rgba(0,0,0,0.7)",
          }}>
            {/* Avatar + trophy */}
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🏆</div>
            <h2 style={{ color: "#fff", fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Great session, {(studentName || "").trim() || "learner"}!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Your session has ended. Here&rsquo;s what you achieved:
            </p>

            {/* Stats row */}
            <div style={{
              display: "flex", gap: "0.75rem", justifyContent: "center",
              flexWrap: "wrap", marginBottom: "1.5rem",
            }}>
              {[
                { icon: "⚡", label: "XP", value: sessionProgress.xp },
                { icon: "🎯", label: "Accuracy", value: `${Math.round(score.accuracyPct)}%` },
                { icon: "🔥", label: "Streak", value: sessionProgress.streak },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "0.55rem 1rem",
                  minWidth: 80,
                }}>
                  <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.15rem" }}>{s.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://robodynamics.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "linear-gradient(90deg, #E91E8C, #c2185b)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: 12,
                padding: "0.85rem 1rem",
                textDecoration: "none",
                marginBottom: "0.75rem",
                boxShadow: "0 4px 18px rgba(233,30,140,0.45)",
              }}
            >
              🚀 Get Full Vedic Maths AI Tutor
            </a>
            <a
              href={`/ai-tutor/demo?chapter=${defaultRequestedChapter}`}
              style={{
                display: "block",
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.82rem",
                textDecoration: "underline",
                marginBottom: "0.25rem",
              }}
            >
              Try the free demo again
            </a>
            <button
              type="button"
              onClick={() => { setShowPurchaseCta(false); setStatus("idle"); setError(""); }}
              style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.35)",
                fontSize: "0.78rem", cursor: "pointer", marginTop: "0.25rem",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}


      {/* ── Demo mode banner ─────────────────────────────────────────── */}
      {isDemoMode && status === "ready" && (
        <div className="demo-banner">
          <span>🎓 You are in <strong>free demo mode</strong> — first 3 exercises unlocked</span>
          <a className="demo-banner-cta" href="https://robodynamics.in" target="_blank" rel="noopener noreferrer">
            Register for full access →
          </a>
        </div>
      )}

      {/* ── Lesson-complete overlay ──────────────────────────────────── */}
      {showLessonComplete && (
        <div className="lc-overlay" role="dialog" aria-modal="true" aria-label="Lesson complete">
          <div className="lc-card">
            <div className="lc-trophy">🏆</div>
            <h2 className="lc-title">Lesson Complete!</h2>
            <p className="lc-subtitle">{lessonTitle || activeChapter}</p>

            <div className="lc-stats">
              <div className="lc-stat">
                <span className="lc-stat-val">⭐ {missionPoints}</span>
                <span className="lc-stat-label">XP Earned</span>
              </div>
              <div className="lc-stat">
                <span className="lc-stat-val">🎯 {score.accuracyPct}%</span>
                <span className="lc-stat-label">Accuracy</span>
              </div>
              <div className="lc-stat">
                <span className="lc-stat-val">🔥 {sessionProgress.streak}</span>
                <span className="lc-stat-label">Best Streak</span>
              </div>
              <div className="lc-stat">
                <span className="lc-stat-val">❤️ {sessionProgress.hearts}/{sessionProgress.maxHearts}</span>
                <span className="lc-stat-label">Hearts Left</span>
              </div>
            </div>

            <button
              className="lc-share-btn"
              onClick={() => {
                const msg = `🎉 My child just completed "${lessonTitle || activeChapter}" on RoboDynamics AI Tutor!\n⭐ ${missionPoints} XP  🎯 ${score.accuracyPct}% accuracy  🔥 ${sessionProgress.streak} streak\nTry it free 👉 https://robodynamics.in`;
                void logTutorEvent("SHARE_CLICKED", {
                  chapterCode: activeChapter,
                  xp: missionPoints,
                  accuracyPct: score.accuracyPct,
                  streak: sessionProgress.streak,
                });
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
              }}
            >
              📲 Share on WhatsApp
            </button>

            <div className="lc-actions">
              {(() => {
                const currentIdx = chapterList.findIndex((c) => c.chapterCode === (activeChapter || selectedChapter));
                const nextChapter = currentIdx >= 0 && currentIdx < chapterList.length - 1 ? chapterList[currentIdx + 1] : null;
                return nextChapter ? (
                  <button
                    className="button vedic-primary-btn"
                    onClick={() => {
                      setShowLessonComplete(false);
                      setSelectedChapter(nextChapter.chapterCode);
                      setActiveChapter(nextChapter.chapterCode);
                      setScore({ attempts: 0, correctCount: 0, accuracyPct: 0 });
                      setSessionProgress(EMPTY_SESSION_PROGRESS);
                      void startSession({ chapterCode: nextChapter.chapterCode });
                    }}
                  >
                    Next: {nextChapter.title} →
                  </button>
                ) : (
                  <button className="button vedic-primary-btn" onClick={() => setShowLessonComplete(false)}>
                    Review Again
                  </button>
                );
              })()}
              <button className="button secondary" onClick={() => setShowLessonComplete(false)}>
                Keep Practising
              </button>
            </div>
          </div>
          <style>{`
            .lc-overlay {
              position: fixed; inset: 0; z-index: 1000;
              background: rgba(0,0,0,0.72);
              display: flex; align-items: center; justify-content: center;
              padding: 1rem;
            }
            .lc-card {
              background: #1e293b; border-radius: 1.25rem;
              padding: 2rem 1.75rem; max-width: 420px; width: 100%;
              text-align: center; box-shadow: 0 8px 40px rgba(0,0,0,0.5);
            }
            .lc-trophy { font-size: 3.5rem; line-height: 1; margin-bottom: 0.5rem; }
            .lc-title { font-size: 1.6rem; font-weight: 700; color: #f8fafc; margin: 0 0 0.25rem; }
            .lc-subtitle { color: #94a3b8; font-size: 0.95rem; margin: 0 0 1.5rem; }
            .lc-stats {
              display: grid; grid-template-columns: 1fr 1fr;
              gap: 0.75rem; margin-bottom: 1.5rem;
            }
            .lc-stat {
              background: #0f172a; border-radius: 0.75rem;
              padding: 0.75rem 0.5rem;
              display: flex; flex-direction: column; gap: 0.2rem;
            }
            .lc-stat-val { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; }
            .lc-stat-label { font-size: 0.75rem; color: #64748b; }
            .lc-share-btn {
              width: 100%; padding: 0.75rem 1rem;
              background: #25d366; color: #fff;
              border: none; border-radius: 0.75rem;
              font-size: 1rem; font-weight: 600; cursor: pointer;
              margin-bottom: 0.75rem;
            }
            .lc-share-btn:hover { background: #1ebe5c; }
            .lc-actions { display: flex; gap: 0.75rem; justify-content: center; }
            .lc-actions .button { flex: 1; }
          `}</style>
          <style>{`
            .demo-banner {
              position: fixed; top: 0; left: 0; right: 0; z-index: 500;
              background: #854d0e; color: #fef9c3;
              display: flex; align-items: center; justify-content: center;
              gap: 1rem; padding: 0.5rem 1rem; font-size: 0.82rem;
              flex-wrap: wrap; text-align: center;
            }
            .demo-banner-cta {
              background: #fef08a; color: #713f12; border-radius: 1rem;
              padding: 0.25rem 0.75rem; font-weight: 700;
              text-decoration: none; white-space: nowrap;
            }
            .demo-banner-cta:hover { background: #fde047; }
          `}</style>
        </div>
      )}

      {/* Mobile: Floating chapters button + slide-up drawer */}
      {status === "ready" && (
        <>
          <button
            className="mobile-chapters-fab"
            onClick={() => setShowMobileNav(true)}
            aria-label="Show chapters"
          >
            ☰ Chapters
          </button>
          {showMobileNav && (
            <div className="mobile-nav-overlay" onClick={() => setShowMobileNav(false)}>
              <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-nav-header">
                  <span>Course Chapters</span>
                  <button className="mobile-nav-close" onClick={() => setShowMobileNav(false)}>✕</button>
                </div>
                <div className="ca-coach-nav">
                  <p className="ca-nav-label">All Chapters</p>
                  <div className="ca-chapter-list">
                    {chapterList.map((ch, idx) => (
                      <button
                        key={ch.chapterCode}
                        className={`ca-chapter-item${activeChapter === ch.chapterCode ? " active" : ""}`}
                        onClick={() => {
                          setShowMobileNav(false);
                          setSelectedChapter(ch.chapterCode);
                          setActiveChapter(ch.chapterCode);
                          void startSession({ chapterCode: ch.chapterCode });
                        }}
                      >
                        <span className="ca-ch-num">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="ca-ch-title">{ch.title}</span>
                        {activeChapter === ch.chapterCode && <span className="ca-ch-now">Now</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Debug overlay — visible when ?debug=1 or localStorage.aiTutorDebug=1 ── */}
      {debugMode && (
        <div className="debug-overlay">
          <details>
            <summary>🐛 Debug</summary>
            <div><b>Q:</b> {question?.questionId?.slice(-8) ?? "—"} <span style={{color:"#94a3b8"}}>({question?.questionType ?? "—"})</span></div>
            <div><b>Scene:</b> <span style={{color: stageSceneMode === "student" ? "#10b981" : "#f59e0b"}}>{stageSceneMode}</span></div>
            <div><b>Flow:</b> {flowState}</div>
            <div><b>Kickoff:</b> {pendingKickoff}</div>
            <div><b>Speaking:</b> <span style={{color: isSpeaking ? "#ef4444" : "#64748b"}}>{String(isSpeaking)}</span></div>
            <div><b>Awaiting:</b> <span style={{color: awaitingStudentResponse ? "#10b981" : "#64748b"}}>{String(awaitingStudentResponse)}</span></div>
            <div><b>Evaluating:</b> {String(isEvaluatingAnswer)}</div>
            <div><b>LoadingQ:</b> {String(isLoadingNextQuestion)}</div>
            <div><b>HasCtrl:</b> <span style={{color: studentHasControl ? "#10b981" : "#64748b"}}>{String(studentHasControl)}</span></div>
            <div><b>FillStep:</b> {fillStepIndex}/{question?.steps?.length ?? 0}</div>
            <div><b>Coach:</b> &quot;{teacherUtterance.slice(0, 45)}&quot;</div>
          </details>
        </div>
      )}
    </main>
  );
}




























