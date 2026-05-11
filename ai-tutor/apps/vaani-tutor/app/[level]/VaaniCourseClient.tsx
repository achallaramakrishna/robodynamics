"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getLevelStats,
  getProfileStats,
  getAllCompletions,
  type LessonCompletion,
} from "@/lib/vaaniGamification";

// ── Design tokens ────────────────────────────────────────────────────────────
const SHELL = {
  ink: "#1a2438",
  soft: "#596579",
  line: "rgba(26,36,56,0.08)",
  surface: "rgba(255,255,255,0.86)",
  accentTwo: "#3b82f6",
  accentThree: "#10b981",
};

// Per-level colour theme — gives each level a distinct visual identity
const LEVEL_THEMES: Record<number, { primary: string; light: string; dark: string; glow: string; shadow: string }> = {
  1: { primary: "#f97316", light: "rgba(249,115,22,0.10)", dark: "#c2410c", glow: "rgba(249,115,22,0.18)", shadow: "rgba(249,115,22,0.25)" },
  2: { primary: "#10b981", light: "rgba(16,185,129,0.10)", dark: "#047857", glow: "rgba(16,185,129,0.18)", shadow: "rgba(16,185,129,0.25)" },
  3: { primary: "#3b82f6", light: "rgba(59,130,246,0.10)", dark: "#1d4ed8", glow: "rgba(59,130,246,0.18)", shadow: "rgba(59,130,246,0.25)" },
  4: { primary: "#8b5cf6", light: "rgba(139,92,246,0.10)", dark: "#6d28d9", glow: "rgba(139,92,246,0.18)", shadow: "rgba(139,92,246,0.25)" },
  5: { primary: "#ec4899", light: "rgba(236,72,153,0.10)", dark: "#be185d", glow: "rgba(236,72,153,0.18)", shadow: "rgba(236,72,153,0.25)" },
  6: { primary: "#ef4444", light: "rgba(239,68,68,0.10)", dark: "#b91c1c", glow: "rgba(239,68,68,0.18)", shadow: "rgba(239,68,68,0.25)" },
};

const DEFAULT_THEME = LEVEL_THEMES[1];

const spotlight = [
  "Visual word anchors",
  "Finger tracing practice",
  "Flashcards and quick checks",
];

const ROADMAP_DEFAULT_VISIBLE = 8;

