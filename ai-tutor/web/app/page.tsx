"use client";

import { useState } from "react";

// ─── Course catalog ─────────────────────────────────────────────────────────

const TUTORS = [
  {
    id: "mindsutra",
    name: "MindSutra",
    subject: "Vedic Maths",
    tagline: "Vedic Maths AI Tutor · CBSE Grade 4–8",
    desc: "An AI tutor that teaches ancient Vedic shortcuts — detects when your child is stuck, re-explains differently, and adapts to their pace. Like a private tutor, available 24/7.",
    icon: "🧮",
    gradient: "linear-gradient(135deg, #F97316 0%, #DC2626 100%)",
    cardBg: "#FFF7ED",
    border: "2px solid #FED7AA",
    accentColor: "#F97316",
    chips: ["Grade 4–8", "CBSE aligned", "8 lessons/grade", "Parent dashboard"],
    price: "₹1,499",
    oldPrice: "₹2,999",
    students: "5,200+",
    rating: 4.8,
    reviews: 1281,
    duration: "3.5–5.5 hrs",
    href: "/mindsutra",
    demoHref: "/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1",
    grades: ["4", "5", "6", "7", "8"],
    live: true,
    bullets: [
      "Multiply 97×103 in 5 seconds — mentally",
      "Square any 2-digit number in 3 seconds",
      "Check every answer instantly with digit sums",
      "Solve CBSE problems 3× faster",
    ],
  },
  {
    id: "mindspark",
    name: "MindSpark",
    subject: "Aptitude & Reasoning",
    tagline: "Aptitude & Reasoning AI Tutor · Grade 4–12",
    desc: "AI-powered aptitude coaching for competitive exams — CAT, GMAT, campus placements, government exams. Adaptive practice that targets your weak areas first.",
    icon: "🧠",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
    cardBg: "#F5F3FF",
    border: "2px solid #DDD6FE",
    accentColor: "#7C3AED",
    chips: ["Grade 4–12", "CAT · GMAT · UPSC", "Adaptive practice", "Percentile tracker"],
    price: "₹1,299",
    oldPrice: "₹2,499",
    students: "Coming soon",
    rating: 4.7,
    reviews: 0,
    duration: "4–6 hrs",
    href: "/mindspark",
    demoHref: "/ai-tutor/demo?grade=4&chapter=AR_G4_L1_PATTERNS&fresh=1",
    grades: ["4", "5", "6", "7", "8", "9", "10", "11", "12"],
    live: false,
    bullets: [
      "Number series, analogies, coding-decoding",
      "Directions, calendar, clocks — mastered",
      "Venn diagrams & data interpretation",
      "Puzzle-solving strategy for competitive exams",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Sunita Sharma",
    role: "Mother of Priya, Grade 5",
    avatar: "👩",
    text: "My daughter used to dread maths. After just 2 weeks with MindSutra, she's doing multiplication in her head faster than her teacher. The AI tutor explains it 3 different ways until she gets it.",
  },
  {
    name: "Rajesh Kumar",
    role: "Father of Arjun, Grade 7",
    avatar: "👨",
    text: "I can see exactly where Arjun is stuck from the parent dashboard. The AI catches errors I would have missed. He's gone from 55% to 89% accuracy in 6 weeks.",
  },
  {
    name: "Priya Nair",
    role: "Mother of Kavya, Grade 4",
    avatar: "👩‍💼",
    text: "Kavya loves the AI teacher — she calls it 'Raj sir'. She asks to do lessons herself now. No fights about homework anymore. Worth every rupee.",
  },
];

const HOW_IT_WORKS = [
  { num: "01", icon: "🎬", title: "AI introduces the concept", body: "Animated board + Indian English voice narrates the Vedic method step by step — like a private tutor demo." },
  { num: "02", icon: "❓", title: "Asks your child questions", body: "After each demo the AI poses a question and waits. Wrong answer? It re-explains a completely different way." },
  { num: "03", icon: "🧠", title: "Detects how they learn", body: "The AI tracks 5 student patterns — fast learner, slow, confused, distracted, guessing — and adapts automatically." },
  { num: "04", icon: "📊", title: "Parents see everything", body: "After every session: chapter completion %, accuracy, XP earned, and exactly which topics need more practice." },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < full ? "#F59E0B" : (i === full && half) ? "#F59E0B" : "#E2E8F0", fontSize: 13 }}>
          {i < full ? "★" : (i === full && half) ? "½" : "☆"}
        </span>
      ))}
      {reviews > 0 && <span style={{ color: "#64748B", fontSize: 12, marginLeft: 2 }}>({reviews.toLocaleString()})</span>}
    </span>
  );
}

