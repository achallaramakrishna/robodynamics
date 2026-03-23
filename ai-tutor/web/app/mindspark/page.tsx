"use client";

import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const GRADE_TRACKS = [
  {
    gradeRange: "Grade 4–5",
    slug: "grade-4",
    demoGrade: 4,
    demoCode: "AR_G4_L1_PATTERNS",
    gradient: "linear-gradient(135deg, #7C3AED, #4F46E5)",
    accentColor: "#7C3AED",
    icon: "🔍",
    level: "Foundation",
    tagline: "Pattern recognition & basic reasoning",
    chapters: 8,
    duration: "3 hrs",
    students: "Coming soon",
    price: "₹1,299",
    oldPrice: "₹2,499",
    curriculum: [
      { title: "Number Patterns & Series", free: true },
      { title: "Odd One Out — Visual Logic", free: true },
      { title: "Picture-based Reasoning", free: false },
      { title: "Directions & Maps", free: false },
      { title: "Coding-Decoding", free: false },
      { title: "Analogy — Word & Number", free: false },
      { title: "Sorting & Ranking", free: false },
      { title: "Calendar & Days Logic", free: false },
    ],
  },
  {
    gradeRange: "Grade 6–8",
    slug: "grade-6",
    demoGrade: 6,
    demoCode: "AR_G6_L1_SERIES",
    gradient: "linear-gradient(135deg, #2563EB, #7C3AED)",
    accentColor: "#2563EB",
    icon: "🧩",
    level: "Intermediate",
    tagline: "Logical reasoning & data interpretation",
    chapters: 8,
    duration: "4 hrs",
    students: "Coming soon",
    price: "₹1,299",
    oldPrice: "₹2,499",
    curriculum: [
      { title: "Number Series — Advanced", free: true },
      { title: "Letter Coding & Decoding", free: true },
      { title: "Analogies — Verbal & Non-verbal", free: false },
      { title: "Venn Diagrams & Set Logic", free: false },
      { title: "Clocks & Time Problems", free: false },
      { title: "Rankings & Arrangements", free: false },
      { title: "Data Sufficiency", free: false },
      { title: "Puzzle Solving Strategies", free: false },
    ],
  },
  {
    gradeRange: "Grade 9–12",
    slug: "grade-9",
    demoGrade: 9,
    demoCode: "AR_G9_L1_SERIES",
    gradient: "linear-gradient(135deg, #0EA5E9, #2563EB)",
    accentColor: "#0EA5E9",
    icon: "📊",
    level: "Advanced",
    tagline: "Competitive exam aptitude prep",
    chapters: 10,
    duration: "5 hrs",
    students: "Coming soon",
    price: "₹1,499",
    oldPrice: "₹2,999",
    curriculum: [
      { title: "Quantitative Aptitude Foundation", free: true },
      { title: "Logical Reasoning — CAT Level", free: true },
      { title: "Data Interpretation Basics", free: false },
      { title: "Verbal Ability — Analogies", free: false },
      { title: "Number Theory & Shortcuts", free: false },
      { title: "Puzzles & Arrangements", free: false },
      { title: "Speed Maths for Competitive Exams", free: false },
      { title: "Mock Test Strategy", free: false },
    ],
  },
];

const FEATURES = [
  { icon: "🎯", title: "Targets your weak areas first", body: "The AI detects which reasoning types you struggle with and gives more practice there automatically." },
  { icon: "🧠", title: "Teaches patterns, not tricks", body: "Every question type has an underlying pattern. The AI teaches you to see it — not just memorize shortcuts." },
  { icon: "⏱️", title: "Speed + accuracy both tracked", body: "Aptitude tests reward speed. We track how fast you solve each type and improve your response time." },
  { icon: "📈", title: "Percentile progress tracker", body: "See where you stand vs other students. Know exactly which topics to focus on before your exam." },
];

const EXAMS = [
  { name: "CAT", icon: "🎓" },
  { name: "GMAT", icon: "📋" },
  { name: "UPSC", icon: "🏛️" },
  { name: "SSC CGL", icon: "📝" },
  { name: "Campus Placements", icon: "💼" },
  { name: "NTSE", icon: "🏆" },
  { name: "JEE Mains", icon: "⚗️" },
  { name: "Banking PO", icon: "🏦" },
];

// ─── Components ──────────────────────────────────────────────────────────────

