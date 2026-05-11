"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MINDSPARC_LEVELS } from "@/lib/mindsparcCatalog";

const LEVELS = ["level-1", "level-2", "level-3", "level-4", "level-5"] as const;

export default function MindSparcLevelClient() {
  const params = useParams();
  const router = useRouter();
  const levelSlug = (params?.level as string) ?? "level-1";
  
  // Parse 'level-1' back to 'L1'
  const levelId = "L" + levelSlug.split("-")[1];
  const levelData = MINDSPARC_LEVELS.find(l => l.id === levelId) || MINDSPARC_LEVELS[0];
  
  const [openChapter, setOpenChapter] = useState<number | null>(0);
  
  const levelNum = levelData.order;
  const checkoutUrl = `/checkout/mindsparc-${levelNum}`;
  const whatsappText = encodeURIComponent(`I'm exploring the AI Aptitude Tutor for Level ${levelNum} — Check out the curriculum: https://robodynamics.in/mindsparc/level-${levelNum}`);
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  // Theme configuration tailored for MindSparc "Brain" aesthetic
  const THEME = {
    gradient: "radial-gradient(circle at 50% 0%, #0F172A 0%, #020617 100%)",
    accentPrimary: "#38BDF8", 
    accentSecondary: "#3B82F6",
    navBg: "rgba(2, 6, 23, 0.9)",
    cardBg: "#0F172A",
    borderBase: "rgba(30, 41, 59, 0.5)",
    textMain: "#F8FAFC",
    textSub: "#94A3B8"
  };

  const S = {
    topBar: { position: "sticky" as const, top: 0, zIndex: 100, background: THEME.navBg, backdropFilter: "blur(12px)", borderBottom: `1px solid ${THEME.borderBase}`, padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
    logo: { display: "flex", alignItems: "center", gap: 12, textDecoration: "none" },
    loginLink: { color: "#CBD5E1", fontSize: 13, textDecoration: "none", padding: "8px 16px", border: `1px solid ${THEME.borderBase}`, borderRadius: 10, background: "rgba(255,255,255,0.05)", fontWeight: 700 },
    hero: { background: THEME.gradient, padding: "100px 24px 80px", textAlign: "center" as const, position: "relative" as const, overflow: "hidden" as const },
    heroEyebrow: { color: THEME.accentPrimary, fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 16 },
    heroH1: { color: THEME.textMain, fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.1, maxWidth: 800, margin: "0 auto 24px", letterSpacing: -2 },
    heroSub: { color: THEME.textSub, fontSize: 18, maxWidth: 640, margin: "0 auto 48px", lineHeight: 1.6 },
    ctaRow: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 48 },
    ctaPrimary: { background: `linear-gradient(135deg, ${THEME.accentSecondary}, ${THEME.accentPrimary})`, color: "#fff", fontWeight: 900, fontSize: 16, padding: "16px 36px", borderRadius: 12, border: "none", cursor: "pointer", textDecoration: "none", display: "inline-block", boxShadow: `0 8px 24px ${THEME.accentSecondary}40` },
    ctaSecondary: { background: "rgba(255,255,255,0.05)", color: THEME.textMain, fontWeight: 700, fontSize: 15, padding: "15px 32px", borderRadius: 12, border: `1px solid ${THEME.borderBase}`, cursor: "pointer", textDecoration: "none", display: "inline-block" },
    levelPills: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const, marginTop: 48 },
    levelPill: (active: boolean) => ({ padding: "10px 24px", borderRadius: 100, fontSize: 14, fontWeight: 800, cursor: "pointer", border: active ? `1px solid ${THEME.accentPrimary}` : `1px solid ${THEME.borderBase}`, background: active ? `${THEME.accentSecondary}20` : "rgba(255,255,255,0.03)", color: active ? THEME.accentPrimary : THEME.textSub, transition: "all 0.2s" }),
    section: { padding: "80px 24px", maxWidth: 900, margin: "0 auto" },
    sectionTitle: { fontSize: 32, fontWeight: 900, color: THEME.textMain, marginBottom: 12, letterSpacing: -1 },
    sectionSub: { color: THEME.textSub, fontSize: 17, marginBottom: 48, lineHeight: 1.6 },
    
    // Parent-why box
    whyBox: { background: "rgba(56, 189, 248, 0.05)", border: "1px solid rgba(56, 189, 248, 0.15)", borderRadius: 24, padding: "32px", marginBottom: 48 },
    whyTitle: { fontWeight: 900, color: THEME.accentPrimary, fontSize: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 10, textTransform: "uppercase" as const, letterSpacing: 1 },
    whyText: { color: THEME.textSub, fontSize: 16, lineHeight: 1.8 },
    
    // Curriculum
    chapterItem: (isFirst: boolean, hasDemo: boolean) => ({ border: `1px solid ${isFirst ? THEME.accentPrimary : THEME.borderBase}`, borderRadius: 20, marginBottom: 16, overflow: "hidden", background: "rgba(255,255,255,0.02)", transition: "all 0.3s ease" }),
    chapterHeader: (isFirst: boolean) => ({ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", cursor: "pointer", background: isFirst ? "rgba(56, 189, 248, 0.08)" : "transparent" }),
    chapterNum: { background: "rgba(56, 189, 248, 0.15)", color: THEME.accentPrimary, fontWeight: 900, fontSize: 14, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    chapterTitle: { flex: 1, fontWeight: 800, color: THEME.textMain, fontSize: 17, lineHeight: 1.4 },
    freeBadge: { background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontSize: 11, fontWeight: 900, padding: "4px 10px", borderRadius: 8, flexShrink: 0, textTransform: "uppercase" as const, letterSpacing: 1 },
    metaBadge: { color: THEME.textSub, fontSize: 13, flexShrink: 0, fontWeight: 600 },
    goalsBox: { padding: "0 24px 24px 76px" },
    goalItem: { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10, fontSize: 15, color: THEME.textSub, lineHeight: 1.5 },
    
    // AI Councillor Preview Box
    councillorPreview: { background: "linear-gradient(135deg, #0F172A, #020617)", borderRadius: 32, padding: "48px 40px", textAlign: "center" as const, margin: "0 auto 64px", border: `1px solid ${THEME.borderBase}`, boxShadow: "0 32px 64px rgba(0,0,0,0.5)" },
    councillorAvatar: { fontSize: 64, marginBottom: 20, filter: "drop-shadow(0 0 20px rgba(56, 189, 248, 0.3))" },
    councillorPitch: { color: THEME.textSub, fontSize: 16, lineHeight: 1.8, marginBottom: 32 },

    footer: { background: THEME.navBg, padding: "64px 24px", borderTop: `1px solid ${THEME.borderBase}` },
    
    stickyBottom: { position: "fixed" as const, bottom: 0, left: 0, right: 0, zIndex: 100, background: THEME.navBg, backdropFilter: "blur(16px)", borderTop: `1px solid ${THEME.borderBase}`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 -8px 32px rgba(0,0,0,0.6)" },
    stickyLeft: { display: "flex", flexDirection: "column" as const },
    stickyPrice: { color: "#FFFFFF", fontSize: 24, fontWeight: 900, letterSpacing: -1 },
    stickyBtns: { display: "flex", gap: 16, alignItems: "center" },
    enrollBtn: { background: `linear-gradient(135deg, ${THEME.accentSecondary}, ${THEME.accentPrimary})`, color: "#fff", fontWeight: 900, fontSize: 16, padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer", textDecoration: "none", boxShadow: `0 4px 16px ${THEME.accentSecondary}40` },
    waBtn: { background: "#10B981", color: "#FFFFFF", fontWeight: 700, fontSize: 14, padding: "12px 16px", borderRadius: 10, border: "none", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }
  };

  return (
    <div style={{ background: "#020617", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: THEME.textMain }}>

      <nav style={S.topBar}>
        <a href="/mindsparc" style={S.logo}>
          <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 32, objectFit: "contain" }} />
           <span style={{ color: "rgba(255,255,255,0.1)", fontSize: 24, fontWeight: 100 }}>/</span>
          <span style={{ color: THEME.accentPrimary, fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>MindSparc</span>
        </a>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="https://robodynamics.in/login" style={S.loginLink}>LMS Login</a>
        </div>
      </nav>

      <section style={S.hero}>
        <p style={S.heroEyebrow}>TIER 1 · JUNGLE MISSION</p>
        <h1 style={S.heroH1}>Sparky's Magic Pattern Jungle</h1>
        
        {/* Mission Progress Map */}
        <div style={{ marginTop: 32, marginBottom: 48, borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#0F172A", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
          <object 
            data="/math-svgs/jungle/L1-jungle-progress-map.svg" 
            type="image/svg+xml"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        <p style={S.heroSub}>
          Save the jungle crystals from the Chaos Dragon by mastering the secret logic of patterns and sequences!
        </p>
        <div style={S.ctaRow}>
          <a href={checkoutUrl} style={S.ctaPrimary}>Start Jungle Adventure</a>
          <a href="#curriculum" style={S.ctaSecondary}>Explore Mission Map ↓</a>
        </div>
        
        <div style={S.levelPills}>
          {LEVELS.map(l => (
            <button key={l} style={S.levelPill(l === levelSlug)} onClick={() => router.push(`/mindsparc/course/${l}`)}>
              {l === "level-1" ? "Magic Jungle" : l.replace("level-", "Tier ")}
            </button>
          ))}
        </div>
      </section>

      <section style={{ ...S.section, paddingBottom: 0 }}>
        <div style={S.whyBox}>
          <div style={S.whyTitle}>🧠 Strategic Growth: Level {levelNum}</div>
          <p style={S.whyText}>
            Traditional education focuses on memorization. MindSparc focuses on structural logic. By mastering <strong>{levelData.name}</strong>, your child builds the cognitive models required for Olympiads, elite scholarships, and future technical leadership.
          </p>
        </div>

        {/* AI Councillor Spotlight */}
        <div style={S.councillorPreview}>
          <div style={S.councillorAvatar}>🤖</div>
          <h3 style={{ color: THEME.textMain, fontSize: 28, fontWeight: 900, marginBottom: 16, letterSpacing: -1 }}>The AI Councillor</h3>
          <p style={S.councillorPitch}>
            Your child's progress is overseen by the MindSparc AI Councillor. It analyzes logical missteps, identifies cognitive strengths (visual vs verbal), and adapts the curriculum in real-time. You'll receive weekly WhatsApp reports detailing their problem-solving evolution.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#FFFFFF", padding: "16px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 900, fontSize: 16, display: "inline-block", boxShadow: "0 12px 24px rgba(37, 211, 102, 0.3)" }}>
            💬 Share Curriculum via WhatsApp
          </a>
        </div>
      </section>

      <section id="curriculum" style={{ ...S.section, paddingTop: 32 }}>
        <h2 style={S.sectionTitle}>Curriculum Map</h2>
        <p style={S.sectionSub}>Structured mastery modules for accelerated thinking.</p>

        {levelData.lessons.map((ch, i) => {
          const isOpen = openChapter === i;
          return (
            <div key={i} style={S.chapterItem(i === 0, ch.freePreview)}>
              <div style={S.chapterHeader(i === 0)} onClick={() => setOpenChapter(isOpen ? null : i)}>
                <div style={S.chapterNum}>{i + 1}</div>
                <div style={S.chapterTitle}>
                  {ch.title}
                  <span style={{ fontSize: 11, background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 6, marginLeft: 12, color: THEME.accentPrimary, textTransform: "uppercase", letterSpacing: 1, border: `1px solid ${THEME.accentPrimary}30` }}>{ch.category}</span>
                </div>
                <div style={S.metaBadge}>{ch.durationMin}m</div>
                <div style={{ color: THEME.textSub, fontSize: 14, marginLeft: 16 }}>{isOpen ? "▲" : "▼"}</div>
              </div>
              {isOpen && (
                <div style={S.goalsBox}>
                  <div style={S.goalItem}>
                    <span style={{ color: THEME.accentPrimary, flexShrink: 0, fontWeight: 900 }}>→</span>
                    <span>{ch.skill}</span>
                  </div>
                  <div style={S.goalItem}>
                    <span style={{ color: THEME.accentPrimary, flexShrink: 0, fontWeight: 900 }}>→</span>
                    <span>Cognitive Load: {ch.difficulty}/5</span>
                  </div>
                  
                  <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                    <a 
                      href={`/mindsparc/course/${levelSlug}/lesson/${ch.id}`}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(90deg, #38BDF8, #3B82F6)',
                        color: '#0F172A',
                        borderRadius: 12,
                        textDecoration: 'none',
                        fontWeight: 900,
                        fontSize: 14,
                        boxShadow: '0 8px 16px rgba(56, 189, 248, 0.2)'
                      }}
                    >
                      {ch.freePreview ? 'Start Free Session →' : 'Start Mastery Session →'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <footer style={S.footer}>
        <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 32, marginBottom: 24, opacity: 0.8, display: "block", margin: "0 auto 24px" }} />
        <p style={{ textAlign: "center", color: THEME.textSub, fontSize: 14, margin: 0 }}>© 2026 RoboDynamics · <a href="https://robodynamics.in" style={{ color: THEME.textMain, textDecoration: "none", fontWeight: 600 }}>robodynamics.in</a></p>
      </footer>

      <div style={S.stickyBottom}>
        <div style={S.stickyLeft}>
          <div style={{ ...S.heroEyebrow, marginBottom: 4, fontSize: 10 }}>Enroll in Tier {levelNum}</div>
          <span style={S.stickyPrice}>₹1,499<span style={{ fontSize: 14, fontWeight: 500, color: THEME.textSub, marginLeft: 8 }}> one-time</span></span>
        </div>
        <div style={S.stickyBtns}>
          <a href={checkoutUrl} style={S.enrollBtn}>Access Mastery →</a>
        </div>
      </div>

    </div>
  );
}
