import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";

// ─── MM_L6_1 — My First Salary ────────────────────────────────────────────────

export const MM_L6_1_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_6", levelId: "L6", levelSlug: "level-6", title: "Real-World Readiness" },
  lesson: {
    id: "MM_L6_1", order: 1, title: "My First Salary",
    sutra: "Read the Slip, Know Your Money",
    objective: "Learn to read a salary slip, understand CTC vs take-home pay, and identify the major deductions in an Indian payslip.",
    durationMin: 40, difficulty: 4, xpReward: 150,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Congratulations — you just got your first job! Your offer letter says CTC ₹6,00,000/year. You expect ₹50,000/month. But your first salary slip shows ₹42,300. Where did ₹7,700 go? Today we decode the salary slip.",
      board: {
        type: "intro_card",
        data: {
          headline: "The Salary Slip Decoder",
          example: "CTC ₹6L/year ≠ Take-Home ₹50K/month. Real take-home is always lower.",
          goal: "Understand every line of your salary slip before your first job.",
          assetPath: "/moneymind/l6/salary-decoder-intro.png",
        },
      },
      actions: [{ id: "next", label: "Show me the slip!", primary: true }],
    },
    {
      id: "ctc_vs_takehome", label: "CTC vs Take-Home",
      tutorText: "CTC (Cost To Company) is what the company spends on you. Take-home is what you actually receive. The gap is filled by taxes, PF, and benefits.",
      board: {
        type: "concept_card",
        data: {
          title: "CTC Breakdown",
          points: [
            "CTC ₹6,00,000/year = ₹50,000/month (gross)",
            "Basic Pay: ₹25,000/month (50% of gross)",
            "HRA (House Rent Allowance): ₹10,000/month",
            "Special Allowance: ₹10,000/month",
            "Employer's PF Contribution: ₹3,000/month (12% of basic)",
            "Medical/Food Allowance: ₹2,000/month",
          ],
          visual: "/moneymind/l6/ctc-breakdown.png",
        },
      },
      actions: [{ id: "next", label: "Now show deductions", primary: true }],
    },
    {
      id: "deductions", label: "The Deductions",
      tutorText: "From your ₹47,000 gross (CTC minus employer PF), several deductions happen before the salary reaches your account.",
      board: {
        type: "worked_example",
        data: {
          expression: "Gross ₹47,000 → Deductions → Take-Home",
          steps: [
            "Employee PF (12% of Basic ₹25,000): -₹3,000",
            "Professional Tax (State levy): -₹200",
            "Income Tax TDS (estimated monthly): -₹1,500",
            "Total Deductions: -₹4,700",
            "Take-Home: ₹47,000 - ₹4,700 = ₹42,300",
          ],
          answer: 42300,
        },
      },
      actions: [{ id: "next", label: "Mystery solved!", primary: true }],
    },
    {
      id: "salary_sim", label: "Decode a Salary Slip",
      tutorText: "Let's use the Salary Decoder to look at a real payslip. Hover over each item to understand what it means.",
      board: {
        type: "bank_simulator",
        data: {
          view: "salary_slip",
          employee: "Arjun Mehta",
          month: "March 2026",
          earnings: [
            { label: "Basic Pay", amount: 25000 },
            { label: "HRA", amount: 10000 },
            { label: "Special Allowance", amount: 10000 },
            { label: "Medical Allowance", amount: 1250 },
            { label: "Transport Allowance", amount: 750 },
          ],
          deductions: [
            { label: "Employee PF", amount: 3000 },
            { label: "Professional Tax", amount: 200 },
            { label: "Income Tax (TDS)", amount: 1500 },
          ],
          grossEarnings: 47000,
          totalDeductions: 4700,
          netPay: 42300,
          visual: "/moneymind/l6/salary-slip-ui.png",
        },
      },
      actions: [{ id: "next", label: "Understood every line!", primary: true }],
    },
    {
      id: "tax_saving", label: "How to Legally Pay Less Tax",
      tutorText: "Smart employees reduce their tax by using Section 80C deductions. You can invest ₹1.5 lakh/year in PPF, ELSS, or EPF and not pay tax on that amount. This saves up to ₹46,800 in taxes per year!",
      board: {
        type: "concept_card",
        data: {
          title: "Section 80C Tax Saving Options",
          points: [
            "PPF (Public Provident Fund): ₹500–₹1.5L/year, 7.1% tax-free",
            "ELSS Mutual Funds: Market-linked, 3-year lock, potential 12–15%",
            "EPF (Employee Provident Fund): Auto-deducted from salary, 8.25%",
            "NSC (National Savings Certificate): Fixed 7.7%, 5-year lock",
            "Max 80C benefit: ₹1.5 lakh → Saves ₹46,800 tax (30% bracket)",
          ],
          visual: "/moneymind/l6/80c-options.png",
        },
      },
      actions: [{ id: "next", label: "I'll use Section 80C!", primary: true }],
    },
    {
      id: "salary_quiz", label: "Salary Quiz",
      tutorText: "Test your salary slip knowledge!",
      board: {
        type: "practice_board",
        data: { headline: "Salary Slip Quiz", prompt: "Choose the correct answer" },
      },
      practice: {
        mode: "mcq",
        prompt: "Your CTC is ₹8,40,000/year. Your monthly gross is ₹70,000. PF: ₹3,600, PT: ₹200, TDS: ₹3,000. What is your monthly take-home?",
        options: ["₹70,000", "₹63,200", "₹66,400", "₹60,000"],
        answer: "₹63,200",
        hints: [
          "Take-home = Gross − (PF + PT + TDS)",
          "₹70,000 − (₹3,600 + ₹200 + ₹3,000) = ₹70,000 − ₹6,800 = ₹63,200",
        ],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Salary Slip Certified! You can now read any Indian payslip, understand why take-home is less than CTC, and use Section 80C to legally reduce your taxes. This knowledge will save you lakhs over your career.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "CTC ≠ Take-home. Know your deductions and use 80C to reduce tax legally.",
          remember: [
            "CTC includes employer costs — take-home is always lower",
            "PF, Professional Tax, and TDS are the main deductions",
            "Section 80C: Invest ₹1.5L/year to save up to ₹46,800 in tax",
            "HRA can also be claimed if you pay rent — saves additional tax",
          ],
          example: "CTC ₹50,000 → Deductions ₹7,700 → Take-home ₹42,300. Use 80C → Tax reduces by ₹3,900/month",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is TDS?" },
    { id: "explain_again", label: "Show 80C options again" },
  ],
};

