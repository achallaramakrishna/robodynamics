"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const SHELL = {
  ink: "#1a2438",
  soft: "#596579",
  line: "rgba(26,36,56,0.08)",
  surface: "rgba(255,255,255,0.86)",
  accent: "#f97316",
  accentTwo: "#3b82f6",
  accentThree: "#10b981",
};

const spotlight = [
  "Visual word anchors",
  "Finger tracing practice",
  "Flashcards and quick checks",
];

function withKaveriBasePath(src?: string | null) {
  if (!src) return undefined;
  if (src.startsWith("/kaveri")) return src;
  if (src.startsWith("/")) return `/kaveri${src}`;
  return `/kaveri/${src}`;
}

export default function KaveriCourseClient({ payload }: { payload: any }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(payload.selectedLesson?.id || payload.lessons[0]?.id);

  const selectedLesson = useMemo(
    () => payload.lessons.find((lesson: any) => lesson.id === selectedId) || payload.selectedLesson,
    [payload.lessons, payload.selectedLesson, selectedId],
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 28%), radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 26%), linear-gradient(180deg, #fffaf3 0%, #ffffff 48%, #f6fbff 100%)",
        color: SHELL.ink,
        fontFamily: "'Outfit', 'Trebuchet MS', sans-serif",
      }}
    >
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "34px 24px 48px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#c2410c", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Public Level Launch
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(30px, 5vw, 54px)", lineHeight: 1.02, fontWeight: 900, letterSpacing: -1.8 }}>
              {payload.course.title}
            </h1>
            <p style={{ margin: "10px 0 0", color: SHELL.soft, fontSize: 18, maxWidth: 760, lineHeight: 1.65 }}>
              {payload.course.subtitle}. {payload.course.tagline}.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 18,
                background: "rgba(249,115,22,0.10)",
                color: "#c2410c",
                fontWeight: 800,
              }}
            >
              {payload.course.totalLessons} lessons
            </div>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 18,
                background: "rgba(16,185,129,0.10)",
                color: "#047857",
                fontWeight: 800,
              }}
            >
              Tracing + memory practice
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>
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
            <div style={{ display: "grid", gap: 12, maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>
              {payload.lessons.map((lesson: any) => {
                const active = lesson.id === selectedId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedId(lesson.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 20,
                      padding: 16,
                      cursor: "pointer",
                      border: active ? "2px solid rgba(249,115,22,0.34)" : `1px solid ${SHELL.line}`,
                      background: active ? "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(251,191,36,0.10))" : "white",
                      boxShadow: active ? "0 18px 34px rgba(249,115,22,0.10)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 8 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 14,
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 900,
                          color: "white",
                          background: active ? "linear-gradient(135deg, #f97316, #ef4444)" : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        }}
                      >
                        {lesson.order}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: active ? "#c2410c" : "#64748b", textTransform: "uppercase" }}>
                        {lesson.category}
                      </div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: SHELL.ink, marginBottom: 6 }}>{lesson.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.55, color: SHELL.soft }}>{lesson.summary}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section style={{ display: "grid", gap: 22 }}>
            {selectedLesson && (
              <>
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
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at 12% 16%, rgba(249,115,22,0.18), transparent 18%), radial-gradient(circle at 82% 18%, rgba(59,130,246,0.16), transparent 20%), radial-gradient(circle at 82% 82%, rgba(16,185,129,0.14), transparent 18%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 24, alignItems: "center" }}>
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
                        }}
                      >
                        Active lesson · {selectedLesson.id}
                      </div>
                      <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.02, margin: "0 0 14px", fontWeight: 900, letterSpacing: -1.8 }}>
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
                              }}
                            >
                              ✓
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        <button
                          onClick={() => {
                            if (selectedLesson.startUrl) router.push(selectedLesson.startUrl);
                          }}
                          style={{
                            border: "none",
                            cursor: "pointer",
                            padding: "16px 24px",
                            borderRadius: 18,
                            fontWeight: 900,
                            color: "white",
                            background: "linear-gradient(135deg, #f97316, #ef4444)",
                            boxShadow: "0 18px 34px rgba(249,115,22,0.24)",
                          }}
                        >
                          Open lesson
                        </button>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "16px 18px",
                            borderRadius: 18,
                            background: "rgba(16,185,129,0.10)",
                            color: "#047857",
                            fontWeight: 800,
                          }}
                        >
                          {selectedLesson.durationMin} min · bite-sized
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.92))",
                        borderRadius: 30,
                        border: "1px solid rgba(23,32,51,0.06)",
                        padding: 20,
                        minHeight: 380,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {selectedLesson.image ? (
                        <img
                          src={withKaveriBasePath(selectedLesson.image)}
                          alt={selectedLesson.title}
                          style={{ width: "100%", maxHeight: 360, objectFit: "contain" }}
                        />
                      ) : (
                        <div style={{ fontSize: 48, fontWeight: 900, color: SHELL.accent }}>अ</div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                  {[
                    {
                      title: "Coach style",
                      text: "Friendly audio-led explanations with simple repetition.",
                      color: SHELL.accent,
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
