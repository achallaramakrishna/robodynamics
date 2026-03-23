"use client";

import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const GRADES = [
  {
    num: 4, slug: "grade-4",
    gradient: "linear-gradient(135deg, #F97316, #EA580C)",
    accentColor: "#F97316",
    icon: "🔢",
    level: "Beginner",
    title: "Vedic Maths — Grade 4",
    tagline: "Number sense & mental addition",
    headline: "Your child will add 999+1 instantly — and know exactly why",
    chapters: 8, duration: "3.5 hrs", students: "1,240",
    rating: 4.8, reviews: 312,
    demoCode: "VM_G4_L1_FAST_ADDITION",
    demoGrade: 4,
    bullets: [
      "Find complements to 10, 100 & 1000 instantly",
      "Multiply numbers near 10 and 100 in one step",
      "Catch carry errors with the digit-sum check",
      "Solve Grade 4 CBSE problems 3× faster",
    ],
    curriculum: [
      { title: "Completing the Whole — Pūraṇāpūraṇābhyām", duration: "25 min", free: true },
      { title: "All from 9, Last from 10 — Nikhilam Basics", duration: "25 min", free: true },
      { title: "Doubling & Halving Tricks", duration: "20 min", free: false },
      { title: "The 11 Times Trick", duration: "20 min", free: false },
      { title: "Adding in Pairs — Lopana Sthāpana", duration: "25 min", free: false },
      { title: "Magic of 9 — Digit Sum Check", duration: "20 min", free: false },
      { title: "Multiplying Near 10 & 100", duration: "25 min", free: false },
      { title: "Quick Division by 2, 5 & 10", duration: "20 min", free: false },
    ],
  },
  {
    num: 5, slug: "grade-5",
    gradient: "linear-gradient(135deg, #F59E0B, #F97316)",
    accentColor: "#F59E0B",
    icon: "✖️",
    level: "Beginner",
    title: "Vedic Maths — Grade 5",
    tagline: "2-digit multiplication in seconds",
    headline: "Your child will multiply 97×103 in 5 seconds — no calculator",
    chapters: 8, duration: "4 hrs", students: "2,180",
    rating: 4.9, reviews: 541,
    demoCode: "VM_G5_L1_NIKHILAM_NEAR100",
    demoGrade: 5,
    bullets: [
      "Multiply any two numbers near 100 in one step",
      "Check every answer instantly with digit sums",
      "Square numbers near 50 mentally",
      "Solve HCF/LCM problems in half the time",
    ],
    curriculum: [
      { title: "Nikhilam — Near 100 Multiplication", duration: "25 min", free: true },
      { title: "Digit Sum & Divisibility Check", duration: "25 min", free: true },
      { title: "Criss-Cross 2-digit Multiplication", duration: "30 min", free: false },
      { title: "Multiplying by 11 & 12", duration: "20 min", free: false },
      { title: "Squaring Numbers Near 50", duration: "25 min", free: false },
      { title: "Percentage Shortcuts", duration: "25 min", free: false },
      { title: "HCF by Vedic Method", duration: "25 min", free: false },
      { title: "Division by Flag — Dhvajanka", duration: "30 min", free: false },
    ],
  },
  {
    num: 6, slug: "grade-6",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    accentColor: "#10B981",
    icon: "➗",
    level: "Intermediate",
    title: "Vedic Maths — Grade 6",
    tagline: "3-digit tricks & algebra shortcuts",
    headline: "Your child will do 998×997 mentally — faster than a calculator",
    chapters: 8, duration: "4.5 hrs", students: "890",
    rating: 4.7, reviews: 198,
    demoCode: "VM_G6_L1_NIKHILAM_NEAR1000",
    demoGrade: 6,
    bullets: [
      "Multiply 3-digit numbers near 1000 in one step",
      "Apply divisibility rules for 7, 11 and 13",
      "Solve simultaneous equations mentally",
      "Find squares of any 2-digit number in 3 seconds",
    ],
    curriculum: [
      { title: "Nikhilam Near 1000", duration: "30 min", free: true },
      { title: "Vinculum Numbers", duration: "25 min", free: true },
      { title: "Criss-Cross 3-digit Multiplication", duration: "35 min", free: false },
      { title: "Squares by Formula", duration: "25 min", free: false },
      { title: "Cube Roots by Inspection", duration: "20 min", free: false },
      { title: "Divisibility Rules — 7, 11, 13", duration: "25 min", free: false },
      { title: "Fractions & LCM Shortcuts", duration: "25 min", free: false },
      { title: "Linear Equations by Anurupyena", duration: "30 min", free: false },
    ],
  },
  {
    num: 7, slug: "grade-7",
    gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    accentColor: "#8B5CF6",
    icon: "📐",
    level: "Intermediate",
    title: "Vedic Maths — Grade 7",
    tagline: "Equations & advanced multiplication",
    headline: "Your child will solve 2-variable equations in 10 seconds",
    chapters: 8, duration: "5 hrs", students: "640",
    rating: 4.8, reviews: 143,
    demoCode: "VM_G7_L1_NIKHILAM_NEAR10000",
    demoGrade: 7,
    bullets: [
      "Multiply 4-digit numbers in one written step",
      "Solve simultaneous equations by Paravartya",
      "Find cube roots of perfect cubes mentally",
      "Apply Vedic algebra to NCERT Chapters 4 & 9",
    ],
    curriculum: [
      { title: "Nikhilam Near 10000", duration: "30 min", free: true },
      { title: "Paravartya — Transposition Rule", duration: "30 min", free: true },
      { title: "Simultaneous Equations", duration: "35 min", free: false },
      { title: "Cube Roots by Inspection", duration: "25 min", free: false },
      { title: "Criss-Cross 4-digit Products", duration: "35 min", free: false },
      { title: "Algebraic Division — Flag Method", duration: "30 min", free: false },
      { title: "Ratio & Proportion Shortcuts", duration: "25 min", free: false },
      { title: "Vedic Trigonometry Intro", duration: "25 min", free: false },
    ],
  },
  {
    num: 8, slug: "grade-8",
    gradient: "linear-gradient(135deg, #EF4444, #DC2626)",
    accentColor: "#EF4444",
    icon: "🔬",
    level: "Advanced",
    title: "Vedic Maths — Grade 8",
    tagline: "Squares, cubes & polynomial tricks",
    headline: "Your child will square any 3-digit number mentally — in one breath",
    chapters: 8, duration: "5.5 hrs", students: "420",
    rating: 4.9, reviews: 87,
    demoCode: "VM_G8_L1_LARGE_NIKHILAM",
    demoGrade: 8,
    bullets: [
      "Square any 3-digit number in under 4 seconds",
      "Find cube roots of 6-digit numbers by inspection",
      "Multiply polynomials using Vedic grid method",
      "Solve quadratic equations without the formula",
    ],
    curriculum: [
      { title: "Large Nikhilam — Any Base", duration: "35 min", free: true },
      { title: "Squaring 3-digit Numbers", duration: "30 min", free: true },
      { title: "Cube Roots of Large Numbers", duration: "30 min", free: false },
      { title: "Polynomial Multiplication", duration: "35 min", free: false },
      { title: "Quadratics by Vedic Method", duration: "35 min", free: false },
      { title: "Vedic Matrix Operations", duration: "30 min", free: false },
      { title: "Coordinate Geometry Shortcuts", duration: "25 min", free: false },
      { title: "Exam Speed Strategies", duration: "30 min", free: false },
    ],
  },
];

