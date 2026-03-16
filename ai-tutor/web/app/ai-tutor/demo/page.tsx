/**
 * /ai-tutor/demo?chapter=L1_COMPLETING_WHOLE
 *
 * Self-serve demo — no login required.
 * Fetches a guest JWT from the FastAPI backend and redirects to the tutor.
 */
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TUTOR_INTERNAL_KEY = process.env.TUTOR_INTERNAL_KEY ?? "";
const API_BASE = process.env.TUTOR_API_INTERNAL_URL ?? "http://127.0.0.1:8091";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function DemoPage({ searchParams }: Props) {
  const chapter = String(searchParams.chapter ?? "L1_COMPLETING_WHOLE").toUpperCase();
  const grade = String(searchParams.grade ?? "8");
  const fresh = searchParams.fresh === "1" ? "1" : "0";

  let token = "";
  try {
    const res = await fetch(
      `${API_BASE}/ai-tutor-api/tutor/guest-token?chapter=${encodeURIComponent(chapter)}&grade=${encodeURIComponent(grade)}`,
      {
        headers: { "X-AI-TUTOR-KEY": TUTOR_INTERNAL_KEY },
        cache: "no-store",
      }
    );
    if (res.ok) {
      const data = (await res.json()) as { token?: string };
      token = data.token ?? "";
    }
  } catch {
    // fall through to error state
  }

  if (!token) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
        <h2>Demo unavailable</h2>
        <p>Could not start the demo session. Please try again shortly.</p>
        <a href="https://robodynamics.in" style={{ color: "#0ea5e9" }}>← Back to RoboDynamics</a>
      </main>
    );
  }

  // Redirect to the /learn path so the Duolingo-style layout activates.
  // Pass fresh=1 when the caller wants a guaranteed brand-new session
  // (clears any saved localStorage bookmark in the client).
  redirect(
    `/ai-tutor/learn?token=${encodeURIComponent(token)}&chapterCode=${encodeURIComponent(chapter)}&demo=1${fresh === "1" ? "&fresh=1" : ""}`
  );
}
