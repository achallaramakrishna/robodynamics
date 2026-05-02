"use client";

import { useState, useEffect, useRef } from "react";

// ─── Shared helpers ────────────────────────────────────────────────────────────
const GLOBAL_VIZ_CSS = `
  @keyframes vFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes vSlideL  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes vSlideR  { from{opacity:0;transform:translateX(28px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes vSlideU  { from{opacity:0;transform:translateY(22px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes vPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes vSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes vBounce  { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-14px)} 70%{transform:translateY(-6px)} }
  @keyframes vFlash   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes vFillBar { from{width:0} to{width:var(--w)} }
  @keyframes vDrop    { from{opacity:0;transform:translateY(-40px) scale(.5)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes vBlink   { 0%,90%,100%{opacity:1} 95%{opacity:0} }
  @keyframes vNoteIn  { from{opacity:0;transform:rotateY(90deg)} to{opacity:1;transform:rotateY(0)} }
  @keyframes vArrowPulse { 0%,100%{opacity:.5;transform:scaleX(1)} 50%{opacity:1;transform:scaleX(1.1)} }
  @keyframes vCoinSpin { 0%{transform:rotateY(0)} 50%{transform:rotateY(180deg)} 100%{transform:rotateY(360deg)} }
  @keyframes vTagDrop { 0%{opacity:0;transform:translateY(-12px) scale(.8)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes vShake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
  @keyframes vParty   { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(60px) rotate(360deg);opacity:0} }
`;

