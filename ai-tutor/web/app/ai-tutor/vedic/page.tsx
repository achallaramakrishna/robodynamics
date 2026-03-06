"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  TutorCatalogResponse,
  TutorChapter,
  TutorCheckResponse,
  TutorExerciseGroup,
  TutorNextQuestionResponse,
  TutorQuestion,
  TutorTeachingStep,
  TutorStartResponse
} from "@/lib/types";

type Status = "idle" | "loading" | "ready" | "error";
type Confidence = "low" | "medium" | "high";

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

const COURSE_ID = "vedic_math";
const EX_GROUP_KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

const AVATARS: Avatar[] = [
  { id: "arya", name: "Arya", role: "Calm Mentor", color: "#0ea5e9", style: "girl" },
  { id: "ved", name: "Ved", role: "Fast Coach", color: "#22c55e", style: "boy" },
  { id: "tara", name: "Tara", role: "Friendly Teacher", color: "#f97316", style: "girl" },
  { id: "niva", name: "Niva", role: "Patient Guide", color: "#6366f1", style: "boy" }
];

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
  const dress = avatar.style === "girl" ? "#fcd34d" : "#bae6fd";
  const sleeve = avatar.style === "girl" ? "#f59e0b" : "#0ea5e9";
  const mouthPath = speaking ? "M88 104 Q100 116 112 104" : "M90 104 Q100 110 110 104";
  return (
    <svg
      width={176}
      height={176}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`${avatar.name} animated teacher`}
      style={{ animation: "avatarFloat 2.2s ease-in-out infinite" }}
    >
      <ellipse cx="100" cy="188" rx="56" ry="8" fill="#e2e8f0" />
      <circle cx="100" cy="76" r="44" fill="#fde68a" stroke="#cbd5e1" strokeWidth="2" />
      <path
        d={avatar.style === "girl" ? "M48,78 C50,24 150,24 152,78 L152,56 C149,20 51,20 48,56 Z" : "M52,78 C58,30 142,30 148,78 L148,58 C140,26 60,26 52,58 Z"}
        fill={avatar.color}
      />
      <circle cx="84" cy="78" r="5" fill="#0f172a" />
      <circle cx="116" cy="78" r="5" fill="#0f172a" />
      <path d={mouthPath} fill="none" stroke="#7c2d12" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M64 134 Q100 120 136 134 L146 176 L54 176 Z" fill={dress} stroke="#cbd5e1" strokeWidth="2" />
      <rect x="48" y="142" width="20" height="10" rx="4" fill={sleeve} />
      <rect x="132" y="142" width="20" height="10" rx="4" fill={sleeve} />
    </svg>
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
          <text x="22" y="322" fill="#7c2d12" fontSize={14} style={{ opacity: 0.92 }}>
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

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [courseId, setCourseId] = useState(COURSE_ID);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSource, setLessonSource] = useState("");
  const [lessonEstimatedMinutes, setLessonEstimatedMinutes] = useState(0);
  const [lessonSubtopics, setLessonSubtopics] = useState<string[]>([]);
  const [lessonLearningGoals, setLessonLearningGoals] = useState<string[]>([]);
  const [lessonExerciseCoverage, setLessonExerciseCoverage] = useState<string[]>([]);
  const [lessonExerciseFlow, setLessonExerciseFlow] = useState<Array<{ exerciseGroup: string; subtopic: string }>>([]);
  const [lessonTeachingScript, setLessonTeachingScript] = useState<TutorTeachingStep[]>([]);
  const [coreIdeas, setCoreIdeas] = useState<string[]>([]);

  const [chapters, setChapters] = useState<TutorChapter[]>(DEFAULT_CHAPTERS);
  const [exerciseGroups, setExerciseGroups] = useState<TutorExerciseGroup[]>(DEFAULT_EXERCISE_GROUPS);
  const [selectedChapter, setSelectedChapter] = useState(DEFAULT_CHAPTERS[0].chapterCode);
  const [activeChapter, setActiveChapter] = useState(DEFAULT_CHAPTERS[0].chapterCode);
  const [selectedExerciseGroup, setSelectedExerciseGroup] = useState("A");
  const [activeExerciseGroup, setActiveExerciseGroup] = useState("A");

  const [question, setQuestion] = useState<TutorQuestion | null>(null);
  const [questionShownAt, setQuestionShownAt] = useState(0);
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState<Confidence>("medium");
  const [check, setCheck] = useState<TutorCheckResponse | null>(null);
  const [doubt, setDoubt] = useState("");
  const [doubtReply, setDoubtReply] = useState("");
  const [score, setScore] = useState({ attempts: 0, correctCount: 0, accuracyPct: 0 });

  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATARS[0].id);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTeachingBoard, setIsTeachingBoard] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [awaitingStudentResponse, setAwaitingStudentResponse] = useState(false);
  const [teacherUtterance, setTeacherUtterance] = useState("");
  const [boardSteps, setBoardSteps] = useState<SvgBoardStep[]>([]);
  const [boardRunId, setBoardRunId] = useState(0);
  const [boardSpeed, setBoardSpeed] = useState(1);

  const boardTimerRef = useRef<number | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const speakSeqRef = useRef(0);

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

  const stageStatusText = useMemo(() => {
    if (isTeachingBoard) return "Teaching on whiteboard...";
    if (isSpeaking) return "Speaking live...";
    if (isListening) return "Listening to your answer...";
    if (awaitingStudentResponse) return "Your turn now: answer by voice or text.";
    return "Ready for next step.";
  }, [isTeachingBoard, isSpeaking, isListening, awaitingStudentResponse]);

  function stopVoicePlayback() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    setIsSpeaking(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const response = await fetch(`/api/vedic/catalog?courseId=${encodeURIComponent(COURSE_ID)}`, { cache: "no-store" });
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
      }
      stopVoicePlayback();
    };
  }, []);

  useEffect(() => {
    if (!voiceEnabled) {
      stopVoicePlayback();
    }
  }, [voiceEnabled]);

  async function speak(text: string) {
    const line = (text || "").trim();
    if (!line) {
      setIsSpeaking(false);
      return;
    }
    setTeacherUtterance(line);
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
        audio.onplaying = () => {
          if (speakSeq === speakSeqRef.current) {
            setIsSpeaking(true);
          }
        };
        audio.onended = () => {
          if (speakSeq === speakSeqRef.current) {
            setIsSpeaking(false);
          }
        };
        audio.onerror = () => {
          if (speakSeq === speakSeqRef.current) {
            setIsSpeaking(false);
          }
        };
        await audio.play();
        return;
      }
    } catch {
      // fallback to browser synthesis below
    }

    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(line);
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.onstart = () => {
        if (speakSeq === speakSeqRef.current) {
          setIsSpeaking(true);
        }
      };
      utter.onend = () => {
        if (speakSeq === speakSeqRef.current) {
          setIsSpeaking(false);
        }
      };
      utter.onerror = () => {
        if (speakSeq === speakSeqRef.current) {
          setIsSpeaking(false);
        }
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
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

  function buildBoardSteps(q: TutorQuestion, avatar: Avatar, teachingStep: TutorTeachingStep | null): SvgBoardStep[] {
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

    addText("header", 20, 30, "Classroom Whiteboard Session", avatar.color, 18);
    addLine("header_line", 16, 42, 744, 42, "#cbd5e1", 1);
    if (teachingStep) {
      addText("teacher_line", 20, 64, teachingStep.teacherLine, "#1e293b", 14);
      addText("board_action", 20, 84, `Board plan: ${teachingStep.boardAction}`, "#334155", 13);
    }

    if (teachingStep?.boardMode === "free_draw") {
      addText("fd_intro", 20, 106, "Step 1: I will free-draw the method flow.", "#334155", 14);
      addLine("fd_1", 420, 106, 620, 106, avatar.color, 2);
      addLine("fd_2", 420, 130, 670, 130, avatar.color, 2);
      addLine("fd_3", 420, 154, 600, 154, avatar.color, 2);
      addLine("fd_arrow", 620, 106, 655, 130, "#ef4444", 2);
      addText("fd_note", 430, 178, "Teacher writes and explains each transition.", "#1e293b", 12);
    }

    if (teachingStep?.boardMode !== "free_draw" && (q.subtopic || "").toLowerCase().includes("ten point circle")) {
      addText("tpc_intro", 20, 106, "Step 1: I will draw the ten-point circle first.", "#334155", 14);
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

    addText("question_title", 20, 202, "Step 2: Let's understand the task.", "#334155", 14);
    const boardQuestionLines = splitText(q.questionText, 56).slice(0, 2);
    for (const [idx, line] of boardQuestionLines.entries()) {
      addText(`q_line_${idx}`, 20, 226 + idx * 20, line, "#0f172a", 15);
    }
    addText("subtopic", 20, 286, `Subtopic: ${q.subtopic || q.skill}`, "#334155", 14);
    addText("hint", 20, 306, `Hint: ${q.hint}`, "#334155", 14);
    if (teachingStep) {
      addText("checkpoint", 20, 326, `Checkpoint: ${teachingStep.checkpointPrompt}`, "#7c2d12", 14);
    } else {
      addText("check_u", 20, 326, "Can you tell me your first step?", "#7c2d12", 15);
    }
    return steps;
  }

  function clearBoard() {
    setBoardSteps([]);
    setBoardRunId((v) => v + 1);
    if (boardTimerRef.current) {
      window.clearTimeout(boardTimerRef.current);
      boardTimerRef.current = null;
    }
    setIsTeachingBoard(false);
    setAwaitingStudentResponse(false);
  }

  function teachOnBoard() {
    if (!question) return;

    const steps = buildBoardSteps(question, activeAvatar, activeTeachingStep);
    setBoardSteps(steps);
    setBoardRunId((v) => v + 1);

    if (boardTimerRef.current) {
      window.clearTimeout(boardTimerRef.current);
      boardTimerRef.current = null;
    }

    setIsTeachingBoard(true);
    speak(`${toChatStylePrompt(question)} ${activeTeachingStep?.teacherLine || question.hint}.`);

    const total = steps.reduce((mx, s) => Math.max(mx, s.delaySec + s.durationSec), 0);
    boardTimerRef.current = window.setTimeout(() => {
      setIsTeachingBoard(false);
      boardTimerRef.current = null;
      speak(
        `Nice progress. ${activeTeachingStep?.checkpointPrompt || "What should we do first?"} ${
          activeTeachingStep?.microPractice || ""
        }`
      );
    }, Math.ceil(total * 1000) + 400);
  }

  function listenAnswer() {
    if (typeof window === "undefined") return;
    const w = window as Window & { webkitSpeechRecognition?: any; SpeechRecognition?: any };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition is not available in this browser.");
      return;
    }

    const recog = new SR();
    recog.lang = "en-IN";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      setAnswer(String(transcript).trim());
    };
    recog.onerror = () => {
      setError("Could not capture voice. Please try again.");
    };
    recog.start();
  }

  async function startSession() {
    setStatus("loading");
    setError("");
    setCheck(null);
    setDoubtReply("");

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

      clearBoard();
      speak(`Welcome to ${data.lesson.title}. We will learn it step by step together.`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  }

  async function checkAnswer() {
    if (!sessionId || !question) return;

    setCheck(null);
    setDoubtReply("");
    const responseTimeMs = questionShownAt > 0 ? Math.max(0, Date.now() - questionShownAt) : undefined;

    const response = await fetch("/api/vedic/check-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: question.questionId,
        learnerAnswer: answer,
        responseTimeMs,
        confidence
      })
    });
    const data: TutorCheckResponse & { error?: string } = await response.json();
    if (!response.ok || data.error) {
      setError(data.error || "Unable to evaluate answer.");
      return;
    }

    setCheck(data);
    if (data.summary) {
      setScore(data.summary);
    }
    if (data.coachTip) {
      speak(data.coachTip);
    } else if (data.correct) {
      speak("Great work. Tell me how you got that answer, then we will go to the next one.");
    } else {
      speak(`Good attempt. ${activeTeachingStep?.checkpointPrompt || "Let us retry this with one smaller step."}`);
    }
  }

  async function nextQuestion() {
    if (!sessionId) return;

    setAnswer("");
    setCheck(null);
    setDoubtReply("");

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
      setError(data.error || "Unable to load next question.");
      return;
    }

    setQuestion(data.question);
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
      setCoreIdeas(data.lesson.coreIdeas || []);
    }

    clearBoard();
  }

  async function askDoubt() {
    if (!sessionId || !doubt.trim()) return;

    const response = await fetch("/api/vedic/doubt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, courseId, message: doubt.trim() })
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      setError(data.error || "Unable to fetch doubt explanation.");
      return;
    }
    setDoubtReply(String(data.reply || ""));
    speak(String(data.reply || ""));
  }

  return (
    <main className="container">
      <section className="panel" style={{ marginBottom: "0.9rem" }}>
        <h1 style={{ marginTop: 0 }}>Vedic Math AI Tutor</h1>
        <p className="muted" style={{ marginTop: 4 }}>
          Classroom mode: choose avatar, learn on whiteboard, and practice chapter exercises A-I.
        </p>

        <h3 style={{ marginTop: 0, marginBottom: "0.45rem" }}>Choose AI Avatar</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.6rem", marginBottom: "0.8rem" }}>
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => setSelectedAvatarId(avatar.id)}
              className="button secondary"
              style={{
                textAlign: "left",
                borderColor: selectedAvatarId === avatar.id ? avatar.color : "#cbd5e1",
                background: selectedAvatarId === avatar.id ? "#f8fafc" : "#fff"
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

        <div className="row" style={{ marginTop: "0.7rem" }}>
          <div className="col">
            <span className="pill">Session token: {canStart ? "detected" : "missing/invalid"}</span>
            <span className="pill" style={{ marginLeft: "0.4rem" }}>Course: {courseId}</span>

            <div style={{ marginTop: "0.65rem", maxWidth: "460px" }}>
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

            <div style={{ marginTop: "0.65rem", maxWidth: "460px" }}>
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

            <div style={{ marginTop: "0.65rem", maxWidth: "220px" }}>
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

            <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button className="button" onClick={startSession} disabled={!canStart || status === "loading"}>
                {status === "loading" ? "Starting..." : sessionId ? "Restart with Chapter" : "Start Tutor Session"}
              </button>
              <button className="button secondary" type="button" onClick={() => setVoiceEnabled((v) => !v)}>
                Voice: {voiceEnabled ? "On" : "Off"}
              </button>
            </div>
          </div>

          <div className="col panel" style={{ background: "#f8fafc" }}>
            <h3 style={{ marginTop: 0, marginBottom: "0.45rem" }}>What You Will Learn</h3>
            <p style={{ marginTop: 0, marginBottom: "0.4rem" }}><strong>{previewChapter?.title || "Selected Chapter"}</strong></p>
            <p className="muted" style={{ marginTop: 0 }}>
              Estimated time: {previewChapter?.estimatedMinutes || 20} mins | Exercises: {(previewChapter?.exerciseGroups || ["A", "B", "C"]).join(", ")}
            </p>

            <p style={{ marginBottom: "0.35rem" }}><strong>Subtopics</strong></p>
            <ul style={{ marginTop: 0 }}>
              {(previewChapter?.subtopics || []).map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>

            <p style={{ marginBottom: "0.35rem" }}><strong>Exercise Flow (A-I)</strong></p>
            <ul style={{ marginTop: 0, marginBottom: 0 }}>
              {(previewChapter?.exerciseFlow || []).map((item) => (
                <li key={`${item.exerciseGroup}_${item.subtopic}`}>Exercise {item.exerciseGroup}: {item.subtopic}</li>
              ))}
            </ul>
          </div>
        </div>

        {error ? <p style={{ color: "#9f1239" }}>{error}</p> : null}
      </section>

      {status === "ready" && question ? (
        <div className="row">
          <section className="col panel" style={{ order: 2, flexBasis: "100%" }}>
            <h2 style={{ marginTop: 0 }}>{lessonTitle || "Chapter"}</h2>
            <p className="muted">{lessonSource}</p>
            <p className="muted">Active chapter: {activeChapter} | Active exercise: {activeExerciseGroup} | Subtopic: {question.subtopic || "Practice"}</p>
            <p className="muted">Estimated chapter time: {lessonEstimatedMinutes || previewChapter?.estimatedMinutes || 20} minutes</p>

            <h3>Core Ideas</h3>
            <ul>
              {coreIdeas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>

            <h3>Subtopics</h3>
            <ul>
              {(lessonSubtopics.length ? lessonSubtopics : previewChapter?.subtopics || []).map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>

            <p><strong>Exercise Coverage:</strong> {(lessonExerciseCoverage.length ? lessonExerciseCoverage : previewChapter?.exerciseGroups || []).join(", ")}</p>
            <p><strong>Current Flow:</strong> {(lessonExerciseFlow.length ? lessonExerciseFlow : previewChapter?.exerciseFlow || []).map((f) => ` ${f.exerciseGroup}->${f.subtopic}`).join(" | ")}</p>

            <h3>Teacher Script (A-I)</h3>
            <ul>
              {visibleTeachingScript.map((step) => (
                <li key={step.stepId} style={{ marginBottom: "0.45rem" }}>
                  <strong>{step.exerciseGroup} - {step.subtopic} ({step.boardMode === "free_draw" ? "Free Draw" : "SVG"}):</strong> {step.teacherLine}
                  <br />
                  <span className="muted">Checkpoint: {step.checkpointPrompt}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="col panel" style={{ order: 1, flexBasis: "100%" }}>
            <h2 style={{ marginTop: 0 }}>AI Classroom Board</h2>
            <div
              className="stage-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(180px, 220px) minmax(0, 1fr)",
                gap: "0.8rem",
                alignItems: "start"
              }}
            >
              <div className="panel" style={{ background: "#f8fafc", minHeight: "360px" }}>
                <p style={{ marginTop: 0, marginBottom: "0.35rem", fontWeight: 700, color: activeAvatar.color }}>
                  {activeAvatar.name} ({activeAvatar.style === "girl" ? "Girl Voice" : "Boy Voice"})
                </p>
                <p className="muted" style={{ marginTop: 0, marginBottom: "0.45rem" }}>{activeAvatar.role}</p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.45rem" }}>
                  <AvatarCharacter avatar={activeAvatar} speaking={isSpeaking} />
                </div>
                <div
                  style={{
                    border: `1px solid ${activeAvatar.color}33`,
                    borderRadius: "10px",
                    background: "#fff",
                    padding: "0.5rem 0.6rem"
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.4 }}>
                    {teacherUtterance || activeTeachingStep?.teacherLine || "Let us begin this step."}
                  </p>
                </div>
                <p className="muted" style={{ marginTop: "0.45rem", marginBottom: 0 }}>
                  {isSpeaking ? "Speaking live..." : "Listening for your response..."}
                </p>
              </div>

              <div>
                {activeTeachingStep ? (
                  <div className="panel" style={{ marginBottom: "0.6rem", background: "#f8fafc" }}>
                    <p style={{ marginTop: 0, marginBottom: "0.35rem" }}>
                      <strong>Now Teaching:</strong> Exercise {activeTeachingStep.exerciseGroup} - {activeTeachingStep.subtopic}
                    </p>
                    <p className="muted" style={{ marginTop: 0, marginBottom: "0.25rem" }}>{activeTeachingStep.teacherLine}</p>
                    <p className="muted" style={{ marginTop: 0, marginBottom: "0.2rem" }}>Board: {activeTeachingStep.boardAction}</p>
                    <p className="muted" style={{ marginTop: 0, marginBottom: 0 }}>
                      Mode: {activeTeachingStep.boardMode === "free_draw" ? "Free Draw" : "SVG Diagram"}
                    </p>
                  </div>
                ) : null}
                <AnimatedBoard
                  steps={boardSteps}
                  runId={boardRunId}
                  showPrompt={isTeachingBoard}
                />
                <div style={{ marginTop: "0.55rem", maxWidth: "240px" }}>
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
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button className="button" type="button" onClick={teachOnBoard} disabled={isTeachingBoard}>Teach on Whiteboard</button>
                  <button className="button secondary" type="button" onClick={clearBoard}>Clear Board</button>
                  <button className="button secondary" type="button" onClick={() => speak(`${question.questionText}. ${question.hint}`)}>Speak Question</button>
                </div>

                <div className="panel" style={{ marginTop: "0.75rem", background: "#fbfefc" }}>
                  <p className="muted" style={{ marginTop: 0 }}>
                    Skill: {question.skill} | Difficulty: {question.difficulty} | Exercise: {question.exerciseGroup}
                  </p>
                  <p style={{ marginTop: 0 }}><strong>{question.questionText}</strong></p>
                  {question.visual?.svg ? (
                    <div className="panel" style={{ marginBottom: "0.6rem", background: "#f8fafc" }}>
                      <p className="muted" style={{ marginTop: 0 }}>{question.visual.title}</p>
                      <div dangerouslySetInnerHTML={{ __html: question.visual.svg }} />
                    </div>
                  ) : null}
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type answer here"
                  />
                  <div style={{ marginTop: "0.7rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button className="button" onClick={checkAnswer}>Check Answer</button>
                    <button className="button secondary" type="button" onClick={listenAnswer}>Speak Answer</button>
                    <button className="button secondary" onClick={nextQuestion}>Next Question</button>
                  </div>
                  <p className="muted" style={{ marginTop: "0.6rem", marginBottom: 0 }}>Hint: {question.hint}</p>
                  {check ? (
                    <div className="panel" style={{ marginTop: "0.7rem", background: "#fff" }}>
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
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {status === "ready" && question ? (
        <div className="row" style={{ marginTop: "0.8rem" }}>
          <section className="col panel">
            <h3 style={{ marginTop: 0 }}>Ask a Doubt</h3>
            <textarea
              value={doubt}
              onChange={(e) => setDoubt(e.target.value)}
              rows={3}
              placeholder="Example: Why do we move 2 from 7 in 8 + 7?"
            />
            <div style={{ marginTop: "0.65rem" }}>
              <button className="button secondary" onClick={askDoubt}>Get Explanation</button>
            </div>
            {doubtReply ? (
              <div className="panel" style={{ marginTop: "0.7rem", background: "#f8fcfa" }}>
                <pre>{doubtReply}</pre>
              </div>
            ) : null}

            <h3 style={{ marginTop: "1rem" }}>Live Progress</h3>
            <p><strong>Attempts:</strong> {score.attempts}</p>
            <p><strong>Correct:</strong> {score.correctCount}</p>
            <p><strong>Accuracy:</strong> {score.accuracyPct}%</p>
            <p><strong>Exercise:</strong> {activeExerciseGroup}</p>
            <p className="muted">Session: {sessionId || "-"}</p>
          </section>
        </div>
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
          .stage-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
