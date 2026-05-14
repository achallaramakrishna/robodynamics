"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MindSutraLessonPayload } from "@/lib/mindsutraLessonTypes";
import MindSutraAvatar, { type AvatarMood, type AvatarGesture } from "./MindSutraAvatar";
import { MindSutraBrandHeader, MindSutraAchievementPop } from "@/components/mindsutra/BrandChrome";

const BOARD_ANIMATIONS = `
@keyframes ms-board-enter {
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
@keyframes ms-headline-pop {
  0%   { opacity: 0; transform: scale(0.6) rotate(-3deg); }
  70%  { transform: scale(1.07) rotate(1deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes ms-expr-stamp {
  0%   { opacity: 0; transform: scale(1.5) rotate(-6deg); }
  60%  { transform: scale(0.93) rotate(1deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes ms-step-slide {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes ms-img-reveal {
  0%   { opacity: 0; transform: scale(0.82); filter: blur(6px); }
  80%  { transform: scale(1.03); filter: blur(0); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes ms-img-breathe {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.025); }
}
@keyframes ms-correct-burst {
  0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); background: #DCFCE7; }
  50%  { box-shadow: 0 0 0 18px rgba(34,197,94,0); }
  100% { box-shadow: 0 0 0 0   rgba(34,197,94,0); background: #F0FDF4; }
}
@keyframes ms-wrong-shake {
  0%,100% { transform: translateX(0); }
  18%     { transform: translateX(-8px); }
  36%     { transform: translateX(7px); }
  54%     { transform: translateX(-5px); }
  72%     { transform: translateX(4px); }
}
@keyframes ms-feedback-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ms-prompt-fade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ms-glow-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(79,70,229,0.25); }
  50%     { box-shadow: 0 0 0 8px rgba(79,70,229,0); }
}
`;

const LESSON_ASSET_VERSION = "20260514-svg-refresh";

function BoardPanel({
  step,
  boardKey,
  compact,
}: {
  step: MindSutraLessonPayload["steps"][number];
  boardKey: number;
  compact: boolean;
}) {
  const rawAssetPath = typeof step.board.data.assetPath === "string" ? step.board.data.assetPath : null;
  const assetPath = rawAssetPath
    ? `${rawAssetPath}${rawAssetPath.includes("?") ? "&" : "?"}v=${LESSON_ASSET_VERSION}`
    : null;
  const expression = typeof step.board.data.expression === "string" ? step.board.data.expression : null;
  const prompt = typeof step.board.data.prompt === "string" ? step.board.data.prompt : null;
  const headline = typeof step.board.data.headline === "string" ? step.board.data.headline : null;
  const steps = Array.isArray(step.board.data.steps) ? (step.board.data.steps as string[]) : [];

  // Reveal steps one-by-one after board enters
  const [visibleSteps, setVisibleSteps] = useState(0);
  useEffect(() => {
    setVisibleSteps(0);
    if (!steps.length) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisibleSteps(i);
      if (i >= steps.length) clearInterval(interval);
    }, 420);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardKey]);

  return (
    <div
      key={boardKey}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        padding: compact ? 16 : 24,
        minHeight: compact ? 260 : 360,
        animation: "ms-board-enter 0.42s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 10 }}>{step.label}</div>

      {headline ? (
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: compact ? 22 : 28,
            animation: "ms-headline-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
          }}
        >
          {headline}
        </h2>
      ) : null}

      {expression ? (
        <div
          style={{
            fontSize: compact ? 24 : 32,
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: 14,
            letterSpacing: 2,
            animation: "ms-expr-stamp 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both",
          }}
        >
          {expression}
        </div>
      ) : null}

      {prompt ? (
        <div
          style={{
            color: "#334155",
            marginBottom: 14,
            lineHeight: 1.65,
            animation: "ms-prompt-fade 0.4s ease 0.25s both",
          }}
        >
          {prompt}
        </div>
      ) : null}

      {assetPath ? (
        <div
          style={{
            background: "linear-gradient(145deg,#F8FAFC,#EEF2FF)",
            border: "1px solid #C7D2FE",
            borderRadius: 16,
            padding: compact ? 12 : 20,
            display: "grid",
            placeItems: "center",
            marginBottom: 14,
            overflow: "hidden",
          }}
        >
          <img
            src={assetPath}
            alt={step.label}
            style={{
              maxWidth: "100%",
              maxHeight: compact ? 180 : 240,
              objectFit: "contain",
              animation: `ms-img-reveal 0.65s ease 0.2s both, ms-img-breathe 4s ease-in-out 1.5s infinite`,
              transformOrigin: "center center",
            }}
          />
        </div>
      ) : null}

      {steps.length ? (
        <div style={{ display: "grid", gap: 10 }}>
          {steps.map((item, index) => (
            <div
              key={item}
              style={{
                background: "#F8FAFC",
                borderRadius: 12,
                padding: "12px 14px",
                border: "1px solid #E2E8F0",
                opacity: index < visibleSteps ? 1 : 0,
                animation: index < visibleSteps
                  ? `ms-step-slide 0.35s ease both`
                  : "none",
                transition: "opacity 0.2s",
              }}
            >
              <strong style={{ color: "#4F46E5" }}>Step {index + 1}:</strong>{" "}
              <span>{item}</span>
            </div>
          ))}
        </div>
      ) : null}

      {!assetPath && !steps.length && !headline && !expression && !prompt ? (
        <div style={{ color: "#64748B" }}>Board data available for this step.</div>
      ) : null}
    </div>
  );
}

