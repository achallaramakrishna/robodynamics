import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";
import { MONEYMIND_LEVELS, getMoneyMindLevel } from "./moneyMindCatalog";

// ─── MM_L1_1 — What is Money? — Origins of the Rupee ────────────────────────

export const MM_L1_1_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_1", levelId: "L1", levelSlug: "level-1", title: "My First Money World" },
  lesson: {
    id: "MM_L1_1", order: 1, title: "What is Money?",
    sutra: "The Flow of Value",
    objective: "Understand how money started with barter and became the Rupee notes we use today.",
    durationMin: 15, difficulty: 1, xpReward: 50,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Namaste! I'm Meera. Imagine you want a chocolate but you only have a pencil. How do you get the chocolate? Before money, people swapped things! This is called Barter. Let's see how that became the Rupees in your pocket.",
      board: {
        type: "intro_card",
        data: {
          headline: "The Story of Money",
          example: "Barter: 3 Pencils = 1 Chocolate?",
          goal: "Learn how the Rupee became our magic ticket for everything.",
          assetPath: "/moneymind/l1/intro-money-history.png",
        },
      },
      actions: [{ id: "next", label: "Show me how it started", primary: true }],
    },
    {
      id: "concept", label: "Barter vs Money",
      tutorText: "Barter was hard. What if the chocolate seller didn't want pencils? Money solved this! It's a special token everyone agrees has value. In India, we have the Rupee (₹).",
      board: {
        type: "concept_card",
        data: {
          title: "The Magic Token",
          points: [
            "Barter: Trading goods for goods (Direct swap)",
            "Money: A common value token (Indirect swap)",
            "The Rupee (₹): India's official magic token"
          ],
          visual: "/moneymind/l1/barter-vs-rupee.png"
        },
      },
      explanation: {
        title: "Why Rupee?",
        body: "Because every shop in India accepts the Rupee. It's much easier than carrying 50 pencils to buy a cricket bat!",
      },
      actions: [{ id: "next", label: "Let's see real Rupees", primary: true }],
    },
    {
      id: "visual_id", label: "Know Your Notes",
      tutorText: "Look at these Indian notes. They have different colors and numbers. See Gandhi ji on every note? That tells you it's a real Indian Rupee note.",
      board: {
        type: "practice_board",
        data: {
          headline: "The Rupee Gallery",
          prompt: "Identify the ₹10, ₹20, ₹50, and ₹100 notes.",
          visual: "/moneymind/l1/rupee-notes-grid.png"
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Which color is the ₹50 note in India?",
        options: ["Chocolate Brown", "Fluorescent Blue", "Stone Grey", "Lavender"],
        answer: "Fluorescent Blue",
        hints: ["It's a bright blue color!", "Take a look at a real ₹50 note next time you go to the shop."],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "worked_example", label: "Value Math",
      tutorText: "If you have two ₹10 notes and one ₹20 note, how much total money do you have? Let's add them up: 10 + 10 + 20 = ₹40.",
      board: {
        type: "worked_example",
        data: {
          expression: "₹10 + ₹10 + ₹20",
          steps: [
            "Start with ₹10 + ₹10 = ₹20",
            "Add the other ₹20 note",
            "Total = ₹40"
          ],
          answer: 40,
        },
      },
      actions: [{ id: "next", label: "I want to try!", primary: true }],
    },
    {
      id: "practice", label: "Mission: The Canteen",
      tutorText: "You are at the school canteen. A samosa is ₹15 and a juice is ₹20. How much money do you need?",
      board: {
        type: "practice_board",
        data: {
          headline: "School Canteen Mission",
          prompt: "Add the prices of your snacks.",
          visual: "/moneymind/l1/canteen-menu.png"
        },
      },
      practice: {
        mode: "numeric",
        prompt: "Total cost for Samosa (₹15) + Juice (₹20)?",
        answer: 35,
        hints: ["10 + 20 = 30", "5 + 0 = 5", "Total = 35"],
      },
      actions: [{ id: "check", label: "Buy Snacks", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Great job! You now know that money is a tool for swapping, and you've mastered basic Rupee math. Next mission: making smart choices!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Money is a magic token that makes swapping easy.",
          remember: [
            "The Rupee (₹) is India's currency",
            "Real notes have Gandhi ji and the RBI seal",
            "Count your change carefully at the shop!"
          ],
          example: "₹10 + ₹20 = ₹30",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "Explain again" },
    { id: "explain_again", label: "See more notes" },
  ],
};

// ─── MM_L1_2 — Needs vs Wants — The Shopping Bag ────────────────────────────

export const MM_L1_2_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_1", levelId: "L1", levelSlug: "level-1", title: "My First Money World" },
  lesson: {
    id: "MM_L1_2", order: 2, title: "Needs vs Wants",
    sutra: "Priority Thinking",
    objective: "Differentiate between essentials (needs) and things that are just nice to have (wants).",
    durationMin: 15, difficulty: 1, xpReward: 50,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Arre! Sometimes we want EVERYTHING in the toy shop, but our wallet has only a little money. To be smart, we must know the difference between a NEED and a WANT.",
      board: {
        type: "mission_card",
        data: {
          headline: "The Needs vs Wants Challenge",
          challenge: "Sort the items into the correct bags!",
          visual: "/moneymind/l1/shopping-bags.png"
        },
      },
      actions: [{ id: "next", label: "Start Mission", primary: true }],
    },
    {
      id: "concept", label: "The Definitions",
      tutorText: "A NEED is something you MUST have to live (like Water or School Books). A WANT is something that is NICE to have but you can live without it (like a Video Game or Ice Cream).",
      board: {
        type: "concept_card",
        data: {
          title: "Need vs Want",
          sections: [
            { label: "NEED", items: ["Water", "Healthy Food", "School Uniform", "Medicine"], color: "#10B981" },
            { label: "WANT", items: ["Candy", "Extra Toys", "New Phone", "Cinema Ticket"], color: "#F59E0B" }
          ]
        },
      },
      actions: [{ id: "next", label: "Let's Practice Sorting", primary: true }],
    },
    {
      id: "sorting_sim", label: "Shopping Simulation",
      tutorText: "You have ₹500. Look at these items and decide: is it a Need or a Want? Be careful, your budget is limited!",
      board: {
        type: "shopping_simulation",
        data: {
          items: [
            { name: "Milk", price: 30, type: "need" },
            { name: "Fidget Spinner", price: 100, type: "want" },
            { name: "Vegetables", price: 50, type: "need" },
            { name: "Comic Book", price: 150, type: "want" }
          ],
          budget: 500
        },
      },
      practice: {
        mode: "mcq",
        prompt: "If you only have ₹100 left, and you need Milk (₹30) and want a Toy (₹80), which one should you buy first?",
        options: ["The Toy", "The Milk", "Both (it's exactly ₹110)", "None"],
        answer: "The Milk",
        hints: ["Always satisfy your NEEDS first!", "Milk is healthy and essential."],
      },
      actions: [{ id: "next", label: "Check Decision", primary: true }],
    },
    {
      id: "safety_tip", label: "Parent Permission",
      tutorText: "Whenever you want to buy something online or at a shop, always ask your parents first! They are your first money coaches.",
      board: {
        type: "concept_card",
        data: {
          title: "The Golden Rule",
          rule: "Ask before you spend!",
          visual: "/moneymind/l1/parent-talk.png"
        },
      },
      actions: [{ id: "next", label: "Final Challenge", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Smart thinking! By choosing NEEDS first, you make sure you have the important things. Next time you're at the shop with your parents, try to spot 1 Need and 1 Want!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Essentials come first. Treats come later.",
          remember: [
            "Needs: Food, Water, Learning, Health",
            "Wants: Toys, Treats, Entertainment",
            "Plan your spending based on priorities"
          ],
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "Help me choose" },
  ],
};
