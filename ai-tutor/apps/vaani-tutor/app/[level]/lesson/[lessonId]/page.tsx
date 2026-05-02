import { getVaaniLesson, VaaniLessonPayload, buildVaaniCoursePayload } from "@/lib/VaaniData";
import VaaniLessonClient from "./VaaniLessonClient";

export function generateStaticParams() {
  const levels = ["level-1", "level-2", "level-3", "level-4", "level-5", "level-6"];
  const params: any[] = [];

  levels.forEach(level => {
    const id = level.replace('level-', 'l');
    const course = buildVaaniCoursePayload(id);
    course.lessons.forEach(lesson => {
      params.push({
        level: level,
        lessonId: lesson.id
      });
    });
  });

  return params;
}

export default function Page({ params }: { params: { level: string; lessonId: string } }) {
  const { level, lessonId } = params;
  const gradeId = level.replace('level-', 'l');
  const payload = getVaaniLesson(gradeId, lessonId);

  return <VaaniLessonClient payload={payload} />;
}
