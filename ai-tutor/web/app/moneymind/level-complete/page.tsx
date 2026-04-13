"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FLAGS } from "../../../lib/featureFlags";

// ─── Level Meta ───────────────────────────────────────────────────────────────

const LEVEL_META: Record<string, {
  name: string;
  emoji: string;
  color: string;
  xp: number;
  badge: string;
  nextLevel: string | null;
  nextSlug: string | null;
}> = {
  L1: { name: "My First Money World",      emoji: "💵", color: "#10B981", xp: 200, badge: "Money Starter",     nextLevel: "L2", nextSlug: "level-2" },
  L2: { name: "Bank & ATM Explorer",        emoji: "🏦", color: "#3B82F6", xp: 300, badge: "Bank Explorer",    nextLevel: "L3", nextSlug: "level-3" },
  L3: { name: "Digital Money & Safety Lab", emoji: "📱", color: "#6366F1", xp: 400, badge: "Cyber Guardian",   nextLevel: "L4", nextSlug: "level-4" },
  L4: { name: "Smart Spending & Budgeting", emoji: "🛒", color: "#F59E0B", xp: 500, badge: "Budget Master",    nextLevel: "L5", nextSlug: "level-5" },
  L5: { name: "Grow, Protect & Decide",     emoji: "🌱", color: "#8B5CF6", xp: 600, badge: "Wealth Grower",    nextLevel: "L6", nextSlug: "level-6" },
  L6: { name: "Real-World Readiness",       emoji: "🚀", color: "#F43F5E", xp: 700, badge: "Money Champion",   nextLevel: null, nextSlug: null },
};

// ─── Confetti (pure CSS animation via inline keyframes) ───────────────────────

function ConfettiPiece({ color, delay, left }: { color: string; delay: number; left: number }) {
  return (
    <div style={{
      position: "absolute",
      top: -20,
      left: `${left}%`,
      width: 10,
      height: 10,
      background: color,
      borderRadius: 2,
      animation: `fall 2.5s ${delay}s ease-in forwards`,
      opacity: 0,
    }} />
  );
}

const CONFETTI_COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6", "#FCD34D"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LevelCompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const levelId = (searchParams.get("level") ?? "L1").toUpperCase();
  const meta = LEVEL_META[levelId] ?? LEVEL_META.L1;

  const [animStep, setAnimStep] = useState(0);
  const [confetti] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 1.5,
      left: Math.random() * 100,
    }))
  );

  // Animate in sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimStep(1), 200),
      setTimeout(() => setAnimStep(2), 800),
      setTimeout(() => setAnimStep(3), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const T = { bg: "#0F172A", card: "#1E293B", border: "#78350F", text: "#F8FAFC", sub: "#D1D5DB" };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 24, position: "relative", overflow: "hidden" }}>

      {/* CSS keyframes for confetti */}
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          0%   { transform: scale(0.3); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes slideUp {
          0%   { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${meta.color}60; }
          50%       { box-shadow: 0 0 0 20px ${meta.color}00; }
        }
      `}</style>

      {/* Confetti */}
      {confetti.map((c, i) => <ConfettiPiece key={i} {...c} />)}

      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>

        {/* Badge */}
        <div style={{
          width: 140, height: 140,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${meta.color}30, ${meta.color}10)`,
          border: `4px solid ${meta.color}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
          animation: animStep >= 1 ? "popIn 0.6s ease forwards, pulse 2s 1s infinite" : "none",
          opacity: animStep >= 1 ? 1 : 0,
        }}>
          <div style={{ fontSize: 52 }}>{meta.emoji}</div>
        </div>

        {/* Title */}
        <div style={{
          animation: animStep >= 2 ? "slideUp 0.5s ease forwards" : "none",
          opacity: animStep >= 2 ? 1 : 0,
        }}>
          <div style={{ color: meta.color, fontSize: 13, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
            Level Complete!
          </div>
          <h1 style={{ color: T.text, fontWeight: 900, fontSize: 30, marginBottom: 8 }}>
            {meta.name}
          </h1>
          <p style={{ color: T.sub, fontSize: 15, marginBottom: 28 }}>
            You earned the <strong style={{ color: T.text }}>{meta.badge}</strong> badge!
          </p>
        </div>

        {/* XP Card */}
        <div style={{
          background: T.card,
          border: `2px solid ${meta.color}`,
          borderRadius: 18,
          padding: "28px 32px",
          marginBottom: 24,
          animation: animStep >= 3 ? "slideUp 0.5s 0.1s ease forwards" : "none",
          opacity: animStep >= 3 ? 1 : 0,
        }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
            <span style={{ color: meta.color, fontSize: 48, fontWeight: 900 }}>+{meta.xp}</span>
            <span style={{ color: T.sub, fontSize: 18, fontWeight: 700 }}>XP</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { label: "Badge Earned", value: meta.badge },
              { label: "Level", value: `${levelId} of 6` },
              { label: "XP Reward", value: `${meta.xp} XP` },
              { label: "Status", value: "Completed ✓" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}30`, borderRadius: 10, padding: "12px 14px", textAlign: "left" }}>
                <div style={{ color: T.sub, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>{label}</div>
                <div style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 12,
          animation: animStep >= 3 ? "slideUp 0.5s 0.2s ease forwards" : "none",
          opacity: animStep >= 3 ? 1 : 0,
        }}>
          {meta.nextSlug && (
            <button
              onClick={() => router.push(`/moneymind/course/${meta.nextSlug}`)}
              style={{ background: `linear-gradient(90deg, #FCD34D, ${meta.color})`, color: "#451A03", borderRadius: 12, padding: "16px", fontWeight: 900, fontSize: 16, border: "none", cursor: "pointer" }}
            >
              Continue to {LEVEL_META[meta.nextLevel!]?.name} →
            </button>
          )}

          {!meta.nextSlug && (
            <div style={{ background: `linear-gradient(135deg, ${meta.color}20, #1E293B)`, border: `2px solid ${meta.color}`, borderRadius: 12, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
              <div style={{ color: T.text, fontWeight: 900, fontSize: 18, marginBottom: 6 }}>MoneyMind Complete!</div>
              <div style={{ color: T.sub, fontSize: 14, lineHeight: 1.6 }}>
                You've mastered all 6 levels of financial literacy. You're now more financially literate than most adults in India!
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => router.push(`/moneymind/course/${LEVEL_META[levelId]?.nextSlug ? "level-" + (parseInt(levelId.replace("L", "")) ) : "level-6"}`)}
              style={{ flex: 1, background: "transparent", border: `1px solid ${T.border}`, color: T.sub, borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              Review Level {levelId}
            </button>
            <button
              onClick={() => router.push("/moneymind")}
              style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, color: T.text, borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              All Levels
            </button>
            {FLAGS.MONEYMIND_CHECKOUT && !meta.nextSlug && (
              <button
                onClick={() => window.print()}
                style={{ flex: 1, background: meta.color, color: "#fff", borderRadius: 10, padding: "12px", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
              >
                Print Certificate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
