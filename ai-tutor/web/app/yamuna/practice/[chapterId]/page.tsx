import { CHAPTER_META } from "@/lib/yamunaProgramBank";
import YamunaPracticeClient from "./YamunaPracticeClient";
import type { Metadata } from "next";

interface PageProps {
  params: { chapterId: string };
}

export function generateStaticParams() {
  return CHAPTER_META.map((c) => ({ chapterId: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const meta = CHAPTER_META.find((c) => c.id === params.chapterId);
  return {
    title: meta ? `Practice: ${meta.title} | Yamuna Java` : "Yamuna Practice",
    description: meta
      ? `Adaptive Java coding challenges for ${meta.title} — ${meta.programCount} programs across 5 tiers`
      : "Yamuna adaptive Java practice",
  };
}

export default function YamunaPracticePage({ params }: PageProps) {
  return <YamunaPracticeClient chapterId={params.chapterId} />;
}
