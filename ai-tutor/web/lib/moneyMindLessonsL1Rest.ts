import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";

// ─── MM_L1_3 — Saving for a Goal ─────────────────────────────────────────────

export const MM_L1_3_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_1", levelId: "L1", levelSlug: "level-1", title: "My First Money World" },
  lesson: {
    id: "MM_L1_3", order: 3, title: "Saving for a Goal",
    sutra: "Delayed Gratification",
    objective: "Learn how to set a savings goal and track weekly progress until you reach it.",
    durationMin: 15, difficulty: 1, xpReward: 50,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "The Cricket Bat Mission",
      tutorText: "Arjun wants a cricket bat that costs ₹850. He only has ₹150 in his piggy bank. His parents give him ₹100 every week as pocket money. Can he save up? Let's help him plan!",
      board: {
        type: "intro_card",
        data: {
          emoji: "🏏",
          headline: "Save for the Cricket Bat!",
          example: "Goal: ₹850  |  Have: ₹150  |  Weekly allowance: ₹100",
          goal: "Calculate how many weeks Arjun needs to save to buy the cricket bat.",
        },
      },
      actions: [{ id: "next", label: "Help Arjun plan!", primary: true }],
    },
    {
      id: "concept", label: "Why Saving Works",
      tutorText: "Saving means keeping some money aside instead of spending it all. Every week you save a little, it adds up to something big! Three rules: Earn → Spend Less → Save the Rest.",
      board: {
        type: "concept_card",
        data: {
          title: "The Saving Formula",
          emoji: "💰",
          points: [
            "Income: Money you receive (pocket money, gifts)",
            "Expense: Money you spend (canteen, stationery)",
            "Savings = Income − Expense",
            "Goal Amount ÷ Weekly Savings = Weeks to reach goal",
          ],
        },
      },
      explanation: {
        title: "The Magic of Waiting",
        body: "Waiting to buy something you really want builds patience. And buying it with YOUR saved money feels incredible!",
      },
      actions: [{ id: "next", label: "Show me the maths", primary: true }],
    },
    {
      id: "worked_example", label: "Savings Maths",
      tutorText: "Arjun has ₹150 saved. He needs ₹850. He gets ₹100/week and decides to save all of it. Let's calculate exactly how many weeks he needs.",
      board: {
        type: "worked_example",
        data: {
          expression: "₹850 − ₹150 = ₹700 still needed",
          steps: [
            "Money still needed = ₹850 (goal) − ₹150 (already saved) = ₹700",
            "Arjun saves the full ₹100 each week",
            "Weeks needed = ₹700 ÷ ₹100 = 7 weeks",
            "In 7 weeks, Arjun can buy his cricket bat! 🏏",
          ],
          result: "7 weeks of saving = Cricket bat achieved!",
        },
      },
      actions: [{ id: "next", label: "See the tracker", primary: true }],
    },
    {
      id: "goal_tracker", label: "Goal Tracker",
      tutorText: "Here is a savings goal tracker. See how each week of saving brings Arjun closer to his cricket bat. Small, consistent savings add up fast!",
      board: {
        type: "budget_planner",
        data: {
          headline: "Cricket Bat Savings Tracker",
          budget: 850,
          challenge: "7 weeks × ₹100/week savings gets Arjun to his goal",
          items: [
            { name: "Starting savings", cost: 150 },
            { name: "Week 1 — save ₹100", cost: 100 },
            { name: "Week 2 — save ₹100", cost: 100 },
            { name: "Week 3 — save ₹100", cost: 100 },
            { name: "Week 4 — save ₹100", cost: 100 },
            { name: "Week 5 — save ₹100", cost: 100 },
            { name: "Week 6 — save ₹100", cost: 100 },
            { name: "Week 7 — save ₹100", cost: 100 },
          ],
        },
      },
      actions: [{ id: "next", label: "Test my knowledge", primary: true }],
    },
    {
      id: "practice", label: "Quick Check",
      tutorText: "Let's check if you understand the savings formula. Read carefully and calculate!",
      board: {
        type: "practice_board",
        data: {
          headline: "Savings Challenge",
          prompt: "Priya gets ₹200 pocket money per week. She spends ₹120 every week. She wants to buy a book that costs ₹320. How many weeks does she need to save?",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Priya saves ₹80/week (₹200 − ₹120). Weeks needed = ₹320 ÷ ₹80 = ?",
        answer: 4,
        hints: ["Savings per week = ₹200 − ₹120 = ₹80", "Weeks = ₹320 ÷ ₹80"],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "recap", label: "Goal Saver!",
      tutorText: "Amazing work! You now know the most important money habit: saving for a goal. This skill will take you from a cricket bat today to a car tomorrow!",
      board: {
        type: "recap_summary",
        data: {
          title: "You are a Goal Saver! 🏏",
          keyPoints: [
            "Savings = Income − Expenses",
            "Set a clear goal with a price tag",
            "Goal ÷ Weekly Savings = Weeks to wait",
            "Track progress every single week",
          ],
        },
      },
      actions: [{ id: "next", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "Help me calculate" },
    { id: "explain_again", label: "Explain savings again" },
  ],
};

// ─── MM_L1_4 — The Pocket Money Manager ──────────────────────────────────────

export const MM_L1_4_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_1", levelId: "L1", levelSlug: "level-1", title: "My First Money World" },
  lesson: {
    id: "MM_L1_4", order: 4, title: "The Pocket Money Manager",
    sutra: "Spend with Intention",
    objective: "Build a simple weekly budget, track what you spend, and discover how to save more.",
    durationMin: 20, difficulty: 1, xpReward: 60,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Your Money, Your Choices",
      tutorText: "You get ₹500 pocket money this week. How will you spend it? Smart kids do not spend randomly — they plan! A budget is just a spending plan. Let's build yours.",
      board: {
        type: "intro_card",
        data: {
          emoji: "💼",
          headline: "Your Weekly Budget: ₹500",
          example: "Canteen + Stationery + Fun + Savings = ₹500",
          goal: "Build a budget that lets you save at least ₹100 this week.",
        },
      },
      actions: [{ id: "next", label: "Build my budget", primary: true }],
    },
    {
      id: "concept", label: "Income, Expense & Savings",
      tutorText: "Every rupee you get is Income. Every rupee you spend is an Expense. What is left is Savings. A good budget decides BEFORE you spend — not after!",
      board: {
        type: "concept_card",
        data: {
          title: "The Budget Triangle",
          emoji: "📊",
          points: [
            "Income: Money coming IN (pocket money, Diwali gifts)",
            "Fixed Expense: Same every week (school transport, lunch)",
            "Variable Expense: Changes week to week (snacks, games)",
            "Savings: What is left — aim for at least 20%!",
          ],
        },
      },
      explanation: {
        title: "The 50-30-20 Rule (Kid Version!)",
        body: "50% for needs, 30% for wants, 20% for savings. On ₹500: ₹250 needs + ₹150 wants + ₹100 savings.",
      },
      actions: [{ id: "next", label: "See an example", primary: true }],
    },
    {
      id: "worked_example", label: "Ravi's Budget",
      tutorText: "Let's look at Ravi's budget for this week. He gets ₹500. Can you spot how much he saved?",
      board: {
        type: "worked_example",
        data: {
          expression: "Ravi's Week — ₹500 income",
          steps: [
            "School canteen: ₹80 (packed lunch 4 days!)",
            "Stationery: ₹50 (new pencil set)",
            "Gaming credits: ₹100 (online game)",
            "Snacks with friends: ₹70",
            "Transport: ₹60 (auto fare)",
            "Total spent: ₹360  →  Savings: ₹500 − ₹360 = ₹140 (28%!) ✅",
          ],
          result: "Ravi saved ₹140 (28%) — well above the 20% target!",
        },
      },
      actions: [{ id: "next", label: "Build my own budget", primary: true }],
    },
    {
      id: "planner", label: "Pocket Money Planner",
      tutorText: "Now it is your turn! Use this interactive budget planner. Adjust the amounts in each category and watch your savings change in real time. Try to save at least ₹100!",
      board: {
        type: "pocket_money_planner",
        data: { weeklyAllowance: 500 },
      },
      actions: [{ id: "next", label: "Test my knowledge", primary: true }],
    },
    {
      id: "practice", label: "Quick Check",
      tutorText: "Great work with the planner! Now a quick question to make sure you have the budget formula.",
      board: {
        type: "practice_board",
        data: {
          headline: "Budget Maths",
          prompt: "Sneha earns ₹600/week. She spends ₹180 on food, ₹90 on transport, and ₹150 on games. How much does she save?",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Total expenses = ₹180 + ₹90 + ₹150. Savings = ₹600 − Total expenses = ?",
        answer: 180,
        hints: ["Add all expenses: 180 + 90 + 150 = 420", "Savings = 600 − 420 = 180"],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "recap", label: "Budget Master!",
      tutorText: "You are now a pocket money manager! Budgeting is a superpower most adults never learn properly. You are already ahead of the game!",
      board: {
        type: "recap_summary",
        data: {
          title: "Budget Champion! 💼",
          keyPoints: [
            "Income − Expenses = Savings",
            "Aim to save at least 20% of your income",
            "Plan your budget BEFORE you spend",
            "Cut variable expenses to save more",
          ],
        },
      },
      actions: [{ id: "next", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "Help me budget" },
    { id: "explain_again", label: "Explain the formula" },
  ],
};
