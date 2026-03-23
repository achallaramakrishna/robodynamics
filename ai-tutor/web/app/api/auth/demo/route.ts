import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  APP_SESSION_COOKIE,
  buildDefaultSession,
  serializeAppSession,
} from "@/lib/appSession";

// ─── Demo login — sets a rich mock session for testing without a real account ─

// Demo accounts:
//   Student: demo.student@mindsutra.in / any PIN
//   Parent:  demo.parent@mindsutra.in  / any PIN
// Or hit GET /api/auth/demo?role=student|parent to get a session instantly.

const DEMO_STUDENT_SESSION = {
  role: "STUDENT" as const,
  grade: 4,
  parentName: "Sunita Demo",
  childName: "Arjun",
  userId: 9001,
  childId: 9001,
};

const DEMO_PARENT_SESSION = {
  role: "PARENT" as const,
  grade: 4,
  parentName: "Sunita Demo",
  childName: "Arjun",
  userId: 9002,
  childId: 9001,
};

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role") ?? "student";
  const isParent = role === "parent";

  const opts = isParent ? DEMO_PARENT_SESSION : DEMO_STUDENT_SESSION;
  const session = buildDefaultSession(opts);

  // Give the demo student 2 chapters completed to show progress
  if (!isParent && session.enrollments.length > 0) {
    session.enrollments[0].chaptersCompleted = 2;
    session.enrollments[0].status = "in_progress";
  }

  const cookieStore = await cookies();
  cookieStore.set("rd_auth_token", `demo_token_${Date.now()}`, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  cookieStore.set(APP_SESSION_COOKIE, serializeAppSession(session), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  const dest = isParent ? "/parent/dashboard" : "/student/home";
  return NextResponse.redirect(new URL(dest, req.url));
}
