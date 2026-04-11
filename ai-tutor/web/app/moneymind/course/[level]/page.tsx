import { buildMoneyMindCoursePayload } from "@/lib/moneymindCourseData";
import MoneyMindCourseClient from "./MoneyMindCourseClient";

export function generateStaticParams() {
  return [
    { level: "level-1" },
    { level: "level-2" },
    { level: "level-3" },
    { level: "level-4" },
    { level: "level-5" },
    { level: "level-6" },
  ];
}

export default async function MoneyMindCoursePage(
  { params }: { params: { level: string } }
) {
  const { level } = params;
  const payload = buildMoneyMindCoursePayload(level);
  return <MoneyMindCourseClient payload={payload} />;
}
