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

// ─── Mock ────────────────────────────────────────────────────────────────────

const MOCK_CHILD: ChildData = {
  name: "Arjun",
  grade: 4,
  monthlyMinutes: 270,
  chaptersCompleted: 2,
  avgAccuracy: 81,
  streak: 7,
  activityHeatmap: [
    0, 0, 0, 25, 30, 0, 0,
    20, 45, 15, 0, 30, 25, 0,
    10, 0, 25, 30, 15, 0, 0,
    20, 25, 0, 15, 30, 0, 0,
  ],
  chapters: [
    { num: 1, title: "Completing the Whole — Pūraṇāpūraṇābhyām", status: "mastered", qDone: 24, qTotal: 24, accuracy: 90, minutes: 25 },
    { num: 2, title: "All from 9, Last from 10 — Nikhilam Basics", status: "mastered", qDone: 22, qTotal: 24, accuracy: 83, minutes: 22 },
    { num: 3, title: "Doubling & Halving Tricks", status: "in_progress", qDone: 10, qTotal: 24, accuracy: 71, minutes: 12 },
    { num: 4, title: "The 11 Times Trick", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
    { num: 5, title: "Adding in Pairs — Lopana Sthāpana", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
    { num: 6, title: "Magic of 9 — Digit Sum Check", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
    { num: 7, title: "Multiplying Near 10 & 100", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
    { num: 8, title: "Quick Division by 2, 5 & 10", status: "locked", qDone: 0, qTotal: 24, accuracy: 0, minutes: 0 },
  ],
  weakAreas: ["Carrying in 2-step Nikhilam", "Digit sum verification"],
  recentSessions: [
    { date: "Mar 22, 5:00 PM", chapter: "Chapter 2 — Nikhilam Basics", duration: "22 min", score: "18/22" },
    { date: "Mar 21, 4:30 PM", chapter: "Chapter 1 — Completing the Whole", duration: "20 min", score: "22/24" },
    { date: "Mar 20, 6:15 PM", chapter: "Chapter 1 — Completing the Whole", duration: "18 min", score: "19/24" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h}h ${m}m`;
}

function heatColor(mins: number) {
  if (mins === 0) return "#F1F5F9";
  if (mins < 15)  return "#FED7AA";
  if (mins < 30)  return "#F97316";
  return "#C2410C";
}

function accColor(acc: number) {
  if (acc >= 85) return "#22C55E";
  if (acc >= 65) return "#F97316";
  if (acc === 0)  return "#CBD5E1";
  return "#EF4444";
}

function statusIcon(s: ChapterProgress["status"]) {
  if (s === "mastered")    return "✅";
  if (s === "in_progress") return "🔄";
  return "🔒";
}

function statusColor(s: ChapterProgress["status"]) {
  if (s === "mastered")    return "#22C55E";
  if (s === "in_progress") return "#F97316";
  return "#94A3B8";
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Components ───────────────────────────────────────────────────────────────

function TopBar({ child }: { child: ChildData }) {
  function logout() {
    fetch("/api/auth/login", { method: "DELETE" }).finally(() => { window.location.href = "/"; });
  }
  return (
    <div style={{ background: "#0F172A", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #F97316, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🤖</div>
        <div>
          <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 16 }}>AptiPath<span style={{ color: "#F97316" }}>360</span></div>
          <div style={{ color: "#64748B", fontSize: 10, marginTop: -2 }}>Parent Dashboard</div>
        </div>
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8, padding: "6px 14px", color: "#F8FAFC", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          👦 {child.name} — Grade {child.grade}
          <span style={{ color: "#64748B", fontSize: 10 }}>▼</span>
        </div>
        <a href="/student/home" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 8, padding: "6px 12px", color: "#4ADE80", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
          Student View
        </a>
        <button onClick={logout} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 18, padding: "4px", borderRadius: 6, lineHeight: 1 }} title="Logout">⏻</button>
      </div>
    </div>
  );
}

function SummaryCards({ child }: { child: ChildData }) {
  const progressPct = Math.round((child.chaptersCompleted / 8) * 100);
  const cards = [
    { icon: "📚", value: fmtTime(child.monthlyMinutes), label: "This Month", color: "#3B82F6", sub: "Learning time" },
    { icon: "✅", value: `${child.chaptersCompleted}/8`, label: "Chapters Done", color: "#22C55E", sub: `${progressPct}% complete` },
    { icon: "🎯", value: `${child.avgAccuracy}%`, label: "Avg Accuracy", color: "#F97316", sub: child.avgAccuracy >= 80 ? "On track ✓" : "Needs attention" },
    { icon: "🔥", value: `${child.streak} days`, label: "Streak", color: "#EF4444", sub: "Daily practice" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${c.color}`, border: "1px solid #F1F5F9", borderLeftWidth: 4, borderLeftColor: c.color }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{c.icon}</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>{c.value}</div>
              <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600, marginTop: 1 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: c.color, fontWeight: 600, marginTop: 3 }}>{c.sub}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityHeatmap({ heatmap }: { heatmap: number[] }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 14, padding: 22, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>Activity this month</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 32px)", gap: 6, marginBottom: 8 }}>
        {DOW.map(d => (
          <div key={d} style={{ fontSize: 10, color: "#94A3B8", textAlign: "center", fontWeight: 600 }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 32px)", gridTemplateRows: "repeat(4, 32px)", gap: 6 }}>
        {heatmap.map((mins, i) => (
          <div key={i} title={mins > 0 ? `${mins} min studied` : "No activity"}
            style={{ width: 32, height: 32, borderRadius: 8, background: heatColor(mins), cursor: "default", transition: "transform 0.1s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.15)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
          />
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 11, color: "#94A3B8" }}>Less</span>
        {[0, 10, 20, 45].map(v => (
          <div key={v} style={{ width: 16, height: 16, borderRadius: 4, background: heatColor(v), border: "1px solid rgba(0,0,0,0.05)" }} />
        ))}
        <span style={{ fontSize: 11, color: "#94A3B8" }}>More</span>
      </div>
    </div>
  );
}

function WeakAreas({ areas }: { areas: string[] }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 14, padding: 22, border: "1px solid #FEE2E2", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: "4px solid #EF4444" }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>Areas needing more practice</div>
      {areas.map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
          <span style={{ color: "#EF4444", fontSize: 14, marginTop: 1 }}>⚠</span>
          <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.4 }}>{a}</span>
        </div>
      ))}
      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, marginTop: 14 }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <span style={{ fontSize: 13, color: "#92400E", fontWeight: 500 }}>
          Tip: A 10-min review of Chapter {areas.length} can lift accuracy by 10–15 points.
        </span>
      </div>
    </div>
  );
}

