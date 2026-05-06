import Link from "next/link";
import { VIDYA_CATALOG } from "@/app/python-ai/vidyaCatalog";

const liveChapters = VIDYA_CATALOG.flatMap((tier) =>
  tier.chapters
    .filter((chapter) => chapter.launchUrl)
    .map((chapter) => ({
      tier: tier.name,
      color: tier.color,
      chapter,
    })),
);

export default function VidyaPracticeLabPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 30%), linear-gradient(180deg, #020617 0%, #07111f 52%, #030712 100%)",
        color: "#E2E8F0",
        fontFamily: "'Segoe UI', 'Inter', sans-serif",
      }}
    >
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 30 }}>
          <Link href="/python-ai" style={{ textDecoration: "none", color: "#F8FAFC", fontWeight: 800 }}>
            Back to Vidya
          </Link>
          <Link href="/python-ai/course/core" style={{ textDecoration: "none", color: "#93C5FD", fontWeight: 800 }}>
            Open curriculum browser
          </Link>
        </div>

        <div
          style={{
            borderRadius: 30,
            padding: "34px clamp(22px, 5vw, 40px)",
            background: "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(15,23,42,0.76))",
            border: "1px solid rgba(96,165,250,0.16)",
            marginBottom: 28,
          }}
        >
          <div style={{ color: "#93C5FD", fontWeight: 900, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
            Vidya Practice Lab
          </div>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(34px, 6vw, 56px)", lineHeight: 1, fontWeight: 900 }}>
            Live Python Workbench
          </h1>
          <p style={{ margin: 0, maxWidth: 760, color: "#CBD5E1", fontSize: 17, lineHeight: 1.7 }}>
            This lab currently routes into the working Tier 1 lesson runtime. The higher academy tiers are already mapped
            in the Vidya browser and can be promoted into this same flow as their lesson content lands.
          </p>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {liveChapters.map(({ tier, color, chapter }) => (
            <Link
              key={chapter.id}
              href={chapter.launchUrl!}
              style={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: 22,
                padding: 22,
                background: "rgba(15,23,42,0.76)",
                border: `1px solid ${color}24`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color, fontWeight: 900, fontSize: 12, letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 8 }}>
                    {tier}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC", marginBottom: 8 }}>
                    {chapter.displayCode}: {chapter.title}
                  </div>
                  <div style={{ color: "#94A3B8", lineHeight: 1.65 }}>{chapter.description}</div>
                </div>
                <div
                  style={{
                    borderRadius: 999,
                    padding: "10px 14px",
                    background: `${color}1A`,
                    color,
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                  }}
                >
                  Launch lesson
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
