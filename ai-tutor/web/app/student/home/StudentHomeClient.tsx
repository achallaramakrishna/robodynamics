"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Enrollment {
  courseId: string;
  courseName: string;
  grade: number;
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter: string;
  currentChapterName: string;
  accuracy: number;
  status: "not_started" | "in_progress" | "completed";
}

interface RecentSession {
  date: string;
  chapter: string;
  duration: string;
  accuracy: number;
}

interface StudentData {
  name: string;
  grade: number;
  xp: number;
  streak: number;
  enrollments: Enrollment[];
  recentSessions: RecentSession[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockStudent: StudentData = {
  name: "Priya",
  grade: 5,
  xp: 1240,
  streak: 5,
  enrollments: [
    {
      courseId: "vedic_math_g5",
      courseName: "MindSutra Grade 5 — Vedic Maths",
      grade: 5,
      chaptersCompleted: 3,
      totalChapters: 8,
      currentChapter: "VM_G5_L4_TIMES11",
      currentChapterName: "Multiplying by 11 & 12",
      accuracy: 78,
      status: "in_progress",
    },
  ],
  recentSessions: [
    { date: "Mar 15, 4:30 PM", chapter: "Chapter 3 — Criss-Cross", duration: "22 min", accuracy: 83 },
    { date: "Mar 14, 5:00 PM", chapter: "Chapter 2 — Digit Sum", duration: "18 min", accuracy: 71 },
    { date: "Mar 13, 6:15 PM", chapter: "Chapter 1 — Nikhilam", duration: "25 min", accuracy: 90 },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusLabel(status: Enrollment["status"]) {
  if (status === "not_started") return "Not Started";
  if (status === "in_progress") return "In Progress";
  return "Completed";
}

function statusColor(status: Enrollment["status"]) {
  if (status === "not_started") return "#94A3B8";
  if (status === "in_progress") return "#F97316";
  return "#22C55E";
}

function gradeEmoji(grade: number) {
  const emojis = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];
  return emojis[grade - 1] ?? grade.toString();
}

function accuracyColor(acc: number) {
  if (acc >= 85) return "#22C55E";
  if (acc >= 65) return "#F97316";
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
        This dashboard is safe to use for the pilot release, but it should be treated as a guided progress view while reporting and persistence are being tightened.
      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopBar({ student }: { student: StudentData }) {
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
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#F97316", letterSpacing: "-0.5px" }}>
          Mind
        </span>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
          Sutra
        </span>
      </div>

      {/* Greeting */}
      <div style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>
        Hi {student.name}! 👋
      </div>

      {/* Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(249,115,22,0.18)",
            border: "1px solid rgba(249,115,22,0.4)",
            borderRadius: 20,
            padding: "4px 10px",
            color: "#FB923C",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          🔥 {student.streak}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(234,179,8,0.18)",
            border: "1px solid rgba(234,179,8,0.4)",
            borderRadius: 20,
            padding: "4px 10px",
            color: "#FBBF24",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          ⭐ {student.xp.toLocaleString()} XP
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#94A3B8",
            cursor: "pointer",
            fontSize: 18,
            padding: "4px",
            borderRadius: 6,
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

function HeroResumeCard({ enrollment }: { enrollment: Enrollment }) {
  const pct = Math.round((enrollment.chaptersCompleted / enrollment.totalChapters) * 100);
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
        borderRadius: 16,
        padding: "28px 32px",
        color: "#FFFFFF",
        boxShadow: "0 4px 24px rgba(249,115,22,0.35)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circle */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          pointerEvents: "none",
        }}
      />
      <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
        Continue Learning
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
        Grade {enrollment.grade} — Vedic Maths
      </div>
      <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>
        Next: {enrollment.currentChapterName}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.9, marginBottom: 6 }}>
          <span>{enrollment.chaptersCompleted} of {enrollment.totalChapters} chapters completed</span>
          <span>{pct}%</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 99, height: 8 }}>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 99,
              height: 8,
              width: `${pct}%`,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      <a
        href={`/student/course/grade-${enrollment.grade}`}
        style={{
          display: "inline-block",
          marginTop: 16,
          background: "#FFFFFF",
          color: "#F97316",
          fontWeight: 800,
          fontSize: 15,
          borderRadius: 10,
          padding: "10px 24px",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        Resume Now →
      </a>
    </div>
  );
}

