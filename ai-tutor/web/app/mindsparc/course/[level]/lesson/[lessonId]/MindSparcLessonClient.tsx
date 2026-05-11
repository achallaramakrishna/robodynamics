"use client";

// MindSparcLessonClient.tsx
// A themed variant of the MindSutra lesson client for MindSparc Aptitude tiers.

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MindSutraLessonPayload } from "@/lib/mindsutraLessonTypes";
import MindSparcAvatar from "./MindSparcAvatar";
import { type AvatarMood, type AvatarGesture } from "@/app/mindsutra/course/[level]/lesson/[lessonId]/MindSutraAvatar";

const BOARD_ANIMATIONS = `
  @keyframes sparq-board-enter {
    0% { transform: translateY(40px) scale(0.95); opacity: 0; filter: blur(10px); }
    100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
  }
  @keyframes sparq-headline-pop {
    0% { transform: scale(0.8) translateY(10px); opacity: 0; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes sparq-expr-stamp {
    0% { transform: scale(1.3) rotate(-5deg); opacity: 0; }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }
  @keyframes sparq-glow-pulse {
    0% { box-shadow: 0 0 0px rgba(56, 189, 248, 0.4); }
    50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.6), inset 0 0 10px rgba(56, 189, 248, 0.2); }
    100% { box-shadow: 0 0 0px rgba(56, 189, 248, 0.4); }
  }
  @keyframes sparq-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .logic-glass {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 32px 64px -16px rgba(0, 0, 0, 0.15);
  }
  .visual-container {
    background: radial-gradient(circle at 50% 50%, #F8FAFC, #EFF6FF);
    border: 1px dashed #BFDBFE;
    position: relative;
    overflow: hidden;
  }
  .visual-container::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: sparq-shimmer 3s infinite linear;
    pointer-events: none;
  }
`;

