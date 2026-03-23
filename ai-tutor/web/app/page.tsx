"use client";

import { useState, useRef } from "react";

// ─── Summer Camp Programs ────────────────────────────────────────────────────

const CAMP_PROGRAMS = [
  {
    id: "beginner",
    name: "Beginner Robotics",
    subtitle: "Arduino + C Programming",
    icon: "🤖",
    ageGroup: "Ages 8–12",
    fee: "₹8,000",
    sessions: "20 Sessions",
    hours: "40 Hours",
    tech: "Arduino Uno",
    techIcon: "⚡",
    gradient: "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
    accentColor: "#059669",
    level: "Beginner",
    levelColor: "#10B981",
    highlights: [
      "25+ hands-on projects",
      "C Programming from scratch",
      "Obstacle-avoiding robot car",
      "Line follower robot",
      "Traffic light & sensor systems",
    ],
    badge: "Most Popular",
  },
  {
    id: "intermediate",
    name: "Intermediate Robotics",
    subtitle: "ESP32 IoT + C Programming",
    icon: "📡",
    ageGroup: "Ages 10–15",
    fee: "₹10,000",
    sessions: "20 Sessions",
    hours: "40 Hours",
    tech: "ESP32 DevKit",
    techIcon: "🌐",
    gradient: "linear-gradient(135deg, #2563EB 0%, #0891B2 100%)",
    accentColor: "#2563EB",
    level: "Intermediate",
    levelColor: "#3B82F6",
    highlights: [
      "WiFi + Bluetooth control",
      "IoT smart home projects",
      "Mobile-controlled robot",
      "MQTT cloud dashboard",
      "FreeRTOS multitasking",
    ],
    badge: null,
  },
  {
    id: "advanced",
    name: "Advanced Robotics",
    subtitle: "Raspberry Pi + Python + AI",
    icon: "🧠",
    ageGroup: "Ages 12–18",
    fee: "₹12,000",
    sessions: "20 Sessions",
    hours: "40 Hours",
    tech: "Raspberry Pi 4",
    techIcon: "🔬",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
    accentColor: "#7C3AED",
    level: "Advanced",
    levelColor: "#8B5CF6",
    highlights: [
      "Face & object detection with AI",
      "Voice-controlled robot",
      "Computer Vision (OpenCV)",
      "Autonomous navigation",
      "TensorFlow Lite on Pi",
    ],
    badge: "AI + Vision",
  },
  {
    id: "python",
    name: "Python Programming",
    subtitle: "Pure Coding — No Hardware",
    icon: "🐍",
    ageGroup: "Ages 10–16",
    fee: "₹8,000",
    sessions: "20 Sessions",
    hours: "40 Hours",
    tech: "Computer Lab",
    techIcon: "💻",
    gradient: "linear-gradient(135deg, #D97706 0%, #DC2626 100%)",
    accentColor: "#D97706",
    level: "Beginner–Intermediate",
    levelColor: "#F59E0B",
    highlights: [
      "Zero prior experience needed",
      "Games with Pygame (Snake!)",
      "Data analysis with pandas",
      "Web scraping & automation",
      "Intro to AI / Machine Learning",
    ],
    badge: "No Hardware",
  },
];

// ─── MindSutra Grade Cards ───────────────────────────────────────────────────

