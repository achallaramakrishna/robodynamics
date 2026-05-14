export interface Product {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  href: string;
  description: string;
  audience: string;
  showOnHomepage: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "mindsutra",
    name: "Vedika",
    subtitle: "Vedic Math AI Tutor",
    icon: "🧮",
    color: "#F97316",
    href: "/mindsutra",
    description: "Master speed math with guided Vedic techniques, practice flows, and adaptive coaching.",
    audience: "Classes 4-8",
    showOnHomepage: true,
  },
  {
    id: "mindsparc",
    name: "Yukti",
    subtitle: "Aptitude & Reasoning",
    icon: "🧠",
    color: "#10B981",
    href: "/mindsparc",
    description: "Build pattern recognition, logic, deduction, and problem-solving confidence.",
    audience: "Classes 5-10",
    showOnHomepage: true,
  },
  {
    id: "moneymind",
    name: "Artha",
    subtitle: "Financial Literacy",
    icon: "📈",
    color: "#F59E0B",
    href: "/moneymind",
    description: "Learn saving, budgeting, investing, and money safety through guided scenarios.",
    audience: "Classes 6-10",
    showOnHomepage: true,
  },
  {
    id: "neet",
    name: "NEET ExamPrep",
    subtitle: "Medical AI Tutor",
    icon: "🧬",
    color: "#0EA5E9",
    href: "/ai-tutor/neet/session",
    description: "Prepare for medical entrance topics with structured AI-led chapter sessions.",
    audience: "Classes 11-12",
    showOnHomepage: true,
  },
  {
    id: "vidya",
    name: "Vidya",
    subtitle: "Logic Building with Python",
    icon: "💻",
    color: "#16A34A",
    href: "/vidya/level-1",
    description: "Build computational thinking, programming logic, and problem-solving skills through hands-on Python play and interactive challenges.",
    audience: "Classes 6-12",
    showOnHomepage: true,
  },
  {
    id: "hindiguru",
    name: "HindiSutra",
    subtitle: "Hindi Language Tutor",
    icon: "📚",
    color: "#EC4899",
    href: "/hindiguru/course/grade-12-core",
    description: "Support Hindi language and literature learning with guided reading and explanations.",
    audience: "Senior school learners",
    showOnHomepage: true,
  },
  {
    id: "vaani",
    name: "Vaani",
    subtitle: "Hindi Foundational Literacy",
    icon: "🪔",
    color: "#F97316",
    href: "/vaani/level-1",
    description: "Build Hindi reading confidence with tracing, audio, letter formation, and guided literacy practice.",
    audience: "Primary learners",
    showOnHomepage: true,
  },
  {
    id: "kaveri",
    name: "Kaveri",
    subtitle: "Kannada Early Learning",
    icon: "🌿",
    color: "#14B8A6",
    href: "/kaveri",
    description: "Grow Kannada reading confidence through guided practice and family-friendly learning flows.",
    audience: "Primary learners",
    showOnHomepage: true,
  },
];

export const HOMEPAGE_PRODUCTS = PRODUCTS.filter((product) => product.showOnHomepage);

export function normalizeProductId(value?: string | null) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "python-ai" || normalized === "python" || normalized === "codesutra" || normalized === "vidya") return "vidya";
  if (normalized === "mindspark" || normalized === "mindsparc") return "mindsparc";
  if (normalized === "hindi" || normalized === "hindi-guru" || normalized === "hindiguru") return "hindiguru";
  if (normalized === "medical" || normalized === "exam-prep" || normalized === "neet") return "neet";
  if (normalized === "money-mind" || normalized === "moneymind") return "moneymind";
  if (normalized === "vedic-math" || normalized === "mindsutra") return "mindsutra";
  if (normalized === "vaani") return "vaani";
  if (normalized === "kaveri") return "kaveri";
  return normalized;
}

export function getProductById(value?: string | null) {
  const normalized = normalizeProductId(value);
  return PRODUCTS.find((product) => product.id === normalized) ?? null;
}

export const isPaymentEnabled = () => process.env.NEXT_PUBLIC_PAYMENT_ENABLED === "true";
