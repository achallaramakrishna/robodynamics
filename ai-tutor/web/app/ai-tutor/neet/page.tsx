"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SUBJECT_CONFIG,
  NEET_EXAM_CONFIG,
  ALL_NEET_CHAPTERS,
  type SubjectConfig,
  type NeetSubject,
} from "../../../lib/neetChapters";
import { getStudentStatus } from "../../../lib/neetPlanEngine";

// --- Helpers ------------------------------------------------------------------
function daysToNEET(): number {
  const target = new Date(NEET_EXAM_CONFIG.targetDate);
  const today = new Date();
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Mock progress from localStorage (will be real API later)
function getSubjectProgress(subject: NeetSubject): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(`neet_progress_${subject}`) || "0", 10);
}

function getStudyStreak(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("neet_streak") || "0", 10);
}

// --- Sub-components -----------------------------------------------------------

function MeeraAvatar({ speaking }: { speaking: boolean }) {
  return (
    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "linear-gradient(135deg, #6D28D9, #8B5CF6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, fontWeight: 900, border: "3px solid #8B5CF6",
        color: "#fff", letterSpacing: -1,
        boxShadow: speaking ? "0 0 0 4px rgba(139,92,246,0.3)" : "none",
        animation: speaking ? "pulse 2s infinite" : "none",
      }}>
        M
      </div>
      <div style={{
        position: "absolute", bottom: 2, right: 2,
        width: 16, height: 16, borderRadius: "50%",
        background: "#10B981", border: "2px solid #0F172A",
      }} />
    </div>
  );
}

function SubjectCard({
  subject,
  onSelect,
  selected,
  progress,
}: {
  subject: SubjectConfig;
  onSelect: () => void;
  selected: boolean;
  progress: number;
}) {
  const [hovered, setHovered] = useState(false);
  const chapterCount = subject.chapters.length;
  const completedChapters = Math.floor((progress / 100) * chapterCount);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected
          ? `${subject.color}22`
          : hovered
          ? "#1E293B"
          : "#0F172A",
        border: `2px solid ${selected || hovered ? subject.color : "#1E293B"}`,
        borderRadius: 16,
        padding: "24px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered || selected ? "translateY(-3px)" : "none",
        boxShadow: selected
          ? `0 8px 32px ${subject.color}40`
          : hovered
          ? `0 4px 16px ${subject.color}20`
          : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Weight badge */}
      <div style={{
        position: "absolute", top: 12, right: 12,
        background: "#0F172A", borderRadius: 20,
        padding: "3px 10px", fontSize: 11, fontWeight: 700,
        color: subject.color, border: `1px solid ${subject.color}40`,
      }}>
        {subject.questions}Q ? {subject.marks}M
      </div>

      <div style={{ fontSize: 48, marginBottom: 12 }}>{subject.emoji}</div>
      <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
        {subject.label}
      </div>
      <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
        {chapterCount} chapters ? {subject.chapters.reduce((s, c) => s + c.estimatedMinutes, 0)} min
      </div>

      {/* Progress bar */}
      <div style={{ background: "#1E293B", borderRadius: 99, height: 6, marginBottom: 8 }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          background: subject.bgGradient,
          borderRadius: 99,
          transition: "width 0.6s ease",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
        <span>{completedChapters}/{chapterCount} chapters</span>
        <span style={{ color: subject.color, fontWeight: 700 }}>{progress}%</span>
      </div>

      {/* Top chapters preview */}
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        {subject.chapters
          .filter((c) => c.neetWeight === 5)
          .slice(0, 3)
          .map((c) => (
            <div key={c.chapterCode} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 11, color: "#94a3b8",
            }}>
              <span style={{ color: "#F59E0B", fontSize: 9 }}>&#9733;</span>
              {c.title}
            </div>
          ))}
      </div>
    </div>
  );
}

