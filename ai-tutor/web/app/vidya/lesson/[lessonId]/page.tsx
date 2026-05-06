import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import { getVidyaLesson } from "@/lib/vidyaCatalog";
import VidyaLessonClient from "./VidyaLessonClient";

export default async function VidyaLessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);
  
  // The Catalog calculates the dynamic payload based on the user's Grade/Age
  const payload = getVidyaLesson(params.lessonId, session);

  if (!payload) {
    return notFound();
  }

  return <VidyaLessonClient payload={payload} />;
}
