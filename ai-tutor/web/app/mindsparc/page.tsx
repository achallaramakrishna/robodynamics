import ProductLandingShell from "@/components/ProductLandingShell";
import { MINDSPARC_LEVELS } from "@/lib/mindsparcCatalog";

export default function MindSparcLandingPage() {
  return (
    <ProductLandingShell
      eyebrow="Yukti"
      title="Aptitude and reasoning that feels like a game, not a worksheet."
      subtitle="Yukti is the logic-track companion for pattern recognition, deduction, verbal analysis, and quantitative agility. The live route was missing; this page restores the product entrypoint using the existing course catalog."
      accent="#34d399"
      primaryHref="/auth/register?next=%2Fmindsparc"
      primaryLabel="Start Yukti"
      secondaryHref="/auth/login?next=%2Fmindsparc"
      secondaryLabel="Login"
      stats={[
        { label: "Progression Levels", value: String(MINDSPARC_LEVELS.length) },
        { label: "Live Lessons", value: String(MINDSPARC_LEVELS.reduce((sum, level) => sum + level.lessons.length, 0)) },
        { label: "Free Previews", value: String(MINDSPARC_LEVELS.flatMap((level) => level.lessons).filter((lesson) => lesson.freePreview).length) },
      ]}
      levels={MINDSPARC_LEVELS.map((level) => ({
        id: level.id,
        name: `${level.order}. ${level.name}`,
        tagline: level.tagline,
        accent: level.color,
        meta: level.ageEquiv,
        lessons: level.lessons.map((lesson) => ({ id: lesson.id, title: lesson.title })),
      }))}
    />
  );
}
