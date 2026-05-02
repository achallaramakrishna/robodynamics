import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";

// ─── MM_L2_1 — What is a Bank? — The Bank Vault ───────────────────────────

export const MM_L2_1_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_1", levelId: "L2", levelSlug: "level-2", title: "Bank & ATM Explorer" },
  lesson: {
    id: "MM_L2_1", order: 1, title: "What is a Bank?",
    sutra: "Safety Haven",
    objective: "Understand the concept of a bank as a safe place for money and the role of a Bank Vault.",
    durationMin: 20, difficulty: 1, xpReward: 50,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Namaste! If you have ₹10,000, would you keep it under your pillow? Arre no! That's not safe. A Bank is like a fortress for your money. Let's see how it works.",
      board: {
        type: "intro_card",
        data: {
          headline: "Inside the Bank",
          challenge: "Learn where money goes after you deposit it.",
          visual: "/moneymind/l2/bank-building.png"
        },
      },
      actions: [{ id: "next", label: "Enter the Bank", primary: true }],
    },
    {
      id: "vault", label: "The Vault",
      tutorText: "Look at this giant iron door! This is the Vault. It's fireproof, thief-proof, and super strong. Banks keep large amounts of money here.",
      board: {
        type: "bank_simulator",
        data: {
          view: "vault_exterior",
          interactive: "open_vault",
          visual: "/moneymind/l2/bank-vault-door.png"
        },
      },
      actions: [{ id: "next", label: "Open the Vault", primary: true }],
    },
    {
      id: "account_creation", label: "Open Your Account",
      tutorText: "To keep your money here, you need a 'Key' called a Bank Account. It's like a digital box with your name on it. Let's create your first Student Savings Account!",
      board: {
        type: "bank_simulator",
        data: {
          view: "account_form",
          fields: ["Full Name", "Date of Birth", "School Name", "Initial Deposit"],
          visual: "/moneymind/l2/bank-account-form.png"
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Why do we need an ID (like Aadhaar) to open a bank account?",
        options: [
          "To prove who we are and keep the bank safe.",
          "Just for fun.",
          "Because the bank likes pictures."
        ],
        answer: "To prove who we are and keep the bank safe.",
      },
      actions: [{ id: "next", label: "Submit Application", primary: true }],
    },
    {
      id: "passbook", label: "Your Passbook",
      tutorText: "Congratulations! Your account is open. Here is your Passbook. It tracks every Rupee that goes in and out. It's your money's diary!",
      board: {
        type: "bank_simulator",
        data: {
          view: "passbook_view",
          entries: [
            { date: "11 Apr", detail: "Opening Balance", type: "CR", amount: 500 },
          ],
          visual: "/moneymind/l2/bank-passbook-visual.png"
        },
      },
      actions: [{ id: "next", label: "Deposit ₹100", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Excellent! You've learned that a bank is a safe place (Vault) and that your Passbook tracks your growth. Ready to use the ATM next?",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Banks keep money safer than piggy banks.",
          remember: [
            "Savings accounts help you grow money safely.",
            "KYC (Know Your Customer) helps banks stay safe.",
            "Always check your passbook for mistakes."
          ],
        },
      },
      actions: [{ id: "next_lesson", label: "Next: The ATM Mission", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is KYC?" },
  ],
};

// ─── MM_L2_2 — The ATM Mission — Safety and Steps ───────────────────────────

export const MM_L2_2_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_1", levelId: "L2", levelSlug: "level-2", title: "Bank & ATM Explorer" },
  lesson: {
    id: "MM_L2_2", order: 2, title: "The ATM Mission",
    sutra: "Secure Access",
    objective: "Learn the 4-step process of using an ATM and the importance of PIN secrecy.",
    durationMin: 25, difficulty: 2, xpReward: 75,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Welcome to the Bank! Have you ever seen your parents put a card into a machine and get cash out? That's an ATM (Automated Teller Machine). Today, YOU are the one using it. Ready for the mission?",
      board: {
        type: "intro_card",
        data: {
          headline: "Mission: Using the ATM",
          challenge: "Withdraw ₹500 for the school trip.",
          visual: "/moneymind/l2/atm-machine-visual.png"
        },
      },
      actions: [{ id: "next", label: "Enter the ATM area", primary: true }],
    },
    {
      id: "step_1", label: "Card & PIN",
      tutorText: "First, insert your card. Now, the machine asks for your PIN. Arre! Look around first. Is anyone watching? Always cover the keypad with your hand while typing your PIN.",
      board: {
        type: "atm_simulator",
        data: {
          screen: "ENTER PIN",
          keypadActive: true,
          safetyTip: "Cover the keypad!",
          visual: "/moneymind/l2/atm-keypad-hand.png"
        },
      },
      explanation: {
        title: "What is a PIN?",
        body: "PIN stands for Personal Identification Number. It's like a secret key to your money. NEVER share it with anyone, not even the bank staff!",
      },
      actions: [{ id: "next", label: "Typed PIN (Secretly)", primary: true }],
    },
    {
      id: "step_2", label: "Select Option",
      tutorText: "Great! The screen shows many buttons. Since we want cash, we select 'Cash Withdrawal'.",
      board: {
        type: "atm_simulator",
        data: {
          screen: "CHOOSE TRANSACTION",
          options: ["Balance Enquiry", "Cash Withdrawal", "Mini Statement", "Pin Change"],
          visual: "/moneymind/l2/atm-screen-options.png"
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Which button do you press to get physical notes?",
        options: ["Balance Enquiry", "Cash Withdrawal", "Mini Statement"],
        answer: "Cash Withdrawal",
      },
      actions: [{ id: "next", label: "Select Withdrawal", primary: true }],
    },
    {
      id: "step_3", label: "Amount",
      tutorText: "Now, type how much money you want. We need ₹500. Make sure you have enough in your account first!",
      board: {
        type: "atm_simulator",
        data: {
          screen: "ENTER AMOUNT",
          keypadActive: true,
          visual: "/moneymind/l2/atm-amount-entry.png"
        },
      },
      actions: [{ id: "next", label: "Enter 500", primary: true }],
    },
    {
      id: "step_4", label: "Take Cash",
      tutorText: "Listen... whirrr... The machine is counting the notes. Look! The cash slot is opening. Take your money and your card. Don't forget the receipt!",
      board: {
        type: "atm_simulator",
        data: {
          screen: "PLEASE TAKE YOUR CASH",
          animation: "cash_dispensing",
          visual: "/moneymind/l2/atm-cash-exit.png"
        },
      },
      actions: [{ id: "next", label: "Mission Success", primary: true }],
    },
    {
      id: "safety_quiz", label: "ATM Safety",
      tutorText: "Wait! A stranger comes and says, 'Arre beta, let me help you count the money.' What do you do?",
      board: {
        type: "scam_detector",
        data: {
          scenario: "Stranger offers help at the ATM.",
          visual: "/moneymind/l2/scam-scenario-atm.png"
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What is the safest thing to do?",
        options: [
          "Let them help, they look kind.",
          "Politely refuse and put your money away immediately.",
          "Give them your PIN to check the balance."
        ],
        answer: "Politely refuse and put your money away immediately.",
        hints: ["Never let a stranger see your money or handle your card."],
      },
      actions: [{ id: "next", label: "Stay Safe", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Sabash! You completed the ATM mission. Remember the 3 S: Stay Alert, Secret PIN, Safe Logout. You're ready for the real world!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "ATMs are convenient but need careful safety habits.",
          remember: [
            "Never share your PIN with anyone.",
            "Cover the keypad when typing.",
            "Always take your card and receipt before leaving."
          ],
        },
      },
      actions: [{ id: "finish", label: "Done", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "How to enter PIN?" },
    { id: "explain_again", label: "What is an ATM?" },
  ],
};
