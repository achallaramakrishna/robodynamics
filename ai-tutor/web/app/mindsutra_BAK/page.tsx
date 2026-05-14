"use client";

// /mindsutra - Level-Based Vedika Vedic Math Landing Page
// Replaces grade-based cards with 5 universal progression levels.
// Any grade, any age -> start at your level -> advance to champion.

import { useState } from "react";

// Level data

const LEVELS = [
  {
    id: "L1", name: "Foundation", emoji: "L1", color: "#22C55E",
    ageHint: "Ideal for Age 9-10",
    tagline: "Build the speed base every student needs",
    headline: "Your child will add 999 + 1 instantly - and know exactly why",
    lessons: 8, duration: "3.5 hrs",
    xpOnComplete: 200,
    bullets: [
      "Complements to 10, 100 & 1000 in seconds",
      "Tables 11-19 without memorising - by pattern",
      "Criss-cross 2-digit multiplication in 3 steps",
      "Borrow-free subtraction using Nikhilam",
    ],
    curriculum: [
      { title: "Fast Addition - Purana", min: 20, free: true },
{ title: "Tables 11-19 by Pattern", min: 20, free: true },
{ title: "Doubling & Halving - Anurupyena", min: 20, free: false },
      { title: "Multiply by 11 - Middle-Sum Trick", min: 20, free: false },
      { title: "Borrow-Free Subtraction", min: 25, free: false },
      { title: "Multiply by 5 and 25", min: 20, free: false },
      { title: "Near-100 Mental Math", min: 25, free: false },
      { title: "Criss-Cross 2-Digit Multiplication", min: 30, free: false },
    ],
  },
  {
    id: "L2", name: "Speed Builder", emoji: "L2", color: "#3B82F6",
    ageHint: "Ideal for Age 10-11",
    tagline: "Unlock powerful shortcuts for exams",
    headline: "Your child will multiply 97 x 103 in 5 seconds - no calculator",
    lessons: 8, duration: "4 hrs",
    xpOnComplete: 250,
    bullets: [
      "Near-100 multiplication using Nikhilam",
      "Square numbers near 50 in 2 steps",
      "HCF & LCM using Vedic shortcut",
      "Flag division - no long-division needed",
    ],
    curriculum: [
      { title: "Near-100 Multiplication - Nikhilam", min: 25, free: true },
{ title: "Squares Near 50 - Yavadunam", min: 25, free: true },
{ title: "HCF & LCM Shortcuts", min: 25, free: false },
{ title: "3-Digit Criss-Cross", min: 35, free: false },
{ title: "Flag Division - Dhvajanka", min: 30, free: false },
      { title: "Decimal Point Mastery", min: 20, free: false },
      { title: "Fraction Simplification", min: 25, free: false },
      { title: "Running Remainder Division", min: 25, free: false },
    ],
  },
  {
    id: "L3", name: "Power Level", emoji: "L3", color: "#F59E0B",
    ageHint: "Ideal for Age 11-12",
    tagline: "Algebra, integers, and advanced patterns",
    headline: "Your child will solve 998 x 997 mentally in one breath",
    lessons: 8, duration: "4.5 hrs",
    xpOnComplete: 300,
    bullets: [
      "Nikhilam with any base - 97x103, 998x997",
      "Paravartya division - any divisor in seconds",
      "Linear equations by inspection - no cross-multiply",
      "Squares of numbers ending in 5 - instant",
    ],
    curriculum: [
      { title: "Nikhilam with Any Base", min: 30, free: true },
{ title: "Paravartya Division", min: 30, free: true },
{ title: "Linear Equations - Vedic Style", min: 30, free: false },
{ title: "Squares Ending in 5", min: 20, free: false },
{ title: "Integer Operations Speed", min: 25, free: false },
{ title: "Ratio & Proportion Shortcuts", min: 25, free: false },
{ title: "Vinculum Numbers", min: 25, free: false },
{ title: "Algebraic Identities - Urdhva-Tiryagbhyam", min: 30, free: false },
    ],
  },
  {
    id: "L4", name: "Ace Level", emoji: "L4", color: "#8B5CF6",
    ageHint: "Ideal for Age 12-13+",
    tagline: "Complex problems solved in seconds",
    headline: "Your child will find cube roots of 6-digit numbers by inspection",
    lessons: 8, duration: "5 hrs",
    xpOnComplete: 350,
    bullets: [
      "Cube roots of perfect cubes - 3 seconds",
      "Near-1000 multiplication - one written step",
      "Simultaneous equations by Vedic method",
      "Percentage and profit/loss at mental speed",
    ],
    curriculum: [
      { title: "Squares & Cubes - Anurupyena", min: 30, free: true },
{ title: "Near-1000 Multiplication", min: 30, free: true },
{ title: "Simultaneous Equations - Paravartya", min: 35, free: false },
      { title: "Fraction Operations at Speed", min: 25, free: false },
      { title: "Square Roots of Perfect Squares", min: 25, free: false },
      { title: "Percentage Vedic Shortcut", min: 25, free: false },
      { title: "Indices & Surds Speed", min: 30, free: false },
      { title: "Profit, Loss & Interest in Seconds", min: 25, free: false },
    ],
  },
  {
    id: "L5", name: "Champion", emoji: "L5", color: "#EC4899",
    ageHint: "Olympiad & competitive exam prep",
    tagline: "Competition-level mental math mastery",
    headline: "Your child will crack Math Olympiad problems others skip",
    lessons: 8, duration: "5.5 hrs",
    xpOnComplete: 400,
    bullets: [
      "Quadratic equations without the formula",
      "Calendar & time problems in under 5 seconds",
      "Advanced trigonometry shortcuts for senior learners",
      "Olympiad-level number patterns and proofs",
    ],
    curriculum: [
      { title: "Calendars & Time - Ekadhikena", min: 25, free: true },
{ title: "Vedic Number Theory", min: 30, free: true },
{ title: "Quadratic Equations - Paravartya", min: 35, free: false },
      { title: "Trigonometry Shortcuts", min: 30, free: false },
      { title: "Advanced Fraction Chains", min: 25, free: false },
      { title: "Competitive Exam Sprint", min: 30, free: false },
      { title: "Olympiad Number Patterns", min: 35, free: false },
      { title: "Championship Practice", min: 40, free: false },
    ],
  },
];

