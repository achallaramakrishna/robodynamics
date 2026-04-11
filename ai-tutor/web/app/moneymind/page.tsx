"use client";

import { useState } from "react";
import { MONEYMIND_LEVELS, MoneyMindLevel } from "../../lib/moneyMindCatalog";

// ─── Theme ────────────────────────────────────────────────────────────────────
const THEME = {
  gradient: "linear-gradient(135deg, #451A03 0%, #0F172A 70%, #030712 100%)",
  accentPrimary: "#F59E0B", 
  accentSecondary: "#D97706",
  navBg: "#0F172A",
  cardBg: "#1E293B",
  borderBase: "#78350F",
  textMain: "#F8FAFC",
  textSub: "#D1D5DB"
};

const BIZ_BADGES = [
  { label: "Compounding", color: "#10B981" },
  { label: "Stock Market", color: "#3B82F6" },
  { label: "Real Estate", color: "#F59E0B" },
  { label: "Taxes", color: "#EF4444" },
  { label: "Startups", color: "#8B5CF6" },
];

// ─── Level Card Component ─────────────────────────────────────────────────────

function LevelCard({ level, index }: { level: MoneyMindLevel; index: number }) {
  const [hovered, setHovered] = useState(false);
  const bgColors = [
    "linear-gradient(135deg, #059669, #10B981)",
    "linear-gradient(135deg, #1D4ED8, #3B82F6)",
    "linear-gradient(135deg, #D97706, #F59E0B)",
    "linear-gradient(135deg, #6D28D9, #8B5CF6)",
    "linear-gradient(135deg, #BE185D, #E11D48)"
  ];
  
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: THEME.cardBg,
        borderRadius: 16,
        overflow: "hidden",
        border: `2px solid ${hovered ? level.color : THEME.borderBase}`,
        boxShadow: hovered ? `0 20px 40px ${level.color}30` : `0 4px 16px rgba(0,0,0,0.5)`,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}>
        {/* Header */}
        <div style={{ background: bgColors[index], padding: "28px 24px 24px", position: "relative" }}>
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.3)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
            Level {level.order}
          </div>
          <div style={{ fontSize: 44, marginBottom: 8 }}>{level.emoji}</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>{level.name}</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4 }}>
            Typically fits: {level.ageEquiv}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>
          <div style={{ color: THEME.textMain, fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{level.tagline}</div>
          
          <ul style={{ margin: "0 0 20px", paddingLeft: 20 }}>
            {level.lessons.slice(0,3).map((l, i) => (
              <li key={i} style={{ color: THEME.textSub, fontSize: 13, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ color: level.color, fontWeight: 800, marginRight: 6 }}>{l.category}:</span> {l.skill}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: 10 }}>
            <a
              href={`/moneymind/course/level-${level.order}`}
              style={{ flex: 1, background: bgColors[index], color: "#fff", borderRadius: 8, padding: "12px 0", textAlign: "center", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
            >
              View Full Syllabus →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MoneyMindPage() {
  return (
    <div style={{ background: "#0F172A", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>

      <nav style={{ background: THEME.navBg, borderBottom: `1px solid ${THEME.borderBase}`, position: "sticky", top: 0, zIndex: 100, padding: "0 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 60, gap: 24 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>RoboDynamics</span>
          </a>
          <span style={{ color: THEME.borderBase }}>|</span>
          <span style={{ color: THEME.accentPrimary, fontWeight: 700, fontSize: 15 }}>📈 Money Mind</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
            <a href="/mindsutra" style={{ color: THEME.textSub, fontSize: 13, textDecoration: "none" }}>🧮 MindSutra</a>
            <a href="/mindsparc" style={{ color: THEME.textSub, fontSize: 13, textDecoration: "none" }}>🧠 MindSparc</a>
            <a href="https://robodynamics.in/login" style={{ background: THEME.cardBg, border: `1px solid ${THEME.borderBase}`, color: THEME.textMain, borderRadius: 6, padding: "6px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Course LMS Login</a>
          </div>
        </div>
      </nav>

      <section style={{ background: THEME.gradient, padding: "72px 32px 64px", overflow: "hidden", position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${THEME.accentSecondary}20`, border: `1px solid ${THEME.accentPrimary}40`, borderRadius: 100, padding: "6px 18px", marginBottom: 24 }}>
              <span>🚀</span>
              <span style={{ color: THEME.accentPrimary, fontSize: 13, fontWeight: 600 }}>Money Mind — Financial Literacy AI</span>
            </div>

            <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
              Because schools don't teach{" "}
              <span style={{ background: `linear-gradient(135deg, ${THEME.accentSecondary}, ${THEME.accentPrimary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                how to build Wealth.
              </span>
            </h1>
            <p style={{ color: THEME.textSub, fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
              Our AI bridges the gap between structured education and actual financial literacy. From understanding "Needs vs Wants" to mastering "Compound Interest" and "Startup Equity," we structure financial sovereignty via a 5-Tier interactive journey.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
              {BIZ_BADGES.map(({ label, color }) => (
                <span key={label} style={{ background: `${color}22`, border: `1px solid ${color}55`, color, borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>
                  {label}
                </span>
              ))}
            </div>
            
            <a href="/ai-tutor/demo?product=moneymind&fresh=1" style={{ background: `linear-gradient(90deg, #FCD34D, ${THEME.accentPrimary})`, color: "#451A03", borderRadius: 10, padding: "16px 36px", fontWeight: 900, fontSize: 16, textDecoration: "none", display: "inline-block", boxShadow: `0 8px 24px ${THEME.accentSecondary}60` }}>
              💸 Take the Financial Baseline Test
            </a>
          </div>
        </div>
      </section>

      {/* ── 5 Adaptive Levels ────────────────────────────────────────────────── */}
      <section id="levels" style={{ padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: THEME.textMain, margin: "0 0 12px" }}>
              The 5 Growth Tiers
            </h2>
            <p style={{ color: THEME.textSub, fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
              Master compounding, tax strategy, and capital allocation through interactive real-world AI situations.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, position: "relative" }}>
            {MONEYMIND_LEVELS.map((level, i) => (
              <LevelCard key={level.id} level={level} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5-Level Bundle Upsell ────────────────────────────────────────────────── */}
      <section style={{ padding: "0 32px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", border: `2px solid ${THEME.accentSecondary}`, borderRadius: 20, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 28, boxShadow: `0 12px 48px ${THEME.accentSecondary}20` }}>
            <div>
              <div style={{ color: THEME.accentPrimary, fontSize: 13, fontWeight: 900, marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" }}>Generational Wealth Bundle</div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 26, marginBottom: 8 }}>Get All 5 Money Mind Levels</div>
              <p style={{ color: THEME.textSub, fontSize: 15, margin: "0 0 16px", maxWidth: 480, lineHeight: 1.6 }}>
                Secure lifetime access to the entire financial literacy syllabus. Set your children up for absolute fiscal freedom before they even hit college.
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ color: "#fff", fontSize: 32, fontWeight: 900 }}>₹5,999</span>
                <span style={{ color: THEME.textSub, fontSize: 15, textDecoration: "line-through" }}>₹14,995</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
              <a href="/checkout?bundle=moneymind-5-levels" style={{ background: THEME.accentPrimary, color: "#451A03", borderRadius: 10, padding: "14px 32px", fontWeight: 800, fontSize: 15, textDecoration: "none", textAlign: "center" }}>
                Unlock All Levels
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: THEME.navBg, borderTop: `1px solid ${THEME.borderBase}`, padding: "32px", textAlign: "center" }}>
        <div style={{ color: THEME.textSub, fontSize: 13 }}>
          © 2026 RoboDynamics · <a href="https://robodynamics.in" style={{ color: THEME.accentPrimary, textDecoration: "none" }}>robodynamics.in</a>
          <br />
          <span style={{ color: THEME.borderBase, fontSize: 11, marginTop: 8, display: "inline-block" }}>Financial Literacy, Accelerated by AI.</span>
        </div>
      </footer>

    </div>
  );
}
