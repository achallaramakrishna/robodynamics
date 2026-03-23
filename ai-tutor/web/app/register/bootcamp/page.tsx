"use client";

import { useState } from "react";

const COURSES = [
  { id: "beg_robotics", name: "Beginner Robotics — Arduino + C Programming", price: "₹8,000", age: "Ages 8–12", tech: "Arduino Uno", level: "Beginner", color: "#059669", icon: "🤖" },
  { id: "int_robotics", name: "Intermediate Robotics — ESP32 IoT + C", price: "₹10,000", age: "Ages 10–15", tech: "ESP32 DevKit", level: "Intermediate", color: "#2563EB", icon: "📡" },
  { id: "adv_robotics", name: "Advanced Robotics — Raspberry Pi + Python + AI", price: "₹12,000", age: "Ages 12–18", tech: "Raspberry Pi 4", level: "Advanced", color: "#7C3AED", icon: "🧠" },
  { id: "python", name: "Python Programming Camp — Pure Coding", price: "₹8,000", age: "Ages 10–16", tech: "Computer Lab", level: "Beginner–Intermediate", color: "#D97706", icon: "🐍" },
  { id: "ai_beg", name: "AI for Beginners — Explore Artificial Intelligence", price: "₹8,000", age: "Ages 10–14", tech: "ChatGPT & Tools", level: "Beginner", color: "#0891B2", icon: "🔍" },
  { id: "ai_mid", name: "AI Intermediate — Machine Learning with Python", price: "₹10,000", age: "Ages 12–16", tech: "scikit-learn, pandas", level: "Intermediate", color: "#059669", icon: "📊" },
  { id: "ai_adv", name: "AI Advanced — Deep Learning & Computer Vision", price: "₹12,000", age: "Ages 14–18", tech: "TensorFlow, YOLO", level: "Advanced", color: "#9333EA", icon: "🚀" },
];

const TSHIRT_SIZES = ["XS (6–8 yr)", "S (8–10 yr)", "M (10–12 yr)", "L (12–14 yr)", "XL (14–16 yr)", "XXL (16+ yr)"];
const BATCHES = ["Weekday Morning (10am–12pm)", "Weekday Afternoon (2pm–4pm)", "Weekend Morning (10am–12pm)", "Weekend Afternoon (2pm–4pm)"];
const HOW_HEARD = ["Friend / Family Referral", "WhatsApp / Telegram", "Google Search", "Instagram / Facebook", "School", "Flyer / Poster", "Other"];

