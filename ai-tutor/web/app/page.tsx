"use client";
export const dynamic = "force-dynamic";

// Home page — RoboDynamics AI Tutors product directory.
// Products: MindSutra (Vedic Math) · MindSpark (Aptitude) · MoneyMind (Financial Literacy) · more coming

const PRODUCTS = [
  {
    name: "MindSutra",
    tagline: "Vedic Maths AI Tutor",
    desc: "Interactive AI tutor for Vedic Maths, CBSE Grade 4–8. Detects when your child is stuck, re-explains, and adapts to their pace. Available 24/7 on any phone.",
    icon: "🧮",
    iconBg: "linear-gradient(135deg,#2563EB,#7C3AED)",
    cardBg: "linear-gradient(140deg, #0F2744 0%, #0B1221 100%)",
    border: "2px solid #2563EB",
    tagColor: "#60A5FA",
    tagBg: "rgba(37,99,235,0.15)",
    tagBorder: "rgba(37,99,235,0.3)",
    chips: ["Grade 4–8", "CBSE aligned", "8 chapters/grade", "Parent dashboard", "₹1,499 lifetime"],
    href: "/mindsutra",
    ctaLabel: "Explore MindSutra →",
    ctaBg: "#2563EB",
    ctaColor: "#fff",
    ctaBorder: null,
    subLinks: [
      { label: "▶ Free demo (no login)", href: "/ai-tutor/demo?grade=5&chapter=VM_G5_L1_NIKHILAM_NEAR100&fresh=1", color: "#60A5FA" },
      { label: "Grade 5 curriculum →", href: "/vedic-math/grade-5", color: "#64748B" },
    ],
    badge: null,
    live: true,
  },
  {
    name: "MindSpark",
    tagline: "Aptitude & Reasoning AI Tutor",
    desc: "AI-powered aptitude coaching for competitive exams — CAT, GMAT, campus placements, and government exams. Adaptive practice that targets your weak areas first.",
    icon: "🧠",
    iconBg: "linear-gradient(135deg,#059669,#0D9488)",
    cardBg: "linear-gradient(140deg, #0F2420 0%, #0B1221 100%)",
    border: "1px solid #1E293B",
    tagColor: "#6EE7B7",
    tagBg: "rgba(5,150,105,0.12)",
    tagBorder: "rgba(5,150,105,0.25)",
    chips: ["CAT · GMAT · UPSC", "Quant · LR · DI · VA", "Adaptive mock tests", "Percentile tracker"],
    href: "/mindspark",
    ctaLabel: "Explore MindSpark →",
    ctaBg: "transparent",
    ctaColor: "#CBD5E1",
    ctaBorder: "1px solid #334155",
    subLinks: [],
    badge: "🚀 Coming soon",
    live: false,
  },
  {
    name: "MoneyMind",
    tagline: "Financial Literacy AI Tutor",
    desc: "Teaches students and young adults personal finance — budgeting, investing, taxes, and compound interest — through story-based interactive lessons.",
    icon: "💰",
    iconBg: "linear-gradient(135deg,#D97706,#B45309)",
    cardBg: "linear-gradient(140deg, #1C1400 0%, #0B1221 100%)",
    border: "1px solid #1E293B",
    tagColor: "#FCD34D",
    tagBg: "rgba(217,119,6,0.12)",
    tagBorder: "rgba(217,119,6,0.25)",
    chips: ["Grades 8–12", "Personal finance", "Story-based lessons", "Real world scenarios"],
    href: "/moneymind",
    ctaLabel: "Explore MoneyMind →",
    ctaBg: "transparent",
    ctaColor: "#CBD5E1",
    ctaBorder: "1px solid #334155",
    subLinks: [],
    badge: "🔜 Launching soon",
    live: false,
  },
];