const MINDSUTRA_GRADES = [
  {
    grade: 4, label: "Grade 4", icon: "🔢",
    tagline: "Fast Addition & Multiplication",
    chapters: 8, price: "₹1,499", oldPrice: "₹2,999",
    color: "#F97316", gradient: "linear-gradient(135deg,#F97316,#EF4444)",
    href: "/mindsutra",
    demoHref: "/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1",
    skills: ["Fast Addition", "Multiplication Tricks", "Digit Sums", "Number Bonds"],
  },
  {
    grade: 5, label: "Grade 5", icon: "✖️",
    tagline: "Multiplication Mastery",
    chapters: 8, price: "₹1,499", oldPrice: "₹2,999",
    color: "#EA580C", gradient: "linear-gradient(135deg,#EA580C,#DC2626)",
    href: "/mindsutra",
    demoHref: "/ai-tutor/demo?grade=5&chapter=VM_G5_L1_MULTIPLY&fresh=1",
    skills: ["2-digit multiplication", "Squares shortcuts", "Complements", "Divisibility"],
  },
  {
    grade: 6, label: "Grade 6", icon: "➗",
    tagline: "Division & Fractions Fast",
    chapters: 8, price: "₹1,499", oldPrice: "₹2,999",
    color: "#DC2626", gradient: "linear-gradient(135deg,#DC2626,#B91C1C)",
    href: "/mindsutra",
    demoHref: "/ai-tutor/demo?grade=6&chapter=VM_G6_L1_DIVISION&fresh=1",
    skills: ["Lightning Division", "Fractions", "LCM/HCF tricks", "Decimals"],
  },
  {
    grade: 7, label: "Grade 7", icon: "📐",
    tagline: "Algebra & Advanced Squares",
    chapters: 8, price: "₹1,499", oldPrice: "₹2,999",
    color: "#B91C1C", gradient: "linear-gradient(135deg,#B91C1C,#991B1B)",
    href: "/mindsutra",
    demoHref: "/ai-tutor/demo?grade=7&chapter=VM_G7_L1_ALGEBRA&fresh=1",
    skills: ["Algebraic shortcuts", "3-digit squares", "Cube roots", "Proportions"],
  },
  {
    grade: 8, label: "Grade 8", icon: "🔬",
    tagline: "Advanced Vedic Techniques",
    chapters: 8, price: "₹1,499", oldPrice: "₹2,999",
    color: "#991B1B", gradient: "linear-gradient(135deg,#991B1B,#7F1D1D)",
    href: "/mindsutra",
    demoHref: "/ai-tutor/demo?grade=8&chapter=VM_G8_L1_ADVANCED&fresh=1",
    skills: ["Simultaneous equations", "Trigonometry shortcuts", "Advanced squares", "Exam tricks"],
  },
];

// ─── MindSpark Grade Cards ───────────────────────────────────────────────────

const MINDSPARK_GRADES = [
  {
    label: "Grade 4–5", icon: "🔍",
    tagline: "Patterns & Visual Logic",
    chapters: 8, price: "₹1,299", oldPrice: "₹2,499",
    color: "#7C3AED", gradient: "linear-gradient(135deg,#7C3AED,#4F46E5)",
    href: "/mindspark",
    skills: ["Number Patterns", "Odd One Out", "Picture Reasoning", "Directions"],
    badge: "Foundation",
  },
  {
    label: "Grade 6–8", icon: "🧩",
    tagline: "Logical Reasoning & Data",
    chapters: 8, price: "₹1,299", oldPrice: "₹2,499",
    color: "#4F46E5", gradient: "linear-gradient(135deg,#4F46E5,#2563EB)",
    href: "/mindspark",
    skills: ["Series Advanced", "Venn Diagrams", "Clocks & Time", "Data Sufficiency"],
    badge: "Intermediate",
  },
  {
    label: "Grade 9–10", icon: "📊",
    tagline: "Quantitative Aptitude",
    chapters: 10, price: "₹1,499", oldPrice: "₹2,999",
    color: "#2563EB", gradient: "linear-gradient(135deg,#2563EB,#0891B2)",
    href: "/mindspark",
    skills: ["Percentage & Profit", "Time & Work", "Speed Distance", "Ratio Proportion"],
    badge: "Intermediate",
  },
  {
    label: "Grade 11–12", icon: "🎯",
    tagline: "Competitive Exam Prep",
    chapters: 12, price: "₹1,799", oldPrice: "₹3,499",
    color: "#0891B2", gradient: "linear-gradient(135deg,#0891B2,#059669)",
    href: "/mindspark",
    skills: ["Critical Reasoning", "Data Interpretation", "Logical Puzzles", "Verbal Ability"],
    badge: "Advanced",
  },
  {
    label: "College / CAT", icon: "🏆",
    tagline: "CAT · GMAT · UPSC · Banking",
    chapters: 16, price: "₹2,499", oldPrice: "₹4,999",
    color: "#059669", gradient: "linear-gradient(135deg,#059669,#7C3AED)",
    href: "/mindspark",
    skills: ["CAT Quant", "GMAT Verbal", "UPSC CSAT", "Banking PO"],
    badge: "Pro",
  },
];

