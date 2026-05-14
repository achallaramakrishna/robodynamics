"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const LETTER_SEQUENCE = [
  "ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ", "ಋ", "ಎ", "ಏ", "ಐ", "ಒ", "ಓ", "ಔ",
  "ಕ", "ಖ", "ಗ", "ಘ", "ಚ", "ಛ", "ಜ", "ಝ", "ಟ", "ಠ", "ಡ", "ಢ", "ಣ",
];

type KannadaLevel = "native" | "some" | "beginner" | "zero";

const KANNADA_LEVELS: { value: KannadaLevel; label: string; desc: string; emoji: string }[] = [
  { value: "native", label: "Kannada at home", desc: "We speak Kannada daily", emoji: "🏠" },
  { value: "some",   label: "Some Kannada",    desc: "TV, school, friends",    emoji: "📺" },
  { value: "beginner", label: "Just starting", desc: "A few words only",       emoji: "🌱" },
  { value: "zero",   label: "No Kannada",      desc: "No prior exposure",      emoji: "⭕" },
];

export default function KaveriParentDashboard() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [masteredLetters, setMasteredLetters] = useState<string[]>([]);
  const [childName, setChildName] = useState("");
  const [childNameInput, setChildNameInput] = useState("");
  const [kannadaLevel, setKannadaLevel] = useState<KannadaLevel | "">("");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const savedXp = localStorage.getItem("kaveri_xp");
    const savedStreak = localStorage.getItem("kaveri_streak");
    const parsedXp = Number.parseInt(savedXp || "0", 10) || 0;
    const parsedStreak = Number.parseInt(savedStreak || "0", 10) || 0;

    setXp(parsedXp);
    setStreak(parsedStreak);
    setMasteredLetters(LETTER_SEQUENCE.slice(0, Math.min(LETTER_SEQUENCE.length, Math.floor(parsedXp / 120))));

    const savedName = localStorage.getItem("kaveri_student_name") || localStorage.getItem("childName") || "";
    const savedLevel = (localStorage.getItem("kaveri_kannada_level") || "") as KannadaLevel | "";
    setChildName(savedName);
    setChildNameInput(savedName);
    setKannadaLevel(savedLevel);
    if (savedName && savedLevel) setProfileSaved(true);
  }, []);

  function saveProfile() {
    const n = childNameInput.trim();
    if (!n || !kannadaLevel) return;
    localStorage.setItem("kaveri_student_name", n);
    // Legacy key (kept for compatibility with any other readers)
    localStorage.setItem("kaveri_kannada_level", kannadaLevel);
    // Sync to the LanguageContext key used by the lesson dropdown
    const langMap: Record<KannadaLevel, string> = {
      native:   "kannada-full",
      some:     "kannada-english",
      beginner: "english-simplified",
      zero:     "english-simplified",
    };
    localStorage.setItem("kaveri_language_preference", langMap[kannadaLevel]);
    setChildName(n);
    setProfileSaved(true);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px 60px",
        background:
          "radial-gradient(circle at top left, #fef3c7 0, rgba(254,243,199,0.55) 24%, transparent 48%), radial-gradient(circle at top right, #bfdbfe 0, rgba(191,219,254,0.6) 22%, transparent 46%), linear-gradient(180deg, #fff7ed 0%, #f8fafc 45%, #ecfeff 100%)",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gap: 28 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 1.3,
                fontWeight: 800,
                color: "#0f766e",
                marginBottom: 8,
              }}
            >
              Parent View
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 900, color: "#172554", margin: 0 }}>
              Track your child&apos;s Kannada reading journey
            </h1>
            <p style={{ color: "#475569", margin: "10px 0 0", maxWidth: 700, lineHeight: 1.6 }}>
              Kaveri helps families see confidence building step by step, from first sounds to letter mastery.
            </p>
          </div>
          <Link
            href="/"
            style={{
              background: "#172554",
              color: "white",
              padding: "14px 22px",
              borderRadius: 16,
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Return to Kaveri
          </Link>
        </header>

        {/* ── Child Profile Setup ── */}
        <section style={{
          background: profileSaved ? "rgba(255,255,255,0.88)" : "linear-gradient(135deg, #fff7ed, #fef3e2)",
          border: profileSaved ? "1px solid rgba(148,163,184,0.18)" : "2px solid rgba(249,115,22,0.30)",
          borderRadius: 32, padding: 28,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: "#c2410c", marginBottom: 6 }}>
                Child Profile
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: 0 }}>
                {profileSaved ? `${childName}'s learning profile ✓` : "Set up your child's profile"}
              </h2>
              {!profileSaved && (
                <p style={{ color: "#64748b", margin: "6px 0 0", fontSize: 14 }}>
                  Kaveri adapts her Kannada coaching style based on your child's background.
                </p>
              )}
            </div>
            {profileSaved && (
              <button
                onClick={() => setProfileSaved(false)}
                style={{
                  border: "1px solid #e2e8f0", background: "white", cursor: "pointer",
                  padding: "10px 18px", borderRadius: 14, fontWeight: 800, color: "#64748b", fontSize: 14,
                }}
              >
                Edit ✏️
              </button>
            )}
          </div>

          {!profileSaved ? (
            <div style={{ display: "grid", gap: 20 }}>
              {/* Name input */}
              <div>
                <label style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", display: "block", marginBottom: 8 }}>
                  Child&apos;s name
                </label>
                <input
                  type="text"
                  placeholder="Enter your child's name..."
                  value={childNameInput}
                  onChange={e => setChildNameInput(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "14px 16px", borderRadius: 16,
                    border: "2px solid rgba(249,115,22,0.30)",
                    fontSize: 17, fontWeight: 700, color: "#0f172a",
                    background: "white", outline: "none",
                  }}
                />
              </div>

              {/* Kannada level selector */}
              <div>
                <label style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", display: "block", marginBottom: 12 }}>
                  How much Kannada does your child already know?
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                  {KANNADA_LEVELS.map(lv => (
                    <button
                      key={lv.value}
                      onClick={() => setKannadaLevel(lv.value)}
                      style={{
                        border: kannadaLevel === lv.value ? "2px solid #f97316" : "1px solid #e2e8f0",
                        background: kannadaLevel === lv.value ? "#fff7ed" : "white",
                        borderRadius: 20, padding: "16px 14px", cursor: "pointer", textAlign: "left",
                        boxShadow: kannadaLevel === lv.value ? "0 4px 14px rgba(249,115,22,0.18)" : "none",
                        transition: "all 0.18s ease",
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{lv.emoji}</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#0f172a" }}>{lv.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{lv.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!childNameInput.trim() || !kannadaLevel}
                onClick={saveProfile}
                style={{
                  border: "none",
                  cursor: (childNameInput.trim() && kannadaLevel) ? "pointer" : "not-allowed",
                  background: (childNameInput.trim() && kannadaLevel)
                    ? "linear-gradient(135deg, #f97316, #ef4444)"
                    : "rgba(23,32,51,0.10)",
                  color: (childNameInput.trim() && kannadaLevel) ? "white" : "#94a3b8",
                  padding: "16px 22px", borderRadius: 18, fontWeight: 900, fontSize: 17,
                  transition: "all 0.2s ease",
                  boxShadow: (childNameInput.trim() && kannadaLevel) ? "0 12px 28px rgba(249,115,22,0.28)" : "none",
                }}
              >
                Save child profile →
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#fff7ed", borderRadius: 20, padding: "16px 20px", border: "1px solid #fed7aa" }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.1, color: "#c2410c" }}>Name</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginTop: 6 }}>{childName}</div>
              </div>
              <div style={{ background: "#fff7ed", borderRadius: 20, padding: "16px 20px", border: "1px solid #fed7aa" }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.1, color: "#c2410c" }}>Kannada Level</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginTop: 6 }}>
                  {KANNADA_LEVELS.find(l => l.value === kannadaLevel)?.emoji}{" "}
                  {KANNADA_LEVELS.find(l => l.value === kannadaLevel)?.label}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
                  {KANNADA_LEVELS.find(l => l.value === kannadaLevel)?.desc}
                </div>
              </div>
            </div>
          )}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
          {[
            { label: "Learning XP", value: `${xp}`, accent: "#2563eb", note: "earned through lessons and quizzes" },
            { label: "Current Streak", value: `${streak} days`, accent: "#ea580c", note: "daily practice momentum" },
            { label: "Letters Mastered", value: `${masteredLetters.length} / ${LETTER_SEQUENCE.length}`, accent: "#059669", note: "letters showing steady recall" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.86)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(148,163,184,0.18)",
                borderRadius: 28,
                padding: 24,
                boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: "#64748b" }}>
                {item.label}
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: item.accent, marginTop: 10 }}>{item.value}</div>
              <div style={{ marginTop: 8, color: "#64748b", fontSize: 14 }}>{item.note}</div>
            </div>
          ))}
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(148,163,184,0.18)",
            borderRadius: 32,
            padding: 28,
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: 0 }}>Alphabet mastery map</h2>
              <p style={{ color: "#64748b", margin: "8px 0 0" }}>
                Green tiles show letters your child is recalling with confidence.
              </p>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", color: "#64748b", fontSize: 13, fontWeight: 700 }}>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, background: "#bbf7d0" }} />
                Mastered
              </span>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, background: "#e2e8f0" }} />
                In progress
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))", gap: 12 }}>
            {LETTER_SEQUENCE.map((char) => {
              const isMastered = masteredLetters.includes(char);
              return (
                <div
                  key={char}
                  style={{
                    minHeight: 68,
                    borderRadius: 18,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 28,
                    fontWeight: 900,
                    background: isMastered ? "#dcfce7" : "#e2e8f0",
                    color: isMastered ? "#166534" : "#64748b",
                    border: isMastered ? "2px solid #4ade80" : "1px solid #cbd5e1",
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 20 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #172554 0%, #1d4ed8 100%)",
              color: "white",
              padding: 28,
              borderRadius: 32,
              boxShadow: "0 24px 60px rgba(30, 64, 175, 0.28)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "#bfdbfe" }}>
              Kaveri Insight
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 900, margin: "12px 0" }}>A gentle nudge for today</h3>
            <p style={{ lineHeight: 1.7, color: "#dbeafe", margin: 0 }}>
              Your child is building a steady base in the vowel set. If one sound takes longer, that is healthy repetition, not a setback.
            </p>
            <p style={{ lineHeight: 1.7, color: "#dbeafe", margin: "14px 0 0" }}>
              Try a five-minute home activity: say the letter aloud, trace it in the air, then point to the matching picture.
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)",
              border: "1px solid #fed7aa",
              padding: 28,
              borderRadius: 32,
              boxShadow: "0 20px 50px rgba(234, 88, 12, 0.08)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: "#c2410c" }}>
              Next Milestones
            </div>
            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              {[
                { title: "Finish the vowel track", status: "Live now" },
                { title: "Start consonant cluster practice", status: "In Level 1" },
                { title: "Level 1 celebration checkpoint", status: "Unlocks after progress" },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "14px 16px",
                    borderRadius: 18,
                    background: "white",
                    border: "1px solid #ffedd5",
                  }}
                >
                  <span style={{ fontWeight: 800, color: "#431407" }}>{item.title}</span>
                  <span style={{ fontWeight: 800, color: "#ea580c", whiteSpace: "nowrap" }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
