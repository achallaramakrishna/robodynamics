import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";

const levels = [
  {
    id: 1,
    title: "Swar Foundation",
    hindiTitle: "स्वर · Vowels & Consonants",
    desc: "Master 51 letters with sounds, tracing, and visual memory. Foundation of Hindi reading.",
    topics: ["13 vowels (स्वर)", "36 consonants (व्यंजन)", "Letter tracing & speaking"],
    badge: "Live ✅",
    color: "#f97316",
    icon: "अ",
  },
  {
    id: 2,
    title: "Matra Mastery",
    hindiTitle: "मात्रा · Vowel Modifiers",
    desc: "Learn how vowels modify consonants. Essential for reading and writing real Hindi words.",
    topics: ["8 vowel modifiers", "Consonant + matra combinations", "Word formation"],
    badge: "Live ✅",
    color: "#10b981",
    icon: "ा",
  },
  {
    id: 3,
    title: "Conjunct Conquest",
    hindiTitle: "संयुक्त · Consonant Clusters",
    desc: "Decode consonant clusters and complex letter combinations in Hindi texts.",
    topics: ["36 conjunct forms", "Halant combinations", "Recognition & writing"],
    badge: "Live ✅",
    color: "#3b82f6",
    icon: "क्त",
  },
  {
    id: 4,
    title: "Consonant Academy",
    hindiTitle: "बारखड़ी · Complete Grid",
    desc: "Fluent reading through the Barakhadi grid—all consonants with every vowel mark.",
    topics: ["Full Barakhadi grid (36x8=288)", "Rapid recognition", "Reading fluency"],
    badge: "Live ✅",
    color: "#8b5cf6",
    icon: "क",
  },
  {
    id: 5,
    title: "Conversation Clinic",
    hindiTitle: "बातचीत · Real Dialogues",
    desc: "Speak & understand everyday Hindi with common phrases, cultural context, and confidence.",
    topics: ["31 everyday sentences", "Greetings & politeness", "Real-life situations"],
    badge: "Live ✅",
    color: "#ec4899",
    icon: "नमस्ते",
  },
  {
    id: 6,
    title: "Grammar Essentials",
    hindiTitle: "व्याकरण · Complete Grammar",
    desc: "🆕 Master nouns, verbs, adjectives, pronouns, and sentence construction. Ready for Hindi expressions!",
    topics: ["Parts of speech", "Verb conjugation", "Sentence structures"],
    badge: "New! 🎉",
    color: "#ef4444",
    icon: "व",
  },
];

const promises = [
  "Complete Hindi curriculum: Letters → Grammar → Real conversations",
  "AI tutor adapts to your child's pace with spaced repetition",
  "Interactive tracing, audio, and engaging visuals for every lesson",
  "NEW: Grammar essentials (42 lessons) now live—master verbs, nouns, adjectives!",
];

