import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, buildDefaultSession, buildParentDashboardData, parseAppSession } from "@/lib/appSession";

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value) ?? buildDefaultSession({ role: "PARENT", grade: 5 });
  return NextResponse.json(buildParentDashboardData(session));
}
