import { buildMindSutraLessonPayload } from "@/lib/mindsutraCourseData";
import MindSutraLessonClient from "./MindSutraLessonClient";

export default async function MindSutraLessonPage(
  { params }: { params: { level: string; lessonId: string } }
) {
  const { lessonId } = params;
  const payload = buildMindSutraLessonPayload(lessonId);
  if (!payload) {
    return <main style={{ padding: 32 }}>Lesson not found.</main>;
  }
  return <MindSutraLessonClient payload={payload} />;
}


