"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { MindSutraCoursePayload } from "@/lib/mindsutraCourseTypes";
import { MindSutraBrandHeader } from "@/components/mindsutra/BrandChrome";

function statusColor(status: string) {
  if (status === "completed") return { bg: "#DCFCE7", fg: "#166534", label: "Done" };
  if (status === "current") return { bg: "#FEE2E2", fg: "#B91C1C", label: "Current" };
  if (status === "available") return { bg: "#DBEAFE", fg: "#1D4ED8", label: "Open" };
  return { bg: "#E2E8F0", fg: "#475569", label: "Locked" };
}

const PREVIEW_ASSET_VERSION = "20260514-preview-text-wrap";

export default function MindSutraCourseClient({ payload }: { payload: MindSutraCoursePayload }) {
  const [selectedId, setSelectedId] = useState(payload.selectedLesson.id);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const selectedLesson = useMemo(
    () => payload.lessons.find((lesson) => lesson.id === selectedId) ?? payload.lessons[0],
    [payload.lessons, selectedId],
  );
  const isTabletOrSmaller = viewportWidth < 1024;
  const isPhone = viewportWidth < 720;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);
  const selectedPreview = selectedLesson.id === payload.selectedLesson.id
    ? payload.selectedLesson
    : {
        ...payload.selectedLesson,
        id: selectedLesson.id,
        title: selectedLesson.title,
        sutra: selectedLesson.sutra,
        durationMin: selectedLesson.durationMin,
        difficulty: selectedLesson.difficulty,
        status: selectedLesson.status,
        summary: selectedLesson.summary,
        boardPreview: selectedLesson.boardPreview,
        outcomes: [
          `Practice ${selectedLesson.skills[0].toLowerCase()}.`,
          `Apply ${selectedLesson.sutra} with guided examples.`,
          `Build accuracy before the next lesson unlocks.`,
        ],
        startUrl: `/mindsutra/course/${payload.course.levelSlug}/lesson/${selectedLesson.id}`,
        resumeUrl: selectedLesson.status === "current" || selectedLesson.status === "completed"
          ? `/mindsutra/course/${payload.course.levelSlug}/lesson/${selectedLesson.id}?resume=1`
          : undefined,
      };

  return (
    <main style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, sans-serif" }}>
      <MindSutraBrandHeader 
        title={payload.course.title}
        subtitle={`${payload.course.subtitle} · ${payload.course.tagline}`}
        xp={payload.course.earnedXp}
        streak={payload.course.streak}
        achievements={payload.course.achievements}
        progressPct={payload.course.progressPct}
      />

      <section style={{ display: "grid", gridTemplateColumns: isTabletOrSmaller ? "1fr" : "320px minmax(0, 1fr)", gap: 0, minHeight: "calc(100vh - 92px)" }}>
        <aside style={{ borderRight: isTabletOrSmaller ? "none" : "1px solid #E2E8F0", borderBottom: isTabletOrSmaller ? "1px solid #E2E8F0" : "none", background: "#FFFFFF", padding: isPhone ? 16 : 20 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>Lessons</div>
            <div style={{ height: 10, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
              <div style={{ width: `${payload.course.progressPct}%`, height: "100%", background: payload.course.color }} />
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 8 }}>{payload.course.completedLessons}/{payload.course.totalLessons} completed</div>
            <div style={{ fontSize: 12, color: "#0F172A", marginTop: 6, fontWeight: 700 }}>
              {payload.course.earnedXp} XP earned
              <span style={{ color: "#64748B", fontWeight: 500 }}> of {payload.course.totalXpAvailable} XP</span>
            </div>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {payload.lessons.map((lesson) => {
              const meta = statusColor(lesson.status);
              const active = lesson.id === selectedId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedId(lesson.id)}
                  style={{
                    textAlign: "left",
                    border: active ? `2px solid ${payload.course.color}` : "1px solid #E2E8F0",
                    background: active ? `${payload.course.color}10` : "#FFFFFF",
                    borderRadius: 14,
                    padding: isPhone ? 12 : 14,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 3 }}>Lesson {lesson.order}</div>
                      <div style={{ fontWeight: 700, lineHeight: 1.35 }}>{lesson.title}</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>{lesson.durationMin} min · {lesson.sutra}</div>
                    </div>
                    <span style={{ background: meta.bg, color: meta.fg, fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 999 }}>{meta.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section style={{ padding: isPhone ? 16 : isTabletOrSmaller ? 20 : 28, display: "grid", gap: isPhone ? 16 : 20, alignContent: "start" }}>
          <div style={{ background: `linear-gradient(135deg, ${payload.course.color}18, #FFFFFF)`, border: `1px solid ${payload.course.color}35`, borderRadius: 18, padding: isPhone ? 18 : 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.1 }}>Selected Lesson</div>
                <h1 style={{ margin: "8px 0 6px", fontSize: isPhone ? 24 : 30, lineHeight: 1.15 }}>{selectedPreview.title}</h1>
                <div style={{ color: "#475569", fontWeight: 600 }}>{selectedPreview.sutra}</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: isPhone ? "100%" : "auto" }}>
                <Link href={selectedPreview.startUrl} style={{ background: payload.course.color, color: "#FFFFFF", textDecoration: "none", fontWeight: 800, padding: "12px 18px", borderRadius: 12, flex: isPhone ? "1 1 100%" : undefined, textAlign: "center" }}>Start Lesson</Link>
                {selectedPreview.resumeUrl ? (
                  <Link href={selectedPreview.resumeUrl} style={{ background: "#FFFFFF", color: "#0F172A", textDecoration: "none", fontWeight: 700, padding: "12px 18px", borderRadius: 12, border: "1px solid #CBD5E1", flex: isPhone ? "1 1 100%" : undefined, textAlign: "center" }}>Resume</Link>
                ) : null}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isTabletOrSmaller ? "1fr" : "minmax(0, 1.3fr) minmax(300px, 0.9fr)", gap: isPhone ? 16 : 20 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: isPhone ? 18 : 24 }}>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>Lesson Board Preview</div>
              <div style={{ borderRadius: 16, background: "#F8FAFC", border: "1px solid #E2E8F0", minHeight: isPhone ? 220 : 320, display: "grid", placeItems: "center", overflow: "hidden", padding: isPhone ? 12 : 0 }}>
                {typeof selectedPreview.boardPreview.data.assetPath === "string" ? (
                  <img
                    src={`${selectedPreview.boardPreview.data.assetPath}?v=${PREVIEW_ASSET_VERSION}`}
                    alt={selectedPreview.title}
                    style={{ maxWidth: "100%", maxHeight: isPhone ? 220 : 300, objectFit: "contain" }}
                  />
                ) : (
                  <div style={{ color: "#64748B" }}>Preview available when board asset is mapped.</div>
                )}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "#64748B" }}>
                Source asset: {String(selectedPreview.boardPreview.data.assetSource ?? "mapped from docs/vedic_math_assets")}
              </div>
            </div>

            <div style={{ display: "grid", gap: isPhone ? 16 : 20 }}>
              <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: isPhone ? 18 : 24 }}>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>What This Lesson Builds</div>
                <p style={{ margin: 0, lineHeight: 1.7, color: "#334155" }}>{selectedPreview.summary}</p>
                <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                  {selectedPreview.outcomes.map((item) => (
                    <div key={item} style={{ display: "flex", gap: 10, alignItems: "start", lineHeight: 1.5 }}>
                      <span style={{ color: payload.course.color, fontWeight: 900 }}>•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: isPhone ? 18 : 24 }}>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>Lesson Meta</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div><strong>Duration:</strong> {selectedPreview.durationMin} min</div>
                  <div><strong>Difficulty:</strong> {selectedPreview.difficulty}/5</div>
                  <div><strong>Status:</strong> {statusColor(selectedPreview.status).label}</div>
                  <div><strong>Level XP:</strong> {payload.course.earnedXp}/{payload.course.totalXpAvailable}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
