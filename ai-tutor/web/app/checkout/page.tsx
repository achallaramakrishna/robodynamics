"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { FLAGS } from "../../lib/featureFlags";

// ─── Bundle Config ────────────────────────────────────────────────────────────

const BUNDLES: Record<string, {
  name: string;
  description: string;
  price: number;
  mrp: number;
  levels: string[];
  badge: string;
}> = {
  "moneymind-6-levels": {
    name: "MoneyMind — Generational Wealth Bundle",
    description: "Lifetime access to all 6 levels of financial literacy for ages 8–18. ATM simulators, UPI labs, compounding garden, salary decoder, and 24 AI-guided lessons.",
    price: 5999,
    mrp: 14995,
    badge: "💰",
    levels: [
      "L1: My First Money World",
      "L2: Bank & ATM Explorer",
      "L3: Digital Money & Safety Lab",
      "L4: Smart Spending & Budgeting",
      "L5: Grow, Protect & Decide",
      "L6: Real-World Readiness",
    ],
  },
};

const THEME = {
  bg: "#0F172A",
  cardBg: "#1E293B",
  border: "#78350F",
  accent: "#F59E0B",
  accentDark: "#D97706",
  text: "#F8FAFC",
  textSub: "#D1D5DB",
};

// ─── Razorpay type declaration ────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// ─── Feature Flag Guard ───────────────────────────────────────────────────────

