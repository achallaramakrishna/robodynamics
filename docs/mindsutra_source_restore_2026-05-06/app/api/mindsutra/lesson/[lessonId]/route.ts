import { NextResponse } from "next/server";
import { buildMindSutraLessonPayload } from "@/lib/mindsutraCourseData";

export async function GET(
  _request: Request,
  { params }: { params: { lessonId: string } }
) {
  const { lessonId } = params;
  const payload = buildMindSutraLessonPayload(lessonId);
  if (!payload) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }
  return NextResponse.json(payload);
}