function TutorCard({ t }: { t: typeof TUTORS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: "relative", flex: "1 1 340px", maxWidth: 480 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: "#FFFFFF",
        border: hovered ? `2px solid ${t.accentColor}` : "2px solid #E2E8F0",
        borderRadius: 16, overflow: "hidden",
        boxShadow: hovered ? `0 20px 60px ${t.accentColor}22` : "0 4px 16px rgba(0,0,0,0.08)",
        transition: "all 0.25s ease",
        height: "100%",
      }}>
        {/* Thumbnail */}
        <div style={{ background: t.gradient, padding: "36px 28px 28px", position: "relative" }}>
          {!t.live && (
            <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", color: "#FFF", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: 1 }}>
              COMING SOON
            </div>
          )}
          <div style={{ fontSize: 56, marginBottom: 12 }}>{t.icon}</div>
          <div style={{ color: "rgba(255,255,255,0.95)", fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{t.name}</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{t.tagline}</div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>
          <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{t.desc}</p>

          {/* Chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {t.chips.map(c => (
              <span key={c} style={{ background: t.cardBg, border: t.border, color: t.accentColor, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                {c}
              </span>
            ))}
          </div>

          {/* What they learn */}
          <div style={{ marginBottom: 18 }}>
            {t.bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#374151", alignItems: "flex-start" }}>
                <span style={{ color: t.accentColor, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>

          {/* Rating + meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: "#92400E" }}>{t.rating}</span>
            <StarRating rating={t.rating} reviews={t.reviews} />
          </div>
          <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 16 }}>
            {t.students} students · {t.duration} total · {t.grades.length} grade levels
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#0F172A" }}>{t.price}</span>
            <span style={{ fontSize: 14, color: "#94A3B8", textDecoration: "line-through" }}>{t.oldPrice}</span>
            <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>50% OFF</span>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {t.live ? (
              <>
                <a href={t.href} style={{ display: "block", background: t.accentColor, color: "#FFF", fontWeight: 700, fontSize: 15, padding: "13px", borderRadius: 10, textDecoration: "none", textAlign: "center" }}>
                  Explore {t.name} →
                </a>
                <a href={t.demoHref} style={{ display: "block", background: "transparent", color: t.accentColor, fontWeight: 600, fontSize: 13, padding: "10px", borderRadius: 10, textDecoration: "none", textAlign: "center", border: `1.5px solid ${t.accentColor}` }}>
                  ▶ Try Free Demo — No Login
                </a>
              </>
            ) : (
              <div style={{ display: "block", background: "#F1F5F9", color: "#94A3B8", fontWeight: 700, fontSize: 15, padding: "13px", borderRadius: 10, textAlign: "center", cursor: "default" }}>
                🚀 Coming Soon — Register Interest
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: "#FFFFFF", color: "#0F172A", minHeight: "100vh" }}>

      {/* ── Announcement bar ── */}
      <div style={{ background: "linear-gradient(90deg, #F97316, #DC2626)", color: "#FFF", textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 700 }}>
        🎉 MindSutra now live for Grade 4–8 · Try free demo — no registration required
        <a href="/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1" style={{ color: "#FFF", marginLeft: 16, fontWeight: 800, textDecoration: "underline" }}>Start now →</a>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #F97316, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              🤖
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", letterSpacing: -0.5 }}>AptiPath<span style={{ color: "#F97316" }}>360</span></div>
              <div style={{ fontSize: 10, color: "#94A3B8", marginTop: -2, letterSpacing: 0.5 }}>AI TUTORS FOR INDIA</div>
            </div>
          </a>
          {/* Nav links */}
          <div style={{ display: "flex", gap: 24 }} className="nav-links">
            <a href="/mindsutra" style={{ color: "#475569", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>MindSutra</a>
            <a href="/mindspark" style={{ color: "#475569", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>MindSpark</a>
            <a href="/parent/dashboard" style={{ color: "#475569", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>For Parents</a>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/auth/login" style={{ color: "#475569", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>Log in</a>
          <a href="/mindsutra" style={{ background: "#F97316", color: "#FFF", fontSize: 14, fontWeight: 700, padding: "9px 20px", borderRadius: 8, textDecoration: "none" }}>
            Get Started
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)", padding: "80px 24px 64px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.4)", color: "#FED7AA", fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 20, marginBottom: 24, letterSpacing: 1, textTransform: "uppercase" }}>
          🇮🇳 India's AI Tutoring Platform for School Students
        </div>
        <h1 style={{ color: "#F8FAFC", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, margin: "0 0 20px", lineHeight: 1.15, letterSpacing: -1 }}>
          Your child&apos;s personal AI tutor —<br />
          <span style={{ color: "#F97316" }}>smarter than videos, faster than coaching</span>
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "clamp(15px, 2vw, 18px)", maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Not recorded videos. A live AI that teaches, asks questions, detects when your child is stuck,
          and re-explains differently. Available 24/7 on any device.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <a href="/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1" style={{ background: "#F97316", color: "#FFF", fontWeight: 800, fontSize: 16, padding: "15px 32px", borderRadius: 10, textDecoration: "none", boxShadow: "0 4px 20px rgba(249,115,22,0.4)" }}>
            ▶ Try Free Demo
          </a>
          <a href="/mindsutra" style={{ background: "rgba(255,255,255,0.08)", color: "#F8FAFC", fontWeight: 700, fontSize: 16, padding: "15px 32px", borderRadius: 10, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
            Browse Courses
          </a>
        </div>

        {/* Trust strip */}
        <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { val: "5,200+", lbl: "Students enrolled" },
            { val: "40+", lbl: "AI-taught chapters" },
            { val: "4.8 ★", lbl: "Average rating" },
            { val: "₹1,499", lbl: "One-time, lifetime access" },
          ].map(s => (
            <div key={s.val} style={{ textAlign: "center" }}>
              <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 22 }}>{s.val}</div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Tutor Courses ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 900, color: "#0F172A", margin: "0 0 12px", letterSpacing: -0.5 }}>
            Choose Your AI Tutor
          </h2>
          <p style={{ color: "#64748B", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            Each product is a specialist AI tutor — not a generic platform. Pick the one that matches your child&apos;s grade and goal.
          </p>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {TUTORS.map(t => <TutorCard key={t.id} t={t} />)}
        </div>
      </div>

      {/* ── How It Works ── */}
      <div style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: "#0F172A", margin: "0 0 12px" }}>
              Not videos. A real AI that teaches, asks, and adapts.
            </h2>
            <p style={{ color: "#64748B", fontSize: 15 }}>Every session is a live dialogue between the AI and your child.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {HOW_IT_WORKS.map(h => (
              <div key={h.num} style={{ background: "#FFFFFF", borderRadius: 14, padding: "24px 20px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 30 }}>{h.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", letterSpacing: 1 }}>STEP {h.num}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", marginBottom: 8 }}>{h.title}</div>
                <div style={{ color: "#64748B", fontSize: 13, lineHeight: 1.6 }}>{h.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Parent Dashboard callout ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", borderRadius: 20, padding: "48px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ color: "#F97316", fontWeight: 700, fontSize: 12, letterSpacing: 1, marginBottom: 12 }}>FOR PARENTS</div>
            <h3 style={{ color: "#F8FAFC", fontSize: 28, fontWeight: 900, margin: "0 0 16px", lineHeight: 1.3 }}>
              Full visibility into your child&apos;s progress — session by session
            </h3>
            <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.7, margin: "0 0 24px" }}>
              See accuracy %, chapters completed, time spent, weak areas, and daily activity heatmap.
              No more guessing — know exactly where they need help.
            </p>
            <a href="/parent/dashboard" style={{ display: "inline-block", background: "#F97316", color: "#FFF", fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
              View Parent Dashboard →
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { icon: "📚", val: "3/8", lbl: "Chapters done" },
              { icon: "🎯", val: "83%", lbl: "Avg accuracy" },
              { icon: "🔥", val: "7 days", lbl: "Current streak" },
              { icon: "⭐", val: "1,240", lbl: "XP earned" },
            ].map(s => (
              <div key={s.lbl} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 20 }}>{s.val}</div>
                <div style={{ color: "#64748B", fontSize: 12 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: "#0F172A", margin: "0 0 40px" }}>
            What parents are saying
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: "#FFFFFF", borderRadius: 14, padding: 24, border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ color: "#F97316", fontSize: 24, marginBottom: 12 }}>❝</div>
                <p style={{ color: "#374151", fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{t.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div style={{ background: "linear-gradient(135deg, #F97316, #DC2626)", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ color: "#FFF", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, margin: "0 0 16px" }}>
          Start your child&apos;s AI learning journey today
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, margin: "0 auto 32px", maxWidth: 500 }}>
          Try any chapter free — no login, no credit card. Experience the AI tutor before you pay.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1" style={{ background: "#FFFFFF", color: "#F97316", fontWeight: 800, fontSize: 16, padding: "14px 32px", borderRadius: 10, textDecoration: "none" }}>
            ▶ Try Free Demo
          </a>
          <a href="/mindsutra" style={{ background: "rgba(255,255,255,0.15)", color: "#FFF", fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 10, textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)" }}>
            View All Courses
          </a>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "#0F172A", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #F97316, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 16 }}>AptiPath<span style={{ color: "#F97316" }}>360</span></div>
              </div>
              <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                AI tutors built for Indian students — adaptive, voice-enabled, and available 24/7.
              </p>
            </div>
            <div>
              <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>PRODUCTS</div>
              {[["MindSutra", "/mindsutra"], ["MindSpark", "/mindspark"]].map(([n, h]) => (
                <div key={n} style={{ marginBottom: 8 }}><a href={h} style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>{n}</a></div>
              ))}
            </div>
            <div>
              <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>GRADES</div>
              {["Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"].map(g => (
                <div key={g} style={{ marginBottom: 8 }}><a href={`/vedic-math/${g.toLowerCase().replace(" ", "-")}`} style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>{g}</a></div>
              ))}
            </div>
            <div>
              <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>ACCOUNT</div>
              {[["Login", "/auth/login"], ["Register", "/auth/register"], ["Student Dashboard", "/student/home"], ["Parent Dashboard", "/parent/dashboard"]].map(([n, h]) => (
                <div key={n} style={{ marginBottom: 8 }}><a href={h} style={{ color: "#64748B", fontSize: 13, textDecoration: "none" }}>{n}</a></div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1E293B", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#334155", fontSize: 12 }}>© 2026 RoboDynamics Pvt Ltd · Bengaluru, India</span>
            <span style={{ color: "#334155", fontSize: 12 }}>
              <a href="mailto:hello@robodynamics.in" style={{ color: "#475569", textDecoration: "none" }}>hello@robodynamics.in</a>
              {" · "}
              <a href="/terms" style={{ color: "#475569", textDecoration: "none" }}>Terms</a>
              {" · "}
              <a href="/privacy" style={{ color: "#475569", textDecoration: "none" }}>Privacy</a>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
