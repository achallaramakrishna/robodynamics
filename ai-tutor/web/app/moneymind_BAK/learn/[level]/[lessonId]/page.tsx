import { notFound } from "next/navigation";
import { getLessonById } from "@/lib/moneyMindLessonRegistry";
import LessonPlayer from "./LessonPlayer";

interface Props {
  params: { level: string; lessonId: string };
}

export function generateStaticParams() {
  const pairs = [
    { level: "level-1", lessonId: "MM_L1_1" }, { level: "level-1", lessonId: "MM_L1_2" },
    { level: "level-1", lessonId: "MM_L1_3" }, { level: "level-1", lessonId: "MM_L1_4" },
    { level: "level-2", lessonId: "MM_L2_1" }, { level: "level-2", lessonId: "MM_L2_2" },
    { level: "level-2", lessonId: "MM_L2_3" }, { level: "level-2", lessonId: "MM_L2_4" },
    { level: "level-3", lessonId: "MM_L3_1" }, { level: "level-3", lessonId: "MM_L3_2" },
    { level: "level-3", lessonId: "MM_L3_3" }, { level: "level-3", lessonId: "MM_L3_4" },
    { level: "level-4", lessonId: "MM_L4_1" }, { level: "level-4", lessonId: "MM_L4_2" },
    { level: "level-4", lessonId: "MM_L4_3" }, { level: "level-4", lessonId: "MM_L4_4" },
    { level: "level-5", lessonId: "MM_L5_1" }, { level: "level-5", lessonId: "MM_L5_2" },
    { level: "level-5", lessonId: "MM_L5_3" }, { level: "level-5", lessonId: "MM_L5_4" },
    { level: "level-6", lessonId: "MM_L6_1" }, { level: "level-6", lessonId: "MM_L6_2" },
    { level: "level-6", lessonId: "MM_L6_3" }, { level: "level-6", lessonId: "MM_L6_4" },
  ];
  return pairs;
}

export default function LessonPage({ params }: Props) {
  const lesson = getLessonById(params.lessonId);
  if (!lesson) notFound();
  return <LessonPlayer lesson={lesson} />;
}
