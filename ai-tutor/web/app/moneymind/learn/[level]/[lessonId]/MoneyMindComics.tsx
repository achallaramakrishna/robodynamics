"use client";

import { useEffect, useState } from "react";

// ─── Character SVG Faces ───────────────────────────────────────────────────────
type Expression = "happy" | "confused" | "excited" | "thinking" | "proud" | "sad" | "wow" | "celebrating";

function CharacterFace({
  name, expression, size = 64,
}: { name: "rahul" | "priya" | "arjun" | "ravi"; expression: Expression; size?: number }) {
  const s = size;
  const half = s / 2;

  // Eye shapes per expression
  const eyes: Record<Expression, JSX.Element> = {
    happy:       <><ellipse cx={half - s*0.14} cy={half - s*0.06} rx={s*0.07} ry={s*0.05} fill="#1E293B"/><ellipse cx={half + s*0.14} cy={half - s*0.06} rx={s*0.07} ry={s*0.05} fill="#1E293B"/></>,
    confused:    <><circle cx={half - s*0.14} cy={half - s*0.06} r={s*0.07} fill="#1E293B"/><circle cx={half + s*0.14} cy={half - s*0.06} r={s*0.07} fill="#1E293B"/><line x1={half-s*0.08} y1={half-s*0.16} x2={half-s*0.2} y2={half-s*0.12} stroke="#1E293B" strokeWidth={s*0.025} strokeLinecap="round"/></>,
    excited:     <><circle cx={half - s*0.14} cy={half - s*0.06} r={s*0.09} fill="#1E293B"/><circle cx={half + s*0.14} cy={half - s*0.06} r={s*0.09} fill="#1E293B"/><circle cx={half-s*0.11} cy={half-s*0.09} r={s*0.025} fill="#fff"/><circle cx={half+s*0.17} cy={half-s*0.09} r={s*0.025} fill="#fff"/></>,
    thinking:    <><ellipse cx={half - s*0.14} cy={half - s*0.06} rx={s*0.07} ry={s*0.045} fill="#1E293B"/><ellipse cx={half + s*0.14} cy={half - s*0.08} rx={s*0.07} ry={s*0.045} fill="#1E293B"/><line x1={half+s*0.08} y1={half-s*0.16} x2={half+s*0.2} y2={half-s*0.12} stroke="#1E293B" strokeWidth={s*0.025} strokeLinecap="round"/></>,
    proud:       <><ellipse cx={half - s*0.14} cy={half - s*0.06} rx={s*0.07} ry={s*0.04} fill="#1E293B"/><ellipse cx={half + s*0.14} cy={half - s*0.06} rx={s*0.07} ry={s*0.04} fill="#1E293B"/></>,
    sad:         <><ellipse cx={half - s*0.14} cy={half - s*0.04} rx={s*0.07} ry={s*0.05} fill="#1E293B"/><ellipse cx={half + s*0.14} cy={half - s*0.04} rx={s*0.07} ry={s*0.05} fill="#1E293B"/></>,
    wow:         <><circle cx={half - s*0.14} cy={half - s*0.06} r={s*0.1} fill="#1E293B"/><circle cx={half + s*0.14} cy={half - s*0.06} r={s*0.1} fill="#1E293B"/><circle cx={half-s*0.1} cy={half-s*0.1} r={s*0.03} fill="#fff"/><circle cx={half+s*0.18} cy={half-s*0.1} r={s*0.03} fill="#fff"/></>,
    celebrating: <><path d={`M${half-s*0.21} ${half-s*0.06} Q${half-s*0.14} ${half-s*0.14} ${half-s*0.07} ${half-s*0.06}`} fill="none" stroke="#1E293B" strokeWidth={s*0.04} strokeLinecap="round"/><path d={`M${half+s*0.07} ${half-s*0.06} Q${half+s*0.14} ${half-s*0.14} ${half+s*0.21} ${half-s*0.06}`} fill="none" stroke="#1E293B" strokeWidth={s*0.04} strokeLinecap="round"/></>,
  };

  // Mouth shapes per expression
  const mouths: Record<Expression, JSX.Element> = {
    happy:       <path d={`M${half-s*0.16} ${half+s*0.08} Q${half} ${half+s*0.22} ${half+s*0.16} ${half+s*0.08}`} fill="none" stroke="#1E293B" strokeWidth={s*0.04} strokeLinecap="round"/>,
    confused:    <path d={`M${half-s*0.12} ${half+s*0.12} Q${half} ${half+s*0.08} ${half+s*0.12} ${half+s*0.14}`} fill="none" stroke="#1E293B" strokeWidth={s*0.04} strokeLinecap="round"/>,
    excited:     <ellipse cx={half} cy={half+s*0.14} rx={s*0.14} ry={s*0.1} fill="#EF4444"/>,
    thinking:    <path d={`M${half-s*0.1} ${half+s*0.14} Q${half} ${half+s*0.12} ${half+s*0.1} ${half+s*0.14}`} fill="none" stroke="#1E293B" strokeWidth={s*0.035} strokeLinecap="round"/>,
    proud:       <path d={`M${half-s*0.16} ${half+s*0.1} Q${half} ${half+s*0.22} ${half+s*0.16} ${half+s*0.1}`} fill="none" stroke="#1E293B" strokeWidth={s*0.045} strokeLinecap="round"/>,
    sad:         <path d={`M${half-s*0.14} ${half+s*0.16} Q${half} ${half+s*0.06} ${half+s*0.14} ${half+s*0.16}`} fill="none" stroke="#1E293B" strokeWidth={s*0.04} strokeLinecap="round"/>,
    wow:         <ellipse cx={half} cy={half+s*0.16} rx={s*0.1} ry={s*0.13} fill="#1E293B"/>,
    celebrating: <path d={`M${half-s*0.18} ${half+s*0.08} Q${half} ${half+s*0.26} ${half+s*0.18} ${half+s*0.08}`} fill="none" stroke="#1E293B" strokeWidth={s*0.05} strokeLinecap="round"/>,
  };

  // Skin tone
  const skin = name === "priya" ? "#E8B89A" : name === "ravi" ? "#C68642" : "#D4956A";
  // Hair color
  const hair = name === "ravi" ? "#2C1810" : "#1A0A00";
  // Shirt color
  const shirt: Record<string, string> = { rahul: "#3B82F6", priya: "#EC4899", arjun: "#10B981", ravi: "#8B5CF6" };

  // Cheek blush for excited/celebrating
  const blush = (expression === "excited" || expression === "celebrating" || expression === "happy") ? (
    <><ellipse cx={half-s*0.22} cy={half+s*0.04} rx={s*0.08} ry={s*0.05} fill="#FCA5A5" opacity=".5"/><ellipse cx={half+s*0.22} cy={half+s*0.04} rx={s*0.08} ry={s*0.05} fill="#FCA5A5" opacity=".5"/></>
  ) : null;

  return (
    <svg width={s} height={s * 1.2} viewBox={`0 0 ${s} ${s * 1.2}`} style={{ overflow: "visible" }}>
      {/* Shirt / body */}
      <path d={`M${half-s*0.28} ${s*1.15} L${half-s*0.32} ${s*0.82} Q${half} ${s*0.72} ${half+s*0.32} ${s*0.82} L${half+s*0.28} ${s*1.15} Z`} fill={shirt[name] ?? "#64748B"}/>
      {/* Neck */}
      <rect x={half-s*0.08} y={half+s*0.32} width={s*0.16} height={s*0.14} rx={s*0.04} fill={skin}/>
      {/* Head */}
      <ellipse cx={half} cy={half} rx={s*0.38} ry={s*0.4} fill={skin}/>
      {/* Hair — Rahul: short spiky */}
      {name === "rahul" && <>
        <ellipse cx={half} cy={half-s*0.3} rx={s*0.38} ry={s*0.18} fill={hair}/>
        {[-.24,-.12,0,.12,.24].map(x=><ellipse key={x} cx={half+s*x} cy={half-s*0.46} rx={s*0.07} ry={s*0.1} fill={hair}/>)}
      </>}
      {/* Hair — Priya: two pigtails */}
      {name === "priya" && <>
        <ellipse cx={half} cy={half-s*0.3} rx={s*0.38} ry={s*0.2} fill={hair}/>
        <ellipse cx={half-s*0.44} cy={half+s*0.04} rx={s*0.1} ry={s*0.18} fill={hair}/>
        <ellipse cx={half+s*0.44} cy={half+s*0.04} rx={s*0.1} ry={s*0.18} fill={hair}/>
        {/* Ribbons */}
        <ellipse cx={half-s*0.44} cy={half-s*0.12} rx={s*0.07} ry={s*0.05} fill="#EC4899"/>
        <ellipse cx={half+s*0.44} cy={half-s*0.12} rx={s*0.07} ry={s*0.05} fill="#EC4899"/>
      </>}
      {/* Hair — Arjun: curly */}
      {name === "arjun" && <>
        <ellipse cx={half} cy={half-s*0.32} rx={s*0.4} ry={s*0.2} fill={hair}/>
        {[-.3,-.2,-.08,.06,.2,.32].map((x,i)=><circle key={i} cx={half+s*x} cy={half-s*0.44} r={s*0.09} fill={hair}/>)}
      </>}
      {/* Hair — Ravi: neat side-part + glasses */}
      {name === "ravi" && <>
        <ellipse cx={half} cy={half-s*0.3} rx={s*0.38} ry={s*0.2} fill={hair}/>
        <rect x={half-s*0.02} y={half-s*0.48} width={s*0.38} height={s*0.22} rx={s*0.06} fill={hair}/>
        {/* Glasses */}
        <rect x={half-s*0.32} y={half-s*0.12} width={s*0.26} height={s*0.18} rx={s*0.04} fill="none" stroke="#334155" strokeWidth={s*0.025}/>
        <rect x={half+s*0.06} y={half-s*0.12} width={s*0.26} height={s*0.18} rx={s*0.04} fill="none" stroke="#334155" strokeWidth={s*0.025}/>
        <line x1={half-s*0.06} y1={half-s*0.03} x2={half+s*0.06} y2={half-s*0.03} stroke="#334155" strokeWidth={s*0.02}/>
      </>}
      {/* Ears */}
      <ellipse cx={half-s*0.38} cy={half+s*0.04} rx={s*0.07} ry={s*0.09} fill={skin}/>
      <ellipse cx={half+s*0.38} cy={half+s*0.04} rx={s*0.07} ry={s*0.09} fill={skin}/>
      {blush}
      {eyes[expression]}
      {mouths[expression]}
    </svg>
  );
}