export default function VaaniCourseClient({ payload }: { payload: any }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(
    payload.selectedLesson?.id ?? payload.lessons[0]?.id ?? ""
  );
  const [showAll, setShowAll] = useState(false);

  // ── Derive level number from first lesson ID (e.g. "L3-C01-L01" → 3) ──────
  const levelNumber = useMemo<number>(() => {
    const id: string = payload.lessons[0]?.id ?? "";
    const match = id.match(/^L(\d+)-/);
    return match ? parseInt(match[1], 10) : 1;
  }, [payload.lessons]);

  const theme = LEVEL_THEMES[levelNumber] ?? DEFAULT_THEME;
  const totalLessons: number = payload.course.totalLessons ?? payload.lessons.length;

  // ── Gamification state (client-side localStorage hydration) ──────────────
  type LevelStats = ReturnType<typeof getLevelStats>;
  type ProfileStats = ReturnType<typeof getProfileStats>;

  const [levelStats, setLevelStats] = useState<LevelStats | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [completionMap, setCompletionMap] = useState<Record<string, LessonCompletion>>({});

  useEffect(() => {
    setLevelStats(getLevelStats(levelNumber));
    setProfileStats(getProfileStats());
    // Build best-star completion map per lesson
    const map: Record<string, LessonCompletion> = {};
    for (const c of getAllCompletions()) {
      const prev = map[c.lessonId];
      if (!prev || c.starsEarned > prev.starsEarned) map[c.lessonId] = c;
    }
    setCompletionMap(map);
  }, [levelNumber]);

  // ── Derived values ────────────────────────────────────────────────────────
  const selectedLesson = useMemo(
    () => payload.lessons.find((l: any) => l.id === selectedId) ?? payload.selectedLesson,
    [payload.lessons, payload.selectedLesson, selectedId],
  );

  // First lesson without a completion — the "Continue" target
  const nextLesson = useMemo(
    () => payload.lessons.find((l: any) => !completionMap[l.id]) ?? payload.lessons[0],
    [payload.lessons, completionMap],
  );

  const completedCount = levelStats?.completedLessons ?? 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const visibleLessons: any[] = showAll
    ? payload.lessons
    : payload.lessons.slice(0, ROADMAP_DEFAULT_VISIBLE);
  const hiddenCount = Math.max(0, payload.lessons.length - ROADMAP_DEFAULT_VISIBLE);

  const selectedCompletion = selectedLesson ? completionMap[selectedLesson.id] : undefined;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top left, ${theme.glow}, transparent 28%), radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 26%), linear-gradient(180deg, #fffaf3 0%, #ffffff 48%, #f6fbff 100%)`,
        color: SHELL.ink,
        fontFamily: "'Outfit', 'Trebuchet MS', sans-serif",
      }}
    >
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "34px 24px 48px" }}>

        {/* ── PAGE HEADER ───────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: theme.dark, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Level {levelNumber} · Hindi Tutor
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(30px, 5vw, 54px)", lineHeight: 1.02, fontWeight: 900, letterSpacing: -1.8 }}>
              {payload.course.title}
            </h1>
            <p style={{ margin: "10px 0 0", color: SHELL.soft, fontSize: 18, maxWidth: 760, lineHeight: 1.65 }}>
              {payload.course.subtitle}. {payload.course.tagline}.
            </p>
          </div>

          {/* ── STATS PILLS ─────────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ padding: "10px 14px", borderRadius: 16, background: theme.light, color: theme.dark, fontWeight: 800, fontSize: 14 }}>
              🏆 {levelStats?.totalXP ?? 0} XP
            </div>
            {(profileStats?.currentStreak ?? 0) > 0 && (
              <div style={{ padding: "10px 14px", borderRadius: 16, background: "rgba(251,191,36,0.15)", color: "#92400e", fontWeight: 800, fontSize: 14 }}>
                🔥 {profileStats!.currentStreak}-day streak
              </div>
            )}
            {(levelStats?.badges.length ?? 0) > 0 && (
              <div style={{ padding: "10px 14px", borderRadius: 16, background: "rgba(16,185,129,0.12)", color: "#047857", fontWeight: 800, fontSize: 14 }}>
                {levelStats!.nextBadgeIcon ?? "🏅"} {levelStats!.badges.length} badge{levelStats!.badges.length > 1 ? "s" : ""}
              </div>
            )}
            <div style={{ padding: "10px 14px", borderRadius: 16, background: "rgba(249,115,22,0.10)", color: "#c2410c", fontWeight: 800, fontSize: 14 }}>
              {totalLessons} lessons
            </div>
          </div>
        </div>

        {/* ── PROGRESS BAR ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: SHELL.soft }}>
              {completedCount} / {totalLessons} lessons completed ({progressPercent}%)
            </span>
            {levelStats?.nextBadgeName && (
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.dark }}>
                {levelStats.nextBadgeIcon} Next badge: {levelStats.nextBadgeName}
              </span>
            )}
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: 999,
                background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary}cc)`,
                width: `${progressPercent}%`,
                transition: "width 0.6s ease",
                minWidth: progressPercent > 0 ? 20 : 0,
              }}
            />
          </div>
        </div>

        {/* ── PRIMARY CTA ───────────────────────────────────────────────────── */}
        {nextLesson && (
          <div style={{ marginBottom: 28 }}>
            <button
              onClick={() => nextLesson.startUrl && router.push(nextLesson.startUrl as string)}
              style={{
                border: "none",
                cursor: "pointer",
                padding: "15px 28px",
                borderRadius: 20,
                fontWeight: 900,
                fontSize: 17,
                color: "white",
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`,
                boxShadow: `0 16px 32px ${theme.shadow}`,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>{completedCount > 0 ? "📖" : "▶"}</span>
              {completedCount > 0 ? `Continue: ${nextLesson.title}` : `Start Level ${levelNumber}`}
            </button>
          </div>
        )}

        {/* ── TWO-COLUMN LAYOUT: ROADMAP + LESSON DETAIL ─────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>

          {/* ── ROADMAP SIDEBAR ─────────────────────────────────────────────── */}
          <aside
            style={{
              background: SHELL.surface,
              borderRadius: 30,
              border: `1px solid ${SHELL.line}`,
              padding: 22,
              boxShadow: "0 24px 52px rgba(15,23,42,0.08)",
              height: "fit-content",
            }}
          >
            <div style={{ fontSize: 12, color: "#5b6475", fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 14 }}>
              {payload.course.title.split(":")[0]} Roadmap
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {visibleLessons.map((lesson: any) => {
                const active = lesson.id === selectedId;
                const completion = completionMap[lesson.id];
                const stars = completion?.starsEarned ?? 0;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedId(lesson.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 20,
                      padding: 14,
                      cursor: "pointer",
                      border: active
                        ? `2px solid ${theme.primary}55`
                        : `1px solid ${SHELL.line}`,
                      background: active
                        ? `linear-gradient(135deg, ${theme.light}, rgba(251,191,36,0.08))`
                        : completion
                        ? "rgba(16,185,129,0.04)"
                        : "white",
                      boxShadow: active ? `0 14px 28px ${theme.shadow}` : "none",
                    }}
                  >
                    {/* Row 1: order icon + category + XP badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 12,
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 900,
                            fontSize: 13,
                            color: "white",
                            flexShrink: 0,
                            background: active
                              ? `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`
                              : completion
                              ? "linear-gradient(135deg, #10b981, #059669)"
                              : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                          }}
                        >
                          {completion ? "✓" : lesson.order}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: active ? theme.dark : "#64748b", textTransform: "uppercase", letterSpacing: 0.8 }}>
                          {lesson.category}
                        </div>
                      </div>
                      {/* XP badge */}
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: completion ? "#047857" : theme.dark,
                          background: completion ? "rgba(16,185,129,0.12)" : theme.light,
                          padding: "3px 8px",
                          borderRadius: 999,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {completion ? `+${completion.xpEarned} XP` : "+20 XP"}
                      </div>
                    </div>

                    {/* Row 2: title */}
                    <div style={{ fontSize: 15, fontWeight: 900, color: SHELL.ink, marginBottom: 4, lineHeight: 1.3 }}>
                      {lesson.title}
                    </div>

                    {/* Row 3: summary (truncated) */}
                    <div
                      style={{
                        fontSize: 12,
                        lineHeight: 1.5,
                        color: SHELL.soft,
                        marginBottom: 6,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {lesson.summary}
                    </div>

                    {/* Row 4: stars */}
                    <div style={{ fontSize: 13 }}>
                      {stars > 0 ? (
                        <span>{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</span>
                      ) : (
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>☆☆☆ Earn stars</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Collapse / expand toggle */}
            {hiddenCount > 0 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                style={{
                  marginTop: 12,
                  width: "100%",
                  border: `1px dashed ${SHELL.line}`,
                  borderRadius: 14,
                  padding: "10px 16px",
                  cursor: "pointer",
                  background: "transparent",
                  color: SHELL.soft,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {showAll
                  ? "▲ Show fewer lessons"
                  : `▼ View all ${payload.lessons.length} lessons (+${hiddenCount} more)`}
              </button>
            )}
          </aside>

          {/* ── LESSON DETAIL PANEL ─────────────────────────────────────────── */}
          <section style={{ display: "grid", gap: 22, alignContent: "start" }}>
            {selectedLesson && (
              <>
                {/* Hero card */}
                <div
                  style={{
                    background: SHELL.surface,
                    borderRadius: 34,
                    border: `1px solid ${SHELL.line}`,
                    padding: 28,
                    boxShadow: "0 28px 58px rgba(59,130,246,0.08)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Background orbs */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        `radial-gradient(circle at 12% 16%, ${theme.glow}, transparent 18%), radial-gradient(circle at 82% 18%, rgba(59,130,246,0.16), transparent 20%), radial-gradient(circle at 82% 82%, rgba(16,185,129,0.14), transparent 18%)`,
                      pointerEvents: "none",
                    }}
                  />

                  <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 24, alignItems: "center" }}>
                    {/* Left: info */}
                    <div>
                      <div
                        style={{
                          display: "inline-flex",
                          padding: "8px 12px",
                          borderRadius: 999,
                          background: "rgba(59,130,246,0.10)",
                          color: "#1d4ed8",
                          fontWeight: 800,
                          fontSize: 12,
                          textTransform: "uppercase",
                          marginBottom: 14,
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        Selected lesson · {selectedLesson.id}
                        {selectedCompletion && (
                          <span style={{ color: "#047857", background: "rgba(16,185,129,0.15)", padding: "2px 8px", borderRadius: 999 }}>
                            {"⭐".repeat(selectedCompletion.starsEarned)} completed
                          </span>
                        )}
                      </div>

                      <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.06, margin: "0 0 14px", fontWeight: 900, letterSpacing: -1.4 }}>
                        {selectedLesson.title}
                      </h2>
                      <p style={{ fontSize: 18, lineHeight: 1.7, color: SHELL.soft, margin: "0 0 20px" }}>
                        {selectedLesson.summary}
                      </p>

                      <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                        {spotlight.map((item) => (
                          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: SHELL.ink, fontWeight: 700 }}>
                            <span
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 999,
                                display: "grid",
                                placeItems: "center",
                                background: "linear-gradient(135deg, #22c55e, #14b8a6)",
                                color: "white",
                                fontSize: 12,
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                        <button
                          onClick={() => selectedLesson.startUrl && router.push(selectedLesson.startUrl as string)}
                          style={{
                            border: "none",
                            cursor: "pointer",
                            padding: "14px 24px",
                            borderRadius: 18,
                            fontWeight: 900,
                            fontSize: 16,
                            color: "white",
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`,
                            boxShadow: `0 16px 32px ${theme.shadow}`,
                          }}
                        >
                          {selectedCompletion ? "🔁 Retry lesson" : "▶ Open lesson"}
                        </button>

                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "14px 18px",
                            borderRadius: 18,
                            background: "rgba(16,185,129,0.10)",
                            color: "#047857",
                            fontWeight: 800,
                          }}
                        >
                          {selectedLesson.durationMin} min · bite-sized
                        </div>

                        {/* Show earned XP if previously completed */}
                        {selectedCompletion && (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "14px 18px",
                              borderRadius: 18,
                              background: "rgba(251,191,36,0.15)",
                              color: "#92400e",
                              fontWeight: 800,
                            }}
                          >
                            +{selectedCompletion.xpEarned} XP · {selectedCompletion.accuracy}% acc
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: lesson image */}
                    <div
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.92))",
                        borderRadius: 30,
                        border: "1px solid rgba(23,32,51,0.06)",
                        padding: 20,
                        minHeight: 360,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {selectedLesson.image ? (
                        <img
                          src={
                            (selectedLesson.image as string).startsWith("/vaani")
                              ? selectedLesson.image
                              : `/vaani${selectedLesson.image}`
                          }
                          alt={selectedLesson.title}
                          style={{ width: "100%", maxHeight: 340, objectFit: "contain" }}
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            if (!t.src.includes("placeholder")) t.src = "/vaani/assets/gemini/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: 56, fontWeight: 900, color: theme.primary }}>अ</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                  {[
                    {
                      title: "Coach style",
                      text: "Friendly audio-led explanations with simple repetition.",
                      color: theme.primary,
                    },
                    {
                      title: "Learner action",
                      text: "Observe, trace, remember, then answer a quick check.",
                      color: SHELL.accentTwo,
                    },
                    {
                      title: "Launch value",
                      text: `Every ${payload.course.title.split(":")[0]} lesson points to a real public asset URL.`,
                      color: SHELL.accentThree,
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      style={{
                        background: SHELL.surface,
                        borderRadius: 24,
                        border: `1px solid ${SHELL.line}`,
                        padding: 22,
                        boxShadow: "0 14px 30px rgba(15,23,42,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 14,
                          display: "grid",
                          placeItems: "center",
                          background: `${card.color}18`,
                          color: card.color,
                          fontWeight: 900,
                          marginBottom: 12,
                        }}
                      >
                        ●
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{card.title}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: SHELL.soft }}>{card.text}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