// ─── Viz 1: Barter vs Money (MM_L1_1 / concept) ───────────────────────────────
export function BarterVsMoneyViz() {
  const [phase, setPhase] = useState(0); // 0=barter 1=problem 2=money 3=solved
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 2200),
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)", borderRadius: 20, padding: "24px 20px", overflow: "hidden", position: "relative" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span style={{ display: "inline-block", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 30, padding: "6px 20px", color: "#A7F3D0", fontSize: 14, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase" }}>
          💡 How Money Evolved
        </span>
      </div>

      {/* Two panels side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>

        {/* BARTER side */}
        <div style={{ background: "#1E3A5F", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: `2px solid ${phase < 2 ? "#3B82F6" : "#334155"}`, transition: "border-color .6s" }}>
          <div style={{ fontSize: 13, color: "#93C5FD", fontWeight: 900, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.2 }}>BARTER</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10, animation: "vFloat 2.5s ease-in-out infinite" }}>
            {["✏️","✏️","✏️"].map((e,i) => <span key={i} style={{ fontSize: 32 }}>{e}</span>)}
          </div>
          <div style={{ color: "#CBD5E1", fontSize: 15, fontWeight: 700 }}>3 Pencils</div>
          {phase >= 1 && (
            <div style={{ marginTop: 12, padding: "10px 12px", background: "#EF44441a", border: "1px solid #EF4444", borderRadius: 10, color: "#FCA5A5", fontSize: 14, fontWeight: 700, animation: "vSlideU .5s ease both" }}>
              ❌ What if they don't want pencils?
            </div>
          )}
        </div>

        {/* Arrow */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, animation: "vArrowPulse 1.5s ease-in-out infinite" }}>
            {phase < 2 ? "⇄" : "⇒"}
          </div>
          {phase >= 2 && <div style={{ color: "#10B981", fontSize: 10, fontWeight: 700, marginTop: 4, animation: "vSlideU .4s ease both" }}>SOLVED</div>}
        </div>

        {/* MONEY side */}
        <div style={{ background: "#064E3B", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: `2px solid ${phase >= 2 ? "#10B981" : "#334155"}`, transition: "border-color .6s" }}>
          <div style={{ fontSize: 13, color: "#6EE7B7", fontWeight: 900, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.2 }}>MONEY</div>
          <div style={{ animation: phase >= 2 ? "vBounce 1s ease both" : undefined }}>
            <div style={{ fontSize: 56, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(16,185,129,0.5))" }}>₹</div>
            <div style={{ color: "#A7F3D0", fontSize: 15, fontWeight: 700, marginTop: 6 }}>Rupee Note</div>
          </div>
          {phase >= 3 && (
            <div style={{ marginTop: 12, padding: "10px 12px", background: "#10B9811a", border: "1px solid #10B981", borderRadius: 10, color: "#6EE7B7", fontSize: 14, fontWeight: 700, animation: "vSlideU .5s ease both" }}>
              ✅ Everyone accepts ₹!
            </div>
          )}
        </div>
      </div>

      {/* Bottom wisdom */}
      <div style={{ marginTop: 18, textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ color: "#E2E8F0", fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
          {phase === 0 && "👀 People used to swap goods directly…"}
          {phase === 1 && "😬 Problem: What if the other person doesn't want what you have?"}
          {phase === 2 && "💡 Money is a token everyone agrees has value!"}
          {phase === 3 && <span style={{ color: "#6EE7B7", fontWeight: 800 }}>🇮🇳 The Rupee (₹) is India's universal money token!</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Viz 2: Real Rupee Notes (MM_L1_1 / visual_id) ────────────────────────────
interface NoteConfig {
  bg1: string; bg2: string; accent: string; text: string;
  name: string; hindi: string; monument: string; monumentEmoji: string;
  secThread: string;
}

function RupeeNote({ value, revealed, delay }: { value: number; revealed: boolean; delay: number }) {
  const cfg: Record<number, NoteConfig> = {
    10:  { bg1: "#7C5820", bg2: "#5C3D10", accent: "#F6C567", text: "#FFF8E7",
           name: "Chocolate Brown", hindi: "दस रुपये",
           monument: "Sun Temple, Konark", monumentEmoji: "🌞",
           secThread: "#FFD700" },
    20:  { bg1: "#5A7A2A", bg2: "#3D5A18", accent: "#B8E060", text: "#F0FAD8",
           name: "Greenish Yellow", hindi: "बीस रुपये",
           monument: "Ellora Caves", monumentEmoji: "🏛️",
           secThread: "#90EE90" },
    50:  { bg1: "#0D6E8A", bg2: "#074F66", accent: "#56D0EC", text: "#E0F7FC",
           name: "Fluorescent Blue", hindi: "पचास रुपये",
           monument: "Hampi Chariot", monumentEmoji: "🪨",
           secThread: "#00BFFF" },
    100: { bg1: "#4A4A8A", bg2: "#2E2E6A", accent: "#B0B0EE", text: "#F0F0FF",
           name: "Lavender Blue", hindi: "एक सौ रुपये",
           monument: "Rani ki Vav, Gujarat", monumentEmoji: "💧",
           secThread: "#9B9BFF" },
  };
  const c = cfg[value] ?? cfg[10];

  return (
    <div style={{
      opacity: revealed ? 1 : 0,
      transform: revealed ? "scale(1) rotateX(0deg)" : "scale(0.85) rotateX(25deg)",
      transition: `all 0.55s cubic-bezier(.34,1.56,.64,1) ${delay}s`,
      perspective: 900,
    }}>
      {/* Note card */}
      <div style={{
        background: `linear-gradient(135deg, ${c.bg1} 0%, ${c.bg2} 60%, ${c.bg1} 100%)`,
        borderRadius: 12, overflow: "hidden", position: "relative",
        border: `2px solid ${c.accent}55`,
        boxShadow: revealed ? `0 8px 28px ${c.bg1}99, 0 0 0 1px ${c.accent}22` : "none",
        aspectRatio: "2.3 / 1", minHeight: 86,
      }}>
        {/* Intaglio texture overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(45deg, ${c.accent}08 0px, ${c.accent}08 1px, transparent 1px, transparent 8px)`, pointerEvents: "none" }} />

        {/* Security thread (windowed) */}
        <div style={{
          position: "absolute", left: "22%", top: 0, bottom: 0, width: 3,
          background: `repeating-linear-gradient(0deg, ${c.secThread} 0px, ${c.secThread} 4px, transparent 4px, transparent 8px)`,
          opacity: 0.7,
        }} />

        {/* Left panel — Gandhi watermark zone */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "22%",
          background: `${c.bg2}dd`,
          borderRight: `1px solid ${c.accent}33`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}>
          {/* Gandhi portrait circle */}
          <div style={{
            width: 32, height: 38, borderRadius: "50%",
            background: `${c.accent}22`,
            border: `1.5px solid ${c.accent}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, marginBottom: 2,
          }}>🧑‍🦳</div>
          <div style={{ color: c.accent, fontSize: 7, fontWeight: 900, letterSpacing: 0.3 }}>भारत</div>
          <div style={{ color: c.text, fontSize: 6, opacity: 0.8 }}>INDIA</div>
        </div>

        {/* Main content area */}
        <div style={{ marginLeft: "24%", padding: "7px 8px 6px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Top: Bank name + denomination corner */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: c.accent, fontSize: 7.5, fontWeight: 800, lineHeight: 1.3 }}>भारतीय रिज़र्व बैंक</div>
              <div style={{ color: c.text, fontSize: 6.5, opacity: 0.85, lineHeight: 1.3 }}>RESERVE BANK OF INDIA</div>
            </div>
            <div style={{
              background: `${c.accent}22`, border: `1px solid ${c.accent}55`,
              borderRadius: 6, padding: "2px 5px",
              color: c.accent, fontSize: 10, fontWeight: 900,
            }}>₹{value}</div>
          </div>

          {/* Middle: Big denomination */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <div style={{
              color: c.text, fontWeight: 900, fontSize: 28, lineHeight: 1,
              textShadow: `0 2px 8px ${c.bg2}`,
            }}>₹{value}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <div style={{ color: c.accent, fontSize: 8, fontWeight: 800 }}>{c.hindi}</div>
              <div style={{ color: `${c.text}88`, fontSize: 6.5 }}>Rupees</div>
            </div>
          </div>

          {/* Bottom: Governor promise + color name */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ color: `${c.text}70`, fontSize: 6 }}>I promise to pay the bearer</div>
            <div style={{
              background: c.accent, color: c.bg2,
              fontSize: 6.5, fontWeight: 900, padding: "1px 5px", borderRadius: 4,
            }}>{c.name}</div>
          </div>
        </div>

        {/* Bottom-right: Ashoka Pillar emblem */}
        <div style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          fontSize: 18, opacity: 0.25,
        }}>⚖️</div>

        {/* Corner value stamps */}
        <div style={{ position: "absolute", bottom: 4, right: 6, color: `${c.accent}99`, fontSize: 8, fontWeight: 900 }}>{value}</div>
      </div>

      {/* Monument label below note */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        marginTop: 6, color: c.accent, fontSize: 10, fontWeight: 700,
      }}>
        <span>{c.monumentEmoji}</span>
        <span style={{ color: "#94A3B8" }}>{c.monument}</span>
      </div>
    </div>
  );
}

export function RupeeNotesViz() {
  const [revealed, setRevealed] = useState(0);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  useEffect(() => {
    const id = setInterval(() => setRevealed(r => r < 4 ? r + 1 : r), 700);
    return () => clearInterval(id);
  }, []);

  const noteValues = [10, 20, 50, 100];
  const facts: Record<number, string[]> = {
    10:  ["🎨 Chocolate Brown colour", "☀️ Shows Sun Temple, Konark", "🔒 Has windowed security thread"],
    20:  ["🌿 Greenish Yellow shade", "⛰️ Shows Ellora Caves", "👴 Gandhi Ji on the front"],
    50:  ["💙 Fluorescent Blue note", "🏛️ Shows Hampi's stone chariot", "🔍 See the ₹ symbol in thread"],
    100: ["💜 Lavender Blue colour", "💧 Shows Rani ki Vav step-well", "🌟 Largest of these four notes"],
  };
  const [activeFacts, setActiveFacts] = useState<number[]>([]);

  return (
    <div style={{ background: "linear-gradient(160deg,#0F172A,#1E2A40)", borderRadius: 22, padding: "20px 16px 18px" }}>
      <style>{GLOBAL_VIZ_CSS}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ display: "inline-block", background: "rgba(250,204,21,0.15)", border: "1.5px solid rgba(250,204,21,0.4)", borderRadius: 30, padding: "6px 18px", color: "#FCD34D", fontSize: 12, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase" }}>
          🇮🇳 Indian Rupee Notes — Spot the Colours!
        </div>
      </div>

      {/* Notes grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {noteValues.map((v, i) => (
          <button
            key={v}
            onClick={() => {
              setActiveFacts(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
              setActiveNote(v);
            }}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              outline: "none", textAlign: "left",
              transform: activeNote === v ? "scale(1.04)" : "scale(1)",
              transition: "transform .2s ease",
            }}
          >
            <RupeeNote value={v} revealed={i < revealed} delay={i * 0.15} />
          </button>
        ))}
      </div>

      {/* Fun facts panel — shows when a note is tapped */}
      {activeNote !== null && activeFacts.length > 0 && (
        <div style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14, padding: "12px 16px", animation: "vSlideU .35s ease both",
        }}>
          <div style={{ color: "#FCD34D", fontSize: 11, fontWeight: 900, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            ✨ Fun Facts — ₹{activeNote} Note
          </div>
          {(facts[activeNote] ?? []).map((f, i) => (
            <div key={i} style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600, marginBottom: 5, display: "flex", gap: 6 }}>
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}

      {!activeNote && (
        <div style={{ textAlign: "center", color: "#64748B", fontSize: 12, fontWeight: 600, padding: "8px 0" }}>
          👆 Tap any note to discover fun facts!
        </div>
      )}

      {/* Bottom fact */}
      <div style={{ marginTop: 12, textAlign: "center", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "10px 14px", color: "#6EE7B7", fontSize: 13, fontWeight: 700 }}>
        👴 Every Indian note carries Mahatma Gandhi Ji's portrait on the front!
      </div>
    </div>
  );
}

// ─── Viz 3: Value Math — Coin Counting (MM_L1_1 / worked_example) ────────────
export function CoinCountingViz() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 2600);
    const t3 = setTimeout(() => setStep(3), 4000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const coins = [
    { label: "₹10", color: "#7C3AED", accent: "#A78BFA" },
    { label: "₹10", color: "#7C3AED", accent: "#A78BFA" },
    { label: "₹20", color: "#059669", accent: "#6EE7B7" },
  ];

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "24px 20px", textAlign: "center" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ color: "#FCD34D", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 20 }}>
        Let's Count Together
      </div>

      {/* Coins */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 20 }}>
        {coins.map((coin, i) => (
          <div
            key={i}
            style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${coin.accent}, ${coin.color})`,
              border: `3px solid ${coin.accent}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 900, color: "#fff",
              opacity: i < step ? 1 : 0.2,
              transform: i < step ? "scale(1)" : "scale(.7)",
              transition: "all .5s cubic-bezier(.34,1.56,.64,1)",
              boxShadow: i < step ? `0 4px 20px ${coin.color}66` : "none",
              animation: i < step ? "vFloat 2.5s ease-in-out infinite" : undefined,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {coin.label}
          </div>
        ))}
      </div>

      {/* Running total */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {step >= 1 && <span style={{ color: "#A78BFA", fontWeight: 800, fontSize: 18, animation: "vDrop .4s ease both" }}>₹10</span>}
        {step >= 2 && <><span style={{ color: "#94A3B8", fontSize: 18 }}>+</span><span style={{ color: "#A78BFA", fontWeight: 800, fontSize: 18, animation: "vDrop .4s ease both" }}>₹10</span><span style={{ color: "#94A3B8", fontSize: 18 }}>=</span><span style={{ color: "#F59E0B", fontWeight: 800, fontSize: 20, animation: "vDrop .4s ease both" }}>₹20</span></>}
        {step >= 3 && <><span style={{ color: "#94A3B8", fontSize: 18 }}>+</span><span style={{ color: "#6EE7B7", fontWeight: 800, fontSize: 18, animation: "vDrop .4s ease both" }}>₹20</span><span style={{ color: "#94A3B8", fontSize: 18 }}>=</span></>}
      </div>

      {step >= 3 && (
        <div style={{ marginTop: 16, animation: "vBounce .7s ease both" }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#10B981" }}>₹40</div>
          <div style={{ color: "#6EE7B7", fontSize: 13, marginTop: 4 }}>🎉 Total in your wallet!</div>
        </div>
      )}
    </div>
  );
}

// ─── Viz 4: Barter Intro (MM_L1_1 / intro) ────────────────────────────────────
export function BarterIntroViz() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1600);
    return () => clearInterval(id);
  }, []);
  const swapVisible = tick % 2 === 1;

  return (
    <div style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", borderRadius: 24, padding: "28px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      {/* Big bold header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-block", background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)", borderRadius: 30, padding: "6px 20px", color: "#93C5FD", fontSize: 14, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase" }}>
          📜 Before Money — Barter System
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", gap: 8 }}>
        {/* Rahul — big character card */}
        <div style={{ textAlign: "center", flex: 1 }}>
          {/* Big character avatar */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ fontSize: 80, lineHeight: 1, animation: "vFloat 2s ease-in-out infinite", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))" }}>🧒</div>
            {/* Item bubble */}
            <div style={{
              position: "absolute", top: -12, right: -18,
              background: swapVisible ? "rgba(59,130,246,0.3)" : "#1D4ED8",
              borderRadius: 14, padding: "6px 10px",
              display: "flex", gap: 3, alignItems: "center",
              transition: "all .4s", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              border: "2px solid rgba(147,197,253,0.4)",
            }}>
              {[0,1,2].map(i => <span key={i} style={{ fontSize: 22, opacity: swapVisible ? 0.3 : 1, transition: "opacity .4s" }}>✏️</span>)}
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 900 }}>Rahul</div>
            <div style={{ color: "#93C5FD", fontSize: 15, fontWeight: 700, marginTop: 4 }}>Has 3 Pencils</div>
            <div style={{ marginTop: 8, background: "rgba(59,130,246,0.15)", borderRadius: 10, padding: "6px 12px", color: "#BFDBFE", fontSize: 13, fontWeight: 600 }}>
              Wants 🍫 chocolate
            </div>
          </div>
        </div>

        {/* Swap arrow — big and animated */}
        <div style={{ textAlign: "center", flexShrink: 0, padding: "0 4px" }}>
          <div style={{ fontSize: 52, color: "#F59E0B", animation: "vPulse 1.6s ease-in-out infinite", filter: "drop-shadow(0 4px 12px rgba(245,158,11,0.5))" }}>⇄</div>
          <div style={{ color: "#FCD34D", fontSize: 14, fontWeight: 900, marginTop: 6, letterSpacing: 0.5 }}>SWAP</div>
          <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>direct trade</div>
        </div>

        {/* Priya — big character card */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ fontSize: 80, lineHeight: 1, animation: "vFloat 2s ease-in-out infinite", animationDelay: ".8s", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))" }}>👧</div>
            {/* Item bubble */}
            <div style={{
              position: "absolute", top: -12, left: -18,
              background: swapVisible ? "#065F46" : "rgba(16,185,129,0.3)",
              borderRadius: 14, padding: "6px 12px",
              transition: "all .4s", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              border: "2px solid rgba(110,231,183,0.4)",
            }}>
              <span style={{ fontSize: 32, opacity: swapVisible ? 1 : 0.3, transition: "opacity .4s" }}>🍫</span>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 900 }}>Priya</div>
            <div style={{ color: "#6EE7B7", fontSize: 15, fontWeight: 700, marginTop: 4 }}>Has Chocolate</div>
            <div style={{ marginTop: 8, background: "rgba(16,185,129,0.15)", borderRadius: 10, padding: "6px 12px", color: "#A7F3D0", fontSize: 13, fontWeight: 600 }}>
              Wants ✏️ pencils
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "center", background: "rgba(249,115,22,.15)", border: "2px solid #F97316", borderRadius: 16, padding: "16px 20px" }}>
        <div style={{ fontSize: 22, marginBottom: 6 }}>🤔</div>
        <div style={{ color: "#FED7AA", fontSize: 17, fontWeight: 800, lineHeight: 1.5 }}>
          But what if Priya doesn't want pencils?
        </div>
        <div style={{ color: "#FB923C", fontSize: 14, fontWeight: 700, marginTop: 4 }}>
          This is the big problem with barter!
        </div>
      </div>
    </div>
  );
}

// ─── Viz 5: Needs vs Wants Split (MM_L1_2 / concept) ─────────────────────────
const NEEDS = [
  { icon: "💧", label: "Clean Water",     reason: "Life essential" },
  { icon: "🥗", label: "Healthy Food",    reason: "Energy to grow" },
  { icon: "📚", label: "School Books",    reason: "Education" },
  { icon: "💊", label: "Medicine",        reason: "Health & safety" },
];
const WANTS = [
  { icon: "🎮", label: "Video Game",      reason: "Fun, not essential" },
  { icon: "🍦", label: "Ice Cream",       reason: "Nice treat" },
  { icon: "📱", label: "New Phone",       reason: "Upgrade, not urgent" },
  { icon: "🎬", label: "Cinema Ticket",   reason: "Entertainment" },
];

export function NeedsWantsViz() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setVisible(v => v < Math.max(NEEDS.length, WANTS.length) ? v + 1 : v), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "20px 16px" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

        {/* NEEDS column */}
        <div style={{ background: "#064E3B", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#10B981", padding: "10px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>🏠</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>NEEDS</div>
            <div style={{ color: "#D1FAE5", fontSize: 10 }}>Must Have</div>
          </div>
          <div style={{ padding: "10px 10px", display: "grid", gap: 7 }}>
            {NEEDS.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex", gap: 8, alignItems: "center",
                  opacity: i < visible ? 1 : 0,
                  transform: i < visible ? "translateX(0)" : "translateX(-20px)",
                  transition: "all .4s ease",
                  background: "#065F46", borderRadius: 10, padding: "8px 10px",
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ color: "#D1FAE5", fontWeight: 700, fontSize: 12 }}>{item.label}</div>
                  <div style={{ color: "#6EE7B7", fontSize: 10 }}>{item.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WANTS column */}
        <div style={{ background: "#451A03", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#F59E0B", padding: "10px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>⭐</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>WANTS</div>
            <div style={{ color: "#FEF3C7", fontSize: 10 }}>Nice to Have</div>
          </div>
          <div style={{ padding: "10px 10px", display: "grid", gap: 7 }}>
            {WANTS.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex", gap: 8, alignItems: "center",
                  opacity: i < visible ? 1 : 0,
                  transform: i < visible ? "translateX(0)" : "translateX(20px)",
                  transition: "all .4s ease",
                  background: "#78350F", borderRadius: 10, padding: "8px 10px",
                }}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ color: "#FEF3C7", fontWeight: 700, fontSize: 12 }}>{item.label}</div>
                  <div style={{ color: "#FCD34D", fontSize: 10 }}>{item.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, textAlign: "center", color: "#94A3B8", fontSize: 12 }}>
        💡 <strong style={{ color: "#10B981" }}>Needs</strong> first, <strong style={{ color: "#F59E0B" }}>Wants</strong> only if budget allows!
      </div>
    </div>
  );
}

// ─── Viz 6: Needs vs Wants Intro — Shopping Bags (MM_L1_2 / intro) ────────────
export function ShoppingBagsViz() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3000);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  return (
    <div style={{ background: "linear-gradient(135deg,#1E293B,#0F172A)", borderRadius: 20, padding: "28px 20px", textAlign: "center" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ color: "#FCD34D", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 20 }}>
        You have ₹200. What do you buy?
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 20 }}>
        {/* Needs bag */}
        <div style={{
          opacity: phase >= 1 ? 1 : .3,
          transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
          transition: "all .6s ease",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 64 }}>🛍️</div>
          <div style={{ background: "#10B981", borderRadius: 8, padding: "4px 12px", marginTop: 6 }}>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 12 }}>NEEDS</div>
          </div>
          {phase >= 1 && (
            <div style={{ marginTop: 8, display: "grid", gap: 4, animation: "vSlideU .5s ease both" }}>
              {["💧 Water — ₹20","🥗 Food — ₹80","📚 Books — ₹60"].map(t => (
                <div key={t} style={{ background: "#064E3B", borderRadius: 6, padding: "4px 8px", color: "#6EE7B7", fontSize: 11 }}>{t}</div>
              ))}
            </div>
          )}
        </div>

        {/* Wants bag */}
        <div style={{
          opacity: phase >= 2 ? 1 : .3,
          transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
          transition: "all .6s ease",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 64 }}>🛒</div>
          <div style={{ background: "#F59E0B", borderRadius: 8, padding: "4px 12px", marginTop: 6 }}>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 12 }}>WANTS</div>
          </div>
          {phase >= 2 && (
            <div style={{ marginTop: 8, display: "grid", gap: 4, animation: "vSlideU .5s ease both" }}>
              {["🎮 Game — ₹400","🍦 Ice Cream — ₹50","🎬 Movie — ₹200"].map(t => (
                <div key={t} style={{ background: "#78350F", borderRadius: 6, padding: "4px 8px", color: "#FCD34D", fontSize: 11 }}>{t}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ color: "#F87171", fontSize: 13, fontWeight: 700, padding: "10px 16px", background: "rgba(239,68,68,.1)", borderRadius: 12, border: "1px solid #EF4444" }}>
        ⚠️ You can't buy everything! Which bag should you fill first?
      </div>
    </div>
  );
}

// ─── Viz 7: Budget Tracker (MM_L1_2 / sorting_sim) ────────────────────────────
const SHOP_ITEMS = [
  { name: "Milk",           price: 30,  type: "need" as const, icon: "🥛" },
  { name: "Fidget Spinner", price: 100, type: "want" as const, icon: "🌀" },
  { name: "Vegetables",     price: 50,  type: "need" as const, icon: "🥦" },
  { name: "Comic Book",     price: 150, type: "want" as const, icon: "📖" },
];

export function BudgetTrackerViz() {
  const [cart, setCart] = useState<number[]>([]);
  const budget = 500;
  const spent  = cart.reduce((s, i) => s + SHOP_ITEMS[i].price, 0);
  const pct    = Math.min((spent / budget) * 100, 100);
  const barColor = pct > 80 ? "#EF4444" : pct > 50 ? "#F59E0B" : "#10B981";

  const toggle = (i: number) => setCart(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i]);

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "20px 16px" }}>
      <style>{GLOBAL_VIZ_CSS}</style>

      {/* Budget bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: "#94A3B8", fontSize: 12 }}>Budget: ₹{budget}</span>
          <span style={{ color: barColor, fontWeight: 800, fontSize: 13 }}>Spent: ₹{spent} / ₹{budget}</span>
        </div>
        <div style={{ background: "#1E293B", borderRadius: 999, height: 12, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 999,
            background: barColor,
            width: `${pct}%`,
            transition: "width .5s ease, background .3s",
          }} />
        </div>
        <div style={{ marginTop: 4, textAlign: "right", color: "#64748B", fontSize: 11 }}>
          ₹{budget - spent} remaining
        </div>
      </div>

      {/* Items */}
      <div style={{ display: "grid", gap: 8 }}>
        {SHOP_ITEMS.map((item, i) => {
          const inCart = cart.includes(i);
          return (
            <div
              key={item.name}
              onClick={() => toggle(i)}
              style={{
                display: "flex", gap: 12, alignItems: "center",
                background: inCart ? (item.type === "need" ? "#064E3B" : "#78350F") : "#1E293B",
                border: `2px solid ${inCart ? (item.type === "need" ? "#10B981" : "#F59E0B") : "#334155"}`,
                borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                transition: "all .25s",
              }}
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#E2E8F0", fontSize: 14 }}>{item.name}</div>
                <div style={{
                  display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800,
                  background: item.type === "need" ? "#10B981" : "#F59E0B",
                  color: "#fff", marginTop: 2,
                }}>
                  {item.type.toUpperCase()}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 16 }}>₹{item.price}</div>
                <div style={{ color: inCart ? "#6EE7B7" : "#64748B", fontSize: 11, marginTop: 2 }}>
                  {inCart ? "✓ In cart" : "Tap to add"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {spent > budget && (
        <div style={{ marginTop: 12, textAlign: "center", color: "#FCA5A5", fontWeight: 700, fontSize: 13, animation: "vShake .4s ease" }}>
          ⚠️ Over budget! Remove some wants first.
        </div>
      )}
    </div>
  );
}

// ─── Viz 8: Parent Permission (MM_L1_2 / safety_tip) ─────────────────────────
export function ParentPermissionViz() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3200);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);

  return (
    <div style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", borderRadius: 20, padding: "28px 20px", textAlign: "center" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 20, marginBottom: 20 }}>
        {/* Child */}
        <div style={{ textAlign: "center", animation: "vFloat 2.5s ease-in-out infinite" }}>
          <div style={{ fontSize: 56 }}>👧</div>
          <div style={{ color: "#93C5FD", fontSize: 12, marginTop: 4 }}>You</div>
        </div>

        {/* Speech bubble */}
        {phase >= 1 && (
          <div style={{
            background: "#3B82F6", borderRadius: 14, padding: "10px 14px",
            color: "#fff", fontSize: 13, fontWeight: 700,
            position: "relative", animation: "vSlideU .5s ease both",
            maxWidth: 160, marginBottom: 20,
          }}>
            "Maa, can I buy this toy?"
            <div style={{ position: "absolute", bottom: -8, left: 20, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid #3B82F6" }} />
          </div>
        )}

        {/* Parent */}
        <div style={{ textAlign: "center", animation: "vFloat 2.5s ease-in-out infinite", animationDelay: ".8s" }}>
          <div style={{ fontSize: 56 }}>👩</div>
          <div style={{ color: "#93C5FD", fontSize: 12, marginTop: 4 }}>Parent</div>
        </div>
      </div>

      {phase >= 2 && (
        <div style={{
          background: "#064E3B", border: "2px solid #10B981", borderRadius: 16,
          padding: "16px 20px", animation: "vSlideU .6s ease both",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ color: "#6EE7B7", fontWeight: 800, fontSize: 15 }}>Always Ask First!</div>
          <div style={{ color: "#A7F3D0", fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
            Your parents are your <strong>Money Coaches</strong>. They help you decide what's worth spending on.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Viz 9: Recap Summary — animated checklist (reusable) ────────────────────
export function RecapViz({ takeaway, points }: { takeaway: string; points: string[] }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setShown(s => s < points.length ? s + 1 : s), 600);
    return () => clearInterval(id);
  }, [points.length]);

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "24px 20px", textAlign: "center" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ fontSize: 40, animation: "vBounce 1s ease both", marginBottom: 12 }}>🏆</div>
      <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 16, marginBottom: 16, lineHeight: 1.4 }}>{takeaway}</div>
      <div style={{ display: "grid", gap: 10, textAlign: "left" }}>
        {points.map((pt, i) => (
          <div
            key={i}
            style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              background: "#1E293B", borderRadius: 12, padding: "12px 14px",
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "translateX(0)" : "translateX(-20px)",
              transition: "all .5s ease",
            }}
          >
            <span style={{ color: "#10B981", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>✓</span>
            <span style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.5 }}>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── L1_3: Saving for a Goal ──────────────────────────────────────────────────

export function CricketBatGoalViz() {
  const GOAL = 850, SAVED = 150;
  const [displayed, setDisplayed] = useState(SAVED);
  useEffect(() => {
    const step = 50, max = GOAL;
    const id = setInterval(() => setDisplayed(d => d < max ? Math.min(d + step, max) : d), 120);
    return () => clearInterval(id);
  }, []);
  const pct = Math.min((displayed / GOAL) * 100, 100);

  return (
    <div style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", borderRadius: 20, padding: "24px 20px" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 52, animation: "vFloat 2.5s ease-in-out infinite" }}>🏏</div>
        <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 16, marginTop: 6 }}>Cricket Bat — ₹850</div>
        <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>Save ₹100/week → reach goal in 7 weeks</div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#1E293B", borderRadius: 999, height: 20, overflow: "hidden", marginBottom: 8, position: "relative" }}>
        <div style={{
          height: "100%", borderRadius: 999,
          background: pct >= 100 ? "#FCD34D" : "linear-gradient(90deg,#10B981,#34D399)",
          width: `${pct}%`, transition: "width .15s linear",
          display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
        }}>
          {pct > 20 && <span style={{ color: "#064E3B", fontWeight: 900, fontSize: 11 }}>₹{displayed}</span>}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 16 }}>
        <span>₹0</span><span style={{ color: "#FCD34D", fontWeight: 700 }}>Goal: ₹{GOAL}</span>
      </div>

      {/* Week dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {[1,2,3,4,5,6,7].map(w => {
          const weekAmt = SAVED + w * 100;
          const done = displayed >= weekAmt;
          return (
            <div key={w} style={{ textAlign: "center" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: done ? "#10B981" : "#1E293B",
                border: `2px solid ${done ? "#6EE7B7" : "#334155"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: done ? "#fff" : "#64748B", fontWeight: 800, fontSize: 12,
                transition: "all .3s",
              }}>{w}</div>
              <div style={{ color: "#64748B", fontSize: 9, marginTop: 3 }}>₹{weekAmt}</div>
            </div>
          );
        })}
      </div>

      {displayed >= GOAL && (
        <div style={{ marginTop: 14, textAlign: "center", color: "#FCD34D", fontWeight: 900, fontSize: 16, animation: "vBounce .7s ease both" }}>
          🎉 Goal Reached! Bat is yours!
        </div>
      )}
    </div>
  );
}

export function SavingFormulaViz() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 2600);
    const t3 = setTimeout(() => setStep(3), 4000);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  const boxes = [
    { label: "INCOME",   value: "₹200/week",  icon: "💵", color: "#10B981", bg: "#064E3B", op: "+ pocket money" },
    { label: "EXPENSE",  value: "₹120/week",  icon: "🛒", color: "#EF4444", bg: "#450A0A", op: "− canteen, stationery" },
    { label: "SAVINGS",  value: "₹80/week",   icon: "🐷", color: "#F59E0B", bg: "#451A03", op: "= left over for goal" },
  ];

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "24px 16px", textAlign: "center" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ color: "#A7F3D0", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 18 }}>
        The Saving Formula
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {boxes.map((b, i) => (
          <>
            <div
              key={b.label}
              style={{
                background: b.bg, border: `2px solid ${b.color}`, borderRadius: 16, padding: "14px 16px", minWidth: 90,
                opacity: i <= step ? 1 : 0,
                transform: i <= step ? "translateY(0)" : "translateY(20px)",
                transition: "all .5s ease",
              }}
            >
              <div style={{ fontSize: 28 }}>{b.icon}</div>
              <div style={{ color: b.color, fontWeight: 900, fontSize: 11, marginTop: 6, textTransform: "uppercase" }}>{b.label}</div>
              <div style={{ color: "#F8FAFC", fontWeight: 800, fontSize: 15, marginTop: 2 }}>{b.value}</div>
              <div style={{ color: "#94A3B8", fontSize: 10, marginTop: 4, lineHeight: 1.4 }}>{b.op}</div>
            </div>
            {i < boxes.length - 1 && (
              <div key={`arrow-${i}`} style={{ color: "#64748B", fontSize: 22, opacity: i < step ? 1 : .2, transition: "opacity .4s" }}>=</div>
            )}
          </>
        ))}
      </div>
      {step >= 3 && (
        <div style={{ marginTop: 16, color: "#6EE7B7", fontSize: 13, fontWeight: 700, animation: "vSlideU .5s ease both" }}>
          💡 ₹80/week × 7 weeks = ₹560 → reach your ₹700 gap in 9 weeks!
        </div>
      )}
    </div>
  );
}

