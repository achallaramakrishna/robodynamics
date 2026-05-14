"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MindSutraBrandFooter, MindSutraBrandHeader } from "@/components/mindsutra/BrandChrome";

type TutorUser = {
  student_name?: string;
  parent_name?: string;
  phone?: string;
  grade?: number | string;
  school_name?: string;
  velocity_score?: number;
  city_rank?: number;
  tutor_stage?: string;
  tutor_summary?: string;
  tutor_next_step?: string;
  tutor_focus_area?: string;
  tutor_sessions_completed?: number;
  tutor_best_score?: number;
  tutor_last_score?: number;
  tutor_avg_score?: number;
  tutor_last_session_at?: string;
};

export default function MindSutraTutorPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<TutorUser | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const saved = localStorage.getItem("ms_challenge_user");
        const stored = saved ? JSON.parse(saved) : null;
        const phone = String(new URLSearchParams(window.location.search).get("phone") || stored?.phone || "").trim();
        if (!phone) {
          setError("Login first or open this page with a phone number.");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/mindsutra/challenge/profile?phone=${encodeURIComponent(phone)}`);
        const data = await res.json();
        if (!res.ok || !data.success || !data.user) {
          throw new Error(data.error || "Progress not available.");
        }

        localStorage.setItem("ms_challenge_user", JSON.stringify(data.user));
        setUser(data.user);
      } catch (e: any) {
        setError(e?.message || "Unable to load tutor progress.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(99,102,241,0.16), transparent 34%), linear-gradient(180deg, #050816 0%, #08111F 48%, #050816 100%)", color: "#E2E8F0", fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <MindSutraBrandHeader
          eyebrow="RoboDynamics"
          title="MindSutra Tutor Dashboard"
          subtitle="Progress, guidance, and the next best step for the student"
        />

        {loading ? (
          <div style={{ background: "rgba(7,15,26,0.9)", border: "1px solid #1E3A5F", borderRadius: 28, padding: 36, textAlign: "center", marginTop: 20 }}>
            <div style={{ width: 42, height: 42, margin: "0 auto 14px", borderRadius: "50%", border: "3px solid #8B5CF6", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
            <div style={{ color: "#A5B4FC", fontWeight: 800, letterSpacing: 0.12, textTransform: "uppercase", fontSize: 12 }}>Loading tutor progress</div>
          </div>
        ) : error || !user ? (
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "minmax(0, 1fr)", marginTop: 20 }}>
            <div style={{ background: "rgba(7,15,26,0.9)", border: "1px solid #1E3A5F", borderRadius: 28, padding: 30 }}>
              <h1 style={{ margin: "0 0 12px", color: "#F8FAFC", fontSize: 28, fontWeight: 900 }}>Login required</h1>
              <p style={{ margin: "0 0 18px", color: "#94A3B8", fontSize: 15, lineHeight: 1.7 }}>
                Open this dashboard after login, or share the phone number as a query string when sending it manually.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="/mindsutra/login" style={{ background: "linear-gradient(90deg, #6366F1, #8B5CF6)", color: "#fff", textDecoration: "none", fontWeight: 800, borderRadius: 12, padding: "14px 22px" }}>
                  Login
                </a>
                <a href="/auth/register?source=mindsutra" style={{ background: "transparent", color: "#A5B4FC", textDecoration: "none", fontWeight: 700, borderRadius: 12, padding: "14px 22px", border: "1px solid #1E3A5F" }}>
                  Register
                </a>
                <a href="/mindsutra/challenge" style={{ background: "transparent", color: "#A5B4FC", textDecoration: "none", fontWeight: 700, borderRadius: 12, padding: "14px 22px", border: "1px solid #1E3A5F" }}>
                  Dashboard
                </a>
              </div>
              {error && (
                <div style={{ marginTop: 16, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#FCA5A5", borderRadius: 14, padding: 12, fontSize: 14 }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)", gap: 24, marginTop: 20, alignItems: "start" }}>
              <div style={{ background: "rgba(7,15,26,0.9)", border: "1px solid #1E3A5F", borderRadius: 28, padding: 30, boxShadow: "0 28px 70px rgba(0,0,0,0.35)" }}>
                <div style={{ color: "#A5B4FC", fontSize: 12, fontWeight: 800, letterSpacing: 0.16, textTransform: "uppercase", marginBottom: 8 }}>Student Summary</div>
                <h1 style={{ margin: "0 0 8px", color: "#F8FAFC", fontSize: 34, fontWeight: 900 }}>{user.student_name || "Student"}</h1>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: 15, lineHeight: 1.7 }}>
                  {user.parent_name ? `Parent: ${user.parent_name}` : "Parent account active"} · {user.school_name || "School not added"}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginTop: 22 }}>
                  {[
                    { label: "Tutor Stage", value: user.tutor_stage || "Getting Started" },
                    { label: "Velocity Score", value: String(user.velocity_score || 0) },
                    { label: "City Rank", value: `#${user.city_rank || 1}` },
                    { label: "Sessions", value: String(user.tutor_sessions_completed || 0) },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "#0B1220", border: "1px solid #1E293B", borderRadius: 16, padding: 16 }}>
                      <div style={{ color: "#64748B", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.08 }}>{item.label}</div>
                      <div style={{ marginTop: 8, color: "#F8FAFC", fontSize: 18, fontWeight: 900 }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 22, background: "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.28)", borderRadius: 20, padding: 18 }}>
                  <div style={{ color: "#A5B4FC", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.12, marginBottom: 8 }}>Tutor Summary</div>
                  <div style={{ color: "#CBD5E1", fontSize: 15, lineHeight: 1.8 }}>
                    {user.tutor_summary || "Student is ready for the first diagnostic and foundation lesson."}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ background: "rgba(7,15,26,0.9)", border: "1px solid #1E3A5F", borderRadius: 28, padding: 24 }}>
                  <div style={{ color: "#A5B4FC", fontSize: 12, fontWeight: 800, letterSpacing: 0.16, textTransform: "uppercase", marginBottom: 8 }}>Next Step</div>
                  <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 900, lineHeight: 1.25 }}>
                    {user.tutor_next_step || "Start the foundation lesson and capture a baseline score."}
                  </div>
                  <p style={{ marginTop: 12, color: "#94A3B8", fontSize: 14, lineHeight: 1.7 }}>
                    The tutor updates after each session and changes the recommendation based on performance.
                  </p>
                </div>

                <div style={{ background: "rgba(7,15,26,0.9)", border: "1px solid #1E3A5F", borderRadius: 28, padding: 24 }}>
                  <div style={{ color: "#A5B4FC", fontSize: 12, fontWeight: 800, letterSpacing: 0.16, textTransform: "uppercase", marginBottom: 8 }}>Focus Area</div>
                  <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, lineHeight: 1.4 }}>
                    {user.tutor_focus_area || "Foundation and number sense"}
                  </div>
                  <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                    {[
                      { label: "Best Score", value: String(user.tutor_best_score || 0) },
                      { label: "Last Score", value: String(user.tutor_last_score || user.velocity_score || 0) },
                      { label: "Average Score", value: Number(user.tutor_avg_score || 0).toFixed(2) },
                    ].map((item) => (
                      <div key={item.label} style={{ background: "#0B1220", border: "1px solid #1E293B", borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ color: "#94A3B8", fontSize: 13, fontWeight: 700 }}>{item.label}</span>
                        <span style={{ color: "#F8FAFC", fontSize: 14, fontWeight: 900 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href="/mindsutra/challenge" style={{ background: "linear-gradient(90deg, #6366F1, #8B5CF6)", color: "#fff", textDecoration: "none", fontWeight: 800, borderRadius: 12, padding: "14px 22px" }}>
                    Open Dashboard
                  </a>
                  <a href="/mindsutra/challenge/play" style={{ background: "transparent", color: "#A5B4FC", textDecoration: "none", fontWeight: 700, borderRadius: 12, padding: "14px 22px", border: "1px solid #1E3A5F" }}>
                    Start Session
                  </a>
                  <a href="/mindsutra/login" style={{ background: "transparent", color: "#A5B4FC", textDecoration: "none", fontWeight: 700, borderRadius: 12, padding: "14px 22px", border: "1px solid #1E3A5F" }}>
                    Switch Login
                  </a>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <MindSutraBrandFooter
                note="Mindsutra by RoboDynamics"
                links={[
                  { label: "Home", href: "/mindsutra" },
                  { label: "Register", href: "/auth/register?source=mindsutra" },
                  { label: "Login", href: "/mindsutra/login" },
                ]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