function TrackCard({ t }: { t: typeof GRADE_TRACKS[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ flex: "1 1 300px", maxWidth: 380 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: "#FFFFFF",
        border: hovered ? `2px solid ${t.accentColor}` : "1px solid #E2E8F0",
        borderRadius: 14, overflow: "hidden",
        boxShadow: hovered ? `0 16px 48px ${t.accentColor}22` : "0 4px 16px rgba(0,0,0,0.06)",
        transition: "all 0.25s ease",
        height: "100%",
      }}>
        {/* Thumbnail */}
        <div style={{ background: t.gradient, padding: "32px 24px 24px", position: "relative" }}>
          <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.35)", color: "#FFF", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
            {t.level}
          </div>
          <div style={{ fontSize: 48, marginBottom: 10 }}>{t.icon}</div>
          <div style={{ color: "rgba(255,255,255,0.95)", fontSize: 20, fontWeight: 900 }}>{t.gradeRange}</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>{t.tagline}</div>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 20px 22px" }}>
          {/* Meta */}
          <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 14 }}>
            {t.chapters} chapters · {t.duration} total · {t.students}
          </div>

          {/* Curriculum preview */}
          <div style={{ marginBottom: 18 }}>
            {t.curriculum.slice(0, 4).map((ch, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12 }}>
                <span style={{ color: ch.free ? "#10B981" : "#94A3B8", fontSize: 13, flexShrink: 0 }}>{ch.free ? "▶" : "🔒"}</span>
                <span style={{ color: ch.free ? "#374151" : "#94A3B8", flex: 1 }}>{ch.title}</span>
                {ch.free && <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3, flexShrink: 0 }}>FREE</span>}
              </div>
            ))}
            <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 4 }}>+ {t.chapters - 4} more chapters</div>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#0F172A" }}>{t.price}</span>
            <span style={{ fontSize: 13, color: "#94A3B8", textDecoration: "line-through" }}>{t.oldPrice}</span>
            <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3 }}>EARLY BIRD</span>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#F1F5F9", color: "#94A3B8", fontWeight: 700, fontSize: 14, padding: "11px", borderRadius: 8, textAlign: "center", cursor: "default" }}>
              🚀 Coming Soon
            </div>
            <a href={`/ai-tutor/demo?grade=${t.demoGrade}&chapter=${t.demoCode}&fresh=1`} style={{ background: "transparent", color: t.accentColor, fontWeight: 600, fontSize: 12, padding: "9px", borderRadius: 8, textDecoration: "none", textAlign: "center", border: `1.5px solid ${t.accentColor}` }}>
              ▶ Preview a Free Chapter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MindSparkPage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#FFFFFF", minHeight: "100vh", color: "#0F172A" }}>

      {/* Coming soon banner */}
      <div style={{ background: "linear-gradient(90deg, #4C1D95, #1E40AF)", color: "#E0E7FF", padding: "10px 16px", textAlign: "center", fontSize: 13, fontWeight: 700 }}>
        🧠 MindSpark is launching soon — register your interest and get early-bird pricing
      </div>

      {/* Nav */}
      <nav style={{ background: "#0F172A", borderBottom: "1px solid #1E293B", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none" }}>◀ All Products</a>
          <span style={{ color: "#334155" }}>|</span>
          <a href="/mindspark" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 20 }}>🧠</span>
            <div>
              <div style={{ color: "#F1F5F9", fontWeight: 900, fontSize: 16 }}>MindSpark</div>
              <div style={{ color: "#64748B", fontSize: 10 }}>Aptitude & Reasoning AI Tutor</div>
            </div>
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/auth/login" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none" }}>Login</a>
          <a href="/mindsutra" style={{ background: "#7C3AED", color: "#FFFFFF", fontWeight: 700, fontSize: 13, padding: "8px 18px", borderRadius: 6, textDecoration: "none" }}>
            Try MindSutra Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#C4B5FD", fontSize: 11, fontWeight: 700, padding: "5px 16px", borderRadius: 20, marginBottom: 20, letterSpacing: 1, textTransform: "uppercase" }}>
          🚀 Coming Soon · Register Interest · Early-Bird Pricing
        </div>
        <h1 style={{ color: "#F8FAFC", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5, lineHeight: 1.2 }}>
          Aptitude & Reasoning AI Tutor<br />
          <span style={{ color: "#A78BFA" }}>for Competitive Exam Success</span>
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 16, margin: "0 auto 32px", maxWidth: 580, lineHeight: 1.7 }}>
          An AI that detects your weak reasoning patterns and drills them until you&apos;re fast and accurate.
          Covers everything from basic patterns (Grade 4) to CAT-level quant (Grade 12+).
        </p>

        {/* Exam badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          {EXAMS.map(e => (
            <span key={e.name} style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#C4B5FD", fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
              {e.icon} {e.name}
            </span>
          ))}
        </div>

        <a href="/mindsutra" style={{ display: "inline-block", background: "#F97316", color: "#FFF", fontWeight: 800, fontSize: 15, padding: "13px 28px", borderRadius: 10, textDecoration: "none", marginRight: 12 }}>
          Try MindSutra (Live Now) →
        </a>
        <span style={{ color: "#64748B", fontSize: 13 }}>MindSpark launches Q2 2026</span>
      </div>

      {/* Course tracks */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: "#0F172A", margin: "0 0 10px" }}>
            3 Learning Tracks · Grade 4 to Grade 12+
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Structured from foundation reasoning to advanced competitive exam aptitude
          </p>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {GRADE_TRACKS.map(t => <TrackCard key={t.gradeRange} t={t} />)}
        </div>
      </div>

      {/* Features */}
      <div style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", marginBottom: 32, textAlign: "center" }}>
            Why MindSpark is different
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: "#FFFFFF", borderRadius: 12, padding: 22, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 800, color: "#0F172A", fontSize: 14, marginBottom: 8 }}>{f.title}</div>
                <div style={{ color: "#64748B", fontSize: 13, lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, #4C1D95, #1E40AF)", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ color: "#FFF", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, margin: "0 0 14px" }}>
          Meanwhile — try MindSutra, our Vedic Maths AI Tutor
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, margin: "0 auto 28px", maxWidth: 480 }}>
          Same AI tutoring engine. Live now for Grade 4–8 Vedic Maths. Free demo, no login required.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1" style={{ background: "#F97316", color: "#FFF", fontWeight: 800, fontSize: 15, padding: "13px 28px", borderRadius: 10, textDecoration: "none" }}>
            ▶ Try Free Demo — No Login
          </a>
          <a href="/mindsutra" style={{ background: "rgba(255,255,255,0.12)", color: "#FFF", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 10, textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)" }}>
            Explore MindSutra →
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0F172A", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ color: "#334155", fontSize: 12, margin: 0 }}>
          © 2026 RoboDynamics Pvt Ltd · MindSpark · 30-day money-back guarantee ·{" "}
          <a href="mailto:hello@robodynamics.in" style={{ color: "#475569", textDecoration: "none" }}>hello@robodynamics.in</a>
        </p>
      </footer>

    </div>
  );
}