// ─── AptiPath Grade Cards ────────────────────────────────────────────────────

const APTIPATH_GRADES = [
  {
    grade: 8, label: "Grade 8", icon: "🚀",
    tagline: "Foundation for Competitive Maths",
    chapters: 10, price: "₹1,499", oldPrice: "₹2,999",
    color: "#F59E0B", gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
    skills: ["Mensuration shortcuts", "Number theory", "Basic Algebra", "Ratio & Proportion"],
    badge: "Foundation",
  },
  {
    grade: 9, label: "Grade 9", icon: "⚡",
    tagline: "Speed Maths & Aptitude",
    chapters: 12, price: "₹1,499", oldPrice: "₹2,999",
    color: "#EF4444", gradient: "linear-gradient(135deg,#EF4444,#DC2626)",
    skills: ["Speed calculations", "Percentages", "Simple & Compound Interest", "Geometry"],
    badge: "Intermediate",
  },
  {
    grade: 10, label: "Grade 10", icon: "🎓",
    tagline: "Board + Competitive Prep",
    chapters: 14, price: "₹1,799", oldPrice: "₹3,499",
    color: "#DC2626", gradient: "linear-gradient(135deg,#DC2626,#9333EA)",
    skills: ["Probability", "Statistics", "Trigonometry", "Coordinate Geometry"],
    badge: "Dual Track",
  },
  {
    grade: 11, label: "Grade 11", icon: "🔭",
    tagline: "JEE / NEET Foundation",
    chapters: 16, price: "₹1,999", oldPrice: "₹3,999",
    color: "#9333EA", gradient: "linear-gradient(135deg,#9333EA,#2563EB)",
    skills: ["Permutations & Combinations", "Matrices", "Vectors", "Complex Numbers"],
    badge: "JEE Track",
  },
  {
    grade: 12, label: "Grade 12", icon: "🌟",
    tagline: "JEE Advanced · NEET · CAT",
    chapters: 16, price: "₹2,299", oldPrice: "₹4,499",
    color: "#2563EB", gradient: "linear-gradient(135deg,#2563EB,#0891B2)",
    skills: ["Calculus shortcuts", "3D Geometry", "Statistics Advanced", "Mock Test Strategy"],
    badge: "Advanced",
  },
  {
    grade: 0, label: "College / Grad", icon: "💼",
    tagline: "CAT · GMAT · UPSC · Placements",
    chapters: 20, price: "₹2,999", oldPrice: "₹5,999",
    color: "#0891B2", gradient: "linear-gradient(135deg,#0891B2,#059669)",
    skills: ["CAT preparation", "GMAT Quantitative", "UPSC CSAT", "Campus Placements"],
    badge: "Pro",
  },
];

// ─── Testimonials ────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Sunita Sharma", role: "Mother of Priya, Grade 5", avatar: "👩",
    text: "My daughter used to dread maths. After just 2 weeks with MindSutra, she's multiplying in her head faster than her teacher. The AI explains it 3 different ways until she gets it.",
    stars: 5, product: "MindSutra",
  },
  {
    name: "Rajesh Kumar", role: "Father of Arjun, Grade 7", avatar: "👨",
    text: "I can see exactly where Arjun is stuck from the parent dashboard. He's gone from 55% to 89% accuracy in 6 weeks. The robotics camp was the best summer activity we've ever done.",
    stars: 5, product: "Robotics + MindSutra",
  },
  {
    name: "Meena Patel", role: "Parent of Kavya, Age 11", avatar: "👩‍💼",
    text: "Kavya built her own obstacle-avoiding robot in the summer camp! She talks about circuits and coding at the dinner table now. RoboDynamics truly sparks a love for technology.",
    stars: 5, product: "Beginner Robotics Camp",
  },
  {
    name: "Vikram Nair", role: "Engineering parent, Bangalore", avatar: "👨‍💻",
    text: "The Advanced Robotics camp was absolutely worth it. My son used OpenCV and Python on Raspberry Pi — skills that university students struggle with. Exceptional curriculum.",
    stars: 5, product: "Advanced Robotics Camp",
  },
];

