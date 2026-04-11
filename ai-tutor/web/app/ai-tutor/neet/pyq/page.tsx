"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ChemText from "@/components/chem/ChemText";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PYQQuestion {
  questionId: string;
  subject: string;
  chapterCode: string;
  chapterTitle: string;
  year: string | null;
  questionText: string;
  options: { A: string; B: string; C: string; D: string };
  correctOption: string | null;
  hasImage: boolean;
  sourcePage: number | null;
}

interface Meta {
  total: number;
  limit: number;
  offset: number;
  years: string[];
  chapter: string | null;
  subject: string | null;
}

interface BoardStep { label: string; content: string; }
interface Explanation {
  narration: string;
  boardSteps: BoardStep[];
  concept: string;
  tip: string;
}

// ─── Chapter list (chemistry only for now) ───────────────────────────────────
const CHEMISTRY_CHAPTERS: { code: string; title: string }[] = [
  { code: "CHEM_BASIC_CONCEPTS",    title: "Some Basic Concepts of Chemistry" },
  { code: "CHEM_ATOMIC_STRUCTURE",  title: "Structure of Atom" },
  { code: "CHEM_BONDING",           title: "Chemical Bonding" },
  { code: "CHEM_STATES_MATTER",     title: "States of Matter" },
  { code: "CHEM_THERMODYNAMICS",    title: "Thermodynamics" },
  { code: "CHEM_EQUILIBRIUM",       title: "Equilibrium" },
  { code: "CHEM_REDOX_SBLOCK",      title: "Redox Reactions and s-Block" },
  { code: "CHEM_PBLOCK",            title: "p-Block Elements" },
  { code: "CHEM_ORGANIC",           title: "Organic Chemistry" },
  { code: "CHEM_SOLUTIONS",         title: "Solutions" },
  { code: "CHEM_ELECTROCHEMISTRY",  title: "Electrochemistry" },
  { code: "CHEM_D_F_BLOCK",         title: "d- and f-Block Elements" },
  { code: "CHEM_DBLOCK_COORD",      title: "d-Block and Coordination Compounds" },
  { code: "CHEM_AMINES",            title: "Amines" },
  { code: "CHEM_BIOMOLECULES",      title: "Biomolecules" },
];

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

// ─── TTS helper ───────────────────────────────────────────────────────────────
async function speakText(text: string): Promise<void> {
  try {
    const res = await fetch("/api/voice/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 500), avatarId: "meera", pace: 0.95 }),
    });
    const data = await res.json();
    if (data.audioBase64) {
      const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      await audio.play();
      return;
    }
  } catch { /* fall through to browser TTS */ }
  // Browser TTS fallback
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9;
    utt.lang = "en-IN";
    window.speechSynthesis.speak(utt);
  }
}

