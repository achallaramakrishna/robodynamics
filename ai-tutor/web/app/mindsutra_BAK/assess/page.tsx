"use client";

// ─────────────────────────────────────────────────────────────────────────────
// /mindsutra/assess — Public Free Placement Assessment
// 3-step flow: Details → Quiz → Results + Level Roadmap
// Works without login. Saves lead to rd_vm_leads.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type QuizQuestion = {
  id: string;
  question: string;
  options: Record<string, string>;
  sutra_hint: string;
  topic: string;
};

type QuizResult = {
  id: string;
  studentAnswer: string | null;
  correct: boolean;
  correctAnswer: string;
  explanation: string;
};

type LevelInfo = {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  color: string;
  lessons: { title: string; sutra: string }[];
};

// ── Level display data ────────────────────────────────────────────────────────

const LEVEL_DATA: Record<string, LevelInfo> = {
  L1: {
    id: "L1", name: "Foundation", tagline: "Build the speed base every student needs",
    emoji: "🌱", color: "#22C55E",
    lessons: [
      { title: "Fast Addition with Complements", sutra: "Pūraṇāpūraṇābhyām" },
      { title: "Tables 11–19 by Pattern", sutra: "Ekadhikena Pūrveṇa" },
      { title: "Doubling & Halving Tricks", sutra: "Ānurūpyena" },
      { title: "Multiply by 11 — Middle-Sum", sutra: "Ekadhikena Pūrveṇa" },
      { title: "Borrow-Free Subtraction", sutra: "Nikhilam" },
      { title: "Multiply by 5 and 25", sutra: "Ānurūpyena" },
      { title: "Near-100 Mental Math", sutra: "Nikhilam" },
      { title: "Criss-Cross 2-Digit Multiplication", sutra: "Ūrdhva-Tiryagbhyām" },
    ],
  },
  L2: {
    id: "L2", name: "Speed Builder", tagline: "Unlock powerful shortcuts for exams",
    emoji: "⚡", color: "#3B82F6",
    lessons: [
      { title: "Near-100 Multiplication", sutra: "Nikhilam" },
      { title: "Squares Near 50", sutra: "Yāvadūnam" },
      { title: "HCF & LCM Shortcuts", sutra: "Ānurūpyena" },
      { title: "3-Digit Criss-Cross", sutra: "Ūrdhva-Tiryagbhyām" },
      { title: "Flag Division", sutra: "Dhvajāṅka" },
      { title: "Decimal Point Mastery", sutra: "Ānurūpyena" },
      { title: "Fraction Simplification", sutra: "Pūraṇāpūraṇābhyām" },
      { title: "Running Remainder Division", sutra: "Paravartya" },
    ],
  },
  L3: {
    id: "L3", name: "Power Level", tagline: "Algebra, integers, and advanced patterns",
    emoji: "🔥", color: "#F59E0B",
    lessons: [
      { title: "Nikhilam with Any Base", sutra: "Nikhilam" },
      { title: "Paravartya Division", sutra: "Paravartya Yojayet" },
      { title: "Linear Equations — Vedic Style", sutra: "Āṇurūpye Śūnyam" },
      { title: "Squares with Ending 5", sutra: "Ekadhikena Pūrveṇa" },
      { title: "Integer Operations", sutra: "Ānurūpyena" },
      { title: "Ratio & Proportion Shortcuts", sutra: "Ānurūpyena" },
      { title: "Vinculum Numbers", sutra: "Nikhilam" },
      { title: "Algebraic Identities", sutra: "Ūrdhva-Tiryagbhyām" },
    ],
  },
  L4: {
    id: "L4", name: "Ace Level", tagline: "Complex problems in seconds",
    emoji: "🏆", color: "#8B5CF6",
    lessons: [
      { title: "Cube Roots & Cubes", sutra: "Ānurūpyena" },
      { title: "Near-1000 Multiplication", sutra: "Nikhilam" },
      { title: "Simultaneous Equations", sutra: "Paravartya" },
      { title: "Fraction Operations Speed", sutra: "Ūrdhva-Tiryagbhyām" },
      { title: "Square Roots (Perfect)", sutra: "Yāvadūnam" },
      { title: "Percentages — Vedic", sutra: "Ānurūpyena" },
      { title: "Indices & Surds", sutra: "Ānurūpyena" },
      { title: "Profit & Loss in Seconds", sutra: "Ānurūpyena" },
    ],
  },
  L5: {
    id: "L5", name: "Champion", tagline: "Competition-grade mental math mastery",
    emoji: "🌟", color: "#EC4899",
    lessons: [
      { title: "Calendars & Time Speed", sutra: "Ekadhikena" },
      { title: "Vedic Proofs & Number Theory", sutra: "Nikhilam" },
      { title: "Quadratic Equations", sutra: "Paravartya" },
      { title: "Trigonometry Shortcuts", sutra: "Ānurūpyena" },
      { title: "Advanced Fraction Chains", sutra: "Ūrdhva-Tiryagbhyām" },
      { title: "Competitive Exam Sprint", sutra: "Ānurūpyena" },
      { title: "Olympiad Number Patterns", sutra: "Vyaṣṭi Samaṣṭi" },
      { title: "Championship Practice", sutra: "All Sutras" },
    ],
  },
};

