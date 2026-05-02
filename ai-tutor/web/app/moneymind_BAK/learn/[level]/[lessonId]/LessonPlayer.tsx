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
import { StepVisual } from "./MoneyMindVisuals";
import { StepComic } from "./MoneyMindComics";

// ─── CSS keyframes ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  body, * { box-sizing: border-box; }
  @keyframes mmSlideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mmFadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes mmPopIn    { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes mmShimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes mmConfetti { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(80px) rotate(540deg);opacity:0} }
  @keyframes mmCoinFly  { 0%{transform:translate(0,0) scale(1);opacity:1} 60%{opacity:1} 100%{transform:translate(var(--cx),var(--cy)) scale(.4);opacity:0} }
  @keyframes mmCoinPop  { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.2) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes mmCounter  { 0%{transform:scale(1)} 30%{transform:scale(1.4)} 100%{transform:scale(1)} }
  @keyframes mmStreak   { 0%{transform:scale(.4) translateY(10px);opacity:0} 60%{transform:scale(1.15) translateY(-4px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
  @keyframes mmCorrect  { 0%{transform:scale(1)} 30%{transform:scale(1.07)} 60%{transform:scale(.97)} 100%{transform:scale(1)} }
  @keyframes mmGlow     { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.35)} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0)} }
  @keyframes mmBoardIn  { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes mmWipeLeft  { from{opacity:0;transform:translateX(50px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes mmWipeRight { from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
  .mm-board-enter { animation: mmBoardIn .42s cubic-bezier(.34,1.56,.64,1) both; }
  .mm-fade-in     { animation: mmFadeIn .35s ease both; }
  .mm-correct     { animation: mmCorrect .5s ease both; }
  .mm-glow        { animation: mmGlow 2s ease-in-out infinite; }
  .mm-wipe-forward { animation: mmWipeLeft  .35s cubic-bezier(.25,.46,.45,.94) both; }
  .mm-wipe-back    { animation: mmWipeRight .35s cubic-bezier(.25,.46,.45,.94) both; }
  .mm-shimmer {
    background: linear-gradient(90deg, #10B981 0%, #34D399 40%, #10B981 60%, #059669 100%);
    background-size: 200% 100%;
    animation: mmShimmer 2s linear infinite;
  }
`;

// ─── Per-level color palette ──────────────────────────────────────────────────
const LEVEL_PALETTE: Record<string, { primary: string; light: string; bg: string; headerBg: string; shimmer: string }> = {
  "level-1": { primary: "#F59E0B", light: "#FEF3C7", bg: "#FFFBEB", headerBg: "#92400E", shimmer: "linear-gradient(90deg,#F59E0B,#FCD34D,#F59E0B)" },
  "level-2": { primary: "#3B82F6", light: "#DBEAFE", bg: "#EFF6FF", headerBg: "#1E3A8A", shimmer: "linear-gradient(90deg,#3B82F6,#93C5FD,#3B82F6)" },
  "level-3": { primary: "#8B5CF6", light: "#EDE9FE", bg: "#F5F3FF", headerBg: "#4C1D95", shimmer: "linear-gradient(90deg,#8B5CF6,#C4B5FD,#8B5CF6)" },
  "level-4": { primary: "#F97316", light: "#FFEDD5", bg: "#FFF7ED", headerBg: "#7C2D12", shimmer: "linear-gradient(90deg,#F97316,#FED7AA,#F97316)" },
  "level-5": { primary: "#14B8A6", light: "#CCFBF1", bg: "#F0FDFA", headerBg: "#134E4A", shimmer: "linear-gradient(90deg,#14B8A6,#99F6E4,#14B8A6)" },
  "level-6": { primary: "#D97706", light: "#FDE68A", bg: "#FFFBEB", headerBg: "#78350F", shimmer: "linear-gradient(90deg,#D97706,#FCD34D,#D97706)" },
};

// ─── Board Renderer ───────────────────────────────────────────────────────────
function BoardCard({ step, stepKey }: { step: MoneyMindLessonStep; stepKey: number }) {
  const { type, data } = step.board;

  const renderVisual = () => {
    const v = data.visual || data.assetPath;
    if (!v) return null;
    return (
      <div style={{ marginTop: 20, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
        <img src={v} alt="Visual" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    );
  };

  if (type === "intro_card" || type === "mission_card") {
    return (
      <div style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", border: "2px solid #3B82F6", borderRadius: 20, padding: "32px 28px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          {getBoardIllustration(type, data.headline ?? data.title, data.emoji)}
        </div>
        <div style={{ color: "#93C5FD", fontSize: 13, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
          {type === "mission_card" ? "🎯 Mission" : "📚 Today's Lesson"}
        </div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 28, marginBottom: 12, lineHeight: 1.3 }}>{data.headline ?? data.title}</div>
        {data.example && <div style={{ background: "rgba(59,130,246,0.15)", border: "1px solid #3B82F6", borderRadius: 10, padding: "12px 16px", marginBottom: 12, color: "#93C5FD", fontSize: 17 }}>{data.example}</div>}
        {data.goal && <div style={{ color: "#D1FAE5", fontSize: 17, lineHeight: 1.6 }}>🏁 Goal: {data.goal}</div>}
        {data.scenario && <div style={{ color: "#FDE68A", fontSize: 17, lineHeight: 1.6, marginTop: 8 }}>{data.scenario}</div>}
        {renderVisual()}
      </div>
    );
  }

  if (type === "concept_card") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #334155", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#F59E0B", fontWeight: 900, fontSize: 22, marginBottom: 16 }}>{data.emoji ?? "💡"} {data.title}</div>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
          {(data.points ?? data.concepts ?? []).map((pt: string, i: number) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, color: "#E2E8F0", fontSize: 16, lineHeight: 1.6 }}>
              <span style={{ color: "#10B981", fontWeight: 800, minWidth: 20 }}>→</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        {data.table && (
          <div style={{ marginTop: 16, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
              <thead><tr>{data.table.headers.map((h: string) => <th key={h} style={{ background: "#334155", color: "#F59E0B", padding: "8px 12px", textAlign: "left", fontWeight: 700 }}>{h}</th>)}</tr></thead>
              <tbody>{data.table.rows.map((row: string[], ri: number) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci} style={{ padding: "8px 12px", color: "#CBD5E1", borderBottom: "1px solid #334155" }}>{cell}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {renderVisual()}
      </div>
    );
  }

  if (type === "worked_example") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #8B5CF6", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#A78BFA", fontWeight: 900, fontSize: 22, marginBottom: 16 }}>🔢 Worked Example</div>
        {data.expression && <div style={{ background: "#0F172A", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontFamily: "monospace", color: "#FCD34D", fontSize: 18, textAlign: "center" }}>{data.expression}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(data.steps ?? []).map((s: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ background: "#8B5CF6", color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: "#E2E8F0", fontSize: 16 }}>{s}</span>
            </div>
          ))}
        </div>
        {data.result !== undefined && (
          <div style={{ marginTop: 16, background: "#064E3B", border: "1px solid #10B981", borderRadius: 10, padding: "12px 16px", color: "#6EE7B7", fontWeight: 800, fontSize: 16, textAlign: "center" }}>✓ Result: {data.result}</div>
        )}
        {renderVisual()}
      </div>
    );
  }

  if (type === "practice_board") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #F59E0B", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 22, marginBottom: 12 }}>✏️ {data.headline ?? "Practice Time"}</div>
        {data.prompt && <p style={{ color: "#CBD5E1", fontSize: 18, lineHeight: 1.6, marginBottom: 0 }}>{data.prompt}</p>}
        {data.items && <ul style={{ margin: "12px 0 0", paddingLeft: 20 }}>{data.items.map((item: string, i: number) => <li key={i} style={{ color: "#E2E8F0", fontSize: 16, marginBottom: 8 }}>{item}</li>)}</ul>}
        {renderVisual()}
      </div>
    );
  }

  if (type === "scam_detector") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #EF4444", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#FCA5A5", fontWeight: 900, fontSize: 22, marginBottom: 16 }}>🚨 Scam or Safe?</div>
        {(data.scenarios ?? []).map((sc: any, i: number) => (
          <div key={i} style={{ background: "#0F172A", borderRadius: 10, padding: "14px", marginBottom: 10, border: `1px solid ${sc.isScam ? "#EF4444" : "#10B981"}` }}>
            <div style={{ color: "#E2E8F0", fontSize: 16, marginBottom: 6 }}>{sc.message}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: sc.isScam ? "#EF4444" : "#10B981" }}>{sc.isScam ? "🚫 SCAM" : "✅ SAFE"} — {sc.reason}</div>
          </div>
        ))}
        {data.scenario && <div style={{ background: "#0F172A", borderRadius: 10, padding: "14px", color: "#FDE68A", fontSize: 14 }}>{data.scenario}</div>}
        {renderVisual()}
      </div>
    );
  }

  if (type === "budget_planner" || type === "shopping_simulation") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #10B981", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 22, marginBottom: 16 }}>{type === "budget_planner" ? "💰 Budget Planner" : "🛒 Shopping Challenge"}</div>
        {data.budget !== undefined && (
          <div style={{ background: "#064E3B", borderRadius: 10, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#A7F3D0", fontSize: 16 }}>Total Budget</span>
            <span style={{ color: "#6EE7B7", fontWeight: 800, fontSize: 18 }}>₹{data.budget}</span>
          </div>
        )}
        {(data.items ?? data.categories ?? []).map((item: any, i: number) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #334155" }}>
            <span style={{ color: "#CBD5E1", fontSize: 16 }}>{item.name ?? item.category ?? item}</span>
            {item.cost !== undefined && <span style={{ color: "#FCD34D", fontWeight: 700, fontSize: 16 }}>₹{item.cost}</span>}
          </div>
        ))}
        {data.challenge && <div style={{ marginTop: 14, background: "rgba(245,158,11,0.1)", border: "1px solid #F59E0B", borderRadius: 8, padding: "10px 14px", color: "#FDE68A", fontSize: 13 }}>Challenge: {data.challenge}</div>}
        {renderVisual()}
      </div>
    );
  }

  if (type === "recap_summary") {
    return (
      <div style={{ background: "linear-gradient(135deg,#1E293B,#0F172A)", border: "2px solid #10B981", borderRadius: 20, padding: "28px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <div style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 28, marginBottom: 16 }}>{data.title ?? "Lesson Complete!"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "left" }}>
          {(data.keyPoints ?? data.points ?? []).map((pt: string, i: number) => (
            <div key={i} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "10px 12px", color: "#A7F3D0", fontSize: 13, lineHeight: 1.5 }}>✓ {pt}</div>
          ))}
        </div>
        {renderVisual()}
      </div>
    );
  }

  if (type === "atm_simulator")       return <div style={{ display: "flex", justifyContent: "center" }}><AtmSimulator userId={101} data={data} /></div>;
  if (type === "upi_simulator")       return <div style={{ display: "flex", justifyContent: "center" }}><UpiSimulator userId={101} data={data} /></div>;
  if (type === "bank_simulator")      return <BankPortal userId={101} data={data} />;
  if (type === "pocket_money_planner") return <PocketMoneyPlanner />;
  if (type === "passbook_viewer")     return <PassbookViewer data={data} />;

  return (
    <div style={{ background: "#1E293B", borderRadius: 20, padding: "28px 24px", color: "#CBD5E1", fontSize: 16, lineHeight: 1.7 }}>
      {data.headline && <div style={{ color: "#F59E0B", fontWeight: 800, fontSize: 22, marginBottom: 10 }}>{data.headline}</div>}
      {data.prompt && <p style={{ margin: 0 }}>{data.prompt}</p>}
      {renderVisual()}
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

function LessonStepsList({ steps, currentStepIndex, onStepClick, color }: {
  steps: MoneyMindLessonStep[];
  currentStepIndex: number;
  onStepClick: (i: number) => void;
  color: string;
}) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC" }}>
        <span style={{ fontSize: 16 }}>📋</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>Lesson Steps</span>
      </div>
      <div style={{ padding: "12px 16px" }}>
        {steps.map((s, i) => {
          const isActive = i === currentStepIndex;
          const isDone = i < currentStepIndex;
          
          // Determine step icon based on ID or label
          let icon = "•";
          const lid = s.id.toLowerCase();
          const llbl = s.label.toLowerCase();
          if (lid.includes("intro")) icon = "👋";
          else if (lid.includes("concept")) icon = "💡";
          else if (lid.includes("practice") || lid.includes("quiz")) icon = "✏️";
          else if (lid.includes("worked") || lid.includes("math")) icon = "🔢";
          else if (lid.includes("recap") || lid.includes("summary")) icon = "🏆";
          else if (lid.includes("sim") || lid.includes("game")) icon = "🕹️";
          else if (lid.includes("visual") || lid.includes("gallery")) icon = "🖼️";

          return (
            <button
              key={i}
              onClick={() => onStepClick(i)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                opacity: isActive ? 1 : 0.7,
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: isActive ? color : isDone ? `${color}22` : "#F1F5F9",
                border: `2px solid ${isActive ? color : isDone ? color : "#E2E8F0"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800,
                color: isActive ? "#fff" : isDone ? color : "#94A3B8",
                transition: "all .2s",
              }}>
                {isDone ? "✓" : icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, color: isActive ? "#0F172A" : "#64748B" }}>
                  {s.label}
                </div>
              </div>
              {isActive && <span style={{ fontSize: 12, color: color, animation: "mmFadeIn 0.5s infinite alternate" }}>◀</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CourseContentList({ currentLessonId, currentLevelSlug, color }: {
  currentLessonId: string;
  currentLevelSlug: string;
  color: string;
}) {
  const [openLevel, setOpenLevel] = useState<string>(currentLevelSlug);
  const grouped = useMemo(() => {
    const map: Record<string, { id: string; title: string }[]> = {};
    Object.entries(MONEYMIND_LESSON_REGISTRY).forEach(([id, payload]) => {
      const slug = payload.course.levelSlug;
      if (!map[slug]) map[slug] = [];
      map[slug].push({ id, title: payload.lesson.title });
    });
    return map;
  }, []);

  const LEVEL_ICONS = ["🌱","🏦","📱","💰","📈","🎓"];
  const LEVEL_COLORS_MAP: Record<string, string> = {
    "level-1":"#F59E0B","level-2":"#3B82F6","level-3":"#8B5CF6",
    "level-4":"#F97316","level-5":"#14B8A6","level-6":"#D97706",
  };

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC" }}>
        <span style={{ fontSize: 16 }}>🗺️</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>Course Map</span>
      </div>
      {LEVEL_META.map(({ slug, label }, li) => {
        const isOpen = openLevel === slug;
        const isCurrent = slug === currentLevelSlug;
        const lessons = grouped[slug] ?? [];
        const lcolor = LEVEL_COLORS_MAP[slug] ?? color;
        const icon = LEVEL_ICONS[li] ?? "📚";
        const currentIdx = lessons.findIndex(l => l.id === currentLessonId);

        return (
          <div key={slug} style={{ borderBottom: "1px solid #F1F5F9" }}>
            <button
              onClick={() => setOpenLevel(isOpen ? "" : slug)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: isCurrent ? `${lcolor}12` : "#FAFAFA", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: isCurrent ? lcolor : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, boxShadow: isCurrent ? `0 0 0 3px ${lcolor}33` : "none" }}>
                {icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: isCurrent ? lcolor : "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label.split(" — ")[1] ?? label}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{lessons.length} lessons</div>
              </div>
              <span style={{ fontSize: 10, color: "#CBD5E1" }}>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div style={{ padding: "8px 14px 12px 20px" }}>
                {lessons.map((ls, i) => {
                  const isActive = ls.id === currentLessonId;
                  const isDone = isCurrent ? i < currentIdx : false;
                  return (
                    <div key={ls.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <Link href={`/moneymind/learn/${slug}/${ls.id}`} style={{ textDecoration: "none" }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: isActive ? lcolor : isDone ? lcolor : "#E2E8F0",
                            border: isActive ? `3px solid ${lcolor}` : isDone ? `2px solid ${lcolor}` : "2px solid #CBD5E1",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 800,
                            color: (isActive || isDone) ? "#fff" : "#94A3B8",
                            boxShadow: isActive ? `0 0 0 4px ${lcolor}30, 0 2px 8px ${lcolor}40` : "none",
                            animation: isActive ? `mmGlow 2s ease-in-out infinite` : "none",
                            transition: "all .2s",
                            cursor: "pointer",
                          }}>
                            {isDone ? "✓" : i + 1}
                          </div>
                        </Link>
                        {i < lessons.length - 1 && (
                          <div style={{ width: 0, height: 24, borderLeft: isDone ? `2px solid ${lcolor}60` : "2px dashed #CBD5E1", margin: "2px 0" }} />
                        )}
                      </div>
                      <Link href={`/moneymind/learn/${slug}/${ls.id}`} style={{ textDecoration: "none", flex: 1, paddingTop: 4, paddingBottom: i < lessons.length - 1 ? 20 : 0 }}>
                        <div style={{ fontSize: 13, fontWeight: isActive ? 800 : 500, color: isActive ? lcolor : "#334155", lineHeight: 1.4 }}>
                          {ls.title}
                        </div>
                        {isActive && <div style={{ fontSize: 10, color: lcolor, fontWeight: 700, marginTop: 2 }}>▶ Currently here</div>}
                      </Link>
                    </div>
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

// ─── Mascot Sticker ───────────────────────────────────────────────────────────
function MascotSticker({ lessonId }: { lessonId: string }) {
  const level = parseInt(lessonId.replace("MM_L","").split("_")[0]) || 1;
  // Level 1-2: Rahul, Level 3-4: Priya, Level 5-6: Arjun
  if (level <= 2) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90">
        {/* Rahul — spiky hair, blue shirt, thumbs up */}
        <circle cx="45" cy="28" r="18" fill="#FBBF24"/>
        {/* Spiky hair */}
        {[-12,-6,0,6,12].map((x,i) => <polygon key={i} points={`${45+x},10 ${45+x-4},18 ${45+x+4},18`} fill="#1E293B"/>)}
        {/* Eyes */}
        <ellipse cx="39" cy="26" rx="3" ry="3.5" fill="#1E293B"/>
        <ellipse cx="51" cy="26" rx="3" ry="3.5" fill="#1E293B"/>
        <circle cx="40" cy="25" r="1" fill="#fff"/>
        <circle cx="52" cy="25" r="1" fill="#fff"/>
        {/* Big smile */}
        <path d="M37 34 Q45 42 53 34" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Rosy cheeks */}
        <circle cx="36" cy="31" r="4" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="54" cy="31" r="4" fill="#FCA5A5" opacity="0.6"/>
        {/* Blue shirt body */}
        <rect x="28" y="46" width="34" height="30" rx="8" fill="#3B82F6"/>
        {/* Thumbs up arm */}
        <rect x="62" y="50" width="10" height="18" rx="5" fill="#FBBF24"/>
        <circle cx="67" cy="48" r="7" fill="#FBBF24"/>
        {/* Stars */}
        <text x="10" y="20" fontSize="14">⭐</text>
        <text x="65" y="15" fontSize="12">✨</text>
        <text x="5" y="60" fontSize="11">🎉</text>
      </svg>
    );
  }
  if (level <= 4) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90">
        {/* Priya — pigtails, pink ribbons, jumping */}
        <circle cx="45" cy="28" r="18" fill="#FBBF24"/>
        {/* Hair */}
        <path d="M27 24 Q25 15 35 18" stroke="#1E293B" strokeWidth="4" fill="none"/>
        <path d="M63 24 Q65 15 55 18" stroke="#1E293B" strokeWidth="4" fill="none"/>
        <rect x="27" y="10" width="36" height="16" rx="8" fill="#1E293B"/>
        {/* Pigtail ribbons */}
        <circle cx="27" cy="22" r="5" fill="#EC4899"/>
        <circle cx="63" cy="22" r="5" fill="#EC4899"/>
        {/* Eyes happy arcs */}
        <path d="M38 25 Q41 21 44 25" stroke="#1E293B" strokeWidth="2" fill="none"/>
        <path d="M46 25 Q49 21 52 25" stroke="#1E293B" strokeWidth="2" fill="none"/>
        {/* Big smile */}
        <path d="M37 33 Q45 42 53 33" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="36" cy="30" r="4" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="54" cy="30" r="4" fill="#FCA5A5" opacity="0.6"/>
        {/* Pink top */}
        <rect x="30" y="46" width="30" height="28" rx="8" fill="#EC4899"/>
        {/* Arms up */}
        <line x1="30" y1="52" x2="18" y2="40" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round"/>
        <line x1="60" y1="52" x2="72" y2="40" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round"/>
        <text x="12" y="18" fontSize="13">⭐</text>
        <text x="62" y="12" fontSize="12">💖</text>
      </svg>
    );
  }
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      {/* Arjun — curly hair, green shirt, fist pump */}
      <circle cx="45" cy="28" r="18" fill="#FBBF24"/>
      {/* Curly hair */}
      {[33,39,45,51,57].map((x,i) => <circle key={i} cx={x} cy={14+(i%2)*3} r="5" fill="#1E293B"/>)}
      <rect x="27" y="16" width="36" height="14" rx="0" fill="#1E293B"/>
      {/* Eyes */}
      <ellipse cx="39" cy="27" rx="3" ry="3" fill="#1E293B"/>
      <ellipse cx="51" cy="27" rx="3" ry="3" fill="#1E293B"/>
      <circle cx="40" cy="26" r="1" fill="#fff"/>
      <circle cx="52" cy="26" r="1" fill="#fff"/>
      {/* Big smile */}
      <path d="M37 34 Q45 42 53 34" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="36" cy="31" r="4" fill="#FCA5A5" opacity="0.6"/>
      <circle cx="54" cy="31" r="4" fill="#FCA5A5" opacity="0.6"/>
      {/* Green shirt */}
      <rect x="30" y="46" width="30" height="28" rx="8" fill="#059669"/>
      {/* Fist pump */}
      <rect x="62" y="38" width="10" height="18" rx="5" fill="#FBBF24"/>
      <circle cx="67" cy="36" r="7" fill="#FBBF24"/>
      <text x="8" y="18" fontSize="14">🏆</text>
      <text x="62" y="14" fontSize="12">✨</text>
    </svg>
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
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coinBurst, setCoinBurst] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [stepDir, setStepDir] = useState<'forward' | 'back'>('forward');
  const [meeraBouncing, setMeeraBouncing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [sidebarMode, setSidebarMode] = useState<'steps' | 'map'>('steps');

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
  const isMobile    = viewportWidth < 768;

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

  // Auto-speak on step change (1.5s delay on first step so page fully loads before TTS call)
  useEffect(() => {
    setFeedback(null); setChecked(false); setSelectedAnswer(null); setNumericAnswer("");
    const delay = stepIndex === 0 ? 1500 : 0;
    const timer = setTimeout(() => {
      if (voiceEnabled) void speakText(step.tutorText);
      else stopSpeaking();
    }, delay);
    return () => { clearTimeout(timer); stopSpeaking(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  useEffect(() => {
    if (!voiceEnabled) { stopSpeaking(); setVoiceStatus("Muted"); }
    else setVoiceStatus("Ready");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled]);

  // ── Navigation ────────────────────────────────────────────────────────────
  function moveToStep(i: number) {
    setStepDir(i > stepIndex ? 'forward' : 'back');
    setStepIndex(Math.max(0, Math.min(totalSteps - 1, i)));
    setChecked(false); setFeedback(null); setSelectedAnswer(null); setNumericAnswer("");
  }

  function playSound(type: 'correct' | 'wrong' | 'coin') {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (type === 'correct') {
        [523, 659, 784].forEach((freq, i) => {
          const osc = ctx.createOscillator(); const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq; osc.type = 'sine';
          const t = ctx.currentTime + i * 0.13;
          gain.gain.setValueAtTime(0.28, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.start(t); osc.stop(t + 0.45);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(300, ctx.currentTime); osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.35);
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.18, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start(); osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'coin') {
        [1046, 1318, 1568].forEach((freq, i) => {
          const osc = ctx.createOscillator(); const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq; osc.type = 'triangle';
          const t = ctx.currentTime + i * 0.09;
          gain.gain.setValueAtTime(0.22, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          osc.start(t); osc.stop(t + 0.22);
        });
      }
    } catch { /* ignore AudioContext errors */ }
  }

  const checkAnswer = () => {
    if (!step.practice) return;
    const ans = step.practice.mode === "numeric" ? numericAnswer : selectedAnswer;
    const correct = step.practice.mode === "numeric"
      ? Math.abs(Number(ans) - Number(step.practice.answer)) < 0.01
      : String(ans).toLowerCase() === String(step.practice.answer).toLowerCase();
    setFeedback({ correct, message: correct ? `Correct! 🎉 ${step.practice.hints?.[0] ?? ""}` : `Not quite. The answer is: ${step.practice.answer}` });
    setChecked(true);
    if (correct) {
      setCoins(c => c + 10);
      setStreak(s => s + 1);
      setCoinBurst(true);
      setTimeout(() => setCoinBurst(false), 1000);
      playSound('correct');
      setTimeout(() => playSound('coin'), 400);
      setMeeraBouncing(true);
      setTimeout(() => setMeeraBouncing(false), 900);
    } else {
      setStreak(0);
      playSound('wrong');
    }
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

  const palette = LEVEL_PALETTE[lesson.course.levelSlug] ?? LEVEL_PALETTE["level-1"];

  const C = {
    green: palette.primary,
    accent: palette.primary,
    dark: "#0F172A",
    mainBg: palette.bg,
    sidebarBg: "#FFFFFF",
    headerBg: palette.headerBg,
    avatarCard: `linear-gradient(160deg, ${palette.headerBg}, ${palette.primary}88)`,
  };

  return (
    <main style={{ minHeight: "100vh", background: C.mainBg, color: C.dark, fontFamily: "'Nunito', 'Inter', 'Segoe UI', sans-serif" }}>
      <style>{GLOBAL_CSS + `
  .mm-shimmer {
    background: ${palette.shimmer};
    background-size: 200% 100%;
    animation: mmShimmer 2s linear infinite;
  }
  .mm-glow { animation: mmGlow-${lesson.course.levelSlug} 2s ease-in-out infinite; }
  @keyframes mmGlow-${lesson.course.levelSlug} {
    0%,100%{box-shadow:0 0 0 0 ${palette.primary}55}
    50%{box-shadow:0 0 0 8px ${palette.primary}00}
  }
`}</style>

      {/* ── Top header ────────────────────────────────────────────────────── */}
      <header style={{ background: C.headerBg, color: "#F8FAFC", padding: isMobile ? "10px 14px" : "14px 24px", position: "sticky", top: 0, zIndex: 110, borderBottom: "1px solid #064E3B" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            {!isMobile && <div style={{ fontSize: 11, color: "#A7F3D0", textTransform: "uppercase", letterSpacing: 1.1 }}>{lesson.course.title}</div>}
            <div style={{ fontSize: isMobile ? 15 : 20, fontWeight: 800, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.lesson.title}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {!isMobile && (
              <div style={{ background: "#F1F5F9", borderRadius: 100, height: 6, width: 160, overflow: "hidden" }}>
                <div className="mm-shimmer" style={{ height: "100%", width: `${progress}%`, transition: "width .5s", borderRadius: 100 }} />
              </div>
            )}
            {isMobile && (
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 100, height: 5, width: 80, overflow: "hidden" }}>
                <div className="mm-shimmer" style={{ height: "100%", width: `${progress}%`, transition: "width .5s", borderRadius: 100 }} />
              </div>
            )}
            {!isMobile && (
              <button onClick={() => setVoiceEnabled(v => !v)} style={{ border: "1px solid rgba(255,255,255,0.3)", background: voiceEnabled ? "rgba(255,255,255,0.15)" : "transparent", color: "#F8FAFC", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
                {voiceEnabled ? "🔊 Voice on" : "🔇 Voice off"}
              </button>
            )}
            {/* Coin counter */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,.12)", borderRadius: 20, padding: isMobile ? "5px 10px" : "6px 12px" }}>
              <span style={{ fontSize: isMobile ? 14 : 16, animation: coinBurst ? "mmCounter .4s ease both" : undefined }}>🪙</span>
              <span style={{ color: "#FCD34D", fontWeight: 900, fontSize: isMobile ? 13 : 14, minWidth: 24, animation: coinBurst ? "mmCounter .4s ease both" : undefined }}>{coins}</span>
            </div>
            {streak >= 2 && (
              <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(245,158,11,.2)", border: "1px solid #F59E0B", borderRadius: 20, padding: "5px 8px", animation: "mmStreak .5s ease both" }}>
                <span style={{ fontSize: 13 }}>🔥</span>
                {!isMobile && <span style={{ color: "#FCD34D", fontWeight: 900, fontSize: 12 }}>{streak}</span>}
              </div>
            )}
            <Link href={`/moneymind/course/${lesson.course.levelSlug}`} style={{ color: "#D1FAE5", textDecoration: "none", fontWeight: 700, fontSize: isMobile ? 12 : 13 }}>← Course</Link>
          </div>
        </div>
      </header>

      {/* ── Mobile speech bar (avatar + tutor text, collapsed row) ── */}
      {isMobile && (
        <div style={{ background: C.avatarCard, padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flexShrink: 0 }}>
            <MoneyMindAvatar speaking={isSpeaking} mood={avatarMood} gesture={avatarGesture} size={56} bouncing={meeraBouncing} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#A7F3D0", fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>MEERA</div>
            <div key={`mspeech-${stepIndex}`} className="mm-fade-in" style={{ fontSize: 13, color: "#D1FAE5", lineHeight: 1.6 }}>
              {step.tutorText}
            </div>
          </div>
          <button
            onClick={() => isSpeaking ? stopSpeaking() : void speakText(step.tutorText)}
            style={{ flexShrink: 0, border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontWeight: 800, fontSize: 11 }}
          >
            {isSpeaking ? "⏹" : "▶"}
          </button>
        </div>
      )}

      {/* ── Two-panel layout ──────────────────────────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isNarrow ? "1fr" : "320px minmax(0,1fr)", minHeight: isMobile ? "auto" : "calc(100vh - 68px)" }}>

        {/* ──────────── LEFT SIDEBAR (hidden on mobile) ──────────── */}
        {!isMobile && (
        <aside style={{ background: C.sidebarBg, borderRight: "1px solid #E2E8F0", padding: 20, display: "grid", alignContent: "start", gap: 16, position: isNarrow ? "static" : "sticky", top: 68, height: isNarrow ? "auto" : "calc(100vh - 68px)", overflowY: "auto" }}>

          {/* Lesson Header */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, fontWeight: 800 }}>Lesson</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", lineHeight: 1.2, marginTop: 2 }}>{lesson.lesson.title}</div>
          </div>

          {/* Avatar card */}
          <div style={{ background: C.avatarCard, borderRadius: 18, padding: 18, color: "#FFFFFF", position: "relative" }}>
            <div style={{ fontSize: 11, color: "#A7F3D0", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 10 }}>MoneyMind Coach</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MoneyMindAvatar speaking={isSpeaking} mood={avatarMood} gesture={avatarGesture} size={isNarrow ? 120 : 155} bouncing={meeraBouncing} />
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
            <div key={`speech-${stepIndex}`} className="mm-fade-in" style={{ marginTop: 14, fontSize: 15, lineHeight: 1.75, color: "#D1FAE5" }}>
              {step.tutorText}
            </div>
            {feedback?.correct && (
              <div style={{ position: "absolute", right: 16, bottom: 16, animation: "mmPopIn .5s ease both", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>
                <MascotSticker lessonId={lesson.lesson.id} />
              </div>
            )}
          </div>

          {/* Sidebar Tabs */}
          <div style={{ display: "flex", background: "#F1F5F9", padding: 4, borderRadius: 12 }}>
            <button
              onClick={() => setSidebarMode('steps')}
              style={{ flex: 1, border: "none", background: sidebarMode === 'steps' ? "#fff" : "transparent", padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: sidebarMode === 'steps' ? "0 2px 4px rgba(0,0,0,0.05)" : "none", color: sidebarMode === 'steps' ? C.green : "#64748B", transition: "all .2s" }}
            >
              Steps
            </button>
            <button
              onClick={() => setSidebarMode('map')}
              style={{ flex: 1, border: "none", background: sidebarMode === 'map' ? "#fff" : "transparent", padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: sidebarMode === 'map' ? "0 2px 4px rgba(0,0,0,0.05)" : "none", color: sidebarMode === 'map' ? C.green : "#64748B", transition: "all .2s" }}
            >
              Map
            </button>
          </div>

          {sidebarMode === 'steps' ? (
            <LessonStepsList steps={lesson.steps} currentStepIndex={stepIndex} onStepClick={moveToStep} color={C.green} />
          ) : (
            <CourseContentList currentLessonId={lesson.lesson.id} currentLevelSlug={lesson.course.levelSlug} color={C.green} />
          )}

          {/* Ask Meera */}
          <button
            onClick={() => setChatOpen(c => !c)}
            style={{ background: chatOpen ? C.green : "#065F46", color: "#FFFFFF", border: "none", borderRadius: 14, padding: "14px 16px", fontWeight: 800, fontSize: 14, cursor: "pointer", textAlign: "left" }}
          >
            🤖 Ask Meera →
            <div style={{ fontSize: 11, fontWeight: 400, color: "#A7F3D0", marginTop: 2 }}>Ask any question about this lesson</div>
          </button>
        </aside>
        )}

        {/* ──────────── RIGHT MAIN ──────────── */}
        <section style={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : isNarrow ? "auto" : "calc(100vh - 68px)", overflow: isMobile ? "visible" : isNarrow ? "visible" : "hidden" }}>

          {/* ── Scrollable content area ── */}
          <div style={{ flex: 1, overflowY: isMobile ? "visible" : "auto", padding: isMobile ? "16px 14px" : "24px 28px", display: "grid", alignContent: "start", gap: isMobile ? 14 : 18 }}>

          {/* Meta row */}
          {/* On mobile: hide objective card to save space, show inline step + progress pill */}
          {isMobile ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: 1 }}>Now learning</div>
                <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2, lineHeight: 1.3, color: "#0F172A" }}>{lesson.lesson.title}</div>
              </div>
              <div style={{ background: C.green, color: "#fff", borderRadius: 12, padding: "10px 14px", textAlign: "center", minWidth: 64 }}>
                <div style={{ fontSize: 10, fontWeight: 700 }}>Step</div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{stepIndex + 1}/{totalSteps}</div>
              </div>
            </div>
          ) : (
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
          )}

          {/* Step label */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#065F46", borderRadius: 100, padding: "5px 20px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
              {step.label}
            </span>
          </div>

          {/* ── Wipe wrapper: comic + board ── */}
          <div key={`content-${stepIndex}`} className={stepDir === 'forward' ? 'mm-wipe-forward' : 'mm-wipe-back'}>

            {/* ── Comic strip ── */}
            <StepComic lessonId={lesson.lesson.id} stepId={step.id} />

            {/* Board */}
            <div>
              {!["atm_simulator","upi_simulator","bank_simulator","pocket_money_planner","passbook_viewer"].includes(step.board.type) && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: -14, position: "relative", zIndex: 2 }}>
                  {getBoardIllustration(step.board.type, step.board.data.headline ?? step.board.data.title, step.board.data.emoji)}
                </div>
              )}
              <BoardCard step={step} stepKey={stepIndex} />
            </div>

          </div>

          {/* Explanation (always shown if present) */}
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
              <p style={{ color: "#0F172A", fontSize: 18, fontWeight: 600, marginBottom: 18, lineHeight: 1.5 }}>{step.practice.prompt}</p>

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
                          background: isRight ? "#F0FDF4" : isWrong ? "#FEF2F2" : isSel ? `${C.green}15` : "#F8FAFC",
                          border: `2px solid ${isRight ? C.green : isWrong ? "#EF4444" : isSel ? C.green : "#E2E8F0"}`,
                          borderRadius: 14, padding: "16px 18px", color: "#0F172A", fontSize: 16,
                          fontWeight: isSel ? 800 : 500, cursor: checked ? "default" : "pointer",
                          textAlign: "left", transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          display: "flex", alignItems: "center", gap: 12,
                          boxShadow: isSel && !checked ? `0 4px 12px ${C.green}25` : "none",
                          transform: isSel && !checked ? "translateY(-2px)" : "none",
                        }}
                      >
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          border: `2px solid ${isRight ? C.green : isWrong ? "#EF4444" : isSel ? C.green : "#CBD5E1"}`,
                          background: isRight ? C.green : isWrong ? "#EF4444" : isSel ? C.green : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: (isRight || isWrong || isSel) ? "#fff" : "transparent",
                          fontSize: 12, flexShrink: 0,
                        }}>
                          {isRight ? "✓" : isWrong ? "✕" : String.fromCharCode(65 + i)}
                        </div>
                        <span style={{ flex: 1 }}>{opt}</span>
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
                  <span style={{ fontSize: 22 }}>{feedback.correct ? "🎉" : "😅"}</span>
                  <div style={{ flex: 1 }}>
                    <div>{feedback.message}</div>
                    {/* Show hints when wrong */}
                    {!feedback.correct && step.practice.hints && step.practice.hints.length > 0 && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #FCA5A5" }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#B45309", marginBottom: 6 }}>💡 Here's a clue:</div>
                        {step.practice.hints.map((hint, hi) => (
                          <div key={hi} style={{ fontSize: 13, color: "#78350F", marginBottom: 4, display: "flex", gap: 6 }}>
                            <span>•</span><span>{hint}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Show step explanation when wrong if no hints */}
                    {!feedback.correct && (!step.practice.hints || step.practice.hints.length === 0) && step.explanation && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #FCA5A5", fontSize: 13, color: "#78350F" }}>
                        💡 {step.explanation.body}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Wrong-answer action row: Try Again + Next */}
              {checked && !feedback?.correct && (
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <button
                    onClick={() => { setChecked(false); setFeedback(null); setSelectedAnswer(null); setNumericAnswer(""); }}
                    style={{ flex: 1, background: "#FEF3C7", border: "2px solid #F59E0B", color: "#92400E", borderRadius: 12, padding: "11px 16px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}
                  >
                    🔄 Try Again
                  </button>
                  <button
                    onClick={advance}
                    style={{ flex: 1, background: C.green, color: "#fff", border: "none", borderRadius: 12, padding: "11px 16px", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
                  >
                    Next →
                  </button>
                </div>
              )}

              {feedback?.correct && (
                <div style={{ position: "relative", height: 0, overflow: "visible", pointerEvents: "none" }}>
                  {/* Confetti */}
                  {["#F59E0B","#10B981","#3B82F6","#EF4444","#8B5CF6","#FCD34D"].map((color, i) => (
                    <div key={i} style={{ position: "absolute", top: -20, left: `${15 + i * 13}%`, width: 8, height: 8, background: color, borderRadius: i % 2 === 0 ? "50%" : 2, animation: `mmConfetti ${0.8 + i * 0.1}s ease-out ${i * 0.07}s both` }} />
                  ))}
                  {/* Coins flying up */}
                  {[0,1,2].map(i => (
                    <div key={`coin-${i}`} style={{
                      position: "absolute", top: -10, left: `${30 + i * 18}%`,
                      fontSize: 18, animation: `mmCoinFly .9s ease-out ${i * 0.12}s both`,
                      "--cx": `${(i - 1) * 40}px`, "--cy": "-80px",
                    } as React.CSSProperties}>🪙</div>
                  ))}
                  {/* +10 XP pop */}
                  <div style={{ position: "absolute", top: -36, right: "10%", color: "#FCD34D", fontWeight: 900, fontSize: 16, animation: "mmCoinPop .6s ease both", textShadow: "0 2px 8px rgba(0,0,0,.4)" }}>+10 🪙</div>
                </div>
              )}

              {!checked && (
                <button
                  onClick={checkAnswer}
                  disabled={!selectedAnswer && !numericAnswer}
                  style={{
                    width: "100%",
                    background: (!selectedAnswer && !numericAnswer) ? "#E2E8F0" : C.green,
                    color: (!selectedAnswer && !numericAnswer) ? "#94A3B8" : "#fff",
                    border: "none", borderRadius: 14, padding: "16px 28px",
                    fontWeight: 900, fontSize: 16, cursor: "pointer",
                    boxShadow: (!selectedAnswer && !numericAnswer) ? "none" : `0 6px 20px ${C.green}40`,
                    transition: "all .3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: (!selectedAnswer && !numericAnswer) ? "none" : "scale(1)",
                  }}
                  onMouseEnter={e => { if (!checked && (selectedAnswer || numericAnswer)) e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
                  onMouseLeave={e => { if (!checked) e.currentTarget.style.transform = "none"; }}
                >
                  Confirm Answer 🚀
                </button>
              )}
            </div>
          )}

          {/* ── Step Visual — shown below practice as a visual reference ── */}
          <StepVisual lessonId={lesson.lesson.id} stepId={step.id} boardData={step.board.data as Record<string, unknown>} />

          </div>{/* end scrollable content */}

          {/* ── Sticky nav bar — always visible ── */}
          <div style={{
            flexShrink: 0,
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
            padding: isMobile ? "10px 12px" : "14px 28px",
            background: "#F8FAFC",
            borderTop: "2px solid #E2E8F0",
            boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
            position: isMobile ? "sticky" : "relative",
            bottom: isMobile ? 0 : "auto",
            zIndex: 20,
          }}>
            {/* Prev button — never shrinks */}
            <button
              onClick={() => moveToStep(stepIndex - 1)}
              disabled={stepIndex === 0}
              style={{
                flexShrink: 0,
                background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#64748B",
                borderRadius: 12, padding: isMobile ? "12px 14px" : "12px 24px",
                fontWeight: 700, fontSize: isMobile ? 14 : 14,
                cursor: stepIndex === 0 ? "not-allowed" : "pointer",
                opacity: stepIndex === 0 ? 0.35 : 1,
                whiteSpace: "nowrap",
              }}
            >
              ← {isMobile ? "" : "Prev"}
            </button>

            {/* Centre: step counter + dots (dots hidden on mobile) */}
            <div style={{ textAlign: "center", flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 13 : 11, color: "#64748B", fontWeight: 800 }}>
                {stepIndex + 1} / {totalSteps}
              </div>
              {!isMobile && (
                <div style={{ display: "flex", gap: 4, marginTop: 4, justifyContent: "center" }}>
                  {lesson.steps.map((_, i) => (
                    <div key={i} onClick={() => moveToStep(i)} style={{
                      width: i === stepIndex ? 16 : 5, height: 5, borderRadius: 3,
                      background: i < stepIndex ? C.green : i === stepIndex ? "#065F46" : "#CBD5E1",
                      transition: "all 0.3s", cursor: "pointer",
                    }} />
                  ))}
                </div>
              )}
              {/* Mobile: tiny dot row, no expanding dots */}
              {isMobile && (
                <div style={{ display: "flex", gap: 3, marginTop: 3, justifyContent: "center" }}>
                  {lesson.steps.map((_, i) => (
                    <div key={i} onClick={() => moveToStep(i)} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: i < stepIndex ? C.green : i === stepIndex ? C.green : "#CBD5E1",
                      flexShrink: 0, cursor: "pointer",
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Next button — never shrinks, always fully visible */}
            <button
              onClick={advance}
              disabled={needsCheck || finishing}
              style={{
                flexShrink: 0,
                background: needsCheck ? "#E2E8F0" : isLastStep ? `linear-gradient(90deg, #FCD34D, ${C.accent})` : C.green,
                color: needsCheck ? "#94A3B8" : isLastStep ? "#451A03" : "#fff",
                border: "none", borderRadius: 12,
                padding: isMobile ? "12px 18px" : "12px 28px",
                fontWeight: 900, fontSize: isMobile ? 14 : 15,
                cursor: (needsCheck || finishing) ? "not-allowed" : "pointer",
                opacity: finishing ? 0.6 : 1,
                boxShadow: needsCheck ? "none" : isLastStep ? "0 4px 16px rgba(245,158,11,0.4)" : "0 4px 16px rgba(16,185,129,0.35)",
                animation: (!needsCheck && !finishing) ? "mmGlow 2s ease-in-out infinite" : undefined,
                whiteSpace: "nowrap",
              }}
            >
              {finishing ? "⏳" : isLastStep ? "🏆 Done" : isMobile ? "Next →" : "Next →"}
            </button>
          </div>
        </section>
      </section>

      {/* Mobile FAB: Ask Meera */}
      {isMobile && (
        <button
          onClick={() => setChatOpen(c => !c)}
          style={{
            position: "fixed", bottom: 80, right: 16, zIndex: 50,
            width: 52, height: 52, borderRadius: "50%",
            background: chatOpen ? C.green : "#065F46",
            color: "#fff", border: "none",
            boxShadow: "0 4px 20px rgba(6,95,70,0.45)",
            fontSize: 22, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          title="Ask Meera"
        >
          🤖
        </button>
      )}

      {chatOpen && <ChatPanel lesson={lesson} step={step} onClose={() => setChatOpen(false)} />}
    </main>
  );
}
