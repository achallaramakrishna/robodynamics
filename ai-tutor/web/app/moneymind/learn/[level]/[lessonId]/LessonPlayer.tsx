"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import type { MoneyMindLessonPayload, MoneyMindLessonStep } from "@/lib/moneyMindLessonTypes";
import { getNextLessonId, MONEYMIND_LESSON_REGISTRY } from "@/lib/moneyMindLessonRegistry";
import AtmSimulator from "@/components/moneymind/AtmSimulator";
import UpiSimulator from "@/components/moneymind/UpiSimulator";
import BankPortal from "@/components/moneymind/BankPortal";
import PocketMoneyPlanner from "@/components/moneymind/PocketMoneyPlanner";
import PassbookViewer from "@/components/moneymind/PassbookViewer";
import { getBoardIllustration } from "@/components/moneymind/MoneyMindIllustrations";
import MoneyMindAvatar, { type MeeraMood, type MeeraGesture } from "./MoneyMindAvatar";

// ─── CSS keyframes ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes mmSlideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mmFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes mmPopIn    { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes mmShimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes mmConfetti { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(80px) rotate(540deg);opacity:0} }
  @keyframes mmCorrect  { 0%{transform:scale(1)} 30%{transform:scale(1.07)} 60%{transform:scale(.97)} 100%{transform:scale(1)} }
  @keyframes mmGlow     { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.35)} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0)} }
  @keyframes mmBoardIn  { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  .mm-board-enter { animation: mmBoardIn .42s cubic-bezier(.34,1.56,.64,1) both; }
  .mm-fade-in     { animation: mmFadeIn .35s ease both; }
  .mm-correct     { animation: mmCorrect .5s ease both; }
  .mm-glow        { animation: mmGlow 2s ease-in-out infinite; }
  .mm-shimmer {
    background: linear-gradient(90deg, #10B981 0%, #34D399 40%, #10B981 60%, #059669 100%);
    background-size: 200% 100%;
    animation: mmShimmer 2s linear infinite;
  }
`;

// ─── Board Renderer ───────────────────────────────────────────────────────────
function BoardCard({ step, stepKey }: { step: MoneyMindLessonStep; stepKey: number }) {
  const { type, data } = step.board;

  if (type === "intro_card" || type === "mission_card") {
    return (
      <div style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", border: "2px solid #3B82F6", borderRadius: 20, padding: "32px 28px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          {getBoardIllustration(type, data.headline ?? data.title, data.emoji)}
        </div>
        <div style={{ color: "#93C5FD", fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
          {type === "mission_card" ? "🎯 Mission" : "📚 Today's Lesson"}
        </div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 24, marginBottom: 12, lineHeight: 1.3 }}>{data.headline ?? data.title}</div>
        {data.example && <div style={{ background: "rgba(59,130,246,0.15)", border: "1px solid #3B82F6", borderRadius: 10, padding: "12px 16px", marginBottom: 12, color: "#93C5FD", fontSize: 14 }}>{data.example}</div>}
        {data.goal && <div style={{ color: "#D1FAE5", fontSize: 14, lineHeight: 1.6 }}>🏁 Goal: {data.goal}</div>}
        {data.scenario && <div style={{ color: "#FDE68A", fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>{data.scenario}</div>}
      </div>
    );
  }

  if (type === "concept_card") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #334155", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#F59E0B", fontWeight: 900, fontSize: 18, marginBottom: 16 }}>{data.emoji ?? "💡"} {data.title}</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
          {(data.points ?? data.concepts ?? []).map((pt: string, i: number) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, color: "#E2E8F0", fontSize: 14, lineHeight: 1.6 }}>
              <span style={{ color: "#10B981", fontWeight: 800, minWidth: 20 }}>→</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        {data.table && (
          <div style={{ marginTop: 16, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr>{data.table.headers.map((h: string) => <th key={h} style={{ background: "#334155", color: "#F59E0B", padding: "8px 12px", textAlign: "left", fontWeight: 700 }}>{h}</th>)}</tr></thead>
              <tbody>{data.table.rows.map((row: string[], ri: number) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "8px 12px", color: "#CBD5E1", borderBottom: "1px solid #334155" }}>{cell}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (type === "worked_example") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #8B5CF6", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#A78BFA", fontWeight: 900, fontSize: 16, marginBottom: 16 }}>🔢 Worked Example</div>
        {data.expression && <div style={{ background: "#0F172A", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontFamily: "monospace", color: "#FCD34D", fontSize: 18, textAlign: "center" }}>{data.expression}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(data.steps ?? []).map((s: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ background: "#8B5CF6", color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: "#E2E8F0", fontSize: 14 }}>{s}</span>
            </div>
          ))}
        </div>
        {data.result !== undefined && (
          <div style={{ marginTop: 16, background: "#064E3B", border: "1px solid #10B981", borderRadius: 10, padding: "12px 16px", color: "#6EE7B7", fontWeight: 800, fontSize: 16, textAlign: "center" }}>✓ Result: {data.result}</div>
        )}
      </div>
    );
  }

  if (type === "practice_board") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #F59E0B", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 16, marginBottom: 12 }}>✏️ {data.headline ?? "Practice Time"}</div>
        {data.prompt && <p style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>{data.prompt}</p>}
        {data.items && <ul style={{ margin: "12px 0 0", paddingLeft: 20 }}>{data.items.map((item: string, i: number) => <li key={i} style={{ color: "#E2E8F0", fontSize: 14, marginBottom: 8 }}>{item}</li>)}</ul>}
      </div>
    );
  }

  if (type === "scam_detector") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #EF4444", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#FCA5A5", fontWeight: 900, fontSize: 16, marginBottom: 16 }}>🚨 Scam or Safe?</div>
        {(data.scenarios ?? []).map((sc: any, i: number) => (
          <div key={i} style={{ background: "#0F172A", borderRadius: 10, padding: "14px", marginBottom: 10, border: `1px solid ${sc.isScam ? "#EF4444" : "#10B981"}` }}>
            <div style={{ color: "#E2E8F0", fontSize: 13, marginBottom: 6 }}>{sc.message}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: sc.isScam ? "#EF4444" : "#10B981" }}>{sc.isScam ? "🚫 SCAM" : "✅ SAFE"} — {sc.reason}</div>
          </div>
        ))}
        {data.scenario && <div style={{ background: "#0F172A", borderRadius: 10, padding: "14px", color: "#FDE68A", fontSize: 14 }}>{data.scenario}</div>}
      </div>
    );
  }

  if (type === "budget_planner" || type === "shopping_simulation") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #10B981", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 16, marginBottom: 16 }}>{type === "budget_planner" ? "💰 Budget Planner" : "🛒 Shopping Challenge"}</div>
        {data.budget !== undefined && (
          <div style={{ background: "#064E3B", borderRadius: 10, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#A7F3D0", fontSize: 13 }}>Total Budget</span>
            <span style={{ color: "#6EE7B7", fontWeight: 800, fontSize: 18 }}>₹{data.budget}</span>
          </div>
        )}
        {(data.items ?? data.categories ?? []).map((item: any, i: number) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #334155" }}>
            <span style={{ color: "#CBD5E1", fontSize: 13 }}>{item.name ?? item.category ?? item}</span>
            {item.cost !== undefined && <span style={{ color: "#FCD34D", fontWeight: 700, fontSize: 13 }}>₹{item.cost}</span>}
          </div>
        ))}
        {data.challenge && <div style={{ marginTop: 14, background: "rgba(245,158,11,0.1)", border: "1px solid #F59E0B", borderRadius: 8, padding: "10px 14px", color: "#FDE68A", fontSize: 13 }}>Challenge: {data.challenge}</div>}
      </div>
    );
  }

  if (type === "recap_summary") {
    return (
      <div style={{ background: "linear-gradient(135deg,#1E293B,#0F172A)", border: "2px solid #10B981", borderRadius: 20, padding: "28px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <div style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 20, marginBottom: 16 }}>{data.title ?? "Lesson Complete!"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "left" }}>
          {(data.keyPoints ?? data.points ?? []).map((pt: string, i: number) => (
            <div key={i} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "10px 12px", color: "#A7F3D0", fontSize: 12, lineHeight: 1.5 }}>✓ {pt}</div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "atm_simulator")       return <div style={{ display: "flex", justifyContent: "center" }}><AtmSimulator userId={101} /></div>;
  if (type === "upi_simulator")       return <div style={{ display: "flex", justifyContent: "center" }}><UpiSimulator userId={101} /></div>;
  if (type === "bank_simulator")      return <BankPortal userId={101} />;
  if (type === "pocket_money_planner") return <PocketMoneyPlanner />;
  if (type === "passbook_viewer")     return <PassbookViewer />;

  return (
    <div style={{ background: "#1E293B", borderRadius: 20, padding: "28px 24px", color: "#CBD5E1", fontSize: 14, lineHeight: 1.7 }}>
      {data.headline && <div style={{ color: "#F59E0B", fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{data.headline}</div>}
      {data.prompt && <p style={{ margin: 0 }}>{data.prompt}</p>}
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({ lesson, step, onClose }: { lesson: MoneyMindLessonPayload; step: MoneyMindLessonStep; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: `Hi! I'm Meera 👋 We're on "${step.label}". What's your question?` },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const send = async () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setHistory(h => [...h, { role: "user", text: q }]);
    setLoading(true);
    try {
      const resp = await fetch("/api/moneymind/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.lesson.id, lessonTitle: lesson.lesson.title,
          stepLabel: step.label, stepTutorText: step.tutorText, question: q,
          history: history.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
        }),
      });
      const data = await resp.json();
      setHistory(h => [...h, { role: "ai", text: data.reply ?? "Let me think about that…" }]);
    } catch {
      setHistory(h => [...h, { role: "ai", text: "Network error. Please try again!" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "min(380px,100vw)", background: "#0F172A", borderLeft: "1px solid #1E3A5F", display: "flex", flexDirection: "column", zIndex: 200, boxShadow: "-8px 0 24px rgba(0,0,0,0.4)" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>🤖 Ask Meera</div>
          <div style={{ color: "#64748B", fontSize: 11 }}>AI Tutor — {lesson.lesson.title}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 20 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: 14, background: m.role === "user" ? "#3B82F6" : "#1E293B", color: m.role === "user" ? "#fff" : "#E2E8F0", fontSize: 13, lineHeight: 1.6, borderTopRightRadius: m.role === "user" ? 4 : 14, borderTopLeftRadius: m.role === "ai" ? 4 : 14 }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ background: "#1E293B", borderRadius: 14, padding: "10px 14px", color: "#64748B", fontSize: 13 }}>Meera is thinking…</div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1E293B", display: "flex", gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask anything…" style={{ flex: 1, background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px", color: "#F1F5F9", fontSize: 13, outline: "none" }} />
        <button onClick={send} disabled={loading || !input.trim()} style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1, fontSize: 13 }}>Send</button>
      </div>
    </div>
  );
}

