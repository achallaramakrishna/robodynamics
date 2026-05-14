"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildPostAuthUrl, inferEnrollmentProductFromPath } from "@/lib/authRouting";

export default function AuthRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [postAuthUrl, setPostAuthUrl] = useState("/enroll");
  const [requestedProduct, setRequestedProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    grade: "5",
    schoolName: "",
    password: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const grade = params.get("grade");
    const next = params.get("next");
    const safeNext = next && next.startsWith("/") ? next : null;
    setNextUrl(safeNext);
    setPostAuthUrl(buildPostAuthUrl(next));
    setRequestedProduct(next ? inferEnrollmentProductFromPath(next) : null);
    if (grade) {
      setFormData((current) => ({ ...current, grade }));
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (formData.password.trim().length < 4) {
      setError("Please set a password with at least 4 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productSlug: requestedProduct }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.user) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      localStorage.setItem("ms_challenge_user", JSON.stringify(data.user));
      router.push(postAuthUrl);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.hero}>
          <img src="/rd-logo.png" alt="RoboDynamics" style={styles.logo} />
          <div style={styles.badge}>RoboDynamics Family Registration</div>
          <h1 style={styles.title}>Create your RoboDynamics access</h1>
          <p style={styles.subtitle}>
            Register once to unlock all RoboDynamics learning products and keep progress linked to one family account.
          </p>
          <p style={styles.supportingText}>
            After signup, we can guide each learner into the right product, course, or enrollment flow.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <label style={styles.label}>
            Student Name
            <input
              style={styles.input}
              type="text"
              value={formData.studentName}
              onChange={(event) => setFormData({ ...formData, studentName: event.target.value })}
              placeholder="Rohan Sharma"
              required
              readOnly={loading}
            />
          </label>

          <label style={styles.label}>
            Parent Name
            <input
              style={styles.input}
              type="text"
              value={formData.parentName}
              onChange={(event) => setFormData({ ...formData, parentName: event.target.value })}
              placeholder="Mrs. Sharma"
              required
              readOnly={loading}
            />
          </label>

          <label style={styles.label}>
            Phone Number
            <input
              style={styles.input}
              type="tel"
              value={formData.phone}
              onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
              placeholder="9876543210"
              required
              readOnly={loading}
            />
          </label>

          <label style={styles.label}>
            Grade
            <select
              style={styles.input}
              value={formData.grade}
              onChange={(event) => setFormData({ ...formData, grade: event.target.value })}
              disabled={loading}
            >
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
          </label>

          <label style={styles.label}>
            School Name
            <input
              style={styles.input}
              type="text"
              value={formData.schoolName}
              onChange={(event) => setFormData({ ...formData, schoolName: event.target.value })}
              placeholder="Delhi Public School"
              readOnly={loading}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              minLength={4}
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              placeholder="Minimum 4 characters"
              required
              readOnly={loading}
            />
          </label>

          {error ? <div style={styles.error}>{error}</div> : null}

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? "Registering..." : "Register"}
          </button>

          <div style={styles.linksRow}>
            <a href={`/auth/login${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""}`} style={styles.link}>
              Already registered? Login
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
      "radial-gradient(circle at top, rgba(236,72,153,0.18), transparent 28%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
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
    border: "1px solid rgba(244,114,182,0.35)",
    background: "rgba(236,72,153,0.12)",
    color: "#fbcfe8",
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
  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    background: "linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)",
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
    color: "#f9a8d4",
    textDecoration: "none",
    fontWeight: 700,
  },
};
