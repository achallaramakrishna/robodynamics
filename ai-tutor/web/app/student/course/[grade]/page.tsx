export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import StudentCourseHubClient from "./StudentCourseHubClient";
import { APP_SESSION_COOKIE, buildCourseHubData, buildDefaultSession, parseAppSession } from "@/lib/appSession";

type PageProps = {
  params: { grade: string };
};

export default async function StudentCourseHubPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value) ?? buildDefaultSession({ role: "STUDENT", grade: 5 });
  const hub = buildCourseHubData(session, params.grade);
  return <StudentCourseHubClient hub={hub} />;
}
