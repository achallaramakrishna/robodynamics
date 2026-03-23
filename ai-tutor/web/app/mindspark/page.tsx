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
    levelColor: "#7C3AED",
    tagline: "Pattern recognition & basic reasoning",
    headline: "Your child will crack 'odd one out' and number series in seconds",
    chapters: 8,
    duration: "3 hrs",
    students: "Coming soon",
    rating: 4.8,
    reviews: 0,
    price: "₹1,299",
    oldPrice: "₹2,499",
    bullets: [
      "Spot number patterns and complete series instantly",
      "Visual reasoning — shapes, colours, sizes",
      "Directions & map reading made simple",
      "Analogy thinking — word and number pairs",
    ],
    curriculum: [
      { title: "Number Patterns & Series", duration: "22 min", free: true },
      { title: "Odd One Out — Visual Logic", duration: "22 min", free: true },
      { title: "Picture-based Reasoning", duration: "20 min", free: false },
      { title: "Directions & Maps", duration: "20 min", free: false },
      { title: "Coding-Decoding Basics", duration: "22 min", free: false },
      { title: "Analogy — Word & Number", duration: "22 min", free: false },
      { title: "Sorting & Ranking Problems", duration: "20 min", free: false },
      { title: "Calendar & Days Logic", duration: "20 min", free: false },
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
    levelColor: "#2563EB",
    tagline: "Logical reasoning & data interpretation",
    headline: "Your child will solve complex puzzles and series with confidence",
    chapters: 8,
    duration: "4 hrs",
    students: "Coming soon",
    rating: 4.8,
    reviews: 0,
    price: "₹1,299",
    oldPrice: "₹2,499",
    bullets: [
      "Advanced number series — AP, GP, mixed patterns",
      "Letter coding and decoding mastery",
      "Venn diagrams and set logic",
      "Clock and calendar problem shortcuts",
    ],
    curriculum: [
      { title: "Number Series — Advanced Patterns", duration: "25 min", free: true },
      { title: "Letter Coding & Decoding", duration: "25 min", free: true },
      { title: "Analogies — Verbal & Non-verbal", duration: "22 min", free: false },
      { title: "Venn Diagrams & Set Logic", duration: "25 min", free: false },
      { title: "Clocks & Time Problems", duration: "22 min", free: false },
      { title: "Rankings & Arrangements", duration: "22 min", free: false },
      { title: "Data Sufficiency Basics", duration: "25 min", free: false },
      { title: "Puzzle Solving Strategies", duration: "22 min", free: false },
    ],
  },
  {
    gradeRange: "Grade 9–10",
    slug: "grade-9",
    demoGrade: 9,
    demoCode: "AR_G9_L1_QUANT",
    gradient: "linear-gradient(135deg, #0891B2, #2563EB)",
    accentColor: "#0891B2",
    icon: "📊",
    level: "Intermediate",
    levelColor: "#0891B2",
    tagline: "Quantitative aptitude & speed maths",
    headline: "Solve percentage, profit, and time-distance problems 3x faster",
    chapters: 10,
    duration: "5 hrs",
    students: "Coming soon",
    rating: 4.8,
    reviews: 0,
    price: "₹1,499",
    oldPrice: "₹2,999",
    bullets: [
      "Percentage & profit-loss shortcuts",
      "Time-work and pipe-cistern tricks",
      "Speed-distance-time with diagrams",
      "Ratio, proportion and mixture problems",
    ],
    curriculum: [
      { title: "Percentage Shortcuts & Tricks", duration: "28 min", free: true },
      { title: "Profit, Loss & Discount", duration: "28 min", free: true },
      { title: "Time & Work — Efficiency Method", duration: "25 min", free: false },
      { title: "Pipe & Cistern Problems", duration: "25 min", free: false },
      { title: "Speed, Distance & Time", duration: "28 min", free: false },
      { title: "Ratio, Proportion & Mixture", duration: "25 min", free: false },
      { title: "Simple & Compound Interest", duration: "25 min", free: false },
      { title: "Average & Weighted Average", duration: "22 min", free: false },
      { title: "Number System & Divisibility", duration: "25 min", free: false },
      { title: "Simplification & BODMAS Speed", duration: "22 min", free: false },
    ],
  },
  {
    gradeRange: "Grade 11–12",
    slug: "grade-11",
    demoGrade: 11,
    demoCode: "AR_G11_L1_CRITICAL",
    gradient: "linear-gradient(135deg, #059669, #0891B2)",
    accentColor: "#059669",
    icon: "🎯",
    level: "Advanced",
    levelColor: "#059669",
    tagline: "Critical reasoning & competitive prep",
    headline: "Crack JEE, NEET, Olympiad reasoning sections with ease",
    chapters: 12,
    duration: "6 hrs",
    students: "Coming soon",
    rating: 4.8,
    reviews: 0,
    price: "₹1,799",
    oldPrice: "₹3,499",
    bullets: [
      "Syllogisms and statement-conclusion logic",
      "Data interpretation — bar, pie, table",
      "Critical reasoning and assumption testing",
      "Logical puzzle solving for NTSE & Olympiads",
    ],
    curriculum: [
      { title: "Syllogisms — Deductive Logic", duration: "30 min", free: true },
      { title: "Data Interpretation — Tables & Charts", duration: "35 min", free: true },
      { title: "Critical Reasoning — Assumptions", duration: "30 min", free: false },
      { title: "Statement & Conclusions", duration: "28 min", free: false },
      { title: "Input-Output Machines", duration: "25 min", free: false },
      { title: "Blood Relations & Family Tree", duration: "25 min", free: false },
      { title: "Seating Arrangements — Linear & Circular", duration: "35 min", free: false },
      { title: "Complex Coding-Decoding", duration: "28 min", free: false },
      { title: "Verbal Ability — Para Jumbles", duration: "30 min", free: false },
      { title: "Pie Charts & Data Sufficiency", duration: "30 min", free: false },
      { title: "Puzzle Grid & Matrix Reasoning", duration: "30 min", free: false },
      { title: "Mock Reasoning Section — Full Test", duration: "40 min", free: false },
    ],
  },
  {
    gradeRange: "College / CAT",
    slug: "college",
    demoGrade: 12,
    demoCode: "AR_CAT_L1_QUANT",
    gradient: "linear-gradient(135deg, #D97706, #7C3AED)",
    accentColor: "#D97706",
    icon: "🏆",
    level: "Pro",
    levelColor: "#D97706",
    tagline: "CAT · GMAT · UPSC · Banking PO",
    headline: "Crack India's toughest competitive exams with AI-guided practice",
    chapters: 16,
    duration: "10 hrs",
    students: "Coming soon",
    rating: 4.9,
    reviews: 0,
    price: "₹2,499",
    oldPrice: "₹4,999",
    bullets: [
      "CAT Quant — complete syllabus with shortcuts",
      "GMAT Verbal & Quantitative reasoning",
      "UPSC CSAT — full reasoning coverage",
      "Banking PO — 100+ practice sets with analytics",
    ],
    curriculum: [
      { title: "CAT Quant — Arithmetic Mastery", duration: "40 min", free: true },
      { title: "CAT DILR — Data Interpretation Sets", duration: "40 min", free: true },
      { title: "GMAT Verbal — Critical Reasoning", duration: "35 min", free: false },
      { title: "GMAT Quant — Problem Solving", duration: "35 min", free: false },
      { title: "UPSC CSAT — Mental Ability", duration: "35 min", free: false },
      { title: "UPSC CSAT — Reading Comprehension", duration: "35 min", free: false },
      { title: "Banking PO — Puzzle & Seating", duration: "35 min", free: false },
      { title: "Banking PO — Number Series & Inequalities", duration: "35 min", free: false },
      { title: "Campus Placements — TCS, Wipro, Infosys", duration: "35 min", free: false },
      { title: "Logical Reasoning — Advanced Grids", duration: "35 min", free: false },
      { title: "Permutations, Combinations & Probability", duration: "35 min", free: false },
      { title: "Geometry & Mensuration for CAT", duration: "35 min", free: false },
      { title: "Modern Maths — Functions, Progressions", duration: "35 min", free: false },
      { title: "Verbal Ability — Para Summary & RC", duration: "35 min", free: false },
      { title: "Full Mock Test — CAT Pattern", duration: "60 min", free: false },
      { title: "Full Mock Test — GMAT Pattern", duration: "60 min", free: false },
    ],
  },
];

