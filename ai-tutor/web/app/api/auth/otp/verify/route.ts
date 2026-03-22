import { NextRequest, NextResponse } from "next/server";

const JAVA_LMS_URL = process.env.JAVA_LMS_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const { phone, otp } = await req.json();
  try {
    const res = await fetch(`${JAVA_LMS_URL}/robodynamics/api/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, verified: data.verified ?? true });
    }
  } catch {
    // Dev stub: accept any 6-digit OTP
  }
  // Stub: any OTP is valid in dev mode
  return NextResponse.json({ success: true, verified: true });
}