function ChapterProgressList({ chapters }: { chapters: ChapterProgress[] }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", overflow: "hidden", marginBottom: 28 }}>
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Chapter Progress</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 500 }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Chapter", "Status", "Questions", "Accuracy", "Time"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#64748B", fontWeight: 700, fontSize: 11, borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chapters.map((ch, i) => (
              <tr key={ch.num}
                style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}
                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "#FFF7ED"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "#FFFFFF" : "#F8FAFC"; }}
              >
                <td style={{ padding: "12px 16px", color: "#0F172A", fontWeight: 600, maxWidth: 240 }}>
                  <span style={{ color: "#94A3B8", marginRight: 8, fontSize: 12 }}>{ch.num}.</span>
                  {ch.title}
                </td>
                <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: statusColor(ch.status), background: `${statusColor(ch.status)}15`, borderRadius: 20, padding: "3px 10px" }}>
                    {statusIcon(ch.status)}{" "}
                    {ch.status === "mastered" ? "Mastered" : ch.status === "in_progress" ? "In Progress" : "Locked"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: ch.qDone > 0 ? "#0F172A" : "#CBD5E1" }}>
                  {ch.qDone > 0 ? `${ch.qDone}/${ch.qTotal}` : "—"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {ch.accuracy > 0
                    ? <span style={{ color: accColor(ch.accuracy), fontWeight: 800 }}>{ch.accuracy}%</span>
                    : <span style={{ color: "#CBD5E1" }}>—</span>
                  }
                </td>
                <td style={{ padding: "12px 16px", color: ch.minutes > 0 ? "#64748B" : "#CBD5E1" }}>
                  {ch.minutes > 0 ? `${ch.minutes} min` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecentSessions({ sessions }: { sessions: RecentSession[] }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", padding: 20, marginBottom: 28 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>Recent Sessions</div>
      {sessions.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < sessions.length - 1 ? "1px solid #F8FAFC" : "none", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{s.chapter}</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{s.date} · {s.duration}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", background: "#F1F5F9", borderRadius: 20, padding: "4px 14px", whiteSpace: "nowrap" }}>
            {s.score}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ParentDashboardClient() {
  const [child, setChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent/dashboard")
      .then(r => r.json())
      .then(data => setChild(data))
      .catch(() => setChild(MOCK_CHILD))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 36 }}>📊</div>
        <div style={{ color: "#94A3B8", fontSize: 15, fontWeight: 600 }}>Loading dashboard…</div>
      </div>
    );
  }
  if (!child) return null;

  const overallGrade = child.avgAccuracy >= 85 ? "Excellent" : child.avgAccuracy >= 70 ? "Good" : "Needs attention";
  const overallColor = child.avgAccuracy >= 85 ? "#22C55E" : child.avgAccuracy >= 70 ? "#F97316" : "#EF4444";

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <TopBar child={child} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* Status banner */}
        <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>
              Overall progress — MindSutra Grade {child.grade}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#0F172A" }}>
              {child.name} is doing{" "}
              <span style={{ color: overallColor }}>{overallGrade}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={`/student/course/grade-${child.grade}`} style={{ background: "#F97316", color: "#FFF", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 8, textDecoration: "none" }}>
              View Course Hub →
            </a>
            <a href="/student/home" style={{ background: "#F1F5F9", color: "#475569", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 8, textDecoration: "none" }}>
              Student View
            </a>
          </div>
        </div>

        {/* Summary cards */}
        <SummaryCards child={child} />

        {/* Two-column: heatmap + weak areas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 28 }}>
          <ActivityHeatmap heatmap={child.activityHeatmap} />
          <WeakAreas areas={child.weakAreas} />
        </div>

        {/* Chapter progress table */}
        <ChapterProgressList chapters={child.chapters} />

        {/* Recent sessions */}
        <RecentSessions sessions={child.recentSessions} />

        {/* Download report */}
        <div style={{ textAlign: "center" }}>
          <button style={{ background: "transparent", border: "2px solid #E2E8F0", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, color: "#475569", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#F97316"; b.style.color = "#F97316"; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#E2E8F0"; b.style.color = "#475569"; }}
          >
            📄 Download Weekly Report
          </button>
        </div>

      </main>
    </div>
  );
}