function StatPill({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: "#0F172A", border: "1px solid #1E293B",
      borderRadius: 99, padding: "8px 16px",
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 800, color, lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}

// --- Chapter Picker Modal -----------------------------------------------------
function ChapterPicker({
  subject,
  onStart,
  onClose,
}: {
  subject: SubjectConfig;
  onStart: (chapterCode: string) => void;
  onClose: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#0F172A", border: `1px solid ${subject.color}40`,
        borderRadius: 20, maxWidth: 600, width: "100%",
        maxHeight: "80vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: `0 24px 64px ${subject.color}20`,
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #1E293B",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: subject.color, fontWeight: 800, fontSize: 18 }}>
              {subject.emoji} {subject.label} ? Select Chapter
            </div>
            <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>
              &#9733; = asked every NEET year
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer" }}
          >
            ?
          </button>
        </div>

        {/* Chapter list */}
        <div style={{ overflowY: "auto", padding: "12px 24px 24px" }}>
          {subject.chapters.map((ch) => (
            <div
              key={ch.chapterCode}
              onClick={() => onStart(ch.chapterCode)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 14px", borderRadius: 10,
                border: "1px solid #1E293B", marginTop: 8,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#1E293B";
                (e.currentTarget as HTMLDivElement).style.borderColor = subject.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#1E293B";
              }}
            >
              {/* Stars */}
              <div style={{ flexShrink: 0, fontSize: 10 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} style={{ color: i < ch.neetWeight ? "#F59E0B" : "#1E293B" }}>?</span>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>{ch.title}</div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>
                  NCERT Class {ch.ncertClass} ? Ch {ch.ncertChapter} ? ~{ch.avgQuestionsPerYear} Q/yr ? {ch.estimatedMinutes} min
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {ch.highYieldTags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{
                      background: `${subject.color}15`, color: subject.color,
                      borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 600,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{
                flexShrink: 0, background: subject.bgGradient,
                color: "#fff", borderRadius: 8,
                padding: "6px 12px", fontSize: 12, fontWeight: 700,
              }}>
                Start ?
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Page ----------------------------------------------------------------
export default function NeetAiTutorPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<NeetSubject | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [routeReady, setRouteReady] = useState(false);

  // All hooks must be declared before any conditional return
  const [progress, setProgress] = useState<Record<NeetSubject, number>>({
    physics: 0, chemistry: 0, biology: 0,
  });
  const [streak, setStreak] = useState(0);
  const [meeraMessage, setMeeraMessage] = useState("");

  // -- DB-driven routing: clearing the DB fully resets the student ------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Safety: if status check hangs >6s, send to register
      router.replace("/ai-tutor/neet/register");
    }, 6000);

    (async () => {
      try {
        const { registered, onboarded, hasDiagnostic } = await getStudentStatus();
        clearTimeout(timeout);
        if (!registered)    { router.replace("/ai-tutor/neet/register");   return; }
        if (!onboarded)     { router.replace("/ai-tutor/neet/onboarding");  return; }
        if (!hasDiagnostic) { router.replace("/ai-tutor/neet/diagnostic");  return; }
        setRouteReady(true);
      } catch {
        clearTimeout(timeout);
        router.replace("/ai-tutor/neet/register");
      }
    })();

    return () => clearTimeout(timeout);
  }, [router]);

  useEffect(() => {
    if (!routeReady) return;
    setProgress({
      physics: getSubjectProgress("physics"),
      chemistry: getSubjectProgress("chemistry"),
      biology: getSubjectProgress("biology"),
    });
    setStreak(getStudyStreak());

    const msgs = [
      "Ready to crack NEET 2027? Let's start with your weakest subject first!",
      "Remember: Biology is 50% of NEET. Even 10 mins of revision helps.",
      "Consistency beats intensity. 2 hours daily for 365 days beats a last-minute sprint.",
      "Every question you get wrong today is one you won't miss on exam day.",
      "NEET is not about memorising ? it's about understanding. Let me show you.",
    ];
    setMeeraMessage(msgs[Math.floor(Math.random() * msgs.length)]);
  }, [routeReady]);

  if (!routeReady) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #334155", borderTop: "4px solid #8B5CF6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const selectedConfig = SUBJECT_CONFIG.find((s) => s.id === selectedSubject);

  function handleStartSession(chapterCode: string) {
    router.push(`/ai-tutor/neet/session?subject=${selectedSubject}&chapter=${chapterCode}`);
  }

  const totalProgress = Math.round(
    (progress.physics + progress.chemistry + progress.biology) / 3
  );
  const days = daysToNEET();
  const predictedScore = Math.round(
    (progress.physics * 0.25 + progress.chemistry * 0.25 + progress.biology * 0.5) * 7.2
  );

  return (
    <div style={{
      background: "#030712", minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif", color: "#F8FAFC",
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.4)} 50%{box-shadow:0 0 0 12px rgba(139,92,246,0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 99px; }
      `}</style>

      {/* Nav */}
      <nav style={{
        background: "#0F172A", borderBottom: "1px solid #1E293B",
        position: "sticky", top: 0, zIndex: 100, padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", alignItems: "center", height: 56, gap: 16,
        }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 20 }}>??</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>RoboDynamics</span>
          </a>
          <span style={{ color: "#1E293B" }}>|</span>
          <span style={{ color: "#8B5CF6", fontWeight: 700, fontSize: 13 }}>?? NEET AI Tutor</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <a href="/neet" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>? Catalog</a>
            <a href="/student" style={{
              background: "#1E293B", border: "1px solid #334155",
              color: "#F8FAFC", borderRadius: 6, padding: "5px 14px",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>My Progress</a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* MEERA greeting card */}
        <div style={{
          background: "linear-gradient(135deg, #1E1035, #0F172A)",
          border: "1px solid #6D28D9",
          borderRadius: 20, padding: "24px 28px",
          display: "flex", alignItems: "center", gap: 20,
          marginBottom: 28, animation: "fadeIn 0.4s ease",
          boxShadow: "0 4px 32px rgba(109,40,217,0.15)",
        }}>
          <MeeraAvatar speaking={!!meeraMessage} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#8B5CF6", fontWeight: 700, fontSize: 12, marginBottom: 4, letterSpacing: 0.5 }}>
              MEERA ? NEET AI TUTOR
            </div>
            <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>
              {getGreeting()}! {meeraMessage}
            </div>
          </div>
          <div style={{
            flexShrink: 0, textAlign: "center",
            background: "#0F172A", border: "1px solid #1E293B",
            borderRadius: 14, padding: "14px 20px",
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: days < 100 ? "#EF4444" : "#F59E0B" }}>
              {days}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Days to<br />NEET 2027</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32,
          animation: "fadeIn 0.5s ease 0.1s both",
        }}>
          <StatPill icon="??" label="Overall Progress" value={`${totalProgress}%`} color="#8B5CF6" />
          <StatPill icon="??" label="Study Streak" value={`${streak} days`} color="#F59E0B" />
          <StatPill icon="??" label="Est. NEET Score" value={`${predictedScore}/720`} color="#10B981" />
          <StatPill icon="??" label="Chapters Done" value={`${Math.round(totalProgress * 0.31)}/31`} color="#3B82F6" />
          <StatPill icon="??" label="Negative Marks Rule" value="-1 per wrong" color="#EF4444" />
        </div>

        {/* Section title */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>
            Choose Your Subject
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "6px 0 0" }}>
            Click a subject to see chapters. &#9733; chapters are asked every NEET year.
          </p>
        </div>

        {/* Subject cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20, marginBottom: 36,
          animation: "fadeIn 0.5s ease 0.2s both",
        }}>
          {SUBJECT_CONFIG.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              selected={selectedSubject === subject.id}
              progress={progress[subject.id]}
              onSelect={() => {
                setSelectedSubject(subject.id);
                setShowPicker(true);
              }}
            />
          ))}
        </div>

        {/* Quick actions */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12, animation: "fadeIn 0.5s ease 0.3s both",
        }}>
          {[
            { icon: "??", label: "Mock Test", sub: "180 Qs ? 200 min ? Full NEET simulation", color: "#EF4444", href: "/ai-tutor/neet/mock-test" },
            { icon: "??", label: "Flashcards", sub: "Auto-generated from your wrong answers", color: "#F59E0B", href: "/ai-tutor/neet/flashcards" },
            { icon: "??", label: "Weak Chapters", sub: "Chapters needing more practice", color: "#3B82F6", href: "/ai-tutor/neet/weak-areas" },
            { icon: "??", label: "Progress Report", sub: "Chapter-wise accuracy and trend", color: "#10B981", href: "/ai-tutor/neet/progress" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              style={{
                background: "#0F172A", border: "1px solid #1E293B",
                borderRadius: 14, padding: "16px 18px",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = action.color;
                (e.currentTarget as HTMLAnchorElement).style.background = "#0F172A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E293B";
              }}
            >
              <span style={{ fontSize: 28 }}>{action.icon}</span>
              <div>
                <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 14 }}>{action.label}</div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{action.sub}</div>
              </div>
            </a>
          ))}
        </div>

        {/* High-yield quick facts */}
        <div style={{
          marginTop: 32, background: "#0F172A", border: "1px solid #1E293B",
          borderRadius: 16, padding: "20px 24px",
          animation: "fadeIn 0.5s ease 0.4s both",
        }}>
          <div style={{ fontWeight: 800, color: "#F8FAFC", marginBottom: 14, fontSize: 15 }}>
            ?? Top High-Yield Chapters (Asked Every Year)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ALL_NEET_CHAPTERS.filter((c) => c.neetWeight === 5).map((c) => {
              const subj = SUBJECT_CONFIG.find((s) => s.id === c.subject)!;
              return (
                <span
                  key={c.chapterCode}
                  onClick={() => {
                    setSelectedSubject(c.subject);
                    setShowPicker(true);
                  }}
                  style={{
                    background: `${subj.color}18`, color: subj.color,
                    border: `1px solid ${subj.color}40`,
                    borderRadius: 99, padding: "4px 12px",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {subj.emoji} {c.title}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chapter Picker Modal */}
      {showPicker && selectedConfig && (
        <ChapterPicker
          subject={selectedConfig}
          onStart={handleStartSession}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
