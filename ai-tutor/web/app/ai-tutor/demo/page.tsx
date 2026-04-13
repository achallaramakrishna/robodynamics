/**
 * /ai-tutor/demo?chapter=L1_COMPLETING_WHOLE
 *
 * Launcher used by both free demos and enrolled learner flows.
 * Free previews keep demo=1; enrolled launches skip demo onboarding.
 */
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TUTOR_INTERNAL_KEY = process.env.TUTOR_INTERNAL_KEY ?? "";
const API_BASE = process.env.TUTOR_API_INTERNAL_URL ?? "http://127.0.0.1:8091";

type DemoRoute = {
  chapter: string;
  grade: string;
};

const MINDSUTRA_LEVEL_DEMOS: Record<string, DemoRoute> = {
  "1": { grade: "4", chapter: "VM_G4_L1_FAST_ADDITION" },
  "2": { grade: "5", chapter: "VM_G5_L1_NIKHILAM_NEAR100" },
  "3": { grade: "6", chapter: "VM_G6_L1_NIKHILAM_NEAR1000" },
  "4": { grade: "7", chapter: "VM_G7_L1_NIKHILAM_NEAR10000" },
  "5": { grade: "8", chapter: "VM_G8_L1_LARGE_NIKHILAM" },
};

const MINDSPARC_LEVEL_DEMOS: Record<string, DemoRoute> = {
  "1": { grade: "4", chapter: "AR_G4_L1_PATTERNS" },
  "2": { grade: "5", chapter: "AR_G5_L1_NUMBER_SERIES" },
  "3": { grade: "6", chapter: "AR_G6_L1_SERIES" },
  "4": { grade: "7", chapter: "AR_G7_L1_SEQUENCES" },
  "5": { grade: "8", chapter: "AR_G8_L1_SEQUENCES" },
};

const MINDSUTRA_CHAPTER_ALIASES: Record<string, DemoRoute> = {
  VM_L1_1: MINDSUTRA_LEVEL_DEMOS["1"],
  VM_L2_1: MINDSUTRA_LEVEL_DEMOS["2"],
  VM_L3_1: MINDSUTRA_LEVEL_DEMOS["3"],
  VM_L4_1: MINDSUTRA_LEVEL_DEMOS["4"],
  VM_L5_1: MINDSUTRA_LEVEL_DEMOS["5"],
};

function readParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
}

function normalizeProduct(raw: string): string {
  return raw.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function normalizeLevel(raw: string): string {
  const normalized = raw.trim().toLowerCase();
  const match = normalized.match(/^level-(\d+)$/);
  return match ? match[1] : normalized;
}

function inferGradeFromChapter(chapter: string): string | null {
  const match = chapter.trim().toUpperCase().match(/_(?:G)([4-8])_/);
  return match ? match[1] : null;
}

function resolveDemoRoute(searchParams: Props["searchParams"]): DemoRoute {
  const rawChapter = readParam(searchParams.chapter).trim().toUpperCase();
  const rawGrade = readParam(searchParams.grade).trim();
  const product = normalizeProduct(readParam(searchParams.product));
  const level = normalizeLevel(readParam(searchParams.level));

  if (rawChapter && rawGrade) {
    return { chapter: rawChapter, grade: rawGrade };
  }

  const chapterAlias = MINDSUTRA_CHAPTER_ALIASES[rawChapter];
  if (chapterAlias) {
    return chapterAlias;
  }

  if (product === "mindsutra" && MINDSUTRA_LEVEL_DEMOS[level]) {
    return MINDSUTRA_LEVEL_DEMOS[level];
  }

  if ((product === "mindsparc" || product === "mindspark") && MINDSPARC_LEVEL_DEMOS[level]) {
    return MINDSPARC_LEVEL_DEMOS[level];
  }

  if (rawChapter) {
    return { chapter: rawChapter, grade: rawGrade || inferGradeFromChapter(rawChapter) || "8" };
  }

  return { chapter: "L1_COMPLETING_WHOLE", grade: rawGrade || "8" };
}

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function DemoPage({ searchParams }: Props) {
  // MoneyMind baseline test — redirect to dedicated quiz page
  const product = normalizeProduct(readParam(searchParams.product));
  if (product === "moneymind") {
    const fresh = searchParams.fresh === "1" ? "&fresh=1" : "";
    redirect(`/moneymind/baseline-test?from=demo${fresh}`);
  }

  const { chapter, grade } = resolveDemoRoute(searchParams);
  const fresh = searchParams.fresh === "1" ? "1" : "0";
  const enrolled = searchParams.enrolled === "1";
  const debug = searchParams.debug === "1";

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
        <p>Could not start the session. Please try again shortly.</p>
        <a href="https://robodynamics.in" style={{ color: "#0ea5e9" }}>Back to RoboDynamics</a>
      </main>
    );
  }

  redirect(
    `/ai-tutor/learn?token=${encodeURIComponent(token)}&chapterCode=${encodeURIComponent(chapter)}${enrolled ? "&enrolled=1" : "&demo=1"}${fresh === "1" ? "&fresh=1" : ""}${debug ? "&debug=1" : ""}`
  );
}