// ─── MM_L6_2 — The Debt Trap ──────────────────────────────────────────────────

export const MM_L6_2_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_6", levelId: "L6", levelSlug: "level-6", title: "Real-World Readiness" },
  lesson: {
    id: "MM_L6_2", order: 2, title: "The Debt Trap",
    sutra: "Borrow Smart, Repay Faster",
    objective: "Understand EMI calculations, credit card interest traps, and how to evaluate whether a loan is worth taking.",
    durationMin: 40, difficulty: 4, xpReward: 150,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Rahul bought a phone on 0% EMI for 12 months. But he also has a credit card bill he paid only the 'minimum due' on. Two years later, that ₹15,000 credit card bill became ₹28,000. How? Welcome to the debt trap.",
      board: {
        type: "intro_card",
        data: {
          headline: "The Debt Trap Warning",
          example: "₹15,000 credit card → Paying minimum due → 2 years later: ₹28,000 owed",
          goal: "Learn how debt works and how to use it wisely — not destructively.",
          assetPath: "/moneymind/l6/debt-trap-intro.png",
        },
      },
      actions: [{ id: "next", label: "Explain how this happens", primary: true }],
    },
    {
      id: "emi_basics", label: "How EMI Works",
      tutorText: "EMI (Equated Monthly Instalment) is a fixed monthly payment for a loan. The bank gives you money now; you pay it back in equal monthly parts over time — plus interest.",
      board: {
        type: "worked_example",
        data: {
          expression: "Home Loan: ₹20,00,000 at 9% for 20 years",
          steps: [
            "Loan Amount: ₹20,00,000",
            "Interest Rate: 9% per year",
            "Tenure: 20 years (240 months)",
            "Monthly EMI: ~₹17,995",
            "Total paid over 20 years: ₹43,18,800",
            "Total interest paid: ₹43,18,800 − ₹20,00,000 = ₹23,18,800",
            "You paid more than double the loan amount!",
          ],
          answer: 4318800,
        },
      },
      explanation: {
        title: "Is this always bad?",
        body: "No. A home loan at 9% can be worth it if property appreciates 8–10% annually. The key is whether the asset you're buying grows faster than the interest you pay.",
      },
      actions: [{ id: "next", label: "What about credit cards?", primary: true }],
    },
    {
      id: "credit_card_trap", label: "The Credit Card Interest Trap",
      tutorText: "Credit cards charge 36–42% annual interest! If you pay only the 'minimum due' (usually 5% of outstanding), the rest keeps compounding at this terrifying rate.",
      board: {
        type: "worked_example",
        data: {
          expression: "₹15,000 bill — paying only minimum due at 36%/year",
          steps: [
            "Month 1: ₹15,000 outstanding",
            "Minimum Due: ₹750 (5%)",
            "Interest charged: ₹15,000 × 3% = ₹450",
            "New outstanding: ₹14,700 + ₹450 = ₹15,150 (went UP!)",
            "This cycle repeats every month",
            "After 24 months paying minimum due: ~₹28,000 owed",
          ],
          answer: 28000,
        },
      },
      actions: [{ id: "next", label: "That's terrifying!", primary: true }],
    },
    {
      id: "credit_card_rules", label: "Credit Card Golden Rules",
      tutorText: "Credit cards are powerful tools — but only if used with discipline. Follow these 3 rules and they become free benefits. Break them and they become a debt trap.",
      board: {
        type: "concept_card",
        data: {
          title: "3 Credit Card Survival Rules",
          sections: [
            {
              label: "Rule 1: Pay Full Amount",
              items: ["Always pay the FULL statement amount by due date", "Never pay only 'minimum due'", "This avoids all interest charges"],
              color: "#10B981",
            },
            {
              label: "Rule 2: Never Exceed 30% Utilization",
              items: ["If limit is ₹1,00,000 — spend max ₹30,000/month", "Higher utilization hurts credit score", "Treat it like a debit card — only spend what you have"],
              color: "#3B82F6",
            },
            {
              label: "Rule 3: No Cash Advance",
              items: ["Never withdraw cash from credit card ATM", "Cash advance charges: 2.5–3% fee + 36% interest immediately", "This is the most expensive borrowing possible"],
              color: "#EF4444",
            },
          ],
        },
      },
      actions: [{ id: "next", label: "Rules memorized!", primary: true }],
    },
    {
      id: "good_debt_vs_bad_debt", label: "Good Debt vs Bad Debt",
      tutorText: "Not all debt is evil. Debt that builds an asset worth more than its interest is 'good debt'. Debt that buys depreciating goods or experiences is 'bad debt'.",
      board: {
        type: "concept_card",
        data: {
          title: "Good Debt vs Bad Debt",
          sections: [
            {
              label: "Good Debt",
              items: [
                "Home Loan: Property appreciates (8–10% vs 9% interest)",
                "Education Loan: Increases earning potential significantly",
                "Business Loan: Used to generate revenue exceeding interest",
              ],
              color: "#10B981",
            },
            {
              label: "Bad Debt",
              items: [
                "Credit Card for vacations (36% interest, zero asset)",
                "Personal loan for a wedding (high interest, no return)",
                "Buy Now Pay Later for luxury gadgets",
              ],
              color: "#EF4444",
            },
          ],
        },
      },
      actions: [{ id: "next", label: "Final debt quiz!", primary: true }],
    },
    {
      id: "debt_quiz", label: "Debt Quiz",
      tutorText: "Test your debt knowledge!",
      board: {
        type: "practice_board",
        data: { headline: "Debt IQ Quiz", prompt: "Choose the correct answer" },
      },
      practice: {
        mode: "mcq",
        prompt: "You have ₹20,000 credit card balance. Minimum due is ₹1,000. You have the money to pay full. What should you do?",
        options: [
          "Pay ₹1,000 minimum — keep the rest invested",
          "Pay the full ₹20,000 — credit card charges 36% which no investment beats",
          "Pay ₹10,000 — split the difference",
          "Ignore it — it'll sort itself out",
        ],
        answer: "Pay the full ₹20,000 — credit card charges 36% which no investment beats",
        hints: [
          "36% interest is higher than any safe investment returns",
          "Clearing high-interest debt is always the best 'investment'",
        ],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Debt Master! You now understand EMI math, the credit card minimum due trap, and the difference between good and bad debt. These lessons will protect you from the most common financial mistakes young adults make.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Always pay credit card bills in full. Never borrow for depreciating assets.",
          remember: [
            "Credit cards charge 36–42% annual interest — always pay full bill",
            "Minimum due payment is a trap — outstanding can actually grow",
            "Home and education loans = good debt (builds assets/income)",
            "Personal loans for luxuries = bad debt (high cost, no return)",
          ],
          example: "₹15,000 credit card → Pay full every month → ₹0 interest. Pay minimum → 2 years → ₹28,000 owed",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is a credit score?" },
    { id: "explain_again", label: "Show EMI calculation" },
  ],
};