const WHATSAPP_NUMBER = "919876543210"; // Replace with actual school WhatsApp

function levelToCheckoutSlug(levelId: string): string {
  const normalized = String(levelId || "L1").toUpperCase();
  const mapping: Record<string, string> = {
    L1: "level-1",
    L2: "level-2",
    L3: "level-3",
    L4: "level-4",
    L5: "level-5",
  };
  return mapping[normalized] ?? "level-1";
}

function levelToRegisterGrade(levelId: string): number {
  const normalized = String(levelId || "L1").toUpperCase();
  const mapping: Record<string, number> = {
    L1: 4,
    L2: 5,
    L3: 6,
    L4: 7,
    L5: 8,
  };
  return mapping[normalized] ?? 4;
}

// ── Step 1 — Details Form ─────────────────────────────────────────────────────

function DetailsStep({ onNext }: { onNext: (d: DetailsData) => void }) {
  const [form, setForm] = useState<DetailsData>({
    studentName: "", schoolGrade: 5, schoolName: "", parentName: "", parentPhone: "", parentEmail: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DetailsData, string>>>({});

  function validate() {
    const e: Partial<Record<keyof DetailsData, string>> = {};
    if (!form.studentName.trim()) e.studentName = "Required";
    if (!form.schoolGrade || form.schoolGrade < 1 || form.schoolGrade > 12) e.schoolGrade = "Enter grade 1–12";
    if (!form.parentPhone.trim() || !/^[6-9]\d{9}$/.test(form.parentPhone.trim()))
      e.parentPhone = "Enter valid 10-digit mobile";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onNext(form);
  }

  const field = (key: keyof DetailsData, label: string, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
        {label} {(key === "studentName" || key === "parentPhone") && <span style={{ color: "#F87171" }}>*</span>}
      </label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => { setForm(f => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value })); setErrors(er => ({ ...er, [key]: undefined })); }}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 10,
          background: "#0F172A", border: `1.5px solid ${errors[key] ? "#F87171" : "#1E3A5F"}`,
          color: "#F1F5F9", fontSize: 15, outline: "none", boxSizing: "border-box",
        }}
      />
      {errors[key] && <div style={{ color: "#F87171", fontSize: 12, marginTop: 4 }}>{errors[key]}</div>}
    </div>
  );

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🧠</div>
        <h2 style={{ color: "#F1F5F9", fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>
          Free Vedic Math Level Test
        </h2>
        <p style={{ color: "#94A3B8", fontSize: 15, margin: 0 }}>
          5 questions · Takes 3 minutes · Get your personalised learning roadmap
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: "linear-gradient(135deg, #0D1B2A, #0F2040)",
        border: "1px solid #1E3A5F", borderRadius: 16, padding: 28,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div style={{ gridColumn: "1/3" }}>{field("studentName", "Student's Full Name", "text", "e.g. Aryan Sharma")}</div>
          <div>{field("schoolGrade", "Current Grade", "number", "5")}</div>
          <div>{field("schoolName", "School Name", "text", "Optional")}</div>
          <div>{field("parentName", "Parent's Name", "text", "Optional")}</div>
          <div>{field("parentPhone", "Parent's WhatsApp Number", "tel", "10-digit mobile")}</div>
          <div style={{ gridColumn: "1/3" }}>{field("parentEmail", "Parent's Email", "email", "Optional")}</div>
        </div>

        <button type="submit" style={{
          width: "100%", padding: "14px 0", borderRadius: 12,
          background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
          color: "#fff", fontSize: 16, fontWeight: 700, border: "none",
          cursor: "pointer", marginTop: 8, letterSpacing: 0.3,
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
        }}>
          Start My Level Test →
        </button>

        <p style={{ color: "#64748B", fontSize: 12, textAlign: "center", marginTop: 12 }}>
          🔒 Your details are secure and will not be shared with anyone.
        </p>
      </form>
    </div>
  );
}

