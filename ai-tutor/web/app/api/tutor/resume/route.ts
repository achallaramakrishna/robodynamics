import { NextRequest, NextResponse } from "next/server";
import { callTutorApi } from "@/lib/server";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }
    const data = await callTutorApi(`/ai-tutor-api/vedic/resume?sessionId=${encodeURIComponent(sessionId)}`, "GET");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resume tutor session" },
      { status: 500 }
    );
  }
}
