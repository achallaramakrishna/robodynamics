import { NextRequest, NextResponse } from "next/server";
import { callTutorApi } from "@/lib/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const data = await callTutorApi("/ai-tutor-api/tutor/orchestrator/command", "POST", payload);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute orchestrator command" },
      { status: 500 }
    );
  }
}


