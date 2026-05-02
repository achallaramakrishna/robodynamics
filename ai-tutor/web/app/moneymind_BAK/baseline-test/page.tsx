"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FLAGS } from "../../../lib/featureFlags";

// ─── Test Questions ───────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "q1",
    question: "You have ₹500. You spend ₹180 on books and ₹95 on snacks. How much is left?",
    options: ["₹225", "₹235", "₹245", "₹275"],
    answer: "₹225",
    level: "L1",
    topic: "Basic arithmetic",
  },
  {
    id: "q2",
    question: "Which of these is a NEED (not a want)?",
    options: ["New video game", "School uniform", "Movie ticket", "Chocolate bar"],
    answer: "School uniform",
    level: "L1",
    topic: "Needs vs Wants",
  },
  {
    id: "q3",
    question: "What does ATM stand for?",
    options: ["Automated Teller Machine", "Automatic Transfer Mode", "Account Teller Module", "Advanced Transaction Manager"],
    answer: "Automated Teller Machine",
    level: "L2",
    topic: "Banking basics",
  },
  {
    id: "q4",
    question: "You receive a call from someone claiming to be from your bank, asking for your OTP to 'save' your account. What should you do?",
    options: [
      "Give the OTP quickly — the account might get blocked",
      "Give only the last 2 digits",
      "Hang up immediately and call the bank's official number",
      "Ask them to call back in 10 minutes",
    ],
    answer: "Hang up immediately and call the bank's official number",
    level: "L3",
    topic: "Digital safety",
  },
  {
    id: "q5",
    question: "UPI stands for:",
    options: ["Universal Payment Interface", "Unified Payments Interface", "United Pay India", "Unified Protocol Interface"],
    answer: "Unified Payments Interface",
    level: "L3",
    topic: "UPI basics",
  },
  {
    id: "q6",
    question: "Your birthday budget is ₹2,000. You select items worth ₹2,350. What is the smartest action?",
    options: [
      "Ask parents for ₹350 more",
      "Remove the lowest-priority Want items to get under ₹2,000",
      "Buy everything and pay later",
      "Cancel the party",
    ],
    answer: "Remove the lowest-priority Want items to get under ₹2,000",
    level: "L4",
    topic: "Budgeting",
  },
  {
    id: "q7",
    question: "₹10,000 invested at 10% compound interest for 2 years will become:",
    options: ["₹12,000", "₹12,100", "₹11,000", "₹10,200"],
    answer: "₹12,100",
    level: "L5",
    topic: "Compounding",
  },
  {
    id: "q8",
    question: "Which investment typically has the HIGHEST long-term returns (over 10+ years) in India?",
    options: ["Savings Account", "Fixed Deposit", "Gold", "Equity Mutual Funds"],
    answer: "Equity Mutual Funds",
    level: "L5",
    topic: "Investing",
  },
  {
    id: "q9",
    question: "Your salary slip shows CTC ₹50,000/month. Your take-home is ₹42,000. The difference is mainly because of:",
    options: [
      "Bank charges",
      "Employer keeping a cut",
      "PF, Professional Tax, and Income Tax (TDS)",
      "Inflation",
    ],
    answer: "PF, Professional Tax, and Income Tax (TDS)",
    level: "L6",
    topic: "Salary and taxes",
  },
  {
    id: "q10",
    question: "A credit card charges 36% annual interest. You owe ₹10,000 and pay only the minimum due each month. After 1 year, what happens to your outstanding balance?",
    options: [
      "It goes to ₹0 (paid off)",
      "It stays at ₹10,000",
      "It grows — you owe MORE than ₹10,000",
      "It reduces by ₹2,000",
    ],
    answer: "It grows — you owe MORE than ₹10,000",
    level: "L6",
    topic: "Debt and credit",
  },
];

// ─── Score → Level Mapping ────────────────────────────────────────────────────

function getRecommendedLevel(score: number, answers: Record<string, string>): string {
  // Find the first level where the student got questions wrong
  const levelOrder = ["L1", "L2", "L3", "L4", "L5", "L6"];
  const wrongByLevel: Record<string, number> = {};

  QUESTIONS.forEach((q) => {
    if (answers[q.id] !== q.answer) {
      wrongByLevel[q.level] = (wrongByLevel[q.level] ?? 0) + 1;
    }
  });

  // Recommend the first level where they got something wrong
  for (const level of levelOrder) {
    if ((wrongByLevel[level] ?? 0) > 0) {
      return level;
    }
  }

  // Perfect score → straight to L6
  return "L6";
}

