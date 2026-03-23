"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<"student" | "parent" | null>(null);
  const [error, setError] = useState("");

  const handlePinChange = (val: string, idx: number) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...pin]; next[idx] = v;
    setPin(next);
    if (v && idx < 5) pinRefs.current[idx + 1]?.focus();
  };
  const handlePinKey = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) pinRefs.current[idx - 1]?.focus();
  };

  async function handleLogin() {
    const pinVal = pin.join("");
    if (!identifier.trim()) { setError("Enter your mobile number or email"); return; }
    if (pinVal.length !== 6) { setError("Enter your 6-digit PIN"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, pin: pinVal }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.role === "PARENT") router.push("/parent/dashboard");
        else router.push("/student/home");
      } else {
        setError(data.message ?? "Invalid credentials. Please try again.");
      }
    } catch { setError("Login failed. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleDemoLogin(role: "student" | "parent") {
    setDemoLoading(role);
    setError("");
    // Navigate to the demo route — it sets the cookie and redirects
    window.location.href = `/api/auth/demo?role=${role}`;
  }

  const pinFilled = pin.join("").length === 6;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #F97316, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                🤖
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 20 }}>AptiPath<span style={{ color: "#F97316" }}>360</span></div>
                <div style={{ color: "#64748B", fontSize: 11 }}>AI Tutors for India</div>
              </div>
            </div>
          </a>
        </div>

        {/* Demo Login Cards */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            Try Without Registering
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              onClick={() => handleDemoLogin("student")}
              disabled={!!demoLoading}
              style={{
                background: demoLoading === "student" ? "#1E293B" : "linear-gradient(135deg, #F97316, #EA580C)",
                border: "none", borderRadius: 12, padding: "16px 12px", cursor: "pointer",
                color: "#FFFFFF", textAlign: "center" as const, transition: "opacity 0.2s",
                opacity: demoLoading && demoLoading !== "student" ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>👦</div>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 2 }}>
                {demoLoading === "student" ? "Opening..." : "Student Demo"}
              </div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>Arjun · Grade 4</div>
            </button>

            <button
              onClick={() => handleDemoLogin("parent")}
              disabled={!!demoLoading}
              style={{
                background: demoLoading === "parent" ? "#1E293B" : "linear-gradient(135deg, #7C3AED, #4F46E5)",
                border: "none", borderRadius: 12, padding: "16px 12px", cursor: "pointer",
                color: "#FFFFFF", textAlign: "center" as const, transition: "opacity 0.2s",
                opacity: demoLoading && demoLoading !== "parent" ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>👩</div>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 2 }}>
                {demoLoading === "parent" ? "Opening..." : "Parent Demo"}
              </div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>Sunita · Dashboard</div>
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 10 }}>
            <a href="/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1" style={{ color: "#64748B", fontSize: 12, textDecoration: "none" }}>
              ▶ Or try the AI Tutor itself — no login at all
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "#1E293B" }} />
          <span style={{ color: "#475569", fontSize: 12, fontWeight: 600 }}>OR SIGN IN</span>
          <div style={{ flex: 1, height: 1, background: "#1E293B" }} />
        </div>

        {/* Login card */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "28px 28px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 6px" }}>Welcome back</h2>
          <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 24px" }}>Login to continue your child's learning journey.</p>

          {error && (
            <div style={{ background: "#FEF2F2", color: "#DC2626", fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Mobile Number or Email
            </label>
            <input
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, fontSize: 15, border: "1.5px solid #E2E8F0", outline: "none", boxSizing: "border-box" as const }}
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="+91 9876543210 or email"
              onKeyDown={e => e.key === "Enter" && pinRefs.current[0]?.focus()}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              6-digit PIN
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {pin.map((v, i) => (
                <input
                  key={i}
                  ref={el => { pinRefs.current[i] = el; }}
                  style={{ width: 44, height: 52, textAlign: "center" as const, fontSize: 22, fontWeight: 700, border: "2px solid #E2E8F0", borderRadius: 10, outline: "none", background: "#F8FAFC", color: "#0F172A", flexShrink: 0 }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={e => handlePinChange(e.target.value, i)}
                  onKeyDown={e => {
                    handlePinKey(e, i);
                    if (e.key === "Enter" && i === 5 && pinFilled && identifier) handleLogin();
                  }}
                />
              ))}
            </div>
          </div>

          <p style={{ textAlign: "right", marginBottom: 4, fontSize: 13 }}>
            <a href="/auth/forgot-pin" style={{ color: "#F97316" }}>Forgot PIN?</a>
          </p>

          <button
            style={{
              width: "100%", padding: "13px", borderRadius: 8, fontWeight: 700, fontSize: 15,
              border: "none", cursor: !identifier || !pinFilled || loading ? "not-allowed" : "pointer",
              background: !identifier || !pinFilled || loading ? "#E2E8F0" : "#F97316",
              color: !identifier || !pinFilled || loading ? "#94A3B8" : "#FFFFFF",
              marginTop: 12,
            }}
            disabled={!identifier || !pinFilled || loading}
            onClick={handleLogin}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#64748B" }}>
            <p style={{ margin: "0 0 6px" }}>New here? <a href="/auth/register" style={{ color: "#F97316", fontWeight: 600 }}>Register</a></p>
          </div>
        </div>

      </div>
    </div>
  );
}
