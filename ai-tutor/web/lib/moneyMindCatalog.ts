// ─────────────────────────────────────────────────────────────────────────────
// Money Mind — Level-Based Financial Literacy Catalog
// ─────────────────────────────────────────────────────────────────────────────

export type MoneyMindLesson = {
  id: string;           
  title: string;
  category: "Saving" | "Investing" | "Macro" | "Budgeting" | "Biz" | "Safety";
  skill: string;
  durationMin: number;
  freePreview: boolean;
};

export type MoneyMindLevel = {
  id: string;           
  order: number;
  name: string;
  tagline: string;
  emoji: string;
  color: string;
  ageEquiv: string;   
  gradeEquiv: string;
  xpToUnlock: number;
  xpOnComplete: number;
  lessons: MoneyMindLesson[];
};

export const MONEYMIND_LEVELS: MoneyMindLevel[] = [
  {
    id: "L1", order: 1, name: "My First Money World",
    tagline: "Understand the value of the Rupee and master needs vs wants.",
    emoji: "💵", color: "#10B981", ageEquiv: "Age 8-10", gradeEquiv: "Grade 4-5",
    xpToUnlock: 0, xpOnComplete: 200,
    lessons: [
      { id: "MM_L1_1", title: "What is Money?", category: "Macro", skill: "Origins of the Rupee and currency basics", durationMin: 15, freePreview: true },
      { id: "MM_L1_2", title: "Needs vs Wants", category: "Budgeting", skill: "Make smart choices in a shopping list", durationMin: 15, freePreview: true },
      { id: "MM_L1_3", title: "Saving for a Goal", category: "Saving", skill: "Plan and track a goal for a cricket bat", durationMin: 15, freePreview: true },
      { id: "MM_L1_4", title: "The Pocket Money Manager", category: "Budgeting", skill: "Simple weekly budgeting", durationMin: 20, freePreview: false },
    ],
  },
  {
    id: "L2", order: 2, name: "Bank & ATM Explorer",
    tagline: "Step inside a bank and learn to use an ATM safely.",
    emoji: "🏦", color: "#3B82F6", ageEquiv: "Age 10-12", gradeEquiv: "Grade 5-6",
    xpToUnlock: 200, xpOnComplete: 300,
    lessons: [
      { id: "MM_L2_1", title: "What is a Bank?", category: "Saving", skill: "The role of banks and vault security", durationMin: 20, freePreview: true },
      { id: "MM_L2_2", title: "The ATM Mission", category: "Safety", skill: "Withdraw cash safely using a PIN", durationMin: 25, freePreview: false },
      { id: "MM_L2_3", title: "Deposit & Passbook", category: "Saving", skill: "Tracking money in a digital passbook", durationMin: 20, freePreview: false },
      { id: "MM_L2_4", title: "Checking vs Savings", category: "Saving", skill: "Differentiate bank account types", durationMin: 20, freePreview: false },
    ],
  },
  {
    id: "L3", order: 3, name: "Digital Money & Safety Lab",
    tagline: "Master UPI, QR codes, and protect yourself from scams.",
    emoji: "📱", color: "#6366F1", ageEquiv: "Age 11-13", gradeEquiv: "Grade 6-7",
    xpToUnlock: 500, xpOnComplete: 400,
    lessons: [
      { id: "MM_L3_1", title: "Going Digital: UPI", category: "Macro", skill: "How instant payments work via UPI", durationMin: 20, freePreview: true },
      { id: "MM_L3_2", title: "Scanner Pro", category: "Safety", skill: "Scanning QR codes & verifying merchants", durationMin: 25, freePreview: false },
      { id: "MM_L3_3", title: "The OTP Shield", category: "Safety", skill: "Identify and block scam messages", durationMin: 20, freePreview: false },
      { id: "MM_L3_4", title: "Shopping Online Safely", category: "Safety", skill: "Recognizing secure sites vs traps", durationMin: 25, freePreview: false },
    ],
  },
  {
    id: "L4", order: 4, name: "Smart Spending & Budgeting",
    tagline: "Plan festivals, parties, and family groceries like a pro.",
    emoji: "🛒", color: "#F59E0B", ageEquiv: "Age 12-14", gradeEquiv: "Grade 7-8",
    xpToUnlock: 900, xpOnComplete: 500,
    lessons: [
      { id: "MM_L4_1", title: "The Birthday Challenge", category: "Budgeting", skill: "Planning a party on a fixed budget", durationMin: 30, freePreview: true },
      { id: "MM_L4_2", title: "Smart Shopper", category: "Budgeting", skill: "Comparing prices online vs offline", durationMin: 30, freePreview: false },
      { id: "MM_L4_3", title: "Subscription Traps", category: "Budgeting", skill: "Managing game passes and app fees", durationMin: 25, freePreview: false },
      { id: "MM_L4_4", title: "Family Grocery Planner", category: "Budgeting", skill: "Optimizing the household budget", durationMin: 30, freePreview: false },
    ],
  },
  {
    id: "L5", order: 5, name: "Grow, Protect & Decide",
    tagline: "Understand investing, inflation, and why risk matters.",
    emoji: "🌱", color: "#8B5CF6", ageEquiv: "Age 13-16", gradeEquiv: "Grade 8-10",
    xpToUnlock: 1400, xpOnComplete: 600,
    lessons: [
      { id: "MM_L5_1", title: "Idle vs Active Money", category: "Investing", skill: "The concept of interest and growth", durationMin: 30, freePreview: true },
      { id: "MM_L5_2", title: "The Inflation Monster", category: "Macro", skill: "Why things get more expensive over time", durationMin: 35, freePreview: false },
      { id: "MM_L5_3", title: "Market Garden", category: "Investing", skill: "FD, Stocks, and Gold basics", durationMin: 40, freePreview: false },
      { id: "MM_L5_4", title: "Protection First", category: "Safety", skill: "Basics of Insurance and emergency funds", durationMin: 35, freePreview: false },
    ],
  },
  {
    id: "L6", order: 6, name: "Real-World Readiness",
    tagline: "Salary slips, credit scores, and planning for adulthood.",
    emoji: "🚀", color: "#F43F5E", ageEquiv: "Age 15-18", gradeEquiv: "Grade 10-12",
    xpToUnlock: 2000, xpOnComplete: 700,
    lessons: [
      { id: "MM_L6_1", title: "My First Salary", category: "Biz", skill: "Reading a salary slip and taxes", durationMin: 40, freePreview: true },
      { id: "MM_L6_2", title: "The Debt Trap", category: "Budgeting", skill: "EMI, Interest rates, and Credit Cards", durationMin: 40, freePreview: false },
      { id: "MM_L6_3", title: "Credit Score 101", category: "Safety", skill: "Building a healthy financial reputation", durationMin: 35, freePreview: false },
      { id: "MM_L6_4", title: "Planning for College", category: "Saving", skill: "Managing education loans and fees", durationMin: 45, freePreview: false },
    ],
  },
];

export function getMoneyMindLevel(levelId: string): MoneyMindLevel | undefined {
  return MONEYMIND_LEVELS.find((l) => l.id === levelId);
}

