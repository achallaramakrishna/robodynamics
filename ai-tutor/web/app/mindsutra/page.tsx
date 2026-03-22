"use client";

import { useState } from "react";
import { MINDSUTRA_DEMO_CHAPTERS } from "@/lib/mindsutraChapters";

/* â”€â”€â”€ Grade course data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const GRADES = [
  {
    num: 4, slug: "grade-4", color: "#6366F1", bg: "linear-gradient(135deg,#6366F1,#4338CA)",
    icon: "ðŸ”¢", level: "Beginner",
    title: "Vedic Maths â€” Grade 4",
    tagline: "Number sense & mental addition",
    headline: "Your child will add 999+1 instantly â€” and know exactly why",
    chapters: 8, duration: "3.5 hrs", students: "1,240",
    rating: 4.8, reviews: 312,
    demoCode: MINDSUTRA_DEMO_CHAPTERS["4"],
    bullets: [
      "Find complements to 10, 100 & 1000 instantly",
      "Multiply numbers near 10 and 100 in one step",
      "Catch carry errors with the digit-sum check",
      "Solve Grade 4 CBSE problems 3Ã— faster",
    ],
    curriculum: [
      { title: "Completing the Whole â€” PÅ«raá¹‡ÄpÅ«raá¹‡ÄbhyÄm", duration: "25 min", free: true },
      { title: "All from 9, Last from 10 â€” Nikhilam Basics", duration: "25 min", free: true },
      { title: "Doubling & Halving Tricks", duration: "20 min", free: false },
      { title: "The 11 Times Trick", duration: "20 min", free: false },
      { title: "Adding in Pairs â€” Lopana SthÄpana", duration: "25 min", free: false },
      { title: "Magic of 9 â€” Digit Sum Check", duration: "20 min", free: false },
      { title: "Multiplying Near 10 & 100", duration: "25 min", free: false },
      { title: "Quick Division by 2, 5 & 10", duration: "20 min", free: false },
    ],
  },
  {
    num: 5, slug: "grade-5", color: "#F97316", bg: "linear-gradient(135deg,#F97316,#EA580C)",
    icon: "âœ–ï¸", level: "Beginner",
    title: "Vedic Maths â€” Grade 5",
    tagline: "2-digit multiplication in seconds",
    headline: "Your child will multiply 97Ã—103 in 5 seconds â€” no calculator",
    chapters: 8, duration: "4 hrs", students: "2,180",
    rating: 4.9, reviews: 541,
    demoCode: MINDSUTRA_DEMO_CHAPTERS["5"],
    bullets: [
      "Multiply any two numbers near 100 in one step",
      "Check every answer instantly with digit sums",
      "Square numbers near 50 mentally",
      "Solve HCF/LCM problems in half the time",
    ],
    curriculum: [
      { title: "Nikhilam â€” Near 100 Multiplication", duration: "25 min", free: true },
      { title: "Digit Sum & Divisibility Check", duration: "25 min", free: true },
      { title: "Criss-Cross 2-digit Multiplication", duration: "30 min", free: false },
      { title: "Multiplying by 11 & 12", duration: "20 min", free: false },
      { title: "Squaring Numbers Near 50", duration: "25 min", free: false },
      { title: "Percentage Shortcuts", duration: "25 min", free: false },
      { title: "HCF by Vedic Method", duration: "25 min", free: false },
      { title: "Division by Flag â€” Dhvajanka", duration: "30 min", free: false },
    ],
  },
  {
    num: 6, slug: "grade-6", color: "#10B981", bg: "linear-gradient(135deg,#10B981,#059669)",
    icon: "âž—", level: "Intermediate",
    title: "Vedic Maths â€” Grade 6",
    tagline: "3-digit tricks & algebra shortcuts",
    headline: "Your child will do 998Ã—997 mentally â€” faster than a calculator",
    chapters: 8, duration: "4.5 hrs", students: "890",
    rating: 4.7, reviews: 198,
    demoCode: MINDSUTRA_DEMO_CHAPTERS["6"],
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
      { title: "Divisibility Rules â€” 7, 11, 13", duration: "25 min", free: false },
      { title: "Fractions & LCM Shortcuts", duration: "25 min", free: false },
      { title: "Linear Equations by Anurupyena", duration: "30 min", free: false },
    ],
  },
  {
    num: 7, slug: "grade-7", color: "#8B5CF6", bg: "linear-gradient(135deg,#8B5CF6,#7C3AED)",
    icon: "ðŸ“", level: "Intermediate",
    title: "Vedic Maths â€” Grade 7",
    tagline: "Equations & advanced multiplication",
    headline: "Your child will solve 2-variable equations in 10 seconds",
    chapters: 8, duration: "5 hrs", students: "640",
    rating: 4.8, reviews: 143,
    demoCode: MINDSUTRA_DEMO_CHAPTERS["7"],
    bullets: [
      "Multiply 4-digit numbers in one written step",
      "Solve simultaneous equations by Paravartya",
      "Find cube roots of perfect cubes mentally",
      "Apply Vedic algebra to NCERT Chapter 4 & 9",
    ],
    curriculum: [
      { title: "Nikhilam Near 10000", duration: "30 min", free: true },
      { title: "Paravartya â€” Transposition Rule", duration: "30 min", free: true },
      { title: "Simultaneous Equations", duration: "35 min", free: false },
      { title: "Cube Roots by Inspection", duration: "25 min", free: false },
      { title: "Criss-Cross 4-digit Products", duration: "35 min", free: false },
      { title: "Algebraic Division â€” Flag Method", duration: "30 min", free: false },
      { title: "Ratio & Proportion Shortcuts", duration: "25 min", free: false },
      { title: "Vedic Trigonometry Intro", duration: "25 min", free: false },
    ],
  },
  {
    num: 8, slug: "grade-8", color: "#EF4444", bg: "linear-gradient(135deg,#EF4444,#DC2626)",
    icon: "ðŸ”¬", level: "Advanced",
    title: "Vedic Maths â€” Grade 8",
    tagline: "Squares, cubes & polynomial tricks",
    headline: "Your child will square any 3-digit number mentally â€” in one breath",
    chapters: 8, duration: "5.5 hrs", students: "420",
    rating: 4.9, reviews: 87,
    demoCode: MINDSUTRA_DEMO_CHAPTERS["8"],
    bullets: [
      "Square any 3-digit number in under 4 seconds",
      "Find cube roots of 6-digit numbers by inspection",
      "Multiply polynomials using Vedic grid method",
      "Solve quadratic equations without the formula",
    ],
    curriculum: [
      { title: "Large Nikhilam â€” Any Base", duration: "35 min", free: true },
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

/* â”€â”€â”€ Star rating component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#F59E0B", fontSize: 12 }}>
      {"â˜…".repeat(Math.floor(rating))}{"â˜†".repeat(5 - Math.floor(rating))}
    </span>
  );
}

/* â”€â”€â”€ Course card with hover popup (Udemy-style) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function CourseCard({ g, idx }: { g: typeof GRADES[0]; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const demoUrl = `/ai-tutor/demo?grade=${g.num}&chapter=${g.demoCode}&fresh=1`;
  const popupRight = idx % 3 === 2; // last column â†’ popup opens left

  return (
    <div
      style={{ position: "relative" as const }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* â”€â”€ Main card â”€â”€ */}
      <a href={`/vedic-math/${g.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{
          background: "#FFFFFF", border: "1px solid #E2E8F0",
          borderRadius: 6, overflow: "hidden",
          boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.15)" : "0 1px 4px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.2s",
          cursor: "pointer",
        }}>
          {/* Thumbnail */}
          <div style={{
            background: g.bg, height: 150,
            display: "flex", flexDirection: "column" as const,
            alignItems: "center", justifyContent: "center", gap: 8, padding: 20,
          }}>
            <div style={{ fontSize: 48 }}>{g.icon}</div>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>Grade {g.num} Â· {g.chapters} chapters</div>
          </div>

          {/* Card body */}
          <div style={{ padding: "12px 14px 14px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", lineHeight: 1.3, marginBottom: 4 }}>{g.title}</div>
            <div style={{ color: "#6B7280", fontSize: 12, marginBottom: 6 }}>{g.tagline}</div>
            <div style={{ color: "#6B7280", fontSize: 11, marginBottom: 4 }}>MindSutra AI Tutor</div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
              <span style={{ color: "#B45309", fontWeight: 700, fontSize: 12 }}>{g.rating}</span>
              <Stars rating={g.rating} />
              <span style={{ color: "#6B7280", fontSize: 11 }}>({g.reviews.toLocaleString()})</span>
            </div>

            {/* Meta */}
            <div style={{ color: "#6B7280", fontSize: 11, marginBottom: 10 }}>
              {g.duration} Â· {g.chapters} chapters Â· {g.level}
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 17, color: "#1A1A2E" }}>â‚¹1,499</span>
              <span style={{ color: "#6B7280", fontSize: 12, textDecoration: "line-through" }}>â‚¹2,999</span>
            </div>
          </div>
        </div>
      </a>

      {/* â”€â”€ Hover popup (Udemy-style) â”€â”€ */}
      {hovered && (
        <div style={{
          position: "absolute" as const,
          top: 0,
          [popupRight ? "right" : "left"]: "calc(100% + 12px)",
          width: 320, zIndex: 100,
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          padding: "20px",
        }}>
          {/* Arrow */}
          <div style={{
            position: "absolute" as const,
            top: 20,
            [popupRight ? "right" : "left"]: -8,
            width: 0, height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            [popupRight ? "borderLeft" : "borderRight"]: "8px solid #E2E8F0",
          }} />

          <div style={{ fontWeight: 800, fontSize: 15, color: "#1A1A2E", marginBottom: 6 }}>{g.headline}</div>
          <div style={{ color: "#6B7280", fontSize: 12, marginBottom: 12 }}>
            Updated March 2026 Â· {g.students} students enrolled
          </div>

          {/* What you'll learn */}
          <div style={{ fontWeight: 700, fontSize: 13, color: "#1A1A2E", marginBottom: 8 }}>What your child will learn:</div>
          {g.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#374151", alignItems: "flex-start" }}>
              <span style={{ color: "#10B981", fontWeight: 700, flexShrink: 0 }}>âœ“</span>
              <span>{b}</span>
            </div>
          ))}

          {/* Chapter preview */}
          <div style={{ fontWeight: 700, fontSize: 13, color: "#1A1A2E", margin: "12px 0 8px" }}>Course content:</div>
          {g.curriculum.slice(0, 4).map((ch, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, fontSize: 12 }}>
              <span style={{ color: ch.free ? "#10B981" : "#9CA3AF", fontSize: 14 }}>{ch.free ? "â–¶" : "ðŸ”’"}</span>
              <span style={{ color: ch.free ? "#374151" : "#6B7280", flex: 1 }}>{ch.title}</span>
              {ch.free && <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3 }}>FREE</span>}
            </div>
          ))}
          <div style={{ color: "#6B7280", fontSize: 12, marginTop: 4 }}>+ {g.chapters - 4} more chapters</div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginTop: 16 }}>
            <a href={demoUrl} style={{
              background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 14,
              padding: "11px 0", borderRadius: 6, textDecoration: "none", textAlign: "center" as const, display: "block",
            }}>
              â–¶ Try Free Demo â€” No Login
            </a>
            <a href={`/vedic-math/${g.slug}`} style={{
              background: "transparent", color: "#1A1A2E", fontWeight: 600, fontSize: 13,
              padding: "10px 0", borderRadius: 6, textDecoration: "none", textAlign: "center" as const, display: "block",
              border: "1.5px solid #1A1A2E",
            }}>
              See Full Curriculum â†’
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* â”€â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function MindSutraPage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      <div
        style={{
          background: "linear-gradient(90deg, #7c2d12, #c2410c)",
          color: "#fff7ed",
          padding: "10px 16px",
          textAlign: "center",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.2,
        }}
      >
        MindSutra pilot release: Grade 4-first curated rollout. Features beyond the guided tutor path may still be stabilizing.
      </div>

      {/* â”€â”€ Nav â”€â”€ */}
      <nav style={{
        background: "#1A1A2E", borderBottom: "1px solid #2D2D4E",
        padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky" as const, top: 0, zIndex: 200,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none" }}>â—€ All Products</a>
          <span style={{ color: "#334155" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>ðŸ§®</span>
            <div>
              <div style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>MindSutra</div>
              <div style={{ color: "#64748B", fontSize: 10 }}>Vedic Maths AI Tutor</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/auth/login" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none" }}>Login</a>
          <a href="/vedic-math/grade-5" style={{
            background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 13,
            padding: "8px 18px", borderRadius: 6, textDecoration: "none",
          }}>Enroll Now</a>
        </div>
      </nav>

      {/* â”€â”€ Hero banner â”€â”€ */}
      <div style={{
        background: "linear-gradient(135deg,#1A1A2E 0%,#2D1B4E 100%)",
        padding: "48px 24px 40px", textAlign: "center" as const,
      }}>
        <div style={{
          background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)",
          color: "#FED7AA", fontSize: 11, fontWeight: 700, padding: "4px 14px",
          borderRadius: 20, display: "inline-block", marginBottom: 16, letterSpacing: 1,
        }}>
          ðŸ‡®ðŸ‡³ CBSE GRADE 4â€“8 Â· AI-POWERED Â· 16 CHAPTERS FREE TO PREVIEW
        </div>
        <h1 style={{ color: "#F1F5F9", fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: -0.5 }}>
          Vedic Maths AI Tutor<br />
          <span style={{ color: "#F97316" }}>for Every CBSE Grade</span>
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 16, margin: "0 auto 28px", maxWidth: 560, lineHeight: 1.65 }}>
          Each grade is a standalone AI course â€” not videos. The AI teaches, asks questions, detects when your child is stuck, and re-explains in real time. Try any chapter free before enrolling.
        </p>

        {/* Trust strip */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" as const }}>
          {[
            { val: "5,000+", lbl: "Students enrolled" },
            { val: "40", lbl: "Chapters across grades" },
            { val: "4.8â˜…", lbl: "Average rating" },
            { val: "â‚¹1,499", lbl: "One-time, no renewals" },
          ].map(s => (
            <div key={s.val} style={{ textAlign: "center" as const }}>
              <div style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 20 }}>{s.val}</div>
              <div style={{ color: "#64748B", fontSize: 12 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* â”€â”€ How to use this page â”€â”€ */}
      <div style={{ background: "#FFFBF5", borderBottom: "1px solid #FED7AA", padding: "12px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#92400E" }}>
          <span>ðŸ’¡</span>
          <span><strong>Hover over any grade card</strong> to preview chapters and learning outcomes. Click to see the full curriculum and free demo.</span>
        </div>
      </div>

      {/* â”€â”€ Course catalog â”€â”€ */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A2E", margin: "0 0 4px" }}>
            5 Courses Â· Grade 4 to Grade 8
          </h2>
          <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>
            Each course has 8 chapters Â· 2 preview chapters free Â· Lifetime access after enrolment
          </p>
        </div>

        {/* Filters strip (like Udemy) */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" as const }}>
          {["All Levels", "Beginner (G4â€“G5)", "Intermediate (G6â€“G7)", "Advanced (G8)"].map((f, i) => (
            <button key={f} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
              background: i === 0 ? "#1A1A2E" : "transparent",
              color: i === 0 ? "#FFFFFF" : "#374151",
              border: i === 0 ? "1px solid #1A1A2E" : "1px solid #D1D5DB",
              fontWeight: i === 0 ? 600 : 400,
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}>
          {GRADES.map((g, idx) => (
            <CourseCard key={g.num} g={g} idx={idx} />
          ))}
        </div>

        {/* Bundle upsell â€” below cards like Udemy personal plan */}
        <div style={{
          marginTop: 40,
          background: "linear-gradient(135deg,#1A1A2E,#2D1B4E)",
          borderRadius: 12, padding: "28px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap" as const, gap: 20,
        }}>
          <div>
            <div style={{ color: "#F97316", fontWeight: 700, fontSize: 12, marginBottom: 6, letterSpacing: 1 }}>BEST VALUE</div>
            <div style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 20, marginBottom: 6 }}>
              All 5 Grades Bundle â€” â‚¹3,999 <span style={{ textDecoration: "line-through", color: "#64748B", fontWeight: 400, fontSize: 16 }}>â‚¹9,999</span>
            </div>
            <div style={{ color: "#94A3B8", fontSize: 14 }}>
              Grade 4â€“8 Â· 40 chapters Â· Lifetime Â· As your child moves up each year, the next course is ready
            </div>
          </div>
          <a href="/checkout/bundle-g4-g8" style={{
            background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 15,
            padding: "12px 28px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" as const,
          }}>
            Get All 5 Grades â†’
          </a>
        </div>
      </div>

      {/* â”€â”€ What is AI tutoring? (social proof section) â”€â”€ */}
      <div style={{ background: "#F1F5F9", borderTop: "1px solid #E2E8F0", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A2E", marginBottom: 24, textAlign: "center" as const }}>
            Not videos. A real AI that teaches, asks, and adapts.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: "ðŸŽ™ï¸", title: "AI explains step by step", body: "Animated board + Indian English voice narrates every Vedic method â€” like a private tutor." },
              { icon: "â“", title: "Asks questions in real time", body: "After each demonstration the AI poses a question and waits. Wrong answer? It re-explains differently." },
              { icon: "ðŸ§ ", title: "Adapts to your child", body: "The AI detects 5 student archetypes â€” fast, slow, confused, distracted â€” and adjusts pace automatically." },
              { icon: "ðŸ“Š", title: "Parent gets full visibility", body: "After every session see chapter completion %, accuracy, XP earned, and which topics need more practice." },
            ].map(f => (
              <div key={f.title} style={{ background: "#FFFFFF", borderRadius: 8, padding: "20px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, color: "#1A1A2E", fontSize: 14, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* â”€â”€ Footer â”€â”€ */}
      <footer style={{ background: "#1A1A2E", padding: "28px 24px", textAlign: "center" as const }}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 12 }}>
          {GRADES.map(g => (
            <a key={g.num} href={`/vedic-math/${g.slug}`} style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>Grade {g.num}</a>
          ))}
          <a href="/auth/login" style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>Login</a>
          <a href="mailto:hello@robodynamics.in" style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>Contact</a>
        </div>
        <p style={{ color: "#334155", fontSize: 12, margin: 0 }}>Â© 2026 RoboDynamics Pvt Ltd Â· MindSutra Â· 30-day money-back guarantee</p>
      </footer>

    </div>
  );
}

