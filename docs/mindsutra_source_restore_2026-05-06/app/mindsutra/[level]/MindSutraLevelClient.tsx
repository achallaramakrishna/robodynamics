"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MindSutraAvatar from "../course/[level]/lesson/[lessonId]/MindSutraAvatar";

// This file is the client component — imported by the server page.tsx.

/* ─── Level metadata ──────────────────────────────────────────────────────── */
const LEVEL_DATA: Record<string, {
  num: number;
  name: string;
  headline: string;
  parentWhy: string;
  outcome: string;
  demoChapter: string;
  chapters: { title: string; duration: string; goals: string[]; demoCode?: string; freePreview?: boolean }[];
  hintLink: string;
}> = {
  "level-1": {
    num: 1,
    name: "Foundation",
    headline: "Your Child Will Add 999 + 1 Instantly — and Know Exactly Why",
    parentWhy: "Building a strong foundation in numbers is critical. By replacing standard carry-over methods with Vedic complements and basic patterns, your child builds deep number sense first. This prevents the typical 'math wall' children hit around algebra.",
    outcome: "After completing Level 1, your child can: mentally subtract using complements, multiply by 11–19 by pattern, do 2-digit criss-cross multiplication, and understand the logic behind borrow-free subtraction.",
    demoChapter: "VM_L1_1",
    hintLink: "Ideal starting point for Grades 4-5 or anyone new to Vedic Math.",
    chapters: [
      { title: "Fast Addition — Puraṇapūraṇābhyam", duration: "20 min", demoCode: "VM_G4_L1_FAST_ADDITION", goals: ["Find complements to 10, 100, 1000 instantly"], freePreview: true },
      { title: "Tables 11–19 by Pattern", duration: "20 min", demoCode: "VM_G4_L2_TABLES_11_TO_19", goals: ["Derive tables without memorizing"], freePreview: true },
      { title: "Doubling & Halving — Anurupyeṇa", duration: "20 min", goals: ["Mentally double/halve numbers in 3 seconds"] },
      { title: "Multiply by 11 — Middle-Sum Trick", duration: "20 min", goals: ["Multiply by 11 with the visual split trick"] },
      { title: "Borrow-Free Subtraction", duration: "25 min", goals: ["Use Nikhilam for subtraction near bases"] },
      { title: "Multiply by 5 and 25", duration: "20 min", goals: ["Use factor shortcuts to multiply instantly"] },
      { title: "Near-100 Mental Math", duration: "25 min", goals: ["Introduce base multiplication logic"] },
      { title: "Criss-Cross 2-Digit Multiplication", duration: "30 min", goals: ["Mental 2x2 multiplication"] },
    ],
  },
  "level-2": {
    num: 2,
    name: "Speed Builder",
    headline: "Your Child Will Multiply 97 × 103 in 5 Seconds — No Calculator",
    parentWhy: "As school math gets harder, children who rely on column-by-column methods make careless errors. Vedic Maths provides clean visual methods like Nikhilam to solve these faster and cleaner.",
    outcome: "After this level, your child can: multiply numbers near 100, square numbers near 50, do HCF/LCM in their head, and divide using the flag method.",
    demoChapter: "VM_G5_L1_NIKHILAM_NEAR100",
    hintLink: "Ideal for Grades 5-6 with a grasp of basic speed math.",
    chapters: [
      { title: "Near-100 Multiplication — Nikhilam", duration: "25 min", demoCode: "VM_G5_L1_NIKHILAM_NEAR100", goals: ["Multiply any two numbers near 100"], freePreview: true },
      { title: "Squares Near 50 — Yāvadūnam", duration: "25 min", goals: ["Square numbers physically near 50"] },
      { title: "HCF & LCM Shortcuts", duration: "25 min", goals: ["Avoid prime factor trees with shortcuts"] },
      { title: "3-Digit Criss-Cross", duration: "35 min", goals: ["Reach 3x3 multiplication using Urdhva-Tiryak"] },
      { title: "Flag Division — Dhvajāṅka", duration: "30 min", goals: ["Eliminate long division for simple cases"] },
      { title: "Decimal Point Mastery", duration: "20 min", goals: ["Handle shifting decimals cleanly"] },
      { title: "Fraction Simplification", duration: "25 min", goals: ["Simplify without LCM struggle"] },
      { title: "Running Remainder Division", duration: "25 min", goals: ["Quickly find run-over remainders"] },
    ],
  },
  "level-3": {
    num: 3,
    name: "Power Level",
    headline: "Your Child Will Solve 998 × 997 Mentally in One Breath",
    parentWhy: "Algebra integration happens here. We reframe hard algebraic topics as visual puzzles, turning frustration into confidence.",
    outcome: "Your child will solve simultaneous and linear equations by inspection, scale the Nikhilam method to any base, and start recognizing deep algebraic patterns.",
    demoChapter: "VM_G6_L1_NIKHILAM_NEAR1000",
    hintLink: "Ideal for Grades 6-7 ready for integer operations.",
    chapters: [
      { title: "Nikhilam with Any Base", duration: "30 min", demoCode: "VM_G6_L1_NIKHILAM_NEAR1000", goals: ["Handle 1000s and 10000s multiplication"], freePreview: true },
      { title: "Paravartya Division", duration: "30 min", goals: ["Apply synthetic division to simple polynomials"] },
      { title: "Linear Equations — Vedic Style", duration: "30 min", goals: ["Solve without cross-multiplying"] },
      { title: "Squares Ending in 5", duration: "20 min", goals: ["Instant visualization of squares"] },
      { title: "Integer Operations Speed", duration: "25 min", goals: ["Handle negative numbers flawlessly"] },
      { title: "Ratio & Proportion Shortcuts", duration: "25 min", goals: ["Solve word problems by ratio splits"] },
      { title: "Vinculum Numbers", duration: "25 min", goals: ["Convert numbers to negative digits for easier math"] },
      { title: "Algebraic Identities — Ūrdhva-Tiryagbhyām", duration: "30 min", goals: ["Visually map algebraic identities"] },
    ],
  },
  "level-4": {
    num: 4,
    name: "Ace Level",
    headline: "Your Child Will Find Cube Roots of 6-Digit Numbers by Inspection",
    parentWhy: "Perfect for students preparing for competitive exams or high school. The shortcuts here give them an unfair advantage in standardized testing.",
    outcome: "Your child will instantly calculate square and cube roots, handle percents and profits instantly, and multiply fractions effortlessly.",
    demoChapter: "VM_G7_L1_NIKHILAM_NEAR10000",
    hintLink: "Ideal for Grades 7-8 testing out complex properties.",
    chapters: [
      { title: "Squares & Cubes — Ānurūpyena", duration: "30 min", demoCode: "VM_G7_L1_NIKHILAM_NEAR10000", goals: ["Master large exponent logic"], freePreview: true },
      { title: "Near-1000 Multiplication", duration: "30 min", goals: ["Tackle large base numbers"] },
      { title: "Simultaneous Equations — Paravartya", duration: "35 min", goals: ["Solve 2-variable systems by inspection"] },
      { title: "Fraction Operations at Speed", duration: "25 min", goals: ["Add/sub fractions without LCM"] },
      { title: "Square Roots of Perfect Squares", duration: "25 min", goals: ["Use last-digit groupings"] },
      { title: "Percentage Vedic Shortcut", duration: "25 min", goals: ["Scale 1%, 5%, 10% blocks"] },
      { title: "Indices & Surds Speed", duration: "30 min", goals: ["Handle exponents visually"] },
      { title: "Profit, Loss & Interest in Seconds", duration: "25 min", goals: ["Apply block percentages to finance"] },
    ],
  },
  "level-5": {
    num: 5,
    name: "Champion",
    headline: "Your Child Will Crack Math Olympiad Problems Others Skip",
    parentWhy: "The final tier. Olympiad, CAT, and JEE foundation. We cover topics that are traditionally taught via brute-force memorization and turn them into elegant one-line solutions.",
    outcome: "Your child will factorize quadratics, handle trigonometry shortcuts, operate complex fraction chains, and tackle pure number theory problems.",
    demoChapter: "VM_G8_L1_LARGE_NIKHILAM",
    hintLink: "Ideal for high schoolers / competition attendees.",
    chapters: [
      { title: "Calendars & Time — Ekadhikena", duration: "25 min", demoCode: "VM_G8_L1_LARGE_NIKHILAM", goals: ["Find the day of the week for any date"], freePreview: true },
      { title: "Vedic Number Theory", duration: "30 min", goals: ["Divisibility by rare primes"] },
      { title: "Quadratic Equations — Paravartya", duration: "35 min", goals: ["Factorize trinomials by inspection"] },
      { title: "Trigonometry Shortcuts", duration: "30 min", goals: ["Find identity values cleanly"] },
      { title: "Advanced Fraction Chains", duration: "25 min", goals: ["Collapse messy continued fractions"] },
      { title: "Competitive Exam Sprint", duration: "30 min", goals: ["Identify the best sutra under pressure"] },
      { title: "Olympiad Number Patterns", duration: "35 min", goals: ["Spot recurring sequences"] },
      { title: "Championship Practice", duration: "40 min", goals: ["Final 60-question speed run"] },
    ],
  },
};