const EXAM_BADGES = [
  { label: "CAT", color: "#D97706" },
  { label: "GMAT", color: "#7C3AED" },
  { label: "UPSC", color: "#059669" },
  { label: "SSC CGL", color: "#2563EB" },
  { label: "Banking PO", color: "#0891B2" },
  { label: "Campus Placements", color: "#F97316" },
  { label: "NTSE", color: "#10B981" },
  { label: "JEE Mains", color: "#EF4444" },
  { label: "NEET", color: "#8B5CF6" },
];

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({ track }: { track: typeof GRADE_TRACKS[0] }) {
  const [hovered, setHovered] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "2px solid #EDE9FE",
        boxShadow: hovered ? "0 20px 40px rgba(124,58,237,0.18)" : "0 4px 16px rgba(0,0,0,0.06)",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}>
        {/* Thumbnail */}
        <div style={{ background: track.gradient, padding: "28px 24px 24px", position: "relative" }}>
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.3)", color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
            {track.level}
          </div>
          <div style={{ fontSize: 44, marginBottom: 8 }}>{track.icon}</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{track.gradeRange}</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4 }}>{track.tagline}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>📚 {track.chapters} chapters</span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>⏱ {track.duration}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>
          <div style={{ color: "#1e293b", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{track.headline}</div>
          <ul style={{ margin: "0 0 16px", paddingLeft: 20 }}>
            {track.bullets.map((b) => (
              <li key={b} style={{ color: "#475569", fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>{b}</li>
            ))}
          </ul>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
            <span style={{ color: track.accentColor, fontSize: 22, fontWeight: 800 }}>{track.price}</span>
            <span style={{ color: "#94a3b8", fontSize: 13, textDecoration: "line-through" }}>{track.oldPrice}</span>
            <span style={{ background: "#FEF3C7", color: "#92400E", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>48% OFF</span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <a
              href={`/ai-tutor/demo?grade=${track.demoGrade}&chapter=${track.demoCode}&fresh=1`}
              style={{ flex: 1, background: track.gradient, color: "#fff", borderRadius: 8, padding: "10px 0", textAlign: "center", fontWeight: 700, fontSize: 13, textDecoration: "none" }}
            >
              Try Free Demo
            </a>
            <button
              onClick={() => setShowCurriculum(!showCurriculum)}
              style={{ flex: 1, background: "transparent", border: `2px solid ${track.accentColor}`, color: track.accentColor, borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              {showCurriculum ? "Hide" : "See Curriculum"}
            </button>
          </div>

          {/* Inline curriculum (mobile-friendly) */}
          {showCurriculum && (
            <div style={{ marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
              {track.curriculum.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 13 }}>{c.free ? "🔓" : "🔒"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: c.free ? "#1e293b" : "#94a3b8", fontSize: 12, fontWeight: 500 }}>{c.title}</div>
                    <div style={{ color: "#cbd5e1", fontSize: 10 }}>{c.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hover popup — curriculum preview (desktop) */}
      {hovered && !showCurriculum && (
        <div style={{
          position: "absolute", top: 0, left: "calc(100% + 16px)", width: 300,
          background: "#1e293b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14,
          padding: 20, boxShadow: "0 24px 48px rgba(0,0,0,0.5)", zIndex: 50,
        }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>
            {track.gradeRange} — Curriculum Preview
          </div>
          {track.curriculum.slice(0, 6).map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 14 }}>{c.free ? "🔓" : "🔒"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: c.free ? "#fff" : "#64748b", fontSize: 12, fontWeight: 500 }}>{c.title}</div>
                <div style={{ color: "#475569", fontSize: 10, marginTop: 1 }}>{c.duration}</div>
              </div>
            </div>
          ))}
          {track.curriculum.length > 6 && (
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
              + {track.curriculum.length - 6} more chapters
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <a href={`/ai-tutor/demo?grade=${track.demoGrade}&chapter=${track.demoCode}&fresh=1`} style={{ flex: 1, background: track.gradient, color: "#fff", borderRadius: 6, padding: "8px 0", textAlign: "center", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Try Free</a>
            <a href={`/checkout?grade=${track.demoGrade}&product=mindspark`} style={{ flex: 1, background: "rgba(255,255,255,0.08)", color: "#fff", borderRadius: 6, padding: "8px 0", fontSize: 12, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>Enroll Now</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function MindSparkPage() {
  return (
    <div style={{ background: "#F8F4FF", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ background: "#0F0A1E", borderBottom: "1px solid rgba(124,58,237,0.2)", position: "sticky", top: 0, zIndex: 100, padding: "0 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 60, gap: 24 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>RoboDynamics</span>
          </a>
          <span style={{ color: "#374151" }}>|</span>
          <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: 15 }}>🧠 MindSpark</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
            <a href="/mindsutra" style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none" }}>🧮 MindSutra</a>
            <a href="/#summer-camp" style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>🏕️ Summer Camp</a>
            <a href="/auth/login" style={{ background: "#7C3AED", color: "#fff", borderRadius: 6, padding: "6px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Login</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #0F0A1E 0%, #1E1B4B 50%, #0F172A 100%)", padding: "72px 32px 64px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -80, right: "15%", width: 500, height: 500, background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "5%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 100, padding: "6px 18px", marginBottom: 24 }}>
              <span>🧠</span>
              <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>MindSpark — Aptitude & Reasoning AI Tutor</span>
            </div>

            <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
              Master Aptitude &{" "}
              <span style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Crack Any Exam
              </span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
              AI-powered aptitude and reasoning coach for Grade 4 through college. Adaptive practice that targets your weak areas first — for school, competitive exams, and campus placements.
            </p>

            {/* Exam badges */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
              {EXAM_BADGES.map(({ label, color }) => (
                <span key={label} style={{ background: `${color}22`, border: `1px solid ${color}55`, color, borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>
                  {label}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/ai-tutor/demo?grade=4&chapter=AR_G4_L1_PATTERNS&fresh=1" style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)", color: "#fff", borderRadius: 10, padding: "14px 30px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                🚀 Try Free Demo
              </a>
              <a href="#tracks" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, padding: "14px 30px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                📚 See All Grade Tracks
              </a>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            {[
              { val: "5", label: "Grade tracks" },
              { val: "54+", label: "Chapters" },
              { val: "9", label: "Exams covered" },
              { val: "AI", label: "Adaptive engine" },
              { val: "24/7", label: "Available" },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 26 }}>{val}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRADE TRACKS ────────────────────────────────────────────────── */}
      <section id="tracks" style={{ padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: "#1e293b", margin: "0 0 12px" }}>
              Choose Your Grade Track
            </h2>
            <p style={{ color: "#64748b", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
              Each track is carefully designed for that age group — starting from fun patterns and logic puzzles, all the way to CAT and GMAT prep.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28, position: "relative" }}>
            {GRADE_TRACKS.map((track) => (
              <CourseCard key={track.gradeRange} track={track} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BUNDLE UPSELL ────────────────────────────────────────────────── */}
      <section style={{ padding: "0 32px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED, #2563EB)", borderRadius: 20, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: 0.8, textTransform: "uppercase" }}>Best Value Bundle</div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 26, marginBottom: 8 }}>MindSutra + MindSpark Bundle</div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, margin: "0 0 16px", maxWidth: 480, lineHeight: 1.6 }}>
                Get both Vedic Maths and Aptitude & Reasoning for your child's grade. Vedic Maths speeds up calculations; MindSpark builds the logical reasoning — together they make an unstoppable student.
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ color: "#fbbf24", fontSize: 28, fontWeight: 900 }}>₹2,299</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, textDecoration: "line-through" }}>₹4,498</span>
                <span style={{ background: "#fbbf24", color: "#92400E", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 800 }}>SAVE ₹2,199</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
              <a href="/checkout?bundle=mindsutra-mindspark" style={{ background: "#fff", color: "#4F46E5", borderRadius: 10, padding: "14px 32px", fontWeight: 800, fontSize: 15, textDecoration: "none", textAlign: "center" }}>
                Get Bundle Deal
              </a>
              <a href="/ai-tutor/demo?grade=4&chapter=AR_G4_L1_PATTERNS&fresh=1" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, padding: "12px 32px", fontWeight: 600, fontSize: 14, textDecoration: "none", textAlign: "center" }}>
                Try Free First
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: "#1e293b", marginBottom: 40 }}>
            What Makes MindSpark Different
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { icon: "🧠", title: "AI That Adapts to You", desc: "The AI detects where you slow down and focuses practice there. No more wasting time on topics you have already mastered." },
              { icon: "📊", title: "Parent Dashboard", desc: "Real-time visibility into accuracy, time spent, weak topics, and weekly progress — all in one clean dashboard." },
              { icon: "🎯", title: "Exam-Specific Tracks", desc: "Each chapter is tagged to a real exam — CAT, GMAT, UPSC, Banking PO. Practice exactly what matters for your target." },
              { icon: "🔁", title: "Spaced Repetition", desc: "Topics you got wrong are brought back after 24h, 3d, 7d — proven science to lock in memory permanently." },
              { icon: "⚡", title: "Speed Training Mode", desc: "Timed practice sessions build the speed needed for competitive exams where every second counts." },
              { icon: "💬", title: "Ask Doubt Anytime", desc: "Stuck on a problem? The AI tutor explains in simple language with a fresh approach — available 24/7." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", border: "2px solid #EDE9FE", boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ color: "#1e293b", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
                <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUMMER CAMP CALLOUT ───────────────────────────────────────────── */}
      <section style={{ padding: "0 32px 64px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(239,68,68,0.08))", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 16, padding: "32px 40px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 48 }}>🏕️</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#F97316", fontWeight: 700, fontSize: 13, marginBottom: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>Also from RoboDynamics</div>
              <div style={{ color: "#1e293b", fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Robotics Summer Camp 2026 — Bangalore</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>Build real robots with Arduino, ESP32 & Raspberry Pi. Ages 8–18. 20 sessions. All materials included.</div>
            </div>
            <a href="/" style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>
              See Summer Camp
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "64px 32px", background: "linear-gradient(135deg, #0F0A1E, #1E1B4B)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
            Ready to Level Up Aptitude?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
            Start with a free demo — no login, no payment. See exactly how the AI tutor works before you enroll.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/ai-tutor/demo?grade=4&chapter=AR_G4_L1_PATTERNS&fresh=1" style={{ background: "linear-gradient(135deg,#7C3AED,#2563EB)", color: "#fff", borderRadius: 10, padding: "16px 36px", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>
              🚀 Start Free Demo
            </a>
            <a href="/mindsutra" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, padding: "16px 36px", fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
              🧮 See MindSutra Too
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: "#0A0A0F", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px", textAlign: "center" }}>
        <div style={{ color: "#374151", fontSize: 13 }}>
          © 2026 RoboDynamics · <a href="https://robodynamics.in" style={{ color: "#7C3AED", textDecoration: "none" }}>robodynamics.in</a>
          &nbsp;·&nbsp; 83743 77311 &nbsp;·&nbsp; info@robodynamics.in
          <br />
          <span style={{ color: "#1F2937", fontSize: 11 }}>Above Agarwal Bhavan, Chambenhalli Sarjapura Road, Bangalore – 562125</span>
        </div>
      </footer>

    </div>
  );
}
