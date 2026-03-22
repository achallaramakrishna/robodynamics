"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
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

  const S = {
    page: { minHeight: "100vh", background: "linear-gradient(135deg, #F0F9FF 0%, #FFF7ED 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
    card: { background: "#FFFFFF", borderRadius: 16, padding: "36px 28px", width: "100%", maxWidth: 380, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
    logo: { textAlign: "center" as const, marginBottom: 28 },
    logoText: { color: "#F97316", fontWeight: 800, fontSize: 22, textDecoration: "none" },
    title: { fontSize: 24, fontWeight: 700, color: "#0F172A", marginBottom: 8 },
    sub: { color: "#64748B", fontSize: 14, marginBottom: 28 },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
    input: { width: "100%", padding: "12px 14px", borderRadius: 8, fontSize: 15, border: "1.5px solid #E2E8F0", outline: "none", boxSizing: "border-box" as const },
    pinRow: { display: "flex", gap: 8, marginBottom: 6 },
    pinBox: { width: 44, height: 52, textAlign: "center" as const, fontSize: 22, fontWeight: 700, border: "2px solid #E2E8F0", borderRadius: 10, outline: "none", background: "#F8FAFC", color: "#0F172A" },
    btn: (disabled: boolean) => ({
      width: "100%", padding: "13px", borderRadius: 8, fontWeight: 700, fontSize: 15,
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      background: disabled ? "#E2E8F0" : "#F97316", color: disabled ? "#94A3B8" : "#FFFFFF",
      marginTop: 12,
    }),
    errMsg: { background: "#FEF2F2", color: "#DC2626", fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 16 },
    links: { textAlign: "center" as const, marginTop: 20, fontSize: 13, color: "#64748B" },
  };

  const pinFilled = pin.join("").length === 6;

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}><a href="/vedic-math" style={S.logoText}>MindSutra</a></div>
        <h2 style={S.title}>Welcome Back</h2>
        <p style={S.sub}>Login to continue your child&apos;s learning journey.</p>

        {error && <div style={S.errMsg}>{error}</div>}

        <div style={{ marginBottom: 18 }}>
          <label style={S.label}>Mobile Number or Email</label>
          <input style={S.input} value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="+91 9876543210 or email" />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={S.label}>6-digit PIN</label>
          <div style={S.pinRow}>
            {pin.map((v, i) => (
              <input key={i} ref={el => { pinRefs.current[i] = el; }} style={S.pinBox}
                type="password" inputMode="numeric" maxLength={1} value={v}
                onChange={e => handlePinChange(e.target.value, i)}
                onKeyDown={e => handlePinKey(e, i)} />
            ))}
          </div>
        </div>

        <p style={{ textAlign: "right", marginBottom: 4, fontSize: 13 }}>
          <a href="/auth/forgot-pin" style={{ color: "#F97316" }}>Forgot PIN?</a>
        </p>

        <button style={S.btn(!identifier || !pinFilled || loading)} disabled={!identifier || !pinFilled || loading} onClick={handleLogin}>
          {loading ? "Logging in..." : "Login →"}
        </button>

        <div style={S.links}>
          <p>New here? <a href="/auth/register" style={{ color: "#F97316", fontWeight: 600 }}>Register</a></p>
          <p style={{ marginTop: 8 }}>
            <a href="/ai-tutor/demo?grade=5&chapter=VM_G5_L1_NIKHILAM_NEAR100&fresh=1" style={{ color: "#64748B" }}>
              Try free demo — no login needed
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
