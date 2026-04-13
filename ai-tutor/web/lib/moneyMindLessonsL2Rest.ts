import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";

// ─── MM_L2_3 — Deposit & Passbook ────────────────────────────────────────────

export const MM_L2_3_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_1", levelId: "L2", levelSlug: "level-2", title: "Bank & ATM Explorer" },
  lesson: {
    id: "MM_L2_3", order: 3, title: "Deposit & Passbook",
    sutra: "Track Every Rupee",
    objective: "Learn how to deposit money at a bank and read a passbook to track every transaction.",
    durationMin: 20, difficulty: 2, xpReward: 60,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Your Money Diary",
      tutorText: "When you put money into your bank account, it is called a Deposit. And every time money goes in or out, it gets written in your Passbook — like a diary for your money. Let us explore!",
      board: {
        type: "intro_card",
        data: {
          emoji: "📔",
          headline: "The Passbook: Your Money Diary",
          example: "Every deposit and withdrawal is recorded with a date and balance",
          goal: "Learn to read a passbook and calculate your running balance.",
        },
      },
      actions: [{ id: "next", label: "Open my passbook", primary: true }],
    },
    {
      id: "concept", label: "Debit vs Credit",
      tutorText: "In banking, Credit means money coming IN to your account (salary, deposit). Debit means money going OUT (ATM withdrawal, fees). Your Balance is what is left after all credits and debits.",
      board: {
        type: "concept_card",
        data: {
          title: "The Language of a Passbook",
          emoji: "📔",
          points: [
            "Credit (+): Money deposited INTO your account",
            "Debit (−): Money taken OUT of your account",
            "Balance: Credit total − Debit total = What you have",
            "Opening Balance: The amount when your account was opened",
          ],
          table: {
            headers: ["Term", "Meaning", "Example"],
            rows: [
              ["Credit", "Money IN", "Pocket money deposited: +₹500"],
              ["Debit", "Money OUT", "School fees paid: −₹800"],
              ["Balance", "What remains", "₹2,500 − ₹800 = ₹1,700"],
            ],
          },
        },
      },
      actions: [{ id: "next", label: "See a worked example", primary: true }],
    },
    {
      id: "worked_example", label: "Reading the Passbook",
      tutorText: "Let us read Arjun's passbook together. Notice how the balance changes with every entry. Can you follow the running total?",
      board: {
        type: "worked_example",
        data: {
          expression: "Arjun's January Passbook",
          steps: [
            "Jan 1 — Opening Balance: ₹2,000 (starting amount)",
            "Jan 5 — Credit ₹500 (pocket money) → Balance: ₹2,500",
            "Jan 8 — Debit ₹800 (school fees) → Balance: ₹1,700",
            "Jan 12 — Credit ₹500 (pocket money) → Balance: ₹2,200",
            "Jan 15 — Debit ₹150 (stationery) → Balance: ₹2,050",
            "Jan 19 — Credit ₹500 (pocket money) → Balance: ₹2,550",
          ],
          result: "Final Balance: ₹2,550 after 5 transactions",
        },
      },
      actions: [{ id: "next", label: "Try the digital passbook", primary: true }],
    },
    {
      id: "passbook_sim", label: "Digital Passbook",
      tutorText: "Here is your digital passbook! It shows all your transactions with running balance. You can even add a new transaction. Try adding a credit of ₹200 and see how the balance changes.",
      board: {
        type: "passbook_viewer",
        data: {},
      },
      actions: [{ id: "next", label: "Test my knowledge", primary: true }],
    },
    {
      id: "practice", label: "Quick Check",
      tutorText: "Let us see if you can calculate a running balance. Read carefully!",
      board: {
        type: "practice_board",
        data: {
          headline: "Balance Calculator",
          prompt: "Meena has ₹1,500 in her account. She deposits ₹300, then withdraws ₹450, then deposits ₹200. What is her final balance?",
        },
      },
      practice: {
        mode: "numeric",
        prompt: "1,500 + 300 − 450 + 200 = ?",
        answer: 1550,
        hints: ["After deposit: 1500 + 300 = 1800", "After withdrawal: 1800 − 450 = 1350", "After last deposit: 1350 + 200 = 1550"],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "recap", label: "Passbook Pro!",
      tutorText: "You can now read a bank passbook like a pro! Checking your passbook regularly is one of the best financial habits. It tells you exactly where your money is going.",
      board: {
        type: "recap_summary",
        data: {
          title: "Passbook Expert! 📔",
          keyPoints: [
            "Credit = money coming INTO your account",
            "Debit = money going OUT of your account",
            "Balance = Credits − Debits (running total)",
            "Check your passbook every week!",
          ],
        },
      },
      actions: [{ id: "next", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "Explain debit vs credit" },
    { id: "explain_again", label: "How is balance calculated?" },
  ],
};

// ─── MM_L2_4 — Checking vs Savings ───────────────────────────────────────────

export const MM_L2_4_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_1", levelId: "L2", levelSlug: "level-2", title: "Bank & ATM Explorer" },
  lesson: {
    id: "MM_L2_4", order: 4, title: "Checking vs Savings",
    sutra: "Right Tool, Right Job",
    objective: "Understand the difference between a savings account and a current account, and when to use each.",
    durationMin: 20, difficulty: 2, xpReward: 65,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Two Doors at the Bank",
      tutorText: "When you walk into a bank, you can open two types of accounts: a Savings Account and a Current Account. They look similar but work very differently. Choosing the right one matters!",
      board: {
        type: "intro_card",
        data: {
          emoji: "🏦",
          headline: "Two Types of Bank Accounts",
          example: "Savings Account = earn interest | Current Account = unlimited transactions",
          goal: "Understand which account type is right for which purpose.",
        },
      },
      actions: [{ id: "next", label: "Show me the difference", primary: true }],
    },
    {
      id: "concept", label: "Savings vs Current",
      tutorText: "A Savings Account is for individuals who want to grow their money slowly. A Current Account is for businesses that need to make many transactions every day. Most students and families use Savings Accounts.",
      board: {
        type: "concept_card",
        data: {
          title: "Account Type Comparison",
          emoji: "⚖️",
          points: [
            "Savings Account: Earns interest (2.5%–4% per year in India)",
            "Current Account: No interest — designed for high-frequency use",
            "Savings: Limited withdrawals per month (typically 5 free ATM uses)",
            "Current: Unlimited transactions — shopkeepers and businesses use this",
            "Savings: Lower minimum balance (₹1,000–₹5,000)",
            "Current: Higher minimum balance (₹5,000–₹25,000)",
          ],
          table: {
            headers: ["Feature", "Savings Account", "Current Account"],
            rows: [
              ["Interest", "Yes (2.5%–4%)", "No"],
              ["Users", "Individuals, Students", "Businesses, Shops"],
              ["Transactions", "Limited", "Unlimited"],
              ["Min Balance", "₹1,000–₹5,000", "₹5,000–₹25,000"],
            ],
          },
        },
      },
      actions: [{ id: "next", label: "See interest calculation", primary: true }],
    },
    {
      id: "worked_example", label: "Interest Earned",
      tutorText: "The biggest advantage of a Savings Account is interest — the bank pays YOU for keeping money there! Let us calculate how much Priya earns in a year.",
      board: {
        type: "worked_example",
        data: {
          expression: "Priya's Savings: ₹10,000 at 3.5% interest per year",
          steps: [
            "Principal (amount deposited) = ₹10,000",
            "Interest Rate = 3.5% per year",
            "Simple Interest = Principal × Rate × Time",
            "= ₹10,000 × 3.5% × 1 year",
            "= ₹10,000 × 0.035 = ₹350",
            "Total after 1 year = ₹10,000 + ₹350 = ₹10,350",
          ],
          result: "Priya earns ₹350 just by keeping money in the bank!",
        },
      },
      actions: [{ id: "next", label: "See the bank portal", primary: true }],
    },
    {
      id: "bank_explore", label: "Bank Portal",
      tutorText: "This is the Student Banking Portal. You can open a Savings Account here and see how your balance grows. Try opening an account and making a deposit!",
      board: {
        type: "bank_simulator",
        data: {},
      },
      actions: [{ id: "next", label: "Test my knowledge", primary: true }],
    },
    {
      id: "practice", label: "Quick Check",
      tutorText: "Which account should you use? Let us find out!",
      board: {
        type: "practice_board",
        data: {
          headline: "Account Type Quiz",
          prompt: "Raj has a small tea stall and makes 50 transactions every day — buying supplies, paying staff, receiving payments. Which account type should he use?",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Which account is best for Raj's high-frequency business use?",
        options: ["Savings Account", "Current Account", "Fixed Deposit", "Recurring Deposit"],
        answer: "Current Account",
        hints: ["Think about which account allows unlimited transactions", "Businesses need to transact many times a day"],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "recap", label: "Banking Expert!",
      tutorText: "Excellent! You now know the two main types of bank accounts. As a student, a Savings Account is perfect for you — it grows your money and keeps it safe. Open one as soon as you can!",
      board: {
        type: "recap_summary",
        data: {
          title: "Banking Level 2 Complete! 🏦",
          keyPoints: [
            "Savings Account earns interest — money grows over time",
            "Current Account for businesses needing unlimited transactions",
            "Students and individuals use Savings Accounts",
            "Interest = Principal × Rate × Time",
          ],
        },
      },
      actions: [{ id: "next", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "Explain interest calculation" },
    { id: "explain_again", label: "What is the difference?" },
  ],
};
