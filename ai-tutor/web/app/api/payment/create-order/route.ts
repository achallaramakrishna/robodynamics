import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const JAVA_LMS_URL = process.env.JAVA_LMS_URL ?? "http://localhost:8080";
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? "rzp_test_mock";

// Price map in paise by SKU (1 INR = 100 paise)
const SKU_PRICES: Record<string, number> = {
  "single":        149900,  // ₹1,499 — single grade, lifetime
  "bundle_g4_g8":  399900,  // ₹3,999 — all grades G4–G8, lifetime
  "bundle_family": 499900,  // ₹4,999 — 2 children, G4–G8, lifetime
};
const COUPON_DISCOUNTS: Record<string, number> = {
  "VEDIC20": 50000,  // ₹500 off
  "DEMO": 50000,
};

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("rd_auth_token")?.value;

  // Uncomment to enforce auth:
  // if (!authToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { grade, couponCode, sku = "single" } = await req.json();
  const baseAmount = SKU_PRICES[sku] ?? SKU_PRICES["single"];
  const discount = couponCode ? (COUPON_DISCOUNTS[couponCode.toUpperCase()] ?? 0) : 0;
  const finalAmount = Math.max(baseAmount - discount, 0);

  try {
    const res = await fetch(`${JAVA_LMS_URL}/robodynamics/api/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ grade, couponCode, sku, amount: finalAmount }),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ orderId: data.orderId, amount: data.amount, currency: "INR", keyId: RAZORPAY_KEY_ID });
    }
  } catch {
    // Java LMS unavailable — return mock order for dev/testing
  }

  // Mock order (dev mode)
  return NextResponse.json({
    orderId: `order_mock_${Date.now()}`,
    amount: finalAmount,
    currency: "INR",
    keyId: RAZORPAY_KEY_ID,
  });
}
