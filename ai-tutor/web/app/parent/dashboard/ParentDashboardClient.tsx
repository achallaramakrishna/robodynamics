"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChapterProgress {
  num: number;
  title: string;
  status: "mastered" | "in_progress" | "locked";
  qDone: number;
  qTotal: number;
  accuracy: number;
  minutes: number;
}

interface RecentSession {
  date: string;
  chapter: string;
  duration: string;
  score: string;
}

interface ChildData {
  name: string;
  grade: number;
  monthlyMinutes: number;
  chaptersCompleted: number;
  avgAccuracy: number;
  streak: number;
  activityHeatmap: number[];
  chapters: ChapterProgress[];
  weakAreas: string[];
  recentSessions: RecentSession[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockChild: ChildData = {
  name: "Priya",
  grade: 5,
  monthlyMinutes: 270,
  chaptersCompleted: 3,
  avgAccuracy: 78,
  streak: 5,
  activityHeatmap: [
    0, 0, 0, 25, 30, 0, 0,
    20, 45, 15, 0, 30, 25, 0,
    10, 0, 25, 30, 15, 0, 0,
    20, 25, 0, 15, 30, 0, 0,
  ],
  chapters: [
    { num: 1, title: "Nikhilam Near 100", status: "mastered", qDone: 24, qTotal: 24, accuracy: 92, minutes: 25 },
    { num: 2, title: "Digit Sum & Divisibility", status: "mastered", qDone: 20, qTotal: 24, accuracy: 87, minutes: 20 },
    { num: 3, title: "Criss-Cross 2-digit", status: "mastered", qDone: 22, qTotal: 24, accuracy: 83, minutes: 22 },
    { num: 4, title: "Multiplying by 11 & 12", status: "in_progress", qDone: 12, qTotal: 24, accuracy: 71, minutes: 12 },
    { num: 5, title: "Squaring Near 50", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
    { num: 6, title: "Percentage Shortcuts", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
    { num: 7, title: "HCF by Vedic Method", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
    { num: 8, title: "Division by Flag Method", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
  ],
  weakAreas: ["Carries in criss-cross multiplication", "Denominator simplification"],
  recentSessions: [
    { date: "Mar 15, 4:30 PM", chapter: "Chapter 3 — Criss-Cross", duration: "22 min", score: "18/22" },
    { date: "Mar 14, 5:00 PM", chapter: "Chapter 2 — Digit Sum", duration: "18 min", score: "14/20" },
    { date: "Mar 13, 6:15 PM", chapter: "Chapter 1 — Nikhilam", duration: "25 min", score: "22/24" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtHours(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h}.${Math.round((m / 60) * 10)} hrs`;
}

function heatColor(mins: number): string {
  if (mins === 0) return "#F1F5F9";
  if (mins < 15) return "#FDBA74";
  if (mins < 30) return "#F97316";
  return "#C2410C";
}

function chapterStatusIcon(status: ChapterProgress["status"]) {
  if (status === "mastered") return "✅";
  if (status === "in_progress") return "🔄";
  return "🔒";
}

function chapterStatusColor(status: ChapterProgress["status"]) {
  if (status === "mastered") return "#22C55E";
  if (status === "in_progress") return "#F97316";
  return "#94A3B8";
}

function accuracyColor(acc: number) {
  if (acc >= 85) return "#22C55E";
  if (acc >= 65) return "#F97316";
  if (acc === 0) return "#CBD5E1";
  return "#EF4444";
}

function PilotNotice() {
  return (
    <section
      style={{
        marginBottom: 24,
        background: "#fff7ed",
        border: "1px solid #fdba74",
        borderRadius: 16,
        padding: "14px 16px",
        color: "#9a3412",
        boxShadow: "0 6px 20px rgba(249,115,22,0.08)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        MindSutra Pilot
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>
        Parent insights are available for the pilot release, but they currently represent the guided pilot learning path and should not yet be presented as final mastery reporting.
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopBar({ child }: { child: ChildData }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#0F172A",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 60,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#F97316" }}>Mind</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>Sutra</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#94A3B8",
            background: "rgba(148,163,184,0.12)",
            border: "1px solid rgba(148,163,184,0.25)",
            borderRadius: 6,
            padding: "2px 8px",
            marginLeft: 8,
          }}
        >
          Parent Dashboard
        </span>
      </div>

      {/* Child selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            background: "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: 8,
            padding: "6px 12px",
            color: "#F8FAFC",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          👧 {child.name} — Grade {child.grade}
          <span style={{ color: "#94A3B8", fontSize: 10 }}>▼</span>
        </div>
        <button
          style={{
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 8,
            padding: "6px 12px",
            color: "#4ADE80",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Add Child
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#94A3B8",
            cursor: "pointer",
            fontSize: 18,
            padding: "4px",
            lineHeight: 1,
          }}
          title="Logout"
        >
          ⏻
        </button>
      </div>
    </div>
  );
}

function SummaryCards({ child }: { child: ChildData }) {
  const cards = [
    { icon: "📚", value: fmtHours(child.monthlyMinutes), label: "This Month", color: "#3B82F6" },
    { icon: "✅", value: `${child.chaptersCompleted} / 8`, label: "Chapters Done", color: "#22C55E" },
    { icon: "🎯", value: `${child.avgAccuracy}%`, label: "Avg Accuracy", color: "#F97316" },
    { icon: "🔥", value: `${child.streak} days`, label: "Current Streak", color: "#EF4444" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 32,
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: 20,
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderLeft: `4px solid ${c.color}`,
          }}
        >
          <span style={{ fontSize: 28 }}>{c.icon}</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, marginTop: 2 }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Day-of-week labels (Sun–Sat)
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ActivityHeatmap({ heatmap }: { heatmap: number[] }) {
  // heatmap is 28 values: 4 weeks × 7 days
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 20,
        marginBottom: 32,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
        Activity this month
      </div>

      {/* Day-of-week header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 28px)", gap: 6, marginBottom: 6 }}>
        {DOW.map((d) => (
          <div key={d} style={{ fontSize: 10, color: "#94A3B8", textAlign: "center", fontWeight: 600 }}>
            {d}
          </div>
        ))}
      </div>

      {/* 4-week grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 28px)", gridTemplateRows: "repeat(4, 28px)", gap: 6 }}>
        {heatmap.map((mins, i) => (
          <div
            key={i}
            title={mins > 0 ? `${mins} min studied` : "No activity"}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: heatColor(mins),
              cursor: mins > 0 ? "default" : "default",
              transition: "transform 0.1s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.2)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "scale(1)")}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>Less</span>
        {[0, 10, 20, 45].map((v) => (
          <div
            key={v}
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: heatColor(v),
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          />
        ))}
        <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>More active</span>
      </div>
    </div>
  );
}

function ChapterTable({ chapters }: { chapters: ChapterProgress[] }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 20,
        marginBottom: 32,
        overflowX: "auto",
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
        Chapter Progress
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F8FAFC" }}>
            {["Chapter", "Status", "Questions", "Accuracy", "Time"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  color: "#64748B",
                  fontWeight: 600,
                  fontSize: 12,
                  borderBottom: "2px solid #E2E8F0",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chapters.map((ch, i) => (
            <tr
              key={ch.num}
              style={{
                background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#FFF7ED")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "#FFFFFF" : "#F8FAFC")}
            >
              <td style={{ padding: "11px 12px", color: "#0F172A", fontWeight: 600 }}>
                {ch.num}. {ch.title}
              </td>
              <td style={{ padding: "11px 12px", whiteSpace: "nowrap" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    color: chapterStatusColor(ch.status),
                    background: `${chapterStatusColor(ch.status)}15`,
                    borderRadius: 20,
                    padding: "3px 10px",
                  }}
                >
                  {chapterStatusIcon(ch.status)}{" "}
                  {ch.status === "mastered"
                    ? "Mastered"
                    : ch.status === "in_progress"
                    ? "In Progress"
                    : "Not Started"}
                </span>
              </td>
              <td style={{ padding: "11px 12px", color: ch.qDone > 0 ? "#0F172A" : "#CBD5E1" }}>
                {ch.qDone > 0 ? `${ch.qDone}/${ch.qTotal}` : "—"}
              </td>
              <td style={{ padding: "11px 12px" }}>
                {ch.accuracy > 0 ? (
                  <span style={{ color: accuracyColor(ch.accuracy), fontWeight: 700 }}>
                    {ch.accuracy}%
                  </span>
                ) : (
                  <span style={{ color: "#CBD5E1" }}>—</span>
                )}
              </td>
              <td style={{ padding: "11px 12px", color: ch.minutes > 0 ? "#64748B" : "#CBD5E1" }}>
                {ch.minutes > 0 ? `${ch.minutes} min` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WeakAreasPanel({ areas }: { areas: string[] }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 20,
        borderLeft: "4px solid #EF4444",
        marginBottom: 32,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>
        Areas needing practice
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {areas.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <span style={{ color: "#EF4444", fontSize: 14, marginTop: 1 }}>⚠</span>
            <span style={{ fontSize: 14, color: "#374151" }}>{a}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "#FFF7ED",
          border: "1px solid #FED7AA",
          borderRadius: 8,
          padding: "10px 14px",
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>💡</span>
        <span style={{ fontSize: 13, color: "#92400E", fontWeight: 500 }}>
          Tip: Try Chapter 3 again — a 10 min review session can boost criss-cross accuracy.
        </span>
      </div>
    </div>
  );
}

function RecentSessionsList({ sessions }: { sessions: RecentSession[] }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 20,
        marginBottom: 32,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
        Recent Sessions
      </div>
      <div>
        {sessions.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: i < sessions.length - 1 ? "1px solid #F1F5F9" : "none",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>
                {s.chapter}
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>
                {s.date} · {s.duration}
              </div>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0F172A",
                background: "#F1F5F9",
                borderRadius: 20,
                padding: "4px 12px",
                whiteSpace: "nowrap",
              }}
            >
              {s.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DownloadReportButton() {
  return (
    <div style={{ textAlign: "center", paddingBottom: 40 }}>
      <button
        style={{
          background: "transparent",
          border: "2px solid #E2E8F0",
          borderRadius: 10,
          padding: "12px 28px",
          fontSize: 14,
          fontWeight: 600,
          color: "#475569",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          transition: "border-color 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.borderColor = "#F97316";
          btn.style.color = "#F97316";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.borderColor = "#E2E8F0";
          btn.style.color = "#475569";
        }}
      >
        📄 Download Weekly Report
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ParentDashboardClient() {
  const [child, setChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent/dashboard")
      .then((r) => r.json())
      .then((data) => setChild(data))
      .catch(() => setChild(mockChild))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 36 }}>📊</div>
        <div style={{ color: "#94A3B8", fontSize: 15, fontWeight: 500 }}>Loading dashboard…</div>
      </div>
    );
  }

  if (!child) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <TopBar child={child} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 40px" }}>
        <PilotNotice />

        {/* Summary cards */}
        <SummaryCards child={child} />

        {/* Two-column layout for calendar + weak areas on wider screens */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
            marginBottom: 0,
          }}
        >
          <ActivityHeatmap heatmap={child.activityHeatmap} />
          <WeakAreasPanel areas={child.weakAreas} />
        </div>

        {/* Chapter progress table (full width) */}
        <ChapterTable chapters={child.chapters} />

        {/* Recent sessions */}
        <RecentSessionsList sessions={child.recentSessions} />

        {/* Download report */}
        <DownloadReportButton />
      </main>
    </div>
  );
}