const FEATURES = [
  { icon: "🎙️", title: "AI explains step by step", body: "Animated board + Indian English voice narrates every Vedic method — like a private tutor." },
  { icon: "❓", title: "Asks questions in real time", body: "After each demo the AI poses a question. Wrong answer? It re-explains differently — not the same way." },
  { icon: "🧠", title: "Adapts to your child", body: "Detects 5 student archetypes — fast, slow, confused, distracted, guessing — and adjusts pace automatically." },
  { icon: "📊", title: "Parent gets full visibility", body: "After every session see chapter %, accuracy, XP, and which topics need more practice." },
];

// ─── Components ──────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#F59E0B", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

function CourseCard({ g, idx }: { g: typeof GRADES[0]; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const demoUrl = `/ai-tutor/demo?grade=${g.demoGrade}&chapter=${g.demoCode}&fresh=1`;
  const popupRight = idx % 3 !== 2;

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main card */}
      <a href={`/vedic-math/${g.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          background: "#FFFFFF",
          border: hovered ? `2px solid ${g.accentColor}` : "1px solid #E2E8F0",
          borderRadius: 10, overflow: "hidden",
          boxShadow: hovered ? `0 8px 32px ${g.accentColor}25` : "0 2px 8px rgba(0,0,0,0.06)",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}>
          {/* Thumbnail */}
          <div style={{ background: g.gradient, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 20, position: "relative" }}>
            <div style={{ fontSize: 52 }}>{g.icon}</div>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700 }}>Grade {g.num} · {g.chapters} chapters</div>
            <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.3)", color: "#FFF", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>
              {g.level}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "14px 16px 18px" }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", lineHeight: 1.3, marginBottom: 4 }}>{g.title}</div>
            <div style={{ color: "#64748B", fontSize: 12, marginBottom: 6 }}>{g.tagline}</div>
            <div style={{ color: "#94A3B8", fontSize: 11, marginBottom: 8 }}>MindSutra AI Tutor · CBSE aligned</div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ color: "#92400E", fontWeight: 800, fontSize: 13 }}>{g.rating}</span>
              <Stars rating={g.rating} />
              <span style={{ color: "#94A3B8", fontSize: 11 }}>({g.reviews.toLocaleString()})</span>
            </div>

            {/* Meta */}
            <div style={{ color: "#94A3B8", fontSize: 11, marginBottom: 12 }}>
              {g.duration} · {g.chapters} chapters · {g.students} students
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 900, fontSize: 18, color: "#0F172A" }}>₹1,499</span>
              <span style={{ color: "#94A3B8", fontSize: 12, textDecoration: "line-through" }}>₹2,999</span>
              <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3 }}>50% OFF</span>
            </div>
          </div>
        </div>
      </a>

      {/* Hover popup */}
      {hovered && (
        <div style={{
          position: "absolute",
          top: 0,
          [popupRight ? "left" : "right"]: "calc(100% + 14px)",
          width: 300,
          zIndex: 200,
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
          padding: "20px",
        }}>
          {/* Arrow */}
          <div style={{
            position: "absolute",
            top: 24,
            [popupRight ? "right" : "left"]: -9,
            width: 0, height: 0,
            borderTop: "9px solid transparent",
            borderBottom: "9px solid transparent",
            [popupRight ? "borderLeft" : "borderRight"]: "9px solid #E2E8F0",
          }} />

          <div style={{ fontWeight: 900, fontSize: 15, color: "#0F172A", marginBottom: 6, lineHeight: 1.3 }}>{g.headline}</div>
          <div style={{ color: "#64748B", fontSize: 12, marginBottom: 14 }}>
            Updated Mar 2026 · {g.students} students enrolled
          </div>

          <div style={{ fontWeight: 700, fontSize: 13, color: "#0F172A", marginBottom: 8 }}>What your child will learn:</div>
          {g.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12, color: "#374151", alignItems: "flex-start" }}>
              <span style={{ color: "#10B981", fontWeight: 800, flexShrink: 0 }}>✓</span>
              <span>{b}</span>
            </div>
          ))}

          <div style={{ fontWeight: 700, fontSize: 13, color: "#0F172A", margin: "14px 0 8px" }}>Course content:</div>
          {g.curriculum.slice(0, 4).map((ch, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, fontSize: 12 }}>
              <span style={{ color: ch.free ? "#10B981" : "#94A3B8", fontSize: 14, flexShrink: 0 }}>{ch.free ? "▶" : "🔒"}</span>
              <span style={{ color: ch.free ? "#374151" : "#94A3B8", flex: 1, lineHeight: 1.4 }}>{ch.title}</span>
              {ch.free && <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3, flexShrink: 0 }}>FREE</span>}
            </div>
          ))}
          <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 4 }}>+ {g.chapters - 4} more chapters</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            <a href={demoUrl} style={{ background: g.accentColor, color: "#FFFFFF", fontWeight: 700, fontSize: 14, padding: "11px 0", borderRadius: 8, textDecoration: "none", textAlign: "center", display: "block" }}>
              ▶ Try Free Demo — No Login
            </a>
            <a href={`/vedic-math/${g.slug}`} style={{ background: "transparent", color: "#0F172A", fontWeight: 600, fontSize: 13, padding: "10px 0", borderRadius: 8, textDecoration: "none", textAlign: "center", display: "block", border: "1.5px solid #CBD5E1" }}>
              See Full Curriculum →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MindSutraPage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#FFFFFF", minHeight: "100vh", color: "#0F172A" }}>

      {/* Pilot banner */}
      <div style={{ background: "linear-gradient(90deg, #7c2d12, #c2410c)", color: "#fff7ed", padding: "10px 16px", textAlign: "center", fontSize: 13, fontWeight: 700 }}>
        🚀 MindSutra is live for Grade 4–8 · Try any chapter free before enrolling
      </div>

      {/* Nav */}
      <nav style={{ background: "#0F172A", borderBottom: "1px solid #1E293B", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            ◀ All Products
          </a>
          <span style={{ color: "#334155" }}>|</span>
          <a href="/mindsutra" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 20 }}>🧮</span>
            <div>
              <div style={{ color: "#F1F5F9", fontWeight: 900, fontSize: 16 }}>MindSutra</div>
              <div style={{ color: "#64748B", fontSize: 10 }}>Vedic Maths AI Tutor</div>
            </div>
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/auth/login" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none" }}>Login</a>
          <a href="/vedic-math/grade-4" style={{ background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 13, padding: "8px 18px", borderRadius: 6, textDecoration: "none" }}>
            Enroll Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1C1430 100%)", padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", color: "#FED7AA", fontSize: 11, fontWeight: 700, padding: "5px 16px", borderRadius: 20, marginBottom: 20, letterSpacing: 1, textTransform: "uppercase" }}>
          🇮🇳 CBSE Grade 4–8 · AI-Powered · 16 Chapters Free to Preview
        </div>
        <h1 style={{ color: "#F1F5F9", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5, lineHeight: 1.2 }}>
          Vedic Maths AI Tutor<br />
          <span style={{ color: "#F97316" }}>for Every CBSE Grade</span>
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 16, margin: "0 auto 32px", maxWidth: 560, lineHeight: 1.7 }}>
          Each grade is a standalone AI course — not videos. The AI teaches, asks questions,
          detects when your child is stuck, and re-explains in real time.
        </p>

        {/* Trust strip */}
        <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { val: "5,000+", lbl: "Students enrolled" },
            { val: "40", lbl: "Chapters across grades" },
            { val: "4.8 ★", lbl: "Average rating" },
            { val: "₹1,499", lbl: "One-time, no renewals" },
          ].map(s => (
            <div key={s.val} style={{ textAlign: "center" }}>
              <div style={{ color: "#F1F5F9", fontWeight: 900, fontSize: 22 }}>{s.val}</div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hint bar */}
      <div style={{ background: "#FFFBF5", borderBottom: "1px solid #FED7AA", padding: "10px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#92400E" }}>
          <span>💡</span>
          <span><strong>Hover over any grade card</strong> to preview chapters and learning outcomes. Click to see the full curriculum and try a free demo.</span>
        </div>
      </div>

      {/* Course catalog */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px" }}>
            5 Courses · Grade 4 to Grade 8
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Each course has 8 chapters · 2 free preview chapters · Lifetime access after enrolment
          </p>
        </div>

        {/* Filter strip */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {["All Levels", "Beginner (G4–G5)", "Intermediate (G6–G7)", "Advanced (G8)"].map((f, i) => (
            <button key={f} style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
              background: i === 0 ? "#0F172A" : "transparent",
              color: i === 0 ? "#FFFFFF" : "#374151",
              border: i === 0 ? "1px solid #0F172A" : "1px solid #CBD5E1",
              fontWeight: i === 0 ? 700 : 400,
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Grade cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {GRADES.map((g, idx) => (
            <CourseCard key={g.num} g={g} idx={idx} />
          ))}
        </div>

        {/* Bundle upsell */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A, #1C1430)",
          borderRadius: 16, padding: "32px 36px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20,
          border: "1px solid #1E293B",
        }}>
          <div>
            <div style={{ color: "#F97316", fontWeight: 800, fontSize: 11, marginBottom: 8, letterSpacing: 1 }}>🏆 BEST VALUE</div>
            <div style={{ color: "#F1F5F9", fontWeight: 900, fontSize: 22, marginBottom: 8 }}>
              All 5 Grades Bundle — ₹3,999{" "}
              <span style={{ textDecoration: "line-through", color: "#475569", fontWeight: 400, fontSize: 16 }}>₹12,999</span>
            </div>
            <div style={{ color: "#94A3B8", fontSize: 14 }}>
              Grade 4–8 · 40 chapters · Lifetime · As your child moves up each year, the next course is ready
            </div>
          </div>
          <a href="/checkout/bundle-g4-g8" style={{ background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
            Get All 5 Grades →
          </a>
        </div>
      </div>

      {/* Features section */}
      <div style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", marginBottom: 32, textAlign: "center" }}>
            Not videos. A real AI that teaches, asks, and adapts.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: "#FFFFFF", borderRadius: 12, padding: 22, border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 800, color: "#0F172A", fontSize: 14, marginBottom: 8 }}>{f.title}</div>
                <div style={{ color: "#64748B", fontSize: 13, lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0F172A", padding: "28px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          {GRADES.map(g => (
            <a key={g.num} href={`/vedic-math/${g.slug}`} style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>Grade {g.num}</a>
          ))}
          <a href="/auth/login" style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>Login</a>
          <a href="mailto:hello@robodynamics.in" style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>Contact</a>
        </div>
        <p style={{ color: "#334155", fontSize: 12, margin: 0 }}>© 2026 RoboDynamics Pvt Ltd · MindSutra · 30-day money-back guarantee</p>
      </footer>

    </div>
  );
}
