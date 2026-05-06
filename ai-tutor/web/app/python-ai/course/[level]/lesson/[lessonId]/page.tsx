import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import VidyaInteractiveLesson from "./VidyaInteractiveLesson";
import {
  findPythonChapterById,
  findPythonTierForChapter,
  getTierSlugForChapter,
} from "@/app/python-ai/vidyaCatalog";
import { VIDYA_LESSON_BLUEPRINTS } from "@/app/python-ai/vidyaLessonBlueprints";

const STATUS_COPY = {
  live: { label: "Live Runtime", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
  mapped: { label: "Mapped Lesson", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  planned: { label: "Blueprint", color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
} as const;

export default function VidyaLessonPage({
  params,
}: {
  params: { level: string; lessonId: string };
}) {
  const chapter = findPythonChapterById(params.lessonId);
  if (!chapter) notFound();

  if (chapter.deliveryStatus === "live" && chapter.launchUrl) {
    redirect(chapter.launchUrl);
  }

  const tier = findPythonTierForChapter(chapter.id);
  if (!tier) notFound();

  const tierSlug = getTierSlugForChapter(chapter.id);
  const blueprint = VIDYA_LESSON_BLUEPRINTS[chapter.id];
  if (!blueprint) notFound();

  if (chapter.id === "PY_L2_05_DATA") {
    return <VidyaInteractiveLesson chapter={chapter} tier={tier} tierSlug={tierSlug} />;
  }

  const status = STATUS_COPY[chapter.deliveryStatus];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.15), transparent 24%), radial-gradient(circle at top right, rgba(245,158,11,0.14), transparent 22%), linear-gradient(180deg, #020617 0%, #07111f 52%, #030712 100%)",
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
          borderBottom: `1px solid ${tier.color}24`,
        }}
      >
        <div
          style={{
            maxWidth: 1480,
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
            <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
              Vidya Elite Academy
            </div>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 24 }}>{chapter.displayCode}: {chapter.title}</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href={`/python-ai/course/${tierSlug}`}
              style={{
                textDecoration: "none",
                color: "#E2E8F0",
                fontWeight: 800,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              Back to Tier
            </Link>
            <Link
              href="/python-ai/editor"
              style={{
                textDecoration: "none",
                color: "#FFFFFF",
                fontWeight: 800,
                padding: "10px 14px",
                borderRadius: 999,
                background: tier.color,
              }}
            >
              Practice Lab
            </Link>
          </div>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: "28px 24px 56px",
          display: "grid",
          gridTemplateColumns: "340px minmax(0, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <aside style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              borderRadius: 28,
              padding: 24,
              background: `linear-gradient(180deg, ${tier.color}18, rgba(2,6,23,0.9))`,
              border: `1px solid ${tier.color}28`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${tier.color}, #0F172A)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontWeight: 900,
                  fontSize: 28,
                  boxShadow: `0 12px 30px ${tier.color}33`,
                }}
              >
                V
              </div>
              <div>
                <div style={{ fontSize: 12, color: tier.color, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.1 }}>
                  Mentor
                </div>
                <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 24 }}>Vidya</div>
                <div style={{ color: "#94A3B8", fontWeight: 700, fontSize: 13 }}>Architecture Coach</div>
              </div>
            </div>
            <div style={{ color: "#CBD5E1", lineHeight: 1.7, fontSize: 15 }}>
              {blueprint.mentorLine}
            </div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              background: "rgba(15,23,42,0.76)",
              border: "1px solid rgba(148,163,184,0.12)",
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <span style={{ borderRadius: 999, padding: "6px 10px", background: `${tier.color}20`, color: tier.color, fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>
                {tier.level}
              </span>
              <span style={{ borderRadius: 999, padding: "6px 10px", background: status.bg, color: status.color, fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>
                {status.label}
              </span>
            </div>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 18, lineHeight: 1.35, marginBottom: 10 }}>
              Mission
            </div>
            <div style={{ color: "#CBD5E1", lineHeight: 1.7 }}>{blueprint.mission}</div>
          </div>

          <div
            style={{
              borderRadius: 24,
              padding: 22,
              background: "rgba(15,23,42,0.76)",
              border: "1px solid rgba(148,163,184,0.12)",
            }}
          >
            <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>
              Architecture Focus
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {blueprint.architectureFocus.map((item) => (
                <div key={item} style={{ display: "flex", gap: 10, alignItems: "start" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: tier.color, marginTop: 8 }} />
                  <div style={{ color: "#CBD5E1", lineHeight: 1.6 }}>{item}</div>
                </div>
              ))}
            </div>
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
            <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "start" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>
                  Why This Matters
                </div>
                <h1 style={{ margin: "0 0 12px", fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.02, fontWeight: 900 }}>
                  {chapter.displayCode}: {chapter.title}
                </h1>
                <p style={{ margin: "0 0 16px", color: "#CBD5E1", fontSize: 18, lineHeight: 1.7 }}>
                  {blueprint.whyItMatters}
                </p>
                <div style={{ color: "#94A3B8", lineHeight: 1.7 }}>
                  Tier milestone: {tier.terminalMilestone}
                </div>
              </div>
              <div
                style={{
                  minWidth: 220,
                  borderRadius: 20,
                  padding: 18,
                  background: "rgba(2,6,23,0.72)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <div style={{ color: "#94A3B8", fontSize: 12, textTransform: "uppercase", fontWeight: 900, marginBottom: 6 }}>
                  Practical Lab
                </div>
                <div style={{ color: "#F8FAFC", fontSize: 28, fontWeight: 900 }}>{chapter.durationMinutes} min</div>
                <div style={{ color: "#CBD5E1", lineHeight: 1.6, marginTop: 8 }}>{chapter.description}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(340px, 0.95fr)", gap: 24 }}>
            <div
              style={{
                borderRadius: 28,
                padding: 28,
                background: "rgba(15,23,42,0.76)",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 14 }}>
                Lesson Walkthrough
              </div>
              <div style={{ display: "grid", gap: 16 }}>
                {blueprint.walkthrough.map((step, index) => (
                  <div key={step.title} style={{ display: "grid", gridTemplateColumns: "40px minmax(0, 1fr)", gap: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        background: `${tier.color}22`,
                        color: tier.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{step.title}</div>
                      <div style={{ color: "#CBD5E1", lineHeight: 1.7 }}>{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 24 }}>
              <div
                style={{
                  borderRadius: 28,
                  padding: 24,
                  background: "rgba(15,23,42,0.76)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
                  Capstone Challenge
                </div>
                <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 22, lineHeight: 1.25, marginBottom: 10 }}>
                  {blueprint.challenge.title}
                </div>
                <div style={{ color: "#CBD5E1", lineHeight: 1.7, marginBottom: 18 }}>{blueprint.challenge.prompt}</div>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    borderRadius: 20,
                    padding: 18,
                    background: "#020617",
                    border: "1px solid #1E293B",
                    color: "#A5B4FC",
                    fontSize: 15,
                    lineHeight: 1.65,
                    fontFamily: "'Cascadia Code', 'Fira Code', monospace",
                  }}
                >
                  {blueprint.challenge.starter}
                </pre>
                <div style={{ marginTop: 14, color: "#94A3B8", lineHeight: 1.7 }}>
                  Success signal: {blueprint.challenge.successSignal}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 28,
                  padding: 24,
                  background: "rgba(15,23,42,0.76)",
                  border: "1px solid rgba(148,163,184,0.12)",
                }}
              >
                <div style={{ color: tier.color, fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
                  Deliverable
                </div>
                <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 18, lineHeight: 1.45, marginBottom: 10 }}>
                  {blueprint.deliverable}
                </div>
                <div style={{ color: "#94A3B8", lineHeight: 1.7 }}>
                  Next move: {blueprint.nextMove}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
