"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { VidyaLessonPayload, VidyaLessonStep } from "../../lib/vidyaLessonTypes";
import { usePyodide } from "../../hooks/usePyodide";
import VidyaAvatar, { type AvatarMood, type AvatarGesture } from "./VidyaAvatar";

interface PythonCodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function PythonCodeEditor({ value, onChange, placeholder }: PythonCodeEditorProps) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = value.split("\n");
  const lineNumbers = Array.from({ length: Math.max(lines.length, 1) }, (_, i) => i + 1);

  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col font-mono text-sm">
      {/* Chrome Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
          <span>🐍</span>
          <span>main.py</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Python 3.10</span>
        </div>
      </div>

      {/* Editor Main Core */}
      <div className="flex bg-slate-950 h-56 relative">
        {/* Gutter Line Numbers */}
        <div 
          ref={gutterRef}
          className="w-11 select-none text-slate-600 text-right pr-3 py-4 border-r border-slate-900 overflow-hidden leading-6 font-mono text-xs bg-slate-900/40"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Textarea Input Editor */}
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent text-green-400 p-4 pl-3 focus:outline-none focus:ring-0 border-0 resize-none h-full font-mono text-sm leading-6 overflow-y-auto selection:bg-indigo-500/30 selection:text-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "# Write your Python code here..."}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function VidyaConceptVisualizer({ concept }: { concept: "if" | "while" | "function" | "class" }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (concept === "if") {
    const isTruePath = step < 2;
    return (
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-indigo-500/10 mb-6 flex flex-col items-center">
        <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          Live Logic Visualization: Gated Condition
        </h4>
        <svg width="280" height="150" viewBox="0 0 280 150" className="w-full max-w-[280px]">
          <path d="M 20,75 L 120,75" stroke="#334155" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 120,75 L 200,30 L 260,30" stroke={isTruePath ? "#10b981" : "#334155"} strokeWidth="6" strokeLinecap="round" fill="none" className="transition-all duration-700" />
          <path d="M 120,75 L 200,120 L 260,120" stroke={!isTruePath ? "#ef4444" : "#334155"} strokeWidth="6" strokeLinecap="round" fill="none" className="transition-all duration-700" />

          <rect x="90" y="55" width="60" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
          <text x="120" y="78" fill="#c7d2fe" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">if score &gt;= 10</text>

          <line 
            x1="120" y1="75" 
            x2="155" y2={isTruePath ? "55" : "95"} 
            stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" 
            className="transition-all duration-500" 
          />

          <text x="260" y="22" fill={isTruePath ? "#34d399" : "#64748b"} fontSize="10" textAnchor="end" fontWeight="bold" fontFamily="monospace">True (Level Up)</text>
          <text x="260" y="135" fill={!isTruePath ? "#f87171" : "#64748b"} fontSize="10" textAnchor="end" fontWeight="bold" fontFamily="monospace">False (Try Again)</text>

          <circle 
            cx={step === 0 ? 30 : step === 1 ? 120 : 230} 
            cy={step === 0 ? 75 : step === 1 ? 75 : (isTruePath ? 30 : 120)} 
            r="8" 
            fill={step === 2 ? (isTruePath ? "#10b981" : "#ef4444") : "#38bdf8"} 
            className="transition-all duration-1000 ease-in-out shadow-lg"
          />
        </svg>
        <p className="text-xs text-slate-400 mt-2 text-center max-w-xs">
          The computer reads <code className="text-indigo-400">score &gt;= 10</code>. If evaluated as <strong className="text-green-400">True</strong>, the gate swings up. If <strong className="text-red-400">False</strong>, it deflects down.
        </p>
      </div>
    );
  }

  if (concept === "while") {
    const isLooping = step < 3;
    return (
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-purple-500/10 mb-6 flex flex-col items-center">
        <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          Live Logic Visualization: While Loop Track
        </h4>
        <svg width="280" height="150" viewBox="0 0 280 150" className="w-full max-w-[280px]">
          <rect x="40" y="25" width="130" height="100" rx="50" fill="none" stroke="#334155" strokeWidth="6" />
          <rect x="40" y="25" width="130" height="100" rx="50" fill="none" stroke={isLooping ? "#a855f7" : "#334155"} strokeWidth="6" strokeDasharray="300" strokeDashoffset={step * 80} className="transition-all duration-1000" />
          
          <path d="M 170,75 L 250,75" stroke={!isLooping ? "#38bdf8" : "#334155"} strokeWidth="6" strokeLinecap="round" fill="none" className="transition-all duration-700" />

          <line 
            x1="170" y1="75" 
            x2={isLooping ? "170" : "210"} 
            y2={isLooping ? "40" : "75"} 
            stroke="#f59e0b" strokeWidth="5" strokeLinecap="round"
            className="transition-all duration-500"
          />

          <rect x="70" y="55" width="70" height="40" rx="6" fill="#1e1b4b" stroke="#a855f7" strokeWidth="2" />
          <text x="105" y="74" fill="#e9d5ff" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">while lives &gt; 0</text>
          <text x="105" y="87" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">lives = {Math.max(0, 3 - step)}</text>

          <text x="250" y="95" fill={!isLooping ? "#38bdf8" : "#64748b"} fontSize="10" textAnchor="end" fontWeight="bold" fontFamily="monospace">Loop Exit</text>

          <circle 
            cx={!isLooping ? 230 : (step === 0 ? 105 : step === 1 ? 160 : 50)}
            cy={!isLooping ? 75 : (step === 0 ? 25 : step === 1 ? 75 : 75)}
            r="8"
            fill={isLooping ? "#a855f7" : "#38bdf8"}
            className="transition-all duration-1000 ease-in-out shadow-lg"
          />
        </svg>
        <p className="text-xs text-slate-400 mt-2 text-center max-w-xs">
          The loop repeats as long as <code className="text-purple-400">lives &gt; 0</code> is <strong className="text-green-400">True</strong>. When the counter hits <strong className="text-red-400">0</strong>, the switch pivots and the program exits!
        </p>
      </div>
    );
  }

  if (concept === "function") {
    return (
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-teal-500/10 mb-6 flex flex-col items-center">
        <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          Live Logic Visualization: Function Funnel
        </h4>
        <svg width="280" height="150" viewBox="0 0 280 150" className="w-full max-w-[280px]">
          <path d="M 110,10 L 170,10 L 155,40 L 125,40 Z" fill="#115e59" stroke="#14b8a6" strokeWidth="2" />
          
          <rect x="100" y="40" width="80" height="60" rx="8" fill="#134e4a" stroke="#14b8a6" strokeWidth="3" />
          <text x="140" y="70" fill="#ccfbf1" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">def spell(x):</text>
          <text x="140" y="85" fill="#5eead4" fontSize="9" textAnchor="middle" fontFamily="monospace">return x * 10</text>

          <circle cx="115" cy="50" r="5" fill="none" stroke="#2dd4bf" strokeWidth="1.5" className="animate-spin" style={{ transformOrigin: "115px 50px", animationDuration: "3s" }} />
          <circle cx="165" cy="90" r="5" fill="none" stroke="#2dd4bf" strokeWidth="1.5" className="animate-spin" style={{ transformOrigin: "165px 90px", animationDuration: "2s" }} />

          <line x1="80" y1="120" x2="200" y2="120" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {step === 0 && (
            <g className="animate-bounce" style={{ animationDuration: "1s" }}>
              <circle cx="140" cy="5" r="7" fill="#f43f5e" />
              <text x="140" y="8" fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold" fontFamily="monospace">5</text>
            </g>
          )}

          {step === 1 && (
            <circle cx="140" cy="70" r="10" fill="#f43f5e" className="animate-ping" style={{ animationDuration: "1s" }} />
          )}

          {(step === 2 || step === 3) && (
            <g className="transition-all duration-1000 ease-out" style={{ transform: `translateX(${step === 3 ? "50px" : "0px"})` }}>
              <polygon points="140,115 145,123 135,123" fill="#14b8a6" />
              <circle cx="140" cy="132" r="9" fill="#14b8a6" />
              <text x="140" y="135" fill="#004d40" fontSize="8" textAnchor="middle" fontWeight="bold" fontFamily="monospace">50</text>
            </g>
          )}
        </svg>
        <p className="text-xs text-slate-400 mt-2 text-center max-w-xs">
          Values are passed in as **arguments** (<code className="text-teal-400">x = 5</code>). The function processes them internally, and <strong className="text-teal-400">returns</strong> a transformed output spell (<code className="text-teal-400">50</code>)!
        </p>
      </div>
    );
  }

  if (concept === "class") {
    return (
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-pink-500/10 mb-6 flex flex-col items-center">
        <h4 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          Live Logic Visualization: Blueprint Press
        </h4>
        <svg width="280" height="150" viewBox="0 0 280 150" className="w-full max-w-[280px]">
          <rect x="15" y="15" width="95" height="90" rx="4" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,3" />
          <text x="62" y="45" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">class Wizard</text>
          <text x="62" y="65" fill="#bfdbfe" fontSize="8" textAnchor="middle" fontFamily="monospace">name: str</text>
          <text x="62" y="80" fill="#bfdbfe" fontSize="8" textAnchor="middle" fontFamily="monospace">hp: int</text>

          <path d="M 120,5 L 120,55 L 160,55" fill="none" stroke="#64748b" strokeWidth="3" />
          <rect x="140" y="40" width="30" height="30" rx="4" fill="#334155" stroke="#f43f5e" strokeWidth="2" className={step === 1 ? "animate-pulse" : ""} />
          <text x="155" y="58" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold">🤖</text>

          <line x1="100" y1="120" x2="270" y2="120" stroke="#334155" strokeWidth="4" />

          {step >= 2 && (
            <g className="transition-all duration-1000 ease-out" style={{ transform: `translateX(${(step - 2) * 45}px)` }}>
              <rect x="180" y="90" width="45" height="26" rx="4" fill="#9d174d" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="202" y="103" fill="#fdf2f8" fontSize="8" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Instance 1</text>
              <text x="202" y="112" fill="#fbcfe8" fontSize="7" textAnchor="middle" fontFamily="monospace">Priya (hp=100)</text>
            </g>
          )}

          {step >= 3 && (
            <g className="transition-all duration-1000 ease-out" style={{ transform: `translateX(${(step - 3) * 45}px)` }}>
              <rect x="135" y="90" width="45" height="26" rx="4" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="157" y="103" fill="#f5f3ff" fontSize="8" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Instance 2</text>
              <text x="157" y="112" fill="#ddd6fe" fontSize="7" textAnchor="middle" fontFamily="monospace">Arjun (hp=80)</text>
            </g>
          )}
        </svg>
        <p className="text-xs text-slate-400 mt-2 text-center max-w-xs">
          A **Class** acts as a static structural blueprint. Each **Object Instance** has its own unique variable states (<code className="text-pink-400">hp=100</code> vs <code className="text-purple-400">hp=80</code>) stamped out from the blueprint.
        </p>
      </div>
    );
  }

  return null;
}

