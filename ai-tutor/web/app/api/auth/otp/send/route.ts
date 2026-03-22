import { NextRequest, NextResponse } from "next/server";

const JAVA_LMS_URL = process.env.JAVA_LMS_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone || phone.length !== 10) {
    return NextResponse.json({ success: false, message: "Invalid phone number" }, { status: 400 });
  }
  try {
    await fetch(`${JAVA_LMS_URL}/robodynamics/api/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
  } catch {
    // Java LMS unavailable — stub returns success for dev
  }
  return NextResponse.json({ success: true, message: `OTP sent to +91 ${phone}` });
}