const LEVEL_SLUGS: Record<string, string> = {
  L1: "level-1", L2: "level-2", L3: "level-3",
  L4: "level-4", L5: "level-5", L6: "level-6",
};

const LEVEL_NAMES: Record<string, string> = {
  L1: "My First Money World",
  L2: "Bank & ATM Explorer",
  L3: "Digital Money & Safety Lab",
  L4: "Smart Spending & Budgeting",
  L5: "Grow, Protect & Decide",
  L6: "Real-World Readiness",
};

// ─── Theme ────────────────────────────────────────────────────────────────────

const T = {
  bg: "#0F172A",
  card: "#1E293B",
  border: "#78350F",
  accent: "#F59E0B",
  text: "#F8FAFC",
  sub: "#D1D5DB",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BaselineTestPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const q = QUESTIONS[current];
  const totalQ = QUESTIONS.length;

  const score = QUESTIONS.filter((q) => answers[q.id] === q.answer).length;
  const scorePct = Math.round((score / totalQ) * 100);
  const recommendedLevel = step === "result" ? getRecommendedLevel(score, answers) : "L1";

  function handleSelect(option: string) {
    if (showFeedback) return;
    setSelected(option);
    setShowFeedback(true);
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  }

  function handleNext() {
    setSelected(null);
    setShowFeedback(false);
    if (current + 1 >= totalQ) {
      setStep("result");
    } else {
      setCurrent((c) => c + 1);
    }
  }

  if (step === "intro") {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 24 }}>
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>💸</div>
            <h1 style={{ color: T.text, fontWeight: 900, fontSize: 30, marginBottom: 12 }}>
              Financial Baseline Test
            </h1>
            <p style={{ color: T.sub, fontSize: 16, lineHeight: 1.7 }}>
              10 quick questions. We'll find exactly which MoneyMind level is right for you.
              No tricks — just honest questions about money, banking, and digital safety.
            </p>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "28px 32px", marginBottom: 28 }}>
            {[
              { icon: "⏱️", text: "Takes about 4–5 minutes" },
              { icon: "🎯", text: "10 multiple-choice questions" },
              { icon: "🏆", text: "You'll get a personalised level recommendation" },
              { icon: "🔁", text: "You can retake it anytime" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ color: T.text, fontSize: 15 }}>{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep("quiz")}
            style={{ width: "100%", background: `linear-gradient(90deg, #FCD34D, ${T.accent})`, color: "#451A03", borderRadius: 12, padding: "18px", fontWeight: 900, fontSize: 17, border: "none", cursor: "pointer" }}
          >
            Start the Test →
          </button>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <a href="/moneymind" style={{ color: T.sub, fontSize: 13, textDecoration: "none" }}>Skip test — go to all levels</a>
          </div>
        </div>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 24 }}>
        <div style={{ maxWidth: 600, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>
              {scorePct >= 80 ? "🏆" : scorePct >= 50 ? "📈" : "🌱"}
            </div>
            <h1 style={{ color: T.text, fontWeight: 900, fontSize: 28, marginBottom: 8 }}>
              {scorePct >= 80 ? "Excellent!" : scorePct >= 50 ? "Good foundation!" : "Great starting point!"}
            </h1>
            <div style={{ color: T.accent, fontSize: 22, fontWeight: 900, marginBottom: 4 }}>
              {score}/{totalQ} correct ({scorePct}%)
            </div>
            <p style={{ color: T.sub, fontSize: 15, lineHeight: 1.7 }}>
              Based on your answers, we recommend you start at:
            </p>
          </div>

          {/* Recommended Level Card */}
          <div style={{ background: `linear-gradient(135deg, #1E293B, #0F172A)`, border: `2px solid ${T.accent}`, borderRadius: 18, padding: "32px 28px", marginBottom: 24, textAlign: "center" }}>
            <div style={{ color: T.accent, fontSize: 13, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>Your Recommended Starting Level</div>
            <div style={{ color: T.text, fontWeight: 900, fontSize: 26, marginBottom: 6 }}>{LEVEL_NAMES[recommendedLevel]}</div>
            <div style={{ color: T.sub, fontSize: 14, marginBottom: 24 }}>{recommendedLevel} of 6</div>
            <button
              onClick={() => router.push(`/moneymind/course/${LEVEL_SLUGS[recommendedLevel]}`)}
              style={{ background: T.accent, color: "#451A03", borderRadius: 10, padding: "14px 32px", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer" }}
            >
              Start {LEVEL_NAMES[recommendedLevel]} →
            </button>
          </div>

          {/* Question Review */}
          <div style={{ background: T.card, border: `1px solid ${T.border}30`, borderRadius: 14, padding: "24px 28px", marginBottom: 20 }}>
            <div style={{ color: T.sub, fontSize: 13, fontWeight: 700, letterSpacing: 0.8, marginBottom: 16, textTransform: "uppercase" }}>Your Answers</div>
            {QUESTIONS.map((q, i) => {
              const correct = answers[q.id] === q.answer;
              return (
                <div key={q.id} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{correct ? "✅" : "❌"}</span>
                  <div>
                    <div style={{ color: T.text, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Q{i + 1}: {q.topic}</div>
                    {!correct && (
                      <div style={{ color: "#86EFAC", fontSize: 12 }}>
                        Correct: {q.answer}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => { setStep("intro"); setCurrent(0); setAnswers({}); setSelected(null); setShowFeedback(false); }}
              style={{ flex: 1, background: "transparent", border: `1px solid ${T.border}`, color: T.sub, borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              Retake Test
            </button>
            <button
              onClick={() => router.push("/moneymind")}
              style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, color: T.text, borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              See All Levels
            </button>
            {FLAGS.MONEYMIND_CHECKOUT && (
              <button
                onClick={() => router.push("/checkout?bundle=moneymind-6-levels")}
                style={{ flex: 1, background: T.accent, color: "#451A03", borderRadius: 10, padding: "12px", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
              >
                Unlock All Levels
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz Step ──────────────────────────────────────────────────────────────
  const isCorrect = selected === q.answer;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "32px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: T.sub, fontSize: 13 }}>Question {current + 1} of {totalQ}</span>
            <span style={{ color: T.accent, fontSize: 13, fontWeight: 700 }}>Level {q.level}</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: "#1E293B", overflow: "hidden" }}>
            <div style={{ width: `${((current + 1) / totalQ) * 100}%`, height: "100%", background: T.accent, borderRadius: 999, transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ background: T.card, border: `1px solid ${T.border}30`, borderRadius: 18, padding: "28px 28px", marginBottom: 20 }}>
          <div style={{ color: T.sub, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>{q.topic}</div>
          <div style={{ color: T.text, fontWeight: 700, fontSize: 18, lineHeight: 1.5 }}>{q.question}</div>
        </div>

        {/* Options */}
        <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
          {q.options.map((option) => {
            let bg = T.card;
            let border = `1px solid ${T.border}30`;
            let color = T.text;

            if (showFeedback) {
              if (option === q.answer) { bg = "#15803D20"; border = "2px solid #15803D"; color = "#86EFAC"; }
              else if (option === selected) { bg = "#EF444420"; border = "2px solid #EF4444"; color = "#FCA5A5"; }
            } else if (selected === option) {
              bg = `${T.accent}20`; border = `2px solid ${T.accent}`;
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                style={{ background: bg, border, borderRadius: 12, padding: "16px 20px", color, fontSize: 15, fontWeight: 600, textAlign: "left", cursor: showFeedback ? "default" : "pointer", transition: "all 0.15s ease" }}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback + Next */}
        {showFeedback && (
          <div>
            <div style={{ background: isCorrect ? "#15803D20" : "#EF444420", border: `1px solid ${isCorrect ? "#15803D" : "#EF4444"}`, borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ color: isCorrect ? "#86EFAC" : "#FCA5A5", fontWeight: 800, marginBottom: isCorrect ? 0 : 6 }}>
                {isCorrect ? "✓ Correct!" : "✗ Not quite"}
              </div>
              {!isCorrect && (
                <div style={{ color: "#86EFAC", fontSize: 14 }}>
                  Answer: {q.answer}
                </div>
              )}
            </div>
            <button
              onClick={handleNext}
              style={{ width: "100%", background: `linear-gradient(90deg, #FCD34D, ${T.accent})`, color: "#451A03", borderRadius: 12, padding: "16px", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer" }}
            >
              {current + 1 >= totalQ ? "See Results →" : "Next Question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