// ─── Course content sidebar: all 6 levels × 4 lessons ────────────────────────
const LEVEL_META: { slug: string; label: string; levelId: string }[] = [
  { slug: "level-1", label: "Level 1 — My First Money World", levelId: "L1" },
  { slug: "level-2", label: "Level 2 — Earning & Saving",     levelId: "L2" },
  { slug: "level-3", label: "Level 3 — Smart Spending",       levelId: "L3" },
  { slug: "level-4", label: "Level 4 — Banking Basics",       levelId: "L4" },
  { slug: "level-5", label: "Level 5 — Digital Money",        levelId: "L5" },
  { slug: "level-6", label: "Level 6 — Money Mindset",        levelId: "L6" },
];

function CourseContentList({ currentLessonId, currentLevelSlug, green }: {
  currentLessonId: string;
  currentLevelSlug: string;
  green: string;
}) {
  const [openLevel, setOpenLevel] = useState<string>(currentLevelSlug);

  // Group registry by level
  const grouped = useMemo(() => {
    const map: Record<string, { id: string; title: string; slug: string }[]> = {};
    Object.entries(MONEYMIND_LESSON_REGISTRY).forEach(([id, payload]) => {
      const slug = payload.course.levelSlug;
      if (!map[slug]) map[slug] = [];
      map[slug].push({ id, title: payload.lesson.title, slug });
    });
    return map;
  }, []);

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>
        Course Content
      </div>
      {LEVEL_META.map(({ slug, label }) => {
        const isOpen    = openLevel === slug;
        const lessons   = grouped[slug] ?? [];
        const isCurrent = slug === currentLevelSlug;
        return (
          <div key={slug} style={{ borderBottom: "1px solid #F1F5F9" }}>
            {/* Level header */}
            <button
              onClick={() => setOpenLevel(isOpen ? "" : slug)}
              style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", background: isCurrent ? "#F0FDF4" : "#FAFAFA",
                border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: isCurrent ? "#065F46" : "#1E293B" }}>{label}</span>
              <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>{isOpen ? "▲" : "▼"}</span>
            </button>
            {/* Lessons list */}
            {isOpen && (
              <div style={{ background: "#FFFFFF" }}>
                {lessons.map((ls, i) => {
                  const isActiveLesson = ls.id === currentLessonId;
                  return (
                    <Link
                      key={ls.id}
                      href={`/moneymind/learn/${slug}/${ls.id}`}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 20px",
                        background: isActiveLesson ? "#ECFDF5" : "transparent",
                        borderLeft: isActiveLesson ? `3px solid ${green}` : "3px solid transparent",
                        textDecoration: "none",
                        borderBottom: "1px solid #F8FAFC",
                      }}
                    >
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        background: isActiveLesson ? green : "#E2E8F0",
                        color: isActiveLesson ? "#fff" : "#64748B",
                        fontSize: 11, fontWeight: 800,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{i + 1}</span>
                      <span style={{ fontSize: 13, fontWeight: isActiveLesson ? 700 : 500, color: isActiveLesson ? "#065F46" : "#334155", lineHeight: 1.4 }}>
                        {ls.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main LessonPlayer ────────────────────────────────────────────────────────
export default function LessonPlayer({ lesson, userId = 101 }: { lesson: MoneyMindLessonPayload; userId?: number }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [numericAnswer, setNumericAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [checked, setChecked] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState(1280);

  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechKeyRef = useRef(0);

  const step      = lesson.steps[stepIndex];
  const totalSteps = lesson.steps.length;
  const isLastStep = stepIndex === totalSteps - 1;
  const hasPractice = !!step.practice;
  const needsCheck  = hasPractice && !checked;
  const nextLesson  = getNextLessonId(lesson.lesson.id);
  const progress    = ((stepIndex + 1) / totalSteps) * 100;
  const isNarrow    = viewportWidth < 1024;

  // ── Avatar mood / gesture ─────────────────────────────────────────────────
  const avatarMood = useMemo((): MeeraMood => {
    if (feedback?.correct) return "celebrating";
    if (feedback && !feedback.correct) return "concerned";
    if (isSpeaking) return "encouraging";
    const id = step.id;
    if (id === "intro" || id === "intro_card") return "happy";
    if (id === "concept") return "thinking";
    if (id === "worked_example") return "serious";
    if (id === "practice" || id === "practice_board") return "neutral";
    if (id === "recap" || id === "recap_summary") return "happy";
    return "neutral";
  }, [feedback, isSpeaking, step.id]);

  const avatarGesture = useMemo((): MeeraGesture => {
    const id = step.id;
    if (id === "intro" || id === "intro_card") return "greet";
    if (id === "concept") return "explain";
    if (id === "worked_example") return "write";
    if (id === "practice" || id === "practice_board") return "question";
    if (id === "recap" || id === "recap_summary") return "celebrate";
    return "explain";
  }, [step.id]);

  // ── Viewport ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setViewportWidth(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // ── Keyboard nav ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key === "ArrowLeft" && stepIndex > 0) moveToStep(stepIndex - 1);
      if (e.key === "ArrowRight" && !isLastStep && !needsCheck) moveToStep(stepIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, isLastStep, needsCheck]);

  // ── Voice ─────────────────────────────────────────────────────────────────
  function stopSpeaking() {
    speechKeyRef.current += 1;
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.src = "";
      activeAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  function speakWithBrowser(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const speak = () => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-IN"; utter.rate = 1.05; utter.pitch = 1.1;
      const voices = window.speechSynthesis.getVoices();
      const pick =
        voices.find(v => /google.*en.*in/i.test(v.name)) ||
        voices.find(v => /microsoft.*neerja|heera|ravi/i.test(v.name)) ||
        voices.find(v => v.lang === "en-IN") ||
        voices.find(v => /female|samantha|zira|aria/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith("en"));
      if (pick) utter.voice = pick;
      utter.onstart = () => { setIsSpeaking(true); setVoiceStatus("Playing…"); };
      utter.onend   = () => { setIsSpeaking(false); setVoiceStatus("Ready"); };
      utter.onerror = () => { setIsSpeaking(false); };
      window.speechSynthesis.speak(utter);
    };
    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length > 0) { speak(); }
    else { window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; speak(); }; setTimeout(speak, 250); }
  }

  async function speakText(text: string) {
    const clean = text.trim();
    if (!clean || !voiceEnabled) return;
    stopSpeaking();
    const myKey = speechKeyRef.current;
    try {
      setVoiceStatus("Preparing…");
      const resp = await fetch("/api/voice/tts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, avatarId: "priya", pace: 0.98 }),
      });
      const data = await resp.json().catch(() => null);
      if (myKey !== speechKeyRef.current) return;
      if (resp.ok && data?.audioBase64) {
        const audio = new Audio(`data:${data.mimeType ?? "audio/wav"};base64,${data.audioBase64}`);
        activeAudioRef.current = audio;
        audio.onplaying = () => { if (myKey === speechKeyRef.current) { setIsSpeaking(true); setVoiceStatus("Playing…"); } };
        audio.onended  = () => { if (myKey === speechKeyRef.current) { setIsSpeaking(false); setVoiceStatus("Ready"); } };
        audio.onerror  = () => { if (myKey === speechKeyRef.current) { setIsSpeaking(false); speakWithBrowser(clean); } };
        await audio.play();
        return;
      }
      speakWithBrowser(clean);
    } catch { if (myKey === speechKeyRef.current) speakWithBrowser(clean); }
  }

  // Auto-speak on step change
  useEffect(() => {
    setFeedback(null); setChecked(false); setSelectedAnswer(null); setNumericAnswer("");
    if (voiceEnabled) void speakText(step.tutorText);
    else stopSpeaking();
    return () => { stopSpeaking(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  useEffect(() => {
    if (!voiceEnabled) { stopSpeaking(); setVoiceStatus("Muted"); }
    else setVoiceStatus("Ready");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled]);

  // ── Navigation ────────────────────────────────────────────────────────────
  function moveToStep(idx: number) {
    setStepIndex(Math.max(0, Math.min(totalSteps - 1, idx)));
    setFeedback(null); setChecked(false); setSelectedAnswer(null); setNumericAnswer("");
  }

  const checkAnswer = () => {
    if (!step.practice) return;
    const ans = step.practice.mode === "numeric" ? numericAnswer : selectedAnswer;
    const correct = step.practice.mode === "numeric"
      ? Math.abs(Number(ans) - Number(step.practice.answer)) < 0.01
      : String(ans).toLowerCase() === String(step.practice.answer).toLowerCase();
    setFeedback({ correct, message: correct ? `Correct! 🎉 ${step.practice.hints?.[0] ?? ""}` : `Not quite. The answer is: ${step.practice.answer}` });
    setChecked(true);
    if (voiceEnabled) void speakText(correct ? "Excellent work! That is correct." : "Not quite — let me explain the answer.");
  };

  const advance = async () => {
    if (isLastStep) {
      setFinishing(true);
      await fetch("/api/moneymind/progress/complete", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, lesson_id: lesson.lesson.id, level_id: lesson.course.levelId, xp_earned: lesson.lesson.xpReward }),
      }).catch(() => {});
      if (!nextLesson) window.location.href = `/moneymind/level-complete?level=${lesson.course.levelId}`;
      else window.location.href = `/moneymind/learn/${lesson.course.levelSlug}/${nextLesson}`;
      return;
    }
    moveToStep(stepIndex + 1);
  };

  const C = {
    sidebarBg: "#FFFFFF",
    headerBg: "#065F46",
    avatarCard: "linear-gradient(160deg, #064E3B, #065F46, #047857)",
    mainBg: "#F8FAFC",
    dark: "#0F172A",
    green: "#10B981",
    accent: "#F59E0B",
  };

  return (
    <main style={{ minHeight: "100vh", background: C.mainBg, color: C.dark, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Top header ────────────────────────────────────────────────────── */}
      <header style={{ background: C.headerBg, color: "#F8FAFC", padding: "14px 24px", position: "sticky", top: 0, zIndex: 110, borderBottom: "1px solid #064E3B" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, color: "#A7F3D0", textTransform: "uppercase", letterSpacing: 1.1 }}>{lesson.course.title}</div>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{lesson.lesson.title}</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ background: "#F1F5F9", borderRadius: 100, height: 6, width: 160, overflow: "hidden" }}>
              <div className="mm-shimmer" style={{ height: "100%", width: `${progress}%`, transition: "width .5s", borderRadius: 100 }} />
            </div>
            <button onClick={() => setVoiceEnabled(v => !v)} style={{ border: "1px solid rgba(255,255,255,0.3)", background: voiceEnabled ? "rgba(255,255,255,0.15)" : "transparent", color: "#F8FAFC", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
              {voiceEnabled ? "🔊 Voice on" : "🔇 Voice off"}
            </button>
            <Link href={`/moneymind/course/${lesson.course.levelSlug}`} style={{ color: "#D1FAE5", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>← Course</Link>
          </div>
        </div>
      </header>

      {/* ── Two-panel layout ──────────────────────────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "320px minmax(0,1fr)", minHeight: "calc(100vh - 68px)" }}>

        {/* ──────────── LEFT SIDEBAR ──────────── */}
        <aside style={{ background: C.sidebarBg, borderRight: "1px solid #E2E8F0", padding: 20, display: "grid", alignContent: "start", gap: 16, position: isNarrow ? "static" : "sticky", top: 68, height: isNarrow ? "auto" : "calc(100vh - 68px)", overflowY: "auto" }}>

          {/* Avatar card */}
          <div style={{ background: C.avatarCard, borderRadius: 18, padding: 18, color: "#FFFFFF" }}>
            <div style={{ fontSize: 11, color: "#A7F3D0", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 10 }}>MoneyMind Coach</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MoneyMindAvatar speaking={isSpeaking} mood={avatarMood} gesture={avatarGesture} size={isNarrow ? 120 : 155} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => isSpeaking ? stopSpeaking() : void speakText(step.tutorText)}
                style={{ flex: 1, border: "none", background: "#F8FAFC", color: "#065F46", borderRadius: 10, padding: "10px 12px", cursor: "pointer", fontWeight: 800, fontSize: 12 }}
              >
                {isSpeaking ? "⏹ Stop" : "▶ Listen"}
              </button>
              <button
                onClick={() => setVoiceEnabled(v => !v)}
                style={{ border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#F8FAFC", borderRadius: 10, padding: "10px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}
              >
                {voiceEnabled ? "Mute" : "Unmute"}
              </button>
            </div>
            {voiceStatus && <div style={{ marginTop: 8, fontSize: 11, color: "#A7F3D0" }}>{voiceStatus}</div>}
            <div key={`speech-${stepIndex}`} className="mm-fade-in" style={{ marginTop: 14, fontSize: 13, lineHeight: 1.75, color: "#D1FAE5" }}>
              {step.tutorText}
            </div>
          </div>

          {/* Full course content — all levels & lessons */}
          <CourseContentList currentLessonId={lesson.lesson.id} currentLevelSlug={lesson.course.levelSlug} green={C.green} />

          {/* Ask Meera */}
          <button
            onClick={() => setChatOpen(c => !c)}
            style={{ background: chatOpen ? C.green : "#065F46", color: "#FFFFFF", border: "none", borderRadius: 14, padding: "14px 16px", fontWeight: 800, fontSize: 14, cursor: "pointer", textAlign: "left" }}
          >
            🤖 Ask Meera →
            <div style={{ fontSize: 11, fontWeight: 400, color: "#A7F3D0", marginTop: 2 }}>Ask any question about this lesson</div>
          </button>
        </aside>

        {/* ──────────── RIGHT MAIN ──────────── */}
        <section style={{ padding: "24px 28px", display: "grid", alignContent: "start", gap: 18, paddingBottom: 48 }}>

          {/* Meta row */}
          <div style={{ display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "minmax(0,1fr) 130px 130px", gap: 12 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Objective</div>
              <div style={{ fontWeight: 800, fontSize: 18, marginTop: 4, lineHeight: 1.3 }}>{lesson.lesson.objective ?? lesson.lesson.title}</div>
            </div>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>XP Reward</div>
              <div style={{ fontWeight: 800, fontSize: 22, color: C.accent, marginTop: 4 }}>+{lesson.lesson.xpReward}</div>
            </div>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Progress</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginTop: 4, color: C.green }}>{stepIndex + 1} / {totalSteps}</div>
            </div>
          </div>

          {/* Step dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            {lesson.steps.map((_, i) => (
              <div key={i} onClick={() => moveToStep(i)} style={{
                width: i === stepIndex ? 24 : 8, height: 8, borderRadius: 4,
                background: i < stepIndex ? C.green : i === stepIndex ? "#065F46" : "#CBD5E1",
                transition: "all 0.35s", cursor: "pointer",
              }} />
            ))}
          </div>

          {/* Step label */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#065F46", borderRadius: 100, padding: "5px 20px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
              {step.label}
            </span>
          </div>

          {/* Board */}
          <div key={`board-${stepIndex}`} className="mm-board-enter">
            {!["atm_simulator","upi_simulator","bank_simulator","pocket_money_planner","passbook_viewer"].includes(step.board.type) && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: -14, position: "relative", zIndex: 2 }}>
                {getBoardIllustration(step.board.type, step.board.data.headline ?? step.board.data.title, step.board.data.emoji)}
              </div>
            )}
            <BoardCard step={step} stepKey={stepIndex} />
          </div>

          {/* Explanation */}
          {step.explanation && (
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: "14px 18px" }}>
              <div style={{ color: "#B45309", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💡 {step.explanation.title}</div>
              <div style={{ color: "#78350F", fontSize: 13, lineHeight: 1.6 }}>{step.explanation.body}</div>
              {step.explanation.mistakeTip && (
                <div style={{ marginTop: 10, background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 12px", color: "#991B1B", fontSize: 12 }}>
                  ⚠️ {step.explanation.mistakeTip}
                </div>
              )}
            </div>
          )}

          {/* Practice */}
          {hasPractice && step.practice && (
            <div style={{ background: "#FFFFFF", border: `2px solid ${checked ? (feedback?.correct ? C.green : "#EF4444") : "#CBD5E1"}`, borderRadius: 18, padding: "22px 20px" }}>
              <div style={{ color: "#065F46", fontWeight: 800, fontSize: 13, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>✏️ Quick Check</div>
              <p style={{ color: "#0F172A", fontSize: 15, fontWeight: 600, marginBottom: 18, lineHeight: 1.5 }}>{step.practice.prompt}</p>

              {step.practice.mode === "mcq" && step.practice.options && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {step.practice.options.map((opt, i) => {
                    const isSel   = selectedAnswer === opt;
                    const isRight = checked && opt === String(step.practice!.answer);
                    const isWrong = checked && isSel && !isRight;
                    return (
                      <button
                        key={i}
                        onClick={() => !checked && setSelectedAnswer(opt)}
                        style={{
                          background: isRight ? "#F0FDF4" : isWrong ? "#FEF2F2" : isSel ? "#EFF6FF" : "#F8FAFC",
                          border: `2px solid ${isRight ? C.green : isWrong ? "#EF4444" : isSel ? "#3B82F6" : "#E2E8F0"}`,
                          borderRadius: 12, padding: "12px 14px", color: "#0F172A", fontSize: 13,
                          fontWeight: isSel ? 700 : 400, cursor: checked ? "default" : "pointer",
                          textAlign: "left", transition: "all 0.15s",
                        }}
                      >
                        {isRight ? "✓ " : isWrong ? "✗ " : ""}{opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {(step.practice.mode === "numeric" || step.practice.mode === "text") && (
                <div style={{ marginBottom: 16 }}>
                  <input
                    type={step.practice.mode === "numeric" ? "number" : "text"}
                    value={numericAnswer}
                    onChange={e => !checked && setNumericAnswer(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !checked && checkAnswer()}
                    placeholder={step.practice.mode === "numeric" ? "Enter your answer" : "Type your answer…"}
                    style={{ width: "100%", background: "#F8FAFC", border: `2px solid ${checked ? (feedback?.correct ? C.green : "#EF4444") : "#E2E8F0"}`, borderRadius: 12, padding: "12px 16px", color: "#0F172A", fontSize: 16, fontWeight: 700, outline: "none", boxSizing: "border-box", transition: "border-color .2s" }}
                    onFocus={e => { if (!checked) e.currentTarget.style.borderColor = C.green; }}
                    onBlur={e => { if (!checked) e.currentTarget.style.borderColor = "#E2E8F0"; }}
                  />
                </div>
              )}

              {feedback && (
                <div className={feedback.correct ? "mm-correct" : "mm-fade-in"} style={{
                  background: feedback.correct ? "#F0FDF4" : "#FEF2F2",
                  border: `1px solid ${feedback.correct ? C.green : "#FCA5A5"}`,
                  borderRadius: 12, padding: "14px 16px",
                  color: feedback.correct ? "#065F46" : "#991B1B",
                  fontSize: 14, fontWeight: 700, marginBottom: 12,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 22 }}>{feedback.correct ? "🎉" : "💡"}</span>
                  <span>{feedback.message}</span>
                </div>
              )}

              {feedback?.correct && (
                <div style={{ position: "relative", height: 0, overflow: "visible", pointerEvents: "none" }}>
                  {["#F59E0B","#10B981","#3B82F6","#EF4444","#8B5CF6","#FCD34D"].map((color, i) => (
                    <div key={i} style={{ position: "absolute", top: -20, left: `${15 + i * 13}%`, width: 8, height: 8, background: color, borderRadius: i % 2 === 0 ? "50%" : 2, animation: `mmConfetti ${0.8 + i * 0.1}s ease-out ${i * 0.07}s both` }} />
                  ))}
                </div>
              )}

              {!checked && (
                <button
                  onClick={checkAnswer}
                  disabled={!selectedAnswer && !numericAnswer}
                  style={{ background: C.green, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 800, fontSize: 14, cursor: "pointer", opacity: (!selectedAnswer && !numericAnswer) ? 0.5 : 1, boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
                >
                  Check Answer
                </button>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
            <button
              onClick={() => moveToStep(stepIndex - 1)}
              disabled={stepIndex === 0}
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#64748B", borderRadius: 12, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: stepIndex === 0 ? "not-allowed" : "pointer", opacity: stepIndex === 0 ? 0.4 : 1 }}
            >
              ← Prev
            </button>

            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>Step {stepIndex + 1} of {totalSteps}</div>

            <button
              onClick={advance}
              disabled={needsCheck || finishing}
              style={{
                background: isLastStep ? `linear-gradient(90deg, #FCD34D, ${C.accent})` : C.green,
                color: isLastStep ? "#451A03" : "#fff",
                border: "none", borderRadius: 12, padding: "12px 28px",
                fontWeight: 900, fontSize: 14,
                cursor: (needsCheck || finishing) ? "not-allowed" : "pointer",
                opacity: (needsCheck || finishing) ? 0.5 : 1,
                boxShadow: needsCheck ? "none" : isLastStep ? "0 4px 12px rgba(245,158,11,0.4)" : "0 4px 12px rgba(16,185,129,0.3)",
              }}
            >
              {finishing ? "Saving…" : isLastStep ? "🏆 Complete Lesson" : "Next →"}
            </button>
          </div>
        </section>
      </section>

      {chatOpen && <ChatPanel lesson={lesson} step={step} onClose={() => setChatOpen(false)} />}
    </main>
  );
}