// ─── Netflix-style horizontal scroll row ─────────────────────────────────────

function ScrollRow({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "0 32px" }}>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h2>
        {badge && (
          <span style={{ background: "#F97316", color: "#fff", borderRadius: 4, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
            {badge}
          </span>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => scroll("left")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 36, height: 36, color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={() => scroll("right")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 36, height: 36, color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </div>
      </div>
      <div ref={rowRef} style={{ display: "flex", gap: 16, overflowX: "auto", padding: "4px 32px 12px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {children}
      </div>
    </div>
  );
}

// ─── AI Tutor Grade Card ─────────────────────────────────────────────────────

function TutorCard({ item }: { item: any }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: 220, maxWidth: 220, borderRadius: 12, overflow: "visible", cursor: "pointer", position: "relative",
        transform: hovered ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.2s ease",
        zIndex: hovered ? 10 : 1,
      }}
    >
      {/* Thumbnail */}
      <div style={{ background: item.gradient, borderRadius: 10, height: 130, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 40 }}>{item.icon}</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginTop: 8 }}>{item.label}</span>
        {item.badge && (
          <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.55)", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>
            {item.badge}
          </span>
        )}
      </div>
      {/* Info */}
      <div style={{ background: "#1a1a2e", borderRadius: "0 0 10px 10px", padding: "10px 12px" }}>
        <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.tagline}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: item.color || "#F97316", fontSize: 14, fontWeight: 700 }}>{item.price}</span>
          <span style={{ color: "#64748b", fontSize: 11, textDecoration: "line-through" }}>{item.oldPrice}</span>
        </div>
      </div>
      {/* Hover popup */}
      {hovered && (
        <div style={{
          position: "absolute", top: 0, left: "105%", width: 240, background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 16,
          boxShadow: "0 20px 40px rgba(0,0,0,0.7)", zIndex: 20,
        }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.label} — {item.tagline}</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10 }}>{item.chapters} chapters · AI-powered · Adaptive</div>
          <ul style={{ margin: "0 0 12px", paddingLeft: 16 }}>
            {(item.skills || []).map((s: string, i: number) => (
              <li key={i} style={{ color: "#cbd5e1", fontSize: 12, marginBottom: 4 }}>{s}</li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={item.demoHref || item.href} style={{ flex: 1, background: item.color || "#F97316", color: "#fff", borderRadius: 6, padding: "6px 0", textAlign: "center", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Try Free</a>
            <a href={item.href} style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 6, padding: "6px 0", textAlign: "center", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Details</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summer Camp Card ─────────────────────────────────────────────────────────

function CampCard({ p }: { p: typeof CAMP_PROGRAMS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: 260, maxWidth: 260, borderRadius: 14, overflow: "hidden", cursor: "pointer",
        background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.08)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.3)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Header */}
      <div style={{ background: p.gradient, padding: "20px 20px 16px", position: "relative" }}>
        {p.badge && (
          <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.4)", color: "#fff", borderRadius: 4, padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
            {p.badge}
          </span>
        )}
        <span style={{ fontSize: 36 }}>{p.icon}</span>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, marginTop: 8 }}>{p.name}</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 }}>{p.subtitle}</div>
      </div>
      {/* Body */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8", borderRadius: 4, padding: "3px 8px", fontSize: 11 }}>{p.ageGroup}</span>
          <span style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8", borderRadius: 4, padding: "3px 8px", fontSize: 11 }}>{p.sessions}</span>
          <span style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8", borderRadius: 4, padding: "3px 8px", fontSize: 11 }}>{p.hours}</span>
        </div>
        <ul style={{ margin: "0 0 14px", paddingLeft: 18, color: "#cbd5e1", fontSize: 12.5 }}>
          {p.highlights.map((h, i) => <li key={i} style={{ marginBottom: 4 }}>{h}</li>)}
        </ul>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 14 }}>
          <span style={{ color: p.accentColor, fontSize: 22, fontWeight: 800 }}>{p.fee}</span>
          <span style={{ color: "#64748b", fontSize: 12 }}>all materials included</span>
        </div>
        <a
          href="tel:8374377311"
          style={{ display: "block", background: p.gradient, color: "#fff", borderRadius: 8, padding: "10px 0", textAlign: "center", fontWeight: 700, fontSize: 14, textDecoration: "none", letterSpacing: 0.3 }}
        >
          Enroll Now — Call 83743 77311
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#fff" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 32 }}>
          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 40, objectFit: "contain" }} />
          </a>

          {/* Links */}
          <div style={{ display: "flex", gap: 24, marginLeft: 16 }} className="nav-links">
            <a href="#summer-camp" style={{ color: "#fbbf24", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>🏕️ Summer Camp 2026</a>
            <a href="/mindsutra" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>MindSutra</a>
            <a href="/mindspark" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>MindSpark</a>
            <a href="#aptipath" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>AptiPath</a>
            <a href="/parent/dashboard" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>For Parents</a>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <a href="/register/bootcamp" style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 6, padding: "7px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>🏕️ Register Now</a>
            <a href="tel:8374377311" style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #fbbf24", borderRadius: 6, padding: "6px 14px" }}>📞 83743 77311</a>
            <a href="/auth/login" style={{ background: "#fff", color: "#1e293b", borderRadius: 6, padding: "7px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Login</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "80px 32px 72px" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: -100, left: "30%", width: 600, height: 500, background: "radial-gradient(ellipse, rgba(249,115,22,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 50, right: "10%", width: 400, height: 400, background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <span>🏕️</span>
              <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600 }}>Summer Camp 2026 — Enrollments Open · Limited Seats</span>
            </div>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: -1 }}>
              Where Kids Become{" "}
              <span style={{ background: "linear-gradient(135deg, #F97316, #EF4444, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Innovators
              </span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
              Robotics camps, AI tutors, and coding courses designed for Indian school students. Build real robots. Master Vedic Maths. Crack competitive exams.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#summer-camp" style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 10, padding: "14px 32px", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
                🏕️ See Summer Camp
              </a>
              <a href="/mindsutra" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, padding: "14px 32px", fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
                🧮 Try AI Tutor Free
              </a>
            </div>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            {[
              { icon: "👦", val: "1,200+", label: "Camp students" },
              { icon: "🤖", val: "4", label: "Camp programs" },
              { icon: "🧮", val: "5,200+", label: "AI Tutor students" },
              { icon: "⭐", val: "4.8★", label: "Average rating" },
              { icon: "📍", val: "Bangalore", label: "Sarjapura Road" },
            ].map(({ icon, val, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{val}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO VIDEO ──────────────────────────────────────────────────── */}
      <section style={{ padding: "0 32px 64px", background: "#0A0A0F" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, margin: "0 0 8px" }}>See What Our Students Build</h2>
            <p style={{ color: "#64748b", fontSize: 15 }}>Real projects from our robotics boot camp students</p>
          </div>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <video
              src="/robotics-camp-2026.mp4"
              autoPlay muted loop playsInline controls
              style={{ width: "100%", display: "block", maxHeight: 520, objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
            <a href="/register/bootcamp" style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 10, padding: "14px 32px", fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              🚀 Register for Boot Camp
            </a>
            <a href="tel:8374377311" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, padding: "14px 32px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
              📞 Call 83743 77311
            </a>
          </div>
        </div>
      </section>

      {/* ── SUMMER CAMP SECTION ──────────────────────────────────────────── */}
      <section id="summer-camp" style={{ padding: "64px 32px", background: "linear-gradient(180deg, #0A0A0F 0%, #0F172A 50%, #0A0A0F 100%)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 16 }}>
              <span>🏕️</span>
              <span style={{ color: "#F97316", fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>ROBOTICS SUMMER CAMP 2026</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "0 0 12px" }}>Build Your Own Robot This Summer</h2>
            <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 600, margin: "0 auto" }}>
              Ages 8–18 · 20 Sessions · 2 Hours/Day · 40 Hours Total · All Materials Included · Certificate of Completion
            </p>

            {/* Camp inclusions */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
              {["All components & materials", "Certificate of Completion", "Personal project portfolio", "Small batch (max 12 students)", "Expert mentors"].map((item) => (
                <span key={item} style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981", borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Program cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 40 }}>
            {CAMP_PROGRAMS.map((p) => <CampCard key={p.id} p={p} />)}
          </div>

          {/* Enroll CTA banner */}
          <div style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(124,58,237,0.15))", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 16, padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: 14, marginBottom: 4, letterSpacing: 0.5 }}>SEATS ARE LIMITED — ENROLL NOW</div>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Summer Camp 2026 · Bangalore</div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>
                📍 Above Agarwal Bhavan, Chambenhalli Sarjapura Road, Bangalore – 562125
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              <a href="tel:8374377311" style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 10, padding: "14px 28px", fontWeight: 800, fontSize: 16, textDecoration: "none", letterSpacing: 0.3 }}>
                📞 Call 83743 77311
              </a>
              <a href="mailto:info@robodynamics.in" style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none" }}>
                ✉️ info@robodynamics.in
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI TUTORS HEADER ─────────────────────────────────────────────── */}
      <section style={{ padding: "56px 32px 8px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 16 }}>
            <span>🤖</span>
            <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>AI-POWERED TUTORS — AVAILABLE 24/7</span>
          </div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, marginBottom: 8 }}>Also Available for Summer Camp</h2>
          <p style={{ color: "#94a3b8", fontSize: 15, maxWidth: 600, marginBottom: 32 }}>
            AI tutors that adapt to every student — detecting when they're stuck, re-explaining differently, and tracking progress for parents.
          </p>
        </div>
      </section>

      {/* ── MINDSUTRA ROW ────────────────────────────────────────────────── */}
      <ScrollRow title="🧮 MindSutra — Vedic Maths AI Tutor" badge="LIVE">
        {MINDSUTRA_GRADES.map((g) => (
          <TutorCard key={g.grade} item={g} />
        ))}
        {/* See all card */}
        <a href="/mindsutra" style={{ minWidth: 140, borderRadius: 12, background: "rgba(249,115,22,0.08)", border: "2px dashed rgba(249,115,22,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", color: "#F97316", fontWeight: 700, fontSize: 14 }}>
          <span style={{ fontSize: 28 }}>→</span>
          <span>See All Grades</span>
        </a>
      </ScrollRow>

      {/* ── MINDSPARK ROW ────────────────────────────────────────────────── */}
      <div id="mindspark">
        <ScrollRow title="🧠 MindSpark — Aptitude & Reasoning AI Tutor" badge="COMING SOON">
          {MINDSPARK_GRADES.map((g) => (
            <TutorCard key={g.label} item={g} />
          ))}
          <a href="/mindspark" style={{ minWidth: 140, borderRadius: 12, background: "rgba(124,58,237,0.08)", border: "2px dashed rgba(124,58,237,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", color: "#7C3AED", fontWeight: 700, fontSize: 14 }}>
            <span style={{ fontSize: 28 }}>→</span>
            <span>See All Tracks</span>
          </a>
        </ScrollRow>
      </div>

      {/* ── APTIPATH ROW ─────────────────────────────────────────────────── */}
      <div id="aptipath">
        <ScrollRow title="🏆 AptiPath — Competitive Exam Prep" badge="COMING SOON">
          {APTIPATH_GRADES.map((g) => (
            <TutorCard key={g.label} item={{ ...g, href: "/mindspark", demoHref: "/mindspark" }} />
          ))}
          <a href="/mindspark" style={{ minWidth: 140, borderRadius: 12, background: "rgba(245,158,11,0.08)", border: "2px dashed rgba(245,158,11,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", color: "#F59E0B", fontWeight: 700, fontSize: 14 }}>
            <span style={{ fontSize: 28 }}>→</span>
            <span>See All Grades</span>
          </a>
        </ScrollRow>
      </div>

      {/* ── WHY ROBODYNAMICS ─────────────────────────────────────────────── */}
      <section style={{ padding: "72px 32px", background: "linear-gradient(180deg, #0A0A0F 0%, #0F172A 100%)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, marginBottom: 12 }}>Why Choose RoboDynamics?</h2>
            <p style={{ color: "#94a3b8", fontSize: 16 }}>Building tomorrow's engineers, today</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: "🧩", title: "Logical Thinking", desc: "Breaking complex problems into clear, sequential steps — the foundation of all engineering." },
              { icon: "⚙️", title: "Engineering Mindset", desc: "Design, prototype, test and improve. Children learn to iterate and not fear failure." },
              { icon: "💻", title: "Real Programming", desc: "Real coding in C and Python — the same languages used by professional engineers worldwide." },
              { icon: "⚡", title: "Electronics & Circuits", desc: "Understanding how hardware and software connect gives a complete systems view." },
              { icon: "🌍", title: "Real Problem Solving", desc: "Every project solves a real-world challenge — from avoiding obstacles to detecting faces with AI." },
              { icon: "🤝", title: "Teamwork & Communication", desc: "Students collaborate, present their robots, and explain their solutions with confidence." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "24px 20px" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
                <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Robotics = future careers */}
          <div style={{ marginTop: 40, textAlign: "center", padding: "24px", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 12 }}>
            <p style={{ color: "#fbbf24", fontWeight: 700, fontSize: 16, margin: 0 }}>
              🚀 Robotics is the foundation for future careers in AI, Automation, and Engineering.
            </p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, textAlign: "center", marginBottom: 40 }}>What Parents Say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F97316", fontSize: 14 }}>{s}</span>)}
                </div>
                <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 28 }}>{t.avatar}</span>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{t.role}</div>
                    <div style={{ color: "#F97316", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{t.product}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL ENROLL CTA ─────────────────────────────────────────────── */}
      <section style={{ padding: "72px 32px", background: "linear-gradient(135deg, #0F172A, #1E1B4B)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, marginBottom: 16 }}>
            Ready to Build the Future?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 17, maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Robotics Summer Camp 2026 enrollments are open. AI Tutor demo is free — no login needed. Give your child the head start they deserve.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <a href="/register/bootcamp" style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 10, padding: "16px 36px", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>
              🏕️ Register for Boot Camp
            </a>
            <a href="/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 10, padding: "16px 36px", fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
              🧮 Try AI Tutor Free
            </a>
          </div>
          <div style={{ color: "#64748b", fontSize: 14 }}>
            📍 Above Agarwal Bhavan, Chambenhalli Sarjapura Road, Bangalore – 562125 &nbsp;·&nbsp; ✉️ info@robodynamics.in
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: "#050507", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 44, objectFit: "contain" }} />
            </div>
            <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.8 }}>
              Above Agarwal Bhavan, Chambenhalli<br />
              Sarjapura Road, Bangalore – 562125<br />
              <a href="tel:8374377311" style={{ color: "#F97316", textDecoration: "none" }}>83743 77311</a> · <a href="mailto:info@robodynamics.in" style={{ color: "#F97316", textDecoration: "none" }}>info@robodynamics.in</a>
            </div>
          </div>

          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Summer Camp</div>
              {["Beginner Robotics", "Intermediate Robotics", "Advanced Robotics", "Python Programming"].map((l) => (
                <a key={l} href="#summer-camp" style={{ display: "block", color: "#64748b", fontSize: 13, textDecoration: "none", marginBottom: 6 }}>{l}</a>
              ))}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>AI Tutors</div>
              {[
                { label: "MindSutra — Vedic Maths", href: "/mindsutra" },
                { label: "MindSpark — Aptitude", href: "/mindspark" },
                { label: "AptiPath — Competitive", href: "#aptipath" },
                { label: "For Parents", href: "/parent/dashboard" },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ display: "block", color: "#64748b", fontSize: 13, textDecoration: "none", marginBottom: 6 }}>{label}</a>
              ))}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Student</div>
              {[
                { label: "Try Demo (No Login)", href: "/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1" },
                { label: "Student Login", href: "/auth/login" },
                { label: "Student Dashboard", href: "/student/home" },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ display: "block", color: "#64748b", fontSize: 13, textDecoration: "none", marginBottom: 6 }}>{label}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: "28px auto 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ color: "#374151", fontSize: 12 }}>© 2026 RoboDynamics. All rights reserved. · <a href="https://robodynamics.in" style={{ color: "#64748b", textDecoration: "none" }}>www.robodynamics.in</a></div>
          <div style={{ color: "#374151", fontSize: 12 }}>Build tomorrow's engineers today. 🚀</div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}
