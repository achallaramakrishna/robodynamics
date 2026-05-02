"use client";

import { useState, useEffect } from "react";
import { MONEYMIND_LEVELS, MoneyMindLevel } from "../../lib/moneyMindCatalog";

// ─── Theme ────────────────────────────────────────────────────────────────────
const THEME = {
  gradient: "linear-gradient(135deg, #451A03 0%, #0F172A 70%, #030712 100%)",
  accentPrimary: "#F59E0B", 
  accentSecondary: "#D97706",
  navBg: "#0F172A",
  cardBg: "#1E293B",
  borderBase: "#78350F",
  textMain: "#F8FAFC",
  textSub: "#D1D5DB"
};

const BIZ_BADGES = [
  { label: "Compounding", color: "#10B981" },
  { label: "Stock Market", color: "#3B82F6" },
  { label: "Real Estate", color: "#F59E0B" },
  { label: "Taxes", color: "#EF4444" },
  { label: "Startups", color: "#8B5CF6" },
];

// ─── Streak Banner ────────────────────────────────────────────────────────────
function StreakBanner() {
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const data = JSON.parse(localStorage.getItem('mm_streak') || '{"streak":0,"lastDate":"","coins":0}');
      let newStreak = data.streak;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (data.lastDate === today) { newStreak = data.streak; }
      else if (data.lastDate === yesterday) { newStreak = data.streak + 1; }
      else { newStreak = 1; }
      const newCoins = (data.coins || 0);
      localStorage.setItem('mm_streak', JSON.stringify({ streak: newStreak, lastDate: today, coins: newCoins }));
      setStreak(newStreak);
      setCoins(newCoins);
    } catch { setStreak(1); }
  }, []);
  if (streak < 1) return null;
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap", margin: "0 auto 24px", maxWidth: 600 }}>
      <div style={{ background: "linear-gradient(135deg,#92400E,#D97706)", borderRadius: 16, padding: "12px 22px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 16px rgba(217,119,6,0.3)" }}>
        <span style={{ fontSize: 28 }}>{streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "✨"}</span>
        <div>
          <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 18, lineHeight: 1 }}>{streak} Day{streak > 1 ? "s" : ""} Streak!</div>
          <div style={{ color: "#FDE68A", fontSize: 12, marginTop: 2 }}>Keep going — you&apos;re on fire!</div>
        </div>
      </div>
      {coins > 0 && (
        <div style={{ background: "linear-gradient(135deg,#065F46,#10B981)", borderRadius: 16, padding: "12px 22px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}>
          <span style={{ fontSize: 24 }}>🪙</span>
          <div>
            <div style={{ color: "#D1FAE5", fontWeight: 900, fontSize: 18, lineHeight: 1 }}>{coins} Coins</div>
            <div style={{ color: "#A7F3D0", fontSize: 12, marginTop: 2 }}>Total earned</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Level Card Component ─────────────────────────────────────────────────────

function LevelCard({ level, index }: { level: MoneyMindLevel; index: number }) {
  const [hovered, setHovered] = useState(false);
  const bgColors = [
    "linear-gradient(135deg, #059669, #10B981)",
    "linear-gradient(135deg, #1D4ED8, #3B82F6)",
    "linear-gradient(135deg, #D97706, #F59E0B)",
    "linear-gradient(135deg, #6D28D9, #8B5CF6)",
    "linear-gradient(135deg, #BE185D, #E11D48)",
    "linear-gradient(135deg, #B45309, #F43F5E)",
  ];
  
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: THEME.cardBg,
        borderRadius: 20,
        overflow: "hidden",
        border: `2px solid ${hovered ? level.color : "#334155"}`,
        boxShadow: hovered ? `0 20px 40px ${level.color}30` : `0 4px 16px rgba(0,0,0,0.5)`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
      }}>
        {/* Header with Image */}
        <div style={{ 
          height: 180, 
          position: "relative", 
          background: bgColors[index],
          overflow: "hidden"
        }}>
          {level.image && (
            <img 
              src={level.image} 
              alt={level.name} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                opacity: hovered ? 0.9 : 0.7,
                transition: "all 0.5s ease",
                transform: hovered ? "scale(1.1)" : "scale(1)"
              }} 
            />
          )}
          <div style={{ 
            position: "absolute", 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: `linear-gradient(to bottom, transparent 0%, ${THEME.cardBg} 100%)` 
          }}></div>
          
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", color: "#fff", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 800, letterSpacing: 0.5, border: "1px solid rgba(255,255,255,0.1)" }}>
            LEVEL {level.order}
          </div>
          <div style={{ position: "absolute", bottom: 16, left: 20 }}>
             <div style={{ fontSize: 32, marginBottom: 4 }}>{level.emoji}</div>
             <div style={{ color: "#fff", fontWeight: 900, fontSize: 24, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{level.name}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 28px" }}>
          <div style={{ color: THEME.accentPrimary, fontWeight: 800, fontSize: 13, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{level.ageEquiv}</div>
          <div style={{ color: THEME.textMain, fontWeight: 700, fontSize: 16, marginBottom: 16, lineHeight: 1.4 }}>{level.tagline}</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {level.lessons.slice(0,3).map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: THEME.textSub, fontSize: 14 }}>
                <span style={{ color: level.color, fontSize: 12 }}>✦</span>
                {l.title}
              </div>
            ))}
          </div>

          <a
            href={`/moneymind/course/${level.id}`}
            style={{ 
              display: "block",
              background: hovered ? level.color : "transparent", 
              color: hovered ? "#fff" : level.color, 
              border: `2px solid ${level.color}`,
              borderRadius: 12, 
              padding: "14px 0", 
              textAlign: "center", 
              fontWeight: 800, 
              fontSize: 14, 
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            Start Learning
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MoneyMindPage() {
  return (
    <div style={{ background: "#030712", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff" }}>

      <nav style={{ background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, zIndex: 100, padding: "0 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", height: 70, gap: 24 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/assets/logo.png" alt="RoboDynamics" style={{ height: 32, width: "auto" }} onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling!.style.display='block'; }} />
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em", display: 'none' }}>ROBODYNAMICS</span>
          </a>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }}></div>
          <span style={{ color: THEME.accentPrimary, fontWeight: 800, fontSize: 16, letterSpacing: "0.05em" }}>MONEY MIND</span>
          
          <div style={{ marginLeft: "auto", display: "flex", gap: 24, alignItems: "center" }}>
            <a href="#levels" style={{ color: THEME.textSub, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Curriculum</a>
            <a href="https://robodynamics.in/login" style={{ background: THEME.accentPrimary, color: "#451A03", borderRadius: 8, padding: "8px 20px", fontSize: 14, fontWeight: 800, textDecoration: "none" }}>Student Login</a>
          </div>
        </div>
      </nav>

      <section style={{ 
        background: "radial-gradient(circle at top right, #451A03 0%, #030712 50%)", 
        padding: "100px 32px 80px", 
        overflow: "hidden", 
        position: "relative" 
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 500px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: 100, padding: "8px 20px", marginBottom: 32 }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ color: THEME.accentPrimary, fontSize: 14, fontWeight: 800, letterSpacing: "0.05em" }}>FINANCIAL LITERACY AI</span>
            </div>

            <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, color: "#fff", lineHeight: 1, margin: "0 0 28px", letterSpacing: "-0.04em" }}>
              Because schools don't teach{" "}
              <span style={{ background: `linear-gradient(135deg, #FCD34D, ${THEME.accentPrimary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                how to build Wealth.
              </span>
            </h1>
            <p style={{ color: THEME.textSub, fontSize: 19, lineHeight: 1.6, marginBottom: 44, maxWidth: 600 }}>
              RoboDynamics Money Mind is a 6-tier journey into financial sovereignty. From the basics of currency to the complexities of startup equity and tax strategy.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
              <a href="/ai-tutor/demo?product=moneymind&fresh=1" style={{ 
                background: `linear-gradient(135deg, #FCD34D, ${THEME.accentPrimary})`, 
                color: "#451A03", 
                borderRadius: 14, 
                padding: "20px 44px", 
                fontWeight: 900, 
                fontSize: 18, 
                textDecoration: "none", 
                boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)",
                transition: "transform 0.2s ease"
              }}>
                Take the Baseline Test
              </a>
            </div>

            <div style={{ display: "flex", gap: 32 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>6 Tiers</div>
                <div style={{ fontSize: 13, color: THEME.textSub, fontWeight: 600 }}>Structured Learning</div>
              </div>
              <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }}></div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>24+</div>
                <div style={{ fontSize: 13, color: THEME.textSub, fontWeight: 600 }}>Interactive Simulators</div>
              </div>
            </div>
          </div>

          <div style={{ flex: "1 1 400px", position: "relative" }}>
            <div style={{ 
              position: "absolute", 
              top: "50%", left: "50%", 
              transform: "translate(-50%, -50%)", 
              width: "140%", height: "140%", 
              background: `radial-gradient(circle, ${THEME.accentSecondary}20 0%, transparent 70%)`,
              zIndex: 0
            }}></div>
            <img 
              src="/moneymind/moneymind_hero_main.png" 
              alt="Money Mind AI" 
              style={{ 
                width: "100%", 
                height: "auto", 
                borderRadius: 30, 
                position: "relative", 
                zIndex: 1,
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)"
              }} 
            />
          </div>
        </div>
      </section>

      {/* ── 6 Growth Tiers ────────────────────────────────────────────────── */}
      <section id="levels" style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <StreakBanner />
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              The 6 Growth Tiers
            </h2>
            <p style={{ color: THEME.textSub, fontSize: 18, maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
              Master compounding, tax strategy, and capital allocation through high-fidelity AI simulators.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(350px, 100%), 1fr))", gap: 32 }}>
            {MONEYMIND_LEVELS.map((level, i) => (
              <LevelCard key={level.id} level={level} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "0 32px 100px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ 
            background: "linear-gradient(135deg, #1E293B, #030712)", 
            border: `1px solid ${THEME.accentSecondary}44`, 
            borderRadius: 30, 
            padding: "60px", 
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: `${THEME.accentPrimary}11`, borderRadius: "50%", filter: "blur(60px)" }}></div>
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ color: THEME.accentPrimary, fontSize: 14, fontWeight: 900, marginBottom: 12, letterSpacing: "0.2em" }}>LIMITED TIME OFFER</div>
              <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 20 }}>Unlock Generational Wealth</h2>
              <p style={{ color: THEME.textSub, fontSize: 18, margin: "0 auto 40px", maxWidth: 600, lineHeight: 1.6 }}>
                Secure lifetime access to all 6 levels of the Money Mind curriculum. Prepare for absolute fiscal freedom today.
              </p>
              
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: THEME.textSub, fontSize: 14, textDecoration: "line-through" }}>Original: ₹14,995</div>
                  <div style={{ color: "#fff", fontSize: 48, fontWeight: 900 }}>₹5,999</div>
                </div>
                <a href="/checkout?bundle=moneymind-6-levels" style={{ background: THEME.accentPrimary, color: "#451A03", borderRadius: 16, padding: "20px 48px", fontWeight: 900, fontSize: 18, textDecoration: "none" }}>
                  Get Lifetime Access
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ background: THEME.navBg, borderTop: `1px solid ${THEME.borderBase}`, padding: "32px", textAlign: "center" }}>
        <div style={{ color: THEME.textSub, fontSize: 13 }}>
          © 2026 RoboDynamics · <a href="https://robodynamics.in" style={{ color: THEME.accentPrimary, textDecoration: "none" }}>robodynamics.in</a>
          <br />
          <span style={{ color: THEME.borderBase, fontSize: 11, marginTop: 8, display: "inline-block" }}>Financial Literacy, Accelerated by AI.</span>
        </div>
      </footer>

    </div>
  );
}