// ─── Meera Explains Panel ─────────────────────────────────────────────────────
function MeeraExplainsPanel({ question, onClose }: { question: PYQQuestion; onClose: () => void }) {
  const [exp, setExp]           = useState<Explanation | null>(null);
  const [loading, setLoading]   = useState(true);
  const [visibleStep, setVisible] = useState(0);
  const [speaking, setSpeaking]  = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoading(true);
    setExp(null);
    setVisible(0);
    fetch("/api/neet/pyq/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText:  question.questionText,
        options:       question.options,
        correctOption: question.correctOption,
        chapterTitle:  question.chapterTitle,
        year:          question.year,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setExp(data);
        setLoading(false);
        // Animate board steps one by one
        let i = 0;
        intervalRef.current = setInterval(() => {
          i++;
          setVisible(i);
          if (i >= (data.boardSteps?.length ?? 0)) clearInterval(intervalRef.current!);
        }, 700);
      })
      .catch(() => setLoading(false));
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [question.questionId]);

  const handleSpeak = async () => {
    if (!exp?.narration || speaking) return;
    setSpeaking(true);
    await speakText(exp.narration).catch(() => {});
    setSpeaking(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#0F172A", border: "1px solid #334155", borderRadius: 16,
        width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#10B981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            M
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#F1F5F9" }}>Meera Explains</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{question.chapterTitle}{question.year ? ` · NEET ${question.year}` : ""}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "20px 22px" }}>
          {loading && (
            <div style={{ textAlign: "center", color: "#64748B", padding: "32px 0" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🧪</div>
              Meera is solving the question...
            </div>
          )}

          {!loading && exp && (
            <>
              {/* Narration card */}
              <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "14px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>🎓</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.6 }}>{exp.narration}</div>
                </div>
                <button
                  onClick={handleSpeak}
                  disabled={speaking}
                  title="Listen to Meera"
                  style={{ background: speaking ? "#334155" : "#1E3A5F", border: "1px solid #38BDF8", color: "#38BDF8", borderRadius: 8, padding: "6px 10px", cursor: speaking ? "default" : "pointer", fontSize: 16, flexShrink: 0 }}
                >
                  {speaking ? "🔊" : "▶"}
                </button>
              </div>

              {/* Whiteboard steps */}
              <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Whiteboard Solution
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {exp.boardSteps.map((step, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#1E293B", borderRadius: 8, padding: "12px 16px",
                      borderLeft: "3px solid #10B981",
                      opacity: i < visibleStep ? 1 : 0,
                      transform: i < visibleStep ? "translateX(0)" : "translateX(-12px)",
                      transition: "opacity 0.4s, transform 0.4s",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", marginBottom: 4 }}>
                      Step {i + 1}: {step.label}
                    </div>
                    <div style={{ fontSize: 14, color: "#CBD5E1", fontFamily: "monospace" }}>
                      <ChemText text={step.content} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Concept + Tip row */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200, background: "#0C2A4A", border: "1px solid #1E3A5F", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>Concept Tested</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#38BDF8" }}>{exp.concept}</div>
                </div>
                <div style={{ flex: 2, minWidth: 200, background: "#1A1A0A", border: "1px solid #3D3D00", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>Exam Tip</div>
                  <div style={{ fontSize: 13, color: "#FDE68A" }}>{exp.tip}</div>
                </div>
              </div>
            </>
          )}

          {!loading && !exp && (
            <div style={{ textAlign: "center", color: "#EF4444", padding: "24px 0" }}>
              Could not load explanation. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function PYQPracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedChapter, setSelectedChapter] = useState<string>(
    searchParams.get("chapter") ?? CHEMISTRY_CHAPTERS[0].code
  );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [shuffle, setShuffle] = useState(false);

  const [questions, setQuestions]   = useState<PYQQuestion[]>([]);
  const [meta, setMeta]             = useState<Meta | null>(null);
  const [loading, setLoading]       = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [answers, setAnswers]         = useState<Record<string, string>>({});
  const [revealed, setRevealed]       = useState<Record<string, boolean>>({});
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, skipped: 0 });

  // Meera Explains
  const [explainQ, setExplainQ] = useState<PYQQuestion | null>(null);

  const fetchQuestions = useCallback(async (chapter: string, year: string, sh: boolean) => {
    setLoading(true);
    setAnswers({});
    setRevealed({});
    setCurrentIdx(0);
    setSessionStats({ correct: 0, wrong: 0, skipped: 0 });
    try {
      const params = new URLSearchParams({ chapter, limit: "50", shuffle: String(sh) });
      if (year) params.set("year", year);
      const res  = await fetch(`/api/neet/pyq?${params}`);
      const data = await res.json();
      setQuestions(data.questions ?? []);
      setMeta(data.meta ?? null);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions(selectedChapter, selectedYear, shuffle);
  }, [selectedChapter, fetchQuestions]);

  const handleChapterChange = (code: string) => {
    setSelectedChapter(code);
    setSelectedYear("");
    router.replace(`/ai-tutor/neet/pyq?chapter=${code}`, { scroll: false });
  };

  const currentQ = questions[currentIdx];

  const handleSelect = (option: string) => {
    if (revealed[currentQ.questionId]) return;
    setAnswers((a) => ({ ...a, [currentQ.questionId]: option }));
    setRevealed((r) => ({ ...r, [currentQ.questionId]: true }));
    if (currentQ.correctOption) {
      if (option === currentQ.correctOption) setSessionStats((s) => ({ ...s, correct: s.correct + 1 }));
      else                                   setSessionStats((s) => ({ ...s, wrong:   s.wrong   + 1 }));
    }
  };

  const handleNext = () => {
    if (currentQ && !revealed[currentQ.questionId])
      setSessionStats((s) => ({ ...s, skipped: s.skipped + 1 }));
    setCurrentIdx((i) => Math.min(i + 1, questions.length - 1));
  };

  const handlePrev = () => setCurrentIdx((i) => Math.max(i - 1, 0));

  const chapterInfo = CHEMISTRY_CHAPTERS.find((c) => c.code === selectedChapter);
  const attempted   = Object.keys(answers).length;
  const totalQ      = questions.length;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#E2E8F0", fontFamily: "Inter, sans-serif" }}>
      {/* Meera Explains modal */}
      {explainQ && <MeeraExplainsPanel question={explainQ} onClose={() => setExplainQ(null)} />}

      {/* Top Bar */}
      <div style={{ background: "#1E293B", borderBottom: "1px solid #334155", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 20 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>PYQ Practice</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#F1F5F9" }}>{chapterInfo?.title ?? selectedChapter}</div>
        </div>
        {totalQ > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: "#052E16", color: "#4ADE80", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>{sessionStats.correct} correct</span>
            <span style={{ background: "#450A0A", color: "#F87171", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>{sessionStats.wrong} wrong</span>
            <span style={{ background: "#1E293B", color: "#94A3B8", padding: "3px 10px", borderRadius: 20, fontSize: 12, border: "1px solid #334155" }}>{attempted}/{totalQ} done</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 57px)" }}>
        {/* ── Sidebar ── */}
        <div style={{ width: 260, background: "#1E293B", borderRight: "1px solid #334155", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "16px 14px", borderBottom: "1px solid #334155" }}>
            <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Filters</div>
            <label style={{ fontSize: 12, color: "#94A3B8", display: "block", marginBottom: 4 }}>Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ width: "100%", background: "#0F172A", color: "#E2E8F0", border: "1px solid #334155", borderRadius: 6, padding: "6px 8px", fontSize: 13, marginBottom: 8 }}
            >
              <option value="">All Years</option>
              {(meta?.years ?? []).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94A3B8", cursor: "pointer", marginBottom: 10 }}>
              <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} style={{ accentColor: "#10B981" }} />
              Shuffle order
            </label>
            <button
              onClick={() => fetchQuestions(selectedChapter, selectedYear, shuffle)}
              style={{ width: "100%", background: "#10B981", color: "#fff", border: "none", borderRadius: 6, padding: "7px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Apply
            </button>
          </div>
          <div style={{ padding: "10px 0" }}>
            <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 14px 8px" }}>Chemistry Chapters</div>
            {CHEMISTRY_CHAPTERS.map((ch, i) => (
              <button
                key={ch.code}
                onClick={() => handleChapterChange(ch.code)}
                style={{
                  width: "100%", textAlign: "left", background: selectedChapter === ch.code ? "#0F172A" : "none",
                  border: "none", borderLeft: selectedChapter === ch.code ? "3px solid #10B981" : "3px solid transparent",
                  color: selectedChapter === ch.code ? "#F1F5F9" : "#94A3B8",
                  padding: "8px 14px", cursor: "pointer", fontSize: 12, lineHeight: 1.4,
                }}
              >
                <span style={{ color: "#475569", marginRight: 6 }}>{String(i + 1).padStart(2, "0")}.</span>
                {ch.title}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {loading && <div style={{ textAlign: "center", color: "#64748B", paddingTop: 80 }}>Loading questions...</div>}

          {!loading && questions.length === 0 && (
            <div style={{ textAlign: "center", color: "#64748B", paddingTop: 80 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <div style={{ fontSize: 16 }}>No questions found for this chapter yet.</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Questions will appear once this chapter is extracted from the PDF.</div>
            </div>
          )}

          {!loading && questions.length > 0 && currentQ && (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                  <span>Question {currentIdx + 1} of {totalQ}</span>
                  <span>{Math.round(((currentIdx + 1) / totalQ) * 100)}% through chapter</span>
                </div>
                <div style={{ height: 4, background: "#1E293B", borderRadius: 4 }}>
                  <div style={{ height: "100%", background: "#10B981", borderRadius: 4, width: `${((currentIdx + 1) / totalQ) * 100}%`, transition: "width 0.3s" }} />
                </div>
              </div>

              {/* Question card */}
              <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {currentQ.year && (
                    <span style={{ background: "#0C2A4A", color: "#38BDF8", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>NEET {currentQ.year}</span>
                  )}
                  <span style={{ background: "#052E16", color: "#4ADE80", padding: "3px 10px", borderRadius: 20, fontSize: 11 }}>Chemistry</span>
                  {currentQ.hasImage && <span style={{ background: "#2D1B69", color: "#A78BFA", padding: "3px 10px", borderRadius: 20, fontSize: 11 }}>Image</span>}
                </div>

                <div style={{ fontSize: 16, lineHeight: 1.7, color: "#F1F5F9", marginBottom: 24 }}>
                  <span style={{ color: "#64748B", fontWeight: 600, marginRight: 8 }}>Q{currentIdx + 1}.</span>
                  <ChemText text={currentQ.questionText} />
                </div>

                {currentQ.hasImage && (
                  <div style={{ background: "#0F172A", border: "1px dashed #334155", borderRadius: 8, padding: "16px", marginBottom: 16, textAlign: "center", color: "#475569", fontSize: 13 }}>
                    [Image required — upload image for this question]
                  </div>
                )}

                {/* Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {OPTION_LABELS.map((label) => {
                    const selected = answers[currentQ.questionId] === label;
                    const isRight  = currentQ.correctOption === label;
                    const shown    = revealed[currentQ.questionId];
                    let bg = "#0F172A", border = "#334155", color = "#CBD5E1";
                    let badge: string | null = null;
                    if (shown) {
                      if (isRight)         { bg = "#052E16"; border = "#16A34A"; color = "#4ADE80"; badge = "Correct"; }
                      else if (selected)   { bg = "#450A0A"; border = "#DC2626"; color = "#F87171"; badge = "Wrong"; }
                    } else if (selected) { bg = "#0C2A4A"; border = "#38BDF8"; color = "#E2E8F0"; }
                    return (
                      <button key={label} onClick={() => handleSelect(label)} disabled={!!shown}
                        style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 8, padding: "12px 16px", textAlign: "left", cursor: shown ? "default" : "pointer", color, fontSize: 14, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 12, transition: "all 0.15s" }}
                      >
                        <span style={{ fontWeight: 700, flexShrink: 0, width: 22, color: shown && isRight ? "#4ADE80" : shown && selected ? "#F87171" : "#64748B" }}>{label}.</span>
                        <span style={{ flex: 1 }}><ChemText text={currentQ.options[label] || "—"} /></span>
                        {badge && <span style={{ fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{badge}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Meera Explains button — shown after answer revealed */}
                {revealed[currentQ.questionId] && (
                  <div style={{ marginTop: 16, textAlign: "center" }}>
                    <button
                      onClick={() => setExplainQ(currentQ)}
                      style={{ background: "linear-gradient(135deg,#4C1D95,#7C3AED)", border: "none", color: "#fff", padding: "10px 28px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
                    >
                      🎓 Meera Explains This →
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
                <button onClick={handlePrev} disabled={currentIdx === 0}
                  style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 14, opacity: currentIdx === 0 ? 0.4 : 1 }}>
                  Previous
                </button>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", maxWidth: 480 }}>
                  {questions.map((q, i) => {
                    const ans     = answers[q.questionId];
                    const correct = ans && ans === q.correctOption;
                    const wrong   = ans && ans !== q.correctOption;
                    return (
                      <button key={q.questionId} onClick={() => setCurrentIdx(i)}
                        style={{ width: 24, height: 24, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 10, background: i === currentIdx ? "#10B981" : correct ? "#16A34A" : wrong ? "#DC2626" : "#334155", color: i === currentIdx || correct || wrong ? "#fff" : "#94A3B8", fontWeight: i === currentIdx ? 700 : 400 }}>
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <button onClick={handleNext} disabled={currentIdx === questions.length - 1}
                  style={{ background: "#10B981", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, opacity: currentIdx === questions.length - 1 ? 0.4 : 1 }}>
                  Next
                </button>
              </div>

              {/* Chapter complete summary */}
              {attempted === totalQ && (
                <div style={{ marginTop: 24, background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{sessionStats.correct / totalQ >= 0.7 ? "🎉" : sessionStats.correct / totalQ >= 0.4 ? "💪" : "📖"}</div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#F1F5F9", marginBottom: 4 }}>Chapter Complete!</div>
                  <div style={{ color: "#94A3B8", fontSize: 14, marginBottom: 16 }}>
                    {sessionStats.correct} / {totalQ} correct &nbsp;|&nbsp; Score: {Math.round((sessionStats.correct / totalQ) * 100)}%
                  </div>
                  <button onClick={() => fetchQuestions(selectedChapter, selectedYear, true)}
                    style={{ background: "#10B981", border: "none", color: "#fff", padding: "10px 28px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    Practice Again (Shuffled)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PYQPracticePage() {
  return (
    <Suspense fallback={<div style={{ background: "#0F172A", minHeight: "100vh", color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <PYQPracticeContent />
    </Suspense>
  );
}