function CourseCard({ enrollment }: { enrollment: Enrollment }) {
  const pct = Math.round((enrollment.chaptersCompleted / enrollment.totalChapters) * 100);
  const isStarted = enrollment.status !== "not_started";

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
          borderRadius: 10,
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: 40, opacity: 0.15, position: "absolute", top: 4, right: 8, fontWeight: 900 }}>
          {enrollment.grade}
        </span>
        <span style={{ fontSize: 32 }}>🧮</span>
        <span
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "#F97316",
            color: "#FFF",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 6,
            padding: "2px 8px",
          }}
        >
          Grade {enrollment.grade}
        </span>
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", lineHeight: 1.4 }}>
          {enrollment.courseName}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 4 }}>
          <span>{enrollment.chaptersCompleted}/{enrollment.totalChapters} chapters</span>
          <span>{pct}%</span>
        </div>
        <div style={{ background: "#F1F5F9", borderRadius: 99, height: 6 }}>
          <div
            style={{
              background: statusColor(enrollment.status),
              borderRadius: 99,
              height: 6,
              width: `${pct}%`,
            }}
          />
        </div>
      </div>

      {/* Status + button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: statusColor(enrollment.status),
            background: `${statusColor(enrollment.status)}18`,
            borderRadius: 20,
            padding: "3px 10px",
          }}
        >
          {statusLabel(enrollment.status)}
        </span>
        <a
          href={`/student/course/grade-${enrollment.grade}`}
          style={{
            background: "#F97316",
            color: "#FFF",
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 8,
            padding: "6px 14px",
            textDecoration: "none",
          }}
        >
          {isStarted ? "Open hub" : "Begin"}
        </a>
      </div>
    </div>
  );
}

function StatsStrip({ student }: { student: StudentData }) {
  const activeEnrollment = student.enrollments.find((e) => e.status === "in_progress");
  const stats = [
    { icon: "📚", label: "Chapters Done", value: activeEnrollment?.chaptersCompleted ?? 0 },
    { icon: "✅", label: "Accuracy", value: `${activeEnrollment?.accuracy ?? 0}%` },
    { icon: "🔥", label: "Streak", value: `${student.streak} days` },
    { icon: "⭐", label: "XP Total", value: student.xp.toLocaleString() },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        paddingBottom: 4,
        scrollbarWidth: "none",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            flex: "0 0 auto",
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 140,
          }}
        >
          <span style={{ fontSize: 24 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentActivity({ sessions }: { sessions: RecentSession[] }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 20,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
        Recent Activity
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
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
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                color: accuracyColor(s.accuracy),
                background: `${accuracyColor(s.accuracy)}18`,
                borderRadius: 20,
                padding: "3px 10px",
                whiteSpace: "nowrap",
              }}
            >
              {s.accuracy}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingDoubtButton({ enrollment }: { enrollment?: Enrollment }) {
  const href = enrollment
    ? `/ai-tutor/demo?grade=${enrollment.grade}&chapter=${enrollment.currentChapter}&fresh=0#doubt`
    : "#";

  return (
    <a
      href={href}
      style={{
        position: "fixed",
        bottom: 28,
        right: 24,
        background: "#F97316",
        color: "#FFFFFF",
        fontWeight: 700,
        fontSize: 14,
        borderRadius: 99,
        padding: "12px 20px",
        textDecoration: "none",
        boxShadow: "0 4px 16px rgba(249,115,22,0.5)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        zIndex: 200,
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)")}
    >
      💬 Ask Doubt
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentHomeClient() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/home")
      .then((r) => r.json())
      .then((data) => setStudent(data))
      .catch(() => setStudent(mockStudent))
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
        <div style={{ fontSize: 36 }}>🧮</div>
        <div style={{ color: "#94A3B8", fontSize: 15, fontWeight: 500 }}>Loading your dashboard…</div>
      </div>
    );
  }

  if (!student) return null;

  const activeEnrollment = student.enrollments.find((e) => e.status === "in_progress");

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <TopBar student={student} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 100px" }}>
        <PilotNotice />

        {/* Hero resume card */}
        {activeEnrollment && (
          <section style={{ marginBottom: 32 }}>
            <HeroResumeCard enrollment={activeEnrollment} />
          </section>
        )}

        {/* Stats strip */}
        <section style={{ marginBottom: 32 }}>
          <StatsStrip student={student} />
        </section>

        {/* My Courses */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
            My Courses
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {student.enrollments.map((e) => (
              <CourseCard key={e.courseId} enrollment={e} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
            Recent Activity
          </div>
          <RecentActivity sessions={student.recentSessions} />
        </section>
      </main>

      <FloatingDoubtButton enrollment={activeEnrollment} />
    </div>
  );
}