export default function MindSutraLessonClient({ payload }: { payload: MindSutraLessonPayload }) {
  const [stepIndex, setStepIndex] = useState(payload.progress.currentStepIndex);
  const [boardKey, setBoardKey] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackKind, setFeedbackKind] = useState<"correct" | "wrong" | "info">("info");
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicePrimed, setVoicePrimed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const [showWorkedSteps, setShowWorkedSteps] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lessonCompletionSaved, setLessonCompletionSaved] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechKeyRef = useRef(0);
  const lessonCompletionRef = useRef(false);

  // ── Quiz State ───────────────────────────────────────────────────────────
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<number, { kind: "correct" | "wrong"; message: string }>>({});
  const [practiceTrack, setPracticeTrack] = useState<"base" | "remediation" | "challenge">("base");
  const [adaptiveStatus, setAdaptiveStatus] = useState<string | null>(null);
  const [clarityCheckOpen, setClarityCheckOpen] = useState(false);
  const [lastBaseAttempts, setLastBaseAttempts] = useState<number | null>(null);
  const [learnerInsight, setLearnerInsight] = useState<{
    studentName: string;
    supportMode: "guided" | "balanced" | "challenge";
    coachLine: string;
    strongestSkills: string[];
    weakSkills: string[];
    recommendedNextFocus: string;
    conceptClarityScore: number;
    transferScore: number;
    avgConfidence: number;
    xp: number;
    streak: number;
    achievements: { icon: string; label: string }[];
  }>({
    studentName: "Student",
    supportMode: "balanced",
    coachLine: "I am learning how this student works best. A few attempts will help me personalize the coaching.",
    strongestSkills: [],
    weakSkills: [],
    recommendedNextFocus: "Current lesson pattern",
    conceptClarityScore: 0,
    transferScore: 0,
    avgConfidence: 0,
    xp: 0,
    streak: 0,
    achievements: [],
  });

  const currentStep = payload.steps[stepIndex] ?? payload.steps[0];
  const isLast = stepIndex === payload.steps.length - 1;
  const activeQuizQuestion = currentStep.practice?.mode === "quiz"
    ? currentStep.practice.questions?.[quizIdx]
    : undefined;
  const activePracticeVariant = practiceTrack === "remediation"
    ? currentStep.practice?.remediation
    : practiceTrack === "challenge"
      ? currentStep.practice?.challenge
      : undefined;
  const activePracticePrompt = activePracticeVariant?.prompt ?? currentStep.practice?.prompt;
  const activeHints = activeQuizQuestion?.hints ?? activePracticeVariant?.hints ?? currentStep.practice?.hints;
  const activeSkillKeys = activeQuizQuestion?.skillKeys ?? activePracticeVariant?.skillKeys ?? currentStep.practice?.skillKeys;
  const practiceAnswer = activePracticeVariant?.answer ?? currentStep.practice?.answer;
  const numericAnswer = typeof practiceAnswer === "number" ? String(practiceAnswer) : practiceAnswer ?? "";

  const stepProgress = useMemo(() => `${stepIndex + 1}/${payload.steps.length}`, [stepIndex, payload.steps.length]);
  const isTabletOrSmaller = viewportWidth < 1100;

  async function refreshLearnerInsight() {
    try {
      const response = await fetch(`/api/mindsutra/progress?lessonId=${encodeURIComponent(payload.lesson.id)}`);
      if (!response.ok) return;
      const data = await response.json();
      setLearnerInsight({
        studentName: data.studentName ?? "Student",
        supportMode: data.supportMode ?? "balanced",
        coachLine: data.coachLine ?? "I am tracking what kind of support helps most.",
        strongestSkills: Array.isArray(data.strongestSkills) ? data.strongestSkills : [],
        weakSkills: Array.isArray(data.weakSkills) ? data.weakSkills : [],
        recommendedNextFocus: data.recommendedNextFocus ?? "Current lesson pattern",
        conceptClarityScore: Number(data.conceptClarityScore ?? 0),
        transferScore: Number(data.transferScore ?? 0),
        avgConfidence: Number(data.avgConfidence ?? 0),
        xp: Number(data.xp ?? 0),
        streak: Number(data.streak ?? 0),
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
      });
    } catch {
      // Ignore personalization fetch issues and keep lesson flow usable.
    }
  }

  async function pushLearnerEvent(
    eventType: "attempt" | "hint" | "lesson_complete" | "concept_check" | "transfer_check",
    isCorrect?: boolean,
    skillKeys?: string[],
    confidenceScore?: number,
    xpDelta?: number,
  ) {
    try {
      const response = await fetch("/api/mindsutra/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: payload.lesson.id,
          lessonTitle: payload.lesson.title,
          eventType,
          isCorrect,
          skillKeys,
          confidenceScore,
          xpDelta,
        }),
      });
      if (!response.ok) return;
      const data = await response.json();
      setLearnerInsight({
        studentName: data.studentName ?? learnerInsight.studentName,
        supportMode: data.supportMode ?? "balanced",
        coachLine: data.coachLine ?? learnerInsight.coachLine,
        strongestSkills: Array.isArray(data.strongestSkills) ? data.strongestSkills : [],
        weakSkills: Array.isArray(data.weakSkills) ? data.weakSkills : [],
        recommendedNextFocus: data.recommendedNextFocus ?? "Current lesson pattern",
        conceptClarityScore: Number(data.conceptClarityScore ?? learnerInsight.conceptClarityScore ?? 0),
        transferScore: Number(data.transferScore ?? learnerInsight.transferScore ?? 0),
        avgConfidence: Number(data.avgConfidence ?? learnerInsight.avgConfidence ?? 0),
        xp: Number(data.xp ?? learnerInsight.xp ?? 0),
        streak: Number(data.streak ?? learnerInsight.streak ?? 0),
        achievements: Array.isArray(data.achievements) ? data.achievements : learnerInsight.achievements,
      });
    } catch {
      // Ignore personalization write issues and keep lesson flow usable.
    }
  }

  function markLessonComplete() {
    if (lessonCompletionRef.current || lessonCompletionSaved) return;
    lessonCompletionRef.current = true;
    setLessonCompletionSaved(true);
    void pushLearnerEvent("lesson_complete", true, undefined, undefined, payload.lesson.xpReward);
  }

  // Derive avatar mood and gesture from step + feedback
  const avatarMood = useMemo((): AvatarMood => {
    if (feedback?.startsWith("Correct")) return "celebrating";
    if (feedback?.startsWith("Not quite")) return "concerned";
    if (isSpeaking) return "encouraging";
    const id = currentStep.id;
    if (id === "intro") return "happy";
    if (id === "concept") return "thinking";
    if (id === "worked_example") return "serious";
    if (id === "guided_practice" || id === "practice") return "neutral";
    if (id === "challenge") return "serious";
    if (id === "recap") return "happy";
    return "neutral";
  }, [feedback, isSpeaking, currentStep.id]);

  const avatarGesture = useMemo((): AvatarGesture => {
    const id = currentStep.id;
    if (id === "intro") return "greet";
    if (id === "concept") return "explain";
    if (id === "worked_example") return "write";
    if (id === "guided_practice" || id === "practice") return "question";
    if (id === "challenge") return "point";
    if (id === "recap") return "celebrate";
    return "idle";
  }, [currentStep.id]);

  useEffect(() => {
    lessonCompletionRef.current = false;
    setLessonCompletionSaved(false);
  }, [payload.lesson.id]);
  const isPhone = viewportWidth < 720;

  function primeVoicePlayback() {
    setVoicePrimed(true);
  }

  function stopSpeaking() {
    speechKeyRef.current += 1;
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.src = "";
      activeAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }

  function speakWithBrowser(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceStatus("Browser voice is not available here.");
      return;
    }
    window.speechSynthesis.cancel();

    const speak = () => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-IN";
      utter.rate = 1.1; 
      utter.pitch = 1.1;

      const voices = window.speechSynthesis.getVoices();
      const pick =
        voices.find((v) => /google.*en.*in/i.test(v.name)) ||
        voices.find((v) => /microsoft.*neerja/i.test(v.name)) ||
        voices.find((v) => /microsoft.*heera/i.test(v.name)) ||
        voices.find((v) => /microsoft.*ravi/i.test(v.name)) ||
        voices.find((v) => /microsoft.*prabhat/i.test(v.name)) ||
        voices.find((v) => /vani|neerja|heera|priya|veena|lekha/i.test(v.name)) ||
        voices.find((v) => v.lang === "en-IN") ||
        voices.find((v) => /female|samantha|zira|karen|victoria|aria|eva/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith("en"));
      if (pick) utter.voice = pick;

      utter.onstart = () => {
        setIsSpeaking(true);
        setVoiceStatus("Playing tutor voice (Google/Edge)...");
      };
      utter.onend = () => {
        setIsSpeaking(false);
        setVoiceStatus("Tutor voice ready.");
      };
      utter.onerror = () => {
        setIsSpeaking(false);
        setVoiceStatus("Tutor voice could not play.");
      };
      window.speechSynthesis.speak(utter);
    };

    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speak();
      };
      // Fallback if onvoiceschanged doesn't fire
      setTimeout(speak, 250);
    }
  }

  async function speakText(text: string) {
    const clean = text.trim();
    if (!clean) return;
    stopSpeaking();
    const myKey = speechKeyRef.current;

    if (!voiceEnabled) {
      setVoiceStatus("Voice is muted.");
      return;
    }

    try {
      setVoiceStatus("Preparing tutor voice...");
      const response = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, avatarId: "priya", pace: 0.98 }),
      });
      const data = await response.json().catch(() => null);
      if (myKey !== speechKeyRef.current) return;

      if (response.ok && data?.audioBase64) {
        const mimeType = String(data?.mimeType || "audio/wav");
        const audio = new Audio(`data:${mimeType};base64,${data.audioBase64}`);
        activeAudioRef.current = audio;
        audio.onplaying = () => {
          if (myKey === speechKeyRef.current) {
            setIsSpeaking(true);
            setVoiceStatus("Playing tutor voice...");
          }
        };
        audio.onended = () => {
          if (myKey === speechKeyRef.current) {
            setIsSpeaking(false);
            setVoiceStatus("Tutor voice ready.");
          }
        };
        audio.onerror = () => {
          if (myKey === speechKeyRef.current) {
            setIsSpeaking(false);
            setVoiceStatus("Tutor voice fell back to browser speech.");
            speakWithBrowser(clean);
          }
        };
        try {
          await audio.play();
        } catch (playErr) {
          if (myKey === speechKeyRef.current) {
            const errName = playErr instanceof DOMException ? playErr.name : "";
            if (errName === "NotAllowedError") {
              setVoiceStatus("Tap Listen once to enable tutor voice on this browser.");
            } else {
              setVoiceStatus("Tutor voice could not autoplay. Using browser speech.");
            }
            speakWithBrowser(clean);
          }
        }
        return;
      }

      speakWithBrowser(clean);
    } catch {
      if (myKey === speechKeyRef.current) {
        speakWithBrowser(clean);
      }
    }
  }

  useEffect(() => {
    void refreshLearnerInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.lesson.id]);

  useEffect(() => {
    setAnswer("");
    setFeedback(null);
    setFeedbackKind("info");
    setShowWorkedSteps(false);
    setAttemptCount(0);
    setQuizIdx(0);
    setQuizComplete(false);
    setQuizScore(0);
    setQuizAnswers({});
    setQuizFeedback({});
    setPracticeTrack("base");
    setAdaptiveStatus(null);
    setClarityCheckOpen(false);
    setLastBaseAttempts(null);
    setBoardKey((k) => k + 1);
    if (voiceEnabled) {
      void speakText(currentStep.tutorText);
    } else {
      stopSpeaking();
    }
    return () => {
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, voiceEnabled]);

  useEffect(() => {
    if (!voiceEnabled) {
      stopSpeaking();
      setVoiceStatus("Voice is muted.");
    } else {
      setVoiceStatus("Tutor voice ready.");
    }
    return () => {
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled]);

  useEffect(() => {
    if (!voiceEnabled || voicePrimed || typeof window === "undefined") return undefined;

    const unlockAndSpeak = () => {
      setVoicePrimed(true);
      void speakText(currentStep.tutorText);
    };

    window.addEventListener("pointerdown", unlockAndSpeak, { once: true });
    window.addEventListener("keydown", unlockAndSpeak, { once: true });
    window.addEventListener("touchstart", unlockAndSpeak, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAndSpeak);
      window.removeEventListener("keydown", unlockAndSpeak);
      window.removeEventListener("touchstart", unlockAndSpeak);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled, voicePrimed, currentStep.tutorText]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  // ── Keyboard Navigation ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleKeys = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (document.activeElement?.tagName === "INPUT") return;
      
      if (e.key === "ArrowLeft") {
        moveToStep(stepIndex - 1);
      } else if (e.key === "ArrowRight") {
        if (!isLast) moveToStep(stepIndex + 1);
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [stepIndex, isLast]);

  // ── Adaptive tutor responses based on attempt count ──────────────────────
  function adaptiveTutorLine(isCorrect: boolean, attempts: number): string {
    const supportMode = learnerInsight.supportMode;
    if (isCorrect) {
      if (supportMode === "challenge") {
        if (attempts === 1) return "Excellent — first try, and clean. You are ready for a harder variation.";
        if (attempts === 2) return "Nice recovery. You corrected yourself quickly, which is a strong sign of mastery forming.";
        return "You got there. Let us lock in the exact step that made it click so the next one is faster.";
      }
      if (supportMode === "guided") {
        if (attempts === 1) return "Beautiful. You did not rush, and the method held together well.";
        if (attempts === 2) return "Well done. That correction matters — you are building the pattern properly.";
        return "That was good persistence. We will keep the next one structured so this becomes comfortable.";
      }
      if (attempts === 1) return "Perfect — first try! You have a strong feel for this pattern.";
      if (attempts === 2) return "Well done! Two attempts — you self-corrected. That is real learning.";
      return "Good persistence — you got there. Remember the step that unlocked it for next time.";
    }
    if (supportMode === "challenge") {
      if (attempts === 1) return "Close, but there is a precision slip. Check the key step once before you try again.";
      if (attempts === 2) return "The method is probably fine — the error is likely in execution. Use one hint, then tighten it.";
      if (attempts === 3) return `Let me slow this one down. The hidden gap may be in ${learnerInsight.recommendedNextFocus.toLowerCase()}.`;
    }
    if (supportMode === "guided") {
      if (attempts === 1) return "Not quite yet. Let us take just the first step and make that feel easy.";
      if (attempts === 2) return "Still off, and that is okay. Use a hint — I want understanding, not guessing.";
      if (attempts === 3) return "Let me walk beside you here. Open the steps and solve it one small move at a time.";
    }
    if (attempts === 1) return "Not quite. Read the prompt carefully — the first hint will point you to the right step.";
    if (attempts === 2) return "Still off. Use a hint — there is no penalty. Understanding matters more than guessing.";
    if (attempts === 3) return "Let me walk you through it. Tap 'See steps' — we will solve it together step by step.";
    return "Take your time. The answer is in the steps above. Work through them one at a time.";
  }

  function showFeedback(line: string, kind: "correct" | "wrong" | "info") {
    setFeedback(line);
    setFeedbackKind(kind);
    setFeedbackKey((k) => k + 1);
  }

  function openClarityCheck(attemptsUsed: number) {
    setLastBaseAttempts(attemptsUsed);
    setClarityCheckOpen(true);
    setAdaptiveStatus("Quick clarity check: tell me how this felt so I can decide whether to reteach, practice again, or stretch you.");
    const promptLabel = currentStep.practice?.prompt
      ?.replace(/^Solve:\s*/i, "")
      ?.replace(/[?]\s*$/, "")
      ?.trim();
    const answerLabel = String(numericAnswer).trim();
    const successLine = promptLabel && answerLabel
      ? `Correct! ${promptLabel} = ${answerLabel}.`
      : "Correct! That answer is right.";
    showFeedback(`${successLine}\n\nBefore we move on, tell me how clear this method feels right now.`, "correct");
    if (voiceEnabled) void speakText(successLine);
  }

  function handleClarityChoice(choice: "need_help" | "almost_there" | "clear") {
    const confidenceScore = choice === "clear" ? 3 : choice === "almost_there" ? 2 : 1;
    const conceptClear = choice === "clear";
    setClarityCheckOpen(false);
    void pushLearnerEvent("concept_check", conceptClear, activeSkillKeys, confidenceScore);

    if (choice === "need_help") {
      const reteach = currentStep.explanation?.alternateExplanation ?? currentStep.explanation?.body ?? currentStep.tutorText;
      if (currentStep.practice?.remediation) {
        setPracticeTrack("remediation");
        setAdaptiveStatus("Reteach mode: we are shrinking the skill to the first weak move before retrying the full problem.");
        setAnswer("");
        setAttemptCount(0);
        showFeedback(`Let me reteach this with a smaller step.\n\n${reteach}\n\nCheckpoint: ${currentStep.practice.remediation.prompt}`, "info");
        if (voiceEnabled) void speakText(`Let me reteach this with a smaller step. ${currentStep.practice.remediation.prompt}`);
        return;
      }
      setAdaptiveStatus("Reteach mode: I am slowing down and using another explanation before you continue.");
      showFeedback(reteach, "info");
      if (voiceEnabled) void speakText(reteach);
      return;
    }

    if (choice === "almost_there") {
      const reteach = currentStep.explanation?.alternateExplanation ?? currentStep.explanation?.body ?? currentStep.tutorText;
      if (currentStep.practice?.challenge) {
        setPracticeTrack("challenge");
        setAdaptiveStatus("Transfer check unlocked: try one closely related problem to prove the method feels steady.");
        setAnswer("");
        setAttemptCount(0);
        showFeedback(`${reteach}\n\nNow try the transfer check: ${currentStep.practice.challenge.prompt}`, "info");
        if (voiceEnabled) void speakText(`One more check. ${currentStep.practice.challenge.prompt}`);
        return;
      }
      setAdaptiveStatus("Concept nearly clear. I am giving you one more explanation before you move on.");
      showFeedback(reteach, "info");
      if (voiceEnabled) void speakText(reteach);
      return;
    }

    if (currentStep.practice?.challenge) {
      setPracticeTrack("challenge");
      setAdaptiveStatus("Transfer check unlocked: solve one variation to show the idea is really sticking.");
      setAnswer("");
      setAttemptCount(0);
      showFeedback(`Great. Let us test transfer now: ${currentStep.practice.challenge.prompt}`, "correct");
      if (voiceEnabled) void speakText(`Great. Let us test transfer now. ${currentStep.practice.challenge.prompt}`);
      return;
    }

    setAdaptiveStatus("Concept marked clear. You can move ahead or ask for another method if you want to deepen it.");
    const message = lastBaseAttempts === 1
      ? "Excellent. That looked clear and confident."
      : "Nice recovery. The concept looks much steadier now.";
    showFeedback(message, "correct");
    if (voiceEnabled) void speakText(message);
  }

  function handleCheck() {
    if (!currentStep.practice || currentStep.practice.mode === "none") return;

    // ── Quiz Mode Logic ────────────────────────────────────────────────────
    if (currentStep.practice.mode === "quiz" && currentStep.practice.questions) {
      handleQuizQuestionCheck(quizIdx);
      return;
    }

    // ── Standard Mode Logic ────────────────────────────────────────────────
    const normalizedUser = answer.trim();
    const normalizedExpected = String(numericAnswer).trim();
    const isCorrect = normalizedUser !== "" && normalizedUser === normalizedExpected;
    const newCount = attemptCount + 1;
    setAttemptCount(newCount);
    void pushLearnerEvent("attempt", isCorrect, activeSkillKeys);
    const line = adaptiveTutorLine(isCorrect, newCount);

    if (isCorrect && practiceTrack === "remediation") {
      setPracticeTrack("base");
      setAdaptiveStatus("Checkpoint cleared. Return to the main problem with the same method.");
      setAnswer("");
      setAttemptCount(0);
      const remediationLine = "Nice. That weak step is working now. Go back to the main problem and use the same move.";
      showFeedback(remediationLine, "correct");
      if (voiceEnabled) void speakText(remediationLine);
      return;
    }

    if (isCorrect && practiceTrack === "challenge") {
      void pushLearnerEvent("transfer_check", true, activeSkillKeys);
      setPracticeTrack("base");
      setAdaptiveStatus("Bonus stretch solved.");
      setClarityCheckOpen(false);
      setAnswer("");
      setAttemptCount(0);
      const challengeLine = "Strong work. You solved the stretch problem too, so you are ready to move ahead.";
      showFeedback(challengeLine, "correct");
      if (voiceEnabled) void speakText(challengeLine);
      return;
    }

    if (!isCorrect && practiceTrack === "challenge") {
      void pushLearnerEvent("transfer_check", false, activeSkillKeys);
    }

    if (isCorrect && practiceTrack === "base") {
      openClarityCheck(newCount);
      return;
    }

    if (!isCorrect && learnerInsight.supportMode === "guided" && practiceTrack === "base" && newCount >= 2 && currentStep.practice?.remediation) {
      setPracticeTrack("remediation");
      setClarityCheckOpen(false);
      setAdaptiveStatus("Checkpoint mode: rebuild the first weak move before retrying the full problem.");
      setAnswer("");
      setAttemptCount(0);
      const checkpointLine = `${line}\n\nLet us shrink the problem first: ${currentStep.practice.remediation.prompt}`;
      showFeedback(checkpointLine, "info");
      if (voiceEnabled) void speakText(`Let us shrink the problem first. ${currentStep.practice.remediation.prompt}`);
      return;
    }

    setAdaptiveStatus(null);
    setClarityCheckOpen(false);
    showFeedback(line, isCorrect ? "correct" : "wrong");
    if (voiceEnabled) void speakText(line);
    if (!isCorrect && newCount >= 3) {
      const hint = activeHints?.[0];
      if (hint) setTimeout(() => showFeedback(line + "\n\nHint: " + hint, "info"), 600);
    }
  }

  function handleHint() {
    setClarityCheckOpen(false);
    void pushLearnerEvent("hint", undefined, activeSkillKeys);
    const hintIndex = Math.min(attemptCount, Math.max((activeHints?.length ?? 1) - 1, 0));
    const hint = activeHints?.[hintIndex] ?? activeHints?.[0];
    if (hint) {
      showFeedback(hint, "info");
      if (voiceEnabled) void speakText(hint);
    }
  }

  function handleQuizAnswerChange(index: number, value: string) {
    setQuizAnswers((prev) => ({ ...prev, [index]: value }));
  }

  function handleQuizQuestionCheck(index: number) {
    if (!currentStep.practice || currentStep.practice.mode !== "quiz" || !currentStep.practice.questions) return;
    const q = currentStep.practice.questions[index];
    const normalizedUser = (quizAnswers[index] ?? "").trim();
    const normalizedExpected = String(q.answer).trim();
    const isCorrect = normalizedUser !== "" && normalizedUser === normalizedExpected;
    const wasCorrect = quizFeedback[index]?.kind === "correct";

    void pushLearnerEvent("attempt", isCorrect, q.skillKeys);

    if (isCorrect) {
      const successLine = `Correct! ${q.prompt.replace(/\?$/, "")} = ${normalizedExpected}.`;
      setQuizFeedback((prev) => ({
        ...prev,
        [index]: { kind: "correct", message: successLine },
      }));
      if (!wasCorrect) {
        setQuizScore((score) => score + 1);
      }

      const allSolved = currentStep.practice.questions.every((_, questionIndex) => {
        if (questionIndex === index) return true;
        return quizFeedback[questionIndex]?.kind === "correct";
      });

      if (allSolved) {
        setQuizComplete(true);
        markLessonComplete();
        const finalLine = `Quiz Complete! You got ${currentStep.practice.questions.length}/${currentStep.practice.questions.length} correct. Excellent work! Total XP earned: ${payload.lesson.xpReward}.`;
        showFeedback(finalLine, "correct");
        if (voiceEnabled) void speakText(finalLine);
        return;
      }

      const nextOpenIndex = currentStep.practice.questions.findIndex((_, questionIndex) => {
        if (questionIndex === index) return false;
        return quizFeedback[questionIndex]?.kind !== "correct";
      });
      if (nextOpenIndex >= 0) {
        setQuizIdx(nextOpenIndex);
      }
      showFeedback(successLine, "correct");
      return;
    }

    const hints = Array.isArray(q.hints) ? q.hints : [];
    const wrongLine = hints[0]
      ? `Not quite. Hint: ${hints[0]}`
      : "Not quite yet. Try breaking this into a smaller step.";
    setQuizFeedback((prev) => ({
      ...prev,
      [index]: { kind: "wrong", message: wrongLine },
    }));
    setQuizIdx(index);
    showFeedback(wrongLine, "wrong");
  }

  function stepSpecificHelp(actionId: MindSutraLessonPayload["helpActions"][number]["id"]): string {
    if (actionId === "stuck") {
      const tip = activeHints?.[0]
        ?? currentStep.explanation?.mistakeTip
        ?? `Start with the core move in ${learnerInsight.recommendedNextFocus.toLowerCase()}, then simplify the rest.`;
      if (voiceEnabled) void speakText(tip);
      showFeedback(tip, "info");
      return tip;
    }
    if (actionId === "explain_again") {
      const body = currentStep.explanation?.body ?? currentStep.tutorText;
      if (voiceEnabled) void speakText(body);
      showFeedback(body, "info");
      return body;
    }
    const alt = currentStep.explanation?.alternateExplanation
      ?? activeHints?.[1]
      ?? (learnerInsight.supportMode === "guided"
        ? `Alternative method: let us reduce this to a smaller version first, especially around ${learnerInsight.recommendedNextFocus.toLowerCase()}.`
        : currentStep.explanation?.mistakeTip)
      ?? "Alternative method: break the problem into a simpler number plus a small adjustment.";
    if (voiceEnabled) void speakText(alt);
    showFeedback(alt, "info");
    return alt;
  }

  function moveToStep(nextIndex: number) {
    setStepIndex(Math.max(0, Math.min(payload.steps.length - 1, nextIndex)));
    setBoardKey((k) => k + 1);
    setFeedback(null);
    setClarityCheckOpen(false);
  }

  function handleStepAction(actionId: string) {
    if (actionId === "next") {
      moveToStep(stepIndex + 1);
      return;
    }
    if (actionId === "check") {
      handleCheck();
      return;
    }
    if (actionId === "hint") {
      handleHint();
      return;
    }
    if (actionId === "repeat" || actionId === "explain_again") {
      showFeedback(currentStep.explanation?.body ?? currentStep.tutorText, "info");
      if (voiceEnabled) void speakText(currentStep.tutorText);
      return;
    }
    if (actionId === "show_steps") {
      setShowWorkedSteps(true);
      if (activeHints?.length) {
        showFeedback(activeHints.join(" → "), "info");
      }
      return;
    }
    if (actionId === "finish") {
      markLessonComplete();
      showFeedback(`Lesson complete. You earned ${payload.lesson.xpReward} XP for ${payload.lesson.title}.`, "correct");
      return;
    }
    if (actionId === "next_lesson" && payload.nextLessonUrl && typeof window !== "undefined") {
      window.location.href = payload.nextLessonUrl;
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, sans-serif" }}>
      <style>{BOARD_ANIMATIONS}</style>
      <MindSutraBrandHeader 
        title={payload.lesson.title}
        subtitle={`${payload.lesson.sutra} · Step ${stepProgress}`}
        eyebrow={payload.course.title}
        xp={learnerInsight.xp}
        streak={learnerInsight.streak}
        achievements={learnerInsight.achievements}
        progressPct={((stepIndex + 1) / payload.steps.length) * 100}
        compact
      />

      <section style={{ display: "grid", gridTemplateColumns: isTabletOrSmaller ? "1fr" : "320px minmax(0, 1fr)", minHeight: "calc(100vh - 90px)" }}>
        <aside style={{ background: "#FFFFFF", borderRight: isTabletOrSmaller ? "none" : "1px solid #E2E8F0", borderBottom: isTabletOrSmaller ? "1px solid #E2E8F0" : "none", padding: isPhone ? 16 : 20, display: "grid", alignContent: "start", gap: isPhone ? 14 : 18, order: isTabletOrSmaller ? 2 : 0 }}>
          <div style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)", borderRadius: 18, padding: 18, color: "#FFFFFF" }}>
            <div style={{ fontSize: 12, opacity: 0.8, textTransform: "uppercase", letterSpacing: 1.1 }}>MindSutra Coach</div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
              <MindSutraAvatar speaking={isSpeaking} mood={avatarMood} gesture={avatarGesture} />
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  primeVoicePlayback();
                  if (isSpeaking) {
                    stopSpeaking();
                    return;
                  }
                  void speakText(currentStep.tutorText);
                }}
                style={{
                  border: "none",
                  background: "#F8FAFC",
                  color: "#312E81",
                  borderRadius: 10,
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                {isSpeaking ? "Stop audio" : "Listen"}
              </button>
              <button
                onClick={() => setVoiceEnabled((value) => !value)}
                style={{
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "transparent",
                  color: "#F8FAFC",
                  borderRadius: 10,
                  padding: "10px 12px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {voiceEnabled ? "Mute" : "Unmute"}
              </button>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#E0E7FF" }}>{voiceStatus ?? "Tutor voice ready."}</div>
            <div style={{ marginTop: 14, lineHeight: 1.7, fontSize: 14 }}>{currentStep.tutorText}</div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>Lesson Steps</div>
            <div style={{ display: "grid", gap: 10 }}>
              {payload.steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setStepIndex(index);
                    setFeedback(null);
                  }}
                  style={{
                    textAlign: "left",
                    border: index === stepIndex ? "2px solid #4F46E5" : "1px solid #E2E8F0",
                    background: index === stepIndex ? "#EEF2FF" : "#FFFFFF",
                    borderRadius: 12,
                    padding: "10px 12px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748B" }}>Step {index + 1}</div>
                  <div style={{ fontWeight: 700 }}>{step.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>Learner Insight</div>
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                background: learnerInsight.supportMode === "challenge" ? "#ECFDF5" : learnerInsight.supportMode === "guided" ? "#FFF7ED" : "#EEF2FF",
                color: learnerInsight.supportMode === "challenge" ? "#166534" : learnerInsight.supportMode === "guided" ? "#9A3412" : "#3730A3",
                lineHeight: 1.6,
              }}
            >
              {learnerInsight.coachLine}
            </div>
            {learnerInsight.weakSkills.length ? (
              <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>
                <strong>Focus now:</strong> {learnerInsight.weakSkills.join(", ")}
              </div>
            ) : null}
            {learnerInsight.strongestSkills.length ? (
              <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>
                <strong>Going well:</strong> {learnerInsight.strongestSkills.join(", ")}
              </div>
            ) : null}
            <div style={{ marginTop: 10, display: "grid", gap: 6, fontSize: 13, color: "#475569" }}>
              <div><strong>Concept clarity:</strong> {Math.round((learnerInsight.conceptClarityScore || 0) * 100)}%</div>
              <div><strong>Transfer strength:</strong> {Math.round((learnerInsight.transferScore || 0) * 100)}%</div>
              <div><strong>Confidence trend:</strong> {Math.round((learnerInsight.avgConfidence || 0) * 100)}%</div>
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>Help</div>
            <div style={{ display: "grid", gap: 10 }}>
              {payload.helpActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => stepSpecificHelp(action.id)}
                  style={{ border: "1px solid #CBD5E1", background: "#FFFFFF", borderRadius: 12, padding: "10px 12px", textAlign: "left", cursor: "pointer", fontWeight: 600 }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section style={{ padding: isPhone ? 16 : 24, display: "grid", gridTemplateRows: "auto 1fr auto", gap: isPhone ? 16 : 18, order: isTabletOrSmaller ? 1 : 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: isPhone ? "1fr" : "minmax(0, 1fr) auto auto", gap: 14 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: isPhone ? 16 : 20 }}>
              <div style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.1 }}>Objective</div>
            <div style={{ fontSize: isPhone ? 22 : 26, fontWeight: 800, marginTop: 6 }}>{payload.lesson.objective}</div>
            {payload.lesson.supportTag ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 12,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "#EEF2FF",
                  color: "#3730A3",
                  border: "1px solid #C7D2FE",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {payload.lesson.supportTag}
              </div>
            ) : null}
            </div>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: isPhone ? 16 : 20, minWidth: isPhone ? "auto" : 160 }}>
              <div style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.1 }}>Reward</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{payload.lesson.xpReward} XP</div>
            </div>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: isPhone ? 16 : 20, minWidth: isPhone ? "auto" : 160 }}>
              <div style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.1 }}>Difficulty</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>Level {payload.lesson.difficulty}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isTabletOrSmaller ? "1fr" : "minmax(0, 1.35fr) minmax(320px, 0.85fr)", gap: isPhone ? 16 : 18 }}>
            <BoardPanel step={currentStep} boardKey={boardKey} compact={isPhone} />

            <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
              {currentStep.explanation ? (
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: 20 }}>
                  <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>Explanation</div>
                  <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{currentStep.explanation.title}</div>
                  <p style={{ margin: 0, lineHeight: 1.7, color: "#334155" }}>{currentStep.explanation.body}</p>
                  {currentStep.explanation.mistakeTip ? (
                    <div style={{ marginTop: 12, padding: 12, background: "#FEF2F2", borderRadius: 12, color: "#991B1B" }}>
                      <strong>Watch out:</strong> {currentStep.explanation.mistakeTip}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: 20 }}>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>Practice</div>
                {currentStep.practice ? (
                  <>
                    {currentStep.practice.mode === "quiz" && currentStep.practice.questions ? (
                      <div>
                        {quizComplete ? (
                          <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: "#15803D" }}>Lesson Mastered!</div>
                            <div style={{ fontSize: 16, color: "#64748B", marginTop: 8 }}>
                              You've successfully completed the practice exercise.
                            </div>
                            <div style={{ marginTop: 20, fontSize: 32, fontWeight: 900, color: "#4F46E5" }}>
                              +{payload.lesson.xpReward} XP
                            </div>
                            <button
                              onClick={() => handleStepAction("next_lesson")}
                              style={{
                                marginTop: 24,
                                background: "#4F46E5",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: 12,
                                padding: "12px 24px",
                                fontWeight: 800,
                                cursor: "pointer",
                                width: "100%"
                              }}
                            >
                              Go to Next Lesson
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", textTransform: "uppercase" }}>
                                Practice Set: {currentStep.practice.questions.length} questions
                              </span>
                              <span style={{ fontSize: 12, color: "#94A3B8" }}>
                                Score: {quizScore}/{currentStep.practice.questions.length}
                              </span>
                            </div>
                            <div style={{ display: "grid", gap: 12 }}>
                              {currentStep.practice.questions.map((question, index) => {
                                const rowFeedback = quizFeedback[index];
                                const isCorrect = rowFeedback?.kind === "correct";
                                const isActive = quizIdx === index;
                                return (
                                  <div
                                    key={`${question.prompt}-${index}`}
                                    style={{
                                      border: isCorrect ? "1px solid #86EFAC" : isActive ? "1px solid #C7D2FE" : "1px solid #E2E8F0",
                                      background: isCorrect ? "#F0FDF4" : "#F8FAFC",
                                      borderRadius: 16,
                                      padding: 14,
                                    }}
                                  >
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                                      <div style={{ fontWeight: 800, fontSize: 17, color: "#1E293B" }}>
                                        {index + 1}. {question.prompt}
                                      </div>
                                      {isCorrect ? (
                                        <span style={{ fontSize: 12, fontWeight: 800, color: "#15803D" }}>Correct</span>
                                      ) : null}
                                    </div>
                                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                      <input
                                        value={quizAnswers[index] ?? ""}
                                        onChange={(event) => handleQuizAnswerChange(index, event.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleQuizQuestionCheck(index)}
                                        placeholder="Final answer..."
                                        disabled={isCorrect}
                                        style={{
                                          flex: isPhone ? "1 1 100%" : "1 1 180px",
                                          minWidth: isPhone ? 0 : 180,
                                          border: "2px solid #E2E8F0",
                                          borderRadius: 12,
                                          padding: "12px 14px",
                                          fontSize: 16,
                                          fontWeight: 700,
                                          outline: "none",
                                          background: isCorrect ? "#DCFCE7" : "#FFFFFF",
                                        }}
                                      />
                                      <button
                                        onClick={() => handleQuizQuestionCheck(index)}
                                        disabled={isCorrect}
                                        style={{
                                          background: isCorrect ? "#BBF7D0" : "#4F46E5",
                                          color: isCorrect ? "#166534" : "#FFFFFF",
                                          border: "none",
                                          borderRadius: 12,
                                          padding: "12px 16px",
                                          fontWeight: 800,
                                          cursor: isCorrect ? "default" : "pointer",
                                        }}
                                      >
                                        {isCorrect ? "Checked" : "Check"}
                                      </button>
                                    </div>
                                    {rowFeedback ? (
                                      <div
                                        style={{
                                          marginTop: 10,
                                          padding: "10px 12px",
                                          borderRadius: 12,
                                          background: rowFeedback.kind === "correct" ? "#DCFCE7" : "#FFF1F2",
                                          color: rowFeedback.kind === "correct" ? "#166534" : "#BE123C",
                                          fontSize: 14,
                                          lineHeight: 1.6,
                                        }}
                                      >
                                        {rowFeedback.message}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {adaptiveStatus ? (
                          <div
                            style={{
                              marginBottom: 12,
                              padding: "10px 12px",
                              borderRadius: 12,
                              background: practiceTrack === "challenge" ? "#ECFDF5" : practiceTrack === "remediation" ? "#FFF7ED" : "#EEF2FF",
                              color: practiceTrack === "challenge" ? "#166534" : practiceTrack === "remediation" ? "#9A3412" : "#3730A3",
                              fontSize: 13,
                              lineHeight: 1.6,
                            }}
                          >
                            {adaptiveStatus}
                          </div>
                        ) : null}
                        <div style={{ fontWeight: 700, marginBottom: 10 }}>{activePracticePrompt}</div>
                        {currentStep.practice.mode === "numeric" ? (
                          <>
                            <input
                              value={answer}
                              onChange={(event) => setAnswer(event.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                              placeholder="Type your answer"
                              style={{
                                width: "100%",
                                border: "1px solid #CBD5E1",
                                borderRadius: 12,
                                padding: "12px 14px",
                                fontSize: 16,
                                marginBottom: 12,
                                outline: "none",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#4F46E5";
                                e.currentTarget.style.animation = "ms-glow-pulse 1.2s ease infinite";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#CBD5E1";
                                e.currentTarget.style.animation = "none";
                              }}
                            />
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                              <button onClick={handleCheck} style={{ background: "#4F46E5", color: "#FFFFFF", border: "none", borderRadius: 12, padding: "10px 14px", fontWeight: 800, cursor: "pointer" }}>Check answer</button>
                              <button onClick={handleHint} style={{ background: "#FFFFFF", color: "#0F172A", border: "1px solid #CBD5E1", borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>Use hint</button>
                            </div>
                          </>
                        ) : null}
                        {showWorkedSteps && activeHints?.length ? (
                          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                            {activeHints.map((hint) => (
                              <div key={hint} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 12px", color: "#334155" }}>
                                {hint}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ color: "#64748B" }}>No practice input for this step.</div>
                )}
                {feedback ? (
                  <div
                    key={feedbackKey}
                    style={{
                      marginTop: 14,
                      padding: 12,
                      borderRadius: 12,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      background:
                        feedbackKind === "correct" ? "#F0FDF4" :
                        feedbackKind === "wrong"   ? "#FFF1F2" : "#EEF2FF",
                      color:
                        feedbackKind === "correct" ? "#15803D" :
                        feedbackKind === "wrong"   ? "#BE123C" : "#3730A3",
                      border:
                        feedbackKind === "correct" ? "1px solid #BBF7D0" :
                        feedbackKind === "wrong"   ? "1px solid #FECDD3" : "1px solid #C7D2FE",
                      animation:
                        feedbackKind === "correct" ? "ms-correct-burst 0.7s ease both, ms-feedback-in 0.3s ease both" :
                        feedbackKind === "wrong"   ? "ms-wrong-shake 0.45s ease both" :
                        "ms-feedback-in 0.35s ease both",
                    }}
                  >
                    {feedbackKind === "correct" ? "✓ " : feedbackKind === "wrong" ? "✗ " : ""}{feedback}
                  </div>
                ) : null}
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: isPhone ? 16 : 20 }}>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>Step Actions</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {currentStep.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleStepAction(action.id)}
                      style={{
                        border: action.primary ? "none" : "1px solid #CBD5E1",
                        background: action.primary ? "#4F46E5" : "#FFFFFF",
                        color: action.primary ? "#FFFFFF" : "#0F172A",
                        borderRadius: 12,
                        padding: "10px 14px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: "sticky", bottom: 0, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, padding: isPhone ? 14 : 16, display: "flex", justifyContent: "space-between", gap: 12, alignItems: isPhone ? "stretch" : "center", flexWrap: "wrap", zIndex: 100 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: isPhone ? "100%" : "auto" }}>
              <button 
                onClick={() => moveToStep(stepIndex - 1)} 
                disabled={stepIndex === 0} 
                style={{ 
                  border: "1px solid #CBD5E1", 
                  background: stepIndex === 0 ? "#F8FAFC" : "#FFFFFF", 
                  borderRadius: 12, 
                  padding: "12px 20px", 
                  cursor: stepIndex === 0 ? "default" : "pointer", 
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flex: isPhone ? "1 1 0" : undefined,
                  justifyContent: "center"
                }}
              >
                <span>←</span> Back
              </button>
              <button 
                onClick={() => moveToStep(stepIndex + 1)} 
                disabled={isLast} 
                style={{ 
                  border: "none", 
                  background: isLast ? "#CBD5E1" : "#4F46E5", 
                  color: "#FFFFFF", 
                  borderRadius: 12, 
                  padding: "12px 24px", 
                  cursor: isLast ? "default" : "pointer", 
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flex: isPhone ? "1 1 0" : undefined,
                  justifyContent: "center"
                }}
              >
                Next <span>→</span>
              </button>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: isPhone ? "100%" : "auto" }}>
              {payload.nextLessonUrl ? (
                <Link href={payload.nextLessonUrl} style={{ textDecoration: "none", background: "#FFFFFF", color: "#0F172A", border: "1px solid #CBD5E1", borderRadius: 12, padding: "10px 14px", fontWeight: 700, flex: isPhone ? "1 1 0" : undefined, textAlign: "center" }}>Next Lesson</Link>
              ) : null}
              <Link href={`/mindsutra/course/${payload.course.levelSlug}`} style={{ textDecoration: "none", background: "#FFFFFF", color: "#0F172A", border: "1px solid #CBD5E1", borderRadius: 12, padding: "10px 14px", fontWeight: 700, flex: isPhone ? "1 1 0" : undefined, textAlign: "center" }}>Course Map</Link>
            </div>
          </div>
        </section>
      </section>
      {clarityCheckOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 60,
          }}
        >
          <div
            style={{
              width: "min(560px, 100%)",
              background: "#FFFFFF",
              borderRadius: 24,
              border: "1px solid #C7D2FE",
              boxShadow: "0 24px 80px rgba(79, 70, 229, 0.24)",
              overflow: "hidden",
              animation: "ms-feedback-in 0.25s ease both",
            }}
          >
            <div style={{ padding: "18px 22px", background: "linear-gradient(135deg, #EEF2FF, #F8FAFC)", borderBottom: "1px solid #E0E7FF" }}>
              <div style={{ fontSize: 12, color: "#4338CA", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2 }}>Quick clarity check</div>
              <div style={{ marginTop: 8, fontSize: 24, fontWeight: 900, color: "#0F172A" }}>{learnerInsight.studentName}, how clear does this method feel right now?</div>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ color: "#334155", lineHeight: 1.7, fontSize: 16 }}>
                I will use your choice to decide whether to reteach, give one more check, or move you into a harder variation, {learnerInsight.studentName}.
              </div>
              <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
                <button
                  onClick={() => handleClarityChoice("need_help")}
                  style={{ background: "#FFF7ED", color: "#9A3412", border: "1px solid #FDBA74", borderRadius: 16, padding: "16px 18px", fontWeight: 800, fontSize: 17, cursor: "pointer", textAlign: "left" }}
                >
                  Need more help
                </button>
                <button
                  onClick={() => handleClarityChoice("almost_there")}
                  style={{ background: "#FFFFFF", color: "#0F172A", border: "1px solid #CBD5E1", borderRadius: 16, padding: "16px 18px", fontWeight: 800, fontSize: 17, cursor: "pointer", textAlign: "left" }}
                >
                  Almost there
                </button>
                <button
                  onClick={() => handleClarityChoice("clear")}
                  style={{ background: "#ECFDF5", color: "#166534", border: "1px solid #86EFAC", borderRadius: 16, padding: "16px 18px", fontWeight: 800, fontSize: 17, cursor: "pointer", textAlign: "left" }}
                >
                  It is clear
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {lessonCompletionSaved && (
        <MindSutraAchievementPop 
          lessonTitle={payload.lesson.title}
          xpReward={payload.lesson.xpReward}
          onClose={() => setLessonCompletionSaved(false)}
          nextLessonUrl={payload.nextLessonUrl}
        />
      )}
    </main>
  );
}
