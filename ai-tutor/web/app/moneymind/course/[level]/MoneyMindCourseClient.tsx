"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MoneyMindCoursePayload } from "@/lib/moneymindCourseTypes";

function statusColor(status: string) {
  if (status === "completed") return { bg: "#DCFCE7", fg: "#166534", label: "Done" };
  if (status === "current") return { bg: "#FEE2E2", fg: "#B91C1C", label: "Current" };
  if (status === "available") return { bg: "#DBEAFE", fg: "#1D4ED8", label: "Open" };
  return { bg: "#E2E8F0", fg: "#475569", label: "Locked" };
}

export default function MoneyMindCourseClient({ payload, userId = 101 }: { payload: MoneyMindCoursePayload; userId?: number }) {
  const [selectedId, setSelectedId] = useState(payload.selectedLesson.id);
  const selectedLesson = useMemo(
    () => payload.lessons.find((lesson) => lesson.id === selectedId) ?? payload.lessons[0],
    [payload.lessons, selectedId],
  );
  
  const selectedPreview = useMemo(() => {
    if (selectedLesson.id === payload.selectedLesson.id) return payload.selectedLesson;
    
    return {
        ...payload.selectedLesson,
        id: selectedLesson.id,
        title: selectedLesson.title,
        category: selectedLesson.category,
        durationMin: selectedLesson.durationMin,
        difficulty: 1, // Default
        status: selectedLesson.status,
        summary: selectedLesson.summary,
        boardPreview: selectedLesson.boardPreview,
        outcomes: [
          `Master ${selectedLesson.title} principles.`,
          `Explore ${selectedLesson.skill} with interactive labs.`,
          `Earn MoneyMind XP and build real-world knowledge.`,
        ],
        startUrl: `/moneymind/learn/${payload.course.levelSlug}/${selectedLesson.id}`,
        resumeUrl: selectedLesson.status === "current" || selectedLesson.status === "completed"
          ? `/moneymind/learn/${payload.course.levelSlug}/${selectedLesson.id}`
          : undefined,
      };
  }, [selectedLesson, payload.selectedLesson]);

  return (
    <main style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, sans-serif" }}>
      <header style={{ background: "#065F46", color: "#F8FAFC", padding: "18px 24px", borderBottom: "1px solid #064E3B" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#A7F3D0", textTransform: "uppercase", letterSpacing: 1.2 }}>MoneyMind Masterclass</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{payload.course.title}</div>
            <div style={{ fontSize: 14, color: "#D1FAE5" }}>{payload.course.subtitle} · {payload.course.tagline}</div>
          </div>
          <Link href="/moneymind" style={{ color: "#F8FAFC", textDecoration: "none", fontWeight: 700 }}>Back to Levels</Link>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "320px minmax(0, 1fr)", gap: 0, minHeight: "calc(100vh - 92px)" }}>
        <aside style={{ borderRight: "1px solid #E2E8F0", background: "#FFFFFF", padding: 20 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>Lessons</div>
            <div style={{ height: 10, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
              <div style={{ width: `${payload.course.progressPct}%`, height: "100%", background: payload.course.color }} />
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 8 }}>{payload.course.completedLessons}/{payload.course.totalLessons} completed</div>
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
                    padding: 14,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 3 }}>Lesson {lesson.order}</div>
                      <div style={{ fontWeight: 700, lineHeight: 1.35 }}>{lesson.title}</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>{lesson.durationMin} min · {lesson.category}</div>
                    </div>
                    <span style={{ background: meta.bg, color: meta.fg, fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 999 }}>{meta.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section style={{ padding: 28, display: "grid", gap: 20, alignContent: "start" }}>
          <div style={{ background: `linear-gradient(135deg, ${payload.course.color}18, #FFFFFF)`, border: `1px solid ${payload.course.color}35`, borderRadius: 18, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: 1.1 }}>Selected Mission</div>
                <h1 style={{ margin: "8px 0 6px", fontSize: 30, lineHeight: 1.15 }}>{selectedPreview.title}</h1>
                <div style={{ color: "#065F46", fontWeight: 600 }}>Curriculum: {selectedPreview.category}</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href={selectedPreview.startUrl} style={{ background: payload.course.color, color: "#FFFFFF", textDecoration: "none", fontWeight: 800, padding: "12px 18px", borderRadius: 12 }}>Start Lesson</Link>
                {selectedPreview.resumeUrl ? (
                  <Link href={selectedPreview.resumeUrl} style={{ background: "#FFFFFF", color: "#0F172A", textDecoration: "none", fontWeight: 700, padding: "12px 18px", borderRadius: 12, border: "1px solid #CBD5E1" }}>Resume</Link>
                ) : null}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(300px, 0.9fr)", gap: 20 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24 }}>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>Mission Lab Preview</div>
              <div style={{ borderRadius: 16, background: "#F0FDF4", border: "1px solid #DCFCE7", minHeight: 320, display: "grid", placeItems: "center", overflow: "hidden" }}>
                {typeof selectedPreview.boardPreview.data.assetPath === "string" ? (
                  <div style={{ textAlign: "center", padding: 40 }}>
                     <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
                     <div style={{ fontWeight: 700 }}>{selectedPreview.title} Interactive Lab</div>
                     <div style={{ fontSize: 13, color: "#64748B", marginTop: 8 }}>High-fidelity simulator loaded for this module.</div>
                  </div>
                ) : (
                  <div style={{ color: "#64748B" }}>Preview available when lab asset is mapped.</div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24 }}>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>What This Mission Builds</div>
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

              <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24 }}>
                <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>Mission Meta</div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div><strong>Duration:</strong> {selectedPreview.durationMin} min</div>
                  <div><strong>Category:</strong> {selectedPreview.category}</div>
                  <div><strong>Status:</strong> {statusColor(selectedPreview.status).label}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
