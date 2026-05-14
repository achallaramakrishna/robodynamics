"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildPostAuthUrl, inferEnrollmentProductFromPath } from "@/lib/authRouting";

export default function AuthLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [postAuthUrl, setPostAuthUrl] = useState("/enroll");
  const [requestedProduct, setRequestedProduct] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    setNextUrl(next && next.startsWith("/") ? next : null);
    setPostAuthUrl(buildPostAuthUrl(next));
    setRequestedProduct(next ? inferEnrollmentProductFromPath(next) : null);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, productSlug: requestedProduct }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.user) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("ms_challenge_user", JSON.stringify(data.user));
      router.push(postAuthUrl);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.hero}>
          <img src="/rd-logo.png" alt="RoboDynamics" style={styles.logo} />
          <div style={styles.badge}>RoboDynamics Account Access</div>
          <h1 style={styles.title}>Sign in once. Continue anywhere.</h1>
          <p style={styles.subtitle}>
            Use one RoboDynamics account for Vedika, Yukti, Artha, Vidya, Vaani, Kaveri, NEET, and more.
          </p>
          <p style={styles.supportingText}>
            Log in with the phone number used during registration and we will take the learner to the right product next.
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
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              readOnly={loading}
            />
          </label>

          {error ? <div style={styles.error}>{error}</div> : null}

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={styles.linksRow}>
            <a href="/auth/reset-pin" style={styles.link}>
              Reset PIN
            </a>
            <a href={`/auth/register${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""}`} style={styles.link}>
              New family? Create one shared account
            </a>
            <a href="/enroll" style={styles.link}>
              Browse learning products
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
      "radial-gradient(circle at top, rgba(99,102,241,0.22), transparent 30%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
    color: "#f8fafc",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  shell: {
    width: "100%",
    maxWidth: "1080px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 430px)",
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
    border: "1px solid rgba(129,140,248,0.35)",
    background: "rgba(99,102,241,0.12)",
    color: "#c7d2fe",
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
    gap: "16px",
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
  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
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
    color: "#a5b4fc",
    textDecoration: "none",
    fontWeight: 700,
  },
};
