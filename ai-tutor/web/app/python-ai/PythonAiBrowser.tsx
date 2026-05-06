"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { VIDYA_CATALOG, type PythonChapter, type PythonCurriculumTier } from "./vidyaCatalog";

type LevelSlug = "core" | "fullstack" | "datascience" | "aielite";

const LEVEL_SLUG_TO_INDEX: Record<LevelSlug, number> = {
  core: 0,
  fullstack: 1,
  datascience: 2,
  aielite: 3,
};

const LEVEL_LABEL: Record<LevelSlug, string> = {
  core: "Tier 1",
  fullstack: "Tier 2",
  datascience: "Tier 3",
  aielite: "Tier 4",
};

const STATUS_COPY = {
  live: { label: "Live", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  mapped: { label: "Mapped", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  planned: { label: "Planned", color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
} as const;

const CHAPTER_PREVIEWS: Record<string, string> = {
  PY_L1_01_SETUP: `import sys
name = input("Architect Identity: ")
print(f"Runtime: {sys.version_info.major}.{sys.version_info.minor}")
print(f"Welcome, {name}")`,
  PY_L1_02_DATA: `score = int(input("Score: "))
if score >= 90:
    print("Elite Track")
else:
    print("Re-run simulation")`,
  PY_L1_03_CONTROL: `def clean_names(items):
    return [item.strip().title() for item in items if item.strip()]`,
  PY_L2_05_DATA: `import requests
response = requests.get(API_URL, headers=AUTH_HEADERS, timeout=20)
payload = response.json()`,
  PY_L2_09_SQL: `cursor.execute(
    "SELECT id, email FROM learners WHERE cohort = %s",
    (cohort,)
)`,
  PY_L2_10_FLASK: `@app.get("/health")
def health():
    return {"status": "ok", "service": "vidya-api"}`,
  PY_L2_08_NUMPY: `import numpy as np
growth = np.array([12, 18, 21])
forecast = growth * 1.08`,
  PY_L2_02_PANDAS: `summary = (
    df.dropna(subset=["revenue"])
      .groupby("region")["revenue"]
      .mean()
)`,
  PY_L3_01_DL: `for epoch in range(epochs):
    optimizer.zero_grad()
    loss = model(batch_x, batch_y)
    loss.backward()
    optimizer.step()`,
  PY_L3_02_NLP: `chunks = splitter.split_documents(docs)
vectors = embedder.embed_documents(chunks)
retriever = store.as_retriever()`,
};

function normalizeLevelSlug(raw: string | undefined): LevelSlug {
  const cleaned = String(raw ?? "").trim().toLowerCase();
  if (cleaned === "1" || cleaned === "level-1" || cleaned === "beginner" || cleaned === "core") return "core";
  if (cleaned === "2" || cleaned === "level-2" || cleaned === "intermediate" || cleaned === "fullstack") return "fullstack";
  if (cleaned === "3" || cleaned === "level-3" || cleaned === "advanced" || cleaned === "datascience") return "datascience";
  if (cleaned === "4" || cleaned === "level-4" || cleaned === "elite" || cleaned === "aielite") return "aielite";
  return "core";
}

function getTier(levelSlug: LevelSlug): PythonCurriculumTier {
  return VIDYA_CATALOG[LEVEL_SLUG_TO_INDEX[levelSlug]] ?? VIDYA_CATALOG[0];
}

export default function PythonAiBrowser({
  levelSlug: rawLevelSlug,
  initialChapterId,
}: {
  levelSlug: string;
  initialChapterId?: string;
}) {
  const levelSlug = normalizeLevelSlug(rawLevelSlug);
  const tier = getTier(levelSlug);
  const defaultChapterId = tier.chapters.find((chapter) => chapter.id === initialChapterId || chapter.displayCode === initialChapterId)?.id ?? tier.chapters[0]?.id ?? "";
  const [selectedChapterId, setSelectedChapterId] = useState(defaultChapterId);

  const selectedChapter = useMemo<PythonChapter | undefined>(
    () => tier.chapters.find((chapter) => chapter.id === selectedChapterId) ?? tier.chapters[0],
    [selectedChapterId, tier.chapters],
  );

  const status = selectedChapter ? STATUS_COPY[selectedChapter.deliveryStatus] : STATUS_COPY.planned;
  const startUrl = selectedChapter?.launchUrl ?? "";
  const preview = selectedChapter ? CHAPTER_PREVIEWS[selectedChapter.id] : "";
  const ctaLabel =
    selectedChapter?.deliveryStatus === "live"
      ? "Start Live Lesson"
      : selectedChapter?.deliveryStatus === "mapped"
        ? "Open Lesson Workspace"
        : "Open Blueprint";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 24%), linear-gradient(180deg, #020617 0%, #07111f 52%, #030712 100%)",
        color: "#E2E8F0",
        fontFamily: "'Segoe UI', 'Inter', sans-serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(20px)",
          background: "rgba(2,6,23,0.82)",
          borderBottom: `1px solid ${tier.color}30`,
        }}
      >
        <div
          style={{
            maxWidth: 1500,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 4 }}>
              Vidya Elite Academy
            </div>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 24 }}>{tier.name}</div>
          </div>

          <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {Object.keys(LEVEL_LABEL).map((key) => {
              const slug = key as LevelSlug;
              const active = slug === levelSlug;
              return (
                <Link
                  key={slug}
                  href={`/python-ai/course/${slug}`}
                  style={{
                    textDecoration: "none",
                    color: active ? tier.color : "#CBD5E1",
                    fontWeight: 800,
                    fontSize: 14,
                    borderBottom: active ? `2px solid ${tier.color}` : "2px solid transparent",
                    paddingBottom: 4,
                  }}
                >
                  {LEVEL_LABEL[slug]}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          padding: "28px 24px 56px",
          display: "grid",
          gridTemplateColumns: "360px minmax(0, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <aside style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              borderRadius: 28,
              padding: 24,
              background: `linear-gradient(180deg, ${tier.color}18, rgba(2,6,23,0.88))`,
              border: `1px solid ${tier.color}26`,
            }}
          >
            <div style={{ fontSize: 12, color: tier.color, fontWeight: 900, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 10 }}>
              Tier Overview
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.7, color: "#CBD5E1" }}>{tier.tagline}</div>
            <div style={{ marginTop: 16, color: "#94A3B8", fontSize: 14, lineHeight: 1.6 }}>{tier.projectFocus}</div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {tier.chapters.map((chapter, index) => {
              const active = chapter.id === selectedChapterId;
              const chapterStatus = STATUS_COPY[chapter.deliveryStatus];
              return (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapterId(chapter.id)}
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: 20,
                    padding: 16,
                    background: active ? `${tier.color}14` : "rgba(15,23,42,0.72)",
                    color: "#E2E8F0",
                    border: active ? `1px solid ${tier.color}` : "1px solid rgba(148,163,184,0.12)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: active ? tier.color : "#94A3B8", marginBottom: 6 }}>
                        {chapter.displayCode} · Module {index + 1}
                      </div>
                      <div style={{ fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>{chapter.title}</div>
                      <div style={{ color: "#64748B", fontSize: 12, fontWeight: 700 }}>{chapter.durationMinutes} min practical lab</div>
                    </div>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        borderRadius: 999,
                        padding: "5px 9px",
                        background: chapterStatus.bg,
                        color: chapterStatus.color,
                        fontSize: 10,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {chapterStatus.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section style={{ display: "grid", gap: 24 }}>
          <div
            style={{
              borderRadius: 30,
              padding: 30,
              background: "linear-gradient(135deg, rgba(15,23,42,0.94), rgba(15,23,42,0.76))",
              border: `1px solid ${tier.color}24`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "start" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  <span style={{ borderRadius: 999, padding: "6px 10px", background: `${tier.color}20`, color: tier.color, fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>
                    {tier.level}
                  </span>
                  <span style={{ borderRadius: 999, padding: "6px 10px", background: status.bg, color: status.color, fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>
                    {status.label}
                  </span>
                </div>
                <h1 style={{ margin: "0 0 12px", fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.02, fontWeight: 900 }}>
                  {selectedChapter ? `${selectedChapter.displayCode}: ${selectedChapter.title}` : tier.name}
                </h1>
                <p style={{ margin: "0 0 16px", color: "#CBD5E1", fontSize: 18, lineHeight: 1.7 }}>
                  {selectedChapter?.description}
                </p>
                <div style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.7 }}>
                  Target milestone: {tier.terminalMilestone}
                </div>
              </div>

              {startUrl ? (
                <Link
                  href={startUrl}
                  style={{
                    textDecoration: "none",
                    background: tier.color,
                    color: "#FFFFFF",
                    padding: "16px 24px",
                    borderRadius: 16,
                    fontWeight: 900,
                    alignSelf: "center",
                  }}
                >
                  {ctaLabel}
                </Link>
              ) : (
                <div
                  style={{
                    borderRadius: 16,
                    padding: "16px 20px",
                    background: "rgba(148,163,184,0.08)",
                    border: "1px solid rgba(148,163,184,0.12)",
                    color: "#CBD5E1",
                    fontWeight: 800,
                  }}
                >
                  {selectedChapter?.deliveryStatus === "mapped" ? "Mapped into production queue" : "Blueprint tier pending build"}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)", gap: 24 }}>
            <div
              style={{
                borderRadius: 28,
                padding: 28,
                background: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>
                Live Preview
              </div>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  borderRadius: 20,
                  padding: 22,
                  background: "#020617",
                  border: "1px solid #1E293B",
                  color: "#A5B4FC",
                  fontSize: 17,
                  lineHeight: 1.65,
                  fontFamily: "'Cascadia Code', 'Fira Code', monospace",
                }}
              >
                {preview || "# Runtime preview will appear here as each academy module goes live."}
              </pre>
            </div>

            <div style={{ display: "grid", gap: 24 }}>
              <div
                style={{
                  borderRadius: 28,
                  padding: 24,
                  background: "rgba(15,23,42,0.72)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>
                  Skills to Master
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {selectedChapter?.topics.map((topic) => (
                    <div key={topic} style={{ display: "flex", gap: 10, alignItems: "start" }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: tier.color, marginTop: 8 }} />
                      <div style={{ color: "#CBD5E1", lineHeight: 1.6 }}>{topic}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 28,
                  padding: 24,
                  background: "rgba(15,23,42,0.72)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>
                  Career Signal
                </div>
                <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, lineHeight: 1.45, marginBottom: 10 }}>
                  {tier.competitionGoal}
                </div>
                <div style={{ color: "#94A3B8", lineHeight: 1.65 }}>{tier.targetAudience}</div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