export default function Home() {
  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "#0B1221",
      color: "#F1F5F9",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── Nav ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 28px", borderBottom: "1px solid #1E293B",
        background: "rgba(11,18,33,0.97)",
        position: "sticky", top: 0, zIndex: 100,
      } as React.CSSProperties}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>RoboDynamics</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: -2 }}>AI Tutors for India</div>
          </div>
        </div>
        <a href="/auth/login" style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none" }}>Login →</a>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", padding: "64px 24px 48px" }}>
        <div style={{
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
          color: "#93C5FD", fontSize: 12, fontWeight: 600, padding: "4px 14px",
          borderRadius: 20, display: "inline-block", marginBottom: 20,
          letterSpacing: 1, textTransform: "uppercase",
        } as React.CSSProperties}>
          🇮🇳 AI tutors built for Indian students
        </div>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 46px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: -1 }}>
          Choose your AI tutor
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "clamp(14px, 2vw, 17px)", maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
          Each product is a specialist AI tutor — not a generic platform.
          Pick the one that matches your child&apos;s grade and goal.
        </p>
      </div>

      {/* ── Product cards ── */}
      <div style={{
        display: "flex", gap: 24, padding: "0 24px 80px",
        maxWidth: 1160, margin: "0 auto", width: "100%",
        flexWrap: "wrap", justifyContent: "center",
        boxSizing: "border-box",
      } as React.CSSProperties}>
        {PRODUCTS.map(p => (
          <a key={p.name} href={p.href} style={{
            flex: "1 1 320px", maxWidth: 380,
            background: p.cardBg,
            border: p.border,
            borderRadius: 20, padding: "32px 28px",
            textDecoration: "none", display: "block",
          } as React.CSSProperties}>

            {/* Icon + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 13,
                background: p.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0,
              }}>
                {p.icon}
              </div>
              <div>
                <div style={{ fontSize: 21, fontWeight: 900, color: "#F1F5F9" }}>{p.name}</div>
                <div style={{ fontSize: 13, color: p.tagColor, marginTop: 2 }}>{p.tagline}</div>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              {p.desc}
            </p>

            {/* Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 } as React.CSSProperties}>
              {p.chips.map(tag => (
                <span key={tag} style={{
                  background: p.tagBg,
                  border: `1px solid ${p.tagBorder}`,
                  color: p.tagColor,
                  fontSize: 11, padding: "3px 9px", borderRadius: 20,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA button */}
            <div style={{
              textAlign: "center",
              background: p.ctaBg,
              border: p.ctaBorder ?? "none",
              color: p.ctaColor,
              padding: "12px 16px", borderRadius: 9,
              fontSize: 15, fontWeight: 700,
              marginBottom: p.subLinks.length > 0 || p.badge ? 14 : 0,
            } as React.CSSProperties}>
              {p.ctaLabel}
            </div>

            {/* Sub links (live products) */}
            {p.subLinks.length > 0 && (
              <div style={{ display: "flex", gap: 16 }}>
                {p.subLinks.map(sl => (
                  <a key={sl.label} href={sl.href}
                    style={{ color: sl.color, fontSize: 13, textDecoration: "none" }}>
                    {sl.label}
                  </a>
                ))}
              </div>
            )}

            {/* Badge (coming soon) */}
            {p.badge && (
              <div style={{
                display: "inline-block",
                background: p.tagBg,
                border: `1px solid ${p.tagBorder}`,
                color: p.tagColor,
                fontSize: 12, padding: "3px 12px", borderRadius: 20,
              }}>
                {p.badge}
              </div>
            )}

          </a>
        ))}
      </div>

      {/* ── More coming ── */}
      <div style={{ textAlign: "center", padding: "0 24px 80px" }}>
        <div style={{
          display: "inline-block",
          background: "#0F172A", border: "1px solid #1E293B",
          borderRadius: 14, padding: "20px 32px",
        }}>
          <div style={{ color: "#64748B", fontSize: 13, marginBottom: 6 }}>More AI tutors in development</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" } as React.CSSProperties}>
            {["🔬 Science (Grade 6–10)", "💻 Coding (Python)", "🗣️ English (Communication)", "📚 NEET Biology"].map(t => (
              <span key={t} style={{
                background: "#1E293B", color: "#64748B",
                fontSize: 12, padding: "4px 12px", borderRadius: 20,
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        marginTop: "auto", borderTop: "1px solid #0F172A",
        background: "#060C18", padding: "24px",
        textAlign: "center", color: "#334155", fontSize: 12,
      } as React.CSSProperties}>
        © 2026 RoboDynamics Pvt Ltd · Bengaluru, India ·{" "}
        <a href="/auth/login" style={{ color: "#475569", textDecoration: "none" }}>Login</a>
        {" · "}
        <a href="mailto:hello@robodynamics.in" style={{ color: "#475569", textDecoration: "none" }}>hello@robodynamics.in</a>
      </footer>

    </div>
  );
}
