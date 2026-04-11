"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MockQuestion {
  questionId: string;
  chapterCode: string;
  subject: string;
  topic: string;
  questionText: string;
  imageUrl?: string | null;              // optional figure — circuit, graph, diagram etc.
  optionImages?: Partial<Record<string, string | null>>;  // per-option images
  options: Record<string, string>;
  correctOption: string;
  explanation: string;
  allOptionExplanations: Record<string, string>;
  difficulty: string;
  neetYear?: string;
}

type AnswerState = "unanswered" | "answered" | "marked" | "answered_marked";

interface QuestionStatus {
  selected: string | null;   // A/B/C/D or null
  state: AnswerState;
  timeTaken: number;         // seconds
}

interface TestResult {
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  score: number;
  maxScore: number;
  physicsScore: number;
  chemistryScore: number;
  biologyScore: number;
  timeTaken: number;
  answers: Record<string, QuestionStatus>;
  questions: MockQuestion[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_MINUTES = 200;
const TOTAL_SECONDS = TOTAL_MINUTES * 60;

const SUBJECT_CONFIG = {
  physics:   { label: "Physics",   emoji: "⚡", color: "#3B82F6", bg: "#1E3A5F" },
  chemistry: { label: "Chemistry", emoji: "🧪", color: "#10B981", bg: "#064E3B" },
  biology:   { label: "Biology",   emoji: "🧬", color: "#8B5CF6", bg: "#2E1065" },
};

const STATUS_COLORS = {
  unanswered:      { bg: "#1E293B", border: "#334155", text: "#94A3B8" },
  answered:        { bg: "#1D4ED8", border: "#3B82F6", text: "#fff" },
  marked:          { bg: "#7C3AED", border: "#8B5CF6", text: "#fff" },
  answered_marked: { bg: "#D97706", border: "#F59E0B", text: "#fff" },
};

function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function calcScore(questions: MockQuestion[], answers: Record<string, QuestionStatus>) {
  let correct = 0, incorrect = 0, skipped = 0;
  let phyScore = 0, chemScore = 0, bioScore = 0;

  for (const q of questions) {
    const ans = answers[q.questionId];
    if (!ans || ans.selected === null) { skipped++; continue; }
    const isCorrect = ans.selected === q.correctOption;
    if (isCorrect) {
      correct++;
      const pts = 4;
      if (q.subject === "physics") phyScore += pts;
      else if (q.subject === "chemistry") chemScore += pts;
      else bioScore += pts;
    } else {
      incorrect++;
      const pts = -1;
      if (q.subject === "physics") phyScore += pts;
      else if (q.subject === "chemistry") chemScore += pts;
      else bioScore += pts;
    }
  }
  return {
    correct, incorrect, skipped,
    score: correct * 4 - incorrect,
    maxScore: questions.length * 4,
    physicsScore: phyScore, chemistryScore: chemScore, biologyScore: bioScore,
  };
}

// ─── Instruction Screen ───────────────────────────────────────────────────────
function InstructionScreen({ questionCount, onStart }: { questionCount: Record<string, number>; onStart: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 700, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧬</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>NEET Mock Test</h1>
          <p style={{ color: "#94A3B8", marginTop: 8, fontSize: 15 }}>Full syllabus simulation — MEERA AI Tutor · RoboDynamics</p>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Questions", value: `${questionCount.total || 0}` },
            { label: "Duration", value: "200 min" },
            { label: "Max Score", value: `${(questionCount.total || 0) * 4}` },
            { label: "Marking", value: "+4 / -1" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#1E293B", borderRadius: 10, padding: "12px 20px", textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#8B5CF6" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Subject breakdown */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, justifyContent: "center" }}>
          {(["physics", "chemistry", "biology"] as const).map((s) => (
            <div key={s} style={{ background: SUBJECT_CONFIG[s].bg, border: `1px solid ${SUBJECT_CONFIG[s].color}40`, borderRadius: 10, padding: "10px 18px", textAlign: "center" }}>
              <span style={{ fontSize: 18 }}>{SUBJECT_CONFIG[s].emoji}</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: SUBJECT_CONFIG[s].color, marginTop: 2 }}>{SUBJECT_CONFIG[s].label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#F8FAFC" }}>{questionCount[s] || 0}Q</div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{ background: "#1E293B", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ color: "#F8FAFC", fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>📋 Instructions</h3>
          <ul style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>Each correct answer: <span style={{ color: "#10B981", fontWeight: 700 }}>+4 marks</span></li>
            <li>Each wrong answer: <span style={{ color: "#EF4444", fontWeight: 700 }}>−1 mark</span></li>
            <li>Skipped / unattempted: <span style={{ color: "#94A3B8", fontWeight: 700 }}>0 marks</span></li>
            <li>Timer starts when you click Start — cannot be paused</li>
            <li>You can mark questions for review and come back</li>
            <li>Navigate freely between Physics / Chemistry / Biology sections</li>
            <li>Auto-submits when timer reaches 00:00</li>
          </ul>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "Not visited", ...STATUS_COLORS.unanswered },
            { label: "Answered", ...STATUS_COLORS.answered },
            { label: "Marked for review", ...STATUS_COLORS.marked },
            { label: "Answered + Marked", ...STATUS_COLORS.answered_marked },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8" }}>
              <div style={{ width: 22, height: 22, borderRadius: 4, background: s.bg, border: `2px solid ${s.border}` }} />
              {s.label}
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          style={{
            width: "100%", padding: "16px 0", background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
            color: "#fff", border: "none", borderRadius: 12, fontSize: 18, fontWeight: 800,
            cursor: "pointer", letterSpacing: 1,
          }}
        >
          START TEST →
        </button>
        <div style={{ textAlign: "center", marginTop: 12, color: "#475569", fontSize: 12 }}>
          Once started, the 200-minute timer cannot be paused
        </div>
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({ result, questions, onReview, onRetake }: {
  result: TestResult;
  questions: MockQuestion[];
  onReview: () => void;
  onRetake: () => void;
}) {
  const pct = Math.round((result.score / result.maxScore) * 100);
  const rank = pct >= 90 ? "🏆 Excellent" : pct >= 70 ? "⭐ Good" : pct >= 50 ? "📈 Average" : "📚 Needs Work";
  const rankColor = pct >= 90 ? "#10B981" : pct >= 70 ? "#F59E0B" : pct >= 50 ? "#3B82F6" : "#EF4444";

  // Per-subject accuracy
  const subjStats = (["physics", "chemistry", "biology"] as const).map((s) => {
    const qs = questions.filter((q) => q.subject === s);
    let c = 0, w = 0;
    for (const q of qs) {
      const ans = result.answers[q.questionId];
      if (!ans?.selected) continue;
      if (ans.selected === q.correctOption) c++; else w++;
    }
    const score = (s === "physics" ? result.physicsScore : s === "chemistry" ? result.chemistryScore : result.biologyScore);
    const acc = qs.length > 0 ? Math.round((c / qs.length) * 100) : 0;
    return { s, qs: qs.length, c, w, score, acc };
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", padding: 24 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 20 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>
            {pct >= 90 ? "🏆" : pct >= 70 ? "⭐" : pct >= 50 ? "📈" : "📚"}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Mock Test Results</h1>
          <div style={{ color: rankColor, fontSize: 18, fontWeight: 700, marginTop: 6 }}>{rank}</div>
        </div>

        {/* Score card */}
        <div style={{ background: "linear-gradient(135deg, #1E1B4B, #2E1065)", border: "2px solid #7C3AED50", borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: rankColor, lineHeight: 1 }}>{result.score}</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 4 }}>out of {result.maxScore}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
            {[
              { label: "Correct", value: result.correct, color: "#10B981" },
              { label: "Wrong", value: result.incorrect, color: "#EF4444" },
              { label: "Skipped", value: result.skipped, color: "#94A3B8" },
              { label: "Attempted", value: result.attempted, color: "#3B82F6" },
              { label: "Time", value: fmtTime(result.timeTaken), color: "#F59E0B" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {subjStats.map(({ s, qs, c, w, score, acc }) => (
            <div key={s} style={{ background: SUBJECT_CONFIG[s].bg, border: `1px solid ${SUBJECT_CONFIG[s].color}50`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{SUBJECT_CONFIG[s].emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: SUBJECT_CONFIG[s].color }}>{SUBJECT_CONFIG[s].label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#F8FAFC", marginTop: 4 }}>{score}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
                {c}✓ {w}✗ of {qs}Q · {acc}% acc
              </div>
              {/* accuracy bar */}
              <div style={{ height: 4, background: "#1E293B", borderRadius: 2, marginTop: 8 }}>
                <div style={{ height: "100%", width: `${acc}%`, background: SUBJECT_CONFIG[s].color, borderRadius: 2, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onReview}
            style={{ flex: 1, padding: "14px 0", background: "#1E293B", border: "1px solid #334155", color: "#F8FAFC", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
          >
            📋 Review Answers
          </button>
          <button
            onClick={onRetake}
            style={{ flex: 1, padding: "14px 0", background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", border: "none", color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
          >
            🔄 Retake Test
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Review Screen ────────────────────────────────────────────────────────────
function ReviewScreen({ questions, answers, onBack }: {
  questions: MockQuestion[];
  answers: Record<string, QuestionStatus>;
  onBack: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "wrong" | "skipped">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = questions.filter((q) => {
    const ans = answers[q.questionId];
    if (filter === "wrong") return ans?.selected && ans.selected !== q.correctOption;
    if (filter === "skipped") return !ans?.selected;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", padding: 16 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingTop: 12 }}>
          <button onClick={onBack} style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Answer Review</h2>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {(["all", "wrong", "skipped"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700, border: "1px solid #334155",
                  background: filter === f ? "#7C3AED" : "#1E293B", color: filter === f ? "#fff" : "#94A3B8" }}
              >
                {f === "all" ? `All (${questions.length})` : f === "wrong" ? `Wrong (${questions.filter(q => { const a = answers[q.questionId]; return a?.selected && a.selected !== q.correctOption; }).length})` : `Skipped (${questions.filter(q => !answers[q.questionId]?.selected).length})`}
              </button>
            ))}
          </div>
        </div>

        {filtered.map((q, idx) => {
          const ans = answers[q.questionId];
          const selected = ans?.selected ?? null;
          const isCorrect = selected === q.correctOption;
          const isSkipped = !selected;
          const isExpanded = expandedId === q.questionId;
          const statusColor = isSkipped ? "#94A3B8" : isCorrect ? "#10B981" : "#EF4444";
          const statusIcon = isSkipped ? "○" : isCorrect ? "✓" : "✗";

          return (
            <div key={q.questionId} style={{ background: "#1E293B", border: `1px solid ${statusColor}30`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
              {/* Q header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : q.questionId)}
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", cursor: "pointer" }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${statusColor}20`, border: `1px solid ${statusColor}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, color: statusColor, fontWeight: 700 }}>
                  {statusIcon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: SUBJECT_CONFIG[q.subject as keyof typeof SUBJECT_CONFIG]?.color, fontWeight: 700, textTransform: "uppercase" }}>
                      {SUBJECT_CONFIG[q.subject as keyof typeof SUBJECT_CONFIG]?.emoji} {q.subject}
                    </span>
                    <span style={{ fontSize: 10, color: "#64748B" }}>{q.topic}</span>
                    {q.neetYear && <span style={{ fontSize: 10, color: "#F59E0B" }}>NEET {q.neetYear}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "#E2E8F0", lineHeight: 1.5 }}>
                    Q{idx + 1}. {q.questionText.length > 100 && !isExpanded ? q.questionText.slice(0, 100) + "…" : q.questionText}
                  </div>
                </div>
                <div style={{ color: "#475569", fontSize: 16, flexShrink: 0 }}>{isExpanded ? "▲" : "▼"}</div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid #334155", padding: "14px 16px" }}>
                  {/* Options */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                    {Object.entries(q.options).map(([key, text]) => {
                      const isCorrectOpt = key === q.correctOption;
                      const isSelectedOpt = key === selected;
                      let bg = "#0F172A", border = "#334155", textCol = "#94A3B8";
                      if (isCorrectOpt) { bg = "#064E3B"; border = "#10B981"; textCol = "#10B981"; }
                      else if (isSelectedOpt && !isCorrect) { bg = "#450A0A"; border = "#EF4444"; textCol = "#EF4444"; }
                      return (
                        <div key={key} style={{ display: "flex", gap: 10, padding: "8px 12px", borderRadius: 8, background: bg, border: `1px solid ${border}` }}>
                          <span style={{ fontWeight: 700, color: textCol, minWidth: 18 }}>{key}.</span>
                          <span style={{ color: textCol, fontSize: 13 }}>{text}</span>
                          {isCorrectOpt && <span style={{ marginLeft: "auto", color: "#10B981", fontSize: 11, fontWeight: 700 }}>✓ CORRECT</span>}
                          {isSelectedOpt && !isCorrect && <span style={{ marginLeft: "auto", color: "#EF4444", fontSize: 11, fontWeight: 700 }}>✗ YOUR ANSWER</span>}
                        </div>
                      );
                    })}
                  </div>
                  {/* Explanation */}
                  <div style={{ background: "#0F172A", borderRadius: 8, padding: 12, fontSize: 13, color: "#CBD5E1", lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 700, color: "#8B5CF6" }}>Explanation: </span>
                    {q.explanation}
                  </div>
                  {/* Option-wise explanations */}
                  {Object.keys(q.allOptionExplanations || {}).length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, marginBottom: 6 }}>WHY EACH OPTION:</div>
                      {Object.entries(q.allOptionExplanations).map(([k, v]) => (
                        <div key={k} style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4, lineHeight: 1.6 }}>
                          <span style={{ fontWeight: 700, color: k === q.correctOption ? "#10B981" : "#64748B" }}>{k}: </span>{v}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Test Screen ─────────────────────────────────────────────────────────
export default function MockTestPage() {
  const router = useRouter();

  // ── State machine: loading → instructions → test → results → review
  const [phase, setPhase] = useState<"loading" | "instructions" | "test" | "results" | "review">("loading");
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [questionsBySubject, setQuestionsBySubject] = useState<Record<string, MockQuestion[]>>({});
  const [questionCount, setQuestionCount] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  // ── Test state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [activeSubject, setActiveSubject] = useState<"physics" | "chemistry" | "biology">("physics");
  const [showPalette, setShowPalette] = useState(false);

  // ── Result state
  const [result, setResult] = useState<TestResult | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const qStartTimeRef = useRef<number>(Date.now());

  // ── Load questions
  useEffect(() => {
    fetch("/api/neet/mock-questions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); setPhase("instructions"); return; }
        const bySubject: Record<string, MockQuestion[]> = {
          physics: data.physics || [],
          chemistry: data.chemistry || [],
          biology: data.biology || [],
        };
        const all = [...bySubject.physics, ...bySubject.chemistry, ...bySubject.biology];
        setQuestionsBySubject(bySubject);
        setQuestions(all);
        setQuestionCount({ physics: bySubject.physics.length, chemistry: bySubject.chemistry.length, biology: bySubject.biology.length, total: all.length });
        // Init answer states
        const init: Record<string, QuestionStatus> = {};
        for (const q of all) init[q.questionId] = { selected: null, state: "unanswered", timeTaken: 0 };
        setAnswers(init);
        setPhase("instructions");
      })
      .catch((e) => { setError(e.message); setPhase("instructions"); });
  }, []);

  // ── Timer
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { submitTest(); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const submitTest = useCallback(() => {
    stopTimer();
    setAnswers((currentAnswers) => {
      setQuestions((currentQuestions) => {
        const timeTaken = TOTAL_SECONDS - timeLeft;
        const stats = calcScore(currentQuestions, currentAnswers);
        const testResult: TestResult = {
          ...stats,
          attempted: stats.correct + stats.incorrect,
          timeTaken,
          answers: currentAnswers,
          questions: currentQuestions,
        };
        setResult(testResult);
        
        // -- Save attempts to DB --
        const sessionKey = typeof window !== "undefined" ? localStorage.getItem("meera_session_key") : null;
        if (sessionKey) {
          const payloadAttempts = currentQuestions.map(q => {
            const ans = currentAnswers[q.questionId];
            return {
              questionId: q.questionId,
              chapterCode: q.chapterCode,
              subject: q.subject,
              selectedOption: ans?.selected ?? null,
              correctOption: q.correctOption,
              isCorrect: ans?.selected === q.correctOption,
              timeTakenSec: ans?.timeTaken ?? 0,
            };
          }).filter(a => a.selectedOption !== null); // Only save answered ones, or save skipped too. We save answered.

          if (payloadAttempts.length > 0) {
            fetch("/api/neet/attempts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                key: sessionKey,
                sessionType: "mock_test",
                attempts: payloadAttempts,
              })
            }).catch(console.error);
          }
        }
        // -------------------------

        // Save to localStorage
        const history = JSON.parse(localStorage.getItem("neet_mock_history") || "[]");
        history.unshift({ date: new Date().toISOString(), score: stats.score, maxScore: stats.correct * 4 + stats.incorrect * 4 + stats.skipped * 4, total: currentQuestions.length });
        localStorage.setItem("neet_mock_history", JSON.stringify(history.slice(0, 10)));
        setPhase("results");
        return currentQuestions;
      });
      return currentAnswers;
    });
  }, [stopTimer, timeLeft]);

  const handleStart = () => {
    setPhase("test");
    setCurrentIdx(0);
    qStartTimeRef.current = Date.now();
    startTimer();
  };

  // ── Navigate to subject
  const goToSubject = (subj: "physics" | "chemistry" | "biology") => {
    setActiveSubject(subj);
    const subjectQs = questionsBySubject[subj];
    if (subjectQs && subjectQs.length > 0) {
      const globalIdx = questions.findIndex((q) => q.questionId === subjectQs[0].questionId);
      if (globalIdx >= 0) setCurrentIdx(globalIdx);
    }
    setShowPalette(false);
  };

  // ── Navigate to question
  const goTo = (idx: number) => {
    // Record time on current question
    const elapsed = Math.round((Date.now() - qStartTimeRef.current) / 1000);
    const curQ = questions[currentIdx];
    if (curQ) {
      setAnswers((prev) => ({
        ...prev,
        [curQ.questionId]: { ...prev[curQ.questionId], timeTaken: (prev[curQ.questionId]?.timeTaken || 0) + elapsed },
      }));
    }
    qStartTimeRef.current = Date.now();
    setCurrentIdx(idx);
    // Update active subject
    const targetQ = questions[idx];
    if (targetQ) setActiveSubject(targetQ.subject as "physics" | "chemistry" | "biology");
    setShowPalette(false);
  };

  // ── Select answer
  const selectAnswer = (option: string) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => {
      const cur = prev[q.questionId];
      const newState: AnswerState = cur.state === "marked" ? "answered_marked" : "answered";
      return { ...prev, [q.questionId]: { ...cur, selected: option, state: newState } };
    });
  };

  // ── Clear answer
  const clearAnswer = () => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => {
      const cur = prev[q.questionId];
      const newState: AnswerState = cur.state === "answered_marked" ? "marked" : "unanswered";
      return { ...prev, [q.questionId]: { ...cur, selected: null, state: newState } };
    });
  };

  // ── Mark for review
  const toggleMark = () => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => {
      const cur = prev[q.questionId];
      let newState: AnswerState;
      if (cur.state === "marked") newState = "unanswered";
      else if (cur.state === "answered_marked") newState = "answered";
      else if (cur.state === "answered") newState = "answered_marked";
      else newState = "marked";
      return { ...prev, [q.questionId]: { ...cur, state: newState } };
    });
  };

  // ── Save & Next
  const saveAndNext = () => {
    if (currentIdx < questions.length - 1) goTo(currentIdx + 1);
  };

  // ── Computed stats
  const answeredCount = Object.values(answers).filter((a) => a.selected !== null).length;
  const markedCount = Object.values(answers).filter((a) => a.state === "marked" || a.state === "answered_marked").length;
  const timerColor = timeLeft < 600 ? "#EF4444" : timeLeft < 1800 ? "#F59E0B" : "#10B981";

  // ── Render phases
  if (phase === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 48, height: 48, border: "4px solid #334155", borderTop: "4px solid #8B5CF6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ color: "#8B5CF6", fontSize: 16, fontWeight: 600 }}>Loading questions…</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (phase === "instructions") {
    return (
      <>
        {error && (
          <div style={{ background: "#450A0A", color: "#FCA5A5", padding: "10px 16px", textAlign: "center", fontSize: 13 }}>
            ⚠ {error} — showing available questions
          </div>
        )}
        <InstructionScreen questionCount={questionCount} onStart={handleStart} />
      </>
    );
  }

  if (phase === "results" && result) {
    return (
      <ResultsScreen
        result={result}
        questions={questions}
        onReview={() => setPhase("review")}
        onRetake={() => {
          window.location.reload();
        }}
      />
    );
  }

  if (phase === "review" && result) {
    return (
      <ReviewScreen
        questions={questions}
        answers={result.answers}
        onBack={() => setPhase("results")}
      />
    );
  }

  // ── TEST PHASE ────────────────────────────────────────────────────────────
  const currentQ = questions[currentIdx];
  if (!currentQ) return null;
  const currentAns = answers[currentQ.questionId];
  const subjCfg = SUBJECT_CONFIG[activeSubject];

  // Get palette questions for active subject
  const paletteQs = questionsBySubject[activeSubject] || [];

  return (
    <div style={{ height: "100vh", background: "#0F172A", color: "#F8FAFC", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1E293B; } ::-webkit-scrollbar-thumb { background: #475569; border-radius: 2px; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ background: "#0F172A", borderBottom: "1px solid #1E293B", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {/* Subject tabs */}
        <div style={{ display: "flex", gap: 6 }}>
          {(["physics", "chemistry", "biology"] as const).map((s) => {
            const cfg = SUBJECT_CONFIG[s];
            const count = questionsBySubject[s]?.length || 0;
            const answered = questionsBySubject[s]?.filter((q) => answers[q.questionId]?.selected).length || 0;
            return (
              <button
                key={s}
                onClick={() => goToSubject(s)}
                style={{
                  padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, border: "1px solid",
                  borderColor: activeSubject === s ? cfg.color : "#334155",
                  background: activeSubject === s ? cfg.bg : "#1E293B",
                  color: activeSubject === s ? cfg.color : "#94A3B8",
                }}
              >
                {cfg.emoji} {cfg.label} <span style={{ opacity: 0.7 }}>{answered}/{count}</span>
              </button>
            );
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Q counter */}
        <div style={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>
          Q <span style={{ color: "#F8FAFC", fontWeight: 800 }}>{currentIdx + 1}</span>/{questions.length}
        </div>

        {/* Timer */}
        <div style={{ background: "#1E293B", borderRadius: 8, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>⏱</span>
          <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: timerColor, letterSpacing: 1 }}>
            {fmtTime(timeLeft)}
          </span>
        </div>

        {/* Palette toggle */}
        <button
          onClick={() => setShowPalette((v) => !v)}
          style={{ padding: "6px 12px", background: showPalette ? "#334155" : "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#94A3B8", cursor: "pointer", fontSize: 12 }}
        >
          📊 {answeredCount}/{questions.length}
        </button>

        {/* Submit */}
        <button
          onClick={submitTest}
          style={{ padding: "6px 16px", background: "#DC2626", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
        >
          Submit
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── QUESTION PANEL ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Question area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* Q meta */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ background: subjCfg.bg, color: subjCfg.color, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, border: `1px solid ${subjCfg.color}40` }}>
                {subjCfg.emoji} {subjCfg.label.toUpperCase()}
              </span>
              <span style={{ color: "#64748B", fontSize: 11 }}>{currentQ.topic}</span>
              {currentQ.neetYear && <span style={{ color: "#F59E0B", fontSize: 11, fontWeight: 700 }}>★ NEET {currentQ.neetYear}</span>}
              <span style={{ color: "#475569", fontSize: 11 }}>
                {currentQ.difficulty === "easy" ? "🟢" : currentQ.difficulty === "hard" ? "🔴" : "🟡"} {currentQ.difficulty}
              </span>
            </div>

            {/* Question text */}
            <div style={{ fontSize: 16, color: "#F8FAFC", lineHeight: 1.7, marginBottom: currentQ.imageUrl ? 16 : 24, fontWeight: 500 }}>
              <span style={{ color: "#64748B", marginRight: 8, fontWeight: 700 }}>Q{currentIdx + 1}.</span>
              {currentQ.questionText}
            </div>

            {/* Question figure (optional) */}
            {currentQ.imageUrl && (
              <figure style={{ margin: "0 0 20px", padding: 0 }}>
                <img
                  src={currentQ.imageUrl}
                  alt="Question figure"
                  style={{
                    maxWidth: "100%", display: "block",
                    borderRadius: 8, border: "1px solid #1E293B",
                    background: "#fff",
                  }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <figcaption style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>📐 Refer to the figure above</figcaption>
              </figure>
            )}

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(currentQ.options).map(([key, text]) => {
                const isSelected = currentAns?.selected === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectAnswer(key)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
                      borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      background: isSelected ? `${subjCfg.color}20` : "#1E293B",
                      border: `2px solid ${isSelected ? subjCfg.color : "#334155"}`,
                      color: isSelected ? "#F8FAFC" : "#CBD5E1",
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: isSelected ? subjCfg.color : "#0F172A",
                      border: `1px solid ${isSelected ? subjCfg.color : "#475569"}`,
                      fontSize: 13, fontWeight: 800, color: isSelected ? "#fff" : "#94A3B8",
                    }}>
                      {key}
                    </div>
                    <span style={{ fontSize: 14, lineHeight: 1.6, paddingTop: 2 }}>{text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── BOTTOM ACTION BAR ── */}
          <div style={{ borderTop: "1px solid #1E293B", padding: "12px 24px", display: "flex", gap: 10, flexShrink: 0, background: "#0F172A" }}>
            <button
              onClick={() => goTo(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              style={{ padding: "10px 18px", background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: currentIdx === 0 ? "#334155" : "#94A3B8", cursor: currentIdx === 0 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700 }}
            >
              ← Prev
            </button>

            <button
              onClick={clearAnswer}
              style={{ padding: "10px 18px", background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#94A3B8", cursor: "pointer", fontSize: 13 }}
            >
              Clear
            </button>

            <button
              onClick={toggleMark}
              style={{
                padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, border: "1px solid",
                borderColor: (currentAns?.state === "marked" || currentAns?.state === "answered_marked") ? "#8B5CF6" : "#334155",
                background: (currentAns?.state === "marked" || currentAns?.state === "answered_marked") ? "#2E1065" : "#1E293B",
                color: (currentAns?.state === "marked" || currentAns?.state === "answered_marked") ? "#8B5CF6" : "#94A3B8",
              }}
            >
              🔖 {(currentAns?.state === "marked" || currentAns?.state === "answered_marked") ? "Marked" : "Mark"}
            </button>

            <div style={{ flex: 1 }} />

            <button
              onClick={saveAndNext}
              disabled={currentIdx === questions.length - 1}
              style={{ padding: "10px 20px", background: subjCfg.color, border: "none", borderRadius: 8, color: "#fff", cursor: currentIdx === questions.length - 1 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, opacity: currentIdx === questions.length - 1 ? 0.5 : 1 }}
            >
              Save & Next →
            </button>
          </div>
        </div>

        {/* ── QUESTION PALETTE (right sidebar) ── */}
        {showPalette && (
          <div style={{ width: 260, borderLeft: "1px solid #1E293B", background: "#0F172A", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            {/* Summary */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #1E293B" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", marginBottom: 8 }}>QUESTION PALETTE</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Answered", value: answeredCount, color: STATUS_COLORS.answered.bg },
                  { label: "Marked", value: markedCount, color: STATUS_COLORS.marked.bg },
                  { label: "Not done", value: questions.length - answeredCount, color: STATUS_COLORS.unanswered.bg },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#1E293B", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#94A3B8" }}>
                    <span style={{ color: "#F8FAFC", fontWeight: 700 }}>{s.value}</span> {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Subject tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #1E293B" }}>
              {(["physics", "chemistry", "biology"] as const).map((s) => (
                <button key={s} onClick={() => setActiveSubject(s)}
                  style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700,
                    background: activeSubject === s ? SUBJECT_CONFIG[s].bg : "#0F172A",
                    color: activeSubject === s ? SUBJECT_CONFIG[s].color : "#475569",
                    borderBottom: activeSubject === s ? `2px solid ${SUBJECT_CONFIG[s].color}` : "2px solid transparent",
                  }}>
                  {SUBJECT_CONFIG[s].emoji}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5 }}>
                {paletteQs.map((q, i) => {
                  const globalIdx = questions.findIndex((gq) => gq.questionId === q.questionId);
                  const ans = answers[q.questionId];
                  const sc = STATUS_COLORS[ans?.state || "unanswered"];
                  const isCurrent = globalIdx === currentIdx;
                  return (
                    <button
                      key={q.questionId}
                      onClick={() => goTo(globalIdx)}
                      style={{
                        width: "100%", aspectRatio: "1", borderRadius: 6, border: `2px solid ${isCurrent ? "#F8FAFC" : sc.border}`,
                        background: isCurrent ? "#F8FAFC" : sc.bg,
                        color: isCurrent ? "#0F172A" : sc.text,
                        cursor: "pointer", fontSize: 11, fontWeight: 700,
                        outline: isCurrent ? "2px solid #8B5CF6" : "none",
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
