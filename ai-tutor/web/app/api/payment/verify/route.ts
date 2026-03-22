import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, buildDefaultSession, ensureEnrollment, parseAppSession, serializeAppSession } from "@/lib/appSession";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";

export async function POST(req: NextRequest) {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, grade } = await req.json();

  if (RAZORPAY_KEY_SECRET && razorpaySignature) {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body).digest("hex");
    if (expected !== razorpaySignature) {
      return NextResponse.json({ success: false, message: "Signature mismatch" }, { status: 400 });
    }
  }

  const cookieStore = await cookies();
  const current = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value) ?? buildDefaultSession({ role: "PARENT", grade: Number(grade) || 5 });
  const next = ensureEnrollment(current, Number(grade) || current.grade || 5);
  cookieStore.set(APP_SESSION_COOKIE, serializeAppSession(next), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return NextResponse.json({ success: true, paymentId: razorpayPaymentId });
}
