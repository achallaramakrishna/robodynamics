"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateSessionKey } from "../../../../lib/neetPlanEngine";

type StudentClass = "class_11" | "class_12" | "dropper";

const CLASS_OPTIONS: { value: StudentClass; label: string; sub: string }[] = [
  { value: "class_11", label: "Class 11", sub: "Just starting out" },
  { value: "class_12", label: "Class 12", sub: "Preparing this year" },
  { value: "dropper",  label: "Dropper",  sub: "Giving a second shot" },
];

function Input({ label, value, onChange, type = "text", placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#94A3B8", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 14px", background: "#1E293B",
          border: "1px solid #334155", borderRadius: 10, color: "#F8FAFC",
          fontSize: 15, outline: "none", boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#8B5CF6"; }}
        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#334155"; }}
      />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"student" | "parent">("student");
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState<StudentClass | "">("");
  const [studentMobile, setStudentMobile] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentMobile, setParentMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canGoToParent = studentName.trim().length >= 2 && studentClass !== "";

  const handleSubmit = async () => {
    if (!parentName.trim() || parentMobile.trim().length < 10) {
      setError("Please enter parent name and a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const key = getOrCreateSessionKey();
      const res = await fetch("/api/neet/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          studentName: studentName.trim(),
          studentClass,
          studentMobile: studentMobile.trim() || null,
          parentName: parentName.trim(),
          parentMobile: parentMobile.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Registration failed");

      router.push("/ai-tutor/neet/onboarding");
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <style>{`* { box-sizing: border-box; } input::placeholder { color: #475569; }`}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 56, objectFit: "contain", marginBottom: 10 }} />
        <div style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC" }}>MEERA</div>
        <div style={{ fontSize: 13, color: "#8B5CF6", fontWeight: 700, marginTop: 2 }}>NEET AI Tutor · RoboDynamics</div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 440, background: "#1E293B", borderRadius: 20, padding: "28px 24px", border: "1px solid #334155" }}>

        {/* Free badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#064E3B", border: "1px solid #10B981", borderRadius: 20, padding: "4px 12px", marginBottom: 20 }}>
          <span style={{ color: "#10B981", fontSize: 12, fontWeight: 800 }}>✓ FREE · No payment required</span>
        </div>

        <h1 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>
          {step === "student" ? "Start Your NEET Prep" : "Parent Details"}
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#64748B" }}>
          {step === "student"
            ? "MEERA will build a personalised study plan just for you."
            : "MEERA keeps parents informed about progress."}
        </p>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {["Student", "Parent"].map((s, i) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: (i === 0 && step === "student") || (i === 1 && step === "parent") ? "#8B5CF6" : i === 0 && step === "parent" ? "#10B981" : "#334155" }} />
          ))}
        </div>

        {step === "student" ? (
          <>
            <Input label="Student's Full Name" value={studentName} onChange={setStudentName} placeholder="e.g. Priya Sharma" required />

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Currently In <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {CLASS_OPTIONS.map((o) => (
                  <button key={o.value} onClick={() => setStudentClass(o.value)}
                    style={{
                      flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
                      border: `2px solid ${studentClass === o.value ? "#8B5CF6" : "#334155"}`,
                      background: studentClass === o.value ? "#2D1B69" : "#0F172A",
                      textAlign: "center", transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: studentClass === o.value ? "#C4B5FD" : "#94A3B8" }}>{o.label}</div>
                    <div style={{ fontSize: 10, color: studentClass === o.value ? "#8B5CF6" : "#475569", marginTop: 2 }}>{o.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <Input label="Student Mobile (optional)" value={studentMobile} onChange={setStudentMobile} type="tel" placeholder="10-digit number" />

            <button
              onClick={() => canGoToParent && setStep("parent")}
              disabled={!canGoToParent}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                background: canGoToParent ? "linear-gradient(135deg,#6D28D9,#8B5CF6)" : "#1E293B",
                color: canGoToParent ? "#fff" : "#475569", fontSize: 15, fontWeight: 800,
                cursor: canGoToParent ? "pointer" : "not-allowed", transition: "opacity 0.15s",
              }}>
              Next: Parent Details →
            </button>
          </>
        ) : (
          <>
            <Input label="Parent / Guardian Name" value={parentName} onChange={setParentName} placeholder="e.g. Ramesh Sharma" required />
            <Input label="Parent Mobile" value={parentMobile} onChange={setParentMobile} type="tel" placeholder="10-digit number" required />

            {error && (
              <div style={{ background: "#450A0A", color: "#FCA5A5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
                ⚠ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                background: loading ? "#334155" : "linear-gradient(135deg,#6D28D9,#8B5CF6)",
                color: "#fff", fontSize: 15, fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
              }}>
              {loading ? "Registering…" : "Start Free Preparation 🚀"}
            </button>

            <button onClick={() => setStep("student")}
              style={{ width: "100%", marginTop: 10, padding: "10px 0", background: "none", border: "none", color: "#64748B", fontSize: 13, cursor: "pointer" }}>
              ← Back
            </button>
          </>
        )}
      </div>

      <p style={{ marginTop: 20, fontSize: 12, color: "#334155", textAlign: "center" }}>
        By registering, you agree to our terms. No payment or login required.
      </p>
    </div>
  );
}
