import { buildMoneyMindCoursePayload, fetchLevelProgress } from "@/lib/moneymindCourseData";
import { getMoneyMindUserId } from "@/lib/moneyMindAuth";
import MoneyMindCourseClient from "./MoneyMindCourseClient";
import { cookies } from "next/headers";

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
  const cookieStore = cookies();
  const userId = getMoneyMindUserId(cookieStore);

  const levelId = level.replace("level-", "L").toUpperCase();
  const progress = await fetchLevelProgress(userId, levelId);
  const payload = buildMoneyMindCoursePayload(level, progress);

  return <MoneyMindCourseClient payload={payload} userId={userId} />;
}