// ─── MM_L6_3 — Credit Score 101 ───────────────────────────────────────────────

export const MM_L6_3_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_6", levelId: "L6", levelSlug: "level-6", title: "Real-World Readiness" },
  lesson: {
    id: "MM_L6_3", order: 3, title: "Credit Score 101",
    sutra: "Your Financial Reputation Score",
    objective: "Understand what a CIBIL/credit score is, how it is calculated, and the habits that build or destroy it.",
    durationMin: 35, difficulty: 3, xpReward: 125,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Imagine a number between 300 and 900 that determines whether banks trust you. This is your CIBIL Score — India's financial reputation number. A score above 750 gets you home loans at 7.5%. A score below 600 means rejected or 14% interest. One number, huge difference.",
      board: {
        type: "intro_card",
        data: {
          headline: "Your CIBIL Score: The Trust Number",
          example: "Score 780: Home loan at 7.5% → EMI ₹18,000/month. Score 580: Rejected or 14% → EMI ₹24,800/month. Difference: ₹6,800/month = ₹81,600/year!",
          goal: "Build and protect your credit score before you need it.",
          assetPath: "/moneymind/l6/cibil-intro.png",
        },
      },
      actions: [{ id: "next", label: "How is it calculated?", primary: true }],
    },
    {
      id: "score_factors", label: "What Builds Your Score",
      tutorText: "Your CIBIL score is calculated from your credit history. Here's what moves the needle most:",
      board: {
        type: "concept_card",
        data: {
          title: "CIBIL Score Factors",
          points: [
            "Payment History (35%): Paying all EMIs and bills ON TIME is the biggest factor",
            "Credit Utilization (30%): Keep credit card spending below 30% of limit",
            "Length of Credit History (15%): Older accounts help — don't close your first credit card",
            "Types of Credit (10%): Mix of home loan, credit card, personal loan is positive",
            "New Credit Inquiries (10%): Applying for too many loans/cards at once hurts score",
          ],
          visual: "/moneymind/l6/cibil-factors-pie.png",
        },
      },
      actions: [{ id: "next", label: "What hurts the score?", primary: true }],
    },
    {
      id: "score_killers", label: "Score Killers",
      tutorText: "These common mistakes can destroy years of credit building in a few months:",
      board: {
        type: "concept_card",
        data: {
          title: "Habits That Destroy Credit Score",
          sections: [
            {
              label: "One Late Payment",
              items: ["Even 1 missed EMI stays on your record for 3 years", "Can drop score by 50–100 points instantly"],
              color: "#EF4444",
            },
            {
              label: "Loan Settlement",
              items: ["Settling a loan for less than owed is marked 'Settled' (not 'Closed')", "'Settled' status stays for 7 years and signals financial stress"],
              color: "#EF4444",
            },
            {
              label: "Multiple Applications",
              items: ["Applying for 5 credit cards in one month = 5 hard inquiries", "Each inquiry can drop score by 5–10 points"],
              color: "#F59E0B",
            },
          ],
        },
      },
      actions: [{ id: "next", label: "How do I build a good score?", primary: true }],
    },
    {
      id: "score_building", label: "Building Credit Deliberately",
      tutorText: "You can start building credit score as a student or fresher with very simple steps. The key is to start early and never miss a payment.",
      board: {
        type: "concept_card",
        data: {
          title: "The Credit Building Roadmap",
          points: [
            "Step 1: Get a student or secured credit card (age 18+)",
            "Step 2: Use it for small monthly purchases (groceries, phone recharge)",
            "Step 3: Pay the FULL bill every month via auto-pay",
            "Step 4: Keep utilization below 30% of limit",
            "Step 5: After 6 months, check CIBIL score for free at paisabazaar.com",
            "Step 6: After 1 year of good behavior, upgrade to a rewards credit card",
          ],
          visual: "/moneymind/l6/credit-roadmap.png",
        },
      },
      actions: [{ id: "next", label: "Starting this year!", primary: true }],
    },
    {
      id: "score_quiz", label: "CIBIL Score Quiz",
      tutorText: "Final knowledge check on credit scores!",
      board: {
        type: "practice_board",
        data: { headline: "Credit Score Quiz", prompt: "Choose the correct answer" },
      },
      practice: {
        mode: "mcq",
        prompt: "Your credit card limit is ₹50,000. To maintain a healthy credit score, what's the maximum you should spend per month?",
        options: ["₹50,000 (full limit)", "₹25,000 (50%)", "₹15,000 (30%)", "₹5,000 (10%)"],
        answer: "₹15,000 (30%)",
        hints: [
          "Credit utilization should stay below 30% of your limit",
          "₹50,000 × 30% = ₹15,000 maximum for a healthy score",
        ],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Credit Score Master! Your CIBIL score is a financial superpower you build over years and can lose in one month of carelessness. Start early, pay on time, and keep utilization low.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "A 750+ CIBIL score unlocks the best loan rates — built by years of on-time payments.",
          remember: [
            "Score range: 300–900. Above 750 is excellent",
            "Payment history (35%) is the biggest factor — never miss EMIs",
            "Keep credit card spending below 30% of limit",
            "Get first credit card at 18 and build history early",
          ],
          example: "Score 780 vs 580 → ₹81,600 extra per year in home loan EMIs for the low-score person",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "How to check my CIBIL score?" },
  ],
};

