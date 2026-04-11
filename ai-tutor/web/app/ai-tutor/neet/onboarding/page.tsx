"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveProfileToDb, loadProfileFromDb, getStudentStatus, type StudentProfile, type NeetSubject } from "../../../../lib/neetPlanEngine";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  from: "meera" | "user";
  text: string;
  time: string;
}

type OnboardingStep =
  | "greeting" | "name" | "target_year" | "repeater"
  | "coaching" | "hours" | "self_rating" | "fear" | "done";

// ─── NEET dates ───────────────────────────────────────────────────────────────
const NEET_DATES: Record<number, string> = {
  2025: "2025-05-04",
  2026: "2026-05-03",
  2027: "2027-05-02",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function now(): string {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 14px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#8B5CF6",
          animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
    </div>
  );
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.from === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12, gap: 8, alignItems: "flex-end" }}>
      {!isUser && (
        <img src="/rd-logo.png" alt="MEERA" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "contain", background: "#fff", flexShrink: 0 }} />
      )}
      <div style={{
        maxWidth: "72%", padding: "10px 14px", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser ? "#7C3AED" : "#1E293B",
        color: "#F8FAFC", fontSize: 14, lineHeight: 1.6,
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }}>
        <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
        <div style={{ fontSize: 10, color: isUser ? "rgba(255,255,255,0.5)" : "#475569", marginTop: 4, textAlign: "right" }}>{msg.time}</div>
      </div>
    </div>
  );
}

// ─── Quick-reply chips ────────────────────────────────────────────────────────
function Chips({ options, onSelect }: { options: { label: string; value: string }[]; onSelect: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "8px 0" }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onSelect(o.value)}
          style={{ padding: "8px 16px", borderRadius: 20, background: "#1E293B", border: "1px solid #8B5CF6", color: "#C4B5FD", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "#7C3AED"; (e.target as HTMLButtonElement).style.color = "#fff"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "#1E293B"; (e.target as HTMLButtonElement).style.color = "#C4B5FD"; }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ subject, value, onChange }: { subject: string; value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Very Weak", "Weak", "Average", "Good", "Strong"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ color: "#94A3B8", fontSize: 13, width: 80 }}>{subject}</span>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
            style={{ fontSize: 22, cursor: "pointer", color: star <= (hover || value) ? "#F59E0B" : "#334155", transition: "color 0.1s" }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: 11, color: "#64748B" }}>{labels[hover || value] || ""}</span>
    </div>
  );
}