function BoardPanel({
  step,
  boardKey,
}: {
  step: MindSutraLessonPayload["steps"][number];
  boardKey: number;
}) {
  const headline = typeof step.board.data.headline === "string" ? step.board.data.headline : null;
  const category = typeof step.board.data.category === "string" ? step.board.data.category : "Aptitude";
  const goal = typeof step.board.data.goal === "string" ? step.board.data.goal : null;
  const rule = typeof step.board.data.rule === "string" ? step.board.data.rule : null;
  const prompt = typeof step.board.data.prompt === "string" ? step.board.data.prompt : null;
  const note = typeof step.board.data.note === "string" ? step.board.data.note : null;
  const body = typeof step.board.data.body === "string" ? step.board.data.body : null;
  const takeaway = typeof step.board.data.takeaway === "string" ? step.board.data.takeaway : null;

  return (
    <div
      key={boardKey}
      className="logic-glass"
      style={{
        borderRadius: 32,
        padding: "40px",
        minHeight: 450,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        animation: "sparq-board-enter 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Visual Accent */}
      <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)", borderRadius: "50%" }}></div>

      <div style={{ fontSize: 12, fontWeight: 900, color: "#38BDF8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, background: "#38BDF8", borderRadius: "50%", animation: "sparq-glow-pulse 2s infinite" }}></span>
        {category} · {step.label}
      </div>

      {headline ? (
        <h2 style={{ 
          margin: "0 0 16px", 
          fontSize: 32, 
          fontWeight: 900, 
          color: "#0F172A", 
          lineHeight: 1.1, 
          letterSpacing: -1,
          animation: "sparq-headline-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) both" 
        }}>
          {headline}
        </h2>
      ) : null}

      {/* Main Board Visual */}
      <div style={{ margin: "16px 0", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {(step.board.data.visual as any)?.href ? (
          <div
            id="logic-svg-object-wrapper"
            style={{
              width: "100%",
              borderRadius: 20,
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#F8FAFC",
              border: "1px dashed #BFDBFE",
              overflow: "hidden"
            }}
          >
            <img
              id="logic-svg-object"
              key={(step.board.data.visual as any).href}
              src={(step.board.data.visual as any).href}
              alt="Logic Board"
              style={{
                width: "100%",
                maxWidth: "560px",
                height: "auto",
                maxHeight: "300px",
                objectFit: "contain",
                display: "block"
              }}
            />
          </div>
        ) : null}

        {prompt ? (
          <div style={{ 
            fontSize: 22, 
            fontWeight: 800, 
            color: "#1E293B", 
            lineHeight: 1.3, 
            textAlign: "center", 
            background: "linear-gradient(135deg, #F8FAFC, #EFF6FF)", 
            padding: "24px 32px", 
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
          }}>
            {prompt}
          </div>
        ) : null}

        {body ? (
          <div style={{ 
            fontSize: 16, 
            color: "#475569", 
            lineHeight: 1.7, 
            background: "#FFFFFF", 
            border: "1px solid #E2E8F0", 
            padding: "24px 28px", 
            borderRadius: 24,
            position: "relative"
          }}>
             <div style={{ 
               background: "#38BDF8", 
               color: "#FFFFFF", 
               fontSize: 10, 
               fontWeight: 900, 
               padding: "4px 12px", 
               borderRadius: 100, 
               position: "absolute", 
               top: -12, 
               left: 20,
               textTransform: "uppercase",
               letterSpacing: 1
             }}>
               Discovery Mission Walkthrough
             </div>
             {body}
          </div>
        ) : null}

        {takeaway ? (
          <div style={{ 
            fontSize: 18, 
            fontWeight: 800, 
            color: "#0F766E", 
            background: "linear-gradient(135deg, #F0FDFA, #E6FFFA)", 
            border: "1px solid #99F6E4", 
            padding: "20px 24px", 
            borderRadius: 24,
            boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.1)"
          }}>
             <span style={{ marginRight: 12, fontSize: 24 }}>🧭</span> {takeaway}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {rule ? (
          <div style={{ 
            background: "linear-gradient(135deg, #0C4A6E, #075985)", 
            borderRadius: 24, 
            padding: "20px 28px", 
            animation: "sparq-expr-stamp 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
            boxShadow: "0 12px 32px -8px rgba(12, 74, 110, 0.4)"
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#38BDF8", textTransform: "uppercase", marginBottom: 6, letterSpacing: 1.5 }}>The Secret Logic</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#FFFFFF" }}>{rule}</div>
          </div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {goal ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center", color: "#64748B", fontSize: 15, fontWeight: 600 }}>
              <span style={{ fontSize: 20 }}>🎯</span>
              <span>Mission Target: <strong style={{ color: "#0F172A" }}>{goal}</strong></span>
            </div>
          ) : <div />}

          {note ? (
            <div style={{ fontSize: 13, fontWeight: 700, color: "#38BDF8", letterSpacing: 0.5, textTransform: "uppercase" }}>
              ⚡ {note}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MindSparcLessonClient({ payload }: { payload: MindSutraLessonPayload }) {
  const [stepIndex, setStepIndex] = useState(payload.progress.currentStepIndex);
  const [boardKey, setBoardKey] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [crystals, setCrystals] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechKeyRef = useRef(0);

  const currentStep = payload.steps[stepIndex] ?? payload.steps[0];
  const isLast = stepIndex === payload.steps.length - 1;

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
      utter.rate = 1.1;  // Energetic
      utter.pitch = 1.1; // Energetic

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

      utter.onstart = () => { setIsSpeaking(true); setVoiceStatus("Playing tutor voice (Google/Edge)..."); };
      utter.onend = () => { setIsSpeaking(false); setVoiceStatus("Tutor voice ready."); };
      utter.onerror = () => { setIsSpeaking(false); setVoiceStatus("Tutor voice error."); };

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
        body: JSON.stringify({ text: clean, avatarId: "sparq", pace: 0.98 }),
      });
      const data = await response.json().catch(() => null);
      if (myKey !== speechKeyRef.current) return;

      if (response.ok && data?.audioBase64) {
        const mimeType = String(data?.mimeType || "audio/wav");
        const audio = new Audio(`data:${mimeType};base64,${data.audioBase64}`);
        activeAudioRef.current = audio;
        audio.onplaying = () => { if (myKey === speechKeyRef.current) setIsSpeaking(true); };
        audio.onended = () => { if (myKey === speechKeyRef.current) setIsSpeaking(false); };
        audio.onerror = () => { if (myKey === speechKeyRef.current) { setIsSpeaking(false); speakWithBrowser(clean); } };
        await audio.play();
        return;
      }
      speakWithBrowser(clean);
    } catch {
      if (myKey === speechKeyRef.current) speakWithBrowser(clean);
    }
  }

  useEffect(() => {
    setAnswer("");
    setFeedback(null);
    setBoardKey((k) => k + 1);
    if (voiceEnabled) {
      void speakText(currentStep.tutorText);
    } else {
      stopSpeaking();
    }
    return () => stopSpeaking();
  }, [stepIndex]);

  useEffect(() => {
    if (!voiceEnabled) {
      stopSpeaking();
      setVoiceStatus("Voice is muted.");
    } else {
      setVoiceStatus("Tutor voice ready.");
    }
  }, [voiceEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft") {
        setStepIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setStepIndex(prev => Math.min(payload.steps.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [payload.steps.length]);

  useEffect(() => {
    // Listen for custom messages from interactive SVGs
    const handleSvgMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SPARQ_SVG_INTERACTION') {
        const { action, id, isCorrect } = e.data;
        if (action === 'drop' || action === 'click') {
          if (isCorrect) {
            handleCheck(true); // Forced correct from SVG
          } else {
            handleCheck(false); // Forced wrong from SVG
          }
        }
      }
    };
    window.addEventListener('message', handleSvgMessage);
    return () => window.removeEventListener('message', handleSvgMessage);
  }, [currentStep.id]);

  function handleCheck(forcedSuccess?: boolean) {
    const isCorrect = forcedSuccess ?? (answer.trim().toLowerCase() === String(currentStep.practice?.answer).toLowerCase());
    
    const correctFeeds = [
      "Arre waah, champ! Superb, yaar! Crystal saved! 💎",
      "Bahut achha, beta! Correct logic! +1 Crystal! ⚡",
      "Superb! The Magic Jungle is proud of you! 🏆",
      "Shabaash! Pattern solved perfectly! 🎆",
    ];

    if (isCorrect) {
      const msg = correctFeeds[Math.floor(Math.random() * correctFeeds.length)];
      setFeedback(msg);
      setWrongCount(0);
      setCrystals(prev => prev + 1);
      
      // Trigger SVG burst if object exists
      const obj = document.getElementById('logic-svg-object') as HTMLObjectElement;
      if (obj?.contentDocument) {
        const burst = obj.contentDocument.getElementById('crystal-burst');
        if (burst) {
          burst.setAttribute('opacity', '1');
          (burst as any).beginElement?.();
        }
      }
      
      if (voiceEnabled) void speakText(msg);
    } else {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);

      let msg = "";
      if (newWrongCount === 1) {
        msg = "Almost there, champ! Don't worry, try once more! 🐾";
      } else if (newWrongCount === 2) {
        const hint = currentStep.practice?.hints?.[0] || "Look for the repeat, beta!";
        msg = `Arre! Sparky's Hint: ${hint} 🔍`;
      } else {
        const expl = `Sparky logic: The answer is "${currentStep.practice?.answer}" because it follows the ${currentStep.board.data.rule} rule. Let's try the next one!`;
        msg = expl;
      }
      
      setFeedback(msg);
      if (voiceEnabled) void speakText(msg);
    }
  }

  const avatarMood = useMemo((): AvatarMood => {
    if (feedback?.startsWith("Correct")) return "celebrating";
    if (isSpeaking) return "encouraging";
    return "neutral";
  }, [feedback, isSpeaking]);

  const avatarGesture = useMemo((): AvatarGesture => {
    if (currentStep.id === "intro") return "greet";
    if (currentStep.id === "concept") return "explain";
    if (currentStep.id === "recap") return "celebrate";
    return "idle";
  }, [currentStep.id]);

  return (
    <main style={{ minHeight: "100vh", background: "#060D17", color: "#F8FAFC", fontFamily: "'Inter', sans-serif" }}>
      <style>{BOARD_ANIMATIONS}</style>
      
      {/* Top Nav: Glassmorphic Floating */}
      <header style={{ 
        background: "rgba(15, 23, 42, 0.4)", 
        backdropFilter: "blur(20px)", 
        borderBottom: "1px solid rgba(255,255,255,0.08)", 
        padding: "12px 32px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        position: "sticky", 
        top: 0, 
        zIndex: 100,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ 
            background: "linear-gradient(135deg, #38BDF8, #3B82F6)", 
            width: 40, height: 40, borderRadius: 12, 
            display: "flex", alignItems: "center", justifyContent: "center", 
            fontSize: 20, fontWeight: 900, color: "#0F172A",
            boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)" 
          }}>MS</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#38BDF8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 2 }}>Tier {payload.course.levelSlug.split("-")[1]} Masterclass</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#F8FAFC" }}>{payload.lesson.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid #38BDF840", borderRadius: 100, padding: "8px 16px", color: "#38BDF8", fontSize: 13, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ animation: crystals > 0 ? "sparq-success-burst 0.5s" : "none" }}>💎</span>
            {crystals} Crystals
          </div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
             <button
               onClick={() => setVoiceEnabled(true)}
               style={{
                 background: voiceEnabled ? "#38BDF8" : "transparent",
                 color: voiceEnabled ? "#0F172A" : "#94A3B8",
                 border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 12, fontWeight: 800, transition: "all 0.2s"
               }}
             >
               Voice On
             </button>
             <button
               onClick={() => setVoiceEnabled(false)}
               style={{
                 background: !voiceEnabled ? "#334155" : "transparent",
                 color: !voiceEnabled ? "#FFFFFF" : "#94A3B8",
                 border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 12, fontWeight: 800, transition: "all 0.2s"
               }}
             >
               Mute
             </button>
          </div>
          <Link href={`/mindsparc/course/${payload.course.levelSlug}`} style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            color: "#EF4444", 
            border: "1px solid rgba(239, 68, 68, 0.2)",
            padding: "8px 20px",
            borderRadius: 10,
            textDecoration: "none", 
            fontSize: 13, 
            fontWeight: 800,
            transition: "all 0.2s"
          }}>Exit</Link>
        </div>
      </header>



      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "calc(100vh - 72px)" }}>
        {/* Left Side: Tutor */}
        <aside style={{ background: "#0F172A", borderRight: "1px solid rgba(255,255,255,0.05)", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "linear-gradient(135deg, #0EA5E910, #3B82F610)", border: "1px solid #38BDF830", borderRadius: 24, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
               <MindSparcAvatar size={160} speaking={isSpeaking} mood={avatarMood} gesture={avatarGesture} name="Sparc" label="Logic Coach" />
            </div>
            <div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, textAlign: "center" }}>
              {currentStep.tutorText}
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => (isSpeaking ? stopSpeaking() : void speakText(currentStep.tutorText))}
                style={{
                  background: isSpeaking ? "#EF444420" : "#38BDF815",
                  color: isSpeaking ? "#F87171" : "#38BDF8",
                  border: `1px solid ${isSpeaking ? "#EF444430" : "#38BDF840"}`,
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                {isSpeaking ? "⏹ Stop Audio" : "🔊 Listen Again"}
              </button>
            </div>

            {feedback && (
              <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: feedback.startsWith("Correct") ? "#065F4620" : "#991B1B20", border: feedback.startsWith("Correct") ? "1px solid #10B98130" : "1px solid #EF444430", color: feedback.startsWith("Correct") ? "#34D399" : "#F87171", fontSize: 13, fontWeight: 700 }}>
                {feedback}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Curriculum Path</div>
            {payload.steps.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", cursor: "pointer", opacity: i === stepIndex ? 1 : 0.4 }} onClick={() => setStepIndex(i)}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: i === stepIndex ? "#38BDF8" : "#1E293B", fontSize: 11, fontWeight: 900, color: i === stepIndex ? "#0F172A" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Side: Board & Interaction */}
        <section style={{ 
          padding: "48px", 
          display: "flex", 
          flexDirection: "column", 
          gap: 40, 
          background: "radial-gradient(circle at 100% 100%, #172554 0%, #060D17 100%)",
          overflowY: "auto" as const
        }}>
          <BoardPanel step={currentStep} boardKey={boardKey} />

          {/* Floating Interaction Bar */}
          <div style={{ 
            display: "flex", 
            gap: 24, 
            alignItems: "center", 
            background: "rgba(15, 23, 42, 0.8)", 
            backdropFilter: "blur(32px)",
            padding: "24px 32px", 
            borderRadius: 32, 
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 -20px 48px rgba(0,0,0,0.3)",
            position: "sticky",
            bottom: 0
          }}>
            {currentStep.practice ? (
              <div style={{ flex: 1, display: "flex", gap: 16 }}>
                <input 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Master logical answer..."
                  style={{ 
                    flex: 1, 
                    background: "rgba(0,0,0,0.4)", 
                    border: "1px solid rgba(56, 189, 248, 0.2)", 
                    borderRadius: 16, 
                    padding: "16px 24px", 
                    color: "#F8FAFC", 
                    fontSize: 16,
                    fontWeight: 600,
                    outline: "none",
                    boxShadow: "inset 0 4px 12px rgba(0,0,0,0.2)" 
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                />
                <button 
                  onClick={() => handleCheck()} 
                  style={{ 
                    background: "linear-gradient(135deg, #38BDF8, #3B82F6)", 
                    color: "#0F172A", 
                    fontWeight: 900, 
                    fontSize: 16,
                    border: "none", 
                    borderRadius: 16, 
                    padding: "0 32px", 
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(56, 189, 248, 0.3)"
                  }}
                >
                  Verify Logic
                </button>
              </div>
            ) : (
              <div style={{ flex: 1, color: "#94A3B8", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>💡</span>
                Study the Discovery Mission parameters...
              </div>
            )}
            
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
                style={{ 
                  background: "rgba(255,255,255,0.05)", 
                  color: "#CBD5E1", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: 16, 
                  padding: "12px 24px", 
                  fontWeight: 800, 
                  fontSize: 14,
                  cursor: "pointer", 
                  opacity: stepIndex === 0 ? 0.3 : 1 
                }}
              >
                Previous
              </button>
              <button 
                onClick={() => isLast ? setShowReflection(true) : setStepIndex(prev => prev + 1)}
                style={{ 
                  background: isLast ? "#10B981" : "#F8FAFC", 
                  color: "#0F172A", 
                  border: "none", 
                  borderRadius: 16, 
                  padding: "12px 32px", 
                  fontWeight: 900, 
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: isLast ? "0 8px 20px rgba(16, 185, 129, 0.3)" : "0 8px 20px rgba(255,255,255,0.1)"
                }}
              >
                {isLast ? "Mission Complete" : "Analyze Next"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Reflection Overlay */}
      {showReflection && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(6, 13, 23, 0.95)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 500, width: "100%", background: "#0F172A", border: "1px solid #38BDF840", borderRadius: 32, padding: "40px", textAlign: "center", animation: "sparq-board-enter 0.6s both" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🏆</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>You saved the Jungle!</h2>
            <p style={{ color: "#94A3B8", fontSize: 16, marginBottom: 32 }}>Bahut badhiya, champ! You collected <strong>{crystals} crystals</strong> and mastered the <strong>{payload.lesson.title}</strong> logic.</p>
            
            <div style={{ textAlign: "left", background: "rgba(56, 189, 248, 0.05)", borderRadius: 24, padding: 24, marginBottom: 32 }}>
               <div style={{ fontSize: 13, fontWeight: 900, color: "#38BDF8", textTransform: "uppercase", marginBottom: 16 }}>Sparky's Reflection</div>
               <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                 <div style={{ fontSize: 14 }}>1. What was repeating in today's mission?</div>
                 <div style={{ fontSize: 14 }}>2. Which clue helped you most: color, shape, or movement?</div>
                 <div style={{ fontSize: 14 }}>3. Can you make your own 3-part pattern now?</div>
               </div>
            </div>

            <Link href={`/mindsparc/course/${payload.course.levelSlug}`} style={{ display: "block", background: "linear-gradient(135deg, #38BDF8, #3B82F6)", color: "#0F172A", textDecoration: "none", fontWeight: 900, padding: "16px", borderRadius: 16, boxShadow: "0 10px 20px rgba(56, 189, 248, 0.3)" }}>
              Level Up! Next Adventure →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
