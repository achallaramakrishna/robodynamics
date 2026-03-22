"use client";

import { useMemo } from "react";

type CourseHubData = {
  childName: string;
  courseName: string;
  tagline: string;
  grade: number;
  gradeSlug: string;
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter: string;
  currentChapterName: string;
  accuracy: number;
  xp: number;
  streak: number;
  chapters: Array<{
    code: string;
    title: string;
    durationMin: number;
    freePreview: boolean;
    num: number;
    status: string;
  }>;
};

export default function StudentCourseHubClient({ hub }: { hub: CourseHubData }) {
  const progressPct = useMemo(
    () => Math.round((hub.chaptersCompleted / hub.totalChapters) * 100),
    [hub.chaptersCompleted, hub.totalChapters],
  );

  const currentStartHref = `/ai-tutor/demo?grade=${hub.grade}&chapter=${hub.currentChapter}&fresh=1&enrolled=1`;
  const currentContinueHref = `/ai-tutor/demo?grade=${hub.grade}&chapter=${hub.currentChapter}&fresh=0&enrolled=1`;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: "#0F172A", color: "#F8FAFC", padding: "16px 20px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Course Hub</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{hub.courseName}</div>
          <div style={{ color: "#CBD5E1", fontSize: 14, marginTop: 4 }}>{hub.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/student/home" style={{ color: "#CBD5E1", textDecoration: "none", fontWeight: 600 }}>Student Dashboard</a>
          <a href="/parent/dashboard" style={{ color: "#F97316", textDecoration: "none", fontWeight: 700 }}>Parent Dashboard</a>
        </div>
      </div>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 48px" }}>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
          <div style={{ background: "linear-gradient(135deg, #F97316, #EA580C)", color: "white", borderRadius: 18, padding: 24, boxShadow: "0 14px 30px rgba(249,115,22,0.22)" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, opacity: 0.85, marginBottom: 8 }}>Start Learning</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{hub.currentChapterName}</div>
            <div style={{ fontSize: 14, opacity: 0.92, marginBottom: 18 }}>Begin Grade {hub.grade} with a guided lesson flow. Start from the beginning for the cleanest experience, or continue only if you intentionally saved progress earlier.</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={currentStartHref}
                style={{ display: "inline-block", background: "white", color: "#F97316", textDecoration: "none", fontWeight: 800, borderRadius: 10, padding: "11px 18px" }}
              >
                Start from beginning
              </a>
              <a
                href={currentContinueHref}
                style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", color: "white", textDecoration: "none", fontWeight: 700, borderRadius: 10, padding: "11px 18px", border: "1px solid rgba(255,255,255,0.28)" }}
              >
                Continue saved session
              </a>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 18, padding: 24, border: "1px solid #E2E8F0", boxShadow: "0 6px 24px rgba(15,23,42,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Progress</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{progressPct}%</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Accuracy</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{hub.accuracy}%</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>XP</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{hub.xp}</div>
              </div>
            </div>
            <div style={{ background: "#E2E8F0", borderRadius: 999, height: 10, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ width: `${progressPct}%`, height: "100%", background: "linear-gradient(90deg, #F97316, #FB7185)" }} />
            </div>
            <div style={{ fontSize: 13, color: "#64748B" }}>Course structure is live. Progress, accuracy, XP, and streak values are still pilot placeholders until real student history is wired end-to-end.</div>
          </div>
        </section>

        <section style={{ background: "white", borderRadius: 18, border: "1px solid #E2E8F0", boxShadow: "0 6px 24px rgba(15,23,42,0.06)", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Lesson Map</div>
              <div style={{ color: "#64748B", fontSize: 14, marginTop: 4 }}>Choose the next lesson from a clear chapter path instead of jumping straight into tutor mode.</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={currentStartHref} style={{ color: "#F97316", fontWeight: 700, textDecoration: "none" }}>Start from beginning</a>
              <a href={currentContinueHref} style={{ color: "#475569", fontWeight: 700, textDecoration: "none" }}>Continue saved session</a>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {hub.chapters.map((chapter) => {
              const color = chapter.status === "completed"
                ? "#16A34A"
                : chapter.status === "current"
                  ? "#F97316"
                  : chapter.status === "available"
                    ? "#2563EB"
                    : "#94A3B8";
              const border = chapter.status === "current" ? `2px solid ${color}` : "1px solid #E2E8F0";
              const continueHref = `/ai-tutor/demo?grade=${hub.grade}&chapter=${chapter.code}&fresh=0&enrolled=1`;
              const startHref = `/ai-tutor/demo?grade=${hub.grade}&chapter=${chapter.code}&fresh=1&enrolled=1`;
              return (
                <div key={chapter.code} style={{ border, borderRadius: 16, padding: 18, background: chapter.status === "locked" ? "#F8FAFC" : "#FFFFFF" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 12, color, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                      Chapter {chapter.num}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{chapter.durationMin} min</div>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", lineHeight: 1.35, marginBottom: 8 }}>{chapter.title}</div>
                  <div style={{ color: "#64748B", fontSize: 13, marginBottom: 14 }}>
                    {chapter.status === "completed" && "Completed. Review anytime."}
                    {chapter.status === "current" && "This is the recommended first lesson for a clean Grade 4 start."}
                    {chapter.status === "available" && "Unlocked and ready to start."}
                    {chapter.status === "locked" && "Unlocks after the current lesson path is finished."}
                  </div>
                  {chapter.status === "locked" ? (
                    <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700 }}>Locked</div>
                  ) : (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <a href={startHref} style={{ color, fontWeight: 800, textDecoration: "none", fontSize: 13 }}>
                        {chapter.status === "completed" ? "Restart lesson ->" : chapter.status === "current" ? "Start from beginning ->" : "Start lesson ->"}
                      </a>
                      {(chapter.status === "completed" || chapter.status === "current") && (
                        <a href={continueHref} style={{ color: "#475569", fontWeight: 700, textDecoration: "none", fontSize: 13 }}>
                          Continue saved session
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
