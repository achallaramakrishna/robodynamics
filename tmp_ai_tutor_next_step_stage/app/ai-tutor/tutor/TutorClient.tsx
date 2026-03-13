"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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

type Avatar = { id: string; name: string; role: string; color: string; style: "boy" | "girl" | "male" };
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

const DEFAULT_COURSE_ID = "neet_physics";
const MODULE_TO_COURSE_ID: Record<string, string> = {
  VEDIC_MATH: "vedic_math",
  NEET_PHYSICS: "neet_physics",
  NEET_CHEMISTRY: "neet_chemistry",
  NEET_BIOLOGY: "neet_biology"
};
const COURSE_LABELS: Record<string, string> = {
  vedic_math: "Vedic Math",
  neet_physics: "NEET Physics",
  neet_chemistry: "NEET Chemistry",
  neet_biology: "NEET Biology"
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
  { id: "raj",  name: "Raj",  role: "Learning Coach",  color: "#16a34a", style: "male" }
];
const STATIC_AVATAR_MODE = true;

const AVATAR_STAGE_ART: Record<string, string> = {
  raj: "/avatar_1/sprite_r03_c01.svg"
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
    addT("s1_sutra", 16, 78, `"${CHAPTER_SUTRAS[chapterCode] || "Vedic Method"}"`, avatar.color, 17);
    addL("s1_line", 16, 92, 480, 92, avatar.color, 2);
    addT("s1_goal_lbl", 16, 116, "Today you will learn:", "#334155", 13);
    learningGoals.slice(0, 3).forEach((g, i) => {
      const truncated = g.length > 70 ? `${g.slice(0, 68)}…` : g;
      addT(`s1_g${i}`, 24, 138 + i * 24, `• ${truncated}`, "#0f172a", 13);
    });
    addT("s1_next", 16, 240, "► Next: Watch a worked example on the board", "#64748b", 11);
  } else if (slide === 2) {
    // ── DEMO: Step-by-step worked example ────────────────────────────────
    const demoLines = CHAPTER_DEMO_STEPS[chapterCode] || [
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
  return CHAPTER_DEMO_SPEECH[chapterCode]
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
      <svg viewBox="0 0 580 340" width="100%" height="340" role="img" aria-label="AI Tutor Whiteboard">
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
    "Chapter 3: Multiplication by 11",
    20,
    ["2-digit x 11", "Carry handling", "3-digit extension", "Pattern drills"],
    ["Apply insert-sum method", "Handle carry correctly", "Scale to bigger numbers"]
  ),
  makeChapter(
    "L4_VERTICAL_CROSSWISE",
    "Chapter 4: Vertical and Crosswise (2-digit)",
    30,
    ["Vertical step", "Crosswise step", "Carry flow", "2-digit x 2-digit"],
    ["Follow V-C-V order", "Manage carry", "Solve structured products"]
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
    "Chapter 6: Nikhilam (Near Base Multiplication)",
    30,
    ["Base and deviation", "Left-right parts", "Negative deviation", "Near 100 practice"],
    ["Use near-base strategy", "Write left-right parts correctly", "Reduce long multiplication"]
  ),
  makeChapter(
    "L7_SQUARES_ENDING_5",
    "Chapter 7: Squares Ending in 5",
    20,
    ["n5 pattern", "Prefix x next", "Attach 25", "Speed drills"],
    ["Square ending-5 quickly", "Use prefix rule", "Build speed"]
  ),
  makeChapter(
    "L8_YAVADUNAM",
    "Chapter 8: Yavadunam (Deficiency Method)",
    30,
    ["Deficiency from base", "Cross adjustment", "Right-part digits", "Mixed cases"],
    ["Apply deficiency method", "Use right width", "Avoid sign errors"]
  ),
  makeChapter("L9_GENERAL_MULTIPLICATION", "Chapter 9: General Multiplication Strategy", 30, ["Decomposition", "Mental chunking", "Cross-checks", "Mixed drills"], ["Choose efficient strategy", "Break products", "Validate quickly"]),
  makeChapter("L10_DIVISION_BY_9", "Chapter 10: Quick Division by 9", 25, ["Quotient and remainder", "Progressive sums", "Remainder checks", "qRr format"], ["Divide by 9 quickly", "Write qRr format", "Verify remainder"]),
  makeChapter("L11_VINCULUM_INTRO", "Chapter 11: Vinculum Numbers (Intro)", 25, ["Negative digits", "Representation rules", "Simple conversions", "Use in simplification"], ["Understand vinculum", "Convert both ways", "Use in simplification"]),
  makeChapter("L12_FRACTIONS_DECIMALS", "Chapter 12: Fractions and Decimals", 25, ["Benchmark fractions", "Fraction to decimal", "Recurring awareness", "Mental checks"], ["Convert common fractions", "Use benchmarks", "Estimate correctly"]),
  makeChapter("L13_ALGEBRAIC_IDENTITIES", "Chapter 13: Algebraic Identities", 30, ["(a+b)^2", "(a-b)^2", "a^2-b^2", "Pattern spotting"], ["Expand identities", "Avoid sign errors", "Recognize forms"]),
  makeChapter("L14_FACTORISATION", "Chapter 14: Factorisation Basics", 30, ["Difference of squares", "Common factors", "Reverse expansion", "Quick verification"], ["Factorize forms", "Reverse expansion", "Check quickly"]),
  makeChapter("L15_SQUARES_NEAR_BASE", "Chapter 15: Squares Near Base", 25, ["Deviation method", "Left-right writeup", "Below/above base", "Near 100 drills"], ["Square near base", "Handle +/- deviation", "Increase speed"]),
  makeChapter("L16_CUBES_INTRO", "Chapter 16: Cubes Intro and Review", 30, ["Cube concept", "Small cube patterns", "Mental multiplication chain", "Final review"], ["Compute cubes", "Use multiplication chain", "Connect methods"])
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
const DEFAULT_CHAPTERS_BY_COURSE: Record<string, TutorChapter[]> = {
  vedic_math: DEFAULT_CHAPTERS,
  neet_physics: NEET_PHYSICS_FALLBACK_CHAPTERS,
  neet_chemistry: NEET_CHEMISTRY_FALLBACK_CHAPTERS,
  neet_biology: NEET_BIOLOGY_FALLBACK_CHAPTERS
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
  const requestedCourseId = courseIdFromQuery || MODULE_TO_COURSE_ID[moduleFromQuery] || DEFAULT_COURSE_ID;
  const requestedFallbackChapters = fallbackChaptersForCourse(requestedCourseId);

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
  const [selectedChapter, setSelectedChapter] = useState(requestedFallbackChapters[0].chapterCode);
  const [activeChapter, setActiveChapter] = useState(requestedFallbackChapters[0].chapterCode);
  const [selectedExerciseGroup, setSelectedExerciseGroup] = useState("A");
  const [activeExerciseGroup, setActiveExerciseGroup] = useState("A");
  const [studentName, setStudentName] = useState("");
  const [knownLanguage, setKnownLanguage] = useState<KnownLanguage>("english");
  const [learnerLevel, setLearnerLevel] = useState<LearnerLevel>("beginner");
  const [learnerGoal, setLearnerGoal] = useState<LearnerGoal>("school");

  const [question, setQuestion] = useState<TutorQuestion | null>(null);
  const [questionShownAt, setQuestionShownAt] = useState(0);
  const [answer, setAnswer] = useState("");
  const [lastAnswerMode, setLastAnswerMode] = useState<"typed" | "voice">("typed");
  const [confidence, setConfidence] = useState<Confidence>("medium");
  const [check, setCheck] = useState<TutorCheckResponse | null>(null);
  const [doubt, setDoubt] = useState("");
  const [doubtReply, setDoubtReply] = useState("");
  const [conversationLog, setConversationLog] = useState<ConversationTurn[]>([]);
  const [score, setScore] = useState({ attempts: 0, correctCount: 0, accuracyPct: 0 });
  const [attemptByQuestion, setAttemptByQuestion] = useState<Record<string, { correct: boolean; confidence: Confidence }>>({});
  const [flowState, setFlowState] = useState<TutorOrchestratorState>("idle");
  const [flowVersion, setFlowVersion] = useState(0);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATARS[0].id);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micPermission, setMicPermission] = useState<MicPermission>("unknown");
  const [isTeachingBoard, setIsTeachingBoard] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCue, setCurrentCue] = useState<string>("explain");
  const [isListening, setIsListening] = useState(false);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);
  const [awaitingStudentResponse, setAwaitingStudentResponse] = useState(false);
  const [autoTeachEnabled, setAutoTeachEnabled] = useState(true);
  const [pendingKickoff, setPendingKickoff] = useState<"none" | "welcome" | "teach">("none");
  const [pendingKickoffToken, setPendingKickoffToken] = useState("");
  const [teacherUtterance, setTeacherUtterance] = useState("");
  const [boardSteps, setBoardSteps] = useState<SvgBoardStep[]>([]);
  const [boardRunId, setBoardRunId] = useState(0);
  const [boardSpeed, setBoardSpeed] = useState(1);

  const boardTimerRef = useRef<number | null>(null);
  const boardWaitResolveRef = useRef<(() => void) | null>(null);
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const listenTimerRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const speakSeqRef = useRef(0);
  const teachRunRef = useRef(0);
  const teachingLockRef = useRef(false);   // ref-based lock so teachOnBoard guard is never stale
  const kickoffRunningRef = useRef(false);
  const lastKickoffTokenRef = useRef("");
  const autoListenQuestionRef = useRef("");
  const speakRef = useRef<(text: string) => Promise<void>>(async () => {});
  const teachOnBoardRef = useRef<() => Promise<void>>(async () => {});
  const sessionRecoveryRef = useRef(false);

  const canStart = useMemo(() => token.trim().length > 20, [token]);
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
    const raw =
      (lessonPath.length ? lessonPath.map((item) => item.exerciseGroup) : []) ||
      [];
    const fallback = lessonExerciseFlow.map((item) => item.exerciseGroup);
    const ordered = (raw.length ? raw : fallback)
      .map((value) => String(value || "").trim())
      .filter(Boolean);
    return [...new Set(ordered)];
  }, [lessonExerciseFlow, lessonPath]);
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
    "Use the method Raj just showed you.";
  const rewardUnitPrompt =
    lessonDuolingoArc?.rewardLoop?.xpUnit ||
    "Earn XP on each step and keep your streak alive.";
  const rewardCelebrationPrompt =
    lessonDuolingoArc?.rewardLoop?.celebrationStyle ||
    "Short praise and visible progress after every correct answer.";
  const reviewLoopPrompt =
    lessonDuolingoArc?.reviewLoop?.trigger ||
    "If you get stuck, Raj will reopen the pattern with one smaller step.";
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
  const missionStatusLabel = useMemo(() => {
    if (sessionProgress.livesDepleted) {
      return "Review to refill hearts";
    }
    if (awaitingStudentResponse) {
      return "Your turn";
    }
    if (check?.correct) {
      return "Great job";
    }
    if (isTeachingBoard || isSpeaking) {
      return "Coach is guiding";
    }
    return "Ready for the next step";
  }, [awaitingStudentResponse, check?.correct, isSpeaking, isTeachingBoard, sessionProgress.livesDepleted]);
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
    if (isSpeaking) return "Speaking live...";
    if (isListening) return "Listening to your answer...";
    if (awaitingStudentResponse) {
      return micPermission === "denied"
        ? "Your turn now: type your answer and click Check Answer."
        : "Your turn now: answer by voice or text.";
    }
    return "Ready for next step.";
  }, [isTeachingBoard, isEvaluatingAnswer, isSpeaking, isListening, awaitingStudentResponse, micPermission]);
  const stageSceneMode = awaitingStudentResponse || isListening || isEvaluatingAnswer || !!check ? "student" : "coach";
  const showInlineBoard = showBoardPanel && stageSceneMode === "coach";
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
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const patterns: Record<string, Array<{ hz: number; sec: number; gain: number }>> = {
        correct: [
          { hz: 540, sec: 0.08, gain: 0.08 },
          { hz: 720, sec: 0.1, gain: 0.08 },
          { hz: 900, sec: 0.12, gain: 0.08 },
        ],
        wrong: [
          { hz: 320, sec: 0.1, gain: 0.08 },
          { hz: 260, sec: 0.14, gain: 0.08 },
        ],
        streak: [
          { hz: 520, sec: 0.08, gain: 0.08 },
          { hz: 660, sec: 0.08, gain: 0.08 },
          { hz: 840, sec: 0.08, gain: 0.08 },
          { hz: 1040, sec: 0.12, gain: 0.08 },
        ],
        depleted: [
          { hz: 240, sec: 0.14, gain: 0.08 },
          { hz: 180, sec: 0.2, gain: 0.08 },
        ],
      };
      const seq = patterns[kind] || patterns.correct;
      let cursor = now;
      for (const n of seq) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(n.hz, cursor);
        gain.gain.setValueAtTime(0.0001, cursor);
        gain.gain.exponentialRampToValueAtTime(n.gain, cursor + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, cursor + n.sec);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(cursor);
        osc.stop(cursor + n.sec);
        cursor += n.sec + 0.02;
      }
      window.setTimeout(() => {
        void ctx.close().catch(() => undefined);
      }, 900);
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

        const defaultCode = data.defaultChapterCode || data.chapters?.[0]?.chapterCode;
        if (defaultCode) {
          setSelectedChapter(defaultCode);
          setActiveChapter(defaultCode);
        }
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
  }, [requestedCourseId]);

  useEffect(() => {
    if (!voiceEnabled) {
      stopVoicePlayback();
    }
  }, [voiceEnabled]);

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

  async function speak(text: string): Promise<void> {
    // Resolve {{studentName}} template placeholder left in chapter JSON content
    const line = (text || "")
      .replace(/\{\{studentName\}\}/g, (studentName || "").trim() || "friend")
      .trim();
    if (!line) {
      setIsSpeaking(false);
      return;
    }
    setTeacherUtterance(line);
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
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 6000);
        const ttsResponse = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: ttsPayload,
          signal: controller.signal
        }).finally(() => window.clearTimeout(timeoutId));
        const ttsData = await ttsResponse.json().catch(() => null);
        if (!ttsResponse.ok || !ttsData?.audioBase64) {
          continue;
        }
        const mimeType = String(ttsData.mimeType || "audio/wav");
        const audio = new Audio(`data:${mimeType};base64,${ttsData.audioBase64}`);
        activeAudioRef.current = audio;
        await new Promise<void>((resolve, reject) => {
          audio.onplaying = () => {
            if (speakSeq === speakSeqRef.current) {
              setIsSpeaking(true);
            }
          };
          audio.onended = () => {
            if (speakSeq === speakSeqRef.current) {
              setIsSpeaking(false);
            }
            resolve();
          };
          audio.onerror = () => {
            if (speakSeq === speakSeqRef.current) {
              setIsSpeaking(false);
            }
            reject(new Error("TTS audio playback failed"));
          };
          void audio.play().catch((err) => {
            reject(err instanceof Error ? err : new Error("TTS audio playback error"));
          });
        });
        if (speakSeq === speakSeqRef.current) {
          setIsSpeaking(false);
        }
        return;
      }
    } catch {
      // fallback to browser synthesis below
    }

    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(line);
      // Pick the best available male voice for the browser fallback.
      // Priority: Google/Microsoft quality voices → any male en-IN voice → any en-IN voice
      const voices = window.speechSynthesis.getVoices();
      const pick =
        voices.find(v => /google.*en.*in/i.test(v.name)) ||
        voices.find(v => /microsoft.*ravi/i.test(v.name)) ||  // Microsoft Ravi — Indian male
        voices.find(v => v.lang === "en-IN" && v.name.toLowerCase().includes("male")) ||
        voices.find(v => v.lang === "en-IN") ||
        voices.find(v => v.lang.startsWith("en") && !v.name.toLowerCase().includes("female")) ||
        null;
      if (pick) utter.voice = pick;
      utter.rate  = 1.0;   // natural pace — lively for Grade 4-8
      utter.pitch = 1.05;  // slightly bright without sounding unnatural
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

  async function speakWithGuard(text: string, maxWaitMs = 9000): Promise<void> {
    if (typeof window === "undefined") {
      await speak(text);
      return;
    }
    let timeoutId = 0;
    await Promise.race([
      speak(text),
      new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(() => {
          stopVoicePlayback();
          resolve();
        }, Math.max(1000, maxWaitMs));
      })
    ]);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
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
      addText("tpc_intro", 20, 54, "Step 1: I will draw the ten-point circle first.", "#334155", 14);
      const ringPoints = [
        { x: 520, y: 156, label: "9" },
        { x: 540, y: 202, label: "8" },
        { x: 522, y: 250, label: "7" },
        { x: 472, y: 284, label: "6" },
        { x: 380, y: 296, label: "5" },
        { x: 288, y: 284, label: "4" },
        { x: 238, y: 250, label: "3" },
        { x: 220, y: 202, label: "2" },
        { x: 240, y: 156, label: "1" },
        { x: 380, y: 128, label: "10" },
      ];
      for (let i = 0; i < ringPoints.length; i += 1) {
        const current = ringPoints[i];
        const next = ringPoints[(i + 1) % ringPoints.length];
        addLine(`tpc_line_${i}`, current.x, current.y, next.x, next.y, "#0ea5e9", 2);
      }
      ringPoints.forEach((p, i) => addText(`tpc_label_${i}`, p.x - 8, p.y - 8, p.label, avatar.color, 14));
      addText("tpc_labels", 250, 320, "10 at top, then 9..1 clockwise", "#1e293b", 13);
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

  async function recoverExpiredSession(trigger: string) {
    if (sessionRecoveryRef.current) return;
    if (!token || token.trim().length <= 20) return;
    sessionRecoveryRef.current = true;
    setError("Session expired on server. Reconnecting...");
    addConversationTurn("system", "system", "Session expired. Recovering a new tutor session.", {
      source: "session_recovery_start",
      trigger,
    });
    try {
      await startSession({ preserveClassClock: true });
      setError("");
      addConversationTurn("system", "system", "Tutor session recovered.", {
        source: "session_recovery_success",
        trigger,
      });
    } catch {
      setError("Session recovery failed. Please click Start Tutor Session.");
      addConversationTurn("system", "system", "Tutor session recovery failed.", {
        source: "session_recovery_failed",
        trigger,
      });
    } finally {
      sessionRecoveryRef.current = false;
    }
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
          await speakWithGuard(question.questionText || activeDuolingoStep?.readAloudPrompt || beat.checkpointPrompt || activeTeachingStep?.checkpointPrompt || "Listen to the question.");
          if (runId !== teachRunRef.current) return;
          await speakWithGuard(activeDuolingoStep?.tryPrompt || "Your turn now.", 5000);
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
      await speakWithGuard(question.questionText || activeDuolingoStep?.readAloudPrompt || activeTeachingStep?.checkpointPrompt || "Listen to the question.");
      if (runId !== teachRunRef.current) return;
      await speakWithGuard(activeDuolingoStep?.tryPrompt || "Your turn now.", 5000);
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
      await speakWithGuard(activeDuolingoStep?.tryPrompt || "Your turn now.", 5000);
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
        const ctx = new AudioCtx() as AudioContext;
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
        void ctx.resume();
      }
      // Also prime HTMLAudioElement path with a silent data URL
      const sil = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
      void sil.play().catch(() => {});
    } catch { /* ignore */ }
  }

  async function startSession(options?: { preserveClassClock?: boolean }) {
    unlockAudio();
    const preserveClassClock = options?.preserveClassClock === true;
    setConfidence(onboardingConfidence);
    setStatus("loading");
    setError("");
    setCheck(null);
    setPendingKickoffToken("");
    setFlowState("idle");
    setFlowVersion(0);
    setRealtimeConnected(false);
    setAttemptByQuestion({});
    setDoubtReply("");
    setConversationLog([]);
    setLessonAssetItems([]);
    setLessonGradeBand("");
    setLessonDuolingoArc(null);
    setSessionProgress(EMPTY_SESSION_PROGRESS);
    setDbCourseId(dbCourseIdFromQuery);
    setPendingKickoff("none");
    setPendingKickoffToken("");
    kickoffRunningRef.current = false;
    autoListenQuestionRef.current = "";
    stopListeningSession();
    setIsEvaluatingAnswer(false);
    setLastAnswerMode("typed");
    setAwaitingStudentResponse(false);
    try {
      const response = await fetch("/api/vedic/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          courseId,
          chapterCode: selectedChapter,
          exerciseGroup: selectedExerciseGroup
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
      }

      setSelectedChapter(data.activeChapterCode || selectedChapter);
      setActiveChapter(data.activeChapterCode || selectedChapter);
      setSelectedExerciseGroup(data.activeExerciseGroup || selectedExerciseGroup);
      setActiveExerciseGroup(data.activeExerciseGroup || selectedExerciseGroup);
      setQuestion(data.question);
      setQuestionShownAt(Date.now());
      setStatus("ready");
      addConversationTurn(
        "system",
        "system",
        `Session started: ${data.lesson.title} | Exercise ${data.activeExerciseGroup || selectedExerciseGroup}`,
        { source: "start_session" }
      );

      clearBoard();
      const greetingName = (studentName || "").trim() || "there";
      const coachIntro = data.lesson.duolingoLessonArc?.onboarding?.coachIntro || `Raj will guide you through ${data.lesson.title}.`;
      const welcomeLine = `Hi ${greetingName}! I am ${activeAvatar.name}, your ${activeAvatar.role}. ${coachIntro} You are starting as ${LEARNER_LEVEL_LABELS[learnerLevel].toLowerCase()} and want help with ${LEARNER_GOAL_LABELS[learnerGoal].toLowerCase()}. I will guide you in ${KNOWN_LANGUAGE_LABELS[knownLanguage]}.`;
      setTeacherUtterance(welcomeLine);
      if (autoTeachEnabled) {
        setPendingKickoffToken(`${Date.now()}_${data.sessionId}_${data.question?.questionId || "q"}_teach`);
        setPendingKickoff("teach");
      } else {
        void speak(welcomeLine);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  }

  async function checkAnswer(answerOverride?: string, source?: "typed" | "voice") {
    if (!sessionId || !question) return;
    if (isEvaluatingAnswer) return;
    if (!canAttemptAnswer) {
      setError("No hearts left. Start review to refill and continue.");
      setAwaitingStudentResponse(false);
      return;
    }
    const learnerAnswer = (answerOverride ?? answer).trim();
    const answerSource = source || lastAnswerMode;
    if (!learnerAnswer) {
      setError("Please type or speak your answer first.");
      setAwaitingStudentResponse(true);
      return;
    }

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
      if (data.summary) {
        setScore(data.summary);
      }
      if (data.sessionProgress) {
        setSessionProgress(data.sessionProgress);
      }
      const winLine = activeDuolingoStep?.instantFeedbackWin || "Great work. Moving to the next question.";
      const retryBaseLine = activeDuolingoStep?.instantFeedbackRetry || `Good attempt. ${activeTeachingStep?.checkpointPrompt || "Let us retry this with one smaller step."}`;
      const retrySupportLine = activeDuolingoStep?.reviewPrompt || activeTeachingStep?.microPractice || "";
      const retryLine = retrySupportLine ? `${retryBaseLine} ${retrySupportLine}` : retryBaseLine;
      if (data.correct) {
        setTeacherUtterance(winLine);
        if (autoTeachEnabled) {
          await speakWithGuard(winLine, 5000);
          if (data.coachTip) {
            await speakWithGuard(data.coachTip, 4500);
          }
          await nextQuestion();
          return;
        }
        await speakWithGuard(winLine, 5000);
        if (data.coachTip) {
          await speakWithGuard(data.coachTip, 4500);
        }
      } else {
        setTeacherUtterance(retryLine);
        if (autoTeachEnabled) {
          await speakWithGuard(retryLine, 6500);
          if (data.coachTip) {
            await speakWithGuard(data.coachTip, 4500);
          }
          clearBoard();
          setTeacherUtterance(retryLine);
          setPendingKickoffToken(`${Date.now()}_${sessionId}_${question.questionId}_retry`);
          setPendingKickoff("teach");
        } else {
          await speakWithGuard(retryLine, 6500);
          if (data.coachTip) {
            await speakWithGuard(data.coachTip, 4500);
          }
        }
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
      setIsEvaluatingAnswer(false);
    }
  }

  async function nextQuestion() {
    if (!sessionId) return;
    const targetExerciseGroup = getNextExerciseGroup(activeExerciseGroup || selectedExerciseGroup);

    setAnswer("");
    setCheck(null);
    setDoubtReply("");
    setPendingKickoff("none");
    setPendingKickoffToken("");
    kickoffRunningRef.current = false;
    autoListenQuestionRef.current = "";
    stopListeningSession();
    setIsEvaluatingAnswer(false);
    setLastAnswerMode("typed");
    setAwaitingStudentResponse(false);

    const response = await fetch("/api/vedic/next-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        courseId,
        chapterCode: selectedChapter,
        exerciseGroup: targetExerciseGroup
      })
    });
    const data: TutorNextQuestionResponse & { error?: string } = await response.json();
    if (!response.ok || data.error) {
      const msg = data.error || "Unable to load next question.";
      setError(msg);
      if (isExpiredSessionError(msg)) {
        await recoverExpiredSession("next_question");
      }
      return;
    }

    setQuestion(data.question);
    addConversationTurn(
      "system",
      "system",
      `Moved to next question: Exercise ${data.question?.exerciseGroup || targetExerciseGroup}`,
      { source: "next_question" }
    );
    void sendOrchestratorCommand("NEXT_QUESTION", {
      questionId: data.question?.questionId || "",
      chapterCode: data.activeChapterCode || selectedChapter,
      exerciseGroup: data.activeExerciseGroup || targetExerciseGroup,
    });
    setQuestionShownAt(Date.now());
    if (data.courseId) setCourseId(data.courseId);
    if (data.activeChapterCode) {
      setActiveChapter(data.activeChapterCode);
      setSelectedChapter(data.activeChapterCode);
    }
    if (data.activeExerciseGroup) {
      setActiveExerciseGroup(data.activeExerciseGroup);
      setSelectedExerciseGroup(data.activeExerciseGroup);
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
          const coachIntro = lessonDuolingoArc?.onboarding?.coachIntro || `Raj checks your comfort level before starting ${lessonTitle || previewChapter?.title || "this chapter"}.`;
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
              `The Vedic Sutra for today is: "${CHAPTER_SUTRAS[chCode] || "Vedic Method"}". ` +
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
          <p className="tutor-qs-label">{courseLabel} · {learnerLabel}</p>
          <h2 className="tutor-qs-title">
            {minimalDuolingoLayout ? "Let Raj Set Up Your Learning Path" : "Meet Raj, Your AI Coach"}
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
              ? (lessonDuolingoArc?.onboarding?.coachIntro || "First tell Raj what you know. Then he will choose the right pace and start your mission.")
              : "I will teach on the board, then push you through focused practice."}
          </p>

          {minimalDuolingoLayout ? (
            <div className="tutor-onboard-card">
              <label className="tutor-onboard-field">
                <span>Your name</span>
                <input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Type your name"
                />
              </label>

              <div className="tutor-onboard-group">
                <p className="tutor-onboard-label">Session language</p>
                <div className="tutor-language-pill">English</div>
              </div>

              <div className="tutor-onboard-group">
                <p className="tutor-onboard-label">How much Vedic Math do you already know?</p>
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
                <p className="tutor-onboard-label">What do you want from this session?</p>
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

              {lessonDuolingoArc?.onboarding?.placementRule ? (
                <p className="tutor-onboard-note">{lessonDuolingoArc.onboarding.placementRule}</p>
              ) : null}
            </div>
          ) : null}

          {/* Start button */}
          <div className="tutor-qs-actions">
            <button
              className="button tutor-qs-btn"
              onClick={() => { unlockAudio(); void startSession(); }}
              disabled={!canStart || status === "loading"}
            >
              {status === "loading" ? "Starting..." : sessionId ? "Restart Mission" : minimalDuolingoLayout ? "Continue to Mission" : "Start Mission"}
            </button>
            {!canStart && (
              <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem", textAlign: "center" }}>
                Session token missing — launch from the LMS
              </p>
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
                <p className="vedic-topbar-label">Step {activeLessonStepIndex + 1} of {Math.max(lessonPath.length, 1)}</p>
                <h2 className="vedic-topbar-title">{activeDuolingoStep?.missionStepTitle || question.subtopic || missionTitle}</h2>
              </div>
              <div className="vedic-topbar-actions">
                <div className="vedic-stat-pill heart">{sessionProgress.hearts}/{sessionProgress.maxHearts} hearts</div>
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
                  <div className="vedic-focus-content">
                    {stageSceneMode === "coach" ? (
                      <>
                        <div className="vedic-focus-panel coach">
                          <span className="vedic-prompt-label">Raj explains</span>
                          <p className="vedic-scene-copy">{missionPrompt}</p>
                          <p className="muted">{stageStatusText}</p>
                        </div>
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
                          {showWorkedBoardSupport ? (
                            <button className="button secondary" type="button" onClick={() => void teachOnBoard()} disabled={isTeachingBoard || isSpeaking}>
                              Show Steps
                            </button>
                          ) : null}
                          <button
                            className="button vedic-primary-btn"
                            type="button"
                            onClick={() => {
                              stopListeningSession();
                              setAwaitingStudentResponse(true);
                            }}
                            disabled={sessionProgress.livesDepleted}
                          >
                            Try It
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="vedic-focus-panel question student">
                          <span className="vedic-prompt-label">Try this</span>
                          <p className="vedic-scene-copy">{missionTryPrompt}</p>
                          <p className="udemy-question-text"><strong>{question.questionText}</strong></p>
                          {question.visual?.svg ? (
                            <div className="udemy-visual panel" dangerouslySetInnerHTML={{ __html: question.visual.svg }} />
                          ) : null}
                        </div>
                        <div className="vedic-answer-block vedic-answer-block-inline">
                          <label
                            htmlFor="answerInput"
                            className="udemy-answer-label"
                            style={{ color: awaitingStudentResponse ? "#166534" : "#334155" }}
                          >
                            Your Answer
                          </label>
                          <input
                            id="answerInput"
                            ref={answerInputRef}
                            disabled={!canAttemptAnswer}
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
                          <p className="muted udemy-hint">
                            Answer the question above. Use "Show Steps" only if you need help.
                          </p>
                          {micPermission === "denied" ? (
                            <p className="muted" style={{ marginTop: "0.35rem", marginBottom: 0 }}>
                              Microphone access is blocked. Use text input.
                            </p>
                          ) : null}
                          {sessionProgress.livesDepleted ? (
                            <p className="vedic-alert">No hearts left. Do a review round to continue. {reviewLoopPrompt}</p>
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
                            {showWorkedBoardSupport ? (
                              <button className="button secondary" type="button" onClick={() => void teachOnBoard()} disabled={isTeachingBoard || isSpeaking}>
                                Show Steps
                              </button>
                            ) : null}
                            <button className="button secondary" onClick={nextQuestion}>Skip</button>
                          </div>
                        </div>
                      </>
                    )}

                    {check ? (
                      <div className={`udemy-feedback ${check.correct ? "correct" : "wrong"}`}>
                        <p className="udemy-feedback-verdict">
                          {check.correct ? "Correct" : "Try Again"}
                        </p>
                        <p className="muted">{check.correct ? (activeDuolingoStep?.instantFeedbackWin || missionCelebration) : (activeDuolingoStep?.instantFeedbackRetry || check.encouragement)}</p>
                        {check.coachTip ? <p className="muted">Tip: {check.coachTip}</p> : null}
                        <p><strong>Expected:</strong> {check.expectedAnswer}</p>
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
                      id="answerInput"
                      ref={answerInputRef}
                      disabled={!canAttemptAnswer}
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
                      <p className="vedic-alert">No hearts left. Do a review round to continue. {reviewLoopPrompt}</p>
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
                      <button className="button secondary" onClick={nextQuestion}>Skip</button>
                    </div>
                  </div>

                  {check ? (
                      <div className={`udemy-feedback ${check?.correct ? "correct" : "wrong"}`}>
                        <p className="udemy-feedback-verdict">
                          {check?.correct ? "Correct" : "Try Again"}
                        </p>
                      <p className="muted">{check?.correct ? (activeDuolingoStep?.instantFeedbackWin || missionCelebration) : (activeDuolingoStep?.instantFeedbackRetry || check?.encouragement)}</p>
                      {check?.coachTip ? <p className="muted">Tip: {check?.coachTip}</p> : null}
                      <p><strong>Expected:</strong> {check?.expectedAnswer}</p>
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
                      {workspaceLabel} · Reach {nextRewardXp} XP for the next reward.
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
                    <p className="ca-nav-label">Course · {chapterList.length} Chapters</p>
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
                  ) : null}
                  <label
                    htmlFor="answerInput"
                    className="udemy-answer-label"
                    style={{ color: awaitingStudentResponse ? "#0f766e" : "#334155" }}
                  >
                    Your Answer
                  </label>
                  <input
                    id="answerInput"
                    ref={answerInputRef}
                    disabled={!canAttemptAnswer}
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
                      💔 No hearts left. Do review to refill and continue.
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
                    <button className="button secondary" onClick={nextQuestion}>Next ➜</button>
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
      <style jsx global>{`
        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes avatarTalk {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-2px) scale(1.01); }
          50% { transform: translateY(-1px) scale(1.015); }
          75% { transform: translateY(-2px) scale(1.01); }
        }
        .teacher-stage-avatar {
          position: relative;
          width: min(100%, 240px);
          aspect-ratio: 3 / 4;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transform-origin: 50% 88%;
          animation: none;
        }
        .teacher-stage-avatar.speaking {
          animation: none;
        }
        .teacher-stage-glow {
          position: absolute;
          inset: 12% 8% 10%;
          border-radius: 28px;
          background: radial-gradient(circle at 50% 30%, var(--teacher-accent, #0ea5e9) 0%, rgba(255,255,255,0) 72%);
          filter: blur(14px);
          opacity: 0.18;
          pointer-events: none;
        }
        .teacher-stage-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center bottom;
          filter: drop-shadow(0 10px 18px rgba(15,23,42,0.22));
          position: relative;
          z-index: 1;
        }
        @keyframes boardDrawLine { to { stroke-dashoffset: 0; } }
        @keyframes boardFadeText { to { opacity: 1; } }

        /* ── Speaking Teacher (layered sprite avatar) ───────────────────── */
        .speaking-teacher {
          position: relative;
          width: min(100%, 240px);
          aspect-ratio: 180 / 219;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transform-origin: 50% 88%;
          animation: none;
        }
        .speaking-teacher.speaking {
          animation: none;
        }
        .speaking-teacher.compact {
          width: 80px;
        }
        /* ── Male teacher (static sprite + CSS animation) ──────────────── */
        .speaking-teacher.male-teacher {
          aspect-ratio: unset;
          width: min(100%, 200px);
          height: 220px;
          align-items: center;
          justify-content: center;
        }
        .speaking-teacher.male-teacher.compact {
          width: 70px;
          height: 80px;
        }
        @keyframes spriteFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .male-teacher-sprite {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 8px 14px rgba(15,23,42,0.20));
          z-index: 2;
          position: relative;
          animation: none;
        }
        /* Gentle float when idle */
        .speaking-teacher.male-teacher:not(.speaking) {
          animation: none;
        }
        /* Speaking rhythm: subtle body energy — no gesture changes, CSS does all the work */
        .speaking-teacher.male-teacher.speaking {
          animation: none;
          transform-origin: 50% 30%;
        }
        @keyframes maleSpeak {
          0%, 100% { transform: translateY(0)     scaleY(1); }
          22%       { transform: translateY(-3px)  scaleY(1.012); }
          55%       { transform: translateY(0.5px) scaleY(0.997); }
          78%       { transform: translateY(-2px)  scaleY(1.007); }
        }
        .teacher-glow {
          position: absolute;
          inset: 12% 8% 10%;
          border-radius: 28px;
          background: radial-gradient(circle at 50% 30%, var(--teacher-accent, #0ea5e9) 0%, rgba(255,255,255,0) 72%);
          filter: blur(14px);
          opacity: 0.18;
          pointer-events: none;
        }
        /* Base layer – full body */
        .st-layer { position: absolute; pointer-events: none; }
        .st-body { inset: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1; filter: drop-shadow(0 10px 18px rgba(15,23,42,0.22)); }
        /* Gesture – arm overlay (bottom half of figure) */
        .st-gesture {
          z-index: 2;
          bottom: 0; left: 50%; transform: translateX(-50%);
          width: auto; height: 58%;
          object-fit: contain;
          transition: opacity 0.3s ease;
        }
        /* Expression – face overlay (top ~38% of figure) */
        .st-expression {
          z-index: 3;
          top: 4%; left: 50%; transform: translateX(-50%);
          width: 38%; height: 38%;
          object-fit: contain;
          transition: opacity 0.25s ease;
        }
        /* Viseme – mouth overlay (~30% from top, centred) */
        .st-viseme {
          z-index: 4;
          top: 28%; left: 50%; transform: translateX(-50%);
          width: 52%; height: auto;
          object-fit: contain;
        }
        /* Blink – eyes overlay (very top, centred) */
        .st-blink {
          z-index: 5;
          top: 2%; left: 50%; transform: translateX(-50%);
          width: 35%; height: auto;
          object-fit: contain;
        }
        .tutor-setup-panel {
          min-height: 100dvh;
          margin: 0;
          border-radius: 0;
          border: 0;
          background:
            radial-gradient(circle at top left, rgba(251,191,36,0.22), transparent 28%),
            radial-gradient(circle at top right, rgba(34,197,94,0.18), transparent 32%),
            linear-gradient(180deg, #fefce8 0%, #ecfccb 100%);
          display: grid;
          place-items: center;
          padding: 1rem;
          overflow: hidden;
        }
        .tutor-quickstart {
          width: min(980px, 100%);
          display: grid;
          grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
          gap: 1.25rem;
          align-items: center;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(190,242,100,0.8);
          border-radius: 32px;
          box-shadow: 0 24px 70px rgba(15,23,42,0.12);
          padding: 1.5rem;
        }
        .tutor-qs-label,
        .vedic-topbar-label,
        .vedic-kicker {
          margin: 0;
          color: #3f6212;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .tutor-qs-title {
          margin: 0.35rem 0 0.6rem;
          color: #14532d;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          line-height: 1.05;
        }
        .tutor-quickstart-duo {
          max-height: calc(100dvh - 3rem);
          grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
          gap: 1rem;
          padding: 1rem 1.1rem;
          align-items: start;
          overflow: hidden;
        }
        .tutor-quickstart-duo .tutor-qs-title {
          font-size: clamp(1.5rem, 2.3vw, 2.1rem);
          margin-bottom: 0.35rem;
        }
        .tutor-qs-stage {
          min-height: 320px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.45), rgba(220,252,231,0.9));
          border: 1px solid rgba(190,242,100,0.75);
          border-radius: 28px;
          padding: 0.75rem;
        }
        .tutor-quickstart-duo .tutor-qs-stage {
          min-height: 220px;
          max-height: 220px;
          padding: 0.45rem;
        }
        .tutor-qs-tagline {
          margin: 0;
          color: #334155;
          font-size: 1rem;
          line-height: 1.55;
        }
        .tutor-quickstart-duo .tutor-qs-tagline {
          font-size: 0.94rem;
          line-height: 1.45;
        }
        .tutor-onboard-card {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 24px;
          background: #f8fafc;
          border: 1px solid #d9f99d;
          display: grid;
          gap: 0.9rem;
        }
        .tutor-quickstart-duo .tutor-onboard-card {
          margin-top: 0.7rem;
          padding: 0.85rem;
          gap: 0.7rem;
        }
        .tutor-onboard-field,
        .tutor-onboard-group {
          display: grid;
          gap: 0.45rem;
        }
        .tutor-onboard-field span,
        .tutor-onboard-label {
          margin: 0;
          color: #166534;
          font-size: 0.86rem;
          font-weight: 700;
        }
        .tutor-onboard-field input {
          height: 48px;
          border-radius: 16px;
          border: 1px solid #cbd5e1;
          padding: 0 0.9rem;
          font-size: 1rem;
          color: #0f172a;
          background: white;
        }
        .tutor-language-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          min-height: 38px;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          border: 1px solid #16a34a;
          background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
          color: white;
          font-size: 0.9rem;
          font-weight: 800;
        }
        .tutor-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }
        .tutor-quickstart-duo .tutor-chip-row {
          gap: 0.45rem;
        }
        .tutor-choice-chip {
          border: 1px solid #cbd5e1;
          background: white;
          color: #334155;
          border-radius: 999px;
          padding: 0.62rem 0.95rem;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
        }
        .tutor-quickstart-duo .tutor-choice-chip {
          padding: 0.52rem 0.82rem;
          font-size: 0.84rem;
        }
        .tutor-choice-chip.active {
          color: white;
          border-color: #16a34a;
          background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
          box-shadow: 0 10px 22px rgba(22,163,74,0.22);
        }
        .tutor-onboard-note {
          margin: 0;
          padding: 0.7rem 0.85rem;
          border-radius: 16px;
          background: #fef9c3;
          color: #854d0e;
          font-size: 0.86rem;
          line-height: 1.45;
        }
        .tutor-qs-actions {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.55rem;
        }
        .tutor-quickstart-duo .tutor-qs-actions {
          margin-top: 0.75rem;
        }
        .tutor-qs-btn {
          min-width: 220px;
          min-height: 52px;
          border-radius: 18px;
          background: linear-gradient(180deg, #84cc16 0%, #16a34a 100%);
          border: 0;
          box-shadow: 0 16px 30px rgba(34,197,94,0.22);
          font-size: 1rem;
          font-weight: 800;
        }
        .tutor-quickstart-duo .tutor-qs-btn {
          min-width: 210px;
          min-height: 48px;
        }
        .link-btn {
          border: 0;
          background: transparent;
          color: #166534;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }
        .vedic-mission-app {
          min-height: 100dvh;
          padding: 0.75rem;
          background:
            linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 0.75rem;
        }
        .vedic-topbar,
        .vedic-coach-card,
        .vedic-path-card,
        .vedic-question-card {
          background: rgba(255,255,255,0.98);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.05);
        }
        .vedic-topbar {
          padding: 0.6rem 0.75rem;
          display: grid;
          gap: 0.35rem;
        }
        .vedic-topbar-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
        }
        .vedic-topbar-main {
          min-width: 0;
          display: grid;
          justify-items: center;
          text-align: center;
        }
        .vedic-topbar-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0.35rem;
        }
        .vedic-topbar-btn {
          min-height: 36px;
          border-radius: 999px;
          border: 1px solid #dbeafe;
          background: #eff6ff;
          color: #1d4ed8;
          padding: 0.35rem 0.8rem;
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }
        .vedic-topbar-btn.active {
          border-color: #86efac;
          background: #f0fdf4;
          color: #166534;
        }
        .vedic-topbar-title {
          margin: 0.1rem 0 0;
          color: #0f172a;
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          line-height: 1.15;
          text-align: center;
        }
        .vedic-topbar-track {
          height: 8px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
        }
        .vedic-topbar-track-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #84cc16, #10b981);
        }
        .vedic-topbar-stats {
          display: none;
        }
        .vedic-stat-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 32px;
          flex: 0 0 auto;
          border-radius: 999px;
          padding: 0.35rem 0.7rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 800;
        }
        .vedic-stat-pill.points { color: #854d0e; background: #fef3c7; border-color: #fde68a; }
        .vedic-stat-pill.muted { color: #64748b; }
        .desktop-only { display: inline-flex; }
        .vedic-focus-shell {
          min-height: 0;
          display: grid;
          place-items: start center;
        }
        .vedic-focus-card {
          min-height: 0;
          height: 100%;
          width: min(920px, 100%);
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 0.5rem;
          padding: 0.7rem;
          background: rgba(255,255,255,0.98);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(15,23,42,0.05);
          overflow: hidden;
        }
        .vedic-focus-card.spotlight {
          border-color: #86efac;
          box-shadow: 0 12px 30px rgba(34,197,94,0.1);
        }
        .vedic-focus-top {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          align-items: center;
        }
        .vedic-focus-top.compact {
          min-height: 28px;
        }
        .vedic-focus-top h2 {
          margin: 0.1rem 0 0.15rem;
          color: #0f172a;
          font-size: clamp(1.1rem, 1.7vw, 1.45rem);
          line-height: 1.2;
        }
        .vedic-turn-stack {
          display: grid;
          gap: 0.25rem;
          justify-items: end;
        }
        .vedic-stage-pill {
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 0.35rem 0.65rem;
          font-size: 0.76rem;
          font-weight: 800;
          white-space: nowrap;
        }
        .vedic-focus-stage {
          min-height: 0;
          display: block;
        }
        .vedic-focus-scene {
          min-height: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.55rem;
        }
        .vedic-focus-coach {
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 0.55rem 0.65rem;
          display: grid;
          grid-template-columns: 64px minmax(0, 1fr);
          gap: 0.55rem;
          align-items: center;
        }
        .vedic-focus-avatar {
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: white;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .vedic-focus-copy h3 {
          margin: 0.1rem 0 0.15rem;
          color: #0f172a;
          font-size: 0.98rem;
          line-height: 1.2;
          font-weight: 700;
        }
        .vedic-focus-copy p:last-child {
          margin: 0;
          color: #475569;
          line-height: 1.4;
          font-size: 0.82rem;
        }
        .vedic-focus-content {
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          overflow: auto;
          padding-right: 0.1rem;
        }
        .vedic-focus-panel {
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: white;
          padding: 0.75rem 0.85rem;
          display: grid;
          gap: 0.4rem;
        }
        .vedic-focus-panel.question.student {
          border-color: #fde68a;
          background: #fffbeb;
        }
        .vedic-focus-panel p {
          margin: 0;
        }
        .vedic-scene-copy {
          color: #475569;
          font-size: 0.92rem;
          line-height: 1.45;
        }
        .vedic-focus-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          justify-content: flex-start;
        }
        .vedic-focus-board {
          min-height: 150px;
        }
        .vedic-answer-block-inline {
          margin-top: 0;
          position: static;
          box-shadow: none;
          background: white;
          border-color: #e2e8f0;
        }
        .vedic-inline-tools-compact {
          margin-top: 0.2rem;
        }
        .vedic-main-layout {
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 0.75rem;
        }
        .vedic-sidekick {
          display: none;
        }
        .vedic-coach-card,
        .vedic-path-card {
          padding: 1rem;
        }
        .vedic-coach-head {
          display: grid;
          grid-template-columns: 132px minmax(0, 1fr);
          gap: 0.85rem;
          align-items: center;
        }
        .vedic-coach-avatar {
          min-height: 164px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          border-radius: 22px;
          background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 0.4rem;
        }
        .vedic-coach-copy h3,
        .vedic-path-header h3,
        .vedic-question-top h2 {
          margin: 0.2rem 0 0.3rem;
          color: #14532d;
          line-height: 1.15;
        }
        .vedic-coach-copy p:last-child,
        .vedic-question-subtitle {
          margin: 0;
          color: #475569;
          line-height: 1.5;
        }
        .vedic-status-row {
          margin-top: 0.9rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.6rem;
        }
        .vedic-status-tile {
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid #dcfce7;
          padding: 0.7rem 0.8rem;
          display: grid;
          gap: 0.2rem;
        }
        .vedic-status-tile span { color: #64748b; font-size: 0.72rem; font-weight: 700; }
        .vedic-status-tile strong { color: #14532d; font-size: 1rem; }
        .vedic-coach-note {
          margin: 0.8rem 0 0;
          color: #475569;
          font-size: 0.84rem;
          line-height: 1.45;
        }
        .vedic-badge-strip {
          margin-top: 0.9rem;
          display: grid;
          gap: 0.5rem;
        }
        .vedic-badge-chip {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          border-radius: 16px;
          padding: 0.65rem 0.8rem;
          border: 1px solid #d9f99d;
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
        }
        .vedic-badge-chip.active { background: #fef9c3; border-color: #facc15; color: #854d0e; }
        .vedic-path-header {
          display: flex;
          justify-content: space-between;
          gap: 0.7rem;
          align-items: flex-start;
          margin-bottom: 0.85rem;
        }
        .vedic-path-track {
          display: grid;
          gap: 0.7rem;
          align-content: start;
          max-height: 100%;
          overflow: auto;
          padding-right: 0.2rem;
        }
        .vedic-path-node {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 0.7rem;
          align-items: center;
          padding: 0.75rem;
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          margin-left: var(--path-offset, 0);
        }
        .vedic-path-node.active { background: linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%); border-color: #22c55e; }
        .vedic-path-node.locked { opacity: 0.55; }
        .vedic-path-badge {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #d9f99d;
          font-weight: 800;
          color: #166534;
        }
        .vedic-path-name { color: #334155; font-size: 0.9rem; font-weight: 700; line-height: 1.3; }
        .vedic-stage { min-height: 0; }
        .vedic-question-card {
          min-height: 100%;
          display: grid;
          grid-template-rows: auto auto auto 1fr;
          padding: 0.9rem;
          gap: 0.75rem;
        }
        .vedic-question-card.spotlight { border-color: #22c55e; box-shadow: 0 22px 44px rgba(34,197,94,0.12); }
        .vedic-question-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
        }
        .vedic-turn-chip {
          border-radius: 999px;
          background: #dcfce7;
          border: 1px solid #86efac;
          color: #166534;
          padding: 0.35rem 0.65rem;
          font-weight: 800;
          font-size: 0.8rem;
          white-space: nowrap;
        }
        .vedic-inline-coach {
          display: grid;
          grid-template-columns: 96px minmax(0, 1fr) auto;
          gap: 0.75rem;
          align-items: center;
          border-radius: 22px;
          border: 1px solid #d9f99d;
          background: linear-gradient(180deg, #f8fafc 0%, #f0fdf4 100%);
          padding: 0.7rem 0.8rem;
        }
        .vedic-inline-avatar {
          min-height: 96px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          border-radius: 18px;
          background: white;
          border: 1px solid #dcfce7;
          overflow: hidden;
        }
        .vedic-inline-copy h3 {
          margin: 0.15rem 0 0.2rem;
          color: #14532d;
          line-height: 1.15;
        }
        .vedic-inline-copy p:last-child {
          margin: 0;
          color: #475569;
          line-height: 1.4;
        }
        .vedic-inline-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(90px, 1fr));
          gap: 0.5rem;
        }
        .vedic-inline-stat {
          border-radius: 16px;
          padding: 0.55rem 0.7rem;
          background: white;
          border: 1px solid #dcfce7;
          display: grid;
          gap: 0.15rem;
        }
        .vedic-inline-stat span {
          color: #64748b;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .vedic-inline-stat strong {
          color: #14532d;
          font-size: 0.95rem;
        }
        .vedic-path-strip {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 0.1rem;
        }
        .vedic-path-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          min-width: auto;
          padding: 0.35rem 0.45rem;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .vedic-path-pill.active {
          background: #f0fdf4;
          border-color: #86efac;
          color: #14532d;
        }
        .vedic-path-pill.completed {
          color: #166534;
        }
        .vedic-path-pill.locked {
          opacity: 0.55;
        }
        .vedic-path-pill-badge {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          font-size: 0.68rem;
          font-weight: 800;
        }
        .vedic-path-pill-text {
          display: none;
        }
        .vedic-question-scroll {
          min-height: 0;
          overflow: auto;
          padding-right: 0.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .vedic-prompt-stack {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.7rem;
          margin-bottom: 0.8rem;
        }
        .vedic-prompt-card {
          border-radius: 20px;
          padding: 0.85rem 0.95rem;
          border: 1px solid #d9f99d;
          background: #f8fafc;
          display: grid;
          gap: 0.35rem;
        }
        .vedic-prompt-card.coach {
          background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
        }
        .vedic-prompt-card.try {
          background: linear-gradient(180deg, #fef9c3 0%, #fef3c7 100%);
          border-color: #fcd34d;
        }
        .vedic-prompt-label {
          color: #166534;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .vedic-prompt-card.try .vedic-prompt-label {
          color: #92400e;
        }
        .vedic-prompt-card p {
          margin: 0;
          color: #1e293b;
          font-size: 0.92rem;
          font-weight: 700;
          line-height: 1.45;
        }
        .vedic-progress-copy {
          margin: 0;
          color: #64748b;
          font-size: 0.82rem;
          line-height: 1.45;
        }
        .vedic-inline-board {
          min-height: 160px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #bfdbfe;
          background: white;
        }
        .vedic-answer-block {
          margin-top: auto;
          border-radius: 22px;
          border: 1px solid #dcfce7;
          background: rgba(248,250,252,0.98);
          backdrop-filter: blur(10px);
          padding: 0.85rem;
          position: sticky;
          bottom: 0;
          box-shadow: 0 -10px 24px rgba(15,23,42,0.06);
        }
        .vedic-answer-input {
          width: 100%;
          min-height: 54px;
          border-radius: 18px;
          border: 2px solid #bbf7d0;
          padding: 0 0.95rem;
          font-size: 1rem;
          color: #0f172a;
          background: white;
        }
        .vedic-action-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          margin-top: 0.85rem;
        }
        .vedic-primary-btn {
          min-width: 140px;
          border-radius: 16px;
          background: linear-gradient(180deg, #84cc16 0%, #16a34a 100%);
          border: 0;
          font-weight: 800;
        }
        .vedic-alert { margin: 0.4rem 0 0; color: #b91c1c; font-weight: 800; }
        .vedic-support-grid {
          display: none;
        }
        .vedic-inline-tools {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.65rem;
          margin-top: 0.75rem;
        }
        .vedic-inline-fold {
          border: 1px solid #d9f99d;
          border-radius: 18px;
          overflow: hidden;
          background: #f8fafc;
        }
        .vedic-fold {
          border: 1px solid #d9f99d;
          border-radius: 22px;
          overflow: hidden;
          background: #f8fafc;
        }
        .vedic-fold summary {
          cursor: pointer;
          list-style: none;
          padding: 0.9rem 1rem;
          background: #f0fdf4;
          color: #166534;
          font-weight: 800;
        }
        .vedic-fold summary::-webkit-details-marker { display: none; }
        .vedic-fold-body {
          padding: 0.9rem 1rem 1rem;
          display: grid;
          gap: 0.8rem;
        }
        .vedic-board-frame {
          min-height: 220px;
          border-radius: 18px;
          background: white;
          border: 1px solid #dbeafe;
          overflow: hidden;
        }
        .vedic-board-frame.compact {
          min-height: 180px;
        }
        .vedic-board-actions { display: flex; gap: 0.55rem; flex-wrap: wrap; }
        .vedic-help-panel {
          margin-top: 0;
          padding: 0;
          border: 0;
          background: transparent;
        }
        .vedic-help-note {
          margin: 0 0 0.7rem;
          color: #475569;
          font-size: 0.82rem;
          line-height: 1.45;
        }

        /* ── Coach-A Layout ─────────────────────────────────────────────── */
        .ca-app {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          overflow: hidden;
          background: #f1f5f9;
          margin: 0 -1.5rem;
        }
        .tutor-shell-live {
          max-width: none;
          padding: 0;
          height: 100dvh;
          overflow: hidden;
        }
        .ca-app-minimal {
          height: 100dvh;
          background:
            radial-gradient(circle at top left, rgba(187,247,208,0.65), transparent 34%),
            linear-gradient(180deg, #f7fee7 0%, #ecfccb 100%);
          margin: 0;
        }

        /* Progress strip */
        .ca-strip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0 1.25rem;
          background: #0f172a;
          color: white;
          height: 46px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .ca-strip-chapter {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        .ca-strip-bar-wrap {
          flex: 1;
          height: 5px;
          background: #334155;
          border-radius: 999px;
          overflow: hidden;
          min-width: 60px;
        }
        .ca-strip-bar {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8);
          border-radius: 999px;
          transition: width 0.5s ease;
        }
        .ca-strip-stat {
          font-size: 0.72rem;
          color: #94a3b8;
          white-space: nowrap;
        }
        .ca-strip-stat.muted { color: #475569; }
        .ca-strip-points {
          color: #facc15;
          font-weight: 700;
        }
        .ca-app-minimal .ca-strip {
          margin: 1rem 1rem 0;
          border-radius: 18px;
          background: rgba(255,255,255,0.92);
          border: 1px solid #d9f99d;
          box-shadow: 0 12px 30px rgba(22,101,52,0.08);
          color: #0f172a;
        }
        .ca-app-minimal .ca-strip-bar-wrap {
          background: #dbeafe;
        }
        .ca-app-minimal .ca-strip-bar {
          background: linear-gradient(90deg, #84cc16, #10b981);
        }
        .ca-app-minimal .ca-strip-chapter,
        .ca-app-minimal .ca-strip-stat {
          color: #334155;
        }
        .ca-app-minimal .ca-strip-stat.muted {
          color: #64748b;
        }

        /* Body: left coach + right content */
        .ca-body {
          display: grid;
          grid-template-columns: 260px 1fr;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        /* Left coach panel */
        .ca-coach {
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 55%, #162032 100%);
          border-right: 1px solid #1e3a5f;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .ca-coach-stage {
          height: 280px;
          flex-shrink: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 0;
        }
        .ca-coach-speech {
          margin: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          padding: 0.55rem 0.75rem;
          min-height: 50px;
          flex-shrink: 0;
        }
        .ca-coach-speech p {
          font-size: 0.80rem;
          color: #cbd5e1;
          line-height: 1.45;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Chapter + exercise nav */
        .ca-coach-nav {
          flex: 1;
          padding: 0 0.5rem 1rem;
          overflow-y: auto;
        }
        .ca-nav-label {
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #475569;
          padding: 0.3rem 0.5rem 0.2rem;
          margin: 0;
        }
        .ca-chapter-list { display: flex; flex-direction: column; gap: 1px; }
        .ca-chapter-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.5rem;
          border-radius: 6px;
          cursor: default;
          transition: background 0.15s;
        }
        .ca-chapter-item.active {
          background: rgba(14,165,233,0.18);
        }
        .ca-ch-num {
          font-size: 0.65rem;
          color: #475569;
          font-weight: 700;
          width: 18px;
          flex-shrink: 0;
        }
        .ca-ch-name {
          font-size: 0.72rem;
          color: #64748b;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ca-chapter-item.active .ca-ch-name { color: #e2e8f0; font-weight: 600; }
        .ca-ch-badge {
          font-size: 0.6rem;
          font-weight: 700;
          background: #0ea5e9;
          color: white;
          padding: 0.1rem 0.35rem;
          border-radius: 999px;
          flex-shrink: 0;
        }

        .ca-ex-list { display: flex; flex-direction: column; gap: 2px; }
        .ca-ex-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.22rem 0.5rem;
          border-radius: 5px;
          font-size: 0.70rem;
          color: #64748b;
        }
        .ca-ex-item.active { background: rgba(255,255,255,0.06); color: #94a3b8; }
        .ca-ex-dot { width: 14px; flex-shrink: 0; font-size: 0.65rem; }
        .ca-ex-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ca-ex-grp {
          font-size: 0.6rem;
          color: #475569;
          background: rgba(255,255,255,0.06);
          padding: 0.05rem 0.3rem;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .ca-mini-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem;
          margin-top: 0.8rem;
          padding: 0 0.25rem;
        }
        .ca-mini-stat {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 0.35rem 0.5rem;
          display: flex;
          flex-direction: column;
        }
        .ca-mini-stat span { font-size: 0.62rem; color: #475569; }
        .ca-mini-stat strong { font-size: 0.82rem; color: #94a3b8; font-weight: 700; }
        .ca-mission-card {
          padding: 0.8rem;
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(22,163,74,0.2) 0%, rgba(15,23,42,0.18) 100%);
          border: 1px solid rgba(74,222,128,0.18);
          margin: 0.2rem 0.25rem 0.65rem;
        }
        .ca-mission-title {
          margin: 0.2rem 0 0.25rem;
          color: #f8fafc;
          font-size: 0.98rem;
          line-height: 1.3;
        }
        .ca-mission-copy {
          margin: 0;
          color: #cbd5e1;
          font-size: 0.75rem;
          line-height: 1.45;
        }
        .ca-reward-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-top: 0.7rem;
        }
        .ca-reward-chip {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0.24rem 0.55rem;
          font-size: 0.68rem;
          font-weight: 700;
          color: #ecfccb;
          background: rgba(15,23,42,0.28);
          border: 1px solid rgba(255,255,255,0.09);
        }
        .ca-badge-row {
          display: grid;
          gap: 0.45rem;
          margin-top: 0.75rem;
        }
        .ca-badge {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.55rem;
          border-radius: 10px;
          background: rgba(15,23,42,0.28);
          border: 1px solid rgba(255,255,255,0.06);
          color: #94a3b8;
          font-size: 0.72rem;
        }
        .ca-badge strong {
          color: #e2e8f0;
          font-size: 0.64rem;
          letter-spacing: 0.08em;
        }
        .ca-badge.active {
          color: #f8fafc;
          border-color: rgba(250,204,21,0.4);
          background: rgba(250,204,21,0.12);
        }

        /* Right content panel */
        .ca-content {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: white;
        }

        /* Board */
        .ca-board {
          flex: 1;
          min-height: 0;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          overflow: hidden;
          position: relative;
        }
        .ca-board-idle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #94a3b8;
          gap: 0.4rem;
        }
        .ca-idle-icon { font-size: 2rem; }
        .ca-idle-text { font-size: 0.9rem; font-weight: 600; color: #64748b; margin: 0; }

        /* Board toolbar */
        .ca-board-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .ca-speed-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #475569;
        }
        .ca-speed-row input[type="range"] { width: 70px; }

        /* Question zone */
        .ca-question {
          padding: 0.9rem 1.25rem 1rem;
          background: white;
          overflow-y: auto;
          flex-shrink: 0;
          max-height: 46vh;
          border-top: 2px solid #e2e8f0;
        }
        .ca-question.spotlight {
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border-top-color: #10b981;
        }
        .ca-question-head {
          margin-bottom: 0.55rem;
        }
        .ca-question-label {
          margin: 0 0 0.15rem;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #16a34a;
        }
        .ca-question-subtle {
          margin: 0;
          color: #475569;
          font-size: 0.8rem;
        }
        .ca-app-minimal .ca-body {
          grid-template-columns: 240px minmax(0, 1fr);
          gap: 1rem;
          padding: 1rem;
        }
        .ca-app-minimal .ca-coach {
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 18px 40px rgba(15,23,42,0.12);
        }
        .ca-app-minimal .ca-coach-stage {
          height: 180px;
          padding-top: 0.5rem;
        }
        .ca-app-minimal .ca-coach-speech {
          margin-top: 0;
        }
        .ca-app-minimal .ca-coach-nav {
          padding-bottom: 0.75rem;
        }
        .ca-app-minimal .ca-ex-list {
          max-height: 220px;
          overflow-y: auto;
        }
        .ca-app-minimal .ca-content {
          gap: 0.85rem;
          background: transparent;
        }
        .ca-app-minimal .ca-board,
        .ca-app-minimal .ca-board-bar,
        .ca-app-minimal .ca-question {
          border-radius: 24px;
          border: 1px solid #d9f99d;
          box-shadow: 0 18px 40px rgba(15,23,42,0.08);
        }
        .ca-app-minimal .ca-board {
          flex: 0 0 44%;
          background: rgba(255,255,255,0.96);
        }
        .ca-app-minimal .ca-board-bar {
          background: rgba(255,255,255,0.96);
          border-bottom: 0;
          padding: 0.6rem 0.85rem;
        }
        .ca-app-minimal .ca-question {
          flex: 1;
          min-height: 0;
          max-height: none;
          background: rgba(255,255,255,0.97);
          border-top-width: 1px;
        }
        .ca-help-drawer {
          margin-top: 0.85rem;
          border: 1px solid #d9f99d;
          border-radius: 18px;
          background: #f8fafc;
          overflow: hidden;
        }
        .ca-help-drawer summary {
          cursor: pointer;
          list-style: none;
          padding: 0.8rem 1rem;
          font-weight: 700;
          color: #166534;
          background: #f0fdf4;
        }
        .ca-help-drawer summary::-webkit-details-marker {
          display: none;
        }
        .ca-help-dock {
          margin-top: 0;
          border: 0;
          border-radius: 0;
        }

        /* Keep udemy-question-meta / text / feedback / qa-dock classes used inside ca-question */
        .udemy-question-meta {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.6rem;
          flex-wrap: wrap;
        }
        .udemy-question-text {
          font-size: 1.08rem;
          margin: 0 0 0.75rem;
          line-height: 1.5;
          color: #0f172a;
        }
        .udemy-visual { margin-bottom: 0.75rem; background: #f8fafc; }
        .udemy-answer-label {
          display: block;
          margin-bottom: 0.3rem;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .udemy-hint { margin-top: 0.4rem; margin-bottom: 0; font-size: 0.82rem; }
        .udemy-answer-actions {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.75rem;
          flex-wrap: wrap;
        }

        /* Feedback */
        .udemy-feedback {
          border-radius: 10px;
          padding: 1rem 1.1rem;
          border-left: 4px solid #cbd5e1;
          background: #f8fafc;
          margin-top: 0.75rem;
        }
        .udemy-feedback.correct { border-left-color: #059669; background: #ecfdf5; }
        .udemy-feedback.wrong   { border-left-color: #dc2626; background: #fef2f2; }
        .udemy-feedback-verdict { font-size: 1.05rem; font-weight: 700; margin: 0 0 0.4rem; }
        .udemy-feedback.correct .udemy-feedback-verdict { color: #065f46; }
        .udemy-feedback.wrong   .udemy-feedback-verdict { color: #991b1b; }

        /* Q&A dock */
        .udemy-qa-dock {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem 1.1rem;
          margin-top: 0.75rem;
        }
        .udemy-qa-title { margin: 0 0 0.7rem; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
        .udemy-chat-history {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 280px;
          overflow-y: auto;
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .udemy-chat-bubble { display: flex; flex-direction: column; max-width: 85%; }
        .udemy-chat-bubble.student { align-self: flex-end; align-items: flex-end; }
        .udemy-chat-bubble.tutor   { align-self: flex-start; align-items: flex-start; }
        .udemy-bubble-text {
          padding: 0.5rem 0.75rem;
          font-size: 0.88rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .udemy-chat-bubble.student .udemy-bubble-text {
          background: var(--accent, #0ea5e9);
          color: white;
          border-radius: 12px 12px 2px 12px;
        }
        .udemy-chat-bubble.tutor .udemy-bubble-text {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px 12px 12px 2px;
        }
        .udemy-bubble-name { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; }
        .udemy-chat-input-row { display: flex; gap: 0.5rem; align-items: flex-end; }
        .udemy-chat-input {
          flex: 1;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          padding: 0.5rem 0.75rem;
          font-size: 0.88rem;
          resize: none;
          font-family: inherit;
        }

        /* Developer tools */
        .udemy-devtools {
          margin: 0.5rem 0.75rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .udemy-devtools > summary {
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: #64748b;
          background: #f8fafc;
          user-select: none;
          list-style: none;
        }
        .udemy-devtools > summary::before { content: "▶  "; font-size: 0.6rem; }
        .udemy-devtools[open] > summary::before { content: "▼  "; }
        .udemy-devtools-body {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Mobile: stack vertically */
        @media (max-width: 768px) {
          .tutor-setup-panel {
            padding: 0.75rem;
            overflow: auto;
          }
          .tutor-quickstart,
          .tutor-quickstart-duo {
            grid-template-columns: 1fr;
            max-height: none;
            width: min(100%, 560px);
            padding: 0.9rem;
          }
          .tutor-qs-stage,
          .tutor-quickstart-duo .tutor-qs-stage {
            min-height: 170px;
            max-height: 170px;
          }
          .tutor-qs-title {
            font-size: 1.45rem;
          }
          .tutor-onboard-card {
            margin-top: 0.55rem;
            padding: 0.8rem;
            gap: 0.6rem;
          }
          .tutor-qs-actions {
            margin-top: 0.6rem;
          }
          .tutor-qs-btn {
            width: 100%;
            min-width: 0;
          }
          .vedic-mission-app {
            padding: 0.55rem;
            gap: 0.55rem;
          }
          .vedic-topbar {
            padding: 0.7rem 0.75rem;
          }
          .desktop-only {
            display: none;
          }
          .vedic-topbar-row {
            gap: 0.35rem;
            align-items: center;
          }
          .vedic-topbar-actions {
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
          }
          .vedic-topbar-btn {
            justify-content: center;
          }
          .vedic-topbar-title {
            font-size: 1.1rem;
          }
          .vedic-stat-pill {
            min-height: 30px;
            padding: 0.3rem 0.6rem;
            font-size: 0.76rem;
          }
          .vedic-topbar-stats .vedic-stat-pill:nth-child(n + 5) {
            display: none;
          }
          .vedic-main-layout {
            grid-template-columns: 1fr;
          }
          .vedic-focus-card {
            padding: 0.6rem;
            gap: 0.5rem;
          }
          .vedic-focus-top {
            flex-direction: row;
            gap: 0.4rem;
          }
          .vedic-focus-scene {
            grid-template-columns: 1fr;
          }
          .vedic-focus-coach {
            grid-template-columns: 56px minmax(0, 1fr);
            padding: 0.5rem 0.55rem;
            gap: 0.5rem;
          }
          .vedic-focus-avatar {
            min-height: 56px;
          }
          .vedic-path-pill {
            min-width: auto;
            padding: 0.28rem 0.35rem;
          }
          .vedic-path-pill-badge {
            width: 20px;
            height: 20px;
            font-size: 0.62rem;
          }
          .vedic-focus-panel {
            padding: 0.65rem 0.7rem;
          }
          .vedic-answer-block {
            padding: 0.7rem;
            border-radius: 18px;
          }
          .vedic-answer-input {
            min-height: 48px;
          }
          .vedic-action-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.45rem;
          }
          .vedic-action-row .button {
            width: 100%;
            min-width: 0;
            margin: 0;
          }
          .vedic-focus-actions {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .vedic-focus-actions .button {
            width: 100%;
            min-width: 0;
          }
          .vedic-inline-tools {
            grid-template-columns: 1fr;
          }
          .vedic-fold summary {
            padding: 0.75rem 0.85rem;
          }
          .vedic-fold-body {
            padding: 0.8rem 0.85rem 0.85rem;
          }
          .ca-body { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
          .ca-coach { flex-direction: row; height: 100px; }
          .ca-coach-stage { height: 100px; width: 80px; }
          .ca-coach-speech { display: none; }
          .ca-coach-nav { display: none; }
          .ca-app { margin: 0 -1rem; }
          .ca-app-minimal .ca-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            padding: 0.75rem;
          }
          .ca-app-minimal .ca-board {
            flex: 0 0 34%;
            min-height: 220px;
          }
          .ca-app-minimal .ca-question {
            padding: 0.85rem 0.95rem 1rem;
          }
        }
      `}</style>
    </main>
  );
}

