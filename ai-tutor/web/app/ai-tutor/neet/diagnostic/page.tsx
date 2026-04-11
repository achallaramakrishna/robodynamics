"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  saveDiagnosticToDb, savePlanToDb, loadProfileFromDb, generateLessonPlan,
  type DiagnosticResult, type ChapterDiagnostic, type NeetSubject,
} from "../../../../lib/neetPlanEngine";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DiagnosticQuestion {
  questionId: string;
  chapterCode: string;
  chapterTitle: string;
  subject: string;
  topic: string;
  questionText: string;
  options: Record<string, string>;
  correctOption: string;
  explanation: string;
  allOptionExplanations: Record<string, string>;
  difficulty: string;
  neetWeight: number;
}

interface QuestionAnswer {
  selected: string | null;
  timeTaken: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DIAGNOSTIC_MINUTES = 30;
const DIAGNOSTIC_SECONDS = DIAGNOSTIC_MINUTES * 60;

const SUBJECT_CONFIG = {
  physics:   { label: "Physics",   emoji: "⚡", color: "#3B82F6", bg: "#1E3A5F" },
  chemistry: { label: "Chemistry", emoji: "🧪", color: "#10B981", bg: "#064E3B" },
  biology:   { label: "Biology",   emoji: "🧬", color: "#8B5CF6", bg: "#2E1065" },
};

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Results calculation ──────────────────────────────────────────────────────
function buildDiagnosticResult(
  questions: DiagnosticQuestion[],
  answers: Record<string, QuestionAnswer>
): DiagnosticResult {
  // Per-chapter stats
  const chapterMap: Record<string, { ch: DiagnosticQuestion; attempted: number; correct: number }> = {};
  for (const q of questions) {
    if (!chapterMap[q.chapterCode]) {
      chapterMap[q.chapterCode] = { ch: q, attempted: 0, correct: 0 };
    }
    const ans = answers[q.questionId];
    if (ans?.selected) {
      chapterMap[q.chapterCode].attempted++;
      if (ans.selected === q.correctOption) chapterMap[q.chapterCode].correct++;
    }
  }

  const chapterStats: ChapterDiagnostic[] = Object.values(chapterMap).map(({ ch, attempted, correct }) => ({
    chapterCode: ch.chapterCode,
    subject: ch.subject as NeetSubject,
    title: ch.chapterTitle,
    attempted,
    correct,
    accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
    neetWeight: ch.neetWeight,
  }));

  // Subject accuracy
  const subjStats: Record<NeetSubject, { attempted: number; correct: number }> = {
    physics: { attempted: 0, correct: 0 },
    chemistry: { attempted: 0, correct: 0 },
    biology: { attempted: 0, correct: 0 },
  };
  for (const q of questions) {
    const ans = answers[q.questionId];
    const s = q.subject as NeetSubject;
    if (ans?.selected) {
      subjStats[s].attempted++;
      if (ans.selected === q.correctOption) subjStats[s].correct++;
    }
  }

  const subjectAccuracy: Record<NeetSubject, number> = {
    physics:   subjStats.physics.attempted   > 0 ? Math.round((subjStats.physics.correct   / subjStats.physics.attempted)   * 100) : 0,
    chemistry: subjStats.chemistry.attempted > 0 ? Math.round((subjStats.chemistry.correct / subjStats.chemistry.attempted) * 100) : 0,
    biology:   subjStats.biology.attempted   > 0 ? Math.round((subjStats.biology.correct   / subjStats.biology.attempted)   * 100) : 0,
  };

  const totalAttempted = questions.filter((q) => answers[q.questionId]?.selected).length;
  const totalCorrect = questions.filter((q) => answers[q.questionId]?.selected === q.correctOption).length;

  // Extrapolate to /720: score in diagnostic × (720 / (diagnostic total × 4)) × 4
  // Simpler: accuracy across subjects → estimate full NEET score
  const avgAccuracy = (subjectAccuracy.physics + subjectAccuracy.chemistry + subjectAccuracy.biology) / 3;
  const estimatedScore = Math.min(720, Math.max(0, Math.round(avgAccuracy * 5.4))); // 100% acc → 540 base; adjust upward for partial

  return {
    completedAt: new Date().toISOString(),
    totalAttempted,
    totalCorrect,
    estimatedScore,
    chapterStats,
    subjectAccuracy,
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DiagnosticPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "intro" | "test" | "submitting" | "result">("loading");
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIAGNOSTIC_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const qStartRef = useRef(Date.now());
  const [studentName, setStudentName] = useState<string>("");

  // Load questions + student name from DB
  useEffect(() => {
    // Load student name for intro screen
    loadProfileFromDb().then((p) => { if (p?.name) setStudentName(p.name); });

    fetch("/api/neet/diagnostic-questions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); }
        const qs: DiagnosticQuestion[] = data.questions || [];
        setQuestions(qs);
        const init: Record<string, QuestionAnswer> = {};
        for (const q of qs) init[q.questionId] = { selected: null, timeTaken: 0 };
        setAnswers(init);
        setPhase("intro");
      })
      .catch((e) => { setError(e.message); setPhase("intro"); });
  }, []);

  const submitTest = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("submitting");
    const diagResult = buildDiagnosticResult(questions, answers);
    await saveDiagnosticToDb(diagResult);
    const prof = await loadProfileFromDb();
    if (prof) {
      const plan = generateLessonPlan(prof, diagResult, 600);
      await savePlanToDb(plan);
    }
    setResult(diagResult);
    setPhase("result");
  }, [questions, answers]);

  const startTest = () => {
    setPhase("test");
    qStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { submitTest(); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const selectOption = (option: string) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.questionId]: { ...prev[q.questionId], selected: option } }));
  };

  const goNext = () => {
    const elapsed = Math.round((Date.now() - qStartRef.current) / 1000);
    const q = questions[currentIdx];
    if (q) setAnswers((prev) => ({ ...prev, [q.questionId]: { ...prev[q.questionId], timeTaken: (prev[q.questionId]?.timeTaken || 0) + elapsed } }));
    qStartRef.current = Date.now();
    if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1);
    else submitTest();
  };

  const goPrev = () => {
    if (currentIdx > 0) { setCurrentIdx((i) => i - 1); qStartRef.current = Date.now(); }
  };

  const timerColor = timeLeft < 300 ? "#EF4444" : timeLeft < 600 ? "#F59E0B" : "#10B981";
  const answered = Object.values(answers).filter((a) => a.selected).length;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 48, height: 48, border: "4px solid #334155", borderTop: "4px solid #8B5CF6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ color: "#8B5CF6", fontWeight: 600 }}>Preparing your diagnostic…</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    const name = studentName || "there";
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔬</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>Diagnostic Test</h1>
          <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 28 }}>
            Hi {name}! Let me find your current level so I can build the perfect plan for you.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
            {[
              { icon: "❓", label: `${questions.length} Questions`, sub: "15 per subject" },
              { icon: "⏱", label: "30 Minutes", sub: "~40 sec per Q" },
              { icon: "📊", label: "Baseline Score", sub: "extrapolated to /720" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#1E293B", borderRadius: 10, padding: "14px 20px" }}>
                <div style={{ fontSize: 24 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, marginTop: 4 }}>{s.label}</div>
                <div style={{ color: "#64748B", fontSize: 11 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {error && <div style={{ background: "#450A0A", color: "#FCA5A5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>⚠ {error}</div>}

          <div style={{ background: "#1E293B", borderRadius: 12, padding: 16, marginBottom: 24, textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#8B5CF6", marginBottom: 8 }}>📋 Instructions</div>
            <ul style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
              <li>Answer honestly — no score is "bad", it just tells me where to start</li>
              <li>Skip if unsure — it's fine to leave questions blank</li>
              <li>No negative marking in this diagnostic</li>
              <li>Timer auto-submits at 00:00</li>
            </ul>
          </div>

          <button onClick={startTest}
            style={{ width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer" }}>
            Start Diagnostic →
          </button>
        </div>
      </div>
    );
  }

  // ── Submitting ─────────────────────────────────────────────────────────────
  if (phase === "submitting") {
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <div style={{ width: 56, height: 56, border: "4px solid #334155", borderTop: "4px solid #8B5CF6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>Analysing your results…</div>
        <div style={{ color: "#8B5CF6", fontSize: 14 }}>Building your personalised NEET plan ✨</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const name = studentName || "there";
    const score = result.estimatedScore;
    const tier = score >= 550 ? { label: "Strong Foundation", color: "#10B981", icon: "🏆" }
               : score >= 400 ? { label: "Good Start",        color: "#F59E0B", icon: "⭐" }
               : score >= 250 ? { label: "Building Base",     color: "#3B82F6", icon: "📈" }
               :                { label: "Starting Fresh",    color: "#8B5CF6", icon: "🌱" };

    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 600, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 52 }}>{tier.icon}</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "8px 0 4px" }}>Diagnostic Complete, {name}!</h1>
            <div style={{ color: tier.color, fontSize: 17, fontWeight: 700 }}>{tier.label}</div>
          </div>

          {/* Estimated score */}
          <div style={{ background: "linear-gradient(135deg,#1E1B4B,#2E1065)", border: "2px solid #7C3AED50", borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 20 }}>
            <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 4 }}>Estimated Current Score</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: tier.color, lineHeight: 1 }}>{score}</div>
            <div style={{ color: "#64748B", fontSize: 15 }}>out of 720</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{result.totalCorrect}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Correct</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#EF4444" }}>{result.totalAttempted - result.totalCorrect}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Wrong</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#94A3B8" }}>{questions.length - result.totalAttempted}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Skipped</div>
              </div>
            </div>
          </div>

          {/* Subject accuracy bars */}
          <div style={{ background: "#1E293B", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#8B5CF6", marginBottom: 14 }}>Subject Accuracy</div>
            {(["biology", "physics", "chemistry"] as NeetSubject[]).map((s) => {
              const acc = result.subjectAccuracy[s];
              const cfg = SUBJECT_CONFIG[s];
              return (
                <div key={s} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: cfg.color, fontSize: 13, fontWeight: 700 }}>{cfg.emoji} {cfg.label}</span>
                    <span style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 800 }}>{acc}%</span>
                  </div>
                  <div style={{ height: 8, background: "#0F172A", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${acc}%`, background: cfg.color, borderRadius: 4, transition: "width 1s" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* What's next */}
          <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", marginBottom: 8 }}>🗺 What MEERA built for you:</div>
            <ul style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
              <li>Personalised lesson plan based on your weak areas</li>
              <li>Daily + weekly targets aligned to your study hours</li>
              <li>Mock test schedule based on days to NEET</li>
              <li>Priority chapter list — most impactful chapters first</li>
            </ul>
          </div>

          <button onClick={() => router.push("/ai-tutor/neet/dashboard")}
            style={{ width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer" }}>
            See My Plan →
          </button>
        </div>
      </div>
    );
  }

  // ── Test phase ─────────────────────────────────────────────────────────────
  const currentQ = questions[currentIdx];
  if (!currentQ) return null;
  const currentAns = answers[currentQ.questionId];
  const subjCfg = SUBJECT_CONFIG[currentQ.subject as keyof typeof SUBJECT_CONFIG] || SUBJECT_CONFIG.biology;
  const progressPct = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div style={{ height: "100vh", background: "#0F172A", color: "#F8FAFC", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #475569; border-radius: 2px; }`}</style>

      {/* Top bar */}
      <div style={{ background: "#0F172A", borderBottom: "1px solid #1E293B", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ color: "#8B5CF6", fontWeight: 800, fontSize: 13 }}>🔬 DIAGNOSTIC</div>
        <div style={{ flex: 1, height: 4, background: "#1E293B", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: subjCfg.color, transition: "width 0.3s" }} />
        </div>
        <div style={{ color: "#94A3B8", fontSize: 12 }}>Q{currentIdx + 1}/{questions.length}</div>
        <div style={{ color: "#94A3B8", fontSize: 12 }}>{answered} answered</div>
        <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: timerColor }}>{fmtTime(timeLeft)}</div>
        <button onClick={submitTest}
          style={{ padding: "6px 14px", background: "#DC2626", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
          Submit
        </button>
      </div>

      {/* Question */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ background: subjCfg.bg, color: subjCfg.color, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{subjCfg.emoji} {subjCfg.label.toUpperCase()}</span>
          <span style={{ color: "#64748B", fontSize: 11 }}>{currentQ.topic}</span>
          <span style={{ color: "#475569", fontSize: 11 }}>{currentQ.difficulty === "easy" ? "🟢" : currentQ.difficulty === "hard" ? "🔴" : "🟡"} {currentQ.difficulty}</span>
        </div>

        <div style={{ fontSize: 16, color: "#F8FAFC", lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>
          <span style={{ color: "#64748B", marginRight: 8, fontWeight: 700 }}>Q{currentIdx + 1}.</span>
          {currentQ.questionText}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(currentQ.options).map(([key, text]) => {
            const isSelected = currentAns?.selected === key;
            return (
              <button key={key} onClick={() => selectOption(key)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
                  borderRadius: 10, cursor: "pointer", textAlign: "left",
                  background: isSelected ? `${subjCfg.color}20` : "#1E293B",
                  border: `2px solid ${isSelected ? subjCfg.color : "#334155"}`,
                  color: isSelected ? "#F8FAFC" : "#CBD5E1", transition: "all 0.15s",
                }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isSelected ? subjCfg.color : "#0F172A",
                  border: `1px solid ${isSelected ? subjCfg.color : "#475569"}`,
                  fontSize: 13, fontWeight: 800, color: isSelected ? "#fff" : "#94A3B8",
                }}>{key}</div>
                <span style={{ fontSize: 14, lineHeight: 1.6, paddingTop: 2 }}>{text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ borderTop: "1px solid #1E293B", padding: "12px 24px", display: "flex", gap: 10, flexShrink: 0, background: "#0F172A" }}>
        <button onClick={goPrev} disabled={currentIdx === 0}
          style={{ padding: "10px 18px", background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: currentIdx === 0 ? "#334155" : "#94A3B8", cursor: currentIdx === 0 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700 }}>
          ← Prev
        </button>
        <button
          onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.questionId]: { ...prev[currentQ.questionId], selected: null } }))}
          style={{ padding: "10px 18px", background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>
          Skip
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={goNext}
          style={{ padding: "10px 24px", background: subjCfg.color, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 800 }}>
          {currentIdx === questions.length - 1 ? "Finish →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
