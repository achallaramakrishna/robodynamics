"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

const GRADE_NAMES: Record<string, string> = {
  "grade-4": "Grade 4", "grade-5": "Grade 5", "grade-6": "Grade 6", "grade-7": "Grade 7", "grade-8": "Grade 8",
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const gradeSlug = (params?.grade as string) ?? "grade-5";
  const gradeName = GRADE_NAMES[gradeSlug] ?? "Grade 5";
  const gradeNum = gradeSlug.replace("grade-", "");

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rzpLoaded, setRzpLoaded] = useState(false);

  const finalPrice = couponApplied ? 1499 : 1999;
  const expiryDate = new Date(); expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const expiryStr = expiryDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  /* Load Razorpay script */
  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) { setRzpLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => setRzpLoaded(true);
    document.body.appendChild(s);
  }, []);

  function applyCoupon() {
    setCouponError("");
    if (coupon.toUpperCase() === "VEDIC20") { setCouponApplied(true); }
    else if (coupon.toUpperCase() === "DEMO") { setCouponApplied(true); }
    else { setCouponError("Invalid coupon code"); setCouponApplied(false); }
  }

  async function handlePay() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: gradeNum, couponCode: couponApplied ? coupon : undefined }),
      });
      if (res.status === 401) {
        setError("Please login or register first.");
        setLoading(false);
        router.push(`/auth/register?grade=${gradeNum}`);
        return;
      }
      const order = await res.json();

      if (!rzpLoaded || !window.Razorpay) {
        setError("Payment gateway is loading. Please try again in a moment.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency ?? "INR",
        name: "MindSutra",
        description: `Vedic Maths ${gradeName} — 1 Year`,
        order_id: order.orderId,
        image: "/favicon.ico",
        theme: { color: "#F97316" },
        prefill: { name: "", email: "", contact: "" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          await fetch("/api/payment/verify", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              grade: gradeNum,
            }),
          });
          router.push(`/checkout/success?grade=${gradeNum}&orderId=${response.razorpay_order_id}`);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (e) {
      setError("Could not initiate payment. Please try again.");
      setLoading(false);
    }
  }

  const S = {
    page: { minHeight: "100vh", background: "#F8FAFC", padding: "0 0 60px" },
    topBar: { background: "#0F172A", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logoText: { color: "#F97316", fontWeight: 800, fontSize: 18, textDecoration: "none" },
    loginLink: { color: "#94A3B8", fontSize: 13, textDecoration: "none" },
    wrap: { maxWidth: 860, margin: "0 auto", padding: "32px 16px", display: "grid", gridTemplateColumns: "1fr", gap: 24 } as React.CSSProperties,
    card: { background: "#FFFFFF", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" },
    cardTitle: { fontWeight: 700, color: "#0F172A", fontSize: 17, marginBottom: 16 },
    productRow: { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 20 },
    productIcon: { width: 60, height: 60, borderRadius: 10, background: "linear-gradient(135deg, #F97316, #DC2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 },
    productName: { fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 4 },
    productMeta: { color: "#64748B", fontSize: 13 },
    checkList: { listStyle: "none", padding: 0, margin: "16px 0 0" },
    checkItem: { display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#374151", marginBottom: 8 },
    checkIcon: { color: "#22C55E", fontWeight: 700, flexShrink: 0 },
    divider: { height: 1, background: "#F1F5F9", margin: "20px 0" },
    priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    priceLabel: { color: "#64748B", fontSize: 14 },
    priceSale: { fontSize: 28, fontWeight: 800, color: "#0F172A" },
    priceOld: { fontSize: 16, color: "#94A3B8", textDecoration: "line-through", marginLeft: 8 },
    discountBadge: { background: "#DCFCE7", color: "#16A34A", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 4 },
    gstNote: { color: "#94A3B8", fontSize: 12, marginTop: 4, marginBottom: 16 },
    couponRow: { display: "flex", gap: 8, marginBottom: 8 },
    couponInput: { flex: 1, padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 14, outline: "none" },
    couponBtn: { background: "#F97316", color: "#FFF", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13 },
    couponSuccess: { color: "#16A34A", fontSize: 12, marginBottom: 12 },
    couponErr: { color: "#DC2626", fontSize: 12, marginBottom: 12 },
    payBtn: (disabled: boolean) => ({
      width: "100%", padding: "14px", borderRadius: 10, fontWeight: 700, fontSize: 16,
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      background: disabled ? "#E2E8F0" : "#F97316", color: disabled ? "#94A3B8" : "#FFFFFF",
      marginBottom: 12,
    }),
    trustRow: { display: "flex", gap: 16, flexWrap: "wrap" as const, justifyContent: "center" },
    trustItem: { color: "#64748B", fontSize: 12, display: "flex", gap: 4, alignItems: "center" },
    errMsg: { background: "#FEF2F2", color: "#DC2626", fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 12 },
    urgency: { textAlign: "center" as const, background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#92400E" },
  };

  return (
    <div style={S.page}>
      <nav style={S.topBar}>
        <a href="/vedic-math" style={S.logoText}>MindSutra</a>
        <a href="/auth/login" style={S.loginLink}>Login</a>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>

        {/* Left: Order summary */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Order Summary</h2>

          <div style={S.productRow}>
            <div style={S.productIcon}>🧮</div>
            <div>
              <div style={S.productName}>MindSutra {gradeName} — Vedic Maths AI Tutor</div>
              <div style={S.productMeta}>1 Year Access · Expires {expiryStr}</div>
            </div>
          </div>

          <ul style={S.checkList}>
            {["8 CBSE-aligned chapters", "AI avatar tutor (adapts to your child)", "9 practice sessions per chapter", "Parent progress dashboard", "Ask doubts anytime", "Hindi + English support"].map(item => (
              <li key={item} style={S.checkItem}>
                <span style={S.checkIcon}>✓</span> {item}
              </li>
            ))}
          </ul>

          <div style={S.divider} />

          <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ color: "#166534", fontSize: 13, fontWeight: 600, margin: 0 }}>
              🎓 30-day money-back guarantee — no questions asked.
            </p>
          </div>
        </div>

        {/* Right: Payment */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Complete Payment</h2>

          <div style={S.urgency}>⏰ Limited offer — early bird pricing available now</div>

          {error && <div style={S.errMsg}>{error}</div>}

          <div style={S.priceRow}>
            <span>
              <span style={S.priceSale}>₹{finalPrice.toLocaleString("en-IN")}</span>
              {!couponApplied && <span style={S.priceOld}>₹4,999</span>}
            </span>
            <span style={S.discountBadge}>{couponApplied ? "Extra 25% OFF" : "60% OFF"}</span>
          </div>
          <p style={S.gstNote}>Inclusive of all taxes · 1 year access</p>

          <div style={S.couponRow}>
            <input style={S.couponInput} value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code" />
            <button style={S.couponBtn} onClick={applyCoupon}>Apply</button>
          </div>
          {couponApplied && <p style={S.couponSuccess}>✓ Coupon applied — ₹500 off!</p>}
          {couponError && <p style={S.couponErr}>{couponError}</p>}

          <div style={S.divider} />

          <div style={S.priceRow}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 22, color: "#0F172A" }}>₹{finalPrice.toLocaleString("en-IN")}</span>
          </div>

          <button style={S.payBtn(loading)} disabled={loading} onClick={handlePay}>
            {loading ? "Opening payment..." : `Pay ₹${finalPrice.toLocaleString("en-IN")} Securely`}
          </button>

          <div style={S.trustRow}>
            <span style={S.trustItem}>🔒 Razorpay Secured</span>
            <span style={S.trustItem}>✅ SSL Encrypted</span>
            <span style={S.trustItem}>↩️ 30-day refund</span>
          </div>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#94A3B8" }}>
            By paying, you agree to our <a href="/terms" style={{ color: "#F97316" }}>Terms</a> &amp; <a href="/privacy" style={{ color: "#F97316" }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