export default function VaaniHome() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 28%), radial-gradient(circle at top right, rgba(59,130,246,0.16), transparent 26%), linear-gradient(180deg, #fff8ef 0%, #fffdf8 42%, #f5fbff 100%)",
        color: "#172033",
        fontFamily: "'Outfit', 'Trebuchet MS', sans-serif",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(16px)",
          background: "rgba(255,255,255,0.82)",
          borderBottom: "1px solid rgba(23,32,51,0.08)",
        }}
      >
        <nav
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "#172033", display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #f97316, #facc15 50%, #22c55e)",
                color: "white",
                fontSize: 24,
                fontWeight: 900,
                boxShadow: "0 18px 35px rgba(249,115,22,0.24)",
              }}
            >
              व
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>Vaani</div>
              <div style={{ fontSize: 12, color: "#5b6475", fontWeight: 700 }}>AI tutor for Hindi literacy</div>
            </div>
          </Link>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <LanguageSelector />
            <Link
              href="/parent"
              style={{
                textDecoration: "none",
                color: "#0f766e",
                border: "1px solid rgba(15,118,110,0.16)",
                background: "rgba(15,118,110,0.06)",
                padding: "10px 16px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Parent Dashboard
            </Link>
            <Link
              href="/level-1"
              style={{
                textDecoration: "none",
                color: "white",
                background: "linear-gradient(135deg, #f97316, #ef4444)",
                padding: "12px 18px",
                borderRadius: 999,
                fontWeight: 800,
                boxShadow: "0 16px 30px rgba(239,68,68,0.22)",
              }}
            >
              Launch Level 1
            </Link>
          </div>
        </nav>
      </div>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "54px 24px 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                gap: 10,
                alignItems: "center",
                borderRadius: 999,
                padding: "10px 16px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.24)",
                color: "#991b1b",
                fontSize: 13,
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              🎉 Complete Curriculum
              <span style={{ color: "#0f766e" }}>All 6 levels now live!</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(42px, 7vw, 76px)",
                lineHeight: 1,
                letterSpacing: -2.4,
                margin: "0 0 18px",
                fontWeight: 900,
              }}
            >
              From letters to grammar
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #f97316, #ec4899 45%, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Complete Hindi mastery
              </span>
            </h1>

            <p style={{ fontSize: 20, lineHeight: 1.65, color: "#556070", maxWidth: 760, margin: "0 0 28px" }}>
              Vaani is the complete Hindi AI tutor: Learn 51 letters, master word combinations, speak real sentences, and understand grammar rules. All with bright visuals, adaptive AI coaching, and spaced repetition.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
              <Link
                href="/level-1"
                style={{
                  textDecoration: "none",
                  color: "white",
                  background: "linear-gradient(135deg, #f97316, #fb7185)",
                  padding: "16px 24px",
                  borderRadius: 18,
                  fontWeight: 900,
                  boxShadow: "0 18px 38px rgba(249,115,22,0.28)",
                }}
              >
                Start Level 1
              </Link>
              <Link
                href="/arena/register"
                style={{
                  textDecoration: "none",
                  color: "#1d4ed8",
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  padding: "16px 24px",
                  borderRadius: 18,
                  fontWeight: 800,
                }}
              >
                Arena Registration
              </Link>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {promises.map((promise) => (
                <div key={promise} style={{ display: "flex", gap: 12, alignItems: "center", color: "#334155", fontWeight: 600 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: "linear-gradient(135deg, #22c55e, #14b8a6)",
                      color: "white",
                      fontSize: 14,
                    }}
                  >
                    ✓
                  </span>
                  {promise}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(23,32,51,0.08)",
              borderRadius: 36,
              padding: 28,
              boxShadow: "0 32px 70px rgba(99,102,241,0.12)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.14), transparent 24%), radial-gradient(circle at 80% 18%, rgba(59,130,246,0.14), transparent 24%), radial-gradient(circle at 70% 78%, rgba(34,197,94,0.14), transparent 22%)",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                  marginBottom: 18,
                }}
              >
                {[
                  { char: "अ", word: "अनार", color: "#f97316" },
                  { char: "आ", word: "आम", color: "#22c55e" },
                  { char: "इ", word: "इमली", color: "#3b82f6" },
                  { char: "च", word: "चरखा", color: "#ec4899" },
                  { char: "ज", word: "जहाज", color: "#8b5cf6" },
                  { char: "त", word: "तरबूज", color: "#f59e0b" },
                ].map((card) => (
                  <div
                    key={card.char}
                    style={{
                      background: "white",
                      borderRadius: 24,
                      padding: 18,
                      textAlign: "center",
                      border: "1px solid rgba(23,32,51,0.06)",
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        margin: "0 auto 10px",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 18,
                        background: `${card.color}18`,
                        color: card.color,
                        fontSize: 28,
                        fontWeight: 900,
                      }}
                    >
                      {card.char}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{card.word}</div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(59,130,246,0.12))",
                  borderRadius: 24,
                  padding: 20,
                  border: "1px solid rgba(255,255,255,0.62)",
                }}
              >
                <div style={{ fontSize: 12, color: "#5b6475", fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>
                  Launch Snapshot
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#f97316" }}>26+</div>
                    <div style={{ fontSize: 13, color: "#5b6475" }}>Level 1 lessons</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#3b82f6" }}>3</div>
                    <div style={{ fontSize: 13, color: "#5b6475" }}>practice modes</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#10b981" }}>100%</div>
                    <div style={{ fontSize: 13, color: "#5b6475" }}>public assets served</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 72px" }}>
        <div style={{ marginBottom: 26 }}>
          <h2 style={{ fontSize: 36, margin: "0 0 8px", fontWeight: 900, letterSpacing: -1 }}>Choose the learning arc</h2>
          <p style={{ color: "#5b6475", margin: 0, fontSize: 17 }}>
            Level 1 is launch-ready today. The next levels are structured and can be expanded on the same design system.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {levels.map((level) => {
            const isOpen = level.id === 1;
            return (
              <div
                key={level.id}
                style={{
                  background: "rgba(255,255,255,0.86)",
                  borderRadius: 28,
                  padding: 24,
                  border: `1px solid ${isOpen ? "rgba(249,115,22,0.22)" : "rgba(23,32,51,0.08)"}`,
                  boxShadow: isOpen ? "0 28px 60px rgba(249,115,22,0.12)" : "0 16px 36px rgba(15,23,42,0.06)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(circle at top right, ${level.color}18, transparent 28%)`,
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 20,
                        background: `${level.color}18`,
                        color: level.color,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 28,
                        fontWeight: 900,
                      }}
                    >
                      {level.icon}
                    </div>
                    <div
                      style={{
                        borderRadius: 999,
                        padding: "7px 12px",
                        background: isOpen ? "rgba(34,197,94,0.12)" : "rgba(99,102,241,0.08)",
                        color: isOpen ? "#15803d" : "#5b6475",
                        fontSize: 12,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {level.badge}
                    </div>
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 800, color: level.color, marginBottom: 6 }}>Level {level.id}</div>
                  <h3 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.8, margin: "0 0 6px" }}>{level.title}</h3>
                  <div style={{ fontSize: 16, color: "#334155", fontWeight: 700, marginBottom: 12 }}>{level.hindiTitle}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5b6475", margin: "0 0 18px" }}>{level.desc}</p>

                  <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                    {level.topics.map((topic) => (
                      <div key={topic} style={{ display: "flex", gap: 10, alignItems: "center", color: "#334155", fontSize: 14, fontWeight: 600 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 999, background: level.color }} />
                        {topic}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/level-${level.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      textDecoration: "none",
                      borderRadius: 18,
                      padding: "15px 18px",
                      fontWeight: 800,
                      color: isOpen ? "white" : level.color,
                      background: isOpen ? `linear-gradient(135deg, ${level.color}, #fb7185)` : `${level.color}12`,
                    }}
                  >
                    {isOpen ? `Open Level ${level.id}` : `See Level ${level.id} roadmap`}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
