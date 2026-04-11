"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loadProfileFromDb, loadDiagnosticFromDb, generateLessonPlan,
  type LessonPlan, type StudentProfile, type DiagnosticResult,
  type NeetSubject, type PlannedChapter, type ChapterPriority,
} from "../../../../lib/neetPlanEngine";

// ─── Config ───────────────────────────────────────────────────────────────────
const SUBJECT_CONFIG = {
  physics:   { label: "Physics",   emoji: "⚡", color: "#3B82F6", bg: "#1E3A5F" },
  chemistry: { label: "Chemistry", emoji: "🧪", color: "#10B981", bg: "#064E3B" },
  biology:   { label: "Biology",   emoji: "🧬", color: "#8B5CF6", bg: "#2E1065" },
};

const PRIORITY_CONFIG: Record<ChapterPriority, { label: string; color: string; bg: string; icon: string }> = {
  critical: { label: "Critical",  color: "#EF4444", bg: "#450A0A", icon: "🔴" },
  weak:     { label: "Weak",      color: "#F59E0B", bg: "#451A03", icon: "🟡" },
  medium:   { label: "Medium",    color: "#3B82F6", bg: "#1E3A5F", icon: "🔵" },
  strong:   { label: "Strong",    color: "#10B981", bg: "#064E3B", icon: "🟢" },
};

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{ background: "#1E293B", borderRadius: 12, padding: "16px 18px", flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 800, color: "#8B5CF6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, marginTop: 24 }}>
      {children}
    </div>
  );
}

// ─── Feedback Widget ────────────────────────────────────────────────────────
function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const handleSubmit = async () => {
    if(!text.trim()) return;
    setStatus("loading");
    try {
      const key = typeof window !== "undefined" ? localStorage.getItem("meera_session_key") || "anonymous" : "anonymous";
      await fetch("/api/neet/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, requestText: text })
      });
      setStatus("success");
      setTimeout(() => { setIsOpen(false); setStatus("idle"); setText(""); }, 2000);
    } catch(e) {
      setStatus("error");
    }
  };

  if(!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        style={{ position: "fixed", bottom: 20, right: 20, background: "#8B5CF6", color: "#fff", padding: "12px 20px", borderRadius: 30, border: "1px solid #7C3AED", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)", zIndex: 100 }}>
        💡 Talk to MEERA
      </button>
    )
  }

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, width: 320, background: "#1E293B", borderRadius: 16, border: "1px solid #334155", padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", zIndex: 100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 800, color: "#fff" }}>Tell MEERA what to learn</div>
        <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 16 }}>×</button>
      </div>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16, lineHeight: 1.4 }}>
        What do you expect from MEERA? (e.g. "Explain physics diagrams", "Add a reminder feature")
      </p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your feature request or feedback..."
        style={{ width: "100%", background: "#0F172A", border: "1px solid #334155", borderRadius: 8, padding: 12, color: "#fff", minHeight: 80, fontSize: 13, marginBottom: 12, resize: "none" }}
      />
      <button 
        onClick={handleSubmit} 
        disabled={status === "loading" || status === "success"}
        style={{ width: "100%", background: status === "success" ? "#10B981" : "#8B5CF6", color: "#fff", padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}>
        {status === "loading" ? "Sending..." : status === "success" ? "✓ Request Sent!" : "Submit Request"}
      </button>
    </div>
  )
}