// ─── Speech Bubble ─────────────────────────────────────────────────────────────
function Bubble({ text, color = "#1E3A5F", tail = "left" }: { text: string; color?: string; tail?: "left"|"right" }) {
  return (
    <div style={{ position: "relative", background: color, borderRadius: 18, padding: "12px 16px", maxWidth: 240, fontSize: 15, fontWeight: 700, color: "#F8FAFC", lineHeight: 1.55, boxShadow: "0 4px 16px rgba(0,0,0,.3)", letterSpacing: 0.1 }}>
      {text}
      <div style={{
        position: "absolute",
        bottom: -10, [tail === "left" ? "left" : "right"]: 20,
        width: 0, height: 0,
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderTop: `10px solid ${color}`,
      }}/>
    </div>
  );
}

// ─── Comic Panel ───────────────────────────────────────────────────────────────
interface Panel {
  character: "rahul" | "priya" | "arjun" | "ravi";
  expression: Expression;
  speech: string;
  bubbleColor?: string;
  item?: string; // emoji item character holds
  flip?: boolean; // mirror character
}

function ComicStrip({ panels, bg = "#1E3A5F" }: { panels: Panel[]; bg?: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setShown(s => s < panels.length ? s + 1 : s), 900);
    return () => clearInterval(id);
  }, [panels.length]);

  return (
    <div style={{
      background: `linear-gradient(135deg, ${bg}, #0F172A)`,
      borderRadius: 24, padding: "24px 16px 20px",
      display: "flex", gap: 10, alignItems: "flex-end", justifyContent: "center",
      flexWrap: "nowrap", overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      {panels.map((panel, i) => (
        <div
          key={i}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            flex: 1, minWidth: 0,
            opacity: i < shown ? 1 : 0,
            transform: i < shown ? "translateY(0) scale(1)" : "translateY(24px) scale(0.9)",
            transition: `all .5s cubic-bezier(.34,1.56,.64,1) ${i * .15}s`,
          }}
        >
          <Bubble text={panel.speech} color={panel.bubbleColor ?? "#1D4ED8"} tail={panel.flip ? "right" : "left"} />
          <div style={{ position: "relative", transform: panel.flip ? "scaleX(-1)" : undefined }}>
            <CharacterFace name={panel.character} expression={panel.expression} size={92} />
            {panel.item && (
              <span style={{ position: "absolute", bottom: 4, right: -10, fontSize: 28, transform: panel.flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.4))" }}>
                {panel.item}
              </span>
            )}
          </div>
          {/* Character name tag */}
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800, color: "#E2E8F0", letterSpacing: 0.5, textTransform: "uppercase" }}>
            {panel.character.charAt(0).toUpperCase() + panel.character.slice(1)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Comic Data Registry ───────────────────────────────────────────────────────
const COMICS: Record<string, Record<string, Panel[]>> = {
  MM_L1_1: {
    intro: [
      { character: "rahul", expression: "confused",  speech: "I have 3 pencils but I want chocolate!", item: "✏️" },
      { character: "priya", expression: "proud",     speech: "I have chocolate but I don't need pencils!", item: "🍫", flip: true },
      { character: "rahul", expression: "sad",       speech: "Ugh… how do I get what I want?!", item: "😟" },
    ],
    concept: [
      { character: "rahul",  expression: "wow",        speech: "Whoa! ₹10 works at every shop!",   item: "💵",  bubbleColor: "#065F46" },
      { character: "priya",  expression: "happy",      speech: "That's money — everyone agrees it has value!", item: "🤑", flip: true, bubbleColor: "#1D4ED8" },
      { character: "rahul",  expression: "excited",    speech: "Rupee = magic token of India! 🇮🇳",  item: "₹",   bubbleColor: "#7C3AED" },
    ],
    visual_id: [
      { character: "arjun",  expression: "wow",        speech: "Woah, ₹50 is FLUORESCENT BLUE?!",  item: "💙",  bubbleColor: "#0369A1" },
      { character: "priya",  expression: "thinking",   speech: "Every note has Gandhi Ji on it.",   item: "🧑‍🦳", flip: true, bubbleColor: "#065F46" },
      { character: "rahul",  expression: "proud",      speech: "I can spot a fake note now! 🕵️",   item: "🔍",  bubbleColor: "#7C3AED" },
    ],
    worked_example: [
      { character: "rahul",  expression: "thinking",   speech: "₹10 + ₹10 = ₹20… I think?",        item: "🤔",  bubbleColor: "#1D4ED8" },
      { character: "arjun",  expression: "excited",    speech: "Then + ₹20 more = ₹40 total!",      item: "🧮",  flip: true, bubbleColor: "#065F46" },
      { character: "rahul",  expression: "celebrating",speech: "I can count money! 🎉",             item: "₹40", bubbleColor: "#7C3AED" },
    ],
    recap: [
      { character: "rahul",  expression: "celebrating",speech: "Barter had problems. Money solved them!", item: "🏆" },
      { character: "priya",  expression: "proud",      speech: "Rupee works everywhere in India!",   item: "🇮🇳", flip: true, bubbleColor: "#065F46" },
    ],
  },

  MM_L1_2: {
    intro: [
      { character: "priya",  expression: "wow",        speech: "Mum gave me ₹200 for the market!", item: "💵",  bubbleColor: "#065F46" },
      { character: "priya",  expression: "excited",    speech: "I want the toy, AND ice cream, AND…", item: "🎮", flip: true, bubbleColor: "#1D4ED8" },
      { character: "priya",  expression: "sad",        speech: "Wait. I only have ₹200. Help!",     item: "😬", bubbleColor: "#991B1B" },
    ],
    concept: [
      { character: "priya",  expression: "thinking",   speech: "Water and food — I NEED those.",   item: "💧",  bubbleColor: "#065F46" },
      { character: "arjun",  expression: "happy",      speech: "Toys are fun but NOT essential!",   item: "🎮",  flip: true, bubbleColor: "#F59E0B" },
      { character: "priya",  expression: "proud",      speech: "Needs first, wants second. Got it!", item: "✅", bubbleColor: "#1D4ED8" },
    ],
    sorting_sim: [
      { character: "priya",  expression: "thinking",   speech: "₹500 for the week. Let me sort…",  item: "🛒",  bubbleColor: "#1D4ED8" },
      { character: "arjun",  expression: "excited",    speech: "Milk = NEED. Fidget spinner = WANT!", item: "🥛", flip: true, bubbleColor: "#065F46" },
      { character: "priya",  expression: "proud",      speech: "Needs in the green bag first!",     item: "🟢",  bubbleColor: "#065F46" },
    ],
    safety_tip: [
      { character: "priya",  expression: "thinking",   speech: "I really want this game…",          item: "🎮",  bubbleColor: "#1D4ED8" },
      { character: "priya",  expression: "happy",      speech: "I'll ask Maa first!",               item: "👩",  flip: true, bubbleColor: "#065F46" },
      { character: "priya",  expression: "celebrating",speech: "She said YES! + it was on sale! 🎉", item: "🛍️", bubbleColor: "#7C3AED" },
    ],
    recap: [
      { character: "priya",  expression: "proud",      speech: "Needs first — always!",             item: "🏠",  bubbleColor: "#065F46" },
      { character: "arjun",  expression: "happy",      speech: "Wants only if budget allows!",      item: "⭐",  flip: true, bubbleColor: "#F59E0B" },
    ],
  },

  MM_L1_3: {
    intro: [
      { character: "arjun",  expression: "wow",        speech: "That cricket bat is ₹850! I need it!", item: "🏏", bubbleColor: "#065F46" },
      { character: "arjun",  expression: "sad",        speech: "But I only have ₹150 saved…",       item: "🐷",  flip: true, bubbleColor: "#991B1B" },
      { character: "arjun",  expression: "thinking",   speech: "Can I save ₹100 every week?",       item: "🤔",  bubbleColor: "#1D4ED8" },
    ],
    concept: [
      { character: "arjun",  expression: "thinking",   speech: "I get ₹200 pocket money weekly.",   item: "💵",  bubbleColor: "#065F46" },
      { character: "rahul",  expression: "excited",    speech: "Spend less than you earn = SAVINGS!", item: "💡", flip: true, bubbleColor: "#F59E0B" },
      { character: "arjun",  expression: "proud",      speech: "Income − Expense = my savings!",    item: "🐷",  bubbleColor: "#1D4ED8" },
    ],
    worked_example: [
      { character: "arjun",  expression: "thinking",   speech: "₹850 − ₹150 = ₹700 still needed.", item: "🧮",  bubbleColor: "#1D4ED8" },
      { character: "rahul",  expression: "excited",    speech: "₹700 ÷ ₹100/week = 7 weeks!",      item: "📅",  flip: true, bubbleColor: "#065F46" },
      { character: "arjun",  expression: "celebrating",speech: "7 weeks and that bat is MINE! 🏏",  item: "🏆",  bubbleColor: "#7C3AED" },
    ],
    goal_tracker: [
      { character: "arjun",  expression: "excited",    speech: "Week 1 — ₹100 saved. Click the weeks!", item: "💪", bubbleColor: "#065F46" },
      { character: "priya",  expression: "happy",      speech: "Every week brings the bat closer!", item: "📈",  flip: true, bubbleColor: "#1D4ED8" },
    ],
    recap: [
      { character: "arjun",  expression: "celebrating",speech: "I BOUGHT THE BAT! 7 weeks of saving!", item: "🏏", bubbleColor: "#065F46" },
      { character: "rahul",  expression: "wow",        speech: "Set goal → save weekly → achieve!", item: "🏆",  flip: true, bubbleColor: "#F59E0B" },
    ],
  },

  MM_L1_4: {
    intro: [
      { character: "ravi",   expression: "excited",    speech: "₹500 pocket money! Now what?",      item: "💵",  bubbleColor: "#7C3AED" },
      { character: "arjun",  expression: "confused",   speech: "Spend it all? Save it? PLAN it?",   item: "🤔",  flip: true, bubbleColor: "#1D4ED8" },
      { character: "ravi",   expression: "thinking",   speech: "Smart kids BUDGET before spending!", item: "📊",  bubbleColor: "#065F46" },
    ],
    concept: [
      { character: "ravi",   expression: "proud",      speech: "50% Needs → ₹250 for food, travel", item: "🏠",  bubbleColor: "#065F46" },
      { character: "ravi",   expression: "happy",      speech: "30% Wants → ₹150 for fun stuff",    item: "🎮",  flip: true, bubbleColor: "#F59E0B" },
      { character: "ravi",   expression: "celebrating",speech: "20% Savings → ₹100 into piggy bank!", item: "🐷", bubbleColor: "#7C3AED" },
    ],
    worked_example: [
      { character: "ravi",   expression: "thinking",   speech: "Let's check Ravi's week — ₹500…",   item: "📋",  bubbleColor: "#1D4ED8" },
      { character: "arjun",  expression: "excited",    speech: "He spent ₹360 and saved ₹140!",     item: "💰",  flip: true, bubbleColor: "#065F46" },
      { character: "ravi",   expression: "proud",      speech: "28% saved — above the 20% target!", item: "✅",  bubbleColor: "#7C3AED" },
    ],
    recap: [
      { character: "ravi",   expression: "celebrating",speech: "Budget before spending — always!",   item: "🏆",  bubbleColor: "#7C3AED" },
      { character: "arjun",  expression: "happy",      speech: "50-30-20 is my new money rule!",    item: "🐷",  flip: true, bubbleColor: "#065F46" },
    ],
  },
};

// ─── Public export ─────────────────────────────────────────────────────────────
export function StepComic({ lessonId, stepId }: { lessonId: string; stepId: string }) {
  const lesson = COMICS[lessonId];
  if (!lesson) return null;
  const panels = lesson[stepId];
  if (!panels) return null;

  // bg color by lesson
  const bgs: Record<string, string> = {
    MM_L1_1: "#1E3A5F",
    MM_L1_2: "#1A2E1A",
    MM_L1_3: "#1A2A1A",
    MM_L1_4: "#1E1B4B",
  };

  return <ComicStrip panels={panels} bg={bgs[lessonId] ?? "#1E293B"} />;
}
