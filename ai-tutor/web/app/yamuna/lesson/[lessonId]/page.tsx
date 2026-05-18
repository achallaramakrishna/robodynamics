import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import { getYamunaLesson, getYamunaNavContext } from "@/lib/yamunaCatalog";
import VidyaLessonClient from "@/app/vidya/lesson/[lessonId]/VidyaLessonClient";

export default async function YamunaLessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);

  const payload = getYamunaLesson(params.lessonId, session ?? undefined);
  if (!payload) return notFound();

  const navContext = getYamunaNavContext(params.lessonId);

  // Reuse the Vidya lesson UI — same board types, same step format
  // Cast is safe: YamunaLessonPayload is structurally compatible with VidyaLessonPayload
  return <VidyaLessonClient payload={payload as any} navContext={navContext} />;
}
