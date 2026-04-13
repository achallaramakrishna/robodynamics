import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";

// ─── MM_L4_1 — The Birthday Challenge ────────────────────────────────────────

export const MM_L4_1_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_4", levelId: "L4", levelSlug: "level-4", title: "Smart Spending & Budgeting" },
  lesson: {
    id: "MM_L4_1", order: 1, title: "The Birthday Challenge",
    sutra: "Plan Before You Spend",
    objective: "Plan a birthday party within a fixed budget, making trade-off decisions with limited money.",
    durationMin: 30, difficulty: 2, xpReward: 100,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Your birthday is in 3 days! Your parents gave you ₹2,000 to plan your own party. You need to buy food, decorations, and a return gift for friends. Can you make it work?",
      board: {
        type: "intro_card",
        data: {
          headline: "Birthday Party Budget Challenge",
          challenge: "Plan the best party with exactly ₹2,000",
          example: "Every rupee counts. Overspend and the party is a disaster!",
          assetPath: "/moneymind/l4/birthday-challenge-intro.png",
        },
      },
      actions: [{ id: "next", label: "Let's Plan!", primary: true }],
    },
    {
      id: "what_is_budget", label: "The Budget Concept",
      tutorText: "A budget is a spending plan. It lists what you need, how much each thing costs, and keeps a running total so you don't overspend. Today we make your birthday budget!",
      board: {
        type: "concept_card",
        data: {
          title: "What is a Budget?",
          points: [
            "Total money available = ₹2,000 (your limit)",
            "List everything you want to buy (items)",
            "Estimate costs and add them up",
            "If total > ₹2,000, you must cut something",
          ],
          visual: "/moneymind/l4/budget-concept.png",
        },
      },
      actions: [{ id: "next", label: "Start building!", primary: true }],
    },
    {
      id: "budget_sim", label: "Build the Budget",
      tutorText: "Here are your party options. Select what you want and watch the total — don't go over ₹2,000!",
      board: {
        type: "budget_planner",
        data: {
          totalBudget: 2000,
          categories: [
            {
              name: "Food & Drinks",
              items: [
                { name: "Pizza (2 boxes)", price: 600 },
                { name: "Samosas + Chutney", price: 200 },
                { name: "Cold Drinks (10)", price: 300 },
                { name: "Cake (1 kg)", price: 400 },
                { name: "Chips + Namkeen", price: 150 },
              ],
            },
            {
              name: "Decorations",
              items: [
                { name: "Balloons + Streamers", price: 150 },
                { name: "Photo Booth Props", price: 250 },
                { name: "Printed Banners", price: 200 },
              ],
            },
            {
              name: "Return Gifts (10 friends)",
              items: [
                { name: "Candy Pouches", price: 150 },
                { name: "Stationery Kits", price: 400 },
                { name: "Mini Games", price: 500 },
              ],
            },
          ],
          visual: "/moneymind/l4/budget-planner-ui.png",
        },
      },
      actions: [{ id: "next", label: "I've made my choices", primary: true }],
    },
    {
      id: "trade_off", label: "The Trade-Off Decision",
      tutorText: "Your selections total ₹2,200 — that's ₹200 over budget! You must choose: remove the Photo Booth Props (₹250) OR switch to Candy Pouches instead of Stationery Kits (saves ₹250). What's smarter?",
      board: {
        type: "practice_board",
        data: {
          headline: "Over Budget! Make a Trade-Off",
          prompt: "You are ₹200 over. Which cut makes the most sense?",
          overspend: 200,
        },
      },
      practice: {
        mode: "mcq",
        prompt: "You're ₹200 over budget. Which is the best trade-off?",
        options: [
          "Remove Photo Booth Props (₹250 saved) — friends won't miss them",
          "Switch to Candy Pouches for return gifts (₹250 saved) — everyone still gets a gift",
          "Ask parents for ₹200 more — it's just a little",
          "Cancel the cake — nobody needs cake",
        ],
        answer: "Switch to Candy Pouches for return gifts (₹250 saved) — everyone still gets a gift",
        hints: [
          "Return gifts matter to guests — better to keep those",
          "Photo Booth Props are a Want, not a Need for a party",
        ],
      },
      actions: [{ id: "next", label: "Decision made!", primary: true }],
    },
    {
      id: "tracking", label: "Track as You Spend",
      tutorText: "On party day, keep a simple tracker. Every purchase gets noted. This way you know exactly how much is left before the next shop stop.",
      board: {
        type: "concept_card",
        data: {
          title: "The Party Day Tracker",
          points: [
            "Budget: ₹2,000",
            "Cake bought: -₹400 → Remaining: ₹1,600",
            "Pizza bought: -₹600 → Remaining: ₹1,000",
            "Decorations: -₹150 → Remaining: ₹850",
            "Return Gifts: -₹150 → Remaining: ₹700",
            "Cold Drinks: -₹300 → Remaining: ₹400 💰",
          ],
          visual: "/moneymind/l4/spending-tracker.png",
        },
      },
      actions: [{ id: "next", label: "Smart tracking!", primary: true }],
    },
    {
      id: "savings_tip", label: "Save the Leftover",
      tutorText: "If you have leftover money from your budget, don't rush to spend it. Put it in your savings goal! Small savings from many occasions add up over a year.",
      board: {
        type: "concept_card",
        data: {
          title: "Leftover Money = Future Money",
          rule: "Unspent budget goes into savings, not random spending.",
          visual: "/moneymind/l4/leftover-savings.png",
        },
      },
      actions: [{ id: "next", label: "I'll save the rest!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Party planning master! You made a real budget, handled a trade-off, and tracked spending. These same skills apply when you're 25 planning a family vacation or 35 planning home renovation.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Always plan before you spend — a budget is your spending map.",
          remember: [
            "List everything first, then add up the total",
            "If over budget, cut Wants before cutting Needs",
            "Track every spend on the day",
            "Save any leftover — don't waste it",
          ],
          example: "₹2,000 budget → ₹1,600 spent → ₹400 saved ✓",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is a trade-off?" },
    { id: "explain_again", label: "Show budget example" },
  ],
};

// ─── MM_L4_2 — Smart Shopper: Online vs Offline ───────────────────────────────

export const MM_L4_2_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_4", levelId: "L4", levelSlug: "level-4", title: "Smart Spending & Budgeting" },
  lesson: {
    id: "MM_L4_2", order: 2, title: "Smart Shopper",
    sutra: "Compare Before You Buy",
    objective: "Learn to compare prices across online and offline channels and calculate the true cost of a purchase.",
    durationMin: 30, difficulty: 2, xpReward: 100,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Your school bag is torn and you need a new one. Your mother says ₹800 is the budget. You found it at the local shop for ₹850 and on Amazon for ₹720 with ₹50 delivery. Which is cheaper?",
      board: {
        type: "intro_card",
        data: {
          headline: "The Smart Shopper Challenge",
          challenge: "Find the true cheapest option before buying",
          assetPath: "/moneymind/l4/smart-shopper-intro.png",
        },
      },
      actions: [{ id: "next", label: "Let me calculate!", primary: true }],
    },
    {
      id: "true_cost", label: "The True Cost",
      tutorText: "The 'true cost' is the total you pay, including delivery, taxes, or travel. Let's calculate the school bag example.",
      board: {
        type: "worked_example",
        data: {
          expression: "Online: ₹720 + ₹50 delivery = ₹770 vs Offline: ₹850",
          steps: [
            "Online price: ₹720",
            "Add delivery: + ₹50",
            "Online total: ₹770",
            "Offline price: ₹850 (no delivery needed)",
            "Savings: ₹850 - ₹770 = ₹80 cheaper online ✓",
          ],
          answer: 770,
        },
      },
      actions: [{ id: "next", label: "I get it!", primary: true }],
    },
    {
      id: "comparison_quiz", label: "Comparison Practice",
      tutorText: "Pencil box at Stationery Store: ₹120. On Flipkart: ₹95 + ₹40 delivery. Which is cheaper?",
      board: {
        type: "practice_board",
        data: {
          headline: "Price Comparison Quiz",
          prompt: "Calculate the true cost of both options",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Pencil box costs ₹120 at shop. On Flipkart ₹95 + ₹40 delivery. Which is cheaper?",
        options: [
          "Flipkart — ₹95 is less than ₹120",
          "Shop — total online cost is ₹135 vs ₹120",
          "They cost the same",
          "Cannot tell without more info",
        ],
        answer: "Shop — total online cost is ₹135 vs ₹120",
        hints: ["Always add delivery before comparing", "₹95 + ₹40 = ₹135, which is more than ₹120"],
      },
      actions: [{ id: "next", label: "Shop wins this one!", primary: true }],
    },
    {
      id: "other_factors", label: "Beyond Price",
      tutorText: "Price isn't everything. Sometimes the shop wins for other reasons — and sometimes online wins even with delivery.",
      board: {
        type: "concept_card",
        data: {
          title: "Smart Shopper Checklist",
          sections: [
            {
              label: "Online Wins When:",
              items: [
                "Same product, meaningfully cheaper after delivery",
                "Product not available locally",
                "Return policy is easy",
              ],
              color: "#3B82F6",
            },
            {
              label: "Local Shop Wins When:",
              items: [
                "Price difference is small (under ₹50)",
                "You need it today",
                "Quality needs to be checked (clothes, food)",
              ],
              color: "#10B981",
            },
          ],
        },
      },
      actions: [{ id: "next", label: "Makes total sense!", primary: true }],
    },
    {
      id: "sale_traps", label: "Sale Trap Warning",
      tutorText: "'50% OFF! Original ₹2,000 — Now ₹1,000!' Sounds amazing — but was the item ever really ₹2,000? Many online platforms inflate the 'original price' to make the discount look bigger. Always check the price history!",
      board: {
        type: "scam_detector",
        data: {
          scenario: "'50% Sale! MRP ₹2,000 → Now ₹1,000' — but the item sells for ₹1,000 normally",
          messageType: "website",
          visual: "/moneymind/l4/fake-sale-trap.png",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "An item is 'on sale' for ₹1,000 from ₹2,000. How do you verify if the discount is real?",
        options: [
          "Trust the site — they can't lie",
          "Check the item's price history on a comparison site or CamelCamelCamel",
          "Buy it quick before the sale ends",
          "Ask your friend if they've seen the item before",
        ],
        answer: "Check the item's price history on a comparison site or CamelCamelCamel",
        hints: [
          "Sites like PriceHistory.in show if an item's price was actually inflated before sale",
          "Genuine sales are rare — most 'original prices' are exaggerated",
        ],
      },
      actions: [{ id: "next", label: "I'll always verify!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Smart Shopper certified! You can now calculate true costs, spot fake sales, and choose between online vs offline wisely. These skills save thousands of rupees every year!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Always add delivery to online prices before comparing with shop prices.",
          remember: [
            "True cost = product price + delivery charges",
            "If savings < ₹50, local shop is often better",
            "Sale discounts are often inflated — check price history",
            "Never buy in urgency — sales always come back",
          ],
          example: "Online ₹720 + ₹50 delivery = ₹770 vs Shop ₹850 → Online saves ₹80 ✓",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is true cost?" },
  ],
};

// ─── MM_L4_3 — Subscription Traps ────────────────────────────────────────────

export const MM_L4_3_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_4", levelId: "L4", levelSlug: "level-4", title: "Smart Spending & Budgeting" },
  lesson: {
    id: "MM_L4_3", order: 3, title: "Subscription Traps",
    sutra: "Cancel What You Don't Use",
    objective: "Track recurring subscriptions, calculate their annual cost, and decide which to keep vs cancel.",
    durationMin: 25, difficulty: 2, xpReward: 100,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Your family pays for Netflix, YouTube Premium, Hotstar, a gaming pass, and Spotify. That's 5 subscriptions! Do you know how much that is every year? Most families have no idea — and pay for things they barely use.",
      board: {
        type: "intro_card",
        data: {
          headline: "The Subscription Audit",
          challenge: "Find out which subscriptions your family actually uses",
          assetPath: "/moneymind/l4/subscription-traps-intro.png",
        },
      },
      actions: [{ id: "next", label: "Show me the numbers", primary: true }],
    },
    {
      id: "annual_calc", label: "The Annual Cost Shock",
      tutorText: "₹199 per month sounds small. But multiply by 12 and it's ₹2,388 per year. Now multiply by 5 subscriptions... that's over ₹12,000! Let's do the maths.",
      board: {
        type: "worked_example",
        data: {
          expression: "₹199/month × 12 months = ₹2,388/year",
          steps: [
            "Netflix: ₹649/month × 12 = ₹7,788/year",
            "Hotstar: ₹299/month × 12 = ₹3,588/year",
            "Spotify: ₹119/month × 12 = ₹1,428/year",
            "Gaming Pass: ₹179/month × 12 = ₹2,148/year",
            "Total: ₹14,952/year — that's a new bicycle!",
          ],
          answer: 14952,
        },
      },
      actions: [{ id: "next", label: "That's shocking!", primary: true }],
    },
    {
      id: "usage_audit", label: "The Usage Audit",
      tutorText: "The key question isn't 'How much does it cost?' but 'How much do we actually use it?' Rate each subscription by weekly usage.",
      board: {
        type: "budget_planner",
        data: {
          headline: "Rate Your Subscriptions",
          totalBudget: 14952,
          items: [
            { name: "Netflix", monthlyCost: 649, usageRating: "Daily" },
            { name: "Hotstar", monthlyCost: 299, usageRating: "Only during IPL" },
            { name: "Spotify", monthlyCost: 119, usageRating: "Daily" },
            { name: "Gaming Pass", monthlyCost: 179, usageRating: "Rarely" },
            { name: "YouTube Premium", monthlyCost: 189, usageRating: "Sometimes" },
          ],
          visual: "/moneymind/l4/subscription-audit-ui.png",
        },
      },
      actions: [{ id: "next", label: "I've rated them", primary: true }],
    },
    {
      id: "cut_decision", label: "Keep vs Cancel",
      tutorText: "Based on usage, which subscriptions should stay and which should go?",
      board: {
        type: "practice_board",
        data: {
          headline: "Cut or Keep?",
          prompt: "Decide which subscriptions to cancel",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Hotstar is used only during IPL (2 months/year). What's the smartest move?",
        options: [
          "Keep the annual plan — it's cheaper per month",
          "Cancel and subscribe only during IPL season (2 months)",
          "Keep it — we might use it more someday",
          "Switch to a cheaper streaming service",
        ],
        answer: "Cancel and subscribe only during IPL season (2 months)",
        hints: [
          "2 months × ₹299 = ₹598 vs 12 months × ₹299 = ₹3,588",
          "Subscribing only when needed saves ₹2,990 every year!",
        ],
      },
      actions: [{ id: "next", label: "₹2,990 saved!", primary: true }],
    },
    {
      id: "free_trial_trap", label: "The Free Trial Trap",
      tutorText: "'Free for 30 days — no credit card needed!' Sounds perfect. But many apps auto-charge after trial. Always set a reminder to cancel before day 30 if you don't want to keep it.",
      board: {
        type: "concept_card",
        data: {
          title: "Free Trial Survival Rules",
          points: [
            "Set a phone reminder for Day 25 of any free trial",
            "Check payment method linked — remove if you don't trust",
            "Read if trial auto-converts to paid",
            "Cancel before Day 30 if you don't want to pay",
          ],
          visual: "/moneymind/l4/free-trial-trap.png",
        },
      },
      actions: [{ id: "next", label: "Setting reminder now!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Subscription detective! You now know how to audit, calculate annual costs, and decide what to keep. Do this review with your family every 6 months — it can save ₹5,000+ per year!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Monthly fees feel small — annual totals are shocking. Audit every 6 months.",
          remember: [
            "Multiply monthly cost × 12 to see annual impact",
            "Cancel subscriptions used less than once a week",
            "Subscribe to seasonal services (IPL, cricket) only in season",
            "Always set reminders for free trial end dates",
          ],
          example: "Cancel 2 unused subs → Save ₹5,000+/year → That's a family trip!",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "How to cancel subscriptions?" },
  ],
};

// ─── MM_L4_4 — Family Grocery Planner ────────────────────────────────────────

export const MM_L4_4_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_4", levelId: "L4", levelSlug: "level-4", title: "Smart Spending & Budgeting" },
  lesson: {
    id: "MM_L4_4", order: 4, title: "Family Grocery Planner",
    sutra: "Plan the List, Save the Wallet",
    objective: "Plan a weekly grocery list, compare branded vs generic options, and optimize a ₹3,000 weekly budget.",
    durationMin: 30, difficulty: 3, xpReward: 125,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Every weekend your family spends at Big Bazaar. Without a list, they overspend by ₹500–₹800 every time. Today, you're the Family CFO (Chief Financial Officer) who plans the perfect ₹3,000 grocery run!",
      board: {
        type: "intro_card",
        data: {
          headline: "Family CFO Mission: The Grocery Run",
          challenge: "Optimize the weekly grocery budget to ₹3,000",
          assetPath: "/moneymind/l4/grocery-planner-intro.png",
        },
      },
      actions: [{ id: "next", label: "I'll plan the list!", primary: true }],
    },
    {
      id: "list_first_rule", label: "List First Rule",
      tutorText: "Rule 1 of grocery shopping: Never enter the store without a list. Why? Because shops are designed to make you buy more than you need. Bright lights, tempting placement, and discount stickers are all marketing tricks.",
      board: {
        type: "concept_card",
        data: {
          title: "How Shops Make You Overspend",
          points: [
            "Essential items (milk, bread) placed at the BACK so you walk past everything",
            "Sweets and snacks placed at eye-level for children",
            "'3 for ₹99' deals make you buy 3 when you need 1",
            "Checkout counter filled with last-minute temptations",
          ],
          visual: "/moneymind/l4/supermarket-tricks.png",
        },
      },
      actions: [{ id: "next", label: "Clever! Now let's plan", primary: true }],
    },
    {
      id: "branded_vs_generic", label: "Brand vs Generic",
      tutorText: "Branded atta (wheat flour) costs ₹55/kg. The store's own brand costs ₹38/kg. They come from the same factory — just different packaging. Buying generic saves 30–40% on staples!",
      board: {
        type: "worked_example",
        data: {
          expression: "Branded Atta ₹55/kg vs Store Brand ₹38/kg",
          steps: [
            "Family uses 10kg atta per month",
            "Branded: 10 × ₹55 = ₹550/month",
            "Store Brand: 10 × ₹38 = ₹380/month",
            "Monthly saving: ₹170",
            "Annual saving: ₹170 × 12 = ₹2,040 per year!",
          ],
          answer: 2040,
        },
      },
      actions: [{ id: "next", label: "Switching to store brand!", primary: true }],
    },
    {
      id: "grocery_sim", label: "Build the Grocery List",
      tutorText: "Here is your week's grocery requirement. Choose between branded and generic options and stay under ₹3,000!",
      board: {
        type: "budget_planner",
        data: {
          totalBudget: 3000,
          categories: [
            {
              name: "Staples",
              items: [
                { name: "Atta 5kg (Branded)", price: 275, generic: { name: "Atta 5kg (Store Brand)", price: 190 } },
                { name: "Rice 5kg (Branded)", price: 350, generic: { name: "Rice 5kg (Store Brand)", price: 260 } },
                { name: "Dal 1kg (Branded)", price: 140, generic: { name: "Dal 1kg (Store Brand)", price: 110 } },
              ],
            },
            {
              name: "Dairy & Eggs",
              items: [
                { name: "Milk 5L (Amul)", price: 310 },
                { name: "Eggs (12 pack)", price: 96 },
                { name: "Curd 500g", price: 65 },
              ],
            },
            {
              name: "Vegetables & Fruits",
              items: [
                { name: "Onion 2kg", price: 60 },
                { name: "Tomato 1kg", price: 40 },
                { name: "Seasonal Fruits", price: 200 },
              ],
            },
            {
              name: "Snacks (Wants)",
              items: [
                { name: "Biscuits Pack", price: 120 },
                { name: "Chips (2 packs)", price: 80 },
                { name: "Soft Drinks (2L)", price: 90 },
              ],
            },
          ],
          visual: "/moneymind/l4/grocery-planner-ui.png",
        },
      },
      actions: [{ id: "next", label: "Cart ready!", primary: true }],
    },
    {
      id: "bulk_vs_small", label: "Bulk Buying Logic",
      tutorText: "Buying in bulk saves money — but only if you'll actually use it before it expires! Rice and dal last 6 months, so bulk buying is great. Fresh vegetables last 3 days, so never bulk buy those.",
      board: {
        type: "concept_card",
        data: {
          title: "Bulk Buy: Yes or No?",
          sections: [
            { label: "Bulk Buy ✅", items: ["Rice, Atta, Dal, Sugar, Salt", "Soap, Shampoo, Washing Powder", "Canned goods, Packaged snacks"], color: "#10B981" },
            { label: "Never Bulk Buy ❌", items: ["Fresh vegetables and fruits", "Bread and fresh dairy", "Anything you don't use weekly"], color: "#EF4444" },
          ],
        },
      },
      actions: [{ id: "next", label: "Smart strategy!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Family CFO mission complete! You've saved ₹400+ by switching to store brands and planning ahead. These small decisions across a family add up to ₹30,000+ in savings per year!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "A grocery list + store brands + no impulse buying = massive yearly savings.",
          remember: [
            "Always enter the shop with a written list",
            "Store brand staples are as good as branded, 30–40% cheaper",
            "Bulk buy non-perishables only, never fresh produce",
            "Avoid the '3 for ₹99' trap if you only need 1",
          ],
          example: "₹3,000 budget → ₹2,600 spent → ₹400 saved → ₹20,800 saved per year ✓",
        },
      },
      actions: [{ id: "finish", label: "Complete Level 4!", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is a generic brand?" },
    { id: "explain_again", label: "Show bulk buying rules" },
  ],
};
