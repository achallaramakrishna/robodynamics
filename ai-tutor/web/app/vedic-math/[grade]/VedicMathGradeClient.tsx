"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// This file is the client component â€” imported by the server page.tsx which owns generateStaticParams.

/* â”€â”€â”€ Grade metadata â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const GRADE_DATA: Record<string, {
  num: number;
  headline: string;
  parentWhy: string;
  outcome: string;
  demoChapter: string;
  chapters: { title: string; duration: string; goals: string[]; demoCode?: string }[];
  cbseLink: string;
}> = {
  "grade-4": {
    num: 4,
    headline: "Your Child Will Add 999 + 1 Instantly â€” and Know Exactly Why",
    parentWhy: "CBSE Grade 4 introduces large-number addition and basic multiplication. Most children memorise steps without understanding them â€” which breaks down by Grade 6. Vedic Maths builds deep number sense first, so your child understands WHY the answer is correct, not just what it is.",
    outcome: "After completing this course, your child can: mentally add and subtract any 3-digit numbers, multiply numbers near 10 and 100 in one step, check any answer in 5 seconds using digit sums, and solve Grade 4 CBSE textbook problems 3Ã— faster.",
    demoChapter: "VM_G4_L1_FAST_ADDITION",
    cbseLink: "Maps to NCERT Class 4 Maths â€” Chapters 1, 3, 5 (Adding Bigger Numbers, Tick Tick Tick, The Way the World Looks)",
    chapters: [
      { title: "Completing the Whole â€” PÅ«raá¹‡ÄpÅ«raá¹‡ÄbhyÄm", duration: "25 min", demoCode: "VM_G4_L1_FAST_ADDITION", goals: ["Find complements to 10, 100, 1000 instantly", "Apply sutra for instant mental addition of large numbers", "Spot number pair patterns that always sum to a round base"] },
      { title: "All from 9, Last from 10 â€” Nikhilam Basics", duration: "25 min", goals: ["Subtract any number from a round base without borrowing", "Find deficits from 10 and 100 in one look", "Multiply single-digit numbers near 10 using deficit method"] },
      { title: "Doubling & Halving Tricks", duration: "20 min", goals: ["Double any 2-digit number mentally in under 3 seconds", "Halve even and odd numbers using Vedic shortcuts", "Apply doubling chains to solve multiplication quickly"] },
      { title: "The 11 Times Trick", duration: "20 min", goals: ["Multiply any 2-digit number by 11 in one step", "Extend the trick to 3-digit numbers", "Verify results instantly with digit-sum check"] },
      { title: "Adding in Pairs â€” Lopana SthÄpana", duration: "25 min", goals: ["Group numbers into convenient pairs before adding", "Spot hidden 10s and 100s in a column of numbers", "Add a list of 6+ numbers faster than a calculator"] },
      { title: "Magic of 9 â€” Digit Sum Check", duration: "20 min", goals: ["Calculate digit sum of any number in seconds", "Use digit sums to catch arithmetic errors instantly", "Understand why the 9-check always works (casting out 9s)"] },
      { title: "Multiplying Near 10 & 100", duration: "25 min", goals: ["Multiply two numbers near 10 using the base method", "Extend to numbers near 100 (e.g. 97 Ã— 98)", "Handle both deficits and excesses above the base"] },
      { title: "Quick Division by 2, 5 & 10", duration: "20 min", goals: ["Divide any number by 2, 5 and 10 in one line", "Use Vedic flag method basics to organise remainders", "Connect division back to multiplication for self-checking"] },
    ],
  },
  "grade-5": {
    num: 5,
    headline: "Your Child Will Multiply 97 Ã— 103 in 5 Seconds â€” No Calculator",
    parentWhy: "CBSE Grade 5 introduces 2-digit Ã— 2-digit multiplication and fractions. Children who rely on column-by-column methods make carry errors and lose marks. Vedic Maths gives your child one clean visual method â€” the Nikhilam and Criss-Cross â€” so they solve the same problems faster, with fewer mistakes.",
    outcome: "After completing this course, your child can: multiply any two 2-digit numbers near 100 in one step, check every answer with digit sums, multiply by 11 in 2 seconds, square numbers near 50 mentally, and solve HCF/LCM problems in half the usual time.",
    demoChapter: "VM_G5_L1_NIKHILAM_NEAR100",
    cbseLink: "Maps to NCERT Class 5 Maths â€” Chapters 13, 14 (Ways to Multiply and Divide, How Big? How Heavy?)",
    chapters: [
      { title: "Nikhilam â€” Near 100 Multiplication", duration: "25 min", demoCode: "VM_G5_L1_NIKHILAM_NEAR100", goals: ["Multiply any two numbers near 100 in one step", "Understand the deficit method with animated visual board", "Reach 6+ correct problems per minute by chapter end"] },
      { title: "Digit Sum & Divisibility", duration: "25 min", goals: ["Check any multiplication answer instantly â€” no re-calculation", "Test divisibility by 3, 9 and 11 in seconds", "Catch carry errors before writing the final answer"] },
      { title: "Criss-Cross 2-digit Multiplication", duration: "30 min", goals: ["Multiply any two 2-digit numbers using Åªrdhva-Tiryak", "Organise 3 partial products cleanly in one written step", "Complete 2-digit Ã— 2-digit problems in under 8 seconds"] },
      { title: "Multiplying by 11 & 12", duration: "20 min", goals: ["Multiply any number by 11 by adding adjacent digits", "Extend the trick to 12 and 111", "Apply to quick mental calculations in class tests"] },
      { title: "Squaring Numbers Near 50", duration: "25 min", goals: ["Square any number near 50 in two mental steps", "Understand WHY the formula works via area model", "Extend to numbers near 25, 75 and 500"] },
      { title: "Percentage Shortcuts", duration: "25 min", goals: ["Calculate 10%, 5%, 1% of any number instantly", "Find any percentage by combining these building blocks", "Solve CBSE percentage word problems in half the steps"] },
      { title: "HCF by Vedic Method", duration: "25 min", goals: ["Find HCF of two numbers by inspection and subtraction", "Avoid long prime-factorisation for simple cases", "Connect HCF to fraction simplification in one step"] },
      { title: "Division by Flag Method â€” Dhvajanka", duration: "30 min", goals: ["Divide by any 2-digit number using the flag (Dhvajanka) sutra", "Reduce long-division to a single compact working line", "Verify the quotient and remainder in one digit-sum step"] },
    ],
  },
  "grade-6": {
    num: 6,
    headline: "Your Child Will Do 998 Ã— 997 Mentally â€” Faster Than a Calculator",
    parentWhy: "CBSE Grade 6 is where Maths gets serious â€” algebra begins, fractions expand, and long multiplication problems grow. Children who don't have fast mental calculation skills start relying on calculators and lose the ability to estimate. Vedic Maths builds that mental muscle permanently.",
    outcome: "After completing this course, your child can: multiply 3-digit numbers near 1000 in one step, do 3-digit criss-cross multiplication, find squares near any base, apply divisibility rules for 7/11/13, and solve two simultaneous equations mentally.",
    demoChapter: "VM_G6_L1_VINCULUM",
    cbseLink: "Maps to NCERT Class 6 Maths â€” Chapters 2, 7, 8 (Whole Numbers, Fractions, Decimals)",
    chapters: [
      { title: "Nikhilam Near 1000", duration: "25 min", demoCode: "VM_G6_L1_VINCULUM", goals: ["Extend deficit method from base 100 to base 1000", "Multiply 3-digit numbers near 1000 in a single step", "Understand why the carry rules change at higher bases"] },
      { title: "Criss-Cross 3-digit Multiplication", duration: "30 min", goals: ["Apply Åªrdhva Tiryak to 3-digit Ã— 3-digit problems", "Organise 5 partial products cleanly", "Reach 4-digit answers in under 15 seconds"] },
      { title: "Squares Near a Base", duration: "25 min", goals: ["Square any number near 100, 1000, or 50 using base deviation", "See the area-model proof that makes the formula unforgettable", "Extend to numbers above AND below the base"] },
      { title: "Difference of Squares â€” (a+b)(aâˆ’b)", duration: "25 min", goals: ["Factorise and expand difference-of-squares in one look", "Multiply number pairs like 47Ã—53 in 2 seconds", "Apply to simplify CBSE algebra expressions instantly"] },
      { title: "Divisibility Rules â€” 7, 11 and 13", duration: "25 min", goals: ["Test any number for divisibility by 7, 11 and 13", "Understand the Osculator method (not just memorise rules)", "Apply to factor large numbers in CBSE problems"] },
      { title: "Paravartya â€” Synthetic Division", duration: "30 min", goals: ["Divide by any number of the form (10âˆ’d) in one line", "Apply to algebraic polynomial division", "Connect Paravartya to the standard long-division algorithm"] },
      { title: "Decimal Shortcuts", duration: "20 min", goals: ["Multiply and divide any decimal by 10, 100, 1000 in one look", "Convert fractions to decimals using Vedic flag division", "Avoid misplaced decimal-point errors in CBSE papers"] },
      { title: "Simultaneous Equations â€” Ä€nurÅ«pyena", duration: "30 min", goals: ["Solve 2-variable simultaneous equations by inspection", "Spot proportional coefficient pairs instantly", "Verify solutions in 5 seconds using substitution check"] },
    ],
  },
  "grade-7": {
    num: 7,
    headline: "Your Child Will Solve Equations, Square Roots & Geometry â€” All Mentally",
    parentWhy: "CBSE Grade 7 introduces negative numbers, algebraic expressions, triangles and exponents. It's the year many students decide they 'hate Maths.' Vedic Maths reframes every hard topic as a visual puzzle with a shortcut â€” turning frustration into confidence before Grade 8.",
    outcome: "After completing this course, your child can: multiply 4-digit numbers using criss-cross, expand algebraic identities visually, calculate triangle areas using sutras, work with exponents and powers, and solve HCF/LCM of large numbers in seconds.",
    demoChapter: "VM_G7_L1_SQUARING_NEAR_BASE",
    cbseLink: "Maps to NCERT Class 7 Maths â€” Chapters 2, 4, 11, 12 (Fractions & Decimals, Simple Equations, Perimeter & Area, Algebraic Expressions)",
    chapters: [
      { title: "Nikhilam Near 10,000", duration: "25 min", demoCode: "VM_G7_L1_SQUARING_NEAR_BASE", goals: ["Scale the deficit method to base 10,000", "Multiply 4-digit numbers near 10,000 in one step", "Handle excesses and deficits with the same framework"] },
      { title: "Criss-Cross 4-digit Multiplication", duration: "30 min", goals: ["Manage 7 partial products in the Åªrdhva-Tiryak framework", "Produce 8-digit answers with a single organised working line", "Build speed to under 30 seconds per 4-digit Ã— 4-digit"] },
      { title: "Algebraic Identities Visually", duration: "30 min", goals: ["Prove (a+b)Â², (a-b)Â², (a+b)(a-b) via SVG area models", "Expand and factorise expressions by inspection", "Map Vedic identities directly to CBSE algebra chapter"] },
      { title: "Triangle & Area Sutras", duration: "25 min", goals: ["Calculate area of triangles using the Lopana sutra shortcut", "Apply Pythagorean triples (3-4-5, 5-12-13) from memory", "Solve CBSE perimeter and area problems in fewer steps"] },
      { title: "Powers & Exponent Patterns", duration: "25 min", goals: ["Build powers of 2, 3, 5 from doubling/tripling chains", "Spot the last-digit pattern of any base raised to any power", "Apply exponent rules to large CBSE number problems"] },
      { title: "Advanced HCF & LCM", duration: "25 min", goals: ["Find HCF of 3+ numbers using Vedic column method", "Calculate LCM by prime-factorisation shortcut", "Solve word problems on HCF/LCM directly in CBSE format"] },
      { title: "Fraction Shortcuts", duration: "25 min", goals: ["Add and subtract unlike fractions in one visual step", "Multiply mixed numbers using Nikhilam base method", "Simplify fraction chains without finding LCM each time"] },
      { title: "Mixed Practice â€” Speed Rounds", duration: "30 min", goals: ["Timed 60-second drills across all 7 chapter methods", "Identify personal weak spots from accuracy heatmap", "Earn Speed Champion badge at 90%+ accuracy under time pressure"] },
    ],
  },
  "grade-8": {
    num: 8,
    headline: "Your Child Will Factorise Quadratics and Find Cube Roots â€” In Their Head",
    parentWhy: "CBSE Grade 8 is the gateway to board exam maths. Squares, cubes, algebraic division, quadratics â€” these topics appear in every competitive exam from Grade 9 onwards. Mastering them now with Vedic methods gives your child a permanent edge in school exams, Olympiads, and eventually JEE.",
    outcome: "After completing this course, your child can: find square roots of perfect squares mentally, find cube roots of any perfect cube, factorise quadratics by inspection, apply Pythagorean proofs, and divide algebraic polynomials using Paravartya â€” all without a calculator.",
    demoChapter: "VM_G8_L1_SQUARE_ROOTS",
    cbseLink: "Maps to NCERT Class 8 Maths â€” Chapters 6, 7, 9, 14 (Squares & Square Roots, Cubes & Cube Roots, Algebraic Expressions, Factorisation)",
    chapters: [
      { title: "Large-Number Nikhilam", duration: "25 min", demoCode: "VM_G8_L1_SQUARE_ROOTS", goals: ["Apply Nikhilam to any base â€” 100, 1000, 10000, or custom", "Multiply 5-digit numbers near round bases in 2 steps", "Reduce complex multiplication to small deficit arithmetic"] },
      { title: "Vilokanam â€” Inspection Division", duration: "25 min", goals: ["Divide by special divisors (5, 9, 11, 25) by pure inspection", "Spot quotient and remainder simultaneously", "Apply to algebraic fraction simplification"] },
      { title: "Algebraic Division â€” Paravartya", duration: "30 min", goals: ["Divide polynomials by (x âˆ’ a) in one compact line", "Find remainders without full long division", "Connect to the Remainder Theorem in CBSE curriculum"] },
      { title: "Pythagoras via Vedic Proofs", duration: "25 min", goals: ["Derive Pythagorean triples from any seed number", "Verify right-angle triangles by inspection using Vedic formula", "Apply to CBSE mensuration and coordinate geometry problems"] },
      { title: "Square Roots by Vedic Method", duration: "30 min", goals: ["Find square roots of perfect squares by digit grouping", "Apply the Vedic Duplex (Dvanda Yoga) method for any root", "Solve in half the steps of the standard division method"] },
      { title: "Cube Roots â€” Anurupyena Method", duration: "30 min", goals: ["Identify cube roots of perfect cubes in one look", "Use the last-digit pattern shortcut to narrow roots instantly", "Apply to CBSE Cubes & Cube Roots chapter problems directly"] },
      { title: "Solving Quadratics â€” Vedic Way", duration: "30 min", goals: ["Factorise quadratics by inspection using Ä€dyamÄdyena sutra", "Solve quadratic equations without completing the square", "Verify roots in seconds using product/sum of roots check"] },
      { title: "Speed Maths Championships", duration: "35 min", goals: ["Timed championship drills across all 8 Vedic methods", "Full-length mock test in CBSE Grade 8 exam format", "Earn MindSutra Champion certificate for 90%+ accuracy"] },
    ],
  },
};

const GRADES = ["grade-4", "grade-5", "grade-6", "grade-7", "grade-8"] as const;

const TESTIMONIALS = [
  {
    quote: "Unit Test 1 she scored 54. After 3 weeks of MindSutra, Unit Test 2 was 81. Her maths teacher asked what changed.",
    parent: "Sunita R.", city: "Bangalore", childGrade: "Grade 5", improvement: "54 â†’ 81",
  },
  {
    quote: "My son used to take 40 minutes for his maths homework. Now it's done in 15. He's also stopped using his fingers to count â€” at age 11!",
    parent: "Rajesh M.", city: "Hyderabad", childGrade: "Grade 6", improvement: "40 min â†’ 15 min",
  },
  {
    quote: "The parent dashboard is the best feature. I can see exactly where Aarav gets stuck â€” he struggles with carries in multiplication â€” and the tutor automatically gives him extra practice there.",
    parent: "Anita K.", city: "Chennai", childGrade: "Grade 7", improvement: "Parent visibility",
  },
  {
    quote: "I was sceptical â€” we've tried 3 apps before. But the avatar coach actually explains WHY. My daughter says 'it's like having a teacher who never gets annoyed.'",
    parent: "Praveena S.", city: "Pune", childGrade: "Grade 4", improvement: "3 apps tried before",
  },
];

const FAQ = [
  { q: "Is it safe for my child to use alone?", a: "Yes. MindSutra is designed for independent use by children aged 9â€“14. There are no social features, no chat with strangers, and no ads. Parents get full visibility via the dashboard." },
  { q: "Which devices does it work on?", a: "Any device with a web browser â€” phone, tablet, or laptop. No app download needed. Works best on Chrome or Safari with a screen width of 360px or more." },
  { q: "Will this help in CBSE school exams?", a: "Directly. Each chapter maps to the corresponding NCERT textbook chapter for that grade. The Vedic methods are faster alternatives to the standard algorithms â€” your child still writes standard working in exams, but arrives at the answer faster and with fewer errors." },
  { q: "What if my child doesn't like it?", a: "We offer a full refund within 30 days â€” no questions asked. If your child tries the free demo first and loves it, that's the best sign they'll enjoy the full course." },
  { q: "How is this different from YouTube videos or BYJU's?", a: "YouTube and recorded video platforms show your child content â€” they can't respond to a wrong answer. MindSutra is interactive: the AI tutor notices when your child gets stuck, re-explains in a different way, and adapts the next question. It's the difference between watching someone swim and actually swimming." },
  { q: "Can two children in my family use the same account?", a: "Each child needs their own student profile so the AI can track individual progress. You can register multiple children under one parent account. The Family Bundle (â‚¹4,999 one-time) covers 2 children across all grades G4â€“G8." },
  { q: "Do I have to pay again next year?", a: "No. MindSutra uses lifetime access â€” you pay once and your child can use the course forever. No subscription, no renewal, no surprise charges. The G4â€“G8 Bundle covers all 5 grades in one payment, so as your child moves from Grade 4 to Grade 8 the content is already waiting for them." },
];

/* â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function VedicMathGradeClient() {
  const params = useParams();
  const router = useRouter();
  const gradeSlug = (params?.grade as string) ?? "grade-5";
  const data = GRADE_DATA[gradeSlug] ?? GRADE_DATA["grade-5"];
  const [openChapter, setOpenChapter] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const gradeNum = data.num;
  const demoUrl = `/ai-tutor/demo?grade=${gradeNum}&chapter=${data.demoChapter}&fresh=1`;
  const checkoutUrl = `/checkout/grade-${gradeNum}`;
  const whatsappText = encodeURIComponent(`Check out this Vedic Maths AI Tutor for Grade ${gradeNum} â€” ${gradeNum * 100} students already enrolled. Try the free demo: https://robodynamics.in/vedic-math/grade-${gradeNum}`);
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  const S = {
    topBar: { position: "sticky" as const, top: 0, zIndex: 100, background: "#0F172A", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    logo: { color: "#F97316", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", textDecoration: "none" },
    loginLink: { color: "#CBD5E1", fontSize: 14, textDecoration: "none", padding: "6px 14px", border: "1px solid #334155", borderRadius: 6 },
    hero: { background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)", padding: "60px 20px 50px", textAlign: "center" as const },
    heroEyebrow: { color: "#F97316", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 12 },
    heroH1: { color: "#FFFFFF", fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 800, lineHeight: 1.25, maxWidth: 680, margin: "0 auto 16px" },
    heroSub: { color: "#94A3B8", fontSize: 16, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 },
    ctaRow: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 32 },
    ctaPrimary: { background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 8, border: "none", cursor: "pointer", textDecoration: "none", display: "inline-block" },
    ctaSecondary: { background: "transparent", color: "#FFFFFF", fontWeight: 600, fontSize: 15, padding: "12px 24px", borderRadius: 8, border: "2px solid #334155", cursor: "pointer", textDecoration: "none", display: "inline-block" },
    proofRow: { display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" as const },
    proofItem: { color: "#64748B", fontSize: 13 },
    gradePills: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" as const, marginTop: 32 },
    gradePill: (active: boolean) => ({ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: active ? "#F97316" : "#1E293B", color: active ? "#FFFFFF" : "#94A3B8" }),
    section: { padding: "48px 20px", maxWidth: 780, margin: "0 auto" },
    sectionTitle: { fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8 },
    sectionSub: { color: "#64748B", fontSize: 15, marginBottom: 28, lineHeight: 1.6 },
    // Parent-why box
    whyBox: { background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: "20px 24px", marginBottom: 32 },
    whyTitle: { fontWeight: 700, color: "#92400E", fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 },
    whyText: { color: "#78350F", fontSize: 14, lineHeight: 1.7 },
    // Tutor preview mockup
    previewBox: { background: "#0F172A", borderRadius: 16, padding: "24px 20px", margin: "0 auto 40px", maxWidth: 600, textAlign: "center" as const },
    previewInner: { background: "#1E293B", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column" as const, gap: 16 },
    boardRow: { background: "#0F172A", borderRadius: 8, padding: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: 24 },
    boardNum: { color: "#38BDF8", fontSize: 28, fontWeight: 800, fontFamily: "monospace" },
    boardAnswer: { color: "#22C55E", fontSize: 28, fontWeight: 800, fontFamily: "monospace" },
    boardArrow: { color: "#64748B", fontSize: 20 },
    avatarRow: { display: "flex", gap: 12, alignItems: "flex-start" },
    avatarBubble: { background: "#1E40AF", borderRadius: "0 10px 10px 10px", padding: "10px 14px", flex: 1, color: "#BFDBFE", fontSize: 13, lineHeight: 1.5, textAlign: "left" as const },
    progressMini: { display: "flex", gap: 6, justifyContent: "center" },
    progressDot: (filled: boolean) => ({ width: 8, height: 8, borderRadius: "50%", background: filled ? "#22C55E" : "#334155" }),
    // Session timeline
    timelineRow: { display: "flex", gap: 0, overflowX: "auto" as const, marginBottom: 8 },
    timelineStep: (color: string) => ({ flex: 1, background: color, padding: "12px 8px", textAlign: "center" as const, minWidth: 80 }),
    timelineLabel: { fontSize: 11, fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase" as const, letterSpacing: 0.5 },
    timelineMin: { fontSize: 18, fontWeight: 800, color: "#FFFFFF", marginTop: 2 },
    timelineDesc: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2, lineHeight: 1.3 },
    // Parent dashboard preview
    dashPreview: { background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 14, padding: 20, marginBottom: 8 },
    dashTitle: { fontWeight: 700, fontSize: 13, color: "#374151", marginBottom: 12 },
    dashGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 },
    dashCard: (color: string) => ({ background: "#FFFFFF", borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "10px 12px" }),
    dashVal: { fontWeight: 800, fontSize: 18, color: "#0F172A" },
    dashLbl: { fontSize: 11, color: "#64748B", marginTop: 2 },
    heatRow: { display: "flex", gap: 3, marginBottom: 6, overflowX: "auto" as const },
    heatCell: (intensity: number) => ({ width: 16, height: 16, borderRadius: 3, background: intensity === 0 ? "#F1F5F9" : intensity < 15 ? "#FED7AA" : intensity < 30 ? "#FB923C" : "#EA580C", flexShrink: 0 }),
    // Outcome box
    outcomeBox: { background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "20px 24px", marginBottom: 32 },
    outcomeTitle: { fontWeight: 700, color: "#14532D", fontSize: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 },
    outcomeText: { color: "#166534", fontSize: 14, lineHeight: 1.7 },
    // Curriculum
    chapterItem: (isFirst: boolean, hasDemo: boolean) => ({ border: `${isFirst ? "2px solid #F97316" : hasDemo ? "1px solid #FED7AA" : "1px solid #E2E8F0"}`, borderRadius: 10, marginBottom: 8, overflow: "hidden", background: "#FFFFFF" }),
    chapterHeader: { display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", cursor: "pointer" },
    chapterNum: { background: "#FFF7ED", color: "#EA580C", fontWeight: 700, fontSize: 12, borderRadius: 6, padding: "4px 8px", minWidth: 26, textAlign: "center" as const, flexShrink: 0 },
    chapterTitle: { flex: 1, fontWeight: 600, color: "#0F172A", fontSize: 14, lineHeight: 1.3 },
    freeBadge: { background: "#DCFCE7", color: "#16A34A", fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 4, flexShrink: 0 },
    previewBadge: { background: "#FFF7ED", color: "#EA580C", fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 4, flexShrink: 0 },
    lockBadge: { color: "#CBD5E1", fontSize: 14, flexShrink: 0 },
    metaBadge: { color: "#94A3B8", fontSize: 11, flexShrink: 0 },
    goalsBox: { padding: "4px 14px 14px 14px" },
    goalItem: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, fontSize: 13, color: "#334155", lineHeight: 1.4 },
    // Testimonials
    testimonialGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 },
    testimonialCard: { background: "#FFFFFF", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    improvBadge: { background: "#DCFCE7", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, display: "inline-block", marginBottom: 10 },
    quote: { color: "#334155", fontSize: 14, lineHeight: 1.6, marginBottom: 14, fontStyle: "italic" },
    parentName: { fontWeight: 700, color: "#0F172A", fontSize: 13 },
    parentMeta: { color: "#94A3B8", fontSize: 12 },
    // Pricing value
    valueBox: { background: "#0F172A", borderRadius: 16, padding: "28px 24px", textAlign: "center" as const, marginBottom: 0 },
    valueTitle: { color: "#FFFFFF", fontWeight: 800, fontSize: 20, marginBottom: 20 },
    compareRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 },
    compareCard: (highlight: boolean) => ({ background: highlight ? "#F97316" : "#1E293B", borderRadius: 12, padding: 16 }),
    comparePrice: { fontWeight: 800, fontSize: 28, color: "#FFFFFF" },
    compareLabel: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 },
    compareNote: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 6, lineHeight: 1.4 },
    // FAQ
    faqItem: { border: "1px solid #E2E8F0", borderRadius: 10, marginBottom: 8, overflow: "hidden", background: "#FFFFFF" },
    faqQ: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", cursor: "pointer" },
    faqQText: { fontWeight: 600, color: "#0F172A", fontSize: 14, flex: 1 },
    faqChevron: (open: boolean) => ({ color: "#64748B", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 14 }),
    faqA: { padding: "0 16px 14px", color: "#475569", fontSize: 13, lineHeight: 1.7 },
    // Sticky bottom
    stickyBottom: { position: "fixed" as const, bottom: 0, left: 0, right: 0, zIndex: 50, background: "#0F172A", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 -4px 16px rgba(0,0,0,0.25)", gap: 8 },
    stickyLeft: { display: "flex", flexDirection: "column" as const },
    stickyPrice: { color: "#FFFFFF", fontSize: 16, fontWeight: 800 },
    stickyOld: { color: "#64748B", textDecoration: "line-through", fontSize: 12 },
    stickyBtns: { display: "flex", gap: 8, alignItems: "center" },
    enrollBtn: { background: "#F97316", color: "#FFFFFF", fontWeight: 700, fontSize: 14, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap" as const },
    waBtn: { background: "#22C55E", color: "#FFFFFF", fontWeight: 700, fontSize: 13, padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap" as const },
    footer: { background: "#0F172A", padding: "32px 20px", marginBottom: 68 },
    footerLinks: { display: "flex", gap: 20, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 16 },
    footerLink: { color: "#64748B", fontSize: 13, textDecoration: "none" },
    footerCopy: { textAlign: "center" as const, color: "#475569", fontSize: 12 },
  };

  const heatmap = [0,0,20,30,15,0,0, 25,40,15,0,30,20,0, 10,0,25,35,15,0,0, 20,30,0,15,25,0,0];

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>

      {/* â”€â”€ Top bar â”€â”€ */}
      <nav style={S.topBar}>
        <a href="/vedic-math" style={S.logo}>MindSutra</a>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ color: "#22C55E", fontSize: 20, textDecoration: "none" }} title="Share on WhatsApp">ðŸ“±</a>
          <a href="/auth/login" style={S.loginLink}>Login</a>
        </div>
      </nav>

      {/* â”€â”€ Hero â”€â”€ */}
      <section style={S.hero}>
        <p style={S.heroEyebrow}>CBSE Grade {gradeNum} Â· Vedic Mathematics Â· AI Tutor</p>
        <h1 style={S.heroH1}>{data.headline}</h1>
        <p style={S.heroSub}>AI-powered tutor with a live animated teacher. 8 chapters, adaptive practice, and a parent dashboard.</p>
        <div style={S.ctaRow}>
          <a href={demoUrl} style={S.ctaPrimary}>ðŸš€ Try Free Demo â€” No Login</a>
          <a href="#curriculum" style={S.ctaSecondary}>See All Chapters â†“</a>
        </div>
        <div style={S.proofRow}>
          <span style={S.proofItem}>â­ 4.8 stars</span>
          <span style={S.proofItem}>ðŸ‘¥ 10K+ students</span>
          <span style={S.proofItem}>ðŸ“š CBSE aligned</span>
          <span style={S.proofItem}>ðŸŽ¯ 8 chapters</span>
          <span style={S.proofItem}>â†©ï¸ 30-day refund</span>
        </div>
        <div style={S.gradePills}>
          {GRADES.map(g => (
            <button key={g} style={S.gradePill(g === gradeSlug)} onClick={() => router.push(`/vedic-math/${g}`)}>
              {g.replace("grade-", "Grade ")}
            </button>
          ))}
        </div>
      </section>

      {/* â”€â”€ Why this matters for your child (parent context) â”€â”€ */}
      <section style={{ ...S.section, paddingBottom: 0 }}>
        <div style={S.whyBox}>
          <div style={S.whyTitle}>ðŸ‘¨â€ðŸ‘©â€ðŸ‘§ Why Grade {gradeNum} is the right time for Vedic Maths</div>
          <p style={S.whyText}>{data.parentWhy}</p>
        </div>

        {/* What your child will achieve */}
        <div style={S.outcomeBox}>
          <div style={S.outcomeTitle}>ðŸ† What your child will be able to do after this course</div>
          <p style={S.outcomeText}>{data.outcome}</p>
        </div>
      </section>

      {/* â”€â”€ Tutor preview (what it looks like) â”€â”€ */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>What your child actually sees</h2>
        <p style={S.sectionSub}>Not a video. Not a worksheet. A live AI tutor that teaches, asks questions, and adapts â€” all in one screen.</p>

        <div style={S.previewBox}>
          <div style={S.previewInner}>
            {/* Simulated board */}
            <div style={S.boardRow}>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ color: "#64748B", fontSize: 11, marginBottom: 4 }}>QUESTION</div>
                <div style={S.boardNum}>97 Ã— 98 = ?</div>
              </div>
              <div style={S.boardArrow}>â†’</div>
              <div style={{ textAlign: "center" as const }}>
                <div style={{ color: "#64748B", fontSize: 11, marginBottom: 4 }}>ANSWER</div>
                <div style={S.boardAnswer}>9506 âœ“</div>
              </div>
            </div>
            {/* AI coach bubble */}
            <div style={S.avatarRow}>
              <div style={{ fontSize: 32 }}>ðŸ¤–</div>
              <div style={S.avatarBubble}>
                "Great job! Both numbers are near 100. Deficit of 97 is 3, deficit of 98 is 2. Cross-subtract: 97âˆ’2 = 95. Multiply deficits: 3Ã—2 = 06. Answer: <strong style={{ color: "#FFFFFF" }}>9506</strong> âœ“"
              </div>
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center" }}>
              {[true,true,true,false,false,false,false,false,false].map((f, i) => <div key={i} style={S.progressDot(f)} />)}
              <span style={{ color: "#64748B", fontSize: 11, marginLeft: 8 }}>3 of 9 done</span>
            </div>
          </div>
          <a href={demoUrl} style={{ ...S.ctaPrimary, display: "block", marginTop: 16, textAlign: "center" }}>â–¶ Try this live â€” free, no login</a>
        </div>

        {/* Session timeline */}
        <h3 style={{ ...S.sectionTitle, fontSize: 16, marginBottom: 12 }}>How one 25-minute session is structured</h3>
        <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
          <div style={S.timelineRow}>
            {[
              { color: "#1E40AF", label: "Intro", min: "3 min", desc: "Coach explains the sutra with animation" },
              { color: "#065F46", label: "Worked Example", min: "5 min", desc: "Step-by-step on the board" },
              { color: "#92400E", label: "Guided Practice", min: "10 min", desc: "You try, coach corrects" },
              { color: "#7C3AED", label: "Challenge", min: "5 min", desc: "Timed questions, earn XP" },
              { color: "#9F1239", label: "Summary", min: "2 min", desc: "What you learned today" },
            ].map((s, i) => (
              <div key={i} style={S.timelineStep(s.color)}>
                <div style={S.timelineLabel}>{s.label}</div>
                <div style={S.timelineMin}>{s.min}</div>
                <div style={S.timelineDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: "#94A3B8", fontSize: 12, marginBottom: 0 }}>Sessions are self-paced â€” your child can pause and resume anytime. Progress is saved automatically.</p>
      </section>

      {/* â”€â”€ Parent Dashboard Preview â”€â”€ */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>What YOU see as a parent</h2>
        <p style={S.sectionSub}>Every session your child attends updates your parent dashboard in real time. No guessing whether your child studied today.</p>

        <div style={S.dashPreview}>
          <div style={S.dashTitle}>ðŸ“Š Parent Dashboard â€” Priya, Grade {gradeNum}</div>
          {/* Stats row */}
          <div style={S.dashGrid}>
            {[
              { val: "4.5 hrs", lbl: "This month", color: "#3B82F6" },
              { val: "3/8", lbl: "Chapters done", color: "#22C55E" },
              { val: "78%", lbl: "Accuracy", color: "#F97316" },
              { val: "5 days", lbl: "Streak", color: "#EF4444" },
            ].map(c => (
              <div key={c.lbl} style={S.dashCard(c.color)}>
                <div style={S.dashVal}>{c.val}</div>
                <div style={S.dashLbl}>{c.lbl}</div>
              </div>
            ))}
          </div>
          {/* Heatmap */}
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>ðŸ“… Activity â€” last 4 weeks (darker = more active)</div>
          <div style={S.heatRow}>
            {heatmap.map((v, i) => <div key={i} style={S.heatCell(v)} />)}
          </div>
          {/* Chapter table mini */}
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 12, marginBottom: 6 }}>ðŸ“š Chapter progress</div>
          {[
            { ch: "1. Nikhilam Near 100", status: "âœ… Mastered", acc: "92%", color: "#22C55E" },
            { ch: "2. Digit Sum", status: "âœ… Mastered", acc: "87%", color: "#22C55E" },
            { ch: "3. Criss-Cross", status: "âœ… Mastered", acc: "83%", color: "#22C55E" },
            { ch: "4. Multiplying by 11", status: "ðŸ”„ In Progress", acc: "71%", color: "#F97316" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F1F5F9", fontSize: 12 }}>
              <span style={{ color: "#374151" }}>{r.ch}</span>
              <span style={{ color: r.color, fontWeight: 600 }}>{r.status}</span>
              <span style={{ color: "#64748B" }}>{r.acc}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, background: "#FFF7ED", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400E" }}>
            âš ï¸ Weak area: <strong>Carries in criss-cross multiplication</strong> â€” tutor is giving extra practice automatically.
          </div>
        </div>
        <a href="/parent/dashboard" style={{ color: "#F97316", fontSize: 13, fontWeight: 600 }}>â†’ See full parent dashboard demo</a>
      </section>

      {/* â”€â”€ CBSE alignment â”€â”€ */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "14px 18px" }}>
          <span style={{ fontWeight: 700, color: "#1E40AF", fontSize: 13 }}>ðŸ“– CBSE Alignment: </span>
          <span style={{ color: "#1E3A8A", fontSize: 13 }}>{data.cbseLink}</span>
        </div>
      </section>

      {/* â”€â”€ Curriculum â”€â”€ */}
      <section id="curriculum" style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>All 8 chapters â€” what&apos;s inside</h2>
        <p style={S.sectionSub}>
          Chapter 1 is free to try right now. Chapters with â–¶ can be previewed before enrolling. All 8 unlock on enrollment.
        </p>

        {data.chapters.map((ch, i) => {
          const isOpen = openChapter === i;
          const hasDemo = !!ch.demoCode;
          const chDemoUrl = ch.demoCode ? `/ai-tutor/demo?grade=${gradeNum}&chapter=${ch.demoCode}&fresh=1` : demoUrl;
          return (
            <div key={i} style={S.chapterItem(i === 0, hasDemo)}>
              <div style={S.chapterHeader} onClick={() => setOpenChapter(isOpen ? null : i)}>
                <span style={S.chapterNum}>{i + 1}</span>
                <span style={S.chapterTitle}>{ch.title}</span>
                <span style={S.metaBadge}>{ch.duration}</span>
                {i === 0
                  ? <span style={S.freeBadge}>Free Preview</span>
                  : hasDemo
                    ? <span style={S.previewBadge}>â–¶ Preview</span>
                    : <span style={S.lockBadge}>ðŸ”’</span>
                }
                <span style={{ color: "#94A3B8", fontSize: 12 }}>{isOpen ? "â–²" : "â–¼"}</span>
              </div>
              {isOpen && (
                <div style={S.goalsBox}>
                  {ch.goals.map((g, gi) => (
                    <div key={gi} style={S.goalItem}>
                      <span style={{ color: "#22C55E", flexShrink: 0 }}>âœ“</span>
                      <span>{g}</span>
                    </div>
                  ))}
                  {(i === 0 || hasDemo) && (
                    <a href={chDemoUrl} style={{ ...S.ctaPrimary, display: "inline-block", marginTop: 10, fontSize: 13, padding: "8px 16px" }}>
                      {i === 0 ? "Start Free Preview â†’" : "â–¶ Preview this chapter â†’"}
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* â”€â”€ Pricing value framing â”€â”€ */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <div style={S.valueBox}>
          <h2 style={S.valueTitle}>Pay once â€” use forever. No renewals, ever.</h2>
          <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 24, marginTop: 0 }}>
            BYJU&apos;s charges â‚¹12,000â€“24,000 every year. We don&apos;t. One payment, lifetime access.
          </p>

          {/* Pricing cards */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
            {/* Single grade */}
            <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 14, padding: "24px 28px", minWidth: 200, flex: "1 1 200px", maxWidth: 260, textAlign: "center" }}>
              <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Single Grade</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#F1F5F9", lineHeight: 1 }}>â‚¹1,499</div>
              <div style={{ color: "#64748B", fontSize: 12, textDecoration: "line-through", marginTop: 4 }}>â‚¹2,999</div>
              <div style={{ color: "#94A3B8", fontSize: 13, margin: "12px 0" }}>Grade {gradeNum} Â· All 8 chapters Â· Lifetime</div>
              <a href={checkoutUrl} style={{ ...S.ctaPrimary, display: "block", fontSize: 14, padding: "10px 16px" }}>
                Enroll Grade {gradeNum} â†’
              </a>
            </div>

            {/* G4â€“G8 Bundle â€” highlighted */}
            <div style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", border: "2px solid #3B82F6", borderRadius: 14, padding: "24px 28px", minWidth: 200, flex: "1 1 200px", maxWidth: 260, textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#3B82F6", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>BEST VALUE</div>
              <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>All Grades Bundle</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#F1F5F9", lineHeight: 1 }}>â‚¹3,999</div>
              <div style={{ color: "#64748B", fontSize: 12, textDecoration: "line-through", marginTop: 4 }}>â‚¹9,999</div>
              <div style={{ color: "#94A3B8", fontSize: 13, margin: "12px 0" }}>Grades 4â€“8 Â· 40 chapters Â· Lifetime</div>
              <a href="/checkout/bundle-g4-g8" style={{ ...S.ctaPrimary, display: "block", fontSize: 14, padding: "10px 16px", background: "#3B82F6" }}>
                Get All Grades â†’
              </a>
            </div>

            {/* Family Bundle */}
            <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 14, padding: "24px 28px", minWidth: 200, flex: "1 1 200px", maxWidth: 260, textAlign: "center" }}>
              <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Family Bundle</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#F1F5F9", lineHeight: 1 }}>â‚¹4,999</div>
              <div style={{ color: "#64748B", fontSize: 12, textDecoration: "line-through", marginTop: 4 }}>â‚¹14,999</div>
              <div style={{ color: "#94A3B8", fontSize: 13, margin: "12px 0" }}>2 children Â· Grades 4â€“8 Â· Lifetime</div>
              <a href="/checkout/bundle-family" style={{ ...S.ctaPrimary, display: "block", fontSize: 14, padding: "10px 16px" }}>
                Family Bundle â†’
              </a>
            </div>
          </div>

          {/* vs tutor comparison */}
          <div style={S.compareRow}>
            <div style={S.compareCard(false)}>
              <div style={S.comparePrice}>â‚¹1,500</div>
              <div style={S.compareLabel}>1 private tutor session</div>
              <div style={S.compareNote}>1 hour, one topic, then it&apos;s over</div>
            </div>
            <div style={S.compareCard(true)}>
              <div style={S.comparePrice}>â‚¹1,499</div>
              <div style={S.compareLabel}>MindSutra â€” lifetime</div>
              <div style={S.compareNote}>8 chapters Â· 72 sessions Â· forever Â· AI that never gets tired</div>
            </div>
          </div>

          <div style={{ color: "#64748B", fontSize: 12, marginTop: 16 }}>30-day money-back guarantee Â· No questions asked Â· No annual renewal</div>
        </div>
      </section>

      {/* â”€â”€ Testimonials â”€â”€ */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>What parents say</h2>
        <p style={S.sectionSub}>Real results from parents across India. Not curated â€” these are the reviews we receive on WhatsApp.</p>
        <div style={S.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={S.testimonialCard}>
              <span style={S.improvBadge}>{t.improvement}</span>
              <p style={S.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div style={S.parentName}>{t.parent}</div>
              <div style={S.parentMeta}>{t.city} Â· {t.childGrade}</div>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ FAQ â”€â”€ */}
      <section style={{ ...S.section, paddingTop: 0 }}>
        <h2 style={S.sectionTitle}>Questions parents ask before enrolling</h2>
        {FAQ.map((f, i) => (
          <div key={i} style={S.faqItem}>
            <div style={S.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span style={S.faqQText}>{f.q}</span>
              <span style={S.faqChevron(openFaq === i)}>â–¼</span>
            </div>
            {openFaq === i && <div style={S.faqA}>{f.a}</div>}
          </div>
        ))}
      </section>

      {/* â”€â”€ Footer â”€â”€ */}
      <footer style={S.footer}>
        <div style={S.footerLinks}>
          {GRADES.map(g => <a key={g} href={`/vedic-math/${g}`} style={S.footerLink}>{g.replace("grade-", "Grade ")}</a>)}
          <a href="/auth/login" style={S.footerLink}>Login</a>
          <a href="https://robodynamics.in" style={S.footerLink}>About</a>
          <a href="/privacy" style={S.footerLink}>Privacy</a>
        </div>
        <p style={S.footerCopy}>Â© 2026 RoboDynamics. MindSutra is a product of RoboDynamics Pvt Ltd. 30-day money-back guaranteed.</p>
      </footer>

      {/* â”€â”€ Sticky bottom CTA â”€â”€ */}
      <div style={S.stickyBottom}>
        <div style={S.stickyLeft}>
          <span style={S.stickyPrice}>â‚¹1,499<span style={{ fontSize: 11, fontWeight: 400, color: "#94A3B8" }}> one-time</span></span>
          <span style={S.stickyOld}>â‚¹2,999</span>
        </div>
        <div style={S.stickyBtns}>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={S.waBtn}>ðŸ“± Share</a>
          <a href={checkoutUrl} style={S.enrollBtn}>Enroll Now â†’</a>
        </div>
      </div>

    </div>
  );
}



