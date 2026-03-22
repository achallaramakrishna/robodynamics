"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MINDSUTRA_DEMO_CHAPTERS } from "@/lib/mindsutraChapters";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const grade = searchParams?.get("grade") ?? "5";
  const startUrl = `/ai-tutor/demo?grade=${grade}&chapter=${MINDSUTRA_DEMO_CHAPTERS[grade as keyof typeof MINDSUTRA_DEMO_CHAPTERS] ?? MINDSUTRA_DEMO_CHAPTERS["5"]}&fresh=1&enrolled=1`;
  const courseHubUrl = `/student/course/grade-${grade}`;

  const S = {
    page: { minHeight: "100vh", background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
    card: { background: "#FFFFFF", borderRadius: 20, padding: "48px 32px", maxWidth: 460, width: "100%", textAlign: "center" as const, boxShadow: "0 8px 40px rgba(0,0,0,0.10)" },
    checkCircle: {
      width: 80, height: 80, borderRadius: "50%", background: "#DCFCE7",
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 24px", fontSize: 40,
      animation: "popIn 0.5s ease-out",
    },
    h1: { fontSize: 26, fontWeight: 800, color: "#0F172A", marginBottom: 10 },
    sub: { color: "#64748B", fontSize: 15, lineHeight: 1.6, marginBottom: 32 },
    primaryBtn: {
      display: "block", width: "100%", padding: "14px",
      background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 15,
      borderRadius: 10, textDecoration: "none", marginBottom: 12,
      border: "none", cursor: "pointer",
    },
    secondaryBtn: {
      display: "block", width: "100%", padding: "13px",
      background: "transparent", color: "#0F172A", fontWeight: 600, fontSize: 14,
      borderRadius: 10, textDecoration: "none",
      border: "2px solid #E2E8F0", cursor: "pointer",
    },
    note: { marginTop: 24, color: "#94A3B8", fontSize: 12, lineHeight: 1.5 },
    detailRow: { display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 6, fontSize: 13, color: "#374151" },
  };

  async function primeEnrollmentCookie() {
    await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayPaymentId: `success_page_${Date.now()}`,
        razorpayOrderId: searchParams?.get("orderId") ?? `order_${Date.now()}`,
        razorpaySignature: "",
        grade,
      }),
    });
  }

  return (
    <div style={S.page}>
      <style>{`@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
      <div style={S.card}>
        <div style={S.checkCircle}>OK</div>

        <h1 style={S.h1}>You&apos;re Enrolled!</h1>
        <p style={S.sub}>
          Grade {grade} Vedic Maths AI Tutor is now active.<br />
          Your child can start learning right now.
        </p>

        <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "16px", marginBottom: 28 }}>
          <div style={S.detailRow}><span>Course</span> <span>MindSutra Grade {grade} - Vedic Maths</span></div>
          <div style={S.detailRow}><span>Access</span> <span>1 year from today</span></div>
          <div style={S.detailRow}><span>Hub</span> <span>Course map and next lesson are now unlocked</span></div>
        </div>

        <a href={startUrl} style={S.primaryBtn} onClick={() => { void primeEnrollmentCookie(); }}>Start Chapter 1 Now</a>
        <a href={courseHubUrl} style={S.secondaryBtn} onClick={() => { void primeEnrollmentCookie(); }}>Open Course Hub -&gt;</a>

        <p style={S.note}>
          Questions? WhatsApp us at <strong>+91 80001 00001</strong><br />
          or email support@robodynamics.in
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

