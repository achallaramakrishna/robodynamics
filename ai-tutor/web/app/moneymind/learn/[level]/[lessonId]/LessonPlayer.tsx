"use client";

import { useState, useRef, useEffect } from "react";
import type { MoneyMindLessonPayload, MoneyMindLessonStep } from "@/lib/moneyMindLessonTypes";
import { getNextLessonId } from "@/lib/moneyMindLessonRegistry";
import AtmSimulator from "@/components/moneymind/AtmSimulator";
import UpiSimulator from "@/components/moneymind/UpiSimulator";
import BankPortal from "@/components/moneymind/BankPortal";

// ─── Board Renderer ───────────────────────────────────────────────────────────

function BoardCard({ step }: { step: MoneyMindLessonStep }) {
  const { type, data } = step.board;

  if (type === "intro_card" || type === "mission_card") {
    return (
      <div style={{ background: "linear-gradient(135deg, #1E3A5F, #0F172A)", border: "2px solid #3B82F6", borderRadius: 20, padding: "32px 28px", textAlign: "center" }}>
        {data.assetPath && (
          <div style={{ fontSize: 72, marginBottom: 16 }}>
            {data.emoji ?? "💰"}
          </div>
        )}
        <div style={{ color: "#93C5FD", fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
          {type === "mission_card" ? "🎯 Mission" : "📚 Today's Lesson"}
        </div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 24, marginBottom: 12, lineHeight: 1.3 }}>
          {data.headline ?? data.title}
        </div>
        {data.example && (
          <div style={{ background: "rgba(59,130,246,0.15)", border: "1px solid #3B82F6", borderRadius: 10, padding: "12px 16px", marginBottom: 12, color: "#93C5FD", fontSize: 14 }}>
            {data.example}
          </div>
        )}
        {data.goal && (
          <div style={{ color: "#D1FAE5", fontSize: 14, lineHeight: 1.6 }}>🏁 Goal: {data.goal}</div>
        )}
        {data.scenario && (
          <div style={{ color: "#FDE68A", fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>{data.scenario}</div>
        )}
      </div>
    );
  }

  if (type === "concept_card") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #334155", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#F59E0B", fontWeight: 900, fontSize: 18, marginBottom: 16 }}>
          {data.emoji ?? "💡"} {data.title}
        </div>
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
              <thead>
                <tr>
                  {data.table.headers.map((h: string) => (
                    <th key={h} style={{ background: "#334155", color: "#F59E0B", padding: "8px 12px", textAlign: "left", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.table.rows.map((row: string[], ri: number) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: "8px 12px", color: "#CBD5E1", borderBottom: "1px solid #334155" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (type === "worked_example") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #8B5CF6", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#A78BFA", fontWeight: 900, fontSize: 16, marginBottom: 16 }}>
          🔢 Worked Example
        </div>
        {data.expression && (
          <div style={{ background: "#0F172A", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontFamily: "monospace", color: "#FCD34D", fontSize: 18, textAlign: "center" }}>
            {data.expression}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(data.steps ?? []).map((s: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ background: "#8B5CF6", color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: "#E2E8F0", fontSize: 14 }}>{s}</span>
            </div>
          ))}
        </div>
        {data.result !== undefined && (
          <div style={{ marginTop: 16, background: "#064E3B", border: "1px solid #10B981", borderRadius: 10, padding: "12px 16px", color: "#6EE7B7", fontWeight: 800, fontSize: 16, textAlign: "center" }}>
            ✓ Result: {data.result}
          </div>
        )}
      </div>
    );
  }

  if (type === "practice_board") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #F59E0B", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 16, marginBottom: 12 }}>
          ✏️ {data.headline ?? "Practice Time"}
        </div>
        {data.prompt && (
          <p style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>{data.prompt}</p>
        )}
        {data.items && (
          <ul style={{ margin: "12px 0 0", paddingLeft: 20 }}>
            {data.items.map((item: string, i: number) => (
              <li key={i} style={{ color: "#E2E8F0", fontSize: 14, marginBottom: 8 }}>{item}</li>
            ))}
          </ul>
        )}
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
            <div style={{ fontSize: 12, fontWeight: 700, color: sc.isScam ? "#EF4444" : "#10B981" }}>
              {sc.isScam ? "🚫 SCAM" : "✅ SAFE"} — {sc.reason}
            </div>
          </div>
        ))}
        {data.scenario && (
          <div style={{ background: "#0F172A", borderRadius: 10, padding: "14px", color: "#FDE68A", fontSize: 14 }}>
            {data.scenario}
          </div>
        )}
      </div>
    );
  }

  if (type === "budget_planner" || type === "shopping_simulation") {
    return (
      <div style={{ background: "#1E293B", border: "2px solid #10B981", borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 16, marginBottom: 16 }}>
          {type === "budget_planner" ? "💰 Budget Planner" : "🛒 Shopping Challenge"}
        </div>
        {data.budget !== undefined && (
          <div style={{ background: "#064E3B", borderRadius: 10, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#A7F3D0", fontSize: 13 }}>Total Budget</span>
            <span style={{ color: "#6EE7B7", fontWeight: 800, fontSize: 18 }}>₹{data.budget}</span>
          </div>
        )}
        {(data.items ?? data.categories ?? []).map((item: any, i: number) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #334155" }}>
            <span style={{ color: "#CBD5E1", fontSize: 13 }}>{item.name ?? item.category ?? item}</span>
            {item.cost !== undefined && (
              <span style={{ color: "#FCD34D", fontWeight: 700, fontSize: 13 }}>₹{item.cost}</span>
            )}
          </div>
        ))}
        {data.challenge && (
          <div style={{ marginTop: 14, background: "rgba(245,158,11,0.1)", border: "1px solid #F59E0B", borderRadius: 8, padding: "10px 14px", color: "#FDE68A", fontSize: 13 }}>
            Challenge: {data.challenge}
          </div>
        )}
      </div>
    );
  }

  if (type === "recap_summary") {
    return (
      <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", border: "2px solid #10B981", borderRadius: 20, padding: "28px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <div style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 20, marginBottom: 16 }}>{data.title ?? "Lesson Complete!"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "left" }}>
          {(data.keyPoints ?? data.points ?? []).map((pt: string, i: number) => (
            <div key={i} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "10px 12px", color: "#A7F3D0", fontSize: 12, lineHeight: 1.5 }}>
              ✓ {pt}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "atm_simulator") {
    return <div style={{ display: "flex", justifyContent: "center" }}><AtmSimulator userId={101} /></div>;
  }

  if (type === "upi_simulator") {
    return <div style={{ display: "flex", justifyContent: "center" }}><UpiSimulator userId={101} /></div>;
  }

  if (type === "bank_simulator") {
    return <BankPortal userId={101} />;
  }

  // fallback
  return (
    <div style={{ background: "#1E293B", borderRadius: 20, padding: "28px 24px", color: "#CBD5E1", fontSize: 14, lineHeight: 1.7 }}>
      {data.headline && <div style={{ color: "#F59E0B", fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{data.headline}</div>}
      {data.prompt && <p style={{ margin: 0 }}>{data.prompt}</p>}
    </div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function ChatPanel({
  lesson,
  step,
  onClose,
}: {
  lesson: MoneyMindLessonPayload;
  step: MoneyMindLessonStep;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: `Hi! I'm Meera 👋 We're on "${step.label}". What's your question?` },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

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
          lessonId: lesson.lesson.id,
          lessonTitle: lesson.lesson.title,
          stepLabel: step.label,
          stepTutorText: step.tutorText,
          question: q,
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
    <div style={{
      position: "fixed", right: 0, top: 0, bottom: 0, width: "min(380px, 100vw)",
      background: "#0F172A", borderLeft: "1px solid #1E3A5F", display: "flex", flexDirection: "column",
      zIndex: 200, boxShadow: "-8px 0 24px rgba(0,0,0,0.4)",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>🤖 Ask Meera</div>
          <div style={{ color: "#64748B", fontSize: 11 }}>AI Tutor — {lesson.lesson.title}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 20 }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "82%", padding: "10px 14px", borderRadius: 14,
              background: m.role === "user" ? "#3B82F6" : "#1E293B",
              color: m.role === "user" ? "#fff" : "#E2E8F0",
              fontSize: 13, lineHeight: 1.6,
              borderTopRightRadius: m.role === "user" ? 4 : 14,
              borderTopLeftRadius: m.role === "ai" ? 4 : 14,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#1E293B", borderRadius: 14, padding: "10px 14px", color: "#64748B", fontSize: 13 }}>Meera is thinking…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1E293B", display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask anything about this lesson…"
          style={{ flex: 1, background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px", color: "#F1F5F9", fontSize: 13, outline: "none" }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1, fontSize: 13 }}
        >
          Send
        </button>
      </div>
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

  const step = lesson.steps[stepIndex];
  const totalSteps = lesson.steps.length;
  const isLastStep = stepIndex === totalSteps - 1;
  const hasPractice = !!step.practice;
  const needsCheck = hasPractice && !checked;
  const nextLesson = getNextLessonId(lesson.lesson.id);

  const checkAnswer = () => {
    if (!step.practice) return;
    const ans = step.practice.mode === "numeric" ? numericAnswer : selectedAnswer;
    const correct =
      step.practice.mode === "numeric"
        ? Math.abs(Number(ans) - Number(step.practice.answer)) < 0.01
        : String(ans).toLowerCase() === String(step.practice.answer).toLowerCase();
    setFeedback({
      correct,
      message: correct
        ? `Correct! 🎉 ${step.practice.hints?.[0] ?? ""}`
        : `Not quite. The answer is: ${step.practice.answer}`,
    });
    setChecked(true);
  };

  const advance = async () => {
    if (isLastStep) {
      setFinishing(true);
      await fetch("/api/moneymind/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          lesson_id: lesson.lesson.id,
          level_id: lesson.course.levelId,
          xp_earned: lesson.lesson.xpReward,
        }),
      }).catch(() => {});
      // Check if it's the last lesson in the level
      if (!nextLesson) {
        window.location.href = `/moneymind/level-complete?level=${lesson.course.levelId}`;
      } else {
        window.location.href = `/moneymind/learn/${lesson.course.levelSlug}/${nextLesson}`;
      }
      return;
    }
    setStepIndex(s => s + 1);
    setSelectedAnswer(null);
    setNumericAnswer("");
    setFeedback(null);
    setChecked(false);
  };

  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div style={{ background: "#030712", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#F1F5F9" }}>

      {/* Top bar */}
      <div style={{ background: "#0F172A", borderBottom: "1px solid #1E293B", padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
        <a href={`/moneymind/course/${lesson.course.levelSlug}`} style={{ color: "#64748B", textDecoration: "none", fontSize: 13, flexShrink: 0 }}>
          ← Back
        </a>
        <div style={{ flex: 1, background: "#1E293B", borderRadius: 100, height: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #10B981, #3B82F6)", width: `${progress}%`, transition: "width 0.4s ease", borderRadius: 100 }} />
        </div>
        <span style={{ color: "#64748B", fontSize: 12, flexShrink: 0 }}>
          {stepIndex + 1} / {totalSteps}
        </span>
        <button
          onClick={() => setChatOpen(c => !c)}
          style={{ background: "#1E293B", border: "1px solid #334155", color: "#93C5FD", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
        >
          🤖 Ask Meera
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 100px" }}>

        {/* Lesson title */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ color: "#64748B", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            {lesson.course.title} · Lesson {lesson.lesson.order}
          </div>
          <h1 style={{ color: "#F1F5F9", fontWeight: 900, fontSize: "clamp(20px, 4vw, 28px)", margin: "6px 0 0" }}>
            {lesson.lesson.title}
          </h1>
        </div>

        {/* Meera speech bubble */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ background: "linear-gradient(135deg, #1D4ED8, #7C3AED)", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            🤖
          </div>
          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "0 16px 16px 16px", padding: "14px 18px", color: "#CBD5E1", fontSize: 14, lineHeight: 1.7, flex: 1 }}>
            {step.tutorText}
          </div>
        </div>

        {/* Step label chip */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", borderRadius: 100, padding: "4px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
            {step.label}
          </span>
        </div>

        {/* Board */}
        <div style={{ marginBottom: 24 }}>
          <BoardCard step={step} />
        </div>

        {/* Explanation block */}
        {step.explanation && (
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: "14px 18px", marginBottom: 24 }}>
            <div style={{ color: "#FCD34D", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💡 {step.explanation.title}</div>
            <div style={{ color: "#FDE68A", fontSize: 13, lineHeight: 1.6 }}>{step.explanation.body}</div>
          </div>
        )}

        {/* Practice */}
        {hasPractice && step.practice && (
          <div style={{ background: "#1E293B", border: `2px solid ${checked ? (feedback?.correct ? "#10B981" : "#EF4444") : "#3B82F6"}`, borderRadius: 18, padding: "22px 20px", marginBottom: 24 }}>
            <div style={{ color: "#93C5FD", fontWeight: 800, fontSize: 13, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>
              ✏️ Quick Check
            </div>
            <p style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 600, marginBottom: 18, lineHeight: 1.5 }}>
              {step.practice.prompt}
            </p>

            {step.practice.mode === "mcq" && step.practice.options && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {step.practice.options.map((opt, i) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = checked && opt === String(step.practice!.answer);
                  const isWrong = checked && isSelected && !isCorrect;
                  return (
                    <button
                      key={i}
                      onClick={() => !checked && setSelectedAnswer(opt)}
                      style={{
                        background: isCorrect ? "rgba(16,185,129,0.2)" : isWrong ? "rgba(239,68,68,0.2)" : isSelected ? "rgba(59,130,246,0.2)" : "#0F172A",
                        border: `2px solid ${isCorrect ? "#10B981" : isWrong ? "#EF4444" : isSelected ? "#3B82F6" : "#334155"}`,
                        borderRadius: 10, padding: "12px 14px", color: "#E2E8F0", fontSize: 13, fontWeight: isSelected ? 700 : 400,
                        cursor: checked ? "default" : "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                    >
                      {isCorrect ? "✓ " : isWrong ? "✗ " : ""}{opt}
                    </button>
                  );
                })}
              </div>
            )}

            {step.practice.mode === "numeric" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#F59E0B", fontSize: 20, fontWeight: 800 }}>₹</span>
                  <input
                    type="number"
                    value={numericAnswer}
                    onChange={e => !checked && setNumericAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    style={{ background: "#0F172A", border: `2px solid ${checked ? (feedback?.correct ? "#10B981" : "#EF4444") : "#334155"}`, borderRadius: 10, padding: "12px 16px", color: "#F1F5F9", fontSize: 16, fontWeight: 700, width: 160, outline: "none" }}
                  />
                </div>
              </div>
            )}

            {step.practice.mode === "text" && (
              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  value={numericAnswer}
                  onChange={e => !checked && setNumericAnswer(e.target.value)}
                  placeholder="Type your answer…"
                  style={{ width: "100%", background: "#0F172A", border: `2px solid ${checked ? (feedback?.correct ? "#10B981" : "#EF4444") : "#334155"}`, borderRadius: 10, padding: "12px 16px", color: "#F1F5F9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            )}

            {feedback && (
              <div style={{ background: feedback.correct ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${feedback.correct ? "#10B981" : "#EF4444"}`, borderRadius: 10, padding: "12px 14px", color: feedback.correct ? "#6EE7B7" : "#FCA5A5", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                {feedback.message}
              </div>
            )}

            {!checked && (
              <button
                onClick={checkAnswer}
                disabled={!selectedAnswer && !numericAnswer}
                style={{ background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 800, fontSize: 14, cursor: "pointer", opacity: (!selectedAnswer && !numericAnswer) ? 0.5 : 1 }}
              >
                Check Answer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0F172A", borderTop: "1px solid #1E293B", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100 }}>
        <button
          onClick={() => { if (stepIndex > 0) { setStepIndex(s => s - 1); setSelectedAnswer(null); setNumericAnswer(""); setFeedback(null); setChecked(false); } }}
          disabled={stepIndex === 0}
          style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 14, cursor: stepIndex === 0 ? "not-allowed" : "pointer", opacity: stepIndex === 0 ? 0.4 : 1 }}
        >
          ← Prev
        </button>

        <div style={{ color: "#475569", fontSize: 12 }}>Step {stepIndex + 1} of {totalSteps}</div>

        <button
          onClick={advance}
          disabled={needsCheck || finishing}
          style={{
            background: isLastStep ? "linear-gradient(90deg, #FCD34D, #F59E0B)" : "#3B82F6",
            color: isLastStep ? "#451A03" : "#fff",
            border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 900, fontSize: 14,
            cursor: (needsCheck || finishing) ? "not-allowed" : "pointer",
            opacity: (needsCheck || finishing) ? 0.5 : 1,
          }}
        >
          {finishing ? "Saving…" : isLastStep ? "🏆 Complete Lesson" : "Next →"}
        </button>
      </div>

      {/* Chat panel */}
      {chatOpen && <ChatPanel lesson={lesson} step={step} onClose={() => setChatOpen(false)} />}
    </div>
  );
}
