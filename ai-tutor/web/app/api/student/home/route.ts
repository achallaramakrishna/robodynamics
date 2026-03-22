import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, buildDefaultSession, buildStudentHomeData, parseAppSession } from "@/lib/appSession";

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value) ?? buildDefaultSession({ role: "STUDENT", grade: 5 });
  return NextResponse.json(buildStudentHomeData(session));
}
