import { NextRequest, NextResponse } from "next/server";
import { callTutorApi } from "@/lib/server";

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get("courseId");
    const suffix = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
    const data = await callTutorApi(`/ai-tutor-api/tutor/catalog${suffix}`, "GET");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load chapter catalog" },
      { status: 500 }
    );
  }
}

