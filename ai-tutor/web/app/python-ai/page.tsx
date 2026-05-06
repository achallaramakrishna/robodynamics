import Link from "next/link";
import { VIDYA_CATALOG } from "./vidyaCatalog";

const STATUS_COPY = {
  live: { label: "Live Now", color: "#22C55E", bg: "rgba(34,197,94,0.14)" },
  mapped: { label: "Mapped Next", color: "#F59E0B", bg: "rgba(245,158,11,0.14)" },
  planned: { label: "Planned", color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
} as const;

const TIER_SLUGS = ["core", "fullstack", "datascience", "aielite"] as const;

export default function PythonAiLandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.14), transparent 24%), linear-gradient(180deg, #020617 0%, #07111f 55%, #030712 100%)",
        color: "#E2E8F0",
        fontFamily: "'Segoe UI', 'Inter', sans-serif",
      }}
    >
      <section style={{ maxWidth: 1380, margin: "0 auto", padding: "40px 24px 72px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 36,
          }}
        >
          <Link href="/" style={{ color: "#F8FAFC", textDecoration: "none", fontWeight: 800, fontSize: 15 }}>
            RoboDynamics
          </Link>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/python-ai/course/core"
              style={{
                textDecoration: "none",
                background: "#2563EB",
                color: "#FFFFFF",
                padding: "12px 18px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              Enter Vidya Core
            </Link>
            <Link
              href="/python-ai/editor"
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.05)",
                color: "#E2E8F0",
                padding: "12px 18px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 14,
                border: "1px solid rgba(148,163,184,0.14)",
              }}
            >
              Open Practice Lab
            </Link>
          </div>
        </header>

        <section
          style={{
            borderRadius: 32,
            padding: "40px clamp(24px, 5vw, 56px)",
            background: "linear-gradient(135deg, rgba(15,23,42,0.94), rgba(15,23,42,0.72))",
            border: "1px solid rgba(96,165,250,0.16)",
            boxShadow: "0 28px 90px rgba(0,0,0,0.35)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
              gap: 28,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "rgba(37,99,235,0.14)",
                  color: "#93C5FD",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 1.1,
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                Vidya Elite Academy
              </div>
              <h1 style={{ margin: "0 0 16px", fontSize: "clamp(40px, 7vw, 72px)", lineHeight: 0.98, fontWeight: 900 }}>
                Python & AI
                <span style={{ color: "#60A5FA" }}> Architect Track</span>
              </h1>
              <p style={{ margin: 0, maxWidth: 760, fontSize: 18, lineHeight: 1.7, color: "#CBD5E1" }}>
                Vidya is the Python tutor for RoboDynamics learners who are training for real software architecture,
                data science, and AI engineering careers. The interface now anchors the academy around your four
                professional tiers while preserving the working lesson runtime underneath.
              </p>
            </div>

            <div
              style={{
                borderRadius: 28,
                padding: 24,
                background: "linear-gradient(180deg, rgba(30,41,59,0.88), rgba(2,6,23,0.94))",
                border: "1px solid rgba(148,163,184,0.14)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, color: "#7DD3FC", textTransform: "uppercase", letterSpacing: 1.3, marginBottom: 14 }}>
                Production Snapshot
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "#94A3B8" }}>Live tier</span>
                  <span style={{ fontWeight: 800, color: "#F8FAFC" }}>Tier 1: Vidya Core</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "#94A3B8" }}>Mapped next</span>
                  <span style={{ fontWeight: 800, color: "#F8FAFC" }}>Tiers 2-3</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "#94A3B8" }}>Planned</span>
                  <span style={{ fontWeight: 800, color: "#F8FAFC" }}>Tier 4 elite labs</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ color: "#94A3B8" }}>Existing runtime</span>
                  <span style={{ fontWeight: 800, color: "#F8FAFC" }}>/ai-tutor/learn</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: 22,
            marginBottom: 30,
          }}
        >
          {VIDYA_CATALOG.map((tier, index) => {
            const slug = TIER_SLUGS[index] ?? "core";
            const liveCount = tier.chapters.filter((chapter) => chapter.deliveryStatus === "live").length;
            return (
              <Link
                key={tier.id}
                href={`/python-ai/course/${slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 28,
                  padding: 24,
                  background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(2,6,23,0.92))",
                  border: `1px solid ${tier.color}26`,
                  boxShadow: `0 18px 48px ${tier.color}12`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 18, alignItems: "start" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: tier.color, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
                      {tier.level}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1 }}>{tier.name.replace(": ", " - ")}</div>
                  </div>
                  <div
                    style={{
                      minWidth: 64,
                      textAlign: "center",
                      borderRadius: 18,
                      padding: "10px 12px",
                      background: `${tier.color}18`,
                      color: tier.color,
                      fontWeight: 900,
                      fontSize: 18,
                    }}
                  >
                    T{index + 1}
                  </div>
                </div>
                <div style={{ color: "#CBD5E1", fontSize: 15, lineHeight: 1.65, marginBottom: 18 }}>{tier.tagline}</div>
                <div style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>{tier.projectFocus}</div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, color: "#F8FAFC", fontSize: 13, fontWeight: 700 }}>
                  <span>{tier.chapters.length} mapped modules</span>
                  <span>{liveCount} live</span>
                </div>
              </Link>
            );
          })}
        </section>

        <section
          style={{
            borderRadius: 30,
            padding: 28,
            background: "rgba(15,23,42,0.56)",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, color: "#93C5FD", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 16 }}>
            Syllabus Delivery Status
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {VIDYA_CATALOG.map((tier) => (
              <div key={tier.id} style={{ display: "grid", gap: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#F8FAFC" }}>{tier.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 14 }}>
                  {tier.chapters.map((chapter) => {
                    const status = STATUS_COPY[chapter.deliveryStatus];
                    return (
                      <div
                        key={chapter.id}
                        style={{
                          borderRadius: 20,
                          padding: 18,
                          background: "rgba(2,6,23,0.72)",
                          border: "1px solid rgba(148,163,184,0.12)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start", marginBottom: 10 }}>
                          <div style={{ fontWeight: 800, color: "#F8FAFC", lineHeight: 1.35 }}>
                            {chapter.displayCode}: {chapter.title}
                          </div>
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              borderRadius: 999,
                              padding: "6px 10px",
                              background: status.bg,
                              color: status.color,
                              fontSize: 11,
                              fontWeight: 900,
                              textTransform: "uppercase",
                            }}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div style={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.6 }}>{chapter.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
