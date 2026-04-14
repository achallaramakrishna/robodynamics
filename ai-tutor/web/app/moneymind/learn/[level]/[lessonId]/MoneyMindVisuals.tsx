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
      <div style={{ textAlign: "center", color: "#A7F3D0", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 18 }}>
        How Money Evolved
      </div>

      {/* Two panels side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>

        {/* BARTER side */}
        <div style={{ background: "#1E3A5F", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: `2px solid ${phase < 2 ? "#3B82F6" : "#334155"}`, transition: "border-color .6s" }}>
          <div style={{ fontSize: 11, color: "#93C5FD", fontWeight: 800, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>BARTER</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10, animation: "vFloat 2.5s ease-in-out infinite" }}>
            {["✏️","✏️","✏️"].map((e,i) => <span key={i} style={{ fontSize: 22 }}>{e}</span>)}
          </div>
          <div style={{ color: "#CBD5E1", fontSize: 12 }}>3 Pencils</div>
          {phase >= 1 && (
            <div style={{ marginTop: 10, padding: "8px", background: "#EF44441a", border: "1px solid #EF4444", borderRadius: 8, color: "#FCA5A5", fontSize: 11, animation: "vSlideU .5s ease both" }}>
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
          <div style={{ fontSize: 11, color: "#6EE7B7", fontWeight: 800, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>MONEY</div>
          <div style={{ animation: phase >= 2 ? "vBounce 1s ease both" : undefined }}>
            <div style={{ fontSize: 40, lineHeight: 1 }}>₹</div>
            <div style={{ color: "#A7F3D0", fontSize: 12, marginTop: 4 }}>Rupee Note</div>
          </div>
          {phase >= 3 && (
            <div style={{ marginTop: 10, padding: "8px", background: "#10B9811a", border: "1px solid #10B981", borderRadius: 8, color: "#6EE7B7", fontSize: 11, animation: "vSlideU .5s ease both" }}>
              ✅ Everyone accepts ₹!
            </div>
          )}
        </div>
      </div>

      {/* Bottom wisdom */}
      <div style={{ marginTop: 16, textAlign: "center", color: "#94A3B8", fontSize: 12, lineHeight: 1.6, padding: "0 8px" }}>
        {phase === 0 && "People used to swap goods directly…"}
        {phase === 1 && "Problem: What if the other person doesn't want what you have?"}
        {phase === 2 && "💡 Money is a token everyone agrees has value!"}
        {phase === 3 && <span style={{ color: "#6EE7B7", fontWeight: 700 }}>🇮🇳 The Rupee (₹) is India's universal money token</span>}
      </div>
    </div>
  );
}

// ─── Viz 2: Real Rupee Notes (MM_L1_1 / visual_id) ────────────────────────────
function RupeeNote({ value, revealed, delay }: { value: number; revealed: boolean; delay: number }) {
  const cfg: Record<number, { bg1: string; bg2: string; stripe: string; text: string; name: string; hindi: string }> = {
    10:  { bg1: "#6D28D9", bg2: "#4C1D95", stripe: "#A78BFA", text: "#EDE9FE", name: "Violet",           hindi: "दस" },
    20:  { bg1: "#065F46", bg2: "#064E3B", stripe: "#6EE7B7", text: "#D1FAE5", name: "Greenish Yellow",  hindi: "बीस" },
    50:  { bg1: "#0369A1", bg2: "#1E3A5F", stripe: "#38BDF8", text: "#E0F2FE", name: "Fluorescent Blue", hindi: "पचास" },
    100: { bg1: "#1D4ED8", bg2: "#1E3A5F", stripe: "#93C5FD", text: "#DBEAFE", name: "Lavender Blue",    hindi: "सौ" },
  };
  const c = cfg[value];
  return (
    <div style={{
      opacity: revealed ? 1 : 0,
      transform: revealed ? "rotateY(0deg) scale(1)" : "rotateY(90deg) scale(.85)",
      transition: `opacity .5s ${delay}s, transform .6s ${delay}s`,
      perspective: 800,
    }}>
      {/* Note outer */}
      <div style={{
        background: `linear-gradient(135deg, ${c.bg1} 0%, ${c.bg2} 100%)`,
        borderRadius: 10, overflow: "hidden", position: "relative",
        border: `1.5px solid ${c.stripe}44`,
        boxShadow: revealed ? `0 6px 24px ${c.bg1}88` : "none",
        aspectRatio: "2.3 / 1",
      }}>
        {/* Security thread (vertical stripe) */}
        <div style={{ position: "absolute", left: "28%", top: 0, bottom: 0, width: 4, background: `linear-gradient(${c.stripe}, ${c.bg1}, ${c.stripe})`, opacity: .6 }} />
        {/* Watermark circle (Gandhi position) */}
        <div style={{ position: "absolute", left: "6%", top: "50%", transform: "translateY(-50%)", width: 36, height: 44, borderRadius: "50%", background: `${c.stripe}22`, border: `1px dashed ${c.stripe}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧑‍🦳</div>
        {/* Left band */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "28%", background: `${c.bg2}cc`, borderRight: `1px solid ${c.stripe}33`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <div style={{ color: c.stripe, fontWeight: 900, fontSize: 9, letterSpacing: .5 }}>भारत</div>
          <div style={{ color: c.text, fontWeight: 900, fontSize: 9, letterSpacing: .5 }}>INDIA</div>
        </div>
        {/* Main content */}
        <div style={{ marginLeft: "30%", padding: "8px 10px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: c.stripe, fontSize: 8, fontWeight: 700 }}>भारतीय रिज़र्व बैंक</div>
              <div style={{ color: c.text, fontSize: 7.5 }}>RESERVE BANK OF INDIA</div>
            </div>
            <div style={{ color: c.text, fontSize: 8, textAlign: "right", opacity: .7 }}>
              <div>₹{value}</div>
            </div>
          </div>
          {/* Big denomination */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <div style={{ color: c.text, fontWeight: 900, fontSize: 26, lineHeight: 1 }}>₹{value}</div>
            <div style={{ color: c.stripe, fontWeight: 700, fontSize: 12 }}>{c.hindi}</div>
          </div>
          {/* Bottom row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ color: `${c.text}99`, fontSize: 7 }}>Promise to pay bearer</div>
            <div style={{ background: c.stripe, color: c.bg2, fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 4 }}>{c.name}</div>
          </div>
        </div>
        {/* Denomination corners */}
        <div style={{ position: "absolute", top: 4, right: 6, color: c.stripe, fontSize: 9, fontWeight: 900, opacity: .7 }}>{value}</div>
        <div style={{ position: "absolute", bottom: 4, left: "31%", color: c.stripe, fontSize: 9, fontWeight: 900, opacity: .7 }}>{value}</div>
      </div>
    </div>
  );
}

export function RupeeNotesViz() {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRevealed(r => r < 4 ? r + 1 : r), 700);
    return () => clearInterval(id);
  }, []);

  const notes = [
    { value: 10,  img: "/moneymind/notes/note_10.jpg",  label: "₹10 — Violet", fact: "Sun Temple, Konark" },
    { value: 20,  img: "/moneymind/notes/note_20.jpg",  label: "₹20 — Greenish Yellow", fact: "Ellora Caves" },
    { value: 50,  img: "/moneymind/notes/note_50.jpg",  label: "₹50 — Fluorescent Blue", fact: "Hampi with Chariot" },
    { value: 100, img: "/moneymind/notes/note_100.png", label: "₹100 — Lavender Blue", fact: "Rani ki Vav, Gujarat" },
  ];

  return (
    <div style={{ background: "#0F172A", borderRadius: 20, padding: "20px 16px" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ textAlign: "center", color: "#FCD34D", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 14 }}>
        Real Indian Rupee Notes — Spot the Colors!
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {notes.map((n, i) => (
          <div key={n.value} style={{
            opacity: i < revealed ? 1 : 0.1,
            transform: i < revealed ? "rotateY(0deg) scale(1)" : "rotateY(90deg) scale(.85)",
            transition: `opacity .5s ${i * 0.15}s, transform .6s ${i * 0.15}s`,
          }}>
            {/* Real note photo */}
            <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", boxShadow: i < revealed ? "0 6px 20px rgba(0,0,0,.6)" : "none", border: "2px solid rgba(255,255,255,0.15)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.img} alt={`₹${n.value} note`} style={{ width: "100%", display: "block", aspectRatio: "2.3/1", objectFit: "cover" }} />
              {/* Overlay label */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.75))", padding: "6px 8px" }}>
                <div style={{ color: "#FCD34D", fontSize: 10, fontWeight: 800 }}>{n.label}</div>
              </div>
            </div>
            <div style={{ color: "#6EE7B7", fontSize: 10, fontWeight: 600, marginTop: 5, textAlign: "center" }}>🏛️ {n.fact}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, textAlign: "center", color: "#6EE7B7", fontSize: 12, fontWeight: 700 }}>
        👴 Every note has Gandhi Ji — India's Father of the Nation
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
    <div style={{ background: "linear-gradient(135deg,#1E3A5F,#0F172A)", borderRadius: 20, padding: "28px 20px" }}>
      <style>{GLOBAL_VIZ_CSS}</style>
      <div style={{ textAlign: "center", color: "#93C5FD", fontSize: 11, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 20 }}>
        Before Money — Barter System
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {/* Rahul */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44, animation: "vFloat 2s ease-in-out infinite" }}>🧑</div>
          <div style={{ color: "#CBD5E1", fontSize: 12, marginTop: 6 }}>Rahul</div>
          <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
            {[0,1,2].map(i => <span key={i} style={{ fontSize: 20, opacity: swapVisible ? .4 : 1, transition: "opacity .4s" }}>✏️</span>)}
          </div>
          <div style={{ color: "#93C5FD", fontSize: 11, marginTop: 4 }}>3 Pencils</div>
        </div>

        {/* Swap arrow */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, color: "#F59E0B", animation: "vPulse 1.6s ease-in-out infinite" }}>⇄</div>
          <div style={{ color: "#FCD34D", fontSize: 11, fontWeight: 700, marginTop: 4 }}>SWAP</div>
        </div>

        {/* Priya */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44, animation: "vFloat 2s ease-in-out infinite", animationDelay: ".8s" }}>👧</div>
          <div style={{ color: "#CBD5E1", fontSize: 12, marginTop: 6 }}>Priya</div>
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 26, opacity: swapVisible ? 1 : .4, transition: "opacity .4s" }}>🍫</span>
          </div>
          <div style={{ color: "#93C5FD", fontSize: 11, marginTop: 4 }}>1 Chocolate</div>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: "center", background: "rgba(249,115,22,.1)", border: "1px solid #FB923C", borderRadius: 12, padding: "12px 16px", color: "#FED7AA", fontSize: 13 }}>
        💭 But what if Priya doesn't want pencils? Problem!
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
