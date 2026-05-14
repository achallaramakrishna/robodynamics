"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { VaaniBrandHeader, VaaniBrandFooter } from "@/components/Vaani/BrandChrome";

export default function ArenaRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    email: "",
    grade: "12",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const registration = JSON.stringify({
      ...formData,
      timestamp: Date.now()
    });

    localStorage.setItem("hs_arena_registration", registration);
    localStorage.setItem("vaani_student", registration);

    // Simulate network delay for "Professional" feel
    setTimeout(() => {
      router.push(`/arena/play?grade=G${formData.grade}`);
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0F172A",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 100% 0%, rgba(79, 70, 229, 0.05), transparent)",
        pointerEvents: "none"
      }} />

      <div style={{ zIndex: 10, maxWidth: "480px", width: "100%" }}>
        <div style={{ marginBottom: "40px" }}>
          <VaaniBrandHeader title="Academy Arena" subtitle="Student Registration" />
        </div>

        <form 
          onSubmit={handleRegister}
          style={{
            backgroundColor: "#1E293B",
            border: "1px solid #334155",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Student Full Name</label>
            <input 
              required
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g. Aditi Sharma"
              style={{
                backgroundColor: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "14px 16px",
                color: "white",
                fontSize: "15px",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Academic Grade</label>
              <select 
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                style={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  color: "white",
                  fontSize: "15px",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>Grade {i+1}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Parent Full Name</label>
              <input 
                required
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Parent Name"
                style={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  color: "white",
                  fontSize: "15px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Parent Mobile Number</label>
            <input 
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="10-digit mobile"
              style={{
                backgroundColor: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "14px 16px",
                color: "white",
                fontSize: "15px",
                outline: "none"
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: "12px",
              backgroundColor: "#4F46E5",
              color: "white",
              fontWeight: 700,
              padding: "16px 0",
              borderRadius: "12px",
              cursor: "pointer",
              border: "none",
              fontSize: "16px",
              transition: "all 0.2s",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Initializing..." : "Register & Start Arena"}
          </button>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#64748B", marginTop: "8px" }}>
            By continuing, you agree to receive academic updates via WhatsApp.
          </p>
        </form>

        <div style={{ marginTop: "40px" }}>
          <VaaniBrandFooter />
        </div>
      </div>
    </div>
  );
}
