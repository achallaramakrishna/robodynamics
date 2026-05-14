import { NextRequest, NextResponse } from "next/server";
import { buildMindSutraCoursePayload } from "@/lib/mindsutraCourseData";

export async function GET(
  request: NextRequest,
  { params }: { params: { level: string } }
) {
  const { level } = params;
  const selectedLessonId = request.nextUrl.searchParams.get("lesson") ?? undefined;
  return NextResponse.json(buildMindSutraCoursePayload(level, selectedLessonId));
}


