"use client";

// ─── Animated SVG Illustrations for MoneyMind Lesson Player ──────────────────
// All animations use inline CSS keyframes injected per SVG for isolation.

export function RupeeCoinSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="rg1" cx="38%" cy="32%" r="60%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="55%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <style>{`
          @keyframes coinFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-6px) rotate(3deg)} }
          @keyframes coinGlow  { 0%,100%{opacity:.3;r:46} 50%{opacity:.7;r:50} }
          .mm-coin{animation:coinFloat 3s ease-in-out infinite;transform-origin:50px 50px}
          .mm-coin-glow{animation:coinGlow 3s ease-in-out infinite}
        `}</style>
      </defs>
      <circle className="mm-coin-glow" cx="50" cy="50" r="46" fill="#F59E0B" opacity=".25" />
      <g className="mm-coin">
        <circle cx="50" cy="50" r="38" fill="url(#rg1)" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#92400E" strokeWidth="1" opacity=".4" />
        <circle cx="50" cy="50" r="29" fill="none" stroke="#FDE68A" strokeWidth=".6" opacity=".35" />
        <text x="50" y="59" textAnchor="middle" fontSize="26" fontWeight="900" fill="#7C2D12" fontFamily="sans-serif">₹</text>
      </g>
    </svg>
  );
}

