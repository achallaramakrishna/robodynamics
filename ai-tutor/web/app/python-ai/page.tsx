import ProductLandingShell from "@/components/ProductLandingShell";
import { PYTHON_AI_CATALOG } from "@/lib/pythonAiCatalog";

export default function PythonAiLandingPage() {
  return (
    <ProductLandingShell
      eyebrow="Python AI"
      title="CodeSutra turns Python learning into a guided build journey."
      subtitle="The Python AI catalog is present in the repo, but its public route was not deployed in the current Next app. This restores a live entry page with the existing curriculum tiers."
      accent="#3b82f6"
      primaryHref="/auth/register?next=%2Fpython-ai"
      primaryLabel="Start Python AI"
      secondaryHref="/auth/login?next=%2Fpython-ai"
      secondaryLabel="Login"
      stats={[
        { label: "Curriculum Tiers", value: String(PYTHON_AI_CATALOG.length) },
        { label: "Chapters", value: String(PYTHON_AI_CATALOG.reduce((sum, tier) => sum + tier.chapters.length, 0)) },
        { label: "Project Tracks", value: String(PYTHON_AI_CATALOG.length) },
      ]}
      levels={PYTHON_AI_CATALOG.map((tier) => ({
        id: tier.id,
        name: tier.name,
        tagline: tier.tagline,
        accent: tier.color,
        meta: tier.targetAudience,
        lessons: tier.chapters.map((chapter) => ({ id: chapter.id, title: chapter.title })),
      }))}
    />
  );
}