export function PiggyBankFillingViz() {
  const [week, setWeek] = useState(0);
  const WEEKS = 7, START = 150, PER_WEEK = 100, GOAL = 850;
  const current = START + week * PER_WEEK;
  const pct = (current / GOAL) * 100;

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "24px 20px", textAlign: "center" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ color: "#FCD34D", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 16 }}>
        Arjun's Savings Journey
      </div>

      {/* Piggy bank SVG */}
      <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
        <svg width="110" height="90" viewBox="0 0 110 90">
          {/* Body */}
          <ellipse cx="55" cy="56" rx="40" ry="32" fill={week >= 7 ? "#FCD34D" : week >= 4 ? "#F59E0B" : "#1E3A5F"} stroke="#334155" strokeWidth="2"/>
          {/* Fill level */}
          <clipPath id="pigClip"><ellipse cx="55" cy="56" rx="38" ry="30"/></clipPath>
          <rect x="17" y={86 - (pct * 0.6)} width="76" height={pct * 0.6} fill={week >= 7 ? "#F59E0B" : "#10B981"} clipPath="url(#pigClip)" opacity=".7"/>
          {/* Snout */}
          <ellipse cx="90" cy="56" rx="10" ry="8" fill="#1E3A5F" stroke="#334155" strokeWidth="1.5"/>
          <circle cx="87" cy="54" r="2" fill="#64748B"/><circle cx="93" cy="54" r="2" fill="#64748B"/>
          {/* Ear */}
          <ellipse cx="30" cy="28" rx="10" ry="8" fill="#1E3A5F" stroke="#334155" strokeWidth="1.5" transform="rotate(-20 30 28)"/>
          {/* Eye */}
          <circle cx="70" cy="46" r="3" fill="#F8FAFC"/><circle cx="71" cy="46" r="1.5" fill="#0F172A"/>
          {/* Legs */}
          {[30,43,62,75].map(x => <rect key={x} x={x} y="84" width="8" height="6" rx="2" fill="#1E3A5F" stroke="#334155" strokeWidth="1"/>)}
          {/* Coin slot */}
          <rect x="48" y="24" width="14" height="3" rx="1.5" fill="#334155"/>
          {/* Amount */}
          <text x="55" y="62" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="11">₹{current}</text>
        </svg>
      </div>

      {/* Bar */}
      <div style={{ background: "#1E293B", borderRadius: 999, height: 10, overflow: "hidden", marginBottom: 6 }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#10B981,#34D399)", borderRadius: 999, width: `${pct}%`, transition: "width .6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 16 }}>
        <span>₹0</span><span style={{ color: "#FCD34D" }}>🏏 ₹850</span>
      </div>

      {/* Week buttons */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
        {Array.from({ length: WEEKS + 1 }, (_, w) => (
          <button
            key={w}
            onClick={() => setWeek(w)}
            style={{
              background: w <= week ? "#10B981" : "#1E293B",
              border: `1.5px solid ${w <= week ? "#6EE7B7" : "#334155"}`,
              color: w <= week ? "#fff" : "#64748B",
              borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >{w === 0 ? "Start" : `Wk ${w}`}</button>
        ))}
      </div>
      {week >= WEEKS && <div style={{ color: "#FCD34D", fontWeight: 900, fontSize: 15, animation: "vBounce .7s ease both" }}>🏏 Bat unlocked!</div>}
    </div>
  );
}

// ─── L1_4: Pocket Money Manager ───────────────────────────────────────────────

export function BudgetPieViz() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 800);
    return () => clearTimeout(t);
  }, []);

  const slices = [
    { label: "Needs 50%",    pct: 50, color: "#10B981", amount: 250, icon: "🏠", desc: "Food, transport, uniform" },
    { label: "Wants 30%",    pct: 30, color: "#F59E0B", amount: 150, icon: "🎮", desc: "Games, snacks, fun" },
    { label: "Savings 20%",  pct: 20, color: "#3B82F6", amount: 100, icon: "🐷", desc: "Goal tracker" },
  ];

  // Simple SVG pie
  let cumulative = 0;
  const r = 60, cx = 70, cy = 70;
  const paths = slices.map(s => {
    const start = cumulative;
    cumulative += s.pct;
    const startAngle = (start / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle   = ((start + s.pct) / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle),   y2 = cy + r * Math.sin(endAngle);
    const large = s.pct > 50 ? 1 : 0;
    return { ...s, d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, startAngle, endAngle };
  });

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "20px 16px" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ textAlign: "center", color: "#A7F3D0", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>
        50-30-20 Rule — ₹500 Budget
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
        {/* Pie */}
        <svg width="140" height="140" style={{ flexShrink: 0 }}>
          {paths.map((p, i) => (
            <path key={i} d={p.d} fill={p.color}
              style={{ opacity: phase ? 1 : 0, transform: phase ? "scale(1)" : "scale(.3)", transformOrigin: `${cx}px ${cy}px`, transition: `all .6s ${i * .2}s ease` }}
            />
          ))}
          <circle cx={cx} cy={cy} r="28" fill="#0F172A"/>
          <text x={cx} y={cy + 4} textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="bold">₹500</text>
        </svg>

        {/* Legend */}
        <div style={{ display: "grid", gap: 8 }}>
          {slices.map(s => (
            <div key={s.label} style={{ display: "flex", gap: 10, alignItems: "center", background: "#1E293B", borderRadius: 10, padding: "8px 12px" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 12 }}>{s.icon} ₹{s.amount} <span style={{ color: s.color }}>{s.label}</span></div>
                <div style={{ color: "#64748B", fontSize: 10 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RavisBudgetViz() {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setShown(s => s < 5 ? s + 1 : s), 600);
    return () => clearInterval(id);
  }, []);

  const expenses = [
    { label: "🍱 School Canteen", amount: 80,  color: "#10B981" },
    { label: "✏️ Stationery",      amount: 50,  color: "#3B82F6" },
    { label: "🎮 Gaming Credits",  amount: 100, color: "#F59E0B" },
    { label: "🍿 Snacks",          amount: 70,  color: "#F59E0B" },
    { label: "🛺 Transport",       amount: 60,  color: "#10B981" },
  ];
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const savings = 500 - total;

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "20px 16px" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ textAlign: "center", color: "#A7F3D0", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>
        Ravi's Week — ₹500 Income
      </div>
      <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
        {expenses.map((e, i) => (
          <div key={e.label} style={{ opacity: i < shown ? 1 : 0, transform: i < shown ? "translateX(0)" : "translateX(-24px)", transition: "all .4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ color: "#CBD5E1", fontSize: 12 }}>{e.label}</span>
              <span style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 12 }}>₹{e.amount}</span>
            </div>
            <div style={{ background: "#1E293B", borderRadius: 999, height: 8 }}>
              <div style={{ height: "100%", borderRadius: 999, background: e.color, width: i < shown ? `${(e.amount / 500) * 100}%` : "0%", transition: "width .6s ease" }} />
            </div>
          </div>
        ))}
      </div>
      {shown >= expenses.length && (
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #334155", paddingTop: 12, animation: "vSlideU .5s ease both" }}>
          <span style={{ color: "#94A3B8", fontSize: 13 }}>Total Spent: <strong style={{ color: "#F87171" }}>₹{total}</strong></span>
          <span style={{ color: "#94A3B8", fontSize: 13 }}>Saved: <strong style={{ color: "#10B981" }}>₹{savings} ({Math.round(savings/5)}%)</strong></span>
        </div>
      )}
    </div>
  );
}

// ─── Registry: stepId → Visual component ──────────────────────────────────────
type VizProps = { lessonId: string; stepId: string; boardData?: Record<string, unknown> };

export function StepVisual({ lessonId, stepId, boardData }: VizProps) {
  // MM_L1_1 — What is Money?
  if (lessonId === "MM_L1_1") {
    if (stepId === "intro")         return <BarterIntroViz />;
    if (stepId === "concept")       return <BarterVsMoneyViz />;
    if (stepId === "visual_id")     return <RupeeNotesViz />;
    if (stepId === "worked_example") return <CoinCountingViz />;
    if (stepId === "recap" || stepId === "recap_summary") {
      return <RecapViz
        takeaway="Money is a universal token everyone agrees has value!"
        points={[
          "Barter: swapping goods directly — had big problems",
          "Money solved barter by becoming a common value token",
          "The Rupee (₹) is India's official currency",
          "Different notes (₹10, ₹20, ₹50, ₹100) have different values",
        ]}
      />;
    }
  }

  // MM_L1_2 — Needs vs Wants
  if (lessonId === "MM_L1_2") {
    if (stepId === "intro")         return <ShoppingBagsViz />;
    if (stepId === "concept")       return <NeedsWantsViz />;
    if (stepId === "sorting_sim")   return <BudgetTrackerViz />;
    if (stepId === "safety_tip")    return <ParentPermissionViz />;
    if (stepId === "recap" || stepId === "recap_summary") {
      return <RecapViz
        takeaway="Essentials come first. Treats come later."
        points={[
          "NEEDS: Food, Water, Learning, Health — always first",
          "WANTS: Toys, Treats, Entertainment — only after needs",
          "Always plan spending based on priorities",
          "Ask a parent before making any purchase!",
        ]}
      />;
    }
  }

  // MM_L1_3 — Saving for a Goal
  if (lessonId === "MM_L1_3") {
    if (stepId === "intro")           return <CricketBatGoalViz />;
    if (stepId === "concept")         return <SavingFormulaViz />;
    if (stepId === "worked_example")  return <PiggyBankFillingViz />;
    if (stepId === "goal_tracker")    return <CricketBatGoalViz />;
    if (stepId === "recap") {
      return <RecapViz
        takeaway="Save small every week — reach big goals!"
        points={[
          "Savings = Income − Expenses",
          "Set a clear goal with a price tag",
          "Weeks needed = Goal Amount ÷ Weekly Savings",
          "Track progress every week — every rupee counts!",
        ]}
      />;
    }
  }

  // MM_L1_4 — Pocket Money Manager
  if (lessonId === "MM_L1_4") {
    if (stepId === "intro")           return <BudgetPieViz />;
    if (stepId === "concept")         return <BudgetPieViz />;
    if (stepId === "worked_example")  return <RavisBudgetViz />;
    if (stepId === "recap") {
      return <RecapViz
        takeaway="Budget BEFORE you spend — not after!"
        points={[
          "Income − Expenses = Savings",
          "50% Needs, 30% Wants, 20% Savings (50-30-20 rule)",
          "Plan your budget before you receive money",
          "Cut variable expenses to save more",
        ]}
      />;
    }
  }

  return null; // No visual for this step — show normal board card
}
