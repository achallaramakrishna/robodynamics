"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  TutorCatalogResponse,
  TutorChapter,
  TutorCheckResponse,
  TutorExerciseGroup,
  TutorNextQuestionResponse,
  TutorOrchestratorSnapshot,
  TutorOrchestratorState,
  TutorQuestion,
  TutorRealtimeEvent,
  TutorScreenplayBeat,
  TutorTeachingStep,
  TutorStartResponse
} from "@/lib/types";

type Status = "idle" | "loading" | "ready" | "error";
type Confidence = "low" | "medium" | "high";
type ScreenplayMode = "core" | "remedial" | "challenge";
type MicPermission = "unknown" | "granted" | "prompt" | "denied" | "unsupported";

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
    };

type Avatar = { id: string; name: string; role: string; color: string; style: "boy" | "girl" };
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

const DEFAULT_COURSE_ID = "vedic_math";
const MODULE_TO_COURSE_ID: Record<string, string> = {
  VEDIC_MATH: "vedic_math",
  NEET_PHYSICS: "neet_physics",
  NEET_CHEMISTRY: "neet_chemistry",
  NEET_MATH: "neet_math"
};
const EX_GROUP_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

const AVATARS: Avatar[] = [
  { id: "arya", name: "Arya", role: "Calm Mentor", color: "#0ea5e9", style: "girl" },
  { id: "ved", name: "Ved", role: "Fast Coach", color: "#22c55e", style: "boy" },
  { id: "tara", name: "Tara", role: "Friendly Teacher", color: "#f97316", style: "girl" },
  { id: "niva", name: "Niva", role: "Patient Guide", color: "#6366f1", style: "boy" }
];

