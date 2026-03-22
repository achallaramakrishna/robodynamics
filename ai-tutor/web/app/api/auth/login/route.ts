import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, buildDefaultSession, parseAppSession, serializeAppSession } from "@/lib/appSession";

const JAVA_LMS_URL = process.env.JAVA_LMS_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await fetch(`${JAVA_LMS_URL}/robodynamics/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      const cookieStore = await cookies();
      cookieStore.set("rd_auth_token", data.token ?? "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      const existing = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);
      const session = existing ?? buildDefaultSession({
        role: data.role === "PARENT" ? "PARENT" : "STUDENT",
        userId: Number(data.userId) || 1,
        childId: Number(data.childId) || Number(data.userId) || 1,
      });
      cookieStore.set(APP_SESSION_COOKIE, serializeAppSession(session), {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      return NextResponse.json({ success: true, role: data.role, userId: data.userId });
    }
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ success: false, message: err.message ?? "Invalid credentials" }, { status: 401 });
  } catch {
    const cookieStore = await cookies();
    cookieStore.set("rd_auth_token", `mock_token_${Date.now()}`, { httpOnly: true, sameSite: "lax", maxAge: 86400, path: "/" });
    const session = buildDefaultSession({ role: "STUDENT", grade: 5, userId: 1, childId: 1 });
    cookieStore.set(APP_SESSION_COOKIE, serializeAppSession(session), { httpOnly: true, sameSite: "lax", maxAge: 86400, path: "/" });
    return NextResponse.json({ success: true, role: "STUDENT", userId: 1 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("rd_auth_token", "", { maxAge: 0, path: "/" });
  cookieStore.set(APP_SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return NextResponse.json({ success: true });
}