const LEVELS = ["level-1", "level-2", "level-3", "level-4", "level-5"] as const;

const TESTIMONIALS = [
  {
    quote: "She flew through the Level 1 placement and finished Level 2 in 3 weeks. Her maths teacher asked what changed.",
    parent: "Sunita R.", city: "Bangalore", childLevel: "Level 1-2", improvement: "Placed instantly",
  },
  {
    quote: "My son used to take 40 minutes for his maths homework. Now it's done in 15. The animated board is beautiful.",
    parent: "Rajesh M.", city: "Hyderabad", childLevel: "Level 3", improvement: "40 min → 15 min",
  },
  {
    quote: "The parent dashboard is the best feature. I can see exactly where Aarav gets stuck — he struggles with carries in criss-cross — and the tutor fixes it.",
    parent: "Anita K.", city: "Chennai", childLevel: "Level 4", improvement: "Parent visibility",
  },
  {
    quote: "I was sceptical — we've tried 3 apps before. But this AI coach actually explains WHY. My daughter says 'it's like having a teacher who never gets annoyed.'",
    parent: "Praveena S.", city: "Pune", childLevel: "Level 1", improvement: "3 apps tried before",
  },
];

const FAQ = [
  { q: "Is it safe for my child to use alone?", a: "Yes. MindSutra is designed for independent use by children aged 9–14. There are no social features, no chat with strangers, and no ads. Parents get full visibility via the dashboard." },
  { q: "Which devices does it work on?", a: "Any device with a web browser — phone, tablet, or laptop. No app download needed. Works best on Chrome or Safari with a screen width of 360px or more." },
  { q: "Will this help in school exams?", a: "Directly. Each level maps generally to corresponding NCERT milestones. The Vedic methods are faster alternatives to the standard algorithms — your child still writes standard working in exams, but gets the answer faster." },
  { q: "What if my child doesn't like it?", a: "We offer a full refund within 30 days — no questions asked. Try the free demo first!" },
  { q: "How is this different from YouTube videos or BYJU's?", a: "YouTube and recorded video platforms show your child content — they can't respond to a wrong answer. MindSutra is interactive: the AI tutor notices when your child gets stuck, re-explains in a different way, and adapts the next question." },
  { q: "Do I have to pay again next year?", a: "No. MindSutra uses lifetime access — you pay once and your child can use the level forever. No subscription, no renewal." },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function MindSutraLevelClient() {
  const params = useParams();
  const router = useRouter();
  const levelSlug = (params?.level as string) ?? "level-1";
  const data = LEVEL_DATA[levelSlug] ?? LEVEL_DATA["level-1"];
  const [openChapter, setOpenChapter] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);

  const levelNum = data.num;
  const gradeNum = levelNum + 3; // Level 1 is Grade 4, Level 2 is Grade 5, etc.

  useEffect(() => {
    // Check if the user is enrolled in this level
    fetch("/api/student/home")
      .then(res => res.json())
      .then(homeData => {
        if (homeData && homeData.enrollments) {
          const enrollment = homeData.enrollments.find((e: any) => e.grade === gradeNum && e.productSlug === "mindsutra");
          if (enrollment) {
            setIsEnrolled(true);
          }
        }
        setLoadingEnrollment(false);
      })
      .catch(() => setLoadingEnrollment(false));
  }, [gradeNum]);
  const demoUrl = `/ai-tutor/demo?product=mindsutra&level=${levelNum}&fresh=1`;
  const checkoutUrl = `/checkout/level-${levelNum}`;
  const whatsappText = encodeURIComponent(`Check out this Vedic Maths AI Tutor for Level ${levelNum} — Try the free demo: https://robodynamics.in/mindsutra/level-${levelNum}`);
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  const S = {
    topBar: { position: "sticky" as const, top: 0, zIndex: 100, background: "#060D17", borderBottom: "1px solid #0F2040", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    logo: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
    loginLink: { color: "#CBD5E1", fontSize: 13, textDecoration: "none", padding: "6px 14px", border: "1px solid #1E3A5F", borderRadius: 8, background: "#0D1B2A" },
    hero: { background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0F172A 100%)", padding: "80px 20px 60px", textAlign: "center" as const },
    heroEyebrow: { color: "#8B5CF6", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 12 },
    heroH1: { color: "#F1F5F9", fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.25, maxWidth: 720, margin: "0 auto 20px" },
    heroSub: { color: "#94A3B8", fontSize: 16, maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.6 },
    ctaRow: { display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 40 },
    ctaPrimary: { background: "linear-gradient(90deg, #6366F1, #8B5CF6)", color: "#FFFFFF", fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 10, border: "none", cursor: "pointer", textDecoration: "none", display: "inline-block", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" },
    ctaSecondary: { background: "rgba(255,255,255,0.05)", color: "#E2E8F0", fontWeight: 600, fontSize: 15, padding: "12px 28px", borderRadius: 10, border: "2px solid #334155", cursor: "pointer", textDecoration: "none", display: "inline-block" },
    proofRow: { display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" as const },
    proofItem: { color: "#64748B", fontSize: 13 },
    levelPills: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" as const, marginTop: 40 },
    levelPill: (active: boolean) => ({ padding: "8px 20px", borderRadius: 24, fontSize: 14, fontWeight: 600, cursor: "pointer", border: active ? "1px solid #8B5CF6" : "1px solid transparent", background: active ? "rgba(139,92,246,0.15)" : "#0D1B2A", color: active ? "#A78BFA" : "#64748B" }),
    section: { padding: "64px 20px", maxWidth: 840, margin: "0 auto" },
    sectionTitle: { fontSize: 26, fontWeight: 800, color: "#0F172A", marginBottom: 10 },
    sectionSub: { color: "#64748B", fontSize: 16, marginBottom: 32, lineHeight: 1.6 },
    // Parent-why box
    whyBox: { background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 16, padding: "24px 28px", marginBottom: 32 },
    whyTitle: { fontWeight: 800, color: "#3730A3", fontSize: 15, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 },
    whyText: { color: "#312E81", fontSize: 15, lineHeight: 1.7 },
    // Tutor preview mockup
    previewBox: { background: "#060D17", borderRadius: 20, padding: "32px 24px", margin: "0 auto 48px", maxWidth: 680, textAlign: "center" as const, border: "1px solid #1E3A5F" },
    previewInner: { background: "#0D1B2A", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" as const, gap: 20, border: "1px solid #1E3A5F" },
    boardRow: { background: "#060D17", borderRadius: 12, padding: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: 28, border: "1px solid #1E3A5F" },
    boardNum: { color: "#38BDF8", fontSize: 32, fontWeight: 800, fontFamily: "monospace" },
    boardAnswer: { color: "#34D399", fontSize: 32, fontWeight: 800, fontFamily: "monospace" },
    boardArrow: { color: "#64748B", fontSize: 24 },
    avatarRow: { display: "flex", gap: 14, alignItems: "flex-start" },
    avatarBubble: { background: "linear-gradient(135deg, #1E1B4B, #312E81)", borderRadius: "0 14px 14px 14px", padding: "14px 18px", flex: 1, color: "#C7D2FE", fontSize: 14, lineHeight: 1.6, textAlign: "left" as const, border: "1px solid #4338CA" },
    progressMini: { display: "flex", gap: 6, justifyContent: "center" },
    progressDot: (filled: boolean) => ({ width: 8, height: 8, borderRadius: "50%", background: filled ? "#34D399" : "#334155" }),
    // Session timeline
    timelineRow: { display: "flex", gap: 0, overflowX: "auto" as const, marginBottom: 10, borderRadius: 12, overflow: "hidden" },
    timelineStep: (color: string) => ({ flex: 1, background: color, padding: "16px 10px", textAlign: "center" as const, minWidth: 90 }),
    timelineLabel: { fontSize: 11, fontWeight: 800, color: "#FFFFFF", textTransform: "uppercase" as const, letterSpacing: 0.5 },
    timelineMin: { fontSize: 20, fontWeight: 800, color: "#FFFFFF", margin: "4px 0" },
    timelineDesc: { fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.3 },
    // Parent dashboard preview
    dashPreview: { background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 16, padding: 24, marginBottom: 12 },
    dashTitle: { fontWeight: 800, fontSize: 15, color: "#1E293B", marginBottom: 16 },
    dashGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 20 },
    dashCard: (color: string) => ({ background: "#FFFFFF", borderLeft: `4px solid ${color}`, borderRadius: 10, padding: "12px 16px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }),
    dashVal: { fontWeight: 800, fontSize: 22, color: "#0F172A" },
    dashLbl: { fontSize: 12, color: "#64748B", marginTop: 4 },
    heatRow: { display: "flex", gap: 4, marginBottom: 8, overflowX: "auto" as const },
    heatCell: (intensity: number) => ({ width: 16, height: 16, borderRadius: 4, background: intensity === 0 ? "#F1F5F9" : intensity < 15 ? "#C7D2FE" : intensity < 30 ? "#818CF8" : "#4F46E5", flexShrink: 0 }),
    // Outcome box
    outcomeBox: { background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 16, padding: "24px 28px", marginBottom: 32 },
    outcomeTitle: { fontWeight: 800, color: "#14532D", fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
    outcomeText: { color: "#166534", fontSize: 15, lineHeight: 1.7 },
    // Curriculum
    chapterItem: (isFirst: boolean, hasDemo: boolean) => ({ border: `${isFirst ? "2px solid #8B5CF6" : hasDemo ? "1px solid #C7D2FE" : "1px solid #E2E8F0"}`, borderRadius: 12, marginBottom: 10, overflow: "hidden", background: "#FFFFFF" }),
    chapterHeader: (isFirst: boolean) => ({ display: "flex", alignItems: "center", gap: 12, padding: "16px", cursor: "pointer", background: isFirst ? "#F5F3FF" : "#FFFFFF" }),
    chapterNum: { background: "#EEF2FF", color: "#6366F1", fontWeight: 800, fontSize: 13, borderRadius: 8, padding: "6px 10px", minWidth: 32, textAlign: "center" as const, flexShrink: 0 },
    chapterTitle: { flex: 1, fontWeight: 700, color: "#0F172A", fontSize: 15, lineHeight: 1.3 },
    freeBadge: { background: "#DCFCE7", color: "#16A34A", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, flexShrink: 0, textTransform: "uppercase" as const, letterSpacing: 0.5 },
    previewBadge: { background: "#EEF2FF", color: "#4F46E5", fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 6, flexShrink: 0 },
    proBadge: { background: "#FEF3C7", color: "#B45309", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, flexShrink: 0, textTransform: "uppercase" as const, letterSpacing: 0.5 },
    lockBadge: { color: "#CBD5E1", fontSize: 16, flexShrink: 0 },
    metaBadge: { color: "#94A3B8", fontSize: 12, flexShrink: 0 },
    goalsBox: { padding: "8px 16px 20px 60px" },
    goalItem: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8, fontSize: 14, color: "#334155", lineHeight: 1.4 },
    // Testimonials
    testimonialGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
    testimonialCard: { background: "#FFFFFF", borderRadius: 16, padding: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0" },
    improvBadge: { background: "#DCFCE7", color: "#16A34A", fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 6, display: "inline-block", marginBottom: 12 },
    quote: { color: "#334155", fontSize: 15, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" },
    parentName: { fontWeight: 800, color: "#0F172A", fontSize: 14 },
    parentMeta: { color: "#64748B", fontSize: 13 },
    // Pricing value
    valueBox: { background: "#060D17", borderRadius: 20, padding: "40px 32px", textAlign: "center" as const, marginBottom: 0, border: "1px solid #1E3A5F" },
    valueTitle: { color: "#F1F5F9", fontWeight: 800, fontSize: 24, marginBottom: 24 },
    compareRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 },
    compareCard: (highlight: boolean) => ({ background: highlight ? "linear-gradient(135deg, #4F46E5, #7C3AED)" : "#0D1B2A", border: highlight ? "none" : "1px solid #1E3A5F", borderRadius: 16, padding: 24 }),
    comparePrice: { fontWeight: 800, fontSize: 32, color: "#FFFFFF" },
    compareLabel: { color: "rgba(255,255,255,0.9)", fontSize: 14, marginTop: 8, fontWeight: 600 },
    compareNote: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 8, lineHeight: 1.5 },
    // FAQ
    faqItem: { border: "1px solid #E2E8F0", borderRadius: 12, marginBottom: 10, overflow: "hidden", background: "#FFFFFF" },
    faqQ: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer" },
    faqQText: { fontWeight: 700, color: "#0F172A", fontSize: 15, flex: 1 },
    faqChevron: (open: boolean) => ({ color: "#64748B", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 14 }),
    faqA: { padding: "0 20px 20px", color: "#475569", fontSize: 14, lineHeight: 1.7 },
    // Sticky bottom
    stickyBottom: { position: "fixed" as const, bottom: 0, left: 0, right: 0, zIndex: 100, background: "#060D17", borderTop: "1px solid #1E3A5F", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 -4px 20px rgba(0,0,0,0.5)", gap: 12 },
    stickyLeft: { display: "flex", flexDirection: "column" as const },
    stickyPrice: { color: "#FFFFFF", fontSize: 18, fontWeight: 800 },
    stickyOld: { color: "#64748B", textDecoration: "line-through", fontSize: 13 },
    stickyBtns: { display: "flex", gap: 12, alignItems: "center" },
    enrollBtn: { background: "linear-gradient(90deg, #6366F1, #8B5CF6)", color: "#FFFFFF", fontWeight: 700, fontSize: 15, padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap" as const },
    waBtn: { background: "#10B981", color: "#FFFFFF", fontWeight: 700, fontSize: 14, padding: "12px 16px", borderRadius: 10, border: "none", cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap" as const },
    footer: { background: "#060D17", padding: "40px 24px", marginBottom: 76, borderTop: "1px solid #0F2040" },
    footerLinks: { display: "flex", gap: 24, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 20 },
    footerLink: { color: "#64748B", fontSize: 14, textDecoration: "none", fontWeight: 500 },
    footerCopy: { textAlign: "center" as const, color: "#475569", fontSize: 13 },
  };

  const heatmap = [0,0,20,30,15,0,0, 25,40,15,0,30,20,0, 10,0,25,35,15,0,0, 20,30,0,15,25,0,0];

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>

      {/* ── Top bar ── */}
      <nav style={S.topBar}>
        <a href="/mindsutra" style={S.logo}>
          <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 28, objectFit: "contain" }} />
          <span style={{ color: "#818CF8", fontWeight: 800, fontSize: 18 }}>MindSutra</span>
        </a>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ color: "#10B981", fontSize: 22, textDecoration: "none" }} title="Share on WhatsApp">📱</a>
          <a href="https://robodynamics.in/login" style={S.loginLink}>Course LMS Login</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={S.hero}>
        <p style={S.heroEyebrow}>MindSutra Level {levelNum} · Advanced Vedic Mathematics · AI Tutor</p>
        <h1 style={S.heroH1}>{data.headline}</h1>
        <p style={S.heroSub}>An AI-powered tutor built for mastery. 8 immersive chapters, real-time adaptation, and a proactive parent dashboard.</p>
        <div style={S.ctaRow}>
          <a href={demoUrl} style={S.ctaPrimary}>🚀 Start First Free Lesson</a>
          <a href="#curriculum" style={S.ctaSecondary}>Explore 2 Free Sessions ↓</a>
        </div>
        <div style={S.proofRow}>
          <span style={S.proofItem}>⭐ 4.9 Average Rating</span>
          <span style={S.proofItem}>👥 10K+ Enrolled</span>
          <span style={S.proofItem}>📘 8 Complete Chapters</span>
          <span style={S.proofItem}>🛡️ 30-Day Happiness Guarantee</span>
        </div>
        <div style={S.levelPills}>
          {LEVELS.map(l => (
            <button key={l} style={S.levelPill(l === levelSlug)} onClick={() => router.push(`/mindsutra/${l}`)}>
              {l.replace("level-", "Level ")}
            </button>
          ))}
        </div>
      </section>

      {/* ── Specialized Graduation Banner ── */}
      <section style={{ ...S.section, paddingBottom: 0, paddingTop: 32 }}>
         <div style={{ background: "linear-gradient(90deg, #4F46E5, #7C3AED)", borderRadius: 24, padding: "32px", color: "white", boxShadow: "0 20px 40px rgba(124, 58, 237, 0.2)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: 0.1, transform: "rotate(15deg)" }}>🏆</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
              {isEnrolled ? "Welcome Back, Champion! 🚀" : "Congratulations, Bangalore Math Champion! 🥇"}
            </h3>
            <p style={{ opacity: 0.9, lineHeight: 1.6, maxWidth: 600, fontSize: 15 }}>
              {isEnrolled 
                ? "Your journey to math mastery is in full swing. All chapters are unlocked and your AI tutor is ready when you are. Continue where you left off and aim for the top rank!"
                : "You've demonstrated incredible speed and logic in the championship arena. Level 1 (Foundation) is your bridge to elite mental performance. We've unlocked the first two modules for you completely free."
              }
            </p>
         </div>
      </section>

      {/* ── Why this matters for your child (parent context) ── */}
      <section style={{ ...S.section, paddingBottom: 0 }}>
        <div style={S.whyBox}>
          <div style={S.whyTitle}>👩‍👧 Why Level {levelNum} ({data.name}) is the Right Next Step</div>
          <p style={S.whyText}>{data.parentWhy}</p>
        </div>

        {/* What your child will achieve */}
        <div style={S.outcomeBox}>
          <div style={S.outcomeTitle}>🏆 What your child will master at this level</div>
          <p style={S.outcomeText}>{data.outcome}</p>
        </div>
      </section>

      {/* ── Tutor preview (what it looks like) ── */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>What Your Child Experiences</h2>
        <p style={S.sectionSub}>No boring videos or static worksheets. A live, responsive AI tutor that teaches visually, checks answers, and patiently adapts to mistakes.</p>

        <div style={S.previewBox}>
          <div style={S.previewInner}>
            {/* Simulated board */}
            <div style={S.boardRow}>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ color: "#64748B", fontSize: 12, marginBottom: 8, fontWeight: 700 }}>QUESTION</div>
                <div style={S.boardNum}>97 × 98 = ?</div>
              </div>
              <div style={S.boardArrow}>→</div>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ color: "#64748B", fontSize: 12, marginBottom: 8, fontWeight: 700 }}>ANSWER</div>
                <div style={S.boardAnswer}>9506 ✓</div>
              </div>
            </div>
            {/* AI coach bubble */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 280px) minmax(0, 1fr)",
              gap: 16,
              alignItems: "stretch",
            }}>
              <div style={{
                borderRadius: 22,
                padding: 14,
                background: "linear-gradient(180deg, #17355A 0%, #0F2440 100%)",
                border: "1px solid rgba(96,165,250,0.22)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
              }}>
                <div style={{
                  borderRadius: 18,
                  padding: 8,
                  background: "radial-gradient(circle at 50% 20%, rgba(125,211,252,0.18), rgba(15,23,42,0) 65%)",
                }}>
                  <MindSutraAvatar speaking={false} mood="encouraging" gesture="explain" size={150} name="Priya" label="MindSutra Coach" />
                </div>
                <div style={{
                  marginTop: 12,
                  color: "#D6E4FF",
                  fontSize: 14,
                  lineHeight: 1.55,
                  textAlign: "center" as const,
                }}>
                  Brilliant pacing! Both numbers are near 100, so we can solve this quickly with complements.
                </div>
                <button
                  style={{
                    marginTop: 14,
                    width: "100%",
                    border: "1px solid rgba(248,113,113,0.35)",
                    background: "rgba(127,29,29,0.45)",
                    color: "#FCA5A5",
                    borderRadius: 12,
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  Stop Audio
                </button>
              </div>
              <div style={{
                ...S.avatarBubble,
                display: "flex",
                alignItems: "center",
                minHeight: 240,
                fontSize: 15,
              }}>
                "Brilliant pacing! Both numbers are near 100. The deficit for 97 is 3, and for 98 is 2. Cross-subtracting: 97−2 = 95. Multiplying deficits: 3×2 = 06. So your answer is <strong style={{ color: "#FFFFFF" }}>9506</strong> ✓"
              </div>
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginTop: 8 }}>
              {[true,true,true,false,false,false,false,false,false].map((f, i) => <div key={i} style={S.progressDot(f)} />)}
              <span style={{ color: "#94A3B8", fontSize: 12, marginLeft: 10, fontWeight: 600 }}>3 of 9 Beats</span>
            </div>
          </div>
          <a href={demoUrl} style={{ ...S.ctaPrimary, display: "block", marginTop: 24, padding: "16px", textAlign: "center", width: "100%" }}>▶ Start the Live Preview — Free</a>
        </div>

        {/* Session timeline */}
        <h3 style={{ ...S.sectionTitle, fontSize: 18, marginBottom: 16 }}>The Structure of a 25-Minute Lesson</h3>
        <div style={S.timelineRow}>
          {[
            { color: "#312E81", label: "Intro", min: "3 min", desc: "Concept & animation" },
            { color: "#065F46", label: "Walkthrough", min: "5 min", desc: "Step-by-step example" },
            { color: "#7C2D12", label: "Guided", min: "10 min", desc: "You try, tutor assists" },
            { color: "#5B21B6", label: "Challenge", min: "5 min", desc: "Earn your XP" },
            { color: "#831843", label: "Summary", min: "2 min", desc: "Knowledge saved" },
          ].map((s, i) => (
            <div key={i} style={S.timelineStep(s.color)}>
              <div style={S.timelineLabel}>{s.label}</div>
              <div style={S.timelineMin}>{s.min}</div>
              <div style={S.timelineDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ color: "#64748B", fontSize: 13, textAlign: "center" }}>Lessons are heavily engaging. Progress is synced automatically if your child pauses.</p>
      </section>

      {/* ── Parent Dashboard Preview ── */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>Total Peace of Mind for Parents</h2>
        <p style={S.sectionSub}>No more guessing. The real-time parent dashboard tells you exactly what they learned, where they excel, and where the AI is helping them focus.</p>

        <div style={S.dashPreview}>
          <div style={S.dashTitle}>📊 Parent Dashboard — {data.name} Journey</div>
          {/* Stats row */}
          <div style={S.dashGrid}>
            {[
              { val: "2.5 hrs", lbl: "Time Invested", color: "#6366F1" },
              { val: "3/8", lbl: "Mastery Level", color: "#10B981" },
              { val: "84%", lbl: "Accuracy Avg", color: "#F59E0B" },
              { val: "3 days", lbl: "Current Streak", color: "#EC4899" },
            ].map(c => (
              <div key={c.lbl} style={S.dashCard(c.color)}>
                <div style={S.dashVal}>{c.val}</div>
                <div style={S.dashLbl}>{c.lbl}</div>
              </div>
            ))}
          </div>
          {/* Heatmap */}
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8, fontWeight: 600 }}>📅 Activity — Last 4 Weeks</div>
          <div style={S.heatRow}>
            {heatmap.map((v, i) => <div key={i} style={S.heatCell(v)} />)}
          </div>
          {/* Chapter table mini */}
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 16, marginBottom: 10, fontWeight: 600 }}>📚 Module Progress</div>
          {[
            { ch: "1. Core Foundation Skills", status: "✅ Mastered", acc: "92%", color: "#10B981" },
            { ch: "2. Visual Patterns Analysis", status: "✅ Mastered", acc: "87%", color: "#10B981" },
            { ch: "3. Expanding Applications", status: "🔄 Drilling", acc: "71%", color: "#F59E0B" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #E2E8F0", fontSize: 13 }}>
              <span style={{ color: "#1E293B", fontWeight: 500 }}>{r.ch}</span>
              <span style={{ color: r.color, fontWeight: 700 }}>{r.status}</span>
              <span style={{ color: "#64748B" }}>{r.acc}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#3730A3" }}>
            🤖 <strong>Nova AI Insight:</strong> Your child is doing great with logic mapping, but occasionally rushes mental carry-overs. I am adding 3 additional practice sets to their next session automatically.
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section id="curriculum" style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>Level Core Curriculum</h2>
        <p style={S.sectionSub}>
          Click any chapter to see its goals. The first module represents an introductory preview available right now for free.
        </p>

        <div style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
           <span style={{ fontWeight: 700, color: "#312E81", fontSize: 13 }}>💡 Placement Hint: </span>
           <span style={{ color: "#3730A3", fontSize: 13 }}>{data.hintLink}</span>
        </div>

        {data.chapters.map((ch, i) => {
          const isOpen = openChapter === i;
          const hasDemo = !!ch.demoCode;
          const chDemoUrl = ch.demoCode ? `/ai-tutor/demo?chapter=${ch.demoCode}&fresh=1` : `/ai-tutor/demo?product=mindsutra&level=${levelNum}&fresh=1`;
          const isActuallyFree = ch.freePreview;
          
          return (
            <div key={i} style={S.chapterItem(i === 0, hasDemo)}>
              <div style={S.chapterHeader(i === 0)} onClick={() => setOpenChapter(isOpen ? null : i)}>
                <span style={S.chapterNum}>{i + 1}</span>
                <span style={S.chapterTitle}>{ch.title}</span>
                <span style={S.metaBadge}>{ch.duration}</span>
                {isActuallyFree
                  ? <span style={S.freeBadge}>FREE LESSON</span>
                  : isEnrolled 
                    ? <span style={{ ...S.freeBadge, background: "#E0F2FE", color: "#0284C7" }}>UNLOCKED</span>
                    : <span style={S.proBadge}>PREMIUM</span>
                }
                <span style={{ color: "#94A3B8", fontSize: 14, marginLeft: 8 }}>{isOpen ? "▲" : "▼"}</span>
              </div>
              {isOpen && (
                <div style={S.goalsBox}>
                  {ch.goals.map((g, gi) => (
                    <div key={gi} style={S.goalItem}>
                      <span style={{ color: "#10B981", flexShrink: 0, fontWeight: 800 }}>✓</span>
                      <span>{g}</span>
                    </div>
                  ))}
                  {isActuallyFree || isEnrolled ? (
                    <a href={chDemoUrl + (isEnrolled ? "&enrolled=1" : "")} style={{ ...S.ctaPrimary, display: "inline-block", marginTop: 12, fontSize: 14, padding: "10px 20px" }}>
                      {isEnrolled ? "▶ Start This Lesson" : "▶ Start This Free Lesson"}
                    </a>
                  ) : (
                    <div style={{ marginTop: 12 }}>
                      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>Continuing beyond the first modules requires enrollment in the Full Course.</p>
                      <a href={checkoutUrl} style={{ ...S.ctaPrimary, display: "inline-block", fontSize: 14, padding: "10px 20px" }}>
                        Unlock All Chapters →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ── Pricing value framing ── */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <div style={S.valueBox}>
          <h2 style={S.valueTitle}>Mastery is an Investment. Not a Subscription.</h2>
          <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 32, marginTop: 0 }}>
            Pay once, use forever. No hidden fees. No recurring charges.
          </p>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
            <div style={{ background: "#060D17", border: "1px solid #1E3A5F", borderRadius: 16, padding: "28px 32px", minWidth: 240, flex: "1 1 240px", maxWidth: 320, textAlign: "center" }}>
              <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Single Level Access</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#F1F5F9", lineHeight: 1 }}>₹1,499</div>
              <div style={{ color: "#64748B", fontSize: 14, textDecoration: "line-through", marginTop: 8 }}>₹2,999</div>
              <div style={{ color: "#CBD5E1", fontSize: 14, margin: "16px 0 24px" }}>Level {levelNum} · All 8 Chapters · Lifetime</div>
              <a href={checkoutUrl} style={{ ...S.ctaPrimary, display: "block", fontSize: 15, padding: "14px 16px" }}>
                Enroll in Level {levelNum} →
              </a>
            </div>

            <div style={{ background: "linear-gradient(135deg,#1E1B4B,#0F172A)", border: "2px solid #8B5CF6", borderRadius: 16, padding: "28px 32px", minWidth: 240, flex: "1 1 240px", maxWidth: 320, textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#8B5CF6", color: "#fff", fontSize: 12, fontWeight: 800, padding: "4px 16px", borderRadius: 24, whiteSpace: "nowrap" }}>MOST POPULAR</div>
              <div style={{ color: "#A78BFA", fontSize: 13, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>MindSutra Master Bundle</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#F1F5F9", lineHeight: 1 }}>₹4,999</div>
              <div style={{ color: "#64748B", fontSize: 14, textDecoration: "line-through", marginTop: 8 }}>₹14,995</div>
              <div style={{ color: "#E2E8F0", fontSize: 14, margin: "16px 0 24px" }}>All 5 Levels · 40 Chapters · Lifetime</div>
              <a href="/checkout/bundle-mindsutra-5-levels" style={{ ...S.ctaPrimary, display: "block", fontSize: 15, padding: "14px 16px", background: "linear-gradient(90deg, #6366F1, #8B5CF6)" }}>
                Get All 5 Levels →
              </a>
            </div>
          </div>

          <div style={S.compareRow}>
            <div style={S.compareCard(false)}>
              <div style={S.comparePrice}>₹1,500</div>
              <div style={S.compareLabel}>1 ordinary hours with a tutor</div>
              <div style={S.compareNote}>Single topic, rigid pace, limited patience.</div>
            </div>
            <div style={S.compareCard(true)}>
              <div style={S.comparePrice}>₹1,499</div>
              <div style={S.compareLabel}>Lifetime AI Access</div>
              <div style={S.compareNote}>8 chapters, unlimited practice loops, adaptive pace.</div>
            </div>
          </div>

          <div style={{ color: "#64748B", fontSize: 13, marginTop: 24 }}>🛡️ 30-Day Money-Back Guarantee · No Annual Renewals</div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>Success Stories from Real Parents</h2>
        <p style={S.sectionSub}>Honest feedback sent straight to our WhatsApp from families finding success with MindSutra.</p>
        <div style={S.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={S.testimonialCard}>
              <span style={S.improvBadge}>{t.improvement}</span>
              <p style={S.quote}>"{t.quote}"</p>
              <div style={S.parentName}>{t.parent}</div>
              <div style={S.parentMeta}>{t.city} · {t.childLevel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>Frequently Asked Questions</h2>
        <div style={{ marginTop: 24 }}>
          {FAQ.map((f, i) => (
            <div key={i} style={S.faqItem}>
              <div style={S.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span style={S.faqQText}>{f.q}</span>
                <span style={S.faqChevron(openFaq === i)}>▼</span>
              </div>
              {openFaq === i && <div style={S.faqA}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={S.footer}>
        <div style={S.footerLinks}>
          {LEVELS.map(l => <a key={l} href={`/mindsutra/${l}`} style={S.footerLink}>{l.replace("level-", "Level ")}</a>)}
          <a href="https://robodynamics.in/login" style={S.footerLink}>Course LMS Login</a>
          <a href="https://robodynamics.in" style={S.footerLink}>About</a>
          <a href="/privacy" style={S.footerLink}>Privacy</a>
        </div>
        <p style={S.footerCopy}>© 2026 RoboDynamics. MindSutra is a product of RoboDynamics Pvt Ltd.</p>
      </footer>

      {/* ── Sticky bottom CTA ── */}
      <div style={S.stickyBottom}>
        <div style={S.stickyLeft}>
          <span style={S.stickyPrice}>₹1,499<span style={{ fontSize: 13, fontWeight: 500, color: "#94A3B8" }}> one-time</span></span>
          <span style={S.stickyOld}>₹2,999</span>
        </div>
        <div style={S.stickyBtns}>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={S.waBtn}>📱 Share</a>
          <a href={checkoutUrl} style={S.enrollBtn}>Enroll Now →</a>
        </div>
      </div>

    </div>
  );
}
