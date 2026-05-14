import ProductLandingShell from "@/components/ProductLandingShell";

const KAVERI_LEVELS = [
  {
    id: "level-1",
    name: "1. Kannada Foundations",
    tagline: "Letters, sounds, and first reading confidence.",
    accent: "#f97316",
    meta: "Primary learners",
    lessons: [
      { id: "KA_L1_1", title: "Akshara recognition" },
      { id: "KA_L1_2", title: "Vyanjana and swara flow" },
      { id: "KA_L1_3", title: "Tracing and speaking practice" },
    ],
  },
  {
    id: "level-2",
    name: "2. Guided Reading",
    tagline: "Short words, picture prompts, and parent support.",
    accent: "#10b981",
    meta: "Home practice ready",
    lessons: [
      { id: "KA_L2_1", title: "Simple reading blocks" },
      { id: "KA_L2_2", title: "Audio-guided pronunciation" },
      { id: "KA_L2_3", title: "Worksheet reinforcement" },
    ],
  },
];

export default function KaveriLandingPage() {
  return (
    <ProductLandingShell
      eyebrow="Kaveri"
      title="Kannada learning now has a working public entrypoint too."
      subtitle="The dedicated Kaveri tutor app exists in this repo, but it is not yet wired into the production gateway. This route restores a stable product page on the main domain so visitors stop hitting a 404."
      accent="#f97316"
      primaryHref="/auth/register?next=%2Fkaveri"
      primaryLabel="Join Kaveri"
      secondaryHref="/auth/login?next=%2Fkaveri"
      secondaryLabel="Login"
      stats={[
        { label: "Route Status", value: "Restored" },
        { label: "Tutor App", value: "Present" },
        { label: "Gateway Wiring", value: "Pending" },
      ]}
      levels={KAVERI_LEVELS}
    />
  );
}