const AVATAR_STAGE_ART: Record<string, string> = {
  arya: "/ai-tutor/avatars/5.svg",
  ved: "/ai-tutor/avatars/3.svg",
  tara: "/ai-tutor/avatars/4.svg",
  niva: "/ai-tutor/avatars/5.svg"
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

function AvatarCharacter({
  avatar,
  speaking
}: {
  avatar: Avatar;
  speaking?: boolean;
}) {
  const src = AVATAR_STAGE_ART[avatar.id] || "/ai-tutor/avatars/5.svg";
  return (
    <div
      className={`teacher-stage-avatar${speaking ? " speaking" : ""}`}
      style={{ ["--teacher-accent" as any]: avatar.color }}
    >
      <div className="teacher-stage-glow" aria-hidden="true" />
      <Image
        src={src}
        alt={`${avatar.name} teaching avatar`}
        width={340}
        height={440}
        unoptimized
        className="teacher-stage-image"
      />
    </div>
  );
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
      <svg viewBox="0 0 760 340" width="100%" height="340" role="img" aria-label="AI Tutor Whiteboard">
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

const DEFAULT_EXERCISE_GROUPS: TutorExerciseGroup[] = EX_GROUP_KEYS.map((g) => ({ exerciseGroup: g, title: `Exercise ${g}` }));

export default function VedicTutorPage() {
  return (
    <Suspense fallback={<main className="container"><section className="panel">Loading tutor...</section></main>}>
      <VedicTutorContent />
    </Suspense>
  );
}

function VedicTutorContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const studentNameFromQuery = (params.get("studentName") || params.get("learnerName") || "").trim();
  const moduleFromQuery = (params.get("module") || "").trim().toUpperCase();
  const courseIdFromQuery = (params.get("courseId") || "").trim().toLowerCase();
  const requestedCourseId = courseIdFromQuery || MODULE_TO_COURSE_ID[moduleFromQuery] || DEFAULT_COURSE_ID;

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [courseId, setCourseId] = useState(requestedCourseId);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSource, setLessonSource] = useState("");
  const [lessonEstimatedMinutes, setLessonEstimatedMinutes] = useState(0);
  const [lessonSubtopics, setLessonSubtopics] = useState<string[]>([]);
  const [lessonLearningGoals, setLessonLearningGoals] = useState<string[]>([]);
  const [lessonExerciseCoverage, setLessonExerciseCoverage] = useState<string[]>([]);
  const [lessonExerciseFlow, setLessonExerciseFlow] = useState<Array<{ exerciseGroup: string; subtopic: string }>>([]);
  const [lessonTeachingScript, setLessonTeachingScript] = useState<TutorTeachingStep[]>([]);
  const [lessonScreenplay, setLessonScreenplay] = useState<TutorScreenplayBeat[]>([]);
  const [coreIdeas, setCoreIdeas] = useState<string[]>([]);

  const [chapters, setChapters] = useState<TutorChapter[]>(DEFAULT_CHAPTERS);
  const [exerciseGroups, setExerciseGroups] = useState<TutorExerciseGroup[]>(DEFAULT_EXERCISE_GROUPS);
  const [selectedChapter, setSelectedChapter] = useState(DEFAULT_CHAPTERS[0].chapterCode);
  const [activeChapter, setActiveChapter] = useState(DEFAULT_CHAPTERS[0].chapterCode);
  const [selectedExerciseGroup, setSelectedExerciseGroup] = useState("A");
  const [activeExerciseGroup, setActiveExerciseGroup] = useState("A");
  const [studentName, setStudentName] = useState("");

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
  const speakSeqRef = useRef(0);
  const teachRunRef = useRef(0);
  const kickoffRunningRef = useRef(false);
  const lastKickoffTokenRef = useRef("");
  const autoListenQuestionRef = useRef("");
  const speakRef = useRef<(text: string) => Promise<void>>(async () => {});
  const teachOnBoardRef = useRef<() => Promise<void>>(async () => {});
  const sessionRecoveryRef = useRef(false);

  const canStart = useMemo(() => token.trim().length > 20, [token]);
  const chapterList = chapters.length ? chapters : DEFAULT_CHAPTERS;
  const exerciseList = exerciseGroups.length ? exerciseGroups : DEFAULT_EXERCISE_GROUPS;

  const previewChapter = useMemo(() => {
    const code = status === "ready" ? activeChapter : selectedChapter;
    return chapterList.find((c) => c.chapterCode === code) || chapterList[0];
  }, [status, activeChapter, selectedChapter, chapterList]);

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
  const activeTeachingStep = useMemo(() => {
    if (!question) return null;
    const exact = visibleTeachingScript.find((s) => s.exerciseGroup === question.exerciseGroup);
    if (exact) return exact;
    return visibleTeachingScript.find(
      (s) => s.subtopic.trim().toLowerCase() === (question.subtopic || "").trim().toLowerCase()
    ) || null;
  }, [visibleTeachingScript, question]);
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
    if (screenplayMode === "core") {
      return core.length ? core : gated;
    }

    const modeSpecific = gated.filter((beat) => beat.performanceTag === screenplayMode);
    if (!modeSpecific.length) {
      return core.length ? core : gated;
    }

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
    return merged.length ? merged : gated;
  }, [lessonScreenplay, question, activeAttempt, confidence, screenplayMode]);

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
    const wsUrl = `${protocol}://${window.location.host}/ai-tutor-api/vedic/ws/${encodeURIComponent(sessionId)}`;
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
    const line = (text || "").trim();
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
      const ttsResponse = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: line,
          avatarId: activeAvatar.id,
          languageCode: "en-IN",
          pace: 1.0
        })
      });
      const ttsData = await ttsResponse.json().catch(() => null);
      if (ttsResponse.ok && ttsData?.audioBase64) {
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
      utter.rate = 0.95;
      utter.pitch = 1;
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

  function normalizeSvgBoardSteps(raw?: TutorScreenplayBeat["svgAnimation"]): SvgBoardStep[] {
    if (!Array.isArray(raw)) return [];
    const normalized: SvgBoardStep[] = [];
    for (const item of raw.slice(0, 24)) {
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

    addText("header", 20, 26, "Classroom Whiteboard Session", avatar.color, 17);
    addLine("header_line", 16, 36, 744, 36, "#cbd5e1", 1);

    const customSvgSteps = normalizeSvgBoardSteps(beat?.svgAnimation);
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
      addText("fd_intro", 20, 62, "Step 1: Board demo of the method flow.", "#334155", 14);
      addLine("fd_1", 420, 62, 620, 62, avatar.color, 2);
      addLine("fd_2", 420, 86, 670, 86, avatar.color, 2);
      addLine("fd_3", 420, 110, 600, 110, avatar.color, 2);
      addLine("fd_arrow", 620, 62, 655, 86, "#ef4444", 2);
      addText("fd_note", 430, 134, "Teacher writes each transition.", "#1e293b", 12);
    }

    if (!customSvgSteps.length && teachingStep?.boardMode !== "free_draw" && (q.subtopic || "").toLowerCase().includes("ten point circle")) {
      addText("tpc_intro", 20, 62, "Step 1: I will draw the ten-point circle first.", "#334155", 14);
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

    addText("question_title", 20, 176, "Step 2: Let's understand the task.", "#334155", 14);
    const boardQuestionLines = splitText(q.questionText, 44).slice(0, 2);
    for (const [idx, line] of boardQuestionLines.entries()) {
      addText(`q_line_${idx}`, 20, 198 + idx * 20, line, "#0f172a", 15);
    }
    addText("subtopic", 20, 250, compactText(`Subtopic: ${q.subtopic || q.skill}`, 64), "#334155", 14);
    addText("hint", 20, 272, compactText(`Hint: ${q.hint}`, 64), "#334155", 14);
    if (teachingStep) {
      addText("checkpoint", 20, 294, compactText(`Checkpoint: ${teachingStep.checkpointPrompt}`, 64), "#7c2d12", 14);
    } else {
      addText("check_u", 20, 294, "Can you tell me your first step?", "#7c2d12", 15);
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
      await startSession();
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
    if (!question || isTeachingBoard) return;
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
          setIsTeachingBoard(false);
          setAwaitingStudentResponse(true);
          return;
        }
      }
      void sendOrchestratorCommand("BOARD_COMPLETE", {
        reason: "screenplay_completed_without_explicit_checkpoint",
      });
      setIsTeachingBoard(false);
      setAwaitingStudentResponse(true);
      return;
    }

    void logTutorEvent("SCREENPLAY_FALLBACK_TEACH", {
      mode: screenplayMode,
      reason: "no_screenplay_for_group",
      exerciseGroup: question.exerciseGroup,
    });
    const steps = buildBoardSteps(question, activeAvatar, activeTeachingStep, null);
    setBoardSteps(steps);
    setBoardRunId((v) => v + 1);
    await Promise.all([
      waitForBoard(boardDurationMs(steps)),
      speak(`${toChatStylePrompt(question)} ${activeTeachingStep?.teacherLine || question.hint}.`)
    ]);
    if (runId !== teachRunRef.current) return;

    setIsTeachingBoard(false);
    void sendOrchestratorCommand("BOARD_COMPLETE", {
      reason: "fallback_board_complete",
    });
    await speak(
      `Nice progress. ${activeTeachingStep?.checkpointPrompt || "What should we do first?"} ${
        activeTeachingStep?.microPractice || ""
      }`
    );
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

  async function startSession() {
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
      setLessonTitle(data.lesson.title);
      setLessonSource(data.lesson.source);
      setLessonEstimatedMinutes(data.lesson.estimatedMinutes || 0);
      setLessonSubtopics(data.lesson.subtopics || []);
      setLessonLearningGoals(data.lesson.learningGoals || []);
      setLessonExerciseCoverage(data.lesson.exerciseCoverage || []);
      setLessonExerciseFlow(data.lesson.exerciseFlow || []);
      setLessonTeachingScript(data.lesson.teachingScript || []);
      setLessonScreenplay(data.lesson.screenplay || []);
      setCoreIdeas(data.lesson.coreIdeas || []);

      if (data.chapters?.length) setChapters(data.chapters);
      if (data.exerciseGroups?.length) setExerciseGroups(data.exerciseGroups);

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
      const welcomeLine = `Hi ${greetingName}! I am ${activeAvatar.name}, your ${activeAvatar.role}. Welcome to ${data.lesson.title}. We will learn it step by step together.`;
      setTeacherUtterance(welcomeLine);
      if (autoTeachEnabled) {
        setPendingKickoffToken(`${Date.now()}_${data.sessionId}_${data.question?.questionId || "q"}_welcome`);
        setPendingKickoff("welcome");
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
      if (data.coachTip) {
        await speakRef.current(data.coachTip);
      } else if (data.correct) {
        if (autoTeachEnabled) {
          await speakRef.current("Great work. Moving to the next question.");
          await nextQuestion();
          return;
        }
        await speakRef.current("Great work. Tell me how you got that answer, then click Next Question.");
      } else {
        const retryLine = `Good attempt. ${activeTeachingStep?.checkpointPrompt || "Let us retry this with one smaller step."}`;
        if (autoTeachEnabled) {
          clearBoard();
          setTeacherUtterance(retryLine);
          setPendingKickoffToken(`${Date.now()}_${sessionId}_${question.questionId}_retry`);
          setPendingKickoff("teach");
        } else {
          await speakRef.current(retryLine);
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
        exerciseGroup: selectedExerciseGroup
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
      `Moved to next question: Exercise ${data.question?.exerciseGroup || selectedExerciseGroup}`,
      { source: "next_question" }
    );
    void sendOrchestratorCommand("NEXT_QUESTION", {
      questionId: data.question?.questionId || "",
      chapterCode: data.activeChapterCode || selectedChapter,
      exerciseGroup: data.activeExerciseGroup || selectedExerciseGroup,
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
    if (data.lesson) {
      setLessonTitle(data.lesson.title);
      setLessonSource(data.lesson.source);
      setLessonEstimatedMinutes(data.lesson.estimatedMinutes || 0);
      setLessonSubtopics(data.lesson.subtopics || []);
      setLessonLearningGoals(data.lesson.learningGoals || []);
      setLessonExerciseCoverage(data.lesson.exerciseCoverage || []);
      setLessonExerciseFlow(data.lesson.exerciseFlow || []);
      setLessonTeachingScript(data.lesson.teachingScript || []);
      setLessonScreenplay(data.lesson.screenplay || []);
      setCoreIdeas(data.lesson.coreIdeas || []);
    }

    clearBoard();
    if (autoTeachEnabled) {
      setPendingKickoffToken(`${Date.now()}_${sessionId}_${data.question?.questionId || "q"}_teach`);
      setPendingKickoff("teach");
    }
  }

  async function askDoubt() {
    if (!sessionId || !doubt.trim()) return;
    addConversationTurn("student", "doubt", doubt.trim(), { source: "doubt_question" });
    void sendOrchestratorCommand("ASK_DOUBT", {
      messageLength: doubt.trim().length,
    });

    const response = await fetch("/api/vedic/doubt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, courseId, message: doubt.trim() })
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      const msg = data.error || "Unable to fetch doubt explanation.";
      setError(msg);
      if (isExpiredSessionError(msg)) {
        await recoverExpiredSession("ask_doubt");
      }
      return;
    }
    setDoubtReply(String(data.reply || ""));
    addConversationTurn("tutor", "doubt", String(data.reply || ""), { source: "doubt_reply" });
    void speak(String(data.reply || ""));
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
          const welcomeLine = `Hi ${greetingName}! I am ${activeAvatar.name}, your ${activeAvatar.role}. Welcome to ${lessonTitle || previewChapter?.title || "this chapter"}. We will learn it step by step together.`;
          setTeacherUtterance(welcomeLine);
          await speakRef.current(welcomeLine);
          await speakRef.current("Before we start, stay active. I will teach, then you answer each checkpoint.");
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
  }, [status, question, pendingKickoff, pendingKickoffToken, lessonTitle, previewChapter?.title, studentName, activeAvatar.name, activeAvatar.role]);

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
    <main className="container tutor-shell">
      <section className={`panel tutor-setup-panel${status === "ready" ? " tutor-setup-panel-live" : ""}`}>
        <div className={`setup-grid${status === "ready" ? " setup-grid-live" : ""}`}>
          <div className="setup-controls">
            {status !== "ready" ? (
              <div className="setup-hero-copy">
                <span className="setup-hero-kicker">Live AI Classroom</span>
                <h1 className="tutor-main-title">Vedic Math AI Tutor Classroom</h1>
                <p className="muted tutor-main-subtitle">
                  Structured like a course lesson: teacher explains on the board, pauses for your response, then moves to guided exercises.
                </p>
                <p className="setup-flow-inline">
                  <strong>Flow:</strong> Setup {"->"} Learn {"->"} Practice
                </p>
                <div className="setup-chip-row setup-chip-row-left">
                  <span className="pill">Session token: {canStart ? "detected" : "missing/invalid"}</span>
                  <span className="pill">Course: {courseId}</span>
                  <span className="pill">Flow: {autoTeachEnabled ? "auto" : "manual"}</span>
                </div>
              </div>
            ) : (
              <div className="setup-chip-row setup-chip-row-left">
                <span className="pill">Session token: {canStart ? "detected" : "missing/invalid"}</span>
                <span className="pill">Course: {courseId}</span>
                <span className="pill">Teacher: {activeAvatar.name}</span>
                <span className="pill">Flow: {autoTeachEnabled ? "auto" : "manual"}</span>
              </div>
            )}

            <div className="setup-form-grid">
              <div className="field-block">
                <label htmlFor="studentName" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>
                  Student
                </label>
                <input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => {
                    const nextName = e.target.value;
                    setStudentName(nextName);
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("aiTutorStudentName", nextName);
                    }
                  }}
                  placeholder="Enter student name"
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div className="field-block">
                <label htmlFor="chapterSelect" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>
                  Chapter
                </label>
                <select
                  id="chapterSelect"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  {chapterList.map((c) => (
                    <option key={c.chapterCode} value={c.chapterCode}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-block">
                <label htmlFor="exerciseSelect" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>
                  Exercise
                </label>
                <select
                  id="exerciseSelect"
                  value={selectedExerciseGroup}
                  onChange={(e) => setSelectedExerciseGroup(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  {exerciseList.map((g) => (
                    <option key={g.exerciseGroup} value={g.exerciseGroup}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-block confidence-field">
                <label htmlFor="confidence" style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>
                  Confidence
                </label>
                <select
                  id="confidence"
                  value={confidence}
                  onChange={(e) => setConfidence(e.target.value as Confidence)}
                  style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="setup-actions">
              <button className="button" onClick={startSession} disabled={!canStart || status === "loading"}>
                {status === "loading" ? "Starting..." : sessionId ? "Restart with Chapter" : "Start Tutor Session"}
              </button>
              <button className="button secondary" type="button" onClick={() => setAutoTeachEnabled((v) => !v)}>
                Flow: {autoTeachEnabled ? "Auto Teach" : "Manual"}
              </button>
              <button className="button secondary" type="button" onClick={() => setVoiceEnabled((v) => !v)}>
                Voice: {voiceEnabled ? "On" : "Off"}
              </button>
            </div>
          </div>

          <div className={`panel setup-preview${status === "ready" ? " setup-preview-live" : ""}`}>
            {status !== "ready" ? (
              <>
                <h3 style={{ marginTop: 0, marginBottom: "0.45rem" }}>What You Will Learn</h3>
                <p style={{ marginTop: 0, marginBottom: "0.4rem" }}><strong>{previewChapter?.title || "Selected Chapter"}</strong></p>
                <p className="muted" style={{ marginTop: 0 }}>
                  Estimated time: {previewChapter?.estimatedMinutes || 20} mins | Exercises: {(previewChapter?.exerciseGroups || ["A", "B", "C"]).join(", ")}
                </p>
                <div className="setup-preview-grid">
                  <div>
                    <p style={{ marginBottom: "0.35rem" }}><strong>Subtopics</strong></p>
                    <ul className="setup-compact-list">
                      {(previewChapter?.subtopics || []).map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ marginBottom: "0.35rem" }}><strong>Exercise Flow (A-I)</strong></p>
                    <ul className="setup-compact-list">
                      {(previewChapter?.exerciseFlow || []).map((item) => (
                        <li key={`${item.exerciseGroup}_${item.subtopic}`}>Exercise {item.exerciseGroup}: {item.subtopic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0, marginBottom: "0.45rem" }}>Session Snapshot</h3>
                <p style={{ marginTop: 0, marginBottom: "0.4rem" }}><strong>{previewChapter?.title || "Selected Chapter"}</strong></p>
                <p className="muted" style={{ marginTop: 0 }}>
                  Estimated time: {lessonEstimatedMinutes || previewChapter?.estimatedMinutes || 20} mins | Exercise: {activeExerciseGroup}
                </p>
                <div className="setup-chip-row setup-chip-row-left">
                  <span className="pill">Teacher: {activeAvatar.name}</span>
                  <span className="pill">Mode: {screenplayMode}</span>
                  <span className="pill">Flow: {flowState}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {status !== "ready" ? (
          <>
            <h3 style={{ marginTop: "0.7rem", marginBottom: "0.45rem" }}>Choose AI Avatar</h3>
            <div className="avatar-selector-grid">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatarId(avatar.id)}
                  className={`avatar-choice${selectedAvatarId === avatar.id ? " active" : ""}`}
                  style={{
                    borderColor: selectedAvatarId === avatar.id ? avatar.color : "#cbd5e1",
                    ["--avatar-color" as any]: avatar.color
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    <AvatarFace avatar={avatar} size={42} />
                    <div>
                      <div style={{ fontWeight: 700, color: avatar.color }}>{avatar.name}</div>
                      <div className="muted" style={{ fontSize: "0.85rem" }}>{avatar.role}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : null}
        {status !== "ready" ? (
          <div className="panel setup-hero-stage" style={{ marginTop: "0.45rem" }}>
            <p className="setup-stage-kicker">Teacher Stage</p>
            <div className="setup-avatar-stage">
              <AvatarCharacter avatar={activeAvatar} speaking={isSpeaking || status === "loading"} />
            </div>
            <p className="setup-stage-title" style={{ color: activeAvatar.color }}>
              {activeAvatar.name} - {activeAvatar.role}
            </p>
            <p className="muted setup-stage-copy">
              {teacherUtterance || "I will teach each step on the board and wait for your response."}
            </p>
          </div>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}
      </section>

      {status === "ready" && question ? (
        <>
          <section className="panel classroom-stage-panel">
            <div className="classroom-stage-header">
              <div>
                <h2 style={{ marginTop: 0, marginBottom: "0.25rem" }}>Classroom Board</h2>
                <p className="muted" style={{ marginTop: 0 }}>
                  The teacher demonstrates on board first, then you solve the exercise in the same flow.
                </p>
              </div>
              <div className="classroom-chip-row">
                <span className="pill">Chapter: {activeChapter}</span>
                <span className="pill">Exercise: {activeExerciseGroup}</span>
                <span className="pill">Mode: {screenplayMode}</span>
                <span className="pill">Flow Engine: {flowState} (v{flowVersion})</span>
                <span className="pill">Realtime: {realtimeConnected ? "connected" : "polling"}</span>
                <span className="pill">Status: {stageStatusText}</span>
              </div>
            </div>

            <div className="classroom-stage-grid">
              <div className="board-workbench">
                {activeTeachingStep ? (
                  <div className="panel teaching-snapshot">
                    {isFirstScene ? (
                      <p style={{ marginTop: 0, marginBottom: "0.35rem" }}>
                        <strong>Scene 1:</strong> Welcome, first concept demo, and your first checkpoint.
                      </p>
                    ) : null}
                    <p style={{ marginTop: 0, marginBottom: "0.35rem" }}>
                      <strong>Now Teaching:</strong> Exercise {activeTeachingStep.exerciseGroup} - {activeTeachingStep.subtopic}
                    </p>
                    <p className="muted" style={{ marginTop: 0, marginBottom: "0.2rem" }}>{activeTeachingStep.teacherLine}</p>
                    <p className="muted" style={{ marginTop: 0, marginBottom: "0.2rem" }}>Board action: {activeTeachingStep.boardAction}</p>
                    <p className="muted" style={{ marginTop: 0, marginBottom: 0 }}>
                      Mode: {activeTeachingStep.boardMode === "free_draw" ? "Free Draw" : "SVG Diagram"}
                    </p>
                  </div>
                ) : null}

                <div className="panel exercise-workbench">
                  <p className="muted" style={{ marginTop: 0, marginBottom: "0.35rem" }}>
                    Skill: {question.skill} | Difficulty: {question.difficulty} | Exercise: {question.exerciseGroup}
                  </p>
                  <p style={{ marginTop: 0 }}><strong>{question.questionText}</strong></p>
                  {question.visual?.svg ? (
                    <div className="panel" style={{ marginBottom: "0.6rem", background: "#f8fafc" }}>
                      <p className="muted" style={{ marginTop: 0 }}>{question.visual.title}</p>
                      <div dangerouslySetInnerHTML={{ __html: question.visual.svg }} />
                    </div>
                  ) : null}
                <label
                  htmlFor="answerInput"
                  style={{
                    display: "block",
                    marginTop: "0.5rem",
                    marginBottom: "0.3rem",
                    fontWeight: 700,
                    color: awaitingStudentResponse ? "#0f766e" : "#334155"
                  }}
                >
                  Your Answer
                </label>
                <input
                  id="answerInput"
                  ref={answerInputRef}
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
                  placeholder="Type your answer here (for example: 10)"
                  style={{
                    borderWidth: awaitingStudentResponse ? "2px" : "1px",
                    borderColor: awaitingStudentResponse ? "#0f766e" : "#cbd5e1",
                    boxShadow: awaitingStudentResponse ? "0 0 0 3px rgba(15,118,110,0.12)" : "none"
                  }}
                />
                  <div className="exercise-actions">
                    <button className="button" onClick={() => void checkAnswer()} disabled={isEvaluatingAnswer}>
                      {isEvaluatingAnswer ? "Checking..." : "Check Answer"}
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={listenAnswer}
                      disabled={isEvaluatingAnswer || isListening || micPermission === "denied"}
                    >
                      {micPermission === "denied" ? "Speak Answer (Mic Blocked)" : "Speak Answer"}
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
                        Stop Listening
                      </button>
                    ) : null}
                    <button className="button secondary" onClick={nextQuestion}>Next Question</button>
                  </div>
                  <p className="muted" style={{ marginTop: "0.55rem", marginBottom: 0 }}>Hint: {question.hint}</p>
                  {micPermission === "denied" ? (
                    <p className="muted" style={{ marginTop: "0.45rem", marginBottom: 0 }}>
                      Microphone access is blocked in your browser. Use text input to continue the lesson.
                    </p>
                  ) : null}
                  {awaitingStudentResponse && !check ? (
                    <div className="panel student-next-step">
                      <p style={{ marginTop: 0, marginBottom: "0.25rem" }}>
                        <strong>Your turn now</strong>
                      </p>
                      <p className="muted" style={{ margin: 0 }}>
                        Type your answer or use Speak Answer, then click Check Answer to continue the teaching loop.
                      </p>
                      {isFirstScene ? (
                        <p className="muted" style={{ marginTop: "0.45rem", marginBottom: 0 }}>
                          First scene is in guided mode: answer this checkpoint to unlock the next scene.
                        </p>
                      ) : null}
                      <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                        <button
                          className="button"
                          type="button"
                          onClick={() => void checkAnswer()}
                          disabled={isEvaluatingAnswer}
                        >
                          {isEvaluatingAnswer ? "Checking..." : "Submit & Continue"}
                        </button>
                        <button
                          className="button secondary"
                          type="button"
                          onClick={listenAnswer}
                          disabled={isListening || isEvaluatingAnswer || micPermission === "denied"}
                        >
                          {isListening ? "Listening..." : "Speak Now"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {check ? (
                    <div className="panel exercise-result">
                      <p style={{ marginTop: 0 }}>
                        Result:{" "}
                        <strong style={{ color: check.correct ? "#065f46" : "#9f1239" }}>
                          {check.correct ? "Correct" : "Try Again"}
                        </strong>
                      </p>
                      <p className="muted">{check.encouragement}</p>
                      {check.coachTip ? <p className="muted">Coach tip: {check.coachTip}</p> : null}
                      <p><strong>Expected:</strong> {check.expectedAnswer}</p>
                      <p style={{ marginBottom: 0 }}><strong>Explanation:</strong> {check.explanation}</p>
                    </div>
                  ) : null}
                </div>

                <AnimatedBoard
                  steps={boardSteps}
                  runId={boardRunId}
                  showPrompt={isTeachingBoard}
                />

                <div className="panel board-toolbar">
                  <div className="speed-control">
                    <label htmlFor="boardSpeed" style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
                      Teaching Speed: {boardSpeed.toFixed(1)}x
                    </label>
                    <input
                      id="boardSpeed"
                      type="range"
                      min={0.7}
                      max={1.5}
                      step={0.1}
                      value={boardSpeed}
                      onChange={(e) => setBoardSpeed(Number(e.target.value))}
                    />
                  </div>
                  <div className="board-actions">
                    <button className="button" type="button" onClick={teachOnBoard} disabled={isTeachingBoard || isSpeaking}>Teach on Whiteboard</button>
                    <button className="button secondary" type="button" onClick={() => void speak(`${question.questionText}. ${question.hint}`)}>Speak Question</button>
                    <button className="button secondary" type="button" onClick={clearBoard}>Clear Board</button>
                  </div>
                </div>
              </div>

              <aside className="panel teacher-rail teacher-rail-sticky">
                <p className="teacher-name" style={{ color: activeAvatar.color }}>
                  {activeAvatar.name} ({activeAvatar.style === "girl" ? "Girl Voice" : "Boy Voice"})
                </p>
                <p className="muted teacher-role">{activeAvatar.role}</p>
                <div className="teacher-avatar-wrap">
                  <AvatarCharacter avatar={activeAvatar} speaking={isSpeaking} />
                </div>
                <div className="teacher-speech" style={{ borderColor: `${activeAvatar.color}55` }}>
                  <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.45 }}>
                    {teacherUtterance || activeTeachingStep?.teacherLine || "Let us begin this step."}
                  </p>
                </div>
                <p className="muted teacher-status">{stageStatusText}</p>

                <div className="panel doubt-panel">
                  <h3 style={{ marginTop: 0, marginBottom: "0.45rem" }}>Ask a Doubt</h3>
                  <textarea
                    value={doubt}
                    onChange={(e) => setDoubt(e.target.value)}
                    rows={3}
                    placeholder="Example: Why do we move 2 from 7 in 8 + 7?"
                  />
                  <div style={{ marginTop: "0.55rem" }}>
                    <button className="button secondary" onClick={askDoubt}>Get Explanation</button>
                  </div>
                  {doubtReply ? (
                    <div className="panel doubt-reply">
                      <pre>{doubtReply}</pre>
                    </div>
                  ) : null}
                </div>

                <div className="panel progress-panel">
                  <h3 style={{ marginTop: 0, marginBottom: "0.45rem" }}>Live Progress</h3>
                  <div className="progress-grid">
                    <div className="progress-card">
                      <span className="muted">Attempts</span>
                      <strong>{score.attempts}</strong>
                    </div>
                    <div className="progress-card">
                      <span className="muted">Correct</span>
                      <strong>{score.correctCount}</strong>
                    </div>
                    <div className="progress-card">
                      <span className="muted">Accuracy</span>
                      <strong>{score.accuracyPct}%</strong>
                    </div>
                    <div className="progress-card">
                      <span className="muted">Exercise</span>
                      <strong>{activeExerciseGroup}</strong>
                    </div>
                  </div>
                  <p className="muted" style={{ marginBottom: 0, marginTop: "0.6rem" }}>Session: {sessionId || "-"}</p>
                </div>

                <div className="panel conversation-log-panel">
                  <div className="conversation-log-header">
                    <h3 style={{ margin: 0 }}>Conversation Log</h3>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={downloadConversationLog}
                      disabled={!conversationLog.length}
                    >
                      Export JSON
                    </button>
                  </div>
                  <div className="conversation-metrics">
                    <span className="pill">Tutor: {conversationInsights.tutorTurns}</span>
                    <span className="pill">Student: {conversationInsights.studentTurns}</span>
                    <span className="pill">Voice: {conversationInsights.voiceStudentTurns}</span>
                    <span className="pill">Doubts: {conversationInsights.doubtTurns}</span>
                    <span className="pill">Avg response: {conversationInsights.avgResponseSec || 0}s</span>
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

                <section className="panel lesson-details-panel lesson-details-in-rail">
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
              </aside>
            </div>
          </section>
        </>
      ) : null}
      <style jsx global>{`
        @keyframes avatarFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        @keyframes avatarTalk {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-2px) scale(1.01);
          }
          50% {
            transform: translateY(-1px) scale(1.015);
          }
          75% {
            transform: translateY(-2px) scale(1.01);
          }
        }
        .teacher-stage-avatar {
          position: relative;
          width: min(100%, 240px);
          aspect-ratio: 3 / 4;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transform-origin: 50% 88%;
          animation: avatarFloat 2.8s ease-in-out infinite;
        }
        .teacher-stage-avatar.speaking {
          animation: avatarTalk 0.75s ease-in-out infinite;
        }
        .teacher-stage-glow {
          position: absolute;
          inset: 12% 8% 10%;
          border-radius: 28px;
          background: radial-gradient(circle at 50% 30%, var(--teacher-accent, #0ea5e9) 0%, rgba(255, 255, 255, 0) 72%);
          filter: blur(14px);
          opacity: 0.18;
          pointer-events: none;
        }
        .teacher-stage-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center bottom;
          filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.22));
          position: relative;
          z-index: 1;
        }
        @keyframes boardDrawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes boardFadeText {
          to {
            opacity: 1;
          }
        }
        @media (max-width: 900px) {
          .classroom-stage-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