type DetailsData = {
  studentName: string; schoolGrade: number; schoolName: string;
  parentName: string; parentPhone: string; parentEmail: string;
};

// ── Step 2 — Quiz ─────────────────────────────────────────────────────────────

function QuizStep({ grade, onDone }: { grade: number; onDone: (answers: Record<string, string>, skipped: boolean) => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 min
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      try {
        setLoading(true);
        setLoadError(null);

        const response = await fetch(`/api/mindsutra/placement-quiz?grade=${grade}`);
        if (!response.ok) {
          throw new Error(`Quiz service returned ${response.status}`);
        }

        const data = await response.json();
        if (cancelled) return;

        if (data.skip) {
          onDone({}, true);
          return;
        }

        const nextQuestions = Array.isArray(data.questions) ? data.questions : [];
        if (nextQuestions.length === 0) {
          throw new Error("No placement questions were returned.");
        }

        setQuestions(nextQuestions);
      } catch (err) {
        console.error("[assess] quiz load failed:", err);
        if (!cancelled) {
          setLoadError("We could not load the level test right now. Please retry in a moment.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuestions();
    return () => {
      cancelled = true;
    };
  }, [grade]);

  useEffect(() => {
    if (loading) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); submitAll(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [loading]);

  function pick(qId: string, opt: string) {
    setAnswers(a => ({ ...a, [qId]: opt }));
  }

  function submitAll() {
    clearInterval(timerRef.current!);
    onDone(answers, false);
  }

  function next() {
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else submitAll();
  }

  if (loading) return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
      <div style={{ color: "#94A3B8", fontSize: 16 }}>Loading your questions…</div>
    </div>
  );

  if (loadError) return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{
        background: "#1A1120",
        border: "1px solid #7F1D1D",
        borderRadius: 16,
        padding: 28,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 38, marginBottom: 12 }}>âš ï¸</div>
        <h3 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
          Quiz could not start
        </h3>
        <p style={{ color: "#FCA5A5", fontSize: 15, margin: "0 0 20px", lineHeight: 1.6 }}>
          {loadError}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 22px",
            borderRadius: 12,
            background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          Retry Assessment
        </button>
      </div>
    </div>
  );

  const q = questions[current];
  const mm = Math.floor(timeLeft / 60);
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ color: "#94A3B8", fontSize: 14, fontWeight: 600 }}>
          Question {current + 1} of {questions.length}
        </div>
        <div style={{
          color: timeLeft < 30 ? "#F87171" : "#34D399", fontSize: 14, fontWeight: 700,
          background: timeLeft < 30 ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)",
          padding: "4px 12px", borderRadius: 20,
        }}>
          ⏱ {mm}:{ss}
        </div>
      </div>
      <div style={{ height: 4, background: "#1E3A5F", borderRadius: 4, marginBottom: 28 }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
          width: `${((current + 1) / questions.length) * 100}%`,
          transition: "width 0.3s",
        }} />
      </div>

      {/* Question card */}
      <div style={{
        background: "linear-gradient(135deg, #0D1B2A, #0F2040)",
        border: "1px solid #1E3A5F", borderRadius: 16, padding: 28, marginBottom: 20,
      }}>
        <div style={{
          display: "inline-block", background: "rgba(99,102,241,0.15)",
          color: "#818CF8", fontSize: 12, fontWeight: 600, padding: "3px 10px",
          borderRadius: 20, marginBottom: 14,
        }}>
          {q.sutra_hint}
        </div>
        <h3 style={{ color: "#F1F5F9", fontSize: 20, fontWeight: 700, margin: "0 0 24px", lineHeight: 1.4 }}>
          {q.question}
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Object.entries(q.options).map(([key, val]) => {
            const selected = answers[q.id] === key;
            return (
              <button key={key} onClick={() => pick(q.id, key)} style={{
                padding: "14px 16px", borderRadius: 12, textAlign: "left", cursor: "pointer",
                border: `2px solid ${selected ? "#6366F1" : "#1E3A5F"}`,
                background: selected ? "rgba(99,102,241,0.15)" : "#070F1A",
                color: selected ? "#818CF8" : "#CBD5E1",
                fontSize: 15, fontWeight: selected ? 700 : 500,
                transition: "all 0.15s",
              }}>
                <span style={{
                  display: "inline-block", width: 24, height: 24, borderRadius: "50%",
                  background: selected ? "#6366F1" : "#1E3A5F",
                  color: selected ? "#fff" : "#94A3B8",
                  textAlign: "center", lineHeight: "24px", fontSize: 12,
                  fontWeight: 700, marginRight: 10, flexShrink: 0,
                }}>
                  {key}
                </span>
                {val}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={next}
        disabled={!answers[q.id]}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12,
          background: answers[q.id]
            ? "linear-gradient(90deg, #6366F1, #8B5CF6)"
            : "#1E3A5F",
          color: answers[q.id] ? "#fff" : "#475569",
          fontSize: 16, fontWeight: 700, border: "none",
          cursor: answers[q.id] ? "pointer" : "not-allowed",
          transition: "all 0.2s",
        }}
      >
        {current < questions.length - 1 ? "Next Question →" : "Submit My Test ✓"}
      </button>
    </div>
  );
}

