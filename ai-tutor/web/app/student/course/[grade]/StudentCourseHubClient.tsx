"use client";

import { useMemo, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Chapter = {
  code: string;
  title: string;
  durationMin: number;
  freePreview: boolean;
  num: number;
  status: "completed" | "current" | "available" | "locked";
};

type CourseHubData = {
  childName: string;
  courseName: string;
  tagline: string;
  grade: number;
  gradeSlug: string;
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter: string;
  currentChapterName: string;
  accuracy: number;
  xp: number;
  streak: number;
  chapters: Chapter[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GRADE_GRADIENTS: Record<number, string> = {
  4: "linear-gradient(135deg, #F97316, #EA580C)",
  5: "linear-gradient(135deg, #F59E0B, #F97316)",
  6: "linear-gradient(135deg, #10B981, #059669)",
  7: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
  8: "linear-gradient(135deg, #EF4444, #DC2626)",
};

const GRADE_ICONS: Record<number, string> = { 4: "🔢", 5: "✖️", 6: "➗", 7: "📐", 8: "🔬" };

function statusMeta(status: Chapter["status"]) {
  if (status === "completed") return { icon: "✅", color: "#22C55E", bg: "#F0FDF4", label: "Completed" };
  if (status === "current")   return { icon: "▶", color: "#F97316", bg: "#FFF7ED", label: "In Progress" };
  if (status === "available") return { icon: "▶", color: "#2563EB", bg: "#EFF6FF", label: "Start" };
  return { icon: "🔒", color: "#94A3B8", bg: "#F8FAFC", label: "Locked" };
}

function ProgressRing({ pct, size = 64, stroke = 6 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F97316" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#0F172A" fontSize={size * 0.22} fontWeight={800}>
        {pct}%
      </text>
    </svg>
  );
}

// ─── Episode card (Netflix-style) ─────────────────────────────────────────────

function EpisodeCard({ chapter, grade }: { chapter: Chapter; grade: number }) {
  const [hovered, setHovered] = useState(false);
  const meta = statusMeta(chapter.status);
  const startHref = `/ai-tutor/demo?grade=${grade}&chapter=${chapter.code}&fresh=1&enrolled=1`;
  const continueHref = `/ai-tutor/demo?grade=${grade}&chapter=${chapter.code}&fresh=0&enrolled=1`;
  const locked = chapter.status === "locked";
  const gradient = GRADE_GRADIENTS[grade] ?? "linear-gradient(135deg, #64748B, #475569)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: chapter.status === "current" ? "2px solid #F97316" : "1px solid #E2E8F0",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: hovered && !locked ? "0 8px 28px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        opacity: locked ? 0.6 : 1,
      }}
    >
      {/* Thumbnail strip */}
      <div style={{ background: gradient, height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", position: "relative", overflow: "hidden" }}>
        {/* Episode number */}
        <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: 1, textTransform: "uppercase" }}>
          Chapter {chapter.num}
        </div>
        {/* Duration */}
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{chapter.durationMin} min</div>
        {/* Status badge */}
        <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", background: meta.bg, color: meta.color, fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20 }}>
          {meta.icon} {meta.label}
        </div>
        {/* Free preview badge */}
        {chapter.freePreview && (
          <div style={{ position: "absolute", bottom: 8, right: 12, background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>
            FREE PREVIEW
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", lineHeight: 1.35, marginBottom: 12 }}>
          {chapter.title}
        </div>

        {/* Action buttons */}
        {locked ? (
          <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>🔒 Complete earlier chapters to unlock</div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={startHref} style={{ flex: "1 1 auto", background: chapter.status === "completed" ? "transparent" : "#F97316", color: chapter.status === "completed" ? "#F97316" : "#FFF", fontWeight: 700, fontSize: 12, borderRadius: 8, padding: "8px 0", textDecoration: "none", textAlign: "center", border: chapter.status === "completed" ? "1.5px solid #F97316" : "none" }}>
              {chapter.status === "completed" ? "Restart" : chapter.status === "current" ? "▶ Start" : "▶ Begin"}
            </a>
            {(chapter.status === "completed" || chapter.status === "current") && (
              <a href={continueHref} style={{ flex: "1 1 auto", background: "transparent", color: "#64748B", fontWeight: 600, fontSize: 12, borderRadius: 8, padding: "8px 0", textDecoration: "none", textAlign: "center", border: "1.5px solid #CBD5E1" }}>
                Continue saved
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function StudentCourseHubClient({ hub }: { hub: CourseHubData }) {
  const progressPct = useMemo(
    () => Math.round((hub.chaptersCompleted / hub.totalChapters) * 100),
    [hub.chaptersCompleted, hub.totalChapters],
  );

  const gradient = GRADE_GRADIENTS[hub.grade] ?? "linear-gradient(135deg, #64748B, #475569)";
  const gradeIcon = GRADE_ICONS[hub.grade] ?? "📚";
  const currentStartHref = `/ai-tutor/demo?grade=${hub.grade}&chapter=${hub.currentChapter}&fresh=1&enrolled=1`;
  const currentContinueHref = `/ai-tutor/demo?grade=${hub.grade}&chapter=${hub.currentChapter}&fresh=0&enrolled=1`;

  const completed = hub.chapters.filter(c => c.status === "completed").length;
  const available = hub.chapters.filter(c => c.status !== "locked").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Dark hero banner */}
      <div style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)", padding: "0", position: "relative" }}>
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="/student/home" style={{ color: "#94A3B8", textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>◀ Dashboard</a>
            <span style={{ color: "#334155" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>{gradeIcon}</span>
              <div>
                <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 16 }}>{hub.courseName}</div>
                <div style={{ color: "#64748B", fontSize: 11 }}>{hub.tagline}</div>
              </div>
            </div>
          </div>
          <a href="/parent/dashboard" style={{ color: "#F97316", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>Parent View →</a>
        </div>

        {/* Course hero */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 36px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, alignItems: "center" }}>
          {/* Left: resume card */}
          <div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Up Next</div>
            <div style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 900, color: "#F8FAFC", marginBottom: 6, lineHeight: 1.25 }}>
              {hub.currentChapterName}
            </div>
            <div style={{ color: "#94A3B8", fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
              {hub.chaptersCompleted === 0
                ? "Begin your Vedic Maths journey. Start from Chapter 1 for the best learning experience."
                : `${hub.chaptersCompleted} of ${hub.totalChapters} chapters completed. Pick up where you left off.`}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={currentContinueHref} style={{ background: "#F97316", color: "#FFF", fontWeight: 800, fontSize: 15, borderRadius: 10, padding: "12px 24px", textDecoration: "none", boxShadow: "0 4px 16px rgba(249,115,22,0.4)" }}>
                ▶ Resume
              </a>
              <a href={currentStartHref} style={{ background: "rgba(255,255,255,0.1)", color: "#CBD5E1", fontWeight: 700, fontSize: 14, borderRadius: 10, padding: "12px 20px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
                Start from beginning
              </a>
            </div>
          </div>

          {/* Right: stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <ProgressRing pct={progressPct} size={72} stroke={7} />
              <div style={{ color: "#94A3B8", fontSize: 12 }}>Course Progress</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "🎯", val: `${hub.accuracy}%`, lbl: "Accuracy" },
                { icon: "⭐", val: hub.xp.toLocaleString(), lbl: "XP Earned" },
                { icon: "🔥", val: `${hub.streak}d`, lbl: "Streak" },
                { icon: "📚", val: `${completed}/${hub.totalChapters}`, lbl: "Done" },
              ].map(s => (
                <div key={s.lbl} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div>
                    <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 15 }}>{s.val}</div>
                    <div style={{ color: "#64748B", fontSize: 11 }}>{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Episode list */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#0F172A" }}>All Chapters</div>
            <div style={{ color: "#64748B", fontSize: 13, marginTop: 3 }}>
              {completed} completed · {available - completed} unlocked · {hub.totalChapters - available} locked
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href={currentStartHref} style={{ color: "#F97316", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>▶ Start from beginning</a>
            <span style={{ color: "#CBD5E1" }}>·</span>
            <a href={currentContinueHref} style={{ color: "#475569", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>Continue saved session</a>
          </div>
        </div>

        {/* Netflix-style episode grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
          {hub.chapters.map(chapter => (
            <EpisodeCard key={chapter.code} chapter={chapter} grade={hub.grade} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 40, background: gradient, borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginBottom: 4 }}>Current chapter</div>
            <div style={{ color: "#FFF", fontWeight: 900, fontSize: 18 }}>{hub.currentChapterName}</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={currentContinueHref} style={{ background: "#FFF", color: "#F97316", fontWeight: 800, fontSize: 14, borderRadius: 8, padding: "10px 20px", textDecoration: "none" }}>
              ▶ Resume Now
            </a>
            <a href={currentStartHref} style={{ background: "rgba(255,255,255,0.15)", color: "#FFF", fontWeight: 600, fontSize: 14, borderRadius: 8, padding: "10px 18px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)" }}>
              Start fresh
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