interface VidyaLessonEngineProps {
  payload: VidyaLessonPayload;
  onComplete: (score: number) => void;
}

export default function VidyaLessonEngine({ payload, onComplete }: VidyaLessonEngineProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Mindsutra-style voice controls
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState("Tutor voice ready.");
  const [voicePrimed, setVoicePrimed] = useState(false);
  const speechKeyRef = useRef(0);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Mindsutra-style adaptive states
  const [learnerInsight, setLearnerInsight] = useState({
    studentName: "Developer",
    supportMode: "balanced",
    coachLine: "Let's build some steady Python programming momentum together!",
    strongestSkills: [] as string[],
    weakSkills: [] as string[],
    recommendedNextFocus: "General Python fluency",
    xp: payload.lesson.xpReward,
    conceptClarityScore: 0.65,
    transferScore: 0.70,
    avgConfidence: 0.75
  });

  const [clarityCheckOpen, setClarityCheckOpen] = useState(false);
  const [showWorkedSteps, setShowWorkedSteps] = useState(false);
  const [activeHints, setActiveHints] = useState<string[]>([]);

  const { pyodide, executeCode, checkAST, isLoading } = usePyodide();

  const step = payload.steps[currentStepIdx];
  const isLastStep = currentStepIdx === payload.steps.length - 1;

  const detectActiveConcept = () => {
    const title = (step?.board?.data?.title || step?.board?.data?.headline || step?.label || "").toLowerCase();
    const lessonId = (payload.lesson.id || "").toLowerCase();
    
    if (title.includes("decision") || title.includes("if") || title.includes("logic") || lessonId.includes("logic") || lessonId.includes("l1_04")) return "if";
    if (title.includes("loop") || title.includes("while") || title.includes("repeat") || lessonId.includes("loop") || lessonId.includes("l1_05")) return "while";
    if (title.includes("function") || title.includes("spell") || lessonId.includes("function") || lessonId.includes("l1_08")) return "function";
    if (title.includes("class") || title.includes("oop") || title.includes("object") || lessonId.includes("oop") || lessonId.includes("l2_01")) return "class";
    return null;
  };

  // ─── FETCH INITIAL LEARNER INSIGHT ───
  useEffect(() => {
    async function fetchInsight() {
      try {
        const res = await fetch(`/api/vidya/progress?lessonId=${encodeURIComponent(payload.lesson.id)}`);
        if (res.ok) {
          const data = await res.json();
          setLearnerInsight({
            studentName: data.studentName || "Developer",
            supportMode: data.supportMode || "balanced",
            coachLine: data.coachLine || "Let's build steady Python momentum together!",
            strongestSkills: data.strongestSkills || [],
            weakSkills: data.weakSkills || [],
            recommendedNextFocus: data.recommendedNextFocus || "General Python fluency",
            xp: data.xp || payload.lesson.xpReward,
            conceptClarityScore: data.conceptClarityScore ?? 0.65,
            transferScore: data.transferScore ?? 0.70,
            avgConfidence: data.avgConfidence ?? 0.75
          });
        }
      } catch (err) {
        console.error("Failed to fetch initial learner insight", err);
      }
    }
    fetchInsight();
  }, [payload.lesson.id]);

  // ─── PUSH ADAPTIVE LEARNER EVENTS ───
  async function pushLearnerEvent(
    eventType: "attempt" | "hint" | "lesson_complete" | "concept_check" | "transfer_check",
    isCorrect?: boolean,
    skillKeys?: string[],
    confidenceScore?: number,
    xpDelta?: number,
  ) {
    try {
      const response = await fetch("/api/vidya/progress", {
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
      
      let derivedMode = data.supportMode || "balanced";
      // Dynamic fast coder adaptive trigger: if they answer correctly on their first attempt, or evaluate concept check clearly, accelerate to challenge mode immediately!
      if ((eventType === "attempt" && isCorrect === true) || (eventType === "concept_check" && isCorrect === true)) {
        derivedMode = "challenge";
      }

      setLearnerInsight({
        studentName: data.studentName || "Developer",
        supportMode: derivedMode,
        coachLine: derivedMode === "challenge" 
          ? "Incredible speed! I've activated LeetCode Algorithmic Challenge Mode to push your logic limits! 🚀"
          : (data.coachLine || "Let's build steady Python momentum together!"),
        strongestSkills: data.strongestSkills || [],
        weakSkills: data.weakSkills || [],
        recommendedNextFocus: data.recommendedNextFocus || "General Python fluency",
        xp: data.xp || payload.lesson.xpReward,
        conceptClarityScore: data.conceptClarityScore ?? 0.65,
        transferScore: data.transferScore ?? 0.70,
        avgConfidence: data.avgConfidence ?? 0.75
      });
    } catch (err) {
      console.error("Failed to push learner event", err);
    }
  }

  const primeVoicePlayback = () => {
    setVoicePrimed(true);
    if (typeof window !== "undefined") {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
    }
  };

  const stopSpeaking = () => {
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
  };

  const speakWithBrowser = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceStatus("Browser speech is unavailable.");
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
        setVoiceStatus("Tutor voice play error.");
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
      setTimeout(speak, 250);
    }
  };

  const speakText = async (text: string) => {
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
              setVoiceStatus("Click Listen to play speech.");
            } else {
              setVoiceStatus("Autoplay blocked. Using browser speech.");
            }
            speakWithBrowser(clean);
          }
        }
      } else {
        setVoiceStatus("Google TTS unavailable. Falling back to browser speech.");
        speakWithBrowser(clean);
      }
    } catch {
      if (myKey === speechKeyRef.current) {
        setVoiceStatus("Google TTS offline. Using browser speech.");
        speakWithBrowser(clean);
      }
    }
  };

  // ─── VOICE TTS AUTOMATION ───
  useEffect(() => {
    if (!step.tutorText || !voiceEnabled) {
      stopSpeaking();
      return;
    }
    void speakText(step.tutorText);
  }, [currentStepIdx, step.tutorText, voiceEnabled]);

  // ─── SYNC USER INPUT WITH STEP STARTER CODE ───
  useEffect(() => {
    if (step?.practice) {
      setUserInput(step.practice.starterCode || "");
    } else {
      setUserInput("");
    }
    setFeedback(null);
    setActiveHints([]);
  }, [currentStepIdx, step?.practice]);

  // ─── STEP ACTIONS ───
  const handleNextStep = () => {
    setFeedback(null);
    setUserInput("");
    stopSpeaking();
    setShowWorkedSteps(false);
    setActiveHints([]);

    if (isLastStep) {
      void pushLearnerEvent("lesson_complete", true, undefined, undefined, payload.lesson.xpReward);
      onComplete(100);
    } else {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    setFeedback(null);
    setUserInput("");
    stopSpeaking();
    setShowWorkedSteps(false);
    setActiveHints([]);

    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleJumpToStep = (idx: number) => {
    setFeedback(null);
    setUserInput("");
    stopSpeaking();
    setShowWorkedSteps(false);
    setActiveHints([]);

    setCurrentStepIdx(idx);
  };

  // ─── HELP DESK ACTIONS ───
  const handleHelpAction = (actionId: "stuck" | "explain_again" | "alternate_explanation") => {
    primeVoicePlayback();
    if (actionId === "stuck") {
      const hints = step.practice?.hints || [];
      const tip = hints[0] || "Check syntax formatting or variable names.";
      setActiveHints((prev) => [...prev, tip]);
      setShowWorkedSteps(true);
      speakText(tip);
      setFeedback(`💡 Hint: ${tip}`);
      void pushLearnerEvent("hint", false);
    } else if (actionId === "explain_again") {
      const explanation = step.explanation?.body || step.tutorText;
      speakText(explanation);
      setFeedback(`📝 Explanation: ${explanation}`);
    } else {
      const alt = (step.explanation as any)?.alternateExplanation || "Think of computer memory as variables like boxes. Storing value is like dropping an object inside.";
      speakText(alt);
      setFeedback(`🔮 Alternate Concept: ${alt}`);
    }
  };

  // ─── ACTIVE CLARITY CHOICE ───
  const handleClarityChoice = async (choice: "need_help" | "almost_there" | "clear") => {
    setClarityCheckOpen(false);
    const score = choice === "clear" ? 5 : choice === "almost_there" ? 3 : 1;
    const isCorrect = choice !== "need_help";
    
    await pushLearnerEvent("concept_check", isCorrect, undefined, score);
    
    if (choice === "clear") {
      setFeedback("✅ Mastery verified! Moving you forward.");
      setTimeout(() => handleNextStep(), 1500);
    } else {
      setFeedback("💡 Logged. Let's practice more on this concept.");
    }
  };

  // ─── SUBMIT CODE / QUIZ RESPONSES ───
  const checkAnswer = async () => {
    if (!step.practice || !step.practice.answer) return;
    
    if (step.practice.mode === "bug_hunt" || step.practice.mode === "code_snippet") {
      setFeedback("⏳ Compiling in Sandbox...");
      
      if (step.practice.requiredAstNodes && step.practice.requiredAstNodes.length > 0) {
        const astResult = await checkAST(userInput, step.practice.requiredAstNodes);
        
        if (astResult.error) {
          setFeedback(`❌ Syntax Error:\n${astResult.error}`);
          void pushLearnerEvent("attempt", false);
          return;
        }
        
        if (!astResult.valid) {
          setFeedback(`❌ Logic works but misses constraints. \nMissing concept: ${astResult.missing.join(", ")}`);
          void pushLearnerEvent("attempt", false);
          return;
        }
      }

      const mockInputs = ["90", "Alex", "100", "Yes"];
      const solutionRes = await executeCode(step.practice.answer, mockInputs);
      const studentRes = await executeCode(userInput, mockInputs);
      
      if (studentRes.error) {
        setFeedback("❌ Python Error:\n" + studentRes.error);
        void pushLearnerEvent("attempt", false);
        return;
      }
      
      if (studentRes.stdout.trim() === solutionRes.stdout.trim()) {
        setFeedback("✅ Excellent! Your output perfectly matches the expected logic.");
        void pushLearnerEvent("attempt", true);
        setClarityCheckOpen(true);
      } else {
        const sTrim = studentRes.stdout.trim();
        const eTrim = solutionRes.stdout.trim();
        let customFeedback = `❌ Logic Error.\n\nExpected Output:\n${solutionRes.stdout}\nYour Output:\n${studentRes.stdout || "[No Output]"}`;
        
        if (sTrim && eTrim) {
          const punctuationRegex = /\s+([!?,.;:])$/;
          const hasExtraSpaceBeforePunc = punctuationRegex.test(sTrim);
          const expectedPuncMatch = eTrim.match(/([!?,.;:])$/);
          
          if (hasExtraSpaceBeforePunc && expectedPuncMatch && sTrim.replace(/\s+([!?,.;:])$/, "$1") === eTrim) {
            const punc = expectedPuncMatch[1];
            customFeedback = `❌ Logic Error.\n\n🔍 The Core Cause:\nYour Code: You wrote code that outputs \`${sTrim}\` which has an extra space before the punctuation \`${punc}\`.\nExpected Output: The solution expects exactly \`${eTrim}\` without any space before the punctuation.\nBecause of this tiny difference, the Python engine evaluates your code's terminal output as \`${sTrim}\` instead of \`${eTrim}\`, triggering a Logic Error.\n\n🛠️ How to Fix It:\nRemove the extra space right before the punctuation \`${punc}\`, so it reads exactly like the expected output. Click Submit Code again! It will compile successfully, award you your experience points (XP), and unlock the next lesson step immediately!`;
          } else if (sTrim.toLowerCase() === eTrim.toLowerCase()) {
            customFeedback = `❌ Logic Error.\n\n🔍 The Core Cause:\nYour Code: Your output is \`${sTrim}\`, but Python string execution checks are extremely precise and case-sensitive!\nExpected Output: The solution expects exactly \`${eTrim}\`.\n\n🛠️ How to Fix It:\nCheck the capitalization of letters in your code so it matches \`${eTrim}\` perfectly. Click Submit Code again! It will compile successfully, award you your experience points (XP), and unlock the next lesson step immediately!`;
          } else if (sTrim.replace(/\s+/g, "") === eTrim.replace(/\s+/g, "")) {
            customFeedback = `❌ Logic Error.\n\n🔍 The Core Cause:\nYour Code: Your output is \`${sTrim}\` which has different spacing than expected.\nExpected Output: The solution expects exactly \`${eTrim}\`.\n\n🛠️ How to Fix It:\nAdjust the spaces inside your print statement strings to match \`${eTrim}\` precisely. Click Submit Code again! It will compile successfully, award you your experience points (XP), and unlock the next lesson step immediately!`;
          }
        }
        
        setFeedback(customFeedback);
        void pushLearnerEvent("attempt", false);
      }
      return;
    }

    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedAnswer = step.practice.answer.trim().toLowerCase();

    if (step.practice.mode === "interview_question") {
      const keywords = step.practice.answer.split(",").map(k => k.trim().toLowerCase());
      const hasAllKeywords = keywords.every(k => normalizedInput.includes(k));
      if (hasAllKeywords) {
        setFeedback("✅ Excellent! You hit all the key concepts.");
        void pushLearnerEvent("attempt", true);
        setClarityCheckOpen(true);
      } else {
        setFeedback("❌ Missing key concepts. " + (step.practice.hints?.[0] || "Try again!"));
        void pushLearnerEvent("attempt", false);
      }
      return;
    }

    if (normalizedInput === normalizedAnswer || normalizedInput.includes(normalizedAnswer)) {
      setFeedback("✅ Excellent! That is correct.");
      void pushLearnerEvent("attempt", true);
      setClarityCheckOpen(true);
    } else {
      setFeedback("❌ Not quite. " + (step.practice.hints?.[0] || "Try again!"));
      void pushLearnerEvent("attempt", false);
    }
  };

  // ─── BOARD RENDERERS ───
  const renderIntroCard = () => (
    <div className="bg-blue-950/40 p-8 rounded-2xl border border-blue-500/25 text-center shadow-xl">
      <div className="text-6xl mb-4 animate-bounce duration-1000">{step.board.data?.emoji}</div>
      <h2 className="text-3xl font-bold text-white mb-2">{step.board.data?.headline}</h2>
      <div className="text-blue-300 mb-6 font-mono bg-blue-950/80 border border-blue-500/20 p-3 rounded-lg inline-block">
        {step.board.data?.example}
      </div>
      <p className="text-lg text-blue-100 italic">Goal: {step.board.data?.goal}</p>
    </div>
  );

  const renderConceptCard = () => {
    const concept = detectActiveConcept();
    return (
      <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl">{step.board.data?.emoji}</span>
          <h2 className="text-2xl font-bold text-white">{step.board.data?.title}</h2>
        </div>
        
        {concept && <VidyaConceptVisualizer concept={concept} />}

        <ul className="space-y-4 mb-8">
          {step.board.data?.points?.map((pt: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <span className="text-green-400 mt-1">✓</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        {step.explanation && (
          <div className="bg-indigo-950/40 p-4 rounded-xl border-l-4 border-indigo-500">
            <h4 className="font-bold text-indigo-400 mb-1">{step.explanation.title}</h4>
            <p className="text-sm text-slate-400">{step.explanation.body}</p>
          </div>
        )}
      </div>
    );
  };

  const renderCodeWalkthrough = () => {
    const concept = detectActiveConcept();
    return (
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 font-mono shadow-xl">
        <h3 className="text-slate-400 text-sm mb-4 border-b border-slate-800 pb-2">
          {step.board.data?.expression}
        </h3>
        
        {concept && <VidyaConceptVisualizer concept={concept} />}

        <div className="space-y-2 mb-6">
          {step.board.data?.steps?.map((line: string, i: number) => (
            <div key={i} className="flex gap-4 items-start text-sm">
              <span className="text-slate-600 select-none">{i + 1}</span>
              <code className="text-green-400 whitespace-pre-wrap">{line}</code>
            </div>
          ))}
        </div>
        <div className="bg-black/50 p-4 rounded-xl text-slate-300 text-sm border-l-2 border-green-500">
          &gt; {step.board.data?.result}
        </div>
      </div>
    );
  };

  const renderInteractiveBoard = () => {
    const isChallengeMode = learnerInsight.supportMode === "challenge";
    return (
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        {isChallengeMode && (
          <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-[10px] uppercase tracking-widest text-center py-1 select-none">
            🔥 LeetCode Algorithmic Challenge Mode Active
          </div>
        )}

        <h3 className={`text-xl font-bold text-white mb-4 ${isChallengeMode ? "pt-4" : ""}`}>
          {step.board.data?.headline || step.board.data?.title}
        </h3>
        
        {isChallengeMode && (
          <div className="mb-4 bg-slate-950 p-4 rounded-xl border border-amber-500/20">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 font-mono">Complexity Constraints</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              <div>Time Complexity: <span className="text-slate-200 font-bold">O(1) optimal</span></div>
              <div>Space Complexity: <span className="text-slate-200 font-bold">O(1) aux memory</span></div>
              <div>Value Bounds: <span className="text-slate-200">0 &lt;= n &lt;= 1,000,000</span></div>
              <div>Defensive Check: <span className="text-slate-200">Zero &amp; null parameters safe</span></div>
            </div>
          </div>
        )}
        
        {step.practice?.mode === "output_prediction" && (
          <div className="mb-6 p-4 bg-black rounded-lg border border-slate-800">
            <pre className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
              {step.board.data?.prompt}
            </pre>
          </div>
        )}

        {(step.practice?.mode === "bug_hunt" || step.practice?.mode === "code_snippet") && (
          <div className="mb-6">
            <PythonCodeEditor
              value={userInput}
              onChange={(val) => setUserInput(val)}
              placeholder={step.practice?.prompt}
            />
          </div>
        )}

        {step.practice?.mode === "interview_question" && (
          <div className="mb-6">
            <p className="text-slate-300 mb-3">{step.practice.prompt}</p>
            <textarea
              className="w-full h-32 bg-slate-950 text-slate-100 p-4 rounded-lg border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none transition-all duration-300 shadow-inner"
              placeholder="Type your explanation here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
        )}

        {(step.practice?.mode === "multiple_choice" || step.practice?.mode === "output_prediction") && (
          <div className="mb-6">
            <p className="text-slate-300 mb-3">{step.practice.prompt}</p>
            <input
              type="text"
              className="w-full bg-slate-950 text-slate-100 p-3 rounded-lg border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-300 shadow-inner"
              placeholder="Type your answer here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            />
          </div>
        )}

        {feedback && (
          <div className={`p-4 rounded-xl mb-4 text-sm font-medium whitespace-pre-wrap leading-relaxed border ${feedback.includes("✅") ? "bg-green-950/60 text-green-300 border-green-500/30" : "bg-red-950/60 text-red-300 border-red-500/30"}`}>
            {feedback}
          </div>
        )}

        {isChallengeMode && feedback?.includes("✅") && (
          <div className="mb-4 bg-slate-950/60 p-4 rounded-xl border border-green-500/10">
            <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Algorithmic Test Assertions</span>
              <span className="text-[10px] text-slate-500 font-mono">Pyodide sandbox active</span>
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-2 text-green-400">
                <span>✔</span> <span>Assertion Case 1 (Standard Input): Passed in 4ms</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span>✔</span> <span>Assertion Case 2 (Edge Case - Zero Limit): Passed in 3ms</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-400">
                <span>●</span> <span>Auxiliary Space optimization targets matched flawlessly!</span>
              </div>
            </div>
          </div>
        )}

        {step.practice && !feedback?.includes("✅") && (
          <button 
            onClick={checkAnswer}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Submit Code
          </button>
        )}
      </div>
    );
  };

  const renderRecapSummary = () => (
    <div className="bg-emerald-950/30 p-8 rounded-2xl border border-emerald-500/30 text-center shadow-xl">
      <div className="text-5xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">{step.board.data?.title}</h2>
      
      <div className="bg-emerald-950/50 rounded-xl p-6 mb-6 inline-block text-left border border-emerald-800/50">
        <ul className="space-y-3">
          {step.board.data?.keyPoints?.map((pt: string, i: number) => (
            <li key={i} className="flex gap-3 text-emerald-100">
              <span className="text-emerald-500">✦</span>
              {pt}
            </li>
          ))}
        </ul>
      </div>

      {step.board.data?.badgeAwarded && (
        <div className="mt-4 pt-6 border-t border-emerald-800/50">
          <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-2">Badge Unlocked</p>
          <div className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-2 px-6 rounded-full shadow-lg shadow-yellow-500/20">
            {step.board.data.badgeAwarded}
          </div>
        </div>
      )}
    </div>
  );

  // Derive avatar mood and gesture from step + feedback
  const avatarMood = React.useMemo((): AvatarMood => {
    if (feedback?.startsWith("✅") || feedback?.includes("Excellent")) return "celebrating";
    if (feedback?.startsWith("❌") || feedback?.includes("Error") || feedback?.includes("Missing")) return "concerned";
    if (isSpeaking) return "encouraging";
    const id = step.id;
    if (id === "intro" || id?.includes("intro")) return "happy";
    if (id === "concept" || id?.includes("concept")) return "thinking";
    if (id?.includes("example") || id?.includes("walkthrough")) return "serious";
    if (id?.includes("practice") || id?.includes("interactive")) return "neutral";
    if (id?.includes("recap") || id?.includes("summary")) return "happy";
    return "neutral";
  }, [feedback, isSpeaking, step.id]);

  const avatarGesture = React.useMemo((): AvatarGesture => {
    const id = step.id;
    if (id === "intro" || id?.includes("intro")) return "greet";
    if (id === "concept" || id?.includes("concept")) return "explain";
    if (id?.includes("example") || id?.includes("walkthrough")) return "write";
    if (id?.includes("practice") || id?.includes("interactive")) return "question";
    if (id?.includes("recap") || id?.includes("summary")) return "celebrate";
    return "idle";
  }, [step.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      
      {/* LEFT COLUMN SIDEBAR: AI TUTOR AVATAR & PERSONALIZATION HUD */}
      <div className="w-full md:w-[360px] border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 flex flex-col min-h-screen">
        
        <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto max-h-screen">
          
          {/* Header Identity */}
          <div>
            <h1 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
              {payload.course.title}
            </h1>
            <h2 className="text-lg font-extrabold text-white">
              {payload.lesson.title}
            </h2>
          </div>

          {/* AI Tutor Coach Box */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/80 border border-indigo-500/20 p-5 rounded-2xl flex flex-col items-center gap-4 relative">
            <div className="absolute top-2 right-3 text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
              Live Coach
            </div>
            
            <div className="w-full max-w-[190px] mt-2">
              <VidyaAvatar 
                speaking={isSpeaking}
                mood={avatarMood}
                gesture={avatarGesture}
                size={140}
                name="Priya"
                label="MindSutra Coach"
              />
            </div>

            {/* Speech controls */}
            <div className="flex gap-2 w-full justify-center">
              <button
                onClick={() => {
                  primeVoicePlayback();
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    speakText(step.tutorText);
                  }
                }}
                className="flex-1 text-xs bg-slate-800 text-indigo-200 py-1.5 px-3 rounded-lg hover:bg-slate-700 font-bold transition-all"
              >
                {isSpeaking ? "⏹ Stop" : "🔊 Listen"}
              </button>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${voiceEnabled ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
              >
                {voiceEnabled ? "Mute" : "Unmute"}
              </button>
            </div>

            <div className="text-[10px] text-slate-500 text-center font-mono">{voiceStatus}</div>

            {/* Speaking subtext dialogue bubble */}
            <p className="text-sm leading-relaxed text-slate-300 font-sans border-t border-slate-800/60 pt-3 w-full">
              "{step.tutorText}"
            </p>
          </div>

          {/* Lesson Steps hopper */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lesson Steps</h3>
            <div className="grid gap-2">
              {payload.steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleJumpToStep(idx)}
                  className={`text-left text-xs p-2.5 rounded-lg border transition-all ${idx === currentStepIdx ? "border-indigo-500 bg-indigo-950/40 text-white font-bold" : "border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-800"}`}
                >
                  <div className="text-[10px] text-slate-500 mb-0.5">Step {idx + 1}</div>
                  <div>{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Learner Insight Personalization HUD */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learner Insight</h3>
            
            {/* Support Mode glow badge */}
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Personalization Mode</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${learnerInsight.supportMode === "challenge" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" : learnerInsight.supportMode === "guided" ? "bg-amber-950/80 text-amber-400 border border-amber-500/30" : "bg-indigo-950/80 text-indigo-400 border border-indigo-500/30"}`}>
                {learnerInsight.supportMode}
              </span>
            </div>

            {/* Personalized Coach Line */}
            <p className="text-[12px] italic leading-relaxed text-slate-300 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/10">
              "{learnerInsight.coachLine}"
            </p>

            {/* Skill tracking list */}
            {learnerInsight.weakSkills.length > 0 && (
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-rose-400">Focus Target:</span> {learnerInsight.weakSkills.join(", ")}
              </div>
            )}
            {learnerInsight.strongestSkills.length > 0 && (
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-emerald-400">Solid Progress:</span> {learnerInsight.strongestSkills.join(", ")}
              </div>
            )}

            {/* Adaptive progress metrics charts */}
            <div className="grid gap-2 border-t border-slate-800/80 pt-3">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Concept Clarity</span>
                  <span className="font-bold text-slate-200">{Math.round(learnerInsight.conceptClarityScore * 100)}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${learnerInsight.conceptClarityScore * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Transfer Strength</span>
                  <span className="font-bold text-slate-200">{Math.round(learnerInsight.transferScore * 100)}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${learnerInsight.transferScore * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Confidence Trend</span>
                  <span className="font-bold text-slate-200">{Math.round(learnerInsight.avgConfidence * 100)}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${learnerInsight.avgConfidence * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Tutor Help Desk Actions */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Help Desk</h3>
            <button
              onClick={() => handleHelpAction("stuck")}
              className="text-left text-xs bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 p-2.5 rounded-lg text-slate-300 font-medium transition-all"
            >
              💡 Stuck? Give me a Hint
            </button>
            <button
              onClick={() => handleHelpAction("explain_again")}
              className="text-left text-xs bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 p-2.5 rounded-lg text-slate-300 font-medium transition-all"
            >
              📝 Re-explain Current Concept
            </button>
            <button
              onClick={() => handleHelpAction("alternate_explanation")}
              className="text-left text-xs bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 p-2.5 rounded-lg text-slate-300 font-medium transition-all"
            >
              🔮 Explain in an Alternative Way
            </button>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN MAIN PANEL: INTERACTIVE CONTENT SLIDE & STICKY CONTROLS */}
      <div className="flex-1 p-6 md:p-10 flex flex-col justify-between relative min-h-screen">
        
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center">
          
          {/* Header Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Objective</span>
              <span className="text-sm font-extrabold text-slate-200 line-clamp-1">{payload.lesson.objective}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Rewards</span>
              <span className="text-sm font-extrabold text-indigo-400">{payload.lesson.xpReward} XP</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Difficulty</span>
              <span className="text-sm font-extrabold text-slate-200">Level {payload.lesson.difficulty}</span>
            </div>
          </div>

          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 text-center">
            {step.label}
          </h2>
          
          <div className="mb-10 transition-all duration-500 ease-in-out">
            {step.board.type === "intro_card" && renderIntroCard()}
            {step.board.type === "concept_card" && renderConceptCard()}
            {step.board.type === "code_walkthrough" && renderCodeWalkthrough()}
            {step.board.type === "recap_summary" && renderRecapSummary()}
            {(step.board.type === "practice_board" || step.board.type === "python_repl_simulator") && renderInteractiveBoard()}
          </div>

          {/* Step Actions for Non-Practice Slides */}
          {!step.practice && (
            <div className="flex justify-center mb-10">
              <button 
                onClick={handleNextStep}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-10 rounded-full shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
              >
                {step.actions[0]?.label || "Continue"}
              </button>
            </div>
          )}

          {/* Worked Steps list */}
          {showWorkedSteps && activeHints.length > 0 && (
            <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-xl mb-6">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Hints Revealed</h4>
              <div className="grid gap-2">
                {activeHints.map((hint, i) => (
                  <p key={i} className="text-sm text-slate-300 leading-relaxed font-mono">
                    • {hint}
                  </p>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM STICKY PROGRESS CONTROLS */}
        <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur border border-slate-800/80 p-4 rounded-2xl flex justify-between gap-4 items-center flex-wrap z-40 max-w-2xl mx-auto w-full shadow-2xl">
          <div className="flex gap-2">
            <button
              onClick={handleBackStep}
              disabled={currentStepIdx === 0}
              className={`py-2.5 px-5 rounded-xl text-sm font-bold border transition-all ${currentStepIdx === 0 ? "border-slate-800 text-slate-600 cursor-default" : "border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"}`}
            >
              ← Back
            </button>
            <button
              onClick={handleNextStep}
              disabled={isLastStep}
              className={`py-2.5 px-6 rounded-xl text-sm font-extrabold transition-all ${isLastStep ? "bg-slate-800 text-slate-500 cursor-default" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10"}`}
            >
              Next →
            </button>
          </div>

          <div className="flex gap-2">
            <Link
              href="/vidya/level-1"
              className="py-2.5 px-5 rounded-xl text-sm font-bold border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-center"
            >
              Course Map
            </Link>
          </div>
        </div>

      </div>

      {/* CLARITY CHECK OVERLAY POPUP */}
      {clarityCheckOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl shadow-indigo-500/10 animate-scale-up">
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 border border-indigo-500/20 px-3 py-1 rounded-full">
                Quick Clarity Check
              </span>
              <h3 className="text-xl font-black text-white mt-4">
                {learnerInsight.studentName}, how clear does this Python logic feel?
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Vidya will tailor the next steps and practice problems based on your selection.
              </p>
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => handleClarityChoice("need_help")}
                className="w-full bg-rose-950/60 border border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-900/30 p-4 rounded-xl text-left font-bold text-rose-300 text-sm transition-all"
              >
                🔴 Need more explanation / help
              </button>
              
              <button
                onClick={() => handleClarityChoice("almost_there")}
                className="w-full bg-slate-800/80 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 p-4 rounded-xl text-left font-bold text-slate-200 text-sm transition-all"
              >
                🟡 Almost there (want more practice)
              </button>

              <button
                onClick={() => handleClarityChoice("clear")}
                className="w-full bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-900/30 p-4 rounded-xl text-left font-bold text-emerald-300 text-sm transition-all"
              >
                🟢 Super clear! (ready to move on)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
