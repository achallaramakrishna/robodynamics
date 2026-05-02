import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";

// ─── MM_L5_1 — Idle vs Active Money ──────────────────────────────────────────

export const MM_L5_1_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_5", levelId: "L5", levelSlug: "level-5", title: "Grow, Protect & Decide" },
  lesson: {
    id: "MM_L5_1", order: 1, title: "Idle vs Active Money",
    sutra: "Money That Works While You Sleep",
    objective: "Understand the difference between idle money (cash) and active money (invested), and discover how interest and compounding grow wealth over time.",
    durationMin: 30, difficulty: 3, xpReward: 125,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Imagine you keep ₹10,000 under your mattress for 10 years. You still have ₹10,000. But your friend puts the same ₹10,000 in a bank FD at 7%. After 10 years, she has ₹19,672. Her money grew ₹9,672 while she slept! How?",
      board: {
        type: "intro_card",
        data: {
          headline: "The Sleeping Money Problem",
          example: "₹10,000 under mattress for 10 years = ₹10,000. ₹10,000 in FD at 7% for 10 years = ₹19,672",
          goal: "Make your money work even when you're not working.",
          assetPath: "/moneymind/l5/idle-vs-active-intro.png",
        },
      },
      actions: [{ id: "next", label: "Teach me the secret!", primary: true }],
    },
    {
      id: "simple_interest", label: "Simple Interest",
      tutorText: "Simple Interest is when the bank pays you a fixed percentage on your original amount every year. If you deposit ₹1,000 at 10% per year, you earn ₹100 every year — same amount, every year.",
      board: {
        type: "worked_example",
        data: {
          expression: "Simple Interest = Principal × Rate × Time / 100",
          steps: [
            "Principal (P) = ₹1,000",
            "Rate (R) = 10% per year",
            "Time (T) = 3 years",
            "SI = 1000 × 10 × 3 / 100 = ₹300",
            "Total: ₹1,000 + ₹300 = ₹1,300",
          ],
          answer: 1300,
        },
      },
      actions: [{ id: "next", label: "Now show me compounding!", primary: true }],
    },
    {
      id: "compound_interest", label: "The Compounding Magic",
      tutorText: "Compound Interest is interest on interest. In Year 1, you earn ₹100. In Year 2, you earn interest on ₹1,100 — so you earn ₹110. In Year 3, on ₹1,210, you earn ₹121. It snowballs!",
      board: {
        type: "worked_example",
        data: {
          expression: "Compound Interest snowball",
          steps: [
            "Start: ₹1,000",
            "Year 1: ₹1,000 × 10% = +₹100 → ₹1,100",
            "Year 2: ₹1,100 × 10% = +₹110 → ₹1,210",
            "Year 3: ₹1,210 × 10% = +₹121 → ₹1,331",
            "vs Simple Interest: ₹1,300",
            "Extra earned by compounding: ₹31",
          ],
          answer: 1331,
        },
      },
      explanation: {
        title: "Why does the difference grow?",
        body: "At 3 years the difference is ₹31. At 10 years it's ₹593. At 30 years it's ₹14,974 from the same ₹1,000! This is why Warren Buffett calls compounding the 8th wonder of the world.",
      },
      actions: [{ id: "next", label: "This is incredible!", primary: true }],
    },
    {
      id: "money_garden_sim", label: "Grow Your Money Garden",
      tutorText: "Let's use the Money Garden to see how ₹5,000 grows over 20 years at different rates. Watch the tree grow!",
      board: {
        type: "upi_simulator",
        data: {
          simulatorType: "money_garden",
          principal: 5000,
          rates: [
            { label: "Savings Account", rate: 3.5, color: "#94A3B8" },
            { label: "Fixed Deposit", rate: 7.0, color: "#3B82F6" },
            { label: "Mutual Fund", rate: 12.0, color: "#10B981" },
          ],
          years: 20,
          visual: "/moneymind/l5/money-garden-sim.png",
        },
      },
      actions: [{ id: "next", label: "Wow, that's a big difference!", primary: true }],
    },
    {
      id: "quiz", label: "Compounding Quiz",
      tutorText: "Test your understanding of interest!",
      board: {
        type: "practice_board",
        data: { headline: "Compounding Knowledge Check", prompt: "Choose the correct answer" },
      },
      practice: {
        mode: "mcq",
        prompt: "₹2,000 invested at 10% compound interest for 2 years. What is the final amount?",
        options: ["₹2,400", "₹2,420", "₹2,200", "₹2,040"],
        answer: "₹2,420",
        hints: [
          "Year 1: ₹2,000 + (2,000 × 10%) = ₹2,200",
          "Year 2: ₹2,200 + (2,200 × 10%) = ₹2,420",
        ],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "start_early", label: "The Early Start Advantage",
      tutorText: "Ravi starts investing ₹500/month at age 15. Priya starts at age 25. Both invest till age 60 at 12% returns. Ravi has ₹3.2 crore. Priya has only ₹1.1 crore. Ravi invested 10 extra years and earned ₹2 crore more!",
      board: {
        type: "concept_card",
        data: {
          title: "Time is Your Biggest Asset",
          sections: [
            { label: "Ravi (starts at 15)", items: ["Invests ₹500/month for 45 years", "Total invested: ₹2.7 lakh", "Final value at 12%: ₹3.2 crore"], color: "#10B981" },
            { label: "Priya (starts at 25)", items: ["Invests ₹500/month for 35 years", "Total invested: ₹2.1 lakh", "Final value at 12%: ₹1.1 crore"], color: "#F59E0B" },
          ],
        },
      },
      actions: [{ id: "next", label: "Starting early matters!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Money growth master! You've discovered that idle money shrinks (vs inflation) and active money compounds. The earlier you start, the more powerful the growth. Even ₹100/month invested today matters!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Compounding turns small, early investments into life-changing wealth.",
          remember: [
            "Simple Interest: Fixed % on original amount every year",
            "Compound Interest: Interest on growing total — snowballs over time",
            "Starting 10 years earlier can triple your final wealth",
            "Even ₹100/month invested consistently beats ₹10,000 invested late",
          ],
          example: "₹1,000 @ 10% compounding for 30 years = ₹17,449 (vs ₹4,000 simple interest)",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "Explain compounding again" },
    { id: "explain_again", label: "What is a Fixed Deposit?" },
  ],
};

// ─── MM_L5_2 — The Inflation Monster ─────────────────────────────────────────

export const MM_L5_2_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_5", levelId: "L5", levelSlug: "level-5", title: "Grow, Protect & Decide" },
  lesson: {
    id: "MM_L5_2", order: 2, title: "The Inflation Monster",
    sutra: "Your Money Shrinks Without Growing",
    objective: "Understand inflation, its effect on purchasing power, and why investing must beat the inflation rate.",
    durationMin: 35, difficulty: 3, xpReward: 125,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "In 2010, a samosa cost ₹5. In 2024, the same samosa costs ₹20. Your grandfather's ₹500 in 2000 would buy ₹500 worth of groceries then. But that same ₹500 today buys only ₹150 worth. This silent thief is called Inflation.",
      board: {
        type: "intro_card",
        data: {
          headline: "The Invisible Money Thief",
          example: "Samosa 2000: ₹5 → 2024: ₹20. Your money lost 75% of its buying power!",
          goal: "Understand inflation and why your money must grow faster than it.",
          assetPath: "/moneymind/l5/inflation-monster-intro.png",
        },
      },
      actions: [{ id: "next", label: "Catch this thief!", primary: true }],
    },
    {
      id: "what_is_inflation", label: "What is Inflation?",
      tutorText: "Inflation is the general rise in prices over time. India's average inflation is about 6% per year. That means if something costs ₹100 today, it will cost ₹106 next year, ₹112 the year after...",
      board: {
        type: "worked_example",
        data: {
          expression: "₹100 item at 6% annual inflation",
          steps: [
            "Year 0: ₹100",
            "Year 1: ₹106",
            "Year 5: ₹133",
            "Year 10: ₹179",
            "Year 20: ₹320",
          ],
          answer: 320,
        },
      },
      actions: [{ id: "next", label: "That's a lot!", primary: true }],
    },
    {
      id: "real_return", label: "Real Return vs Nominal Return",
      tutorText: "If your bank savings account gives 4% interest but inflation is 6%, you're actually LOSING 2% purchasing power every year. The 'real return' is what matters.",
      board: {
        type: "concept_card",
        data: {
          title: "Real Return = Investment Return − Inflation",
          sections: [
            { label: "Savings Account (4%)", items: ["Return: 4%", "Inflation: 6%", "Real Return: 4% - 6% = -2%", "You're losing money in real terms"], color: "#EF4444" },
            { label: "Fixed Deposit (7%)", items: ["Return: 7%", "Inflation: 6%", "Real Return: 7% - 6% = +1%", "Barely beating inflation"], color: "#F59E0B" },
            { label: "Equity Mutual Fund (12%)", items: ["Return: 12%", "Inflation: 6%", "Real Return: 12% - 6% = +6%", "Actually growing wealth"], color: "#10B981" },
          ],
        },
      },
      actions: [{ id: "next", label: "Now I understand!", primary: true }],
    },
    {
      id: "inflation_quiz", label: "Inflation Quiz",
      tutorText: "Let's check your understanding!",
      board: {
        type: "practice_board",
        data: { headline: "Inflation Knowledge Check", prompt: "Choose the correct answer" },
      },
      practice: {
        mode: "mcq",
        prompt: "If inflation is 6% and your investment earns 5%, what is your real return?",
        options: ["+11%", "+1%", "-1%", "+5%"],
        answer: "-1%",
        hints: [
          "Real Return = Investment Return - Inflation Rate",
          "5% - 6% = -1% — you're losing buying power!",
        ],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "beat_inflation", label: "How to Beat Inflation",
      tutorText: "To beat inflation (6%) in India, your investment must earn more than 6%. Here are your options ranked by their historical returns.",
      board: {
        type: "concept_card",
        data: {
          title: "Investment Returns vs Inflation",
          points: [
            "💰 Cash under mattress: 0% — loses to inflation badly",
            "🏦 Savings Account: 3.5% — still losing vs 6% inflation",
            "📑 Fixed Deposit: 6.5–7.5% — barely beats inflation",
            "🥇 Gold: 8–10% historically — good inflation hedge",
            "📈 Equity Mutual Funds: 12–15% long-term — strong inflation beater",
            "🏠 Real Estate: 8–12% — good but requires large capital",
          ],
          visual: "/moneymind/l5/investment-ladder.png",
        },
      },
      actions: [{ id: "next", label: "I'll invest to beat inflation!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Inflation fighter! You now know that keeping money idle in a savings account means your wealth shrinks every year. To truly grow rich, you must invest in instruments that beat inflation.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Your investment return must beat inflation to actually grow your wealth.",
          remember: [
            "India's average inflation is ~6% per year",
            "Real Return = Investment Return − Inflation Rate",
            "Savings accounts (3.5%) lose to inflation — not a growth tool",
            "Gold, FD, and Equity Mutual Funds beat inflation historically",
          ],
          example: "FD at 7% - Inflation 6% = Real return of +1% only. Equity at 12% - 6% = +6% real growth",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is RBI's role in inflation?" },
    { id: "explain_again", label: "Explain real vs nominal return" },
  ],
};

// ─── MM_L5_3 — Market Garden: FD, Stocks, and Gold ───────────────────────────

export const MM_L5_3_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_5", levelId: "L5", levelSlug: "level-5", title: "Grow, Protect & Decide" },
  lesson: {
    id: "MM_L5_3", order: 3, title: "Market Garden",
    sutra: "Grow Different Seeds",
    objective: "Compare Fixed Deposits, Gold, and Stocks as investment options — understanding risk, return, and the concept of diversification.",
    durationMin: 40, difficulty: 3, xpReward: 150,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Imagine a garden. A smart farmer doesn't plant only one crop. If a storm damages wheat, he still has rice and dal. Smart investors do the same — they plant money in different investment 'seeds'. This is called Diversification.",
      board: {
        type: "intro_card",
        data: {
          headline: "The Investment Garden",
          example: "FD = stable tree, Gold = valuable shrub, Stocks = fast-growing plant",
          goal: "Learn the 3 main investment types and when to use each.",
          assetPath: "/moneymind/l5/market-garden-intro.png",
        },
      },
      actions: [{ id: "next", label: "Show me the seeds!", primary: true }],
    },
    {
      id: "fd_explained", label: "Fixed Deposit (FD)",
      tutorText: "A Fixed Deposit is like planting a banyan tree. It grows slowly but is extremely stable. You lock money for a fixed time (1–5 years) and the bank guarantees a set interest rate.",
      board: {
        type: "concept_card",
        data: {
          title: "Fixed Deposit: The Stable Tree",
          points: [
            "Return: 6.5–7.5% per year (guaranteed)",
            "Risk: Very Low — bank guarantee up to ₹5 lakh (DICGC)",
            "Liquidity: Low — penalty for early withdrawal",
            "Best for: Emergency fund, short-term savings goals",
            "Example: ₹10,000 FD for 3 years at 7% = ₹12,250",
          ],
          visual: "/moneymind/l5/fd-stable-tree.png",
        },
      },
      actions: [{ id: "next", label: "What about Gold?", primary: true }],
    },
    {
      id: "gold_explained", label: "Gold: The Inflation Shield",
      tutorText: "Gold is India's traditional wealth store. When the stock market crashes or the rupee weakens, gold prices typically rise. It's like a shield — not the fastest grower, but protects your wealth in crises.",
      board: {
        type: "concept_card",
        data: {
          title: "Gold: The Safety Shield",
          points: [
            "Return: 8–10% historically (not guaranteed)",
            "Risk: Medium — price fluctuates, but rarely crashes to zero",
            "Liquidity: High — can sell at any jewellery shop",
            "Best for: Hedging against inflation and economic crises",
            "Modern option: Sovereign Gold Bonds (SGB) — buy digitally via bank",
          ],
          visual: "/moneymind/l5/gold-shield.png",
        },
      },
      actions: [{ id: "next", label: "And stocks?", primary: true }],
    },
    {
      id: "stocks_explained", label: "Stocks: The High-Growth Plant",
      tutorText: "When you buy a stock, you buy a tiny piece of a real company — like Infosys, Reliance, or HDFC Bank. If the company profits, your stock value rises. It can grow faster than any other investment — but can also fall significantly.",
      board: {
        type: "concept_card",
        data: {
          title: "Stocks: The High-Growth Plant",
          points: [
            "Return: 12–15% historically (over 10+ year periods)",
            "Risk: High — can fall 30–50% in bad years",
            "Liquidity: Very High — sell any trading day",
            "Best for: Long-term wealth building (10+ year horizon)",
            "For beginners: Mutual Funds (a basket of many stocks) are safer than single stocks",
          ],
          visual: "/moneymind/l5/stocks-growth-plant.png",
        },
      },
      actions: [{ id: "next", label: "How do I choose?", primary: true }],
    },
    {
      id: "risk_vs_return", label: "Risk vs Return Principle",
      tutorText: "The golden rule of investing: Higher potential return always means higher risk. There is no such thing as high return with zero risk — that's always a scam!",
      board: {
        type: "practice_board",
        data: {
          headline: "The Risk-Return Ladder",
          items: [
            { investment: "Cash in hand", risk: "Zero", return: "Zero", verdict: "Loses to inflation" },
            { investment: "Savings Account", risk: "Zero", return: "3.5%", verdict: "Loses to inflation" },
            { investment: "Fixed Deposit", risk: "Very Low", return: "7%", verdict: "Barely beats inflation" },
            { investment: "Gold", risk: "Medium", return: "8–10%", verdict: "Good inflation hedge" },
            { investment: "Mutual Funds", risk: "Medium-High", return: "12%", verdict: "Best long-term growth" },
          ],
          visual: "/moneymind/l5/risk-return-ladder.png",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Someone promises 30% monthly returns with zero risk. What is this?",
        options: [
          "A great investment opportunity — sign up fast!",
          "A scam — high return + zero risk is impossible",
          "A government scheme",
          "A new fintech startup worth trying",
        ],
        answer: "A scam — high return + zero risk is impossible",
        hints: [
          "Risk and return are always linked — if risk is zero, return is minimal",
          "30% monthly = 360% per year. No legitimate investment offers that",
        ],
      },
      actions: [{ id: "next", label: "Rule locked in!", primary: true }],
    },
    {
      id: "diversification", label: "Plant All Three Seeds",
      tutorText: "A wise Indian family might split ₹1 lakh like this: ₹20k in FD (emergency), ₹20k in Gold (safety), ₹60k in Mutual Funds (growth). This way, if stocks fall, FD and Gold protect them.",
      board: {
        type: "worked_example",
        data: {
          expression: "₹1,00,000 — The Diversified Portfolio",
          steps: [
            "FD (20%): ₹20,000 → Guaranteed 7% = ₹21,400 after 1 year",
            "Gold (20%): ₹20,000 → ~9% = ₹21,800 after 1 year",
            "Mutual Funds (60%): ₹60,000 → ~12% = ₹67,200 after 1 year",
            "Total: ₹1,10,400 vs ₹1,00,000",
            "If market falls 20%, MF = ₹48,000 but FD+Gold protect ₹43,200",
          ],
          answer: 110400,
        },
      },
      actions: [{ id: "next", label: "Diversification makes sense!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Market Garden expert! You've planted the seeds of wealth knowledge. Remember: FD for safety, Gold for protection, Mutual Funds for growth. Diversify — never put all eggs in one basket!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "No single investment is best — diversify across FD, Gold, and Equity for balance.",
          remember: [
            "FD: Safe, low return, best for short-term goals",
            "Gold: Medium risk, good inflation hedge, liquid",
            "Stocks/MFs: Higher risk, best long-term return, 10+ year horizon",
            "Never invest in schemes promising high return + zero risk",
          ],
          example: "20% FD + 20% Gold + 60% Equity = Balanced growth portfolio",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is a Mutual Fund?" },
    { id: "explain_again", label: "Show risk vs return again" },
  ],
};

// ─── MM_L5_4 — Protection First: Insurance & Emergency Funds ─────────────────

export const MM_L5_4_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_5", levelId: "L5", levelSlug: "level-5", title: "Grow, Protect & Decide" },
  lesson: {
    id: "MM_L5_4", order: 4, title: "Protection First",
    sutra: "Build the Safety Net Before the Ladder",
    objective: "Understand health insurance, life insurance, and emergency funds — and why protection comes before investment.",
    durationMin: 35, difficulty: 3, xpReward: 125,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Ravi's family saved ₹5 lakh over 10 years. Then Ravi's father had a heart attack — the hospital bill was ₹4.8 lakh. Their entire savings were wiped out in 3 days. One emergency destroyed a decade of work. Insurance and emergency funds exist to prevent exactly this.",
      board: {
        type: "intro_card",
        data: {
          headline: "The Family Protection Plan",
          example: "₹5 lakh saved in 10 years. ₹4.8 lakh hospital bill in 3 days. Savings: Gone.",
          goal: "Build financial protection before building wealth.",
          assetPath: "/moneymind/l5/protection-intro.png",
        },
      },
      actions: [{ id: "next", label: "How do we prevent this?", primary: true }],
    },
    {
      id: "emergency_fund", label: "The Emergency Fund",
      tutorText: "An Emergency Fund is 3–6 months of your family's expenses kept in a liquid savings account — money you can access instantly in a crisis. It's not for investment. It's a financial shock absorber.",
      board: {
        type: "concept_card",
        data: {
          title: "Emergency Fund: Your Financial Cushion",
          points: [
            "Size: 3–6 months of monthly family expenses",
            "Example: Family spends ₹30,000/month → Emergency Fund = ₹90,000–₹1,80,000",
            "Where: Savings Account or Liquid Mutual Fund (NOT locked in FD)",
            "Rule: Touch ONLY for genuine emergencies (medical, job loss, urgent repair)",
            "Rebuild immediately after using it",
          ],
          visual: "/moneymind/l5/emergency-fund-cushion.png",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "A family spends ₹25,000/month. What should their emergency fund be?",
        options: ["₹25,000", "₹50,000–₹75,000 (2–3 months)", "₹75,000–₹1,50,000 (3–6 months)", "₹5,00,000"],
        answer: "₹75,000–₹1,50,000 (3–6 months)",
        hints: ["3–6 months of expenses is the standard recommendation", "25,000 × 3 = ₹75,000 minimum, × 6 = ₹1,50,000 ideal"],
      },
      actions: [{ id: "next", label: "Now explain insurance", primary: true }],
    },
    {
      id: "health_insurance", label: "Health Insurance",
      tutorText: "Health insurance means you pay a small yearly premium, and the insurer pays large hospital bills if you fall sick. A ₹10 lakh health policy might cost just ₹8,000–₹12,000 per year for a family. Without it, one surgery can bankrupt a family.",
      board: {
        type: "concept_card",
        data: {
          title: "Health Insurance: How It Works",
          points: [
            "Premium: ₹8,000–₹15,000/year for ₹5–10 lakh cover",
            "Cashless Hospitals: You show insurance card, hospital bills the insurer directly",
            "What it covers: Surgery, ICU, medicines during hospitalization",
            "What it usually does NOT cover: Regular checkups, dental, OPD visits",
            "ALWAYS buy before you're sick — pre-existing diseases may be excluded initially",
          ],
          visual: "/moneymind/l5/health-insurance-flow.png",
        },
      },
      actions: [{ id: "next", label: "What about life insurance?", primary: true }],
    },
    {
      id: "life_insurance", label: "Life Insurance: Protecting the Family",
      tutorText: "Life insurance pays your family a large amount if the earner passes away. A ₹1 crore term insurance plan for a 30-year-old costs just ₹8,000–₹12,000 per year. It ensures children can still study and the family doesn't lose their home.",
      board: {
        type: "concept_card",
        data: {
          title: "Term Life Insurance: The Family Shield",
          sections: [
            {
              label: "Term Insurance (Recommended)",
              items: [
                "Pure protection — no investment component",
                "₹1 crore cover for ~₹10,000/year at age 30",
                "Pays nominee full amount if insured dies during term",
                "Best value insurance available in India",
              ],
              color: "#10B981",
            },
            {
              label: "Avoid: ULIP / Endowment Plans",
              items: [
                "Mix of insurance + investment — bad at both",
                "High charges eat 30–40% of early premiums",
                "Returns often lower than FD",
                "Many families bought these thinking it's good — it's not",
              ],
              color: "#EF4444",
            },
          ],
        },
      },
      actions: [{ id: "next", label: "Term insurance it is!", primary: true }],
    },
    {
      id: "protection_order", label: "The Right Financial Order",
      tutorText: "Most people start investing before they have protection. That's backwards. Here's the correct order:",
      board: {
        type: "concept_card",
        data: {
          title: "The Financial Priority Order",
          points: [
            "Step 1: Build Emergency Fund (3–6 months expenses)",
            "Step 2: Get Health Insurance for the whole family",
            "Step 3: Get Term Life Insurance (if you have dependents)",
            "Step 4: Pay off high-interest debt (credit card, personal loan)",
            "Step 5: NOW start investing for wealth",
          ],
          visual: "/moneymind/l5/priority-order.png",
        },
      },
      actions: [{ id: "next", label: "This order makes sense!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Protection champion! Before growing money, you must protect what you have. Emergency fund + health insurance + term insurance is the safety net. Only then does wealth-building on top of it make sense.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Protection (insurance + emergency fund) must come before investment.",
          remember: [
            "Emergency fund = 3–6 months expenses in liquid account",
            "Health insurance: ₹5–10 lakh family floater for ~₹10,000/year",
            "Term life insurance: ₹1 crore for ~₹10,000/year — pure protection",
            "Avoid ULIPs and endowment plans — poor value products",
          ],
          example: "Emergency fund ₹1.5L + Health Insurance + Term Plan → Now invest the rest",
        },
      },
      actions: [{ id: "finish", label: "Complete Level 5!", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is a nominee?" },
    { id: "explain_again", label: "Show insurance types" },
  ],
};
