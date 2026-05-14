import { buildVaaniCoursePayload } from "@/lib/VaaniData";
import VaaniCourseClient from "./VaaniCourseClient";

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

export default async function VaaniLevelPage(
  { params }: { params: { level: string } }
) {
  const { level } = params;
  // Standardize the level ID (e.g. 'level-1' -> 'l1' or similar for the data builder)
  const id = level.replace('level-', 'l'); 
  const payload = buildVaaniCoursePayload(id);
  return <VaaniCourseClient payload={payload} />;
}