// ── Step 3 — Results + Level Roadmap ──────────────────────────────────────────

function ResultsStep({
  details, answers, skipped, quizResults, placedLevel, correctCount,
}: {
  details: DetailsData;
  answers: Record<string, string>;
  skipped: boolean;
  quizResults: QuizResult[];
  placedLevel: string;
  correctCount: number;
}) {
  const level = LEVEL_DATA[placedLevel] ?? LEVEL_DATA["L1"];
  const levelOrder = parseInt(placedLevel.replace("L", ""), 10);
  const totalLevels = 5;
  const checkoutSlug = levelToCheckoutSlug(placedLevel);
  const registerGrade = levelToRegisterGrade(placedLevel);
  const registerUrl = `/auth/register?grade=${registerGrade}&source=mindsutra-assess&level=${placedLevel}`;
  const checkoutUrl = `/checkout/${checkoutSlug}`;
  const bundleUrl = "/checkout/bundle-mindsutra-5-levels";

  const whatsappMsg = encodeURIComponent(
    `Hi! ${details.studentName} (Grade ${details.schoolGrade}${details.schoolName ? `, ${details.schoolName}` : ""}) ` +
    `just completed the free Vedic Math level test and placed at *Level ${levelOrder} — ${level.name}*. ` +
    `Scored ${correctCount}/5. Interested to enrol! — ${details.parentName || details.parentPhone}`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Hero result */}
      <div style={{
        background: `linear-gradient(135deg, ${level.color}22, ${level.color}11)`,
        border: `2px solid ${level.color}44`,
        borderRadius: 20, padding: "32px 28px", marginBottom: 28, textAlign: "center",
      }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{level.emoji}</div>
        <div style={{ color: "#94A3B8", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          {details.studentName} • Grade {details.schoolGrade}
          {!skipped && ` • ${correctCount}/5 correct`}
        </div>
        <h2 style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
          Level {levelOrder} — {level.name}
        </h2>
        <p style={{ color: "#CBD5E1", fontSize: 16, margin: "0 0 20px" }}>{level.tagline}</p>

        {/* 5-level progression dots */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {Object.values(LEVEL_DATA).map((lv, i) => {
            const lNum = i + 1;
            const isCurrent = lv.id === placedLevel;
            const isDone = lNum < levelOrder;
            return (
              <div key={lv.id} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: isCurrent ? 48 : 36, height: isCurrent ? 48 : 36,
                  borderRadius: "50%",
                  background: isCurrent ? lv.color : isDone ? lv.color + "99" : "#1E3A5F",
                  border: `3px solid ${isCurrent ? lv.color : isDone ? lv.color + "66" : "#2D4A6A"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isCurrent ? 22 : 16,
                  boxShadow: isCurrent ? `0 0 20px ${lv.color}88` : "none",
                  transition: "all 0.3s",
                }}>
                  {isDone ? "✓" : lv.emoji}
                </div>
                {i < totalLevels - 1 && (
                  <div style={{
                    width: 24, height: 2,
                    background: lNum < levelOrder ? lv.color + "66" : "#1E3A5F",
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* What they'll learn */}
      <div style={{
        background: "#0D1B2A", border: "1px solid #1E3A5F",
        borderRadius: 16, padding: 24, marginBottom: 20,
      }}>
        <h3 style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
          📚 Your Level {levelOrder} Curriculum — 8 Lessons
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {level.lessons.map((lesson, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              background: "#070F1A", borderRadius: 10, padding: "10px 14px",
              border: "1px solid #1E3A5F",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: `${level.color}22`, color: level.color,
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{lesson.title}</div>
                <div style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>{lesson.sutra}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz breakdown (if not skipped) */}
      {!skipped && quizResults.length > 0 && (
        <div style={{
          background: "#0D1B2A", border: "1px solid #1E3A5F",
          borderRadius: 16, padding: 24, marginBottom: 20,
        }}>
          <h3 style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
            📊 Your Test Answers
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quizResults.map((r, i) => (
              <div key={r.id} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                background: "#070F1A", borderRadius: 10, padding: "10px 14px",
                border: `1px solid ${r.correct ? "#22C55E33" : "#EF444433"}`,
              }}>
                <div style={{
                  fontSize: 18, flexShrink: 0, marginTop: 1,
                }}>{r.correct ? "✅" : "❌"}</div>
                <div>
                  <div style={{ color: "#CBD5E1", fontSize: 13 }}>
                    <strong>Q{i + 1}</strong>
                    {r.studentAnswer
                      ? <> — You answered: <span style={{ color: r.correct ? "#34D399" : "#F87171", fontWeight: 700 }}>{r.studentAnswer}</span></>
                      : <span style={{ color: "#64748B" }}> — Not answered</span>
                    }
                    {!r.correct && <> → Correct: <span style={{ color: "#34D399", fontWeight: 700 }}>{r.correctAnswer}</span></>}
                  </div>
                  <div style={{ color: "#64748B", fontSize: 12, marginTop: 3 }}>{r.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA block */}
      <div style={{
        background: "linear-gradient(135deg, #0D1B2A, #12143A)",
        border: "1px solid #2D3A70", borderRadius: 16, padding: 28, textAlign: "center",
      }}>
        <h3 style={{ color: "#F1F5F9", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>
          🚀 Ready to Start Your Vedic Math Journey?
        </h3>
        <p style={{ color: "#94A3B8", fontSize: 14, margin: "0 0 24px" }}>
          Your child is ready for Level {levelOrder} — {level.name}. Create the parent account,
          complete purchase, and the student can start immediately.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420, margin: "0 auto" }}>
          <a
            href={registerUrl}
            style={{
              display: "block", padding: "15px 0", borderRadius: 12,
              background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
              color: "#fff", fontSize: 16, fontWeight: 700,
              textDecoration: "none", textAlign: "center",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            }}
          >
            Create Parent Account for Level {levelOrder} →
          </a>
          <a
            href={checkoutUrl}
            style={{
              display: "block", padding: "14px 0", borderRadius: 12,
              background: "#0F172A",
              border: `1.5px solid ${level.color}66`,
              color: level.color, fontSize: 15, fontWeight: 700,
              textDecoration: "none", textAlign: "center",
            }}
          >
            Buy Recommended Level Directly
          </a>
          <a
            href={bundleUrl}
            style={{
              display: "block", padding: "14px 0", borderRadius: 12,
              background: "transparent",
              border: "1.5px solid #334155",
              color: "#CBD5E1", fontSize: 14, fontWeight: 600,
              textDecoration: "none", textAlign: "center",
            }}
          >
            Buy All 5 Levels
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", padding: "15px 0", borderRadius: 12,
              background: "linear-gradient(90deg, #25D366, #128C7E)",
              color: "#fff", fontSize: 16, fontWeight: 700,
              textDecoration: "none", textAlign: "center",
              boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
            }}
          >
            💬 Ask on WhatsApp
          </a>
          <a
            href="/mindsutra"
            style={{
              display: "block", padding: "13px 0", borderRadius: 12,
              background: "transparent",
              border: "1.5px solid #334155",
              color: "#94A3B8", fontSize: 14, fontWeight: 600,
              textDecoration: "none", textAlign: "center",
            }}
          >
            ← Back to MindSutra Home
          </a>
        </div>

        <p style={{ color: "#475569", fontSize: 12, marginTop: 16 }}>
          Parent mobile on record: {details.parentPhone}. This result has also been saved for follow-up.
        </p>
      </div>
    </div>
  );
}

// ── Main Assess Page ──────────────────────────────────────────────────────────

type Step = "details" | "quiz" | "results";

export default function AssessPage() {
  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<DetailsData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [placedLevel, setPlacedLevel] = useState("L1");
  const [correctCount, setCorrectCount] = useState(0);
  const [saving, setSaving] = useState(false);

  async function handleDetailsNext(d: DetailsData) {
    setDetails(d);
    setStep("quiz");
  }

  async function handleQuizDone(ans: Record<string, string>, isSkipped: boolean) {
    if (!details) return;
    setAnswers(ans);
    setSkipped(isSkipped);
    setSaving(true);

    try {
      // Score the quiz
      const scoreResp = await fetch("/api/mindsutra/placement-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: 0, // guest — no account yet
          schoolGrade: details.schoolGrade,
          answers: ans,
        }),
      });
      const scoreData = await scoreResp.json();

      setPlacedLevel(scoreData.placedLevel ?? "L1");
      setCorrectCount(scoreData.correctCount ?? 0);
      setQuizResults(scoreData.results ?? []);

      // Save lead
      await fetch("/api/mindsutra/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: details.studentName,
          schoolGrade: details.schoolGrade,
          schoolName: details.schoolName,
          parentName: details.parentName,
          parentPhone: details.parentPhone,
          parentEmail: details.parentEmail,
          quizAnswers: ans,
          correctCount: scoreData.correctCount ?? 0,
          placedLevel: scoreData.placedLevel ?? "L1",
          utmSource: typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("utm_source") ?? "organic"
            : "organic",
        }),
      });
    } catch (err) {
      console.error("[assess] error:", err);
    } finally {
      setSaving(false);
      setStep("results");
    }
  }

  const STEP_LABELS = [
    { key: "details", label: "Your Details" },
    { key: "quiz",    label: "Level Quiz" },
    { key: "results", label: "Your Level" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#060D17",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: "0 0 60px",
    }}>
      {/* Top nav */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 28px", borderBottom: "1px solid #0F2040",
        background: "#070F1A",
      }}>
        <a href="/mindsutra" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🧮</span>
          <span style={{ color: "#818CF8", fontWeight: 800, fontSize: 18 }}>MindSutra</span>
          <span style={{ color: "#334155", fontSize: 14, fontWeight: 500, marginLeft: 4 }}>Vedic Math</span>
        </a>
        <div style={{ color: "#64748B", fontSize: 13 }}>Free Assessment</div>
      </div>

      {/* Stepper */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "24px 28px 32px", gap: 0,
      }}>
        {STEP_LABELS.map((s, i) => {
          const stepOrder = ["details", "quiz", "results"];
          const currentIdx = stepOrder.indexOf(step);
          const isActive = s.key === step;
          const isDone = stepOrder.indexOf(s.key) < currentIdx;
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: isActive ? "#6366F1" : isDone ? "#22C55E" : "#1E3A5F",
                  color: (isActive || isDone) ? "#fff" : "#475569",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                  boxShadow: isActive ? "0 0 0 4px rgba(99,102,241,0.3)" : "none",
                }}>
                  {isDone ? "✓" : i + 1}
                </div>
                <div style={{
                  color: isActive ? "#818CF8" : isDone ? "#22C55E" : "#475569",
                  fontSize: 11, fontWeight: 600, marginTop: 4, whiteSpace: "nowrap",
                }}>
                  {s.label}
                </div>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div style={{
                  width: 60, height: 2, margin: "0 4px",
                  background: isDone ? "#22C55E33" : "#1E3A5F",
                  marginBottom: 20,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: "0 20px" }}>
        {saving ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔄</div>
            <div style={{ color: "#94A3B8", fontSize: 16 }}>Scoring your test…</div>
          </div>
        ) : step === "details" ? (
          <DetailsStep onNext={handleDetailsNext} />
        ) : step === "quiz" && details ? (
          <QuizStep grade={details.schoolGrade} onDone={handleQuizDone} />
        ) : step === "results" && details ? (
          <ResultsStep
            details={details}
            answers={answers}
            skipped={skipped}
            quizResults={quizResults}
            placedLevel={placedLevel}
            correctCount={correctCount}
          />
        ) : null}
      </div>
    </div>
  );
}