// ─── Main Onboarding Page ─────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<OnboardingStep>("greeting");
  const [inputText, setInputText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const [chips, setChips] = useState<{ label: string; value: string }[]>([]);
  const [showRatings, setShowRatings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Profile state
  const [studentName, setStudentName] = useState("");
  const [targetYear, setTargetYear] = useState(0);
  const [isRepeater, setIsRepeater] = useState(false);
  const [goesToCoaching, setGoesToCoaching] = useState(false);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [selfRating, setSelfRating] = useState<Record<NeetSubject, number>>({ physics: 3, chemistry: 3, biology: 3 });
  const [biggestFear, setBiggestFear] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showChips, showRatings, showInput]);

  const addMessage = (from: "meera" | "user", text: string) => {
    setMessages((prev) => [...prev, { from, text, time: now() }]);
  };

  const meeraTypeThen = async (text: string, delayMs = 900) => {
    setIsTyping(true);
    await delay(delayMs);
    setIsTyping(false);
    addMessage("meera", text);
  };

  // ── Start the conversation ─────────────────────────────────────────────────
  useEffect(() => {
    const greet = async () => {
      const { registered } = await getStudentStatus();
      if (registered) {
        // Pre-load name from DB registration
        const profile = await loadProfileFromDb();
        const name = profile?.name?.split(" ")[0] || "there";
        setStudentName(name);
        await meeraTypeThen(`Namaste, ${name}! 🙏 I'm MEERA — your personal NEET AI Tutor from RoboDynamics.`, 800);
        await meeraTypeThen("I just need a few more details to build your personalised study plan. This takes about 2 minutes!", 1000);
        await meeraTypeThen("Which year are you targeting for NEET?", 800);
        setChips([
          { label: "NEET 2025", value: "2025" },
          { label: "NEET 2026", value: "2026" },
          { label: "NEET 2027", value: "2027" },
        ]);
        setShowChips(true);
        setStep("target_year");
      } else {
        await meeraTypeThen("Namaste! 🙏 I'm MEERA — your personal NEET AI Tutor from RoboDynamics.", 800);
        await meeraTypeThen("Before we start, I want to *know you* — not just your syllabus. This takes just 2 minutes and helps me build a plan that's truly yours.", 1200);
        await meeraTypeThen("What's your name? 😊", 800);
        setShowInput(true);
        setStep("name");
      }
    };
    greet();
  }, []);

  // ── Handle user reply ──────────────────────────────────────────────────────
  const handleUserInput = async (value: string) => {
    if (!value.trim()) return;
    addMessage("user", value);
    setInputText("");
    setShowInput(false);
    setShowChips(false);
    setShowRatings(false);

    switch (step) {
      case "name": {
        const name = value.trim().split(" ")[0];
        setStudentName(name);
        await meeraTypeThen(`Great to meet you, ${name}! 🌟`, 600);
        await meeraTypeThen("Which year are you targeting for NEET?", 800);
        setChips([
          { label: "NEET 2025", value: "2025" },
          { label: "NEET 2026", value: "2026" },
          { label: "NEET 2027", value: "2027" },
        ]);
        setShowChips(true);
        setStep("target_year");
        break;
      }
      case "target_year": {
        const yr = parseInt(value);
        setTargetYear(yr);
        const days = Math.ceil((new Date(NEET_DATES[yr] || "2027-05-02").getTime() - Date.now()) / 86400000);
        await meeraTypeThen(`${yr}! That gives us ${days} days. Every day counts 💪`, 800);
        await meeraTypeThen("Is this your first attempt at NEET, or are you a repeater?", 900);
        setChips([
          { label: "First attempt (Fresher)", value: "fresher" },
          { label: "Repeater (already appeared)", value: "repeater" },
        ]);
        setShowChips(true);
        setStep("repeater");
        break;
      }
      case "repeater": {
        const rep = value === "repeater";
        setIsRepeater(rep);
        if (rep) {
          await meeraTypeThen("Respect for trying again — that takes courage. 🫡 Most NEET toppers are repeaters. This time, we'll be more strategic.", 1200);
        } else {
          await meeraTypeThen("Exciting! First attempt means you have the most to gain. Let's build your plan from scratch. 🚀", 1000);
        }
        await meeraTypeThen("Are you attending any coaching institute right now?", 800);
        setChips([
          { label: "Yes, I go to coaching", value: "yes" },
          { label: "No, self-study only", value: "no" },
        ]);
        setShowChips(true);
        setStep("coaching");
        break;
      }
      case "coaching": {
        const coaching = value === "yes";
        setGoesToCoaching(coaching);
        if (coaching) {
          await meeraTypeThen("Perfect! I'll work alongside your coaching — think of me as your doubt-clearing and daily practice partner. 📚", 1000);
        } else {
          await meeraTypeThen("Self-study students often do better with the right plan. I'll be your full-time tutor. 💡", 900);
        }
        await meeraTypeThen("How many hours per day can you realistically give to NEET preparation? (Be honest — I'll plan around your real schedule)", 1100);
        setChips([
          { label: "1–2 hours", value: "1.5" },
          { label: "2–3 hours", value: "2.5" },
          { label: "3–5 hours", value: "4" },
          { label: "5+ hours", value: "6" },
        ]);
        setShowChips(true);
        setStep("hours");
        break;
      }
      case "hours": {
        const hrs = parseFloat(value);
        setHoursPerDay(hrs);
        await meeraTypeThen(`${hrs} hours/day — I'll build a realistic plan around that. Quality over quantity! ⏰`, 800);
        await meeraTypeThen("Now, rate yourself honestly in each subject. This helps me know where to focus first:", 900);
        setShowRatings(true);
        setStep("self_rating");
        break;
      }
      case "self_rating": {
        // value is JSON string of ratings
        const ratings = JSON.parse(value) as Record<NeetSubject, number>;
        setSelfRating(ratings);
        const weakest = (Object.entries(ratings) as [NeetSubject, number][]).sort((a, b) => a[1] - b[1])[0];
        const strongest = (Object.entries(ratings) as [NeetSubject, number][]).sort((a, b) => b[1] - a[1])[0];
        await meeraTypeThen(`Got it! Strongest in ${strongest[0]}, needs work in ${weakest[0]}. My plan will reflect this. 📊`, 1000);
        await meeraTypeThen("Last question — and this one matters most to me: What's your biggest fear or worry about NEET?", 1100);
        setChips([
          { label: "Not finishing syllabus on time", value: "syllabus" },
          { label: "Forgetting what I study", value: "retention" },
          { label: "Getting nervous in the exam", value: "anxiety" },
          { label: "Physics / Maths calculations", value: "calculations" },
          { label: "Not getting a good college", value: "college" },
        ]);
        setShowChips(true);
        setStep("fear");
        break;
      }
      case "fear": {
        setBiggestFear(value);
        const fearResponses: Record<string, string> = {
          syllabus:     "Syllabus overload is real — but with a smart plan, we cover what matters most. I'll prioritise every session for you. 📅",
          retention:    "Forgetting is normal. I use spaced repetition — we'll revisit concepts at exactly the right time so they stick. 🧠",
          anxiety:      "Exam nerves are natural. Mock tests with me will make the real exam feel familiar. You'll walk in confident. 💪",
          calculations: "Physics and Chemistry calculations become easy with the right shortcuts. I'll show you NEET-specific tricks. ⚡",
          college:      "Getting a good college is 100% achievable with the right strategy. Let's make that happen together. 🏥",
        };
        await meeraTypeThen(fearResponses[value] || "That's a valid concern. I've got you — we'll tackle it together. 🤝", 1000);
        await meeraTypeThen("That's everything I need. Give me a moment to build your personal NEET plan... ✨", 900);
        setStep("done");

        // Build and save profile
        const yr = targetYear || 2027;
        const profile: StudentProfile = {
          name: studentName,
          targetYear: yr,
          neetDate: NEET_DATES[yr] || "2027-05-02",
          hoursPerDay: hoursPerDay,
          goesToCoaching,
          isRepeater,
          biggestFear: value,
          selfRating,
          createdAt: new Date().toISOString(),
        };
        await saveProfileToDb(profile);  // DB state drives routing — no localStorage flag needed

        await delay(1500);
        await meeraTypeThen(`Your personalised plan is ready, ${studentName}! 🎉\n\nFirst step: a quick 45-question diagnostic test. It takes 30 minutes and helps me understand exactly where you are today. No pressure — just answer honestly!`, 1200);
        await delay(1200);
        await meeraTypeThen("Ready? Let's find out your baseline score! 🚀", 800);

        await delay(1000);
        router.push("/ai-tutor/neet/diagnostic");
        break;
      }
    }
  };

  // ── Ratings submit ─────────────────────────────────────────────────────────
  const [tempRatings, setTempRatings] = useState<Record<NeetSubject, number>>({ physics: 3, chemistry: 3, biology: 3 });
  const handleRatingSubmit = () => {
    const display = `Physics: ${"★".repeat(tempRatings.physics)}  Chemistry: ${"★".repeat(tempRatings.chemistry)}  Biology: ${"★".repeat(tempRatings.biology)}`;
    handleUserInput(JSON.stringify(tempRatings));
    setShowRatings(false);
  };

  return (
    <div style={{ height: "100vh", background: "#0F172A", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1E293B; } ::-webkit-scrollbar-thumb { background: #475569; border-radius: 2px; }`}</style>

      {/* Header */}
      <div style={{ background: "#1E293B", borderBottom: "1px solid #334155", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <img src="/rd-logo.png" alt="RoboDynamics" style={{ height: 34, objectFit: "contain" }} />
        <div>
          <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 15 }}>MEERA</div>
          <div style={{ color: "#10B981", fontSize: 11, fontWeight: 600 }}>● NEET AI Tutor · RoboDynamics</div>
        </div>
        <div style={{ marginLeft: "auto", color: "#475569", fontSize: 12 }}>Onboarding · 2 min</div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {messages.map((m, i) => <Bubble key={i} msg={m} />)}

        {isTyping && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 12 }}>
            <img src="/rd-logo.png" alt="MEERA" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "contain", background: "#fff" }} />
            <div style={{ background: "#1E293B", borderRadius: "16px 16px 16px 4px" }}><TypingDots /></div>
          </div>
        )}

        {/* Star ratings UI */}
        {showRatings && !isTyping && (
          <div style={{ background: "#1E293B", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #334155" }}>
            <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 12, fontWeight: 600 }}>Rate your confidence in each subject (1 = very weak, 5 = strong):</div>
            {(["Physics", "Chemistry", "Biology"] as const).map((s) => (
              <StarRating key={s} subject={s} value={tempRatings[s.toLowerCase() as NeetSubject]}
                onChange={(v) => setTempRatings((prev) => ({ ...prev, [s.toLowerCase()]: v }))} />
            ))}
            <button onClick={handleRatingSubmit}
              style={{ marginTop: 12, width: "100%", padding: "10px 0", background: "#7C3AED", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              Submit Ratings →
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ borderTop: "1px solid #1E293B", padding: "10px 16px 16px", background: "#0F172A", flexShrink: 0 }}>
        {showChips && !isTyping && (
          <Chips options={chips} onSelect={handleUserInput} />
        )}
        {showInput && !isTyping && (
          <div style={{ display: "flex", gap: 8, marginTop: showChips ? 8 : 0 }}>
            <input
              autoFocus
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUserInput(inputText)}
              placeholder="Type your answer…"
              style={{ flex: 1, background: "#1E293B", border: "1px solid #334155", borderRadius: 24, padding: "10px 16px", color: "#F8FAFC", fontSize: 14, outline: "none" }}
            />
            <button onClick={() => handleUserInput(inputText)}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#7C3AED", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
