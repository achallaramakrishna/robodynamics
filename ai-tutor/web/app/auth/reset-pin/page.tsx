"use client";

import { FormEvent, useState } from "react";

export default function ResetPinPage() {
  const [phone, setPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.trim().length < 4) {
      setError("Please set a PIN with at least 4 characters.");
      return;
    }

    if (password !== confirmPin) {
      setError("New PIN and confirm PIN should match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, studentName, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Could not reset the PIN. Please try again.");
        return;
      }

      setSuccess("PIN reset successful. You can now login with the new PIN.");
      setPassword("");
      setConfirmPin("");
    } catch (err) {
      console.error(err);
      setError("Could not reset the PIN. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.hero}>
          <img src="/rd-logo.png" alt="RoboDynamics" style={styles.logo} />
          <div style={styles.badge}>RoboDynamics PIN Recovery</div>
          <h1 style={styles.title}>Reset your family PIN</h1>
          <p style={styles.subtitle}>
            If you forgot the PIN, verify the student name and phone number used during registration, then set a new one.
          </p>
          <p style={styles.supportingText}>
            Once updated, the new PIN will work across Vedika, Yukti, Artha, Vaani, Vidya, and the rest of the RoboDynamics tutor family.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <label style={styles.label}>
            Phone Number
            <input
              style={styles.input}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="9876543210"
              required
              readOnly={loading}
            />
          </label>

          <label style={styles.label}>
            Student Name
            <input
              style={styles.input}
              type="text"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder="Rohan Sharma"
              required
              readOnly={loading}
            />
          </label>

          <label style={styles.label}>
            New PIN
            <input
              style={styles.input}
              type="password"
              minLength={4}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 4 characters"
              required
              readOnly={loading}
            />
          </label>

          <label style={styles.label}>
            Confirm PIN
            <input
              style={styles.input}
              type="password"
              minLength={4}
              value={confirmPin}
              onChange={(event) => setConfirmPin(event.target.value)}
              placeholder="Re-enter the new PIN"
              required
              readOnly={loading}
            />
          </label>

          {error ? <div style={styles.error}>{error}</div> : null}
          {success ? <div style={styles.success}>{success}</div> : null}

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? "Resetting..." : "Reset PIN"}
          </button>

          <div style={styles.linksRow}>
            <a href="/auth/login" style={styles.link}>
              Back to login
            </a>
            <a href="/auth/register" style={styles.link}>
              Create a new shared account
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 28%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
    color: "#f8fafc",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  shell: {
    width: "100%",
    maxWidth: "1080px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 440px)",
    gap: "28px",
    alignItems: "stretch",
  },
  hero: {
    padding: "48px 24px",
    display: "grid",
    alignContent: "center",
    gap: "18px",
  },
  logo: {
    width: "92px",
    height: "92px",
    objectFit: "contain",
    borderRadius: "24px",
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
    padding: "14px",
  },
  badge: {
    display: "inline-flex",
    width: "fit-content",
    border: "1px solid rgba(56,189,248,0.35)",
    background: "rgba(56,189,248,0.12)",
    color: "#bae6fd",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: "clamp(32px, 5vw, 56px)",
    lineHeight: 1.04,
    fontWeight: 900,
  },
  subtitle: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: 1.7,
    maxWidth: "560px",
  },
  supportingText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: 1.7,
    maxWidth: "560px",
  },
  card: {
    alignSelf: "center",
    display: "grid",
    gap: "14px",
    padding: "28px",
    borderRadius: "24px",
    background: "rgba(15,23,42,0.84)",
    border: "1px solid rgba(148,163,184,0.18)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
  },
  label: {
    display: "grid",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#cbd5e1",
  },
  input: {
    width: "100%",
    background: "#020617",
    color: "#f8fafc",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "14px 16px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  error: {
    borderRadius: "14px",
    border: "1px solid rgba(248,113,113,0.35)",
    background: "rgba(127,29,29,0.35)",
    color: "#fecaca",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: 600,
  },
  success: {
    borderRadius: "14px",
    border: "1px solid rgba(74,222,128,0.35)",
    background: "rgba(20,83,45,0.35)",
    color: "#bbf7d0",
    padding: "12px 14px",
    fontSize: "14px",
    fontWeight: 600,
  },
  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    background: "linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "15px",
    cursor: "pointer",
  },
  linksRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "space-between",
    fontSize: "13px",
  },
  link: {
    color: "#7dd3fc",
    textDecoration: "none",
    fontWeight: 700,
  },
};