const STATS = [
  { value: "4,200+", label: "Students Trained" },
  { value: "40", label: "Vedic Math Lessons" },
  { value: "5", label: "Progression Levels" },
  { value: "4.9 / 5", label: "Average Rating" },
];

const TESTIMONIALS = [
  {
    name: "Sunita Sharma", role: "Parent - 11 yr old",
    text: "My daughter went from dreading multiplications to doing them faster than a calculator. She placed at Level 2 and finished Level 3 in 6 weeks.",
    avatar: "S", level: "L3",
  },
  {
    name: "Rajesh Kumar", role: "Parent - 13 yr old",
    text: "The level test was spot-on. My son was placed at Level 4 directly - no wasted time on basics he already knew. Now he's cracking Olympiad problems.",
    avatar: "R", level: "L4",
  },
  {
    name: "Priya Menon", role: "Student - 12 yrs old",
    text: "I was nervous about the quiz but it was fun! The AI tutor explains everything step by step. I moved from L2 to L4 in 3 months.",
    avatar: "P", level: "L4",
  },
];

// LevelCard component

function LevelCard({ level, index, expanded, onToggle }: {
  level: typeof LEVELS[0];
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      background: expanded
        ? `linear-gradient(135deg, ${level.color}18, ${level.color}08)`
        : "#0D1B2A",
      border: `2px solid ${expanded ? level.color + "55" : "#1E3A5F"}`,
      borderRadius: 16, overflow: "hidden",
      transition: "all 0.3s",
      boxShadow: expanded ? `0 0 30px ${level.color}22` : "none",
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 16,
          background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        {/* Level badge */}
        <div style={{
          width: 56, height: 56, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${level.color}33, ${level.color}22)`,
          border: `2px solid ${level.color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
        }}>
          {level.emoji}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{
              background: level.color + "22", color: level.color,
              fontSize: 11, fontWeight: 700, padding: "2px 10px",
              borderRadius: 20, border: `1px solid ${level.color}44`,
            }}>
              Level {index + 1}
            </span>
            <span style={{ color: "#475569", fontSize: 12 }}>{level.ageHint}</span>
          </div>
          <div style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
            {level.name}
          </div>
          <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 2 }}>{level.tagline}</div>
        </div>

        {/* Meta */}
        <div style={{ textAlign: "right", flexShrink: 0, marginRight: 8 }}>
          <div style={{ color: "#64748B", fontSize: 12 }}>{level.lessons} lessons</div>
          <div style={{ color: "#64748B", fontSize: 12 }}>{level.duration}</div>
        </div>

        {/* Chevron */}
        <div style={{
          color: "#475569", fontSize: 18,
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s",
        }}>v</div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 24px 24px" }}>
          <p style={{ color: "#CBD5E1", fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
            {level.headline}
          </p>

          {/* Bullets */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 20 }}>
            {level.bullets.map((b, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                background: "#070F1A", borderRadius: 10, padding: "10px 12px",
                border: "1px solid #1E3A5F",
              }}>
                <span style={{ color: level.color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>+</span>
                <span style={{ color: "#E2E8F0", fontSize: 13 }}>{b}</span>
              </div>
            ))}
          </div>

          {/* Curriculum list */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "#64748B", fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Curriculum
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {level.curriculum.map((c, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#070F1A", borderRadius: 8, padding: "8px 14px",
                  border: "1px solid #0F2040",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: c.free ? level.color + "22" : "#1E3A5F",
                      color: c.free ? level.color : "#475569",
                      fontSize: 10, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ color: "#CBD5E1", fontSize: 13 }}>{c.title}</span>
                    {c.free && (
                      <span style={{
                        background: level.color + "22", color: level.color,
                        fontSize: 9, fontWeight: 700, padding: "1px 7px",
                        borderRadius: 20, border: `1px solid ${level.color}44`,
                      }}>FREE</span>
                    )}
                  </div>
                  <span style={{ color: "#475569", fontSize: 12 }}>{c.min} min</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <a href="/auth/register?source=mindsutra" style={{
              display: "inline-block", padding: "12px 24px", borderRadius: 10,
              background: `linear-gradient(90deg, ${level.color}, ${level.color}cc)`,
              color: "#fff", fontSize: 14, fontWeight: 700,
              textDecoration: "none",
              boxShadow: `0 4px 16px ${level.color}44`,
            }}>
              Register {"->"}
            </a>
            <a href="/mindsutra/assess" style={{
              display: "inline-block", padding: "12px 24px", borderRadius: 10,
              background: "transparent", border: `2px solid ${level.color}55`,
              color: level.color, fontSize: 14, fontWeight: 700,
              textDecoration: "none",
            }}>
              Preview Level {index + 1}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page

export default function MindSutraPage() {
  const [expandedLevel, setExpandedLevel] = useState<string | null>("L1");
  const WHATSAPP_NUMBER = "919876543210";
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I want to join the Vedika early access program.")}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060D17",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#F1F5F9",
    }}>
      {/* -- Nav -- */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid #0F2040",
        background: "#070F1A",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 32, objectFit: "contain" }} />
          <span style={{ fontSize: 24 }}>MS</span>
          <span style={{ color: "#818CF8", fontWeight: 800, fontSize: 20 }}>Vedika</span>
          <span style={{
            background: "#1E3A5F", color: "#94A3B8",
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, marginLeft: 4,
          }}>Personal Tutor</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/auth/login" style={{
            padding: "9px 18px", borderRadius: 8,
            background: "#0D1B2A", border: "1px solid #1E3A5F",
            color: "#CBD5E1", fontSize: 13, fontWeight: 700,
            textDecoration: "none",
          }}>
            Login
          </a>
          <a href="/mindsutra/tutor" style={{
            padding: "9px 18px", borderRadius: 8,
            background: "#0D1B2A", border: "1px solid #1E3A5F",
            color: "#CBD5E1", fontSize: 13, fontWeight: 700,
            textDecoration: "none",
          }}>
            Tutor
          </a>
          <a href="/auth/register?source=mindsutra" style={{
            padding: "9px 18px", borderRadius: 8,
            background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
            color: "#fff", fontSize: 13, fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 2px 12px rgba(99,102,241,0.4)",
          }}>
            Register
          </a>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{
            padding: "9px 16px", borderRadius: 8,
            background: "#0D1B2A", border: "1px solid #1E3A5F",
            color: "#94A3B8", fontSize: 13, fontWeight: 600,
            textDecoration: "none",
          }}>
            WhatsApp
          </a>
        </div>
      </nav>

      {/* -- Hero -- */}
      <section style={{
        padding: "80px 32px 60px",
        textAlign: "center",
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15), transparent)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 30, padding: "6px 16px", marginBottom: 24,
        }}>
          <span style={{ fontSize: 14 }}>LVL</span>
          <span style={{ color: "#818CF8", fontSize: 13, fontWeight: 600 }}>
            - Free Early Access - Parents + Students - Limited Beta -
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 900, lineHeight: 1.15,
          margin: "0 0 20px",
          background: "linear-gradient(135deg, #F1F5F9, #818CF8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Vedic Math For Every Student -<br />Start at Your Level
        </h1>

        <p style={{
          color: "#94A3B8", fontSize: 18, maxWidth: 600, margin: "0 auto 36px",
          lineHeight: 1.6,
        }}>
          Parents and students can register, try the platform first, and see the value
          before any paid plan begins. This is the Mindsutra founding beta.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <a href="/auth/register?source=mindsutra" style={{
            padding: "16px 32px", borderRadius: 12,
            background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
            color: "#fff", fontSize: 16, fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 6px 28px rgba(99,102,241,0.5)",
          }}>
            Register
          </a>
          <a href="/auth/login" style={{
            padding: "16px 28px", borderRadius: 12,
            background: "transparent", border: "2px solid #1E3A5F",
            color: "#94A3B8", fontSize: 15, fontWeight: 600,
            textDecoration: "none",
          }}>
            Existing Student? Login to Levels
          </a>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{
            padding: "16px 28px", borderRadius: 12,
            background: "transparent", border: "2px solid #1E3A5F",
            color: "#94A3B8", fontSize: 15, fontWeight: 600,
            textDecoration: "none",
          }}>
            Talk to Us on WhatsApp
          </a>
        </div>

        {/* Level journey visual */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 0, marginTop: 48, flexWrap: "wrap", rowGap: 12,
        }}>
          {LEVELS.map((lv, i) => (
            <div key={lv.id} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `linear-gradient(135deg, ${lv.color}33, ${lv.color}22)`,
                  border: `2px solid ${lv.color}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24,
                  boxShadow: `0 4px 16px ${lv.color}33`,
                }}>
                  {lv.emoji}
                </div>
                <div style={{ color: lv.color, fontSize: 11, fontWeight: 700 }}>
                  L{i + 1}
                </div>
                <div style={{ color: "#64748B", fontSize: 10, textAlign: "center", maxWidth: 60 }}>
                  {lv.name}
                </div>
              </div>
              {i < LEVELS.length - 1 && (
                <div style={{
                  width: 36, height: 2, margin: "0 4px",
                  background: "linear-gradient(90deg, #1E3A5F, #2D4A6A)",
                  marginBottom: 28,
                }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* -- Stats bar -- */}
      <section style={{
        background: "#0D1B2A",
        borderTop: "1px solid #1E3A5F",
        borderBottom: "1px solid #1E3A5F",
        padding: "24px 32px",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16, textAlign: "center",
        }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ color: "#818CF8", fontSize: 28, fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* -- How it works -- */}
      <section style={{ padding: "64px 32px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          How It Works
        </h2>
        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 15, marginBottom: 40, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
          Mindsutra watches the student session by session and guides the next step.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { icon: "01", step: "1", title: "Register", desc: "Parent name, phone, student name, grade, and school - takes less than a minute." },
            { icon: "02", step: "2", title: "Start Learning", desc: "The account opens right away so the family can begin the first session." },
            { icon: "03", step: "3", title: "AI Tutor Adapts", desc: "Mindsutra checks accuracy and speed, then chooses the next step." },
            { icon: "04", step: "4", title: "Track Progress", desc: "Parents see what improved, what needs work, and what comes next." },
          ].map((item) => (
            <div key={item.step} style={{
              background: "#0D1B2A", border: "1px solid #1E3A5F",
              borderRadius: 14, padding: "22px 20px", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
              <div style={{
                display: "inline-block", background: "rgba(99,102,241,0.15)", color: "#818CF8",
                fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                marginBottom: 10, border: "1px solid rgba(99,102,241,0.3)",
              }}>
                Step {item.step}
              </div>
              <h3 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{item.title}</h3>
              <p style={{ color: "#94A3B8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -- Progress Snapshot -- */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #0F172A, #1E1B4B)", border: "2px solid #8B5CF6", borderRadius: 24, padding: "48px", position: "relative", overflow: "hidden" }}>
          {/* Background Glow */}
          <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", borderRadius: "50%" }}></div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center", position: "relative", zIndex: 10 }}>
            <div style={{ flex: "1 1 360px" }}>
              <div style={{ color: "#A78BFA", fontWeight: 800, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Founding Beta Invite</div>
              <h2 style={{ color: "#F8FAFC", fontSize: 36, fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>Personal AI Tutor for Every Student</h2>
              <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
                Parents and students can register, start the first session, and let the tutor adapt based on progress.
              </p>
              <ul style={{ padding: 0, margin: "0 0 32px", listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                <li style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 600 }}>Simple registration for parents and students</li>
                <li style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 600 }}>Immediate access to the dashboard and lessons</li>
                <li style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 600 }}>Progress-based guidance after each session</li>
              </ul>
              <a href="/auth/register?source=mindsutra" style={{ display: "inline-block", background: "linear-gradient(90deg, #6366F1, #8B5CF6)", color: "#FFFFFF", fontWeight: 800, fontSize: 16, padding: "16px 32px", borderRadius: 12, textDecoration: "none", boxShadow: "0 8px 24px rgba(99,102,241,0.4)", cursor: "pointer" }}>Register {"->"}</a>
            </div>

            {/* Fake Leaderboard */}
            <div style={{ flex: "1 1 320px", background: "#060D17", border: "1px solid #1E3A5F", borderRadius: 16, padding: "24px", boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 18 }}>Live Activity Board</div>
                <div style={{ background: "#10B98120", color: "#10B981", fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, background: "#10B981", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" }}></span> LIVE
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { rank: 1, name: "Aarav M.", location: "Delhi", xp: "14,520 XP", medal: "#1" },
                  { rank: 2, name: "Isha K.", location: "Bangalore", xp: "13,900 XP", medal: "#2" },
                  { rank: 3, name: "Rohan V.", location: "Mumbai", xp: "12,150 XP", medal: "#3" },
                  { rank: 147, name: "Your Child?", location: "--", xp: "0 XP", medal: "GO" }
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: row.rank === 147 ? "#1E3A5F" : "rgba(255,255,255,0.03)", borderRadius: 12, border: row.rank === 147 ? "1px solid #3B82F6" : "1px solid transparent" }}>
                    <div style={{ width: 24, textAlign: "center", fontSize: 16 }}>{row.medal || `#${row.rank}`}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 14 }}>{row.name}</div>
                      <div style={{ color: "#64748B", fontSize: 12 }}>{row.location}</div>
                    </div>
                    <div style={{ color: row.rank === 147 ? "#93C5FD" : "#38BDF8", fontWeight: 800, fontSize: 14 }}>{row.xp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Level Explorer -- */}
      <section id="levels" style={{ padding: "0 32px 64px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Explore All 5 Levels
        </h2>
        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 15, marginBottom: 32, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
          Each level builds on the last. Click any level to see the full curriculum and decide where to start.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {LEVELS.map((level, i) => (
            <LevelCard
              key={level.id}
              level={level}
              index={i}
              expanded={expandedLevel === level.id}
              onToggle={() => setExpandedLevel(expandedLevel === level.id ? null : level.id)}
            />
          ))}
        </div>
      </section>

      {/* -- AI Tutor feature -- */}
      <section style={{
        padding: "64px 32px",
        background: "linear-gradient(135deg, #0D1B2A, #0F143A)",
        borderTop: "1px solid #1E3A5F",
        borderBottom: "1px solid #1E3A5F",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 30, padding: "5px 14px", marginBottom: 16,
            }}>
              <span>AI</span>
              <span style={{ color: "#A78BFA", fontSize: 12, fontWeight: 600 }}>AI-Powered Tutor</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.3 }}>
              A Robot Teacher That Adapts to Your Child
            </h2>
            <p style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Our AI tutor uses animated step-by-step boards, spoken explanations, and
              real-time doubt resolution. When your child is confused, the tutor adapts -
              slower pace, more examples, different angle.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                "Speaks every step aloud in clear English",
                "Animated whiteboard shows each sutra visually",
                "Retries with a hint if the answer is wrong",
                "LLM-powered doubt answers - ask anything",
              ].map((f, i) => (
                <div key={i} style={{ color: "#CBD5E1", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <a href="/mindsutra/course/level-1/lesson/VM_L1_1" style={{
              display: "inline-block", padding: "12px 22px", borderRadius: 10,
              background: "linear-gradient(90deg, #8B5CF6, #6366F1)",
              color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(139,92,246,0.4)",
            }}>
              Try Free AI Lesson {"->"}
            </a>
          </div>
          <div style={{
            background: "#070F1A", border: "1px solid #1E3A5F",
            borderRadius: 16, padding: 24, position: "relative",
          }}>
            {/* Mock tutor UI */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>AI</div>
              <div>
                <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 14 }}>Nova - Your Tutor</div>
                <div style={{ color: "#34D399", fontSize: 12 }}>Online Now</div>
              </div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #0D1B2A, #0F2040)",
              border: "1px solid #1E3A5F", borderRadius: 12, padding: 16, marginBottom: 12,
            }}>
              <div style={{ color: "#818CF8", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Nikhilam - Near-100</div>
              <div style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                Find 97 x 103
              </div>
              <div style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6 }}>
                1. Deviations: 97 {"->"} <span style={{ color: "#F87171" }}>-3</span> and 103 {"->"} <span style={{ color: "#34D399" }}>+3</span><br />
                2. Left: 97 + 3 = <span style={{ color: "#818CF8", fontWeight: 700 }}>100</span><br />
                3. Right: (-3) x (+3) = <span style={{ color: "#F87171", fontWeight: 700 }}>-09</span><br />
                4. Answer: 100|-09 = <span style={{ color: "#34D399", fontWeight: 800, fontSize: 16 }}>9991</span>
              </div>
            </div>
            <div style={{
              background: "#0D1B2A", border: "1px solid #22C55E33",
              borderRadius: 10, padding: "10px 14px",
              color: "#34D399", fontSize: 13,
            }}>
              Correct! You answered in 4.2 seconds. +20 XP
            </div>
          </div>
        </div>
      </section>

      {/* -- Testimonials -- */}
      <section style={{ padding: "64px 32px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 40 }}>
          What Families Say
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => {
            const lv = LEVELS.find(l => l.id === t.level);
            return (
              <div key={i} style={{
                background: "#0D1B2A", border: "1px solid #1E3A5F",
                borderRadius: 14, padding: "20px 20px 16px",
              }}>
                <div style={{ color: "#F59E0B", fontSize: 14, marginBottom: 12 }}>{"*****"}</div>
                <p style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 15, fontWeight: 700,
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ color: "#64748B", fontSize: 11 }}>{t.role}</div>
                  </div>
                  {lv && (
                    <div style={{
                      marginLeft: "auto",
                      background: lv.color + "22", color: lv.color,
                      fontSize: 10, fontWeight: 700, padding: "2px 8px",
                      borderRadius: 20, border: `1px solid ${lv.color}44`,
                    }}>
                      {lv.emoji} {lv.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* -- Pricing -- */}
      <section id="pricing" style={{ padding: "80px 32px 64px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 8, color: "#F1F5F9" }}>
          Free During Early Access
        </h2>
        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 15, marginBottom: 48 }}>
          Families can register during the founding beta. Paid plans will be introduced later.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          
          {/* Single Level */}
          <div style={{ flex: "1 1 300px", maxWidth: 380, background: "#0D1B2A", border: "1px solid #1E3A5F", borderRadius: 16, padding: "32px", display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#94A3B8", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Any Single Level</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#F1F5F9", marginBottom: 8 }}>Free</div>
            <div style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>Included in early access</div>
            <ul style={{ padding: 0, margin: "0 0 32px", listStyle: "none", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              <li style={{ color: "#CBD5E1", fontSize: 14 }}>+ 8 Interactive Chapters</li>
              <li style={{ color: "#CBD5E1", fontSize: 14 }}>+ AI Tutor and Animated Board</li>
              <li style={{ color: "#CBD5E1", fontSize: 14 }}>+ Parent Dashboard Access</li>
              <li style={{ color: "#CBD5E1", fontSize: 14 }}>+ Certificate of Completion</li>
            </ul>
            <button onClick={() => { document.getElementById('levels')?.scrollIntoView({behavior: 'smooth'}) }} style={{ width: "100%", border: "none", cursor: "pointer", display: "block", textAlign: "center", padding: "14px", borderRadius: 10, background: "#1E3A5F", color: "#F1F5F9", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Pick Your Level</button>
          </div>
          
          {/* Master Bundle */}
          <div style={{ flex: "1 1 300px", maxWidth: 380, background: "linear-gradient(135deg, #1E1B4B, #0F172A)", border: "2px solid #8B5CF6", borderRadius: 16, padding: "32px", position: "relative", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#8B5CF6", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>BEST VALUE</div>
            <div style={{ color: "#A78BFA", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Founding Bundle</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#F1F5F9" }}>Free</div>
              <div style={{ color: "#64748B", fontSize: 16, textDecoration: "line-through" }}>Paid plans later</div>
            </div>
            <div style={{ color: "#94A3B8", fontSize: 14, marginBottom: 24 }}>Complete Foundation to Champion Journey during beta</div>
            <ul style={{ padding: 0, margin: "0 0 32px", listStyle: "none", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              <li style={{ color: "#E2E8F0", fontSize: 14 }}>+ <strong style={{ color: "#fff" }}>All 40 Chapters</strong> across 5 Levels</li>
              <li style={{ color: "#E2E8F0", fontSize: 14 }}>+ Unlocked Placement Test Routing</li>
              <li style={{ color: "#E2E8F0", fontSize: 14 }}>+ Full Parent Dashboard Access</li>
              <li style={{ color: "#E2E8F0", fontSize: 14 }}>+ Vedika Champion Trophy</li>
            </ul>
            <a href="/checkout/bundle-mindsutra-5-levels" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: 10, background: "linear-gradient(90deg, #6366F1, #8B5CF6)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>Get All 5 Levels</a>
          </div>

        </div>
      </section>

      {/* -- CTA Banner -- */}
      <section style={{
        margin: "0 32px 64px",
        background: "linear-gradient(135deg, #1E1060, #0F143A, #0D1B2A)",
        border: "1px solid #2D3A70",
        borderRadius: 20, padding: "48px 32px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>GO</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px", color: "#F1F5F9" }}>
          Ready to Find Your Child's Level?
        </h2>
        <p style={{ color: "#94A3B8", fontSize: 15, margin: "0 auto 28px", maxWidth: 480, lineHeight: 1.6 }}>
          Takes 3 minutes. No login needed. Get a personalised 8-lesson roadmap with
          the exact Vedic Math starting point for your child.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <a href="/mindsutra/assess" style={{
            padding: "16px 32px", borderRadius: 12,
            background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
            color: "#fff", fontSize: 16, fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 6px 28px rgba(99,102,241,0.5)",
          }}>
            Start Free Assessment
          </a>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{
            padding: "16px 28px", borderRadius: 12,
            background: "transparent", border: "2px solid #25D366",
            color: "#25D366", fontSize: 15, fontWeight: 700,
            textDecoration: "none",
          }}>
            WhatsApp Enquiry
          </a>
        </div>
      </section>

      {/* -- Footer -- */}
      <footer style={{
        padding: "24px 32px",
        borderTop: "1px solid #0F2040",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
        color: "#475569", fontSize: 13,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/rd-logo.png" alt="RoboDynamics" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "contain", background: "#0F172A" }} />
          <span style={{ fontWeight: 700, color: "#64748B" }}>Vedika</span>
          <span>by RoboDynamics</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="/mindsutra/assess" style={{ color: "#475569", textDecoration: "none" }}>Free Assessment</a>
          <a href="/ai-tutor" style={{ color: "#475569", textDecoration: "none" }}>AI Tutor</a>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#475569", textDecoration: "none" }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}

