export interface Product {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  href: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "mindsutra",
    name: "MindSutra",
    subtitle: "Vedic Math AI Tutor",
    icon: "🧮",
    color: "#F97316",
    href: "/mindsutra",
    description: "Master speed math with the world's most advanced Vedic AI Tutor.",
  },
  {
    id: "mindsparc",
    name: "MindSparc",
    subtitle: "Aptitude & Reasoning",
    icon: "🧠",
    color: "#10B981",
    href: "/mindsparc",
    description: "Build logic, pattern recognition and reasoning skills.",
  },
  {
    id: "moneymind",
    name: "Money Mind",
    subtitle: "Financial Literacy",
    icon: "📈",
    color: "#F59E0B",
    href: "/moneymind",
    description: "Learn investing and fiscal responsibility through simulations.",
  },
  {
    id: "neet",
    name: "NEET ExamPrep",
    subtitle: "Medical AI Tutor",
    icon: "🧬",
    color: "#0EA5E9",
    href: "/neet",
    description: "Specialized AI tutor for Indian Medical entrance exams.",
  },
  {
    id: "robotics",
    name: "Robotics AI",
    subtitle: "Hardware & Code",
    icon: "🦾",
    color: "#6366F1",
    href: "/robotics",
    description: "Bridge code and physical machines with virtual sims.",
  },
  {
    id: "codesutra",
    name: "Python CodeSutra",
    subtitle: "Python AI Tutor",
    icon: "🐍",
    color: "#22c55e",
    href: "/python-ai",
    description: "Learn Python from scratch with an AI tutor that codes alongside you.",
  },
];

export const isPaymentEnabled = () => process.env.NEXT_PUBLIC_PAYMENT_ENABLED === "true";
