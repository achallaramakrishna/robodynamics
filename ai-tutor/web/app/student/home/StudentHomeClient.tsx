"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Enrollment {
  courseId: string;
  courseName: string;
  grade: number;
  gradeSlug: string;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(done: number, total: number) { return total > 0 ? Math.round((done / total) * 100) : 0; }

function accuracyColor(acc: number) {
  if (acc >= 85) return "#22C55E";
  if (acc >= 65) return "#F97316";
  return "#EF4444";
}

function statusBadge(status: Enrollment["status"]) {
  if (status === "not_started") return { label: "Not Started", bg: "#F1F5F9", color: "#64748B" };
  if (status === "in_progress") return { label: "In Progress", bg: "#FFF7ED", color: "#F97316" };
  return { label: "Completed", bg: "#F0FDF4", color: "#22C55E" };
}

const COURSE_ICONS: Record<string, string> = {
  vedic_math_g4: "🧮", vedic_math_g5: "✖️", vedic_math_g6: "➗",
  vedic_math_g7: "📐", vedic_math_g8: "🔬",
  aptitude_g4: "🔍", aptitude_g5: "🧩", aptitude_g6: "📊",
};

const COURSE_GRADIENTS: Record<number, string> = {
  4: "linear-gradient(135deg, #F97316, #EA580C)",
  5: "linear-gradient(135deg, #F59E0B, #F97316)",
  6: "linear-gradient(135deg, #10B981, #059669)",
  7: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
  8: "linear-gradient(135deg, #EF4444, #DC2626)",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopBar({ student }: { student: StudentData }) {
  function logout() {
    fetch("/api/auth/login", { method: "DELETE" }).finally(() => { window.location.href = "/"; });
  }
  return (
    <div style={{ background: "#0F172A", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #F97316, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🤖</div>
        <div>
          <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 16 }}>AptiPath<span style={{ color: "#F97316" }}>360</span></div>
        </div>
      </a>

      <div style={{ color: "#CBD5E1", fontSize: 15, fontWeight: 600 }}>Hi {student.name}! 👋</div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: 20, padding: "5px 12px", color: "#FB923C", fontSize: 13, fontWeight: 700 }}>
          🔥 {student.streak}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.35)", borderRadius: 20, padding: "5px 12px", color: "#FBBF24", fontSize: 13, fontWeight: 700 }}>
          ⭐ {student.xp.toLocaleString()} XP
        </div>
        <a href="/parent/dashboard" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, padding: "5px 12px", color: "#C4B5FD", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
          Parent View
        </a>
        <button onClick={logout} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 18, padding: "4px", borderRadius: 6, lineHeight: 1 }} title="Logout">⏻</button>
      </div>
    </div>
  );
}