function CheckoutDisabled() {
  return (
    <div style={{ background: THEME.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: "48px 40px", maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
        <h2 style={{ color: THEME.text, fontWeight: 800, fontSize: 22, marginBottom: 12 }}>Checkout Coming Soon</h2>
        <p style={{ color: THEME.textSub, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          We are finalising the payment system. If you'd like early access, please reach out to us directly.
        </p>
        <a
          href="/moneymind"
          style={{ background: THEME.accent, color: "#451A03", borderRadius: 8, padding: "12px 28px", fontWeight: 800, fontSize: 14, textDecoration: "none", display: "inline-block" }}
        >
          ← Back to MoneyMind
        </a>
      </div>
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const bundleKey = searchParams.get("bundle") ?? "moneymind-6-levels";
  const bundle = BUNDLES[bundleKey];

  const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [paymentId, setPaymentId] = useState("");
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

  // Load Razorpay script
  useEffect(() => {
    if (!FLAGS.MONEYMIND_CHECKOUT) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handlePayment = useCallback(async () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setStep("processing");

    try {
      // Step 1: Create Razorpay order on backend
      const orderRes = await fetch("/api/moneymind/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundle: bundleKey,
          amount: bundle.price * 100, // Razorpay expects paise
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });

      if (!orderRes.ok) {
        const { detail } = await orderRes.json();
        throw new Error(detail ?? "Failed to create order.");
      }

      const { order_id } = await orderRes.json();

      // Step 2: Open Razorpay modal
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: bundle.price * 100,
        currency: "INR",
        name: "RoboDynamics",
        description: bundle.name,
        order_id,
        handler: async (response: RazorpayResponse) => {
          // Step 3: Verify payment on backend
          const verifyRes = await fetch("/api/moneymind/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bundle: bundleKey,
              email: form.email,
            }),
          });

          if (verifyRes.ok) {
            setPaymentId(response.razorpay_payment_id);
            setStep("success");
          } else {
            setStep("error");
            setError("Payment verification failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: THEME.accent },
        modal: {
          ondismiss: () => setStep("form"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      setStep("form");
    }
  }, [form, bundle, bundleKey, razorpayKey]);

  // Feature flag guard
  if (!FLAGS.MONEYMIND_CHECKOUT) return <CheckoutDisabled />;

  if (!bundle) {
    return (
      <div style={{ background: THEME.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: THEME.textSub }}>Bundle not found. <a href="/moneymind" style={{ color: THEME.accent }}>Go back</a></p>
      </div>
    );
  }

  const savings = bundle.mrp - bundle.price;
  const savingsPct = Math.round((savings / bundle.mrp) * 100);

  return (
    <div style={{ background: THEME.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Nav */}
        <div style={{ marginBottom: 32 }}>
          <a href="/moneymind" style={{ color: THEME.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            ← Back to MoneyMind
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32, alignItems: "start" }}>

          {/* Left: Order Summary */}
          <div>
            <h1 style={{ color: THEME.text, fontWeight: 900, fontSize: 28, marginBottom: 8 }}>
              {bundle.badge} {bundle.name}
            </h1>
            <p style={{ color: THEME.textSub, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              {bundle.description}
            </p>

            {/* What's included */}
            <div style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}30`, borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ color: THEME.accent, fontWeight: 800, fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 16 }}>
                What's Included
              </div>
              {bundle.levels.map((level, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: THEME.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#451A03", fontSize: 11, fontWeight: 900 }}>✓</span>
                  </div>
                  <span style={{ color: THEME.text, fontSize: 14 }}>{level}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${THEME.border}30` }}>
                {[
                  "ATM, UPI & Bank simulators",
                  "24 AI-guided lessons",
                  "Parent dashboard with chore & reward system",
                  "Scam Lab, Money Garden & Salary Decoder",
                  "Lifetime access — no renewal",
                ].map((feature, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: "#10B981", fontSize: 13 }}>✦</span>
                    <span style={{ color: THEME.textSub, fontSize: 13 }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div style={{ background: `${THEME.accent}10`, border: `1px solid ${THEME.accent}40`, borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: THEME.textSub, fontSize: 14 }}>Original Price</span>
                <span style={{ color: THEME.textSub, fontSize: 14, textDecoration: "line-through" }}>₹{bundle.mrp.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#10B981", fontSize: 14, fontWeight: 700 }}>You Save ({savingsPct}% off)</span>
                <span style={{ color: "#10B981", fontSize: 14, fontWeight: 700 }}>−₹{savings.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${THEME.accent}30` }}>
                <span style={{ color: THEME.text, fontSize: 18, fontWeight: 900 }}>Total</span>
                <span style={{ color: THEME.accent, fontSize: 22, fontWeight: 900 }}>₹{bundle.price.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div>
            {step === "success" ? (
              <div style={{ background: THEME.cardBg, border: `2px solid #10B981`, borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h2 style={{ color: "#10B981", fontWeight: 900, fontSize: 22, marginBottom: 12 }}>Payment Successful!</h2>
                <p style={{ color: THEME.textSub, fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
                  Welcome to MoneyMind, {form.name}! A confirmation has been sent to {form.email}.
                </p>
                <p style={{ color: THEME.textSub, fontSize: 12, marginBottom: 28 }}>
                  Payment ID: <code style={{ background: "#0F172A", padding: "2px 6px", borderRadius: 4 }}>{paymentId}</code>
                </p>
                <a
                  href="/moneymind"
                  style={{ background: THEME.accent, color: "#451A03", borderRadius: 10, padding: "14px 32px", fontWeight: 800, fontSize: 15, textDecoration: "none", display: "inline-block" }}
                >
                  Start Learning →
                </a>
              </div>
            ) : (
              <div style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: "32px 28px" }}>
                <h2 style={{ color: THEME.text, fontWeight: 800, fontSize: 18, marginBottom: 24 }}>Your Details</h2>

                {/* Form Fields */}
                {[
                  { key: "name", label: "Full Name", placeholder: "e.g. Arjun Mehta", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "e.g. arjun@example.com", type: "email" },
                  { key: "phone", label: "Mobile Number", placeholder: "10-digit number", type: "tel" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} style={{ marginBottom: 20 }}>
                    <label style={{ color: THEME.textSub, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#0F172A",
                        border: `1px solid ${THEME.border}`,
                        borderRadius: 8,
                        padding: "12px 14px",
                        color: THEME.text,
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}

                {error && (
                  <div style={{ background: "#EF44441A", border: "1px solid #EF4444", borderRadius: 8, padding: "10px 14px", color: "#FCA5A5", fontSize: 13, marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={step === "processing"}
                  style={{
                    width: "100%",
                    background: step === "processing" ? "#78350F" : `linear-gradient(90deg, #FCD34D, ${THEME.accent})`,
                    color: "#451A03",
                    borderRadius: 10,
                    padding: "16px",
                    fontWeight: 900,
                    fontSize: 16,
                    border: "none",
                    cursor: step === "processing" ? "not-allowed" : "pointer",
                    marginBottom: 16,
                  }}
                >
                  {step === "processing" ? "Processing…" : `Pay ₹${bundle.price.toLocaleString("en-IN")} via Razorpay`}
                </button>

                <div style={{ textAlign: "center", color: THEME.textSub, fontSize: 12, lineHeight: 1.6 }}>
                  <span>🔒 Secured by Razorpay</span>
                  <span style={{ margin: "0 8px" }}>·</span>
                  <span>UPI / Cards / Net Banking accepted</span>
                  <br />
                  <span style={{ marginTop: 6, display: "inline-block" }}>
                    Questions? Email <a href="mailto:support@robodynamics.in" style={{ color: THEME.accent }}>support@robodynamics.in</a>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
