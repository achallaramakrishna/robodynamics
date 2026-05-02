import { redirect } from "next/navigation";

interface Props {
  params: { level: string };
}

// Map level slug → first lessonId
const FIRST_LESSON: Record<string, string> = {
  "level-1": "MM_L1_1",
  "level-2": "MM_L2_1",
  "level-3": "MM_L3_1",
  "level-4": "MM_L4_1",
  "level-5": "MM_L5_1",
  "level-6": "MM_L6_1",
};

export function generateStaticParams() {
  return Object.keys(FIRST_LESSON).map((level) => ({ level }));
}

export default function LearnLevelPage({ params }: Props) {
  const lessonId = FIRST_LESSON[params.level] ?? "MM_L1_1";
  redirect(`/moneymind/learn/${params.level}/${lessonId}`);
}
