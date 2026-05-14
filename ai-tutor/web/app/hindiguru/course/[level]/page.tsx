import ProductLandingShell from "@/components/ProductLandingShell";
import { HINDIGURU_LEVELS } from "@/lib/hindiGuruCatalog";
import { notFound } from "next/navigation";

export default function HindiGuruCoursePage({
  params,
}: {
  params: { level: string };
}) {
  const current = HINDIGURU_LEVELS.find((level) => level.id === params.level);
  if (!current) notFound();

  return (
    <ProductLandingShell
      eyebrow="HindiSutra"
      title={`${current.name} Hindi learning track`}
      subtitle="HindiSutra course data is already present in the repo. This page restores the public course route so the published Grade URLs stop 404ing."
      accent={current.color}
      primaryHref={`/auth/register?next=${encodeURIComponent(`/hindiguru/course/${current.id}`)}`}
      primaryLabel="Start HindiSutra"
      secondaryHref={`/auth/login?next=${encodeURIComponent(`/hindiguru/course/${current.id}`)}`}
      secondaryLabel="Login"
      stats={[
        { label: "Published Grades", value: String(HINDIGURU_LEVELS.length) },
        { label: "Current Grade", value: current.ageEquiv },
        { label: "Lessons Listed", value: String(current.lessons.length) },
      ]}
      levels={HINDIGURU_LEVELS.map((level) => ({
        id: level.id,
        name: level.name,
        tagline: level.tagline,
        accent: level.color,
        meta: level.ageEquiv,
        lessons: level.lessons.map((lesson) => ({ id: lesson.id, title: lesson.title })),
      }))}
    />
  );
}
