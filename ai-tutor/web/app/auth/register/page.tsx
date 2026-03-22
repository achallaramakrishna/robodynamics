"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Step = 1 | 2 | 3;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS = Array.from({ length: 15 }, (_, i) => 2026 - 5 - i); // 2021..2007

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gradeFromUrl = searchParams?.get("grade") ?? "";

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Step 2
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3
  const [childName, setChildName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(gradeFromUrl || "");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [pinConfirm, setPinConfirm] = useState(["", "", "", "", "", ""]);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pinConfirmRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [whatsapp, setWhatsapp] = useState(true);
  const [terms, setTerms] = useState(false);

  /* ── helpers ── */
  const startResendTimer = () => {
    setResendTimer(45);
    const iv = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; });
    }, 1000);
  };

  const handleOtpKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
    arr: string[],
    setter: (v: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === "Backspace" && !arr[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const handleOtpChange = (
    val: string, idx: number,
    arr: string[], setter: (v: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...arr]; next[idx] = v;
    setter(next);
    if (v && idx < 5) refs.current[idx + 1]?.focus();
  };

  /* ── Step 1: Send OTP ── */
  async function sendOtp() {
    if (phone.length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setLoading(true); setError("");
    try {
      await fetch("/api/auth/otp/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
      setOtpSent(true);
      startResendTimer();
    } catch { setError("Could not send OTP. Try again."); }
    finally { setLoading(false); }
  }

  /* ── Step 2: Verify OTP ── */
  async function verifyOtp() {
    const otpVal = otp.join("");
    if (otpVal.length !== 6) { setError("Enter the 6-digit OTP"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, otp: otpVal }) });
      const data = await res.json();
      if (data.verified) { setStep(3); setError(""); }
      else { setError("Invalid OTP. Please try again."); }
    } catch { setError("Verification failed. Try again."); }
    finally { setLoading(false); }
  }

  /* ── Step 3: Register ── */
  async function register() {
    const pinVal = pin.join(""); const pinCVal = pinConfirm.join("");
    if (!childName.trim()) { setError("Enter your child's name"); return; }
    if (!selectedGrade) { setError("Select a grade"); return; }
    if (pinVal.length !== 6) { setError("Set a 6-digit PIN"); return; }
    if (pinVal !== pinCVal) { setError("PINs do not match"); return; }
    if (!terms) { setError("Please accept the Terms of Service"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentName, email, phone, childName, grade: selectedGrade, dobMonth, dobYear, pin: pinVal, whatsappOptIn: whatsapp }),
      });
      const data = await res.json();
      if (data.success) { router.push(`/checkout/grade-${selectedGrade}`); }
      else { setError(data.message ?? "Registration failed. Please try again."); }
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  /* ── Styles ── */
  const S = {
    page: { minHeight: "100vh", background: "linear-gradient(135deg, #F0F9FF 0%, #FFF7ED 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
    card: { background: "#FFFFFF", borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 420, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
    logo: { textAlign: "center" as const, marginBottom: 24 },
    logoText: { color: "#F97316", fontWeight: 800, fontSize: 20, textDecoration: "none" },
    dots: { display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 },
    dot: (active: boolean, done: boolean) => ({
      width: active ? 24 : 8, height: 8, borderRadius: 4,
      background: done ? "#22C55E" : active ? "#F97316" : "#E2E8F0",
      transition: "all 0.3s",
    }),
    stepLabel: { textAlign: "center" as const, color: "#94A3B8", fontSize: 12, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 6 },
    sub: { color: "#64748B", fontSize: 14, marginBottom: 24, lineHeight: 1.5 },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
    input: {
      width: "100%", padding: "11px 14px", borderRadius: 8, fontSize: 15,
      border: "1.5px solid #E2E8F0", outline: "none", boxSizing: "border-box" as const,
      transition: "border 0.2s",
    },
    phoneRow: { display: "flex", gap: 8 },
    prefix: { background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "11px 12px", fontSize: 15, color: "#64748B", flexShrink: 0 },
    otpSendBtn: { background: "#F97316", color: "#FFF", border: "none", borderRadius: 8, padding: "11px 16px", cursor: "pointer", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" as const },
    otpRow: { display: "flex", gap: 8, justifyContent: "center", margin: "8px 0 20px" },
    otpBox: {
      width: 44, height: 52, textAlign: "center" as const, fontSize: 22, fontWeight: 700,
      border: "2px solid #E2E8F0", borderRadius: 10, outline: "none",
      color: "#0F172A", background: "#F8FAFC",
    },
    gradeRow: { display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 16 },
    gradePill: (active: boolean) => ({
      padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer",
      border: "2px solid " + (active ? "#F97316" : "#E2E8F0"),
      background: active ? "#FFF7ED" : "#F8FAFC",
      color: active ? "#EA580C" : "#64748B",
    }),
    dobRow: { display: "flex", gap: 8 },
    select: { flex: 1, padding: "11px 10px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 14, color: "#0F172A", background: "#FFF" },
    pinRow: { display: "flex", gap: 6, marginBottom: 8 },
    pinBox: { width: 40, height: 48, textAlign: "center" as const, fontSize: 20, fontWeight: 700, border: "2px solid #E2E8F0", borderRadius: 8, outline: "none", background: "#F8FAFC", color: "#0F172A" },
    checkRow: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 },
    checkLabel: { fontSize: 13, color: "#475569", lineHeight: 1.4 },
    btn: (disabled: boolean) => ({
      width: "100%", padding: "13px", borderRadius: 8, fontWeight: 700, fontSize: 15,
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      background: disabled ? "#E2E8F0" : "#F97316", color: disabled ? "#94A3B8" : "#FFFFFF",
      marginTop: 8,
    }),
    errMsg: { background: "#FEF2F2", color: "#DC2626", fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 12 },
    loginLink: { textAlign: "center" as const, marginTop: 16, fontSize: 13, color: "#64748B" },
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}><a href="/vedic-math" style={S.logoText}>MindSutra</a></div>

        {/* Progress dots */}
        <div style={S.dots}>
          {[1, 2, 3].map(s => <div key={s} style={S.dot(s === step, s < step)} />)}
        </div>
        <p style={S.stepLabel}>Step {step} of 3</p>

        {error && <div style={S.errMsg}>{error}</div>}

        {/* ── Step 1 ── */}
        {step === 1 && (
          <>
            <h2 style={S.title}>Create Your Account</h2>
            <p style={S.sub}>Start with your details as the parent/guardian.</p>

            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Your Full Name</label>
              <input style={S.input} value={parentName} onChange={e => setParentName(e.target.value)} placeholder="e.g. Sunita Sharma" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Mobile Number</label>
              <div style={S.phoneRow}>
                <span style={S.prefix}>+91</span>
                <input style={{ ...S.input, flex: 1 }} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit number" inputMode="numeric" />
                {!otpSent && phone.length === 10 && (
                  <button style={S.otpSendBtn} onClick={sendOtp} disabled={loading}>
                    {loading ? "..." : "Send OTP"}
                  </button>
                )}
              </div>
              {otpSent && <p style={{ color: "#22C55E", fontSize: 12, marginTop: 4 }}>✓ OTP sent to +91 {phone}</p>}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Email Address</label>
              <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="yourname@email.com" />
            </div>

            <button style={S.btn(!otpSent || !parentName || !email)} disabled={!otpSent || !parentName || !email} onClick={() => { setError(""); setStep(2); }}>
              Continue →
            </button>
          </>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <>
            <h2 style={S.title}>Verify Your Mobile</h2>
            <p style={S.sub}>OTP sent to +91 {phone}.<br />Enter the 6-digit code below.</p>

            <div style={S.otpRow}>
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  style={S.otpBox}
                  value={v}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={e => handleOtpChange(e.target.value, i, otp, setOtp, otpRefs)}
                  onKeyDown={e => handleOtpKey(e, i, otp, setOtp, otpRefs)}
                />
              ))}
            </div>

            <button style={S.btn(otp.join("").length !== 6 || loading)} disabled={otp.join("").length !== 6 || loading} onClick={verifyOtp}>
              {loading ? "Verifying..." : "Verify OTP →"}
            </button>

            <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#64748B" }}>
              {resendTimer > 0
                ? `Resend in 00:${String(resendTimer).padStart(2, "0")}`
                : <button style={{ background: "none", border: "none", color: "#F97316", cursor: "pointer", fontSize: 13, padding: 0 }} onClick={sendOtp}>Resend OTP</button>
              }
            </p>
            <p style={{ textAlign: "center", marginTop: 8, fontSize: 13 }}>
              <button style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 13 }} onClick={() => setStep(1)}>← Change number</button>
            </p>
          </>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <>
            <h2 style={S.title}>Tell Us About Your Child</h2>
            <p style={S.sub}>One more step and you&apos;re ready to start learning!</p>

            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Child&apos;s First Name</label>
              <input style={S.input} value={childName} onChange={e => setChildName(e.target.value)} placeholder="e.g. Priya" />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Grade</label>
              <div style={S.gradeRow}>
                {[4, 5, 6, 7, 8].map(g => (
                  <button key={g} style={S.gradePill(selectedGrade === String(g))} onClick={() => setSelectedGrade(String(g))}>
                    G{g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Date of Birth (Month & Year)</label>
              <div style={S.dobRow}>
                <select style={S.select} value={dobMonth} onChange={e => setDobMonth(e.target.value)}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
                </select>
                <select style={S.select} value={dobYear} onChange={e => setDobYear(e.target.value)}>
                  <option value="">Year</option>
                  {YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Create a 6-digit PIN</label>
              <div style={S.pinRow}>
                {pin.map((v, i) => (
                  <input key={i} ref={el => { pinRefs.current[i] = el; }} style={S.pinBox} type="password" inputMode="numeric" maxLength={1} value={v}
                    onChange={e => handleOtpChange(e.target.value, i, pin, setPin, pinRefs)}
                    onKeyDown={e => handleOtpKey(e, i, pin, setPin, pinRefs)} />
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Confirm PIN</label>
              <div style={S.pinRow}>
                {pinConfirm.map((v, i) => (
                  <input key={i} ref={el => { pinConfirmRefs.current[i] = el; }} style={S.pinBox} type="password" inputMode="numeric" maxLength={1} value={v}
                    onChange={e => handleOtpChange(e.target.value, i, pinConfirm, setPinConfirm, pinConfirmRefs)}
                    onKeyDown={e => handleOtpKey(e, i, pinConfirm, setPinConfirm, pinConfirmRefs)} />
                ))}
              </div>
            </div>

            <div style={S.checkRow}>
              <input type="checkbox" id="wa" checked={whatsapp} onChange={e => setWhatsapp(e.target.checked)} />
              <label htmlFor="wa" style={S.checkLabel}>Send progress updates on WhatsApp</label>
            </div>
            <div style={{ ...S.checkRow, marginBottom: 20 }}>
              <input type="checkbox" id="terms" checked={terms} onChange={e => setTerms(e.target.checked)} />
              <label htmlFor="terms" style={S.checkLabel}>
                I agree to the <a href="/terms" style={{ color: "#F97316" }}>Terms of Service</a>
              </label>
            </div>

            <button style={S.btn(!terms || !childName || !selectedGrade || loading)} disabled={!terms || !childName || !selectedGrade || loading} onClick={register}>
              {loading ? "Creating account..." : "Create Account & Pay →"}
            </button>
          </>
        )}

        <p style={S.loginLink}>
          Already have an account? <a href="/auth/login" style={{ color: "#F97316", fontWeight: 600 }}>Login</a>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <RegisterPageInner />
    </Suspense>
  );
}
