"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { hindiChallengePool } from "@/lib/hindisutraChallengePool";

const COLORS = {
  header: "#172554",
  sidebar: "#ffffff",
  bg: "#eff6ff",
  accent: "#f97316",
  accentSoft: "#fff7ed",
  border: "#dbeafe",
  textMain: "#0f172a",
  textSub: "#475569",
  green: "#16a34a",
  red: "#dc2626",
};

export default function VaaniArenaEngine() {
  const router = useRouter();
  const [questions, setQuestions] = useState(hindiChallengePool);
  const [gameState, setGameState] = useState<"STARTING" | "PLAYING" | "FINISHED">("STARTING");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"CORRECT" | "INCORRECT" | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const regJson =
      typeof window !== "undefined"
        ? localStorage.getItem("vaani_student") || localStorage.getItem("hs_arena_registration")
        : null;

    if (!regJson) {
      router.push("/arena/register");
      return;
    }

    try {
      const reg = JSON.parse(regJson);
      const regGrade = Number.parseInt(reg.grade || "1", 10) || 1;
      let pool = hindiChallengePool.filter((q) => q.grade === `Grade ${regGrade}`);

      if (pool.length < 5) {
        pool = hindiChallengePool.filter((q) => Math.abs(Number.parseInt(q.grade.replace("Grade ", ""), 10) - regGrade) <= 2);
      }

      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 15);
      setQuestions(shuffled.length ? shuffled : hindiChallengePool.slice(0, 10));
      setGameState("PLAYING");
    } catch {
      router.push("/arena/register");
    }
  }, [router]);

  useEffect(() => {
    if (gameState !== "PLAYING") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("FINISHED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const handleAnswer = (choice: string) => {
    if (feedback || gameState !== "PLAYING") return;
    const q = questions[qIndex];
    if (!q) return;

    if (choice === q.answer) {
      setScore((prev) => prev + 500);
      setFeedback("CORRECT");
    } else {
      setFeedback("INCORRECT");
    }

    window.setTimeout(() => {
      setFeedback(null);
      if (qIndex + 1 < questions.length) {
        setQIndex((prev) => prev + 1);
      } else {
        setGameState("FINISHED");
      }
    }, 600);
  };

  const currentQuestion = questions[qIndex] || questions[0];
  const displayGrade = currentQuestion?.grade?.split(" ")[1] || "1";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(251,191,36,0.22), transparent 26%), radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 30%), linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
        color: COLORS.textMain,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <header style={{ background: COLORS.header, color: "white", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, color: "#bfdbfe", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 800 }}>
              Vaani Arena
            </div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Speed Mission: Grade {displayGrade}</div>
          </div>
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 13,
              background: "rgba(255,255,255,0.14)",
              padding: "10px 16px",
              borderRadius: 999,
            }}
          >
            Exit Arena
          </Link>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "calc(100vh - 74px)" }}>
        <aside
          style={{
            borderRight: `1px solid ${COLORS.border}`,
            background: "rgba(255,255,255,0.84)",
            backdropFilter: "blur(10px)",
            padding: "24px 16px",
            display: "grid",
            alignContent: "start",
            gap: 20,
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 22,
              background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
              border: "1px solid #fed7aa",
            }}
          >
            <div style={{ fontSize: 11, color: COLORS.textSub, textTransform: "uppercase", fontWeight: 800, marginBottom: 8 }}>
              Arena Progress
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
              Task {Math.min(qIndex + 1, questions.length)} of {questions.length}
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "#ffedd5", overflow: "hidden" }}>
              <div
                style={{
                  width: `${questions.length ? ((qIndex + 1) / questions.length) * 100 : 0}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #fb923c 0%, #f97316 100%)",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {questions.map((_, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: idx === qIndex ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`,
                  background: idx === qIndex ? "#fff7ed" : idx < qIndex ? "#f8fafc" : "white",
                  opacity: idx > qIndex + 2 ? 0.45 : 1,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: idx < qIndex ? COLORS.green : idx === qIndex ? COLORS.accent : "#cbd5e1",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: idx === qIndex ? COLORS.textMain : COLORS.textSub }}>
                  Mission Part {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section style={{ padding: 32, display: "grid", gap: 24, placeContent: "start center" }}>
          {gameState === "FINISHED" ? (
            <div
              style={{
                background: "white",
                borderRadius: 28,
                padding: 48,
                textAlign: "center",
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
                maxWidth: 560,
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 12 }}>Trophy</div>
              <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 8 }}>Mission Complete</h2>
              <div style={{ fontSize: 17, color: COLORS.textSub, marginBottom: 24 }}>
                You scored {score} points in the Vaani Arena.
              </div>
              <button
                onClick={() => router.push("/")}
                style={{
                  background: "linear-gradient(135deg, #f97316 0%, #fb7185 100%)",
                  color: "white",
                  border: "none",
                  padding: "16px 32px",
                  borderRadius: 16,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                Return to Vaani
              </button>
            </div>
          ) : currentQuestion ? (
            <div style={{ maxWidth: 860, width: "100%", display: "grid", gap: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "10px 16px",
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </div>
                <div
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "10px 16px",
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  Score: {score}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.94)",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 28,
                  padding: 48,
                  boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 12, color: COLORS.textSub, fontWeight: 800, textTransform: "uppercase", marginBottom: 20 }}>
                  Current Challenge
                </div>
                <h2 style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.4, margin: "0 0 28px 0" }}>{currentQuestion.prompt}</h2>

                {currentQuestion.image ? (
                  <div
                    style={{
                      background: COLORS.accentSoft,
                      borderRadius: 24,
                      padding: 24,
                      marginBottom: 36,
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <img src={currentQuestion.image?.startsWith("/vaani") ? currentQuestion.image : `/vaani${currentQuestion.image}`} alt="Challenge visual" style={{ maxHeight: 240, maxWidth: "100%", objectFit: "contain" }} onError={(e) => { const t = e.target as HTMLImageElement; if (!t.src.includes("placeholder")) t.src = "/vaani/assets/gemini/placeholder.svg"; }} />
                  </div>
                ) : null}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
                  {currentQuestion.options.map((opt) => {
                    const isCorrect = feedback && opt === currentQuestion.answer;
                    const isWrong = feedback === "INCORRECT" && opt !== currentQuestion.answer;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        disabled={!!feedback}
                        style={{
                          padding: "20px",
                          borderRadius: 18,
                          border: `2px solid ${isCorrect ? "#22c55e" : isWrong ? "#fecaca" : "#dbeafe"}`,
                          background: isCorrect ? "#dcfce7" : "white",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: 800,
                          transition: "all 0.2s",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {feedback ? (
                  <div
                    style={{
                      marginTop: 28,
                      padding: 16,
                      borderRadius: 16,
                      background: feedback === "CORRECT" ? "#dcfce7" : "#fee2e2",
                      color: feedback === "CORRECT" ? COLORS.green : COLORS.red,
                      fontWeight: 800,
                    }}
                  >
                    {feedback === "CORRECT" ? "Perfect. +500 points." : "Not this one. Keep going."}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