export function PiggyBankSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <style>{`
          @keyframes pigWiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
          @keyframes coinDrop{0%{transform:translateY(-18px);opacity:1}80%{transform:translateY(0px);opacity:1}100%{transform:translateY(0px);opacity:0}}
          .mm-pig{animation:pigWiggle 2.5s ease-in-out infinite;transform-origin:50px 60px}
          .mm-coin-drop{animation:coinDrop 1.8s ease-in 0.4s infinite}
        `}</style>
      </defs>
      {/* Coin dropping */}
      <g className="mm-coin-drop">
        <rect x="45" y="10" width="10" height="6" rx="3" fill="#F59E0B" />
        <text x="50" y="16" textAnchor="middle" fontSize="6" fill="#7C2D12" fontWeight="bold">₹</text>
      </g>
      <g className="mm-pig">
        {/* Body */}
        <ellipse cx="50" cy="62" rx="28" ry="22" fill="#FCA5A5" />
        {/* Head */}
        <circle cx="76" cy="55" r="16" fill="#FCA5A5" />
        {/* Snout */}
        <ellipse cx="83" cy="59" rx="8" ry="6" fill="#F87171" />
        <circle cx="81" cy="59" r="1.5" fill="#9F1239" />
        <circle cx="85" cy="59" r="1.5" fill="#9F1239" />
        {/* Eye */}
        <circle cx="75" cy="50" r="2.5" fill="#1E293B" />
        <circle cx="76" cy="49" r=".9" fill="#fff" />
        {/* Ear */}
        <ellipse cx="71" cy="42" rx="5" ry="7" fill="#FCA5A5" transform="rotate(-20 71 42)" />
        <ellipse cx="71" cy="42" rx="3" ry="5" fill="#F87171" transform="rotate(-20 71 42)" />
        {/* Coin slot */}
        <rect x="38" y="40" width="14" height="3" rx="1.5" fill="#9F1239" />
        {/* Legs */}
        <rect x="30" y="80" width="8" height="12" rx="4" fill="#FCA5A5" />
        <rect x="42" y="80" width="8" height="12" rx="4" fill="#FCA5A5" />
        <rect x="54" y="80" width="8" height="12" rx="4" fill="#FCA5A5" />
        {/* Tail */}
        <path d="M22 60 Q12 55 16 48 Q20 41 14 38" stroke="#F87171" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function LightbulbSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="bulbGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="60%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <style>{`
          @keyframes bulbPulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.55;transform:scale(1.12)}}
          @keyframes rayGrow{0%,100%{stroke-dashoffset:20}50%{stroke-dashoffset:0}}
          @keyframes bulbBright{0%,100%{fill:#FCD34D}50%{fill:#FEF9C3}}
          .mm-bulb-glow{animation:bulbPulse 2s ease-in-out infinite;transform-origin:50px 42px}
          .mm-ray{animation:rayGrow 2s ease-in-out infinite;stroke-dasharray:12}
          .mm-bulb-inner{animation:bulbBright 2s ease-in-out infinite}
        `}</style>
      </defs>
      <circle className="mm-bulb-glow" cx="50" cy="42" r="32" fill="#FCD34D" opacity=".25" />
      {/* Rays */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line
          key={i} className="mm-ray"
          x1={50 + 28*Math.cos(deg*Math.PI/180)} y1={42 + 28*Math.sin(deg*Math.PI/180)}
          x2={50 + 38*Math.cos(deg*Math.PI/180)} y2={42 + 38*Math.sin(deg*Math.PI/180)}
          stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"
          style={{ animationDelay: `${i*0.08}s` }}
        />
      ))}
      {/* Bulb glass */}
      <path d="M35 42 Q35 25 50 22 Q65 25 65 42 Q65 55 57 60 L43 60 Q35 55 35 42Z" fill="url(#bulbGrad)" />
      <path d="M43 60 L43 67 Q43 72 50 72 Q57 72 57 67 L57 60Z" fill="#D97706" />
      <rect x="44" y="71" width="12" height="3" rx="1.5" fill="#92400E" />
      <rect x="45" y="75" width="10" height="3" rx="1.5" fill="#92400E" />
      {/* Shine */}
      <path d="M40 32 Q43 28 48 28" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TrophySVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="trophyGrad" cx="35%" cy="25%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <style>{`
          @keyframes starOrbit{from{transform:rotate(0deg) translateX(36px) rotate(0deg)}to{transform:rotate(360deg) translateX(36px) rotate(-360deg)}}
          @keyframes trophyBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}70%{transform:translateY(-4px)}}
          @keyframes starTwinkle{0%,100%{opacity:.5;transform:scale(.7)}50%{opacity:1;transform:scale(1.2)}}
          .mm-trophy{animation:trophyBounce 2.4s ease-in-out infinite;transform-origin:50px 60px}
          .mm-star-1{animation:starTwinkle 1.2s ease-in-out infinite}
          .mm-star-2{animation:starTwinkle 1.2s ease-in-out .4s infinite}
          .mm-star-3{animation:starTwinkle 1.2s ease-in-out .8s infinite}
        `}</style>
      </defs>
      <g className="mm-trophy">
        {/* Cup */}
        <path d="M28 20 L72 20 L65 55 Q62 68 50 68 Q38 68 35 55 Z" fill="url(#trophyGrad)" />
        {/* Handles */}
        <path d="M28 20 Q14 20 14 35 Q14 50 28 48" stroke="#F59E0B" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M72 20 Q86 20 86 35 Q86 50 72 48" stroke="#F59E0B" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Stem */}
        <rect x="44" y="68" width="12" height="12" rx="2" fill="#D97706" />
        <rect x="34" y="80" width="32" height="6" rx="3" fill="#92400E" />
        {/* Shine */}
        <path d="M36 30 Q40 24 46 24" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Star on cup */}
        <text x="50" y="50" textAnchor="middle" fontSize="18" fill="#7C2D12" opacity=".8">★</text>
      </g>
      {/* Orbiting stars */}
      <text className="mm-star-1" x="16" y="28" fontSize="12" fill="#FCD34D">✦</text>
      <text className="mm-star-2" x="78" y="22" fontSize="10" fill="#FCD34D">✦</text>
      <text className="mm-star-3" x="70" y="75" fontSize="8" fill="#FCD34D">✦</text>
    </svg>
  );
}

export function ChartGrowthSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <style>{`
          @keyframes barGrow1{0%,30%{transform:scaleY(0)}100%{transform:scaleY(1)}}
          @keyframes barGrow2{0%,45%{transform:scaleY(0)}100%{transform:scaleY(1)}}
          @keyframes barGrow3{0%,60%{transform:scaleY(0)}100%{transform:scaleY(1)}}
          @keyframes barGrow4{0%,75%{transform:scaleY(0)}100%{transform:scaleY(1)}}
          @keyframes arrowBounce{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
          .mm-b1{animation:barGrow1 2s ease-out infinite;transform-origin:18px 75px}
          .mm-b2{animation:barGrow2 2s ease-out infinite;transform-origin:34px 75px}
          .mm-b3{animation:barGrow3 2s ease-out infinite;transform-origin:50px 75px}
          .mm-b4{animation:barGrow4 2s ease-out infinite;transform-origin:66px 75px}
          .mm-arrow{animation:arrowBounce 1s ease-in-out infinite}
        `}</style>
      </defs>
      {/* Grid lines */}
      {[75,60,45,30].map((y, i) => (
        <line key={i} x1="12" y1={y} x2="88" y2={y} stroke="#334155" strokeWidth="0.8" strokeDasharray="4" />
      ))}
      {/* Axis */}
      <line x1="12" y1="75" x2="88" y2="75" stroke="#475569" strokeWidth="2" />
      <line x1="12" y1="75" x2="12" y2="18" stroke="#475569" strokeWidth="2" />
      {/* Bars */}
      <rect className="mm-b1" x="14" y="57" width="8" height="18" rx="2" fill="#3B82F6" />
      <rect className="mm-b2" x="30" y="48" width="8" height="27" rx="2" fill="#6366F1" />
      <rect className="mm-b3" x="46" y="38" width="8" height="37" rx="2" fill="#8B5CF6" />
      <rect className="mm-b4" x="62" y="25" width="8" height="50" rx="2" fill="#10B981" />
      {/* Trend arrow */}
      <g className="mm-arrow">
        <path d="M14 65 Q30 52 46 42 Q60 33 72 22" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="5,3" />
        <polygon points="72,18 78,24 66,24" fill="#F59E0B" />
      </g>
      {/* Rupee label */}
      <text x="6" y="48" fontSize="8" fill="#64748B" textAnchor="middle">₹</text>
    </svg>
  );
}

export function ShieldSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <style>{`
          @keyframes scanLine{0%{transform:translateY(-30px);opacity:0}20%{opacity:1}80%{opacity:1}100%{transform:translateY(30px);opacity:0}}
          @keyframes shieldPulse{0%,100%{filter:drop-shadow(0 0 4px #10B98160)}50%{filter:drop-shadow(0 0 12px #10B98199)}}
          @keyframes checkDraw{0%{stroke-dashoffset:30}100%{stroke-dashoffset:0}}
          .mm-shield{animation:shieldPulse 2s ease-in-out infinite}
          .mm-scan{animation:scanLine 2.5s ease-in-out infinite;clip-path:url(#shieldClip)}
          .mm-check{animation:checkDraw 0.8s ease-out 0.5s both;stroke-dasharray:30}
        `}</style>
      </defs>
      <defs>
        <clipPath id="shieldClip">
          <path d="M50 12 L82 26 L82 52 Q82 72 50 88 Q18 72 18 52 L18 26 Z" />
        </clipPath>
      </defs>
      <g className="mm-shield">
        <path d="M50 12 L82 26 L82 52 Q82 72 50 88 Q18 72 18 52 L18 26 Z" fill="url(#shieldGrad)" opacity=".15" />
        <path d="M50 12 L82 26 L82 52 Q82 72 50 88 Q18 72 18 52 L18 26 Z" fill="url(#shieldGrad)" stroke="#10B981" strokeWidth="2.5" />
      </g>
      <line className="mm-scan" x1="20" y1="50" x2="80" y2="50" stroke="#6EE7B7" strokeWidth="2" opacity=".8" />
      <polyline className="mm-check" points="35,50 46,62 65,40" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function WalletSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <style>{`
          @keyframes walletOpen{0%,100%{transform:rotateX(0deg)}40%{transform:rotateX(-12deg)}70%{transform:rotateX(-6deg)}}
          @keyframes noteBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
          .mm-wallet{animation:walletOpen 3s ease-in-out infinite;transform-origin:50px 55px}
          .mm-note{animation:noteBounce 2s ease-in-out .3s infinite}
        `}</style>
      </defs>
      <g className="mm-wallet">
        {/* Wallet body */}
        <rect x="15" y="40" width="70" height="45" rx="8" fill="#1D4ED8" />
        <rect x="15" y="40" width="70" height="16" rx="8" fill="#2563EB" />
        {/* Coin pocket */}
        <rect x="55" y="52" width="24" height="22" rx="6" fill="#1E3A8A" />
        <circle cx="67" cy="63" r="7" fill="#F59E0B" />
        <text x="67" y="67" textAnchor="middle" fontSize="9" fill="#7C2D12" fontWeight="bold">₹</text>
        {/* Cards peeping out */}
        <rect x="22" y="52" width="26" height="16" rx="4" fill="#3B82F6" opacity=".7" />
        <rect x="24" y="54" width="22" height="2" rx="1" fill="#93C5FD" opacity=".6" />
      </g>
      {/* Money note */}
      <g className="mm-note">
        <rect x="28" y="28" width="44" height="18" rx="4" fill="#10B981" />
        <rect x="31" y="31" width="38" height="12" rx="2" fill="#059669" opacity=".4" />
        <text x="50" y="42" textAnchor="middle" fontSize="11" fill="#D1FAE5" fontWeight="bold">₹500</text>
      </g>
    </svg>
  );
}

export function PhoneUpiSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <style>{`
          @keyframes upiScan{0%{r:8;opacity:.9}100%{r:32;opacity:0}}
          @keyframes phoneTilt{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
          @keyframes upiCheck{0%,60%{opacity:0}80%,100%{opacity:1}}
          .mm-phone{animation:phoneTilt 3s ease-in-out infinite;transform-origin:50px 55px}
          .mm-scan-ring{animation:upiScan 1.8s ease-out infinite}
          .mm-scan-ring2{animation:upiScan 1.8s ease-out .6s infinite}
          .mm-upi-check{animation:upiCheck 1.8s ease-out infinite}
        `}</style>
      </defs>
      <g className="mm-phone">
        <rect x="30" y="15" width="40" height="70" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="2" />
        <rect x="34" y="22" width="32" height="50" rx="4" fill="#0F172A" />
        {/* Screen content */}
        <rect x="37" y="26" width="26" height="8" rx="2" fill="#3B82F6" opacity=".7" />
        <text x="50" y="33" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="bold">UPI PAY</text>
        {/* QR area */}
        {[0,1,2,3].map(row => [0,1,2,3].map(col => (
          <rect key={`${row}-${col}`} x={39 + col*6} y={38 + row*6} width="4" height="4" rx=".5"
            fill={(row + col) % 3 === 0 ? "#3B82F6" : (row === 0 && col === 0) || (row === 0 && col === 3) || (row === 3 && col === 0) ? "#3B82F6" : "#334155"}
          />
        )))}
        {/* Home button */}
        <circle cx="50" cy="79" r="3" fill="#334155" />
      </g>
      {/* Scan rings */}
      <circle className="mm-scan-ring" cx="50" cy="50" r="8" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <circle className="mm-scan-ring2" cx="50" cy="50" r="8" stroke="#10B981" strokeWidth="1.5" fill="none" />
      {/* Check */}
      <g className="mm-upi-check">
        <circle cx="72" cy="28" r="10" fill="#10B981" />
        <polyline points="67,28 71,32 77,24" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}

export function BankBuildingSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <style>{`
          @keyframes bankGlow{0%,100%{filter:drop-shadow(0 0 3px #3B82F660)}50%{filter:drop-shadow(0 0 10px #3B82F699)}}
          @keyframes doorOpen{0%,60%,100%{transform:scaleX(1)}75%{transform:scaleX(.4);transform-origin:44px 80px}}
          .mm-bank{animation:bankGlow 3s ease-in-out infinite}
          .mm-door{animation:doorOpen 4s ease-in-out infinite;transform-origin:44px 80px}
        `}</style>
      </defs>
      <g className="mm-bank">
        {/* Roof / pediment */}
        <polygon points="10,38 50,12 90,38" fill="#1D4ED8" />
        <polygon points="16,38 50,16 84,38" fill="#2563EB" />
        {/* Columns */}
        {[22,34,46,58,70].map((x, i) => (
          <rect key={i} x={x} y="38" width="6" height="38" rx="3" fill="#3B82F6" opacity=".8" />
        ))}
        {/* Base */}
        <rect x="10" y="38" width="80" height="8" rx="2" fill="#1D4ED8" />
        <rect x="8" y="76" width="84" height="8" rx="2" fill="#1E3A8A" />
        <rect x="6" y="84" width="88" height="6" rx="2" fill="#1D4ED8" />
        {/* Door */}
        <g className="mm-door">
          <rect x="40" y="58" width="20" height="26" rx="3" fill="#0F172A" />
          <rect x="42" y="60" width="16" height="22" rx="2" fill="#1E3A8A" />
          <circle cx="57" cy="71" r="1.5" fill="#F59E0B" />
        </g>
        {/* Windows */}
        <rect x="18" y="48" width="12" height="10" rx="2" fill="#BFDBFE" opacity=".7" />
        <rect x="70" y="48" width="12" height="10" rx="2" fill="#BFDBFE" opacity=".7" />
        {/* ₹ on pediment */}
        <text x="50" y="32" textAnchor="middle" fontSize="12" fill="#FDE68A" fontWeight="bold">₹</text>
      </g>
    </svg>
  );
}

export function PassbookSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <style>{`
          @keyframes pageFlip{0%,70%,100%{transform:rotateY(0deg)}35%{transform:rotateY(-20deg)}}
          @keyframes lineWrite{0%{width:0}100%{width:28px}}
          .mm-book{animation:pageFlip 4s ease-in-out infinite;transform-origin:50px 55px}
          .mm-line1,.mm-line2,.mm-line3{animation:lineWrite 1s ease-out infinite}
          .mm-line2{animation-delay:.3s}
          .mm-line3{animation-delay:.6s}
        `}</style>
      </defs>
      <g className="mm-book">
        {/* Back cover */}
        <rect x="22" y="22" width="58" height="62" rx="6" fill="#065F46" />
        {/* Spine */}
        <rect x="22" y="22" width="10" height="62" rx="4" fill="#064E3B" />
        {/* Front page */}
        <rect x="28" y="25" width="50" height="56" rx="4" fill="#F0FDF4" />
        {/* Lines on page */}
        <rect className="mm-line1" x="34" y="38" height="3" rx="1.5" fill="#059669" opacity=".6" style={{ width: 28 }} />
        <rect className="mm-line2" x="34" y="46" height="3" rx="1.5" fill="#059669" opacity=".6" style={{ width: 28 }} />
        <rect className="mm-line3" x="34" y="54" height="3" rx="1.5" fill="#059669" opacity=".6" style={{ width: 28 }} />
        <rect x="34" y="62" width="22" height="3" rx="1.5" fill="#059669" opacity=".4" />
        <rect x="34" y="70" width="16" height="3" rx="1.5" fill="#059669" opacity=".3" />
        {/* Passbook label */}
        <rect x="32" y="28" width="42" height="8" rx="3" fill="#10B981" />
        <text x="53" y="35" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="bold">PASSBOOK</text>
        {/* Bookmark */}
        <rect x="71" y="22" width="5" height="18" rx="1" fill="#F59E0B" />
        <polygon points="71,40 76,40 73.5,45" fill="#F59E0B" />
      </g>
    </svg>
  );
}

export function PencilSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <style>{`
          @keyframes pencilWrite{0%{transform:translate(0,0) rotate(-35deg)}25%{transform:translate(6px,2px) rotate(-35deg)}50%{transform:translate(10px,0px) rotate(-35deg)}75%{transform:translate(6px,-2px) rotate(-35deg)}100%{transform:translate(0,0) rotate(-35deg)}}
          @keyframes trailFade{0%{opacity:0}30%{opacity:.6}100%{opacity:0}}
          .mm-pencil{animation:pencilWrite 2s ease-in-out infinite;transform-origin:50px 50px}
          .mm-trail{animation:trailFade 2s ease-in-out infinite}
        `}</style>
      </defs>
      <g className="mm-pencil">
        {/* Pencil body */}
        <rect x="30" y="20" width="14" height="58" rx="3" fill="#FCD34D" transform="rotate(-35 50 50)" />
        <rect x="32" y="22" width="10" height="8" rx="2" fill="#F87171" transform="rotate(-35 50 50)" />
        {/* Tip */}
        <polygon points="30,78 44,78 37,90" fill="#D4A017" transform="rotate(-35 50 50)" />
        <polygon points="35,82 39,82 37,90" fill="#1E293B" transform="rotate(-35 50 50)" />
        {/* Lines on pencil */}
        <line x1="32" y1="36" x2="44" y2="36" stroke="#F59E0B" strokeWidth="1" opacity=".5" transform="rotate(-35 50 50)" />
        <line x1="32" y1="42" x2="44" y2="42" stroke="#F59E0B" strokeWidth="1" opacity=".5" transform="rotate(-35 50 50)" />
        {/* Eraser */}
        <rect x="32" y="22" width="10" height="8" rx="2" fill="#FCA5A5" transform="rotate(-35 50 50)" />
        <rect x="32" y="28" width="10" height="2" fill="#D97706" transform="rotate(-35 50 50)" />
      </g>
      {/* Writing trail */}
      <path className="mm-trail" d="M30 72 Q45 68 60 72 Q72 76 80 70" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4,3" />
    </svg>
  );
}

export function CricketBatSVG({ size = 90 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <style>{`
          @keyframes batSwing{0%{transform:rotate(-20deg)}50%{transform:rotate(15deg)}100%{transform:rotate(-20deg)}}
          @keyframes ballBounce{0%,100%{transform:translate(0,0)}30%{transform:translate(18px,-20px)}60%{transform:translate(36px,0)}}
          .mm-bat{animation:batSwing 2s ease-in-out infinite;transform-origin:55px 75px}
          .mm-ball{animation:ballBounce 2s ease-in-out infinite}
        `}</style>
      </defs>
      <g className="mm-bat">
        {/* Bat blade */}
        <rect x="42" y="18" width="20" height="55" rx="10" fill="#D97706" />
        <rect x="46" y="22" width="12" height="44" rx="6" fill="#F59E0B" opacity=".5" />
        {/* Handle */}
        <rect x="47" y="73" width="10" height="14" rx="5" fill="#92400E" />
        <rect x="49" y="74" width="6" height="12" rx="3" fill="#D4A017" opacity=".5" />
        {/* Grip */}
        {[75,79,83].map((y, i) => (
          <rect key={i} x="47" y={y} width="10" height="2" rx="1" fill="#7C2D12" opacity=".6" />
        ))}
      </g>
      {/* Ball */}
      <g className="mm-ball">
        <circle cx="25" cy="45" r="9" fill="#EF4444" />
        <circle cx="25" cy="45" r="7" fill="none" stroke="#B91C1C" strokeWidth="1.5" />
        <path d="M19 42 Q25 38 31 42" stroke="#9F1239" strokeWidth="1" fill="none" />
        <path d="M19 48 Q25 52 31 48" stroke="#9F1239" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

// ─── Board type → illustration map ───────────────────────────────────────────

export function getBoardIllustration(boardType: string, headline?: string, emoji?: string): JSX.Element | null {
  const h = (headline ?? "").toLowerCase();
  const e = emoji ?? "";

  if (boardType === "intro_card" || boardType === "mission_card") {
    if (h.includes("cricket") || h.includes("bat")) return <CricketBatSVG />;
    if (h.includes("piggy") || h.includes("saving") || h.includes("goal")) return <PiggyBankSVG />;
    if (h.includes("bank") || h.includes("atm")) return <BankBuildingSVG />;
    if (h.includes("upi") || h.includes("phone") || h.includes("digital")) return <PhoneUpiSVG />;
    if (h.includes("budget") || h.includes("wallet") || h.includes("money manager")) return <WalletSVG />;
    if (h.includes("salary") || h.includes("passbook") || h.includes("diary")) return <PassbookSVG />;
    return <RupeeCoinSVG />;
  }
  if (boardType === "concept_card") return <LightbulbSVG />;
  if (boardType === "worked_example") return <ChartGrowthSVG />;
  if (boardType === "practice_board") return <PencilSVG />;
  if (boardType === "recap_summary") return <TrophySVG />;
  if (boardType === "budget_planner") return <PiggyBankSVG />;
  if (boardType === "scam_detector") return <ShieldSVG />;
  if (boardType === "upi_simulator") return <PhoneUpiSVG />;
  if (boardType === "atm_simulator" || boardType === "bank_simulator") return <BankBuildingSVG />;
  if (boardType === "pocket_money_planner") return <WalletSVG />;
  if (boardType === "passbook_viewer") return <PassbookSVG />;
  if (boardType === "shopping_simulation") return <WalletSVG />;
  return <RupeeCoinSVG />;
}