function HeroBanner({ enrollment }: { enrollment: Enrollment }) {
  const progress = pct(enrollment.chaptersCompleted, enrollment.totalChapters);
  const startHref = `/ai-tutor/demo?grade=${enrollment.grade}&chapter=${enrollment.currentChapter}&fresh=1&enrolled=1`;
  const continueHref = `/ai-tutor/demo?grade=${enrollment.grade}&chapter=${enrollment.currentChapter}&fresh=0&enrolled=1`;
  const hubHref = `/student/course/${enrollment.gradeSlug}`;
  const gradient = COURSE_GRADIENTS[enrollment.grade] ?? "linear-gradient(135deg, #F97316, #EA580C)";

  return (
    <div style={{ background: gradient, borderRadius: 20, padding: "32px 36px", color: "#FFFFFF", boxShadow: "0 8px 32px rgba(249,115,22,0.3)", position: "relative", overflow: "hidden", marginBottom: 28 }}>
      {/* Decorative */}
      <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, right: 60, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

      <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        Continue Learning
      </div>
      <div style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, marginBottom: 6, lineHeight: 1.2 }}>
        {enrollment.courseName}
      </div>
      <div style={{ fontSize: 15, opacity: 0.9, marginBottom: 20 }}>
        Next: {enrollment.currentChapterName}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.9, marginBottom: 6 }}>
          <span>{enrollment.chaptersCompleted} of {enrollment.totalChapters} chapters done</span>
          <span>{progress}%</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 99, height: 8 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 99, height: 8, width: `${progress}%`, transition: "width 0.8s ease" }} />
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
        <a href={continueHref} style={{ background: "#FFFFFF", color: "#F97316", fontWeight: 900, fontSize: 15, borderRadius: 10, padding: "11px 22px", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          ▶ Resume
        </a>
        <a href={startHref} style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF", fontWeight: 700, fontSize: 14, borderRadius: 10, padding: "11px 18px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.3)" }}>
          Start from beginning
        </a>
        <a href={hubHref} style={{ background: "rgba(255,255,255,0.12)", color: "#FFFFFF", fontWeight: 600, fontSize: 13, borderRadius: 10, padding: "11px 18px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
          All chapters →
        </a>
      </div>
    </div>
  );
}

function StatsRow({ student, enrollment }: { student: StudentData; enrollment?: Enrollment }) {
  const stats = [
    { icon: "📚", label: "Chapters Done", value: enrollment?.chaptersCompleted ?? 0, suffix: `/${enrollment?.totalChapters ?? 8}` },
    { icon: "🎯", label: "Accuracy", value: `${enrollment?.accuracy ?? 0}%`, suffix: "" },
    { icon: "🔥", label: "Streak", value: `${student.streak}`, suffix: " days" },
    { icon: "⭐", label: "XP Total", value: student.xp.toLocaleString(), suffix: "" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, marginBottom: 32 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: "#FFFFFF", borderRadius: 14, padding: "18px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 26 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#0F172A" }}>{s.value}{s.suffix}</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CourseCard({ enrollment }: { enrollment: Enrollment }) {
  const progress = pct(enrollment.chaptersCompleted, enrollment.totalChapters);
  const badge = statusBadge(enrollment.status);
  const icon = COURSE_ICONS[enrollment.courseId] ?? "📚";
  const gradient = COURSE_GRADIENTS[enrollment.grade] ?? "linear-gradient(135deg, #64748B, #475569)";
  const hubHref = `/student/course/${enrollment.gradeSlug}`;
  const continueHref = `/ai-tutor/demo?grade=${enrollment.grade}&chapter=${enrollment.currentChapter}&fresh=0&enrolled=1`;

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column" }}>
      {/* Thumbnail */}
      <div style={{ background: gradient, height: 110, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 52 }}>{icon}</span>
        <div style={{ position: "absolute", top: 10, left: 12, background: "rgba(0,0,0,0.4)", color: "#FFF", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
          Grade {enrollment.grade}
        </div>
      </div>

      <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", lineHeight: 1.3 }}>{enrollment.courseName}</div>

        {/* Progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 4 }}>
            <span>{enrollment.chaptersCompleted}/{enrollment.totalChapters} chapters</span>
            <span>{progress}%</span>
          </div>
          <div style={{ background: "#F1F5F9", borderRadius: 99, height: 6 }}>
            <div style={{ background: badge.color, borderRadius: 99, height: 6, width: `${progress}%`, transition: "width 0.6s ease" }} />
          </div>
        </div>

        {/* Status + accuracy */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ background: badge.bg, color: badge.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
            {badge.label}
          </span>
          {enrollment.accuracy > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color: accuracyColor(enrollment.accuracy) }}>
              {enrollment.accuracy}% acc
            </span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          {enrollment.status !== "not_started" && (
            <a href={continueHref} style={{ flex: 1, background: "#F97316", color: "#FFF", fontWeight: 700, fontSize: 12, borderRadius: 8, padding: "8px 0", textDecoration: "none", textAlign: "center" }}>
              ▶ Resume
            </a>
          )}
          <a href={hubHref} style={{ flex: 1, background: enrollment.status === "not_started" ? "#F97316" : "transparent", color: enrollment.status === "not_started" ? "#FFF" : "#475569", fontWeight: 700, fontSize: 12, borderRadius: 8, padding: "8px 0", textDecoration: "none", textAlign: "center", border: enrollment.status === "not_started" ? "none" : "1.5px solid #CBD5E1" }}>
            {enrollment.status === "not_started" ? "Begin →" : "All chapters"}
          </a>
        </div>
      </div>
    </div>
  );
}

function RecentActivity({ sessions }: { sessions: RecentSession[] }) {
  if (sessions.length === 0) return null;
  return (
    <section>
      <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>Recent Activity</div>
      <div style={{ background: "#FFFFFF", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9" }}>
        {sessions.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < sessions.length - 1 ? "1px solid #F8FAFC" : "none", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.chapter}</div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>{s.date} · {s.duration}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: accuracyColor(s.accuracy), background: `${accuracyColor(s.accuracy)}15`, borderRadius: 20, padding: "4px 12px", whiteSpace: "nowrap" }}>
              {s.accuracy}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const MOCK_STUDENT: StudentData = {
  name: "Arjun",
  grade: 4,
  xp: 1240,
  streak: 7,
  enrollments: [
    {
      courseId: "vedic_math_g4",
      courseName: "MindSutra Grade 4 — Vedic Maths",
      grade: 4,
      gradeSlug: "grade-4",
      chaptersCompleted: 2,
      totalChapters: 8,
      currentChapter: "VM_G4_L3_DOUBLING_HALVING",
      currentChapterName: "Doubling & Halving Tricks",
      accuracy: 81,
      status: "in_progress",
    },
  ],
  recentSessions: [
    { date: "Mar 22, 5:00 PM", chapter: "Chapter 2 — Nikhilam Basics", duration: "22 min", accuracy: 83 },
    { date: "Mar 21, 4:30 PM", chapter: "Chapter 1 — Completing the Whole", duration: "20 min", accuracy: 90 },
    { date: "Mar 20, 6:15 PM", chapter: "Chapter 1 — Completing the Whole", duration: "18 min", accuracy: 76 },
  ],
};

export default function StudentHomeClient() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/home")
      .then(r => r.json())
      .then(data => setStudent(data))
      .catch(() => setStudent(MOCK_STUDENT))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 40 }}>🧮</div>
        <div style={{ color: "#94A3B8", fontSize: 15, fontWeight: 600 }}>Loading your dashboard…</div>
      </div>
    );
  }
  if (!student) return null;

  const activeEnrollment = student.enrollments.find(e => e.status === "in_progress") ?? student.enrollments[0];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <TopBar student={student} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* Hero resume */}
        {activeEnrollment && <HeroBanner enrollment={activeEnrollment} />}

        {/* Stats strip */}
        <StatsRow student={student} enrollment={activeEnrollment} />

        {/* My Courses */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A" }}>My Courses</div>
            <a href="/mindsutra" style={{ color: "#F97316", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Browse more →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {student.enrollments.map(e => (
              <CourseCard key={e.courseId} enrollment={e} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <RecentActivity sessions={student.recentSessions} />

      </main>

      {/* Floating doubt button */}
      {activeEnrollment && (
        <a href={`/ai-tutor/demo?grade=${activeEnrollment.grade}&chapter=${activeEnrollment.currentChapter}&fresh=0#doubt`} style={{ position: "fixed", bottom: 28, right: 24, background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 14, borderRadius: 99, padding: "12px 20px", textDecoration: "none", boxShadow: "0 4px 16px rgba(249,115,22,0.5)", display: "flex", alignItems: "center", gap: 6, zIndex: 200 }}>
          💬 Ask Doubt
        </a>
      )}
    </div>
  );
}