// ─── MM_L6_4 — Planning for College ──────────────────────────────────────────

export const MM_L6_4_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_6", levelId: "L6", levelSlug: "level-6", title: "Real-World Readiness" },
  lesson: {
    id: "MM_L6_4", order: 4, title: "Planning for College",
    sutra: "Invest Today, Educate Tomorrow",
    objective: "Calculate the real future cost of college education with inflation, plan savings to fund it, and evaluate education loans intelligently.",
    durationMin: 45, difficulty: 4, xpReward: 175,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "An IIT degree today costs ₹9–12 lakh in fees. A private engineering college costs ₹8–15 lakh. An IIM MBA costs ₹25–30 lakh. Your child born today will face these fees after 18 years of education inflation. If you don't plan today, you face a crisis then.",
      board: {
        type: "intro_card",
        data: {
          headline: "The College Cost Crisis — Plan Now",
          example: "IIM MBA today: ₹25 lakh. With 8% education inflation, same degree in 15 years: ₹79 lakh!",
          goal: "Plan how to fund your child's education starting today.",
          assetPath: "/moneymind/l6/college-planning-intro.png",
        },
      },
      actions: [{ id: "next", label: "How do I calculate the future cost?", primary: true }],
    },
    {
      id: "future_cost_calc", label: "Education Inflation Calculator",
      tutorText: "Education costs in India inflate at ~8% annually — faster than general inflation. Let's calculate the future cost of specific colleges.",
      board: {
        type: "worked_example",
        data: {
          expression: "Future Cost = Present Cost × (1 + 8%)^Years",
          steps: [
            "IIT degree today: ₹10,00,000",
            "Education inflation: 8% per year",
            "Years until child goes to college: 15 years",
            "Future cost = ₹10,00,000 × (1.08)^15",
            "= ₹10,00,000 × 3.17",
            "= ₹31,72,169 in 15 years",
          ],
          answer: 3172169,
        },
      },
      actions: [{ id: "next", label: "How much to save monthly?", primary: true }],
    },
    {
      id: "sip_plan", label: "The SIP Solution",
      tutorText: "A SIP (Systematic Investment Plan) is investing a fixed amount every month in a Mutual Fund. Starting early, even small amounts grow to large sums.",
      board: {
        type: "worked_example",
        data: {
          expression: "SIP to build ₹32 lakh in 15 years at 12% return",
          steps: [
            "Target: ₹32,00,000",
            "Time: 15 years",
            "Expected return: 12% per year (equity mutual fund)",
            "Monthly SIP needed: ~₹7,800/month",
            "Total invested: ₹7,800 × 180 months = ₹14,04,000",
            "Return earned: ₹32,00,000 − ₹14,04,000 = ₹17,96,000",
            "Market does 56% of the work!",
          ],
          answer: 7800,
        },
      },
      actions: [{ id: "next", label: "What if parents can't save enough?", primary: true }],
    },
    {
      id: "education_loan", label: "Education Loans: When to Use Them",
      tutorText: "An education loan is not a failure — it's an investment in your future earning potential. The key is to evaluate: will this degree increase my salary enough to repay the loan comfortably?",
      board: {
        type: "concept_card",
        data: {
          title: "Education Loan: Smart Evaluation",
          sections: [
            {
              label: "Good Education Loan",
              items: [
                "IIT/IIM/NIT loan: Average salary ₹15–40 LPA → Loan ₹10–25L → Repayable in 2–4 years",
                "Moratorium period: No EMI during study + 6 months after placement",
                "Interest rate: 8.5–12% for government bank loans",
              ],
              color: "#10B981",
            },
            {
              label: "Risky Education Loan",
              items: [
                "Private college with average salary ₹4–6 LPA → Loan ₹15L → Takes 10+ years to repay",
                "Degree in low-demand field with no clear job market",
                "Private bank loans at 14–16% for unranked colleges",
              ],
              color: "#EF4444",
            },
          ],
        },
      },
      actions: [{ id: "next", label: "What about scholarships?", primary: true }],
    },
    {
      id: "scholarships", label: "Free Money: Scholarships",
      tutorText: "Scholarships are money that doesn't need to be repaid. India has hundreds of scholarships — many go unclaimed because students don't apply. This is free money you must chase.",
      board: {
        type: "concept_card",
        data: {
          title: "Major Indian Scholarships",
          points: [
            "NSP (National Scholarship Portal): Central government scholarships for SC/ST/OBC/minority",
            "PM Yasasvi Scholarship: ₹75,000–₹1.25 lakh/year for OBC/EBC students",
            "INSPIRE Scholarship (DST): ₹80,000/year for science students (top 1% in Class 12)",
            "State Merit Scholarships: Every state has merit-based scholarships — check your state portal",
            "College-specific: Many IITs, IIMs, and private colleges have need+merit scholarships",
          ],
          visual: "/moneymind/l6/scholarships-india.png",
        },
      },
      actions: [{ id: "next", label: "I'll apply for scholarships!", primary: true }],
    },
    {
      id: "college_quiz", label: "College Planning Quiz",
      tutorText: "Final quiz on college financial planning!",
      board: {
        type: "practice_board",
        data: { headline: "College Planning Quiz", prompt: "Choose the correct answer" },
      },
      practice: {
        mode: "mcq",
        prompt: "An engineering degree costs ₹8 lakh today. With 8% education inflation, approximately how much will it cost in 10 years?",
        options: ["₹9.6 lakh", "₹12.8 lakh", "₹17.3 lakh", "₹24 lakh"],
        answer: "₹17.3 lakh",
        hints: [
          "Future cost = ₹8,00,000 × (1.08)^10",
          "(1.08)^10 ≈ 2.16. So ₹8L × 2.16 = ₹17.3 lakh",
        ],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "College Planning Master — and with this, you've completed Level 6 and the entire MoneyMind journey! From understanding Rupee notes as a child to planning a college fund as an adult — you now have a complete financial literacy foundation.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Education costs double every 9 years. Start a SIP today to fund your or your child's college.",
          remember: [
            "Education inflates at ~8%/year — plan 15 years ahead",
            "SIP of ₹7,800/month for 15 years at 12% builds ₹32 lakh",
            "Education loans are fine IF the degree's salary easily covers repayment",
            "Apply for every scholarship — it's free money most students ignore",
          ],
          example: "SIP ₹7,800/month × 15 years @ 12% = ₹32 lakh college fund. Market earns ₹18L of that for free!",
        },
      },
      actions: [{ id: "finish", label: "Complete MoneyMind! 🎉", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is a SIP?" },
    { id: "explain_again", label: "How to apply for scholarships?" },
  ],
};