// ─── Heat Map ─────────────────────────────────────────────────────────────────
function HeatMap({ chapters }: { chapters: PlannedChapter[] }) {
  const [activeSubj, setActiveSubj] = useState<NeetSubject>("biology");
  const filtered = chapters.filter((c) => c.subject === activeSubj)
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {(["biology", "physics", "chemistry"] as NeetSubject[]).map((s) => (
          <button key={s} onClick={() => setActiveSubj(s)}
            style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, border: "1px solid",
              borderColor: activeSubj === s ? SUBJECT_CONFIG[s].color : "#334155",
              background: activeSubj === s ? SUBJECT_CONFIG[s].bg : "#1E293B",
              color: activeSubj === s ? SUBJECT_CONFIG[s].color : "#64748B" }}>
            {SUBJECT_CONFIG[s].emoji} {SUBJECT_CONFIG[s].label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((ch) => {
          const pCfg = PRIORITY_CONFIG[ch.priority];
          const barW = Math.max(4, ch.accuracy);
          return (
            <div key={ch.chapterCode} style={{ background: "#1E293B", borderRadius: 8, padding: "10px 14px", border: `1px solid ${pCfg.color}30` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13 }}>{pCfg.icon}</span>
                  <span style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 600 }}>{ch.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#64748B" }}>Wk {ch.weekAssigned}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: pCfg.color }}>{ch.accuracy}%</span>
                </div>
              </div>
              <div style={{ height: 4, background: "#0F172A", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${barW}%`, background: pCfg.color, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Today's Plan Card ────────────────────────────────────────────────────────
function TodayCard({ plan, onStartChapter }: { plan: LessonPlan; onStartChapter: (subject: string, chapterCode: string) => void }) {
  const today = plan.todayPlan;
  const subjColors: Record<string, string> = { physics: "#3B82F6", chemistry: "#10B981", biology: "#8B5CF6" };
  const subjEmoji: Record<string, string> = { physics: "⚡", chemistry: "🧪", biology: "🧬" };
  const typeLabels: Record<string, string> = {
    new_concept: "📖 New Concept", practice: "✏️ Practice", revision: "🔄 Revision",
    mock_test: "📝 Mock Test", doubt_clearing: "💬 Doubt Clearing",
  };

  return (
    <div>
      {/* What to do banner */}
      <div style={{ background: "linear-gradient(135deg,#1E1B4B,#2E1065)", border: "1px solid #7C3AED60", borderRadius: 14, padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 32, flexShrink: 0 }}>👆</div>
        <div>
          <div style={{ fontWeight: 800, color: "#C4B5FD", fontSize: 14, marginBottom: 4 }}>What to do today</div>
          <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>
            Click <strong style={{ color: "#A78BFA" }}>Start Chapter →</strong> on any session below to begin practising. Start with the morning session first.
          </div>
        </div>
      </div>

      <div style={{ background: "#1E293B", borderRadius: 14, padding: 20, border: "1px solid #334155" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 800, color: "#F8FAFC", fontSize: 15 }}>📅 Today's Study Sessions</div>
          <div style={{ fontSize: 12, color: "#64748B" }}>{today.estimatedMinutes} min · {today.questionTarget} questions</div>
        </div>
        {today.sessions.length === 0 ? (
          <div style={{ color: "#64748B", fontSize: 13, textAlign: "center", padding: "16px 0" }}>Complete your diagnostic to get today's plan.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {today.sessions.map((s, i) => {
              const color = subjColors[s.subject] || "#8B5CF6";
              return (
                <div key={i} style={{ background: "#0F172A", borderRadius: 12, border: `1px solid ${color}30`, overflow: "hidden" }}>
                  {/* Session header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: `1px solid ${color}20`, background: `${color}10` }}>
                    <span style={{ fontSize: 16 }}>{s.time === "morning" ? "🌅" : "🌆"}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {s.time === "morning" ? "Morning Session" : "Evening Session"}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569", fontWeight: 600 }}>{s.durationMinutes} min</span>
                  </div>
                  {/* Session body */}
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 28, flexShrink: 0 }}>{subjEmoji[s.subject] || "📚"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 2 }}>{typeLabels[s.type]}</div>
                      <div style={{ fontSize: 14, color: "#F8FAFC", fontWeight: 700, marginBottom: 2 }}>{s.chapterTitle}</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{s.description}</div>
                    </div>
                    <button
                      onClick={() => onStartChapter(s.subject, s.chapterCode)}
                      style={{
                        flexShrink: 0, padding: "10px 16px", background: color,
                        border: "none", borderRadius: 10, color: "#fff",
                        fontSize: 13, fontWeight: 800, cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Start →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Phase Progress ───────────────────────────────────────────────────────────
function PhaseBar({ plan }: { plan: LessonPlan }) {
  const currentWeek = 1; // TODO: track actual current week
  const pct = (currentWeek / plan.totalWeeks) * 100;
  const currentPhase = plan.phases[0];

  return (
    <div style={{ background: "#1E293B", borderRadius: 14, padding: 18, border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 800, color: "#F8FAFC", fontSize: 15 }}>
            Phase 1: <span style={{ color: currentPhase.color }}>{currentPhase.name}</span>
          </div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{currentPhase.description}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC" }}>{plan.daysToNeet}</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>days to NEET</div>
        </div>
      </div>

      <div style={{ height: 8, background: "#0F172A", borderRadius: 4, marginBottom: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,#7C3AED,#8B5CF6)`, borderRadius: 4, transition: "width 0.5s" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {plan.phases.map((p, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? p.color : "#334155", margin: "0 auto 4px" }} />
            <div style={{ fontSize: 9, color: i === 0 ? p.color : "#334155", fontWeight: 700, whiteSpace: "nowrap" }}>{p.name.split(" ")[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Monthly Milestones ───────────────────────────────────────────────────────
function MonthlyPlan({ plan }: { plan: LessonPlan }) {
  const [expanded, setExpanded] = useState<number | null>(0);
  return (
    <div>
      {plan.monthly.map((m) => (
        <div key={m.month} style={{ background: "#1E293B", borderRadius: 10, marginBottom: 8, overflow: "hidden", border: "1px solid #334155" }}>
          <div onClick={() => setExpanded(expanded === m.month ? null : m.month)}
            style={{ display: "flex", alignItems: "center", padding: "12px 16px", cursor: "pointer", gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#8B5CF6" }}>
              M{m.month}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>{m.label}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{m.focusArea} · Target: {m.scoreTarget}/720</div>
            </div>
            <div style={{ fontSize: 13, color: "#10B981", fontWeight: 800 }}>{m.scoreTarget}</div>
            <div style={{ color: "#475569" }}>{expanded === m.month ? "▲" : "▼"}</div>
          </div>
          {expanded === m.month && (
            <div style={{ borderTop: "1px solid #334155", padding: "12px 16px" }}>
              {m.weeklyTargets.map((w) => (
                <div key={w.weekNumber} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>Week {w.weekNumber}: {w.startDate} → {w.endDate}</span>
                    {w.mockTest && <span style={{ fontSize: 10, background: "#7C3AED20", color: "#8B5CF6", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>📝 {w.mockTestType} mock</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {w.chapters.slice(0, 4).map((c) => (
                      <span key={c.chapterCode} style={{ fontSize: 11, background: "#0F172A", color: PRIORITY_CONFIG[c.priority].color, padding: "3px 8px", borderRadius: 4, border: `1px solid ${PRIORITY_CONFIG[c.priority].color}30` }}>
                        {PRIORITY_CONFIG[c.priority].icon} {c.title.length > 18 ? c.title.slice(0, 18) + "…" : c.title}
                      </span>
                    ))}
                    {w.chapters.length > 4 && <span style={{ fontSize: 11, color: "#475569" }}>+{w.chapters.length - 4} more</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "plan" | "heatmap" | "mocks">("today");
  const [studentClass, setStudentClass] = useState<string | null>(null);

  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadError("Taking too long. Check your connection and try again.");
    }, 8000);

    (async () => {
      try {
        const [prof, diag, status] = await Promise.all([
          loadProfileFromDb(),
          loadDiagnosticFromDb(),
          fetch(`/api/neet/status?key=${encodeURIComponent(localStorage.getItem("meera_session_key") ?? "")}`).then(r => r.json()).catch(() => ({})),
        ]);
        clearTimeout(timeout);
        if (!prof) { router.push("/ai-tutor/neet/onboarding"); return; }
        if (!diag) { router.push("/ai-tutor/neet/diagnostic"); return; }
        setProfile(prof);
        setDiagnostic(diag);
        setStudentClass(status.studentClass ?? null);
        setPlan(generateLessonPlan(prof, diag, 600));
      } catch {
        clearTimeout(timeout);
        setLoadError("Failed to load dashboard. Please try again.");
      }
    })();

    return () => clearTimeout(timeout);
  }, [router]);

  if (!profile || !diagnostic || !plan) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        {loadError ? (
          <>
            <div style={{ color: "#FCA5A5", fontSize: 14, background: "#450A0A", padding: "12px 20px", borderRadius: 10, maxWidth: 320, textAlign: "center" }}>⚠ {loadError}</div>
            <button onClick={() => window.location.reload()} style={{ padding: "10px 24px", background: "#7C3AED", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Reload</button>
            <button onClick={() => router.push("/ai-tutor/neet/register")} style={{ background: "none", border: "none", color: "#64748B", fontSize: 13, cursor: "pointer" }}>← Start over</button>
          </>
        ) : (
          <>
            <div style={{ width: 40, height: 40, border: "4px solid #334155", borderTop: "4px solid #8B5CF6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ color: "#64748B", fontSize: 13 }}>Loading your dashboard…</div>
          </>
        )}
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const daysLeft = daysUntil(profile.neetDate);
  const scoreGap = 600 - diagnostic.estimatedScore;
  const criticalCount = plan.orderedChapters.filter((c) => c.priority === "critical").length;
  const weakCount = plan.orderedChapters.filter((c) => c.priority === "weak").length;

  const tabs = [
    { id: "today", label: "Today", icon: "📅" },
    { id: "plan",  label: "My Plan", icon: "🗺" },
    { id: "heatmap", label: "Heat Map", icon: "🔥" },
    { id: "mocks",  label: "Mocks", icon: "📝" },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #475569; border-radius: 2px; }`}</style>

      {/* Top bar */}
      <div style={{ background: "#1E293B", borderBottom: "1px solid #334155", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 36, objectFit: "contain", background: "#fff", borderRadius: 6, padding: 2 }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#F8FAFC" }}>MEERA · {profile.name}'s Dashboard</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>NEET {profile.targetYear} · {daysLeft} days left</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => router.push("/ai-tutor/neet/pyq")}
            style={{ padding: "7px 14px", background: "#0C2A4A", border: "1px solid #38BDF8", borderRadius: 8, color: "#38BDF8", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            📚 PYQ Practice
          </button>
          <button onClick={() => router.push("/ai-tutor/neet/mock-test")}
            style={{ padding: "7px 14px", background: "#7C3AED", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            📝 Mock Test
          </button>
          <button onClick={() => router.push("/ai-tutor/neet")}
            style={{ padding: "7px 14px", background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#94A3B8", fontSize: 12, cursor: "pointer" }}>
            ← Home
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px" }}>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <StatCard icon="🎯" label="Current Score" value={diagnostic.estimatedScore} sub="out of 720" color="#8B5CF6" />
          <StatCard icon="📈" label="Score Gap" value={`+${scoreGap}`} sub="to reach 600" color="#F59E0B" />
          <StatCard icon="⏳" label="Days Left" value={daysLeft} sub={`NEET ${profile.targetYear}`} color="#3B82F6" />
          <StatCard icon="🔴" label="Critical Chapters" value={criticalCount + weakCount} sub="need urgent focus" color="#EF4444" />
        </div>

        {/* Phase progress */}
        <PhaseBar plan={plan} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 20, marginBottom: 16, background: "#1E293B", borderRadius: 10, padding: 4 }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.15s",
                background: activeTab === t.id ? "#7C3AED" : "transparent",
                color: activeTab === t.id ? "#fff" : "#64748B" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "today" && (
          <div>
            <TodayCard plan={plan} onStartChapter={(subject, chapterCode) => {
              const classParam = studentClass ? `&class=${studentClass}` : "";
              router.push(`/ai-tutor/neet/session?subject=${subject}&chapter=${chapterCode}${classParam}`);
            }} />
            {/* MEERA motivation */}
            <div style={{ background: "linear-gradient(135deg,#1E1B4B,#2E1065)", border: "1px solid #7C3AED50", borderRadius: 12, padding: 16, marginTop: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <img src="/rd-logo.png" alt="MEERA" style={{ height: 36, objectFit: "contain", background: "#fff", borderRadius: 6, padding: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#C4B5FD", marginBottom: 4 }}>MEERA says:</div>
                  <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.6 }}>
                    {diagnostic.estimatedScore < 300
                      ? `Every expert was once a beginner, ${profile.name}. Focus on today's plan — one chapter at a time. Your score will follow. 💪`
                      : diagnostic.estimatedScore < 500
                      ? `You're building real momentum, ${profile.name}! Your ${(Object.entries(diagnostic.subjectAccuracy) as [NeetSubject, number][]).sort((a, b) => b[1] - a[1])[0][0]} accuracy is great. Now let's fix the weak spots. 🚀`
                      : `${profile.name}, you're already in a strong position! Focus on eliminating the last weak chapters and your rank will climb significantly. 🏆`
                    }
                  </div>
                </div>
              </div>
            </div>
            {/* Subject accuracy quick view */}
            <SectionTitle>Subject Accuracy</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {(["biology", "physics", "chemistry"] as NeetSubject[]).map((s) => {
                const acc = diagnostic.subjectAccuracy[s];
                const cfg = SUBJECT_CONFIG[s];
                return (
                  <div key={s} style={{ background: cfg.bg, border: `1px solid ${cfg.color}50`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 22 }}>{cfg.emoji}</div>
                    <div style={{ fontSize: 11, color: cfg.color, fontWeight: 700, marginTop: 2 }}>{cfg.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#F8FAFC" }}>{acc}%</div>
                    <div style={{ height: 3, background: "#0F172A", borderRadius: 2, marginTop: 6 }}>
                      <div style={{ height: "100%", width: `${acc}%`, background: cfg.color, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "plan" && (
          <div>
            <SectionTitle>Monthly Milestones</SectionTitle>
            <MonthlyPlan plan={plan} />
            <SectionTitle>This Week's Chapters</SectionTitle>
            {plan.weekPlan && (
              <div style={{ background: "#1E293B", borderRadius: 12, padding: 16, border: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: "#F8FAFC" }}>Week 1 · {plan.weekPlan.startDate} → {plan.weekPlan.endDate}</div>
                  <div style={{ fontSize: 12, color: "#8B5CF6", fontWeight: 700 }}>Target: {plan.weekPlan.scoreTarget}/720</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.weekPlan.chapters.map((c) => {
                    const pCfg = PRIORITY_CONFIG[c.priority];
                    const sCfg = SUBJECT_CONFIG[c.subject];
                    return (
                      <div key={c.chapterCode} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#0F172A", borderRadius: 8 }}>
                        <span style={{ fontSize: 14 }}>{pCfg.icon}</span>
                        <span style={{ fontSize: 13, color: sCfg.color }}>{sCfg.emoji}</span>
                        <span style={{ fontSize: 13, color: "#E2E8F0", flex: 1 }}>{c.title}</span>
                        <span style={{ fontSize: 11, color: pCfg.color, fontWeight: 700 }}>{pCfg.label}</span>
                        <span style={{ fontSize: 11, color: "#64748B" }}>{c.hoursAllocated}h</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "heatmap" && (
          <div>
            <SectionTitle>Chapter Weakness Heat Map</SectionTitle>
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              {(["critical", "weak", "medium", "strong"] as ChapterPriority[]).map((p) => {
                const cnt = plan.orderedChapters.filter((c) => c.priority === p).length;
                const cfg = PRIORITY_CONFIG[p];
                return (
                  <div key={p} style={{ background: cfg.bg, border: `1px solid ${cfg.color}40`, borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
                    <span style={{ color: cfg.color, fontWeight: 700 }}>{cfg.icon} {cfg.label}</span>
                    <span style={{ color: "#94A3B8", marginLeft: 6 }}>{cnt} chapters</span>
                  </div>
                );
              })}
            </div>
            <HeatMap chapters={plan.orderedChapters} />
          </div>
        )}

        {activeTab === "mocks" && (
          <div>
            <SectionTitle>Mock Test Schedule</SectionTitle>
            <div style={{ background: "#1E293B", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #334155" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", marginBottom: 8 }}>Recommended schedule based on {daysLeft} days to NEET</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {daysLeft > 180 && (
                  <div style={{ padding: "10px 14px", background: "#0F172A", borderRadius: 8, display: "flex", gap: 10 }}>
                    <span style={{ color: "#8B5CF6" }}>📝</span>
                    <div><div style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 600 }}>Chapter-wise tests</div><div style={{ fontSize: 12, color: "#64748B" }}>1 per week per subject — build confidence chapter by chapter</div></div>
                  </div>
                )}
                {daysLeft <= 180 && daysLeft > 90 && (
                  <div style={{ padding: "10px 14px", background: "#0F172A", borderRadius: 8, display: "flex", gap: 10 }}>
                    <span style={{ color: "#3B82F6" }}>📝</span>
                    <div><div style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 600 }}>Subject full mocks</div><div style={{ fontSize: 12, color: "#64748B" }}>1 per week — each subject in full, analyse errors</div></div>
                  </div>
                )}
                {daysLeft <= 90 && (
                  <div style={{ padding: "10px 14px", background: "#0F172A", borderRadius: 8, display: "flex", gap: 10 }}>
                    <span style={{ color: "#EF4444" }}>🔥</span>
                    <div><div style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 600 }}>Full NEET mocks (180Q, 200 min)</div><div style={{ fontSize: 12, color: "#64748B" }}>Every Sunday + mid-week targeted tests</div></div>
                  </div>
                )}
              </div>
            </div>
            {/* PYQ Practice card */}
            <div style={{ background: "#0C1929", border: "1px solid #1E3A5F", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>📚</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#38BDF8" }}>Past Year Questions (PYQ)</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>Chapter-wise NEET PYQs · instant answer reveal</div>
                </div>
              </div>
              <button onClick={() => router.push("/ai-tutor/neet/pyq")}
                style={{ width: "100%", padding: "10px 0", background: "linear-gradient(135deg,#0C2A4A,#1E3A5F)", border: "1px solid #38BDF8", borderRadius: 8, color: "#38BDF8", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Practice PYQs →
              </button>
            </div>

            <button onClick={() => router.push("/ai-tutor/neet/mock-test")}
              style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", border: "none", borderRadius: 10, color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
              📝 Take a Mock Test Now →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
