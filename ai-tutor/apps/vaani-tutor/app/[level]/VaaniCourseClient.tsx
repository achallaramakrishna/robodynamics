"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getLevelStats,
  getProfileStats,
  getAllCompletions,
  type LessonCompletion,
} from "@/lib/vaaniGamification";
import { hydrateVaaniProgress } from "@/lib/vaaniProgressSync";

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

const LEVEL_SPOTLIGHTS: Record<number, string[]> = {
  1: [
    "Visual word anchors",
    "Finger tracing practice",
    "Flashcards and quick checks",
  ],
  2: [
    "Matra picture cards on every lesson",
    "See how the base letter changes its sound",
    "Practice with word-image memory hooks",
  ],
};

const ROADMAP_DEFAULT_VISIBLE = 8;

export default function VaaniCourseClient({ payload }: { payload: any }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(
    payload.selectedLesson?.id ?? payload.lessons[0]?.id ?? ""
  );
  const [showAll, setShowAll] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1280);

  // ── Derive level number from first lesson ID (e.g. "L3-C01-L01" → 3) ──────
  const levelNumber = useMemo<number>(() => {
    const id: string = payload.lessons[0]?.id ?? "";
    const match = id.match(/^L(\d+)-/);
    return match ? parseInt(match[1], 10) : 1;
  }, [payload.lessons]);

  const theme = LEVEL_THEMES[levelNumber] ?? DEFAULT_THEME;
  const spotlight = LEVEL_SPOTLIGHTS[levelNumber] ?? LEVEL_SPOTLIGHTS[1];
  const totalLessons: number = payload.course.totalLessons ?? payload.lessons.length;

  // ── Gamification state (client-side localStorage hydration) ──────────────
  type LevelStats = ReturnType<typeof getLevelStats>;
  type ProfileStats = ReturnType<typeof getProfileStats>;

  const [levelStats, setLevelStats] = useState<LevelStats | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [completionMap, setCompletionMap] = useState<Record<string, LessonCompletion>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      await hydrateVaaniProgress();
      if (cancelled) return;

      setLevelStats(getLevelStats(levelNumber));
      setProfileStats(getProfileStats());

      const map: Record<string, LessonCompletion> = {};
      for (const c of getAllCompletions()) {
        const prev = map[c.lessonId];
        if (!prev || c.starsEarned > prev.starsEarned) map[c.lessonId] = c;
      }
      setCompletionMap(map);
    };

    void loadProgress();

    return () => {
      cancelled = true;
    };
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
  const isPhone = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1100;
  const isCompact = viewportWidth < 1100;
  const levelLinks = [1, 2, 3, 4, 5, 6].map((n) => ({
    number: n,
    href: `/vaani/level-${n}`,
    active: n === levelNumber,
  }));
  const utilityCards = [
    {
      title: "Current focus",
      text: selectedLesson?.category ?? "Lesson roadmap",
      accent: theme.primary,
    },
    {
      title: "Next action",
      text: completedCount > 0 ? `Continue with ${nextLesson?.title ?? "the next lesson"}` : `Start Level ${levelNumber}`,
      accent: SHELL.accentTwo,
    },
    {
      title: "Lesson pace",
      text: `${selectedLesson?.durationMin ?? 6} min guided practice`,
      accent: SHELL.accentThree,
    },
    {
      title: "Reward target",
      text: levelStats?.nextBadgeName ? `Unlock ${levelStats.nextBadgeName}` : "Earn your first badge",
      accent: theme.dark,
    },
  ];
  const supportCards = [
    {
      title: "What you will practice",
      text: levelNumber === 2
        ? "See how a base consonant changes when the matra is added, then connect that sound to a real Hindi word."
        : "Observe the sound, connect it to the picture, then practice until recognition feels easy.",
      color: theme.primary,
    },
    {
      title: "Why this matters",
      text: levelNumber === 2
        ? "Matras unlock real Hindi reading. Once learners spot the sound shift, they can decode many more words confidently."
        : "This lesson builds one dependable reading pattern that makes the next lesson easier and faster.",
      color: SHELL.accentTwo,
    },
    {
      title: "Parent tip",
      text: "Ask the child to say the sound aloud once before tapping the lesson. That small pause improves recall and attention.",
      color: SHELL.accentThree,
    },
    {
      title: "Next reward",
      text: selectedCompletion
        ? `Best run so far: ${selectedCompletion.starsEarned} stars and ${selectedCompletion.xpEarned} XP.`
        : "Complete this lesson cleanly to collect stars, XP, and move closer to the next badge.",
      color: theme.dark,
    },
  ];

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
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: isPhone ? "22px 14px 36px" : isTablet ? "28px 18px 42px" : "34px 24px 48px" }}>

        {/* ── PAGE HEADER ───────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isPhone ? "stretch" : "flex-start",
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
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                marginTop: 18,
              }}
            >
              <a
                href="/vaani"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 14px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 800,
                  color: SHELL.soft,
                  background: "rgba(255,255,255,0.86)",
                  border: `1px solid ${SHELL.line}`,
                }}
              >
                All Levels
              </a>
              {levelLinks.map((level) => (
                <a
                  key={level.number}
                  href={level.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 92,
                    padding: "10px 14px",
                    borderRadius: 999,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 800,
                    color: level.active ? "white" : theme.dark,
                    background: level.active
                      ? `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`
                      : theme.light,
                    border: level.active ? "none" : `1px solid ${theme.primary}25`,
                    boxShadow: level.active ? `0 10px 24px ${theme.shadow}` : "none",
                  }}
                >
                  Level {level.number}
                </a>
              ))}
            </div>
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginBottom: 22,
          }}
        >
          {utilityCards.map((card) => (
            <div
              key={card.title}
              style={{
                background: "rgba(255,255,255,0.72)",
                borderRadius: 22,
                border: `1px solid ${SHELL.line}`,
                padding: "16px 18px",
                boxShadow: "0 14px 28px rgba(15,23,42,0.05)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: card.accent, marginBottom: 8 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: SHELL.ink, fontWeight: 700 }}>
                {card.text}
              </div>
            </div>
          ))}
        </div>

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
        <div style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "360px 1fr", gap: isPhone ? 18 : 24 }}>

          {/* ── ROADMAP SIDEBAR ─────────────────────────────────────────────── */}
          <aside
            style={{
              background: SHELL.surface,
              borderRadius: 30,
              border: `1px solid ${SHELL.line}`,
              padding: isPhone ? 16 : 22,
              boxShadow: "0 24px 52px rgba(15,23,42,0.08)",
              height: "fit-content",
              order: isCompact ? 2 : 1,
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
                const showThumbnail = levelNumber === 2 && Boolean(lesson.image);

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

                    {showThumbnail && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "64px 1fr",
                          gap: 10,
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            overflow: "hidden",
                            background: "rgba(255,255,255,0.9)",
                            border: `1px solid ${SHELL.line}`,
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={(lesson.image as string).startsWith("/vaani") ? lesson.image : `/vaani${lesson.image}`}
                            alt={lesson.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              const t = e.target as HTMLImageElement;
                              if (!t.src.includes("placeholder")) t.src = "/vaani/assets/gemini/placeholder.svg";
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: 28,
                            fontWeight: 900,
                            color: theme.primary,
                            lineHeight: 1,
                            justifySelf: "start",
                          }}
                        >
                          {lesson.modifiedChar ?? lesson.title?.split(" - ")[0] ?? "का"}
                        </div>
                      </div>
                    )}

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
          <section style={{ display: "grid", gap: 22, alignContent: "start", order: isCompact ? 1 : 2 }}>
            {selectedLesson && (
              <>
                {/* Hero card */}
                <div
                  style={{
                    background: SHELL.surface,
                    borderRadius: 34,
                    border: `1px solid ${SHELL.line}`,
                    padding: isPhone ? 18 : isTablet ? 22 : 28,
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

                  <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: isCompact ? "1fr" : "1.05fr 0.95fr", gap: isPhone ? 18 : 24, alignItems: "start" }}>
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

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                        {[
                          selectedLesson.category,
                          selectedLesson.durationMin ? `${selectedLesson.durationMin} min practice` : null,
                          selectedCompletion ? `${selectedCompletion.starsEarned} stars earned` : "Stars available",
                          levelNumber === 2 && selectedLesson.wordHindi ? `Word: ${selectedLesson.wordHindi}` : null,
                        ]
                          .filter(Boolean)
                          .map((chip) => (
                            <div
                              key={String(chip)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                borderRadius: 999,
                                padding: "8px 12px",
                                background: "rgba(255,255,255,0.8)",
                                border: `1px solid ${SHELL.line}`,
                                color: SHELL.soft,
                                fontSize: 12,
                                fontWeight: 800,
                              }}
                            >
                              {chip}
                            </div>
                          ))}
                      </div>

                      {levelNumber === 2 && (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "12px 16px",
                            borderRadius: 18,
                            background: "rgba(255,255,255,0.78)",
                            border: `1px solid ${SHELL.line}`,
                            marginBottom: 20,
                            fontWeight: 900,
                            color: theme.dark,
                            flexWrap: "wrap",
                          }}
                        >
                          <span style={{ fontSize: 22 }}>{selectedLesson.baseChar ?? "क"}</span>
                          <span style={{ fontSize: 18, color: SHELL.soft }}>+</span>
                          <span style={{ fontSize: 22 }}>{selectedLesson.matra ?? "ा"}</span>
                          <span style={{ fontSize: 18, color: SHELL.soft }}>=</span>
                          <span style={{ fontSize: 28, color: theme.primary }}>{selectedLesson.modifiedChar ?? "का"}</span>
                          {selectedLesson.wordHindi && (
                            <span style={{ fontSize: 14, color: SHELL.soft, fontWeight: 700 }}>
                              · {selectedLesson.wordHindi}
                            </span>
                          )}
                        </div>
                      )}

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
                            width: isPhone ? "100%" : undefined,
                            justifyContent: "center",
                            display: "inline-flex",
                            alignItems: "center",
                            padding: isPhone ? "14px 18px" : "14px 24px",
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
                  {supportCards.map((card) => (
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
