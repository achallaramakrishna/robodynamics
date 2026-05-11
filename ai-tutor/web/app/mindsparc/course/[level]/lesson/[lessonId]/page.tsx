import { buildMindSparcLessonPayload } from "@/lib/mindsparcCourseData";
import MindSparcLessonClient from "./MindSparcLessonClient";

export default async function MindSparcLessonPage(
  { params }: { params: { level: string; lessonId: string } }
) {
  const { lessonId } = params;
  const payload = buildMindSparcLessonPayload(lessonId);
  
  if (!payload) {
    return (
      <main style={{ minHeight: '100vh', background: '#060D17', color: '#F8FAFC', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 64 }}>🧐</div>
        <h1 style={{ fontSize: 32, fontWeight: 900 }}>Module Not Found</h1>
        <p style={{ color: '#94A3B8' }}>The logic module "{lessonId}" could not be located in our cognitive catalog.</p>
        <a href="/mindsparc" style={{ padding: '12px 24px', background: '#38BDF8', color: '#0F172A', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>Return to Landing</a>
      </main>
    );
  }

  return <MindSparcLessonClient payload={payload} />;
}
