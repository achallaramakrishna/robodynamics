"use client";

import React from "react";

type BrandChromeProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  compact?: boolean;
  xp?: number;
  progressPct?: number;
  streak?: number;
  achievements?: { icon: string; label: string }[];
};

type BrandFooterProps = {
  note?: string;
  links?: { label: string; href: string }[];
};

export function MindSutraBrandHeader({
  title,
  subtitle,
  eyebrow = "RoboDynamics",
  compact = false,
  xp,
  progressPct,
  streak,
  achievements = [],
}: BrandChromeProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        padding: compact ? "0 0 20px" : "0 0 28px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flex: 1 }}>
        <a
          href="https://robodynamics.in"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            src="/rd-logo.png"
            alt="Robo Dynamics"
            style={{
              width: compact ? 40 : 52,
              height: compact ? 40 : 52,
              borderRadius: 14,
              objectFit: "contain",
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.24)",
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#93C5FD",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.16,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              {eyebrow}
            </div>
            <div style={{ color: "#F8FAFC", fontSize: compact ? 16 : 20, fontWeight: 900, lineHeight: 1.1 }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.4, marginTop: 4 }}>
                {subtitle}
              </div>
            )}
          </div>
        </a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {typeof streak === "number" && (
          <div
            style={{
              background: "rgba(254, 243, 199, 0.1)",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              borderRadius: 14,
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <span style={{ fontSize: 20 }}>🔥</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#F59E0B", fontSize: 16, fontWeight: 900, lineHeight: 1 }}>{streak}</span>
              <span style={{ color: "#D97706", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>Day Streak</span>
            </div>
          </div>
        )}

        {typeof xp === "number" && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: 14,
              padding: "6px 14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 80,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ color: "#94A3B8", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Total XP</div>
            <div style={{ color: "#FCD34D", fontSize: 18, fontWeight: 900 }}>{xp.toLocaleString()}</div>
          </div>
        )}

        {achievements.length > 0 && (
          <div style={{ display: "flex", gap: 6 }}>
            {achievements.map((ach, i) => (
              <div
                key={i}
                title={ach.label}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                {ach.icon}
              </div>
            ))}
          </div>
        )}
        
        {typeof progressPct === "number" && (
          <div style={{ width: 100, display: isPhone ? "none" : "block", marginLeft: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "#94A3B8", fontSize: 9, fontWeight: 800 }}>LEVEL PROGRESS</span>
              <span style={{ color: "#F8FAFC", fontSize: 9, fontWeight: 800 }}>{Math.round(progressPct)}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(30, 41, 59, 0.8)", borderRadius: 999, overflow: "hidden", border: "1px solid rgba(148, 163, 184, 0.1)" }}>
              <div 
                style={{ 
                  width: `${progressPct}%`, 
                  height: "100%", 
                  background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                  borderRadius: 999,
                  transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const isPhone = typeof window !== "undefined" && window.innerWidth < 720;

export function MindSutraBrandFooter({
  note = "Mindsutra by RoboDynamics",
  links = [],
}: BrandFooterProps) {
  return (
    <footer
      style={{
        marginTop: 32,
        paddingTop: 18,
        borderTop: "1px solid rgba(148, 163, 184, 0.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        color: "#64748B",
        fontSize: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src="/rd-logo.png"
          alt="Robo Dynamics"
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            objectFit: "contain",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(148, 163, 184, 0.14)",
          }}
        />
        <span style={{ fontWeight: 800, color: "#CBD5E1" }}>{note}</span>
      </div>

      {links.length > 0 && (
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {links.map((link) => (
            <a key={link.href} href={link.href} style={{ color: "#94A3B8", textDecoration: "none" }}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}

export function MindSutraAchievementPop({
  lessonTitle,
  xpReward,
  onClose,
  nextLessonUrl,
}: {
  lessonTitle: string;
  xpReward: number;
  onClose: () => void;
  nextLessonUrl?: string;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 1000,
        animation: "ms-feedback-in 0.4s ease both",
      }}
    >
      <div
        style={{
          width: "min(480px, 100%)",
          background: "linear-gradient(135deg, #1E293B, #0F172A)",
          borderRadius: 32,
          padding: 40,
          textAlign: "center",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div 
          style={{ 
            position: "absolute", 
            top: -50, 
            left: "50%", 
            transform: "translateX(-50%)", 
            width: 200, 
            height: 200, 
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
            pointerEvents: "none"
          }} 
        />

        <div style={{ fontSize: 72, marginBottom: 24, animation: "ms-headline-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>🏆</div>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: "#F8FAFC", marginBottom: 12, lineHeight: 1.1 }}>Lesson Mastered!</h2>
        <div style={{ color: "#94A3B8", fontSize: 16, marginBottom: 32 }}>{lessonTitle}</div>
        
        <div 
          style={{ 
            display: "inline-flex", 
            flexDirection: "column", 
            alignItems: "center", 
            background: "rgba(252, 211, 77, 0.1)", 
            padding: "20px 40px", 
            borderRadius: 24, 
            border: "1px solid rgba(252, 211, 77, 0.2)",
            marginBottom: 40,
            animation: "ms-expr-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both"
          }}
        >
          <div style={{ color: "#FCD34D", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>+{xpReward}</div>
          <div style={{ color: "#FCD34D", fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>XP Earned</div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {nextLessonUrl ? (
            <a 
              href={nextLessonUrl}
              style={{ 
                background: "linear-gradient(90deg, #3B82F6, #2563EB)", 
                color: "#FFFFFF", 
                textDecoration: "none", 
                fontWeight: 800, 
                padding: "18px 32px", 
                borderRadius: 16, 
                fontSize: 18,
                boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)"
              }}
            >
              Continue to Next Lesson
            </a>
          ) : null}
          <button 
            onClick={onClose}
            style={{ 
              background: "transparent", 
              color: "#94A3B8", 
              border: "1px solid rgba(148, 163, 184, 0.3)", 
              borderRadius: 16, 
              padding: "16px 32px", 
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
