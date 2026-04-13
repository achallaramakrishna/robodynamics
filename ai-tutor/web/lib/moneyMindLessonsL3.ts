import type { MoneyMindLessonPayload } from "./moneyMindLessonTypes";

// ─── MM_L3_1 — Going Digital: UPI ────────────────────────────────────────────

export const MM_L3_1_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_3", levelId: "L3", levelSlug: "level-3", title: "Digital Money & Safety Lab" },
  lesson: {
    id: "MM_L3_1", order: 1, title: "Going Digital: UPI",
    sutra: "Instant Transfer",
    objective: "Understand how UPI (Unified Payments Interface) works and why India uses it more than cash.",
    durationMin: 20, difficulty: 2, xpReward: 75,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Arre! Have you noticed your parents scanning a small black-and-white square to pay at the tea stall? That's UPI — Unified Payments Interface. Today we'll discover how money travels through your phone in less than 3 seconds!",
      board: {
        type: "intro_card",
        data: {
          headline: "The UPI Revolution",
          example: "India does over 10 billion UPI transactions every month!",
          goal: "Learn how UPI connects your bank to every shop in India.",
          assetPath: "/moneymind/l3/upi-intro-banner.png",
        },
      },
      actions: [{ id: "next", label: "How does it work?", primary: true }],
    },
    {
      id: "concept", label: "How UPI Works",
      tutorText: "Think of UPI as a highway between your bank and the shopkeeper's bank. When you scan and pay ₹20 for a samosa, your bank sends ₹20 directly to the shopkeeper's bank — no cash, no delay, no middleman!",
      board: {
        type: "concept_card",
        data: {
          title: "The UPI Journey",
          points: [
            "Step 1: You open your UPI app (PhonePe, GPay, Paytm)",
            "Step 2: Scan the shopkeeper's QR code",
            "Step 3: Enter the amount and your UPI PIN",
            "Step 4: Money moves bank-to-bank in 3 seconds",
          ],
          visual: "/moneymind/l3/upi-flow-diagram.png",
        },
      },
      explanation: {
        title: "What is a VPA?",
        body: "Every UPI user has a Virtual Payment Address — like yourname@okicici or phone@paytm. It's your digital money address. No need to share your bank account number!",
      },
      actions: [{ id: "next", label: "Show me a real payment", primary: true }],
    },
    {
      id: "upi_sim", label: "Try a UPI Payment",
      tutorText: "Let's pay ₹35 for a juice at Mama's Juice Center. Open your UPI app, scan the QR, enter the amount, then your secret PIN. Ready?",
      board: {
        type: "upi_simulator",
        data: {
          merchantName: "Mama's Juice Center",
          merchantVpa: "mamas.juice@upi",
          suggestedAmount: 35,
          demoPin: "9999",
          visual: "/moneymind/l3/upi-payment-screen.png",
        },
      },
      actions: [{ id: "next", label: "Payment Done!", primary: true }],
    },
    {
      id: "quiz", label: "UPI Knowledge Check",
      tutorText: "Let's see what you've learned about UPI!",
      board: {
        type: "practice_board",
        data: {
          headline: "UPI Quick Quiz",
          prompt: "Test your UPI knowledge",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "What does UPI stand for?",
        options: [
          "Universal Payment Interface",
          "Unified Payments Interface",
          "United Pay India",
          "Universal Purchase India",
        ],
        answer: "Unified Payments Interface",
        hints: ["It was created by NPCI (National Payments Corporation of India)", "It's the system behind PhonePe, GPay, Paytm"],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "safety_note", label: "Golden Safety Rule",
      tutorText: "Meera's most important lesson: When PAYING, you enter your PIN. When RECEIVING, you NEVER need a PIN! If someone asks for your PIN to 'send you money' — it's a scam!",
      board: {
        type: "concept_card",
        data: {
          title: "PIN Rule — Never Forget",
          sections: [
            { label: "PAYING someone", items: ["You enter your UPI PIN", "Money LEAVES your account"], color: "#3B82F6" },
            { label: "RECEIVING money", items: ["No PIN needed — ever!", "If asked for PIN = SCAM"], color: "#EF4444" },
          ],
        },
      },
      actions: [{ id: "next", label: "I'll remember that!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Shabash! You've mastered the basics of UPI. Remember: UPI is fast, free, and safe — as long as you never share your PIN. Next, we'll learn how to scan QR codes safely!",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "UPI sends money bank-to-bank in 3 seconds — no cash needed.",
          remember: [
            "Your VPA (e.g. name@okicici) is your digital address",
            "PIN is only needed when YOU pay, never to receive",
            "Always verify the merchant name before confirming payment",
          ],
          example: "Scan QR → Enter Amount → Enter PIN → Done ✓",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is a QR Code?" },
    { id: "explain_again", label: "Show UPI flow again" },
  ],
};

// ─── MM_L3_2 — Scanner Pro: QR Code Safety ───────────────────────────────────

export const MM_L3_2_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_3", levelId: "L3", levelSlug: "level-3", title: "Digital Money & Safety Lab" },
  lesson: {
    id: "MM_L3_2", order: 2, title: "Scanner Pro",
    sutra: "Verify Before You Pay",
    objective: "Learn how QR codes work and how to verify a merchant before scanning.",
    durationMin: 25, difficulty: 2, xpReward: 75,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "QR codes are everywhere — from your local chai stall to Big Bazaar. But did you know that some fraudsters print FAKE QR codes and stick them over real ones? Let's become Scanner Pros who can spot the difference!",
      board: {
        type: "intro_card",
        data: {
          headline: "Mission: QR Code Detective",
          challenge: "Scan 3 QR codes and spot the fake one.",
          assetPath: "/moneymind/l3/qr-detective-intro.png",
        },
      },
      actions: [{ id: "next", label: "Start Mission", primary: true }],
    },
    {
      id: "what_is_qr", label: "What's Inside a QR?",
      tutorText: "A QR code is just a pattern of black squares that stores information — like a merchant's UPI address, name, and bank. When your phone scans it, it reads all that information automatically.",
      board: {
        type: "concept_card",
        data: {
          title: "Inside a QR Code",
          points: [
            "Merchant's UPI VPA (e.g. shop@okaxis)",
            "Business name registered with the bank",
            "Static QR: Fixed amount OR Dynamic QR: You enter amount",
          ],
          visual: "/moneymind/l3/qr-anatomy.png",
        },
      },
      actions: [{ id: "next", label: "Now spot the fake!", primary: true }],
    },
    {
      id: "fake_qr_sim", label: "The Fake QR Trap",
      tutorText: "A shopkeeper shows you a QR. You scan it and see the name 'Mumbai Chai Works'. But wait — look at the VPA. It says randomguy@ybl. That's not a real shop address! What do you do?",
      board: {
        type: "scam_detector",
        data: {
          scenario: "Scanned QR shows merchant name 'Mumbai Chai Works' but VPA is 'randomguy2345@ybl'",
          options: ["Pay immediately — the name looks right", "Check if VPA matches the shop name", "Ask the shopkeeper to explain the VPA"],
          visual: "/moneymind/l3/fake-qr-scenario.png",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "The shop name says 'Mumbai Chai Works' but the VPA is 'randomguy2345@ybl'. What's the smart move?",
        options: [
          "Pay — the shop name matches",
          "Don't pay — the VPA doesn't match the shop name",
          "Pay half amount to be safe",
          "Just give cash instead",
        ],
        answer: "Don't pay — the VPA doesn't match the shop name",
        hints: ["A real business VPA looks like: mumbaichai@okaxis or chai.works@upi", "Random personal VPAs on a shop QR are a red flag!"],
      },
      actions: [{ id: "next", label: "Good catch!", primary: true }],
    },
    {
      id: "real_vs_fake", label: "Real vs Fake QR",
      tutorText: "A fraudster sticks their QR code over the real shop QR. If you pay, the money goes to the fraudster — not the shopkeeper! Always ask the shopkeeper to confirm the name on your screen.",
      board: {
        type: "concept_card",
        data: {
          title: "Before You Pay — 3 Checks",
          sections: [
            {
              label: "SAFE Signs",
              items: [
                "Merchant name matches the shop",
                "VPA looks like a business name",
                "Amount shown matches what you owe",
              ],
              color: "#10B981",
            },
            {
              label: "DANGER Signs",
              items: [
                "Random personal names in VPA",
                "QR code looks pasted over another",
                "Merchant name is blank or generic",
              ],
              color: "#EF4444",
            },
          ],
        },
      },
      actions: [{ id: "next", label: "I'll always check!", primary: true }],
    },
    {
      id: "practice", label: "3-QR Challenge",
      tutorText: "Here are 3 QR scans. Which one is SAFE to pay?",
      board: {
        type: "practice_board",
        data: {
          headline: "QR Safety Challenge",
          prompt: "Pick the safe QR to pay",
          items: [
            { qr: "QR A", merchant: "Ravi Mobile Shop", vpa: "ravimobile@okicici", safe: true },
            { qr: "QR B", merchant: "School Canteen", vpa: "personal1234@upi", safe: false },
            { qr: "QR C", merchant: "Big Bazaar", vpa: "bigbazaar.kolkata@hdfc", safe: true },
          ],
        },
      },
      practice: {
        mode: "mcq",
        prompt: "Which QR code has a suspicious VPA?",
        options: ["QR A — ravimobile@okicici", "QR B — personal1234@upi", "QR C — bigbazaar.kolkata@hdfc"],
        answer: "QR B — personal1234@upi",
        hints: ["'personal1234' sounds like a private person, not a school canteen", "Shop VPAs should reflect the business name"],
      },
      actions: [{ id: "next", label: "Check Answer", primary: true }],
    },
    {
      id: "parent_tip", label: "Tell Your Parents",
      tutorText: "If you ever see a QR code that looks pasted on top of another one, tell your parents immediately! You could save your family from a scam. Smart kids protect smart families.",
      board: {
        type: "concept_card",
        data: {
          title: "Your Superpower: Spotting Scams",
          rule: "When in doubt, pay cash — or ask a parent.",
          visual: "/moneymind/l3/kid-hero-shield.png",
        },
      },
      actions: [{ id: "next", label: "I'll be the family protector!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Scanner Pro certified! You now know how to read a QR code and spot a fake. Always check: Merchant name ✓, VPA looks real ✓, Amount is correct ✓.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Always verify the merchant name and VPA before paying via QR.",
          remember: [
            "Check VPA matches the shop name",
            "Pasted QR codes over others are a red flag",
            "Confirm amount before tapping Pay",
          ],
          example: "Scan → Read name → Match VPA → Confirm amount → Pay",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is a VPA?" },
    { id: "explain_again", label: "Show real vs fake again" },
  ],
};

// ─── MM_L3_3 — The OTP Shield ─────────────────────────────────────────────────

export const MM_L3_3_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_3", levelId: "L3", levelSlug: "level-3", title: "Digital Money & Safety Lab" },
  lesson: {
    id: "MM_L3_3", order: 3, title: "The OTP Shield",
    sutra: "Your Secret, Your Power",
    objective: "Understand OTPs, identify scam messages, and build the habit of never sharing OTPs with anyone.",
    durationMin: 20, difficulty: 3, xpReward: 100,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Every year, thousands of Indian families lose money to OTP fraud. It usually starts with one phone call. Today we train to be OTP Shields — the family's last line of defense!",
      board: {
        type: "intro_card",
        data: {
          headline: "OTP Shield Training",
          example: "A scammer once stole ₹84,000 using just one OTP from an elderly person.",
          goal: "Learn what OTPs are and why you must NEVER share them.",
          assetPath: "/moneymind/l3/otp-shield-intro.png",
        },
      },
      actions: [{ id: "next", label: "Start Training", primary: true }],
    },
    {
      id: "what_is_otp", label: "What is an OTP?",
      tutorText: "OTP stands for One-Time Password. It's a secret 6-digit code your bank sends to your phone to confirm that YOU are making a transaction. It expires in 60 seconds and can only be used once.",
      board: {
        type: "concept_card",
        data: {
          title: "The OTP Explained",
          points: [
            "OTP = One-Time Password (6 digits)",
            "Sent by your BANK to your registered mobile",
            "Expires in 60 seconds — can only be used ONCE",
            "It's the final lock on your money",
          ],
          visual: "/moneymind/l3/otp-phone-screen.png",
        },
      },
      explanation: {
        title: "Why does the bank send OTPs?",
        body: "Because your PIN proves who you are, but your phone proves you have access right now. Needing both makes it extremely hard for thieves to steal money even if they have your PIN.",
      },
      actions: [{ id: "next", label: "Now meet the scammer", primary: true }],
    },
    {
      id: "scam_call_sim", label: "The Scam Call",
      tutorText: "Your phone rings. 'Namaste, I'm calling from SBI Bank. Your account will be blocked in 2 hours unless you verify your OTP.' They ask you to read the OTP from your phone. What do you do?",
      board: {
        type: "scam_detector",
        data: {
          scenario: "Caller claims to be from SBI. Says account will be blocked. Asks for OTP.",
          messageType: "phone_call",
          callerClaim: "SBI Bank Customer Care",
          urgencyTactic: "Your account will be blocked in 2 hours",
          visual: "/moneymind/l3/scam-call-scenario.png",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "The caller says they are from SBI and need your OTP to save your account. What's the right action?",
        options: [
          "Give the OTP quickly — the account might get blocked!",
          "Hang up immediately and call the bank's official number",
          "Give only the first 3 digits of the OTP",
          "Ask them to call back tomorrow",
        ],
        answer: "Hang up immediately and call the bank's official number",
        hints: [
          "Banks NEVER call asking for OTPs",
          "The official SBI number is 1800-11-2211 — call them directly",
        ],
      },
      actions: [{ id: "next", label: "I will NEVER share OTP", primary: true }],
    },
    {
      id: "scam_sms_sim", label: "The Fake SMS",
      tutorText: "You receive an SMS: 'Dear customer, your account is blocked. Click here to update KYC: bit.ly/sbi-kyc-update'. This looks real. Is it?",
      board: {
        type: "scam_detector",
        data: {
          scenario: "SMS claims account is blocked, asks to click a link to update KYC",
          messageType: "sms",
          senderName: "VM-SBIBNK",
          messageText: "Dear customer, your SBI account is BLOCKED. Update KYC immediately: bit.ly/sbi-kyc-update. Ignore at risk.",
          visual: "/moneymind/l3/fake-sms.png",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "This SMS says your account is blocked and asks you to click a link. What should you do?",
        options: [
          "Click the link quickly before account is blocked",
          "Forward to parents and call the bank directly — do NOT click",
          "Click and just look, don't enter anything",
          "Reply STOP to the number",
        ],
        answer: "Forward to parents and call the bank directly — do NOT click",
        hints: [
          "Official bank URLs end in .sbi.co.in or .onlinesbi.sbi — not bit.ly links",
          "Real banks never send shortened URLs for KYC",
        ],
      },
      actions: [{ id: "next", label: "Smart move!", primary: true }],
    },
    {
      id: "golden_rules", label: "The 3 OTP Rules",
      tutorText: "Let's lock in the three golden rules that will protect your family forever.",
      board: {
        type: "concept_card",
        data: {
          title: "3 OTP Golden Rules",
          sections: [
            { label: "Rule 1", items: ["NEVER share OTP with anyone — not even 'bank staff'"], color: "#EF4444" },
            { label: "Rule 2", items: ["NEVER click links in SMS/WhatsApp claiming to be your bank"], color: "#F59E0B" },
            { label: "Rule 3", items: ["If in doubt, HANG UP and call the official bank number"], color: "#10B981" },
          ],
        },
      },
      actions: [{ id: "next", label: "I've memorized them!", primary: true }],
    },
    {
      id: "family_mission", label: "Protect Your Family",
      tutorText: "Your parents and grandparents might not know these rules. Tonight, teach them what you learned. You are now the family's Cyber Security Officer!",
      board: {
        type: "mission_card",
        data: {
          headline: "Your Mission This Week",
          challenge: "Teach one family member the 3 OTP rules",
          visual: "/moneymind/l3/family-teach-mission.png",
        },
      },
      actions: [{ id: "next", label: "Mission Accepted!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "OTP Shield activated! You can now identify scam calls and fake messages. Remember: banks never ask for OTPs. Urgency is always a manipulation tactic.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Your OTP is the key to your money vault — never give it to anyone.",
          remember: [
            "OTP = One-Time Password, expires in 60 seconds",
            "Banks never call/SMS asking for your OTP",
            "Urgency + Request for OTP = Scam. Always.",
          ],
          example: "Suspicious call → Hang up → Call bank on 1800 number",
        },
      },
      actions: [{ id: "finish", label: "Complete Lesson", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is KYC fraud?" },
    { id: "explain_again", label: "Show scam types again" },
  ],
};

// ─── MM_L3_4 — Shopping Online Safely ────────────────────────────────────────

export const MM_L3_4_LESSON: MoneyMindLessonPayload = {
  product: { id: "moneymind", name: "MoneyMind" },
  course: { id: "mm_level_3", levelId: "L3", levelSlug: "level-3", title: "Digital Money & Safety Lab" },
  lesson: {
    id: "MM_L3_4", order: 4, title: "Shopping Online Safely",
    sutra: "Click Smart, Shop Safe",
    objective: "Learn to identify safe vs fake shopping sites and protect personal information while shopping online.",
    durationMin: 25, difficulty: 3, xpReward: 100,
  },
  progress: { currentStepIndex: 0, totalSteps: 7 },
  steps: [
    {
      id: "intro", label: "Intro",
      tutorText: "Online shopping on sites like Amazon, Flipkart, and Meesho is amazing — but fake shopping sites also exist that take your money and send nothing! Today we learn to shop like a detective.",
      board: {
        type: "intro_card",
        data: {
          headline: "The Online Shopping Detective",
          example: "In 2023, Indians lost ₹1,750 crore to online shopping fraud.",
          goal: "Identify safe sites and never fall for too-good deals.",
          assetPath: "/moneymind/l3/online-shop-intro.png",
        },
      },
      actions: [{ id: "next", label: "Become a Detective", primary: true }],
    },
    {
      id: "https_padlock", label: "The Green Padlock",
      tutorText: "Before buying anything online, look at the address bar in your browser. Do you see a little padlock icon and 'https://'? That means your connection is encrypted and the site is (probably) real.",
      board: {
        type: "concept_card",
        data: {
          title: "HTTPS vs HTTP",
          sections: [
            { label: "SAFE (https://)", items: ["Padlock icon shown", "Your data is encrypted", "Trusted certificate"], color: "#10B981" },
            { label: "UNSAFE (http://)", items: ["No padlock", "Your card details are exposed", "Avoid entering payment info"], color: "#EF4444" },
          ],
          visual: "/moneymind/l3/https-padlock-demo.png",
        },
      },
      actions: [{ id: "next", label: "Got it! What else?", primary: true }],
    },
    {
      id: "spot_fake_site", label: "Real vs Fake Site",
      tutorText: "A friend sends you a link: 'amazzon-india.deals — iPhone 15 at ₹999!' Wow, that's a great deal! But wait — is this the real Amazon?",
      board: {
        type: "scam_detector",
        data: {
          scenario: "Link to 'amazzon-india.deals' selling iPhone 15 for ₹999",
          url: "http://amazzon-india.deals/iphone-offer",
          messageType: "website",
          visual: "/moneymind/l3/fake-site-demo.png",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "The URL is 'amazzon-india.deals' and it's selling iPhone 15 for ₹999. Is this safe?",
        options: [
          "Yes! ₹999 for iPhone is a great deal — buy it!",
          "No — 'amazzon' is misspelled, no HTTPS, price is unrealistic",
          "Maybe — try to buy and see if it arrives",
          "It's safe if you pay via UPI",
        ],
        answer: "No — 'amazzon' is misspelled, no HTTPS, price is unrealistic",
        hints: [
          "Amazon's real URL is amazon.in — 'amazzon' is a typo trap",
          "iPhone 15 for ₹999 is impossible — prices that good are always scams",
        ],
      },
      actions: [{ id: "next", label: "Never falling for this!", primary: true }],
    },
    {
      id: "safe_payment_methods", label: "Safe Payment Methods",
      tutorText: "Even on a real site, how you pay matters. Some payment methods offer better protection than others.",
      board: {
        type: "concept_card",
        data: {
          title: "Payment Safety Ranking",
          points: [
            "✅ Best: UPI (instant, reversible if you complain fast)",
            "✅ Good: Credit Card (has fraud protection & chargeback)",
            "⚠️ Okay: Debit Card (limited protection, direct bank access)",
            "❌ Never: Bank Transfer / Wallet to a stranger (no reversal)",
          ],
          visual: "/moneymind/l3/payment-safety-pyramid.png",
        },
      },
      actions: [{ id: "next", label: "Understood!", primary: true }],
    },
    {
      id: "personal_info_rule", label: "What to Never Share",
      tutorText: "A legitimate shopping site only needs: your name, address, and payment info. If any site asks for your Aadhaar number, full bank account, or OTP — STOP immediately!",
      board: {
        type: "concept_card",
        data: {
          title: "Share vs Never Share",
          sections: [
            { label: "OK to Share", items: ["Delivery address", "Phone number for delivery updates", "Email for order confirmation"], color: "#10B981" },
            { label: "NEVER Share", items: ["Aadhaar or PAN number on shopping sites", "Full bank account number", "CVV + Expiry of card to strangers", "UPI PIN or OTP"], color: "#EF4444" },
          ],
        },
      },
      actions: [{ id: "next", label: "Final Challenge!", primary: true }],
    },
    {
      id: "final_practice", label: "Spot the Scam",
      tutorText: "Test everything you've learned!",
      board: {
        type: "practice_board",
        data: {
          headline: "Final Safety Quiz",
          prompt: "Pick the safest action",
        },
      },
      practice: {
        mode: "mcq",
        prompt: "You see a WhatsApp message: 'Free Jio recharge! Enter your Aadhaar + bank OTP at freejioo.link'. What do you do?",
        options: [
          "Click — free recharge is great!",
          "Delete the message and warn your family",
          "Enter only the Aadhaar, not the OTP",
          "Forward to 5 friends first",
        ],
        answer: "Delete the message and warn your family",
        hints: [
          "No company gives free recharges via WhatsApp links",
          "Asking for Aadhaar + OTP together is identity theft",
        ],
      },
      actions: [{ id: "next", label: "Level Complete!", primary: true }],
    },
    {
      id: "recap", label: "Recap",
      tutorText: "Online Shopping Detective — certified! You now have the skills to protect your family's money online. Remember: if a deal seems too good to be true, it always is.",
      board: {
        type: "recap_summary",
        data: {
          takeaway: "Check HTTPS, verify the URL spelling, and never share Aadhaar or OTP online.",
          remember: [
            "Look for https:// and the padlock before paying",
            "Misspelled URLs (amazzon vs amazon) are fake traps",
            "Too-good-to-be-true prices = 100% scam",
            "Never share Aadhaar or OTP on any shopping site",
          ],
          example: "See padlock ✓ → Check URL spelling ✓ → Price is realistic ✓ → Safe to buy",
        },
      },
      actions: [{ id: "finish", label: "Complete Level 3!", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck", label: "What is HTTPS?" },
    { id: "explain_again", label: "Show safe payment methods" },
  ],
};
