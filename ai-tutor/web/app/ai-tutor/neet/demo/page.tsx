"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState("");

  const seed = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/neet/seed-demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Seed failed");

      // Set this demo session as the active session
      localStorage.setItem("meera_session_key", data.key);
      setScore(data.estimatedScore);
      setStatus("done");

      // Short pause so user sees the score, then redirect
      setTimeout(() => router.replace("/ai-tutor/neet/dashboard"), 2000);
    } catch (e: any) {
      setError(e.message);
      setStatus("error");
    }
  };

  useEffect(() => { seed(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, color: "#F8FAFC" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pop{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>

      <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 56, objectFit: "contain", marginBottom: 12 }} />
      <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>MEERA Demo</div>
      <div style={{ fontSize: 13, color: "#8B5CF6", fontWeight: 700, marginBottom: 32 }}>NEET AI Tutor · RoboDynamics</div>

      {status === "loading" && (
        <>
          <div style={{ width: 44, height: 44, border: "4px solid #334155", borderTop: "4px solid #8B5CF6", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 16 }} />
          <div style={{ color: "#94A3B8", fontSize: 14 }}>Setting up demo student…</div>
        </>
      )}

      {status === "done" && score !== null && (
        <div style={{ animation: "pop 0.4s ease-out", textAlign: "center" }}>
          <div style={{ background: "#1E293B", borderRadius: 16, padding: "24px 32px", border: "1px solid #334155", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 8 }}>Demo student: <strong style={{ color: "#C4B5FD" }}>Arjun Sharma</strong> · Class 12 · NEET 2026</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Scores: Physics 47% · Chemistry 60% · Biology 80%</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: score >= 500 ? "#10B981" : score >= 380 ? "#F59E0B" : "#EF4444" }}>{score}</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>Estimated NEET Score / 720</div>
          </div>
          <div style={{ color: "#8B5CF6", fontSize: 13, fontWeight: 600 }}>Opening dashboard…</div>
        </div>
      )}

      {status === "error" && (
        <>
          <div style={{ background: "#450A0A", color: "#FCA5A5", borderRadius: 10, padding: "14px 20px", marginBottom: 16, fontSize: 13 }}>⚠ {error}</div>
          <button onClick={seed} style={{ padding: "10px 24px", background: "#7C3AED", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Retry
          </button>
        </>
      )}
    </div>
  );
}
