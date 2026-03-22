import { NextRequest, NextResponse } from "next/server";
import { callTutorApi } from "@/lib/server";

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get("courseId");
    const grade = request.nextUrl.searchParams.get("grade");
    const chapterCode = request.nextUrl.searchParams.get("chapterCode");
    const params = new URLSearchParams();
    if (courseId) params.set("courseId", courseId);
    if (grade) params.set("grade", grade);
    if (chapterCode) params.set("chapterCode", chapterCode);
    const suffix = params.size ? `?${params.toString()}` : "";
    const data = await callTutorApi(`/ai-tutor-api/vedic/catalog${suffix}`, "GET");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load chapter catalog" },
      { status: 500 }
    );
  }
}