export default function BootcampRegistrationPage() {
  const [form, setForm] = useState({
    student_name: "", parent_name: "", email: "", phone: "", whatsapp: "",
    age: "", grade: "", school_name: "", course_id: "", course_name: "",
    preferred_batch: "", address: "", city: "Bangalore",
    how_heard: "", special_needs: "", tshirt_size: "",
  });
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const selectCourse = (c: typeof COURSES[0]) => {
    setSelectedCourse(c);
    set("course_id", c.id);
    set("course_name", c.name);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register/bootcamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setRegId(data.registration_id);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.error || "Registration failed. Please call 83743 77311.");
      }
    } catch {
      setError("Network error. Please call 83743 77311 to register.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none",
    fontFamily: "inherit", background: "#fff", color: "#1e293b",
    transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = { display: "block", color: "#374151", fontWeight: 600, fontSize: 13, marginBottom: 6 };
  const fieldStyle: React.CSSProperties = { marginBottom: 18 };

  if (submitted) {
    return (
      <div style={{ background: "#0A0A0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "48px 40px", maxWidth: 560, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1e293b", marginBottom: 12 }}>You're Registered!</h1>
          <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ color: "#166534", fontWeight: 700, fontSize: 14 }}>Registration ID: <span style={{ fontSize: 18 }}>#{regId}</span></div>
          </div>
          <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
            Thank you <strong>{form.student_name}</strong>! Your registration for<br />
            <strong style={{ color: selectedCourse?.color }}>{form.course_name}</strong><br />
            has been confirmed.
          </p>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
            Our team will call you at <strong>{form.phone}</strong> within 24 hours to confirm your seat and share payment details.
          </p>
          <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "14px 20px", marginBottom: 24 }}>
            <div style={{ color: "#92400E", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>📍 Venue</div>
            <div style={{ color: "#78350F", fontSize: 13 }}>Above Agarwal Bhavan, Chambenhalli Sarjapura Road, Bangalore – 562125</div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a href="tel:8374377311" style={{ background: "linear-gradient(135deg,#F97316,#EF4444)", color: "#fff", borderRadius: 8, padding: "12px 24px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              📞 Call Us
            </a>
            <a href="/" style={{ background: "#f1f5f9", color: "#475569", borderRadius: 8, padding: "12px 24px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              🏠 Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: "rgba(10,10,15,0.97)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", height: 60, gap: 16 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 36, objectFit: "contain" }} />
          </a>
          <span style={{ color: "#F97316", fontWeight: 700, fontSize: 14, marginLeft: 8 }}>🏕️ Summer Boot Camp 2026 — Registration</span>
          <a href="tel:8374377311" style={{ marginLeft: "auto", color: "#fbbf24", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>📞 83743 77311</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", padding: "48px 24px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 20 }}>
          <span>🤖</span>
          <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600 }}>RoboDynamics Summer Boot Camp 2026 · Limited Seats</span>
        </div>
        <h1 style={{ color: "#fff", fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, margin: "0 0 12px" }}>
          Register for Robotics & AI Boot Camp
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
          20 sessions · 2 hours/day · All materials included · Certificate of Completion · Max 12 students per batch
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>

        {/* Form */}
        <form onSubmit={submit} style={{ background: "#fff", borderRadius: 16, padding: "32px 36px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>

          {/* Step 1: Pick Course */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ color: "#1e293b", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>1. Select Your Course *</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>Choose the program that best fits your child's age and interest:</p>
            <div style={{ display: "grid", gap: 10 }}>
              {COURSES.map((c) => (
                <div
                  key={c.id}
                  onClick={() => selectCourse(c)}
                  style={{
                    border: `2px solid ${selectedCourse?.id === c.id ? c.color : "#e2e8f0"}`,
                    borderRadius: 10, padding: "14px 16px", cursor: "pointer",
                    background: selectedCourse?.id === c.id ? `${c.color}08` : "#fff",
                    display: "flex", alignItems: "center", gap: 12,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 28 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#1e293b", fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                      <span style={{ background: `${c.color}18`, color: c.color, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{c.age}</span>
                      <span style={{ background: "#f1f5f9", color: "#64748b", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{c.tech}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: c.color, fontWeight: 800, fontSize: 16 }}>{c.price}</div>
                    <div style={{ color: "#94a3b8", fontSize: 11 }}>all inclusive</div>
                  </div>
                </div>
              ))}
            </div>
            {!selectedCourse && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>Please select a course to continue.</p>}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 24px" }} />

          {/* Step 2: Student Info */}
          <h2 style={{ color: "#1e293b", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>2. Student Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Student Full Name *</label>
              <input required style={inputStyle} value={form.student_name} onChange={(e) => set("student_name", e.target.value)} placeholder="e.g. Arjun Kumar" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Age *</label>
              <input required type="number" min="6" max="20" style={inputStyle} value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="e.g. 11" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Current Grade / Class *</label>
              <select required style={inputStyle} value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                <option value="">Select Grade</option>
                {["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "College / Other"].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>School Name</label>
              <input style={inputStyle} value={form.school_name} onChange={(e) => set("school_name", e.target.value)} placeholder="e.g. DPS Bangalore" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>T-Shirt Size</label>
              <select style={inputStyle} value={form.tshirt_size} onChange={(e) => set("tshirt_size", e.target.value)}>
                <option value="">Select size</option>
                {TSHIRT_SIZES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 24px" }} />

          {/* Step 3: Parent Info */}
          <h2 style={{ color: "#1e293b", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>3. Parent / Guardian Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Parent / Guardian Name *</label>
              <input required style={inputStyle} value={form.parent_name} onChange={(e) => set("parent_name", e.target.value)} placeholder="e.g. Sunita Kumar" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email Address *</label>
              <input required type="email" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="parent@email.com" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Phone / WhatsApp *</label>
              <input required type="tel" style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98XXXXXXXX" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Alternative WhatsApp</label>
              <input type="tel" style={inputStyle} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="If different from above" />
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 24px" }} />

          {/* Step 4: Preferences */}
          <h2 style={{ color: "#1e293b", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>4. Batch & Location</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Preferred Batch *</label>
              <select required style={inputStyle} value={form.preferred_batch} onChange={(e) => set("preferred_batch", e.target.value)}>
                <option value="">Select batch</option>
                {BATCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Bangalore" />
            </div>
            <div style={{ gridColumn: "1/-1", ...fieldStyle }}>
              <label style={labelStyle}>Address / Area</label>
              <input style={inputStyle} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="e.g. Sarjapura Road, Electronic City" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>How did you hear about us?</label>
              <select style={inputStyle} value={form.how_heard} onChange={(e) => set("how_heard", e.target.value)}>
                <option value="">Select</option>
                {HOW_HEARD.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Special Requirements / Needs</label>
              <input style={inputStyle} value={form.special_needs} onChange={(e) => set("special_needs", e.target.value)} placeholder="Any allergies, dietary needs, etc." />
            </div>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: "#B91C1C", fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !selectedCourse}
            style={{
              width: "100%", background: selectedCourse ? `linear-gradient(135deg, ${selectedCourse.color}, #1e293b)` : "#94a3b8",
              color: "#fff", border: "none", borderRadius: 10, padding: "16px 0",
              fontWeight: 800, fontSize: 16, cursor: submitting || !selectedCourse ? "not-allowed" : "pointer",
              letterSpacing: 0.3, transition: "all 0.2s",
            }}
          >
            {submitting ? "⏳ Registering..." : "🚀 Submit Registration"}
          </button>
          <p style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", marginTop: 10 }}>
            No payment now. Our team will call to confirm seat and collect fees.
          </p>
        </form>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Selected course preview */}
          {selectedCourse ? (
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
              <div style={{ background: `linear-gradient(135deg, ${selectedCourse.color}, #1e293b)`, padding: "20px 20px 16px" }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{selectedCourse.icon}</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{selectedCourse.name}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>{selectedCourse.age}</div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                {[
                  ["Technology", selectedCourse.tech],
                  ["Level", selectedCourse.level],
                  ["Duration", "20 Sessions · 40 Hours"],
                  ["Batch size", "Max 12 students"],
                  ["Materials", "All included"],
                  ["Certificate", "Yes — on Demo Day"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ color: "#64748b", fontSize: 13 }}>{k}</span>
                    <span style={{ color: "#1e293b", fontSize: 13, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                  <span style={{ color: "#1e293b", fontWeight: 700, fontSize: 15 }}>Fee</span>
                  <span style={{ color: selectedCourse.color, fontWeight: 800, fontSize: 20 }}>{selectedCourse.price}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.05)", border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 14, padding: "32px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>👆</div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>Select a course on the left to see details here</div>
            </div>
          )}

          {/* Contact */}
          <div style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.12),rgba(124,58,237,0.12))", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 14, padding: "20px" }}>
            <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Need help registering?</div>
            <a href="tel:8374377311" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
              📞 83743 77311
            </a>
            <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>
              Call / WhatsApp · Mon–Sat 9am–6pm<br />
              <span style={{ color: "#64748b" }}>Above Agarwal Bhavan, Chambenhalli Sarjapura Road, Bangalore</span>
            </div>
          </div>

          {/* Inclusions */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px" }}>
            <div style={{ color: "#1e293b", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>✅ All Programmes Include</div>
            {["All components & materials", "20 hands-on sessions", "2 hours every day", "Certificate of Completion", "Personal project portfolio", "Small batch (max 12 students)", "Expert mentor guidance"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#374151", fontSize: 13 }}>
                <span style={{ color: "#10B981", fontWeight: 700 }}>✓</span> {item}
              </div>
            ))}
          </div>

        </div>
      </div>

      <footer style={{ background: "#050507", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 32px", textAlign: "center", color: "#374151", fontSize: 13 }}>
        © 2026 RoboDynamics · robodynamics.in · 83743 77311 · info@robodynamics.in
      </footer>
    </div>
  );
}
