"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Razorpay types declared in app/checkout/page.tsx

const GRADE_NAMES: Record<string, string> = {
  "grade-4": "Grade 4",
  "grade-5": "Grade 5",
  "grade-6": "Grade 6",
  "grade-7": "Grade 7",
  "grade-8": "Grade 8",
};

type CheckoutConfig = {
  label: string;
  description: string;
  gradeNum: string;
  sku: "single" | "bundle_g4_g8" | "mindsparc_single";
  price: number;
  oldPrice: number;
  durationLabel: string;
  productName: string;
  productType: "mindsutra" | "mindsparc";
  features: string[];
};

function resolveCheckoutConfig(slug: string): CheckoutConfig {
  const normalized = String(slug || "grade-5").toLowerCase();
  
  // --- MindSparc Logic ---
  if (normalized.startsWith("mindsparc-")) {
    const tier = normalized.split("-")[1] || "1";
    const tierNames: Record<string, string> = {
      "1": "Foundations",
      "2": "Intermediate", 
      "3": "Advanced",
      "4": "Pre-Campus Master",
      "5": "Elite Professional"
    };
    const tName = tierNames[tier] || "Advanced";
    
    return {
      label: `MindSparc Tier ${tier} - ${tName}`,
      description: "Cognitive Mastery · 4 logic modules · Adaptive AI tutor",
      gradeNum: tier,
      sku: "mindsparc_single",
      price: 1499,
      oldPrice: 2999,
      durationLabel: "Lifetime Access",
      productName: `MindSparc Tier ${tier} Logic Mastery`,
      productType: "mindsparc",
      features: [
        "4 Advanced Logic modules",
        "Interactive SVG reasoning boards",
        "Adaptive AI Logic Coach (Sparc)",
        "Progress tracking & certificates",
        "Olympiad & Entrance prep focus",
        "Hindi + English support",
      ],
    };
  }

  // --- MindSutra (Legacy/Default) Logic ---
  const levelMap: Record<string, { grade: string; label: string }> = {
    "level-1": { grade: "4", label: "MindSutra Level 1 - Foundation" },
    "level-2": { grade: "5", label: "MindSutra Level 2 - Speed Builder" },
    "level-3": { grade: "6", label: "MindSutra Level 3 - Power" },
    "level-4": { grade: "7", label: "MindSutra Level 4 - Ace" },
    "level-5": { grade: "8", label: "MindSutra Level 5 - Champion" },
  };

  if (normalized === "bundle-mindsparc-5-tiers") {
    return {
      label: "MindSparc 5-Tier Master Bundle",
      description: "All 5 Tiers · 20 Core Modules · AI Logic Coach · Full Mastery",
      gradeNum: "5",
      sku: "bundle_g4_g8",
      price: 4999,
      oldPrice: 14995,
      durationLabel: "Lifetime Access",
      productName: "MindSparc 5-Tier Master Bundle",
      productType: "mindsparc",
      features: [
        "All 20 MindSparc modules unlocked",
        "Foundations to Elite Professional journey",
        "Adaptive AI Logic Coach (Sparc)",
        "Advanced SVG reasoning boards",
        "Olympiad & Corporate prep focus",
        "Hindi + English support",
      ],
    };
  }

  if (normalized === "bundle-mindsutra-5-levels") {
    return {
      label: "MindSutra Master Bundle",
      description: "All 5 levels · 40 chapters · full parent dashboard · lifetime access",
      gradeNum: "5",
      sku: "bundle_g4_g8",
      price: 4999,
      oldPrice: 14995,
      durationLabel: "Lifetime Access",
      productName: "MindSutra Master Bundle",
      productType: "mindsutra",
      features: [
        "All 5 levels unlocked",
        "40 MindSutra chapters",
        "AI tutor across the full journey",
        "Parent dashboard for the entire program",
        "Placement and progression workflow",
        "Hindi + English support",
      ],
    };
  }

  const levelConfig = levelMap[normalized];
  if (levelConfig) {
    return {
      label: levelConfig.label,
      description: "Single level · 8 chapters · AI tutor · parent dashboard",
      gradeNum: levelConfig.grade,
      sku: "single",
      price: 1499,
      oldPrice: 2999,
      durationLabel: "Lifetime Access",
      productName: levelConfig.label,
      productType: "mindsutra",
      features: [
        "8 MindSutra chapters",
        "AI tutor that adapts to your child",
        "Practice sessions for each chapter",
        "Parent dashboard access",
        "Ask doubts anytime",
        "Hindi + English support",
      ],
    };
  }

  const gradeLabel = GRADE_NAMES[normalized] ?? "Grade 5";
  const gradeNum = normalized.replace("grade-", "") || "5";
  return {
    label: `MindSutra ${gradeLabel}`,
    description: "Single level · 8 chapters · AI tutor · parent dashboard",
    gradeNum,
    sku: "single",
    price: 1499,
    oldPrice: 4999,
    durationLabel: "1 Year Access",
    productName: `MindSutra ${gradeLabel} - Vedic Maths AI Tutor`,
    productType: "mindsutra",
    features: [
      "8 MindSutra chapters",
      "AI tutor that adapts to your child",
      "Practice sessions for each chapter",
      "Parent dashboard access",
      "Ask doubts anytime",
      "Hindi + English support",
    ],
  };
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const checkoutSlug = (params?.grade as string) ?? "grade-5";
  const config = resolveCheckoutConfig(checkoutSlug);

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rzpLoaded, setRzpLoaded] = useState(false);

  const isFreeCoupon = couponApplied && (coupon.toUpperCase() === "LEVEL1FREE" || coupon.toUpperCase() === "FREELEVEL");
  const couponDiscount = couponApplied ? (isFreeCoupon ? config.price : 500) : 0;
  const finalPrice = Math.max(config.price - couponDiscount, 0);
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const expiryStr = expiryDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) {
      setRzpLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRzpLoaded(true);
    document.body.appendChild(script);
  }, []);

  function applyCoupon() {
    setCouponError("");
    const up = coupon.toUpperCase();
    if (up === "VEDIC20" || up === "DEMO") {
      setCouponApplied(true);
      return;
    }
    if (up === "LEVEL1FREE" || up === "FREELEVEL") {
      setCouponApplied(true);
      return;
    }
    setCouponApplied(false);
    setCouponError("Invalid coupon code");
  }

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      // Bypassing payment gateway if disabled or free
      if (process.env.NEXT_PUBLIC_PAYMENT_ENABLED !== "true" || finalPrice === 0) {
        // Handle Free Activation / Flag-based bypass
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayPaymentId: `FREE_ACT_${Date.now()}`,
            razorpayOrderId: `ORDER_ACT_${Date.now()}`,
            razorpaySignature: "BYPASS",
            grade: config.gradeNum,
          }),
        });
        if (res.ok) {
          router.push(`/checkout/success?grade=${config.gradeNum}&orderId=ACT&product=${config.productType}`);
          return;
        }
      }

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: config.gradeNum,
          sku: config.sku,
          couponCode: couponApplied ? coupon : undefined,
        }),
      });
      if (res.status === 401) {
        setError("Please login or register first.");
        setLoading(false);
        router.push(`/auth/register?grade=${config.gradeNum}`);
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
        name: config.productType === "mindsparc" ? "MindSparc" : "MindSutra",
        description: config.productName,
        order_id: order.orderId,
        image: "/favicon.ico",
        theme: { color: config.productType === "mindsparc" ? "#0EA5E9" : "#F97316" },
        prefill: { name: "", email: "", contact: "" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              grade: config.gradeNum,
            }),
          });
          router.push(`/checkout/success?grade=${config.gradeNum}&orderId=${response.razorpay_order_id}&product=${config.productType}`);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      setError("Could not initiate payment. Please try again.");
      setLoading(false);
    }
  }

  const S = {
    page: { minHeight: "100vh", background: "#F8FAFC", padding: "0 0 60px" },
    topBar: { background: "#0F172A", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logoText: { color: config.productType === "mindsparc" ? "#38BDF8" : "#F97316", fontWeight: 800, fontSize: 18, textDecoration: "none" },
    loginLink: { color: "#94A3B8", fontSize: 13, textDecoration: "none" },
    card: { background: "#FFFFFF", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" },
    cardTitle: { fontWeight: 700, color: "#0F172A", fontSize: 17, marginBottom: 16 },
    productRow: { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 20 },
    productIcon: { width: 60, height: 60, borderRadius: 10, background: config.productType === "mindsparc" ? "linear-gradient(135deg, #0EA5E9, #2563EB)" : "linear-gradient(135deg, #F97316, #DC2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: config.productType === "mindsparc" ? "32px" : "26px", flexShrink: 0 },
    productName: { fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 4 },
    productMeta: { color: "#64748B", fontSize: 13 },
    checkList: { listStyle: "none", padding: 0, margin: "16px 0 0" },
    checkItem: { display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#374151", marginBottom: 8 },
    checkIcon: { color: "#22C55E", fontWeight: 700, flexShrink: 0 },
    divider: { height: 1, background: "#F1F5F9", margin: "20px 0" },
    priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    priceSale: { fontSize: 28, fontWeight: 800, color: "#0F172A" },
    priceOld: { fontSize: 16, color: "#94A3B8", textDecoration: "line-through", marginLeft: 8 },
    discountBadge: { background: "#DCFCE7", color: "#16A34A", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 4 },
    gstNote: { color: "#94A3B8", fontSize: 12, marginTop: 4, marginBottom: 16 },
    couponRow: { display: "flex", gap: 8, marginBottom: 8 },
    couponInput: { flex: 1, padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 14, outline: "none" },
    couponBtn: { background: config.productType === "mindsparc" ? "#0EA5E9" : "#F97316", color: "#FFF", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13 },
    couponSuccess: { color: "#16A34A", fontSize: 12, marginBottom: 12 },
    couponErr: { color: "#DC2626", fontSize: 12, marginBottom: 12 },
    payBtn: (disabled: boolean) => ({
      width: "100%",
      padding: "14px",
      borderRadius: 10,
      fontWeight: 700,
      fontSize: 16,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      background: disabled ? "#E2E8F0" : (config.productType === "mindsparc" ? "#0EA5E9" : "#F97316"),
      color: disabled ? "#94A3B8" : "#FFFFFF",
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
        <a href={config.productType === "mindsparc" ? "/mindsparc" : "/mindsutra"} style={S.logoText}>{config.productType === "mindsparc" ? "MindSparc" : "MindSutra"}</a>
        <a href="/auth/login" style={S.loginLink}>Login</a>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={S.card}>
          <h2 style={S.cardTitle}>Order Summary</h2>

          <div style={S.productRow}>
            <div style={S.productIcon}>{config.productType === "mindsparc" ? "🧠" : "🧮"}</div>
            <div>
              <div style={S.productName}>{config.label}</div>
              <div style={S.productMeta}>
                {config.durationLabel}
                {config.durationLabel === "1 Year Access" ? ` · Expires ${expiryStr}` : ""}
              </div>
              <div style={{ color: "#94A3B8", fontSize: 13, marginTop: 6 }}>{config.description}</div>
            </div>
          </div>

          <ul style={S.checkList}>
            {config.features.map((item) => (
              <li key={item} style={S.checkItem}>
                <span style={S.checkIcon}>✓</span> {item}
              </li>
            ))}
          </ul>

          <div style={S.divider} />

          <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ color: "#166534", fontSize: 13, fontWeight: 600, margin: 0 }}>
              30-day money-back guarantee.
            </p>
          </div>
        </div>

        <div style={S.card}>
          <h2 style={S.cardTitle}>Complete Payment</h2>

          <div style={S.urgency}>Limited offer - early bird pricing available now</div>

          {error && <div style={S.errMsg}>{error}</div>}

          <div style={S.priceRow}>
            <span>
              <span style={S.priceSale}>₹{finalPrice.toLocaleString("en-IN")}</span>
              {!couponApplied && <span style={S.priceOld}>₹{config.oldPrice.toLocaleString("en-IN")}</span>}
            </span>
            <span style={S.discountBadge}>{couponApplied ? "Coupon Applied" : "Special Price"}</span>
          </div>
          <p style={S.gstNote}>Inclusive of all taxes · {config.durationLabel.toLowerCase()}</p>

          <div style={S.couponRow}>
            <input style={S.couponInput} value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code (e.g. LEVEL1FREE)" />
            <button style={S.couponBtn} onClick={applyCoupon}>Apply</button>
          </div>
          {couponApplied && <p style={S.couponSuccess}>✓ Coupon applied - {finalPrice === 0 ? "100% OFF" : "₹500 off"}.</p>}
          {couponError && <p style={S.couponErr}>{couponError}</p>}

          <div style={S.divider} />

          <div style={S.priceRow}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 22, color: "#0F172A" }}>₹{finalPrice.toLocaleString("en-IN")}</span>
          </div>

          <button style={S.payBtn(loading)} disabled={loading} onClick={handlePay}>
            {loading ? "Activating..." : finalPrice === 0 ? "Activate for Free →" : `Pay ₹${finalPrice.toLocaleString("en-IN")} Securely`}
          </button>

          <div style={S.trustRow}>
            <span style={S.trustItem}>Razorpay secured</span>
            <span style={S.trustItem}>SSL encrypted</span>
            <span style={S.trustItem}>30-day refund</span>
          </div>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#94A3B8" }}>
            By paying, you agree to our <a href="/terms" style={{ color: config.productType === "mindsparc" ? "#0EA5E9" : "#F97316" }}>Terms</a> and <a href="/privacy" style={{ color: config.productType === "mindsparc" ? "#0EA5E9" : "#F97316" }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
