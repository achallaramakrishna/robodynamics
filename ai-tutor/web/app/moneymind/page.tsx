import ProductLandingShell from "@/components/ProductLandingShell";
import { MONEYMIND_LEVELS } from "@/lib/moneyMindCatalog";

export default function MoneyMindLandingPage() {
  return (
    <ProductLandingShell
      eyebrow="Artha"
      title="Financial literacy with simulations, not lectures."
      subtitle="Artha covers saving, digital payments, budgeting, safety, investing, and real-world money choices. The public entry route was missing from the deployed app, so this page restores a working launch point."
      accent="#f59e0b"
      primaryHref="/auth/register?next=%2Fmoneymind"
      primaryLabel="Start Artha"
      secondaryHref="/auth/login?next=%2Fmoneymind"
      secondaryLabel="Login"
      stats={[
        { label: "Progression Levels", value: String(MONEYMIND_LEVELS.length) },
        { label: "Core Lessons", value: String(MONEYMIND_LEVELS.reduce((sum, level) => sum + level.lessons.length, 0)) },
        { label: "Free Previews", value: String(MONEYMIND_LEVELS.flatMap((level) => level.lessons).filter((lesson) => lesson.freePreview).length) },
      ]}
      levels={MONEYMIND_LEVELS.map((level) => ({
        id: level.id,
        name: `${level.order}. ${level.name}`,
        tagline: level.tagline,
        accent: level.color,
        meta: `${level.ageEquiv} · ${level.gradeEquiv}`,
        lessons: level.lessons.map((lesson) => ({ id: lesson.id, title: lesson.title })),
      }))}
    />
  );
}
